---
id: TASK-477
title: "One name per helper in the sprint-family harness"
sprint: SPRINT-136
priority: P3
size: S
risk: low
autonomy: HITL
class: execution
tier: X
authority: J1
origin: decomposer
state: ready
depends-on: []
---

# TASK-477 — One name per helper in the sprint-family harness

## Why

Defect fix (ADR-053 §3, unfrozen). TD-172 (medium): the sprint-family fixture harness defines `learn_entry()` twice with
different signatures, so the later definition silently replaces the earlier one for every call after it. Behaviour-preserving
rename, tier X.

## Done when

- [ ] One of the two helpers is renamed at its definition and every one of its call sites, so each name has one definition.
- [ ] The harness's case list and verdicts are unchanged (runner output diffed before and after).
- [ ] TD-172 marked resolved in `TECH-DEBT.md`.

## Touches

the sprint-family fixture harness · `TECH-DEBT.md`

## Assumes

- No other file sources the harness and calls either helper by name.

## Tracker

- TD-172 · intake draft reviewed by Codex 2026-10-21
