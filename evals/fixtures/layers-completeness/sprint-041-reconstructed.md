---
sprint: 041
slug: debt-guards-reconstructed
owner: Maintainer
last_updated: 2026-08-01
status: active
plan_commit: fixture
close_commit: fixture
update_trigger: fixture -- reconstructed for evals/run-layers-completeness-fixtures.sh (TD-020); do
  not treat as a real sprint file, it is not read by any other qa-check.sh leg
---

# SPRINT-041 — Debt Guards (reconstructed fixture, must-FAIL input)

<!-- This is NOT the real SPRINT-041 file (that one is closed, archived at
     docs/sprint/archive/SPRINT-041-debt-guards.md, and untouched by this task). It reproduces
     T1 and T2's Plan blocks verbatim -- header meta, Layers:, Depends-on:, narrative, Acceptance,
     DoD -- exactly as promoted, `status:` forced to `active` so qa-check.sh's active-sprint legs
     will process it. This is the real recorded miss TD-020 names: both DoDs required marking a TD
     resolved, neither task's Layers: declared TECH-DEBT.md, and the preflight passed on the
     incomplete input. -->

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
      merge-back: 69 pass, 0 fail
- [x] `docs/QA.md` leg inventory updated; TD-019 marked `status: resolved → SPRINT-041 T1`

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
      closed interactively after merge-back: selftest all PASS, gate 69 pass / 0 fail
- [x] TD-018 marked `status: resolved → SPRINT-041 T2`
