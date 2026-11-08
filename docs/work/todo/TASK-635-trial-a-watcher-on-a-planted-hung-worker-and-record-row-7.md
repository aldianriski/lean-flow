---
id: TASK-635
title: "Trial a watcher on a planted hung worker against what lean-flow has today, and record row 7's verdict"
epic: EPIC-024
sprint: SPRINT-170
priority: P1
size: M
risk: med
autonomy: HITL
class: decision
tier: P
authority: J2
origin: decomposer
state: ready
depends-on: []
---

# TASK-635 — Trial a watcher on a planted hung worker against what lean-flow has today, and record row 7's verdict

## Why
Row 7 is a standard safeguard to prove (D13): a watcher that catches a hung worker. No real hang appeared in 18 workers. The night-run watchdog is an external wrapper for unattended runs, so an attended session has nothing watching.
The planted case shows the watcher works, not that it is needed (ADR-053), so a pass ships only by an owner exception (owner popup, 2026-11-08).

## Done when
- [ ] A hang oracle is frozen before any run: what counts as progress, the alert deadline and the watcher's overhead limit.
- [ ] A planted hung worker, one that stops making progress without exiting, runs in an attended session without the watcher. The record shows what the coordinator, the host and the owner noticed within the alert deadline. An inactive watchdog is recorded as no coverage, not as a failed detection.
- [ ] The same planted hang runs with the watcher. Four controls run with it too: silent but healthy work, a worker waiting on the owner, a worker that exited, and a chatty worker that makes no progress.
- [ ] The verdict is recorded in EPIC-024 row 7, no-go included. Pass only if the watcher alerts on the hang and the chatty worker within the deadline, raises nothing on the healthy and waiting controls, reports the exited worker as exited, and stays within its overhead limit. Missing telemetry is inconclusive, which is no-go.
- [ ] Negative: the watcher never kills or restarts a worker; it reports, and the coordinator or the owner acts. Trial files stay on the trial branch; only this file's evidence and the epic row land on `main`. A pass ships only by an owner exception that names the tested artifact.

## Touches
Trial branch: the watcher (agent file or script, as G2 decides). Scratch repo. `main`: this file and EPIC-024 row 7.

## Assumes
- **A1** — The oracle, deadline and overhead limit are fixed at G2.
- **A2** — All-in spend is charged to the sprint's 60 USD cap. Row limits are frozen at G2.
- **A3** — Out: comparing the watcher with the night-run watchdog on unattended runs. The watchdog already covers those; this row asks about attended sessions, which have nothing.

## Tracker
EPIC-024 row 7, D13 · `skills/orchestrator/references/night-run.md` (watchdog, reaper)
