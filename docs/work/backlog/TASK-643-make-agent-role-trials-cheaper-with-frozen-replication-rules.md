---
id: TASK-643
title: "Make agent-role trials cheaper: same coordinator across arms, a smaller replay fixture, and frozen replication and stop rules"
type: feature
epic: EPIC-024
priority: P2
size: M
risk: med
autonomy: HITL
class: decision
tier: P
authority: J2
origin: close-retro
state: blocked
depends-on: [TASK-640]
---

# TASK-643 — Make agent-role trials cheaper: same coordinator across arms, a smaller replay fixture, and frozen replication and stop rules

## Why
Replays of an 11-box sprint cost about 4 USD and 40 minutes each and were most of SPRINT-170's 31.4 USD. Three levers: Sonnet headless coordinators across both arms when the coordinator is not the subject; a smaller replay fixture than SPRINT-167's; and fewer repeats. Codex ranked this first by expected saving and changed the last lever. The operator's "a second run only when within about 20 percent of the bar" is not confidence, because distance from a noisy observed threshold says nothing about variance. One run can screen out a failure but cannot establish a saving, so replication and stop rules must be frozen before the runs.

## Done when

- [ ] A trial protocol note states when a coordinator may be cheaper (only when it is not the subject, and the same in every arm), what a smaller fixture must keep so treatment fidelity survives, and a replication and stop rule fixed in advance.
- [ ] The protocol is applied on paper to one row's design (no paid run unless the owner approves) and shows the planned cost against the SPRINT-170 per-row figures.
- [ ] Negative: no existing verdict is changed or re-read under the new protocol, and a one-run screen is never recorded as a go.

## Touches
`docs/research/` (a protocol note) or the trial README under `scripts/trials/`, `docs/epic/EPIC-024-agent-roles-one-by-one.md`.

## Assumes
- A1: the harness is in `scripts/trials/` (TASK-640).
- **blocked-by:** TASK-640, and the owner's choice of the next row to trial.

## Tracker
SPRINT-170 close Retro · Codex recap review, candidate 4 (CHANGE, ranked 1)
