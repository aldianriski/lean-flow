---
sprint: 048
slug: epic-layer-citations
owner: Maintainer
last_updated: 2026-08-09
status: active
plan_commit: fixture
close_commit: fixture
update_trigger: fixture -- must-PASS input for evals/run-layers-completeness-fixtures.sh (SPRINT-049
  T3); not a real sprint file and not read by any other qa-check.sh leg
---

# SPRINT-048 — Epic Layer (citation fixture, must-PASS input)

<!-- NOT the real SPRINT-048 file (closed, archived at docs/sprint/archive/SPRINT-048-epic-layer.md,
     untouched by this task). It reproduces the three false-positive shapes recorded in TD-032,
     lifted from the real Plan's DoD items at commits 45ff548 / 68bdc7e / c401a0e, with the `Cites:`
     escape added. Every flagged token below sat INSIDE a DoD checkbox item in the real file -- which
     is why TD-032's proposed "scan DoD/Acceptance only, skip the rationale paragraph" narrowing
     would have fixed none of them, and why the escape is declarative instead.

     This fixture must exit 0. If it ever FAILs, the escape stopped working and the gate has resumed
     shaping documentation to keep itself quiet -- the exact cost TD-032 was filed to stop. -->

## Plan

### T1 — Add the EPIC doc layer, proven on a real epic `[size: M · risk: med · class: execution · HITL]`
Layers: `skills/lean-doc-generator/templates/EPIC.md.template`
Depends-on: none
Cites: `fog-fleet-orchestration.md`

Shape 1 of 3 (real, commit 45ff548): a research doc named inside a DoD item as a **source read**
while retro-fitting the epic. Nothing in the task touches it.

**Acceptance:** a real epic exists on disk, rendered from the template.

**DoD:**
- [ ] One real epic rendered on real input, retro-fitted from the SPRINT-025/026 archives plus
      `fog-fleet-orchestration.md`, which is read as a source and not modified

### T7 — Move PRD creation to the generator `[size: S · risk: low · class: execution · HITL]`
Layers: `skills/lean-doc-generator/SKILL.md`
Depends-on: none
Cites: `requirements.md` `templates/product-requirements.md.template` `references/prd-and-slices.md`

Shape 2 of 3 (real, commit 68bdc7e): filenames named inside a DoD item while **explaining a
pipeline** — the feature PRD and the project-scoped requirements doc are distinct artifacts, and
saying so requires naming both files without touching either.

**Acceptance:** the generator owns PRD creation, and the two artifacts are distinguished in prose.

**DoD:**
- [ ] `references/prd-and-slices.md` keeps the slicing half; its PRD format is **not** removed — it
      is a *feature* PRD, not a duplicate of the *project*-scoped `requirements.md` rendered from
      `templates/product-requirements.md.template`. The "remove as duplication" premise was wrong

### T2 — Wire the epic into decompose, promote and close `[size: M · risk: med · class: execution · HITL]`
Layers: `skills/task-decomposer/SKILL.md`
Depends-on: none
Cites: T6

Shape 3 of 3 (real, commit c401a0e): another task's id named inside a DoD item as a **retrospective
note** — recording that T6 dissolved a constraint. It is a citation, not a dependency; declaring it
in `Depends-on:` would assert an ordering edge that never existed.

**Acceptance:** the chain fires end-to-end once on a real epic.

**DoD:**
- [ ] Chain fired end-to-end; the line-neutral constraint was **dissolved by T6** (110/110 → 114/140)
      and no longer applies
