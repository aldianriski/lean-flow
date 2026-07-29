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

- **Harness worktree inventory** (2026-07-29, research ticket): the harness already provides
  nearly all mechanics free — `--worktree` sessions, mid-session `EnterWorktree`/`ExitWorktree`,
  per-agent `Agent(isolation: "worktree")` with auto-cleanup/locking, `.worktreeinclude` secret
  propagation, project-scope plugins + saved bash approvals shared into worktrees (v2.1.200+/211+).
  **lean-flow must add only procedure**: a dispatch instruction (disjoint → one worktree-isolated
  Agent call per task), a documented merge-back step (→ merge-back ticket), guardrail notes
  (stale-branch-reuse bug #51596 · min-version v2.1.2xx · Windows long-path prereq). Structural
  gap: with no shipped `.claude/agents/`, `isolation: worktree` is only ever an ad-hoc Agent-call
  instruction, never a permanent agent property. Concurrency caps are folklore (no first-party
  number found); practical sweet spot 3–5 parallel — matches sprint scale. Token cost ≈ linear × N.
- **AGENTS.md brief carrier** (2026-07-29, TASK-093 scan → `agents-md-adoption.md`): **yes,
  conditionally** — AGENTS.md is the brief format for non-Claude CLI agents *if/when* the fleet
  seam graduates (codex ✓ · kimi ✓ ships one itself · GLM = unverified, check before any build).
  No hand-authored template for consumers (dupe/drift); at most a *generated* stub at init/migrate,
  deferred until a real non-Claude consumer exists. Both keepers parked as proposals in the doc.
- **Dispatch unit** (2026-07-29, grill): **the sprint task Tn** — one worktree per disjoint Plan
  task; G2 map fixes merge order; streams stay the coarse human layer; review rides pre-merge
  inside each task's worktree. Matches the 3–5-parallel sweet spot and per-task revert/halt.
- **Merge-back strategy** (2026-07-29, research ticket): **sequential merge queue in G2-ownership
  order, one merge commit per task** — the only strategy that reuses the G2 overlap map as-is and
  keeps per-task revertability. Conflict path: expected (map-named) → re-dispatch "rebase onto new
  tip"; surprise → halt that task only, kick back to G2 (map was incomplete). Resolution is
  coordinator-owned (decision tier), never a blind sub-agent. First-blocker-halt becomes
  **per-task**, whole-wave only on transitive dependency. G2 map's role narrows to fixing merge
  ORDER (isolation already makes disjoint parallel safe). **L-042 verdict: obsoleted at the
  cross-worktree boundary, still binds inside one tree** (sequential sub-tasks · coordinator
  staging conflict resolutions). Failure path: broken worktree never merges — task back to
  backlog, salvage doc/research artifacts, drop code, coordinator-only cleanup (L-043). Verify
  two-tier: full review pre-merge in-worktree · interaction-only smoke check post-merge per wave.

## DECISION TICKETS

| Ticket | Type / Mode | Resolves via | Status |
|---|---|---|---|
| Harness worktree inventory — what `EnterWorktree` / Agent `isolation: worktree` / workflows already give vs what lean-flow must add | Research · AFK | research-spike (↔ TASK-094 harness-engineering scan) | **resolved** → DECISIONS |
| Merge-back strategy — N worktrees → one branch; conflict/failure path; relation to the G2 overlap-ownership map | Research · AFK | research-spike | **resolved** → DECISIONS |
| Dispatch unit — what parallelizes: sprint Tn · streams · review passes? | Grilling · HITL | intake grill (AskUserQuestion) | **resolved** → DECISIONS |
| External-agent consent gate — does the BYO seam extend to CLI agents; what config/consent shape? | Grilling · HITL | intake grill (likely /council if it forks hard) | open |
| AGENTS.md as the brief carrier for non-Claude agents | Task | → TASK-093 scan | **resolved** → DECISIONS |
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
