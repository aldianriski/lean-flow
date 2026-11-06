---
owner: Maintainer
last_updated: 2026-11-06
update_trigger: Step 1 or Step 2 results arrive, or a step's stop rule fires
status: current
id: router-mode
tags: [process, tooling]
domain: skills
related: [harness-delta, fog-fleet-orchestration, ADR-001, ADR-010, ADR-044, ADR-053, L-017]
---

# Research — Should lean-flow take DeepSeek's router-and-worker mode, and would it deliver faster and cheaper with quality held?

> **Question.** The owner wants faster and cheaper delivery at the same quality. Does a session that only routes, with workers doing all
> execution, achieve that on lean-flow, judged as a delta over what already ships (L-017)?
> **Verdict.** Not proven, and not yet worth funding. Try a context ceiling first, since it is reversible and needs no component. Fund a matched
> router replay only if a credible saving remains and the owner has settled the release budget. Do not build the video's agent roster. Reviewed by Codex in two rounds: three High and five Med in round 1, CLEAR in round 2.

## Why this matters
Most of delivery spend is one long session re-reading and re-writing its own context. Guessing wrong either ships an agent that costs
adopters more, or leaves a real saving unclaimed.

## What DeepSeek actually released
`deepseek-ai/dsh-superagent-prototype` (31 Oct, MIT, "research prototype, not an official DeepSeek product") is a bundle for DeepSeek Harness
serving one GitHub repository. The router accepts, attaches, stops or ignores a request and may not add plans or acceptance criteria; workers
own all technical work and report `progress`, `ready`, `blocked`, `failed` or `dropped`; a follow-up on a thread goes straight to the worker that owns it. The ticket board, `eval.md`, merger,
checker, tester and reproducer are one video's Claude Code rebuild, not DeepSeek's design.

Its benchmark: about 300 messages holding about 20 work requests, five runs per design, with simulated coding, so it measures scheduling and
not code quality. Figures are from secondary write-ups; the original essay was not read.

| Setup | p50 min | p95 min | Cache reads per run |
|---|---|---|---|
| Router and workers | 12.4 | 15.7 | 23.2M |
| Single session, told to delegate | 13.8 | 29.0 | 10.8M |
| Single session, neutral prompt | 20.4 | 29.5 | 6.1M |

## Delta over lean-flow (L-017)
| Technique | Already here | Remainder |
|---|---|---|
| Tickets, eval, board, solo or team, "runs alongside" | `/task-decomposer`, `Done when` with `Negative:`, `docs/work/`, `class:`, wave preflight | None |
| Isolated workers, merger | Worktree dispatch, merge-back queue | None |
| Checker, tester, reproducer | Review, `/verify`, `/diagnose` | None |
| Watchdog | Night-run watchdog and reaper | Attended parallel runs only; not needed yet |
| Router never executes | A prose rule in `/orchestrator` | **Enforcement** |
| A worker keeps its ticket and takes its follow-ups | `SendMessage` exists; the bounded retry reuses a builder | **Continuity, which also avoids cold starts**: part of the router treatment |
| Admission gate, observe mode, GitHub and Feishu listeners | None | Out of scope: a team with inbound channels, not this loop |
| Cloud state, local execution daemon | None | Rejected: not in the prototype either |

## Findings
From lean-flow session transcripts, 24 Oct to 4 Nov, with USD from the harness's own cost rows and prices recovered per model from those rows. This session is excluded: it has no cost row yet.
Only the 11 sessions classed as delivery count below; a session with 25% or more of its Bash calls on the A/B harness is classed research. The classing is a heuristic. A resumed session's cost row can undercount, so main-thread cost comes from tokens times recovered price.

| Delivery, 11 sessions | USD | Share |
|---|---|---|
| Main thread, cache reads | 275 | 47% |
| Main thread, cache writes | 134 | 23% |
| Main thread, output | 67 | 11% |
| Everything else, mostly subagents | 113 | 19% |
| **Total** (components rounded) | **590** | |

- **Recovered prices** (USD per million, read, write, output): Opus 0.20, 8.06, 20.42; Opus 1M 0.18, 7.80, 25.26; Sonnet 0.09, 2.41, 14.55. Delivery sessions used both Opus variants, so its reads average about 0.20.
A write costs about 40 times a read, so cold starts matter more than the first draft of this plan assumed.
- **Long context is the cost.** Across all sessions, 78% of main-thread turns ran above 200k and they carry 91% of cache-read USD; 400k and up carries 61%. Delivery main-thread turns read 367k each; subagent turns across all sessions read 96k.
- **The dispatch rule does not hold.** Main threads across all sessions made 4,915 Bash, 630 Edit and 418 Write calls against 323 Agent calls. Some of that is gate running and bookkeeping that a worker would still have to do and pay for.
- **A router can be enforced.** On a scratch repo, under 0.02 USD: a plugin agent run with `claude --agent spike:router` and `tools: Read, Glob, Grep, Agent, AskUserQuestion, SendMessage` answered `NO_SHELL_TOOL` to a shell request and wrote no file, while a subagent it
  dispatched wrote one. Worktree isolation also worked from it. An ordinary session started at 23.6k tokens and the agent at 7.7k. This shows the mechanism only, on one trivial file.
- **`tools` takes whole tool names,** so a router has no shell at all and every command costs a worker.
- **The ceiling exists.** `CLAUDE_CODE_AUTO_COMPACT_WINDOW` (100k to 1M) and the agent field `autoCompactWindow` are documented. Where the variable may be set was not confirmed; the launching shell is assumed.
- **Sprint-to-sprint noise is large.** USD per sprint commit by delivery session runs from 0.82 to 2.21, with one at 7.74. Two unmatched sprints cannot show a 25% change.
- **A/B fixtures cannot test this lever.** Arm Release slots average 1.54 USD, 175 seconds and 1.45M total cache reads (largest 3.01M). That is too short to reach a 200k context, so the ceiling never fires there and a router's saving is mostly absent.

## Options considered
Forecasts for delivery only, on recovered prices. **These are models, not measurements,** and leave out rework.
- **A — Context ceiling at 200k.** Reads fall to about 90 USD at a 120k average (unvalidated), and writes rise 30% (a guess) to 174, netting **about −25%.** Summaries, re-reads and lost detail are not priced. *Trade-off:* no speed gain; can be undone by unsetting one variable.
- **B — Router, 70% of main turns moved.** Router 125k per turn, workers at 96k and 7.3k writes per turn: **about −50% with Sonnet workers, about −25% with Opus workers,** before dispatch turns, reports and retries, none of which the spike measured.
*Trade-off:* the saving depends on the cheaper tier, which is where quality could go.
- **C — The video's roster.** Duplicates the delta table's first three rows; fails ADR-001.
- **D — Run the prototype.** Needs DSH, tmux, an agent GitHub account and full OS-user access; Windows only through an unofficial fork. No gain to lean-flow.

## Recommendation
**A now, B only if earned, C and D rejected.** What is measured is where money goes, not what a change saves. Speed is not promised: gates stay human and disjoint work already runs in parallel. Quality is what can sink B, since a worker knows less than a long session.

### Plan
**Step 1 — Ceiling on real work (no extra spend).** Set `CLAUDE_CODE_AUTO_COMPACT_WINDOW=200000` in the launching shell for the next two sprints of at least 5 `Done when` boxes. Record cost, elapsed time, close-time gate failures, blocking review findings and owner corrections.
This is **directional, not proof**: only a large change can show against the noise, and that is acceptable because it is one reversible variable.
*Keep* if no guard is worse and cost per box is not up. *Revert at once* on any lost decision, wrong rework from a summary, or a quality failure. Either way, record the number with its limit.

**Step 2 — Decide whether a router trial is worth funding (tokens only).** Re-run the attribution with the ceiling on.
*Continue only if* a complete-cycle forecast, including dispatch, reports, cold starts and retries, still shows at least 20% of delivery cost, from one real task run through a local router.
*And only if* the owner has already ruled how a passing router would be released, by a funded arm or an exception, since a pass with no release path wastes the spend. Otherwise stop, and mark this doc final.

**Step 3 — Matched replay (the only proof, paid, budget set by the owner beforehand).** Rebuild one closed multi-task sprint from its `plan_commit`, twice each: ordinary session, and router with `SendMessage` reuse, both under the same ceiling so only routing differs.
Same frozen `Done when`, same model tiers declared up front, same gate. Rough cost 60 to 100 USD from the 1.48 USD per sprint commit seen here; set a hard cap. *Go* only if both router runs cost at least 25% less, elapsed time is no worse, and every acceptance box, the gate and review all pass.
*Anything else, including inconclusive, is no-go:* record it and stop. Four runs can only show a large effect, and that is the only effect worth shipping for.

**Step 4 — Ship opt-in, if and only if Step 3 passed.** A plugin `agents/router.md`, one ADR, and wiring in `/flow`, `/prime`, CONTEXT and README.
Before release: prove a clean plugin install, prove `/orchestrator` and `/flow` behave the same without the agent, and prove a Codex or Kimi host falls back to the skills. Adding wiring means "defaults unchanged" is a requirement to test, not a given. D19 was settled at Step 2.

**Facts to watch in Step 3.** A worker per command may cost more than it saves: count spawns and reuse. A worker's blocking question returns to the router, which asks by popup and resumes that worker. Gate judgment stays on Opus (ADR-010); only the mechanical run of a gate goes to a worker.
37 worktrees are registered today, so reaping comes before more parallel work. Background workers cannot prompt, so permissions come first.

**Rule fit.** ADR-044 admits an agent; this measured cost and dispatch failure are an ADR-053 basis to investigate; ADR-001 still requires shown incremental use before adding one.

## Out of scope / open questions
- Peer messaging ("team" mode): nothing here needs it.
- Unattended runs: `night-run` stays as it is; a router has no human to route to.
- A lighter router model: ADR-010 keeps gates on Opus, and this router runs gates, unlike DeepSeek's.
- Whether the numbers transfer to an adopter's smaller repo: unknown, and a reason to keep any router opt-in.
