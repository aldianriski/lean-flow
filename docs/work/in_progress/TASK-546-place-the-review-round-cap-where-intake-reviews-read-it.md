---
id: TASK-546
title: "Place the review-round cap where intake and proposal reviews read it"
sprint: SPRINT-149
priority: P2
size: S
risk: low
autonomy: HITL
class: decision
tier: P
authority: J2
origin: manual
state: ready
depends-on: []
---

# TASK-546 — Place the review-round cap where intake and proposal reviews read it

## Why
L-217 (count 5) is promoted, but its rule, the round cap ADR-053 § Decision 5 sets, fires at G2 only. Intake and proposal
reviews never read it: on 2026-10-29 the EPIC-023 proposal took 4 Codex rounds and its S0 intake took 5, and every round
after R1 found a new High in the text the previous fix had added. The owner adopted a rhythm for it and, at the SPRINT-147
promote, ruled that re-placing the rule is a task, not a promote edit (a shipped-skill change). Repeated failure: L-217 at
count 5, which admits it under ADR-053 if it adds machinery; as prose in an existing skill it is unfrozen.

## Done when
- [x] The rhythm (self-check before R1 · owner forks asked before R1 · altitude stated in the brief · at most 2 rounds, ✓ placed at 673f095d: review-scoping § Draft reviews, pointed to from task-decomposer step 6 and lean-doc-generator § Epic; the L-217 pointer names it, disposition move-to-reference; Codex R1 CLEAR (T1, T5)
  R2 blocking only on an outcome-changing High · the rest carried as G2 notes · fixes state what must be true) is placed
  where every flow that runs an intake or proposal review reads it, chosen by §10's placement test and named in the
  L-217 pointer line with its disposition.
- [x] The placement is consumer-safe: no maintainer-only path or Codex-specific wording leaks into a shipped skill. ✓ consumer grep over the shipped section: 0 hits for maintainer paths, repo ids or Codex wording, control hits 1; Codex R1 T3 CLEAR
- [ ] One real intake review run under the placed rule ends in at most 2 rounds, recorded in its log or commit.

## Touches
the shipped skill or reference §10's placement test selects (likely `/task-decomposer`'s review guidance) · `docs/LEARNINGS.md` (L-217 pointer line)

## Assumes
- The owner's Codex review loop applies (a shipped skill change), itself run under the rhythm it places.

## Tracker
L-217 · SPRINT-147 promote owner ruling (2026-10-29)
