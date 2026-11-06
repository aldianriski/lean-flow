---
id: TASK-608
title: "Make an interactive migrate raise its plan approval and rulings as a popup"
type: feature
priority: P2
size: S
risk: low
autonomy: HITL
class: execution
tier: P
authority: J2
origin: close-retro
state: ready
depends-on: []
gates_signed: G1 @ 07e2c1b6
---

# TASK-608 — Make an interactive migrate raise its plan approval and rulings as a popup

## Why
On SPRINT-163's interactive migrate, the plan listed its rulings as prose and the run stopped, until the owner typed "ask for clarify so
process not stop". `skills/lean-doc-generator/references/migration-map.md` says "an interactive session waits in prose and that is
correct", which conflicts with the popup rule in `.claude/CLAUDE.md` § Behavioral Guidelines. The run followed the skill.

## Done when
- [x] An interactive migrate shows its plan as text and raises the approval and each ruling as a popup, recommending an answer. ✓ owner's interactive run on copy s163-std-b, pin ced08844: the plan as text, then the first popup 10 seconds later, each option carrying a recommendation; the owner reported done
- [x] Negative: a headless migrate still records the plan and its unblock condition in a `/handoff` doc and halts, never asking or deciding. ✓ headless run, same pin, 0.31 USD: plan saved to a handoff doc, nothing written to the repo; Codex T2 OK
- [x] Shown once on a consumer repo copy through a pinned clone. ✓ see box 1
- [x] CHANGELOG `[Unreleased]` names the change. ✓ ced08844

## Touches
`skills/lean-doc-generator/references/migration-map.md` · `CHANGELOG.md`

## Assumes
- The "waits in prose" sentence came with TD-017's headless rule, and nothing else depends on it; check at G2.
- A long plan stays in the message above the popup, since a popup carries only the question.

## Tracker
SPRINT-163 close Retro · SPRINT-163 log, 2026-11-06
