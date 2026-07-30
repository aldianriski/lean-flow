# Dispatch — how /orchestrator hands work to sub-agents

Loaded by `/orchestrator` at any Implement step. The orchestrator is the `decision` tier: it **coordinates**
(plan · gate · grill · design · synthesis · merge results) — it does **not** do execution work inline. Work
is dispatched to sub-agents **by each task's classification**. (Doctrine: route by NATURE, not size —
ambiguity/consequence up, volume/repetition down; ADR-010.)

## Route by classification (nature, not size)

Each task carries a persisted `class:` field (advisory default set at decompose / G1). Dispatch reads it as
the default — task *size* is irrelevant — but may override at dispatch time; ADR-010's dispatch-time
classification stays authoritative:

| Classification | Tier (default map) | Dispatched? | Runs on |
|---|---|---|---|
| `decision` — ambiguity/consequence (gates · grill · design · synthesis) | session model (Opus) | no — stays inline | the orchestrator itself |
| `execution` — code from a spec · recon · analysis · drafting | Sonnet | **yes, by default** | a `general-purpose` sub-agent + its procedure skill |
| `mechanical-ingest` — extraction · validation · formatting · high-volume | Haiku | **yes, by default** | a `general-purpose` sub-agent |

**Default-spawn, not always-spawn.** A `decision`-nature or genuinely trivial step (a one-line edit, a quick
judgment call) stays inline — but only with a *stated reason*. The failure this prevents: the coordinator
doing `execution`/`mechanical` work itself instead of dispatching it (the observed "orchestrator never spawns" bug).

## Hand the sub-agent its procedure skill (not a re-described brief)

Dispatch on a `general-purpose` sub-agent (NOT `Explore`/`Plan` — those skip CLAUDE.md, losing project
context) with the relevant **procedure skill** invoked at runtime via the Skill tool: new behaviour →
`/tdd` · bug → `/diagnose` · hard-to-change → `/refactor-advisor`. The skill is the maintained procedure; a
paraphrased brief drifts from it (ADR-010 skill-dispatch amendment, mechanism C).

## Implement routing (which procedure the dispatched agent runs)

Pick the routed skill from the **work type**, then hand that skill to the sub-agent (above):

| Work type | Routes to |
|---|---|
| NEW testable behaviour | `/tdd` — **the default**, test-first red-green-refactor in vertical slices; test type → `tdd/references/test-strategy.md` |
| a bug / failing test | `/diagnose` — it already writes the regression test first |
| code that's hard to change (shallow modules, leaky seams) | `/refactor-advisor` |
| docs · config · spikes | implement directly, no routed skill |

**Declining `/tdd` needs a stated reason** — the owner opts out, or the repo has no harness. Either way,
note a manual verification step in its place; a silent skip is how spec-only debt enters (L-007).

**Drive with `/goal`.** Set a `/goal` equal to the task's done-when / acceptance so execution keeps working
across turns until it is verifiably met (Goal-Driven Execution, native), then clear it at task end.

## Parallel vs sequential

Decide from the **G2 overlap-ownership map** — the same map that assigns shared-file single-owner + order:

- **Parallel** — a task with **no shared file AND a persisted `Depends-on: none`** is independent. Dispatch
  independent tasks concurrently by issuing **multiple Agent calls in a single assistant message** (they run
  as background sub-agents). This is the speed win of `sprint-bulk`.
- **Sequential** — a task that **shares a file** (per the overlap map) or has a persisted `Depends-on:` list
  runs after its predecessor, in the ownership/commit order; stage shared files per-hunk (`git add -p`) —
  promoted rule.

Group the Plan into **parallel batches separated by sequential barriers**: fan out each batch of independent
tasks in one message, await it, then the next. Worktree isolation for a parallel batch is **first-class —
the protocol below**; `/batch` (one worktree sub-agent per unit → PR each; `/workflows` watches) remains the
escalation for very large fan-out where scripted determinism matters.

**Cost term** — fan-out cost scales with **branch-count × substrate-size, not call-count**: every branch
re-pays the full base substrate (CLAUDE.md + tool context) before doing any work; weigh it before fanning
out many trivial steps (ADR-010 addendum 2026-07-29).

## Worktree dispatch protocol (parallel fleet)

Fires at **sprint-bulk** when the G2 overlap map marks a batch's tasks disjoint (no shared file,
no `depends-on`): dispatch one `Agent(isolation: "worktree")` call per disjoint task, all in a
**single message**. Soft cap **3–5 concurrent** — no first-party concurrency limit is published
(folklore only); revisit if one ships. Rationale/decisions: the lean-flow repo's `docs/research/fog-fleet-orchestration.md`.

Each agent gets its own branch + working tree; it commits only its own files there and **never**
runs a tree-wide git state op (`stash` / `checkout` / `restore` / `reset`) — a state op on a shared
tree can sweep a sibling's uncommitted work (L-043; state this ban verbatim in every worktree
dispatch brief). It never touches a file the overlap map marks shared — those stay coordinator-owned.

Claude-only v1 — external CLI agents are out of scope until a real consumer signal; the
pre-decided shape (BYO opt-in + AGENTS.md brief carrier) is parked, not built.

Guardrail: stale-branch reuse on agent-id collision is an open harness issue (#51596). Before
dispatch, `git worktree list` should show no leftover agent worktrees — clean any first.

**Declared-base rule** (ADR-013 · L-055): every worktree/agent branches from the current wave's
declared base commit — stated up front, then verified against live HEAD at spawn, never assumed.
Mismatch halts dispatch for the wave. Re-run the check at every wave boundary, not just once at the
start — HEAD moves as waves land, so a base verified for wave 1 is stale by wave 2.

Base-ref caveat (observed on the first real wave): agent worktrees fork from the **remote default
branch**, not local HEAD (unless `worktree.baseRef: "head"` is set) — unpushed local commits are
invisible in an agent's tree. Brief agents to read newer docs via `git show main:<path>` (read-only,
L-043-safe); the three-way merge reconciles the old base cleanly as long as only the task's own
files changed on its branch. **Corollary: a task EDITING a file that exists only in unpushed
commits must not be worktree-dispatched** — the merge becomes add/add on that file. Fall back to
shared-tree parallel dispatch (disjoint files, agents run no git writes, coordinator commits
sequentially), or push / set `baseRef: "head"` first.

## Merge-back queue (coordinator-only)

Once a wave completes, merge on a **separate integration worktree** — never switch the main tree,
which may hold the coordinator's own WIP. Merge sequentially in **G2-ownership order**, one
`--no-ff` commit per task (clean per-task revert via `git revert -m 1`).

Review two-tier: **pre-merge** — full scoped review of each branch's diff, against that task's own
branch (the primary pass). **Post-merge** — an interaction-only smoke check per wave (lint/verify),
catching what per-branch review can't: cross-task interaction.

Conflicts: **expected** (overlap map named this file) → re-dispatch that agent to rebase onto the
new tip. **Surprise** (map missed it) → halt that task only, kick back to G2 — the map was
incomplete. Resolution is coordinator-owned, never a blind sub-agent. First-blocker-halt is
per-task; a whole wave halts only on a transitive dependency.

A broken or incomplete worktree never merges — return the task to backlog with an unblock
condition, salvage any doc/research artifacts, drop the code.

Cleanup (coordinator-only): leave the worktree directory **before** removing it — Windows holds a
handle-lock on any worktree a shell has `cd`'d into, so removal from inside it fails
Permission-denied mid-way (admin entry gone, directory left) (L-044). Retry `git worktree remove`
from a fresh shell, `rm` any stray directory, `git worktree prune`, verify with `git worktree list`.

L-042's per-hunk staging rule (`git add -p` on a shared file) still binds **intra-tree only** —
sequential tasks sharing one tree, or the coordinator staging conflict resolutions here. Worktree
isolation obsoletes it at the cross-worktree boundary: disjoint tasks never share a tree to begin with.

## Escalation

Execution fails twice, or a fork is genuinely ADR-grade → escalate by hand to your strongest model
(optionally `/council`). No automated ladder — that's agent behaviour a no-hooks plugin can't own (ADR-010).

## The ceiling (honest)

This is a **prompt-driven** skill: it makes dispatch the strong *default*, but can't *guarantee* the model
spawns. For large disjoint fan-out where determinism matters, use `/batch` (one worktree sub-agent per unit)
or `/workflows` — the deterministic path lean-flow deliberately keeps out of core (agent-free, ADR-002).
