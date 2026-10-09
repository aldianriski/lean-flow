---
owner: Maintainer
last_updated: 2026-10-09
status: current
update_trigger: rotated out of the root CHANGELOG at a new MINOR (STANDARD §11)
---

# lean-flow — Changelog v2.1.x (rotated)

> Rotated verbatim from the root `CHANGELOG.md` at the **v2.3.0 release** (2026-10-09). §11 keeps the
> current and previous minor inline (2.3.x and 2.2.x), so cutting v2.3.0 pushed v2.1.x out.

## v2.1.0 — Reports lead with the conclusion; one conformance engine (2026-10-07)

**MINOR** — ships SPRINT-115 · SPRINT-116 · SPRINT-117 (entries below). No upgrade step beyond installing `2.1.x` and restarting
the session (a live session keeps the plugin copy it started with). Nothing an adopter runs needs anything new.

- **Skill reports open with the verdict and the next step**, then evidence, then exactly one `Next:` line (`/prime` · `/orchestrator` ·
  `/lean-doc-generator`).
- **A review loop that closes records its `review ·` line**; an external reviewer records as `scoped-reviewer`.
- **The TypeScript port of the conformance engine is retired** (ADR-051): `conformance.sh` and its Shell engine are the only engine,
  and the plugin no longer ships `packages/` · `apps/`.

---

## SPRINT-117 — Reports Lead (2026-10-06)

**Unreleased**: no version bump yet. Three `skills/*/SKILL.md` files changed, so this reaches adopters at the next release.

- **Skill reports lead with the conclusion.** `/prime`'s banner line carries its verdict and the next step, and the report ends on `Next:`.
  `/orchestrator`'s gate verdicts, task completions and confirmation popups open with one line carrying the verdict and the next step,
  then the evidence, then exactly one `Next:` line (the sprint-bulk rollup keeps its machine-read shape). `/lean-doc-generator`'s close
  report and popups follow the same shape. It is a shape rule, not a length cap (TASK-321).

---

## SPRINT-116 — Decision + Ledger Diet (2026-10-06)

**Unreleased**: no version bump yet. `skills/orchestrator/references/` and `README.md` changed, so this reaches adopters at the next release.

- **The TypeScript port of the conformance engine is retired (ADR-051).** The Shell engine (`conformance.sh`) is the only engine.
  `packages/` · `apps/` · 31 port-only `test/` files and the two §4 TS harnesses are gone (103 files + 2). The Shell §4 harness
  `run-adr-family-fixtures.sh` is back in the default gate, now asserting each rule's verdict per fixture, including the empty-slug case.
  EPIC-014 closes as retired. ADR-038 and ADR-039 are superseded. The default gate is ~25 s slower; adopters need nothing new.
- **A review loop that closes records its `review ·` line, whichever reviewer ran** (`review-scoping.md` § The revise loop). An external
  reviewer, such as a Codex loop, records as `scoped-reviewer`, so the depth vocabulary stays four words. New must-FAIL fixture plus control.
- **`check-handoff-state.sh` uses the shared archive predicate**, and leg 10b no longer exempts it (TASK-346).
- **Stale references to SPRINT-113's cut guards are reworded to history** (TASK-400).
- **Debt ledger:** 12 of the 42 oldest rows resolved at promote and 13 port-only rows at T1; close files 3. 116 open (was 138).
  TD-168 (engine spawn cost) is now TASK-404, P1.

---

## SPRINT-115 — Gate and Host Cost (2026-10-06)

**Unreleased**: no version bump. Skills, templates, spec, manifests and README are untouched, so nothing reaches an adopter.

- **The gate's cost is measured, and it is the host's.** On an Ubuntu VPS the complete `QA_FULL=1` gate runs **105–109 s**, 3/3 green
  (`qa-gate-timing.md` Round 22). TD-143's cost half is ruled closed (host memory, not the gate), and TD-090/117/128 are re-rated `medium`
  as Windows-host-specific. TD-168 stays `high` (the engine is consumer-facing). ADR-039's deferred `layers-observed` ruling is moot: the harness was deleted at SPRINT-113.
- **Two fixtures stop depending on the host.** The locale control spawns `bash` (dash made it vacuous), and the budget-position case asserts
  where the first finding lands, not silence within 60 s (TD-224 · TD-225).
- **`dod-delta` accepts a ruled exemption.** `.dod-delta-exempt` declares an owner-ruled cross-task tick by sha + ruling + reason; it prints
  a named EXEMPT line, while an undeclared sibling still FAILs (TD-166).
- **`scripts/promote-check.ts <sprint>`** runs layers-completeness and a new single-file prose-density mode on a sprint file before `plan locked`.

---
