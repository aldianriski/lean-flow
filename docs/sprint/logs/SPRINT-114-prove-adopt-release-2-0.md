---
sprint: 114
slug: prove-adopt-release-2-0
owner: Maintainer
last_updated: 2026-10-03
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-114 — Execution Log

> Append-only companion to [`../SPRINT-114-prove-adopt-release-2-0.md`](../SPRINT-114-prove-adopt-release-2-0.md). Uncapped by design:
> this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.

### 2026-10-03 | promote | plan locked, governance signed, six members: EPIC-017's remaining Closed-when 6–10 through the 2.0.0 release
Scope ruled by the owner: all six through release (371 · 365 · 372 · 385 · 386 · 373), over two smaller options. Size check at pull: none
is L (four M, two S). Members moved backlog → todo by `git mv` in their own commit (`ddb57bf`), then stamped `sprint: SPRINT-114`.
Dependency facts at pull: every prerequisite outside the sprint is in `done/` (364 · 374 · 378 · 379 · 380 · 384), so `371` is the only
member unblocked; the rest chain inside the sprint. The signed governance checklist (owner-signed; applied in `98d2c73`):
- **L-promotion:** L-224 (count 2) → `skills/orchestrator/references/dispatch.md` § Members by reference, rule 5 (Tick). L-182 (count 3) →
  the same file's § Worktree dispatch protocol, the builder-evidence line. Both `disposition: merge`; bodies collapsed to pointers. Census
  cross-check: count distribution over `promoted: no` rows was 50 × 1 + 1 × 2 + 1 × 3 = 52, equal to the `promoted: no` total; 50 after.
- **TD aging:** 130 of 133 open rows aged against sprint 114. Second route: 133 − 3 filed at 112/113 = 130. Net change since the 113 promote:
  +2 (TD-215, TD-216 at 113 close), −1 (TD-209 resolved by TASK-378). 6 `high` rows are open, all owned (TD-143 → 348 · TD-150 → 345 ·
  TD-090/117/128/168 → 357). No new escalation.
- **doc-aging:** §11: TD-203 (resolved SPRINT-111 by TASK-394) had passed its 3-sprint clock, so its row is deleted; the ledger now holds 135
  rows (133 open + 2 resolved). CHANGELOG rotation is due at `2.0.0`, which is T6. The store prune stays held (D5). §2: 0 OVER-CAP; the 4 soft
  breaches are recorded `retain` dispositions. Token budget ~13482 ≤ 16087.
- **epic rollup currency:** EPIC-017 current (SPRINT-113 row carries `4ee8c80`). EPIC-014 and EPIC-015 unchanged since the 113 promote.
  EPIC-016: uncommitted edits from another session, not assessed and not staged.
- **handoff ledger:** none.

**Drift found at promote, ruled before the freeze.** workdoo's SPRINT-008 had closed and a SPRINT-009 promote was in progress there,
uncommitted; workdoo's `TODO.md` was 288 lines. TASK-371's first Done-when still named "389-line TODO.md Backlog + the active SPRINT-008".
Owner ruling: the criterion names the queue at the branch base and records its counts at execution (member amended, 2026-10-03). Owner
ruling on timing: T1 branches only once workdoo's SPRINT-009 promote is committed, and T2/T4 write to workdoo main only inside a window the
owner opens (D2).
**Open for G2:** how the release candidate is cut (A1); whether T3 is *consequential* G (ADR-050).

### 2026-10-03 | progress | plan_commit recorded: cd8d355
The `plan locked` commit is `cd8d355`; this entry and the frontmatter field land in the next commit.
