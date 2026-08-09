---
sprint: 901
slug: layout-fixture
owner: Maintainer
last_updated: 2026-08-09
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-901 — Execution Log, TRAP placement (FIXTURE)

> **FIXTURE demonstrating the REJECTED layout.** A log placed beside its Plan with a `-log.md`
> suffix instead of in a `logs/` subdirectory. Because it still matches `SPRINT-*.md`, the glob
> selects it — so every sprint-file leg treats this log as a Plan: it gets capped at 400 (the exact
> constraint ADR-014 removes) and schema-checked for `### Tn` blocks it will never contain.
>
> The fixture asserts the glob DOES select this file. That is not a bug being tolerated — it is the
> evidence that the subdirectory choice is load-bearing rather than stylistic. Delete this fixture
> and ADR-014's central claim becomes unfalsifiable.
