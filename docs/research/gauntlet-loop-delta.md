---
owner: Maintainer
last_updated: 2026-08-14
update_trigger: Question revisited, or a new option/source changes the recommendation
status: current
id: gauntlet-loop-delta
tags: [process, tooling]
domain: skills
related: [fog-fleet-orchestration, ADR-010, ADR-016, L-017, L-058]
---

# Research — Which of the "gauntlet loop" mechanics does lean-flow not already have?

> **Question.** The gauntlet loop (lead → parallel builders → independent critic → compare against an
> external reference → return the biggest gap → repeat) is being reported as the Opus 5 multi-agent
> pattern. Which of its parts are a real delta over lean-flow's existing surface, and do we adopt them?
> **Verdict.** Two, both small. Give the critic's **Spec** axis an *external* comparand, and feed the
> already-computed worst-finding-per-axis back into a **bounded** builder retry. Everything else is
> matched, and four parts of it we specify more tightly than the source does. Whether that retry may
> run **unattended** is a separate, ADR-grade fork — it collides with the execute-only charter.

## Why this matters

L-017 is the standing rule: an external technique is judged on its **delta** over what we already
have, never on standalone merit — map first, and only the unmatched remainder is a keeper. The cost
of skipping that map here is concrete: the pattern's vocabulary ("agent fleet") collides with
**EPIC-005 Fleet**, which means something entirely different (many *repos*, one pinned standard
version), and adopting on vocabulary would file this work under the wrong epic and build fleet
mechanics for a problem `/orchestrator` already owns.

## Options considered

- **A — Adopt wholesale.** New lead / builder / critic / integrator roles as skills. *Trade-off:*
  duplicates `/task-decomposer`, spawn-with-brief dispatch, and the isolated review pass — three
  surfaces we already ship, two of them stricter. This is the dev-flow bulk-import mistake.
- **B — Adopt the two unmatched mechanics into existing surface.** The comparand and the retry land in
  `orchestrator/references/review-scoping.md`, hooked from the SKILL's Review step. *Trade-off:*
  smallest possible change; but the retry is genuinely new control flow, so it needs the L-058
  treatment (exercised once on real input, once on input that must FAIL, fixtures retained).
- **C — Adopt nothing.** Rule that `done-when` plus the must-FAIL fixtures already constitute an
  external reference. *Trade-off:* free, and defensible for gates — but it leaves the Spec axis
  measuring work against a criterion written by the same pipeline that built it.
- **D — Defer entirely to EPIC-004.** *Trade-off:* EPIC-004 is about *conformance reporting* turned
  outward at consumers; the retry loop is about *execution quality* inward. Related, not the same job.

## Findings

- **Decomposition and parallel builders are matched.** `/task-decomposer`'s intake grill plus
  `sprint-bulk` step 3 (disjoint tasks → parallel `Agent(isolation:"worktree")`, coordinator merge-back
  queue) is the same shape. *Source:* `skills/orchestrator/SKILL.md`, `references/dispatch.md`.
- **Builder briefing is stronger here.** ADR-010's contract is spawn-with-**procedure-skill** (`/tdd`
  · `/diagnose` · `/refactor-advisor`), explicitly *not* a re-described brief. The source describes
  role-prompted specialists. *Source:* `.claude/CONTEXT.md` § Model tiers.
- **Critic independence is matched and better specified.** Fresh isolated context, brief scoped to
  diff + one-hop blast radius, **Standards vs Spec reported separately and never re-ranked**, and an
  adversarial floor (0 findings ⇒ assume-guilty re-run). The source states the separation-of-powers
  principle; it does not split the axes or floor the sycophantic pass. *Source:*
  `orchestrator/references/review-scoping.md`.
- **The external comparand is a partial gap → favours B.** Our Spec axis compares against the task's
  own `done-when`. External comparands exist in the repo, but only for **gates** (a retained must-FAIL
  fixture failing with its *named* finding, L-058) and for behaviour (`/run` + `/verify`). No task
  carries a reference artifact the critic measures the output against. *Source:* § Task entry shape;
  `docs/LEARNINGS.md` L-058.
- **The retry is a wiring gap, not a capability gap → favours B.** review-scoping.md already ends a
  pass by naming "the single worst finding **per axis**". Nothing consumes it: review is terminal and
  findings go to the owner. The only re-dispatch anywhere in `dispatch.md` is a merge-conflict rebase.
  This is the L-020 shape — a computed value that was never wired to its consumer.
- **Stopping conditions collide with the charter.** The source's loop persists until the bar is met,
  gains go negligible, or budget is exhausted. Our unattended run stops on Plan exhaustion or
  first-blocker, with an ADR-016 rollup. A critic ruling "not good enough, retry" is a **decision**,
  and the unattended charter is **execute-only — decide nothing**. Either the loop stays attended, or
  it needs an explicit carve-out with a hard retry ceiling and a rollup line per retry.
- **Self-generated judging machinery is matched, and its inversion is rejected.** We ship 11
  `check-*.sh` and 24 eval harnesses with a retained must-FAIL fixture per check. The source's
  variant — the *agent* generates the harness per artifact — collides with **EPIC-004 D1** (the engine
  is spec-driven; rules come from the spec, not from code). *Source:* EPIC-004 § Decisions.
- **The source's own conclusion is already our charter.** "The strongest workflow is not 'never look
  at the agent again'. It is 'let the agent work for much longer between high-value human
  interventions'" restates G1/G2 plus park-never-decide and absence-≠-consent.
- **The parallel-builder half is already mapped prior art.** `fog-fleet-orchestration.md` is the
  living fog-map for worktree multi-agent execution and already draws the distinction this scan needs:
  "fleet = parallel width, night-run = unattended". It contains nothing on critics, retries,
  comparands, convergence, or budgets — so it confirms the delta rather than covering it.
- **"Fleet" is a false cognate.** The source means many agents on one goal in one repo — which is
  ADR-010 dispatch. **EPIC-005 Fleet** means many repos pinned to one standard version. Only the
  *budget* half touches EPIC-005, via its **D2** (delegation policy declared per repo and read by the
  run, never held by a coordinator process) — a retry budget is exactly that policy.
- **Not blocked behind TASK-196.** The natural home is a skill `references/` file, uncounted under
  ADR-006, with a one-line SKILL.md hook (`orchestrator/SKILL.md` is 103 of ~140). `CLAUDE.md` (80/80)
  and `CONTEXT.md` (~133/150) stay untouched — so this does *not* inherit TASK-200's blocker.
- **Dogfooding vehicle exists.** Per L-016 a markdown repo has no testable code to exercise a
  code-critic loop on. But a doc rendered by `/lean-doc-generator` against its own template **is** an
  external comparand — that is the consumer-path exercise, not a simulation of one.

## Recommendation

**Option B.** Adopt exactly two mechanics into `orchestrator/references/review-scoping.md`: an
external comparand for the Spec axis, and a bounded retry consuming the worst finding per axis. Reject
A (duplicates three existing surfaces), C (leaves Spec self-referential), and D (different job).
The **unattended** question is split out rather than folded in: it is hard-to-reverse, surprising, and
a real trade-off against a charter we have defended repeatedly — ADR-grade, and a `/council` candidate
if it does not settle at G2.

## Out of scope / open questions

- May the retry loop run unattended, and on what budget? → **TASK-203**; ADR-grade, EPIC-005 D2 shaped.
- Does the comparand need a new `reference:` field, or does doc-vs-template already supply one for our
  substrate? → **TASK-201**; test the null hypothesis before adding a field to the task shape (L-091).
- What is the retry ceiling — one bounded retry, or convergence-detected? → settles at **TASK-202** G2.
- Does the source's claimed result reproduce? Not investigated. The Long Silence project is cited as
  the exemplar; no artifact, transcript, or measurement was inspected. Nothing above rests on it —
  every finding is a mapping against our own surface (L-091: do not adopt because it is the tidy move).

<!-- Lives in docs/research/<slug>.md (≤120 soft). Feeds an ADR or a G2 design call, then remains the
     WHY-trail. Once a decision is built on it, mark status: superseded rather than editing it. -->
