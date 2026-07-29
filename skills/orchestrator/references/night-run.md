# Night-run — pre-flight + trigger recipe for unattended `sprint-bulk`

Read before firing `sprint-bulk` unattended overnight. The mechanism is already decided — headless
`claude -p`, OS-scheduled, `--permission-mode dontAsk` + a pre-built scoped allowlist, never
`--dangerously-skip-permissions` (decision record: the lean-flow repo's `docs/research/night-run.md`).
This file is the operational procedure, not a re-decision.

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
Stall/kill/resume path: Part 3. Rollup line format: Part 4.

## Part 3 — Watchdog (OS-level pattern, ships outside lean-flow's own surface)

A small wrapper the OS scheduler runs alongside Part 2's `claude -p` call — no plugin code, no hook.

- **Stall signal**: no new `stream-json` line and no new commit for N minutes (default ≈20–30 min,
  scaled to the run's task size — raise for large/slow tasks, lower for small ones).
- **On stall**: SIGTERM the `claude -p` process — it runs `SessionEnd` then exits 143 (confirmed in
  `docs/research/night-run.md` Findings), the same clean-exit path a closed terminal triggers.
- **Recovery**: the kill handler fires one final `claude -p --resume <session-id> "/handoff"` so the
  handoff doc lands in the OS temp dir exactly as a human-ended session would.
- **Shape** (pseudo): `every K min → if idle > N min → SIGTERM → wait for exit 143 → claude -p
  --resume <session-id> "/handoff"`.
- **Resume**: next session opens with `/prime`, which already reads a referenced handoff doc — no
  new resume mechanism.

## Part 4 — Morning rollup (rides the Execution Log, no new artifact)

The first thing the morning human reads: one line per non-green task, appended as the run's last
Execution Log entry — written by the run itself on a clean finish, or by the watchdog's `/handoff`
on a stall.

```
Tn · state (done | blocked | denied-tool | stalled) · unblock condition / next action
```

`denied-tool` = `dontAsk` refused a call outside the pre-flight allowlist (next: extend allowlist,
re-run). `stalled` = the watchdog fired (next: resume via `/prime` + the handoff path). `done`
tasks need no line — the rollup is for non-green tasks only.
