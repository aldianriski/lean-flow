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

### 2026-08-18 | progress | pre-dispatch preflight HALTED; T4→T6 order declared to clear it

Running the preflight before dispatching T2 (declared base `15cb059`, matching live HEAD) returned
**HALT** with two named findings, both genuine gaps rather than noise:

```
FAIL shared-file-unowned: evals/ ~ evals/run-gates-signed-fixtures.sh in T3 and T4 -- no Depends-on edge
FAIL shared-file-unowned: evals/run-gates-signed-fixtures.sh ~ evals/ in T4 and T6 -- no Depends-on edge
```

**D3 ordered the shared files against T2 and never ordered T4 against T6.** Both touch `evals/` and
the engine; T3 declares `evals/` too. D4 supplied the T6 → T3 edge, so that pair passed — the missing
one was T4 ↔ T6, which then also left T3 ↔ T4 unreachable.

Declared `T6 Depends-on: T2, T4`. **T4 before T6** because T4 migrates an *existing* family with
published findings and retained fixtures, proving the engine against a known-good answer before T6
adds coverage that has never had a checker; and because D3 already ordered the shared files as
"T2 owns and lands first, T4 and T6 append", which reads as T4 then T6. Chain is now
T2 → T4 → T6 → T3, which is also the sequential order the signed G2 chose.

**Not logged as a `scope-change`:** nothing in scope moved. This records an execution order that D3
and the G2 sequential ruling already implied but never wrote down in the markup the preflight reads —
the same class of correction as T1's `Layers:` (L-100), one field over. The preflight is what turned
an implicit order into a declared one, which is the check doing exactly its job.

Re-run: **PREFLIGHT: CLEAR**, waves `T1=0 T2=1 T4=2 T5=2 T6=3 T3=4`.

### 2026-08-18 | progress | T2 — the engine core: registry, mark-driven dispatch, and the report

`conformance.sh` + `scripts/lib/conformance-engine.sh` read every section's rules through T1's reader
and dispatch each by its **mark**. 6 of 6 DoD. Built by a dispatched execution-tier agent per the
ADR-010 tier map; the coordinator verified, repaired one fixture, and committed.

Against this repo the report reconciles exactly against the spec, checked from both ends:
**62 `rule-unimplemented` + 32 judgment-required + 6 excluded = 100**, where the spec independently
gives mechanical 49 + split 13 = 62 needing assertions, judgment-only 32, implementation-directed 6.
`level: none — Structural not yet reached. 43 finding(s) at Structural prevent it`, and 43 re-derives
from the spec as Structural × (`mechanical`|`split`). That 43 is **not** the 43 `build` dispositions —
a different set of the same size, checked rather than assumed, because two equal numbers in one sprint
is how a wrong one gets adopted.

### 2026-08-18 | surprise | T2's fixtures had a case that could pass or vanish, but never fail

The suite was 13-green on arrival. Seeding breaks (L-137) split them apart:

- **Break B** — silence `rule-unimplemented` (`bad` → `note`), the L-058 false negative. **5 cases
  reddened.** Strong.
- **Break A** — remove the `judgment-only)` arm so those rules fall through to evaluation. Twelve
  cases reported; the thirteenth — `judgment-and-impl-directed-never-verdicts`, the case that exists
  precisely to catch this — **printed nothing at all**.

Its success path was a bare chain:

```sh
grep -qE '...judgment-required' && grep -qE '...excluded by mark' && echo "PASS ..."
```

When a grep fails the chain short-circuits: no output, and `fail` never set. So the case could print
PASS or print *nothing*, and had no path to FAIL. Under Break A the rules landed in the unclassified
arm, neither grep matched, and the case evaporated — **silently, in the one scenario it guards**.
Rewritten as an explicit `elif`/`else` that prints the finding and sets `fail=1`; re-seeding Break A
now reddens it correctly.

This is the same failure the repo already names in another register (L-103): a check whose negative
result is indistinguishable from not having run. Worth noting *where* it hid — not in the engine, but
in the fixture, and only in the branch a passing run never takes. **A green suite is evidence about
the cases that ran, never about the ones that quietly did not.**

### 2026-08-18 | progress | T2 — `Layers:` corrected again, and the qa-check wiring ruled informational

`conformance.sh` at the repo root was undeclared: T2's `Layers:` named `scripts/lib/` and the Plan
never anticipated a root entry point, though D1 ("one implementation, two entry points") requires one.
Caught by the layers-observed leg, declared at execution (L-100) — the second such correction this
sprint, after T1's `scripts/qa-check.sh`. Two in two tasks is the pattern L-100 predicts, not a
planning defect: a `Layers:` written at promote cannot name the files implementation invents.

**Ruling recorded rather than left implicit:** the engine runs inside `qa-check.sh` on every gate
against this repo — "its own first consumer" — but its findings are **relayed, not counted** into the
gate's tally. Gating now would hold `qa-check.sh` permanently red on 62 `rule-unimplemented` findings,
34 of which § Scope explicitly defers past this sprint; that is scheduled work, not a regression, and
a gate red for a known reason stops being read. The engine's own exit code remains the CI-usable
signal an adopter gates on (DoD 6). **Follow-up filed at close:** gate this repo on the engine once
coverage shrinks the residue enough to be worth blocking on.

qa-check: **159 pass, 0 fail**.

### 2026-08-20 | progress | T4 — the §9 gates-signed family migrated into the engine

The first consolidation. `scripts/lib/check-gates-signed.sh` is deleted and its two rules —
`S9.GATESWELLFORMED` · `S9.GATESABSENT` — are now `assert_S9_*` functions inside the engine, dispatched
from the spec's mark column like every other rule. `scripts/qa-check.sh`'s §9 leg calls the engine.
EPIC-002 D3's four-times-deferred consolidation question is off the shelf for one family; the remaining
ten follow per-family, each guarded by its own retained fixtures.

**Exact reproduction was proven, not assumed.** The deleted checker was restored from git
(`git show HEAD:scripts/lib/check-gates-signed.sh`) and run beside the engine against all five fixture
cases: `diff` per case, **IDENTICAL ×5**. Only the path form is normalised, which the repo-dir
interface necessarily changes. The published named-findings contract (L-058 · TD-012) survives the
migration intact.

The fixture harness is **repointed, not rewritten** — its diff swaps the target and adds a reduced-spec
derivation; every case body survives. The reduction is load-bearing: handed the full spec, the other
61 unimplemented ids fire against these throwaway fixture dirs and every "exit 0" case exits 1 for
reasons this family does not own. The awk derivation carries only §9's two rows.

qa-check: **159 pass, 0 fail** — re-verified green at commit time (exit 0).

### 2026-08-20 | surprise | T4 — five green fixtures while the engine called an unsigned sprint PASS

The migration reproduced every finding *string* exactly and still got the verdict wrong. All five
original cases passed while the engine rendered a sprint with **no `gates_signed:` field** as `PASS` and
reached `level: Attested` on it — the precise failure §9 exists to prevent, and the one L-099 wrote the
field for.

Root cause was in the driver, not the assertion. `S9.GATESABSENT` on an absent field emits *only a
note*: §9 states it as "field absent ⇒ NOT SIGNED, never approval", so it may not report a pass. The
engine had `last_bad` but no counterpart, so it inferred **passed** from **did not fail** — collapsing
three outcomes into two and counting a note-only assertion as a pass. Fixed by adding `last_ok`, set
by `ok()` alone, so "reported without a verdict" is its own state.

Why the fixtures missed it: **all five asserted finding text, none asserted the verdict label.** The
string-compare that proved DoD 2 is exactly the check that cannot see a flipped label — it was
comparing the halves of the line that were right. A sixth case was **added, not swapped in** —
`absent-is-not-labelled-a-pass` — asserting the label and the level line rather than the text.

The general shape, one register over from L-103: **a check that compares the part you migrated cannot
see the part you rewrote.** Reproducing a message verbatim is evidence about the message; the verdict
it carries is a separate claim needing its own case.

### 2026-08-20 | decision | T5 — ADR-008 amended, not superseded; the CI sentence ruled

Two owner rulings, both taken as popups rather than assumed from the Plan's framing.

**Form: amend.** ADR-027 records the scope change; ADR-008 keeps `status: accepted` and gains a
`Scope amended by:` marker plus `related: ADR-027`. Its actual decision — a dependency-free POSIX-sh
script for the mechanical rules, a checklist for the judgment ones — is live and unrevisited, and
superseding would demote a still-governing rule to history to restate it unchanged. §4's append-only
constraint is satisfied by a marker; no § Decision / § Context / § Consequences text was touched.

**Substance: the exit code is the contract, the pipeline is not.** ADR-008's *"wiring it into CI stays
out of scope"* is broad enough to read two ways, and EPIC-004 § Scope promises adopters "CI-friendly
exit codes". ADR-027 rules that the sentence means *lean-flow does not own your pipeline*, not
*lean-flow emits nothing a pipeline can use* — and states both halves, so the next sprint inherits a
boundary rather than an interpretation. Committed to: non-zero **iff** a `FAIL` line was printed,
`rule-unimplemented` included. Not committed to: any workflow file, action, or obligation to keep an
adopter's build green. ADR-011 and this epic's D3 (*reports, never blocks*) are untouched, and
`qa-check.sh` still relays the engine's findings instead of gating on them (T2's ruling).

**Both frozen figures were re-derived before they froze (L-136).** The ADR's blast radius first read
"12 checkers"; `ls scripts/lib/check-*.sh | wc -l` returns **11** post-T4, and the draft was corrected
before commit. The exit-code claim was read off `exit $fail` in the engine, not off the draft.

**And the DECISIONS row was caught by the cross-check, not by review.** The first insert silently
no-opped — a `perl -0pi` substitution against a CRLF file that matched nothing and exited 0. The
reconcile that follows every table edit here (**rows == `docs/adr/ADR-*.md` files**) returned 26 vs 27.
Re-done with awk: 27 == 27. A no-op edit and a successful edit are indistinguishable at the exit code;
only the second number separates them (L-060's family, one tool over).

### 2026-08-20 | note | the Plan is at 378 of its 400-line hard cap, with 8 DoD left to tick

T6 and T3 still owe evidence for eight criteria. At the ~7 lines per criterion T4 and T5 averaged,
finishing in the Plan breaches `S9.TWOFILES`' hard cap. **Convention for the rest of this sprint:**
the Plan's DoD carries a one-to-two-line verdict and a pointer; the reasoning goes here, where ADR-014
put it precisely because the Log is uncapped and the Plan is not. This is a formatting choice, not a
reduction in evidence.

### 2026-08-20 | surprise | the gate reported 3 failures and the harness reported exit 0 — T4 was committed on it

`sh scripts/qa-check.sh > out 2>&1; echo "EXIT=$?"` — the exit code the runner reported back was
**`echo`'s**, not the gate's. Two runs read as green; the first was `158 pass, 1 fail` and the second
`156 pass, 3 fail`, both sitting in the output file the whole time. T4 was committed against the first.

This is **L-120, verbatim and unfired** — "a check and the action it gates are two tool calls; one call
makes the check advisory by construction". The rule names `gate | tail && commit` as the shape; the
shape here was `gate > file; echo $?`, which is the same defect wearing a redirect: the last command in
the chain succeeds, so the chain succeeds. The rule was loaded, correct, and did not reach the moment
it was written for — the third time this family has been recorded that way. **The durable fix is to
read the artifact, not the status**: the summary line `QA-CHECK: N pass, M fail` is what the gate
produces, and `M` is the verdict. Any exit code arriving through a wrapper is evidence about the
wrapper (L-045 · L-057 · L-060).

Nothing shipped broken — all three findings were bookkeeping, and none was in the migrated code:

1. **`knowledge index STALE`** — caused by ADR-027 landing mid-run; `scripts/gen-index.sh` regenerated.
2. **`corpus dangling refs: ADR-008:ADR-027`** — the corpus is **git-tracked** files by design (an
   untracked WIP research doc must not fail the gate, TASK-060), so ADR-008's new `related: ADR-027`
   pointed outside the id universe until ADR-027 was staged. Self-clearing at the T5 commit; recorded
   because it will recur on every ADR that lands with an inbound `related:` ref.
3. **`layers observed: T4 changed docs/research/conformance-dispositions.md, scripts/lib/conformance-engine.sh
   — never declared`** — real, and the same L-100 correction T1, T2 and T5 each needed. T4's `Layers:`
   said *"the engine"*, which reads correctly to a human and matches nothing: **the layers check
   compares paths, so a layer named in prose is an undeclared layer.** Corrected to the path.

The T4 commit stands as history; the Plan-side corrections land with T5.
