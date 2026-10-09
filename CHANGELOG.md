---
owner: Maintainer
last_updated: 2026-10-09
update_trigger: Sprint completed and changes reflected in docs
status: current
---

# lean-flow — Changelog

<!-- Prepend new sprints — newest first. Append-only; never edit past blocks. -->

> **Older than the two minors below** → [`docs/changelog/`](docs/changelog/) — rotated verbatim at
> each new MINOR and reachable only from here (STANDARD §11).

---

## SPRINT-120 — Conform to Our Own Standard (2026-10-09)

**Unreleased**: `scripts/lib/conformance-engine.sh` and `spec/STANDARD.md` changed (spec 0.14.0), so this reaches adopters at the next release.

- **`conformance.sh` no longer reads Claude Code's worktree copies.** Every file walk skips `.claude/worktrees/`, so a repo that uses
  isolated agents stops getting findings sourced from those copies. A repo root containing glob characters is handled too (TASK-409).
- **§11's closed-task prune keeps a task that a live doc still cites** (spec 0.14.0, MINOR: only fail → pass). A live citation is the
  task id as a whole word in any tracked `.md` that is not history: closed task files, archives, archive indexes, changelogs, ADRs,
  LEARNINGS and TECH-DEBT. A citation scan that cannot complete now proposes nothing, rather than proposing everything (TASK-410).
- **lean-flow passes its own conformance check at level Structural**, up from `level: none`.

---

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
