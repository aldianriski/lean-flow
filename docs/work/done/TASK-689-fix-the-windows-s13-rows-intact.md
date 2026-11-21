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
sprint: SPRINT-184
depends-on: []
---
# TASK-689 — Fix the Windows s13-rows-intact failure and the foreign-path false positive in check-layers-completeness (TD-318, TD-319)

## Why
TD-318 reproduced on this host: `run-spec-reader-fixtures.sh` case `s13-rows-intact` prints `FAIL … exit 0, 7 rows`, so a local gate reads red while off-host is green. TD-319 hit three sprints running: a Done-when path naming another repo's file is read as a lean-flow file. Both are defect fixes (unfrozen, ADR-053) on maintainer-only gate tooling.

## Done when
- [x] The cause of the Windows `s13-rows-intact` difference is named in the Tracker, and either the case passes on this Windows host or the case is made host-aware with the difference named, keeping a retained must-FAIL variant that still fails with its named finding when the rows are broken. ✓ cause named in the Tracker (C-locale one-byte dot vs 3-byte em-dash); exact-byte fix passes on this host under LC_ALL=C; s13-rows-broken must-FAIL retained with its named finding
- [x] `check-layers-completeness` exempts a Done-when path marked as another repo's (marker form decided at G2); a retained must-FAIL fixture shows a lean-flow path missing from Layers/Cites still gives the member-layers-incomplete FAIL, and one run on the real TASK-677 and SPRINT-182 T3 box shapes passes with no foreign path on `Cites:`. ✓ repo:path marker exempts a foreign Done-when path; member-foreign-path fixtures keep the missing-path FAIL; real TASK-677/678 shapes pass with no foreign path on Cites (member-foreign-real-shape); 61/0
- [x] Negative: a lean-flow path absent from Layers still FAILs after the exemption, and the s13 case still FAILs on a seeded row break. ✓ Negative held: missing lean.md still FAILs member-layers-incomplete beside a marked path; s13-rows-broken still FAILs on the seeded row break

## Touches
`evals/run-spec-reader-fixtures.sh` and its fixtures; `scripts/lib/check-layers-completeness.ts` and `evals/fixtures/layers-completeness/`. No new `.sh`, no new gate leg.

## Assumes
- Other G: a must-FAIL fixture plus one run on the real artifact, no mutation campaign; review-round cap 2 at G2.

## Tracker
TD-318 (SPRINT-181), TD-319 (SPRINT-182); owner intake area 4.
- SPRINT-184 T6 cause (TD-318): the s13-rows-intact case grepped `S13.NOINFER . implementation-directed`, where `.` stood for the em-dash. The spec bytes are identical in both locales (`od -c`: `S13.NOINFER` then `342 200 224`, a 3-byte UTF-8 em-dash); under `LC_ALL=C`, grep's `.` matches one byte, so the case failed with 7 correct rows while off-host (UTF-8) passed. Fix: match the em-dash as exact bytes (`\342\200\224`), locale-independent; the retained `s13-rows-broken` variant (NOINFER mark seeded to `x`) still fails with its named finding. TD-319: the in-token `repo:path` marker exempts another repo's file; unmarked foreign paths and missing lean-flow paths still FAIL (fixtures `member-foreign-path/`, `member-foreign-real-shape/`).
