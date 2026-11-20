---
id: TASK-676
title: "Build the key-checked question set and the throwaway run harness for the graphify and RTK re-test"
sprint: SPRINT-182
priority: P2
size: M
risk: low
autonomy: HITL
class: execution
tier: X
authority: J1
origin: decomposer
state: ready
depends-on: []
---

# TASK-676 — Build the key-checked question set and the throwaway run harness for the graphify and RTK re-test

## Why

The first graphify test reached only single-hop questions and its harness was an Explore dispatch with no README integration; the owner ordered a re-test on 2026-11-20 after a Codex review (RE-TEST NEEDED). This task freezes the questions, the answer key and the harness before any arm runs.

## Done when

- [x] `docs/research/graphify-rtk-retest-questions.md` holds 6 questions: 2 cross-file multi-hop, 2 transitive "what breaks if Z changes", 2 plain lookups as controls, each with an answer key built from D:\Research\workdoo at HEAD 884d897 with file and line sources; each of the 4 hard questions' key cites at least 2 files. ✓ graphify-rtk-retest-questions.md: 6 questions (2 multi-hop, 2 transitive what-breaks, 2 lookups) at 884d897, file+symbol sources, each hard key cites >=2 files
- [x] The key-check Sonnet's first-pass score is recorded in the fixture note as the ceiling signal. ✓ fixture Part 4: key-check first-pass score 6/6, recorded as the ceiling signal
- [x] The key is checked by a second pass that varies the selection: a fresh Sonnet answers from the code and its answers are compared with the key; every disagreement is resolved from the code before the fixture is committed. ✓ fresh Sonnet answered Part 1 blind from the code; compared with the key: no disagreement on any scored element; key unchanged
- [x] The fixture and key are committed before any arm runs, and the commit hash is recorded in the note. ✓ fixture committed 46043cf5 before any arm; hash recorded in graphify-rtk-retest-results.md
- [x] The token formula (input + cache_creation + cache_read + output, from the usage of the run's final `result` event) is frozen in the committed fixture before any run. ✓ fixture Part 4 freezes input + cache_creation + cache_read + output from the final result event (scope-change logged)
- [x] A throwaway Bun TypeScript probe (no .sh) starts a fresh `claude -p --model sonnet --output-format stream-json --verbose --include-hook-events` run in the snapshot cwd with the read-only allowlist (Read, Grep, Glob, and Bash limited to the tool CLIs and read-only shell; no Edit/Write/Agent), saves each run's JSON and tool log, and appends `total_cost_usd` to a ledger that refuses a run which would pass the 8.00 USD cap (0.50 USD held back for scoring). The ledger lives in a retained results file under docs/research/, and every run is passed `--max-budget-usd` = remaining cap minus 0.50. ✓ retest-probe/run.ts: stream-json run per the scope-change, read-only per-arm allowlist, ledger in the results file, --max-budget-usd, cap refusal; smoke runs booked 0.0450 and 0.0282
- [x] Every arm run uses identical isolation flags `--setting-sources project,local --strict-mcp-config` and records the config and hook sources it loaded; a plain run whose log has any graphify or rtk call is void and is repeated once. ✓ isolation flags --setting-sources project,local --strict-mcp-config on every run (skills-flag scope-change logged); init line records skills, plugins, MCP and memory_paths; plain void rule in the probe
- [x] A smoke run on one question reports USD, tokens and tool calls, and the snapshot's `git status --porcelain --ignored` still equals the baseline (`?? .claude/worktrees/` plus `!! .workdoo/`, `!! dist/`, `!! node_modules/`, `!! tsconfig.tsbuildinfo`). ✓ plain-smoke: 0.0450 USD, 52,858 tokens, Grep=1, 5.9 s; snapshot HEAD and --ignored status equal the baseline afterwards
- [x] The probe stays uncommitted in the lean-flow working tree until TASK-678 closes and is deleted then, not at this task; `git status` shows it is not committed. ✓ retest-probe/ is untracked (git status ??), never staged; deleted at TASK-678 close
- [x] Negative: a run started with the ledger at or past the cap is refused with a "budget exhausted" message and starts no `claude` process. ✓ Negative: probe self-test: ledger 7.40 + 0.30 + 0.50 > 8.00 -> REFUSED budget exhausted, no claude process, no stream file
- [x] Negative: a run that returns no `total_cost_usd` is recorded as unpriced and blocks all further runs until it is reconciled. ✓ Negative: probe self-test: no result event -> UNPRICED row written, exit 2; next run REFUSED until a reconcile row exists

## Touches

docs/research/graphify-rtk-retest-questions.md; a throwaway probe in the lean-flow working tree (deleted when TASK-678 closes); docs/research/graphify-rtk-retest-results.md (ledger); D:\Research\workdoo read-only. Never D:\Project\workdoo.

## Assumes

- `claude -p` JSON reports USD and tokens.
- The key worker and the scorer are Sonnet dispatches whose cost counts against the cap.
- The 4 harder questions each need at least 2 files to answer.

## Tracker

Owner popups 2026-11-20 (Harness, Questions, Budget, Split); Codex review FAIR RE-TEST sections.

amended 2026-11-20 after blind draft check (Fable + Codex), owner approve
