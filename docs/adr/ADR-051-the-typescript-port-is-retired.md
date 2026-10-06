---
id: ADR-051
tags: [tooling, process]
domain: governance
status: accepted
related: [ADR-035, ADR-038, ADR-039, ADR-050, ADR-033, ADR-034, ADR-043]
---

# ADR-051 — The TypeScript port of the conformance engine is retired; the Shell engine is the only engine

- **Status:** accepted (2026-10-06, owner)
- **Deciders:** Maintainer
- **Context driver:** a frozen second engine that nobody runs, while EPIC-014 D2 names "two permanent semantic engines" as the failure mode

## Context

EPIC-014 began a strangler migration of the conformance engine to TypeScript on Bun (ADR-035). It closed two of its eight
conditions (the Standard parsed to a typed model, SPRINT-085; targeted and full runs in TS, SPRINT-091), then stopped. The
remaining six are the expensive ones: per-family parity, QA profiles, the authority cutover with Shell deleted, one result feeding
both renderers, a before/after performance report, and compiled binaries so a consumer never needs Bun (D6). SPRINT-112's guard
audit froze the port as K01 instead of cutting it, so the epic could rule on its own direction (TASK-399).

**Measured blast radius** (`git ls-files`, 2026-10-06): `packages/standard` 68 files and `apps/cli` 4 files (10,802 lines),
plus 31 of `test/`'s 40 files that exist only for the port (`test/architecture/` 4 · `test/fixtures/architecture/` 14 ·
`test/fixtures/unwired-exports/` 9 · four `test/` files importing `packages/standard`). That is **103 files**, plus 2 gate
harnesses (`evals/run-s4-ts-evaluators.sh` · `evals/run-s4-differential-parity.sh`). Nothing outside those trees imports
them, no adopter runs the port, and it has not changed since 2026-08-29. The Shell engine kept authority throughout (D2).

## Decision

**Retire the port. The Shell engine (`scripts/lib/conformance-engine.sh`, reached through `conformance.sh`) is the only
conformance engine.** Owner ruling at SPRINT-116 G2. EPIC-014 closes as retired: its six open conditions are marked *dropped
by ADR-051*, not ticked, which is a recorded exception to "an epic closes only when every condition is `[x]`".

What goes, and what replaces it:

| Deleted | Replaced by |
|---|---|
| `packages/standard/` · `apps/cli/` | nothing; the Shell engine already holds authority |
| `test/architecture/` and its fixtures (dependency direction, unwired exports) | nothing; their only subject was the port. See the wiring cost below |
| `test/s4-retained-fixtures.test.ts` · `test/adr-family-harness-parity.test.ts` · `test/fixtures/adr-family-factory.ts` · `test/fixtures/git-repo-factory.ts` | `evals/run-adr-family-fixtures.sh` over the same nine retained `evals/fixtures/adr-family/` cases |
| `evals/run-s4-ts-evaluators.sh` (E04, §4's **only** default-profile coverage) | `evals/run-adr-family-fixtures.sh` moves back to the **always-on** set (owner ruling), at about 23–28 s per default run, the cost SPRINT-092 had removed |
| `evals/run-s4-differential-parity.sh` (P5) | nothing; with one engine there is nothing to compare |

What stays: `test/gate-discovery/` (it guards ADR-033's rule that `package.json`'s `test` script runs the gate), every standalone
`scripts/**/*.ts` and `evals/**/*.ts`, the other differential harnesses, which compare `scripts/lib` ports with their `.sh`
oracles and are frozen under ADR-050 clause 3 (P1 · P2 · P3 · P6), `evals/fixtures/compat/` (ADR-034's rule-ID denominator still
holds), and `package.json`, without its now-empty `workspaces`.

## Relationship to existing decisions (L-220 pre-check)

| Decision | Effect of ADR-051 | Amend path |
|---|---|---|
| ADR-035 (TS/Bun reference engine) | **Superseded in part**: the engine decision. Its zero-dependency and manifest clauses stay live, because `scripts/` and `evals/` still run TypeScript on Bun | `DECISIONS.md` row marked |
| ADR-038 (composed multi-family dispatch) | **Superseded**: it binds code in `packages/standard/src/registry.ts` that is deleted | status → superseded |
| ADR-039 (§4 parity opt-in, mandatory at promote/close) | **Superseded**: the pair it governs is gone. `QA_FULL=1` stays mandatory at promote and close for the rest of the opt-in set | status → superseded; `CONTEXT.md` § Sprint model reworded |
| ADR-050 clause 3 (one parity pair kept) | **Narrowed to zero pairs**: the kept pair was the port; the frozen pairs are unchanged | this table; no edit to ADR-050 |
| ADR-034 (compatibility contract) | **Unchanged** as a contract; the migration it measured is retired | none |
| ADR-033 · ADR-037 · ADR-043 · ADR-049 | **Unchanged** | none |

## Consequences

**Positive:** one engine and one set of semantics, so the parity window ADR-039 named closes for good. 103 files and two gate
harnesses fewer. 13 debt rows whose subject lived only in the port resolve, and two more (TD-118, TD-165) keep only their Shell half. TD-168 (the engine's per-file spawn cost) gets
a direct fix path in the engine adopters actually run, instead of waiting on a port.

**Negative (trade-offs accepted):**
- The default gate is about 23–28 s slower, because §4 coverage moves back to the Shell harness.
- `CLAUDE.md`'s wiring-check DoD line ("derive it, do not ask it") loses its only mechanism: `test/architecture/unwired-exports.ts`
  scanned `packages/` and `apps/` only, so the derivation is manual again. **Re-file fresh if** exported TypeScript modules grow
  under `scripts/` or `evals/`, by retargeting a detector there.
- The typed Standard model (SPRINT-085) and its parser are gone; a future port restarts from the Shell engine.
- The consumer-side Bun question (D6) is never answered; adopters keep needing only `sh`, plus Bun for the v2 member lookup (ADR-049).

## Alternatives considered

| Option | Why rejected |
|---|---|
| Finish the whole epic | six expensive conditions, including compiled binaries, with no adopter asking, competing with workdoo's three epics |
| Narrow the epic to porting the hot path (TASK-393, carrying TD-168) | keeps two engines while the port is under way, which D2 names as the failure mode; the spawn cost can be cut in Shell |
| Keep it frozen (K01's status quo) | leaves 13 port-only debt rows and the parity window undirected, the very parked question this ADR closes |
| Leave §4 coverage QA_FULL-only | a §4 regression in logic adopters run would sit unseen between full runs (owner ruling) |
