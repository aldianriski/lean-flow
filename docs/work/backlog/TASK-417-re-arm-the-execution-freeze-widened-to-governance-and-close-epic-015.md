---
id: TASK-417
title: "Re-arm the execution freeze, widened to governance work, and close EPIC-015"
epic: EPIC-015
priority: P1
size: M
risk: med
autonomy: HITL
class: decision
tier: P
authority: J2
origin: decomposer
state: blocked
depends-on: [TASK-414, TASK-415, TASK-416]
---

# TASK-417 — Re-arm the execution freeze, widened to governance work, and close EPIC-015

## Why

EPIC-015 CW8: the freeze re-arms after both dogfoods. Owner ruling 2026-10-10: the re-armed freeze also governs new guards,
checkers and ledger machinery, under the same five admission conditions, so that governance earns its recurring cost (Codex
review H0). Evidence: of 941 commits since SPRINT-090, ~6% touch `skills/` and ~69% touch governance docs (overlapping categories).

## Done when

- [ ] An ADR records the widened freeze: what it covers (the execution loop plus governance machinery), the five admission
      conditions, what is explicitly not frozen (consumer-facing skill work, defect fixes), how an admission is recorded, and a
      bounded-review / stop rule for admitted governance work (a declared effort cap per item; a finding whose shape has zero
      occurrences in the real corpus routes to TD, not another round).
- [ ] `docs/research/adlc-epic-sequencing.md` § FROZEN carries the re-arm and the widening, and the rule is placed where every flow
      that proposes new governance work reads it (§10 placement test — at least promote and task-decomposer intake).
- [ ] The interim restriction recorded on 2026-10-10 is replaced by the ADR, leaving no second live version of the rule.
- [ ] EPIC-015 CW8 is ticked and the epic closes by its own rules (all eight `[x]`).

## Touches

- `docs/adr/` (new ADR) · `docs/research/adlc-epic-sequencing.md` · `docs/epic/EPIC-015-execution-autonomy.md` · the placement
  target(s) G2 names

## Assumes

- **blocked-by:** TASK-414 (CW6), TASK-415 and TASK-416 (both dogfoods). The dogfoods are defined at V3 §56 and the re-arm rule
  is V3 §58; EPIC-015 D1 cites both, so they do not conflict.

## Tracker

- EPIC-015 CW8 · D1 · Codex review rounds 1–2 (2026-10-10) · owner grill 2026-10-10
