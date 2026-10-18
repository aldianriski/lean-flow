---
sprint: 125
slug: consumer-maturity-and-cleanup
epic: EPIC-022
owner: Maintainer
last_updated: 2026-10-18
status: active
update_trigger: sprint execute/close events
---

# SPRINT-125 — Consumer Maturity and Cleanup

> **Theme:** EPIC-022's first slice. Before lean-flow grows plan support, the surface a consumer already installs must stop
> misleading them: shipped skills that name scripts the consumer lacks, two conformance rules that pass what they exist to catch,
> templates that earn their own finding, a `migrate` rule that holds only on some runs, and release and sprint wording that
> disagrees with the gates. It also retires the platform epics workdoo now owns, so lean-flow's index shows only its own roadmap.
> Every item is a measured defect (ADR-053). The sprint closes with a patch release.

## Scope

**In:** script-path wording (`428`) · `/prime` freshness + night-run offer (`429`) · release version-reference bump (`430`) ·
template ownership headers (`431`) · `S11.TDDELETE` + `S4.NEGATIVE` false greens (`432`) · `migrate` post-write field check
(`433`) · platform-epic retirement + stale TD rows (`434`) · log created at promote (`422`) · tick-tail wording (`427`).
**Out (deferred):** EPIC-022 S2–S4 (roadmap, plan mode, git-less, planning clusters) · the 61 maintainer-only TD rows ·
EPIC-005 · 007 · TASK-322 · 366 · 367 · 402.

## Members

- docs/work/todo/TASK-434-retire-the-platform-epics-workdoo-now-owns.md
- docs/work/todo/TASK-427-make-the-tick-rule-and-the-freeze-checker-agree-on-the-tail.md
- docs/work/todo/TASK-422-reconcile-the-sprint-templates-lazy-log-with-the-rollup-gate.md
- docs/work/todo/TASK-428-stop-shipped-skills-naming-repo-only-script-paths.md
- docs/work/todo/TASK-429-make-prime-report-right-under-plugin-dir-and-for-hitl-sprints.md
- docs/work/todo/TASK-431-give-governed-templates-an-ownership-header.md
- docs/work/todo/TASK-432-stop-two-conformance-rules-passing-what-they-exist-to-catch.md
- docs/work/todo/TASK-433-make-migrate-withhold-incomplete-task-files-every-run.md
- docs/work/todo/TASK-430-make-release-patch-bump-every-version-reference-the-gate-lints.md

## Plan

### T1 — Retire the platform epics workdoo now owns `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `docs/epic/` · `docs/epic/archive/` · `docs/epic/INDEX.md` · `docs/research/adlc-epic-sequencing.md` · `TECH-DEBT.md`
  · `.cap-dispositions`
  · `docs/work/todo/TASK-434-retire-the-platform-epics-workdoo-now-owns.md`
  · `docs/work/in_progress/TASK-434-retire-the-platform-epics-workdoo-now-owns.md`
Depends-on: none
Cites: `TASK-434` · EPIC-022 D1 · ADR-052 · ADR-041

Owner ruling 2026-10-18 (D1). Governance-file work, Tier P. The `retain` disposition on the sequencing file named EPIC-015's close
as its revisit point, and that has happened.

**Acceptance:** `docs/epic/` holds only EPIC-005 · 007 · 022 as live epics, and the four stale or moved TD rows read resolved
with their evidence.

### T2 — Make the tick wording match the freeze checker `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `skills/orchestrator/references/dispatch.md` · `skills/lean-doc-generator/references/sprint-by-reference.md`
  · `evals/` · `CHANGELOG.md` · `TECH-DEBT.md`
  · `docs/work/todo/TASK-427-make-the-tick-rule-and-the-freeze-checker-agree-on-the-tail.md`
  · `docs/work/in_progress/TASK-427-make-the-tick-rule-and-the-freeze-checker-agree-on-the-tail.md`
Depends-on: none
Cites: `TASK-427` · ADR-047 · ADR-053 · TD-229 · `scripts/lib/check-sprint-by-reference.ts` (read, not edited)
  · bare names as the member's Done when spells them: `check-sprint-by-reference.ts` · `dispatch.md` · `sprint-by-reference.md`

The wording moves and the checker stays (owner ruling), so adopters see no verdict change. The retained case pair proves that
the placement the wording names is the one the checker accepts.

**Acceptance:** a multi-line box ticked where the references say passes the freeze checker, and a tail placed anywhere else
still FAILs.

### T3 — Create the Execution Log at promote `[size: S · risk: low · class: decision · HITL · J1]`
Layers: `skills/lean-doc-generator/templates/SPRINT.md.template` · `skills/lean-doc-generator/templates/sprint-log.md.template`
  · `skills/lean-doc-generator/references/sprint-by-reference.md` · `skills/lean-doc-generator/SKILL.md` · `evals/`
  · `README.md` · `CHANGELOG.md` · `TECH-DEBT.md`
  · `docs/work/todo/TASK-422-reconcile-the-sprint-templates-lazy-log-with-the-rollup-gate.md`
  · `docs/work/in_progress/TASK-422-reconcile-the-sprint-templates-lazy-log-with-the-rollup-gate.md`
Depends-on: T2 (`sprint-by-reference.md`)
Cites: `TASK-422` · TD-160 · ADR-014 · `scripts/lib/check-night-run-rollup.ts` (read, not edited)

Owner ruling: promote renders the log and the check stays as it is. This sprint is the first rendered that way.

**Acceptance:** the template, the promote procedure and the rollup check name one rule (the log exists from promote on), and a
fixture shows a log-less active sprint FAILs while a promoted one passes.

### T4 — Stop shipped skills naming repo-only script paths `[size: M · risk: low · class: execution · HITL · J1]`
Layers: `skills/orchestrator/SKILL.md` · `skills/orchestrator/references/night-run.md`
  · `skills/orchestrator/references/dispatch.md` · `skills/orchestrator/references/review-scoping.md`
  · `skills/lean-doc-generator/SKILL.md` · `CHANGELOG.md` · `TECH-DEBT.md`
  · `docs/work/todo/TASK-428-stop-shipped-skills-naming-repo-only-script-paths.md`
  · `docs/work/in_progress/TASK-428-stop-shipped-skills-naming-repo-only-script-paths.md`
Depends-on: T2 (`dispatch.md`), T3 (`lean-doc-generator/SKILL.md`)
Cites: `TASK-428` · TD-137 · TD-214 · L-015

The census found 19 occurrences in 5 files, each ruled per reference. Lean-flow's own launcher is marked as such, never deleted.

**Acceptance:** a re-census of `scripts/` under `skills/` lists every survivor with its ruling, and none is an adopter step's
only mechanism.

### T5 — Fix `/prime`'s freshness row and night-run offer `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `skills/prime/SKILL.md` · `skills/prime/references/` · `CHANGELOG.md` · `TECH-DEBT.md`
  · `docs/work/todo/TASK-429-make-prime-report-right-under-plugin-dir-and-for-hitl-sprints.md`
  · `docs/work/in_progress/TASK-429-make-prime-report-right-under-plugin-dir-and-for-hitl-sprints.md`
Depends-on: none
Cites: `TASK-429` · TD-220 · TD-230 · ADR-006 · `.claude-plugin/plugin.json` (read, not edited)

`prime` sits at 139 of 140 lines, so any depth this needs moves to `references/`.

**Acceptance:** a `--plugin-dir` session reads `fresh`, and an all-HITL/J2 sprint is offered `/orchestrator` with no night run.

### T6 — Give governed templates their ownership header `[size: S · risk: low · class: decision · HITL · J1]`
Layers: `skills/lean-doc-generator/templates/AGENTS.md.template` · `skills/lean-doc-generator/templates/BUG.md.template`
  · `skills/lean-doc-generator/templates/CODE_OF_CONDUCT.md.template` · `skills/lean-doc-generator/templates/DESIGN.md.template`
  · `skills/lean-doc-generator/templates/QA-TESTCASE.md.template` · `CHANGELOG.md` · `TECH-DEBT.md`
  · `docs/work/todo/TASK-431-give-governed-templates-an-ownership-header.md`
  · `docs/work/in_progress/TASK-431-give-governed-templates-an-ownership-header.md`
Depends-on: none
Cites: `TASK-431` · TD-078 · STANDARD §3 · `S3.SCHEMA` · `conformance.sh` (run, not edited)

The judgement is the triage: does what this template renders land where §3 governs? The typing is cheap.

**Acceptance:** a rendered QA-TESTCASE draws no `S3.SCHEMA` finding, and each of the five templates carries its ruling.

### T7 — Stop two conformance rules passing what they exist to catch `[size: M · risk: med · class: execution · HITL · J2]`
Layers: `scripts/lib/conformance-engine.sh` · `evals/` · `docs/adr/` · `docs/DECISIONS.md` · `CHANGELOG.md` · `TECH-DEBT.md`
  · `docs/work/todo/TASK-432-stop-two-conformance-rules-passing-what-they-exist-to-catch.md`
  · `docs/work/in_progress/TASK-432-stop-two-conformance-rules-passing-what-they-exist-to-catch.md`
Depends-on: none
Cites: `TASK-432` · TD-187 · TD-118 · ADR-034 · ADR-050 · L-166 · L-186 · `conformance.sh` (run, not edited)
  · the rule ids, asserted inside `conformance-engine.sh`: `S11.TDDELETE` · `S4.NEGATIVE`

`conformance.sh` executes both rules, so this is Consequential Tier G and takes the full bar: seeded breaks, a `cmp` restore, and a
worktree-isolated outside review. Tightening `S4.NEGATIVE` changes what it accepts, so it needs a ruling under ADR-034.

**Acceptance:** an ADR denying any negative FAILs `S4.NEGATIVE`, and every real resolved-row shape is judged by `S11.TDDELETE`, or
named `not judged`.

### T8 — Make `migrate` withhold incomplete task files on every run `[size: M · risk: med · class: decision · HITL · J2]`
Layers: `skills/lean-doc-generator/references/migration-map.md` · `evals/` · `CHANGELOG.md` · `TECH-DEBT.md`
  · `docs/work/todo/TASK-433-make-migrate-withhold-incomplete-task-files-every-run.md`
  · `docs/work/in_progress/TASK-433-make-migrate-withhold-incomplete-task-files-every-run.md`
Depends-on: none
Cites: `TASK-433` · TD-217 · TD-204 · L-007

G2 rules the mechanism: a post-write checklist in prose, or a shipped check. TD-204 says adopters may not have bun, and the
step must work in a repo that has no `scripts/`.

**Acceptance:** on a real v1 fixture tree, a task lacking `tier:` is withheld and named, and a complete one is written.

### T9 — Make `/release-patch` bump every linted version reference `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `skills/release-patch/SKILL.md` · `CHANGELOG.md` · `TECH-DEBT.md`
  · `docs/work/todo/TASK-430-make-release-patch-bump-every-version-reference-the-gate-lints.md`
  · `docs/work/in_progress/TASK-430-make-release-patch-bump-every-version-reference-the-gate-lints.md`
Depends-on: T1–T8 (it is exercised by this sprint's own release)
Cites: `TASK-430` · TD-093 · L-015 · L-007

The step stays generic, because the README footer is this repo's convention and not a consumer's. It runs last, so the close's
patch release is its real input.

**Acceptance:** after this sprint's release, all four `*-plugin/*.json` manifests and the README footer carry the same version.

## Decisions (pre-locked)

- **D1** — Shared files: `dispatch.md` is T2 → T4; `sprint-by-reference.md` is T2 → T3; `lean-doc-generator/SKILL.md` is
  T3 → T4. `CHANGELOG.md` and `TECH-DEBT.md` are touched by every task. Each is committed per hunk by its task (`git add -p`, then
  read `git diff --cached`), in Plan order.
- **D2** — TASK-422: the log is created at promote, and the check is unchanged. TASK-427: the wording moves, and the checker is
  unchanged. Both are owner rulings, made by popup on 2026-10-18.

## Assumptions

- **A1** — The 19-occurrence script-path census (2026-10-18) is the population T4 must cover. *Confirm: re-census at T4's G1 by a
  second route (occurrences vs lines).*
- **A2** — The release at close is a PATCH: every member is a fix. *Confirm: at close, against the Files Changed table.*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-125-consumer-maturity-and-cleanup.md`, created at promote (TASK-422's
> ruling, applied from this sprint on). Append there, never here (STANDARD §9 · ADR-014).

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro
