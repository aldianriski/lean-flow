---
id: TASK-647
title: "Measure SPRINT-169 and SPRINT-170 under EPIC-025 D4 and test the SPRINT-171 baseline"
epic: EPIC-025
priority: P1
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

# TASK-647 — Measure SPRINT-169 and SPRINT-170 under EPIC-025 D4 and test the SPRINT-171 baseline

## Why

EPIC-025's first open question: the targets in D4 rest on SPRINT-171 being a fair baseline. Measured cost basis is ADR-053 §4 (see the epic); this task adds no machinery.

## Done when

- [ ] `docs/research/process-cost-census.md` has a Baseline section giving, for SPRINT-169, 170 and 171: plan_commit, close_commit, member count, non-work commits (subject matches neither `sprint(N) Tn:` nor `fix(` in `<plan_commit>^..<close_commit>`), non-work per member, and first-run close-gate FAIL count, each with the command that produced it.
- [ ] The section states each sprint's difference from SPRINT-171 as a percentage and whether it exceeds one third. If one does, it proposes the median baseline and re-derived half-targets, and the owner's ruling is recorded, not assumed.
- [ ] A first-run FAIL count the logs cannot support is written `unknown`, with the reason.
- [ ] Each non-work count is cross-checked by a second query that varies the selection: work + non-work = total commits in the range, and a `git log --grep` count of work subjects agrees.
- [ ] Negative: SPRINT-171's stated figures (59 commits, 43 non-work, 12 first-run FAILs) are re-measured, not copied, and a mismatch is reported, never silently overwritten.

## Touches

`docs/research/process-cost-census.md` (new). Everything else read-only.

## Assumes

- Plan and close commits are read from each sprint file's frontmatter, never inferred by grep.

## Tracker

EPIC-025 Open questions, first bullet (baseline fairness); Closed-when #1.
