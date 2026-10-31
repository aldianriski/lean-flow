// One trial, end to end: verify pins -> fresh isolated copy -> run -> validate -> grade -> prove the source
// is untouched -> append the run record. The only model call is the injectable `runner`.
import path from "node:path";
import { modelInventory, type Arm } from "./arm.ts";
import { grade, type Grade, type Task } from "./grade.ts";
import { isolationEnv, makeIsolation, type Isolation } from "./isolate.ts";
import { checkArmSnapshot } from "./freeze.ts";
import { checkInitPlugins, verifyPin } from "./pin.ts";
import { parseStream, totalsOf, type Stream, type Totals } from "./parse.ts";
import { appendRow, type Row, type Tok } from "./record.ts";
import { classifyAttempt, terminalText, type AttemptClass } from "./retry.ts";
import type { Judge } from "./protocol.ts";
import { buildCommand, spawnRunner, TRIAL_TIMEOUT_MS, type RawRun, type Runner } from "./run.ts";
import { copyTree, diffManifest, manifest } from "./snapshot.ts";
import fs from "node:fs";

export class PinRefused extends Error {
  constructor(public reasons: string[]) {
    super(`plugin pin refused before spawn: ${reasons.join("; ")}`);
  }
}

export class ArmRefused extends Error {
  constructor(public reasons: string[]) {
    super(`arm refused before spawn: ${reasons.join("; ")}`);
  }
}

export type TrialOpts = {
  arm: Arm;
  srcRepo: string;
  repo: string;
  task: Task;
  trial: number;
  attempt: number;
  workRoot: string;
  logPath: string;
  tag: string;
  runner?: Runner;
  timeoutMs?: number;
  /** present = a measured run: the row carries the extended record. The judge defaults to the real one; tests pass recorded replies. */
  measure?: { judge?: Judge; setupTokens?: Tok | null };
};
export type TrialResult = { exit: string; valid: boolean; grade: Grade; row: Row; /** retry class; set on measured runs */ cls?: AttemptClass; /** the CLI's own terminal text (reason, error line, stderr tail): evidence for the driver's usage-limit check, not a row field */ terminal?: string };

/** Reasons a finished run is invalid: init must show the right plugins and the trial copy as cwd, and every model seen must be pinned. */
export function validityProblems(streams: Stream[], arm: Arm, trialDir: string, totals: Totals | null): string[] {
  const invalid: string[] = [];
  for (const stream of streams) {
    if (!stream.init) invalid.push("no init event");
    else {
      invalid.push(...checkInitPlugins(stream.init.plugins, arm.plugin?.path));
      if (path.resolve(stream.init.cwd).toLowerCase() !== path.resolve(trialDir).toLowerCase()) invalid.push(`init cwd ${stream.init.cwd} is not the trial copy`);
    }
  }
  const inventory = modelInventory(arm);
  for (const m of totals?.models ?? []) if (!inventory.has(m)) invalid.push(`model ${m} is not in the arm's pinned inventory`);
  return invalid;
}

/** Every pin the run actually ran under. */
export function pinsOf(arm: Arm, iso: Isolation, totals: Totals | null, streams: Stream[]): Record<string, unknown> {
  return {
    sessionModel: arm.sessionModel,
    dispatch: arm.dispatch,
    allowedModels: arm.allowedModels ?? [],
    allowedTools: arm.allowedTools,
    effort: arm.effort,
    permissionMode: arm.permissionMode,
    auth: arm.auth,
    plugin: arm.plugin ? { sha: arm.plugin.sha, hash: arm.plugin.hash } : "none",
    configDir: iso.cfg,
    modelsSeen: totals?.models ?? [],
    initPlugins: streams[0]?.init?.plugins.map((p) => p.name) ?? [],
  };
}

/**
 * The ONE freeze preflight every run passes through (runTrial and the D9 protocol alike): the snapshot must match its manifest
 * and be the source repo. A measured run additionally requires a frozen snapshot + manifest; smoke runs need none.
 */
export function freezePreflight(arm: Arm, srcRepo: string, measured: boolean): void {
  const problems = checkArmSnapshot(arm);
  if (arm.snapshot && path.resolve(srcRepo).toLowerCase() !== path.resolve(arm.snapshot).toLowerCase()) problems.push(`srcRepo ${srcRepo} is not the arm's snapshot ${arm.snapshot}`);
  if (measured && (!arm.snapshot || !arm.manifest)) problems.push(`measured run: arm ${arm.id} has no frozen snapshot + manifest`);
  if (problems.length > 0) throw new ArmRefused(problems);
}

export async function runTrial(o: TrialOpts): Promise<TrialResult> {
  freezePreflight(o.arm, o.srcRepo, !!o.measure);
  if (o.arm.plugin) {
    const reasons = verifyPin(o.arm.plugin);
    if (reasons.length > 0) throw new PinRefused(reasons);
  }
  const before = manifest(o.srcRepo);
  const iso = makeIsolation(o.workRoot, o.arm);
  copyTree(o.srcRepo, iso.trialDir);
  let raw: RawRun;
  let thrown: string | undefined;
  try {
    raw = await (o.runner ?? spawnRunner)(buildCommand(o.arm, o.task.prompt), { cwd: iso.trialDir, env: isolationEnv(iso, o.arm), timeoutMs: o.timeoutMs ?? TRIAL_TIMEOUT_MS });
  } catch (e) {
    if (!o.measure) throw e;
    thrown = (e as Error).message; // a measured run classifies a runner exception as a harness crash instead of dying
    raw = { stdout: "", stderr: thrown, exitCode: -1, wallMs: 0 };
  }
  fs.writeFileSync(path.join(iso.root, "stream.jsonl"), raw.stdout);
  const stream = parseStream(raw.stdout);
  const totals = totalsOf(stream.result);
  // what the agent changed, taken before the graders run (they build into the copy)
  const changed = o.measure ? diffManifest(before, manifest(iso.trialDir)) : [];
  // a killed run is not graded or judged (Amendment 1): not-passed, judge verdicts Unknown
  const graded = raw.timedOut ? undefined : await grade(o.task, iso.trialDir);

  const invalid = validityProblems([stream], o.arm, iso.trialDir, totals);
  const mutated = diffManifest(before, manifest(o.srcRepo));

  const exit = mutated.length > 0 ? `source-mutated: ${mutated.join(", ")}` : raw.timedOut ? "timeout" : !totals ? "usage-missing" : invalid.length > 0 ? `invalid: ${invalid.join("; ")}` : raw.exitCode !== 0 || stream.result?.is_error ? `cli-error: exit ${raw.exitCode}, ${stream.result?.terminal_reason ?? "no result event"}` : "ok";
  const row: Row = {
    tag: o.tag,
    arm: o.arm.id,
    repo: o.repo,
    task: o.task.id,
    trial: o.trial,
    attempt: o.attempt,
    graders: graded ? graded.graders.map((g) => `${g.name}:${g.passed ? "pass" : "fail"}`).join(",") : "not-run:timeout",
    tokens: totals && { input: totals.input, output: totals.output, cacheRead: totals.cacheRead, cacheWrite: totals.cacheWrite },
    costUsd: totals?.costUsd ?? null,
    wallS: raw.wallMs / 1000,
    exit,
    pins: pinsOf(o.arm, iso, totals, [stream]),
    passed: exit === "ok" && !!graded?.passed,
    raw: { usage: stream.result?.usage ?? null, modelUsage: stream.result?.modelUsage ?? null, subagent_stats: stream.result?.subagent_stats ?? null },
  };
  let cls: AttemptClass | undefined;
  if (o.measure) {
    cls = classifyAttempt({ thrown, raw, stream, exit });
    const { buildMeasure } = await import("./measure.ts"); // dynamic: measure -> judges -> protocol -> trial would otherwise cycle
    const { realJudge } = await import("./protocol.ts");
    row.measure = (await buildMeasure({ arm: o.arm, task: o.task, srcRepo: o.srcRepo, trialDir: iso.trialDir, changed, graded, streams: [stream], exit, cls, judge: o.measure.judge ?? realJudge(o.workRoot, o.arm), setupTokens: o.measure.setupTokens })).measure;
    if (cls.startsWith("infra:")) row.passed = false;
  }
  appendRow(o.logPath, row);
  return { exit, valid: exit === "ok", grade: graded ?? { passed: false, graders: [] }, row, terminal: terminalText(stream, raw), ...(cls ? { cls } : {}) };
}
