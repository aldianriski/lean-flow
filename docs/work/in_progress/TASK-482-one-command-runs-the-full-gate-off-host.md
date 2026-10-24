---
id: TASK-482
title: "one command runs the full gate on the off-host runner and prints its verdict"
sprint: SPRINT-138
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
- [x] One `bun` command ships HEAD to the runner as an incremental git bundle from a commit the remote already has (a full bundle ✓ `8ad4169c`: incremental `<remoteHead>..HEAD` bundle (full when absent/non-ancestor/unknown), detached checkout, `git clean -fdq` (no -x), `QA_FULL=1 sh scripts/qa-check.sh`, prints verdict + FAIL lines + remote rc (stub tests); real run printed them
      when it has none), checks it out detached, cleans untracked files without removing ignored ones, runs
      `QA_FULL=1 sh scripts/qa-check.sh`, and prints the remote's verdict line, every `FAIL` line and the remote exit code.
- [x] It exits zero only when the remote exits zero AND supplies a valid passing verdict line. A non-zero remote exit is preserved; ✓ `69d33787`: exit 0 only on rc 0 + a passing verdict via qa-verdict.ts judgeOutput; non-zero rc preserved (clamped ≤255); transport/setup/no-verdict/contradiction/no-log/TRUNCATED each exit non-zero naming the case, stderr tail shown (38/0)
      a transport failure, a missing verdict line, or one that contradicts the exit code exits non-zero, naming the case.
- [x] Host, key and remote dir come from `LF_GATE_HOST`, `LF_GATE_KEY` and `LF_GATE_DIR`. An unset one is refused by name before ✓ `8ad4169c` + `d62eb03b`: refuses without `bun --no-env-file` before reading any variable; unset LF_GATE_* refused by name before any spawn; an MSYS-rewritten drive-letter LF_GATE_DIR refused; key auth only (`-i … IdentitiesOnly BatchMode`, `--` before host); child-process tests
      any network call. The command never reads `.env` and uses key auth only.
- [x] Small stubbed-transport tests retain each exit case above, beside a green control. ✓ evals/gate-remote.test.ts 38 pass / 0 fail through an injected stub transport beside a green control; gated by evals/run-workflow-command-fixtures.ts (floor 38), registered always-on
- [x] A real full-gate run through the command, with its printed verdict equal to the remote log's, is accepted BEFORE TASK-483 or ✓ accepted 2026-10-24 on `d62eb03b` (main, merged): printed `QA-CHECK: 310 pass, 0 fail`, remote rc 0, exit 0; the remote log read separately over ssh shows the same last verdict line and rc 0. Accepted before T2/T3 use it
      TASK-484 relies on it; the sprint's close run is extra evidence, not the acceptance.
- [x] `.claude/CONTEXT.md` § Sprint model's QA_FULL bullet names the command as the off-host route when the host cannot run the gate. ✓ `d62eb03b`: the QA_FULL bullet ends "Off-host: `bun --no-env-file scripts/gate-remote.ts` (`LF_GATE_HOST`/`KEY`/`DIR`) runs it remotely."; CONTEXT.md 150 <= 150

## Touches
a new `scripts/` TypeScript command · its test · `.claude/CONTEXT.md`

## Assumes
- The owner provisions the remote (a clone with dev dependencies installed); this task does not.
- A blocking remote run (about 105–125 s) fits one foreground tool call (at most 600 s), so no polling loop is needed. The real run
  confirms it.

## Tracker
- Owner selection 2026-10-24 (candidate C), after triage and a Codex next-work review; intake draft reviewed by Codex 2026-10-24
  (APPROVE WITH FIXES, folded in before approve)
