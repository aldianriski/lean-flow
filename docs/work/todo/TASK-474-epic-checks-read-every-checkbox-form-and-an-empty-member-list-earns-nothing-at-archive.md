---
id: TASK-474
title: "Epic checks read every checkbox form, and an empty member list earns nothing at archive"
priority: P2
size: S
risk: med
autonomy: HITL
class: execution
tier: G
authority: J1
origin: decomposer
state: ready
depends-on: []
---

# TASK-474 — Epic checks read every checkbox form, and an empty member list earns nothing at archive

## Why

Defect fix (ADR-053 §3, unfrozen). TD-130 (medium): the epic-archive checker's `## Closed when` readers match only
`- [ ]` / `- [x]` at column 0, so an `[X]` box or an indented box is silently uncounted, and the attribution reader has the same
lowercase, column-0 anchor. TD-148 item 1 (medium): an epic whose `member_sprints:` is empty still earns "every member sprint
closed" on the archive branch. Other G: the checker's only caller is maintainer QA (Codex review at intake, 2026-10-21).
G2 review-round cap: 2.

## Done when

- [ ] The total, open-conditions and attribution readers all treat `[X]` as closed and count indented boxes. A retained
      fixture pairing a recognised closed box with an indented open box FAILs today's checker and passes the fixed one.
- [ ] On the archive branch only, an empty `member_sprints:` (an empty list, a missing key, or an empty block sequence) no longer
      earns "every member sprint closed"; it is named. The 8 live epic files carrying `[]` keep their current verdicts, and the
      gate's epic-archive leg over the repository stays green (run once, verdicts quoted).
- [ ] The regression cases live in the TypeScript test suite, not as new fixture directories, so the frozen Shell/TypeScript
      differential population does not grow.
- [ ] TD-130 marked resolved and TD-148 narrowed to its remaining items in `TECH-DEBT.md`.

## Touches

the epic-archive checker and its TypeScript tests · `TECH-DEBT.md`

## Assumes

- An indented-only fixture is not a valid negative case: it already fails "no conditions", which proves the wrong behaviour
  (Codex review at intake).

## Tracker

- TD-130 · TD-148 item 1 · intake draft reviewed by Codex 2026-10-21 (APPROVE WITH FIXES, folded in)
