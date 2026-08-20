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

### 2026-08-20 | progress | T6 — the ownership-header family, and the four rules that now answer

`S1.LAW2` · `S1.LAW3` · `S3.SCHEMA` · `S3.AGENTS` are registered in the engine, firing the five names
`docs/research/conformance-dispositions.md` § build already published. The register was updated in the
same commit: **covered 8 → 12, `build` 43 → 39**, reconciled by re-counting rule ids in each table
rather than by editing the header (L-105). One divergence is left standing and named — SPRINT-074's
`check-attestation.sh` never got its § Covered today row, so §13's five still count under `build`.
That predates this sprint and moves numbers three sections depend on; flagged, not fixed in passing.

**Three scoping calls, all taken as owner rulings rather than assumed:**

1. **Doc set** = every `*.md` under `docs/`, plus the §2 core files that exist. Not "every `*.md` in
   the tree": a stranger's vendored READMEs and issue templates are not docs under §3, and a report
   full of them is the failure T3 was written to catch.
2. **ADRs are exempt from §3**, and this is a *spec* gap, not an implementation convenience. §4 ships
   an ADR template whose frontmatter is ADR-009 knowledge metadata — `id/tags/domain/status/related`,
   no `owner:`/`last_updated:`/`update_trigger:`. Reporting ADRs against §3 tells an adopter to break
   the standard's own template, and costs **27 findings on the reference implementation alone**. §3
   spells out its README and AGENTS.md exceptions; it owes an ADR row the same way. The engine names
   the exemption in its report rather than applying it silently, and the spec amendment is filed.
3. **Role vocabulary shipped, repo-overridable.** §14 marks `S1.LAW2` mechanical — "value in a role
   vocabulary" — while the spec publishes no vocabulary, and §7's `S7.PERSON` says the same rule is
   "mechanical against a role vocabulary, judged without one". The vocabulary is the thing that has to
   exist for the mark to hold, so the engine ships a small default and reads `.conformance-roles` when
   a repo declares one. A declared file **replaces** the default, so "only these roles" is sayable.

**What it found on this repo: 28 real gaps** — 15 docs with no frontmatter at all (`docs/qa/` ×3,
`docs/strategy/adlc/` ×12) and 13 research docs missing only `update_trigger`. Reported, not fixed:
T6's scope is coverage, and `qa-check.sh` relays engine findings rather than gating on them (T2's
ruling), so nothing turns red. Filed as **TD** at close rather than absorbed here.

### 2026-08-20 | surprise | two censuses disagreed by one, and the smaller number was the checker's

The engine reported 14 `ownership-header-missing`; an independent census of the same tree said 15. The
missing file was `docs/strategy/adlc/README.md`.

§3 exempts the repo-root README because the front-door carries a footer `<sub>` line instead of a YAML
block. The first draft implemented that as `*/README.md` — which is not "the front-door", it is *every
README at any depth*, and it silently dropped a nested doc that had no header at all. **A too-broad
exclusion fails green**: the suite was 10-for-10, the report looked clean, and the only signal was two
numbers that would not agree. Fixed to root-scope, and the nested README is now a retained fixture
case rather than a fixed bug.

Worth naming the shape, because it is not the usual one: the danger in an exclusion list is not the
entry you forget, it is the entry that matches **more than its reason covers**. The reason ("the
front-door is special") was correct and the glob was wider than the reason. Nothing on the code-review
surface shows that — only a count from somewhere else does.

### 2026-08-20 | surprise | the discrimination pass found two dead cases and one dead patch

Ten breaks seeded against the ownership suite; all ten reddened, but two only after repairs the pass
itself forced:

- **The ADR exemption went unnamed on an ADR-only repo.** The note sat *after* the empty-doc-set early
  return, so a repository whose only documents are ADRs got "no documents found" while 27 files were
  silently skipped — the report stating the opposite of what happened. Moved above the return.
- **`owner-role-must-match-whole-value` proved nothing.** Its fixture used `owner: Alice, Maintainer`,
  and seeding the substring break (`grep -qix` → `grep -qi`) reddened *nothing*: a longer string is
  never a substring of a shorter role line, so the case could not see the break it was named for. What
  `-x` actually guards against is a value that is a **prefix** of a real role, so the fixture became
  `owner: Main`. Now the break reddens it.

Also caught, by the seeding harness's own no-op guard: two patches whose `sed` never matched reported
"green", and a green run behind a patch that never landed is not evidence. The guard turns that into
`SEED-ERROR` instead of a pass — **the discrimination pass needs its own discrimination check.** One
seeded run against the foreign-repo harness had to be re-done for exactly this reason.

### 2026-08-20 | decision | T3 — first contact, and the report that was 96% our own roadmap

The engine run against `acme-widget`, a four-file JS library built from nothing (no lean-flow file
copied in — the harness asserts that mechanically):

```
58 FAIL lines  ->  56 rule-unimplemented (ours)  +  2 findings (theirs)
level: none -- Structural not yet reached. 41 finding(s) prevent it
```

Their repo had **two** defects. The headline said forty-one, and all but two were checkers *we* have
not written yet. Worse, the level was not a property of their tree at all: it would improve when **we**
shipped a checker and degrade when the spec gained a rule. That is not a conformance level, and the
epic's headline claim — an adopter gets a named answer — was being met by a report that was 96% our
roadmap wearing their repo's name.

**Owner ruling: separate the axes.** A `rule-unimplemented` is a statement about *this engine*, so it
gets its own verdict class (`GAP`), its own line in every report, and its own coverage statement — and
it stops entering the level arithmetic and the exit code. L-058 is untouched and silence was never the
alternative: a gap is still **named, every time**, and going quiet is now a fixture case in its own
right (`M:gap-silent` reddens four). The same run now reads:

```
2 FAIL, 56 GAP
level: none -- Structural not yet reached. 2 finding(s) prevent it
coverage: 6 checkable rule(s) have an assertion in this engine; 56 are unchecked
```

**Triage of every finding, per DoD 3.** Both are *actionable by that repo's owner*; neither is an
artefact of dispositions written against our shape:

| Finding | Verdict | Why |
|---|---|---|
| `ownership-header-missing: docs/architecture.md` | actionable | §3's header is the standard's own core requirement, not a lean-flow directory convention; the fix is stated in the finding text |
| `update-trigger-absent: docs/architecture.md` | actionable | same doc, same fix; LAW 3 applies to any repo that has documents |

**Artefact count: zero** — so nothing routes back to `conformance-dispositions.md` this round. That is
a weaker result than it looks, and is recorded as such: with only 6 of 62 checkable rules implemented,
the run has not yet *touched* the dispositions most likely to be shape-bound — §2's placement rules,
§6's tier doc-sets, §11's ledgers. **The artefact question is not answered so much as barely asked**,
and it wants re-running as coverage grows rather than treating this round as settling it.

Actionability was then proven rather than asserted: applying exactly what the two findings asked for —
adding the four-field header — takes the same repo to **exit 0, no FAIL line**. A finding whose
prescribed fix does not clear it is not actionable, and that is now a retained case.

**The no-ratio rule bit on the way through.** The first coverage line read "6 of 62", which T2's
fixture correctly flags as a ratio shape (§14 forbids one — it improves whenever the standard declines
to automate something). Rephrased to two counts, which is what §14 asks for and what the dispositions
register already states in words.

**One consequence to carry:** ADR-027 was accepted earlier today with an exit-code sentence that folds
`rule-unimplemented` into FAIL. T3's evidence changes that, so ADR-027 carries a refinement marker
rather than being edited — the same append-only treatment ADR-008 got from ADR-027 itself, hours
earlier. A decision recorded before the evidence arrives is not wrong for having been recorded; it is
amended in the open.

### 2026-08-20 | note | T1 and T2 DoD evidence moved here from the Plan

Owner-approved at close time. The Plan was at **395 of its 400-line hard cap** (`S9.TWOFILES`)
with § Files Changed empty and § Retro unwritten — roughly 40-60 lines of close-time content with
nowhere to go. Rather than raise a spec number for every adopter, or close over a red cap, the
evidence prose moves to the uncapped sibling **ADR-014 created for exactly this**, and the Plan
keeps what a Plan is for: the criterion, its `*Verify:*` clause, and a one-line verdict.

The same treatment was applied to T4 and T5 earlier today. **Nothing is dropped** — the blocks
below are the verbatim originals, and no DoD text or tick was altered by the move.

---

### T1 — Generalize the rule-source reader from §13 to any `## §N` Conformance table `[size: M · risk: med · class: decision · HITL]`
Layers: `scripts/lib/` (the extracted reader) · `scripts/lib/check-attestation.sh` (its first consumer) ·
        `evals/` (reader fixtures) · `scripts/qa-check.sh` (registers the new harness in the always-on
        set — **declared at execution, not at promote** (L-100): the gate's own completeness leg fails
        any harness left in `evals/` ungated, so shipping the fixtures without this is half-shipped)
Depends-on: none
Cites: EPIC-004 D1 · `spec/STANDARD.md` §14 (the table format it defines) · L-108 (position-anchored
       matching) · L-058 · roadmap Phase A item 4

`check-attestation.sh` already parses one section's table correctly and does it the safe way — anchored
to a table-row position inside a section window rather than matching a rule-id substring. Extracting
that as a reader every section shares is the engine's foundation, and doing it **first, alone** is
deliberate: a section whose table diverges in shape must be discovered here, not after 38 rules depend
on it.

**Acceptance:** a reader returns `(id, level, mark)` for any `## §N` section, and its §13 output is
provably identical to what the attestation checker derives today.

**DoD:**
- [x] The reader parses **every** `## §N` section that carries a Conformance block — *Verify: run it
      across all 13 and reconcile the per-section counts against §14's own table (`4·21·3·7·2·4·9·0·10·10·11·12·7 = 100`);
      a section returning zero rows when §14 says it has some is a FAIL, not an empty result*
      → `sh scripts/lib/read-spec-rules.sh spec/STANDARD.md --reconcile` — **13 of 13 PASS, total 100
      reconciled**, section by section, against §14's own counts row *read from the spec* rather than
      hard-coded. §8 returns 0 and that is correct — §14 publishes 0 for it, and the reader consults
      that count in every mode precisely so *has no rules* is distinguishable from *was dropped*.
- [x] §13's output is **unchanged** — *Verify: diff the reader's §13 rows against what
      `check-attestation.sh` derives today, mechanically. This is a refactor of a working parse; a
      behaviour change here is a regression, not an improvement*
      → the shipped parse was **lifted verbatim** out of the file (`sed -n '87,105p'` piped to `eval`,
      never retyped) and run against the same spec; `diff` against the reader's `--section 13` output
      is **empty**, 7 rows each. Load-bearing detail: the row anchor had to widen from `[A-Z]+` to
      `[A-Z0-9-]+` or **26 rules would have been silently dropped** (all of §1, all of §2, one in §7,
      whose ids carry digits or hyphens) — widened, then proven not to change §13.
- [x] An absent or unparseable table is a **named finding**, never an empty rule set — *Verify: a
      retained must-FAIL fixture pointing the reader at a spec with no tables reports
      `spec-table-unreadable`. A reader returning nothing checks nothing and exits clean, which is the
      false negative the whole engine would otherwise inherit (L-058)*
      → `evals/run-spec-reader-fixtures.sh`, **retained**: 9 cases, **5 must-FAIL, one per named
      finding** — `spec-table-unreadable` (whole spec · and a section whose rows were stripped while
      §14 still publishes 7 for it) · `section-rows-mismatch` · `spec-counts-unreadable` ·
      `spec-not-found` — plus 3 PASS controls and a position-anchoring case. **Shown to discriminate,
      not merely pass** (L-137): two breaks seeded, each reddening the right cases.
- [x] `check-attestation.sh` consumes the reader rather than keeping its own copy — *Verify:
      `evals/run-attestation-fixtures.sh` still green, all 16 assertions, unmodified*
      → its 25-line parse block is now one call to the reader; **all 16 assertions green with the
      harness file untouched** (`git status` shows no change to it), which is what makes this a
      refactor rather than a rewrite. The checker keeps its own `spec-table-unreadable` wording, so
      the published finding text is unchanged. Registered in `qa-check.sh`'s always-on harness set —
      the gate's own completeness leg fails any harness in `evals/` that is left ungated (L-020).

### T2 — Build the engine core: registry, dispatch, report `[size: M · risk: med · class: execution · HITL]`
Layers: `conformance.sh` (the standalone entry point at the repo root — **declared at execution**
        (L-100): D1 settled "one implementation, two entry points", which needs a file here, and the
        Plan named only the lib it delegates to) · `scripts/lib/` (the engine) · `scripts/qa-check.sh`
        · `evals/` (engine fixtures)
Depends-on: T1
Cites: EPIC-004 D1 · D2 (settled at intake) · `spec/STANDARD.md` §14 (levels, marks, the
       no-percentage rule) · ADR-021 · `read-spec-rules.sh` (T1's reader — **consumed, not
       modified**, which is why it sits here and not in `Layers:`) · `S13.NOINFER` · `S1.LAW2`
       (the two rule ids the mark-driven fixtures re-mark in a spec copy to prove dispatch reads the
       Mark column each run)
The engine is the §13 checker's dispatch loop with the rule set widened and the report generalised. Its
whole correctness claim is that **the spec decides what gets evaluated** — so the mark column drives
inclusion, and a rule the spec states but the engine cannot answer is reported rather than absent.

**Acceptance:** `sh conformance.sh <repo-dir>` produces, for any repository, a level and a list of
named findings — and a reader can tell from the output which rules were evaluated, which were skipped,
and why.

**DoD:**
- [x] Dispatch is **mark-driven**, not a hard-coded list — *Verify: re-mark a rule in a spec copy and
      the engine's behaviour changes with no code edit, the same fixture shape SPRINT-074 used to prove
      it for §13*
      → proven in **both directions**, which one fixture alone would not do: `mark-driven-forward`
      re-marks `S13.NOINFER` *mechanical* in a spec copy and the engine starts dispatching it;
      `mark-driven-reverse` re-marks `S1.LAW2` *implementation-directed* and it stops. No code edit in
      either. The rule set and marks come from `read-spec-rules.sh`; only the assertion bodies are the
      engine's.
- [x] `judgment-only` and `implementation-directed` rules are **never evaluated against the repo** —
      *Verify: neither appears as a verdict line; a fixture asserts it. These are the findings no
      adopter can ever clear (§14)*
      → `judgment-and-impl-directed-never-verdicts` asserts no `PASS`/`FAIL` line carries `S1.LAW1`
      (judgment-only) or `S13.NOINFER` (implementation-directed); both appear only as notes. The live
      run against this repo bears it out: **32 judgment-required + 6 excluded**, matching the spec's
      own mark tally exactly, and §14's stated six implementation-directed rules. **The fixture itself
      had to be repaired first** — its success path was a bare `grep && grep && echo` chain that
      short-circuited to *silence* when a grep failed, so it could pass or vanish but never fail, and
      it vanished under the very break it guards. Rewritten as an explicit arm that sets `fail=1`; a
      case that cannot distinguish "passed" from "never ran" is not a check (L-103 · L-137).
- [x] A `mechanical` rule with no assertion reports `rule-unimplemented` — *Verify: retained must-FAIL
      fixture. With 34 dispositions still unbuilt this will fire a lot, and that is correct: the gap is
      the report's most useful content this sprint*
      → `rule-unimplemented-fires` (retained, must-FAIL, exit 1). Against this repo it fires **62
      times** — every `mechanical` (49) and `split` (13) rule, since T2 ships the driver and no
      assertions. That reconciles to 100 with the notes: `62 + 32 + 6 = 100`. Discrimination proven by
      silencing the path (`bad` → `note`): **5 fixtures reddened**, including this one.
- [x] The report states a **level** and the findings preventing the next one — *Verify: fixture*
      → `level-line-states-blocked-level`, plus `level-bucket-survives-prior-failure` guarding the
      subtler half — a Gated failure earlier in document order must not mask a later Structural one and
      inflate the level. Live: `level: none -- Structural not yet reached. 43 finding(s) at Structural
      prevent it`. **43 independently re-derived** from the spec as Structural × (`mechanical`|`split`)
      — it agrees, and it is *not* the 43 `build` dispositions, which is a different set of the same
      size (checked, because two equal numbers in one sprint invite exactly that confusion).
- [x] **No score, grade or percentage appears anywhere in the output** — *Verify: a fixture greps the
      output for `%`, `score`, `grade` and a ratio shape and asserts absence. §14 forbids it
      normatively, so this is checked rather than trusted (L-058)*
      → `no-score-grade-percentage-or-ratio` asserts absence of all four. Covered on **both report
      branches**, not just the reachable one: a second case exercises the `level: Attested` wording,
      which only a clean spec reaches, so the forbidden text cannot hide in the branch this repo never
      takes. The summary line states **counts** (`0 passed, 32 judgment-required, 6 excluded`), which
      is what §14 requires in place of a ratio — a denominator here would average a deliberate
      judgment-only boundary together with a real gap.
- [x] Exit 0 clean / 1 findings, CI-usable — *Verify: fixture asserts both, on the same repo*
      → `exit-0-clean` and `exit-1-findings`, both against the same target repo, differing only in the
      spec they are pointed at — so the exit code is shown to track the findings and not the target.
      Live against this repo: **exit 1** with 62 findings. `qa-check.sh` runs the engine on every gate
      as its own first consumer, **informationally**: its findings are relayed but not counted into the
      gate's tally, because 34 dispositions stay deliberately deferred past this sprint (§ Scope) and
      gating on them would hold the gate red over scheduled work rather than a regression. The engine's
      own exit code is the CI-usable signal an adopter gates on. **Follow-up at close: gate this repo
      on it once coverage makes the residue worth blocking.**


---

### 2026-08-20 | surprise | T6 made the gate stall, and the cost was process spawn, not logic

The first ownership implementation walked the doc tree **once per rule** and spawned an awk **per field
per doc** — roughly 2,800 processes against this repository's 236 docs. The engine went from seconds to
minutes, and `qa-check.sh` sat on its engine leg long enough to look hung rather than slow.

Fixed by not spawning: one cached walk, one awk per doc, and the awk emits ready-made lists so the three
assertions never re-split a row (splitting per doc per rule would have put the spawns straight back).
**47s** on this repo now, `user 7s / sys 19s` — still spawn-dominated, which is a Windows cost more than
an algorithmic one; the same work is a few seconds where `fork` is cheap.

The refactor was verified by **counts, not by eye**: 15 `ownership-header-missing`, 13
`ownership-header-field-missing`, 28 `update-trigger-absent` before and after, identical. A performance
change that alters what a checker finds is a behaviour change wearing a performance change's clothes.

**Not taken further, deliberately.** One awk over every file at once is ~1 process instead of 236, but it
needs a cross-file state machine and silently drops a zero-byte file — awk never reaches `FNR==1` for
one — and a doc missing from the scan is a doc no rule reports on. Trading a silent skip for wall-clock
is the wrong trade in this file specifically (L-058). The reason is written into the code so the next
person optimising it meets the argument before the temptation.

### 2026-08-20 | note | close-time follow-ups, to be filed by the Retro

1. **TD — 28 ownership-header gaps in our own docs**: 15 with no frontmatter (`docs/qa/` ×3,
   `docs/strategy/adlc/` ×12) and 13 research docs missing `update_trigger`. Reported by the engine,
   relayed not gated, so nothing is red; owner ruled *report, do not absorb into T6*.
2. **TASK — §3 owes an explicit ADR row.** §3 spells out its README and AGENTS.md exceptions; ADRs are
   the unstated third case, and the engine currently carries that ruling in code plus a report line.
   A spec PATCH moves it to where adopters read it.
3. **TASK — re-run the artefact triage as coverage grows.** T3 recorded 0 artefacts against 6 of 62
   rules implemented; the shape-bound dispositions have not been exercised on a foreign tree yet.
4. **TD (small) — the dispositions register still counts §13's five under `build`**, since
   SPRINT-074's `check-attestation.sh` never got its § Covered today row. Named in the register.
5. **Note for close — the Plan is at its cap.** § Retro has ~20 lines of headroom. T1/T2/T4/T5 evidence
   already moved to this Log; if the Retro needs more room, T6/T3's evidence blocks are the next to move
   under the same rule, not the cap.
