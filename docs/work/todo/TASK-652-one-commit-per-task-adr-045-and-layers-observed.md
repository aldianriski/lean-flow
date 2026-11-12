---
id: TASK-652
title: "Let a task's own work commit carry its tick and status move: amend ADR-045 D6 and teach layers-observed the member's own task file"
epic: EPIC-025
sprint: SPRINT-173
priority: P1
size: S
risk: med
autonomy: AFK
class: execution
tier: G
authority: J1
origin: decomposer
state: ready
depends-on: []
---

# TASK-652 — One commit per task: ADR-045 D6 amendment and layers-observed

## Why

Measured cost (EPIC-025): of SPRINT-169 to 171's 93 non-work commits, 56 are moves, progress and close/index records. R14 (moves in their own commit, 13 + 11 + 2 commits) needs ADR-045 D6 amended, by owner ruling. L-258 is the known trap: a `Tn:` commit that touches its own task file fails `layers observed`. Admitted on a measured cost;
the deletion side of the epic is unfrozen. G2 review-round cap: 2. Other G (maintainer gate; not an engine rule).

## Done when

- [ ] ADR-045 D6 carries a dated amendment that all of a task's moves (`in_progress`, `done`) and its ticks ride in that task's own work commits. Bare `sprint(N):` commits remain only for moves without a work commit (cancel, de-scope, promote's backlog to todo). The bisect cost the original D6 named is acknowledged.
- [ ] `check-layers-observed.ts` admits `docs/work/<folder>/TASK-N-*.md` in a commit whose subject or `Task:` trailer names TASK-N or its `Tn`. A retained must-FAIL fixture for the L-258 case (a `sprint(N) Tn:` commit with its own move and tick) passes, and its assertion count and sibling controls are unchanged.
- [ ] `evals/layers-observed.test.ts` and the layers-observed fixture harness are green on the full gate.
- [ ] Negative: a `sprint(N) Tn:` commit that touches a **different** task's file, or a `docs/work` file belonging to no member, still fails `layers observed` by name (`member-out-of-layers` or the unattributed finding). Seeding the old narrow rule back reddens exactly the L-258 case while the sibling control stays green.

## Touches

`docs/adr/ADR-045-*.md`; `scripts/lib/check-layers-observed.ts`; `evals/layers-observed.test.ts`; `evals/run-layers-observed-test-fixtures.ts` and its fixture directory.

## Assumes

- Amendment scope: all of a task's moves ride in its work commits (owner: "All of its moves").
- The skill text that tells people to do this lands in TASK-656 and TASK-657.

## Tracker

EPIC-025 condition 2 and Scope "ticks and status moves"; R14; L-258; owner popup, 2026-11-12.
