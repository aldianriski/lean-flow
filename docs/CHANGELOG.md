---
owner: Maintainer
last_updated: 2026-06-11
update_trigger: Sprint completed and changes reflected in docs
status: current
---

# lean-flow — Changelog

<!-- Prepend new sprints — newest first. Append-only; never edit past blocks. -->

---

## Sprint 003 — Validate & Harden (closed 2026-06-11)

Every shipped component exercised once on real input — TD-001 (spec-only debt) fully resolved.
Docs-only diff in lean-flow itself; **no version bump** (v0.2.0 stands).

| Validated | Evidence |
|---|---|
| `migrate` | full apply on a dev-flow copy via a sonnet executor — 15-ADR split · 44 sprints archived · zero deletions (diff + hash verified) |
| `/council` | first live run (5 advisors + 5 peer reviews + chairman) on the TASK-005 question → **ADR-006** (cap counts procedure only; executable artifacts in references/) |
| streams | two-stream test repo: per-stream prime count · asks-which guard · overlap flag · single-stream zero-diff |
| fresh install | cache 0.1.0→0.2.0; cold agent ran prime→decompose→quick→commit from cached specs; 7 spec frictions logged → TASK-019 |
| full loop | umkm-indo form-validation feature start-to-close on v0.2.0 — grill at intake, §2 placement, §11 archive all observed working |

---

## v0.2.0 — Dogfood fixes (2026-06-11)

MINOR release — the first feedback-driven iteration. Ships the four Sprint-002 changes (detailed in
the sprint block below): canonical doc placement (DOCS_Guide §2 Place column) · the grill at intake ·
optional parallel streams · §11 retention + doc-aging. Manifests bumped in lockstep
(`plugin.json` + `marketplace.json` → 0.2.0); skill versions: prime · task-decomposer · orchestrator ·
flow → 0.2.0, lean-doc-generator → 0.4.0.

---

## Sprint 002 — Dogfood Fixes (closed 2026-06-11)

The four dogfood frictions (L-001…004) fixed in the standard and its consuming skills:

| Area | What |
|---|---|
| Placement (T1) | DOCS_Guide §2 gains a **Place** column — root: README · TODO / `.claude/`: CLAUDE · CONTEXT / `docs/`: the rest; `/prime` · `migrate` · `/release-patch` aligned; self-applied (`DECISIONS.md` → `docs/`) |
| Grill (T2) | the detailed grill moved to `/task-decomposer` intake (escape hatch tightened); orchestrator G2 = residual check; an open assumption **blocks** G2 |
| Streams (T3) | optional `stream:` frontmatter — one active sprint per stream, per-stream TODO pointers, cross-stream overlap guard; single-stream repos unchanged |
| Retention (T4) | DOCS_Guide **§11** — ledger retention triggers; doc-aging at promote beside TD aging; close-time tombstone-prune + sprint archive → `docs/sprint/archive/` + `INDEX.md` |

Versions: prime · task-decomposer · orchestrator · flow → 0.2.0; lean-doc-generator → 0.4.0.
End-of-sprint `/code-review` (7 finders): 6 findings fixed (`007869e`).

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
