---
sprint: 153
slug: s1-discovery-profile
stream: s1-discovery
epic: EPIC-023
owner: Maintainer
last_updated: 2026-10-31
status: active
plan_commit: 5a3c80c2
update_trigger: sprint execute/close events
---

# SPRINT-153 — S1: Discovery Profile

> **Theme:** EPIC-023's S1, run as its own stream beside S0's baseline. `init` and `migrate` learn to write a repo
> profile a builder can use: business facts from the repo's own docs first, curated question sets only where a scan
> cannot settle a convention, and templates that stop asking for what the code already says. Every heavy run goes to
> the VPS, so this machine stays quiet while S0's trials measure wall time.

## Scope

**In:** wave 0, the template audit (T1, TASK-552) · wave 1, business discovery from existing docs (T2, TASK-548) ·
wave 2, the React/Vite set and loading by stack (T3, TASK-549) · wave 3, the Vue/Vite set (T4, TASK-550), the Go/chi
and Postgres sets on a fresh fixture (T5, TASK-551) and `migrate` adding the profile (T6, TASK-553) · wave 4, wiring
and adopter docs (T7, TASK-554).
**Out (deferred):** TASK-555 (arm A2: it needs S0's TASK-545 and this sprint's T7) · S2 and S3 (next slices) ·
TASK-489, 367, 402, 498 (blocked) · TASK-507, 523 (`needs-info`).

## Members

- docs/work/todo/TASK-552-remove-template-sections-that-restate-the-code.md
- docs/work/todo/TASK-548-discover-the-business-in-init-from-docs-then-unknowns.md
- docs/work/todo/TASK-549-ship-react-vite-question-set-and-load-sets-by-stack.md
- docs/work/todo/TASK-550-ship-the-vue-vite-question-set.md
- docs/work/todo/TASK-551-ship-go-chi-and-postgres-question-sets-on-a-chi-fixture.md
- docs/work/todo/TASK-553-make-migrate-add-the-profile-and-keep-every-decision.md
- docs/work/todo/TASK-554-wire-s1-discovery-and-document-it-for-adopters.md
- docs/work/todo/TASK-560-init-never-overwrites-existing-docs-and-offers-migrate.md

## Plan

### T1 — Remove template sections that restate the code `[size: S · risk: med · class: decision · HITL · J2]`
Layers: `skills/lean-doc-generator/templates/`
  · `docs/work/todo/TASK-552-remove-template-sections-that-restate-the-code.md`
  · `docs/work/in_progress/TASK-552-remove-template-sections-that-restate-the-code.md`
  · `docs/work/done/TASK-552-remove-template-sections-that-restate-the-code.md`
Depends-on: none
Cites: `TASK-552` · `architecture-baselines.md` (in `docs/research/`) · `lean-flow-3-foundation.md` (in `docs/research/`; §4 R1, R4)

Wave 0. It owns the templates first, so later tasks edit them after it. Owner rulings already taken: the repo profile holds stack and conventions, and templates drop the ADR-012 id.

**Acceptance:** no core template section asks for what the manifest, file tree or code already says, and none prescribes an architecture.

### T2 — Discover the business in init: existing docs first, then only the unknowns `[size: M · risk: med · class: decision · HITL · J2]`
Layers: `skills/lean-doc-generator/references/init.md` · `skills/lean-doc-generator/templates/product-requirements.md.template`
  · `docs/work/todo/TASK-548-discover-the-business-in-init-from-docs-then-unknowns.md`
  · `docs/work/in_progress/TASK-548-discover-the-business-in-init-from-docs-then-unknowns.md`
  · `docs/work/done/TASK-548-discover-the-business-in-init-from-docs-then-unknowns.md`
Depends-on: T1
Cites: `TASK-548` · `lean-flow-3-foundation.md` (in `docs/research/`; D8)

Wave 1, after T1 because both edit the product-requirements template. Targets the "misreads the business" symptom.

**Acceptance:** a real `init` fills at least one business topic from the repo's own docs without asking, and every written fact cites its source.

### T3 — Ship the React/Vite question set and load sets by stack `[size: M · risk: med · class: execution · HITL · J2]`
Layers: `skills/lean-doc-generator/references/init.md` · `skills/lean-doc-generator/references/profiles/react-vite.md` · `skills/lean-doc-generator/references/profiles/README.md` · `skills/lean-doc-generator/templates/development-coding-standards.md.template`
  · `docs/work/todo/TASK-549-ship-react-vite-question-set-and-load-sets-by-stack.md`
  · `docs/work/in_progress/TASK-549-ship-react-vite-question-set-and-load-sets-by-stack.md`
  · `docs/work/done/TASK-549-ship-react-vite-question-set-and-load-sets-by-stack.md`
Depends-on: T2
Cites: `TASK-549` · `lean-flow-3-foundation.md` (in `docs/research/`; D2, D12)

Wave 2, after T2 because both edit the init reference. It sets the shape the other question sets copy.

**Acceptance:** `init` loads the React/Vite set only when detection matches, asks only what the scan left open, and runs scan-only otherwise.

### T4 — Ship the Vue/Vite question set `[size: S · risk: low · class: execution · HITL · J2]`
Layers: `skills/lean-doc-generator/references/profiles/vue-vite.md`
  · `docs/work/todo/TASK-550-ship-the-vue-vite-question-set.md`
  · `docs/work/in_progress/TASK-550-ship-the-vue-vite-question-set.md`
  · `docs/work/done/TASK-550-ship-the-vue-vite-question-set.md`
Depends-on: T3
Cites: `TASK-550`

Wave 3, in parallel with the other wave-3 tasks, on its own file.

**Acceptance:** the Vue/Vite set loads on a Vue + Vite snapshot and not on a React + Vite one.

### T5 — Ship the Go/chi and Postgres question sets on a fresh fixture `[size: M · risk: med · class: execution · HITL · J2]`
Layers: `skills/lean-doc-generator/references/profiles/go-chi.md` · `skills/lean-doc-generator/references/profiles/postgres.md`
  · `docs/work/todo/TASK-551-ship-go-chi-and-postgres-question-sets-on-a-chi-fixture.md`
  · `docs/work/in_progress/TASK-551-ship-go-chi-and-postgres-question-sets-on-a-chi-fixture.md`
  · `docs/work/done/TASK-551-ship-go-chi-and-postgres-question-sets-on-a-chi-fixture.md`
Depends-on: T3
Cites: `TASK-551`

Wave 3. The Go chi fixture is written fresh outside this repo, never copied from the A/B clinic repo.

**Acceptance:** both sets load on the fresh chi fixture, and neither loads on a stack without them unless Postgres is detected.

### T6 — Make migrate add the profile and keep every decision `[size: M · risk: high · class: decision · HITL · J2]`
Layers: `skills/lean-doc-generator/references/migration-map.md`
  · `docs/work/todo/TASK-553-make-migrate-add-the-profile-and-keep-every-decision.md`
  · `docs/work/in_progress/TASK-553-make-migrate-add-the-profile-and-keep-every-decision.md`
  · `docs/work/done/TASK-553-make-migrate-add-the-profile-and-keep-every-decision.md`
Depends-on: T1 T2 T3
Cites: `TASK-553` · `lean-flow-3-foundation.md` (in `docs/research/`; D6)

Wave 3. The riskiest task for adopters: a 2.x repo must keep every decision it had.

**Acceptance:** a real `migrate` adds the profile, every earlier ADR, ruling and settled requirement survives unreworded, and every pointer it writes resolves.

### T7 — Wire S1 discovery and document it for adopters `[size: S · risk: med · class: execution · HITL · J2]`
Layers: `skills/flow/SKILL.md` · `skills/prime/SKILL.md` · `skills/lean-doc-generator/SKILL.md` · `.claude/CONTEXT.md` · `README.md` · `CHANGELOG.md`
  · `docs/work/todo/TASK-554-wire-s1-discovery-and-document-it-for-adopters.md`
  · `docs/work/in_progress/TASK-554-wire-s1-discovery-and-document-it-for-adopters.md`
  · `docs/work/done/TASK-554-wire-s1-discovery-and-document-it-for-adopters.md`
Depends-on: T4 T5 T6 T8
Cites: `TASK-554`

Wave 4. Shipping is not wiring: every entry that triggers `init` or `migrate` must reach the new discovery on a real run.

**Acceptance:** a real `/flow` run reaches the new discovery, and a fresh `init` on an unprofiled stack writes all seven profile topics with evidence or an explicit "not decided yet".

### T8 — Make init never overwrite an existing doc, and offer migrate `[size: S · risk: high · class: decision · HITL · J2]`
Layers: `skills/lean-doc-generator/references/init.md`
  · `docs/work/todo/TASK-560-init-never-overwrites-existing-docs-and-offers-migrate.md`
  · `docs/work/in_progress/TASK-560-init-never-overwrites-existing-docs-and-offers-migrate.md`
  · `docs/work/done/TASK-560-init-never-overwrites-existing-docs-and-offers-migrate.md`
Depends-on: none
Cites: `TASK-560`

Wave 3, joined by scope-change after T3's exercise lost four hand-written facts from an existing CLAUDE.md.

**Acceptance:** init leaves every pre-existing file untouched, and on a repo that has docs it offers migrate before writing.

## Decisions (pre-locked)

- **D1** — Waves: W0 = T1 · W1 = T2 · W2 = T3 · W3 = T4 ∥ T5 ∥ T6 ∥ T8 · W4 = T7. The order is forced by shared files (the
  product-requirements template, the init reference); the question sets each own one file. T4 to T6 may build in
  parallel worktrees. TASK-550, 551, 553 and 554 join with their in-sprint blockers under the dependent-pull rule.
- **D2** — Streams: this is stream s1-discovery beside SPRINT-152 (s0-baseline). Every commit carries `sprint(153)` or
  `merge(153)`, so each sprint's layers check skips the other's commits. `CHANGELOG.md` is shared with SPRINT-152's T4:
  the coordinator writes it, one stream at a time, staged per hunk (L-042).
- **D3** — Heavy runs go to the VPS (owner ruling, 2026-10-31): snapshot exercises through the plugin under test, any
  npm or Go build, and the full gate (`gate-remote.ts`). Builders edit here; this machine runs no build or gate while
  S0's trials measure wall time (L-219).
- **D4** — Shipped skill and template changes take the owner's Codex review loop. Status moves, Log and sprint-file
  edits commit as bare `sprint(153):` (L-238, L-258). A `.ts` brief names `bunx tsc --noEmit` (L-262).

## Assumptions

- **A1** — The exercise snapshots (compass, a React + Vite repo, a Vue + Vite repo, kalasuara, portfolio-sveltekit)
  can be made from the owner's local repos and copied to the VPS; only portfolio-sveltekit-s150 exists today.
  *Confirm: T2 G2.*
- **A2** — A real `init` asks questions, so someone answers them: the owner by ssh on the VPS, or an operator answering
  verbatim from a written answers sheet. *Confirm: T2 G2.*
- **A3** — The VPS has a Claude CLI login usable for exercises (today only the workdoo service user has the CLI).
  *Confirm: T1 G2.*

## Execution Log

> **Lives in its own file** — [`logs/SPRINT-153-s1-discovery-profile.md`](logs/SPRINT-153-s1-discovery-profile.md)
> (STANDARD §9 · ADR-014). Append there, never here.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro
<!-- Written at close. Route the buckets to durable homes (STANDARD §10):
     shipped → CHANGELOG.md (root; legacy docs/) · tech debt → TD-NNN · follow-ups → TASK-NNN · learnings → docs/LEARNINGS.md.
     After close, the file moves → docs/sprint/archive/ + a one-line entry in docs/sprint/INDEX.md (§11). -->
