---
id: TASK-397
title: "Close the migrate prose gaps the first agent-run found"
priority: P2
size: S
risk: low
autonomy: HITL
class: execution
tier: P
authority: J1
origin: close-retro
state: ready
depends-on: []
---

# TASK-397 — Close the migrate prose gaps the first agent-run found

## Why

SPRINT-111 T4 was the first time an agent ran `migrate` by reading `references/migration-map.md` § v1 → v2 rather than by a scratch
script (T1's proof). The plan step found ten places where the prose was ambiguous, wrong, or impossible to follow literally. The
owner ruled each one at the T4 plan step (Execution Log, 2026-10-02 `scope-change`), so this repo's migration is correct, but the rulings
live only in the Log. A consumer running migrate on their own repo meets the same ten gaps with no ruling to hand (L-015).

The ten, in short:
1. A `## Members` path that moved status folder reads as missing.
2. A Backlog row without `tier:`: is its file withheld?
3. Whether "verbatim" covers inline `#` comments, trailing qualifiers, and parentheticals on enum fields.
4. Slug length versus task-file.md's ≈6 words, and Windows MAX_PATH.
5. The placeholder box text for a missing done-when.
6. A `depends-on:` that carries prose.
7. Splitting lettered done-when clauses.
8. Whether migrate writes an `**open:**` line for a needs-info task.
9. Whether v1_ids means row headers or every TASK-NNN in the Backlog.
10. The by-reference skip for a stale member path.

## Done when

- [ ] Each of the ten gaps has a stated rule in `migration-map.md` § v1 → v2. Each rule is the owner's SPRINT-111 ruling unless re-ruled, and none is left as an open question.
- [ ] `evals/run-v1-to-v2-fixtures.ts` still passes, and a fixture covers each rule a script can check (enum normalisation · `none — but …` · lettered split).

## Touches

skills/lean-doc-generator/references/migration-map.md · evals/run-v1-to-v2-fixtures.ts · evals/fixtures/v1-to-v2/

## Assumes

none

## Tracker

- SPRINT-111 T4 plan step (Execution Log, 2026-10-02) · TASK-370 · TASK-380 · L-015
