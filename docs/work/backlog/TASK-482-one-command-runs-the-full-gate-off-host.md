---
id: TASK-482
title: "one command runs the full gate on the off-host runner and prints its verdict"
priority: P2
size: S
risk: low
autonomy: HITL
class: execution
tier: G
authority: J1
origin: decomposer
state: ready
depends-on: []
---

# TASK-482 — one command runs the full gate on the off-host runner and prints its verdict

## Why
ADR-053 admitted on a **measured cost**: SPRINT-137's system verify took three hand-typed VPS runs of about five tool calls each,
and one was red only because a hand-typed `git clean -x` deleted the clone's dev dependencies. It is a wrapper around the existing
gate only, with no new check, verdict format, scheduler or run state. TypeScript on Bun (no new `.sh`). Tier G (other): it is
maintainer-only, but a false green could close a sprint. Review cap 2: one review and one re-review, with spend shown each round.
Consumer: none. This is lean-flow's own tooling, and no shipped skill or template names it.

## Done when
- [ ] One `bun` command ships HEAD to the runner as an incremental git bundle from a commit the remote already has (a full bundle
      when it has none), checks it out detached, cleans untracked files without removing ignored ones, runs
      `QA_FULL=1 sh scripts/qa-check.sh`, and prints the remote's verdict line, every `FAIL` line and the remote exit code.
- [ ] It exits zero only when the remote exits zero AND supplies a valid passing verdict line. A non-zero remote exit is preserved;
      a transport failure, a missing verdict line, or one that contradicts the exit code exits non-zero, naming the case.
- [ ] Host, key and remote dir come from `LF_GATE_HOST`, `LF_GATE_KEY` and `LF_GATE_DIR`. An unset one is refused by name before
      any network call. The command never reads `.env` and uses key auth only.
- [ ] Small stubbed-transport tests retain each exit case above, beside a green control.
- [ ] A real full-gate run through the command, with its printed verdict equal to the remote log's, is accepted BEFORE TASK-483 or
      TASK-484 relies on it; the sprint's close run is extra evidence, not the acceptance.
- [ ] `.claude/CONTEXT.md` § Sprint model's QA_FULL bullet names the command as the off-host route when the host cannot run the gate.

## Touches
a new `scripts/` TypeScript command · its test · `.claude/CONTEXT.md`

## Assumes
- The owner provisions the remote (a clone with dev dependencies installed); this task does not.
- A blocking remote run (about 105–125 s) fits one foreground tool call (at most 600 s), so no polling loop is needed. The real run
  confirms it.

## Tracker
- Owner selection 2026-10-24 (candidate C), after triage and a Codex next-work review; intake draft reviewed by Codex 2026-10-24
  (APPROVE WITH FIXES, folded in before approve)
