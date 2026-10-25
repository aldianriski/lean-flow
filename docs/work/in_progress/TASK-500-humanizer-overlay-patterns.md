---
id: TASK-500
title: "Add a lean-flow-owned humanizer overlay with five patterns the vendored catalog lacks"
priority: P2
size: S
risk: low
autonomy: HITL
class: execution
tier: P
authority: J1
origin: decomposer
state: ready
depends-on: []
sprint: SPRINT-140
---

# TASK-500 — Add a lean-flow-owned humanizer overlay with five patterns the vendored catalog lacks

## Why
anti-slop's `antislop-copywriting` overlaps the humanizer catalog ~90% (same Wikipedia lineage). Five of its patterns have no
match in `patterns-en.md`'s 26 (checked by keyword and by heading). The vendored file must stay verbatim (TASK-498), so the
remainder needs a file lean-flow owns.

## Done when
- [x] `skills/humanizer/references/patterns-lf.md` holds five patterns in the catalog's shape: an abstraction given a ✓ `bc5cb4b5`: LF-1..LF-5, each with Watch for · Problem · Before → After · When not to act; LF-2..LF-5 *weak alone*; every pair facts-equal (examples re-cut after Codex R1)
      human verb ("the dashboard understands") · filler phrases ("in order to", "due to the fact that") · synonym cycling
      · empty "from X to Y" ranges · clusters of scare quotes — each with a "weak alone" mark where it applies and a
      "when not to act" note.
- [x] SKILL.md step 1 reads it in full, **and** `references/embedded.md` (child brief step 2 and the inline fallback) ✓ `bc5cb4b5`: SKILL.md step 1 + both Translate directions; embedded.md child brief step 2 + inline fallback read all three files; every embedded run's child read patterns-lf.md in full (no offset/limit)
      reads it too, so the embedded pass every writing job runs sees the overlay (L-020 wiring).
- [x] `patterns-en.md` is unchanged: `git hash-object` equals its value at `HEAD` before the change. ✓ git hash-object = HEAD:patterns-en.md = 5bfea604a6a4df8a0e713a1e36310be76edbebe6 before and after
- [x] Exercised on real input: one text carrying all five patterns, run through both standalone and embedded modes; ✓ standalone a2 + embedded b6 clean (all five caught, all nine real facts kept); embedded b1 added a fact, b2 and b5 dropped one, b3 missed LF-3; fact loss → TD at close (owner ruling)
      each pattern is caught, nothing factual is added or dropped.
- [x] Codex review → fix → re-review until clean; SKILL.md ≤ ~140 lines; CHANGELOG line. ✓ Codex R1 NOT CLEAR (2: run-4 scope claim; LF-3/4/5 examples) → fixed → R2 VERDICT: CLEAR; SKILL.md 92/140; CHANGELOG bullet in `bc5cb4b5`

## Touches
`skills/humanizer/references/patterns-lf.md` (new) · `skills/humanizer/SKILL.md` · `skills/humanizer/references/embedded.md` ·
`CHANGELOG.md`

## Assumes
- Shares `skills/humanizer/SKILL.md` with TASK-501 and TASK-502: G2 assigns one owner and a commit order.

## Tracker
anti-slop adoption scan 2026-10-25, item 2.
