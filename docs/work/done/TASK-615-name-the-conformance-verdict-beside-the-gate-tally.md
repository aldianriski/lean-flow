---
id: TASK-615
title: "Name the conformance verdict beside the gate's tally"
type: debt
epic: EPIC-024
sprint: SPRINT-165
priority: P2
size: S
risk: low
autonomy: HITL
class: execution
tier: G
authority: J1
origin: manual
state: ready
depends-on: []
---

# TASK-615 — Name the conformance verdict beside the gate's tally

## Why
TD-081. `qa-check.sh` prints two verdicts and only one is the tally, so `QA-CHECK: 173 pass, 0 fail` can sit below seven conformance FAIL rows that a reader of the last line never sees.

## Done when
- [x] `qa-check.sh` prints a separate line naming the conformance engine's informational finding count, including 0, directly before the verdict line. ✓ gate log of 41d2fd4d, line 669: conformance: 63 informational finding(s), full spec, not in the tally, directly above the verdict line
- [x] A retained must-FAIL fixture reddens when the line is removed or miscounts, with its named finding, and a sibling control stays green. ✓ evals/run-conformance-line-fixtures.ts, 14 pass, 0 fail: removed call at each site gives conformance-line-missing, a leaking row gives conformance-line-miscount, the unmutated control is green; red before the edit, 2 pass and 12 fail
- [x] One run on the real repo: the line's count equals the informational FAIL rows counted separately from the same output. ✓ gate log of 41d2fd4d: N is 63; INFO rows from the engine's first row (line 377) to its note: 63; all INFO rows 64, minus the one prose-density row at line 149 from another leg: 63
- [x] TD-081 reads `status: resolved → TASK-615`. ✓ flipped in 4d97cb53
- [x] Negative: the verdict line stays exactly `QA-CHECK: N pass, M fail` and stays last, `scripts/qa-verdict.ts` and `scripts/gate-remote.ts` are unchanged and their tests pass, and conformance findings do not enter the tally. ✓ gate log ends QA-CHECK: 463 pass, 0 fail; qa-verdict.ts, gate-remote.ts and conformance-engine.sh unchanged by git diff; qa-verdict and gate-remote tests 90 pass, 0 fail; the pass and fail arithmetic is untouched in the diff

## Touches
`scripts/qa-check.sh` · `evals/` · `TECH-DEBT.md`

## Assumes
- TD-081's suggested form, appending to the verdict line, is not available: `VERDICT_RE` in `scripts/qa-verdict.ts` is anchored at both ends, so editing that line makes every run read as verdict-less. Its own header warns of this. Hence a separate line.
- The new line must not match `VERDICT_RE` or `TRUNCATED_RE`.
- Maintainer-only, so Other G: must-FAIL fixture plus one run on the real artifact (ADR-050). `conformance.sh` prints its own report; the builder confirms it needs no change.

## Tracker
TD-081 · host sprint for EPIC-024 row 1
