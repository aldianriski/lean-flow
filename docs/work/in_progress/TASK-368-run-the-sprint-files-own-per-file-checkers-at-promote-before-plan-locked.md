---
id: TASK-368
title: "Run the sprint file's own per-file checkers at promote, before `plan locked`"
priority: P2
size: S
risk: low
autonomy: HITL
class: execution
tier: X
authority: J1
origin: close-retro
state: ready
sprint: SPRINT-115
---

# TASK-368 — Run the sprint file's own per-file checkers at promote, before `plan locked`

## Why

tier note: run plumbing, not a guard: it calls existing checkers earlier

origin note: SPRINT-104: its own Plan failed layers-completeness from plan_commit to close (six findings, re-run against the promote-time file) and it was first written down at close

Both checks take under a second on one file, but their only runner is the full gate,
which this host has repeatedly failed to finish (SPRINT-103 and -104 closes). A finding in
the Plan is cheapest at the moment the Plan is written, and costs a logged Plan
amendment every time after it.

## Done when

- [x] Before `promote` commits `plan locked`, lean-flow runs layers-completeness and prose-density over the **new sprint file alone** and a FAIL blocks the commit. Verify: a sprint file with a bare-name prose token and a >400-char line is refused at promote with both named findings; a clean one passes. ✓ aa2b35c: `bun scripts/promote-check.ts <sprint>`; `evals/run-promote-check-fixtures.ts` 8/8 (dirty.md refused with the layers-completeness and 400-char findings both named, exit 1; clean.md PASS); real SPRINT-115 file 16/0; registered always-on in qa-check (coordinator re-ran on the merged tree)

## Touches

- this repo's promote procedure only — `scripts/…` paths must NOT leak into the generic `lean-doc-generator` skill (L-015); a consumer hook point, if any, is a separate ruling

## Assumes

none

## Tracker

- TD-178 · TD-177 · L-212 · L-166
