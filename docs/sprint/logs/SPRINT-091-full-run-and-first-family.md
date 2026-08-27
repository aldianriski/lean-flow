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

### 2026-08-27 | surprise | pre-dispatch preflight HALTed; D5's ownership map was wrong

**What happened.** Step 3's pre-dispatch preflight (extracted from `dispatch.md` and run against this
Plan) returned **5 FAIL · PREFLIGHT: HALT**, so no wave was dispatched. Scope is unchanged — this is a
declaration defect, not a pivot, which is why it is logged as `surprise` rather than `scope-change`.

**D5 was restated wrongly at the split, by me, in the same sentence that warned against exactly this.**
The corrected map claimed *"no file in this Plan is touched by more than one task"*. It is false, and
the preflight named four pairs I had not seen. The claim was derived by eye from the `Layers:` lines
immediately after removing T8–T11; the mechanical check disagreed, and the mechanical check is right.
The general shape is the one this repo keeps recording: **the map was re-derived by reading, and
reading is what fails — every overlap here was found by a disagreeing tool, none by re-reading the
declaration** (L-165's family).

**Two distinct causes, only one of them a real design conflict.**
1. **A tokenisation defect I introduced.** T3 and T4 declare `packages/standard (traversal · mark-driven
   dispatch)` and `packages/standard (result domain · level arithmetic)`. The preflight's tokeniser
   reduces those parenthetical annotations to bare **`packages/`** — a prefix that contains every rule
   file — so T3/T4 collided with T6/T7 on a subtree they do not actually share. The annotation was for
   human readers and silently widened the declared blast radius. **A `Layers:` entry is machine input,
   not prose.**
2. **A genuine overlap.** T3 (flagless full run) and T5 (caller-supplied spec path) both edit
   `apps/cli` — the same argument parsing. No dependency edge existed between them, and the preflight
   is correct to refuse to parallel-build them.

**Fix applied.** Parentheticals removed from `Layers:` so declarations tokenise to the real subtrees,
and two `Depends-on:` edges added — each justified on its merits, not to silence the checker:
`T5 → T3` (both edit the CLI's argument surface; traversal lands before the spec flag) and
`T6 → T4` (a rule evaluator returns a `RuleEvaluation`, which is the result domain T4 settles). Those
two edges also transitively order T3↔T6, T3↔T7 and T4↔T7.

**Cost, stated plainly:** parallelism drops. The wave rank was `T1=0 T2=0 T3=1 T4=2 T5=1 T6=1 T7=2`
and becomes a longer chain. That is the correct trade — the preflight exists because a parallel build
over a shared file contaminates at the commit phase (L-042/L-037), and a faster wave that corrupts a
merge is not faster.

consequence · T0 · behaviour:low · governance:high
