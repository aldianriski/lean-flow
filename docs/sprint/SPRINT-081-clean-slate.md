---
sprint: 081
slug: clean-slate
owner: Maintainer
last_updated: 2026-08-24
status: active
plan_commit: ddd9081
update_trigger: sprint execute/close events
---

# SPRINT-081 — Clean Slate

> **Theme:** EPIC-004 closed with residue, and this sprint spends it rather than carrying it into
> EPIC-005. Two of the three tasks are the reason this repository reports `level: none` against its
> own standard — sixteen missing ownership headers, and a Base-tier exemption that lives where no
> tool can read it. The third is the exit condition EPIC-004 itself called *honest but early*, now
> worth asking against 45 rules instead of 6. Fleet work starts against a clean tree or it starts
> against an excuse.

## Scope

**In:** the sixteen ownership headers this repo's own docs are missing (TD-064) · a ruling on how a
repository declares a *reasoned* Base-tier doc exemption (TD-077) · the foreign-repo artefact triage
re-run at current coverage (TASK-238, EPIC-004 § Closed-when 1's stated follow-through).

**Out (deferred):** EPIC-005 itself — no fleet mechanics, no pinning, no cross-repo report; its first
member sprint is SPRINT-082 · the sixteen aged TD rows, all held, none `severity: high` · TASK-188,
whose trigger is opportunistic by design and which this sprint's shape cannot generate (L-111) ·
raising this repo past `Structural` — Gated and Attested are not in scope and the reference
implementation is unsigned by known fact, not by oversight.

## Plan

### T1 — Write the sixteen ownership headers this repo's own docs are missing `[size: S · risk: low · class: mechanical-ingest · AFK]`
Layers: `docs/qa/QA-001-prime-entry-detection.md` · `docs/qa/QA-002-intake-to-plan-pipeline.md` · `docs/qa/QA-003-orchestrator-gates-and-check.md` · `docs/research/` · `TECH-DEBT.md` · `docs/knowledge-index.md` (added at execution — L-100; regenerating it is downstream of any `last_updated` this task writes)
Depends-on: none
Cites: `spec/STANDARD.md` §1 LAW 3 · §3 · TD-064 · `conformance.sh` · `S1.LAW3` · `S3.SCHEMA` · `S6.BASE`

The reference implementation fails two of the three rules that hold it below `Structural`, and both
are writable. §1 LAW 3's mechanical half is presence, but a trigger that can never fire is the doc
ageing silently under a header that claims otherwise — so each trigger written is the doc's real one,
derived from what would actually change it, not a placeholder that satisfies a grep.

**Acceptance:** `sh conformance.sh .` emits zero `ownership-header-missing`,
`ownership-header-field-missing` and `update-trigger-absent` findings, and neither `S1.LAW3` nor
`S3.SCHEMA` appears among the rules preventing `Structural`.

**DoD:**
- [x] Re-derive the counts before writing anything — *Verify: `sh conformance.sh .` reports 3 `ownership-header-missing` + 13 `ownership-header-field-missing` = 16 `update-trigger-absent`, the three reconciling against each other (L-108). A different number is the finding, not a nuisance; record it and re-scope*
- [x] `docs/qa/QA-001…QA-003` carry the full four-field header — *Verify: `sh scripts/lib/check-doc-caps.sh` still PASSes each, and `conformance.sh` drops all 3 `ownership-header-missing`* **[ruled at execution — the caps-checker half of this clause cannot reach the QA tree (§2 states no cap for it, so the checker derives none); ticked on the conformance half, owner-approved. See Execution Log]**
- [x] The 13 `docs/research/` docs gain a real `update_trigger:` — *Verify: `conformance.sh` drops all 13 `ownership-header-field-missing`; spot-read three triggers and confirm each names an event that can actually occur*
- [x] `S1.LAW3` and `S3.SCHEMA` are gone from the Structural-blocking set — *Verify: the `level:` line names one remaining rule, `S6.BASE`, and no longer three*
- [x] TD-064 → `status: resolved`, with its evidence line reconciled one last time — *Verify: the row header reads `status: resolved → TASK-257 (SPRINT-081 T1)` with `closed: Sprint-081`, and its Evidence bullet now carries the post-fix reconciliation — `206 + 16 = 222` from the other side, `0` of all three findings, FAIL set 34 → 2, `level:` 3 findings → 1. Ledger 25 → 26 rows (TD-078 filed alongside), ids still descending*
- [x] Gate green — *Verify: `sh scripts/qa-check.sh` read as its own printed `N pass, M fail` verdict line, run as its own call, never through a wrapper's status (L-120)*

### T2 — Rule how a repository declares a *reasoned* Base-tier doc exemption `[size: M · risk: med · class: decision · HITL]`
Layers: `spec/STANDARD.md` · `spec/CHANGELOG.md` · `scripts/lib/conformance-engine.sh` · `evals/` · `docs/architecture/overview.md` · `TECH-DEBT.md` · `.conformance-exempt` · `docs/adr/ADR-031-reasoned-doc-exemptions-are-declared.md` · `docs/DECISIONS.md` · `README.md` · `docs/knowledge-index.md` (the last five added at execution — L-100; the Plan could not name the ADR it had not yet decided to write, nor the declaration file the arm choice produced)
Depends-on: none
Cites: §6 · §2 · §14 · ADR-028 · TD-077 · L-151 · SPRINT-054 T1 · `docs/product/requirements.md` · `acceptance-criteria.md` · `CONTEXT.md`

This repository ruled `docs/product/requirements.md` and `acceptance-criteria.md` exempt at
SPRINT-054 T1, with reasons, and recorded the ruling in `docs/architecture/overview.md` — where the
engine cannot read it. So the ruling behaves exactly as if it had never been taken, which is the
failure promoted into `CONTEXT.md` § Gates at this promote. §2's team-gated rows work because the
*standard's own* condition never fires; a **local** reasoned exemption has no such mechanism, and an
adopter whose requirements live in a tracker or a wiki collects two permanent findings with no
declaration available to them.

**Acceptance:** the ruling lives in the artifact the engine reads, and `sh conformance.sh .` either
stops emitting the two `tier-doc-set-incomplete` findings or names them as an explicit exclusion —
never silently dropped (L-058).

**DoD:**
- [x] The two arms are stated and one is chosen on the record — *Verify: (a) extend `.conformance-tier`'s declaration pattern to per-doc exemptions carrying a reason string · (b) condition-gate §6's Base rows the way §2's team-gated rows already are. The rejected arm is written down with why, not dropped*
- [x] If the chosen arm adds a declaration file or a §2 row, the ADR lands with it — *Verify: §4's three-part bar applied explicitly; ADR-028 is the live precedent for a disposition moved into the artifact the tool reads*
- [x] The spec carries the mechanism, not a checker — *Verify: re-mark the rule in a scratch spec copy and confirm the engine changes verdict with no code edit, the property SPRINT-074 established*
- [x] A retained fixture asserts the named finding on input that must produce it, **and** a sibling control stays green — *Verify: the control reports its own denominator so a case that was never reached is visibly untested rather than quietly green (L-156); Tier **G** applies here — this is the conformance engine, where a false negative is silent by construction (ADR-029)*
- [x] Seeded-break check on the new assertion — *Verify: seed the rejected design, confirm the case reddens while a sibling stays green, confirm the seeded artifact still parses and the break is targeted (assertion count unchanged, line count within one of pristine), then restore under a checked hash (L-137 · L-142)*
- [x] `docs/architecture/overview.md` § Base-tier docs is updated to point at the mechanism rather than to hold the ruling alone — *Verify: the section opens with a pointer to `.conformance-exempt` as the artifact the engine reads, citing ADR-031, and keeps the four rows as narrative; the two §2-gated rows are distinguished as needing no declaration*
- [x] TD-077 → `status: resolved` — *Verify: the row header reads `status: resolved → TASK-258 (SPRINT-081 T2)` with `closed: Sprint-081`, and the row records both the chosen arm and the measurement that rejected arm (b)*
- [x] Gate green — *Verify: `sh scripts/qa-check.sh`, its own printed verdict line*

### T3 — Re-run the foreign-repo artefact triage at current coverage `[size: S · risk: low · class: decision · HITL]`
Layers: `evals/run-foreign-repo-fixtures.sh` · `docs/research/conformance-coverage.md`
Depends-on: T2
Cites: EPIC-004 § Closed-when 1 · SPRINT-075 T3 · SPRINT-076 T3 · TASK-238 · L-015 · L-016 · `S6.BASE`

EPIC-004's first exit condition called its own `0 artefacts` result *honest but early* — it was taken
at **6 of 62** checkable rules, none of them the families most likely to encode our own directory
shape. Those families are now in: §6's tier doc-sets (SPRINT-078), §11's ledger rules (SPRINT-080),
§2's placement pair (SPRINT-076). The question can finally be asked properly. **It depends on T2**
because `S6.BASE` is precisely a shape-bound rule, and re-running the triage before the exemption
ruling would measure a mechanism about to change.

**Acceptance:** the triage is repeated against a from-scratch repo, every finding is classified
*actionable by that repo's owner* or *an artefact of dispositions written against our shape*, and the
verdict is recorded — with a high artefact count routed back to the register rather than used to tune
the engine quiet.

**DoD:**
- [ ] The harness still asserts no lean-flow file was copied in — *Verify: the mechanical assertion SPRINT-075 built, re-run; a later edit that copies a template in must fail loudly rather than quietly measure our own shape*
- [ ] Every finding is classified, none left unrouted — *Verify: counts reconcile — actionable + artefact = total findings, cross-checked against the report's own FAIL tally (L-108)*
- [ ] Artefacts, if any, are routed to `docs/research/conformance-coverage.md` § Artefacts — *Verify: the engine is left faithful; any fix is filed as a spec task, never as a tuning of the checker*
- [ ] The verdict is recorded whichever way it falls — *Verify: `0 artefacts` at 45 rules is a real result and says so; it is no longer the "barely asked" of SPRINT-075*
- [ ] TASK-238 closed, or re-parked with a **narrowed** condition naming the class of fact that would close it (L-094)

### T4 — Stop the level ladder certifying Attested on a tree that claims no attestation `[size: S · risk: med · class: execution · HITL]`
Layers: `scripts/lib/conformance-engine.sh` · `evals/run-attestation-fixtures.sh` · `TECH-DEBT.md`
Depends-on: T2
Cites: §13 · §14 · `S13.UNSIGNEDCLAIM` · `S13.TRAILERS` · ADR-029 · L-058 · T3 (ordered before it, not dependent on it — T4 changes a line every report carries, so the triage must run after)

**Added mid-sprint at T2's execution, owner-approved — see the Execution Log `scope-change` entry.**
T2 cleared the last Structural finding and the report then read `level: Attested`, which §13 states is
unreachable here in as many words. The engine holds a repository at Gated when an attestation is
*claimed and unsigned*, and holds it nowhere at all when **none is claimed** — so claiming nothing
outranks claiming honestly. Latent while this repo sat at `level: none`; live the moment T2 landed.
Sequenced before T3 for D1's reason: it changes a line every report carries.

**Acceptance:** a repository carrying none of §13's three trailers is capped at `Gated`, with the
reason named on the report rather than inferred from silence; a repository that does carry them is
unaffected, and the exit code does not move — a hold is not a failure (§14).

**DoD:**
- [ ] The absent-attestation case holds at the Attested rung — *Verify: `sh conformance.sh .` on this repo prints `level: Gated`, naming the held finding; `level: Attested` no longer appears while 673 of 673 commits are unsigned*
- [ ] The hold is a hold, not a failure — *Verify: exit code and `N pass, M fail` are unchanged from before the edit; §14 says a held finding names a level honestly reached and does not move the exit code*
- [ ] A retained fixture asserts the finding on a repo that claims nothing, **and** a sibling control (a repo that does claim) stays green and reports its own denominator (L-156) — *Verify: Tier **G** under ADR-029; a false negative here is silent by construction*
- [ ] Seeded-break check — *Verify: remove the new hold, confirm the case reddens while a sibling stays green, confirm the seeded artifact still parses and the break is targeted (assertion count unchanged, line count within one of pristine), then restore under a checked hash (L-137 · L-142)*
- [ ] TD row filed or resolved as the fix warrants, with the inverted-incentive statement recorded
- [ ] Gate green — *Verify: `sh scripts/qa-check.sh`, its own printed verdict line*

## Decisions (pre-locked)

- **D1** — **T3 depends on T2**, a dependency neither backlog row carried. `S6.BASE` is shape-bound,
  so T2 changes what a foreign tree sees; running the triage first would measure a mechanism about to
  change and produce a number nobody could act on. Found at promote, which is where a criterion is
  still free to be re-ordered (L-111).
- **D2** — **Overlap ownership: `evals/` belongs to T2 first, T3 second.** Both tasks may touch that
  tree — T2 adding fixtures for whichever arm it builds, T3 extending the foreign-repo harness. T2
  commits first; T3 stages per hunk and verifies `git diff --cached` before committing, never a plain
  `git add` over the other's work (L-042 · L-037).
- **D3** — **T2 is Tier G under ADR-029**; T1 is Tier P and T3 is Tier P. Declared here rather than
  inferred at execution, and defaulted up where it was arguable: T2 touches the conformance engine,
  where a false negative is silent by construction.

## Assumptions

- **A1** — TD-064's counts still hold: 3 + 13 = 16, reconciling three ways. *Confirm: re-derived as
  T1's first DoD, never carried from this Plan — a figure frozen into a DoD is a query result and
  gets its second query at execution (L-130).*
- **A2** — `S6.BASE` is the only rule preventing `Structural` once T1 lands. *Confirm: the `level:`
  line after T1 names exactly one remaining rule; if it names more, the surplus is a finding this
  Plan did not predict and is logged as a scope-change before § Plan is edited.*
- **A3** — The three shape-bound families are genuinely in the engine, not merely registered.
  *Confirm: re-derive from the engine source at T3's start, the way SPRINT-079's promote re-derived
  the §6 disjunct rather than reading it off SPRINT-078's summary.*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-081-clean-slate.md`, rendered from
> `templates/sprint-log.md.template` and created lazily at the first entry. Append there, never here.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `docs/qa/QA-001…QA-003` (×3) | T1 | Full four-field §3 ownership header prepended — they carried none at all, which is the `ownership-header-missing` third of TD-064 | low | `conformance.sh` → `S3.SCHEMA` PASS, all 222 docs |
| `docs/research/` (×13) | T1 | `update_trigger:` added, each derived from what would actually change that doc — a trigger that cannot fire is the failure §1 LAW 3 exists to stop | low | `conformance.sh` → `S1.LAW3` PASS, all 222 docs |
| `docs/knowledge-index.md` | T1 | Regenerated — T1 wrote a newer `last_updated` onto three docs, so the index went stale by date. Content unmoved; the index reads ADR-009 metadata, never `update_trigger:` | low | `qa-check.sh` → `knowledge index` row |
| `TECH-DEBT.md` | T1 | TD-064 → `resolved` with its evidence reconciled a fourth way (206 + 16 = 222); **TD-078 filed** — the QA-TESTCASE template ships no §3 header, which is the *cause* of TD-064's `docs/qa/` third and ships unfixed to every consumer | low | ledger 25 → 26 rows, ids descending, max re-derived not assumed |
| `docs/sprint/logs/SPRINT-081-clean-slate.md` | coordinator | Execution Log created lazily at the first entry (§9 · ADR-014) | low | `conformance.sh` → `S9.TWOFILES` |
| `spec/STANDARD.md` §6 | T2 | States the **reasoned exemption** rule — per doc, reason mandatory, named on every report, local and never a change to what others owe. The rule, not the filename: declaration files are engine vocabulary by existing convention | med | re-mark test — a scratch-spec edit changes the verdict with no code edit |
| `scripts/lib/conformance-engine.sh` | T2 | `_exempt_reason` (three return states: declared-with-reason · not declared · declared-without) wired into `_tier_assert`, consulted only for an absent doc | med | 7 retained fixtures + 2 seeded breaks |
| `.conformance-exempt` | T2 | **New declaration file.** Carries SPRINT-054 T1's two rulings where the engine reads them — previously in `overview.md`, where it behaved as if never taken (TD-077 · L-151) | med | `conformance.sh` names both exemptions with their reasons |
| `evals/run-conformance-engine-fixtures.sh` | T2 | 7 retained cases: reason-less must-FAIL + its still-owed half · reasoned control reporting its own denominator · hyphen regression · whole-path match · inert-when-absent · present-doc | low | each shown to discriminate under a seeded break |
| `docs/adr/ADR-031-…md` · `docs/DECISIONS.md` | T2 | The decision + its index row; arm (b) rejected on a measurement, not a preference | low | `S4.INDEX` |
| `docs/architecture/overview.md` | T2 | § Base-tier docs now points at the declaration file as SSOT and keeps the table as narrative | low | read-through |
| `README.md` | T2 | Third declared file documented for adopters (L-015); **coverage figure corrected 33 → 45**, which the engine has been printing for some time | low | engine's own `coverage:` line |
| `TECH-DEBT.md` | T2 | TD-077 → resolved, with the rejected arm and the measurement recorded | low | ledger row count |

## Retro

_(written at close)_
