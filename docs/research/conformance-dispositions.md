---
owner: Maintainer
last_updated: 2026-08-17
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

**Counts, re-derived from the annotated spec, not from the baseline.** 100 candidates · **100
classified** · **63 checkable** (49 `mechanical` + 14 `split`, counting a split's mechanical half) · **12
covered** · **51 dispositioned here — 39 `build`, 12 `scope-out`**. The baseline's "39
uncovered-mechanical" predates the re-derivation and is superseded; see § Divergences.

Reconciled mechanically, not by eye: 12 + 39 + 12 = 63, and **no checkable rule is left without a
disposition** (`comm` of the checkable set against the union of the three sections returns empty).

**Updated at SPRINT-074 T1**, which ruled the two rules that were still `?`: `S4.INDEX` →
Structural/mechanical, joining `build` below (+1 checkable, +1 `build`); `S5.DISCARDLOG` →
`implementation-directed`, which takes it **out** of the checkable set rather than into `scope-out` —
that mark is not a disposition, and the distinction is the one §14 exists to hold.

**Updated at SPRINT-075.** T4 migrated `S9.GATESWELLFORMED`/`S9.GATESABSENT` off their standalone
checker into the engine — a change of *which file* answers, never of the count or the finding names.
T6 then moved `S1.LAW2` · `S1.LAW3` · `S3.SCHEMA` · `S3.AGENTS` from `build` into § Covered today:
**covered 8 → 12, `build` 43 → 39**, and the identity still closes at 63. Both edits were reconciled
by re-counting the rule ids in each table rather than by adjusting the header (L-105).

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
| `S2.F-FILE` · `S2.R-PLACEMENT` | `conformance-engine.sh` *(SPRINT-076 T3 — §2's placement pair, chosen because it is the likeliest artefact source. The required set is derived from §2's own `Create ←` cells, never hard-coded. **See § Artefacts below** — this is the first covered rule that produces artefacts against a generic repository)* |
| `S11.EPIC` | `check-epic-archive.sh` |
| `S11.RESEARCH` | `check-research-archive.sh` |


## Artefacts — where a covered rule says something a stranger cannot act on

**Recorded because measuring it was the point, not because it is comfortable.** SPRINT-075 T3's triage
returned **0 artefacts** and said so honestly while recording itself as *barely asked*: six of 62 rules
were covered and none was shape-bound. SPRINT-076 T3 covered the two dispositions judged **likeliest**
to be shape-bound, and the number moved.

**`S2.F-FILE` — 4 artefacts of 8 findings against a four-file JS library.** §2's unconditional set (the
nine rows whose `Create ←` cell says "always") mixes two populations:

| Row | Against a generic repository |
|---|---|
| `README.md` · `SECURITY.md` · `CHANGELOG.md` · `docs/architecture/overview.md` · `docs/development/setup.md` | **actionable** — repository-universal; an owner can act on each |
| `AGENTS.md` · `TODO.md` · `.claude/CLAUDE.md` · `.claude/CONTEXT.md` | **artefact** — lean-flow's own loop surface. §2 defines `AGENTS.md` as a thin pointer to `.claude/CLAUDE.md`; `TODO.md` is the lean loop's backlog *mechanism*, and a repo on GitHub Issues already has a backlog |

**Disposition (owner ruling, T3): the engine stays faithful to §2 and is NOT tuned to look quiet.** A
checker that narrows a rule the standard states is deciding a question the standard owns, which is the
inversion §3 and L-058 both name — and it would hide the finding this triage exists to produce. The
real fix is a **spec** change: §2 distinguishing loop-specific rows from repository-universal ones, so
the engine can read the distinction instead of inferring it. Filed as **TASK-243**.

Retained mechanically, not just written down: `evals/run-foreign-repo-fixtures.sh` applies every
*actionable* finding and asserts the remainder is **exactly** these four. When the spec is fixed, that
case reddens and forces a re-triage rather than letting the artefacts quietly become permanent.

**`S2.R-PLACEMENT` — 0 artefacts, and the bound that earned it.** It matches by **basename**, so it can
only fire on a document whose filename §2 owns; a stranger's `notes/design-notes.md` raises nothing.
The cost of that bound is a near-miss it cannot see: the JS library's `docs/architecture.md` is
plausibly the same document as `docs/architecture/overview.md`, and only `S2.F-FILE` reports it — as an
absence rather than a misplacement. Recorded as a known limit, not a defect: widening to fuzzy matching
buys one better finding and an unbounded artefact surface.
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

## `scope-out` — 12 checkable rules, each with its reason

Three distinct reasons, not interchangeable. **A rule scoped out is still a rule** — stated, marked, and
simply not something *this engine* evaluates. An arrow (`→ X`) names the rule that already covers it; the
target is **not** itself scoped out.

**(a) Restates a rule checked elsewhere — checking both double-counts one constraint (7).**
`S7.ORPHAN` → `S3.SCHEMA` · `S7.PERSON` → `S1.LAW2` · `S7.OUTSIDE` → `S2.F-FILE` · `S7.LEDGER` → §11 ·
`S2.F-ARCHIVE` → §11's ledger · `S9.GATESINFILE` → the same field as `S9.GATESWELLFORMED` ·
`S3.README` → `S2.R-README`. This is §8's problem at rule scale: the standard cross-references itself,
and an engine ingesting every statement inflates its own denominator.

**(b) Governs the standard document, not an adopter's repository (5).**
`S2.R-CAPEXACT` (a cap cell is an integer) and `S2.R-DESIGN` (`DESIGN.md` is absent from the §2 table)
both read **§2's own table**, which an adopter does not have. `S2.R-SKILLCAP` and `S2.R-SKELETON` govern
`SKILL.md`, a Claude Code plugin artifact rather than a general repository concept — an adopter with no
skills would collect findings for files they were never expected to have. `S2.R-GROWTH` is the
split-never-squeeze rule, whose mechanical half is just `S2.F-CAP` firing. **This is the same failure
`implementation-directed` prevents, one category out**: these *are* repo rules, just not *an arbitrary
repo's* rules.

**(c) No checkable rule falls here — recorded because the category was expected to be large and is
empty.** The §12 content categories (`S12.LEGAL` · `S12.FINANCIAL` · `S12.PERSONAL` · `S12.PRODLOGS` ·
`S12.MEETINGNOTES` · `S12.DRAFTS`) and `S2.R-LAW1INIT` are all marked **`judgment-only`**, so they were
never in the checkable set and need no disposition. A filename heuristic exists for each and is
deliberately not built: a scan flagging `contract.md` in a repo about contract testing is worse than no
scan. **Revisit-if** an adopter reports a real miss one of them would have caught. Listed here for the
reader who expects to find them, not as dispositions.

## Divergences from `conformance-baseline.md` (routed here by T1)

The baseline's § Coverage by section states 96 rules while its own `rules` column sums to 99 and its
bucket columns to 98, and its **39 uncovered-mechanical** is superseded by the 55 above. Causes, all
identified by SPRINT-073 T1 re-deriving from the spec:

1. **§2 is 21, not 20** — `S2.R-PLACEMENT` carries the legacy-path second-match rule, separable from
   `S2.F-FILE`.
2. **§10 is 10, not 11** — *"doc-aging has two sources"* is data.
3. **§11 is 11, not 12** — two rationale statements out, `S11.WHENITRUNS` in.
4. **`S4.INDEX` and `S5.DISCARDLOG`** are rules the inventory never saw. Both were annotated `?` and
   **were ruled at SPRINT-074 T1** — `S4.INDEX` Structural/mechanical (now a `build` row above),
   `S5.DISCARDLOG` `implementation-directed`. No rule carries `?` at spec 0.4.1.
5. **`implementation-directed` is 6 carried**, none pending, and **2** sit in §13, not 3. The spec's own
   §13 prose said *three* at `:859` and `:874` while its table, §14 and this register all said two —
   corrected at SPRINT-074 T1. The arithmetic settled it without a judgement call: §13 states 5
   mechanical of 7, and 5+3=8.

**The baseline is not edited to match.** `spec/STANDARD.md` §14 is the rule source now; a derived
inventory that disagrees with it is the thing that is wrong, and the baseline stays as the frozen record
of what SPRINT-072 measured. This file supersedes its coverage figures.
