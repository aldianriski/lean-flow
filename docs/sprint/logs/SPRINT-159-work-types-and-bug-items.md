---
sprint: 159
slug: work-types-and-bug-items
owner: Maintainer
last_updated: 2026-11-02
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-159 — Execution Log

> Append-only companion to [`../SPRINT-159-work-types-and-bug-items.md`](../SPRINT-159-work-types-and-bug-items.md). Uncapped by design:
> this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (STANDARD §9). **Never edit a past entry** — correct it with a new one.

### 2026-11-02 | promote | plan locked, governance signed, six members: typed work items, bug items, migration, research folders
Promote governance checklist, signed by the owner by popup:
- ☑ L-promotion: none due (L-280 to L-282 at count 1; no active entry at count 2 or more).
- ☑ TD aging: 105 open, none `high` (61 low, 24 minor, 15 medium, 5 trivial); no escalation.
- ☑ doc-aging, §11: nothing pruned, no CHANGELOG rotation (no new release), no LEARNINGS collapse due.
- ☑ doc-aging, §2: no breach (`check-doc-caps`: retained and frozen rows only).
- ☑ epic rollup currency: EPIC-023 current (`check-epic-archive.ts` PASS). ☑ epic coverage: 2 open, both covered (S3 → TASK-587,
  588; S4 → next slice). ☑ roadmap: none. ☑ handoff ledger: none.
Composition by owner popup: TASK-590, 591, 592, 593, 594 and 589, stream docs-structure (new), no epic. No `L`. Intake rulings
(owner, 2026-11-02): one typed work store rather than a separate bugs folder, evidence in a folder per item, `done/` as the
archive, `TECH-DEBT.md` kept as the ledger, and a proper migration for repos already on lean-flow.
Cross-stream: SPRINT-157 (branch `sprint-157-reusable-verification`) owns the generator's CRLF fix, an edit to
`skills/diagnose/SKILL.md` and `docs/development/setup.md`; recorded as D3.
promote-check: 19 pass, 0 fail.
