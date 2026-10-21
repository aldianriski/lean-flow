---
id: TASK-367
title: "Let the caller declare detachment, so the pre-flight gate can run complete"
priority: P3
size: M
risk: high
autonomy: HITL
class: decision
tier: G
authority: J2
origin: close-retro
state: needs-info
---

# TASK-367 — Let the caller declare detachment, so the pre-flight gate can run complete

## Why

tier note: it decides whether an unattended run fires; a wrong verdict here launches or blocks a whole night's work

origin note: SPRINT-105 T3's raise was reverted as a regression; this is the real fix

state note: the detachment signal's shape is the open question

## Done when

`night-run.sh` can run the pre-flight gate to COMPLETION without exceeding the foreground command ceiling, and does so only when the caller has **declared** detachment rather than a script assuming it. The reverted attempt raised `QA_BUDGET_SECONDS` unconditionally: the gate call at `:589` is synchronous (the only `nohup` is 144 lines below), so an unbounded gate took the launcher to ~955s in one foreground call against a 600s ceiling — killed mid-pre-flight with no verdict, strictly worse than the bounded refusal it replaced. Required:

- [ ] (a) an explicit signal — a `--detached` flag or an env var the caller sets — never inferred.
- [ ] (b) raise `QA_CEILING_SECONDS` alongside the budget, since that is the variable ADR-042 actually licensed a detached caller to raise and night-run.sh has **zero** hits for it.
- [ ] (c) a bound on the un-raised path so a slow host gets a **named refusal** rather than a kill.
- [ ] (d) retained fixtures incl. a must-NOT-raise sibling and a selection-varying case (a repo with no `scripts/qa-check.sh`, the other arm of the `[ -f ... ]` test, which no fixture currently reaches).

## Touches

- scripts/night-run.sh · scripts/qa-check.sh · evals/run-night-run-gate-exception-fixtures.sh · ADR-042

## Assumes

- that a complete pre-flight is worth its wall-clock at all. UNCONFIRMED — the alternative is that the launcher should keep refusing on a bounded gate and the completeness problem belongs to the gate's cost, not to the launcher. Rule that before building; `TD-090` and `TASK-357` (carried from SPRINT-104 T4) own the cost side.
- **open:** the shape of the detachment signal (the open question — see Done when (a)).
- **open:** re-measure the Windows default-profile gate total after Round 24 (engine −67%; VPS `QA_FULL=1` is 105–109 s, Round 22) — if it completes under the 520 s budget, the launcher already gets a complete verdict and this task may be moot.
- **open:** take that measurement only with ≥ 3 GB free on this host — triage 2026-10-21 found 0.5 GB of 13.7 GB, and a timing under memory pressure is discarded, not adjusted (L-219). The VPS cannot stand in: the question is the Windows total (TD-223).

## Tracker

- ADR-042 · TD-084 · TD-175 · SPRINT-105 T3 review (F1 · F2 · F9)
