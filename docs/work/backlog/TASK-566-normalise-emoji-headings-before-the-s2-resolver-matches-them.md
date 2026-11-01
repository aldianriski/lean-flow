---
id: TASK-566
title: "Normalise emoji and decorated headings before the S2 resolver matches a section"
epic: EPIC-023
priority: P2
size: S
risk: med
autonomy: HITL
class: execution
tier: P
authority: J2
origin: close-retro
state: needs-info
depends-on: []
---

# TASK-566 — Normalise emoji and decorated headings before the S2 resolver matches a section

## Why
SPRINT-153's exercises met adopter docs whose headings carry emoji or decoration. A pointer of
the form `<path> § <heading>` resolves only on an exact match, so S2's resolver would miss such a section or call it absent.

## Done when
- [ ] The resolver's heading match ignores leading emoji and decoration and states the rule in one place.
- [ ] Retained fixtures: a decorated heading resolves; a different heading with the same words after stripping does not.

## Assumes
- **needs-info:** S2's resolver design (EPIC-023 S2) decides where heading matching lives.

## Tracker
SPRINT-153 close Retro · EPIC-023 S2

## Amended 2026-11-01
Merged into TASK-568 (owner, /triage): its pointer rule ignores leading emoji and decoration, and treats two matches as a failure. TASK-568's real run should include a decorated heading.
