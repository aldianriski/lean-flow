---
id: TASK-542
title: "Implement the unattended A/B trial protocol with the D9 G2 exception (fixture repo only)"
epic: EPIC-023
sprint: SPRINT-148
priority: P2
size: M
risk: high
autonomy: HITL
class: execution
tier: G
authority: J2
origin: decomposer
state: ready
depends-on: [TASK-533]
---

# TASK-542 — Implement the unattended A/B trial protocol with the D9 G2 exception (fixture repo only)

## Why
A1+ trials run the lean-flow loop unattended; G2's subject is produced inside the trial, so D9's eval-only exception must be implemented and proven before any real trial. Not frozen under ADR-053: maintainer-only measurement (`evals/ab/`, paid, run by hand), never a gate or `qa-check.sh` leg. G2 review-round cap: 2. Design source: `docs/research/lean-flow-3-foundation.md` §7 and the S0 intake rulings I-1..I-3, R-a..R-c (2026-10-29).

## Done when
- [x] G1 pre-signed from the frozen task file; G2 signed under D9 by the mechanical check (files touched ⊆ `Layers:`) and an isolated policy check of the design against the task's Out-of-scope list; every use logged as a deviation that never applies to product runs. ✓ `writeTaskFile` writes `gates_signed: G1 @ sha256(task)`; G2 = `scopeCheck` (declared Files ⊆ layers, one token each, normalised) + `policyCheck` (isolated `claude-sonnet-5-5` judge, one-object reply, model pinned); every protocol row carries `deviation: "D9 eval-only G2 exception -- never applies to product runs"`; `git grep` under `skills/` names nothing of it (coordinator)
- [x] Must-FAILs: a design touching a file outside `Layers:` → not signed · a design inside `Layers:` doing an Out-of-scope behaviour → not signed · an in-scope control → signed; refused trials scored not-passed. ✓ S7/S15 outside-Layers and malformed entries → not signed · S8/S15 refuse, two-object and `</design>` replies → not signed · P5 real judge refuses the in-Layers rename and signs the control · S9 refused → `passed:false`, `not-run:g2-refused`, one spawn
- [x] Popup branch: a trial raising any other popup → parked, the park recorded, the trial scored not-passed (must-FAIL + control). ✓ S10: AskUserQuestion, ExitPlanMode, a permission denial and a phase-2 popup → parked, `park` recorded, `passed:false`; clean control not parked. Real: the P6 re-run parked on a Bash permission denial in phase 2
- [x] Exercised on the fixture repo only. ✓ S11: a repo outside `evals/ab/fixtures/` is refused before spawn; the P6 rows name `smoke-repo` (first invalid on a synced-plugin leak, fixed 650adb4d + S14; the re-run is valid and parked)

## Touches
`evals/ab/`

## Assumes

## Tracker
EPIC-023 D4 · research D9
