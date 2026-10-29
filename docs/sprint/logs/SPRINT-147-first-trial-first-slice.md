---
sprint: 147
slug: first-trial-first-slice
owner: Maintainer
last_updated: 2026-10-29
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-147 — Execution Log

> Append-only companion to [`../SPRINT-147-first-trial-first-slice.md`](../SPRINT-147-first-trial-first-slice.md). Uncapped by design:
> this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> Rendered at promote, in the same commit as `plan locked`; its first entry is the `promote` entry
> carrying the signed governance checklist.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.
> Its heading names every `Tn` it changes, and every path the entry names sits in one of those tasks' `Layers:` or `Cites:`.

### 2026-10-29 | promote | plan locked, governance signed, two members: EPIC-023 S0's harness tracer and clinic booking slice
Promote governance checklist, signed by the owner by popup:
- ☑ L-promotion: none due. Census 16 active + 222 promoted + 1 superseded = 239, equal to the heading count. L-217 (bumped
  to count 5 at this intake, already promoted) is a re-placement candidate: owner ruled a task, filed as TASK-546
  (`a3bbe64e`).
- ☑ TD aging: 98 of 99 open rows aged against sprint 147. Second route: 105 rows − 6 resolved = 99 open; TD-279 (filed at
  146) is the one not aged. Newly aged: none (no row filed at 144). No `high` row.
- ☑ doc-aging, §11 (owner-approved, `a3bbe64e`): TD-278 deleted (resolved at 144); TASK-515, 517, 518, 520 (SPRINT-144)
  pruned. They have no live `.md` citation by either route: git grep, and ripgrep once its Windows `.\` paths were normalised.
  The first ripgrep pass disagreed only because of that path form. The TASK-367 control hits on both, and none is the
  store's highest id. TASK-524 kept by owner ruling: `evals/fixtures/humanizer/fact-keep/NOTES.md` names it. No CHANGELOG
  rotation is due, and no LEARNINGS collapse.
- ☑ doc-aging, §2: one soft breach, `docs/research/lean-flow-3-foundation.md` at 222 lines against a 130 cap. Owner disposition:
  `retain` until EPIC-023 closes (`.cap-dispositions`, `a3bbe64e`); `check-doc-caps.ts` now prints it as `retained:`.
  `.claude/CLAUDE.md` is at 79/80, and `.claude/CONTEXT.md` and `docs/architecture/overview.md` at 149/150.
- ☑ epic rollup currency: EPIC-023 is active with no member before this one, header current. ☑ epic coverage: EPIC-023 5 of 5
  covered (open items and marks counted by two selectors). ☑ roadmap: none. ☑ handoff ledger: none.
Intake: the owner opened EPIC-023 (`c5118750`) after a 4-round Codex review of the 3.0 proposal. `/task-decomposer --epic`
drafted S0 as TASK-533..545 (`79a1cf49`, owner `approve`). The intake Codex review ran before `approve`, as the owner rule
requires, but took 5 rounds (10 → 6 → 4 → 1 → 1). The owner then adopted a 2-round rhythm and carried the R5 finding to
TASK-543 as a G2 note. Owner rulings: I-1 clinic booking · I-2 workdoo A1 = its real 2.x docs · I-3 Opus 5.5 trial session ·
R-a evidence parity · R-b baseline defect rule · R-c freeze wording. Size check: two M, no `L`. Both are
`origin: decomposer`. Epic: EPIC-023. Gate before promote: QA-CHECK 310 pass, 0 fail (local, `QA_BUDGET_SECONDS=1500`).
`promote-check`: 7 pass, 0 fail, after one finding. TASK-534's Done when names the bare `lean-flow-3-foundation.md`, and
T2's `Cites:` carried the full path. A bare name matches `Layers:` by basename but `Cites:` only as the exact token, so
the FAIL message's own advice ("declare it on Cites:") failed until the bare token was written. Retro candidate: a
checker gap (TD).
