---
id: TASK-658
title: "Release the EPIC-025 slimming as a MINOR on a Codex review and the off-host gate; stop before push"
epic: EPIC-025
sprint: SPRINT-173
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

EPIC-025 condition 5 (the release), owner ruling 2026-11-12. Sprint B (workdoo and measuring) runs on this release. Push is owner-reserved.

## Done when

- [x] Every versioned manifest (`grep -l '"version"' .*-plugin/*.json`) and the README footer carry one new MINOR version, equal in lockstep. CHANGELOG has the entry, covering the cuts, the writer and the shorter skills. ✓ four grep-derived manifests and the README footer at 2.23.0, manifest lockstep PASS on the gate; CHANGELOG v2.23.0 entry covers the cuts, the writer and the shorter skills; v2.21.x rotated (3d89ce8a)
- [x] A Codex review of the shipped diff (since the last release tag) is recorded with its findings resolved or ruled by the owner. ✓ Codex review of 6444f83e..HEAD shipped surface: round 1 two Mediums (STANDARD row vs ADR-045 D6, record-line symlink) fixed at 9771b4de, spec 0.21.0; round 2 one Low fixed at 90493f46, symlink move case reddens with both guards seeded out
- [x] The off-host gate (`QA_FULL`, via `scripts/gate-remote.ts`) is green, and its verdict line is read as its own call. ✓ off-host QA_FULL at 90493f46: QA-CHECK 236 pass 0 fail; bun test 621 pass 0 fail
- [x] Negative: nothing is pushed or tagged. The task stops at the gate with a ready-to-push message, and a manifest mismatch FAILs lockstep. ✓ nothing pushed or tagged: main ahead of origin by 366, no tag at HEAD (2 tags, unchanged); run-manifest-lockstep-fixtures.sh must-FAIL harness passes in the same gate

## Touches

`.claude-plugin/*.json` and the other versioned manifests, `README.md`, `CHANGELOG.md`, `docs/changelog/`.

## Assumes

- TASK-489's retarget and the epic amendment are the coordinator's and `/triage`'s.

## Tracker

EPIC-025 condition 5; owner popup "Two sprints", 2026-11-12.
