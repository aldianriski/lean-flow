---
sprint: 072
slug: conformance-baseline
epic: EPIC-004
owner: Maintainer
last_updated: 2026-08-16
gates_signed: G1,G2 @ 1b2cdb4
plan_commit: 2084001
close_commit: [sha — set at close]
status: active
update_trigger: sprint execute/close events
---

# SPRINT-072 — Conformance Baseline

> **Theme:** EPIC-004's first member, and deliberately **not** the engine. The machinery to answer
> "am I conformant, and at what level?" mostly exists — 11 checkers, 98 retained fixture cases — but
> nothing maps it to the spec, so nobody can say which rules are covered, which are uncovered, and
> which the standard *deliberately declines* to automate. This sprint produces that map and freezes it
> as a baseline. The engine is designed against the baseline, in a later sprint, not against a guess.

## Scope

**In:** a written test separating a normative rule from reference data and rationale, applied to the
densest section first (T1) · classification of every remaining normative rule in `spec/STANDARD.md`
by evidence class (T2 structural, T3 gated + attested) · reconciliation of the whole inventory against
the live checker and fixture corpus, recorded as a durable baseline with the engine's inherited
constraints written down as **findings** (T4).

**Out (deferred):** building or consolidating the conformance engine — the baseline exists to inform
that design, so doing both here would inform it with itself · the ship-inside-the-plugin vs standalone
question (EPIC-004 § Open questions; deferred from "first member G2" to the engine sprint's G2 by D2
below) · **any change to checker architecture**, including the 11 checkers, their findings and their
fixtures · ADR-008's scope amendment (EPIC-004 § Closed-when 5, engine sprint) · `/orchestrator` and
the single-repo execution architecture, which are frozen absent measured evidence of a defect ·
EPIC-005 Fleet, until EPIC-004 produces a stable single-repo conformance contract.

## Plan

### T1 — Fix the rule-classification criteria, then classify spec §2 `[size: M · risk: med · class: decision · HITL]`
Layers: `docs/research/conformance-inventory-criteria.md`
Depends-on: none
Cites: EPIC-004 § Closed-when 2 · ADR-024 (the three levels and their evidence classes) ·
       `spec/STANDARD.md` §2 · L-108 (match by shape, not substring) · CLAUDE.md § cross-check a query
156 gross candidates cannot be classified consistently without a stated test, and §2 is where the test
is hardest: a `Cap` cell is mechanically checkable, a `Create ←` cell is a lifecycle trigger no tool
can observe, and both live in the same row. Settling the criteria against the worst case first is what
stops each later section from inventing its own test.

**Acceptance:** a reader can apply the written test to a rule this task never saw and reach the same
bucket it would have.

**DoD:**
- [ ] The test separating **normative rule** · reference **data** · **rationale** is written down and
      applied, not merely used — *Verify: it names at least one §2 row it excludes and why; a test
      with no exclusions has not been tested*
- [ ] All ~59 §2 candidates classified, each in exactly one bucket — *Verify: bucket counts sum to the
      §2 candidate census re-derived at execution, not to the 59 estimated at promote*
- [ ] Every §2 **rule** carries its conformance level (ADR-024) and a **mechanical | judgment-only**
      mark — *Verify: no rule lacks either field; `judgment-only` is a valid terminal state and needs
      no further justification beyond its stated reason*
- [ ] **A row split across both marks is recorded as such, not forced to one** — *Verify: at least the
      `Cap`-vs-`Create ←` case is represented, since it is the case that motivated the criteria*

### T2 — Classify the remaining structural-evidence sections `[size: M · risk: low · class: execution · HITL]`
Layers: `docs/research/conformance-inventory-structural.md`
Depends-on: T1
Cites: TASK-223's criteria (T1's output) · ADR-024 · `spec/STANDARD.md` §1 §3 §4 §5 §6 §7 §8 §12
The sections whose evidence is the file tree alone. Grouped by evidence class rather than section
number, because evidence class *is* the mapping's level column.

**Acceptance:** every candidate in these eight sections lands in exactly one bucket, under T1's test
rather than a fresh judgement.

**DoD:**
- [ ] §1 · §3 · §4 · §5 · §6 · §7 · §8 · §12 fully classified — *Verify: per-section counts sum to the
      section census re-derived at execution*
- [ ] Each rule carries level + mechanical|judgment-only — *Verify: no rule missing either field*
- [ ] Any rule that T1's test **cannot** cleanly bucket is recorded as a criteria gap and routed back,
      not resolved ad hoc — *Verify: the inventory names the ambiguous rule and what the test lacks;
      silently choosing a bucket is how two sections drift apart*

### T3 — Classify the Gated and Attested sections `[size: M · risk: med · class: execution · HITL]`
Layers: `docs/research/conformance-inventory-gated-attested.md`
Depends-on: T2
Cites: ADR-024 · ADR-025 (§13's claim-vs-proof boundary) · `spec/STANDARD.md` §9 §10 §11 §13
Planning-record evidence (§9 §10 §11) and git-history evidence (§13). This is where a rule is most
likely to be **stated but not yet checkable** — §13 is three sprints old and §9's `gates_signed:` and
`*Verify:*` definitions landed last sprint.

**Acceptance:** every candidate classified, with the *evidence a tool would actually read* named per
rule — the file, field or git object, not the section it came from.

**DoD:**
- [ ] §9 · §10 · §11 · §13 fully classified — *Verify: counts sum to the re-derived census*
- [ ] Each rule names the **artifact a tool would read** to check it — *Verify: "the sprint file" is
      not an answer; the field or the git object is*
- [ ] **Stated-but-not-yet-checkable rules are marked as coverage findings, not as defects** —
      *Verify: the inventory distinguishes "no checker exists" from "not checkable in principle"*
- [ ] §13's claim-vs-proof boundary survives classification — *Verify: an unsigned trailer is not
      recorded as satisfying an Attested rule (ADR-025); if it is, the classification is wrong*

### T4 — Reconcile the inventory against the checker corpus and record the baseline `[size: M · risk: high · class: decision · HITL]`
Layers: `docs/research/conformance-baseline.md` · `docs/epic/EPIC-004-conformance.md`
Depends-on: T2, T3
Cites: EPIC-004 § Closed-when 2 and 3 · L-058 (a gate needs a named must-FAIL fixture) · TD-012
       (fixtures are retained) · EPIC-002 D3 (the 11 stand alone until a spec exists to read) ·
       L-097 · L-130 (re-derive a figure entering a frozen artifact)
Owns `docs/epic/EPIC-004-conformance.md`. The reconciliation is the sprint's actual product: an
inventory nothing has been checked against is a claim, not a baseline.

**Acceptance:** for every classified rule, a reader can see whether a checker covers it, which named
finding fires, whether a retained must-FAIL fixture proves that finding, and what is uncovered — and
can tell *uncovered* apart from *deliberately judgment-only*.

**DoD:**
- [ ] Every rule carries `checker → named finding → must-FAIL fixture → coverage status` —
      *Verify: no rule left blank; "none" is a value and is different from an empty cell*
- [ ] The corpus side is **re-derived, not copied from EPIC-004's text** — *Verify: the epic claims
      "~82 named findings across 16 harnesses"; measured at promote it is 11 checkers · 22 harnesses
      (17 asserting) · 98 cases · 46 distinct findings. Re-measure and correct the epic*
- [ ] **Coverage status distinguishes `uncovered` from `judgment-only`** — *Verify: both appear, and
      collapsing them would misreport a deliberate boundary as a gap*
- [ ] Findings the engine inherits are **recorded, not acted on** — *Verify: `git diff` touches no
      `scripts/lib/check-*.sh`, no `evals/**`, and no `skills/orchestrator/**`*
- [ ] The baseline is committed as a durable artifact under `docs/research/` — *Verify: it survives
      the close; a baseline living only in an Execution Log is not one*
- [ ] EPIC-004 § Closed-when 2 ticked **only if** every normative rule is genuinely classified —
      *Verify: the epic file; a partial classification is reported as partial*

## Decisions (pre-locked)

- **D1 — The consumer-facing output is a level + named findings + judgment-required items. No
  percentage, no score, no grade.** This answers EPIC-004's open question ("a level, a percentage, or
  a list?") in the direction the epic already leaned: a percentage invites gaming and averages a
  deliberate judgment-only boundary together with a real gap. Owner ruling at this promote. **→ no ADR
  here** — it constrains the engine, and the engine's ADR records it.
- **D2 — The packaging question is deferred from "first member G2" to the engine sprint's G2.**
  EPIC-004 § Open questions routes ship-inside-the-plugin vs standalone to the first member's G2,
  which is this one. Deferred deliberately: the choice depends on which rules turn out mechanically
  checkable without the plugin present, and that is precisely what this sprint measures. Deferring a
  decision *to the evidence that decides it* is not the same as parking it. **→ no ADR.**
- **D3 — A wrapper around the 11 hard-coded checkers does not satisfy "spec-driven" (EPIC-004 D1).**
  Recorded now, before the baseline exists, so the baseline is not quietly shaped into a justification
  for the cheaper build. The engine must read the spec as its rule source; the 46 named findings and
  their retained fixtures are the contract it must preserve, not the design it must copy. **→ no ADR
  here; the engine's ADR inherits it.**
- **D4 — This sprint changes no checker architecture and no execution architecture.** The single-repo
  execution loop is frozen absent measured evidence of a defect; architecture findings are recorded as
  findings. T4's fourth DoD makes this mechanically checkable rather than a promise. **→ no ADR.**

## Assumptions

- **A1** — The spec's normative surface is **156 gross candidates across 13 sections**, concentrated in
  §2 (59), §12 (22), §10 (16), §11 (13). *Confirm: measured at this promote by counting table rows +
  bold-lead statements + bold bullets. **This is an upper bound, not a rule count** — separating rules
  from reference data is T1's job, and every per-section figure is re-derived at execution (L-130).*
- **A2** — The corpus is **11 checkers · 22 harnesses (17 asserting cases) · 98 fixture cases · 46
  distinct finding strings**. *Confirm: measured 2026-08-16 by two queries that had to agree (cases vs
  distinct strings). **EPIC-004's own "~82 findings across 16 harnesses" is stale** and is corrected by
  T4 rather than carried forward.*
- **A3** — Governance at this promote: L-promotion **none** (109 entries reconciled) · TD aging **four
  rows re-reviewed and held** — TD-057, TD-053, TD-050, TD-049 — with the note that **three of them
  have unblock conditions pointing at EPIC-004** (TD-053 leg 1 names D1; TD-057 is the `Layers:`
  matcher contract an engine must read; TD-049 waits on a DoD/`Tn` format change an engine may force)
  · no §2 cap breach. *Confirm: governance checklist, owner-signed 2026-08-16.*
- **A4** — Those three rows are **read by, not resolved in, this sprint.** Pulling TD-057 in was
  offered at promote and declined: it is a checker-architecture change, which D4 excludes. *Confirm:
  owner ruling 2026-08-16; each row's re-review records the successor that should consume it.*
- **A5** — Skills are **1.45.0 base-dir == 1.45.0 repo → fresh**, for the first time in four sprints.
  *Confirm: reinstalled 2026-08-16 via `claude plugin update` after `marketplace update`; the first
  `plugin install` reported "already installed" and changed nothing, so the version was verified on
  disk rather than from the installer's report (L-021 · L-057).*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-072-conformance-baseline.md`, rendered from
> `templates/sprint-log.md.template` and created lazily at the first entry. Append there, never here:
> the Log grows with the work done, so keeping it out of this file is what stops it consuming the
> 400-line budget the Plan needs (STANDARD §9 · ADR-014). The `logs/` subdirectory is load-bearing —
> the sprint-file checks glob `docs/sprint/SPRINT-*.md` non-recursively, so a same-directory
> `-log.md` sibling would be capped and schema-checked as if it were a Plan.

## Files Changed

<!-- Filled during execution; feeds CHANGELOG at close. -->

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro

<!-- Written at close. Route the buckets to durable homes (STANDARD §10):
     shipped → CHANGELOG.md (root) · tech debt → TD-NNN · follow-ups → TASK-NNN · learnings → docs/LEARNINGS.md.
     After close, the file moves → docs/sprint/archive/ + a one-line entry in docs/sprint/INDEX.md (§11). -->
