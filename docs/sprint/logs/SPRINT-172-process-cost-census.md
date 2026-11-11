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
