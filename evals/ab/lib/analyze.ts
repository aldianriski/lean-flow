// The analysis of a measured run (TASK-543), on fixture data now and on real rows after the pre-registration. Every analysis
// choice is a PARAMETER with a proposed default; the pre-registration freezes the values, this file never does.
import { runValidity, slotId, VALIDITY_DEFAULTS, type RunState, type SlotKey, type Validity, type ValidityParams } from "./validity.ts";
import type { JudgeVerdict, Tok } from "./record.ts";

export type Result = { graders: boolean; convention: JudgeVerdict; business: JudgeVerdict; scope: JudgeVerdict; /** `incomplete`: a phase reported no usage; the figure is not a measurement and is never used as one */ tokens: Tok & { incomplete?: boolean }; costUsd: number };
/** `first`: the first pass (null = infra-lost). `final`: after the replacement rounds (null = still unfilled). */
export type Slot = SlotKey & { symptoms: string[]; first: Result | null; final: Result | null; infraCostUsd: number };

export type Params = ValidityParams & {
  a0: string;
  a1: string;
  /** how execution tokens are weighted into one figure; raw sum by default, each part is also reported */
  tokenWeights: Tok;
  bootstrap: { resamples: number; seed: number; ci: number };
  calibrationBar: number;
  costCeiling: number;
  rb: { failAt: number; lowerAbove: number };
};
export const DEFAULT_PARAMS: Params = {
  ...VALIDITY_DEFAULTS,
  a0: "A0",
  a1: "A1",
  tokenWeights: { input: 1, output: 1, cacheRead: 1, cacheWrite: 1 },
  bootstrap: { resamples: 10_000, seed: 20261030, ci: 0.9 },
  calibrationBar: 0.8,
  costCeiling: 2.0,
  rb: { failAt: 0.2, lowerAbove: 0.1 },
};

export const success = (r: Result) => r.graders && r.business === "PASS";
const key = (s: SlotKey) => `${s.repo}/${s.task}`;
const mean = (xs: number[]) => (xs.length === 0 ? NaN : xs.reduce((a, b) => a + b, 0) / xs.length);
const median = (xs: number[]) => {
  const s = [...xs].sort((a, b) => a - b);
  return s.length === 0 ? NaN : s.length % 2 ? s[(s.length - 1) / 2]! : (s[s.length / 2 - 1]! + s[s.length / 2]!) / 2;
};
export const weighted = (t: Tok, w: Tok) => t.input * w.input + t.output * w.output + t.cacheRead * w.cacheRead + t.cacheWrite * w.cacheWrite;

export type View = "first-pass" | "final";
type Row = { s: Slot; r: Result | null };
const rowsOf = (slots: Slot[], view: View, arm?: string): Row[] => slots.filter((s) => arm === undefined || s.arm === arm).map((s) => ({ s, r: view === "first-pass" ? s.first : s.final }));

export type Rate = { value: number; nTasks: number; nTrials: number };
/** Per-task mean over its trials, then mean over tasks. `lost`: "fail" scores an infra-lost row 0, "exclude" drops it. */
function taskMeans(rows: Row[], pick: (r: Result) => boolean, lost: "fail" | "exclude", only?: (s: Slot) => boolean): Map<string, number[]> {
  const m = new Map<string, number[]>();
  for (const { s, r } of rows) {
    if (only && !only(s)) continue;
    if (r === null && lost === "exclude") continue;
    const v = r === null ? 0 : pick(r) ? 1 : 0;
    m.set(key(s), [...(m.get(key(s)) ?? []), v]);
  }
  return m;
}
const rateOf = (m: Map<string, number[]>): Rate => ({ value: mean([...m.values()].map(mean)), nTasks: m.size, nTrials: [...m.values()].reduce((n, v) => n + v.length, 0) });
const scoresOf = (m: Map<string, number[]>) => new Map([...m].map(([k, v]) => [k, mean(v)]));

// ---- bootstrap over tasks ----
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const quantile = (sorted: number[], q: number) => sorted[Math.min(sorted.length - 1, Math.max(0, Math.floor(q * sorted.length)))]!;
export type Interval = { point: number; lo: number; hi: number; n: number };
/** Resample the task keys with replacement; `stat` maps a resample to a number. Fixed seed, so a rerun gives the same interval. */
export function bootstrap(keys: string[], stat: (sample: string[]) => number, p: Params["bootstrap"], salt = 0): Interval {
  const r = rng(p.seed + salt);
  const out: number[] = [];
  for (let i = 0; i < p.resamples; i++) out.push(stat(keys.map(() => keys[Math.floor(r() * keys.length)]!)));
  const ok = out.filter((x) => !Number.isNaN(x)).sort((a, b) => a - b);
  return { point: stat(keys), lo: quantile(ok, (1 - p.ci) / 2), hi: quantile(ok, 1 - (1 - p.ci) / 2), n: keys.length };
}
const hashSalt = (s: string) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
/** pooled + per repo */
function intervals(scores: Map<string, number>, stat: (get: (k: string) => number, sample: string[]) => number, p: Params, label: string) {
  const out: Record<string, Interval> = {};
  const repos = [...new Set([...scores.keys()].map((k) => k.split("/")[0]!))].sort();
  for (const scope of ["pooled", ...repos]) {
    const keys = [...scores.keys()].filter((k) => scope === "pooled" || k.startsWith(`${scope}/`)).sort();
    if (keys.length > 0) out[scope] = bootstrap(keys, (sample) => stat((k) => scores.get(k)!, sample), p.bootstrap, hashSalt(`${label}:${scope}`));
  }
  return out;
}
const meanStat = (get: (k: string) => number, sample: string[]) => mean(sample.map(get));

// ---- the report ----
export type Measure4 = "convention" | "business" | "lostDetail" | "scope";
export type ArmReport = {
  /** THE primary endpoint: first pass, an infra-lost trial counted not-passed. Intervals, deltas and the A0 floor derive from it. */
  primary: Rate & { ci: Record<string, Interval> };
  /** secondary, labelled: the same endpoint after replacement (every slot filled by its first non-infra attempt) */
  primaryReplaced: Rate;
  passAt1: number;
  passAtK: number;
  passHatK: number;
  /** first pass, infra-lost excluded; Unknown = not passed */
  symptoms: Record<Measure4, Rate>;
  unknowns: Record<"convention" | "business" | "scope", number>;
  /** weightedMedian: median over tasks of the per-task mean of weighted execution tokens (first pass, complete trials); tasks: tasks with a figure */
  tokens: { weightedMedian: number; parts: Tok; trials: number; tasks: number; /** first-pass trials left out because a phase reported no usage */ incomplete: number };
};
export type Report = {
  state: RunState;
  validity: Validity;
  params: Params;
  expectedSlots: number;
  /** slots counted; always equals expectedSlots, never a shrunk figure */
  denominator: number;
  arms?: Record<string, ArmReport>;
  deltaVsA1?: Record<string, Record<string, Interval>>;
  /** A1 minus A0 on the primary endpoint, pooled and per repo (the pre-registration's gain test reads `pooled`) */
  gainVsA0?: Record<string, Interval>;
  cost?: Record<string, { ratioVsA1: number; withinCeiling: boolean | null }>;
  rb?: Record<Measure4, { failRate: number; lower: number; defect: boolean }>;
  a0Floor?: Record<string, { primary: number; a0: number; fails: boolean }>;
  spend?: { scoredUsd: number; infraUsd: number; totalUsd: number };
};

const SYMPTOMS: Record<Measure4, { pick: (r: Result) => boolean; only?: (s: Slot) => boolean }> = {
  convention: { pick: (r) => r.convention === "PASS", only: (s) => s.symptoms.includes("convention") },
  business: { pick: (r) => r.business === "PASS", only: (s) => s.symptoms.includes("business-rule") },
  lostDetail: { pick: success, only: (s) => s.symptoms.includes("lost-detail") },
  scope: { pick: (r) => r.scope === "PASS" },
};

/** `schedule` is the frozen arm x task x trial grid, passed separately from the data: a slot missing from `slots` stays unfilled. */
export function analyze(slots: Slot[], schedule: SlotKey[], params: Params = DEFAULT_PARAMS): Report {
  const validity = runValidity(slots.map((s) => ({ ...s, firstLost: s.first === null, finalLost: s.final === null })), schedule, params);
  const base = { state: validity.state, validity, params, expectedSlots: validity.expectedSlots, denominator: validity.expectedSlots };
  if (validity.state !== "VALID") return base; // INVALID: no ruling. FAILED: the owner decides. Neither shrinks the denominator.

  const arms: Record<string, ArmReport> = {};
  const firstMeans: Record<string, Map<string, number>> = {};
  const firstPassSuccess: Record<string, Map<string, number[]>> = {};
  for (const arm of [...new Set(slots.map((s) => s.arm))].sort()) {
    const fin = rowsOf(slots, "final", arm);
    const first = rowsOf(slots, "first-pass", arm);
    const primM = taskMeans(first, success, "fail");
    firstMeans[arm] = scoresOf(primM);
    firstPassSuccess[arm] = taskMeans(first, success, "exclude");
    const per = new Map<string, boolean[]>();
    for (const { s, r } of first) per.set(key(s), [...(per.get(key(s)) ?? []), !!r && success(r)]);
    const tasks = [...per.values()];
    const unk = (d: "convention" | "business" | "scope") => fin.filter(({ r }) => r?.[d] === "UNKNOWN").length;
    // cost view = the primary's (first pass): an infra-lost slot has no row; an incomplete total is not a measurement, never a zero
    const measured = first.filter(({ r }) => r !== null && !r.tokens.incomplete);
    const perTask = new Map<string, number[]>();
    for (const { s, r } of measured) perTask.set(key(s), [...(perTask.get(key(s)) ?? []), weighted(r!.tokens, params.tokenWeights)]);
    const w = [...perTask.values()].map(mean); // per task: mean over its complete trials; the arm's figure is the median over tasks
    arms[arm] = {
      primary: { ...rateOf(primM), ci: intervals(firstMeans[arm], meanStat, params, `primary:${arm}`) },
      primaryReplaced: rateOf(taskMeans(fin, success, "fail")),
      passAt1: mean(tasks.map((t) => mean(t.map(Number)))),
      passAtK: mean(tasks.map((t) => Number(t.some(Boolean)))),
      passHatK: mean(tasks.map((t) => Number(t.every(Boolean)))),
      symptoms: Object.fromEntries((Object.keys(SYMPTOMS) as Measure4[]).map((k) => [k, rateOf(taskMeans(first, SYMPTOMS[k].pick, "exclude", SYMPTOMS[k].only))])) as Record<Measure4, Rate>,
      unknowns: { convention: unk("convention"), business: unk("business"), scope: unk("scope") },
      tokens: { weightedMedian: median(w), tasks: w.length, incomplete: first.filter(({ r }) => r?.tokens.incomplete).length, parts: measured.reduce((t, { r }) => ({ input: t.input + r!.tokens.input, output: t.output + r!.tokens.output, cacheRead: t.cacheRead + r!.tokens.cacheRead, cacheWrite: t.cacheWrite + r!.tokens.cacheWrite }), { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 }), trials: measured.length },
    };
  }

  const report: Report = { ...base, arms };
  const a1 = arms[params.a1];
  const a0 = arms[params.a0];
  if (a1) {
    report.deltaVsA1 = {};
    report.cost = {};
    if (a0) {
      // the decision quantity for A1 against A0: A1 minus A0 per task on the first-pass primary, bootstrapped over tasks
      const shared = [...firstMeans[params.a1]!.keys()].filter((k) => firstMeans[params.a0]!.has(k));
      report.gainVsA0 = intervals(new Map(shared.map((k) => [k, firstMeans[params.a1]!.get(k)! - firstMeans[params.a0]!.get(k)!])), meanStat, params, `gain:${params.a1}`);
    }
    for (const arm of Object.keys(arms)) {
      if (arm === params.a1) continue;
      const shared = [...firstMeans[arm]!.keys()].filter((k) => firstMeans[params.a1]!.has(k));
      const diff = new Map(shared.map((k) => [k, firstMeans[arm]!.get(k)! - firstMeans[params.a1]!.get(k)!]));
      report.deltaVsA1[arm] = intervals(diff, meanStat, params, `delta:${arm}`);
      const ratio = arms[arm]!.tokens.weightedMedian / a1.tokens.weightedMedian;
      report.cost[arm] = { ratioVsA1: ratio, withinCeiling: arm === params.a0 || Number.isNaN(ratio) ? null : ratio <= params.costCeiling };
    }
    // R-b per symptom measure, on A1's first pass with infra-lost excluded; Unknown is a failure because it is not-passed
    report.rb = {} as NonNullable<Report["rb"]>;
    for (const k of Object.keys(SYMPTOMS) as Measure4[]) {
      const m = taskMeans(rowsOf(slots, "first-pass", params.a1), SYMPTOMS[k].pick, "exclude", SYMPTOMS[k].only);
      const fail = new Map([...m].map(([t, v]) => [t, 1 - mean(v)]));
      if (fail.size === 0) {
        report.rb[k] = { failRate: NaN, lower: NaN, defect: false };
        continue;
      }
      const iv = bootstrap([...fail.keys()].sort(), (sample) => mean(sample.map((t) => fail.get(t)!)), params.bootstrap, hashSalt(`rb:${k}`));
      report.rb[k] = { failRate: iv.point, lower: iv.lo, defect: iv.point >= params.rb.failAt && iv.lo > params.rb.lowerAbove };
    }
  }
  if (a0) {
    report.a0Floor = {};
    for (const arm of Object.keys(arms)) if (arm !== params.a0) report.a0Floor[arm] = { primary: arms[arm]!.primary.value, a0: a0.primary.value, fails: arms[arm]!.primary.value < a0.primary.value };
  }
  const scored = slots.reduce((n, s) => n + (s.final?.costUsd ?? 0), 0);
  const infra = slots.reduce((n, s) => n + s.infraCostUsd, 0);
  report.spend = { scoredUsd: scored, infraUsd: infra, totalUsd: scored + infra };
  return report;
}

/**
 * Independent re-derivation of the claims most easily broken, from the raw slots and the frozen schedule (a different code path
 * from analyze). Findings are named: unknown-counted-as-pass | replaced-view-as-primary | infra-lost-in-symptom |
 * incomplete-tokens-as-zero | denominator-reduced | unfilled-slot-ruled | primary-mismatch.
 */
export function auditAnalysis(slots: Slot[], schedule: SlotKey[], rep: Report): string[] {
  const out: string[] = [];
  if (rep.denominator !== schedule.length) out.push(`denominator-reduced: report counts ${rep.denominator} of ${schedule.length} scheduled slots`);
  const have = new Map(slots.map((s) => [slotId(s), s]));
  if (rep.state === "VALID" && schedule.some((k) => !have.get(slotId(k))?.final)) out.push("unfilled-slot-ruled: a scheduled slot is unfilled or absent yet the run was ruled");
  if (!rep.arms) return out;
  const near = (a: number, b: number) => Math.abs(a - b) < 1e-9;
  for (const [arm, ar] of Object.entries(rep.arms)) {
    const mine = slots.filter((s) => s.arm === arm);
    const tasks = [...new Set(mine.map(key))];
    const prim = (pick: (s: Slot) => number) => mean(tasks.map((t) => mean(mine.filter((s) => key(s) === t).map(pick))));
    const strict = prim((s) => (s.first && s.first.graders && s.first.business === "PASS" ? 1 : 0));
    if (!near(strict, ar.primary.value)) {
      const replaced = prim((s) => ((s.first ?? s.final)?.graders && (s.first ?? s.final)?.business === "PASS" ? 1 : 0));
      const unknownPass = prim((s) => (s.first && s.first.graders && s.first.business !== "FAIL" ? 1 : 0));
      const name = near(replaced, ar.primary.value) ? "replaced-view-as-primary" : near(unknownPass, ar.primary.value) ? "unknown-counted-as-pass" : "primary-mismatch";
      out.push(`${name}: ${arm} primary ${ar.primary.value.toFixed(4)}, first-pass strict recomputation ${strict.toFixed(4)}`);
    }
    for (const k of Object.keys(SYMPTOMS) as Measure4[]) {
      const n = mine.filter((s) => s.first !== null && (SYMPTOMS[k].only?.(s) ?? true)).length;
      if (ar.symptoms[k].nTrials !== n) out.push(`${ar.symptoms[k].nTrials > n ? "infra-lost-in-symptom" : "symptom-count-mismatch"}: ${arm} ${k} counts ${ar.symptoms[k].nTrials} trials, ${n} are first-pass scored`);
    }
    const complete = mine.filter((s) => s.first !== null && !s.first.tokens.incomplete).length;
    if (ar.tokens.trials !== complete) out.push(`${ar.tokens.trials > complete ? "incomplete-tokens-as-zero" : "token-count-mismatch"}: ${arm} token figures cover ${ar.tokens.trials} trials, ${complete} first-pass trials have complete usage`);
  }
  return out;
}

const pct = (x: number) => (Number.isNaN(x) ? "n/a" : `${(x * 100).toFixed(1)}%`);
const iv = (i: Interval | undefined) => (i ? `${pct(i.point)} [${pct(i.lo)}, ${pct(i.hi)}] n=${i.n}` : "n/a");

/** Markdown report. A non-VALID run prints its state and findings only. */
export function renderReport(rep: Report): string {
  const L: string[] = [`# A/B analysis report`, ``, `**Run state: ${rep.state}** -- slots ${rep.denominator}/${rep.expectedSlots} counted (the denominator is never reduced).`, ``];
  for (const f of rep.validity.findings) L.push(`- ${f}`);
  if (!rep.arms) return `${L.join("\n")}\n\n${rep.state === "INVALID" ? "INVALID: no ruling." : "FAILED (owner decides): no ruling is computed."}\n`;
  const p = rep.params;
  L.push(``, `Parameters (proposed defaults, frozen at the pre-registration): token weights ${JSON.stringify(p.tokenWeights)}, bootstrap ${p.bootstrap.resamples} resamples seed ${p.bootstrap.seed} CI ${p.bootstrap.ci * 100}%, calibration bar ${pct(p.calibrationBar)}, cell limit ${p.cellLimit}, infra-lost limit ${pct(p.maxInfraShare)}, cost ceiling ${p.costCeiling}x.`, ``);
  L.push(`## Primary endpoint and reliability`, ``, `| arm | primary endpoint (first pass, infra-lost = not-passed) | 90% CI pooled | secondary: after replacement | pass@1 | pass@k | pass^k |`, `|---|---|---|---|---|---|---|`);
  for (const [a, r] of Object.entries(rep.arms)) L.push(`| ${a} | ${pct(r.primary.value)} | ${iv(r.primary.ci.pooled)} | ${pct(r.primaryReplaced.value)} | ${pct(r.passAt1)} | ${pct(r.passAtK)} | ${pct(r.passHatK)} |`);
  L.push(``, `Per-repo intervals: ${Object.entries(rep.arms).map(([a, r]) => `${a} ${Object.entries(r.primary.ci).filter(([k]) => k !== "pooled").map(([k, v]) => `${k} ${iv(v)}`).join("; ")}`).join(" | ")}`);
  L.push(``, `## Symptom measures (first pass, infra-lost excluded, Unknown = not passed)`, ``, `| arm | convention | business (business-rule tasks) | lost-detail success | scope |`, `|---|---|---|---|---|`);
  for (const [a, r] of Object.entries(rep.arms)) L.push(`| ${a} | ${(["convention", "business", "lostDetail", "scope"] as Measure4[]).map((k) => `${pct(r.symptoms[k].value)} (${r.symptoms[k].nTasks}t/${r.symptoms[k].nTrials}r)`).join(" | ")} |`);
  L.push(``, `## Unknown verdicts (reported separately; each counts as not-passed above)`, ``, `| arm | convention | business | scope |`, `|---|---|---|---|`);
  for (const [a, r] of Object.entries(rep.arms)) L.push(`| ${a} | ${r.unknowns.convention} | ${r.unknowns.business} | ${r.unknowns.scope} |`);
  if (rep.deltaVsA1) {
    L.push(``, `## Delta vs ${p.a1} (primary, bootstrap over tasks)`, ``);
    for (const [a, d] of Object.entries(rep.deltaVsA1)) L.push(`- ${a}: ${Object.entries(d).map(([k, v]) => `${k} ${iv(v)}`).join("; ")}`);
  }
  if (rep.gainVsA0) L.push(``, `## Gain of ${p.a1} over ${p.a0} (primary, ${p.a1} minus ${p.a0}; the pooled line decides)`, ``, `- ${Object.entries(rep.gainVsA0).map(([k, v]) => `${k} ${iv(v)}`).join("; ")}`);
  L.push(``, `## Cost (D5: execution tokens only, median over tasks of the per-task mean (first pass) vs ${p.a1})`, ``, `| arm | weighted median | input | output | cache-read | cache-write | ratio vs ${p.a1} | within ${p.costCeiling}x |`, `|---|---|---|---|---|---|---|---|`);
  for (const [a, r] of Object.entries(rep.arms)) L.push(`| ${a} | ${r.tokens.weightedMedian} | ${r.tokens.parts.input} | ${r.tokens.parts.output} | ${r.tokens.parts.cacheRead} | ${r.tokens.parts.cacheWrite} | ${rep.cost?.[a] ? rep.cost[a]!.ratioVsA1.toFixed(2) : "1.00"} | ${rep.cost?.[a]?.withinCeiling === null || !rep.cost?.[a] ? "-" : rep.cost[a]!.withinCeiling ? "yes" : "NO"} |`);
  L.push(``, `Trials left out of the token figures because a phase reported no usage (never counted as zero): ${Object.entries(rep.arms).map(([a, r]) => `${a} ${r.tokens.incomplete}`).join(", ")}.`);
  if (rep.spend) L.push(``, `Spend: scored $${rep.spend.scoredUsd.toFixed(4)} (the only figure in D5) + infra $${rep.spend.infraUsd.toFixed(4)} (never in D5) = total $${rep.spend.totalUsd.toFixed(4)}.`);
  if (rep.rb) {
    L.push(``, `## R-b: baseline defect rule on ${p.a1} (fail >= ${pct(p.rb.failAt)} and ${p.bootstrap.ci * 100}% bootstrap lower bound > ${pct(p.rb.lowerAbove)})`, ``, `| measure | ${p.a1} fail rate | lower bound | measured defect |`, `|---|---|---|---|`);
    for (const [k, v] of Object.entries(rep.rb)) L.push(`| ${k} | ${pct(v.failRate)} | ${pct(v.lower)} | ${v.defect ? "YES" : "no"} |`);
  }
  if (rep.a0Floor) {
    L.push(``, `## A0 floor (an arm below ${p.a0} on the primary endpoint fails regardless of its delta)`, ``);
    for (const [a, v] of Object.entries(rep.a0Floor)) L.push(`- ${a}: ${pct(v.primary)} vs ${p.a0} ${pct(v.a0)} -- ${v.fails ? "FAILS the floor" : "above the floor"}`);
  }
  return `${L.join("\n")}\n`;
}
