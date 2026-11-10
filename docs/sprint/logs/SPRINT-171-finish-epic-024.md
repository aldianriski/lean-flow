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
