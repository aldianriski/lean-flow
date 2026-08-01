---
owner: Maintainer
last_updated: 2026-08-01
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

- **TD-030** severity: minor | status: resolved → SPRINT-046 T2 | created: Sprint-045
  - Summary: the worktree dispatch protocol creates agent worktrees **inside the repo**
    (`.claude/worktrees/agent-<id>/`), and the observed-layers check counts those paths as changed-but-
    undeclared. Every parallel run produces this FAIL for as long as the worktrees exist.
  - Impact: transient — it clears when the worktrees are pruned at cleanup, verified by re-running the
    gate rather than assumed — but it fires on *every* fan-out, so a run's post-merge gate is red for
    reasons unrelated to its work. Same cry-wolf shape TD-026 just fixed, different instance.
  - Mitigation (not yet done): exclude the agent-worktree path prefix with a stated reason, as the
    other structural exclusions are. Note the tension: this is the **fourth** exclusion in four sprints
    — the list is answering "did a task declare this?" when it means "was this task work or coordinator
    bookkeeping?". Add the exclusion, but weigh whether the check should ask the second question.

- **TD-029** severity: minor | status: open | created: Sprint-045
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

- **TD-028** severity: medium | status: resolved → SPRINT-046 T1 | created: Sprint-045
  - Summary: a **directory-prefix permission rule does not match**. `Bash(sh evals/:*)` was written to
    authorize the eval harnesses and denied every one of them, while `Bash(sh scripts/qa-check.sh:*)` —
    the exact-file form — works. The broader-looking rule is the one that silently fails.
  - Impact: this is night-run.md's own "pin one rule syntax" warning firing for real, and worse than a
    plain gap: the rule *looks* correct in the settings file, so a reader reviewing the allowlist sees
    coverage that does not exist. Combined with the `cd`-prefix ban, the practical consequence during
    SPRINT-045 was that a harness inside an agent worktree could not be executed at all.
  - Mitigation (not yet done): establish empirically which rule forms actually match (exact-file,
    prefix, glob) and state the finding where the derivation is described, rather than inferring a form
    from documentation. Until then prefer exact-file rules and treat any broader form as unverified.

- **TD-027** severity: medium | status: CLOSED — not supported → SPRINT-046 T1 | created: Sprint-045
  - Summary: the **permission surface degraded mid-session**. In SPRINT-045's run, `awk … > file` and
    `sh <path>` were denied *after* the identical command forms had succeeded earlier in the same
    session — they are how the wave-start preflight was extracted and executed. The T1 agent
    independently reported the same shape in its own sandbox: every `sh` and `awk -f <file>` invocation
    denied regardless of allowlist match, while inline `awk '…'` kept working.
  - Impact: materially different from TD-023's form-failure story, and it partly undercuts it. If the
    surface can narrow mid-run, then **allowlist derivation — a static exercise done at pre-flight —
    cannot fully protect a long run**, however well derived. Five denials total this run; the run
    recorded each once and correctly did not re-wrap them (Part 4).
  - Mitigation (not yet done): **reproduce before theorising** (TD-024's lesson). Establish whether the
    trigger is elapsed time, turn count, a tool-call budget, or something else, by replaying one known-
    good command form at intervals within a single headless session. Only then decide whether the fix
    is a run-length cap, a re-derivation checkpoint, or guidance to prefer inline forms.
  - **Owner decision (SPRINT-045 close): reproduce first, do not mitigate yet.** A defence shipped
    against an unpinned mechanism is what produced TD-024's two wrong diagnoses and the `pwd -W` sweep
    nearly applied to a phantom. The reproduction is the next sprint's first task; guidance waits on
    what it finds.
  - **CLOSED — NOT SUPPORTED (SPRINT-046 T1). The hypothesis was falsified, not fixed.** A 26-turn
    session replaying a known-good rule form produced **zero denials**, so degradation did not
    reproduce. The actual discriminator is the **redirect**: same session, same loaded rules — relative
    path → 0 denials · absolute path → 0 · `sh … > file` → 1, reproduced. SPRINT-045's denied commands
    were `git show … > file` and `awk … > /tmp/file`, both redirects. They are therefore an instance of
    the **existing** bare-invocation rule (L-077), not a new phenomenon, and no structural defence is
    warranted. Evidence → `docs/research/headless-permission-surface.md`.
  - Residual, explicitly **not established**: why `sh /tmp/pf-045.sh` was denied in SPRINT-045, given
    absolute paths probe clean. Its logged command was truncated at 80 characters, so the full form is
    unknown. Recorded as unknown rather than folded into the redirect story — the habit of attaching a
    plausible mechanism to an unexplained symptom is what put this row here twice.
  - **Reopen only on new evidence**: a long run that hits the same shape *after* the redirect
    explanation has been excluded. Reproduce-before-theorising applies to the reopen too.

- **TD-026** severity: trivial | status: resolved → SPRINT-045 T2 | created: Sprint-044
  - Summary: the two-commit convention for `plan_commit`/`close_commit` (commit, then record the sha in
    a follow-up) collides with the observed-layers check, which reads `plan_commit` from frontmatter.
    Between the `plan locked` commit and the sha-recording commit the gate necessarily reports
    `plan_commit not recorded` — one FAIL, by construction, in a window that always exists.
  - Impact: cosmetic but corrosive. Anyone running the gate in that window sees a red result that is
    neither a defect nor actionable, and a gate that cries wolf on a known-good state is a gate people
    start reading past. The check is otherwise behaving correctly — it names its finding rather than
    passing (L-059).
  - Mitigation (not yet done): let the check treat an unset-but-placeholder `plan_commit` on a sprint
    whose `status:` just became active as a `SKIP` with a named reason, rather than a FAIL — or record
    the sha in the same commit by writing it post-hoc, which the current convention deliberately avoids.
    Either way the fix should not weaken the genuine "plan_commit missing at execute time" case.

- **TD-025** severity: minor | status: resolved → SPRINT-045 T1 | created: Sprint-044
  - Summary: the dispatch preflight's shared-file check requires a **direct** `Depends-on:` edge between
    every pair of tasks touching one file. A transitive chain (`T1→T2→T3→T4`, all editing one reference)
    orders those tasks unambiguously, but the check HALTs on the pairs without a direct edge.
  - Impact: a false positive that blocks a legitimate Plan. SPRINT-044 hit it at promote with four tasks
    chained on one file and worked around it by writing redundant edges (`Depends-on: T1, T2, T3`),
    which is noise that will be copied by the next Plan. The check's *intent* — no unowned concurrent
    edit — is fully satisfied by a chain, since strictly sequential execution cannot collide.
  - Mitigation (not yet done): compute the transitive closure of `Depends-on:` before the pairwise
    check, so an ordering derivable through the chain counts as owned. Negative-test it per L-058: a
    genuine unowned overlap (two rank-0 tasks, no path between them) must still FAIL.

- **TD-024** severity: minor | status: resolved → SPRINT-044 T3 | created: Sprint-043
  - **ROOT CAUSE FOUND (SPRINT-044 T3), fully reproducible.** `MSYS_NO_PATHCONV=1` in the environment.
    It is exported on this host so a bare `/orchestrator …` prompt isn't rewritten into a Windows path
    before reaching `claude.exe` (L-067) — and it is **inherited**, so it reached the gate and every
    harness the gate spawns, disabling path translation and breaking `git -C` on a POSIX path. With it
    set: `72 pass, 1 fail` emitting `could not resolve live HEAD in /d/Project/lean-flow` — the exact
    string this row recorded. Without it: `73 pass, 0 fail`, three consecutive runs.
  - Why it was hard to see: the variable is set at the *trigger*, and the symptom appears in an
    *unrelated gate* two layers down. Both earlier diagnoses were near-misses — the first blamed `git -C`
    on MSYS paths generally (false: it works fine unset), the second guessed transient worktree state.
    Neither was wrong about *where*; both missed the environment as the *what*.
  - Resolution: `scripts/night-run.sh` clears the variable around the pre-flight gate only, in a
    subshell, leaving the fired command's environment untouched. **Residual, accepted and stated:** a
    maintainer running `qa-check` by hand with the variable exported still sees the spurious FAIL. The
    guard is behaving correctly in that case — it names its finding and exits — so this is a
    surprising-message problem, not a coverage gap.
  - Summary: during SPRINT-043's unattended run, `evals/run-dispatch-preflight-fixtures.sh` emitted
    `FAIL harness: could not resolve live HEAD in /d/Project/lean-flow` and exited 2. The symptom was
    real throughout; two successive diagnoses filed with it were not.
  - Provenance worth keeping: filed by an unattended run that correctly **parked** rather than fixing it
    mid-flight — the park was right — but nothing inside a headless run can challenge its own diagnosis,
    because there is no one to challenge it. The SPRINT-043 close re-checked it and downgraded it;
    SPRINT-044 root-caused it. A finding produced without an ask channel still needs verifying
    (L-078's family). The `pwd -W` sweep the first diagnosis proposed was never applied, which is the
    outcome that mattered — it would have hardened seven harnesses against a mechanism that never
    existed.

- **TD-023** severity: medium | status: resolved → SPRINT-044 T2 | created: Sprint-043
  - Summary: `night-run.md` Part 1's allowlist derivation names the four **sources** a command must be
    derived from, but says nothing about the **form** the command is issued in. `dontAsk` matches the
    literal invocation, so `git worktree add …` issued bare was permitted while the identical operation
    wrapped as `cd X && … 2>&1 && echo …` was denied.
  - Impact: an allowlist can be derived perfectly from all four sources and still deny the landing
    path, which is the failure SPRINT-042 T1 exists to prevent — reached by a different route. Observed
    live in SPRINT-043 on `git worktree add` and twice more on ordinary compound read commands. The
    consequence is worse than a lost task: the run's natural fix (strip the `cd`) removed the anchor
    that kept commands pointed at the right tree (L-079).
  - Mitigation (not yet done): state in Part 1 that landing-path commands are issued **bare** — one
    command per invocation, no `cd` prefix, no `&&` chain, no redirect — and that anchoring is done
    with `git -C <abs-path>` rather than by changing directory. Note the interaction with L-057's
    never-pipe rule: both point the same way, for different reasons.

- **TD-014** severity: minor | status: resolved → SPRINT-044 T1 | created: Sprint-038
  - Summary: `skills/orchestrator/references/night-run.md` is now **427 lines**, carrying the Part 0
    contract, the entry path, the pre-flight pass, and **two ~100-line embedded shell snippets**
    (skill-freshness + worktree-usability).
  - Impact: uncounted against the SKILL.md cap (ADR-006, it's a `references/` file) so no lint fires,
    but it is past comfortable reading for the audience that most needs it — someone deciding whether
    to fire an unattended run. A cold reader must scroll two code blocks to reach Part 2's trigger.
  - Mitigation (not yet done): split the capability checks into their own `references/` sibling if a
    third snippet lands. Not urgent at two; the trigger is the third.
  - **Re-reviewed 2026-07-30 (SPRINT-041 promote, 3 sprints open — kept open).** The trigger is
    unchanged and still unfired: night-run.md carries the same two embedded snippets it did at
    SPRINT-038. SPRINT-040 added no snippet there, and TD-019's planned fix lands a leg in
    `qa-check.sh`, not a third block in this file. Splitting now would cost a reader one more hop for
    no reduction in what they must read. Next re-review at SPRINT-044 promote, or immediately if a
    third snippet lands.


