---
id: TASK-373
title: "Release 2.0.0"
epic: EPIC-017
sprint: SPRINT-114
priority: P1
size: S
risk: med
autonomy: HITL
class: execution
tier: X
authority: J2
origin: decomposer
state: ready
depends-on: [TASK-365, TASK-372, TASK-378, TASK-379, TASK-384, TASK-385, TASK-386]
---

# TASK-373 — Release 2.0.0

## Done when

- [x] Every other EPIC-017 § Closed-when box is [x] first. ✓ 9 of 10 `[x]`; the open one is #8, this release (7 measured-not-demonstrated · 10 under owner ruling).
- [x] All versioned manifests at 2.0.0, derived with `grep -l '"version"' .*-plugin/*.json`, plus the README footer. ✓ `5f62d0f`: the grep derives 4 files, all `2.0.0`; README footer `v2.0.0`; lockstep PASS; Codex r1 confirmed.
- [x] CHANGELOG entry marked BREAKING with the upgrade section. Stops before push. ✓ `## v2.0.0 … — **BREAKING**` + `### Upgrading from 1.x`; §11 rotation lossless (Codex's 1 finding, 2 inter-block `---`, rejected as by-design); release gate `QA_FULL=1` 313/7 → the 7 review-depth records resolved (`47037f1`); nothing pushed.

## Touches

.claude-plugin/ · .codex-plugin/ · .kimi-plugin/ manifests · README.md · CHANGELOG.md

## Assumes

none

## Tracker

EPIC-017 Closed-when 8 · owner ruling 2026-09-23: the whole epic gates the release
