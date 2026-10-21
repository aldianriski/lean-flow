---
id: TASK-472
title: "The scope-change check stops reading a prose fragment as an undeclared path"
sprint: SPRINT-135
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

- [x] A backticked fragment that resolves to no repo path counts as declared only when a full path **in the same entry** contains ✓ c3019f02: fragmentCorroborated() -- a fragment resolving to no root-relative path is excused only as a segment run of a path in the same entry; case scope-change-fragment-in-heading-beside-its-full-declared-path (SPRINT-133's shape, no Cites workaround) PASSes
      it as a segment run. SPRINT-133's real heading shape passes without the Cites workaround.
- [x] Retained must-FAIL controls, each failing by name: a real directory (e.g. `docs/`) is not authorized by one declared file ✓ must-FAIL cases real-directory-not-excused (docs/), uncorroborated-fragment (zz-orphan/), prefix-is-not-a-segment-run (do/) each FAIL scope-change-outside-layers by name; scope subset 42/0, full runner 164/0
      beneath it; an uncorroborated fragment; a prefix that is not a segment run (e.g. `do/`).
- [x] TD-263 marked resolved in `TECH-DEBT.md`. ✓ a8faa7d6: TD-263 status: resolved -> TASK-472 (SPRINT-135)

## Touches

the sprint-by-reference checker (scope-change branch) and its fixtures runner · `TECH-DEBT.md`

## Assumes

- A declared directory already authorizes its descendants and that direction is unchanged; this widens nothing upward (Codex
  review at intake).

## Tracker

- TD-263 · intake draft reviewed by Codex 2026-10-21
