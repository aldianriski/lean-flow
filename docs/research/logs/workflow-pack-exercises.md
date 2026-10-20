---
owner: Maintainer
last_updated: 2026-10-20
update_trigger: a workflow pack is exercised with no lean-flow plugin present
status: active
id: workflow-pack-exercises
tags: [process]
domain: governance
related: [reference-rejudge]
---

# Workflow packs — Exercise Log

> Each run here has a fresh agent with no lean-flow plugin follow one pack from its text alone, in a repository that never
> installed lean-flow (EPIC-007 condition 3; ruling D7: "reusable without the plugin" = readable alone by any agent). Append-only.

## 2026-10-20 — `packs/software-implementation.md` (SPRINT-132 T3 · TASK-465)

**Setup.**
- **Agent:** a separate headless process, `claude -p --setting-sources local --disable-slash-commands --output-format
  stream-json --verbose --model sonnet --permission-mode acceptEdits --allowedTools "Bash(npm *)" "Bash(node *)" "Bash(git *)"`.
  It was not a sub-agent, because a sub-agent inherits the host session's plugin.
- **Scratch repository:** in the system temp directory. It is a three-file Node project (`package.json` · `src/units.js` with
  `pad2` · one passing test) written from literal text by the coordinator and committed as `initial: pad2 + one test`.
- **Prompt:** the pack's full text inline, then the request: add `formatDuration(seconds)`, for example 3723 → `"1h 02m 03s"`;
  tests run with `npm test`; nobody is available to answer questions.

**Run 1 — a harness fault, so the run was repeated once (owner rule).** The scratch repository was first placed under the
host's `.claude/` directory, which Claude Code treats as sensitive, so all 5 edit attempts were refused. The agent did not route
around the block: it stopped, stated its planned behaviour list ("nobody was available to confirm it") and reported that no
test had run.

**Run 2 — the evidence.** It took 17 turns, 50 s and $0.12.

| Check | How | Result |
|---|---|---|
| No lean-flow plugin or skill loaded | the run's own `system/init` event (mechanical) | plugins: the 3 built-ins only (agents-md · telemetry · plugin-authoring); `skills: []`; `slash_commands: []` |
| No lean-flow file in the repository | file count asserted before the run; content hashes vs lean-flow's tree, before and after (mechanical; a seeded copy of `packs/CONTRACT.md` was caught as 1 match) | before: exactly 3 files, 0 identical; after: 2 files modified, none added, 0 identical |
| Whole suite | `npm test` after the run (mechanical) | 5 tests, 5 pass, 0 fail, exit 0 |

**The pack's output contract, item by item.**
- The behaviour list, stated at the top of the output because nobody could confirm it: **met**. The list was 3723 · 59 · 0 and
  3600 · 360000.
- For each behaviour, a test written before its code, with its failing (RED) run recorded before the code: **met for
  behaviour 1 only**. The tracer test failed first (`# fail 1`, `formatDuration` not exported), then the code was written,
  then the run went GREEN. Behaviours 2–4 were each added one test at a time, but each passed on its first run because the
  tracer code already handled them. The agent reported this rather than write wrong code to force a failure.
- The code that makes the tests pass: **met**.
- A final whole-suite run that exits 0: **met**.

**The eight fields, walked against the transcript.**

| Field | Followed? |
|---|---|
| `purpose` | followed |
| `inputs` | followed (the test command was given; with no requester it took the `escalation` path) |
| `procedure` | partly: plan, tracer bullet and slice close were followed; the incremental loop's "see it fail" could not be followed for behaviours already covered; refactor was not needed |
| `capabilities` | followed |
| `output contract` | not fully met (RED evidence for 1 of 4 behaviours) |
| `verification` | followed (the final run was unfiltered with exit 0; mid-cycle runs were filtered views, not the gate) |
| `escalation` | followed (it stated the list; it named the input it left unhandled, negative or non-integer seconds) |
| `risk policy` | followed (no refactor while RED; tests through the public interface only) |

**Verdict under the owner's binary rule: not met.** The output contract is not fully met, so TASK-465's first box stays open
for the owner's ruling.

**Finding (in the pack and in its source).** Neither the pack nor `/tdd` says what to do when a new test passes on its first
run, because the code written for an earlier behaviour already covers it. The pack's own checklist holds the natural answer
("name the production change that would fail this test"), but its output contract demands a RED run that, in this case, only
deliberately wrong code could produce.
