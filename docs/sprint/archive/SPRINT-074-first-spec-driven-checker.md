---
sprint: 074
slug: first-spec-driven-checker
epic: EPIC-004
owner: Maintainer
last_updated: 2026-08-18
gates_signed: G1,G2 @ 296115e
plan_commit: 10be550
close_commit: 6016738
status: closed
update_trigger: sprint execute/close events
---

# SPRINT-074 — The First Spec-Driven Checker

> **Theme:** SPRINT-073 made `spec/STANDARD.md` the rule source. Nothing has yet *read* it that way, so
> D1's central claim — that a checker driven by the spec beats eleven that hard-code their rules — is
> still untested. §13 is the right first case: **7 rules, 5 of them mechanical, and zero coverage**, so
> it is the largest checkable block in the standard with nothing behind it, and it is EPIC-004
> § Closed-when 4 in a single cell. This sprint completes §13's rule set, builds that checker, and
> closes the WIP-attribution hole in the checker beside it.

## Scope

**In:** a real mark for the two rules still carrying `?` (T1) · a checker verifying §13's attestation
from git trailers, every check failing with its own **named finding** against a **retained** must-FAIL
fixture (T2) · the uncommitted-WIP path in `check-layers-observed.sh` no longer reading a PASS that the
committed run would fail (T3).

**Out (deferred):** the conformance **engine** — this sprint builds *one* checker and learns whether
spec-driven is buildable; generalising to all 42 `build` dispositions is the engine's job · consolidating
or replacing the existing eleven checkers · the ship-inside-the-plugin vs standalone packaging question,
still the **engine sprint's** G2 (EPIC-004 D2) · ADR-008's scope amendment (§ Closed-when 5) ·
**TD-048's basename-vs-path matcher**, whose trigger fired at SPRINT-073 and which is deliberately not
mixed with T3's matcher change · TD-060's cross-reference resolver · `/orchestrator` and the single-repo
execution loop, frozen absent measured evidence of a defect · EPIC-005 Fleet.

## Plan

### T1 — Rule the two unclassified spec rules `[size: S · risk: low · class: decision · HITL]`
Layers: `spec/STANDARD.md` (§4 · §5 · §14) · `spec/CHANGELOG.md` · `docs/research/conformance-dispositions.md`
Depends-on: none
Cites: `S4.INDEX` · `S5.DISCARDLOG` · SPRINT-073 T1 Execution Log (where both were found) ·
       ADR-024 (the levels) · EPIC-004 § Closed-when 2
Both were found by reading the spec directly and neither appears in the SPRINT-072 inventory, so both
carry `?` — a real reportable state, but an unfinished one. `S4.INDEX` is almost certainly
Structural/mechanical; `S5.DISCARDLOG` is the hard one, because `implementation-directed` is the bucket
an engine must never evaluate against an adopter.

**Acceptance:** no rule in `spec/STANDARD.md` carries `?`, and each newly-marked rule has a disposition
in the register like every other rule of its mark.

**DoD:**
- [x] Both rules carry a real mark, each with its reason — *Verify: grep the spec for `unclassified`;
      zero rows. A mark asserted without a reason is the invention D4 forbade, arriving late*
      → `S4.INDEX` Structural/mechanical · `S5.DISCARDLOG` `implementation-directed`, each with its
      reason in-row. Row-shaped query returns **0**, with a negative control proving the pattern fires;
      the 3 surviving `unclassified` strings are §14's own legend, prose *about* the mark (L-108)
- [x] §14's counts are updated to match — *Verify: the count of `?` rows and the
      `implementation-directed` tally in §14 both re-derived from the tables, not edited by hand*
      → **100 classified · 0 unclassified**, `implementation-directed` **6 carried, none pending**.
      Independent per-section census summed **100** (§4=7 · §5=2 · §13=7) — a second query that could
      have disagreed and did not
- [x] Each newly-marked rule gains a disposition — *Verify:
      `docs/research/conformance-dispositions.md`; a `build` row names its finding, a `scope-out` row
      names its reason*
      → `S4.INDEX` → `build` / `decisions-index-missing-adr` (build census **43**, matching the heading).
      **`S5.DISCARDLOG` gains neither**, by owner ruling at G1: `implementation-directed` takes a rule
      *out* of the checkable set rather than into `scope-out`, so the register records it beside the
      other five carried rules. Read explicitly rather than silently (scope-change 2026-08-17)
- [x] `spec/CHANGELOG.md` records it — *Verify: the file. **PATCH, not MINOR** — marking a rule that was
      already stated adds no obligation, and calling it MINOR would tell adopters to re-read a spec that
      gained nothing they must satisfy*
      → **0.4.1**, with the PATCH reasoning stated in the entry. `version:` bumped in the spec's own
      frontmatter too — not named by this DoD, but a PATCH entry without it would contradict the file
      it describes

### T2 — Build the §13 attestation checker `[size: M · risk: med · class: execution · HITL]`
Layers: `scripts/lib/check-attestation.sh` · `evals/run-attestation-fixtures.sh` ·
        `scripts/qa-check.sh` · `docs/research/conformance-dispositions.md`
        *(corrected at execution, L-100: `evals/fixtures/attestation/` was predicted and is not built —
        §13's cases need real git objects, so the harness constructs repos under `mktemp -d` like every
        other git-building runner, and a static fixture tree would have nothing to hold. The register
        moved **from `Cites:` to `Layers:`** for the same reason — the G1 scope-change made this task
        *write* those rows rather than answer to them, and `check-layers-completeness.sh` caught the
        contradiction on the gate run before the commit)*
Depends-on: T1
Cites: EPIC-004 § Closed-when 4 · EPIC-004 D1 (rules come from the spec) · `spec/STANDARD.md` §13 and
       §14 · ADR-025 (the claim-vs-proof boundary) · L-058 · TD-012 · L-123 (a shape and its checker
       are born together) · the seven §13 rule ids this task answers to and does **not** touch —
       `S13.TRAILERS` · `S13.OWNCOMMIT` · `S13.EVIDENCESHA` · `S13.AGREE` · `S13.UNSIGNEDCLAIM` ·
       `S13.NOINFER` · `S13.NOTAUTHOR`
§13 is the largest covered-nothing block in the standard and the most mechanical section in it, which
makes it the honest first test of D1 rather than the easy one. **The real question is not whether the
checks work — it is whether the checker reads §14's table as its rule source or hard-codes §13**, and
that is a design decision this task must take and record, not assume.

**Acceptance:** a reader with a clone can run one command against any repository and get, for §13, a
named answer per rule — and can see from the checker's own source whether it learned those rules from
the spec or from its author.

**DoD:**
- [x] **The rule-source design is chosen and its alternatives recorded** — *Verify: at least
      "parse §14's Conformance tables" · "parse §13's prose" · "hard-code the five rules" are each
      priced, with the reason the loser lost. **A wrapper that hard-codes does not satisfy spec-driven**
      (SPRINT-073 D3 · EPIC-004 D1) — if hard-coding is chosen anyway, that is a ruling with a stated
      cost, recorded as such rather than defaulted into*
      → **(a) parse §13's Conformance table**, owner-ruled at a popup. All three priced in the
      checker's own header. A correction the pricing forced first: **§14 carries no per-rule table** —
      it is the legend, and the rule tables live in each section's `Conformance.` block, so "read
      §14's table" resolves to §13's. The split is stated rather than glossed: **rule set + marks**
      come from the spec at runtime, **assertion bodies** are the checker's, because "all three
      required together" and "the `Evidence:` value's shape" are different code. Claiming both halves
      were spec-driven would be the theatre §13 itself warns about
- [x] All five `build` rules from the register are checked — `S13.TRAILERS` · `S13.OWNCOMMIT` ·
      `S13.EVIDENCESHA` · `S13.AGREE` · `S13.UNSIGNEDCLAIM` — *Verify: count the assertions against the
      register's rows for §13; a rule silently skipped is a FAIL*
      → five `assert_S13_*` bodies, five register rows, and a live run printing five verdict lines —
      three counts that could have disagreed. Re-derived build census: **43 rows · 43 unique · 43 by
      per-section sum, §13 contributing 5**. A rule silently skipped cannot happen *by construction*
      here rather than by counting: the driver's work list is the spec's, so a mechanical rule with no
      body reports `rule-unimplemented` instead of vanishing
- [x] **Each check fails with a named finding, and the register resolves to those names** — *Verify: the
      five names are specified here and `docs/research/conformance-dispositions.md` line 81 — which
      deferred them to this task rather than publishing them — is completed to point at them; fixture
      output matches. **Restated at G1 by owner ruling (scope-change 2026-08-17)**: the DoD as promoted
      verified against a register entry that deliberately holds no names, so it had no referent (L-088)*
      → `attestation-trailers-incomplete` · `attestation-not-on-task-commit` · `evidence-path-unpinned` ·
      `attestation-disagrees-with-sprint` · `attestation-unsigned-claim-only`, owner-ruled at the same
      popup. The deferring row is replaced by five rows, one per rule, plus the two rulings an adopter
      must read before using them (`unsigned-claim-only` reports at exit 0 · `evidence-path-unpinned`
      hardens a *strongly recommended* into preventing-Attested). Fixture output matches all five
- [x] **One retained must-FAIL fixture per check**, plus a PASS control — *Verify: the harness runs and
      each case fails with its own named finding. A gate's worst failure is the silent false negative,
      and a fixture deleted with the prototype leaves it unguarded (L-058 · TD-012)*
      → `evals/run-attestation-fixtures.sh`, **16 assertions, all green**, retained. Five must-FAIL
      cases (one per published name) + a dead-pin sibling + three that guard the *rule source* itself
      — `spec-table-unreadable` · `rule-unimplemented` · mark-derived exclusion — without which the
      spec-driven design would degrade silently. **All-green on the first run proves nothing**, so two
      defects were seeded and the harness confirmed to detect them: hard-coding the rule list reddened
      exactly the two rule-source cases and left the rest correctly green; reporting an unsigned
      trailer as proof reddened four. Restore verified clean both times
- [x] **The two `implementation-directed` rules are NOT evaluated against a repository** —
      *Verify: `S13.NOINFER` and `S13.NOTAUTHOR` appear nowhere as assertions. They constrain **this
      checker's own inference**; the checker demonstrates them by never concluding approval from an
      unsigned trailer, not by testing a repo for them*
      → both excluded **by the spec's Mark column**, not by a skip list — the strongest argument for
      design (a) and the reason it beat (c). Three independent assertions, because the substring is
      not the claim (L-108): no `^assert_S13_(NOINFER|NOTAUTHOR)\(\)` is *defined* (position-anchored,
      so the checker's comments about them don't match) · neither produces a `PASS`/`FAIL` verdict
      line at runtime · re-marking `S13.TRAILERS` to `implementation-directed` in a spec copy stops
      the checker asserting it **with no code edit**. `S13.NOTAUTHOR` is honoured structurally too:
      `%an %ae %cn %ce` appear nowhere in the checker
- [x] **An unsigned trailer is never reported as satisfying an Attested rule** — *Verify: a fixture with
      perfect trailers over an unsigned commit reports **Gated**, not Attested (ADR-025). This is the
      one that matters: reporting otherwise is the theatre a conformance level exists to prevent*
      → three assertions, not one: the named finding appears · the level line reads
      `level: Gated (not Attested)` · and `level: Attested` appears **nowhere** — a regression that
      rounded up would satisfy the first two and only the third catches it. Asserted on **output**,
      not exit status, since this case correctly exits 0 (L-103). Confirmed live by the seeded defect,
      which reddened all four dependent cases. Independent corroboration: run against this
      repository's own T1 commit, the checker reproduces §13d's worked-example verdict unprompted —
      **Gated, not Attested, `%G? = N`**
- [x] Wired into `qa-check.sh` at the right tier — *Verify: it runs; and if it builds throwaway git
      repos it belongs in `eval_harnesses_optin`, per the declared cost rule (TD-016 · TD-059)*
      → **both halves, at different tiers, because they have different costs.** The *checker* is
      always-on as leg 2f-bis against `HEAD` — it reads git objects that already exist and builds
      nothing. The *harness* is opt-in — 6 throwaway repos via `mktemp -d`, exactly TD-016's boundary.
      Splitting them is the declared rule applied honestly rather than the whole task landing on one
      side of it. It **fires**, verified by the count moving **150 pass at T1 → 154**, the delta being
      this checker's four PASS lines — not by reading that the line is present (L-020)

### T3 — Stop the uncommitted-WIP path accepting a sibling task's declaration `[size: S · risk: low · class: decision · HITL]`
Layers: `scripts/lib/check-layers-observed.sh` · `evals/run-layers-observed-fixtures.sh` ·
        `scripts/qa-check.sh` · `TECH-DEBT.md`
        *(corrected at execution, L-100: `evals/fixtures/layers-observed/` was predicted and is not
        built — this harness constructs repos under `mktemp -d` by its own stated design decision, so
        there is no fixture tree. `qa-check.sh` joined because the cure needs its second wiring half
        (a SKIP the leg neither counted nor printed would have been swallowed, L-020) — a shared file
        with T2, which owns it and committed first. `TECH-DEBT.md` joined because DoD 4 writes TD-037's
        outcome, which the promoted Layers simply omitted)*
Depends-on: T2
Cites: TD-037 (trigger fired at SPRINT-069) · TD-035 lineage · TD-051 (candidate-(c) shape) ·
       SPRINT-069 Execution Log · L-058
Attribution needs a commit to read, so uncommitted work is still tested against the **all-task union** —
the exact weakness TD-035 was filed about, surviving on the one path where nothing can be attributed. A
coordinator running the gate mid-flight reads a PASS the committed run would fail.

**Acceptance:** the same tree driven through both paths — uncommitted, then committed — no longer gives
two different verdicts without saying why.

**DoD:**
- [x] The cure is chosen from priced candidates, none pre-selected — *Verify: report the WIP leg as a
      named **SKIP** rather than a PASS · attribute by staged-vs-unstaged · accept and document the
      boundary. **The row's standing warning binds: do not close this by inferring the in-flight task
      from open-DoD state** — that was a guess when filed, and one observation of masking is not
      evidence it would be right*
      → **the named SKIP**, owner-ruled at a popup with all three priced and none pre-selected. The
      other two lost on stated grounds: *staged-vs-unstaged* infers intent rather than deriving it and
      breaks exactly where needed — L-042 prescribes `git add -p` for a shared file, so the staged set
      spans tasks **by design** in the only case attribution matters for; *document-only* leaves the
      output a bare PASS, and the output is what a coordinator reads. The standing warning was
      honoured in full: **the cure adds no inference at all**, it removes an overstatement
- [x] A fixture drives one tree through **both** paths — *Verify: the harness; a cure asserted on the
      committed path alone has not been exercised on the path the defect lives on*
      → `case 7` in `evals/run-layers-observed-fixtures.sh`: **one repository**, one edit to a file
      that the fixture's Plan declares under one task, asserted while uncommitted (named SKIP, and no
      `PASS` line at all) and then committed under a *different* task — where the identical edit FAILs,
      naming the offending task and the file. Proven to be a real guard rather than decoration — run
      against the **pre-change** checker, all three uncommitted-leg assertions fail. Harness
      **26 PASS / 0 FAIL**, up from a 22-PASS baseline by exactly the four assertions added
      *(the fixture's own task ids are deliberately not quoted here — they belong to a constructed
      SPRINT-915, and naming them reads as a dependency on this sprint's tasks)*
- [x] The chosen behaviour is **not** a silent PASS — *Verify: whatever the WIP leg reports, it is
      named in the output. A leg that checks nothing and says nothing is the false negative this row is
      about, one level up*
      → the SKIP names the file count, that per-task attribution needs a commit, and that **the
      committed run may FAIL where this leg does not**. A second wiring half was needed to make that
      true of what a reader actually sees: `qa-check.sh`'s leg counted only `^PASS` and **did not echo
      the checker's output on success**, so a SKIP would have been swallowed and rendered as
      *"0 sprint files verified — nothing in scope"*. Fixed in the same commit; the cure that stops at
      the checker is half-shipped (L-020)
- [x] TD-037's row records the outcome — *Verify: the row*
      → `status: resolved → SPRINT-074 T3`, with the chosen cure, both rejections and their reasons,
      what was **not** weakened, and the guarding fixture. Row structure re-verified after the edit:
      15 TD rows before and after, diff is 25 insertions / 1 deletion and no reordering — the first
      append landed mid-paragraph and split a sentence, caught by re-reading the whole row (L-009)

## Decisions (pre-locked)

- **D1 — This sprint builds one checker, not the engine.** §13 is a deliberately narrow first case: if
  spec-driven is buildable it will show here at low cost, and if it is not, that is worth learning
  before 42 dispositions depend on it. Generalising is the engine sprint's work. **→ no ADR here.**
- **D2 — The five finding names are a contract already published**, in
  `docs/research/conformance-dispositions.md` one sprint before any code. T2 matches them; it does not
  re-choose them. A finding renamed at implementation time silently breaks a register an adopter may
  already be reading. **→ no ADR.**
- **D3 — `implementation-directed` rules are demonstrated, never evaluated.** `S13.NOINFER` and
  `S13.NOTAUTHOR` constrain the checker's inference. The checker honours them by construction and must
  not emit them as findings — doing so produces findings no adopter can ever clear. **→ no ADR.**
- **D4 — TD-048 is read, not resolved here.** Its trigger fired at SPRINT-073 T2 (a genuine false
  positive plus the behavioural cost it predicted), and it is recorded in full on the row. It is
  excluded because T3 already changes a `Layers:`-adjacent matcher, and two matcher changes in one
  sprint make either regression hard to attribute. **→ no ADR.**

## Assumptions

- **A1** — `spec/STANDARD.md` is **946 lines · 14 sections · version 0.4.0**, carrying **98 classified +
  2 unclassified** rules; §13 holds **7**. *Confirm: measured 2026-08-16 at this promote. Re-derive at
  execution — T1 changes two of these figures by construction (L-130).*
- **A2** — §13's `build` set is **five rules with published finding names**, and its two
  `implementation-directed` rules are excluded from evaluation. *Confirm:
  `docs/research/conformance-dispositions.md` § build and § scope-out, written at SPRINT-073 T3.*
- **A3** — Governance at this promote, owner-signed 2026-08-16: L-promotion **none** (114 entries = 80
  with-count + 34 promoted-and-collapsed, reconciled; the `L-114` flag is the known in-prose false
  positive, confirmed twice) · TD aging **two rows** — **TD-060 held and re-scoped** (its surface grew
  by a whole class: §14's machine-read rule ids), **TD-048 trigger FIRED** and recorded, not vehicled ·
  §11 retention **no trigger due** (TD-058 resolved at 073, deletes at 076) · **zero §2 cap breaches**.
  *Confirm: the checklist and `TECH-DEBT.md`'s two `SPRINT-074 promote` rows.*
- **A4** — Skills are **1.45.0 base-dir vs 1.47.0 repo** — two versions stale by number and **verified
  byte-identical** on disk. *Confirm: `diff -rq --strip-trailing-cr` over the cached `skills/` against
  the repo's, empty. Neither v1.46.0 nor v1.47.0 touched `skills/`. Checked on disk rather than inferred
  from version numbers (L-021 · L-057).*
- **A5** — **This is the first sprint since SPRINT-071 to change executable code.** SPRINT-072 and 073
  were both documentation-only by their own D-rows, so the checker corpus has been frozen for two
  sprints and every retained fixture is untouched. *Confirm: `git diff` over `scripts/` and `evals/`
  across both sprints, empty.*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-074-first-spec-driven-checker.md`, rendered from
> `templates/sprint-log.md.template` and created lazily at the first entry. Append there, never here:
> the Log grows with the work done, so keeping it out of this file is what stops it consuming the
> 400-line budget the Plan needs (STANDARD §9 · ADR-014). The `logs/` subdirectory is load-bearing —
> the sprint-file checks glob `docs/sprint/SPRINT-*.md` non-recursively, so a same-directory
> `-log.md` sibling would be capped and schema-checked as if it were a Plan.

## Files Changed

<!-- Filled during execution; feeds CHANGELOG at close. -->

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `spec/STANDARD.md` | T1 | §4 · §5 marks ruled; §14 counts re-derived — no rule left carrying `?` | low | grep, row-shaped + negative control |
| `spec/CHANGELOG.md` | T1 | 0.4.1 PATCH — a mark on an already-stated rule adds no obligation | low | read |
| `docs/research/conformance-dispositions.md` | T1 · T2 | T1 added `S4.INDEX`; T2 replaced §13's deferring row with five named findings + the two rulings an adopter must read | low | census: 43 rows · 43 unique · 43 by section |
| `scripts/lib/check-attestation.sh` | T2 | **new** — §13 attestation checker; rule set + marks read from the spec at runtime, assertion bodies its own | med | `evals/run-attestation-fixtures.sh`, 16 assertions |
| `evals/run-attestation-fixtures.sh` | T2 | **new** — one retained must-FAIL per published finding, plus 3 guarding the rule source itself | low | self; 2 seeded defects confirmed detected |
| `scripts/qa-check.sh` | T2 · T3 | T2: attestation checker always-on (leg 2f-bis, HEAD) + harness opt-in, split by the declared cost rule. T3: the layers-observed leg now counts and **prints** SKIP, which it did neither of | low | 150 → 154 pass; T3 leg verified on a dirty tree |
| `docs/knowledge-index.md` | T1 · T2 | generated; regenerated to clear the date-drift FAIL (body byte-identical both times) | low | `gen-index.sh --check` |
| `scripts/lib/check-layers-observed.sh` | T3 | WIP leg reports a named SKIP instead of a bare PASS; count is post-exclusion so the caveat fires only when a weaker rule was actually applied | low | `run-layers-observed-fixtures.sh` case 7, both paths |
| `evals/run-layers-observed-fixtures.sh` | T3 | **case 7** — one tree, both paths; 4 stale expectations moved to the new verdict token | low | self; fails against the pre-change checker |
| `TECH-DEBT.md` | T3 | TD-037 `resolved → SPRINT-074 T3` — cure, both rejections, what was not weakened | low | row re-verified: 15 rows, +25/−1, no reordering |

## Retro

**Retrieval check** — no failure to find, and one contradiction, caught early. The contradiction was
D2's claim that §13's five finding names were "a contract already published one sprint before any
code": the register deliberately held none, deferring them here. Found at G1 recon and ruled there
(scope-change 2026-08-17), so the DoD that verified against it had a referent before any code ran —
L-088 avoided rather than survived. **Rules that fired when they mattered:** L-120 (every gate verdict
this sprint was read from the output artifact, and the background runner reported `exit 0` against an
artifact reading `1 fail` **twice**); L-108 (the §13 table parse is position-anchored, cross-checked
7/7/10 before being trusted); L-058 (a `spec-table-unreadable` fixture exists precisely so an
unparseable rule source cannot degrade into checking nothing). **One fired late but correctly:** L-009
— the TD-037 append split a sentence mid-paragraph, caught by re-reading the whole row, which is what
the rule instructs. **One did not fire at all and is this sprint's real miss:** the premise "the
checker reads **§14's** Conformance tables" was copied from TODO into the sprint header into T2's DoD,
and §14 has no per-rule table. Nobody re-derived a structural claim about another document before
freezing a Plan against it → **L-136**.

**Cost** — **inline, coordinator-only; zero sub-agents dispatched.** T2 and T3 both ran in the session
model rather than being handed to `general-purpose` builders, because both tasks' load-bearing work was
`decision`-class (a rule-source design ruling, a cure chosen from priced candidates) with small
mechanical tails. Wall-clock was dominated not by the build but by the **gate**: `qa-check.sh` takes
~3.5 min and was run **five times** across the two tasks (two of them re-runs forced by findings the
gate itself raised, which is the gate working). Two commits, 13 files. Token cost per unit delivered:
not instrumented — said rather than omitted.

**Worked**
- **Seeding a defect to prove the fixtures discriminate.** Both harnesses went green on their first
  run, which establishes nothing about whether the cases reach the code. Seeding the *rejected* design
  (a hard-coded rule list) reddened **exactly** the two cases that justify the chosen one and left the
  other fourteen correctly green. That precision is the evidence the design ruling rests on → **L-137**.
- **Running the checker against real input immediately.** `S13.AGREE`'s uncleanable-finding bug was
  invisible on paper and obvious on the first live run against this repo's own T1 commit. The spec's
  §13d worked example then independently corroborated the whole checker: same verdict, Gated not
  Attested, reached without reading that prose.
- **Letting the existing gates find my mistakes.** Three of this sprint's corrections came from checks
  already in the repo, not from review: `check-layers-completeness.sh` caught the Cites/Layers
  contradiction *and* the fixture-task-id ambiguity; four exclusion fixtures caught the WIP over-report.

**Friction**
- **The knowledge-index gate goes red on the calendar, not the code** — second and third sightings this
  sprint (T1 logged the first). `gen-index.sh --check` byte-compares a freshly generated file whose
  `last_updated:` is stamped with *today*, so it fails on any day after the last regen regardless of
  corpus. Cost: two spurious FAILs and two regenerations that changed one line each → **TD-063**.
- **A five-minute feedback loop on a two-line change.** The full gate is the only way to verify a
  checker's wiring, and at ~3.5 min it discourages the "run the gate alone, then act" discipline it
  exists to serve. Not filed — no cure priced, and the runtime is honest work.
- **`Layers:` needed correcting on both tasks**, for three different reasons (a predicted fixture tree
  that design decisions ruled out, a file pulled in by a G1 scope-change, and a file T3's own DoD names
  that the promoted Layers omitted). This is L-100 working as intended, but three corrections in one
  sprint is a signal that Layers written at promote is a weak prediction for checker work.

**Pattern candidate** (surface to user → `docs/LEARNINGS.md`)
- **L-136** — a structural claim about another document, frozen into a Plan and never re-derived
  (count 1; sibling of L-130, whose count this bumps to 2 and which is now promotion-eligible).
- **L-137** — a fixture suite that passes on its first run has not been shown to discriminate; seed the
  rejected alternative and confirm exactly the discriminating cases fail (count 1).
- **L-138** — a caveat that fires on nearly every input is read as furniture; scope a warning to the
  cases where the weaker rule actually applied (count 1).
- Sightings recorded against promoted rules rather than re-filed: **L-009 ×4** (mid-paragraph append),
  **L-020 ×3** (the SKIP that `qa-check` neither counted nor printed), **L-120 ×3** (a background-task
  notification reporting `exit 0` over an artifact reading `1 fail` — a **new reporter channel**, not a
  new rule).
