---
id: TASK-354
title: "Give the `dod-delta` leg a ruled-exemption declaration, so a historical mis-attribution stops blocking every close"
priority: P2
size: S
risk: low
autonomy: HITL
class: execution
tier: G
authority: J1
origin: close-retro
state: ready
---

# TASK-354 — Give the `dod-delta` leg a ruled-exemption declaration, so a historical mis-attribution stops blocking every close

## Why

origin note: SPRINT-102 close; NOT grilled at intake, so no G1 fast-path

SPRINT-102's close ran on a true FAIL it could not fix forward — `b89d6f0` ticked
one of T2's DoD under a `sprint(102) T4:` subject, and a tick lives in a commit's
diff, so no later commit un-ticks it. The leg's only exemptions are structural, so
the remedies were a five-commit history rewrite or an owner ruling. **TD-166** is
the row; **L-205** is the class: the leg's population is `plan_commit..HEAD` over a
NON-recursive `docs/sprint/SPRINT-*.md` glob, and `close` archives the Plan out of
that glob — so the finding clears *by closing*, while ADR-021 blocks the close on
it. A guard whose findings are cleared only by passing it generates rulings, not
fixes.

## Done when

- [ ] A commit whose cross-task DoD tick has been **ruled** by the owner can be declared in a file the checker reads — `.conformance-exempt`'s ADR-031 shape (a reasoned exemption the tool parses), never a prose note in a sprint log — and `check-dod-delta.ts` reports it as a named, visible exemption rather than either a FAIL or a silent pass. Fixture: a declared commit reports the exemption and a sibling UNDECLARED cross-task tick still FAILs in the same run.

## Touches

- `scripts/lib/check-dod-delta.ts` · `evals/dod-delta.test.ts` · `evals/fixtures/dod-delta/` · `evals/run-dod-delta-fixtures.sh` (the `min_tests` floor moves with any new case — declared here because SPRINT-102 twice changed it undeclared, L-100)

## Assumes

none

## Tracker

- TD-166 · L-205 · ADR-031 (the declaration shape to mirror) · ADR-021 (the rule that makes this blocking)
