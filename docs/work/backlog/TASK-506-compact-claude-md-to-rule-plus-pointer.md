---
id: TASK-506
title: "Compact CLAUDE.md to rule plus pointer and ratchet the always-loaded token budget down"
priority: P2
size: M
risk: med
autonomy: HITL
class: execution
tier: P
authority: J1
origin: decomposer
state: ready
depends-on: []
---

# TASK-506 — Compact CLAUDE.md to rule plus pointer and ratchet the always-loaded token budget down

## Why
Measured cost: `.claude/CLAUDE.md` is 80 lines but 2,432 words / 15.7 KB, longest line 3,678 chars, loaded every session.
Many bullets carry their incident history inline, which anti-slop names "value is not length". The token budget
(ADR-048, `token-budget.txt` 16,087 for the pair) already catches long lines; this task spends the headroom.

## Done when
- [ ] Every CLAUDE.md bullet is a rule plus its `L-NNN` / ADR pointer; no incident narrative remains.
- [ ] Before any story is cut, its cited L-NNN entry is checked to hold it; a story with no home is moved into that entry
      first, so no signal is lost.
- [ ] Before any block is removed, its readers are searched for (L-117); every count claim `check-count-claims.sh`
      verifies in CLAUDE.md still checks out.
- [ ] ≤ 80 lines; the pair is re-measured with the calibrated method and `scripts/lib/token-budget.txt` is lowered to
      the new figure (ratchet); before → after words, bytes and tokens recorded.
- [ ] qa-check PASS (system verify on the VPS); owner reads the result before close.

## Touches
`.claude/CLAUDE.md` · `docs/LEARNINGS.md` · `scripts/lib/token-budget.txt` · `docs/research/logs/token-calibration.md`

## Assumes
- No fixed word target; done is "rule plus pointer" plus the measured ratchet (owner ruling).
- The separate per-line character cap (scan item 10) is dropped: ADR-048's token budget already covers it.

## Tracker
anti-slop adoption scan 2026-10-25, item 9 (item 10 folded in).
