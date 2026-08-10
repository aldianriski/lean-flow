---
sprint: 059
slug: prove-the-run-finished
owner: Maintainer
last_updated: 2026-08-10
status: active
gates_signed: G1,G2 @ 4d6e855
plan_commit: 4859353
close_commit: [sha — set at close]
update_trigger: sprint execute/close events
---

# SPRINT-059 — Prove the Run Finished

> **Theme:** The field report from the first unattended run gave twelve findings; nine were about
> *getting the run started* and shipped as v1.31.0. The three left are a worse class — they survive a
> perfect allowlist. A `sprint-bulk` loop ended after 4 of 7 units with every commit correct, the tree
> clean, and an exit of `success`; nothing anywhere said three tasks were never attempted. This sprint
> makes a run's completion legible. Finding 12 constrains *how*: the same run was later asked, in plain
> language, to write its rollup and re-check its parks, and did neither while completing all its work —
> so a step nothing depends on is not a step, and the repair goes at the exit path as structure.

## Scope

**In:** an `unattempted` state and a rollup block emitted at every exit · the launcher writing that
rollup and the calibration row from outside the model · a gate that FAILs a recorded run missing
either · a park re-check at task boundaries · the two field-report runs added to the calibration table.

**Out (deferred):** findings 1–9 (shipped v1.31.0 — verified, not assumed) · a hook or harness of
lean-flow's own, which the plugin does not ship and this sprint does not introduce · rewriting the
Part 3 watchdog, which stays a consumer-side pattern · TD-046 / TASK-180 gate-runtime work, still P2.

## Plan

### T1 — Define the unconditional exit rollup, with `unattempted` `[size: M · risk: med · class: decision · HITL]`
Layers: `skills/orchestrator/references/night-run.md` (Part 2, Part 4) · `skills/orchestrator/SKILL.md` (sprint-bulk 4–5) · `.claude/CONTEXT.md` (§ Gates unattended block, if it quotes the state list)
Depends-on: none

Nothing can emit or enforce a format that does not exist, so the format lands first. Today the rollup
is non-green-only and its state list has no word for a task nobody started — which is exactly why a run
that never reached a blocker writes nothing at all, and the morning reader following Part 4's own
instruction sees a clean page.

**Acceptance:** a reader handed run 1's real outcome (4 of 7 units, tree clean, exit `success`) can see
from the specified rollup alone that three tasks were never attempted.

**DoD:**
- [x] `unattempted` is defined in Part 4 alongside `done | blocked | parked-hitl | denied-tool | stalled`, with its own next-action, distinguished from `blocked` (which was reached) and `parked-hitl` (which was a contract decision)
- [x] Part 4 specifies a rollup block emitted at **every** exit, headed by an `N of M DoD ticked` line, so a short run is visible without a blocker having occurred
- [x] Part 2's trigger recipe carries the continue-until-exhausted instruction — the work half, which run 2 demonstrated *does* hold
- [x] `sprint-bulk` steps 4 and 5 both route to the rollup; the CONTEXT § Gates unattended block agrees if it quotes the states (wiring check, L-020)
- [x] Traced once against run 1's numbers, in the Execution Log: what the morning reader saw then, what they would see now
<!-- QA: docs change, no tests; the trace is the exercise-on-real-input (L-007). -->

### T2 — Emit the rollup + calibration row from the launcher's exit path `[size: M · risk: high · class: decision · HITL]`
Layers: `scripts/night-run.sh` · `skills/orchestrator/references/night-run.md` (Part 2, Part 3, Part 4) · `docs/adr/ADR-016-rollup-at-the-exit-path.md` · `docs/DECISIONS.md` · `docs/knowledge-index.md` (generated)
Depends-on: T1
Cites: T3

The launcher already wraps the fired command to capture its exit code — that wrapper is the only
exit-path structure lean-flow ships, and it runs whether or not the model remembered anything. Putting
the rollup there is what converts a request into a guarantee. The trade is real and belongs in an ADR:
it reaches only consumers who use the launcher.

**Acceptance:** a real finished run leaves a rollup block and a calibration row in the Execution Log
with no human transcribing them — the thing that did not happen either time in the field report.

**DoD:**
- [x] After the fired command exits, the launcher counts DoD boxes in the active sprint file and appends the T1 rollup block
- [x] It reads `total_cost_usd`, `num_turns` and `duration_api_ms` off the last `result` event of the stream-json log and appends the Part 4 calibration row
- [x] No `jq` and no new dependency — the script stays dependency-free POSIX sh, as it is today
- [x] Fires only for a `sprint-bulk unattended` run, and is skippable
- [x] Exercised once on a real finished run, never a synthetic log (L-007)
- [x] **ADR-016** records where enforcement lives and names the launcher-only reach as an accepted trade, with the docs path serving everyone else; a row is added to `docs/DECISIONS.md`
<!-- QA: shell change — exercise on a real run; T3 is its regression guard. -->

### T3 — Gate the rollup: a recorded run without one FAILs `[size: M · risk: low · class: execution · AFK]`
Layers: `scripts/lib/check-night-run-rollup.sh` (new) · `scripts/qa-check.sh` · `evals/run-night-run-rollup-fixtures.sh` (new) · `evals/fixtures/night-run-rollup/` · `docs/adr/ADR-016-rollup-at-the-exit-path.md` (vocab fix this task surfaced) · `docs/knowledge-index.md` (generated)
Depends-on: T1
Cites: T2

T2 emits; this refuses to let a missing one pass. That pairing is what makes the step gated the way a
commit is rather than merely requested — finding 12's own prescription. It follows the existing
checker-plus-fixture-runner convention rather than inventing one.

**Acceptance:** a fixture sprint log recording a completed unattended run with no rollup FAILs the gate
with a named finding; a well-formed one passes.

**DoD:**
- [x] A new checker FAILs, with its own named finding, when a sprint Execution Log records a completed unattended run carrying no rollup block
- [x] It FAILs separately, with a distinct named finding, when the calibration row is missing
- [x] Retained must-FAIL fixtures: one missing-rollup, one missing-calibration-row, one well-formed pass — one fixture per check, each failing with its *named* finding (L-058), retained rather than deleted with the prototype (TD-012)
- [x] Wired into the always-on gate and its fixture runner; the gate stays green overall
- [x] Reads one file rather than sweeping the repo — the runtime cost is stated in the Execution Log, since TD-046 / TASK-180 is measuring exactly this
<!-- QA: the fixtures ARE the test; a checker with no must-FAIL fixture is the silent false-negative L-058 names. -->

### T4 — Re-check open parks at task boundaries `[size: S · risk: med · class: decision · HITL]`
Layers: `skills/orchestrator/references/night-run.md` (Part 0 park protocol) · `skills/orchestrator/SKILL.md` (sprint-bulk step 5 pointer) · `scripts/night-run.sh` (the `grep -c` fallback bug this task surfaced) · `evals/assert-park-revisit.sh` · `evals/selftest-assert-park-revisit.sh` · `evals/fixtures/park-revisit/` · `scripts/qa-check.sh` (opt-in harness list)
Depends-on: T1

The park protocol assumes a park outlives the run. It can also name an unblock condition the same run
satisfies two tasks later — typically a file-ownership order — and nothing re-examines it, so the
condition is met and the park just sits there, surviving as a morning to-do that never needed to be one.

**Acceptance:** the protocol, walked against the field report's real case, revisits the park — a field
parked for the renderer, three later tasks owning that renderer.

**DoD:**
- [x] Part 0's park protocol gains a re-check step: when a park's unblock condition names a later task in the same Plan, re-examine open parks as each subsequent task takes ownership
- [x] A park still not actionable at exit gets a rollup line (T1's format) rather than silence
- [x] `sprint-bulk` step 5 points at it (wiring check, L-020)
- [x] A sibling behavioural assertion joins the existing park assertions, exercised on the field report's case
- [x] The unattended-only boundary is stated explicitly, with its reasoning — an interactive park reaches a human at first-blocker halt
<!-- QA: assertion sits beside assert-boundary-park.sh / assert-noaction-park.sh. -->

### T5 — Add the two field-report runs to the calibration table `[size: S · risk: low · class: execution · AFK]`
Layers: `skills/orchestrator/references/night-run.md` (Part 4 rows table)
Depends-on: none
Cites: T2

The table has three rows, all `coordinator + N agents`. These are its first `inline` rows, and its
first from a host that is not ours — so the shape column and the "read it loosely" caveat both carry
real weight here.

**Acceptance:** a reader sizing a future run can see both runs, their shape, and why the per-unit
comparison against the existing rows is loose.

**DoD:**
- [x] Run 1 recorded: $23.04 · 178 turns · 64 min · 4 of 7 units · inline
- [x] Run 2 recorded: $18.26 · 140 turns · 45 min · 3 of 3 units · inline
- [x] The honest reading is attached: $5.90 per unit delivered against the table's $8.27 and $5.42, but those are dispatched two-unit runs on a lighter repository — the comparison is loose and says so
- [x] The figure that transfers is stated: zero denials across 318 turns after $1.77 of probing, against a predecessor run that lost ~40% of its turns to denials
- [x] The table records that both rows were reconstructed by hand from the harness payload — T2's justification, sitting in the data

## Decisions (pre-locked)

- **D1** — Enforcement for the dropped-bookkeeping class goes at the **launcher exit path** (T2) plus a
  **gate checker** (T3), not into better-worded trigger instructions; run 2 proved the instruction path
  fails for exactly these steps while succeeding for work. **→ ADR-016** — it is hard-to-reverse
  (consumers build around where the rollup comes from), surprising (the fix for a model behaviour is a
  shell script), and a real trade (it reaches only launcher users).
- **D2** — Shared-file ownership: T1, T2, T4 and T5 all touch `night-run.md`. **T1 owns it first and
  alone**; T2, T4, T5 follow in that order, each staging its own hunks (`git add -p` + verify
  `git diff --cached`), never a plain `git add` over another task's WIP (L-042 · L-037). T3 touches no
  file the others do.

## Assumptions

- **A1** — Findings 1–9 are genuinely closed at 1.32.0. *Confirm: verified at decomposition against
  night-run.md Parts 0–4 and the v1.31.0 CHANGELOG block — read, not inferred from the version number.*
- **A2** — The park re-check binds the **unattended** protocol only; an interactive park reaches a human
  at first-blocker halt. *Confirm: T4's G2 pass may widen it; the boundary is stated in the doc either way.*
- **A3** — A script may write into a committed doc. *Confirm: `scripts/gen-index.sh` already generates
  `docs/knowledge-index.md`; the pattern is established, not new.*
- **A4** — `jq` is not available. *Confirm: the launcher is dependency-free POSIX sh today and T2's DoD
  keeps it that way.*
- **A5** — A fifteenth gate harness costs runtime while TD-046 / TASK-180 measures it. *Confirm: T3
  records its measured cost in the Execution Log; a named trade, not a hidden one.*
- **A6** — The rollup format must exist before anything emits or enforces it. *Confirm: encoded as the
  T1 → T2/T3/T4 dependency; this sprint cannot fully parallel-build.*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-059-prove-the-run-finished.md`, rendered from
> `templates/sprint-log.md.template` and created lazily at the first entry. Append there, never here.

## Files Changed

<!-- Filled during execution; feeds CHANGELOG at close. -->

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro

<!-- Written at close. Route the buckets to durable homes (DOCS_Guide §10):
     shipped → CHANGELOG.md · tech debt → TD-NNN · follow-ups → TASK-NNN · learnings → docs/LEARNINGS.md.
     After close, the file moves → docs/sprint/archive/ + a one-line entry in docs/sprint/INDEX.md (§11). -->

**Retrieval check** — did we fail to find, or contradict, a prior `L-NNN`/ADR this sprint?

**Cost** — what this sprint cost to run, and in what shape (inline · coordinator + N agents). Cost per
unit **delivered**, not attempted. Unavailable → say so rather than omitting the line.

**Worked**

**Friction**

**Pattern candidate** (surface to user → `docs/LEARNINGS.md`)
