---
sprint: 110
slug: retarget-the-gate
owner: Maintainer
last_updated: 2026-09-29
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-110 — Execution Log

> Append-only companion to [`../SPRINT-110-retarget-the-gate.md`](../SPRINT-110-retarget-the-gate.md).
> Uncapped by design (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.

### 2026-09-29 | promote | plan locked, governance signed, four EPIC-017 members on the critical path
Scope ruled by the owner as "390 ∥ 391 → 383": T1 `TASK-390` · T2 `TASK-391` · T3 `TASK-383` · T4 `TASK-392`. Size check
before rendering: `TASK-383` carried about seven engine rules plus `qa-check.sh` and `night-run.sh`, so it was split
into `383` (engine) and `TASK-392` (qa-check, night-run), one per surface (owner; `0727b0d`). `380`/`381` now depend on both.
The next id was derived from the store and TODO.md (max `TASK-391`) and checked against `git log --all` (no `TASK-39[2-9]`).
The members were moved backlog → todo by `git mv` in their own commit (`928288a`), then stamped `sprint: SPRINT-110`.
`plan_commit` is this Plan's first commit, recorded in the next commit.
The signed governance checklist, line by line (owner-signed; applied in `642d23f`):
- **L-promotion:** none (47 at count 1; L-198 bumped to 3 at the SPRINT-109 close, already promoted).
- **TD aging:** 105 of 115 open rows aged against sprint 110, of which the 99 named in earlier sweeps plus 6 newly aged
  (TD-180…185, all low, Sprint-107). Second route: 115 open − 10 filed at 108/109 = 105. All 7 `high` rows are owned.
- **doc-aging:** §2 caps, 0 hard and 5 soft OVER-CAP. `TODO.md` is a standing ruling until `TASK-380`; the other four
  (EPIC-017 · adlc-epic-sequencing · epic-017-effectiveness · HARDENING-V3) belong to `TASK-384`. The token budget sits at
  ~16087 <= 16087, with 0 headroom. §11: TD-179 (resolved at SPRINT-107) deleted. Freshness: `docs/QA.md`'s caps row
  refreshed for ADR-048.
- **epic rollup currency:** EPIC-017 current (rolled up at `6761016`). EPIC-014/015 have had no member close since.
  EPIC-016 can't be checked from here.
- **handoff ledger:** none.
Owner rulings at this promote: D1 (`.ts` gates, carried from SPRINT-109) · D2 (the store is exempt from the ownership
header) · D4 (the 383 split). G1/G2 are not signed yet.
