---
sprint: 096
slug: rule-the-ownership-tension
owner: Maintainer
last_updated: 2026-09-08
status: active
gates_signed: G1,G2 @ 42ffbdd
plan_commit: 896fc18
close_commit: [sha — set at close]
update_trigger: sprint execute/close events
---

# SPRINT-096 — Rule the Ownership Tension

> **Theme:** Three designs for "does an archived sprint own its own commits?" were each broken by an
> independent review, and each was the same laundering class one level deeper — cited number, then
> number + window, then number + declarations (**L-190**). The decisive fact was found by looking
> *outside* the task: the **active**-sibling skip has always trusted the cited number with no test at
> all (**TD-141**), so all three designs were held to a bar the surrounding code never met. That
> reframes the work from *fix the guard* to *rule a tension the codebase never stated* — an owner
> decision, not an engineering one. This sprint takes the ruling first, corrects the cause every
> artifact repeats second, and only then touches code.

## Scope

**In:**
1. A recorded ruling on which failure this repo accepts, covering **both** sibling kinds.
2. TD-125's stated cause corrected in every artifact that repeats it.
3. `check-layers-observed.sh` brought into line with the ruling — whatever the ruling is.

**Out (deferred):** a fourth attempt at a subject-based ownership heuristic (L-190 — the loop ends by
re-scoping, not by refining) · EPIC-015's § Closed-when 1 · 5 · 6 (`TASK-319`/`296`/`297`, still P1
and untouched here) · the `TODO.md` prune, offered at this promote and not taken · archiving
SPRINT-094/095 · shortening the 103 collapsed LEARNINGS headings to a gist.

## Plan

### T1 — Rule the archived-sprint ownership tension, then re-scope TASK-298 `[size: M · risk: high · class: decision · HITL · J2]`
Layers: TECH-DEBT.md · TODO.md · docs/adr/ · docs/DECISIONS.md
<!-- Layers widened mid-sprint by the 2026-09-08 `scope-change` entry in the Execution Log, logged
     before this line was edited: the ruling clears STANDARD §4's three-part bar, so it is recorded
     as ADR-040 rather than as prose in a debt row. G2 re-confirmed by the owner. -->

Depends-on: none
Cites: TD-141 · TD-125 · L-190 · SPRINT-095 T1 (closed at 0 of 6) · `check-layers-observed.sh` · `docs/LEARNINGS.md` · `qa-check.sh`

The repo cannot avoid both failures: report commits citing an archived sprint and TD-125's false
positives make archiving turn the gate red; skip them and a commit subject launders real undeclared
work. The pre-existing code already chose the second for **active** siblings and never said so, so a
ruling that covers only archived siblings is inconsistent by construction. Not a fix — a ruling, plus
the re-scoped shape the code task inherits.

**Acceptance:** a reader can point at one recorded decision that says which failure this repo accepts
and why, and it answers for archived **and** active siblings in the same sentence.

**DoD:**
- [x] The tension is stated as a genuine fork, with the cost of each side named — not a preference — ✓
      ADR-040 § Context states it as *report and you get TD-125's false positives on archival; skip
      and you get a laundering channel*, and § Consequences names a loser on the side taken (the
      channel is open on both arms, bounded by the 96 sprint numbers that exist). **Judgment tick** —
      no mechanical check reaches "is this fork genuine"
- [x] The ruling covers **both** sibling kinds, and says so explicitly — *Verify: the recorded ruling
      names `sibling_sprints`' active arm as well as the archive arm; a ruling silent on one is
      incomplete, which is the defect TD-141 records* — ✓ **and the check failed first.** ADR-040 as
      first written named neither `sibling_sprints` nor the active arm's own test; the pre-screen
      returned 0 occurrences and the tick was held rather than taken. § Decision now names the
      identifier and the active arm's `case " $sibling_sprints "` test explicitly, and rules both in
      one statement (*"archived or active, with no further test"*). Pre-screen re-run: 3 occurrences,
      both arms in § Decision. Recorded honestly as a **mechanical pre-screen over a judgment tick**
      — EXISTS ✓ RUNS ✓ REACHES ✓ **PROVES ✗**: naming both arms is not the same as ruling well on
      both, and no checker was invented to pretend otherwise (L-136)
- [x] ✓ The three broken designs are listed as **rejected with their breaking reason**, so a fourth
      attempt costs a re-read rather than a review cycle (L-190) — ✓ ADR-040 § Context lists all
      three with the reason each died (91 numbers exempt anything · windows nest, SPRINT-089/090
      share a close commit · declarations are shared, `docs/LEARNINGS.md` by 74 of 91), and
      § Alternatives repeats designs 2 and 3 as rows so a reader who opens only that table still
      meets them. **Judgment tick**
- [x] ✓ At least one option outside the three is costed — make archival not change the checker's input
      set at all; accept the channel explicitly for both kinds; or find a signal that is not the
      commit subject — ✓ **two** costed, both with derived figures rather than estimates: the
      `qa-check.sh` glob change takes checker subjects **3 → 96** (`ls` on both directories) on a
      gate that already cannot finish, and the `Sprint: NNN` trailer route is rejected on size not
      merit — **0 of the last 60 commits carry any trailer** (`git log -60 --format='%(trailers:key=Sprint)'`),
      and it cannot retro-fit 91 archived sprints. ADR-040 records the trailer route with an explicit
      re-open condition
- [x] ✓ TD-141 records the ruling and its consequence; `TASK-298`'s Backlog entry is re-scoped to the
      shape that follows, or withdrawn if the ruling makes it moot — ✓ TD-141 carries the ruling, the
      pointer to ADR-040, and stays `open` at `severity: high` because the tree still runs the
      rejected design. `TASK-298` is re-scoped and retitled, with `depends-on:` now naming TASK-331
      as shipped and its superseded `assumes:` marked false-and-measured-false. Ledger integrity
      re-derived after the edit, not assumed: 76 rows before and after; TODO 15 task rows / 13
      `ready` before and after, and every task row still preceded by a blank line — the fused-entry
      check L-009 exists for, which caught one missing separator here

### T2 — Correct TD-125's stated cause and every artifact that repeats it `[size: S · risk: low · class: mechanical-ingest · AFK · J1]`
Layers: TECH-DEBT.md · TODO.md · docs/sprint/SPRINT-095-guards-that-misreport.md · docs/sprint/SPRINT-094-guards-for-what-nothing-reads.md
<!-- Layers widened mid-sprint by the 2026-09-08 batch-G2 `scope-change` entry, logged before this
     line was edited: SPRINT-094:190 carries the identical cause claim with the identical stale
     `:429`, and the frozen Acceptance says *no live artifact*, so the declared set was narrower than
     the criterion it serves (L-186 at the artifact-set level). Owner-ruled to widen. -->

Depends-on: none for the RULING — the cause is wrong either way. **Ordered after T3 at batch G2**
(`scope-change`, 2026-09-08): T2's deliverable is line numbers inside `check-layers-observed.sh` and
T3 rewrites that file, so in Plan order every figure T2 freezes is stale within one commit (L-130).
The two are file-disjoint, so only the figures bind — and they bind T2 to T3.
Cites: TD-125 · TD-131 · SPRINT-095 T1 Execution Log · `check-layers-observed.sh` · `qa-check.sh`

TD-125 names `check-layers-observed.sh`'s `*/archive/*` filter as the mechanism. Measured, that line
alone changes nothing: 092 is blamed for 85 commit:path pairs with the filter present **and** deleted.
The operative mechanism is upstream — `qa-check.sh` hands the checker a non-recursive
`ls docs/sprint/SPRINT-*.md`, so an archived sprint never reaches `"$@"` to be filtered at all.

**Acceptance:** no live artifact still names the `*/archive/*` filter as TD-125's cause, and the
upstream glob is named in its place.

**DoD:**
- [x] ✓ TD-125's Summary names the non-recursive glob in `qa-check.sh`'s layers-observed leg as the
      mechanism, with the measured disproof of the old claim beside it — ✓ and the disproof is
      **deductive, not just measured**: the filter operates on the argument list, which the
      non-recursive `ls` never puts an archived file into, so it is *unreachable* for archived
      sprints rather than merely ineffective. The 85-pair figure corroborates it. The row also now
      carries the derived figures with an explicit *re-derive, do not cite this line*
- [x] ✓ `TASK-298`'s Backlog entry and SPRINT-095's T1 text carry the same correction — *Verify: a
      corpus grep for the old claim over live paths returns zero, with `.claude/worktrees/` excluded
      (a bare `grep -r` counts three repo copies as content — L-170)* — ✓ **and the Verify as written
      could not be run honestly.** A negative grep over this corpus matches prose *about* the claim,
      because the corpus documents its own corrections — L-108's trap, and my first attempt fell into
      it and returned 11 hits it could not classify. Run instead as a **classification of all 24 live
      hits by shape**: 5 append-only log entries · 1 the ADR · 12 correction/refutation context · 6
      unrelated `*/archive/*` uses in other rows, each read individually. Zero live artifacts still
      *assert* the old cause, and the Acceptance's positive half was checked **directly** rather than
      inferred from a negative. **Scope widened at batch G2:** SPRINT-094 carried the identical claim
      outside the frozen `Layers:` (L-186 at the artifact-set level) and is corrected too
- [x] ✓ TD-131 records the archived-file `fmv()` call site's **life and removal** — SPRINT-095 T1 added
      it, SPRINT-096 T3 reverts it, so the row's CRLF exposure is unchanged — *restated at batch G2 on
      owner ruling, `scope-change` logged. The frozen wording ("`fmv()` **gained** a call site") is
      falsified by this sprint's own T3: ADR-040 discovers archived sprints from their FILENAMES, with
      no frontmatter read, so the call site does not survive the sprint. Ticking the frozen words would
      record a fact SPRINT-096 erases (L-088)* — ✓ recorded with what the near-miss would have cost
      (every archived sprint reading empty on a real CRLF checkout), and with the row's claim
      **reproduced a second time** by T3's first selection fixture, which its own vacuity guard caught
- [x] ✓ The line number is **derived, not quoted from either artifact** — TD-125 cites 429 and
      `TASK-298` cites 430 for the same statement, so at least one is already stale (L-130) — ✓ **both
      were stale, and so was a third the DoD does not name**: `TASK-332` cited `qa-check.sh:1013`
      against a real `:1198`. Derived at `a333134`: `qa-check.sh:1198` · checker `:401` (filter, now
      vestigial) · `:457` (archived-filename discovery) · `:508` (the single per-commit skip). Each
      corrected row now instructs its reader to re-derive rather than cite

### T3 — Bring the sibling skip into line with the ruling `[size: S · risk: med · class: execution · HITL · J1]`
Layers: scripts/lib/check-layers-observed.sh · evals/run-layers-observed-fixtures.sh
<!-- `evals/fixtures/layers-observed/**` dropped at batch G2: the directory does not exist and never
     did — this harness generates its fixture trees inline. A declaration naming a path the tree does
     not have is a prediction, not a live declaration (L-100). Logged, no owner ruling needed. -->

Depends-on: T1
Cites: TD-141 · TD-125 · ADR-029 (Tier **G**) · L-142 · L-166 · L-169 · L-186
       `scripts/orphan.sh` `src/orphan.js` `SPRINT-952.md` `SPRINT-960.md`
       `check-layers-completeness.sh`
<!-- The four backticked names above are paths INSIDE throwaway fixture repos (and one hypothetical
     filename shape), not files in this repository — they appear in the DoD ticks because naming the
     sibling control and the slugless member is what makes those ticks checkable. `Cites:` is the
     sanctioned escape for exactly this (SPRINT-049 T3, rulings R3/R4): the checker cannot tell a
     filename a task TOUCHES from one its prose merely names, so the author declares intent rather
     than rewording the record to keep the gate quiet. Added after `check-layers-completeness.sh`
     FAILed on them — the gate was right, and this is the response it asks for. -->


Tier **G** — this is the attribution guard, and a false negative in it is silent by construction.
The DoD below is deliberately written against *whatever* T1 rules, because a criterion frozen to one
mechanism is unreachable the moment the ruling picks another (L-111 · L-160).

**Acceptance:** archived and active siblings are decided by the **same** named rule — T1's — and a
genuinely undeclared path still FAILs with its named finding.

**DoD:**
- [x] ✓ Both sibling arms are decided by one rule, named in the code, matching T1's ruling — ✓ one
      `case " $sibling_sprints "` membership test at `check-layers-observed.sh:508` decides both;
      archived numbers are discovered by filename at `:457` and appended to the same list the active
      loop builds. The comment that formerly asserted the asymmetry as *"deliberately asymmetric"*
      is gone, and `owns_commit()`, `archived_decls` and its `mktemp`/`trap` are removed (grep for
      all three returns zero). **Judgment tick** — no mechanical check reaches "is this one rule"
- [x] ✓ Proven on the **real 092/093 pair** and not fixtures alone (L-166) — the archived pair is
      already in `docs/sprint/archive/`, so the motivating artifact exists in-tree — ✓ **NO
      REGRESSION, and NO DISCRIMINATION — ticked on the first, and the second is recorded as a limit
      rather than glossed.** 092 was made live again with 093 archived, the real TD-125 scenario:
      21 `sprint(093)` commits sit inside 092's window. Blamed pairs **11 → 11**, and **zero
      `sprint(093)` commits blamed on 092 under either checker** (the four blamed are unattributed
      governance commits, the pre-existing TD-107 class). Both designs *agree* here, because 093's
      commits are covered by 093's own declarations. They differ only at the accepted hole, and the
      real tree holds no instance of it — **no live sprint window cites any archived number**,
      derived. So the motivating artifact proves the branch **reachable and correct**, which is what
      L-166 asks; it cannot prove behaviour changed, and the fixtures carry that half
- [x] ✓ Retained must-FAIL fixture **per check**, each failing with its named finding, plus a sibling
      control that stays green in the same run (L-058 · L-142) — ✓ **61** PASS / 0 FAIL / 0 NOTE.
      Three sibling controls (`scripts/orphan.sh`, `src/orphan.js` ×2), each asserted to FAIL **by
      name** in the same run as its silence assertion. The `archived-window` case is **INVERTED, not
      deleted** — it now pins the accepted hole, so re-narrowing the rule fails loudly in either
      direction; an accepted hole with no fixture is indistinguishable from an unnoticed one.
      **This tick was FALSE when first taken at 59 cases, and the outside reviewer is what corrected
      it** — *per check* was satisfied for every branch except one: the archived loop's self-sibling
      guard, load-bearing as of this commit and commented *"same guard as the active loop"* whose own
      twin has had a named case since TASK-299. Seeding its removal left all 59 green while real
      undeclared work was swallowed at exit 0. Closed by `ceb7924`, re-proven below

- [x] ✓ **A fixture that varies the SELECTION, not the verdict** (L-186) — a member reached by the
      other glob arm, so the guard is proven reachable for artifacts of the same kind and not only
      for its motivating one — ✓ two members, both directions of the axis: **A** an archived sprint
      with **no `sprint:` key at all** (the frontmatter route selects nothing; the filename route
      selects it) and **B** a **slugless filename** `SPRINT-952.md` (which the glob admits and a
      slug-requiring pattern rejects). Both premises are asserted by the fixture rather than assumed.
      **Earned its place mechanically:** seed 2 below reddens this case and *only* this case out of
      59. **And it found a real defect in my own first draft** — the selection had required the
      `-<slug>` segment, so `SPRINT-960.md` would have been silently dropped from the trusted set.
      Population re-derived: 93 admitted, **93 selected, 0 rejected**, filename and frontmatter
      agreeing on all 93
- [x] ✓ Seeded-break discrimination proof: seed verified landed (`diff --strip-trailing-cr`, at least
      one changed content line — `cmp` is not a landing guard on a CRLF checkout, L-187), artifact
      still parses, break targeted not a demolition, and the case reddens while a sibling control
      stays green — *Verify: a landed seed that reddens nothing is reported as untested* — ✓ two
      seeds, each landed (2 changed lines), parsing (`sh -n`), targeted (line delta **0**), restored
      under a verified hash. **Seed 1** (archived numbers never appended) → 4 archived cases red,
      **all three sibling controls green**. **Seed 2** (selection re-narrowed to require a slug) →
      **exactly one of 59 red**, the L-186 case. The abort conditions were wired to report *untested*
      rather than pass; neither fired
- [x] ✓ Evidence block states **one** hash convention and uses it throughout (L-169) — prefer
      `git show <ref>:<path> | sha256sum`, never mixed with a working-tree hash — ✓ **one convention,
      stated, and it is `git hash-object <path>` rather than the preferred form — because the seeded
      artifact is by construction never committed**, so `git show <ref>:<path>` cannot address it.
      `git hash-object` is the normalization-aware sibling the DoD's own parenthetical names, and the
      repo pins `*.sh` to `eol=lf` (`git ls-files --eol` reports `i/lf w/lf`), so blob and working-tree
      bytes coincide and the figures reproduce on any checkout. Pristine
      `d50f083bb72f50517896f73a542130c49410861b` → seed 1 `0bf8537…` → seed 2 `a7ce778…` → restored
      `d50f083…`, verified equal. No working-tree hash is mixed with a blob hash anywhere in the trail
- [x] ✓ An **outside reviewer**, dispatched worktree-isolated, passes the change (L-165 · L-168) —
      *Verify: the review runs in its own worktree, and no `git add -A` crosses it* — ✓ **and it did
      not pass on the first submission, which is the point.** Isolation verified after the fact
      rather than assumed: the working tree returned clean and the checker's hash still equalled
      `d50f083…`, so nothing the reviewer seeded crossed into this tree (L-168). It **cleared** the
      class this change was most at risk from — it re-derived the population independently (93
      filenames parse, all matching frontmatter string-for-string including zero-padding, no
      duplicates), checked `dirname`-relative discovery under an absolute path containing a space,
      and confirmed the non-recursive glob excludes `archive/logs/` leaving no orphan — and it
      **found the branch-level gap above**, which every bar in the Tier-G ladder is structurally
      blind to: L-166 asks about the motivating artifact, L-186 about the population, and both sit at
      the artifact-set level while this sat one level down in a guard's own branches. Reproduced here
      before fixing rather than taken on report; fixed in `ceb7924` and re-proven with seed 3 (only
      the archived guard removed, active twin intact → **exactly one of 61 red**, restored under the
      same single hash convention). One reviewer, one finding, no builder retry needed beyond it
- [x] ✓ T1's ruling is recorded where the **code's** reader meets it, not only in the ledger —
      *Verify: `check-layers-observed.sh` carries the rule in a comment at the `sibling_sprints`
      build, and it is the rule T1 recorded, not a restatement* — ✓ the block at `:404` states the
      rule as a quoted decision (*"A commit citing another sprint's number belongs to that sprint —
      archived or active, with no further test — and this repository ACCEPTS the laundering channel
      that follows"*), names ADR-040, lists the three rejected designs with the reason each died, and
      carries the consequence in the imperative: **this checker is not a guard against a dishonest
      commit subject and must not be cited as one.** The per-commit skip at `:508` carries the same
      rule again where the test itself is read

## Decisions (pre-locked)

- **D1 — T1 rules before T3 writes code, and T3's DoD is written mechanism-free.** Three attempts
  have now failed by designing first; the fourth without a ruling repeats the loop (L-190).
- **D2 — `TECH-DEBT.md` and `TODO.md` are shared by T1 and T2. T2 goes first and commits alone; T1
  then edits.** Serialize rather than stage per-hunk — the two touch the same TD-125/TASK-298
  neighbourhood, and `git add` over another task's WIP contaminates at the commit phase (L-042 ·
  L-037). Re-read the whole row after either edit: a markdown list-entry edit can fuse neighbours
  while grep and line caps stay clean (L-009).
- **D3 — T3 is Tier G and takes the full bar, including the outside isolated reviewer.** Declared
  here, not inferred (ADR-029).

## Assumptions

- **A1 — archiving SPRINT-092/093 as a pair does not turn the gate red, and this is measured, not
  assumed.** Done at this promote: clean HEAD reported 6 FAILs across the four sprints; after the
  move, what `qa-check` now passes (094 + 095 only) reports the same 4, with 092's and 093's two
  removed and none added. *Confirm: re-derive at close rather than inheriting this line — the tree
  will have moved.*
- **A2 — the operative mechanism is `qa-check.sh`'s non-recursive glob, not the `*/archive/*`
  filter.** Independently reproduced at this promote by reading the leg. *Confirm: T2 re-derives it;
  it is that task's subject, not a fact inherited from here.*
- **A3 — TD-141's channel is pre-existing, so T3 is not repairing a regression SPRINT-095 introduced.**
  *Confirm: T1's ruling rests on this; verify at `2335eab~1` as TASK-331's entry records.*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-096-rule-the-ownership-tension.md`, created
> lazily at the first entry. Append there, never here: § Plan is frozen at promote.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `docs/adr/ADR-040-commit-ownership-accepts-the-subject-claim.md` | T1 | the ruling itself — a commit subject is unverifiable, so the choice is which failure the repo accepts, not which proxy | Med | judgment; pre-screen confirms both arms + `sibling_sprints` named |
| `docs/DECISIONS.md` | T1 | index row, so the ADR is reachable from the one page that lists them | Low | 39 → 40 rows, re-derived |
| `TECH-DEBT.md` | T1 | TD-141 records the ruling and points at ADR-040; stays `open` because the tree still runs the rejected design | Low | 76 rows before and after; `Re-file fresh if` still the block's last line |
| `TODO.md` | T1 | `TASK-298` re-scoped and retitled to the shape the ruling produces; its false `assumes:` marked measured-false | Low | 15 task rows / 13 `ready` unchanged; blank-line separation checked on every row (L-009) |
| `docs/sprint/SPRINT-096-rule-the-ownership-tension.md` | T1 | T1 `Layers:` widened for the ADR, after the `scope-change` was logged | Low | 17 DoD before and after; `check-layers-completeness.sh` 6 PASS / 0 FAIL |
| `docs/sprint/logs/SPRINT-096-rule-the-ownership-tension.md` | T1 | Execution Log created at the first entry; carries the `scope-change` and the G2 record | Low | n/a — append-only record |

## Retro

<!-- Written at close. Route the buckets to their durable homes (STANDARD §10). -->
