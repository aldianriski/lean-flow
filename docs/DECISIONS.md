---
owner: Maintainer
last_updated: 2026-08-15
update_trigger: A new ADR is added under docs/adr/
status: current
---

# lean-flow — Decision Index

Index of Architecture Decision Records. Each ADR is its own append-only file in `docs/adr/`
(`templates/ADR.md.template`). This page only lists them — newest first; never duplicate ADR content.

| ADR | Title | Status | Date |
|---|---|---|---|
| [ADR-029](adr/ADR-029-tiered-verification-ceremony.md) | Verification ceremony tiers by failure visibility (G guard · X executable · P prose) — the full fixture/discrimination discipline concentrates on guards | accepted | 2026-08-23 |
| [ADR-030](adr/ADR-030-epic-files-split-their-series.md) | Epic files split their append-only series into an uncapped `docs/epic/logs/` sibling (ADR-014's mechanism, third application) rather than raising the 200 cap | accepted | 2026-08-23 |
| [ADR-028](adr/ADR-028-two-marks-for-rules-no-adopter-can-clear.md) | Two marks for rules no adopter can clear: §14 gains `restated` (7 rules whose constraint another rule checks -- §8's answer one level down) and `standard-directed` (4 that govern this document, not a repository). Eleven rules stop reporting as `rule-unimplemented`; checkable 62 -> 51, classification unchanged at 100 | accepted | 2026-08-23 |
| [ADR-027](adr/ADR-027-executable-code-becomes-consumer-facing.md) | Executable code here is consumer-facing: ADR-008 amended (not superseded), and its CI sentence ruled -- the engine's exit code is a documented contract an adopter may gate on (non-zero iff a FAIL line printed), while the pipeline stays theirs; lean-flow ships no workflow and never blocks on conformance | accepted | 2026-08-20 |
| [ADR-026](adr/ADR-026-standard-carries-no-line-cap.md) | `spec/STANDARD.md` gets a §2 row whose cap is **no numeric cap** — §2's cap-hit→split escape is unavailable to a file adopters pin by path, whose split target escapes the non-recursive cap glob (TD-061), and whose rule ids are cross-section; the governor is §14's rule table | accepted | 2026-08-16 |
| [ADR-025](adr/ADR-025-git-native-attestation-format.md) | HITL attestation is three git trailers on the task's own commit (`Gate-Signed-By:` · `Gate:` · `Evidence:`), specified in `spec/` §13; unsigned it is a claim, not proof, so Attested is unreachable by trailers alone | accepted | 2026-08-16 |
| [ADR-024](adr/ADR-024-conformance-levels.md) | Three conformance levels — Structural → Gated → Attested, each checkable from a different evidence class (tree · record · signature) | accepted | 2026-08-16 |
| [ADR-023](adr/ADR-023-context-becomes-consumer.md) | CONTEXT.md becomes a consumer of the extracted spec (`spec/` is the SSOT for standard-owned rules; move+cite atomic extraction commits) | accepted | 2026-08-15 |
| [ADR-022](adr/ADR-022-unattended-retry-mechanical-carve-out.md) | Unattended retry: mechanical-trigger carve-out only (three prior human decisions required; critic judgment always parks; no declared policy = never) | accepted | 2026-08-15 |
| [ADR-021](adr/ADR-021-evidence-gates-the-silent-path.md) | Mechanical evidence gates the silent path, never the owner (a named check's FAIL blocks a quiet DoD tick; consumer CI stays suggestion-only) | accepted | 2026-08-15 |
| [ADR-020](adr/ADR-020-research-cap-and-frozen-verdicts.md) | Research cap 120 → 130 soft; a `status: superseded` verdict is frozen, not capped | accepted | 2026-08-14 |
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
