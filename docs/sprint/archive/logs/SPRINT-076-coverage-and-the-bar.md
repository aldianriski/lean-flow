---
sprint: 076
slug: coverage-and-the-bar
owner: Maintainer
last_updated: 2026-08-20
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-076 — Execution Log

> Append-only companion to [`../SPRINT-076-coverage-and-the-bar.md`](../SPRINT-076-coverage-and-the-bar.md).
> Uncapped by design: this file grows with the work done, which is exactly why it is not inside the
> Plan's 400-line budget (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new
> one.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.

<!-- Newest entries at the BOTTOM: this reads as a chronology, unlike CHANGELOG.md which is
     newest-first. Event is one of: promote · progress · surprise · scope-change · park · blocker ·
     run-complete · close. `run-complete` is reserved for the run itself finishing (carries the
     Part 4 rollup) — a task finishing mid-run is logged as `progress`, never as `complete`. -->

### 2026-08-20 | promote | G1 + G2 signed @ 641036f — four findings from gate recon, three of which bind

Gates signed attended, batch pass over all five tasks. `gates_signed: G1,G2 @ 641036f` stamped and
verified by reading `S9.GATESWELLFORMED`'s own printed verdict line, not an exit code (L-120).

**Assumptions verified at the gate rather than deferred to their tasks:**

- **A1 ✓** — all seven published finding names are present in `docs/research/conformance-dispositions.md`
  § build (lines 66–74). The register is a contract to audit against, as A1 assumes.
- **A2 ✓** — 27 ADRs, counted from the engine's own `S3.SCHEMA` exemption line rather than from a
  directory listing, so the number comes from the thing that will consume it.
- **A5 ✓ (early, and cross-checked)** — baseline coverage is **6 of 62** checkable rules. Two
  independent derivations agree: six `assert_*` functions in `conformance-engine.sh`, and the engine's
  own `coverage:` line printing `6 … 56 unchecked`. 6 + 5 (T2) + 2 (T3) = **13**, so A5's arithmetic
  holds. Its DoD-mandated re-derivation at T3's close still runs — this is a second confirmation, not
  a substitute (L-130 · L-136).

**F1 — the register's `scope-out` denominator is off by one, and T1's DoD 3 would have hit it.**
§ scope-out is headed *"12 checkable rules"* and its para (b) reads *"(5)"*, but `S2.R-GROWTH` is
marked **`judgment-only`** in `spec/STANDARD.md` §2 line 253 — so it was never in the checkable set.
The real count is **11**. Corrected, the register reconciles *exactly* against the engine:
12 covered + 39 build + 11 scope-out = **62**, which is the engine's own checkable count
(6 asserted + 56 GAP). Uncorrected it reads 63.

Found the way L-108's sightings are always found — by a second number disagreeing, never by recalling
the rule. The section headers for `covered` (12) and `build` (39) were both re-counted from rule ids
rather than rows, since two rows carry four ids each; both headers are honest. Only `scope-out` is
wrong. **Owner ruling: fold the fix into T1**, which already owns the reconciliation.

**F2 — D3's shared-file ownership map is missing a writer.** D3 names T2 and T3 on
`scripts/lib/conformance-engine.sh`; **T5's `Layers:` declares that same file** ("cite the rows instead
of carrying the rulings in comments"), and `docs/research/conformance-dispositions.md` likewise. Three
writers, not two. Corrected ownership order, binding for the run:
**T2 owns and lands first → T3 appends → T5 appends**, per-hunk staging (`git add -p` + verify
`git diff --cached`) on every shared file (L-042 · L-037).

**F3 — T1 is declared `depends-on: none` but audits the corpus T2 and T3 extend.** Run in the Plan's
presented order its fixture gap list goes stale before T4 consumes it, and T4's DoD 1 names that list
as one of the three numbers its ruling rests on. **Owner ruling: sequence T1 late** —
`T2 → T3 → T5 → T1 → T4`. No § Plan edit: every one of T1/T2/T3/T5 declares no dependency, so
ordering among them is the coordinator's call under step 3, not a scope change.

**F4 — T5's DoD 2 verified, and understated.** Exactly **12** `ownership-header-*` findings across
exactly **12** distinct `docs/strategy/adlc/` files (both numbers derived separately and agreeing).
The same §3 exception also drops **12** `update-trigger-absent` findings on those same files, so the
honest total is **24 findings across 12 docs**. The DoD as written is satisfiable and true; T5 should
report the larger number rather than stopping at the one the DoD names.

**A question T4 does not need to ask, resolved by reading rather than parking (L-094).** EPIC-004
§ Closed-when 2 reads *"maps to a check"*, not *"has an assertion in the engine"* — so the denominator
is the register's **12 covered today** (any checker), not the engine's 6. T4 rules against
**19 of 62** after this sprint, not 13. Noted also for T4: that same section still says
*"**42** rules dispositioned `build`"* while the register and SPRINT-075's member row both say **39** —
a stale figure inside the section T4 edits.

**Skill freshness — `/prime` reported STALE and it is benign here.** All **33** skill files in the
installed 1.48.0 cache are byte-identical to the repo modulo CRLF; v1.49.0 bumped the manifest for
SPRINT-075's engine and docs without touching a skill. The row is correct by its contract (it compares
version strings, ADR-scoped to that) and the procedure risk this session is nil — checked rather than
assumed, because L-021 has two sightings of exactly the opposite.

### 2026-08-20 | progress | T2 — the §4 ADR family lands; five rules, 12 retained cases, 10 seeded breaks

Built test-first: fixtures and harness written and confirmed **12 of 12 red** before a single assertion
existed, so the suite was never in the position L-137 warns about — green by construction because
fixtures and code were authored together.

**What ships.** Five assertions in `conformance-engine.sh`, firing the five names
`conformance-dispositions.md` § build already published — consumed as a contract, not invented to
match the code (L-058). Four are Structural; `S4.APPEND` is the family's only Gated rule and the
engine's first to read **history** rather than the tree.

**The discriminator for `S4.APPEND`, which was the task.** What is compared is the **§ Decision body**
at the deciding commit against the same section at HEAD. Everything §4 permits after a decision —
`deprecated`, `superseded by`, a `Scope amended by:` bullet — lands in the *header*, so the permitted
path passes without being enumerated. Verified on the hardest available corpus, our own: **27 ADRs,
all green**, including ADR-008 and ADR-027, whose post-decision markers DoD 3 names explicitly.
`git show 48d68b9 -- ADR-027` confirms the mechanism rather than the outcome — that commit adds only a
header bullet and leaves § Decision untouched.

**Three failures worth recording, none of which review would have caught.**

1. **A splice that silently did not apply.** The awk inserting the assertion block took its path
   through `-v ins=<Windows path>`; the backslashes were eaten as escape sequences, getline read
   nothing, and the engine came back **byte-identical at 657 lines**. `sh -n` said `SYNTAX OK`, which
   reads exactly like success. Caught only by comparing the line count against pristine — L-137's
   "verify the seed landed", firing on a *feature* patch rather than a seeded break.

2. **A `sed` that deleted 4 of 5 rows and looked complete.** Moving the family `build` → covered, the
   pattern assumed every §4 finding began `adr-`. `S4.INDEX` fires `decisions-index-missing-adr`, so
   its row survived and the register would have claimed 34 while holding 35. Caught by re-counting
   **rule ids** (not rows — two rows carry four ids each) and reconciling against the header. Both
   sections now agree with a fresh count: **17 covered · 34 build**, and with T1's corrected
   scope-out of 11 that totals **62**, the engine's own checkable count.

3. **The seeded-break harness produced a false green — the one that matters most.** The
   `negative/negative-present` seed used `s|…|…|` while the target line contains a pipe
   (`_adr_section Consequences < "$f" | grep -qi 'negative'`). `sed` errored, wrote an **empty**
   engine, and every guard passed it through: `cmp` saw a difference and called the seed landed,
   `sh -n` accepted it because *an empty script is valid shell*, the suite went red, and the case
   scored `DISCRIMINATES`. It proved nothing. Caught by reading the `sed:` error on stderr, **not** by
   the pass's own verdict line — the check designed to catch this class had the class inside it.
   Re-run with a comma delimiter and two added guards (line count sane · all five assertions still
   present, so a break is targeted rather than a demolition): the case now reddens while
   `clean-repo-passes` stays green.

**Seeded-break pass: 10 of 10 discriminate** — three for `S4.ONEFILE`'s three distinct claims
(filename pattern · duplicate number · stray outside `docs/adr/`), two for `S4.INDEX`, one each for
`S4.SECTIONS` and `S4.NEGATIVE`, three for `S4.APPEND` (the comparison, the no-git branch, the
shallow-clone branch). Engine restored and verified against a hash **recorded independently before
the run**, not merely the script's own self-check: `82fe7200…8738b`.

**A false positive found by running against the real repo, not by review.** `S4.ONEFILE`'s stray scan
first walked the whole checkout and returned **12 findings — every one a fixture directory** whose own
`docs/adr/` is canonical relative to its own root. Now scoped to the doc tree (`docs/`, minus
`docs/adr/`) plus the repo root: §2 places documentation under `docs/`, so an ADR-named file inside
the doc tree but outside `docs/adr/` is unambiguously misplaced, while one under `evals/` or `tests/`
is test data this rule was never given. An adopter with fixtures would have hit the identical noise
(L-016 — verify on the consumer path, not only on our own dogfooding).

**Owner ruling — registration, asked rather than assumed.** DoD 4 says the always-on set; TD-016's
declared cost rule routes **git-repo-building** harnesses to opt-in, which is why the 34s
`run-attestation-fixtures.sh` sits there. This one builds three repos and costs **27s** (against 13s
for the no-git `run-ownership-header-fixtures.sh`). Ruled **always-on as a deliberate exception**,
with the reason recorded beside the list: the §4 family is the first coverage this repo can check
against *itself*, and a wrong `S4.APPEND` reddening our own two amended ADRs is something to learn on
every run, not whenever someone remembers an opt-in harness.

**`Layers:` corrected, per L-100.** The completeness leg found T2 declaring
`docs/research/conformance-dispositions.md` as both touched and merely cited, and
`check-attestation.sh` implied by the DoD prose but undeclared. `Cites:` now carries
`check-attestation.sh` and drops the register, which T2 genuinely edits. A live declaration corrected
per task, not a frozen prediction defended.

### 2026-08-20 | progress | T2 — the completeness leg's last finding was a rule id read as a filename

After `check-attestation.sh` was declared, the leg still failed on **`S4.APPEND`** — matched by the
file-shaped token regex (`name.EXT`) even though it is a conformance rule id, not a file. That is
**TD-057's** subject (`Layers:` matched by token spelling across three checkers with no stated
contract), and this sprint's § Scope puts TD-048/TD-057's matcher work explicitly **out**, to be
priced as a batch. So the checker was left alone and the rule id declared on `Cites:` — the escape the
checker's own message names, and the pattern SPRINT-075 T6 already used for `` `S7.PERSON` ``.
Recorded rather than silently worked around: the finding is a false positive in the matcher, and
paper over enough of those and the leg stops being read.

**Gate: `QA-CHECK: 160 pass, 1 fail` → clean after the fix.** Read from the gate's own printed tally,
not from an exit code — the run before it reported `[exited with code 0]` while its own line said
`2 fail`, which is L-120's shape verbatim.

**One process note against myself.** An earlier gate run was invalidated mid-flight because I ran
`git stash`/`stash pop` to compare PASS lines while it was reading the tree. The result was discarded
and the gate re-run with nothing else touching the working tree. A long check reads the tree for its
whole duration, so the tree is not free to move underneath it — the same reasoning as L-042's staging
rule, one level up: the artefact under measurement has to hold still.

### 2026-08-20 | progress | T3 — §2's placement pair, and the artefact question finally answered

Test-first again: 5 of the 6 rule cases proven RED before an assertion existed. The sixth
(`no-placement-finding-on-documents-s2-never-named`) passed **vacuously** at that point — a rule that
does not exist cannot raise a finding — and is recorded as a case that could not be red-first; the
seeded-break pass is what earns it.

**Spec-driven, not hard-coded.** The required set is derived at runtime from §2's own `Create ←`
cells: the **nine** rows whose trigger says *"always"*. Every other row is tier-gated, and §2 routes
tier DETECTION to `S2.F-TIER`, which §14 marks a split whose detection half is judged (§6) — so
requiring a conditional row would be this engine guessing a tier the standard explicitly declines to
infer. Two parser traps, both guarded: §2's own **Conformance** table sits inside §2 after the `docs/`
marker and its Rule cells parse as File cells (`docs/S2.F-FILE` — 21 invented core files);
`check-doc-caps.sh` escapes that only by accident, since it discards rows with no integer Cap. And
Cap/Create sit at different column indices in the docs tree than in the root tables.

**The spec reading for `S2.R-PLACEMENT`, stated because it was ambiguous.** §2's parenthetical says
R-PLACEMENT carries the legacy-path second-match rule *"which `S2.F-FILE` does not — a repo on a
legacy layout satisfies one and not the other"*. Only one reading makes that sentence true **and**
matches the published finding name: legacy paths are **tolerated** by R-PLACEMENT (matched second,
and named in the report rather than applied silently), while F-FILE is strict about the canonical
path. R-PLACEMENT therefore fires on a doc at **neither** canonical nor legacy —
`file-outside-canonical-placement`, exactly as the name says. A retained case asserts the separation
directly, because a run where both rules agree has collapsed two rules the standard drew apart.

**A latent engine defect under a fifth of the rule set.** Both new rules reported `rule-unimplemented`
with their assertions sitting in the file. The driver builds the function name with `tr '.' '_'` — the
dot is mapped, **the hyphen is not** — so `S2.F-FILE` looked for `assert_S2_F-FILE`. Every rule
covered before T3 happened to have no hyphen in its id; **21 of the spec's 100 ids carry one**, so
this was waiting under all of them, failing silently and green (L-058's shape). Verified
collision-free before changing — all 100 ids stay distinct under `tr '.-' '__'` — and the seeded-break
pass reverts the fix as a case, so the guard is retained rather than a one-time repair.

**A false positive the PASS control caught and the must-FAIL cases could not.** R-PLACEMENT reported
root `CHANGELOG.md` as a misplaced `spec/CHANGELOG.md`: two §2 rows share a basename, and the root
file was sitting exactly where its own row puts it. All must-FAIL cases stayed green throughout — only
the conformant-repo control reddened. The matcher now excludes every path §2 itself names, canonical
or legacy, for any row.

---

**DoD 2 — the triage, one row per finding.** Stranger = the four-file `acme-widget` JS library, built
from nothing. **10 findings: 6 actionable, 4 artefacts.**

| # | Finding | Verdict |
|---|---|---|
| 1 | `update-trigger-absent: docs/architecture.md` | actionable (pre-existing, SPRINT-075) |
| 2 | `ownership-header-missing: docs/architecture.md` | actionable (pre-existing, SPRINT-075) |
| 3 | `core-file-missing: SECURITY.md` | **actionable** — a published library owes a disclosure route |
| 4 | `core-file-missing: CHANGELOG.md` | **actionable** — a versioned npm package owes one |
| 5 | `core-file-missing: docs/architecture/overview.md` | **actionable** — see the near-miss note below |
| 6 | `core-file-missing: docs/development/setup.md` | **actionable** — arguably served by the README's `## Install`, but a real gap |
| 7 | `core-file-missing: AGENTS.md` | **ARTEFACT** — §2 defines it as a thin pointer to `.claude/CLAUDE.md` |
| 8 | `core-file-missing: TODO.md` | **ARTEFACT** — the lean loop's backlog *mechanism*; a repo on GitHub Issues has a backlog |
| 9 | `core-file-missing: .claude/CLAUDE.md` | **ARTEFACT** — a Claude Code artifact |
| 10 | `core-file-missing: .claude/CONTEXT.md` | **ARTEFACT** — same |

**A4 is confirmed, and SPRINT-075's "0 artefacts" is now readable for what it said it was.** That run
recorded itself as *barely asked* — six of 62 rules, none shape-bound. Asked properly, the number is
**4 of 8 new findings**. The four share one property: they are lean-flow's own loop surface, not
repository structure. §2's unconditional set mixes two populations and does not say which is which.

**`S2.R-PLACEMENT` produced 0 artefacts, and the bound that earned it is recorded as a limit.** It
matches by **basename**, so it cannot reach a document §2 never named — a stranger's
`notes/design-notes.md` raises nothing. The cost: the library's `docs/architecture.md` is plausibly
the same document as `docs/architecture/overview.md`, and only F-FILE reports it, as an absence rather
than a misplacement. Widening to fuzzy matching buys one better finding and an unbounded artefact
surface, so the near-miss stays a known limit.

**DoD 3 — owner ruling: record it, ship faithful.** The engine is **not** tuned to look quiet. A
checker that narrows a rule the standard states is deciding a question the standard owns — the
inversion L-058 keeps naming — and it would hide the very finding this triage exists to produce. The
register gains a **§ Artefacts** section carrying the table above; the real fix is a **spec** change
(§2 marking loop rows apart from universal ones) filed as **TASK-243**. Retained mechanically, not
just written: `run-foreign-repo-fixtures.sh` now applies every *actionable* finding and asserts the
remainder is **exactly** those four, so when the spec is fixed the case reddens and forces a
re-triage instead of the artefacts quietly becoming permanent.

**Two of that harness's own criteria went stale under the new coverage — logged, not quietly re-read
(L-088).** `findings-name-files-that-exist` asserted every FAIL names a file the target *has*, which
`core-file-missing` cannot satisfy by definition; the surviving criterion is *names a path the
standard owns* — in the tree, or a §2 canonical path. And `gaps-not-counted-against-the-stranger`
equated the level's count with the FAIL-**line** count, true only while every rule emitted at most one
finding; `core-file-missing` emits eight from one rule. The level counts failing **rules**. What both
cases were actually guarding is unchanged and still asserted.

**DoD 4 — TASK-238 re-parked, not discharged.** Its trigger names three families: §2 placement, §6
tier doc-sets, §11 ledgers. T3 delivered **one**. The row records the §2 third as done with its result
and narrows the unblock condition to the remaining two, noting that §11's pair is covered today by
standalone checkers that never run against a foreign tree. Ticking it on one of three would be the
drift L-088 names.

**A near-miss on the task id, caught by a second look.** The register first said the spec fix was
filed as `TASK-241`. TASK-241 is T3's **own** backlog twin — the ids in play are 237 (T5), 239–242
(T1–T4) — so the follow-up would have pointed at itself. Corrected to TASK-243 after checking the
maximum id actually in use rather than assuming the next number.

**Seeded-break pass: 6 of 6 discriminate**, engine restored under a hash recorded independently
beforehand (`f0a9cc3d…c089`). Guards added after T2's false green: the patch must change something,
still parse, and still be a **targeted** break — all seven assertions present and the line count within
one of pristine — so a demolition can no longer score as discrimination.

**Coverage 11 → 13 of 62.** A5 predicted 13 (6 + 5 + 2) and it is re-derived here from the engine's own
`coverage:` line at T3's close, as its DoD requires, rather than trusted from the Plan.

### 2026-08-20 | progress | T3 — a third harness went stale, and the gate is the thing that said so

`run-conformance-engine-fixtures.sh` reddened after T3 landed. Its driver fixtures were bare
directories, so `S2.F-FILE` reported 8 missing core files against them — **correctly**. The two cases
that broke (`rule-unimplemented-is-named` · `gap-is-labelled-gap-and-does-not-set-exit`) assert that
GAP lines do not set the exit code; they had been able to assume no implemented rule would ever object
to a directory's *contents*. Quietening the new rule to keep an old fixture green would be the tail
wagging the dog, so the fixtures now carry §2's core set instead — derived from the spec by the same
awk the engine uses, so a §2 row that stops saying "always" changes both sides in one edit.

One further detail the run caught: written with a YAML header, `AGENTS.md` tripped `S3.AGENTS`. §3
exempts it *because* it is a thin pointer — a 6-line block would defeat a ~10-line file — so it takes
the footer `<sub>` form. 16 of 16 driver cases green.

**Three harnesses needed a criterion revised by this one task** (foreign-repo ×2, driver ×2). That is
the shape worth noticing, not the individual fixes: adding the engine's first rule about a file's
ABSENCE invalidated assumptions that were invisible while every rule spoke only about files that
exist. None of them was found by review; each was found by a gate that ran.

**A soft cap crossed, reported not silently absorbed.** `docs/research/conformance-dispositions.md` is
now **200 lines against a 130 soft cap** (it was already 173 before T3; § Artefacts added 27). Soft
means report-at-governance-review, not a gate failure — flagged here for the promote/close doc-aging
pass rather than pruned mid-task, since the register is the artefact T1 and T4 both read next.

### 2026-08-20 | progress | T5 — §3's two enforced-but-unwritten exceptions, and a fixture that proved nothing

Both exceptions were being **enforced in code while absent from the standard**, which is the wrong way
round: a rule a checker applies and the spec does not state is unreviewable, and an adopter reading §3
could not have predicted either. Spec **0.4.1 → 0.4.2**, PATCH.

**The ADR exception** was already ruled (SPRINT-075 T6) and already named in every report; T5 moved the
*ruling* into §3 and rewrote the engine's comment to **cite** the standard. That direction is the
point of the task — the checker stops being the place the question is settled.

**The exploratory-tree exception is a declaration, not a path**, and that was the design call. §3 now
says a tree is outside §3 when its own index/README frontmatter carries `governed: false`. Hard-coding
`docs/strategy/` would have exempted only repositories that happen to use our directory names — the
repo-specific leak a generic checker must never carry (L-015). Two properties make it safe to state
rather than merely tolerate, and both are asserted: it is **opt-in** (silence still means governed, so
nothing is exempted by accident) and **visible** (the declaration sits in the tree it exempts).

**DoD 2 verified with the number the gate predicted.** Findings **56 → 32**, a drop of exactly **24
across the 12 `docs/strategy/adlc/` docs** — 12 `ownership-header-missing` + 12
`update-trigger-absent`. F4 at the G2 gate had flagged that the DoD names only the ownership half and
that the true drop would be 24; it is 24. The remainder reconciles internally: **3** header-missing
(all `docs/qa/`) + **13** field-missing (all `docs/research/`) = **16** `update-trigger-absent`, the
union. Three numbers agreeing, which is the only check that has ever caught a miscount in this corpus.

**A fixture that proved nothing, caught by the seeded break and nothing else.** The
`governed-false-in-prose-does-not-exempt` case is the one that bounds the whole exception — without
it, `governed: false` is a phrase anyone can type into a paragraph to silence a finding, and any doc
*documenting* the exception (including §3 itself) would exempt its own tree. Its first draft wrote the
prose as ``so `governed: false` ought to apply``, which never starts at column 0, so the regex missed
it **with or without** the frontmatter bound. Seeding the bound away left the case GREEN: it was
asserting nothing. Rewritten so the body carries a fenced `yaml` block with `governed: false` at
column 0 — the realistic shape, since that is exactly how a doc explains the syntax — and the seed now
reddens it.

This is the **third** time in this sprint that a case looked green while testing nothing (T2's empty
engine, T3's vacuous stranger control, this), and all three were found the same way: by breaking the
thing on purpose and watching what failed to notice. Worth a promotion candidate at close — the
existing rule says *seed a break per assertion*, and what earns its keep is narrower and sharper:
**a fixture whose seed does not redden it is not a passing test, it is an absent one.**

**DoD 4 — TD-064 halved by ruling, not by writing 12 headers**, and deliberately left **open**. Its
own mitigation named the two honest options for the ADLC tree — add headers to docs we have
deliberately parked, or decide the tree is not governed and say so where §3 can be read. The second
was taken. The 3 `docs/qa/` files and 13 research docs remain a real finding and the row says so,
rather than being closed wholesale on the strength of the half that was ruled away.

**On the PATCH call (DoD 3), stated rather than glossed.** The DoD's reasoning is that neither
exception adds an obligation, so no adopter is asked to re-read the standard — and §3 still publishes
exactly 3 rules, which is the mechanical check on that claim. The tension worth recording: the
exploratory exception *removes* an obligation, and a report that used to name a doc no longer does.
Nothing an adopter satisfies today breaks, so PATCH holds as the DoD wrote it; the observation is
logged rather than used to re-read a frozen criterion (L-088).

### 2026-08-20 | surprise | T5 — the gate stopped finishing, and the cause was process count, not work

Two gate runs were killed before printing their tally, and a third exceeded a ten-minute foreground
limit. **Not a hang and not a hang-shaped bug** — the engine had become 20× slower, and the gate
invokes it roughly fifty times across its harnesses.

Measured rather than guessed, by timing each rule family in isolation against a **four-file**
directory: `S1` 808 ms · `S3` 912 ms · `S4` 1,396 ms · **`S2` 11,253 ms**. The whole cost sat in one
family, and inside it in one shape: `S2.R-PLACEMENT` ran a full `find` **per §2 row whose canonical
path was absent**. Against a bare directory every one of the ~31 literal rows is absent, so a single
run walked the tree 31 times. Caching the walk (one `find`, reused) took it to 18 s — still 18× the
baseline, because the second version still spent a `while read` subshell plus two greps per row:
**~124 process spawns to examine four files.** Process creation is the cost on this platform, not the
scanning.

Rewritten as **one awk pass** over (rows × file list), with existence tested as membership in the
cached list rather than a `[ -e ]` per row: **29 s → 9.6 s** on the fixture dir, **77 s → 49 s** on
this repo, and the gate finishes again — `QA-CHECK: 163 pass, 0 fail`.

**This is the second sighting of the same shape.** SPRINT-075's ownership family spawned ~2,800 awk
processes (a walk per rule, an awk per field per doc) and was fixed the same way. The engine's cost
model is now explicit in the code comment so the third person does not rediscover it: **walk once,
then decide in one pass.** Worth a promotion candidate at close (count 2).

**Correctness was re-checked, not assumed, after each of the three rewrites** — a performance change
that quietly alters a verdict is worse than a slow gate. `S2.F-FILE` and `S2.R-PLACEMENT` both still
PASS against this repo with no `CHANGELOG.md` false positive, and all five engine harnesses are green.
One near-miss worth recording: the middle rewrite deleted the `_s2_named_paths` assignment along with
the block it lived in, leaving the awk reading an **empty** exclusion set — which would have silently
resurrected the two-rows-share-a-basename false positive. Caught by grepping for the variable's
occurrence count (1, expected 2) rather than by the suite, which was green either way at that moment.

### 2026-08-21 | progress | T1 — the fixture audit: 24 of 24 checks, 16 of 19 identities, and why the condition still does not tick

**The deliverable is a list, and that was the whole point.** SPRINT-072 measured the corpus — 22
harnesses · 98 cases · 46 named findings — and none of those numbers answers *"does **every** check
have one"*. A count tells you how much guarding exists, never whether any particular check is guarded.
Record → `docs/research/fixture-coverage-audit.md`.

**Enumerated from disk**: `ls scripts/lib/check-*.sh` (11) + `grep '^assert_' conformance-engine.sh`
(13) = **24 checks**. All 24 guarded.

**The audit is itself a query, and it failed green twice before it was right** — both recorded in the
record, because this is the class L-108 names and it does not stop being it when the query is an audit:

1. **The first name-extraction reached 5 of 12 files.** `grep 'bad "<name>:'` matched only the
   checkers using that exact message shape; the other seven emit through `printf 'FAIL …'` or carry
   the name mid-message. The census looked clean while examining under half the corpus. **The finding
   naming convention is not uniform across the 11 standalone checkers** — a fact about the corpus,
   surfaced by the query that broke on it.
2. **`reader-missing` read as guarded and is not.** A name-grep over `evals/` hit
   `run-conformance-engine-fixtures.sh` — line 185, inside a **comment** explaining why a case for it
   would prove nothing. The corpus documents its own finding names, so a grep over it eventually
   matches prose *about* the thing. Caught by opening the hit rather than counting it.

**The cross-check that DoD 3 asks for did its job.** Counting `bad "` prefixes gives **14**; itemising
identities gives **19**, because `conformance:` covers four and `gates-signed:` covers three (two FAIL
branches plus the note-only *NOT SIGNED* state). The two numbers disagreed, and the difference was
exactly the five identities hiding behind two prefixes. Final: **16 guarded + 3 unguarded = 19** ✓.

**One gap was repository-facing, so it was closed here** (DoD 2 allows `evals/` for exactly this):
`gates-signed: unrecognised gate token` had no case while its sibling branch did — a regression that
stopped rejecting bad gate tokens would have shipped green.

**Writing that fixture found a second defect, which is the part worth keeping.** The first attempt
used `G1,G7`, expecting rejection — **and the check passed it**. The token test is
`case "$gates" in *[!G0-9,]*)`, which rejects characters *outside* `[G0-9,]` and so accepts `G7`,
`G99`, `G0`, while its own finding text promises *"want G1 / G2"*. A sprint carrying
`gates_signed: G7 @ <sha>` is reported as **signed**. The retained fixture uses `X2`, which the branch
genuinely rejects, so it guards the branch that exists; tightening the test alters what a conformant
report says about an adopter's file, which is a behaviour change outside T1's Layers → **TD-067**.

**Two distinctions the condition's wording does not make, and one of them blocks the tick.**
`S9.GATESABSENT` reports *NOT SIGNED* as a note and **never FAILs** — deliberately, since a sprint may
legitimately sit unsigned between promote and the gate pass. *"A must-FAIL fixture that fails with its
named finding"* is therefore **unsatisfiable** for it, and the property actually worth requiring is *a
retained case asserts the named finding on input that must produce it*. Separately, **guarded ≠
guarded on every run**: `run-attestation` (7 cases) and `run-layers-observed` (14) are **opt-in**, so
21 cases — the two largest sets after the engine families — do not run at the gate.

**DoD 4 — § Closed-when 3 NOT ticked, and the reason written into the epic.** Ticking would mean
reading "check" as the unit and ignoring three identities, or reading the wording loosely enough to
cover a rule that cannot FAIL. Amending an exit condition to fit what was built is the failure L-088
names, and SPRINT-075 already refused this once. What remains is small, named and actionable: a
**ruling** on whether invocation errors are in scope, and a **wording change** for the must-REPORT
case. The condition has moved from *measured around* to *established*, which is what the task existed
to do.

**F1 folded in, per the G2 ruling.** `docs/research/conformance-dispositions.md` § scope-out claimed
**12 checkable rules** and para (b) said **(5)**; `S2.R-GROWTH` is marked `judgment-only` in spec §2,
so it was never in the checkable set the section partitions. Corrected to **11** and **(4)**, and the
register now reconciles exactly against the engine: **19 covered + 32 build + 11 scope-out = 62**,
which is what `conformance.sh` prints.

**A third near-miss on an id, and the pattern is now worth naming.** TD-066 was already taken
(SPRINT-075, and its subject is the engine's process-spawn cost — the very thing T5 hit, so T5's
"second sighting" has a home there). Renumbered to **TD-067**. Earlier in this sprint the register
first cited `TASK-241` for a follow-up, which is T3's own backlog twin. **Twice in one sprint the next
free id was assumed instead of derived**, and both were caught only by looking. Promotion candidate at
close: *an identifier for a new row is a query result — derive the maximum in use, never increment the
one you happen to remember* (L-130's family, at the grain of ids rather than figures).

### 2026-08-21 | surprise | T1 — an off-vocabulary tag drops a doc from the index, silently

The gate caught `knowledge index STALE` after the audit record landed, which is the check working.
Regenerating did **not** add the doc: `scripts/gen-index.sh` carries a **fixed** vocabulary
(`TAGS="process docs tooling edit-safety sprint-model"` ·
`DOMAINS="skills doc-standard governance knowledge sprint-model"`) and emits a tag section only for
names in it. The audit record was written with `tags: [conformance, testing, governance]` and
`domain: quality` — all plausible, none in the vocabulary — so it was parsed, indexed into the
entries table, and then **dropped from every rendered section with no warning**.

The failure mode is the one this repo keeps naming: the staleness check compares the file against a
regeneration, so a doc missing from **both** is consistent and passes. Retagged `[tooling, process]` /
`governance`, matching `conformance-dispositions.md`, and the entry now appears three times.

Not fixed here — `gen-index.sh` is outside T1's Layers and the fix is a design call (warn on an
unknown tag, or publish the vocabulary where an author writing frontmatter will see it; §7's glossary
would be the natural home). Recorded for the close Retro rather than filed as debt on the spot, since
the same pass is already carrying TD-067 and the promotion candidates.

### 2026-08-21 | progress | T4 — the ruling: the bar stands, and it cost four to five more sprints to say so

**Run last, with numbers, which was the whole design of D4.** Every one of the three was derived at
execution rather than trusted from the Plan: **coverage 19 of 62** checkable rules map to a check (13
in the engine — exactly A5's prediction, re-derived from the engine's own `coverage:` line);
**4 artefacts of 8** new findings against a stranger (T3, confirming A4); **16 of 19 finding
identities guarded**, 24 of 24 checks (T1).

**Owner ruling: the bar stands. No amendment, therefore no ADR** — §4's three-part bar is about a
decision that is hard to reverse, surprising, and a real trade-off, and *leaving a condition alone*
is none of those. DoD 2's alternative branch applies: the Retro carries the ruling.

**The reasoning, recorded because the alternative was available and defensible.** The clause has two
halves. *"Or is explicitly marked judgment-only"* is **done** — 32 rules satisfy it outright, 6 more
are excluded by mark. *"Maps to a check"* is at **19 of 62**, with **32** dispositioned `build` and
**11** `scope-out`. A disposition is a decision to build, not a check; and the 11 scope-outs satisfy
**neither** half, a residual this row has carried since SPRINT-073.

Two ways to make it tick today were on the table and both were refused: counting dispositions as
checks, and swapping in the roadmap's Phase A exit (*rules independently readable + conformance
independently measurable*), which is arguably true now. The second is a **different claim**, not this
one. Amending an exit condition to fit what got built is L-088's failure, and SPRINT-075 refused it
once already.

**What standing costs, stated so the choice is not free**: ~32 rules remain; this sprint shipped 7, so
**four to five more coverage sprints**, plus a separate ruling on whether the 11 scope-outs get
checked, re-marked, or accepted as a third state the condition's wording does not admit.

**The Plan named this outcome as legitimate before the evidence existed, and it is the one that
happened** — which is the only reason it reads as a ruling rather than a concession.

**20 of 20 DoD.** Two of the five § Closed-when conditions moved this sprint: **3** from *measured
around* to *established with a written reason for staying open*, and **2** from *undecided* to
*ruled*. Neither ticked, and that is the honest state.

### 2026-08-21 | progress | T4 — a soft cap crossed by one line, caught by the pass count moving

The gate read `162 pass, 0 fail` where the previous run read `163 pass, 0 fail`. **Zero failures is not
the same as nothing changed**, so the two pass lists were diffed rather than the green being accepted:
`cap docs/epic/EPIC-004-conformance.md (190 <= 200)` had disappeared. T4's ruling took the epic to
**201 lines against its 200 soft cap**, so the check moved from `PASS` to `OVER-CAP (soft)` — a report
line, not a failure, exactly as §11 intends for a soft cap.

Two soft caps are now outstanding for the promote/close doc-aging pass, both crossed by content this
sprint deliberately added: **`docs/epic/EPIC-004-conformance.md` 201 > 200** (the T4 ruling and the T1
evidence) and **`docs/research/conformance-dispositions.md` 200 > 130** (already 173 before T3's
§ Artefacts). Neither is pruned mid-task: the epic's § Closed-when is the artefact the *next* sprint
reads first, and the register is what T1 and T4 both reconciled against. Recorded so the next promote
sees them as a decision rather than discovering them.

Worth naming as method: **a green gate whose pass count moved is a changed gate.** The count is the
cheap second number, and the diff of the two lists is the check — the same shape that has caught every
other miscount in this sprint.
