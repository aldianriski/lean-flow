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
---

# TASK-501 — Add an explicit-request audit mode to humanizer: numbered findings, the owner picks which to apply

## Why
File mode rewrites a whole file in one pass, so the owner can't pick which edits land in a long doc. anti-slop's After mode
(numbered findings, approve by number, nothing else touched) is the pattern.

## Done when
- [ ] A new **Audit** mode fires only on an explicit request ("audit", "list findings first"); file mode and pasted-text
      mode are unchanged.
- [ ] Audit returns numbered findings, strongest pattern first (§1–§5 before the rest, "weak alone" findings marked),
      each citing its pattern § and quoting the span; it edits nothing.
- [ ] After the owner names numbers, only those spans change; every other span is byte-unchanged (diff shows no edit
      outside the chosen findings).
- [ ] Exercised on one real lean-flow prose file: an audit, a partial pick, and a diff confirming the untouched spans.
- [ ] Codex review → fix → re-review until clean; SKILL.md ≤ ~140 lines; CHANGELOG line.

## Touches
`skills/humanizer/SKILL.md` (§ Modes) · `CHANGELOG.md`

## Assumes
- Embedded mode never uses audit (it cannot ask).
- Shares `skills/humanizer/SKILL.md` with TASK-500 and TASK-502: G2 assigns one owner and a commit order.

## Tracker
anti-slop adoption scan 2026-10-25, item 3 (trigger: explicit request only, owner ruling).
