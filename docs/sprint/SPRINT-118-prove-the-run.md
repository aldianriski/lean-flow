---
sprint: 118
slug: prove-the-run
epic: EPIC-015
owner: Maintainer
last_updated: 2026-10-09
status: closed
plan_commit: 901e7d6
update_trigger: sprint execute/close events
---

# SPRINT-118 — Prove the Run

> **Theme:** EPIC-015's first closing condition has been parked three times because no sprint produced a real unattended run
> (L-111). This sprint makes the run part of the plan: first a fire-time ledger, so a run that fires and dies is still on record,
> then one real `--mode overnight` run on a seeded all-J0/J1 vehicle, on the VPS. Two opportunistic checks ride on that run.

## Scope

**In:** the launcher's fire-time run ledger (`320`, TD-122 · TD-124) · one real unattended run that proves EPIC-015 Closed-when 1
(`319`) · the reaper on a genuinely partial Plan, if the run produces one (`188`) · the first real handoff through
`check-handoff-state.sh`, from the run's clean halt (`327`).

**Out (deferred):** EPIC-015's other open conditions (repair runs, typed outcomes, the two dogfoods, the re-armed freeze) ·
TASK-404 (engine spawn cost) · workdoo (another session) · any `git push` (owner-reserved).

## Members

- docs/work/todo/TASK-320-give-the-launcher-a-fire-time-run-ledger-closing-td-122-and-td-124-together.md
- docs/work/todo/TASK-319-prove-closed-when-1-with-a-real-unattended-run-against-the-repaired-reaper.md
- docs/work/todo/TASK-188-exercise-the-reaper-on-a-genuinely-partial-plan.md
- docs/work/todo/TASK-327-exercise-check-handoff-state-sh-on-the-first-real-handoff.md

## Plan

### T1 — Give the launcher a fire-time run ledger `[size: M · risk: med · class: execution · HITL · J1]`
Layers: `scripts/night-run.sh` · `scripts/lib/check-authority.ts` · `scripts/lib/check-sprint-by-reference.ts` · `evals/run-authority-fixtures.sh` · `evals/authority.test.ts` · `evals/run-by-reference-fixtures.ts`
  · `evals/run-night-run-gate-exception-fixtures.sh` · `evals/run-authority-differential.ts` · `evals/fixtures/`
  · `skills/orchestrator/references/night-run.md` (corrected by scope-change, see Execution Log)
  · `docs/work/in_progress/TASK-320-give-the-launcher-a-fire-time-run-ledger-closing-td-122-and-td-124-together.md`
  · `docs/work/done/TASK-320-give-the-launcher-a-fire-time-run-ledger-closing-td-122-and-td-124-together.md` (its own tick + move)
Depends-on: none
Cites: `TASK-320` · TD-122 · TD-124 · ADR-016 · `check-authority.sh` (the member names it; the frozen oracle, not edited, ADR-050 §3)

Tier G. Whether it is *consequential* G is ruled at G2 (ADR-050), defaulting up (ADR-029). It goes first so this sprint's run is on record
the moment it fires, even if the reaper never sees it (D2 covers the run itself).

**Acceptance:** a run that fires but never reaches the reaper is distinguishable on record from one that never fired, proven by a
retained must-FAIL fixture.

### T2 — Prove EPIC-015 Closed-when 1 with a real unattended run `[size: M · risk: high · class: execution · HITL · J2]`
Layers: `docs/sprint/` (the seeded vehicle Plan and its log; shape ruled at G2) · `docs/work/` (the vehicle's seeded member)
  · `docs/epic/EPIC-015-execution-autonomy.md`
Depends-on: T1
Cites: `TASK-319` · EPIC-015 Closed-when 1 · `skills/orchestrator/references/night-run.md` Part 1a (pre-flight) · SPRINT-090 (the seeded-vehicle method) · SPRINT-101 D2

J2: the owner fires the run and reads its result. The run targets a **seeded** vehicle Plan whose every task is J0/J1 (pre-flight
item 3 is strict), never real work re-declared AFK to make a run fire. It runs on the VPS (D1).

**Acceptance:** one `--mode overnight` run fires against the repaired reaper with `gates_signed:` recorded on its vehicle, and the
terminal-state agreement check passes against that run's committed log.

### T3 — Exercise the reaper on a genuinely partial Plan `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `scripts/night-run.sh` (only if the exercise finds a defect)
Depends-on: T2
Cites: `TASK-188` · SPRINT-098 D5

Opportunistic: it rides T2's run. If that run does not stop mid-Plan, this closes `unattempted` (D5), which is a valid outcome.

**Acceptance:** the reaper's handling of a run that stopped mid-Plan is observed on real input, or the task is recorded `unattempted`.

### T4 — Exercise the handoff check on the first real handoff `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `scripts/lib/check-handoff-state.sh` (only if a fix is needed) · `HANDOFF-LEDGER.md` (only if the handoff has no sprint pointer)
Depends-on: T2
Cites: `TASK-327` · `skills/handoff/SKILL.md` (the member names it `handoff/SKILL.md`; the writer under test, not edited) · STANDARD §12(b) · L-007

Opportunistic: the clean-halt `/handoff` of T2's run is the vehicle. Tier G, never run on live input before.

**Acceptance:** a real handoff record is written, `/prime` reports it, and close reconciles it to `spent`, all on live input.

## Owner-action checklist
- [x] Install the Claude CLI for the `ubuntu` user on the VPS, log in (`claude login`), and install lean-flow 2.1.0 there (D1). ✓ 2026-10-07: CLI 2.1.291 + plugin 2.1.0; logged in (claude.ai); smoke run SMOKE-OK
- [x] Fire T2's run and read its result (J2). ✓ 2026-10-07: the owner delegated the fire explicitly ("execute by you, i give you authorization"); fired 03:09:34Z, `ALIVE`, `PLAN_EXHAUSTED` · `DELIVERED`, $0.83

## Decisions (pre-locked)
- **D1** — The run executes on the VPS as `ubuntu`, kept apart from workdoo's service user and quota (owner, promote 2026-10-07).
- **D2** — T2's run is not gated on T3 or T4 being green; either may close `unattempted` (L-111, SPRINT-101 D2).
- **D3** — `scripts/night-run.sh` is shared by T1 and T3. Owner: T1 lands first; T3 edits it only if its exercise finds a defect.

## Assumptions
- **A1** — The VPS can run a headless Claude session with lean-flow 2.1.0 installed for `ubuntu`. *Confirm: the owner action above, then a one-line `claude -p` smoke run.*
- **A2** — The gate is green on the VPS, so `night-run.sh` will fire. *Confirm: last run `QA-CHECK: 307 pass, 0 fail` at `de21d7e`; re-run at pre-flight.*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-118-prove-the-run.md`, created lazily at the first entry (ADR-014).

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `scripts/night-run.sh` | T1 | writes a `fired · <ts> · <mode>` line to the resolved sprint's log before the command runs; refuses to fire with no sprint (TD-122) | Med | gate-exception fixtures case 13 + seeded breaks |
| `scripts/lib/check-sprint-by-reference.ts` | T1 | `--close` FAILs `CLOSE-FIRED-UNREAPED` on a `fired ·` line with no later reaped `terminal ·` line | Med | by-reference fixtures `134/0` |
| `scripts/lib/check-authority.ts` | T1 | reads a `fired ·` line as the written fact of an unattended run (TD-124); the old signals stay as a backstop | Med | `authority.test.ts`; differential 13/13 |
| `skills/orchestrator/references/night-run.md` | T1 | names the fire-time ledger and its close check where the adopter's run reads it | Low | Sonnet + Codex review CLEAR |
| `evals/` (5 harnesses + `fixtures/authority/fired-*` · `fixtures/by-reference/log-*fired*`) | T1 | must-FAIL fixture plus control per new check; `fired-*` excluded from the frozen `.sh` differential (ADR-050 §3) | Low | each seeded break reddens only its own claim-bearing cases |
| `docs/epic/EPIC-015-execution-autonomy.md` | T2 · close | rollup rows for 118/119; Closed-when 1 ticked | Low | `check-epic-archive` |
| `docs/work/{todo→done}/TASK-188 · 319 · 320 · 327` | T1–T4 | ticks with evidence, and the moves | Low | by-reference `--close` 10/0 |
| `docs/knowledge-index.md` | close | regenerated (L-232 was filed without it) | Low | `gen-index.sh --check` rc 1 → 0 |

## Retro

**Retrieval check:** one miss. L-218 (run the gate's cross-cutting legs after a merge, not just the task's own harness) did not reach the
close-sweep filing commit `b5662cff`. That commit added L-232 without regenerating the index, so system verify went red on
`knowledge index STALE`. L-229 (count 3, recorded at the sweep) is the other standing miss.

**Cost:** about 620k subagent tokens across the sprint (T1 ≈ 358k: builder 236k · Sonnet 82k · Codex 40k; the rest was the T2 pre-run
review and probes). The run itself cost $0.83, plus $0.40 of probes. The close session ran inline with no subagents and three VPS gate runs at
the sprint's integration points. Delivered: 4 of 4 members.

**Worked**
- **EPIC-015 Closed-when 1 is met on live input.** It had foreclosed three times (L-111): the vehicle was in the Plan this time, and the run
  fired on the VPS and reached `PLAN_EXHAUSTED` / `DELIVERED` with 0 permission denials. Every check was read from the committed log.
- **T1's ledger caught its own run.** `CLOSE-FIRED-UNREAPED` fired live, before the run's rollup existed, and was resolved by the reaper's block.
- **T4 closed on a real handoff** across two sessions: `live` → `/prime` reported it → `consumed` → `spent`, each read back by the checker.
- **Probe 2 changed one variable.** That turned probe 1's invalid must-deny control into a scoped proof (L-232).

**Friction**
- Three Layers corrections in one sprint (`.sh` → `.ts`; then prose-density and member-layers from the correction itself; then the tick
  commit subjects). Each was found by the gate, never by the scope-change entry that caused it (L-229, count 3).
- The headless run drifted from schemas it never reads: a `rollup` header, then free-form `consequence ·` lines, which produced two
  `review-depth-unclassified` FAILs (TD-233).
- TD-235 fired live this session: with two sprints active, sprint-bulk step 0 had to ask which one to run.

**ADR-021 override (recorded):** system verify at `e67be803` returned `324 pass, 3 fail`. `knowledge index STALE` was fixed (`9d2b88eb`). The two
`review-depth-unclassified` lines on SPRINT-119's log are kept verbatim by owner ruling (2026-10-07) as evidence of the run's drift. They are
closed under this override, which covers exactly those two lines (precedent SPRINT-098), and they leave the gate when SPRINT-119 is archived.

**Buckets (routed):**
- **Shipped:** `CHANGELOG.md` § SPRINT-118.
- **Tech debt:** TD-232–236, filed early at the sweep (`b5662cff`). TD-122 and TD-124 are resolved → TASK-320.
- **Follow-ups:** none new; the TDs carry them.
- **Learnings:** L-232 is new and L-229 is at count 3 (due a disposition re-check at the next promote). The L-218 miss above gets no
  new L, because it is the promoted rule not reaching a bookkeeping commit, the same family as L-229.

**Pattern candidate:** none new beyond the above.
