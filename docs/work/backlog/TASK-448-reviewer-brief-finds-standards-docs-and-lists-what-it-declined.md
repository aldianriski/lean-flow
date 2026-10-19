---
id: TASK-448
title: "Have the reviewer find the repo's standards docs, and list what it declined to judge"
priority: P2
size: S
risk: low
autonomy: AFK
class: execution
tier: P
authority: J1
origin: manual
state: ready
depends-on: []
---

# TASK-448 — Have the reviewer find the repo's standards docs, and list what it declined to judge

## Why

Two reference-scan keepers that land in the same file. `review-scoping.md` says documented repo
standards "override the baseline" but never tells the Standards pass to find them. Our own reviewer
gets CLAUDE.md; an adopter keeps standards in CONTRIBUTING or a style guide (L-015). Separately, what a
reviewer sets aside is dropped silently, and nothing says that spec silence is not permission.

## Done when

- [ ] The review brief in `skills/orchestrator/references/review-scoping.md` tells the Standards pass to search the host repo for files that document how code should be written (CONTRIBUTING, coding-standards, style guides, as well as CLAUDE.md/AGENTS.md) and to name the ones it read.
- [ ] The reviewer's output carries a **declined to judge** list (each item set aside, with why), and the Spec axis states that spec silence is not permission.
- [ ] Generic: no lean-flow-specific path or file name is required for it to work in a consumer repo. Exercised once on a real review brief (L-007).

## Touches

skills/orchestrator/references/review-scoping.md · CHANGELOG (consumer-visible)

## Assumes

- the brief lives in `references/`, so the SKILL.md line cap is not affected (ADR-006).

## Tracker

- `docs/research/mattpocock-scan5.md` K2 · `docs/research/brainstorming-adaptation.md` § Re-scan K3

## Amended 2026-10-19

Superseded by TASK-451 + TASK-452: the same keeper re-decomposed through `/task-decomposer`'s intake grill (`origin: decomposer`). This hand-filed version is cancelled at /triage (owner-approved).
