---
sprint: 901
slug: unindented-continuation
owner: Maintainer
last_updated: 2026-08-09
status: active
plan_commit: fixture
close_commit: fixture
update_trigger: fixture -- must-FAIL input for evals/run-layers-completeness-fixtures.sh (SPRINT-049
  T3); reproduces a real promote-time failure
---

# SPRINT-901 — Unindented Layers continuation (must-FAIL input)

<!-- REAL SHAPE, reconstructed: this is what the SPRINT-049 Plan itself did at promote. A long
     `Layers:` list was wrapped across three lines at column 0. The checker read only the first line,
     so every path on the continuations became simultaneously undeclared AND prose-implied, producing
     a cascade of false positives under a finding that pointed at the wrong cause -- it was first
     mis-diagnosed as TD-032's prose-mention shape, and an Acceptance line was reworded on that wrong
     diagnosis before a direct test showed bare basenames match fine by substring.

     Silent truncation is the defect, so the fix is not "read column-0 continuations too" -- that
     would guess at the author's intent. An indented continuation is read; an unindented one is named
     (L-087: the symptom was real, the mechanism welded to it was inferred and wrong). -->

## Plan

### T1 — Wrap a long declaration at column 0 `[size: M · risk: med · class: execution · AFK]`
Layers: `scripts/lib/check-layers-completeness.sh` · `scripts/lib/check-layers-observed.sh` ·
`scripts/qa-check.sh` · `evals/run-layers-completeness-fixtures.sh`
Depends-on: none

The second declaration line begins at column 0, so it is not a continuation. Before this check it
was silently reclassified as prose; now it is named.

**Acceptance:** the checker names the unindented continuation rather than silently dropping it.

**DoD:**
- [ ] The wrapped declaration is reported, not swallowed

### T2 — Wrap the same declaration correctly `[size: S · risk: low · class: execution · AFK]`
Layers: `scripts/lib/check-layers-completeness.sh` ·
    `scripts/qa-check.sh`
Depends-on: none

The control case: identical content, continuation indented. This block must produce no finding, so
the fixture proves the check discriminates rather than rejecting every wrapped declaration.

**Acceptance:** an indented continuation is read as part of the declaration.

**DoD:**
- [ ] `scripts/qa-check.sh` is recognised as declared even though it sits on the second line
