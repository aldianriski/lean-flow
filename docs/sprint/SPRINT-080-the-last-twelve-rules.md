---
sprint: 080
slug: the-last-twelve-rules
epic: EPIC-004
owner: Maintainer
last_updated: 2026-08-23
status: active
plan_commit: ad4932d
close_commit: [sha — set at close]
update_trigger: sprint execute/close events
---

# SPRINT-080 — The Last Twelve Rules

> **Theme:** EPIC-004 has one condition left and no decision left in it. § Closed-when 2's residual
> was removed at SPRINT-079 — the eleven rules that satisfied neither half are marked in the spec —
> so what remains is arithmetic: **39 of 51**, and the twelve outstanding `build` rules are
> `TASK-250` · `TASK-251` · `TASK-252`, verified by diff against the register to be exactly that set,
> no residue either way. Cover them and the condition ticks, all five conditions are met, and the
> epic closes. **This sprint is the epic's last, unless it finds a reason not to be** — which is a
> real possibility worth naming up front, because the last two sprints each found a defect in the
> checks they were writing rather than in the repository.

## Scope

**In:**
- `S11.TDDELETE` · `S11.TODOCAP` · `S11.LEARNINGS` · `S11.BACKLOG` — §11's ledger-retention rules.
- `S11.SPRINT` · `S11.LOGPAIR` · `S11.CHANGELOG` · `S11.WHENITRUNS` — §11's archival rules, five findings.
- `S12.SECRETS` · `S12.BACKUPS` · `S12.DESIGNSRC` · `S12.GENERATED` — §12's git boundary.
- Coverage **39 → 51 of 51**; `build` **12 → 0**; EPIC-004's § Closed-when 2 ruled, and the epic
  closed if it ticks.

**Out (deferred):**
- **TD-073 — the harness cost, with a trip-wire rather than a shrug.** `run-sprint-family-fixtures.sh`
  is already the most expensive in the set (~5 min for 23 cases, because every case runs the whole
  engine against the shipped spec). Twelve rules with a must-FAIL and a control each is ~24 more
  cases — roughly **+6 min on a harness that is opt-in and therefore already invisible to the default
  gate**. Deferred because the epic's close is the point of this sprint, **but not ignored: if the
  harness passes ~10 minutes, stop and fix TD-073 before adding the rest.** A cost that doubles
  mid-sprint stops being debt and becomes this sprint's problem (L-150).
- **EPIC-004's §2 cap breach** (215 > 200) — ruled *deferred once more* at this promote, conditioned:
  if this sprint closes the epic, §11 archival resolves it by moving the file, which §2's Growth rule
  prefers to a diet. **If it does not close, the deferral has run out** — trim at SPRINT-081's
  promote, no third pass.
- **TD-070's shared `read-spec-files.sh`** — now six parsers. Not this sprint; the twelve rules below
  add no new §2 parser, so it does not grow here.

## Plan

### T1 — Cover §11's ledger-retention rules `[size: M · risk: low · class: execution · AFK]`
Layers: `scripts/lib/conformance-engine.sh` · `evals/run-sprint-family-fixtures.sh` · `docs/research/conformance-dispositions.md` · `docs/research/conformance-coverage.md`
Depends-on: none
Cites: the register's § `build` (§11's four ledger rows) · §11's Conformance table · L-058 · L-108 · TD-012 · `S11.TDDELETE` · `S11.TODOCAP` · `S11.LEARNINGS` · `S11.BACKLOG` · `TECH-DEBT.md` (read as input, never edited by this task)

Four rules that read this repository's own ledgers, so all four have real input to be exercised on
before any fixture is written — which is how SPRINT-079 found three defects in its own checks.

**Acceptance:** `S11.TDDELETE` → `resolved-td-row-past-retention`; `S11.TODOCAP` →
`todo-over-cap-at-promote`; `S11.LEARNINGS` → `promoted-learning-not-collapsed`; `S11.BACKLOG` →
`shipped-backlog-entry-retained` — each with a retained fixture that reddens on input that must
produce it, and a control proving it stays silent on the compliant shape.

**DoD:**
- [ ] The four ids and their findings are re-derived from the register, not copied from this Plan — *Verify: the § `build` §11 rows*
- [ ] **Each rule is run against this repository before its fixture is written**, and what it says is recorded — *Verify: `S11.LEARNINGS` must find L-144 (a promoted entry deliberately uncollapsed, with a recorded exception) and `S11.TDDELETE` must find TD-048/057/065 are 2 sprints from deletion, not past it; both are live states this ledger is in today*
- [ ] **A false-positive boundary per rule, each fixed by a control.** `S11.LEARNINGS` must not fire on an entry whose exception is recorded; `S11.TDDELETE` must not fire before 3 sprints; `S11.TODOCAP` reads §2's cap rather than a number written here (L-097); `S11.BACKLOG` must not fire on a Backlog entry for work that never shipped
- [ ] Every threshold read from the spec, none written into the checker — *Verify: change it in a scratch spec copy and watch the check follow, with no code edit*
- [ ] Retained fixture + control per finding — *Verify: the harness prints its own tally*
- [ ] Shown to **discriminate**: seed a targeted break per rule, confirm it lands (`cmp`, 0 line delta), still **parses**, reddens its own case, and leaves a sibling green (L-137 · L-142)
- [ ] Rows migrate register → coverage doc; counts reconcile to **51** — *Verify: the engine's own `coverage:` line, not this Plan's arithmetic*

### T2 — Cover §11's archival rules `[size: M · risk: low · class: execution · AFK]`
Layers: `scripts/lib/conformance-engine.sh` · `evals/run-sprint-family-fixtures.sh` · `docs/research/conformance-dispositions.md` · `docs/research/conformance-coverage.md`
Depends-on: T1
Cites: the register's § `build` (§11's four archival rows) · §11's Conformance table · ADR-014 · L-105 · L-058 · `S11.SPRINT` · `S11.LOGPAIR` · `S11.CHANGELOG` · `S11.WHENITRUNS`

Four rules, **five findings**. `S11.WHENITRUNS` is L-105 rebuilt as a check — *close-time triggers
execute at close, scan-based ones at promote* — so its fixture must distinguish **ran in the wrong
phase** from **did not run**, which are different states and only one is a finding.

**Acceptance:** `S11.SPRINT` → `closed-sprint-not-archived` · `sprint-index-row-missing`;
`S11.LOGPAIR` → `sprint-log-archived-apart-from-plan`; `S11.CHANGELOG` →
`changelog-not-rotated-at-minor`; `S11.WHENITRUNS` → `retention-trigger-ran-in-wrong-phase`.

**DoD:**
- [ ] Ids and findings re-derived from the register — *Verify: the § `build` §11 rows*
- [ ] **Run against this repository first**, where SPRINT-079's retention just executed — *Verify: `S11.LOGPAIR` must PASS on a Plan and log archived in one commit (`75a4fbd`), and `S11.CHANGELOG` must PASS on a root carrying exactly current + previous*
- [ ] `S11.WHENITRUNS` distinguishes **wrong phase** from **not run** — *Verify: two fixtures, one per state; a check that conflates them reports a finding nobody can act on*
- [ ] `S11.SPRINT`'s two findings are separable — an unarchived sprint and a missing INDEX row are different repairs and must not share one line (L-058)
- [ ] Retained fixture + control per finding; git-backed where the rule is defined over history
- [ ] Discrimination shown as in T1
- [ ] Rows migrate; counts reconcile to **51**

### T3 — Cover §12's git-boundary rules `[size: M · risk: med · class: execution · HITL]`
Layers: `scripts/lib/conformance-engine.sh` · `evals/run-sprint-family-fixtures.sh` · `docs/research/conformance-dispositions.md` · `docs/research/conformance-coverage.md`
Depends-on: T2
Cites: the register's § `build` (§12's four rows) and its § `scope-out` reason (c) · §12's never-commit table · L-058 · L-146 · `S12.SECRETS` · `S12.BACKUPS` · `S12.DESIGNSRC` · `S12.GENERATED` · `.env.example` · `contract.md` (the benign lookalikes the controls are built from) · T1

**The false-positive family, and the register says so in its own words:** a filename heuristic that
flags `contract.md` in a repo about contract testing *"is worse than no scan"*. §12's six content
categories are `judgment-only` for exactly this reason; these four are the shape-detectable ones and
they are still the riskiest in the epic. **How far detection goes is a G2 design call, not settled
here.**

**Acceptance:** `S12.SECRETS` → `secret-committed`; `S12.BACKUPS` → `database-backup-committed`;
`S12.DESIGNSRC` → `design-source-committed`; `S12.GENERATED` → `generated-artifact-committed` — each
with a retained fixture **and a benign-lookalike control**, which is the load-bearing one.

**DoD:**
- [ ] Ids and findings re-derived; the register's reason (c) read before designing, not after
- [ ] **The benign-lookalike control exists per rule and is written FIRST** — a `.env.example`, a small fake seed file, an asset the app actually uses, a checked-in artifact a build legitimately needs. *Verify: each control passes against a repo that contains the lookalike and nothing prohibited*
- [ ] Detection scope ruled at G2 and **recorded with its reason** — extension · path · content · size, and what was refused. A rule that silently over-reaches is worse than one that under-reaches here
- [ ] **Run against this repository** — *Verify: lean-flow must come back clean on all four, and if it does not, the finding is triaged as real-or-artefact before the check ships (the SPRINT-076 T3 method)*
- [ ] Retained fixture per finding + the lookalike control; discrimination shown as in T1
- [ ] Rows migrate; **`build` reaches 0** and coverage reads **51 of 51** — *Verify: the engine's `coverage:` line*

### T4 — Rule § Closed-when 2, and close EPIC-004 if it ticks `[size: S · risk: low · class: decision · HITL]`
Layers: `docs/epic/EPIC-004-conformance.md` · `docs/research/conformance-dispositions.md` · `docs/adr/`
Depends-on: T3
Cites: EPIC-004 § Closed-when 2 (its SPRINT-079 wording, and the prior wording preserved beneath it) · L-088 · SPRINT-076 T4's ruling that the bar stands · `check-epic-archive.sh` (run, never edited)

The condition has refused three looser readings across SPRINT-075/076/077 and was amended once, on
the record. **It is ruled here on the same terms — evidence first, and the answer is allowed to be
no.**

**Acceptance:** § Closed-when 2 is `[x]` with its evidence, or it is not and the row says exactly what
is missing. If it ticks and the other four hold, EPIC-004 is closed; if not, the epic stays open and
this sprint says why.

**DoD:**
- [ ] Coverage re-derived from the **engine**, not from this Plan or the register — *Verify: `sh conformance.sh .` prints `coverage:` and the two counts sum to 51*
- [ ] Both halves of the condition checked separately: *maps to a check* **and** *explicitly marked in the spec* — the second was met at SPRINT-079 and is re-verified, not assumed
- [ ] **No amendment to the condition to make it tick.** If it does not tick, that is the outcome and it is recorded — refused at SPRINT-075 and SPRINT-076 on exactly this ground (L-088)
- [ ] The other four conditions re-checked, not carried forward on trust — *Verify: `check-epic-archive.sh` reports 0 of 5 open before any close*
- [ ] If closed: `status: closed` on the epic, its INDEX row kept, and archival proposed under §11 — *Verify: §11 archives an epic only when every member sprint is closed **and** every condition is `[x]`, never on sprint count*
- [ ] If **not** closed: § Closed-when 2 records what remains and SPRINT-081's shape is named in § Out

## Owner-action checklist
- [ ] **Reinstall the plugin if the session is still on 1.48.0 skills** — the repo shipped 1.53.0 this sprint (L-021).

## Decisions (pre-locked)

- **D1 — All four tasks share `scripts/lib/conformance-engine.sh`, the fixture harness and both
  register docs, so this sprint is fully SEQUENTIAL.** T1 → T2 → T3 → T4, matching `Depends-on`. No
  worktree dispatch; stage shared files per-hunk if anything is ever concurrent (L-042).
- **D2 — Each task runs its rules against THIS repository before writing fixtures.** Not a nicety: it
  is how SPRINT-079 found two §9 rules contradicting each other, an octal abort, and eleven false
  gaps. A fixture is built to the shape its author already has in mind; real input is not.
- **D3 — EPIC-004's cap breach is deferred once more, conditioned on this sprint closing the epic.**
  If it closes, §11 archival resolves it by moving the file. If it does not, the deferral has run out
  and it is trimmed at SPRINT-081's promote — no third pass.
- **D4 — TD-073 has a trip-wire, not a deferral.** If `run-sprint-family-fixtures.sh` passes ~10
  minutes, stop and fix it before adding more cases (§ Out).

## Assumptions

- **A1 — the twelve `build` rules are exactly `TASK-250` + `TASK-251` + `TASK-252`.** *Confirmed at
  this promote by diffing the task union against the register's § `build`: 12 vs 12, identical, no
  residue either way. Re-derive at G2 — the register is the source, not this line.*
- **A2 — nothing in this Plan changes the checkable denominator.** Covering a `build` rule moves it
  from `build` to covered; it does not re-mark anything. *Confirm: 51 before and after; if a rule
  turns out to need a mark instead of a check, that is a T4-shaped decision and a `scope-change`.*
- **A3 — §12's four rules are shape-detectable and the other six are correctly `judgment-only`.**
  *Confirm at T3's G2, reading the register's reason (c) first. If detection cannot be made specific
  enough to clear the benign-lookalike control, the honest outcome is a mark, not a weak check.*
- **A4 — this repository is clean against §12 today.** *Confirm at T3 by running it; a finding here is
  triaged real-or-artefact before the check ships, never quietened to make our own tree pass.*
- **A5 — the aggregate gate is ~13 min and the fixture harness ~5 min before this sprint adds to it.**
  *Confirm: per-task legs gate each commit, the aggregate runs once at close (owner ruling, SPRINT-079).*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-080-the-last-twelve-rules.md`, rendered from
> `templates/sprint-log.md.template` and created lazily at the first entry. Append there, never here
> (STANDARD §9 · ADR-014).

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| | | | | |

## Retro

<!-- Written at close. Route the buckets to durable homes (STANDARD §10):
     shipped → CHANGELOG.md · tech debt → TD-NNN · follow-ups → TASK-NNN · learnings → docs/LEARNINGS.md. -->

**Retrieval check** — did we fail to find, or contradict, a prior `L-NNN`/ADR this sprint?

**Cost** — what this sprint cost to run, and in what shape (inline · coordinator + N agents).

**Worked**

**Friction**

**Pattern candidate** (surface to user → `docs/LEARNINGS.md`)
