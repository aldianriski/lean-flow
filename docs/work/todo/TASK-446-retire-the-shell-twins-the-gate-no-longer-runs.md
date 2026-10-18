---
id: TASK-446
sprint: SPRINT-128
title: "Retire the Shell twins the gate no longer runs, and the reaper's unreachable v1 branch"
epic: EPIC-022
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

# TASK-446 — Retire the Shell twins the gate no longer runs

## Why

The gate runs only the TS versions of the layers-observed and authority checkers; their Shell twins are reached only by opt-in
oracle and differential harnesses, so every TS change must be mirrored or a differential goes red. ADR-050 already stops growing
those pairs, and a deletion is unfrozen work (ADR-053). The reaper still carries a v1 branch with its own Plan parsing (TD-049),
although v1 trees are refused since 2.0 (ADR-046).

## Done when

- [ ] `check-layers-observed.sh` and `check-authority.sh` are deleted with the opt-in harnesses that exist only to compare them,
      and `layers_tokens` moves into `check-layers-completeness.sh`, which stays as the dispatch preflight's parity oracle.
- [ ] The reaper's v1 branch is deleted after showing no supported path reaches it.
- [ ] No prose names a deleted file as live (the qa-check lists, `dispatch.md`, `night-run.md`), and the bare gate and
      `QA_FULL=1` both stay green.

## Touches

- scripts/lib/check-layers-observed.sh · scripts/lib/check-authority.sh · scripts/lib/check-layers-completeness.sh ·
  scripts/night-run.sh · scripts/qa-check.sh · evals/ · skills/orchestrator/references/dispatch.md ·
  skills/orchestrator/references/night-run.md

## Assumes

- A2: `check-layers-completeness.sh` sources `layers_tokens` from `check-layers-observed.sh`, so it moves before the delete.
- A3: the v1 branch is unreachable; checked at G1 before anything is deleted.

## Tracker

- EPIC-022 Closed-when 7 · TD-049 · ADR-050 #3 · owner ruling 2026-10-18 (retire observed.sh + authority.sh, keep completeness.sh)
