---
id: TASK-429
title: "Make /prime report freshness under --plugin-dir and offer a night run only when one can work"
epic: EPIC-022
sprint: SPRINT-125
priority: P2
size: S
risk: low
autonomy: HITL
class: execution
tier: P
authority: J1
origin: manual
state: ready
depends-on: []
---

# TASK-429 — Make /prime report freshness under --plugin-dir and offer a night run only when one can work

## Done when

- [x] Under `claude --plugin-dir <repo>` the `Skills:` row reads the base dir's own ✓ `83684fa6`: live-checkout row in § Skill freshness; judgment tick — checked by reading against this repo, no live `--plugin-dir` run
      `.claude-plugin/plugin.json` and reports `fresh`; the cached-install and no-manifest rows are
      unchanged (TD-220).
- [x] `Next:` names `sprint-bulk unattended` only when at least one open member is AFK and J0/J1; an ✓ `83684fa6`: step 6 + example gated on an open AFK J0/J1 member; scoped review CLEAR
      all-HITL/J2 sprint gets `/orchestrator` alone (TD-230).
- [x] `skills/prime/SKILL.md` stays ≤ ~140 lines (it is at 139 — move depth to `references/` if needed). ✓ 139 lines; `check-doc-caps` PASS (139 ≤ 140)

## Touches

- skills/prime/SKILL.md · skills/prime/references/ (only if created) · CHANGELOG.md · TECH-DEBT.md

## Assumes

- none

## Tracker

- EPIC-022 Closed-when 1 · TD-220 · TD-230
