---
sprint: 159
slug: work-types-and-bug-items
stream: docs-structure
owner: Maintainer
last_updated: 2026-11-02
status: closed
close_commit: 4872cfb5
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
Cites: TASK-590 · `spec/STANDARD.md` §2 · `storm/` (finding F10, ruled to TASK-595, never touched here)
The adopter copies are read, not changed; each finding gets an owner ruling, and a finding that changes a later task enters it by a
logged scope-change.

**Acceptance:** a research doc lists every unplaced folder with its ruling, read by the owner.

### T2 — Work items carry a type; a bug item carries its repro, evidence and root cause `[size: M · risk: high · class: decision · HITL · J2]`
Layers: `spec/` · `docs/adr/` · `docs/DECISIONS.md` · `skills/lean-doc-generator/` · `skills/lean-doc-generator/templates/BUG.md.template` · `skills/task-decomposer/` · `skills/task-decomposer/references/task-file.md` · `scripts/` · `scripts/lib/check-work-type.ts` · `evals/` · `CHANGELOG.md` · `README.md` · `docs/work/README.md` · `docs/QA.md` · `.claude/CONTEXT.md`
Depends-on: T1
Cites: TASK-591 · ADR-053 (consumer evidence) · ADR-018 · `TECH-DEBT.md` (the debt ledger, unchanged) · `BUSINESS-NOTES.md` (an adopter's legacy location, never touched here) · `storm/` (named only by a log note on T1's Cites)
One store with types, ids unchanged, the debt ledger kept; the temp-only bug report is retired by ADR, and every check that reads
work-item frontmatter is taught the new shape with a must-FAIL fixture.

**Acceptance:** a bug item validates, an unknown type and a bug without a repro each fail their named check.

### T3 — /triage files a bug item and /diagnose completes it `[size: M · risk: med · class: decision · HITL · J2]`
Layers: `skills/triage/` · `skills/diagnose/` · `docs/work/` · `CHANGELOG.md` · `scripts/lib/check-sprint-by-reference.ts` · `evals/` · `TECH-DEBT.md` · `.claude/CONTEXT.md`
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
Layers: `spec/` · `docs/adr/` · `docs/DECISIONS.md` · `scripts/` · `evals/` · `docs/research/` · `docs/product/` · `docs/deployment/` · `docs/qa/` · `docs/knowledge-index.md` · `CHANGELOG.md` · `TECH-DEBT.md` · `docs/LEARNINGS.md` · `.out-of-scope/` · `docs/development/`
Depends-on: T1, T2
Cites: TASK-589 · SPRINT-158 research audit · `QA.md` (placed by the §2 amendment, not edited) · `skills/task-decomposer/references/task-file.md` and `scripts/lib/check-work-type.ts` (named only by a log note on T2's Layers)
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
| `spec/STANDARD.md` · `spec/CHANGELOG.md` · `docs/adr/ADR-056`, `ADR-057` | T2, T6 | typed work items, bug items, evidence, business facts; research topic folders and placed extras; spec 0.19.0 MINOR | high | outside review 2 rounds each, VPS gate 479/0 |
| `scripts/lib/check-work-type.ts` · `conformance-engine.sh` · `qa-check.sh` · `evals/` | T2 | the type check and its leg; the ownership walk skips item evidence; evidence is §11 history | high | seeded fixtures, outside review |
| `skills/triage/`, `skills/diagnose/`, `skills/prime/`, `skills/flow/`, `skills/lean-doc-generator/` · `.claude/CONTEXT.md` | T3, T4, T5 | the bug item through intake, diagnosis, session start, the conductor, the close and migrate | med | headless real-input runs, Codex reviews |
| `scripts/lib/check-sprint-by-reference.ts` · `evals/run-by-reference-fixtures.ts` | T3 | TD-285 fixed as bug item TASK-596 | high | fixtures fail on the old code, outside review 2 rounds |
| `scripts/gen-index.sh` · `scripts/lib/check-research-archive.sh` · `docs/research/` | T6 | topic folders read; three series moved; links updated | med | fixtures, regenerated index |
| `docs/research/adopter-folder-audit.md` | T1 | the adopter census and its rulings | low | cross-checked listing |

## Retro
<!-- Written at close. Route the buckets to durable homes (STANDARD §10):
     shipped → CHANGELOG.md (root; legacy docs/) · tech debt → TD-NNN · follow-ups → TASK-NNN · learnings → docs/LEARNINGS.md.
     After close, the file moves → docs/sprint/archive/ + a one-line entry in docs/sprint/INDEX.md (§11). -->

**Outcome** — 6 of 6 members delivered (TASK-590, 591, 592, 593, 594, 589). A bug is now a work item: `type: feature | bug | debt`
on every work item, a bug item carrying its repro, evidence and root cause, evidence on the item in `docs/work/evidence/TASK-NNN/`
(ADR-056). `/triage` files it, `/diagnose` completes it, `/prime` counts it, `/flow` routes it, the close lists it, and `migrate`
brings adopted repos across, proposing and never forcing. `docs/research/` has three topic folders, and five kinds of doc adopters
already keep have a §2 place (ADR-057). Spec 0.19.0 (MINOR).

**Bugs fixed this sprint** — TASK-596 (TD-285): the sprint checker reported `LOG-REWRITTEN` for an append-only log, because git's
copy detection linked a new sprint log to the previous sprint's log and the baseline was read from it; it now stops at a copy from
another sprint and fails closed on unresolved history.

**Retrieval check** — one miss, one hold. Missed: four frozen Done-whens needed a scope-change once real input arrived (the evidence
scope, the bug rule's wording, the migrate target copy, the CR fix another stream owns). Held: the adopter census settled the
evidence, business-facts and placement questions by fact before any design was signed.

**Cost** — headless real-input runs about $7 (triage $0.63, diagnose $2.00, prime $0.37, flow $0.52, migrate plan $1.80, apply
$1.44). Codex: T2 checks 63.0k + 80.3k, T2 review 57.1k + 33.5k, T3 review and fix 38.7k + 75.1k + 37.5k, T4 review 43.1k + ~20k,
T5/T6 review 45.5k + ~15k, T6 build 77.0k (about 590k). Builder checks: six Sonnet readers, about 315k.

**Worked**
- The adopter census before the designs: three of the four rulings it produced reshaped the tasks.
- Headless runs of the changed skills from a pinned clone (L-284).
- Codex outside reviews: a too-wide evidence skip, a secret-copy path in migrate, a stall in /flow's routing, a same-sprint
  history gap in the checker fix.

**Friction**
- The always-loaded token budget had a margin of a few tokens; two CONTEXT.md lines were trimmed to fit.
- Notes appended under a scope-change heading (L-283), and one `chore(work):` subject reworded on the unpushed range.
- Heredocs with apostrophes broke the shell wrapper twice; scripts went into files.

**Pattern candidates**
- L-283 (count 1): give every Execution Log note its own heading.
- L-284 (count 1): show a skill change by running it headless from a pinned clone.

**Buckets routed** — Shipped: CHANGELOG [Unreleased] (TASK-591, 592, 593, 594, 589; the TASK-596 fix). Tech debt: TD-288 (an
unnumbered sprint path in the checker). Follow-ups: TASK-595 (`storm/` under the curation bar). Learnings: L-283, L-284.
