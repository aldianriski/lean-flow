---
sprint: 118
slug: prove-the-run
owner: Maintainer
last_updated: 2026-10-07
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-118 — Execution Log

> Append-only companion to [`../SPRINT-118-prove-the-run.md`](../SPRINT-118-prove-the-run.md). Uncapped by design:
> this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.

### 2026-10-07 | promote | plan locked, governance signed, four members: a fire-time ledger, then one real unattended run (EPIC-015)
The owner picked the shape "Prove the Run" (the run is in the Plan, L-111) and the VPS as run host, as `ubuntu`, after an owner
CLI install (D1). Size check at pull: two M, two S. Members moved backlog → todo (`916753c`) and were stamped in `901e7d6`.
TASK-319's prerequisite TASK-352 shipped at SPRINT-102 T3. The owner signed the checklist:
- **L-promotion:** none due.
- **TD aging:** 113 of 117 open rows aged against sprint 118 (created ≤ 115). Second route: 117 − 4 filed at 116/117 = 113. One `high` row
  (TD-168) → TASK-404.
- **doc-aging:** §11 deleted TD-143 · TD-150 · TD-224 · TD-225, all resolved at SPRINT-115 (`4a6d3b1`). A first selector, matching
  `SPRINT-11[45]` in the status text, found only 224/225. TD-143/150 record a date, not a sprint, and were caught by reading their
  resolving tasks. Census: 145 + TD-230 − 4 = **142 rows**, 117 open. That matched only after correcting an expectation of 141 that
  left out TD-230. §2: 0 over the cap.
- **epic rollup currency:** current (`check-epic-archive` 0 FAIL); EPIC-015 gains the SPRINT-118 row.
- **handoff ledger:** none.
promote-check: first run 3 findings (a T2 mention in T1 prose; two basename-vs-path forms), fixed; final `PASS -- 13 pass, 0 fail`.
Pre-dispatch preflight: CLEAR (waves T1=0 · T2=1 · T3/T4=2; `night-run.sh` owned T1 → T2 → T3).

### 2026-10-07 | progress | owner action (D1), part 1: CLI + plugin installed for `ubuntu` on the VPS; login pending (owner)
The owner believed the VPS was already logged in. A read-only check found the login belongs to the `workdoo` service user (CLI +
credentials present); `ubuntu` had no `claude` on any PATH and no `~/.claude/.credentials.json`. Owner ruling: keep D1 (run as `ubuntu`).
Installed user-local, no sudo: Claude CLI **2.1.291** (the version workdoo pins) at `~/.local/bin/claude`, plus the lean-flow marketplace
and plugin **2.1.0** (user scope, `~/.claude/plugins/cache/lean-flow/lean-flow/2.1.0`). Remaining: `claude login` as `ubuntu`, which needs
an interactive TTY, so the owner runs it from their own terminal, then a one-line `claude -p` smoke run (A1).

### 2026-10-07 | progress | owner action (D1) complete: `ubuntu` logged in on the VPS; A1 confirmed
Login ran in a detached tmux session (`claude auth login --claudeai`). The owner opened the URL and returned the one-time code, which
was typed into the session: `Login successful.` `claude auth status` reads `loggedIn: true`, `authMethod: claude.ai`. **A1 smoke
run:** `claude -p "Reply with exactly: SMOKE-OK"` in `~/lf-gate` → `SMOKE-OK`, rc 0; `lean-flow@lean-flow` is listed. Auto-update is
off for `ubuntu` (`env.DISABLE_AUTOUPDATER=1` merged into `~/.claude/settings.json`, backup `.bak-20261007`), so the CLI stays at
2.1.291 like workdoo's.
**Pre-flight item for T2 (found by the smoke run):** `~/lf-gate` is not a trusted workspace, so its `.claude/settings.json` 68
`permissions.allow` entries are ignored ("this workspace has not been trusted"). A `dontAsk` headless run there would be denied
the tools its allow-list grants. G2 rules the run's working directory and grants trust for exactly that path (`hasTrustDialogAccepted`
in `~/.claude.json`) at pre-flight, not before.
