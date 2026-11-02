---
id: TASK-591
title: "Work items carry a type, and a bug item carries its repro, evidence and root-cause report"
sprint: SPRINT-159
priority: P1
size: M
risk: high
autonomy: HITL
class: decision
tier: G
authority: J2
origin: decomposer
state: ready
depends-on: [TASK-590]
---

# TASK-591 — Work items carry a type, and a bug item carries its repro, evidence and root-cause report

## Why
Consumer evidence (ADR-053): the workdoo research copy keeps a `docs/bugs/` folder the standard does not define, because a bug
today is a temp-dir `BUG-<slug>.md` that is never committed (STANDARD §2) and `/diagnose` keeps its root cause only in a commit
message. Owner ruling 2026-11-02: one work store with types, not a separate bugs folder; tech debt stays a ledger.

## Done when
- [x] An ADR and a STANDARD amendment: a work item's frontmatter takes `type: feature | bug | debt` (absent reads as `feature`); ✓ 2026-11-02: ADR-056 and spec 0.19.0 (MINOR, no rule id touched; `6341378f`), wording per the scope-change; outside review 2 rounds, PASS
      a `bug` item carries sections for symptom, repro, expected, actual, evidence, root cause, fix, regression test and prevention;
      evidence for any work item (a bug's repro, a task's verification captures) lives in `docs/work/evidence/TASK-NNN/`, redacted
      before commit, linked from the item, and never moves with status; business facts get a placed row (under `docs/product/`, a
      root `BUSINESS-NOTES.md` accepted as a legacy location); the temp-only `BUG-<slug>.md` intake is replaced by a bug item
      and `S2.R-TEMPDIR` stays (a committed bug-report file remains wrong; scope-change 2026-11-02); a `debt` item cites its
      `TD-NNN`, and `TECH-DEBT.md` stays the debt ledger.
- [x] The bug-item template replaces `BUG.md.template`, and the task-file reference names the `type:` field. ✓ 2026-11-02: `BUG.md.template` rewritten in place as the bug-item body; `task-file.md` names `type:` (`6341378f`)
- [x] Every check that parses work-item frontmatter or the BUG temp rule accepts the new shape, each with a must-FAIL fixture ✓ 2026-11-02: `check-work-type.ts` + qa-check leg; fixtures FAIL with `work-type-unknown`, `bug-item-missing-repro`, `debt-item-missing-td` (each seeded); v1-to-v2 learns `type` (101/101); ownership, placement and §11 fixtures extended; VPS gate 472/0
      (an unknown `type:` value; a bug item missing its repro section) that fails with its named finding.
- [x] CHANGELOG `[Unreleased]` entry; README if a user-visible behaviour changes. ✓ 2026-11-02: CHANGELOG [Unreleased] Changed line; README rows for /triage and /diagnose

## Touches
`spec/STANDARD.md` · `docs/adr/` · `skills/lean-doc-generator/templates/` · `skills/task-decomposer/references/task-file.md` ·
the checks that read work-item frontmatter · CHANGELOG.md

## Assumes
- Ids stay `TASK-NNN` for every type, so id derivation, the sprint freeze and members by reference work unchanged.

## Tracker
Owner rulings 2026-11-02 (one typed store; evidence per item; done/ is the archive) · TASK-590 · `docs/research/adopter-folder-audit.md` (F1-F3; scope-change 2026-11-02)
