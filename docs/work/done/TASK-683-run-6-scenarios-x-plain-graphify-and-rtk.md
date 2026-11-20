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
- [x] The runs execute scenario by scenario in the frozen block order (PGR, PRG, GPR, GRP, RPG, RGP), each a fresh `claude -p` through the probe in a fresh export of that scenario's parent (only ONE export on disk at a time; graphify's graph is rebuilt from the audited, scrubbed export per run), the coordinator launching each and the pre-flight re-reading the ledger before every run; the actual execution order is recorded. ✓ 15 runs in the frozen block order (PGR, PRG, GPR; then GRP, RPG, RGP without R after the owner's futility ruling), each a fresh coordinator-launched claude -p in a fresh export of its parent, one export on disk at a time, graphify's graph rebuilt per run, pre-flight re-reading the ledger before every run; execution order recorded in the results file § Paid set
- [x] After blocks 1-3 the futility look is computed under the frozen rule and recorded; if either tool cannot reach the adoption effect even in the best case, that tool's remaining runs are not launched and the owner is asked. ✓ futility look after blocks 1-3 computed under the frozen rule and recorded in the Log (RTK futile; graphify token leg futile, C leg not judgeable before scoring); owner asked: 'Stop RTK, finish graphify'
- [x] One fresh Sonnet blind to arm scores all plans in one pass (labels shuffled, tool names redacted, label map held by the coordinator), under the frozen equivalence and justified-extras rules; the script computes F1 from each plan's "FILES:" list and the scorer's mapping; per run it records F1_code, test recall, K, C, tokens, USD, tool counts, hook or rewrite counts, graphify queries, first-turn cache state and wall time. ✓ one fresh Sonnet blind scorer over all 15 plans (labels shuffled with seed 4b8f3b40-t5, tool names redacted, three arm-cue clauses removed, label map held by the coordinator); F1 by script from FILES lists and the mapping; per-run F1, test recall, K, C, tokens, USD, tools, hooks/rewrites, graphify queries, first-turn cache and wall time in § Paid set
- [x] The RTK information-loss audit covers EVERY cut in every RTK run, regardless of that run's C, with each cut compared against its recalled original and each finding recorded. ✓ RTK information-loss audit over all 5 cuts in the 3 RTK runs: each recalled, re-run raw in an unmodified export (0 tokens missing from shown + recalled), hidden lines checked against key files and symbols; 3 losses by the frozen rule, none lowered C; every finding recorded
- [x] docs/research/graphify-rtk-retest-results.md holds the per-run table, the per-scenario paired differences d_i for C, tokens and USD, each arm's d̄, s, 2·s/√6 and effect size, the recomputed minimum detectable differences, and the ledger total (every dispatch included) at most 32.00 USD. ✓ results file holds the per-run table, per-scenario d_i for C, tokens and USD, each arm's d-bar, s, 2s/sqrt(n) (n = 6 graphify, n = 3 RTK after the owner's stop) and effect size, the recomputed MDDs, and the ledger total 9.2249 USD (every dispatch included) <= 32.00
- [x] Verdicts are applied by the frozen rules and written as short dated sections in docs/research/graphify-workdoo-test.md (graphify) and docs/research/rtk-trial-verdict.md (RTK), each stating KEEP, DROP or INCONCLUSIVE with d̄, s and the effect size for every metric used. ✓ verdicts by the frozen rules as dated sections: graphify INCONCLUSIVE (graphify-workdoo-test.md), RTK DROP (rtk-trial-verdict.md), each with d-bar, s and effect size for every metric used
- [x] If either tool passes, a new backlog task re-files the owner's ship decision citing this evidence; if inconclusive or dropped, no ship task is filed and the note says so. ✓ neither tool passes: no ship task filed, and both notes say so
- [x] Read-through: every figure in both notes traces to the results file. ✓ read-through: every figure in both verdict sections found in the results file (1.017x derived from its +1.7%)
- [x] After the last run the exports are deleted, no ~/.claude hook was added, the probe is deleted here, and the live repo's HEAD and `git status --porcelain` equal the values recorded in 679. ✓ exports deleted (0 under D:/Research/bloodlines-exports); global ~/.claude and AppData rtk hashes equal the T4 baseline, no hook in ~/.claude/settings.json; retest-probe/ deleted; live repo HEAD b8fea870 and the 6-line status equal T1's record
- [x] Negative: if the ledger is projected or actually about to pass 32.00 USD (remaining minus the 1.50 hold-back below the next run's budget), the coordinator pauses and asks the owner; no run starts past the cap without that answer and no verdict is extrapolated from partial blocks. ✓ Negative: the ledger never neared the cap (peak 9.2249 of 32.00, remaining well above hold-back + run budget), so no pause was needed; no verdict extrapolated (RTK's verdict states n = 3, its own threshold)
- [x] Negative: a graphify run with no hook nudge is an arm failure (not counted against graphify); a run of any arm that reads a path outside its export, or a plain run with a graphify or rtk call or a history read, is void and repeated once, the repeat booked. ✓ Negative: every graphify run had a hook nudge (no arm failure); no run read outside its export or made a history read: 7 probe void flags were checked against the transcript and each was a fence false positive (cd-relative path, denied or refused calls, grep patterns), so they were overturned with reasons rather than voided and repeated; no plain run called graphify or rtk
- [x] Negative: if plain's mean C is at least 0.9 the correctness-gain leg is written void (L-329) and no KEEP is issued on cost alone (the best outcome is INCONCLUSIVE with "correctness leg void"), while "C clearly lower" still means DROP; a metric whose |d̄| is not larger than 2·s/√6 is written tie, never keep or drop. ✓ Negative: plain mean C 0.858 < 0.9, so the correctness-gain leg is live (not void); every metric with |d-bar| <= 2s/sqrt(n) is written tie
- [x] Negative: no skill, hook, manifest or README of lean-flow is changed; RTK and graphify stay maintainer-environment only until a re-filed task is approved. ✓ Negative: no lean-flow skill, hook, manifest or README changed (non-docs diff since plan_commit = T2's .cap-dispositions retain row only); RTK and graphify stay maintainer-environment only

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
