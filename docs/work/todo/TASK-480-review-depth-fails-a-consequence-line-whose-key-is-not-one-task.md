---
id: TASK-480
title: "review-depth fails a consequence line whose key is not one task"
priority: P2
size: S
risk: low
autonomy: HITL
class: execution
tier: G
authority: J1
origin: decomposer
state: ready
depends-on: []
---

# TASK-480 — review-depth fails a consequence line whose key is not one task

## Why
TD-099 (medium, narrowed at SPRINT-136 promote): `check-review-depth.sh` reads a consequence line only when its key is
`T<digits>`; any other key (`pre-T1`, `T2,T3`, `close`) is skipped by both the vocabulary check and the absence check, so
SPRINT-087's `consequence · pre-T1 · behaviour:low · governance:high` passed green while review was owed. Census 2026-10-22:
24 such lines exist, all in archived logs (which the checker skips by ruling), 0 in live logs. Owner ruling: FAIL every non-`Tn`
key, matching the documented grammar `consequence · Tn · …` (review-scoping.md); reuse the existing
`review-depth-consequence-vocab` finding. This also ends coordinator-scoped records (`close`, `promote`, `scope-change`; real
ones exist, e.g. the SPRINT-095 and SPRINT-097 logs): the owner ruled it at intake with the census in view, admitted on TD-099's
measured omission (a `governance:high` record passed green while its review was owed), since a key the checker cannot tie to one
task is exactly the record it cannot verify. Tier G (other), as TASK-471 on this same checker last sprint: it reads lean-flow's
own logs in lean-flow's own gate; no adopter runs it. G2 review-round cap: 2.

## Done when
- [ ] A consequence line whose key is not exactly one `T<digits>` (`pre-T1`, `T2,T3`, `T1-T5`, `close`) FAILs
      `review-depth-consequence-vocab`, naming the key, whether or not a review record exists. A well-formed line behaves as today.
- [ ] Retained must-FAIL fixture carrying TD-099's own line `consequence · pre-T1 · behaviour:low · governance:high` FAILs by name,
      beside a well-formed sibling case that stays green; every prior review-depth case keeps its verdict.
- [ ] Real-artifact run: SPRINT-087's archived log, copied to a non-archived temp path, FAILs by name on its `pre-T1` lines (before
      the fix: PASS); the gate's review-depth leg over the live tree stays green.
- [ ] TD-099 marked resolved in `TECH-DEBT.md`.

## Touches
the review-depth checker · its fixture harness and fixtures · `TECH-DEBT.md`

## Assumes
- Coordinator-scoped events (`close`, `promote`, `scope-change`) have no consequence-line form after this; writing one FAILs. The
  owner accepted this with the census in view.
- Archived logs stay skipped (the SPRINT-084 ruling), so no historical log reddens the gate.

## Tracker

- TD-099 · intake draft reviewed by Codex 2026-10-22 (APPROVE WITH FIXES, folded in before approve)
