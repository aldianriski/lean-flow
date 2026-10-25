---
id: TASK-512
title: "Promote L-234, so a scope-change entry declares what it names"
priority: P2
size: S
risk: low
autonomy: HITL
class: execution
tier: P
authority: J1
origin: decomposer
state: ready
sprint: SPRINT-142
depends-on: []
---

# TASK-512 — Promote L-234, so a scope-change entry declares what it names

## Why
L-234 reached count 2: a scope-change entry naming an undeclared path reddened system verify at SPRINT-125 and again at
SPRINT-141, and both times only the full gate caught it. The leg that catches it already runs in `merge-check.ts`;
nothing says to run it right after a scope-change is written.

## Done when
- [x] LEARNINGS § Durable rules › edit-safety states the rule: a scope-change heading names every `Tn` whose paths its ✓ 9a69a6ec: new ❌ paragraph after the four traps; Codex R1 CLEAR
      body names, and after appending one the scope-change leg (or `merge-check.ts`) is run and its verdict read before
      committing.
- [x] The shipped `sprint-log.md.template`'s scope-change guidance gains one generic line: the heading names every `Tn` it ✓ 9a69a6ec: one `>` line, no `scripts/` path (grep 0); 3 sprint-log harnesses green
      changes, and every path the entry names belongs to one of them. No lean-flow path.
- [x] L-234 is `[status: promoted]` with a pointer line and a `disposition:`. ✓ 9a69a6ec: move-to-reference
- [x] The CHANGELOG `[Unreleased]` block has a line (the template is consumer-facing). ✓ 9a69a6ec

## Touches
`docs/LEARNINGS.md` · `skills/lean-doc-generator/templates/sprint-log.md.template` · `CHANGELOG.md`

## Assumes
- The template line is generic and adds no template, so the template counts hold at 34 + 2.
- Out of scope: any new check or wiring; the leg already exists in `merge-check.ts`.

## Tracker
L-234 (count 2: SPRINT-125, SPRINT-141) · owner intake ruling 2026-10-25: LEARNINGS edit-safety plus a template line.
