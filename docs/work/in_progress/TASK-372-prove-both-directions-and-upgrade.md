---
id: TASK-372
title: "Prove both layout directions and the upgrade path"
epic: EPIC-017
sprint: SPRINT-114
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

- [x] (a) Release-candidate skills against a real v1 tree: each of the 7 queue skills refuses by name, points to migrate, writes nothing. ✓ 7/7 rc.1 skills on a real v1 export of workdoo HEAD, `git status` 0 before/after each, loaded copy from `system/init` (Log 2026-10-03)
- [x] (b) Installed 1.66.x queue writers against tombstone, absent-TODO.md and stray-write states: each works harmlessly (its write re-ingested losslessly by migrate) or refuses cleanly — never a task lost or duplicated. Detection after the fact alone does not pass. ✓ tombstone n/a (scope-change 2026-10-03); 1.66.1 wrote into the store on 2 of 3 v2 trees and recreated TODO.md on 1; rc refused the mixed tree; migrate re-ingested {001, 002} + {901} losslessly; id-collision reported with hashes unchanged; fixtures `3f4b66c` + `19670ac`
- [x] (c) The Codex and Kimi runtimes resolve the plugin's resources. ✓ Codex: isolated CODEX_HOME, `codex plugin add` installed + enabled 2.0.0-rc.1, all 14 skills resolved; Kimi: skipped by owner ruling (scope-change 2026-10-03), static manifest case only
- [x] (d) The documented upgrade sequence (install 2.x → restart → migrate → resume) exercised end-to-end. ✓ v1 copy → rc `migrate` (10 ids equal, TODO.md removed) → fresh sessions of prime + triage on v2; install via `--plugin-dir` (owner-accepted, post-push check is an owner action)

## Touches

evals/fixtures/layout/ · sprint log evidence

## Assumes

none

## Tracker

EPIC-017 Closed-when 9 · Codex r1 F11 · F12 · r2 R2-1b · R2-2b

## Amended 2026-09-24

- **Owner ruling: no tombstone.** `migrate` removes `TODO.md` once every task is moved (non-task prose listed in the plan for the owner to place or drop). A tombstone would classify as mixed and be refused (existence-only detection, ADR-046). A stray 1.x write recreates `TODO.md` → mixed → refused → `migrate` re-run ingests it.
