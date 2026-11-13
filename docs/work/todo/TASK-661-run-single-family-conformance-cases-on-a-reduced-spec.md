---
id: TASK-661
title: "Run the single-family conformance-harness cases on a reduced spec so the local gate fits its budget"
type: debt
sprint: SPRINT-175
priority: P2
size: M
risk: med
autonomy: HITL
class: execution
tier: G
authority: J2
origin: decomposer
state: ready
depends-on: []
---

# TASK-661 — Run the single-family conformance-harness cases on a reduced spec so the local gate fits its budget

## Why

Measured cost (ADR-053 §4), `docs/research/logs/qa-gate-timing.md` Round 25: on the Windows maintainer host the default-profile gate ran
703 s, 513 s and 522 s on one day against a 520 s budget, so the same tree passes one run and is cut short the next.
`evals/run-conformance-engine-fixtures.sh` is 219 s of a 483 s profiled run. Inside it, 38 engine calls hand over the full
`spec/STANDARD.md` and take 164.8 s; 25 of those are `s11-*` cases (131.3 s) that each test one §11 rule. TD-171 names this
lever ("a second, narrower lever") and counted 7 such calls at SPRINT-103.

tier note: consequential G (ADR-050). The harness guards an engine file `conformance.sh` executes, so a case that passes
vacuously after this change is a false negative that reaches an adopter.

review cap: 2 rounds at G2 (ADR-053).

## Done when

- [ ] Every harness case that tests one rule family and today runs the engine on the full `spec/STANDARD.md` runs it on a
      spec reduced to the rules that case exercises. The reduced spec is derived from `spec/STANDARD.md` when the harness
      runs, never a hand-copied table. The task's first step lists the population from a fresh trace of the harness: every
      engine call that names the full spec, by case name, recorded in this task (Round 25 counted 38 by prefix and named
      none). Each listed case is either changed, or kept on the full spec with its reason written beside it in the harness.
- [ ] Discrimination is kept, case by case: for every changed case, the break it guards (the rejected design, or its
      assertion broken) is seeded in turn and reddens exactly that case on the reduced spec while a sibling control stays
      green. Each seed is shown to have landed (`cmp` against pristine), the harness still parses, keeps its assertion
      count and stays within one line of its length, and the tree is restored under one hash convention (`git hash-object <p>` equals `git rev-parse <ref>:<p>`).
- [ ] No assertion is lost: every PASS name the harness prints before the change is printed after it, compared by name,
      and the count of `PASS` lines does not drop.
- [ ] The engine is unchanged: `scripts/lib/conformance-engine.sh`, `scripts/lib/read-spec-rules.sh` and `conformance.sh`
      are byte-identical to their pre-task blobs.
- [ ] Measured on the Windows host with at least 3 GB free and nothing else running: the harness alone, three runs before
      and three after, and the default-profile gate twice after. All figures are appended to the timing log as a new
      round. The gate completes un-truncated in both runs; if it does not, the figures are recorded and the owner rules.
- [ ] The off-host `QA_FULL=1` gate passes, and a worktree-isolated outside review of the change is recorded.
- [ ] Negative: a reduced spec that leaves out a rule a case depends on makes the harness FAIL by name; no case passes
      because its rule is absent, including the cases that assert a finding is not reported. Every reduced spec is guarded
      by an anchor check on the rule rows its cases assert, in the pattern the harness already uses for its existing
      reduced specs. One retained must-FAIL fixture shows the guard firing, with a sibling control that stays green.
- [ ] TD-171's summary is corrected with Round 25's split (engine calls 83%, fixture construction 17% on Windows) and its
      second lever marked as done by this task.

## Population (T1 step 1, fresh trace at `d491ba1a`)

Every engine call in `evals/run-conformance-engine-fixtures.sh` that passes the full `--spec "$spec"`: **38**, matching Round 25.
Selection: `grep -nE 'sh "\$(engine|_e)".*--spec "\$spec"'`, then calls expanded through the two helpers. Cross-checked against
Round 25's prefix count (25 `s11-*` + 13 others = 38).

- **Changed, retention family → `S11.BACKLOG` only (25):** `s11_check` ×23 (`s11-live-citation-in-open-task-keeps-it` ·
  `s11-MUST-FAIL-ON-OLD-pre-change-engine-flags-it` · `s11-control-uncited-still-flagged` · `s11-live-citation-in-context-md-keeps-it` ·
  `s11-zero-padded-citation-counts-by-number` · `s11-control-archive-citation-does-not-keep-it` · `s11-control-history-*` ×9 ·
  `s11-control-whole-word-only-TASK-3570-does-not-keep-357` · `s11-control-worktree-copy-citation-ignored` · `s11-control-history-*` ×5 (indexes,
  case variants) · `s11-live-citation-in-non-ascii-path-keeps-it`) and the fail-safe loop ×2 (`s11-failsafe-xargs-*` · `s11-failsafe-cat-*`).
- **Changed, worktree family → `S2.R-PLACEMENT` + `S12.SECRETS` (6):** `wt_out` for `worktree-placement-ignored` ·
  `worktree-placement-control-outside-still-fails` · `worktree-placement-ignored-bracketed-root` · `worktree-placement-bracketed-root-control-still-fails` ·
  `worktree-s12-ignored` · `worktree-s12-control-outside-still-fails`.
- **Kept on the full spec (7), reason beside each in the harness:** `rule-unimplemented-is-named` · `gap-is-labelled-gap-and-does-not-set-exit` ·
  `real-finding-still-fails` · `judgment-and-impl-directed-never-verdicts` · `no-unrecognized-mark` · `no-score-grade-percentage-or-ratio` ·
  `every-fail-names-its-rule` (+ `suffix-preserves-negations`, which reads the same output).

## Touches

evals/run-conformance-engine-fixtures.sh · evals/fixtures/ (one retained fixture, if the Negative needs a file) ·
docs/research/logs/qa-gate-timing.md · TECH-DEBT.md

## Assumes

- A1: the saving is unmeasured. 100 to 120 s is an estimate from Round 25's per-call averages; the Done-when asks for
  figures, and sets no number the work must hit.
- A2: the engine is out of scope (ADR-043 bounds any change to it by its consumer contract).
- A3: the harness already builds reduced specs for other cases, so the derivation is reuse, not a new mechanism. G2
  confirms which helper, by reading the harness.
- A4: no new shell script. The change is inside the existing harness; a new helper, if one is needed, is TypeScript on Bun.
- A5: some cases exist to exercise full-spec dispatch, or negate rules outside their own family, and must keep the full
  spec. Which ones is a case-by-case reading at G2, not a sweep.
- A6: intake review, 2026-11-13: the Codex call timed out on a network failure and counts as no review; the fallback
  Sonnet reviewer returned NOT CLEAR with two medium findings (the population was not enumerable from the log, and one
  fixture could not rule out a vacuous pass across the changed cases). Both are applied above; no high finding, so no
  second round.

## Tracker

- TD-171 (second lever) · `docs/research/logs/qa-gate-timing.md` Round 25 · owner ruling 2026-11-13 "Reduced specs per case (Recommended)"
- Unblocks the ruling on TASK-367.
