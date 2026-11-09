---
epic: 024
slug: agent-roles-one-by-one
owner: Maintainer
last_updated: 2026-11-09
status: active
member_sprints: [SPRINT-165, SPRINT-166, SPRINT-168, SPRINT-169, SPRINT-170]
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
| 1 | **Worker contract and dispatch standard**: model by classification, isolation, the brief, which worker holds which task | DeepSeek's `worker.md` and Assignment, adapted | One sprint | Dispatches with the marker and a set model meet a share fixed at G2 (90 of 327 unset, research doc); a worker's question reaches the owner by popup and returns to that worker | **Inconclusive alone** (owner ruling, 2026-11-07). Bundled with rows 2 and 3 it read drop twice; by owner exception (D12) it **landed on `main`, unreleased**, 2026-11-08. TASK-613 § Results |
| 2 | **Decompose and promote read in workers**, each with an intake brief | DeepSeek's router | One sprint, with row 1 in place, through repeated question-and-resume rounds | Context after decompose well below 152k; the dispatch carries conversation-only intent, constraints and approvals; task quality no worse | **Inconclusive alone, thin case** (2026-11-07); bundled, drop twice. By owner exception (D12) it **landed on `main`, unreleased**, 2026-11-08. TASK-616 § Results |
| 3 | **Light `/prime`**: status without loading full docs, after each stage names and loads what it needs | Owner's reading | One whole sprint, plus a clean install and a session with no agent | Full-sprint cost and context fall, not only `/prime`'s; no downstream skill or adopter breaks for a doc it assumed loaded | **Drop twice, bundled (D11)**: SPRINT-166 then SPRINT-167. Cost, time and context read keep both times (about 0.70 USD/box, 2.9 and 3.4 min/box); each first gate failed on CONTEXT.md rules a stage skipped (L-294). Skipping CONTEXT is reverted; only the architecture-map deferral landed with rows 1 and 2 (D12). TASK-617, TASK-621 |
| 4 | Router: main thread with no write or shell tools | DeepSeek | One real task, then the matched replay, both inside one cap the owner sets first | The replay's bar in the research doc | **No-go** (TASK-630, 2026-11-08). Ordinary 3.37 and 4.37 USD, 19 and 28 min; the one completed router run 4.94 USD, 40 min, against a 2.90 bar. It tested a thick router, not DeepSeek's (D14). TASK-630 § Results |
| 4b | Thin router, as DeepSeek built it: a limited shell, no technical judgment, G1 and G2 relayed; one Executor per task owns design, build and verify | DeepSeek's prototype docs and prompts | The same matched replay | At least 25% cheaper, time no worse, quality held | **No-go** (SPRINT-170, 2026-11-09). Ordinary 3.85 and 4.32 USD, 42.0 and 53.7 min; thin router 2.66 USD, under the 3.04 bar, but 72.7 min against a 47.9 mean. R2 skipped by owner exception. TASK-638 § Results |
| 5 | Named worker with its model set, reused through `SendMessage` | DeepSeek | Against plain subagents | | Not started. Owner popup, 2026-11-08: trial against plain subagents after row 4. Already seen unprompted: 4 of 4 review and gate fixes in SPRINT-165 to 167 went back to the same builder |
| 6 | Merger running the merge-back queue | Video | Against the coordinator doing it | No bad merge | **Go** (SPRINT-170, 2026-11-09). 0 bad merges, unsafe merge refused; merger runs 3.8 and 3.9 USD, 24.0 and 27.4 min, against the 4.05 USD and 47.85 min ordinary mean. Two runs each side, so part of the time gap is likely variance. TASK-634 § Results |
| 7 | Watcher | Video; DeepSeek's essay | Only if a trial records a hung worker | Catches a real hang | Not started. Owner popup, 2026-11-08: a planted-failure trial, a hung worker, after rows 4 to 6. No real hang in 18 workers so far |
| 8 | Checker | Video | Only with a named miss by the gate and review | Finds what they missed | Not started. Owner popup, 2026-11-08: a planted-failure trial, a defect that passes the gate and review, after row 7 |
| 9 | Reproducer | Video | Only with a named gap in `/diagnose` | Reproduces real reports; no unasked change lands | Not started. Owner popup, 2026-11-08: a planted-failure trial, a seeded bug report, after row 8; it must add to `/diagnose`'s own reproduce step |

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
- **D11** — Rows 1, 2 and 3 run together as one trial, an exception to D2, because each small change alone read inconclusive. A bad result will not show which row caused it. The owner rules on the router from the result. Owner ruling, 2026-11-07.
- **D12** — Rows 1 and 2 land on `main` unreleased, with CONTEXT.md read in full, although the bundle read drop: an exception to D4, by owner ruling on 2026-11-08. Both drops traced to the CONTEXT skip, which saved about 0.01 USD per box. The next real sprints are the check; release only under D5.
  **Check run:** SPRINT-168 (14 boxes), 0 gate failures traced to rows 1 and 2; 0.68 to 0.71 USD/box (Codex build excluded), 3.4 min/box, 0 compactions.

- **D13** — Rows 7 to 9 are standard safeguards to prove, not wait for: each runs against a planted failure (a hung worker, a defect past the gate and review, a seeded bug report) and ships only if it catches its case and leaves a clean run alone. Owner ruling, 2026-11-08.
  Order: rows 4b to 9 run together as one sprint (SPRINT-170) under one 60 USD all-in cap, one change per trial (D2 stands). Owner ruling, 2026-11-08.
- **D14** — Row 4 recorded no-go, 2026-11-08, with its deviations in TASK-630 § Results. Codex found it tested a thick router: DeepSeek's keeps a limited shell, makes no technical decisions, and its benchmark traded tokens for time. By owner popup the faithful shape gets its own trial, row 4b, held to the same cost bar.
## Open questions

- How would a passing router be released: a funded arm or an exception? → owner ruling, 2026-11-08: decided when it passes, on its numbers.
- Does a return-and-resume grill keep its quality, and does it cost less than reading in the main thread? → in part: on SPRINT-166 both rounds resumed the same worker with 0 owner corrections, and context after decompose fell to 115k. Its cost is not separable from the bundle's (TASK-617).
- Is "compiler" a role the owner wants apart from build and typecheck in a worker's checks? → owner, when row 8 comes up.

## Member sprints

| Sprint | Theme | Status | What it contributed to the outcome |
|---|---|---|---|
| SPRINT-165 | A home for side-session handoffs, and the conformance line | closed `b63a9acc` | Ran row 1's worker contract and dispatch standard on real build work: 10 of 10 boxes, one planned `blocked` question returned to the same agent. Row 1's verdict: inconclusive, recorded by TASK-613 |
| SPRINT-166 | Evidence-backed diagrams | closed `e13120d1` | Ran rows 1 to 3 bundled on real build work: decompose and promote each ran in one Sonnet worker with popups and same-id resumes, three Sonnet builds, 16 of 16 boxes. The first full gate failed on two conventions the coordinator missed by skipping CONTEXT.md's rules (L-294). Verdicts are recorded by TASK-616 and TASK-617 |
| SPRINT-168 | First Jev use, and the D12 check | closed `e164151e` | The D12 check, run from a live checkout (D1): gate failures traced to rows 1 and 2: 0. The first close gate's 3 FAILs were all this sprint's own work; row 4 may start |
| SPRINT-169 | Jev as a cheap A/B judge, built under the router | closed `121b89a8` | Router-trial step 1 (TASK-630): 0 shell, edit or write calls on the main thread, 10 popups, 0 compactions. On this epic's basis 12.3 to 13.6 USD, 4.1 to 4.5 USD/box, 19.4 min/box (TASK-630 § Results). Guards: first verify 495/1 on a coordinator Log line, 1 unapproved Jev pass. Jev use 3: pre-screen trial (TASK-631) |
| SPRINT-170 | Agent roles, rows 4b to 9, trialled together | active | Runs rows 4b to 9 in one sprint under one 60 USD cap (TASK-632 to 638); each row keeps its own verdict (D2, D13). Completed at close |

## Closed when

- [x] Row 1 has a recorded verdict → inconclusive, on SPRINT-165, recorded by TASK-613
- [x] Row 2 has a recorded verdict → inconclusive alone, thin case; then bundled with rows 1 and 3 on SPRINT-166, drop, recorded by TASK-616 and TASK-617
- [x] Row 3 has a recorded verdict → drop, bundled with rows 1 and 2 on SPRINT-166, recorded by TASK-617
- [x] Row 4 has a recorded verdict → no-go, step 1 on SPRINT-169 and the matched replay, recorded by TASK-630
- [x] Row 4b has a recorded verdict → no-go, on SPRINT-170 (cheaper but slower), recorded by TASK-638
- [ ] Rows 5 to 9 each have a recorded verdict, or a recorded reason they did not run → TASK-633, TASK-634, TASK-635, TASK-636, TASK-637
- [ ] Whatever passed has shipped under D5, or the owner ruled not to ship it → next slice: release, if anything passes
