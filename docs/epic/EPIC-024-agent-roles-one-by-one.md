---
epic: 024
slug: agent-roles-one-by-one
owner: Maintainer
last_updated: 2026-11-07
status: active
member_sprints: [SPRINT-165]
update_trigger: a member sprint closes, a trial ends, or a decision lands that changes the outcome
---

# EPIC-024 — A Small Coordinator, Then Agent Roles, One by One

> **Outcome:** a lean-flow session reaches its build stage with a small main-thread context and keeps it small, and each change that was tried has a recorded verdict
> (keep, drop, inconclusive or did not run); only what passed reaches adopters.

## Why this, why now

Owner goal (2026-11-06): deliver faster and cheaper with quality held, trying the pattern's parts one at a time with every step tracked. Owner's reading: the limit is not the problem, because DeepSeek's
router stays small by never doing the reading, while lean-flow's one session does everything. The numbers agree. In one session, `/prime` left 83k (the median of 10 recent sessions) and `/task-decomposer` left 152k, before any build.
Past main threads averaged 367k read per turn, with 4,915 Bash calls against 323 Agent calls, which points to inline execution but does not establish it as the cause. `orchestrator/references/dispatch.md` was read in 2 of 19 sessions, and it defines no worker report states or route for a worker's question.
Evidence and limits → [`docs/research/router-mode.md`](../research/router-mode.md). Trials need real sprints in turn, so this spans sprints.

## Scope

**In:** a worker contract; decompose and promote doing their reading in workers; a light `/prime`; then the ladder's other rows, one trial each; shipping what passed.
**Out (explicitly not):** running DeepSeek's prototype; GitHub or chat listeners; cloud state; changing `night-run`; dropping G1 and G2. DeepSeek's router may not add plans or acceptance criteria, but lean-flow's gates exist to set them, so that rule stays out.

## The ladder

Run top to bottom, one at a time. Every trial records main-thread context after `/prime` (83k, median of 10), after decompose (152k, one session) and at the first build step (no baseline yet; take it from SPRINT-164), compactions, USD per box across all agents (`bun scripts/session-cost.ts`, baseline about 1.7), elapsed time,
close-time gate failures, blocking review findings and owner corrections. A row passes only with **overall cost or elapsed time better and no guard worse**; a better sub-measure alone is not a pass.

From row 2 on, cost and time use one basis, by owner ruling after row 1 (TASK-613 § Results). USD per box runs from the promote call to the sprint's last commit, across all agents; a whole session also pays for decomposing and releasing.
Minutes per box merge main-thread and worker activity, dropping gaps over 5 minutes; summed `turn_duration` overcounts, by 41 to 192 minutes per session on the four sprints checked.
On this basis the baselines are 0.88 to 1.41 USD/box and 4.1 to 6.2 min/box (SPRINT-139, 140, 146).

| # | Change | Source | Trial | Must also show | Status |
|---|---|---|---|---|---|
| 0 | Context limit | This repo's data | One session at 200k | | **Closed: wrong test.** Fired near 170k with 60k of room; see the research doc |
| 1 | **Worker contract and dispatch standard**: model by classification, isolation, the brief, which worker holds which task | DeepSeek's `worker.md` and Assignment, adapted | One sprint | Dispatches with the marker and a set model meet a share fixed at G2 (90 of 327 unset, research doc); a worker's question reaches the owner by popup and returns to that worker | **Inconclusive, direction only (D4), not shipped**, owner ruling 2026-11-07. The rule's numbers as written read keep; like for like, 1.09 to 1.14 USD/box and 4.9 min/box sit inside the baselines. Coverage 2 of 2, and the planned question returned to the same agent. Text stays on `trial/epic-024-row1` at `32ac2f42`. Measures → TASK-613 § Results |
| 2 | **Decompose and promote read in workers**, each with an intake brief | DeepSeek's router | One sprint, with row 1 in place, through repeated question-and-resume rounds | Context after decompose well below 152k; the dispatch carries conversation-only intent, constraints and approvals; task quality no worse | Ready to launch: `trial/epic-024-row2` at `65ace762`, a child of row 1's branch, so row 1 is in place without being on `main` (owner ruling 2026-11-07). Hosted by adopting the owner's video kit; rules in TASK-616. Row 1's text reaches `main` only after a later row reads keep, or by owner ruling |
| 3 | **Light `/prime`**: status without loading full docs, after each stage names and loads what it needs | Owner's reading | One whole sprint, plus a clean install and a session with no agent | Full-sprint cost and context fall, not only `/prime`'s; no downstream skill or adopter breaks for a doc it assumed loaded | Not started |
| 4 | Router: main thread with no write or shell tools | DeepSeek | One real task, then the matched replay, both inside one cap the owner sets first | The replay's bar in the research doc | Not started |
| 5 | Named worker with its model set, reused through `SendMessage` | DeepSeek | Against plain subagents | | Not started |
| 6 | Merger running the merge-back queue | Video | Against the coordinator doing it | No bad merge | Not started |
| 7 | Watcher | Video; DeepSeek's essay | Only if a trial records a hung worker | Catches a real hang | Waiting on evidence |
| 8 | Checker | Video | Only with a named miss by the gate and review | Finds what they missed | Did not run, unless that miss appears |
| 9 | Reproducer | Video | Only with a named gap in `/diagnose` | Reproduces real reports; no unasked change lands | Did not run, unless that gap appears |

## Decisions

- **D1** — Trial agents are passed for that launch only (`--agents` or `--plugin-dir`), never left in `.claude/agents/`, because a discoverable description can change an ordinary session and blur its numbers. The router runs as the main thread through `--agent`.
- **D2** — One change per trial, so a result can be traced to it. Skill changes in rows 1 to 3 land one sprint apart.
- **D3** — No trial adds spend beyond the sprint it runs on, except row 4, under a hard cap the owner sets first.
- **D4** — Real sprints show direction, not proof; they differ too much to show a small change. A verdict says which it is. Inconclusive means not shipped.
- **D5** — Shipping needs a separate owner ruling per release on an arm or an exception (EPIC-023 D19), a clean install and, for an agent, a fallback on hosts without agents. Rows 1 to 3 change shipped skills, so D19 applies to them too.
- **D6** — Gate, grill and design judgment stay on the session model (ADR-010), whichever part runs the mechanical work. Subagents cannot use `AskUserQuestion` (documented), so a worker's question always returns to the coordinator.
- **D8** — `docs/work/` task files stay the unit of work, with no rename to tickets. The video's ticket is what a task file already holds. DeepSeek's Ticket is a different thing: a runtime record of a stage and its worker Assignment, with no acceptance criteria. Only the worker record is taken, in row 1.
- **D9** — Status stays the folder; not a prerequisite for row 1. ADR-045 D6 stands as a rule (a transition is its own commit), but not its reason: git records no rename either way, so `git mv` gains nothing over a move and `git add`.
  Measured over 14 days: 230 of 7,080 main-thread turns ran `git mv` under `docs/work/`, about 34 USD of about 840. That is what those whole turns cost, not what a change would save, so the saving from any change is unproven, not nil.
  A field would reach adopters' trees and whatever reads the folders: a text search hits 18 skill files and 62 eval files, not a confirmed migration scope. Workers do not move tasks; transitions stay with the coordinator. Batching moves into one commit would need ADR-045 D6 amended: not now. Owner reaffirmed on these corrected figures, 2026-11-07.
- **D7** — A context limit may return later as a safety net, only as its own row and with evidence from rows 1 to 3.
- **D10** — One operator session runs the workers and brings gates to the owner as popups. A second session opens only for a trial launch or when context runs out, and sessions do not relay work to each other. No session messages a measured trial, because that adds to its context and blurs the numbers. Owner ruling, 2026-11-07.

## Open questions

- How would a passing router be released: a funded arm or an exception? → owner ruling, before row 4.
- Does a return-and-resume grill keep its quality, and does it cost less than reading in the main thread? → row 2's trial.
- Is "compiler" a role the owner wants apart from build and typecheck in a worker's checks? → owner, when row 8 comes up.

## Member sprints

| Sprint | Theme | Status | What it contributed to the outcome |
|---|---|---|---|
| SPRINT-165 | A home for side-session handoffs, and the conformance line | closed `b63a9acc` | Ran row 1's worker contract and dispatch standard on real build work: 10 of 10 boxes, one planned `blocked` question returned to the same agent. Row 1's verdict: inconclusive, recorded by TASK-613 |

## Closed when

- [x] Row 1 has a recorded verdict → inconclusive, on SPRINT-165, recorded by TASK-613
- [ ] Row 2 has a recorded verdict → next slice: decompose and promote read in workers
- [ ] Row 3 has a recorded verdict → next slice: light `/prime`
- [ ] Row 4 has a recorded verdict, or a recorded reason it did not run → next slice: local router, one real task
- [ ] Rows 5 to 9 each have a recorded verdict, or a recorded reason they did not run → next slice: per the ladder
- [ ] Whatever passed has shipped under D5, or the owner ruled not to ship it → next slice: release, if anything passes
