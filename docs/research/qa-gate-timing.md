---
owner: Maintainer
last_updated: 2026-08-25
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
> **Verdict.** The proposed lever — coverage reduction — is the wrong one; that ruling stands across
> three rounds and is not reversed here. The harnesses are ~34%; section 4 (ADR-009 knowledge metadata)
> is ~51% on its own and decomposes into three comparable thirds with no cost centre on *what* is
> checked. Its largest slice is index freshness — the one component nothing is allowed to cheapen.
> **Amended 2026-08-25.** Rounds 1–3 never tested a second, orthogonal axis — *how many processes* the
> same check spawns to do the same work. Round 4 found that axis and applied it (SPRINT-084 T1: section
> 4, 271.5s → 23.6s, zero coverage removed); Round 5 finds more of that cost unattributed than Round 4
> believed, disagreeing 19× on two rules with no resolution yet. See § Recommendation for what changed.

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
  produces the number every other option needs. **Chosen, three times — superseded at round 4** when
  its own measurement doubled as the fix (option E), not because the caution was wrong.
- **D — Structural change to section 4** (cache the index digest between runs, or accept
  cost-proportional-to-corpus). *Trade-off:* the only remaining honest option on the coverage axis, and
  not yet needed — raised by round 3, unowned.
- **E — Reduce spawn count, not coverage** (same check, fewer processes for the same work). *Trade-off:*
  an axis rounds 1–3 never tested, so none of their caveats about coverage reduction apply to it.
  **Found and applied at round 4** (SPRINT-084 T1): section 4 271.5s → 23.6s, the conformance-engine
  informational sweep 176.6s → 1.9–5s. **Round 5 shows the picture is incomplete**: two rules Round 4
  had only estimated cost 76.1s combined when individually measured — 19× Round 4's implied ceiling for
  its own unnamed remainder. Not fully attributed yet.

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
- **This series is L-107 three times over** — harness list, then "inline half" as an unmeasured blob,
  then (round 4's own admission) an arithmetic remainder standing for ~35 unmeasured rules — each time
  the remainder is where the cost lived. *Round 2; round 5.*
- **Round 4 found the untested axis (spawn count, not coverage) and applied it**: section 4 271.5s →
  23.6s, §10's coverage fixtures untouched, same defects still caught (SPRINT-084 T1). **Round 5**
  individually measured two rules round 4 had only estimated (`S11.LOGPAIR`+`S11.WHENITRUNS`) at
  **76.1s combined — 19× round 4's implied ≤4s ceiling** for its unnamed remainder, on identical code.
  Neither round resolves the gap. *Rounds 4–5, detailed in § Recommendation.*

## Recommendation

**Amended 2026-08-25 — scoped, not reversed.** Rounds 1–3's ruling stands exactly as measured: on the
*coverage-reduction* axis, TD-046's lever is retired, the harnesses are cleared, and section 4 has no
sub-part worth cutting by narrowing *what* is checked — the biggest slice is still protected by ADR-009.
None of that is walked back here.

What rounds 1–3 never tested is the orthogonal *spawn-count* axis — how many processes the same check
spawns to do the same work. Round 4 (SPRINT-084 T1) found it and applied it: section 4 fell 271.5s →
23.6s and the conformance-engine informational sweep fell 176.6s → 1.9–5s, with zero coverage removed.
**Option C ("measure first, move nothing") is superseded by its own fourth round — something was
finally measured precisely enough to move, on an axis option D never named either.** Option E (spawn-
count reduction) is the option that produced a real, applied fix; add it to the table above rather than
retrofitting option D, which was scoped to *structural* coverage-preserving change, not this.

**Round 5 reopens the cost picture rather than closing it.** Chasing the ~4s round 4 left unattributed,
round 5 measured `S11.LOGPAIR`+`S11.WHENITRUNS` individually at 76.1s combined — 19× round 4's implied
ceiling, on code and corpus round 4 already covered. Round 5 could not explain the gap beyond inference
and did not re-run round 4's exact method to settle it. **Treat the spawn-count cost picture as open,
not closed a second time** — declaring an unmeasured remainder small before measuring it individually
is the mistake rounds 2 and 4 each name against their own prior round.

**Actionable, not yet acted on:** TD-090 (leg 12, eval harnesses, ~396s, ~81% of the post-fix gate) is
the named next target — never profiled by any round here. Round 5 also surfaces `S11.LOGPAIR`/
`WHENITRUNS` (76.1s), the §4 ADR family (72.1s) and `S1.LAW2` (54.8s) as candidates, without choosing —
that choice is Sprint C's own G2 call (V3 §43), not this doc's.

**Not ADR-grade** — nothing is reversed and nothing hard-to-reverse is decided. Each round replaced a
hypothesis with a number; round 4 is the first round whose number was also a fix.

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
