---
owner: Maintainer
last_updated: 2026-08-25
update_trigger: a measurement round is appended
status: active
id: conformance-coverage-log
tags: [tooling, process]
domain: governance
related: [conformance-coverage]
---

# Conformance coverage — foreign-repo artefact triage, measurement log

> Append-only companion to [`../conformance-coverage.md`](../conformance-coverage.md). Uncapped by
> design: this file grows by one round per triage, which is exactly why it is not inside the decision
> doc's 130-line budget (STANDARD §2 `research/logs/` row · §6 cap-hit rule · ADR-014's mechanism).
> **Never edit a past round** — a later measurement supersedes an earlier one by being appended, and
> the superseded figure stays visible. The series *is* the evidence.
>
> **Rounds 1–3 are not reproduced here.** They are written up in the parent under § Artefacts and are
> not copied, because a figure copied into a second place drifts from the one it copied (L-108). This
> log opens at Round 4, which is the first round taken after the parent neared its cap.

## Round 4 — is `0 artefacts` still true at 45 rules? (SPRINT-081 T3 · TASK-238 · 2026-08-24)

**The question, and why it was finally worth asking.** EPIC-004's first exit condition called its own
`0 artefacts` result *honest but early*: it was taken at **6 of 62** checkable rules, and none of the
six were the families most likely to encode lean-flow's own directory shape. TASK-238 was parked with a
**narrowed** condition rather than a schedule — unblock when §6's tier doc-sets **or** §11's ledger
rules are evaluated by the *engine* (L-094). Both landed (SPRINT-078, SPRINT-080), alongside §2's
placement pair (SPRINT-076).

**A3, re-derived from the engine source at the start of this round rather than read off a summary** —
the discipline SPRINT-079's promote used for the §6 disjunct. All three families are genuine
assertions, not registrations: `assert_S6_{BASE,BACKEND,MEDIUM,MULTISVC}` (4), `assert_S11_*` (8),
`assert_S2_F_FILE` + `assert_S2_R_PLACEMENT`. Cross-checked against the engine's own printed
`coverage:` line — **45 `assert_` functions defined, 45 reported**, two independent counts agreeing.

**The stranger.** Unchanged and rebuilt from nothing: a four-file JS library (`README.md`,
`src/index.js`, `docs/architecture.md`, `package.json`), no lean-flow convention anywhere. The
mechanical guard that no lean-flow file was copied in **still passes** — asserted before the run, not
assumed, because copying even a template in would measure our own shape wearing a stranger's name.

### The result

**9 findings across 5 rules. 9 actionable, 0 artefacts.**

| Rule | Findings | Naming | Classification |
|---|---|---|---|
| `S2.F-FILE` | 4 | `SECURITY.md` · `CHANGELOG.md` · `docs/architecture/overview.md` · `docs/development/setup.md` | **actionable** — §2 `always` rows, repository-universal, each a canonical path the standard publishes |
| `S6.BASE` | 2 | `docs/product/requirements.md` · `docs/product/acceptance-criteria.md` | **actionable** — and see below; their character changed this sprint |
| `S3.SCHEMA` | 1 | `docs/architecture.md` | **actionable** — names the stranger's own file |
| `S2.R-README` | 1 | `README.md` | **actionable** — names the stranger's own file |
| `S1.LAW3` | 1 | `docs/architecture.md` | **actionable** — names the stranger's own file |

**Reconciled three ways (L-108),** because a triage that returns the comfortable number is exactly the
one to distrust: per-rule tally 4+2+1+1+1 = **9** = the report's own FAIL count; distinct rules **5**,
agreeing with the harness's independently computed `5 failing rule(s) across 9 finding line(s)`; and
every finding attributed to a rule with **no unattributed remainder**. A first attempt at the rule
count returned **8** by grepping finding *slugs* rather than rule ids — the disagreement with the
harness is what caught it, not a re-reading.

Two harness assertions carry the same claim mechanically and both pass: every finding names a path the
target has or a §2 canonical path it owes, and **applying exactly what the report asked for takes the
stranger to no FAIL line**. An unclearable finding is the failure this triage exists to detect.

### The finding worth keeping

**The two `S6.BASE` rows are the pair SPRINT-081 T2 made answerable, and this round is what verifies
that on the consumer path (L-016).** Before T2, a stranger whose requirements live in a ticket tracker
or a product wiki collected two permanent findings with no declaration available to them — clearable
only by writing two docs they had judged unnecessary. They can now declare a reasoned exemption in
`.conformance-exempt` and have it named, with its reason, on every report. The finding did not go away
and should not: **what changed is that it became answerable by a decision rather than only by a
document.** lean-flow could not have learned this by dogfooding — it fixed its *own* two rows in the
same sprint, which is precisely the asymmetry L-016 warns about.

**`0 artefacts` now means something.** At 6 rules it was a number nobody had earned; at 45, across the
three families most likely to leak our shape, it is a measurement. That is the difference between this
round and Round 1, and it is the whole reason the row was parked on a *condition* rather than a date.

### What this round does not claim

- **6 rules remain unchecked** (engine gaps, each named on a `GAP` line). They are held off the level
  and off the exit code deliberately, and they are not evidence of anything about a stranger.
- **`S2.R-PLACEMENT` still cannot see a near-miss.** `docs/architecture.md` is plausibly
  `docs/architecture/overview.md`; only `S2.F-FILE` reports it, as an absence rather than a
  misplacement. A known limit carried forward from Round 3, not re-measured here.
- **The stranger has no git history**, so §13's five rules report `not evaluated` and SPRINT-081 T4's
  new `attestation-absent` hold never fires for it. A git-backed adopter carrying no trailers *does*
  now collect that line — held at Gated, never failed, exit code unmoved. Untested against a foreign
  repo *with* commits; that is Round 5's question if anyone asks it.

## Round 5 — does the absent-attestation hold actually fire on a foreign repo with real commits? (SPRINT-084 T4 · 2026-08-25)

**The question Round 4 named and did not answer.** SPRINT-081 T4 added the `attestation-absent` hold;
T3 could not exercise it, because the stranger it had to work with is four `printf`s with no
`git init` — §13 reports `not evaluated` for a tree with no git-dir, which is a *different* branch
from the hold and proves nothing about it. The rule is exercised against this repository and by
`run-attestation-fixtures.sh`'s hand-built throwaway repos; neither is the **consumer path** L-016
names — an adopter's tree, never one we shaped to already agree with the standard.

**A second target, not `git init` on the existing one.** `evals/run-foreign-repo-fixtures.sh` gained
`acme-widget-vcs` alongside the original `acme-widget`, built to the *same* fully-remediated shape
(plus two files the original's own remediation block does not add — a README ownership footer and
§6's Base doc set — see below) and then turned into a real one-commit git repository with a plain
`chore:` message carrying none of `Gate-Signed-By:` / `Gate:` / `Evidence:`. Kept separate so the
original target's own four assertions — the four-file invariant, the actionable-findings sweep, the
every-finding-clears remediation — stay exercised exactly as Round 4 left them, undisturbed by git
history or two more remediation files landing on top.

**Why the target had to reach full remediation first, not just "no lean-flow convention."**
`conformance-engine.sh`'s level line checks `struct_fail` / `gated_fail` / `attested_fail` **before**
it ever consults a hold — one unrelated `FAIL` anywhere and the report never reaches far enough down
the ladder to say `level: Gated`, regardless of what §13 found. Building `acme-widget-vcs` at the
original stranger's remediation state and running the engine on it (still pre-`git init`) surfaced
two `FAIL` lines the original's own narrower regex-based sweep does not catch and so has carried,
unnoticed, since Round 4: `S2.R-README` (`readme-ownership-footer-missing`) and `S6.BASE`
(`tier-doc-set-incomplete` ×2, `docs/product/requirements.md` and `acceptance-criteria.md`). **Not
filed here** — `docs/research/conformance-dispositions.md` and `TECH-DEBT.md` are outside T4's
declared `Layers:`, and this round only fixed the two on `acme-widget-vcs` (needed for its own
precondition, see below) — recorded as a surfaced-but-unrouted finding for whoever next touches
either file: the original `acme-widget` target's `every-finding-is-actionable-and-clears` assertion
has read `-z "$left"` as PASS since Round 4 while these two `FAIL` lines sat in its own output,
because its extraction regex (`^FAIL  [a-z-]*: `) only matches the bare-kebab-id `bad()` calling
convention and silently skips the `S<N>.<CODE>` one both of these use.

### The result

**Both DoD legs hold, measured directly.**

1. `attestation-absent` fires. `S13.TRAILERS` reports `attestation-absent: none of the three
   trailers is present, so this repository claims no attestation and has not reached Attested` against
   the real HEAD commit.
2. The level line reads `level: Gated -- 1 finding(s) at Attested prevent Attested, the next level.
   None is a failure...` — never `level: Attested`, which is exactly the false certification L-159
   caught this same branch making on *this* repository before SPRINT-081 T2 cleared it.
3. **Exit code unmoved — proven as an A/B on the byte-identical tree, not asserted from the code
   alone.** `acme-widget-vcs` was measured twice: once **before** `git init` (§13 falls through to
   `not evaluated` on every rule, so nothing enters `struct_hold`/`gated_hold`/`attested_hold`, and the
   ladder's final `else` fires — `level: Attested`, over a tree making no claim at all, the exact
   Round-4-footnoted risk) and once **after** the one real commit (the hold fires, `level: Gated`). The
   only variable between the two runs is the presence of git history; every file on disk is identical.
   `rc_before` = 0, `rc_after` = 0 — equal, and both zero. The hold moved the *level* claim from a false
   `Attested` to an honest `Gated`; it moved the exit code nowhere, matching the engine's own comment at
   `conformance-engine.sh` §13 (`hold()` calls `note()` only — `bad()`, the only site that sets
   `fail=1`, is never reached on this path).

No surprise landed here: the hold fires exactly as SPRINT-081 T4 designed it, at the level and exit
code the code already claimed for itself. What Round 5 adds is that this is now **measured on a
foreign tree with real history**, not read off the code or off this repository's own commits.

### Discrimination proof (Tier G, ADR-029)

`evals/run-foreign-repo-fixtures.sh` is an eval harness, Tier G by name. The two new `run_case_anywhere`
assertions were seeded, not trusted on a first green run: `attestation-absent-against-real-history`'s
expected substring was swapped for `attestation-not-real-seeded-break` (guaranteed absent from the
engine's real output), and the suite re-run.

- **Seed landed** — `cmp` against a pristine copy differed at byte 17984 / line 246, the exact edited
  line.
- **Parses** — `sh -n` clean.
- **Targeted** — line count unchanged (276 = 276 pristine); assertion-label count unchanged (10 = 10:
  8 literal `fixture(...)` echoes + 2 `run_case_anywhere` calls).
- **Reddened, sibling green** — `FAIL fixture(attestation-absent-against-real-history)` was the only
  new failure. Its sibling in the same block, `attestation-absent-caps-at-gated`, stayed `PASS`,
  as did `attestation-absent-precondition`, `attestation-absent-exit-code-unmoved`, and all six
  pre-existing assertions from Round 4's target — proving the seed was localized, not a suite-wide
  break masquerading as a targeted one.
- **Restored** — edit reverted; `cmp` against the pristine copy reports byte-identical, `sha256sum`
  matches (`9f538915fba8...`), and a final re-run is all-green (10/10).

### What this round does not claim

- **The two `S6.BASE` doc rows and the `S2.R-README` footer were added to `acme-widget-vcs` only.**
  The original `acme-widget` target is untouched (per D-above) and so still carries the same two
  unnamed `FAIL` lines Round 5 found while building this target's precondition state. Not routed to
  `docs/research/conformance-dispositions.md` or `TECH-DEBT.md` — both outside T4's `Layers:` — so
  this stays a named-but-unrouted finding in this log until someone with those files in scope acts
  on it.
- **Only the `attestation-absent` branch is exercised here.** `attestation-unsigned-claim-only`,
  `attestation-trailers-incomplete`, `attestation-not-on-task-commit`, `evidence-path-unpinned` and
  `attestation-disagrees-with-sprint` are already covered by `run-attestation-fixtures.sh`'s five
  hand-built cases; this round adds the one branch that suite cannot reach (a *foreign* tree) and does
  not re-derive the other four there.
- **One commit, one target.** Not a claim about every shape a foreign repository's history could take
  (merge commits, multiple contributors, a rewritten history) — only that the specific gap Round 4
  named (no git at all) is closed.

## Round 6 — does Round 4's verdict survive a matcher that can see both finding conventions? (SPRINT-100 T5 · TD-089 · 2026-09-13)

**The question, and the defect that forced it.** Round 4 concluded **9 findings, 9 actionable, 0
artefacts** at 45 rules, and Round 5 — building an unrelated precondition — noticed in passing that
the harness half of that conclusion could not have examined every finding: its extraction regex
`^FAIL  [a-z-]*: ` matches only the engine's **bare-kebab** finding convention, and findings emitted
under the `S<N>.<CODE>` convention are invisible to it. TD-089 filed it with a re-file condition
naming this round: *widening the regex without re-running leaves the conclusion resting on a matcher
nobody re-measured*. This is that re-run.

**What was actually blind, stated precisely.** Round 4's **written** triage — the per-rule table in
this file — names all 9 findings and classifies each. That table was built by hand and is complete.
What was blind is the **mechanical** half: two `sed` sweeps inside
`evals/run-foreign-repo-fixtures.sh` that corroborate the written triage on every gate run. Measured
directly before any edit: the sweeps reached **6 of 9** FAIL lines. The 3 they could not see are
`S2.R-README -- readme-ownership-footer-missing` (×1) and `S6.BASE -- tier-doc-set-incomplete` (×2) —
2 rules, 3 lines. TD-089 and Round 5 both say "2", counting rules; the line count is 3.

The consequence is the one worth naming: `every-finding-is-actionable-and-clears` asserts that
applying every finding takes the stranger to **no FAIL line**, and has reported PASS since Round 4
while 3 FAIL lines stood in its own captured output. A guard reporting the wrong thing about the
right file, which is this sprint's whole theme.

**A2 re-derived, and the premise it was asked to confirm is FALSE.** TD-089's row records "195
`S<N>.<CODE>` occurrences against 38 distinct kebab findings, so the convention the matcher was
written for is the minority one." Re-derived at build through three routes, each varying the
SELECTION rule rather than the direction of the count (L-198):

| Route | Population | kebab-leading | rule-id-leading |
|---|---|---|---|
| static — `bad "` call sites in `conformance-engine.sh` | 73 emission sites | **58** | 15 |
| runtime — this round's own corpus (`acme-widget`, pre-remediation) | 9 FAIL lines | **6** | 3 |
| runtime — the live corpus (this repository, engine direct) | 12 FAIL lines | **12** | 0 |

The live-corpus row was checked for the contamination this sprint's own log records — the engine walks
into `.claude/worktrees/` and reports transient dispatch fixtures as repository content. **0 of the 12
name a worktree path**, so the figure is repository content throughout (L-170: treat a count taken
while worktrees are live as suspect until that is asked).

Kebab is the **majority** at every grain that bears on a sweep. The row's two figures compare *string
occurrences anywhere in the file* against *distinct finding slugs* — two different populations, which
is the one comparison that cannot carry a majority claim.

**Only one of the two is stale, and getting that wrong took a second reader.** Stating each figure's
derivation, which is the part the row omitted and this round nearly repeated:

| Figure | Derivation | Then | Now |
|---|---|---|---|
| `S<N>.<CODE>` occurrences | `grep -oE 'S[0-9]+\.[A-Z][A-Z0-9-]*'` over the engine, counted with duplicates | 195 | **216** — stale |
| distinct kebab findings | distinct slugs of `bad "` calls whose argument **leads** with the slug | 38 | **38** — unchanged |

This round's first draft wrote "both are also stale (216 and **43**)". 43 is a real number and the
wrong one: it is 38 **plus the 5 distinct slugs emitted after a rule-id variable** (`bad "$_rid-- …"`,
`bad "$_tid-- …"`), so it silently answers a different question than the row's 38 did. A third
population exists too — 47, every distinct slug regardless of emission shape (38 + 5 + 4 literal §13
ones). An independent read-through re-derived 38, disagreed, and that disagreement is what caught it;
re-reading the sentence would not have. **A round whose subject is a matcher blind to a population
shipped a draft that changed populations mid-sentence** — recorded rather than quietly fixed, because
it is the same failure one level up (L-198 · L-130).

The third static bucket is why the row reads as it does: **8 of the 15** rule-id-leading
sites emit through a **variable** (`bad "$_rid-- …"`, `bad "$_tid-- …"`), so a grep for a literal
`bad "S` finds 7 and a grep for a leading lowercase slug counts those 8 as kebab. Caught by a second
query that disagreed, never by re-reading the first.

**None of this changes the fix.** 3 of 9 findings invisible to a sweep is the defect whether 3 is the
minority or not.

### The result

**Round 4's verdict reproduces exactly, and is now mechanically covered rather than partly asserted.**

| | Round 4 (2026-08-24) | Round 6 (2026-09-13) |
|---|---|---|
| findings / failing rules | 9 across 5 | **9 across 5** — re-derived, not copied |
| per-rule tally | 4 + 2 + 1 + 1 + 1 | **4 + 2 + 1 + 1 + 1** (`S2.F-FILE` 4 · `S6.BASE` 2 · `S3.SCHEMA` 1 · `S2.R-README` 1 · `S1.LAW3` 1) |
| actionable / artefacts | 9 / 0 | **9 / 0** |
| FAIL lines the mechanical sweep examined | **6 of 9** | **9 of 9** |
| remainder after applying every finding | asserted empty over 6 | **empty over 9**, measured |

The verdict did not move. What moved is the evidence under it: the claim "every finding is actionable
and clears" is now made over the whole population instead of two thirds of it, and the two rules that
were invisible clear exactly like the rest.

### The three findings, now named — and cleared

DoD 3 asked that the previously-unnamed lines be **named by the widened sweep, or their absence
explained**. They are named, and they were then acted on rather than merely listed:

- `S2.R-README -- readme-ownership-footer-missing: README.md` — cleared by adding §3's `<sub>`
  ownership footer to the stranger's README.
- `S6.BASE -- tier-doc-set-incomplete: docs/product/requirements.md` and
  `docs/product/acceptance-criteria.md` — cleared by adding §6's two Base docs.

All three were already carried by `acme-widget-vcs`, which Round 5 built fully remediated for its own
precondition; the original `acme-widget` target has now caught up, and the two targets no longer
disagree about what a remediated stranger looks like. **Round 5's "the original target is untouched"
claim is superseded here** rather than left reading as still true. The strong `-z` empty-set
assertion is retained — it was not weakened into a remainder list, which the harness's own comment
forbids for the reason that a list can absorb a new artefact quietly.

### What the re-run changed in the guard, beyond the regex

Widening a matcher fixes the three findings in front of it; it does nothing about the **fourth**
convention nobody has written yet. Two structural additions, both Tier G (ADR-029 re-tier on
discovery — the matcher lives in an eval harness, not in this prose):

- **Population reconciliation.** Each sweep now counts the `^FAIL  ` lines it was given against the
  lines it actually parsed, and fails by name (`sweep-population-unreconciled`) when they differ,
  printing what it could not reach. A line shape neither arm parses becomes a finding instead of a
  silent skip. This is the generalisation of L-186 the round exists to earn: the next new convention
  announces itself rather than reopening TD-089.
- **Engine-level failures excluded, by name.** Four `bad "conformance: …"` sites in the engine
  (usage · repo-not-found · reader-missing · spec-table-unreadable) emit at the same two-space column
  as findings. The widened kebab arm parsed
  `FAIL  conformance: spec-table-unreadable -- …` as `slug=conformance, path=spec-table-unreadable`
  and would have reported a path complaint about the stranger when the truth was *the engine never
  ran*. Reproduced live against a deliberately unparseable spec, then routed to its own
  `engine-level-failure` finding. Same reading T4 took gate-side this sprint when it excluded
  `conformance:*` from the informational relabel.

### Discrimination proof (Tier G, ADR-029) — recorded once, in the sprint log

Round 5 carried its own proof in this file because Round 5 *was* the task. T5 is one task of five in
SPRINT-100, and T1–T4 each recorded theirs in
[`docs/sprint/logs/SPRINT-100-findings-that-mean-what-they-say.md`](../../sprint/logs/SPRINT-100-findings-that-mean-what-they-say.md).
T5's lives there too — seeded break, single stated hash convention (`git hash-object`), targeted-break
checks, reddened case with sibling control green, verified restore, and the outside worktree-isolated
review. **Pointed at rather than copied**: a proof reproduced in two files is two figures that can
drift apart (L-108), and this round is a poor place to learn that lesson twice.

### What this round does not claim

- **The stranger is unchanged in kind, and the 6 engine GAPs are unchanged.** Same four-file JS
  library, same `rule-unimplemented` lines held off the level and the exit code. This round
  re-measures coverage of the report, not the engine's rule coverage.
- **`S2.R-PLACEMENT` still cannot see a near-miss** — carried forward from Rounds 3 and 4, not
  re-measured here.
- **The reconciliation proves no line was SKIPPED, not that every line was parsed CORRECTLY.** A
  shape that parses into the wrong slug or path still counts as reached. The `conformance:` case
  above was caught by reading the engine's call sites, not by the reconciliation — which is the
  honest limit of a count-based guard, and the reason the population was enumerated by hand.
- **One engine, one corpus.** Nothing here is a claim about a finding convention some future
  assertion family introduces; the reconciliation is what is supposed to catch that, and it has not
  yet been exercised by a real one.
