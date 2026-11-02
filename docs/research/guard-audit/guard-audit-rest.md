---
owner: Maintainer
last_updated: 2026-10-02
update_trigger: A guard is added, frozen or cut, or the audit is re-run
status: current
id: guard-audit-rest
tags: [tooling, process]
domain: governance
related: [guard-audit, guard-audit-legs, ADR-050]
---

# Research — Per-guard record: engine families, skill procedures, `test/` guards, the TS port and parity harnesses (32 rows of `guard-audit`)

> **Question.** For every guard outside the `qa-check.sh` legs: what did it catch, cost, and what do the class rules rule?
> **Verdict.** 22 keep · 7 freeze · 3 cut (E 11 keep · S 8 keep, 1 freeze, 1 cut · T 2 keep, 1 freeze · K 1 freeze · P 1 keep, 4 freeze, 2 cut).
> Legs: [`guard-audit-legs.md`](guard-audit-legs.md). Method and totals: [`guard-audit.md`](guard-audit.md).

## Why this matters
Engine rows are the adopter contract (ADR-043), so they decide where the full proof bar stays; the rest decide what can freeze or go.

## Options considered
- **A — Rule per engine `assert_*` (45 rows).** *Trade-off:* exact; every row is R1 keep, so no decision differs. **B — Group by § family (11, chosen).**

## Findings
Columns as in the legs record. Engine FAILs reach the gate as informational (leg 2f-ter), so E-row catches are the likeliest undercount.
Spec rows `S2.R-TEMPDIR`, `S11.EPIC`, `S11.RESEARCH` have no `assert_` in the engine, so legs 2b/2c/2d are not R5 duplicates of them.

| ID | Engine family (harness) | Catches (evidence) | Maint | Disp |
|---|---|---|---|---|
| E01 | S1.LAW2/LAW3 | >=1 (da72f59: 16 headers; SPRINT-075 T6 first live run: 28 gaps) | ~2 | R1 keep |
| E02 | S2.F-FILE, S2.R-PLACEMENT (A s2-placement) | 0 | ~3 | R1 keep |
| E03 | S3.AGENTS, S3.SCHEMA | shares E01's da72f59 event | 0 | R1 keep |
| E04 | S4.* (A s4-ts-evaluators, which names 9 `packages/standard` rule tests + the 2 `test/` files below; O adr-family; `test/adr-family-harness-parity`, `test/s4-retained-fixtures`) | 0 | ~3 | R1 keep |
| E05 | S6.BASE/BACKEND/MEDIUM/MULTISVC | 0 (lean-flow declares no tier, L-016) | ~2 | R1 keep |
| E06 | S9.* (A spec-reduction, gates-signed; O sprint-family ~137-184 s) | >=4, all VERIFYCLAUSE (SPRINT-081, 087) | ~6 | R1 keep |
| E07 | S10.* | >=1 (S10.TDAGING x4 at SPRINT-087 close; routes disagree) | ~2 | R1 keep |
| E08 | S11.* | >=1 (SPRINT-080 T2: 38 changelog files without a link line) | ~6 | R1 keep |
| E09 | S12.* | 0 (unexercised on real input) | ~1 | R1 keep |
| E10 | S13.* (O attestation) | 0 | ~2 | R1 keep |
| E11 | plumbing (A conformance-engine, foreign-repo, spec-reader, git-availability) | 0 | >=10 | R1 keep |

| ID | Guard (profile · harness) | Cons | Catches (evidence) | Maint | Rule → disp |
|---|---|---|---|---|---|
| S01 | dispatch preflight (A dispatch-preflight) | yes, `dispatch.md` | >=8 (SPRINT-055 HALT on the Plan's own gap, L-099; 069 HALT on 7 findings) | ~9 | R1 keep |
| S02 | skill freshness (A skill-freshness) | yes, `night-run.md` | >=3 (SPRINT-041 BLOCK 1.22.0 != 1.23.0; SPRINT-039) | ~3 | R1 keep |
| S03 | night-run family (A gate-exception, outcome, reap-terminal, revise-loop-ceiling) | skill names `night-run.sh` | 0 | ~8 | R1(b) keep (**owner-ruled** Q10) |
| S04 | worktree usability + base (A usability; O worktree-base) | yes, `dispatch.md` | 1 (SPRINT-110 T4 `worktree-base-stale`, e4fba9c, L-219) | ~2 | R1 keep |
| S05 | run-mode resolver (A run-mode) | skill names it (`night-run.md:24`) | 0 (thin) | ~1 | R1(b) keep (**owner-ruled** Q10) |
| S06 | sprint-close + sprint-log-layout (A x2) | no | 0 (fixtures of legs) | 0 | R4 freeze |
| S07 | emitter-column (A) | no | n/a, tests code | ~3 | R6 keep |
| S08 | layout + v1-to-v2 migrate (A x2) | migrate path | n/a, tests code | ~2 | R6 keep |
| S09 | work-store tooling (O work-store, orchestrator-store; A readers, writers, qa-store-legs) | no | n/a, live since SPRINT-106 | ~6 | R6 keep |
| S10 | FROZEN v1 park/retry selftests (X x4 + 4 `assert-*.sh` subjects, 1,403 lines) | no | 0 (SPRINT-039's catch was an induced run on a throwaway repo) | 1 | R3 cut |
| T01 | `test/architecture` unwired-exports + dependency-direction | no | 0 (first run reproduced TD-103, still open) | ~5 | R4 → **owner: keep** |
| T02 | `test/gate-discovery` | no | 0 | ~2 | R4 freeze |
| T03 | `qa-verdict.ts` (`qa-verdict.test.ts`) | no | >=2 run-level (SPRINT-099 truncated runs read as pass; SPRINT-109, L-218) | ~4 | R2 keep |
| K01 | TS engine port: `packages/standard` (40 src files, 4,005 lines; 30 tests, 6,797 lines) + `apps/cli` (S4 · S12 · F4 · F12 rules). **Freeze covers 61 files** (19 packages tests, 2 apps tests, 40 sources); the 11 S4 tests named by the E04/P5 harnesses belong to those rows | no (`conformance.sh` runs Shell only; `bun test` only) | 0 on a skim of its 35 commits (last 2026-08-29); not ledger-mined | not tallied | R4 freeze (**owner-ruled**: freeze now; cut-or-finish is EPIC-014's decision) |
| P1 | authority-differential (O, 55 s) | oracle no | not mined | not tallied | R6 freeze (**owner-ruled**) |
| P2 | doc-caps-differential (O, 80 s) | oracle no (see G01) | not mined | not tallied | R6 freeze |
| P3 | night-run-rollup-differential-parity (O, 78 s) | oracle no | not mined | not tallied | R6 freeze |
| P4 | layers-observed-differential (X, 154 s; no runner of any kind) | oracle no | not mined | not tallied | R6 cut (**owner: cut**) |
| P5 | s4-differential-parity (O; names 2 `packages/standard` tests: `adr-family-fixtures.test`, `s4-append-oracle.test`) | oracle = the engine | not mined | not tallied | R1 keep |
| P6 | `epic-archive-differential.test.ts` (`bun test` discovers it, so a runner exists) | oracle no | not mined | not tallied | R6 freeze |
| P7 | `layers-completeness-differential.ts` (251 lines; "run standalone", no runner) | oracle no | not mined | not tallied | R6 cut (**owner-ruled**; no runner of any kind) |

## Recommendation
Rows E, S, T, K, P follow the class rules in `guard-audit.md`; every exception (Q1-Q10) is owner-ruled there.

## Out of scope / open questions
- P1-P7 and K01 got no ledger mining (added by the third selector late); their catch columns are `not mined`, not `0`.
