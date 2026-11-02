// The setup operator's classifier: a model CHOOSES which frozen entry answers a popup question; it never writes an answer.
// The answer text sent is always the chosen entry's text verbatim (or a fixed ruling text). Anything unclear is a stop: never a guess.
import { section, setupBullets, type Files } from "./operator.ts";

export type Entry = { id: string; kind: "repo" | "operator" | "setup" | "ruling" | "none"; label: string; text: string };
export type Ruling = { id: string; text: string };
export type PopupQuestion = { question: string; header: string; options?: unknown[] };
export type Decision = { id: string; reason: string; entry: Entry; answer: string } | { stop: string };
/** Takes the full prompt, returns the model's raw text; throws on failure (the caller turns that into a stop). */
export type Call = (prompt: string) => Promise<string>;
export type Answerer = (q: PopupQuestion) => Promise<Decision>;

/** The fixed rulings for a migrate arm (owner rulings, SPRINT-154). */
export const PLAN_RULING: Ruling = { id: "PLAN", text: "Profile pass only: apply only the items that add ## Stack, ## Conventions in use and the five business topics (business goal, main flows, invariants, quality attributes, non-goals). Decline every other item, including archiving, moving, renaming or slimming any existing file." };
export const CLEANUP_RULING: Ruling = { id: "CLEANUP", text: "Leave untouched: do not edit, archive, move, rename or slim this existing file." };
export const UNDECIDED_RULING: Ruling = { id: "UNDECIDED", text: "Not decided yet (owner, migrate)" };
export const DATES_RULING: Ruling = { id: "DATES", text: "Yes: update last_updated to today on the files that get a new section, and on no other file." };
const RULING_LABELS: Record<string, string> = {
  PLAN: "a question asking which parts of a migrate plan to apply, or whether to apply it",
  CLEANUP: "a question asking whether to change, slim, reshape, consolidate, archive, move or rename something that ALREADY EXISTS (not a last_updated date; see DATES)",
  DATES: "a question asking whether to update the last_updated date of files that get a new section",
  UNDECIDED: "a coding-convention question (how code is written or organised) that the operator:conventions entry does NOT settle; if that entry settles it, pick operator:conventions instead",
  CONTINUE: "a question asking whether to continue when docs already exist",
};
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const PROFILE: [string, keyof Files, string, string][] = [
  ["repo:business-goal", "repo", "Business goal", "the business goal of the product"],
  ["repo:main-flows", "repo", "Main flows", "the main flows"],
  ["repo:invariants", "repo", "Invariants", "the invariants"],
  ["repo:quality-attributes", "repo", "Quality attributes", "the quality attributes (performance, availability, scalability, reliability targets)"],
  ["repo:non-goals", "repo", "Non-goals", "the non-goals"],
  ["operator:stack", "operator", "Stack", "the technology stack"],
  ["operator:conventions", "operator", "Conventions in use", "the conventions in use"],
];

export function buildCatalog(files: Files, rulings: Ruling[] = []): Entry[] {
  const out: Entry[] = [];
  for (const [id, file, heading, label] of PROFILE) {
    const text = section(files[file], heading);
    if (text) out.push({ id, kind: file, label, text });
  }
  for (const b of setupBullets(files.operator)) out.push({ id: `setup:${slug(b.label)}`, kind: "setup", label: `setup answer: ${b.label}`, text: b.text });
  for (const r of rulings) out.push({ id: r.id, kind: "ruling", label: RULING_LABELS[r.id] ?? `ruling ${r.id}`, text: r.text });
  out.push({ id: "NONE", kind: "none", label: "no entry answers the question, or you are unsure", text: "" });
  return out;
}

export function buildPrompt(q: PopupQuestion, catalog: Entry[]): string {
  const opts = (q.options ?? []).map((o) => (typeof o === "string" ? o : String((o as { label?: unknown })?.label ?? JSON.stringify(o)))).filter(Boolean);
  const cat = catalog.map((e) => `- id: ${e.id}\n  label: ${e.label}${e.text ? `\n  text: ${e.text.slice(0, 300).replace(/\n/g, " / ")}` : ""}`).join("\n");
  return `You route one popup question, asked by a documentation tool, to the ONE frozen answer entry that answers it. You never write an answer; you only choose an id.

POPUP
header: ${q.header}
question: ${q.question}
options: ${opts.length ? opts.join(" | ") : "(none)"}

CATALOG
${cat}

RULES
- Choose the ONE entry whose text answers what the question asks.
- A question asking for the content of a profile topic picks that topic's entry even if it names the file the content goes into (a Performance, Availability or Scalability target picks repo:quality-attributes; a Go timeout or Vue folder-layout convention picks operator:conventions ONLY if that entry's text actually addresses it).
- PLAN only for a question asking which parts of a migrate plan to apply, or whether to apply it.
- CLEANUP for a question asking whether to change, slim, reshape, consolidate, archive, move or rename something that ALREADY EXISTS.
- NONE when no entry answers it, or you are unsure.

Reply with exactly one line of JSON and nothing else: {"id": "<an id from the catalog>", "reason": "<one short sentence>"}`;
}

/** The model's whole reply as one JSON value (fences stripped); undefined otherwise. Strict: text around the JSON is not mined for an object. */
function parseJson(raw: string): unknown {
  try {
    return JSON.parse(raw.trim().replace(/^```(?:json)?\s*|\s*```$/g, "").trim());
  } catch {
    return undefined;
  }
}

/** Parse the model's reply: one JSON object with a string id. undefined when it is not that. */
function parseReply(raw: string): { id: string; reason: string } | undefined {
  const r = parseJson(raw) as { id?: unknown; reason?: unknown } | undefined;
  return typeof r?.id === "string" ? { id: r.id, reason: typeof r.reason === "string" ? r.reason : "" } : undefined;
}

export async function classify(q: PopupQuestion, catalog: Entry[], call: Call): Promise<Decision> {
  const named = `question "${q.question}" (header "${q.header}")`;
  let raw: string;
  try {
    raw = await call(buildPrompt(q, catalog));
  } catch (e) {
    return { stop: `classifier call failed for ${named}: ${(e as Error).message}` };
  }
  const r = parseReply(raw);
  if (!r) return { stop: `classifier output for ${named} is not one JSON object with an id: ${raw.slice(0, 200)}` };
  const entry = catalog.find((e) => e.id === r.id);
  if (!entry) return { stop: `classifier chose "${r.id}", which is not in the catalog, for ${named}` };
  if (entry.kind === "none") return { stop: `classifier found no entry for ${named}: ${r.reason}` };
  return { id: entry.id, reason: r.reason, entry, answer: entry.text };
}

export const makeAnswerer = (catalog: Entry[], call: Call): Answerer => (q) => classify(q, catalog, call);

// ---- chat messages: a turn that ends in prose may ask several decisions at once; the model labels each part and chooses its entry ----
export type ChatPart = { part: string; id: string; reason: string; answer: string };
export type ChatDecision = { parts: ChatPart[]; reply: string } | { stop: string };
export type ChatAnswerer = (text: string) => Promise<ChatDecision>;

/** The closing text sent to the classifier: up to 12000 chars whole; longer keeps its first 4000 and last 8000. */
export function capChat(text: string): string {
  return text.length <= 12000 ? text : text.slice(0, 4000) + "\n[...]\n" + text.slice(-8000);
}

export function buildChatPrompt(text: string, catalog: Entry[]): string {
  const cat = catalog.map((e) => `- id: ${e.id}\n  label: ${e.label}${e.text ? `\n  text: ${e.text.slice(0, 300).replace(/\n/g, " / ")}` : ""}`).join("\n");
  return `A documentation tool ended its turn with a chat message that asks the user for decisions. Route EVERY decision it asks for to the ONE frozen answer entry that answers it. You never write an answer; you only label each decision with the request's own wording and choose an id.

CHAT MESSAGE
${text}

CATALOG
${cat}

RULES
- Cover every decision the message asks for (for example the parts a closing line like "reply with your choices, e.g. A yes, B1+B2, C archive, team 1, date ok" names). Give each one its own part, labelled exactly as the request labels it (A, B, C, team, date). A message with a single decision has a single part.
- For each part choose the ONE entry whose text answers that decision.
- A question asking for the content of a profile topic picks that topic's entry even if it names the file the content goes into.
- PLAN only for a decision on which parts of a migrate plan to apply; CLEANUP for a decision on changing, slimming, consolidating, archiving, moving or renaming something that ALREADY EXISTS; DATES for updating last_updated dates, when it is in the catalog.
- If a requested decision has no entry, or you are unsure, give it a part with id NONE. Do not leave any requested decision out.

Reply with exactly one line of JSON and nothing else: {"parts": [{"part": "<the request's label>", "id": "<an id from the catalog>", "reason": "<one short sentence>"}]}`;
}

export async function classifyChat(text: string, catalog: Entry[], call: Call): Promise<ChatDecision> {
  const shown = capChat(text.trim());
  const named = `chat message "${shown.slice(0, 80).replace(/\s+/g, " ")}..."`;
  let raw: string;
  try {
    raw = await call(buildChatPrompt(shown, catalog));
  } catch (e) {
    return { stop: `classifier call failed for ${named}: ${(e as Error).message}` };
  }
  const raws = (parseJson(raw) as { parts?: unknown } | undefined)?.parts;
  if (!Array.isArray(raws) || raws.length === 0) return { stop: `classifier output for ${named} is not {"parts": [...]} with at least one part: ${raw.slice(0, 200)}` };
  const parts: ChatPart[] = [];
  for (const p of raws as { part?: unknown; id?: unknown; reason?: unknown }[]) {
    if (typeof p?.part !== "string" || !p.part.trim() || typeof p.id !== "string") return { stop: `classifier part without a label and id for ${named}: ${JSON.stringify(p).slice(0, 120)}` };
    const part = p.part.trim();
    // the label goes back to the session, so it must be the message's own words: one short line found verbatim in it
    if (part.length > 80 || /[\r\n]/.test(part) || !shown.toLowerCase().includes(part.toLowerCase())) return { stop: `classifier label "${part.slice(0, 80)}" is not a short line of the message's own words, for ${named}` };
    if (parts.some((x) => x.part === part)) return { stop: `classifier gave part "${part}" twice for ${named}` };
    const entry = catalog.find((e) => e.id === p.id);
    if (!entry) return { stop: `classifier chose "${p.id}", which is not in the catalog, for part "${part}" of ${named}` };
    if (entry.kind === "none") return { stop: `classifier found no entry for part "${part}" of ${named}: ${typeof p.reason === "string" ? p.reason : ""}` };
    parts.push({ part, id: entry.id, reason: typeof p.reason === "string" ? p.reason : "", answer: entry.text });
  }
  return { parts, reply: parts.length === 1 ? parts[0]!.answer : parts.map((p) => `${p.part}: ${p.answer}`).join("\n") };
}

export const makeChatAnswerer = (catalog: Entry[], call: Call): ChatAnswerer => (text) => classifyChat(text, catalog, call);

/** `--ruling ID=text` values -> rulings; refuses a malformed or reserved id. */
export function parseRulingArgs(args: string[]): Ruling[] {
  return args.map((a) => {
    const m = /^([A-Z][A-Z0-9_]*)=([\s\S]+)$/.exec(a);
    if (!m || m[1] === "NONE") throw new Error(`--ruling needs <ID>=<text> with an upper-case id other than NONE, got "${a.slice(0, 40)}"`);
    return { id: m[1]!, text: m[2]! };
  });
}

export const CLASSIFIER_MODEL = "claude-sonnet-5-5";
/** The real model call: `claude -p` on the classifier model with no tools, prompt on stdin, inside the session's isolated config env.
 *  `AB_CLASSIFIER_CLI` (a JSON array) replaces `claude` for tests. Timeout 120 s. */
export function modelCall(env: Record<string, string>, timeoutMs = 120_000): Call {
  return async (prompt) => {
    const prefix: string[] = process.env.AB_CLASSIFIER_CLI ? JSON.parse(process.env.AB_CLASSIFIER_CLI) : ["claude"];
    const proc = Bun.spawn([...prefix, "-p", "--model", CLASSIFIER_MODEL, "--output-format", "json", "--max-turns", "1", "--tools", ""], { ...(env.HOME !== undefined ? { cwd: env.HOME } : {}), env, stdin: "pipe", stdout: "pipe", stderr: "pipe" });
    let timedOut = false;
    const timer = setTimeout(() => ((timedOut = true), proc.kill()), timeoutMs);
    proc.stdin.write(prompt);
    await proc.stdin.end();
    const [out, err, code] = await Promise.all([new Response(proc.stdout).text(), new Response(proc.stderr).text(), proc.exited]);
    clearTimeout(timer);
    if (timedOut) throw new Error(`timed out after ${timeoutMs} ms`);
    let j: { result?: unknown; is_error?: boolean };
    try {
      j = JSON.parse(out);
    } catch {
      throw new Error(`exit ${code}, unparsable CLI output: ${(out || err).slice(0, 200)}`);
    }
    if (code !== 0 || j.is_error || typeof j.result !== "string") throw new Error(`exit ${code}, ${j.is_error ? "is_error" : "no result"}: ${String(j.result ?? err).slice(0, 200)}`);
    return j.result;
  };
}
