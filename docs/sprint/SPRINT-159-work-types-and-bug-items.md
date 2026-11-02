---
sprint: 159
slug: work-types-and-bug-items
stream: docs-structure
owner: Maintainer
last_updated: 2026-11-02
status: active
plan_commit: 9604dd69
gates_signed: G1,G2 @ 635b85de
update_trigger: sprint execute/close events
---

# SPRINT-159 — Work Types, Bug Items and Research Folders

> **Theme:** Bugs are the one kind of work lean-flow does not keep: a report lives in the temp folder, its root cause only in a
> commit message, and adopters have started keeping their own `docs/bugs/` beside the standard. This sprint makes a bug a typed
> work item that carries its repro, evidence and root-cause report through `/triage` and `/diagnose`, wires it into `/prime`,
> `/flow` and the close, brings adopted repos across by `migrate`, and puts `docs/research/` into topic folders.

## Scope

**In:** an adopter-side folder audit with a ruling per finding (T1, TASK-590) · work items typed `feature | bug | debt` and the bug
item with its evidence folder (T2, TASK-591) · `/triage` files and `/diagnose` completes a bug item (T3, TASK-592) · `/prime`,
`/flow` and the close retro see bugs (T4, TASK-593) · `migrate` brings adopted repos across (T5, TASK-594) · research topic folders
with the standard and the index generator first (T6, TASK-589).
**Out (deferred):** migrating `TECH-DEBT.md` rows into work items (owner: the ledger stays) · EPIC-023 bundle 3 (TASK-587, 588) ·
the generator's CRLF fix and `docs/development/setup.md` (SPRINT-157's T1 and T4 own them) · a release.

## Members

- docs/work/todo/TASK-590-audit-what-adopters-keep-outside-the-standard.md
- docs/work/todo/TASK-591-work-items-carry-a-type-and-a-bug-item-carries-its-evidence-and-rca.md
- docs/work/todo/TASK-592-triage-files-a-bug-item-and-diagnose-writes-its-root-cause.md
- docs/work/todo/TASK-593-prime-flow-and-the-close-retro-see-bug-items.md
- docs/work/todo/TASK-594-migrate-brings-adopted-repos-onto-typed-work-items.md
- docs/work/todo/TASK-589-organise-docs-research-into-topic-folders.md

## Plan

### T1 — Audit what adopters keep outside the standard `[size: S · risk: low · class: decision · HITL · J2]`
Layers: `docs/research/`
Depends-on: none
Cites: TASK-590 · `spec/STANDARD.md` §2
The adopter copies are read, not changed; each finding gets an owner ruling, and a finding that changes a later task enters it by a
logged scope-change.

**Acceptance:** a research doc lists every unplaced folder with its ruling, read by the owner.

### T2 — Work items carry a type; a bug item carries its repro, evidence and root cause `[size: M · risk: high · class: decision · HITL · J2]`
Layers: `spec/` · `docs/adr/` · `docs/DECISIONS.md` · `skills/lean-doc-generator/` · `skills/lean-doc-generator/templates/BUG.md.template` · `skills/task-decomposer/` · `scripts/` · `evals/` · `CHANGELOG.md` · `README.md`
Depends-on: T1
Cites: TASK-591 · ADR-053 (consumer evidence) · ADR-018 · `TECH-DEBT.md` (the debt ledger, unchanged)
One store with types, ids unchanged, the debt ledger kept; the temp-only bug report is retired by ADR, and every check that reads
work-item frontmatter is taught the new shape with a must-FAIL fixture.

**Acceptance:** a bug item validates, an unknown type and a bug without a repro each fail their named check.

### T3 — /triage files a bug item and /diagnose completes it `[size: M · risk: med · class: decision · HITL · J2]`
Layers: `skills/triage/` · `skills/diagnose/` · `docs/work/` · `CHANGELOG.md` · `scripts/lib/check-sprint-by-reference.ts` · `evals/` · `TECH-DEBT.md`
Depends-on: T2
Cites: TASK-592 · TD-285
The intake goes into the item and its evidence folder through `/triage`; `/diagnose` writes the root cause, fix, regression test
and prevention at its post-mortem.

**Acceptance:** one real bug ends as a complete bug item with redacted evidence, read by the owner.

### T4 — /prime, /flow and the close retro see bug items `[size: S · risk: low · class: decision · HITL · J2]`
Layers: `skills/prime/` · `skills/flow/` · `skills/lean-doc-generator/` · `CHANGELOG.md`
Depends-on: T2, T3
Cites: TASK-593 · CLAUDE.md § Definition of Done (wiring check)
A bug item no session start reports and no conductor routes is unwired.

**Acceptance:** T3's bug item is counted by `/prime`, routed by `/flow` and listed by the close.

### T5 — migrate brings adopted repos onto typed work items `[size: M · risk: high · class: decision · HITL · J2]`
Layers: `skills/lean-doc-generator/` · `CHANGELOG.md` · `README.md`
Depends-on: T2, T4
Cites: TASK-594 · consumer evidence: workdoo `docs/bugs/`
Untyped tasks read as features with no rewrite; an existing bugs folder is proposed as bug items and moved only on approval.

**Acceptance:** migrate on the workdoo research copy proposes its bugs folder as a bug item and changes nothing else.

### T6 — Research topic folders, with the standard and the index generator first `[size: M · risk: med · class: decision · HITL · J2]`
Layers: `spec/` · `docs/adr/` · `docs/DECISIONS.md` · `scripts/` · `evals/` · `docs/research/` · `docs/product/` · `docs/deployment/` · `docs/qa/` · `docs/knowledge-index.md` · `CHANGELOG.md`
Depends-on: T1, T2
Cites: TASK-589 · SPRINT-158 research audit
Topic folders are defined in the standard before anything moves; the generator and the cap check read them; low-citation series
move with every link updated.

**Acceptance:** the three series sit in their folders and the knowledge index lists every moved doc.

## Decisions (pre-locked)

- **D1** — One typed work store (owner, 2026-11-02): `type: feature | bug | debt`, ids stay `TASK-NNN`, evidence per item in
  `docs/work/evidence/TASK-NNN/`, `done/` is the archive; `TECH-DEBT.md` stays the debt ledger.
- **D2** — Shared files: `spec/STANDARD.md`, `docs/adr/` and `docs/DECISIONS.md` in commit order T2 then T6;
  `skills/lean-doc-generator/` T2, T4, T5 in that order; `CHANGELOG.md` in commit order, staged per hunk.
- **D3** — Cross-stream (SPRINT-157, stream verification, unmerged): its T1 fixes `scripts/gen-index.sh` for CRLF, its T2 edits
  `skills/diagnose/SKILL.md`, its T4 refreshes `docs/development/setup.md`. T6 does not repeat the CRLF fix or touch `setup.md`;
  T3's edit to `skills/diagnose/SKILL.md` is staged per hunk and reconciled at that branch's merge.
- **D4** — Testing per EPIC-023 D16: behaviour is shown by development runs on research copies (parallel where there are several);
  no measured arm, since no A/B endpoint changes. Never a live repo in `D:\Project` other than lean-flow.
- **D5** — Execution pieces (checker and generator code) are Codex-built and Claude-reviewed; every material skill change gets its
  scoped review logged before close.

## Assumptions

- **A1** — A STANDARD amendment bumps the versioned spec (ADR-023) and the bump is part of T2 and T6. *Confirm: at G2.*
- **A2** — The workdoo research copy's `docs/bugs/` (one screenshot) is enough to show the migration. *Confirm: T1's audit.*

## Execution Log

> **Lives in its own file** — [`logs/SPRINT-159-work-types-and-bug-items.md`](logs/SPRINT-159-work-types-and-bug-items.md)
> (STANDARD §9 · ADR-014). Append there, never here.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro
<!-- Written at close. Route the buckets to durable homes (STANDARD §10):
     shipped → CHANGELOG.md (root; legacy docs/) · tech debt → TD-NNN · follow-ups → TASK-NNN · learnings → docs/LEARNINGS.md.
     After close, the file moves → docs/sprint/archive/ + a one-line entry in docs/sprint/INDEX.md (§11). -->
