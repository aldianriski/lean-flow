---
id: TASK-683
title: "Run 6 scenarios x plain, graphify and RTK, score blind against the real diff, and rule on graphify and RTK"
priority: P2
size: M
risk: med
autonomy: HITL
class: execution
tier: X
authority: J2
origin: decomposer
state: ready
sprint: SPRINT-183
depends-on: [TASK-682]
---

# TASK-683 — Run 6 scenarios x plain, graphify and RTK, score blind against the real diff, and rule on graphify and RTK

## Why
Paired scenario blocks give 6 independent comparisons per tool and cancel order and drift; the ship decision stays the owner's (J2).

## Done when
- [ ] The runs execute scenario by scenario in the frozen block order (PGR, PRG, GPR, GRP, RPG, RGP), each a fresh `claude -p` through the probe in a fresh export of that scenario's parent (only ONE export on disk at a time; graphify's graph is rebuilt from the audited, scrubbed export per run), the coordinator launching each and the pre-flight re-reading the ledger before every run; the actual execution order is recorded.
- [ ] After blocks 1-3 the futility look is computed under the frozen rule and recorded; if either tool cannot reach the adoption effect even in the best case, that tool's remaining runs are not launched and the owner is asked.
- [ ] One fresh Sonnet blind to arm scores all plans in one pass (labels shuffled, tool names redacted, label map held by the coordinator), under the frozen equivalence and justified-extras rules; the script computes F1 from each plan's "FILES:" list and the scorer's mapping; per run it records F1_code, test recall, K, C, tokens, USD, tool counts, hook or rewrite counts, graphify queries, first-turn cache state and wall time.
- [ ] The RTK information-loss audit covers EVERY cut in every RTK run, regardless of that run's C, with each cut compared against its recalled original and each finding recorded.
- [ ] docs/research/graphify-rtk-retest-results.md holds the per-run table, the per-scenario paired differences d_i for C, tokens and USD, each arm's d̄, s, 2·s/√6 and effect size, the recomputed minimum detectable differences, and the ledger total (every dispatch included) at most 32.00 USD.
- [ ] Verdicts are applied by the frozen rules and written as short dated sections in docs/research/graphify-workdoo-test.md (graphify) and docs/research/rtk-trial-verdict.md (RTK), each stating KEEP, DROP or INCONCLUSIVE with d̄, s and the effect size for every metric used.
- [ ] If either tool passes, a new backlog task re-files the owner's ship decision citing this evidence; if inconclusive or dropped, no ship task is filed and the note says so.
- [ ] Read-through: every figure in both notes traces to the results file.
- [ ] After the last run the exports are deleted, no ~/.claude hook was added, the probe is deleted here, and the live repo's HEAD and `git status --porcelain` equal the values recorded in 679.
- [ ] Negative: if the ledger is projected or actually about to pass 32.00 USD (remaining minus the 1.50 hold-back below the next run's budget), the coordinator pauses and asks the owner; no run starts past the cap without that answer and no verdict is extrapolated from partial blocks.
- [ ] Negative: a graphify run with no hook nudge is an arm failure (not counted against graphify); a run of any arm that reads a path outside its export, or a plain run with a graphify or rtk call or a history read, is void and repeated once, the repeat booked.
- [ ] Negative: if plain's mean C is at least 0.9 the correctness-gain leg is written void (L-329) and no KEEP is issued on cost alone (the best outcome is INCONCLUSIVE with "correctness leg void"), while "C clearly lower" still means DROP; a metric whose |d̄| is not larger than 2·s/√6 is written tie, never keep or drop.
- [ ] Negative: no skill, hook, manifest or README of lean-flow is changed; RTK and graphify stay maintainer-environment only until a re-filed task is approved.

## Touches
D:\Research\bloodlines-exports (deleted at close); docs/research/graphify-rtk-retest-results.md; docs/research/graphify-workdoo-test.md; docs/research/rtk-trial-verdict.md; at most one new docs/work/backlog/ file; the throwaway probe (deleted).

## Assumes
- 18 runs fit in 17.00 USD, confirmed by the 682 projection.
- The ship decision is the owner's.
- G2 note: the futility rule is an optimistic extrapolation, not a mathematical bound; the coordinator describes it that way when asking the owner.
- G2 note: screening 2 scenarios cannot guarantee the 6-scenario plain mean avoids the ceiling, so ceiling spend remains possible.
- A voided run costs one repeat; the 1.50 hold-back covers one.

## Tracker
Owner popups 2026-11-20; precedent TASK-677 and 678; L-329.
