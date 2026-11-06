---
id: TASK-611
title: "Make /task-decomposer hold a draft with no scenario for a fresh approve, and show it"
type: debt
priority: P2
size: S
risk: med
autonomy: HITL
class: execution
tier: P
authority: J2
origin: decomposer
state: ready
depends-on: []
---

# TASK-611 — Make /task-decomposer hold a draft with no scenario for a fresh approve, and show it

## Why
TD-294: `/task-decomposer` refusing a draft with no scenario has never run; TASK-606 ticked it on reading the skill. Owner ruling
(2026-11-06 intake): such a draft plus `approve` writes nothing, shows a drafted box and waits for a fresh approve, because the earlier
approve never covered that box. ADR-053: a defect fix in shipped skill text, unfrozen.

## Done when
- [ ] A consumer-copy run given a feature draft with no scenario and an `approve` writes no task file, shows a drafted `Negative:` box, and asks for a fresh approve.
- [ ] After that approve, the written file carries exactly the box shown.
- [ ] Negative: a feature draft that already names a scenario is written on its first approve with no added ask, and a docs draft with nothing to guard gets `Negative: n/a: <reason>` and is not held for a scenario.
- [ ] The rule reads the same in `skills/task-decomposer/SKILL.md` and `skills/task-decomposer/references/task-file.md` (L-290), and SKILL.md stays within its cap (136 lines today, ~140).
- [ ] TD-294 records the runs, pins and result for this branch; CHANGELOG `[Unreleased]` and README name any user-visible change.

## Touches
`skills/task-decomposer/SKILL.md` · `skills/task-decomposer/references/task-file.md` · `README.md` · `CHANGELOG.md` · `TECH-DEBT.md`

## Assumes
- Runs use fresh copies of `D:\Research\workdoo` under `D:\Research\`, through a pinned clone (`--plugin-dir`), with a snapshot and revert; prompts never name the rule. Each runs once on a pin of today's main, recorded as the before, then again on the pin holding any fix.
- Today's skill says the task "needs" a box and that a task with no acceptance criterion "fails validation", and says nothing about an approve that came before the box. The before-run is expected to write the box unasked; the owner ruling makes that the defect.
- Out of scope: an owner who insists on no scenario for a feature; no one has asked for that override.
- Fixes land in shipped skill text only, under `[Unreleased]`, no release. A defect that needs a new guard, checker or gate leg is filed as a TD with its ADR-053 reason, not built here. Shipped skill changes take the Codex review at execution.

## Tracker
TD-294 · TASK-606 box 1 · owner rulings 2026-11-06 (intake popup) · Codex intake review CLEAR in 1 round
