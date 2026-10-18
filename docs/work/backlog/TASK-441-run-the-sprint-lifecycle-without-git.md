---
id: TASK-441
title: "Run the sprint lifecycle without git: promote writes the snapshot, tick and close check against it"
epic: EPIC-022
priority: P1
size: M
risk: med
autonomy: HITL
class: execution
tier: P
authority: J1
origin: decomposer
state: ready
depends-on: [TASK-440]
---

# TASK-441 — Run the sprint lifecycle without git

## Why

ADR-054 says what a git-less freeze is; the shipped procedures still say `git mv` · `plan_commit` · `git show <sha>:<file>` at every
step. An adopter without git needs the same promote → execute → close to complete, by the procedure alone.

## Done when

- [ ] The promote, tick and close procedures detect git; without it, promote writes each member's `## Done when` verbatim into the
      promote entry and sets `plan_commit: none (no git)`, and tick and close compare live text to that snapshot (a change needs a
      `scope-change` entry, as with git).
- [ ] Status moves, `gates_signed`, close and archive each state their no-git form (plain moves, dates instead of shas); the
      git-required wording names the git case, never the only case.
- [ ] The conformance engine's S9.PLANFROZEN "history unavailable" note names the promote-entry snapshot as where the frozen text
      lives — wording only, no verdict change.
- [ ] Exercised on a scratch repo with no `.git`: one sprint goes promote → tick → close by the shipped procedures, a deliberate
      edit to a frozen box is caught against the snapshot, and the close completes.

## Touches

- skills/lean-doc-generator/SKILL.md · skills/lean-doc-generator/references/sprint-by-reference.md ·
  skills/orchestrator/SKILL.md · skills/orchestrator/references/dispatch.md · skills/triage/SKILL.md ·
  scripts/lib/conformance-engine.sh (one note string)

## Assumes

- An engine rule that reads the snapshot is out of scope (owner ruling 2026-10-18): filed as debt at close, for the first real
  git-less adopter that needs it.

## Tracker

- EPIC-022 Closed-when 6 · ADR-054 (TASK-440)
