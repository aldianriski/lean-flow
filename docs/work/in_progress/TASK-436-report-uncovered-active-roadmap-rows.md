---
id: TASK-436
title: "Report uncovered active roadmap rows in /prime, /triage and the promote checklist"
epic: EPIC-022
sprint: SPRINT-126
priority: P1
size: M
risk: low
autonomy: HITL
class: execution
tier: P
authority: J1
origin: decomposer
state: ready
depends-on: [TASK-435]
---

# TASK-436 — Report uncovered active roadmap rows in /prime, /triage and the promote checklist

## Why

A roadmap row nothing is delivering looks exactly like one in progress until someone reads every task file. The epic-coverage
reports already make that gap visible for epics; the roadmap needs the same read, through the same procedure.

## Done when

- [ ] One coverage procedure (the epic-coverage reference, generalised) covers both an active epic's open Closed-when lines and
      a roadmap's `active` rows, with the same verdicts (covered · uncovered — unmarked · stale — done/cancelled/missing ·
      epic not active).
- [ ] `/prime`'s single `Coverage:` row counts uncovered epic conditions and roadmap rows together (e.g. `2 uncovered (EPIC-015 ×1 ·
      roadmap P2a)`), omitted only when there is neither an active epic nor a roadmap; `skills/prime/SKILL.md` stays ≤ ~140 lines.
- [ ] `/triage` lists each uncovered roadmap row in the epic line shape (`roadmap · P2a · "<outcome, ~60 chars>" · uncovered (…)`).
- [ ] Promote's governance checklist gains `☐ roadmap coverage: <findings|none>` — reported for the owner to sign, never a refusal.
- [ ] Exercised on a scratch repo whose roadmap holds one covered, one stale, one unmarked active row and one planned row: each
      caller reports exactly the stale and unmarked active rows, and the planned row is exempt.

## Touches

- skills/lean-doc-generator/references/epic-coverage.md · skills/prime/SKILL.md · skills/triage/SKILL.md ·
  skills/lean-doc-generator/SKILL.md (promote checklist)

## Assumes

- the rule and the row format are TASK-435's; this task only reads them.
- the scratch-repo exercise is a reading of each procedure against fixed input (Tier P: G1 + a read-through + one real run).

## Tracker

- EPIC-022 Closed-when 4 · owner ruling 2026-10-18: skills report, promote warns, no conformance rule
