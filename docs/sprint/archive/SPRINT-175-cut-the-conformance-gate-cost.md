---
sprint: 175
slug: cut-the-conformance-gate-cost
owner: Maintainer
last_updated: 2026-11-14
status: closed
plan_commit: 621e9f10
close_commit: bb7ea926
gates_signed: G1,G2 @ 1225b1cd
update_trigger: sprint execute/close events
---

# SPRINT-175 — Cut the Conformance Harness's Share of the Gate

> **Theme:** Workflow code only, nothing for workdoo (owner ruling, 2026-11-13). The conformance harness's single-family cases run the engine on the full 100-rule spec: 38 calls and 164.8 s of a gate that sits on its 520 s budget (timing log, Round 25).
> They move to reduced specs derived at run time, with no assertion lost and the engine untouched.

## Scope

**In:** the reduced-spec change to the conformance harness, its proof and its measurement (TASK-661)
**Out (deferred):** any workdoo work · TASK-367, blocked on TASK-661 until the gate is re-measured · any change to the engine or the spec reader (ADR-043) · EPIC-025's open release condition, an owner action (push v2.23.0)

## Members

- docs/work/todo/TASK-661-run-single-family-conformance-cases-on-a-reduced-spec.md

## Plan

### T1 — Run the single-family conformance cases on a reduced spec `[size: M · risk: med · class: execution · HITL · J2]`
Layers: `evals/run-conformance-engine-fixtures.sh` · `docs/research/logs/qa-gate-timing.md` · `TECH-DEBT.md`
Depends-on: none
Cites: TASK-661, TD-171, ADR-043, ADR-050, ADR-053, `spec/STANDARD.md` · `scripts/lib/conformance-engine.sh` · `scripts/lib/read-spec-rules.sh` · `conformance.sh` (read, and proven byte-identical, never edited)
The harness already derives reduced specs for other cases, so the change reuses that mechanism. The engine and the spec reader stay byte-identical. One step owns all eight Done-when boxes.

**Acceptance:** the single-family cases run on specs derived from `spec/STANDARD.md` at run time, every PASS name is kept, and the measured gate fits its budget or the figures are recorded for the owner.

## Owner-action checklist

- [ ] No owner action at promote. Pushing v2.23.0 stays owner-reserved and outside this sprint.

## Decisions (pre-locked)

- **D1** — Tier G consequential (ADR-050): the harness guards an engine file `conformance.sh` executes. Built by Codex in a worktree, with a worktree-isolated outside review; G2 review cap two rounds (ADR-053).
- **D2** — One task, so no shared-file ownership to map.
- **D3** — No epic and no stream. The task cuts gate runtime on a harness EPIC-025 already protects; it does not advance that epic's bookkeeping outcome.

## Assumptions

- **A1** — The Windows host has at least 3 GB free and is quiet for the measuring runs. *Confirm: at each run.*
- **A2** — The off-host `QA_FULL=1` gate is reachable. The network dropped several times on 2026-11-13; a dropped read-back is resolved by reading the result files on the runner. *Confirm: at system-verify.*

## Execution Log

> **Lives in its own file** — [`logs/SPRINT-175-cut-the-conformance-gate-cost.md`](logs/SPRINT-175-cut-the-conformance-gate-cost.md). Append there, never here (STANDARD §9).

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `evals/run-conformance-engine-fixtures.sh` | T1 | 31 single-family engine calls run on run-time-derived reduced specs; `spec_keeps` guards all four reduced specs; 7 full-spec calls keep their reason beside them | med | 98→100 PASS by name · 31/31 parity · 8 seeds · Codex CLEAR · off-host 229/0 |
| `TECH-DEBT.md` | T1 | TD-171 corrected with Round 25's 83/17 split, second lever done; TD-117 Round 26 sighting (close) | low | read-through |
| `docs/research/logs/qa-gate-timing.md` | T1 | Round 26: harness −46% on the VPS; Windows gate still truncated on a loaded host | low | figures from the runs |
| `docs/work/done/TASK-661-…` | coord | population trace, 8 ticks with evidence, moved to done | low | `grep -c '^- \[x\]'` = 8 |

## Retro

**Verdict.** TASK-661 is done, 8 of 8 boxes ticked. The 31 single-family calls in the conformance harness now run on specs derived from `spec/STANDARD.md` at run time. Every reduced spec is guarded by name, every PASS name is kept, and the engine is byte-identical. On the VPS the harness went 11.48 s → 6.15 s (−46%). The Windows default-profile gate was still truncated in both runs on a loaded host (552 s, 662 s against 520 s). The owner accepted the recorded figures (box 5's fallback), so TASK-367's budget question stays open with Round 26 as its input.

**Delivery.** Codex built the edit in a worktree (66.5k tokens). The coordinator ran the population trace, parity, seeds, gates and measurements. A Codex read-only outside review was CLEAR in round 1 (12.1k tokens). No release: the change is maintainer-only (`evals/`), with no consumer surface.

**Measured.** From `plan_commit^` to the close there are 10 commits: 3 are task work (`sprint(175) T1:`) and 7 are coordinator bookkeeping (`sprint(175):`), this close included, for 1 member. System verify off-host `QA_FULL=1` on `81f6ca13`: `QA-CHECK: 229 pass, 0 fail`, `bun test` 621 pass, 0 fail.

**Retrieval check.** Yes, the cross-check rule fired twice. The population count was reconciled against Round 25's census (38 = 25 + 6 + 7) and the `s11_check` count against a second selector (11 sites plus loops gives 23). L-238 also fired at authoring time: a `T1:` commit that carried the Log was split into a task commit and a coordinator commit before anything ran on it.

**Worked**
- The trace-then-brief split held. Codex's edit matched the brief line for line, and parity plus the seeds found nothing to fix.
- Seed s8 showed that detection does not rest on the guard call alone: the guard's control fixture also names a dropped row.
- Asking the owner for the host split, rather than skipping the box, kept the measurement honest. The VPS gave a clean same-host before/after, and Windows gave the budget verdict.

**Friction**
- Box 5's quiet-host precondition (at least 3 GB free, nothing else running) was not reachable without closing the owner's other sessions. It was written at intake as if the host were free.
- Gate run 2 also FAILed `run-doc-caps-fixtures.sh` with `bun test exit 1` and no output. The harness passed alone straight after (63 tests, 12 s) and in run 1, so it is a load failure, recorded on TD-117.
- The session ran on a stale installed plugin (2.21.0 against 2.23.0), so the 2.23.0 close procedure was read from the repo source rather than invoked.

**Routing**
- Shipped: nothing consumer-facing, so no CHANGELOG entry. The harness is maintainer-only (overview § `evals/`).
- Tech debt: no new row. TD-117 gets a Round 26 sighting (a loaded host still overruns, plus a doc-caps load FAIL). TD-171 now carries only its first lever (porting fixture construction, a sixth of the harness).
- Follow-ups: none filed. TASK-367's blocker is done, so `/triage` re-states it with Round 26 as input.
- Learnings: no new entry. The quiet-host friction is a precondition the owner ruled on, seen once.
