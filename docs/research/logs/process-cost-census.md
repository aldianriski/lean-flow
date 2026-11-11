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
| G0043 | bootstrap archive predicate @ 43 | no | `scripts/qa-check.sh` | `archive-predicate: shared predicate not found at <diagnostic>` (C) | `none` | no: maintainer bootstrap; engine has its own guard | T3 | T3 | T3 |
| G0052 | profile instrumentation @ 52 | no | `scripts/qa-check.sh` | none (no verdict; see leg description) | `none` | no: optional measurements; no verdict | T3 | T3 | T3 |
| G0093 | budget default @ 93 | no | `scripts/lib/check-qa-budget-default.sh` | `qa-budget-default: <diagnostic>`; `qa-budget-default-arg: <diagnostic>` (C); `qa-budget-default-not-found: <diagnostic>` (C); `qa-budget-default-exceeds-ceiling: <diagnostic>` (C) | `evals/run-qa-budget-default-fixtures.sh` | no: maintainer gate only | T3 | T3 | T3 |
| G0147 | budget checkpoint function @ 147 | no | `scripts/lib/qa-budget-check.sh` | `qa-check-budget-exceeded-early: <diagnostic>` (C) | `evals/run-qa-budget-position-fixtures.sh` | no: maintainer runtime guard | T3 | T3 | T3 |
| G0169 | 1 @ 169 | no | `scripts/lib/check-doc-caps.ts` | `cap <diagnostic>`; `doc-caps: <diagnostic>` | `evals/run-doc-caps-fixtures.sh` | no: maintainer gate only | T3 | T3 | T3 |
| G0209 | 2 @ 209 | yes | `scripts/lib/check-count-claims.sh` | `count claims: <diagnostic>` (C); `count-claims: <diagnostic>` (C); `skills: <diagnostic>`; `tmpl-core: <diagnostic>`; `tmpl-total: <diagnostic>`; `qa.md non-core claim: <diagnostic>` | `evals/run-count-claims-fixtures.sh` | no: maintainer gate only | T3 | T3 | T3 |
| G0234 | 2b @ 234 | yes | `scripts/lib/check-epic-archive.ts` | `epic archive: <diagnostic>` (C); `epic-archive: <diagnostic>`; `epic-state: <diagnostic>` | `evals/run-epic-archive-fixtures.sh` | no: maintainer gate only | T3 | T3 | T3 |
| G0268 | 2b-ter (no section header) @ 268 | yes | `scripts/lib/check-prose-density.ts` | `prose density: <diagnostic>` (C); `prose-density: <diagnostic>` | `evals/run-prose-density-fixtures.ts` | no: maintainer gate only | T3 | T3 | T3 |
| G0297 | 2b-bis @ 297 | yes | `scripts/lib/check-handoff-state.sh` | `handoff state: <diagnostic>` (C); `handoff-state: <diagnostic>` | `evals/run-handoff-state-fixtures.sh` | no: maintainer gate only | T3 | T3 | T3 |
| G0324 | 2c @ 324 | yes | `scripts/lib/check-research-archive.sh` | `research archive: <diagnostic>` (C); `research-archive: <diagnostic>` | `evals/run-research-archive-fixtures.sh` | no: maintainer gate only | T3 | T3 | T3 |
| G0348 | 2d @ 348 | yes | `scripts/lib/check-ephemeral-intake.sh` | `ephemeral intake: <diagnostic>` (C); `ephemeral-intake: <diagnostic>` | `evals/run-ephemeral-intake-fixtures.sh` | no: maintainer gate only | T3 | T3 | T3 |
| G0372 | 2e @ 372 | yes | `scripts/lib/check-task-origin.sh` | `task origin: <diagnostic>` (C); `task-origin: <diagnostic>` | `evals/run-task-origin-fixtures.sh` | no: maintainer gate only | T3 | T3 | T3 |
| G0396 | 2e-bis @ 396 | yes | `scripts/lib/check-work-type.ts` | `work type: <diagnostic>` (C); `work-type: <diagnostic>` (C); `work-type <diagnostic>`; `work-type-unknown <diagnostic>` (C); `bug-item-missing-repro <diagnostic>` (C); `debt-item-missing-td <diagnostic>` (C) | `evals/run-work-type-fixtures.sh` | no: maintainer gate only | T3 | T3 | T3 |
| G0416 | 2f-bis (fold-in record) @ 416 | yes | `scripts/qa-check.sh` | none (no verdict; see leg description) | `none` | no: record only; §13 consumer guard is G0435 | T3 | T3 | T3 |
| G0435 | 2f-ter @ 435 | yes | `scripts/lib/conformance-engine.sh` | N0435a, N0435b, N0435c, N0435d, N0435e, N0435f, N0435g, N0435h, N0435i, N0435j | `evals/run-conformance-engine-fixtures.sh` | yes (a): engine dispatch at `scripts/lib/conformance-engine.sh:3503`; entry at `conformance.sh:17` | T3 | T3 | T3 |
| G0468 | TD-084 profiling comment @ 468 | no | `scripts/qa-check.sh` | none (no verdict; see leg description) | `none` | no: comment inside G0435, no separate check | T3 | T3 | T3 |
| G0567 | 2g @ 567 | yes | `scripts/lib/check-night-run-rollup.ts` | `night-run rollup: <diagnostic>` (C); `night-run rollup <diagnostic>` (C) | `evals/run-night-run-rollup-fixtures.sh` | no: record reader only (`skills/orchestrator/references/night-run.md:671`); no engine call | T3 | T3 | T3 |
| G0636 | 2b (review depth) @ 636 | yes | `scripts/lib/check-review-depth.sh` | N0636a, N0636b | `evals/run-review-depth-fixtures.sh` | no: record reader only (`skills/orchestrator/references/review-scoping.md:209`); no engine call | T3 | T3 | T3 |
| G0672 | 2c-bis @ 672 | yes | `scripts/lib/check-verify-reaches.ts` | `verify reaches: <diagnostic>` (C); `verify reaches <diagnostic>` (C); `verify-reaches: <diagnostic>` (C); `verify-member-resolution-empty: <diagnostic>` (C); `verify-method-absent: <diagnostic>` (C); `verify-method-unresolvable: <diagnostic>` (C); `verify-does-not-reach-target: <diagnostic>` (C) | `evals/run-verify-reaches-fixtures.sh` | no: host-local checker example (`skills/orchestrator/SKILL.md:51`), not an adopter script step; no engine call | T3 | T3 | T3 |
| G0708 | 3 @ 708 | yes | `scripts/qa-check.sh` | `frontmatter <diagnostic>`; `ownership <diagnostic>` | `none` | no: maintainer gate only | T3 | T3 | T3 |
| G0733 | 4 @ 733 | yes | `scripts/qa-check.sh; scripts/gen-index.sh` | N0733a, N0733b | `evals/run-learnings-metadata-fixtures.ts; evals/run-gen-index-locale-fixtures.ts` | no: `skills/lean-doc-generator/SKILL.md:76` requires the host index generator; `gen-index.sh` is explicitly lean-flow's own example, not an adopter script step | T3 | T3 | T3 |
| G0901 | 5 retired @ 901 | no | `scripts/qa-check.sh` | none (retired) | `none` | no: retired | T3 | T3 | T3 |
| G0905 | 6 @ 905 | yes | `scripts/qa-check.sh` | `README footer version <diagnostic>` | `none` | yes (c): README footer version lint | T3 | T3 | T3 |
| G0917 | 6b @ 917 | no | `scripts/lib/check-manifest-lockstep.sh` | `manifest lockstep: <diagnostic>` | `evals/run-manifest-lockstep-fixtures.sh` | yes (c): manifest lockstep | T3 | T3 | T3 |
| G0941 | 7 retired @ 941 | no | `scripts/qa-check.sh` | none (retired) | `none` | no: retired | T3 | T3 | T3 |
| G0944 | 8 retired @ 944 | no | `scripts/qa-check.sh` | none (retired) | `none` | no: retired | T3 | T3 | T3 |
| G0947 | 9 @ 947 | yes | `scripts/qa-check.sh` | `QA.md hand-written cap snapshot found <diagnostic>` (C); `QA.md hygiene <diagnostic>` | `none` | no: maintainer gate only | T3 | T3 | T3 |
| G0959 | 10 @ 959 | yes | `scripts/qa-check.sh` | `L-NNN citations under skills/ resolve or are labeled <diagnostic>`; `L-NNN citation unresolved: <diagnostic>` (C) | `none` | no: maintainer gate only | T3 | T3 | T3 |
| G0985 | 10b @ 985 | yes | `scripts/qa-check.sh` | `archive-predicate: no raw archive exclusion <diagnostic>`; `archive-predicate: <count> site(s) carry a raw archive exclusion <diagnostic>` (C) | `none` | no: maintainer gate only | T3 | T3 | T3 |
| G1015 | 11 @ 1015 | yes | `scripts/qa-check.sh` | `<sprint> ### T<task> schema complete <diagnostic>`; `<sprint> ### T<task> missing: <diagnostic>` (C) | `none` | no: maintainer gate only | T3 | T3 | T3 |
| G1055 | 11b @ 1055 | no | `scripts/qa-check.sh; node_modules/.bin/tsc` | `typecheck: <diagnostic>` | `evals/run-typecheck-population-fixtures.ts` — population only (never runs tsc on a failing input) | no: maintainer gate only | T3 | T3 | T3 |
| G1094 | 12 wiring and budget @ 1094 | yes | `scripts/qa-check.sh` | `qa-check-budget-exceeded: <diagnostic>` (C); `eval harness <unlisted>: in evals/ but neither gated <diagnostic>` (C) | `evals/run-qa-budget-position-fixtures.sh (budget); none (registry)` | no: maintainer harness registry | T3 | T3 | T3 |
| G1384 | 13 @ 1384 | no | `scripts/qa-check.sh` | `headless park-record cue <diagnostic>` | `none` | no: maintainer gate only | T3 | T3 | T3 |
| G1407 | 14 @ 1407 | no | `scripts/lib/check-layers-completeness.ts` | `layers completeness <diagnostic>`; `layers completeness: <diagnostic>` (C) | `evals/run-layers-completeness-fixtures.sh` | no: maintainer gate only | T3 | T3 | T3 |
| G1447 | 14-a @ 1447 | no | `scripts/lib/check-sprint-by-reference.ts --scope-change` | `scope-change layers <diagnostic>`; `scope-change layers: <diagnostic>` (C) | `evals/run-by-reference-fixtures.ts` | yes (a): direct call at `scripts/lib/conformance-engine.sh:2266`; `--scope-change` mode is local | T3 | T3 | T3 |
| G1474 | 14-bis @ 1474 | no | `scripts/lib/check-authority.ts` | `authority <diagnostic>`; `authority: <diagnostic>` (C) | `evals/run-authority-fixtures.sh` | no: record reader only (`skills/orchestrator/references/night-run.md:551`); no engine call | T3 | T3 | T3 |
| G1511 | 14-ter @ 1511 | no | `scripts/lib/check-approval-envelope.sh` | `approval envelope <diagnostic>` (C); `approval envelope: <diagnostic>` (C) | `evals/run-approval-envelope-fixtures.sh` | no: record reader only (`skills/orchestrator/references/night-run.md:229`); no engine call | T3 | T3 | T3 |
| G1544 | 15 @ 1544 | no | `scripts/lib/check-layers-observed.ts` | `layers observed <diagnostic>`; `layers observed: <diagnostic>` (C) | `evals/run-layers-observed-test-fixtures.ts` | no: maintainer gate only | T3 | T3 | T3 |
| G1597 | 16 @ 1597 | no | `scripts/lib/check-dod-delta.ts` | `dod-delta <diagnostic>`; `dod-delta: <diagnostic>` (C) | `evals/run-dod-delta-fixtures.sh` | no: maintainer gate only | T3 | T3 | T3 |
| G1640 | actual runtime @ 1640 | no | `scripts/lib/qa-budget-check.sh` | `qa-runtime: <diagnostic>`; `qa-runtime-over-ceiling: <diagnostic>` (C) | `evals/run-qa-budget-fixtures.sh` | no: maintainer invocation ceiling | T3 | T3 | T3 |
| G1671 | summary @ 1671 | no | `scripts/qa-check.sh` | none (no verdict; see leg description) | `evals/run-conformance-line-fixtures.ts` | no: tally/conformance count, no PASS/FAIL/INFO name | T3 | T3 | T3 |
| H01 | 12 always @ 1094 | no: inside 12 | `evals/run-layout-fixtures.ts` | `eval harness run-layout-fixtures.ts <diagnostic>` | `evals/run-layout-fixtures.ts` | no: maintainer fixture/tooling | T3 | T3 | T3 |
| H02 | 12 always @ 1094 | no: inside 12 | `evals/run-v1-to-v2-fixtures.ts` | `eval harness run-v1-to-v2-fixtures.ts <diagnostic>` | `evals/run-v1-to-v2-fixtures.ts` | no: maintainer fixture/tooling | T3 | T3 | T3 |
| H03 | 12 always @ 1094 | no: inside 12 | `evals/run-epic-archive-fixtures.sh` | `eval harness run-epic-archive-fixtures.sh <diagnostic>` | `evals/epic-archive.test.ts` | no: maintainer fixture/tooling | T3 | T3 | T3 |
| H04 | 12 always @ 1094 | no: inside 12 | `evals/run-typecheck-population-fixtures.ts` | `eval harness run-typecheck-population-fixtures.ts <diagnostic>` | `evals/typecheck-population.test.ts` — population only (never runs tsc on a failing input) | no: maintainer fixture/tooling | T3 | T3 | T3 |
| H05 | 12 always @ 1094 | no: inside 12 | `evals/run-emitter-column-fixtures.ts` | `eval harness run-emitter-column-fixtures.ts <diagnostic>` | `evals/run-emitter-column-fixtures.ts` | yes (a): engine missing-predicate check at `scripts/lib/conformance-engine.sh:76` | T3 | T3 | T3 |
| H06 | 12 always @ 1094 | no: inside 12 | `evals/run-sprint-log-layout-fixtures.sh` | `eval harness run-sprint-log-layout-fixtures.sh <diagnostic>` | `evals/run-sprint-log-layout-fixtures.sh` | no: maintainer fixture/tooling | T3 | T3 | T3 |
| H07 | 12 always @ 1094 | no: inside 12 | `evals/run-authority-fixtures.sh` | `eval harness run-authority-fixtures.sh <diagnostic>` | `evals/authority.test.ts` | no: maintainer fixture/tooling | T3 | T3 | T3 |
| H08 | 12 always @ 1094 | no: inside 12 | `evals/run-prose-density-fixtures.ts` | `eval harness run-prose-density-fixtures.ts <diagnostic>` | `evals/run-prose-density-fixtures.ts` | no: maintainer fixture/tooling | T3 | T3 | T3 |
| H09 | 12 always @ 1094 | no: inside 12 | `evals/run-qa-budget-default-fixtures.sh` | `eval harness run-qa-budget-default-fixtures.sh <diagnostic>` | `evals/run-qa-budget-default-fixtures.sh` | no: maintainer fixture/tooling | T3 | T3 | T3 |
| H10 | 12 always @ 1094 | no: inside 12 | `evals/run-ephemeral-intake-fixtures.sh` | `eval harness run-ephemeral-intake-fixtures.sh <diagnostic>` | `evals/run-ephemeral-intake-fixtures.sh` | no: maintainer fixture/tooling | T3 | T3 | T3 |
| H11 | 12 always @ 1094 | no: inside 12 | `evals/run-task-origin-fixtures.sh` | `eval harness run-task-origin-fixtures.sh <diagnostic>` | `evals/run-task-origin-fixtures.sh` | no: maintainer fixture/tooling | T3 | T3 | T3 |
| H12 | 12 always @ 1094 | no: inside 12 | `evals/run-work-type-fixtures.sh` | `eval harness run-work-type-fixtures.sh <diagnostic>` | `evals/run-work-type-fixtures.sh` | no: maintainer fixture/tooling | T3 | T3 | T3 |
| H13 | 12 always @ 1094 | no: inside 12 | `evals/run-worktree-usability-fixtures.sh` | `eval harness run-worktree-usability-fixtures.sh <diagnostic>` | `evals/run-worktree-usability-fixtures.sh` | yes (b): run the usability snippet, `skills/orchestrator/references/night-run-checks.md:185` (snippet at 190) | T3 | T3 | T3 |
| H14 | 12 always @ 1094 | no: inside 12 | `evals/run-skill-freshness-fixtures.sh` | `eval harness run-skill-freshness-fixtures.sh <diagnostic>` | `evals/run-skill-freshness-fixtures.sh` | yes (b): run the freshness snippet, `skills/orchestrator/references/night-run-checks.md:59` (snippet at 65) | T3 | T3 | T3 |
| H15 | 12 always @ 1094 | no: inside 12 | `evals/run-sprint-family-spec-reduction-fixtures.ts` | `eval harness run-sprint-family-spec-reduction-fixtures.ts <diagnostic>` | `evals/run-sprint-family-spec-reduction-fixtures.ts` | no: tests the harness's spec reduction (`evals/run-sprint-family-spec-reduction-fixtures.ts:1`), not an engine-executed check or adopter step | T3 | T3 | T3 |
| H16 | 12 always @ 1094 | no: inside 12 | `evals/run-count-claims-fixtures.sh` | `eval harness run-count-claims-fixtures.sh <diagnostic>` | `evals/run-count-claims-fixtures.sh` | no: maintainer fixture/tooling | T3 | T3 | T3 |
| H17 | 12 always @ 1094 | no: inside 12 | `evals/run-manifest-lockstep-fixtures.sh` | `eval harness run-manifest-lockstep-fixtures.sh <diagnostic>` | `evals/run-manifest-lockstep-fixtures.sh` | yes (c): manifest lockstep | T3 | T3 | T3 |
| H18 | 12 always @ 1094 | no: inside 12 | `evals/run-dod-delta-fixtures.sh` | `eval harness run-dod-delta-fixtures.sh <diagnostic>` | `evals/dod-delta.test.ts` | no: maintainer fixture/tooling | T3 | T3 | T3 |
| H19 | 12 always @ 1094 | no: inside 12 | `evals/run-sprint-close-fixtures.sh` | `eval harness run-sprint-close-fixtures.sh <diagnostic>` | `evals/run-sprint-close-fixtures.sh` | no: maintainer fixture/tooling | T3 | T3 | T3 |
| H20 | 12 always @ 1094 | no: inside 12 | `evals/run-research-archive-fixtures.sh` | `eval harness run-research-archive-fixtures.sh <diagnostic>` | `evals/run-research-archive-fixtures.sh` | no: maintainer fixture/tooling | T3 | T3 | T3 |
| H21 | 12 always @ 1094 | no: inside 12 | `evals/run-qa-budget-fixtures.sh` | `eval harness run-qa-budget-fixtures.sh <diagnostic>` | `evals/run-qa-budget-fixtures.sh` | no: maintainer fixture/tooling | T3 | T3 | T3 |
| H22 | 12 always @ 1094 | no: inside 12 | `evals/run-run-mode-fixtures.sh` | `eval harness run-run-mode-fixtures.sh <diagnostic>` | `evals/run-run-mode-fixtures.sh` | no: local launcher resolver; adopter substitutes their own trigger (`skills/orchestrator/references/night-run.md:15`) | T3 | T3 | T3 |
| H23 | 12 always @ 1094 | no: inside 12 | `evals/run-doc-caps-fixtures.sh` | `eval harness run-doc-caps-fixtures.sh <diagnostic>` | `evals/doc-caps.test.ts` | no: maintainer fixture/tooling | T3 | T3 | T3 |
| H24 | 12 always @ 1094 | no: inside 12 | `evals/run-git-availability-fixtures.sh` | `eval harness run-git-availability-fixtures.sh <diagnostic>` | `evals/run-git-availability-fixtures.sh` | yes (a): engine git probe at `scripts/lib/conformance-engine.sh:143` | T3 | T3 | T3 |
| H25 | 12 always @ 1094 | no: inside 12 | `evals/run-gen-index-locale-fixtures.ts` | `eval harness run-gen-index-locale-fixtures.ts <diagnostic>` | `evals/run-gen-index-locale-fixtures.ts` | no: maintainer fixture/tooling | T3 | T3 | T3 |
| H26 | 12 always @ 1094 | no: inside 12 | `evals/run-layers-completeness-fixtures.sh` | `eval harness run-layers-completeness-fixtures.sh <diagnostic>` | `evals/layers-completeness.test.ts` | no: maintainer fixture/tooling | T3 | T3 | T3 |
| H27 | 12 always @ 1094 | no: inside 12 | `evals/run-revise-loop-ceiling-fixtures.sh` | `eval harness run-revise-loop-ceiling-fixtures.sh <diagnostic>` | `evals/run-revise-loop-ceiling-fixtures.sh` | no: local launcher retry ceiling; adopter substitutes their own trigger (`skills/orchestrator/references/night-run.md:15`) | T3 | T3 | T3 |
| H28 | 12 always @ 1094 | no: inside 12 | `evals/run-approval-envelope-fixtures.sh` | `eval harness run-approval-envelope-fixtures.sh <diagnostic>` | `evals/run-approval-envelope-fixtures.sh` | no: envelope record reader only (`skills/orchestrator/references/night-run.md:229`); no engine call | T3 | T3 | T3 |
| H29 | 12 always @ 1094 | no: inside 12 | `evals/run-gates-signed-fixtures.sh` | `eval harness run-gates-signed-fixtures.sh <diagnostic>` | `evals/run-gates-signed-fixtures.sh` | yes (a): engine S9 gates checks at `scripts/lib/conformance-engine.sh:987`, 1038; dispatch at 3503 | T3 | T3 | T3 |
| H30 | 12 always @ 1094 | no: inside 12 | `evals/run-spec-reader-fixtures.sh` | `eval harness run-spec-reader-fixtures.sh <diagnostic>` | `evals/run-spec-reader-fixtures.sh` | yes (a): engine calls the spec reader at `scripts/lib/conformance-engine.sh:208` | T3 | T3 | T3 |
| H31 | 12 always @ 1094 | no: inside 12 | `evals/run-handoff-state-fixtures.sh` | `eval harness run-handoff-state-fixtures.sh <diagnostic>` | `evals/run-handoff-state-fixtures.sh` | no: maintainer fixture/tooling | T3 | T3 | T3 |
| H32 | 12 always @ 1094 | no: inside 12 | `evals/run-review-depth-fixtures.sh` | `eval harness run-review-depth-fixtures.sh <diagnostic>` | `evals/run-review-depth-fixtures.sh` | no: review-depth record reader only (`skills/orchestrator/references/review-scoping.md:209`); no engine call | T3 | T3 | T3 |
| H33 | 12 always @ 1094 | no: inside 12 | `evals/run-system-verify-fixtures.sh` | `eval harness run-system-verify-fixtures.sh <diagnostic>` | `evals/run-system-verify-fixtures.sh` | no: maintainer fixture/tooling | T3 | T3 | T3 |
| H34 | 12 always @ 1094 | no: inside 12 | `evals/run-s2-placement-fixtures.sh` | `eval harness run-s2-placement-fixtures.sh <diagnostic>` | `evals/run-s2-placement-fixtures.sh` | yes (a): engine S2 placement checks at `scripts/lib/conformance-engine.sh:1940`, 1978; dispatch at 3503 | T3 | T3 | T3 |
| H35 | 12 always @ 1094 | no: inside 12 | `evals/run-night-run-rollup-fixtures.sh` | `eval harness run-night-run-rollup-fixtures.sh <diagnostic>` | `evals/run-night-run-rollup-fixtures.sh` | no: rollup record reader only (`skills/orchestrator/references/night-run.md:671`); no engine call | T3 | T3 | T3 |
| H36 | 12 always @ 1094 | no: inside 12 | `evals/run-reap-terminal-fixtures.sh` | `eval harness run-reap-terminal-fixtures.sh <diagnostic>` | `evals/run-reap-terminal-fixtures.sh` | no: local launcher terminal reaper; adopter substitutes their own trigger (`skills/orchestrator/references/night-run.md:15`) | T3 | T3 | T3 |
| H37 | 12 always @ 1094 | no: inside 12 | `evals/run-ownership-header-fixtures.sh` | `eval harness run-ownership-header-fixtures.sh <diagnostic>` | `evals/run-ownership-header-fixtures.sh` | yes (a): engine S1/S3 checks at `scripts/lib/conformance-engine.sh:1309`, 1354, 1412, 1440; dispatch at 3503 | T3 | T3 | T3 |
| H38 | 12 always @ 1094 | no: inside 12 | `evals/run-verify-reaches-fixtures.sh` | `eval harness run-verify-reaches-fixtures.sh <diagnostic>` | `evals/run-verify-reaches-fixtures.sh` | no: host-local reachability checker example (`skills/orchestrator/SKILL.md:51`), not an adopter script step; no engine call | T3 | T3 | T3 |
| H39 | 12 always @ 1094 | no: inside 12 | `evals/run-adr-family-fixtures.sh` | `eval harness run-adr-family-fixtures.sh <diagnostic>` | `evals/run-adr-family-fixtures.sh` | yes (a): engine S4 checks at `scripts/lib/conformance-engine.sh:1535`, 1604, 1643, 1680, 1742; dispatch at 3503 | T3 | T3 | T3 |
| H40 | 12 always @ 1094 | no: inside 12 | `evals/run-night-run-gate-exception-fixtures.sh` | `eval harness run-night-run-gate-exception-fixtures.sh <diagnostic>` | `evals/run-night-run-gate-exception-fixtures.sh` | no: local launcher gate exception; adopter substitutes their own trigger and gate (`skills/orchestrator/references/night-run.md:15`) | T3 | T3 | T3 |
| H41 | 12 always @ 1094 | no: inside 12 | `evals/run-night-run-outcome-fixtures.sh` | `eval harness run-night-run-outcome-fixtures.sh <diagnostic>` | `evals/run-night-run-outcome-fixtures.sh` | no: local launcher outcome reaper; adopter substitutes their own trigger (`skills/orchestrator/references/night-run.md:15`) | T3 | T3 | T3 |
| H42 | 12 always @ 1094 | no: inside 12 | `evals/run-foreign-repo-fixtures.sh` | `eval harness run-foreign-repo-fixtures.sh <diagnostic>` | `evals/run-foreign-repo-fixtures.sh` | yes (a): consumer entry `conformance.sh:17` executes engine; engine dispatch at `scripts/lib/conformance-engine.sh:3503` | T3 | T3 | T3 |
| H43 | 12 always @ 1094 | no: inside 12 | `evals/run-dispatch-preflight-fixtures.sh` | `eval harness run-dispatch-preflight-fixtures.sh <diagnostic>` | `evals/run-dispatch-preflight-fixtures.sh` | yes (b): run preflight snippet, `skills/orchestrator/references/dispatch.md:134` (snippet at 140) | T3 | T3 | T3 |
| H44 | 12 always @ 1094 | no: inside 12 | `evals/run-conformance-engine-fixtures.sh` | `eval harness run-conformance-engine-fixtures.sh <diagnostic>` | `evals/run-conformance-engine-fixtures.sh` | yes (a): engine driver at `scripts/lib/conformance-engine.sh:3503` | T3 | T3 | T3 |
| H45 | 12 always @ 1094 | no: inside 12 | `evals/run-store-readers-fixtures.ts` | `eval harness run-store-readers-fixtures.ts <diagnostic>` | `evals/run-store-readers-fixtures.ts` | no: maintainer fixture/tooling | T3 | T3 | T3 |
| H46 | 12 always @ 1094 | no: inside 12 | `evals/run-store-writers-fixtures.ts` | `eval harness run-store-writers-fixtures.ts <diagnostic>` | `evals/run-store-writers-fixtures.ts` | no: maintainer fixture/tooling | T3 | T3 | T3 |
| H47 | 12 always @ 1094 | no: inside 12 | `evals/run-qa-store-legs-fixtures.ts` | `eval harness run-qa-store-legs-fixtures.ts <diagnostic>` | `evals/run-qa-store-legs-fixtures.ts` | yes (a): engine calls `sprint-members-cli.ts` at `scripts/lib/conformance-engine.sh:2150` | T3 | T3 | T3 |
| H48 | 12 always @ 1094 | no: inside 12 | `evals/run-promote-check-fixtures.ts` | `eval harness run-promote-check-fixtures.ts <diagnostic>` | `evals/run-promote-check-fixtures.ts` | no: maintainer fixture/tooling | T3 | T3 | T3 |
| H49 | 12 always @ 1094 | no: inside 12 | `evals/run-learnings-metadata-fixtures.ts` | `eval harness run-learnings-metadata-fixtures.ts <diagnostic>` | `evals/run-learnings-metadata-fixtures.ts` | no: maintainer fixture/tooling | T3 | T3 | T3 |
| H50 | 12 always @ 1094 | no: inside 12 | `evals/run-tick-box-fixtures.ts` | `eval harness run-tick-box-fixtures.ts <diagnostic>` | `evals/run-tick-box-fixtures.ts` | no: optional host-local tick-tool example (`skills/orchestrator/references/dispatch.md:91`), not an adopter script step; no engine call | T3 | T3 | T3 |
| H51 | 12 always @ 1094 | no: inside 12 | `evals/run-workflow-command-fixtures.ts` | `eval harness run-workflow-command-fixtures.ts <diagnostic>` | `evals/run-workflow-command-fixtures.ts` | no: maintainer fixture/tooling | T3 | T3 | T3 |
| H52 | 12 always @ 1094 | no: inside 12 | `evals/run-conformance-line-fixtures.ts` | `eval harness run-conformance-line-fixtures.ts <diagnostic>` | `evals/run-conformance-line-fixtures.ts` | no: maintainer fixture/tooling | T3 | T3 | T3 |
| H53 | 12 optin @ 1094 | no: inside 12 | `evals/run-work-store-fixtures.ts` | `eval harness run-work-store-fixtures.ts <diagnostic>` | `evals/run-work-store-fixtures.ts` | no: maintainer fixture/tooling | T3 | T3 | T3 |
| H54 | 12 optin @ 1094 | no: inside 12 | `evals/run-layers-observed-test-fixtures.ts` | `eval harness run-layers-observed-test-fixtures.ts <diagnostic>` | `evals/layers-observed.test.ts` | no: maintainer fixture/tooling | T3 | T3 | T3 |
| H55 | 12 optin @ 1094 | no: inside 12 | `evals/run-worktree-base-fixtures.sh` | `eval harness run-worktree-base-fixtures.sh <diagnostic>` | `evals/run-worktree-base-fixtures.sh` | yes (b): run base guard per worktree, `skills/orchestrator/references/dispatch.md:586` (snippet at 589) | T3 | T3 | T3 |
| H56 | 12 optin @ 1094 | no: inside 12 | `evals/run-attestation-fixtures.sh` | `eval harness run-attestation-fixtures.sh <diagnostic>` | `evals/run-attestation-fixtures.sh` | yes (a): engine S13 checks at `scripts/lib/conformance-engine.sh:823`, 853, 869, 894, 939; dispatch at 3503 | T3 | T3 | T3 |
| H57 | 12 optin @ 1094 | no: inside 12 | `evals/run-sprint-family-fixtures.sh` | `eval harness run-sprint-family-fixtures.sh <diagnostic>` | `evals/run-sprint-family-fixtures.sh` | yes (a): engine S9/S10/S11/S12 checks at `scripts/lib/conformance-engine.sh:2189`, 2453, 2694, 3287; dispatch at 3503 | T3 | T3 | T3 |
| H58 | 12 optin @ 1094 | no: inside 12 | `evals/run-qa-budget-position-fixtures.sh` | `eval harness run-qa-budget-position-fixtures.sh <diagnostic>` | `evals/run-qa-budget-position-fixtures.sh` | no: maintainer fixture/tooling | T3 | T3 | T3 |
| H59 | 12 optin @ 1094 | no: inside 12 | `evals/run-doc-caps-differential.ts` | `eval harness run-doc-caps-differential.ts <diagnostic>` | `evals/run-doc-caps-differential.ts` | no: maintainer fixture/tooling | T3 | T3 | T3 |
| H60 | 12 optin @ 1094 | no: inside 12 | `evals/run-night-run-rollup-differential-parity.ts` | `eval harness run-night-run-rollup-differential-parity.ts <diagnostic>` | `evals/run-night-run-rollup-differential-parity.ts` | no: rollup record reader parity (`skills/orchestrator/references/night-run.md:671`); no engine call | T3 | T3 | T3 |
| H61 | 12 optin @ 1094 | no: inside 12 | `evals/run-by-reference-fixtures.ts` | `eval harness run-by-reference-fixtures.ts <diagnostic>` | `evals/run-by-reference-fixtures.ts` | yes (a): engine calls `check-sprint-by-reference.ts` at `scripts/lib/conformance-engine.sh:2266` | T3 | T3 | T3 |
| H62 | 12 optin @ 1094 | no: inside 12 | `evals/run-orchestrator-store-fixtures.ts` | `eval harness run-orchestrator-store-fixtures.ts <diagnostic>` | `evals/run-orchestrator-store-fixtures.ts` | yes (a): engine calls `check-sprint-by-reference.ts` at `scripts/lib/conformance-engine.sh:2266` | T3 | T3 | T3 |

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
