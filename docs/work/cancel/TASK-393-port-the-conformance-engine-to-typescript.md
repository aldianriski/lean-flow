---
id: TASK-393
title: "Port the conformance engine to TypeScript on bun"
priority: P2
size: L
risk: high
autonomy: HITL
class: execution
tier: G
authority: J2
origin: manual
state: needs-info
depends-on: []
---

# TASK-393 — Port the conformance engine to TypeScript on bun

## Why

The engine is the gate's measured cost centre: about 26 ms of shell dispatch per rule, 150–300 s of harness time
(ADR-043 · TD-168). ADR-043 blocked a port on one irreversible property, a `bun` requirement for adopters.
ADR-049 (SPRINT-110, 2026-09-30) took that requirement for v2 trees at 2.0.0, so the port is now a design question
rather than a blocked one. Owner ruling (2026-09-30): filed to follow 2.0.0, not on its critical path.

## Done when

- [ ] `conformance.sh` runs a TypeScript engine with exit-code and report-text parity over the full real corpus and every
  retained fixture (ADR-043 properties 1 and 2); measured before/after harness time recorded.
- [ ] Retained must-FAIL fixture per rule family; worktree-isolated outside review.

## Touches

scripts/lib/conformance-engine.sh · conformance.sh · a new TS engine · evals/run-conformance-engine-fixtures.sh · evals/run-sprint-family-fixtures.sh

## Assumes

- **open:** does a v1 tree keep an `sh` engine (two implementations) or does 3.0 drop v1 checking? ADR-049 keeps v1 `sh`-only for 2.x.
- **open:** split before promote (size L): e.g. one task per STANDARD section family.

## Tracker

TD-168 · ADR-043 · ADR-049 · after 2.0.0 (owner, 2026-09-30)
