---
id: TASK-615
title: "Name the conformance verdict beside the gate's tally"
type: debt
epic: EPIC-024
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
- [ ] `qa-check.sh` prints a separate line naming the conformance engine's informational finding count, including 0, directly before the verdict line.
- [ ] A retained must-FAIL fixture reddens when the line is removed or miscounts, with its named finding, and a sibling control stays green.
- [ ] One run on the real repo: the line's count equals the informational FAIL rows counted separately from the same output.
- [ ] TD-081 reads `status: resolved → TASK-615`.
- [ ] Negative: the verdict line stays exactly `QA-CHECK: N pass, M fail` and stays last, `scripts/qa-verdict.ts` and `scripts/gate-remote.ts` are unchanged and their tests pass, and conformance findings do not enter the tally.

## Touches
`scripts/qa-check.sh` · `evals/` · `TECH-DEBT.md`

## Assumes
- TD-081's suggested form, appending to the verdict line, is not available: `VERDICT_RE` in `scripts/qa-verdict.ts` is anchored at both ends, so editing that line makes every run read as verdict-less. Its own header warns of this. Hence a separate line.
- The new line must not match `VERDICT_RE` or `TRUNCATED_RE`.
- Maintainer-only, so Other G: must-FAIL fixture plus one run on the real artifact (ADR-050). `conformance.sh` prints its own report; the builder confirms it needs no change.

## Tracker
TD-081 · host sprint for EPIC-024 row 1
