---
owner: Maintainer
last_updated: 2026-08-09
status: current
id: mattpocock-adaptation
tags: [process, tooling]
domain: governance
related: [model-purpose]
---

# Research — what, if anything, from mattpocock/skills should lean-flow adopt?

> **Question.** Of the skills in [mattpocock/skills](https://github.com/mattpocock/skills), which carry a *delta* over lean-flow's existing surface worth adopting?
> **Verdict (scan 1, 2026-07-10).** **2 keepers + 1 micro; the real prize was a capability the scan surfaced — skill-powered tier dispatch.** The 7 skills were largely lean-flow's own loop with an *issue tracker* backend swapped in (reject the backend). Adopted: (1) `code-review`'s Standards-vs-Spec separation, (2) `wayfinder`'s decision-ticket / fog-graduation model, (3) the ADR-010 amendment handing dispatched sub-agents a *procedure skill*. **All three shipped.**
> **Verdict (re-scan 2, 2026-08-09).** **2 keepers of 5 examined.** Keep `grilling`'s **frontier batching + fact/decision separation** and `writing-for-agents`' **branching disclosure test + completion-criteria sharpness**. Reject `wizard`, `wait-what`, and — on re-check — any change from `wayfinder`. Detail → § Re-scan below.

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

## Re-scan (2026-08-09, SPRINT-047 T2)

Scan 1 closed with an explicit **"Not scanned"** list. Four of the five skills below sit in that
remainder; `wayfinder` is a re-check of something already adopted. The repo has also grown — 34
SKILL.md files across `engineering/`, `productivity/`, `in-progress/`, `misc/`.

| Skill | lean-flow equivalent | Verdict |
|---|---|---|
| `grill-me` → `grilling` | the intake grill (`/task-decomposer` Clarify) + G2 residual grill | **Keeper (technique)** |
| `writing-for-agents` | ADR-006 (cap = procedure; artifacts → `references/`) · DOCS_Guide HOW-filter | **Keeper (2 techniques)** |
| `wizard` | SPRINT template § Owner-action checklist · night-run's parked-HITL rule | **Reject** — concept owned |
| `wayfinder` | `/task-decomposer` fog-map mode (adopted from scan 1) | **Reject** — no change worth taking |
| `wait-what` | CONTEXT.md domain glossary · "Concise reporting" guideline | **Reject** (micro noted) |

### Keeper 1 — `grilling`: frontier batching + facts are never the user's job

**Frontier batching contradicts a rule we ship.** Decisions form a dependency tree; each round asks
the *entire frontier* — every decision whose prerequisites are settled — as one numbered batch, then
recomputes. Stops when the frontier is empty. Our rule is flatly *one question at a time* ("stacked
questions get vague answers"). The delta: **the discriminator is dependency, not count.** Batching
*dependent* questions is bad because the user must guess at inputs they haven't given; batching
*independent* ones is free. We ban both, so we over-correct — and SPRINT-047 proved it live, sending
two popups carrying two independent questions each, justified ad hoc as "not stacked ambiguity". The
frontier rule was being reinvented because the written rule didn't cover it.

**"Finding facts is your job, never the user's."** Research delegates to sub-agents running in
parallel *without blocking* other frontier questions — only the downstream branch waits. Our "explore
the codebase before asking" is the same instinct, weaker: it sequences recon *before* the grill rather
than treating an open fact as one more prerequisite in the tree.

### Keeper 2 — `writing-for-agents`: two techniques

- **A branching test for progressive disclosure** — "inline what *every* path needs; disclose what
  only *some* reach." ADR-006 gives the mechanism (procedure vs `references/`) but no criterion for
  which is which; a cap is a size limit, not a test. One line fixes that.
- **Completion criteria as behavioural levers** — vague bounds ("understanding reached") invite
  premature completion; demanding ones ("every rule applied") drive exhaustiveness without saying
  "be thorough". Applies directly to our DoD and Acceptance lines.

*Noted, not adopted:* it argues **negation is an anti-pattern** (prohibition activates the forbidden
behaviour), which cuts against CLAUDE.md's ❌ house style. Ours pair the trap with a positive rule,
blunting it — but the tension is real. Carried to § open questions.

### Rejects, with reasons

- **`wizard`** — an interactive bash script walking a human through dashboard/credential steps. The
  SPRINT template's **Owner-action checklist** already owns "non-dev actions a human must do", and
  night-run's park rule owns the boundary. The only delta is *executability* — a consumer-repo tool,
  not a loop skill, and lean-flow ships no scaffold by design.
- **`wayfinder`** — re-checked against our fog-map: all four map sections, decision-tickets and
  graduation still match. Genuinely new are **claim-first** (assign before working, so concurrent
  sessions don't collide) and a **one-ticket-per-session** limit. Both are issue-tracker artefacts
  scan 1 already rejected — our concurrency control is G2's ownership map plus worktree isolation,
  and `sprint-bulk` loops many tasks by design. Nothing to take.
- **`wait-what`** — on "wait, I don't understand", re-explain in ASD-STE100 Simplified Technical
  English anchored on the project's ubiquitous language. Plugs into an asset we keep (the CONTEXT.md
  glossary) but is a conversational move, not a loop stage, and we guard hard against skill-count
  bloat. **Micro if ever wanted:** one line in Behavioral Guidelines.

## Out of scope / open questions

**Closed since scan 1** — all three keepers shipped: Standards-vs-Spec is live in the review split;
skill-powered dispatch became ADR-010's spawn-with-brief contract; wayfinder's fog-mode ships as
`/task-decomposer --fog`. Scan 1's "follow-up tasks not yet filed" list is therefore spent.

**Still open**
- **Mechanism B vs C** — is skill self-fork (`context: fork`) worth the per-run cost over runtime
  invocation? Unchanged since scan 1; no new evidence either way. → `/prototype` or a follow-up TASK.
- **Negation in anti-patterns** — `writing-for-agents` argues prohibition activates the forbidden
  behaviour, which cuts against `.claude/CLAUDE.md`'s ❌ house style. Not a keeper, not dismissed. →
  a question for a doc-aging pass, needing evidence rather than a style preference.

**Not scanned (re-scan 2).** The repo now holds 34 SKILL.md files. Examined here: the 5 named. Still
uninspected: `grill-with-docs` · `domain-modeling` · `codebase-design` ·
`improve-codebase-architecture` · `teach` · `research` · `to-questionnaire` ·
`resolving-merge-conflicts` · the 6 `in-progress/` skills · the 4 `misc/` skills. Named so the gap is
a recorded boundary rather than an implied all-clear.
