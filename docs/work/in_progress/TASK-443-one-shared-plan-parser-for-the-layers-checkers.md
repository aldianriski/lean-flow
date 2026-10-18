---
id: TASK-443
sprint: SPRINT-128
title: "Give the Plan one shared parser, and move the two Layers checkers onto it"
epic: EPIC-022
priority: P1
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

# TASK-443 — One shared Plan parser for the Layers checkers

## Why

A `Layers:` declaration is read by about eight `### Tn` heading regexes, three copies of the token extractor and two identical
`## Plan` extractors, and the copies disagree on wrapped lines. `check-layers-observed.ts` drops a column-0 wrap silently while
`check-layers-completeness.ts` FAILs it (TD-138, 4 archived plans carry the shape). EPIC-022 Closed-when 7 asks for one parser.
Consequential G: the module lives in `sprint-members.ts`, which `conformance.sh` reaches (ADR-050).

## Done when

- [x] `sprint-members.ts` exports one Plan parser: the `## Plan` section (fence-aware), `### Tn` headings with an optional letter ✓ parsePlan exported; column-0 continuation returned as a named anomaly (868765ea)
      suffix, and `Layers:` · `Cites:` · `Depends-on:` with their continuation lines, a column-0 wrap returned as a named anomaly.
- [x] `check-layers-completeness.ts` and `check-layers-observed.ts` read Plans only through it; their own `extractPlanLines`, ✓ both checkers read through parsePlan, own extractors deleted, column-0 named in both; non-task headings keep each checker's old reading (Codex R1 P1)
      token extractors and heading regexes are deleted, and both name a column-0 wrap instead of dropping or crashing on it.
- [x] A Done-when bare filename matches a `Layers:` path whose basename it equals when exactly one declared path has that ✓ basename rule exactly-one, ambiguous named; own-sprint attribution; seeded S2/S3 redden only their case
      basename (TD-178 · TD-215), and `check-layers-observed` attributes a `sprint(NNN) Tn:` commit only when NNN is its own sprint
      (TD-248).
- [x] Verdicts unchanged elsewhere: both checkers give the same verdict as before on all 127 archived plans and every existing ✓ mechanical: 145-plan old-vs-new projection 0 differences; completeness CLI byte-identical bar the reworded finding; observed CLI identical on the live sprint
      fixture, apart from the named-anomaly cases above, recorded as a before/after differential.
- [x] Full Tier G bar: a retained must-FAIL fixture per new behaviour, and seeded breaks that each redden exactly their case. ✓ mechanical: seeds S1/S2/S3 + P1a/P1b + err-loud each redden exactly their cases; coordinator re-seeded S1 independently (54/4); Codex R2 CLEAR

## Touches

- scripts/lib/sprint-members.ts · scripts/lib/check-layers-completeness.ts · scripts/lib/check-layers-observed.ts · evals/

## Assumes

- A1: the consolidation preserves behaviour; the differential on the archived corpus is the proof, not a reading of the code.
- Shares `sprint-members.ts` with TASK-445; the commit order is set at G2.

## Tracker

- EPIC-022 Closed-when 7 · TD-138 · TD-178 · TD-215 · TD-248 · SPRINT-127 intake recon (parser census)
