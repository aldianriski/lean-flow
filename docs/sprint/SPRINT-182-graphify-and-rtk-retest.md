---
sprint: 182
slug: graphify-and-rtk-retest
owner: Maintainer
last_updated: 2026-11-20
status: active
plan_commit: f6639005
gates_signed: G1,G2 @ 3ce17ee0
update_trigger: sprint execute/close events
---

# SPRINT-182 — The graphify and RTK Re-test

> **Theme:** Re-test graphify and RTK the way their READMEs intend, on a frozen question set and one workdoo snapshot,
> because the SPRINT-181 tests reached only single-hop questions and the OSS RTK edition. Both verdicts are re-ruled against
> a fixed bar with one shared 8.00 USD cap. It adds no governance machinery, so ADR-053's freeze does not apply, and nothing
> ships without a separate owner ruling.

## Scope

**In:** TASK-676, TASK-677, TASK-678.
**Out (deferred):** TASK-402, 489, 507, 523 and 668 · any skill, hook, manifest or README change · shipping graphify or
RTK (a pass re-files an owner-ruling task) · a global hook of either tool · D:\Project\workdoo.

## Members

- docs/work/todo/TASK-676-build-the-question-set-and-run-harness-for-the-graphify-and-rtk-re-test.md
- docs/work/todo/TASK-677-run-plain-and-graphify-abba-score-blind-and-rule-on-graphify.md
- docs/work/todo/TASK-678-run-rtk-posthook-terse-against-plain-score-blind-and-rule-on-rtk.md

## Plan

### T1 — Build the key-checked question set and the run harness `[size: M · risk: low · class: execution · HITL · J1]`
Layers: `docs/research/graphify-rtk-retest-questions.md` · `docs/research/graphify-rtk-retest-results.md` · `docs/knowledge-index.md`
Depends-on: none
Cites: TASK-676, `docs/research/graphify-workdoo-questions.md`, `docs/research/graphify-workdoo-test.md`
Six questions with an answer key checked by a second pass, a frozen token formula, and a budget-capped probe, all fixed before any arm runs.

**Acceptance:** the fixture and key are committed with their hash recorded, and a smoke run reports USD, tokens and tool calls with the snapshot unchanged.

### T2 — Run plain and graphify ABBA, score blind, rule on graphify `[size: M · risk: med · class: execution · HITL · J2]`
Layers: `docs/research/graphify-workdoo-test.md` · `docs/research/graphify-rtk-retest-results.md` · `docs/knowledge-index.md`
Depends-on: T1
Cites: TASK-677, `docs/research/graphify-rtk-retest-questions.md`
The first test installed no integration and ran no query. This runs the README's query-first use against a plain baseline, scored blind.

**Acceptance:** a graphify verdict against the bar (correctness at least plain, tokens at most 1.0x plain) with spread and USD reported separately, and the snapshot back at baseline.

### T3 — Run RTK posthook and terse against its own plain pair, rule on RTK `[size: M · risk: med · class: execution · HITL · J2]`
Layers: `docs/research/rtk-trial-verdict.md` · `docs/research/graphify-rtk-retest-results.md` · `docs/knowledge-index.md`
Depends-on: T2
Cites: TASK-678, `docs/research/graphify-rtk-retest-questions.md`, `.rtk/pipeline.toml` (the workdoo snapshot's, cited by box 3, never a lean-flow file)
The OSS edition has no pipeline engine, so this installs the full edition apart from it and compares RTK with its own plain runs.

**Acceptance:** an RTK keep, drop or inconclusive verdict against the bar, the probe deleted, and the snapshot back at baseline.

## Decisions (pre-locked)

- **D1** — Three members in three waves, a linear chain (T1, then T2, then T3). The 8.00 USD cap is shared, and T3 may use only what T2 leaves.
- **D2** — Commits: a task commits as `sprint(182) Tn: …`; coordinator writes (moves, ticks, Log, sprint file) commit as bare `sprint(182):`. T1 to T3 share only the generated `docs/knowledge-index.md` and the results file.
- **D3** — The throwaway probe lives in a root-level `retest-probe/` directory, stays uncommitted until TASK-678 closes, then is deleted; no commit carries it, and every coordinator commit stages by explicit path. It is not added to `.gitignore`. The directory sits outside `scripts/`, `test/` and `evals/`, which `tsconfig.json` includes.
- **D4** — Launcher: T1 to T3 start nested headless `claude -p` runs, which the auto-mode classifier denied at SPRINT-165 and SPRINT-180 (L-293). G2 names the launcher and the approval route; a builder stages the proof only.

## Assumptions

- **A1** — `claude -p` JSON reports USD and tokens. *Confirm: T1 smoke run.*
- **A2** — graphify 0.9.103 (owner-upgraded 2026-11-20, newest stable at least 14 days old) installs project-scoped with `graphify install --project`; without the flag it writes `~/.claude`, which is forbidden. *Confirm: T2 install box.*
- **A3** — The full RTK edition with pipelines exists as a stable release at least 14 days old. *Confirm: T3 first box, else the arm reports "not run".*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-182-graphify-and-rtk-retest.md`, rendered from
> `templates/sprint-log.md.template` and created at promote. Append there, never here.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `docs/work/` task moves, `docs/LEARNINGS.md`, `docs/knowledge-index.md` | COORD | Status moves, and L-326 promoted to the host-tooling rule (WHY: count reached 2 at SPRINT-181 close) | Low | gen-index, check-doc-caps |

## Retro
<!-- Written at close. -->
