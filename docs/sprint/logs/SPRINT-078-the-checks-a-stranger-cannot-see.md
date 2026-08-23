---
sprint: 078
slug: the-checks-a-stranger-cannot-see
owner: Maintainer
last_updated: 2026-08-22
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-078 — Execution Log

> Append-only companion to [`../SPRINT-078-the-checks-a-stranger-cannot-see.md`](../SPRINT-078-the-checks-a-stranger-cannot-see.md). Uncapped by design:
> this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.

<!-- Newest entries at the BOTTOM: this reads as a chronology, unlike CHANGELOG.md which is
     newest-first. Event is one of: promote · progress · surprise · scope-change · park · blocker ·
     run-complete · close. `run-complete` is reserved for the run itself finishing (carries the
     Part 4 rollup) — a task finishing mid-run is logged as `progress`, never as `complete`. -->

### 2026-08-22 | scope-change | three DoD verify-methods were unsatisfiable as frozen; corrected, substance unchanged

**What broke.** A1 instructed the run to re-derive the register's counts rather than copy them, and
doing so at G1 surfaced that two different numbers had been conflated at promote. The register's
**19 covered** counts rules covered by *any* checker; the engine's own `coverage:` line counts only
rules with an assertion **in the engine**, and reads **13**. The 6-rule difference is exactly the four
standalone checkers — `check-doc-caps.sh` (`S2.F-CAP` · `S7.MEGA` · `S7.SPRINT400`) ·
`check-ephemeral-intake.sh` (`S2.R-TEMPDIR`) · `check-epic-archive.sh` (`S11.EPIC`) ·
`check-research-archive.sh` (`S11.RESEARCH`). Cross-checked two ways before acting: 13 `assert_*`
functions are defined in the engine, and the engine's own two counts reconcile as 13 + 49 GAP = 62.

Three criteria attributed the register's figures to the engine's line, and one asked for an
impossible comparison:

| Where | Frozen text | Why it cannot be met |
|---|---|---|
| T2 DoD 1 | *coverage line moves 24 → 29* | the line reads 13 today, 18 after T1 |
| T3 DoD 1 | *coverage line moves 29 → 30* | same conflation, one task later |
| T1 DoD 2 | *`diff` of both tools' output returns empty* | the engine emits 62 rules' lines to `check-attestation.sh`'s 5, and pads ids to 20 chars against its 18 — the two outputs can never be equal |

**Impact.** Substance and the register-side arithmetic are untouched: covered still moves
19 → 24 → 29 → 30 of 62, which is what § Theme promised. Only the *verification methods* change:

- T1 DoD 2 → the §13 **finding text** is byte-identical, established by diffing the text portion of
  both tools' §13 lines — diffed, never eyeballed. The claim D2 makes is about findings, not padding.
- T2 DoD 1 → the engine's `coverage:` line moves **18 → 23**.
- T3 DoD 1 → the engine's `coverage:` line moves **23 → 24**.
- T1 DoD 6 is unchanged and was already correct — the register does reconcile to 24 / 27 / 11 = 62.

Owner also ruled the register's own header sentence in scope: *"19 + 32 + 11 = 62, which is what
`conformance.sh` reports"* reads as if 19 were the reported figure. 62 is. Corrected there too, so the
next reader cannot re-derive this sprint's mistake from the register.

**This is L-130's third grain, caught by its own guard.** A1 was written *because* SPRINT-071 and
SPRINT-074 froze a query result into a Plan; it fired here exactly as intended, at the moment of
execution rather than at close.

**Re-confirm G2.** Re-signed with the correction folded in. Nothing in D1 · D2 · D3 moves.

### 2026-08-22 | scope-change | A4 does not hold — T2's acceptance rested on two decisions G2 had not taken

**What broke.** A4 asserted that no criterion in the Plan rests on a decision G2 has yet to take.
Reading §6 against §2 at the gate found two that do, both inside T2.

**(a) Tier detection is judged, and the engine is already on record refusing to guess it.** All four
§6 rules are marked `split — detection judged`, and `assert_S2_F_FILE`'s own comment rules that
requiring a tier-gated row *"would be this engine guessing a tier the standard explicitly declines to
infer, and telling a four-file JS library it owes `docs/database/erd.md`"*. T2's acceptance — *a repo
at any one of the four tiers* — presumes a tier the engine may not infer. Only **Base** escapes: §6's
trigger for it is *every dev repo*, so it is owed unconditionally.

*Ruling:* a repo **declares** its tier in `.conformance-tier`, mirroring the `.conformance-roles`
precedent this same engine already ships for §1's role vocabulary. Undeclared, Base is still checked
and the other three report *not evaluated — detection is judged (§6)*. One new consumer-facing
surface, documented in the register (L-015).

**(b) `S6.MULTISVC` has no §2 rows to reduce to.** §6 says every tier's satisfaction half *"reduces to
`S2.F-FILE`"*, but the three docs it names for multi-service — service registry · cross-service
dependency map · global decisions index — have **no row anywhere in §2's tables**. Verified two ways:
a case-insensitive sweep of §2 for all four names returns nothing, and enumerating the distinct values
of §2's Tier column yields `base · backend/integration · backend, or overview cap-split · medium+ ·
API exists · auth exists · DB exists · lean loop · as needed · ephemeral` — no multi-service value
exists. Deriving the required set therefore yields the **empty set**, and an empty required set passes
every repository — the precise false negative `assert_S2_F_FILE`'s own guard was written to refuse
(L-058).

*Ruling:* `S6.MULTISVC` fires a distinct `tier-doc-set-underivable`, naming the spec gap where a
reader meets it, rather than folding into `tier-doc-set-incomplete` (a missing file and a hole in the
standard are not the same finding) and rather than being re-dispositioned `scope-out` mid-sprint
(which would move three of the register's counts). The §2 gap is filed as a follow-up at close.

**Impact.** T2's DoD is unchanged in count and in finding name; what changes is that
`tier-doc-set-incomplete` is now specified against a *declared* tier, and a fifth outcome
(`tier-doc-set-underivable`) exists for the tier §2 cannot describe. Coverage arithmetic is untouched.

**Re-confirm G2.** Both rulings signed off at the batch gate before T1 began. A4 is recorded here as
**not held** rather than quietly re-read — which is what L-111 asks of a criterion that turns out to
rest on an undecided fork.

### 2026-08-22 | progress | T1 complete — §13's five rules are reachable from the consumer entry point

**Acceptance, on a repository that never installed lean-flow.** A throwaway git repo (two files, one
commit carrying `Gate: G1,G2` and nothing else) run through `sh conformance.sh <dir>`: all five §13
rules named, `attestation-trailers-incomplete` fired for the two missing trailers, and
`attestation-unsigned-claim-only` reported. Before this task that repo's report contained no §13 line
at all, because `conformance.sh` execs the engine and the engine had never heard of §13.

**Four things execution found that the Plan could not have.**

**(a) The engine's level ladder only demotes on FAILs, so the migration needed a fourth verdict class.**
`attestation-unsigned-claim-only` must not fail — §13c calls it a level honestly reached. The deleted
checker could say so because it published its own §13-scoped `level:` line; this engine publishes one
ladder for the whole sweep. Carrying the finding across as a plain `note` would therefore have printed
`level: Attested` over an attestation nobody signed — same finding text, same exit code, opposite
headline. Hence `hold`: prevents a level, never fails, never touches the exit code. Three rungs added
(`struct_hold` · `gated_hold` · `attested_hold`), ordered after the failure rungs.

**(b) `--rev`.** The deleted checker took a commit-ish; the engine took a repo-dir only. Migrating
without it would have quietly cost an adopter the ability to attest any commit but HEAD, and would
have forced the retained fixtures off the exact commits they were built around. Default `HEAD`; rules
that read the working tree ignore it.

**(c) Two fixture expectations changed, and DoD 4's *"pass unchanged"* is ticked with that qualified.**
The fixture *repos* and the five finding names they assert are untouched. Two harness assertions moved,
both because the engine's ruling supersedes the checker's:
- `unsigned-level-line-says-gated` asserted the literal `level: Gated (not Attested)`. The engine
  phrases the same claim through the hold rung. The claim was re-asserted, not dropped — plus a new
  `unsigned-hold-is-not-a-failure` case, so the suite grew 16 → 17 assertions.
- `rule-unimplemented` expected exit 1. The engine rules a gap a statement about *itself*, entering
  neither level nor exit code (SPRINT-075 T3, after a stranger's repo came back with 58 FAIL lines of
  which 56 were our own missing assertions). The case now asserts exit 0 **and** a `GAP` line naming
  the rule — strictly more specific than what it replaced.

**(d) `TECH-DEBT.md` and three docs joined T1's `Layers:` (L-100).** `docs/QA.md` described a file
about to stop existing; `evals/run-spec-reader-fixtures.sh` named it as this reader's consumer;
TD-065 was the standing record of the very divergence DoD 6 closes. Declared, not smuggled.

**The suite's first green run was not trusted.** Seeding the rejected design — `hold` reverted to
`note` — reddened exactly `unsigned-level-line-says-gated`, `unsigned-hold-is-not-a-failure` and
`unsigned-never-attested`, while 14 sibling controls stayed green; `unsigned-reports-gated` correctly
held, since the finding *string* survives the downgrade and only the *level claim* does not. Guards
run before the verdict was read: seed landed (`cmp`), still parsed (`sh -n`), targeted (line count
identical, 18 assertions before and after, 2 changed lines), and the engine restored under a checked
`sha256` (`fb6524c6…`).

### 2026-08-22 | surprise | this sprint's `Layers:` declared nothing, and it failed green

`check-layers-observed.sh` reads declared tokens with `grep -oE '` + "`" + `[^` + "`" + `]+` + "`" + `'` — **backtick-quoted only**. All three of
SPRINT-078's `Layers:` lines were promoted without backticks, so the union of declared tokens was
**empty** and every file this task touched, including the five the Plan explicitly named, reported as
`changed but undeclared`. SPRINT-077's lines are backticked; the shape is right there in the archive.

It failed green until the first file changed, which is the whole shape of the thing: between promote
and the first edit there is nothing to compare, so a declaration guarding zero files is
indistinguishable from one guarding everything. Fixed by backticking all three (a `Layers:` correction
is a live declaration, not a Plan amendment — L-100). **Learning candidate:** a `Layers:` line is
consumed by a checker with a parse, so promote should render it in the form that checker reads — or
the checker should report an unreadable declaration as a named finding rather than as an empty set,
which is L-058 applied to its own input.

### 2026-08-22 | scope-change | T2's DoD 3 named one finding string; the four tiers honestly need three

**What broke.** DoD 3 froze *"`tier-doc-set-incomplete` fires for each of the four tiers"*. Building it
against §2's actual table showed the four tiers are not alike, and forcing one string on them would
have meant either inventing findings or suppressing real differences:

| Tier | §2 rows | Finding |
|---|---|---|
| Base | 2 literal paths (`product/requirements.md` · `product/acceptance-criteria.md`) | `tier-doc-set-incomplete` |
| Backend | 3 literal paths | `tier-doc-set-incomplete` |
| Medium | 2 rows, **both families** (`adr/ADR-NNN-<slug>.md` · `flows/<slug>.md`) | a named note — a family cannot be *missing*; a repo with no ADRs has taken no qualifying decision, which §4 makes correct |
| Multi-service | **none** | `tier-doc-set-underivable` (the ruling taken at G2) |

**Impact.** Four tiers, four retained must-FAIL fixtures, three finding strings. The DoD's substance —
every tier has a fixture asserting the finding it actually fires — is met and strengthened; only the
assumption that one string covers four tiers is dropped. A fourth string, `tier-declaration-unreadable`,
guards the declaration itself.

**Re-confirm G2.** This follows directly from the two rulings already signed (declared tier ·
`tier-doc-set-underivable`); nothing new is being decided, it is the frozen text catching up.

### 2026-08-22 | progress | T2 complete — the tier is a parameter, and the parameter is declared

Coverage **18 → 23**. Ten retained fixtures added; the engine-fixture suite is **26 pass, 0 fail**.

**Where the required set comes from, and the §2/§6 disagreement it exposed.** §2's Tier column assigns
rows; §6's tier table states the doc sets. They do not agree — §2 gives
`development/coding-standards` a bare `init` trigger while §6 lists that exact file among the rows
*"skipped, not owed"* without code. Reading §2's `Create ←` prose for condition words was tried first
and rejected: it makes `product/requirements.md` conditional (its cell says *"skipped on an existing
repo whose AI-context files already ARE the spec"*) and empties the one tier set with teeth. §6's
clause is the subtraction, §2's Tier column the assignment. The result reproduces §6's Base row
exactly: two owed, four skipped-and-named.

**This repo now reports two findings against itself, and they are correct.** lean-flow has neither
`docs/product/requirements.md` nor `docs/product/acceptance-criteria.md`, and
`docs/architecture/overview.md` § *Base-tier docs this repo deliberately does not have* records the
exemption with its reason. §6 owes them of *every dev repo*; §2's Create cell is where the escape is
written. The engine reports what §6 says and leaves the exemption to the human who wrote it down —
which is the same shape as `S2.F-FILE` and does not touch `qa-check.sh`, whose engine leg is
informational except the two fully-covered families.

**Not trusted on green.** Two seeded breaks, each guarded (`cmp` · `sh -n` · line count identical · 23
assertions before and after · 2 changed lines · restore verified against `sha256 1625bc9a…`):
- `_tier_is_conditional` forced to always-true (everything reads as substrate-conditional) → reddened
  `tier-base-incomplete`, `tier-backend-incomplete`, `tier-set-is-spec-derived`; 23 controls green.
- the `declared rank < rule rank` guard disabled (the tier stops being a parameter) → reddened
  `tier-below-not-owed` and `tier-backend-control`; 24 controls green.

**And the L-146 guard was itself tested.** Seeding `write_base_tier` to a no-op — so the derived victim
was never written — made the harness say so loudly *while the fixture underneath it still reported
PASS*. That is the failure L-146 describes, reproduced: without the guard, a case whose victim never
existed scores as a must-FAIL that fired.

### 2026-08-22 | surprise | T2 cost the engine 38% of its wall clock, and the gate paid for it

The tier family's first cut resolved each §2 row's tier rank by calling a shell function from a
`while read` loop — ten times per run over ~20 rows, plus an un-cached awk pipeline per rule for §6's
substrate clause. On a four-file repository the engine went **13s → 18s**, and `qa-check.sh` invokes it
around sixty times: the gate went from roughly five minutes to over ten and had to be killed twice.

Fixed by moving rank resolution **inside the single awk pass** and caching the substrate stems per
rank. The engine now runs that repo in **11s — faster than before T2 existed**, while answering six
more rules.

This is the **third** sighting of the same lesson in this one file: `S2.R-PLACEMENT` paid 29 seconds on
a four-file directory for a `find` per row, the ownership family paid ~2,800 awk processes, and now
this. The engine's stated cost model is *walk once, then filter*, it is written in a comment directly
above the code that violated it, and it did not fire. **Learning candidate:** the rule is stated as
prose next to one hot path rather than as a check anyone runs — a new assertion is never timed against
the previous engine, so a regression is only visible once the gate blows its timeout, several tasks
downstream of the cause.

### 2026-08-22 | progress | T3 complete — coverage 19 → 30 of 62, the sprint's Theme met

`S2.R-README` answered; the engine's `coverage:` line moves **23 → 24**, and the register closes at
**30 covered · 21 `build` · 11 scope-out = 62**.

**Only one of the rule's two invariants is mechanical, and the report says so.** §2 marks it
*mechanical on the invariants — the anti-SSOT rule and the footer ownership line*. The footer is
checkable and is checked. The anti-SSOT half (*"not a second copy of `CONTEXT.md` or
`architecture/overview.md`"*) is a judgement about content: any heuristic — does the README repeat
their headings? — fires on every repo whose README legitimately summarises its own architecture, which
is what a front-door is for. Named as judged, alongside the PASS, so a reader cannot mistake the pass
for covering both.

**The required shape is parsed from §3's own `<sub>` example**, and that is what keeps `S3.README`'s
scope-out honest. The register scopes `S3.README` out *because it restates `S2.R-README`*; had this
check invented its own footer shape, §3 would state one shape and §2 check another, and a scope-out
would have quietly become a gap. Proven by re-wording §3's example in a spec copy to add a `steward:`
field — the check began requiring it with no code edit.

**Two fixture defects found and fixed, both the same shape as T1's.** `write_core_set` was writing
README.md with a **YAML header** — the very shape §3's README exception forbids — so the moment this
rule shipped, five previously-green cases went red against fixtures that were never conformant. And
the new cases *appended* a footer onto that file rather than replacing it, which for the partial-footer
case meant the engine read the complete footer first and the case tested nothing. Both fixed in the
fixture, never in the rule (L-088), with `strip_footer` asserting the footer exists before removing it
(L-146).

**Seeded.** Hard-coding the field set instead of reading §3 reddened exactly `readme-shape-from-spec`
while 29 controls stayed green. Guards: `cmp` · `sh -n` · line count +1 · 24 assertions unchanged ·
restore verified against `sha256 f61c53d6…`. A first attempt at the same seed was **rejected by the
guards** — a `sed` replacement expanded to three lines, and a break that rewrites three lines is a
demolition, not a discrimination (L-142).

**Also corrected: the counting recipe the DoD prescribes.** Re-deriving the register by matching rule
ids anywhere in a table row returned **31 covered / 63 total**. The 31st was `S3.README` — mentioned in
the `S2.R-README` row's own note, explaining the scope-out it preserves. Counting the **Rule column**
returns 30, and three routes now agree on 62 (register 30+21+11 · engine 24 in-engine + 38 GAP · 30−24
= the 6 outboard checkers). Recorded in the register's header so the next reader inherits the recipe
rather than the mistake.

### 2026-08-22 | surprise | the gate's cost scales with coverage, which is the epic's whole goal

Measured while chasing T2's regression, and worth filing separately from it because the regression was
a bug and this is not. `qa-check.sh` reaches **78 static engine invocation sites** across its harnesses:

| Harness | invocations | spec handed to the engine |
|---|---|---|
| `run-conformance-engine-fixtures.sh` | 30 | **16 full**, 11 reduced |
| `run-ownership-header-fixtures.sh` | 15 | all reduced |
| `run-adr-family-fixtures.sh` | 13 | all reduced |
| `run-attestation-fixtures.sh` | 13 | all reduced (§13-only, T1) |
| `run-gates-signed-fixtures.sh` | 8 | all reduced |
| others | 9 | mixed |

A **full**-spec invocation dispatches all 62 rules against a fixture directory that usually cares about
two or three. Every rule EPIC-004 adds therefore multiplies across those 16 sites — the gate gets
slower in direct proportion to the coverage the epic exists to add, which is the wrong direction for
the thing that has to run before every commit.

Two of the sixteen genuinely need the whole spec (`rule-unimplemented-is-named` and
`gap-is-labelled-gap-and-does-not-set-exit` are *about* the full sweep). The rest are family cases that
could take a reduced copy, exactly as the ownership, ADR, gates-signed and now attestation harnesses
already do — the pattern is established in four files and simply has not been applied here.

**Follow-up for close (TD candidate):** reduce the 14 family cases in
`run-conformance-engine-fixtures.sh` to per-family specs, and consider a `QA_FAST=1` tier so the
pre-commit gate is not the same cost as the pre-close one. Not done in this sprint: it touches cases
this sprint did not write, and doing it while adding coverage would make a slow suite and a changed
suite indistinguishable.

### 2026-08-22 | scope-change | T2 DoD 2 named the wrong §2 column; corrected, claim unchanged

The frozen text read *"derived from §2's `Create ←` cells"*. Building it showed the work splits across
three sources, and the Create cell is the smallest of them:

- **§2's `Tier` column** assigns a row to a tier (`base` · `backend/integration` · `medium+` ·
  `API exists`). This is the assignment the DoD was reaching for.
- **§2's `Create ←` cell** supplies only the `always` exclusion — those rows belong to `S2.F-FILE`,
  which fires `core-file-missing` for them, and counting one absence under two findings is the
  double-count § scope-out (a) exists to prevent.
- **§6's own substrate-conditional clause** supplies the subtraction, because §2 and §6 disagree about
  which rows are conditional and §6's table is the statement of the tier doc sets.

The DoD's *claim* — the required set comes from the spec at runtime, not from code — is unchanged and
is what the `tier-set-is-spec-derived` fixture proves: a base-tier row added to a spec copy made the
engine require it with no code edit. Only the column named in the text was wrong.

Recorded rather than quietly re-read (L-088). Third correction to this Plan's frozen text in one
sprint, all the same family: a value or structural claim about another document, written at promote by
someone who could not yet run the query (L-130 · L-136).

### 2026-08-22 | surprise | the migrated §13 check caught its own shipping commit

The gate run after T2/T3 came back **165 pass, 1 fail**, and the finding was
`attestation-trailers-incomplete: missing Gate-Signed-By: Evidence:` against this repository's own
HEAD — T1's commit.

**The cause was T1's commit message.** It closed with a status line reading `Gate: 164 pass, 0 fail.`,
which git parses as a **trailer**, not as prose. So the commit claimed a §13 attestation — *a gate
applied* — while naming neither who approved it nor what the evidence was. §13a requires all three
together precisely because a `Gate:` alone asserts a gate and declines to say who signed it, which is
weaker than saying nothing. The rule fired correctly on real input.

**Why this is the sprint's best evidence rather than an embarrassment.** CLAUDE.md's bar for a gate is
that it be *exercised once on input that must FAIL, each failing with its named finding*. Those five
rules had fixture coverage since SPRINT-074 and had never once fired on this repository, because
`conformance.sh` could not reach them and `qa-check.sh`'s attestation leg only ever saw commits that
happened to be clean. The first thing the migration did — with §13's verdict lines newly folded into
the gate's tally, which was the half of T1 that could most easily have been dropped as "just a
migration" — was catch a live violation in the commit that shipped it. Had T1 migrated the assertions
and left the gate wiring alone, this commit would have passed.

**Fixed** by amending T1 (unpushed, 23 ahead of origin) to reword the line as prose. Amending rather
than fixing forward on purpose: §13 reads HEAD, so a later commit would have turned the gate green
while leaving a commit in history that falsely claims a gate attestation — which is the attestation
theatre §13 exists to prevent, and green-because-we-moved-past-it is not the same as fixed. The amend
also restored the `Co-Authored-By` trailer T1 had dropped and 14 of the previous 15 commits carry.

**Learning candidate:** a commit message's last line is trailer territory. Any `Token: value` line
there is a machine-readable claim, and this repo now has a rule that reads three specific tokens — so
a summary line shaped like `Gate: …`, `Evidence: …` or `Gate-Signed-By: …` is not a note about the
work, it is an assertion about approval. Worth a line wherever commit conventions are recorded.

### 2026-08-23 | scope-change | T2 and T3 were committed together; split into one commit per task

**What broke.** To save a gate cycle I committed T2 and T3 as a single `sprint(078) T2+T3` commit.
`check-layers-observed.sh` attributes a commit to **exactly one** task — by a `Task: T<n>` trailer, or
a `sprint(NN) T<n>:` subject, or a merge/parenthetical form — and `T2+T3` matches none of them. Its
rule 6 then does what it was written to do: an unattributable commit is **reported, never absorbed**,
because defaulting it to "coordinator" would pass its files silently. Gate: 163 pass, 1 fail.

Worth noting *when* it surfaced. The earlier run had the tree dirty, so the checker's WIP leg applied
— which bounds files against the union of all tasks' `Layers:` and cannot attribute anything. Only
once the work was committed did the stricter per-task leg run. The checker documents exactly this
phase split (TD-044, SPRINT-056 T3) and says the cure is to stop the two legs disagreeing *silently*;
here they disagreed loudly and one commit apart, which is the design working.

**Impact.** The substance was never in question — both tasks declare every file they touched, and
`Task: T2,T3` would not have helped (it attributes to the literal string `T2,T3`, matching no
declaration, and fails differently). Owner ruled: split it.

`git add -p` is unavailable in this environment, so the split was done by **reconstruction**, verified
rather than assumed:
- `conformance-engine.sh` — an exact pre-T3 snapshot existed. Confirmed every one of the 105 lines
  between it and the final file is T3's README work, and all are additions.
- `run-conformance-engine-fixtures.sh` — rebuilt by removing T3's three delimited additions (the
  README case block, `readme_footer`/`strip_footer`, the `README.md` arm in `write_core_set`).
  Confirmed against the T1 commit that every remaining change is T2's, and that the twelve tier-case
  references survive.
- register · `QA.md` · Plan · Log — T3's edits reverted individually; the post-T2 register was
  re-derived to **29 + 22 + 11 = 62** rather than edited to it, and the Log split on an entry boundary
  so chronology is preserved (`cmp` confirmed T2 only *appends* to what T1 committed).

**Re-confirm G2.** Nothing in the design moves; this is history hygiene. Both commits now carry a
`Task:` trailer — the checker's rule 1, *"the convention going forward, unambiguous"* — rather than
relying on the subject pattern.

**Two learnings from the same slip.** (a) Batching tasks into one commit to save a verification cycle
trades a cheap check for an expensive reconstruction; the gate cycle it saved was ~11 minutes and the
split cost more. (b) The 11-minute gate is what made batching tempting in the first place — which is
the § *gate's cost scales with coverage* entry above, arriving as a cause rather than an observation.
The cheap move existed all along: `check-layers-observed.sh` runs standalone in **4 seconds**, so the
specific check can be iterated directly and the full gate run once at the end.
