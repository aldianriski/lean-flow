---
epic: 024
slug: agent-roles-one-by-one
owner: Maintainer
last_updated: 2026-11-06
status: proposed
member_sprints: []
update_trigger: a member sprint closes, a trial ends, or a decision lands that changes the outcome
---

# EPIC-024 — Dispatch Guidance, Then Agent Roles, One by One

> **Outcome:** each change from the router-and-worker pattern has a recorded verdict (keep, drop, inconclusive or did not run) from its own trial on lean-flow,
> and only a change whose numbers passed reaches adopters.

## Why this, why now

Owner goal (2026-11-06): deliver faster and cheaper with quality held, trying the pattern's parts one at a time with every step tracked. Owner's reading: the real gap is that `/orchestrator` spawns
agents without a proper guide. Transcripts from 19 sessions over 14 days agree: `orchestrator/references/dispatch.md` (808 lines, mostly coordinator mechanics) was read in 2 sessions, 55 of 414 Agent
prompts named a procedure skill, and main threads made 4,915 Bash calls against 323 Agent calls. It defines no worker report states and no path for a worker's question. DeepSeek's equivalents are short role prompts:
a router told what it never does, and a worker told what it owns and how to report.
Evidence and limits → [`docs/research/router-mode.md`](../research/router-mode.md). Trials need real sprints in turn, so this spans sprints.

## Scope

**In:** one trial per row, in order; a short worker contract and coordinator rules; trial agents loaded only for the run that tests them; a recorded verdict for each; shipping what passed.
**Out (explicitly not):** running DeepSeek's prototype; GitHub or chat listeners; cloud state; changing `night-run`; dropping G1 and G2. DeepSeek's router may not add plans or acceptance criteria, but lean-flow's gates exist to set them, so that rule stays out.

## The ladder

Run top to bottom, one at a time. Every trial records USD per box across all agents (`bun scripts/session-cost.ts`, baseline about 1.7), elapsed time, close-time gate failures, blocking review findings and owner corrections.
A row passes only with **overall cost or elapsed time better and no guard worse**; a better sub-measure alone is not a pass. Source says whose idea it is.

| # | Change | Source | Trial | Must also show | Status |
|---|---|---|---|---|---|
| 0 | Context limit, no agent | This repo's data | Two sprints of at least 5 boxes at 200k (TASK-609) | Compaction fired near 200k, or the trial is void | **In progress** |
| 1 | **Worker contract and coordinator rules**, no agent: what a worker owns, its report states, one concrete question | DeepSeek's `worker.md`, adapted | One sprint, with the text where `/orchestrator` always reads it | Nearly every dispatch carries it (no baseline; 55 of 414 name a skill today); a worker's question reaches the owner as a popup | Next |
| 2 | Router: main thread with no write or shell tools | DeepSeek | One real task, then the matched replay, both inside one cap the owner sets first | The replay's bar in the research doc: both runs at least 25% cheaper, elapsed no worse, every check passes | Not started |
| 3 | Named worker with its model and context limit, reused through `SendMessage` | DeepSeek | Against plain subagents | | Not started |
| 4 | Merger running the merge-back queue | Video | Against the coordinator doing it | No bad merge | Not started |
| 5 | Watcher | Video; DeepSeek's essay | Only if a trial records a hung worker | Catches a real hang | Waiting on evidence |
| 6 | Checker | Video | Only with a named miss by the gate and review | Finds what they missed | Did not run, unless that miss appears |
| 7 | Reproducer | Video | Only with a named gap in `/diagnose` | Reproduces real reports; no unasked change lands | Did not run, unless that gap appears |

## Decisions

- **D1** — Trial agents are passed for that launch only (`--agents` or `--plugin-dir`), never left in `.claude/agents/`, because a discoverable description can change an ordinary session and blur its numbers. The router runs as the main thread through `--agent`.
- **D2** — One change per trial, so a result can be traced to it.
- **D3** — No trial adds spend beyond the sprint it runs on, except row 2, under a hard cap the owner sets first.
- **D4** — Real sprints show direction, not proof; they differ too much to show a small change. A verdict says which it is. Inconclusive means not shipped.
- **D5** — Shipping needs a separate owner ruling per release on an arm or an exception (EPIC-023 D19), a clean install and, for an agent, a fallback on hosts without agents. Row 1 changes `/orchestrator`, so D19 applies to it too.
- **D6** — Gate, grill and design judgment stay on the session model (ADR-010), whichever part runs the mechanical work.

## Open questions

- How would a passing router be released: a funded arm or an exception? → owner ruling, before row 2.
- Is "compiler" a role the owner wants apart from build and typecheck in a worker's checks? → owner, when row 6 comes up.

## Member sprints

| Sprint | Theme | Status | What it contributed to the outcome |
|---|---|---|---|

## Closed when

- [ ] Row 0 has a recorded verdict → TASK-609
- [ ] Row 1 has a recorded verdict → next slice: worker contract and coordinator rules
- [ ] Row 2 has a recorded verdict, or a recorded reason it did not run → next slice: local router, one real task
- [ ] Rows 3 to 7 each have a recorded verdict, or a recorded reason they did not run → next slice: per the ladder
- [ ] Whatever passed has shipped under D5, or the owner ruled not to ship it → next slice: release, if anything passes
