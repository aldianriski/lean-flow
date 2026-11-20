---
id: TASK-680
title: "Write blind descriptions and keys for the 6 scenarios and freeze the scoring, adoption and noise rules"
priority: P2
size: M
risk: low
autonomy: HITL
class: execution
tier: X
authority: J1
origin: decomposer
state: ready
sprint: SPRINT-183
depends-on: [TASK-679]
---

# TASK-680 — Write blind descriptions and keys for the 6 scenarios and freeze the scoring, adoption and noise rules

## Why
Replication comes from scenarios, so each needs a leak-free request and an objective key, and the rules must be frozen before any run so the verdict cannot be tuned afterwards.

## Done when
- [x] For each of the 6, an answer key exists: changed code files and test files listed separately, main functions or symbols, and 3-5 key points (what else breaks, a needed migration, a contract or call-site impact), built from the real diff and commit message by a Sonnet key worker. ✓ keys S1-S6 in bloodlines-retest-scenarios.md Part 2: code and test files separately, main symbols, 3-5 key points each, from the real diffs; unsupported claims dropped
- [x] For each of the 6, a task description in the voice of a user, issue or PM request is written from the diff with no file path, symbol name or diff hint, and tells the agent to end its plan with the "FILES:" list described in the frozen rules; a programmatic grep of every changed file's full name (stem and extension) and every identifier of the key (whole-word, case-sensitive, 4+ characters) against the description is recorded as empty, with a recorded allowlist of ordinary domain words (each allowlisted word reviewed by the blind pass as not an identifier). ✓ seven PM-voice descriptions (S1-S6 + spare) end with the fixed FILES sentence; the coordinator's leak-grep (retest-probe/leakgrep.ts: changed file names, stems, path segments, key identifiers 4+ chars, whole-word, case-sensitive) PASS with 0 unallowed hits; 16-word allowlist confirmed by the blind pass
- [x] A fresh blind Sonnet, given only the description and an export of the parent, never the key, confirms the description is answerable and names no file or symbol; disagreements are resolved by rewriting. ✓ fresh blind Sonnet with descriptions, allowlist and one export per parent, never the key: every description answerable, no give-away (BLIND CHECK: PASS); the S6 label clause was rewritten before it
- [x] docs/research/bloodlines-retest-scenarios.md holds, verbatim and committed in one commit before any run (hash recorded): the scoring formula (F1 by script from the "FILES:" list, equivalence rule, justified-extras rule, K, C), the adoption bar, the 2-SE noise rule, the verdict rules for graphify and RTK, the RTK information-loss audit, the ceiling rule and its justification, the futility look, the token formula, the cache-state recording rule, the block order, and the block assignment (seeded shuffle recorded). ✓ bloodlines-retest-scenarios.md committed in one commit 634a74fb before any run, with scoring formula, equivalence and justified-extras rules, K, C, adoption bar, 2-SE rule, verdict rules, RTK audit, ceiling rule, futility look, token formula, cache-state rule, block order and seeded assignment; hash recorded in the results file and the Log
- [x] The minimum detectable difference per metric is frozen in the same commit: tokens 48,300 (17.6% of mean) and USD 0.0628 (26.2% of mean), computed from SPRINT-182's 4 plain runs (tokens 296,527 / 221,618 / 316,909 / 261,590; USD 0.3171 / 0.1990 / 0.2383 / 0.2046) with the formula 2·sqrt(2)·sd/sqrt(6); the C value is recorded as "not estimable before the pre-screen" with the rule for recomputing it. ✓ MDD frozen in the same commit: tokens 48,300 and USD 0.0628 from SPRINT-182's 4 plain runs with 2*sqrt(2)*sd/sqrt(6) (reproduced 48,288 / 0.06283); C not estimable before the pre-screen, recompute rule recorded
- [x] This task's lines total at most 2.50 USD or the task stops (swap re-keys are funded in 681, not here). ✓ T2 lines 0.7371 USD (key worker 0.5429 + blind check 0.1942, estimates) <= 2.50
- [x] Negative: a description containing any changed file name, any key identifier outside the recorded allowlist, or a path segment from the key is rejected and rewritten, never frozen with the leak. ✓ Negative: the leak-grep's label hit in S6 was rejected and the clause rewritten; verified (S2) allowlisted only after the blind pass confirmed it as ordinary
- [x] Negative: a key claim the code cannot support from the parent and the commit is dropped, never kept with a hedge. ✓ Negative: unsupported key claims dropped (S6 mapKey guard move; S6 label prop detail removed with the clause)
- [x] Negative: any scoring, adoption or noise rule changed after the commit hash is recorded voids the run set and needs the owner; no rule is edited silently. ✓ Negative: no rule edited after 634a74fb; the freeze record points at the results file and Log for the hash so the frozen file stays byte-identical

## Touches
docs/research/bloodlines-retest-scenarios.md (descriptions, keys, frozen rules); docs/research/graphify-rtk-retest-results.md (ledger rows); temporary exports under D:\Research\bloodlines-exports (one at a time).

## Assumes
- The real diff is a defensible key, with the scorer's equivalence rule covering reasonable alternatives.
- The blind pass varies the selection from the key (it reads description and parent export only).
- SPRINT-182's run-to-run noise on a 22x smaller repo is a usable first estimate and is recomputed in 681 and 682.
- G2 note: crossing a 2-SE threshold is not a detection probability, and pre-screens on different scenarios and smokes on different arms do not isolate run noise, so the frozen minimum detectable differences are indicative.

## Tracker
Owner popups 2026-11-20 (Matters, noise rule, Fresh plain for the 2 screened scenarios, RTK metric). Precedent TASK-676; L-329.
