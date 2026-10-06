---
sprint: 116
slug: decision-and-ledger-diet
epic: EPIC-014
owner: Maintainer
last_updated: 2026-10-06
status: closed
plan_commit: d6bc35c
gates_signed: G1,G2 @ 8e14bb4
update_trigger: sprint execute/close events
---

# SPRINT-116 — Decision + Ledger Diet

> **Theme:** the process records have outgrown the product: 138 open debt rows against 6 resolved, and 14 of the oldest turn
> on one undecided question, whether the frozen 10,802-line TypeScript port is finished or cut. Rule that first, so the
> ledger's engine-shaped rows have a direction. Then clear three small repairs the last three Retros filed. The aging pass
> at this promote already resolved 12 of the 42 oldest rows (`TECH-DEBT.md`, SPRINT-116 sweep).

## Scope

**In:** the cut-or-finish ruling on EPIC-014's TypeScript port, landed either way, with TD-168's owner named in the ruling
(`399`) · the stale references to SPRINT-113's cut guards reworded to history (`400`) · `check-handoff-state.sh`'s archive
exemption made a declaration the guard reads, or the site converted (`346`) · the Codex review loop leaving a `review ·`
record line (`401`).

**Out (deferred):** carrying out a *finish* ruling (the port itself, `TASK-393`, is its own sprint) · the 30 aged rows
kept open at this promote · `CHANGELOG.md` rotation (§11 keeps 2.0.x + 1.66.x inline; it fires at 2.1.0) · EPIC-015's
unattended run (`TASK-319` / `320` / `188`) · TASK-321 (summary lead) · workdoo SPRINT-009 and EPIC-018/019/020 (other repo,
run outside this sprint) · any `git push` (owner-reserved).

## Members

- docs/work/todo/TASK-399-decide-the-ts-engine-port-cut-or-finish.md
- docs/work/todo/TASK-400-sweep-stale-references-to-the-cut-guards.md
- docs/work/todo/TASK-346-rule-check-handoff-state-shs-archive-glob-convert-it-or-record-the-exemption-where-the-guard-reads-it.md
- docs/work/todo/TASK-401-name-the-codex-loop-in-the-review-record.md

## Plan

### T1 — Rule the TS engine port: cut it or finish it `[size: S · risk: med · class: decision · HITL · J2]`
Layers: `docs/epic/EPIC-014-reference-engine.md` · `TECH-DEBT.md` (TD-168 owner · the DEPENDS-399 rows) · `docs/work/backlog/` (TASK-393's priority, or a new P1 task for TD-168)
  · if *cut*: `docs/adr/ADR-NNN-<slug>.md` · `docs/DECISIONS.md` · `packages/` · `apps/` · `test/` · `package.json` · `tsconfig.json`
  · `tsconfig.base.json` · `bunfig.toml` · `scripts/qa-check.sh` · `docs/architecture/overview.md` · `.claude/CLAUDE.md` · `.claude/CONTEXT.md` · `README.md`
  · scope-change 2026-10-06: `docs/adr/ADR-051-the-typescript-port-is-retired.md` · `docs/adr/ADR-038-composed-multi-family-rule-dispatch.md`
  · `docs/adr/ADR-039-section-4-differential-parity-is-opt-in.md` · `docs/epic/INDEX.md` 
  · `docs/work/backlog/TASK-393-port-the-conformance-engine-to-typescript.md` · `docs/work/cancel/TASK-393-port-the-conformance-engine-to-typescript.md` · `evals/run-s4-ts-evaluators.sh`
  · `evals/run-s4-differential-parity.sh` · `evals/typecheck-population.test.ts`  · `evals/epic-archive-differential.test.ts`
  · `evals/layers-completeness.test.ts` · `evals/run-doc-caps-differential.ts` · `evals/run-dod-delta-fixtures.sh`
  · `evals/run-epic-archive-fixtures.sh`  · `evals/run-layers-completeness-fixtures.sh` · `evals/run-night-run-rollup-differential-parity.ts`
  · `evals/run-adr-family-fixtures.sh` (scope-change: Codex R1, empty-slug case)
Depends-on: none
Cites: `TASK-399` · EPIC-014 D2 · ADR-039 · ADR-050 · `docs/research/guard-audit-rest.md` (K01) · TD-168 · the SPRINT-116 aging sweep

The port is 72 files with 32 tests that only `bun test` runs, and it has not changed since 2026-08-29. The Shell engine keeps
authority (D2). Keeping it frozen leaves the question parked and 14 ledger rows undirected. Owner-reserved (J2). The size is
**S for a *finish* ruling, M for a *cut*** (the deletion lands here, through ADR-050 clause 2), so G1 re-sizes it once the
direction is known.

**Acceptance:** EPIC-014 records the ruling. *Finish* names a next step and a date. *Cut* is an ADR naming what is deleted and
what replaces the E04/P5 parity coverage, and the gate is green with the deletion landed. Either way, TD-168 names its new owner.

### T2 — Sweep stale references to the cut guards `[size: S · risk: low · class: mechanical-ingest · AFK · J1]`
Layers: `evals/fixtures/boundary-rows/` (7 READMEs) · `evals/fixtures/judgement-only-retry/README.md` · `evals/fixtures/layers-completeness/synthetic.ts` · `evals/run-emitter-column-fixtures.ts` · `scripts/lib/check-layers-completeness.ts` · `scripts/lib/check-layers-observed.ts`
Depends-on: none
Cites: `TASK-400` · TASK-398 · ADR-050 · SPRINT-113 T1 census (archived Execution Log) · `evals/fixtures/layers-completeness/sprint-041-reconstructed.md` (fixture data, unchanged)

About 12 live references still point at files SPRINT-113 deleted. `evals/fixtures/layers-completeness/sprint-041-reconstructed.md`
names them as fixture data and must not change.

**Acceptance:** `git grep` of the 10 deleted basenames returns only history (archive text, fixture data, or "cut at SPRINT-113").

### T3 — Rule `check-handoff-state.sh`'s archive exemption `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `scripts/lib/check-handoff-state.sh` · `scripts/qa-check.sh` (the member names it `qa-check.sh`; leg 10b allow-list)
Depends-on: T1 (both may touch `scripts/qa-check.sh`; D1)
Cites: `TASK-346` · TD-145 · SPRINT-099 T3 · L-151

Tier G, maintainer-only (ADR-050: must-FAIL fixture plus one run on the real artifact). The exemption's reason is sound: the site
*maps* a Plan path to its log, it doesn't *exclude*. But it lives as a comment inside a regex two files away from the guard.

**Acceptance:** either `check-handoff-state.sh:145` calls `lf_is_archived_path`, or its exemption is a declaration leg 10b reads,
and a seeded unexempted site reddens leg 10b.

### T4 — Name the Codex loop in the review record `[size: S · risk: low · class: execution · AFK · J1]`
Layers: `skills/orchestrator/references/review-scoping.md` · `skills/orchestrator/references/night-run.md` (Part 4 depth vocabulary) · `skills/orchestrator/references/dispatch.md` (only if it carries a review-loop step)
  · `scripts/lib/check-review-depth.sh` (the member names it `check-review-depth.sh`; only if the regex changes) · `evals/run-review-depth-fixtures.sh` · `evals/fixtures/review-depth/`
Depends-on: none
Cites: `TASK-401` · L-225 · L-151 · L-058 · SPRINT-114 close Retro

Changes shipped skill references, so the Codex review loop applies (owner rule, SPRINT-113 promote). SPRINT-114's release gate
read `313 pass, 7 fail`, all `review-depth-*-absent`, because no step said to record a Codex loop that ended CLEAR.

**Acceptance:** the procedure says to append the `review · Tn · …` line whenever any review loop closes. One external-reviewer
depth is named (not two), and a Codex-CLEAR prose entry with no record line reddens the review-depth fixture.

## Owner-action checklist
- [ ] T1: the cut-or-finish ruling itself (J2).

## Decisions (pre-locked)
- **D1** — `scripts/qa-check.sh` is shared by T1 (only on *cut*) and T3. Owner: T1 lands first, and T3 rebases onto it. T3 depends on T1 for this file only.
- **D2** — 12 of the 42 oldest TD rows were resolved at this promote (owner-approved): `TECH-DEBT.md` § SPRINT-116 sweep. The
  `CHANGELOG.md` rotation proposed alongside them was withdrawn: §11 keeps the current and previous minor inline.

## Assumptions
- **A1** — The 10 deleted basenames TASK-400 names still match SPRINT-113's census. *Confirm: re-derive the list from `git show --diff-filter=D` over TASK-398's commits before the sweep (T2).*
- **A2** — T1 does not need `/council`. *Confirm: at G2, ask the owner whether a council run should pressure-test the ruling first.*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-116-decision-and-ledger-diet.md`, created lazily at the first entry (ADR-014).

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `packages/` · `apps/` · 31 `test/` files · `evals/run-s4-ts-evaluators.sh` · `evals/run-s4-differential-parity.sh` | T1 | deleted: the retired TypeScript port and its parity pair (ADR-051) | Med | system verify 320/0 |
| `docs/adr/ADR-051-the-typescript-port-is-retired.md` · ADR-038 · ADR-039 status · `docs/DECISIONS.md` | T1 | the retirement decision; superseded ADRs marked | Low | owner acceptance |
| `scripts/qa-check.sh` | T1 · T3 | §4 Shell harness always-on; parity pair removed (T1); leg 10b exempts only `archive-path.sh` (T3) | Med | 58 harnesses listed = `ls evals/run-*`; leg 10b seeded red |
| `evals/run-adr-family-fixtures.sh` | T1 | `empty-slug` case + per-rule assertions the TS test held (Codex R1/R2) | Low | all green; two seeded breaks reddened one case each |
| `package.json` · `tsconfig.json` · `bunfig.toml` · `evals/typecheck-population.test.ts` + 7 harness comments | T1 | workspaces and `apps`/`packages` globs dropped; references reworded | Low | tsc exit 0; typecheck-population 7/0 |
| `README.md` · `docs/architecture/overview.md` · `.claude/CONTEXT.md` | T1 | no live claim about the port; README's install claim corrected | Low | Codex R2/R3 |
| `docs/epic/EPIC-014-reference-engine.md` · `docs/epic/INDEX.md` | T1 | closed as retired; six conditions dropped, not met | Low | epic-archive check at close |
| `TECH-DEBT.md` · `docs/work/backlog/TASK-404-…` · `docs/work/cancel/TASK-393-…` | promote · T1 | 25 rows resolved (12 + 13), TD-168 → TASK-404, the finish path cancelled | Low | census 146/116/30 |
| `scripts/lib/check-handoff-state.sh` | T3 | Plan → log mapping through `lf_is_archived_path` | Low | output identical; fixtures green |
| `skills/orchestrator/references/review-scoping.md` · `night-run.md` · `evals/fixtures/review-depth/codex-clear-*` · harness | T4 | a closing review loop records its `review ·` line; an external reviewer records as `scoped-reviewer` | Low | cases 19/20; control seeded red; Codex CLEAR |
| 8 fixture READMEs · `run-emitter-column-fixtures.ts` · `check-layers-{completeness,observed}.ts` | T2 | stale references to SPRINT-113's cut guards reworded to history | Low | 9/0 · 25/0 · 13/0 |

## Retro

**Retrieval check** — yes, once. L-229 (the checkers read the Plan's `Layers:`, never the Log) was loaded and followed for every widening, yet
system verify still found 105 "undeclared" files: the Plan *did* carry them, spelled `packages/**`, which `covers()` does not read. A
different route past the same reader → L-229 count 2. L-230 (take a duration from the run's own clock) and L-170 (derive ids with
worktrees excluded; treat 9xx as fixture tokens) were applied and held.

**Cost** — coordinator inline (gates, ADR, T3, close) plus 10 dispatched agents, ≈ 708k subagent tokens (as each agent reported it): TD-sweep reader (Sonnet) 161k ·
T1 recon (Explore, Sonnet) 142k · T1 builder (Sonnet) 141k · T2 builder (Haiku) 86k · T4 builder (Sonnet) 72k · five Codex passes 19–24k each
(≈ 106k). Delivered: 4 of 4 members, so ≈ 177k per member. Two VPS gate runs at 106 s each, by the runs' own clocks.

**Worked**
- Asking the cut-or-finish question first gave 14 ledger rows a direction; 13 resolved the moment the cut landed.
- Recon before deletion paid off. It found §4's only default coverage inside the port, so the replacement was ruled before any file moved.
- The Codex loop earned its rounds: R1 and R2 found real lost assertions that the recon, the ADR and the owner's acceptance had all passed.
- T4's new rule fired on its own sprint: system verify flagged T1's missing `review ·` line until the loop closed.

**Friction**
- I proposed a CHANGELOG rotation that was not due (it needs the next MINOR). The owner approved it, and I caught it only when I read the
  v2.0.0 rotation file before applying. I had read the trigger and not its last firing.
- An ad-hoc age filter mis-parsed `Sprint-1NN` as ≤ 90. A second count with a different selector disagreed and caught it before the brief went out.
- Codex's sandbox could not read files at all in R3 (not only spawns), so the review needed the diff pasted in.
- The local gate poller was reaped for low host memory, so the verdict was read afterwards from the VPS's own `gate.rc`.
- Tick evidence on a wrapped `## Done when` box tripped the freeze check (TD-229).

**Pattern candidate** (surface to user → `docs/LEARNINGS.md`)
- L-231: a test suite's coverage is its assertions, not its fixtures. Enumerate rule × fixture × verdict before deleting one.
- L-229 now count 2, due for promotion at the next promote.
