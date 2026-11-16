---
owner: Maintainer
last_updated: 2026-11-16
status: current
update_trigger: rotated out of the root CHANGELOG at a new MINOR (STANDARD §11)
---

# lean-flow — Changelog v2.23.x (rotated)

> Rotated verbatim from the root `CHANGELOG.md` at the **v2.25.0 release** (2026-11-16). §11 keeps the
> current and previous minor inline (2.25.x and 2.24.x), so cutting v2.25.0 pushed v2.23.x out.

## v2.23.0 — half the bookkeeping: zero-defect checks cut, record lines written by a tool (2026-11-12)

**MINOR** — no new skill; the roster stays at 16, and the standard is spec 0.21.0 (§2's work-item row follows ADR-045's amended D6). Restart the session after installing.
Released on a Codex review of the shipped diff since v2.22.0 and the off-host gate (EPIC-025). The cuts follow a census of every gate
check and record step: only rows with no real defect in the archived sprint logs went, and every kept check still fails its must-FAIL
fixture by name. Sprint B, a workdoo sprint on this release, is the measuring sprint for EPIC-025's halving target.

- **Changed** — `/orchestrator`: from this release a task's moves and ticks ride in its own work commits (ADR-045 D6 amended); only cancel, de-scope, promote and a backlog revert stay separate commits. Routine progress rides with the accepted task result, and a blocker with its park record.
- **Changed** — `/lean-doc-generator` close: the Retro, routed buckets, the close entry and `status: closed` land in one close commit. `close_commit` and the epic row's sha go in the archive commit close already makes, so no record-only commit is added.
- **Changed** — `/lean-doc-generator`: a surprise finding rides in its task's progress entry, Files Changed rows come from the accepted diff, and a knowledge index is regenerated once, with its source docs.
- **Added (maintainer-only)** — `scripts/lib/record-line.ts` writes the consequence, review, scope-change, builder-check, tick and move records exactly as the gate parses them, and refuses a missing, unknown or ambiguous input instead of writing a default. The skills name it as lean-flow's own; consumers keep writing the lines by hand.
- **Removed (maintainer-only)** — 9 gate checks and 19 fixture harnesses with no real defect in the census (SPRINT-173). `merge-check` runs four legs, and prose density (no line over 400 characters) is now a manual check.
- **Measured (maintainer-only)** — one Jev trial on consequence classification (0.0054 USD) missed SPRINT-171 T5's owed review and rated 52 material changes low, so it was dropped.
- **Added (maintainer-only)** — `docs/research/process-cost-census.md` and its appendix list every gate check and every skill-required record step with its FAIL history, real defects and a proposed keep, merge or cut, for EPIC-025's owner rulings. Nothing is cut yet (SPRINT-172).
- **Removed (maintainer-only)** — the A/B measurement system: `evals/ab/` (harness, arms, judges, task corpus) and `scripts/jev-ab-judge.ts`, with their config entries. Releases ship on a Codex review of the shipped change plus the repo gate, as 2.21.0 and 2.22.0 did; EPIC-023 D19's pre-release arm is retired. TASK-631 is cancelled; seven A/B-only TD rows close. Measurement logs stay in `docs/research/logs/` as records.
