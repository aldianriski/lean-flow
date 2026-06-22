---
owner: Maintainer
last_updated: 2026-06-22
update_trigger: A skill's allowed-tools changes, or the enforcement semantics are verified
status: current
---

# Research — Are the 14 skills' `allowed-tools` least-privilege? (SPRINT-010 T1)

> **Question.** Does each skill declare exactly the tools its procedure needs — no more (over-grant widens blast radius), no less (under-grant blocks the skill)?
> **Verdict.** Mostly yes. **One confirmed under-grant (diagnose), two minor over-grants (council · flow), and one semantics question (sub-agent dispatch) to verify.** No unsafe instructions. All fixes deferred to follow-up tasks (audit sprint — D1).

## Why this matters

`allowed-tools` is the skill's least-privilege boundary — an over-grant lets an agent do more than the skill needs (wider blast radius); an under-grant silently blocks the skill at runtime. Getting it right is cheap safety + reliability.

## Findings (declared vs needed, 14 skills)

Clean (declared = needed): **prime · triage · prototype · refactor-advisor · lean-doc-generator · release-patch · tdd · insights · handoff** (9).

Issues:

| Skill | Declared | Issue | Confidence |
|---|---|---|---|
| **diagnose** | `Read, Edit, Bash, Glob, Grep` | **under-grant: `Write`** — Phase 5 writes a regression test *before* the fix; a *new* test file needs Write, not Edit (creating it via Bash would hit L-005) | **high** |
| **council** | `Read, Write, Bash, Glob, Grep` | **over-grant: `Bash`** — the procedure is read/write + sub-agent spawning; no shell command appears | high |
| **flow** | `Read, Write, Edit, Bash, Glob, Grep` | **likely over-grant: `Write`/`Edit`** — flow *sequences* other skills; verify it never writes/edits directly (it may still need Bash for git via the conducted steps) | medium |
| **council · task-decomposer · orchestrator** | (no `Agent`/`Task` declared) | **semantics question** — these dispatch sub-agents (council's 11; task-decomposer's `Explore`; orchestrator's tier-dispatch + isolated review passes). **But council ran 11 sub-agents in SPRINT-003 with no `Agent` declared** → strong evidence `allowed-tools` does *not* gate sub-agent dispatch (the main loop dispatches). **Verify before acting.** | needs-verify |

**No-unsafe-instruction check: PASS.** No skill instructs `rm -rf`, force-push, mass delete, secret exfiltration, or safeguard bypass. (`release-patch`'s never-push hard-stop and `handoff`'s secret-redaction rule are safety *controls*, not unsafe instructions.)

## Recommendation

- **Confirmed fixes (follow-up tasks):** add `Write` to `diagnose`; drop `Bash` from `council`.
- **Verify-then-fix:** confirm `flow` never writes/edits directly → if so, drop `Write`/`Edit`.
- **Verify semantics first:** determine whether a SKILL's `allowed-tools` gates sub-agent dispatch. If it does, add `Task`/`Agent` to council · task-decomposer · orchestrator (and re-audit all dispatching skills). If it doesn't (the council evidence), record that fact in CONTEXT/ADR so future audits don't re-flag it.

Not hard-to-reverse → no ADR (unless the semantics finding reshapes the agent-dispatch model).

## Resolution (SPRINT-011 T1, 2026-06-22)

- **Sub-agent-dispatch gating: NOT gated.** `/council` ran 11 sub-agents in SPRINT-003 with no `Agent`/`Task` declared and succeeded (→ ADR-006); had `allowed-tools` gated dispatch, it would have failed. So **no `Task`/`Agent` added** to council/task-decomposer/orchestrator (adding them would be an over-grant for an un-gated capability). Deeper empirical verification reserved only if it ever matters.
- **Applied:** `diagnose` +`Write`; `council` −`Bash`; `flow` −`Write`/`Edit` (it conducts, never writes directly).
- **Noted (not applied — out of T1 scope):** `flow` may also not need `Bash` directly (the conducted skills carry their own) — a candidate further trim if confirmed.
