---
sprint: 164
slug: never-run-branches
owner: Maintainer
last_updated: 2026-11-07
status: closed
plan_commit: 9bb225f7
gates_signed: G1,G2 @ a535b273
close_commit: 61adbcea
update_trigger: sprint execute/close events
---

# SPRINT-164 — Run the Never-Run Branches

> **Theme:** SPRINT-163 shipped three branches that no run has ever reached, and TD-294 records them: a drafted standard shown back
> with its undecided checks, a no-scenario draft held at `approve`, and a known-cause bug held at `needs-info`. This sprint runs each
> on a consumer copy through a pinned clone and fixes what the runs expose, so a wrong branch shows here and not on an adopter's repo.

## Scope

**In:** the standards draft-back and `checks: not decided yet` on an operated `init` and `migrate`, with review reading the undecided
entry (TASK-610); `/task-decomposer` holding a no-scenario draft for a fresh approve (TASK-611); `/triage` holding a known-cause bug
whose evidence names no regression, and TD-294's closing state (TASK-612).
**Out (deferred):** a release (fixes stay under `[Unreleased]`); any new guard, checker or gate leg (filed as a TD with its ADR-053
reason); an owner override for a feature with no scenario; TD-295.

## Members

- docs/work/todo/TASK-610-run-a-named-standard-s-draft-back-on-init-and-migrate.md
- docs/work/todo/TASK-611-hold-a-no-scenario-draft-for-a-fresh-approve.md
- docs/work/todo/TASK-612-hold-a-known-cause-bug-with-no-evidence-and-close-td-294.md

## Plan

### T1 — Run the standards draft-back on init and migrate, and fix what it exposes `[size: M · risk: med · class: execution · HITL · J2]`
Layers: `skills/lean-doc-generator/references/migration-map.md` · `README.md` · `CHANGELOG.md` · `TECH-DEBT.md`
Depends-on: none
Cites: TASK-610 · TD-294 · TD-293 · SPRINT-163 T2 · owner rulings 2026-11-06
This is the only slice whose route is unproven, since TD-293's operated migrate stopped at its plan popup, so it runs first. The
before-run shows the branch as shipped; the fix goes into the skill text only if the run exposes a defect.

**Acceptance:** an operated `init` and `migrate` each show the drafted entry back and ask once more; with checks still absent the
entry is written as undecided, review says the standard was not checked, and a `migrate` re-run leaves it byte-identical.

### T2 — Make /task-decomposer hold a no-scenario draft for a fresh approve `[size: S · risk: med · class: execution · HITL · J2]`
Layers: `skills/task-decomposer/SKILL.md` · `skills/task-decomposer/references/task-file.md` · `README.md` · `CHANGELOG.md` · `TECH-DEBT.md`
Depends-on: none
Cites: TASK-611 · TD-294 · TASK-606 · L-290 · owner rulings 2026-11-06
The earlier `approve` never covered a box the agent adds afterwards, so such a draft writes nothing, shows the box and waits. The
before-run is expected to write the box unasked, and the owner ruling makes that the defect.

**Acceptance:** a no-scenario feature draft plus `approve` writes no file and shows a drafted box; after a fresh approve the file
carries that box; a draft that names a scenario is written on its first approve.

### T3 — Make /triage hold a known-cause bug with no evidence, and settle TD-294 `[size: S · risk: med · class: execution · HITL · J2]`
Layers: `skills/triage/SKILL.md` · `skills/lean-doc-generator/templates/BUG.md.template` · `README.md` · `CHANGELOG.md` · `TECH-DEBT.md`
Depends-on: T1 · T2 (TASK-610 · TASK-611)
Cites: TASK-612 · TD-294 · TASK-606 · L-290 · owner rulings 2026-11-06
An agent-written box moves a bug to `ready` only when drawn from evidence it cites, so an invented box is the defect. T3 goes last
because it flips TD-294 and shares the docs with T1 and T2; there is no logic dependency.

**Acceptance:** a known-cause report whose evidence names nothing that must keep working stays `needs-info` with no invented box; an
evidenced one reaches `ready` citing it; TD-294 moves to `resolved` citing all three tasks, or stays open naming the unrun branch.

## Owner-action checklist
- [x] Rule each consumer-proof run's result when it is shown (T1, T2, T3). ✓ owner rulings by popup, recorded in the Log's T1, T2 and T3 done entries

## Decisions (pre-locked)
- **D1** — Shared files: `CHANGELOG.md`, `README.md` and `TECH-DEBT.md` are edited in T1, T2, T3 order, each rebasing on the last, so
  the three never commit these files at once. T1 and T2 share no other file, and neither shares one with T3.
- **D2** — ADR-053: all three are defect fixes in shipped skill text, unfrozen. A defect that needs a new guard, checker or gate leg
  becomes a TD with its ADR-053 reason, and is not built here.
- **D3** — Owner rulings (2026-11-06 intake), settled: hold and re-approve (T2); a box moves a bug to `ready` only from cited evidence,
  else `needs-info` (T3); scripted operated sessions on both `init` and `migrate` (T1).
- **D4** — Every branch runs on a pin of today's main first, recorded as the before, then again on the pin holding any fix. Prompts
  never name the rule. A shipped skill change takes the Codex review at execution.

## Assumptions
- **A1** — `task-decomposer/SKILL.md` (136) and `triage/SKILL.md` (132) hold under their ~140 cap with the fix (`check-doc-caps`,
  2026-11-06). *Confirm: at T2's and T3's G2.*
- **A2** — The operated session answers the Standards question from a scratch `--answers-dir` and migrate's plan popup from the existing
  PLAN ruling; a second ask that stops the classifier is answered through `--ruling`. *Confirm: T1's before-run. If neither works,
  changing `evals/ab/` needs a `scope-change` entry first, since it is outside T1's `Layers:`.*
- **A3** — `review-scoping.md` has no clause for `checks: not decided yet`, so "says it was not checked" is expected to need a line.
  *Confirm: T1's review run.*
- **A4** — T3's seed report must leave the neighbouring behaviour unstated on an area the copy's code cannot settle; if the copy has no
  such area, the cause is seeded in a file outside the checkout. *Confirm: T3's G2 picks.*
- **A5** — Runs use fresh copies of `D:\Research\workdoo` under `D:\Research\`, through a pinned clone (`--plugin-dir`), with a
  snapshot and revert. That copy now has a `.git` (HEAD `cf41a20`) and one dirty file. *Confirm: at the first run's snapshot.*

## Execution Log

> **Lives in its own file** — [`logs/SPRINT-164-never-run-branches.md`](logs/SPRINT-164-never-run-branches.md).
> Append there, never here (STANDARD §9, ADR-014).

## Files Changed
<!-- Filled during execution; feeds CHANGELOG at close. -->

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `skills/lean-doc-generator/references/migration-map.md` | TASK-610 | Spell out the undecided-checks marker and require the report labels word for word; a run showed `migrate` missing both | low | R2 before and after on pins |
| `README.md` · `CHANGELOG.md` · `TECH-DEBT.md` | TASK-610 | Name the rule; TD-294 `Runs:` line; TD-296 for two label gaps | low | gate |
| `skills/task-decomposer/SKILL.md` · `skills/task-decomposer/references/task-file.md` | TASK-611 | Hold a no-scenario draft at `approve`, show the exact line, write it unchanged; a run showed the box written unasked, then reworded | low | D1 before and after on pins |
| `README.md` · `CHANGELOG.md` · `TECH-DEBT.md` | TASK-611 | Name the hold; TD-294 `Runs:` line | low | gate |
| `skills/triage/SKILL.md` · `skills/lean-doc-generator/templates/BUG.md.template` | TASK-612 | A bug's box must cite the report or code that names the scenario; with neither, `needs-info` and no box | low | B1 and B2 before and after on pins |
| `README.md` · `CHANGELOG.md` · `TECH-DEBT.md` | TASK-612 | Name the rule; TD-294 `Runs:` line and `resolved` | low | gate |

## Retro
<!-- Written at close. Route the buckets to durable homes (STANDARD §10). -->

**Outcome** — 3 of 3 members delivered (TASK-610, TASK-611, TASK-612), 17 of 17 boxes. The three branches TD-294 listed have now run on
copies of a real repo through pinned clones, and each run changed the skill text. TD-294 is resolved. Nothing is released; the three fixes
wait under `[Unreleased]`.

**Retrieval check** — yes, one miss. L-290 (a rule stated twice must carry the same condition) was a day old when T3's bug template was
written weaker than `/triage` steps 3 and 6. Codex caught it in round 1; counted on L-290 (2).

**Cost** — headless proofs for T2 and T3: 2.35 USD over 15 runs, including the void and tightened re-runs. T1's runs recorded no figure,
nor did the Codex rounds. Claude session tokens: not available.

**Worked**
- Running before the fix corrected the premise: T3's expected invented box did not appear, and the run found a filler box on an
  unknown-cause bug instead.
- The literal check in TASK-611's box 2 failed a fix that looked right, since the first fix held the draft and then reworded its lines.
- Hashing the source repo before and after showed the proofs left it untouched.

**Friction**
- T2's first line check passed falsely: an empty extract made `grep -Fx` match 11 blank lines (L-291).
- T3's first B2 after-run was void, because the copy was re-seeded and the report's stated cause was false for its code (L-292).
- R3's first attempt stopped on a multi-select popup the classifier had no entry for.
- The gate's temp folder vanished once, a transport failure and not a result.

**Pattern candidate**
- L-291: a check fed by an extract proves nothing until the extract is shown to hold what it should.
- L-292: a fixture's stated cause must be true of the code the run reads, and a re-run rebuilds its copy.

**Buckets** — Shipped: three `[Unreleased]` Fixed lines (no release; no `type: bug` member). Tech debt: TD-297 (new); TD-296 filed in T1;
TD-294 resolved. Follow-ups: none. Learnings: L-291, L-292 (new), L-290 (count 2).
