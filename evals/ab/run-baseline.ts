// The A0 + A1 baseline driver (SPRINT-152 T4): walks evals/ab/schedule.json in order, one trial at a time, and runs each slot through the
// documented trial path (A1: the D9 protocol, A0: the plain trial, both measured), tagging every attempt `measured round <r>`.
//   bun evals/ab/run-baseline.ts [--round 0|1|2] [--log <md>] [--schedule <json>] [--prereg <md>] [--tasks <dir>]
//   bun evals/ab/run-baseline.ts --void <ts> [--log <md>]     (repair: append the void row of the attempt row stamped <ts>)
//   bun evals/ab/run-baseline.ts --void <ts> --reason "<text>" [--log <md>]     (owner-ruled harness defect, Amendment 2: the void row carries the reason as `void: owner-ruled: <text>`; the slot re-runs from round 0 as if never run)
// Round 0 is the schedule; rounds 1 and 2 re-run only the slots every earlier round lost to infrastructure (PREREGISTRATION section 11).
// It resumes from the log (slot + round), so it is safe to start again after any stop. It stops, mechanically, for the operator rules of
// section 18 and section 12; each stop has its own exit code:
//   0 round complete   10 pilot done (owner review)   11 usage-missing / source-mutated / invalid:* (owner ruling)
//   12 three consecutive infra attempts (owner ruling)   3 subscription usage limit (attempt voided, nothing scored; start again later)
//   2 refused (freeze, lock, round, pin)   1 error
// It refuses to start any slot before the freeze line in the log header, and while the pre-registration differs from the latest freeze.
// An owner-stop row (usage-missing / source-mutated / invalid:*) that classifies as infra is still an infra attempt: after the stop, a new
// start retries that slot (frozen behaviour, section 12); one that classifies as a task failure is scored and the slot stands.
// The log is append-only. A subscription usage limit is recorded by APPENDING a void row after the attempt's row, tagged
// `measured round <r> void <ts of the attempt row>` with the same arm / task / trial / attempt; every count (budget, streak, slots) skips the
// attempt a void row names. If the driver dies between the attempt row and its void row, that attempt counts as a normal one until the gap is
// repaired by hand: find the attempt's `ts` in the log and run `bun evals/ab/run-baseline.ts --void <ts>` (or append the void row yourself).
// A deadline kill (exit `timeout`) is never voided as a usage limit: the deadline is ours, not the subscription's.
// Maintainer-only and paid: every attempt is a real Opus session. Never part of `bun test` or the gate.
import { createHash } from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { taskFile } from "./build-slots.ts";
import { loadArm } from "./lib/arm.ts";
import { defaultWorkRoot, sweepStale } from "./lib/isolate.ts";
import { loadTask } from "./lib/grade.ts";
import { freezeProblem, isInfraRow, liveRows, measuredTag, parseTag, readRows, voidTag, voidIndex, type LogRow } from "./lib/log.ts";
import { runProtocolTrial } from "./lib/protocol.ts";
import { appendRow, DEFAULT_LOG } from "./lib/record.ts";
import { isInfra, MAX_RETRIES, type AttemptClass } from "./lib/retry.ts";
import { ArmRefused, PinRefused, runTrial } from "./lib/trial.ts";
import type { SlotKey } from "./lib/validity.ts";

const AB = import.meta.dir;
const ABORT_AFTER = 3;
const OWNER_STOP = /^(?:usage-missing|source-mutated:|invalid:)/;
/** The CLI's subscription-limit message (not an API rate limit, which is infra and retried). Matched on the attempt's terminal text only. */
const USAGE_LIMIT = /(?:usage|5-hour|weekly|monthly|session|daily) limit|hit your (?:\w+ )?limit|out of (?:extra )?usage/i;
export const isUsageLimit = (terminal: string | undefined): boolean => terminal !== undefined && USAGE_LIMIT.test(terminal) && !/rate[ _-]?limit/i.test(terminal);

export class Refused extends Error {}
/** The pilot size: one slot per distinct (arm, repo) pair of the schedule. Refuses a schedule whose first N slots do not hold each pair exactly once. */
export function pilotSize(schedule: SlotKey[]): number {
  const key = (s: SlotKey) => `${s.arm}|${s.repo}`;
  const n = new Set(schedule.map(key)).size;
  const first = new Set(schedule.slice(0, n).map(key));
  if (first.size !== n || schedule.length < n) throw new Refused(`pilot: the first ${n} slots must hold each (arm, repo) pair exactly once, they hold ${first.size} distinct`);
  return n;
}
export type Ctx = { slot: SlotKey; round: number; attempt: number; tag: string };
/** What one attempt reports back; the attempt's row is already in the log, appended by the trial. */
export type Outcome = { exit: string; cls: AttemptClass; terminal?: string | undefined };
export type Deps = {
  log: string;
  prereg: string;
  schedule: SlotKey[];
  /** run exactly one attempt and append exactly one row tagged `ctx.tag`; never called concurrently */
  run: (ctx: Ctx) => Promise<Outcome>;
  now?: () => number;
  say?: (line: string) => void;
};
export type StopKind = "done" | "pilot" | "owner" | "abort" | "usage-limit";
export const EXIT_CODE: Record<StopKind, number> = { done: 0, pilot: 10, owner: 11, abort: 12, "usage-limit": 3 };
export type Result = { stop: StopKind; message: string; ran: Ctx[] };

const slotName = (s: SlotKey) => `${s.arm} ${s.task} #${s.trial}`;
const sameSlot = (r: LogRow, s: SlotKey) => r.arm === s.arm && r.task === s.task && r.trial === s.trial;

/** Measured, un-voided rows of the log, in run order: the only rows that count toward budgets, resume and the infra streak. */
const countedRows = (log: string): LogRow[] => liveRows(readRows(log));
const roundOf = (r: LogRow) => (parseTag(r.tag) as { round: number }).round;

type SlotState = { scored: boolean; infra: number };
function stateIn(rows: LogRow[], s: SlotKey, round: number): SlotState {
  const mine = rows.filter((r) => sameSlot(r, s) && roundOf(r) === round);
  return { scored: mine.some((r) => !isInfraRow(r)), infra: mine.filter(isInfraRow).length };
}
const lostIn = (st: SlotState) => !st.scored && st.infra >= 1 + MAX_RETRIES;

/** The slots a round still has to run, in schedule order. Throws Refused when an earlier round is unfinished. */
export function pendingSlots(rows: LogRow[], schedule: SlotKey[], round: number): SlotKey[] {
  const out: SlotKey[] = [];
  for (const s of schedule) {
    if (round > 0) {
      let scoredBefore = false;
      for (let q = 0; q < round; q++) {
        const st = stateIn(rows, s, q);
        if (st.scored) scoredBefore = true;
        else if (!lostIn(st) && !scoredBefore) throw new Refused(`round ${round}: ${slotName(s)} is unfinished in round ${q} (${st.infra} infra attempt(s), none scored); finish round ${q} first`);
      }
      if (scoredBefore) continue; // a replacement round re-runs only the slots every earlier round lost
    }
    const st = stateIn(rows, s, round);
    if (!st.scored && !lostIn(st)) out.push(s);
  }
  return out;
}

/** Append the void row of an attempt row (never edits the log): same arm / repo / task / trial / attempt, the attempt's `ts` in its tag. */
export function appendVoid(log: string, attempt: LogRow, reason?: string): void {
  const t = parseTag(attempt.tag);
  if (t.kind !== "measured") throw new Error(`row ${attempt.ts} is not a measured attempt (tag ${JSON.stringify(attempt.tag)})`);
  appendRow(log, { tag: voidTag(t.round, attempt.ts), arm: attempt.arm, repo: attempt.repo, task: attempt.task, trial: attempt.trial, attempt: attempt.attempt, graders: "void", tokens: null, costUsd: null, wallS: 0, exit: reason === undefined ? "void: usage-limit" : `void: owner-ruled: ${reason}`, pins: {}, raw: {}, passed: false });
}

/** The row the attempt just appended: the last measured row of this slot, round and attempt. */
function rowOfAttempt(log: string, ctx: Ctx): LogRow {
  const mine = readRows(log).filter((r) => r.tag === ctx.tag && r.arm === ctx.slot.arm && r.task === ctx.slot.task && r.trial === ctx.slot.trial && r.attempt === ctx.attempt);
  const last = mine.at(-1);
  if (!last) throw new Error(`no row of ${slotName(ctx.slot)} attempt ${ctx.attempt} tagged "${ctx.tag}" to void`);
  return last;
}

export async function runBaseline(round: number, d: Deps): Promise<Result> {
  const say = d.say ?? (() => {});
  const ran: Ctx[] = [];
  const stop = (kind: StopKind, message: string): Result => ({ stop: kind, message, ran });
  if (![0, 1, 2].includes(round)) throw new Refused(`--round must be 0, 1 or 2, got ${round}`);

  const at0 = countedRows(d.log);
  const pilot = d.schedule.slice(0, pilotSize(d.schedule));
  const pilotDone = (rows: LogRow[]) => pilot.every((s) => stateIn(rows, s, 0).scored);
  const pilotPending = round === 0 && !pilotDone(at0);
  // the run-order streak of infra attempts; a streak that already aborted a run was ruled on by the owner (this start), so it restarts at 0
  let streak = 0;
  for (const r of at0.slice().reverse()) {
    if (!isInfraRow(r)) break;
    streak++;
  }
  if (streak >= ABORT_AFTER) streak = 0;

  for (const slot of pendingSlots(at0, d.schedule, round)) {
    const rows = countedRows(d.log);
    const have = stateIn(rows, slot, round);
    for (let attempt = have.infra + 1; attempt <= 1 + MAX_RETRIES; attempt++) {
      const problem = freezeProblem(d);
      if (problem) throw new Refused(problem);
      const ctx: Ctx = { slot, round, attempt, tag: measuredTag(round) };
      say(`round ${round}: ${slotName(slot)} attempt ${attempt}`);
      const out = await d.run(ctx);
      ran.push(ctx);
      // only a run that ended on its own can be a usage limit; a deadline kill (exit timeout) is ours and is scored as the amendment says
      if (out.cls !== "ok" && out.exit !== "timeout" && isUsageLimit(out.terminal)) {
        appendVoid(d.log, rowOfAttempt(d.log, ctx));
        return stop("usage-limit", `subscription usage limit on ${slotName(slot)} attempt ${attempt}: the attempt is voided (void row appended), nothing was scored; start again later (the slot re-runs from this attempt)`);
      }
      streak = isInfra(out.cls) ? streak + 1 : 0;
      if (OWNER_STOP.test(out.exit)) return stop("owner", `${slotName(slot)} ended ${out.exit.split(":")[0]}: this needs an owner ruling (PREREGISTRATION section 12); start again to let the slot stand as not-passed and continue`);
      if (streak >= ABORT_AFTER) return stop("abort", `${ABORT_AFTER} consecutive infra attempts (last: ${slotName(slot)} attempt ${attempt}, ${out.cls}): aborted for an owner ruling`);
      if (!isInfra(out.cls)) break;
    }
    if (pilotPending && pilotDone(countedRows(d.log))) return stop("pilot", `the ${pilot.length} pilot slots each have a scored round-0 attempt: stopped for the owner's review of cost and behaviour`);
  }
  return stop("done", `round ${round} complete`);
}

/** The lock lives in the OS temp dir (never beside the log in docs/), one per log path. */
export const lockPathFor = (log: string): string => path.join(os.tmpdir(), `ab-baseline-${createHash("sha1").update(path.resolve(log).toLowerCase()).digest("hex").slice(0, 12)}.lock`);
const pidAlive = (pid: number): boolean => {
  try {
    process.kill(pid, 0);
    return true;
  } catch (e) {
    return (e as NodeJS.ErrnoException).code === "EPERM";
  }
};

/** One trial at a time, enforced across processes: the lock file holds the owner's pid, is created exclusively and removed when the run ends. A lock whose pid is dead is stale: removed with a note. */
export async function withLock<T>(lock: string, fn: () => Promise<T>, note: (line: string) => void = (l) => console.error(l)): Promise<T> {
  let fd: number | undefined;
  for (let tries = 0; fd === undefined; tries++) {
    try {
      fd = fs.openSync(lock, "wx");
    } catch {
      const pid = Number(fs.existsSync(lock) ? fs.readFileSync(lock, "utf8").trim() : NaN);
      if (tries === 0 && Number.isInteger(pid) && pid > 0 && !pidAlive(pid)) {
        note(`note: removed a stale lock ${lock} (pid ${pid} is not running)`);
        fs.rmSync(lock, { force: true });
        continue;
      }
      throw new Refused(`${lock} is held by pid ${Number.isFinite(pid) ? pid : "?"}: another driver is running`);
    }
  }
  try {
    fs.writeSync(fd, String(process.pid));
    return await fn();
  } finally {
    fs.closeSync(fd);
    fs.rmSync(lock, { force: true });
  }
}

/** The real attempt: the same calls run-trial.ts makes for `--measured` (A1 with `--protocol d9`), one attempt, the repo column set to the scheduled repo. */
export function realRun(tasksDir: string, log: string): Deps["run"] {
  const workRoot = defaultWorkRoot();
  return async (ctx) => {
    const arm = loadArm(path.join(AB, "arms", `${ctx.slot.arm}.json`));
    if (!arm.snapshot) throw new Refused(`arm ${arm.id} has no frozen snapshot`);
    const opts = { arm, task: loadTask(taskFile(tasksDir, ctx.slot.repo, ctx.slot.task)), srcRepo: arm.snapshot, repo: ctx.slot.repo, trial: ctx.slot.trial, attempt: ctx.attempt, workRoot, logPath: log, tag: ctx.tag, measure: {} };
    const t = await (arm.plugin ? runProtocolTrial : runTrial)(opts);
    return { exit: t.exit, cls: t.cls!, terminal: t.terminal };
  };
}

if (import.meta.main) {
  const argv = process.argv.slice(2);
  const flag = (n: string) => (argv.indexOf(`--${n}`) >= 0 ? argv[argv.indexOf(`--${n}`) + 1] : undefined);
  try {
    const log = path.resolve(flag("log") ?? DEFAULT_LOG);
    const voidTs = flag("void");
    const reason = flag("reason")?.trim();
    if (reason !== undefined && (reason === "" || voidTs === undefined)) throw new Refused("--reason needs --void <ts> and a non-empty text");
    if (voidTs !== undefined) {
      await withLock(lockPathFor(log), async () => {
        const rows = readRows(log);
        const target = rows.find((r) => r.ts === voidTs && parseTag(r.tag).kind === "measured");
        if (!target) throw new Refused(`no measured attempt row stamped ${voidTs} in ${log}`);
        if (voidIndex(rows).voided.has(target)) throw new Refused(`the attempt stamped ${voidTs} is already voided`);
        console.log(`run-baseline: voiding ${target.arm} ${target.task} #${target.trial} attempt ${target.attempt}: exit ${JSON.stringify(target.exit)}, graders ${JSON.stringify(target.graders)}${reason === undefined ? "" : `, reason ${JSON.stringify(reason)}`}`);
        appendVoid(log, target, reason);
        console.log(`run-baseline: void row appended for ${target.arm} ${target.task} #${target.trial} attempt ${target.attempt} (${voidTs})`);
      });
      process.exit(0);
    }
    const deps: Deps = {
      log,
      prereg: path.resolve(flag("prereg") ?? path.join(AB, "PREREGISTRATION.md")),
      schedule: JSON.parse(fs.readFileSync(path.resolve(flag("schedule") ?? path.join(AB, "schedule.json")), "utf8")) as SlotKey[],
      run: realRun(path.resolve(flag("tasks") ?? path.join(AB, "tasks")), log),
      say: (l) => console.log(l),
    };
    const r = await withLock(lockPathFor(log), async () => {
      sweepStale(defaultWorkRoot(), (l) => console.log(`run-baseline: ${l}`)); // the lock is ours, so every iso-* dir is a dead driver's
      return runBaseline(Number(flag("round") ?? 0), deps);
    });
    console.log(`run-baseline: ${r.stop}: ${r.message} (${r.ran.length} attempt(s) this start)`);
    process.exit(EXIT_CODE[r.stop]);
  } catch (e) {
    const refused = e instanceof Refused || e instanceof PinRefused || e instanceof ArmRefused;
    console.error(`${refused ? "REFUSED" : "ERROR"}: ${(e as Error).message}`);
    process.exit(refused ? 2 : 1);
  }
}
