---
sprint: 127
slug: plans-without-git
epic: EPIC-022
owner: Maintainer
last_updated: 2026-10-18
status: closed
plan_commit: c861a339
close_commit: 2c34f34
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
Cites: `TASK-441` · ADR-054 (T2) · ADR-045 D6 (status moves) · `night-run.md` · `migration-map.md` (named as out of scope, read only)

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
| `templates/TASK.md.template`, `task-file.md`, `docs/work/README.md`, `orchestrator/SKILL.md`, `README.md`, `run-v1-to-v2-fixtures.ts` | T1 | task-level `gates_signed` + `## Approved design`; `plansDirectory` as a MAY | Low | v1-to-v2 101/0 · git-less scratch, owner popup · Codex R1→R2 |
| `docs/adr/ADR-054-…`, `DECISIONS.md`, `knowledge-index.md`, `spec/STANDARD.md` · `spec/CHANGELOG.md` (0.18.0) | T2 | the git-less freeze; the S9.GATESWELLFORMED behaviour change recorded | **Med** (spec semantics) | conformance A/B · Codex R1→R2 |
| `conformance-engine.sh`, `run-gates-signed-fixtures.sh`, `sprint-by-reference.md`, `lean-doc-generator/SKILL.md`, `SPRINT.md.template`, `dispatch.md`, `triage/SKILL.md`, both READMEs | T3 | no-git forms of every lifecycle step; date form accepted only without git | **Med** (engine rule an adopter gates on) | seeds M1–M3 (M1 re-seeded) · git-less scratch lifecycle · Codex R1→R2 |
| `scripts/lib/tick-box.ts`, `run-tick-box-fixtures.ts`, `qa-check.sh` (one list entry), `dispatch.md` rule 5 | T4 | the tick step runs the gate's own checkers | Low | must-FAIL + control · sanity break · real run |
| workdoo (outside this repo): `docs/product/roadmap.md`, `docs/work/done/TASK-046-…` | T5 | the consumer exercise | Low | cells diffed · sha256 · seeded coverage control |
| `.claude/CONTEXT.md`, `docs/architecture/overview.md` | close | doc-freshness (owner) | Low | caps · prose-density |
| 4 manifests, README footer, `CHANGELOG.md`, `docs/changelog/CHANGELOG-2.6.0.md` | close | release 2.8.0 | Low | lockstep PASS · rotation diffed verbatim |

## Retro

**Retrieval check** — yes, three promoted rules recurred. **L-224** in a new mode: every per-write re-check used the gate's own
checker, but only in its default mode, and the gate also runs it with `--scope-change`, which reads the log. A scope-change entry
that named two files as out of scope FAILed system verify (299/1). **L-166**: tick-box's first real run skipped its checks because
the stamp regex took `127` while members carry `SPRINT-127`, and the fixtures used the shape the author expected. **L-219**: a
bare `cd` into the T3 worktree for an independent re-seed made the harness adopt it; T4 then ran in the main tree, so nothing
branched from a stale tip.

**Cost** — coordinator + 3 builders (T1 · T3 · T4) + one Codex reviewer across 6 rounds (`gpt-6-astra`; the account rejects the
default model, so `--model` is now explicit). Sub-agent spend ≈ 0.34M tokens (T1 79k · T3 129k · T4 94k · Codex ~39k) for 5
members ≈ 68k per member. T2 and T5 ran inline. Two `QA_FULL` runs on the VPS (299/1, then 300/0).

**Worked**
- Recon before G2 found three gaps in the frozen Plan: A3 was only half true, the engine FAILed the planned date form, and README
  named the freeze. All three were ruled in the G2 popup round, and none surfaced mid-build.
- Codex found a real gap in every shipped task. The task-level field read as mandatory (T2), the date lacked its no-git qualifier
  (T1), and two close/triage sentences stayed git-only (T3). Each was fixed in one round, and R2 was CLEAR every time.
- The second query earned its keep twice on the coordinator's own work. A status census by a different route showed every workdoo
  row as `planned`, and `cmp` showed an independent M1 seed had not landed.
- T5 ran on the consumer itself and returned two findings the scratch runs could not: the duplicated sequence, and workdoo's pinned
  2.5.0.

**Friction**
- System verify failed once, on a log entry. The scope-change checker reads every path a scope-change body names, the out-of-scope
  ones included, which is SPRINT-126's Cites friction again, now at the cost of a gate run.
- A status-move commit carried `sprint(127) T2:` and leg 15 reddened on `done/`; moves are coordinator commits (CONTEXT § Sprint
  model). Caught locally.
- Host memory pressure reaped the local waiter for the VPS gate; the remote run was unaffected.

**Pattern candidate** (surface to user → `docs/LEARNINGS.md`)
- None new: all three are sightings of promoted rules (L-224 ×7 · L-166 · L-219), bumped at this close. L-224's new mode is now
  half-automated: tick-box covers ticks, but a log write still needs `--scope-change` re-run by hand.

**Owner actions**
- Push `main` (release 2.8.0 is committed, not pushed).
- workdoo: bump its pinned lean-flow to 2.8.0 / spec 0.18.0, so its own `/prime` reports roadmap coverage (finding F2).
- 8 leftover agent worktrees under `.claude/worktrees/` were kept for review: `a08b86` and `aed338` are locked; `a5535`, `a8ac44` and
  `ac3204` hold unmerged commits; `a8cc1f`, `a8d190` and `ace6ce` hold uncommitted files.
