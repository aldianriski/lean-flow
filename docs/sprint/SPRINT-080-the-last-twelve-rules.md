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

### T0 — Repair `S9.VERIFYCLAUSE`, which fires on every unticked Plan `[size: S · risk: med · class: execution · HITL]`
Layers: `scripts/lib/conformance-engine.sh` · `evals/run-sprint-family-fixtures.sh`
Depends-on: none

**Inserted mid-sprint, owner-approved**, after the G2 baseline run reported
`dod-criterion-names-no-check` against this Plan — which has zero ticked boxes. Recorded as a
`scope-change` in the Execution Log **before** this section was added; § Plan was byte-identical
until the gate required the declaration (L-100).

**Acceptance:** the phantom criterion is gone, the unreachable note branch executes, and the
zero-tick state carries a retained control.

**DoD:**
- [x] Cause identified rather than symptom-patched — *Verify: an empty `$(...)` in a heredoc yields one empty line; the loop ran once on a grep matching zero lines*
- [x] Retained control for the zero-tick state — *Verify: `s9-dod-names-no-check-control-zero-ticks`*
- [x] Shown to discriminate — *Verify: reddens against the unfixed engine while its sibling stays PASS; restore hash-verified*

### T1 — Cover §11's ledger-retention rules `[size: M · risk: low · class: execution · AFK]`
Layers: `scripts/lib/conformance-engine.sh` · `evals/run-sprint-family-fixtures.sh` · `docs/research/conformance-dispositions.md` · `docs/research/conformance-coverage.md` · `spec/STANDARD.md` *(added at execution — the §11 exception clause the G2 ruling chose lives in the spec so the check derives its markers; L-100: a live declaration, not a frozen prediction)*
Depends-on: none
Cites: the register's § `build` (§11's four ledger rows) · §11's Conformance table · L-058 · L-108 · TD-012 · `S11.TDDELETE` · `S11.TODOCAP` · `S11.LEARNINGS` · `S11.BACKLOG` · `TECH-DEBT.md` (read as input, never edited by this task)

Four rules that read this repository's own ledgers, so all four have real input to be exercised on
before any fixture is written — which is how SPRINT-079 found three defects in its own checks.

**Acceptance:** `S11.TDDELETE` → `resolved-td-row-past-retention`; `S11.TODOCAP` →
`todo-over-cap-at-promote`; `S11.LEARNINGS` → `promoted-learning-not-collapsed`; `S11.BACKLOG` →
`shipped-backlog-entry-retained` — each with a retained fixture that reddens on input that must
produce it, and a control proving it stays silent on the compliant shape.

**DoD:**
- [x] The four ids and their findings are re-derived from the register, not copied from this Plan — *Verify: the § `build` §11 rows* ✓ re-read at execution; the four ledger rows are `S11.TDDELETE`/`S11.TODOCAP`/`S11.LEARNINGS`/`S11.BACKLOG` with the findings as shipped
- [x] **Each rule is run against this repository before its fixture is written**, and what it says is recorded — *Verify: as stated* ✓ and it found TWO defects in the checks, not the repo (39 conformant entries, then an `[status: active]` entry). Both predictions hold: `S11.LEARNINGS` finds L-144 and clears it on its recorded exception; `S11.TDDELETE` reports TD-048/057/065 at 2 sprints, not past 3
- [x] **A false-positive boundary per rule, each fixed by a control.** ✓ eight controls: pointer forms (a) and (b), the recorded exception, an `[status: active]` entry quoting the promoted marker, a row resolved last sprint, an open row of any age, a short TODO, and a § Changelog release note outside § Backlog
- [x] Every threshold read from the spec, none written into the checker — *Verify: change it in a scratch spec copy and watch the check follow, with no code edit* ✓ `s11-td-threshold-read`: loosening §11's delay 3→2 in a scratch spec flips the SAME repository from PASS to `resolved-td-row-past-retention`
- [x] Retained fixture + control per finding — *Verify: the harness prints its own tally* ✓ `SPRINT-FAMILY FIXTURES: all green`, 38 pass / 0 fail (24 → 38 cases)
- [x] Shown to **discriminate**: seed a targeted break per rule, confirm it lands (`cmp`, 0 line delta), still **parses**, reddens its own case, and leaves a sibling green (L-137 · L-142) ✓ four seeds, all 0-line-delta and parsing — the two *rejected designs* plus a TDDELETE off-by-one and a BACKLOG scope removal; each reddens **only** its own case, restore hash-verified each time. The fourth seed initially did **not** redden, which exposed a vacuous control; it was rebuilt and retained
- [x] Rows migrate register → coverage doc; counts reconcile to **51** — *Verify: the engine's own `coverage:` line, not this Plan's arithmetic* ✓ engine reads `37 checkable have an assertion; 14 unchecked` = 51; register § `build` 12 → 8

### T2 — Cover §11's archival rules `[size: M · risk: low · class: execution · AFK]`
Layers: `scripts/lib/conformance-engine.sh` · `evals/run-sprint-family-fixtures.sh` · `docs/research/conformance-dispositions.md` · `docs/research/conformance-coverage.md` · `CHANGELOG.md` *(added at execution — the rule found a real missing link line and this task repaired it; L-100)*
Depends-on: T1
Cites: the register's § `build` (§11's four archival rows) · §11's Conformance table · ADR-014 · L-105 · L-058 · `S11.SPRINT` · `S11.LOGPAIR` · `S11.CHANGELOG` · `S11.WHENITRUNS`

Four rules, **five findings**. `S11.WHENITRUNS` is L-105 rebuilt as a check — *close-time triggers
execute at close, scan-based ones at promote* — so its fixture must distinguish **ran in the wrong
phase** from **did not run**, which are different states and only one is a finding.

**Acceptance:** `S11.SPRINT` → `closed-sprint-not-archived` · `sprint-index-row-missing`;
`S11.LOGPAIR` → `sprint-log-archived-apart-from-plan`; `S11.CHANGELOG` →
`changelog-not-rotated-at-minor`; `S11.WHENITRUNS` → `retention-trigger-ran-in-wrong-phase`.

**DoD:**
- [x] Ids and findings re-derived from the register — *Verify: the § `build` §11 rows* ✓ re-read at execution; four rows, five findings (S11.SPRINT carries two)
- [x] **Run against this repository first**, where SPRINT-079's retention just executed — *Verify: `S11.LOGPAIR` PASSes on the pair archived in one commit (`75a4fbd`, both renames) ✓ and `S11.CHANGELOG` confirms the root carries exactly `1.53` + `1.52` inline ✓. It also found a **real** gap the DoD did not predict: 38 rotated files and **no link line**, repaired here*
- [x] `S11.WHENITRUNS` distinguishes **wrong phase** from **not run** — *Verify: two retained cases. `s11-retention-wrong-phase` fires when the archive does not descend from its own `close_commit`; `s11-notrun-is-not-wrong-phase-a/b` prove a never-archived close reports `closed-sprint-not-archived` and stays **silent** on the phase finding*
- [x] `S11.SPRINT`'s two findings are separable — an unarchived sprint and a missing INDEX row are different repairs and must not share one line (L-058) — *Verify: `s11-index-row-missing-separable` removes only the row, leaves the archive intact, and gets the index finding **without** the archive finding*
- [x] Retained fixture + control per finding; git-backed where the rule is defined over history — *Verify: 18 new cases (38 → 56), ten of them controls; `s11-logpair-different-commits` and `s11-retention-wrong-phase` build real history. Harness `all green`, 56 pass / 0 fail*
- [x] Discrimination shown as in T1 — *Verify: four seeded breaks, each 0-line-delta and still parsing, probed against **two** conformant repos. Each reddens exactly one and leaves the other green. Two seeds initially failed to redden and were rebuilt rather than accepted (L-142)*
- [x] Rows migrate; counts reconcile to **51** — *Verify: engine reads `41 checkable have an assertion; 10 unchecked` = 51; register § `build` 8 → 4*

### T3 — Cover §12's git-boundary rules `[size: M · risk: med · class: execution · HITL]`
Layers: `scripts/lib/conformance-engine.sh` · `evals/run-sprint-family-fixtures.sh` · `docs/research/conformance-dispositions.md` · `docs/research/conformance-coverage.md`
Depends-on: T2
Cites: the register's § `build` (§12's four rows) and its § `scope-out` reason (c) · §12's never-commit table · L-058 · L-146 · `S12.SECRETS` · `S12.BACKUPS` · `S12.DESIGNSRC` · `S12.GENERATED` · `.env.example` · `contract.md` (the benign lookalikes the controls are built from) · T1 · `db/seed.sql` · `public/hero.mp4` · `.vscode/extensions.json` · `.vscode/settings.json` *(fixture contents built inside the harness, never files of this repository)* · `S2.F-CAP` · `S2.R-TEMPDIR` · `S7.MEGA` · `S7.SPRINT400` · `S11.EPIC` · `S11.RESEARCH` *(the six covered by standalone checkers — named in the amended coverage criterion, checked by neither this task nor the engine)*

**The false-positive family, and the register says so in its own words:** a filename heuristic that
flags `contract.md` in a repo about contract testing *"is worse than no scan"*. §12's six content
categories are `judgment-only` for exactly this reason; these four are the shape-detectable ones and
they are still the riskiest in the epic. **How far detection goes is a G2 design call, not settled
here.**

**Acceptance:** `S12.SECRETS` → `secret-committed`; `S12.BACKUPS` → `database-backup-committed`;
`S12.DESIGNSRC` → `design-source-committed`; `S12.GENERATED` → `generated-artifact-committed` — each
with a retained fixture **and a benign-lookalike control**, which is the load-bearing one.

**DoD:**
- [x] Ids and findings re-derived; the register's reason (c) read before designing, not after — *Verify: the § `build` §12 rows re-read at execution; reason (c) — a scan flagging `contract.md` in a contract-testing repo is "worse than no scan" — read before the first detector was written, and it is what produced the two-signal rule*
- [x] **The benign-lookalike control exists per rule and is written FIRST** — *Verify: `lookalike_repo` was built and committed before any detector existed, holding `.env.example`, a `.pem` with only a public CERTIFICATE, a small fake `db/seed.sql`, `public/hero.mp4`, a shared `.vscode/extensions.json` and an untracked `dist/`. Each rule then reports a **non-zero shape-match examined and cleared**, so the controls are reached rather than passing vacuously*
- [x] Detection scope ruled at G2 and **recorded with its reason** — *Verify: recorded in the engine's §12 header. **Two signals must agree** — shape (extension · filename · path) plus a confirmation from content or git state. **Refused:** size thresholds for BACKUPS and DESIGNSRC (§12 says "large"/"small" and states no number; a figure here is a threshold the standard never set — L-097), and bare filename matching throughout*
- [x] **Run against this repository** — *Verify: lean-flow is clean on all four. Honest caveat recorded: three report **0 shape-matches examined**, so this tree has no candidates and cannot exercise the content confirmation — that is done on the lookalike repo, per L-016's consumer-path rule*
- [x] Retained fixture per finding + the lookalike control; discrimination shown as in T1 — *Verify: 11 new cases (56 → 67), six of them controls; harness `all green`, 67 pass / 0 fail. Four seeded breaks, each removing exactly one confirmation, 0-line-delta and still parsing: each reddens **only** its own finding on the lookalike repo and leaves the other three silent; restore hash-verified*
- [x] Rows migrate; **`build` reaches 0** and coverage reads **45 checkable / 6 unchecked** — *Verify: the engine's `coverage:` line reads exactly that, `45 + 6 = 51`; the 6 (`S2.F-CAP` · `S2.R-TEMPDIR` · `S7.MEGA` · `S7.SPRINT400` · `S11.EPIC` · `S11.RESEARCH`) are each shown covered by a named standalone checker in `conformance-coverage.md`, and the register's § `build` is empty. **Criterion amended by owner ruling at G2** — it read "51 of 51 via the engine's `coverage:` line", which no amount of correct work could satisfy, because that line counts only in-engine assertions (L-088 · L-136)*

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


### T5 — Fix TD-073, because D4's trip-wire fired `[size: S · risk: med · class: execution · AFK]`
Layers: `scripts/lib/conformance-engine.sh` · `TECH-DEBT.md`
Depends-on: T1
Cites: D4 (§ Out — the trip-wire, not a deferral) · TD-073 · TD-075 · L-144 · L-097 · **T2** · **T3** *(cited, not depended on — T5 unblocks them by clearing the trip-wire; the dependency runs the other way)*

**Not in the promoted Plan; required by it.** D4 pre-locked the ruling — *"if the harness passes ~10
minutes, stop and fix TD-073 before adding the rest"* — and T1 took it to **9m23s** for 38 cases, with
T2 and T3 due to add roughly twenty more. Ran between T1 and T2 for that reason; the number is out of
order because the trigger was.

**Acceptance:** the harness is comfortably back under the trip-wire with every case still green and
the engine's report unchanged, and TD-073 is resolved or explicitly re-filed.

**DoD:**
- [x] Root cause measured, not guessed — *Verify: timed in isolation against a tiny input per L-144. 100 × `$(printf|tr)` = 9,176ms · 100 × `$(printf '%-20s')` = 1,909ms · a whole engine run = 10,859ms. The driver's own per-rule bookkeeping was the entire runtime; the spec reader is 150ms for all 100 rules*
- [x] TD-073's stated cause was **tested, not assumed** — *Verify: the shipped-vs-reduced spec question it names is worth only ~2.2s of 10.9s. Neither of its two proposed mitigations was needed, and the row records that it was wrong rather than being quietly rewritten*
- [x] Equivalence proven before the swap — *Verify: both transforms compared over all 100 ids, zero mismatches, including the 21 hyphen-bearing ids that produced a silent false negative the last time this mangling changed*
- [x] Engine report **byte-identical** — *Verify: `diff` over two repositories, 116 and 144 report lines; a speedup that moves a verdict is a regression*
- [x] Trip-wire cleared with headroom — *Verify: harness 9m24s → 3m20s, same 38 cases, `all green`*
- [x] The half that did not get fixed is filed, not dropped — *Verify: TD-075, the git-free cases still parked behind `QA_FULL`; TD-073's own Re-file clause named it in advance*

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
| `scripts/lib/conformance-engine.sh` | T0 | Guard `S9.VERIFYCLAUSE` against the empty-heredoc phantom: read ticks into `$ticked`, `continue` when empty (WHY: an empty `$(...)` in a heredoc yields one empty line, so the rule fired on every unticked Plan and its note branch was dead code) | med | `run-sprint-family-fixtures.sh` 24/24 · discrimination vs unfixed engine |
| `evals/run-sprint-family-fixtures.sh` | T0 | Add retained control `s9-dod-names-no-check-control-zero-ticks` (WHY: both existing controls hand the rule a ticked Plan, so neither could reach the zero-tick path that shipped the bug) | low | reddens on the unfixed engine, sibling stays green |
| `docs/sprint/logs/SPRINT-080-the-last-twelve-rules.md` | T0 | Execution Log created lazily at first entry; baseline + two `scope-change` entries (WHY: ADR-014 · the frozen-Plan rule) | low | n/a |
| `scripts/lib/conformance-engine.sh` | T1 | Four §11 ledger-retention assertions + `_s11_sprint_max` / `_s11_note` / `_s11_collapse_markers` (WHY: §11's ledger half was 4 of the register's 12 `build` rules) | med | 4 must-FAIL + 8 controls; 4 seeded breaks each reddening only its own case |
| `scripts/lib/conformance-engine.sh` | T1 | `_s2_cap_for` takes an optional column and a **leading** integer (WHY: `TODO.md` is a root-table row — Cap at c[4] — and its cell `320 soft (ADR-019)` read as `320019` under the old all-digits `gsub`) | med | probed against both table shapes: 400 and 320 |
| `spec/STANDARD.md` | T1 | §11 LEARNINGS row gains the **Deliberate non-collapse is recorded** exception clause (WHY: the G2 ruling — the check derives its markers from the spec instead of hard-coding them). Not a new rule: §11 still states 11, table still 11 rows | med | `s11-promoted-not-collapsed-control-exception`; denominator still 51 |
| `evals/run-sprint-family-fixtures.sh` | T1 | 13 retained cases incl. the spec-read mechanism case and controls encoding both rejected designs (WHY: TD-012 · L-140 — retain the over-matched case, do not treat it as a fixed bug) | low | harness tally 38 pass / 0 fail |
| `docs/research/conformance-dispositions.md` | T1 | § `build` 12 → 8 rows; heading count corrected with it | low | register/coverage reconcile |
| `docs/research/conformance-coverage.md` | T1 | New row for the four, recording the derived thresholds and both defects real input caught | low | engine `coverage:` 37 + 14 = 51 |
| `scripts/lib/conformance-engine.sh` | T5 | Driver bookkeeping made spawn-free — `fn=`/`pid=` by parameter expansion (WHY: two command substitutions + an external `tr` per rule were the entire runtime, 11.1s of a 10.9s run) | med | equivalence over all 100 ids, 0 mismatches; report byte-identical on 2 repos; harness 9m24s → 3m20s |
| `TECH-DEBT.md` | T5 | TD-073 → resolved with its wrong cause kept and corrected; TD-075 filed for the surviving half (WHY: TD-073's own Re-file clause named the split) | low | id derived from ledger max 074, not remembered (L-143) |
| `scripts/lib/conformance-engine.sh` | T2 | Four §11 archival assertions, five findings; `_s11_archived_at` + `_s11_log_predated_archive` (WHY: §11's archival half was 4 of the register's remaining 8 `build` rules) | med | 18 cases, 10 controls; 4 seeded breaks each reddening one probe repo only |
| `evals/run-sprint-family-fixtures.sh` | T2 | `close_at` helper + 18 retained cases (WHY: `close_commit` appended past the frontmatter is invisible to `_fm_real`, which made a must-FAIL silent AND its control vacuous in the same run) | low | harness 56 pass / 0 fail, 5m06s |
| `CHANGELOG.md` | T2 | Add the §11 link line to `docs/changelog/` (WHY: a **real** finding — 38 rotated files with no pointer from the only file a reader opens; rotation without it hides the record rather than compressing it) | low | `S11.CHANGELOG` PASS |
| `docs/research/conformance-dispositions.md` · `conformance-coverage.md` | T2 | § `build` 8 → 4; coverage row recording the two history-defined rules and the narrow phase scope | low | engine `coverage:` 41 + 10 = 51 |
| `scripts/lib/conformance-engine.sh` | T3 | Four §12 assertions + `_s12_tracked` / `_s12_generated_classes` / `_s12_generated_allowed` / `_s12_matches_class`; scope + refusals recorded in the section header (WHY: the register calls a bare filename heuristic worse than no scan, so a finding needs a shape AND a confirmation) | med | 11 cases, 6 controls built first; 4 seeded breaks each reddening one finding only |
| `evals/run-sprint-family-fixtures.sh` | T3 | `lookalike_repo` + 11 retained cases (WHY: the controls are the load-bearing half here — every one is a shape a heuristic would flag) | low | harness 67 pass / 0 fail, 6m45s |
| `docs/research/conformance-dispositions.md` | T3 | § `build` emptied, kept as a record with why an empty bucket is not "everything is checked" | low | 0 rows; engine `coverage:` 45 + 6 = 51 |
| `docs/research/conformance-coverage.md` | T3 | Row recording the two-signal rule, the refused thresholds, and the six controls | low | table intact |

## Retro

<!-- Written at close. Route the buckets to durable homes (STANDARD §10):
     shipped → CHANGELOG.md · tech debt → TD-NNN · follow-ups → TASK-NNN · learnings → docs/LEARNINGS.md. -->

**Retrieval check** — did we fail to find, or contradict, a prior `L-NNN`/ADR this sprint?

**Cost** — what this sprint cost to run, and in what shape (inline · coordinator + N agents).

**Worked**

**Friction**

**Pattern candidate** (surface to user → `docs/LEARNINGS.md`)
