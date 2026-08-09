---
epic: 001
slug: parallel-worktree-fleet
owner: Maintainer
last_updated: 2026-08-09
status: closed
member_sprints: [SPRINT-025, SPRINT-026]
update_trigger: a member sprint closes, or a decision lands that changes the outcome
---

# EPIC-001 — Parallel Worktree Fleet

> **Outcome:** `/orchestrator sprint-bulk` can build disjoint sprint tasks **concurrently** — one
> worktree-isolated agent per task — and land them through a coordinator merge-back queue, without
> two agents ever editing the same file.

> *Retro-fitted 2026-08-09 (SPRINT-048 T1) from the SPRINT-025/026 archives and
> `docs/research/fog-fleet-orchestration.md`. This epic ran and finished **before** the epic layer
> existed; it is reconstructed here because it was the concrete case that proved the layer was
> missing — until now its status was recoverable only by reading two sprint archives and three
> research docs, and it is still cited as a live gate in `docs/research/agents-md-adoption.md`.*

## Why this, why now

A sprint's tasks are frequently disjoint, and executing them one at a time wastes the one thing an
agent fleet is good at — width. The blocker was never ambition, it was safety: parallel agents editing
a shared working tree corrupt each other, and the failure surfaces at merge, long after the cause.
The outcome needed both an isolation mechanism (worktrees) and an ownership discipline (the G2 overlap
map) to be worth anything, which is more than one sprint could carry — the decisions had to be made
before the mechanism was built, and the decisions were not known up front.

## Scope

**In:** worktree-isolated parallel dispatch from `sprint-bulk` · a coordinator merge-back queue ·
shared-file ownership mapped at G2 before any fan-out · the pre-dispatch preflight that halts a wave
on cycle / unowned-overlap / base-ref drift.
**Out (explicitly not):** **non-Claude CLI agents** — Claude-only v1 stands, decided at SPRINT-026 ·
night-run unattended execution, a *sibling* capability (fleet = parallel width, night-run = unattended
time) tracked separately · any hook or agent-definition file, which ADR-002 forbids in core.

## Member sprints

| Sprint | Theme | Status | What it contributed to the outcome |
|---|---|---|---|
| [SPRINT-025](../sprint/archive/SPRINT-025-fleet-foundations.md) | Fleet & Night-Run Foundations | closed · `2eb9bd5` | Decide-before-build. Drove the fleet fog-map from chart to full graduation inside one sprint, turning unknown decisions into buildable tasks — the epic existed as fog until this closed. |
| [SPRINT-026](../sprint/archive/SPRINT-026-fleet-build.md) | Fleet & Night-Run Build | closed · `601e2e6` | Built it: worktree dispatch + merge-back wired into `sprint-bulk`. This is the sprint the outcome sentence became true. |

## Decisions

- **D1** — isolation is a **git worktree per task**, not a shared tree with locking. Locking needs a
  protocol every agent honours; a worktree makes collision structurally impossible. **→ dispatch.md
  § Merge-back queue.**
- **D2** — **Claude-only for v1.** External CLI agents were scoped out at SPRINT-026 rather than
  designed-for-and-deferred, so nothing in the mechanism assumes a brief format.
- **D3** — ownership is decided at **G2, before the first task dispatches**, not discovered at merge.
  Every file touched by more than one task gets a single owner and a commit order. **→ ADR-002**
  (built-ins, no custom agents) constrains how the fleet is dispatched.

## Open questions

- **Does a non-Claude consumer ever graduate?** If it does, `AGENTS.md` is the brief-carrier — that is
  already researched and conditionally approved, waiting on the trigger.
  → `docs/research/agents-md-adoption.md`; its own `update_trigger` names this epic, which is why this
  file now exists to be pointed at.

## Closed when

- [x] `sprint-bulk` dispatches disjoint tasks in parallel, worktree-isolated, one agent per task
- [x] A coordinator merge-back queue lands them without cross-task contamination
- [x] Shared-file ownership is mapped at G2 and enforced by the pre-dispatch preflight
- [x] Exercised on real sprints — SPRINT-039 ran two tasks in parallel waves; 041/043/045 followed

**Closed 2026-08-09**, retro-fitted at its recorded end state. The Claude-only boundary (D2) is a
stated scope edge, not unfinished work: a non-Claude consumer would open a **new** epic rather than
reopen this one, since nothing in the delivered mechanism would change.
