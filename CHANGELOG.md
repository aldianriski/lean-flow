---
owner: Maintainer
last_updated: 2026-08-23
update_trigger: Sprint completed and changes reflected in docs
status: current
---

# lean-flow — Changelog

<!-- Prepend new sprints — newest first. Append-only; never edit past blocks. -->

---

## v1.52.0 — The Checks a Stranger Cannot See (2026-08-23)

MINOR — SPRINT-078, **15 of 15 DoD**, EPIC-004's seventh member. Coverage **19 → 30 of 62** checkable
rules, the largest single move the epic has made — and most of it was *reach*, not new assertion code.

### Five rules that worked and nobody could see

`scripts/lib/check-attestation.sh` is **deleted**. Its five §13 assertions have been correct and
fixture-guarded since SPRINT-074, and no adopter had ever seen one: the checker was wired into
`scripts/qa-check.sh` and nowhere else, while `conformance.sh` — the one entry point a stranger knows
about — execs the engine alone. Five working rules behind a door only this repository has are, from
outside, indistinguishable from five rules nobody wrote.

Migrated on the `gates_signed` precedent: bodies verbatim, finding text **byte-identical** (established
by diffing both tools' §13 lines *before* the old file was removed), the retained fixtures repointed at
the engine with an awk-derived §13-only spec. Verified on a repository that never installed lean-flow —
all five rules named, `attestation-trailers-incomplete` fired, the unsigned claim reported at exit 0.

Two things the migration needed that a pure move would have missed. **`hold`, a fourth verdict class:**
the engine's level ladder only demoted on failures, so carrying `attestation-unsigned-claim-only`
across as a plain note would have printed `level: Attested` over an attestation nobody signed — same
finding, same exit code, opposite headline. And **`--rev`**, because §13 is defined over a commit and
the deleted checker took one; without it the migration silently costs an adopter every commit but HEAD.

**It caught its own shipping commit.** T1's commit message ended `Gate: 164 pass, 0 fail.` — which git
parses as a *trailer*, so the commit claimed a §13 attestation with no `Gate-Signed-By:` and no
`Evidence:`. The newly-wired check reported it on the next gate run. Amended rather than fixed forward:
§13 reads HEAD, so a later commit would have gone green while leaving a false attestation in history.

### The tier is declared, not detected

`S2.F-TIER` · `S6.BASE` · `S6.BACKEND` · `S6.MEDIUM` · `S6.MULTISVC` — five rules, **one check, the
tier a parameter**. §6 marks all four tier rules `split — detection judged`, and the engine was already
on record refusing to guess a tier, so a repository now **declares** one.

**New file an adopter may write: `.conformance-tier`** — one token, `base` · `backend` · `medium` ·
`multi-service`, the same shape `.conformance-roles` already uses for §1's role vocabulary. Optional.
Undeclared, **Base is still checked** (§6's trigger for Base is *every dev repo*, which needs no
detection) and the other three report which fact is missing rather than guessing. An unreadable token
is a finding, never a silent fall back to Base.

Four finding strings, because the tiers genuinely differ: `tier-doc-set-incomplete` for Base and
Backend, which have literal-path rows; a named note for Medium, whose rows are all *families* and a
family cannot be missing; `tier-doc-set-underivable` for Multi-service, where §6 names three docs §2
carries no row for — deriving an empty required set there would pass every repository; and
`tier-declaration-unreadable`. Substrate-conditional rows are subtracted from **§6's own clause** and
printed on a `skipped not owed` line, because a skip nobody can see is indistinguishable from a pass.

### The front-door footer

`S2.R-README` fires `readme-ownership-footer-missing`, with the required field labels **parsed from
§3's own `<sub>` example** at runtime. That is what keeps `S3.README`'s scope-out honest — it is scoped
out *because* it restates this rule, so a check inventing its own footer shape would let §3 state one
shape while §2 enforced another. The rule's anti-SSOT half is a judgement about content and is
reported as judged, never faked.

### What an adopter sees

`sh conformance.sh <repo-dir>` now answers **24 rules in-engine** (up from 13) of 62 checkable; with
the four outboard checkers the standard's covered set is **30**. Two counts, never a ratio. `--rev`
accepts a commit-ish for the §13 family. `.conformance-tier` is read if present and never required.
Fourteen retained fixtures were added; every seeded break was guarded and each reddened only the cases
carrying its claim, with one seed **rejected by the guards** for rewriting three lines — a demolition
is not a discrimination.

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

