---
owner: Maintainer
last_updated: 2026-07-29
update_trigger: Claude Code scheduling/permission primitives change, or night-run is prototyped on real input
status: current
id: night-run
tags: [process, tooling, sprint-model]
domain: skills
related: [loop-mechanics-audit, ADR-010]
---
<!-- Frontmatter is the ADR-009 knowledge metadata SSOT — tags/domain vocab sourced from
     scripts/gen-index.sh TAGS/DOMAINS (single origin); qa-check.sh lints id/tags/domain/status
     against it, so keep values inside the listed vocab. -->

# Research — What mechanism runs `sprint-bulk` unattended overnight with zero gate compromise? (TASK-090)

> **Question.** One trigger at night, sprint finished by morning, every G1/G2 approval and permission grant front-loaded before the trigger, zero mid-run confirmations — which Claude Code mechanism should drive it, and how do checkpoint/recovery and the morning report work?
> **Verdict.** Trigger a single headless `claude -p "/orchestrator sprint-bulk"` invocation (local, `--permission-mode dontAsk` + a pre-built scoped allowlist) from an OS-level scheduler (cron / Task Scheduler / a Desktop scheduled task) — not a cloud Routine, not `--dangerously-skip-permissions`. Everything else needed (pacing, checkpointing, review, reporting) already exists in `sprint-bulk` + `review-scoping.md` + `/handoff`; night-run adds only a pre-flight gate and a thin OS-level wrapper.

## Why this matters

`sprint-bulk` already gates once and loops the Plan (`skills/orchestrator/SKILL.md`), but every run today is a human sitting at the keyboard through every commit. AFK tasks bigger than an interactive session need a way to start at night and still hit every G1/G2/permission checkpoint — guessed wrong, either a gate silently gets skipped (unacceptable — gates are never bypassed) or the run stalls waiting on a prompt nobody's there to answer.

## Options considered — run mechanism

- **A — headless `claude -p`** (chosen) — one non-interactive CLI invocation, triggered by an OS scheduler. Runs on the local machine against the real working tree. *Trade-off:* machine must stay on; needs an OS-level (not lean-flow-level) scheduler entry.
- **B — `/loop` (self-paced wakeups)** — re-fires a prompt on an interval inside an open session. *Trade-off:* session-scoped (dies with the terminal unless backgrounded), built for polling/babysitting, not for driving a single long multi-task run to completion — `sprint-bulk` already has its own per-task loop (SKILL.md step 4), so nesting `/loop` under it is redundant machinery, not a missing one.
- **C — scheduled cloud Routines** — Anthropic-managed cloud session, cron or API/GitHub triggered, genuinely zero prompts by design (no permission-mode picker at all). *Trade-off:* clones the repo fresh from GitHub's default branch — no local uncommitted state, no local MCP config — a structural mismatch with lean-flow's local-git sprint model (frozen Plan + per-task commits in the working repo); also requires Claude Code-on-web entitlement + GitHub App install, which not every consumer repo has (L-015 consumer check).
- **D — background tasks** (`Bash --background` / `Ctrl+B` + `Monitor`) — async subprocess primitive inside a turn (dev servers, long test runs). *Trade-off:* a supporting primitive, not a top-level trigger — useful inside a task's Implement step, not for starting the sprint itself.
- **E — Workflow (deterministic JS orchestration)** — scripted `agent()`/`parallel()`/`pipeline()` fan-out. *Trade-off:* duplicates what `dispatch.md`'s G2 overlap-map already drives (parallel batches via multiple Agent calls) and is explicitly out of lean scope today (CONTEXT.md: "`/workflows` … out of lean scope"; dispatch.md already names it as the *escalation* for large disjoint fan-out, not the default).

## Findings

- Claude Code's own scheduling-options table confirms the split: Routines run on Anthropic cloud with no local file access and no permission prompts; Desktop tasks and `/loop` run locally, requiring the machine on; only `/loop` requires an open session. *Source:* [Run prompts on a schedule](https://code.claude.com/docs/en/scheduled-tasks).
- Routines run "autonomously as full Claude Code cloud sessions: there is no permission-mode picker and no approval prompts during a run" — the cleanest zero-mid-run-confirmation story, but "the environment... starting from the default branch" (fresh GitHub clone) rules it out for a locally-promoted, uncommitted-until-committed sprint file. *Source:* [Automate work with routines](https://code.claude.com/docs/en/routines).
- `dontAsk` permission mode "auto-denies every tool call that would otherwise prompt... the session never waits for input" and is explicitly recommended "for CI pipelines or restricted environments where you pre-define exactly what Claude may do" — this is the correct front-loaded-authorization primitive, distinct from `bypassPermissions`. *Source:* [Choose a permission mode](https://code.claude.com/docs/en/permission-modes).
- `bypassPermissions` (`--dangerously-skip-permissions`) is warned as safe "only in isolated environments like containers, VMs... where Claude Code cannot damage your host system" and "offers no protection against prompt injection" — wrong default for a consumer's own dev machine, which is the common case for an installed plugin. *Source:* same.
- Headless mode: `claude -p` reads `--permission-mode`, `--allowedTools` (permission-rule syntax, e.g. `Bash(git commit *)`), resumes with `--continue`/`--resume`, streams `--output-format stream-json` for a wrapper to watch, and terminates 143 on SIGTERM after running `SessionEnd` hooks — enough surface to script a watchdog around it. *Source:* [Run Claude Code programmatically](https://code.claude.com/docs/en/headless).
- `sprint-bulk` (SKILL.md steps 0–6) already specifies batch-G1, batch-G2 + overlap map, parallel/sequential dispatch, a per-task Implement→Self-review→Commit→tick-DoD loop, and a first-blocker halt — night-run's job is to front-load steps 0–2 and wrap steps 3–6 in one headless invocation, not reinvent them.

## Recommendation

**Primary mechanism: local headless `claude -p`, OS-scheduled, `dontAsk` + scoped allowlist.** One command — `claude -p "/orchestrator sprint-bulk" --permission-mode dontAsk --allowedTools "<pre-built list>"` — fired by cron / Windows Task Scheduler / a Desktop scheduled task. It is the only option that (a) operates on the real local working tree lean-flow's sprint model already lives in, (b) has a native, scoped, non-blocking unattended-authorization mode (`dontAsk`), and (c) needs no cloud entitlement the plugin can't assume every consumer has — the generic, consumer-facing choice (L-015). `/loop`, Routines, and Workflow all stay valid tools for *other* jobs (polling a PR, cloud-only teams, large disjoint fan-out) but none replace the trigger.

**1. Front-loaded gates (before the trigger).** Extend `sprint-bulk`'s existing Guard (step 0) into an explicit pre-flight pass, run interactively the evening before: batch G1+G2 already fire once per CONTEXT.md — pre-flight just enforces nothing proceeds with an open `assumes:`/`needs-info` task (G2 already blocks on this) and that the Plan is frozen (already true at `promote`). New: build the `--allowedTools`/`permissions.allow` list from the tasks' known `touches:` files + commit/review commands during this same pass (the existing `fewer-permission-prompts` skill's transcript-scan approach is a candidate builder). Never reach for `bypassPermissions` as a shortcut here — it trades scoping for convenience and isn't needed once the allowlist is built.

**2. Checkpoint/recovery.** Unchanged from `sprint-bulk` steps 4–5: per-task commit + Execution Log append is the checkpoint; a blocker gets logged and the task marked `blocked` with its unblock condition (CONTEXT.md task-entry shape) — for the *unattended* run, "halt-all" only for a same-owner/shared-file blocker (nothing else in that ownership chain can proceed); an independent, disjoint task keeps going per the G2 parallel map. Stall detection is an OS-level watchdog outside lean-flow's own surface (it ships no hooks): poll the sprint file's Execution Log mtime or `stream-json` heartbeat, and on no progress past a threshold, send SIGTERM and have the wrapper invoke `/handoff` so the doc lands in the OS temp dir exactly as a human-ended session would — the morning session still opens with `/prime` and reads it in.

**3. Quality loop + morning report.** Unchanged: `review-scoping.md`'s skip table + one scoped `sonnet` reviewer per small/med task already fires inside the existing per-task loop — no new review mechanism. The "morning report" is not a new artifact: it's the sprint file's Execution Log (what shipped, per-task commit shas) plus `close`'s existing four-bucket routing (Shipped/Tech debt/Follow-ups/Learnings) for anything a full DoD sweep completed, read via the next `/prime` (which already counts open DoD). The one addition worth making explicit: a one-line "Blocked / needs-human" rollup at the top of the Execution Log entry for the run, so the human doesn't have to scan line-by-line at 8am.

Not hard-to-reverse (it's a wrapper + a pre-flight checklist, not a schema/architecture change) → no ADR.

## Out of scope / open questions

- Exact allowlist-building mechanics (what `--allowedTools` a given sprint needs) — a follow-up `/prototype` once night-run is exercised on a real sprint (spec-only-debt trap, CLAUDE.md anti-pattern).
- Whether Routines become viable once a sprint is push-then-pull based rather than local-commit based — revisit if lean-flow's sprint model ever changes (currently local-git by design).
- Windows vs. macOS/Linux scheduler syntax differences for the wrapper — deliberately not resolved here (HOW, not WHY/WHERE).

## Proposed build tasks (NOT filed — TASK-shaped proposals only)

- **Pre-flight guard extension** — add an explicit pre-flight checklist to `sprint-bulk`'s Guard step (open `assumes:`/`needs-info` = 0, Plan frozen, allowlist built) before an unattended trigger is allowed. done-when: `sprint-bulk` refuses to start headless if any item is open. size: S.
- **Night-run trigger recipe** — document the `claude -p ... --permission-mode dontAsk --allowedTools ...` invocation + OS-scheduler snippet as a reference doc (generic, no lean-flow-specific paths). done-when: a consumer can copy one line into cron/Task Scheduler to fire `sprint-bulk` overnight. size: S.
- **Watchdog + `/handoff`-on-stall pattern** — document the OS-level stall-detection wrapper (Execution Log mtime / stream-json heartbeat → SIGTERM → `/handoff`). done-when: the recipe doc has a copy-pasteable watchdog snippet and confirms `/prime` resumes cleanly from it. size: S.
- **Morning "Blocked/needs-human" rollup** — add a one-line rollup convention to the Execution Log entry format for an unattended run. done-when: a real overnight run's log has the rollup line and `/prime` surfaces it first. size: S.

<!-- Lives in docs/research/<slug>.md (≤120 soft). Feeds an ADR or a G2 design call, then remains the
     WHY-trail. Once a decision is built on it, mark status: superseded rather than editing it. -->
