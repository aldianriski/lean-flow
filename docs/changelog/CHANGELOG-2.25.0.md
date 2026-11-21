---
owner: Maintainer
last_updated: 2026-11-21
status: current
update_trigger: rotated out of the root CHANGELOG at a new MINOR (STANDARD §11)
---

# lean-flow — Changelog v2.25.x (rotated)

> Rotated verbatim from the root `CHANGELOG.md` at the **v2.27.0 release** (2026-11-21). §11 keeps the
> current and previous minor inline (2.27.x and 2.26.x), so cutting v2.27.0 pushed v2.25.x out.

## v2.25.0 — Indonesian infra calques keep their English terms, with an optional host glossary (2026-11-16)

**MINOR** — no new skill; the roster stays at 16, and the standard is spec 0.21.0. Restart the session after installing.
Released on a Codex review of the shipped diff since v2.24.0 (R1: two High, both meaning changes in owner-listed pairs, fixed
by owner ruling in 26739da2; R2 CLEAR) and the off-host gate. SPRINT-180 (TASK-672) carries the measured evidence.

- **`/humanizer`: uses English terms for Indonesian infra calques, with an optional host-glossary override (read on the document and inline-fallback paths; commit messages ignore it, TD-317) and a check for rejected forms left in the final text. Closed findings stay "closed" unless the text says they were fixed.**
