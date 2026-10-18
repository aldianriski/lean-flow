---
id: TASK-441
sprint: SPRINT-127
title: "Run the sprint lifecycle without git: promote writes the snapshot, tick and close check against it"
epic: EPIC-022
priority: P1
size: M
risk: med
autonomy: HITL
class: execution
tier: G
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

- [x] The promote, tick and close procedures detect git; without it, promote writes each member's `## Done when` verbatim into the ✓ sprint-by-reference § Without git + promote/tick/close rows (`58755038`); Codex R2 CLEAR
      promote entry and sets `plan_commit: none (no git)`, and tick and close compare live text to that snapshot (a change needs a
      `scope-change` entry, as with git).
- [x] Status moves, `gates_signed`, close and archive each state their no-git form (plain moves, dates instead of shas); the ✓ moves · sign-off · close · archive · triage cancel name both forms (`58755038`, R1 fix `35117c5f`)
      git-required wording names the git case, never the only case.
- [x] The conformance engine's S9.PLANFROZEN "history unavailable" note names the promote-entry snapshot as where the frozen text ✓ note reworded, same note class; scratch git-less run prints it (`51f81f14`)
      lives — wording only, no verdict change.
- [x] S9.GATESWELLFORMED accepts `gates_signed: <GATE>[,…] @ <YYYY-MM-DD>` only when the repo has no git, with retained ✓ mechanical: gates-signed fixtures 11/11; seeds M1–M3 each redden only their case; M1 re-seeded by the coordinator, same result
      must-FAIL fixtures for both sides; no git repo's verdict moves (owner ruling at G2, logged as a scope-change).
- [x] Exercised on a scratch repo with no `.git`: one sprint goes promote → tick → close by the shipped procedures, a deliberate ✓ judgment: scratch promote → tick → frozen-box edit caught by snapshot diff → scope-change → close (builder evidence)
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
