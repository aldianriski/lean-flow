---
id: TASK-642
title: "Measure a reproducer helper for /diagnose Phase 2 inside /diagnose, not as a separate role"
type: feature
epic: EPIC-024
priority: P3
size: M
risk: med
autonomy: HITL
class: decision
tier: P
authority: J2
origin: close-retro
state: ready
depends-on: []
---

# TASK-642 — Measure a reproducer helper for /diagnose Phase 2 inside /diagnose, not as a separate role

## Why
Row 9 passed: both arms reproduced the seeded bug in 2 of 2 runs, the reproducer at 0.039 USD mean against `/diagnose` Phases 1 to 2 at 0.114 (bar 0.086), and the clean-twin control read `reproduced: no`. The trial stopped `/diagnose` after Phase 2 and used one seed with n = 2, so the roughly 69 percent saving is not a saving for an integrated `/diagnose` run. Codex (CHANGE): a Phase-2 helper is a reasonable destination, but verify which `/diagnose` responsibilities remain and measure the marginal saving inside the workflow. The question is whether the helper earns its place inside the skill.

## Done when

- [ ] A design note states what the helper takes and returns, which `/diagnose` Phase 1 and 2 duties stay with the skill, and the frozen verdict rule (cost and reproduction, a clean-twin control, at least two seeds).
- [ ] The helper is run inside a full `/diagnose` pass on the seeds, and the marginal cost and time against the unchanged skill are recorded in EPIC-024 row 9.
- [ ] Negative: the helper never edits `src/` (a run that does is void), and `skills/diagnose/` is unchanged on `main` until the owner rules to ship (D5).

## Touches
`docs/epic/EPIC-024-agent-roles-one-by-one.md`, `docs/work/`; the helper and any `/diagnose` edit live on a trial branch.

## Assumes
- A1: the seed and the twin from TASK-637 are reusable; re-derive that before relying on them.

## Tracker
SPRINT-170 close Retro · TASK-637 § Results · Codex recap review, candidate 5 (CHANGE)
