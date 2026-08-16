---
owner: Maintainer
last_updated: 2026-08-15
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

- **TD-059** severity: minor | status: open | created: Sprint-070
  - Summary: **the worktree-base guard's must-FAIL fixtures are opt-in, so the always-on gate never
    runs them.** `evals/run-worktree-base-fixtures.sh` covers all six of the guard's named findings
    plus a PASS control, and it sits in `eval_harnesses_optin` (behind `QA_FULL=1`) rather than the
    always-on set — correctly, by `qa-check.sh`'s declared rule that cheap-and-git-free stays
    always-on while git-repo-building stays opt-in (SPRINT-043 T1 / TD-016). Costed, not assumed:
    ~1.5s for 3 repos + 2 worktrees on this host.
  - Impact: the rule is right in general and expensive here specifically. The leg this guard covers —
    a dispatched worktree silently branching from `origin/main` — went **six sprints** undetected and
    cost SPRINT-069 a merge conflict, a task forced inline, and union-verification on every merge. A
    guard for a defect with that history sitting behind a flag is the shape L-058 warns about one
    level up: not a silent false negative in the check, but a check nobody runs. Bounded by the fact
    that the guard itself is always-on in `dispatch.md` for a coordinator who follows the protocol;
    it is the *regression* cover that is flagged off.
  - Mitigation (**not yet derived**, L-091): do not reach for "just move it to always-on" — that
    trades a known 1.5s against a rule two sprints old, and the rule exists because throwaway-repo
    harnesses were measurably the slow ones. The question to price first is whether the guard can be
    given a **git-free leg** at all: cases 1–3 (`unresolved` · `missing` · `unreadable`) and the PASS
    control need no history and could be split always-on, leaving only `stale` and `divergent` behind
    the flag. That would put the cheap majority of the coverage on every run. Whether a split harness
    is worth two files is the real trade-off, and it is undecided.
  - Tracker: SPRINT-070 T2 · `evals/run-worktree-base-fixtures.sh` header · TD-054 (the defect) ·
    TD-016 (the cost boundary the rule encodes)

- **TD-058** severity: minor | status: open | created: Sprint-070
  - Summary: **`spec/STANDARD.md` has no §2 row and therefore no cap, and it is now the largest
    governed doc in the repo at 587 lines.** The extraction (SPRINT-069 T2) moved the standard into
    `spec/` without giving it a row in its own §2 core-file table, so `check-doc-caps.sh` — which
    *derives* its coverage from §2 rather than hand-listing — does not see it. Verified: the checker's
    output contains zero `dispatch.md`-style rows for `spec/`. SPRINT-070 T1 added §13 and grew it by
    ~90 lines against no ceiling at all.
  - Impact: low today, structural tomorrow. The file is the SSOT an adopter pins, and it is the one
    document in the repo whose growth nothing reports — the exact condition §2's cap table exists to
    prevent, in the file that defines the cap table. It is also self-referential in a way that makes
    the fix a governance decision rather than a config edit: the standard would be capping itself,
    and the number chosen becomes a rule every adopter inherits.
  - Mitigation (**not yet derived**, L-091): the obvious move is "add a §2 row with a soft cap" and it
    is probably right, but the number is not derivable from this repo's history — the file has never
    been capped, so there is no growth curve under a ceiling to reason from, and ADR-015 requires a
    stated cap to be a real number rather than a gesture. Price at least: a soft cap with the §6
    tier-split escape (cap-hit → split into a tree, which for a spec means numbered section files) ·
    a hard cap, given that an adopter's pin makes surprise growth expensive · or an explicit ruling
    that the spec is deliberately uncapped, recorded so the absence stops reading as an oversight.
  - Tracker: SPRINT-070 T1 Execution Log · A4 (flagged it at promote; G1 scoped the ruling out) ·
    ADR-015 (a stated cap is a real number) · ADR-023 (why the file moved) · **vehicle: TASK-219**

- **TD-057** severity: minor | status: open | created: Sprint-069
  - Summary: **`Layers:` feeds three checkers that match it three different ways, and nothing states
    the contract.** The **pre-dispatch preflight** resolves directory globs — it reads T3's `docs/`
    against T1's `docs/adr/` and correctly reports `shared-file-owned-transitive`.
    **`check-layers-completeness.sh`** matches DoD/Acceptance prose by **token spelling** (TD-048's
    subject): `evals/` does not satisfy a DoD naming `run-doc-caps-fixtures.sh`, nor does
    `scripts/qa-check.sh` satisfy prose saying `qa-check.sh`. **`check-layers-observed.sh`** matches
    **actual changed paths per attributed task**: a glob never satisfies attribution for a specific
    file, and a file declared by a *sibling* task does not count.
  - Impact: SPRINT-069 T3 needed **four** `Layers:` corrections in one sprint — `AGENTS.md`,
    `scripts/qa-check.sh`, three root files caught by attribution, and one basename token — while its
    declaration was never wrong in the ordinary sense. Its globs were chosen deliberately, because a
    citation sweep's file set is re-derived at execution and a path list written at promote goes
    stale. So the author satisfies the gate that runs *before* dispatch and then discovers the other
    two contracts one FAIL at a time, mid-sprint, against a frozen Plan. Distinct from L-100
    (declarations corrected as implementation *invents* files): here the files were known, and the
    correction was forced by matcher semantics. Cost so far: four cycles in one sprint, zero bad
    artifacts — every finding was correct.
  - Mitigation (**not yet derived**, L-091): do **not** reach for "make the two checkers glob-aware"
    as the obvious fix — `check-layers-observed.sh`'s per-task attribution is deliberate (TD-035: a
    file declared by ANY task once satisfied the check for ALL tasks, which is what corrupted
    SPRINT-041's merge), and widening it back toward globs risks reintroducing exactly that. The open
    question is whether the contract should be **documented** (state the intersection all three
    accept, so an author writes to the strictest), **narrowed** (ban globs in `Layers:`, which
    collides with the re-derived-set case this row is about), or **unified** (one matcher all three
    share). Establish first which of the three consumers is the one that should move.
  - Tracker: SPRINT-069 Execution Log (the four corrections) · TD-048 (its token-spelling half) ·
    TD-035 (why per-task attribution is deliberate) · L-126

- **TD-056** severity: minor | status: resolved → TASK-212 | created: Sprint-065
  - Summary: **`check-layers-observed.sh` invoked without its sprint-file argument exits 0 and prints
    nothing, having checked nothing.** Its own must-FAIL fixtures show a clean run prints
    `PASS … layers observed (all changed files declared, base <sha>)`; silence means no sprint was
    examined. `qa-check.sh` always supplies the argument, so the gate path is unaffected — the silent
    no-op exists only on direct invocation, which is exactly how it was run mid-SPRINT-065 to
    re-verify a fix.
  - Impact: a bare re-run after a fix reads as a pass. Caught in-session only because the cross-check
    rule compared the run's silence against the fixtures' expected PASS line and the two disagreed
    (SPRINT-065 Execution Log, 2026-08-14). Cost so far: one near-miss, zero bad artifacts. Same
    family as TD-051's candidate (c) — a skip that is silent instead of loud.
  - Mitigation (**not yet derived**, L-091): the obvious move — no argument → usage line + non-zero
    exit — is small, but re-derive the scope first: establish whether the other `scripts/lib/check-*.sh`
    that take file arguments share the bare-invocation shape, and whether the cure belongs per-checker
    or in a shared guard. A one-checker fix to a family-shaped defect is how the next silent no-op ships.
  - Tracker: SPRINT-065 Execution Log (surprise, 2026-08-14) · CLAUDE.md § Edit-safety (c) (the
    L-045/L-057 family) · TD-051 candidate (c)
  - **Re-reviewed 2026-08-15 (SPRINT-068 promote, 3 sprints open) — first aging re-review; held,
    no new sighting.** No bare invocation since the SPRINT-065 near-miss — every run since went
    through `qa-check.sh`, which supplies the argument. The mitigation stays un-derived per the
    row's own text (scope the family first, never fix one checker of a family-shaped defect).
  - **Family scoped 2026-08-15 (SPRINT-068 T2's piggyback scan — the re-review's named ask,
    answered).** All 12 `check-*.sh` surveyed: the five `<repo-root>`-required checkers fail loudly
    (`${1:?usage}`), the guarded variadic ones (`check-gates-signed` · `check-night-run-rollup` ·
    `check-system-verify-block`) print a "nothing verified" note at exit 0, and exactly **two** share
    the silent bare no-op — `check-layers-completeness.sh` and `check-layers-observed.sh` (`for sp in
    "$@"` over empty args: zero output, exit 0). The cure is therefore per-checker on exactly those
    two, matching their guarded siblings' note-line shape. **Vehicle: TASK-212** (filed at SPRINT-068
    close). Bare invocation also recurred this sprint before the scan — the coordinator ran
    `check-layers-observed.sh` bare mid-run and read silence (second sighting of this row's shape).
    **Unblock condition, sharpened with a vehicle:** SPRINT-068 T2 (TASK-210) does gate-registration
    work in the same neighbourhood — piggyback the family scan there (which `check-*.sh` accept file
    arguments and what does each do bare?), one command's worth of observation; else the next
    bare-invocation near-miss.
  - **Resolved 2026-08-16 (SPRINT-069 T4) → TASK-212.** The per-checker cure the family scan ruled:
    both `check-layers-completeness.sh` and `check-layers-observed.sh` now print a "nothing verified"
    note at exit 0 when invoked bare, matching `check-gates-signed.sh`'s note-line shape, with one
    must-note leg per checker wired into the harnesses the gate runs. Guard-proof run (guard removed
    → leg RED with its named finding → restored → green), and the with-arguments gate path verified
    byte-identical against the pre-change checkers with repo state held fixed. Row retained for the
    audit trail; §11 deletes it three sprints from now.

- **TD-055** severity: minor | status: resolved → TASK-211 | created: Sprint-064
  - Summary: **`complete` is a reserved run-level event in the Execution Log, and nothing at the point of
    authoring says so.** `check-night-run-rollup.sh` line 42 treats **any** `### … | complete |` entry
    header as the announcement that a *run* finished, then requires the Part 4 rollup header and the
    calibration row. `sprint-log.md.template` lists the valid events as `promote · progress · surprise ·
    scope-change · park · blocker · complete · close` with no indication that one of them carries
    run-level semantics while the rest are entry-level.
  - Impact: writing "this task is complete" is the obvious thing to do and silently arms two run-level
    assertions. It fired mid-SPRINT-064 with T2 and T3 untouched, and the gate was correct to complain —
    the log *did* claim a completed run. The failure is loud rather than silent, so the cost is
    confusion and a correction, not a bad artifact. It reaches every consumer, since the template ships
    inside the plugin (L-015).
  - Mitigation (**not yet derived**, L-091): the obvious move is a parenthetical in the template
    (`complete` = the whole run, not a task) and it is probably right but probably not sufficient —
    the same word is listed in `orchestrator/SKILL.md` step 4 and in `night-run.md` Part 4, so a note in
    one place repeats L-099's shape. Establish first whether the cleaner fix is **renaming** the
    run-level event (e.g. `run-complete`) so the collision cannot occur, versus documenting a reserved
    word in three places. A rename touches the checker and its fixtures; a note does not.
  - Tracker: SPRINT-064 T1 Execution Log · `check-night-run-rollup.sh` line 42 · TD-052 (the same
    category — a procedural contract with no fixture) · L-015
  - **Re-reviewed 2026-08-15 (SPRINT-067 promote, 3 sprints open) — first aging re-review; held, with
    a named vehicle this time.** No new misuse since the SPRINT-064 firing — SPRINT-065/066 logs used
    `progress` correctly throughout, including for retry outcomes (the `revise · Tn` title-text
    convention exists precisely because inventing a `revise` event kind is this row's trap). The
    rename-vs-document question stays un-derived per L-091 — but **SPRINT-067 T2 (TASK-209) edits
    Part 4's rollup shape and the template's DoD guidance**, exactly the surfaces a fix would touch,
    so that task reads this row and settles rename-vs-note in passing or states why not.
    **Unblock condition:** SPRINT-067 T2 landing (the natural vehicle), or the next mid-log
    `complete` misuse — whichever first.
  - **Ruled 2026-08-15 (SPRINT-067 T2, the named vehicle) — note declined, rename recommended.**
    T2's own files (night-run.md Part 4 · review-scoping.md · SPRINT.md.template) are none of them
    the event-taxonomy authoring point — that is `sprint-log.md.template` (+ the checker and
    `orchestrator/SKILL.md` step 4) — so a note there would be a *fourth* location, repeating L-099's
    shape while fixing nothing. The clean fix is the rename this row already suspected:
    `complete` → `run-complete` in `check-night-run-rollup.sh`, its fixtures, and
    `sprint-log.md.template`, making the collision impossible. **Filed as a follow-up task at
    SPRINT-067 close**; this row stays open until it ships.
  - **Resolved 2026-08-15 (SPRINT-068 T3, TASK-211) — renamed as ruled.** `complete` → `run-complete`
    in `check-night-run-rollup.sh` (the entry-header match, now anchored to the delimited event
    field per L-108), its four fixtures under `evals/fixtures/night-run-rollup/` (three existing
    logs renamed + a new `task-level-complete-does-not-arm` leg proving the exact misfire shape —
    task-level `| complete |`, no rollup — now stays green), and `sprint-log.md.template`'s event
    taxonomy comment (with a one-line note that `run-complete` is run-only; a task finishing is
    `progress`). **Residual gap outside this task's editable-path scope:** `scripts/night-run.sh`
    (ADR-016's launcher wrapper, the thing that actually emits the run-level entry) still prints
    `### <date> | complete | run exited …` — it was not named in this row's own ruling and sits
    outside T3's file boundary. Until it is updated to emit `run-complete`, the real unattended
    reaper writes an event this checker no longer recognizes, and Part 4's gate goes silently dark
    on genuine completed runs. Flagged for the next task/promote to pick up.

- **TD-054** severity: medium | status: resolved → SPRINT-070 T2 | created: Sprint-063
  - Summary: **a worktree created by `Agent(isolation: "worktree")` can branch from a stale base, and
    nothing checks it.** SPRINT-063 T2's worktree was branched at `40603a6` (`sprint(60)`) — three
    sprints behind `main` — while the dispatching session was at `85490ac`. The agent detected it
    itself and fast-forwarded before doing any real work.
  - Impact: had it not looked, the citer check would have run against a corpus where only 2 of its 4
    named candidates were `status: superseded` and two docs the sprint's own Scope and A3 name did not
    exist at all. The result would have been confidently wrong and internally consistent — the worst
    shape. `dispatch.md`'s pre-dispatch preflight has a **base-ref-vs-HEAD** item, but it checks the
    *sprint's* base ref, not the base each spawned worktree actually gets; the gap is that the two were
    assumed to be the same thing. L-021's pattern one layer down: not the plugin cache this time, but
    the worktree copy of the repo.
  - Mitigation (**not yet derived**, L-091): the obvious move is "assert the worktree's HEAD equals the
    coordinator's before the agent starts", which is probably right but assumes the coordinator can
    read the worktree's base at spawn time — unverified. Establish first **why** the worktree branched
    three sprints back when the session was current; that mechanism is not understood, and a guard
    written against the wrong cause guards nothing.
  - Tracker: SPRINT-063 T2 Execution Log · dispatch.md pre-dispatch preflight · L-021
  - **Re-reviewed 2026-08-15 (SPRINT-066 promote, 3 sprints open) — first aging re-review; held,
    vehicle absent.** No worktree has been dispatched since the row was filed (SPRINT-064/065 ran
    inline/sequential by their own G2 rulings), so the mechanism question — *why* the worktree
    branched three sprints behind a current session — has had no opportunity to be investigated, and
    the row's own text forbids writing a guard before that cause is understood. **Unblock condition:**
    the next worktree dispatch compares the worktree's HEAD to the coordinator's at spawn (one
    command) *before* real work, and records what it finds — that observation either explains the
    mechanism or is the second sighting that forces the guard.
  - **Re-reviewed 2026-08-16 (SPRINT-069 promote, 3 sprints since last) — held, and the unblock
    condition above is now SPENT: it fired, and came back null.** SPRINT-068 dispatched two worktree
    builders — the first since this row was filed — and its Execution Log records both branching from
    `622f420`, which is the sprint's own `gates_signed` commit and therefore the coordinator's HEAD at
    spawn. Base current, both agents; SPRINT-063's three-sprints-behind branch did not reproduce. That
    is one clean observation, not an explanation: the mechanism is still unknown and one null result
    cannot retire a defect seen once. **Unblock condition, rewritten because re-parking on the same
    measurement is L-094's trap** (a condition already satisfied once cannot be the thing we wait for
    again): the *next* worktree dispatch records its base the same way — if it is current again, this
    row closes as not-reproducible with the two observations as its record; if it is stale, that is the
    second sighting and the guard gets written against a mechanism two data points can constrain.
  - **SECOND SIGHTING — reproduced 2026-08-16 (SPRINT-069 T4 + T2), and the mechanism is now
    visible.** Both worktrees dispatched this sprint branched from **`622f420`**, 13 commits behind
    the dispatching session's HEAD. That sha is not arbitrary: it is SPRINT-068's `record plan_commit
    sha` commit, and **the same base SPRINT-068's two builders used**. Four worktrees, two sprints,
    one identical commit — which was current then and stale now. **That is a pin, not drift**, and it
    answers the question this row has been held open on since SPRINT-063 ("*why* did a worktree branch
    three sprints back when the session was current"). The row's own text forbids a guard before the
    cause is understood; a systematic pin is a cause.
  - **Measured cost this sprint, so the next re-review is not arguing from principle:** (a) T4's base
    lacked 68 lines of SPRINT-068 close-time work on two of the four files it edited — the three-way
    merge preserved both sides only because the edits sat in different regions, and the union was
    verified rather than assumed; (b) T2's base predated T1 entirely, voiding *inside the builder's
    tree* the `Depends-on: T1` edge that the pre-dispatch preflight had HALTed to enforce, and
    producing a real merge conflict in which the builder carried forward a line-count figure that had
    been corrected after its base; (c) T3's dispatch was abandoned for inline work, because a sweep
    against a tree with no `spec/` would have been provably wrong work rather than a merge risk.
    Effective dispatch yield: 2 of 3 planned, both requiring union-verification.
  - **Unblock condition — met. This row is now actionable, not waiting.** The guard has a mechanism to
    be written against: assert the worktree's HEAD equals the coordinator's at spawn and halt if not,
    *and* establish why the base is pinned to a stale sha in the first place — the assertion catches
    it, the pin is the thing to fix. **Vehicle: TASK-217** (filed at this close). **Severity reviewed
    at this close and held at `medium`** — the close proposed raising it and the proposal was wrong
    about the starting point: this row has been `medium` since it was filed at SPRINT-063, so there
    was nothing to raise. What changed is the *evidence under* that severity, from one historical
    sighting to a demonstrated cost on every dispatch; `high` was considered and declined, since it
    auto-escalates to Backlog P1 and would front-run the next promote rather than inform it.
  - **RESOLVED 2026-08-16 (SPRINT-070 T2) — and the mechanism was documented in this repo before this
    row was ever filed.** `worktree.baseRef` defaults to `"fresh"`, which branches from `origin/HEAD`.
    Measured at execution: `origin/main` = `622f420` — the exact sha all four worktrees used — with
    local `main` **31 commits ahead and unpushed**. Not drift, not a harness bug, and not the
    "systematic pin" of unknown origin the second-sighting entry described: it is **documented default
    behaviour** meeting a repo where push is owner-reserved, so `origin/HEAD` stands still while local
    work accumulates. Confirmed against the official worktrees documentation, which states it outright
    for subagent worktrees. **`L-046` (SPRINT-026, `status: active`) said this verbatim, and
    `dispatch.md`'s own base-ref caveat repeated it — inside the file this fix was promoted to edit.**
    Three aging re-reviews re-asked the question rather than searching the record; filed as **L-127**,
    because the six-sprint delay is the reusable lesson here, not the git behaviour.
  - **Cure shipped, both halves, per this row's own framing** ("the assertion catches it, the pin is
    the thing to fix"): `worktree.baseRef: "head"` in `.claude/settings.json` removes the pin at its
    cause, and a **worktree-base guard** in `dispatch.md` compares the base a spawned worktree
    *actually got* against the coordinator's HEAD, halting by name. The pre-dispatch preflight's
    base-ref leg could never have caught this and now says so: it compares the *declared* base to live
    HEAD, both in the main checkout. `git push` was considered and rejected in the doc text — it makes
    the base current exactly once and re-breaks on the next unpushed commit.
  - **Verified live, not just in fixtures.** The next dispatched worktree came back at `97eca0b`, the
    coordinator's HEAD exactly, with `spec/` and `ADR-024` present in its tree — both absent at
    `origin/main`, so the base is provable without comparing a sha. Regression cover:
    `evals/run-worktree-base-fixtures.sh`, one case per named finding, proven to bite by inverting the
    guard's comparison (4 of 7 assertions went red). Its opt-in tier is carried as **TD-059**. One
    thing the demonstration could *not* do is recorded as **L-128**: the worktree and its branch were
    swept before the guard could be run against them.
  - **Row retained, not deleted** — §11 keeps a resolved row for ≥ 3 sprints because a just-resolved
    debt is still context at the next promote. Id stays monotonic when it goes.

- **TD-053** severity: minor | status: open | created: Sprint-063
  - Summary: **worktree-isolated dispatch places a full repo copy at `.claude/worktrees/<id>/`, inside
    the repo, and `find`-based checkers walk into it.** `check-ephemeral-intake.sh` excludes fixture
    trees with `grep -v '^evals/fixtures/'` — correctly position-anchored per L-108 — but the nested
    copy defeats the `^` anchor, so `.claude/worktrees/<id>/evals/fixtures/…` is not excluded. The gate
    reported a retained must-FAIL fixture as a live violation for as long as the worktree existed.
    Separately, `.claude/worktrees/` is **not in `.gitignore`**, so a plain `git add -A` would commit a
    second copy of the whole repo.
  - Impact: bounded and transient — it clears when the worktree is removed — but it fires on exactly
    the workflow `dispatch.md` prescribes for disjoint parallel tasks, so it lands on anyone following
    the documented path. The false positive is loud rather than silent, which is the better failure;
    the `.gitignore` gap is the sharper one, since a stray `git add -A` is recoverable but ugly.
  - Mitigation (**not yet derived**, L-091): do not reach for "add `.gitignore`" as the whole fix — it
    addresses the second leg only. `check-ephemeral-intake.sh` uses `find`, not `git ls-files`, so
    ignoring the path does not stop the walk. Whether the cure belongs in each `find`-based checker, in
    a shared exclusion, or in placing worktrees outside the repo entirely is a question about all of
    them at once — which is EPIC-004's engine question, so this row may be absorbed there rather than
    fixed alone.
  - Tracker: SPRINT-063 Retro · L-108 (the anchor that was right and still defeated) · EPIC-004 D1
  - **Re-reviewed 2026-08-15 (SPRINT-066 promote, 3 sprints open) — first aging re-review; held,
    vehicle absent.** Same absence as TD-054: no worktree dispatch since filing, so neither leg (the
    `find`-walk false positive, the `.gitignore` gap) has fired again. The cure question stays routed
    to EPIC-004's engine per the row's own reasoning. One adjacency noted rather than acted on:
    **TASK-208** (system-verify at merge-back, filed 2026-08-15) will touch the same merge-back
    protocol — whoever builds it reads this row first, since a full-gate pass run while a worktree
    still exists would hit exactly this false positive. **Unblock condition:** unchanged — the next
    worktree dispatch, or EPIC-004 D1 landing.
  - **Re-reviewed 2026-08-16 (SPRINT-069 promote, 3 sprints since last) — the two legs now separate,
    and only one of them is still waiting on anything.** SPRINT-068's worktree dispatch was the vehicle
    both legs were held for, and they came out of it in different states. **Leg 1 (the `find` walk) is
    untested, not clean:** no full gate run is recorded while a worktree existed, so its silence is
    absence of evidence and nothing else — read as "did not fire" it would be exactly the false-negative
    L-058 warns about. It stays routed to EPIC-004 D1 as the row's own reasoning directs. **Leg 2 (the
    `.gitignore` gap) is confirmed live and is not waiting on the engine question at all:**
    `.claude/worktrees/` is still absent from `.gitignore`, and SPRINT-068's close ran `git add -A`,
    which was safe only because the worktrees had already been removed — the mitigation text above
    rules out `.gitignore` as *the whole fix*, which is not an argument against it as the fix for the
    leg it actually covers. Split out to **TASK-213** so a one-line cure stops waiting on a question it
    does not depend on. **Unblock condition:** leg 1 only — EPIC-004 D1, or a gate run observed against
    a live worktree.
  - **Leg 2 resolved 2026-08-16 (SPRINT-069 T5) → TASK-213.** `.claude/worktrees/` is in `.gitignore`,
    verified against a real dispatched worktree rather than a `mkdir`'d stand-in: before, `git status
    --short` showed `?? .claude/worktrees/` while T4's worktree was live, meaning a plain `git add -A`
    at that moment would have staged a full second copy of the repo; after, only the `.gitignore`
    edit itself. **Leg 1 stays open.**
  - **LEG 1 FIRED LIVE, twice, 2026-08-16 — the unblock condition is met with a positive observation.**
    The full gate, run to verify T1 while T4's worktree existed, reported
    `FAIL ephemeral-intake: .claude/worktrees/agent-<id>/evals/fixtures/ephemeral-intake/committed-bug/
    docs/BUG-stale-pointer.md is a committed BUG report` — a retained must-FAIL fixture inside the
    worktree, reported as a live violation, exactly as this row predicts (the nested copy defeats
    `grep -v '^evals/fixtures/'`'s `^` anchor). **A detail the row did not anticipate: it scales with
    concurrent agents** — with two worktrees live the gate emitted two such FAILs, one per worktree,
    so a wider fan-out produces proportionally more false positives. Both cleared on worktree removal.
    Note the timing: the SPRINT-069 promote re-review had recorded leg 1 as *"untested, not clean —
    no full gate run is recorded while a worktree existed"*, and the condition was met the same day by
    ordinary work rather than a scheduled experiment. **Unblock condition:** unchanged in substance —
    the cure still belongs to EPIC-004 D1's engine question per this row's own mitigation text, which
    warns against a one-checker fix to a family-shaped defect (L-091). What is now settled is that the
    defect is real and observed, not hypothetical.

- **TD-052** severity: medium | status: open | created: Sprint-062
  - Summary: **Nothing in `evals/` exercises skill *prose*, so a governance rule that lives as
    procedure text ships without the must-FAIL fixture L-058 requires.** SPRINT-062 T2 changed the
    promote doc-aging line to read two sources (§11 retention **+** every §2 cap breach). The change
    was exercised on live failing input — the two research docs with no §11 row surfaced where the
    scan previously read clean — but that is a one-time before/after, not a retained control. Every
    existing harness targets a `scripts/lib/check-*.sh` with a parseable output contract; a checklist
    emitted by a skill has neither an entry point nor an output to assert against.
  - Impact: the exact failure T2 fixed can silently return. A future edit that re-narrows the
    doc-aging line — or an agent that reads the enumeration as the source rather than the routing hint
    it is now labelled — restores a matcher with no consumer, and nothing goes red. This is the
    silent false negative L-058 exists to prevent, in the one category the eval suite cannot reach.
    It generalises beyond this line: **every gate in lean-flow that is procedure rather than script**
    (G1, G2, the promote governance checklist, close's §11 propose→approve) is unguarded the same way.
  - Mitigation (hypothesis, re-derive before building — L-091): a prose-assertion harness that greps
    a SKILL.md for a required clause is the obvious move and is probably **wrong twice over** — it
    would be a substring standing in for a structural claim (L-108, which this very sprint broke three
    times), and it would assert that text *exists* rather than that the procedure *fires*. The honest
    question is whether a procedural gate can be fixtured at all, or whether the category needs a
    different control entirely — a review-time checklist, or accepting the gap and naming it.
  - Tracker: SPRINT-062 T2 · L-058 · L-108 · TD-012 (the fixture-retention leg, still open)
  - **Re-reviewed 2026-08-14 (SPRINT-065 promote, 3 sprints open) — first aging re-review; held, and
    the row got *more* expensive rather than staler.** SPRINT-064 hit this gap twice in one sprint:
    T3's coordinator-owned rule shipped with a traced walkthrough because skill prose has no harness to
    fixture it, and **TD-055** was filed for a second procedural contract with the same missing control
    (`complete` as a reserved run-level event, documented in a checker and not at the point of
    authoring). Two instances in one sprint is the first evidence that this category recurs rather than
    sitting quietly. **The row's own mitigation still stands unbuilt and should stay that way** — its
    text already argues a prose-grep harness would be wrong twice over (a substring standing in for a
    structural claim, asserting text *exists* rather than that a procedure *fires*), and SPRINT-064 T2
    strengthened that: the rule everyone could quote was loaded for all eleven of its sightings and
    reached none, so asserting presence proves nothing about firing. **Unblock condition, stated so the
    next pass is not another hold:** act when a *third* procedural gate is filed with no control, or
    when EPIC-004's spec-driven engine gives procedural rules a machine-readable form to assert against
    — whichever lands first. Do not build a prose-grep harness in the meantime.
  - **Sighting note 2026-08-15 (SPRINT-066 close) — the third-gate trigger did NOT fire; read the
    condition carefully before counting.** ADR-021 and ADR-022 are two more procedural gates and
    neither ships a fixture — but both **name their control at authoring time**: ADR-021 names G2's
    new checklist line as its matcher, and ADR-022 explicitly assigns its must-FAIL leg to
    TASK-208/209's build. "Filed with **no** control" is the trigger, and a control scheduled by name
    is not absent. Recorded so these two are not silently absorbed into the count. Separately,
    SPRINT-066 produced the first *mechanical* control ever applied to a procedural rule — the Spec
    axis briefed with the ruling as comparand caught stale wiring in-session (L-122) — which is a
    candidate shape for this row's eventual cure.
  - **Re-reviewed 2026-08-15 (SPRINT-068 promote, 3 sprints since last re-review) — held, and the
    candidate cure matured into a promoted rule.** SPRINT-067 added two more catches: the revise
    loop's comparand-briefed reviewers found a checker asserting an undocumented format and prose
    referencing an unasserted shape (→ L-123, this row's territory exactly). **L-122 is now promoted**
    (review-scoping.md § Scope every pass): comparand-briefed review + the revise loop is the working
    *procedural* control for prose rules — not the machine-checkable one this row ultimately wants,
    but no longer "no control at all". The third-uncontrolled-gate count stands at zero (ADR-021/022
    both named controls at authoring; L-123 now makes that mandatory). **Unblock condition:**
    unchanged — EPIC-004's spec-driven engine for the machine-checkable half; the procedural half is
    now served.

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
  - **Re-reviewed 2026-08-14 (SPRINT-064 promote, 3 sprints open) — first aging re-review; held, and
    SPRINT-063's close is a fresh instance rather than a hypothetical.** Close commit `3998e23` carried
    the archival rename plus four manifests, README, CHANGELOG, TODO, TECH-DEBT, LEARNINGS and two epic
    files — precisely the "largest and least task-like commit of every sprint" this row names — and leg
    15 did not check it. Two corrections to the row's framing, from evidence: **(a)** the blind spot is
    close-*specific*; a task commit that omitted a file was caught the same sprint by a different route
    (the working-tree derivation described in L-116), so leg 15 is not the only guard on that failure.
    **(b)** Nothing has yet been shown to actually slip through it — the cost so far is invisibility,
    not missed coverage. That shifts the balance among the row's three candidates toward **(c) make the
    skip loud**, which is the cheapest and addresses the demonstrated failure rather than the feared one.
    Still not derived. **Unblock condition:** one close commit carrying an undeclared file that mattered.
  - **Re-reviewed 2026-08-15 (SPRINT-067 promote, 3 sprints since last) — held, trigger unchanged.**
    Two more closes since (SPRINT-065 `c723b76`, SPRINT-066 `029f698`), both carrying the archival
    rename + manifests + ledgers, both invisible to leg 15, and no evidence either carried an
    undeclared file that mattered — the blind spot's cost remains invisibility, not missed coverage.
    Balance still favours candidate (c) make-the-skip-loud when the trigger fires. Adjacent note:
    SPRINT-067 T1 (TASK-208) adds a system-verify pass at merge-back, which narrows what a close
    commit could silently carry — evidence for holding, not for acting.
  - **Observation 2026-08-16 (SPRINT-068's close, recorded at SPRINT-069 promote — not a due
    re-review; this row's aging clock still runs from SPRINT-067). The trigger came closer than any
    prior instance, and on the same two files as SPRINT-061's.** Close commit `9fef02d` carried real
    code — `scripts/lib/check-layers-observed.sh` and `evals/run-layers-observed-fixtures.sh`, changed
    at close because the close itself surfaced a defect in leg 15's exclusion list — and neither file
    is named in any task's `Layers:`, because both were invented after the Plan froze. Leg 15 printed
    `skip (missing): docs/sprint/SPRINT-*.md` and did not check them, exactly as this row predicts.
    Whether that counts as "an undeclared file that **mattered**" is the judgement the unblock
    condition turns on, and the honest answer is **not quite**: the two files were covered by a fixture
    leg and a strip-the-row guard proof run before the commit, so the coverage leg 15 would have
    supplied was supplied by other means. The cost was again invisibility, not missed coverage — the
    third close in a row to say so, now with the strongest instance yet behind it. **Balance:
    candidate (c), make the skip loud, is what the evidence keeps pointing at** — a close that touches
    code should at minimum be told leg 15 did not look. Still held, still not derived, but a fourth
    instance of "invisibility only" should be read as the trigger being wrong rather than never met.

  - **Re-reviewed 2026-08-16 (SPRINT-070 promote, 3 sprints since last) — held; fifth consecutive
    "invisibility only", and one thing genuinely improved.** SPRINT-069's close commit carried **no
    code at all** — archival move, manifests, ledgers and the Retro — so leg 15's blind spot cost
    nothing this time, and the row's cost column stays at invisibility rather than missed coverage.
    Separately, the fix SPRINT-068's close shipped for its own bookkeeping (`docs/changelog/*` joining
    the close-time exclusion list) met its first real rotation here and behaved: `CHANGELOG-1.41.0.md`
    rotated out without a red leg, where every prior MINOR close went red on that file. Balance is
    unchanged and still favours candidate (c), make-the-skip-loud. **Unblock condition:** unchanged —
    one close commit carrying an undeclared file that mattered.
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
  - **Re-reviewed 2026-08-14 (SPRINT-063 promote, 3 sprints open) — held, trigger unchanged.** First
    aging re-review for this row. Nothing re-derived: the two measurements above already retired the
    narrowing cure, and L-091 binds against re-deriving it from the same row. The behavioural concern
    (a gate slow enough to be skipped stops running) is what stays open, and it waits on a *structural*
    cure — an index digest cached between runs, or accepting that whole-corpus integrity costs
    proportional to the corpus. Neither is this sprint's work: SPRINT-063 is EPIC-002 subtraction, and
    shrinking the corpus is the one lever that moves this row without touching the gate at all.
  - **Re-reviewed 2026-08-15 (SPRINT-066 promote, 3 sprints since last) — held, trigger unchanged.**
    The behavioural concern has produced no evidence: the gate ran at the SPRINT-065 close (138 pass,
    ~same shape) and was not skipped under exactly the conditions the row worries about. The
    structural cure remains un-derived and nothing this sprint touches it — SPRINT-066 is two
    rulings, no corpus or gate work. **Unblock condition:** unchanged — a run demonstrably skipped
    for cost, or a structural cure (cached index digest) being derived on its own merits.
  - **Re-reviewed 2026-08-16 (SPRINT-069 promote, 3 sprints since last) — held, trigger unchanged.**
    Still no run skipped for cost: SPRINT-068 ran the gate four times across its close (twice bare,
    twice under `QA_FULL=1`) with no reluctance recorded, and one of those runs was a deliberate
    re-run to verify a revert — the opposite of the avoidance this row worries about. The structural
    cure stays un-derived and nothing in the promoted work touches it. Noted for the next re-review:
    the corpus grew again this sprint (L-124, ADR-023), so section 4's share is expected to have moved
    up rather than down — which the row already frames as scaling as designed, not degrading, and is
    **not** grounds to re-derive the narrowing L-091 binds against. **Unblock condition:** unchanged.

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
  - **Re-reviewed 2026-08-14 (SPRINT-063 promote, 4 sprints open) — held, trigger unchanged.** First
    aging re-review; the row has been open four sprints without one, which the scan caught and this
    line closes. The divergence risk this guards is still unrealised — the sprint schema has not moved
    since the row was filed — so the parity fixture stays unbuilt on TD-045's own evidence rather than
    on a fresh judgement. **Unblock condition, stated so the next re-review is not another hold:**
    build it the first time the sprint format actually changes, or when TD-045's fixture fires once.
    Until one of those, a re-review that reaffirms is a decision, not a skipped line.
  - **Re-reviewed 2026-08-15 (SPRINT-066 promote, 3 sprints since last) — held, and one near-trigger
    ruled out explicitly.** SPRINT-065 T1 *documented* `Cites:` in `SPRINT.md.template` — a
    definition of a field already in live use, not a schema change: every parser (the reaper, the
    preflight snippet, `check-layers-completeness.sh`) already read or deliberately ignored `Cites:`
    before the edit, so nothing any of the three parses moved. TD-045's parity fixture has still
    never fired (QA green at the v1.39.0 close). **Unblock condition:** unchanged — a real format
    change the parsers read, or the parity fixture firing once.
  - **Re-reviewed 2026-08-16 (SPRINT-069 promote, 3 sprints since last) — held, and this time the
    near-trigger was much nearer.** SPRINT-068 T3 renamed a machine-read token in the Execution Log
    format (`complete` → `run-complete`) and `scripts/night-run.sh` — this row's subject — had to be
    edited for it, as a mid-sprint scope-change, because the ruling's census named the checker, the
    fixtures and the template but not the event's **writer** (→ L-124). So a format the launcher both
    writes and reads did move, and the launcher was very nearly left behind. It is still **not** this
    row's trigger: what moved is the log's event vocabulary, not the DoD-box / `### Tn` grammar the
    duplicated parser here actually reads, and no parser diverged — the miss was caught before merge.
    But the row's standing argument has been "the sprint format has been stable for many sprints", and
    that sentence is now weaker than it was: the format moved, and what caught the omission was a
    builder's file-boundary flag, not any parity check. TD-045's fixture has still never fired.
    **Unblock condition:** unchanged in substance, sharpened in wording — a change to the **DoD/`Tn`
    grammar** the three parsers read (the log's event taxonomy is a different format and does not
    count), or TD-045's parity fixture firing once.

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
  - **Re-reviewed 2026-08-14 (SPRINT-064 promote, 6 sprints open) — held, trigger unchanged.** SPRINT-063
    exercised `Layers:`/`Cites:` four times across T1 and T3, and every finding was correct — including a
    genuine catch (`docs/architecture/overview.md` · `docs/DECISIONS.md` · `DOCS_Guide.md` undeclared in
    T1's Layers). No false positive from basename matching appeared in four opportunities: weak evidence
    in the row's favour, and recorded as weak rather than dressed up. **Unblock condition:** a false
    positive that costs a real edit — not a theoretical one, and not another sprint of quiet.
  - **Re-reviewed 2026-08-15 (SPRINT-067 promote, 3 sprints since last) — held, and the checker banked
    another genuine catch.** SPRINT-066's promote render was caught declaring a file in `Layers:` while
    escaping it in `Cites:` — a correct finding that cost a real fix, the opposite direction from the
    false positive this row waits on. Zero FPs across SPRINT-065/066's `Layers:`/`Cites:` exercises
    (several per sprint, including two mid-task amendments). **Unblock condition:** unchanged.
  - **Three sightings in one sprint, 2026-08-16 (SPRINT-069) — all three still correct findings, and
    that is the point.** (a) At promote: a DoD spelling `qa-check.sh` bare was not satisfied by a
    `Cites:` of `scripts/qa-check.sh`. (b) At G2: same shape again on the same file. (c) At
    system-verify: a DoD naming `run-doc-caps-fixtures.sh` by basename was not satisfied by a
    `Layers:` of `evals/`. Each cost one gate cycle and a re-word; none was a false positive, so this
    row's trivial severity holds. What the cluster adds is **frequency data**: the mismatch is not
    rare, it fires whenever prose and declaration are written at different moments by different
    hands, and it is now the token-spelling half of the wider convention problem filed as **TD-057**.
    **Unblock condition:** unchanged — a genuine false positive, or TD-057's resolution subsuming it.

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
  - **Re-reviewed 2026-08-14 (SPRINT-064 promote, 7 sprints open) — held, trigger unchanged.** SPRINT-063
    ruled two caps (ADR-019, ADR-020) without this file's exemption ever coming into question: it is a
    skill reference, uncounted by ADR-006, so the cap conversation those ADRs opened does not reach it.
    The concern stays navigational, not mechanical. **Unblock condition:** a reader or a run demonstrably
    failing to find a Part it needed — never line count alone, which is what ADR-006 already settled.
  - **Re-reviewed 2026-08-15 (SPRINT-067 promote, 3 sprints since last) — held, and the file grew
    again.** SPRINT-066 added two boundary-table rows to Part 0 and a retry-line paragraph to Part 4
    (ADR-022), and SPRINT-067 T1/T2 will add the system-verify verdict and evidence lines to Part 4 —
    all load-bearing, none skippable, which is this row's trend continuing rather than its trigger
    firing. Still no night run since SPRINT-057, so the read-under-pressure condition remains
    unmeasured. **Unblock condition:** unchanged — and the next actual night-run pre-flight should
    note which items it skims, which is one line of observation for free.

  - **Re-reviewed 2026-08-16 (SPRINT-070 promote, 3 sprints since last) — held, trigger unfired and
    unfireable so far.** The trigger is a measurement of *which pre-flight items a real run skips*, and
    no unattended run has been launched since SPRINT-057 — SPRINT-069 was attended end to end, its
    dispatch decisions taken at an interactive G2. Nothing to measure is still a different state from
    measured-and-fine, and the row waits on a run, not a sprint count. Adjacent and worth recording:
    SPRINT-069's dispatch produced TD-054's mechanism, which will change what the pre-flight checklist
    *should* say (a base-ref assertion), so acting on length before TASK-217 lands would edit a
    checklist that is about to gain an item. **Unblock condition:** unchanged — a real run, or a reader
    demonstrably skipping an item.
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
  - **Re-reviewed 2026-08-14 (SPRINT-064 promote, 8 sprints open) — held, and SPRINT-063 T4 narrowed what
    would resolve it.** EPIC-002 **D3** ruled that the 11 checkers stand alone until EPIC-003's spec gives
    them a common rule representation; this row's duplicate parser is a member of exactly that question,
    so it now **inherits D3's unblock condition** instead of carrying its own. No third drift has appeared.
    Do not re-derive a consolidation from this row before that spec exists — that is the work D3 declined.
  - **Re-reviewed 2026-08-15 (SPRINT-067 promote, 3 sprints since last) — held on the inherited
    condition.** EPIC-003 has not started (still `proposed`; TASK-198 is its opening ruling), so the
    spec this row waits on does not exist yet. No third drift; the parity fixture has still never
    fired across two more sprints of preflight runs. Nothing to re-derive.

  - **Re-reviewed 2026-08-16 (SPRINT-070 promote, 3 sprints since last) — held, and the inherited
    condition advanced for the first time.** EPIC-002 D3 parked this row until EPIC-003's spec gives
    the checkers a common rule representation. EPIC-003 is now **active** and the spec exists:
    `spec/STANDARD.md` v0.1.0, extracted at SPRINT-069 T2. The condition is **not** met — what was
    extracted is the doc standard moved verbatim, and a machine-readable rule representation is
    EPIC-004's engine, still unbuilt — but "the spec does not exist" has stopped being the reason.
    Restate the condition accordingly: this row now waits on **EPIC-004's rule representation**, not on
    EPIC-003 starting. No third drift; the parity fixture has still never fired, which this row reads
    as the design holding rather than as neglect.
  - Family note: **TD-057** (filed SPRINT-069) is the same question one level out — one `Layers:` field
    read by three matchers with three different semantics. If a consolidation is ever derived, these
    two and TD-049 are one piece of work, not three. **Unblock condition:** EPIC-004's rule
    representation, or a third drift.
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
  - **Re-reviewed 2026-08-14 (SPRINT-064 promote, 15 sprints open) — held, and this sprint finally gave it
    a live sighting.** SPRINT-063's uncommitted close work (`docs/changelog/CHANGELOG-1.35.0.md`) was
    reported by leg 15's path-2 union check as "changed but undeclared in any task's `Layers:`" — correct
    by the letter of the check and useless in substance, since close-time work belongs to no task by
    construction. It cleared the instant the COORD close commit landed. That is exactly the
    "unattributable because uncommitted" shape this row describes, and its cost was a moment's confusion:
    evidence **for** the row's own guess that no cure is warranted. **Unblock condition:** act only if a
    path-2 report ever masks a real per-task collision, rather than merely inconveniencing a close.
  - **Re-reviewed 2026-08-15 (SPRINT-067 promote, 18 sprints open) — held, trigger unchanged.** No
    union-attributable miss in SPRINT-065/066; both ran sequential single-owner tasks where the union
    and the task coincide, so the window this row describes barely opened. Sixth consecutive reaffirm,
    recorded rather than performed silently — still the ledger's worked example that a re-review which
    reaffirms is a decision.
  - **Re-reviewed 2026-08-16 (SPRINT-070 promote, 3 sprints since last) — THE TRIGGER FIRED. This row
    is now actionable, not deferred.** Its bar has always been *evidence of a real miss on the
    uncommitted path*, deliberately reaffirmed four times for want of one. SPRINT-069 T3 produced it:
    the sweep changed `.claude/CONTEXT.md`, `README.md` and `SECURITY.md`, all three declared by **T2**
    and none by T3. `check-layers-observed.sh` ran mid-work and reported **151 pass / 0 fail** — the
    union path accepting a sibling's declaration on T3's behalf, which is this row's defect stated
    exactly. The identical check then FAILed the moment the work had a commit to attribute, naming all
    three files against T3. Uncommitted: clean. Committed: three findings. Same tree, same checker.
  - **What the evidence does and does not license.** It does not show damage: the committed leg caught
    it minutes later, which is the boundary this row already called "arguably acceptable". What it
    changes is that the masking is now **observed rather than reasoned about**, and it was observed on
    the ordinary path — a coordinator running the gate to check its own WIP, which is how the gate is
    used between commits all day. The row's standing warning survives intact and binds the cure:
    **do not close this by inferring the in-flight task from open-DoD state.** That inference was a
    guess when the row was filed and is still a guess; one observation of masking is not evidence that
    a guess would have guessed right. Candidate directions worth pricing before any is chosen —
    report the WIP leg as a named SKIP rather than a PASS (the TD-051 candidate-(c) shape, cheapest and
    honest about what it did not check) · attribute WIP by staged-vs-unstaged rather than by task ·
    accept the boundary and document it where a coordinator reads it.
  - **Vehicle: TASK-218** (filed at the SPRINT-070 promote). **Unblock condition: met** — superseded by
    the vehicle. What remains open is which cure, not whether one is warranted.
