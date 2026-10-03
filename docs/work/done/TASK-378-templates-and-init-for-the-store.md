---
id: TASK-378
title: "Ship the store in templates and greenfield init"
epic: EPIC-017
sprint: SPRINT-113
priority: P1
size: M
risk: med
autonomy: HITL
class: execution
tier: X
authority: J1
origin: decomposer
state: ready
depends-on: [TASK-377]
---

# TASK-378 — Ship the store in templates and greenfield init

## Done when

- [x] A TASK.md.template matches the TASK-359 schema. ✓ `b3ca35d` — `templates/TASK.md.template` matches task-file.md field for field (Codex CLEAR)
- [x] TODO.md.template is removed, or kept only as the migrate tombstone. ✓ `b3ca35d` — deleted (owner ruling, no tombstone); TD-209 resolved
- [x] `init` scaffolds docs/work/ for a fresh repo instead of TODO.md — exercised once on an empty directory. ✓ `b3ca35d` — init (store-first since SPRINT-111 T5) exercised on an empty OS-temp dir: 13 files, `docs/work/` lazy per §2, no TODO.md
- [x] Other templates route follow-ups to task files; no lean-flow-specific path leaks in (L-015). ✓ `b3ca35d` — the one leak (QA-TESTCASE "TODO gains…") fixed; a grep of templates for TODO.md/Backlog pool/§ Backlog is empty; count-claims 35 = 35

## Touches

skills/lean-doc-generator/templates/ (new TASK.md.template · TODO.md.template · TECH-DEBT · CHANGELOG · BUG · QA-TESTCASE · AGENTS) · skills/lean-doc-generator/references/init.md

## Assumes

none

## Tracker

EPIC-017 scope 6 · L-015
