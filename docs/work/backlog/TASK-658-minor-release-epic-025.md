---
id: TASK-658
title: "Release the EPIC-025 slimming as a MINOR on a Codex review and the off-host gate; stop before push"
epic: EPIC-025
priority: P1
size: S
risk: med
autonomy: HITL
class: execution
tier: P
authority: J2
origin: decomposer
state: ready
depends-on: [TASK-651, TASK-652, TASK-653, TASK-654, TASK-655, TASK-656, TASK-657]
---

# TASK-658 — MINOR release

## Why

EPIC-025 condition 6 (release half), owner ruling 2026-11-12. Sprint B (workdoo and measuring) runs on this release. Push is owner-reserved.

## Done when

- [ ] Every versioned manifest (`grep -l '"version"' .*-plugin/*.json`) and the README footer carry one new MINOR version, equal in lockstep. CHANGELOG has the entry, covering the cuts, the writer and the shorter skills.
- [ ] A Codex review of the shipped diff (since the last release tag) is recorded with its findings resolved or ruled by the owner.
- [ ] The off-host gate (`QA_FULL`, via `scripts/gate-remote.ts`) is green, and its verdict line is read as its own call.
- [ ] Negative: nothing is pushed or tagged. The task stops at the gate with a ready-to-push message, and a manifest mismatch FAILs lockstep.

## Touches

`.claude-plugin/*.json` and the other versioned manifests, `README.md`, `CHANGELOG.md`, `docs/changelog/`.

## Assumes

- TASK-489's retarget and the epic amendment are the coordinator's and `/triage`'s.

## Tracker

EPIC-025 condition 6; owner popup "Two sprints", 2026-11-12.
