---
id: TASK-322
title: "Test Round 12's ceiling apples-to-apples"
priority: P2
size: M
risk: low
autonomy: AFK
class: execution
tier: G
authority: J1
origin: close-retro
state: needs-info
---

# TASK-322 — Test Round 12's ceiling apples-to-apples

## Why

state note: /triage, SPRINT-094: HELD, and the unblocking fact is named so it can be taken — time the git-repo CONSTRUCTION term of S4.APPEND's four cases in isolation (Round 13 §3 measured the oracle-spawning differential at 52.8–57.1 s and left this term unmeasured). It is a MEASUREMENT, so it legitimately accumulates (L-094) — unlike TASK-297, which was parked on a ruling.

## Done when

- [ ] S4.APPEND's four git-history cases are converted to TS and kept ALWAYS-ON, then the always-on §4 leg is re-measured against Round 12's derived ceiling of 9.5–13.6 s on a quiet host with host-load stated. SPRINT-092's 22.4–27.9 s saving is NOT a valid test of that ceiling — it beat it only because those four cases moved to opt-in, so the leg carries less work than the ceiling costed (Round 13 §5)

## Touches

- evals/run-s4-ts-evaluators.sh · test/ · docs/research/logs/qa-gate-timing.md

## Assumes

- converting the git cases keeps them cheap enough for the always-on leg. Round 13 §3 measured the oracle-spawning differential at 52.8–57.1 s; the git-repo construction term alone is unmeasured and could dominate. Measure before promoting this
- **open:** the git-repo CONSTRUCTION term of S4.APPEND's four cases, timed in isolation (unmeasured).

## Tracker

- SPRINT-092 T4 Round 13 §5 · TD-090
