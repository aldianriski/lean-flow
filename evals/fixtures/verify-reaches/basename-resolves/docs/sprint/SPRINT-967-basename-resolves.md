---
sprint: 967
slug: basename-resolves
owner: Maintainer
last_updated: 2026-08-24
status: active
plan_commit: 0000000
update_trigger: sprint execute/close events
---

# SPRINT-967 — Basename Resolves

<!-- CONTROL: must stay PASS. MOTIVATING ARTIFACT (L-166), not synthetic: this is the exact clause
     TD-097's Evidence names -- SPRINT-087 T4 DoD 1. `read-spec-rules.sh` is named by BASENAME, the
     repo's dominant convention, and the script lives at `scripts/lib/read-spec-rules.sh`. Before the
     fix this read `verify-method-absent` for a script that is, in fact, present -- a criterion whose
     method is reported missing sends the reader to rebuild something that already exists. No `/`
     target is named in the clause, so the correct verdict is PASS with 0 claimed targets, not a
     judgment note (the script itself IS named, it is simply unreachable-target-free). -->

## Plan

### T1 — the selector
**DoD:**
- [x] `--section N` selects that section's rules and no others — *Verify: compared against `read-spec-rules.sh --section N`, which already answers this question*
