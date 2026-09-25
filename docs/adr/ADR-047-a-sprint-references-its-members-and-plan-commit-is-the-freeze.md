---
id: ADR-047
tags: [process, docs]
domain: doc-standard
status: accepted
related: [ADR-045, ADR-046, ADR-014]
---

# ADR-047 — A sprint references its members, and `plan_commit` is the freeze

- **Status:** accepted (2026-09-24)
- **Deciders:** Maintainer
- **Context driver:** EPIC-017 D2 ("→ ADR") — `promote` stops copying task content into the sprint
  file. Removing the copy must not remove the Plan freeze it used to carry (SPRINT-107 A1, the
  riskiest assumption in the epic, grilled and confirmed at SPRINT-107 G2).

## Context

Through `1.x`, `promote` rendered each task's DoD into the sprint Plan as checkboxes. With the
work-item store (ADR-045) every task also has a file whose `## Done when` is its own DoD, so each task
carried **two** DoDs and only one was ticked. SPRINT-106 measured the cost: 17 boxes ticked in the Plan,
0 in the five member files, five conflicts reported by `migrate`'s real-input run, and a v2 `/prime`
(which counts files) that would have misreported the sprint (`TD-179`). The interim fix — the
coordinator mirroring ticks by hand — is a standing chore that exists only because of the copy.

The copy also did one useful thing: the Plan committed at `plan locked` was a frozen snapshot, and a
later edit to a DoD box showed up as a diff to § Plan, which the Execution Log discipline forbids
without a `scope-change` entry. Deleting the copy naively would leave member files freely editable
for the whole sprint with nothing pinned — a weaker freeze traded for less drift.

## Decision

**A sprint references its members; it never copies them.** `promote` moves each member
`backlog/ → todo/` by `git mv` in its own commit (ADR-045), stamps `sprint:`, and writes a sprint file
whose `## Members` lists the files and whose § Plan `Tn` blocks carry only sprint-scoped meta (header
meta, `Layers:`, `Depends-on:`, `Cites:`, `**Acceptance:**`) — no DoD checkboxes. `close` verifies every
member sits in `done/` or `cancel/` and never counts Plan boxes.

**`plan_commit` is the freeze.** No hash field is added: git already holds every member exactly as
approved. A member is resolved **by TASK id** in the `plan_commit` tree (so its later folder moves do
not matter), and its `## Done when` there is compared with the current file's, ignoring tick state (and
the ` ✓ <evidence>` a tick appends) and line endings. A `## Amended <date>` section sits outside
`## Done when` and is never compared. Any other difference FAILs unless the sprint's Execution Log has
a `scope-change` **entry** — the event of its heading, not a prose mention — naming that id.

## Consequences

**Positive:** one DoD per task, so the drift class and the mirroring chore both disappear (`TD-179`
resolves). The freeze is at least as strong as before: the old one caught an edit only if someone
looked at the Plan diff; this one is a mechanical comparison run at close. It survives folder moves
because it keys on id, and it costs no new field to keep right. Verified by a retained Tier G harness
(`evals/run-by-reference-fixtures.ts`) with must-FAIL fixtures per finding, selection-varying cases,
and a seeded-break proof; pointed at SPRINT-107 itself (`plan_commit 3e0e710`), it reports all five
members unedited.

**Negative (trade-offs accepted):** the freeze check needs git history — a `plan_commit` that no
longer resolves (a rewritten or shallow history) reads as nothing frozen, which the check reports as a
failure rather than a pass. Plan-reading checkers that counted § Plan DoD boxes find none in a
by-reference sprint and must be retargeted onto member files (tracked separately in EPIC-017).

**Amended 2026-09-25 (SPRINT-107 T1, outside review round 1).** The first build left two holes, and
both are now closed. (1) *Population:* membership is read at `plan_commit` **and** now. A member that
leaves both indices must be scoped out by a `scope-change` entry (else `MEMBER-DROPPED`). A task that
joins mid-sprint needs one too (else `MEMBER-UNPLANNED`), and its baseline is the first commit that
stamps or lists it (owner ruling, G2). (2) *Time:* a `scope-change` counts only if it is new since the
member's baseline. `plan_commit` must be an ancestor of `HEAD`, must contain the sprint file, and may
be no later than the commit that first recorded it. So it cannot be moved forward to re-freeze an edit,
while a repair that moves it earlier still passes.

## Alternatives considered

| Option | Why rejected |
|---|---|
| Keep the Plan copy and mirror ticks into member files | Two DoDs per task is the drift itself; mirroring is a chore that exists only because of the copy (`TD-179`) |
| Store a per-member content hash in the `## Members` list | A second fact to keep right beside the one git already holds; `plan_commit` pins the same content with nothing new to maintain (owner ruling, SPRINT-107 G2) |
| Compare whole member files, not `## Done when` | Every tick, evidence note, `## Amended` note and frontmatter change would trip it, so the check would be ignored within a sprint |
