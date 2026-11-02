---
owner: Maintainer
last_updated: 2026-10-02
update_trigger: The audit is re-run, or a harness changes disposition
status: current
id: guard-audit-runtime
tags: [tooling]
domain: governance
related: [guard-audit, qa-gate-timing]
---

# Research — What does each gate harness cost to run, and what do the dispositions save?

> **Question.** Alone, once each, how long does every one of the 64 gate-named harnesses run, and how much of that is freeze or cut?
> **Verdict.** All 64 = **2,351 s**: keep 1,480 · freeze 679 · cut 192. Cut + freeze = 871 s (37%). Always-on 645 s (freeze 70 s, 11%) · opt-in 1,514 s (freeze 609 s) · excluded 192 s (all cut).

## Why this matters
A freeze or cut is only worth ruling if it removes cost the gate or the maintainer actually pays; this table is the denominator.

## Options considered
- **A — Quote the timings in `qa-check.sh` comments.** *Trade-off:* free; stale and incomplete (SPRINT-103 notes). **B — Re-run every harness (chosen).** *Trade-off:* ~40 minutes.

## Findings
Windows 11 / git-bash, a worktree without `node_modules`, four evidence agents running for the first ~5 minutes, single samples, so seconds are ordinary
(`qa-gate-timing` Round 1's caveat applies; `run-conformance-engine` read 196 s here against 98 s in ADR-043). 62 of 64 exited 0; `orchestrator-store` and
`typecheck-population` exited non-zero only for want of `node_modules`. Harness name abbreviated (`run-` and `-fixtures` dropped). Profile A always-on ·
O opt-in · X excluded. The disposition is the *harness's*: G22's checker keeps (R1) while its harness (`by-reference`, 328 s) freezes by owner ruling. Differential
harnesses P6 and P7 are not gate-named, so they are untimed. Row ids map to `guard-audit-legs` (G) and `guard-audit-rest` (E S T P).

| Harness | Row | Prof | s | Note | Disp |
|---|---|---|---|---|---|
| adr-family | E04 | O | 37 |  | keep |
| approval-envelope | G18 | A | 8 |  | keep |
| attestation | E10 | O | 75 |  | keep |
| authority-differential | P1 | O | 55 |  | freeze |
| authority | G17 | A | 1 |  | keep |
| by-reference | G22 | O | 328 |  | freeze |
| conformance-engine | E11 | A | 197 |  | keep |
| count-claims | G02 | A | 4 |  | keep |
| dispatch-preflight | S01 | A | 60 |  | keep |
| doc-caps-differential | P2 | O | 80 |  | freeze |
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
| night-run-gate-exception | S03 | A | 26 |  | keep |
| night-run-outcome | S03 | A | 34 |  | keep |
| night-run-rollup-differential-parity | P3 | O | 78 |  | freeze |
| night-run-rollup | G23 | A | 16 |  | keep |
| orchestrator-store | S09 | O | 19 | exit 1 | keep |
| ownership-header | G09 | A | 26 |  | freeze |
| prose-density | G04 | A | 1 |  | keep |
| qa-budget-default | G21 | A | 1 |  | freeze |
| qa-budget | G21 | A | 6 |  | freeze |
| qa-budget-position | G21 | O | 68 |  | freeze |
| qa-store-legs | S09 | A | 4 |  | keep |
| reap-terminal | S03 | A | 32 |  | keep |
| research-archive | G06 | A | 3 |  | freeze |
| review-depth | G24 | A | 10 |  | keep |
| revise-loop-ceiling | S03 | A | 6 |  | keep |
| run-mode | S05 | A | 6 |  | keep |
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
| system-verify | G25 | A | 6 |  | keep |
| task-origin | G08 | A | 6 |  | freeze |
| typecheck-population | G14 | A | 1 | exit 1 | keep |
| v1-to-v2 | S08 | A | 0 |  | keep |
| verify-reaches | G25 | A | 4 |  | keep |
| work-store | S09 | O | 3 |  | keep |
| worktree-base | S04 | O | 4 |  | keep |
| worktree-usability | S04 | A | 1 |  | keep |
| selftest-assert-boundary-park | S10 | X | 19 |  | cut |
| selftest-assert-judgement-retry | S10 | X | 4 |  | cut |
| selftest-assert-noaction-park | S10 | X | 14 |  | cut |
| selftest-assert-park-revisit | S10 | X | 1 |  | cut |
