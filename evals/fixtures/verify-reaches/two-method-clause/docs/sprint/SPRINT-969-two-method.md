---
sprint: 969
slug: two-method
owner: Maintainer
last_updated: 2026-08-24
status: active
plan_commit: 0000000
update_trigger: sprint execute/close events
---

# SPRINT-969 — Two Method

<!-- CONTROL: must stay PASS. MOTIVATING ARTIFACT (L-166), not synthetic: this is the exact clause
     TD-087's Evidence names -- SPRINT-084 T5 DoD, line 135. Two scripts named in one `Verify:`
     clause, both full paths, each shaped like the other's "target" to the old path-substring
     extraction. Before the fix this produced TWO verify-does-not-reach-target FAILs -- the
     checker pairing `scripts/lib/check-doc-caps.sh` and `scripts/gen-index.sh` against each other
     -- against a criterion that genuinely passed (SPRINT-084's own retro: "T5's names two scripts
     in one Verify: clause that the checker pairs against each other ... froze at promote"). -->

## Plan

### T1 — the doc cap and the index
**DoD:**
- [x] The doc is ≤130 lines with ADR-009 frontmatter, and the index is regenerated — *Verify: `sh scripts/lib/check-doc-caps.sh` and `sh scripts/gen-index.sh`*
