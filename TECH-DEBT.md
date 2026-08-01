---
owner: Maintainer
last_updated: 2026-08-01
update_trigger: Tech debt filed (Sprint Close), aged (Sprint Promote), or resolved
status: current
---

# lean-flow — Tech Debt Ledger

> Filed automatically by the Sprint Close Retro (`TD-NNN` rows) · aged at Sprint Promote
> (unaddressed ≥ 3 sprints → re-review; `severity: high` → auto-escalate to `TODO.md` Backlog P1) ·
> never deleted — resolved → `status: resolved → TASK-NNN`; ≥ 3 sprints later the row collapses to
> one line in § Resolved (§11). IDs are monotonic, never reused. `severity` ∈ trivial · minor · medium · high.

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

- **TD-019** severity: minor | status: resolved → SPRINT-041 T1 | created: Sprint-040
  - Summary: the park-record behaviour SPRINT-040 T2 shipped has **no retained guard**. Its positive
    half — that a headless `migrate`/`init` writes a `/handoff` park record — was verified by two real
    runs whose artifacts land at machine-specific `%TEMP%` paths, so `assert-noaction-park.sh`
    deliberately asserts only the in-repo negative half (nothing written without approval), exactly as
    its header states. Nothing in `qa-check.sh` reads the shipped detection cue or the park-record
    instruction.
  - Impact: TD-012's shape, one layer up. Delete the `ToolSearch select:AskUserQuestion` probe from
    either reference and every automated check still passes — the in-repo assertions would keep
    passing *because withholding writes is what a prose decline already does*. The regression is
    invisible precisely where the failure is silent, which is the property L-058 names. The behaviour
    took 4 paid runs and two failed wirings to get right; nothing currently stops the next edit from
    undoing it.
  - Mitigation (not yet done): cheapest real option is a `qa-check.sh` text leg asserting that both
    `migration-map.md` and `init.md` still contain a headless **detection** cue plus a park-record
    instruction — a grep-shaped guard over shipped text, in the family of the existing snippet
    runners, zero API cost. It guards the cue's *presence*, not the model's compliance; the
    behavioural half stays a paid, opt-in fixture run by design (`docs/QA.md`'s manual/gated boundary).

- **TD-018** severity: trivial | status: resolved → SPRINT-041 T2 | created: Sprint-039
  - Summary: `evals/assert-boundary-park.sh`'s `park_count=$(grep -cF … || echo 0)` yields the string
    `"0\n0"` on a genuine zero-match (grep prints `0` *and* exits 1, so the `|| echo 0` also fires),
    which makes `[ "$park_count" -ge 1 ]` emit an "integer expression expected" error on stderr.
  - Impact: cosmetic only — **verified fail-safe in both directions**: zero matches take the else
    branch, which is the correct `FAIL no-park-record`; a real match exits 0 so the fallback never
    fires. The cost is a confusing stderr error printed beside a legitimate FAIL, which could send a
    reader debugging the harness instead of the finding.
  - Mitigation (not yet done): use `grep -q` (as `assert-judgement-retry.sh` already does) or
    `|| true` with an explicit count. Fix opportunistically if that file is touched again.

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

---

## Resolved (collapsed)

<!-- TD-001…007 all resolved (§11 collapse — per-TD summaries live in their sprint files + git). -->
- resolved: **TD-001**→SPRINT-003 · **TD-002/004**→SPRINT-005 · **TD-003**→SPRINT-004 · **TD-005**→SPRINT-006 · **TD-006**→SPRINT-009 · **TD-007**→SPRINT-012 (closed 2026-07-02).

<!-- TD-011…012 collapsed at SPRINT-041 promote (3 sprints after resolution — per-TD summaries live in their sprint files + git). -->
- resolved: **TD-011**→SPRINT-038 T4 (ADR-010 amendment-note reconciliation) · **TD-012**→SPRINT-038 T2a (preflight fixtures retained; wiring → TD-013) (collapsed 2026-07-30).

<!-- TD-008…010 all resolved (§11 collapse — per-TD summaries live in their sprint files + git). -->
- resolved: **TD-008**→SPRINT-032 · **TD-009**→SPRINT-034 · **TD-010**→SPRINT-035 (collapsed 2026-07-30, SPRINT-038 T4).

<!-- TD-015 + TD-017 collapsed at SPRINT-043 promote (3 sprints after resolution — summaries live in their sprint files + git). -->
- resolved: **TD-015**→SPRINT-040 T1 (`/prime` freshness row — interactive side of the skill-version guard) · **TD-017**→SPRINT-040 T2 (migrate/init park records; the detection-cue lesson → L-069) (collapsed 2026-08-01).

<!-- TD-013 collapsed at SPRINT-042 promote (3 sprints after resolution — summary lives in its sprint file + git). -->
- resolved: **TD-013**→SPRINT-039 T3 (6 zero-API eval harnesses wired into `qa-check`; runtime cost → TD-016) (collapsed 2026-08-01).
