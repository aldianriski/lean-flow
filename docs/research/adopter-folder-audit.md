---
owner: Maintainer
last_updated: 2026-11-02
update_trigger: A new adopter census, or a ruling below is revisited
status: current
id: adopter-folder-audit
tags: [process]
domain: governance
related: [ADR-053, ADR-056]
---

# Research — What do adopters keep outside the standard, and where should it go?

> **Question.** Which folders and files do repos on lean-flow keep that STANDARD §2 does not place, and what should the standard
> do about each?
> **Verdict.** Give evidence a home on the work item, give business facts a row, and place the five legitimate extras in §2; bug
> material confirms the typed bug item. Owner-ruled 2026-11-02 (SPRINT-159 T1).

## Why this matters

The owner found the docs messy and some work unmanaged, bugs above all (their evidence, reproduction and root cause). Adopters
answer the gaps the standard leaves by inventing folders, and an invented folder is invisible to every skill: nothing reads it,
links it or migrates it.

## Options considered

1. Audit lean-flow alone: its own `docs/` was already audited in SPRINT-158 and says little about adopters.
2. **A read-only census of the adopters against §2 (chosen):** the population is the A/B adopter copies `D:\Research\dev156\workdoo`
   and `D:\Research\dev156\clinic` plus lean-flow's own `docs/`, each listed, matched to §2's placed patterns, and cross-checked by
   a second plain file listing that must leave exactly the unplaced findings.

## Findings

Cross-check: workdoo 709 files, 586 unplaced, all covered by the findings; clinic 13 files, 0 unplaced; lean-flow 622 files, 27
unplaced, all covered.

| # | Repo | Path | Holds | Files | Written by a skill |
|---|---|---|---|---|---|
| F1 | workdoo | `docs/preview/**` | browser-capture evidence per slice: 507 PNG, 24 JSON, 15 README (one records a reported defect, its reproduction and cause) | 546 | no (repo scripts `verify-*-browser.mjs`) |
| F2 | workdoo | `docs/bugs/image.png` | an owner-supplied defect screenshot, cited by TASK-081 and TASK-085; no bug record exists | 1 | no |
| F3 | workdoo, clinic | root `BUSINESS-NOTES.md` | the owner's business facts | 1 each | no |
| F4 | workdoo | `docs/testing/*-review.md`, `product/company-workspace-*`, `database/company-workspace-model*`, `architecture/*-contract*`, `development/*` | per-feature sibling docs beside placed core files | 26 | no |
| F5 | workdoo | `docs/archive/` | history moved verbatim by `migrate` | 8 | yes (`migrate`) |
| F6 | workdoo | `docs/design/*.png` | owner reference mockups, cited by tasks | 5 | no |
| F7 | lean-flow | `docs/QA.md`, `docs/qa/` | the repo's QA checklist and test cases (named by the orchestrator and the QA test-case template) | 5 | partly |
| F8 | lean-flow | `docs/knowledge-index.md` | the generated knowledge index | 1 | generator script |
| F9 | lean-flow | `docs/research/logs/qa-profile-round16.tsv` | measurement data beside the logs | 1 | no |
| F10 | lean-flow | `docs/research/storm/` | a copied skill (SKILL.md and an HTML template) | 2 | no |
| F11 | lean-flow | `docs/strategy/adlc/` | an exploratory pack declaring `governed: false` (§3) | 12 | no |
| F12 | lean-flow | `docs/development/Lean-Flow-Governance-Roadmap-2026-2027.md`, `docs/roadmap/*.zip` | a roadmap outside `product/`; an ignored archive | 2 | no |

Missing where activity suggests it: workdoo has bug fixes with no bug record (F2, and the cause only in a preview README), and its
verification evidence is not linked from the task files it proves.

## Recommendation

Owner rulings, 2026-11-02 (popup):
- **F1, F2 → TASK-591 and TASK-594.** Evidence lives on the work item for every type, `docs/work/evidence/TASK-NNN/`, linked from
  the item; `migrate` proposes mapping existing capture folders and bug material onto their items and applies only what is approved.
- **F3 → TASK-591.** Business facts get a placed row (under `docs/product/`, with a root `BUSINESS-NOTES.md` accepted as a legacy
  location), so a design has a known file to open (EPIC-023 TASK-587).
- **F4, F5, F7, F8, F9 → TASK-589.** Its §2 amendment also places per-feature sibling docs, `docs/archive/`, `docs/qa/` with
  `QA.md`, the generated knowledge index and data files under `research/logs/`.
- **F10 → a backlog task** (TASK-595): decide `storm/` under ADR-001's curation bar; nothing moves in this sprint.
- **F6, F11 keep:** mockups sit with the optional design contract; the exploratory pack is compliant under §3.
- **F12 → TASK-589** (already in its scope: the roadmap moves under `product/`; the zip is ignored and stays).

## Out of scope / open questions

- Moving any adopter file: the census was read-only, and `migrate` (TASK-594) proposes, never forces.
- Migrating `TECH-DEBT.md` into work items (owner: the ledger stays).
