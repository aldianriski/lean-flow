---
sprint: 026
slug: fleet-build
owner: Maintainer
last_updated: 2026-07-29
status: active
plan_commit: pending
close_commit: —
update_trigger: sprint execute/close events
---

# SPRINT-026 — Fleet & Night-Run Build

> **Theme:** Turn SPRINT-025's decisions into working capability — the parallel worktree
> dispatch protocol and the night-run trigger path. Every design call is already locked in the
> research docs; this sprint only builds and exercises.

## Scope

**In:** worktree fleet dispatch + merge-back wired into sprint-bulk (T1) · night-run pre-flight
pass + trigger recipe (T2)
**Out (deferred):** TASK-098 night-run resilience (blocked on T2 shipping) · external CLI agents
(Claude-only v1 stands) · the pooled P2 scans (091/092/094/095 — candidates for the first real
night-run) · any hook/agent-file shipping.

## Plan

### T1 — Wire worktree fleet dispatch + merge-back into sprint-bulk (TASK-096) `[size: M · risk: med]` [HITL]
Layers: skills/orchestrator/references/dispatch.md · skills/orchestrator/SKILL.md (110-cap:
reword in place) · .claude/CONTEXT.md
All decisions pre-locked in `docs/research/fog-fleet-orchestration.md` — dispatch unit = Tn,
sequential merge queue in G2-order, two-tier verify, Claude-only v1. This task writes the
procedure where it fires and exercises it once for real.

**Acceptance:** dispatch.md carries the worktree protocol AND the coordinator merge-queue
procedure; SKILL.md Sequence line + CONTEXT §Streams updated (L-042 narrowed to intra-tree);
exercised once on a real sprint wave (L-007).

**DoD:**
- [ ] dispatch.md: worktree protocol (disjoint Tn → parallel `Agent(isolation:"worktree")` · soft cap 3–5 · per-task branch)
- [ ] dispatch.md: merge-queue procedure (G2-order `--no-ff` per task · expected-vs-surprise conflict paths · two-tier verify · cleanup incl. Windows handle-lock (L-044) · stale-branch guardrail #51596)
- [ ] SKILL.md Sequence line routes to the worktree protocol (reword in place, cap held)
- [ ] CONTEXT §Streams updated — L-042 narrowed to intra-tree; worktree path noted
- [ ] exercised once on a real wave: ≥2 disjoint tasks dispatched via worktrees and merged by the queue

### T2 — Night-run core: pre-flight pass + trigger recipe (TASK-097) `[size: S · risk: low]` [HITL]
Layers: skills/orchestrator/references/ (new night-run reference)
Mechanism pre-locked in `docs/research/night-run.md` — headless `claude -p`, OS-scheduled,
`dontAsk` + scoped allowlist, never `bypassPermissions`. Consumer-generic (L-015).

**Acceptance:** pre-flight checklist (plan frozen · no open `assumes:` · scoped allowlist built)
+ a consumer-generic trigger recipe live in orchestrator references; dry-run exercised once.

**DoD:**
- [ ] night-run reference written: pre-flight checklist + `claude -p` trigger recipe (cron / Task Scheduler variants)
- [ ] wired: sprint-bulk names the night-run path (reword in place if SKILL.md needed)
- [ ] dry-run exercised once (pre-flight run on a real backlog state; trigger command validated)

## Owner-action checklist
- [ ] (post-sprint, optional) create the OS scheduler entry on this machine when a real night-run is wanted — lean-flow ships the recipe, never writes the scheduler.

## Decisions (pre-locked)
- **D1** — All design decisions inherited from SPRINT-025's fog-map + night-run.md; no new
  design surface. A contradiction discovered mid-build → scope-change log + re-confirm G2, never
  silent divergence from the research docs.

## Assumptions
- **A1** — dispatch.md and the new night-run reference are disjoint files; SKILL.md is the only
  potential shared file between T1/T2. *Confirm: G2 overlap map (single owner if both touch it).*
- **A2** — Claude-only v1; no external-agent surface enters this sprint. *Confirm: fog-map OUT-OF-SCOPE.*

## Execution Log

### 2026-07-29 | promote | plan locked (2 tasks: 096 · 097)
Governance signed off (no L-promotions · TD-008 not aged · TODO 136/~150 noted, rides TASK-091).
Cut: build sprint per owner choice — turn SPRINT-025 decisions into capability.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro

_(written at close)_
