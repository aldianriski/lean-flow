---
id: ADR-039
tags: [tooling, process, testing]
domain: governance
status: accepted
related: [ADR-035, ADR-034, ADR-029, ADR-021]
---

# ADR-039 — §4 differential parity moves to the opt-in profile, and the drift window is named rather than argued away

- **Status:** accepted (2026-08-31)
- **Deciders:** Maintainer
- **Context driver:** SPRINT-092 T2 took §4's always-on coverage off the Shell engine. The half that
  cannot follow it is the half whose whole purpose is to compare the two engines — that needs a live
  oracle spawn per row, which is the cost being removed. Moving it opens a window in which TS and
  Shell can disagree unobserved, and an unnamed window is indistinguishable from no window at all.

## Context

Until SPRINT-092, §4's only default-profile coverage was `evals/run-adr-family-fixtures.sh`: twelve
spawns of `scripts/lib/conformance-engine.sh` against the nine retained fixture directories, 30.0 s on
every bare gate run. SPRINT-091 T12 wired TS evaluators for §4, so the *rule semantics* no longer need
a subprocess — T2 replaced the harness with `evals/run-s4-ts-evaluators.sh` (~0.12 s), which evaluates
§4 against the in-memory fakes **and** reads the nine retained fixture directories through the TS
evaluators. Semantic coverage stayed always-on.

What could not stay is the **differential**: `adr-family-fixtures.test.ts` and
`s4-append-oracle.test.ts` assert, row by row and matched on the *named finding*, that TS and a live
Shell oracle reach the same verdict on the same tree. That comparison is meaningless without a real
spawn, and the spawns are the cost. It now lives in `evals/run-s4-differential-parity.sh`, opt-in
behind `QA_FULL=1`.

One fact shaped this decision more than any argument, and it is recorded because it nearly shipped
inverted: `scripts/qa-check.sh` reduces its own spec on a bare run to `S9.GATESWELLFORMED` /
`S9.GATESABSENT` + `S13.*` — **0 of §4's 7 rows survive that filter** — and it never invokes
`bun test`. So "the TS evaluators run on every run" was true of `bun test` and false of *the gate*.
The always-on eval set was §4's only default-profile coverage, and removing the harness without
replacing it would have deleted §4 from every default run rather than relocating it. The replacement
leg exists because that was measured, not because it was assumed.

## Decision

**§4 differential parity is OPT-IN. Shell RETAINS §4 authority. This is not a cutover.**

1. **The drift window is real and is stated, not minimised.** Between full-profile runs, the TS
   evaluators and the Shell oracle may diverge on §4 with nothing reporting it. A green default gate
   asserts that §4's rules evaluate and agree with their *own* expectations; it asserts **nothing**
   about TS/Shell agreement. Anyone reading a green bare run as parity evidence has read it wrong.

2. **Parity is MANDATORY at three moments**, and a run that skips them is not merely faster, it is
   uninformative about drift:
   - **promote** — before a Plan freezes against the engine's behaviour;
   - **close** — before a sprint's claims about §4 become the record;
   - **any full-profile run** (`QA_FULL=1`) — which is what makes the other two mechanically
     reachable rather than a matter of memory.

3. **Shell remains the §4 oracle (EPIC-014 D2, SPRINT-092 D3).** TS is the migrated implementation
   being checked *against* Shell, never the other way round. The authority cutover and Shell's
   deletion are H24–H26 and remain out of scope; `TD-120`'s git-spawn memoisation must land before
   them. A reader must not be able to infer a cutover from this ADR: the always-on leg being TS is a
   statement about *cost*, not about *authority*.

4. **The known divergence stays known.** `empty-slug` is an owner-ruled, intended TS/Shell
   disagreement (Shell's own two-glob inconsistency re-admits a file its `S4.ONEFILE` just rejected).
   Both sides are pinned independently, neither asserted equal to the other. Opt-in status does not
   convert a documented divergence into an undiscovered one.

## Consequences

**Positive.** The default gate stops paying 30.0 s for twelve engine spawns while keeping §4's rules
evaluated on every run. The differential still exists, still spawns a live oracle, and now says so in
its own harness header instead of being implied by a list membership.

**Negative — and this is the cost being bought, not a side effect.** §4 can drift between TS and Shell
without any default run noticing. The window is bounded only by discipline: if the three mandatory
moments above are skipped, the first evidence of drift will be a full-profile run long after the
change that caused it, when the diff is large and the cause is cold. This is strictly worse than the
always-on differential it replaces, and it is accepted because the alternative was paying 30.0 s on
every run for a comparison whose value is concentrated at a few decision points. A second negative:
the split means two harnesses must stay in step — `evals/run-s4-differential-parity.sh` is a guard
whose own absence from `eval_harnesses_optin` would be silent, which is why bucket membership is
itself checked by `qa-check.sh`'s completeness leg.

**Neutral.** `s4-append-shallow-reachability.test.ts` is deliberately excluded from the differential
harness: it clones this repo's real remote (L-166's reachability proof) and is therefore
network-dependent. A harness that reddens on a flaky connection teaches people to ignore it. It stays
reachable through a plain `bun test`.

## Alternatives

**Keep the differential always-on.** Rejected: it is the 30.0 s this sprint exists to remove, and
EPIC-014 D2 already ruled the relocation acceptable. Keeping it would have made T2 a no-op.

**Drop the differential entirely, trusting the TS evaluators.** Rejected outright, and it is the
dangerous option precisely because it looks like this one. Shell retains §4 authority; deleting the
comparison would make the authority claim unfalsifiable and turn the migration into an unmeasured
assertion — the failure EPIC-014 D5 names.

**Move the differential to opt-in *without* replacing the always-on leg.** This is what the plan said
before execution measured it, and it would have deleted §4 from the default profile. Rejected on
evidence rather than judgement: the spec reduction keeps 0 of 7 §4 rows, the removed harness was the
only always-on one mentioning `S4.`, and the last green run contained zero `S4.` lines.

**Run the differential on a timer or in CI rather than a profile.** Rejected as unavailable: this repo
carries no CI workflow at all (verified during SPRINT-091 T7 — no `.github/`, no CI config anywhere in
the tree). A decision that depends on infrastructure the repo does not have is a decision that does
not run.
