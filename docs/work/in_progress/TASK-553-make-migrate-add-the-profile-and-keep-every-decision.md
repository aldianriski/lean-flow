---
id: TASK-553
title: "Make migrate add the profile to a 2.x repo and keep every decision"
epic: EPIC-023
sprint: SPRINT-153
priority: P2
size: M
risk: high
autonomy: HITL
class: decision
tier: P
authority: J2
origin: decomposer
state: blocked
depends-on: [TASK-547, TASK-548, TASK-549, TASK-552]
---

# TASK-553 — Make migrate add the profile to a 2.x repo and keep every decision

## Why
Owner decision D6: `/lean-doc-generator migrate` upgrades a 2.x repo in place, keeping its docs. Research §9 risk "2.x
adopters broken". The epic's S1 Closed-when line requires a real 2.x `migrate` that keeps every existing decision. Not frozen
under ADR-053. G2 review-round cap: 2.

## Done when
- [x] `migrate` on a 2.x repo adds the profile sections, filled from the scan, the repo's existing docs and any matched set, and
  asks only what none of them settles. ✓ kalasuara re-run (plugin a991c393): `## Stack` added to overview.md, requirements.md created; topics CLAUDE/CONTEXT settle are cited, only Business goal and Quality attributes asked
- [x] A before/after inventory shows every ADR, owner ruling and settled requirement present before is still present, not
  reworded; every pointer `migrate` writes resolves. ✓ coordinator recompute vs the untouched snapshot: 49/49 ADR, 23/23 PRD, 49/49 DECISIONS rows, 7/7 Closed-when identical; 8/8 cited `§ heading` pointers resolve
- [x] A real `migrate` through the installed plugin on the kalasuara snapshot passes both, with no lean-flow-internal path in the
  output, and the owner reads the added sections as specific to that site. ✓ leak scan clean; owner ruled the sections site-specific (popup 2026-11-01)

## Touches
lean-doc-generator migration-map reference

## Assumes
- **blocked-by:** TASK-547 (sections and scan), TASK-548 (business discovery), TASK-549 (set loading), TASK-552 (final template shapes).
- kalasuara (Python content site, lean-flow v2, 49 ADR files) is unprofiled, so this also exercises the scan-only fallback
  under `migrate` (I-3). Snapshot copy in `D:\Research`, never the original.

## Tracker
EPIC-023 Closed-when S1 · research §5 D6, §9 · S1 intake I-3 (2026-10-30; Codex R1 note N1 → TASK-549 dependency)
