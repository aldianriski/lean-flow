---
id: TASK-592
title: "/triage files a bug item and /diagnose writes its root cause, fix and regression test into it"
sprint: SPRINT-159
priority: P1
size: M
risk: med
autonomy: HITL
class: decision
tier: P
authority: J2
origin: decomposer
state: ready
depends-on: [TASK-591]
---

# TASK-592 — /triage files a bug item and /diagnose writes its root cause, fix and regression test into it

## Why
The bug item (TASK-591) is only useful if the skills that meet a bug write it: today `/triage` routes a temp report away and
`/diagnose` ends with the cause in a commit message, so evidence and the root-cause analysis are lost to the next reader.

## Done when
- [x] `/triage` turns a reported bug into a `type: bug` item in the backlog with symptom, repro, expected, actual and evidence (saved ✓ 2026-11-02: triage step 3 writes a `type: bug` item with redacted evidence (`1fec0b04`); shown on TD-285 → TASK-596
      redacted under `docs/work/evidence/TASK-NNN/`), instead of a temp-dir report.
- [x] `/diagnose` reads the bug item when one exists, and at its post-mortem writes root cause, fix, regression test and prevention ✓ 2026-11-02: diagnose Phase 1 reads the item, Phase 6 writes root cause, fix, regression test, prevention (`1fec0b04`); shown on TASK-596
      into it (the commit message still states the winning hypothesis).
- [x] Shown on real input: one real bug goes from report through `/triage` and `/diagnose` to a bug item with every section filled ✓ 2026-11-02: TD-285 → headless /triage ($0.63) → TASK-596 with redacted evidence → headless /diagnose ($2.00) → fix + fixtures (`1459451d`); outside review 2 rounds; owner read the item (popup)
      and its evidence redacted, read by the owner.
- [x] CHANGELOG `[Unreleased]` entry; both SKILL.md files stay within their caps. ✓ 2026-11-02: CHANGELOG [Unreleased] Changed line; triage 131 and diagnose 100 lines

## Touches
`skills/triage/SKILL.md` · `skills/diagnose/SKILL.md` · CHANGELOG.md

## Assumes
- The real bug is taken from lean-flow's own debt or a research copy, never from a live repo in `D:\Project` other than lean-flow.

## Tracker
Owner request 2026-11-02 · TASK-591
