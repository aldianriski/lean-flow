---
sprint: 113
slug: ship-the-store-trim-the-guards
owner: Maintainer
last_updated: 2026-10-03
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-113 — Execution Log

> Append-only companion to [`../SPRINT-113-ship-the-store-trim-the-guards.md`](../SPRINT-113-ship-the-store-trim-the-guards.md).
> Uncapped by design (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.

### 2026-10-03 | promote | plan locked, governance signed, four members: EPIC-017 step 1 (378 · 379 · 397) + the audit cuts (398)
Scope ruled by the owner: 398 + 378 + 379 + 397 ("add 397 too"). Size check at pull: none is L. 379 is effectively S (SPRINT-111 T4
landed most of it), 378 stays M (no TASK.md.template yet; TODO.md.template still exists, TD-209), 398 is M, 397 is S. Members were moved
backlog → todo by `git mv` in their own commit (`9cdbbd3`), then stamped `sprint: SPRINT-113`. The signed governance checklist (owner-signed;
applied in `df8982d`):
- **L-promotion:** L-218 (count 2) → promoted into `skills/orchestrator/references/dispatch.md` § Merge-back queue, the post-merge line, with
  `disposition: merge` (it sharpens the existing smoke-check line rather than adding a rule, per ADR-050 clause 2). Body collapsed to a pointer.
- **TD aging:** 126 of 132 open rows aged against sprint 113. Second route: 132 − 6 filed at 111/112 = 126. 6 `high` rows are open, all owned
  (TD-143 → 348 · TD-150 → 345 · TD-090/117/128/168 → 357). TD-174 resolved (TASK-384). No new escalation.
- **doc-aging:** §11 has no TD deletion due and no CHANGELOG rotation; the store prune stays held (D4). §2: 0 OVER-CAP; the 4 soft breaches are
  recorded `retain` dispositions (EPIC-017 now 236 > 200, covered until §11 archive). Token budget ~13419 ≤ 16087.
- **epic rollup currency:** EPIC-017 current (`5b43e65`). EPIC-014 gains a backlog task (TASK-399), no member sprint. EPIC-015 current.
  EPIC-016: foreign uncommitted WIP, not assessed.
- **handoff ledger:** none.
**Review ruling (owner):** the Codex loop covers consequential Tier G and every shipped skill/template change. Maintainer-only work takes ADR-050's
bar plus a coordinator self-review (D3). G1/G2 are not signed yet.

### 2026-10-03 | progress | plan_commit recorded: 4f21040
The `plan locked` commit is `4f21040`; this entry and the frontmatter field land in the next commit.

### 2026-10-03 | progress | G1/G2 signed (owner); TODO.md.template ruled DELETE
**G1** (full checklist for all four: 398 is manual, 397 close-retro, and 378/379 are decomposer-origin but SPRINT-111 already did part of their scope).
Goal, size, files, out-of-scope and assumptions confirmed. **G2:** T1 ∥ T2 ∥ T4 in parallel, worktree-isolated; T3 after T2 (shared CLAUDE/CONTEXT/README;
preflight CLEAR, waves T1 = T2 = T4 = 0, T3 = 1). Owner ruling: `TODO.md.template` is **deleted** (not a tombstone); TD-209 closes with T2.
**Consequence lookups (TD-092):** T1 · behaviour: guards removed · governance: gate composition, maintainer-only → ADR-050 bar (no runner reaches
the cut + full gate default/opt-in) + coordinator self-review · T2 · behaviour: shipped templates + init procedure · governance: consumer-facing
skill contract → Codex loop · T3 · behaviour: doc prose + one skill wording · governance: consumer-facing skill text → Codex loop · T4 · behaviour:
shipped migrate reference + harness · governance: consumer-facing procedure → Codex loop.
