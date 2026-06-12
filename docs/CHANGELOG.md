---
owner: Maintainer
last_updated: 2026-06-12
update_trigger: Sprint completed and changes reflected in docs
status: current
---

# lean-flow — Changelog

<!-- Prepend new sprints — newest first. Append-only; never edit past blocks. -->

---

## v1.0.0 — First stable (2026-06-12)

MAJOR milestone — lean-flow is production-ready. TASK-017 (v1.0 checklist) closed: every prior TD
resolved (TD-001…005), the doc/skill set consistency-checked (all ADRs indexed, every skill
`references/` pointer resolves), manifests bumped **1.0.0 lockstep**. Rolls up v0.3.0–v0.3.2:

| Area | State at 1.0 |
|---|---|
| Token discipline | model-tier routing + diff-scoped review + review-depth scaling (single reviewer for small/med, `/code-review` fan-out for large/high-risk) |
| Skills | 13 (11 stages + `/flow` + `/council`); `/council` conformed under ADR-006; all caps honoured |
| Docs standard | DOCS_Guide + 12 templates (incl. optional DESIGN.md); CONTEXT SSOT deduped (ADR-007) |
| Lifecycle | promote → sprint-bulk → close → release, with §10 governance + §11 retention; close routes PATCH vs MINOR |
| migrate | adopt + clean (consolidate / retire, gated) — validated on real input |

7 ADRs · learnings L-001…L-008 · no open tech debt. P3 backlog (hooks / recon / insights) parked.

---

## v0.3.2 — Review Depth & Context Diet (2026-06-12)

PATCH — fixes/refactor. Ships SPRINT-006 (block below): review depth scaled to diff size (single scoped
`sonnet` reviewer for small/medium; `/code-review` finder fan-out reserved for large/high-risk — closes
the v0.3.1 token-waste gap) · `.claude/CONTEXT.md` dedup diet 151 → 127 + cap raised 100 → 130
(**ADR-007**), resolving TD-005. Manifests → 0.3.2 lockstep.

---

## Sprint 006 — Review Depth & Context Diet (closed 2026-06-12)

| Shipped | What |
|---|---|
| Review depth | `review-scoping.md` "Scale depth to diff size" — small/med → one scoped `sonnet` reviewer; `/code-review` fan-out only for large/high-risk; fixed the imprecise skip-table row |
| CONTEXT diet | dedup 151 → 127 (prose duplicating CLAUDE.md/README → pointers; no info lost) + cap 100 → 130 (**ADR-007**) — **TD-005 resolved** |

L-008 logged (SSOT dedup hygiene). **TASK-017 (v1.0) is now fully unblocked** — TASK-005 + TD-005 both done.

---

## v0.3.1 — Conform & Validate (2026-06-12)

PATCH — fixes/refactor sprint (no new capability), bumped by hand per the close routing T2 added.
Ships SPRINT-005 (block below): `/council` conformed under ADR-006 (TD-002 + TD-004 resolved) ·
close→release-patch handoff fixed (sprint-range scan + PATCH/MINOR routing) · migrate consolidation +
changelog-only + diff-scoped review exercised on real input (+ an out-of-scope-filter refinement).
Manifests → 0.3.1 lockstep.

---

## Sprint 005 — Conform & Validate (closed 2026-06-12)

| Shipped | What |
|---|---|
| `/council` conform | artifacts → `council/references/`; SKILL 341 → 60; cap rule amended (ADR-006) — **TD-002 + TD-004 resolved** |
| close→release-patch | scans `plan_commit..HEAD` at close; routes fixes→PATCH / features→MINOR by hand (the gap hit at SPRINT-004 close) |
| migrate (validated) | detect on umkm-indo caught an adlc-flow false positive (gate held); apply-path on a fixture (consolidate/retire/archive/gated hard-delete, zero un-approved deletions); + out-of-scope-filter refinement |
| release (validated) | changelog-only (no bump) + diff-scoped review skip-table confirmed on a manifestless fixture |

L-007 promoted at this sprint's promote → CLAUDE.md anti-pattern. TD-005 (CONTEXT cap) still open.

---

## v0.3.0 — Token & Doc Hardening (2026-06-12)

MINOR release — new capabilities, so not a PATCH; bumped **by hand** (`release-patch` is PATCH-only).
Ships SPRINT-004 (block below): model-tier routing + diff-scoped review (token discipline) · 9
spec-polish frictions · release-patch changelog-only mode + close auto-handoff · optional
frontend-only DESIGN.md template · migrate "adopt + clean" consolidation. Manifests bumped in lockstep
(`plugin.json` + `marketplace.json` → 0.3.0). Skill `version:` frontmatter left untouched (owner call).

---

## Sprint 004 — Token & Doc Hardening (closed 2026-06-12)

Cut the post-change token cost and hardened the doc/flow specs from the owner's improvement list.
Five tasks; two (T2 spec-polish, T4 DESIGN template) ran on `sonnet` subagents — the hybrid
tier-routing, which also dogfooded T1's own contract.

| Shipped | What |
|---|---|
| Token discipline | model-tier map (`CONTEXT.md`) + diff-scoped review & skip table (`orchestrator/references/review-scoping.md`); orchestrator 107 ≤ 110 — **TD-003 resolved** |
| Spec-polish | 9 cold-run frictions across prime · task-decomposer · orchestrator · README · TODO template · migration-map |
| release-patch | close now **invokes** it; **changelog-only mode** for manifestless repos + worked examples |
| DESIGN.md | optional, frontend-only design-system / token template (genericized) + DOCS_Guide carve-out |
| migrate | **adopt + clean** — consolidation sweep (dupes / orphans / stale → consolidate · retire, gated) |

Follow-ups filed: TASK-023 (exercise migrate consolidation) · TASK-024 (exercise changelog-only +
diff-scoped review on real code). Learning L-007 (spec-only shipments). TD-005 bumped to medium.

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
