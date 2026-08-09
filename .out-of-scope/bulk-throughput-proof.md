---
owner: Maintainer
last_updated: 2026-08-09
status: current
update_trigger: The revisit-if condition fires, or the expiry passes
---

# Out of scope — prove bulk throughput on one real night run (was TASK-148)

**Decision (SPRINT-051 promote, 2026-08-09): routed out.** Not rejected on merit — the calibration
goal is sound. Routed because its `done-when` has been **unsatisfiable by construction** for three
consecutive promotes, and a task that cannot be planned is not a backlog entry, it is a wish.

## What it asked for

> a ≥10-task Plan promoted and fired unattended; ≥8 units landed; calibration row recorded in
> `night-run.md` with cost · turns · wall-clock · units · shape

## Why it could never be promoted

The backlog has never held ten ready, AFK-suitable tasks at one time. Across SPRINT-048 → SPRINT-050
it held between one and three `ready` tasks at each promote, and the sprints that ran carried two to
seven. The threshold was written when the log split (ADR-014) raised the *capacity* ceiling to ~12
tasks, and capacity was mistaken for supply: the constraint on our sprint size is how much work is
groomed and ready, not how many lines a Plan file can hold.

That is L-088's shape in a backlog entry — a figure written before the thing it bounds was measured,
then carried forward unexamined because it kept reading as settled. Its own `assumes:` line said the
log split was "the binding constraint"; it was not.

## What is genuinely lost

The **calibration series** — cost per unit delivered across differing run shapes — remains thin.
SPRINT-041 contributed one data point ($6.60, two units, fan-out) and SPRINT-043 a second. Nothing has
been added since, and every night-run cost estimate is still extrapolating from two points. That gap
is real and is *not* closed by this routing; it is simply not closed by an unpromotable task either.

A smaller task would serve it better: record a calibration row for **whatever** unattended run next
happens, at whatever size, rather than gating the measurement on a ten-task Plan that has never
existed. If the series matters, file that instead.

## Revisit if

- The backlog carries **≥10 ready, AFK-suitable tasks at a single promote** — the original trigger,
  unchanged, now written down where it can actually be checked.
- **Or** the owner lowers the threshold to a figure a real Plan reaches (≥4 tasks was the shape
  discussed at the SPRINT-051 promote), at which point this becomes a fresh, promotable task rather
  than a revival of this one.

## Expiry

**Unfired by SPRINT-060 promote → auto-close as permanently rejected.** The null result is itself a
verdict rather than a drift toward never (L-068). If the calibration series still matters at that
point, the answer is the smaller task described above, not this one.
