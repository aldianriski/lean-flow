---
sprint: 079
slug: the-undifferentiated-middle
epic: EPIC-004
owner: Maintainer
last_updated: 2026-08-23
status: active
plan_commit: d692b93
close_commit: [sha — set at close]
update_trigger: sprint execute/close events
---

# SPRINT-079 — The Undifferentiated Middle

> **Theme:** EPIC-004's last open condition has two halves, and only the coverage half has been
> moving. The other half is eleven `scope-out` rules that satisfy *neither* — not checked, not marked
> judgment-only — a residual the register has flagged since SPRINT-073 and which the epic's own ruling
> at SPRINT-076 named as a separate decision it would not race against coverage. This sprint takes
> that decision **first**, because ruling it can only change what the coverage tasks must build; ruling
> it afterwards means re-opening a frozen Plan. Then it banks the two §2 gaps SPRINT-078 reported
> rather than guessed at, and takes the first two coverage families.

## Scope

**In:**
- Rule all 11 `scope-out` rules — checked · re-marked judgment-only · or accepted as a third state.
- Close the two §2 spec gaps `S6.MULTISVC` and `S6.MEDIUM` ran into (Multi-service's three docs · `DECISIONS.md` addressable as a literal path).
- Cover §9's sprint-file family (5 rules → 6 findings) and §10's learning-governance family (4 rules).
- Coverage moves **30 → 39 of 62**; the engine's own line **24 → 33**.

**Out (deferred):**
- **TASK-250 · TASK-251 · TASK-252** — §11's ledger + archival families and §12's git boundary, 12 of
  the 21 `build` rules. Held for SPRINT-080, which is then the epic-closing sprint. Deliberate: the
  gate is at ~11 minutes and TD-071 says its cost scales with coverage, so pulling all 21 here doubles
  the largest sprint the epic has run against its slowest gate (L-150 measured what that costs).
- **TD-071 itself** — the gate's cost scaling. Named as this sprint's live constraint, not fixed by it.
- **EPIC-004's §2 cap breach** (213 > 200 soft) — ruled *deferred* at this promote, see **D3**.
- **`docs/research/conformance-coverage.md`'s own growth trajectory** — it lands at 124/130 and gains
  roughly a line per rule covered, so it breaches inside two sprints. Named here rather than pre-solved;
  §6's tree split is the documented route when it does.

## Plan

### T1 — Rule on the 11 `scope-out` rules `[size: S · risk: low · class: decision · HITL]`
Layers: `spec/STANDARD.md` · `spec/CHANGELOG.md` · `docs/research/conformance-dispositions.md` · `docs/epic/EPIC-004-conformance.md` · `docs/adr/`
Depends-on: none
Cites: EPIC-004 § Closed-when 2 (*"plus a separate ruling on whether the 11 `scope-out` rules are checked, re-marked, or accepted as a third state the wording does not admit"*) · SPRINT-076 T4's ruling that the bar stands · the register's § `scope-out` section · L-088 · T4 · T5

The register forbids a rule sitting in an undifferentiated middle, and eleven of them have sat there
since SPRINT-073. This runs first in the sprint because its outcome is an input to T4/T5: a rule ruled
*checked* joins the `build` set those tasks draw from.

**Acceptance:** each of the 11 carries an explicit disposition — (a) checked, (b) re-marked
`judgment-only` in the spec, or (c) accepted as a third state with §14's wording and EPIC-004
§ Closed-when 2 amended to admit it — and no rule is left in the middle.

**DoD:**
- [ ] The 11 ids are **re-derived** from `conformance-dispositions.md` § `scope-out`, never copied from this Plan — *Verify: the ruled ids reconcile against 30 covered + 21 build + 11 scope-out = 62, and the register's § `scope-out` prose is the source (it is prose, not a table — a row-shaped query returns 0 here, L-108)*
- [ ] Each of the 11 records its disposition **with its reason**, in the register and in the spec row it governs
- [ ] Any ruled **(a) checked** joins § `build` with its finding name, and § Out says whether it lands this sprint or in SPRINT-080 — *Verify: the register's build count changes and still reconciles to 62*
- [ ] Any ruled **(b) re-marked** changes that rule's Mark cell in `spec/STANDARD.md` and lands at least a MINOR in `spec/CHANGELOG.md` — *Verify: `sh conformance.sh .` stops asserting it with **no engine code edit**, which is the spec-driven property SPRINT-074 established*
- [ ] If **(c)** is taken, §14's wording and § Closed-when 2 admit the third state with the **prior wording preserved in place** — *Verify: the superseded sentence is still readable in the condition (L-088; this row refused two looser readings at SPRINT-076 on exactly that ground)*
- [ ] The ruling is filed as an ADR **or** recorded Retro-only, with §4's three-part bar stated against it — *Verify: (c) is hard-to-reverse and surprising and a real trade-off; (a)/(b) likely are not*

### T2 — Give §2 rows for Multi-service's three docs `[size: S · risk: low · class: decision · HITL]`
Layers: `spec/STANDARD.md` · `spec/CHANGELOG.md` · `docs/research/conformance-dispositions.md` · `scripts/lib/conformance-engine.sh`
Depends-on: T1
Cites: SPRINT-078 T2 § "A4 does not hold" (its Execution Log) · §6's Multi-service row · §2's docs tree · `S6.MULTISVC`

§6 names three documents — service registry · cross-service dependency map · global decisions index —
that §2 carries no row for, so `S6.MULTISVC` cannot derive a doc set and reports
`tier-doc-set-underivable` instead of answering the question §6 asks. The engine reported this rather
than guessing, which is why it is a task and not a silent gap.

**Acceptance:** `S6.MULTISVC` stops reporting `tier-doc-set-underivable` and starts answering §6's
question — either because §2 gained the three rows with a Tier cell an engine can match, or because §6
stopped naming docs §2 does not carry.

**DoD:**
- [ ] The gap is **re-derived at intake, not trusted from the Backlog row** — *Verify: a case-insensitive sweep of §2 for all three names, plus an enumeration of §2's distinct Tier cell values, reproduces the two-way finding SPRINT-078 recorded (L-130 — §2 may have moved since)*
- [ ] Either §2 carries a row per named doc with a matchable Tier cell, **or** §6 is amended to stop naming them — the choice recorded with its reason
- [ ] `spec/CHANGELOG.md` records the change at the right level — *Verify: a §2/§6 edit that moves an adopter's report is at least MINOR*
- [ ] `S6.MULTISVC`'s behaviour changes as intended — *Verify: `sh conformance.sh .` and the tier fixtures; the finding string is gone and the tier is evaluated*
- [ ] `conformance-dispositions.md` updated only if a disposition actually changed

### T3 — Make §2's `DECISIONS.md` addressable by a checker `[size: S · risk: low · class: execution · AFK]`
Layers: `spec/STANDARD.md` · `spec/CHANGELOG.md` · `docs/research/conformance-dispositions.md`
Depends-on: T2
Cites: SPRINT-078 T2's `S6.MEDIUM` family note · TD-070 (the shared `read-spec-files.sh` question) · §2's docs tree · `docs/DECISIONS.md` · `DECISIONS.md`

`docs/DECISIONS.md` is reachable only inside a **pattern** row — `` `adr/ADR-NNN-<slug>.md` + `DECISIONS.md` index `` — and every §2 parser takes the File cell's first backticked token and discards
rows containing `<`/`>`/`*`. So Medium's whole doc set reads as families and the tier reports *not
evaluated* rather than checking anything.

**Acceptance:** `docs/DECISIONS.md` is reachable from §2's table as a literal path, so `S6.MEDIUM` can
assert it.

**DoD:**
- [ ] **Confirm at intake whether TD-070's shared `read-spec-files.sh` has landed** — if it has, this may be free and the task shrinks or closes — *Verify: check the five parsers TD-070 names before editing the spec*
- [ ] §2's row is split so `DECISIONS.md` stands as its own literal path (the assumed route — splitting the row beats teaching five parsers a second token, which is TD-070's subject and is not pre-empted here)
- [ ] `S6.MEDIUM` evaluates rather than reporting *not evaluated* — *Verify: `sh conformance.sh .` shows the tier's doc set derived, with `DECISIONS.md` in it*
- [ ] `spec/CHANGELOG.md` updated at the right level

### T4 — Cover §9's sprint-file family in the engine `[size: M · risk: med · class: execution · HITL]`
Layers: `scripts/lib/conformance-engine.sh` · `evals/run-conformance-engine-fixtures.sh` · `docs/research/conformance-dispositions.md` · `docs/research/conformance-coverage.md`
Depends-on: T1
Cites: the register's § `build` (the five §9 rows and their findings) · §9's Conformance table · L-058 · L-142 · TD-012 · `S9.TWOFILES` · `S9.LOGDIR` · `S9.PLANFROZEN` · `S9.SCOPECHANGE` · `S9.VERIFYCLAUSE` · `S4.APPEND`

Five rules, six findings. Two of them (`PLANFROZEN`, `SCOPECHANGE`) read git history against
`plan_commit` — the `S4.APPEND` shape — so their fixtures need a repo with real history, not a tree.

**Acceptance:** `S9.TWOFILES` → `sprint-plan-over-hard-cap` · `sprint-log-missing`; `S9.LOGDIR` →
`sprint-log-outside-logs-dir`; `S9.PLANFROZEN` → `plan-edited-after-freeze`; `S9.SCOPECHANGE` →
`scope-change-logged-after-plan-edit`; `S9.VERIFYCLAUSE` → `dod-criterion-names-no-check` — each with a
**retained** fixture that reddens on input that must produce it, while a sibling control stays green.

**DoD:**
- [ ] The five rule ids and six finding strings are re-derived from the register, and from T1's ruling if it changed the set — *Verify: the § `build` §9 rows, after T1*
- [ ] Each of the six findings fires from the engine on input that must produce it — *Verify: `sh evals/run-conformance-engine-fixtures.sh`, read the tally it **prints**, not a wrapper's status (L-120)*
- [ ] `PLANFROZEN` and `SCOPECHANGE` fixtures build a repo with **real git history**, not a tree alone — *Verify: the fixture creates commits and the assertion fails without them*
- [ ] Every fixture is **retained**, one per finding (TD-012) — *Verify: `evals/` holds them after the task, not just during*
- [ ] The suite is shown to **discriminate**: seed the rejected shape (or break each assertion in turn), confirm the case reddens while a sibling control stays green, and confirm the seed **landed and still parses** — *Verify: `cmp` against a pristine copy, assertion count unchanged, line count within one (L-137 · L-142)*
- [ ] The covered rows move from `conformance-dispositions.md` § `build` → `conformance-coverage.md` § Covered today, and both files' counts reconcile to 62 — *Verify: `sh scripts/lib/check-doc-caps.sh` and the engine's own `coverage:` line*

### T5 — Cover §10's learning-governance rules in the engine `[size: M · risk: med · class: execution · HITL]`
Layers: `scripts/lib/conformance-engine.sh` · `evals/run-conformance-engine-fixtures.sh` · `docs/research/conformance-dispositions.md` · `docs/research/conformance-coverage.md`
Depends-on: T4
Cites: the register's § `build` (the four §10 rows) · §10's Conformance table · L-130 · L-058 · `S10.FOURBUCKETS` · `S10.PROMOTION` · `S10.TDAGING` · `S10.PROMOTEREVIEW`

Four rules. `S10.PROMOTION`'s trigger is the spec's own `count ≥ 2, promoted: no` threshold **read from
§10**, never a number copied into the check — and `promoted: yes` is never the stored form, so it counts
by `[status: promoted]`, position-anchored.

**Acceptance:** `S10.FOURBUCKETS` → `retro-bucket-unrouted`; `S10.PROMOTION` →
`learning-recurred-unpromoted`; `S10.TDAGING` → `td-row-aged-unreviewed`; `S10.PROMOTEREVIEW` →
`promote-checklist-absent` — each with a retained fixture and a sibling control.

**DoD:**
- [ ] `S10.PROMOTION` reads its threshold from §10, not from a literal in the engine — *Verify: change the spec's threshold in a copy and watch the check follow with no code edit (the SPRINT-074 property)*
- [ ] `S10.PROMOTION` counts promotion state **position-anchored** by `[status: promoted]` — *Verify: this repo's own corpus, where a substring scan reads 42 and the anchored scan reads 41 (L-114's heading quotes the format while explaining it); the check must read 41 and reconcile 41 + 87 active + 1 superseded = 129*
- [ ] All four findings fire on input that must produce them, retained fixture each — *Verify: `sh evals/run-conformance-engine-fixtures.sh`, reading the printed tally*
- [ ] Discrimination shown as in T4 — seeded break reddens its case, sibling control stays green, seed verified landed and still parsing
- [ ] Covered rows migrate to `conformance-coverage.md`; counts reconcile to 62

## Owner-action checklist
- [ ] **Reinstall the plugin before executing** — this session primed at base-dir **1.48.0** against repo **1.52.0**. The `lean-doc-generator` procedure was diffed and is identical (CRLF only), but no other skill was checked, and `/orchestrator` drives this Plan (L-021).

## Decisions (pre-locked)

- **D1 — `spec/STANDARD.md` has one owner at a time; commit order is T1 → T2 → T3.** Three tasks edit it
  (T1 §14 + Conformance rows · T2 §2/§6 · T3 §2 docs tree). Serialize; never a plain
  `git add spec/STANDARD.md` over another task's WIP — per-hunk with `git diff --cached` verified
  (L-042 · L-037). `spec/CHANGELOG.md` and `conformance-dispositions.md` follow the same order.
- **D2 — T1 runs first, and that is the sprint's shape, not its ordering convenience.** Its ruling can
  add to the `build` set T4/T5 draw from. Ruled afterwards, the same discovery arrives as a
  mid-sprint `scope-change` against a frozen Plan (L-105's temporal reading).
- **D3 — EPIC-004's §2 cap breach (213 > 200 soft) is deferred at this promote, not dismissed.** The
  growth is the § Member sprints table, and the epic exits via §11 archive once § Closed-when 2 ticks —
  the same reasoning that leaves `loop-hygiene-prd.md` in place. **Re-rule at SPRINT-080's promote** if
  the epic has not closed; the cap check will keep reporting it, which is correct.
- **D4 — `conformance-dispositions.md` was split at this promote** (230 > 130) → §§ Covered today +
  Artefacts moved verbatim to `docs/research/conformance-coverage.md`; register 128, coverage 124, both
  under cap, both halves verified byte-identical to the pristine copy. T4/T5 therefore edit **two**
  files where the Backlog rows named one — which is why their `Layers:` name both.

## Assumptions

- **A1 — the 21 `build` rules are exactly the union of TASK-248…252, id for id.** *Confirm: verified at
  this promote rule-by-rule (§9 ×5 · §10 ×4 · §11-ledger ×4 · §11-archival ×4 · §12 ×4 = 21, matching
  the register's § `build` table exactly). Re-derive at G2 — T1 can change it, which is A2.*
- **A2 — T1's ruling can only add to the `build` set or leave it unchanged; it cannot remove from the
  21.** A `scope-out` ruled *checked* becomes buildable; one re-marked `judgment-only` leaves the 21
  alone. *Confirm: at T1, before T4 starts.*
- **A3 — the two §2 gaps in T2/T3 are real.** *Confirm: SPRINT-078 T2 verified each two ways; re-derive
  at intake anyway, since §2 may have moved (L-130).*
- **A4 — `TASK-245 is discharged` and `TASK-238 is unblocked`, applied to TODO.md at this promote.**
  245's `done-when` asks the build rules to exist as tasks: 21 rules ↔ five ready slices, 1:1. 238's
  unblock condition was *"§6's tier doc-sets **or** §11's ledger rules evaluated by the ENGINE"*, and
  SPRINT-078 T2 put the tier family there (`assert_S6_BASE … assert_S6_MULTISVC`). *Confirm: both were
  re-derived at this promote, not read off the Backlog rows.*
- **A5 — a spec change in T1 or T2 is at least MINOR.** Re-marking a rule moves what an adopter's report
  says without their tree changing — the line PATCH may not cross (§2's own row). *Confirm: at each
  spec edit.*
- **A6 — the gate is the sprint's cost constraint, and iterating against the aggregate is the trap.**
  `qa-check.sh` is ~11 min; every leg is a standalone script (`check-layers-observed.sh` answers in ~4s).
  Iterate against the specific check, run the aggregate once at the end (L-150). *Confirm: at G2, and
  in the Retro's Cost line.*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-079-the-undifferentiated-middle.md`, rendered
> from `templates/sprint-log.md.template` and created lazily at the first entry. Append there, never
> here (STANDARD §9 · ADR-014).

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
