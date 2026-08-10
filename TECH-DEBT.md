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

---

## Tech Debt

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

- **TD-046** severity: minor | status: open | created: Sprint-056
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
