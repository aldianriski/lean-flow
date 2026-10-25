---
id: TASK-501
title: "Add an explicit-request audit mode to humanizer: numbered findings, the owner picks which to apply"
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

# TASK-501 — Add an explicit-request audit mode to humanizer: numbered findings, the owner picks which to apply

## Why
File mode rewrites a whole file in one pass, so the owner can't pick which edits land in a long doc. anti-slop's After mode
(numbered findings, approve by number, nothing else touched) is the pattern.

## Done when
- [x] A new **Audit** mode fires only on an explicit request ("audit", "list findings first"); file mode and pasted-text ✓ `510d632c`: § Modes **Audit (explicit request only)**, triggers in the description; Pasted-text and File paragraphs unchanged
      mode are unchanged.
- [x] Audit returns numbered findings, strongest pattern first (§1–§5 before the rest, "weak alone" findings marked), ✓ `510d632c`: §1–§5 (and ID-1..ID-5) first, then catalog order; each finding gives id, location and the quoted sentence; weak-alone marked; audit edits nothing (exercise hash 6f5d2da8fefc7b89 before = after)
      each citing its pattern § and quoting the span; it edits nothing.
- [x] After the owner names numbers, only those spans change; every other span is byte-unchanged (diff shows no edit ✓ exercise turn 2, pick 1·6·9: diff shows exactly lines 19, 33 and 55 changed, each inside its finding's quoted sentence; every other byte unchanged
      outside the chosen findings).
- [x] Exercised on one real lean-flow prose file: an audit, a partial pick, and a diff confirming the untouched spans. ✓ copy of lean-flow's SECURITY.md in a removed scratch folder of the workdoo copy: 13-finding audit, simulated pick (stated), full diff recorded in the log
- [x] Codex review → fix → re-review until clean; SKILL.md ≤ ~140 lines; CHANGELOG line. ✓ Codex R1 VERDICT: CLEAR (5/5); SKILL.md 109/140; prose-density 28/0; check-doc-caps 0 FAIL; CHANGELOG bullet in `510d632c`

## Touches
`skills/humanizer/SKILL.md` (§ Modes) · `CHANGELOG.md`

## Assumes
- Embedded mode never uses audit (it cannot ask).
- Shares `skills/humanizer/SKILL.md` with TASK-500 and TASK-502: G2 assigns one owner and a commit order.

## Tracker
anti-slop adoption scan 2026-10-25, item 3 (trigger: explicit request only, owner ruling).
