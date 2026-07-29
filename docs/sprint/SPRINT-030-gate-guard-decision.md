---
sprint: 030
slug: gate-guard-decision
owner: Maintainer
last_updated: 2026-07-29
status: active
plan_commit: 5d52450
close_commit: [set at close]
update_trigger: sprint execute/close events
---

# SPRINT-030 — Gate-Guard Decision

> **Theme:** Decide TASK-006. The PreToolUse research (`docs/research/pretooluse-gate-guard.md`)
> settled feasibility and killed the in-core option on platform fact; what remains is the
> principle-level fork — does enforcement enter the lean-flow ecosystem at all — and recording
> that durably. Decision sprint, not a build sprint.

## Scope

**In:** the `/council` run on the A-vs-C fork · the ADR recording the outcome · routing TASK-006 by the verdict
**Out (deferred):** building the hook or sibling plugin (a follow-up TASK only if C wins) · marker-file protocol design · any hook in lean-flow core (ruled out — D1)

## Plan

### T1 — Council the gate-guard fork (A status-quo vs C sibling plugin) `[size: M · risk: med]`
Layers: `docs/research/verdict-gate-guard.md` (council output) · reads `docs/research/pretooluse-gate-guard.md`
It touches the hook-free-core principle (ADR-002 lineage) — hard-to-reverse and principle-level,
exactly the `/council` bar. The research doc is the shared evidence base for all advisors.

**Acceptance:** `verdict-gate-guard.md` exists with a synthesized A-vs-C verdict.

**DoD:**
- [ ] `/council` run on the fork with the research doc as input
- [ ] verdict saved to `docs/research/verdict-gate-guard.md`

### T2 — Record the decision as ADR-011 `[size: S · risk: low]`
Layers: `docs/adr/ADR-011-<slug>.md` · `docs/DECISIONS.md` · `docs/knowledge-index.md` (regen)
Clears the ADR bar (§4): hard-to-reverse + surprising (no per-hook opt-in on the platform) + a
real trade-off. The research doc becomes the ADR's Context.

**Acceptance:** ADR-011 accepted and indexed; knowledge index regenerated.

**DoD:**
- [ ] ADR-011 written from the verdict (research doc linked as Context)
- [ ] `DECISIONS.md` entry + `sh scripts/gen-index.sh` run

### T3 — Route TASK-006 by outcome `[size: S · risk: low]`
Layers: `TODO.md` · `.out-of-scope/` (only if A wins)
Close the loop so the backlog reflects the verdict — no zombie task.

**Acceptance:** TASK-006 resolved — A: closed with an `.out-of-scope/gate-guard-hook.md` entry ·
C: follow-up build TASK filed (`ready`, sized) and TASK-006 removed.

**DoD:**
- [ ] TASK-006 removed from Backlog with a trail matching the verdict

## Decisions (pre-locked)

- **D1** — Option B (hook inside lean-flow core) ruled out on platform fact: plugin hooks auto-activate with no per-hook disable ⇒ in-core = mandatory for every consumer, violating the opt-in requirement + hook-free core. → folds into ADR-011.

## Assumptions

- **A1** — The hook facts (fail-open · deny overrides all permission modes · all-or-nothing activation) hold as of the 2026-07-29 docs. *Confirm: re-check `hooks.md`/`plugins-reference.md` at ADR write if a Claude Code release lands in between.*

## Execution Log

### 2026-07-29 | promote | sprint formed from TASK-006 (unblocked by PreToolUse research)
Research ran same-session (claude-code-guide sweep → `docs/research/pretooluse-gate-guard.md`);
TASK-006 → `ready`; single-task decision sprint promoted.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro

<!-- Written at close. -->

**Retrieval check** — did we fail to find, or contradict, a prior `L-NNN`/ADR this sprint?

**Worked**
-

**Friction**
-

**Pattern candidate** (surface to user → `docs/LEARNINGS.md`)
-
