---
id: TASK-435
title: "Ship a roadmap template and its STANDARD row, so a repo can write a phased delivery plan"
epic: EPIC-022
sprint: SPRINT-126
priority: P1
size: M
risk: med
autonomy: HITL
class: decision
tier: P
authority: J2
origin: decomposer
state: ready
depends-on: []
---

# TASK-435 — Ship a roadmap template and its STANDARD row, so a repo can write a phased delivery plan

## Why

workdoo, the first outside consumer, hand-rolled a phased delivery plan (16 vertical-slice rows, P0…P12) because lean-flow
ships no template and no STANDARD row for one. It has no status column and no link from a row to the tasks delivering it, so
progress lives in one prose line. Consumer evidence (ADR-053).

## Done when

- [ ] A `roadmap.md.template` ships beside the other templates: the §3 ownership header, then Outcome · Delivery sequence
      (a table `Row | Usable outcome | Depends on | Acceptance evidence | Status | Covered by`, Status ∈ done · active · planned,
      Covered by ∈ `TASK-NNN[, …]` · `EPIC-NNN` · `next slice: <name>`) · Gates · Out of scope, with the rule that each row is a
      reviewable vertical slice split into runnable tasks at promotion.
- [ ] STANDARD §2 carries a `product/roadmap.md` row (created lazily when a delivery sequence spans ≥ 2 sprints or epics; cap
      ~150 soft) and a "Roadmap coverage" rule: an `active` row is covered by an open task, an active epic or a named next slice;
      `planned` rows are exempt; `done` rows need nothing; a mark whose every id is done, cancelled or missing is stale. Spec
      0.17.0 (MINOR carrying MAJOR meaning under §15: the row names `docs/roadmap.md` as its legacy path, and a `roadmap.md`
      elsewhere under `docs/` is newly flagged by S2.R-PLACEMENT; no rule-table row), with its spec CHANGELOG block and upgrade note.
- [ ] `/lean-doc-generator` creates it as an ordinary `<type> <subject>` doc, and every template count claim agrees
      (34 core + 2 non-core = 36).
- [ ] Exercised on real input (L-007): workdoo's actual roadmap, re-expressed in the template on a scratch copy, keeps every one of
      its 16 rows' content and gains a Status and Covered-by cell each; nothing is written into workdoo.

## Touches

- skills/lean-doc-generator/templates/ · skills/lean-doc-generator/SKILL.md · spec/STANDARD.md · spec/CHANGELOG.md ·
  .claude/CLAUDE.md (template count) · docs/architecture/overview.md · scripts/lib/check-count-claims.sh

## Assumes

- A1: a row covered by `EPIC-NNN` counts as covered only while that epic is `active` (owner-confirmed at intake, 2026-10-18).
- A2: one roadmap per repo; scoped row plans under `docs/product/roadmap/<row>.md` are free-form and not coverage-checked.
- A3: a row id is the leading token of the first cell (e.g. `P2a`), unique within the table.
- A4: the template count becomes 34 core + 2 non-core = 36; every count claim is updated.
- A5: no file in workdoo is written; the in-workdoo run stays EPIC-022's last Closed-when (S3).

## Tracker

- EPIC-022 Closed-when 4 (S2 roadmap + traceability) · consumer evidence `D:\Research\workdoo\docs\product\company-workspace-roadmap.md`
