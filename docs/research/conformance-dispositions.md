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
100 candidates · **100 classified** · **51 checkable** · **35 covered** · **16 `build`** · **0
`scope-out`**. Reconciled mechanically: 35 + 16 = **51**, matching the engine's own `coverage:` line
(29 with an assertion + 22 gaps).
**Checkable went 62 → 51 at SPRINT-079 T1 and the eleven did not vanish — they were marked.** A
disposition written here cannot reach the engine, which dispatches on `spec/STANDARD.md`'s Mark column;
all eleven now carry `restated` (7) or `standard-directed` (4) there. Record → § `scope-out` below.
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
## `build` — 16 rules, each with the finding its check will fire

A check specified without its finding name is a half-shipped gate (L-058). Every row ships with a
**retained** must-FAIL fixture proving that exact string fires (TD-012).

| Rule | Named finding |
|---|---|
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

## `scope-out` — dissolved at SPRINT-079 T1; the record

**This bucket no longer exists, and its eleven rules are now marked in the spec.** The section is kept
as the record of why, because the ruling is more useful beside the classification it replaced than in
git alone.

**What it held, and where each rule went** — the two classes were already correct; what was wrong was
the *place*. A disposition written here cannot reach the engine, which dispatches on
`spec/STANDARD.md`'s Mark column, so all eleven reported to every adopter as `rule-unimplemented`:
*checks the standard owes you and has not written yet*. Seven are checked under another id; four
cannot be checked against any adopter's tree.

- **→ `restated` (7)** — the constraint is carried by another rule, named beside it: `S7.ORPHAN` →
  `S3.SCHEMA` · `S7.PERSON` → `S1.LAW2` · `S7.OUTSIDE` → `S2.F-FILE` · `S7.LEDGER` → §11 ·
  `S2.F-ARCHIVE` → §11's ledger · `S9.GATESINFILE` → `S9.GATESWELLFORMED` · `S3.README` →
  `S2.R-README`. This was recorded here as *"§8's problem at rule scale"*, and it got §8's answer:
  §8 contributes 0 for exactly this reason.
- **→ `standard-directed` (4)** — governs the standard document, not a repository: `S2.R-CAPEXACT` and
  `S2.R-DESIGN` read §2's own table, which an adopter does not have; `S2.R-SKILLCAP` and
  `S2.R-SKELETON` govern `SKILL.md`, a plugin artifact. Recorded here as *"the same failure
  `implementation-directed` prevents, one category out"* — which is the mark it became.

**`S2.R-GROWTH` was listed here and was never a scope-out** (SPRINT-076 T1) — the spec marks it
`judgment-only`, so it was never in the checkable set this section partitioned. Kept because the
correction is the useful part: counting it made this section claim 12 where the engine saw 11, and it
was found by a second number disagreeing rather than by re-reading the prose (L-108).

**Class (c) was empty and stays empty.** The §12 content categories (`S12.LEGAL` · `S12.FINANCIAL` ·
`S12.PERSONAL` · `S12.PRODLOGS` · `S12.MEETINGNOTES` · `S12.DRAFTS`) and `S2.R-LAW1INIT` are all
`judgment-only` and were never in the checkable set. A filename heuristic exists for each and is
deliberately not built: a scan flagging `contract.md` in a repo about contract testing is worse than no
scan. **Revisit-if** an adopter reports a real miss one of them would have caught.

## Divergences from `conformance-baseline.md` (routed here by T1)

**The baseline is not edited to match, and this file supersedes its coverage figures.**
`spec/STANDARD.md` §14 is the rule source; a derived inventory that disagrees with it is the thing that
is wrong, and `conformance-baseline.md` stays as the frozen record of what SPRINT-072 measured.
**Compressed at SPRINT-078's promote** — the five itemised divergences (§2 is 21 not 20 · §10 is 10 not
11 · §11 is 11 not 12 · the two `?` rules ruled at SPRINT-074 T1 · `implementation-directed` is 6 with 2
in §13) were each settled at SPRINT-073/074 and are reflected in the tables above; the workings are in
the sprint archive and git, and restating them here is a third copy of a reconciled number.
