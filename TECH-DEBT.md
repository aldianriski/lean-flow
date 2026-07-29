---
owner: Maintainer
last_updated: 2026-07-29
update_trigger: Tech debt filed (Sprint Close), aged (Sprint Promote), or resolved
status: current
---

# lean-flow — Tech Debt Ledger

> Filed automatically by the Sprint Close Retro (`TD-NNN` rows) · aged at Sprint Promote
> (unaddressed ≥ 3 sprints → re-review; `severity: high` → auto-escalate to `TODO.md` Backlog P1) ·
> never deleted — resolved → `status: resolved → TASK-NNN`; ≥ 3 sprints later the row collapses to
> one line in § Resolved (§11). IDs are monotonic, never reused. `severity` ∈ trivial · minor · medium · high.

---

## Tech Debt

- **TD-008** severity: minor | status: open | created: Sprint-017 | re-reviewed: 2026-07-29 (SPRINT-028 promote)
  - Summary: `skills/lean-doc-generator/SKILL.md` at 106/110 after the §11 close-pass adds. Under cap, but the init section is the tightest fit — if the next lean-doc feature needs headroom, relocate init's 4-step procedure to a reference (L-012, as migrate's detail lives in `migration-map.md`). Watch at promote aging.
  - Re-review: kept open — 104→106 over sprints 025–027 (slow creep, no breach); mitigation unchanged (relocate init detail to a reference if the cap is threatened).

---

## Resolved (collapsed)

<!-- TD-001…007 all resolved (§11 collapse — per-TD summaries live in their sprint files + git). -->
- resolved: **TD-001**→SPRINT-003 · **TD-002/004**→SPRINT-005 · **TD-003**→SPRINT-004 · **TD-005**→SPRINT-006 · **TD-006**→SPRINT-009 · **TD-007**→SPRINT-012 (closed 2026-07-02).
