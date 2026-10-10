---
sprint: 121
slug: cover-what-is-open
epic: EPIC-015
owner: Maintainer
last_updated: 2026-10-10
status: closed
plan_commit: 4d82a8f
gates_signed: G1,G2 @ fe339ee
update_trigger: sprint execute/close events
---

# SPRINT-121 — Cover What Is Open

> **Theme:** A full scan on 2026-10-10 found open work that nothing pointed at: four EPIC-015 conditions with no tasks, four
> workdoo epics filed in the wrong repository, 62 single-count learnings that never reach promotion, and a Windows engine cost with
> no profile. This sprint gives each of them a home, and it is run continuously as **EPIC-015's Dogfood 1**. Ranking and scope
> are from two Codex review rounds and the owner's rulings (2026-10-10).

## Scope

**In:** the CW6 ruling (`414`) · the ADR-044/048 rulings (`413`) · the engine profile (`421`) · the learnings cleanup (`419`) · the
active-epic coverage standard (`420`) · the workdoo epic move (`418`) · Dogfood 1 recorded on this sprint (`416`).
**Out (deferred):** the TASK-404 optimization (waits for `421`'s target) · TASK-415's overnight run and TASK-417's freeze ADR (the
next EPIC-015 steps) · bulk TD disposition · parking EPIC-007/011/012 · TASK-366/367/322/402.

## Members

- docs/work/todo/TASK-414-rule-epic-015-closed-when-6-met-on-sprint-119s-rollup.md
- docs/work/todo/TASK-413-rule-the-adr-044-and-adr-048-decision-edits-for-the-gated-level.md
- docs/work/todo/TASK-421-profile-the-shell-conformance-engines-spawn-sites-on-windows.md
- docs/work/todo/TASK-419-clean-up-the-learnings-ledger.md
- docs/work/todo/TASK-420-an-active-epics-open-conditions-must-each-map-to-a-task.md
- docs/work/todo/TASK-418-move-the-workdoo-epics-to-the-workdoo-store.md
- docs/work/todo/TASK-416-record-the-next-real-sprint-as-dogfood-1.md

## Plan

### T1 — Rule EPIC-015 CW6 on the SPRINT-119 rollup `[size: S · risk: low · class: decision · HITL · J1]`
Layers: `docs/epic/EPIC-015-execution-autonomy.md`
  · `docs/work/todo/TASK-414-rule-epic-015-closed-when-6-met-on-sprint-119s-rollup.md` · `docs/work/in_progress/TASK-414-rule-epic-015-closed-when-6-met-on-sprint-119s-rollup.md` · `docs/work/done/TASK-414-rule-epic-015-closed-when-6-met-on-sprint-119s-rollup.md`
Depends-on: none
Cites: `TASK-414` · EPIC-015 CW6 · `scripts/night-run.sh` (read, not touched) · TD-152 · TD-153

A ruling on evidence that already exists: map every field, then check the emitter's code on every terminal path.

**Acceptance:** CW6 is ticked with file:line evidence for each field and each path, or it stays open with the gap filed.

### T2 — Rule the ADR-044 and ADR-048 Decision edits `[size: S · risk: low · class: decision · HITL · J1]`
Layers: `docs/adr/` · `docs/DECISIONS.md`
  · `docs/work/todo/TASK-413-rule-the-adr-044-and-adr-048-decision-edits-for-the-gated-level.md` · `docs/work/in_progress/TASK-413-rule-the-adr-044-and-adr-048-decision-edits-for-the-gated-level.md` · `docs/work/done/TASK-413-rule-the-adr-044-and-adr-048-decision-edits-for-the-gated-level.md`
Depends-on: none
Cites: `TASK-413` · STANDARD §4 · `S4.APPEND` · `conformance.sh`

The owner rules one path per ADR after reading both diffs against `f1efa36b` and `3e725ef4`.

**Acceptance:** `sh conformance.sh .` reports 0 `S4.APPEND` findings.

### T3 — Profile the engine's spawn sites on Windows `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `docs/research/logs/qa-gate-timing.md` · `docs/work/backlog/TASK-404-cut-the-shell-conformance-engines-per-file-process-spawning.md`
Depends-on: none
Cites: `TASK-421` · TD-168 · `TASK-404`

A measurement only, with no engine code changed. It is the data TASK-404's target is set from.

**Acceptance:** a new timing Round names the hottest spawn sites, and their figures reconcile to the whole-run wall clock.

### T4 — Clean up the learnings ledger `[size: M · risk: low · class: execution · HITL · J1]`
Layers: `docs/LEARNINGS.md` · `scripts/qa-check.sh` · `evals/fixtures/learnings-metadata/` · `evals/run-learnings-metadata-fixtures.ts`
  · `docs/knowledge-index.md`
  · `docs/work/todo/TASK-419-clean-up-the-learnings-ledger.md` · `docs/work/in_progress/TASK-419-clean-up-the-learnings-ledger.md`
Depends-on: none
Cites: `TASK-419` · LEARNINGS § disposition (TASK-384) · L-198

Close the metadata lint gap with a must-FAIL fixture first, then repair the entries. The family merges follow G2's sign-off on
membership.

**Acceptance:** the gate FAILs on a missing body `count:`, and every ≥2 family is folded through `disposition: merge`.

### T5 — Active-epic coverage standard `[size: M · risk: med · class: decision · HITL · J1]`
Layers: `spec/STANDARD.md` · `spec/CHANGELOG.md` · `skills/lean-doc-generator/` · `skills/triage/` · `skills/prime/`
  · `.claude/CONTEXT.md` · `README.md` · `CHANGELOG.md` · `evals/fixtures/epic-coverage/`
  · `docs/work/todo/TASK-420-an-active-epics-open-conditions-must-each-map-to-a-task.md` · `docs/work/in_progress/TASK-420-an-active-epics-open-conditions-must-each-map-to-a-task.md`
Depends-on: none
Cites: `TASK-420` · L-151 · L-015 · L-020 · ADR-006

A shipped skill change, so it gets the Codex review loop. G2 rules how a task names the condition it serves.

**Acceptance:** run on this repo, the procedure reports EPIC-015 fully covered; a seeded copy missing one task reports exactly that
condition.

### T6 — Move the workdoo-built epics to workdoo `[size: M · risk: med · class: execution · HITL · J1]`
Layers: `docs/epic/` · `docs/adr/` · `docs/research/adlc-epic-sequencing.md` · `scripts/lib/prose-density-baseline.txt`
  · `docs/adr/ADR-041-platform-repo-service-boundary.md` · `docs/adr/ADR-045-the-work-item-store.md` · `docs/DECISIONS.md`
  · `docs/work/todo/TASK-418-move-the-workdoo-epics-to-the-workdoo-store.md` · `docs/work/in_progress/TASK-418-move-the-workdoo-epics-to-the-workdoo-store.md`
Depends-on: T1 (shares `docs/epic/`) · T2 (shares `docs/adr/` and `docs/DECISIONS.md`, D2)
Cites: `TASK-418` · ADR-041 · EPIC-016 · EPIC-018 · EPIC-019 · EPIC-020 · workdoo `.claude/CLAUDE.md` · workdoo `AGENTS.md` (other repo)

Same ids in workdoo's `docs/epic/`, with relation pointers here. workdoo's attribution rule is checked before its commit, because
its SPRINT-012 is active.

**Acceptance:** the four files live only in workdoo, and both repositories' gates are green.

### T7 — Record this sprint as Dogfood 1 `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `docs/epic/EPIC-015-execution-autonomy.md` · `docs/sprint/logs/SPRINT-121-cover-what-is-open.md`
Depends-on: T1 · T2 · T3 · T4 · T5 · T6
Cites: `TASK-416` · EPIC-015 CW7

The other six run in attended `sprint-bulk` with no confirmation between authorized tasks. This task reads the log that run left.

**Acceptance:** EPIC-015 CW7's Dogfood-1 half is recorded as proven, citing this sprint's log.

## Owner-action checklist
- [x] Sign G1 + G2 (`/orchestrator sprint-bulk`) and record `gates_signed:`. ✓ 2026-10-10, see the g2 entry. At G2, settle every J2 ruling up front (T1 evidence, T2
      paths, T4 family membership, T5 condition-naming, T6 move shape), then re-declare each settled task J1 so the run is continuous
      (Dogfood 1).

## Decisions (pre-locked)
- **D1** — `docs/epic/EPIC-015-execution-autonomy.md` is shared by T1 and T7, and `docs/epic/` by T6. Order: T1 → T6 → T7, one
  owner at a time.
- **D2** — `docs/DECISIONS.md` and `docs/adr/` are shared by T2 and T6, on disjoint ADR files. T2 lands first, and every commit is
  staged per hunk.
- **D3** — The interim governance restriction (`adlc-epic-sequencing.md`, 2026-10-10) applies. T4's lint and T5's rule are admitted
  as fixes for measured defects (3 entries slipped the lint; EPIC-015 sat uncovered). Neither adds a conformance-engine rule.

## Assumptions
- **A1** — Every J2 ruling can be taken at G2, before execution. *Confirm: G2. A ruling that needs execution output (T3's target,
  for one) is out of this sprint by construction: TASK-404 keeps it.*
- **A2** — workdoo's commit gate accepts a docs-only `docs/epic/` commit mid-sprint. *Confirm: T6 recon, before any workdoo commit.*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-121-cover-what-is-open.md`, created lazily at the first entry (ADR-014).

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `docs/adr/ADR-044-…` · `ADR-048-…` | T2 | accepted § Decision restored; corrections moved to appended § Correction (S4.APPEND) | Low | VPS conformance `PASS S4.APPEND`; scoped review 6/6 |
| `docs/research/logs/qa-gate-timing.md` · `TASK-404` | T3 | Round 23 profile; TASK-404 target recorded | Low | per-rule sum vs whole 0.2%; spawn model within 6% |
| `docs/LEARNINGS.md` · `scripts/qa-check.sh` · `evals/run-learnings-metadata-fixtures.ts` · `evals/fixtures/learnings-metadata/` | T4 | body-metadata lint (active entries); L-209/210/211 repaired; 58 entries folded into 10 families | Low | 5 fixtures 5/0; real ledger red→green; `PASS S11.LEARNINGS` |
| `spec/STANDARD.md` (0.15.0) · `spec/CHANGELOG.md` · `skills/{lean-doc-generator,triage,prime}/` · `references/epic-coverage.md` · CONTEXT · README · CHANGELOG · `evals/fixtures/epic-coverage/` | T5 | active-epic coverage rule (consumer-facing) | Med | fixtures 5/5; live EPIC-015 fully covered; Codex r1 7/7 + 2 fixed, r2 RESOLVED |
| `docs/epic/` (4 removed, INDEX) · `docs/adr/ADR-052-…` (new) · ADR-041 marker · DECISIONS · sequencing register · prose-density baseline; workdoo `docs/epic/` · `.claude/CLAUDE.md` · `AGENTS.md` | T6 | workdoo-built epics moved; ADR-052 amends ADR-041 | Med | scoped review 7/7; lean-flow 297/0; workdoo 3/4 (known Windows TD) |
| `docs/epic/EPIC-015-execution-autonomy.md` | T5/T7 · coord | coverage marks on open lines; SPRINT-121 row | Low | coverage walk 4 = 4 + 0 |

## Retro

**Retrieval check** — yes, three times. **L-151** (a record its reader can't reach) recurred in three forms while promoted and
loaded: the promote checklist lived only in chat, coordinator-owned member moves went under `Tn:` subjects, and consequence lines used
`med`, a token the checker can't read. **L-130** recurred too: the doc-aging census was asserted from memory and missed the
TASK-327 prune. All four are logged as sightings on the family heads, not as new entries, which is the consolidation T4 built,
working on its first day. One retrieval **worked**: ADR-041 was read before the workdoo move was offered (L-220), and it turned a
silent reversal into ADR-052.

**Cost** — inline coordinator plus 9 sub-agent runs (2 G2 recon, 3 builders, 2 scoped reviewers, 2 Codex rounds): **~622k
sub-agent tokens**, against the G2 estimate of 1.5–2.5M. Wall clock 88 min from gate sign-off to the rollup. 7 of 7 units delivered,
~89k tokens per unit. One bounded repair cycle (T5).

**Worked**
- Settling every J2 ruling at G2 and re-declaring J1 made the run continuous (Dogfood 1). The mid-run pauses were all new facts,
  never permission between tasks.
- The pre-delegated tick rule on T1 produced an honest "not met" (USER_STOP), not a tick on one run's evidence.
- Packet-fed Codex review: two real findings in round 1, both resolved in one bounded round 2.

**Friction**
- My own bookkeeping produced most of the system-verify reds: no log at promote, `Tn:` subjects on member moves, an invalid
  vocabulary, a stale member J-class. Each is cheap alone, and together they cost two verify rounds.
- The Windows host can't finish the bare gate (truncated at ~520 s in both builders). Every real verdict came from the VPS.
- I ran a heavy command on the host during T3's timing window. The run was discarded and redone.

**Pattern candidate** — none new. Every friction above is a sighting of an existing family (E · A · F · G). The three survivors at
count ≥ 2 (L-185 now ×8, L-219 ×5, L-217 ×4) go to the next promote's checkpoint, as the owner ruled.
