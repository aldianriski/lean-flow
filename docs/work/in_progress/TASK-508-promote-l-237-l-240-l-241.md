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
- [x] L-237: the orchestrator's G2 procedure says the signed design quotes each frozen Done-when it relies on, and never
      paraphrases one; placed by §10's placement test where every G2 run reads it. ✓ `df1c7b68`: builder-check.md § Two rules for the design itself, loaded at every G2 via the SKILL.md "Builder check before sign-off" line; binds the author whether or not a reader runs; Codex item 2 CLEAR
- [x] L-240: the same G2 procedure says that when G2 rules between `Layers:` candidates declared in advance, the same G2
      entry logs the scope-change that drops the losing tokens. ✓ `df1c7b68`: the second rule of the same section; Codex item 3 CLEAR
- [x] L-241: the consumer-path rule says a "without the plugin" proof runs as a separate headless process and is judged
      from that run's own init event, never from a sub-agent (candidate home: `docs/LEARNINGS.md` § Durable rules ›
      consumer-side). ✓ `df1c7b68`: new paragraph under LEARNINGS § Durable rules › consumer-side (headless `claude -p --setting-sources local …`, judged from its own `system/init`)
- [x] Each of the three entries ends as `[status: promoted]` with a pointer line naming its home and a stated
      `disposition:`. ✓ `df1c7b68`: three headers `[status: promoted]`; three `- **L-NNN → promoted: …** · disposition: move-to-reference` pointer lines; `promoted: no` 15 → 12
- [x] Shipped-skill edits: Codex review → fix → re-review until clean; SKILL.md caps hold; CHANGELOG line. ✓ Codex round 1 VERDICT: CLEAR (5/5 items); `check-doc-caps.ts` exit 0, 0 FAIL; prose-density 28/0; CHANGELOG `## [Unreleased]` opened in `df1c7b68`

## Touches
`skills/orchestrator/references/builder-check.md` (the G2 gate's reader procedure) · `docs/LEARNINGS.md` · `CHANGELOG.md`

## Assumes
- The orchestrator SKILL.md is at 140/140, so the G2 rules go into a reference, not the SKILL.md body.

## Tracker
SPRINT-140 promote governance review (L-promotion line).
