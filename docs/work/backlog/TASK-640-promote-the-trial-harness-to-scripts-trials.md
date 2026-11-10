---
id: TASK-640
title: "Promote the trial harness from operator scratch to scripts/trials/ with a clean-clone check"
type: feature
epic: EPIC-024
priority: P2
size: M
risk: med
autonomy: HITL
class: execution
tier: G
authority: J1
origin: close-retro
state: ready
depends-on: []
---

# TASK-640 — Promote the trial harness from operator scratch to scripts/trials/ with a clean-clone check

## Why
Owner ruling at the SPRINT-170 close, verbatim: "Trial harness to scripts/ (#2)", to implement after the close. Every SPRINT-170 trial rebuilt or copied a harness that lives only in the operator's scratch folder: prep of scratch clones, launch with a spawn env object (L-305), snapshots before and after a run, the replay checker, the merge oracle, the probe checker and the agent-cost reader. A trial in a later sprint, or on another machine, starts from nothing. Codex's review asked for acceptance by a clean-clone replay and for preflight checks that catch the three failures this sprint hit: containment (a deny rule written in the wrong path form, L-299), command (bare `python` or `sleep`, L-300 and L-306) and baseline (a control gate that is not green).

## Done when

- [ ] `scripts/trials/` holds the reusable parts as TypeScript run by Bun (no new `.sh`): prep, launch with a spawn env, snapshot, replay check, merge oracle, probe check and cost reader. Sprint-specific fixtures, prompts and seeds stay out of the core, and a header line in each script says what the caller must supply.
- [ ] A clean-clone check: a fresh clone of `main` runs the harness's self-test or dry run to a printed pass, with no operator-scratch path and no network spend.
- [ ] A preflight reports a named finding for each of three seeded faults, one retained must-FAIL fixture each: a deny rule in the non-matching path form, a command that opens a REPL or is blocked, and a baseline gate that is not green. A control fixture stays green.
- [ ] Run on its real artifacts: the preflight and the merge oracle are pointed at SPRINT-170's recorded inputs (the merge oracle's O1, O2 and R1 PASS and its swapped-sets BAD MERGE case, from the Log) and give the same verdicts.
- [ ] Negative: a default run spends nothing (dry run by default; a paid run needs `--run` and a budget, as `jev-ab-judge.ts` does), reads no `.env` or key file (`bun --no-env-file`), and writes only inside its scratch repository.

## Touches
`scripts/trials/` (new), `test/` fixtures for the preflight, `CHANGELOG.md` (maintainer-only line).

## Assumes
- A1: the SPRINT-170 harness files are still in the operator's scratch folder (`scratchpad/s170/`: `harness.ts`, `merge-oracle.ts`, `replay-check.ts`, `probe-check.ts`, `agent-cost.ts`, `snap.ts`). Copy them before the folder is cleared; their content is not in the repository.
- A2: tier G is "other G" (maintainer-only legs); re-tier at G2 if a shipped skill names the harness as an adopter-run step.

## Tracker
SPRINT-170 close Retro · L-298 to L-307 · Codex recap review, candidate 3 (KEEP)
