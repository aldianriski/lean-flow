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
