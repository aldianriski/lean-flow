---
sprint: 112
slug: govern-lighter
owner: Maintainer
last_updated: 2026-10-02
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-112 — Execution Log

> Append-only companion to [`../SPRINT-112-govern-lighter.md`](../SPRINT-112-govern-lighter.md).
> Uncapped by design (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.

### 2026-10-02 | promote | plan locked, governance signed, two members: the proof bar (396) and the cap conditions (384)
Scope ruled by the owner: "396 + 384 first", so the governance diet comes before EPIC-017 step 1 (378 · 379 → SPRINT-113).
Size check before rendering: `TASK-396` was L at pull time (ADR + a ~120-guard audit + landed cuts + a CLAUDE.md slim). Split by owner
ruling (`a5238fd`): 396 keeps ADR-050 + the audit, the cuts → `TASK-398` (new; id derived from the store max, TASK-397, with 0 hits in
the tree and `git log --all`), and the CLAUDE.md slim → `TASK-384`. Members were moved backlog → todo by `git mv` in their own commit
(`9d3d983`), then stamped `sprint: SPRINT-112`. The signed governance checklist, line by line (owner-signed; applied in `a5238fd`):
- **L-promotion:** L-220 (count 2) → promoted to `skills/orchestrator/SKILL.md`: a G2 checklist line + a red flag, placed where rulings
  are offered (CLAUDE.md is at its cap). Body collapsed to a pointer. The orchestrator is now 135 lines.
- **TD aging:** 115 of 132 open rows aged against sprint 112. Second route: 132 − 17 filed at 110/111 = 115. All 7 `high` rows are owned
  (TD-143 → 348 · TD-150 → 345 · TD-090/117/128/168 → 357 · TD-174 → 384). No new escalation.
- **doc-aging:** §11 has no TD deletion due (TD-203 resolved at 111), no CHANGELOG rotation, the L-220 collapse is applied, and the store
  prune stays held (D5/TD-206). §2 has 4 soft OVER-CAP rows, all routed to T2 (`TASK-384`, CW 3): EPIC-017 233 > 200 · adlc-epic-sequencing
  140 > 130 · epic-017-effectiveness 162 > 130 · the V3 research doc 3050 > 130. Token budget ~16081 ≤ 16087.
- **epic rollup currency:** EPIC-017 is current (`dfebeae`). Every member row in EPIC-014/015 carries a close sha. EPIC-016: foreign WIP in
  the checkout, not assessed.
- **handoff ledger:** none.
G1/G2 are not signed yet.

### 2026-10-02 | progress | plan_commit recorded: ceffdad
The `plan locked` commit is `ceffdad`; this entry and the frontmatter field land in the next commit.
