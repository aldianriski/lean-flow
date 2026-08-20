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
