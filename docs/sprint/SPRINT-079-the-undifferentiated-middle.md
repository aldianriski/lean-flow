---
sprint: 079
slug: the-undifferentiated-middle
epic: EPIC-004
owner: Maintainer
last_updated: 2026-08-23
status: active
gates_signed: G1,G2 @ 2aea242
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

### T1 — Rule on the 11 `scope-out` rules `[size: M · risk: low · class: decision · HITL]`
Layers: `spec/STANDARD.md` · `spec/CHANGELOG.md` · `docs/research/conformance-dispositions.md` · `docs/epic/EPIC-004-conformance.md` · `docs/adr/` · `scripts/lib/conformance-engine.sh` · `evals/run-conformance-engine-fixtures.sh` · `docs/DECISIONS.md` · `docs/architecture/overview.md`
Depends-on: none
Cites: EPIC-004 § Closed-when 2 (*"plus a separate ruling on whether the 11 `scope-out` rules are checked, re-marked, or accepted as a third state the wording does not admit"*) · SPRINT-076 T4's ruling that the bar stands · the register's § `scope-out` section · L-088 · T4 · T5

The register forbids a rule sitting in an undifferentiated middle, and eleven of them have sat there
since SPRINT-073. This runs first in the sprint because its outcome is an input to T4/T5: a rule ruled
*checked* joins the `build` set those tasks draw from.

**Acceptance:** each of the 11 carries an explicit disposition — (a) checked, (b) re-marked
`judgment-only` in the spec, or (c) accepted as a third state with §14's wording and EPIC-004
§ Closed-when 2 amended to admit it — and no rule is left in the middle.

**DoD:**
- [x] The 11 ids are **re-derived** from `conformance-dispositions.md` § `scope-out`, never copied from this Plan — *Verify: the ruled ids reconcile against 30 covered + 21 build + 11 scope-out = 62, and the register's § `scope-out` prose is the source (it is prose, not a table — a row-shaped query returns 0 here, L-108)*  ✓ re-derived from § `scope-out` prose (it is prose, not a table — a row-shaped query returns 0); the engine now prints `coverage: 24 + 27 = 51`, and 30 covered + 21 build = 51 reconciles
- [x] Each of the 11 records its disposition **with its reason**, in the register and in the spec row it governs  ✓ all 11 marked in their own §2/§3/§7/§9 Conformance rows with the reason in the note; the register's § `scope-out` kept as the record of where each went
- [x] Any ruled **(a) checked** joins § `build` with its finding name, and § Out says whether it lands this sprint or in SPRINT-080 — *Verify: the register's build count changes and still reconciles to 62*  ✓ NONE was ruled (a) checked — the reason those 7 are out is double-counting, which building them would cause. § `build` is unchanged at 21 and still reconciles; T4/T5's rule set did not move (A2 held)
- [x] Any ruled **(b) re-marked** changes that rule's Mark cell in `spec/STANDARD.md` and lands in `spec/CHANGELOG.md` at the level the spec's own test gives — *Verify: PATCH iff nothing an adopter satisfies today changes; otherwise MINOR (the test 0.5.0 states for itself)*  ✓ 11 Mark cells rewritten (verified: exactly 11 lines changed, 993→993 line count, column counts preserved per row); spec 0.5.0 → **0.6.0 MINOR** on the spec's own test — an adopter's report changes, so PATCH may not carry it
- [x] The re-marked rule **stops being asserted with no engine code edit** — *Verify: `--spec` against a scratch copy; this half is the spec-driven property SPRINT-074 established and it holds*  ✓ proven on a scratch spec copy via `--spec`: one rule re-marked, seed verified landed with `cmp` at line delta 0, and it stopped being asserted with the shipped engine unedited
- [x] The engine **names the exclusion** rather than reporting `unrecognized mark` — one `case` arm per new mark value in `scripts/lib/conformance-engine.sh`, each with a retained fixture — *Verify: `sh conformance.sh .` prints a named exclusion line for every one of the 11, and none reports `unrecognized mark` or `rule-unimplemented`*  ✓ all 11 report `excluded by mark: restated` (7) / `standard-directed` (4); **0** `unrecognized mark` lines, GAP 38→27, FAIL unchanged at 34. Three retained fixtures pass, and removing the `restated` arm from a still-parsing engine copy reddens case 4c (7 unrecognized-mark lines) while the `standard-directed` control holds at 4
- [x] If **(c)** is taken, §14's wording and § Closed-when 2 admit the third state with the **prior wording preserved in place** — *Verify: the superseded sentence is still readable in the condition (L-088; this row refused two looser readings at SPRINT-076 on exactly that ground)*  ✓ (c) taken. §14 gains both marks + the prose; EPIC-004 § Closed-when 2 amended with the **prior wording preserved in place**, and the cost (checkable 62→51 makes the condition easier) stated in the row rather than buried
- [x] The ruling is filed as an ADR **or** recorded Retro-only, with §4's three-part bar stated against it — *Verify: (c) is hard-to-reverse and surprising and a real trade-off; (a)/(b) likely are not*  ✓ **ADR-028** (id derived from the max on disk, not remembered — L-143), indexed in `docs/DECISIONS.md`. §4's bar stated in the row: hard-to-reverse (moves every adopter's report + the denominator) · surprising (the dispositions were invisible to the engine for six sprints) · a real trade-off (a smaller checkable set makes our own exit condition easier)

### T2 — Give §2 rows for Multi-service's three docs `[size: S · risk: low · class: decision · HITL]`
Layers: `spec/STANDARD.md` · `spec/CHANGELOG.md` · `docs/research/conformance-dispositions.md` · `scripts/lib/conformance-engine.sh` · `evals/run-conformance-engine-fixtures.sh` · `docs/architecture/overview.md`
Depends-on: T1
Cites: SPRINT-078 T2 § "A4 does not hold" (its Execution Log) · §6's Multi-service row · §2's docs tree · `S6.MULTISVC` · `architecture/service-registry.md` · `architecture/service-dependencies.md` · `DECISIONS.md` (named as §2 rows, never touched as files)

§6 names three documents — service registry · cross-service dependency map · global decisions index —
that §2 carries no row for, so `S6.MULTISVC` cannot derive a doc set and reports
`tier-doc-set-underivable` instead of answering the question §6 asks. The engine reported this rather
than guessing, which is why it is a task and not a silent gap.

**Acceptance:** `S6.MULTISVC` stops reporting `tier-doc-set-underivable` and starts answering §6's
question — either because §2 gained the three rows with a Tier cell an engine can match, or because §6
stopped naming docs §2 does not carry.

**DoD:**
- [x] The gap is **re-derived at intake, not trusted from the Backlog row** — *Verify: a case-insensitive sweep of §2 for all three names, plus an enumeration of §2's distinct Tier cell values, reproduces the two-way finding SPRINT-078 recorded (L-130 — §2 may have moved since)*  ✓ re-derived: all three names occur **exactly once in the whole spec**, all on line 431 (§6's own row), and a §2-scoped sweep returns 0 — two angles agreeing. §2's Tier vocabulary enumerated: no multi-service value existed
- [x] Either §2 carries a row per named doc with a matchable Tier cell, **or** §6 is amended to stop naming them — the choice recorded with its reason  ✓ **both**, and the split is the finding: two rows added (`architecture/service-registry.md` · `architecture/service-dependencies.md`, Tier `multi-service`), and §6 amended to withdraw the third — *global decisions index* is Medium's `DECISIONS.md` at umbrella scope. `_tier_rows_at` matches `$1 == r`, **exact rank**, so naming it here owed it twice
- [x] `spec/CHANGELOG.md` records the change at the right level — *Verify: a §2/§6 edit that moves an adopter's report is at least MINOR*  ✓ spec **0.7.0 MINOR** on 0.5.0's stated test — an adopter declaring `multi-service` both loses an unclearable finding and gains two owed documents, so PATCH cannot carry it. No rule added: a §2 row is a parameter set (SPRINT-072), so classification stays 100 and checkable stays 51
- [x] `S6.MULTISVC`'s behaviour changes as intended — *Verify: `sh conformance.sh .` and the tier fixtures; the finding string is gone and the tier is evaluated*  ✓ **verified on the consumer path, because this repo cannot reach the branch** (L-016): lean-flow declares no tier, so `sh conformance.sh .` here reports *not evaluated* both before and after — it confirms no regression (FAIL steady at 34, GAP 27, coverage 51) and nothing more. A scratch umbrella repo declaring `multi-service` went `tier-doc-set-underivable` → `tier-doc-set-incomplete` ×2 → **PASS** once the two files existed. Fixtures: `tier-multisvc-incomplete` + `tier-multisvc-clears`, harness all green (34 pass)
- [x] `conformance-dispositions.md` updated only if a disposition actually changed  ✓ **no disposition changed**, so the register is untouched — `S6.MULTISVC` was never dispositioned `build` or `scope-out`; it was a covered rule whose finding was about the standard. Counts still reconcile: 30 covered + 21 build = 51

### T3 — Make §2's `DECISIONS.md` addressable by a checker `[size: S · risk: low · class: execution · AFK]`
Layers: `spec/STANDARD.md` · `spec/CHANGELOG.md` · `docs/research/conformance-dispositions.md` · `evals/run-conformance-engine-fixtures.sh` · `docs/architecture/overview.md`
Depends-on: T2
Cites: SPRINT-078 T2's `S6.MEDIUM` family note · TD-070 (the shared `read-spec-files.sh` question) · §2's docs tree · `docs/DECISIONS.md` · `DECISIONS.md` · `scripts/lib/read-spec-files.sh` (TD-070's proposed extraction — checked for, does not exist)

`docs/DECISIONS.md` is reachable only inside a **pattern** row — `` `adr/ADR-NNN-<slug>.md` + `DECISIONS.md` index `` — and every §2 parser takes the File cell's first backticked token and discards
rows containing `<`/`>`/`*`. So Medium's whole doc set reads as families and the tier reports *not
evaluated* rather than checking anything.

**Acceptance:** `docs/DECISIONS.md` is reachable from §2's table as a literal path, so `S6.MEDIUM` can
assert it.

**DoD:**
- [x] **Confirm at intake whether TD-070's shared `read-spec-files.sh` has landed** — if it has, this may be free and the task shrinks or closes — *Verify: check the five parsers TD-070 names before editing the spec*  ✓ **not landed** — TD-070 is `status: open` and `scripts/lib/read-spec-files.sh` is absent (checked for the file, not taken from the row). So T3 is not free and proceeds with the split
- [x] §2's row is split so `DECISIONS.md` stands as its own literal path (the assumed route — splitting the row beats teaching five parsers a second token, which is TD-070's subject and is not pre-empted here)  ✓ split into a family row (`adr/ADR-NNN-<slug>.md`, which stays a family — §4 makes *no ADRs* correct, not incomplete) and a literal `DECISIONS.md` row. Column counts preserved, +1 line, both sites re-read
- [x] `S6.MEDIUM` evaluates rather than reporting *not evaluated* — *Verify: `sh conformance.sh .` shows the tier's doc set derived, with `DECISIONS.md` in it*  ✓ **and it needed a second half the DoD did not name.** §2 says don't pre-create `DECISIONS.md` before the first entry, so a plain literal row would demand it from a Medium repo with no decisions — a false positive. §6's Medium row now marks it **substrate-conditional** (stem written extensionless, because `_tier_is_conditional` strips the extension — written `` `DECISIONS.md` `` it would silently never match). Scratch Medium repo: *cannot address* → *substrate-conditional, skipped not owed (§6): `docs/DECISIONS.md`*. Our own repo declares no tier, so `sh conformance.sh .` here shows only no-regression (FAIL 34 · GAP 27 · coverage 51) — L-016
- [x] `spec/CHANGELOG.md` updated at the right level  ✓ spec **0.8.0 MINOR** on 0.5.0's test — a Medium adopter sees a doc set derived where none was, with `docs/DECISIONS.md` named in it. No rule added, so classification stays 100 and checkable stays 51

### T4 — Cover §9's sprint-file family in the engine `[size: M · risk: med · class: execution · HITL]`
Layers: `scripts/lib/conformance-engine.sh` · `evals/run-sprint-family-fixtures.sh` · `docs/research/conformance-dispositions.md` · `docs/research/conformance-coverage.md`
Depends-on: T1
Cites: the register's § `build` (the five §9 rows and their findings) · §9's Conformance table · L-058 · L-142 · TD-012 · `S9.TWOFILES` · `S9.LOGDIR` · `S9.PLANFROZEN` · `S9.SCOPECHANGE` · `S9.VERIFYCLAUSE` · `S4.APPEND` · `evals/run-attestation-fixtures.sh` · `run-attestation-fixtures.sh` (the git-fixture idiom this follows — read, never touched)

Five rules, six findings. Two of them (`PLANFROZEN`, `SCOPECHANGE`) read git history against
`plan_commit` — the `S4.APPEND` shape — so their fixtures need a repo with real history, not a tree.

**Acceptance:** `S9.TWOFILES` → `sprint-plan-over-hard-cap` · `sprint-log-missing`; `S9.LOGDIR` →
`sprint-log-outside-logs-dir`; `S9.PLANFROZEN` → `plan-edited-after-freeze`; `S9.SCOPECHANGE` →
`scope-change-logged-after-plan-edit`; `S9.VERIFYCLAUSE` → `dod-criterion-names-no-check` — each with a
**retained** fixture that reddens on input that must produce it, while a sibling control stays green.

**DoD:**
- [x] The five rule ids and six finding strings are re-derived from the register, and from T1's ruling if it changed the set — *Verify: the § `build` §9 rows, after T1*  ✓ re-derived from § `build`; T1 changed none of them (nothing was ruled *checked*), so the set is the five the register named
- [x] Each of the six findings fires from the engine on input that must produce it — *Verify: `sh evals/run-conformance-engine-fixtures.sh`, read the tally it **prints**, not a wrapper's status (L-120)*  ✓ all six fire — `evals/run-sprint-family-fixtures.sh` prints **SPRINT-FAMILY FIXTURES: all green**, 13 cases (6 must-FAIL + 7 controls). Its own harness: two of these rules are defined over git history and the engine suite states in its header that it needs none
- [x] `PLANFROZEN` and `SCOPECHANGE` fixtures build a repo with **real git history**, not a tree alone — *Verify: the fixture creates commits and the assertion fails without them*  ✓ both build real repos via `git init` + commits, following the `run-attestation-fixtures.sh` idiom — a tree alone cannot express *the Plan changed after this commit* or *this entry was written after that edit*
- [x] Every fixture is **retained**, one per finding (TD-012) — *Verify: `evals/` holds them after the task, not just during*  ✓ retained, and **every finding has a control** — two for `dod-criterion-names-no-check` (the rule admits two evidence forms; passing one would leave the other unguarded) and the pair separating *the Plan moved* from *the Plan moved unaccounted*
- [x] The suite is shown to **discriminate**: seed the rejected shape (or break each assertion in turn), confirm the case reddens while a sibling control stays green, and confirm the seed **landed and still parses** — *Verify: `cmp` against a pristine copy, assertion count unchanged, line count within one (L-137 · L-142)*  ✓ **two targeted seeds, each landing (0 line delta) and still parsing.** Seed A removes the lazy-log substrate guard: shipped engine reports 0 `sprint-log-missing` on a tick-less sprint, seeded reports 1 — the control reddens. Seed B removes PLANFROZEN's scope-change accounting: 0 → 1 `plan-edited-after-freeze` against our own amended Plan, while sibling `S9.SCOPECHANGE` stays **green**
- [x] The covered rows move from `conformance-dispositions.md` § `build` → `conformance-coverage.md` § Covered today, and both files' counts reconcile to 62 — *Verify: `sh scripts/lib/check-doc-caps.sh` and the engine's own `coverage:` line*  ✓ migrated — register § `build` 21 → 16, coverage § Covered today 30 → 35, both under cap. **The criterion said "reconcile to 62" and that figure was invalidated by T1 in this same sprint** (checkable 62 → 51 when the eleven were marked). Corrected rather than silently reinterpreted (L-088): they reconcile to **51** — 35 + 16, matching the engine's own `coverage: 29 + 22`

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

### T6 — Make every FAIL line name the rule that raised it `[size: M · risk: med · class: execution · HITL]`
Layers: `scripts/lib/conformance-engine.sh` · `evals/run-conformance-engine-fixtures.sh`
Depends-on: T3
Cites: T3's Execution Log entry and its correction · `S4.INDEX` · `DECISIONS.md` · L-108 · L-058 · L-146 · T2 (its fixture replacement is the sibling precedent; not depended on)

**Added by amendment at T3, on the owner's ruling** (*"fix it and continue, no defect left in sprint if
still inline"*). Found while T3 established whether the tier rule could safely set `DECISIONS.md`
aside: **23 of the engine's 54 `bad`/`ok` verdict lines name a finding without a rule id.** The
dispatch loop's lines carry `$pid`; the per-item lines inside assertions do not — and since a failing
assertion returns *before* its `ok` line, a failing rule can be entirely un-attributable. It cost a
wrong diagnosis in this very sprint: a grep by rule id returned nothing and was read as *the check does
not fire* when the check fires correctly under a different line shape.

**Approach: append the id, never prepend it.** Three retained fixtures assert the **absence** of a
finding at line start (`! grep -qE '^FAIL +ownership-header'` and siblings). Prefixing would satisfy
those negations unconditionally and convert real failures into vacuous passes — the exact hazard L-146
records. A trailing `(S3.HEADER)` breaks no pattern, positive or negative, and keeps the finding first,
which is the order an adopter reads.

**Acceptance:** no `FAIL` line the engine emits about a repository is un-attributable — each names its
rule, either by leading id or trailing marker — and the negative assertions in the retained harnesses
still discriminate.

**DoD:**
- [x] `bad()` appends the dispatching rule's id when the message does not already lead with one; invocation errors (`conformance:` — out of scope per SPRINT-077 T2) keep their shape — *Verify: `sh -n`, then a run showing `decisions-index-missing-adr` carrying `(S4.INDEX)`*  ✓ `_cur_rid` set by the driver before dispatch, so a NEW assertion inherits attribution without its author remembering. `decisions-index-missing-adr: … (S4.INDEX)`. Invocation errors keep their shape. No subshell in `bad`/`ok` — they run per finding per file, and a `$( )` there is L-144's per-row spawn
- [x] Re-derived, not copied: the count of un-attributed verdict lines is measured again before and after, and the after is **0** for `bad` — *Verify: the same scan that produced 23, re-run*  ✓ measured on **output**, which is where the defect lives — the call sites are unchanged by design, the fix being at the helper. Before: every per-item finding un-attributable. After: **0 of 12** on one run and **0 of 11** in the fixture, across findings from several different assertions
- [x] `ok()` is ruled explicitly rather than left ambiguous — fixed too, or scoped out with its reason recorded  ✓ **fixed too, not scoped out.** The suffix carries no breakage risk for PASS lines either, and leaving half the verdict lines attributable would be the same defect with a smaller blast radius
- [x] **The three negative assertions still discriminate** — seed a real failure each would catch and confirm each reddens — *Verify: they must not pass vacuously (L-146); this is the DoD line the task exists for*  ✓ **all four** re-run against a repo seeded to produce each finding: `^FAIL +ownership-header` · `^FAIL +(ownership-header|update-trigger)` · `^FAIL +file-outside-canonical-placement` · `^FAIL  [a-z-]+: ` all still match. A prefix would have satisfied every one of those negations unconditionally — four manufactured vacuous passes (L-146), which is why the id is appended
- [x] A retained fixture asserts the invariant itself: every `FAIL` line about a repository names a rule — *Verify: it reddens when one `bad` call is stripped of its id, while a sibling control stays green*  ✓ `every-fail-names-its-rule` (requires >3 findings from several assertions, so one fixed call site cannot pass it) + `suffix-preserves-negations`. **Discrimination proven:** seeding `_cur_rid=""` — 0 line delta, still parses — reddens the invariant at 9 of 12 un-attributed while the negations control stays green
- [x] Full engine fixture harness green, and `conformance.sh .` FAIL/GAP counts unchanged (34 / 27) — this is a report-shape change, not a coverage change  ✓ **all four affected harnesses green** — engine · ownership-header · s2-placement · foreign-repo, each exit 0. `conformance.sh .` unchanged at FAIL 34 / GAP 27 / coverage 51: a report-shape change, not a coverage change

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
