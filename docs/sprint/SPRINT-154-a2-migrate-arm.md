---
sprint: 154
slug: a2-migrate-arm
stream: s1-discovery
epic: EPIC-023
owner: Maintainer
last_updated: 2026-11-01
status: active
update_trigger: sprint execute/close events
---

# SPRINT-154 — A2: Migrate Arm

> **Theme:** EPIC-023's S1 condition ends on "arm A2 measured vs A1". The A1 snapshots carry 2.x docs, so A2 sets up through a
> real `migrate` at S1's close commit, runs its 32 trials under its own amendment and its own log, and is ruled by the
> pre-registered procedure. S3's arms then compare against it (EPIC-023 D10).

## Scope

**In:** the A2 setup on both A/B snapshots through a real `migrate` (owner-driven, cue sheet), Amendment 6 with the S1 pin,
32 trials in a separate log, and the A2 vs A1 ruling (T1, TASK-555).
**Out (deferred):** S3's intake (`/task-decomposer --epic EPIC-023`, after A2 is measured) · any change to S0's log or its
freeze lines · the consumer-docs work (stream codex-pilot, SPRINT-155).

## Members

- docs/work/todo/TASK-555-run-arm-a2-on-both-ab-repos-and-record-it-against-a1.md

## Plan

### T1 — Set up, freeze and run arm A2, then rule it against A1 `[size: M · risk: high · class: execution · HITL · J2]`
Layers: `evals/ab/` · `docs/research/logs/ab-measurements-a2.md`
  · `docs/work/todo/TASK-555-run-arm-a2-on-both-ab-repos-and-record-it-against-a1.md`
  · `docs/work/in_progress/TASK-555-run-arm-a2-on-both-ab-repos-and-record-it-against-a1.md`
  · `docs/work/done/TASK-555-run-arm-a2-on-both-ab-repos-and-record-it-against-a1.md`
Depends-on: none
Cites: TASK-555 · `docs/epic/EPIC-023-specific-not-short.md` § Decisions (D6, D10) · `evals/ab/PREREGISTRATION.md` § 2 (later arms)
S1 ships as a MINOR only once its own arm passes (D6), and S3 now measures against A2 (D10). The setup is the real upgrade
path, `migrate` on the 2.x snapshots (owner ruling 2026-11-01), so box 1 is reworded by a `scope-change` entry right after
this plan locks. Paid runs, maintainer-only, never a gate.

**Acceptance:** A2's 32 slots are scored under a signed Amendment 6 in their own log, and the log records A2 against A1 with
the pre-registered ruling.

## Decisions (pre-locked)

- **D1** — A2's setup is `/lean-doc-generator migrate`, not `init`. The owner drives each session from a cue sheet built from
  `evals/ab/answers/`, answering verbatim; an unanswered topic is answered `Not decided yet` (owner ruling 2026-11-01).
- **D2** — Amendment 6 freezes A2 with the plugin pinned at S1's close commit `82990174`. A2 writes to
  `docs/research/logs/ab-measurements-a2.md` with its own freeze line, so S0's log stays closed (owner ruling 2026-11-01).
- **D3** — While A2's trials measure wall time, this machine runs no build, gate or selftest; stream codex-pilot pauses then.

## Assumptions

- **A1** — `run-baseline.ts` takes `--schedule` and `--log`, so A2 needs no driver change. *Confirm: its argument parsing (checked
  2026-11-01).*
- **A2** — `migrate` on a 2.x snapshot cites the business topics from the existing `docs/product/requirements.md` instead of
  asking them (spec 0.18.2). *Confirm: the first owner session's transcript.*

## Execution Log

> **Lives in its own file** — [`logs/SPRINT-154-a2-migrate-arm.md`](logs/SPRINT-154-a2-migrate-arm.md)
> (STANDARD §9 · ADR-014). Append there, never here.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro
<!-- Written at close. Route the buckets to durable homes (STANDARD §10):
     shipped → CHANGELOG.md (root; legacy docs/) · tech debt → TD-NNN · follow-ups → TASK-NNN · learnings → docs/LEARNINGS.md.
     After close, the file moves → docs/sprint/archive/ + a one-line entry in docs/sprint/INDEX.md (§11). -->
