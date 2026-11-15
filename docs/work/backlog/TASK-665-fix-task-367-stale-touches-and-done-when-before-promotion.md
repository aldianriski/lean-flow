---
id: TASK-665
title: "Fix TASK-367's stale Touches and Done-when before it is promoted"
priority: P2
size: S
risk: low
autonomy: HITL
class: execution
tier: P
authority: J1
origin: close-retro
state: ready
depends-on: []
---

# TASK-665 — Fix TASK-367's stale Touches and Done-when before it is promoted

## Why

The owner kept TASK-367 out of SPRINT-176 on 2026-11-15 ("Keep out (Recommended)") on the condition that its Touches and Done-when are fixed first. Read at SPRINT-176 close, TASK-367 still carries text that the 2026-11-14 triage ruling and SPRINT-175 overtook, so a builder promoted onto it would build against dead paths and an open question that is already closed.

## Done when

- [ ] TASK-367's `## Touches` names only paths that exist: `evals/run-night-run-gate-exception-fixtures.sh` does not exist today (the night-run fixtures are `evals/run-night-run-rollup-fixtures.sh` and `evals/night-run-rollup.test.ts`), and `ADR-042` is cited by its file `docs/adr/ADR-042-the-command-ceiling-is-a-foreground-limit.md`, not as a path.
- [ ] TASK-367's Done-when box (a) names the `--detached` flag the owner ruled ("--detached flag (Recommended)", 2026-11-14), not "a flag or an env var".
- [ ] TASK-367's `## Why` state note ("the detachment signal's shape is the open question") and its `:589` line reference are corrected to the ruled shape and the current gate call site, and `depends-on: [TASK-661]` is cleared (TASK-661 is in `done/`, SPRINT-175).
- [ ] The retained fixtures in box (d) say whether they are TypeScript tests or the existing `.sh` harness, per the no-new-shell-scripts ruling; the choice is recorded, not assumed.
- [ ] TASK-367's `## Tracker` no longer cites the deleted TD-084 and TD-175 as live rows, and its `## Assumes` no longer says the detachment question is UNCONFIRMED: it points at the 2026-11-14 owner Decision (box added by owner popup 2026-11-15, "Add a box to TASK-665 (Recommended)").

## Touches

docs/work/backlog/TASK-367-let-the-caller-declare-detachment-so-the-pre-flight-gate-can-run-complete.md (the one file; a backlog task, not a sprint member, so no freeze applies)

## Assumes

- TASK-367 stays in the backlog until this lands; it is promoted in a later sprint, not SPRINT-176.
- The ruling text lives in TASK-367's own `## Decision` section; nothing new is decided here.

## Tracker

SPRINT-176 close Retro (follow-up); owner ruling 2026-11-15, "Keep out (Recommended)".
