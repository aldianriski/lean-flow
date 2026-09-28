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
