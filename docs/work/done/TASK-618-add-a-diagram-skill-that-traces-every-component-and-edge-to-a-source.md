---
id: TASK-618
title: "Add a /diagram skill that draws an architecture diagram where every component and edge traces to a source"
type: feature
priority: P2
size: M
risk: med
autonomy: HITL
class: execution
tier: P
authority: J1
origin: decomposer
state: ready
sprint: SPRINT-166
depends-on: []
---

# TASK-618 — Add a /diagram skill that draws an architecture diagram where every component and edge traces to a source

## Why
Existing templates draw Mermaid from the author's memory, with no per-id source or status, so an invented or never-called edge looks the same as a real one. The owner ruled to adopt the per-edge evidence record. Mermaid itself is already in lean-flow (the data-flow, flows and ERD templates, `init.md`, `refactor-advisor`, STANDARD §2); the evidence record is the delta. Claude workers build.

## Approved design
New `skills/diagram/SKILL.md` (80 lines or fewer) plus `skills/diagram/references/evidence-record.md`, written in lean-flow's own words. Tools: Read, Glob, Grep, Write, Edit, and read-only git (`rev-parse`, `status`) for the revision.

Procedure: (1) state the question, audience and actual versus proposed state; (2) read sources: entry points, config, call sites, persistence, deploy; (3) build an evidence table, one row per component or edge id: claim, source `path:line`, revision (commit sha, else `working-tree`), status `configured` | `called` | `proposed` | `unknown`; (4) draw Mermaid with status in label text in every view, line style secondary: components `N1["api · called"]`; edges `A -->|E1 called| B`, `A -.->|E2 configured| B`, `A -.->|E3 proposed| B`, `A -.->|E4 unknown| B`; sequence `A->>B: E1 called`; ER relationships by label text; (5) place the output per the map below.

Rules: a configured adapter never called is never drawn `called`; never invent services, controls or throughput; dirty edits are `working-tree`, never HEAD facts; redact credentials and private addresses; no image generation. Degrades gracefully: no git means revision `working-tree` or a date; works with no lean-flow docs present.

Output location (STANDARD §2 slots, each within its cap; if diagram plus table would pass the cap, split into an overview and targeted views): workflow, sequence, state → `docs/flows/<slug>.md` (100) · dataflow → `docs/architecture/data-flow.md` (120) · cross-service calls → `docs/architecture/service-dependencies.md` (120) · ERD → `docs/database/erd.md` (120) · whole-system view → a section of `docs/architecture/overview.md` (150). A consumer without these docs gets the output inline or at the path they name; the skill creates no folder layout of its own.

## Done when
- [x] `/diagram` on lean-flow's own loop (`prime` to `handoff`) gives a Mermaid diagram plus an evidence table where every id has a row. ✓ 15 ids, one row each, scope prime to handoff (worker run on 91f02165)
- [x] Citation check: at least 5 sampled rows are opened, and each `path:line` exists and says what the row claims; misses are named. ✓ 9 of 9 sampled rows open and match; E4 is unknown with no directing line
- [x] A throwaway fixture repo with one configured-but-never-called adapter and one source-less claim is run through `/diagram`: the adapter is labelled `configured`, the source-less claim is `unknown`; the fixture is deleted after. ✓ never-called mailer labelled configured, README replication claim unknown; fixture deleted, tree clean
- [x] A second real repo of different shape (`D:\Research\workdoo`, read-only; the no-git path is covered by the fixture) gives a valid diagram with no lean-flow path leaked. ✓ workdoo read-only at cf41a203, 15 ids, no lean-flow path; E1 corrected to configured by the edge-end rule
- [x] The output path follows the map above and stays within each slot's cap, checked by `wc -l`. ✓ both outputs fit an overview section, 30 and 28 lines by wc -l against 150
- [x] Copied-text check: take at least 15 distinctive phrases (4 or more words each) from the kit's `SKILL.md` and its three references, search each in `skills/diagram/`, and report hits; target 0, any hit is rewritten. The same search finds none of the words Archify, TemiDev, motion or video in `skills/diagram/`. ✓ 20 phrases gave 0 hits; every 5-word run of all 4 kit files checked, last shared run reworded in 9331060b; 0 forbidden words
- [x] SKILL.md is 80 lines or fewer. ✓ 70 lines by wc -l
- [x] Negative: on the fixture, the configured-but-never-called adapter is labelled `configured` and no `-->` edge marked `called` touches it, and the source-less claim appears as `unknown`, never as a plain edge. ✓ on the fixture the only solid edge is N1 to N2; no solid edge touches N3, and the README claim is unknown

## Touches
`skills/diagram/SKILL.md`, `skills/diagram/references/evidence-record.md`. The fixture is throwaway and deleted.

## Assumes
- Mermaid is the only output format.
- Text is in lean-flow's own words, no kit sentence ships (owner popup, 2026-11-07).
- Read-only git is acceptable for the revision.
- No checker script, ledger or qa-check leg (ADR-053).

## Tracker
Owner request (EPIC-024 trial host, TASK-617): evidence-backed architecture diagrams from `present-system-architecture`, read as data.
