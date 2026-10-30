// Run-validity rule (TASK-543), measured on the FIRST pass, before any replacement. Infra-lost trials count not-passed
// operationally but are excluded from every symptom measure and from R-b. R5 (owner ruling): every slot must be filled;
// a slot still infra-lost after the replacement rounds makes the run FAILED -- the denominator is never shrunk.

/** One arm x task x trial slot. `first` / `final` are null while the slot is infra-lost (after the first pass / after the last round). */
export type SlotKey = { arm: string; repo: string; task: string; trial: number };
export type Lost = SlotKey & { firstLost: boolean; finalLost: boolean };

export type ValidityParams = { maxInfraShare: number; cellLimit: number; maxReplacementRounds: number };
export const VALIDITY_DEFAULTS: ValidityParams = { maxInfraShare: 0.05, cellLimit: 1, maxReplacementRounds: 2 };

export type RunState = "VALID" | "INVALID" | "FAILED (owner decides)";
export type Validity = { state: RunState; findings: string[]; expectedSlots: number; firstPassLost: number; finalUnfilled: number };

export const slotId = (s: SlotKey) => `${s.arm}|${s.repo}|${s.task}|${s.trial}`;

/**
 * The state of a run, judged against an independently FROZEN schedule (arm x task x trial, unique keys) passed in separately
 * from the data. A scheduled slot absent from `slots` is infra-lost on the first pass and unfilled after every round; the
 * expected count is the schedule's, so omitting a slot can never shrink it. FAILED outranks INVALID: an unfilled slot needs the owner either way.
 */
export function runValidity(data: Lost[], schedule: SlotKey[], p: ValidityParams = VALIDITY_DEFAULTS): Validity {
  const ids = schedule.map(slotId);
  const dup = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (dup.length > 0) throw new Error(`schedule has duplicate slot keys: ${[...new Set(dup)].join(", ")}`);
  const known = new Set(ids);
  const present = new Map<string, Lost>();
  const findings: string[] = [];
  let invalid = false;
  for (const d of data) {
    const id = slotId(d);
    if (!known.has(id)) {
      invalid = true;
      findings.push(`unscheduled slot in the data: ${id}`);
    } else if (present.has(id)) {
      invalid = true;
      findings.push(`duplicate slot in the data: ${id}`);
    } else present.set(id, d);
  }
  const slots: Lost[] = schedule.map((k) => present.get(slotId(k)) ?? { ...k, firstLost: true, finalLost: true });
  const absent = ids.filter((id) => !present.has(id));
  if (absent.length > 0) findings.push(`${absent.length} scheduled slot(s) absent from the data, counted unfilled: ${absent.slice(0, 5).join(", ")}${absent.length > 5 ? ", ..." : ""}`);
  const lost = slots.filter((s) => s.firstLost);
  const share = slots.length === 0 ? 0 : lost.length / slots.length;
  if (share > p.maxInfraShare) {
    invalid = true;
    findings.push(`infra-lost share ${(share * 100).toFixed(1)}% > ${(p.maxInfraShare * 100).toFixed(0)}% of scored trials (${lost.length}/${slots.length})`);
  }
  const cells = new Map<string, number>();
  for (const s of lost) cells.set(`${s.arm} x ${s.repo}/${s.task}`, (cells.get(`${s.arm} x ${s.repo}/${s.task}`) ?? 0) + 1);
  for (const [cell, n] of cells)
    if (n > p.cellLimit) {
      invalid = true;
      findings.push(`cell ${cell} lost ${n} slots > ${p.cellLimit}`);
    }
  const unfilled = slots.filter((s) => s.finalLost);
  if (unfilled.length > 0) findings.push(`${unfilled.length} slot(s) still infra-lost after ${p.maxReplacementRounds} replacement rounds: ${unfilled.map((s) => `${s.arm} ${s.repo}/${s.task}#${s.trial}`).join(", ")}`);
  const state: RunState = unfilled.length > 0 ? "FAILED (owner decides)" : invalid ? "INVALID" : "VALID";
  return { state, findings, expectedSlots: slots.length, firstPassLost: lost.length, finalUnfilled: unfilled.length };
}

/**
 * Replacement: only infra-lost slots re-run, completed scores are kept, each slot is filled by its first non-infra
 * attempt, at most `maxReplacementRounds` rounds. `rerun` returns true when the slot got a non-infra attempt.
 */
export async function replaceLost<S extends { lost: boolean }>(slots: S[], rerun: (s: S, round: number) => Promise<boolean>, rounds = VALIDITY_DEFAULTS.maxReplacementRounds): Promise<{ roundsUsed: number }> {
  let used = 0;
  for (let r = 1; r <= rounds; r++) {
    const open = slots.filter((s) => s.lost);
    if (open.length === 0) break;
    used = r;
    for (const s of open) if (await rerun(s, r)) s.lost = false;
  }
  return { roundsUsed: used };
}
