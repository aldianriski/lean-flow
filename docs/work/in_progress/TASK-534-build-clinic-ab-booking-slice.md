---
id: TASK-534
title: "Build the clinic A/B repo's booking slice (Vue 3 + Vite + Go chi + PostgreSQL)"
epic: EPIC-023
sprint: SPRINT-147
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
- [x] `D:\Research\clinic-ab\` (git-initialised) runs end-to-end for booking an appointment: Vue page → chi handler → Postgres; `go test ./...`, `go vet ./...`, a frontend typecheck, a frontend lint script and the build all pass on a clean checkout. ✓ coordinator fresh clone, README steps only: initdb · pg_ctl start · createdb · migrate ×2 · `go test` · `go vet` · `npm ci` · typecheck · lint · test (4/4) · build, all rc=0; page → chi → Postgres booked by hand in the browser (appointment 1 at 2030-01-02T09:00:00Z, row confirmed in `appointments`), re-submit refused `SLOT_TAKEN`
- [x] Two invariants enforced and tested through that path: no double booking of a doctor slot · per-doctor working hours. ✓ `TestNoDoubleBooking` (+ `TestSlotTakenIsPerDoctor`, `TestUniqueConstraintBacksSlotRule`) and `TestWorkingHoursBoundaries` (+ `TestUnknownDoctor`) through `httptest` on the real router and DB; red at test commits `868f08b` / `a412186` (assertion failures, e.g. 17:00 got 201, want 422), green at `8db6604` / `ee781f1`; without `DATABASE_URL` the suite fails (rc=1, 0 skips)
- [x] At least 3 non-standard conventions a generic agent would not guess, each recorded with where it shows in code, in the external spec `D:\Research\clinic-ab-spec\` — never in the repo, which carries no lean-flow docs. ✓ `D:\Research\clinic-ab-spec\spec.md` (marked partial) records C1 · C2′ · C3 · C4′ with file locations, all 10 files present; greps: no rule returns `error`, no Get/Create/Delete store verb, no `fetch` outside `web/src/gateway/`; the repo's only document is the README, which does not describe them
- [x] The builder brief excludes `lean-flow-3-foundation.md` §4 and EPIC-023 (brief retained). ✓ brief retained verbatim at `docs/research/logs/ab-clinic-builder-brief.md` (`1320bb88`, before dispatch); 0 hits for `lean-flow`, `EPIC-`, `foundation`, `A/B`, `hypothes`, and nothing on documentation, context files or discovery

## Touches
`D:\Research\clinic-ab\` · `D:\Research\clinic-ab-spec\` (both outside this repo)

## Assumes
- Toolchain present: Go 1.26.4 · PostgreSQL 18.3 · Docker 29.7 · Node 22 (verified 2026-10-29).

## Tracker
EPIC-023 D3 · research D7 · intake I-1
