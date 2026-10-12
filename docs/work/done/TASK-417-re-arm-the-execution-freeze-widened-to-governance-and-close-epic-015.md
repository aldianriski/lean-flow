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
state: ready
sprint: SPRINT-124
depends-on: [TASK-414, TASK-415, TASK-416, TASK-423]
---

# TASK-417 — Re-arm the execution freeze, widened to governance work, and close EPIC-015

## Why

EPIC-015 CW8: the freeze re-arms after both dogfoods. Owner ruling 2026-10-10: the re-armed freeze also governs new guards,
checkers and ledger machinery, under the same five admission conditions, so that governance earns its recurring cost (Codex
review H0). Evidence: of 941 commits since SPRINT-090, ~6% touch `skills/` and ~69% touch governance docs (overlapping categories).

## Done when

- [x] An ADR records the widened freeze: what it covers (the execution loop plus governance machinery), the five admission ✓ ADR-053 § Decision 1–5 (65ede7df), owner read-through accepted by popup
      conditions, what is explicitly not frozen (consumer-facing skill work, defect fixes), how an admission is recorded, and a
      bounded-review / stop rule for admitted governance work (a declared effort cap per item; a finding whose shape has zero
      occurrences in the real corpus routes to TD, not another round).
- [x] `docs/research/adlc-epic-sequencing.md` § FROZEN carries the re-arm and the widening, and the rule is placed where every flow ✓ § FROZEN amendment 2026-10-12 → ADR-053; placed as a .claude/CLAUDE.md Anti-Pattern per the G2 ruling (read by promote + decomposer intake; caps PASS 80/80)
      that proposes new governance work reads it (§10 placement test — at least promote and task-decomposer intake).
- [x] The interim restriction recorded on 2026-10-10 is replaced by the ADR, leaving no second live version of the rule. ✓ paragraph removed (65ede7df); grep finds no other live copy outside archive/done
- [x] EPIC-015 CW8 is ticked and the epic closes by its own rules (all eight `[x]`). ✓ 8/8 [x], status: closed (928d4a43); check-epic-archive PASS, archives at SPRINT-124 close

## Touches

- `docs/adr/` (new ADR) · `docs/research/adlc-epic-sequencing.md` · `docs/epic/EPIC-015-execution-autonomy.md` · the placement
  target(s) G2 names

## Assumes

- **blocked-by:** TASK-414 (CW6), TASK-415 and TASK-416 (both dogfoods). The dogfoods are defined at V3 §56 and the re-arm rule
  is V3 §58; EPIC-015 D1 cites both, so they do not conflict.
- **blocked-by:** TASK-423 — EPIC-015 CW6 was not met by TASK-414 (USER_STOP is emitted by no code path), so the epic cannot close until TASK-423 ticks it (/triage, 2026-10-10).
- **Unblocked 2026-10-11** (SPRINT-124 promote): TASK-414, 415, 416 and 423 are all in `done/`; CW5–CW7 were proven at SPRINT-122.

## Tracker

- EPIC-015 CW8 · D1 · Codex review rounds 1–2 (2026-10-10) · owner grill 2026-10-10
