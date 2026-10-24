---
id: TASK-495
title: "Wire /humanizer into commit messages and PR bodies written by lean-flow skills"
priority: P2
size: M
risk: med
autonomy: HITL
class: execution
tier: P
authority: J1
origin: decomposer
state: ready
depends-on: [TASK-494]
---

# TASK-495 — Wire /humanizer into commit messages and PR bodies written by lean-flow skills

## Why
Commit text is lean-flow's most frequent writing job (orchestrator dispatch, lean-doc-generator close, release-patch) and the
most cost-sensitive one, since night runs produce many commits.

## Done when
- [ ] A census of every procedure that composes a commit message or PR body, derived by two different selectors that agree
      (a wording grep, and a read of each skill's commit/PR step), is listed in this task.
- [ ] Commit messages go through embedded mode as **plain text** (no italics, no Markdown; prefixes like `sprint(138):`
      preserved). PR bodies go through as **rendered Markdown** (the italics rule applies).
- [ ] Every-invocation steps stay in each SKILL.md with read pointers; orchestrator detail goes in `references/dispatch.md`
      (`orchestrator/SKILL.md` is at the cap).
- [ ] Fires end-to-end: one real orchestrator commit, one lean-doc-generator close commit, and one PR body show the pass.
- [ ] CHANGELOG line; Codex gauntlet review clean.

## Touches
`skills/orchestrator/SKILL.md` + `references/dispatch.md` · lean-doc-generator close step + its references ·
`skills/release-patch/SKILL.md` · CHANGELOG

## Assumes
- `orchestrator/SKILL.md` is at 140 lines today (measured 2026-10-24).

## Tracker
Owner intake 2026-10-24.
