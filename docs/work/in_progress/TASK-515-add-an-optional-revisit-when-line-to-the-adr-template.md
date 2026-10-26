---
id: TASK-515
title: "Add an optional Revisit-when line to the ADR template so a decision names what would reopen it"
priority: P3
size: S
risk: low
autonomy: HITL
class: execution
tier: P
authority: J1
origin: decomposer
state: ready
sprint: SPRINT-144
depends-on: []
---

# TASK-515 — Add an optional Revisit-when line to the ADR template

## Why
ADRs are append-only and get superseded, but nothing records what should trigger the supersession, so a stale
decision is found by accident. The Codex pipeline records "reopen when" on every decision. Ships to every adopter
through `init`. Source: `docs/research/codex-run-project-pipeline.md` (3).

## Done when
- [x] `ADR.md.template` carries an optional **Revisit when:** header line (a condition, not a date) beside Status / Deciders. ✓ 12fad813: optional Revisit when bullet after Context driver
- [x] The worked example ADR fills it. ✓ 12fad813: ADR-example fills it from its own driver and negative; Codex R2 CLEAR
- [x] The conformance engine's S4 checks still pass against the example (the line is not a required §4 section). ✓ conformance.sh on scratch docs/adr/: S4 ONEFILE/INDEX/SECTIONS/NEGATIVE PASS, same as unedited control; adr-family fixtures green
- [x] CHANGELOG `[Unreleased]` line. ✓ 12fad813: CHANGELOG [Unreleased] SPRINT-144 bullet

## Touches
`skills/lean-doc-generator/templates/ADR.md.template` · `skills/lean-doc-generator/references/ADR-example.md` · CHANGELOG.md

## Assumes
- Optional header line only. Making it required is a STANDARD §4 + engine change: out of scope (Consequential G).

## Tracker
Research `codex-run-project-pipeline`, Findings row (3).
