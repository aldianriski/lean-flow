---
owner: Maintainer
last_updated: 2026-08-23
update_trigger: Never — a rotated archive of a shipped version is frozen
status: current
---

# lean-flow — Changelog v1.51.0 (rotated)

> Rotated out of the root `CHANGELOG.md` at the v1.53.0 close (§11: the root file carries current
> and previous MINOR; older blocks move here, frozen). Original content unchanged.

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

