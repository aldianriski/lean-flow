---
id: TASK-439
title: "Record a G1/G2 sign-off on the task file itself, so work without a sprint keeps its approval where the next reader finds it"
epic: EPIC-022
priority: P1
size: M
risk: low
autonomy: HITL
class: execution
tier: P
authority: J1
origin: decomposer
state: ready
depends-on: []
---

# TASK-439 — Record a G1/G2 sign-off on the task file itself

## Why

G2 says "draft the design in `/plan`", but the approval lands nowhere a later reader can find it: the plan-mode approval
decision is not in any documented payload, and only a sprint has a `gates_signed:` field. workdoo runs one-off tasks with no
sprint and records its gates as dated prose under `## Assumes` (consumer evidence, ADR-053; L-099 · L-151).

## Done when

- [ ] A task file may carry `gates_signed: <GATE>[,…] @ <sha | YYYY-MM-DD>` in its frontmatter — absent means NOT signed, never
      approval — and the task template, the store schema and the task-file reference all state it.
- [ ] `/orchestrator` `quick` and `mvp` write that field the moment the owner approves G1 (and G2), whether by a plan-mode exit or
      a popup, and record the approved design's one-paragraph summary in the task file; a sprint keeps its existing sprint-level
      field.
- [ ] The README / orchestrator docs say an adopter MAY set Claude Code's `plansDirectory` to a repo folder so plan mode's own file
      is kept, and the record then cites that file; lean-flow never edits a settings file.
- [ ] Exercised on a scratch repo: an `mvp` task approved by popup ends with `gates_signed: G1,G2 @ <date>` and its design summary,
      and a task never approved has no field.

## Touches

- skills/orchestrator/SKILL.md · skills/lean-doc-generator/templates/TASK.md.template · skills/task-decomposer/references/task-file.md
  · docs/work/README.md · README.md

## Assumes

- A3: an optional task-frontmatter field does not trip a store-schema check (verify at G2 against the engine and the v1→v2 harness).
- In a repo with git the value is `@ <sha>` of the commit holding the signed task; without git it is `@ <YYYY-MM-DD>` (A2).

## Tracker

- EPIC-022 Closed-when 5 · consumer evidence: workdoo TASK-001 · TASK-010 · TASK-044 `## Assumes` gate prose
