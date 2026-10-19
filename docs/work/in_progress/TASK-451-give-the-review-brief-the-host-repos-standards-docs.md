---
id: TASK-451
title: "Give the review brief the host repo's standards docs as the Standards comparand"
priority: P2
size: S
risk: low
autonomy: HITL
class: execution
tier: P
authority: J1
origin: decomposer
state: ready
depends-on: []
sprint: SPRINT-129
---

# TASK-451 — Give the review brief the host repo's standards docs as the Standards comparand

## Why

The Standards axis says documented repo standards "override the baseline", but nothing supplies them.
Reviewers get a brief, not the repo, so a standard kept in CONTRIBUTING or a style guide is never
seen. Our own repo puts its standards in CLAUDE.md, but adopters keep them elsewhere (L-015).

## Done when

- [ ] The step that builds the review brief finds the host repo's standards docs (CONTRIBUTING, coding standards, style guides, and CLAUDE.md/AGENTS.md) and puts them in the brief as the Standards comparand. When there are none, the brief says so.
- [ ] The Standards axis of the reviewer's report names the standards docs it judged against.
- [ ] Generic: works in a repo that has never installed lean-flow, with no lean-flow-specific path or file name required.
- [ ] Exercised once on a real review brief (L-007). README/CHANGELOG reflect the change.

## Touches

skills/orchestrator/references/review-scoping.md (brief list · Standards axis) · CHANGELOG

## Assumes

- the bounded-brief rule stands: the coordinator supplies the standards; the reviewer does not search the repo (owner ruling at intake, 2026-10-19).
- the brief lives in `references/`, so no SKILL.md line cap is affected (ADR-006).

## Tracker

- `docs/research/mattpocock-scan5.md` K2 (upstream `code-review` at `3da8c011`) · replaces TASK-448 (part)
