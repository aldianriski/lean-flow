---
owner: Maintainer
last_updated: 2026-08-09
update_trigger: Rotated from root CHANGELOG.md when a newer MINOR landed (DOCS_Guide §11)
status: current
---

# lean-flow — Changelog archive (v1.26.0)

<!-- Rotated verbatim from root CHANGELOG.md when v1.28.0 landed (v1.28.0 + v1.27.x stay inline).
     Append-only; never edited. -->

## v1.26.0 — Sprint Log Split (2026-08-09)

MINOR — SPRINT-047. Your sprint file has a 400-line hard cap, and the Execution Log was eating it.
That mattered more than it sounds: an unattended run stops when the promoted Plan's work runs out, and
it cannot promote more for itself — so how much a night run can do is decided by how big a Plan you
could fit inside that cap.

**What changed for you:**
- **The Execution Log now lives in its own file** — `docs/sprint/logs/SPRINT-NNN-<slug>.md`,
  append-only and uncapped, created at your first log entry. The 400-line cap now governs only the
  frozen Plan. Measured across the six sprints before the change: 232–368 lines while holding just
  2–6 tasks, one of them reaching 368 lines on **two** tasks. Task count was never what filled the
  file. Post-split a Plan holds roughly **12 task blocks** — not the 15 first estimated, because
  Files Changed and the Retro still share the budget; the measured figure is the one documented.
- **The `logs/` subdirectory is load-bearing, so don't rename it into a suffix.** The four sprint-file
  checks glob `docs/sprint/SPRINT-*.md` non-recursively, so a subdirectory is skipped for free — while
  a same-folder `SPRINT-NNN-log.md` would be capped at 400 and schema-checked as though it were a
  Plan, reintroducing the exact problem. `ADR-014` records the reasoning; a retained fixture keeps the
  claim honest by failing loudly if that glob is ever widened.
- **A new `sprint-log.md.template`** ships with the generator (31 core templates now), and the SPRINT
  template's Execution Log section became a pointer to it. **Existing sprints keep working unchanged** —
  nothing migrates automatically; new sprints simply get the new shape.
- **Sprint close now archives the pair together**, log alongside Plan, in one commit. A Retro whose
  evidence got left behind in a different directory is worse than no split at all.
- **An adoption re-scan of `mattpocock/skills`** (`docs/research/mattpocock.md`) — 2 keepers of 5
  examined, both filed as tasks rather than adopted blind. The interesting one contradicts a rule
  lean-flow currently ships: our grill insists on one question at a time, but the real discriminator
  is *dependency*, not count — independent questions can be asked together.

