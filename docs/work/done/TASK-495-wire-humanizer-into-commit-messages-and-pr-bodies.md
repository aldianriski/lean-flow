---
id: TASK-495
title: "Wire /humanizer into commit messages and PR bodies written by lean-flow skills"
sprint: SPRINT-139
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
- [x] A census of every procedure that composes a commit message or PR body, derived by two different selectors that agree ✓ § Census: six sites, two selectors read in context; exclusions named (release-patch has no commit)
      (a wording grep, and a read of each skill's commit/PR step), is listed in this task.
- [x] Commit messages go through embedded mode as **plain text** (no italics, no Markdown; prefixes like `sprint(138):` ✓ all six sites -> embedded.md § Commit messages and PR bodies: plain commits, markdown PR bodies, prefixes/trailers verbatim, R6 whole-message skip (ee195b80, 81286c6f)
      preserved). PR bodies go through as **rendered Markdown** (the italics rule applies).
- [x] Every-invocation steps stay in each SKILL.md with read pointers; orchestrator detail goes in `skills/orchestrator/references/dispatch.md` ✓ orchestrator SKILL.md 140/140 (appended clause) + references/dispatch.md § Commit messages; shared rules once in embedded.md
      (`skills/orchestrator/SKILL.md` is at the cap).
- [x] Fires end-to-end: one real orchestrator commit, one lean-doc-generator close commit, and one PR body show the pass. ✓ E1 commit 4c54c2ec + E2 PR body + E3 the SPRINT-139 close commit message, each through a sub-agent pass (both catalogs whole)
- [x] CHANGELOG line; Codex gauntlet review clean. ✓ CHANGELOG [Unreleased] bullet (ee195b80); Codex CLEAR at round 2 (box 4 pending E3)

## Census (commit and PR-message composers; two selectors, every hit read in context)

| Site | Composes | Format |
|---|---|---|
| `skills/orchestrator/SKILL.md` | quick step 5, mvp step 7, sprint-bulk loop: `type(scope): summary` | plain |
| `skills/orchestrator/references/dispatch.md` | builders' commits | plain |
| `skills/lean-doc-generator/SKILL.md` | promote `plan locked`, close squash (`sprint-by-reference.md` repeats them) | plain |
| `skills/diagnose/SKILL.md` | the winning hypothesis in the commit / PR message (the only PR-body site) | plain (commit) · markdown (PR body) |
| `skills/prototype/SKILL.md` | the spent prototype's throwaway-branch commit | plain |
| `skills/triage/SKILL.md` | status-move commits | plain (fixed templates skip, R6) |

Selector A: a wording grep (commit message · git commit · squash-commit · type(scope) · PR body · pull request · gh pr).
Selector B: step-shaped commit instructions. Read in context, they agree on these six. Not composers: release-patch (stops and
hands back a ready-to-push message), init.md, fog-map.md, handoff-reconciliation.md, the CONTRIBUTING template, dispatch.md's
merge-conflict guidance (reads messages). R6: a fixed-template message with no free prose skips the pass.

## Touches
`skills/orchestrator/SKILL.md` + `references/dispatch.md` · lean-doc-generator close step + its references ·
`skills/release-patch/SKILL.md` · CHANGELOG

## Assumes
- `orchestrator/SKILL.md` is at 140 lines today (measured 2026-10-24).

## Tracker
Owner intake 2026-10-24.
