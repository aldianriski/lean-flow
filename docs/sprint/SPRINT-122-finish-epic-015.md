---
sprint: 122
slug: finish-epic-015
epic: EPIC-015
owner: Maintainer
last_updated: 2026-10-11
status: closed
plan_commit: d399167
gates_signed: G1,G2 @ d1341c4
update_trigger: sprint execute/close events
---

# SPRINT-122 — Finish EPIC-015

> **Theme:** EPIC-015 has four open conditions, and two of them are run-shaped proofs. This sprint makes a user-stopped run
> report itself, so CW6's last path emits the typed outcome (TASK-423). It then proves bounded unattended repair and Dogfood 2 in
> one real overnight run (TASK-415). TASK-417, which re-arms the freeze widened to governance and closes the epic, follows once
> both land: it is `blocked` on them and is not promotable yet.

## Scope

**In:** USER_STOP rollup emission (`423`) · one overnight vehicle run proving CW5 and Dogfood 2 (`415`).
**Out (deferred):** TASK-417 (blocked on this sprint) · TASK-404's engine cut · TASK-422 / 366 / 367 / 322 / 402.

## Members

- docs/work/todo/TASK-423-emit-the-run-outcome-rollup-on-a-user-stopped-run.md
- docs/work/todo/TASK-415-prove-bounded-unattended-repair-and-dogfood-2-in-one-overnight-run.md

## Plan

### T1 — A user-stopped run emits its rollup as USER_STOP `[size: M · risk: med · class: execution · HITL · J2]`
Layers: `scripts/night-run.sh` · `evals/fixtures/night-run-reaper/` · `evals/run-reap-terminal-fixtures.sh`
  · `docs/epic/EPIC-015-execution-autonomy.md` · `skills/orchestrator/references/night-run.md`
  · `docs/work/todo/TASK-423-emit-the-run-outcome-rollup-on-a-user-stopped-run.md`
  · `docs/work/in_progress/TASK-423-emit-the-run-outcome-rollup-on-a-user-stopped-run.md`
Depends-on: none
Cites: `TASK-423` · EPIC-015 CW6 · ADR-050 (Consequential G) · ADR-034 · TD-152 · TD-153
  · `scripts/lib/check-layers-observed.ts` (run, not edited) · `todo/` · `in_progress/` (member folders a scope-change names)

The launcher decides what an unattended run reports, so this is Consequential Tier G: the full bar, seeded breaks and a
worktree-isolated outside review. G2 rules how a user stop is told apart from a crash.

**Acceptance:** a user-stopped run's committed log carries `terminal · USER_STOP` with every CW6 field, and a crash still reads
HARD_FAILURE.

### T2 — Prove bounded unattended repair and Dogfood 2 in one overnight run `[size: M · risk: med · class: execution · HITL · J2]`
Layers: `docs/epic/EPIC-015-execution-autonomy.md` · `scripts/night-run.sh` · `evals/run-reap-terminal-fixtures.sh`
  · `evals/fixtures/night-run-reaper/`
  · `docs/work/todo/TASK-415-prove-bounded-unattended-repair-and-dogfood-2-in-one-overnight-run.md`
  · `docs/work/in_progress/TASK-415-prove-bounded-unattended-repair-and-dogfood-2-in-one-overnight-run.md`
Depends-on: T1
Cites: `TASK-415` · EPIC-015 CW5 · CW7 · D5 · ADR-022 · `scripts/lib/check-approval-envelope.sh` (run, not edited)

It runs after T1, so the vehicle run already carries the USER_STOP-capable launcher. The vehicle sprint (its Plan, envelope and
seeded J1/J2 tasks) and the files its J1 task touches are ruled at G2. If recon shows the overnight path cannot review and revise
unattended, the task stops for a scope ruling.

**Acceptance:** CW5 ticked and CW7's Dogfood-2 half recorded, each citing commit and log lines rather than the run's report.

## Owner-action checklist
- [ ] Sign G1 + G2 (`/orchestrator sprint-bulk`) and record `gates_signed:`. Settle T1's stop-vs-crash signal and T2's vehicle
      shape at G2.
- [ ] Sign T2's vehicle `approval_envelope:` (all ten dimensions) before the overnight run fires.

## Decisions (pre-locked)
- **D1** — `docs/epic/EPIC-015-execution-autonomy.md` is shared by T1 and T2. T1 lands first (`Depends-on`).
- **D2** — The interim governance restriction applies. T1 fixes a measured defect (USER_STOP produced by no path, found by
  SPRINT-121 T1). T2 is a proof run, not new machinery.

## Assumptions
- **A1** — The overnight path runs a reviewer and the bounded revise unattended under ADR-022's carve-out. *Confirm: G2 recon. If
  not, T2 stops for a scope ruling.*
- **A2** — The launcher can see a user interrupt (INT/TERM, or a wrapped exit status of 130/143). *Confirm: G2 recon of how the
  harness stops a run.*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-122-finish-epic-015.md`, created at promote (ADR-014; SPRINT-121 lesson).

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `scripts/night-run.sh` | T1 | `--wrap` traps TERM and leaves `<log>.stop`; reap() ranks it USER_STOP below the integrity fails | High | reap-terminal fixtures + 7 seeds + Codex ×2 |
| `scripts/night-run.sh` | T2 | the reaper's block copies the run's non-green lines; counters skip only its own entries (CRLF-safe) | High | reap-terminal fixtures + 6 seeds + Codex ×2; live re-reap |
| `evals/run-reap-terminal-fixtures.sh` | T1 · T2 | 7 wrapper cases + 10 block cases, each red under its own break | Med | the harness itself |
| `skills/orchestrator/references/night-run.md` | T1 | which pid to TERM so a stop reports USER_STOP; INT/HUP are ignored | Low | read-through (Codex C7 OK) |
| `docs/epic/EPIC-015-execution-autonomy.md` | T1 · T2 | CW6, CW5 and CW7 ticked with file:line and commit evidence | Low | rollup + epic checks |
| `TECH-DEBT.md` | close | TD-247 (Option A ruled) · TD-248 (narrowed) | Low | — |

## Retro

**Retrieval check:** mixed. The landing check (L-223's "cmp the seed landed") caught three seeds that never landed. Without it, two
green runs would have been read as "the fixture does not discriminate". The "diff the environments" rule (edit-safety (d)) resolved
the single-file vs gate disagreement on layers-observed. Two misses: I filed TD-248 on one query before reproducing the gate's own call
(L-130), and I read a gate log before its run finished (L-045). Both are logged as sightings on the family heads.

**Cost:** about 640k sub-agent tokens: one builder over six rounds (~205k), two seeding campaigns (~148k), four Codex rounds (~77k),
G2 recon (~62k) and a pre-run reviewer (~144k). Plus $1.32 for the overnight run and ~$0.3 of allowlist probes. 174 min of attended
wall clock (commit clock) to system verify.

**Worked**
- **The live run paid for itself.** SPRINT-123's first reaped AUTHORITY_BOUNDARY exposed a reaper defect that every fixture had missed:
  no fixture ever ran the guard on a reaper-written AUTHORITY_BOUNDARY block. It is the L-181 producer/consumer gap, and it was found
  only on real input (L-007).
- **Proving the seed before promote** (L-136's REACHES question) caught a seed that would never have fired: prose-density measures a
  table row by its longest cell.
- The pre-run review's two soft fixes (the retry-line shape; briefing the reviewer with the seed alone) are why the repair was counted
  and the park actually happened.

**Friction**
- My own bookkeeping reddened the pre-flight gate twice: scope-change entries naming undeclared paths, and `Tn:` subjects on member
  moves (L-151's family again, after SPRINT-121 named it).
- Shell-quoted seeds over ssh failed to land three times. A small script file shipped with `chr(92)` was what worked.
- Every review round found something real, and the stop rule held: T1 needed two rounds, the T2 reaper fix three including an inline fix.

**Pattern candidate:** none new; every item is a sighting on an existing family (A ×1 · B ×1 · C2 ×2 · E ×1).

**Buckets:** routed with vehicle SPRINT-123's (one run, one vehicle). Shipped → `CHANGELOG.md` § SPRINT-122 (unreleased). Debt → TD-247
(Option A ruled) · TD-248. Follow-ups → TASK-426 (`origin: close-retro`, TD-247 Option A). Learnings → sightings on L-130 · L-045 · L-166
(×2) · L-151. TASK-417 (CW8) is unblocked for the next promote.
