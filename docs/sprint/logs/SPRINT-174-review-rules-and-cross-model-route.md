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
