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
