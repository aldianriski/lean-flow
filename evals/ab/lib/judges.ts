// Blind per-dimension judges (TASK-543): convention adherence, business correctness, scope discipline. Each is ONE isolated
// call to the pinned JUDGE_MODEL whose prompt carries only the task, the diff the trial produced and, for business
// correctness, the project's business facts -- never the arm id, plugin, model or any lean-flow material.
// A reply that is not one clean PASS | FAIL | UNKNOWN verdict is UNKNOWN. Judge usage is overhead, never execution tokens.
import { createHash } from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import type { Arm } from "./arm.ts";
import type { Task } from "./grade.ts";
import { JUDGE_MODEL, type Judge } from "./protocol.ts";
import type { JudgeOut, JudgeVerdict } from "./record.ts";

export const DIMENSIONS = ["convention", "business", "scope"] as const;
export type Dimension = (typeof DIMENSIONS)[number];
/** A file as it reads AFTER the change, given to the judges as context only. */
export type ContextFile = { path: string; content: string };
export type JudgeInput = { task: Pick<Task, "prompt" | "layers" | "outOfScope">; diff: string; notes?: string | undefined; files?: ContextFile[] | undefined };

export const CONTEXT_MAX_LINES = 600;
export const CONTEXT_MAX_BYTES = 60_000;
const ARMS_DIR = path.join(import.meta.dir, "..", "arms");

/** Repo-relative paths of the lean-flow docs an arm adds (evals/ab/arms/<repo>-lf-docs.txt); none for an arm with no such list. */
export function lfDocsOf(armId: string, armsDir = ARMS_DIR): Set<string> {
  const f = path.join(armsDir, `${armId.replace(/-.*$/, "")}-lf-docs.txt`); // the repo is the arm id's first segment, whatever the arm
  return new Set(fs.existsSync(f) ? fs.readFileSync(f, "utf8").split(/\r?\n/).map((l) => l.trim().replaceAll("\\", "/")).filter(Boolean) : []);
}

/** Files a unified diff writes to (new-side paths; deletions have none). */
export function diffPaths(diff: string): string[] {
  return [...new Set([...diff.matchAll(/^\+\+\+ b\/(.+?)\s*$/gm)].map((m) => m[1]!))];
}

/**
 * Pack file contents as judge context: lean-flow docs and binary files left out, each file cut at CONTEXT_MAX_LINES, the whole
 * context at CONTEXT_MAX_BYTES (a file that would cross the cap is cut there and the rest dropped), every cut marked.
 */
export function packContext(files: ContextFile[], excluded: Set<string>): ContextFile[] {
  const out: ContextFile[] = [];
  let bytes = 0;
  for (const f of files) {
    if (excluded.has(f.path) || f.content.includes("\u0000")) continue;
    const lines = f.content.split("\n");
    let text = f.content;
    if (lines.length > CONTEXT_MAX_LINES) text = `${lines.slice(0, CONTEXT_MAX_LINES).join("\n")}\n[cut at ${CONTEXT_MAX_LINES} lines]`;
    const room = CONTEXT_MAX_BYTES - bytes;
    if (room <= 0) break;
    if (Buffer.byteLength(text) > room) text = `${text.slice(0, room)}\n[context cut at ${CONTEXT_MAX_BYTES} bytes]`;
    out.push({ path: f.path, content: text });
    bytes += Buffer.byteLength(text);
  }
  return out;
}

/** Context from a tree: each touched path that exists there, as it reads now (a trial dir after the run). */
export function contextFromTree(root: string, paths: string[], excluded: Set<string>): ContextFile[] {
  return packContext(paths.filter((p) => !p.split("/").includes("..") && fs.existsSync(path.join(root, p)) && fs.statSync(path.join(root, p)).isFile()).map((p) => ({ path: p, content: fs.readFileSync(path.join(root, p), "utf8") })), excluded);
}

/** Context from a snapshot plus a patch: the touched files with the patch applied, in a scratch copy (calibration). Empty when the patch does not apply. */
export function contextFromPatch(snapshot: string, patch: string, excluded: Set<string>): ContextFile[] {
  const paths = diffPaths(patch);
  const tmp = fs.mkdtempSync(path.join(fs.realpathSync.native(os.tmpdir()), "ab-ctx-"));
  try {
    for (const p of paths) {
      const src = path.join(snapshot, p);
      if (p.split("/").includes("..") || !fs.existsSync(src)) continue;
      fs.mkdirSync(path.dirname(path.join(tmp, p)), { recursive: true });
      fs.copyFileSync(src, path.join(tmp, p));
    }
    const patchFile = path.join(tmp, ".ab-context.patch");
    fs.writeFileSync(patchFile, patch);
    const r = Bun.spawnSync(["git", "-c", "core.autocrlf=false", "apply", "--whitespace=nowarn", "--ignore-whitespace", patchFile], { cwd: tmp });
    fs.rmSync(patchFile);
    return r.exitCode === 0 ? contextFromTree(tmp, paths, excluded) : [];
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}

const REPLY = `Reply with one JSON line only: {"verdict":"PASS"|"FAIL"|"UNKNOWN","reason":"<one sentence>"}. Use UNKNOWN when the material given is not enough to decide; do not guess.`;

const RUBRIC: Record<Dimension, string> = {
  convention: `Judge ONE dimension: convention adherence. Does the diff follow the conventions visible in the code it changes and in the code around its hunks -- naming, structure, layering, error handling, reuse of existing helpers instead of duplicating them? PASS when it fits the surrounding code; FAIL when it clearly departs from it or re-implements something the touched code already provides; UNKNOWN when the diff alone does not show enough of the surrounding code to tell.`,
  business: `Judge ONE dimension: business correctness. Does the diff make the software behave as the task asks AND as the BUSINESS FACTS below require? PASS when the behaviour it implements agrees with the task and every relevant fact; FAIL when it contradicts the task or a fact; where a fact names a locale, date or time format, time zone or unit, compare the exact value the code uses (a locale tag such as "en" is not "en-GB", and a neighbouring helper's different locale does not excuse it); UNKNOWN when the diff and facts do not settle it.`,
  scope: `Judge ONE dimension: scope discipline. Does the diff change only what the task asks, inside the allowed layers, and none of the OUT-OF-SCOPE behaviours? PASS when it stays inside; FAIL when it edits outside the layers, changes an out-of-scope behaviour, or adds unrequested changes; UNKNOWN when the diff does not show enough to tell.`,
};

/** Which dimension a built prompt is for (recorded replies are keyed by it). */
export const dimensionOf = (prompt: string): Dimension => DIMENSIONS.find((d) => prompt.includes(`Judge ONE dimension: ${{ convention: "convention adherence", business: "business correctness", scope: "scope discipline" }[d]}.`))!;

const section =(title: string, body: string) => `${title}\n<<<\n${body}\n>>>\n`;

/** The prompt text for one dimension. Business facts appear only in the business prompt. */
export function buildPrompt(dim: Dimension, i: JudgeInput): string {
  const parts = [`You are an isolated reviewer scoring a code change. ${RUBRIC[dim]}\n`, section("TASK", i.task.prompt), section("ALLOWED LAYERS", (i.task.layers ?? []).join("\n") || "(none declared)"), section("OUT OF SCOPE", (i.task.outOfScope ?? []).map((o) => `- ${o}`).join("\n") || "(none declared)")];
  if (dim === "business") parts.push(section("BUSINESS FACTS", i.notes?.trim() || "(none provided)"));
  parts.push(section("FILES AFTER THE CHANGE (context only: the surrounding code the diff sits in; judge the diff)", (i.files ?? []).map((f) => `=== ${f.path} ===\n${f.content}`).join("\n") || "(none provided)"));
  parts.push(section("DIFF", i.diff || "(empty diff)"), REPLY);
  return parts.join("\n");
}

const SENTINEL: JudgeInput = { task: { prompt: "<task>", layers: ["<layer>"], outOfScope: ["<out-of-scope>"] }, diff: "<diff>", notes: "<notes>", files: [{ path: "<path>", content: "<content>" }] };
const sha256 = (s: string) => createHash("sha256").update(s).digest("hex");
/** Hash of a dimension's prompt frame rendered over fixed sentinels: freezes rubric, framing and reply contract. */
export const promptHash = (dim: Dimension): string => sha256(buildPrompt(dim, SENTINEL));
export const LOCK_FILE = path.join(import.meta.dir, "..", "judges", "prompts.lock.json");
export const currentLock = () => ({ judgeModel: JUDGE_MODEL, prompts: Object.fromEntries(DIMENSIONS.map((d) => [d, promptHash(d)])) });
/** Dimensions whose prompt differs from the frozen lock (all of them when there is no lock). */
export function lockProblems(lockFile = LOCK_FILE): string[] {
  if (!fs.existsSync(lockFile)) return [`no prompt lock at ${lockFile}`];
  const lock = JSON.parse(fs.readFileSync(lockFile, "utf8")) as ReturnType<typeof currentLock>;
  const now = currentLock();
  const out = DIMENSIONS.filter((d) => lock.prompts?.[d] !== now.prompts[d]).map((d) => `prompt ${d} differs from the frozen lock`);
  if (lock.judgeModel !== now.judgeModel) out.push(`judge model ${now.judgeModel} differs from the lock's ${lock.judgeModel}`);
  return out;
}

/**
 * Terms that identify the treatment; a judge prompt must carry none of them. The arm id is kept whatever its length, and its
 * role suffix (workdoo-a1 -> "A1") is added in capitals: a diff saying "produced by A1" is a leak, a variable `a1` is not.
 */
export function blindTerms(arm: Arm): string[] {
  const t = [arm.id, arm.sessionModel, ...Object.values(arm.dispatch), "lean-flow", "lean flow", "leanflow"].filter((x) => x.length >= 3 || x === arm.id);
  const role = /(?:^|[-_])([a-z]\d+)$/i.exec(arm.id);
  if (role) t.push(role[1]!.toUpperCase());
  if (arm.plugin) t.push(arm.plugin.path);
  return [...new Set(t.filter((x) => x.length > 0))];
}
const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
/** Terms found in a prompt as whole tokens. Letter+digit terms in capitals (A0, A1) match case-sensitively, the rest case-insensitively. */
export function blindProblems(prompt: string, terms: string[]): string[] {
  return terms.filter((t) => new RegExp(`(?<![A-Za-z0-9])${esc(t)}(?![A-Za-z0-9])`, /^[A-Z]\d+$/.test(t) ? "" : "i").test(prompt)).map((t) => `judge-prompt-leak: prompt carries "${t}"`);
}

/** One clean verdict, else UNKNOWN. */
export function parseVerdict(text: string): JudgeOut {
  try {
    const body = text.trim().replace(/^```(?:json)?[ \t]*\r?\n([\s\S]*?)\r?\n?```$/, "$1").trim();
    const j = JSON.parse(body);
    if (j === null || typeof j !== "object" || Array.isArray(j)) return { verdict: "UNKNOWN", reason: "reply is not one JSON object" };
    const v = String(j.verdict ?? "").toUpperCase();
    if (v === "PASS" || v === "FAIL" || v === "UNKNOWN") return { verdict: v as JudgeVerdict, reason: String(j.reason ?? "") };
    return { verdict: "UNKNOWN", reason: `unrecognised verdict ${JSON.stringify(j.verdict)}` };
  } catch (e) {
    return { verdict: "UNKNOWN", reason: `unparseable reply: ${(e as Error).message}` };
  }
}

export type JudgeUsage = { input: number; output: number; cacheRead: number; cacheWrite: number; costUsd: number };
export type Judged = { judges: Record<Dimension, JudgeOut>; overhead: JudgeUsage; prompts: Record<Dimension, string>; failed: string[] };

/** Three isolated calls. A prompt that fails the blind check is never sent (UNKNOWN); a wrong judge model or missing usage is UNKNOWN. */
export async function runJudges(input: JudgeInput, judge: Judge, blind: string[] = []): Promise<Judged> {
  const overhead: JudgeUsage = { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, costUsd: 0 };
  const judges = {} as Record<Dimension, JudgeOut>;
  const prompts = {} as Record<Dimension, string>;
  const failed: string[] = [];
  const ctxLeak = (input.files ?? []).flatMap((f) => blindProblems(`${f.path}\n${f.content}`, blind).map((x) => `judge-context-leak: ${f.path}: ${x.replace("judge-prompt-leak: ", "")}`));
  for (const dim of DIMENSIONS) {
    const prompt = (prompts[dim] = buildPrompt(dim, input));
    const leak = [...ctxLeak, ...blindProblems(prompt, blind)];
    if (leak.length > 0) {
      judges[dim] = { verdict: "UNKNOWN", reason: `blind-breach, not sent: ${leak.join("; ")}` };
      continue;
    }
    try {
      const r = await judge(prompt);
      const reply = typeof r === "string" ? { text: r, totals: undefined } : r;
      const t = reply.totals;
      if (t) {
        overhead.input += t.input;
        overhead.output += t.output;
        overhead.cacheRead += t.cacheRead;
        overhead.cacheWrite += t.cacheWrite;
        overhead.costUsd += t.costUsd;
      }
      if (!reply.text.trim()) throw new Error("empty reply");
      if (t === null || (t && (t.models.length !== 1 || t.models[0] !== JUDGE_MODEL))) judges[dim] = { verdict: "UNKNOWN", reason: `judge ran ${t ? t.models.join(",") : "with no usage report"}, not exactly ${JUDGE_MODEL}` };
      else judges[dim] = parseVerdict(reply.text);
    } catch (e) {
      judges[dim] = { verdict: "UNKNOWN", reason: `judge call failed: ${(e as Error).message}` };
      failed.push((e as Error).message);
    }
  }
  return { judges, overhead, prompts, failed };
}

// ---- the diff a trial produced ----
const EXCLUDED = [".ab/", "docs/work/", "docs/sprint/", ".claude/"];
const MAX_DIFF = 60_000;
const NUL = /\u0000/;

/** Unified diff of what the trial changed against its source repo, harness paths left out. `changed` is `diffManifest(before, after)`. */
export function trialDiff(srcRepo: string, trialDir: string, changed: string[]): string {
  const out: string[] = [];
  const tmp = fs.mkdtempSync(path.join(fs.realpathSync.native(os.tmpdir()), "ab-diff-"));
  try {
    for (const c of changed) {
      const rel = c.replace(/^\w+ /, "");
      if (EXCLUDED.some((p) => rel.startsWith(p))) continue;
      const read = (root: string) => {
        const f = path.join(root, rel);
        return fs.existsSync(f) ? fs.readFileSync(f) : Buffer.alloc(0);
      };
      const a = read(srcRepo);
      const b = read(trialDir);
      if (NUL.test(a.toString("latin1")) || NUL.test(b.toString("latin1"))) {
        out.push(`diff ${rel}: binary file differs`);
        continue;
      }
      fs.writeFileSync(path.join(tmp, "a.txt"), a);
      fs.writeFileSync(path.join(tmp, "b.txt"), b);
      const r = Bun.spawnSync(["git", "-c", "core.autocrlf=false", "diff", "--no-index", "--no-color", "a.txt", "b.txt"], { cwd: tmp });
      const body = r.stdout.toString().split("\n");
      const at = body.findIndex((l) => l.startsWith("@@"));
      if (at < 0) continue;
      out.push(`--- ${a.length === 0 ? "/dev/null" : `a/${rel}`}\n+++ ${b.length === 0 ? "/dev/null" : `b/${rel}`}\n${body.slice(at).join("\n")}`);
    }
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
  const text = out.join("\n");
  return text.length > MAX_DIFF ? `${text.slice(0, MAX_DIFF)}\n[diff truncated at ${MAX_DIFF} characters]` : text;
}

