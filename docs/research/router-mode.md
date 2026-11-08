---
owner: Maintainer
last_updated: 2026-11-07
update_trigger: A trial in EPIC-024 reports, or its stop rule fires
status: current
id: router-mode
tags: [process, tooling]
domain: skills
related: [harness-delta, fog-fleet-orchestration, ADR-001, ADR-010, ADR-044, ADR-053, L-017]
---

# Research — Should lean-flow take DeepSeek's router-and-worker mode, and would it deliver faster and cheaper with quality held?

> **Question.** The owner wants faster and cheaper delivery at the same quality. Does a session that only routes, with workers doing all
> execution, achieve that on lean-flow, judged as a delta over what already ships (L-017)?
> **Verdict.** Yes in part, for a different reason than DeepSeek's. The router alone will not do it: lean-flow's cost comes from one session doing all planning reads and all execution.
> Make the coordinator small first (a worker contract, planning reads in workers, a light `/prime`), and fund a router replay only if a saving remains. A context limit is the wrong test. Do not build the video's roster.
> Amended 2026-11-06 after measuring a real session; the first plan's Step 1 is withdrawn. Codex reviewed each version.

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
- **Baseline for the ceiling test.** About 1.7 USD per box: 565 USD over 335 boxes, SPRINT-133 to 151, 24 to 31 Oct, 1.2 to 2.7 by session. `scripts/session-cost.ts` repeats the cost side; box counts come from `docs/sprint/INDEX.md`.
- **A/B fixtures cannot test this lever.** Arm Release slots average 1.54 USD, 175 seconds and 1.45M total cache reads (largest 3.01M). That is too short to reach a 200k context, so the ceiling never fires there and a router's saving is mostly absent.

### Figures behind EPIC-024 D9 and row 1
Main-thread transcripts for the 14 days to 2026-11-06 15:32 UTC, and `git log` over the same window. These were one-off queries and the scripts were not kept, so the selection is stated here.

- **Task moves:** 230 of 7,080 turns ran `git mv` under `docs/work/`, and 226 of them also committed in that call. Those turns cost about 34 USD of about 840, at the recovered prices above. That counts each whole turn, not what a change would save.
- **Correction:** the first version of this query found 55 turns and 6.4 USD. It read only the first record of each message, and a tool call usually sits in a later record. The corrected count fits git: of 1,028 commits, 222 have a rename under `docs/work/` and 225 have a status-move subject.
- **Agent calls:** 327 unique calls, 90 with no model set, 39 with isolation set. The earlier 113 of 417 counted 90 calls twice, because they also appear in a second record type.
- **Files naming the status folders:** file hits, not a confirmed migration scope. With `docs/work/(backlog|todo|in_progress|review|done|cancel)`, 18 skill files and 62 eval files. With looser patterns, 24 and 76.

## Options considered
Forecasts for delivery only, on recovered prices. **These are models, not measurements,** and leave out rework.
- **A — Context ceiling at 200k.** Reads fall to about 90 USD at a 120k average (unvalidated), and writes rise 30% (a guess) to 174, netting **about −25%.** Summaries, re-reads and lost detail are not priced. *Trade-off:* no speed gain; can be undone by unsetting one variable.
- **B — Router, 70% of main turns moved.** Router 125k per turn, workers at 96k and 7.3k writes per turn: **about −50% with Sonnet workers, about −25% with Opus workers,** before dispatch turns, reports and retries, none of which the spike measured.
*Trade-off:* the saving depends on the cheaper tier, which is where quality could go.
- **C — The video's roster.** Duplicates the delta table's first three rows; fails ADR-001.
- **D — Run the prototype.** Needs DSH, tmux, an agent GitHub account and full OS-user access; Windows only through an unofficial fork. No gain to lean-flow.

## Recommendation
**A now, B only if earned, C and D rejected.** What is measured is where money goes, not what a change saves. Speed is not promised: gates stay human and disjoint work already runs in parallel. Quality is what can sink B, since a worker knows less than a long session.

### Amended 2026-11-06: what one real session showed
Session `f0e86365`, Opus, `CLAUDE_CODE_AUTO_COMPACT_WINDOW=200000`, 42 turns, in intake and promote only. The owner challenged the limit, and the numbers agree.
- **The limit fired near 170k, not 200k, and context returned to about 108k.** That leaves about 60k of room, used in about 20 turns.
- **Each compaction costs real money and time:** 55 seconds, a 0.60 USD re-write on the next turn, and the summary call, which the transcript does not show (about 0.15 USD, estimated). Two so far: about 1.20 USD of 4.88 USD.
- **Option A's 25% was too high.** Reads at the 200k limit plus compaction come to about 0.066 USD per turn against 0.073 with no limit: about 11% on reads, with the summary call's cost estimated. Reads are 47% of delivery spend, so about 5% of total if nothing else moves. 300k models near 30% on reads, assuming 3k growth per turn. These are models from one session.
- **The floor is set before any build.** Start 64k, after `/prime` 83k (the median of 10 sessions), after `/task-decomposer` 152k. Skill bodies and `CONTEXT.md` are about 20k of that growth; the rest is reads for this task and the session's own drafting. A simpler task would read less, unmeasured.
- **Later growth probably comes from inline execution:** past main threads averaged 367k per turn. This session has not reached a build, so that is not established, and the first build step has no baseline yet.
- **Subagents cannot use `AskUserQuestion`** (documented), and a resumed subagent keeps its history. So a stage run in a worker must return its question to the coordinator. `context: fork` skills exist, but do not see the conversation.

### Plan
Tracked in `docs/epic/EPIC-024-agent-roles-one-by-one.md`, one change per trial, each landing a sprint apart:
1. A worker contract and coordinator rules.
2. Decompose and promote doing their reading in workers, with an intake brief that carries conversation-only intent, constraints and approvals.
3. A light `/prime`, only after each stage names and loads what it needs, since it removes context downstream skills assume is there.
4. The router, by one real task and then the matched replay below, only if a complete-cycle forecast still shows at least 20% of delivery cost and the owner has ruled how it would be released.

**Matched replay (the only proof, paid, budget set by the owner beforehand).** Rebuild one closed multi-task sprint from its `plan_commit`, twice each: ordinary session, and router with `SendMessage` reuse. Same frozen `Done when`, same model tiers declared up front, same gate.
Rough cost 60 to 100 USD from the 1.48 USD per sprint commit seen here; set a hard cap. *Go* only if both router runs cost at least 25% less, elapsed time is no worse, and every acceptance box, the gate and review all pass. *Anything else, including inconclusive, is no-go.* Four runs can only show a large effect, and that is the only effect worth shipping for.

**Shipping.** Whatever passes ships opt-in or by default as its row says, after a clean plugin install, a same-behaviour check without any agent, and a Codex or Kimi fallback. D19 is ruled before the spend.

**Rule fit.** ADR-044 admits an agent; this measured cost and dispatch failure are an ADR-053 basis to investigate; ADR-001 still requires shown incremental use before adding one.

### Amended 2026-11-08: row 4's result, and what DeepSeek's router is
The router as built was a no-go (TASK-630 § Results): one completed router replay cost 4.94 USD and took 40 minutes, against an ordinary mean of 3.87 USD and about 24.
- **Correction.** Read at first hand (`docs/003-execution.md`, `docs/004-prompts.md`, `prompts/orchestrator.md`), DeepSeek's main session keeps `bash` with 5-second limits and a smaller tool set. It "makes no technical decisions", writes routing notes of at most 30 words, and never waits.
  One Executor session per ticket reads the sources, judges scope, implements and verifies, and takes its own follow-ups. Row 4 removed the shell but kept the judgment, which is the opposite trade.
- **Option B's forecast was wrong in principle.** Moving 70% of main turns does not remove their cost: the router's own thread fell about 4% while worker cost rose about 3.5 times.
- **DeepSeek aims at time and attention.** A reproduction of its essay (the original was not read) describes trading tokens for shorter, steadier completion times. A faithful trial (EPIC-024 row 4b) is held to lean-flow's cost bar by owner ruling.

## Out of scope / open questions
- Peer messaging ("team" mode): nothing here needs it.
- Unattended runs: `night-run` stays as it is; a router has no human to route to.
- A lighter router model: ADR-010 keeps gates on Opus, and this router runs gates, unlike DeepSeek's.
- Whether the numbers transfer to an adopter's smaller repo: unknown, and a reason to keep any router opt-in.
