---
sprint: 170
slug: agent-roles-rows-4b-to-9
owner: Maintainer
last_updated: 2026-11-08
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-170 — Execution Log

> Append-only companion to [`../SPRINT-170-agent-roles-rows-4b-to-9.md`](../SPRINT-170-agent-roles-rows-4b-to-9.md). Uncapped by design:
> this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (STANDARD §9). **Never edit a past entry** — correct it with a new one.
>
> Rendered at promote, in the same commit as `plan locked`; its first entry is the `promote` entry
> carrying the signed governance checklist.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.
> Its heading names every `Tn` it changes, and every path the entry names sits in one of those tasks' `Layers:` or `Cites:`.

### 2026-11-08 | promote | plan locked, 7 members: TASK-632, 638, 633 to 637
Promote governance checklist, signed by the owner by popup. Sign-off text, verbatim: "Signed, proceed" (question: "Do you sign off the SPRINT-170 governance checklist and draft so the worker can write and commit `plan locked`? The checklist: no L-promotion · no TD escalation · delete TD-301, TD-302, TASK-622 and TASK-623 (defer 596, 607, 608, 601, 609) · EPIC-024 record and coverage clean · no roadmap or handoff ledger. The draft: 7 members (632 split into 632 + 638; 634 depends on 638; 633's dependency recorded as decision D5) · 60 USD cap with a 48 USD warning · G2 notes copied into the sprint Decisions · TASK-630 replay setup recorded · EPIC-024 D13 set to "together". G1 and G2 stay unsigned.").
Frontier answers, verbatim: "Split 632 + 638 (Recommended)" · "Due 4 only (Recommended)" · "Decision only (Recommended)" · "Warn at 48 USD". Owner rulings, 2026-11-08, verbatim: "these six run as one sprint (EPIC-024 rows 4b to 9; update D13's order to "together", D2 still one change per trial); 60 USD all-in cap across all six."
- ☑ L-promotion: 276 entries; 49 at `promoted: no`, all at count 1 (the 49 `promoted: no` lines reconcile with the 49 `count: 1` lines); none at count 2 or more with `promoted: no`. Disposition: none needed.
- ☑ TD aging: 114 open rows (69 low, 24 minor, 13 medium, 8 trivial, 0 high); 113 are aged 3 or more sprints, the one newer row is TD-303 (SPRINT-169). Disposition: keep, nothing escalated. TD-290 stays open as a carry-forward.
- ☑ doc-aging, §11 and §2 caps: `check-doc-caps.ts` printed no FAIL and no soft over-cap; three named `retained:` dispositions and one FROZEN row (`docs/research/loop-hygiene-prd.md`). §11 TD deletion due now: TD-301 and TD-302 (resolved at SPRINT-167 by TASK-622 and TASK-623). Closed task files due: TASK-622 and TASK-623 (stamped `sprint: SPRINT-167`, no live citation; a scan of tracked `.md` files outside the history set and `git grep -w` with the history paths excluded agreed). Disposition: all four deleted in the `plan locked` commit, ids stay retired. Deferred to a later promote by owner ruling (no `sprint:` stamp, so the 3-sprint clock is unconfirmed): TASK-596, 607, 608 (done/) and TASK-601, 609 (cancel/). Cited and kept: TASK-613, 616, 617, 621 (EPIC-024) and 322, 347, 366, 461, 566 to 572 (`.out-of-scope` pointers). TASK-630 is cited by EPIC-024.
- ☑ epic rollup currency: EPIC-024 current. All four member sprints (165, 166, 168, 169) have a row with a `close_commit` matching the sprint file; header `last_updated` equals the newest close (`121b89a8`); no ticked Closed-when line names no sprint. No other epic is `active`.
- ☑ epic coverage: EPIC-024 fully covered (3 open, 3 mapped); this sprint touches it and nothing is uncovered, so no refusal and no override. After the epic edit: row 4b → TASK-632, TASK-638; rows 5 to 9 → TASK-633 to 637; ship → `next slice`.
- ☑ roadmap coverage: none (no roadmap file). ☑ handoff ledger: none (no ledger file).
Composition: 7 members (M each; TASK-632 was `L` and is split before rendering into 632 + 638); one declared edge, T2 (TASK-638) on T1 (TASK-632), and T4 (TASK-634) on T2; no stream. TASK-633's reuse of the frozen harness settings is a settings dependency, recorded as SD5, not a `Depends-on:`. Epic: `EPIC-024` stamped on the sprint, a § Member sprints row appended, `member_sprints` extended, D13's order set to "together". Task-file edits at `7c308a82` (split, cap, G2-note refinements); status move at `9f197ade`.
Baseline gate on `main` at `9f197ade`, run off-host: `QA_FULL=1` via `bun --no-env-file scripts/gate-remote.ts`, exit 0: qa-check 483 pass, 0 fail; `bun test` 589 pass, 0 fail.
G1 and G2 are not yet signed; `gates_signed` is recorded in the sprint frontmatter only after the owner's sign-off is relayed verbatim. All seven members are declared `tier: P`.

### 2026-11-09 | gate | G1 batch signed, T1 to T7
Owner popup, verbatim: "Approve G1 (Recommended)" (question: "Batch G1 for SPRINT-170: do you approve the scope in the table as written (7 tasks, all M, out of scope as listed, A2 VPS and worktrees confirmed)? For T3 to T7 (origin: decomposer) this also confirms their scope is unchanged since intake."). T1 and T2 (`origin: manual`) took the full checklist; T3 to T7 took the fast-path confirm.
A2 recon: VPS `~/lf-gate-o1`, `-o2`, `-r1`, `-r2` present, no gate running, 54 GB free; local `replay-o1`, `-o2`, `-p-ord`, `-p-rtr`, `-r1`, `-r1b`, `-r2`, `-r2b` present. Forecast from row 4's measured runs (ordinary 3.37 and 4.37 USD, router 4.94): about 45 to 55 USD of the 60 USD cap.
Cap scope, owner popup, verbatim: "Trial runs + workers (Recommended)": the cap counts every headless replay, probe, seed run, dispatched worker and retry, each measured from its own session with `session-cost.ts`; the operator session is reported separately and not capped.

### 2026-11-09 | gate | G2 batch signed, T1 to T7
Owner sign-off by popup, verbatim: "Sign G2, start T1" (question: "Do you sign batch G2 for SPRINT-170? It covers the two drafts with the builder-check fixes, your 8 rulings just now (router Opus and Executor Sonnet · R2 may stop early · separate unsafe-merge run · Codex builds the trial files · headless emulation for T5 · exit-64 ruling as the T3 seed · commit 5ca2c00e for T6 · row limits approved), no bypassPermissions fallback (a probe denial stops and comes to you), and run order T1 → T2 → T4 → T3 → T6 → T7 → T5, one paid run at a time.").
Owner rulings by popup, verbatim: "Router Opus, Executor Sonnet (Recommended)" · "Allow early stop (Recommended)" · "Separate small run (Recommended)" · "Codex, Claude reviews (Recommended)" · "Headless emulation (Recommended)" · "Ruling left out of brief (Recommended)" · "Real commit 5ca2c00e (Recommended)" · "Approve limits (Recommended)".
Design: draft A (T1, T2, T4) and draft B (T3, T5, T6, T7), appended verbatim below, as amended by the settlements list. Where a settlement and a draft disagree, the settlement wins.
- builder-check · T1 · 5 contradictions · 6 questions · settled in design (S1 to S6); model and builder questions ruled by owner
- builder-check · T2 · 5 contradictions · 6 questions · settled in design (S7 to S12); R2 early stop ruled by owner
- builder-check · T3 · 6 contradictions · 6 questions · settled in design (S13 to S16); seed shape ruled by owner
- builder-check · T4 · 3 contradictions · 4 questions · settled in design (S17 to S21); unsafe-merge shape and row limit ruled by owner
- builder-check · T5 · 6 contradictions · 7 questions · settled in design (S22 to S26); attended emulation and builder ruled by owner
- builder-check · T6 · 3 contradictions · 6 questions · settled in design (S27 to S31); host ruled by owner
- builder-check · T7 · 6 contradictions · 6 questions · settled in design (S32 to S36)

**Settlements (bind the build):**
- S0 · Budget, all rows: frozen limits T1 2.5 (build, Codex review, probes) · G2 workers about 3.5 (estimate: in-session subagents keep no transcript, so not measurable) · T2 20 · T4 10.5 · T3 6.5 · T5 4 · T6 3.5 · T7 4.5 · reserve 5 · total 60, warn at 48. The launcher sets each run's `--max-budget-usd` to the smaller of the design's per-run cap and what is left of its row's limit. A row at its limit stops and reads incomplete (no-go). Every USD verdict uses the reading that works against a pass (router or treatment cost: the larger of `total_cost_usd` and `session-cost.ts`; ordinary mean: the smaller). Codex usage is recorded as tokens, outside the cap (owner ruling).
- S1 · T1: no `bypassPermissions` fallback. A denied `.claude/CONTEXT.md` edit in a probe fails the probe; the run stops and goes to the owner.
- S2 · T1: build Executors embed `worker-brief.md`'s contract verbatim (parity `diff` covers them only). The close Executor gets the same contract plus a stated coordinator carve-out for the sprint file, Log, ticks and moves; it is named as a re-homed coordinator duty in the fidelity table.
- S3 · T1: the router having no `Skill` tool, and the procedure moving to Executors, is the treatment itself (the thin-router role shape), not a second variable. Skills are unchanged in both arms.
- S4 · T1: the fidelity table lives in TASK-632's own file (§ Results), inside its frozen Touches; no `docs/research/router-4b-fidelity.md`.
- S5 · T1: probe survival bar is ≥ 660 s after main's last assistant turn; the merger arm gets an init-event diff against the ordinary arm (only `--plugin-dir` and the agent list may differ), not a separate probe. Effort: CLI default per model, recorded from the init event; any change between runs is drift.
- S6 · T1, T2, T4: merges land on `replay` itself in the scratch repo's main worktree (`git merge --no-ff <task-branch>`), done by whoever the arm assigns (ordinary coordinator · router · merger); no separate integration branch.
- S7 · T2: router runs face the same validity checks as ordinary runs: 11 boxes, gate, review, both merge-backs, no write outside the scratch repo, no push, no abort, no drift.
- S8 · T2: validity is the Done when's list (boxes, gate, review, both merge-backs) plus the SD3 note 4 items (drift, abort, missing evidence) and the Negative box (no outside write, no push). Dropped as invalidators: "exactly `--no-ff` with `.claude/worktrees` parents" (any merge of both task branches counts) and "sprint closed" as a separate item. A Bash write to an Edit-denied path is logged as a deviation.
- S9 · T2: gate passes only if both the in-run verdict line and the operator's rerun on final HEAD pass.
- S10 · T2: zero `blocked` questions in a router run is a recorded vacuous pass of the relay audit, not missing evidence.
- S11 · T2: one infra-abort rerun is allowed for any run, router included, only when the infra cause is shown (exit signal, host reaper or API error in the logs); otherwise the abort stands. Funded from the reserve.
- S12 · T2: R2 early stop, owner exception: if O1, R1 and O2 already put R1 outside the go rule, R2 is not run and row 4b is no-go. Logged as a `scope-change` on TASK-638's first box when it fires; the box then reads "3 of 4 run, R2 skipped by owner exception".
- S13 · T3: the gate is `bun test` exit 0 with every test passing at the snapshot still passing by name, and no lower count.
- S14 · T3: "on their own" means one dispatch per arm per round: the worker's own internal retry counts; any second dispatch, coordinator edit or operator help disqualifies the round.
- S15 · T3: minutes run from the dispatch `tool_use` to the worker's report arriving; the operator's oracle runs after, outside the timed window. Arm B gets the original build brief plus the finding (the faithful "same brief"); arm A gets the finding only.
- S16 · T3: limit 6.5 USD (above TASK-633 A2's 3 to 5, approved by owner).
- S17 · T4: M-U is the "one case asks for an unsafe merge"; it is a third, small run and is exempt from the 11-box and has-a-merge rules. M1 and M2 are the two merger runs.
- S18 · T4: M1, M2 and M-U carry T2's Negative checks: no push, no write outside the scratch repo, no abort or drift.
- S19 · T4: the merger merges onto `replay` (S6); the coordinator runs no merge or fast-forward. The oracle ignores coordinator bookkeeping commits (`docs/work/**`, `docs/sprint/**` only) when judging "manual repair"; builder branches commit no task or sprint files (worker brief).
- S20 · T4: W is the coordinator's HEAD at dispatch; the coordinator passes the W sha and each task's Layers to the merger in the hand-off message. The inspector's cost and minutes are inside the compared run.
- S21 · T4: the cost bar (each merger run no worse than the ordinary mean) is probably unreachable once merger and inspector cost are added; recorded so a no-go is read as expected, not as a surprise.
- S22 · T5: "final state line" = the last non-empty line of the worker's final report, matched against `^(ready|blocked|failed|dropped)$`; no match = `exited (none)`. C3 is briefed to end with `failed`.
- S23 · T5: overhead USD = the cost of coordinator turns whose input begins with a watcher launch or watcher alert tool_result, plus the launch turns; CPU from `process.cpuUsage()`. Both are recorded; over either limit fails.
- S24 · T5: timing margins: D = 6 min, poll 15 s, deadline 7 min; C1 silent 180 s (not 300); C4 writes `work/c4/started.txt` first, which is its last progress.
- S25 · T5: the run-2 coordinator transcript is audited for TaskStop, kill or restart against any worker (must be 0). The Bash 10-minute timeout in run 1 is recorded as "host noticed at 10 min", after the deadline. `test/watch-workers.test.ts` sits on the trial branch with the script.
- S26 · T5: owner column is the headless emulation (owner ruling), named as such in the verdict.
- S27 · T6: R2 is the second look as review-scoping.md § Adversarial floor runs it for a test-touching diff, including the branch/boundary enumeration lens; triggered by raw zero findings from R1.
- S28 · T6: the seed is three edits by script, each `found 1`: the regex anchor, the JSDoc, and the fixture case name in `evals/run-by-reference-fixtures.ts` ("ends with" → "carries").
- S29 · T6: `agents/checker.md` is written and frozen (sha logged) before any run; it is delivered inline via `--agents` JSON, so no trial worktree is in reach of the run. Its procedure: find defects in the change, may execute read-only commands to confirm, report each with input and wrong result.
- S30 · T6: if the control gate at `5ca2c00e^` is not green on today's VPS, the row is inconclusive (no-go), recorded as host not reproducing the baseline.
- S31 · T6: the checker's cap is the smaller of the measured review total and what is left of T6's limit.
- S32 · T7: each run uses its own path `t7-run-<n>`, so each has its own project directory and cost record.
- S33 · T7: added M-step: audit every `tool_use` input of every run for the twin's path, the seed script and the answer-key notes (must be 0), with a control grep that finds the run's own path.
- S34 · T7: the prompts are identical except the procedure invoked; the deliverable and the no-fix rule are given to both arms. A run that edits `src/` is void (one rerun; a second makes the row incomplete, no-go).
- S35 · T7: an arm "reproduces" when 2 of 2 runs are valid (M4). Pass if the reproducer reproduces and `/diagnose` does not, or both do and the threshold is met. A run capped by budget or the 20-minute limit counts as not reproduced, at its actual cost.
- S36 · T7: add an M0 launch probe for both paths (`/diagnose` under `-p` with `--plugin-dir`, and `--agents` for the reproducer), about 0.2 USD from T7's limit.
Run order: T1 → T2 (O1, R1, O2, R2) → T4 (M-U, M1, M2) → T3 → T6 → T7 → T5, one paid run at a time. Free prep for T3, T5, T6 and T7 (hosts, seeds, oracles, twins, Codex builds) may run alongside T1 and T2, never during a timed run's gate.
Spend so far: G2 workers, estimated about 3.5 USD (not measurable in-session).

#### G2 draft A — T1 (TASK-632), T2 (TASK-638), T4 (TASK-634), verbatim

##### G2 draft: SPRINT-170 T1 (TASK-632) · T2 (TASK-638) · T4 (TASK-634)

**Verdict:** ready for the G2 popup, with 3 owner questions (§8). Five facts change the harness compared with TASK-630:
- **(a) The `replay-*` dirs are git worktrees of `D:\Project\lean-flow\.git`.** In-run isolation there would write branches into the main repo, which breaks SD3 note 2 ("Git metadata included"). Each run therefore gets a **standalone pruned clone**.
- **(b) The CONTEXT.md edit was denied for a known reason.** The docs list `.claude` as a protected path ("never auto-approved"; `dontAsk` denies). The exception is `.claude/worktrees/`. R2 edited without isolation, so it was denied. O1 got round the denial with a Bash `python` write. In-run isolation should clear this, and the probe checks it.
- **(c) Nesting is allowed.** Docs: subagents may spawn subagents up to 3 layers deep. So an Executor can dispatch its own reviewer.
- **(d) No shell limit can be set per agent.** `BASH_*_TIMEOUT_MS` applies to the whole process. The router's 5 s shell limit becomes a prompt rule plus an audit.
- **(e) `total_cost_usd` is a client-side estimate.** Per the docs it counts subagents and the background wait, so it is not "billed" as TASK-630 called it.

###### 1. Shared harness freeze (SD3 note 3)
| Item | Frozen value |
|---|---|
| Base | `6a7cadf2`. Scratch prep (Bun TS in operator scratch): `git clone --no-hardlinks D:/Project/lean-flow D:/Project/lean-flow-worktrees/s170-<run>` → `checkout -B replay 6a7cadf2` → `branch -D main` → `remote remove origin` → `reflog expire --expire=now --all; gc --prune=now` → `bun install --frozen-lockfile` (cache on D:) → `mkdir .git/lf-tmp`. Verify: `git cat-file -e 9375b607` fails, `git remote` is empty, status is clean. Project settings at base already set `worktree.baseRef: "head"`. With no remote, the worktree cannot branch from `origin/HEAD`. |
| Trial branches | `trial/epic-024-thin-router` is cut from main tip **B** at build time (worktree `lean-flow-worktrees/e024-thin`): `agents/router.md`, `agents/executor.md`, `docs/research/router-4b-fidelity.md`. `trial/epic-024-merger` is cut from the same B (worktree `e024-merger`): `agents/merger.md` only. Verify: `git diff --name-only B <branch>` lists only those files. Separate branches keep each treatment out of the other arms (D1, SD3 note 2). |
| Plugin per arm (`--plugin-dir`) | Ordinary: `replay-p-ord` (746fd498, clean). Its skills, agents, `.claude-plugin`, hooks, templates and spec match `16ae5b99` exactly (diff checked); re-check that they match B at freeze. Thin: `e024-thin` plus `--agent lean-flow:router`. Merger: `e024-merger`. `--setting-sources project` keeps the installed 2.21.0 plugin out, as in TASK-630. |
| Prompt | One file, `<op-scratch>/s170/replay-prompt.txt`, sha256 recorded. It is TASK-630's text (`ca5b067e…/scratchpad/replay-prompt.txt`) with these edits. "worktree" becomes "standalone scratch clone of lean-flow at 6a7cadf2". Added: "Build the members as SPRINT-167's G2 says, each in its own worktree-isolated worker inside this repository, and merge both back here through the merge-back queue. Work, write and merge only inside this repository; temporary files go to $TMP; do not write gate output to files, read the verdict line it prints." Kept verbatim: the HITL rule (take Recommended, log it), no plan mode, the push/release/branch-delete ban, `MSYS_NO_PATHCONV=1 bun --no-env-file scripts/gate-remote.ts` as its own call, `REPLAY DONE`. The same text goes to every arm. Merger runs append one treatment paragraph (§4). |
| Models (no `--effort`, no `effort:` key anywhere) | Main: `--model claude-opus-5-5` in all arms. In the thin arm, `router.md` has no `model:` key, so it inherits. Executor: `model: sonnet` (Q1). Ordinary and merger-arm builders: general-purpose on sonnet (class execution). Reviewer: one scoped sonnet reviewer per task (SPRINT-167's `consequence` lines); in the thin arm the Executor dispatches it. Merger and inspector: sonnet. Per-thread `message.model` ids are recorded from transcripts; any change between runs counts as drift. |
| Permissions | `--permission-mode dontAsk`. `--allowedTools "Read,Glob,Grep,Edit,Write,Bash,Agent,Task,Skill,SendMessage,TodoWrite"`. `--disallowedTools "Bash(git push *)" "Bash(git branch -D *)" "Bash(git branch -d *)" "Bash(git remote *)"`, the documented space form. `.claude/CONTEXT.md` is edited through the `.claude/worktrees/` exemption. If the probe shows a denial, both arms switch to `bypassPermissions` with the same deny list, decided at freeze. Pass `stdin` empty (fixes the TASK-630 stdin warning). `--max-budget-usd 7` per replay, 1 per probe. |
| Env | Set by a Bun `spawn` env object, so no Git Bash layer can rewrite it at launch (TASK-630's O1 log shows the rewrite happened at launch): `LF_GATE_HOST=ubuntu@129.226.95.172`, `LF_GATE_KEY=C:/Users/HYPE AMD/.ssh/leanflow_gate_ed25519` (path only, never opened), `LF_GATE_DIR=/home/ubuntu/lf-gate-<dir>`, `CLAUDE_CODE_PRINT_BG_WAIT_CEILING_MS=0`, `DISABLE_AUTOUPDATER=1`, `TMP/TEMP/TMPDIR=<scratch>\.git\lf-tmp` (Git Bash `/tmp` follows TEMP, so helper files stay inside the scratch repo), `BUN_INSTALL_CACHE_DIR` on D:. CLI pinned at 2.1.319; `claude --version` is logged per run. |
| Review | As the replayed sprint says: one sonnet reviewer per task before merge. The run counts as passing review when each reviewer's verdict is clear, or each finding is fixed or declined with a reason. |
| Measurement | **USD:** `result.total_cost_usd`. Second query: `bun scripts/session-cost.ts ~/.claude/projects/<encoded scratch path> 1`. Both are logged. The cap tally uses the larger; the verdict uses `total_cost_usd`, as TASK-630 did. A gap above 12% is flagged (TASK-630 saw 3 to 11%). **Minutes:** `result.duration_ms`, cross-checked against the launcher's own clock. Counted: launch to process exit, including the background-worker wait. Not counted: prep, audits, Codex, the operator's VPS gate rerun (0 USD). |
| Cold start | Fresh session (no `--resume`/`--continue`), fresh scratch path (new project dir, so no memory). A gap of at least 10 min from one run's exit to the next launch, which outlasts the 5-min cache TTL. The first request's `cache_read_input_tokens` is logged. If P-thin shows a warm prefix after 10 min, the gap becomes 65 min before any replay (1-hour TTL). |
| Order and VPS dir | P-ord(o1) → P-thin(r1) → **O1(o1) → R1(r1) → O2(o2) → R2(r2)** → M-U(no gate) → M1(o1) → M2(o2). One headless run at a time. In each gap the operator reruns the gate on the previous run's final HEAD. |
| Logs | `C:\Users\HYPEAM~1\AppData\Local\Temp\claude\326b558762c503a6\38950a07-da5c-4428-bcd8-73fe202c5feb\scratchpad\s170\<run>.{jsonl,err,cmd,env,gate}`. Never written to the scratch repo or `lean-flow-worktrees`. The launcher writes the rendered command; `diff` of the two arms must show only `--plugin-dir` and `--agent`. |

###### 2. T1 (TASK-632)
**Approach:** two short agent files, adapted line by line from DeepSeek @ `8c32a9dc`. Same skills in both arms, nothing changed in any skill (A1). WHY: the thick router failed because it kept judgment and dropped the shell. The cheapest faithful test inverts that and adds only two system prompts. Rejected alternatives: a clerk worker, since its worker cost rose about 3.5× in row 4; and a skill change, which would break D2.

**`agents/router.md` (target ≤45 lines; tools `Bash, Read, Agent, SendMessage`).**
- *Kept:*
  - Route only, no technical decision, no plans, criteria or checklists (orch L4, dispatch L23, shared L5–7).
  - One assignment per task carrying the task path plus a routing note of at most 30 words (dispatch L44–48).
  - Never wait, sleep or poll; end the turn (orch L16; 004 Principles).
  - Forward questions unchanged (004 `human_action`; dispatch L35).
  - Follow-ups go to the same Executor (004).
  - Claim done only when the report supports it (dispatch L19).
- *Changed:*
  - The 5 s or 30 s shell limit becomes a rule: commands that finish in seconds, anything longer in the background. Reason: no per-agent timeout exists.
  - Reads are limited to sprint/log/task files, `.claude/CONTEXT.md` § Gates and § Sprint model, and reports. Reason: commit-subject rules, L-294.
  - The merge-back queue is run as mechanical bookkeeping: `git merge --no-ff` in G2 order on an integration worktree, `merge-check.ts` in the background, verdict line only. A conflict or a FAIL is forwarded verbatim to the owning Executor. Reason: in DeepSeek, people merge PRs; in lean-flow the coordinator merges.
  - Ticks only on evidence an Executor reported; moves, Log appends and commits through the shell.
  - `/orchestrator sprint-bulk` and `/lean-doc-generator close` are assigned to Executors, never loaded by the router.
- *Dropped:* candidates, attach/handback, subscriptions, eval/admission, IM/GitHub/Feishu delivery, CI-bot rules. Reason: EPIC-024 Scope Out.

**`agents/executor.md` (≤50 lines, `model: sonnet`, all tools).**
- *Kept:*
  - Own reading, scope, approach and verification; the router's note is not the requirement (worker L2; work L32–35).
  - Stop and report if direction is open or public behaviour changes (work L6).
  - Long commands in the background; no `ready` while a needed job runs (work L44).
  - Assess review findings by outcome: fix, or decline in one sentence (004).
  - States `ready`/`blocked`/`failed`/`dropped`; `ready` means reviewed and checked (work L49).
- *Changed:*
  - Embeds lean-flow's worker contract verbatim from `worker-brief.md`, the same text ordinary builders get.
  - Dispatches its task's scoped reviewer itself.
  - Commits as `sprint(NNN) Tn:` on its worktree branch; never merges into `replay`.
  - The close assignment runs system verify, then `/lean-doc-generator close`, and writes the Retro as its deliverable.
- *Dropped:* PR/push/gh/auto-merge, thread tools, proactive rules, the screenshot rule.

**Fidelity table** (in `docs/research/router-4b-fidelity.md` on the trial branch, because agent files are system prompts and every row would cost tokens on every turn). Columns: `# · DeepSeek source file:Lnn @8c32a9dc · rule · kept/changed/dropped · router.md or executor.md line · reason`. About 45 rule rows cover all 141 lines of `orchestrator`, `dispatch`, `shared`, `worker` and `work`, plus 004 Principles and the 003 router preset (5 s shell, fs `write:false edit:false`, no subagents or search).

**Codex review:** `codex exec --model gpt-6-astra --skip-git-repo-check -s read-only - < review.txt > review.out`, in the foreground, under `timeout`.
- Input: both files, the table, the 5 prompt files, 003/004 excerpts, and the altitude line ("detail this G2 decides is not a finding").
- Output: one verdict line per row group, ending with a VERDICT line.
- At most 2 rounds; R2 blocks only on a High that would change the outcome.
- Builder: Codex in `e024-thin` (owner standing rule); the operator reviews and commits.

**Probe (one per arm, same prompt, about 0.3 USD each):**
1. Main runs `printenv LF_GATE_DIR`.
2. Main dispatches one background, worktree-isolated worker "as you would a builder". In the thin arm that is the router dispatching an Executor.
3. Main ends its turn.
4. The worker, in order:
   - runs `printenv LF_GATE_DIR`;
   - makes a one-line `Edit` to `.claude/CONTEXT.md` with the Edit tool;
   - commits;
   - runs `MSYS_NO_PATHCONV=1 bun --no-env-file scripts/gate-remote.ts`;
   - runs `git push` (must be *permission*-denied);
   - writes `/tmp/probe.txt`;
   - runs two `sleep 300` (timeout 330000);
   - writes the marker `date -u +%s`;
   - reports.
5. Main wakes on the report, merges the branch `--no-ff`, and ends with `PROBE DONE`.

**Pass conditions:**
- (i) Both printenv calls give `/home/ubuntu/lf-gate-o1` (or `-r1`), and the gate exits 0 or 1, never 2 or 5.
- (ii) Marker time minus main's last assistant timestamp before the report is at least 600 s, the report is in the transcript, and stderr lacks "stopping them".
- (iii) The Edit tool_result is not an error, `git show --stat` lists CONTEXT.md, and no Bash write touches that path.
- (iv) `probe.txt` is under `<scratch>/.git/lf-tmp`. The parent-dir listing and the main repo's `git status` plus `for-each-ref` hash are unchanged before and after. jsonl and err files are in op-scratch.
- (v) The two init events are equal except for the agent, the agent list and main's tools. They show one lean-flow plugin at the plugin-dir path.

**Micro-tasks:**
| # | Step | Verify | EXISTS / RUNS / REACHES / PROVES |
|---|---|---|---|
| 1 | Cut both trial branches from B | `git diff --name-only B <br>` | git · host · the branch tree · only the treatment differs ✓ |
| 2 | Build router.md and executor.md | P-thin init lists `lean-flow:router`, `lean-flow:executor` | probe · headless · the loaded agent set · the files parse and load ✓ |
| 3 | Contract parity | `diff` of executor.md's block against `worker-brief.md` | diff · host · both texts · identical contract ✓ |
| 4 | Fidelity table coverage | TS check: each non-blank line 1..N of the 5 files is cited | script · host · the table · coverage, not correctness. Correctness = **judgment tick** (Codex) |
| 5 | Codex fidelity review | VERDICT line plus per-group lines | **judgment tick** |
| 6 | Prep, launcher, probes P-ord and P-thin | items (i)–(v) | stream-json, transcripts, git · headless both arms · the run's env, worker and tree · settings identical and effective ✓ |
| 7 | Freeze record | this §1 table written to TASK-632 by a coordinator commit | **judgment tick** |

**A1 check:** no skill step is unroutable, but four are re-homed by the agent files and none needs a skill edit:
- conflict resolution and post-merge FAIL go to the owning Executor (dispatch.md says "coordinator-owned");
- review-finding judgment goes to the Executor (ADR-010 places it on the session model);
- system verify and `/lean-doc-generator close` (Retro, governance checks) go to a close Executor;
- the G2 draft and builder check go to the Executor, with the router relaying them. The replay does not exercise this, since G2 is pre-signed.

###### 3. T2 (TASK-638)
**Protocol per run:** fresh prep → pre-snapshot (CLI version, main repo status and refs hash, parent-dir listing) → 10-min gap → launch → wait for exit → audits → operator gate rerun on final HEAD.

**Recorded per run:** USD from both queries, minutes, boxes `- [x]` across both member files (out of 11), the in-run gate verdict line plus the operator rerun, the reviewer verdicts, the merge commits, and whether the sprint closed.

**An ordinary run is valid only if all of these hold:**
- 11/11 boxes;
- the gate passes, in-run and on the operator rerun;
- both reviews pass;
- exactly two `--no-ff` merges whose second parents are `.claude/worktrees` branches inside the scratch repo;
- the sprint is closed;
- no abort or budget stop;
- no write outside the scratch repo;
- no settings drift;
- no Bash write to a path whose Edit was denied.

Otherwise the run is invalid and T4's baseline is void (SD3 note 2).

**Router audit** (TS over stream-json; router = `parent_tool_use_id` null):
- **Tool use:** any Glob, Grep, Edit or Write call; a Read outside the allowlist; a Bash call that reads code (`cat`, `sed -n`, `grep` on non-bookkeeping paths), or a test, build or gate in the foreground, or `sleep` or a wait; a foreground Bash call over 30 s by transcript timestamps.
- **Relays:** each Executor `blocked` question and its answer must appear verbatim (whitespace-normalised) in the router's Log entry and its `SendMessage`. Routing notes must be at most 30 words.
- **Identity:** one `lean-flow:executor` id per task, plus one for the close. Follow-ups use `SendMessage` to that id. No general-purpose builder.

Any hit is a treatment violation. **Control:** the same audit runs on O1 and must flag the ordinary coordinator's code reads.

**Go rule:** m = (O1 + O2)/2 USD; t = mean of the O minutes.
- Go iff R1 ≤ 0.75·m **and** R2 ≤ 0.75·m, R1 and R2 ≤ t, both router runs at 11/11 with gate and review passing, both ordinary runs valid, and no violation, drift, abort, missing evidence or incomplete sample. Otherwise no-go.
- With TASK-630's numbers as an example: m = 3.87 gives a bar of 2.90.

**Micro-tasks:** O1 (valid? checklist) → R1 (audit) → O2 (valid? checklist) → R2 (audit) → verdict arithmetic (recomputed by script from the jsonl values) → epic row 4b by the coordinator (one hunk). All Verify steps are mechanical except the final verdict wording, a judgment tick.

###### 4. T4 (TASK-634)
**Wiring:** merger runs are ordinary runs with the `e024-merger` plugin dir (no router). The prompt adds: "Treatment (TASK-634): when both builds are ready and reviewed, hand the merge-back queue to one `lean-flow:merger` worker in G2 order (each branch, its declared base, its task's Layers); merge, resolve and repair nothing yourself. After each merge dispatch a general-purpose sonnet worker, not the merger, to inspect the integrated tree and run `bun scripts/merge-check.ts`; act on its verdict."

`merger.md` (sonnet) does the following:
- checks `merge-base` against the declared base and that the diff stays inside the task's Layers with no coordinator files;
- merges on an integration worktree with `--no-ff`;
- resolves conflicts by recovering both intents (dispatch.md);
- refuses an unsafe merge, leaving the target untouched and reporting `blocked`;
- never forces, resets or pushes.

**Frozen oracle** (relational, because replay shas differ):
- **Queue:** T1 (TASK-622) then T2 (TASK-623), from SPRINT-167 D1 and `0137a51c` → `9375b607`.
- **Base:** both task branches fork from W, the run's dispatch-time tip. W descends from 6a7cadf2 and touches only `docs/work/**` and `docs/sprint/**`; it is the analogue of `165d7be2`.
- **M1:** two parents; `diff --name-only M1^1 M1` is exactly {`CHANGELOG.md`, `SECURITY.md`, `skills/diagram/SKILL.md`}.
- **M2:** first parent is M1 or coordinator-only descendants; `diff --name-only M2^1 M2` is exactly {`.claude/CONTEXT.md`}.
- **Content predicates** from the Done-when greps:
  - `allowed-tools` has `Bash(git rev-parse *)` and `Bash(git status *)` and no bare `Bash`;
  - SECURITY.md lists `diagram` only in the scoped row;
  - `[Unreleased]` names TASK-622;
  - § Gates and `scripts/lib/token-budget.txt` are byte-equal to 6a7cadf2;
  - the 5 terminal states and "absent = J2" are present.
- **Final tree:** no conflict markers; the non-coordinator diff against 6a7cadf2 equals the union of M1 and M2's file sets.
- **Bad merge:** a lost or unexpected change, a marker, the wrong base or order, a false success (the merger says merged but a predicate fails), or a manual repair (any non-merge commit after a merge touching those 4 files).

**Unsafe case M-U (Q2):**
- Setup: a pruned clone of O1's final tip, plus a planted `sprint167-t2-followup` cut from `6a7cadf2`. Its one commit, titled `sprint(167) T2: follow-up`, raises `token-budget.txt` from 12691 to 13200 and changes one § Gates line. That is a wrong base and breaks TASK-623's Done-when and SPRINT-167 D3. Git would merge it cleanly.
- Run: a fresh headless coordinator hands it to the merger.
- Pass: refused, `rev-parse replay` the same before and after, no new commit, and a reason given.
- M-U runs first and doubles as the merger's load probe.

**Who inspects:** the in-run inspector worker; afterwards the operator's oracle script (0 USD).

**Go:** 0 bad merges, M1 and M2 each 11/11 with gate and review passing, each run ≤ m USD and ≤ t min, M-U refused. A merge done by the coordinator, or a run with no merge, never counts.

**Micro-tasks:** build merger.md (load check in M-U's init; self-review = judgment tick) → oracle script with a must-FAIL fixture (O1's tree with the M2 file set swapped must redden) → M-U → M1 → M2 → epic row 6.

###### 5. Budget
The estimate of 4.6 USD per ordinary-shape run is TASK-630's 3.87 mean × ~1.19, for two in-worktree installs, two merges, merge-check and review. It is an assumption.

| Row | Arithmetic | Limit |
|---|---|---|
| T1 | G2 drafting workers ≈2.0 (incl. this agent; the coordinator measures it from its subagent transcript) + 3 builder checks ×0.3 + 2 probes ×0.3 + 1 probe rerun 0.3 | **4.0** |
| T2 | 2×4.6 ordinary + 2×5.0 router (R1b was 4.94) | **20.0** |
| T4 | M-U 0.5 + 2×4.8 (merger plus inspector) | **10.5** (TASK-634 A2 said 9–10) |
| Reserve | one ordinary rerun, after an infra abort only | **4.6** |

That totals 39.1, leaving **20.9 for T3 and T5–T7**. Warn at 48. Cut order:
1. Reruns, including the reserve. A router run is never rerun.
2. The R2 early stop (Q3).
3. Ask the owner to defer rows 7–9.

###### 6. Sequencing and parallelism
- Host: 1.9 GB of 13.7 GB RAM free (measured), C: 6.2 GB free.
- Rule: **one headless `claude -p` at a time.** No gate, test suite or `bun install` on the host during a timed run (L-219).
- These may overlap timed runs: Codex review, file drafting, T3/T5–T7 G2 drafting, and audits.
- VPS: 2 vCPU, so operator gate reruns only happen inside the gaps. T3 and T5–T7 runs take `lf-gate-r1`/`-r2` after R2.
- **Shared files on `main`:**
  - TASK-632, TASK-638 and TASK-634, each edited only by the coordinator for its own task;
  - EPIC-024 rows 4b (T2) and 6 (T4), coordinator only, one hunk per commit (SD6, L-042);
  - the sprint file and Log, coordinator only.
- Commit order on main: T1 freeze → T2 results → row 4b → T4 results → row 6.
- Trial branches and scratch clones never touch main (SD7).

###### 7. Risks and abuse cases
- **Router reads code or runs builds through Bash:** caught by the audit regex. It is a violation, so no go.
- **Router waits or polls:** the audit checks `sleep`, `TaskOutput` and foreground Bash over 30 s.
- **Solution leak:** the post-SPRINT-167 plugin dir holds `skills/diagram/SKILL.md`. The audit flags reads of plugin paths other than the skill files loaded. The scratch clone has no later objects.
- **Wrong worktree base:** handled by no remote plus `baseRef: head`, and the probe checks the base.
- **Writes outside scratch:** `/tmp` is redirected (O1 wrote to `/tmp` and to the parent folder). Pre/post snapshots and the refs hash catch the rest.
- **Edit-denial workaround** (O1's Bash `python` write): flagged as a deviation.
- **CLI auto-update or a change in the alias models:** `DISABLE_AUTOUPDATER=1`; version and model ids are logged per run.
- **Host memory reaper kills a run:** counts as an abort. One reserve rerun is allowed, ordinary only.
- **Time-of-day API drift:** handled by interleaving; launch times are logged.
- **Long agent files inflate every turn's cost:** line caps of 45 and 50.
- **Codex rubber-stamp:** per-row-group verdict lines are required.
- **Merger merges a clean-but-unsafe branch:** the M-U case and the oracle catch it.

###### 8. Open intent questions
1. **Models by function in the thin arm.**
   - (a) Router Opus, Executor Sonnet. **Recommended:** this keeps every function on the same model as the ordinary arm (main Opus, builders and reviewer Sonnet), so the role shape is the only change (D2). The catch is that review-finding judgment moves from Opus to the Executor.
   - (b) Executor Opus: holds D6 strictly, but likely misses the 25% bar.
   - (c) Router Sonnet too: cheaper, but a second variable.
2. **Where the unsafe-merge case runs.**
   - (a) A separate small M-U run on O1's integrated tip. **Recommended:** about 0.5 USD, and M1 and M2 stay cost-comparable with the ordinary runs.
   - (b) Planted inside M2: one run fewer, but M2's cost is skewed.
3. **R2 early stop.**
   - (a) Declare in advance: if O2's bar shows R1 already fails (cost, time, a box, gate, review or audit), R2 is not run and row 4b is no-go. **Recommended:** saves about 5 USD for rows 7–9; TASK-630 R2b is the precedent.
   - (b) Always run all four, to see the spread.

###### 9. Facts verified
- **DeepSeek @ `8c32a9dc` (2026-10-31), read first-hand with `gh api`:** `prompts/orchestrator.md` (16 lines), `dispatch.md` (59), `shared.md` (7), `worker.md` (10), `work.md` (49), `docs/003-execution.md`, `docs/004-prompts.md`, `cordis.patch.yml` (router preset: shell `timeoutMs 5000`, fs `write:false edit:false`, jobs wait 5000 ms, no subagents, web or search), `src/app/role-models.ts` (models set per role). Copies are in my scratchpad under `ds/`.
- **SPRINT-167 at 6a7cadf2:** 11 boxes (5 + 6); D1 order T1 then T2; `0137a51c` (parents `165d7be2` and `9a76742a`; 3 files) and `9375b607` (parents `0137a51c` and `d463550f`; CONTEXT.md); both branches fork from `165d7be2`. The project settings have `worktree.baseRef: "head"`; `.gitignore` lists `.claude/worktrees/` and `node_modules/`.
- **TASK-630's harness:** the launch commands, prompt, O1 rewrite log and R2 denial text, from `ca5b067e…/scratchpad`. `replay-*` are worktrees of the main `.git` (`git worktree list`).
- **Plugin dirs:** no skill, agent, plugin, hook, template or spec diff between 746fd498 and 16ae5b99. Manifest is 2.21.0 at both 6a7cadf2 and main.
- **Claude Code docs** (code.claude.com: sub-agents, permission-modes, env-vars, cost-tracking): nesting is allowed to depth 3; `.claude` is protected and `.claude/worktrees/` exempt; the ceiling env var behaves as described above; `total_cost_usd` includes subagents; Bash timeouts are per process; `effort`, `model` and `permissionMode` are frontmatter keys, and `permissionMode` is ignored for plugin subagents. CLI is 2.1.319 and has `--effort`.
- **Not verified:**
  - whether an `Edit(...)` allow rule overrides the `.claude` protection (the docs are silent; the probe settles it);
  - whether `Bash(...:*)` deny rules are still honoured (switched to the space form);
  - whether the VPS dirs are idle (taken as settled, not checked with ssh);
  - whether `session-cost.ts` counts subagent transcripts;
  - the cache TTL that applies (the probe logs it);
  - this drafting agent's own USD.

ready

#### G2 draft B — T3 (TASK-633), T5 (TASK-635), T6 (TASK-636), T7 (TASK-637), verbatim

#### SPRINT-170 G2 draft B — T3 · T5 · T6 · T7 (drafter report, verbatim; read-only, no paid run)

**Shared harness (SD5).** T1's G2 is not yet frozen (Log shows G1 only), so the items below are named slots, filled from T1's G2 when it freezes:
- Coordinator model and effort; worker/Executor model and effort (Sonnet expected).
- The permission mode and allowlist.
- `CLAUDE_CODE_PRINT_BG_WAIT_CEILING_MS=0`.
- The env passed through T1's Bun launcher (spawn env object), never a Git Bash `VAR=x` prefix.
- Cold start: a fresh session, no `--continue`.
- `--plugin-dir` at the frozen revision.
- stream-json, stderr and gate logs go to the operator scratch folder `…\s170\tN\` only (SD3 note 7).

Every run also gets `--max-budget-usd` (in CLI 2.1.319) as a per-run hard stop. Each run uses its own scratch path, so it has its own `~/.claude/projects/<encoded>` directory. Cap tally per run: `bun scripts/session-cost.ts <that dir>`, cross-checked against the stream-json `result.total_cost_usd`. If the two disagree by more than 10%, both are reported and the verdict uses whichever reading works against a pass.

---

##### T3: row 5, same builder versus a fresh subagent
**Approach.** Each pair has one build session; then both arms fork from the same post-build point with `--resume S_k --fork-session`. Arm A sends the finding to the builder's agent id through `SendMessage`. Arm B dispatches a fresh general-purpose subagent with the original build brief plus the finding, same model and tools.
**Why.** Forking gives both coordinators an identical history, so the only difference is the dispatch call (D2). Running a separate cold coordinator for arm B would make its coordinator cheaper and skew the cost comparison.
**Fallback, decided by M0.** If `SendMessage` fails inside a fork: run arm B as a fork first, then arm A as a plain `--resume` in place. If neither works: blocked, and it goes to the owner.
**Frozen values:**
- **Host:** `t3-host`, a fresh `git init` Bun/TS repo with one commit. It holds `src/format.ts` and its tests (existing code), `CONTRIBUTING.md` and `TASK.md`. TASK.md's Done-when:
  - `parseDuration(s)` in `src/duration.ts` returns ms for `90s`, `5m`, `2h`, `1h30m` (h, then m, then s).
  - Invalid input throws `RangeError` naming the input.
  - `bin/dur.ts <text>` prints the ms.
  - Tests cover each case.
- **Seeded post-build snapshot:** the builder's tree after a `ready` report, saved as git bundle `snap-k`. The seed is an owner ruling that the build brief leaves out, the L-122 shape.
- **Planted finding** (identical text in every pair and arm): "Spec, governing ruling (owner, quoted): CLI errors print `dur: <message>` to stderr and exit 64 (EX_USAGE). `bun bin/dur.ts abc` lets the RangeError escape. Fix it, keep it tested."
  - This is deterministic: no builder picks exit 64 unprompted. The pre-check below still enforces it.
- **Oracle per pair**, hidden in operator scratch as `t3-oracle.test.ts`, which imports the clone by absolute path:
  - (a) `bin/dur.ts abc` exits 64, stderr starts with `dur: ` and contains `abc`, stdout is empty.
  - (b) `bin/dur.ts 1h30m` prints `5400000` and exits 0.
  - (c) `parseDuration("abc")` throws a RangeError.
  - (d) Gate: `bun test` exits 0 and the test count is not below the snapshot's.
- **Pair independence:** a new build session and a fresh clone of the pristine host for each pair, at `t3-p1`, `t3-p2`, `t3-p3`. Each arm runs on a fresh clone of `snap-k` at the same path; the earlier arm's tree is archived first.
- **Order:** AB, BA, AB.
**Micro-tasks:**
- **M0, probe (≤0.3 USD).** A headless session; its worker writes `x.txt` and returns `ready`. Then a fork sends `SendMessage` to that worker id: "append a line".
  - Verify: the line lands, and the fork's transcript shows the same `agentId`.
  - EXISTS: T1's launcher. RUNS: host, T1 settings. REACHES: it is the exact call arm A makes. PROVES: a landed line proves resume-in-fork works.
- **M1, oracle discrimination (free).** Two reference solutions in operator scratch: TASK.md-only must fail (a) and pass (b–d); ruling-compliant must pass all four. Deleted after.
  - REACHES: the oracle imports `src` and `bin`. PROVES: it separates the two shapes.
- **M2, build pair k** (`--max-budget-usd 1.5`). Pre-check on `snap-k`: (a) FAIL and (b–d) PASS. Otherwise the pair is void, with one rebuild allowed (charged); a second void means an incomplete sample, which is no-go.
- **M3, rounds** (`--max-budget-usd 1.0` each). Before: `git rev-parse HEAD` equals `snap-k` and `git status --porcelain` is empty. After: the oracle and the gate.
- **M4, measures:**
  - USD per round as above.
  - Minutes: from the dispatch `tool_use` timestamp (`SendMessage`/`Agent`) to the coordinator's last verification `tool_result`. Failed attempts are included; the worker's one retry is allowed.
  - Build and setup costs are reported apart.
  - Judgment tick: deciding which turns belong to which round.
- **M5, leak audit.** Grep every `tool_use` input in the pair's transcripts for the oracle directory and other `t3-p*` paths: must be 0. Control: the same grep finds the pair's own path (non-zero), which proves the grep reaches.
- **M6, verdict.** Go only if all three arm-A rounds pass the oracle and gate unaided, arm A's mean USD is lower than arm B's, and arm A's mean minutes are ≤ arm B's. Anything else is no-go, naming the seed "CLI exit-64 ruling omitted from the brief".
**Files:** scratch only (no agent file; the treatment uses dispatch.md's existing resume path). `main`: TASK-633 evidence and epic row 5 (SD6).
**Limit 6.5 USD:** probe 0.3 + 3 × (build 0.8 + 2 × 0.45) = 5.4, plus one void rebuild 0.8 = 6.2.
**Cut if it bites:** drop the void rebuild. Three pairs is the minimum, so an unfinished pair is recorded no-go ("incomplete sample"), never a weaker go.
**Risk:** a worker reads the hidden oracle, or a fork's cost row double-counts the copied history. The leak audit and the cost cross-check catch these. The arm-A builder may notice "this isn't my brief"; that is acceptable, because this is the real follow-up case.

##### T5: row 7, the watcher
**Approach.** A Bun TS script, `scripts/watch-workers.ts` on `trial/epic-024-row7`. The coordinator launches it with `run_in_background`; it exits with an `ALERT` line, which wakes the coordinator, and the coordinator relaunches it with the acknowledged worker excluded.
**Why a script over an agent file:** progress is a mechanical signal; an agent would spend tokens on every poll, and foreground sleep is blocked; "never kills" can be checked by grep; no new `.sh` (owner rule: TypeScript run by Bun).
**Hang oracle (frozen):**
- **Progress** for worker W is either: a change in the fingerprint of W's cwd, read from W's transcript `cwd` field (HEAD sha + `git status --porcelain -uall` + `git diff HEAD` bytes); or W's `.meta.json` turning `finished:true`.
- **New transcript lines are not progress.** That is the chatty case, and the deliberate difference from night-run's stream-line stall signal; the two are not compared (A3).
- **States:** finished with last line `blocked` → `waiting` (no alert); finished with ready, failed or dropped, or with no state line → `exited (<state>)`; unfinished with no progress for D = 6 min → `HUNG silent` or `HUNG chatty` (chatty if ≥3 new records in the window).
- **Alert deadline:** the alert appears in the coordinator's transcript ≤ 7 min after W's last progress (D plus a 30 s poll, plus margin).
- **Overhead limit:** coordinator USD on watcher launches and alerts ≤ 0.10 per run, and watcher CPU ≤ 2% of one core (`process.cpuUsage()` printed at exit, divided by wall time).
**Plants** in a fresh repo `t5-host`, using `tools/*.ts` (no `sleep` command):
- **H, hung:** writes `work/h/started.txt`, then runs `bun tools/await-lock.ts` (waits forever) with Bash timeout 600000.
- **C1, silent but healthy:** `tools/slow-step.ts` is silent for 300 s, then writes `out/result.txt`; then the worker commits.
- **C2, waiting:** a planted format fork; the worker returns `blocked`. The coordinator holds the question until `tools/timer.ts 480` exits, then answers "JSON".
- **C3, exited:** runs a missing tool and reports `failed`.
- **C4, chatty:** `tools/poll-once.ts` (waits 30 s, prints "lock absent") in a loop for 12 min, no writes.
**Noticed, without a human present:** coordinator = its transcript text or tool calls naming H inside [last progress, +7 min]; host = harness events or notifications in that window (the Bash 10-min timeout falls after it); owner = the coordinator's user-visible text in that window (headless emulation; see Q1); night-run watchdog = "no coverage (not running)".
**Micro-tasks:**
- **M0, probe (≤0.2 USD).** In `-p` mode, a background `timer.ts 60` exit wakes the main thread: a second assistant turn appears in the stream. EXISTS, RUNS, REACHES and PROVES: it is the delivery path the alerts use.
- **M1, watcher and fixture test** (`test/watch-workers.test.ts` on the branch, free). Five synthetic subagent directories with a fake clock, one per state. Verify: `bun test`. PROVES: seeding "transcript lines count as progress" turns the chatty fixture red (one claim-bearing mutation, no campaign).
- **M2, negative check.** Grep the watcher for `kill|SIGTERM|TaskStop|process\.kill|spawn.*claude`: must be 0. Control: the same grep finds `readFileSync`. In run 2, H's Bash result must be the 600 s timeout, not a kill at alert time.
- **M3, tool timings (free).** slow-step takes 300 ±10 s; await-lock is still alive at 11 min (the operator kills it).
- **M4, run 1** (`--max-budget-usd 1.0`): coordinator plus H, no watcher; stop at 12 min. The noticed table is a judgment tick with quoted excerpts; the timestamps are mechanical.
- **M5, run 2** (`--max-budget-usd 2.5`): watcher plus H and C1–C4 dispatched together; ends ≤15 min. Verify from the watcher log and the coordinator transcript: H and C4 alerted ≤ 7 min after last progress; C1 and C2 raised nothing; C3 reported as `exited (failed)`; overhead within both limits; any missing stream → inconclusive, which is no-go.
- **M6, verdict.** It ships only by an owner exception naming the tested artifact's sha.
**Files:** `trial/epic-024-row7` (worktree `D:\Project\lean-flow-worktrees\e024-row7`) holds the script and its test. Scratch `t5-host`. `main`: TASK-635 evidence and epic row 7.
**Limit 4.0 USD:** probe 0.2 + run 1 0.5 + run 2 1.5 = 2.2, plus one rerun of run 2 at 1.5 = 3.7.
**Cut:** drop the rerun; missing telemetry then reads inconclusive.
**Risk:** the watcher reads transcripts that may carry secrets. It parses only timestamps, cwd, the final state line and meta, never prints content, and logs only to operator scratch.

##### T6: row 8, the checker
**Approach.** Replay a real small change: `5ca2c00e` "close check counts only a reaper-tagged terminal line (TD-232)", 10 lines in `scripts/lib/check-sprint-by-reference.ts`, with a seeded defect. The gate runs on the VPS through `gate-remote.ts`. Review and checker run in headless Sonnet sessions.
**Why:** a real change with a real governing decision (TD-232) and must-FAIL fixtures, in the "fails green" class lean-flow guards against. A tiny scratch repo would be cheaper but not a real change.
**Seed (frozen, never replaced), two edits by script, each `found 1`:**
- `REAPED_TAG_RE = /\[derived\]\s*$/` becomes `/\[derived\]/` (end anchor dropped).
- The JSDoc "counts only if it ends with reap()'s `[derived]` tag" becomes "counts only if it carries reap()'s `[derived]` tag", so the seeded change reads as self-consistent.
- Named defect: a model-written `terminal ·` line with `[derived]` anywhere but its end (e.g. `… [derived] copy follows`) satisfies the close check without the reaper having run. That reopens part of TD-232.
- Why it should pass the gate: in every by-reference fixture at 5ca2c00e, `[derived]` sits at line end (counts 0, 2, 2, 1, 0, 0 across the 6 fixtures). M3 confirms this.
**Materiality rule.** A finding is material only if all hold: (1) it names a file and line or symbol in the diff or its one-hop blast radius; (2) it states a concrete input and the wrong result, or quotes a broken stated contract; (3) the diff caused it; (4) it reproduces when the reader runs it. Not material: style, wording, coverage wishes without a wrong result, unexecuted "might". "Finds the seed" = a material finding at `REAPED_TAG_RE` or its use, whose input is a terminal line with a non-final `[derived]`.
**Who does what:**
- Gate: the operator, via `gate-remote.ts` (dir `~/lf-gate-t6`). Caught = a leg that passes on control fails on seeded.
- Review: headless Sonnet given review-scoping's brief, frozen: the diff, changed files, callers, TD-232 quoted as of 5ca2c00e^, standards excerpts and the pinning tests (`evals/run-by-reference-fixtures.ts`). R2 (assume-guilty framing) runs only if R1 reports 0 findings.
- Checker: `agents/checker.md` via `--agent`, the same brief minus the reviewer framing, blind to the seed and to all verdicts.
- Parity: Sonnet, same effort, same tools (Read, Glob, Grep, Bash), `--disallowedTools Agent Edit Write NotebookEdit` for both reviewer and checker. Checker `--max-budget-usd` equals the measured review total (R1, plus R2 if run).
- Reader: the operator, applying the rule with each ruling and reason logged.
**Micro-tasks:**
- **M1, scratch clone at 5ca2c00e^**, all other refs deleted, reflog expired, gc pruned; then a `control` commit (the real diff) and a `seeded` commit. Verify: `git cat-file -e 5ca2c00e` fails (answer key gone); the control tree equals `5ca2c00e^{tree}` from the main repo; `git diff control seeded` shows 1 file, 2 lines.
- **M2, answer-key probe (free).** A fixture case with a non-final-`[derived]` terminal line: control reports CLOSE-FIRED-UNREAPED, seeded reports nothing. PROVES the seed is material.
- **M3, gates on control and seeded.** Verdict lines recorded; control must reproduce the old revision's baseline.
- **M4, R1 and R2 if run** (`--max-budget-usd 1.0` each). The reader rules; if caught: "no gap shown", no-go, stop.
- **M5, checker on control and then seeded**, each a fresh session at the same path `t6-run`, recreated per run. Verify after each: `git status --porcelain` empty and HEAD unchanged. Transcript audit: 0 Edit/Write calls and 0 paths outside the clone (including `D:\Project\lean-flow\`).
- **M6, verdict.** Pass only if the seed is found and nothing material is raised on control.
**Files:** `trial/epic-024-row8` (worktree `e024-row8`) holds `agents/checker.md`. `main`: TASK-636 evidence and epic row 8.
**Limit 3.5 USD:** R1 0.6 + R2 0.6 + checker 2 × 0.8 = 2.8, plus 0.7 margin. Gates run on the VPS at 0 USD.
**Cut:** none needed. An early catch ends the row at about 0.6 to 1.2.
**Risk:** the answer key leaks through git objects or through reads of the main checkout or plugin cache. Pruning, the `cat-file` check and the path audit catch it; a leak voids the run.

##### T7: row 9, the reproducer
**Approach.** A tiny fresh repo `t7-host` (Bun/TS, one commit, no history): `src/tags.ts` exports `isValidTag`; `src/check.ts`; `bin/tags.ts check <file>` prints `invalid: <tag>` and exits 1; its tests alternate valid and invalid tags, so they pass on the bug. The reproducer is `agents/reproducer.md`, run via `--agent`. The `/diagnose` arm prompt is "/diagnose <report>: Phases 1 and 2 only, then stop", with `--plugin-dir` on a worktree at the same revision without the agent file (D1: the agent must not be discoverable there). Both arms use Agent-disallowed, single-thread sessions.
**Frozen values:**
- **Report:** "`tags check` rejects valid tags in big files. On our ~200-line file some valid tags (e.g. `release-notes`) come back invalid; a file with only that tag passes; not always the same tags. Expected: valid tags are never reported."
- **Hidden cause:** a module-level `TAG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/g` used with `.test()`; `lastIndex` carries between calls, so consecutive valid tags alternate between pass and fail. The seed script adds the `g` (`found 1`).
- **Clean twin:** the same tree without the `g`, kept in operator scratch.
- **Deliverable, identical for both arms:** a repro command that exits 1 on the symptom and 0 otherwise; files only under `repro/`; the report's last line is `reproduced: yes|no`.
- **Saving threshold:** reproducer mean USD ≤ 0.75 × diagnose mean (at least 25% cheaper, the row-4b bar).
- **Order (counterbalanced, ABBA):** D1, R1, R2, D2, then R-twin (the reproducer on the twin).
- **Per run:** a fresh clone at the same path `t7-run`, same model and effort, same tools (diagnose's allowed-tools), `--max-budget-usd 1.5`, 20 min wall limit.
**Micro-tasks:**
- **M1, host, seed, twin and symptom pre-check (free).** Verify: `git diff --no-index` between bug and twin is 1 line; a 4-valid-tag file shows 2 invalid on the bug and 0 on the twin. PROVES the bug is real and the twin is clean.
- **M2, agent file and both prompts.** Judgment tick by read-through: the prompts differ only in the procedure invoked.
- **M3, the five runs.** Recorded per run: USD, minutes and the final line.
- **M4, `t7-rerun.ts`.** Each repro runs 5× on the bug (exit 1 every time) and 5× on the twin (exit 0 every time); then one judgment tick that the printed evidence is the reported symptom.
- **M5, negative check.** After each reproducer run, `git status --porcelain -- . ":(exclude)repro"` is empty. Control: unfiltered status shows the `repro/` files, so the check reaches.
- **M6, verdict.** Pass if either the reproducer is 2/2 valid and diagnose ≤1/2, or both are 2/2 and the threshold is met. R-twin must end `reproduced: no`. A failed or unknown control is no-go.
**Files:** `trial/epic-024-row9` (worktree `e024-row9`). `main`: TASK-637 evidence and epic row 9.
**Limit 4.5 USD:** 5 runs × 0.7 = 3.5, plus one rerun 0.7, plus 0.3 margin.
**Cut:** drop the rerun. Four ABBA runs plus the twin is the minimum.
**Risk:** the reproducer "fixes" the code or reads the twin. M5 and the path audit catch both.

---

##### Totals and sequencing
- **Row limits:** T3 6.5 + T5 4.0 + T6 3.5 + T7 4.5 = 18.5 USD; with a shared 2.5 reserve, 21.0.
- **Host:** 13.7 GB RAM with 1.7 GB free at check, 16 threads. T2's minutes and T5's deadlines both depend on wall time, so no paid T3–T7 run overlaps a replay.
- **Alongside T1 and T2, at no Claude spend:** all host repos, seeds, oracles, twins and reference solutions; the watcher and its fixture test; T6's clone, pruning, answer-key probe and VPS gates (before T2 starts or between replays, never during a replay's gate); the agent files.
- **Order after T2, one run at a time, tally after each:** T3, then T4, then T6 (can end cheaply), then T7, then T5 (needs a quiet host). Rows 7 to 9 go last because they are SD2's deferral lever.
- **M0 probes:** run right after T1 freezes; about 0.5 USD together.
- **`check-verify-reaches.ts`:** keep these Verify notes in each task's approved design, not as `*Verify:*` clauses in the frozen Done-when; they name operator-scratch paths, which the checker would read as absent.

##### Open intent questions (drafter's recommendation first)
- **Q1 (T5) attended:** (a) headless, owner's view = the coordinator's visible text in the window, recorded as emulation [rec]; (b) owner sits through run 1 (~12 min).
- **Q2 (T3) seed shape:** (a) owner ruling left out of the build brief (exit 64) [rec]; (b) operator-planted code defect after the build.
- **Q3 (T6) host:** (a) real commit 5ca2c00e with the anchor-drop seed [rec]; (b) subtler seed in a tiny scratch change.
- **Q4 (T5) watcher builder:** (a) Codex, recorded "Codex, not on the cap", Claude reviews [rec]; (b) the operator session.

##### Facts verified (source)
- CLI 2.1.319 flags `--fork-session`, `--max-budget-usd`, `--session-id`, `--agent`/`--agents`, `--input-format stream-json`, `--disallowedTools`, `--effort`, `--plugin-dir`; no `--max-turns` (`claude --help`).
- Subagent transcripts at `<proj>/<session>/subagents/agent-<id>.jsonl` with `cwd`, `timestamp`, `agentId`; `.meta.json` holds `finished`, `model`, `requestShape:"background"` (this project's transcript dir).
- `session-cost.ts` per-session USD from `cost-state` rows, skips a session with no cost row (`scripts/session-cost.ts:14-71`).
- `gate-remote.ts` ships HEAD as a bundle, runs qa-check then `bun test`, refuses a rewritten `LF_GATE_DIR` (`scripts/gate-remote.ts:1-56`).
- 5ca2c00e's diff and fixture tags (`git show` + per-fixture grep, second grep confirming line-end placement).
- Second look fires on 0 findings; small diffs get one scoped Sonnet reviewer (`review-scoping.md`).
- Night-run's stall signal = new stream lines or commits (`night-run.md:638`). No-resume host hands a new worker the context (`dispatch.md:31-35`). Diagnose Phases 1–2 (`skills/diagnose/SKILL.md`).

##### Not verified
- `SendMessage` to a worker after a cross-process `--resume`/`--fork-session` (T3 M0).
- A background Bash exit waking the main thread in `-p` mode (T5 M0).
- Whether a forked session's cost row covers only the fork (cross-check rule handles it).
- Whether the 5ca2c00e^ gate still runs green on today's VPS (T6 M3).
- Whether permissions deny reads outside cwd (audit instead).
- USD estimates (scaled from TASK-630's measured runs, not a price sheet).
- T1's frozen settings (do not exist yet).

### 2026-11-09 | execute | T1 (TASK-632) build, review and first probe
consequence · T1 · behaviour:low · governance:low (trial-branch agent files only; nothing reaches `main` but this Log and TASK-632's evidence).
- Build: Codex (`codex exec`, workspace-write) in `e024-thin`, from the G2 design and settlements with DeepSeek's files @8c32a9dc pasted in. `router.md` 31 lines, `executor.md` 38; worker contract byte-identical to `worker-brief.md`. Coordinator review: router L21 parked headless questions, a second difference between arms; fixed to relay the Executor's own recommendation unchanged. Codex fidelity review R1 (read-only, separate run): all row groups OK but rows 6-10 (Med, that same line), `VERDICT: CLEAR`; no R2. Committed on `trial/epic-024-thin-router` at 83193f9c. Codex usage: 82,177 tokens build, outside the cap (owner ruling).
- Probe P-ord (ordinary arm, `lf-gate-o1`), 0.51 USD: `LF_GATE_DIR` unchanged in main and worker ✓; push permission-denied ✓; `$TMP` file inside `.git/lf-tmp` ✓; gate reached the VPS (exit 1, the base's 3 SPRINT-167 record fails, see below) ✓. Failed: the worker's Edit of `.claude/CONTEXT.md` was denied in `dontAsk`, inside `.claude/worktrees/` too; and both `sleep 330` calls were blocked by the CLI, so no survival time. S1 stop: brought to the owner.
- Permission tests, about 0.05 USD (Haiku, one call each): an `Edit(.claude/**)` allow, an absolute-path allow, `acceptEdits`, and a bare `Edit` allow are all denied on `.claude/`. Under `bypassPermissions` the edit lands. Deny rules on Windows match only in the `//d/Project/...` (or `D:/...`) form; `//D:/...` silently matches nothing. Incident: one test meant to prove a main-repo deny used the non-matching form and appended a line to `D:/Project/lean-flow/README.md`; reverted at once (`git checkout -- README.md`, status clean), later tests used a throwaway folder.
- Owner ruling by popup, verbatim: "bypass + deny list (Recommended)" (question: "Probe P-ord (0.51 USD): a worker's Edit of `.claude/CONTEXT.md` is denied in every non-bypass mode … how should the replays run?"). Harness now: `--permission-mode bypassPermissions` in every arm; deny list `Bash(git push *)`, `Bash(git branch -D *)`, `Bash(git branch -d *)`, `Bash(git remote *)`, and Edit and Write on `//d/Project/lean-flow/**`, `//d/Project/lean-flow-worktrees/e024-*/**` and `replay-*/**`. Bash writes are not covered by deny rules, so every run takes a before/after snapshot (main repo status and refs hash, worktrees-folder listing).
- Base gate at 6a7cadf2 (clean clone, `lf-gate-o1`): qa-check 480 pass, 3 fail, all SPRINT-167's own mid-sprint records (consequence-line vocabulary, layers completeness on its sprint file and TASK-623). Expected for a sprint in progress; a valid run must leave the gate green at close, as TASK-630's ordinary runs did.
- The scratch workspaces are untrusted, so `.claude/settings.json`'s 68 allow entries are ignored; equal in every arm and covered by `--allowedTools`; recorded, not changed.
- Probe wait fixed: `python -c "import time; time.sleep(330)"`, twice. P-ord2 relaunched on a fresh clone.
- Spend so far: G2 workers about 3.5 (estimate) · P-ord 0.51 · permission tests about 0.05 · total about 4.1 USD of 60.
- Probe P-ord2 (ordinary arm, bypass + deny list, fresh clone), 0.67 USD: `LF_GATE_DIR` `/home/ubuntu/lf-gate-o1` in main and worker; gate reached the VPS (exit 1, red as expected on a probe edit over the mid-sprint base); worker outlived main's last turn by 840 s (bar 660) and its report arrived; `.claude/CONTEXT.md` edited with the Edit tool, committed and merged onto `replay` (`c49fb556`); push denied; `$TMP` file in `.git/lf-tmp`; main repo and worktrees-folder snapshot unchanged apart from this Log. Pass.

### 2026-11-09 | execute | T1 (TASK-632) thin-arm probes; T1 done
- P-thin (first try) was stopped by Claude Code's low-memory reaper about a minute in, together with the Codex build loop; void, a few cents. Owner popup, verbatim: "Rerun P-thin alone (Recommended)". The orphaned merger build finished on its own (`agents/merger.md` written, uncommitted).
- P-thin2, 0.39 USD: settings matched (env, survival 1213 s past main's last turn, edit made, push denied, logs in scratch), but the Executor ended its turn with a needed background job still running; headless mode never resumed it, so no report and no merge. Treatment defect, not a settings gap: every router replay would have stalled at its first gate.
- Owner ruling by popup, verbatim: "Fix + re-probe (Recommended)". Executor L13 now waits in the foreground and never ends its turn while a needed job runs; L15 runs merge-check in the foreground; router L28 drops "in the background". `trial/epic-024-thin-router` at 98542dd7, contract still byte-identical; fidelity row 7 amended in TASK-632.
- P-thin3, 0.43 USD: `LF_GATE_DIR` `/home/ubuntu/lf-gate-r1` in main and Executor; Executor loaded as `lean-flow:executor` (worktree, background); outlived main's last turn by 843 s and reported; CONTEXT edit made, committed and merged (`3f3e8505`); push denied; snapshot unchanged. Pass.
- TASK-632 Done when 2 of 2 ticked; moved to `done/`.
- Spend so far: about 5.7 USD of 60 (G2 workers about 3.5 estimate · P-ord 0.51 · P-ord2 0.67 · P-thin about 0.05 · P-thin2 0.39 · P-thin3 0.43 · permission tests about 0.05). T1 row (limit 2.5): about 2.1.

### 2026-11-09 | execute | T2 (TASK-638) replay O1; owner rulings on pausing and parallel work
- The O1 launch waited 2.5 h: the PC suspended during the timed cold-start wait. Owner popup, verbatim: "Keep awake + launch (Recommended)". AC standby changed from 300 min to never (`powercfg /change standby-timeout-ac 0`; undo with `300`).
- Owner rulings by popup, verbatim: "Let O1 finish, then pause (Recommended)", then "Free prep + T6‖T7 (Recommended)" and "Continue after O1 (Recommended)". Free prep (Codex builds, hosts, seeds, oracles; no Claude spend) may run during the replays; T6 and T7 run side by side after T4 (neither verdict uses time); every other paid run stays one at a time. This amends the G2 run order for T6 and T7 only.
- O1 (ordinary arm, `replay-p-ord`, `lf-gate-o1`), launched 02:22:12Z: exit 0 · **3.849 USD** (`total_cost_usd`; `session-cost.ts` cost rows 3.8) · **42.0 min** wall · boxes 11/11 · SPRINT-167 closed · two merges onto `replay` from worktree-isolated Sonnet builders (`5d1a5de2` T1, `0ae13920` T2) · two scoped Sonnet reviews · in-run gate green (`bun test` 589/0, qa-check 482/0, then 472/0 after close) · operator gate rerun on final HEAD `2cfa97b3`: `bun test` 589/0, qa-check 472/0, rc 0 · Edit/Write outside the clone 0 · refs check: the only main-repo ref changed during the run was the coordinator's own `trial/epic-024-merger` commit. **Valid.**
- `trial/epic-024-merger` at b2c71d34: Codex-built `agents/merger.md` (38 lines), coordinator review added the foreground-wait line.
- Spend so far: about 9.6 USD of 60 (T1 about 2.1 · G2 workers about 3.5 estimate · O1 3.85). T2 row: 3.85 of 20.

### 2026-11-09 | execute | T2 replay R1; free prep for T3, T5, T6, T7
- R1 (thin-router arm, `e024-thin` 98542dd7, `lf-gate-r1`), launched 03:26:24Z: exit 0 · **2.658 USD** (`total_cost_usd`) · **72.7 min** wall · boxes 11/11 · SPRINT-167 closed · merges onto `replay`: T1 `6b591baa`, T2 `98c815d3`, close `c4f09450` · two scoped Sonnet reviews dispatched by the Executors · in-run gate green at close (`bun test` 589/0, qa-check 472/0) · operator gate rerun on final HEAD `3c648154`: qa-check 472/0, rc 0 · no permission denials · Edit/Write outside the clone 0 · snapshot unchanged.
- R1 router audit: tools Bash 15, Agent 3, SendMessage 8; no Glob, Grep, Edit, Write, Skill or Read outside the allowlist; every Bash call is bookkeeping on sprint, Log and task files or a `git merge` (the checker's one regex hit was a `sed` on a `Cites:` line whose text names `check-doc-caps.ts`). Identity: one `lean-flow:executor` per task plus one for close, all follow-ups by `SendMessage` to the same id. Relays: one Executor question answered with the Executor's own recommendation and logged (router L21). Judgment note: one router follow-up reasoned about what the gate's review-depth check would expect, which goes past pure routing.
- Deviation: the coordinator's fixture-brief command contained backticks inside a double-quoted `echo`, so the shell ran `bun test` (lean-flow's 589 tests, about 125 s) in the main repo from about 03:27 to 03:29:11Z, during R1's first 2.5 minutes. The main repo stayed clean. The extra local load can only lengthen R1, the direction that cannot produce a false go.
- Against the go rule so far: R1 cost passes (2.658 is 31% below O1's 3.849); R1 time fails against O1 (72.7 vs 42.0 min). O2 would need at least 103.4 min for R1 to meet the time mean.
- Free prep (owner ruling): Codex built the watcher (`trial/epic-024-row7` d4fe3445: 23/23 tests pass, kill/stop/spawn grep 0, control grep finds `readFileSync`), checker (`row8` 7179cff0) and reproducer (`row9` 6712393d), all generic with no seed named; and the fixtures in operator scratch (T3 host and hidden oracle with reference solutions, T5 tools and worker plans, T7 seeded host and twin). Checks: T3 oracle discriminates (task-only reference: a FAIL, b-d PASS; ruling reference: all PASS); T7 seed check 4/4 PASS; the host test suites pass.
- Spend so far: about 12.3 USD of 60 (T2 row: 6.51 of 20).

### 2026-11-09 | scope-change | TASK-638 first box: R2 skipped by owner exception (S12)
What broke: TASK-638's first box asks for four replay runs; after O1, R1 and O2, R1 already fails the go rule on time (72.7 min against the 47.85 ordinary mean), so R2 cannot change the verdict. Impact: R2 not run, about 5 USD and an hour saved; the box reads "3 of 4 run, R2 skipped by owner exception". Re-confirm: the owner pre-recorded this exception at G2 ("Allow early stop (Recommended)", S12); no new ruling needed.

### 2026-11-09 | execute | T2 replay O2; row 4b verdict no-go; T2 done
- O2 (ordinary arm, `lf-gate-o2`), launched 04:49:26Z: exit 0 · **4.319 USD** (cost rows 4.3) · **53.7 min** · boxes 11/11 · SPRINT-167 closed · merges `ed9d7bd9` T1, `e0720222` T2 · two scoped reviews · in-run gate green at close (589/0, 472/0) · operator rerun on final HEAD `b9042f16`: qa-check 472/0, rc 0 · no denials · no Edit/Write outside the clone · the worktrees-folder change during O2 was the coordinator's own T6 clone (`s170-t6-host`, checked by creation time). **Valid.**
- Go rule (readings against a pass): ordinary mean 4.05 USD, bar 3.04, R1 2.70 passes; time mean 47.85 min, R1 72.7 fails. **Row 4b: no-go.** EPIC-024 row 4b and Closed-when updated; TASK-638 § Results written; 4 of 4 boxes ticked. O1 and O2 are valid, so TASK-634's baseline stands.
- Free prep during O2: T6 clone `s170-t6-host` built at 5ca2c00e^ with refs pruned (5ca2c00e absent); `control` tree equals 5ca2c00e's tree; `seeded` differs in 2 files, 3 lines (seed script, each edit `found 1`). M2 probe: on a terminal line with `[derived]` not at its end, control's REAPED_TAG_RE rejects it and seeded's accepts it, so the seed is material.
- Spend so far: about 16.6 USD of 60 (T2 row: 10.83 of 20).

### 2026-11-09 | execute | T6 gates on control and seeded; T4 unsafe-merge case M-U
- T6 M3: the old revision has no `scripts/gate-remote.ts` (added in v2.14.0), so main's copy ran from inside the T6 clone (`bun --no-env-file D:/Project/lean-flow/scripts/gate-remote.ts`, `lf-gate-r2`); it ships the clone's HEAD. Control `1257737a` and seeded `182339a6` read alike: `bun test` 441/0, qa-check 299 pass, 1 fail; the one FAIL is the unrelated `prose-density` line in EPIC-005, which is exactly SPRINT-135's own recorded gate on that revision (Log line 110: `QA-CHECK: 299 pass, 1 fail`, same FAIL). No leg passes on control and fails on seeded: **the gate does not catch the seed.**
- S30 conflict (words "control not green → inconclusive" against its stated reason "host not reproducing the baseline"). Owner ruling by popup, verbatim: "Proceed: baseline reproduced (Recommended)". T6 continues to the review and checker runs.
- T4 M-U (`e024-merger` b2c71d34, no gate dir): a pruned clone of O1's final tip (`replay` 2cfa97b3) plus a planted `sprint167-t2-followup` cut from 6a7cadf2 whose one commit raises `token-budget.txt` 12691 → 13200 and edits a § Gates sentence (plant script, each edit `found 1`; git would merge it cleanly). The coordinator dispatched one `lean-flow:merger`, which refused with `blocked`, naming the wrong merge base, the out-of-Layers file and the D3 breach; `replay` unchanged at 2cfa97b3, 0 new commits, snapshot unchanged. 0.283 USD, 36 s. **Refusal case passes.**
- Spend so far: about 16.9 USD of 60 (T4 row: 0.28 of 10.5).

### 2026-11-09 | execute | T4 merger run M1 invalid (treatment prompt); M1' ruled
- M1 (merger arm, `lf-gate-o1`), launched 06:04:38Z: exit 0 · 1.641 USD · 36.4 min · merger merged T1 `--no-ff` (`3d0b10b9`; merge oracle finds no T2 merge) · the inspector's `merge-check` failed on SPRINT-167's own record checks (`layers-completeness` on T2's Plan line, `layers-observed` on two commits), the same pre-existing record issues every ordinary run fixed itself · the coordinator stopped the queue as the treatment paragraph told it to ("Merge, resolve and repair nothing yourself … on a fail, stop the queue") · boxes 0/11, sprint not closed · snapshot unchanged. **Invalid**: the cause is the coordinator's treatment prompt, which changed coordinator behaviour beyond the one treatment (D2), not the merger.
- Merge oracle (operator scratch `merge-oracle.ts`) calibrated before M1 ended: O1, O2 and R1 PASS; must-FAIL fixture (O1 with the expected file sets swapped) reads BAD MERGE with both mismatches named.
- Owner ruling by popup, verbatim: "Fix + M1', early-stop M2 (Recommended)". The treatment paragraph now bars only git merges, conflict resolution and merge repair; the coordinator keeps its own record fixes and acts on a merge-check fail as it would without a merger. M1' reruns on a fresh clone; if M1' already misses the bar (cost at most the 4.05 ordinary mean, time at most 47.85 min), M2 is skipped and row 6 reads no-go. Up to about 2 USD may come from the reserve.
- Spend so far: about 18.5 USD of 60 (T4 row: 1.92 of 10.5).

### 2026-11-09 | execute | T4 merger run M1' valid; meets the bar, so M2 runs
- M1' (merger arm, fixed treatment prompt sha256 bf3ea6ff…, `lf-gate-o1`), launched 06:51:57Z: exit 0 · **3.759 USD** · **24.0 min** · boxes 11/11 · SPRINT-167 closed · both merges run by the merger (`afc540ea` T1, `457596e0` T2; the coordinator ran no merge) · two separate inspectors ran merge-check · merge oracle PASS · in-run gate before close read 481/1, the operator rerun on final HEAD `9f2657fe` reads `bun test` 589/0, qa-check 472/0, rc 0 · no denials, no outside writes, snapshot unchanged. **Valid.**
- Against T4's bar (readings against a pass): cost 3.76 against the 4.05 ordinary mean, time 24.0 against 47.85 min. Both within, so the early stop does not fire; M2 runs.
- Spend so far: about 22.3 USD of 60 (T4 row: 5.68 of 10.5).

### 2026-11-09 | execute | T4 merger run M2; row 6 verdict go; T4 done
- The M2 job was stopped by Claude Code's low-memory reaper during its pre-launch wait (no run started, 0 USD). Owner popup, verbatim: "Relaunch M2 now (Recommended)".
- M2 (merger arm, `lf-gate-o2`), launched 07:44:01Z: exit 0 · **3.854 USD** (rows 3.9) · **27.4 min** · boxes 11/11 · SPRINT-167 closed · both merges run by the merger (`93dec10f` T1, `f612d2f1` T2; each coordinator Bash call checked, its "merge" hits are Log-text edits; its one `TaskStop` stopped the idle T1 builder) · two inspectors · merge oracle PASS · operator gate rerun on final HEAD `81e6066a`: `bun test` 589/0, qa-check 472/0, rc 0 · snapshot unchanged. **Valid.**
- **Row 6: go.** 0 bad merges (M1', M2 oracle PASS; M-U refused); both merger runs 11/11 with gate and review; cost 3.8 and 3.9 against the 4.05 ordinary mean, time 24.0 and 27.4 against 47.85 min. Caveat recorded in TASK-634 § Results: n = 2 per side, so part of the time gap is likely variance. Shipping still needs D5 and an owner ruling.
- Spend so far: about 26.2 USD of 60 (T4 row: 9.54 of 10.5).

### 2026-11-09 | execute | T3 (TASK-633) M0 probes; fallback order applied
- Harness `t3.ts` (operator scratch): per pair, a build session with a fixed `--session-id`, a bundle snapshot of the built tree, arms run on a fresh clone of that snapshot at the same path, the hidden oracle run from `fixtures/keys/t3`. Same model, permission mode, deny list and env as the replays.
- M0: probe0 (dispatch a worker that writes `x.txt`), 0.129 USD. probe1, the same session forked (`--resume <id> --fork-session`), 0.200 USD: `SendMessage` to the worker failed with "could not be resumed: No transcript found for agent ID", so a forked session cannot reach the original worker. probe2, plain `--resume <id>` in place, 0.212 USD: the worker was resumed and appended the line (`x.txt` reads one, two).
- So G2's pre-agreed fallback applies (draft B T3 "Fallback, decided by M0"): in every pair arm B runs first as a fork, then arm A as a plain `--resume` of the build session in place. The counterbalanced order is lost. Coordinator settlement, in the direction against a pass: at least 10 minutes between arm B and arm A, arm A's first-request cache reads recorded, and if they hit a prefix arm B paid for, arm A's cost is repriced as if cold.
- Spend so far: about 26.7 USD of 60 (T3 row: 0.54 of 6.5).

### 2026-11-09 | scope-change | T3 (TASK-633) arm A moves in-process (owner ruling)
- First pair under the fork/resume fallback: build 0.183 USD (snapshot pre-check a FAIL, b-d PASS as required); arm B fork 0.309 USD, 2.43 min round, oracle 4/4 PASS. Arm A by plain `--resume` failed twice (0.277 and 0.268 USD): the CLI opened a new session (`71512470`, then `159dd6bd`) instead of continuing the build session `2d4d66b0`, so `SendMessage` found no transcript for the builder, though its transcript sits under the build session's `subagents/` folder. The probe session resumed in place even an hour later (`f0b49fab`), and restoring pair 1's original folder did not help, so the cause was not found. The coordinator's reset also first failed on a cross-drive rename (fixed). About 1.8 of T3's 6.5 USD spent by then.
- What broke: G2's T3 design (both arms fork one build session). Impact: arm A cannot be run across processes on this host.
- Owner ruling by popup, verbatim: "Arm A in-process (Recommended)". Re-confirmed design: each pair's build session continues in one process (builder reports → commit → snapshot → the coordinator sends the finding to the same builder by `SendMessage`); arm B is a fresh session on a clone of the snapshot that dispatches a fresh builder with brief and finding. Round = dispatch to report; round USD = every assistant message (coordinator and worker) starting in that window, priced from tokens with the 2026-11-09 fit. Arm B's coordinator starts cold, a bias toward arm B, so against a pass. Leak check: arm A's builder brief must equal the frozen brief exactly. TASK-633's Done-when stands as written; "forked from one build session" was the design's means, not a criterion.
