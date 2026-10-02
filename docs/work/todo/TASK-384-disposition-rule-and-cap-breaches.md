---
id: TASK-384
title: "Enforce a disposition per promoted rule and close the soft cap breaches"
epic: EPIC-017
sprint: SPRINT-112
priority: P1
size: M
risk: high
autonomy: HITL
class: decision
tier: G
authority: J2
origin: decomposer
state: ready
depends-on: [TASK-364, TASK-377]
---

# TASK-384 — Enforce a disposition per promoted rule and close the soft cap breaches

## Done when

- [x] Promotion requires a stated disposition: replace · merge · move to an on-demand reference · automate into a check · retain with justification. ✓ `14e5b49` — the promote governance step + LEARNINGS pointer format require `disposition: <kind>` (prose, owner ruling); SKILL.md 138 lines
- [x] At least one rule is demoted out of .claude/CLAUDE.md through that route, destination recorded (Closed-when 4). ✓ `14e5b49` — by owner ruling (L-088): 5 rules' detail moved verbatim to LEARNINGS § Durable rules (disposition: move-to-reference), each keeping an always-loaded one-liner with its actions
- [x] Every soft OVER-CAP row is closed by a recorded disposition, not a diet — the gate reports zero (Closed-when 3). ✓ `7eda91d` — `.cap-dispositions` records 4 `retain` rows with reasons and exits; both checkers print 0 OVER-CAP + 4 `retained:` (Shell/TS 26/26 identical)
- [x] `.claude/CLAUDE.md` § Anti-Patterns is slimmed to pointers (the L-NNN detail lives in LEARNINGS / CONTEXT), within its 80-line cap; each moved rule's destination is recorded through the disposition route. ✓ `81c58fe` — § Anti-Patterns as one-liners + pointers, actions kept (Codex 3 rounds CLEAR); 79 ≤ 80 lines; token budget ~16081 → ~13323 ≤ 16087

## Touches

spec/STANDARD.md · skills/lean-doc-generator/SKILL.md (promote governance) · .claude/CLAUDE.md

## Assumes

none

## Amended 2026-10-02 (SPRINT-112 promote)

- **Gains the CLAUDE.md slim** from `TASK-396`'s split (owner, 2026-10-02), so one task owns `.claude/CLAUDE.md`.

## Tracker

EPIC-017 D3 · Closed-when 3 · 4 · TD-174
