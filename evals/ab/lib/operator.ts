// The setup operator's answer table: maps one popup question to a frozen answers-file entry, verbatim, or says STOP.
// Pure: it reads nothing; the caller passes the two answers files' text. Never guesses: no match, or more than one, is a stop.
export type Rule = { match: RegExp; answer: string; source: string };
export type Question = { question: string; header: string };
export type Files = { repo: string; operator: string };
export type Answer = { answer: string; source: string } | { stop: string };

type Topic = { name: string; re: RegExp; not?: RegExp; file: keyof Files; heading: string };
const TOPICS: Topic[] = [
  { name: "stack", re: /\bstack\b/i, file: "operator", heading: "Stack" },
  { name: "conventions", re: /convention/i, file: "operator", heading: "Conventions in use" },
  { name: "business goal", re: /business goal|(?<![\w-])goal\b/i, not: /milestone|proof/i, file: "repo", heading: "Business goal" },
  { name: "main flows", re: /main flows?|\bflows\b/i, not: /flow doc/i, file: "repo", heading: "Main flows" },
  { name: "invariants", re: /invariant/i, file: "repo", heading: "Invariants" },
  { name: "quality attributes", re: /quality attribute/i, file: "repo", heading: "Quality attributes" },
  { name: "non-goals", re: /non-?goals?/i, file: "repo", heading: "Non-goals" },
];

/** Setup-question keys: a `## Setup answers` bullet is a candidate when its label and the question both match the same key. */
const SETUP_KEYS: RegExp[] = [/\btiers?\b/i, /licen[sc]e/i, /milestone/i, /integration boundar/i, /flow doc|business-flow/i, /\bteam\b/i, /security (reporting )?contact|security report/i, /owner role/i, /deploy/i, /unrecogni[sz]ed doc/i];
const LABEL_STOP = new Set(["first", "that", "where", "belongs", "decided", "with", "from", "this"]);

/** The body of `## heading` (up to the next `## `), trimmed; undefined when the section is absent. */
export function section(md: string, heading: string): string | undefined {
  const lines = md.split(/\r?\n/);
  const start = lines.findIndex((l) => l.trim().toLowerCase() === `## ${heading}`.toLowerCase());
  if (start < 0) return undefined;
  const end = lines.findIndex((l, i) => i > start && /^## /.test(l));
  return lines.slice(start + 1, end < 0 ? undefined : end).join("\n").trim();
}

type Bullet = { label: string; text: string };
function setupBullets(operator: string): Bullet[] {
  const body = section(operator, "Setup answers");
  if (!body) return [];
  const out: { label: string; lines: string[] }[] = [];
  for (const line of body.split("\n")) {
    const m = /^- ([^:]+):(.*)$/.exec(line);
    if (m) out.push({ label: m[1]!.trim(), lines: [m[2]!] });
    else if (/^- /.test(line) || !line.trim()) out.push({ label: "", lines: [] }); // an unlabelled bullet or a blank ends the previous one
    else out[out.length - 1]?.lines.push(line);
  }
  return out.filter((b) => b.label).map((b) => ({ label: b.label, text: b.lines.join("\n").trim() }));
}

const words = (s: string) => s.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length >= 4 && !LABEL_STOP.has(w));

export function answerFor(q: Question, files: Files, rules: Rule[]): Answer {
  const text = `${q.header} ${q.question}`;
  for (const r of rules) {
    r.match.lastIndex = 0;
    if (r.match.test(text)) return { answer: r.answer, source: r.source };
  }
  const named = `question "${q.question}" (header "${q.header}")`;
  type Hit = { name: string; answer?: string; source: string; missing?: string };
  const hits: Hit[] = [];
  for (const t of TOPICS) {
    if (!t.re.test(text) || t.not?.test(text)) continue;
    const body = section(files[t.file], t.heading);
    hits.push(body === undefined ? { name: t.name, source: "", missing: `## ${t.heading} in the ${t.file} answers file` } : { name: t.name, answer: body, source: `${t.file} § ${t.heading}` });
  }
  const keys = SETUP_KEYS.filter((k) => k.test(text));
  if (keys.length > 0) {
    const cands = setupBullets(files.operator).filter((b) => keys.some((k) => k.test(b.label)));
    const qw = new Set(words(text));
    const score = (b: Bullet) => words(b.label).filter((w) => qw.has(w) || [...qw].some((x) => x.startsWith(w.slice(0, 5)))).length;
    const best = Math.max(0, ...cands.map(score));
    for (const b of cands.filter((c) => score(c) === best)) hits.push({ name: `setup answer "${b.label}"`, answer: b.text, source: `operator § Setup answers / ${b.label}` });
  }
  if (hits.length === 0) return { stop: `no answers-file entry matches ${named}` };
  if (hits.length > 1) return { stop: `${named} matches several entries (${hits.map((h) => h.name).join("; ")}); the operator never guesses` };
  const h = hits[0]!;
  if (h.missing || h.answer === undefined || h.answer === "") return { stop: `${named} maps to ${h.missing ?? h.name}, which is absent or empty` };
  return { answer: h.answer, source: h.source };
}

/** Run rules from JSON: `[{"match": "<regex source>", "answer": "...", "source": "..."}]`; matched case-insensitively. */
export function parseRules(json: string): Rule[] {
  const raw = JSON.parse(json) as { match: string; answer: string; source: string }[];
  return raw.map((r) => {
    if (typeof r.match !== "string" || typeof r.answer !== "string" || typeof r.source !== "string") throw new Error("a rule needs string match, answer and source");
    return { match: new RegExp(r.match, "i"), answer: r.answer, source: r.source };
  });
}
