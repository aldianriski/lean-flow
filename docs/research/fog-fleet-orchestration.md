---
owner: Maintainer
last_updated: 2026-07-29
update_trigger: A ticket resolves/graduates, new fog appears, or the destination shifts
status: current
id: fog-fleet-orchestration
tags: [process, orchestration]
domain: skills
related: [council-improvements, architecture-baselines]
---

# Fog-map — Fleet orchestration (worktree multi-agent execution)

> Living map (task-decomposer fog-map mode). An **index of decisions, not a plan** — tickets
> resolve uncertainties, then graduate buildable work into `TASK-NNN`. Driven by **TASK-089**.

## DESTINATION

Parallel multi-agent execution in isolated git worktrees boosting sprint throughput —
Claude-native first, generalizable to any CLI agent (codex / kimi / glm) via a BYO opt-in seam.

## NOTES

- Axioms: curated-not-copied (ADR-001) · no shipped agents/hooks · provider dependency only as
  **BYO, opt-in, disabled-by-default** (TASK-047 reframe) — lean-flow ships a seam, never the
  trust boundary or credentials.
- Worktrees dissolve the L-042 commit-contamination hazard that forces today's "serialize
  overlapping streams" rule (CONTEXT § Streams) — for *disjoint* tasks; overlap still needs the
  G2 overlap-ownership map.
- Night-run (TASK-090) is a sibling capability: fleet = parallel width, night-run = unattended
  length. Their interaction is listed fog, not assumed.

## DECISIONS SO FAR

_(none yet — chart phase, 2026-07-29)_

## DECISION TICKETS

| Ticket | Type / Mode | Resolves via | Status |
|---|---|---|---|
| Harness worktree inventory — what `EnterWorktree` / Agent `isolation: worktree` / workflows already give vs what lean-flow must add | Research · AFK | research-spike (↔ TASK-094 harness-engineering scan) | open |
| Merge-back strategy — N worktrees → one branch; conflict/failure path; relation to the G2 overlap-ownership map | Research · AFK | research-spike | open |
| Dispatch unit — what parallelizes: sprint Tn · streams · review passes? | Grilling · HITL | intake grill (AskUserQuestion) | open |
| External-agent consent gate — does the BYO seam extend to CLI agents; what config/consent shape? | Grilling · HITL | intake grill (likely /council if it forks hard) | open |
| AGENTS.md as the brief carrier for non-Claude agents | Task | → TASK-093 scan | open |
| Feel the merge — run one real task pair in parallel worktrees end-to-end | Prototype · HITL | /prototype | open (after inventory + merge-back) |

Dependencies: *prototype* waits on *inventory* + *merge-back*; the two grilling tickets are
unblocked; *AGENTS.md* resolves via TASK-093.

## NOT YET SPECIFIED (fog)

- Parallel review/quality gating — who reviews N concurrent outputs, and when.
- Night-run interaction (TASK-090) — can fleet width and unattended length compose in v1?
- Concurrency caps / resource limits per host.

## OUT OF SCOPE

- Shipping agent definitions or hooks in the plugin (agent-free core stands).
- lean-flow owning provider credentials — BYO only.
- Auto-approving G1/G2 — gates stay human-approved regardless of parallelism.
