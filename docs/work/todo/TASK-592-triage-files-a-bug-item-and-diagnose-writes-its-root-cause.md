---
id: TASK-592
title: "/triage files a bug item and /diagnose writes its root cause, fix and regression test into it"
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
- [ ] `/triage` turns a reported bug into a `type: bug` item in the backlog with symptom, repro, expected, actual and evidence (saved
      redacted under `docs/work/evidence/TASK-NNN/`), instead of a temp-dir report.
- [ ] `/diagnose` reads the bug item when one exists, and at its post-mortem writes root cause, fix, regression test and prevention
      into it (the commit message still states the winning hypothesis).
- [ ] Shown on real input: one real bug goes from report through `/triage` and `/diagnose` to a bug item with every section filled
      and its evidence redacted, read by the owner.
- [ ] CHANGELOG `[Unreleased]` entry; both SKILL.md files stay within their caps.

## Touches
`skills/triage/SKILL.md` · `skills/diagnose/SKILL.md` · CHANGELOG.md

## Assumes
- The real bug is taken from lean-flow's own debt or a research copy, never from a live repo in `D:\Project` other than lean-flow.

## Tracker
Owner request 2026-11-02 · TASK-591
