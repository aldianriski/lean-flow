---
sprint: 166
slug: evidence-backed-diagrams
epic: EPIC-024
owner: Maintainer
last_updated: 2026-11-07
status: closed
gates_signed: G1,G2 @ 4118690b
plan_commit: 3b2c5170
update_trigger: sprint execute/close events
---

# SPRINT-166 — Evidence-Backed Diagrams

> **Theme:** a new `/diagram` skill draws architecture diagrams where every component and edge cites a source and a status. It also hosts the bundled small-coordinator trial for EPIC-024 rows 2 and 3 (TASK-617), the real sprint those rows were waiting for.

## Scope

**In:** the `/diagram` skill and its evidence-record reference (TASK-618); wiring into the roster, docs, SECURITY, templates and CHANGELOG (TASK-619); `/diagram update` (TASK-620).
**Out (deferred):** motion, video and Archify parts; TemiDev assets; any release or push; the router; TASK-616 and TASK-617, which are not members and are ticked after this sprint closes.

## Members

- docs/work/todo/TASK-618-add-a-diagram-skill-that-traces-every-component-and-edge-to-a-source.md
- docs/work/todo/TASK-619-wire-diagram-into-roster-docs-templates-and-changelog.md
- docs/work/todo/TASK-620-make-diagram-update-an-existing-diagram-without-losing-evidence.md

## Plan

### T1 — Add the /diagram skill with a per-id evidence record `[size: M · risk: med · class: execution · HITL · J1]`
Layers: `skills/diagram/SKILL.md` · `skills/diagram/references/evidence-record.md`
Depends-on: none
Cites: TASK-618 · the kit's `present-system-architecture` skill (read as data)
Existing templates draw Mermaid from memory, so an invented edge looks like a real one. The delta over lean-flow is the evidence record, in lean-flow's own words.

**Acceptance:** `/diagram` on lean-flow's own loop gives a Mermaid diagram and an evidence table with a row per id, and the copied-text check finds no kit text.

### T2 — Wire /diagram into the roster, docs, templates and changelog `[size: M · risk: med · class: execution · HITL · J1]`
Layers: `.claude/CLAUDE.md` · `.claude/CONTEXT.md` · `README.md` · `docs/architecture/overview.md` · `SECURITY.md` · `evals/run-layout-fixtures.ts` · `CHANGELOG.md` · `skills/lean-doc-generator/templates/architecture-data-flow.md.template` · `skills/lean-doc-generator/templates/flows.md.template` · `skills/lean-doc-generator/templates/database-erd.md.template`
Depends-on: T1
Cites: TASK-619
A skill missing from the roster and the templates that draw diagrams is present but never fires. Shared SSOT files are edited one at a time and each table is re-read after.

**Acceptance:** a fresh `claude -p` session with `--plugin-dir` on `main` loads /diagram for "draw the architecture of this repo", and the off-host gate passes.

### T3 — Let /diagram update an existing diagram without losing evidence `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `skills/diagram/SKILL.md` · `skills/diagram/references/evidence-record.md`
Depends-on: T1
Cites: TASK-620
An update touches only the ids whose source changed; a vanished source turns its row `unknown` with the date.

**Acceptance:** `/diagram update` changes only affected ids, and a rerun with no source change gives an empty diff.

## Owner-action checklist
none

## Decisions (pre-locked)
- **D1** — Waves: T1, then T2 and T3 in parallel. T1 and T3 share `skills/diagram/*`, so T1's commit lands first; T2 edits shared SSOT files one at a time with `git add -p`.
- **D2** — Owner ruling, 2026-11-07: Claude workers build.
- **D3** — Owner ruling, 2026-11-07: Codex reviews TASK-618's shipped skill text, at most 2 rounds. TASK-619 and TASK-620 get a session-model read-through (tier P).
- **D4** — Owner ruling, 2026-11-07, build note 1: always-loaded docs have 7 tokens of budget left, so T2 trims as much as it adds to `.claude/CLAUDE.md` and `.claude/CONTEXT.md`, without raising the budget.
- **D5** — Owner ruling, 2026-11-07, build note 2: T1 workers follow `main`'s SKILL.md by hand; the plugin-load proof is T2's fresh `claude -p` session with `--plugin-dir` on `main`.
- **D6** — Sprint work and commits go to `main`, never pushed. No release, no manifest version or README footer change.
- **D7** — EPIC-024 link ruled by the owner: this sprint hosts the trial, as SPRINT-165 did for row 1. Ticking row 2 stays a later owner ruling.

## Assumptions
- **A1** — Mermaid is the only output format. *Confirm: T1.*
- **A2** — No checker script, ledger or qa-check leg (ADR-053). *Confirm: T1, T2 gate.*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-166-evidence-backed-diagrams.md`. Append there, never here.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `skills/diagram/SKILL.md` | T1 · T3 | new skill: Mermaid with a source and status per id; update path | med | hand runs on lean-flow, a fixture and workdoo; Codex 2 rounds |
| `skills/diagram/references/evidence-record.md` | T1 · T3 | evidence row, status rules, self-check, updating | med | same runs; update fixture diffs |
| `.claude/CLAUDE.md` · `.claude/CONTEXT.md` · `README.md` · `docs/architecture/overview.md` · `SECURITY.md` | T2 | roster 15 → 16, CONTEXT trimmed to fit the token budget | low | stale-count and roster greps; doc-caps |
| `evals/run-layout-fixtures.ts` · `CHANGELOG.md` · 2 templates | T2 | eval list, Unreleased entry, pointers to /diagram | low | layout fixtures 41 pass; gate green on `7bfe5fca` |

## Retro

**Retrieval check** — one miss, the coordinator's. The orchestrator says to read CONTEXT.md's applicable rules before dispatch; the coordinator never opened it, so commit subjects broke the `sprint(NNN) Tn:` rule (CONTEXT.md § Gates, the L-151 family) and three `consequence ·` lines broke the review-depth vocabulary. The first full gate caught both: 5 fail. This is the stage-misses-a-fact case TASK-617 asks about; the owner rules on it in the verdict. L-130 was also in reach and missed: box 4 froze "workdoo is git-less" from memory.

**Cost** — coordinator on Opus; Sonnet workers for intake, promote and three builds; two Codex rounds on T1; two off-host gate runs. USD per box is not available at close; the operator reads it from the transcript for TASK-617.

**Worked**
- Decompose and promote each ran in one Sonnet worker. Their questions came back `blocked`, reached the owner by popup, and resumed the same agent id; the coordinator's draft review caught a wrong delta, a Mermaid line-style rule that cannot render, and five roster files the draft missed.
- Codex round 1 found three real defects in shipped text, including a close paraphrase of the kit; every 5-word run of the kit is now absent from the skill.
- Coordinator review caught what the workers' self-checks could not: an edge outranking its end, a wrong source on an edge into a vanished node, a lone non-UTF-8 byte, and status wording in README and CHANGELOG.
- The token budget held at 12688 of 12691 by trimming CONTEXT.md, with the budget file untouched.

**Friction**
- The gate failure above cost a history rewrite of 12 unpushed subjects (owner ruling) and an in-place fix of three log lines.
- 17 leftover agent worktrees forced T2 and T3 onto the shared tree instead of isolated worktrees.
- Codex round 2 left one item open, closed inline without a third round.
- G2 was signed at promote without the builder check.

**Pattern candidate** — L-294 (a stage that defers reading must still do the read); L-295 (check the encoding of a worker's scripted edit).
