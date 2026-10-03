---
id: TASK-372
title: "Prove both layout directions and the upgrade path"
epic: EPIC-017
priority: P1
size: M
risk: high
autonomy: HITL
class: execution
tier: G
authority: J2
origin: decomposer
state: ready
depends-on: [TASK-371]
---

# TASK-372 — Prove both layout directions and the upgrade path

## Done when

- [ ] (a) Release-candidate skills against a real v1 tree: each of the 7 queue skills refuses by name, points to migrate, writes nothing.
- [ ] (b) Installed 1.66.x queue writers against tombstone, absent-TODO.md and stray-write states: each works harmlessly (its write re-ingested losslessly by migrate) or refuses cleanly — never a task lost or duplicated. Detection after the fact alone does not pass.
- [ ] (c) The Codex and Kimi runtimes resolve the plugin's resources.
- [ ] (d) The documented upgrade sequence (install 2.x → restart → migrate → resume) exercised end-to-end.

## Touches

evals/fixtures/layout/ · sprint log evidence

## Assumes

none

## Tracker

EPIC-017 Closed-when 9 · Codex r1 F11 · F12 · r2 R2-1b · R2-2b

## Amended 2026-09-24

- **Owner ruling: no tombstone.** `migrate` removes `TODO.md` once every task is moved (non-task prose listed in the plan for the owner to place or drop). A tombstone would classify as mixed and be refused (existence-only detection, ADR-046). A stray 1.x write recreates `TODO.md` → mixed → refused → `migrate` re-run ingests it.
