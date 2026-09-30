---
id: TASK-395
title: "Skills stop directing TODO.md reads and writes"
epic: EPIC-017
sprint: SPRINT-111
priority: P1
size: M
risk: med
autonomy: HITL
class: execution
tier: P
authority: J1
origin: manual
state: ready
depends-on: [TASK-370]
---

# TASK-395 — Skills stop directing TODO.md reads and writes

## Why

Split out of `TASK-394` at the SPRINT-111 scope-change (owner, 2026-09-30). The T3 census found that A3 was false.
`prime` (row 5, Resolution), `lean-doc-generator` ("TODO.md is the Backlog pool", follow-ups → TODO § Backlog) and
`references/init.md` (scaffolds a v1 TODO.md with no condition) still tell an agent to read TODO.md, write it, or scaffold
it. So do two templates. None of these is executable, but every one is a consumer-facing procedure (L-015).

## Done when

- [ ] No `skills/` file directs a TODO.md read or write except the allowlist: migrate's v1→v2 procedure, existence-only layout detection, and v1-refusal text.
- [ ] `init` scaffolds the store (`docs/work/`), not TODO.md; migration-map's dev-flow/adlc section produces store files.
- [ ] README and CHANGELOG `[Unreleased]` carry the consumer-visible change; `templates/TODO.md.template` kept with a TD row for its 2.0 cleanup.

## Touches

skills/prime/SKILL.md · skills/lean-doc-generator/SKILL.md · references/init.md · references/migration-map.md · templates/TECH-DEBT.md.template · templates/CHANGELOG.md.template · README.md · CHANGELOG.md

## Assumes

none

## Tracker

EPIC-017 Closed-when 2 · split from TASK-394 · SPRINT-111 scope-change
