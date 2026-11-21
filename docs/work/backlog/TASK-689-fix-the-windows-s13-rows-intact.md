---
id: TASK-689
title: "Fix the Windows s13-rows-intact failure and the foreign-path false positive in check-layers-completeness (TD-318, TD-319)"
priority: P2
size: M
risk: med
autonomy: HITL
class: execution
tier: G
authority: J1
origin: decomposer
state: ready
depends-on: []
---
# TASK-689 — Fix the Windows s13-rows-intact failure and the foreign-path false positive in check-layers-completeness (TD-318, TD-319)

## Why
TD-318 reproduced on this host: `run-spec-reader-fixtures.sh` case `s13-rows-intact` prints `FAIL … exit 0, 7 rows`, so a local gate reads red while off-host is green. TD-319 hit three sprints running: a Done-when path naming another repo's file is read as a lean-flow file. Both are defect fixes (unfrozen, ADR-053) on maintainer-only gate tooling.

## Done when
- [ ] The cause of the Windows `s13-rows-intact` difference is named in the Tracker, and either the case passes on this Windows host or the case is made host-aware with the difference named, keeping a retained must-FAIL variant that still fails with its named finding when the rows are broken.
- [ ] `check-layers-completeness` exempts a Done-when path marked as another repo's (marker form decided at G2); a retained must-FAIL fixture shows a lean-flow path missing from Layers/Cites still gives the member-layers-incomplete FAIL, and one run on the real TASK-677 and SPRINT-182 T3 box shapes passes with no foreign path on `Cites:`.
- [ ] Negative: a lean-flow path absent from Layers still FAILs after the exemption, and the s13 case still FAILs on a seeded row break.

## Touches
`evals/run-spec-reader-fixtures.sh` and its fixtures; `scripts/lib/check-layers-completeness.ts` and `evals/fixtures/layers-completeness/`. No new `.sh`, no new gate leg.

## Assumes
- Other G: a must-FAIL fixture plus one run on the real artifact, no mutation campaign; review-round cap 2 at G2.

## Tracker
TD-318 (SPRINT-181), TD-319 (SPRINT-182); owner intake area 4.
