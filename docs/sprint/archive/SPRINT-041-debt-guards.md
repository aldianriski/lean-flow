---
sprint: 041
slug: debt-guards
owner: Maintainer
last_updated: 2026-08-01
status: closed
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
- [x] Green on the unmodified tree, and the whole gate still exits 0 — closed interactively after
      merge-back: **69 pass, 0 fail**. The run's diagnosis was correct and was left honestly unticked
      rather than fudged: `qa-check.sh` invokes eval harnesses that `mktemp -d` then `git -C` that dir,
      which its `dontAsk` allowlist denied, and it proved the failure pre-existing by reverting its own
      edit and reproducing it.
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
- [x] `sh evals/selftest-assert-boundary-park.sh` passes; `sh scripts/qa-check.sh` stays green —
      closed interactively after merge-back: selftest all PASS (must-PASS and must-FAIL legs both
      discriminate), gate 69 pass / 0 fail. Same sandbox blocker as T1's equivalent line, same correct
      pre-existing diagnosis.
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

### 2026-07-31 | merge-back + independent verification | all 10 DoD closed
Unparked interactively, per the run's own next-action list. Both branches merged (`54bd622` T1,
`aa1ed1b` T2) — no conflict — then the two blocked DoD lines closed against the real gate: **69 pass,
0 fail**, selftest all PASS.

**The run's negative-test claim was re-verified independently, not accepted.** T1's whole subject is a
guard that must be able to fail, so taking "I negative-tested it" on trust would reproduce the exact
defect it exists to prevent. Re-run against scratch copies: cue stripped from `migration-map.md` →
FAIL naming that file · cue stripped from `init.md` → FAIL naming that file · park-record instruction
removed → FAIL naming it. Three named findings, all confirmed. The run's claim held.

**Three findings the run surfaced, none of them in its Plan:**
1. **The preflight can't check what the Plan doesn't declare.** Both tasks edited `TECH-DEBT.md` (each
   marking its own TD resolved — required by their DoDs), but neither task's `Layers:` listed it, so
   the shared-file single-owner check passed on incomplete input and both agents edited it in parallel
   worktrees. They merged clean only because the hunks sat ~19 lines apart — luck, not design. The
   check is sound; the *declaration* was mine, written at promote, and it omitted a file the DoD
   plainly required. A mechanical check over a hand-written manifest inherits that manifest's blind
   spots.
2. **`denied-tool`: the merge-back path is missing from the allowlist recipe.** `git worktree add` and
   `git merge --no-ff` are how a coordinator lands parallel work, and both were denied. The run did
   the right thing — parked, didn't force it through another path — but a night run that can dispatch
   in worktrees and cannot merge them is structurally unable to finish; the work strands on branches
   every time. This is night-run.md's own allowlist row being under-specified, the same shape as the
   `/handoff` denial it already records.
3. **Cost: $6.60 for two ~25-line changes.** My "zero API cost" framing at promote was about the
   tasks' *verification* needing no paid fixtures; the run itself was never free, and I should have
   said so before firing. Coordinator plus two worktree agents, 15 turns, on work a live session
   would have done for a fraction of that.

**Incident (environment, not the run):** the C: volume hit 0 bytes free during post-merge
verification, and `gen-index.sh` failed **mid-write**, truncating the generated
`docs/knowledge-index.md` from 34 lines to 12 — a partial write that left a syntactically valid file.
Restored from git; regenerated with `TMPDIR` on D:; gate green. `qa-check` caught it only as "index
STALE", which is the right alarm for the wrong reason — a generated SSOT has no atomic-write guard,
so a failed write degrades it silently rather than loudly.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `scripts/qa-check.sh` | T1 | new leg 13: grep-asserts migrate/init procedures still carry the ask-channel probe + park-record instruction (TD-019, L-058 silent-false-negative shape) | low — additive read-only grep | negative-tested 3 ways on scratch copies + positive run, all bare `sh`; unmerged, see Execution Log |
| `docs/QA.md` | T1 | leg inventory row for the new leg 13 | none | visual table check |
| `TECH-DEBT.md` | T1, T2 | TD-019 and TD-018 marked `resolved` | none | n/a |
| `evals/assert-boundary-park.sh` | T2 | `grep -q` presence gate before `grep -c` count, replacing a count-then-`\|\| echo 0` idiom that double-counted on zero-match (TD-018) | low — verdict text byte-identical both directions, verified | real zero-match + match fixtures, before/after diff; unmerged, see Execution Log |

## Retro

**Retrieval check** — no retrieval miss. The run applied L-057 (run gates bare, never piped), L-058
(a must-FAIL fixture per check), and L-042/L-043 (the worktree git-op bans) unprompted. One
**contradiction between two shipped references** did surface: `dispatch.md` prescribes a separate
integration worktree for merge-back (`git worktree add`), while `night-run.md` Part 1's allowlist
recipe never lists that command — the run followed the first and was denied by the second. That is a
fileable friction (→ L-072), not a failure to retrieve.

**Worked**
- **The park protocol held under real pressure.** Denied at merge-back with both branches built,
  committed, and reviewed, the run did not force the merge through another path, did not ask (no
  channel), and did not decide. It parked with a next-action list precise enough to execute verbatim
  the next morning. Part 0's hardest clause is *don't decide*, and it was obeyed at exactly the point
  where reasoning past it would have looked reasonable.
- **Both agents proved their blocker pre-existing** — each reverted its own edit and reproduced the
  identical failure — rather than reporting it as a regression they had introduced. CLAUDE.md trap (c)
  applied without being prompted.
- **The run's negative-test claim was re-verified, not accepted.** T1's whole subject is a guard that
  must be able to fail; taking "I negative-tested it" on trust would have reproduced the exact defect
  it exists to prevent. Three must-FAIL fixtures re-run independently at merge-back, three named
  findings confirmed. The claim held — the re-run is what makes saying so worth anything.

**Friction**
- **The Plan's `Layers:` omitted a file both DoDs plainly required.** `TECH-DEBT.md` went undeclared,
  so the preflight's shared-file single-owner check passed on incomplete input and both agents edited
  it in parallel worktrees. They merged clean only because the hunks sat ~19 lines apart — luck, not
  design. → **TD-020**.
- **One denied command stranded 100% of the run's output.** Both tasks funnelled through the
  merge-back, so a single `denied-tool` there left no disjoint AFK work to continue with. A run that
  can dispatch into worktrees and cannot merge them is structurally unable to finish. → **TASK-131**.
- **$6.60 for two ~25-line changes**, 15 turns, coordinator plus two worktree agents. The "zero API
  cost" framing at promote was about the *tasks' verification* needing no paid fixtures; the run
  itself was never free, and that should have been said before firing. → **L-073**.
- **A generated SSOT degraded silently.** The C: volume hit zero free space and `gen-index.sh` failed
  mid-write, truncating `docs/knowledge-index.md` from 34 lines to 12 — a partial write that left a
  syntactically valid file. `qa-check` flagged it as "index STALE": the right alarm for the wrong
  reason. → **TD-021**.

**Pattern candidate**
- **L-072 is the second occurrence** of the allowlist-denies-the-terminal-step shape — the first is
  the `Skill(/handoff)` denial night-run.md Part 1 already records in prose. `count: 2` → promotion
  candidate at the next promote (§10).

**Bucket routing**

| Bucket | Filed |
|---|---|
| Shipped | **no CHANGELOG version block, no bump** (owner call at close). Both changes are repo-internal guards — `scripts/qa-check.sh` leg 13 and `evals/assert-boundary-park.sh`. The files do ship (the whole repo lands in the install cache), but no skill, template, or procedure a consumer invokes changed, so an entry would be one a reader cannot act on (LAW 4). Maintainer history lives in this archived file + the INDEX line |
| Tech debt | **TD-020** (preflight reads a hand-written manifest) · **TD-021** (`gen-index.sh` has no atomic-write guard) |
| Follow-ups | **TASK-131** (allowlist recipe misses the run's terminal steps) |
| Learnings | **L-071** (a check inherits its manifest's blind spots) · **L-072** (the terminal step is the choke point) · **L-073** (state the run's own cost, separately from the tasks') |
