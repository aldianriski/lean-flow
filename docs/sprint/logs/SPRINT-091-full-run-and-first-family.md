---
sprint: 091
slug: full-run-and-first-family
owner: Maintainer
last_updated: 2026-08-27
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-091 — Execution Log

> Append-only companion to [`../SPRINT-091-full-run-and-first-family.md`](../SPRINT-091-full-run-and-first-family.md).
> Uncapped by design: this file grows with the work done, which is exactly why it is not inside the
> Plan's 400-line budget (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.

### 2026-08-27 | scope-change | G1 sized the Plan `L`; split at the T7/T8 seam, T8–T11 deferred

**What broke.** The Plan froze at promote carrying **11 tasks / 35 DoD**. Batch G1 sized that `L`
against this repository's own record — the last eleven sprints average **4.6 tasks** and the maximum
ever completed is **8** (SPRINT-087), so 11 is 37% above the historical ceiling. The corroborating
figure is the sharper one: all **8 of SPRINT-087's tasks were revised once and none cleared first
review**, and every task here carries the same ADR-029 Tier G/X bar. G1's rule is mechanical — an `L`
splits before proceeding — so the Plan could not be run as frozen.

**Why it was not caught at promote.** It should have been. `promote`'s own size-check reads *"a
`[size: L]` **task** is split before it is rendered, never after"*, and it passed on its literal terms:
every one of the eleven tasks is `S` or `M`. The `L` here is a property of the **batch**, which only
G1 measures — and G1 runs after the Plan is frozen and committed. CONTEXT.md § Gates predicts this
exact cost in its own parenthetical. The promote report flagged that G1 *might* rule it `L` and named
the seam, then rendered all eleven anyway: the risk was named and not acted on, which is why this
entry exists rather than a cheaper pull-time adjustment. **Learning candidate → `/insights`:** a
size-check that enumerates task sizes is read as exhaustive and never asks whether the *batch* is `L`
(the L-108 family — an enumeration standing in for the structural question).

**Impact.**
- § Plan drops **T8–T11**; SPRINT-091 becomes **T1–T7, 7 tasks / 24 DoD** — at SPRINT-085's size.
- Deliverable is unchanged in kind and narrower in span: the engine runs *whole* and **F6 §4 migrates
  complete** (all five rules). § Closed-when **2** is still reachable inside this sprint.
- The **speed payoff moves to SPRINT-092** — factories, the harness conversion, parity relocation and
  the measured delta travel together as one coherent 4-task sprint rather than as the tail of an
  over-long one. `TASK-313` · `TASK-314` · `TASK-315` · `TASK-316` were never removed from the
  `TODO.md` Backlog (removal happens at close, not promote), so nothing needs restoring — they are
  promotable as-is once this sprint closes.
- **D5's overlap map narrows** and must be restated, not inherited: `scripts/qa-check.sh` was owned by
  T1 → T9 → T10 and is now touched by **T1 alone**; `docs/research/logs/qa-gate-timing.md` was T2 → T11
  and is now **T2 alone**. A stale ownership map is worse than none, because it names a commit order
  for tasks that are no longer in the Plan.
- **A4 leaves this sprint with T9.** The assumption that the ADR-family harness's git-repo construction
  survives conversion belongs to the conversion; it is re-declared in SPRINT-092, not carried here.
- **A1 stays open and stays owned by T2** — the TS-vs-Shell per-invocation claim is still unmeasured,
  and T2 still exists in this sprint to close it. The split does not defer the measurement.

**Re-confirm G2.** Required before any implementation: the design gate is re-run over the reduced
seven-task Plan with the corrected D5 ownership map, not inherited from the eleven-task sign-off. G1
and G2 were both unsigned at the time of this entry (`gates_signed:` absent), so nothing approved is
being revoked — the batch simply had not been signed yet.

consequence · T0 · behaviour:low · governance:high
