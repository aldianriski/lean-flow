---
id: TASK-472
title: "The scope-change check stops reading a prose fragment as an undeclared path"
priority: P2
size: S
risk: med
autonomy: HITL
class: execution
tier: G
authority: J1
origin: decomposer
state: ready
depends-on: [TASK-470]
---

# TASK-472 — The scope-change check stops reading a prose fragment as an undeclared path

## Why

Defect fix (ADR-053 §3, unfrozen). TD-263 (low): the scope-change leg treats any backticked span ending in a slash as a repo
path. A fragment like `done/` in SPRINT-133's scope-change heading had to be declared verbatim in Cites, even though the full path
beneath it was already in the task's Layers; the log is append-only, so the only fix was a declaration that names no real file.

Tier G (other): `--scope-change` is a maintainer-only leg. Depends on TASK-470 because both edit the sprint-by-reference checker.
G2 review-round cap: 2.

## Done when

- [ ] A backticked fragment that resolves to no repo path counts as declared only when a full path **in the same entry** contains
      it as a segment run. SPRINT-133's real heading shape passes without the Cites workaround.
- [ ] Retained must-FAIL controls, each failing by name: a real directory (e.g. `docs/`) is not authorized by one declared file
      beneath it; an uncorroborated fragment; a prefix that is not a segment run (e.g. `do/`).
- [ ] TD-263 marked resolved in `TECH-DEBT.md`.

## Touches

the sprint-by-reference checker (scope-change branch) and its fixtures runner · `TECH-DEBT.md`

## Assumes

- A declared directory already authorizes its descendants and that direction is unchanged; this widens nothing upward (Codex
  review at intake).

## Tracker

- TD-263 · intake draft reviewed by Codex 2026-10-21
