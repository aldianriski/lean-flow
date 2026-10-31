// The D9 trial protocol: phase 1 runs the arm's loop to its G2 design, the harness signs or refuses G2 outside the
// session (mechanical scope check + isolated policy judge), phase 2 resumes the same session only when signed.
// G2 here is an eval-only exception to night-run Part 0; every use is logged as a deviation and never applies to product runs.
import { createHash, randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import type { Arm } from "./arm.ts";
import { grade, verdictWord, type Grade, type Task } from "./grade.ts";
import { isolationEnv, makeIsolation } from "./isolate.ts";
import { detectPopups, parseStream, totalsOf, type Popup, type Stream, type Totals } from "./parse.ts";
import { applyProvision, graderEnv, PROVISION_CLASS, PROVISION_EXIT, provisionTrial, setupTrial } from "./provision.ts";
import { verifyPin } from "./pin.ts";
import { appendRow, type G2, type Row } from "./record.ts";
import { buildCommand, spawnRunner, TRIAL_TIMEOUT_MS, type RawRun, type Runner } from "./run.ts";
import { copyTree, diffManifest, manifest } from "./snapshot.ts";
import { classifyAttempt, firstActionSeen, terminalText, type AttemptClass } from "./retry.ts";
import { freezePreflight, PinRefused, pinsOf, validityProblems, type TrialOpts, type TrialResult } from "./trial.ts";

export const DEVIATION = "D9 eval-only G2 exception -- never applies to product runs";
/** pinned here, not drawn from the arm: the judge must not vary with the treatment */
export const JUDGE_MODEL = "claude-sonnet-5-5";
const POLICY = "approve as written unless the design leaves task scope";
const DESIGN_FILE = ".ab/g2-design.md";
const FIXTURES = path.join(import.meta.dir, "..", "fixtures");
const SIGNER_CAP_MS = 180_000;

export class FixtureOnly extends Error {}
/** R-c freeze: an unmeasured (smoke) protocol trial runs on a repo under evals/ab/fixtures/ only; a measured run (--measured) is exempt (the lift the pre-registration describes). */
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

/** Mechanical G2 check: every declared entry is ONE path token (no spaces, commas or `..`) equal to a layer path or under a `dir/` layer. */
export function scopeCheck(design: string | undefined, layers: string[]): Scope {
  if (design === undefined) return { ok: false, reason: "no design", files: [] };
  const files = designFiles(design);
  if (files.length === 0) return { ok: false, reason: "no files declared", files };
  const outside = files.filter((f) => !/^[\w.\-\/]+$/.test(f) || !inLayers(f, layers) || !inLayers(path.posix.normalize(f), layers));
  return outside.length > 0 ? { ok: false, reason: `outside Layers: ${outside.join(", ")}`, files } : { ok: true, reason: "pass", files };
}
const inLayers = (f: string, layers: string[]) => !path.posix.isAbsolute(f) && !f.split("/").includes("..") && layers.some((l) => (l.endsWith("/") ? f.startsWith(l) : f === l));

/**
 * Amendment 2: a layer that names a directory of the snapshot matches every file under it. Directory layers are written without a
 * trailing slash in task.json, so each one that is a directory in `snapshot` gets its slash here; a file layer stays exact. A layer
 * with `..` or an absolute path is left alone (it never matches a clean design path).
 */
export function resolveLayers(layers: string[], snapshot: string): string[] {
  return layers.map((l) => {
    if (l.endsWith("/") || path.posix.isAbsolute(l) || path.win32.isAbsolute(l) || l.split(/[\\/]/).includes("..")) return l;
    try {
      return fs.statSync(path.join(snapshot, l)).isDirectory() ? `${l}/` : l;
    } catch {
      return l;
    }
  });
}

export type JudgeReply = { text: string; totals: Totals | null };
/** a plain string is a recorded reply (free checks); a JudgeReply carries the judge run's own usage */
export type Judge = (prompt: string) => Promise<string | JudgeReply>;
export type Policy = { sign: boolean; reason: string; usage?: Omit<Totals, "models"> | undefined };
/** Isolated policy check: the judge sees only the written policy, the design text and the Out-of-scope list. Anything but one clean JSON verdict from the pinned model refuses. */
export async function policyCheck(design: string, outOfScope: string[], judge: Judge): Promise<Policy> {
  if (/<\/design\s*>/i.test(design)) return { sign: false, reason: "design contains </design>, which could close its own tag" };
  const prompt = `You are the G2 signer for an evaluation trial. Policy: ${POLICY}.\nThe task's Out-of-scope behaviours:\n${outOfScope.map((o) => `- ${o}`).join("\n")}\n\nThe design to judge:\n<design>\n${design}\n</design>\n\nIf the design does any Out-of-scope behaviour or otherwise leaves task scope, refuse. Otherwise sign. Reply with one JSON line only: {"verdict":"sign"|"refuse","reason":"<one sentence>"}`;
  try {
    const r = await judge(prompt);
    const reply = typeof r === "string" ? { text: r, totals: undefined } : r;
    const t = reply.totals;
    const usage = t ? { input: t.input, output: t.output, cacheRead: t.cacheRead, cacheWrite: t.cacheWrite, costUsd: t.costUsd } : undefined;
    if (t === null || (t && (t.models.length !== 1 || t.models[0] !== JUDGE_MODEL))) return { sign: false, reason: `judge ran ${t ? t.models.join(",") : "with no usage report"}, not exactly ${JUDGE_MODEL}`, usage };
    const text = reply.text.trim().replace(/^```(?:json)?[ \t]*\r?\n([\s\S]*?)\r?\n?```$/, "$1").trim();
    const j = JSON.parse(text);
    if (j === null || typeof j !== "object" || Array.isArray(j)) return { sign: false, reason: "judge reply is not one JSON object", usage };
    if (j.verdict === "sign") return { sign: true, reason: String(j.reason ?? ""), usage };
    if (j.verdict === "refuse") return { sign: false, reason: String(j.reason ?? ""), usage };
    return { sign: false, reason: `unknown verdict ${JSON.stringify(j.verdict)}`, usage };
  } catch (e) {
    return { sign: false, reason: `judge reply unusable: ${(e as Error).message}` };
  }
}

/** The real judge: a fresh `claude -p` in its own isolated config dir and empty cwd, no tools, the pinned judge model. */
export function realJudge(workRoot: string, arm: Arm, runner: Runner = spawnRunner, remainingMs?: () => number): Judge {
  return async (prompt) => {
    const cap = Math.min(SIGNER_CAP_MS, remainingMs ? remainingMs() : Infinity); // the signer's own cap never extends the trial deadline
    if (cap <= 0) throw new Error("trial deadline exhausted before the judge call");
    const jarm: Arm = { ...arm, sessionModel: JUDGE_MODEL, effort: "low", plugin: undefined, allowedTools: [] };
    const iso = makeIsolation(workRoot, jarm);
    clearSynced(iso.cfg);
    const raw = await runner(buildCommand(jarm, prompt, ["--tools", ""], { promptViaStdin: true }), { cwd: iso.trialDir, env: isolationEnv(iso, jarm), timeoutMs: cap, stdin: prompt });
    const res = parseStream(raw.stdout).result;
    if (!res || res.is_error) throw new Error(`judge run failed: exit ${raw.exitCode}, ${res?.terminal_reason ?? "no result event"}`);
    return { text: String(res.result ?? ""), totals: totalsOf(res) };
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
/** Amendment 2: the one revise round. The refusal reason is fed back to the same session; a second refusal ends the trial. */
export const revisePrompt = (reason: string) =>
  `The evaluation harness refused your G2 design: ${reason}

Revise the design in ${DESIGN_FILE} (the same format: a "Files:" list, one repo-relative path per line, then a "Behaviour:" paragraph) so that it stays inside the task's scope, then end your turn without implementing. This is the only revision; a second refusal ends the trial.`;
export const PHASE2_PROMPT = "G2 is signed. Implement the design you wrote, touching only the files in its Files: list, then stop.";

const HARNESS = (p: string) => p.startsWith(".ab/") || p.startsWith("docs/work/");
const addTotals = (a: Totals, b: Totals): Totals => ({ input: a.input + b.input, output: a.output + b.output, cacheRead: a.cacheRead + b.cacheRead, cacheWrite: a.cacheWrite + b.cacheWrite, costUsd: a.costUsd + b.costUsd, models: [...new Set([...a.models, ...b.models])] });
const popupText = (p: Popup) => {
  const i = p.input as any;
  return String(i?.questions?.[0]?.question ?? i?.plan ?? JSON.stringify(i ?? "")).replace(/\s+/g, " ").slice(0, 120);
};

/** `clock` is injectable so the shared deadline can be tested without waiting (default Date.now). */
export type ProtocolOpts = TrialOpts & { judge?: Judge; clock?: () => number };

export async function runProtocolTrial(o: ProtocolOpts): Promise<TrialResult> {
  if (!o.measure) assertFixtureOnly(o.srcRepo); // only a measured run (--measured) may leave the fixtures; smoke stays fixture-only
  freezePreflight(o.arm, o.srcRepo, !!o.measure);
  if (!o.task.layers?.length || !o.task.outOfScope?.length) throw new Error(`task ${o.task.id}: a protocol trial needs layers and outOfScope`);
  if (o.arm.plugin) {
    const reasons = verifyPin(o.arm.plugin);
    if (reasons.length > 0) throw new PinRefused(reasons);
  }
  const before = manifest(o.srcRepo);
  const iso = makeIsolation(o.workRoot, o.arm);
  copyTree(o.srcRepo, iso.trialDir);
  const layers = resolveLayers(o.task.layers, o.srcRepo);
  const taskHash = writeTaskFile(iso.trialDir, o.task);
  const base = manifest(iso.trialDir);
  // Amendment 2: the environment is built before the clock starts, for both arms alike, and torn down after grading whatever happened
  const setup = await setupTrial(o.provision ?? provisionTrial, { trialDir: iso.trialDir, root: iso.root });
  if (setup.failed !== undefined && !o.measure) throw new Error(`provisioning failed: ${setup.failed}`);
  const run = o.runner ?? spawnRunner;
  // ONE deadline for the whole trial (Amendment 1): the phases and the signer share it; each call gets what is left
  const clock = o.clock ?? Date.now;
  const deadline = clock() + (o.timeoutMs ?? TRIAL_TIMEOUT_MS);
  const remaining = () => deadline - clock();
  const call = () => ({ cwd: iso.trialDir, env: applyProvision(isolationEnv(iso, o.arm), setup.prov!), timeoutMs: remaining() });
  const sid = randomUUID();
  const judge = o.judge ?? realJudge(o.workRoot, o.arm, undefined, remaining);
  let timedOut = false;

  /** One G2 check of the design now on disk: the mechanical scope check, then the isolated policy judge. */
  const gate = async (): Promise<{ g2: G2; refused?: string }> => {
    const designPath = path.join(iso.trialDir, DESIGN_FILE);
    const design = fs.existsSync(designPath) ? fs.readFileSync(designPath, "utf8") : undefined;
    const scope = scopeCheck(design, layers);
    const g2: G2 = { scope: scope.ok ? "pass" : `fail: ${scope.reason}`, judge: "not-asked", reason: "", designSha256: design === undefined ? "" : sha256(design) };
    if (!scope.ok) return { g2, refused: `scope: ${scope.reason}` };
    const capped = remaining() < SIGNER_CAP_MS; // the deadline, not the signer's own cap, bounds this call
    const verdict = await policyCheck(design!, o.task.outOfScope!, judge);
    // the signer ran the deadline out (or was cut by it): the trial timed out, whatever the verdict; policyCheck already turned a failed call into a refusal
    if (remaining() <= 0 || (capped && !verdict.sign && /^judge (?:reply unusable|ran|run failed)/.test(verdict.reason))) timedOut = true;
    g2.judge = verdict.sign ? "sign" : "refuse";
    g2.reason = verdict.reason;
    g2.judgeUsage = verdict.usage;
    return verdict.sign ? { g2 } : { g2, refused: `policy: ${verdict.reason}` };
  };

  let raw1: RawRun = { stdout: "", stderr: `provisioning failed: ${setup.failed}`, exitCode: -1, wallMs: 0 };
  let streams: Stream[] = [];
  let wallMs = 0;
  let exitCode = 0;
  let park: Popup | undefined;
  let refused: string | undefined;
  let g2: G2 | undefined;
  let graded: Grade | undefined;
  let changed: string[] = [];
  let lastRaw = raw1;
  let breach: string[] = [];
  try {
    if (setup.failed === undefined) {
      clearSynced(iso.cfg);
      raw1 = lastRaw = await run(buildCommand(o.arm, phase1Prompt(o.task), ["--session-id", sid]), call());
      fs.writeFileSync(path.join(iso.root, "stream-phase1.jsonl"), raw1.stdout);
      streams = [parseStream(raw1.stdout)];
      wallMs = raw1.wallMs;
      exitCode = raw1.exitCode;
      if (raw1.timedOut || remaining() <= 0) timedOut = true;

      park = timedOut ? undefined : detectPopups(streams[0]!)[0];
      if (!park && !timedOut) {
        const first = await gate();
        g2 = first.g2;
        refused = first.refused;
        // Amendment 2: ONE revise round. The refusal reason goes back to the same session; the revised design is checked again; a second refusal ends the trial.
        if (refused !== undefined && !timedOut) {
          clearSynced(iso.cfg);
          const rawR = (lastRaw = await run(buildCommand(o.arm, revisePrompt(refused), ["--resume", sid]), call()));
          fs.writeFileSync(path.join(iso.root, "stream-revise.jsonl"), rawR.stdout);
          const sR = parseStream(rawR.stdout);
          streams.push(sR);
          wallMs += rawR.wallMs;
          exitCode = exitCode || rawR.exitCode;
          if (rawR.timedOut || remaining() <= 0) timedOut = true;
          park = timedOut ? undefined : detectPopups(sR)[0];
          if (!park && !timedOut) {
            const second = await gate();
            g2 = { ...second.g2, firstRound: first.g2 };
            refused = second.refused;
          }
        }
      }

      if (!park && !refused && !timedOut) {
        clearSynced(iso.cfg);
        const raw2 = await run(buildCommand(o.arm, PHASE2_PROMPT, ["--resume", sid]), call());
        fs.writeFileSync(path.join(iso.root, "stream-phase2.jsonl"), raw2.stdout);
        lastRaw = raw2;
        const s2 = parseStream(raw2.stdout);
        streams.push(s2);
        wallMs += raw2.wallMs;
        exitCode = exitCode || raw2.exitCode;
        if (raw2.timedOut) timedOut = true;
        park = timedOut ? undefined : detectPopups(s2)[0];
        if (!park && !timedOut) {
          const touched = diffManifest(base, manifest(iso.trialDir)).map((d) => d.replace(/^\w+ /, ""));
          breach = touched.filter((f) => !HARNESS(f) && !inLayers(f, layers));
          if (o.measure) changed = diffManifest(before, manifest(iso.trialDir));
          graded = await grade(o.task, iso.trialDir, graderEnv(setup.prov));
        }
      }
    }
  } finally {
    await setup.prov?.teardown();
  }
  if (streams.length === 0) streams = [parseStream("")];

  const ts = streams.map((s) => totalsOf(s.result));
  const totals = ts.some((t) => t === null) ? null : ts.reduce((acc, t) => addTotals(acc!, t!));
  const invalid = validityProblems(streams, o.arm, iso.trialDir, totals);
  const mutated = diffManifest(before, manifest(o.srcRepo));
  const errored = exitCode !== 0 || streams.some((s) => s.result?.is_error);
  const last = streams[streams.length - 1]!;
  const exit = mutated.length > 0 ? `source-mutated: ${mutated.join(", ")}` : setup.failed !== undefined ? `${PROVISION_EXIT}: ${setup.failed}` : timedOut ? "timeout" : !totals ? "usage-missing" : invalid.length > 0 ? `invalid: ${invalid.join("; ")}` : park ? `parked: popup ${park.tool}: ${popupText(park)}` : refused ? `g2-refused: ${refused}` : errored ? `cli-error: exit ${exitCode}, ${last.result?.terminal_reason ?? "no result event"}` : breach.length > 0 ? `scope-breach: ${breach.join(", ")}` : "ok";
  const graders = graded ? graded.graders.map((g) => `${g.name}:${verdictWord(g)}`).join(",") : `not-run:${setup.failed !== undefined ? PROVISION_EXIT : timedOut ? "timeout" : park ? "parked" : "g2-refused"}`;
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
  let cls: AttemptClass | undefined;
  if (o.measure) {
    cls = setup.failed !== undefined ? PROVISION_CLASS : classifyAttempt({ raw: lastRaw, stream: last, exit, trialActed: streams.some(firstActionSeen) });
    const { buildMeasure } = await import("./measure.ts"); // dynamic: measure -> judges -> protocol would otherwise cycle
    row.measure = (await buildMeasure({ arm: o.arm, task: o.task, srcRepo: o.srcRepo, trialDir: iso.trialDir, changed, graded, streams, exit, cls, judge: o.measure.judge ?? o.judge ?? realJudge(o.workRoot, o.arm), setupTokens: o.measure.setupTokens, setupWallS: setup.setupMs / 1000 })).measure;
    if (cls.startsWith("infra:")) row.passed = false;
  }
  appendRow(o.logPath, row);
  const valid = exit === "ok" || /^(g2-refused|parked|scope-breach):/.test(exit);
  return { exit, valid, grade: graded ?? { passed: false, graders: [] }, row, terminal: setup.failed !== undefined ? "" : terminalText(last, lastRaw), ...(cls ? { cls } : {}) };
}
