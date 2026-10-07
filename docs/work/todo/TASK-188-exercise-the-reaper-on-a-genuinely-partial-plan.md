---
id: TASK-188
title: "Exercise the reaper on a genuinely partial Plan"
priority: P3
size: S
risk: low
autonomy: HITL
class: execution
tier: X
authority: J1
origin: close-retro
state: ready
sprint: SPRINT-118
---

# TASK-188 — Exercise the reaper on a genuinely partial Plan

## Why

> **Opportunistic by ruling, not by priority.** Neither entry below can be scheduled — each is taken
> when a run or a session produces the vehicle for it. Promoting one into a sprint whose shape cannot
> generate that vehicle is what foreclosed SPRINT-060 T5 (L-111).

→ **PARKED at SPRINT-098 (T5)** — it rides T4's run, and T4 never fired, so its opportunistic trigger never arose. **D5 makes `unattempted` a correct outcome here, not a miss.** Still paired with `TASK-319`; spec in the
sprint file, with **D5** recording that the opportunistic design is unchanged: the run is not
scheduled to stop, and closing this `unattempted` is a correct outcome rather than a miss.
Pointer, not a second copy (L-008).

state note: corrected blocked → ready at the SPRINT-098 promote, owner-ruled 2026-09-11. `blocked` was standing in for "opportunistic, cannot be scheduled", which is not what the state means here — `depends-on:` is `none`, and only a `ready` task is promotable, so the state as written made the 2026-09-11 pairing ruling unexecutable. The opportunistic design is unchanged and now lives in SPRINT-098 **D5**.

## Done when

- [ ] The reaper handles a genuinely partial Plan from a real run that stops mid-Plan; closing this `unattempted` per D5 is a valid outcome.

## Assumes

- none

## Tracker

- SPRINT-060 T5 scope-change + owner ruling · ADR-016 · L-111
- pair-with: **`TASK-319` — promote them into the SAME sprint** (SPRINT-097 `/triage`, 2026-09-11). 319 is the only task that deliberately fires a real unattended run, and this one's trigger is a run that stops mid-Plan. The opportunistic design stands and is not being changed: do not schedule a run to produce the stop. What pairing fixes is the *other* half of L-111 — 319's run happening in a sprint where nobody is positioned to claim the artifact if it does stop.
