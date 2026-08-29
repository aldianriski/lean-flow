---
sprint: 092
slug: the-conversions-measured-delta
stream: engine
owner: Maintainer
last_updated: 2026-08-29
status: active
update_trigger: appended at each execute/close event — append-only, never edited
---

# SPRINT-092 — Execution Log

> Append-only sibling of the frozen Plan (ADR-014). The § Plan is frozen at promote; a mid-sprint
> scope shift is logged **here** before the Plan is edited.

---

### 2026-08-29 | progress | G1 + G2 signed; one Layers declaration corrected before the first task

**Gates signed at `760dc69`** — the tree they were reviewed against, not a later one. G1 took the
**fast-path**: all four tasks are `origin: decomposer` and met the intake grill, so the question was
"scope unchanged since approval?" rather than the full checklist. The only delta since decomposition is
that `TASK-313`/`TASK-314`'s dependencies were *delivered* by SPRINT-091 and their `depends-on` lines
were repaired at promote.

**Both assumptions confirmed before G2, because an unconfirmed `assumes:` blocks it.**
**A1** (only the engine-spawn term is removed) — confirmed **as a magnitude, not a precise split**:
Round 10 measured engine share at 88.2–89.6%, but Round 11's own correction heading records that
`non-engine` is *derived by subtraction* and wrapper overhead is unquantified, so unaccounted cost lands
silently in that residual. Carried into G2 with that limit stated rather than as a clean confirm.
**A2** (the always-on leg is where §4's cost sits) — confirmed directly:
`run-adr-family-fixtures.sh` is present in `eval_harnesses_always` (1 of 31 harnesses) and is recorded
at 30.0 s.

**Owner ruling at G2 — T2's coverage relocation is acceptable as designed.** What moves to the opt-in
profile is the *differential parity against Shell*, not §4 coverage: SPRINT-091 T12 wired the §4
evaluators into `composedDispatch`, so §4 still evaluates in TS on every gate run. **T2's fourth DoD
stays the binding one** — semantic coverage unchanged, not merely relocated — and its FAIL blocks the
tick rather than being read around (ADR-021).

**A `Layers:` declaration was corrected at G2, before any task ran (L-100).** T3 declared a bare
`evals/` directory, which the ownership map derives from — and a directory declaration *swallows*
`evals/run-night-run-rollup-fixtures.sh`, which the concurrent `autonomy` stream owns. The D-rows
already fixed this in prose, but the pre-dispatch preflight reads `Layers:`, not prose, so the
declaration would have reported a genuine cross-stream collision. Narrowed to
`evals/run-adr-family-fixtures.sh`. **L-100's point exactly: a `Layers:` line is a live declaration
corrected per task, not a frozen prediction to defend** — so this is logged and continued, not argued.

**And the correction had to be made twice, which is the part worth recording.** The first narrowing left
the phrase "narrowed from the bare `evals/`" in the explanatory tail — backticked — and
`check-layers-completeness.sh` parses backticked tokens on a declaration line as declarations. The
directory came straight back in through prose *about* removing it. That is **TD-119's class for the
fourth time this session** and L-108's shape underneath it: a parser matching a token wherever it
appears, including inside the note explaining why the token should not be there.

Checkers after the correction: `check-layers-completeness` · `check-verify-reaches` · `check-authority`
— **0 FAIL each** across both Plans.
