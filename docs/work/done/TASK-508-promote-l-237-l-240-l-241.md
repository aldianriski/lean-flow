---
id: TASK-508
title: "Promote L-237, L-240 and L-241 into durable rules where their flows read them"
priority: P2
size: S
risk: low
autonomy: HITL
class: execution
tier: P
authority: J1
origin: manual
state: ready
depends-on: []
sprint: SPRINT-140
---

# TASK-508 — Promote L-237, L-240 and L-241 into durable rules where their flows read them

## Why
All three reached count 2 with `promoted: no` at the SPRINT-140 promote governance review. The owner ruled they land as one
task, this sprint's T1 (same pattern as TASK-497 at SPRINT-139).

## Done when
- [x] L-237: the orchestrator's G2 procedure says the signed design quotes each frozen Done-when it relies on, and never ✓ `df1c7b68`: builder-check.md § Two rules for the design itself, loaded at every G2 via SKILL.md's "Builder check before sign-off" line; binds the author whether or not a reader runs; Codex item 2 CLEAR
      paraphrases one; placed by §10's placement test where every G2 run reads it.
- [x] L-240: the same G2 procedure says that when G2 rules between `Layers:` candidates declared in advance, the same G2 ✓ `df1c7b68`: the second rule of the same section; Codex item 3 CLEAR
      entry logs the scope-change that drops the losing tokens.
- [x] L-241: the consumer-path rule says a "without the plugin" proof runs as a separate headless process and is judged ✓ `df1c7b68`: new paragraph under LEARNINGS § Durable rules › consumer-side (headless `claude -p --setting-sources local …`, judged from its own `system/init`)
      from that run's own init event, never from a sub-agent (candidate home: `docs/LEARNINGS.md` § Durable rules ›
      consumer-side).
- [x] Each of the three entries ends as `[status: promoted]` with a pointer line naming its home and a stated ✓ `df1c7b68`: three headers `[status: promoted]`; three L-247-shaped pointer lines with `disposition: move-to-reference`; `promoted: no` 15 → 12
      `disposition:`.
- [x] Shipped-skill edits: Codex review → fix → re-review until clean; SKILL.md caps hold; CHANGELOG line. ✓ Codex round 1 VERDICT: CLEAR (5/5 items); check-doc-caps exit 0, 0 FAIL; prose-density 28/0; CHANGELOG `## [Unreleased]` opened in `df1c7b68`

## Touches
`skills/orchestrator/references/builder-check.md` (the G2 gate's reader procedure) · `docs/LEARNINGS.md` · `CHANGELOG.md`

## Assumes
- The orchestrator SKILL.md is at 140/140, so the G2 rules go into a reference, not the SKILL.md body.

## Tracker
SPRINT-140 promote governance review (L-promotion line).
