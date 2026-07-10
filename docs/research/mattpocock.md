---
owner: Maintainer
last_updated: 2026-07-10
status: current
id: mattpocock-adaptation
tags: [process, tooling]
domain: governance
related: [model-purpose]
---

# Research — what, if anything, from mattpocock/skills should lean-flow adopt?

> **Question.** Of the 7 engineering skills in [mattpocock/skills](https://github.com/mattpocock/skills), which carry a *delta* over lean-flow's existing surface worth adopting — and does the set unlock a way to power dispatched sub-agents with skills (ADR-010)?
> **Verdict.** **2 keepers + 1 micro from the scan; the real prize is a capability the scan surfaced — skill-powered tier dispatch.** The 7 skills are largely lean-flow's own loop with an *issue tracker* backend swapped in (reject the backend). Adopt: (1) `code-review`'s Standards-vs-Spec separation, (2) `wayfinder`'s decision-ticket / fog-graduation model for foggy work. Then amend ADR-010 so `/orchestrator`'s execution dispatch hands the sub-agent a *procedure skill*, not just a prose brief.

## Why this matters

lean-flow keeps being offered near-identical loops (bmad, structarmed, brainstorming — all fast rejects, L-017). The recurring value is never the whole framework; it's the one or two techniques we lack. Guessing wrong here means either importing a redundant tracker dependency (off-ethos) or missing a genuine execution-quality upgrade.

## What the repo is

An **issue-tracker-centric** rebuild of lean-flow's loop: idea → `to-spec` → `to-tickets` → `implement` (tdd + `code-review`) → ship, with `triage` / `diagnose` / `wayfinder` on-ramps and `ask-matt` as a router. The one structural difference coloring all of it: shared state lives in a **real tracker** (GitHub Issues / GitLab / local `.scratch/*.md`), where lean-flow keeps it in-repo (`TODO.md` + `docs/sprint/*.md`).

## Delta map (L-017)

| Matt skill | lean-flow equivalent | Verdict |
|---|---|---|
| `implement` | `/orchestrator` — richer (G1/G2 gates, 3 modes, tdd/diagnose routing) | **Reject** (covered) — but see § Skill-powered dispatch |
| `to-tickets` | `/task-decomposer` (vertical slices, risk, `depends-on`/`blocked`) | **Reject** — *expand–contract* naming is a micro-keeper |
| `to-spec` | `/task-decomposer` PRD template + `/lean-doc-generator` | **Reject** — its "no interview, synthesize" ethos directly *contradicts* our grill-at-intake |
| `ask-matt` | CONTEXT.md roster + `/flow` + skill auto-dispatch | **Reject** — Claude already routes on descriptions |
| `setup-matt-pocock-skills` | We ship **no scaffold** (adaptable, degrade gracefully); `/lean-doc-generator init` covers fresh scaffold | **Reject** — its purpose is to configure the tracker backend we don't want |
| `wayfinder` | partial: `/task-decomposer` + `/prototype` + research spikes | **Keeper (technique)** |
| `code-review` | dispatched built-in `/code-review` (single self-review checklist) | **Keeper (principle)** |

## Keepers

- **`code-review` — Standards vs Spec separation.** Reviews two *independent* axes and refuses to merge/re-rank them: **Standards** (obeys repo conventions?) vs **Spec** (builds the *right thing*?). Insight: "perfect code, wrong feature" and "right feature, violated conventions" are different failures — merging lets one mask the other. Our review is one checklist; this split is a real delta. *Source:* code-review/SKILL.md § Separation Principle.
- **`wayfinder` — decision-ticket + fog-graduation.** For work *too big to even plan in one session*: tickets resolve **decisions, not deliverables**; a `map` index tracks Destination / Decisions-so-far / Not-yet-specified (fog) / Out-of-scope, and you "graduate fog into new tickets" as it sharpens. lean-flow sizes *known* work well and answers *single* design questions (`/prototype`, `/council`) — but has no structured method for a large **foggy** problem where the tasks aren't knowable yet. Closest real gap. *Source:* wayfinder/SKILL.md.
- **micro — expand–contract** for wide refactors (add new form alongside old → migrate in batches → remove old). `/refactor-advisor` doesn't name it; one-line reference at most.

## Skill-powered tier dispatch (the prize — your note)

**Confirmed capability** (Claude Code docs, verified via claude-code-guide): a dispatched sub-agent CAN run a skill. Three mechanisms, ranked by fit with our **agent-free-core** principle:

- **C — runtime invocation (best fit).** `/orchestrator` dispatches a built-in agent (Agent tool — *already* how ADR-010 tier-routing works) and instructs it to invoke `/tdd` at runtime via the `Skill` tool. No new files. Turns "spawn-with-brief" into "spawn-with-brief **+ procedure skill**" — execution follows discipline (tdd at seams → code-review → commit) instead of improvising. *Small, reversible ADR-010 amendment.*
- **B — skill self-fork.** A SKILL.md declares `context: fork` + `agent:` + `model:` in its own frontmatter, forking into a tiered sub-agent with **no agent definition**. Reconciles with agent-free-core; heavier (fork cost per run). A later evolution if C proves out.
- **A — agent def with `skills:` preload.** `.claude/agents/*.md` injects skill content at startup. **Crosses the agent-free-core line** (we ship no agent definitions) — ADR/council-grade, like the provider dep in TASK-047. Not recommended without that gate.

**Gotchas:** (i) preload/model-trigger requires the skill to be model-invocable — lean-flow's skills qualify, but Matt's all set `disable-model-invocation: true` (can't be preloaded), a caution if ever adopting them literally; (ii) built-in `Explore`/`Plan` skip CLAUDE.md — a forked execution agent should be `general-purpose`, not those, so it inherits project context. *Source:* code.claude.com/docs sub-agents.md, skills.md.

## Recommendation

- **Adopt now (small, reversible):** fold the **Standards-vs-Spec split** into review guidance; name **expand–contract** in `/refactor-advisor`.
- **Adopt as ADR-010 amendment (mechanism C):** `/orchestrator` execution dispatch = brief **+** runtime skill invocation on the tiered sub-agent. Highest workflow leverage, stays agent-free.
- **Design candidate (technique):** wayfinder's fog-mapping as a pre-decomposition mode in `/task-decomposer` (not a new skill) — for work too foggy to slice.
- **Reject:** the tracker backend and the `setup-*` scaffold (off-ethos: adds a `gh`/`glab`/external dependency for state we keep in-repo and git-versioned).

## Out of scope / open questions

- **Mechanism B vs C** — is skill self-fork (`context: fork`) worth the per-run fork cost over runtime invocation? Prototype after C ships. → `/prototype` or a follow-up TASK.
- **Wayfinder fog-mode** — worth building, or does `/prototype` + research-spike already cover "foggy" adequately? Needs a real foggy problem to test against. → design call at next `promote`.
- **Not scanned:** the ~10 skills `ask-matt` references but not listed (grill-with-docs, domain-modeling, codebase-design, improve-codebase-architecture, teach, research, writing-great-skills, compact) — only the 7 given were inspected.
- **Follow-up tasks not yet filed** — proposed: (T) review Standards-vs-Spec split; (T) ADR-010 skill-powered-dispatch amendment; (T) refactor-advisor expand–contract ref; (T) wayfinder fog-mode design spike. Awaiting go-ahead to write to `TODO.md`.
