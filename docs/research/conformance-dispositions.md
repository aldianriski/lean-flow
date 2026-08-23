---
owner: Maintainer
last_updated: 2026-08-21
update_trigger: A rule's disposition changes, or spec/STANDARD.md gains or reclassifies a rule
status: current
id: conformance-dispositions
tags: [process, tooling]
domain: governance
related: [conformance-baseline, conformance-inventory-criteria]
---

# Conformance dispositions — what gets built, what is scoped out, and why

SPRINT-073 T3. Every **mechanically checkable rule with no checker** carries one of two dispositions:
**`build`** (with the finding its check will fire) or **`scope-out`** (with its reason). No rule sits in
an undifferentiated middle. Rule ids are `spec/STANDARD.md` §14's; that file is the source, this one is
the register. Split from `conformance-baseline.md` under §2's growth rule — split, never squeeze (L-131).

**Counts, re-derived from the section tables and reconciled against the engine — never copied forward.**
100 candidates · **100 classified** · **62 checkable** · **30 covered** · **32 dispositioned here — 21
`build`, 11 `scope-out`**. Reconciled mechanically, not by eye: 30 + 21 + 11 = **62**, and no checkable
rule is left without a disposition.
**Counting them: the Rule column, not the row.** These figures are re-derived by counting rule ids in
each section table's **first cell**. Scoping to the row instead over-counts, and did: the § Covered row
for `S2.R-README` explains in its own note that it keeps `S3.README`'s scope-out true, so a row-wide
match reads `S3.README` as a 31st covered rule and the total lands at 63. Caught by that 63 disagreeing
with the engine's 62 — the second-number habit again, on the very query this file's own maintenance
instructions prescribe. L-108 one level in: the register is self-describing too, and its cells discuss
rules other than their own subject.

**What `conformance.sh` reports, and what it does not.** 62 is the figure it prints — its `coverage:`
line publishes two counts summing to it. **30 is not one of them.** That line counts rules with an
assertion *in the engine* and reads **24**; the six-rule difference is the four checkers that still
live outside it (`check-doc-caps.sh` ×3 · `check-ephemeral-intake.sh` · `check-epic-archive.sh` ·
`check-research-archive.sh`). Written out because the earlier phrasing here — *"19 + 32 + 11 = 62,
which is what `conformance.sh` reports"* — reads as if the covered count were the reported one, and
SPRINT-078 promoted three DoD rows built on exactly that misreading (Execution Log, 2026-08-22). Two
numbers, two questions: **how many rules the standard makes checkable** (62, whoever checks them) and
**how many this engine answers** (24, and climbing as the outboard checkers migrate).
**Superseded figures removed at SPRINT-078's promote:** this block read *63 checkable · 12 covered · 39
build · 12 scope-out* for two sprints after the tables below had moved past it — a second SSOT drifting
from the rows it copied, which is the failure the header itself warns about. Per-sprint provenance for
every move lives in the section tables, the sprint archive and git, and is not restated here.

**The §13 divergence is closed (SPRINT-078 T1), not merely re-described.** SPRINT-074 shipped
`check-attestation.sh` covering §13's five `build` rules and § Covered today never gained the row, so
for four sprints this register understated coverage by five and said so in a standing footnote
(TD-065). T1 migrated those five into the engine and moved the row, which is what let the counts above
close: 19 → 24 covered, 32 → 27 `build`.

**Stated as counts, never as a ratio (EPIC-004 D1).** There is no percentage here and there must not be
one: a ratio would improve every time the standard declines to automate something.

**§ Covered today and § Artefacts moved → [`conformance-coverage.md`](conformance-coverage.md)** at
SPRINT-079's promote (§2 Growth rule, 230 > 130). The counts stay here, where they reconcile.
## `build` — 21 rules, each with the finding its check will fire

A check specified without its finding name is a half-shipped gate (L-058). Every row ships with a
**retained** must-FAIL fixture proving that exact string fires (TD-012).

| Rule | Named finding |
|---|---|
| `S9.TWOFILES` | `sprint-plan-over-hard-cap` · `sprint-log-missing` |
| `S9.LOGDIR` | `sprint-log-outside-logs-dir` |
| `S9.PLANFROZEN` | `plan-edited-after-freeze` |
| `S9.SCOPECHANGE` | `scope-change-logged-after-plan-edit` |
| `S9.VERIFYCLAUSE` | `dod-criterion-names-no-check` |
| `S10.FOURBUCKETS` | `retro-bucket-unrouted` |
| `S10.PROMOTION` | `learning-recurred-unpromoted` |
| `S10.TDAGING` | `td-row-aged-unreviewed` |
| `S10.PROMOTEREVIEW` | `promote-checklist-absent` |
| `S11.TDDELETE` | `resolved-td-row-past-retention` |
| `S11.TODOCAP` | `todo-over-cap-at-promote` |
| `S11.CHANGELOG` | `changelog-not-rotated-at-minor` |
| `S11.LEARNINGS` | `promoted-learning-not-collapsed` |
| `S11.SPRINT` | `closed-sprint-not-archived` · `sprint-index-row-missing` |
| `S11.LOGPAIR` | `sprint-log-archived-apart-from-plan` |
| `S11.WHENITRUNS` | `retention-trigger-ran-in-wrong-phase` |
| `S11.BACKLOG` | `shipped-backlog-entry-retained` |
| `S12.SECRETS` | `secret-committed` |
| `S12.BACKUPS` | `database-backup-committed` |
| `S12.DESIGNSRC` | `design-source-committed` |
| `S12.GENERATED` | `generated-artifact-committed` |

## `scope-out` — 11 checkable rules, each with its reason

Three distinct reasons, not interchangeable. **A rule scoped out is still a rule** — stated, marked, and
simply not something *this engine* evaluates. An arrow (`→ X`) names the rule that already covers it; the
target is **not** itself scoped out.

**(a) Restates a rule checked elsewhere — checking both double-counts one constraint (7).**
`S7.ORPHAN` → `S3.SCHEMA` · `S7.PERSON` → `S1.LAW2` · `S7.OUTSIDE` → `S2.F-FILE` · `S7.LEDGER` → §11 ·
`S2.F-ARCHIVE` → §11's ledger · `S9.GATESINFILE` → the same field as `S9.GATESWELLFORMED` ·
`S3.README` → `S2.R-README`. This is §8's problem at rule scale: the standard cross-references itself,
and an engine ingesting every statement inflates its own denominator.

**(b) Governs the standard document, not an adopter's repository (4).**
`S2.R-CAPEXACT` (a cap cell is an integer) and `S2.R-DESIGN` (`DESIGN.md` is absent from the §2 table)
both read **§2's own table**, which an adopter does not have. `S2.R-SKILLCAP` and `S2.R-SKELETON` govern
`SKILL.md`, a Claude Code plugin artifact rather than a general repository concept — an adopter with no
skills would collect findings for files they were never expected to have. **This is the same failure
`implementation-directed` prevents, one category out**: these *are* repo rules, just not *an arbitrary
repo's* rules.

**`S2.R-GROWTH` was listed here and is not a scope-out at all** (SPRINT-076 T1). The spec marks it
**`judgment-only`** — *which sections move is judged* — so it was never in the checkable set this
section partitions, and counting it made § scope-out claim 12 where the engine sees 11. Corrected, the
register reconciles **exactly** against the engine's dispatchable set: 30 covered + 21 `build` +
11 scope-out = **62** checkable rules (30 and 21 as of SPRINT-078 T3). Found the way every sighting of
this class is found — by a second number disagreeing, not by re-reading the prose (L-108).

**(c) No checkable rule falls here — recorded because the category was expected to be large and is
empty.** The §12 content categories (`S12.LEGAL` · `S12.FINANCIAL` · `S12.PERSONAL` · `S12.PRODLOGS` ·
`S12.MEETINGNOTES` · `S12.DRAFTS`) and `S2.R-LAW1INIT` are all marked **`judgment-only`**, so they were
never in the checkable set and need no disposition. A filename heuristic exists for each and is
deliberately not built: a scan flagging `contract.md` in a repo about contract testing is worse than no
scan. **Revisit-if** an adopter reports a real miss one of them would have caught. Listed here for the
reader who expects to find them, not as dispositions.

## Divergences from `conformance-baseline.md` (routed here by T1)

**The baseline is not edited to match, and this file supersedes its coverage figures.**
`spec/STANDARD.md` §14 is the rule source; a derived inventory that disagrees with it is the thing that
is wrong, and `conformance-baseline.md` stays as the frozen record of what SPRINT-072 measured.
**Compressed at SPRINT-078's promote** — the five itemised divergences (§2 is 21 not 20 · §10 is 10 not
11 · §11 is 11 not 12 · the two `?` rules ruled at SPRINT-074 T1 · `implementation-directed` is 6 with 2
in §13) were each settled at SPRINT-073/074 and are reflected in the tables above; the workings are in
the sprint archive and git, and restating them here is a third copy of a reconciled number.
