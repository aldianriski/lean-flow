---
id: TASK-644
title: "Cut owner popups in trial sprints: gate packets that bundle foreseeable rulings, and pre-authorised routine recovery"
type: feature
epic: EPIC-024
sprint: SPRINT-171
priority: P3
size: S
risk: low
autonomy: HITL
class: decision
tier: P
authority: J2
origin: close-retro
state: ready
depends-on: []
---

# TASK-644 — Cut owner popups in trial sprints: gate packets that bundle foreseeable rulings, and pre-authorised routine recovery

## Why
SPRINT-170 took about 20 owner popups, many for rulings a design could have foreseen: a reaper-killed job to relaunch, a voided run to rerun, a probe fix to re-probe, a suspend to recover from. Popups kept the owner in control from a train, but each costs owner time. Codex's new item: bundle foreseeable rulings into the gate packet, pre-authorise routine recovery cases, track popup count and active owner minutes next sprint, and keep escalation for changed scope or verdict meaning.

## Done when

- [x] A short rule for trial sprints lists the recovery cases the owner pre-authorises at G2 (for example one relaunch after a host kill, one rerun of a run voided by a host suspend), with a cap on each, and the rulings that always escalate (scope change, verdict meaning, budget). ✓ EPIC-024 D16 (`e8f76ae0`, review fixes `efefbd78`): 3 cases, each with a numeric cap; scope, verdict meaning and budget on the always-escalate list (grep 1/1/3); cases as ruled by owner popup ("All three cases (Recommended)"); scoped Sonnet review, Spec met, 2 Med fixed
- [ ] The next trial sprint's Retro records the popup count and the owner's active minutes beside this sprint's roughly 20.
- [x] Negative: a pre-authorisation never covers a change to a frozen verdict rule, a budget cap or a treatment, and never lets a run pass its own checklist. ✓ judgment tick (rule text, no mechanical test): D16 carries the clause verbatim, and adds that the coordinator never ticks a box from its own recovery run; case 3 excludes any fix touching a listed treatment, oracle, key or prompt path; review found no bypass (no High)

## Touches
`skills/orchestrator/references/` (the G2 packet guidance, only if the rule is general) or `docs/epic/EPIC-024-agent-roles-one-by-one.md`.

## Assumes
- A1: the owner wants fewer popups here; the SPRINT-170 rulings were given willingly. Confirm at G1.

## Tracker
SPRINT-170 close Retro · Codex recap review, new item 3
