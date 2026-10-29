// One trial, end to end: verify pins -> fresh isolated copy -> run -> validate -> grade -> prove the source
// is untouched -> append the run record. The only model call is the injectable `runner`.
import path from "node:path";
import { modelInventory, type Arm } from "./arm.ts";
import { grade, type Grade, type Task } from "./grade.ts";
import { isolationEnv, makeIsolation } from "./isolate.ts";
import { checkInitPlugins, verifyPin } from "./pin.ts";
import { parseStream, totalsOf } from "./parse.ts";
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

  const invalid: string[] = [];
  if (!stream.init) invalid.push("no init event");
  else {
    invalid.push(...checkInitPlugins(stream.init.plugins, o.arm.plugin?.path));
    if (path.resolve(stream.init.cwd).toLowerCase() !== path.resolve(iso.trialDir).toLowerCase()) invalid.push(`init cwd ${stream.init.cwd} is not the trial copy`);
  }
  const inventory = modelInventory(o.arm);
  for (const m of totals?.models ?? []) if (!inventory.has(m)) invalid.push(`model ${m} is not in the arm's pinned inventory`);
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
    pins: {
      sessionModel: o.arm.sessionModel,
      dispatch: o.arm.dispatch,
      effort: o.arm.effort,
      permissionMode: o.arm.permissionMode,
      auth: o.arm.auth,
      plugin: o.arm.plugin ? { sha: o.arm.plugin.sha, hash: o.arm.plugin.hash } : "none",
      configDir: iso.cfg,
      modelsSeen: totals?.models ?? [],
      initPlugins: stream.init?.plugins.map((p) => p.name) ?? [],
    },
    raw: { usage: stream.result?.usage ?? null, modelUsage: stream.result?.modelUsage ?? null, subagent_stats: stream.result?.subagent_stats ?? null },
  };
  appendRow(o.logPath, row);
  return { exit, valid: exit === "ok", grade: graded, row };
}
