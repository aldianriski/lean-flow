---
id: ADR-056
tags: [process, docs]
domain: governance
status: accepted
related: [ADR-045, ADR-047, ADR-053, ADR-034, ADR-018]
---

<!-- One ADR per file · append-only (never edit a decided ADR — mark it deprecated/superseded) · WHY only. -->

# ADR-056 — Work items carry a type, and a bug becomes a work item with its evidence and root cause

- **Status:** accepted (2026-11-02, owner, at SPRINT-159 intake and G2)
- **Deciders:** Maintainer
- **Context driver:** consumer evidence (ADR-053): an adopter kept bug material and verification captures in folders the standard
  does not place, and the owner found bugs unmanaged end to end.

## Context

A bug was the one kind of work lean-flow did not keep. Its report was a temp-dir `BUG-<slug>.md`, never committed; `/diagnose`
recorded its root cause only in a commit message; nothing in `/prime` or the loop counted it. SPRINT-159's adopter audit
(`docs/research/adopter-folder-audit.md`) found the cost: the one adopter with real activity kept an owner-supplied defect
screenshot in an ad-hoc `docs/bugs/`, a reproduction and cause write-up inside a capture folder's README, and 546 of its 709 doc
files as verification evidence in a folder no rule places. Both adopters kept their business facts in a root file with no row.

## Decision

- **One work store, typed.** A work item's frontmatter takes an optional `type: feature | bug | debt`; absent reads as `feature`.
  Ids stay `TASK-NNN` for every type, so the folders still carry status (ADR-045) and the sprint freeze and members by reference
  (ADR-047) work unchanged.
- **A bug is a work item.** A `type: bug` item carries its symptom, repro, expected and actual behaviour, evidence, and later its
  root cause, fix, regression test and prevention. `/triage` writes the intake into it; `/diagnose` completes it. The temp-only
  report is no longer used; `S2.R-TEMPDIR` stays unchanged, because a committed bug-report file is still the wrong place.
- **Evidence lives on the item.** Evidence for any work item lives in `docs/work/evidence/TASK-NNN/`, redacted before commit,
  linked from the item, and never moved by a status change; it owes no ownership header and never holds a `.log` file. It is
  history for §11 (it never keeps its own task alive) and is pruned with its item; §12c names it a record of what was observed,
  not a build product, so the rule that keeps command-reproducible output out of git does not apply to it.
- **Debt stays a ledger.** `TECH-DEBT.md` remains the list of known debt; when one is scheduled it becomes a `type: debt` item that
  cites its `TD-NNN`.
- **Business facts get a row.** `product/business-notes.md`, created lazily; a root `BUSINESS-NOTES.md` is accepted as a legacy
  location, so a design has a known file to open.

## Consequences

- The standard grows by rows and an optional field, with no rule id removed: spec 0.19.0, MINOR (§15).
- Every check that reads work-item frontmatter keeps working; one new maintainer check validates the `type:` value and the shape
  each type owes, and the ownership-header walk skips the evidence folder.
- `migrate` must bring adopted repos across without rewriting their untyped tasks, and propose (never force) moving existing bug
  material and capture folders onto items.

## Alternatives considered

- **A separate `docs/bugs/` with its own status.** Rejected: a second status system beside the folders, which drifts.
- **A `BUG-NNN` id family.** Rejected: every id-keyed check (derivation, the freeze, members by reference) would be rewritten.
- **Migrating `TECH-DEBT.md` into work items.** Rejected for now (owner): large, for little gain; the ledger is groomed at promote.
- **Retiring `S2.R-TEMPDIR`.** Rejected: removing a rule id is MAJOR and the ids are frozen (ADR-034); the rule is still right.
