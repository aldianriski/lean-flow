---
id: TASK-489
title: "decide workdoo's lean-flow pin: bump it to a release carrying SPRINT-138, or record the decline"
priority: P2
size: S
risk: low
autonomy: HITL
class: decision
tier: P
authority: J2
origin: close-retro
state: ready
sprint: SPRINT-141
depends-on: []
---

# TASK-489 — decide workdoo's lean-flow pin: bump it to a release carrying SPRINT-138, or record the decline

## Why
SPRINT-138 T7's research (`docs/research/learning-loop-architecture.md`, candidate C5) found that workdoo, lean-flow's only adopter,
runs lean-flow 2.0.0 while lean-flow ships 2.14.0. The owner action "bump workdoo's pin" was listed in the SPRINT-127 and
SPRINT-128 Retros and then dropped from every later one. So none of the consumer-facing procedure changes since 2.0.0 reach the one
repo that could show whether they help, and T7's adopter success criterion (a release carrying C1, observed at workdoo's promotes)
cannot be measured. The research ruled to resolve this through the existing task record rather than a new copy-forward rule.

## Done when
- [ ] The owner's decision is recorded on this task: bump workdoo to a named lean-flow release (at least 2.14.0), or decline with
      a reason and a revisit-if condition.
- [ ] If bumped: workdoo's run record shows the new pin in effect (read from that repo's own record, not from a secret file), and
      the bump is noted in workdoo's own log.
- [ ] If declined: the reason and revisit-if condition are recorded here, and C5's success criterion is marked as waiting on it in
      the research doc's open questions.

## Touches
workdoo's lean-flow pin (in workdoo; owner-run) · this task file · `docs/research/learning-loop-architecture.md` (only on decline)

## Assumes
- The pin lives in workdoo's own configuration; reading or changing it is the owner's act in that repo. lean-flow's coordinator
  never opens workdoo's secret files (L-247).

## Tracker
- SPRINT-138 close Retro (follow-up), from T7 candidate C5
