---
sprint: 165
slug: side-handoff-and-conformance-line
epic: EPIC-024
owner: Maintainer
last_updated: 2026-11-07
status: closed
gates_signed: G1,G2 @ 0a106887
plan_commit: 6b12630a
close_commit: b63a9acc
update_trigger: sprint execute/close events
---

# SPRINT-165 — A Home for Side-Session Handoffs, and the Conformance Line

> **Theme:** the host sprint for EPIC-024 row 1. Two small debt fixes give the worker contract and dispatch standard real build work:
> a side session's handoff gets a stub `/prime` can see (TD-298), and the gate names its conformance findings beside its tally (TD-081).

## Scope

**In:** a stub home for a handoff unrelated to the active sprint, reported by `/prime` (TASK-614); a separate gate line naming the conformance engine's informational finding count (TASK-615).
**Out (deferred):** TASK-613 and row 1's verdict, which stay with the launching session (a non-sprint commit here would fail the close check); a release; any edit to the trial branch; changing the verdict line, `scripts/qa-verdict.ts` or `scripts/gate-remote.ts`.

## Members

- docs/work/todo/TASK-614-give-a-side-session-handoff-a-home-prime-can-see.md
- docs/work/todo/TASK-615-name-the-conformance-verdict-beside-the-gate-tally.md

## Plan

### T1 — Give a side-session handoff a home that /prime can see `[size: S · risk: low · class: execution · HITL · J2]`
Layers: `skills/handoff/SKILL.md` · `skills/prime/SKILL.md` · `scripts/lib/check-handoff-state.sh` · `evals/run-handoff-state-fixtures.sh` · `CHANGELOG.md` · `TECH-DEBT.md` · `spec/STANDARD.md` · `spec/CHANGELOG.md` · `skills/lean-doc-generator/references/handoff-reconciliation.md`
Depends-on: none
Cites: TASK-614 · TD-298 · TASK-613 · owner ruling 2026-11-07 · `HANDOFF-LEDGER.md`
The owner had to name a handoff's path by hand on 2026-11-06. Where the stub lives is deliberately unruled at G2, so the builder returns `blocked` with one question and a recommendation; that is row 1's return-path check.

**Acceptance:** a handoff unrelated to the active sprint is reported by `/prime` with no path named by the owner, and a sprint's own `live` entry still fails its close.

### T2 — Name the conformance verdict beside the gate's tally `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `scripts/qa-check.sh` · `evals/` · `TECH-DEBT.md`
Depends-on: T1
Cites: TASK-615 · TD-081 · `scripts/qa-verdict.ts` · `scripts/gate-remote.ts`
The line `QA-CHECK: 173 pass, 0 fail` can sit below seven conformance FAIL rows that a reader of the last line never sees. The count goes on its own line because `VERDICT_RE` is anchored at both ends. T2 follows T1 only for the shared `TECH-DEBT.md` and `evals/`; there is no logic dependency.

**Acceptance:** the gate prints the informational finding count directly before an unchanged verdict line, and a retained must-FAIL fixture reddens when that line is removed or miscounts.

## Owner-action checklist
- [x] Rule TD-298's stub home when T1's builder returns `blocked` (T1). ✓ owner ruling by popup, recorded in the Log's T1 scope-change

## Decisions (pre-locked)
- **D1** — Shared files: `TECH-DEBT.md` and `evals/` are edited in T1, T2 order; `Depends-on: T1` makes that the ownership order. No parallel wave.
- **D2** — Owner ruling, 2026-11-07, this sprint only: Claude is the builder, in place of the Codex default, so the trial measures the worker contract (TASK-613).
- **D3** — ADR-053: both are `TD` work on existing surfaces. T2's line reports a count and adds no check to the tally; its must-FAIL fixture is the Other G bar (ADR-050).
- **D4** — Sprint work and commits go to `main`, while skills load from the trial worktree. The trial branch is not edited here.

## Assumptions
- **A1** — `check-handoff-state.sh` reads a root `HANDOFF-LEDGER.md` only on the no-sprint path. *Confirm: T1's builder, against the script.*
- **A2** — `conformance.sh` prints its own report and needs no change. *Confirm: T2's builder.*
- **A3** — The new line matches neither `VERDICT_RE` nor `TRUNCATED_RE`. *Confirm: T2's tests, `scripts/qa-verdict.ts`.*

## Execution Log

> **Lives in its own file** — [`logs/SPRINT-165-side-handoff-and-conformance-line.md`](logs/SPRINT-165-side-handoff-and-conformance-line.md). Append there, never here.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `skills/handoff/SKILL.md` | T1 | a side handoff's stub goes to the ledger; a resumed record closes where it sits | Med | proof runs A and B; Codex 2 rounds |
| `skills/prime/SKILL.md` | T1 | reports the sprint Log and the ledger | Med | proof run A2 |
| `skills/lean-doc-generator/references/handoff-reconciliation.md` | T1 | the ledger is no longer a no-sprint fallback only | Low | Codex |
| `spec/STANDARD.md` · `spec/CHANGELOG.md` | T1 | § 2's ledger row, spec 0.20.0, MINOR | Low | Codex; §15's test |
| `scripts/lib/check-handoff-state.sh` | T1 | comments only, so they match the ledger's reach | Low | fixtures |
| `evals/run-handoff-state-fixtures.sh` | T1 | four side-stub cases | Low | 31 PASS |
| `scripts/qa-check.sh` | T2 | one function prints the conformance line before both verdict prints; the harness joins leg 12 | Low | gate, 63 on the real repo |
| `evals/run-conformance-line-fixtures.ts` | T2 | must-FAIL fixtures for the line | Low | 14 pass |
| `TECH-DEBT.md` | T1 · T2 | TD-298 and TD-081 resolved; TD-299 and TD-300 filed at close | Low | read |
| `CHANGELOG.md` | T1 · close | `[Unreleased]` entries | Low | read |

## Retro

**Retrieval check** — yes, two misses, both the coordinator's. L-262 (a brief names the typecheck leg) was promoted and in reach when T2's brief told the builder not to run the full gate and named no leg. L-234 (run the scope-change leg before committing the entry) was in the log's own header when the T1 entry named `HANDOFF-LEDGER.md`. Both counted.

**Cost** — coordinator on Opus plus two Sonnet builders, two Sonnet builder-check readers, one Sonnet reviewer and two Codex rounds. Three headless proof runs cost 1.65 USD. The whole session's USD per box is not available at close, since this session's cost row is not yet written; TASK-613 records it against the baselines. 10 of 10 boxes delivered.

**Worked**
- The planned question came back as `blocked` with one question and a recommendation before any edit, and the answer returned to the same agent id.
- Both builders kept to the contract: no status moves, no sprint-file writes, and the T1 builder stopped at the classifier's denial instead of working around it.
- The fresh readers paid for themselves: T2's reader found the second verdict print inside `qb_checkpoint` and the reduced-spec 0, before any code.
- Box 3's second selection caught a 64 against 63, explained by another leg's row rather than rounded away.

**Friction**
- Two close-time gate failures on the first full gate, both from the coordinator's side (Log, 2026-11-07 surprise entry). Neither traces to the worker contract's text, though its "run the relevant checks" did not stop a brief from leaving a leg out.
- A1 was wrong: the checker reads the ledger whatever the sprint state. The reader caught it at G2.
- The T1 proof needed a second owner popup, because no one had decided at G2 who launches a nested headless run.
- The builder picked PATCH and Codex argued MAJOR; §15's own test and MINOR row settled it.
- The tally fell from 504 to 460 with the 26 deletions, and the per-leg cause was not traced.

**Pattern candidate** — L-293 (who launches a proof is a G2 decision).
