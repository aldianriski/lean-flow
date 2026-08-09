---
sprint: 901
slug: dir-token-prefix-fixture
owner: Maintainer
last_updated: 2026-08-09
status: active
plan_commit: fixture
close_commit: fixture
update_trigger: fixture -- constructed input for evals/run-layers-completeness-fixtures.sh covering
  the directory-token rule added at SPRINT-055 T1 (a `Layers:` token ending in "/" is a PREFIX, not a
  wildcard). NOT a recorded incident: hand-built so the new rule is exercised in BOTH directions.
  T1 must PASS (every implied path sits under the declared tree) and T2 must FAIL (an implied path
  sits outside it). Without the T2 half, a prefix rule that accidentally matched everything would
  look correct -- which is the failure mode the rule itself was added to remove.
---

# SPRINT-901 — Directory Token Prefix (constructed fixture)

## Plan

### T1 — Build the fixture tree under one declared directory `[size: S · risk: low · class: execution · AFK]`
Layers: `evals/fixtures/count-claims/`
Depends-on: none

Every path this task touches sits beneath the single declared directory token, which is the case the
rule exists to serve — a fixture tree is an atomic artifact of one task, and enumerating each
generated file in a frozen declaration is bookkeeping, not coordination.

**Acceptance:** `evals/fixtures/count-claims/lockstep/README.md` and
`evals/fixtures/count-claims/total-drift/README.md` exist and are covered by the declared directory.

**DoD:**
- [ ] `evals/fixtures/count-claims/lockstep/README.md` written
- [ ] `evals/fixtures/count-claims/core-drift/NOTES.md` written

### T2 — Reach outside the declared tree `[size: S · risk: low · class: execution · AFK]`
Layers: `evals/fixtures/count-claims/`
Depends-on: none

Declares the same directory but its prose implies a file OUTSIDE that tree. The prefix must not
swallow it: a directory token covers what is beneath it and nothing else. This block must FAIL.

**Acceptance:** `scripts/lib/check-count-claims.sh` is wired into the gate.

**DoD:**
- [ ] `scripts/lib/check-count-claims.sh` created and delegated to
