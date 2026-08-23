---
owner: Maintainer
last_updated: 2026-08-23
update_trigger: Sprint completed, task added, or task status changed
status: current
---

# lean-flow — Development Tracker

> **How to use this file**
> - **Session start** — `/prime`; read this before touching code.
> - **`/triage`** grooms the Backlog (re-rank, state, route rejects to `.out-of-scope/`).
> - **`/lean-doc-generator promote`** forms a sprint from `ready` Backlog tasks → `docs/sprint/`.
> - **`/orchestrator sprint-bulk`** builds it; **`/lean-doc-generator close`** runs the Retro → §10 routing.
> - Tech Debt lives in root **`TECH-DEBT.md`**: `TD-NNN`, never deleted; aged at promote (≥3 sprints → re-review; `high` → auto P1).

---

## Active Sprint

> _(none — SPRINT-079 closed 2026-08-23, 34 of 34 DoD. **EPIC-004 stays open**: § Closed-when 2 is
> the last condition and its residual is gone — the eleven `scope-out` rules are marked in the spec —
> but the coverage half reads **39 of 51**. The remaining **12 `build` rules are TASK-250 · TASK-251 ·
> TASK-252, exactly**, so SPRINT-080 is the epic-closing sprint and needs no new decomposition.)_

---

## Backlog

<!-- Groomed by /triage. Only `ready` tasks are promotable. -->

### P0 — Critical / Blocking

### P1 — Next Phase Required

- [x] TASK-255 — Give §2 rows for Multi-service's three docs  [size: S] [risk: low] [HITL]
      class:      decision
      done-when:  `spec/STANDARD.md` §2's `docs/` tree carries a row for each doc §6's Multi-service
                  row names — service registry · cross-service dependency map · global decisions index
                  — with a Tier cell an engine can match, or §6 is amended to stop naming docs §2 does
                  not carry. Either way `S6.MULTISVC` stops reporting `tier-doc-set-underivable` and
                  starts answering the question §6 asks
      touches:    spec/STANDARD.md (§2 · §6) · spec/CHANGELOG.md · scripts/lib/conformance-engine.sh
                  (only if the finding changes) · docs/research/conformance-dispositions.md
      depends-on: none
      assumes:    **the gap is real and was verified two ways at SPRINT-078 T2** — a case-insensitive
                  sweep of §2 for all three names returns nothing, and enumerating §2's distinct Tier
                  cell values yields `base · backend/integration · backend, or overview cap-split ·
                  medium+ · API exists · auth exists · DB exists · lean loop · as needed · ephemeral`,
                  with no multi-service value. Re-derive at intake anyway; §2 may have moved
      tracker:    SPRINT-078 T2 · its Execution Log § "A4 does not hold"
      origin:     close-retro
      state:      ready

- [x] TASK-256 — Make §2's `DECISIONS.md` addressable by a checker  [size: S] [risk: low] [AFK]
      class:      execution
      done-when:  `docs/DECISIONS.md` is reachable from §2's table as a literal path, so `S6.MEDIUM`
                  can assert it. Today the only row naming it is
                  `` `adr/ADR-NNN-<slug>.md` + `DECISIONS.md` index (both under `docs/`) `` — a
                  **pattern** row, and every §2 parser takes the File cell's first backticked token and
                  discards rows containing `<`/`>`/`*`. So Medium's entire doc set reads as families
                  and the tier reports "not evaluated" rather than checking anything
      touches:    spec/STANDARD.md (§2 docs tree — likely splitting the row in two) · spec/CHANGELOG.md
                  · docs/research/conformance-dispositions.md
      depends-on: none
      assumes:    splitting the row is preferable to teaching five parsers to read a second token —
                  which is TD-070's subject and should not be pre-empted here. **Confirm at intake**:
                  if TD-070's shared `read-spec-files.sh` lands first, this may be free
      tracker:    SPRINT-078 T2 · the `S6.MEDIUM` family note
      origin:     close-retro
      state:      ready

- [x] TASK-245 — Decompose EPIC-004's remaining coverage rules into buildable tasks  [size: M] [risk: low] [HITL]
      class:      decision
      done-when:  the ~32 `build` rules in `docs/research/conformance-dispositions.md` exist as
                  `TASK-NNN` entries (or as a small number of grouped vertical slices), each with a
                  `done-when` naming **the finding string its check must fire** — a check specified
                  without its finding name is a half-shipped gate (L-058) — and enough are `state:
                  ready` to form the next coverage sprint
      touches:    TODO.md · docs/research/conformance-dispositions.md (only if a disposition changes
                  on contact) · no code
      depends-on: none
      assumes:    **the count is a query result and gets re-derived at intake, not copied from here**
                  (L-130). "~32" is SPRINT-076's figure for the `build` bucket and SPRINT-077 changed
                  no disposition, so it should still hold — but the register is the source, not this
                  row. Also: **grouping is a decision, not a formality.** 32 one-rule tasks would be
                  a worse backlog than 6 grouped slices, and §6's four tier rules are already
                  dispositioned as *one check, four tiers — the tier is a parameter, not four
                  checkers*, which is the shape to look for elsewhere
      tracker:    EPIC-004 § Closed-when 2 (the epic's last open condition) · SPRINT-076 T4's ruling
                  that the bar stands · SPRINT-077 § Out (which names this as the next entry, and
                  names `/task-decomposer` rather than `promote` as the skill that runs it)
      origin:     close-retro
      state:      done — **DISCHARGED at SPRINT-079's promote, not shipped.** Its `done-when` asks the
                  `build` rules to exist as `TASK-NNN` entries. Re-derived from the register at promote
                  (its own `assumes:` said to, and was right): **21** `build` rules, not "~32" — and
                  TASK-248…252 map onto them **1:1**, id for id — §9 ×5 · §10 ×4 · §11-ledger ×4 ·
                  §11-archival ×4 · §12 ×4 = 21. The grouping call this row flagged as "a decision, not
                  a formality" was taken the way it predicted: five grouped vertical slices, not 21
                  one-rule tasks. Nothing left to decompose. Swept from the Backlog at SPRINT-079's
                  close under §11

- [x] TASK-248 — Cover §9's sprint-file family in the engine  [size: M] [risk: med] [HITL]
      class:      execution
      done-when:  five rules answered with six findings — S9.TWOFILES → `sprint-plan-over-hard-cap` ·
                  `sprint-log-missing`; S9.LOGDIR → `sprint-log-outside-logs-dir`; S9.PLANFROZEN →
                  `plan-edited-after-freeze`; S9.SCOPECHANGE → `scope-change-logged-after-plan-edit`;
                  S9.VERIFYCLAUSE → `dod-criterion-names-no-check`. Retained fixture per finding,
                  each reddening while a sibling control stays green
      touches:    scripts/lib/conformance-engine.sh · evals/run-conformance-engine-fixtures.sh ·
                  docs/research/conformance-dispositions.md
      depends-on: none
      assumes:    PLANFROZEN and SCOPECHANGE read git history against `plan_commit`, the S4.APPEND
                  pattern — so both need a repo with real history in the fixture, not a tree alone
      tracker:    EPIC-004 § Closed-when 2 · dispositions § build
      origin:     decomposer
      state:      ready

- [x] TASK-249 — Cover §10's learning-governance rules in the engine  [size: M] [risk: med] [HITL]
      class:      execution
      done-when:  S10.FOURBUCKETS → `retro-bucket-unrouted`; S10.PROMOTION →
                  `learning-recurred-unpromoted`; S10.TDAGING → `td-row-aged-unreviewed`;
                  S10.PROMOTEREVIEW → `promote-checklist-absent`. Retained fixture per finding + controls
      touches:    scripts/lib/conformance-engine.sh · evals/run-conformance-engine-fixtures.sh ·
                  docs/research/conformance-dispositions.md
      depends-on: none
      assumes:    S10.PROMOTION's trigger is the spec's own `count ≥ 2, promoted: no` threshold read
                  from §10, not a number copied into the check (L-130)
      tracker:    EPIC-004 § Closed-when 2 · dispositions § build
      origin:     decomposer
      state:      ready

- [ ] TASK-250 — Cover §11's ledger-retention rules in the engine  [size: M] [risk: low] [AFK]
      class:      execution
      done-when:  S11.TDDELETE → `resolved-td-row-past-retention`; S11.TODOCAP →
                  `todo-over-cap-at-promote`; S11.LEARNINGS → `promoted-learning-not-collapsed`;
                  S11.BACKLOG → `shipped-backlog-entry-retained`. Retained fixture per finding + controls
      touches:    scripts/lib/conformance-engine.sh · evals/run-conformance-engine-fixtures.sh ·
                  docs/research/conformance-dispositions.md
      depends-on: none
      assumes:    a ledger's legend/header line is not a row — the census trap this repo has hit twice
                  (L-108); anchor to position, and cross-check open+resolved against the total
      tracker:    EPIC-004 § Closed-when 2 · dispositions § build
      origin:     decomposer
      state:      ready

- [ ] TASK-251 — Cover §11's archival rules in the engine  [size: M] [risk: low] [AFK]
      class:      execution
      done-when:  S11.SPRINT → `closed-sprint-not-archived` · `sprint-index-row-missing`;
                  S11.LOGPAIR → `sprint-log-archived-apart-from-plan`; S11.CHANGELOG →
                  `changelog-not-rotated-at-minor`; S11.WHENITRUNS →
                  `retention-trigger-ran-in-wrong-phase`. Five findings, retained fixture each + controls
      touches:    scripts/lib/conformance-engine.sh · evals/run-conformance-engine-fixtures.sh ·
                  docs/research/conformance-dispositions.md
      depends-on: none
      assumes:    S11.WHENITRUNS is phase-sensitive — it is L-105's temporal rule as a check, so the
                  fixture must distinguish "ran in the wrong phase" from "did not run"
      tracker:    EPIC-004 § Closed-when 2 · dispositions § build
      origin:     decomposer
      state:      ready

- [ ] TASK-252 — Cover §12's git-boundary rules in the engine  [size: M] [risk: med] [HITL]
      class:      execution
      done-when:  S12.SECRETS → `secret-committed`; S12.BACKUPS → `database-backup-committed`;
                  S12.DESIGNSRC → `design-source-committed`; S12.GENERATED →
                  `generated-artifact-committed`. Retained fixture per finding + a PASS control
                  proving the check does NOT fire on a benign lookalike
      touches:    scripts/lib/conformance-engine.sh · evals/run-conformance-engine-fixtures.sh ·
                  docs/research/conformance-dispositions.md
      depends-on: none
      assumes:    **false positives are the risk here, not false negatives** — the register's own (c)
                  note refuses filename heuristics because flagging `contract.md` in a contract-testing
                  repo is worse than no scan. The benign-lookalike control is the load-bearing fixture,
                  and how far the detection goes is a G2 design call, not settled at intake
      tracker:    EPIC-004 § Closed-when 2 · dispositions § build · dispositions § scope-out (c)
      origin:     decomposer
      state:      ready

- [x] TASK-254 — Rule on the 11 `scope-out` rules, which satisfy neither half of § Closed-when 2  [size: S] [risk: low] [HITL]
      class:      decision
      done-when:  each of the 11 is recorded as (a) checked, (b) re-marked `judgment-only` in
                  spec/STANDARD.md, or (c) accepted as a third state — and if (c), §14's wording and
                  § Closed-when 2's clause are updated to admit it, with the prior wording preserved
                  in place (L-088). No rule left in the undifferentiated middle the register forbids
      touches:    spec/STANDARD.md (§14 · affected § Conformance rows) ·
                  docs/research/conformance-dispositions.md · docs/epic/EPIC-004-conformance.md ·
                  possibly docs/adr/ADR-NNN
      depends-on: none
      assumes:    a spec change here is at least MINOR — re-marking a rule moves what an adopter's
                  report says without their tree changing, the line PATCH may not cross (§2's own row).
                  Ruling (c) likely wants an ADR; (a) and (b) likely do not
      tracker:    EPIC-004 § Closed-when 2 ("plus a separate ruling on whether the 11 scope-out rules
                  are checked, re-marked, or accepted as a third state the wording does not admit") ·
                  open since SPRINT-073
      origin:     decomposer
      state:      ready

### P2 — Quality / Polish

- [ ] TASK-238 — Re-run the foreign-repo artefact triage once coverage is past the shape-bound rules  [size: S] [risk: low] [HITL]
      class:      decision
      done-when:  the T3 triage is repeated against a from-scratch repo with §2's placement rules, §6's
                  tier doc-sets and §11's ledger rules implemented, and each finding is classified
                  *actionable by that repo's owner* or *an artefact of dispositions written against our
                  shape* — with the verdict recorded. A high artefact count is a finding about
                  `docs/research/conformance-dispositions.md` and routes back there; the engine is not
                  tuned to look quiet
                  **§2's third is DONE (SPRINT-076 T3) and the remaining two are what this row now
                  waits on.** The re-run happened with `S2.F-FILE` · `S2.R-PLACEMENT` live and the
                  number moved off zero: **4 artefacts of 8 new findings** — `AGENTS.md` · `TODO.md` ·
                  `.claude/CLAUDE.md` · `.claude/CONTEXT.md`, all of them lean-flow's own loop surface
                  rather than repository structure. Routed back to the register (§ Artefacts) exactly as
                  this row requires, the engine left faithful rather than quietened, and the spec fix
                  filed as TASK-243 — **delivered at SPRINT-077 T1 (spec 0.5.0); artefacts now 0 of 4**. So the
                  METHOD is proven and the finding is real; what is unproven
                  is the other two families
      touches:    evals/run-foreign-repo-fixtures.sh (extend the target if the new rules need one) ·
                  docs/research/conformance-coverage.md § Artefacts (only if artefacts are found — the
                  section moved there at SPRINT-079's promote, when the register was split) · the
                  sprint Execution Log that runs it
      depends-on: none
      assumes:    **SPRINT-075 T3's "0 artefacts" is honest but early, and re-promoting this on the
                  strength of that number would be reading it backwards.** Only 6 of 62 checkable
                  rules had assertions, and none of them were the rules most likely to encode our own
                  directory shape — so the question was barely asked, not answered. The trigger is
                  coverage reaching those families, not a schedule.
                  **Re-parked at SPRINT-076 T3 with a NARROWED condition, not discharged** — §2 is in
                  and confirmed the suspicion; unblock when **§6's tier doc-sets** or **§11's ledger
                  rules** are evaluated by the ENGINE (§11's two are covered today by standalone
                  checkers, which never run against a foreign tree). Naming the remaining families is
                  what keeps this a condition rather than a standing wish (L-094: the class of fact
                  that closes it is a measurement, and it accumulates one family at a time)
      tracker:    SPRINT-075 T3 · SPRINT-076 T3 (the §2 third) · EPIC-004 § Closed-when 1 · L-015 · L-016
      origin:     close-retro
      state:      ready
                  **UNBLOCKED at SPRINT-079's promote.** The condition read "§6's tier doc-sets **or**
                  §11's ledger rules are evaluated by the ENGINE" — SPRINT-078 T2 put the tier family
                  there (`assert_S6_BASE` … `assert_S6_MULTISVC`, one check with the tier a parameter),
                  so the first disjunct is met. Re-derived at promote from the engine source, not read
                  off SPRINT-078's summary. Not pulled into SPRINT-079: the triage wants coverage past
                  the shape-bound families, and §11's ledger rules land in SPRINT-080 (TASK-250/251) —
                  running it after those is the stronger measurement, and the trigger stays a condition
                  rather than a schedule (L-094)

- [ ] TASK-188 — Exercise the reaper on a genuinely partial Plan  [size: S] [risk: low] [HITL]
      class:      execution
      done-when:  a real unattended run that stops mid-Plan leaves a rollup naming the untouched tasks
                  as `unattempted`, verified end-to-end through `scripts/night-run.sh` rather than via
                  `--reap`
      touches:    scripts/night-run.sh (only if the exercise finds a defect) · a sprint Execution Log
      depends-on: none
      assumes:    **carried from SPRINT-060 T5, acceptance unmet — read the ruling before re-promoting.**
                  The trigger is OPPORTUNISTIC and that is the whole design: the next night run that
                  stops mid-Plan *for its own reasons* is the exercise. Do not schedule a run to produce
                  one, and do not promote this into a sprint whose shape cannot generate it — SPRINT-060
                  promoted it alongside four HITL tasks, the run mode was then ruled interactive at G2,
                  and that foreclosed the only vehicle it had (L-111). Its partial-Plan path is already
                  proven three ways that each stop short of the others: a real log through `--reap`, a
                  zero-ticked-box regression, and an end-to-end launcher run against a complete Plan
      tracker:    SPRINT-060 T5 scope-change + owner ruling · ADR-016 · L-111
      origin:     close-retro
      state:      blocked

### P3 — Long-term

> Rejected work lives in **`.out-of-scope/`** — each file carries its own reasoning, revisit-if and
> expiry, and `/triage` step 1 scans that directory before keeping any resembling task. The per-task
> pointer lines that used to sit here were breadcrumbs to those files, pruned under §11's TODO cap on
> the same reasoning §11 uses for shipped Backlog entries — the durable home is the `.out-of-scope/`
> file, plus git. Ids stay monotonic: 006 · 007 · 040 · 047 · 120 · 148 are not reused.

---

## Tech Debt

> Moved → **`TECH-DEBT.md`** (root) — split 2026-07-29. Filed at Sprint Close, aged at Sprint Promote.

---

## Changelog (current sprint only)

> Move to root `CHANGELOG.md` once reflected in docs, then delete here.

_(no active sprint)_ — SPRINT-078's shipped changes are written up as **v1.52.0** in [`CHANGELOG.md`](CHANGELOG.md), MINOR by hand (feature sprint; `/release-patch` is PATCH-only). Coverage 19 → 30 of 62; `.conformance-tier` is the one new consumer-facing surface.

---

## Quick Rules

```
- Curated, not copied: nothing ships unreviewed; agents/hooks held to the same bar.
- Leverage built-ins (goal/plan/batch/loop/run/verify/code-review/security-review/Explore); ship no duplicates.
- ADRs: rich, one file per docs/adr/ADR-NNN; offered only when hard-to-reverse + surprising + a real trade-off.
- Concise reporting: terse by default; full sentences only where a caveat is load-bearing.
```

