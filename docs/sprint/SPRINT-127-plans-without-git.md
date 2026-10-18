---
sprint: 127
slug: plans-without-git
epic: EPIC-022
owner: Maintainer
last_updated: 2026-10-18
status: active
plan_commit: c861a339
gates_signed: G1,G2 @ 23299244
update_trigger: sprint execute/close events
---

# SPRINT-127 — Plans Without Git

> **Theme:** EPIC-022's third slice. An approval has to live where the next reader finds it, and a repo without git has to be able
> to run the lifecycle at all. workdoo shows both gaps: it records G1/G2 as prose on one-off tasks and cannot freeze a sprint,
> because `plan_commit` *is* the freeze. This sprint gives a task its own `gates_signed:`, decides and specifies a git-less freeze
> (ADR-054, spec 0.18.0), carries it through the shipped procedures, makes the coordinator's tick step run the gate's own checks,
> and proves the result on workdoo itself.

## Scope

**In:** task-level `gates_signed` + the approved design summary (`439`) · ADR-054 + spec 0.18.0 for the git-less freeze (`440`) ·
the git-less promote/tick/close procedures (`441`) · a tick step that runs the gate's checkers (`438`) · the workdoo exercise (`442`).
**Out (deferred):** an engine rule that reads the git-less snapshot (owner ruling: debt at close) · a plan-mode hook · editing any
settings file · EPIC-022 S4 (planning-checker clusters) · TASK-322 · 366 · 367 · 402.

## Members

- docs/work/todo/TASK-439-record-g1-g2-sign-off-on-a-task-file.md
- docs/work/todo/TASK-440-decide-how-a-repo-without-git-freezes-a-sprint.md
- docs/work/todo/TASK-441-run-the-sprint-lifecycle-without-git.md
- docs/work/todo/TASK-438-make-the-coordinators-tick-step-run-the-gates-checkers.md
- docs/work/todo/TASK-442-exercise-the-plan-support-on-workdoo.md

## Plan

### T1 — Record a G1/G2 sign-off on the task file `[size: M · risk: low · class: execution · HITL · J1]`
Layers: `skills/orchestrator/SKILL.md` · `skills/lean-doc-generator/templates/TASK.md.template`
  · `skills/task-decomposer/references/task-file.md` · `docs/work/README.md` · `README.md`
  · `evals/run-v1-to-v2-fixtures.ts`
  · `docs/work/todo/TASK-439-record-g1-g2-sign-off-on-a-task-file.md`
  · `docs/work/in_progress/TASK-439-record-g1-g2-sign-off-on-a-task-file.md`
Depends-on: none
Cites: `TASK-439` · EPIC-022 Closed-when 5 · L-099 · L-151 · workdoo task prose (read only)

The plan-mode approval decision is in no documented payload, so the procedure writes the record itself, as the sprint field already
does.

**Acceptance:** an approved `mvp` task carries `gates_signed:` and its design summary; an unapproved one carries neither.

### T2 — Decide and specify the git-less freeze `[size: M · risk: med · class: decision · HITL · J2]`
Layers: `docs/adr/` · `docs/DECISIONS.md` · `docs/knowledge-index.md` · `spec/STANDARD.md` · `spec/CHANGELOG.md`
  · `docs/work/todo/TASK-440-decide-how-a-repo-without-git-freezes-a-sprint.md`
  · `docs/work/in_progress/TASK-440-decide-how-a-repo-without-git-freezes-a-sprint.md`
Depends-on: none
Cites: `TASK-440` · EPIC-022 D3 · owner ruling 2026-10-18 (snapshot in the promote log entry) · ADR-047 (the freeze) · ADR-014

This is hard to reverse, because it redefines what the freeze is when there is no git, so it gets an ADR. The spec change must
move no verdict for a repo with git.

**Acceptance:** ADR-054 and spec 0.18.0 say what a git-less repo records at promote, tick and close, and this repo's verdicts are
unchanged.

### T3 — Run the sprint lifecycle without git `[size: M · risk: med · class: execution · HITL · J1]`
Layers: `skills/lean-doc-generator/SKILL.md` · `skills/lean-doc-generator/references/sprint-by-reference.md`
  · `skills/orchestrator/SKILL.md` · `skills/orchestrator/references/dispatch.md` · `skills/triage/SKILL.md`
  · `scripts/lib/conformance-engine.sh` (the plan-frozen note string, and the gates-signed no-git date form)
  · `evals/run-gates-signed-fixtures.sh` · `README.md`
  · `skills/lean-doc-generator/templates/SPRINT.md.template` · `docs/work/README.md`
  · `docs/work/todo/TASK-441-run-the-sprint-lifecycle-without-git.md`
  · `docs/work/in_progress/TASK-441-run-the-sprint-lifecycle-without-git.md`
Depends-on: T1 (`orchestrator/SKILL.md`), T2
Cites: `TASK-441` · ADR-054 (T2) · ADR-045 D6 (status moves)

Every shipped step that says `git mv`, `plan_commit` or `git show` names its git case, and states what to do when there is no git.

**Acceptance:** on a scratch repo with no `.git`, one sprint runs from promote to close by the shipped procedures, and an edit to a
frozen box is caught.

### T4 — Make the tick step run the gate's own checkers `[size: S · risk: low · class: execution · HITL · J2]`
Layers: `scripts/lib/` · `evals/` · `skills/orchestrator/references/dispatch.md` · `scripts/qa-check.sh`
  · `docs/work/todo/TASK-438-make-the-coordinators-tick-step-run-the-gates-checkers.md`
  · `docs/work/in_progress/TASK-438-make-the-coordinators-tick-step-run-the-gates-checkers.md`
Depends-on: T3 (`dispatch.md`)
Cites: `TASK-438` · L-224 (count 6) · ADR-053 (repeated failure) · ADR-050 (Other G) · bare `dispatch.md` as the member spells it

L-224's rule was promoted into the tick step and has still recurred six times, so this sprint makes it mechanical. The script is
lean-flow's own tooling; no adopter step depends on it.

**Acceptance:** a tick whose evidence names an undeclared path exits non-zero with its named finding, and a path-free tick passes.

### T5 — Exercise the plan support on workdoo `[size: S · risk: med · class: execution · HITL · J2]`
Layers: `docs/work/todo/TASK-442-exercise-the-plan-support-on-workdoo.md`
  · `docs/work/in_progress/TASK-442-exercise-the-plan-support-on-workdoo.md`
Depends-on: T1
Cites: `TASK-442` · EPIC-022 Closed-when 8 (as reworded) · L-007 · workdoo (written outside this repo, only with the owner's
  go-ahead at this task's G1)
  · workdoo paths the member names (outside this repo): `docs/product/company-workspace-roadmap.md` · `docs/product/roadmap.md`

This is the consumer itself rather than a scratch copy. Its findings are recorded, never smoothed over.

**Acceptance:** workdoo holds a roadmap rendered from the template and one task signed with `gates_signed`, and `/prime` and
`/triage` there report its coverage.

## Decisions (pre-locked)

- **D1** — Shared files and their order: `skills/orchestrator/SKILL.md` goes T1 → T3; `skills/orchestrator/references/dispatch.md`
  goes T3 → T4. `CHANGELOG.md`, `TECH-DEBT.md`, this file, its log and the member files are coordinator-owned.
- **D2** — Owner rulings at intake (2026-10-18): `gates_signed` goes on the task frontmatter · the procedure writes the design
  summary, and `plansDirectory` is optional and never written by lean-flow · the git-less freeze is a snapshot in the promote entry
  · the engine is untouched apart from one note string · EPIC-022 #8 is reworded to a one-off task, with a sprint optional.

## Assumptions

- **A1** — Without git, `git rev-parse --git-dir` fails, and that failure is the only switch. *Confirm: T3's scratch repo.*
- **A3** — An optional task-frontmatter field trips no store-schema check. *Confirm: at T1's G1, against the engine and the
  v1→v2 harness.*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-127-plans-without-git.md`, created at promote with its `promote` entry
> first. Append there, never here (STANDARD §9 · ADR-014).

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro
