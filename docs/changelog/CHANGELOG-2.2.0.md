---
owner: Maintainer
last_updated: 2026-10-10
status: current
update_trigger: rotated out of the root CHANGELOG at a new MINOR (STANDARD §11)
---

# lean-flow — Changelog v2.2.x (rotated)

> Rotated verbatim from the root `CHANGELOG.md` at the **v2.4.0 release** (2026-10-10). §11 keeps the
> current and previous minor inline (2.4.x and 2.3.x), so cutting v2.4.0 pushed v2.2.x out.

## v2.2.0 — The night-run launcher keeps a fire-time ledger (2026-10-09)

**MINOR** — ships SPRINT-118 · SPRINT-119 (entries below). No upgrade step beyond installing `2.2.x` and restarting the session
(a live session keeps the plugin copy it started with).

- **`scripts/night-run.sh` writes `fired · <ts> · <mode>` to the sprint's Execution Log before the run starts**, and refuses to fire when
  no sprint resolves. A run that dies before the reaper is now on record, and the sprint cannot close past it (`CLOSE-FIRED-UNREAPED`).
- **First real unattended run since the reaper repair:** `PLAN_EXHAUSTED` · `DELIVERED`, checked on the committed log (EPIC-015).

---

## SPRINT-119 — Fire-Ledger Vehicle (2026-10-07)

**Unreleased**: no consumer-facing file changed (it is the seeded vehicle for SPRINT-118 T2).

- **The first real unattended run since the reaper repair** fired against this all-J0 Plan on the VPS: `PLAN_EXHAUSTED` · `DELIVERED`,
  $0.83, no confirmation asked, 0 permission denials. It transcribed its own `fired ·` line and the authority verdict (TASK-405).

---

## SPRINT-118 — Prove the Run (2026-10-09)

**Unreleased**: `scripts/night-run.sh` and `skills/orchestrator/references/night-run.md` changed, so this reaches adopters at the next release.

- **The night-run launcher writes a fire-time ledger.** `night-run.sh` appends `fired · <ts> · <mode>` to the sprint's Execution Log
  before the wrapped command runs, and refuses to fire when no sprint resolves. A run that fires and dies before the reaper is now on
  record, and the sprint close check FAILs it as `CLOSE-FIRED-UNREAPED` (TD-122). The authority check reads the same line as the
  written fact of an unattended run (TD-124).
- **EPIC-015 Closed-when 1 is met on live input:** one real `--mode overnight` run ended at a named terminal state, and every check read
  the committed log. The first real `/handoff` record went `live` → `consumed` → `spent` through `check-handoff-state.sh` (TASK-327).

---

