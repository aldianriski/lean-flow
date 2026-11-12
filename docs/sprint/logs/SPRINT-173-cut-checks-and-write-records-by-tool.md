---
sprint: 173
slug: cut-checks-and-write-records-by-tool
owner: Maintainer
last_updated: 2026-11-12
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-173 — Execution Log

> Append-only companion to [`../SPRINT-173-cut-checks-and-write-records-by-tool.md`](../SPRINT-173-cut-checks-and-write-records-by-tool.md). Uncapped by design:
> this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (STANDARD §9). **Never edit a past entry** — correct it with a new one.
>
> Rendered at promote, in the same commit as `plan locked`; its first entry is the `promote` entry
> carrying the signed governance checklist.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.
> Its heading names every `Tn` it changes, and every path the entry names sits in one of those tasks' `Layers:` or `Cites:`.

### 2026-11-12 | promote | plan locked, 8 members: TASK-651 to 658
Owner request, verbatim: "approve", on the eight-task Sprint A draft (filed `f7c152af`), after the owner chose "Two sprints (Recommended)" for EPIC-025. The coordinator then ran `/lean-flow:lean-doc-generator promote`.
Promote governance checklist, signed by the owner by popup. Answers, verbatim: checklist "Sign it (Recommended)" · members "All 8 in waves (Recommended)".
- ☑ L-promotion: 293 entries; every entry at count 2 or more is `[status: promoted]` (an awk pass keyed on `## L-` headings, cross-read against the `count:` lines). Disposition: none needed.
- ☑ TD aging: 120 rows, 113 open, none `severity: high`; nothing escalated. The 7 `resolved` rows were resolved on 2026-11-11, under three sprints ago, so §11 keeps them.
- ☑ doc-aging, §11 and §2 caps: `check-doc-caps.ts` exit 0, no soft over-cap. §11 closed task files: all 70 stamped files from SPRINT-170 or earlier still have a live citation (a whole-word `git grep` over tracked `.md` files, history excluded per §11), so none is due. 23 unstamped files skipped.
- ☑ epic rollup currency: EPIC-025's SPRINT-172 row carries `51b651fd`, its header is dated 2026-11-12, the close date, and the ticked condition names SPRINT-172.
- ☑ epic coverage: EPIC-025's 5 open conditions are all mapped. Conditions 2 to 5 → TASK-651 to 658; condition 6 → `next slice:` workdoo sprint (Sprint B). No override.
- ☑ roadmap coverage: none (no roadmap file). ☑ handoff ledger: none (no ledger file).
Composition: 8 members, none `L`. In-sprint edges: T3 on T1 (shared `scripts/qa-check.sh`); T5 on T1 and T3; T6 and T7 on T2 and T3; T8 on all. No stream. Epic: `EPIC-025`, a § Member sprints row added and `member_sprints` extended. Status move at `37a48bec`.
Budget: one paid API call, T4's Jev run, at most 1.00 USD (D4).
Baseline gate on `main` at `f7c152af`, run off-host: `QA_FULL=1` via `bun --no-env-file scripts/gate-remote.ts`, exit 0: qa-check 513 pass, 0 fail; `bun test` 618 pass, 0 fail.
Pre-freeze edit: TASK-658's `## Why` now names EPIC-025 condition 5, which the epic amendment at `f7c152af` made the release condition. No Done-when changed.
G1 and G2 are not yet signed; `gates_signed` goes in the sprint frontmatter only after the owner's sign-off is relayed verbatim.

### 2026-11-12 | g1-g2 | G1 and G2 batch signed, T1 to T8
Owner popup, verbatim: "Sign G1+G2, build (Recommended)". G1 took the fast path for all eight (`origin: decomposer`, scope unchanged since the intake approval; promote only stamped `sprint:` and renumbered TASK-658's epic condition).
G2: dispatch preflight CLEAR at `b1ed060b` (waves T1=0 T2=0 T4=0 T3=1 T5=2 T6=2 T7=2 T8=3; `scripts/qa-check.sh` T1 → T3 → T5, `evals/README.md` and `docs/QA.md` T1 → T5). Builder Codex in a worktree, one scoped Sonnet reviewer, cap 2 rounds, at most two builders at once (D2).
Pre-cut census for T1 and T5: the off-host qa-check log at `f7c152af` (513 pass, 0 fail, 538 PASS/FAIL lines) is saved as the base of the two-query check.
builder-check · T1 · 5 contradictions · 5 questions · settled: `check-approval-envelope.sh` is deleted (its only live users are comments and the owner's two allow entries); three comment sites join Layers (scope-change below); box 3's exclusions by owner ruling; the `script not found at` message confirmed in qa-check.sh
builder-check · T2 · 3 contradictions · 5 questions · settled: both sides of a `git mv` admitted; the subject and `Task:` trailer branches both changed; one L-258 fixture case carries both commit shapes so the seed reddens exactly it; the harness count is a floor; findings pinned (`changed by a task that never declared it`, `member-out-of-layers`)
builder-check · T3 · 3 contradictions · 5 questions · settled: box 2 reworded by owner ruling (scope-change below); QA_FULL=1 runs the opt-in list; one refusal case per enumerated field; formats read from the parsing checks; realpath containment with a traversal case; a wrong-box tick is a box number past the task's count
builder-check · T4 · 2 contradictions · 5 questions · settled: the sample is all 370 archived consequence lines with the recorded class withheld from Jev; abstain on T5 counts as not flagged; the guard prints `spend: 0 USD (no call made)`; one call per item; the builder writes the advisory header
builder-check · T5 · 4 contradictions · 4 questions · settled: five comment sites join Layers and `evals/fixtures/night-run-reaper/` leaves it (a kept harness reads it); orphan dirs `sprint-close`, `system-verify` and `night-run-gate-exceptions` go with the three named; T3's wrong-box case is re-run after T5
builder-check · T6 · 3 contradictions · 5 questions · settled: T6 names five commands and T7 names `scope-change`; writer mentions go in the references so SKILL.md nets zero lines or fewer; R19's retry lines, R27's guard run and R14's no-git fallback stay; a grep for a `low` default added
builder-check · T7 · 3 contradictions · 5 questions · settled: SKILL.md (140 lines) nets zero or fewer; `surprise` stays a recognised event and only its separate entry folds into progress; Files Changed stays, filled from the accepted diff; R44's `close_commit` names the commit the close gate ran on and is written in the close commit (no check reads it otherwise)
builder-check · T8 · 5 contradictions · 4 questions · settled: diff base `6444f83e` (v2.22.0 has no tag); 2.21.0 rotates to `docs/changelog/`; footer version and date; the maintainer-only `[Unreleased]` lines stay; skills badge 15 → 16; the coordinator runs the Codex review and checks `git tag` before and after

### 2026-11-12 | scope-change | T1, T3 and T5 (TASK-651, TASK-653, TASK-655): Layers for comment sites, two Done-when boxes reworded
What broke: the builder checks found live comments naming cut files outside T1's and T5's Layers, a fixture dir T5 declared that a kept harness still reads, and two frozen Done-when boxes that cannot pass as written.
Impact:
- T1 Layers gain `scripts/night-run.sh`, `skills/orchestrator/references/night-run.md` (owned T1 → T6 through T3) and `evals/run-qa-budget-fixtures.sh` (comment line only; its test-input string stays).
- T5 Layers gain `evals/doc-caps.test.ts`, `evals/run-doc-caps-fixtures.sh`, `scripts/lib/check-night-run-rollup.ts`, `scripts/lib/check-night-run-rollup.sh` and `evals/run-night-run-rollup-fixtures.sh`, all comment sites. The night-run-reaper fixture dir leaves T5's Layers, because a kept harness reads it.
- TASK-653 box 2: SPRINT-171's log records T5 and T3 as `governance:high` and only T1 as `behaviour:material`. The box now says T5 and T3 FAIL `review-depth-governance-absent` and T1 FAILs `review-depth-material-absent`. T3's Plan Acceptance follows.
- TASK-651 box 3: the grep now excludes archives, logs, changelogs, fixture copies of old records, and test-input strings that name no file.
Re-confirm G2: owner popup, verbatim: TASK-653 "Reword to match the log (Recommended)" · TASK-651 "Exclude those three (Recommended)" · G2 "Sign G1+G2, build (Recommended)".

### 2026-11-12 | execute | T2 built, reviewed and committed (TASK-652)
Codex built it in worktree `s173-t2` (one pass, about 115k tokens), uncommitted; the coordinator committed it as `2ce2d615` with the knowledge index regenerated. Checker hash `ddf4846e` matches the reviewed tree.
consequence · T2 · behaviour:material · governance:high
review · T2 · scoped-reviewer · behaviour:material · governance:high
Reading: one scoped Sonnet reviewer, one round, CLEAR; it re-ran `layers-observed.test.ts` (47 pass, 0 fail, 112 expects). Three Lows kept by coordinator ruling: other `Tn` subject shapes also get the own-file exemption, still bounded by `Cites:` and membership; the folder segment is any one directory; the ADR's SPRINT-173 carve-out restates D3.
Ticked boxes 1, 2 and 4. Box 3 waits for the off-host full gate.

### 2026-11-12 | scope-change | T1 (TASK-651): merge-check drops its prose-density leg with the gate's
What broke: the off-host gate at `8fe2123a` (T1 committed) went red on one test. `evals/merge-check.test.ts` pins each of `scripts/merge-check.ts`'s legs to the gate's own block, and T1 cut the gate's prose-density leg (G0268). The workflow-command harness failed on the same test.
Impact: T1 Layers gain `scripts/merge-check.ts`, `evals/merge-check.test.ts` and `skills/orchestrator/references/dispatch.md` (owned T1 → T6 through T3). merge-check runs four legs and keeps mirroring the gate; the cases that used prose-density as their example leg move to layers-completeness; dispatch.md says four legs. No Done-when changes.
Re-confirm G2: owner popup, verbatim: "Drop it from merge-check too (Recommended)". Prose density is now a manual check (`scripts/lib/check-prose-density.ts` stays).

### 2026-11-12 | scope-change | T1 (TASK-651): the workflow-command harness's merge-check floor follows the four legs
What broke: the gate rerun at `694c4564` is red on one leg: `evals/run-workflow-command-fixtures.ts` holds a live-case floor of 24 for `evals/merge-check.test.ts`, and dropping the prose-density leg removed two cases (its red row and its wiring row), leaving 22. `bun test` is green (621 pass, 0 fail).
Impact: T1 Layers gain `evals/run-workflow-command-fixtures.ts` (also T5's, which deletes it; owned T1 → T5). The floor moves to 22 with the reason in a comment. No Done-when changes.
Re-confirm G2: not needed; this follows the owner's ruling "Drop it from merge-check too (Recommended)", whose removed cases the floor counted.

### 2026-11-12 | execute | T1 built, reviewed and committed (TASK-651)
Codex built it in worktree `s173-t1` (one pass, about 125k tokens): 9 legs and 7 harnesses out, 6 scripts and 120 fixture files deleted. The coordinator committed it as `8fe2123a`, then two gate follow-ups under scope-changes: `694c4564` (merge-check four legs) and `606a7ec1` (its live-case floor 24 → 22).
consequence · T1 · behaviour:low · governance:high
review · T1 · scoped-reviewer · behaviour:low · governance:high
Reading: one scoped Sonnet reviewer, one round. No High. One Medium fixed by the coordinator: the night-run reference and `night-run.sh` still implied a checker names the missing envelope dimension; both reworded. One Low fixed: a `sprint-members.ts` comment still named `check-task-origin`. The emitter-column control repoint was judged not vacuous.
Census: query A, the pre-cut log (`f7c152af`, 538 names) against the green log: only cut-row names vanish (120 task-origin, 120 work-type, 27 prose-density, 4 research-archive, 2 handoff-state, 1 qa-budget-default, 1 archive-predicate, 7 harness lines) plus count drift. Query B, the registry diff: exactly the 7 harnesses.
Negative: throwaway commit `71c2f8e6` re-adding `run-task-origin-fixtures.sh` made the gate FAIL `eval harness run-task-origin-fixtures.sh: script not found at evals/run-task-origin-fixtures.sh`; the worktree and branch were deleted.

### 2026-11-12 | execute | T4 built, run once and dropped (TASK-654)
Codex built `scripts/jev-consequence.ts` in worktree `s173-t4` (about 79k tokens). The coordinator excluded the 8 records whose sprint Plan has no matching block (SPRINT-091 and 103 `T0`), counted rather than judged, and committed it as `c2385c74`.
consequence · T4 · behaviour:low · governance:low
review · T4 · self-review · behaviour:low · governance:low
Paid run, once, `--budget-usd 0.01`: 362 judged, spend 0.005391204 USD (reported input usage). SPRINT-171 T5 scored 0.65, an abstain, so it was not flagged; 52 material or governance-high records scored at or below 0.3. Verdicts: review 48, abstain 224, self-review 90.
Ruling by the keep rule (EPIC-025 D7): dropped. The script is deleted at `de9b2d35`; Jev stays out of review classification. Total Jev spend for EPIC-025: 0.0054 USD.

### 2026-11-12 | progress | gate green after wave 1 (T1, T2, T4)
Off-host QA_FULL at `de9b2d35`: `QA-CHECK: 247 pass, 0 fail`; `bun test` 621 pass, 0 fail. Earlier runs at `8fe2123a` and `694c4564` were red on merge-check's pinned prose-density leg, then on its case floor; both fixed under the scope-changes above.
Ticked: TASK-651 5/5, TASK-652 4/4, TASK-654 4/4.

### 2026-11-12 | execute | T3 built, reviewed and committed (TASK-653)
Codex built `scripts/lib/record-line.ts` and its harness in worktree `s173-t3` (one pass, about 109k tokens). The coordinator applied the review fixes and committed it as `84e938d1`.
consequence · T3 · behaviour:material · governance:high
review · T3 · scoped-reviewer · behaviour:material · governance:high
Reading: one scoped Sonnet reviewer, one round. No High; the threat checks held (no default path, realpath containment, exact regex match, real replay). Fixed: the Medium, a default `--root` at the script's own repo (the plugin cache for a consumer), now `process.cwd()` as in `tick-box.ts`; two Lows, refusal cases now assert the `record-line: <field>:` prefix (or `tick-box:` for the delegated tick) and `Tn` refuses a leading zero. Kept: the `tick-box.ts` child spawn with `--no-env-file`.
Gate: off-host QA_FULL at `84e938d1`: `QA-CHECK: 248 pass, 0 fail`; `bun test` 621 pass, 0 fail. Ticked TASK-653 4/4.
