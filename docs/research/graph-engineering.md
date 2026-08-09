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
> **Verdict.** **Reject on mechanism; keep the vocabulary.** Every element either maps onto a shipped
> lean-flow surface or was declined earlier in writing — five recorded declines and two deliberate
> divergences. The louder divergence is that our edges are *prompted defaults, not runtime enforcement*,
> which is the objection any informed reader raises first and which ADR-011 already answers. The term is
> worth recording so the concept is not re-evaluated from scratch a fourth time.

## Why this matters

lean-flow scans external frameworks often enough that L-017 exists to govern it: judge the **delta over
our existing surface**, never standalone merit. Guessing wrong costs both ways — adopting a vocabulary
as though it were a mechanism bloats the surface (the dev-flow failure); dismissing it unrecorded makes
the next scan pay the full evaluation again. Method reused from `harness-engineering-adaptation.md`:
two axes, because a mechanism can exist and still be operationally shallow.

## Options considered

- **A — Adopt the mechanism.** Typed nodes (per-node model/tools/memory), typed edges with conditions
  and retry policy, a compiled DAG the runtime executes. *Trade-off:* the right shape of the problem,
  but nearly all of it exists here in derived form and the compiled half was rejected on merit (ADR-013).
- **B — Adopt the vocabulary only.** Record the external name for what `dispatch.md` implements; change
  nothing. *Trade-off:* zero surface cost; its whole value is preventing a re-scan — real but modest.
- **C — Ignore it.** *Trade-off:* cheapest today; guarantees a fourth re-evaluation (its downside is
  already stated above).

## Findings

**Axis 1 — does the mechanism exist? Yes, with one deliberate absence (cycles, last row).**

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
| Edge: **cycles** / loop-until-condition | **deliberately absent at the task graph** — the preflight FAILs on a cycle (`dispatch.md` check 1), because iteration lives *inside* nodes: `/tdd` red-green · `/diagnose`'s 6 phases · `/loop` pacing · the bounded two-failures-then-escalate rule |

Several rows are *more* specific than the generic framing — transitive-chain ownership (TD-025),
base-ref drift as its own named FAIL, conflict resolution by recovering both authors' intent first.

**The five elements we lack were each declined in writing.**

- **Compiled DAG as an executed artifact** — ADR-013 rejected it as a needless second SSOT; the
  preflight derives waves from markup already mandatory in every Plan.
- **Automated retry / escalation ladder** — ADR-010: escalate by hand after two failures, because an
  automated ladder is agent behaviour a no-hooks plugin cannot own.
- **A rendered/queryable run graph** — ADR-013(a) is the primary decline, with this doc's revisit-if
  below as the live signal. (`.out-of-scope/derived-graph-view.md` is adjacent but a *different object*
  — a knowledge-metadata graph over docs, not an execution graph; its own revisit-if has never fired.)
- **Run-event log (JSONL)** — ADR-013(c) REJECT: a derived machine view with no firing trigger and no
  first consumer; the sprint Execution Log already *is* the event log at 4–8-task scale. This is the
  element graph-engineering framings call observability/streaming.
- **Typed shared run-state** — TASK-120; ADR-013's kill-switch fired when the promotion trigger stayed
  unfired across the full 5-sprint window.

**Axis 2 — is the operational depth equivalent? Two deliberate divergences, no gap.**

- **Edges here are prompted defaults, not runtime enforcement — and this is the bigger one.** Graph
  engineering's definition says edges *control* transitions. Several rows above are mechanically backed
  (the `Depends-on` DAG by the preflight script · permissions by the harness allowlist · fan-out by
  worktree isolation), but the rest are discipline the model can decline: ADR-010 states it verbatim —
  "a **prompt-driven nudge, not a guarantee** — a skill can't force the model to spawn or parallelize"
  — and `dispatch.md` § The ceiling (honest) concedes the same in-skill. **Declined, not overlooked:**
  ADR-011 rules out gate enforcement everywhere (no in-core hook — plugin hooks auto-activate with no
  per-hook disable, so any would be mandatory for every installer — and no sibling plugin), with the
  revisit trigger recorded in `.out-of-scope/gate-guard-hook.md`: gate-skipping observed as a recurring
  real failure. Anyone re-scanning this concept will raise this first; the answer is ADR-011.
- **Confidence-thresholded routing is the second, and it is structurally forced.** The canonical
  illustration routes to a human on `confidence < 90%`. Our gates are categorical — `risk: high`,
  auth/input/secrets/data, HITL. A no-hooks markdown plugin has no access to logprobs or sampling, so
  any threshold could only bind on *verbalized* confidence, the poorly-calibrated kind. The sharper
  argument is falsifiability: "touches auth" can be checked against the diff afterwards, a confidence
  number cannot be checked against anything. lean-flow does route on uncertainty — G1 BLOCKs on any
  "unknown", an unconfirmed `assumes:` blocks G2, `needs-info` holds a task — it declines only the scalar.
- **Evaluation is not the gap it first appears.** Graph-engineering hierarchies place evaluation above
  the graph, which reads as a hole here until `behavioral-eval-feasibility.md` is checked: the suite
  exists under `evals/`, was exercised on real headless runs with `--model` pinned, and its residual
  is narrowed and recorded (L-061), not open.

## Recommendation

**Option B.** Record the term, change nothing. The concept names the architecture lean-flow already
runs, and every element it would add has a prior written decision against it — stronger evidence that
the design is settled than any map showing we merely "have the boxes". Adopting the mechanism means
reversing ADR-010, ADR-011 and ADR-013 with no new evidence: TD-031's pattern, narrowing a working
guard under no pressure. Not ADR-grade — nothing is reversed, so nothing hard-to-reverse is decided.
Pressure-tested adversarially (Fable, 2026-08-09) → CONFIRMED-WITH-AMENDMENTS; its three landed
findings are folded in above, and the five declines, the confidence divergence and the evaluation
claim each survived the attack.

## Out of scope / open questions

- **Revisit-if** — a real run where the *derived* wave plan is insufficient and a human needs the graph
  rendered **before** dispatch rather than printed during it. That is the only signal that would
  reopen ADR-013's compiled-DAG rejection. Absent it, this stays closed.
- **Not scanned** — the LangGraph/GraphFlow implementations themselves, only the concept as described.
  A recorded boundary, not an implied all-clear (L-093): a later claim that some implementation carries
  a mechanism this table misses gets checked per-row, and "we have one with the same name" never closes it.
