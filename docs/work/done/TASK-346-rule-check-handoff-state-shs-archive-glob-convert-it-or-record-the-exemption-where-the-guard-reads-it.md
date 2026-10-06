---
id: TASK-346
title: "Rule `check-handoff-state.sh`'s archive glob: convert it, or record the exemption where the guard reads it"
priority: P2
size: S
risk: low
autonomy: HITL
class: execution
tier: G
authority: J1
origin: close-retro
state: ready
sprint: SPRINT-116
---

# TASK-346 — Rule `check-handoff-state.sh`'s archive glob: convert it, or record the exemption where the guard reads it

## Done when

- [x] `scripts/lib/check-handoff-state.sh:145` either calls `lf_is_archived_path` like the other eleven sites, or its exemption stops living as a comment inside `qa-check.sh`'s leg 10b allow-list regex and becomes a declaration the guard reads. Today the reason is sound — it MAPS a Plan path to its log path rather than excluding, and self-enumerates via a literal archived-sprint glob, so it never tests a caller-supplied string of unknown casing (independently verified at SPRINT-099 T3 review) — but the exemption is hardcoded in a regex two files away, which is L-151's shape: a ruling recorded where its reader must be told about it. ✓ b2f20a7: line 145 (now 150) calls lf_is_archived_path, sourced from archive-path.sh like the other sites; leg 10b exempts only archive-path.sh. Real leg 10b code (qa-check.sh 937-950, run verbatim): PASS converted · FAIL "1 site(s) carry a raw archive exclusion" with the raw case re-seeded · restored hash == pre-seed (bfb0ed97). check-handoff-state.sh output on this repo identical before/after; HANDOFF-STATE FIXTURES: all green

## Touches

- `scripts/lib/check-handoff-state.sh` · `scripts/qa-check.sh` (leg 10b allow-list)

## Assumes

- none — the mapping-vs-exclusion distinction was verified, not assumed

## Tracker

- SPRINT-099 T3 (ruled OUT of scope at G2 by the owner; the eleventh exclusion site was folded in, this mapping site was not)
