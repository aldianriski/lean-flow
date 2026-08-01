---
sprint: 043
slug: proof-run
owner: Maintainer
last_updated: 2026-08-01
status: closed
plan_commit: 96d93ea
close_commit: [sha — set at close]
update_trigger: sprint execute/close events
---

# SPRINT-043 — Proof Run

> **Theme:** SPRINT-042 fixed the landing path that stranded SPRINT-041's night run, and could not
> test it — the sprint that ships the fix cannot be the sprint that proves it. This sprint is the
> proof. Its two tasks are chosen to be genuinely disjoint so the run must fan out, dispatch into
> worktrees, and land both units through the merge-back queue: the exact sequence that failed before.
> The work itself closes the last two open debts; the *run* is the deliverable.

## Scope

**In:** an **observed** third source for the declaration cross-check — actual changed files vs declared
`Layers:`, the one source that cannot be forgotten (T1) · atomic write for the generated index, so a
failed generation leaves the previous file intact rather than a plausible truncated one (T2) · and
executing both **unattended**, as the end-to-end proof that a night run can now finish (TASK-134).

**Out (deferred):** **TD-014** (night-run.md length) — its trigger is a third embedded snippet and
neither task adds one; re-review already scheduled for SPRINT-044 · a **6–8h sizing standard** — this
run produces calibration row two, and two rows is still not a series · any change to what the
allowlist *derivation* says: this sprint **tests** SPRINT-042 T1's rule, it does not revise it, because
revising the thing under test would forfeit the experiment.

## Plan

### T1 — Add an observed third source to the declaration cross-check `[size: M · risk: low · class: execution · AFK]`
Layers: `scripts/qa-check.sh` · `scripts/lib/check-layers-observed.sh` · `docs/QA.md` · `evals/run-layers-observed-fixtures.sh`
Depends-on: none

TD-022 · L-074. SPRINT-042 gave `Layers:` a second source — files named in each task's DoD prose — and
it was defeated the day it shipped, because both sources are predictions written by one author at one
moment. Two documents written by one person at one time are one source in two places. The escape is an
**observation**: compare what actually changed against what was declared. Unlike the first two it
cannot be forgotten, because it reads history rather than intent.

**Acceptance:** against a fixture reproducing SPRINT-042's own miss — a file created during
implementation and never declared — the gate FAILs naming that file; against a sprint whose declaration
matches its real diff, it passes.

**DoD:**
- [x] The gate compares the changed-file set for an active sprint against the union of its tasks'
      declared `Layers:`, reporting any file changed but undeclared
- [x] The comparison base is the sprint's recorded plan commit, so "changed this sprint" needs no
      second source of truth
- [x] Coordinator close-bookkeeping files are excluded **with a stated reason**, never silently — a
      silent exclusion list is how the observed source drifts back toward being an authored one
- [x] Leg follows the existing text-lint idiom (`ok`/`bad` helpers, named finding, never a bare FAIL)
- [x] **Negative-tested per check**, each failing with its own named finding, using SPRINT-042's real
      recorded miss as the must-FAIL fixture. Run bare, never piped (L-057)
- [x] Fixtures **retained** in the eval set (L-058)
- [x] `docs/QA.md` leg inventory updated
<!-- QA: this IS a gate — the must-FAIL fixtures are the bar, not optional (CLAUDE.md). -->

### T2 — Make the generated index survive a failed write `[size: S · risk: low · class: execution · AFK]`
Layers: `scripts/gen-index.sh`
Depends-on: none

TD-021. A disk-full failure during SPRINT-041's close truncated the generated index from 34 lines to
12 and left a **syntactically valid file** — nothing was wrong, there was simply less of it. The gate
caught it as "index STALE", which was the right alarm for the wrong reason and only fired because the
truncation happened to also break staleness parity. Write to a temporary file in the same directory
and move it into place, so a failed generation cannot publish a partial result at all.

**Acceptance:** a generation interrupted mid-write leaves the previous index byte-identical; a normal
run still regenerates it correctly.

**DoD:**
- [x] Generation writes to a temporary file in the same directory, then moves it into place
- [x] **Failure path exercised on real input**: simulate a mid-write failure and confirm the previous
      file survives byte-identical — proving the normal path still works is not the test
- [x] A normal run still produces an index identical to what it produced before the change
- [x] If same-directory rename is not atomic on the target filesystem, that limit is **stated** rather
      than claimed away

## Owner-action checklist
<!-- Non-dev actions a human must do. These gate the unattended run; none is a dev task. -->
- [x] **Reinstall the plugin so the installed version reaches 1.24.0** — pre-flight's skill-freshness
      check BLOCKs today (installed 1.23.0 ≠ repo 1.24.0), and it is right to: a night run executes the
      *installed* skill, so firing now would run SPRINT-042's fix-free procedure against a repo that
      has it. This is the one item that makes the whole proof meaningless if skipped.
      <!-- verified at run time: `PASS skill-freshness: installed 1.24.0 == repo 1.24.0; cache skills/ matches working tree` -->
- [x] **Push the plan-locked commit before firing** — agent worktrees fork from the remote default
      branch, so an unpushed plan commit leaves them on a stale base (dispatch.md's declared-base rule).
      <!-- verified at run time: HEAD == origin/main == 21c1e14; both agent worktrees forked clean -->
- [x] **Build the allowlist per night-run.md Part 1's four sources** — including source 2, the
      merge-back path. This is the artefact under test; deriving it from the old single-source habit
      would test nothing.
      <!-- source 2 held: git worktree add / merge / worktree remove all authorized. See F1 -->
- [x] **Fire the trigger** with the explicit `unattended` signal.

## Decisions (pre-locked)

- **D1** — **`TECH-DEBT.md` is coordinator-owned at close; no task declares or edits it.** Each task
  would naturally mark its own `TD-NNN`, which makes the ledger a shared file and forces the two tasks
  sequential. Since the point of this sprint is to exercise *parallel* dispatch and the merge-back
  queue, the marking moves to close instead. L-071 applied at planning time rather than discovered at
  merge time.
- **D2** — **This sprint runs unattended**, and the cost is accepted deliberately. Fan-out on two small
  tasks is exactly the trade L-073 warns against; the justification is not efficiency but that
  SPRINT-042 T1 is currently an **untested claim**, and only a real run can falsify it.
- **D3** — The sprint file is **coordinator-owned**. Agents never edit it, which keeps the one
  genuinely shared artefact out of the worktree merge entirely.
- **D4** — A denial during this run is a **result, not a failure of the sprint**. It is recorded against
  which of the four allowlist sources failed to derive the command, because that is the finding the
  experiment exists to produce.

## Assumptions

- **A1** — The installed plugin matches the repo manifest at trigger time. *Confirm: pre-flight's
  skill-freshness check, which currently BLOCKs and must read PASS before firing.*
- **A2** — The plan commit is pushed, so worktree agents fork from a base containing this Plan.
  *Confirm: pre-flight base-ref check against live HEAD.*
- **A3** — T1 and T2 share no file, so the dispatch preflight computes both at rank 0 and the run fans
  out. *Confirm: pre-dispatch preflight reports two rank-0 tasks and no shared-file finding.*

## Execution Log

<!-- Append-only, dated. The Plan is frozen at promote — log here rather than editing § Plan. -->

### 2026-08-01 | pre-flight | green — G1+G2 pre-signed, trigger authorized
Owner reinstalled the plugin; **skill-freshness now PASS** and verified at content level rather than by
version string alone — the installed 1.24.0 cache carries SPRINT-042 T1's "four sources, not one" text,
so the run will execute the fixed procedure rather than the one that stranded SPRINT-041. `/plugin`'s
own report was not used as the evidence (L-021).

Pre-flight, all items green: charter execute-only over a Plan frozen at `96d93ea` · both tasks
AFK-class · zero open `assumes:` (A1 freshness PASS · A2 base-ref PASS after pushing the plan commit ·
A3 wave computation `T1=0 T2=0`) · worktree **AVAILABLE, worktree-clean** · agent dispatch available ·
`bypassPermissions` off the table. Ask channel: none, by construction — park protocol applies.

**G1 + G2 pre-signed by the owner** over the frozen Plan. G1: goal restated, sizes M+S with no L,
files declared and verified disjoint, out-of-scope named. G2: one `Agent(isolation:"worktree")` per
task in a single message, coordinator merge-back on a separate integration worktree, `--no-ff` per
task; overlap map is empty by construction (D1 + D3 moved both would-be shared files to the
coordinator); no ADR; no residual grill.

**Allowlist derived from night-run.md Part 1's four sources** — the artefact under test. Source 2 (the
landing path: `git worktree` · `git merge` · `git branch` · `git checkout`) and source 3 (the gate's own
`mktemp` + `git init`/`git -C` subprocesses) are the two that SPRINT-041 lacked entirely.
`Bash(git push*)` is **deliberately absent** — owner-reserved; if the run reaches for it, that is a
finding, not a gap to patch.

**Expected cost: ~$7–12** (stated before firing, per the pre-flight line T2 shipped). SPRINT-041's
comparable shape was $6.60 for two tasks; T1 here is heavier at size M with fixtures. This is the run's
own cost, not its tasks' verification cost — the tasks need no paid fixtures.

Recovery if the run misbehaves: `origin/main` is current at `7541597` and the run cannot push, so
`git reset --hard origin/main` restores everything.

### 2026-08-01 | dispatch | wave 1 fanned out — T1 + T2, worktree-isolated

Run started under the explicit `unattended` signal. Pre-flight re-verified at run time rather than
trusted from the evening's record: **skill-freshness PASS** (installed 1.24.0 == repo 1.24.0, cache
`skills/` content-identical to the working tree) · **dispatch preflight CLEAR** (`PASS base-ref` —
declared base `21c1e14` == live HEAD == `origin/main`; `PASS wave-computation: T1=0 T2=0`; no
shared-file finding, confirming **A3**) · **worktree AVAILABLE, worktree-clean** (main tree only).
Both probes run bare, never piped (L-057).

Wave 1 = both tasks at rank 0 → one `Agent(isolation:"worktree")` per task, issued in a single
message, model `sonnet` (`class: execution`). T1 routed to `/tdd` (new gate behaviour, fixtures
first); T2's `/tdd` **declined with a stated reason** — its `Layers:` declares one file, so a retained
test file would itself be undeclared, and its DoD asks for a one-time real-input failure exercise,
which is the manual verification step standing in for `/tdd` (L-007). Both briefs carry the L-043
tree-wide-state-op ban verbatim, the coordinator-owned file list (D1 · D3), and the park protocol.

**Coordinator design call (inline, `decision` tier).** T1's fixtures must observe a git diff from a
plan commit, so they cannot be static `.md` files — the harness builds throwaway repos under
`mktemp -d`, the `selftest-assert-*.sh` idiom. This keeps T1 inside its four declared `Layers:` paths:
a new `evals/fixtures/layers-observed/` tree would be a file changed-but-undeclared that T1's own gate
would flag on its own sprint, and amending the frozen § Plan to absorb it is HITL → a park. Retention
(L-058) is satisfied by fixtures living permanently inside the retained harness file. Not a dodge —
the decision predates the gate and respects the declaration rather than widening it.

### 2026-08-01 | execute | wave 1 landed — both units merged, the proof holds

**The headline: the landing path works.** Both branches merged through the integration worktree and
reached `main` at `d982b86`. SPRINT-041 built two units and landed zero; this run built two and landed
two. `git worktree add` · `git merge --no-ff` · `git worktree remove` · `git worktree prune` were all
authorized — allowlist **source 2 held**, which is the single thing this sprint existed to falsify.

Merge order T1 → T2, `--no-ff` each, on a separate integration worktree; **zero conflicts**, confirming
the G2 overlap map (empty by construction via D1 + D3) was accurate rather than lucky. Post-merge smoke:
`sh scripts/qa-check.sh` bare → **68 pass, 1 fail** against a pre-merge baseline of **67 pass, 1 fail** —
one leg gained, no new failure. Worktrees removed, `prune` clean, `git status` clean.

**Verification beyond the agents' own reports** (L-060 — a report is evidence about the reporter):
each branch's changeset was diffed against the fork base and matched its declared `Layers:` exactly;
T2's self-reported stray temp file was confirmed gone from both trees; and the observed gate was
exercised on **real input that must FAIL** — a genuinely undeclared `scripts/lib/zzz-undeclared-probe.sh`
made it exit 1 naming that file, and removing it returned `PASS ... base 96d93ea`. Fixtures prove a gate
in throwaway repos; only that exercise proves it on the live sprint (CLAUDE.md's gate bar).

**F1 — allowlist source 2 was right; the *invocation form* was the trap.** `git worktree add …` wrapped
as `cd X && … 2>&1 && echo …` was **denied**; the identical command issued bare succeeded. `dontAsk`
matches the literal invocation, so chaining or redirecting a permitted command stops it matching. This
is not a missing source — it is a rule about *how* the landing path must be called, and night-run.md
Part 1 currently says nothing about it. Recorded per D4; the doc change is **out of scope** (no task
declares `night-run.md`) → parked, not absorbed.

**F2 — T1's fixture harness was silently passing for the wrong reason.** `git -C` cannot resolve the
POSIX-style `/d/tmp/...` path `mktemp -d` returns on this Windows/MSYS host, so every fixture's setup
commits silently failed; cases meant to exercise a real git diff were tripping the *`plan_commit not
recorded`* branch instead. The exact L-058 nightmare — a green gate that never ran its own check. Found
by the pre-merge review, fixed inside T1's own declared file, and re-verified independently by the
coordinator. **The pre-merge review is what caught this**, not the implementing agent's self-report.

**F3 — the same MSYS root cause is live on an existing harness, and is parked.**
`evals/run-dispatch-preflight-fixtures.sh` fails `could not resolve live HEAD in /d/Project/lean-flow`
— `git -C <MSYS path>` again. Verified **pre-existing on `main` before this run's merge** (it is in the
67/1 baseline), and `evals/run-dispatch-preflight-fixtures.sh` is in no task's `Layers:`. Fixing it is
scope-changing → parked, per the contract, rather than quietly repaired mid-run.

**F4 — coordinator error, self-inflicted by F1's own workaround.** Stripping the `cd` prefix to satisfy
the permission matcher let the shell's *persistent* cwd (left inside T1's worktree by an earlier
verification run) silently retarget the following bare commands: the integration worktree was created
nested inside an agent worktree, and `git merge --ff-only` advanced the agent's branch instead of
`main`. Caught immediately by reading the command's actual output rather than assuming it landed;
nothing was lost (the fast-forward was valid, `main` had simply not moved), and `main` was then advanced
explicitly with `git -C <abs-path>`. The lesson is F1's sting in the tail: the safe *form* of a command
and the safe *anchoring* of it are different problems, and fixing one broke the other.

**Rollup**

```
T1 · done · observed layers gate landed; 4/4 FAIL paths fixture-covered + must-FAIL on real input
T2 · done · same-dir temp write landed; kill -9 mid-write leaves prior index byte-identical
F1 · parked-hitl · night-run.md must say the landing path is called bare (chained/redirected forms are denied) · unblock: owner promotes it into a sprint — night-run.md is in no task's Layers:
F3 · parked-hitl · run-dispatch-preflight-fixtures.sh fails on `git -C <MSYS path>`; pre-existing on main, out of scope · unblock: owner promotes a fix (candidate: the `pwd -W` normalization T1 used)
release · parked-hitl · T1 adds a capability, so this is a MINOR by hand, not release-patch's PATCH; no release task in the frozen Plan · unblock: owner decides + bumps
```

**Calibration row**

```
run · cost unavailable · 3 dispatched agents · ~30 min wall-clock · 2/2 units built AND landed · coordinator + 3 agents (2 worktree + 1 in-place follow-up)
```

Cost is **unavailable, not omitted** (Part 4 degrade rule): this run was driven interactively rather
than via `claude -p --output-format json`, so no `total_cost_usd` was exposed to transcribe. What is
recorded instead: ~368k sub-agent tokens across the three agents (T1 166k · follow-up 118k · T2 85k),
agent wall-clocks 833s · 495s · 449s. The comparison that matters against SPRINT-041's row is not the
dollar figure but the denominator — **cost per unit *delivered* was undefined there and is 2/2 here.**

## Files Changed

<!-- Filled during execution; feeds CHANGELOG at close. -->

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `scripts/lib/check-layers-observed.sh` | T1 | new — third, **observed** source: diffs actual git state since `plan_commit` against the union of declared `Layers:`; reads history, so it closes the *inventing* gap an authored source cannot (TD-022 · L-074) | low | `evals/run-layers-observed-fixtures.sh` (7 assertions) + must-FAIL on real input |
| `scripts/qa-check.sh` | T1 | new leg 15 delegating to the observed checker; registers the new harness in `eval_harnesses_optin` (builds git repos → opt-in per TD-016's cost boundary) | low | full `sh scripts/qa-check.sh`, bare |
| `evals/run-layers-observed-fixtures.sh` | T1 | new — retained fixtures built in throwaway `mktemp -d` + `git init` repos (L-058); covers all **four** of the checker's FAIL paths, each asserting its own named finding | low | bare run, exit 0, all green |
| `docs/QA.md` | T1 | leg-15 inventory row + always-on/opt-in split updated to name the new harness and its cost | low | `QA.md hygiene` + table re-read in full after edit (L-009) |
| `scripts/gen-index.sh` | T2 | temp file now created in `$OUT`'s own directory so the final `mv` is a same-volume rename, not the cross-device copy+delete that published SPRINT-041's truncated-but-valid index (TD-021); NTFS atomicity limit stated in-script | low | `kill -9` mid-write on real input → prior file byte-identical (`cmp` + sha256) |

## Retro

**The experiment returned a verdict: SPRINT-042 T1's rule holds.** The four-source allowlist derivation
was an untested claim; this run falsified nothing and confirmed the load-bearing part — source 2, the
landing path. `git worktree add` · `merge --no-ff` · `worktree remove` · `prune` were all authorized,
both branches merged, and `main` moved. SPRINT-041 spent $6.60 to strand two branches; this run landed
2/2. That is the whole deliverable, and it is green.

**But the run found a failure mode the rule doesn't cover, and it is the more interesting result.** The
four sources answer *which commands* the allowlist needs. They say nothing about *what form* the command
is issued in — and `dontAsk` matches the literal invocation. `git worktree add …` was denied as
`cd X && … 2>&1 && echo …` and permitted bare, character-for-character the same operation. A perfectly
derived allowlist still fails if the run habitually chains its commands. That gap is now TD-023.

**Then the fix for it caused the run's only real mistake**, which is the part worth remembering.
Stripping `cd` prefixes to satisfy the matcher removed the thing that was anchoring the commands, and
the shell's persistent cwd — left inside an agent worktree by an earlier verification — silently
retargeted them. The integration worktree was built in the wrong place and a fast-forward advanced an
agent branch instead of `main`. Caught by reading the command's actual output (`Updating c94a8c0..`,
a sha that had no business being there), not by any check. Nothing was lost, but the general shape is
sharp: **command safety and command anchoring are different properties, and satisfying one can quietly
break the other.**

**The pre-merge review earned its place twice.** T1's harness reported all fixtures green while its
fixture *setup* was silently failing — `git -C` cannot resolve the `/d/tmp/...` path `mktemp -d` returns
on this host, so cases meant to exercise a real git diff were tripping the `plan_commit not recorded`
branch and passing on the wrong assertion. A green gate that never ran its own check is exactly L-058's
worst case, and no exit code would have shown it. The same root cause is live and unfixed in
`run-dispatch-preflight-fixtures.sh` (TD-024) — which means the dispatch preflight's own guard is
currently not running in this environment, while the preflight itself works.

**What the contract got right.** Three things were parked rather than decided: the night-run.md doc
change (out of scope), the TD-024 fix (pre-existing, undeclared), and the MINOR release (a capability
shipped, and no release task in the frozen Plan). None was reasoned around, and the execute-only charter
is why the run has a clean report instead of a defensible-looking one.

### Buckets routed

| Bucket | Filed |
|---|---|
| Shipped | `CHANGELOG.md` — Unreleased block (version bump is owner-reserved) |
| Tech debt | `TD-021` → resolved (T2) · `TD-022` → resolved (T1) · **TD-023** (allowlist invocation form) · **TD-024** (harness `git -C` MSYS path) |
| Follow-ups | **TASK-137** — owner: decide + apply the MINOR release for this sprint |
| Learnings | **L-077** (allowlist form vs command) · **L-078** (fixture setup failing into a wrong-check pass) · **L-079** (safety vs anchoring) |

### Parked for the morning (unattended contract)

- **§11 retention** — archival pass, Backlog entry removal for TASK-134/135/136, INDEX.md line, compaction sweep. Lossy → owner-approved, never self-approved.
- **Doc-freshness propose→approve** — Files Changed maps to `docs/QA.md` (already updated in-task) and `night-run.md` (TD-023); the propose→approve pass itself is approval-bound.
- **TD-023 / TD-024 fixes · the MINOR release** — each named above with its unblock condition.
