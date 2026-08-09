---
owner: Maintainer
last_updated: 2026-08-09
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

- **TD-044** severity: minor | status: resolved → SPRINT-056 T3 | created: Sprint-055
  - Summary: `check-layers-observed.sh` runs two paths with two different exclusion lists —
    `is_excluded()` for uncommitted WIP, `is_excluded_committed()` for history — and `TODO.md` is on
    the first and not the second, so the same undeclared edit is invisible while uncommitted and a
    violation once committed.
  - **Corrected at close (2026-08-09):** this row was first filed calling the asymmetry an oversight.
    It is not. `docs/QA.md` documents it as deliberate — the committed path is *intentionally* stricter
    ("exclusions down to three … since attribution answers the rest by role", TD-031/TD-035/TD-037
    lineage), because a commit can be attributed to a task and uncommitted work cannot. The design is
    sound and the row stands on a narrower claim: not that the lists disagree, but that **the feedback
    arrives after the moment it was cheap to act on**. A violation stays invisible through the whole
    task, then surfaces attributed to a task already finished and pushed — where the only remedies are
    amending closed history or correcting a frozen Plan after the fact. Filed the way it was because
    the checker's source was read and the doc explaining its intent was not (L-098's shape, one sprint
    after L-098 was filed).
  - Impact: observed in SPRINT-055 T6, which stamped `origin:` onto seven `TODO.md` Backlog entries as
    task work. Its gate ran green while the edit sat uncommitted; the finding surfaced during T7,
    attributed to a task already finished and pushed. Attribution to a closed task is the damaging
    part — the person who can fix it has moved on, and the natural response is to widen an exclusion
    list rather than declare the file.
  - Why the WIP exclusion exists and is not simply wrong: `TODO.md` is excluded there as "backlog
    bookkeeping, written at close", which is correct *at close*. It is wrong for a task whose actual
    work is editing `TODO.md`. The lists need to disagree about close-time bookkeeping and agree about
    task work, and today they encode only the first half.
  - Mitigation (**not yet derived — this is the problem, not the plan**, L-091): resist narrowing or
    widening either list on this single observation (TD-031's pattern). The real question is whether
    exclusion should key on the *file* or on the *phase that touched it*, and that has not been
    designed. Evidence for the problem is above; the fix is not.
  - Same family as Edit-safety trap (c): a report that describes the reporter's state rather than the
    artifact's.

- **TD-043** severity: minor | status: resolved → SPRINT-056 T1 | created: Sprint-055
  - Summary: SPRINT-055 T1 taught both layers checkers that a `Layers:` token ending in `/` is a
    directory prefix. The **dispatch preflight** (`dispatch.md`) extracts only dot-bearing tokens
    (`[A-Za-z0-9_./-]+\.[A-Za-z0-9]+`), so a directory token is invisible to its **shared-file overlap**
    check. Two tasks could both declare `evals/fixtures/` and the preflight would report no overlap.
  - Impact: bounded today and deliberately so — the rule "declare a directory only for a tree ONE task
    owns" is stated in both checkers' header comments and in the T1 Execution Log entry. But it is
    **guarded by a comment, not a check**, which is precisely the shape TD-041 and this whole sprint
    were about. SPRINT-055 itself used directory tokens in three task blocks (`evals/`, `docs/epic/`),
    each singly-owned, so no overlap was possible — the exposure is a future sprint, not this one.
  - Mitigation (**not yet derived**, L-091): the preflight's token regex could be widened to accept a
    trailing `/` and its overlap comparison made prefix-aware, but that script is embedded in a fenced
    block inside a consumer-facing reference (`skills/orchestrator/references/dispatch.md`) and is
    covered by its own fixture suite, so the change is larger than it looks. Alternatively directory
    tokens could be rejected outright in a Plan that has more than one task — cheaper, and it removes
    the feature's only sharp edge. Decide before a sprint declares the same directory twice.

- **TD-042** severity: minor | status: resolved → SPRINT-056 T4 | created: Sprint-054
  - Summary: the sprint checks in `qa-check.sh` gate on `[ "$st" = "active" ] || continue`, so setting
    `status: closed` **disarms four of them in the same commit that makes the largest edit to the
    file**. The Retro, the four-bucket routing and `close_commit` are written unguarded. Worse, the two
    layers checks do not go quiet — they print `PASS layers completeness (0 block-check(s) verified)`
    and `PASS layers observed (0 sprint file(s) verified)`, which in a green run is indistinguishable
    from real coverage.
  - **Second instance, SPRINT-055 close (2026-08-09).** Same mechanism, larger drop: **94 pass → 87
    pass, 0 fail** the moment `status: closed` was written — seven checks silenced by the commit that
    added the Retro, the four-bucket routing and the close bookkeeping. Two sprints running, so the row
    is not hypothetical. What is new is the confirmation that the *ordering* half is the real defect:
    the artifact was verified by hand instead (271/400 lines · 7 task blocks · 0 open DoD · 14 schema
    block-checks re-run against a copy with `status` forced back to `active`, no FAIL lines), and it was
    clean — so nothing was hidden this time. That is luck about the content, not evidence about the
    guard. A close that *did* break the schema would have reported the same green.
  - Impact: observed live at Sprint-054's close — the run went 72 pass → **68 pass, 0 fail**, and the
    drop is only visible if you happen to be comparing counts across runs. A PASS over an empty input
    set is the L-058 family in its purest form: the check cannot fail, so its green says nothing. The
    scoping itself is defensible (a closed sprint is history; re-validating it forever is noise) — the
    defect is the **ordering**, since status flips and content changes in one commit, and the
    **reporting**, since zero-verified announces itself as a pass.
  - Mitigation (not yet done) — a hypothesis, per this ledger's header: make a zero-verified result
    report as a skip rather than a PASS (`note` already exists for exactly this and is used elsewhere
    in the script). **Re-derive before building**: that is the reporting half only, and it may be the
    whole fix if closing is genuinely the right place to stop validating — decide whether the close
    commit should be validated *before* the status flip is honoured, which is the ordering half and
    the more invasive of the two. Ships with a must-FAIL fixture per changed check (L-058).

- **TD-041** severity: minor | status: resolved → SPRINT-056 T2 | created: Sprint-054
  - Summary: `scripts/qa-check.sh` cap-checks `skills/*/SKILL.md`, `.claude/CLAUDE.md`,
    `.claude/CONTEXT.md` and `docs/sprint/SPRINT-*.md`. It does **not** cap-check `docs/research/`,
    although DOCS_Guide §2 gives those files a 120 soft cap. Same gap for any other §2 row with a
    stated cap and no check — the coverage was never derived from the table.
  - Impact: a stated cap with nothing behind it is a comment, and it drifted in exactly that way.
    `docs/research/mattpocock.md` absorbed **39 lines over its cap across four sprints** with no
    signal, while TD-038 sat open citing a line count that had been wrong since the sprint it was
    filed in. The failure is silent by construction: nothing reports, so absence of a complaint reads
    as compliance — the L-058 family, one level up from a check that cannot fail to a check that does
    not exist. Filed rather than fixed inside SPRINT-054 T4 because the owner ruled a split, not a
    gate change, and a new gate check ships with its own must-FAIL fixture (L-058) — which makes this
    a task, not a drive-by.
  - Mitigation (not yet done) — a hypothesis, per this ledger's header: extend the existing `cap`
    helper over `docs/research/*.md` at 120. **Re-derive first**, on two points the cheap version
    ducks. (a) Whether the cap belongs to the *check* or to the §2 table — hand-listing globs in the
    script is how the coverage got out of step with the standard in the first place, so deriving the
    list from §2 may be the actual fix. (b) Whether 120 is right for a doc tracking a 35-file corpus;
    §7 says a cap moves only by ADR after a measured diet, and T4 has now done the diet (159 → 110),
    so the figure has evidence behind it either way.

- **TD-040** severity: minor | status: resolved → SPRINT-056 T1 | created: Sprint-053
  - Summary: the **dispatch preflight snippet** (`orchestrator/references/dispatch.md`) matches only
    lines beginning `Layers:` / `Depends-on:`, so an **indented continuation line is invisible to it**.
    The full `check-layers-completeness.sh` reads continuations correctly (SPRINT-049 T3); the snippet
    never got the same treatment.
  - Impact: a **silent false PASS** on shared-file ownership — the exact L-058 family. Observed live at
    the SPRINT-053 promote: T4's `Layers:` wraps, so its `DOCS_Guide.md` entry sat on the continuation
    line and the preflight never reported the T1/T4 overlap. Harmless there only because T4 already
    declared `Depends-on: T1`, so the overlap was owned anyway — luck, not the check. A wrapped
    declaration is the normal shape for a task touching three or more files, so this is not exotic.
  - Mitigation (not yet done) — a hypothesis, per this ledger's header: teach the snippet the same
    indented-continuation rule the full checker already implements, and give it the must-FAIL fixture
    that rule has there (L-058). Re-derive first: confirm the snippet is still the surface worth fixing
    rather than having it call the real checker, which would remove the duplication that caused the
    drift instead of patching it a second time.
  - **Second live sighting, SPRINT-054 promote (2026-08-09).** Same shape, one sprint later: T1's
    `Layers:` wrapped across four lines, the snippet parsed only the first, and five declared files —
    including `.claude/CLAUDE.md` — were invisible to it. The T1/T2 overlap on that file was never
    examined, and the snippet still printed `PREFLIGHT: CLEAR`. Harmless a second time for the same
    reason as the first: the overlap already carried a `Depends-on:` edge, so it was owned anyway.
    Twice is the count that makes this a property of the check rather than an unlucky Plan — a wrapped
    declaration is the normal shape for a multi-file task, and both sightings were caught by a human
    reading the parsed record, which is not a control.

- **TD-038** severity: trivial | status: resolved → SPRINT-054 T4 | created: Sprint-050
  - Summary (**as filed, and wrong within its own sprint**): `docs/research/mattpocock.md` sits at
    117 lines against its 120 soft cap; the next re-scan breaches on contact.
  - **The breach had already happened when this row said it hadn't.** Measured at SPRINT-054 T2 with
    `git show <sha>:<path> | wc -l`: 114 at `5fa44de` (SPRINT-050 T1) → 117 at `4793504` (T3) → **124
    at `bab405f`** — SPRINT-050 T2, four commits after this row was filed in that same sprint — → 143
    after T2 → 159 after T3. So the row's premise ("*none today*… the doc is **correct** at 117"), its
    trigger (a future re-scan) and the SPRINT-053 re-review that held on those grounds were all
    reasoning from a number that had stopped being true. **Nothing caught it because `qa-check.sh`
    cap-checks `skills/*/SKILL.md`, `.claude/*` and `docs/sprint/SPRINT-*.md` — not `docs/research/`.**
    A soft cap with no check behind it is a comment. Third row in a row whose stated premise was
    falsified at execution (TD-036's Summary · TD-034's cause · this): L-091 one level up again.
  - **RESOLVED (SPRINT-054 T4)** — split by moving whole sections, never compressing (§7: knowledge
    docs split, ledgers compress). Parent 159 → **110**, under the cap with headroom for scan 5. Scan
    3's keeper detail → `docs/research/mattpocock-scan3-keepers.md` (44); the two closed-tension
    verdicts and their evidence → `docs/research/mattpocock-tensions.md` (55). The parent keeps the
    question, corpus, scan-verdict block, the full delta map, and a one-line pointer to each verdict.
    Applied *now* rather than at "the next re-scan": the trigger this row named was written against a
    hypothetical breach, and the real one was two sprints old and measured.
  - Residual, deliberately not fixed here: the `docs/research/` cap gap above. The owner ruled a split,
    not a gate change, and a new gate check needs its own must-FAIL fixture (L-058). → Retro follow-up.

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
