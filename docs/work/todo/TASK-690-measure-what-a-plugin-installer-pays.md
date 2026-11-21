---
id: TASK-690
title: "Measure what a plugin installer pays per session and per skill call, and trim over-long skill descriptions"
priority: P2
size: M
risk: low
autonomy: HITL
class: execution
tier: P
authority: J1
origin: decomposer
state: ready
sprint: SPRINT-184
depends-on: []
---
# TASK-690 — Measure what a plugin installer pays per session and per skill call, and trim over-long skill descriptions

## Why
The consumer's always-loaded cost is the 16 descriptions: 6,771 characters (~1.7k tokens). `council` is 939 against a median of ~385. Per-call cost is the SKILL.md body (3.8k to 25.4k characters). The census sets the targets for TASK-691, 692 and 693.

## Done when
- [ ] A census table at `docs/work/evidence/TASK-690/census.md`, at the gate's bytes-per-token ratio, lists per skill: description tokens, SKILL.md body tokens, reference tokens (bytes a typical call reads) and template tokens (bytes read by init); the Tracker names a trim target for each of the five named bodies.
- [ ] Each description over ~450 characters (`council` first) is shortened; a trigger inventory (every trigger phrase and "Do not use" routing clause) before and after is identical in meaning.
- [ ] Routing exercise for each trimmed description, via `claude -p --plugin-dir D:/Project/lean-flow` (transcript shows the repo base dir): one real-input prompt showing the trigger still routes to that skill, and one showing a "Do not use" case does not; spend is recorded against this task's 1.50 USD share in `docs/work/evidence/TASK-690/spend.md`.
- [ ] `qa-check` frontmatter, skill-freshness and manifest-lockstep stay green.
- [ ] Negative: no trigger phrase or "Do not use" routing clause is lost from a trimmed description, and no repo-specific path is added.

## Touches
The `description:` frontmatter of `skills/*/SKILL.md`; the evidence file. Not `.claude/CONTEXT.md` (TASK-685) and not README/CHANGELOG (TASK-693).

## Assumes
- Descriptions only; no body change.
- Run budget: this task's fixed share is 1.50 USD of the 15.00 USD total; a run over the share is refused and the owner asked; unspent share is not borrowed without the owner.
- The body target starts at 15% fewer bytes (assumed from Q1) and the census may revise it.

## Tracker
Owner intake 2026-11-21, area 5; answer Q4.
