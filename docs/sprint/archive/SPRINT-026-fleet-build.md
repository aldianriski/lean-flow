---
sprint: 026
slug: fleet-build
owner: Maintainer
last_updated: 2026-07-29
status: closed
plan_commit: f75064f
close_commit: 601e2e6
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
- [x] dispatch.md: worktree protocol (disjoint Tn → parallel `Agent(isolation:"worktree")` · soft cap 3–5 · per-task branch)
- [x] dispatch.md: merge-queue procedure (G2-order `--no-ff` per task · expected-vs-surprise conflict paths · two-tier verify · cleanup incl. Windows handle-lock (L-044) · stale-branch guardrail #51596)
- [x] SKILL.md Sequence line routes to the worktree protocol (reword in place, cap held)
- [x] CONTEXT §Streams updated — L-042 narrowed to intra-tree; worktree path noted
- [x] exercised once on a real wave: ≥2 disjoint tasks dispatched via worktrees and merged by the queue

### T2 — Night-run core: pre-flight pass + trigger recipe (TASK-097) `[size: S · risk: low]` [HITL]
Layers: skills/orchestrator/references/ (new night-run reference)
Mechanism pre-locked in `docs/research/night-run.md` — headless `claude -p`, OS-scheduled,
`dontAsk` + scoped allowlist, never `bypassPermissions`. Consumer-generic (L-015).

**Acceptance:** pre-flight checklist (plan frozen · no open `assumes:` · scoped allowlist built)
+ a consumer-generic trigger recipe live in orchestrator references; dry-run exercised once.

**DoD:**
- [x] night-run reference written: pre-flight checklist + `claude -p` trigger recipe (cron / Task Scheduler variants)
- [x] wired: sprint-bulk names the night-run path (reword in place if SKILL.md needed)
- [x] dry-run exercised once (pre-flight run on a real backlog state; trigger command validated)

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
| `skills/orchestrator/references/dispatch.md` | T1 | +worktree protocol & merge-queue sections; escalation framing reworded (worktree now first-class); base-ref caveat added | Med | wave itself exercised the protocol; qa-check green |
| `skills/orchestrator/references/night-run.md` | T2 | new — pre-flight checklist + trigger recipe (consumer-generic) | Low | dry-run on real state: guard correctly refused (HITL tasks); flags validated |
| `skills/orchestrator/SKILL.md` | T1+T2 | Sequence line → worktree protocol; Loop line → night-run path (coordinator-owned shared file) | Low | cap held 110/110 |
| `.claude/CONTEXT.md` | T1 | §Streams: worktree parallel-build path; L-042 narrowed to intra-tree | Low | 127 lines; qa-check green |

## Execution Log (wave)

### 2026-07-29 | execute | wave dispatched via the protocol it built — merged, wired, exercised
T1+T2 ran as worktree-isolated parallel agents; coordinator merge queue (G2 order, `--no-ff` each,
integration worktree) landed both; post-merge smoke caught a stale index (regenerated). **L-044
recurred live** (handle-lock on int-026 removal — recovery procedure worked as documented; count
1→2, promotion candidate at next promote). **New finding**: agent worktrees fork from the remote
default branch — unpushed main commits invisible in-tree; agents fell back to `git show
main:<path>` correctly; caveat now encoded in dispatch.md. T2 pre-flight dry-run on real state:
guard correctly refused an unattended run (HITL tasks in sprint) — negative path proven. All 8 DoD ticked.

## Retro

**Retrieval check** — no prior L/ADR contradicted; L-042's narrowing (decided SPRINT-025) is now
durably encoded (CONTEXT §Streams + dispatch.md), closing that loop.

**Worked**
- The wave exercised the protocol it was building — dispatch, merge queue, smoke check, L-044
  recovery, all validated on the sprint's own real work. Zero synthetic exercise needed.
- Pre-locked design made gates near-instant: no residual grill, no new decisions, build-only.
- The pre-flight dry-run's *negative* path fired on real state (HITL tasks → guard refused) —
  stronger evidence than a contrived pass.

**Friction**
- L-044 recurred exactly as documented (int-026 handle-lock) — count → 2, promotion due next promote.
- New: agent worktrees fork from the remote default branch — unpushed commits invisible (→ L-046,
  encoded in dispatch.md same-day).
- T1's agent flagged the stale escalation framing in dispatch.md's older sections — caught because
  the brief asked for a conflict check; reworded in the coordinator pass.

**Pattern candidate** (→ `docs/LEARNINGS.md`)
- L-046 filed (count 1) · L-044 bumped to count 2.

**Buckets routed** — Shipped → CHANGELOG v1.13.0 · Tech debt → none new · Follow-ups → TASK-098
flips `blocked → ready` (097 shipped) · Learnings → L-044 bump + L-046.
