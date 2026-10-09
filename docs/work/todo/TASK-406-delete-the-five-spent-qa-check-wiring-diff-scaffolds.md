---
id: TASK-406
title: "Delete the five spent qa-check wiring-diff scaffolds"
priority: P2
size: S
risk: low
autonomy: AFK
class: execution
tier: P
authority: J1
origin: decomposer
state: ready
sprint: SPRINT-120
depends-on: []
---

# TASK-406 — Delete the five spent qa-check wiring-diff scaffolds

## Why

The `docs/research/logs/qa-check-*.diff.md` files were "NOT APPLIED" wiring diffs written at SPRINT-103 so a worktree task could hand a
`qa-check.sh` edit to the coordinator. Their content has since landed in the gate or been superseded, and only the archived SPRINT-103
cites them. Four of them fail `conformance.sh` on LAW 3 and §3 (no ownership header), which blocks level Structural.

## Done when

- [ ] The five wiring-diff logs are deleted, and no non-archived file cites any of them (archived sprints resolve through git).
- [ ] `sh conformance.sh .` reports 0 `S1.LAW3` and 0 `S3.SCHEMA` findings.

## Touches

- `docs/research/logs/` (the five `qa-check-*.diff.md` files only)

## Assumes

- Deleting rather than adding headers was the owner's ruling (SPRINT-120 decompose): they are spent scaffolding, not research.

## Tracker

- SPRINT-103 (origin) · STANDARD §1 LAW 3 · §3
