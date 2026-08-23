---
owner: Maintainer
last_updated: 2026-08-23
update_trigger: A rule gains or loses a checker, or an artefact triage runs against a foreign repo
status: current
id: conformance-coverage
tags: [process, tooling]
domain: governance
related: [conformance-dispositions, conformance-baseline, fixture-coverage-audit]
---

# Conformance coverage — what is checked today, and how it reads to a stranger

Split from [`conformance-dispositions.md`](conformance-dispositions.md) at SPRINT-079's promote under
§2's Growth rule (230 > 130; split, never squeeze — L-131), along the line that file's own title draws:
the register answers *what gets built and what is scoped out*, this answers *what is covered now*.
**The register keeps the arithmetic** (100 candidates · 62 checkable · 30 covered · 21 `build` · 11
`scope-out`) and it is not restated here — a count copied into a second file drifts from the one it
copied (L-108 · L-136). The rows below are the enumeration behind *covered*, never a second source for it.

## Covered today (39 rules, 5 checkers)

| Rule | Checker |
|---|---|
| `S2.F-CAP` · `S7.MEGA` · `S7.SPRINT400` | `check-doc-caps.sh` |
| `S2.R-TEMPDIR` | `check-ephemeral-intake.sh` |
| `S9.GATESWELLFORMED` · `S9.GATESABSENT` | `conformance-engine.sh` *(migrated off `check-gates-signed.sh`, SPRINT-075 T4 — the first family consolidated into the engine; the named findings are unchanged)* |
| `S9.TWOFILES` · `S9.LOGDIR` · `S9.PLANFROZEN` · `S9.SCOPECHANGE` · `S9.VERIFYCLAUSE` | `conformance-engine.sh` *(SPRINT-079 T4; fixtures in `evals/run-sprint-family-fixtures.sh` — PLANFROZEN and SCOPECHANGE are defined over git history, so the family has its own git-backed harness)* |
| `S10.FOURBUCKETS` · `S10.PROMOTION` · `S10.TDAGING` · `S10.PROMOTEREVIEW` | `conformance-engine.sh` *(SPRINT-079 T5; fixtures in `evals/run-sprint-family-fixtures.sh` — FOURBUCKETS reads the close commit and PROMOTEREVIEW the promote record, so the family shares §9's git-backed harness)* |
| `S1.LAW2` · `S1.LAW3` · `S3.SCHEMA` · `S3.AGENTS` | `conformance-engine.sh` *(SPRINT-075 T6 — the engine's first NEW coverage; five published findings, one retained must-FAIL fixture each)* |
| `S4.ONEFILE` · `S4.APPEND` · `S4.INDEX` · `S4.SECTIONS` · `S4.NEGATIVE` | `conformance-engine.sh` *(SPRINT-076 T2 — the §4 ADR family; five published findings, one retained must-FAIL fixture each plus a PASS control. `S4.APPEND` is the family's only Gated rule and the engine's first to read git history rather than the tree)* |
| `S2.F-FILE` · `S2.R-PLACEMENT` | `conformance-engine.sh` *(SPRINT-076 T3 — §2's placement pair, chosen because it is the likeliest artefact source. The required set is derived from §2's own `Create ←` cells, never hard-coded. **See § Artefacts** — the 4 it produced against a generic repo were fixed at the spec by SPRINT-077 T1, and the count is now 0)*
| `S13.TRAILERS` · `S13.OWNCOMMIT` · `S13.EVIDENCESHA` · `S13.AGREE` · `S13.UNSIGNEDCLAIM` | `conformance-engine.sh` *(SPRINT-078 T1 — migrated off the deleted `check-attestation.sh`, findings byte-identical, verified by diff before the old file was removed. The five retained must-FAIL fixtures moved with them. `S13.UNSIGNEDCLAIM` is the engine's only `hold`: it prevents Attested without failing, which the level ladder had to learn in order not to certify an unsigned attestation)*|
| `S2.F-TIER` · `S6.BASE` · `S6.BACKEND` · `S6.MEDIUM` · `S6.MULTISVC` | `conformance-engine.sh` *(SPRINT-078 T2 — one check, the tier a parameter, as this register dispositioned it. Three finding strings, not one: `tier-doc-set-incomplete` (Base · Backend) · `tier-doc-set-underivable` (Multi-service, where §2 carries no row) · `tier-declaration-unreadable`. `S2.F-TIER` answers the DECLARATION half so one absence is never reported twice. Ten retained fixtures)*|
| `S2.R-README` | `conformance-engine.sh` *(SPRINT-078 T3 — the footer half only. §2 marks the rule mechanical on TWO invariants and the anti-SSOT half is a judgement about content, so it is named in the report rather than faked. The required field labels are parsed from §3's own `<sub>` example, which is what keeps `S3.README`'s scope-out — *restates a rule checked elsewhere* — true rather than turning it into a gap. Four retained fixtures incl. a partial-footer case)*|
| `S11.EPIC` | `check-epic-archive.sh` |
| `S11.RESEARCH` | `check-research-archive.sh` |
| `S11.TDDELETE` · `S11.TODOCAP` · `S11.LEARNINGS` · `S11.BACKLOG` | `conformance-engine.sh` *(SPRINT-080 T1 — §11's ledger-retention half; fixtures in `evals/run-sprint-family-fixtures.sh`. Every threshold is READ from the spec, not written in the checker — the retention delay from §11's own `S11.TDDELETE` row, the TODO cap from §2's root-table row, the collapse-exception markers from §11's **Deliberate non-collapse is recorded** clause — and `s11-td-threshold-read` proves it by loosening the delay in a scratch spec and watching the same repository change verdict with no code edit. `S11.BACKLOG` is **split**: it detects the shipped-in-SPRINT breadcrumb, and leaves *whether* an entry shipped to judgement. Thirteen retained cases, eight of them controls — two encode defects found by running the rules against this repository before writing any fixture: a first draft reported **39 conformant entries** by recognising only one of §11's two stored pointer forms, and a second reported an entry that is `[status: active]` but *quotes* `[status: promoted]` in its prose)*|
| `S11.SPRINT` · `S11.LOGPAIR` · `S11.CHANGELOG` · `S11.WHENITRUNS` | `conformance-engine.sh` *(SPRINT-080 T2 — §11's archival half, **five** findings: `S11.SPRINT` carries two because an unarchived sprint and a missing INDEX row are different repairs and one line covering both tells the reader neither (L-058). Two rules are defined over HISTORY: `S11.LOGPAIR` reads the commit each file FIRST APPEARED at its archive path — not its newest touch, which was the first draft and resolved an archived Plan to a later release commit, reporting 24 correct closes as split pairs — and only judges pairs whose live log existed when the Plan moved, since `logs/` arrived with ADR-014 and earlier sprints had no pair to split. `S11.WHENITRUNS` is **split** and deliberately narrow: only the sprint archive is phase-checked, against the sprint's own `close_commit`, because promote is a window rather than a commit and a rotation landing just outside it would be a finding no adopter could act on (§14). **Not-run is not this finding** — a closed sprint never archived is `closed-sprint-not-archived`, and two retained cases pin that the two states stay separate. Eighteen retained cases, ten of them controls)*|

**§13's five findings, and the two rulings worth reading before adopting them.** Names published at
SPRINT-074 T2 (TASK-228), emitted by `scripts/lib/conformance-engine.sh` since SPRINT-078 T1, each with
a retained must-FAIL fixture in `evals/run-attestation-fixtures.sh`:
`attestation-trailers-incomplete` · `attestation-not-on-task-commit` · `evidence-path-unpinned` ·
`attestation-disagrees-with-sprint` · `attestation-unsigned-claim-only`.

- **`attestation-unsigned-claim-only` is reported at exit 0**, not as a gate failure. §14 says a
  conformant report states a *level* and the findings preventing the next one — an unsigned commit
  carrying perfect trailers has genuinely reached **Gated** and genuinely has not reached Attested.
  That is a level, not a defect, and its fixture asserts the engine's **output** rather than its
  status, because status alone cannot tell "reported honestly" from "silently passed" (L-103). The
  migration is where this stopped being free: the engine's single level ladder only ever demoted on
  FAILs, so carrying the finding across as a plain note would have printed `level: Attested` over an
  attestation nobody signed. Hence the `hold` class — prevents a level, never fails.
- **`evidence-path-unpinned` is treated as preventing Attested**, though §13a words `@ <sha>` as
  *strongly recommended* rather than required. Recorded as a ruling rather than defaulted into: the
  register published it as a `build` rule, and §13's own worked example exists because a bare path in
  the reference implementation would already be dead. An adopter clears it by adding the sha — which
  is what keeps it out of the category §14 forbids.

The engine reads §13's Conformance table for its **rule set and marks** at runtime; the assertion
bodies are its own. `S13.NOINFER` and `S13.NOTAUTHOR` are never evaluated — they are
`implementation-directed`, excluded by the spec's own Mark column rather than by a skip list the author
had to remember, and a fixture proves that re-marking a rule in the spec changes behaviour with no code
edit.


**`.conformance-tier` — the second file this engine lets a repository declare (SPRINT-078 T2).** §6
marks all four tier rules `split — detection judged`: *satisfaction* ("given the tier, is its doc set
present?") is mechanical, *detection* ("is this repo multi-dev, sustained, or architecturally forked?")
is a human call the standard declines to automate, and `assert_S2_F_FILE` is already on record refusing
to guess it. So the tier is **declared, not detected** — one token in `.conformance-tier`
(`base` · `backend` · `medium` · `multi-service`), exactly the shape `.conformance-roles` already uses
for §1's role vocabulary.

Undeclared is neither a failure nor a pass: **Base is still checked**, because §6's trigger for Base is
*every dev repo* and needs no detection, and the other three report which fact is missing. An
unreadable token is a finding (`tier-declaration-unreadable`) rather than a silent fall back to Base —
a declaration nobody can read looks like an answer and selects no doc set.

Three finding strings, because the four tiers genuinely differ. Base and Backend have literal-path rows
in §2 and fire `tier-doc-set-incomplete`. **Medium's rows are all families** (`adr/ADR-NNN-<slug>.md` ·
`flows/<slug>.md`) and a family cannot be missing — a repo with no ADRs has taken no qualifying
decision, which §4 makes correct. **Multi-service has no §2 row at all**: §6 names a service registry, a
cross-service dependency map and a global decisions index, and §2's table carries none of them, so
*"satisfaction reduces to `S2.F-FILE`"* has nothing to reduce to. That fires
`tier-doc-set-underivable` — a finding about the **standard**, not about the repository — rather than
deriving an empty required set, which would pass every repo (the L-058 shape). **Follow-up:** §2 owes
rows for Multi-service's three docs, and `DECISIONS.md` is reachable only inside a pattern row's File
cell; both are filed at close, not guessed at here.

Substrate-conditional rows are subtracted from §6's **own** clause, not from §2's `Create ←` prose. The
two disagree — §2 writes `development/coding-standards`'s trigger as a bare "init" while §6 lists that
exact file among the rows *"skipped, not owed"* without code — and §6's tier table is the statement of
the tier doc sets, so it is the one being asked. They are named on a `skipped not owed` line rather than
dropped: a skip nobody can see is indistinguishable from a pass.

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
