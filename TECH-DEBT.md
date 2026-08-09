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

---

## Tech Debt

- **TD-038** severity: trivial | status: open | created: Sprint-050
  - Summary: `docs/research/mattpocock.md` sits at **117 lines against its 120 soft cap** with the
    corpus now fully mapped. TD-033 bought headroom by collapsing two scans to pointers; that lever is
    spent, and the next re-scan breaches on contact.
  - Impact: none today, and deliberately not pre-solved — the doc is *correct* at 117 and restructuring
    a correct doc against a hypothetical future scan is the shape TD-031 warned about. What makes this
    worth a row rather than nothing is that the breach is now **certain rather than possible**: the
    upstream repo grew 34 → 35 files between two scans, so a re-scan is a matter of when.
  - Mitigation (not yet done): at the next re-scan, split per-scan files behind an index — the option
    scan 3 rejected because one readable table was worth more than a lower line count. That trade
    reverses once the table stops fitting. Do **not** apply it before then.

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

- **TD-036** severity: minor | status: open | created: Sprint-049
  - Summary: the `Cites:` escape shipped in `check-layers-completeness.sh` (SPRINT-049 T3) is
    documented **only inside the checker**. `templates/SPRINT.md.template` — the file an author
    actually writes a Plan from — never mentions it.
  - Impact: the only way to discover the escape exists is to trip the gate and read a checker's source
    comments, which is precisely the "reword the docs until it goes quiet" behaviour TD-032 was filed
    to stop. An author who does not know the escape exists will do the thing the escape was built to
    prevent. Same family as L-069 (a behavioural rule ships with its trigger, or it does not ship) —
    here the rule shipped and the *authoring surface* did not.
  - Mitigation (not yet done): one line in the SPRINT template's Plan comment block naming `Cites:`
    alongside the `Layers:`/`Depends-on:` requirements. Note the consumer question first (L-015): the
    checker is maintainer tooling (`scripts/`, ADR-008) that no consumer runs, so a template line
    would advertise a convention nothing enforces on their side. Decide which of the two surfaces the
    line belongs to before writing it.

- **TD-035** severity: medium | status: resolved → SPRINT-049 T1 | created: Sprint-048
  - Summary: `check-layers-observed.sh` builds **one union of every task's `Layers:`** and tests each
    changed file against it. A file declared by *any* task therefore satisfies the check for *all*
    tasks — so a task editing a file it never declared passes silently, provided some other task in
    the same Plan happened to declare it.
  - Impact: this is a **false negative in the check specifically built to prevent concurrent-edit
    collisions**, and it is worse than TD-032's false positives, which are merely noisy. Observed in
    SPRINT-048 T6: that task edited `DOCS_Guide.md` and `README.md` without declaring either, and the
    gate stayed green because T4 and T2 had declared them for their own reasons. Only
    `council/SKILL.md` — declared by nobody — was caught. Under the sequential inline execution this
    sprint used, harmless. Under the **worktree-parallel dispatch this repo ships**, the ownership map
    derived from those declarations would be wrong in exactly the way SPRINT-041's corrupted merge was
    wrong, and the gate would report green.
  - Mitigation (not yet done): attribute each changed path to the task that actually changed it and
    test **per task**, not against the union. The natural discriminator is the same one TD-031 proposes
    — *who* changed it (agent branch vs coordinator) rather than *whether anyone declared it*, which is
    a point in favour of doing both together rather than patching each check again.
  - Negative-test per L-058: a Plan where task A edits a file only task B declares must **FAIL**;
    today it passes. That fixture is the proof this row is real.
  - **RESOLVED (SPRINT-049 T1) — and the negative test was run in both directions.** The union is
    gone from the committed path: each commit in `plan_commit..HEAD` is attributed to a task, and its
    files are tested against **that task's** `Layers:` alone. The fixture this row demanded
    (`cross-task-declaration`) was run against the pre-T1 checker and the post-T1 checker in the same
    throwaway repo: **old → `PASS`, exit 0 · new → `FAIL … T1:bar.txt`, exit 1.** That is the proof
    the row asked for, not an assertion that it works.
    Residual, stated rather than buried: attribution needs a commit, so **uncommitted** work in
    progress is still tested against the union — unchanged behaviour, since a mid-flight edit belongs
    to no commit yet. The collision this row is about happens between *committed* worktree branches
    at merge-back, which is the path now covered.

- **TD-034** severity: trivial | status: resolved → SPRINT-051 T4 | created: Sprint-047
  - Summary: the archived `docs/sprint/archive/SPRINT-045-gate-precision.md` carries **duplicate
    `## Files Changed` and `## Retro` sections**, plus one `### 2026-08-01 | scope-change` Execution
    Log entry stranded inside the first Retro block rather than in the Log.
  - Impact: low but confusing — a reader gets two answers to "what changed" and "what did we learn",
    with no marker saying which supersedes. Verified pre-existing at HEAD before SPRINT-047 T1 touched
    the file, so the split did not cause it; T1 deliberately left it alone (clean up your own mess
    only). Most likely an L-009 structure-adjacent fusion during that sprint's close.
  - **RESOLVED (SPRINT-051 T4) — and the mitigation below was deliberately not followed.** This row
    proposed reconciling the two pairs "into one". Diffing them first (the owner ruling at the
    SPRINT-051 promote required it) showed they are **not duplicates**: the first table is the run's
    own snapshot, carrying per-row verification state, a parked-fixture row and steps the run could not
    execute; the second is the consolidated close-time table, with close-only rows the first cannot
    have. Merging would have meant choosing which of two honest records survives — in a closed archive.
    Shipped instead: both tables **labelled** `(during execution)` and `(final, at close)`, with a note
    on the first saying what supersedes it and why it is kept. That answers this row's actual
    complaint — "no marker saying which supersedes" — at zero content loss. The stray `## Retro`
    heading held no retro content, only a misplaced Execution Log entry; the heading is gone and the
    entry moved verbatim into `archive/logs/`, tagged with why it moved. L-091's shape again: a
    Mitigation line is the filer's hypothesis, and this one was wrong about the *cause* while right
    about the symptom.
  - Original mitigation (superseded): reconcile the two pairs into one, and move the stranded entry into
    `archive/logs/SPRINT-045-gate-precision.md` where it now belongs. Cheap, but it edits a closed
    archive record, so it wants an explicit decision rather than a drive-by fix.

- **TD-033** severity: trivial | status: resolved → SPRINT-050 T1 | created: Sprint-047
  - Summary: `docs/research/mattpocock.md` now runs **136 lines against its 120 soft cap** (DOCS_Guide
    §2), carrying two scans — the 2026-07-10 original and the 2026-08-09 re-scan.
  - Impact: none functional; research caps are soft and nothing lints them, which is exactly why this
    will otherwise go unnoticed. The structural question is real though: a doc accumulating one scan
    per revisit grows without bound, and scan 1's detail is now largely historical since all three of
    its keepers shipped.
  - Mitigation (not yet done): either collapse scan 1's shipped sections to pointers (the §11
    LEARNINGS-collapse pattern applied to research), or split per-scan files with an index. Note there
    is no automated scan for research-doc caps at promote — only TODO.md's ~150 line trigger exists —
    so this row is the only thing that will resurface it.
  - **RESOLVED (SPRINT-050 T1) — the first mitigation was taken.** Scan 1 and scan 2's narrative
    sections collapsed to pointer lines in the verdict block (their keepers all shipped, so the detail
    is historical and lives in git), and every skill examined now occupies one row of a single delta
    map rather than a per-scan prose section. 136 → **114 lines** against the 120 soft cap, while
    *adding* scan 3's 10 rows and 5 keepers. The split-per-scan-file option was rejected: the value of
    this doc is one table you can read top to bottom, and an index over three files would trade that
    for a lower line count in each.
  - **Residual, and it will bite T3:** the doc has ~6 lines of headroom and T3 adds 13 more delta-map
    rows. The compression available then is collapsing the 11 scan-1/scan-2 rows into two summary
    lines, since their verdicts are already stated in the header block. Recorded here rather than left
    for T3 to discover mid-task.

- **TD-032** severity: minor | status: resolved → SPRINT-049 T3 | created: Sprint-047
  - Summary: `scripts/lib/check-layers-completeness.sh` cannot distinguish a file the task **will
    touch** from a file its prose merely **mentions**. It fired three times in one task during
    SPRINT-047 T1 — on a `CHANGELOG.md` used as an analogy ("the CHANGELOG.md shape"), on a fixture
    harness named only as a cross-reference, and once legitimately.
  - Impact: TD-020 deliberately made this check fail toward over-reporting, and that trade is still
    right — its false negative once cost a corrupted merge. But the false positives have a shape: they
    all involve a **backtick-quoted filename in explanatory prose**, and the only fix available to the
    author is to *reword the explanation* so the gate stops seeing it. That is the tail wagging the
    dog: a check that makes docs worse to keep itself quiet. Three in one task is the first time the
    cost has been concentrated enough to notice.
  - Mitigation (not yet done): consider narrowing the derivation to prose in **DoD/Acceptance lines
    only** (excluding the free-text rationale paragraph), or honouring an explicit inline escape for
    "mentioned, not touched". Negative-test either per L-058: SPRINT-041's real miss — a TD marked
    resolved with `TECH-DEBT.md` undeclared — must still FAIL.
  - Related: TD-031 names the sibling complaint about `check-layers-observed.sh` asking the wrong
    question. Two rows now describe the same family; if a third arrives, the checks want a rethink
    rather than another narrowing.
  - **Sprint-048 update — the third arrived, and the count is no longer arguable.** The check fired
    **~11 times in one sprint**, every single time on a file that was only *mentioned* in prose: an
    analogy ("the `CHANGELOG.md` shape"), a cross-reference to a fixture harness, a coordination note
    naming another task, a citation of a research doc read as a source. **Every instance was resolved
    by rewording the documentation so the gate would stop seeing a filename** — the check is now
    actively shaping prose to keep itself quiet, which is the tail wagging the dog. Its sibling
    TD-035 (filed this sprint) is the third row in the family, so the trigger this row set — "if a
    third arrives, the checks want a rethink rather than another narrowing" — **has fired**. Treat
    TD-031 · TD-032 · TD-035 as one redesign, not three patches.
  - **RESOLVED (SPRINT-049 T3) — and this row's own proposed mitigation was falsified first.** The
    Mitigation line above proposed narrowing the derivation to "DoD/Acceptance lines only, excluding
    the free-text rationale paragraph". Replaying the checker across all 11 revisions of the
    SPRINT-048 Plan shows every false positive sitting **inside a DoD checkbox item** — a source read
    (`fog-fleet-orchestration.md`), a pipeline explanation (`requirements.md`), a retrospective note
    (`T6`). The narrowing would have fixed none of them, because the discriminator is the token's
    *role in the sentence*, which no line-scoped filter separates.
    Shipped instead: an explicit **`Cites:`** declaration line beside `Layers:`/`Depends-on:`, listing
    tokens that are cited-not-touched, exempting them from legs (a) and (c). Absence changes nothing
    — an unescaped mention still FAILs — so an author who forgets the escape gets today's behaviour,
    never a silent pass (L-071). The escape's own abuse case is a named FAIL: a token in both `Cites:`
    and `Layers:` is a contradiction. Leg (a) was deliberately **not** demoted to a WARN: it is the
    only validation of `Layers:` that runs before any file changes, and the dispatch ownership map is
    derived from `Layers:` at promote, so the observed checker cannot substitute for it — it fires
    after the collision it exists to prevent.
    Also fixed here, a third defect found during the work: a **wrapped `Layers:` declaration was
    silently truncated** to its first line by both checkers, turning every path on the continuation
    into a simultaneous "undeclared" and "prose-implied" false positive under a misleading finding.
    Indented continuations are now read by both; an unindented one is its own named FAIL rather than
    being reclassified as prose.
    Fixtures retained (TD-012): `sprint-048-citations.md` (must-PASS, the three real shapes) ·
    `cites-contradiction.md` · `unindented-continuation.md`, plus the two pre-existing must-FAIL rows,
    all wired into `evals/run-layers-completeness-fixtures.sh`.

- **TD-031** severity: minor | status: resolved → SPRINT-049 T1 | created: Sprint-046
  - Summary: the observed-layers check's exclusion list has grown by one entry per sprint for four
    sprints — close bookkeeping, the generated index, the pre-flight settings file, and now agent
    worktree paths. Each entry was individually correct and individually reasoned; the pattern is the
    problem.
  - Impact: the check asks *"did a task declare this file?"* when what it means is *"was this change
    task work, or coordinator/tooling bookkeeping?"*. Those coincide for task files and diverge for
    everything else, so every new class of non-task change arrives as a false positive and is answered
    with another exclusion. The list stays honest only as long as someone applies L-082's test to each
    entry, and a list that must be defended entry-by-entry forever is a design smell, not a guard.
  - Mitigation (not yet done): consider deriving the answer instead of enumerating it — attribute
    changed paths to *who* changed them (task commits on an agent branch versus coordinator commits on
    the main tree) rather than to whether a frozen declaration named them. **Explicitly not urgent**:
    the check works, each exclusion is defensible, and a redesign of a functioning guard under no
    pressure is how a working thing gets broken. Trigger for acting: a **sixth** exclusion, or the first
    one that fails L-082's test.
  - Owner decision (SPRINT-046 promote): add TD-030's entry now, file this pattern rather than solve it
    under time pressure.
  - **RESOLVED (SPRINT-049 T1) — the check now asks the question this row said it meant.** Changed
    paths are attributed to *who* changed them: a `Task: T<n>` trailer, else one of three real subject
    forms this repo produces (`sprint(NN) T<n>:` · `merge(…): T<n>` · trailing `(SPRINT-NNN T<n>)`),
    else `sprint(NN):` as coordinator bookkeeping, else **UNATTRIBUTED — a named FAIL**. That last
    branch is deliberate: five real task commits in this repo carry no id at all, and defaulting them
    to "coordinator" would have passed their files silently, rebuilding TD-035 one layer down.
    The exclusion list this row was filed about shrank from **ten entries to three** on the committed
    path — `TECH-DEBT.md`, `TODO.md`, `CHANGELOG.md`, `docs/LEARNINGS.md`, both settings files and
    both plugin manifests are all answered by attribution instead of enumeration. The three that
    remain are the ones attribution genuinely cannot cover, each re-justified in place: `docs/sprint/*`
    (a task commit writes its own DoD ticks and log entry), `docs/knowledge-index.md` (generated, not
    a coordination concern), `.claude/worktrees/agent-*` (created after the Plan freezes).
    The full list still applies to the **uncommitted** path, where there is no commit to attribute —
    stated in the checker rather than left implicit.

