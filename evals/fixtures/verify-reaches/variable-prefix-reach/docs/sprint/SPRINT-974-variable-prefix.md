---
sprint: 974
slug: variable-prefix
owner: Maintainer
last_updated: 2026-09-13
status: active
plan_commit: 0000000
update_trigger: sprint execute/close events
---

# SPRINT-974 — Variable Prefix

<!-- CONTROL: must stay PASS. REGRESSION GUARD, not a hypothetical: an outside reviewer dispatched
     per ADR-029 found that an earlier draft of this sprint's own fix false-FAILed on this repo's own
     `conformance.sh` (line 17: `exec sh "$here/scripts/lib/conformance-engine.sh" "$@"`), reproduced
     live against `docs/sprint/archive/SPRINT-079-the-undifferentiated-middle.md:64`. Reduced here to
     a stand-in so the guard does not depend on conformance.sh's own text staying stable. The target
     `lib/deep/target.sh` is named in this criterion's PROSE (matching the real case's shape: the
     target sits before `*Verify:*`, not inside it) and is reached only via `$here/lib/deep/target.sh`
     in the named script -- no bare mention of the target exists anywhere else in that script. -->

## Plan

### T1 — the deep target
**DoD:**
- [x] `lib/deep/target.sh` is invoked with the right arguments — *Verify: `sh evals/fixtures/verify-reaches/scripts/reaches-via-var.sh`*
