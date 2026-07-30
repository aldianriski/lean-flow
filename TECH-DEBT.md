---
owner: Maintainer
last_updated: 2026-07-30
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

- **TD-019** severity: minor | status: open | created: Sprint-040
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

- **TD-018** severity: trivial | status: open | created: Sprint-039
  - Summary: `evals/assert-boundary-park.sh`'s `park_count=$(grep -cF … || echo 0)` yields the string
    `"0\n0"` on a genuine zero-match (grep prints `0` *and* exits 1, so the `|| echo 0` also fires),
    which makes `[ "$park_count" -ge 1 ]` emit an "integer expression expected" error on stderr.
  - Impact: cosmetic only — **verified fail-safe in both directions**: zero matches take the else
    branch, which is the correct `FAIL no-park-record`; a real match exits 0 so the fallback never
    fires. The cost is a confusing stderr error printed beside a legitimate FAIL, which could send a
    reader debugging the harness instead of the finding.
  - Mitigation (not yet done): use `grep -q` (as `assert-judgement-retry.sh` already does) or
    `|| true` with an explicit count. Fix opportunistically if that file is touched again.

- **TD-017** severity: minor | status: resolved → SPRINT-040 T2 | created: Sprint-039
  - Summary: `migrate` and `init` do **not** execute Part 0's park protocol. SPRINT-039 T1's real
    headless runs found both correctly *withheld* every unauthorized write, but neither wrote a park
    record nor a `/handoff` doc — they simply declined in prose. `promote` and `/triage`, tested in
    the same task, both ran the protocol formally.
  - Impact: the **safety** property holds; the **observability** contract does not. An unattended run
    that parks at `migrate`/`init` leaves the morning maintainer no artifact showing it ran or why it
    stopped — the Execution-Log/handoff trail the contract promises is simply absent. L-020's class:
    shipped, but not wired into every entry point that can reach it.
  - Mitigation (not yet done): wire the park-record + handoff write into `migrate`/`init`'s
    approval-gate paths, then cover with the retained `migrate-park`/`init-park` fixtures — which
    already exist and currently assert only the withheld-write half.
  - Resolution: both entry points now write a park record to a `/handoff` doc before halting —
    verified on real headless re-runs of both retained fixtures (`handoff-migrate-park.md` ·
    `handoff-init-park.md`, each naming what stopped and its unblock condition), with
    `assert-noaction-park.sh` still passing 4/4 and 3/3 so the safety half didn't regress.
    **The mitigation above was insufficient as written, and the runs are what proved it.** Wiring the
    rule into the approval paths took two failed attempts: first into § Sprint lifecycle, which a
    `migrate` run never reads (L-020's exact shape, committed while fixing a TD of that class); then
    into `## Migrate`/`## Init` stating *what to do when headless* but never **how the run knows it
    is** — and an interactive run waiting in prose is correct behaviour. What made it fire was the
    **detection cue**: probe `ToolSearch select:AskUserQuestion`, which is precisely what `promote`
    and `/triage` already carried and why they alone complied in SPRINT-039. A behavioural rule ships
    with its trigger or it does not ship. Cost of finding that out: 4 real runs, $2.10.

- **TD-016** severity: minor | status: open | created: Sprint-039
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

- **TD-015** severity: medium | status: resolved → SPRINT-040 T1 | created: Sprint-039
  - Summary: the skill-freshness check shipped in `skills/orchestrator/references/night-run.md`
    guards only the **unattended** path, where a version/content mismatch is a `BLOCK`. Nothing
    guards an **interactive** session — which is where the loop actually runs day to day.
  - Impact: proven live, not theoretical. SPRINT-039 executed its entire promote→build→close loop on
    **1.18.0** cached skills against a 1.21.0→1.22.0 repo; the stale path was printed in every skill's
    invocation header and went unread for the whole session. Damage was nil only because references
    were read from the repo rather than the cache (reaching *past* the stale procedure). A larger
    drift, or one in a step with no repo-side reference to fall through to, would have executed
    silently and been indistinguishable from a clean run. This is L-054's shape — a correct check on
    the wrong side of the boundary — and L-021's second occurrence.
  - Mitigation (not yet done): lean-flow ships no hooks (ADR-011 killed in-core gate enforcement), so
    an automatic interactive guard has no obvious carrier. Cheapest real option is a `/prime` step
    that reads the loaded skill's base-dir version and reports it in the health line — turning an
    invisible fact into a checked one at the exact moment a session starts.
  - Resolution: `/prime` (v0.3.0) gained a § Skill freshness step and a `Skills:` health row comparing
    the invocation header's base-dir version against `.claude-plugin/plugin.json`. All three branches
    were demonstrated on real input rather than reasoned about — `fresh` on this repo, `STALE` on a
    fixture manifest reading 9.9.9, `n/a` on a repo with no manifest (the consumer path, which must
    never false-alarm). Deliberately a **report, not a gate**: priming is read-only, and whether a
    stale procedure is acceptable is the session's call. Deliberately **version-only** (SPRINT-040 D1)
    — /prime declares no Bash and the content-first check lives in `orchestrator/references/`, so
    reaching it would mean a cross-skill reference tree or a drifting copy. **Residual, accepted:** a
    skill edited without a version bump still reads `fresh` interactively; that leg stays covered only
    on the unattended path, whose pre-flight diffs cache content against the working tree.

- **TD-014** severity: minor | status: open | created: Sprint-038
  - Summary: `skills/orchestrator/references/night-run.md` is now **427 lines**, carrying the Part 0
    contract, the entry path, the pre-flight pass, and **two ~100-line embedded shell snippets**
    (skill-freshness + worktree-usability).
  - Impact: uncounted against the SKILL.md cap (ADR-006, it's a `references/` file) so no lint fires,
    but it is past comfortable reading for the audience that most needs it — someone deciding whether
    to fire an unattended run. A cold reader must scroll two code blocks to reach Part 2's trigger.
  - Mitigation (not yet done): split the capability checks into their own `references/` sibling if a
    third snippet lands. Not urgent at two; the trigger is the third.

- **TD-013** severity: minor | status: resolved → SPRINT-039 T3 | created: Sprint-038
  - Summary: `evals/run-dispatch-preflight-fixtures.sh` guards the `dispatch.md` preflight snippet but
    is **not wired into `scripts/qa-check.sh`** — TD-012's stated alternative mitigation. The fixtures
    exist and pass; nothing runs them automatically.
  - Impact: the retained-guard leg of TD-012 is closed (the fixtures can no longer be lost), but the
    guard is opt-in — a maintainer editing the snippet gets no automatic signal. Strictly better than
    TD-012's original state, not equivalent to a wired gate (L-057's family: a check that exists but
    isn't reached).
  - Resolution: `qa-check.sh` gained a leg that runs all 5 zero-API harnesses (`run-skill-freshness-
    fixtures.sh`, `run-worktree-usability-fixtures.sh`, `run-dispatch-preflight-fixtures.sh`,
    `selftest-assert-boundary-park.sh`, `selftest-assert-noaction-park.sh`), gated on each harness's
    own exit status (never a pipe/redirect), naming the failing harness plus its own FAIL line on a
    red run. Negative-tested against a scratch copy with one guarded snippet deliberately broken —
    bare `sh scripts/qa-check.sh` FAILed naming that harness, then the test edit was reverted. The
    manual/gated boundary is stated in `docs/QA.md`: the behavioural real-run fixtures (API cost, not
    deterministic) stay opt-in, by design, not by the gap this TD named.

- **TD-012** severity: resolved → SPRINT-038 T2a (retained-guard leg; wiring → TD-013) | created: Sprint-037
  - Summary: the pre-dispatch preflight snippet now shipped in
    `skills/orchestrator/references/dispatch.md` was negative-tested by three must-FAIL fixtures that
    lived in a scratch dir and were **deleted** with the prototype. The shipped sh/awk block therefore
    has no retained regression guard, and `qa-check.sh` does not read it.
  - Impact: a future edit to the snippet — or a change to the sprint-schema tokens it parses — can
    silently reintroduce the exact silent-false-negative class L-058 names. Proven reachable, not
    theoretical: stripping one guard clause during T1 made it pass a real overlap at exit 0. A gate
    that degrades quietly is the worst shape for a gate, which is the whole point of L-058.
  - Mitigation (not yet done): retain the three fixtures plus a runner. Natural carrier is the eval
    harness TASK-124 will build — its fixture-skeleton + assertion-script shape is the same one, so
    this likely costs a row rather than a new mechanism. Alternative: a `qa-check.sh` leg that runs
    the snippet against retained fixtures.

- **TD-011** severity: minor | status: resolved → SPRINT-038 T4 | created: Sprint-035
  - Summary: `docs/adr/ADR-010-model-dispatch-role-tiers.md`'s 2026-07-10 amendment wording ("a
    mis-classification mis-routes") predates ADR-013/T5's advisory-default framing — read cold it
    can imply intake classification is binding, contradicting the now-canonical "persisted `class:`
    is an advisory default; dispatch-time classification stays authoritative."
  - Impact: a cold reader reconciling ADR-010 with CONTEXT.md § Task entry shape may resolve the
    ambiguity the wrong way. Not contradicted in substance — wording only.
  - Resolution: appended a dated amendment note to ADR-010 (2026-07-30) pointing at ADR-013's
    advisory-default clause and CONTEXT.md § Model tiers; the 2026-07-10 amendment's prior text is
    untouched (ADRs are append-only) — the note reconciles the framing without rewriting it.

---

## Resolved (collapsed)

<!-- TD-001…007 all resolved (§11 collapse — per-TD summaries live in their sprint files + git). -->
- resolved: **TD-001**→SPRINT-003 · **TD-002/004**→SPRINT-005 · **TD-003**→SPRINT-004 · **TD-005**→SPRINT-006 · **TD-006**→SPRINT-009 · **TD-007**→SPRINT-012 (closed 2026-07-02).

<!-- TD-008…010 all resolved (§11 collapse — per-TD summaries live in their sprint files + git). -->
- resolved: **TD-008**→SPRINT-032 · **TD-009**→SPRINT-034 · **TD-010**→SPRINT-035 (collapsed 2026-07-30, SPRINT-038 T4).
