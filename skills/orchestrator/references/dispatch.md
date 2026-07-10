# Dispatch — how /orchestrator hands work to sub-agents

Loaded by `/orchestrator` at any Implement step. The orchestrator is the `decision` tier: it **coordinates**
(plan · gate · grill · design · synthesis · merge results) — it does **not** do execution work inline. Work
is dispatched to sub-agents **by each task's classification**. (Doctrine: `docs/research/model-purpose.md` · ADR-010.)

## Route by classification (nature, not size)

Each task was already classified at decompose / G1. Dispatch follows that classification — task *size* is irrelevant:

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

## Parallel vs sequential

Decide from the **G2 overlap-ownership map** — the same map that assigns shared-file single-owner + order:

- **Parallel** — a task with **no shared file AND no `depends-on`** is independent. Dispatch independent
  tasks concurrently by issuing **multiple Agent calls in a single assistant message** (they run as
  background sub-agents). This is the speed win of `sprint-bulk`.
- **Sequential** — a task that **shares a file** (per the overlap map) or has a `depends-on` runs after its
  predecessor, in the ownership/commit order; stage shared files per-hunk (`git add -p`) — L-042/L-037.

Group the Plan into **parallel batches separated by sequential barriers**: fan out each batch of independent
tasks in one message, await it, then the next. For large disjoint fan-out where you want determinism +
worktree isolation, escalate to `/batch` (one worktree sub-agent per unit → PR each; `/workflows` watches).

## Escalation

Execution fails twice, or a fork is genuinely ADR-grade → escalate by hand to your strongest model
(optionally `/council`). No automated ladder — that's agent behaviour a no-hooks plugin can't own (ADR-010).

## The ceiling (honest)

This is a **prompt-driven** skill: it makes dispatch the strong *default*, but can't *guarantee* the model
spawns. For large disjoint fan-out where determinism matters, use `/batch` (one worktree sub-agent per unit)
or `/workflows` — the deterministic path lean-flow deliberately keeps out of core (agent-free, ADR-002).
