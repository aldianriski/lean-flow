---
id: TASK-421
title: "Profile the Shell conformance engine's spawn sites on the Windows host (TD-168)"
priority: P1
size: S
risk: low
autonomy: HITL
class: execution
tier: X
authority: J2
origin: manual
state: ready
sprint: SPRINT-121
depends-on: []
---

# TASK-421 — Profile the Shell conformance engine's spawn sites on the Windows host (TD-168)

## Why

Split out of TASK-404 by owner ruling (2026-10-10, SPRINT-121 promote; Codex review H1), so the measurement runs now and the
optimization waits for a target set on real data. TD-168's Mitigation line is a hypothesis (L-091). This profile replaces it as the
basis for the fix. The task is a measurement only and changes no engine code, so it is not Tier G.

## Done when

- [ ] A fresh profile on the Windows host names the engine's hottest spawn sites, with counts and wall-clock per site, recorded as
      a new `docs/research/logs/qa-gate-timing.md` Round with host load stated. The per-site figures reconcile to the measured total by a second
      route (the per-site sum against the whole-run wall clock, within a stated tolerance).
- [ ] TASK-404's target fraction is proposed to the owner from that profile and recorded in TASK-404 once ruled.

## Touches

- `docs/research/logs/qa-gate-timing.md` · `docs/work/**/TASK-404-*.md` (the target line only)

## Assumes

- The profile runs against this repo at a pinned commit, the same host and tree that TASK-404's before/after will use.

## Tracker

- TD-168 · TASK-404 (split) · `docs/research/logs/qa-gate-timing.md` Rounds 17–18
