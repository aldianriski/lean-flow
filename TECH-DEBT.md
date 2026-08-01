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

- **TD-024** severity: minor | status: open — **diagnosis corrected, cause unconfirmed** | created: Sprint-043
  - Summary: during SPRINT-043's unattended run, `evals/run-dispatch-preflight-fixtures.sh` emitted
    `FAIL harness: could not resolve live HEAD in /d/Project/lean-flow` and exited 2. The **symptom was
    real and is recorded**; the cause originally filed with it was not.
  - **Correction (verified interactively at the SPRINT-043 close, on the main tree).** The original row
    blamed `git -C` being unable to resolve POSIX-style MSYS paths. That does not reproduce:
    `git -C /d/Project/lean-flow rev-parse HEAD` → exit 0, and `git -C` on a fresh `mktemp -d` path →
    exit 0. The harness itself runs **all green** with `TMPDIR` set and unset, and `qa-check.sh` is
    **67 pass / 0 fail** — so the claim that it "has been reporting this as its single FAIL" does not
    hold either. The guard that fired is *correct behaviour*: it named its finding and exited rather
    than passing (L-059), so the harness did its job.
  - Impact: low, and not what was first written. The dispatch-preflight guard is **not dark** on the
    main tree. The likelier cause is transient run state rather than a path-resolution defect — the
    run's own L-079 records its cwd drifting into an agent worktree, and a `$repo_root` pointing at a
    worktree already removed would produce this exact empty-`rev-parse` result. That remains a
    hypothesis; nobody has reproduced it.
  - Mitigation (not yet done): **do not apply the original `pwd -W` sweep** — it would harden the
    harnesses against a mechanism that has not been shown to exist, and T1 already shipped one such
    guarded workaround on this reasoning. First **reproduce**: run the harness with `$repo_root`
    pointing at a removed worktree and confirm the message. If that is the cause, the fix is for the
    harness to validate `$repo_root` is a live work tree before use, not to normalize path style.
  - Note on provenance: filed by an unattended run that correctly parked rather than fixing it
    mid-flight. The park was right; the diagnosis inside it was not independently checked, which is
    why the close re-checked it. A finding produced without an ask channel is still a finding that
    needs verifying (L-078's family).

- **TD-023** severity: medium | status: open | created: Sprint-043
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

- **TD-014** severity: minor | status: open | created: Sprint-038
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


