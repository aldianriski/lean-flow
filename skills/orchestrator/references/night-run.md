# Night-run — pre-flight + trigger recipe for unattended `sprint-bulk`

Read before firing `sprint-bulk` unattended overnight. The mechanism is already decided in
`docs/research/night-run.md` (TASK-090) — headless `claude -p`, OS-scheduled, `--permission-mode
dontAsk` + a pre-built scoped allowlist, never `--dangerously-skip-permissions`. This file is the
operational procedure, not a re-decision.

## Part 1 — Pre-flight pass (run interactively, the evening before)

All items must pass or the night-run does not fire:

- [ ] Active sprint exists; § Plan is frozen (true since `promote`); every task in the run is
      AFK-class — none needs a human mid-execution.
- [ ] Batch G1 + G2 already signed off by the human (per `sprint-bulk` steps 1–2).
- [ ] Zero open `assumes:` / `needs-info` tasks in the run — G2 already blocks on this; pre-flight
      re-verifies it still holds at trigger time (state can drift between G2 and the evening run).
- [ ] Scoped allowlist built from the tasks' `touches:` files plus the commit/review/lint commands
      the run will need, in `--allowedTools` permission-rule syntax (e.g. `Bash(git commit *)`).
      The `fewer-permission-prompts` skill's transcript-scan approach is a candidate builder.
      `dontAsk` **denies** anything outside the list rather than pausing for it — an under-scoped
      allowlist silently fails tasks instead of asking, so this step is load-bearing; over-denial
      shows up in the morning report, never as a bypass.
- [ ] `bypassPermissions` is off the table — never the fallback for a lazy allowlist. The safety
      default stays OFF; flipping it is an owner decision, not a night-run convenience.

## Part 2 — Trigger recipe (consumer-generic)

The one-liner, fired by an OS-level scheduler (outside lean-flow's own surface — it ships no hooks):

```
claude -p "/orchestrator sprint-bulk" --permission-mode dontAsk --allowedTools "<built list>"
```

Scheduling variants — the machine must stay on for either:

- **cron (POSIX)**: `0 1 * * * cd /path/to/project && claude -p "/orchestrator sprint-bulk" --permission-mode dontAsk --allowedTools "<built list>" >> night-run.log 2>&1`
- **Windows Task Scheduler**: `schtasks /Create /TN "night-run" /TR "claude -p \"/orchestrator sprint-bulk\" --permission-mode dontAsk --allowedTools \"<built list>\"" /SC DAILY /ST 01:00`

Checkpointing is inherited free from `sprint-bulk` steps 4–5 — no new mechanism: per-task commit +
Execution Log append is the checkpoint; first-blocker-halt parks the blocked task with its unblock
condition and lets disjoint work continue per the G2 parallel map.

**Morning.** Read the sprint file's Execution Log + DoD state — that's the report; no new artifact.
A "Blocked / needs-human" rollup line at the top of the run's log entry is future work (TASK-098) —
named here as the pending piece, not built in this file. On a stall or kill, the resume path is
whatever the watchdog left behind: it should invoke `/handoff` on timeout so a doc lands in the OS
temp dir exactly as a human-ended session would; the next session opens with `/prime` and reads it
in (TASK-098 wires the watchdog itself).
