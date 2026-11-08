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

- [ ] The three CONTEXT.md passages (`overnight` canonical name · Continuation contract · Authority) become pointers naming the satellite section holding each fact (`orchestrator/SKILL.md`, `night-run.md` Part 0b, `night-run.md` J0/J1/J2); any fact the satellite lacks stays as a line.
- [ ] `bun scripts/lib/check-doc-caps.ts`, run as its own call, prints `token-budget ~N tokens <= budget 12691` with N ≤ 12440; `git diff` on `scripts/lib/token-budget.txt` is empty.
- [ ] CONTEXT.md § Gates is unchanged (no diff hunk between `## Gates` and `## Modes`), keeping TASK-621's trial basis stable.
- [ ] CONTEXT.md still names the five terminal-state names and "absent = J2"; `last_updated` bumped.
- [ ] Negative: no fact is lost — each removed passage's distinctive phrase greps to the satellite section its pointer cites; one with no hit is restored and counted as a miss.
- [ ] QA_FULL (off-host) and `bun test` stay green.

## Touches

.claude/CONTEXT.md only (blast radius: always-loaded context every session reads)

## Assumes

- The three pointers stay faithful; if they don't reach 250 tokens of headroom, a further dedup candidate outside § Gates goes back to the owner, never added silently.

## Tracker

TD-302 · TD-006 · L-008 · SPRINT-166 Log T2 entry
