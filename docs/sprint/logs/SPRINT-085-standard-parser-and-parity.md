---
sprint: 085
slug: standard-parser-and-parity
owner: Maintainer
last_updated: 2026-08-25
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-085 — Execution Log

> Append-only companion to [`../SPRINT-085-standard-parser-and-parity.md`](../SPRINT-085-standard-parser-and-parity.md). Uncapped by design:
> this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.

### 2026-08-25 | progress | Batch G1+G2 signed @ 3a789fa; waves sequenced
G1 took the **fast path for T1–T5 only** — those carry `origin: decomposer` and met the intake grill
this session — and the **full checklist for T6/T7**, which carry `origin: close-retro` and never did.
No `L`. A1–A6 were each confirmed against a source at promote (files on disk, a usage block, a fixture
run), so no unconfirmed `assumes:` blocked G2.

Ownership map: **`packages/standard/src` is a single-owner chain T1→T2→T3→T4, sequential.** T5, T6 and
T7 sole-own their trees. Recorded because the names invite a collision that does not exist:
`docs/research/logs/qa-gate-timing.md` (T5) and `docs/research/qa-gate-timing.md` (T7) are **different
files**. Preflight: cycle PASS · base-ref PASS · waves 0={T1,T5,T6} 1={T2,T3,T7} 2={T4}.

### 2026-08-25 | progress | T1 — the tokenizer reads §13, and the TS rows are byte-identical to Shell's
`packages/standard/src/tokenizer.ts` (four block types — heading · table · fence · paragraph — each with
a source location, zero imports) and `spec-reader.ts` (structural section windowing + rule-row
extraction, importing only the tokenizer and H04's model). **Zero dependencies intact**: `package.json`
still has no `dependencies` key. Full suite **77 pass / 0 fail**; architecture fitness 25 pass.

**Acceptance verified by the coordinator independently**, not read off the agent's report: TS output for
§13 diffed against `sh scripts/lib/read-spec-rules.sh spec/STANDARD.md --section 13` — **7 rows,
identical, `diff` exit 0**, including the two `— implementation-directed` rows whose level column is an
em-dash rather than a level.

**Tier G discrimination: 17 branches, enumerated from the finished code rather than from memory** —
10 in the tokenizer (blank-line skip · fence open · fence close vs unterminated · heading · table start ·
row continuation · paragraph stops at fence/heading/table · delimiter pipe guard) and 7 in the reader.
Each seeded, verified landed by `cmp`, targeted at zero line-count change, reddened its own case while
siblings stayed green, restored under a hash.

**Two findings from that pass, both worth more than the branches they came from.** (a) One seeded break
initially reported **0 fail** — the test file computed `rulesInSection` at `describe`-collection time, so
the thrown error surfaced as bun's *"Unhandled error between tests"* and silently dropped two tests from
the count rather than failing them. A break that does not redden its case has tested nothing and scores
as a pass — L-142's shape, found because the branch inventory forced a per-branch check instead of a
suite-level one. (b) Two branches turned out to be exercised by the **real** Standard, not only by
fixtures: §13 carries a second table (trailer formats) whose backticked cells are id-shaped but are not
rule ids, so the id-exact-match guard is load-bearing on real content.

### 2026-08-25 | progress | T6 — absence stops reading as "nothing to verify" (TD-085)
`check-review-depth.sh` now FAILs named when a task records `governance:high` or `behaviour:material`
and **no** `review ·` line exists for it: `review-depth-governance-absent` and
`review-depth-material-absent`, two retained must-FAIL fixtures, one per branch. Detection is anchored
to the `^Tn · ` rollup-line position (night-run.md Part 4's frozen contract), and both fixtures discuss
the concepts in plain prose deliberately, to prove the anchor is not tripped by discussion (L-108).
Suite **9 of 9 green**, the original 5 unchanged. `qa-check.sh` untouched — the checker's `ok/bad/note`
output contract did not move, so leg 2b needed no rewiring. Discrimination proven by seeding
`^T[0-9]+ ·` → `^X[0-9]+ ·`: exactly cases 8 and 9 reddened, all 7 siblings including the
`low-self-reviewed-passes` control stayed green; restored, `sha256` matched.

**Archive skip — ruled, not left implicit** (the DoD required a ruling either way): **keep the skip, and
forbid recording a review *into* an archived log instead.** `*/archive/*` exclusion is a convention
shared by three checkers, so making archived paths readable would be a cross-checker change outside
T6's `Layers:` and would still leave the other two blind. The cheaper rule is that a review owed on a
task lands on the **live** log before the sprint archives — which is exactly how SPRINT-082's four
review lines became permanently unreadable. Recorded in the checker's own header, not only here.

### 2026-08-25 | surprise | T6's guard does not reach the case that motivated it — accepted, and the reason is a schema gap
Tested directly rather than assumed: SPRINT-084's own log, copied to a live (non-archive) path, still
prints `no review line -- nothing to verify`, **exit 0**. That log is the evidence TD-085 cites.

The cause is structural. The new detector anchors on `^Tn · ` rollup lines — night-run Part 4's
**unattended** contract. SPRINT-084 was an *attended* run, and its entries are
`### DATE | event | Tn — summary` with the classification stated in prose. **Every sprint in this
repository is attended.** So the guard fires on the shape it can prove and misses the shape we actually
produce.

The deeper finding is one layer below T6's brief: **nothing structured records a task's consequence
classification in attended mode.** The `review ·` line is the only structured carrier, and it exists
only once a review has happened — which makes "governance:high work with no review line" genuinely
unobservable to a dependency-free checker. Matching a classification stated in prose was refused
explicitly: that is the substring-heuristic shape that *produced* TD-085's siblings, and it fails green.

**Owner ruling: accept T6 for the branch it proves, record the limitation here rather than in the
checker's claims, and file the schema gap as debt at close.** Ticking T6's DoD on this basis is an
ADR-021 surfaced ruling, not a silent tick — the fixtures, the named findings and the discrimination
proof are all real; the reach is narrower than the motivating case, and saying so is the point.

### 2026-08-25 | blocker | T5 ended having written nothing; restarted with a bounded scope
The T5 agent stopped after ~200k tokens and ~21 minutes, its final message reporting that it was
"watching for the real-repo reconciliation run to finish". The harness reported the task `completed`.
**`docs/research/logs/qa-gate-timing.md` was unchanged** — `git diff --numstat` empty, file still ending
at § Round 4. Nothing was watching anything, and no § Round 5 existed.

Caught by checking the artifact instead of the report — the same L-045/L-120 shape that produced
SPRINT-084's own sighting, here in an agent's self-report rather than a shell wrapper. **A report is
evidence about the reporter.** Restarted with the stall's cause named: no long background runs or
Monitor waits (a full `conformance.sh .` is ~5–6 minutes), bounded foreground steps only, and an
instruction to write up whatever it genuinely measured — including "I measured none" — rather than
produce a complete-looking round with an unstated denominator.

### 2026-08-25 | progress | T5 — § Round 5 lands, and names a dominant family Round 4 never saw
Restarted run delivered: **226 insertions, 0 deletions** to `docs/research/logs/qa-gate-timing.md`
(zero deletions is correct, not suspicious — Round 4 had already moved `last_updated` to today, so
the append touched nothing). All 45 mechanical/split rules profiled, grouped into the engine's own 12
family sections, measured **two ways**: a tiny-input isolation on a 12-item purpose-built fixture repo
with xtrace-counted spawns, and a real-scale run against this repository.

Real-scale dominance: **F11 §11 retention 84.7s · F6 §4 ADR 72.1s · F5 §1 ownership (`S1.LAW2`) 56.0s ·
F9 §10 (`S10.TDAGING`) 37.4s** — four families, **89%** of a 281.2s total. The other eight are named
individually rather than folded into a remainder, summing to 30.9s.

**Reconciliation, which is what makes the numbers usable:** the 12 families sum to 281,166.6ms, matching
the 45-rule dispatch total exactly; full-engine wall clock is 287,406ms — a **6.2s / 2.2% gap**,
attributed to non-dispatched rule notes, the spec read, and this round's own instrumentation.

**Open gap, reported rather than resolved:** `S11.LOGPAIR` + `S11.WHENITRUNS` cost **76.1s** combined,
confirmed by an isolated rerun — and Round 4 never named them, its own arithmetic implying **≤4s** for
its entire unnamed remainder. The engine is byte-identical since Round 4's commit and the archived
corpus barely moved (120→122 files), so the two rounds disagree and neither is obviously wrong. Recorded
in § Caveats as a live discrepancy. That is the honest state: a second measurement disagreeing with the
first is exactly the signal the cross-check rule exists to produce, and papering it over would discard
the finding.

Migration order **not frozen** — the Recommendation names candidates on §43's *expensive today* and
*high spawn count* axes and states outright that the choice is Sprint C's G2 call (V3 §43 · D6).

**Process note:** this is the restarted run. The first ended after ~21 minutes and ~200k tokens having
written **nothing**, while reporting it was watching a background job — see the `blocker` entry above.
The restart's only substantive change was forbidding long background waits and requiring bounded
foreground steps.

### 2026-08-25 | progress | T2 — 100 rows, byte-identical, and the discriminator has a real denominator
`allRules(doc)` walks every `## §N` window in document order, sharing a `rulesInWindow` helper factored
out of T1's `rulesInSection` — a refactor with no behaviour change there, and its 18 existing tests
stayed green throughout. Suite **82 pass / 0 fail** (77 → 82); architecture fitness 25 pass; zero
dependencies intact.

**Verified by the coordinator independently:** TS `allRules` output diffed against
`sh scripts/lib/read-spec-rules.sh spec/STANDARD.md` — **100 rows each, `diff` identical**. And the
discriminator, checked directly against the raw document: `S13.NOINFER` occurs **twice** in
`spec/STANDARD.md` and is admitted **once**.

**The row-by-row requirement was met properly, not nominally.** EPIC-014's § Closed-when says row-by-row
*never in aggregate*, and a count comparison would have satisfied the letter while missing the point. The
test spawns the shell reader as an independent oracle and loops index-by-index, naming the offending row
on failure. Demonstrated rather than asserted: perturbing one mark produced
`row 9 differs (0-indexed, document order) -- TS: "S2.F-ARCHIVE Structural SEEDED-BREAK-DEMO"
shell: "S2.F-ARCHIVE Structural restated"`, with **exactly one** test reddening while the count,
document-order, NOINFER and witness tests stayed green — targeted, not a demolition.

**A negative claim given a positive witness (L-156).** "No prose mention leaked" is worthless without a
denominator, so T2 counted the candidates: **148** backtick-quoted rule-id-shaped tokens exist across the
document; **100** were admitted; **48** prose and duplicate mentions were visibly filtered. The claim now
rests on a non-trivial number rather than on a zero that could equally mean the check reached nothing.

**No TS/Shell difference was found**, and that is recorded here explicitly because EPIC-014 D2 requires a
difference to be *ruled* — the absence of one is itself the record, not a silence.

### 2026-08-25 | progress | T7 — ruled **amended, not superseded**, and the reasoning is the deliverable
`docs/research/qa-gate-timing.md` corrected in place, `status: current` kept. The choice mattered:
ADR-020's `superseded ⇒ FROZEN` convention is for a **spent** verdict whose only future is archival.
This one is not spent — its own `update_trigger` ("a new measurement changes the recommendation") is
precisely what fired, and the question is demonstrably live (TD-090's leg 12 at ~396s is unprofiled, and
Rounds 4 and 5 disagree with nothing resolving them). Freezing it would have stranded an open
investigation; amending keeps one live home for the next round.

**The supersession is scoped, not wholesale** — which was the constraint most likely to be got wrong.
The coverage-reduction ruling **stands** and is stated as standing (*"The proposed lever — coverage
reduction — is the wrong one; that ruling stands"*). What changed is that a lever the doc never
considered turned out to be the answer: Option **E — reduce spawn count, not coverage** is added,
marked found-and-applied at Round 4 and incomplete per Round 5. Option C is annotated *superseded by its
own success*, "not because the caution was wrong".

**The Round 4 / Round 5 disagreement is carried into the doc in three places** rather than smoothed
into a single number: Verdict, Findings and Recommendation, with the instruction *"Treat the
spawn-count cost picture as open"* and an explicit refusal to let it read as closed a second time.
Round 5's ranked candidates and TD-090 are named as the actionable next step **without one being
chosen** — that stays Sprint C's G2 call (V3 §43 · D6).

**Citing set checked before ruling, not after:** every live reference to this doc
(`knowledge-index.md`, L-106, two archived sprints, `spec/STANDARD.md`, this sprint) points at
*structural* facts — its size, its log split, its existence — and **none depends on the Recommendation's
substance**. Nothing is stranded by the amendment. Had any depended on it, `superseded` would have been
the wrong call for a different reason than the one that decided it.

Verified by the coordinator: `check-doc-caps.sh` prints `PASS cap docs/research/qa-gate-timing.md
(130 <= 130)` — exactly at the cap after two trimming passes — and `docs/knowledge-index.md` is
genuinely unchanged (`git diff --quiet`), matching the claim that only `last_updated` moved.

### 2026-08-25 | progress | T3 — absence and emptiness kept apart by TYPE, not by convention
All four retained malformed cases now match the Shell reader on **named finding and exit meaning**:
`spec-table-unreadable` (whole and section) · `spec-not-found` · and §8 exiting **0 silently** because
§14 publishes 0 for it. Suite **86 pass / 0 fail** (82 → 86), architecture fitness 25 pass, zero
dependencies intact. Each fixture's input was reconstructed the way
`evals/run-spec-reader-fixtures.sh` builds it, and the Shell reader was spawned **as an independent
oracle inside the test** rather than its expected output being copied in as a literal.

**The design choice that makes this stick:** `SpecReadResult = SpecReadOk | SpecReadFail`, where
`SpecReadOk.rows` may legitimately be `[]` and `SpecReadFail` **carries no `rows` field at all**. A
caller therefore *cannot* mistake "checked nothing and found a finding" for "checked and found zero" —
the distinction L-058 is about is enforced by the type rather than by everyone remembering it. The §14
zero-exemption is taken only when narrowed to one section, mirroring the shell's own `[ -n "$section" ]`
gate; a whole-document sweep never takes it, since there is no single section to look up.

**Tier G: two isolated seeds, one per failure branch.** `readSection`'s failure branch forced to
`ok:true, rows:[]` reddened `spec-table-unreadable-section` alone; `readAll`'s forced the same way
reddened `spec-table-unreadable-whole` alone. Both were 1-line targeted diffs (283 vs 282), both left
every sibling green (21 pass / 1 fail each time), both restored and re-verified `cmp`-identical under a
matching hash. The seeded failure was chosen to be *the exact false negative* — empty-and-clean — rather
than an arbitrary break.

**Three TS/Shell differences were reported rather than absorbed (EPIC-014 D2), and are ruled here:**

1. **Exit representation** — TS returns `ok: boolean`; Shell exits 0/1. **Not a difference.** ADR-034 D3
   freezes *exit meaning*, and `ok:false` is that meaning faithfully carried; the domain layer has no
   process boundary, and the CLI that owns exit codes is H11, in Sprint C. **Carry-forward:** Sprint C
   must map `ok:false → exit 1` explicitly, or the meaning is lost at the boundary.
2. **`FAIL  ` line prefix omitted** — **Not a difference.** ADR-034 D3 states in as many words that
   whitespace, wrap and non-semantic log order are *not* frozen. The prefix is the Shell driver's own
   log convention, not a semantic of the reader.
3. **`spec-not-found` trigger breadth** — the test helper catches any read failure (so it would also
   catch permission-denied), where Shell's guard is existence only. **Not a shipped difference:**
   `specNotFound()` in production is a *pure constructor with no filesystem access*, so the domain never
   decides when to emit it. The breadth lives only in the test stand-in. **But it names a real decision
   Sprint C owes:** a permission-denied spec must not report `spec-not-found`, because a wrongly-*named*
   finding is precisely the failure mode this repo treats as most expensive. Recorded for H11.
