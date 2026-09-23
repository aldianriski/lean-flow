---
sprint: 106
slug: the-store-and-the-way-in
epic: EPIC-017
owner: Maintainer
last_updated: 2026-09-23
status: active
plan_commit: 4290781
gates_signed: G1,G2 @ 81407ad
close_commit: [sha — set at close]
update_trigger: sprint execute/close events
---

# SPRINT-106 — The Store, and the Way In

> **Theme:** `EPIC-017`'s first member sprint, and the one every later 2.0 task stands on. It builds
> the work-item store (status is the folder, title is the filename, membership is frontmatter) **and,
> in the same sprint, the road an existing lean-flow repo takes onto it**: every skill that touches
> the queue says which layout it found, and `/lean-doc-generator migrate` carries a v1 `TODO.md`
> across without losing a task. Owner direction at this promote: the foundation is not done until an
> existing user can adopt it smoothly — a store only new repos can use is half a foundation.

## Scope

**In:** the `docs/work/` store and its schema (`TASK-359`) · membership as frontmatter and derived
sprint progress (`TASK-360`) · v1/v2 layout detection in every queue-touching skill (`TASK-369`) ·
the v1 → v2 migrate path (`TASK-370`) · `ADR-045` (D1 · store shape) and `ADR-046` (D7 · dual layout).

**Out (deferred):** retargeting `/triage` + `/task-decomposer` writes (`TASK-361`) · promote/close by
reference (`TASK-362`) · retargeting the checkers and deleting `TODO.md` (`TASK-363`) · the token
budget (`TASK-364`, re-scope owed: its long-line guard shipped in SPRINT-105) · workdoo adoption and
the D8 migration proof (`TASK-365` + a task still to decompose) · the `2.0.0` release · migrating
**this** repo's own `TODO.md` — its 15 checkers still parse it, so that is `TASK-363`'s move ·
the ledgers (`TECH-DEBT.md`, `docs/LEARNINGS.md`) — ruled single-file by the epic.

## Plan

### T0 — Freeze the "before" effectiveness baseline `[size: S · risk: med · class: execution · HITL · J1]`
Layers: `docs/research/epic-017-effectiveness.md`
Depends-on: none
Cites: `TASK-374` · `EPIC-017` Closed-when 7 · `docs/LEARNINGS.md`

Added at G2 by logged scope-change. Three mechanical measures taken at HEAD before the store's first commit,
with the method written down so `TASK-386` reproduces it exactly.

**Acceptance:** the research doc holds three dated before-figures at a named commit and a method a
second person can re-run.

**DoD:**
- [ ] Completeness: first-pass coverage of the EPIC-017 decomposition (9 of 26 before review), evidenced by commit
- [ ] Retrieval: 12 fixed probes, answer key committed first, scored hit/miss from a fresh agent given only the always-loaded context
- [ ] Recurrence: count-bumps per sprint over the last 10 sprints, derived by two selectors that agree

### T1 — Stand up the work-item store and its schema `[size: M · risk: med · class: execution · HITL · J2]`
Layers: `docs/work/README.md` · `docs/work/backlog/` · `docs/work/todo/` · `docs/work/in_progress/` · `docs/work/review/` · `docs/work/done/` · `docs/work/cancel/` · `evals/fixtures/work-store/` · `evals/run-work-store-fixtures.ts` · `docs/adr/ADR-045-the-work-item-store.md` · `docs/DECISIONS.md`
Depends-on: T0
Cites: `TASK-359` · `EPIC-017` D1 · D5 · D6 · kerjaan (model only) · `TASK-NNN-kebab-slug.md` (a naming pattern, not a file)

The dependency root of the epic. Six status folders, one file per task named
`TASK-NNN-kebab-slug.md`, and a schema doc that states which field lives where. D6's open question
(`git mv` vs move + add) is ruled here because the first transition happens here.

**Acceptance:** a task file moved `backlog/` → `todo/` → `backlog/` returns byte-identical, and the
schema doc answers "where does status / title / sprint / epic live?" in one place each.

**DoD:**
- [ ] Six status folders exist; `docs/work/README.md` is the schema (fields · filename rule · the
      three axes) with an ownership header — *Verify: `ls docs/work/` returns exactly the six*
- [ ] Filename rule enforced by the schema: no spaces, no reserved characters, no case-only renames
- [ ] A retained fixture under `evals/fixtures/work-store/` round-trips one task through a transition
      and back — *Verify: `cmp` of the before/after file*
- [ ] D6 ruled (`git mv` or move + add) and recorded in `docs/adr/ADR-045-the-work-item-store.md`;
      move and content edit stay in separate commits either way
- [ ] `ADR-045` indexed in `docs/DECISIONS.md` — *Verify: the row resolves to the file*

### T2 — Make membership frontmatter and sprint progress derived `[size: M · risk: med · class: execution · HITL · J2]`
Layers: `docs/work/README.md` · `skills/lean-doc-generator/templates/SPRINT.md.template` · `skills/prime/SKILL.md` · `evals/fixtures/work-store/` · `evals/run-work-store-fixtures.ts`
Depends-on: T1
Cites: `TASK-360` · `EPIC-017` D1 · D2

Membership is `sprint:` / `epic:` frontmatter because the one directory a file has is already
status. The sprint template gains a by-reference member list; `/prime` counts `## Done when` boxes
across member files. The copy-into-Plan path stays until `TASK-362` — this adds the v2 path beside it.

**Acceptance:** `/prime` on the fixture store reports an open-DoD figure that **matches a hand count**,
and "what is in `review/` across all sprints?" is one glob.

**DoD:**
- [ ] Schema carries `sprint:` / `epic:`; nesting membership under status is rejected in writing
- [ ] `skills/lean-doc-generator/templates/SPRINT.md.template` offers a by-reference member list
      without removing the v1 Plan shape (both layouts, D7)
- [ ] `skills/prime/SKILL.md` derives open DoD from member files on a v2 tree — *Verify: its figure on
      `evals/fixtures/work-store/` equals a hand count, and a second count by a different selector
      (per-file `grep -c` summed) agrees*
- [ ] A fixture member whose `sprint:` names another sprint is **not** counted (varies the selection,
      not the verdict — L-186)

### T3 — Make every queue-touching skill detect and name its layout `[size: M · risk: high · class: decision · HITL · J2]`
Layers: `skills/prime/SKILL.md` · `skills/triage/SKILL.md` · `skills/task-decomposer/SKILL.md` · `skills/lean-doc-generator/SKILL.md` · `skills/orchestrator/SKILL.md` · `skills/handoff/SKILL.md` · `skills/flow/SKILL.md` · `evals/fixtures/layout/` · `evals/run-layout-fixtures.ts` · `docs/adr/ADR-046-the-2-0-hard-cut.md` · `docs/DECISIONS.md`
Depends-on: T1 · T2
Cites: `TASK-369` · `EPIC-017` D7 · L-015 · L-016 · ADR-006 · `TODO.md` (read, never written) · `2.x`

D7 made concrete: through all of `2.x`, each skill that reads or writes the queue detects **v1**
(`TODO.md` Backlog), **v2** (`docs/work/`) or **mixed** (mid-migration), says which in its output,
and works with the one it found. The rule is inlined per skill (≤ ~6 lines each) because skills stay
self-contained — no shared reference tree across skills. Mixed is a first-class state, not an error:
reads span both, a write goes where that id already lives, and a duplicate id across the two is refused.

**Acceptance:** each of the seven skills, run against a v1, a v2 and a mixed fixture, names the layout
it found and either works or refuses by name — none writes a second copy of a task.

**DoD:**
- [ ] Population is the 7 skills derived by two selectors (`TODO.md` → 6 skills; `TODO.md|Backlog|Active Sprint` → 7, adds `flow`) — re-derived at G2, not inherited from this line (L-198)
- [ ] Each of the 7 skills carries the detection block and names its layout in its output
- [ ] Retained v1 · v2 · mixed fixtures under `evals/fixtures/layout/`, incl. a duplicate-id case that
      must be **refused** by name
- [ ] Exercised once on real input: `/prime` against this repo (v1) names `v1` — *Verify: its output*
- [ ] Every touched SKILL.md stays ≤ ~140 lines — *Verify: `wc -l`*
- [ ] `docs/adr/ADR-046-the-2-0-hard-cut.md` written (D7: MAJOR, dual support through `2.x`,
      removed at `3.0.0`; the cost of two read paths accepted) and indexed

### T4 — Carry an existing v1 repo across with `/lean-doc-generator migrate` `[size: M · risk: high · class: execution · HITL · J2]`
Layers: `skills/lean-doc-generator/SKILL.md` · `skills/lean-doc-generator/references/migration-map.md` · `evals/fixtures/v1-to-v2/` · `evals/run-v1-to-v2-fixtures.ts` · `README.md` · `CHANGELOG.md`
Depends-on: T1 · T2 · T3
Cites: `TASK-370` · `EPIC-017` scope 7 · D7 · D8 · L-007 · L-016 · `TODO.md` (a copy is migrated; this repo's file is untouched)

The smooth-transition half. `migrate` already is "plan → approve → apply, re-runnable, never
clobber"; this gives it the v1 → v2 mapping instead of a new command. Incremental by design: a repo
may migrate some tasks and stop, which is exactly the mixed state T3 makes safe. The old `TODO.md`
becomes a tombstone that points at `docs/work/` — never deleted here — so a **v1 skill** still
installed with auto-update off finds an empty Backlog rather than a half-read one, and any task it
appends there is reported by a v2 skill as a stray v1 write and offered for ingest, not lost.

**Acceptance:** run on a copy of this repo's `TODO.md` at promote HEAD, `migrate` proposes one file
per Backlog task, applies on approval, and the id set before equals the id set after, both directions.

**DoD:**
- [ ] `skills/lean-doc-generator/references/migration-map.md` gains the v1 → v2 mapping (field by
      field; `state:` and readiness stay orthogonal fields, never folded into the folder)
- [ ] Exercised on real input: a copy of this repo's 22-task Backlog → 22 files — *Verify: id set
      diffed both ways (v1 ids ∖ v2 ids and v2 ids ∖ v1 ids both empty), not a count alone*
- [ ] Re-run is report-only and changes nothing — *Verify: `git status` clean after the second run*
- [ ] Tombstone `TODO.md` shape defined; a task appended to it is surfaced by a v2 `/prime` as a stray
      v1 write — *Verify: retained fixture in `evals/fixtures/v1-to-v2/`*
- [ ] No lean-flow-specific path leaks into the generic skill or reference (L-015) — *Verify: grep
      the two Layers files for `scripts/`*
- [ ] README + CHANGELOG `[Unreleased]` describe the upgrade path an existing user follows

## Decisions (pre-locked)

- **D1** — Scope widened at this promote by owner direction: layout detection (`TASK-369`) and the
  migrate path (`TASK-370`) ride with the foundation, because an adopter needs the way in as soon
  as the store exists. The D8 workdoo proof and the `2.0.0` release stay out, to be decomposed after.
- **D2** — Serial order T1 → T2 → T3 → T4. Shared files have one owner per step: `docs/work/README.md`
  T1 then T2 · `skills/prime/SKILL.md` T2 then T3 · `skills/lean-doc-generator/SKILL.md` T3 then T4.
- **D3** — v1-against-v2 safety comes from the **shape of the migrated tree** (tombstone + stray-write
  ingest), not from changing v1 skills: an installed v1 copy cannot be patched after the fact.
- **D4** — Nothing ships as a release in this sprint. v2 paths land behind detection, so a v1 repo
  sees no behaviour change — the unreleased tree stays safe to use on this repo, which is still v1.

## Assumptions

- **A1** — The copy-into-Plan path and a by-reference member list can coexist in one template for all
  of `2.x`. *Confirm: T2 at G2, against the template.*
- **A2** — A tombstone `TODO.md` is read as "empty Backlog" by the installed 1.66.x skills rather than
  as an error. *Confirm: T4 runs 1.66.1 `/prime` against the tombstone fixture. UNCONFIRMED.*
- **A3** — The migration is expressible as a procedure the agent runs, with no Bun script shipped to
  consumers (ADR-043: a `bun` requirement is not reversible). *Confirm: T4 at G2.*
- **A4** — Governance review signed 2026-09-23: L-promotion none · TD aging 91 of 99 open aged, 6 of 7
  high owned, `TD-128` re-reviewed (fix shipped SPRINT-099, row still open) · caps: 4 soft, 0 hard ·
  epic rollups current · no handoff ledger.

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-106-the-store-and-the-way-in.md`, created
> lazily at the first entry (STANDARD §9 · ADR-014).

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro
