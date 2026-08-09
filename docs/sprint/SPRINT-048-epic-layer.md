---
sprint: 048
slug: epic-layer
owner: Maintainer
last_updated: 2026-08-09
status: active
plan_commit: [pending — recorded in the follow-up commit]
close_commit: [sha — set at close]
update_trigger: sprint execute/close events
---

# SPRINT-048 — Epic Layer

> **Theme:** `/task-decomposer` has advertised an `--epic "Name"` input since before there was
> anywhere for an epic to live — no template, no `docs/` home, no §2 lifecycle row. Multi-sprint work
> is consequently homeless: the "fleet epic" is referenced as a bare `TASK-089`, charted ad hoc by a
> fog-map, and its status reconstructable only by reading three sprint archives. This sprint gives the
> layer a home and wires it into the loop. It also spends the headroom SPRINT-047 created — five tasks
> against ~12 capacity, where the six sprints before the split averaged three.

## Scope

**In:** the EPIC doc layer and its loop wiring; the two adoption keepers from the mattpocock re-scan;
the aged TD-029 launcher fix.
**Out (deferred):** proving bulk on a real night run (TASK-148 — still `blocked`; its done-when needs a
≥10-task Plan and this one has five). Moving Files Changed / Retro out of the Plan file to chase
capacity past ~12 — considered at SPRINT-047 close and rejected as reopening ADR-014 for a gain nothing
has shown to be needed.

## Plan

### T1 — Add the EPIC doc layer (template + §2 lifecycle row) `[size: M · risk: med · class: decision · HITL]`
Layers: `skills/lean-doc-generator/templates/EPIC.md.template` · `skills/lean-doc-generator/references/DOCS_Guide.md` · `.claude/CLAUDE.md` · `.claude/CONTEXT.md` · `docs/architecture/overview.md` · `docs/epic/`
Depends-on: none

An epic is a multi-sprint outcome with its own decision set — too big for one 400-line Plan, outliving
any single sprint file. It gets `docs/epic/EPIC-NNN-<slug>.md` mirroring the proven `docs/sprint/`
shape, with a lazily-created INDEX and an archive leg. **Note the template count is linted in three
places** and moved 30 → 31 only last sprint; this makes it 32.

**Acceptance:** a real epic exists on disk, rendered from the template — the fleet epic, retro-fitted
from the SPRINT-025/026 archives and the AGENTS.md adoption research (both read as sources, neither
edited) — and `sh scripts/qa-check.sh` is green.

**DoD:**
- [ ] `EPIC.md.template` created; read before writing anything from it (Step 6 is mandatory)
- [ ] DOCS_Guide §2 gains the `epic/EPIC-NNN-<slug>.md` row — reader · cap · create/update/archive triggers
- [ ] DOCS_Guide §11 gains the epic's retention leg (archive when every member sprint has closed)
- [ ] Linted template counts moved 31 → 32 in `.claude/CLAUDE.md` **and** `docs/architecture/overview.md`; `.claude/CONTEXT.md` § Doc standard updated for accuracy
- [ ] **One real epic rendered on real input** — the fleet epic, not a placeholder (L-007)
- [ ] `sh scripts/qa-check.sh` green on a bare run (never piped — L-057)

### T2 — Wire the epic into decompose → promote → close `[size: M · risk: med · class: execution · HITL]`
Layers: `skills/task-decomposer/SKILL.md` · `skills/lean-doc-generator/SKILL.md` · `skills/lean-doc-generator/templates/SPRINT.md.template` · `.claude/CONTEXT.md` · `README.md`
Depends-on: T1

A capability written only in its own file is half-shipped (L-020). The epic has three trigger points —
the decomposer consumes one, promote stamps membership, close rolls the outcome up — and none of them
know it exists yet. **`lean-doc-generator/SKILL.md` sits at its 110-line cap**, so edits there must be
line-neutral.

**Acceptance:** the chain fires end-to-end once on T1's real epic — decompose it into tasks, promote a
sprint stamped with `epic:`, and roll that sprint's outcome back up — not merely described in the docs.

**DoD:**
- [ ] `--epic` resolves to a real epic doc and decomposes it into `TASK-NNN`
- [ ] `promote` sets `epic:` frontmatter on member sprints; `SPRINT.md.template` carries the field
- [ ] `close` rolls the member sprint's outcome up into the epic
- [ ] `.claude/CONTEXT.md` SSOT + `README.md` reflect the new layer (consumer-facing — L-015)
- [ ] The chain **fires end-to-end** on T1's epic; edits to `lean-doc-generator/SKILL.md` stay line-neutral
- [ ] `sh scripts/qa-check.sh` green on a bare run

### T3 — Replace the grill's "one question at a time" rule with frontier batching `[size: S · risk: med · class: decision · HITL]`
Layers: `.claude/CLAUDE.md` · `.claude/CONTEXT.md` · `skills/task-decomposer/SKILL.md` · `skills/orchestrator/SKILL.md`
Depends-on: none

Our rule bans batching outright; the real discriminator is **dependency, not count**. Batching
*dependent* questions is bad because the user must guess at inputs they have not given; batching
*independent* ones is free. SPRINT-047 demonstrated the gap live — two popups carried two independent
questions each, justified ad hoc as "not stacked ambiguity". **`.claude/CLAUDE.md` is at its 80-line
cap**, so this must be line-neutral there.

**Acceptance:** the grill rule states the dependency discriminator and the fact/decision separation,
and the "four questions at once" red flag no longer contradicts it.

**DoD:**
- [ ] Rule restated: ask every question whose prerequisites are settled as one round, serialise only dependents, stop when the frontier is empty
- [ ] The "four questions at once is faster" red flag reworded so it forbids *dependent* batching, not all batching
- [ ] "Finding facts is the agent's job, never the user's" stated — an open fact is a prerequisite in the tree, not a question for the user
- [ ] All four touchpoints agree; `.claude/CLAUDE.md` edits line-neutral (80/80)
- [ ] `sh scripts/qa-check.sh` green on a bare run

### T4 — Adopt the disclosure test + completion-criteria sharpness `[size: S · risk: low · class: execution · HITL]`
Layers: `docs/adr/ADR-006-skill-cap-executable-artifacts.md` · `skills/lean-doc-generator/references/DOCS_Guide.md`
Depends-on: none

ADR-006 gives the *mechanism* for progressive disclosure (procedure in SKILL.md, artifacts in
`references/`) but no *criterion* for deciding which is which — a cap is a size limit, not a test.
"Inline what every path needs; disclose what only some reach" supplies it. ADRs are append-only once
decided, so this lands as an amendment note rather than an edit to the decided text.

**Acceptance:** ADR-006 carries the branching test as an amendment, and the DoD/Acceptance guidance
states that completion criteria are behavioural levers.

**DoD:**
- [ ] ADR-006 amended (append-only — a dated amendment note, never an edit to the decided text)
- [ ] The branching test stated where authors will meet it, not only in the ADR
- [ ] Completion-criteria guidance added: demand "every rule applied", not "understanding reached"
- [ ] `sh scripts/qa-check.sh` green on a bare run

### T5 — Fix the launcher's DEAD-ON-ARRIVAL false verdict `[size: S · risk: low · class: execution · HITL]`
Layers: `scripts/night-run.sh` · `skills/orchestrator/references/night-run.md` · `TECH-DEBT.md`
Depends-on: none

TD-029, open three sprints and escalated at this promote rather than deferred again. Its stated
mechanism — `--output-format json` buffers until exit, so the log stays empty and a healthy run reads
as dead — is a **hypothesis nobody has tested**, which is exactly L-087's shape. Reproduce first.

**Acceptance:** a genuinely healthy run is no longer reported `DEAD-ON-ARRIVAL`, and whatever the
launcher now reports was chosen *after* the buffering claim was confirmed or refuted.

**DoD:**
- [ ] Buffering claim **reproduced or refuted** before any fix is chosen (L-087)
- [ ] Fix applied: accept `stream-json` and treat any new line as progress, **or** report a named `UNKNOWN` for a buffered format
- [ ] The calibration row's `total_cost_usd` need still met, or the trade-off stated explicitly
- [ ] Exercised against a run that is genuinely healthy — the false-positive case, not just the happy path
- [ ] TD-029 marked `resolved → SPRINT-048 T5`
- [ ] `sh scripts/qa-check.sh` green on a bare run

## Owner-action checklist
<!-- Omit if none. -->
- [ ] None identified at promote.

## Decisions (pre-locked)
- **D1** — the epic mirrors `docs/sprint/` (`docs/epic/` + lazy `INDEX.md` + `archive/`) rather than
  nesting under `docs/product/` or living as a section of `requirements.md`. It is an execution
  container, not a product artifact, and the sprint shape is already proven in this repo.
- **D2** — T1 and T2 are separate tasks despite being one feature. Shipping ≠ wiring (L-020); keeping
  the wiring as its own task with its own fires-end-to-end acceptance is what stops the layer landing
  half-connected.
- **D3** — T5's first DoD item is reproduction, not the fix. TD-029 carries a plausible mechanism that
  has never been tested, and L-087 was promoted this same promote for exactly this failure.

## Assumptions
- **A1** — `/lean-doc-generator` owns epic *creation*; `/task-decomposer --epic` *consumes* one. *Confirm: G2 — it decides which skill grows.*
- **A2** — adding `EPIC.md.template` makes 32 core + 2 non-core; three linted count claims move together or the gate fails. *Confirm: `qa-check.sh:40-59`.*
- **A3** — two files are at hard caps (`CLAUDE.md` 80/80, `lean-doc-generator/SKILL.md` 110/110), so T2 and T3 must edit them line-neutrally. *Confirm: the cap legs of `qa-check.sh`.*
- **A4** — T3 changes a rule this very loop runs on, so the change applies to the sprint executing it. *Confirm: use the new rule for T1/T2's own grilling and note whether it held.*
- **A5** — T1–T5 are mutually disjoint except T2→T1; no shared file across tasks. *Confirm: G2 overlap map before the first task.*

## Execution Log

> **Lives in its own file** — [`logs/SPRINT-048-epic-layer.md`](logs/SPRINT-048-epic-layer.md),
> append-only and uncapped, created at the first entry (ADR-014). Append there, never here. This is
> the first sprint *born* in the split format; SPRINT-047 kept its log inline by design.

## Files Changed
<!-- Filled during execution; feeds CHANGELOG at close. -->

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| | | | | |

## Retro
<!-- Written at close. Route the buckets to durable homes (DOCS_Guide §10):
     shipped → CHANGELOG.md (root) · tech debt → TD-NNN · follow-ups → TASK-NNN · learnings → docs/LEARNINGS.md.
     After close, the Plan AND its log move → docs/sprint/archive/ + archive/logs/ (§11), same commit. -->

**Retrieval check** — did we fail to find, or contradict, a prior `L-NNN`/ADR this sprint?

**Cost** — what this sprint cost to run, and in what shape (inline · coordinator + N agents). Cost per unit **delivered**, not attempted. Unavailable → say so rather than omitting the line.

**Worked**

**Friction**

**Pattern candidate** (surface to user → `docs/LEARNINGS.md`)
