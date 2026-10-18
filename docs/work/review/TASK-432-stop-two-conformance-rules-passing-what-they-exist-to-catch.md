---
id: TASK-432
title: "Stop S11.TDDELETE and S4.NEGATIVE passing the cases they exist to catch"
epic: EPIC-022
sprint: SPRINT-125
priority: P1
size: M
risk: med
autonomy: HITL
class: execution
tier: G
authority: J2
origin: manual
state: ready
depends-on: []
---

# TASK-432 — Stop S11.TDDELETE and S4.NEGATIVE passing the cases they exist to catch

## Why

Both are false greens in rules `conformance.sh` runs for adopters — Consequential G (ADR-050). TD-187:
the TD-deletion extractor matches no real resolved-row shape, so it prints PASS having judged nothing.
TD-118: `grep -qi 'negative'` passes an ADR saying "no negatives identified".

## Done when

- [x] `S11.TDDELETE` extracts the sprint from every resolved-row shape the ledger uses, and prints a named ✓ `95993a47`+`a94182b9`: case-insensitive extraction from status field or `closed:`; must-FAIL per shape TD-101..107, non-vacuous recent controls TD-201..204, no-sprint rows → one `not judged` note; sprint-family 127 PASS; this repo now notes TD-168
      `not judged` for a resolved row with none — a retained must-FAIL fixture per real shape (TD-187).
- [x] `S4.NEGATIVE` fails an ADR whose Consequences deny any negative, ruled under ADR-034's frozen ✓ bare-denial matcher (prose · label · next-line); 6 must-FAIL + 5 must-PASS siblings incl. Codex's two examples; ADR-034 ruling + spec 0.16.0; this repo 53/53 unchanged; adr-family all green
      surface, with a must-FAIL fixture and a sibling control (TD-118).
- [x] Consequential-G bar: each assertion broken in turn reddens exactly its case; worktree-isolated ✓ seed campaigns (10 + 4, each reddening only its cases, engine restored by hash) · Codex R1 → revise → R2 clear (T6 coordinator-verified) · CHANGELOG verdict-change note (`4a29e70f`)
      outside review; CHANGELOG notes the verdict change for adopters.

## Touches

- scripts/lib/conformance-engine.sh · evals/ · docs/adr/ (only if ADR-034 needs an amendment) · CHANGELOG.md ·
  TECH-DEBT.md

## Assumes

- tightening S4.NEGATIVE may newly FAIL some adopter ADRs — acceptable as a documented verdict change.

## Tracker

- EPIC-022 Closed-when 2 · TD-187 · TD-118
