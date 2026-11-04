---
id: TASK-605
title: "Let a repo declare the engineering standards it adopts, and have review apply them"
type: feature
sprint: SPRINT-163
priority: P2
size: M
risk: med
autonomy: HITL
class: execution
tier: P
authority: J2
origin: decomposer
state: ready
depends-on: []
---

# TASK-605 — Let a repo declare the engineering standards it adopts, and have review apply them

## Why
Owner question (SPRINT-161): how lean-flow carries specialities that need a proper standard (SOLID, clean architecture, Mermaid
diagram breakdown). Today a repo's standards are free prose in coding-standards, and review's Standards axis judges against them
loosely. The repo declares, lean-flow applies. ADR-053 ruling (owner, intake 2026-11-04): consumer-facing skill and template
work, unfrozen; no checker, gate leg or ledger is added.

## Done when
- [ ] The coding-standards template has an optional `## Standards adopted` section; each entry gives the standard, its scope, an
      authoritative reference, concrete yes/no checks, and exceptions. A repo that adopts none has no such section.
- [ ] `init` and `migrate` ask once whether the repo adopts a named standard (free text with examples, default none) and never
      infer one; "none" writes nothing, and a re-run of `migrate` keeps the entries already there.
- [ ] Review's Standards axis checks the diff against each adopted entry's checks and names the failed check and where it fails,
      never only the standard's name; a case listed under the entry's exceptions passes.
- [ ] Negative: a repo with no `## Standards adopted` section gets the same review as today, and a change that fails no check is
      never flagged under a standard's name.
- [ ] Shown on a consumer repo copy with two adopted standards, through a pinned clone of the change: a violating change caught, a
      compliant one passed, a justified exception accepted, and a repo with none adopted unchanged.
- [ ] README and CHANGELOG `[Unreleased]` name the new section, the question, and review applying adopted checks and exceptions.

## Touches
`skills/lean-doc-generator/templates/development-coding-standards.md.template` · `skills/lean-doc-generator/references/init.md` ·
`skills/lean-doc-generator/references/migration-map.md` · `skills/orchestrator/references/review-scoping.md` · `README.md` ·
`CHANGELOG.md`

## Assumes
- The adopted entries reach the reviewer through the existing Standards comparand (the coordinator's brief already passes
  coding-standards excerpts); the change is what the excerpt includes and how the reviewer reports, not new wiring.
- No `SKILL.md` line is added (lean-doc-generator is at 139); if one is needed, a line elsewhere in that file is cut to make room.
- Consumer proof on a copy under `D:\Research\` (snapshot, revert); the installed plugin never sees an unreleased change, so runs
  use `--plugin-dir` on a pinned clone (L-284).

## Tracker
TASK-601 (superseded) · intake rulings 2026-11-04 (ADR-053 boundary; free-text question; three-task shape) · Codex intake review
CLEAR in 2 rounds · `docs/research/plugin-reference-delta.md`
