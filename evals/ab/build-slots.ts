// Log-to-slots builder: the measurement log's rows -> the slots the analysis reads (PREREGISTRATION section 11, verbatim, plus the
// usage-limit exclusion of section 18 / Amendment 1).
//   bun evals/ab/build-slots.ts [--log <md>] [--schedule <json>] [--tasks <dir>] [--out <slots.json>]
//   bun evals/ab/analyze.ts --data <slots.json> --schedule evals/ab/schedule.json
// Reads only rows tagged `measured round <r>`; rows tagged `smoke` are skipped and a log holding nothing else is refused (not a
// measurement). Any inconsistency in the rows is a finding and nothing is written. Maintainer-only, no model call.
import fs from "node:fs";
import path from "node:path";
import type { Result, Slot } from "./lib/analyze.ts";
import { analysisArm, isInfraRow, latestFreeze, parseTag, readFreezes, readRows, voidIndex, type Freeze, type LogRow } from "./lib/log.ts";
import { MAX_RETRIES } from "./lib/retry.ts";
import type { SlotKey } from "./lib/validity.ts";
import { DEFAULT_LOG } from "./lib/record.ts";

const AB = import.meta.dir;
const ROUNDS = 2; // maxReplacementRounds: rounds 0 (first pass), 1 and 2

export class BuildRefused extends Error {}

/** The frozen task.json of a task: tasks/<repo>/<batch>/<task>/task.json. */
export function taskFile(tasksDir: string, repo: string, task: string): string {
  const base = path.join(tasksDir, repo);
  for (const b of fs.existsSync(base) ? fs.readdirSync(base) : []) {
    const f = path.join(base, b, task, "task.json");
    if (fs.existsSync(f)) return f;
  }
  throw new BuildRefused(`no task.json for ${repo}/${task} under ${tasksDir}`);
}
export const symptomsOf = (tasksDir: string, repo: string, task: string): string[] => (JSON.parse(fs.readFileSync(taskFile(tasksDir, repo, task), "utf8")).symptoms ?? []) as string[];

/** Section 11 rule 2: a scored attempt as a result. `graders` = every grader passes (not-applicable ignored; fail or not-run makes it false). */
export function resultOf(r: LogRow): Result {
  const m = r.measure!;
  const e = m.exec;
  return {
    graders: m.graders.filter((g) => g.result !== "not-applicable").every((g) => g.result === "pass"),
    convention: m.judges.convention.verdict,
    business: m.judges.business.verdict,
    scope: m.judges.scope.verdict,
    tokens: { input: e.input, output: e.output, cacheRead: e.cacheRead, cacheWrite: e.cacheWrite, ...(e.incomplete ? { incomplete: true } : {}) },
    costUsd: e.costUsd,
  };
}

/** `voidedUsd`: notional spend of the voided (usage-limit) attempts, reported as its own line of the total spend and in no D5 or scored figure. */
export type Built = { slots: Slot[]; findings: string[]; notes: string[]; voidedUsd: number };

/**
 * `schedule` is only used to attach the scheduled repo to a row (and to name an unscheduled slot, which the analysis then rules INVALID);
 * a scheduled slot with no row is simply not emitted (the analysis counts it absent, section 11 rule 6).
 */
export function buildSlots(rows: LogRow[], schedule: SlotKey[], tasksDir: string, freezeTs?: string): Built {
  const findings: string[] = [];
  const notes: string[] = [];
  const bad = rows.filter((r) => parseTag(r.tag).kind === "other");
  if (bad.length > 0) throw new BuildRefused(`${bad.length} row(s) carry a tag that is neither "measured round <r>" nor smoke, first: ${JSON.stringify(bad[0]!.tag)} (${bad[0]!.arm} ${bad[0]!.task} #${bad[0]!.trial})`);
  const measured = rows.filter((r) => parseTag(r.tag).kind === "measured");
  const smoke = rows.filter((r) => parseTag(r.tag).kind === "smoke").length;
  if (measured.length === 0) throw new BuildRefused(`no measured rows: ${smoke} smoke row(s) are not measurements`);
  if (smoke > 0) notes.push(`${smoke} smoke row(s) skipped`);

  // an attempt a usage limit cut short is voided by an appended void row: it leaves the retry budget, the consecutive-infra counter and the infra share
  const { voided, orphans } = voidIndex(rows);
  // a voided attempt counts nowhere, so only an unvoided one can predate the freeze (the voided pre-freeze pilot rows of Amendments 2 to 4)
  if (freezeTs !== undefined) {
    const early = measured.filter((r) => !voided.has(r) && Date.parse(r.ts) < Date.parse(freezeTs));
    if (early.length > 0) throw new BuildRefused(`${early.length} measured row(s) predate the freeze ${freezeTs}, first at ${early[0]!.ts}`);
  }
  for (const v of orphans) findings.push(`void row at ${v.ts} (${v.arm} ${v.task} #${v.trial} attempt ${v.attempt}) names ${JSON.stringify((parseTag(v.tag) as { ts: string }).ts)}, which is no measured row of that attempt`);
  const kept = measured.filter((r) => !voided.has(r));
  const voidedUsd = [...voided].reduce((n, r) => n + (r.measure?.exec.costUsd ?? r.costUsd ?? 0), 0);
  if (voided.size > 0) {
    const owner = rows.filter((v) => parseTag(v.tag).kind === "void" && v.exit.startsWith("void: owner-ruled")).length;
    notes.push(`${voided.size} attempt(s) voided (${voided.size - owner} usage-limit, ${owner} owner-ruled harness defect; their cost, ${voidedUsd.toFixed(4)} USD, is reported apart from every figure)`);
  }

  const groups = new Map<string, LogRow[]>();
  for (const r of kept) {
    const k = `${r.arm}|${r.task}|${r.trial}`;
    groups.set(k, [...(groups.get(k) ?? []), r]);
  }
  const slots: Slot[] = [];
  for (const g of groups.values()) {
    const head = g[0]!;
    const sched = schedule.find((s) => s.arm === head.arm && s.task === head.task && s.trial === head.trial);
    const id = `${head.arm} ${head.task} #${head.trial}`;
    if (sched && !head.repo.includes(sched.repo)) findings.push(`${id}: row repo ${JSON.stringify(head.repo)} is not the scheduled repo ${sched.repo}`);
    const repo = sched?.repo ?? head.repo;
    if (!sched) notes.push(`${id} is not in the schedule (the analysis will rule the run INVALID)`);
    let symptoms: string[] = [];
    try {
      symptoms = symptomsOf(tasksDir, repo, head.task);
    } catch (e) {
      findings.push(`${id}: ${(e as Error).message}`);
    }
    for (const r of g) if (r.measure === undefined) findings.push(`${id} attempt ${r.attempt}: a measured row without a measure column`);
    if (g.some((r) => r.measure === undefined)) continue;

    const rounds: LogRow[][] = [];
    for (const r of g) {
      const round = (parseTag(r.tag) as { round: number }).round;
      if (round > ROUNDS) findings.push(`${id}: round ${round} is beyond the ${ROUNDS} replacement rounds`);
      (rounds[round] ??= []).push(r);
    }
    let scoredBefore: LogRow | undefined;
    let first: Result | null = null;
    let final: Result | null = null;
    for (let round = 0; round <= ROUNDS; round++) {
      const attempts = (rounds[round] ?? []).slice().sort((a, b) => a.attempt - b.attempt);
      if (attempts.length === 0) continue;
      if (new Set(attempts.map((a) => a.attempt)).size !== attempts.length) findings.push(`${id} round ${round}: duplicate attempt numbers ${attempts.map((a) => a.attempt).join(",")}`);
      if (attempts.length > 1 + MAX_RETRIES) findings.push(`${id} round ${round}: ${attempts.length} attempts > ${1 + MAX_RETRIES}`);
      if (scoredBefore) findings.push(`${id}: round ${round} re-ran a slot already scored in an earlier round`);
      const scored = attempts.find((a) => !isInfraRow(a));
      const afterScored = scored ? attempts.filter((a) => a.attempt > scored.attempt).length : 0;
      if (afterScored > 0) findings.push(`${id} round ${round}: ${afterScored} attempt(s) ran after the scored attempt ${scored!.attempt}`);
      if (scored) {
        if (round === 0) first = resultOf(scored);
        final ??= resultOf(scored);
        scoredBefore ??= scored;
      }
    }
    const infraCostUsd = g.filter(isInfraRow).reduce((n, r) => n + (Number.isFinite(r.measure!.exec.costUsd) ? r.measure!.exec.costUsd : 0), 0);
    slots.push({ arm: analysisArm(head.arm), repo, task: head.task, trial: head.trial, symptoms, first, final, infraCostUsd });
  }
  return { slots, findings, notes, voidedUsd };
}

/** The instant every kept measured row must postdate: the latest freeze line's, or, when it carries over the rows measured since an earlier freeze line's instant, exactly that instant (Amendment 5). Never transitive: the earlier line's own carry-over is not followed. */
export function freezeBoundary(freezes: Freeze[]): string | undefined {
  const latest = latestFreeze(freezes);
  if (latest?.carriesFrom === undefined) return latest?.ts;
  const from = freezes.find((f) => Date.parse(f.ts) === Date.parse(latest.carriesFrom!) && Date.parse(f.ts) < Date.parse(latest.ts));
  if (!from) throw new BuildRefused(`the freeze line of ${latest.ts} carries over the rows measured since ${latest.carriesFrom}, the instant of no earlier freeze line`);
  return from.ts;
}

if (import.meta.main) {
  const argv = process.argv.slice(2);
  const flag = (n: string) => (argv.indexOf(`--${n}`) >= 0 ? argv[argv.indexOf(`--${n}`) + 1] : undefined);
  try {
    const log = path.resolve(flag("log") ?? DEFAULT_LOG);
    const schedule = JSON.parse(fs.readFileSync(path.resolve(flag("schedule") ?? path.join(AB, "schedule.json")), "utf8")) as SlotKey[];
    const built = buildSlots(readRows(log), schedule, path.resolve(flag("tasks") ?? path.join(AB, "tasks")), freezeBoundary(readFreezes(log)));
    for (const n of built.notes) console.error(`note: ${n}`);
    if (built.findings.length > 0) {
      for (const f of built.findings) console.error(`FINDING: ${f}`);
      console.error(`build-slots: ${built.findings.length} finding(s); nothing written`);
      process.exit(1);
    }
    const text = JSON.stringify({ slots: built.slots, voidedUsd: built.voidedUsd }, null, 1);
    if (flag("out")) fs.writeFileSync(path.resolve(flag("out")!), text);
    else console.log(text);
    const lost = built.slots.filter((s) => s.first === null).length;
    console.error(`build-slots: ${built.slots.length} slots of ${schedule.length} scheduled (${lost} infra-lost on the first pass)`);
  } catch (e) {
    console.error(e instanceof BuildRefused ? `REFUSED: ${e.message}` : `ERROR: ${(e as Error).message}`);
    process.exit(e instanceof BuildRefused ? 2 : 1);
  }
}
