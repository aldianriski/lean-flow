---
sprint: 171
slug: finish-epic-024
owner: Maintainer
last_updated: 2026-11-10
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-171 — Execution Log

> Append-only companion to [`../SPRINT-171-finish-epic-024.md`](../SPRINT-171-finish-epic-024.md). Uncapped by design:
> this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (STANDARD §9). **Never edit a past entry** — correct it with a new one.
>
> Rendered at promote, in the same commit as `plan locked`; its first entry is the `promote` entry
> carrying the signed governance checklist.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.
> Its heading names every `Tn` it changes, and every path the entry names sits in one of those tasks' `Layers:` or `Cites:`.

### 2026-11-10 | promote | plan locked, 7 members: TASK-640 to 646
Owner request, verbatim: "promote what is need to tackle to finish epic". EPIC-024's one open Closed-when condition is held by TASK-646, which depends on TASK-641 (itself on TASK-640) and TASK-642.
Promote governance checklist, signed by the owner by popup. Answer, verbatim: "Also add 643-645". The question asked for sign-off on the checklist below and a 4-member draft (640, 642, 641, 646), and named 643 to 645 as out. The answer signs the checklist and widens the draft to seven.
Frontier answers, verbatim: TASK-624 "Delete (Recommended)" · cap "35 USD (Recommended)" · LEARNINGS "Locate and collapse all 5" (see the doc-aging line: the finding was wrong, nothing to collapse).
- ☑ L-promotion: 289 entries; 61 at `[status: active]` and 61 `promoted: no` lines, all at count 1 (an awk pass keyed on each entry's own `count:` and the status census agree). None at count 2 or more. Disposition: none needed.
- ☑ TD aging: 117 open rows (71 low, 24 minor, 14 medium, 8 trivial, 0 high). 113 are aged 3 or more sprints; TD-303 to TD-306 (SPRINT-169 and 170) are newer. Disposition: keep, nothing escalated.
- ☑ doc-aging, §11 and §2 caps: `check-doc-caps.ts` exit 0, no FAIL and no soft over-cap; three named `retained:` dispositions and one FROZEN row (`docs/research/loop-hygiene-prd.md`). §11 TD deletion: none due (no row is `resolved`). CHANGELOG rotation: current (v2.21.0 and v2.20.0 inline, older in `docs/changelog/`).
  §11 closed task files: of 97 in `done/` and `cancel/` (22 unstamped, skipped), only TASK-624 (SPRINT-168) is due with no live citation. A scan script and an independent `git grep -w` with the history paths excluded agree; the positive control TASK-626 hits. Disposition: deleted in this commit, id retired.
  §11 LEARNINGS: the popup reported 5 promoted entries left uncollapsed. That count came from a wrong selector (the old `promoted: yes` field). Re-run with the conformance engine's own two collapsed forms (`S11.LEARNINGS`), only L-144 lacks a pointer, and it carries the recorded non-collapse marker. The owner's "collapse all 5" therefore has nothing to act on: no entry was collapsed.
- ☑ epic rollup currency: EPIC-024 current. All five member sprints (165, 166, 168, 169, 170) have a row with a `close_commit`; header `last_updated` 2026-11-10 equals the newest close (SPRINT-170, `ed530d27`); every ticked Closed-when line names its sprint. No other epic is `active` (EPIC-005 `proposed`).
- ☑ epic coverage: EPIC-024 fully covered (1 open, 1 mapped, → TASK-646). This sprint touches it; no refusal, no override.
- ☑ roadmap coverage: none (no roadmap file). ☑ handoff ledger: none (no ledger file).
Composition: 7 members, none `L`. Edges: T5 (TASK-643) and T6 (TASK-641) on T1 (TASK-640); T7 (TASK-646) on T2 (TASK-642) and T6. TASK-641, 643 and 646 keep `state: blocked` because their only open blockers are in-sprint (TASK-641's budget and replay choice are asked at its G1, A2). No stream. Epic: `EPIC-024` stamped on the sprint, a § Member sprints row appended, `member_sprints` extended. Status move at `62651d80`.
Budget: one 35 USD all-in cap, warn at 28 (D1).
Baseline gate on `main` at `62651d80`, run off-host: `QA_FULL=1` via `bun --no-env-file scripts/gate-remote.ts`, exit 0: qa-check 495 pass, 0 fail; `bun test` 589 pass, 0 fail.
G1 and G2 are not yet signed; `gates_signed` is recorded in the sprint frontmatter only after the owner's sign-off is relayed verbatim. T1 is declared `tier: G`; T2 to T7 `tier: P`.

### 2026-11-10 | gate | G1 batch signed, T1 to T7
Owner popup, verbatim: "Approve G1 (Recommended)" (question: "Do you approve batch G1 for SPRINT-171, with the scope of the 7 tasks (T1 to T7, TASK-640 to 646) as listed: sizes M,M,S,S,M,M,S, out-of-scope as named, full checklist for each (all are close-retro, so no fast-path)?"). All seven took the full checklist; none is `L`.
Frontier answers, verbatim: T6 replay pick "Operator picks at G2 (Recommended)" (a closed sprint other than SPRINT-167, with at least 2 worktree merge-backs and at most 11 boxes, approved in the G2 packet) · budget "Split as proposed (Recommended)": T6 26 USD, T2 4 USD, workers, probes and review 3 USD, reserve 2 · popups "Yes, fewer, 644 first (Recommended)": T3's rule is ruled before T2's and T6's G2, and both use it (A4 confirmed).
Open for G2: T2 A3 (TASK-637's seed and twin reusable) and T4 A1 (row 5 transcripts readable) are facts to check, not owner questions.

### 2026-11-10 | gate | G2-A signed, T1 T3 T4
Owner popup, verbatim: "Sign G2-A, start wave 1 (Recommended)" (question: "Do you sign G2-A for SPRINT-171 T1, T3 and T4, and start wave 1 in parallel? … All three cost 0 USD. Builder checks: T1 5 contradictions, T3 2, T4 4, all settled in the designs. Layers pruned: skills/orchestrator/references/ from T3 and scripts/session-cost.ts from T4.").
Owner rulings by popup, verbatim: D16 cases "All three cases (Recommended)" (relaunch after a host kill, rerun after a suspend, fix and re-probe of a harness fault by the path test; recovery spend within the row's remaining limit) · minutes "My estimate + upper bound (Recommended)".
G2 is split by the G1 ruling (A4): G2-A covers T1, T3 and T4; G2-B (T2, T5, T6, T7) follows once D16 lands. `gates_signed` is written to the sprint frontmatter after G2-B, so its absence until then means G2 is not complete.
Designs were drafted by three Sonnet workers, settled by the coordinator after the builder checks, and are recorded verbatim in the operator scratch (`g2-T1-design.md`, `g2-T3-design.md`, `g2-T4-design.md`). Each design's Settlements section binds the build and wins over the draft text. The key settlements:
- T1: every SPRINT-167-specific value (selectors, file sets, predicates, base, branch) moves into a caller key outside the repo. All seven parts get a fixture or a real run, with the merge oracle ported whole. Each preflight fault's expected verdict is taken from SPRINT-170's records. Fixtures go in `test/`. No default model.
- T3: D16 (derived: EPIC-024's highest is D15). Box 2 ticks at SPRINT-171's close, so T3 waits in `review/`. Case-3 membership is a path test.
- T4: a method script outside the repo produces the bucket table, which is embedded in the note. Cold start is measured in both arms. The negative-control means are computed, not asserted. A residual difference is reported, with one bounded check of its cause.
- builder-check · T1 · 5 contradictions · 5 questions · settled in design (S1 to S6); no owner question left
- builder-check · T3 · 2 contradictions · 5 questions · settled in design (S1 to S5); cases and minutes ruled by owner
- builder-check · T4 · 4 contradictions · 4 questions · settled in design (S1 to S7); no owner question left
Build routes: T1 by Codex (`codex exec -s workspace-write` in a worktree, no git writes), scoped Sonnet review, coordinator commits. Tier G, other G: must-FAIL fixture per check plus one real run, review-round cap 2. T3 written by the coordinator. T4 by a Sonnet worker. Wave 1 (T1, T3, T4) shares no file, so it runs in parallel.
Preserved by the coordinator on 2026-11-10: SPRINT-170's run transcripts, from volatile session scratch to `D:\Project\lean-flow-worktrees\s170-harness-keep\runs\` (92 files, `diff -rq` identical; outside the repo).

### 2026-11-10 | scope-change | T3 T4: Layers pruned at G2-A
What broke: T3's and T4's `Layers:` each declared two candidate homes, and G2-A chose one (L-240: an unused token fails `layers observed` at close).
Impact: T3 drops `skills/orchestrator/references/`, because the rule is trial-specific, so nothing ships and no consumer check is needed. T4 drops `scripts/session-cost.ts`, because the method is a note and no script changes. Neither Done-when changes. Re-confirm G2: covered by the G2-A sign-off above, whose question named both prunes.

### 2026-11-10 | scope-change | T4: cite session-cost.ts after the prune
What broke: `984e5b2f` pruned `scripts/session-cost.ts` from T4's `Layers:` but did not move it to `Cites:`. TASK-645's Done-when names it as a reconciliation source, so promote-check printed `member-layers-incomplete` for T4. That commit went in with the FAIL unread, because the command chain did not stop on it.
Impact: T4's `Cites:` now declares `session-cost.ts` (read only). No Layers change, no Done-when change. promote-check: PASS, 22 pass, 0 fail. Re-confirm G2: not needed, because a citation adds no file to the build.

### 2026-11-10 | progress | T3 built and reviewed: EPIC-024 D16
consequence · T3 · behaviour: none (a docs rule, nothing executes) · governance: yes (a trial-sprint protocol rule) → one scoped `sonnet` reviewer.
Built by the coordinator from the signed design (`e8f76ae0`). Review: no High, 2 Med, 3 Low. Spec: boxes 1 and 3 met. Med 1: case-3 membership was not stated as mechanical. Med 2: "row's remaining limit" was ambiguous, because EPIC-024 uses "rows" for trial rows. Both were fixed in one bounded retry (`efefbd78`), along with one Low (case 2's keep-awake restore). Two Lows are kept as noted: the listed paths do not name verdict-rule or budget files, which the Negative clause covers in text; and signing the packet triggers the pre-authorisation. No re-review, because both fixes only tighten wording the reviewer itself proposed.
Ticked: TASK-644 boxes 1 and 3. Box 2 ticks at SPRINT-171's close, from its Retro (design S1), so TASK-644 waits in `review/` until then.

### 2026-11-10 | progress | T4 built: trial cost-allocation note
consequence · T4 · behaviour: none (a research note) · governance: none (changes no rule, verdict or contract) → self-review only (coordinator read-through, tier P).
Built by a Sonnet worker in the main tree (`792897e1`), with the index regenerated in `4245d5c0`. Method scripts stay outside the repo in `D:\Project\lean-flow-worktrees\s170-harness-keep\`: `t4-buckets.ts`, `t3-measure2-preserved.ts` (only `OPS` repointed to the preserved runs), and `out-t4.txt`.
Evidence: the six recorded round totals reproduce at 3 dp ("match" ×6); buckets sum to each window with diff 0.0000; `cost-state` = `total_cost_usd` at 3 dp in all six runs; `check-doc-caps.ts` PASS (96 ≤ 130); `check-prose-density.ts` 27 pass, 0 fail.
Read-through: the arm means recompute from the table. One coordinator edit: the last line's claim that the raw files "hold trial answer keys" was unverified, so it now says only where they are.
Finding for the owner: cold start is about 0.057 USD in both arms, so EPIC-024 row 5's "same builder 31% cheaper per fix (0.061 against 0.088 USD)" comes from charging B's cold start and not A's. Under one rule A is above B. Row 5's no-go stands (by-name gate). Whether to annotate row 5 goes into the G2-B packet as an owner question, because T4's Touches exclude the epic.
Ticked: TASK-645, all three boxes.

### 2026-11-10 | gate | G2-B signed, T2 T5 T6 T7
Owner popup, verbatim: "Sign all as recommended (Recommended)" (question: "Do you sign G2-B for SPRINT-171 (T2, T5, T6, T7) with every recommended ruling? …"). The rulings it carries, as recommended:
- T2: full `/diagnose` pass to Phase 6; stopping at Phase 5 only by a scope ruling. Planted seed 2 (an off-by-one host, built free by Codex). Go only if the helper is cheaper on both seeds, at most 0.75× cost and 1.10× time. Helper as a subagent; the Agent tool allowed in both arms.
- T5: slowdown margin 1.15× the ordinary time mean.
- T6: replay SPRINT-130 (2 merges; 7 of its 10 boxes, its T3 out of scope). `gate-remote.ts` as one identical overlay commit. Local QA denied in every arm. 6 runs, O M M O O M. Confirmed only if the merger's means are at or below the ordinary's; not confirmed above +10%. Row 6 always records that the queue is easy. An optional 0.3 USD unsafe-merge probe if the budget allows.
- T7: after T2 and T6, the owner rules per row: ship, don't ship, or another confirmation.
Owner rulings by popup, verbatim: budget "Raise cap to 40, workers 8 (Recommended)" · futility "Allow futility stop at 2 (Recommended)" (screen-outs only; a go still needs 3 per arm) · row 5 "Amend row 5 (Recommended)".
Designs and settlements are recorded verbatim in the operator scratch (`g2-T2-design.md`, `g2-T5-design.md`, `g2-T6-design.md`, `g2-T7-design.md`); each Settlements section binds the build.
- builder-check · T2 · 6 contradictions · 6 questions · settled in design (S1 to S9); R1 to R5 ruled by owner
- builder-check · T5 · 6 contradictions · 7 questions · settled in design (S1 to S8); margin and futility ruled by owner
- builder-check · T6 · 6 contradictions · 6 questions · settled in design (S1 to S9); R1 to R6 ruled by owner
- builder-check · T7 · 5 contradictions · 6 questions · settled in design (S1 to S5)
G2 is now complete for all seven tasks, so `gates_signed` is written to the sprint frontmatter in the next commit.
Budget at this point: the workers line had spent 4.96 USD against its 3 USD (15 Sonnet workers, priced from their transcripts with `agent-cost.ts`). That is a budget overrun, and per D16 it went to the owner, who ruled as above. The T6 and T2 rows were untouched.

### 2026-11-10 | scope-change | D1 cap 35 → 40; T5: Layers pruned
What broke: D1's 35 USD cap and its G1 split (T6 26, T2 4, workers 3, reserve 2) could not hold. The workers line spent 4.96 USD before any paid trial run. Separately, T5's G2 chose a note over a `scripts/trials/` README.
Impact: D1 becomes 40 USD all-in, warn at 32: T6 26, T2 4, workers, probes and review 8, reserve 2 (owner ruling above). T5's `Layers:` drops `scripts/trials/` (L-240). No Done-when changes. Re-confirm G2: covered by the G2-B sign-off and the budget ruling in the entry above.

### 2026-11-10 | progress | T1 built, reviewed and landed: scripts/trials
consequence · T1 · behaviour: yes (new maintainer tooling and a preflight check) · governance: none shipped (nothing under `skills/`) → one scoped `sonnet` reviewer, plus the Tier G other-G bar (must-FAIL fixture per preflight check, one real run).
Rounds (cap 2 retries, both used):
- R0: Codex built it in worktree `s171-t1`.
- R1: the coordinator's own selftest run failed (exit 2, `launch: --repo must be a repository root`). Cause: Windows 8.3 short temp paths from `realpathSync` against git's long form. Fixed, with a regression test shown red on the old code and green on the fix, at an identical `git hash-object`.
- R2: run in `main`'s tree with `node_modules`, `tsc` failed (`lib.ts(155,71)`), and `typecheck-population`'s must-FAIL proof went red, because `test/` imported `scripts/`. Fixed: nothing under `test/` imports `scripts/`, and the synthetic-repo builder moved to `scripts/trials/synthetic-repo.ts`.
Landed `e6e628e9`: 43 files, blob hashes equal to the worktree's. Checks run by the coordinator in `main`'s tree: `tsc` exit 0; `bun test` 616 pass, 0 fail; `test/trials/` 27 pass; the selftest PASS; the leak grep and the import-boundary grep both empty; a fresh clone of `main` runs the selftest to PASS; the real-artifact runs re-run from `main` give the recorded verdicts.
Review: 0 High, 2 Med, 5 Low. Both Meds are gaps in sub-check coverage the Done-when does not require: most `merge-oracle` sub-checks have no must-FAIL fixture, and the stream checker's built-in FAIL paths and operators are untested. With the retry cap reached, they are carried to close as TD rows, along with the Lows on the 5000 ms timeout and the in-tree `.scratch`. Kept, no TD: `gate-recording.ts` is the recorded-gate input M4 used, and the preflight's lone-PASS green and `0 pass, 0 fail` reading.
For the owner: `launch.ts --run` starts headless `claude` with `bypassPermissions` inside the scratch clone, guarded by the deny list, which is SPRINT-170's replay setup. The child's own Bash writes are outside any check (design, a judgment tick).
Ticked: TASK-640, all five boxes. Plan edit, logged here: T4's `Cites:` names `t3-measure2-preserved.ts` and `t4-buckets.ts` (outside the repo), added in `9a6e8fa3` after promote-check read them in TASK-645's tick evidence.

### 2026-11-10 | progress | T5 built: trial replication protocol and EPIC-024 D17
consequence · T5 · behaviour: none (a research note) · governance: yes (D17 governs future trial designs) → coordinator read-through at tier P; no separate reviewer, because the note's rules are the owner's G2-B rulings verbatim.
Built by a Sonnet worker (`247a492c`). Read-through fixes (`18676703`): one per-run rule the owner never ruled was removed (no treatment run above the slowest ordinary × 1.15), and "35 USD cap" became 40. Index regenerated in `51c38aae`. Worker checks: doc caps PASS (85 ≤ 130), 0 lines over 400, and the S8 figures re-derived by two queries that agree.
Coordinator regression, found by the worker and fixed: `a278dcf1`'s row 5 note pushed EPIC-024 line 45 past 400 characters, with no baseline row, so prose-density failed (27 pass, 1 fail). The text moved into D18 (`ae1e7e88`), and row 5 now ends `*Amended: D18*` (`9f08a0d3`, 390 bytes). prose-density: 27 pass, 0 fail.
Ticked: TASK-643, all three boxes.

### 2026-11-10 | progress | T2 and T6 free prep
T2: Codex built the treatment and seed 2.
- Seed 2 is `fixtures/hosts/t7b-host/` with `keys/t7b/` (outside the repo): an off-by-one boundary defect, with the twin changing `<` to `<=`. Its seed check PASSes; the must-FAIL control (twin broken by one line) FAILs with 3 named failures; a grep for the fixed line in the host gives 0 hits; rerun gives 5× exit 1 on the host and 5× exit 0 on the twin.
- The treatment is committed on trial branch `trial/epic-024-row9-inside` (`aa6acaa0`, rebased onto `main`): exactly `agents/reproducer.md` (byte-identical to row 9's) and a 6-line Phase 2 edit in `skills/diagnose/SKILL.md`. Never merged.
- Treatment change, owner popup, verbatim: "Drop 'last' in the skill edit (Recommended)" (question: the skill asked for "last line `reproduced: yes|no`", while the unchanged helper prints that line and then a state line). The edit now reads "the line `reproduced: yes|no`". No paid run had happened yet.
- Codex is building T2's run kit.
T6: Codex built the M1 local half, M2's keys and M3.
- M1: `prep` clone at `2305da0a` with neither merge commit present, plus the overlay `376aafe7` (`scripts/gate-remote.ts` from `main`).
- M2: `keys/s130.json` and `s130-swapped.json`. M3: `replay-prompt-130.txt` and `merger-prompt-130.txt` (differing only in the treatment paragraph), `keys/deny-t6.json`, preflight PASS on both prompts, and both dry launches at 0 spend.
- Calibration, settled by the coordinator. The literal historical tips predate the overlay, so the oracle read BAD MERGE on ancestry. The faithful reference replays each task's two commits onto the overlay and merges T1 then T2. On it, merge-oracle reads PASS with `s130.json`, and BAD MERGE with both file-set mismatches named with `s130-swapped.json`. The reference clone holds the answer commits and is calibration-only.
- Base check: `bun test test/gate-discovery/` at the overlay gives 9 pass, 1 fail, as expected (T1's target). The off-host gate on the reference's merged end state is running.
Coordinator slip, caught and reverted: a failed `git clone` left my next commands running in the main repo. The checkout, fetch and cherry-pick there all failed, but two `git config user.*` lines set a local identity ("lean-flow calibration"). It was removed at once (`git config --local --list` shows no `user.*`; `git config user.name` is Aldian Rizki), and no commit was made under it. Every command since names its repo with `git -C <path>`.

### 2026-11-10 | scope-change | T6: R2 re-ruled, no overlay, the gate by path
What broke: T6's S7 check. On the correct reference replay with the overlay, the off-host gate read `QA-CHECK: 296 pass, 2 fail`, and both FAILs came from the overlay itself: `emitter-column(POPULATION-scope)` does not cover `scripts/gate-remote.ts` at the old tree, and `layers observed` found `376aafe7` attributable to no task.
Evidence for the alternative: a reference with no overlay (the task commits replayed onto `2305da0a`, merged T1 then T2, `4b3ea800`), gated by `main`'s `scripts/gate-remote.ts` run by absolute path from inside the replay repo, read `QA-CHECK: 298 pass, 0 fail` and `bun test: 441 pass, 0 fail`. `gate-remote.ts` ships the HEAD of its working directory.
Owner popup, verbatim: "No overlay, gate by path (Recommended)".
Impact: both prompts name `bun --no-env-file D:/Project/lean-flow/scripts/gate-remote.ts` and drop the overlay. They still differ only in the treatment paragraph (diff: 2 lines), and preflight passes on each. `keys/s130.json` and `s130-swapped.json` re-base to `2305da0a` with the overlay exclude removed, edited by a script file after a `sed` pass broke the JSON. Recalibrated on the no-overlay reference: PASS with `s130.json`, BAD MERGE with both file-set mismatches named with `s130-swapped.json`. No paid run had happened. No Done-when changes.
