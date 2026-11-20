---
owner: Maintainer
last_updated: 2026-11-20
update_trigger: Sprint completed and changes reflected in docs
status: current
---

# lean-flow — Changelog

<!-- Prepend new sprints — newest first. Append-only; never edit past blocks. -->

> **Older than the two minors below** → [`docs/changelog/`](docs/changelog/) — rotated verbatim at
> each new MINOR and reachable only from here (STANDARD §11).

---

## [Unreleased]

## v2.26.0 — the dispatch trial is ruled: one opt-in cell kept, the rest back to defaults (2026-11-20)

**MINOR** — no new skill; the roster stays at 16, and the standard is spec 0.21.0. Restart the session after installing.
Released on a Codex review of the shipped diff since v2.25.0 (R1 CLEAR; its one Low, trial figures in the shipped cell
table, was fixed before the bump) and the off-host gate. SPRINT-181 (TASK-671) carries the per-cell evidence; its RTK and
graphify trials ship nothing (graphify Drop, RTK inconclusive, EPIC-026 closed).

- **`/orchestrator`: the model-and-effort trial is ruled. Only the intake draft check (strongest tier, blind Codex pair) is kept, opt-in per host; the other cells return to their defaults and the `dispatch-trial` declaration is retired (ADR-010, TASK-671).**

## v2.25.0 — Indonesian infra calques keep their English terms, with an optional host glossary (2026-11-16)

**MINOR** — no new skill; the roster stays at 16, and the standard is spec 0.21.0. Restart the session after installing.
Released on a Codex review of the shipped diff since v2.24.0 (R1: two High, both meaning changes in owner-listed pairs, fixed
by owner ruling in 26739da2; R2 CLEAR) and the off-host gate. SPRINT-180 (TASK-672) carries the measured evidence.

- **`/humanizer`: uses English terms for Indonesian infra calques, with an optional host-glossary override (read on the document and inline-fallback paths; commit messages ignore it, TD-317) and a check for rejected forms left in the final text. Closed findings stay "closed" unless the text says they were fixed.**
