---
sprint: 081
slug: clean-slate
owner: Maintainer
last_updated: 2026-08-24
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-081 — Execution Log

> Append-only companion to [`../SPRINT-081-clean-slate.md`](../SPRINT-081-clean-slate.md). Uncapped by
> design: this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.

<!-- Newest entries at the BOTTOM: this reads as a chronology, unlike CHANGELOG.md which is
     newest-first. Event is one of: promote · progress · surprise · scope-change · park · blocker ·
     run-complete · close. `run-complete` is reserved for the run itself finishing (carries the
     Part 4 rollup) — a task finishing mid-run is logged as `progress`, never as `complete`. -->

### 2026-08-24 | progress | Batch G1 + G2 signed; run is attended and sequential

Mode `sprint-bulk`, attended. Gates approved by the owner in one frontier round, alongside T2's arm
choice (below). Three facts fixed at the gate:

- **Sequencing: T1 → T2 → T3, fully sequential.** No worktree parallelism. T3 depends on T2 (D1), and
  T1 ∩ T2 share `TECH-DEBT.md`.
- **An overlap D2 did not name.** D2 mapped `evals/` (T2 first, T3 second) but not `TECH-DEBT.md`,
  which T1 touches for TD-064 and T2 for TD-077. Resolved by the sequential order rather than by
  per-hunk staging, so L-042's rule is not load-bearing this run. `docs/research/` looked like a third
  overlap and is not: T3's `conformance-coverage.md` is **not** among T1's 13 — it already carried an
  `update_trigger:`.
- **Execution is inline, by owner ruling.** The session instruction forbids the Agent tool unless
  asked; the owner confirmed inline over dispatch. The orchestrator's default (dispatch every
  Implement step) is therefore overridden for this run, deliberately and not by drift.

Skill freshness: `/prime` reported `1.52.0 base-dir != 1.54.0 repo → STALE`. Checked rather than
assumed — every file under `skills/` is byte-identical to the repo once line endings are normalised
(14 SKILL.md + every `references/`), so the two version bumps touched no procedure and the staleness is
nominal. Recorded because L-021's failure is running a stale *procedure*, which is not what happened
here; the row firing without drift behind it is the expected case, not a near miss.

### 2026-08-24 | progress | T1 — the sixteen ownership headers written; two rules cleared

`TASK-257` · TD-064. Baseline re-derived **before** writing anything, per the DoD's first line and the
row's own closing instruction:

| | before | after |
|---|---|---|
| `ownership-header-missing` | 3 (`docs/qa/` ×3) | 0 |
| `ownership-header-field-missing` | 13 (`docs/research/` ×13) | 0 |
| `update-trigger-absent` | 16 (the union) | 0 |
| FAIL lines total | 34 | 2 |
| `level:` blocking rules | 3 | 1 (`S6.BASE`) |
| `counts:` passed | 28 | 30 |

**A1 confirmed — the numbers had not moved**, matching TD-064's evidence exactly. Three-way
reconciliation (3 + 13 = 16) as the row prescribes, plus a fourth from the other side: `S1.LAW3` and
`S3.SCHEMA` each reported **206** clean docs before and **222** after, and 206 + 16 = 222. The
`counts:` line moving 28 → 30 is the same fact a third way — exactly the two rules T1 targeted, and no
others.

**A2 confirmed.** The `level:` line now names one rule where it named three. The remainder is
`S6.BASE`, which is T2's and, as TD-077 states, not clearable by writing anything.

Each of the 16 triggers was derived from what would actually change that doc, never a placeholder that
satisfies a grep — §1 LAW 3's mechanical half is presence, but a trigger that can never fire is the
failure the law exists to stop. Three spot-reads: `loop-hygiene-prd.md` (`status: superseded`) takes
§11's archive leg — *nothing live cites it any more* — which is the only event that can still move a
spent verdict; `model-purpose.md` takes its upstream doctrine changing or ADR-010 revising what
lean-flow adopts from it, both live and external to the doc; `okf-adoption.md` takes an OKF spec
release changing its keep-current verdict. The three `docs/qa/` cases take *the case is re-run* —
`docs/qa/README.md` states Last run / Result are updated in place each run, so that is the trigger that
actually fires most often — or the behaviour under test changing.

`last_updated: 2026-08-24` on the three QA files is the honest value: adding the header **is** today's
update. Backdating them to the 2026-06-21 last-run date would have written a header that trips §3's
own *flag if `last_updated` > 60 days* on the day it was created.

### 2026-08-24 | scope-change | T1 DoD 2 names a check that cannot reach its subject

**What broke.** T1's second DoD reads: *"`docs/qa/QA-001…QA-003` carry the full four-field header —
Verify: `sh scripts/lib/check-doc-caps.sh` still PASSes each, and `conformance.sh` drops all 3
`ownership-header-missing`."* The second half fires and passes. The first half **cannot**:
`check-doc-caps.sh` derives its caps from §2's cap table rather than a hand-list (deliberately —
TD-041), and §2 states **no cap for `docs/qa/`**. The string `docs/qa` appears nowhere in
`spec/STANDARD.md` and nowhere in any checker under `scripts/lib/`. So the three files are outside that
checker's scope by design; it can neither PASS nor FAIL them.

**Impact.** The criterion is *unreachable*, not failed. The checker does run green — `66 PASS, 0 FAIL`,
exit 0 — and that green says nothing whatever about `docs/qa/`. Ticking DoD 2 on the strength of it
would be the L-156 shape precisely: a case that was never reached, scoring as a pass. The subject
itself is verified, but by the *other* half of the clause — `conformance.sh` dropped all 3
`ownership-header-missing` and `S3.SCHEMA` now reports all 222 docs carrying a complete header.

**Re-confirm G2.** No scope moves: the same three files, the same headers, the same work. What changes
is the evidence the tick rests on. Surfaced to the owner rather than reinterpreted quietly, per the
red flag on re-reading a DoD to fit what was built.

**Why it was written that way** — worth recording, because it is the third sighting of one shape.
*"`check-doc-caps.sh` PASSes `docs/qa/`"* is a **structural claim about another artifact**, frozen into
a DoD at promote without ever being queried — L-130/L-136's second grain, after SPRINT-071's `~121`
sites (a figure) and SPRINT-074's *"the checker reads §14's tables"* (a claim about a document). This
one is a claim about a **checker's scope**, which is the same grain against a third kind of artifact,
and it failed the same way: authoring felt like planning, so nothing prompted the second query. A
candidate `L-NNN` at close, not a new rule mid-run.

### 2026-08-24 | progress | T1 Layers gains `docs/knowledge-index.md`; two gate findings cleared

The first gate run printed **`158 pass, 2 fail`** while its runner exited **0** — L-120 exactly, and the
reason the DoD names the *printed verdict line* rather than a status. Read through a wrapper this would
have committed green. Both failures were real and neither was in the doc work:

1. **`knowledge index STALE`.** The generated index carries its own `last_updated`, and T1 wrote a newer
   one onto the three `docs/qa/` files, so the freshness comparison went stale by date. Regenerated with
   `sh scripts/gen-index.sh`; the whole diff is the index's own date line — its *content* is unmoved,
   which is the expected result since ADR-009's index reads `id`/`tags`/`domain`/`status`/`related` and
   never `update_trigger:`. So `docs/knowledge-index.md` is declared on T1's `Layers:` now, per L-100:
   the Plan could not have named a file that is downstream of a date this task had not yet written, and
   a mid-sprint `Layers:` correction is the expected cost of declaring before the work, not a defect.
2. **`layers observed: … changed but undeclared`** naming `.caps.txt`, `.conf-full.txt`, `.conf-t1.txt`,
   `.qa-t1.txt` — **my own mess, not the repo's.** Those were capture files for the conformance and gate
   runs, written to the repo root when they belonged in the session scratchpad. Moved out. Worth the
   line because the check did its job: it caught working residue on its way to a commit, which is the
   one place stray files become permanent.

The two relayed `S6.BASE` lines in the same output are **not** among the 2 — `qa-check.sh` relays engine
findings rather than counting them (SPRINT-075 T2's ruling), so they neither redden this gate nor get
silently dropped. They are T2's subject.

### 2026-08-24 | surprise | TD-078 filed — the template that caused TD-064's `docs/qa/` third

Writing the three `docs/qa/` headers by hand raised the obvious question: where did the gap come from?
`QA-TESTCASE.md.template` ships with **no §3 ownership header**, and it renders into `docs/qa/` — a
tree the engine governs. So every adopter who renders it collects an `S3.SCHEMA` finding the moment the
file lands, for following the template exactly. QA-001…003 lacked headers because the template they
came from had none to give.

Census of the template tree: **6 of 35 lack a leading `---`** — `AGENTS` · `BUG` · `CODE_OF_CONDUCT` ·
`DESIGN` · `QA-TESTCASE` · `README`. `README.md.template` is **not** a defect: §3 states the README
exception in full (ownership moves to a footer line, since a top YAML block renders as an ugly metadata
table). The other four are untriaged, and the row says so rather than guessing — some are plausibly
legitimate intake scaffolding that never lands in a governed tree, and nobody has ruled which.

**Filed as a row, not fixed here** (owner ruling). T1's declared scope is three instances and thirteen
fields; the template lives under `skills/`. Fixing it inside T1 would have widened the task by
expedience and still left the other four untriaged — the judgement is the triage, not the typing.

The asymmetry is what makes it worth a row rather than a Retro footnote: **dogfooding cured the half we
can see while the cause ships unchanged in every `plugin install`.** That is L-015's shape and L-016's
correction together — our own tree is now clean, and reading that as "clean" would be exactly the
mistake, because the consumer path is untouched. Id derived from the ledger maximum and cross-checked
repo-wide before writing (`TD-077` both ways → `TD-078`), never incremented from memory (L-143).

### 2026-08-24 | progress | T1 gate: `159 pass, 1 fail` → both findings closed

Second gate run printed **`159 pass, 1 fail`** — four `FAIL` lines, only one of them counted, and the
arithmetic is the point. `qa-check.sh` relays engine findings as *informational* rather than counting
them (SPRINT-075 T2), so the two `S6.BASE` lines **and** an `S9.VERIFYCLAUSE` line sit outside the
tally. Cross-checked against the run's own ruling line — *"conformance engine: informational except the
two FULLY-COVERED families"* — rather than inferred from the gap between 4 and 1, because two numbers
disagreeing is the finding and guessing which is right is how it gets buried.

Both findings were caused by this task and both are now closed:

1. **`layers completeness` (the counted one)** — T1's DoD prose names `check-doc-caps.sh`, which the
   task **cites** but never touches, and the check said so precisely: *"if the prose only cites it
   rather than touching it, declare it on a `Cites:` line."* Done, with the DoD-2 ruling recorded on
   the same line so the citation carries its own caveat.
2. **`dod-criterion-names-no-check` (relayed, `S9.VERIFYCLAUSE`)** — DoD 5 (`TD-064 → status:
   resolved`) was the one criterion in T1 written **without** a `*Verify:*` clause, so ticking it
   produced a claim with nothing behind it. Not a defect of the work — the row *was* verified — but a
   real defect of the criterion, and exactly the rule's purpose. A proof clause now states what was
   checked. Relayed rather than counted is not a reason to leave it: a named finding left standing is
   the silent false-negative L-058 exists to prevent, and the tally would never have shown it.

Worth noting which way these two point. The gate did not catch a mistake in the sixteen headers; it
caught two defects in **how the Plan described its own verification** — one criterion citing a file it
does not touch, one ticking without evidence. Both were introduced at promote and both surfaced only
once a box was ticked, which is L-105's timing question answering itself: a criterion-quality check
cannot fire until execution reaches the criterion.

### 2026-08-24 | progress | T1 gate green — `160 pass, 0 fail`; all six DoD ticked

Third gate run: **`160 pass, 0 fail`**. The only `FAIL` lines left are the two relayed `S6.BASE`
findings, which are T2's subject and informational by the engine's own ruling.

The intervening run had gone the wrong way, and the reason is worth the entry: **the previous fix
caused the next finding.** Annotating DoD 2 with the ruling introduced two backticked tokens into T1's
prose — a bare caps-checker filename and the QA directory path — and `check-layers-completeness.sh`
reads every backticked file-shaped token in a task's prose as a declaration obligation. So the
annotation manufactured an *implied* file absent from `Layers:`, and adding it to `Cites:` then
manufactured a *second* finding, because a token in both `Cites:` and `Layers:` is a contradiction by
design (the escape must not double as a declaration). Two findings, both mine, neither about the work.

Diagnosed by reading the checker's matching rather than guessing at it: `grep -qxF` on line 145 is an
**exact whole-token** match, so `scripts/lib/check-doc-caps.sh` on the Cites line could never satisfy an
implied bare `check-doc-caps.sh` — the two strings are simply different, and no amount of re-running
would have shown that. The fix was to reword the annotation with no backticked paths at all and revert
the `Cites:` addition; the original DoD text was never a problem, because its own reference carries a
space (`sh scripts/…`) and falls outside the token pattern.

Before re-running, the outcome was **predicted** from the checker's rules — every file-shaped prose
token resolving to `Layers:` or `Cites:`, and no cites token appearing in the layers line — and the run
then agreed. Predicting first is what makes the green meaningful: a gate that goes green after a change
nobody could explain is indistinguishable from a gate that stopped looking.

**T1 complete: 6 of 6 DoD ticked.** Sprint total 6 of 19.

### 2026-08-24 | scope-change | T4 added — the level ladder certifies Attested on an unsigned tree

**What broke.** T2's declaration cleared this repository's last Structural finding, and the report then
read **`level: Attested`**. §13 of the standard says the opposite in as many words: *"Reaching Attested
on this repository requires commit signing, which it does not yet do"* — 673 of 673 commits unsigned —
and *"Attested is not reachable by trailers alone."* So the engine now certifies the top conformance
level against its own standard's explicit text, on this repo and on any adopter's.

**Root cause, derived not guessed.** The ladder consults six counters; the whole engine contains
**exactly one `hold` call site**, `S13.UNSIGNEDCLAIM`, which fires only when an attestation *is*
claimed and the commit is unsigned. A repository that claims **nothing** produces no hold at any level,
so it falls through every rung to the `else` branch and prints Attested. The incentive is inverted:
**claim an attestation honestly and unsigned → held at Gated; claim none at all → Attested.** Silent by
construction, and exactly the theatre §13 says a conformance level exists to prevent.

**Impact.** Latent before this sprint — the repo sat at `level: none`, so the branch was unreachable
and nothing pointed at it. T2 is what made it live, which is why it is being fixed here rather than
filed: closing SPRINT-081 as scoped would ship a reference implementation whose own report overstates
its conformance, and the standard's §13 example is deliberately written to avoid that exact lesson.

**Re-confirm G2.** New task **T4**, owner-approved, sequenced **after T2 and before T3** — the same
reasoning as D1. T4 adds a reported line to every repository's output, so running the foreign-repo
artefact triage before it would measure a report about to change. T4 touches
`scripts/lib/conformance-engine.sh`, shared with T2, so the ordering is also the ownership order.
**Tier G** under ADR-029, inheriting T2's bar: retained fixture on input that must produce the finding,
a sibling control reporting its own denominator, and a seeded-break proof.

Out of T2's scope and out of the frozen Scope's *"Gated and Attested are not in scope"* — that clause
is hereby amended for this one defect, which is a **misstatement about the level**, not an attempt to
raise it. The repo will cap at **Gated**, not climb.

### 2026-08-24 | progress | T2 — `.conformance-exempt` shipped; the rejected arm rejected on a measurement

`TASK-258` · TD-077 · **ADR-031**. Owner chose arm **(a1)**: a root declaration file, one row per line,
`<path> -- <reason>`, joining `.conformance-roles` and `.conformance-tier` as the third declared file.

**A discovery reshaped the spec edit.** `.conformance-tier` appears **nowhere** in `spec/STANDARD.md` —
zero occurrences, checked two ways — and neither does `.conformance-roles`. They are documented together
in README as *"two declared files let a repository state facts the standard says are judged, not
detected."* So the convention already existed and is deliberate: **the spec states which facts are
judged, the engine owns the declaration vocabulary, the README documents it for adopters.** That
settled a question the Plan had left open and made DoD 3 answerable on its own terms — §6 gains the
*rule* (a reasoned exemption is permitted, needs a reason, is named on every report, is local and never
a change to what others owe), not the filename.

**Arm (b) was rejected on a measurement, which is the part worth keeping.** Seeded into a scratch spec,
condition-gating the two Base rows makes both findings **disappear for a repository that declares
nothing**, and the engine then reports *"no unconditional doc is owed at Base"* — the entire tier goes
vacuous. Argued at G2, demonstrated here. The analogy also fails on inspection: every
substrate-conditional row gates on a *material* fact (has code · publishes an artifact · has a DB · has
auth), and "has requirements" is not one — every dev repo has requirements; the only question is whether
they live *here, as a doc*, which is a local judgement and belongs in a declaration.

**A bug in my own code, caught on real input.** The first reason-parser used
`sed 's/^[^-]*--[[:space:]]*//'`, which stops at the hyphen **inside** `acceptance-criteria.md` and
emitted the path as part of its own reason. `requirements.md` has no hyphen and rendered perfectly — so
a fixture family that used only the head of the derived list would have gone green over a live defect.
Fixed with parameter expansion through the first `--`, and the fixture now derives a **hyphenated**
victim on purpose, with a harness guard that fails loudly if no such row exists rather than quietly
testing one thing twice (L-142).

**DoD 3, the literal test.** Re-marking `S6.BASE` to `judgment-only` in a scratch spec took it from 2
FAIL lines to `judgment-required`, **with no code edit** — the SPRINT-074 property, intact. Seeding arm
(b) into §6's own row changed the required set the same way. The spec carries the mechanism.

### 2026-08-24 | progress | T2 seeded-break: the fixtures discriminate, proven twice

Seven new cases went green on their first run, which by L-142 establishes nothing — fixtures and code
written in one session agree by construction. Two targeted breaks, each guarded:

| Seed | Break | Reddened | Siblings |
|---|---|---|---|
| **B1** | accept a reason-less row (`return 2` → `return 0`) | `exempt-reason-missing` **and** `exempt-reason-missing-still-owed` | 5 stayed green |
| **B2** | match the declared path as a **prefix** | `exempt-not-a-prefix` | 6 stayed green |

Each seed was checked before it was trusted: it **applied** (`cmp` against a pristine copy), it still
**parsed** (`sh -n`), and it was **targeted** — line count identical to pristine, `bad`/`note`/`ok`/`hold`
call count identical at 169, diff exactly 2 lines. Restored from the pristine copy under a checked
`sha256` both times.

**The first seed attempt failed to apply, and the guard is why that is known.** `sed 's|…||…|'` against
a pattern containing `||` broke on its own delimiter; the `cmp` check caught it immediately. Without it
the suite would have run against unmodified code, gone green, and been recorded as a passed
discrimination proof — which is L-137's exact failure and indistinguishable from success.

A third seed took the **spec** side: arm (b), the rejected design, applied to a scratch copy (1046 lines
in and out, 2 lines changed) and shown to silence both findings. That one is not a fixture break — it is
the alternative design, priced.

### 2026-08-24 | progress | T2 gate green — `161 pass, 0 fail`; T2 complete, 8 of 8

Five findings on the first T2 gate run, all authored by this task, none in the mechanism itself:

- **`adr-no-negative-consequence`** — ADR-031's § Consequences listed only benefits, and §4 requires at
  least one Negative. The right response was not a token line: the honest negative is that **the
  standard now has a sanctioned way to make a finding go away, and nothing checks whether the reason is
  any good.** The engine verifies a reason is *present*, never *sound* — that half is judged by design.
  A repository can write `-- we do not want to` and get a clean report. Three more went in with it
  (a third declared file is a third thing to know exists; reports grow by a line per exemption; a
  renamed doc silently loses its exemption). The check earned its keep: writing the negatives sharpened
  the decision rather than decorating it.
- **`dod-criterion-names-no-check` ×2** — T2's DoD 6 and 7 carried no `*Verify:*` clause, the same shape
  T1's DoD 5 hit. Both now state what was checked. Third and fourth sighting this sprint of criteria
  written at promote without their evidence; that is a pattern for the Retro, not a coincidence.
- **`layers observed`** — five files changed that no task declared: `.conformance-exempt`, the ADR,
  `DECISIONS.md`, `README.md`, `knowledge-index.md`. All are L-100's case in its purest form — the Plan
  could not name the ADR before the decision to write one, nor the declaration file before the arm was
  chosen. Declared, with that noted on the line.
- **`layers completeness` on T4** — T4's prose references T3 while `Depends-on:` says T2. Correct as
  written: T4 does not depend on T3, it is *ordered before* it. Declared on `Cites:` with the reason,
  which is the escape the checker names for exactly this case.

**A structure-adjacent edit went wrong twice before it went right.** Adding ADR-031's row to
`DECISIONS.md` first landed between ADR-029 and ADR-030, then *above the table separator*, which would
have broken the table while every line-count and grep check stayed clean — L-009's exact shape. Caught
by re-reading the whole structure after each attempt and by asserting two invariants that a
line-oriented check would miss: 31 ADR rows and exactly 1 separator. Noted also that ADR-029/030 were
already inverted in that table before this sprint; left alone rather than quietly reordered.

**T2 complete: 8 of 8 DoD ticked.** Sprint total 14 of 25 — the denominator moved because T4 was added
mid-sprint, so 14/25 is not behind 6/19, it is 6 more tasks' worth of boxes against a larger Plan.

The report now reads **`level: Attested`** in plain sight, which is T4's subject and no longer a latent
branch nobody could reach.

### 2026-08-24 | surprise | the spec bump nothing checks for

Caught **after** the gate went green, not by it: §2's own row for `spec/STANDARD.md` states the trigger
*"a rule is added, amended or reclassified — bump per `spec/CHANGELOG.md`"*, and T2 added a rule to §6.
The standard was still stamped `version: 0.8.0`. Bumped to **0.9.0** (MINOR — additive, no rule
renumbered, no existing finding changed for a repository that declares nothing), with the changelog
entry carrying the rejected arm and its measurement, and `overview.md`'s tree line moved 0.8.0 → 0.9.0.

**No mechanical check enforces this**, which is why a fully green gate said nothing about it. That is
the same class of gap this whole sprint keeps meeting — a rule the standard states about itself with
nothing behind it — and it is worth a Retro line rather than a mid-sprint fix: a `S2` assertion
comparing the spec's `version:` against the newest block in `spec/CHANGELOG.md` would catch the missing
changelog entry, though not the missing *bump*, since nothing can tell an amended rule from a typo
without reading the diff. Naming what a check could and could not do is the honest half of filing it.

### 2026-08-24 | progress | T4 — the ladder stops certifying Attested on an unsigned tree

One branch, `note` → `hold`, in `assert_S13_TRAILERS`' absent-attestation case. This repository now
reports **`level: Gated`**, naming `attestation-absent`, where it read `Attested` an hour ago — with
**exit 0 and 0 FAIL lines**, because a hold is not a failure: §14 says a report states a level honestly
reached and not exceeded, and declining to claim an attestation breaches nothing. TD-079 filed and
resolved in the same sprint.

**The fixture that should have caught this existed, and passed for its whole life.**
`no-claim-is-not-approval` asserted the finding's *text* — `no attestation claimed` — and never asked
what that finding did to the level. Three new level-aware cases now sit beside it, mirroring the shape
case 1 already used for the *claimed-and-unsigned* path: the two facts are different and must reach the
same level. The fourth reports its own denominator (`1 level line examined, 0 of them Attested`) so a
case that was never reached is visibly untested rather than quietly green (L-156).

**The seeded break proved exactly that criticism.** Reverting the hold reddened all three new cases —
and `no-claim-is-not-approval` **stayed green**, because the finding's wording is unchanged by the
seed. That is the clearest possible statement of the defect class, and it is why TD-079 records the
generalisation rather than the instance: *a fixture that asserts a finding's wording is not asserting
its consequence.* All four `unsigned-` sibling controls stayed green throughout.

Seed guards, all four: applied (`cmp`), parses (`sh -n`), targeted (3111 lines in and out, 169
`bad`/`note`/`ok`/`hold` calls unchanged, anchored `hold` call sites 2 → 1, diff exactly 2 lines),
restored under a checked `sha256`.

**A substring trap on the way past, worth the line because it nearly became a claim.** Counting hold
sites with `grep -c 'hold "'` returns **3**, not 2 — `_s10_threshold "` contains `hold "`. The earlier
diagnosis happened to read the two matches individually and identify the false one, so the conclusion
*"exactly one hold call site"* was right; but it was right by inspection, not by the count. The metric
above is anchored (`^ *hold "`) so the number is trustworthy without the reading.

**And a bookkeeping error of my own**, recorded because the sprint file is the artifact people trust:
the `*Verify:*` clause for the TD-row criterion was appended to the **seeded-break** line — an
off-by-one from reading a `sed -n` range display as absolute line numbers. Both lines are now correct.
Caught by re-reading the structure after the edit, which is the only thing that catches it: every
line-count and grep check stayed clean while the wrong criterion carried the wrong evidence (L-009).

### 2026-08-24 | progress | T3 — the triage re-run at 45 rules: 9 findings, 9 actionable, 0 artefacts

`TASK-238` · EPIC-004 § Closed-when 1. **A3 re-derived from the engine source before anything else**,
the way SPRINT-079's promote re-derived the §6 disjunct rather than reading it off a summary: all three
shape-bound families are genuine assertions, not registrations — `assert_S6_{BASE,BACKEND,MEDIUM,MULTISVC}`
(4), `assert_S11_*` (8), `assert_S2_F_FILE` + `assert_S2_R_PLACEMENT`. Cross-checked against the
engine's own `coverage:` line: **45 `assert_` functions defined, 45 reported.**

**Verdict: 9 findings across 5 rules, 9 actionable, 0 artefacts.** Reconciled three ways because the
comfortable number is the one to distrust — per-rule tally 4+2+1+1+1 = 9 = the report's own FAIL count;
5 distinct rules, agreeing with the harness's independently computed *"5 failing rule(s) across 9
finding line(s)"*; no finding left unattributed. **My first rule count said 8**, from grepping finding
*slugs* rather than rule ids — caught by the disagreement with the harness's number, not by re-reading
my own query. That is the cross-check rule doing exactly the job it was promoted for.

**`0 artefacts` now means something.** At 6 of 62 rules it was a number nobody had earned, and EPIC-004
said so in its own exit condition — *honest but early*. At 45, across the three families most likely to
leak our directory shape, it is a measurement. That distinction is why the row was parked on a
**condition** rather than a date (L-094), and the condition is what discharged it.

**The finding worth keeping is about T2, and only T3 could see it.** The two `S6.BASE` rows on the
stranger's report are exactly the pair T2 made answerable. Before T2 a stranger whose requirements live
in a ticket tracker collected two permanent findings clearable only by writing two docs they had judged
unnecessary; they can now declare a reasoned exemption and have it named with its reason. **The finding
did not go away and should not — what changed is that it became answerable by a decision rather than
only by a document.** lean-flow could not have learned this by dogfooding, because it fixed its own two
rows in the same sprint. That is L-016's asymmetry exactly, caught on the consumer path.

**Where the round went, and why the parent doc did not grow.** `conformance-coverage.md` stood at **129
of 130 lines**, so Round 4 went to `docs/research/logs/conformance-coverage.md` — §2's `research/logs/`
row, created lazily on a second measurement round, uncapped by design (ADR-014's mechanism applied
outside `docs/sprint/`). Rounds 1–3 are **not copied** into it; they stay in the parent, because a
figure copied into a second place drifts from the one it copied (L-108). The parent gained a single
pointer line and now sits at exactly 130.

**TASK-238 is CLOSED, not re-parked.** The question it guarded has been asked properly and answered.
Its Backlog row is pruned at sprint close alongside T1's and T2's, which is where `S11.BACKLOG` expects
that to happen.

Three things this round explicitly does **not** claim, recorded so a later reader does not over-read
it: 6 engine gaps remain unchecked and say nothing about a stranger; `S2.R-PLACEMENT` still cannot see
a near-miss (`docs/architecture.md` vs `docs/architecture/overview.md`), a limit carried from Round 3;
and the stranger has **no git history**, so T4's new `attestation-absent` hold never fires for it. A
git-backed adopter carrying no trailers does collect that line — held at Gated, exit code unmoved —
and that case is untested against a foreign repo. It is Round 5's question if anyone asks it.

### 2026-08-24 | run-complete | run · 25 of 25 DoD ticked

**SPRINT-081, four tasks, all green.** Gate `161 pass, 0 fail`. Conformance `level: Gated`, one held
finding (`attestation-absent`) naming honestly what this repository has not claimed.

| Task | DoD | Outcome |
|---|---|---|
| T1 `TASK-257` | 6 of 6 | 16 ownership headers; `S1.LAW3` + `S3.SCHEMA` cleared; TD-064 resolved, TD-078 filed |
| T2 `TASK-258` | 8 of 8 | `.conformance-exempt` + ADR-031 + spec 0.9.0; TD-077 resolved |
| T4 (added) | 6 of 6 | the level ladder stops certifying Attested on an unsigned tree; TD-079 filed and resolved |
| T3 `TASK-238` | 5 of 5 | triage re-run at 45 rules: 9 findings, 9 actionable, **0 artefacts**; TASK-238 closed |

Nothing parked, nothing unattempted, no blocker. The Plan grew by one task mid-sprint (T4, owner-ruled,
scope-change logged before § Plan was edited) so the denominator moved 19 → 25.

**This repository now passes its own standard's Structural bar**, which is what the theme asked for —
`level: none` → `Gated`, and the one thing still between it and Attested is commit signing, which §13
says in as many words and which nobody has claimed otherwise.

**The pattern this run kept meeting, for the Retro.** Every gate failure but one was a defect in *how
the Plan described its own verification*, never in the work: four criteria ticked without a `*Verify:*`
clause, four `Layers:`/`Cites:` declarations that execution invented and the Plan could not have known
(L-100), and three annotations of mine that manufactured findings by putting backticked file-shaped
tokens into prose the layers checker reads as declarations. The checks were right every time. The
recurring authoring miss is worth an `L-NNN`, and TD-078/TD-079 already carry two halves of the same
family: a template that ships a doc which cannot pass, and a fixture that asserts a finding's wording
rather than its consequence.

Next: `/lean-doc-generator close` — Retro, four-bucket routing, `close_commit`, Backlog pruning for
TASK-238/257/258, and the version bump (feature sprint → MINOR by hand; `/release-patch` is PATCH-only).
