---
id: TASK-541
title: "Construct and freeze A/B arms A0 and A1 for both repos (no trials)"
epic: EPIC-023
sprint: SPRINT-151
priority: P2
size: M
risk: med
autonomy: HITL
class: execution
tier: G
authority: J2
origin: decomposer
state: ready
depends-on: [TASK-533, TASK-536]
---

# TASK-541 — Construct and freeze A/B arms A0 and A1 for both repos (no trials)

## Why
A1 is the 2.x reference every later arm is compared against, and A0 is the floor; both must be built once, frozen, and differ only where declared. Not frozen under ADR-053: maintainer-only measurement (`evals/ab/`, paid, run by hand), never a gate or `qa-check.sh` leg. G2 review-round cap: 2. Design source: `docs/research/lean-flow-3-foundation.md` §7 and the S0 intake rulings I-1..I-3, R-a..R-c (2026-10-29).

## Done when
- [x] A1 clinic: a fresh 2.19.1 `init` at the pinned plugin SHA, every popup answered verbatim from the answers file, transcript retained. A1 workdoo: its real 2.x docs, unchanged (intake I-2). ✓ ea58cec1: A1 clinic is a fresh 2.19.1 init at the pinned plugin, every popup answer matching the operator answers file (the owner's seven decisions adopted by ruling), transcript retained outside the repo at D:\Research\ab-init-clinic-a1 (session f3f7292b, 197121 bytes); A1 workdoo keeps its real docs
- [x] A0 per repo = the A1 snapshot minus a declared lean-flow doc set; a diff proves the difference is exactly that set. Both arms carry the same `BUSINESS-NOTES.md` (R-a). ✓ ea58cec1: A0 per repo = A1 with the declared lean-flow set undone (workdoo 124 removed; clinic 22 incl. the extended README restored), proved by diffManifest; both arms carry the same BUSINESS-NOTES (selftest S18, S35)
- [x] Each arm frozen with a per-file `git hash-object` manifest; the harness refuses an arm that differs. Must-FAILs vary the selection: an edited byte · a missing file · an extra file → each refused; the unchanged control runs. ✓ b5b05a04 + 3f9bf629: per-file manifests frozen, the measured-run freeze preflight refuses an edited byte, a missing and an extra file with named reasons while the control runs (S16, S16b, S29)
- [x] A0 and A1 differ only in the declared set: same code, task prompts, permissions and model inventory. ✓ b5b05a04: A0 and A1 configs differ only in id, snapshot, manifest and plugin, sharing one inventory for models, effort and permissions (S17)

## Touches
`evals/ab/arms/` (new) · `D:\Research\` snapshots

## Assumes

## Tracker
research §7 Two phases · Artifact reuse
