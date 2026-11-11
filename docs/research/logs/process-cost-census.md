---
owner: Maintainer
last_updated: 2026-11-11
update_trigger: A census round is added (TASK-648 inventory, TASK-649 history, TASK-650 record steps)
status: active
id: process-cost-census-log
tags: [process, tooling]
domain: governance
---

# Process-cost census — measurement appendix

Append-only measurement evidence for the [decision doc](../process-cost-census.md).

## Gate check inventory

Pinned revision: `e29815a9ad0cbd660fd80d3d2d9c827c4dd03215`. T1’s baseline and owner ruling are included; the protected source trees are unchanged from `ec4ee660`.
Worktree HEAD is `56feaf0b3e8e07070466cd71de705fb7a9bbd61c`: the sole later commit moves TASK-648 to `in_progress/`. Source and log reconciliation still use the stated pin.
The coordinator supplied `census-input/qa-full.log` from `QA_FULL=1 sh scripts/qa-check.sh` on the VPS clone detached at the pin: rc 0, 683 lines, ending `QA-CHECK: 509 pass, 0 fail`. No remote connection was made by this builder.
Log SHA-256 (raw bytes): `2ada1f50271ffb6088569996b35082026e3ba3322f0f844d8ae8133ad6e6193b`.

### Population and naming

There are **103 inventory rows**: all 37 `# ---` headers, the prose-density leg without that header, three unnumbered emitting blocks (bootstrap, budget-default, checkpoint), and 62 harnesses (52 always-on, 10 opt-in).
G ids are the line numbers in `scripts/qa-check.sh` at the pin. H ids follow its two harness lists. All 21 `qb_checkpoint` calls have a row; rows without one are explicit. Header-set missing/extra and checkpoint mismatches: **0/0/0**.
The duplicate 2b labels remain separate as G0234 and G0636. The source has 2c and 2c-bis, not a second bare 2c. G0416 records the §13 fold-in; its output belongs to G0435 once. G0468 is a profiling comment inside G0435, with no independent emission.
A name cell gives stable label templates; `<diagnostic>` stands for the source expression’s remaining message, including file/task/sprint/count values. Matching uses the full emitted expression with only interpolations replaced, not a free wildcard after the label.
Whitespace is normalized, verdict tokens are removed, and repeated names within one row are deduplicated. A row may own several templates; a name owned by two different rows is a double-map. `(C)` marks a label absent from this log, conditional on the named source branch.
For H rows, `<diagnostic>` is empty on success; on failure it carries missing-script/runtime or exit/finding detail. The harness body’s assertions are captured by leg 12, not relayed as independent verdict lines. Its unlisted-harness error belongs to G1094.
Only column-leading PASS/FAIL/INFO lines enter the identity census. Notes, SKIP, GAP, summaries and profiling samples do not. G0043/G0147 still retain their failure-only names; retired legs 5/7/8 retain rows with no checks.

### Checkers and harnesses

Each fixture names a retained runner or test file containing a rejected input/seed for that checker. A harness row points to its own negative cases or its delegated test; this does not claim a separate test of the harness. A listed fixture does not imply every assertion in that row is covered.
**Consumer flags.** Under [ADR-050 § Decision 1](../../adr/ADR-050-proof-bar-scales-with-consequence.md) and the owner's rule, yes means (a) `scripts/lib/conformance-engine.sh` itself executes the check or directly calls its script, (b) a shipped skill tells the adopter to run that script as a step of their own flow, or (c) README footer version lint or manifest lockstep.
A skill naming a checker only as the reader of a record line checked by lean-flow's own gate is not (b). Harness flags describe the checks they exercise, with the same rule; runnable skill snippets qualify under (b). Each yes cites its engine or skill line, or exception (c).
The night-run guide explicitly tells adopters to substitute their own trigger and gate (`skills/orchestrator/references/night-run.md:15–17`). Host-local examples in the index, reachability and tick steps do not tell adopters to run those lean-flow scripts.

| Id | Leg @ qa line | Checkpoint | Checker file | Check names it prints | Must-FAIL fixture | Consumer guard | FAILs | Real defects | Ruling |
|---|---|---|---|---|---|---|---|---|---|
| G0043 | bootstrap archive predicate @ 43 | no | `scripts/qa-check.sh` | `archive-predicate: shared predicate not found at <diagnostic>` (C) | `none` | no: maintainer bootstrap; engine has its own guard | 0 | 0 | [cut](#history-g0043) |
| G0052 | profile instrumentation @ 52 | no | `scripts/qa-check.sh` | none (no verdict; see leg description) | `none` | no: optional measurements; no verdict | 0 | 0 | [n/a (no check)](#history-g0052) |
| G0093 | budget default @ 93 | no | `scripts/lib/check-qa-budget-default.sh` | `qa-budget-default: <diagnostic>`; `qa-budget-default-arg: <diagnostic>` (C); `qa-budget-default-not-found: <diagnostic>` (C); `qa-budget-default-exceeds-ceiling: <diagnostic>` (C) | `evals/run-qa-budget-default-fixtures.sh` | no: maintainer gate only | 0 | 0 | [cut](#history-g0093) |
| G0147 | budget checkpoint function @ 147 | no | `scripts/lib/qa-budget-check.sh` | `qa-check-budget-exceeded-early: <diagnostic>` (C) | `evals/run-qa-budget-position-fixtures.sh` | no: maintainer runtime guard | unknown (>=0) | unknown (>=0) | [keep (unknown, owner rules)](#history-g0147) |
| G0169 | 1 @ 169 | no | `scripts/lib/check-doc-caps.ts` | `cap <diagnostic>`; `doc-caps: <diagnostic>` | `evals/run-doc-caps-fixtures.sh` | no: maintainer gate only | unknown (>=7) | unknown (>=1) | [keep (unknown, owner rules)](#history-g0169) |
| G0209 | 2 @ 209 | yes | `scripts/lib/check-count-claims.sh` | `count claims: <diagnostic>` (C); `count-claims: <diagnostic>` (C); `skills: <diagnostic>`; `tmpl-core: <diagnostic>`; `tmpl-total: <diagnostic>`; `qa.md non-core claim: <diagnostic>` | `evals/run-count-claims-fixtures.sh` | no: maintainer gate only | 1 | 1 | [keep](#history-g0209) |
| G0234 | 2b @ 234 | yes | `scripts/lib/check-epic-archive.ts` | `epic archive: <diagnostic>` (C); `epic-archive: <diagnostic>`; `epic-state: <diagnostic>` | `evals/run-epic-archive-fixtures.sh` | no: maintainer gate only | unknown (>=5) | unknown (>=2) | [keep (unknown, owner rules)](#history-g0234) |
| G0268 | 2b-ter (no section header) @ 268 | yes | `scripts/lib/check-prose-density.ts` | `prose density: <diagnostic>` (C); `prose-density: <diagnostic>` | `evals/run-prose-density-fixtures.ts` | no: maintainer gate only | 22 | 0 | [cut](#history-g0268) |
| G0297 | 2b-bis @ 297 | yes | `scripts/lib/check-handoff-state.sh` | `handoff state: <diagnostic>` (C); `handoff-state: <diagnostic>` | `evals/run-handoff-state-fixtures.sh` | no: maintainer gate only | 1 | 0 | [cut](#history-g0297) |
| G0324 | 2c @ 324 | yes | `scripts/lib/check-research-archive.sh` | `research archive: <diagnostic>` (C); `research-archive: <diagnostic>` | `evals/run-research-archive-fixtures.sh` | no: maintainer gate only | 0 | 0 | [cut](#history-g0324) |
| G0348 | 2d @ 348 | yes | `scripts/lib/check-ephemeral-intake.sh` | `ephemeral intake: <diagnostic>` (C); `ephemeral-intake: <diagnostic>` | `evals/run-ephemeral-intake-fixtures.sh` | no: maintainer gate only | 1 | 1 | [keep](#history-g0348) |
| G0372 | 2e @ 372 | yes | `scripts/lib/check-task-origin.sh` | `task origin: <diagnostic>` (C); `task-origin: <diagnostic>` | `evals/run-task-origin-fixtures.sh` | no: maintainer gate only | 0 | 0 | [cut](#history-g0372) |
| G0396 | 2e-bis @ 396 | yes | `scripts/lib/check-work-type.ts` | `work type: <diagnostic>` (C); `work-type: <diagnostic>` (C); `work-type <diagnostic>`; `work-type-unknown <diagnostic>` (C); `bug-item-missing-repro <diagnostic>` (C); `debt-item-missing-td <diagnostic>` (C) | `evals/run-work-type-fixtures.sh` | no: maintainer gate only | 0 | 0 | [cut](#history-g0396) |
| G0416 | 2f-bis (fold-in record) @ 416 | yes | `scripts/qa-check.sh` | none (no verdict; see leg description) | `none` | no: record only; §13 consumer guard is G0435 | 0 | 0 | [n/a (no check)](#history-g0416) |
| G0435 | 2f-ter @ 435 | yes | `scripts/lib/conformance-engine.sh` | N0435a, N0435b, N0435c, N0435d, N0435e, N0435f, N0435g, N0435h, N0435i, N0435j | `evals/run-conformance-engine-fixtures.sh` | yes (a): engine dispatch at `scripts/lib/conformance-engine.sh:3503`; entry at `conformance.sh:17` | unknown (>=4) | unknown (>=4) | [keep (unknown, owner rules)](#history-g0435) |
| G0468 | TD-084 profiling comment @ 468 | no | `scripts/qa-check.sh` | none (no verdict; see leg description) | `none` | no: comment inside G0435, no separate check | 0 | 0 | [n/a (no check)](#history-g0468) |
| G0567 | 2g @ 567 | yes | `scripts/lib/check-night-run-rollup.ts` | `night-run rollup: <diagnostic>` (C); `night-run rollup <diagnostic>` (C) | `evals/run-night-run-rollup-fixtures.sh` | no: record reader only (`skills/orchestrator/references/night-run.md:671`); no engine call | 7 | 1 | [keep](#history-g0567) |
| G0636 | 2b (review depth) @ 636 | yes | `scripts/lib/check-review-depth.sh` | N0636a, N0636b | `evals/run-review-depth-fixtures.sh` | no: record reader only (`skills/orchestrator/references/review-scoping.md:209`); no engine call | 28 | 10 | [keep](#history-g0636) |
| G0672 | 2c-bis @ 672 | yes | `scripts/lib/check-verify-reaches.ts` | `verify reaches: <diagnostic>` (C); `verify reaches <diagnostic>` (C); `verify-reaches: <diagnostic>` (C); `verify-member-resolution-empty: <diagnostic>` (C); `verify-method-absent: <diagnostic>` (C); `verify-method-unresolvable: <diagnostic>` (C); `verify-does-not-reach-target: <diagnostic>` (C) | `evals/run-verify-reaches-fixtures.sh` | no: host-local checker example (`skills/orchestrator/SKILL.md:51`), not an adopter script step; no engine call | unknown (>=2) | unknown (>=1) | [keep (unknown, owner rules)](#history-g0672) |
| G0708 | 3 @ 708 | yes | `scripts/qa-check.sh` | `frontmatter <diagnostic>`; `ownership <diagnostic>` | `none` | no: maintainer gate only | unknown (>=0) | unknown (>=0) | [keep (unknown, owner rules)](#history-g0708) |
| G0733 | 4 @ 733 | yes | `scripts/qa-check.sh; scripts/gen-index.sh` | N0733a, N0733b | `evals/run-learnings-metadata-fixtures.ts; evals/run-gen-index-locale-fixtures.ts` | no: `skills/lean-doc-generator/SKILL.md:76` requires the host index generator; `gen-index.sh` is explicitly lean-flow's own example, not an adopter script step | unknown (>=17) | unknown (>=1) | [keep (unknown, owner rules)](#history-g0733) |
| G0901 | 5 retired @ 901 | no | `scripts/qa-check.sh` | none (retired) | `none` | no: retired | 0 | 0 | [n/a (no check)](#history-g0901) |
| G0905 | 6 @ 905 | yes | `scripts/qa-check.sh` | `README footer version <diagnostic>` | `none` | yes (c): README footer version lint | 2 | 2 | [keep](#history-g0905) |
| G0917 | 6b @ 917 | no | `scripts/lib/check-manifest-lockstep.sh` | `manifest lockstep: <diagnostic>` | `evals/run-manifest-lockstep-fixtures.sh` | yes (c): manifest lockstep | unknown (>=0) | unknown (>=0) | [keep (unknown, owner rules)](#history-g0917) |
| G0941 | 7 retired @ 941 | no | `scripts/qa-check.sh` | none (retired) | `none` | no: retired | 0 | 0 | [n/a (no check)](#history-g0941) |
| G0944 | 8 retired @ 944 | no | `scripts/qa-check.sh` | none (retired) | `none` | no: retired | 0 | 0 | [n/a (no check)](#history-g0944) |
| G0947 | 9 @ 947 | yes | `scripts/qa-check.sh` | `QA.md hand-written cap snapshot found <diagnostic>` (C); `QA.md hygiene <diagnostic>` | `none` | no: maintainer gate only | unknown (>=0) | unknown (>=0) | [keep (unknown, owner rules)](#history-g0947) |
| G0959 | 10 @ 959 | yes | `scripts/qa-check.sh` | `L-NNN citations under skills/ resolve or are labeled <diagnostic>`; `L-NNN citation unresolved: <diagnostic>` (C) | `none` | no: maintainer gate only | 1 | 1 | [keep](#history-g0959) |
| G0985 | 10b @ 985 | yes | `scripts/qa-check.sh` | `archive-predicate: no raw archive exclusion <diagnostic>`; `archive-predicate: <count> site(s) carry a raw archive exclusion <diagnostic>` (C) | `none` | no: maintainer gate only | 0 | 0 | [cut](#history-g0985) |
| G1015 | 11 @ 1015 | yes | `scripts/qa-check.sh` | `<sprint> ### T<task> schema complete <diagnostic>`; `<sprint> ### T<task> missing: <diagnostic>` (C) | `none` | no: maintainer gate only | unknown (>=0) | unknown (>=0) | [keep (unknown, owner rules)](#history-g1015) |
| G1055 | 11b @ 1055 | no | `scripts/qa-check.sh; node_modules/.bin/tsc` | `typecheck: <diagnostic>` | `evals/run-typecheck-population-fixtures.ts` — population only (never runs tsc on a failing input) | no: maintainer gate only | 16 | 12 | [keep](#history-g1055) |
| G1094 | 12 wiring and budget @ 1094 | yes | `scripts/qa-check.sh` | `qa-check-budget-exceeded: <diagnostic>` (C); `eval harness <unlisted>: in evals/ but neither gated <diagnostic>` (C) | `evals/run-qa-budget-position-fixtures.sh (budget); none (registry)` | no: maintainer harness registry | unknown (>=3) | unknown (>=2) | [keep (unknown, owner rules)](#history-g1094) |
| G1384 | 13 @ 1384 | no | `scripts/qa-check.sh` | `headless park-record cue <diagnostic>` | `none` | no: maintainer gate only | unknown (>=0) | unknown (>=0) | [keep (unknown, owner rules)](#history-g1384) |
| G1407 | 14 @ 1407 | no | `scripts/lib/check-layers-completeness.ts` | `layers completeness <diagnostic>`; `layers completeness: <diagnostic>` (C) | `evals/run-layers-completeness-fixtures.sh` | no: maintainer gate only | unknown (>=36) | unknown (>=4) | [keep (unknown, owner rules)](#history-g1407) |
| G1447 | 14-a @ 1447 | no | `scripts/lib/check-sprint-by-reference.ts --scope-change` | `scope-change layers <diagnostic>`; `scope-change layers: <diagnostic>` (C) | `evals/run-by-reference-fixtures.ts` | yes (a): direct call at `scripts/lib/conformance-engine.sh:2266`; `--scope-change` mode is local | 19 | 2 | [keep](#history-g1447) |
| G1474 | 14-bis @ 1474 | no | `scripts/lib/check-authority.ts` | `authority <diagnostic>`; `authority: <diagnostic>` (C) | `evals/run-authority-fixtures.sh` | no: record reader only (`skills/orchestrator/references/night-run.md:551`); no engine call | 4 | 1 | [keep](#history-g1474) |
| G1511 | 14-ter @ 1511 | no | `scripts/lib/check-approval-envelope.sh` | `approval envelope <diagnostic>` (C); `approval envelope: <diagnostic>` (C) | `evals/run-approval-envelope-fixtures.sh` | no: record reader only (`skills/orchestrator/references/night-run.md:229`); no engine call | 1 | 0 | [cut](#history-g1511) |
| G1544 | 15 @ 1544 | no | `scripts/lib/check-layers-observed.ts` | `layers observed <diagnostic>`; `layers observed: <diagnostic>` (C) | `evals/run-layers-observed-test-fixtures.ts` | no: maintainer gate only | unknown (>=50) | unknown (>=30) | [keep (unknown, owner rules)](#history-g1544) |
| G1597 | 16 @ 1597 | no | `scripts/lib/check-dod-delta.ts` | `dod-delta <diagnostic>`; `dod-delta: <diagnostic>` (C) | `evals/run-dod-delta-fixtures.sh` | no: maintainer gate only | 2 | 0 | [cut (borderline, owner rules)](#history-g1597) |
| G1640 | actual runtime @ 1640 | no | `scripts/lib/qa-budget-check.sh` | `qa-runtime: <diagnostic>`; `qa-runtime-over-ceiling: <diagnostic>` (C) | `evals/run-qa-budget-fixtures.sh` | no: maintainer invocation ceiling | 1 | 1 | [keep](#history-g1640) |
| G1671 | summary @ 1671 | no | `scripts/qa-check.sh` | none (no verdict; see leg description) | `evals/run-conformance-line-fixtures.ts` | no: tally/conformance count, no PASS/FAIL/INFO name | 0 | 0 | [n/a (no check)](#history-g1671) |
| H01 | 12 always @ 1094 | no: inside 12 | `evals/run-layout-fixtures.ts` | `eval harness run-layout-fixtures.ts <diagnostic>` | `evals/run-layout-fixtures.ts` | no: maintainer fixture/tooling | 0 | 0 | [cut (borderline, owner rules)](#coordinator-rulings-after-review) |
| H02 | 12 always @ 1094 | no: inside 12 | `evals/run-v1-to-v2-fixtures.ts` | `eval harness run-v1-to-v2-fixtures.ts <diagnostic>` | `evals/run-v1-to-v2-fixtures.ts` | no: maintainer fixture/tooling | 1 | 0 | [cut (borderline, owner rules)](#coordinator-rulings-after-review) |
| H03 | 12 always @ 1094 | no: inside 12 | `evals/run-epic-archive-fixtures.sh` | `eval harness run-epic-archive-fixtures.sh <diagnostic>` | `evals/epic-archive.test.ts` | no: maintainer fixture/tooling | 0 | 0 | [keep (fixture of G0234)](#shared-harness-judgments) |
| H04 | 12 always @ 1094 | no: inside 12 | `evals/run-typecheck-population-fixtures.ts` | `eval harness run-typecheck-population-fixtures.ts <diagnostic>` | `evals/typecheck-population.test.ts` — population only (never runs tsc on a failing input) | no: maintainer fixture/tooling | 6 | 1 | [keep (fixture of G1055)](#history-h04) |
| H05 | 12 always @ 1094 | no: inside 12 | `evals/run-emitter-column-fixtures.ts` | `eval harness run-emitter-column-fixtures.ts <diagnostic>` | `evals/run-emitter-column-fixtures.ts` | yes (a): engine missing-predicate check at `scripts/lib/conformance-engine.sh:76` | 5 | 5 | [keep](#history-h05) |
| H06 | 12 always @ 1094 | no: inside 12 | `evals/run-sprint-log-layout-fixtures.sh` | `eval harness run-sprint-log-layout-fixtures.sh <diagnostic>` | `evals/run-sprint-log-layout-fixtures.sh` | no: maintainer fixture/tooling | 1 | 1 | [keep](#history-h06) |
| H07 | 12 always @ 1094 | no: inside 12 | `evals/run-authority-fixtures.sh` | `eval harness run-authority-fixtures.sh <diagnostic>` | `evals/authority.test.ts` | no: maintainer fixture/tooling | 0 | 0 | [keep (fixture of G1474)](#shared-harness-judgments) |
| H08 | 12 always @ 1094 | no: inside 12 | `evals/run-prose-density-fixtures.ts` | `eval harness run-prose-density-fixtures.ts <diagnostic>` | `evals/run-prose-density-fixtures.ts` | no: maintainer fixture/tooling | 0 | 0 | [cut (with G0268)](#shared-harness-judgments) |
| H09 | 12 always @ 1094 | no: inside 12 | `evals/run-qa-budget-default-fixtures.sh` | `eval harness run-qa-budget-default-fixtures.sh <diagnostic>` | `evals/run-qa-budget-default-fixtures.sh` | no: maintainer fixture/tooling | 0 | 0 | [cut (with G0093)](#shared-harness-judgments) |
| H10 | 12 always @ 1094 | no: inside 12 | `evals/run-ephemeral-intake-fixtures.sh` | `eval harness run-ephemeral-intake-fixtures.sh <diagnostic>` | `evals/run-ephemeral-intake-fixtures.sh` | no: maintainer fixture/tooling | 0 | 0 | [keep (fixture of G0348)](#shared-harness-judgments) |
| H11 | 12 always @ 1094 | no: inside 12 | `evals/run-task-origin-fixtures.sh` | `eval harness run-task-origin-fixtures.sh <diagnostic>` | `evals/run-task-origin-fixtures.sh` | no: maintainer fixture/tooling | 0 | 0 | [cut (with G0372)](#shared-harness-judgments) |
| H12 | 12 always @ 1094 | no: inside 12 | `evals/run-work-type-fixtures.sh` | `eval harness run-work-type-fixtures.sh <diagnostic>` | `evals/run-work-type-fixtures.sh` | no: maintainer fixture/tooling | 0 | 0 | [cut (with G0396)](#shared-harness-judgments) |
| H13 | 12 always @ 1094 | no: inside 12 | `evals/run-worktree-usability-fixtures.sh` | `eval harness run-worktree-usability-fixtures.sh <diagnostic>` | `evals/run-worktree-usability-fixtures.sh` | yes (b): run the usability snippet, `skills/orchestrator/references/night-run-checks.md:185` (snippet at 190) | unknown (>=0) | unknown (>=0) | [keep (unknown, owner rules)](#history-h13) |
| H14 | 12 always @ 1094 | no: inside 12 | `evals/run-skill-freshness-fixtures.sh` | `eval harness run-skill-freshness-fixtures.sh <diagnostic>` | `evals/run-skill-freshness-fixtures.sh` | yes (b): run the freshness snippet, `skills/orchestrator/references/night-run-checks.md:59` (snippet at 65) | unknown (>=0) | unknown (>=0) | [keep (unknown, owner rules)](#history-h14) |
| H15 | 12 always @ 1094 | no: inside 12 | `evals/run-sprint-family-spec-reduction-fixtures.ts` | `eval harness run-sprint-family-spec-reduction-fixtures.ts <diagnostic>` | `evals/run-sprint-family-spec-reduction-fixtures.ts` | no: tests the harness's spec reduction (`evals/run-sprint-family-spec-reduction-fixtures.ts:1`), not an engine-executed check or adopter step | 0 | 0 | [cut](#shared-harness-judgments) |
| H16 | 12 always @ 1094 | no: inside 12 | `evals/run-count-claims-fixtures.sh` | `eval harness run-count-claims-fixtures.sh <diagnostic>` | `evals/run-count-claims-fixtures.sh` | no: maintainer fixture/tooling | 0 | 0 | [keep (fixture of G0209)](#shared-harness-judgments) |
| H17 | 12 always @ 1094 | no: inside 12 | `evals/run-manifest-lockstep-fixtures.sh` | `eval harness run-manifest-lockstep-fixtures.sh <diagnostic>` | `evals/run-manifest-lockstep-fixtures.sh` | yes (c): manifest lockstep | 0 | 0 | [keep (fixture of G0917)](#shared-harness-judgments) |
| H18 | 12 always @ 1094 | no: inside 12 | `evals/run-dod-delta-fixtures.sh` | `eval harness run-dod-delta-fixtures.sh <diagnostic>` | `evals/dod-delta.test.ts` | no: maintainer fixture/tooling | 0 | 0 | [cut (with G1597)](#shared-harness-judgments) |
| H19 | 12 always @ 1094 | no: inside 12 | `evals/run-sprint-close-fixtures.sh` | `eval harness run-sprint-close-fixtures.sh <diagnostic>` | `evals/run-sprint-close-fixtures.sh` | no: maintainer fixture/tooling | 0 | 0 | [cut](#shared-harness-judgments) |
| H20 | 12 always @ 1094 | no: inside 12 | `evals/run-research-archive-fixtures.sh` | `eval harness run-research-archive-fixtures.sh <diagnostic>` | `evals/run-research-archive-fixtures.sh` | no: maintainer fixture/tooling | 0 | 0 | [cut (with G0324)](#shared-harness-judgments) |
| H21 | 12 always @ 1094 | no: inside 12 | `evals/run-qa-budget-fixtures.sh` | `eval harness run-qa-budget-fixtures.sh <diagnostic>` | `evals/run-qa-budget-fixtures.sh` | no: maintainer fixture/tooling | unknown (>=0) | unknown (>=0) | [keep (fixture of G1640)](#history-h21) |
| H22 | 12 always @ 1094 | no: inside 12 | `evals/run-run-mode-fixtures.sh` | `eval harness run-run-mode-fixtures.sh <diagnostic>` | `evals/run-run-mode-fixtures.sh` | no: local launcher resolver; adopter substitutes their own trigger (`skills/orchestrator/references/night-run.md:15`) | 0 | 0 | [cut (borderline, owner rules)](#coordinator-rulings-after-review) |
| H23 | 12 always @ 1094 | no: inside 12 | `evals/run-doc-caps-fixtures.sh` | `eval harness run-doc-caps-fixtures.sh <diagnostic>` | `evals/doc-caps.test.ts` | no: maintainer fixture/tooling | 2 | 1 | [keep (fixture of G0169)](#history-h23) |
| H24 | 12 always @ 1094 | no: inside 12 | `evals/run-git-availability-fixtures.sh` | `eval harness run-git-availability-fixtures.sh <diagnostic>` | `evals/run-git-availability-fixtures.sh` | yes (a): engine git probe at `scripts/lib/conformance-engine.sh:143` | 0 | 0 | [keep](#shared-harness-judgments) |
| H25 | 12 always @ 1094 | no: inside 12 | `evals/run-gen-index-locale-fixtures.ts` | `eval harness run-gen-index-locale-fixtures.ts <diagnostic>` | `evals/run-gen-index-locale-fixtures.ts` | no: maintainer fixture/tooling | 1 | 1 | [keep (fixture of G0733)](#history-h25) |
| H26 | 12 always @ 1094 | no: inside 12 | `evals/run-layers-completeness-fixtures.sh` | `eval harness run-layers-completeness-fixtures.sh <diagnostic>` | `evals/layers-completeness.test.ts` | no: maintainer fixture/tooling | 0 | 0 | [keep (fixture of G1407)](#shared-harness-judgments) |
| H27 | 12 always @ 1094 | no: inside 12 | `evals/run-revise-loop-ceiling-fixtures.sh` | `eval harness run-revise-loop-ceiling-fixtures.sh <diagnostic>` | `evals/run-revise-loop-ceiling-fixtures.sh` | no: local launcher retry ceiling; adopter substitutes their own trigger (`skills/orchestrator/references/night-run.md:15`) | 0 | 0 | [cut](#history-h27) |
| H28 | 12 always @ 1094 | no: inside 12 | `evals/run-approval-envelope-fixtures.sh` | `eval harness run-approval-envelope-fixtures.sh <diagnostic>` | `evals/run-approval-envelope-fixtures.sh` | no: envelope record reader only (`skills/orchestrator/references/night-run.md:229`); no engine call | 0 | 0 | [cut (with G1511)](#shared-harness-judgments) |
| H29 | 12 always @ 1094 | no: inside 12 | `evals/run-gates-signed-fixtures.sh` | `eval harness run-gates-signed-fixtures.sh <diagnostic>` | `evals/run-gates-signed-fixtures.sh` | yes (a): engine S9 gates checks at `scripts/lib/conformance-engine.sh:987`, 1038; dispatch at 3503 | 0 | 0 | [keep](#shared-harness-judgments) |
| H30 | 12 always @ 1094 | no: inside 12 | `evals/run-spec-reader-fixtures.sh` | `eval harness run-spec-reader-fixtures.sh <diagnostic>` | `evals/run-spec-reader-fixtures.sh` | yes (a): engine calls the spec reader at `scripts/lib/conformance-engine.sh:208` | 0 | 0 | [keep](#shared-harness-judgments) |
| H31 | 12 always @ 1094 | no: inside 12 | `evals/run-handoff-state-fixtures.sh` | `eval harness run-handoff-state-fixtures.sh <diagnostic>` | `evals/run-handoff-state-fixtures.sh` | no: maintainer fixture/tooling | 0 | 0 | [cut (with G0297)](#shared-harness-judgments) |
| H32 | 12 always @ 1094 | no: inside 12 | `evals/run-review-depth-fixtures.sh` | `eval harness run-review-depth-fixtures.sh <diagnostic>` | `evals/run-review-depth-fixtures.sh` | no: review-depth record reader only (`skills/orchestrator/references/review-scoping.md:209`); no engine call | 0 | 0 | [keep (fixture of G0636)](#shared-harness-judgments) |
| H33 | 12 always @ 1094 | no: inside 12 | `evals/run-system-verify-fixtures.sh` | `eval harness run-system-verify-fixtures.sh <diagnostic>` | `evals/run-system-verify-fixtures.sh` | no: maintainer fixture/tooling | 1 | 0 | [cut](#history-h33) |
| H34 | 12 always @ 1094 | no: inside 12 | `evals/run-s2-placement-fixtures.sh` | `eval harness run-s2-placement-fixtures.sh <diagnostic>` | `evals/run-s2-placement-fixtures.sh` | yes (a): engine S2 placement checks at `scripts/lib/conformance-engine.sh:1940`, 1978; dispatch at 3503 | 1 | 1 | [keep](#history-h34) |
| H35 | 12 always @ 1094 | no: inside 12 | `evals/run-night-run-rollup-fixtures.sh` | `eval harness run-night-run-rollup-fixtures.sh <diagnostic>` | `evals/run-night-run-rollup-fixtures.sh` | no: rollup record reader only (`skills/orchestrator/references/night-run.md:671`); no engine call | 0 | 0 | [keep (fixture of G0567)](#history-h35) |
| H36 | 12 always @ 1094 | no: inside 12 | `evals/run-reap-terminal-fixtures.sh` | `eval harness run-reap-terminal-fixtures.sh <diagnostic>` | `evals/run-reap-terminal-fixtures.sh` | no: local launcher terminal reaper; adopter substitutes their own trigger (`skills/orchestrator/references/night-run.md:15`) | 0 | 0 | [cut](#history-h36) |
| H37 | 12 always @ 1094 | no: inside 12 | `evals/run-ownership-header-fixtures.sh` | `eval harness run-ownership-header-fixtures.sh <diagnostic>` | `evals/run-ownership-header-fixtures.sh` | yes (a): engine S1/S3 checks at `scripts/lib/conformance-engine.sh:1309`, 1354, 1412, 1440; dispatch at 3503 | 0 | 0 | [keep](#shared-harness-judgments) |
| H38 | 12 always @ 1094 | no: inside 12 | `evals/run-verify-reaches-fixtures.sh` | `eval harness run-verify-reaches-fixtures.sh <diagnostic>` | `evals/run-verify-reaches-fixtures.sh` | no: host-local reachability checker example (`skills/orchestrator/SKILL.md:51`), not an adopter script step; no engine call | 0 | 0 | [keep (fixture of G0672)](#shared-harness-judgments) |
| H39 | 12 always @ 1094 | no: inside 12 | `evals/run-adr-family-fixtures.sh` | `eval harness run-adr-family-fixtures.sh <diagnostic>` | `evals/run-adr-family-fixtures.sh` | yes (a): engine S4 checks at `scripts/lib/conformance-engine.sh:1535`, 1604, 1643, 1680, 1742; dispatch at 3503 | 0 | 0 | [keep](#shared-harness-judgments) |
| H40 | 12 always @ 1094 | no: inside 12 | `evals/run-night-run-gate-exception-fixtures.sh` | `eval harness run-night-run-gate-exception-fixtures.sh <diagnostic>` | `evals/run-night-run-gate-exception-fixtures.sh` | no: local launcher gate exception; adopter substitutes their own trigger and gate (`skills/orchestrator/references/night-run.md:15`) | 0 | 0 | [cut](#shared-harness-judgments) |
| H41 | 12 always @ 1094 | no: inside 12 | `evals/run-night-run-outcome-fixtures.sh` | `eval harness run-night-run-outcome-fixtures.sh <diagnostic>` | `evals/run-night-run-outcome-fixtures.sh` | no: local launcher outcome reaper; adopter substitutes their own trigger (`skills/orchestrator/references/night-run.md:15`) | 0 | 0 | [cut](#shared-harness-judgments) |
| H42 | 12 always @ 1094 | no: inside 12 | `evals/run-foreign-repo-fixtures.sh` | `eval harness run-foreign-repo-fixtures.sh <diagnostic>` | `evals/run-foreign-repo-fixtures.sh` | yes (a): consumer entry `conformance.sh:17` executes engine; engine dispatch at `scripts/lib/conformance-engine.sh:3503` | 2 | 2 | [keep](#history-h42) |
| H43 | 12 always @ 1094 | no: inside 12 | `evals/run-dispatch-preflight-fixtures.sh` | `eval harness run-dispatch-preflight-fixtures.sh <diagnostic>` | `evals/run-dispatch-preflight-fixtures.sh` | yes (b): run preflight snippet, `skills/orchestrator/references/dispatch.md:134` (snippet at 140) | unknown (>=1) | unknown (>=0) | [keep (unknown, owner rules)](#history-h43) |
| H44 | 12 always @ 1094 | no: inside 12 | `evals/run-conformance-engine-fixtures.sh` | `eval harness run-conformance-engine-fixtures.sh <diagnostic>` | `evals/run-conformance-engine-fixtures.sh` | yes (a): engine driver at `scripts/lib/conformance-engine.sh:3503` | 1 | 1 | [keep (fixture of G0435)](#history-h44) |
| H45 | 12 always @ 1094 | no: inside 12 | `evals/run-store-readers-fixtures.ts` | `eval harness run-store-readers-fixtures.ts <diagnostic>` | `evals/run-store-readers-fixtures.ts` | no: maintainer fixture/tooling | 0 | 0 | [cut (borderline, owner rules)](#coordinator-rulings-after-review) |
| H46 | 12 always @ 1094 | no: inside 12 | `evals/run-store-writers-fixtures.ts` | `eval harness run-store-writers-fixtures.ts <diagnostic>` | `evals/run-store-writers-fixtures.ts` | no: maintainer fixture/tooling | 0 | 0 | [cut (borderline, owner rules)](#coordinator-rulings-after-review) |
| H47 | 12 always @ 1094 | no: inside 12 | `evals/run-qa-store-legs-fixtures.ts` | `eval harness run-qa-store-legs-fixtures.ts <diagnostic>` | `evals/run-qa-store-legs-fixtures.ts` | yes (a): engine calls `sprint-members-cli.ts` at `scripts/lib/conformance-engine.sh:2150` | 0 | 0 | [keep](#shared-harness-judgments) |
| H48 | 12 always @ 1094 | no: inside 12 | `evals/run-promote-check-fixtures.ts` | `eval harness run-promote-check-fixtures.ts <diagnostic>` | `evals/run-promote-check-fixtures.ts` | no: maintainer fixture/tooling | 0 | 0 | [cut](#shared-harness-judgments) |
| H49 | 12 always @ 1094 | no: inside 12 | `evals/run-learnings-metadata-fixtures.ts` | `eval harness run-learnings-metadata-fixtures.ts <diagnostic>` | `evals/run-learnings-metadata-fixtures.ts` | no: maintainer fixture/tooling | 0 | 0 | [keep (fixture of G0733)](#shared-harness-judgments) |
| H50 | 12 always @ 1094 | no: inside 12 | `evals/run-tick-box-fixtures.ts` | `eval harness run-tick-box-fixtures.ts <diagnostic>` | `evals/run-tick-box-fixtures.ts` | no: optional host-local tick-tool example (`skills/orchestrator/references/dispatch.md:91`), not an adopter script step; no engine call | 0 | 0 | [cut](#shared-harness-judgments) |
| H51 | 12 always @ 1094 | no: inside 12 | `evals/run-workflow-command-fixtures.ts` | `eval harness run-workflow-command-fixtures.ts <diagnostic>` | `evals/run-workflow-command-fixtures.ts` | no: maintainer fixture/tooling | 0 | 0 | [cut](#shared-harness-judgments) |
| H52 | 12 always @ 1094 | no: inside 12 | `evals/run-conformance-line-fixtures.ts` | `eval harness run-conformance-line-fixtures.ts <diagnostic>` | `evals/run-conformance-line-fixtures.ts` | no: maintainer fixture/tooling | 0 | 0 | [keep (fixture of G1671)](#coordinator-rulings-after-review) |
| H53 | 12 optin @ 1094 | no: inside 12 | `evals/run-work-store-fixtures.ts` | `eval harness run-work-store-fixtures.ts <diagnostic>` | `evals/run-work-store-fixtures.ts` | no: maintainer fixture/tooling | 1 | 1 | [keep](#history-h53) |
| H54 | 12 optin @ 1094 | no: inside 12 | `evals/run-layers-observed-test-fixtures.ts` | `eval harness run-layers-observed-test-fixtures.ts <diagnostic>` | `evals/layers-observed.test.ts` | no: maintainer fixture/tooling | 0 | 0 | [keep (fixture of G1544)](#history-h54) |
| H55 | 12 optin @ 1094 | no: inside 12 | `evals/run-worktree-base-fixtures.sh` | `eval harness run-worktree-base-fixtures.sh <diagnostic>` | `evals/run-worktree-base-fixtures.sh` | yes (b): run base guard per worktree, `skills/orchestrator/references/dispatch.md:586` (snippet at 589) | 0 | 0 | [keep](#shared-harness-judgments) |
| H56 | 12 optin @ 1094 | no: inside 12 | `evals/run-attestation-fixtures.sh` | `eval harness run-attestation-fixtures.sh <diagnostic>` | `evals/run-attestation-fixtures.sh` | yes (a): engine S13 checks at `scripts/lib/conformance-engine.sh:823`, 853, 869, 894, 939; dispatch at 3503 | 0 | 0 | [keep](#shared-harness-judgments) |
| H57 | 12 optin @ 1094 | no: inside 12 | `evals/run-sprint-family-fixtures.sh` | `eval harness run-sprint-family-fixtures.sh <diagnostic>` | `evals/run-sprint-family-fixtures.sh` | yes (a): engine S9/S10/S11/S12 checks at `scripts/lib/conformance-engine.sh:2189`, 2453, 2694, 3287; dispatch at 3503 | 0 | 0 | [keep](#shared-harness-judgments) |
| H58 | 12 optin @ 1094 | no: inside 12 | `evals/run-qa-budget-position-fixtures.sh` | `eval harness run-qa-budget-position-fixtures.sh <diagnostic>` | `evals/run-qa-budget-position-fixtures.sh` | no: maintainer fixture/tooling | 1 | 1 | [keep (fixture of G0147, G1094)](#history-h58) |
| H59 | 12 optin @ 1094 | no: inside 12 | `evals/run-doc-caps-differential.ts` | `eval harness run-doc-caps-differential.ts <diagnostic>` | `evals/run-doc-caps-differential.ts` | no: maintainer fixture/tooling | 0 | 0 | [cut](#shared-harness-judgments) |
| H60 | 12 optin @ 1094 | no: inside 12 | `evals/run-night-run-rollup-differential-parity.ts` | `eval harness run-night-run-rollup-differential-parity.ts <diagnostic>` | `evals/run-night-run-rollup-differential-parity.ts` | no: rollup record reader parity (`skills/orchestrator/references/night-run.md:671`); no engine call | 0 | 0 | [cut](#shared-harness-judgments) |
| H61 | 12 optin @ 1094 | no: inside 12 | `evals/run-by-reference-fixtures.ts` | `eval harness run-by-reference-fixtures.ts <diagnostic>` | `evals/run-by-reference-fixtures.ts` | yes (a): engine calls `check-sprint-by-reference.ts` at `scripts/lib/conformance-engine.sh:2266` | 0 | 0 | [keep (fixture of G1447)](#history-h61) |
| H62 | 12 optin @ 1094 | no: inside 12 | `evals/run-orchestrator-store-fixtures.ts` | `eval harness run-orchestrator-store-fixtures.ts <diagnostic>` | `evals/run-orchestrator-store-fixtures.ts` | yes (a): engine calls `check-sprint-by-reference.ts` at `scripts/lib/conformance-engine.sh:2266` | 3 | 0 | [keep](#history-h62) |

Long name sets continue below without creating additional checker rows. Every listed name has the same `<diagnostic>` meaning; C uses the conditional rule below.

| Name set | Owner | Templates |
|---|---|---|
| N0435a | G0435 | `conformance engine: <diagnostic>` (C); `conformance: <diagnostic>` (C); `S13.TRAILERS <diagnostic>` (C); `S13.OWNCOMMIT <diagnostic>` (C); `S13.EVIDENCESHA <diagnostic>` (C); `S13.AGREE <diagnostic>` (C); `S13.UNSIGNEDCLAIM <diagnostic>` (C); `gates-signed: <diagnostic>`; `ownership-header-missing: <diagnostic>` (C) |
| N0435b | G0435 | `ownership-header-field-missing: <diagnostic>` (C); `S3.SCHEMA <diagnostic>`; `owner-not-a-role: <diagnostic>` (C); `S1.LAW2 <diagnostic>`; `update-trigger-absent: <diagnostic>` (C); `S1.LAW3 <diagnostic>`; `S3.AGENTS <diagnostic>`; `agents-ownership-footer-missing: <diagnostic>` (C); `adr-path-noncanonical: <diagnostic>` (C) |
| N0435c | G0435 | `S4.ONEFILE <diagnostic>`; `decisions-index-missing-adr: <diagnostic>` (C); `S4.INDEX <diagnostic>`; `adr-required-section-missing: <diagnostic>` (C); `S4.SECTIONS <diagnostic>`; `adr-no-negative-consequence: <diagnostic>`; `S4.NEGATIVE <diagnostic>` (C); `adr-edited-after-decision: <diagnostic>` (C); `S4.APPEND <diagnostic>` |
| N0435d | G0435 | `core-file-missing: <diagnostic>` (C); `S2.F-FILE <diagnostic>`; `file-outside-canonical-placement: <diagnostic>` (C); `S2.R-PLACEMENT <diagnostic>`; `bun-required: <diagnostic>` (C); `sprint-plan-over-hard-cap: <diagnostic>` (C); `sprint-log-missing: <diagnostic>` (C); `S9.TWOFILES <diagnostic>` |
| N0435e | G0435 | `sprint-log-outside-logs-dir: <diagnostic>` (C); `S9.LOGDIR <diagnostic>`; `plan-edited-after-freeze: <diagnostic>` (C); `S9.PLANFROZEN <diagnostic>`; `scope-change-logged-after-plan-edit: <diagnostic>` (C); `S9.SCOPECHANGE <diagnostic>` (C); `dod-criterion-names-no-check: <diagnostic>` (C); `S9.VERIFYCLAUSE <diagnostic>` |
| N0435f | G0435 | `retro-bucket-unrouted: <diagnostic>` (C); `S10.FOURBUCKETS <diagnostic>` (C); `learning-recurred-unpromoted: <diagnostic>` (C); `S10.PROMOTION <diagnostic>`; `td-row-aged-unreviewed: <diagnostic>`; `S10.TDAGING <diagnostic>` (C); `promote-checklist-absent: <diagnostic>` (C); `S10.PROMOTEREVIEW <diagnostic>` |
| N0435g | G0435 | `spec-table-unreadable: <diagnostic>` (C); `resolved-td-row-past-retention: <diagnostic>` (C); `S11.TDDELETE <diagnostic>`; `promoted-learning-not-collapsed: <diagnostic>` (C); `S11.LEARNINGS <diagnostic>`; `closed-task-past-retention: <diagnostic>` (C); `S11.BACKLOG <diagnostic>`; `closed-sprint-not-archived: <diagnostic>` (C) |
| N0435h | G0435 | `sprint-index-row-missing: <diagnostic>` (C); `S11.SPRINT <diagnostic>`; `sprint-log-archived-apart-from-plan: <diagnostic>` (C); `S11.LOGPAIR <diagnostic>`; `changelog-not-rotated-at-minor: <diagnostic>` (C); `S11.CHANGELOG <diagnostic>`; `retention-trigger-ran-in-wrong-phase: <diagnostic>` (C); `S11.WHENITRUNS <diagnostic>` |
| N0435i | G0435 | `secret-committed: <diagnostic>` (C); `S12.SECRETS <diagnostic>`; `database-backup-committed: <diagnostic>` (C); `S12.BACKUPS <diagnostic>`; `design-source-committed: <diagnostic>` (C); `S12.DESIGNSRC <diagnostic>`; `generated-artifact-committed: <diagnostic>` (C); `S12.GENERATED <diagnostic>`; `S2.R-README <diagnostic>` |
| N0435j | G0435 | `S2.F-TIER <diagnostic>` (C); `S6.BASE <diagnostic>`; `S6.BACKEND <diagnostic>` (C); `S6.MEDIUM <diagnostic>` (C); `S6.MULTISVC <diagnostic>` (C); `<member-error> -- <subject>: <rule> could not read this sprint’s members <diagnostic>` (C) |
| N0636a | G0636 | `review depth: <diagnostic>` (C); `review depth <diagnostic>`; `review-depth-consequence-vocab: <diagnostic>` (C); `review-depth-governance-absent: <diagnostic>` (C); `review-depth-material-absent: <diagnostic>` (C); `review-depth-unclassified: <diagnostic>` (C); `review-depth-governance-self-reviewed: <diagnostic>` (C) |
| N0636b | G0636 | `review-depth-material-self-reviewed: <diagnostic>` (C) |
| N0733a | G0733 | `knowledge index current <diagnostic>`; `knowledge index STALE <diagnostic>` (C); `learnings refs resolve <diagnostic>`; `learnings dangling refs: <diagnostic>` (C); `learnings metadata complete <diagnostic>`; `learnings metadata: <diagnostic>` (C); `learnings body metadata complete <diagnostic>` |
| N0733b | G0733 | `learnings body metadata missing: <diagnostic>` (C); `corpus refs resolve <diagnostic>`; `corpus dangling refs: <diagnostic>` (C); `corpus metadata complete <diagnostic>`; `corpus metadata: <diagnostic>` (C) |

### Source conditions and reconciliation

Source enumeration reads `ok/bad` calls and column-leading `printf/echo` emitters in `scripts/qa-check.sh` and its relayed shell checkers; it reads TypeScript verdict strings, `ok/bad` calls, density finding text and Verify findings in the relayed TS checkers.
It expands `check_claim` labels from their calls, the engine’s README/tier parameters, and the two harness lists. Engine per-file findings retain the rule-id suffix. The member-CLI error relay keeps its distinctive “could not read this sprint’s members” suffix.
Aggregate-only legs 14–16 own their wrapper’s names, not captured internal lines. The uncalled `cap()` helper, `doc-caps --calibrate` and density’s single-file mode are outside the gate call graph. No paid/API path is executed.
The source selector yields **620 distinct expanded emission expressions**, grouped into **236 label templates**. **137 expressions** match this log; **483** are conditional. Of the labels, **132** are seen and **104** are conditional.
Every unseen FAIL expression is conditional on its own named rejected-input/setup branch (`bad()` or a FAIL-valued result). Its full message and condition remain at the row’s checker source; wrapper failures are in that leg’s qa-check section. Budget failures require the default profile, which QA_FULL bypasses.
Unseen nonfailure expressions have the source prerequisites below. These are checked independently of the log; an unseen expression with neither a failure branch nor a listed prerequisite is a reconciliation error.

| Owner | Source expression | Conditional prerequisite |
|---|---|---|
| G1511 | `scripts/qa-check.sh:1534` | conditional: a recorded approval envelope passes all dimension and pin checks |
| G1544 | `scripts/qa-check.sh:1585` | conditional: layers-observed reports at least one sprint with uncommitted work (SKIP) |
| G0169 | `scripts/lib/check-doc-caps.ts:443` | conditional: a grandfathered hard-cap file is now back under its cap |
| G0234 | `scripts/lib/check-epic-archive.ts:445` | conditional: archived epic meets local conditions but has unresolved nonlocal members |
| G0234 | `scripts/lib/check-epic-archive.ts:470` | conditional: closed live epic meets local conditions but has unresolved nonlocal members |
| G0234 | `scripts/lib/check-epic-archive.ts:479` | conditional: closed epic meets its conditions but member sprints remain open |
| G0234 | `scripts/lib/check-epic-archive.ts:545` | conditional: active epic rollup is current for local members; some members are unresolved |
| G0268 | `scripts/lib/check-prose-density.ts:231` | conditional: a baseline file now has zero dense lines |
| G0297 | `scripts/lib/check-handoff-state.sh:176` | conditional: a live sprint has an unspent handoff with a known status/path |
| G0297 | `scripts/lib/check-handoff-state.sh:199` | conditional: HANDOFF-LEDGER.md has a spent entry |
| G0297 | `scripts/lib/check-handoff-state.sh:201` | conditional: HANDOFF-LEDGER.md has a live/consumed entry |
| G0324 | `scripts/lib/check-research-archive.sh:93` | conditional: an archived research verdict is superseded and has no live citer |
| G0435 | `scripts/lib/conformance-engine.sh:683` | conditional: declared tier includes this tier and all required documents pass |
| G0435 | `scripts/lib/conformance-engine.sh:713` | conditional: a valid explicit .conformance-tier exists |
| G0435 | `scripts/lib/conformance-engine.sh:850` | conditional: attestation trailers exist and all three required trailers are complete |
| G0435 | `scripts/lib/conformance-engine.sh:866` | conditional: attestation exists on a nonmerge commit that changes files |
| G0435 | `scripts/lib/conformance-engine.sh:881` | conditional: attestation Evidence path is pinned and resolves at that revision |
| G0435 | `scripts/lib/conformance-engine.sh:924` | conditional: attestation Gate and pinned sprint record agree |
| G0435 | `scripts/lib/conformance-engine.sh:944` | conditional: attestation exists and git signature status is G |
| G0435 | `scripts/lib/conformance-engine.sh:1028` | conditional: valid date-pinned gates_signed in a repository without git |
| G0435 | `scripts/lib/conformance-engine.sh:1719` | conditional: every examined ADR Consequences section names a Negative |
| G0435 | `scripts/lib/conformance-engine.sh:2379` | conditional: post-freeze Plan edits exist and every one has a prior scope-change record |
| G0435 | `scripts/lib/conformance-engine.sh:2497` | conditional: a closed live sprint has a readable close commit routing its Retro |
| G0435 | `scripts/lib/conformance-engine.sh:2591` | conditional: aged TD rows exist and every one appears in the aging sweep |
| G0435 | `scripts/lib/conformance-engine.sh:3116` | conditional: archived Plan/log pairs exist but git history is unavailable |
| G0567 | `scripts/lib/check-night-run-rollup.ts:242` | conditional: a run-complete entry exists and its rollup passes |
| G0672 | `scripts/lib/check-verify-reaches.ts:302` | conditional: a live Plan has at least one confirmed reachable mechanical target and no findings |
| G0672 | `scripts/lib/check-verify-reaches.ts:347` | conditional: a resolved member has at least one confirmed reachable mechanical target and no findings |
| G1640 | `scripts/lib/qa-budget-check.sh:157` | conditional: actual elapsed seconds exceed QA_CEILING_SECONDS |

The observed set contains **570 unique names: 538 PASS, 0 FAIL, 32 INFO**. This exceeds the gate tally because most conformance PASS lines are not counted. The INFO set is 31 conformance findings plus prose-density’s read-set measurement; no defect classification is made here.

`bun --no-env-file census-input/census.ts observed-full` → unmapped `[]`, double-mapped `[]` (full source-expression matching of all 570 names).
`bun --no-env-file census-input/census.ts source` → unmapped `[]`, double-mapped `[]`, extra templates `[]`, unseen-not-conditional `[]`.
Both enumerations map identities as well as counts. The source pass also checks the header/checkpoint population and conditional prerequisites. Manifest lockstep (G0917) and the conformance engine (G0435) are both consumer guards.

### Reproduction and fixture search

Commands run from this worktree in PowerShell. The only helper was scratch Bun TypeScript under `census-input/`; its rules are specified above, and it is not a retained checker. The coordinator removes the supplied log before commit.

`git diff --stat ec4ee660..e29815a9ad0cbd660fd80d3d2d9c827c4dd03215 -- scripts evals skills spec test` → empty.
`git diff --name-only e29815a9ad0cbd660fd80d3d2d9c827c4dd03215 -- scripts evals skills spec test` → empty (also verifies the later worktree HEAD and uncommitted source).
`bun --no-env-file census-input/census.ts inspect` → inspected label/diagnostic emission sites in the delegated checkers. An initial scratch null-match error was repaired once; the retry completed.
`bun --no-env-file census-input/census.ts fixtures` → inspected all 62 harnesses’ negative-case/runner references; no harness was executed locally.
`bun --no-env-file census-input/census.ts source-inspect` → source-label extraction review, 103 rows and 37 section headers; raw emission sites were checked against their wrappers.
`bun --no-env-file census-input/census.ts branches` → compared full expressions with the log; the nonfailure conditions above cover every unseen nonfailure branch.
`bun --no-env-file census-input/census.ts fixture-search` → literal basename search over rg-listed non-secret .sh/.ts/.md files in `evals/` and `test/`; every checker was searched, including rows with no fixture.
For inline `qa-check.sh` rows that search found 52 referring files. Read-back found no must-FAIL case for bootstrap, standalone ownership/frontmatter, README version, QA hygiene, L citations, raw-archive singularity, Plan schema, headless cues or harness registration. Engine ownership and launcher stub tests do not exercise those inline checks.
Rows with no executable verdict (profile, fold-in record, profiling comment and retired legs) also say `none`. G0733’s fixtures cover body metadata and index ordering, not every metadata/ref branch; G1094’s fixture covers its budget branch, not registration.
Initial `bun --no-env-file census-input/census.ts build` → wrote only the inventory; Baseline and Verdict were preserved byte-for-byte before this split. Retry: `bun --no-env-file census-input/retry.ts` moved the inventory and Baseline evidence here, preserving all figures and the ruling.
`bun --no-env-file census-input/census.ts verify` → validates the written inventory against source/log identities, all conditional branches, header/checkpoint coverage and fixture existence; negative controls exercise missing and duplicate mappings.
`bun --no-env-file scripts/lib/check-prose-density.ts docs/research/process-cost-census.md docs/research/logs/process-cost-census.md` → 1 PASS, 0 FAIL. The CLI reads only its first path argument, so this run covers the decision doc alone.
`bun --no-env-file scripts/lib/check-prose-density.ts docs/research/logs/process-cost-census.md` → 1 PASS, 0 FAIL. Together the runs cover both files; no prose line or table cell exceeds 400 characters.
`git diff --check` → clean.
`bun --no-env-file scripts/lib/check-doc-caps.ts` checks the decision doc against its 130-line soft cap; this appendix has no numeric cap. Placement ruling, verbatim: "Appendix in research/logs (Recommended)". Index regeneration and the integrated gate remain coordinator-owned. FAIL history, real-defect counts and rulings are all `T3`.

### Retry audit (2026-11-11)

Consumer guards: **23 yes**, **80 no**. Yes rows: G0435, G0905, G0917, G1447, H05, H13, H14, H17, H24, H29, H30, H34, H37, H39, H42, H43, H44, H47, H55, H56, H57, H61, H62.
Yes → no: G0636, G0672, G1511, H15, H22, H27, H28, H32, H36, H38, H40, H41, H50. All other flags retain their value; the row cells carry the basis. G0567 and G1474 remain no; G1447 remains yes (a). G0733 remains no: the skill instructs host index regeneration and labels this script as lean-flow's own example.
Typecheck coverage note belongs to G1055 and H04. H03 is the epic-archive harness at this pin; its fixture cell is unchanged.
`rg -n 'check-sprint-by-reference|check-review-depth|check-verify-reaches|check-night-run-rollup|check-authority|check-approval-envelope|gen-index' scripts/lib/conformance-engine.sh` → only the by-reference checker is called (2266); other hits are its comments/diagnostics.
`rg -n 'check-review-depth|check-verify-reaches|check-night-run-rollup|check-authority|check-approval-envelope|gen-index|tick-box' skills -g '*.md'` → the row-cited local examples/readers; all other row subjects were checked against engine calls and shipped skill steps too.
Both reconciliation passes and `verify` read the moved table; the verify pass checks unchanged identity/fixture columns against source, moved Baseline evidence against HEAD, every baseline figure and the verbatim ruling, plus missing/duplicate negative controls.
The scratch split first selected conditional-prerequisite rows as inventory rows and stopped before writing; one retry restricted the selector to the ten-column inventory and completed.

## Baseline evidence (TASK-647)

### Close-gate evidence and the SPRINT-171 mismatch

The approved timing rule selects the first close-time system-verify or gate entry on the integrated tree after the last member reached `done/`. Trial, replay and control results are excluded. Read these excerpts alongside the tree queries:

```powershell
Get-Content -Encoding UTF8 docs/sprint/archive/logs/SPRINT-169-jev-as-a-cheap-ab-judge.md | Select-Object -Skip 56 -First 22
Get-Content -Encoding UTF8 docs/sprint/archive/logs/SPRINT-170-agent-roles-rows-4b-to-9.md | Select-Object -Skip 552
Get-Content -Encoding UTF8 docs/sprint/archive/logs/SPRINT-171-finish-epic-024.md | Select-Object -Skip 215
git ls-tree -r --name-only 05c9fcbe -- docs/work/done | Select-String '/TASK-628-'
git ls-tree -r --name-only 67d3e5cd -- docs/work/done | Select-String '/TASK-(632|638|633|634|635|636|637)-'
git ls-tree -r --name-only da6c4dbd -- docs/work | Select-String '/TASK-(640|642|644|645|643|641|646)-'
git ls-tree -r --name-only 8a695d27 -- docs/work | Select-String '/TASK-644-'
git log --format='%h %s' --name-status '18148168^..ea460465' -- 'docs/work/*/TASK-644-*'
```

- **169:** the 2026-11-08 `surprise` entry names `05c9fcbe`, `QA-CHECK: 495 pass, 1 fail`. The sole member is in `done/` at that tree. The later `ceca166b` rerun is 496/0; `--close` is 4/0. First-run FAILs: **1**, a consequence-vocabulary record error.
- **170:** the 2026-11-10 `close-time record fixes` entry names `67d3e5cd`, qa-check **491 pass, 3 fail**; all seven members are in `done/`. The later `c4a4a7a0` rerun is 493/0. The earlier 299/1 at log line 553 belongs to T6's control/seed trial and is excluded.
- **171:** log line 217 states `da6c4dbd`, **504 pass, 12 fail**. Its tree contains six members in `done/` and TASK-644 in `review/`. TASK-644 is still in `review/` at the final system-verify tree `8a695d27` (509/1); its move to `done/` is `1a157d41`, after both runs.
- The 171 close entry reports all seven in `done/` and `check-sprint-by-reference --close` **16 pass, 0 fail**, but no system-verify after that move. This narrower check does not establish the full close-gate metric. The approved post-`done/` FAIL count is **unknown**, not zero; selecting a different timing or gate scope requires a ruling.

**Negative check:** 171's **59 total / 43 non-work** reproduce exactly, and **12 FAILs** reproduce as a logged close-time observation. The mismatch is eligibility: that run fails the approved post-`done/` condition. Neither the original 12 nor the missing qualifying result is silently replaced.

### Baseline arithmetic

```powershell
100 * [math]::Abs(12/1 - 43/7) / (43/7) # 95.3488372093023
100 * [math]::Abs(38/7 - 43/7) / (43/7) # 11.6279069767442
100 * [math]::Abs(1 - 12) / 12 # 91.6666666666667, conditional
100 * [math]::Abs(3 - 12) / 12 # 75, conditional
$medianWork = ((12/1), (38/7), (43/7) | Sort-Object)[1]
$medianWork # 6.14285714285714 = 43/7
$medianWork / 2 # 3.07142857142857 = 43/14
$medianFails = (1, 3, 12 | Sort-Object)[1] # conditional on accepting the observed 12
$medianFails # 3
$medianFails / 2 # 1.5
```

## FAIL history and proposed rulings (TASK-649)

Measured at `b40d66d334083914008c877ff09078e739a0a8e7`, 2026-11-11. All 103 T2 identities and all 23 consumer-guard flags are unchanged.
Proposals: **25 keep / 19 keep (fixture) / 17 keep (unknown) / 21 cut / 8 cut (with) / 6 cut (borderline) / 7 n/a** = 103 rows (61 kept, 35 proposed cuts, 7 without a ruling); 0 merge. No
rule, fixture or executable is removed by this census.

### Counting and classification judgments

Counting convention of this census: one FAIL is one archived Log entry reporting that row failing, however many diagnostic lines it contains. Re-runs reporting the same unresolved finding
count once. Several rows can fail in one entry; row totals must not be summed as unique incidents.
Read 124 standalone archived logs and dated Execution Log entries in 46 older/embedded sprint files: 1,800 entries. Embedded history includes SPRINT-001 through 044, plus 046 and 047.
SPRINT-157 is not an archived sprint on this branch and is outside this archived-history window.
Searches cover the entire archive, then attribution reads the dated Execution Log entry. Each row below records its literal rg search. File stems, old shell twins, diagnostic aliases and the
introducing sprint were also read so a renamed checker or unnamed fixture catch is not silently lost.
Real means the artifact or checker was wrong: missing required review, wrong behavior or population, actual undeclared writes, a broken real target, or a stale published count. Record means
only wording, formatting or bookkeeping changed. Environment means the same artifact passed after restoring a missing host prerequisite.
Deliberate seed/control failures, planned TDD red runs, replay trials and defects found by review while the check stayed green are excluded. An existing fixture unexpectedly exposing a
checker bug is included. A skipped harness is not a failed harness; its budget finding belongs to the gate row.
Unknown preserves an unreadable attribution or disposition. In unknown cells, >=N is only the number of classified entries below, never an exact total. Their real-defect lower bound counts
only entries explicitly marked real. Unknown does not mean zero.
Owner G2 ruling, verbatim: "Unknown, you rule (Recommended)". It answers: "How should T3 treat a check that existed before SPRINT-045 and caught no real defect since?" Any such check is keep
(unknown, owner rules), by age even when embedded logs exist. Older-log searches remain evidence for the owner; they do not establish complete history.
SPRINT-171 consequence-line failure is real under the owner ruling: T1 and T3 had no recorded completed review; T5 had never received the owed independent review. That review then found the
dropped both-runs screen-out rule. Seven diagnostics, three review obligations and the later fix remain one failing entry for G0636.
These classifications and the proposed rulings are judgment ticks. The scratch verifier checks arithmetic, identity and the negative condition; it cannot verify a judgment. The coordinator
owns the scoped review: re-read at least five rows and every proposed cut against these entries. No reviewer sign-off is claimed here.
EPIC-025 D2 rules checks and record steps. G0052, G0416, G0468, G0901, G0941, G0944 and G1671 print no check verdict: T2 listed them for population completeness and they carry no ruling,
labelled n/a (no check). G0043 and G0093 do print verdicts and remain judged rows.
Fixture coupling takes precedence over a harness's own FAIL history: a must-FAIL fixture exists to fail on purpose. A fixture of a kept check, including keep-unknown, is keep (fixture of
Gid); a fixture of a cut check is cut (with Gid). Only a harness with no governing G check uses its own history. Own findings remain recorded as evidence.


### Introduction and search census

Origins use `git log --diff-filter=A --format="%h %ad %s" --date=short -- <checker file>`; inline legs use `git log -S "<leg header>" --reverse --format="%h %ad %s" --date=short -- scripts/qa-check.sh`.
For migrated checkers the old shell file is queried too. `qb_checkpoint()`, `neither gated nor explicitly excluded`, `qa-runtime-over-ceiling` and `scope-change` are the additional -S tokens for G0147/G1094/G1640/G1447. SPRINT-035 is confirmed by `git show --format= --name-only af6d951b`.

| Row | First appearance / lineage | Archived-source search command |
|---|---|---|
| G0043 | 6c9ca7ba 2026-09-13 sprint(099): T3 revise -- an ELEVENTH site, and a cross-site guard for the set | `rg -n -i 'archive.predicate.*(?:not found\|missing)\|shared predicate not found' docs/sprint/archive -g '*.md'` |
| G0052 | 498a1490 2026-09-12 sprint(099): T1 -- measure the gate's memory; the premise does not survive | `rg -n -i 'QA_PROFILE\|profiling instrumentation' docs/sprint/archive -g '*.md'` |
| G0093 | e8649928 2026-08-25 sprint(086): T3 -- the budget guard now fires before what it guards, in both lateness paths | `rg -n -i 'qa.budget.default' docs/sprint/archive -g '*.md'` |
| G0147 | e8649928 · SPRINT-086 (qb_checkpoint function) | `rg -n -i 'budget.exceeded.early\|checkpoint.*budget' docs/sprint/archive -g '*.md'` |
| G0169 | d847df10 · SPRINT-008 inline; 329f87d6 · SPRINT-056 shell; b1ee2031 · SPRINT-103 TS | `rg -n -i 'doc.caps\|over.cap\|hard.cap\|token.budget\|line.cap\|SKILL.md.*(?:140\|cap)\|CLAUDE.md.*(?:80\|cap)' docs/sprint/archive -g '*.md'` |
| G0209 | d847df10 · SPRINT-008 inline; 971d30c5 · SPRINT-055 standalone | `rg -n -i 'count.claim\|tmpl.core\|tmpl.total\|template.count\|skills.count\|roster.count' docs/sprint/archive -g '*.md'` |
| G0234 | de7ec68b · SPRINT-055 shell; ac6dda22 · SPRINT-103 TS | `rg -n -i 'epic.archive\|epic.state\|epic.rollup' docs/sprint/archive -g '*.md'` |
| G0268 | 39a11003 2026-09-21 sprint(105) T2: make "split, never squeeze" checkable as a ratchet | `rg -n -i 'prose.density\|dense.line\|400.char' docs/sprint/archive -g '*.md'` |
| G0297 | 8caefcad 2026-09-03 sprint(094) T2: track handoff status + perform STANDARD Sec 12(b)'s conversion, 5 of 6 DoD | `rg -n -i 'handoff.state\|unspent.handoff' docs/sprint/archive -g '*.md'` |
| G0324 | f6d2b809 2026-08-09 sprint(55) T3: resolve close's undefined research archive target | `rg -n -i 'research.archive' docs/sprint/archive -g '*.md'` |
| G0348 | 097116dd 2026-08-09 sprint(55) T4: give both ephemeral intake artifacts a stated end of life | `rg -n -i 'ephemeral.intake' docs/sprint/archive -g '*.md'` |
| G0372 | edb8a846 2026-08-09 sprint(55) T6: give G1's fast-path clause a field it can actually read | `rg -n -i 'task.origin\|origin.missing\|origin.absent' docs/sprint/archive -g '*.md'` |
| G0396 | 6341378f · 2026-11-02 · SPRINT-159 T2 | `rg -n -i 'work.type\|bug.item.missing\|debt.item.missing' docs/sprint/archive -g '*.md'` |
| G0416 | e5f2552c 2026-08-22 sprint(078) T1: migrate §13's five attestation rules into the engine | `rg -n -i '2f.bis\|attestation.*fold' docs/sprint/archive -g '*.md'` |
| G0435 | 31033520 2026-08-18 sprint(75) T2: the engine core -- registry, mark-driven dispatch, and the report | `rg -n -i 'conformance\|S[0-9]+\.[A-Z]+\|plan.edited.after.freeze\|ownership.header.missing\|gates.signed\|scope.change.logged.after\|core.file.missing\|adr.path.noncanonical' docs/sprint/archive -g '*.md'` |
| G0468 | 81a31fe0 2026-08-25 sprint(084): T1 -- the gate finishes; spawn count, not corpus size, was the cost | `rg -n -i 'TD.084.*profil' docs/sprint/archive -g '*.md'` |
| G0567 | f79419d4 · SPRINT-059 shell; ac69d291 · SPRINT-103 TS | `rg -n -i 'night.run.rollup\|run.complete\|run.rollup' docs/sprint/archive -g '*.md'` |
| G0636 | 7cb20bf1 2026-08-24 sprint(082): T1+T2 -- absence of evidence stops reading as evidence of absence | `rg -n -i 'review.depth\|consequence.line\|consequence.vocab' docs/sprint/archive -g '*.md'` |
| G0672 | cb4e8875 · SPRINT-082 shell; ab99dd01 · SPRINT-109 TS | `rg -n -i 'verify.reach\|verify.method\|verify.does.not.reach\|verify.member.resolution' docs/sprint/archive -g '*.md'` |
| G0708 | d847df10 2026-06-21 feat(qa): hybrid structural QA check + QA.md + ADR-008 (SPRINT-008 T1) | `rg -n -i 'frontmatter\|ownership.header\|ownership.*(?:FAIL\|red\|missing)' docs/sprint/archive -g '*.md'` |
| G0733 | SPRINT-013 index predecessor; 4af07115 · SPRINT-014 current corpus leg | `rg -n -i 'knowledge.index\|corpus.ref\|corpus.metadata\|dangling\|learnings.*(?:metadata\|refs)\|gen.index\|related:\|metadata.missing' docs/sprint/archive -g '*.md'` |
| G0901 | d75d861c 2026-10-01 sprint(111) T3: retire every TODO.md reader and S11.TODOCAP (spec 0.13.0, breaking) | `rg -n -i 'TODO.*cap\|5.*retired' docs/sprint/archive -g '*.md'` |
| G0905 | f1e51ea9 2026-07-17 feat(qa): 5 blind-class lints (README version, ownership, TD aging, temp-trackers, cap snapshots) + gen-index self-stamp (SPRINT-024 T3, TASK-075) | `rg -n -i 'README.*(?:version\|footer)\|footer.*version' docs/sprint/archive -g '*.md'` |
| G0917 | aa418bc6 2026-08-09 sprint(56) T5: give the manifest lockstep rule a check | `rg -n -i 'manifest.lockstep\|lockstep' docs/sprint/archive -g '*.md'` |
| G0941 | d75d861c 2026-10-01 sprint(111) T3: retire every TODO.md reader and S11.TODOCAP (spec 0.13.0, breaking) | `rg -n -i 'TD.aging\|7.*retired' docs/sprint/archive -g '*.md'` |
| G0944 | d75d861c 2026-10-01 sprint(111) T3: retire every TODO.md reader and S11.TODOCAP (spec 0.13.0, breaking) | `rg -n -i 'temp.tracker\|8.*retired' docs/sprint/archive -g '*.md'` |
| G0947 | f1e51ea9 2026-07-17 feat(qa): 5 blind-class lints (README version, ownership, TD aging, temp-trackers, cap snapshots) + gen-index self-stamp (SPRINT-024 T3, TASK-075) | `rg -n -i 'QA.md.*(?:snapshot\|hygiene\|cap)\|cap.snapshot' docs/sprint/archive -g '*.md'` |
| G0959 | 60ec8fba 2026-07-17 feat(knowledge): L-NNN ids monotonic + retired-ids ledger; broken cites relabeled; citation lint (SPRINT-024 T9, TASK-081) | `rg -n -i 'L.NNN.*(?:citation\|resolve)\|citation.unresolved\|citation.lint' docs/sprint/archive -g '*.md'` |
| G0985 | 6c9ca7ba 2026-09-13 sprint(099): T3 revise -- an ELEVENTH site, and a cross-site guard for the set | `rg -n -i 'archive.predicate\|raw.archive.exclusion' docs/sprint/archive -g '*.md'` |
| G1015 | af6d951b · SPRINT-035 (commit touches that Plan) | `rg -n -i 'schema.complete\|missing:.*(?:risk\|size\|Layers\|Depends\|Class)\|plan.schema\|sprint.schema' docs/sprint/archive -g '*.md'` |
| G1055 | b5ece544 2026-08-27 sprint(091) T1: wire the typecheck leg; correct Layers per L-100 | `rg -n -i 'typecheck\|tsc\|TS[0-9]{4}' docs/sprint/archive -g '*.md'` |
| G1094 | 3f1ab62e · SPRINT-039 registration; 4939b790 · SPRINT-042 harness split | `rg -n -i 'unlisted\|neither.gated\|qa.check.budget.exceeded\|harness.*registr\|harness.*missing' docs/sprint/archive -g '*.md'` |
| G1384 | cb3db1bc 2026-07-30 feat(qa-check): guard headless park-record cue in migrate/init (SPRINT-041 T1) | `rg -n -i 'headless.park.record\|park.record.cue' docs/sprint/archive -g '*.md'` |
| G1407 | e01d7827 · SPRINT-042 shell; f6a768ce · SPRINT-103 TS | `rg -n -i 'layers.completeness\|layers.incomplete\|changed.but.undeclared\|shared.file.unowned' docs/sprint/archive -g '*.md'` |
| G1447 | fa69a1ba / e353cbb7 · SPRINT-120 scope-change mode; file 3676a003 · SPRINT-107 | `rg -n -i 'scope.change.layers\|scope.change.undeclared\|scope.change.path\|scope.change.*(?:FAIL\|finding\|Cites)' docs/sprint/archive -g '*.md'` |
| G1474 | d8abd702 · SPRINT-088 shell; b1ee2031 · SPRINT-103 TS | `rg -n -i 'authority.*(?:FAIL\|mismatch\|drift\|invalid\|missing)\|check.authority\|member.authority' docs/sprint/archive -g '*.md'` |
| G1511 | 94899962 2026-08-26 sprint(088): T4 -- pre-launch approval envelope; 3 of 4 DoD | `rg -n -i 'approval.envelope\|envelope.*FAIL' docs/sprint/archive -g '*.md'` |
| G1544 | 71c093cd · SPRINT-043 shell; bdc232d2 · SPRINT-103 TS | `rg -n -i 'layers.observed\|UNATTRIBUTED' docs/sprint/archive -g '*.md'` |
| G1597 | 825bb7ad 2026-09-14 sprint(101): T3 -- DoD-delta guard (claimed figure vs actual ticks) | `rg -n -i 'dod.delta' docs/sprint/archive -g '*.md'` |
| G1640 | d498324f · SPRINT-099; INFO-only since a6d0af87 · SPRINT-102 | `rg -n -i 'qa.runtime\|qa.budget\|budget.exceeded\|over.ceiling' docs/sprint/archive -g '*.md'` |
| G1671 | d847df10 2026-06-21 feat(qa): hybrid structural QA check + QA.md + ADR-008 (SPRINT-008 T1) | `rg -n -i 'CONFORMANCE:\|summary.*tally' docs/sprint/archive -g '*.md'` |
| H01 | ae9673b4 2026-09-24 sprint(106) T3: queue skills detect v1/v2/mixed and refuse v1 by name; ADR-046 | `rg -n -i 'run-layout-fixtures\.ts\|layout[- ](?:fixture\|fixtures\|harness\|suite\|test)\|(?:harness\|suite).{0,50}layout' docs/sprint/archive -g '*.md'` |
| H02 | 14d2c9f8 2026-09-24 sprint(106) T4: migrate carries a v1 repo onto the store; README upgrade guide | `rg -n -i 'run-v1-to-v2-fixtures\.ts\|v1[- ]to[- ]v2[- ](?:fixture\|fixtures\|harness\|suite\|test)\|(?:harness\|suite).{0,50}v1[- ]to[- ]v2' docs/sprint/archive -g '*.md'` |
| H03 | de7ec68b 2026-08-09 sprint(55) T2: run the epic archive rule for the first time since it shipped | `rg -n -i 'run-epic-archive-fixtures\.sh\|epic[- ]archive[- ](?:fixture\|fixtures\|harness\|suite\|test)\|(?:harness\|suite).{0,50}epic[- ]archive' docs/sprint/archive -g '*.md'` |
| H04 | 0fc075cf 2026-09-23 sprint(104) T1: gate the population fixture, un-rule DoD 7 as genuinely satisfied | `rg -n -i 'run-typecheck-population-fixtures\.ts\|typecheck[- ]population[- ](?:fixture\|fixtures\|harness\|suite\|test)\|(?:harness\|suite).{0,50}typecheck[- ]population' docs/sprint/archive -g '*.md'` |
| H05 | 309b1e75 2026-09-23 sprint(104) T2: retain the emitter-column fixture, all three arms discriminated | `rg -n -i 'run-emitter-column-fixtures\.ts\|emitter[- ]column[- ](?:fixture\|fixtures\|harness\|suite\|test)\|(?:harness\|suite).{0,50}emitter[- ]column' docs/sprint/archive -g '*.md'` |
| H06 | 3fa08b1b 2026-08-09 sprint(47) T1: split the Execution Log into an uncapped logs/ sibling | `rg -n -i 'run-sprint-log-layout-fixtures\.sh\|sprint[- ]log[- ]layout[- ](?:fixture\|fixtures\|harness\|suite\|test)\|(?:harness\|suite).{0,50}sprint[- ]log[- ]layout' docs/sprint/archive -g '*.md'` |
| H07 | d8abd702 2026-08-26 sprint(088): T1 -- declare J0/J1/J2 authority and guard it; 3 of 5 DoD | `rg -n -i 'run-authority-fixtures\.sh\|authority[- ](?:fixture\|fixtures\|harness\|suite\|test)\|(?:harness\|suite).{0,50}authority' docs/sprint/archive -g '*.md'` |
| H08 | 39a11003 2026-09-21 sprint(105) T2: make "split, never squeeze" checkable as a ratchet | `rg -n -i 'run-prose-density-fixtures\.ts\|prose[- ]density[- ](?:fixture\|fixtures\|harness\|suite\|test)\|(?:harness\|suite).{0,50}prose[- ]density' docs/sprint/archive -g '*.md'` |
| H09 | e8649928 2026-08-25 sprint(086): T3 -- the budget guard now fires before what it guards, in both lateness paths | `rg -n -i 'run-qa-budget-default-fixtures\.sh\|qa[- ]budget[- ]default[- ](?:fixture\|fixtures\|harness\|suite\|test)\|(?:harness\|suite).{0,50}qa[- ]budget[- ]default' docs/sprint/archive -g '*.md'` |
| H10 | 097116dd 2026-08-09 sprint(55) T4: give both ephemeral intake artifacts a stated end of life | `rg -n -i 'run-ephemeral-intake-fixtures\.sh\|ephemeral[- ]intake[- ](?:fixture\|fixtures\|harness\|suite\|test)\|(?:harness\|suite).{0,50}ephemeral[- ]intake' docs/sprint/archive -g '*.md'` |
| H11 | edb8a846 2026-08-09 sprint(55) T6: give G1's fast-path clause a field it can actually read | `rg -n -i 'run-task-origin-fixtures\.sh\|task[- ]origin[- ](?:fixture\|fixtures\|harness\|suite\|test)\|(?:harness\|suite).{0,50}task[- ]origin' docs/sprint/archive -g '*.md'` |
| H12 | 6341378f · 2026-11-02 · SPRINT-159 T2 | `rg -n -i 'run-work-type-fixtures\.sh\|work[- ]type[- ](?:fixture\|fixtures\|harness\|suite\|test)\|(?:harness\|suite).{0,50}work[- ]type' docs/sprint/archive -g '*.md'` |
| H13 | 48d4a1cd 2026-07-30 sprint(38) T1b: probe worktree usability; leave agent-dispatch honestly un-probed | `rg -n -i 'run-worktree-usability-fixtures\.sh\|worktree[- ]usability[- ](?:fixture\|fixtures\|harness\|suite\|test)\|(?:harness\|suite).{0,50}worktree[- ]usability' docs/sprint/archive -g '*.md'` |
| H14 | 1b4ec5bb 2026-07-30 sprint(38) T1a: skill-freshness check -- content-first, catches the unbumped edit | `rg -n -i 'run-skill-freshness-fixtures\.sh\|skill[- ]freshness[- ](?:fixture\|fixtures\|harness\|suite\|test)\|(?:harness\|suite).{0,50}skill[- ]freshness' docs/sprint/archive -g '*.md'` |
| H15 | a1505f31 2026-09-20 sprint(103): T1 branch (c) -- reduce the spec, 319s -> 184s, output identical | `rg -n -i 'run-sprint-family-spec-reduction-fixtures\.ts\|sprint[- ]family[- ]spec[- ]reduction[- ](?:fixture\|fixtures\|harness\|suite\|test)\|(?:harness\|suite).{0,50}sprint[- ]family[- ]spec[- ]reduction' docs/sprint/archive -g '*.md'` |
| H16 | 971d30c5 2026-08-09 sprint(55) T1: guard the template counts, and the guard that guards them | `rg -n -i 'run-count-claims-fixtures\.sh\|count[- ]claims[- ](?:fixture\|fixtures\|harness\|suite\|test)\|(?:harness\|suite).{0,50}count[- ]claims' docs/sprint/archive -g '*.md'` |
| H17 | aa418bc6 2026-08-09 sprint(56) T5: give the manifest lockstep rule a check | `rg -n -i 'run-manifest-lockstep-fixtures\.sh\|manifest[- ]lockstep[- ](?:fixture\|fixtures\|harness\|suite\|test)\|(?:harness\|suite).{0,50}manifest[- ]lockstep' docs/sprint/archive -g '*.md'` |
| H18 | 825bb7ad 2026-09-14 sprint(101): T3 -- DoD-delta guard (claimed figure vs actual ticks) | `rg -n -i 'run-dod-delta-fixtures\.sh\|dod[- ]delta[- ](?:fixture\|fixtures\|harness\|suite\|test)\|(?:harness\|suite).{0,50}dod[- ]delta' docs/sprint/archive -g '*.md'` |
| H19 | fe3a00d6 2026-08-09 sprint(56) T4: keep the sprint checks armed through the close commit | `rg -n -i 'run-sprint-close-fixtures\.sh\|sprint[- ]close[- ](?:fixture\|fixtures\|harness\|suite\|test)\|(?:harness\|suite).{0,50}sprint[- ]close' docs/sprint/archive -g '*.md'` |
| H20 | f6d2b809 2026-08-09 sprint(55) T3: resolve close's undefined research archive target | `rg -n -i 'run-research-archive-fixtures\.sh\|research[- ]archive[- ](?:fixture\|fixtures\|harness\|suite\|test)\|(?:harness\|suite).{0,50}research[- ]archive' docs/sprint/archive -g '*.md'` |
| H21 | 81a31fe0 2026-08-25 sprint(084): T1 -- the gate finishes; spawn count, not corpus size, was the cost | `rg -n -i 'run-qa-budget-fixtures\.sh\|qa[- ]budget[- ](?:fixture\|fixtures\|harness\|suite\|test)\|(?:harness\|suite).{0,50}qa[- ]budget' docs/sprint/archive -g '*.md'` |
| H22 | 1b14d617 2026-08-26 sprint(088): T3 -- `overnight` canonical, aliases preserved; 4 of 4 DoD | `rg -n -i 'run-run-mode-fixtures\.sh\|run[- ]mode[- ](?:fixture\|fixtures\|harness\|suite\|test)\|(?:harness\|suite).{0,50}run[- ]mode' docs/sprint/archive -g '*.md'` |
| H23 | 329f87d6 2026-08-09 sprint(56) T2: derive doc-cap coverage from DOCS_Guide section 2 | `rg -n -i 'run-doc-caps-fixtures\.sh\|doc[- ]caps[- ](?:fixture\|fixtures\|harness\|suite\|test)\|(?:harness\|suite).{0,50}doc[- ]caps' docs/sprint/archive -g '*.md'` |
| H24 | bb0763a4 2026-08-26 test(engine): guard the git-availability branch that no fixture could discriminate | `rg -n -i 'run-git-availability-fixtures\.sh\|git[- ]availability[- ](?:fixture\|fixtures\|harness\|suite\|test)\|(?:harness\|suite).{0,50}git[- ]availability' docs/sprint/archive -g '*.md'` |
| H25 | aabe874f 2026-09-26 sprint(108) T2: retained locale fixtures for gen-index.sh + register in qa-check.sh | `rg -n -i 'run-gen-index-locale-fixtures\.ts\|gen[- ]index[- ]locale[- ](?:fixture\|fixtures\|harness\|suite\|test)\|(?:harness\|suite).{0,50}gen[- ]index[- ]locale' docs/sprint/archive -g '*.md'` |
| H26 | e01d7827 2026-08-01 feat(qa-check): cross-check declared Layers against DoD-implied files (SPRINT-042 T3) | `rg -n -i 'run-layers-completeness-fixtures\.sh\|layers[- ]completeness[- ](?:fixture\|fixtures\|harness\|suite\|test)\|(?:harness\|suite).{0,50}layers[- ]completeness' docs/sprint/archive -g '*.md'` |
| H27 | 2d09fdbd 2026-09-11 sprint(098): T2 -- revise-loop ceiling wired into the reaper (ADR-022 item 2) | `rg -n -i 'run-revise-loop-ceiling-fixtures\.sh\|revise[- ]loop[- ]ceiling[- ](?:fixture\|fixtures\|harness\|suite\|test)\|(?:harness\|suite).{0,50}revise[- ]loop[- ]ceiling' docs/sprint/archive -g '*.md'` |
| H28 | 94899962 2026-08-26 sprint(088): T4 -- pre-launch approval envelope; 3 of 4 DoD | `rg -n -i 'run-approval-envelope-fixtures\.sh\|approval[- ]envelope[- ](?:fixture\|fixtures\|harness\|suite\|test)\|(?:harness\|suite).{0,50}approval[- ]envelope' docs/sprint/archive -g '*.md'` |
| H29 | 3a1cfc1e 2026-08-10 sprint(57) T5: record the G1/G2 sign-off where the run can read it | `rg -n -i 'run-gates-signed-fixtures\.sh\|gates[- ]signed[- ](?:fixture\|fixtures\|harness\|suite\|test)\|(?:harness\|suite).{0,50}gates[- ]signed' docs/sprint/archive -g '*.md'` |
| H30 | 15cb0599 2026-08-18 sprint(75) T1: the rule-source reader, generalised from §13 to all 13 sections | `rg -n -i 'run-spec-reader-fixtures\.sh\|spec[- ]reader[- ](?:fixture\|fixtures\|harness\|suite\|test)\|(?:harness\|suite).{0,50}spec[- ]reader' docs/sprint/archive -g '*.md'` |
| H31 | 8caefcad 2026-09-03 sprint(094) T2: track handoff status + perform STANDARD Sec 12(b)'s conversion, 5 of 6 DoD | `rg -n -i 'run-handoff-state-fixtures\.sh\|handoff[- ]state[- ](?:fixture\|fixtures\|harness\|suite\|test)\|(?:harness\|suite).{0,50}handoff[- ]state' docs/sprint/archive -g '*.md'` |
| H32 | 7cb20bf1 2026-08-24 sprint(082): T1+T2 -- absence of evidence stops reading as evidence of absence | `rg -n -i 'run-review-depth-fixtures\.sh\|review[- ]depth[- ](?:fixture\|fixtures\|harness\|suite\|test)\|(?:harness\|suite).{0,50}review[- ]depth' docs/sprint/archive -g '*.md'` |
| H33 | 85d8012f 2026-08-15 sprint(68): T2 -- wire system-verify checker into qa-check.sh | `rg -n -i 'run-system-verify-fixtures\.sh\|system[- ]verify[- ](?:fixture\|fixtures\|harness\|suite\|test)\|(?:harness\|suite).{0,50}system[- ]verify' docs/sprint/archive -g '*.md'` |
| H34 | 62f67a16 2026-08-20 sprint(76) T3: §2's placement pair -- and the artefact question, finally asked properly | `rg -n -i 'run-s2-placement-fixtures\.sh\|s2[- ]placement[- ](?:fixture\|fixtures\|harness\|suite\|test)\|(?:harness\|suite).{0,50}s2[- ]placement' docs/sprint/archive -g '*.md'` |
| H35 | f79419d4 2026-08-10 sprint(59) T3: gate the rollup -- a recorded run without one FAILs | `rg -n -i 'run-night-run-rollup-fixtures\.sh\|night[- ]run[- ]rollup[- ](?:fixture\|fixtures\|harness\|suite\|test)\|(?:harness\|suite).{0,50}night[- ]run[- ]rollup' docs/sprint/archive -g '*.md'` |
| H36 | d2b4d3d5 2026-08-26 sprint(088): fix 2 HIGH + 2 MEDIUM from the independent Tier G review | `rg -n -i 'run-reap-terminal-fixtures\.sh\|reap[- ]terminal[- ](?:fixture\|fixtures\|harness\|suite\|test)\|(?:harness\|suite).{0,50}reap[- ]terminal' docs/sprint/archive -g '*.md'` |
| H37 | 48d68b9a 2026-08-20 sprint(75) T6+T3: the ownership-header family, and first contact with a stranger | `rg -n -i 'run-ownership-header-fixtures\.sh\|ownership[- ]header[- ](?:fixture\|fixtures\|harness\|suite\|test)\|(?:harness\|suite).{0,50}ownership[- ]header' docs/sprint/archive -g '*.md'` |
| H38 | cb4e8875 2026-08-24 sprint(082): T3 -- naming a check is not reaching the criterion it claims | `rg -n -i 'run-verify-reaches-fixtures\.sh\|verify[- ]reaches[- ](?:fixture\|fixtures\|harness\|suite\|test)\|(?:harness\|suite).{0,50}verify[- ]reaches' docs/sprint/archive -g '*.md'` |
| H39 | 70e856ec 2026-08-20 sprint(76) T2: the §4 ADR family -- five rules, and three ways a green report lied | `rg -n -i 'run-adr-family-fixtures\.sh\|adr[- ]family[- ](?:fixture\|fixtures\|harness\|suite\|test)\|(?:harness\|suite).{0,50}adr[- ]family' docs/sprint/archive -g '*.md'` |
| H40 | 7dda29bd 2026-08-29 sprint(093) T3: document the green-gate precondition, and implement a narrow named-exception grant | `rg -n -i 'run-night-run-gate-exception-fixtures\.sh\|night[- ]run[- ]gate[- ]exception[- ](?:fixture\|fixtures\|harness\|suite\|test)\|(?:harness\|suite).{0,50}night[- ]run[- ]gate[- ]exception' docs/sprint/archive -g '*.md'` |
| H41 | 36b92e75 2026-09-11 sprint(098): T3 -- typed run outcome with per-field provenance (CW 6) | `rg -n -i 'run-night-run-outcome-fixtures\.sh\|night[- ]run[- ]outcome[- ](?:fixture\|fixtures\|harness\|suite\|test)\|(?:harness\|suite).{0,50}night[- ]run[- ]outcome' docs/sprint/archive -g '*.md'` |
| H42 | 48d68b9a 2026-08-20 sprint(75) T6+T3: the ownership-header family, and first contact with a stranger | `rg -n -i 'run-foreign-repo-fixtures\.sh\|foreign[- ]repo[- ](?:fixture\|fixtures\|harness\|suite\|test)\|(?:harness\|suite).{0,50}foreign[- ]repo' docs/sprint/archive -g '*.md'` |
| H43 | f3b5ccea 2026-07-30 sprint(38) T2a: eval harness settled, TD-012 closed, violating run not inducible | `rg -n -i 'run-dispatch-preflight-fixtures\.sh\|dispatch[- ]preflight[- ](?:fixture\|fixtures\|harness\|suite\|test)\|(?:harness\|suite).{0,50}dispatch[- ]preflight' docs/sprint/archive -g '*.md'` |
| H44 | 31033520 2026-08-18 sprint(75) T2: the engine core -- registry, mark-driven dispatch, and the report | `rg -n -i 'run-conformance-engine-fixtures\.sh\|conformance[- ]engine[- ](?:fixture\|fixtures\|harness\|suite\|test)\|(?:harness\|suite).{0,50}conformance[- ]engine' docs/sprint/archive -g '*.md'` |
| H45 | 1cc66394 2026-09-24 feat(handoff,flow): read the work-item store (SPRINT-107 T3) | `rg -n -i 'run-store-readers-fixtures\.ts\|store[- ]readers[- ](?:fixture\|fixtures\|harness\|suite\|test)\|(?:harness\|suite).{0,50}store[- ]readers' docs/sprint/archive -g '*.md'` |
| H46 | a614a67f 2026-09-24 feat(triage,task-decomposer): read and write the work-item store (SPRINT-107 T2) | `rg -n -i 'run-store-writers-fixtures\.ts\|store[- ]writers[- ](?:fixture\|fixtures\|harness\|suite\|test)\|(?:harness\|suite).{0,50}store[- ]writers' docs/sprint/archive -g '*.md'` |
| H47 | b8968002 2026-09-29 sprint(110) T4: sprint-members-cli + qa-check legs 2g/3/5/7/8 onto the store, store-legs harness | `rg -n -i 'run-qa-store-legs-fixtures\.ts\|qa[- ]store[- ]legs[- ](?:fixture\|fixtures\|harness\|suite\|test)\|(?:harness\|suite).{0,50}qa[- ]store[- ]legs' docs/sprint/archive -g '*.md'` |
| H48 | aa2b35c4 2026-10-06 sprint(115) T5: promote-check.ts runs layers-completeness + 400-char rule on the new sprint file | `rg -n -i 'run-promote-check-fixtures\.ts\|promote[- ]check[- ](?:fixture\|fixtures\|harness\|suite\|test)\|(?:harness\|suite).{0,50}promote[- ]check' docs/sprint/archive -g '*.md'` |
| H49 | 3cf400a5 2026-10-10 sprint(121) T4: learnings body-metadata lint (count+promoted on active entries) + must-FAIL fixtures | `rg -n -i 'run-learnings-metadata-fixtures\.ts\|learnings[- ]metadata[- ](?:fixture\|fixtures\|harness\|suite\|test)\|(?:harness\|suite).{0,50}learnings[- ]metadata' docs/sprint/archive -g '*.md'` |
| H50 | 4255567f 2026-10-18 sprint(127) T4: tick-box tool runs the gate's checkers after a tick; harness, qa-check entry, dispatch rule 5 | `rg -n -i 'run-tick-box-fixtures\.ts\|tick[- ]box[- ](?:fixture\|fixtures\|harness\|suite\|test)\|(?:harness\|suite).{0,50}tick[- ]box' docs/sprint/archive -g '*.md'` |
| H51 | 8ad4169c 2026-10-24 sprint(138) T1: gate-remote -- one bun command runs the full gate on the off-host runner | `rg -n -i 'run-workflow-command-fixtures\.ts\|workflow[- ]command[- ](?:fixture\|fixtures\|harness\|suite\|test)\|(?:harness\|suite).{0,50}workflow[- ]command' docs/sprint/archive -g '*.md'` |
| H52 | 4d97cb53 2026-11-07 sprint(165) T2: name the conformance finding count above the verdict | `rg -n -i 'run-conformance-line-fixtures\.ts\|conformance[- ]line[- ](?:fixture\|fixtures\|harness\|suite\|test)\|(?:harness\|suite).{0,50}conformance[- ]line' docs/sprint/archive -g '*.md'` |
| H53 | 87ee6ba0 2026-09-24 sprint(106) T1: stand up the work-item store -- schema, status folders, ADR-045 | `rg -n -i 'run-work-store-fixtures\.ts\|work[- ]store[- ](?:fixture\|fixtures\|harness\|suite\|test)\|(?:harness\|suite).{0,50}work[- ]store' docs/sprint/archive -g '*.md'` |
| H54 | 71c093cd · SPRINT-043 shell runner; ca162ec · SPRINT-110 TS suite; 82057d08 · SPRINT-128 wrapper | `rg -n -i 'run-layers-observed-test-fixtures\.ts\|layers[- ]observed[- ](?:fixture\|fixtures\|harness\|suite\|test)\|(?:harness\|suite).{0,50}layers[- ]observed' docs/sprint/archive -g '*.md'` |
| H55 | 97eca0b1 2026-08-16 sprint(70) T2: cure the worktree base pin at its cause, and guard it | `rg -n -i 'run-worktree-base-fixtures\.sh\|worktree[- ]base[- ](?:fixture\|fixtures\|harness\|suite\|test)\|(?:harness\|suite).{0,50}worktree[- ]base' docs/sprint/archive -g '*.md'` |
| H56 | 7f00fcd7 2026-08-18 sprint(74) T2: the first spec-driven checker -- rules read from the spec, not the author | `rg -n -i 'run-attestation-fixtures\.sh\|attestation[- ](?:fixture\|fixtures\|harness\|suite\|test)\|(?:harness\|suite).{0,50}attestation' docs/sprint/archive -g '*.md'` |
| H57 | f53cb949 2026-08-23 sprint(079) T4: cover §9's sprint-file family | `rg -n -i 'run-sprint-family-fixtures\.sh\|sprint[- ]family[- ](?:fixture\|fixtures\|harness\|suite\|test)\|(?:harness\|suite).{0,50}sprint[- ]family' docs/sprint/archive -g '*.md'` |
| H58 | e8649928 2026-08-25 sprint(086): T3 -- the budget guard now fires before what it guards, in both lateness paths | `rg -n -i 'run-qa-budget-position-fixtures\.sh\|qa[- ]budget[- ]position[- ](?:fixture\|fixtures\|harness\|suite\|test)\|(?:harness\|suite).{0,50}qa[- ]budget[- ]position' docs/sprint/archive -g '*.md'` |
| H59 | b1ee2031 2026-09-20 perf(qa-gate): port check-doc-caps and check-authority to TypeScript (TASK-355) | `rg -n -i 'run-doc-caps-differential\.ts\|doc[- ]caps[- ]differential[- ](?:fixture\|fixtures\|harness\|suite\|test)\|(?:harness\|suite).{0,50}doc[- ]caps[- ]differential' docs/sprint/archive -g '*.md'` |
| H60 | ac69d291 2026-09-20 todo(TASK-355): port check-night-run-rollup.sh to TS, one-process fixture harness | `rg -n -i 'run-night-run-rollup-differential-parity\.ts\|night[- ]run[- ]rollup[- ]differential[- ]parity[- ](?:fixture\|fixtures\|harness\|suite\|test)\|(?:harness\|suite).{0,50}night[- ]run[- ]rollup[- ]differential[- ]parity' docs/sprint/archive -g '*.md'` |
| H61 | 3676a003 2026-09-24 feat(lean-doc-generator): promote/close by reference (SPRINT-107 T1) | `rg -n -i 'run-by-reference-fixtures\.ts\|by[- ]reference[- ](?:fixture\|fixtures\|harness\|suite\|test)\|(?:harness\|suite).{0,50}by[- ]reference' docs/sprint/archive -g '*.md'` |
| H62 | c60a9476 2026-09-25 feat(orchestrator): run a sprint from its member files by reference (SPRINT-107 T4) | `rg -n -i 'run-orchestrator-store-fixtures\.ts\|orchestrator[- ]store[- ](?:fixture\|fixtures\|harness\|suite\|test)\|(?:harness\|suite).{0,50}orchestrator[- ]store' docs/sprint/archive -g '*.md'` |

### Age audit after review

`bun --no-env-file census-input/retry.ts origins` re-ran the introduction query for all 57 original cut rows; all matched the saved origins. The lineage table above retains each command result.

All original cuts were checked, including no-check placeholders and harnesses now coupled to checks. The seven independent pre-045 zero-defect rows below take the owner ruling; H26 (042) and H54 (043) instead inherit their kept checks.

| Rows | First appearance | Effect |
|---|---|---|
| G0708 | SPRINT-008 | cut → keep (unknown, owner rules) |
| G0947 | SPRINT-024 | cut → keep (unknown, owner rules) |
| G1015 | SPRINT-035 | cut → keep (unknown, owner rules) |
| G1384 | SPRINT-041 | cut → keep (unknown, owner rules) |
| H13, H14, H43 | SPRINT-038 | keep → keep (unknown, owner rules); consumer guards stay yes |

Cross-check: `git show --format= --name-only af6d951b` names the SPRINT-035 Plan. `git log --diff-filter=A --format="%h %ad %s" --date=short -- scripts/lib/check-prose-density.sh scripts/lib/check-work-type.sh scripts/lib/check-dod-delta.sh` returns no older shell additions.

H59/H60 introductions have no sprint in their subjects: `git show --format=fuller --no-patch b1ee2031 ac69d291` dates both to 2026-09-20, after SPRINT-045. The remaining proposed cuts all first appear after SPRINT-045.

### Fixture mapping

`bun --no-env-file census-input/retry.ts fixture-map` matches each exact evals/*.sh or evals/*.ts path in every G fixture cell against each H checker cell; it inspects all 62 H rows. Matching results follow (27 H rows, 28 path matches; 26 H rows have a governing check).

| Harness | G fixture-cell match | Proposed ruling |
|---|---|---|
| H03 | G0234 | keep (fixture of G0234) |
| H04 | G1055 | keep (fixture of G1055) |
| H07 | G1474 | keep (fixture of G1474) |
| H08 | G0268 | cut (with G0268) |
| H09 | G0093 | cut (with G0093) |
| H10 | G0348 | keep (fixture of G0348) |
| H11 | G0372 | cut (with G0372) |
| H12 | G0396 | cut (with G0396) |
| H16 | G0209 | keep (fixture of G0209) |
| H17 | G0917 | keep (fixture of G0917) |
| H18 | G1597 | cut (with G1597) |
| H20 | G0324 | cut (with G0324) |
| H21 | G1640 | keep (fixture of G1640) |
| H23 | G0169 | keep (fixture of G0169) |
| H25 | G0733 | keep (fixture of G0733) |
| H26 | G1407 | keep (fixture of G1407) |
| H28 | G1511 | cut (with G1511) |
| H31 | G0297 | cut (with G0297) |
| H32 | G0636 | keep (fixture of G0636) |
| H35 | G0567 | keep (fixture of G0567) |
| H38 | G0672 | keep (fixture of G0672) |
| H44 | G0435 | keep (fixture of G0435) |
| H49 | G0733 | keep (fixture of G0733) |
| H52 | G1671 | keep (fixture of G1671) |
| H54 | G1544 | keep (fixture of G1544) |
| H58 | G0147, G1094 | keep (fixture of G0147, G1094) |
| H61 | G1447 | keep (fixture of G1447) |

H52 matches G1671, an aggregate summary with no check verdict. The summary line stays, so H52 is kept as the only test of it (coordinator ruling below). G1055 names H04 for population coverage only, as T2 records. H58 serves both kept checks G0147 and G1094.

| Harnesses without any G fixture-cell match | Basis |
|---|---|
| H01, H02, H05, H06, H13, H14, H15, H19, H22, H24, H27, H29 | Own history, age ruling and consumer flag |
| H30, H33, H34, H36, H37, H39, H40, H41, H42, H43, H45, H46 | Own history, age ruling and consumer flag |
| H47, H48, H50, H51, H53, H55, H56, H57, H59, H60, H62 | Own history, age ruling and consumer flag |

### Shared zero-search results

These 64 rows each have **0 attributed FAIL entries and 0 observed real defects** in the searches. This is an observation, not a complete-history claim: age-qualified unknowns remain unknown. Rulings follow the inventory, fixture mapping and judgments.

| Row ids | Shared search result |
|---|---|
| G0043, G0052, G0093, G0324, G0372, G0396, G0416, G0468, G0708, G0901, G0941, G0944 | 0 FAIL entries; 0 observed real defects |
| G0947, G0985, G1015, G1384, G1671, H01, H03, H07, H08, H09, H10, H11 | 0 FAIL entries; 0 observed real defects |
| H12, H13, H14, H15, H16, H17, H18, H19, H20, H22, H24, H26 | 0 FAIL entries; 0 observed real defects |
| H27, H28, H29, H30, H31, H32, H35, H36, H37, H38, H39, H40 | 0 FAIL entries; 0 observed real defects |
| H41, H45, H46, H47, H48, H49, H50, H51, H52, H54, H55, H56 | 0 FAIL entries; 0 observed real defects |
| H57, H59, H60, H61 | 0 FAIL entries; 0 observed real defects |

### Shared harness judgments

The former 33 identical cut paragraphs and 13 identical keep paragraphs are grouped below. Shared evidence: no unplanned harness FAIL; intended negatives, seeded breaks and review discoveries while green are excluded. Coupled rows use their check ruling; other rows use their own history and consumer flag.

| Row ids | Proposed ruling | Shared reason |
|---|---|---|
| H15, H19, H27, H36, H40, H41, H48, H50 | cut | No real defects, complete observed window, no consumer guard. |
| H51, H59, H60 | cut | No real defects, complete observed window, no consumer guard. |
| H03 | keep (fixture of G0234) | Fixture mapping above. |
| H07 | keep (fixture of G1474) | Fixture mapping above. |
| H08 | cut (with G0268) | Fixture mapping above. |
| H09 | cut (with G0093) | Fixture mapping above. |
| H10 | keep (fixture of G0348) | Fixture mapping above. |
| H11 | cut (with G0372) | Fixture mapping above. |
| H12 | cut (with G0396) | Fixture mapping above. |
| H13, H14 | keep (unknown, owner rules) | Pre-045 age ruling; consumer guard. |
| H16 | keep (fixture of G0209) | Fixture mapping above. |
| H17 | keep (fixture of G0917) | Fixture mapping above. |
| H18 | cut (with G1597) | Fixture mapping above. |
| H20 | cut (with G0324) | Fixture mapping above. |
| H24, H29, H30, H37, H39, H47, H55, H56, H57 | keep | Consumer guard. |
| H26 | keep (fixture of G1407) | Fixture mapping above. |
| H28 | cut (with G1511) | Fixture mapping above. |
| H31 | cut (with G0297) | Fixture mapping above. |
| H32 | keep (fixture of G0636) | Fixture mapping above. |
| H35 | keep (fixture of G0567) | Fixture mapping above. |
| H38 | keep (fixture of G0672) | Fixture mapping above. |
| H49 | keep (fixture of G0733) | Fixture mapping above. |
| H61 | keep (fixture of G1447) | Fixture mapping above. |

### Row judgments

### History G0043

Proposed cut. No unplanned failing entry attributable to this row. Seeded controls and aggregate summaries are excluded.

### History G0052

n/a (no check). profile instrumentation; population-only row with no verdict. Observed results are in the shared zero-search table.

### History G0093

Proposed cut. No unplanned failing entry attributable to this row. Seeded controls and aggregate summaries are excluded.

### History G0147

Proposed keep (unknown, owner rules). No checkpoint-specific failure is established; a generic historical budget report leaves attribution unknown.

History unknown: SPRINT-113:92 reports a budget failure without the branch label. Its attribution between checkpoint and harness-loop history is unknown; no zero is inferred.

- [SPRINT-113:92](#entry-sprint-113-92) — **unknown**: Generic budget FAIL cannot be assigned to checkpoint versus harness loop from this entry.

### History G0169

Proposed keep (unknown, owner rules). Cap overruns normally require reflow; the parser also misread a citation as a cap.

History unknown: The earlier cap records mix OVER-CAP observations with FAILs; the named SPRINT-056 entry does not establish which were failing verdicts. Totals remain unknown.

- [SPRINT-033:166](#entry-sprint-033-166) — **record**: 111 lines exceeded 110; text was shortened.
- [SPRINT-073:246](#entry-sprint-073-246) — **real**: ADR-026 in an uncapped cell became cap 026. This parser defect led to the leading-cell parser repair recorded at SPRINT-136 T2.
- [SPRINT-056:138](#entry-sprint-056-138) — **unknown**: Four live cap breaches are reported without distinguishing the soft observations from failing verdicts.
- [SPRINT-138:134](#entry-sprint-138-134) — **record**: Line/token budget cleared by tightening or wrapping prose, with no missing behavior established.
- [SPRINT-153:304](#entry-sprint-153-304) — **record**: Line/token budget cleared by tightening or wrapping prose, with no missing behavior established.
- [SPRINT-159:110](#entry-sprint-159-110) — **record**: Line/token budget cleared by tightening or wrapping prose, with no missing behavior established.
- [SPRINT-163:59](#entry-sprint-163-59) — **record**: Line/token budget cleared by tightening or wrapping prose, with no missing behavior established.
- [SPRINT-166:73](#entry-sprint-166-73) — **record**: Line/token budget cleared by tightening or wrapping prose, with no missing behavior established.

### History G0209

Proposed keep. A stale published count is a real defect, even though its repair edits prose.

- [SPRINT-031:65](#entry-sprint-031-65) — **real**: qa-check caught the stale ARCHITECTURE template-count claim missed by the wiring grep; claim and tree corrected.

### History G0234

Proposed keep (unknown, owner rules). Keep the two demonstrated checker repairs; the last close has no classified epic-state diagnostic.

History unknown: SPRINT-171 names the fix but not what epic-state found; real-defect classification cannot be recovered from that log entry.

- [SPRINT-080:346](#entry-sprint-080-346) — **real**: The archive check ignored member_sprints and demanded archive while a member was open; fixed to use both conditions.
- [SPRINT-094:147](#entry-sprint-094-147) — **record**: Seven findings repaired close_commit, attribution and update metadata; no wrong delivered behavior established.
- [SPRINT-097:187](#entry-sprint-097-187) — **real**: Foreign EPIC-016 member ids were resolved as local sprints. SPRINT-097:535 records the stream-aware repair.
- [SPRINT-132:188](#entry-sprint-132-188) — **record**: Member table in epic/logs was moved inline so the reader could find it.
- [SPRINT-152:300](#entry-sprint-152-300) — **record**: Ticked conditions gained their member-sprint citations.
- [SPRINT-171:227](#entry-sprint-171-227) — **unknown**: epic-state is said to be fixed at 8104875e without its diagnostic or corrected claim in this entry.

### History G0268

Proposed cut. All recorded artifact changes are line wrapping or wording. One run had a missing tool on PATH; no artifact defect was established.

Exclusions / deduplication: EPIC-016 repeats in SPRINT-110 through 118 are one unresolved finding (first 110:75, fixed 118:212). SPRINT-122/123 density failures are deliberate vehicle seeds.
SPRINT-170:552 replays the already-counted SPRINT-135 failure.

- [SPRINT-105:33](#entry-sprint-105-33) — **record**: Dense line(s) rewrapped or shortened; no change to the required behavior.
- [SPRINT-104:715](#entry-sprint-104-715) — **record**: Dense line(s) rewrapped or shortened; no change to the required behavior.
- [SPRINT-108:204](#entry-sprint-108-204) — **record**: Dense line(s) rewrapped or shortened; no change to the required behavior.
- [SPRINT-110:75](#entry-sprint-110-75) — **record**: Dense line(s) rewrapped or shortened; no change to the required behavior.
- [SPRINT-116:19](#entry-sprint-116-19) — **record**: Dense line(s) rewrapped or shortened; no change to the required behavior.
- [SPRINT-117:41](#entry-sprint-117-41) — **record**: Dense line(s) rewrapped or shortened; no change to the required behavior.
- [SPRINT-118:119](#entry-sprint-118-119) — **record**: Dense line(s) rewrapped or shortened; no change to the required behavior.
- [SPRINT-120:194](#entry-sprint-120-194) — **record**: Dense line(s) rewrapped or shortened; no change to the required behavior.
- [SPRINT-124:143](#entry-sprint-124-143) — **record**: Dense line(s) rewrapped or shortened; no change to the required behavior.
- [SPRINT-125:98](#entry-sprint-125-98) — **record**: Dense line(s) rewrapped or shortened; no change to the required behavior.
- [SPRINT-135:108](#entry-sprint-135-108) — **record**: Dense line(s) rewrapped or shortened; no change to the required behavior.
- [SPRINT-139:418](#entry-sprint-139-418) — **record**: Dense line(s) rewrapped or shortened; no change to the required behavior.
- [SPRINT-143:80](#entry-sprint-143-80) — **record**: Dense line(s) rewrapped or shortened; no change to the required behavior.
- [SPRINT-149:62](#entry-sprint-149-62) — **record**: Dense line(s) rewrapped or shortened; no change to the required behavior.
- [SPRINT-152:300](#entry-sprint-152-300) — **record**: Dense line(s) rewrapped or shortened; no change to the required behavior.
- [SPRINT-160:71](#entry-sprint-160-71) — **record**: Dense line(s) rewrapped or shortened; no change to the required behavior.
- [SPRINT-160:131](#entry-sprint-160-131) — **record**: Dense line(s) rewrapped or shortened; no change to the required behavior.
- [SPRINT-163:59](#entry-sprint-163-59) — **record**: Dense line(s) rewrapped or shortened; no change to the required behavior.
- [SPRINT-166:64](#entry-sprint-166-64) — **record**: Dense line(s) rewrapped or shortened; no change to the required behavior.
- [SPRINT-168:83](#entry-sprint-168-83) — **record**: Dense line(s) rewrapped or shortened; no change to the required behavior.
- [SPRINT-171:113](#entry-sprint-171-113) — **record**: Dense line(s) rewrapped or shortened; no change to the required behavior.
- [SPRINT-138:197](#entry-sprint-138-197) — **environment**: Missing Git tools on PATH produced misleading baseline failures; the same checks passed with PATH corrected.

### History G0297

Proposed cut. The only live failure required placing the bookkeeping fields where the reader expects them.

- [SPRINT-114:355](#entry-sprint-114-355) — **record**: Handoff status fields moved directly under the handoff heading; no unfinished action was discovered.

### History G0324

Proposed cut. No unplanned failing entry. Review-discovered false negatives in SPRINT-087/099 passed this check and therefore are not catches.

### History G0348

Proposed keep. Worktree fixtures were reported as live intake files. The repeated unresolved scanner defect is one episode.

Exclusions / deduplication: SPRINT-069:78/197 and SPRINT-086:340 repeat the same unresolved TD-053 worktree exclusion finding; no additional defect episode.

- [SPRINT-063:205](#entry-sprint-063-205) — **real**: Nested worktree fixtures were falsely rejected; SPRINT-087:138/208 records the scanner exclusion fix.

### History G0372

Proposed cut. No unplanned failing entry. New origin cases and deliberately restored legacy readers are negative controls.

### History G0396

Proposed cut. No unplanned failing entry since the SPRINT-159 introduction; invalid work kinds and missing reproduction cases are seeded controls.

### History G0416

n/a (no check). 2f-bis (fold-in record); population-only row with no verdict. Observed results are in the shared zero-search table.

### History G0435

Proposed keep (unknown, owner rules). Consumer guard. Real checker defects are retained; bulk engine tallies cannot supply an exact per-entry defect count.

History unknown: Bulk engine baselines carry unresolved findings across sprints without a one-to-one disposition. Do not turn those totals into independent real defects.

- [SPRINT-076:180](#entry-sprint-076-180) — **real**: Conformant root CHANGELOG was rejected as misplaced spec/CHANGELOG; matcher now excludes every canonical/legacy spec path.
- [SPRINT-080:83](#entry-sprint-080-83) — **real**: New ledger rules misread real input; the entry records checker corrections rather than fabricated record repairs.
- [SPRINT-087:705](#entry-sprint-087-705) — **real**: Plan-freeze/scope-change treated checkbox ticks as scope edits; fixed by normalization in SPRINT-100 T2.
- [SPRINT-100:99](#entry-sprint-100-99) — **real**: Engine walked into agent worktrees and reported findings untrue of the host repository; code repair deferred, worktrees removed before close.
- [SPRINT-109:96](#entry-sprint-109-96) — **unknown**: Engine baseline is 73 FAIL before and after; this entry does not identify and resolve every underlying finding.

### History G0468

n/a (no check). TD-084 profiling comment; population-only row with no verdict. Observed results are in the shared zero-search table.

### History G0567

Proposed keep. A real rollup omission led to a reaper repair; several other failures only concerned record placement or invocation.

- [SPRINT-064:85](#entry-sprint-064-85) — **record**: Task-level complete heading was read as a run rollup; heading changed.
- [SPRINT-082:288](#entry-sprint-082-288) — **record**: Rollup heading changed to the required Part 4 form.
- [SPRINT-101:45](#entry-sprint-101-45) — **record**: A directory was supplied to a checker that requires a sprint file; Verify invocation corrected.
- [SPRINT-101:114](#entry-sprint-101-114) — **record**: Missing initial Execution Log produced a read failure; record created.
- [SPRINT-105:75](#entry-sprint-105-75) — **record**: Missing sprint logs produced read failures; log creation was the remedy.
- [SPRINT-121:19](#entry-sprint-121-19) — **record**: First gate ran before a log existed; the promote entry supplies the record.
- [SPRINT-122:159](#entry-sprint-122-159) — **real**: Reaper AUTHORITY_BOUNDARY block omitted its parked task line; the producer was fixed to copy non-green task lines.

### History G0636

Proposed keep. Ten identified failures led to owed reviews. SPRINT-171 is one failing Log entry, not seven diagnostics or three reviews.

Exclusions / deduplication: SPRINT-151:217 repeats T8's surviving early self-review finding after the owed review; SPRINT-118:273, 153:320 and 169:60 repeat unresolved findings.
SPRINT-148:121 was a manual discovery, not a failing checker. SPRINT-170 replay gates are not new historical episodes.

- [SPRINT-089:236](#entry-sprint-089-236) — **real**: Required independent review was absent or incomplete; the recorded response ran the owed review.
- [SPRINT-091:294](#entry-sprint-091-294) — **real**: Required independent review was absent or incomplete; the recorded response ran the owed review.
- [SPRINT-103:775](#entry-sprint-103-775) — **real**: Required independent review was absent or incomplete; the recorded response ran the owed review.
- [SPRINT-114:320](#entry-sprint-114-320) — **real**: Required independent review was absent or incomplete; the recorded response ran the owed review.
- [SPRINT-118:165](#entry-sprint-118-165) — **real**: Required independent review was absent or incomplete; the recorded response ran the owed review.
- [SPRINT-121:156](#entry-sprint-121-156) — **real**: Required independent review was absent or incomplete; the recorded response ran the owed review.
- [SPRINT-134:74](#entry-sprint-134-74) — **real**: Required independent review was absent or incomplete; the recorded response ran the owed review.
- [SPRINT-151:157](#entry-sprint-151-157) — **real**: Required independent review was absent or incomplete; the recorded response ran the owed review.
- [SPRINT-156:179](#entry-sprint-156-179) — **real**: Required independent review was absent or incomplete; the recorded response ran the owed review.
- [SPRINT-171:220](#entry-sprint-171-220) — **real**: T1/T3 had no recorded completed review; T5 had never had the owed independent review. SPRINT-171:227 found and repaired the dropped both-runs screen-out rule.
- [SPRINT-086:191](#entry-sprint-086-191) — **record**: Premature/in-flight review record, missing structured line for a completed review, or strict vocabulary/format repair; no newly omitted completed-work review identified.
- [SPRINT-087:110](#entry-sprint-087-110) — **record**: Premature/in-flight review record, missing structured line for a completed review, or strict vocabulary/format repair; no newly omitted completed-work review identified.
- [SPRINT-090:103](#entry-sprint-090-103) — **record**: Premature/in-flight review record, missing structured line for a completed review, or strict vocabulary/format repair; no newly omitted completed-work review identified.
- [SPRINT-099:204](#entry-sprint-099-204) — **record**: Premature/in-flight review record, missing structured line for a completed review, or strict vocabulary/format repair; no newly omitted completed-work review identified.
- [SPRINT-100:633](#entry-sprint-100-633) — **record**: Premature/in-flight review record, missing structured line for a completed review, or strict vocabulary/format repair; no newly omitted completed-work review identified.
- [SPRINT-101:123](#entry-sprint-101-123) — **record**: Premature/in-flight review record, missing structured line for a completed review, or strict vocabulary/format repair; no newly omitted completed-work review identified.
- [SPRINT-104:715](#entry-sprint-104-715) — **record**: Premature/in-flight review record, missing structured line for a completed review, or strict vocabulary/format repair; no newly omitted completed-work review identified.
- [SPRINT-116:147](#entry-sprint-116-147) — **record**: Premature/in-flight review record, missing structured line for a completed review, or strict vocabulary/format repair; no newly omitted completed-work review identified.
- [SPRINT-118:212](#entry-sprint-118-212) — **record**: Premature/in-flight review record, missing structured line for a completed review, or strict vocabulary/format repair; no newly omitted completed-work review identified.
- [SPRINT-129:89](#entry-sprint-129-89) — **record**: Premature/in-flight review record, missing structured line for a completed review, or strict vocabulary/format repair; no newly omitted completed-work review identified.
- [SPRINT-146:89](#entry-sprint-146-89) — **record**: Premature/in-flight review record, missing structured line for a completed review, or strict vocabulary/format repair; no newly omitted completed-work review identified.
- [SPRINT-147:132](#entry-sprint-147-132) — **record**: Premature/in-flight review record, missing structured line for a completed review, or strict vocabulary/format repair; no newly omitted completed-work review identified.
- [SPRINT-153:304](#entry-sprint-153-304) — **record**: Premature/in-flight review record, missing structured line for a completed review, or strict vocabulary/format repair; no newly omitted completed-work review identified.
- [SPRINT-163:93](#entry-sprint-163-93) — **record**: Premature/in-flight review record, missing structured line for a completed review, or strict vocabulary/format repair; no newly omitted completed-work review identified.
- [SPRINT-166:64](#entry-sprint-166-64) — **record**: Premature/in-flight review record, missing structured line for a completed review, or strict vocabulary/format repair; no newly omitted completed-work review identified.
- [SPRINT-169:57](#entry-sprint-169-57) — **record**: Premature/in-flight review record, missing structured line for a completed review, or strict vocabulary/format repair; no newly omitted completed-work review identified.
- [SPRINT-170:619](#entry-sprint-170-619) — **record**: Premature/in-flight review record, missing structured line for a completed review, or strict vocabulary/format repair; no newly omitted completed-work review identified.
- [SPRINT-167:44](#entry-sprint-167-44) — **record**: First QA_FULL rejected both consequence lines for vocabulary; records rewritten in place.

### History G0672

Proposed keep (unknown, owner rules). Bare-basename resolution was repaired. The other known pairing failure was still unresolved in its cited entry.

History unknown: TD-087 pairing FAIL is ruled, not repaired in the available disposition; do not classify it as a zero-defect formatting repair.

Exclusions / deduplication: SPRINT-095:107 repeats TD-087; SPRINT-087:705 repeats the bare-basename finding. Seeded false-REACHES and review discoveries are not extra FAIL episodes.

- [SPRINT-082:148](#entry-sprint-082-148) — **record**: Verification clause corrected to name a method that reaches its target.
- [SPRINT-084:230](#entry-sprint-084-230) — **unknown**: Two genuine methods were incorrectly paired as target/method; owner ruled the FAIL and left TD-087 unresolved.
- [SPRINT-087:58](#entry-sprint-087-58) — **real**: Existing read-spec-rules.sh was falsely absent because only CWD was searched; resolver fixed at SPRINT-100:198.

### History G0708

Proposed keep (unknown, owner rules). No attributed live FAIL. Embedded logs cover the pre-045 era; SPRINT-008:100 records the original 42/0. Later engine ownership findings belong to G0435.


History unknown by owner age ruling: first appearance SPRINT-008, zero observed real defects. Embedded log evidence above is retained for the owner and does not override the ruling.

### History G0733

Proposed keep (unknown, owner rules). Index regeneration and vocabulary corrections dominate; the final related-list repair does not identify what kind of broken reference it fixed.

History unknown: The SPRINT-171 related-list repair has no target-level disposition; full real-defect and FAIL totals remain unknown.

Exclusions / deduplication: SPRINT-089:149 and 090:207/296 repeat the unresolved midnight staleness defect. Actual NUL corruption in SPRINT-083:598 belongs to G0959.

- [SPRINT-074:98](#entry-sprint-074-98) — **real**: Date-only index staleness blocked a content-identical tree. The log proves a checker defect; regeneration is a workaround, with the code repair deferred.
- [SPRINT-059:111](#entry-sprint-059-111) — **record**: Index/metadata record regeneration or vocabulary correction; no missing real target established in this entry.
- [SPRINT-068:88](#entry-sprint-068-88) — **record**: Index/metadata record regeneration or vocabulary correction; no missing real target established in this entry.
- [SPRINT-075:285](#entry-sprint-075-285) — **record**: Index/metadata record regeneration or vocabulary correction; no missing real target established in this entry.
- [SPRINT-076:464](#entry-sprint-076-464) — **record**: Index/metadata record regeneration or vocabulary correction; no missing real target established in this entry.
- [SPRINT-083:598](#entry-sprint-083-598) — **record**: Index/metadata record regeneration or vocabulary correction; no missing real target established in this entry.
- [SPRINT-103:775](#entry-sprint-103-775) — **record**: Index/metadata record regeneration or vocabulary correction; no missing real target established in this entry.
- [SPRINT-105:75](#entry-sprint-105-75) — **record**: Index/metadata record regeneration or vocabulary correction; no missing real target established in this entry.
- [SPRINT-109:178](#entry-sprint-109-178) — **record**: Index/metadata record regeneration or vocabulary correction; no missing real target established in this entry.
- [SPRINT-116:147](#entry-sprint-116-147) — **record**: Index/metadata record regeneration or vocabulary correction; no missing real target established in this entry.
- [SPRINT-121:156](#entry-sprint-121-156) — **record**: Index/metadata record regeneration or vocabulary correction; no missing real target established in this entry.
- [SPRINT-154:189](#entry-sprint-154-189) — **record**: Index/metadata record regeneration or vocabulary correction; no missing real target established in this entry.
- [SPRINT-159:110](#entry-sprint-159-110) — **record**: Index/metadata record regeneration or vocabulary correction; no missing real target established in this entry.
- [SPRINT-160:71](#entry-sprint-160-71) — **record**: Index/metadata record regeneration or vocabulary correction; no missing real target established in this entry.
- [SPRINT-171:227](#entry-sprint-171-227) — **unknown**: Research related lists fixed at 99644033/870e68cc, but the log does not identify the targets or distinguish a broken target from metadata bookkeeping.
- [SPRINT-073:291](#entry-sprint-073-291) — **record**: Generated index or corpus related metadata corrected; no missing real target established.
- [SPRINT-081:111](#entry-sprint-081-111) — **record**: Generated index or corpus related metadata corrected; no missing real target established.
- [SPRINT-153:304](#entry-sprint-153-304) — **record**: Generated index or corpus related metadata corrected; no missing real target established.

### History G0901

n/a (no check). 5 retired; population-only row with no verdict. Observed results are in the shared zero-search table.

### History G0905

Proposed keep. Consumer guard; a footer version inconsistent with the shipped manifests is a wrong public claim.

- [SPRINT-079:442](#entry-sprint-079-442) — **real**: Version bump missed the README footer; published version corrected.
- [SPRINT-083:598](#entry-sprint-083-598) — **real**: Version bump missed the README footer; published version corrected.

### History G0917

Proposed keep (unknown, owner rules). Consumer guard. The prerelease parser failure has no code repair in the log.

History unknown: The prerelease false positive is bypassed by a stable release, not shown fixed.

Exclusions / deduplication: SPRINT-056:249 missed every dot-directory manifest and would exit 0; it is a false negative, not a FAIL catch. The earlier five-release drift was found by hand.

- [SPRINT-114:102](#entry-sprint-114-102) — **unknown**: All five versions agreed at 2.0.0-rc.1, but the parser rejected prerelease syntax. Final 2.0.0 parses; parser repair is not established.

### History G0941

n/a (no check). 7 retired; population-only row with no verdict. Observed results are in the shared zero-search table.

### History G0944

n/a (no check). 8 retired; population-only row with no verdict. Observed results are in the shared zero-search table.

### History G0947

Proposed keep (unknown, owner rules). No attributed FAIL for QA.md cap-snapshot hygiene. Embedded SPRINT-024 onward logs cover its earlier era.


History unknown by owner age ruling: first appearance SPRINT-024, zero observed real defects. Embedded log evidence above is retained for the owner and does not override the ruling.

### History G0959

Proposed keep. A corrupted file, not a missing record, broke real citations.

- [SPRINT-083:598](#entry-sprint-083-598) — **real**: A NUL byte made LEARNINGS look binary, leaving 51 references unresolved; byte removed.

### History G0985

Proposed cut. No unplanned failing entry attributable to this row. Seeded controls and aggregate summaries are excluded.

### History G1015

Proposed keep (unknown, owner rules). No attributed schema FAIL. The SPRINT-091 T1b naming trap was found by reading before writing; it was not a checker catch. Embedded logs cover introduction.


History unknown by owner age ruling: first appearance SPRINT-035, zero observed real defects. Embedded log evidence above is retained for the owner and does not override the ruling.

### History G1055

Proposed keep. One entry counts once even if it contains many compiler diagnostics or also trips the population harness.

- [SPRINT-091:175](#entry-sprint-091-175) — **real**: Compiler rejected real code or an incorrect compilation population; source types, imports, or the population were repaired.
- [SPRINT-104:41](#entry-sprint-104-41) — **real**: Compiler rejected real code or an incorrect compilation population; source types, imports, or the population were repaired.
- [SPRINT-109:178](#entry-sprint-109-178) — **real**: Compiler rejected real code or an incorrect compilation population; source types, imports, or the population were repaired.
- [SPRINT-112:90](#entry-sprint-112-90) — **real**: Compiler rejected real code or an incorrect compilation population; source types, imports, or the population were repaired.
- [SPRINT-114:150](#entry-sprint-114-150) — **real**: Compiler rejected real code or an incorrect compilation population; source types, imports, or the population were repaired.
- [SPRINT-137:113](#entry-sprint-137-113) — **real**: Compiler rejected real code or an incorrect compilation population; source types, imports, or the population were repaired.
- [SPRINT-148:63](#entry-sprint-148-63) — **real**: Compiler rejected real code or an incorrect compilation population; source types, imports, or the population were repaired.
- [SPRINT-148:95](#entry-sprint-148-95) — **real**: Compiler rejected real code or an incorrect compilation population; source types, imports, or the population were repaired.
- [SPRINT-151:105](#entry-sprint-151-105) — **real**: Compiler rejected real code or an incorrect compilation population; source types, imports, or the population were repaired.
- [SPRINT-154:189](#entry-sprint-154-189) — **real**: Compiler rejected real code or an incorrect compilation population; source types, imports, or the population were repaired.
- [SPRINT-165:70](#entry-sprint-165-70) — **real**: Compiler rejected real code or an incorrect compilation population; source types, imports, or the population were repaired.
- [SPRINT-171:101](#entry-sprint-171-101) — **real**: Compiler rejected real code or an incorrect compilation population; source types, imports, or the population were repaired.
- [SPRINT-113:76](#entry-sprint-113-76) — **environment**: Compiler/dependencies were unavailable on that host/worktree; no checked-source defect was established.
- [SPRINT-114:367](#entry-sprint-114-367) — **environment**: Compiler/dependencies were unavailable on that host/worktree; no checked-source defect was established.
- [SPRINT-118:155](#entry-sprint-118-155) — **environment**: Compiler/dependencies were unavailable on that host/worktree; no checked-source defect was established.
- [SPRINT-121:19](#entry-sprint-121-19) — **environment**: Compiler/dependencies were unavailable on that host/worktree; no checked-source defect was established.

### History G1094

Proposed keep (unknown, owner rules). Registration caught genuinely unwired suites. Budget summaries do not always identify which budget branch fired.

History unknown: Historical generic budget FAIL reports cannot be assigned reliably between G0147, this loop, and the final runtime check.

- [SPRINT-079:442](#entry-sprint-079-442) — **real**: Sprint-family harness shipped without registration; added to the opt-in list.
- [SPRINT-111:172](#entry-sprint-111-172) — **real**: Four retained self-tests were neither registered nor excluded; registration accounting repaired.
- [SPRINT-086:340](#entry-sprint-086-340) — **environment**: Real 461-second run exceeded the 450-second budget and named skipped harnesses; host/runtime observation.
- [SPRINT-113:92](#entry-sprint-113-92) — **unknown**: Close reports the budget among five failures without identifying checkpoint versus leg-12 verdict.

### History G1384

Proposed keep (unknown, owner rules). No attributed headless-park cue FAIL. The embedded SPRINT-041 through 044 logs cover the earlier era.


History unknown by owner age ruling: first appearance SPRINT-041, zero observed real defects. Embedded log evidence above is retained for the owner and does not override the ruling.

### History G1407

Proposed keep (unknown, owner rules). Actual undeclared implementation files and parser defects both occur; a bare-name divergence was only worked around.

History unknown: SPRINT-089:66 names the completeness checker for an observed-attribution diagnostic. SPRINT-113:69 carries an unresolved shell/TS divergence. These prevent an exact
classified total from the Log alone.

Exclusions / deduplication: Preflight shared-file-unowned findings are not this checker. SPRINT-105:75 repeats SPRINT-104 findings; 167:44 repeats 167:41. Replay gates in SPRINT-170 are
excluded; its actual close-time 170:619 is counted.

- [SPRINT-049:122](#entry-sprint-049-122) — **real**: Live Plan was blocked by references and continuation parsing; both parsers changed and a Cites escape was implemented.
- [SPRINT-075:99](#entry-sprint-075-99) — **real**: qa-check.sh was actually touched to register the spec-reader harness but absent from T1 Layers; declaration corrected.
- [SPRINT-115:96](#entry-sprint-115-96) — **real**: T5 actually built files while Layers still named only a procedure; the declaration was corrected to the built set.
- [SPRINT-113:69](#entry-sprint-113-69) — **unknown**: TS and shell disagreed on the declared migration-map.md basename. Cites workaround applied; parser divergence left as TD-215.
- [SPRINT-042:224](#entry-sprint-042-224) — **real**: The new checker reported its own newly created checker file absent from T3 Layers; declaration corrected.
- [SPRINT-048:234](#entry-sprint-048-234) — **record**: Declaration/citation token, wrapped line, tick-evidence wording or dependency bookkeeping corrected; no additional actual undeclared implementation file established.
- [SPRINT-056:23](#entry-sprint-056-23) — **record**: Declaration/citation token, wrapped line, tick-evidence wording or dependency bookkeeping corrected; no additional actual undeclared implementation file established.
- [SPRINT-069:279](#entry-sprint-069-279) — **record**: Declaration/citation token, wrapped line, tick-evidence wording or dependency bookkeeping corrected; no additional actual undeclared implementation file established.
- [SPRINT-074:24](#entry-sprint-074-24) — **record**: Declaration/citation token, wrapped line, tick-evidence wording or dependency bookkeeping corrected; no additional actual undeclared implementation file established.
- [SPRINT-081:158](#entry-sprint-081-158) — **record**: Declaration/citation token, wrapped line, tick-evidence wording or dependency bookkeeping corrected; no additional actual undeclared implementation file established.
- [SPRINT-081:302](#entry-sprint-081-302) — **record**: Declaration/citation token, wrapped line, tick-evidence wording or dependency bookkeeping corrected; no additional actual undeclared implementation file established.
- [SPRINT-084:230](#entry-sprint-084-230) — **record**: Declaration/citation token, wrapped line, tick-evidence wording or dependency bookkeeping corrected; no additional actual undeclared implementation file established.
- [SPRINT-088:19](#entry-sprint-088-19) — **record**: Declaration/citation token, wrapped line, tick-evidence wording or dependency bookkeeping corrected; no additional actual undeclared implementation file established.
- [SPRINT-090:103](#entry-sprint-090-103) — **record**: Declaration/citation token, wrapped line, tick-evidence wording or dependency bookkeeping corrected; no additional actual undeclared implementation file established.
- [SPRINT-092:61](#entry-sprint-092-61) — **record**: Declaration/citation token, wrapped line, tick-evidence wording or dependency bookkeeping corrected; no additional actual undeclared implementation file established.
- [SPRINT-092:283](#entry-sprint-092-283) — **record**: Declaration/citation token, wrapped line, tick-evidence wording or dependency bookkeeping corrected; no additional actual undeclared implementation file established.
- [SPRINT-096:155](#entry-sprint-096-155) — **record**: Declaration/citation token, wrapped line, tick-evidence wording or dependency bookkeeping corrected; no additional actual undeclared implementation file established.
- [SPRINT-103:775](#entry-sprint-103-775) — **record**: Declaration/citation token, wrapped line, tick-evidence wording or dependency bookkeeping corrected; no additional actual undeclared implementation file established.
- [SPRINT-104:715](#entry-sprint-104-715) — **record**: Declaration/citation token, wrapped line, tick-evidence wording or dependency bookkeeping corrected; no additional actual undeclared implementation file established.
- [SPRINT-107:193](#entry-sprint-107-193) — **record**: Declaration/citation token, wrapped line, tick-evidence wording or dependency bookkeeping corrected; no additional actual undeclared implementation file established.
- [SPRINT-108:15](#entry-sprint-108-15) — **record**: Declaration/citation token, wrapped line, tick-evidence wording or dependency bookkeeping corrected; no additional actual undeclared implementation file established.
- [SPRINT-109:188](#entry-sprint-109-188) — **record**: Declaration/citation token, wrapped line, tick-evidence wording or dependency bookkeeping corrected; no additional actual undeclared implementation file established.
- [SPRINT-111:31](#entry-sprint-111-31) — **record**: Declaration/citation token, wrapped line, tick-evidence wording or dependency bookkeeping corrected; no additional actual undeclared implementation file established.
- [SPRINT-113:92](#entry-sprint-113-92) — **record**: Declaration/citation token, wrapped line, tick-evidence wording or dependency bookkeeping corrected; no additional actual undeclared implementation file established.
- [SPRINT-115:19](#entry-sprint-115-19) — **record**: Declaration/citation token, wrapped line, tick-evidence wording or dependency bookkeeping corrected; no additional actual undeclared implementation file established.
- [SPRINT-118:119](#entry-sprint-118-119) — **record**: Declaration/citation token, wrapped line, tick-evidence wording or dependency bookkeeping corrected; no additional actual undeclared implementation file established.
- [SPRINT-118:212](#entry-sprint-118-212) — **record**: Declaration/citation token, wrapped line, tick-evidence wording or dependency bookkeeping corrected; no additional actual undeclared implementation file established.
- [SPRINT-125:228](#entry-sprint-125-228) — **record**: Declaration/citation token, wrapped line, tick-evidence wording or dependency bookkeeping corrected; no additional actual undeclared implementation file established.
- [SPRINT-137:57](#entry-sprint-137-57) — **record**: Declaration/citation token, wrapped line, tick-evidence wording or dependency bookkeeping corrected; no additional actual undeclared implementation file established.
- [SPRINT-147:132](#entry-sprint-147-132) — **record**: Declaration/citation token, wrapped line, tick-evidence wording or dependency bookkeeping corrected; no additional actual undeclared implementation file established.
- [SPRINT-155:100](#entry-sprint-155-100) — **record**: Declaration/citation token, wrapped line, tick-evidence wording or dependency bookkeeping corrected; no additional actual undeclared implementation file established.
- [SPRINT-155:150](#entry-sprint-155-150) — **record**: Declaration/citation token, wrapped line, tick-evidence wording or dependency bookkeeping corrected; no additional actual undeclared implementation file established.
- [SPRINT-160:131](#entry-sprint-160-131) — **record**: Declaration/citation token, wrapped line, tick-evidence wording or dependency bookkeeping corrected; no additional actual undeclared implementation file established.
- [SPRINT-167:41](#entry-sprint-167-41) — **record**: Declaration/citation token, wrapped line, tick-evidence wording or dependency bookkeeping corrected; no additional actual undeclared implementation file established.
- [SPRINT-170:619](#entry-sprint-170-619) — **record**: Declaration/citation token, wrapped line, tick-evidence wording or dependency bookkeeping corrected; no additional actual undeclared implementation file established.
- [SPRINT-171:63](#entry-sprint-171-63) — **record**: Declaration/citation token, wrapped line, tick-evidence wording or dependency bookkeeping corrected; no additional actual undeclared implementation file established.
- [SPRINT-138:197](#entry-sprint-138-197) — **environment**: Bun crashed while Git shell tools were absent from PATH; same legs passed with PATH corrected.
- [SPRINT-089:66](#entry-sprint-089-66) — **unknown**: Entry calls a commit-attributable-to-no-task finding layers-completeness, but that diagnostic belongs to layers-observed. Row attribution is inconsistent.

### History G1447

Proposed keep. Consumer guard. Citation-only false positives are not evidence that a file was actually touched.

Exclusions / deduplication: SPRINT-165:70 repeats the 165:67 path finding; 168:93 supplies the 168:83 correction. SPRINT-153:315 instead names a different missing path, so it is a separate
failing entry.

- [SPRINT-120:194](#entry-sprint-120-194) — **record**: Scope-change prose named read-only paths, fragments or paths in the wrong token form; Cites/record attribution corrected.
- [SPRINT-122:150](#entry-sprint-122-150) — **record**: Scope-change prose named read-only paths, fragments or paths in the wrong token form; Cites/record attribution corrected.
- [SPRINT-125:228](#entry-sprint-125-228) — **record**: Scope-change prose named read-only paths, fragments or paths in the wrong token form; Cites/record attribution corrected.
- [SPRINT-127:196](#entry-sprint-127-196) — **record**: Scope-change prose named read-only paths, fragments or paths in the wrong token form; Cites/record attribution corrected.
- [SPRINT-133:64](#entry-sprint-133-64) — **record**: Scope-change prose named read-only paths, fragments or paths in the wrong token form; Cites/record attribution corrected.
- [SPRINT-137:105](#entry-sprint-137-105) — **record**: Scope-change prose named read-only paths, fragments or paths in the wrong token form; Cites/record attribution corrected.
- [SPRINT-141:122](#entry-sprint-141-122) — **record**: Scope-change prose named read-only paths, fragments or paths in the wrong token form; Cites/record attribution corrected.
- [SPRINT-147:132](#entry-sprint-147-132) — **record**: Scope-change prose named read-only paths, fragments or paths in the wrong token form; Cites/record attribution corrected.
- [SPRINT-153:304](#entry-sprint-153-304) — **record**: Scope-change prose named read-only paths, fragments or paths in the wrong token form; Cites/record attribution corrected.
- [SPRINT-155:100](#entry-sprint-155-100) — **record**: Scope-change prose named read-only paths, fragments or paths in the wrong token form; Cites/record attribution corrected.
- [SPRINT-165:67](#entry-sprint-165-67) — **record**: Scope-change prose named read-only paths, fragments or paths in the wrong token form; Cites/record attribution corrected.
- [SPRINT-168:83](#entry-sprint-168-83) — **record**: Scope-change prose named read-only paths, fragments or paths in the wrong token form; Cites/record attribution corrected.
- [SPRINT-170:619](#entry-sprint-170-619) — **record**: Scope-change prose named read-only paths, fragments or paths in the wrong token form; Cites/record attribution corrected.
- [SPRINT-171:216](#entry-sprint-171-216) — **record**: Scope-change prose named read-only paths, fragments or paths in the wrong token form; Cites/record attribution corrected.
- [SPRINT-171:233](#entry-sprint-171-233) — **record**: Scope-change prose named read-only paths, fragments or paths in the wrong token form; Cites/record attribution corrected.
- [SPRINT-163:93](#entry-sprint-163-93) — **record**: Scope-change prose named read-only paths, fragments or paths in the wrong token form; Cites/record attribution corrected.
- [SPRINT-154:189](#entry-sprint-154-189) — **real**: T1 actually changed setup-arm.ts, which its scope-change named but its Plan Layers omitted; declaration corrected.
- [SPRINT-153:315](#entry-sprint-153-315) — **record**: Rerun found a different omitted citation, conformance-engine.sh, in the T6 review note; Cites extended.
- [SPRINT-155:150](#entry-sprint-155-150) — **real**: Baseline reader followed a different sprint log and falsely reported LOG-REWRITTEN over an append; TD-285 records the checker defect, later fixed by SPRINT-159 T3.

### History G1474

Proposed keep. An attended-run false positive required a mode-aware checker repair.

- [SPRINT-090:66](#entry-sprint-090-66) — **record**: A consequence line wrongly claimed T2 execution; record removed.
- [SPRINT-093:163](#entry-sprint-093-163) — **real**: Authority guard demanded a J2 park in attended work; mode-aware guard repair recorded at SPRINT-093:255.
- [SPRINT-121:156](#entry-sprint-121-156) — **record**: Plan/member J classes were inconsistent with the owner ruling; metadata aligned.
- [SPRINT-125:228](#entry-sprint-125-228) — **record**: Plan/member J classes were inconsistent with the owner ruling; metadata aligned.

### History G1511

Proposed cut. Only an invocation-record correction is reported.

- [SPRINT-101:45](#entry-sprint-101-45) — **record**: Verify supplied a directory where the envelope checker requires a sprint file; invocation record corrected.

### History G1544

Proposed keep (unknown, owner rules). Actual undeclared files are real even when only the declaration needs repair. Subject-only attribution repairs are bookkeeping.

History unknown: Foreign-stream and uncommitted-work findings at 087:748, 106:176 and 110:93 have no final per-path disposition here. Repeated unattributed-governance aggregates also prevent
exact episode deduplication; known classified entries are lower bounds.

Exclusions / deduplication: SPRINT-091:294 initially described sixteen missing declarations; 091:522 corrects that diagnosis to missing backticks, so count the corrected episode once as
record. 104:661 repeats 104:640; foreign EPIC-016 repeats through 114; 171:237 repeats 171:227. Trial/replay attribution failures are excluded.

- [SPRINT-055:75](#entry-sprint-055-75) — **real**: A real touched implementation/research file was absent from its task declaration; the cited entry identifies the file and corrected Layers.
- [SPRINT-079:442](#entry-sprint-079-442) — **real**: A real touched implementation/research file was absent from its task declaration; the cited entry identifies the file and corrected Layers.
- [SPRINT-099:204](#entry-sprint-099-204) — **real**: A real touched implementation/research file was absent from its task declaration; the cited entry identifies the file and corrected Layers.
- [SPRINT-102:318](#entry-sprint-102-318) — **real**: A real touched implementation/research file was absent from its task declaration; the cited entry identifies the file and corrected Layers.
- [SPRINT-115:96](#entry-sprint-115-96) — **real**: A real touched implementation/research file was absent from its task declaration; the cited entry identifies the file and corrected Layers.
- [SPRINT-151:90](#entry-sprint-151-90) — **real**: A real touched implementation/research file was absent from its task declaration; the cited entry identifies the file and corrected Layers.
- [SPRINT-161:95](#entry-sprint-161-95) — **real**: A real touched implementation/research file was absent from its task declaration; the cited entry identifies the file and corrected Layers.
- [SPRINT-103:775](#entry-sprint-103-775) — **record**: Commit subject attribution alone changed or was owner-ruled; no undeclared content change established by this finding.
- [SPRINT-131:146](#entry-sprint-131-146) — **record**: Commit subject attribution alone changed or was owner-ruled; no undeclared content change established by this finding.
- [SPRINT-154:189](#entry-sprint-154-189) — **record**: Commit subject attribution alone changed or was owner-ruled; no undeclared content change established by this finding.
- [SPRINT-166:64](#entry-sprint-166-64) — **record**: Commit subject attribution alone changed or was owner-ruled; no undeclared content change established by this finding.
- [SPRINT-171:227](#entry-sprint-171-227) — **record**: Commit subject attribution alone changed or was owner-ruled; no undeclared content change established by this finding.
- [SPRINT-152:300](#entry-sprint-152-300) — **record**: A declared intermediate task-state path was never used; actual work/ticks existed, and the owner ruled the bookkeeping mismatch.
- [SPRINT-096:540](#entry-sprint-096-540) — **unknown**: Parser divergence and aggregate findings were owner-ruled; the entry does not supply an individual artifact repair for every finding.
- [SPRINT-053:99](#entry-sprint-053-99) — **real**: The entry identifies an actual touched file omitted from the responsible task declaration; corrected Layers or ownership records now name the file.
- [SPRINT-059:77](#entry-sprint-059-77) — **real**: The entry identifies an actual touched file omitted from the responsible task declaration; corrected Layers or ownership records now name the file.
- [SPRINT-059:140](#entry-sprint-059-140) — **real**: The entry identifies an actual touched file omitted from the responsible task declaration; corrected Layers or ownership records now name the file.
- [SPRINT-065:67](#entry-sprint-065-67) — **real**: The entry identifies an actual touched file omitted from the responsible task declaration; corrected Layers or ownership records now name the file.
- [SPRINT-069:279](#entry-sprint-069-279) — **real**: The entry identifies an actual touched file omitted from the responsible task declaration; corrected Layers or ownership records now name the file.
- [SPRINT-070:77](#entry-sprint-070-77) — **real**: The entry identifies an actual touched file omitted from the responsible task declaration; corrected Layers or ownership records now name the file.
- [SPRINT-072:138](#entry-sprint-072-138) — **real**: The entry identifies an actual touched file omitted from the responsible task declaration; corrected Layers or ownership records now name the file.
- [SPRINT-073:291](#entry-sprint-073-291) — **real**: The entry identifies an actual touched file omitted from the responsible task declaration; corrected Layers or ownership records now name the file.
- [SPRINT-075:187](#entry-sprint-075-187) — **real**: The entry identifies an actual touched file omitted from the responsible task declaration; corrected Layers or ownership records now name the file.
- [SPRINT-075:285](#entry-sprint-075-285) — **real**: The entry identifies an actual touched file omitted from the responsible task declaration; corrected Layers or ownership records now name the file.
- [SPRINT-077:78](#entry-sprint-077-78) — **real**: The entry identifies an actual touched file omitted from the responsible task declaration; corrected Layers or ownership records now name the file.
- [SPRINT-080:152](#entry-sprint-080-152) — **real**: The entry identifies an actual touched file omitted from the responsible task declaration; corrected Layers or ownership records now name the file.
- [SPRINT-081:302](#entry-sprint-081-302) — **real**: The entry identifies an actual touched file omitted from the responsible task declaration; corrected Layers or ownership records now name the file.
- [SPRINT-082:28](#entry-sprint-082-28) — **real**: The entry identifies an actual touched file omitted from the responsible task declaration; corrected Layers or ownership records now name the file.
- [SPRINT-089:125](#entry-sprint-089-125) — **real**: The entry identifies an actual touched file omitted from the responsible task declaration; corrected Layers or ownership records now name the file.
- [SPRINT-092:175](#entry-sprint-092-175) — **real**: The entry identifies an actual touched file omitted from the responsible task declaration; corrected Layers or ownership records now name the file.
- [SPRINT-094:627](#entry-sprint-094-627) — **real**: The entry identifies an actual touched file omitted from the responsible task declaration; corrected Layers or ownership records now name the file.
- [SPRINT-107:193](#entry-sprint-107-193) — **real**: The entry identifies an actual touched file omitted from the responsible task declaration; corrected Layers or ownership records now name the file.
- [SPRINT-112:90](#entry-sprint-112-90) — **real**: The entry identifies an actual touched file omitted from the responsible task declaration; corrected Layers or ownership records now name the file.
- [SPRINT-118:108](#entry-sprint-118-108) — **real**: The entry identifies an actual touched file omitted from the responsible task declaration; corrected Layers or ownership records now name the file.
- [SPRINT-138:208](#entry-sprint-138-208) — **real**: The entry identifies an actual touched file omitted from the responsible task declaration; corrected Layers or ownership records now name the file.
- [SPRINT-045:73](#entry-sprint-045-73) — **real**: Agent worktrees were rejected as undeclared repository content; live false positive was cleared by pruning and retained as checker debt.
- [SPRINT-055:104](#entry-sprint-055-104) — **real**: A declared directory token covered no child files; both checkers gained directory-prefix semantics.
- [SPRINT-081:111](#entry-sprint-081-111) — **record**: Scratch-file cleanup, declaration spelling, unused state/path token, or coordinator/task commit attribution changed; no missing delivered behavior established.
- [SPRINT-087:516](#entry-sprint-087-516) — **record**: Scratch-file cleanup, declaration spelling, unused state/path token, or coordinator/task commit attribution changed; no missing delivered behavior established.
- [SPRINT-091:522](#entry-sprint-091-522) — **record**: Scratch-file cleanup, declaration spelling, unused state/path token, or coordinator/task commit attribution changed; no missing delivered behavior established.
- [SPRINT-104:640](#entry-sprint-104-640) — **record**: Scratch-file cleanup, declaration spelling, unused state/path token, or coordinator/task commit attribution changed; no missing delivered behavior established.
- [SPRINT-116:147](#entry-sprint-116-147) — **record**: Scratch-file cleanup, declaration spelling, unused state/path token, or coordinator/task commit attribution changed; no missing delivered behavior established.
- [SPRINT-118:155](#entry-sprint-118-155) — **record**: Scratch-file cleanup, declaration spelling, unused state/path token, or coordinator/task commit attribution changed; no missing delivered behavior established.
- [SPRINT-121:156](#entry-sprint-121-156) — **record**: Scratch-file cleanup, declaration spelling, unused state/path token, or coordinator/task commit attribution changed; no missing delivered behavior established.
- [SPRINT-122:137](#entry-sprint-122-137) — **record**: Scratch-file cleanup, declaration spelling, unused state/path token, or coordinator/task commit attribution changed; no missing delivered behavior established.
- [SPRINT-132:159](#entry-sprint-132-159) — **record**: Scratch-file cleanup, declaration spelling, unused state/path token, or coordinator/task commit attribution changed; no missing delivered behavior established.
- [SPRINT-133:54](#entry-sprint-133-54) — **record**: Scratch-file cleanup, declaration spelling, unused state/path token, or coordinator/task commit attribution changed; no missing delivered behavior established.
- [SPRINT-139:418](#entry-sprint-139-418) — **record**: Scratch-file cleanup, declaration spelling, unused state/path token, or coordinator/task commit attribution changed; no missing delivered behavior established.
- [SPRINT-144:145](#entry-sprint-144-145) — **record**: Scratch-file cleanup, declaration spelling, unused state/path token, or coordinator/task commit attribution changed; no missing delivered behavior established.
- [SPRINT-145:86](#entry-sprint-145-86) — **record**: Scratch-file cleanup, declaration spelling, unused state/path token, or coordinator/task commit attribution changed; no missing delivered behavior established.
- [SPRINT-167:44](#entry-sprint-167-44) — **record**: Scratch-file cleanup, declaration spelling, unused state/path token, or coordinator/task commit attribution changed; no missing delivered behavior established.
- [SPRINT-087:748](#entry-sprint-087-748) — **unknown**: Foreign stream confirms its attribution finding is correct, but this Log does not identify the eventual artifact repair.
- [SPRINT-106:176](#entry-sprint-106-176) — **unknown**: Run reports a layers-observed failure on uncommitted work; the entry does not identify a final changed-path disposition.
- [SPRINT-110:93](#entry-sprint-110-93) — **unknown**: Foreign EPIC-016 WIP is undeclared; it remains outside this sprint and the log does not establish its eventual scope disposition.

### History G1597

Proposed cut (borderline, owner rules). Both episodes concern commit/tick attribution; neither records unfinished work falsely marked complete.

- [SPRINT-102:337](#entry-sprint-102-337) — **record**: Subject claimed two ticks but diff contained three; owner ruled the immutable commit-count record.
- [SPRINT-131:146](#entry-sprint-131-146) — **record**: Four commit subjects rewritten; every tree byte-identical before/after.

Borderline for T4 owner ruling: the SPRINT-102 dod-delta FAIL was a commit subject claiming 2 ticks against 3 actual. This is a misstated record line rather than a wrong artifact; the
proposed cut remains borderline.

### History G1640

Proposed keep. A completed run was rejected on the false premise that exceeding the ceiling means no verdict. ADR-042 changed this to information.

Exclusions / deduplication: SPRINT-101:123 names the runtime observation but explicitly attributes both FAILs to review-depth; it is not a failing runtime entry.

- [SPRINT-101:290](#entry-sprint-101-290) — **real**: The sole FAIL is explicitly qa-runtime-over-ceiling on a complete 945-second run; SPRINT-102:232 repairs this policy in the gate.

### History G1671

n/a (no check). summary; population-only row with no verdict. Observed results are in the shared zero-search table.

### History H02

Proposed cut (borderline, owner rules): see the coordinator rulings after review. One host prerequisite failure, no artifact defect.

- [SPRINT-107:67](#entry-sprint-107-67) — **environment**: Worktree had no node_modules; coordinator reran on main, 15/0.

### History H04

Proposed keep (fixture of G1055). Keep the population assertion that caught the SPRINT-171 import problem.

- [SPRINT-107:67](#entry-sprint-107-67) — **environment**: Worktree lacked installed dependencies; this does not establish a defect in the harness's checked artifact.
- [SPRINT-113:76](#entry-sprint-113-76) — **environment**: Worktree lacked installed dependencies; this does not establish a defect in the harness's checked artifact.
- [SPRINT-118:155](#entry-sprint-118-155) — **environment**: Worktree lacked installed dependencies; this does not establish a defect in the harness's checked artifact.
- [SPRINT-121:19](#entry-sprint-121-19) — **environment**: Worktree lacked installed dependencies; this does not establish a defect in the harness's checked artifact.
- [SPRINT-137:113](#entry-sprint-137-113) — **environment**: Worktree lacked installed dependencies; this does not establish a defect in the harness's checked artifact.
- [SPRINT-171:101](#entry-sprint-171-101) — **real**: test/ imported scripts/, invalidating the must-fail typecheck-population proof; synthetic builder moved and imports corrected.

### History H05

Proposed keep. Consumer guard; missing population rules left actual new files unclassified.

- [SPRINT-115:96](#entry-sprint-115-96) — **real**: New script files were neither scanned nor covered by an explicit exclusion; emitter population rule repaired.
- [SPRINT-138:134](#entry-sprint-138-134) — **real**: New script files were neither scanned nor covered by an explicit exclusion; emitter population rule repaired.
- [SPRINT-147:104](#entry-sprint-147-104) — **real**: New script files were neither scanned nor covered by an explicit exclusion; emitter population rule repaired.
- [SPRINT-168:83](#entry-sprint-168-83) — **real**: New script files were neither scanned nor covered by an explicit exclusion; emitter population rule repaired.
- [SPRINT-171:216](#entry-sprint-171-216) — **real**: New script files were neither scanned nor covered by an explicit exclusion; emitter population rule repaired.

### History H06

Proposed keep. The live rollup change violated the existing log-selection guard.

- [SPRINT-059:111](#entry-sprint-059-111) — **real**: Second log glob broke the ADR-014 selection guard; implementation now derives the log from the already-selected Plan.

### History H13

Proposed keep (unknown, owner rules). Shared evidence is in the shared harness judgments table.


History unknown by owner age ruling: first appearance SPRINT-038, zero observed real defects. Embedded log evidence above is retained for the owner and does not override the ruling.

### History H14

Proposed keep (unknown, owner rules). Shared evidence is in the shared harness judgments table.


History unknown by owner age ruling: first appearance SPRINT-038, zero observed real defects. Embedded log evidence above is retained for the owner and does not override the ruling.

### History H21

Proposed keep (fixture of G1640). Unknown root cause remains distinct from the later improved empty-capture diagnostic.

History unknown: SPRINT-130:65 improves diagnostics but does not establish the original empty-capture cause. A green rerun is not a classified artifact repair.

Exclusions / deduplication: SPRINT-108:204 repeats TD-167; SPRINT-113:92 repeats the inherited-budget failure.

- [SPRINT-104:74](#entry-sprint-104-74) — **unknown**: Empty capture failed under load and passed alone; resource pressure was explicitly only an unverified hypothesis.
- [SPRINT-113:76](#entry-sprint-113-76) — **unknown**: Inherited QA_BUDGET_SECONDS caused a false failure; the log does not establish its final repair.

### History H23

Proposed keep (fixture of G0169). The original over-cap fixture caught a parser defect; a later timeout was environmental.

- [SPRINT-056:138](#entry-sprint-056-138) — **real**: Fixture caught leading empty TSV field loss, silently dropping root docs from cap coverage; delimiter changed to pipe.
- [SPRINT-111:68](#entry-sprint-111-68) — **environment**: Case 8 exceeded its five-second timeout; passed alone in 5.02 seconds.

### History H25

Proposed keep (fixture of G0733). A non-discriminating locale probe was a real portability defect in the test.

- [SPRINT-114:367](#entry-sprint-114-367) — **real**: dash ignores locale for glob order; SPRINT-115:66 switches probe/case/seed to bash while keeping real sh no-leak cases.

### History H27

Proposed cut. Shared evidence is in the shared harness judgments table.

Exclusions / deduplication: SPRINT-146:81 intentionally ran newly required cases red before implementing the change; not an unplanned failure.

### History H33

Proposed cut. The failure only pinned obsolete output wording; no PASS-path behavior changed.

- [SPRINT-082:46](#entry-sprint-082-46) — **record**: Expected nothing to block on was replaced by the gate ran and was green; assertion remained a PASS-message assertion.

### History H34

Proposed keep. Consumer guard. The changed spec exposed a test that could silently delete nothing.

- [SPRINT-077:78](#entry-sprint-077-78) — **real**: Placement fixture hard-coded TODO.md after it ceased being required; victim now derives from the spec and must exist before removal.

### History H35

Proposed keep (fixture of G0567). Shared evidence is in the shared harness judgments table.

Exclusions / deduplication: SPRINT-098:222 found a silent drift guard by review while the harness remained green; it is not a FAIL caught by this row.

### History H36

Proposed cut. Shared evidence is in the shared harness judgments table.

Exclusions / deduplication: SPRINT-122:188 was a coordinator-discovered regression followed by a newly written failing case, not a failure discovered by the existing harness.

### History H42

Proposed keep. Consumer guard. Two stale test assumptions rejected correct newly widened engine coverage.

- [SPRINT-076:180](#entry-sprint-076-180) — **real**: Harness wrongly required missing-file findings to name existing files and equated lines with rules; assertions corrected.
- [SPRINT-077:78](#entry-sprint-077-78) — **real**: Spec removed the four loop artifacts; retained foreign-repo criterion failed and was restored to the stronger empty-remainder assertion.

### History H43

Proposed keep (unknown, owner rules). Consumer guard. Host environment failure, not a defect in the dispatched artifact.

Exclusions / deduplication: SPRINT-045:50 repeats the same environment finding; SPRINT-045:109 records its resolution.

- [SPRINT-043:183](#entry-sprint-043-183) — **environment**: Inherited MSYS_NO_PATHCONV broke path handling; corrected environment, no source defect established.

History unknown by owner age ruling: first appearance SPRINT-038, zero observed real defects. Embedded log evidence above is retained for the owner and does not override the ruling.

### History H44

Proposed keep (fixture of G0435). Consumer guard; fixture input stopped satisfying the standard after coverage widened.

- [SPRINT-076:285](#entry-sprint-076-285) — **real**: Bare-directory fixtures lacked required core files and the AGENTS ownership header; fixtures repaired to represent conforming repos.

### History H53

Proposed keep. Windows and changed prime contract exposed a faulty test artifact.

- [SPRINT-111:172](#entry-sprint-111-172) — **real**: work-store harness retained the old prime contract and mishandled CRLF; contract and parsing repaired.

### History H54

Proposed keep (fixture of G1544). The wrapper preserves the earlier shell runner's coverage (SPRINT-128:71), including the TS suite introduced in SPRINT-110. No unplanned harness FAIL is reported across that
lineage; SPRINT-116:77 says 13/0 after a comment fix, not a failed test.

### History H58

Proposed keep (fixture of G0147, G1094). The test depended on a slow host; a fast real run exposed that assumption.

- [SPRINT-114:367](#entry-sprint-114-367) — **real**: Leg 12 reached within the fixture's silent window; SPRINT-115:66 replaces elapsed-time assumption with the expected finding and bounded wait.

### History H61

Proposed keep (fixture of G1447). Shared evidence is in the shared harness judgments table.

Exclusions / deduplication: SPRINT-107:157 seed batch produced no verdict because commit signing failed at volume; the log explicitly calls it INVALID, not red. No FAIL unit is inferred from
the missing result.

### History H62

Proposed keep. Consumer guard; these failures only pinned prose literals, not execution behavior.

- [SPRINT-114:93](#entry-sprint-114-93) — **record**: Old prime/night-run phrase was stale since SPRINT-110; re-anchored at SPRINT-114:223.
- [SPRINT-125:228](#entry-sprint-125-228) — **record**: Reworded script-follows-contract sentence restored with intent unchanged.
- [SPRINT-140:270](#entry-sprint-140-270) — **record**: TODO in the code-slop prose tripped the retired TODO.md literal check; reworded to to-do.

### Cited entries

Each pointer names the archive file and its exact dated entry heading; line numbers are at the measurement pin. Read the whole entry, including its disposition.

### Entry SPRINT-031-65

[SPRINT-031-tech-debt-split.md:65](../../sprint/archive/SPRINT-031-tech-debt-split.md)
Entry heading: 2026-07-29 | execute | full wiring applied, qa-check green (56/0)

### Entry SPRINT-033-166

[SPRINT-033-unattended-run-contract.md:166](../../sprint/archive/SPRINT-033-unattended-run-contract.md)
Entry heading: 2026-07-29 | T5 | Consumer surface + v1.17.0 — and the T3 cap call was wrong

### Entry SPRINT-042-224

[SPRINT-042-run-to-finish.md:224](../../sprint/archive/SPRINT-042-run-to-finish.md)
Entry heading: 2026-08-01 | T3 | Layers-vs-DoD completeness leg — dispatched, then independently re-verified

### Entry SPRINT-043-183

[SPRINT-043-proof-run.md:183](../../sprint/archive/SPRINT-043-proof-run.md)
Entry heading: 2026-08-01 | execute | wave 1 landed — both units merged, the proof holds

### Entry SPRINT-045-73

[SPRINT-045-gate-precision.md:73](../../sprint/archive/logs/SPRINT-045-gate-precision.md)
Entry heading: 2026-08-01 | T2 landed | merged --no-ff; two allowlist form findings; one park

### Entry SPRINT-048-234

[SPRINT-048-epic-layer.md:234](../../sprint/archive/logs/SPRINT-048-epic-layer.md)
Entry heading: 2026-08-09 | complete | T5 — DEAD-ON-ARRIVAL false verdict fixed, without inventing a mechanism

### Entry SPRINT-049-122

[SPRINT-049-layer-check-redesign.md:122](../../sprint/archive/logs/SPRINT-049-layer-check-redesign.md)
Entry heading: 2026-08-09 | progress | T3 ran first — the Plan could not be committed until the check it fixes was fixed

### Entry SPRINT-053-99

[SPRINT-053-surface-truth.md:99](../../sprint/archive/logs/SPRINT-053-surface-truth.md)
Entry heading: 2026-08-09 | surprise | the observed leg caught T2's own declaration gap — declaration corrected, scope unchanged

### Entry SPRINT-055-75

[SPRINT-055-wiring-the-standard.md:75](../../sprint/archive/logs/SPRINT-055-wiring-the-standard.md)
Entry heading: 2026-08-09 | scope-change | T1 `Layers:` gains the two files implementation invented

### Entry SPRINT-055-104

[SPRINT-055-wiring-the-standard.md:104](../../sprint/archive/logs/SPRINT-055-wiring-the-standard.md)
Entry heading: 2026-08-09 | scope-change | `Layers:` directory tokens taught to both layers checkers (T1)

### Entry SPRINT-056-23

[SPRINT-056-silent-passes.md:23](../../sprint/archive/logs/SPRINT-056-silent-passes.md)
Entry heading: 2026-08-09 | promote | Plan locked at 1f0c012; ownership corrected by the gate before it was signed

### Entry SPRINT-056-138

[SPRINT-056-silent-passes.md:138](../../sprint/archive/logs/SPRINT-056-silent-passes.md)
Entry heading: 2026-08-09 | surprise | T2 — the new check found a FOURTH live breach, and a false negative in itself

### Entry SPRINT-059-77

[SPRINT-059-prove-the-run-finished.md:77](../../sprint/archive/logs/SPRINT-059-prove-the-run-finished.md)
Entry heading: 2026-08-10 | progress | T2 — the rollup is emitted by the wrapper, not asked for

### Entry SPRINT-059-111

[SPRINT-059-prove-the-run-finished.md:111](../../sprint/archive/logs/SPRINT-059-prove-the-run-finished.md)
Entry heading: 2026-08-10 | progress | T3 — the rollup is now gated, not merely emitted

### Entry SPRINT-059-140

[SPRINT-059-prove-the-run-finished.md:140](../../sprint/archive/logs/SPRINT-059-prove-the-run-finished.md)
Entry heading: 2026-08-10 | progress | T4 — a park the run itself unblocks is now re-checked

### Entry SPRINT-063-205

[SPRINT-063-headroom.md:205](../../sprint/archive/logs/SPRINT-063-headroom.md)
Entry heading: 2026-08-14 | surprise | worktree-isolated dispatch breaks two find-based gate checks

### Entry SPRINT-064-85

[SPRINT-064-where-it-fires.md:85](../../sprint/archive/logs/SPRINT-064-where-it-fires.md)
Entry heading: 2026-08-14 | surprise | `complete` is a reserved run-level event, and the template does not say so

### Entry SPRINT-065-67

[SPRINT-065-the-critic-loop.md:67](../../sprint/archive/logs/SPRINT-065-the-critic-loop.md)
Entry heading: 2026-08-14 | progress | T1 `Layers:` corrected to declare `SPRINT.md.template` (L-100)

### Entry SPRINT-068-88

[SPRINT-068-open-the-standard.md:88](../../sprint/archive/logs/SPRINT-068-open-the-standard.md)
Entry heading: 2026-08-15 | surprise | System-verify's first real firing was RED — on its own sprint

### Entry SPRINT-069-279

[SPRINT-069-first-extraction.md:279](../../sprint/archive/logs/SPRINT-069-first-extraction.md)
Entry heading: 2026-08-16 | progress | system-verify blocked the close twice, then passed — 156 pass / 0 fail

### Entry SPRINT-070-77

[SPRINT-070-attested.md:77](../../sprint/archive/logs/SPRINT-070-attested.md)
Entry heading: 2026-08-16 | progress | T2 — `Layers:` corrected to add `scripts/qa-check.sh` (L-100, not a scope-change)

### Entry SPRINT-072-138

[SPRINT-072-conformance-baseline.md:138](../../sprint/archive/logs/SPRINT-072-conformance-baseline.md)
Entry heading: 2026-08-16 | progress | T2 — two criteria gaps found, and I caught myself squeezing a cap

### Entry SPRINT-073-246

[SPRINT-073-spec-as-rule-source.md:246](../../sprint/archive/logs/SPRINT-073-spec-as-rule-source.md)
Entry heading: 2026-08-16 | progress | T2 — the spec is ruled uncapped, and the cap cell nearly capped it at 26

### Entry SPRINT-073-291

[SPRINT-073-spec-as-rule-source.md:291](../../sprint/archive/logs/SPRINT-073-spec-as-rule-source.md)
Entry heading: 2026-08-16 | surprise | T2 — I committed through a red gate, and the shell line I wrote is why

### Entry SPRINT-074-24

[SPRINT-074-first-spec-driven-checker.md:24](../../sprint/archive/logs/SPRINT-074-first-spec-driven-checker.md)
Entry heading: 2026-08-16 | promote | spec 0.4.0's rule ids are indistinguishable from filenames to the Layers checker

### Entry SPRINT-074-98

[SPRINT-074-first-spec-driven-checker.md:98](../../sprint/archive/logs/SPRINT-074-first-spec-driven-checker.md)
Entry heading: 2026-08-17 | surprise | the QA gate goes red on the calendar, not on the code

### Entry SPRINT-075-99

[SPRINT-075-the-conformance-engine.md:99](../../sprint/archive/logs/SPRINT-075-the-conformance-engine.md)
Entry heading: 2026-08-18 | progress | T1 — `Layers:` corrected to declare `scripts/qa-check.sh` (L-100)

### Entry SPRINT-075-187

[SPRINT-075-the-conformance-engine.md:187](../../sprint/archive/logs/SPRINT-075-the-conformance-engine.md)
Entry heading: 2026-08-18 | progress | T2 — `Layers:` corrected again, and the qa-check wiring ruled informational

### Entry SPRINT-075-285

[SPRINT-075-the-conformance-engine.md:285](../../sprint/archive/logs/SPRINT-075-the-conformance-engine.md)
Entry heading: 2026-08-20 | surprise | the gate reported 3 failures and the harness reported exit 0 — T4 was committed on it

### Entry SPRINT-076-180

[SPRINT-076-coverage-and-the-bar.md:180](../../sprint/archive/logs/SPRINT-076-coverage-and-the-bar.md)
Entry heading: 2026-08-20 | progress | T3 — §2's placement pair, and the artefact question finally answered

### Entry SPRINT-076-285

[SPRINT-076-coverage-and-the-bar.md:285](../../sprint/archive/logs/SPRINT-076-coverage-and-the-bar.md)
Entry heading: 2026-08-20 | progress | T3 — a third harness went stale, and the gate is the thing that said so

### Entry SPRINT-076-464

[SPRINT-076-coverage-and-the-bar.md:464](../../sprint/archive/logs/SPRINT-076-coverage-and-the-bar.md)
Entry heading: 2026-08-21 | surprise | T1 — an off-vocabulary tag drops a doc from the index, silently

### Entry SPRINT-077-78

[SPRINT-077-the-decisions-epic-004-is-waiting-on.md:78](../../sprint/archive/logs/SPRINT-077-the-decisions-epic-004-is-waiting-on.md)
Entry heading: 2026-08-21 | progress | T1 shipped: the spec moved, no code did

### Entry SPRINT-079-442

[SPRINT-079-the-undifferentiated-middle.md:442](../../sprint/archive/logs/SPRINT-079-the-undifferentiated-middle.md)
Entry heading: 2026-08-23 | close | the close gate caught three things, two of them this session's own work

### Entry SPRINT-080-83

[SPRINT-080-the-last-twelve-rules.md:83](../../sprint/archive/logs/SPRINT-080-the-last-twelve-rules.md)
Entry heading: 2026-08-23 | progress | T1 — §11's four ledger-retention rules, and two defects real input found

### Entry SPRINT-080-152

[SPRINT-080-the-last-twelve-rules.md:152](../../sprint/archive/logs/SPRINT-080-the-last-twelve-rules.md)
Entry heading: 2026-08-23 | scope-change | § Plan gains a `### T0` section, because a gate required the declaration

### Entry SPRINT-080-346

[SPRINT-080-the-last-twelve-rules.md:346](../../sprint/archive/logs/SPRINT-080-the-last-twelve-rules.md)
Entry heading: 2026-08-23 | scope-change | T4 edits `check-epic-archive.sh`, which its Cites said to run and never edit

### Entry SPRINT-081-111

[SPRINT-081-clean-slate.md:111](../../sprint/archive/logs/SPRINT-081-clean-slate.md)
Entry heading: 2026-08-24 | progress | T1 Layers gains `docs/knowledge-index.md`; two gate findings cleared

### Entry SPRINT-081-158

[SPRINT-081-clean-slate.md:158](../../sprint/archive/logs/SPRINT-081-clean-slate.md)
Entry heading: 2026-08-24 | progress | T1 gate: `159 pass, 1 fail` → both findings closed

### Entry SPRINT-081-302

[SPRINT-081-clean-slate.md:302](../../sprint/archive/logs/SPRINT-081-clean-slate.md)
Entry heading: 2026-08-24 | progress | T2 gate green — `161 pass, 0 fail`; T2 complete, 8 of 8

### Entry SPRINT-082-28

[SPRINT-082-foundation-hardening.md:28](../../sprint/archive/logs/SPRINT-082-foundation-hardening.md)
Entry heading: 2026-08-24 | scope-change | T1 — `Layers:` corrected mid-task (L-100)

### Entry SPRINT-082-46

[SPRINT-082-foundation-hardening.md:46](../../sprint/archive/logs/SPRINT-082-foundation-hardening.md)
Entry heading: 2026-08-24 | surprise | T1 — the checker asserted on wording, and the rewording broke it

### Entry SPRINT-082-148

[SPRINT-082-foundation-hardening.md:148](../../sprint/archive/logs/SPRINT-082-foundation-hardening.md)
Entry heading: 2026-08-24 | progress | T3 — reachability, and it caught this sprint on first contact

### Entry SPRINT-082-288

[SPRINT-082-foundation-hardening.md:288](../../sprint/archive/logs/SPRINT-082-foundation-hardening.md)
Entry heading: 2026-08-24 | run-complete | rollup corrected to the Part 4 shape

### Entry SPRINT-083-598

[SPRINT-083-ts-bun-foundation.md:598](../../sprint/archive/logs/SPRINT-083-ts-bun-foundation.md)
Entry heading: 2026-08-24 | close | SPRINT-083 closed — 26 of 26, four on a recorded ruling rather than a verdict

### Entry SPRINT-084-230

[SPRINT-084-gate-recovery-and-owed-work.md:230](../../sprint/archive/logs/SPRINT-084-gate-recovery-and-owed-work.md)
Entry heading: 2026-08-25 | progress | System-verify: `QA-CHECK: 176 pass, 3 fail` → owner ruling splits the three

### Entry SPRINT-086-191

[SPRINT-086-guards-that-cannot-fire.md:191](../../sprint/archive/logs/SPRINT-086-guards-that-cannot-fire.md)
Entry heading: 2026-08-25 | blocker | I committed a live reviewer's seeded break into a shipped guard — L-042, caught only by the outside pass

### Entry SPRINT-086-340

[SPRINT-086-guards-that-cannot-fire.md:340](../../sprint/archive/logs/SPRINT-086-guards-that-cannot-fire.md)
Entry heading: 2026-08-25 | progress | The gate completed under load — DoD 3 met, and the run proved two of this sprint's fixes at once

### Entry SPRINT-087-58

[SPRINT-087-first-rule-through-the-engine.md:58](../../sprint/archive/logs/SPRINT-087-first-rule-through-the-engine.md)
Entry heading: 2026-08-25 | surprise | G2 pre-screen FAILs on T4 — the guard is wrong, not the criterion

### Entry SPRINT-087-110

[SPRINT-087-first-rule-through-the-engine.md:110](../../sprint/archive/logs/SPRINT-087-first-rule-through-the-engine.md)
Entry heading: 2026-08-25 | surprise | my own `consequence · T4` line is mis-keyed, and the gate caught it

### Entry SPRINT-087-516

[SPRINT-087-first-rule-through-the-engine.md:516](../../sprint/archive/logs/SPRINT-087-first-rule-through-the-engine.md)
Entry heading: 2026-08-26 | progress | T5 — exit mapping proven over every SpecFinding, and a reach limit found

### Entry SPRINT-087-705

[SPRINT-087-first-rule-through-the-engine.md:705](../../sprint/archive/logs/SPRINT-087-first-rule-through-the-engine.md)
Entry heading: 2026-08-26 | progress | Close gate ruled — 17 findings, 10 of them false

### Entry SPRINT-087-748

[SPRINT-087-first-rule-through-the-engine.md:748](../../sprint/archive/logs/SPRINT-087-first-rule-through-the-engine.md)
Entry heading: 2026-08-26 | surprise | I read "17 FAILs" off a log the gate never counted — the verdict is 2

### Entry SPRINT-088-19

[SPRINT-088-execution-autonomy-foundation.md:19](../../sprint/archive/logs/SPRINT-088-execution-autonomy-foundation.md)
Entry heading: 2026-08-26 | progress | T1 `Cites:` corrected to clear a red gate carried since promote

### Entry SPRINT-089-66

[SPRINT-089-prove-the-unattended-run.md:66](../../sprint/archive/logs/SPRINT-089-prove-the-unattended-run.md)
Entry heading: 2026-08-26 | scope-change | Layers corrected — the dominant cost sits in the engine, not a harness

### Entry SPRINT-089-125

[SPRINT-089-prove-the-unattended-run.md:125](../../sprint/archive/logs/SPRINT-089-prove-the-unattended-run.md)
Entry heading: 2026-08-26 | progress | T1 complete — gate green at 195 pass, 0 fail, and the guard caught its own author

### Entry SPRINT-089-236

[SPRINT-089-prove-the-unattended-run.md:236](../../sprint/archive/logs/SPRINT-089-prove-the-unattended-run.md)
Entry heading: 2026-08-27 | surprise | independent review of T2 — the D4 justification overclaimed 2 of 3

### Entry SPRINT-090-66

[SPRINT-090-run-evidence-vehicle.md:66](../../sprint/archive/logs/SPRINT-090-run-evidence-vehicle.md)
Entry heading: 2026-08-26 | surprise | the guard caught a FALSE machine-readable claim in this very log

### Entry SPRINT-090-103

[SPRINT-090-run-evidence-vehicle.md:103](../../sprint/archive/logs/SPRINT-090-run-evidence-vehicle.md)
Entry heading: 2026-08-26 | scope-change | T1 must CITE what it runs; and a premature review-depth tag withdrawn

### Entry SPRINT-091-175

[SPRINT-091-full-run-and-first-family.md:175](../../sprint/archive/logs/SPRINT-091-full-run-and-first-family.md)
Entry heading: 2026-08-27 | surprise | the checker turned on and the tree does not type-check — 59 real errors

### Entry SPRINT-091-294

[SPRINT-091-full-run-and-first-family.md:294](../../sprint/archive/logs/SPRINT-091-full-run-and-first-family.md)
Entry heading: 2026-08-27 | progress | T1's gate leg is wired and proven; Layers corrected per L-100

### Entry SPRINT-091-522

[SPRINT-091-full-run-and-first-family.md:522](../../sprint/archive/logs/SPRINT-091-full-run-and-first-family.md)
Entry heading: 2026-08-27 | surprise | three format contracts bit in a row; `Layers:` declarations were invisible

### Entry SPRINT-092-61

[SPRINT-092-the-conversions-measured-delta.md:61](../../sprint/archive/logs/SPRINT-092-the-conversions-measured-delta.md)
Entry heading: 2026-08-31 | T1 | fixture factories landed and verified — three DoD ticked, bookkeeping reconciled

### Entry SPRINT-092-175

[SPRINT-092-the-conversions-measured-delta.md:175](../../sprint/archive/logs/SPRINT-092-the-conversions-measured-delta.md)
Entry heading: 2026-08-31 | T2 | converted, swapped, and proved — 4 of 4 DoD

### Entry SPRINT-092-283

[SPRINT-092-the-conversions-measured-delta.md:283](../../sprint/archive/logs/SPRINT-092-the-conversions-measured-delta.md)
Entry heading: 2026-08-31 | T4 | measured — 4 of 4 DoD, and the delta is NOT the clean beat it computes to

### Entry SPRINT-093-163

[SPRINT-093-close-the-autonomy-guard-gap.md:163](../../sprint/archive/logs/SPRINT-093-close-the-autonomy-guard-gap.md)
Entry heading: 2026-08-29 | scope-change | T5 added — the authority leg fires outside the context it was written for

### Entry SPRINT-094-147

[SPRINT-094-guards-for-what-nothing-reads.md:147](../../sprint/archive/logs/SPRINT-094-guards-for-what-nothing-reads.md)
Entry heading: 2026-09-01 | progress | T1 — 5 of 6 DoD; the guard found 7 real findings and they are repaired

### Entry SPRINT-094-627

[SPRINT-094-guards-for-what-nothing-reads.md:627](../../sprint/archive/logs/SPRINT-094-guards-for-what-nothing-reads.md)
Entry heading: 2026-09-04 | progress | T2 and T3 — the three held-open DoD closed on evidence

### Entry SPRINT-096-155

[SPRINT-096-rule-the-ownership-tension.md:155](../../sprint/archive/logs/SPRINT-096-rule-the-ownership-tension.md)
Entry heading: 2026-09-08 | surprise | the promote-time Plan repair is a permanent `S9.SCOPECHANGE` FAIL, and the trap is structural

### Entry SPRINT-096-540

[SPRINT-096-rule-the-ownership-tension.md:540](../../sprint/archive/logs/SPRINT-096-rule-the-ownership-tension.md)
Entry heading: 2026-09-09 | progress | owner override: close proceeds on targeted evidence; the parser divergence is a Retro ruling

### Entry SPRINT-097-187

[SPRINT-097-guards-that-run-over-the-wrong-set.md:187](../../sprint/archive/logs/SPRINT-097-guards-that-run-over-the-wrong-set.md)
Entry heading: 2026-09-10 | scope-change | A3 corrected: `member_plan()` does not exist

### Entry SPRINT-099-204

[SPRINT-099-make-the-gate-finish.md:204](../../sprint/archive/logs/SPRINT-099-make-the-gate-finish.md)
Entry heading: 2026-09-13 | progress | T2 + T3 outside reviews returned, and T3's found an eleventh site

### Entry SPRINT-100-99

[SPRINT-100-findings-that-mean-what-they-say.md:99](../../sprint/archive/logs/SPRINT-100-findings-that-mean-what-they-say.md)
Entry heading: 2026-09-13 | surprise | the conformance engine walks into live agent worktrees — a finding untrue of its own subject, on this sprint's own theme

### Entry SPRINT-100-633

[SPRINT-100-findings-that-mean-what-they-say.md:633](../../sprint/archive/logs/SPRINT-100-findings-that-mean-what-they-say.md)
Entry heading: 2026-09-14 | progress | `review ·` lines supplied for T5 and, back-filled, T2 — the gate named both

### Entry SPRINT-101-45

[SPRINT-101-prove-the-run.md:45](../../sprint/archive/logs/SPRINT-101-prove-the-run.md)
Entry heading: 2026-09-14 | scope-change | T1's two mechanical `Verify:` clauses cannot reach their targets

### Entry SPRINT-101-114

[SPRINT-101-prove-the-run.md:114](../../sprint/archive/logs/SPRINT-101-prove-the-run.md)
Entry heading: 2026-09-14 | surprise | the gate is red by construction between promote and first log entry

### Entry SPRINT-101-123

[SPRINT-101-prove-the-run.md:123](../../sprint/archive/logs/SPRINT-101-prove-the-run.md)
Entry heading: 2026-09-14 | surprise | A1 is false as written, true for the precondition it exists to serve

### Entry SPRINT-101-290

[SPRINT-101-prove-the-run.md:290](../../sprint/archive/logs/SPRINT-101-prove-the-run.md)
Entry heading: 2026-09-15 | surprise | the gate has no green configuration — and that, not the envelope, now blocks § Closed-when 1

### Entry SPRINT-102-318

[SPRINT-102-make-the-gate-green.md:318](../../sprint/archive/logs/SPRINT-102-make-the-gate-green.md)
Entry heading: 2026-09-20 | scope-change | T4 `Layers:` corrected a fourth time — the harness file two commits changed and none declared

### Entry SPRINT-102-337

[SPRINT-102-make-the-gate-green.md:337](../../sprint/archive/logs/SPRINT-102-make-the-gate-green.md)
Entry heading: 2026-09-20 | decision | the second FAIL is accurate, unfixable-forward, and ruled — TD-166 filed

### Entry SPRINT-103-775

[SPRINT-103-port-the-measured-hotspots.md:775](../../sprint/archive/logs/SPRINT-103-port-the-measured-hotspots.md)
Entry heading: 2026-09-20 | progress | both wiring diffs applied; the gate found nine things, all mine

### Entry SPRINT-104-41

[SPRINT-104-the-gates-own-blind-spots.md:41](../../sprint/archive/logs/SPRINT-104-the-gates-own-blind-spots.md)
Entry heading: 2026-09-22 | progress | T1 — TD-169 closed: the typecheck leg's program now holds both trees

### Entry SPRINT-104-74

[SPRINT-104-the-gates-own-blind-spots.md:74](../../sprint/archive/logs/SPRINT-104-the-gates-own-blind-spots.md)
Entry heading: 2026-09-22 | surprise | the gate is not deterministic on this host, and its budget margin is ~5%

### Entry SPRINT-104-640

[SPRINT-104-the-gates-own-blind-spots.md:640](../../sprint/archive/logs/SPRINT-104-the-gates-own-blind-spots.md)
Entry heading: 2026-09-23 | surprise | T3's `Layers:` was PRESENT and UNREADABLE — `*.ts|sh` matches nothing

### Entry SPRINT-104-715

[SPRINT-104-the-gates-own-blind-spots.md:715](../../sprint/archive/logs/SPRINT-104-the-gates-own-blind-spots.md)
Entry heading: 2026-09-23 | progress | the gate's four FAILs at `7524c6a`, cleared — all in this sprint's own files

### Entry SPRINT-105-33

[SPRINT-105-enforce-what-is-written.md:33](../../sprint/archive/logs/SPRINT-105-enforce-what-is-written.md)
Entry heading: 2026-09-21 | progress | T2 — density ratchet built, wired, and it caught its own author

### Entry SPRINT-105-75

[SPRINT-105-enforce-what-is-written.md:75](../../sprint/archive/logs/SPRINT-105-enforce-what-is-written.md)
Entry heading: 2026-09-21 | progress | gate run, and three of its five FAILs were this sprint's

### Entry SPRINT-106-176

[SPRINT-106-the-store-and-the-way-in.md:176](../../sprint/archive/logs/SPRINT-106-the-store-and-the-way-in.md)
Entry heading: 2026-09-24 | progress | system-verify — full gate to a verdict, after one memory kill

### Entry SPRINT-107-67

[SPRINT-107-retarget-the-loop.md:67](../../sprint/archive/logs/SPRINT-107-retarget-the-loop.md)
Entry heading: 2026-09-24 | progress | T3 accepted — /handoff + /flow read the store; reconciliation files follow-ups as task files

### Entry SPRINT-107-193

[SPRINT-107-retarget-the-loop.md:193](../../sprint/archive/logs/SPRINT-107-retarget-the-loop.md)
Entry heading: 2026-09-25 | scope-change | T1 · T2 · T4 Layers declare the files their logged scope-changes already named

### Entry SPRINT-108-15

[SPRINT-108-guard-the-freeze.md:15](../../sprint/archive/logs/SPRINT-108-guard-the-freeze.md)
Entry heading: 2026-09-26 | promote | plan locked at `96865d2`, governance signed

### Entry SPRINT-108-204

[SPRINT-108-guard-the-freeze.md:204](../../sprint/archive/logs/SPRINT-108-guard-the-freeze.md)
Entry heading: 2026-09-26 | close | SPRINT-108 closed — 10 of 10 Plan DoD

### Entry SPRINT-109-96

[SPRINT-109-unlock-the-critical-path.md:96](../../sprint/archive/logs/SPRINT-109-unlock-the-critical-path.md)
Entry heading: 2026-09-28 | progress | T1 TASK-377 merged at `3c85e84`. Review NOT CLEAR → one revise → verified

### Entry SPRINT-109-178

[SPRINT-109-unlock-the-critical-path.md:178](../../sprint/archive/logs/SPRINT-109-unlock-the-critical-path.md)
Entry heading: 2026-09-28 | surprise | system verify: the QA_FULL gate was killed by the host's memory reaper, and its partial run found 3 real FAILs

### Entry SPRINT-109-188

[SPRINT-109-unlock-the-critical-path.md:188](../../sprint/archive/logs/SPRINT-109-unlock-the-critical-path.md)
Entry heading: 2026-09-29 | surprise | layers-completeness FAILs on T1 from plan_commit, although the promote entry recorded PASS

### Entry SPRINT-110-75

[SPRINT-110-retarget-the-gate.md:75](../../sprint/archive/logs/SPRINT-110-retarget-the-gate.md)
Entry heading: 2026-09-29 | progress | G1 + G2 signed by the owner at `04e517c`; rank 0 to be dispatched (T1 ∥ T2, worktree-isolated)

### Entry SPRINT-110-93

[SPRINT-110-retarget-the-gate.md:93](../../sprint/archive/logs/SPRINT-110-retarget-the-gate.md)
Entry heading: 2026-09-29 | progress | T2 TASK-391 merged at `ca162ec`. Outside review CLEAR, 3 census-zero gaps → TD-196/197/198

### Entry SPRINT-111-31

[SPRINT-111-delete-todo-md.md:31](../../sprint/archive/logs/SPRINT-111-delete-todo-md.md)
Entry heading: 2026-09-30 | surprise | the layers guards SPRINT-110 built caught two findings on this Plan at render

### Entry SPRINT-111-68

[SPRINT-111-delete-todo-md.md:68](../../sprint/archive/logs/SPRINT-111-delete-todo-md.md)
Entry heading: 2026-09-30 | progress | bookkeeping gate read; committed through 4 reds of known cause (owner ruling)

### Entry SPRINT-111-172

[SPRINT-111-delete-todo-md.md:172](../../sprint/archive/logs/SPRINT-111-delete-todo-md.md)
Entry heading: 2026-10-02 | scope-change | T5 follow-up: the opt-in work-store harness still encodes prime's old rule; T4 Codex round 1 + 2

### Entry SPRINT-112-90

[SPRINT-112-govern-lighter.md:90](../../sprint/archive/logs/SPRINT-112-govern-lighter.md)
Entry heading: 2026-10-03 | scope-change | system-verify: two gate reds traced; T1/T2 Layers amended; a SPRINT-111 typecheck regression repaired

### Entry SPRINT-113-69

[SPRINT-113-ship-the-store-trim-the-guards.md:69](../../sprint/archive/logs/SPRINT-113-ship-the-store-trim-the-guards.md)
Entry heading: 2026-10-03 | scope-change | T4 Cites names the member's bare `migration-map.md`; the Shell and TS layers-completeness checkers disagree

### Entry SPRINT-113-76

[SPRINT-113-ship-the-store-trim-the-guards.md:76](../../sprint/archive/logs/SPRINT-113-ship-the-store-trim-the-guards.md)
Entry heading: 2026-10-03 | progress | T1 (TASK-398) built + coordinator self-review (ADR-050 bar); merged abe269c

### Entry SPRINT-113-92

[SPRINT-113-ship-the-store-trim-the-guards.md:92](../../sprint/archive/logs/SPRINT-113-ship-the-store-trim-the-guards.md)
Entry heading: 2026-10-03 | close | 4 of 4 members in done/, 11 of 11 Done-when; EPIC-017 step 1 done (unblocks 371)

### Entry SPRINT-114-93

[SPRINT-114-prove-adopt-release-2-0.md:93](../../sprint/archive/logs/SPRINT-114-prove-adopt-release-2-0.md)
Entry heading: 2026-10-03 | progress | promote full gate (`QA_FULL=1`, detached, run as its own call): `QA-CHECK: 308 pass, 3 fail`, untruncated, 1983 s

### Entry SPRINT-114-102

[SPRINT-114-prove-adopt-release-2-0.md:102](../../sprint/archive/logs/SPRINT-114-prove-adopt-release-2-0.md)
Entry heading: 2026-10-03 | progress | T1 step 1: `2.0.0-rc.1` cut -- `release/2.0.0-rc.1` @ `915385e`, annotated tag `v2.0.0-rc.1`

### Entry SPRINT-114-150

[SPRINT-114-prove-adopt-release-2-0.md:150](../../sprint/archive/logs/SPRINT-114-prove-adopt-release-2-0.md)
Entry heading: 2026-10-03 | progress | T3 (TASK-372): Codex r3 CLEAR; merged `3f4b66c`; post-merge typecheck red → fixed `19670ac`; (a) (b) (d) ticked, (c) open

### Entry SPRINT-114-320

[SPRINT-114-prove-adopt-release-2-0.md:320](../../sprint/archive/logs/SPRINT-114-prove-adopt-release-2-0.md)
Entry heading: 2026-10-04 | progress | release gate (`QA_FULL=1`, detached, own call) on `9af8163`: `QA-CHECK: 313 pass, 7 fail`, 2830 s

### Entry SPRINT-114-355

[SPRINT-114-prove-adopt-release-2-0.md:355](../../sprint/archive/logs/SPRINT-114-prove-adopt-release-2-0.md)
Entry heading: 2026-10-04 | progress | close gate (`QA_FULL=1`) killed by the host low-memory reaper: no verdict; re-run deferred to after the push (owner ruling)

### Entry SPRINT-114-367

[SPRINT-114-prove-adopt-release-2-0.md:367](../../sprint/archive/logs/SPRINT-114-prove-adopt-release-2-0.md)
Entry heading: 2026-10-06 | progress | post-push full gate (`QA_FULL=1`, detached, own call) on `ef63e6c` on a Linux VPS: `QA-CHECK: 300 pass, 3 fail`; all 3 are host-environment, and each
re-runs PASS on the Windows host

### Entry SPRINT-115-19

[SPRINT-115-gate-and-host-cost.md:19](../../sprint/archive/logs/SPRINT-115-gate-and-host-cost.md)
Entry heading: 2026-10-06 | promote | plan locked, governance signed, five members: the gate's cost measured off-host and ruled

### Entry SPRINT-115-96

[SPRINT-115-gate-and-host-cost.md:96](../../sprint/archive/logs/SPRINT-115-gate-and-host-cost.md)
Entry heading: 2026-10-06 | scope-change | T4 (TASK-354) and T5 (TASK-368): `Layers:` corrected to what was built; the gate found the gap

### Entry SPRINT-116-19

[SPRINT-116-decision-and-ledger-diet.md:19](../../sprint/archive/logs/SPRINT-116-decision-and-ledger-diet.md)
Entry heading: 2026-10-06 | promote | plan locked, governance signed, four members: the TS port ruled first, then three small repairs

### Entry SPRINT-116-147

[SPRINT-116-decision-and-ledger-diet.md:147](../../sprint/archive/logs/SPRINT-116-decision-and-ledger-diet.md)
Entry heading: 2026-10-06 | scope-change | T1 and T2 `Layers:` re-spelled in the token forms `check-layers-observed` reads (system-verify finding)

### Entry SPRINT-117-41

[SPRINT-117-reports-lead.md:41](../../sprint/archive/logs/SPRINT-117-reports-lead.md)
Entry heading: 2026-10-06 | progress | T1 built inline (`118973e`): the three skills' boundary reports lead with the verdict

### Entry SPRINT-118-108

[SPRINT-118-prove-the-run.md:108](../../sprint/archive/logs/SPRINT-118-prove-the-run.md)
Entry heading: 2026-10-07 | scope-change | T1 Layers corrected to the files actually changed; three review commits re-worded with `Task: T1`

### Entry SPRINT-118-119

[SPRINT-118-prove-the-run.md:119](../../sprint/archive/logs/SPRINT-118-prove-the-run.md)
Entry heading: 2026-10-07 | progress | system verify at `9f42c01`: `QA-CHECK: 316 pass, 2 fail`, both from the Layers correction itself

### Entry SPRINT-118-155

[SPRINT-118-prove-the-run.md:155](../../sprint/archive/logs/SPRINT-118-prove-the-run.md)
Entry heading: 2026-10-07 | scope-change | T1 Layers gains TASK-320's own member file; `~/lf-run` pre-flight gate `308 pass, 3 fail`, all three now fixed

### Entry SPRINT-118-165

[SPRINT-118-prove-the-run.md:165](../../sprint/archive/logs/SPRINT-118-prove-the-run.md)
Entry heading: 2026-10-07 | progress | T2 pre-run review: one fix before fire (commit-subject form), applied to the trigger text

### Entry SPRINT-118-212

[SPRINT-118-prove-the-run.md:212](../../sprint/archive/logs/SPRINT-118-prove-the-run.md)
Entry heading: 2026-10-07 | progress | integrated-tree gate `322 pass, 4 fail` at `ba123b0`; two fixed, two kept under an owner ruling; T3 closed, T4 rides this session's `/handoff`

### Entry SPRINT-120-194

[SPRINT-120-conform-to-our-own-standard.md:194](../../sprint/archive/logs/SPRINT-120-conform-to-our-own-standard.md)
Entry heading: 2026-10-09 | scope-change | T5 cites the history examples its re-ruling entry quoted; §11's definition moves out of the table row

### Entry SPRINT-121-19

[SPRINT-121-cover-what-is-open.md:19](../../sprint/archive/logs/SPRINT-121-cover-what-is-open.md)
Entry heading: 2026-10-10 | promote | plan locked at `4d82a8f`, governance signed, seven members: give every open item a home, run as EPIC-015 Dogfood 1

### Entry SPRINT-121-156

[SPRINT-121-cover-what-is-open.md:156](../../sprint/archive/logs/SPRINT-121-cover-what-is-open.md)
Entry heading: 2026-10-10 | scope-change | T1, T2, T4, T5, T6 `Layers:` gain their own member-file paths; members re-declared J1 to match the Plan (system-verify findings)

### Entry SPRINT-122-137

[SPRINT-122-finish-epic-015.md:137](../../sprint/archive/logs/SPRINT-122-finish-epic-015.md)
Entry heading: 2026-10-10 | scope-change | T1 and T2 Layers gain their member files at both locations (layers-observed, the SPRINT-118 route)

### Entry SPRINT-122-150

[SPRINT-122-finish-epic-015.md:150](../../sprint/archive/logs/SPRINT-122-finish-epic-015.md)
Entry heading: 2026-10-10 | progress | VPS pre-flight: probe allowed the run's commands and denied the control; gate `286 pass, 2 fail`, both mine, fixed

### Entry SPRINT-122-159

[SPRINT-122-finish-epic-015.md:159](../../sprint/archive/logs/SPRINT-122-finish-epic-015.md)
Entry heading: 2026-10-10 | progress | T2 fired: vehicle run AUTHORITY_BOUNDARY, 1 repair, 1 park; merged `29cefb66`; every claim checked against artifacts

### Entry SPRINT-124-143

[SPRINT-124-close-epic-015-and-cut-the-engine.md:143](../../sprint/archive/logs/SPRINT-124-close-epic-015-and-cut-the-engine.md)
Entry heading: 2026-10-12 | system-verify | QA_FULL green on the integrated tree after one fix (283 pass, 0 fail)

### Entry SPRINT-125-98

[SPRINT-125-consumer-maturity-and-cleanup.md:98](../../sprint/archive/logs/SPRINT-125-consumer-maturity-and-cleanup.md)
Entry heading: 2026-10-18 | merge | wave A merged on an integration worktree, `--no-ff` per task (T1 → T5 → T6 → T8); main fast-forwarded to `a5ba6204`

### Entry SPRINT-125-228

[SPRINT-125-consumer-maturity-and-cleanup.md:228](../../sprint/archive/logs/SPRINT-125-consumer-maturity-and-cleanup.md)
Entry heading: 2026-10-18 | system-verify | QA_FULL on the VPS at `d1dc165b`: 295 pass, 4 fail — close blocked (ADR-021)

### Entry SPRINT-127-196

[SPRINT-127-plans-without-git.md:196](../../sprint/archive/logs/SPRINT-127-plans-without-git.md)
Entry heading: 2026-10-18 | system-verify | QA_FULL on the VPS at `9f7b1305`: **QA-CHECK: 299 pass, 1 fail**, rc 1 — scope-change leg

### Entry SPRINT-129-89

[SPRINT-129-honest-review-and-tests.md:89](../../sprint/archive/logs/SPRINT-129-honest-review-and-tests.md)
Entry heading: 2026-10-19 | surprise | system verify (VPS, 69ef053d) 300 pass · 4 fail: the review records were prose, not the structured line

### Entry SPRINT-131-146

[SPRINT-131-check-the-contract-first.md:146](../../sprint/archive/logs/SPRINT-131-check-the-contract-first.md)
Entry heading: 2026-10-19 | gate | system verify FAIL (2 attribution findings) → owner ruling: fixed-and-rerun; 4 commit subjects rewritten

### Entry SPRINT-132-159

[SPRINT-132-expertise-without-the-plugin.md:159](../../sprint/archive/logs/SPRINT-132-expertise-without-the-plugin.md)
Entry heading: 2026-10-20 | gate | system verify FAIL (layers-token-matches-nothing) → owner ruling: fixed-and-rerun

### Entry SPRINT-132-188

[SPRINT-132-expertise-without-the-plugin.md:188](../../sprint/archive/logs/SPRINT-132-expertise-without-the-plugin.md)
Entry heading: 2026-10-20 | gate | post-close: the final-tree gate FAILed `epic-state` → owner ruling: the row goes inline, plus TD-261

### Entry SPRINT-133-54

[SPRINT-133-name-the-failing-edit.md:54](../../sprint/archive/logs/SPRINT-133-name-the-failing-edit.md)
Entry heading: 2026-10-20 | gate | system verify FAIL (layers observed) → owner ruling: Layers scope-change and rerun

### Entry SPRINT-133-64

[SPRINT-133-name-the-failing-edit.md:64](../../sprint/archive/logs/SPRINT-133-name-the-failing-edit.md)
Entry heading: 2026-10-20 | gate | system verify rerun FAIL (scope-change layers) → owner ruling: add the fragment to T1 Cites, file TD-263, rerun

### Entry SPRINT-134-74

[SPRINT-134-three-families.md:74](../../sprint/archive/logs/SPRINT-134-three-families.md)
Entry heading: 2026-10-20 | gate | system verify FAIL (review-depth-governance-absent) → the owed T3 review was run, not the classification downgraded

### Entry SPRINT-135-108

[SPRINT-135-checks-that-mean-it.md:108](../../sprint/archive/logs/SPRINT-135-checks-that-mean-it.md)
Entry heading: 2026-10-21 | gate | system verify FAIL (prose-density) → owner ruling: split the line and rerun

### Entry SPRINT-137-57

[SPRINT-137-no-quiet-passes.md:57](../../sprint/archive/logs/SPRINT-137-no-quiet-passes.md)
Entry heading: 2026-10-23 | scope-change | T3 (TASK-480): § Plan T3's Acceptance reworded so the layers-completeness leg stops reading `pre-T1` as task T1

### Entry SPRINT-137-105

[SPRINT-137-no-quiet-passes.md:105](../../sprint/archive/logs/SPRINT-137-no-quiet-passes.md)
Entry heading: 2026-10-24 | scope-change | T3 (TASK-480): § Plan T3 Cites: gains the layers-completeness checker the 2026-10-23 entry names

### Entry SPRINT-137-113

[SPRINT-137-no-quiet-passes.md:113](../../sprint/archive/logs/SPRINT-137-no-quiet-passes.md)
Entry heading: 2026-10-24 | gate | system verify PASS 302/0 (VPS, e98a7e34)

### Entry SPRINT-138-134

[SPRINT-138-validation-where-work-happens.md:134](../../sprint/archive/logs/SPRINT-138-validation-where-work-happens.md)
Entry heading: 2026-10-24 | scope-change | T1, T3: `Layers:` gain the emitter-column harness, which the real run proved both must touch

### Entry SPRINT-138-197

[SPRINT-138-validation-where-work-happens.md:197](../../sprint/archive/logs/SPRINT-138-validation-where-work-happens.md)
Entry heading: 2026-10-24 | progress | T3 (TASK-484): local cost measured on this host before `dispatch.md` names the command on main

### Entry SPRINT-138-208

[SPRINT-138-validation-where-work-happens.md:208](../../sprint/archive/logs/SPRINT-138-validation-where-work-happens.md)
Entry heading: 2026-10-24 | scope-change | T7 (TASK-488): `Layers:` gain the research measurement log the brief allowed

### Entry SPRINT-139-418

[SPRINT-139-humanize-every-writing-job.md:418](../../sprint/archive/logs/SPRINT-139-humanize-every-writing-job.md)
Entry heading: 2026-10-25 | gate | system verify RED on the first run: 317 pass, 3 fail (VPS, `149471cc`, via `scripts/gate-remote.ts`)

### Entry SPRINT-140-270

[SPRINT-140-anti-slop-where-the-work-happens.md:270](../../sprint/archive/logs/SPRINT-140-anti-slop-where-the-work-happens.md)
Entry heading: 2026-10-25 | gate | system verify run 1 FAIL (326/1) at 821c6791; owner ruling R5: reword "TODO" to "to-do" in the code-slop box

### Entry SPRINT-141-122

[SPRINT-141-roster-drift-and-the-adopter-pin.md:122](../../sprint/archive/logs/SPRINT-141-roster-drift-and-the-adopter-pin.md)
Entry heading: 2026-10-25 | scope-change | T1 and T3 Cites gain the paths their two earlier scope-change entries name (system verify 315/1)

### Entry SPRINT-143-80

[SPRINT-143-what-the-codex-pipeline-taught.md:80](../../sprint/archive/logs/SPRINT-143-what-the-codex-pipeline-taught.md)
Entry heading: 2026-10-26 | progress | T1 done: an uncertain write is read back before it is retried (TASK-513)

### Entry SPRINT-144-145

[SPRINT-144-wire-the-milestone-cut-the-cost.md:145](../../sprint/archive/logs/SPRINT-144-wire-the-milestone-cut-the-cost.md)
Entry heading: 2026-10-26 | scope-change | T1 and T4 add their review/ member paths to Layers (system-verify finding)

### Entry SPRINT-145-86

[SPRINT-145-keep-the-terms-recast-the-list.md:86](../../sprint/archive/logs/SPRINT-145-keep-the-terms-recast-the-list.md)
Entry heading: 2026-10-27 | scope-change | T1 and T2 drop their unused review/ member paths from Layers (system-verify finding)

### Entry SPRINT-146-89

[SPRINT-146-say-what-they-saw.md:89](../../sprint/archive/logs/SPRINT-146-say-what-they-saw.md)
Entry heading: 2026-10-28 | surprise | system verify red on the VPS: two coordinator misses, both fixed

### Entry SPRINT-147-104

[SPRINT-147-first-trial-first-slice.md:104](../../sprint/archive/logs/SPRINT-147-first-trial-first-slice.md)
Entry heading: 2026-10-29 | scope-change | T1 -- the emitter-column population leg needs an out-of-scope rule for evals/ab/

### Entry SPRINT-147-132

[SPRINT-147-first-trial-first-slice.md:132](../../sprint/archive/logs/SPRINT-147-first-trial-first-slice.md)
Entry heading: 2026-10-29 | surprise | system verify red on three coordinator misses, all in text written today; fixed in place per L-176

### Entry SPRINT-148-63

[SPRINT-148-rules-protocol-and-a-whole-gate.md:63](../../sprint/archive/logs/SPRINT-148-rules-protocol-and-a-whole-gate.md)
Entry heading: 2026-10-29 | execute | T3 done -- gate-remote runs and judges both declared stages (TASK-531, TD-279 resolved)

### Entry SPRINT-148-95

[SPRINT-148-rules-protocol-and-a-whole-gate.md:95](../../sprint/archive/logs/SPRINT-148-rules-protocol-and-a-whole-gate.md)
Entry heading: 2026-10-29 | execute | T2 done -- the D9 two-phase trial protocol on the fixture repo (TASK-542)

### Entry SPRINT-149-62

[SPRINT-149-cap-the-intake-review-rounds.md:62](../../sprint/archive/logs/SPRINT-149-cap-the-intake-review-rounds.md)
Entry heading: 2026-10-30 | progress | T1 -- placement committed and reviewed in one Codex round; boxes 1 and 2 ticked

### Entry SPRINT-151-90

[SPRINT-151-s0-answers-tasks-arms-judges.md:90](../../sprint/archive/logs/SPRINT-151-s0-answers-tasks-arms-judges.md)
Entry heading: 2026-10-30 | scope-change | T7 -- the harness files the signed design named join T7's `Layers:`

### Entry SPRINT-151-105

[SPRINT-151-s0-answers-tasks-arms-judges.md:105](../../sprint/archive/logs/SPRINT-151-s0-answers-tasks-arms-judges.md)
Entry heading: 2026-10-30 | scope-change | T5 -- the root TypeScript config joins T5's `Layers:` to exclude the stored A/B tasks

### Entry SPRINT-151-157

[SPRINT-151-s0-answers-tasks-arms-judges.md:157](../../sprint/archive/logs/SPRINT-151-s0-answers-tasks-arms-judges.md)
Entry heading: 2026-10-30 | progress | revise · T8 -- independent wave review R1 NOT CLEAR on six Highs; one bounded builder retry fired

### Entry SPRINT-152-300

[SPRINT-152-s0-freeze-and-baseline.md:300](../../sprint/archive/logs/SPRINT-152-s0-freeze-and-baseline.md)
Entry heading: 2026-11-01 | progress | close system verify: 4 FAIL on the VPS, 3 fixed, 1 owner-overridden

### Entry SPRINT-153-304

[SPRINT-153-s1-discovery-profile.md:304](../../sprint/archive/logs/SPRINT-153-s1-discovery-profile.md)
Entry heading: 2026-11-01 | progress | close: system verify red on four of 349, three fixed, one ruled by the owner

### Entry SPRINT-153-315

[SPRINT-153-s1-discovery-profile.md:315](../../sprint/archive/logs/SPRINT-153-s1-discovery-profile.md)
Entry heading: 2026-11-01 | scope-change | T6: conformance-engine.sh joins T6's Cites (named by the review note under the T6 entry)

### Entry SPRINT-154-189

[SPRINT-154-a2-migrate-arm.md:189](../../sprint/archive/logs/SPRINT-154-a2-migrate-arm.md)
Entry heading: 2026-11-02 | progress | close system verify: 3 FAIL on the VPS, all fixed; then 1 FAIL (stale index), fixed

### Entry SPRINT-155-100

[SPRINT-155-consumer-docs-codex-built.md:100](../../sprint/archive/logs/SPRINT-155-consumer-docs-codex-built.md)
Entry heading: 2026-11-01 | progress | VPS gate green at `afba08a9` after two gate fixes; T3 done (TASK-562 box 2 ticked)

### Entry SPRINT-155-150

[SPRINT-155-consumer-docs-codex-built.md:150](../../sprint/archive/logs/SPRINT-155-consumer-docs-codex-built.md)
Entry heading: 2026-11-02 | progress | close system verify: 2 FAIL on the VPS, both fixed; TD-285 filed

### Entry SPRINT-156-179

[SPRINT-156-lean-flow-habits-a4a.md:179](../../sprint/archive/logs/SPRINT-156-lean-flow-habits-a4a.md)
Entry heading: 2026-11-02 | review | T1, T2: owed scoped reviews, run at close after the system verify named them absent

### Entry SPRINT-159-110

[SPRINT-159-work-types-and-bug-items.md:110](../../sprint/archive/logs/SPRINT-159-work-types-and-bug-items.md)
Entry heading: 2026-11-02 | progress | T2: typed work items and the bug item landed; VPS gate 472/0; TASK-591 done

### Entry SPRINT-160-71

[SPRINT-160-s3-bundle-3.md:71](../../sprint/archive/logs/SPRINT-160-s3-bundle-3.md)
Entry heading: 2026-11-02 | progress | T4 done: the storm copy left the repo; T1 and T2 skill text landed; their development batch running

### Entry SPRINT-160-131

[SPRINT-160-s3-bundle-3.md:131](../../sprint/archive/logs/SPRINT-160-s3-bundle-3.md)
Entry heading: 2026-11-03 | progress | system verify green after two close-time fixes; every member in done/

### Entry SPRINT-161-95

[SPRINT-161-s4-final-arm-and-release.md:95](../../sprint/archive/logs/SPRINT-161-s4-final-arm-and-release.md)
Entry heading: 2026-11-03 | scope-change | T2: Layers widened to the reference-delta research note and the knowledge index

### Entry SPRINT-163-59

[SPRINT-163-standards-and-negative-scenarios.md:59](../../sprint/archive/logs/SPRINT-163-standards-and-negative-scenarios.md)
Entry heading: 2026-11-04 | progress | T2 and T3 built by Codex and landed (`3ea9b762`, `3e2ea838`); the gate's three findings fixed (`ae92652c`)

### Entry SPRINT-163-93

[SPRINT-163-standards-and-negative-scenarios.md:93](../../sprint/archive/logs/SPRINT-163-standards-and-negative-scenarios.md)
Entry heading: 2026-11-06 | progress | T3 consumer proofs run in two rounds; the gate's three findings fixed

### Entry SPRINT-165-67

[SPRINT-165-side-handoff-and-conformance-line.md:67](../../sprint/archive/logs/SPRINT-165-side-handoff-and-conformance-line.md)
Entry heading: 2026-11-07 | scope-change | T1 cites the ledger, because the gate read the earlier entry's path as undeclared

### Entry SPRINT-165-70

[SPRINT-165-side-handoff-and-conformance-line.md:70](../../sprint/archive/logs/SPRINT-165-side-handoff-and-conformance-line.md)
Entry heading: 2026-11-07 | surprise | two close-time gate failures on `4d97cb53`, both on the coordinator's side of the brief

### Entry SPRINT-166-64

[SPRINT-166-evidence-backed-diagrams.md:64](../../sprint/archive/logs/SPRINT-166-evidence-backed-diagrams.md)
Entry heading: 2026-11-08 | correction | gate red on `2c8017eb`: commit subjects and consequence lines

### Entry SPRINT-166-73

[SPRINT-166-evidence-backed-diagrams.md:73](../../sprint/archive/logs/SPRINT-166-evidence-backed-diagrams.md)
Entry heading: 2026-11-08 | progress | T2 (TASK-619) done: 5 of 5 boxes

### Entry SPRINT-167-41

[SPRINT-167-grant-scope-and-token-room.md:41](../../sprint/archive/logs/SPRINT-167-grant-scope-and-token-room.md)
Entry heading: 2026-11-08 | scope-change | T2 Cites line records the satellites its Done-when cites

### Entry SPRINT-167-44

[SPRINT-167-grant-scope-and-token-room.md:44](../../sprint/archive/logs/SPRINT-167-grant-scope-and-token-room.md)
Entry heading: 2026-11-08 | build | T1 and T2 built, reviewed, probed and merged

### Entry SPRINT-168-83

[SPRINT-168-jev-first-use-and-check.md:83](../../sprint/archive/logs/SPRINT-168-jev-first-use-and-check.md)
Entry heading: 2026-11-08 | system-verify | gate red at close: 493 pass, 3 fail; bun test 589/0

### Entry SPRINT-169-57

[SPRINT-169-jev-as-a-cheap-ab-judge.md:57](../../sprint/archive/logs/SPRINT-169-jev-as-a-cheap-ab-judge.md)
Entry heading: 2026-11-08 | surprise | system verify red on one coordinator miss in the Log, fixed in place per L-176

### Entry SPRINT-170-619

[SPRINT-170-agent-roles-rows-4b-to-9.md:619](../../sprint/archive/logs/SPRINT-170-agent-roles-rows-4b-to-9.md)
Entry heading: 2026-11-10 | scope-change | close-time record fixes: T1 consequence line, T3 and T4 Cites

### Entry SPRINT-171-63

[SPRINT-171-finish-epic-024.md:63](../../sprint/archive/logs/SPRINT-171-finish-epic-024.md)
Entry heading: 2026-11-10 | scope-change | T4: cite session-cost.ts after the prune

### Entry SPRINT-171-101

[SPRINT-171-finish-epic-024.md:101](../../sprint/archive/logs/SPRINT-171-finish-epic-024.md)
Entry heading: 2026-11-10 | progress | T1 built, reviewed and landed: scripts/trials

### Entry SPRINT-171-113

[SPRINT-171-finish-epic-024.md:113](../../sprint/archive/logs/SPRINT-171-finish-epic-024.md)
Entry heading: 2026-11-10 | progress | T5 built: trial replication protocol and EPIC-024 D17

### Entry SPRINT-171-216

[SPRINT-171-finish-epic-024.md:216](../../sprint/archive/logs/SPRINT-171-finish-epic-024.md)
Entry heading: 2026-11-10 | scope-change | T1 and T6: close-gate findings on undeclared paths

### Entry SPRINT-171-220

[SPRINT-171-finish-epic-024.md:220](../../sprint/archive/logs/SPRINT-171-finish-epic-024.md)
Entry heading: 2026-11-10 | correction | consequence lines in the strict vocabulary

### Entry SPRINT-171-227

[SPRINT-171-finish-epic-024.md:227](../../sprint/archive/logs/SPRINT-171-finish-epic-024.md)
Entry heading: 2026-11-10 | review | T5 owed pass; close-gate rulings

### Entry SPRINT-171-233

[SPRINT-171-finish-epic-024.md:233](../../sprint/archive/logs/SPRINT-171-finish-epic-024.md)
Entry heading: 2026-11-10 | scope-change | T6 Cites: the oracle keys named by R2

### Scratch rules and verification

Helpers under census-input/ are scratch for coordinator review and removal. history.ts and classifications.ts retain the archive searches and adjudicated findings. retry.ts reads the prior draft, preserves T2 columns, applies the review rulings, groups repeated evidence and audits the written documents.

`bun --no-env-file census-input/history.ts index` — 1,800 dated entries across 124 standalone logs and 46 older embedded files; existing entries.json and candidate text retained.
`bun --no-env-file census-input/history.ts hits <row-id>` searches aliases; `search <regex>` broadens selection; `read SPRINT-NNN:line` reads a complete cited entry.

`bun --no-env-file census-input/retry.ts build` writes only the two census documents. `bun --no-env-file census-input/retry.ts verify` compares the written inventory against HEAD and checks every history destination and count.

### Coordinator rulings after review

Review round 2 (scoped Sonnet) raised two items; the review cap was reached, so the coordinator settled them, 2026-11-11.
- **H52 → keep (fixture of G1671).** G1671 prints no verdict, but the conformance summary line it covers stays. H52 is its only test, so the fixture-coupling rule keeps it.
- **H01, H02, H22, H45, H46 → cut (borderline, owner rules).** Each is the only retained proof of a rule that shipped skills state for adopters: layout detection in seven SKILL.md files (H01), migrate's v1→v2 mapping (H02), the run-mode aliases kept so an installed trigger does not break (H22), and the work-store readers and writers (H45, H46).
  ADR-050 calls a check consequential when its false negative would reach an adopter, which covers these. Its listed examples (an engine rule, a script an adopter runs) do not, and T2's consumer flags used the examples. Whether a proof of shipped skill text counts as a consumer guard is the owner's ruling at T4, so none of the five is cut by default.
- New totals: 25 keep / 19 keep (fixture) / 17 keep (unknown) / 21 cut / 8 cut (with) / 6 cut (borderline) / 7 n/a = 103.

Negative predicate: any ruling beginning cut AND (real defects > 0 OR either history cell contains unknown OR consumer guard is yes OR its harness checker path appears in a kept G row's fixture cell). This reads the written table, including cut (with) and cut (borderline).

Negative-check command (run after all four ruling corrections):
```powershell
bun --no-env-file census-input/retry.ts negative
```
Literal result:
```text
[]
```

<!-- T3 verification results -->

| Command / audit | Result |
|---|---|
| `bun --no-env-file census-input/retry.ts verify` | PASS: 103 unique rows; seven T2 columns unchanged; consumer flags 23 yes / 80 no; 103 histories reachable and independently recounted; fixture map agrees under a second selection. |
| Group and evidence audit | PASS: 64 zero-search rows and 46 shared-harness rows; all distinct findings, 188 cited entries and prior T1/T2 evidence preserved. |
| Negative controls | All four detected: real defect, unknown, consumer guard, fixture of a kept check. Written-table negative result is the literal empty array above. |
| `bun --no-env-file census-input/render-history.ts search-audit` | PASS: 103 literal rg searches; 1,800 raw dated headings = 1,800 parsed entries; 188 citation headings match disk. |
| `bun --no-env-file scripts/lib/check-prose-density.ts docs/research/process-cost-census.md` | 1 pass, 0 fail; 0 lines over 400 characters. |
| `bun --no-env-file scripts/lib/check-prose-density.ts docs/research/logs/process-cost-census.md` | 1 pass, 0 fail; 0 lines over 400 characters. |
| `bun --no-env-file scripts/lib/check-doc-caps.ts` | Exit 0; no FAIL; decision doc 108/130 lines. Existing retained/FROZEN dispositions unchanged. |
| `git diff --stat -- scripts evals skills spec test` | Empty. |
| `git diff --check` | Exit 0; no whitespace errors. |

Appendix: 2,307 → 2,159 lines after review corrections and compaction. Decision doc: 105 → 108 lines. The 41 ruling-label changes are reflected in the inventory and every history destination.

Coordinator owns review, index regeneration, integrated gate, scratch removal and commit. This worker changed only the two tracked census documents; no sprint file, Execution Log, member tick or task status was written.
