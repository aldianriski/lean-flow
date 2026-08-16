---
owner: Maintainer
last_updated: 2026-08-15
update_trigger: a MINOR version rotates out of the root CHANGELOG
status: current
---

# lean-flow — Changelog v1.40.0

> Rotated out of the root `CHANGELOG.md` when **v1.42.0** landed (§11: keep current + previous minor
> inline). Older releases → [`CHANGELOG-1.39.0.md`](CHANGELOG-1.39.0.md).

## v1.40.0 — Verification Authority (2026-08-15)

MINOR — SPRINT-066, **2 of 2 units**. Two ADR-grade rulings that decide *who may say no* — the
boundary the second gauntlet audit's remainder funnels through, settled before anything is built on
it (TASK-208/209 unblock with this release).

**What changed for you**

- **ADR-021 — mechanical evidence gates the silent path, never the owner.** Where a task's
  `done-when` names a mechanical check, that check's FAIL now blocks the *silent* DoD tick: the
  coordinator surfaces it and gets a **recorded owner ruling** (the override is always available —
  the owner is never gated). The consumer's CI is never run as a blocker on lean-flow's own
  authority. G2 gains one checklist line: each `done-when` notes its verification method where a
  mechanical check exists. Wired: `orchestrator/SKILL.md` § G2 · `review-scoping.md` § QA suggestion
  (the evidence boundary) · CONTEXT.md § Gates.
- **ADR-022 — unattended retry: the mechanical-trigger carve-out.** The revise loop may fire inside
  an unattended run only when **three prior human decisions** exist: the trigger is a
  `done-when`-named check FAIL (the ADR-021 class — a critic's *judgment* finding always parks), the
  ceiling is the owner-ruled one-retry-per-pass, and the repo's **declared policy** enables it
  (absence of the policy = never — absence ≠ consent). One rollup line per firing. Wired:
  `night-run.md` Part 0 boundary rows + Part 4 retry line · `review-scoping.md` § The revise loop ·
  SKILL.md § Review · CONTEXT.md.
- **The revise loop's first production firing was on its own extension.** T2's scoped review caught
  the superseded "unattended never retries" line surviving in two consumer touchpoints (the L-020
  shape); one bounded retry fixed both axes' findings; the delta re-review confirmed with no second
  firing.

**Maintainer-facing**

- Filed: **L-122** (brief the Spec axis with the decision as logged — it turns the wiring check into
  a mechanical matcher) · a sighting note on **TD-052** (two more procedural gates, each naming its
  control at authoring time — the third-gate trigger did not fire). TASK-207/203 shipped;
  TASK-208/209 → `ready`. The plugin-reinstall owner action carries a second sprint — installed
  cache 1.38.0 vs repo 1.40.0.
