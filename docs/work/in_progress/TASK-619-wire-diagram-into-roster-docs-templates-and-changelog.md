---
id: TASK-619
title: "Wire /diagram into the roster, docs, templates and changelog so installers can find it and the loop points to it"
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
depends-on: [TASK-618]
---

# TASK-619 — Wire /diagram into the roster, docs, templates and changelog so installers can find it and the loop points to it

## Why
A new skill that is not in the roster, README or the templates that draw diagrams is present but never fires (wiring rule).

## Approved design
Touch set, derived with two queries (a "15 skills" grep and a roster-name grep on `humanizer` / `refactor-advisor`); the worker re-derives it:
- `.claude/CLAUDE.md` lines 15 and 25.
- `.claude/CONTEXT.md` roster table.
- `README.md` line 9 and line 491 (its breakdown "/flow conductor + 12 stages + /council + /humanizer" needs a new shape) and the README skill list.
- `docs/architecture/overview.md` line 31 plus the skill list near line 36.
- `SECURITY.md` per-skill table near line 29: /diagram runs read-only git, so it takes a row in the right category, not "No shell at all".
- `evals/run-layout-fixtures.ts` near lines 349 and 358 (comment says 15; the list names skills).
- `CHANGELOG.md` under `## [Unreleased]` (convention confirmed: `docs/changelog/` holds only rotated per-version files).
- Template pointers: one comment line in `architecture-data-flow.md.template` and `flows.md.template` (and `database-erd.md.template` if it fits), saying to run /diagram to draw it from code with a source and status per component and edge. Check template caps and conformance first; keep the line inside the existing HTML comment block.
- `skills/flow`, `skills/orchestrator` and `dispatch.md` name `refactor-advisor` in rosters. Check whether any job really triggers /diagram; today none does (standalone utility), so no chain is added, and the report names the files checked.

## Done when
- [x] Every file in the touch set reads 16 skills or lists /diagram as appropriate; the count is derived with `ls skills`, not remembered; a second grep for stale "15 skills" and a roster-name grep both come back clean. ✓ ls skills gives 16; stale-count grep clean outside history; roster grep finds /diagram in README, CONTEXT, overview, SECURITY and the eval list
- [x] The off-host gate (`bun test`, `QA_FULL`) passes. ✓ VPS gate on 7bfe5fca: bun test 589 pass 0 fail, QA-CHECK 477 pass 0 fail (first run on 1b5ccb91 was red, 5 fail, fixed and logged)
- [x] Wiring: in a real fresh session with the plugin loaded from the build, the prompt "draw the architecture of this repo" loads /diagram; the transcript shows which skill loaded. ✓ claude -p with --plugin-dir on main in workdoo loaded Skill lean-flow:diagram; init shows lean-flow@inline 2.21.0, no shadowing
- [x] Template pointers are in the data-flow and flows templates, and the template checks stay green. ✓ pointers inside the existing comments of the data-flow and flows templates; doc-caps, bun test and layout fixtures 41 pass
- [x] Negative: `git diff` shows no change to any manifest `"version"` or the README footer, and every commit from this task still appears in `git log origin/main..HEAD`, so nothing was pushed; the check is run and its output read. ✓ git diff 3b2c5170..HEAD on the three plugin manifests is empty, README footer unchanged; every sprint commit is in origin/main..HEAD

## Touches
The list under Approved design.

## Assumes
- No new check or ledger field; the eval list in `run-layout-fixtures.ts` is data the worker updates.
- Edits to shared SSOT files are serialised and each table re-read after editing.

## Tracker
Follows TASK-618; owner answer that existing templates point to /diagram.
