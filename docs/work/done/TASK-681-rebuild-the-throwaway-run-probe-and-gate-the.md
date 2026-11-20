---
id: TASK-681
title: "Rebuild the throwaway run probe and gate the test on a plain pre-screen of two scenarios, with funded swaps"
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
depends-on: [TASK-680]
---

# TASK-681 — Rebuild the throwaway run probe and gate the test on a plain pre-screen of two scenarios, with funded swaps

## Why
The SPRINT-182 probe is deleted. L-329: the ceiling gates the run. The pre-screen also prices a real planning run and re-estimates the noise before any arm is built.

## Done when
- [x] A throwaway Bun TypeScript probe (no .sh), uncommitted in the lean-flow working tree, starts a fresh `claude -p --model sonnet --output-format stream-json --verbose --include-hook-events --setting-sources project,local --strict-mcp-config --no-session-persistence --max-budget-usd` run in a per-run export, with per-arm read-only allowlists (Read, Grep, Glob, read-only Bash; git log, show, diff and reflog denied; no Edit, Write or Agent), saves each run's stream and tool log, records the init config and hook sources, and appends `total_cost_usd` to the ledger; `--max-budget-usd` = min(1.50, remaining − 1.50). ✓ retest-probe/run.ts (Bun TS, uncommitted): fresh claude -p stream-json run in a per-run export, per-arm allowlists, history/Edit/Write/Agent denied, stream + tool log saved, init config and hook sources recorded, total_cost_usd appended to the Bloodlines ledger; max-budget = min(1.50, remaining - 1.50, task cap left)
- [x] The probe denies any Read, Grep, Glob or Bash path outside its export and any `.env*`, key or credential file (self-test fixtures retained), and the first turn's cache_creation and cache_read tokens are recorded per run. ✓ out-of-export, .git, secret-pattern and denied-git paths void the run by the post-run fence (the signed G2 mechanism; the CLI cannot confine file tools pre-launch); self-test fixtures retained; first-turn cache_creation/cache_read recorded per run (pre-S2 8,287/11,223)
- [x] Two plain runs on the two hardest-looking scenarios, each in a fresh export of its parent with the scenario description as the prompt, are scored blind by a fresh Sonnet under the frozen rules (F1 by script, equivalents, K, C); USD, tokens, tool calls and C are booked. ✓ plain pre-screens on S2 and S4 (most code files across most dirs), fresh exports, scored blind by a fresh Sonnet (F1 by script): C 0.844 and 0.821; USD, tokens, tool calls booked
- [x] Gate recorded: if plain scores C >= 0.9 on both, up to 2 swaps of larger or harder pool commits are tried (each re-audited under 679's rules, re-keyed and re-described under 680's rules, blind-checked, one more pre-screen plain run each); if plain still scores >= 0.9 on every screened scenario the test STOPS here, "plain aces real change plans on the big repo" is written in the results file, and 682 and 683 are not started. If this task's 5.00 USD cap is reached before a needed swap, it stops and asks the owner. ✓ gate recorded in the results file: plain below 0.9 on both screened scenarios, so no swap and no STOP; the test proceeds
- [x] The pre-screen runs only gate and price: they are never used as controls (owner ruling "Fresh plain for those 2"); each of the 6 scenarios, the screened ones included, gets a fresh plain run in 683, independent of the screen, and the first-turn cache state (cache_creation vs cache_read) is recorded for every run so the 683 plain and arm runs can be compared on it. ✓ pre-screen runs only gate and price, never controls; every scenario gets a fresh plain run in 683; first-turn cache state recorded for every run
- [x] The minimum detectable differences are recomputed from the pre-screen runs (and the C noise estimate is first available), recorded beside the frozen ones, and the gap is reported to the coordinator. ✓ MDD recomputed from the pre-screen and appended beside the frozen figures: tokens 89,712, USD 0.0431, C 0.019 (different scenarios, so scenario-confounded); gap reported
- [x] This task's lines total at most 5.00 USD. ✓ T3 lines 1.6765 USD (runs 1.1054 incl. the void, builder 0.3727, scorer 0.1984) <= 5.00
- [x] Negative: a run started with remaining budget below its `--max-budget-usd` + 1.50 is refused with "budget exhausted" and starts no `claude` process (probe self-test, fixture retained). ✓ Negative: probe self-test: ledger near cap -> REFUSED budget exhausted, no process, no export (fixture retained)
- [x] Negative: a run with no `total_cost_usd` is written UNPRICED and blocks further runs until a reconcile row exists. ✓ Negative: probe self-test: stream without a result event -> UNPRICED row, exit 2; next run refused until a reconcile row
- [x] Negative: a plain run whose log shows any graphify or rtk call, a git call that reached history, or a read of a path outside its export is void and repeated once, the repeat booked. ✓ Negative: pre-S4 attempted git log (denied) -> VOID under the signed G2 rule, repeated once as pre-S4-r, the repeat booked
- [x] Negative: no skill, hook, manifest or README of lean-flow and nothing in the live bloodlinesfamilia repo is changed. ✓ Negative: nothing in lean-flow's skills, hooks, manifests or README changed; the live repo was only read by git at shas

## Touches
the throwaway probe (uncommitted, deleted at the close of 683); D:\Research\bloodlines-exports (one export at a time); docs/research/graphify-rtk-retest-results.md; docs/research/bloodlines-retest-scenarios.md (swap re-keys only, committed before the swapped scenario runs).

## Assumes
- A planning run costs 0.7-1.1 USD (measured here, replaces the assumption).
- One plain run per screened scenario can mislabel a noisy result; the 683 plain runs (fresh for all 6 scenarios) carry the real baseline.
- G2 note: screening 2 scenarios cannot guarantee that the 6-scenario plain mean avoids the ceiling, so ceiling spend remains possible.
- G2 note: pre-screens on different scenarios and smokes on different arms do not isolate run-to-run noise; the recomputed floors are indicative only.

## Tracker
Owner rulings: "Shortfall: STOP, record the ceiling"; "Overrun: Ask me then"; funded swap step. Precedent TASK-676; L-329.
