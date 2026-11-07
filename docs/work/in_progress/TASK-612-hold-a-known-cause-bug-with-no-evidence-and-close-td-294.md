---
id: TASK-612
title: "Make /triage hold a known-cause bug whose evidence names no regression, and close TD-294"
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
sprint: SPRINT-164
depends-on: [TASK-610, TASK-611]
---

# TASK-612 — Make /triage hold a known-cause bug whose evidence names no regression, and close TD-294

## Why
TD-294: `/triage` holding back a known-cause bug with no `Negative:` box has never run, because each run's agent wrote one. If any
agent-written box counts, the branch cannot fire. Owner ruling (2026-11-06 intake): an agent-written box moves a bug to `ready` only
when drawn from evidence it cites, report or code; otherwise `needs-info`, and an invented box is the defect. ADR-053: a defect fix in
shipped skill text, unfrozen.

## Done when
- [ ] A consumer-copy run on a known-cause bug report whose evidence names nothing that must keep working leaves the bug `needs-info` with the missing scenario as an `- **open:**` line, and writes no invented `Negative:` box.
- [ ] A known-cause bug whose report or code does name it reaches `ready` with a box citing that evidence.
- [ ] Negative: a bug already `ready` with no box is not demoted, and an unknown-cause bug still gets `- **next:** /diagnose`.
- [ ] Triage steps 3 and 6 and `skills/lean-doc-generator/templates/BUG.md.template` carry the same condition (L-290), and SKILL.md stays within its cap (132 lines today, ~140).
- [ ] TD-294 records this branch's runs and result and moves to `resolved`, citing all three tasks, or stays open naming the branch still unrun; CHANGELOG `[Unreleased]` and README name any user-visible change.

## Touches
`skills/triage/SKILL.md` · `skills/lean-doc-generator/templates/BUG.md.template` · `README.md` · `CHANGELOG.md` · `TECH-DEBT.md`

## Assumes
- Runs use fresh copies of `D:\Research\workdoo` under `D:\Research\`, through a pinned clone (`--plugin-dir`), with a snapshot and revert; prompts never name the rule. Each runs once on a pin of today's main, recorded as the before, then again on the pin holding any fix.
- SPRINT-163's two runs each wrote a box. So the seed report must name the cause and leave the neighbouring behaviour unstated, on an area the copy's code cannot settle. If no such area exists on the copy, the run seeds the cause in a file outside the checkout; G2 picks.
- `depends-on` is for shared-file order and the TD-294 flip, not for logic.
- Fixes land in shipped skill text only, under `[Unreleased]`, no release. A defect that needs a new guard, checker or gate leg is filed as a TD with its ADR-053 reason, not built here. Shipped skill changes take the Codex review at execution.

## Tracker
TD-294 · TASK-606 box 2 · owner rulings 2026-11-06 (intake popup) · Codex intake review CLEAR in 1 round
