---
id: TASK-560
title: "Make init never overwrite an existing doc, and offer migrate when the repo already has docs"
epic: EPIC-023
sprint: SPRINT-153
priority: P1
size: S
risk: high
autonomy: HITL
class: decision
tier: P
authority: J2
origin: manual
depends-on: []
---

# TASK-560 — Make init never overwrite an existing doc, and offer migrate when the repo already has docs

## Why
A measured defect, found in SPRINT-153 T3's exercise (2026-10-31): `/lean-doc-generator init` on a talixa-hris copy that
already had a 110-line root `CLAUDE.md` removed it and wrote a new `.claude/CLAUDE.md`; most facts were redistributed, but
four hand-written ones were lost (development mock ids, geolocation on attendance, leave counted in calendar and work days,
immutable domain entities). init's procedure has no rule against overwriting an existing doc (only its three scaffold files
are write-if-absent) and never routes a repo that already has docs to `migrate`, the path built for it. An adopter running
init on an existing repo silently loses part of their docs. Defect fix of a shipped skill: not frozen under ADR-053.

## Done when
- [ ] `init` never deletes, moves or overwrites a file that existed before it ran; a file it would write that already exists
  is skipped and listed in its report.
- [ ] When the repo already has AI-context or core docs (a `CLAUDE.md` at the root or under `.claude/`, `CONTEXT.md`,
  `AGENTS.md`, or a `docs/` tree with content), `init` says so before writing anything and offers `migrate` as the path,
  continuing as `init` (absent files only) only on the owner's choice.
- [ ] A real `init` through the plugin under test on a fresh talixa-hris copy leaves its original root `CLAUDE.md`
  byte-identical, and its record shows the existing docs found and the `migrate` offer.

## Touches
the lean-doc-generator init reference

## Assumes
- A headless run parks at the offer (it is a popup), so box 3 can be shown headless from the park record plus a byte
  comparison of the original file.

## Tracker
SPRINT-153 T3 exercise (talixa-hris, 2026-10-31) · owner ruling by popup: fix in this sprint
