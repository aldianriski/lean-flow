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
