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

## G2 (signed 2026-11-09)
Batch G2 signed for SPRINT-170: the design is the SPRINT-170 Execution Log entry "2026-11-09 | gate | G2 batch signed" (its draft section for this task, as amended by its settlements S0 to S36, which win on any conflict).

## Done when
- [x] A hang oracle is frozen before any run: what counts as progress, the alert deadline and the watcher's overhead limit. ✓ Frozen at G2 (S22-S26, draft B T5): progress = a change in the worker's cwd fingerprint or `finished` becoming true; transcript lines alone are not progress; no progress for 6 min = hung; alert deadline 7 min after last progress; overhead limits 0.10 USD of coordinator turns and 2% of one core.
- [x] A planted hung worker, one that stops making progress without exiting, runs in an attended session without the watcher. The record shows what the coordinator, the host and the owner noticed within the alert deadline. An inactive watchdog is recorded as no coverage, not as a failed detection. ✓ Run 1 (Opus coordinator + H, no watcher, 0.325 USD): H's last progress 09:12:25Z, deadline 09:19:25. Coordinator: polled H's folder on its own and saw "no change" at 09:17:36 but called it "still waiting", never a hang; host: H's Bash 600 s timeout at 09:22:28, after the deadline; owner (headless emulation, owner ruling): no alert in the window; night-run watchdog: no coverage (not running). Caveat: the run prompt asked the coordinator to note what it noticed, which makes it more watchful than a normal session.
- [x] The same planted hang runs with the watcher. Four controls run with it too: silent but healthy work, a worker waiting on the owner, a worker that exited, and a chatty worker that makes no progress. ✓ Run 2c (0.751 USD, 13.8 min; run 2 crashed the watcher on real transcripts and run 2b was voided by a lid/button suspend, both logged): H `ALERT HUNG silent` 6.1 min after last progress; C4 `ALERT HUNG chatty` 6.3 min after; C1 (silent but healthy) `exited (ready)`, no alert; C2 `waiting`, no alert, answered JSON after the 480 s hold; C3 `exited (failed)`.
- [x] The verdict is recorded in EPIC-024 row 7, no-go included. Pass only if the watcher alerts on the hang and the chatty worker within the deadline, raises nothing on the healthy and waiting controls, reports the exited worker as exited, and stays within its overhead limit. Missing telemetry is inconclusive, which is no-go. ✓ **no-go, on overhead**: every detection condition passed and CPU stayed at 0.36% of a core, but the coordinator's watcher-triggered turns cost 0.120 USD against the 0.10 limit (0.033 of it a relaunch retry the watcher's own `--exclude` format caused). No missing telemetry in run 2c.
- [x] Negative: the watcher never kills or restarts a worker; it reports, and the coordinator or the owner acts. Trial files stay on the trial branch; only this file's evidence and the epic row land on `main`. A pass ships only by an owner exception that names the tested artifact. ✓ kill/stop grep over the script 0 (control finds `readFileSync`); run 2c's coordinator issued 0 TaskStop and 0 kill commands; H's Bash ended on its own 600 s timeout (01:35:26Z), not at alert time; files only on `trial/epic-024-row7` (f5cf1963); a pass would have shipped only by owner exception.

## Touches
Trial branch: the watcher (agent file or script, as G2 decides). Scratch repo. `main`: this file and EPIC-024 row 7.

## Assumes
- **A1** — The oracle, deadline and overhead limit are fixed at G2.
- **A2** — All-in spend is charged to the sprint's 60 USD cap. Row limits are frozen at G2.
- **A3** — Out: comparing the watcher with the night-run watchdog on unattended runs. The watchdog already covers those; this row asks about attended sessions, which have nothing.

## Tracker
EPIC-024 row 7, D13 · `skills/orchestrator/references/night-run.md` (watchdog, reaper)

## Results

**Row 7: no-go, on overhead** (2026-11-10, SPRINT-170). The watcher found both planted hangs inside the deadline with no false alarm, but cost the coordinator 0.120 USD against a 0.10 limit.

| Run | Watcher | H (hung) | C4 (chatty) | C1 healthy | C2 waiting | C3 exited | USD |
|---|---|---|---|---|---|---|---|
| 1 | none | not flagged in 7 min; host timeout at 10 min | n/a | n/a | n/a | n/a | 0.325 |
| 2 | crashed (`telemetry unavailable`) | n/a | n/a | n/a | n/a | n/a | 0.664 |
| 2b | voided (host suspend, lid or button) | n/a | n/a | n/a | n/a | n/a | small |
| 2c | fixed (f5cf1963) | alert at 6.1 min | alert at 6.3 min | no alert | no alert | reported exited | 0.751 |

- Run 2's crash: the CLI writes a worker's `finished` flag only when it finishes, and transcripts carry rows with no timestamp; the watcher and its fixtures assumed otherwise. Fixed by owner ruling, with fixtures in the real shapes (old code 8 pass / 15 fail, fixed 23 / 0).
- What would bring it under the limit: accept a bare agent id in `--exclude` (the coordinator's first relaunch failed on that) and report every hung worker in one exit rather than one per launch. Not built: the verdict uses the frozen rule.
