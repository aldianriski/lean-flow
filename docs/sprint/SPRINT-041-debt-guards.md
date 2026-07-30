---
sprint: 041
slug: debt-guards
owner: Maintainer
last_updated: 2026-07-30
status: active
plan_commit: de4f173
close_commit: [sha — set at close]
update_trigger: sprint execute/close events
---

# SPRINT-041 — Debt Guards

> **Theme:** SPRINT-040 spent $2.10 and four real runs establishing that `migrate`/`init` need a
> headless *detection* cue, not just a park-record rule. Nothing currently stops the next edit from
> deleting that cue silently — every automated check would still pass, because withholding writes is
> also what a plain prose decline does. This sprint retains the guard while the reasoning is still
> fresh, and clears the one cosmetic defect sitting in the assertion script that guards it.

## Scope

**In:** a `qa-check` leg guarding the headless detection cue + park-record instruction in both the
migrate and init procedures, negative-tested (T1) · the `grep -c` zero-match idiom in the
boundary-park assertion, fixed without changing any verdict (T2).
**Out (deferred):** TD-016 qa-check runtime a/b/c — still an owner decision, still no task ·
TD-014 night-run.md line count — re-reviewed at this promote and kept open, trigger (a *third*
embedded snippet) still unfired · behavioural compliance testing of the cue, which stays a paid
opt-in fixture by design (`docs/QA.md`'s manual/gated boundary) · any change to what the cue says.

## Plan

### T1 — Guard the headless park-record cue in qa-check `[size: S · risk: low · class: execution · AFK]`
Layers: `scripts/qa-check.sh` (new leg) · `docs/QA.md` (leg inventory)
Depends-on: none

TD-019. The cue is one line in each of two reference procedures, and its absence is invisible to
every existing check: the in-repo park assertions keep passing when it's gone, because a prose
decline also writes nothing. That is the silent-false-negative shape L-058 names, so the guard must
itself be negative-tested — a leg that can only pass is the failure it exists to prevent.

**Acceptance:** with the cue stripped from either procedure in a scratch copy, a bare
`sh scripts/qa-check.sh` FAILs and names which procedure lost it; restored, it passes.

**DoD:**
- [x] `qa-check.sh` gains a leg asserting each of the migrate and init procedures carries a headless
      **detection** cue (the ask-channel probe) *and* a park-record instruction naming the handoff doc
- [x] Leg follows the existing text-lint idiom (`ok`/`bad` helpers, named finding, never a bare FAIL)
- [x] **Negative-tested per check**: cue stripped from the migrate procedure → FAIL naming it; cue
      stripped from the init procedure → FAIL naming it; park-record instruction removed → FAIL. Each
      run bare, never piped (L-057), then the scratch edits reverted
- [ ] Green on the unmodified tree, and the whole gate still exits 0 — **not verifiable in this
      run**: `qa-check.sh` invokes 4 eval harnesses that `mktemp -d` then `git -C` that dir; this
      session's `dontAsk` allowlist denies `git init`/related writes, so those legs (plus a stale
      knowledge-index leg) fail on `git -C: cannot change to '<dir>'` on the **unmodified tree too**
      (confirmed by reverting T1's own edit and reproducing the identical failure). New leg 13 itself
      passes cleanly, positive and negative. Re-run interactively once the allowlist covers it.
- [x] `docs/QA.md` leg inventory updated; TD-019 marked `status: resolved → SPRINT-041 T1`
<!-- QA: this IS a gate — the must-FAIL fixtures above are the bar, not optional (CLAUDE.md). -->

### T2 — Fix the zero-match grep idiom in the boundary-park assertion `[size: S · risk: low · class: execution · AFK]`
Layers: `evals/assert-boundary-park.sh`
Depends-on: none

TD-018. `park_count=$(grep -cF … || echo 0)` yields `"0\n0"` on a genuine zero-match — `grep` prints
`0` *and* exits 1, so the fallback fires too — making the arithmetic test print "integer expression
expected" beside a legitimate FAIL. Fail-safe in both directions today, so this is noise removal:
the risk is a reader debugging the harness instead of the finding it correctly reported.

**Acceptance:** a real zero-match run prints the `FAIL no-park-record` verdict with no stderr noise,
and a real match still prints the PASS verdict with its count.

**DoD:**
- [x] The idiom no longer double-counts on zero-match (`grep -q`, as the sibling judgement-retry
      assertion already does, or an explicit count — not a second `|| echo`)
- [x] Zero-match direction exercised on a real fixture: verdict text unchanged, stderr clean
- [x] Match direction exercised: PASS verdict and its count unchanged
- [ ] `sh evals/selftest-assert-boundary-park.sh` passes; `sh scripts/qa-check.sh` stays green — **not
      verifiable in this run**: both scripts `mktemp -d` then `git -C` that dir, and this session's
      `dontAsk` allowlist denies `git init`; reverting T2's fix and re-running reproduced the identical
      failure, so it predates and is unrelated to this change. Re-run interactively once the allowlist
      covers it (same blocker as T1's equivalent line).
- [x] TD-018 marked `status: resolved → SPRINT-041 T2`

## Decisions (pre-locked)

- **D1** — The T1 guard checks **presence of the cue in shipped text**, not model compliance. Whether
  a headless run actually parks correctly is behavioural, costs API budget, and is non-deterministic;
  that half stays an opt-in fixture. A cheap always-on guard over the text plus a paid opt-in guard
  over the behaviour is the same split `docs/QA.md` already draws — no new mechanism.
- **D2** — T1 and T2 share no file and have no dependency edge; either order, or parallel.

## Assumptions

- **A1** — Both procedures currently contain the cue and the park-record instruction (shipped
  SPRINT-040 T2). *Confirm: T1's green-on-unmodified-tree DoD line.*
- **A2** — TD-018 is cosmetic in both directions, so no verdict text should change. *Confirm: T2
  exercises both directions and diffs the verdict text.*

## Execution Log

<!-- Append-only, dated. The Plan is frozen at promote — log here rather than editing § Plan. -->

### 2026-07-30 | promote | Plan locked — 2 AFK tasks from TD-019 + TD-018
Governance review had findings this time, both resolved before sign-off: **TD-014 re-reviewed** at 3
sprints open and kept open (its trigger — a third embedded snippet in night-run.md — is still
unfired; SPRINT-040 added none and T1 lands a `qa-check` leg instead), and **TD-011/TD-012 collapsed**
to one line in § Resolved, 3 sprints after resolution. No `L-NNN` at count ≥ 2.

Prepared as a **night-run candidate**: both tasks are AFK-safe (additive · reversible ·
already-approved-in-scope), and G1/G2 are pre-signed over this frozen Plan. Pre-flight is **not**
green — the skill-freshness check BLOCKs on `installed 1.22.0 != repo 1.23.0`, which is the guard
SPRINT-040 T1 shipped, firing on its own repo the same day. The run does not fire until a reinstall
clears it; the interactive session is the launcher, and a blocked pre-flight is a blocked launch
(night-run.md Part 1a).

### 2026-07-30 | sprint-bulk unattended | Pre-flight re-verified green, T1+T2 dispatched
Trigger fired with the explicit `unattended` signal; session confirmed non-interactive (`AskUserQuestion`
unregistered, per night-run.md Part 0's own verification method — later corroborated for real when this
session's own `Bash` calls started coming back denied under `dontAsk`). Re-ran Part 1's skill-freshness
check by hand: **PASS** — installed `1.23.0` == repo manifest `1.23.0`, cache `skills/` byte-identical
to the working tree (`diff --strip-trailing-cr -rq`) — the block recorded above has cleared since
promote. Worktree-usability: **AVAILABLE, worktree-clean** — no leftover linked worktrees. Dispatch
preflight (cycle · shared-file ownership · base-ref · wave rank) over the frozen Plan: **CLEAR** —
T1/T2 share no file, `Depends-on: none` both, both rank 0, declared base matched live HEAD
(`28e7e57`). Dispatched both as parallel `Agent(isolation:"worktree")` calls, one message, per D2.

- **T1** — committed `cb3db1b` on `worktree-agent-a28e8208694695bf9`. A1 confirmed: both procedures
  already carried the cue. All 4 negative/positive checks for the new qa-check leg verified via
  bare `sh`, never piped, against scratch copies outside the tracked files.
- **T2** — committed `27516ce` on `worktree-agent-a4b255c250f1a4d81`. Verdict text confirmed
  byte-identical before/after in both directions; stderr noise eliminated on the zero-match path.
- Both agents independently hit the same signature trying to close their last DoD line
  (`qa-check.sh`/its eval-harness selftests calling `mktemp -d` + `git -C`) and both proved it
  pre-existing by reverting their own change and reproducing the identical failure — not a
  regression either introduced.

**denied-tool** (Part 4 vocabulary) — two separate points in this run hit the same root cause,
`git init`-class writes outside this session's `dontAsk` allowlist:
1. The 4 `mktemp`+`git -C` eval-harness legs inside `qa-check.sh` (pre-existing, both tasks'
   "whole gate exits 0" DoD line left unchecked above rather than fudged).
2. The coordinator's own merge-back: `git worktree add` (for a separate integration worktree, per
   dispatch.md protocol) and, after falling back to merging straight onto the clean main tree
   instead, `git merge --no-ff` — both denied. Read-only git (`status`/`log`/`show`/`diff`/`worktree
   list`) and file edits via the Edit tool still work; this is a scoped-allowlist gap, not a policy
   block, and not one this run can extend on its own (an allowlist edit is an owner action).

Per Part 0: don't ask (no channel), don't decide (won't force the merge through some other path),
don't work around it. Parking here rather than reasoning past it. Both branches are intact,
independently committed, self-reviewed by their agents, and reviewed by the coordinator against
their own diffs (both small and surgical — 3 files / 25 lines for T1, 2 files / 8 lines for T2).

**Next action (human, interactively):** merge `cb3db1b` (T1) then `27516ce` (T2) onto `main`
(either branch order — D2 still holds, no shared file); re-run `sh scripts/qa-check.sh` and
`sh evals/selftest-assert-boundary-park.sh` outside this sandboxed allowlist to close the one
remaining DoD line on each task; then `git worktree remove` the two leftover agent worktrees under
`.claude/worktrees/` (`git worktree prune` after); then re-run `sprint-bulk` step 6 (`close`) once
both DoD lists are fully `[x]`.

No AFK work remains disjoint from the parked merge (the Plan only held T1+T2, both now blocked on
the same merge-back). Clean-halting via `/handoff` next, per Part 0 step 4.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `scripts/qa-check.sh` | T1 | new leg 13: grep-asserts migrate/init procedures still carry the ask-channel probe + park-record instruction (TD-019, L-058 silent-false-negative shape) | low — additive read-only grep | negative-tested 3 ways on scratch copies + positive run, all bare `sh`; unmerged, see Execution Log |
| `docs/QA.md` | T1 | leg inventory row for the new leg 13 | none | visual table check |
| `TECH-DEBT.md` | T1, T2 | TD-019 and TD-018 marked `resolved` | none | n/a |
| `evals/assert-boundary-park.sh` | T2 | `grep -q` presence gate before `grep -c` count, replacing a count-then-`\|\| echo 0` idiom that double-counted on zero-match (TD-018) | low — verdict text byte-identical both directions, verified | real zero-match + match fixtures, before/after diff; unmerged, see Execution Log |

## Retro

<!-- Written at close. -->
