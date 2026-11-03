---
sprint: 161
slug: s4-final-arm-and-release
stream: s4-release
epic: EPIC-023
owner: Maintainer
last_updated: 2026-11-03
status: active
plan_commit: d69b4cb9
update_trigger: sprint execute/close events
---

# SPRINT-161 — S4: Final Arm and Release

> **Theme:** EPIC-023's last slice. S3's residual (TASK-597) lands first, then one measured Final arm and one S1 check decide what
> ships, and the admitted set is released as 2.20.0, or a no-ship is recorded with its numbers. Nothing from the epic ships without
> a passing arm (D6, D16), and the version follows the measured result (D9).

## Scope

**In:** the design finds the business-facts sources by file name (T1, TASK-597) · Amendment 9, arm Final and arm Final-on-A1,
the admission rulings and D18 (T2, TASK-598) · the version ruling and the 2.20.0 release of the admitted set, or a recorded no-ship
(T3, TASK-599).
**Out (deferred):** a STANDARD MAJOR and 3.0.0 unless T2 shows H1/H2 held and a contract breaks · S3a brief fields, S3b pilot
reviewers and S3c roles (recorded as not built, D11) · the clinic provisioning race (TD-289) · the push (owner-reserved).

## Members

- docs/work/todo/TASK-597-the-design-finds-the-business-facts-sources-by-file-name.md
- docs/work/todo/TASK-598-measure-the-final-set-and-rule-what-ships.md
- docs/work/todo/TASK-599-release-the-admitted-set-or-record-a-no-ship.md

## Plan

### T1 — The design finds the business-facts sources by file name `[size: S · risk: med · class: decision · HITL · J2]`
Layers: `skills/orchestrator/SKILL.md` · `CHANGELOG.md`
Depends-on: none
Cites: TASK-597 · TASK-587 · SPRINT-160 log (revision runs, owner ruling) · L-251 · L-285 · the A/B repo's `BUSINESS-NOTES.md`
One revision run in SPRINT-160 grepped file contents for "business-notes", never matched the root file by name, and wrote that the
repo had none. The business-facts box makes the design find each source by name before it may call one absent.

**Acceptance:** development runs on self-onboarding-guard (two) open the business-notes file and quote fact 6.

### T2 — Measure the Final set and S1's no-harm check, and rule what ships `[size: M · risk: high · class: decision · HITL · J2]`
Layers: `evals/ab/` · `docs/research/logs/` · `docs/epic/EPIC-023-specific-not-short.md` · `CHANGELOG.md` · `docs/research/plugin-reference-delta.md` · `docs/knowledge-index.md`
Depends-on: T1
Cites: TASK-598 · EPIC-023 D6, D9, D15, D16, D17 · intake rulings R1, R2 (2026-11-03) · TD-289
Bundles 1 and 2 are measured; bundle 3, TASK-597 and S1's docs are not, as a shipped set. Amendment 9 is signed before any trial;
each arm's pilot is approved, then it runs unattended at two workers with a notification.

**Acceptance:** both arms VALID, and every component's ruling recorded with its numbers in the arms' log and EPIC-023.

### T3 — Release the admitted set as 2.20.0, or record a no-ship `[size: M · risk: high · class: decision · HITL · J2]`
Layers: `CHANGELOG.md` · `docs/changelog/` · `.claude-plugin/` · `.codex-plugin/` · `.kimi-plugin/` · `README.md` · `docs/epic/EPIC-023-specific-not-short.md`
Depends-on: T2
Cites: TASK-599 · EPIC-023 D6, D9, D16 · STANDARD §15 (versioning)
The version follows T2's result. A ruled-out component comes off `main` first (a scope-change widens these Layers to its files,
and a large removal is split out); the release stops before push.

**Acceptance:** the release commit prepared and pushed by the owner, or a no-ship recorded with its numbers.

## Owner-action checklist
- [ ] Sign Amendment 9 before any trial (T2).
- [ ] Approve each arm's pilot (T2).
- [ ] Push the release and its tag (T3).

## Decisions (pre-locked)

- **D1** — Admission follows the intake rulings: stacked add-one deltas, not per-candidate leave-one-out (R1, recorded in EPIC-023
  as D18 by T2); S1 is measured by Final-on-A1 (R2). A failed Final means nothing from the epic ships.
- **D2** — Shared files: `CHANGELOG.md` in commit order T1, T2, T3, staged per hunk; `docs/epic/EPIC-023-specific-not-short.md`
  T2 then T3.
- **D3** — The Final pin is the commit after T1 lands. T1's development runs use research copies and a pinned clone, after a
  no-spend preflight (L-277, L-285).
- **D4** — While a measured arm runs, development runs may share the PC (D16), but no clinic trial runs beside a clinic slot
  (TD-289).
- **D5** — Every member is decision-class: Claude builds; Codex reviews T1's skill change and T2's amendment, at most two rounds.
- **D6** — `skills/orchestrator/SKILL.md` is at 140 lines and 13 dense lines: T1 replaces wording, and no line passes 400
  characters (L-251).
- **D7** — T3 stops before push; EPIC-023's S4 condition is ticked only after the owner's push, or on a recorded no-ship.

## Assumptions

- **A1** — A1's snapshots and manifests serve Final-on-A1 unchanged, as they served arm A1. *Confirm: at T2's G2.*
- **A2** — Final's k = 3 schedule is A4b's slots plus a third trial per task. *Confirm: at T2's G2.*
- **A3** — Work outside the epic already on `main` (SPRINT-157, SPRINT-159) ships in the same release, or is held by a no-ship.
  *Confirm: at T3's G2.*

## Execution Log

> **Lives in its own file** — [`logs/SPRINT-161-s4-final-arm-and-release.md`](logs/SPRINT-161-s4-final-arm-and-release.md),
> created at promote, first entry the `promote` / `plan locked` record. Append there, never here (STANDARD §9 · ADR-014).

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro

<!-- Written at close (STANDARD §10). -->
