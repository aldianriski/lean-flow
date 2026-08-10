---
owner: Maintainer
last_updated: 2026-08-10
update_trigger: Question revisited, or a new measurement changes the recommendation
status: current
id: qa-gate-timing
tags: [tooling]
domain: governance
related: [behavioral-eval-feasibility]
<!-- The measurement series lives at logs/qa-gate-timing.md and is deliberately NOT a `related:` id:
     gen-index.sh globs docs/research/*.md non-recursively, so the log is outside the knowledge
     corpus (as sprint logs are), and naming it here would dangle §4b's corpus-ref check. The Plan →
     log coupling is a body link, same as docs/sprint/. -->

---

# Research — where does the QA gate's runtime actually go, and is there a lever worth pulling?

> **Question.** TD-046 records the always-on gate at ~126s and proposes moving more eval harnesses
> behind `QA_FULL=1`, on the suspicion that "several harnesses re-run their checker over the entire
> live repo purely to guard a glob". Which harnesses, and how much of the runtime is actually theirs?
> **Verdict.** The proposed lever is the wrong one, and after three rounds of measurement **no cheap
> lever exists**. The harnesses are ~34%; section 4 (ADR-009 knowledge metadata) is ~51% on its own and
> decomposes into three comparable thirds with no cost centre. Its largest slice is index freshness —
> the one component nothing is allowed to cheapen. Nothing has been moved or edited across any round.

## Why this matters

Every argument about the gate being too slow has been made against a single number taken once, at one
close. TD-046's own mitigation line flags itself as underived (L-091). Acting on it would mean a
coverage reduction carrying L-076's proof obligation, aimed at a target nobody had measured — and
L-097 exists because this repo has already held decisions on figures that were never re-taken.

## Options considered

- **A — Move harnesses behind `QA_FULL=1`** (TD-046's proposal). *Trade-off:* the obvious lever, but
  it is a coverage reduction and its size was never measured. **Retired at round 1.**
- **B — Cheapen the harnesses that rescan the live repo.** *Trade-off:* targets the specific suspicion
  rather than the category — but only if those harnesses are in fact expensive. **Retired at round 1:**
  two of fourteen, ~10s together, and both are zero-coverage guards that must keep their live input.
- **C — Measure first, move nothing.** *Trade-off:* costs sprint tasks and delivers no speedup;
  produces the number every other option needs. **Chosen, three times.**
- **D — Structural change to section 4** (cache the index digest between runs, or accept
  cost-proportional-to-corpus). *Trade-off:* the only remaining honest option, and not yet needed —
  raised by round 3, unowned.

## Findings

The measurement series lives in [`logs/qa-gate-timing.md`](logs/qa-gate-timing.md) — three rounds,
append-only, each with its own method, tables, findings and recommendation. Standing conclusions:

- **The harness category is ~34% and has now been cleared twice.** The "several harnesses rescan the
  live repo" suspicion is false as stated: two of fourteen, ~10s combined, both deliberate
  zero-coverage guards whose live input is the point. *Round 1.*
- **Section 4 alone is ~45–51% of the gate** — larger than all fifteen eval harnesses together, and
  the most stable thing in the run while the harnesses swing 16% sample-to-sample. *Round 2.*
- **Section 4 has no cost centre — three comparable thirds** (freshness ~36%, 4a ~30%, 4b ~30%,
  setup ~2%). Removing the largest slice entirely buys ~19% of the gate, and that slice is index
  freshness, which ADR-009 wired as a whole-corpus read. The cheapest target and the most protected
  one are the same object. *Round 3.*
- **The gate is scaling with the corpus, not the check count** — 130s → 154–169s while going 131 → 136
  checks, and section 4's share rose 45–49% → 51.5% on a corpus five entries larger. *Rounds 2–3.*
- **This series is L-107 twice over.** Each round blamed whichever component was enumerable enough to
  phrase a hypothesis about — first the harness list, then "the inline half" as an unmeasured blob —
  and each time the remainder was where the cost lived. *Round 2.*

## Recommendation

**Option C stands; nothing is moved.** TD-046's lever is retired and so is its successor: there is no
sub-part of section 4 worth cutting, and the biggest one is protected by ADR-009. If the gate's runtime
ever becomes a real problem, the honest routes are structural (option D), not a narrowing of what is
checked. TD-050 stays open on its behavioural concern; what closed is the expectation that splitting it
further would reveal a target.

**Not ADR-grade** — nothing is reversed and nothing hard-to-reverse is decided. Each round replaced a
hypothesis with a number.

## Out of scope / open questions

- **A cure for section 4 needs its own re-derivation first** (L-091). Option D is named, not designed,
  and nobody owns it.
- **Round 1's inline figure was a subtraction, not a measurement** — closed by round 2, recorded in the
  log so the superseded figure stays visible rather than being edited away.
- **This doc's own shape was the finding that split it.** At 223 lines against a 120 soft cap it could
  not be trimmed without deleting measurements, which is L-106's tell that the number was wrong rather
  than the file. Ruled at SPRINT-062 T1 by splitting per §6 on ADR-014's precedent: the decision is
  capped, the series is append-only and uncapped.
- **The other two §2 breaches are out of scope here — but not for the reason TASK-192 gives.** The
  task's `assumes:` calls `graph-engineering.md` (122) and `loop-hygiene-prd.md` (139) "ordinary
  drift". L-106's own body records the opposite for the first: 122 against `120 soft` "with no movable
  section and no whitespace slack, where the only route to 120 was re-wrapping prose", and notes that
  **both had been carried as 'drift' for sprints** — the mislabelling is the thing L-106 was written to
  correct. So they are excluded from T1 by *scope*, not because their diagnosis is settled; whoever
  takes them next should re-sort them against the §2 Growth rule's two kinds rather than inherit
  "drift" from the task text. Surfaced at SPRINT-062 T1 as a retrieval miss (§10).
