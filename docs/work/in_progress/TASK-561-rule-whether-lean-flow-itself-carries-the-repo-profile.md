---
id: TASK-561
title: "Rule whether lean-flow itself carries the repo profile, then run migrate here or record the exemption"
sprint: SPRINT-155
priority: P2
size: S
risk: low
autonomy: HITL
class: decision
tier: P
authority: J2
origin: close-retro
state: ready
depends-on: []
---

# TASK-561 — Rule whether lean-flow itself carries the repo profile, then run migrate here or record the exemption

## Why
SPRINT-153 T7 wired `/prime` to name `migrate` on a repo whose architecture overview has no `## Stack`. lean-flow has no
`## Stack`, no `docs/product/requirements.md` and no coding standards, so `/prime` here now names migrate every session.
Owner ruling at T7's G2: accept the nudge for now and decide in a later sprint (dogfood vs exempt).

## Done when
- [x] The owner rules: run `migrate` on lean-flow (profile written, inventory holds) or record lean-flow as exempt where ✓ owner ruled dogfood; the owner's migrate run wrote the profile (`d1d68b9c`: Stack, Conventions in use, cite-only requirements and acceptance criteria); inventory holds, no ADR, DECISIONS, epic or LEARNINGS file changed
  `/prime` and the conformance check read it.
- [x] After the ruling, `/prime` on lean-flow names migrate only if the ruling says it should. ✓ the checkout's `/prime` on lean-flow reports `overview.md (## Stack present → profiled)` and its Next line names no migrate

## Touches
`docs/architecture/overview.md` (if migrate runs) · or the exemption record

## Assumes

## Tracker
SPRINT-153 close Retro · T7 G2 ruling
