---
sprint: 166
slug: evidence-backed-diagrams
owner: Maintainer
last_updated: 2026-11-07
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-166 — Execution Log

> Append-only companion to [`../SPRINT-166-evidence-backed-diagrams.md`](../SPRINT-166-evidence-backed-diagrams.md). Uncapped by design:
> this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (STANDARD §9). **Never edit a past entry** — correct it with a new one.
>
> Rendered at promote, in the same commit as `plan locked`; its first entry is the `promote` entry
> carrying the signed governance checklist.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.
> Its heading names every `Tn` it changes, and every path the entry names sits in one of those tasks' `Layers:` or `Cites:`.

### 2026-11-07 | promote | plan locked, governance and G1/G2 signed, three members: the EPIC-024 rows 2 and 3 host sprint
Promote governance checklist, signed by the owner by popup:
- ☑ L-promotion: none. 272 entries; none at count 2 or more with `promoted: no`.
- ☑ TD aging: 113 open rows, none `high` (13 medium); 109 are aged 3 or more sprints and 4 are newer. Disposition: retain, no TECH-DEBT.md note (owner). Rows not re-reviewed; nothing auto-escalates to P1.
- ☑ doc-aging, §11 and §2 caps: none. `check-doc-caps.ts` printed no FAIL and no soft over-cap; four research docs print named `retained:` dispositions. Token budget ~12684 against 12691.
- ☑ epic rollup currency: EPIC-024 current (SPRINT-165 row with `close_commit` b63a9acc). ☑ epic coverage: EPIC-024 fully covered (5 open, 5 mapped). ☑ roadmap: none (no roadmap file). ☑ handoff ledger: none (no ledger file).
Composition: TASK-618 (M), TASK-619 (M), TASK-620 (S); no `L`. Waves: T1, then T2 and T3. TASK-617 hosts here but is not a member; TASK-616 and TASK-617 are untouched. Single stream; epic: EPIC-024 (owner ruling). The member files carry no `epic:` stamp. Filing commit `4118690b`; status moves in `6facb783`.
G1 and G2 signed by the owner by popup on `4118690b`, tier P for all three, with the two build notes recorded as D4 and D5. Reviews: Codex on TASK-618, at most 2 rounds (D3).

### 2026-11-08 | progress | T1 dispatched
Preflight CLEAR on `34b05c9b` (T1=0, T2=1, T3=1; `skills/diagram/*` owned T1 then T3). TASK-618 moved to `in_progress` in `1ef31c9e`.
worker · T1 · a34e7ffcc26c3523b · sonnet · none
consequence · T1 · behaviour:material · governance:low
Routing: implement directly, `/tdd` declined because skill prose has no test harness; the Done-when boxes are the manual verification, each run on real input.
Miss named: G2 was signed at promote without the builder check (`references/builder-check.md`). The worker contract's stop rule stands in for it on T1; not re-opening G2.

### 2026-11-08 | scope-change | T1 (TASK-618): box 4 drops "git-less"
What broke: TASK-618's fourth box calls `D:\Research\workdoo` git-less, but it has a `.git` (HEAD `cf41a203`), so that run read revisions from git. The premise came from intake, not from a check.
Impact: the second-repo run still tests a repo of different shape with no lean-flow path leaked; the no-git path ran on the throwaway fixture, which had no git. The run wrote nothing to workdoo, so no snapshot or revert was needed.
Re-confirm: owner ruled by popup, "Reword, then tick". Box 4 now reads without "git-less" and without "snapshot then revert"; no other box changes.

### 2026-11-08 | progress | T1 (TASK-618) done: 8 of 8 boxes
Built by the worker in `91f02165` (SKILL.md and references/evidence-record.md). Coordinator review added the edge-end rule (an edge never outranks either end), which corrected one hand-run label in the workdoo output.
Codex R1 (`91f02165`): NOT CLEAR, three Medium: a README rule contradicted `proposed`, one sentence closely paraphrased the kit, and the self-check opened 3 lines against the box's 5. Fixed in `75373f9a`, plus an ER example.
Codex R2 (`75373f9a`): three RESOLVED, no new issue; one STILL OPEN: five lines could come from one row's range. Closed by the coordinator inline in `9331060b` (one phrase, now five different rows), which also reworded the last 5-word run shared with the kit. Not re-reviewed: the two-round cap was reached.
Copied text: every 5-word run of the kit's SKILL.md and all three references compared with `skills/diagram/`: 0 shared after `9331060b`.
Ticks via `tick-box.ts`: each re-run gave check-sprint-by-reference 4 pass and check-layers-completeness 9 pass.

### 2026-11-08 | progress | T2 and T3 dispatched in parallel
Preflight CLEAR on `826ef863`. TASK-619 and TASK-620 moved to `in_progress` in `826ef863`.
worker · T2 · a860ebe0063fb1379 · sonnet · none
worker · T3 · a55141039455ea464 · sonnet · none
Isolation: shared tree, not worktrees. Their files are disjoint, but `git worktree list` shows 17 leftover agent worktrees, and the protocol says to clean those before an isolated dispatch (stale-branch reuse, #51596). Removing them is the owner's call, so this wave uses the protocol's shared-tree fallback: no git writes by either worker, and the coordinator commits each task by path.
consequence · T2 · behaviour:low · governance:low
consequence · T3 · behaviour:material · governance:low

### 2026-11-08 | progress | T3 (TASK-620) done: 3 of 3 boxes
Worker added `## Update` to SKILL.md (77 lines) and a five-step `## Updating` to references/evidence-record.md, and ran it by hand on an in-tree fixture, since deleted: one edge change touched only E1's line and row; a deleted source kept N4's row as `unknown` dated 2026-11-08; a rerun with no change gave an empty diff.
Read-through (D3), two fixes inline in `f9304241`: the worker's edit wrote SKILL.md's section sign as a lone Latin-1 byte, now UTF-8; and the hand run gave edge E2 `none found` although its own line still existed, so step 3 now says only a row whose own line is gone takes that form, and an edge into it keeps its source and drops by step 2.
Ticks via `tick-box.ts`: check-sprint-by-reference 4 pass, check-layers-completeness 9 pass.

### 2026-11-08 | correction | gate red on `2c8017eb`: commit subjects and consequence lines
The off-host gate ran `1b5ccb91` (old sha): `bun test` 589 pass, 0 fail; QA-CHECK 475 pass, 5 fail. Fixed:
- prose-density: SKILL.md's description was 504 characters on one line; shortened to 348 in `c40f231d`.
- layers observed: 13 commits after plan lock had subjects the check cannot attribute (`feat(diagram)`, `docs(task)`, `fix(diagram)`, `docs(sprint-166)`). The `sprint(NNN) Tn:` rule is in `.claude/CONTEXT.md`, which the orchestrator says to read for the applicable rules before dispatch; the coordinator skipped that read. Owner ruled by popup: rewrite the subjects. A subject-only `git filter-branch` over `34b05c9b..HEAD` left every tree identical (empty `git diff` against `backup/s166-pre-subject-rewrite`); old shas in this log and in TASK-618's box 6 were swapped for the new ones.
- review-depth vocabulary: the three `consequence ·` lines above were free text. Owner ruled by popup to correct them in place, an exception to this log's never-edit rule for lines that exist to be machine-read. They now read T1 material/low, T2 low/low, T3 material/low; the reasoning moved here: T1 is a new shipped skill (Codex review, D3), T2 is roster and doc wiring with the gate as its check, and T3 adds a step to a shipped skill (read-through, D3).
review · T1 · scoped outside review (Codex, read-only, 2 rounds: NOT CLEAR then 1 item open, closed inline) · behaviour:material · governance:low
review · T2 · coordinator read-through (session model, not the builder; one wording fix) · behaviour:low · governance:low
review · T3 · coordinator read-through (session model, not the builder; two fixes inline) · behaviour:material · governance:low
