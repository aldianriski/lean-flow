---
id: TASK-411
title: "Fail a scope-change entry whose files are outside its task's Layers (L-229)"
priority: P2
size: M
risk: med
autonomy: HITL
class: execution
tier: G
authority: J1
origin: decomposer
state: ready
depends-on: []
---

# TASK-411 — Fail a scope-change entry whose files are outside its task's Layers (L-229)

## Why

L-229 was promoted into `CONTEXT.md` at SPRINT-117 and recurred three times at SPRINT-118. Each time, a scope-change entry in the
Execution Log widened a task's files, the Plan's `Layers:` was not edited, and the gate only found it later. A prose rule is not reaching
the act, so the owner ruled `automate-into-check` (SPRINT-120 promote).

## Done when

- [ ] A scope-change entry that names a repo path outside the `Layers:` of the task it names FAILs with a named finding, until `Layers:`
      covers the path.
- [ ] A retained must-FAIL fixture is built from SPRINT-118 T1's real scope-change entry (the work moved to the TypeScript checkers while
      `Layers:` still named the shell oracles), and a sibling control whose `Layers:` was edited PASSes.
- [ ] One run over the real archived SPRINT-115, 116 and 118 logs reports each recorded sighting, and its output is kept in the Execution Log.

## Touches

- the gate checker G2 assigns (layers-completeness or by-reference) · `evals/` (its fixtures and harness)

## Assumes

- G2 rules where the check lives, and how it tells apart a path that is only cited, not widened (e.g. "the frozen oracle, not edited").
- A maintainer-only gate leg, so Other G: a must-FAIL fixture plus one run on the real artifact, and no mutation campaign.

## Tracker

- L-229 · `.claude/CONTEXT.md` § Sprint model · SPRINT-118 Execution Log
