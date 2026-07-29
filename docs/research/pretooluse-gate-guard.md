---
owner: Maintainer
last_updated: 2026-07-29
update_trigger: Question revisited, or a Claude Code hooks/plugin release changes the facts
status: current
id: pretooluse-gate-guard
tags: [tooling, process]
domain: governance
related: TASK-006 · ADR-002 (agent-free core)
---

# Research — Can an opt-in PreToolUse gate-guard hook enforce G1/G2, and how would lean-flow ship it?

> **Question.** Is a PreToolUse hook that blocks Edit/Write/Bash until a gate-approval marker
> exists technically feasible — and can it ship *opt-in* without breaking the hook-free core?
> **Verdict.** Feasible and fail-safe. But Claude Code has **no per-hook opt-in** — plugin hooks
> auto-activate with the plugin — so shipping in-core would make the guard *mandatory* for every
> consumer. The only opt-in shape is a **separate sibling plugin**. Ship-decision → `/council` →
> ADR (this doc is that ADR's Context).

## Why this matters

TASK-006 has been blocked on this feasibility question since Sprint-017-era grooming. Guessing
wrong in either direction is expensive: building on a wrong feasibility assumption wastes a sprint;
shipping a hook that silently binds every consumer violates the opt-in promise and the hook-free
core (ADR-002 lineage) — the plugin's main differentiator.

## Options considered

- **A — Status quo (no hook)** — gates stay suggestion + human sign-off. *Trade-off:* zero
  enforcement, zero complexity, zero new surface.
- **B — Hook inside the lean-flow plugin** — `hooks/hooks.json` in this repo. *Trade-off:*
  auto-activates for every installer; **ruled out on platform fact** (no selective hook disable).
- **C — Sibling plugin (`lean-flow-gate-guard`)** — consumer installs the guard deliberately;
  core stays hook-free. *Trade-off:* second artifact to maintain; the gate-marker file becomes a
  public contract between two plugins.

## Findings

- **Blocking works.** `exit 2` (stderr = feedback) or JSON `hookSpecificOutput.permissionDecision:
  "deny"` + `permissionDecisionReason` both hard-block the call. → feasibility.
- **Deny overrides every permission mode** — including `bypassPermissions` / `dontAsk`; hooks can
  tighten but never loosen (`allow` cannot override a deny rule). → a guard is *real* enforcement.
- **External state is readable.** Hook receives `cwd`, `tool_name`, `tool_input`,
  `permission_mode` on stdin; `CLAUDE_PROJECT_DIR` / `CLAUDE_PLUGIN_ROOT` env; a gate-marker file
  stat is a sub-second check (set `"timeout"` ~5s, default 600s). → feasibility.
- **Fail-open, not fail-closed.** Missing script, non-2 error, bad JSON, or timeout → the tool
  call **proceeds**. A broken guard can't brick a consumer repo. → safety, favours C over "never".
- **All-or-nothing activation.** Plugin hooks auto-activate on plugin enable; there is **no
  per-hook disable** (only whole-plugin disable or global `disableAllHooks`). → kills B.
- **Windows portability is real work.** Use exec form (`args: []`) over shell form; LF-only
  scripts; no `jq` assumption; matcher `"Edit|Write"` scopes the per-call cost. → C's build cost.

*Source:* code.claude.com/docs — `hooks.md` · `hooks-guide.md` · `plugins-reference.md` ·
`permissions.md` (verified 2026-07-29 via claude-code-guide agent).

## Recommendation

Drop B — the platform makes an in-core hook mandatory-for-all, which contradicts both the opt-in
requirement and the hook-free core. The live fork is **A vs C**, and it is principle-level
(enforcement entering the lean-flow ecosystem at all), hard-to-reverse, with a real trade-off —
exactly the `/council` bar. Council the fork, then record the outcome as an ADR with this doc as
Context.

## Out of scope / open questions

- The A-vs-C decision itself → SPRINT-030 T1 (`/council`).
- Marker-file protocol design (name, scope, staleness/grace — a stale marker blocks everything) —
  design only if C wins.
- MINOR-version / marketplace mechanics of a sibling plugin — only if C wins.
