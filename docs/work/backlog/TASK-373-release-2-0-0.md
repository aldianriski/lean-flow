---
id: TASK-373
title: "Release 2.0.0"
epic: EPIC-017
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

- [ ] Every other EPIC-017 § Closed-when box is [x] first.
- [ ] All versioned manifests at 2.0.0, derived with `grep -l '"version"' .*-plugin/*.json`, plus the README footer.
- [ ] CHANGELOG entry marked BREAKING with the upgrade section. Stops before push.

## Touches

.claude-plugin/ · .codex-plugin/ · .kimi-plugin/ manifests · README.md · CHANGELOG.md

## Assumes

none

## Tracker

EPIC-017 Closed-when 8 · owner ruling 2026-09-23: the whole epic gates the release
