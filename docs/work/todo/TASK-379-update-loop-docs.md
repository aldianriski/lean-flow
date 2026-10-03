---
id: TASK-379
title: "Update the durable docs that describe the loop"
epic: EPIC-017
sprint: SPRINT-113
priority: P1
size: M
risk: low
autonomy: HITL
class: execution
tier: P
authority: J1
origin: decomposer
state: ready
depends-on: [TASK-375, TASK-376, TASK-377]
---

# TASK-379 — Update the durable docs that describe the loop

## Done when

- [x] CONTEXT.md, CLAUDE.md and the architecture overview describe the v2 loop and directory map. ✓ `e6c21c97` — CONTEXT § Task entry shape → v2 file frontmatter; overview map gains `work/`; CLAUDE.md verified (no v1 residue)
- [x] README carries the hard-cut upgrade guide: install 2.x → restart the session → `/lean-doc-generator migrate` → resume. ✓ `e6c21c97` — README § Upgrading to 2.x already states install 2.x → restart → migrate → resume, in order (verified unchanged)
- [x] QA-001 and QA-002 test cases updated to v2 behaviour; council / refactor-advisor wording no longer says 'TODO tracker'. ✓ `ed1cfe6f` — QA-001/002 steps and Expected rewritten for v2 (Codex fixes: seeded fixture + post-promotion folders); council:52 → "a task file"; refactor-advisor clean

## Touches

.claude/CONTEXT.md · .claude/CLAUDE.md · README.md · docs/architecture/overview.md · docs/QA.md · docs/qa/QA-001-prime-entry-detection.md · docs/qa/QA-002-intake-to-plan-pipeline.md · skills/council/SKILL.md · skills/refactor-advisor/SKILL.md

## Assumes

none

## Amended 2026-09-26

- Carried from SPRINT-107 T3: these still describe `TODO.md` § Active Sprint as the pointer to the running sprint: `skills/prime/SKILL.md` (~l.41, the v1 resolution sentence), `skills/lean-doc-generator/SKILL.md` (~l.101/107, the promote/close rows), `.claude/CONTEXT.md` (~l.103) and `README.md` (the loop description). On a v2 store the active sprint is found from top-level `docs/sprint/SPRINT-*.md` `status: active` plus members (as in `/handoff`). The sprint-bulk and Plan-DoD wording was already refreshed at SPRINT-107's close.

## Tracker

EPIC-017 · Codex r2 R2-2b
