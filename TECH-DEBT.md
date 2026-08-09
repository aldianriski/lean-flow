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

- **TD-035** severity: medium | status: open | created: Sprint-048
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

- **TD-034** severity: trivial | status: open | created: Sprint-047
  - Summary: the archived `docs/sprint/archive/SPRINT-045-gate-precision.md` carries **duplicate
    `## Files Changed` and `## Retro` sections**, plus one `### 2026-08-01 | scope-change` Execution
    Log entry stranded inside the first Retro block rather than in the Log.
  - Impact: low but confusing — a reader gets two answers to "what changed" and "what did we learn",
    with no marker saying which supersedes. Verified pre-existing at HEAD before SPRINT-047 T1 touched
    the file, so the split did not cause it; T1 deliberately left it alone (clean up your own mess
    only). Most likely an L-009 structure-adjacent fusion during that sprint's close.
  - Mitigation (not yet done): reconcile the two pairs into one, and move the stranded entry into
    `archive/logs/SPRINT-045-gate-precision.md` where it now belongs. Cheap, but it edits a closed
    archive record, so it wants an explicit decision rather than a drive-by fix.

- **TD-033** severity: trivial | status: open | created: Sprint-047
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

- **TD-032** severity: minor | status: open | created: Sprint-047
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

- **TD-031** severity: minor | status: open | created: Sprint-046
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

- **TD-029** severity: minor | status: resolved → SPRINT-048 T5 (**residual: the buffering mechanism was never reproduced**) | created: Sprint-045
  - Summary: the launcher's `ALIVE` test requires observable progress — a log line or a new commit —
    but `claude -p --output-format json` **buffers all output until exit**, so the log stays empty for
    the entire run. A healthy run is reported `DEAD-ON-ARRIVAL`.
  - Impact: observed live. SPRINT-045's fire returned `DEAD-ON-ARRIVAL: … no observable progress in
    150s` while the run was working normally and went on to land both units. The verdict is advisory —
    the run is detached and continues — but a launcher whose headline output is wrong is worse than one
    with no verdict, because the operator acts on it. `night-run.md` Part 3 already names the right
    format (`stream-json`, which emits incrementally); the conflict is that `json` is what exposes
    `total_cost_usd` for the calibration row, so the two needs pull opposite ways.
  - Mitigation (not yet done): accept `stream-json` and treat any new line as progress; **or** detect a
    buffered output format and report a named `UNKNOWN` rather than `DEAD-ON-ARRIVAL`, since the
    inference ("the prompt may have been rejected") is simply invalid when no output can appear.
  - **Re-reviewed 2026-08-09 (SPRINT-048 promote, 3 sprints open) — escalated, not deferred again.**
    The trigger is unchanged and the row has aged the full window without action. It also fits L-087's
    newly-promoted rule closely enough to be worth naming: the *symptom* (a healthy run reported
    `DEAD-ON-ARRIVAL`) is precisely recorded, and the *mechanism* (`json` buffers until exit) is stated
    but never actually tested — no probe has confirmed the launcher goes quiet for buffering rather than
    for some other reason. **Scheduled as SPRINT-048 T5**, whose first step is therefore to reproduce
    the buffering claim before choosing between the two mitigations, not after.
  - **RESOLVED (SPRINT-048 T5) — note carefully what was and was not established.**
    **Reproduced:** the launcher reports `DEAD-ON-ARRIVAL … the prompt may have been rejected` for a
    process that is perfectly healthy and merely silent — shown live against `sh -c 'sleep 40'` with a
    0-byte log. No paid call was needed, because the defect lives in the launcher's *inference*, not
    in Claude. **NOT reproduced:** that `--output-format json` is what makes a real run silent; that
    needs a paid headless run and was not spent speculatively.
    The fix was chosen **because it does not depend on the unreproduced half**: a third verdict,
    `UNKNOWN` (exit 2), stating what was observed instead of asserting a cause, and naming the
    buffering format when the fired command carries it. The `stream-json` switch was deliberately
    **not** taken — it *does* depend on the mechanism, and it would trade away the `total_cost_usd`
    the calibration row reads off `json`. Preferring "not established" over a plausible story is
    L-087, promoted this same sprint.
    **Residual, explicitly open:** why a real `json` run stays silent past the window is still
    unestablished. Reopen on evidence from an actual run — never on another inference.






