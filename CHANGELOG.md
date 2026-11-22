---
owner: Maintainer
last_updated: 2026-11-21
update_trigger: Sprint completed and changes reflected in docs
status: current
---

# lean-flow — Changelog

<!-- Prepend new sprints — newest first. Append-only; never edit past blocks. -->

> **Older than the two minors below** → [`docs/changelog/`](docs/changelog/) — rotated verbatim at
> each new MINOR and reachable only from here (STANDARD §11).

---

## [Unreleased]

## v2.28.0 — hand-off offers, a pre-run sweep and one park rule (2026-11-22)

**MINOR** — no new skill; the roster stays at 16, and the standard is spec 0.21.0. Restart the session after installing.
Released on a Codex review of the shipped diff since v2.27.0 (R1 CLEAR, no findings) and the off-host gate. SPRINT-185
(TASK-694 to TASK-698) carries the evidence; every behaviour was proven in a consumer repo, and one defect found there was fixed before release.

- **`/lean-doc-generator`: `init` on a repo with docs hands over to `migrate` in the same session, and both offer independently reviewed suggestions for open profile prompts; an accepted one is cited, a rejected one is never written (TASK-694).**
- **`/task-decomposer`, `/lean-doc-generator promote`, `/orchestrator` and `/flow`: each hand-off offers the next step (promote, then a recommended mode) and the caller runs it once; `quick` and `mvp` follow a promoted member's lifecycle. `/prime` now names an overnight run only when every open member is AFK at J0/J1 with no open assumptions, so one AFK member no longer qualifies (TASK-695).**
- **`/orchestrator sprint-bulk`: a pre-run sweep asks every foreseeable question at batch G1/G2 before the first dispatch; a member still blocked leaves only by the owner's ruling (TASK-696).**
- **`/orchestrator`, `/flow`, `/prime` and `/handoff`: after G2, attended and overnight runs park a blocker, continue disjoint work and ask at the end; units advance on their own readiness instead of a wave barrier, and `/prime` surfaces the open questions from the handoff or the Execution Log (TASK-698).**
- **`docs/research/loop-audit-2026-11.md`: a ranked audit of the lane and loop workflow (TASK-697).**

## v2.27.0 — shorter skill descriptions and bodies, same behaviour (2026-11-21)

**MINOR** — no new skill; the roster stays at 16, and the standard is spec 0.21.0. Restart the session after installing.
Released on a Codex review of the shipped diff since v2.26.0 (R1 CLEAR, no findings) and the off-host gate. SPRINT-184
(TASK-684 to TASK-693) carries the before/after evidence; each trimmed skill was run on real input before and after the trim.

- **`/humanizer`: the inline commit-message path now reads the optional host glossary for Indonesian infra terms too; an absent glossary leaves the catalog defaults in use (TASK-688).**
- **`/council` and `/lean-doc-generator`: shorter descriptions, with every trigger kept (TASK-690).**
- **`/task-decomposer`, `/triage` and `/prime`: shorter skill bodies with unchanged behaviour; `/triage` now keeps its rejection procedure in its own `references/out-of-scope.md` (TASK-691).**
- **`/lean-doc-generator`: shorter skill body with unchanged behaviour; promote and close approval stops, retention rules and template requirements stay in place (TASK-693).**

## v2.26.0 — the dispatch trial is ruled: one opt-in cell kept, the rest back to defaults (2026-11-20)

**MINOR** — no new skill; the roster stays at 16, and the standard is spec 0.21.0. Restart the session after installing.
Released on a Codex review of the shipped diff since v2.25.0 (R1 CLEAR; its one Low, trial figures in the shipped cell
table, was fixed before the bump) and the off-host gate. SPRINT-181 (TASK-671) carries the per-cell evidence; its RTK and
graphify trials ship nothing (graphify Drop, RTK inconclusive, EPIC-026 closed).

- **`/orchestrator`: the model-and-effort trial is ruled. Only the intake draft check (strongest tier, blind Codex pair) is kept, opt-in per host; the other cells return to their defaults and the `dispatch-trial` declaration is retired (ADR-010, TASK-671).**
