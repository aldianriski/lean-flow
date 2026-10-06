---
sprint: 115
slug: gate-and-host-cost
owner: Maintainer
last_updated: 2026-10-06
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-115 — Execution Log

> Append-only companion to [`../SPRINT-115-gate-and-host-cost.md`](../SPRINT-115-gate-and-host-cost.md). Uncapped by design:
> this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.

### 2026-10-06 | promote | plan locked, governance signed, five members: the gate's cost measured off-host and ruled
The owner picked scope "Gate + host cost" over three alternatives (all P1s · the hygiene smalls · defer). The size check at pull found no L
(one M, four S). `TASK-403` was filed at this promote for TD-224/225 (`5834cbb`). The members moved backlog → todo in their own
commit (`9a0997a`) and were stamped `sprint: SPRINT-115` in `cede84c`. The owner signed the governance checklist as is:
- **L-promotion:** none. No `promoted: no` row has count ≥ 2. Second route (number of `seen:` lines per active row): none. Census: 58 active +
  151 promoted + 1 superseded.
- **TD aging:** 130 of 141 open rows have aged against sprint 115 (created ≤ 112). Second route: 141 − 11 filed at 113/114 = 130. 6 `high` rows are
  open (4 of them written `**high**`, which a plain `severity: high` selector misses), all owned: TD-143 → 348 · TD-150 → 345 ·
  TD-090/117/128/168 → 357. No new escalation.
- **doc-aging:** §11: TD-174, resolved at SPRINT-112, has passed its 3-sprint clock, so its row is deleted in `5834cbb`. The ledger now holds 143 rows (141
  open + 2 resolved). CHANGELOG was rotated at 2.0.0, so nothing is due. §2: 0 OVER-CAP; 3 soft breaches, all with recorded `retain` dispositions.
- **epic rollup currency:** EPIC-014 and EPIC-015 are current (every `epic:`-stamped sprint has a row). EPIC-016 tracks workdoo's sprints only.
- **handoff ledger:** none.
**Drift flagged:** `TASK-345` may already be delivered. workdoo's supervisor checks the lean-flow pin (`supervisor.ts:176-181`), so it
is re-checked before any pull, not pulled here. **Promote-time per-file checks (TASK-368, by hand):** layers-completeness found T4's
Layers missing the bare `check-dod-delta.ts` the member names; fixed before the freeze, now 15 PASS / 0 FAIL. `check-sprint-by-reference` read
NO-PLAN-COMMIT before the commit existed, which is expected.
**Open for G2:** A1 (VPS as T2's measurement host) · A2 (where T5's promote hook lives) · whether T1 and T4 are *consequential* G (ADR-050).

### 2026-10-06 | progress | plan_commit recorded: cede84c
The `plan locked` commit is `cede84c`; this entry and the frontmatter field land in the next commit.
