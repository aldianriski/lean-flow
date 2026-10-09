---
id: TASK-410
title: "Widen section 11's live-named rule so a prose-cited closed task is kept (TD-206)"
priority: P2
size: M
risk: high
autonomy: HITL
class: decision
tier: G
authority: J2
origin: decomposer
state: ready
depends-on: []
---

# TASK-410 — Widen section 11's live-named rule so a prose-cited closed task is kept (TD-206)

## Why

STANDARD §11 deletes a closed task file once nothing live names it, and defines "live" as an open task's `depends-on:` or an active
sprint's `## Members`. The engine implements exactly that, then reports "nothing live names it" for files that open tasks, `CONTEXT.md`
and skill references still cite in prose: 6 of the 42 retention-due files at the SPRINT-120 promote. The owner ruled to widen the rule
in the spec and the engine together, rather than only rewording the message (SPRINT-120 decompose).

**Consequential Tier G** (ADR-050) plus a spec change, so J2: the owner signs the new definition.

## Done when

- [ ] §11's store row defines the live-citation set: open task files, active sprint and epic files, and the non-archived docs G2 pins.
      The row is consistent with `S11.RESEARCH`'s "nothing live cites it", and the spec version is bumped in `spec/CHANGELOG.md`.
- [ ] A retained fixture with a closed task cited only in an open task's body is not flagged, while the pre-change engine flags it. A
      sibling control cited only under `docs/sprint/archive/` is still flagged.
- [ ] On this repo, `sh conformance.sh .` flags none of TASK-357 · 360 · 368 · 374 · 386 · 392, and TD-206 is resolved to this task.

## Touches

- `spec/STANDARD.md` · `spec/CHANGELOG.md` · `scripts/lib/conformance-engine.sh` · `evals/` (engine fixtures)

## Assumes

- G2 pins the exact "non-archived doc" population and the citation match (the id as a whole word, never a substring).
- Overlaps TASK-409 and TASK-404 on the engine file, so they are sequenced, never built in parallel.

## Tracker

- TD-206 · STANDARD §11 · ADR-050 · ADR-034
