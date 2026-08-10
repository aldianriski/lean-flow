---
owner: Maintainer
last_updated: 2026-08-10
update_trigger: Tech debt filed (Sprint Close), aged (Sprint Promote), or resolved
status: current
---

# lean-flow — Tech Debt Ledger

> Filed automatically by the Sprint Close Retro (`TD-NNN` rows) · aged at Sprint Promote
> (unaddressed ≥ 3 sprints → re-review; `severity: high` → auto-escalate to `TODO.md` Backlog P1) ·
> resolved → `status: resolved → TASK-NNN`; **≥ 3 sprints later the row is deleted outright** (§11).
> The delay is deliberate — a just-resolved debt is still context at the next promote — and the
> substance survives in `CHANGELOG.md`, the sprint archive and git, so what goes is a breadcrumb, not a
> record. **IDs stay monotonic: a deleted row never frees its id.** `severity` ∈ trivial · minor · medium · high.
>
> A row's **`Mitigation:` line is the filer's hypothesis, not a plan** — written while the cost was being
> felt, and after a few re-reads it starts to read as settled. Cite the evidence for the *problem*;
> re-derive the *fix* before a DoD is built on it (L-091 → DOCS_Guide §10). The same goes for a row's
> Summary: TD-036's was false the day it was filed.
>
> **A row naming where cost goes accuses the component that is *legible*, never the one that dominates** —
> L-091's sibling, explaining why that particular hypothesis got reached for. An enumerable list you can
> read, count and point at can have a hypothesis phrased *about* it; an unnamed, uncounted blob beside it
> cannot be accused at all, so it is never suspected. TD-046 blamed fourteen nameable eval harnesses
> (measured: ~34%) while the eleven unnamed inline sections (~66%) had never been measured by anyone —
> wrong in both directions, unchallenged for two sprints, and invisible to every re-read. **Force the
> arithmetic before the diagnosis:** subtract the suspect from the total and say out loud what the
> remainder is (L-107 ×2).

---

## Tech Debt

- **TD-051** severity: medium | status: open | created: Sprint-061
  - Summary: **`check-layers-observed.sh` (gate leg 15) never sees a close commit, because the close
    commit is also the archival commit.** Line 225 skips any sprint file under `*/archive/*`, and its
    comment states the precondition that makes that safe: *"A closed sprint leaves `docs/sprint/` in
    §11's retention commit, which is separate from and later than the close commit, so the close
    commit itself stays covered."* That precondition is false. `/lean-doc-generator close` performs
    §11 archival and the squash-commit as one step, and the last three closes all did — verified by
    `git show --name-status` on `afd693d` (SPRINT-060), `0b4e06a` (SPRINT-059) and this sprint's
    `2f90504`, each carrying the `R` rename into `archive/` inside the close commit itself.
  - Impact: the blind spot lands on the **largest and least task-like commit of every sprint** — the
    one touching four manifests, README, CHANGELOG, TODO, LEARNINGS, the sprint file and, when a close
    uncovers a defect, real code. SPRINT-061's close changed `scripts/lib/check-layers-observed.sh`
    and `evals/run-layers-observed-fixtures.sh`, and leg 15 reported `skip (missing)` rather than
    checking them. Found only because that change was to leg 15 itself, so its verification was being
    attempted deliberately; a close that touches code for any other reason would pass unremarked. This
    is L-105's shape (a correct rule evaluated at the wrong moment) sitting on top of L-099's (a
    precondition written where nothing enforces it) — and the skip is **silent**, so nothing in the
    gate's output distinguishes "checked and clean" from "never looked".
  - Mitigation (**not yet derived**, L-091): at least three candidates with real trade-offs, and the
    obvious one is not obviously right. (a) Split archival out of the close commit, restoring the
    stated precondition — cheapest to reason about, but it makes every close two commits and §11
    deliberately groups the sprint and its log *"as one record"*. (b) Teach the checker to resolve a
    sprint that moved into `archive/` **within the commit being checked** — most faithful, and the
    most parsing. (c) Make the skip loud rather than silent, so a close at least reports that leg 15
    did not run — smallest, fixes the invisibility without fixing the coverage. **Do not reach for (a)
    on the grounds that it restores the comment's assumption**: the assumption was written before the
    close procedure grouped these steps, so the comment may simply be out of date rather than a
    requirement. Establish first whether any close commit has ever carried an undeclared file that
    mattered — this may be a real hole that has never been fallen into.

- **TD-050** severity: minor | status: open | created: Sprint-060
  - Summary: **section 4 of `scripts/qa-check.sh` (knowledge metadata — index freshness, dangling refs,
    frontmatter completeness, ADR-009) is 45–49% of the entire gate on its own** — 75–76 s of a
    154–169 s run, larger than all fifteen eval harnesses combined. Measured directly, two samples,
    SPRINT-060 T3 (`docs/research/qa-gate-timing.md`). The other seventeen sections sum to ~14%.
  - Impact: this is the gate's real cost centre and it has never been examined. It is also its most
    *stable* component (<2% between samples) while the harness half swings 16%, so it is the part a
    cure would actually move. Everything previously proposed — TD-046's `QA_FULL=1` idea — was aimed at
    a third of the runtime that has now been cleared twice.
  - Mitigation (**not yet derived**, L-091): do **not** reach for the obvious narrowing. At least the
    index-freshness half is a genuine whole-corpus read and that is precisely what ADR-009 wired it for;
    cheapening it risks the L-058 family (a check that stops seeing what it was built to see). The first
    honest step is to split section 4's own cost between its three jobs — freshness vs dangling refs vs
    completeness — because "section 4 is expensive" is itself an undifferentiated blob, and treating it
    as one is the exact error L-107 describes, now at count 2 partly because of this measurement.
  - **Split measured 2026-08-10 (SPRINT-061 T3) — done, and it corrects this row twice.** Table →
    [`docs/research/qa-gate-timing.md`](docs/research/qa-gate-timing.md) § Third measurement.
    **(a) The "three jobs" above are not separable.** Freshness is one subprocess and is; but dangling
    refs and completeness are computed *together* inside the same two loops (4a over LEARNINGS ids, 4b
    over corpus files), each pass producing both verdicts from a shared `allids`. This row also omits
    the corpus/id-universe setup they both depend on. Measured by **loop** instead — the boundary the
    code actually has. **(b) There is no cost centre inside section 4 to find.** It is three comparable
    thirds: freshness ~36%, 4a ~30%, 4b ~30%, setup ~2%. Deleting the *largest* outright would buy ~19%
    of the gate — and that largest slice is the index-freshness whole-corpus read this row already
    names as the thing not to cheapen. The cheapest target and the most protected one are the same
    object. Section 4 has meanwhile grown 45–49% → **51.5%** of the run on a corpus five entries larger,
    which is it scaling as designed rather than degrading.
    **Ruling: the row stays open on its behavioural concern** (a gate slow enough to be skipped stops
    running — TD-046's residual, inherited here). What is now closed is the expectation that splitting
    further reveals a target: it does not, and any real cure is structural (cache the index digest
    between runs, or accept that whole-corpus integrity costs proportional to the corpus), never a
    narrowing of what is checked. Do not re-derive a narrowing from this row — it has been measured
    twice and the answer did not change.

- **TD-049** severity: minor | status: open | created: Sprint-059
  - Summary: the night-run reaper (`scripts/night-run.sh`) parses the sprint file's DoD boxes and
    `### Tn` headings itself, duplicating logic `scripts/lib/check-*.sh` already owns. A third parser
    of the same format now exists (the dispatch-preflight snippet is the second — TD-045).
  - Impact: bounded, and the duplication is deliberate rather than accidental — ADR-016 names it as an
    accepted trade. The launcher is dependency-free POSIX sh a consumer reads in one sitting, and
    pointing it at `scripts/lib/` would ship a maintainer-only path into a consumer-facing reference
    (L-015). Unlike TD-045, this one has **no parity fixture**: nothing would catch the reaper's parser
    drifting from the checkers' if the sprint format changed.
  - Mitigation (**not yet derived**, L-091): the obvious move is a parity fixture like TD-045's, driving
    one sprint file through both parsers. Whether that earns its keep depends on how the format actually
    changes — the sprint schema has been stable for many sprints, so this may be a guard against a
    drift that never happens. Re-derive before building: confirm a real divergence risk first, and note
    that TD-045's parity fixture has never fired, which its own row reads as the design holding.

- **TD-048** severity: trivial | status: open | created: Sprint-058
  - Summary: `check-layers-completeness.sh` matches a `Layers:`/`Cites:` declaration against DoD prose
    **by token spelling, not by path identity**. A DoD that names a script by basename
    (``a bare `qa-check.sh` run``) is not satisfied by a declaration of `scripts/qa-check.sh`, so
    SPRINT-058 T2 had to declare the same file twice — `scripts/qa-check.sh` **and** bare
    `qa-check.sh` — on one `Cites:` line, and the same for `templates/RESEARCH.md.template` against
    its full `skills/lean-doc-generator/templates/…` path.
  - Impact: cosmetic today, and the checker's direction of error is the safe one — it over-reports,
    which costs a glance, where the miss would cost a silent false PASS (the sibling checker states
    that trade explicitly). The concern is behavioural and small: the fix a task author reaches for
    is to paste the second spelling, which trains the habit of satisfying the parser rather than
    declaring the file. A `Layers:` line carrying two spellings of one path also reads as two files
    to a human skimming the Plan, which is the surface the overlap map is drawn from.
  - Mitigation (**not yet derived**, L-091): the obvious move is basename-aware matching — treat a
    bare `x.sh` in prose as satisfied by any declared token ending `/x.sh`. **Re-derive before
    building**: that widening could mask a genuine overlap between two same-named files in different
    directories, which is precisely the case the overlap map exists to catch, and this repo has
    several (`evals/run-*-fixtures.sh` vs `scripts/lib/check-*.sh` share no basenames today, but
    nothing prevents it). Cheaper alternative worth pricing first: leave the parser alone and let the
    DoD prose carry full paths, which is better writing anyway. Do not act on one sighting (TD-031's
    pattern).
  - **Re-reviewed 2026-08-10 (SPRINT-061 promote, 3 sprints open) — held, trigger unchanged.** The
    row's own trigger is a *second* sighting; SPRINT-059 and SPRINT-060 produced none, so age is the
    only thing that has moved and the row already says age is not the trigger. Recorded here rather
    than in the sprint's § Scope Out, per the rule SPRINT-058 found failing its own next instance.

- **TD-047** severity: minor | status: open | created: Sprint-057
  - Summary: `night-run.md` is **414 lines** and carries five Parts plus a pre-flight checklist that
    now runs to a dozen items, several of them multi-paragraph. It has no cap: DOCS_Guide §2 does not
    cover `skills/**/references/`, and ADR-006 explicitly leaves reference files uncounted so that
    depth can live outside a `SKILL.md`.
  - Impact: none mechanical — the exemption is deliberate and correct. The concern is that the
    pre-flight checklist is now the doc's centre of gravity and is read *under time pressure, the
    evening before a run*, which is the worst possible reading condition for a twelve-item list where
    four items are load-bearing and the rest are context. SPRINT-057 added two items and lengthened
    two more without removing anything. Recorded now because the trend is only visible across
    sprints, and because the failure mode is a skipped item rather than a broken one — invisible to
    every check in the repo.
  - Mitigation (**not yet derived**, L-091): the obvious move is a split, as `night-run-checks.md`
    already did once. **Re-derive before doing it**: that split is precisely what let the probe
    mechanism sit deferred and unfiled for four sprints (SPRINT-057 T1), so splitting again without a
    mechanism that fires is how the next item gets lost. A cheaper alternative worth pricing first:
    order the checklist so the four total-loss items come first and say so, leaving the rest as
    context that can be skimmed. Do not act on the line count alone — measure which items a real
    pre-flight actually skips.
  - **Re-reviewed 2026-08-10 (SPRINT-061 promote, 4 sprints open) — held, trigger unchanged.** The
    trigger is a measurement of *which pre-flight items get skipped*, and no night run has been
    launched since SPRINT-057 — SPRINT-060's run mode was ruled interactive at G2 (L-111), so the
    checklist has not been read under the conditions this row is about. Nothing to measure yet is a
    different state from measured-and-fine; the row waits on a run, not on a sprint count.

- **TD-046** severity: minor | status: resolved → SPRINT-060 T3 | created: Sprint-056
  - Summary: the always-on gate now takes **~126s** (measured: 115s at SPRINT-056 T1, 126s at close),
    up from the 57s recorded when TD-016 moved three slow harnesses behind `QA_FULL=1`. Twelve
    always-on eval harnesses now run on every invocation, several of which spawn the checker they
    guard against the whole live repo.
  - Impact: none yet — it is green and it is correct. The concern is behavioural: a gate slow enough
    to be skipped is a gate that stops running, and L-089 already records a red gate committed
    because it was not re-run after a "clerical" edit. Every second added raises the odds of that.
    Recorded now because the trend is only visible across sprints and nothing measures it.
  - Mitigation (**not yet derived**, L-091): the obvious lever is moving more harnesses to `QA_FULL=1`,
    but that is a coverage reduction and carries L-076's proof obligation — show what a bare run no
    longer catches. A better question first: several harnesses re-run their checker over the entire
    live repo purely to guard a glob, and a cheaper assertion may exist. **Measure where the 126s
    actually goes before moving anything** — no figure has been taken per-harness, and L-097 is
    specifically about acting on a number nobody re-derived.
  - **Measured 2026-08-10 (SPRINT-058 T2) — the mitigation above is retired, and both of its premises
    were wrong.** Table → [`docs/research/qa-gate-timing.md`](docs/research/qa-gate-timing.md).
    (a) The harness category is **~34%** of the runtime (45.9s / 42.3s of 133.9s / 127.7s across two
    samples); the **inline checks, sections 1–11, are ~66%** and have never been measured. Moving all
    fourteen harnesses behind `QA_FULL=1` therefore buys at most a third of the gate, and the three
    that dominate — layers-completeness, dispatch-preflight, doc-caps — are the highest-value suites
    in the set. (b) "Several harnesses re-run their checker over the entire live repo" is **two of
    fourteen**, costing ~10s together, and both are deliberate *zero-coverage guards*
    (`run-doc-caps-fixtures.sh` case 6 and `run-manifest-lockstep-fixtures.sh` case 4) whose live
    input is the whole point — the second exists because that checker's first live run matched
    nothing (L-102). They are the last things to cheapen, not the first. Also corrected: there are
    **14** always-on harnesses, not the twelve this row records. The row stays open on its behavioural
    concern (a gate slow enough to be skipped stops running); what is closed is the proposed cure.
    Next measurement is the inline half — nothing has been moved or edited.
  - **Resolved 2026-08-10 (SPRINT-060 T3)** — the inline half the note above asked for was measured
    directly, and the behavioural concern this row was held open on now has a successor with a
    located cost centre: **TD-050**. The paragraph above says "the row stays open"; it was written at
    SPRINT-058 T2 and is true as of that moment only. Dated rather than deleted — the sequence is the
    record. Row is `resolved`; §11 deletes it three sprints on (Sprint-063).

- **TD-045** severity: minor | status: open | created: Sprint-056
  - Summary: the dispatch preflight in `dispatch.md` still re-implements the `Layers:`/`Depends-on:`
    parser that `check-layers-completeness.sh` owns. SPRINT-056 T1 fixed the two drifts (TD-040,
    TD-043) and added a parity fixture, but did **not** remove the duplication.
  - Impact: bounded and deliberately so. G2 ruled against removing it — `dispatch.md` publishes the
    snippet as an *"Optional snippet, dependency-free POSIX sh, runnable verbatim"*, and pointing it
    at `scripts/lib/` would both break that published contract and ship a maintainer-only `scripts/…`
    path inside a consumer-facing reference (L-015). So the duplication is now *guarded* by
    `evals/fixtures/dispatch-preflight/parser-parity/`, which drives one input through both parsers
    and fails if either stops seeing a declaration the other still reads. Two drifts happened before
    that guard existed; a third would now be caught rather than shipped.
  - Mitigation (**not yet derived**, L-091): if a third drift appears, the thing to revisit is the
    **published contract**, not the parser — either the snippet stops claiming to be dependency-free,
    or the shared parser is vendored into the fenced block by a generator. Do not re-open this on age
    alone: the guard is the point, and a parity fixture that has never fired is evidence the design
    is holding, not evidence it is unused.
  - **Re-reviewed 2026-08-10 (SPRINT-061 promote, 5 sprints open) — held, trigger unchanged.** No
    third drift has appeared and the parity fixture has still never fired, which this row already
    reads as the design holding. Age is explicitly not the trigger here. Noted alongside: TD-049
    records the *same* duplication without a parity fixture, so if either is ever acted on it is
    that one, not this.

- **TD-037** severity: minor | status: open | created: Sprint-049
  - Summary: attribution needs a commit to read, so **uncommitted work in progress is still tested
    against the all-task union** — the exact weakness TD-035 was filed about, surviving on the one
    path where nothing can be attributed.
  - Impact: bounded and arguably acceptable. The collision TD-035 describes happens between
    *committed* worktree branches at merge-back, and the coordinator's post-merge gate run sees
    everything committed — that path is now per-task. What stays uncovered is a single session's
    mid-flight edits, where "which task is this?" has no mechanical answer because the work has not
    been committed yet. Filed as its own row rather than left inside TD-035's resolution note, because
    that note is deleted three sprints after resolution (§11) and the residual would go with it.
  - Mitigation (not yet done): possibly none warranted — "unattributable because uncommitted" may
    simply be the honest boundary of a history-reading check. If it is ever worth closing, the lever
    is the sprint's own open-DoD state (exactly one task is usually in flight), which is a guess
    rather than a derivation and should be treated as one. **Do not narrow this by adding a rule that
    infers the current task** without evidence that a real miss occurred — that is TD-031's pattern
    starting over.
  - **Re-reviewed 2026-08-09 (SPRINT-052 promote, 3 sprints open) — deferral reaffirmed, deliberately.**
    The row's own trigger is *evidence of a real miss on the uncommitted path*, and none has appeared:
    every miss the redesign has caught since (SPRINT-050 T2's undeclared out-of-scope trail) came
    through the **committed** leg, which is the one attribution now covers. Acting now would mean
    inferring the in-flight task from open-DoD state — a guess this row already names as a guess — and
    guarding it would need its own negative test built against a failure nobody has observed. That is
    TD-031's pattern exactly: narrowing a working guard under no pressure. Held, with the trigger
    unchanged; a re-review that reaffirms is a decision, not a skipped line.
  - **Re-reviewed 2026-08-09 (SPRINT-055 promote, 6 sprints open) — deferral reaffirmed again.** The
    trigger is still unfired: no miss on the uncommitted path has been observed since. Age is not the
    trigger and was never proposed as one, so the ruling is unchanged. Recorded rather than performed
    silently, per the line above.
  - **Re-scoped 2026-08-10 (SPRINT-058 promote, 9 sprints open) — held, on a corrected basis.** Two
    things were wrong with the record, neither of them the ruling. **(a) The reaffirm above is too
    broadly worded and reads as falsified.** A miss on the uncommitted path *was* observed —
    SPRINT-055 T6 edited `TODO.md` as task work, the gate ran green while it sat uncommitted, and the
    finding surfaced attributed to a task already pushed. That miss is TD-044's, not this row's: it
    was the exclusion list holding a **close-time** reason during **execution**, an error of *phase
    keying*. This row's claim is narrower and untouched by it — that WIP is tested against the
    **all-task union** rather than per-task, because attribution needs a commit to read. Re-derived
    from the source rather than from the row (L-104): `check-layers-observed.sh` now carries the
    phase split and states in the same comment block that `is_excluded_committed` is deliberately
    untouched and that the split "guesses nothing of the kind" this row warns against. So TD-044's
    fix moved a different axis, and the union-attribution trigger remains genuinely unfired.
    **(b) SPRINT-057's promote re-reviewed and reaffirmed this row and never wrote it here** — the
    record lives only in that sprint's § Scope *Out* line. The rule directly above ("recorded rather
    than performed silently") failed its own next instance, which is L-105's shape: a rule that is
    correct and simply did not run at the moment it applied. **Ruling: held, trigger unchanged and
    now stated precisely** — evidence of a miss attributable to the *union*, not to any miss on the
    uncommitted path. Age remains not a trigger.
  - **Re-reviewed 2026-08-10 (SPRINT-061 promote, 12 sprints open) — held, trigger unchanged.** The
    precisely-stated trigger from SPRINT-058 remains unfired: no miss attributable to the *all-task
    union* has been observed in SPRINT-059 or SPRINT-060. Fourth consecutive reaffirm, recorded
    rather than performed silently. This row is now the ledger's clearest case that a re-review which
    reaffirms is a decision — worth leaving as the worked example next time age is mistaken for evidence.
