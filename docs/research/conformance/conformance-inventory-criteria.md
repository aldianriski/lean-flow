---
owner: Maintainer
last_updated: 2026-08-16
update_trigger: The classification test changes, or §2's normative surface changes
status: current
id: conformance-inventory-criteria
tags: [process, docs]
domain: governance
related: [platform-readiness-audit]
---

# Conformance inventory — the classification test, applied to §2

SPRINT-072 T1. The test that separates a **normative rule** from everything else in
`spec/STANDARD.md`, fixed against §2 because §2 is the hardest case, then applied to it. T2 and T3
apply this test; they do not re-derive it. Baseline reconciliation is `conformance-baseline.md`.

## The test

A candidate is a **normative rule** iff you can write *"this repo violates it"* and have that
sentence be true or false of a repository. Everything else is one of three non-rules:

| Bucket | Test | Why it is not a rule |
|---|---|---|
| **rule** | "this repo violates it" is decidable | it constrains a repo |
| **data** | it supplies a value a rule consumes (a cap number, a reader role, a path) | violating a number is meaningless; you violate the *rule that reads* it |
| **rationale** | deleting it changes no repo's conformance | it explains, it does not constrain |
| **structure** | the document's own scaffolding (table headers, sub-table labels) | it constrains the spec's layout, not a repo |

Then every **rule** carries two marks:

- **Level** (ADR-024) — Structural (file tree alone) · Gated (planning records) · Attested (git history alone).
- **Mechanical** iff a tool can decide it from named evidence with no interpretation; otherwise
  **judgment-only**. *Judgment-only is a terminal state, not a failure to automate.* Forcing a rule
  mechanical is how a standard starts checking a proxy for the thing it cares about.

**Exclusions, named — a test with no exclusions has not been tested.** §2 has **3 table header rows**
(`| File | Reader | Cap | … |`, ×3) and **2 sub-table labels** (`**Root files:**`, `**AI context
(.claude/):**`). All five are **structure**: they constrain how §2 is laid out, and no repository can
violate them. Also excluded as **rationale**: the `**A figure a checker reads is exact…**` block and
its two `- **Drift**` / `- **The cap was never reachable**` bullets, which explain how to respond to a
cap that resists fixing — advice to a maintainer, not a constraint on a repo.

## The finding that shapes the whole inventory: a §2 row is not a rule

A row is a **parameter set**, not a constraint. `| README.md | Anyone | no hard cap¹ | init (always) |
project scope changes | — |` carries six cells with three different levels and both marks:

| Cell | Bucket | Level | Mark |
|---|---|---|---|
| `File` (+ its implied path) | rule | Structural | **mechanical** — the file is there or it is not |
| `Cap` | rule | Structural | **mechanical** — count lines, compare |
| `Reader` | data | — | — |
| `Create ←` | rule | Gated | **judgment-only** — a *trigger*: "created when X happened". No tool observes that X happened |
| `Update ←` | rule | Gated | **judgment-only** — same shape; freshness is a proxy, not the rule |
| `Archive` | rule | Structural | **mechanical** where the leg names a path (`→ docs/sprint/archive/`); **judgment-only** where it reads `—` or names a condition (§11) |
| `Tier` (docs/ table only) | rule | Structural | **judgment-only** — whether the repo *needs* the tier (§6) is a property of the project, not the tree |

**So §2 yields rule *families* parameterised by 37 rows, not 37 rules.** Six families cover every
row; an engine checks each family once and iterates the rows as its input. This is the difference
between a spec-driven engine and eleven hard-coded checkers (EPIC-004 D1, D3): the families are the
rules, the table is the data.

Recorded because it is the case that motivated the test: **`Cap` and `Create ←` sit in the same row
and land in different levels *and* different marks.** A classification whose unit was the row would
have had to force one, and would have been wrong either way.

## §2 classification

**Rule families over the 37 rows** (11 root · 2 AI-context · 24 `docs/` tree):

| # | Family | Level | Mark | Evidence a tool reads |
|---|---|---|---|---|
| R1 | the file exists at its canonical path | Structural | mechanical | the file tree |
| R2 | the file is within its stated cap | Structural | mechanical | line count vs §2 `Cap` (soft reports, hard fails — ADR-015) |
| R3 | the file was created by its `Create ←` trigger | Gated | judgment-only | none — the trigger is an event, not a state |
| R4 | the file is refreshed on its `Update ←` trigger | Gated | judgment-only | none — freshness is a proxy |
| R5 | the file's `Archive` leg was followed | Structural | mechanical *where a path is named*, else judgment-only | archive dir membership (§11) |
| R6 | the row's `Tier` gate is satisfied for this repo | Structural | judgment-only | the project's own shape (§6) |

**Standalone rules in §2** (the 15 normative statements, sub-table labels excluded):

| Rule | Level | Mark | Note |
|---|---|---|---|
| Placement is canonical (root vs `.claude/` vs `docs/`) | Structural | mechanical | the strongest rule in §2 |
| Growth rule — cap-hit splits, never squeezes | Structural | judgment-only | a split is visible; *"never squeezed"* is not |
| LAW 1 reinterpreted — the mandatory minimum is scaffolded at init | Structural | mechanical | reduces to R1 over the mandatory subset |
| Temp-dir artifacts are never committed | Structural | mechanical | absence of named patterns in the tree |
| Template-as-canonical-format | Structural | judgment-only | "matches the template" is a similarity judgement |
| Template-load protocol (mandatory) | Gated | judgment-only | a procedure, unobservable in the artifact |
| Create lazily — no empty scaffolds | Structural | mechanical | a doc with only frontmatter is decidable |
| DESIGN.md is optional / non-core | Structural | data-bearing rule | mechanical only as *"its absence is not a violation"* |
| SKILL.md ≤ ~140 procedure + scaffolding (ADR-006) | Structural | **judgment-only** | the cap counts *procedure*, and separating procedure from artifact is a reading |
| The disclosure test — inline vs `references/` | Structural | judgment-only | explicitly a judgement |
| Completion criteria are a behavioural lever | Structural | judgment-only | about content quality |
| SKILL.md skeleton — exactly 6 frontmatter fields, in order | Structural | mechanical | a field list and an order; fully decidable |
| Bash scoping — enumerable subcommands | Structural | judgment-only | "where the set is enumerable" is a judgement |
| References use `${CLAUDE_SKILL_DIR}`; never into another skill | Structural | mechanical | a path pattern, position-anchored |

## Reconciliation

| Bucket | Count |
|---|---|
| rule — families (each over 37 rows) | 6 |
| rule — standalone | 14 |
| data (cells: `Reader`, and `Tier` as a value) | 2 cell-classes |
| rationale (the exact-figure block + its 2 bullets) | 3 |
| structure (3 table headers + 2 sub-table labels) | 5 |

**Census check.** §2's gross candidates re-derived at execution: **59** = 40 table rows (37 data + 3
headers) + 17 bold-lead + 2 bullets. The promote estimate was also 59 — they agree. The 37 data rows
resolve into the 6 families rather than into 37 separate rules, which is why the rule count is 20
(6 + 14) and not 54.

**Mark split, counted exactly rather than rounded:** **8 clean mechanical** (R1 · R2 · placement ·
LAW-1-minimum · temp-dir · create-lazily · SKILL-skeleton · references-path) · **10 clean
judgment-only** (R3 · R4 · R6 · growth-rule · template-as-format · template-load · SKILL-cap ·
disclosure-test · completion-criteria · bash-scoping) · **2 split** (R5, mechanical only where the
archive leg names a path; DESIGN.md, mechanical only as *"its absence is not a violation"*).
8 + 10 + 2 = 20. That ratio is the first real signal about how much of this standard an engine can
ever check — and at best **half of §2**, which is lower than the epic's framing ("the machinery
exists and points inward") implies. §2 is the most mechanical section in the spec, so this is the
optimistic end.
