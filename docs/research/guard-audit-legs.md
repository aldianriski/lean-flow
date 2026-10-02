---
owner: Maintainer
last_updated: 2026-10-02
update_trigger: A gate leg or checker is added, frozen or cut, or the audit is re-run
status: current
id: guard-audit-legs
tags: [tooling, process]
domain: governance
related: [guard-audit, ADR-050]
---

# Research — Per-guard record: the gate legs and checkers (28 rows of `guard-audit`)

> **Question.** For each `qa-check.sh` leg and its checker: what real defects did it catch, what has it cost, and what disposition do the class rules give?
> **Verdict.** 17 keep · 11 freeze · 0 cut. Companion of [`guard-audit.md`](guard-audit.md) (method, class rules, totals); engine, procedure and parity rows in
> [`guard-audit-rest.md`](guard-audit-rest.md); harness runtimes in [`guard-audit-runtime.md`](guard-audit-runtime.md).

## Why this matters
The class rules are applied here row by row, so each disposition can be checked against its cited evidence rather than taken from a summary.

## Options considered
- **A — One table inside `guard-audit.md`.** *Trade-off:* one read; breaks the §2 research cap (130). **B — Family companions (chosen).** *Trade-off:* three files, each capped.

## Findings
*Cons* = `conformance.sh` executes it, or a shipped skill names it as an adopter-run step's mechanism (R1). *Catches* = guard FAIL on a REAL artifact that
preceded a fix. *Maint* = defects in the guard itself; `~` = lower bound from commit subjects and ledger rows; `unk` = no derivable record. Cites are a sha,
`L-NNN`, `TD-NNN` or `SPRINT-NNN`. Profile A always-on · O opt-in. Rules in order R1 > R2 > R5 > R3 > R4. Owner rulings 2026-10-02 are marked.

| ID | Guard (profile · harness) | Cons | Catches (evidence) | Maint | Rule → disp |
|---|---|---|---|---|---|
| G01 | doc caps + token budget, leg 1 (A doc-caps-fixtures) | no (`qa-check.sh:166` only; engine mentions are comments) | >=3, mostly soft OVER-CAP reports acted on (SPRINT-058 T1 4 breaches; SPRINT-076 EPIC-004 201>200); no hard-cap FAIL | >=6 (L-103a, a33732e) | R2 → keep |
| G02 | count-claims, leg 2 (A count-claims-fixtures) | no | >=2, first live run (L-102: 6 drifted claims) | ~2 | R2 → keep |
| G03 | epic retention + rollup, leg 2b (A epic-archive-fixtures) | no | >=4 (de7ec68 EPIC-001 unarchived 5 sprints; SPRINT-094 T1) | ~10 | R2 → keep |
| G04 | prose density, leg 2b-ter (A prose-density-fixtures) | no | >=2, self-authored (SPRINT-105 805-char line; 165a569) | >=8 | R2 → keep |
| G05 | handoff state, leg 2b-bis (A handoff-state-fixtures) | no | 0 (SPRINT-094 log: never fired on live input) | ~8 | R4 → freeze |
| G06 | research retention, leg 2c (A research-archive-fixtures) | no | 0 (L-102: "nothing to do") | ~3 | R4 → freeze |
| G07 | ephemeral intake, leg 2d (A ephemeral-intake-fixtures) | no | 0 (only 5 false FAILs, SPRINT-086; TD-053) | ~4 | R4 → freeze |
| G08 | task origin, leg 2e (A task-origin-fixtures) | no | 7, all on the retired TODO.md Backlog (L-102); 0 on the store it reads now | ~3 | R4 → freeze (**owner: freeze**) |
| G09 | frontmatter/ownership, leg 3 (A ownership-header-fixtures) | no | 0 own (the 16 headers were the engine's S1.LAW3/S3.SCHEMA, da72f59) | ~2 | R4 → freeze |
| G10 | knowledge index freshness/refs, leg 4 (A gen-index-locale-fixtures) | no | >=4 (SPRINT-024; SPRINT-083 close: stale index, invented tags, dangling `related:`) | ~4 | R2 → keep (**owner: keep, and keep S4.INDEX**) |
| G11 | README footer + manifest lockstep, legs 6/6b (A manifest-lockstep-fixtures) | no | >=3 (L-048; SPRINT-083; L-180 v1.61.0 bumped 2 of 4) | ~2 | R2 → keep |
| G12a | L-NNN citation lint, leg 10 | no | >=1 (SPRINT-083 close: 51 unresolved cites = a NUL byte in LEARNINGS.md) | ~2 | R2 → keep |
| G12b | QA.md hygiene, leg 9 | no | unk | ~0 | R4 → freeze |
| G12c | archive-predicate singularity, leg 10b (TD-145) | no | 0 (guards a revert that never occurred) | ~2 | R4 → freeze |
| G13 | active-sprint task schema, leg 11 | no | unk (no FAIL on a real sprint on record) | ~1 | R4 → freeze |
| G14 | TypeScript typecheck, leg 11b (A typecheck-population-fixtures) | no | >=2 (095ba3b TS2345; SPRINT-104 T1 TS18047) | ~3 | R2 → keep |
| G15a | eval-harness list-vs-disk, leg 12 | no | >=4 events, ~10 unregistered harnesses (L-196, L-213, 5b415d4) | ~3 | R2 → keep |
| G15b | park-record cue, leg 13 (TD-019) | no | 0 | ~0 | R4 → freeze |
| G16 | layers completeness, leg 14 (A layers-completeness-fixtures; `.test.ts`) | no | >=3 (SPRINT-074 Plan contradiction; L-167 x3) | ~9 | R2 → keep |
| G17 | authority class, leg 14-bis (A authority-fixtures; `authority.test.ts`) | no | **1** (L-176 / 0e2ae9d: `authority-j2-not-parked` fired on a false execution tag in SPRINT-090's log; the tag was withdrawn; shape still checked at `check-authority.ts:164`) | ~5 | R2 → keep (Codex finding 1 confirmed; **owner-ruled** Q7) |
| G18 | approval envelope, leg 14-ter (A approval-envelope-fixtures) | skill names it (`night-run.md:224`) | 0 | ~2 | R1(b) → keep (**owner-ruled** Q10) |
| G19 | layers observed vs diff, leg 15 (O layers-observed-fixtures) | no | >=9 sprints, all `Layers:` lines corrected (L-100) | ~20 | R2 → keep |
| G20 | DoD delta, leg 16 (A dod-delta-fixtures; `dod-delta.test.ts`) | no | 0 (6a6aeac is a historical fixture) | ~8 | R4 → freeze |
| G21 | gate runtime budget (A qa-budget-fixtures, -default-; O -position-) | no | 0 strict; 1 report (SPRINT-086 T3 tripped at 461 s) | ~8 | R4 → freeze (**owner: freeze**) |
| G22 | sprint-by-reference (`check-sprint-by-reference.ts`; O by-reference-fixtures) | yes, spawned at `conformance-engine.sh:2171` | 0 (clean re-runs only) | ~15 | R1 → keep checker; **owner: freeze the harness** (328 s) |
| G23 | recorded-run rollup, leg 2g (A night-run-rollup-fixtures; `night-run-rollup.test.ts`) | no (skill names `night-run.sh` only) | >=1 (SPRINT-082 rollup rewritten); 2 misfires (L-177, L-197) | ~10 | R2 → keep (**owner: keep; re-rule at the next audit**) |
| G24 | review depth (A review-depth-fixtures) | skill names it | >=3 (SPRINT-087 T8; SPRINT-091 12 FAILs "correct", close blocked) | ~6 | R2 → keep |
| G25 | mechanical Verify reaches, leg 2c-bis (A verify-reaches-fixtures, system-verify-fixtures) | skill names it (`orchestrator/SKILL.md:50`, `review-scoping.md:218`) | 0 (every FAIL overridden or ruled a false positive: TD-086/087) | ~8 | R1(b) → keep (Codex finding 2 confirmed; **owner-ruled** Q10) |

Totals: keep 17 (R1: G18 G22 G25 = 3 · R2: 14) · freeze 11 (all R4).
