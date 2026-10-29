// The D9 trial protocol: phase 1 runs the arm's loop to its G2 design, the harness signs or refuses G2 outside the
// session (mechanical scope check + isolated policy judge), phase 2 resumes the same session only when signed.
// G2 here is an eval-only exception to night-run Part 0; every use is logged as a deviation and never applies to product runs.
import { createHash, randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import type { Arm } from "./arm.ts";
import { grade, type Grade, type Task } from "./grade.ts";
import { isolationEnv, makeIsolation } from "./isolate.ts";
import { detectPopups, parseStream, totalsOf, type Popup, type Totals } from "./parse.ts";
import { verifyPin } from "./pin.ts";
import { appendRow, type Row } from "./record.ts";
import { buildCommand, spawnRunner, type Runner } from "./run.ts";
import { copyTree, diffManifest, manifest } from "./snapshot.ts";
import { PinRefused, pinsOf, validityProblems, type TrialOpts, type TrialResult } from "./trial.ts";

export const DEVIATION = "D9 eval-only G2 exception -- never applies to product runs";
/** pinned here, not drawn from the arm: the judge must not vary with the treatment */
export const JUDGE_MODEL = "claude-sonnet-5-5";
const POLICY = "approve as written unless the design leaves task scope";
const DESIGN_FILE = ".ab/g2-design.md";
const FIXTURES = path.join(import.meta.dir, "..", "fixtures");

export class FixtureOnly extends Error {}
/** R-c freeze: protocol trials run on a repo under evals/ab/fixtures/ until the pre-registration lifts it by editing this check. */
export function assertFixtureOnly(srcRepo: string): void {
  const rel = path.relative(fs.realpathSync.native(FIXTURES), fs.realpathSync.native(srcRepo));
  if (rel === "" || rel.startsWith("..") || path.isAbsolute(rel)) throw new FixtureOnly(`protocol trials run on evals/ab/fixtures/ only, not ${srcRepo}`);
}

export type Scope = { ok: boolean; reason: string; files: string[] };
/** The `Files:` list of a design: bullets or bare lines after `Files:` up to a blank line or the next `Word:` header. */
export function designFiles(design: string): string[] {
  const files: string[] = [];
  let on = false;
  for (const raw of design.split(/\r?\n/)) {
    if (/^\s*Files:\s*$/i.test(raw)) on = true;
    else if (!on || (raw.trim() === "" && files.length === 0)) continue;
    else if (raw.trim() === "" || /^\s*[A-Za-z]+:/.test(raw)) break;
    else files.push(raw.trim().replace(/^[-*]\s*/, "").replace(/^`|`$/g, "").replaceAll("\\", "/"));
  }
  return files.filter(Boolean);
}

/** Mechanical G2 check: every declared file equals a layer path or sits under a `dir/` layer. */
export function scopeCheck(design: string | undefined, layers: string[]): Scope {
  if (design === undefined) return { ok: false, reason: "no design", files: [] };
  const files = designFiles(design);
  if (files.length === 0) return { ok: false, reason: "no files declared", files };
  const outside = files.filter((f) => !inLayers(f, layers));
  return outside.length > 0 ? { ok: false, reason: `outside Layers: ${outside.join(", ")}`, files } : { ok: true, reason: "pass", files };
}
const inLayers = (f: string, layers: string[]) => !path.posix.isAbsolute(f) && !f.split("/").includes("..") && layers.some((l) => (l.endsWith("/") ? f.startsWith(l) : f === l));

export type Judge = (prompt: string) => Promise<string>;
export type Policy = { sign: boolean; reason: string };
/** Isolated policy check: the judge sees only the written policy, the design text and the Out-of-scope list. Anything unparsable refuses. */
export async function policyCheck(design: string, outOfScope: string[], judge: Judge): Promise<Policy> {
  const prompt = `You are the G2 signer for an evaluation trial. Policy: ${POLICY}.\nThe task's Out-of-scope behaviours:\n${outOfScope.map((o) => `- ${o}`).join("\n")}\n\nThe design to judge:\n<design>\n${design}\n</design>\n\nIf the design does any Out-of-scope behaviour or otherwise leaves task scope, refuse. Otherwise sign. Reply with one JSON line only: {"verdict":"sign"|"refuse","reason":"<one sentence>"}`;
  try {
    const line = (await judge(prompt)).split("\n").reverse().find((l) => l.trim().startsWith("{"));
    const j = JSON.parse(line ?? "");
    if (j.verdict === "sign") return { sign: true, reason: String(j.reason ?? "") };
    if (j.verdict === "refuse") return { sign: false, reason: String(j.reason ?? "") };
    return { sign: false, reason: `unknown verdict ${JSON.stringify(j.verdict)}` };
  } catch (e) {
    return { sign: false, reason: `judge reply unusable: ${(e as Error).message}` };
  }
}

/** The real judge: a fresh `claude -p` in its own isolated config dir and empty cwd, no tools, the pinned judge model. */
export function realJudge(workRoot: string, arm: Arm, runner: Runner = spawnRunner): Judge {
  return async (prompt) => {
    const jarm: Arm = { ...arm, sessionModel: JUDGE_MODEL, effort: "low", plugin: undefined };
    const iso = makeIsolation(workRoot, jarm);
    const raw = await runner(buildCommand(jarm, prompt, ["--tools", ""]), { cwd: iso.trialDir, env: isolationEnv(iso, jarm), timeoutMs: 180_000 });
    const res = parseStream(raw.stdout).result;
    if (!res || res.is_error) throw new Error(`judge run failed: exit ${raw.exitCode}, ${res?.terminal_reason ?? "no result event"}`);
    return String(res.result ?? "");
  };
}

/** The CLI syncs account plugins into the config dir between calls (seen as `codex` in phase 2's init). No supported switch exists (--bare drops OAuth), so they are removed before each spawn; the init check stays strict. */
export function clearSynced(cfg: string): void {
  fs.rmSync(path.join(cfg, "plugins", "synced"), { recursive: true, force: true });
  const data = path.join(cfg, "plugins", "data");
  if (fs.existsSync(data)) for (const d of fs.readdirSync(data)) if (d.endsWith("-synced")) fs.rmSync(path.join(data, d), { recursive: true, force: true });
}

const sha256 = (s: string) => createHash("sha256").update(s).digest("hex");

/** G1 pre-signed from the frozen task: the task as a lean-flow task file whose gates_signed carries the hash of the task JSON. */
export function writeTaskFile(dir: string, task: Task): string {
  const hash = sha256(JSON.stringify(task));
  const body = `---\nid: ${task.id}\nstatus: todo\ngates_signed: G1 @ ${hash}\n---\n\n# ${task.id}\n\n## Done when\n- [ ] ${task.prompt}\n${task.graders.map((g) => `- [ ] grader ${g.name}: \`${g.cmd.replace("{TSC}", "tsc")}\``).join("\n")}\n\nLayers: ${(task.layers ?? []).join(", ")}\n\n## Out of scope\n${(task.outOfScope ?? []).map((o) => `- ${o}`).join("\n")}\n`;
  fs.mkdirSync(path.join(dir, "docs", "work", "todo"), { recursive: true });
  fs.writeFileSync(path.join(dir, "docs", "work", "todo", `${task.id}.md`), body);
  return hash;
}

export const phase1Prompt = (task: Task) =>
  `Run this task through the workflow you have installed, unattended. The task file is docs/work/todo/${task.id}.md; its G1 (Scope) gate is pre-signed. Your G2 (Design) gate is signed by the evaluation harness under an eval-only exception, outside this session. Do not ask the user anything. Write your design to ${DESIGN_FILE} with two parts: a "Files:" list (one repo-relative path per line, every file you will touch) and a "Behaviour:" paragraph. Then end your turn without implementing.\n\nTask: ${task.prompt}`;
export const PHASE2_PROMPT = "G2 is signed. Implement the design you wrote, touching only the files in its Files: list, then stop.";

const HARNESS = (p: string) => p.startsWith(".ab/") || p.startsWith("docs/work/");
const addTotals = (a: Totals, b: Totals): Totals => ({ input: a.input + b.input, output: a.output + b.output, cacheRead: a.cacheRead + b.cacheRead, cacheWrite: a.cacheWrite + b.cacheWrite, costUsd: a.costUsd + b.costUsd, models: [...new Set([...a.models, ...b.models])] });
const popupText = (p: Popup) => {
  const i = p.input as any;
  return String(i?.questions?.[0]?.question ?? i?.plan ?? JSON.stringify(i ?? "")).replace(/\s+/g, " ").slice(0, 120);
};

export type ProtocolOpts = TrialOpts & { judge?: Judge };

export async function runProtocolTrial(o: ProtocolOpts): Promise<TrialResult> {
  assertFixtureOnly(o.srcRepo);
  if (!o.task.layers?.length || !o.task.outOfScope?.length) throw new Error(`task ${o.task.id}: a protocol trial needs layers and outOfScope`);
  if (o.arm.plugin) {
    const reasons = verifyPin(o.arm.plugin);
    if (reasons.length > 0) throw new PinRefused(reasons);
  }
  const before = manifest(o.srcRepo);
  const iso = makeIsolation(o.workRoot, o.arm);
  copyTree(o.srcRepo, iso.trialDir);
  const taskHash = writeTaskFile(iso.trialDir, o.task);
  const base = manifest(iso.trialDir);
  const run = o.runner ?? spawnRunner;
  const call = { cwd: iso.trialDir, env: isolationEnv(iso, o.arm), timeoutMs: o.timeoutMs ?? 300_000 };
  const sid = randomUUID();

  clearSynced(iso.cfg);
  const raw1 = await run(buildCommand(o.arm, phase1Prompt(o.task), ["--session-id", sid]), call);
  fs.writeFileSync(path.join(iso.root, "stream-phase1.jsonl"), raw1.stdout);
  const s1 = parseStream(raw1.stdout);
  const streams = [s1];
  let wallMs = raw1.wallMs;
  let exitCode = raw1.exitCode;

  let park: Popup | undefined = detectPopups(s1)[0];
  let refused: string | undefined;
  let g2: Row["g2"];
  if (!park) {
    const designPath = path.join(iso.trialDir, DESIGN_FILE);
    const design = fs.existsSync(designPath) ? fs.readFileSync(designPath, "utf8") : undefined;
    const scope = scopeCheck(design, o.task.layers);
    g2 = { scope: scope.ok ? "pass" : `fail: ${scope.reason}`, judge: "not-asked", reason: "", designSha256: design === undefined ? "" : sha256(design) };
    if (!scope.ok) refused = `scope: ${scope.reason}`;
    else {
      const verdict = await policyCheck(design!, o.task.outOfScope, o.judge ?? realJudge(o.workRoot, o.arm));
      g2.judge = verdict.sign ? "sign" : "refuse";
      g2.reason = verdict.reason;
      if (!verdict.sign) refused = `policy: ${verdict.reason}`;
    }
  }

  let graded: Grade | undefined;
  let breach: string[] = [];
  if (!park && !refused) {
    clearSynced(iso.cfg);
    const raw2 = await run(buildCommand(o.arm, PHASE2_PROMPT, ["--resume", sid]), call);
    fs.writeFileSync(path.join(iso.root, "stream-phase2.jsonl"), raw2.stdout);
    const s2 = parseStream(raw2.stdout);
    streams.push(s2);
    wallMs += raw2.wallMs;
    exitCode = exitCode || raw2.exitCode;
    park = detectPopups(s2)[0];
    if (!park) {
      const touched = diffManifest(base, manifest(iso.trialDir)).map((d) => d.replace(/^\w+ /, ""));
      breach = touched.filter((f) => !HARNESS(f) && !inLayers(f, o.task.layers));
      graded = await grade(o.task, iso.trialDir);
    }
  }

  const ts = streams.map((s) => totalsOf(s.result));
  const totals = ts.some((t) => t === null) ? null : ts.reduce((acc, t) => addTotals(acc!, t!));
  const invalid = validityProblems(streams, o.arm, iso.trialDir, totals);
  const mutated = diffManifest(before, manifest(o.srcRepo));
  const errored = exitCode !== 0 || streams.some((s) => s.result?.is_error);
  const last = streams[streams.length - 1]!;
  const exit = mutated.length > 0 ? `source-mutated: ${mutated.join(", ")}` : !totals ? "usage-missing" : invalid.length > 0 ? `invalid: ${invalid.join("; ")}` : park ? `parked: popup ${park.tool}: ${popupText(park)}` : refused ? `g2-refused: ${refused}` : errored ? `cli-error: exit ${exitCode}, ${last.result?.terminal_reason ?? "no result event"}` : breach.length > 0 ? `scope-breach: ${breach.join(", ")}` : "ok";
  const graders = graded ? graded.graders.map((g) => `${g.name}:${g.passed ? "pass" : "fail"}`).join(",") : `not-run:${park ? "parked" : "g2-refused"}`;
  const row: Row = {
    tag: o.tag,
    arm: o.arm.id,
    repo: o.repo,
    task: o.task.id,
    trial: o.trial,
    attempt: o.attempt,
    graders,
    tokens: totals && { input: totals.input, output: totals.output, cacheRead: totals.cacheRead, cacheWrite: totals.cacheWrite },
    costUsd: totals?.costUsd ?? null,
    wallS: wallMs / 1000,
    exit,
    pins: { ...pinsOf(o.arm, iso, totals, streams), taskSha256: taskHash, sessionId: sid },
    raw: { phases: streams.map((s) => ({ usage: s.result?.usage ?? null, modelUsage: s.result?.modelUsage ?? null, subagent_stats: s.result?.subagent_stats ?? null })) },
    passed: exit === "ok" && !!graded?.passed,
    deviation: DEVIATION,
    g2,
    park: park && { tool: park.tool, input: park.input },
  };
  appendRow(o.logPath, row);
  const valid = exit === "ok" || /^(g2-refused|parked|scope-breach):/.test(exit);
  return { exit, valid, grade: graded ?? { passed: false, graders: [] }, row };
}
