---
id: TASK-476
title: "verify-reaches recognises a TypeScript checker"
sprint: SPRINT-136
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

# TASK-476 — verify-reaches recognises a TypeScript checker

## Why

Defect fix (ADR-053 §3, unfrozen). TD-191 (medium): the reachability checker extracts only `.sh` names from a `Verify:`
clause, so a clause naming a TypeScript checker reads as a judgment tick and passes silently, now that the guards are TS.
Other G. G2 review-round cap: 2.

## Done when

- [x] A `Verify:` clause naming a `.ts` path or a `bun <path>` invocation is read as mechanical, the same as a `.sh` path. ✓ `fe5dc392`: clauseScripts takes .sh|.ts; bun <path>.ts read as mechanical (bun-form fixture)
- [x] Retained fixtures: an absent `.ts` checker FAILs EXISTS by name; a present, reachable one passes; a present one whose scope ✓ ts-absent FAILs verify-method-absent; ts-present-reaches PASS; // and JSDoc unreachable FAIL verify-does-not-reach-target; harness 27/0
      does not reach the criterion's target FAILs by name.
- [x] Real-artifact run: TD-191's motivating clause is replayed through the clause reader (or a non-archived temporary fixture that ✓ TD-191 verbatim clause in a non-archived temp sprint: NOTE mechanical 0 -> 1
      keeps member resolution) and yields a non-zero mechanical count. Archived sprint files are skipped by design, so the
      archived file itself cannot be the run.
- [x] TD-191 marked resolved in `TECH-DEBT.md`. ✓ `87227227`: TD-191 resolved; residuals TD-266

## Touches

the verify-reaches checker and its fixtures · `TECH-DEBT.md`

## Assumes

- `bun <path>` and a bare `.ts` path are the only TypeScript invocation shapes a `Verify:` clause uses today; G2 censuses the
  live and archived clauses to confirm.

## Tracker

- TD-191 · intake draft reviewed by Codex 2026-10-21
