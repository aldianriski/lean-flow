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

- **TD-026** severity: trivial | status: open | created: Sprint-044
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

- **TD-025** severity: minor | status: open | created: Sprint-044
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

- **TD-022** severity: medium | status: resolved → SPRINT-043 T1 | created: Sprint-042
  - Summary: SPRINT-042 T3 gave the `Layers:` declaration a second source — the files named in each
    task's own DoD/Acceptance prose. That source is still **authored at promote**, so it catches a file
    the author *forgot* to declare but is blind to one *invented during implementation*. Proven the day
    it shipped: T3 itself created `scripts/lib/check-layers-completeness.sh`, which is absent from T3's
    declared `Layers:`, and the new check passes the Plan anyway — a DoD written at promote cannot name
    a file that did not yet exist.
  - Impact: strictly better than TD-020's original state (the forgetting case is now caught, with
    retained fixtures), but not the whole hazard. Under the concurrent dispatch this check exists to
    protect, a file invented by one agent and also touched by another still collides unseen — which is
    exactly the corrupted-merge risk, reached by a different route. Both existing sources are
    *declarations*; neither is an *observation*.
  - Mitigation (not yet done): add a third source that is **observed rather than authored** — the
    actual touched-file set at commit time (`git status`/`git diff --name-only`) diffed against the
    task's `Layers:`, reported at the commit or merge-back step. Unlike the first two it cannot be
    forgotten, because it reads what happened rather than what someone predicted. Negative-test it per
    L-058 against this sprint's own miss, which is a real recorded instance.

- **TD-021** severity: minor | status: resolved → SPRINT-043 T2 | created: Sprint-041
  - Summary: `scripts/gen-index.sh` writes `docs/knowledge-index.md` **non-atomically**. When the C:
    volume hit zero free space mid-close, the script failed partway through and left the generated
    index truncated from 34 lines to 12 — a **syntactically valid file with silently missing content**.
  - Impact: `qa-check` did catch it, but as "index STALE" — the right alarm for the wrong reason, and
    only because the truncation happened to also make it stale. A partial write that preserved
    staleness parity would have passed. A generated SSOT that can degrade into a plausible-looking
    subset of itself is the silent-false-negative shape (L-058), one layer down: nothing here is
    *wrong*, there is just less of it, and no check counts what should be there.
  - Mitigation (not yet done): write to a temp file in the same directory and `mv` it into place, so
    a failed generation leaves the previous index intact rather than a truncated one. Optionally have
    the freshness leg compare entry *counts* against the corpus, not just mtime/hash. Note the
    environment half was real and is fixed separately (`TMPDIR` moved off the full volume).

- **TD-020** severity: medium | status: resolved → SPRINT-042 T3 | created: Sprint-041
  - Summary: the dispatch preflight's **shared-file single-owner check reads `Layers:`** — a
    hand-written declaration in the sprint Plan. SPRINT-041's Plan omitted `TECH-DEBT.md` from both
    tasks' `Layers:` even though each task's DoD explicitly required marking its own TD resolved. The
    check passed on incomplete input and both agents edited the file concurrently in separate
    worktrees.
  - Impact: they merged clean only because the hunks sat ~19 lines apart — luck, not design. The
    check's *logic* is sound and negative-tested; its *input* is unvalidated, so the guard silently
    inherits whatever the author forgot at promote. This is the exact hazard concurrent dispatch
    creates, and the one check meant to catch it cannot see the omission. Applies to `Depends-on:`
    equally — an undeclared dependency is invisible the same way.
  - Mitigation (not yet done): give the declaration a **second source** rather than trusting it —
    derive a candidate touched-file set from each task's DoD/Acceptance prose and diff it against
    `Layers:`, reporting any file named in the DoD but absent from the declaration. Cheap, grep-shaped,
    and it fails toward over-reporting (a false positive costs a glance; the current false negative
    costs a corrupted merge). Must itself be negative-tested per L-058 — reconstruct SPRINT-041's own
    Plan as the must-FAIL fixture, since it is a real recorded miss.

- **TD-016** severity: minor | status: resolved → SPRINT-042 T4 | created: Sprint-039
  - Summary: `scripts/qa-check.sh` leg 12 (TD-013's fix) runs 6 zero-API eval harnesses, taking the
    gate from **~44s to ~90s (+80%)**; the two `selftest-assert-*` harnesses are ~26s of that, since
    each spins up many throwaway git repos.
  - Impact: qa-check is the always-on pre-commit gate, so the cost is paid on every commit. Still
    under two minutes, but the "fast and always-on" character it was designed around is eroding, and
    a slow gate is a gate people start skipping.
  - Mitigation (not yet done) — three options, deliberately left to the owner because two of them
    narrow what SPRINT-039 T3's DoD specified: (a) accept ~90s; (b) move leg 12 behind an opt-in
    `--full`, which reverts it to what TD-013 itself called "strictly better than nothing, not
    equivalent to a wired gate"; (c) keep the **3 snippet runners** always-on (they guard *shipped*
    `skills/**` text) and make the **2 selftests** opt-in (they guard maintainer-only assertion
    scripts). (c) is the principled cut. Trigger for deciding: a 7th harness, or the first time
    someone skips the gate because of the wait.
  - **Decided 2026-08-01 (SPRINT-042 promote, 3 sprints open) — option (c).** The trigger fired on
    schedule: SPRINT-042's Layers-completeness task lands a **7th** harness, which is exactly the
    condition this row named. Decided *before* planning rather than after the harness lands, per
    L-068 — a deferral with a written trigger is answered when the trigger fires, or it drifts toward
    never. Split: the snippet runners stay always-on (they guard shipped `skills/**` text, which is
    what a consumer receives); the selftests move behind an opt-in flag (they guard maintainer-only
    assertion scripts). Resolution lands as a SPRINT-042 task; row stays `open` until it does.
  - Resolution (SPRINT-042 T4): `qa-check.sh` leg 12 now splits `eval_harnesses_always` (the 3
    snippet runners + the layers-completeness harness landed by T3, all cheap) from
    `eval_harnesses_optin` (the 3 `selftest-assert-*` harnesses, each spinning up many throwaway git
    repos) gated behind `QA_FULL=1`. Applied the option-(c) heuristic as a proxy, not a literal rule:
    layers-completeness is maintainer-facing like the selftests but cheap, so it stayed always-on
    rather than hiding a corrupted-merge false-negative behind a flag — where the shipped-text/
    maintainer-only proxy and the runtime cost disagreed, cost won. Measured on this machine at the
    pre-T4 commit (all 7 harnesses always-on): **1m24s**, 73 pass. Post-T4 bare (4 always-on):
    **57s**, 70 pass — a ~33% cut. Post-T4 `QA_FULL=1` (all 7): **1m24s**, 73 pass — unchanged from
    baseline, confirming the flag recovers the full set rather than a subset of it.
    Verified both directions on deliberately broken input: a broken shipped-text guard
    (`night-run.md`'s stale-release leg) still FAILs the bare gate by name; a broken maintainer-only
    assertion (`assert-boundary-park.sh`'s no-completion-claim check) still FAILs under `QA_FULL=1`
    by name. Both breaks reverted and re-verified clean. Split stated in `docs/QA.md` beside the
    existing manual/gated boundary so the reduced bare-run set is discoverable, not silently dropped.

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


