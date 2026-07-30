---
sprint: 041
slug: debt-guards
owner: Maintainer
last_updated: 2026-07-30
status: active
plan_commit: [sha — set at promote]
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
- [ ] `qa-check.sh` gains a leg asserting each of the migrate and init procedures carries a headless
      **detection** cue (the ask-channel probe) *and* a park-record instruction naming the handoff doc
- [ ] Leg follows the existing text-lint idiom (`ok`/`bad` helpers, named finding, never a bare FAIL)
- [ ] **Negative-tested per check**: cue stripped from the migrate procedure → FAIL naming it; cue
      stripped from the init procedure → FAIL naming it; park-record instruction removed → FAIL. Each
      run bare, never piped (L-057), then the scratch edits reverted
- [ ] Green on the unmodified tree, and the whole gate still exits 0
- [ ] `docs/QA.md` leg inventory updated; TD-019 marked `status: resolved → SPRINT-041 T1`
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
- [ ] The idiom no longer double-counts on zero-match (`grep -q`, as the sibling judgement-retry
      assertion already does, or an explicit count — not a second `|| echo`)
- [ ] Zero-match direction exercised on a real fixture: verdict text unchanged, stderr clean
- [ ] Match direction exercised: PASS verdict and its count unchanged
- [ ] `sh evals/selftest-assert-boundary-park.sh` passes; `sh scripts/qa-check.sh` stays green
- [ ] TD-018 marked `status: resolved → SPRINT-041 T2`

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

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro

<!-- Written at close. -->
