---
id: TASK-623
title: "Win back always-loaded token budget by replacing CONTEXT.md text its satellites already hold with pointers (TD-302)"
type: debt
priority: P2
size: S
risk: med
autonomy: HITL
class: execution
tier: P
authority: J1
origin: decomposer
state: ready
depends-on: []
sprint: SPRINT-167
---

# TASK-623 — Win back always-loaded token budget by replacing CONTEXT.md text its satellites already hold with pointers (TD-302)

## Why
TD-302. The always-loaded token budget has 3 tokens of headroom (~12688 of 12691), so the next roster or rule line fails doc-caps unless it trims as much. Raising the budget is out by owner constraint. G2 review-round cap: 2.

## Done when

- [x] The three CONTEXT.md passages (`overnight` canonical name · Continuation contract · Authority) become pointers naming the satellite section holding each fact (`orchestrator/SKILL.md`, `night-run.md` Part 0b, `night-run.md` J0/J1/J2); any fact the satellite lacks stays as a line. ✓ `d463550f`: pointers to `orchestrator/SKILL.md` § Mode dispatch, `night-run.md` Part 0 and Part 0b; `night-run.md` has no J0/J1/J2 heading, so the Authority pointer cites Part 0, which holds that table (settled at G2, builder-check · T2); the state names, "absent = J2" and the `.out-of-scope` sentence stay
- [x] `bun scripts/lib/check-doc-caps.ts`, run as its own call, prints `token-budget ~N tokens <= budget 12691` with N ≤ 12440; `git diff` on `scripts/lib/token-budget.txt` is empty. ✓ `token-budget ~12416 tokens <= budget 12691`, rerun on merged `main`; `scripts/lib/token-budget.txt` diff empty
- [x] CONTEXT.md § Gates is unchanged (no diff hunk between `## Gates` and `## Modes`), keeping TASK-621's trial basis stable. ✓ hunks at lines 3, 84, 86 and 148 only; § Gates is lines 51-75
- [x] CONTEXT.md still names the five terminal-state names and "absent = J2"; `last_updated` bumped. ✓ all five names on line 86; "absent = J2" on line 148; `last_updated: 2026-11-08`
- [x] Negative: no fact is lost — each removed passage's distinctive phrase greps to the satellite section its pointer cites; one with no hit is restored and counted as a miss. ✓ builder fact-to-hit table and the scoped review both found every removed fact at the cited satellite; nothing restored, 0 misses
- [x] QA_FULL (off-host) and `bun test` stay green. ✓ QA_FULL off-host 482 pass, 0 fail at `aac43990`; `bun test` 589 pass, 0 fail

## Touches

.claude/CONTEXT.md only (blast radius: always-loaded context every session reads)

## Assumes

- The three pointers stay faithful; if they don't reach 250 tokens of headroom, a further dedup candidate outside § Gates goes back to the owner, never added silently.

## Tracker

TD-302 · TD-006 · L-008 · SPRINT-166 Log T2 entry
