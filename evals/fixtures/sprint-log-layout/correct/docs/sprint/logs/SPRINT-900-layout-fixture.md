---
sprint: 900
slug: layout-fixture
owner: Maintainer
last_updated: 2026-08-09
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-900 — Execution Log (FIXTURE)

> **FIXTURE, not a real sprint.** Retained input for `evals/run-sprint-log-layout-fixtures.sh`.
> This is the **correct** placement — a `logs/` subdirectory. The glob `docs/sprint/SPRINT-*.md` is
> non-recursive, so it MUST NOT select this file. That exclusion is the whole point of ADR-014: if a
> future edit makes the glob recursive, this file starts being capped at 400 and schema-checked as a
> Plan, and the fixture fails loudly instead of the breakage surfacing months later in a real sprint.

### 2026-08-09 | promote | fixture log entry
Deliberately long-form filler is unnecessary here; the fixture asserts on the file's PATH, not its
contents. What matters is that it is named `SPRINT-*.md` and lives one directory down.
