---
id: TASK-523
title: "Run blind behaviour cases on stage-skill boundaries once a boundary violation is on record"
priority: P3
size: M
risk: low
autonomy: HITL
class: execution
tier: G
authority: J2
origin: decomposer
state: needs-info
depends-on: []
---

# TASK-523 — Behaviour test cases for stage-skill boundaries

## Why
The Codex pipeline ships release-blocking cases: a fresh agent gets only a request and its input files, and a separate
judge holds the pass criteria. lean-flow's behavioural run covers night-run parking only, so a skill crossing its own
boundary (`/prototype` building the real thing, `/triage` creating tasks) is caught by nobody. This is governance
machinery under ADR-053 and none of its five reasons is on record yet. Source:
`docs/research/codex-run-project-pipeline.md` (4).

## Done when
- [ ] The `## Why` names the qualifying ADR-053 reason (the sighting that unblocked it) and a G2 review-round cap.
- [ ] Each case gives the acting agent only the request and input files; the judge alone sees the pass criteria.
- [ ] Each case has a retained must-FAIL variant (a weakened procedure) that the judge reddens.
- [ ] Cost per run recorded against the ~$0.43/case figure from `behavioral-eval-feasibility`.

## Assumes
- **open:** which of ADR-053's five reasons applies.
- **blocked-by:** a recorded sighting of a stage skill crossing its own Do-not-use boundary.

## Tracker
Research `codex-run-project-pipeline`, Findings row (4).
