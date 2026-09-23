---
id: TASK-365
title: "Adopt the store in workdoo on a release candidate"
epic: EPIC-017
priority: P1
size: M
risk: med
autonomy: HITL
class: execution
tier: X
authority: J1
origin: manual
state: ready
depends-on: [TASK-371]
---

# TASK-365 — Adopt the store in workdoo on a release candidate

## Done when

- [ ] workdoo main runs the store on an immutable release candidate, LEANFLOW_PLUGIN_VERSION_PIN set to that version, and the running plugin verified to report it — before TASK-373. Approval and run state stay in workdoo's durable store (workdoo ADR-001).

## Amended 2026-09-23

- **Narrowed 2026-09-23 (Codex r1 · r2 · r3).** Adoption only: workdoo merges its migration using an immutable **pre-release candidate** (e.g. 2.0.0-rc.1) provisioned from a local path, sets LEANFLOW_PLUGIN_VERSION_PIN to that string, and verifies the running plugin reports it — BEFORE TASK-373, so the release gate holds (R2). The EPIC-016 view moved to TASK-385; the conformance engine to TASK-383; templates to TASK-378.
- Pin comparison is exact-string (workdoo packages/application/src/version-pin.ts), so a prerelease string matches; no production caller of the checker was found — confirm what actually enforces the pin.
- Superseded done-when (was, under the title "Ship the store to the consumer: workdoo, templates, conformance engine"): `workdoo` runs the same store; the EPIC-016 Work & Queue view reads it with **no second copy of status**; templates and the conformance engine ship the layout so an installing consumer gets it, not only this repo (L-015). Approval and run state stay in workdoo's durable store per its ADR-001 — a `review/` directory carries no identity-bound approval and must not become a competing status source.

## Touches

workdoo repo · lean-doc-generator/templates/ · scripts/lib/conformance-engine.sh

## Assumes

none — D4's split-by-kind is ruled and recorded in both repos

## Tracker

EPIC-017 D4 · scope 6 · workdoo ADR-001 · EPIC-016
