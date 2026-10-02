---
owner: Maintainer
last_updated: 2026-10-02
update_trigger: a guard is added, frozen or cut, or the audit is re-run
status: active
id: guard-audit-log
tags: [tooling, process]
domain: governance
related: [guard-audit]
---

# Guard audit — the per-guard table (SPRINT-112 T1)

> Uncapped companion to [`../guard-audit.md`](../guard-audit.md) (STANDARD §2 `research/logs/`). Method, class rules, totals and the owner
> questions live there. **Columns.** *Cons* = reached by the adopter-run engine / a shipped skill procedure (ADR-043). *Catches* = guard FAIL on
> a REAL artifact that preceded a fix. *Maint* = defects in the guard itself (review, first live run, seeded break); `~` = lower bound from
> commit subjects + ledger rows. `unk` = no derivable record. *Rule* = the class rule applied, in order R1 > R2 > R5 > R3 > R4 (R6 is a
> row-type rule). Evidence cites a commit sha, `L-NNN`, `TD-NNN` or `SPRINT-NNN`; the two routes (git, ledgers) agree unless a row says so.
> **Profile:** A = always-on · O = opt-in (`QA_FULL=1`) · X = excluded · leg = a `qa-check.sh` leg · E = engine.

## Gate legs and checkers (28)

| ID | Guard (profile · harness) | Cons | Catches (evidence) | Maint | Rule → disp |
|---|---|---|---|---|---|
| G01 | doc caps + token budget, leg 1 (`check-doc-caps`; A doc-caps-fixtures) | yes, engine-called | >=3, mostly soft OVER-CAP reports (SPRINT-058 T1; SPRINT-076 EPIC-004 201>200) | >=6 (L-103a, a33732e) | R1 → keep |
| G02 | count-claims, leg 2 (A count-claims-fixtures) | no | >=2, first live run (L-102: 6 drifted claims, SPRINT-055) | ~2 | R2 → keep |
| G03 | epic retention + rollup, leg 2b (A epic-archive-fixtures) | no | >=4 (de7ec68 EPIC-001 unarchived 5 sprints; SPRINT-094 T1 EPIC-014/015) | ~10 | R2 → keep |
| G04 | prose density, leg 2b-ter (A prose-density-fixtures) | no | >=2, both self-authored (SPRINT-105 805-char line; 165a569) | >=8 (a33732e) | R2 → keep |
| G05 | handoff state, leg 2b-bis (A handoff-state-fixtures) | no | 0 (SPRINT-094 log: never fired on live input) | ~8 (9ee8493) | R4 → freeze |
| G06 | research retention, leg 2c (A research-archive-fixtures) | no | 0 (L-102: "nothing to do"; no archive ever forced) | ~3 | R4 → freeze |
| G07 | ephemeral intake, leg 2d (A ephemeral-intake-fixtures) | no | 0 (record is 5 false FAILs, SPRINT-086; TD-053) | ~4 | R4 → freeze |
| G08 | task origin, leg 2e (A task-origin-fixtures) | no | 7, all on the retired TODO.md Backlog (L-102); 0 on the store it now reads | ~3 (TD-479) | R4 → freeze (Q1) |
| G09 | frontmatter/ownership presence, leg 3 (A ownership-header-fixtures) | no | 0 own (the 16 headers were the engine's S1.LAW3/S3.SCHEMA, da72f59) | ~2 | R4 → freeze |
| G10 | knowledge index freshness/refs, leg 4 (`gen-index.sh`; A gen-index-locale-fixtures) | no | >=4 (SPRINT-024 first catch; SPRINT-083 close: stale index, invented tags, dangling `related:`) | ~4 | R2 → keep (Q3) |
| G11 | README footer + manifest lockstep, legs 6/6b (A manifest-lockstep-fixtures) | no | >=3 (L-048; SPRINT-083 close; L-180 v1.61.0 bumped 2 of 4) | ~2 | R2 → keep |
| G12a | L-NNN citation lint, leg 10 | no | >=1 (SPRINT-083 close: 51 unresolved cites = a NUL byte in LEARNINGS.md) | ~2 | R2 → keep |
| G12b | QA.md hygiene, leg 9 | no | unk | ~0 | R4 → freeze |
| G12c | archive-predicate singularity, leg 10b (TD-145) | no | 0 (guards a revert that never occurred) | ~2 (9ef32bc) | R4 → freeze |
| G13 | active-sprint task schema, leg 11 | no | unk (no FAIL on a real sprint on record) | ~1 (TD-042) | R4 → freeze |
| G14 | TypeScript typecheck, leg 11b (A typecheck-population-fixtures) | no | >=2 (095ba3b TS2345 SPRINT-109; SPRINT-104 T1 TS18047) | ~3 (TD-169) | R2 → keep |
| G15a | eval-harness list-vs-disk, leg 12 | no | >=4 events, ~10 unregistered harnesses (L-196, L-213, 5b415d4) | ~3 | R2 → keep |
| G15b | park-record cue, leg 13 (TD-019, cb3db1b) | no | 0 | ~0 | R4 → freeze |
| G16 | layers completeness, leg 14 (A layers-completeness-fixtures) | no | >=3 (SPRINT-074 Plan contradiction; L-167 x3) | ~9 | R2 → keep |
| G17 | authority class, leg 14-bis (A authority-fixtures) | no | 0 clean (L-177 was an over-read) | ~5 (d2b4d3d) | R4 → freeze (Q7) |
| G18 | approval envelope, leg 14-ter (A approval-envelope-fixtures) | no | 0 | ~2 | R4 → freeze |
| G19 | layers observed vs diff, leg 15 (O layers-observed-fixtures) | no | >=9 sprints, all `Layers:` lines corrected (L-100) | ~20 of 31 commits | R2 → keep |
| G20 | DoD delta, leg 16 (A dod-delta-fixtures) | no | 0 (6a6aeac is a historical fixture) | ~8 (fa851a9) | R4 → freeze |
| G21 | gate runtime budget (A qa-budget-fixtures, qa-budget-default-fixtures; O qa-budget-position-fixtures) | no | 0 strict; 1 report (SPRINT-086 T3 tripped at 461s, named 3 skipped) | ~8 | R4 → freeze (Q6) |
| G22 | sprint-by-reference selector (`check-sprint-by-reference.ts`; O by-reference-fixtures) | yes, engine-called | 0 (SPRINT-107/111 clean re-runs only) | ~15 (TD-188..193) | R1 → keep (Q2) |
| G23 | recorded-run rollup, leg 2g (A night-run-rollup-fixtures) | no | >=1 (SPRINT-082 rollup rewritten); 2 misfires (L-177, L-197) | ~10 (L-178 false PASS) | R2 → keep (Q8) |
| G24 | review depth (A review-depth-fixtures) | no | >=3 (SPRINT-087 T8; SPRINT-091 12 FAILs "correct", close blocked) | ~6 (TD-085) | R2 → keep |
| G25 | mechanical Verify reaches, leg 2c-bis (A verify-reaches-fixtures, system-verify-fixtures) | no | 0 (every FAIL overridden or ruled a false positive: TD-086/087) | ~8 | R4 → freeze |

## Conformance engine families (11) — every row R1 → keep (ADR-043: no cut inside the engine)

| ID | Rules (harness) | Catches (evidence) | Maint |
|---|---|---|---|
| E01 | S1.LAW2/LAW3 | >=1 (da72f59: 16 headers; first live run SPRINT-075 T6: 28 gaps) | ~2 |
| E02 | S2.F-FILE, S2.R-PLACEMENT (A s2-placement-fixtures) | 0 | ~3 |
| E03 | S3.AGENTS, S3.SCHEMA | shares E01's da72f59 event, not independent | 0 |
| E04 | S4.* (A s4-ts-evaluators; O adr-family-fixtures; `test/` parity tests) | 0 | ~3 (70e856e) |
| E05 | S6.BASE/BACKEND/MEDIUM/MULTISVC | 0 (lean-flow declares no tier; branches unreachable here, L-016) | ~2 |
| E06 | S9.* (A sprint-family-spec-reduction, gates-signed; O sprint-family-fixtures ~137-184s) | >=4, all VERIFYCLAUSE (SPRINT-081 T1/T2, 087) | ~6 |
| E07 | S10.* | >=1 (S10.TDAGING x4 at SPRINT-087 close; routes disagree) | ~2 |
| E08 | S11.* | >=1 (SPRINT-080 T2: 38 changelog files without a link line) | ~6 |
| E09 | S12.* | 0 (no real shape-match; unexercised on real input) | ~1 |
| E10 | S13.* (O attestation-fixtures) | 0 | ~2 |
| E11 | engine plumbing + consumer contract (A conformance-engine, foreign-repo, spec-reader, git-availability fixtures) | 0 | >=10 |

Spec rows `S2.R-TEMPDIR`, `S11.EPIC`, `S11.RESEARCH` have **no `assert_` in the engine** (selector B over `assert_*` and the quoted rule
names): legs 2b, 2c, 2d are their only implementation here, so G03/G06/G07 are not R5 duplicates. (Group C's report called them twins; the
second query refuted it.) Engine FAILs reach the gate as informational (leg 2f-ter), so E-row catches are the most likely undercount.

## Skill-procedure, tooling and `test/` rows (13)

| ID | Guard (profile · harness) | Cons | Catches (evidence) | Maint | Rule → disp |
|---|---|---|---|---|---|
| S01 | dispatch preflight (A dispatch-preflight-fixtures) | yes, `dispatch.md` | >=8 (SPRINT-055 HALT on the Plan's own gap, L-099; 069 batch-G2 HALT on 7 findings; 11 sprint logs) | ~9 (095 T2: 5 review rounds) | R1 → keep |
| S02 | skill freshness (A skill-freshness-fixtures) | yes, `night-run.md` | >=3 (SPRINT-041 BLOCK 1.22.0 != 1.23.0; SPRINT-039 ran stale skills) | ~3 | R1 → keep |
| S03 | night-run family: gate-exception · outcome · reap-terminal · revise-loop-ceiling (A x4) | no | 0 | ~8 (d2b4d3d; TD-152 reads a line nothing emits) | R4 → freeze |
| S04 | worktree usability + base (A usability; O worktree-base-fixtures) | yes, `dispatch.md` | 1 (SPRINT-110 T4 `worktree-base-stale`, e4fba9c, L-219) | ~2 | R1 → keep |
| S05 | run-mode resolver (A run-mode-fixtures) | no | 0 (thin; 1 commit) | ~1 | R4 → freeze |
| S06 | sprint-close + sprint-log-layout (A x2) | no | 0 (fixtures of legs; catches credit leg 11 / S9) | 0 | R4 → freeze |
| S07 | emitter-column (A emitter-column-fixtures) | no | n/a, tests code | ~3 | R6 → keep |
| S08 | layout + v1-to-v2 migrate (A layout, v1-to-v2) | yes, migrate path | n/a, tests code | ~2 | R6 → keep |
| S09 | work-store tooling (O work-store, orchestrator-store; A store-readers, store-writers, qa-store-legs) | no | n/a, tests code that is live since SPRINT-106 | ~6 | R6 → keep |
| S10 | FROZEN v1 park/retry selftests (X x4 + `assert-*.sh` x4 subjects) | no | 0 (SPRINT-039's "violation CAUGHT" was an induced run on a throwaway repo) | 1 | R3 → cut |
| T01 | `test/architecture` unwired-exports + dependency-direction | no | 0 (first run reproduced TD-103, still open; no fix followed) | ~5 | R4 → freeze (Q5) |
| T02 | `test/gate-discovery` | no | 0 | ~2 | R4 → freeze |
| T03 | `qa-verdict.ts` (+ `evals/qa-verdict.test.ts`) | no | >=2, run-level (SPRINT-099: truncated runs read as pass, TD; SPRINT-109 close, L-218) | ~4 (da7d139 CRITICAL) | R2 → keep |

## Parity (differential) harnesses (5) — R6: keep iff the Shell oracle is a consumer contract; else freeze; ungated and non-contract → cut

| ID | Harness (profile, measured as stated in `qa-check.sh` where not re-timed) | Oracle consumer? | Disp |
|---|---|---|---|
| P1 | authority-differential (O, 55 s) | no | freeze (Q7) |
| P2 | doc-caps-differential (O, 80 s) | yes (`check-doc-caps.sh`, engine) | keep |
| P3 | night-run-rollup-differential-parity (O, 78 s) | no | freeze |
| P4 | layers-observed-differential (X, 154 s, ungated; 189.3 s in `qa-check.sh`'s note) | no | cut (Q4) |
| P5 | s4-differential-parity (O) | yes (engine S4) | keep |

## Harness-to-row map and measured runtime (population A, 64 harnesses)

## Round 1 — every harness run alone, once (SPRINT-112 T1, 2026-10-02)

Windows 11 / git-bash, a worktree with no `node_modules`; four evidence agents ran for the first ~5 minutes of the run, so quote seconds as ordinary,
not exact (qa-gate-timing Round 1's caveat applies: sequential single samples, filesystem cache varies; `run-conformance-engine` read 196 s here
against 98 s in ADR-043). Exit 0 for 62 of 64; `orchestrator-store` and `typecheck-population` exited non-zero because the worktree has no
`node_modules` (tsc/deps), a host fact, not a guard finding. Harness name abbreviated (`run-` and `-fixtures` dropped). Profile A always-on ·
O opt-in · X excluded. Sums: **all 64 = 2,344 s**; always-on 641 s, opt-in 1,511 s, excluded 192 s. By disposition: keep 1,759 s · freeze 393 s ·
cut 192 s (cut + freeze = 585 s, 25%). Within the default (always-on) profile, freeze is 192 s of 641 s (30%); the cut set is all excluded, so it
costs the gate nothing today and removes only upkeep.

| Harness | Row | Prof | s | Note | Disp |
|---|---|---|---|---|---|
| adr-family | E04 | O | 37 |  | keep |
| approval-envelope | G18 | A | 8 |  | freeze |
| attestation | E10 | O | 75 |  | keep |
| authority-differential | P1 | O | 55 |  | freeze |
| authority | G17 | A | 1 |  | freeze |
| by-reference | G22 | O | 328 |  | keep |
| conformance-engine | E11 | A | 197 |  | keep |
| count-claims | G02 | A | 4 |  | keep |
| dispatch-preflight | S01 | A | 60 |  | keep |
| doc-caps-differential | P2 | O | 80 |  | keep |
| doc-caps | G01 | A | 11 |  | keep |
| dod-delta | G20 | A | 13 |  | freeze |
| emitter-column | S07 | A | 2 |  | keep |
| ephemeral-intake | G07 | A | 2 |  | freeze |
| epic-archive | G03 | A | 1 |  | keep |
| foreign-repo | E11 | A | 64 |  | keep |
| gates-signed | E06 | A | 9 |  | keep |
| gen-index-locale | G10 | A | 17 |  | keep |
| git-availability | E11 | A | 7 |  | keep |
| handoff-state | G05 | A | 9 |  | freeze |
| layers-completeness | G16 | A | 8 |  | keep |
| layers-observed-differential | P4 | X | 154 |  | cut |
| layers-observed | G19 | O | 238 |  | keep |
| layout | S08 | A | 0 |  | keep |
| manifest-lockstep | G11 | A | 3 |  | keep |
| night-run-gate-exception | S03 | A | 26 |  | freeze |
| night-run-outcome | S03 | A | 34 |  | freeze |
| night-run-rollup-differential-parity | P3 | O | 78 |  | freeze |
| night-run-rollup | G23 | A | 16 |  | keep |
| orchestrator-store | S09 | O | 19 | exit 1 | keep |
| ownership-header | G09 | A | 26 |  | freeze |
| prose-density | G04 | A | 1 |  | keep |
| qa-budget-default | G21 | A | 1 |  | freeze |
| qa-budget | G21 | A | 6 |  | freeze |
| qa-budget-position | G21 | O | 68 |  | freeze |
| qa-store-legs | S09 | A | 4 |  | keep |
| reap-terminal | S03 | A | 32 |  | freeze |
| research-archive | G06 | A | 3 |  | freeze |
| review-depth | G24 | A | 10 |  | keep |
| revise-loop-ceiling | S03 | A | 6 |  | freeze |
| run-mode | S05 | A | 6 |  | freeze |
| s2-placement | E02 | A | 19 |  | keep |
| s4-differential-parity | P5 | O | 60 |  | keep |
| s4-ts-evaluators | E04 | A | 1 |  | keep |
| skill-freshness | S02 | A | 3 |  | keep |
| spec-reader | E11 | A | 10 |  | keep |
| sprint-close | S06 | A | 4 |  | freeze |
| sprint-family | E06 | O | 469 |  | keep |
| sprint-family-spec-reduction | E06 | A | 2 |  | keep |
| sprint-log-layout | S06 | A | 0 |  | freeze |
| store-readers | S09 | A | 0 |  | keep |
| store-writers | S09 | A | 1 |  | keep |
| system-verify | G25 | A | 6 |  | freeze |
| task-origin | G08 | A | 6 |  | freeze |
| typecheck-population | G14 | A | 1 | exit 1 | keep |
| v1-to-v2 | S08 | A | 0 |  | keep |
| verify-reaches | G25 | A | 4 |  | freeze |
| work-store | S09 | O | 3 |  | keep |
| worktree-base | S04 | O | 4 |  | keep |
| worktree-usability | S04 | A | 1 |  | keep |
| selftest-assert-boundary-park | S10 | X | 19 |  | cut |
| selftest-assert-judgement-retry | S10 | X | 4 |  | cut |
| selftest-assert-noaction-park | S10 | X | 14 |  | cut |
| selftest-assert-park-revisit | S10 | X | 1 |  | cut |
