---
sprint: 092
slug: the-conversions-measured-delta
stream: engine
epic: EPIC-014
owner: Maintainer
last_updated: 2026-08-29
status: active
plan_commit: [sha — set at promote]
close_commit: [sha — set at close]
update_trigger: sprint execute/close events
---

# SPRINT-092 — The Conversion's Measured Delta

> **Theme:** SPRINT-091 built the engine and migrated §4 whole, and deliberately made the gate **no
> faster** — the saving and the evidence for it were held back to travel together. This is that half.
> It converts the ADR-family harness off the Shell engine, moves §4 differential parity to the opt-in
> profile under an ADR, and then *measures what it actually bought* against the ceiling T2 derived —
> naming any shortfall rather than smoothing it. A conversion that ships without its measurement is an
> unmeasured claim recorded as fact (EPIC-014 D5).

## Scope

**In:** TS fixture factories for the §4 cases · the ADR-family harness converted to `bun:test` and
dropped from the always-on eval leg · §4 differential parity relocated to the opt-in profile with an
ADR naming when parity MUST run · a measured before/after Round settling what the conversion bought.

**Out (deferred):** every other rule family (F5 · F2 · F1 · F7 and the 196s dominant harness they
unlock) · QA severity/profiles/scheduler (H15–H20) · the binary build (H22) · **authority cutover and
Shell deletion (H24–H26) — this sprint is not a cutover, and Shell RETAINS §4 authority throughout
(EPIC-014 D2)** · any edit to `spec/STANDARD.md`'s normative content · `TD-120`'s git-spawn memoisation
(named in § Decisions D3 as the thing that must land before H24–H26, not here) · `TASK-318`'s
unwired-capability detector, which stays in the Backlog rather than riding an epic sprint it is not
part of · EPIC-015's execution-autonomy surface, which runs concurrently as the `autonomy` stream.

## Plan

### T1 — Build ADR and git-repo fixture factories in TypeScript `[size: S · risk: low · class: execution · AFK · J1]`
Layers: `packages/standard/src/rules/` · `test/fixtures/`
Depends-on: none — TASK-312's dependency was **satisfied by SPRINT-091 T7** (S4.APPEND migrated behind a real git port, `e0ccdb6`)
Cites: EPIC-014 H14 · L-142 · `evals/fixtures/adr-family/` (the nine retained fixtures — read, never modified)
Tier **G**. The §4 cases build their fixtures inline today. A factory is only safe if it cannot decide
the answer: the guardrail H14 states is *"factory creates state, factory does not decide expected
verdict"*, and the way to enforce that is structural — the factory exposes no assertion vocabulary at
all, so a verdict-deciding factory does not compile rather than merely being discouraged.

**Acceptance:** the §4 cases build fixtures through a factory, and a factory that tries to decide a
verdict is rejected rather than accepted.

**DoD:**
- [ ] §4 cases build their fixtures through the factory instead of inline construction — *Verify: the retained nine fixtures still produce byte-identical verdicts before and after, diffed per rule*
- [ ] A test's expected verdict comes from the engine, never from the factory — *Verify: the factory's exported surface contains no assertion vocabulary; a must-FAIL proves a verdict-deciding factory is rejected*
- [ ] The must-FAIL discriminates — *Verify: it reddens while a sibling control (a legitimate state-only factory) stays green (L-142); seed verified landed by `git hash-object` under ONE convention (L-169)*

### T2 — Convert the ADR-family harness to `bun:test` and drop it from the always-on leg `[size: M · risk: high · class: execution · HITL · J1]`
Layers: `evals/run-adr-family-fixtures.sh` · `scripts/qa-check.sh` · `test/`
Depends-on: T1
Cites: EPIC-014 H21 (slice pulled forward) · D5 feature-first · TD-090 · L-120 · SPRINT-091 T2 Round 12 (the derived ceiling) · `scripts/lib/conformance-engine.sh` (the engine being dropped from this harness — spawned, never modified)
Tier **G**. **The highest-risk task in either stream.** It removes a harness from the always-on eval
set, and a harness removed is a guard that stops running — so the case-for-case equivalence is the
whole of the work, not a formality. D2 forbids "most": the two case lists are diffed as lists.

`scripts/qa-check.sh` is a **single-owner file this stream owns exclusively** for the duration (§
Decisions D1) — its `eval_harnesses_always` string is one line naming every always-on harness, and this
task edits it.

**Acceptance:** every case the shell harness asserted has a `bun:test` equivalent, and the always-on
leg no longer spawns the Shell engine for §4.

**DoD:**
- [ ] Case-for-case equivalence, matched by name and diffed as a list — *Verify: the two case-name lists are compared as lists and are identical; "most" is a FAIL, never a pass (D2)*
- [ ] The harness is removed from the always-on eval set — *Verify: `eval_harnesses_always` no longer names it, and a full gate run confirms the §4 harness does not execute*
- [ ] The gate's own PRINTED verdict line is read as the check — *Verify: never a piped or redirected status; `gate | tail` reads `tail`'s status and `gate > out; echo $?` reads `echo`'s (L-120, five sightings)*
- [ ] Semantic coverage is unchanged, not merely relocated — *Verify: the §4 rules still evaluate somewhere on every gate run, or § Decisions records exactly which coverage moved to opt-in and why*

### T3 — Relocate §4 differential parity to the opt-in profile, with an ADR naming when parity must run `[size: S · risk: med · class: decision · HITL · J1]`
Layers: `evals/` · `scripts/qa-check.sh` · `docs/adr/` · `docs/DECISIONS.md`
Depends-on: T2
Cites: EPIC-014 D2 · ADR-029 (Tier G + Tier P) · ADR-034 (the frozen surface) · SPRINT-091 T6/T7 (the parity harness being relocated)
Tier **G** for the harness move, Tier **P** for the ADR text — declared separately because the bars
differ (ADR-029). Relocating parity to opt-in opens a **§4 drift window** between full-profile runs.
That is a real cost, and the ADR's job is to name it and to say when parity MUST run rather than to
argue it away.

**Acceptance:** parity still spawns Shell live and still asserts §4 row-by-row, now in the opt-in set,
and an ADR records the trade-off and the moments parity is mandatory.

**DoD:**
- [ ] The parity harness still spawns the Shell engine **live** and still asserts §4 row-by-row — *Verify: run it in the opt-in profile and confirm a real oracle spawn, not a copied literal*
- [ ] It sits in the opt-in eval set — *Verify: absent from the always-on run, present and passing under the opt-in profile*
- [ ] An ADR names the drift window and the moments parity MUST run — promote, close, and any full-profile run — *judgment tick: no mechanical check reaches an ADR's completeness, and inventing one to look mechanical is the failure, not the fix (G2 reachability)*
- [ ] The ADR states explicitly that **Shell retains §4 authority** under D2 — *Verify: this is not a cutover, and a reader must not be able to infer one*

### T4 — Measure the delta and settle what §4's conversion bought `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `docs/research/logs/qa-gate-timing.md` · `TECH-DEBT.md`
Depends-on: T2, T3
Cites: TD-090 · EPIC-014 § Closed-when 7 · SPRINT-091 T2 Rounds 10–12 · L-130 · SPRINT-089 T1 (the precedent for recording a missed target as missed) · `S9.LOGDIR` · `S12.GENERATED` (rule ids named in evidence; file-shaped to the layers parser)
Tier **G**. The sprint's whole justification lands here. SPRINT-091 T2 derived the ceiling — harness
19.9–21.0 s → 7.4–10.4 s, a saving of **9.5–13.6 s** — and recorded that the *percentage* goes stale
while the *seconds* do not, so this Round measures seconds and states any percentage beside its
denominator and host load.

**Acceptance:** a Round records the gate before/after on the same host, profile and semantic coverage,
and the result is compared against the derived ceiling with any shortfall named.

**DoD:**
- [ ] A Round records before/after on the **same host, same profile, same semantic coverage** — *Verify: state the host-load condition beside every figure; a bare elapsed number is not well-defined (SPRINT-091 Round 12, where a run truncated under concurrency)*
- [ ] The measured delta is compared against T2's derived ceiling of **9.5–13.6 s** — *Verify: extremes paired at every step, never a point estimate (L-130)*
- [ ] Any **shortfall is NAMED rather than smoothed** — *Verify: SPRINT-089 T1's precedent, which recorded a missed target as missed; a delta that lands under the ceiling is reported as such*
- [ ] `TD-090` is updated with what this conversion did **and did not** buy — *Verify: the row states both, since a debt row claiming only the win is how the next reader over-credits it*

## Owner-action checklist
- [ ] Sign **G1 + G2** and record `gates_signed: G1,G2 @ <sha>` in this file's frontmatter. Absent means NOT signed and must never be read as approval (L-099).
- [ ] Rule at G2 on whether T2's coverage relocation (always-on → opt-in) is acceptable, since it is the one place this sprint trades a guard for time.

## Decisions (pre-locked)

- **D1 — `scripts/qa-check.sh` and `evals/` are owned by THIS stream for the sprint's duration**, except
  `evals/run-night-run-rollup-fixtures.sh`, which belongs to the `autonomy` stream's T1. Cross-stream
  overlap is coordinated, never parallel-built (CONTEXT.md § Sprint model). Verified at promote: the
  `autonomy` stream's declared `touches:` do not include `qa-check.sh`, so the `eval_harnesses_always`
  line has exactly one editor.
- **D2 — `scripts/gen-index.sh` and `docs/knowledge-index.md` are NOT owned here.** The `autonomy`
  stream's T2 changes how the index is generated. This sprint's T3 writes an ADR, which *regenerates*
  the index as a derived artifact — that is fine, but no task here may change generation logic.
- **D3 — Shell retains §4 authority throughout.** This is not a cutover (EPIC-014 D2); H24–H26 remain
  out of scope, and **TD-120's git-spawn memoisation must land before them**, not here.

## Assumptions

- **A1** — Git-repo construction cost survives the conversion and only the engine-spawn term is removed.
  *Confirm: SPRINT-091 T2 Round 10 measured the split (engine share 88.2–89.6%, read as a magnitude);
  re-derive against that Round at G2 rather than inheriting this line.*
- **A2** — The always-on leg is where §4's cost actually sits. *Confirm: SPRINT-091 D1 chose F6 on that
  basis (30.0s always-on harness, already spec-reduced to §4); re-derive before T2 edits the leg.*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-092-the-conversions-measured-delta.md`, rendered
> from `templates/sprint-log.md.template` and created lazily at the first entry. Append there, never
> here (STANDARD §9 · ADR-014).

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro
<!-- Written at close. Route the four buckets to their durable homes (STANDARD §10). -->
