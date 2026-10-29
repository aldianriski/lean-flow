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
- [ ] One command runs one smoke task × one trial on a fresh copy of a small fixture repo under `evals/ab/fixtures/` (not workdoo, not clinic, not a task-set task); the source fixture is hash-identical afterwards.
- [ ] Pins come from an arm config and are echoed in the run record: full model ids incl. dispatch tiers · effort · permissions · plugin commit SHA + content hash (none for A0) · config dir.
- [ ] Plugin pin verified, not echoed: before the trial the harness hashes the plugin directory the CLI will load and refuses on mismatch with the pin; it also checks the trial's init event names that plugin. Must-FAIL: a pin at a different commit → refused; control → runs.
- [ ] Access isolation: a smoke task reading a file outside the trial copy → denied and recorded; a read inside the copy → allowed.
- [ ] Config isolation with a leak-detecting control: every trial runs with a temp home (`HOME`/`USERPROFILE`) and an isolated config dir, auth entering as a credentials-only entry. Canaries (an instruction in CLAUDE.md, a memory, an env var in settings, a skill in plugins) planted (1) as the selected config → each observable in the trial; (2) in the ambient temp home while a clean config is selected → none observable. The real user config is never edited.
- [ ] The run record (arm · repo · task · trial · attempt · grader verdicts · tokens · wall time · exit state) appends to a measurement log in `docs/research/logs/`, tokens from the CLI's own output; if the CLI reports no usage, that is recorded and the task stops for an owner ruling.
- [ ] Grader must-FAILs: a failing acceptance test · a failing typecheck · a missing build artifact → each not-passed; a passing control → passed.

## Touches
`evals/ab/` (new) · `evals/ab/fixtures/` (new) · `docs/research/logs/` (new log file)

## Assumes
- `claude -p --model --plugin-dir --output-format stream-json` reports token usage (flags verified on CLI 2.1.312; usage unverified — this task proves it).
- **open (G1):** which account pays for the trials (subscription login or API key); the credentials-only entry depends on it.

## Tracker
EPIC-023 Closed-when 1 · research §7 · intake A1, A5, A6
