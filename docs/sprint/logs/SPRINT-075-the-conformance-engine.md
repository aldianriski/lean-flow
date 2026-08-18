---
sprint: 075
slug: the-conformance-engine
owner: Maintainer
last_updated: 2026-08-18
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-075 — Execution Log

> Append-only companion to [`../SPRINT-075-the-conformance-engine.md`](../SPRINT-075-the-conformance-engine.md). Uncapped by design:
> this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.

<!-- Newest entries at the BOTTOM: this reads as a chronology, unlike CHANGELOG.md which is
     newest-first. Event is one of: promote · progress · surprise · scope-change · park · blocker ·
     run-complete · close. `run-complete` is reserved for the run itself finishing (carries the
     Part 4 rollup) — a task finishing mid-run is logged as `progress`, never as `complete`. -->

### 2026-08-18 | promote | Batch G1 + G2 signed; all five assumptions confirmed mechanically

Gates signed at `203d202` and recorded in the Plan's frontmatter (`gates_signed: G1,G2 @ 203d202`),
where an unattended run can actually read them — L-099's whole point. Verified by
`check-gates-signed.sh` itself rather than by eye.

Every assumption was **re-derived before the gate, not asserted**, per A1's own instruction not to
copy its figure forward (L-130 · L-136):

- **A1 — 43 `build` rules.** 40 table rows, **43 unique rule ids**; several rows carry more than one
  id, which is why a row count and a rule count differ here. The epic's `42` is stale exactly as A1
  predicted. First count attempt returned 45 by matching rule-id rows in *any* table — discarded, not
  acted on (L-108).
- **A2 — the §13 parse generalises. Confirmed, and stronger than assumed.** All 13 sections share one
  `| Rule | Level | Mark |` shape, and per-section row counts reconcile against §14's own published
  counts row **exactly**: `4·21·3·7·2·4·9·0·10·10·11·12·7 = 100`.
- **A3 — 23 fixture harnesses**; T6's five finding names each published once in the register.
- **A4 — governance**: 5 `SPRINT-075 promote` rows in `TECH-DEBT.md`, 2 `gov(75)` commits.
- **A5 — skill freshness**: base-dir 1.45.0 vs repo 1.48.0 reads three versions stale, but all 14
  skills are **byte-identical** to the repo source (line endings only). The last commit touching
  `skills/` shipped *in* v1.45.0; the 1.46/47/48 bumps were spec and scripts. **The gap is inert**,
  which is a fact about this release sequence and must be re-derived next sprint, not inherited.

Rulings taken at the gate: size **accepted as ruled at promote** (no split, no `scope-change` —
the Plan's own reasoning is that the threads only complete together) · wave 3 runs **all-sequential**,
T5 not worktree-parallelised, since one small docs task does not repay a merge-back queue ·
execution dispatches per the ADR-010 tier map.

### 2026-08-18 | progress | T1 — the rule-source reader, extracted and generalised to all 13 sections

`scripts/lib/read-spec-rules.sh` now returns `(id, level, mark)` for any `## §N` Conformance table.
`check-attestation.sh` consumes it instead of carrying its own copy of the parse; its 16 assertions
are green with the harness **unmodified**, which is what makes this a refactor rather than a rewrite.

Two things the task had to get right that were not visible from the Plan:

- **The row anchor had to widen.** The shipped §13 pattern matched `[A-Z]+` after the dot. Generalised
  unchanged it would have **silently dropped 26 rules** — all 4 of §1, all 21 of §2, and 1 of §9's
  neighbours in §7 — because their ids carry digits or hyphens (`S1.LAW2`, `S2.F-CAP`). Widened to
  `[A-Z0-9-]+`, and §13's 7 rows verified byte-identical before and after.
- **Zero rows is ambiguous, and §14 is what disambiguates it.** §8 is a projection with **no rules**,
  and §14 records that as 0. A bare "no rows → `spec-table-unreadable`" rule therefore reports a named
  finding against a perfectly good spec, on a section the engine visits in every full sweep. The
  reader now reads §14's counts row in **every** mode and uses it to separate *this section has none*
  from *this section was dropped*. Found by writing the fixture, not by reading the code.

### 2026-08-18 | surprise | the discrimination pass found a real hole in T1's own fixtures

The fixtures were green on first run. Seeding deliberate breaks (L-137) showed that green meant
agreement, not coverage:

- **Break A** — make the unreadable-table path exit 0, i.e. reintroduce the exact L-058 false negative
  the reader exists to prevent. Three must-FAIL cases reddened. Correct.
- **Break B** — loosen the row anchor from a table-row position to a substring match (L-108's failure).
  **Every fixture stayed green** while the reader emitted 104 rows instead of 100.

Two defects behind that, both now fixed and both the same mistake one level apart:

1. `--reconcile` computed its total as the **sum of per-section buckets**. A row whose id belongs to no
   section buckets nowhere, so four spurious rows were invisible to every line of the report *and* to
   their total. It now counts rows actually emitted and reports `unbucketed-rows` when the two differ.
2. The strengthened fixture first counted rows with `grep -c '^S[0-9]'` — which **misses exactly the
   rows it was added to catch**, because a loosened anchor matches prose lines that never start with
   `|`, so the extracted "id" is raw prose and has no id shape at all. Counting *lines emitted* is the
   assertion that bites.

The harness's own sanity guard had the same bug independently: it checked the §13-stripped fixture
with `grep -q 'S13.TRAILERS'`, which survives stripping because **§14's prose names that very id as
its worked example** of how to read a rule id. Re-anchored to a row count. That is L-108 landing
inside the fixture written to test for L-108, in a corpus that documents its own formats — three
sightings in one task, and none of them were caught by recalling the rule. Each was caught by a
second number disagreeing with the first.

Both breaks now redden the right cases with the right reasons; re-verified after each fix.

### 2026-08-18 | progress | T1 — `Layers:` corrected to declare `scripts/qa-check.sh` (L-100)

The layers-completeness leg of `qa-check.sh` failed T1: the DoD evidence names `qa-check.sh`, which
T1's promote-time `Layers:` did not declare. It is a genuine touch, not a citation — registering
`run-spec-reader-fixtures.sh` in the always-on set is what stops the gate's own completeness leg
rejecting the harness as ungated (L-020). Declared and continued, which is L-100's prescription
rather than a defence of the frozen prediction.

**Worth flagging against D3:** the ownership map assigned `scripts/qa-check.sh` to **T2, landing
first**, with T4 and T6 appending. T1 now touches it *before* T2. The map's purpose is intact — the
wave plan is sequential, so there is no concurrent WIP to contaminate and no per-hunk staging problem
— but D3's stated commit order is now T1 → T2 → T4 → T6 on that file rather than T2 first. Recorded
here rather than silently re-ordered, since the next task to touch it should read the real order.

**Method note, not a defect:** the gate was first read as green. It was still writing when sampled,
and the background wrapper's completion notification reported **exit 0 while the gate itself printed
`QA EXIT=1`** — the wrapper's status, not the gate's. Caught by reading what the command was meant to
produce rather than the channel reporting on it (L-045 · L-057 · L-059). The check and the action it
gates stayed two separate calls, which is what left room to notice.
