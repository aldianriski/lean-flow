---
id: TASK-659
title: "Add three review rules: coverage and limitations, fixer becomes builder, replaced-behaviour sweep"
sprint: SPRINT-174
type: feature
priority: P2
size: S
risk: low
autonomy: HITL
class: execution
tier: P
authority: J1
origin: decomposer
state: ready
depends-on: []
---

# TASK-659 — Add three review rules: coverage and limitations, fixer becomes builder, replaced-behaviour sweep

## Why

claudex-loop's review results state what was read and what was not. Ours can return a bare "CLEAR" that
read nothing, which happened on a Codex pass on 2026-10-06. Two smaller rules come from the same source.

## Done when

- [x] Every review result carries a coverage statement (the files and criteria the reviewer read) and a ✓ read-through of review-scoping.md § What every review result states against the box; scoped Sonnet review CLEAR, 2026-11-13
      limitations statement (what it could not read or check). This holds for code reviews and for intake
      and proposal draft reviews, whoever the reviewer is and with cross-model routing off. A result
      missing either is sent back to the same reviewer once, and is not recorded as a passed review until
      it has both.
- [x] The review reference says a coordinator who edits a task's work files after that task's review has ✓ the fixer-becomes-the-builder bullet in the revise loop names ticks, status moves, Execution Log lines and sprint-file lines as excluded; scoped Sonnet review CLEAR
      become a builder, and that edit needs a fresh review before the tick. Coordinator bookkeeping
      (ticks, status moves, log and sprint-file lines) is excluded by name.
- [x] The review reference says that when a revision to a draft, design or plan replaces a behaviour, the ✓ the sweep rule sits in § What every review result states, between the revise loop and draft reviews, and draft-review step 4 points at it; scoped Sonnet review CLEAR
      reviser searches the whole document for the replaced condition and changes or marks every passage
      that still states it, acceptance criteria included. The rule sits where both the revise loop and
      draft reviews read it.
- [x] Each rule is exercised once on real input, with the result recorded in this task: one real scoped ✓ 2026-11-13: (a) the scoped Sonnet review of b63dd0d4 ended with what it read and what it could not check; (b) the coordinator's follow-up edit to review-scoping.md after that review got a fresh scoped Sonnet review, CLEAR with both statements; (c) that edit replaced the word retry for the re-ask, and the sweep found and fixed two passages still using it (the same section and the CHANGELOG entry)
      review whose result shows both statements; one real coordinator edit after a review that gets its
      fresh review; one real revision where the sweep is run and its hits listed.
- [x] Negative: a reviewer reply of "CLEAR" with no coverage statement is not recorded as a passed review. ✓ judgment tick, no mechanical test reaches reviewer prose: a fresh agent given only review-scoping.md and a bare CLEAR sent it back once, wrote no review line, and counted a second incomplete reply as not run
- [x] CHANGELOG line. ✓ entry under Unreleased

## Touches

skills/orchestrator/references/review-scoping.md · skills/orchestrator/references/builder-check.md (only if
its brief needs the two statements) · CHANGELOG.md

## Assumes

- A1: these are reviewer-brief and procedure rules, not a checker, gate leg or record field, so ADR-053's
  freeze does not apply.
- A2: `skills/orchestrator/SKILL.md` is at its line cap, so every rule lands in `references/`.
- A3: the existing `review ·` record line is unchanged; coverage and limitations live in the review report.

## Tracker

- `docs/research/claudex-loop-delta.md`, keepers 2 to 4
- Intake review: Codex round 1, 2026-11-13, no high finding; its medium on draft reviews is applied in box 1.
