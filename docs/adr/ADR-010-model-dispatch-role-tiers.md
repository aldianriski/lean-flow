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
