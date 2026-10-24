---
sprint: 137
slug: no-quiet-passes
owner: Maintainer
last_updated: 2026-10-24
status: closed
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
| `docs/epic/INDEX.md` | T1 | the header says a live row holds status and a pointer, never member-sprint state | Low | read back 8 live rows |
| `evals/dod-delta.test.ts` · `evals/run-dod-delta-fixtures.sh` | T2 | every harness's pass-count parse runs over a captured ANSI sample, with a stripless control; floor 111 | Low | harness 111/0; seeded strip revert 110/1 |
| `scripts/lib/check-review-depth.sh` | T3 | a consequence key that is not one `T<digits>` FAILs `review-depth-consequence-vocab` | Med | fixtures green; SPRINT-087 log PASS → FAIL ×8 |
| `evals/run-review-depth-fixtures.sh` · `evals/fixtures/review-depth/` | T3 | must-FAIL `pre-T1` and `T2,T3` cases beside a green sibling | Low | the runner itself |
| `scripts/lib/check-epic-archive.ts` · `evals/epic-archive.test.ts` | T4 | unbalanced annotation is unparsed; both suffix anchors tested; `member_sprints:` from frontmatter only | Med | suite 60/0; real run byte-identical; seeded anchor removals 59/1 each |
| `TECH-DEBT.md` | coord | TD-163 · 099 resolved; TD-165 · 148 narrowed; TD-267 filed and widened | Low | read back |

## Retro

**Retrieval check** — no prior `L-NNN` or ADR was contradicted. Two promoted rules recurred. The 10-23 scope-change entry named
a checker outside T3's `Cites:` and was never re-run through the gate's `--scope-change` mode (L-224, ninth sighting). The
merge-back re-ran each task's harness but not the typecheck leg, so T2's two `noUncheckedIndexedAccess` errors reached system
verify (L-218, third sighting). Both were caught only by the close's full gate.

**Cost** — per the log: 1 Codex review at intake, 4 builder checks, 3 worktree builders (T1 inline), 3 scoped reviews and 1
bounded retry (T4). The close session dispatched nothing. Three QA_FULL runs on the VPS, two red: one on the run's own
environment (`git clean -x` removed the clone's dev dependencies), one on a real defect. Four members, 16 DoD.

**Worked**
- Every tick was re-proved on main before it was written: harnesses re-run, three seeded reverts restored to the `HEAD` hash,
  and SPRINT-087's log run through both the old and the new checker.
- T2's population came out the same by two selection rules (live `bun test` call vs live `n_pass` parse: 6 = 6), and T3's
  SPRINT-087 FAIL count matched its own 5 `pre-T1` lines.
- The `TECH-DEBT.md` single-owner rule (D1) held again: no merge-back conflict.

**Friction**
- T2–T4 sat merged and reviewed with every box unticked across a session boundary. Prime reported 13 open DoD for finished work.
- The `pre-T1` record key misled two checkers. TD-267 now names both sites.

**Pattern candidate** — none new; both misses are recurrences of promoted rules, recorded as sightings.
