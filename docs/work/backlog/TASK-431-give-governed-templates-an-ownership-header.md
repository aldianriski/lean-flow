---
id: TASK-431
title: "Give every template that renders into a governed tree its ownership header"
epic: EPIC-022
priority: P2
size: S
risk: low
autonomy: HITL
class: decision
tier: P
authority: J1
origin: manual
state: ready
depends-on: []
---

# TASK-431 — Give every template that renders into a governed tree its ownership header

## Done when

- [ ] Each of the five header-less templates (`AGENTS` · `BUG` · `CODE_OF_CONDUCT` · `DESIGN` · `QA-TESTCASE`;
      `README` is §3's stated exception) is ruled against one test — does what it renders land where §3
      governs? — and those that do carry the four-field header (TD-078).
- [ ] A rendered `QA-TESTCASE` no longer draws an `S3.SCHEMA` finding from `conformance.sh`.

## Touches

- skills/lean-doc-generator/templates/ (the five named templates) · CHANGELOG.md · TECH-DEBT.md

## Assumes

- the census of 6 header-less templates (TD-078, SPRINT-081) still holds — re-derive at G1.

## Tracker

- EPIC-022 Closed-when 2 · TD-078
