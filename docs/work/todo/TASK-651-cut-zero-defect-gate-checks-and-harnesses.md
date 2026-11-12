---
id: TASK-651
title: "Cut the zero-defect gate checks G0043 G0093 G0268 G0297 G0324 G0372 G0396 G0985 G1511 and their harnesses, keeping every census-kept check running"
epic: EPIC-025
sprint: SPRINT-173
priority: P1
size: M
risk: med
autonomy: AFK
class: mechanical-ingest
tier: G
authority: J0
origin: decomposer
state: ready
depends-on: []
---

# TASK-651 — Cut the zero-defect gate checks and their harnesses

## Why

EPIC-025 condition 2 and owner ruling 2026-11-12 ("Accept all"): 9 gate checks and their 7 harnesses had 0 real defects in the census (D2 bar). H18 stays (owner: "Keep H18, 28 cuts"). Deletions are unfrozen (ADR-053 §3). Measured cost: the gate is 1,676 lines, `scripts/lib/` 35 files, `evals/` 77 entries. Other G, no consequential check touched. G2 review-round cap: 2.

## Done when

- [ ] The census rows G0043, G0093, G0268 (leg only), G0297, G0324, G0372, G0396, G0985, G1511 and harnesses H08, H09, H11, H12, H20, H28, H31 no longer run or print in `scripts/qa-check.sh`. Each script and harness file is deleted unless a kept caller still imports it. `check-prose-density.ts` stays (imported by check-doc-caps, promote-check, merge-check).
- [ ] The check-name census at the pre-cut base versus after differs by exactly the cut rows' names. A second query diffs the harness registry against the H ids. Both agree. Every census-kept check, including G0435 and G0917, still prints its names and its must-FAIL fixture still fails by name.
- [ ] No dangling reference remains: `grep` for each deleted script and harness name over `scripts/ evals/ skills/ spec/ docs/QA.md` (excluding archives, logs, changelogs, fixture copies of old records under `evals/fixtures/`, and test-input strings that name no file) returns nothing. That covers the handoff-reconciliation mention, QA.md, evals/README.md and run-emitter-column-fixtures.ts.
- [ ] The full gate (`QA_FULL=1`, off-host) ends with 0 FAIL and its own printed verdict line, read as a separate call.
- [ ] Negative: seeding one kept check's must-FAIL input (e.g. G0636 review-depth: a self-review line with `governance:high`) still prints `review-depth-governance-self-reviewed`, and re-adding a deleted harness name to the registry makes the gate FAIL it as "harness not found", never a silent skip.

## Touches

`scripts/qa-check.sh`; `scripts/lib/check-{qa-budget-default,handoff-state,research-archive,task-origin,work-type,approval-envelope}.*`; `scripts/lib/qa-budget-check.sh` and `scripts/lib/sprint-members.ts` (comment or reference fixes only); the 16 cut harnesses under `evals/`; `evals/README.md`;
`skills/lean-doc-generator/references/handoff-reconciliation.md` (the check mention only); `docs/QA.md`. Overlap: qa-check.sh registry line with TASK-653 and TASK-655; `evals/README.md` with TASK-655.

## Assumes

- Cuts are leg plus harness; a script is deleted only with no kept caller (G0268's script stays).
- R09 (handoff stub) stays; only G0297's check goes.
- No permission settings are edited; stale allow entries for `check-approval-envelope.sh` are removed by the owner by hand.

## Tracker

EPIC-025 condition 2; census appendix ruling column; owner popup "Accept all", 2026-11-12.
