---
sprint: 927
status: active
---
# SPRINT-927 -- real SPRINT-182 shapes (TD-319)

<!-- docs/sprint/archive/SPRINT-182-graphify-and-rtk-retest.md: T2/T3 verbatim except fixture member ids and removal of the foreign Cites token. -->

## Members

- docs/work/todo/TASK-966-rtk.md
- docs/work/todo/TASK-967-cleanup.md

## Plan

### T2 — Run plain and graphify ABBA, score blind, rule on graphify `[size: M · risk: med · class: execution · HITL · J2]`
Layers: `docs/research/graphify-workdoo-test.md` · `docs/research/graphify-rtk-retest-results.md` · `docs/knowledge-index.md`
Depends-on: T1
Cites: TASK-967, `docs/research/graphify-rtk-retest-questions.md`
The first test installed no integration and ran no query. This runs the README's query-first use against a plain baseline, scored blind.

**Acceptance:** a graphify verdict against the bar (correctness at least plain, tokens at most 1.0x plain) with spread and USD reported separately, and the snapshot back at baseline.

### T3 — Run RTK posthook and terse against its own plain pair, rule on RTK `[size: M · risk: med · class: execution · HITL · J2]`
Layers: `docs/research/rtk-trial-verdict.md` · `docs/research/graphify-rtk-retest-results.md` · `docs/knowledge-index.md`
Depends-on: T2
Cites: TASK-966, `docs/research/graphify-rtk-retest-questions.md`
The OSS edition has no pipeline engine, so this installs the full edition apart from it and compares RTK with its own plain runs.

**Acceptance:** an RTK keep, drop or inconclusive verdict against the bar, the probe deleted, and the snapshot back at baseline.
