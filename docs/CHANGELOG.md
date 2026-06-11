---
owner: Maintainer
last_updated: 2026-06-11
update_trigger: Sprint completed and changes reflected in docs
status: current
---

# lean-flow — Changelog

<!-- Prepend new sprints — newest first. Append-only; never edit past blocks. -->

---

## Sprint 001 — Ship & Validate (closed 2026-06-11)

Shipped v0.1.0 to GitHub (`aldianriski/lean-flow`, public) · backfilled ADR-001…005 + the
`DECISIONS.md` index · dogfooded the loop on a real project — four frictions surfaced and routed
per §10 (L-001…004 → TASK-009…012: doc placement · grill-at-intake · parallel streams · retention).
First full promote → execute → close lifecycle run.

---

## v0.1.0 — Initial build (2026-06-09)

First cut of lean-flow — the curated, lean distillation of dev-flow. Built component-by-component
with each addition reviewed against "genuinely useful · important · actually used" before adding.

**Skills (13):** `/flow` (conductor) · `/prime` · `/lean-doc-generator` · `/orchestrator` ·
`/task-decomposer` · `/triage` · `/prototype` · `/tdd` · `/diagnose` · `/refactor-advisor` ·
`/release-patch` · `/handoff` · `/council` (opt-in decision aid).

| Area | What |
|---|---|
| Core loop | `/prime → /lean-doc-generator → /orchestrator → repeat`; `/flow` conducts it; standalone contract (skills require nothing of each other) |
| Doc standard | LEAN DOCUMENTATION STANDARD (`DOCS_Guide.md`) + 11 canonical templates; rich per-file ADRs in `docs/adr/` + `DECISIONS.md` index |
| Governance | §10 continuous learning — Sprint-Close Retro routes to CHANGELOG / `TD-NNN` / `TASK-NNN` / `LEARNINGS.md`; promote-time review (recurrence ≥2 → durable rule; debt aging) |
| Sprint model | `TODO.md` = Backlog pool; `docs/sprint/SPRINT-NNN` = active working doc (`SPRINT.md.template`) |
| Adopt | `/lean-doc-generator migrate` aligns existing dev-flow / adlc-flow / ad-hoc docs to the standard (HITL, surgical) |
| Built-in leverage | ships **no agent definitions**; dispatches Claude built-ins in isolated passes (`Explore` · `/code-review` · `/verify` · `/security-review`) + wires `/goal` · `/plan` · `/batch` · `/loop` · `/run` · `/simplify` |
| Provenance | distilled from dev-flow; techniques adapted from mattpocock/skills (grill-with-docs · handoff · triage · tdd · diagnose · improve-codebase-architecture · prototype · to-prd/to-issues) + Karpathy behavioral guidelines + LLM-council |

**Not done (tracked in `TODO.md`):** never run / committed yet · `migrate` + `/council` spec-only ·
ADR backfill for the build's own decisions · council over the line cap.
