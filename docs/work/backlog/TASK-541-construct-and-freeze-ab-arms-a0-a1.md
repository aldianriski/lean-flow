---
id: TASK-541
title: "Construct and freeze A/B arms A0 and A1 for both repos (no trials)"
epic: EPIC-023
priority: P2
size: M
risk: med
autonomy: HITL
class: execution
tier: G
authority: J2
origin: decomposer
state: blocked
depends-on: [TASK-533, TASK-536]
---

# TASK-541 — Construct and freeze A/B arms A0 and A1 for both repos (no trials)

## Why
A1 is the 2.x reference every later arm is compared against, and A0 is the floor; both must be built once, frozen, and differ only where declared. Not frozen under ADR-053: maintainer-only measurement (`evals/ab/`, paid, run by hand), never a gate or `qa-check.sh` leg. G2 review-round cap: 2. Design source: `docs/research/lean-flow-3-foundation.md` §7 and the S0 intake rulings I-1..I-3, R-a..R-c (2026-10-29).

## Done when
- [ ] A1 clinic: a fresh 2.19.1 `init` at the pinned plugin SHA, every popup answered verbatim from the answers file, transcript retained. A1 workdoo: its real 2.x docs, unchanged (intake I-2).
- [ ] A0 per repo = the A1 snapshot minus a declared lean-flow doc set; a diff proves the difference is exactly that set. Both arms carry the same `BUSINESS-NOTES.md` (R-a).
- [ ] Each arm frozen with a per-file `git hash-object` manifest; the harness refuses an arm that differs. Must-FAILs vary the selection: an edited byte · a missing file · an extra file → each refused; the unchanged control runs.
- [ ] A0 and A1 differ only in the declared set: same code, task prompts, permissions and model inventory.

## Touches
`evals/ab/arms/` (new) · `D:\Research\` snapshots

## Assumes
- **blocked-by:** TASK-533 (harness), TASK-536 (answers files).

## Tracker
research §7 Two phases · Artifact reuse
