---
id: TASK-643
title: "Make agent-role trials cheaper: same coordinator across arms, a smaller replay fixture, and frozen replication and stop rules"
type: feature
epic: EPIC-024
sprint: SPRINT-171
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

- [x] A trial protocol note states when a coordinator may be cheaper (only when it is not the subject, and the same in every arm), what a smaller fixture must keep so treatment fidelity survives, and a replication and stop rule fixed in advance. ✓ `docs/research/trial-replication-protocol.md` (`247a492c`, `18676703`): § Lever 1 (cheaper coordinator only when not the subject and the same in every arm), § Lever 2 (the fixture keep-list), § Lever 3 (3 per arm for a go, screen-out stop at 2 by owner ruling, margin 1.15×); EPIC-024 D17 points to it; coordinator read-through (tier P)
- [x] The protocol is applied on paper to one row's design (no paid run unless the owner approves) and shows the planned cost against the SPRINT-170 per-row figures. ✓ § Applied on paper: row 4b's retest, a cost table against SPRINT-170 (O 3.849 and 4.319, R 2.658, row 10.83 of 20, sprint 31.4 of 60; the worker re-derived each figure by two queries that agree); go path 25.3, over the 20 USD limit, so it needs its own budget ruling; no paid run
- [x] Negative: no existing verdict is changed or re-read under the new protocol, and a one-run screen is never recorded as a go. ✓ § Negative and D17: no verdict changed or re-read, early stops recorded "screened out (n = k)", never go; mechanical half: the EPIC-024 diff since `1f6c2ea2` changes row 5 only to the D18 pointer (owner-ruled, outside T5) and otherwise only adds lines

## Touches
`docs/research/` (a protocol note) or the trial README under `scripts/trials/`, `docs/epic/EPIC-024-agent-roles-one-by-one.md`.

## Assumes
- A1: the harness is in `scripts/trials/` (TASK-640).
- A2: the next row is 4b (owner ruling, 2026-11-10, EPIC-024 D15). Its design uses at least 3 fresh runs per arm, in balanced order, with local `qa-check.sh` denied in every arm and the off-host gate kept (L-310). A slowdown margin and a stop rule are frozen first, and SPRINT-170's runs are not pooled.
- **blocked-by:** TASK-640.

## Tracker
SPRINT-170 close Retro · Codex recap review, candidate 4 (CHANGE, ranked 1)
