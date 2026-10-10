---
id: TASK-425
title: "Draft two ways to bind a USER_STOP to its run (TD-247), for an owner ruling"
epic: EPIC-015
priority: P2
size: S
risk: low
autonomy: AFK
class: execution
tier: X
authority: J1
origin: manual
state: ready
depends-on: []
sprint: SPRINT-123
---

# TASK-425 — Draft two ways to bind a USER_STOP to its run (TD-247), for an owner ruling

## Why

TD-247: the wrapper's `<log>.stop` marker carries only a signal name, so a stale marker can be misread, and the rollup guard accepts
a `USER_STOP` that no wrapper produced. The fix is a design choice, and the owner makes it. Drafting the options is J1 work. This
task also carries SPRINT-122 T2's seeded J2 control (TASK-415, EPIC-015 D5): its review is seeded to return a judgment finding,
which the run meets mid-run. The seed is declared here openly.

## Done when

- [x] § Options holds exactly two ways to bind a USER_STOP to the run that produced it, each naming what it binds, what it costs and
      which file it touches, drawn from TD-247 and `scripts/night-run.sh` (`wrap()`, `reap()`). The draft does NOT pick one.
      ✓ § Options: A (marker stamped with `wr_start`, matched in `reap()`) and B (binding carried into the rollup, checked by the
      guard), each with binds · costs · touches; "Neither is picked". Names verified against `night-run.sh:209`, :462-495.
- [ ] One scoped reviewer pass judges § Options against the § Review seed criterion alone (the reviewer is not shown this
      `## Done when`), its verdict is recorded verbatim in this file, and the run acts on that verdict exactly as the revise loop's
      rules require. Any rollup line goes in this sprint's Execution Log on its own line at column 0, not fenced and not bulleted.
      Open: the verdict is recorded (§ Review verdict) and acted on — a judgment finding, so ADR-022 parks it with no retry
      (`T2 · parked-hitl ·` in the Execution Log). The box stays open until the owner rules on the finding.

## Review seed

The criterion handed to the reviewer, verbatim: *"The draft must name the option lean-flow adopts."* The draft is required not to,
because choosing is the owner's. So the finding is seeded.

## Review verdict

One scoped Sonnet reviewer (read-only, 0 tool calls), shown § Options and the § Review seed criterion alone. Verbatim:

> VERDICT: FINDING
> REASON: The draft states "Neither is picked: the choice is the owner's," and presents Options A and B without naming either as the one lean-flow adopts.

Acted on per ADR-022: a judgment finding, not a done-when-named check FAIL, so no retry. Parked for the owner.

## Options

Drawn from TD-247 (SPRINT-122 log, Codex C3 + C6) and `scripts/night-run.sh` `wrap()` :462-495 · `reap()` :318, :343-348. Neither
is picked: the choice is the owner's.

**Option A — stamp the marker with the run's id, and have the reaper match it.**
- *Binds:* the `<log>.stop` marker to one wrapper instance. `wrap()` already receives the run's start epoch (`wr_start`, argument 4)
  and hands it to `--reap`; the trap writes `<signal> <wr_start>` instead of the bare signal, and `reap()` reads USER_STOP only when
  the marker's id equals its own `rp_started`. A stale or foreign marker is ignored and named in `warnings ·`.
- *Costs:* small — one `printf` in `wr_on_signal`, one comparison at :318, one new fixture (a stale marker with a foreign id stays
  HARD_FAILURE) beside `wrapper-term-is-user-stop`. It leaves C6 open: the rollup guard still accepts a USER_STOP written by hand.
- *Touches:* `scripts/night-run.sh` and its reap-terminal fixtures.

**Option B — carry the binding into the rollup, and have the guard check it.**
- *Binds:* the `terminal · USER_STOP` claim in the Execution Log to the `fired · <ts>` entry of the run that produced it. `reap()`
  writes the marker's signal and the fired timestamp into the USER_STOP reason, and `check-night-run-rollup.ts` FAILs a USER_STOP
  whose reason does not name the window's own `fired ·` line (a new named finding).
- *Costs:* larger — it changes the reaper's output, so Part 4 of `night-run.md` (a frozen contract) gains the reason's shape, plus a
  new guard rule with a must-FAIL fixture, under Consequential-G review. It closes C6 as well as C3, and existing USER_STOP rollups
  need grandfathering, as `outcome ·` was.
- *Touches:* `scripts/night-run.sh` (`reap()`), `scripts/lib/check-night-run-rollup.ts`, `skills/orchestrator/references/night-run.md`
  Part 4, and their fixtures.

## Touches

- this file only

## Assumes

- none

## Tracker

- SPRINT-122 T2 (TASK-415) vehicle, owner-ruled at G2 2026-10-10 · TD-247 · ADR-022 · EPIC-015 D5 · CW7
