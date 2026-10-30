// Deterministic fixture slots for the analysis (no model call): 2 repos x 4 tasks x arms x k trials. Used by the selftest and
// by `bun evals/ab/analyze.ts --fixture`. Not data from any real run.
import type { Result, Slot } from "./analyze.ts";
import type { SlotKey } from "./validity.ts";
import type { JudgeVerdict } from "./record.ts";

export type FixtureSpec = {
  arms?: Record<string, { success: number; tokens: number }>;
  k?: number;
  /** slots lost on the first pass: `unfilled` keeps them lost after every replacement round */
  lost?: { arm: string; repo: string; task: string; trial: number; unfilled?: boolean; /** the replacement attempt passes */ replacementPasses?: boolean }[];
  /** slots whose execution usage was not reported: tokens are zero and marked incomplete */
  incomplete?: { arm: string; task: string; trial: number }[];
  /** slots dropped from the DATA only (the schedule still lists them) */
  omit?: { arm: string; repo: string; task: string; trial: number }[];
  /** business verdicts forced to UNKNOWN for these (arm, task, trial) */
  unknown?: { arm: string; task: string; trial: number }[];
};

const TASKS: { id: string; symptoms: string[] }[] = [
  { id: "t1", symptoms: ["convention"] },
  { id: "t2", symptoms: ["business-rule"] },
  { id: "t3", symptoms: ["lost-detail", "convention"] },
  { id: "t4", symptoms: [] },
];

function prng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (Math.imul(a, 1664525) + 1013904223) >>> 0;
    return a / 4294967296;
  };
}

/** The frozen arm x task x trial grid of a spec, independent of what the data later holds. */
export function fixtureSchedule(spec: FixtureSpec = {}): SlotKey[] {
  const arms = Object.keys(spec.arms ?? { A0: 0, A1: 0 });
  const out: SlotKey[] = [];
  for (const arm of arms) for (const repo of ["clinic", "workdoo"]) for (const t of TASKS) for (let trial = 1; trial <= (spec.k ?? 3); trial++) out.push({ arm, repo, task: t.id, trial });
  return out;
}

export function fixtureSlots(spec: FixtureSpec = {}): Slot[] {
  const arms = spec.arms ?? { A0: { success: 0.45, tokens: 1000 }, A1: { success: 0.7, tokens: 1500 } };
  const k = spec.k ?? 3;
  const r = prng(42);
  const slots: Slot[] = [];
  for (const [arm, a] of Object.entries(arms))
    for (const repo of ["clinic", "workdoo"])
      for (const t of TASKS)
        for (let trial = 1; trial <= k; trial++) {
          const ok = r() < a.success;
          const verdict = (p: number): JudgeVerdict => (r() < p ? "PASS" : "FAIL");
          const result: Result = { graders: ok || r() < 0.2, convention: verdict(ok ? 0.9 : 0.5), business: ok ? "PASS" : "FAIL", scope: verdict(0.9), tokens: { input: a.tokens, output: a.tokens / 5, cacheRead: a.tokens * 3, cacheWrite: a.tokens / 2 }, costUsd: 0.01 };
          if (spec.unknown?.some((u) => u.arm === arm && u.task === t.id && u.trial === trial)) result.business = "UNKNOWN";
          const lost = spec.lost?.find((l) => l.arm === arm && l.repo === repo && l.task === t.id && l.trial === trial);
          if (spec.incomplete?.some((u) => u.arm === arm && u.task === t.id && u.trial === trial)) result.tokens = { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, incomplete: true };
          const replacement: Result = lost?.replacementPasses ? { ...result, graders: true, business: "PASS" } : result;
          if (spec.omit?.some((o) => o.arm === arm && o.repo === repo && o.task === t.id && o.trial === trial)) continue;
          slots.push({ arm, repo, task: t.id, trial, symptoms: t.symptoms, first: lost ? null : result, final: lost?.unfilled ? null : replacement, infraCostUsd: lost ? 0.003 * (lost.unfilled ? 3 : 2) : 0 });
        }
  return slots;
}
