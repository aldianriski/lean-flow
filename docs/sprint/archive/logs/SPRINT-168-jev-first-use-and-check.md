---
sprint: 168
slug: jev-first-use-and-check
owner: Maintainer
last_updated: 2026-11-08
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-168 — Execution Log

> Append-only companion to [`../SPRINT-168-jev-first-use-and-check.md`](../SPRINT-168-jev-first-use-and-check.md). Uncapped by design:
> this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (STANDARD §9). **Never edit a past entry** — correct it with a new one.
>
> Rendered at promote, in the same commit as `plan locked`; its first entry is the `promote` entry
> carrying the signed governance checklist.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.
> Its heading names every `Tn` it changes, and every path the entry names sits in one of those tasks' `Layers:` or `Cites:`.

### 2026-11-08 | promote | plan locked, three members: TASK-625, TASK-626, TASK-624
Promote governance checklist, signed by the owner by popup. Sign-off text, verbatim: "Sign, then run sprint-bulk" (question: "Do you sign it off as shown: L-294 retained, TD aging kept, TD-294/081/298/165 deleted, EPIC-024 stamped with the D12 verdict row, D1 run from a live checkout, members T1 TASK-625 · T2 TASK-626 · T3 TASK-624?"). Frontier answers, verbatim: "Stamp the epic (Recommended)" · "Yes, live checkout (Recommended)" · "Retain (Recommended)" · "Delete all four now (Recommended)".
- ☑ L-promotion: 274 entries; one at count 2 or more with `promoted: no`, L-294 (SPRINT-166, SPRINT-167). Disposition: retain. EPIC-024 row 3's finding and TASK-621 already wired the fix into the skills. Recorded on the entry, commit `56c8f1cd`.
- ☑ TD aging: 113 open rows, none `high` (13 medium), all 3 or more sprints unaddressed; newly aged since 167: the 2 rows filed at 165. Disposition: keep, nothing escalated.
- ☑ doc-aging, §11 and §2 caps: `check-doc-caps.ts` printed no FAIL and no soft over-cap; four research docs print named `retained:` or FROZEN dispositions. Token budget ~12416 against 12691. §11 TD deletion: TD-294 (resolved at 164, due at 167, missed) and TD-081, TD-298, TD-165 (resolved at 165, due at 168) deleted, ids retired, commit `7df0234f`. TD-301 and TD-302 (resolved at 167) are due at 170.
- ☑ epic rollup currency: EPIC-024 current. ☑ epic coverage: EPIC-024 fully covered (3 open, 3 mapped); this sprint touches it, so no refusal applies. ☑ roadmap: none (no roadmap file). ☑ handoff ledger: none (no ledger file).
Composition: TASK-625 (S), TASK-626 (M), TASK-624 (S); no `L`. TASK-626 depends on TASK-625, and both join, so it sits in the second wave; TASK-625 and TASK-624 are disjoint and start together. Single stream. Epic: `EPIC-024`, a § Member sprints row appended. Baseline gate on `main` at `9e6dfec8`, run off-host: QA_FULL qa-check 484 pass, 0 fail; `bun test` 589 pass, 0 fail. Status moves `5ed07a73`.
G1 and G2 are not yet signed; `gates_signed` is recorded in the sprint frontmatter only after the owner's sign-off is relayed.

### 2026-11-08 | G1 | batch scope signed for T1, T2 and T3
Signed by the owner by popup, verbatim: "Sign G1 for all three". T1 (TASK-625) and T2 (TASK-626) took the fast path (`origin: decomposer`, scope unchanged since intake). T3 (TASK-624, `origin: close-retro`) took the full checklist: size S, git worktree admin only, rulings recorded in this Log; out of scope are `D:/Project/lean-flow-worktrees/*`, `lean-flow-rc1` and deleting any branch.

### 2026-11-08 | scope-change | T3 also rules on three unregistered items in `.claude/worktrees/`
What broke: `.claude/worktrees/` holds three items that are not registered worktrees (folder `agent-ae7411f8e8e641b52`, files `qa-t4.out` and `red.txt`), and TASK-624's Done-when names only the nine. Impact: T3 lists what each holds and the owner rules on each in the same pass, under the same Negative (nothing discarded without a ruling naming it). The Done-when text is unchanged, and the path sits inside T3's `Layers:`. Owner ruling by popup, verbatim: "Rule on them in T3 too (Recommended)". G2 re-confirms it.

### 2026-11-08 | G2 | design signed for T1 and T3; T2's G2 waits on T1's API facts
Signed by the owner by popup, verbatim: "Sign G2 for T1 and T3". T2's design rests on T1's API facts section (TASK-626 § Touches: "if it is unconfirmed, G2 stops"), so its G2 runs after T1 lands.
- T1: one Sonnet worker (decision-class research; Codex has no web access) writes `docs/research/jev-use-cases.md` from the RESEARCH template, with no paid call. The API facts section also confirms or refutes A1 (Box fits both judgments at 0.7 and 0.3). Any of the four named uses whose delta is "none" stays in the shortlist, marked covered, naming the surface. `docs/knowledge-index.md` is regenerated; it is excluded from attribution (`isExcludedCommitted`), so `Layers:` is unchanged.
- T3: inline, J2. A patch of each worktree's uncommitted changes is saved to the scratchpad before removal. Rulings are applied with `git worktree remove --force`, and branches are kept. "Salvage" means keep the worktree and file a close-Retro follow-up naming the files. The Results commit lands while the task sits in `in_progress/`, before the move to `done/`.
- builder-check · T1 · 3 contradictions · 4 questions · settled by design fixes (A1 check added; the four named uses always placed; `knowledge-index` excluded by `isExcludedCommitted`, scripts/lib/check-layers-observed.ts:205); the rest factual, answered from the repo
- builder-check · T3 · 0 contradictions · 4 questions · settled: Results commit precedes the `done/` move; salvage meaning stated; the unregistered folder is empty (4.0K, no entries); patch backup added
- consequence · T1 · behaviour: none (docs) · governance: none → self-review plus coordinator read
- consequence · T3 · behaviour: none (git admin) · governance: none → self-review

### 2026-11-08 | scope-change | T3 `Layers:` moves to its own task file
What broke: T3's only token, `.claude/worktrees/`, is git-ignored (`.gitignore:16`). The dead-token rule (TD-177, `check-layers-observed.ts` lines 458-475) FAILs a finished task whose token matches no path at HEAD or in `plan_commit..HEAD`, so the frozen Plan would redden at close. Impact: T3's `Layers:` becomes `docs/work/in_progress/TASK-624-review-the-nine-leftover-agent-worktrees.md`, the file its ruling commit touches. The `.claude/worktrees/` token is dropped. Done-when is unchanged. Re-confirmed in the G2 signed above.

### 2026-11-08 | T3 done | twelve items ruled remove, branches kept
Inventory: nine registered worktrees, one empty unregistered folder, and two stray gate-output files. Two of the nine held only line-ending noise (empty `git diff`). The rest held WIP from closed sprints 107 to 135, on bases far behind main. Each worktree's diff and untracked files were saved to the session scratchpad first. The owner ruled in four groups, verbatim: "Remove all three (Recommended)" · "Remove all five (Recommended)" · "Remove both (Recommended)" · "Remove both (Recommended)". Applied with `git worktree remove --force`. `git worktree list` now shows no `.claude/worktrees/` entry, and the 48 `worktree-agent-*` branches remain, including the three holding commits not on main (1bef2312, 88c45036, 40c1d831). Rulings are in TASK-624 § Results (977b8f72), moved to done in 77945961.
- consequence · T3 · behaviour: none · governance: none → self-review only

### 2026-11-08 | T1 done | Jev use cases mapped; A1 refuted as worded, Noul replaces Box
Worker: Sonnet, one pass, no paid call, no key use. `docs/research/jev-use-cases.md` (61 lines, doc-caps PASS) and the regenerated `docs/knowledge-index.md` were committed in 2dcd54d4. Shortlist by delta: the Done-when judge first, then a cheap A/B judge, concept match, watcher, and router (covered by the tier table). API facts: `POST https://api.typesafe.ai/v1/systemone`, Bearer auth, `model: jev-1.14.0`. Box is an image-region type, so the sprint's A1 is refuted as worded, and T2 uses Noul (P(yes), 0 to 1). The 0.7/0.3 thresholds are a vendor-skill default, not on a docs page, and T2's trial settles them. All Done-when ticks are judgment ticks from the coordinator's read (01323bde); moved to done in f273b62c. The doc ranks the A/B judge above concept match, the reverse of the TASK-627 → TASK-628 chain; this is raised with the owner at T2's G2.
- consequence · T1 · behaviour: none (docs) · governance: none → self-review plus coordinator read

### 2026-11-08 | G2 | T2 design signed; the sprint's G1 and G2 are now complete
Signed by the owner by popup, verbatim: "Sign; one retune allowed (Recommended)". Design:
- A single Bun file using plain fetch to `POST https://api.typesafe.ai/v1/systemone` with `jev-1.14.0`. It asks Noul questions rather than Box (A1 refuted by T1): `observable` on every box, and `concrete_negative` on a Negative box.
- Scores ≥0.7 pass and ≤0.3 fail. A fail on `observable` is finding UNOBSERVABLE; a fail on `concrete_negative` is NEGATIVE-VAGUE.
- Dry run is the default and prints an `estimate:` line. Under `--run`, the budget check and then the `jev_key` check happen before any fetch, each stopping with exit 2.
- No `*.test.ts`, so it stays out of `bun test` and the gate.
- The fixture is at `test/fixtures/jev-done-when/sample-task.md`; its control box checks the dry-run `estimate:` line.
- Retune policy: the coordinator may reword the two questions once if the paid fixture run misses. Thresholds stay fixed, and a second miss goes to the owner.
- Builder: Codex in a worktree with no network. A Sonnet reviewer checks it, with a cap of 2 rounds. The coordinator runs the paid runs.
- The real-files run exiting 1 is expected and recorded.
Backlog ruling, verbatim: "Leave it for /triage (Recommended)". The research ranks TASK-628 above TASK-627; this goes to the close Retro, and /triage re-orders it.
- builder-check · T2 · 3 contradictions · 4 questions · settled: the Layers wording is fixed (files are new); the control box now names the dry-run `estimate:` line instead of an undefined `--help`; one table row per box is accepted; the retune owner is ruled; spend falls back to `(estimated)`; the exit 1 on real files is expected; `--no-env-file` is confirmed at scripts/gate-remote.ts:245
- consequence · T2 · behaviour: new maintainer script, advisory · governance: none (outside the gate) → one scoped Sonnet reviewer

### 2026-11-08 | T2 done | Jev judge built, fixture proven, real run recorded
Codex built it in worktree `s168-t2` (no network). Codex used one build pass plus one retry; the reviewer used two rounds, within the cap of 2.
- Review round 1 had no High or Medium findings. The two worst Lows were a run failure sharing exit 1 with a finding, and an untrimmed key. One builder retry fixed both: a run failure now exits 3 and is never scored, and the key is trimmed.
- Round 2 was clean. Landed in 66d4be0f, with blob hashes equal to the worktree's. The worktree and its branch were removed.
- Paid fixture run: exit 1, `UNOBSERVABLE=2; NEGATIVE-VAGUE=1`, control box pass (0.97); no retune needed. The summary line prints both finding names even at 0, so the counts are the proof.
- Real run: 108 files, 0 skipped, 395 boxes: 166 pass, 229 unsure, 9 UNOBSERVABLE, 0 NEGATIVE-VAGUE; exit 1, as expected.
- Spend: 0.000046 + 0.007005 = 0.007052 USD cumulative, of the 5 USD cap.
- Finding for the Retro: 58% of real boxes land in the 0.3-0.7 band at the vendor default thresholds, so the judge is mostly undecided on this corpus. That is a measurement for TASK-627's design.
- Results and ticks: 943e5680; moved to done in d3bd1c9d.
- consequence · T2 · behaviour: new advisory maintainer script · governance: none (outside the gate) → one scoped Sonnet reviewer, 2 rounds

### 2026-11-08 | system-verify | gate red at close: 493 pass, 3 fail; bun test 589/0
Off-host QA_FULL gate on f90c90f8. All three FAILs trace to this sprint's own work, none to EPIC-024 rows 1 and 2:
- prose-density on the T1 research doc: two lines over 400 characters.
- emitter-column POPULATION-scope: the T2 script is in neither the scan nor the out-of-scope list. The G2 claim that no leg inventories the scripts folder was wrong; it grepped only the gate shell script.
- scope-change-outside-layers: two of this Log's T3 entries named paths missing from T3's Plan lines.
Owner ruling by popup, verbatim: "Apply all three, rerun gate (Recommended)". The fixes follow in the next entries and commits, then the gate reruns.

### 2026-11-08 | scope-change | T2 `Layers:` gains `evals/run-emitter-column-fixtures.ts`
What broke: that harness's population scan requires every script to be scanned or listed out-of-scope, and `scripts/jev-done-when.ts` is neither. Impact: one OUT_OF_SCOPE row is added (maintainer-only, run by hand, never a gate checker), mirroring the existing spend-report row. The T2 Done-when is unchanged. Owner ruling as above.

### 2026-11-08 | scope-change | T3 `Cites:` gains the four paths its Log entries named
What broke: the T3 entries named `.gitignore`, `scripts/lib/check-layers-observed.ts`, `.claude/worktrees/qa-t4.out` and `.claude/worktrees/red.txt`, which were absent from T3's Plan lines. Impact: all four are added to T3's `Cites:` as read-only references. `Layers:` and Done-when are unchanged. Owner ruling as above.

### 2026-11-08 | system-verify | gate green at close: qa-check 495 pass, 0 fail; bun test 589/0
Off-host QA_FULL gate on 7b81c15e, after the three fixes (9cdd668e, de83e68c, 7b81c15e). D12 reading for the close: three close-time gate failures, all traced to this sprint's own work (a research doc's line length, a new script missing from a scan list, and Log entries naming undeclared paths). None traced to EPIC-024 rows 1 and 2.
