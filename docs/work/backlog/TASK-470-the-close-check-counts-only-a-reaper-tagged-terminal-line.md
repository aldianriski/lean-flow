---
id: TASK-470
title: "The close check counts only a reaper-tagged terminal line"
priority: P2
size: S
risk: med
autonomy: HITL
class: execution
tier: G
authority: J1
origin: decomposer
state: ready
depends-on: []
---

# TASK-470 — The close check counts only a reaper-tagged terminal line

## Why

Defect fix (ADR-053 §3, unfrozen). TD-232 (medium): a model-written, unfenced `terminal ·` line satisfies
`CLOSE-FIRED-UNREAPED`, so the TD-122 guarantee holds only while a run does not write its own rollup. SPRINT-119's run did
exactly that, and `--close` passed before the reaper ran. A run that writes its rollup and dies before `reap()` would still pass.
`reap()` already tags its terminal line with a trailing `[derived]`, so the check has a provenance mark to key on. The remainder of
TD-233 rides along: Part 4's entry template does not name the `run-complete` header the rollup checker requires. The vocabulary
half of TD-233 is already met where the line is written (orchestrator review-scoping reference, the consequence-line block).

Tier G, **consequential**: the orchestrator skill names this check as the host's close gate (ADR-050). G2 review-round cap: 2.

## Done when

- [ ] `--close` FAILs `CLOSE-FIRED-UNREAPED` when the last `fired ·` line is followed only by a `terminal ·` line without the
      reaper's trailing `[derived]` tag; a reaper-tagged terminal line still PASSes.
- [ ] A retained must-FAIL fixture shaped from SPRINT-119's log as it stood **before** the reaper ran (the unfenced `terminal ·`
      under `run-complete`), with the full archived log as the passing control.
- [ ] Full consequential-G bar: each assertion seeded or broken in turn (`cmp` seed vs pristine, parses, assertion count kept,
      ±1 line), exactly the claim-bearing cases redden while the sibling stays green, restored under one hash convention; plus a
      worktree-isolated outside review.
- [ ] The unattended run's Part 4 entry template names the `### <date> | run-complete | …` header the rollup checker reads.
- [ ] TD-232 and TD-233 marked resolved in `TECH-DEBT.md`.

## Touches

the sprint-by-reference checker (close branch) and its fixtures runner · the orchestrator's night-run reference, Part 4 ·
`TECH-DEBT.md`

## Assumes

- The `[derived]` tag is written only by `reap()` (Codex review at intake, 2026-10-21); G2 re-confirms no other writer emits it.
- A log written before this fix whose terminal line lacks the tag is archived, and archived logs are not re-checked at close.

## Tracker

- TD-232 · TD-233 · intake draft reviewed by Codex 2026-10-21 (APPROVE WITH FIXES, folded in)
