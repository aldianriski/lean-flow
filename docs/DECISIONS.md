---
owner: Maintainer
last_updated: 2026-08-14
update_trigger: A new ADR is added under docs/adr/
status: current
---

# lean-flow — Decision Index

Index of Architecture Decision Records. Each ADR is its own append-only file in `docs/adr/`
(`templates/ADR.md.template`). This page only lists them — newest first; never duplicate ADR content.

| ADR | Title | Status | Date |
|---|---|---|---|
| [ADR-019](adr/ADR-019-todo-cap-320.md) | `TODO.md` cap ~150 → 320 soft — the entry schema costs more than the cap budgeted | accepted | 2026-08-14 |
| [ADR-018](adr/ADR-018-standard-implementation-split.md) | Extract the standard from the implementation; target fleet-scale adoption | accepted | 2026-08-10 |
| [ADR-017](adr/ADR-017-context-cap-150.md) | `CONTEXT.md` cap 130 → 150 — the file grows by design, not by duplication | accepted | 2026-08-10 |
| [ADR-016](adr/ADR-016-rollup-at-the-exit-path.md) | The night-run rollup is emitted by the launcher, not requested from the run | accepted | 2026-08-10 |
| [ADR-015](adr/ADR-015-cap-precision-and-grandfathering.md) | A stated cap is a real number; the grandfather file is hard-caps-only | accepted | 2026-08-10 |
| [ADR-014](adr/ADR-014-sprint-log-split.md) | Split the Execution Log into an uncapped `docs/sprint/logs/` sibling so the 400-line cap governs only the Plan | accepted | 2026-08-09 |
| [ADR-013](adr/ADR-013-machine-state-artifacts.md) | Machine-state artifacts: adopt conditioned execution-graph check · defer run-state (5-sprint expiry) · reject run events | accepted | 2026-07-30 |
| [ADR-012](adr/ADR-012-temidev-repo-structure-standard.md) | Adopt the TemiDev repo-structure standard as the consumer core (placement wins · lifecycle contract · tiered growth) | accepted | 2026-07-29 |
| [ADR-011](adr/ADR-011-no-gate-enforcement.md) | No gate enforcement: G1/G2 stay human discipline (no hook, no sibling plugin) | accepted | 2026-07-29 |
| [ADR-010](adr/ADR-010-model-dispatch-role-tiers.md) | Role-based model-dispatch tiers (slimmed adoption; no auto-ladder) | accepted | 2026-07-10 |
| [ADR-009](adr/ADR-009-knowledge-metadata-ssot.md) | Knowledge corpus: write-time metadata SSOT + a derived, on-demand graph view | accepted | 2026-07-02 |
| [ADR-008](adr/ADR-008-first-code-qa-check.md) | Admit the first executable code: a hybrid QA check (script + checklist) | accepted | 2026-06-21 |
| [ADR-007](adr/ADR-007-context-cap-ssot-density.md) | CONTEXT.md cap raised 100 → 130 (the SSOT is a denser doc-kind) | accepted | 2026-06-12 |
| [ADR-006](adr/ADR-006-skill-cap-executable-artifacts.md) | SKILL cap counts procedure only; executable artifacts in references/ | accepted | 2026-06-11 |
| [ADR-005](adr/ADR-005-flow-conductor-standalone-contract.md) | `/flow` opt-in conductor + the standalone contract | accepted | 2026-06-09 |
| [ADR-004](adr/ADR-004-council-opt-in-agent-aid.md) | Admit `/council` as an opt-in agent decision aid | accepted | 2026-06-09 |
| [ADR-003](adr/ADR-003-rich-per-file-adrs.md) | Rich, one-file-per-ADR + a DECISIONS index | accepted | 2026-06-09 |
| [ADR-002](adr/ADR-002-leverage-built-ins-ship-no-agents.md) | Leverage Claude built-ins; ship no agent definitions | accepted | 2026-06-09 |
| [ADR-001](adr/ADR-001-curated-not-copied.md) | Curated, not copied | accepted | 2026-06-09 |
