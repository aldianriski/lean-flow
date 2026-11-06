---
id: TASK-610
title: "Run a named standard's draft-back and undecided-checks path on init and migrate, and fix what it exposes"
type: debt
priority: P2
size: M
risk: med
autonomy: HITL
class: execution
tier: P
authority: J2
origin: decomposer
state: ready
depends-on: []
---

# TASK-610 — Run a named standard's draft-back and undecided-checks path on init and migrate, and fix what it exposes

## Why
TD-294: the draft-back of a named standard and its `checks: not decided yet` path have never run, so a wrong branch would first show
on a consumer's repo. Build this slice first: it is the only one whose route is unproven (TD-293's operated migrate stopped at its
plan popup). ADR-053: a defect fix in shipped skill text, unfrozen.

## Done when
- [ ] On an operated `init` and an operated `migrate`, each on a repo copy with code, the answer naming a standard with no checks gets its drafted entry shown back before anything is written, and one more ask for its checks.
- [ ] With checks still absent, coding-standards carries the entry with `checks: not decided yet (owner, init)` or `(owner, migrate)`, and migrate's report lists the topic as `asked (not decided yet)`.
- [ ] A review of a diff on that copy, given the section as its comparand, reports no failed check under the undecided standard, and the report says the standard was not checked; a second adopted entry with real checks on the same copy still fails its violating diff.
- [ ] A `migrate` re-run keeps the undecided entry byte-identical (`cmp`) and does not ask again.
- [ ] Negative: no run invents a check; `none` writes no section; a standard answered with its checks is not asked again.
- [ ] Every defect found is fixed in the skill text and re-shown on a new pin, or filed as `TD-NNN` with its reason; TD-294 records the runs, pins and result for this branch.
- [ ] CHANGELOG `[Unreleased]` and README name any user-visible change.

## Touches
`skills/lean-doc-generator/references/init.md` · `skills/lean-doc-generator/references/migration-map.md` ·
`skills/orchestrator/references/review-scoping.md` · `skills/lean-doc-generator/templates/development-coding-standards.md.template` ·
`README.md` · `CHANGELOG.md` · `TECH-DEBT.md`

## Assumes
- Runs use fresh copies of `D:\Research\workdoo` under `D:\Research\`, through a pinned clone (`--plugin-dir`), with a snapshot and revert; prompts never name the rule. Each runs once on a pin of today's main, recorded as the before, then again on the pin holding any fix.
- The draft-back runs as scripted operated sessions, on both `init` and `migrate` (owner ruling, 2026-11-06 intake).
- `review-scoping.md` has no clause for `checks: not decided yet`; it says only "Never report a standard's name without a failed check", so the "says it was not checked" half of box 3 is expected to need a line.
- The answers come from a scratch `--answers-dir` holding a `Standards:` bullet with no checks, and the migrate plan popup from the existing PLAN ruling (`--ruling`). If the second ask stops the classifier, the coordinator answers through a ruling; `evals/ab/` is changed only if neither works.
- Review runs the way SPRINT-163 T2's did: a scoped reviewer given the pinned clone's review procedure.
- Fixes land in shipped skill text only, under `[Unreleased]`, no release. A defect that needs a new guard, checker or gate leg is filed as a TD with its ADR-053 reason, not built here. Shipped skill changes take the Codex review at execution.

## Tracker
TD-294 · TD-293 · SPRINT-163 T2 · owner rulings 2026-11-06 (intake popup) · Codex intake review CLEAR in 1 round
