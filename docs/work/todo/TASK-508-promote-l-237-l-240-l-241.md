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
---

# TASK-508 — Promote L-237, L-240 and L-241 into durable rules where their flows read them

## Why
All three reached count 2 with `promoted: no` at the SPRINT-140 promote governance review. The owner ruled they land as one
task, this sprint's T1 (same pattern as TASK-497 at SPRINT-139).

## Done when
- [ ] L-237: the orchestrator's G2 procedure says the signed design quotes each frozen Done-when it relies on, and never
      paraphrases one; placed by §10's placement test where every G2 run reads it.
- [ ] L-240: the same G2 procedure says that when G2 rules between `Layers:` candidates declared in advance, the same G2
      entry logs the scope-change that drops the losing tokens.
- [ ] L-241: the consumer-path rule says a "without the plugin" proof runs as a separate headless process and is judged
      from that run's own init event, never from a sub-agent (candidate home: `docs/LEARNINGS.md` § Durable rules ›
      consumer-side).
- [ ] Each of the three entries ends as `[status: promoted]` with a pointer line naming its home and a stated
      `disposition:`.
- [ ] Shipped-skill edits: Codex review → fix → re-review until clean; SKILL.md caps hold; CHANGELOG line.

## Touches
`skills/orchestrator/references/builder-check.md` (the G2 gate's reader procedure) · `docs/LEARNINGS.md` · `CHANGELOG.md`

## Assumes
- The orchestrator SKILL.md is at 140/140, so the G2 rules go into a reference, not the SKILL.md body.

## Tracker
SPRINT-140 promote governance review (L-promotion line).
