---
sprint: 174
slug: review-rules-and-cross-model-route
owner: Maintainer
last_updated: 2026-11-13
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-174 — Execution Log

> Append-only companion to [`../SPRINT-174-review-rules-and-cross-model-route.md`](../SPRINT-174-review-rules-and-cross-model-route.md). Uncapped by design:
> this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (STANDARD §9). **Never edit a past entry** — correct it with a new one.
>
> Rendered at promote, in the same commit as `plan locked`; its first entry is the `promote` entry
> carrying the signed governance checklist.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
### 2026-11-13 | promote | plan locked, 2 members: TASK-659, TASK-660 (3 plan steps)
Owner request, verbatim: "we focus to workflow code first ignore the workdoo". Nothing in this sprint touches workdoo; TASK-489 is not pulled. The coordinator ran `/lean-flow:lean-doc-generator promote`; a worker did the scan and draft, then the writes after sign-off.
Size-L override, owner popup, question "TASK-660 (cross-model route) is size L after the merge, and promote splits an L before rendering the sprint. How do we handle it?", answer verbatim: "Keep one task, two plan steps (Recommended)". The option read: "Record an owner override: TASK-660 stays one task file, and the sprint Plan carries it as two steps (review half, then build-and-diagnosis half), each reviewed on its own. No task file is rewritten." It covers TASK-660 only.
Promote governance checklist, signed by the owner by popup. Question: "Sign off the promote governance checklist for SPRINT-174 as shown (learnings: none due; tech debt: keep all 115 open, no sweep; epic coverage: EPIC-025 release condition listed, not blocking)?" Answer, verbatim: "Sign off". It covers the items below and the sprint draft: SPRINT-174, members TASK-659 and TASK-660, Plan T1 to T3, no epic, no stream.
- ☑ L-promotion: 295 entries, 66 active; all 22 entries at count 2 or more are `[status: promoted]` (an entry-block parse, cross-read against the `count:` lines). Disposition: none needed.
- ☑ TD aging: 115 open rows, 113 aged three sprints or more, 2 unaged (TD-310, TD-311); none `severity: high`, so nothing escalated. 9 open rows mention `review-scoping`, `dispatch.md` or `builder-check` (TD-047, 052, 059, 159, 246, 260, 264, 271, 272); no re-review sweep this promote. The 7 `resolved` rows are dated 2026-11-11, with two sprints closed since, so §11 keeps them (earliest due at the SPRINT-175 promote).
- ☑ doc-aging, §11 and §2 caps: `check-doc-caps.ts` exit 0, 101 PASS, 0 FAIL, recorded carries only. CHANGELOG rotation not due. §11 closed task files: 86 eligible, 84 still cited; TASK-601 (cancelled 2026-11-04) and TASK-609 (cancelled 2026-11-07) had no live citation (a whole-word scan and a `git grep -w`, history excluded), and the owner chose "Delete both (Recommended)". Both are deleted in `d8f1428b`; the check was re-run at HEAD `8d96c88f` first and still found no citation. 10 unstamped `done/` files skipped, close date unknown.
- ☑ epic rollup currency: EPIC-025's two member rows carry `51b651fd` and `b114943b`, the header is dated 2026-11-12, and the ticked conditions name their closing sprints. None.
- ☑ epic coverage: EPIC-025 has 2 open conditions. The release condition ends `→ TASK-658`, which is in `done/`, so it reads uncovered (stale: TASK-658 done); the workdoo condition → `next slice: workdoo sprint (Sprint B)` is covered. The refusal rule does not apply: it binds only an active epic this sprint touches (`epic:` frontmatter or a member's `epic:` stamp), and neither member carries one. Listed, not blocking, no override; the real action is the owner's push of v2.23.0.
- ☑ roadmap coverage: none (`docs/product/roadmap.md` is absent). ☑ handoff ledger: none (no ledger file).
Sprint number: 174, the maximum in use plus one. Three queries varying the selection all gave 173: the sprint directories (active, archive, logs), the `sprint(N)` commit subjects, and the `sprint:` stamps under `docs/work`; `.claude/worktrees/` excluded.
Composition: 2 members, none `L` at the Plan level (T2 and T3 are M, TASK-660 under the D2 override). In-sprint edges: T2 on T1, T3 on T2; TASK-660 depends on TASK-659, which joins in an earlier wave. No stream, no epic. Status moves: the §11 prune at `d8f1428b`, the move to `todo/` at `b53be0f2`.
Box assignment for TASK-660's Done-when (a box is ticked whole): T2 owns the three Review boxes and the negative for no policy and empty output; T3 owns the Build and diagnosis boxes, both Opt-in and wiring boxes, the four-exercise Proof box, the consumer check, the permission and dirty-checkout negative, and the README, CHANGELOG and CONTEXT box.
G1 and G2 are not yet signed; `gates_signed` goes in the sprint frontmatter only after the owner's sign-off is relayed verbatim.

### 2026-11-13 | g1-g2 | G1 and G2 batch signed, T1 to T3
Owner popup, verbatim: "Sign G1+G2, build". G1 took the fast path for both members (`origin: decomposer`, scope unchanged since the intake approval; promote only stamped `sprint:`).
G2 rulings in the same popup, verbatim: ADR-010 "Amend ADR-010 (Recommended)" · diagnosis exercise "Seeded, labelled (Recommended)" · build proof "T3's own doc lines (Recommended)".
G2: T1, T2 and T3 run strictly in sequence (D1), so there is one wave per step and no parallel build. Builder Codex in a worktree, one scoped Sonnet reviewer, the coordinator commits. Every Done-when box is a judgment tick: no mechanical check reaches skill prose, and none is added.
Design, T1: a new section "What every review result states" in `review-scoping.md` between the revise loop and draft reviews (coverage and limitations, and the replaced-behaviour sweep), a fixer-becomes-builder bullet in the revise loop, and one closing line in the builder-check reader prompt.
Design, T2: the new `cross-model-route.md` with when it fires, checks before a call, the launch line, the brief, what counts as a result, and rounds. Attended modes only. It cites T1's new section for the two statements and names no task id.
Design, T3: build, builder-never-grades and diagnosis sections; the opt-in line `cross-model: <cases> via <cli>` in the host's CONTEXT file; pointers from `review-scoping.md` (draft reviews, the skip table, when a pass fires) and `dispatch.md` § Escalation; README, CHANGELOG, CONTEXT; an Amendment section in ADR-010. lean-flow's own line: `cross-model: draft-review, code-review, build, diagnose via codex`.
builder-check · T1 · 4 contradictions · 5 questions · after the one retry a reply still missing either statement counts as not run; the coordinator's own self-review checklist is not a reviewer reply and is exempt; box 4 stays open until a real coordinator edit after a review happens; the reader prompt and the section order were confirmed by reading both files
builder-check · T2 · 2 contradictions · 4 questions · a failed or empty cross-model call is written in the review report and gets no review line, and the fallback reviewer's result gets the line as scoped-reviewer; the file cites the new review-scoping section and no task id; a code retry returns to the same other-provider reviewer; attended modes only; the report names the provider and model requested
builder-check · T3 · 5 contradictions · 4 questions · the skip table gains a pointer too; all four proof runs happen in T3 by a fresh agent with the opt-in on; dirty means git status --porcelain is non-empty in the build worktree; the denied permission is the other CLI being unable to write .git; the failed-twice pointer goes in dispatch.md Escalation; ADR-010 already carries Amendment sections; a repo with no CONTEXT file opts in by owner request only; seeded diagnosis and the build proof by owner ruling
### 2026-11-13 | scope-change | T3 (TASK-660): Layers gain docs/adr/ADR-010-model-dispatch-role-tiers.md. What broke: G2 found ADR-010 Decision items 2 and 4 in tension with a declared-policy handoff to another provider's CLI. Impact: T3 adds an Amendment section to ADR-010; no Done-when box changes. Re-confirm G2: owner popup, verbatim: Amend ADR-010 (Recommended) and Sign G1+G2, build.
consequence · T1 · behaviour:low · governance:high
review · T1 · scoped-reviewer · behaviour:low · governance:high
review · T1 · scoped-reviewer · behaviour:low · governance:high
consequence · T2 · behaviour:low · governance:high
review · T2 · scoped-reviewer · behaviour:low · governance:high
consequence · T3 · behaviour:low · governance:high
review · T3 · scoped-reviewer · behaviour:low · governance:high
review · T3 · scoped-reviewer · behaviour:low · governance:low
review · T3 · scoped-reviewer · behaviour:low · governance:high

### 2026-11-13 | progress | T1 to T3 built, reviewed and landed; all 19 Done-when boxes ticked
Each step was built by Codex (gpt-6-astra) in a worktree, reviewed by a scoped Sonnet reviewer and landed by the coordinator: T1 `b63dd0d4`, T2 `d49fb0f5`, T3 `da8ab049` and `78a1a60b`. Two coordinator edits followed a review and each took a fresh review: T1's re-ask wording (`1c6a3798`, Sonnet) and T3's five gap fixes (`8229cb31`, Codex through the route).
Coordinator slip: `936eb3e7` named T1's re-ask wording in its subject but carried only the task file, because a `git add` failed on a moved path; `1c6a3798` landed the two reviewed files and says so.
Proof runs for TASK-660, two fresh agents holding only the shipped references and `.claude/CONTEXT.md`: a Codex design review and a Codex code review (both `VERDICT: CLEAR` with both statements), a delegated build after a real dirty-worktree refusal, and a diagnosis handoff on a seeded failed-twice case (owner ruling) whose answer the coordinator checked and refuted.
Gaps the agents reported and this sprint did not close: the G2 design gate in `orchestrator/SKILL.md` names no cross-model route (the file is at its line cap; the route is reached through `review-scoping.md`); "pinning tests" for a prose-only change has no rule for which search hits are unrelated; the Spec comparand ladder has no rung for a prose-only change. `.claude/CONTEXT.md` is at its 150-line cap with no headroom, and a blank line under "Built-in leverage" was removed to fit the route's two lines.
No build-critical permission was denied in any run, so TASK-660's permission negative rests on the text plus one low-stakes denial (the user's global git ignore file), reported each time and never worked around.
