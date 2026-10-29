---
id: TASK-534
title: "Build the clinic A/B repo's booking slice (Vue 3 + Vite + Go chi + PostgreSQL)"
epic: EPIC-023
priority: P2
size: M
risk: med
autonomy: HITL
class: execution
tier: X
authority: J1
origin: decomposer
state: ready
depends-on: []
---

# TASK-534 — Build the clinic A/B repo's booking slice (Vue 3 + Vite + Go chi + PostgreSQL)

## Why
D7 needs a second stack, or the A/B says nothing beyond one framework. Clinic booking (intake I-1) gives real business rules and room for repo-specific conventions. Not frozen under ADR-053: maintainer-only measurement (`evals/ab/`, paid, run by hand), never a gate or `qa-check.sh` leg. G2 review-round cap: 2. Design source: `docs/research/lean-flow-3-foundation.md` §7 and the S0 intake rulings I-1..I-3, R-a..R-c (2026-10-29).

## Done when
- [ ] `D:\Research\clinic-ab\` (git-initialised) runs end-to-end for booking an appointment: Vue page → chi handler → Postgres; `go test ./...`, `go vet ./...`, a frontend typecheck, a frontend lint script and the build all pass on a clean checkout.
- [ ] Two invariants enforced and tested through that path: no double booking of a doctor slot · per-doctor working hours.
- [ ] At least 3 non-standard conventions a generic agent would not guess, each recorded with where it shows in code, in the external spec `D:\Research\clinic-ab-spec\` — never in the repo, which carries no lean-flow docs.
- [ ] The builder brief excludes `lean-flow-3-foundation.md` §4 and EPIC-023 (brief retained).

## Touches
`D:\Research\clinic-ab\` · `D:\Research\clinic-ab-spec\` (both outside this repo)

## Assumes
- Toolchain present: Go 1.26.4 · PostgreSQL 18.3 · Docker 29.7 · Node 22 (verified 2026-10-29).

## Tracker
EPIC-023 D3 · research D7 · intake I-1
