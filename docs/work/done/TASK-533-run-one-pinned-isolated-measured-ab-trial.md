---
id: TASK-533
title: "Run one pinned, isolated, measured A/B trial end-to-end on a fixture repo"
epic: EPIC-023
sprint: SPRINT-147
priority: P2
size: M
risk: med
autonomy: HITL
class: execution
tier: G
authority: J1
origin: decomposer
state: ready
depends-on: []
---

# TASK-533 — Run one pinned, isolated, measured A/B trial end-to-end on a fixture repo

## Why
The harness tracer: it removes the largest S0 uncertainty, whether a pinned, isolated trial can run, be graded and be costed at all. Every later S0 task stands on it. Not frozen under ADR-053: maintainer-only measurement (`evals/ab/`, paid, run by hand), never a gate or `qa-check.sh` leg. G2 review-round cap: 2. Design source: `docs/research/lean-flow-3-foundation.md` §7 and the S0 intake rulings I-1..I-3, R-a..R-c (2026-10-29).

## Done when
- [x] One command runs one smoke task × one trial on a fresh copy of a small fixture repo under `evals/ab/fixtures/` (not workdoo, not clinic, not a task-set task); the source fixture is hash-identical afterwards. ✓ P4 (`bun evals/ab/selftest.ts --paid`, builder and coordinator re-run 11/11): `run-trial.ts` on a fresh copy of `evals/ab/fixtures/smoke-repo`, exit 0, one row appended, source hash-identical; S4 reddens a run that mutates the source
- [x] Pins come from an arm config and are echoed in the run record: full model ids incl. dispatch tiers · effort · permissions · plugin commit SHA + content hash (none for A0) · config dir. ✓ the P4 row's pin column echoes session model and dispatch tiers by full id (`claude-haiku-5-5`), effort, permission mode `acceptEdits`, auth, plugin `none` (A0) and the isolated config dir; S1b's matching-pin row echoes plugin SHA + content hash
- [x] Plugin pin verified, not echoed: before the trial the harness hashes the plugin directory the CLI will load and refuses on mismatch with the pin; it also checks the trial's init event names that plugin. Must-FAIL: a pin at a different commit → refused; control → runs. ✓ S1 (other commit / other content / dirty tree refused before spawn, matching pin proceeds) · S2 (init naming another path, an extra plugin, or any plugin for A0 → invalid) · S1b (a wrong-commit pin throws before any spawn; the control runs); harness mutation dropping the pin check reddens S1b
- [x] Access isolation: a smoke task reading a file outside the trial copy → denied and recorded; a read inside the copy → allowed. ✓ P1: three haiku runs in `acceptEdits` on long-form paths: an outside Read and an outside Bash `cat` each land in `permission_denials`, an inside Read returns its token with no denial
- [x] Config isolation with a leak-detecting control: every trial runs with a temp home (`HOME`/`USERPROFILE`) and an isolated config dir, auth entering as a credentials-only entry. Canaries (an instruction in CLAUDE.md, a memory, an env var in settings, a skill in plugins) planted (1) as the selected config → each observable in the trial; (2) in the ambient temp home while a clean config is selected → none observable. The real user config is never edited. ✓ P2: all five canaries (CLAUDE.md instruction · memory · settings env var via a SessionStart-hook marker · a plugin skill registered in the canary config's own marketplace/installed/enabled registry · a `hook_started` event) observable when selected; P3: the same five in the ambient temp home with a clean config selected → none observable, counted only because P2 detected all five in the same invocation; the credentials file is byte-copied, never read
- [x] The run record (arm · repo · task · trial · attempt · grader verdicts · tokens · wall time · exit state) appends to a measurement log in `docs/research/logs/`, tokens from the CLI's own output; if the CLI reports no usage, that is recorded and the task stops for an owner ruling. ✓ rows append to `docs/research/logs/ab-measurements.md` with tokens summed from `result.modelUsage`; S6 replays a real recording with `usage` deleted → a `usage-missing` row marked invalid, no tokens invented, CLI prints STOP for an owner ruling and exits 1
- [x] Grader must-FAILs: a failing acceptance test · a failing typecheck · a missing build artifact → each not-passed; a passing control → passed. ✓ S3: a failing acceptance test, a failing typecheck and a missing build artifact each → not-passed, the passing control → passed; every grader always runs; harness mutations (ignore the artifact; any-pass instead of all-pass) redden S3

## Touches
`evals/ab/` (new) · `evals/ab/fixtures/` (new) · `docs/research/logs/` (new log file)

## Assumes
- `claude -p --model --plugin-dir --output-format stream-json` reports token usage (flags verified on CLI 2.1.312; usage unverified — this task proves it).
- **open (G1):** which account pays for the trials (subscription login or API key); the credentials-only entry depends on it.

## Tracker
EPIC-023 Closed-when 1 · research §7 · intake A1, A5, A6
