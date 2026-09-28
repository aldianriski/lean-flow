---
sprint: 109
slug: unlock-the-critical-path
owner: Maintainer
last_updated: 2026-09-28
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-109 — Execution Log

> Append-only companion to [`../SPRINT-109-unlock-the-critical-path.md`](../SPRINT-109-unlock-the-critical-path.md).
> Uncapped by design (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.

### 2026-09-28 | promote | plan locked, governance signed, four EPIC-017 members on the critical path
Scope ruled by the owner as "critical-path unlock": T1 `TASK-377` · T2 `TASK-364` · T3 `TASK-382` ·
T4 `TASK-387`. Size check before rendering: `TASK-363` (L) was split into `TASK-390` and `TASK-391`,
one per guard (`f1ea00c`), and then moved to `cancel/` (`de5afa6`). Both stay in the backlog. The
members were moved backlog → todo by `git mv` in their own commit (`eb1a072`) and then stamped
`sprint: SPRINT-109`. `plan_commit` is this Plan's first commit, recorded in the next commit.
Governance (owner-signed, `a0f37ee`): L-promotion none (47 unpromoted, all count 1) · TD aging 99 of
107 open, 30 newly named in a SPRINT-109 sweep · TD-090/117/128 (high, no live owner) → `TASK-357` ·
TD-157/169/170/175 deleted under §11 · `TD-187` filed (S11.TDDELETE judges no real resolved row) ·
epic rollups current (EPIC-016 can't be checked from here) · no handoff ledger.
Promote checks on this file: layers-completeness and authority PASS · prose-density 32/0 ·
by-reference NO-PLAN-COMMIT, expected until the next commit. G1/G2 are not signed yet. A1 (spec
`1.0.0`) and A2 (a zero-dep tokenizer) go to G2.

### 2026-09-28 | surprise | the signed checklist under-counted the soft cap breaches: 5, not 4
The checklist reported four soft OVER-CAP files. The cap check prints **five**: `TODO.md` (528 > 320)
was already over before this promote, and my first cap run cut it off with `tail -15`, so the breach
never reached the checklist. SPRINT-107's promote had counted it (5). The disposition is unchanged,
because deleting `TODO.md` is `TASK-380` (EPIC-017 Closed-when 2), so no new work follows. It was
caught by re-running the check on the rendered file, a second route, and not by the rule. L-198's
shape: the first query cut its own population short.

### 2026-09-28 | promote | the governance record, restated with every checklist line named
The first promote entry named four of the five checklist lines, but not doc-aging, so
`S10.PROMOTEREVIEW` read it as `promote-checklist-absent`. The signed checklist, line by line:
- **L-promotion:** none (47 unpromoted, all count 1).
- **TD aging:** 99 of 107 open rows aged, 30 newly named in the SPRINT-109 sweep (`a0f37ee`). TD-090/117/128 → `TASK-357`.
- **doc-aging:** §2 caps, 5 soft OVER-CAP files (the four signed + `TODO.md`, see the entry above), 0 hard.
  §11 retention: TD-157/169/170/175 deleted, and `TD-187` filed. `S11.TODOCAP` (`todo-over-cap-at-promote`, 531 > 320)
  fires on size alone. Its disposition is **open, pending an owner ruling**: it was never on the signed checklist.
- **epic rollup currency:** EPIC-014/015/017 current. EPIC-016 can't be checked from here.
- **handoff ledger:** none.
Other conformance FAILs at this commit predate the promote: 32 `update-trigger-absent` / 28 `ownership-header-field-missing`
on store task files (the engine doesn't yet know the store, `TASK-383`) · ADR-043/044 · the CHANGELOG rotation · 2 tracked fixture logs.
Verdict, not exit code: `S10.TDAGING` PASS (99 named) · `S11.TDDELETE` PASS, which is TD-187's blind spot and not a real clearance.

### 2026-09-28 | promote | owner ruling: TODO.md's cap breach is accepted until TASK-380
`S11.TODOCAP` (`todo-over-cap-at-promote`, 531 > 320) is a **ruled standing breach** (owner, 2026-09-28).
`TASK-380` deletes `TODO.md` (EPIC-017 Closed-when 2), and trimming a file that is about to be deleted would be
the diet EPIC-017 exists to stop. The FAIL stays visible on every run until 380 lands. It is not a pass.

### 2026-09-28 | progress | preflight HALT on brace-shorthand Layers → paths written out, CLEAR
The dispatch preflight read `scripts/lib/check-doc-caps.{sh,ts}` (T2) and `scripts/lib/check-authority.{sh,ts}` (T3)
as the bare directory `scripts/lib/`, which then "overlapped" every other `scripts/lib/` file: 7 `shared-file-unowned`
FAILs across T2/T3/T4, none of them real. The paths are now written out (a live declaration, L-100; `## Done when`
is untouched). Re-run: `PREFLIGHT: CLEAR`. Waves are T1 · T3 · T4 at rank 0 and T2 at rank 1 (after T1, on `spec/STANDARD.md`).
