---
id: ADR-010
tags: [tooling]
domain: governance
status: accepted
related: [ADR-002, ADR-001]
---

# ADR-010 — Role-based model-dispatch tiers (slimmed adoption; no auto-ladder)

- **Status:** accepted (2026-07-10)
- **Deciders:** Maintainer
- **Context driver:** capability-fit routing — the current 2-tier scheme (session model vs cheap sonnet) conflates "cheap" with "the right model for the task's *nature*", and the maintainer confirms it has misrouted in practice (judgment landing on cheap-tier · bulk mechanical work burning session-model tokens). Bounded by two invariants: **agent-free / no-hooks** (ADR-002) and **consumer-installable + adaptable** (L-015).

## Context

A general cross-project routing doctrine ([model-purpose.md](../research/model-purpose.md)) proposes a
4-tier map (Fable=hard-judgment · Opus=orchestration · Sonnet=execution · Haiku=mechanical/ingest) routed
by "ambiguity & consequence up, volume & repetition down", plus an automated Haiku→Sonnet→Fable
escalate-on-verify-fail ladder. Importing it wholesale would violate curated-not-copied (ADR-001) — the
doc self-admits foreign-pipeline origin. A `/council` run (5 advisors · peer review · moderator) pushed
back: 4/5 rejected wholesale adoption; the escalation ladder is a state-machine-on-tool-output = **agent
behaviour a no-hooks plugin structurally cannot own** (ADR-002); the moderator surfaced the decisive
split — lean-flow **cannot** control the installer's *session* model, only the models its skills
*dispatch to*. So the doctrine's enforceable surface is subagent dispatch, not the session.

## Decision

Adopt a **slimmed, role-based, remappable, dispatch-only** tier map — not the raw 4-tier doctrine, not
the ladder:

1. **Role-named tiers** (not model names — those go stale): `decision`→Opus · `execution`→Sonnet ·
   `mechanical/ingest`→Haiku, as a **remappable default map** in `.claude/CONTEXT.md` (the vocab SSOT);
   an undefined role falls back to the next-strongest defined role, so a consumer without a given model
   still runs (L-015).
2. **Enforceable vs advisory split:** encode the **dispatch** tiers (which model a skill spawns subagents
   on — e.g. council advisors, orchestrator recon/build); the **session** tier is a one-line *suggestion*
   ("run judgment on your strongest model"), never a rule lean-flow can't enforce.
3. **`decision-escalation` (Fable) = no dispatch row** — a single manual-escalation clause: "execution
   fails twice, or a fork is genuinely ADR-grade → escalate by hand to your strongest model (optionally
   via `/council`)."
4. **No automated ladder.** Escalation stays manual; a fail point may dispatch a **built-in**
   (`/verify` · `/diagnose`) — already lean-flow's pattern — never a custom hook/agent.
5. Keep the one portable principle: **route by ambiguity & consequence, not size.**

## Consequences

**Positive:** capability-fit routing where lean-flow actually has a surface (subagent dispatch); token
efficiency; consumer-adaptable via the remappable role map; stays agent-free (ADR-002 intact); the doctrine
lives in the SSOT, not a new artifact.
**Negative (trade-offs accepted):** role→model indirection adds a lookup layer over a ~3-model reality;
the map risks being **inert prose** unless wired into the specific dispatch points and **exercised once**
on a real dispatch (L-007); the enforceable/advisory split is subtle and can be misread as a hard rule.

## Alternatives considered

| Option | Why rejected |
|---|---|
| Adopt the full 4-tier doctrine + auto-escalation ladder | the ladder is agent behaviour a no-hooks plugin can't own (ADR-002); wholesale import violates curated-not-copied (ADR-001) — unanimously the panel's blind spot |
| Keep the 2-tier scheme unchanged | the confirmed misroute justifies capability-fit routing; 2-tier conflates "cheap" with "right model for the nature of the task" |
| Publish a standalone `MODEL-DOCTRINE.md` (Expansionist) | over-reach; the role map belongs in the CONTEXT SSOT, not a new artifact other repos would fork out of context |
| Hard-pin model names (Fable/Opus/Sonnet/Haiku) in the dispatch points | names go stale (this session's own lineup rename proves it); breaks consumer adaptability (L-015) |

## Amendment (2026-07-10) — skill-powered execution dispatch

**Status:** accepted · extends Decision §2 (dispatch tiers). **Source:** [mattpocock.md](../research/mattpocock.md) § Skill-powered tier dispatch.

**Decision.** When `/orchestrator` dispatches `execution` work to a sub-agent, equip it with the relevant
**procedure skill** — `/tdd` · `/diagnose` · `/refactor-advisor`, invoked at runtime via the Skill tool —
rather than a prose brief that re-describes the procedure. The skill is the single maintained source of
that procedure; a paraphrased brief drifts from it over time. Mechanism **C only**: runtime Skill
invocation on a `general-purpose` dispatch sub-agent. Plugin skills are globally discoverable inside a
sub-agent, so this needs **no agent definition** and stays agent-free (ADR-002 intact).

**Rejected here:** mechanism **A** — an `.claude/agents/*.md` definition with a `skills:` preload list —
introduces an agent definition, crossing the agent-free line; revisit only via `/council`/ADR, like a
provider dependency (cf. TASK-047). Mechanism **B** — a skill self-forking via `context: fork` — deferred:
heavier per run, no agent-free gain over C.

**Consequence (negative).** The dispatch sub-agent must carry the `Skill` tool (default: inherit) and
pays a one-time skill-load cost; and it must be `general-purpose`, not `Explore`/`Plan` (those skip
CLAUDE.md, losing project context). Exercised once on real input (SPRINT-020 T1); the `/tdd`-specific
path is a **consumer-path** claim — lean-flow is markdown-only and cannot dogfood it (L-016).

## Amendment (2026-07-10) — dispatch-by-classification + parallel/sequential

**Status:** accepted · operationalizes Decision §1–2 (role tiers → actual dispatch). **Source:** SPRINT-023
(dispatch wasn't firing in practice — the orchestrator did execution inline and made no parallel/sequential decision).

**Decision.**
1. `/orchestrator` is the `decision`-tier **coordinator** — it plans / gates / grills / merges, it does **not**
   execute inline. Execution is **dispatched by each task's classification** (`execution`→Sonnet ·
   `mechanical-ingest`→Haiku — route by nature not size, [model-purpose.md](../research/model-purpose.md)),
   handed its procedure skill; a `decision`-nature/trivial step stays inline **only with a stated reason**
   (default-spawn, *not* always-spawn).
2. **Parallel vs sequential** is decided from the G2 overlap map: disjoint (no shared file, no `depends-on`)
   → **parallel** (multiple Agent calls in one message); shared/dependent → **sequential** (ownership order).
3. The dispatching skills (`orchestrator` · `council` · `flow`) list `Agent, Task` in `allowed-tools` so
   dispatch **auto-approves** (no per-spawn permission prompt). Full operational detail →
   `skills/orchestrator/references/dispatch.md`.

**Consequence (negative).** This is a **prompt-driven nudge, not a guarantee** — a skill can't force the
model to spawn or parallelize; the deterministic path for large fan-out stays `/batch`·`/workflows` (kept out
of core, ADR-002). The classification→dispatch indirection also assumes tasks are correctly classified at
decompose/G1 — a mis-classification mis-routes.

## Amendment (2026-07-29) — dispatch-cost awareness (N × substrate)

**Status:** accepted · qualifies Decision §5 (route by nature) with a cost term. **Source:**
[adhd-adaptation.md](../research/adhd-adaptation.md) (the scan's single keeper · TASK-099, SPRINT-029).

**Decision.** Weigh parallel fan-out cost as **branch-count × substrate-size, not call-count**: every
dispatched branch re-pays the full base substrate (CLAUDE.md + tool/skill context) before doing any work,
so cheap-tier branches are cheap per *token*, not per *spawn* — a wide fan-out of trivial steps can cost
more than doing them inline or sequentially. This sharpens, not weakens, default-spawn: the stated-reason
clause for staying inline may cite this cost term.
