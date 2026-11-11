---
sprint: 172
slug: process-cost-census
owner: Maintainer
last_updated: 2026-11-11
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-172 — Execution Log

> Append-only companion to [`../SPRINT-172-process-cost-census.md`](../SPRINT-172-process-cost-census.md). Uncapped by design:
> this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (STANDARD §9). **Never edit a past entry** — correct it with a new one.
>
> Rendered at promote, in the same commit as `plan locked`; its first entry is the `promote` entry
> carrying the signed governance checklist.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.
> Its heading names every `Tn` it changes, and every path the entry names sits in one of those tasks' `Layers:` or `Cites:`.

### 2026-11-11 | promote | plan locked, 4 members: TASK-647 to 650
Owner request, verbatim: `/lean-flow:lean-doc-generator promote`, after the owner typed "approve" on the four-task census draft (filed `4abe8b72`).
Promote governance checklist, signed by the owner by popup. Answers, verbatim: checklist "Sign + delete all four (Recommended)" · EPIC-025 "Activate with those marks (Recommended)" · members "All four, in order (Recommended)".
- ☑ L-promotion: 292 entries, 64 `[status: active]`, all at count 1. The ten lines at count 2 or more each sit in a `[status: promoted]` entry (L-249 to L-294). A first scan keyed on `###` matched nothing, a wrong selector; the re-run on `## L-` headings and a plain `count:` grep mapped line by line agree. Disposition: none needed.
- ☑ TD aging: 113 open rows, 0 `high`; nothing escalated. Seven rows (TD-281, 284, 286, 289, 290, 292, 303) went `resolved` on 2026-11-11 with the A/B removal, so §11 deletes them three sprints on, not now.
- ☑ doc-aging, §11 and §2 caps: `check-doc-caps.ts` exit 0, 99 PASS, no soft over-cap. CHANGELOG rotation current (v2.22.0 and v2.21.0 inline). Research: the four `superseded` notes in `docs/research/` are each still cited by a live file, so they stay.
  §11 closed task files: of 67 stamped files from SPRINT-169 or earlier (23 unstamped, skipped), four are due with no live citation: TASK-582, TASK-584, TASK-585 and TASK-588. Their remaining citations are all history (archives, `docs/LEARNINGS.md`, other closed task files), checked by a second `git grep -w` over every tracked file.
  The positive control TASK-626 still shows its live citations (`docs/architecture/overview.md`, `docs/research/jev-use-cases.md`, TASK-627). Disposition: deleted in this commit, ids retired.
- ☑ epic rollup currency: no epic was `active` before this promote; EPIC-005 is `proposed`.
- ☑ epic coverage: this promote activates EPIC-025, so it is judged as active. Condition 1 → TASK-648, TASK-649, TASK-650; conditions 2 to 6 → `next slice:` cuts and skill edits · record writers · Jev trial · measuring sprint · release and workdoo run. Fully covered (6 open, 6 mapped); no override.
- ☑ roadmap coverage: none (no roadmap file). ☑ handoff ledger: none (no ledger file).
Composition: 4 members, none `L`. Edges: T2 (TASK-648) on T1 (TASK-647), T3 (TASK-649) on T2, T4 (TASK-650) on T3, all in-sprint. No stream. Epic: `EPIC-025` set to `active`, stamped on the sprint, a § Member sprints row added, `member_sprints` extended. Status move at `b564a7e7`.
Budget: no paid API call (D3).
Baseline gate on `main` at `b564a7e7`, run off-host: `QA_FULL=1` via `bun --no-env-file scripts/gate-remote.ts`, exit 0: qa-check 503 pass, 0 fail; `bun test` 618 pass, 0 fail.
G1 and G2 are not yet signed; `gates_signed` goes in the sprint frontmatter only after the owner's sign-off is relayed verbatim. All four tasks are `tier: P`.

### 2026-11-11 | g1-g2 | G1 and G2 batch signed, T1 to T4
Owner popup, verbatim: "Sign G1+G2, run it (Recommended)". G1 took the fast path for all four (`origin: decomposer`, scope unchanged since the intake approval; promote only stamped `sprint:`).
G2: shared file `docs/research/process-cost-census.md`, owned in order T1, T2, T3, T4, each on the previous commit; the coordinator owns the Log, ticks, moves and the knowledge-index regeneration. Builder Codex in a worktree, one scoped Sonnet reviewer, cap 2 rounds (D2). No `Layers:` pruning.
Residual grill, owner popup, verbatim: "Unknown, you rule (Recommended)". A check that existed before SPRINT-045 (no archived log covers its earlier history) with no real defect since is proposed `keep (unknown, owner rules)`; one added at SPRINT-045 or later with zero real defects is proposed `cut`.
builder-check · T1 · 0 contradictions · 6 questions · all factual, settled in the design: first-run rule (first close-time gate on the sprint's own tree, trial arms excluded), |x-171|/171 per metric, per-metric median, members under 5 flagged, one pattern for both queries, Verdict line document-level
builder-check · T2 · 2 contradictions · 6 questions · design fixed: every `# ---` section is a row (suffixed, duplicate labels by line number, retired, unnumbered); two independent enumerations (printed lines to templates; source templates seen or conditional); consumer guard = ADR-050 consequential; fixture search recorded; a non-empty diff blocks the pin
builder-check · T3 · 3 contradictions · 5 questions · design fixed: Negative check reworded, unknown sits inside keep, counting unit stated, real defect defined as the artifact being wrong; one intent question ruled by the owner (history window, above)
builder-check · T4 · 0 contradictions · 6 questions · all factual, settled: check-row columns kept identical with extras after, one row per step kind, all archived logs for entry types, each non-work commit attributed to one step so costs sum to T1's totals, Negative widened to spec and test

### 2026-11-11 | execute | T1 built, reviewed and ticked (TASK-647)
Codex built `docs/research/process-cost-census.md` § Baseline in worktree `s172-t1` (one pass, about 113k tokens), uncommitted; the coordinator committed it as `6d6f36e2` with the knowledge index regenerated.
Figures: SPRINT-169 13 total, 12 non-work, 1 member (12.0 per member, flagged under 5 members); SPRINT-170 48, 38, 7 (5.4); SPRINT-171 59, 43, 7 (6.1). First close-gate run FAILs: 1, 3, 12. SPRINT-169's non-work per member is 95.35% off SPRINT-171's, above one third.
Blocker relayed by popup. Owner ruling, verbatim: "Median of three (Recommended)". The baseline is 43/7 non-work commits per member (target at most 43/14) and 3 FAILs (target at most 1); SPRINT-171's 12, run before TASK-644 reached `done/`, counts as its first close run.
consequence · T1 · behaviour:low · governance:low
review · T1 · scoped · behaviour:low · governance:low
Reading: one scoped Sonnet reviewer, one round, CLEAR. It re-measured every figure in bash from the archived frontmatter and logs and found one Low (the branch name), which is moot: the worktree was created as branch `s172-t1`.

### 2026-11-11 | scope-change | T2, T3 and T4: the census tables move to a research appendix
What broke: T2's 103-row inventory made `docs/research/process-cost-census.md` 333 lines, over its §2 cap of 130 (soft, ADR-020), and the doc-caps leg reports it as OVER-CAP (soft). T3 and T4 add more columns and rows.
Impact: the tables move to `docs/research/logs/process-cost-census.md`, the §2 home for a research question's measurement rounds. The decision doc keeps the question, the baseline summary and the verdict under 130 lines. T2, T3 and T4 each gain that appendix in `Layers:`; no Done-when changes, since each names "the census", not a file.
Re-confirm G2: owner popup, verbatim: "Appendix in research/logs (Recommended)".

### 2026-11-11 | execute | T2 built, reviewed and ticked (TASK-648)
Pin `e29815a9`: `git diff --stat ec4ee660..e29815a9 -- scripts evals skills spec test` is empty. The coordinator ran the off-host gate there (`bun test` 618/0, QA-CHECK 509/0), then `QA_FULL=1 sh scripts/qa-check.sh` on the same VPS checkout, and handed the 683-line log to the builder as untracked input.
Codex built the inventory in worktree `s172-t2` (about 464k tokens, then one retry of about 129k). Result: 103 rows (41 sections and blocks, 62 harnesses). 570 printed names and 236 source templates reconcile with zero gaps. Committed `8b58c573`.
Review round 1, scoped Sonnet: no High; two Medium (consumer-guard flags inconsistent; G1447's basis weak) and two Low (fixture notes).
The coordinator ruled the consumer-guard rule: yes only when the conformance engine runs the check, a shipped skill tells the adopter to run the script, or it is the README footer or manifest lockstep. A skill naming a checker only as the reader of a record is not a mechanism. The retry applied it to every row: 36 yes became 23.
Placement: the doc reached 333 lines against its cap of 130 (soft), so the tables moved to `docs/research/logs/process-cost-census.md` by owner ruling (scope-change above); the decision doc is 99 lines.
consequence · T2 · behaviour:low · governance:low
review · T2 · scoped · behaviour:low · governance:low
Reading: round 2 CLEAR, within the cap of 2. The reviewer's own matcher mapped 566 of 570 lines to exactly one row; the other 4 were its own placeholder misses, belonging to G1015.
Census evidence for T4: my first scope-change draft above FAILed `--scope-change` only because its prose named a checker file declared on no task. Rewording fixed it, so it was a wording-only FAIL.
