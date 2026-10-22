---
id: TASK-475
title: "doc-caps reads the cap only from the start of the cell"
sprint: SPRINT-136
priority: P2
size: S
risk: low
autonomy: HITL
class: execution
tier: G
authority: J1
origin: decomposer
state: ready
depends-on: []
---

# TASK-475 — doc-caps reads the cap only from the start of the cell

## Why

Defect fix (ADR-053 §3, unfrozen; the named parse finding repairs an existing check, it adds none). TD-062 (medium): the §2
cap reader takes the first digit run anywhere in a Cap cell as the cap, so a cell whose first number is not the cap is read
wrongly (the SPRINT-073 defect). Valid cells today include `120`, `150 soft`, `400 hard`, `12 (ADR-015)`, `320 soft (ADR-019)`,
`—` and prose with no cap. Other G. G2 review-round cap: 2.

## Done when

- [x] The cap is read only from the start of the cell: an optional `~`, a leading integer, then an optional `soft`, `hard` or `each` ✓ `d69ff70f`: parseCapCell (owner-ruled grammar incl. each); no-digit cell = none; other digit cells FAIL cap-cell-unparsed; only walked file-table rows
      and an optional parenthetical. A cell with no digits states no cap, as today. A cell whose digits do not lead is a named
      finding, not a guessed cap. Only real file-table Cap cells are validated.
- [x] The real §2 tables yield exactly the rows the checker yields today (diffed before and after), and a retained must-FAIL ✓ deriveRows(STANDARD.md) JSON cmp identical, 28 rows; `see row 3; 120` FAILs cap-cell-unparsed (old checker read cap 3, PASS); differential 26/26
      cell such as `see row 3; 120` FAILs by name.
- [x] TD-062 marked resolved in `TECH-DEBT.md`. ✓ `39b7fa34`: TD-062 resolved

## Touches

the doc-caps checker and its fixtures · `TECH-DEBT.md`

## Assumes

- No current §2 Cap cell has digits that do not lead; the before/after diff confirms it.

## Tracker

- TD-062 · intake draft reviewed by Codex 2026-10-21
