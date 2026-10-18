---
id: TASK-430
title: "Make /release-patch bump every version reference the project lints, not only the manifest"
epic: EPIC-022
sprint: SPRINT-125
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

- [x] `/release-patch` has a step that finds the version references beside the manifest (sibling ✓ `17a23624`: derived lockstep set + step 3b (`git grep -nF`, current-version refs only) + `[siblings]` output; dry-run on 2.5.0 selected 4 manifests + README footer, left 2 history hits
      manifests, a README footer) and bumps each in lockstep, named generically.
- [x] Exercised on this repo's next release: all four `*-plugin/*.json` manifests and the README footer ✓ release 2.6.0 (`3f17f0b4`): derived set = 4 manifests, all 2.6.0 (`check-manifest-lockstep` PASS); step 3b bumped the README footer to v2.6.0 and left 2 history hits (EPIC-022:21, sprint INDEX:14); Codex T9 R1–R4 CLEAR
      agree afterwards (L-007).

## Touches

- skills/release-patch/SKILL.md · CHANGELOG.md · TECH-DEBT.md

## Assumes

- none

## Tracker

- EPIC-022 Closed-when 2 · TD-093
