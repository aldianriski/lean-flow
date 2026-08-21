---
owner: Maintainer
last_updated: 2026-08-21
update_trigger: Sprint completed and changes reflected in docs
status: current
---

# lean-flow — Changelog

<!-- Prepend new sprints — newest first. Append-only; never edit past blocks. -->

---

## v1.51.0 — The Decisions EPIC-004 Is Waiting On (2026-08-21)

MINOR — SPRINT-077, **9 of 9 DoD**, EPIC-004's sixth member and deliberately its smallest. The epic
had two conditions open and they were not the same kind of open: one needs ~32 rules built, the other
needed **two rulings and one spec change**. This sprint takes the second, because a condition a
decision away should not wait behind a condition a quarter away. **EPIC-004 now stands at 4 of 5.**

### The engine stops telling strangers they owe lean-flow's files

`spec/STANDARD.md` **0.4.2 → 0.5.0.** §2's unconditional set mixed two populations, and against a
four-file JS library that never installed lean-flow it produced **8 `core-file-missing` findings, 4 of
them artefacts** — `AGENTS.md`, `TODO.md`, `.claude/CLAUDE.md`, `.claude/CONTEXT.md`, all of them the
lean loop's own surface rather than repository structure. Those four rows now **name their substrate**
(*an AI assistant reads this repo* · *work is tracked in-repo*) instead of saying `always`, exactly as
§6 already gates its substrate-conditional rows: skipped, not owed, when the substrate is absent.

**No code changed.** The engine's discriminator for "unconditional" already *was* the word `always` in
the `Create ←` cell, so the required set fell from 9 to 5 by re-wording a table — the distinction is
derived from the spec, no tool holds a list of loop files, and flipping a row in a spec copy changes
behaviour with no code edit. Re-derived at execution rather than trusted: `core-file-missing` **8 → 4**,
artefacts **4 → 0**, whole report 10 → 6 lines.

**What an adopter sees.** Up to four findings disappear from your report and your conformance level can
move **without your tree changing**. That is why this is MINOR and not PATCH: 0.4.2 was PATCH on the
explicit test *nothing an adopter satisfies today changes*, and four lifted obligations fail that test
even though the change is in your favour. A tool pinned to 0.4.x will disagree with one pinned to 0.5.0
about the same repository. Caps are unaffected — those are read from the `Cap` cell — and the rows stay
owed by any repo that does run the loop, via §6's tier gate.

### EPIC-004 § Closed-when 3 ticks, on two recorded rulings

**(a)** The engine's three invocation-error identities (`usage` · `repo directory not found` ·
`reader-missing`) are **out of scope** — they fire before any repository is evaluated, carry no §14
rule id, and no adopter can clear one by changing their tree. Finding identities therefore read
**16 of 16**: the denominator was wrong, not the numerator short.
**(b)** The condition **adopts the wider property** — *a retained case asserts the named finding on
input that must produce it* — because `S9.GATESABSENT` reports *NOT SIGNED* as a note and never FAILs
by design, making the old "must-FAIL" wording unsatisfiable for it: a defect in the sentence, not a gap
in the corpus. **The prior wording is preserved verbatim in the epic**, so an amendment made while
holding an audit that wanted the tick is auditable rather than invisible (L-088). Ruled Retro, not ADR.

### Two retained fixtures reddened, and one had already gone quiet

Both were re-triaged rather than widened. `run-foreign-repo-fixtures.sh` returns to asserting an
**empty** remainder — the stronger form, which cannot absorb a new artefact one row at a time.
`run-s2-placement-fixtures.sh` exposed something nobody planned: its must-FAIL seed hard-coded
`TODO.md`, so once that row was reclassified the builder stopped creating it, `rm -f` removed nothing,
and the existence guard passed **because the file had never existed**. A case that tested nothing would
have scored as a pass. Its victim is now derived from §2's own unconditional set and the seed asserts
the target existed *before* removal. → **L-146**, the decay-time counterpart to L-142.

### Also

- **TD-070** — §2's file tables have **three** independent parsers, each hard-coding the same column
  offset. The obvious implementation of this sprint's change would have shifted them all, and
  `check-doc-caps.sh` would have dropped every root and `.claude/` cap **while reporting PASS**.
- **TD-069 updated** — `EPIC-004-conformance.md` 201 → 212 against its 200 soft cap.
- **TASK-245** filed — decompose the epic's ~32 remaining coverage rules, its last open condition.
- Gate green at **154 pass, 0 fail**.

---

## v1.50.0 — Coverage, and Whether the Bar Is Right (2026-08-21)

MINOR — SPRINT-076, **20 of 20 DoD**, EPIC-004's fifth member sprint. v1.49.0 built the engine and
learned from a stranger that the report was measuring the wrong thing. This sprint doubles what the
engine can answer, writes down two rules it was already enforcing, and then **rules on whether the
epic's own bar still stands** — with numbers rather than convenience.

**What changed for you**

- **Engine coverage 6 → 13 of 62 checkable rules.** Two families land, each with retained fixtures and
  a seeded-break pass proving the suite discriminates:
  - **§4, the ADR family** — `S4.ONEFILE` · `S4.APPEND` · `S4.INDEX` · `S4.SECTIONS` · `S4.NEGATIVE`,
    firing `adr-path-noncanonical` · `adr-edited-after-decision` · `decisions-index-missing-adr` ·
    `adr-required-section-missing` · `adr-no-negative-consequence`. `S4.APPEND` is the engine's first
    rule to read **git history** rather than the tree: it compares the § Decision body at the deciding
    commit against HEAD, so marking an ADR `deprecated`/`superseded`/`amended by` passes while
    rewriting the decision fails. Where history cannot answer it says so — *unavailable* (no
    repository) and *truncated* (shallow clone) are reported as distinct states, never guessed.
  - **§2's placement pair** — `S2.F-FILE` · `S2.R-PLACEMENT`, firing `core-file-missing` and
    `file-outside-canonical-placement`. The required set is derived from §2's own `Create ←` cells at
    runtime, so a spec edit changes behaviour with no code change.
- **`spec/STANDARD.md` 0.4.1 → 0.4.2 (PATCH)** — §3 now states two exceptions it was already being
  checked against, which is the wrong way round for a rule nobody could read:
  - **ADRs** carry §4's ADR-009 knowledge metadata instead of §3's four-field header.
  - **A tree you declare exploratory** (`governed: false` in its own index/README frontmatter) is input
    to decisions, not governed documentation. **A declaration, not a path** — fixing a directory name
    would have exempted only repositories that use ours. Opt-in, so silence still means governed.
  No rule was added and §3 still publishes three, so nothing you satisfy today changes.
- **A latent bug fixed that affected a fifth of the rule set.** The engine resolved an assertion by
  mapping `.` → `_` in a rule id but leaving hyphens, so `S2.F-FILE` looked for `assert_S2_F-FILE` and
  reported `rule-unimplemented` **with the assertion present in the file**. **21 of the spec's 100 rule
  ids carry a hyphen**; every rule covered before now happened not to. Verified collision-free before
  changing.
- **The engine is faster where it was pathologically slow.** A placement scan that walked the tree once
  per spec row took **29s on a four-file directory**; rewritten as one pass it is **9.6s**, and ~49s
  against this repository. If you run `conformance.sh` over fixtures or small trees, this is the
  difference between usable and not.
- **A conformance report now tells you when its own advice does not apply to you.** Running the engine
  against a repository that never installed lean-flow, **4 of 8 new findings were artefacts** of our
  shape rather than defects in theirs — `AGENTS.md` · `TODO.md` · `.claude/CLAUDE.md` ·
  `.claude/CONTEXT.md` are lean-flow's own loop surface, not general repository structure. **The engine
  was not quietened**: the finding is recorded in `docs/research/conformance-dispositions.md`
  § Artefacts, a fixture asserts that exact set so it cannot silently grow, and the real fix — §2
  marking loop rows apart from universal ones — is filed as TASK-243.

**What it did not do**

Two of EPIC-004's five exit conditions moved and **neither ticked**, which is the honest state:

- **§ Closed-when 2 — ruled, and the bar STANDS.** 19 of 62 checkable rules map to a check; 32 are
  dispositioned `build` and 11 `scope-out`, and a disposition is a decision to build, not a check. Two
  ways to make it tick today were available — count dispositions, or adopt the roadmap's looser Phase A
  exit — and both were refused: amending an exit condition to fit what got built is the failure this
  epic exists to avoid. Standing costs roughly **four to five more coverage sprints**, stated so the
  choice is not free. No ADR, because nothing was amended.
- **§ Closed-when 3 — established, not ticked.** Open since the epic opened and only ever measured
  around, it now has an answer as a list: **24 of 24 checks guarded, 16 of 19 finding identities**
  (`docs/research/fixture-coverage-audit.md`). The one repository-facing gap was closed here; three
  invocation-error identities remain, and one rule (`S9.GATESABSENT`) *cannot* satisfy the condition's
  wording because it reports without ever failing. Both residuals are rulings, not measurements →
  TASK-244.
---

---

_Older releases (**v1.49.0** and earlier) → [`CHANGELOG-1.49.0.md`](docs/changelog/CHANGELOG-1.49.0.md) → [`CHANGELOG-1.48.0.md`](docs/changelog/CHANGELOG-1.48.0.md) → [`CHANGELOG-1.46.0.md`](docs/changelog/CHANGELOG-1.46.0.md) → [`CHANGELOG-1.45.0.md`](docs/changelog/CHANGELOG-1.45.0.md) → [`CHANGELOG-1.44.0.md`](docs/changelog/CHANGELOG-1.44.0.md) → [`CHANGELOG-1.43.0.md`](docs/changelog/CHANGELOG-1.43.0.md) → [`CHANGELOG-1.42.0.md`](docs/changelog/CHANGELOG-1.42.0.md) → [`CHANGELOG-1.41.0.md`](docs/changelog/CHANGELOG-1.41.0.md) → [`CHANGELOG-1.40.0.md`](docs/changelog/CHANGELOG-1.40.0.md) → [`CHANGELOG-1.39.0.md`](docs/changelog/CHANGELOG-1.39.0.md) → [`CHANGELOG-1.38.0.md`](docs/changelog/CHANGELOG-1.38.0.md) → [`CHANGELOG-1.37.0.md`](docs/changelog/CHANGELOG-1.37.0.md) → [`CHANGELOG-1.36.0.md`](docs/changelog/CHANGELOG-1.36.0.md) → [`CHANGELOG-1.35.0.md`](docs/changelog/CHANGELOG-1.35.0.md) → [`CHANGELOG-1.34.0.md`](docs/changelog/CHANGELOG-1.34.0.md) → [`CHANGELOG-1.33.0.md`](docs/changelog/CHANGELOG-1.33.0.md) → [`CHANGELOG-1.32.0.md`](docs/changelog/CHANGELOG-1.32.0.md) → [`CHANGELOG-1.31.0.md`](docs/changelog/CHANGELOG-1.31.0.md) → [`CHANGELOG-1.30.0.md`](docs/changelog/CHANGELOG-1.30.0.md) → [`CHANGELOG-1.29.0.md`](docs/changelog/CHANGELOG-1.29.0.md) → [`CHANGELOG-1.27.3.md`](docs/changelog/CHANGELOG-1.27.3.md) → [`CHANGELOG-1.26.0.md`](docs/changelog/CHANGELOG-1.26.0.md) → [`CHANGELOG-1.25.2.md`](docs/changelog/CHANGELOG-1.25.2.md) → [`CHANGELOG-1.24.0.md`](docs/changelog/CHANGELOG-1.24.0.md) → [`CHANGELOG-1.23.0.md`](docs/changelog/CHANGELOG-1.23.0.md) → [`CHANGELOG-1.22.0.md`](docs/changelog/CHANGELOG-1.22.0.md) → [`CHANGELOG-1.21.0.md`](docs/changelog/CHANGELOG-1.21.0.md) → [`CHANGELOG-1.20.0.md`](docs/changelog/CHANGELOG-1.20.0.md) → [`CHANGELOG-1.19.0.md`](docs/changelog/CHANGELOG-1.19.0.md) → [`CHANGELOG-1.16.1.md`](docs/changelog/CHANGELOG-1.16.1.md) → [`CHANGELOG-1.14.2.md`](docs/changelog/CHANGELOG-1.14.2.md) → [`CHANGELOG-1.13.0.md`](docs/changelog/CHANGELOG-1.13.0.md) → [`CHANGELOG-1.12.0.md`](docs/changelog/CHANGELOG-1.12.0.md) → [`CHANGELOG-1.9.0.md`](docs/changelog/CHANGELOG-1.9.0.md) → [`CHANGELOG-1.7.1.md`](docs/changelog/CHANGELOG-1.7.1.md)._
