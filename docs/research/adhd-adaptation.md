---
owner: Maintainer
last_updated: 2026-07-29
update_trigger: A new deliberation/ideation technique or source changes this verdict
status: current
id: adhd-adaptation
tags: [process]
domain: governance
related: [bmad-adaptation, brainstorming-adaptation, council-improvements]
---

# uditakhourii/adhd — adaptation scan (TASK-095)

Scan of [uditakhourii/adhd](https://github.com/uditakhourii/adhd) — README, `skills/adhd/SKILL.md`
(the runnable skill), and `documentation/{how-it-works,frames,when-to-use,vs-cot-and-tot}.md` — for
anything worth adapting into lean-flow. ADHD is a single-skill repo (not a multi-skill collection like
bmad): a "parallel divergent ideation" pattern — N isolated Agent/Task calls under different cognitive
**frames** (no shared context, evaluation forbidden), then a separate critic pass that scores, clusters,
prunes traps, and deepens the survivors. Ships a companion Node/TS CLI/library (`adhd-agent`) — out of
scope, no runnable-code substrate in a markdown skill library.

## Verdict summary

**Clean reject — 0 keepers as a skill; 1 micro-keeper (doc addendum, not a new skill).** ADHD's central
architectural claim — isolated parallel generation eliminates anchoring, then a *separate* critic call
converges — is the same mechanism `/council` already runs (5 independent sub-agents, no shared context,
then anonymized peer review → chairman synthesis), and `council-improvements.md` already did a deeper
literature pass on exactly this deliberation pattern. ADHD's frames target open-ended creative
*ideation* (naming, API shape, "give me a few ways to…") rather than `/council`'s decision
*pressure-testing* — a real difference in purpose, but `brainstorming-adaptation.md` already ruled a
standalone ideation skill out of lean-flow's scope (~90% duplicate of G2/`/task-decomposer`/`/prototype`/
`/council`) and reusing that verdict here fits the same shape. Per L-017, the mechanism is the
unmatched-remainder test, not the frame taxonomy alone.

## Per-candidate delta

| Candidate | Already covered by | Verdict + rationale |
|---|---|---|
| Core loop: N parallel isolated agents (eval forbidden) → separate critic pass (score/cluster/prune/deepen) | `/council` steps 2–4 (5 isolated advisors → anonymized peer review → chairman synthesis) | **REJECT** — same architectural pattern (isolate to kill anchoring, converge in a separate pass); `council-improvements.md` already scanned this exact deliberation-pattern space (STORM/Co-STORM, MAD) and hardened it. Adding a second sub-agent-orchestrating skill also contradicts the stated architecture invariant ("`/council` is the *one* skill that orchestrates sub-agents internally" — `.claude/CLAUDE.md`). |
| 15-frame library (hardware engineer, regulator, 10-year-old, biology, logistics, markets, inversion, speedrunner, ant colony, 3am on-call, …) — generative vantage points for wide creative ideation | `brainstorming-adaptation.md` verdict: standalone ideation duplicates G2 "propose alternatives + WHY" + `/task-decomposer` + `/prototype` + `/council` (~90% owned) | **REJECT** — structurally distinct from council's 5 *evaluative* advisor personas (generate options vs. judge a fork), but the *need* (widen the option space before committing) is already the exact ground `brainstorming-adaptation.md` scanned and ruled out of a workflow-governance plugin's scope. No new host skill to fold it into without recreating that rejected standalone skill. |
| Pre-flight self-judge gate (open-ended? high-stakes? open phrasing? — abort if any is no) | `/council`'s own "When to invoke" + MANDATORY/STRONG triggers; ADR-010 dispatch-tier discipline (reserve multi-call dispatch for consequential work) | **REJECT** — same self-gating discipline lean-flow already applies before paying for a multi-agent pass. |
| "Non-obvious pick" flagged explicitly (★) separate from the safe majority pick | `/council` chairman synthesis: calibrated confidence + dissent; chairman **may side with a lone dissenter if reasoning is strongest** | **REJECT** — near-duplicate; council's dissent reporting already surfaces "the well-reasoned minority view," the same job ADHD's ★ does for a wide idea pool. |
| Trap detection with a one-line mechanistic reason per flagged idea | bmad K5 anti-sycophancy re-run (TASK-043, adopted) + council's Contrarian advisor + peer-review "biggest blind spot" question | **REJECT** — duplicate of already-adopted/-existing blind-spot-surfacing mechanisms. |
| Angle-level clustering of a wide idea pool (not surface-keyword clustering) | — (no host; only meaningful atop a wide-ideation skill, which is rejected above) | **REJECT** — no application without the frame-library candidate it depends on. |
| "Junior-would-Google-it" one-sentence triggering heuristic | `/council` description: "Do NOT trigger on simple yes/no questions, factual lookups, or casual 'should I' without a meaningful tradeoff" | **REJECT** — same triggering discipline, different wording. |
| **N × base-substrate cost note** — each isolated parallel branch re-pays the full base context (CLAUDE.md/tool preamble) before any novel output, so token cost scales with *branch count × substrate size*, not call count alone | Not found in `ADR-010-model-dispatch-role-tiers.md` or `orchestrator/references/dispatch.md` (both discuss dispatch tiers + parallel-batch mechanics, not the substrate-reload multiplier) | **KEEP (micro)** — genuinely new, narrow, and actionable: a one-line cost-awareness addendum, directly relevant whenever lean-flow already fans out parallel sub-agents (`/council`'s 5 advisors + 5 reviewers, `orchestrator`'s worktree-dispatch batches). Not a new skill — a doc edit. |
| Node/TS CLI + library (`adhd-agent`), CI/eval harness, `bench/` | N/A | **REJECT** — no runnable-code consumer surface in a markdown skill-library plugin; nothing to adapt. |

## Recommendation

**No new skill, no ADR.** File one small follow-up:

- **Proposed TASK** (P3, size S) — *"Add a one-line cost-awareness note to ADR-010 / `orchestrator/references/dispatch.md` (and/or `/council`'s cost line): parallel sub-agent dispatch re-pays the full base substrate (CLAUDE.md + tool context) per branch, so cost scales with branch-count × substrate-size, not call-count alone — relevant when sizing council's advisor count or a worktree-dispatch fan-out batch."* — coordinator to file and number.

Everything else is a clean reject: the core mechanism duplicates `/council` (already scanned and hardened
in `council-improvements.md`), and the open-ended-ideation use case it's built for was already ruled out
of lean-flow's scope by `brainstorming-adaptation.md`.

## Out of scope / open questions

- Whether lean-flow ever wants a *generative* (not evaluative) wide-ideation mode inside `/council` or
  `/prototype` remains open but is **not** this scan's call — it would re-litigate
  `brainstorming-adaptation.md`'s standalone-skill rejection and deserves its own G2 discussion if raised
  again, not a scan-driven default.
- ADHD's `bench/` eval methodology (LLM-judge, A/B order randomization) is the same discipline
  `council-improvements.md` already applied to `/council`'s own divergence/decorrelation probes — no new
  information there.
