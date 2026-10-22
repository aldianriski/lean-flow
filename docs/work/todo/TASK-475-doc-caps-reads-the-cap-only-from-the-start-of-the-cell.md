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

- [ ] The cap is read only from the start of the cell: an optional `~`, a leading integer, then an optional `soft` or `hard`
      and an optional parenthetical. A cell with no digits states no cap, as today. A cell whose digits do not lead is a named
      finding, not a guessed cap. Only real file-table Cap cells are validated.
- [ ] The real §2 tables yield exactly the rows the checker yields today (diffed before and after), and a retained must-FAIL
      cell such as `see row 3; 120` FAILs by name.
- [ ] TD-062 marked resolved in `TECH-DEBT.md`.

## Touches

the doc-caps checker and its fixtures · `TECH-DEBT.md`

## Assumes

- No current §2 Cap cell has digits that do not lead; the before/after diff confirms it.

## Tracker

- TD-062 · intake draft reviewed by Codex 2026-10-21
