---
sprint: 111
slug: delete-todo-md
owner: Maintainer
last_updated: 2026-09-30
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-111 — Execution Log

> Append-only companion to [`../SPRINT-111-delete-todo-md.md`](../SPRINT-111-delete-todo-md.md).
> Uncapped by design (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.

### 2026-09-30 | promote | plan locked, governance signed, four EPIC-017 members aimed at Closed-when 2
Scope ruled by the owner as "370 ∥ 381 → 394 → 380": T1 `TASK-370` · T2 `TASK-381` · T3 `TASK-394` · T4 `TASK-380`. Size check
before rendering: `TASK-380` was L at pull time, carrying 15 legacy tasks, 22 + 17 files mentioning TODO.md and a spec retirement.
It was split into `380` (migrate + delete) and `TASK-394` (readers + S11.TODOCAP), owner ruling, `9466686`. TASK-394's id was derived
from the store's max (TASK-393) and checked against `git log --all` (0 hits). Members were moved backlog → todo by `git mv` in their
own commit (`4a24854`), then stamped `sprint: SPRINT-111`. `plan_commit` is this Plan's first commit, recorded in the next commit.
The signed governance checklist, line by line (owner-signed; applied in `5e0d75b`):
- **L-promotion:** none (50 at count 1; L-218/219/220 are new).
- **TD aging:** 106 of 128 open rows aged against sprint 111: the 105 named before, plus TD-186 (Sprint-108, low). Second route:
  128 − 22 filed at 109/110 = 106. All 7 `high` rows are owned, three by legacy TODO.md tasks that T4 migrates.
- **doc-aging:** §2 has 0 hard and 5 soft OVER-CAP (the set is unchanged; TODO.md is standing until T4, the other four belong to TASK-384).
  The token budget sits at ~16087 <= 16087. §11: no resolved TD to delete. The store prune (359/360/374) is held for TD-206.
- **epic rollup currency:** EPIC-017 current (`035508b`). EPIC-014/015 unchanged. EPIC-016 has foreign WIP in the checkout.
- **handoff ledger:** none.
G1/G2 are not signed yet.
