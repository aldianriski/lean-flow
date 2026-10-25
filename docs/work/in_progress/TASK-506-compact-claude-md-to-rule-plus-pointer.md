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
sprint: SPRINT-140
---

# TASK-506 — Compact CLAUDE.md to rule plus pointer and ratchet the always-loaded token budget down

## Why
Measured cost: `.claude/CLAUDE.md` is 80 lines but 2,432 words / 15.7 KB, longest line 3,678 chars, loaded every session.
Many bullets carry their incident history inline, which anti-slop names "value is not length". The token budget
(ADR-048, `token-budget.txt` 16,087 for the pair) already catches long lines; this task spends the headroom.

## Done when
- [x] Every CLAUDE.md bullet is a rule plus its `L-NNN` / ADR pointer; no incident narrative remains. ✓ `897047fb`: every section swept; each bullet is the rule plus its L-NNN / ADR / § pointer; scoped reviewer: no lost instruction, no lost signal
- [x] Before any story is cut, its cited L-NNN entry is checked to hold it; a story with no home is moved into that entry ✓ `897047fb`: each cut story checked against its cited entry; six with no home moved verbatim to § Durable rules (each original line matches once, grep -cFx)
      first, so no signal is lost.
- [x] Before any block is removed, its readers are searched for (L-117); every count claim `check-count-claims.sh` ✓ `897047fb`: readers searched (check-count-claims · prose-density · conformance-engine/qa-check header); count claims 3/3 PASS on CLAUDE.md
      verifies in CLAUDE.md still checks out.
- [x] ≤ 80 lines; the pair is re-measured with the calibrated method and `scripts/lib/token-budget.txt` is lowered to ✓ `897047fb`: 79 lines; pair ~14,114 → ~12,691 tokens; token-budget.txt 16,087 → 12,691 (ratio 2.991, R2), check PASS at the new budget; calibration-log Round 2; CLAUDE.md 2,432 → 1,715 words, 15,700 → 11,445 bytes
      the new figure (ratchet); before → after words, bytes and tokens recorded.
- [ ] qa-check PASS (system verify on the VPS); owner reads the result before close.

## Touches
`.claude/CLAUDE.md` · `docs/LEARNINGS.md` · `scripts/lib/token-budget.txt` · `docs/research/logs/token-calibration.md`

## Assumes
- No fixed word target; done is "rule plus pointer" plus the measured ratchet (owner ruling).
- The separate per-line character cap (scan item 10) is dropped: ADR-048's token budget already covers it.

## Tracker
anti-slop adoption scan 2026-10-25, item 9 (item 10 folded in).
