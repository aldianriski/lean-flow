---
id: TASK-486
title: "an always-loaded line says where a new task is born, in lean-flow and in a scaffolded repo"
priority: P3
size: S
risk: low
autonomy: HITL
class: execution
tier: P
authority: J0
origin: decomposer
state: ready
depends-on: []
---

# TASK-486 — an always-loaded line says where a new task is born, in lean-flow and in a scaffolded repo

## Why
TD-222 (low) is a **measured** retrieval miss. EPIC-017's effectiveness probe R1 ("where does a new TASK get written today?") missed
because no always-loaded doc joins the two facts that answer it. Defect fix.
Consumer: the scaffolded CONTEXT template carries no task-store line, so a repo set up with `init` has the same gap.

## Done when
- [ ] One line in `.claude/CONTEXT.md` § Task entry shape names `docs/work/backlog/` as where a new task is born, and probe R1, re-run
      by the EPIC-017 effectiveness method, scores a literal hit.
- [ ] A fresh `init` scaffold answers R1 from an always-loaded file it creates (which template carries the line is G2's choice).
- [ ] TD-222 resolved; CHANGELOG notes the template line.

## Touches
`.claude/CONTEXT.md` · one scaffold template under `skills/lean-doc-generator/templates/` · `TECH-DEBT.md` · CHANGELOG

## Assumes
- Shipped template wording is host-generic.

## Tracker
- TD-222 · owner selection 2026-10-24 (split out of candidate G); intake draft reviewed by Codex 2026-10-24 (APPROVE WITH FIXES)
