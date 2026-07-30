---
owner: Maintainer
last_updated: 2026-07-30
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

- **TD-012** severity: minor | status: open | created: Sprint-037
  - Summary: the pre-dispatch preflight snippet now shipped in
    `skills/orchestrator/references/dispatch.md` was negative-tested by three must-FAIL fixtures that
    lived in a scratch dir and were **deleted** with the prototype. The shipped sh/awk block therefore
    has no retained regression guard, and `qa-check.sh` does not read it.
  - Impact: a future edit to the snippet — or a change to the sprint-schema tokens it parses — can
    silently reintroduce the exact silent-false-negative class L-058 names. Proven reachable, not
    theoretical: stripping one guard clause during T1 made it pass a real overlap at exit 0. A gate
    that degrades quietly is the worst shape for a gate, which is the whole point of L-058.
  - Mitigation (not yet done): retain the three fixtures plus a runner. Natural carrier is the eval
    harness TASK-124 will build — its fixture-skeleton + assertion-script shape is the same one, so
    this likely costs a row rather than a new mechanism. Alternative: a `qa-check.sh` leg that runs
    the snippet against retained fixtures.

- **TD-011** severity: minor | status: resolved → SPRINT-038 T4 | created: Sprint-035
  - Summary: `docs/adr/ADR-010-model-dispatch-role-tiers.md`'s 2026-07-10 amendment wording ("a
    mis-classification mis-routes") predates ADR-013/T5's advisory-default framing — read cold it
    can imply intake classification is binding, contradicting the now-canonical "persisted `class:`
    is an advisory default; dispatch-time classification stays authoritative."
  - Impact: a cold reader reconciling ADR-010 with CONTEXT.md § Task entry shape may resolve the
    ambiguity the wrong way. Not contradicted in substance — wording only.
  - Resolution: appended a dated amendment note to ADR-010 (2026-07-30) pointing at ADR-013's
    advisory-default clause and CONTEXT.md § Model tiers; the 2026-07-10 amendment's prior text is
    untouched (ADRs are append-only) — the note reconciles the framing without rewriting it.

---

## Resolved (collapsed)

<!-- TD-001…007 all resolved (§11 collapse — per-TD summaries live in their sprint files + git). -->
- resolved: **TD-001**→SPRINT-003 · **TD-002/004**→SPRINT-005 · **TD-003**→SPRINT-004 · **TD-005**→SPRINT-006 · **TD-006**→SPRINT-009 · **TD-007**→SPRINT-012 (closed 2026-07-02).

<!-- TD-008…010 all resolved (§11 collapse — per-TD summaries live in their sprint files + git). -->
- resolved: **TD-008**→SPRINT-032 · **TD-009**→SPRINT-034 · **TD-010**→SPRINT-035 (collapsed 2026-07-30, SPRINT-038 T4).
