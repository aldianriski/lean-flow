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
---

# TASK-500 — Add a lean-flow-owned humanizer overlay with five patterns the vendored catalog lacks

## Why
anti-slop's `antislop-copywriting` overlaps the humanizer catalog ~90% (same Wikipedia lineage). Five of its patterns have no
match in `patterns-en.md`'s 26 (checked by keyword and by heading). The vendored file must stay verbatim (TASK-498), so the
remainder needs a file lean-flow owns.

## Done when
- [ ] `skills/humanizer/references/patterns-lf.md` holds five patterns in the catalog's shape: an abstraction given a
      human verb ("the dashboard understands") · filler phrases ("in order to", "due to the fact that") · synonym cycling
      · empty "from X to Y" ranges · clusters of scare quotes — each with a "weak alone" mark where it applies and a
      "when not to act" note.
- [ ] SKILL.md step 1 reads it in full, **and** `references/embedded.md` (child brief step 2 and the inline fallback)
      reads it too, so the embedded pass every writing job runs sees the overlay (L-020 wiring).
- [ ] `patterns-en.md` is unchanged: `git hash-object` equals its value at `HEAD` before the change.
- [ ] Exercised on real input: one text carrying all five patterns, run through both standalone and embedded modes;
      each pattern is caught, nothing factual is added or dropped.
- [ ] Codex review → fix → re-review until clean; SKILL.md ≤ ~140 lines; CHANGELOG line.

## Touches
`skills/humanizer/references/patterns-lf.md` (new) · `skills/humanizer/SKILL.md` · `skills/humanizer/references/embedded.md` ·
`CHANGELOG.md`

## Assumes
- Shares `skills/humanizer/SKILL.md` with TASK-501 and TASK-502: G2 assigns one owner and a commit order.

## Tracker
anti-slop adoption scan 2026-10-25, item 2.
