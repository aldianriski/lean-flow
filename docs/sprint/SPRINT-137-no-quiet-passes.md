---
sprint: 137
slug: no-quiet-passes
owner: Maintainer
last_updated: 2026-10-22
status: active
plan_commit: df202bb6
gates_signed: G1,G2 @ 8b5bb8e4
update_trigger: sprint execute/close events
---

# SPRINT-137 — No Quiet Passes

> **Theme:** the third fixes-only TD burn-down. Each fix turns a silent pass into a named result: an epic index row that can no
> longer drift unseen, a pass-count parse with a retained must-FAIL, a consequence key the review-depth check reads, and an
> annotation that no longer buys an exemption. Defect fixes only, which ADR-053 leaves unfrozen. Ships as a PATCH.

## Scope

**In:** live epic index rows carry no member-sprint state (`478`, TD-163) · a retained must-FAIL for the harnesses' ANSI
pass-count parse (`479`, TD-165) · review-depth fails a consequence key that is not one task (`480`, TD-099) · epic-archive's
unbalanced annotation, suffix anchor and frontmatter-only member list (`481`, TD-148 items 2, 4, 5).
**Out (deferred):** TD-194 (worktree typecheck; owner ruling at intake) · TD-148 items 3, 6, 7 · TD-165's clock-input sighting ·
TD-171 (a Tier G port) · the frozen-machinery rows (TD-153 · 152 · 212 · 166 · 164 · 052) · owner-ruling rows (TD-155 · 134 ·
061 · 128) · TD-117 · 090 · 201 · 081 · the consequence-line grammar itself (review-scoping.md is unchanged) · the frozen
`check-epic-archive.sh` twin.

## Members

- docs/work/todo/TASK-478-live-epic-index-rows-carry-no-member-sprint-state.md
- docs/work/todo/TASK-479-a-retained-must-fail-for-the-harnesses-ansi-pass-count-parse.md
- docs/work/todo/TASK-480-review-depth-fails-a-consequence-line-whose-key-is-not-one-task.md
- docs/work/todo/TASK-481-epic-archive-unbalanced-annotation-suffix-anchor-frontmatter-only-members.md

## Plan

### T1 — Keep member-sprint state out of live epic index rows `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `docs/epic/INDEX.md` · `TECH-DEBT.md`
  · `docs/work/todo/TASK-478-live-epic-index-rows-carry-no-member-sprint-state.md`
  · `docs/work/in_progress/TASK-478-live-epic-index-rows-carry-no-member-sprint-state.md`
  · `docs/work/done/TASK-478-live-epic-index-rows-carry-no-member-sprint-state.md`
Depends-on: none
Cites: `TASK-478` · TD-163 · `spec/STANDARD.md`

Tier P: the owner ruled to remove the content the `update_trigger` cannot cover rather than widen the trigger.

**Acceptance:** the index header states what a live row may hold, and every live row holds only that.

### T2 — Retain a must-FAIL for the ANSI pass-count parse `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `evals/dod-delta.test.ts` · `evals/run-dod-delta-fixtures.sh` · `TECH-DEBT.md`
  · `docs/work/todo/TASK-479-a-retained-must-fail-for-the-harnesses-ansi-pass-count-parse.md`
  · `docs/work/in_progress/TASK-479-a-retained-must-fail-for-the-harnesses-ansi-pass-count-parse.md`
  · `docs/work/done/TASK-479-a-retained-must-fail-for-the-harnesses-ansi-pass-count-parse.md`
Depends-on: none
Cites: `TASK-479` · TD-165 · `evals/run-authority-fixtures.sh` · `evals/run-doc-caps-fixtures.sh` ·
  `evals/run-epic-archive-fixtures.sh` · `evals/run-layers-completeness-fixtures.sh` · `evals/run-night-run-rollup-fixtures.sh` ·
  `scripts/qa-check.sh`

Other G. The test is hosted in the dod-delta suite, so no harness is added and the gate's harness list does not change.

**Acceptance:** every harness's pass-count parse is tested against a captured ANSI sample, and a stripless parse reddens it.

### T3 — Fail a consequence key that is not one task `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `scripts/lib/check-review-depth.sh` · `evals/run-review-depth-fixtures.sh` · `evals/fixtures/review-depth/` ·
  `TECH-DEBT.md`
  · `docs/work/todo/TASK-480-review-depth-fails-a-consequence-line-whose-key-is-not-one-task.md`
  · `docs/work/in_progress/TASK-480-review-depth-fails-a-consequence-line-whose-key-is-not-one-task.md`
  · `docs/work/done/TASK-480-review-depth-fails-a-consequence-line-whose-key-is-not-one-task.md`
Depends-on: none
Cites: `TASK-480` · TD-099 · TD-244 · `skills/orchestrator/references/review-scoping.md` · `scripts/qa-check.sh` ·
  `scripts/lib/check-layers-completeness.ts`

Other G, as TASK-471 on this checker (owner ruling at intake, over Codex's consequential-G reading).

**Acceptance:** TD-099's `pre-`-keyed consequence line FAILs by name, and every well-formed record keeps its verdict.

### T4 — Epic-archive reads three more inputs correctly `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `scripts/lib/check-epic-archive.ts` · `evals/epic-archive.test.ts` · `TECH-DEBT.md`
  · `docs/work/todo/TASK-481-epic-archive-unbalanced-annotation-suffix-anchor-frontmatter-only-members.md`
  · `docs/work/in_progress/TASK-481-epic-archive-unbalanced-annotation-suffix-anchor-frontmatter-only-members.md`
  · `docs/work/done/TASK-481-epic-archive-unbalanced-annotation-suffix-anchor-frontmatter-only-members.md`
Depends-on: none
Cites: `TASK-481` · TD-148 · `scripts/lib/check-epic-archive.sh` · `evals/epic-archive-differential.test.ts` ·
  `scripts/qa-check.sh`

Other G. Regression cases go in the TypeScript suite, so the frozen Shell/TS differential population does not grow.

**Acceptance:** an unbalanced annotation earns no foreign exemption, both suffix anchors are tested, and the member list is
read from frontmatter only.

## Decisions (pre-locked)

- **D1** — The four tasks touch disjoint code files, so they can run in parallel. `TECH-DEBT.md` is shared by all four: the
  coordinator writes each resolution serially, and builders do not touch it. `CHANGELOG.md` is the coordinator's, at close.
  Status moves, log and sprint-file edits commit as bare `sprint(137):` (CONTEXT § Sprint model, L-238).
- **D2** — From T3 on, the coordinator writes one `consequence · Tn ·` line per task in this sprint's log, never a multi-task
  or event key, because T3 makes any other key a FAIL in a live log.

## Assumptions

- **A1** — No live log carries a non-`Tn` consequence key, so T3 does not redden the gate. *Confirm: G2 census; system verify.*
- **A2** — The six harness parse lines are identical apart from the input variable and indentation. *Confirm: G2.*
- **A3** — T4's changes move no real epic verdict (no real epic has an unbalanced annotation or a body `member_sprints:`
  line). *Confirm: G2; T4's before/after real run.*

## Execution Log

> **Lives in its own file** — [`logs/SPRINT-137-no-quiet-passes.md`](logs/SPRINT-137-no-quiet-passes.md) (STANDARD §9 ·
> ADR-014). Append there, never here.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro
