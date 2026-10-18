---
id: TASK-430
title: "Make /release-patch bump every version reference the project lints, not only the manifest"
epic: EPIC-022
priority: P2
size: S
risk: low
autonomy: HITL
class: execution
tier: P
authority: J1
origin: manual
state: ready
depends-on: []
---

# TASK-430 — Make /release-patch bump every version reference the project lints, not only the manifest

## Why

Twice a release left the README footer behind and the next close's gate caught it (TD-093: `5f495c1`,
`5bd4b1d`). The fix must stay generic — hardcoding this repo's footer is the L-015 leak.

## Done when

- [ ] `/release-patch` has a step that finds the version references beside the manifest (sibling
      manifests, a README footer) and bumps each in lockstep, named generically.
- [ ] Exercised on this repo's next release: all four `*-plugin/*.json` manifests and the README footer
      agree afterwards (L-007).

## Touches

- skills/release-patch/SKILL.md · CHANGELOG.md · TECH-DEBT.md

## Assumes

- none

## Tracker

- EPIC-022 Closed-when 2 · TD-093
