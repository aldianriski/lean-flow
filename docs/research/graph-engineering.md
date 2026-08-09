---
owner: Maintainer
last_updated: 2026-08-09
update_trigger: Question revisited, or a new option/source changes the recommendation
status: current
id: graph-engineering
tags: [process, tooling]
domain: governance
related: [harness-engineering-adaptation, ADR-010, ADR-013]
---

# Research — Does "graph engineering" name a mechanism lean-flow lacks, or a mechanism it already has?

> **Question.** "Graph engineering" — designing an AI system as an explicit network of agents, tools,
> decisions and human checkpoints, where nodes do work and edges control transitions — became a widely
> used term around July–August 2026. Does any element of it add capability `/orchestrator` +
> `dispatch.md` do not already have?
> **Verdict.** **Reject on mechanism; keep the vocabulary.** Every node/edge/graph element maps onto a
> shipped lean-flow surface, and the four elements we lack were each declined earlier in writing —
> with an ADR or a recorded revisit-if. The term is worth recording so the concept is not
> re-evaluated from scratch a fourth time.

## Why this matters

lean-flow scans external frameworks often enough that L-017 exists to govern it: judge the **delta over
our existing surface**, never standalone merit. The cost of guessing wrong runs both ways — adopting a
vocabulary as though it were a mechanism bloats the surface (the dev-flow failure), while dismissing it
unrecorded means the next scan pays the full evaluation again. `harness-engineering-adaptation.md`
established the method this doc reuses: answer two axes separately, because a mechanism can exist and
still be operationally shallow.

## Options considered

- **A — Adopt the mechanism.** Build an explicit graph artifact: typed nodes with per-node model/tools/
  memory, typed edges with conditions and retry policy, a compiled DAG the runtime executes.
  *Trade-off:* it is the shape of the problem, but nearly all of it already exists here in derived form,
  and the compiled-artifact half was rejected on its merits (ADR-013).
- **B — Adopt the vocabulary only.** Record "graph engineering" as the external name for what
  `dispatch.md` implements; change nothing. *Trade-off:* zero surface cost, and its whole value is
  preventing a re-scan — which is real but modest.
- **C — Ignore it.** *Trade-off:* cheapest today; guarantees the fourth re-evaluation, and leaves the
  scanned-frameworks list incomplete in exactly the way L-093 warns about.

## Findings

**Axis 1 — does the mechanism exist? Yes, essentially one-to-one.**

| Graph-engineering element | lean-flow surface |
|---|---|
| Node: responsibility · inputs · outputs | `class:` · `Layers:` · `done-when` / DoD |
| Node: model | ADR-010 tier map (decision/execution/mechanical-ingest) |
| Node: instructions | spawn-with-brief — hand the sub-agent its **procedure skill**, never a paraphrase |
| Node: context | `general-purpose` over `Explore`/`Plan`, chosen so CLAUDE.md survives the spawn |
| Edge: source → destination | the `Depends-on:` DAG |
| Edge: condition | Implement routing (new behaviour→`/tdd` · bug→`/diagnose` · hard-to-change→`/refactor-advisor`) |
| Edge: data passed | sprint file + Execution Log + declared base ref |
| Edge: permission | night-run allowlist derivation · HITL/AFK tags |
| Graph: fan-out / fan-in | topological wave rank → worktree fleet → merge-back queue |
| Graph: parallel + barriers | parallel batches separated by sequential barriers |
| Graph: verification | two-tier — per-branch pre-merge, interaction smoke post-merge |
| Graph: human approval · termination | G1/G2 + the unattended park contract · DoD · first-blocker-halt |

In places ours is more specific than the generic framing: transitive-chain ownership (TD-025), base-ref
drift as its own named FAIL, and the rule that a conflict is resolved by recovering both authors'
intent from their commit messages first.

**The four elements we lack were each declined in writing.**

- **Compiled DAG as an executed artifact** — ADR-013 rejected it as a needless second SSOT; the
  preflight derives waves from markup already mandatory in every Plan.
- **Automated retry / escalation ladder** — ADR-010: escalate by hand after two failures, because an
  automated ladder is agent behaviour a no-hooks plugin cannot own.
- **Derived knowledge-graph view** — `.out-of-scope/derived-graph-view.md`; council-2 gate held, and
  its revisit-if (a TASK-041 retrieval-miss signal) has never fired.
- **Typed shared run-state** — TASK-120; ADR-013's kill-switch fired when the promotion trigger stayed
  unfired across the full 5-sprint window.

**Axis 2 — is the operational depth equivalent? One deliberate divergence, no gap.**

- **Confidence-thresholded routing is the real difference, and the divergence is deliberate.** The
  canonical illustration routes to a human on `confidence < 90%`. Our gates are categorical —
  `risk: high`, auth/input/secrets/data, HITL. A self-reported confidence number is poorly calibrated,
  so thresholding on it makes a human gate *look* principled while firing on a figure nothing
  validates. Categorical risk classes are cruder and more honest.
- **Evaluation is not the gap it first appears.** Graph-engineering hierarchies place evaluation above
  the graph, which reads as a hole here until `behavioral-eval-feasibility.md` is checked: the suite
  exists under `evals/`, was exercised on real headless runs with `--model` pinned, and its residual
  is narrowed and recorded (L-061), not open.

## Recommendation

**Option B.** Record the term, change nothing. The concept is a name for the architecture lean-flow
already runs, and each element it would add has a prior written decision against it — which is stronger
evidence that the design is settled than any map showing we merely "have the boxes". Adopting the
mechanism would mean reversing ADR-010 and ADR-013 with no new evidence, which is the pattern TD-031
warns about: narrowing a working guard under no pressure. Not ADR-grade — nothing is being reversed,
so there is no hard-to-reverse decision to record.

## Out of scope / open questions

- **Revisit-if** — a real run where the *derived* wave plan is insufficient and a human needs the graph
  rendered **before** dispatch rather than printed during it. That is the only signal that would
  reopen ADR-013's compiled-DAG rejection. Absent it, this stays closed.
- **Not scanned** — the LangGraph/GraphFlow implementations themselves, only the concept as described.
  A recorded boundary, not an implied all-clear (L-093): if a specific implementation is later claimed
  to carry a mechanism this table misses, that claim is checked per-row, and "we have one with the same
  name" is not the sentence that closes it.
