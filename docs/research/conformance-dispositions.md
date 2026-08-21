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
100 candidates · **100 classified** · **62 checkable** · **19 covered** · **43 dispositioned here — 32
`build`, 11 `scope-out`**. Reconciled mechanically, not by eye: 19 + 32 + 11 = **62**, which is what
`conformance.sh` reports, and no checkable rule is left without a disposition.
**Superseded figures removed at SPRINT-078's promote:** this block read *63 checkable · 12 covered · 39
build · 12 scope-out* for two sprints after the tables below had moved past it — a second SSOT drifting
from the rows it copied, which is the failure the header itself warns about. Per-sprint provenance for
every move lives in the section tables, the sprint archive and git, and is not restated here.

**One divergence left standing, named rather than silently repaired.** SPRINT-074 shipped
`check-attestation.sh` covering §13's five `build` rules, and § Covered today never gained that row —
so this register still counts those five under `build`. That predates SPRINT-075 and is not this
sprint's to fix on the way past: correcting it moves numbers three sections of this file depend on,
which is a reconciliation pass, not a footnote. Flagged here so the next reader can tell a known gap
from an oversight.

**Stated as counts, never as a ratio (EPIC-004 D1).** There is no percentage here and there must not be
one: a ratio would improve every time the standard declines to automate something.

## Covered today (19 rules, 5 checkers)

| Rule | Checker |
|---|---|
| `S2.F-CAP` · `S7.MEGA` · `S7.SPRINT400` | `check-doc-caps.sh` |
| `S2.R-TEMPDIR` | `check-ephemeral-intake.sh` |
| `S9.GATESWELLFORMED` · `S9.GATESABSENT` | `conformance-engine.sh` *(migrated off `check-gates-signed.sh`, SPRINT-075 T4 — the first family consolidated into the engine; the named findings are unchanged)* |
| `S1.LAW2` · `S1.LAW3` · `S3.SCHEMA` · `S3.AGENTS` | `conformance-engine.sh` *(SPRINT-075 T6 — the engine's first NEW coverage; five published findings, one retained must-FAIL fixture each)* |
| `S4.ONEFILE` · `S4.APPEND` · `S4.INDEX` · `S4.SECTIONS` · `S4.NEGATIVE` | `conformance-engine.sh` *(SPRINT-076 T2 — the §4 ADR family; five published findings, one retained must-FAIL fixture each plus a PASS control. `S4.APPEND` is the family's only Gated rule and the engine's first to read git history rather than the tree)* |
| `S2.F-FILE` · `S2.R-PLACEMENT` | `conformance-engine.sh` *(SPRINT-076 T3 — §2's placement pair, chosen because it is the likeliest artefact source. The required set is derived from §2's own `Create ←` cells, never hard-coded. **See § Artefacts** — the 4 it produced against a generic repo were fixed at the spec by SPRINT-077 T1, and the count is now 0)*
| `S11.EPIC` | `check-epic-archive.sh` |
| `S11.RESEARCH` | `check-research-archive.sh` |


## Artefacts — where a covered rule says something a stranger cannot act on

**Recorded because measuring it was the point, not because it is comfortable.** SPRINT-075 T3 returned **0 artefacts** and called itself *barely asked*; SPRINT-076 T3 covered the two rules likeliest to be shape-bound and the number moved; SPRINT-077 T1 fixed the cause. All three states are kept — the sequence is the evidence.

**`S2.F-FILE` — 4 artefacts of 8 findings (SPRINT-076 T3) → 0 of 4 (SPRINT-077 T1).** §2's
unconditional set mixed two populations:

| Row | Against a generic repository |
|---|---|
| `README.md` · `SECURITY.md` · `CHANGELOG.md` · `docs/architecture/overview.md` · `docs/development/setup.md` | **actionable** — repository-universal; an owner can act on each |
| `AGENTS.md` · `TODO.md` · `.claude/CLAUDE.md` · `.claude/CONTEXT.md` | **was artefact** — lean-flow's own loop surface. §2 defines `AGENTS.md` as a thin pointer to `.claude/CLAUDE.md`; `TODO.md` is the lean loop's backlog *mechanism*, and a repo on GitHub Issues already has a backlog |

**Disposition (owner ruling, SPRINT-076 T3): the engine stays faithful to §2 and is NOT tuned to look
quiet** — a checker that narrows a rule the standard states is deciding a question the standard owns
(the inversion §3 and L-058 both name), and it would hide the finding the triage exists to produce. The
fix was therefore a **spec** change (TASK-243), delivered by **SPRINT-077 T1** at spec **0.5.0**: §2's
four loop rows name their substrate instead of saying `always`, so the engine derives the distinction
rather than inferring it — no code edit anywhere.

**Re-derived at T1, not copied (L-130):** `core-file-missing` 8 → **4**, artefacts 4 → **0**, whole
report 10 → 6 lines; the four that vanished are exactly the four above. Both retained fixtures reddened
as designed and were **re-triaged, not widened**: `run-foreign-repo-fixtures.sh` back to asserting an
**empty** remainder (stronger — it cannot absorb a new artefact quietly), and
`run-s2-placement-fixtures.sh`, whose must-FAIL seed hard-coded `TODO.md`, now derives its victim from
§2's own unconditional set and asserts the target existed before removal; that guard had been passing
vacuously (L-142).

**`S2.R-PLACEMENT` — 0 artefacts.** It matches by **basename**, so it only fires on a document whose
filename §2 owns; a stranger's `notes/design-notes.md` raises nothing. The cost is a near-miss it cannot
see — `docs/architecture.md` is plausibly `docs/architecture/overview.md`, and only `S2.F-FILE` reports
it, as an absence rather than a misplacement. A known limit, not a defect.
## `build` — 32 rules, each with the finding its check will fire

A check specified without its finding name is a half-shipped gate (L-058). Every row ships with a
**retained** must-FAIL fixture proving that exact string fires (TD-012).

| Rule | Named finding |
|---|---|
| `S2.F-TIER` | `tier-doc-set-incomplete` |
| `S2.R-README` | `readme-ownership-footer-missing` |
| `S6.BASE` · `S6.BACKEND` · `S6.MEDIUM` · `S6.MULTISVC` | `tier-doc-set-incomplete` *(one check, four tiers — the tier is a parameter, not four checkers)* |
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
| `S13.TRAILERS` | `attestation-trailers-incomplete` |
| `S13.OWNCOMMIT` | `attestation-not-on-task-commit` |
| `S13.EVIDENCESHA` | `evidence-path-unpinned` |
| `S13.AGREE` | `attestation-disagrees-with-sprint` |
| `S13.UNSIGNEDCLAIM` | `attestation-unsigned-claim-only` |

**§13's five names were deferred to TASK-228 and are now published here** (SPRINT-074 T2). They are
emitted by `scripts/lib/check-attestation.sh` and each has a retained must-FAIL fixture in
`evals/run-attestation-fixtures.sh`. Two of them carry a ruling worth reading before adopting them:

- **`attestation-unsigned-claim-only` is reported at exit 0**, not as a gate failure. §14 says a
  conformant report states a *level* and the findings preventing the next one — an unsigned commit
  carrying perfect trailers has genuinely reached **Gated** and genuinely has not reached Attested.
  That is a level, not a defect, and its fixture asserts the checker's **output** rather than its
  status, because status alone cannot tell "reported honestly" from "silently passed" (L-103).
- **`evidence-path-unpinned` is treated as preventing Attested**, though §13a words `@ <sha>` as
  *strongly recommended* rather than required. Recorded as a ruling rather than defaulted into: the
  register published it as a `build` rule, and §13's own worked example exists because a bare path in
  the reference implementation would already be dead. An adopter clears it by adding the sha — which
  is what keeps it out of the category §14 forbids.

The checker reads §13's Conformance table for its **rule set and marks** at runtime; the assertion
bodies are its own. `S13.NOINFER` and `S13.NOTAUTHOR` are absent above and are never evaluated — they
are `implementation-directed`, excluded by the spec's own Mark column rather than by a skip list the
author had to remember, and a fixture proves that re-marking a rule in the spec changes the checker's
behaviour with no code edit.

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
register reconciles **exactly** against the engine: 19 covered + 32 build + 11 scope-out = **62**
checkable rules, which is what `conformance.sh` reports. Found the way every sighting of this class is
found — by a second number disagreeing, not by re-reading the prose (L-108).

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
