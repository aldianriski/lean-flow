---
id: TASK-422
title: "Reconcile the sprint template's 'created lazily' Execution Log with the rollup gate that FAILs an absent one"
priority: P2
size: S
risk: low
autonomy: HITL
class: decision
tier: X
authority: J2
origin: manual
state: ready
epic: EPIC-022
sprint: SPRINT-125
depends-on: []
---

# TASK-422 — Reconcile the sprint template's "created lazily" Execution Log with the rollup gate that FAILs an absent one

## Why

At the SPRINT-121 promote, the sprint file followed `templates/SPRINT.md.template` § Execution Log, which says the log is "created
lazily at the first entry". System verify then FAILed: the night-run rollup check reads an active sprint with no log as "exactly
the silence this check exists to catch" (`check-night-run-rollup.ts` / `.sh`). The template and the gate disagree, and anyone
following the template hits the failure. It is a measured defect, so it is admissible under the interim governance restriction.
Owner ruling 2026-10-10: a separate task, kept out of SPRINT-121's bounded vehicle.

## Done when

- [x] The template, the promote procedure (`/lean-doc-generator` promote by reference) and the rollup check state one rule for ✓ `4ca7438a`: SPRINT/sprint-log templates, promote row, by-reference step 4, handoff (fallback if absent), CONTEXT say the log is created at promote, promote entry first; rollup check + STANDARD §9 unchanged; SPRINT-125's own log (first entry `promote`) is real input
      when an active sprint's Execution Log must exist: **the log is created at promote** with its `plan locked` entry (owner
      ruling 2026-10-18); the check is unchanged. TD-160 (red by construction between promote and first entry) resolves with it.
- [x] A fixture reproduces the SPRINT-121 promote shape (an active sprint, no log) and shows the ruled behaviour, with a sibling ✓ retained `qa-leg2g-v2-open-members-no-log` (FAIL) + `-with-log` + new `qa-leg2g-v2-promoted-log-promote-entry-only` (not FAILed: skip, pass=0 fail=0); `run-night-run-rollup-fixtures.sh` all green
      control.
- [ ] README/CHANGELOG note the change if the template or a skill changed (consumer-facing).

## Touches

- `skills/lean-doc-generator/templates/SPRINT.md.template` · `skills/lean-doc-generator/references/sprint-by-reference.md` ·
  `scripts/lib/check-night-run-rollup.ts` · `scripts/lib/check-night-run-rollup.sh` · `evals/`

## Assumes

- ruled 2026-10-18: template/promote moves, the check stays (popup, EPIC-022 S1 promote).

## Tracker

- SPRINT-121 promote, system verify `301 pass, 3 fail` (Execution Log entry 2026-10-10) · owner ruling 2026-10-10
