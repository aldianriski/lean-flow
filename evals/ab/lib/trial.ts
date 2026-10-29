// One trial, end to end: verify pins -> fresh isolated copy -> run -> validate -> grade -> prove the source
// is untouched -> append the run record. The only model call is the injectable `runner`.
import path from "node:path";
import { modelInventory, type Arm } from "./arm.ts";
import { grade, type Grade, type Task } from "./grade.ts";
import { isolationEnv, makeIsolation, type Isolation } from "./isolate.ts";
import { checkInitPlugins, verifyPin } from "./pin.ts";
import { parseStream, totalsOf, type Stream, type Totals } from "./parse.ts";
import { appendRow, type Row } from "./record.ts";
import { buildCommand, spawnRunner, type Runner } from "./run.ts";
import { copyTree, diffManifest, manifest } from "./snapshot.ts";
import fs from "node:fs";

export class PinRefused extends Error {
  constructor(public reasons: string[]) {
    super(`plugin pin refused before spawn: ${reasons.join("; ")}`);
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
};
export type TrialResult = { exit: string; valid: boolean; grade: Grade; row: Row };

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
    effort: arm.effort,
    permissionMode: arm.permissionMode,
    auth: arm.auth,
    plugin: arm.plugin ? { sha: arm.plugin.sha, hash: arm.plugin.hash } : "none",
    configDir: iso.cfg,
    modelsSeen: totals?.models ?? [],
    initPlugins: streams[0]?.init?.plugins.map((p) => p.name) ?? [],
  };
}

export async function runTrial(o: TrialOpts): Promise<TrialResult> {
  if (o.arm.plugin) {
    const reasons = verifyPin(o.arm.plugin);
    if (reasons.length > 0) throw new PinRefused(reasons);
  }
  const before = manifest(o.srcRepo);
  const iso = makeIsolation(o.workRoot, o.arm);
  copyTree(o.srcRepo, iso.trialDir);
  const raw = await (o.runner ?? spawnRunner)(buildCommand(o.arm, o.task.prompt), { cwd: iso.trialDir, env: isolationEnv(iso, o.arm), timeoutMs: o.timeoutMs ?? 300_000 });
  fs.writeFileSync(path.join(iso.root, "stream.jsonl"), raw.stdout);
  const stream = parseStream(raw.stdout);
  const totals = totalsOf(stream.result);
  const graded = await grade(o.task, iso.trialDir);

  const invalid = validityProblems([stream], o.arm, iso.trialDir, totals);
  const mutated = diffManifest(before, manifest(o.srcRepo));

  const exit = mutated.length > 0 ? `source-mutated: ${mutated.join(", ")}` : !totals ? "usage-missing" : invalid.length > 0 ? `invalid: ${invalid.join("; ")}` : raw.exitCode !== 0 || stream.result?.is_error ? `cli-error: exit ${raw.exitCode}, ${stream.result?.terminal_reason ?? "no result event"}` : "ok";
  const row: Row = {
    tag: o.tag,
    arm: o.arm.id,
    repo: o.repo,
    task: o.task.id,
    trial: o.trial,
    attempt: o.attempt,
    graders: graded.graders.map((g) => `${g.name}:${g.passed ? "pass" : "fail"}`).join(","),
    tokens: totals && { input: totals.input, output: totals.output, cacheRead: totals.cacheRead, cacheWrite: totals.cacheWrite },
    costUsd: totals?.costUsd ?? null,
    wallS: raw.wallMs / 1000,
    exit,
    pins: pinsOf(o.arm, iso, totals, [stream]),
    passed: exit === "ok" && graded.passed,
    raw: { usage: stream.result?.usage ?? null, modelUsage: stream.result?.modelUsage ?? null, subagent_stats: stream.result?.subagent_stats ?? null },
  };
  appendRow(o.logPath, row);
  return { exit, valid: exit === "ok", grade: graded, row };
}
