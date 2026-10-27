---
id: TASK-526
title: "Recast an internal to-do list in an outward request as requests to the recipient, and add the Indonesian hedge and fragment forms"
priority: P2
size: S
risk: med
autonomy: HITL
class: execution
tier: X
authority: J1
origin: decomposer
state: blocked
sprint: SPRINT-145
depends-on: [TASK-525]
---

# TASK-526 — Recast an internal to-do list in an outward request

## Why
The same memo ended with a "Yang perlu diputuskan" checkbox list of open questions, which the owner called "really not
professional": a request hands the recipient terms, not the writer's to-do list. It also kept hedges ("di atas kertas",
"tetap harus dibuktikan dengan uji") and label-first bullet fragments ("Storage cukup." "RAM ditambah."). The English
catalog's §9 and §26 come near the first two, but no pattern names a working list leaking into outward text. Owner
ruling at intake: the pattern recasts the list as requests or questions to the recipient and keeps every item; it never
invents a firm answer. Depends on TASK-525 for the fixture and for the shared `patterns-id.md` and CHANGELOG.

## Done when
- [x] `patterns-lf.md` gains LF-6: an internal working list (open decisions, a checkbox to-do) inside text addressed to ✓ LF-6 at 5414fc86, Before names the purchase 8441293d; EN + ID pairs, every item kept, none decided; Codex R2 CLEAR
      someone else is recast as numbered requests or questions to the recipient, with a formal close where the
      register is formal; every item is kept, and no open item is turned into a decided term. It carries a When-not-to-act
      (an internal doc, a meeting agenda) and an Indonesian example ("Yang perlu diputuskan" → "Ketentuan permintaan").
- [x] `patterns-id.md` gains an ID line for §9 with the hedges "di atas kertas" and "tetap harus dibuktikan dengan ✓ ID-18 + ID-2 fragment example; ID-18 keeps basis + test obligation (owner ruling) at 8441293d; Codex R2 CLEAR
      uji": the hedging wording goes, while any real uncertainty and any testing obligation stay stated (the memo's fix
      kept the test: "dibuktikan dengan uji … saat acceptance test"). ID-2 gains the label-first bullet fragment example
      ("Storage cukup." "RAM ditambah.") → one full sentence with the number.
- [x] The overlay count reads six in `patterns-lf.md`, `skills/humanizer/SKILL.md` and `README.md`, and SKILL.md's ✓ 5414fc86: six in patterns-lf.md, SKILL.md, README.md; audit order LF-1 to LF-6; grep finds no five
      audit order reads "LF-1 to LF-6".
- [x] Three embedded runs on the TASK-525 fixture keep every open item (recast, not dropped or decided), every fact ✓ final text 8441293d: 3/3 pass by fresh judge on every field; earlier sets 1/3 and 2/3 recorded in NOTES
      (each stated uncertainty and testing obligation included), and remove the fragments and the hedging wording,
      judged by a reader that did not write the brief (L-252, L-259).
- [x] CHANGELOG `[Unreleased]` line. ✓ 5414fc86: CHANGELOG [Unreleased] SPRINT-145 bullet

## Touches
`skills/humanizer/references/patterns-lf.md` · `skills/humanizer/references/patterns-id.md` ·
`skills/humanizer/SKILL.md` (overlay count, audit order) · `README.md` · CHANGELOG.md · reads the TASK-525 fixture

## Assumes
- Recasting keeps every item, so it does not conflict with the embedded pass's fact list and check (Child path item 4);
  the TASK-525 fixture's fact list already counts each open item.
- `check-count-claims.sh` has no rule for the overlay's size, so the three count edits are a read-through check.

## Tracker
Peer session feedback from a BNPT memo, items 3 and 4 (2026-10-26); intake draft Codex-reviewed, R2 CLEAR.
