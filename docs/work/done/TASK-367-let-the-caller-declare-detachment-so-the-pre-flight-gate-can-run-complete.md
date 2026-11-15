---
id: TASK-367
title: "Let the caller declare detachment, so the pre-flight gate can run complete"
priority: P2
size: M
risk: high
autonomy: HITL
sprint: SPRINT-177
class: decision
tier: G
authority: J2
origin: close-retro
state: ready
depends-on: []
---

# TASK-367 — Let the caller declare detachment, so the pre-flight gate can run complete

## Why

tier note: it decides whether an unattended run fires; a wrong verdict here launches or blocks a whole night's work

origin note: SPRINT-105 T3's raise was reverted as a regression; this is the real fix

state note: ruled: `--detached` flag, 2026-11-14 (see ## Decision)

## Done when

`night-run.sh` can run the pre-flight gate to COMPLETION without exceeding the foreground command ceiling, and does so only when the caller has **declared** detachment rather than a script assuming it. The reverted attempt raised `QA_BUDGET_SECONDS` unconditionally: the synchronous pre-flight gate call (the `qa_out=$( ... qa-check.sh ... )` call in `night-run.sh`) runs in the foreground (the only `nohup` is the later detached launch), so an unbounded gate took the launcher to ~955s in one foreground call against a 600s ceiling — killed mid-pre-flight with no verdict, strictly worse than the bounded refusal it replaced. Required:

- [x] (a) an explicit `--detached` launcher flag (owner ruling 2026-11-14, "--detached flag (Recommended)") — never inferred; the raise is set inline on the one pre-flight gate call and never exported.
- [x] (b) raise `QA_CEILING_SECONDS` alongside the budget, since that is the variable ADR-042 actually licensed a detached caller to raise and night-run.sh has **zero** hits for it.
- [x] (c) a bound on the un-raised path so a slow host gets a **named refusal** rather than a kill.
- [x] (d) retained fixtures, written as a Bun TypeScript test, `evals/night-run-detached.test.ts` (no new `.sh`), incl. a must-NOT-raise sibling and a selection-varying case (a repo with no `scripts/qa-check.sh`, the other arm of the `[ -f ... ]` test, which no fixture currently reaches).

## Touches

- scripts/night-run.sh · scripts/qa-check.sh (message text only) · skills/orchestrator/references/night-run.md · docs/adr/ADR-042-the-command-ceiling-is-a-foreground-limit.md (read, not edited)

## Assumes

- that a complete pre-flight is worth its wall-clock. Confirmed by the 2026-11-14 owner Decision below ("Yes, raise when declared (Recommended)"); `TD-090` and `TASK-357` (carried from SPRINT-104 T4) own the cost side.

## Decision
2026-11-14, the owner at triage, two popups after SPRINT-175 (Round 26: the Windows gate still 552–662 s against 520 s):
- **A complete pre-flight is worth its wall-clock**, verbatim "Yes, raise when declared (Recommended)". This settles the first
  assumption under § Assumes: build the launcher side as written; the cost side (TD-090, TD-171) stays separate.
- **The signal is a `--detached` flag**, verbatim "--detached flag (Recommended)": scoped to the one `night-run.sh` invocation, the raise
  set inline on the pre-flight gate call only and never exported, so the run's own later gate calls keep the default budget.

## Tracker

- ADR-042 · TD-084 and TD-175 (deleted, §11) · SPRINT-105 T3 review (F1 · F2 · F9)
