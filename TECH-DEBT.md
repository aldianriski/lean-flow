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

- **TD-009** severity: minor | status: resolved → TASK-107 (Sprint-034) | created: Sprint-033
  - Summary: two SSOT surfaces were at **exactly zero headroom** — `.claude/CONTEXT.md` 130/130
    (ADR-007) and `skills/orchestrator/SKILL.md` 110/110 (`qa-check.sh` enforces both as hard caps,
    not the soft `~110` CLAUDE.md implies). SPRINT-033's contract fit only by compressing its own
    entry to two dense lines and merging a new red flag into an adjacent one.
  - Impact: the next rule touching either file could not land without first displacing something —
    the L-008 / TD-006 accretion signal firing a second time on CONTEXT.md.
  - Resolution: the planned mitigation executed. CONTEXT.md 130 → **116** by collapsing prose that
    duplicated CLAUDE.md / README / ARCHITECTURE / DOCS_Guide into pointers; orchestrator/SKILL.md
    110 → **98** by relocating the Implement-routing + dispatch blockquote into its existing
    `references/dispatch.md` (the L-012 pattern that resolved TD-008). No rule lost — the one
    genuine deletion candidate (the named out-of-scope cloud tools) was relocated to
    `docs/ARCHITECTURE.md` § Key integration points rather than dropped.

- **TD-008** severity: minor | status: resolved → TASK-069 (Sprint-032) | created: Sprint-017
  - Summary: `skills/lean-doc-generator/SKILL.md` at 106/110, init section the tightest fit.
  - Resolution: the planned mitigation executed — init's procedure relocated to `references/init.md` (L-012 pattern) during the TemiDev-standard sprint; SKILL.md now 104/110 with the init section a 7-line summary + pointer.

---

## Resolved (collapsed)

<!-- TD-001…007 all resolved (§11 collapse — per-TD summaries live in their sprint files + git). -->
- resolved: **TD-001**→SPRINT-003 · **TD-002/004**→SPRINT-005 · **TD-003**→SPRINT-004 · **TD-005**→SPRINT-006 · **TD-006**→SPRINT-009 · **TD-007**→SPRINT-012 (closed 2026-07-02).
