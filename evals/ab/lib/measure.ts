// The measured-run record of one attempt (TASK-543): every frozen grader, the three blind judge verdicts, execution tokens
// over every agent call the task triggered, setup tokens apart, and the retry class. Judge and setup usage are never execution.
import fs from "node:fs";
import path from "node:path";
import type { Arm } from "./arm.ts";
import { verdictWord, type Grade, type Task } from "./grade.ts";
import { blindTerms, contextFromTree, diffPaths, lfDocsOf, runJudges, trialDiff } from "./judges.ts";
import { totalsOf, type Stream } from "./parse.ts";
import type { Judge } from "./protocol.ts";
import type { Measure, Tok } from "./record.ts";
import { isInfra, type AttemptClass } from "./retry.ts";

const ZERO: Tok = { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 };
export const addTok = (a: Tok, b: Tok): Tok => ({ input: a.input + b.input, output: a.output + b.output, cacheRead: a.cacheRead + b.cacheRead, cacheWrite: a.cacheWrite + b.cacheWrite });
export const tokSum = (t: Tok) => t.input + t.output + t.cacheRead + t.cacheWrite;

/**
 * Execution tokens: every phase's `modelUsage` summed over every model, so the sub-agents a task dispatched are in it.
 * A phase that reported no usage is NOT a measured zero: the usage that is known is kept and the total is marked `incomplete`.
 */
export function executionTokens(streams: Stream[]): Measure["exec"] {
  let tok = ZERO;
  let costUsd = 0;
  let subagents = 0;
  let incomplete = streams.length === 0;
  const models = new Set<string>();
  for (const s of streams) {
    const t = totalsOf(s.result);
    subagents += Number(s.result?.subagent_stats?.spawned) || 0;
    if (!t) {
      incomplete = true;
      continue;
    }
    tok = addTok(tok, t);
    costUsd += t.costUsd;
    for (const m of t.models) models.add(m);
  }
  return { ...tok, costUsd, subagents, models: [...models], ...(incomplete ? { incomplete: true } : {}) };
}

/** Per-model usage rows from a record's `raw` (a trial row's single result or a protocol row's phases). */
function rawUsages(raw: any): Record<string, any>[] {
  const phases: any[] = Array.isArray(raw?.phases) ? raw.phases : raw ? [raw] : [];
  return phases.map((p) => p?.modelUsage ?? {});
}
/** Findings when the recorded execution total disagrees with the per-model usage the CLI reported. */
export function tokenProblems(exec: Measure["exec"], raw: unknown): string[] {
  const usages = rawUsages(raw);
  let tok = ZERO;
  const seen = new Set<string>();
  for (const mu of usages)
    for (const [model, u] of Object.entries(mu)) {
      seen.add(model);
      tok = addTok(tok, { input: Number(u.inputTokens) || 0, output: Number(u.outputTokens) || 0, cacheRead: Number(u.cacheReadInputTokens) || 0, cacheWrite: Number(u.cacheCreationInputTokens) || 0 });
    }
  const out: string[] = [];
  const unreported = usages.filter((mu) => Object.keys(mu).length === 0).length;
  if (unreported > 0 && exec.incomplete !== true) out.push(`incomplete-not-marked: ${unreported} phase(s) reported no usage but the total is not marked incomplete`);
  const missing = [...seen].filter((m) => !exec.models.includes(m));
  if (missing.length > 0) out.push(`subagent-tokens-missing: usage of ${missing.join(", ")} is not in the recorded execution tokens`);
  if (tokSum(tok) !== tokSum(exec)) out.push(`tokens-mismatch: recorded ${tokSum(exec)} vs reported ${tokSum(tok)}`);
  return out;
}

/** scored cost (the only figure in D5) vs infra cost (reported, never in D5); total spend = scored + infra. */
export function costSummary(ms: Pick<Measure, "attemptKind" | "exec">[]): { scoredUsd: number; infraUsd: number; totalUsd: number; incompleteAttempts: number } {
  const sum = (kind: Measure["attemptKind"]) => ms.filter((m) => m.attemptKind === kind).reduce((n, m) => n + m.exec.costUsd, 0);
  const scoredUsd = sum("scored");
  const infraUsd = sum("infra");
  return { scoredUsd, infraUsd, totalUsd: scoredUsd + infraUsd, incompleteAttempts: ms.filter((m) => m.exec.incomplete).length };
}

export function notesOf(srcRepo: string): string | undefined {
  const f = path.join(srcRepo, "BUSINESS-NOTES.md");
  return fs.existsSync(f) ? fs.readFileSync(f, "utf8") : undefined;
}

export type MeasureOpts = {
  arm: Arm;
  task: Task;
  srcRepo: string;
  trialDir: string;
  /** manifest diff of the trial copy against its source, taken before the graders ran */
  changed: string[];
  graded: Grade | undefined;
  streams: Stream[];
  exit: string;
  cls: AttemptClass;
  judge: Judge;
  setupTokens?: Tok | null | undefined;
  /** wall time of provisioning the trial environment (Amendment 2), outside the trial deadline */
  setupWallS?: number | undefined;
};

/** The extended record for one attempt. Judges run only on a finished, ok attempt; otherwise they are UNKNOWN with the reason. */
export async function buildMeasure(o: MeasureOpts): Promise<{ measure: Measure; prompts: Record<string, string> }> {
  const exec = executionTokens(o.streams);
  const verdict = (name: string) => {
    const g = o.graded?.graders.find((x) => x.name === name);
    return g ? verdictWord(g) : "not-run";
  };
  const graders: Measure["graders"] = o.task.graders.map((g) => ({ name: g.name, result: verdict(g.name) }));
  if (!o.task.graders.some((g) => /lint/i.test(g.name))) graders.push({ name: "lint", result: "not-applicable" });
  const unknown = (why: string) => ({ verdict: "UNKNOWN" as const, reason: why });
  let judges: Measure["judges"] = { convention: unknown(`not-run: ${o.exit}`), business: unknown(`not-run: ${o.exit}`), scope: unknown(`not-run: ${o.exit}`) };
  let overhead = { ...ZERO, costUsd: 0 };
  let prompts: Record<string, string> = {};
  if (o.exit === "ok" && o.graded) {
    const diff = trialDiff(o.srcRepo, o.trialDir, o.changed);
    const files = contextFromTree(o.trialDir, diffPaths(diff), lfDocsOf(o.arm.id)); // post-change files from the trial dir, lean-flow docs left out
    const r = await runJudges({ task: o.task, diff, notes: notesOf(o.srcRepo), files }, o.judge, blindTerms(o.arm));
    judges = r.judges;
    overhead = r.overhead;
    prompts = r.prompts;
  }
  return { measure: { graders, judges, exec, setup: o.setupTokens ?? null, judgeOverhead: overhead, attemptKind: isInfra(o.cls) ? "infra" : "scored", attemptClass: o.cls, ...(o.setupWallS !== undefined ? { setupWallS: o.setupWallS } : {}) }, prompts };
}
