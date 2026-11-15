---
id: TASK-664
title: "Replay the real bloodlines lane briefs and id allocation against the coordinator reference"
priority: P2
size: S
risk: low
autonomy: HITL
class: execution
tier: X
authority: J1
origin: decomposer
state: ready
sprint: SPRINT-176
depends-on: [TASK-662, TASK-663]
---

# TASK-664 — Replay the real bloodlines lane briefs and id allocation against the coordinator reference

## Why

Shipping a behaviour spec-only is an anti-pattern (L-007, exercised on real input), and the reference is only credible if the real
run fits it. Consumer evidence (ADR-053 §4): the sessions and messages cited in TASK-662 and TASK-663 are the input here.
No new machinery is proposed; this is the proof run. G2 review-round cap: 2.

## Done when

- [ ] The inputs are copied into a retained evidence record (not left in a session scratchpad): lane briefs 14:22, approvals 14:35/14:46, the status check 15:05, the id allocation 15:29 and correction 02:30, the relay labelling 15:42, and the lost-report re-request 15:42. No secret, env or key file is opened.
- [ ] A table maps each message type to one of three outcomes: its named section in the coordinator reference, existing lean-flow coverage (named), or an owner-ruled exclusion (learning-only). Only an in-scope requirement with none of these is a gap, filed as a TD citing the message.
- [ ] Given the retained scenario facts as input (the real stream names, sprints, worktrees, branch@sha, id maxima in use), one lane brief and one id allocation are produced by following the reference. Each of the reference's required fields is present, and the allocation meets the booking invariant (above the max in use, disjoint). The produced brief and allocation are compared with the real messages, with differences recorded.
- [ ] Negative: an in-scope requirement covered neither by the reference nor by named existing lean-flow coverage, and not an owner-ruled exclusion, appears in the table as a gap with its TD id, never as a pass.

## Touches

A retained evidence record under the repo's research/fixture convention (resolved at G2); no shipped skill file changes.

## Assumes

- Builds after EPIC-025 Sprint B closes.
- The source digests may be cleared; copy them before building.
- Consumer path: the reference is read as an installed skill, with no repo-specific path leaked.

## Tracker

Owner popup Q5 (T-C); L-007.
Codex intake review R1 NOT CLEAR (7 findings, all fixed), R2 662/663 CLEAR, 664 one High fixed in place (stop rule, no R3); owner approve 2026-11-15
