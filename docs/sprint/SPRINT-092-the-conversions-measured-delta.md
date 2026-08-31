---
sprint: 092
slug: the-conversions-measured-delta
stream: engine
epic: EPIC-014
owner: Maintainer
last_updated: 2026-08-29
status: active
gates_signed: G1,G2 @ 760dc69
plan_commit: c52496f
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
- [x] §4 cases build their fixtures through the factory instead of inline construction — ✓ nine of the ten §4 test files import the factory; the tenth (`packages/standard/src/rules/adr-family.test.ts`) is deliberately excluded and **says so in-file** — it asserts `canonicalAdrs(...)` return values, never a `.verdict`, so verdict-blindness has nothing to guard there. **Byte-identical verdicts proved two ways:** *structurally* — T1's three commits (`043a7d6` · `211fbf3` · `ab75b2c`) touch only `*.test.ts` plus the two new `test/fixtures/` factories, so no verdict-producing code changed at all; and *live* — per-rule parity against a real Shell-oracle spawn is green across all nine retained fixtures (11 `(fixture, rule)` rows matched by **named finding**, not bare verdict, plus four sibling-control rows and `empty-slug`'s owner-ruled divergence). Printed verdict read directly: `22 pass, 0 fail`
- [x] A test's expected verdict comes from the engine, never from the factory — ✓ the factory's exported surface returns the **port interface** (`AdrFamilyPort`/`AdrHistoryPort`) — query methods only, with no data slot a verdict could occupy — and its state parameters are the pre-sealed `InMemory*Scenario` shapes rather than a second shape invented here. The must-FAIL is `packages/standard/src/rules/adr-fixture-factory-guardrail.test.ts`: three `@ts-expect-error` call sites smuggling `expectedVerdict` / `shouldPass` / `expectedFinding`. Rejection is **compile-time**, so `bunx tsc --noEmit` sitting at `0` is the standing proof rather than a one-time one — an unused `@ts-expect-error` is itself an error, so the guard cannot silently stop firing
- [x] The must-FAIL discriminates — ✓ **seeded and confirmed load-bearing, not merely present.** The same two smuggling calls stripped of their `@ts-expect-error` were seeded into a scratch `packages/standard/src/rules/__seedcheck_tmp.ts`; tsc reddened with `TS2353` naming `expectedVerdict` and `shouldPass` at exactly those two lines, while the **sibling controls** (legitimate state-only `adrFamilyPort`/`adrHistoryPort` calls, asserting real port behaviour) stayed green in the same run — L-142's shape, applied to a compile-time guard. Seed removed and the removal verified: `git status --short` empty, `bunx tsc --noEmit` back to `0`. **ONE hash convention throughout — `git hash-object` on the working-tree blob** (L-169): seed `a1e5f5a8dfbf5492cfc0645da7a09566eea45bfb`

### T2 — Convert the ADR-family harness to `bun:test` and drop it from the always-on leg `[size: M · risk: high · class: execution · HITL · J1]`
Layers: `evals/run-adr-family-fixtures.sh` · `evals/run-s4-ts-evaluators.sh` · `scripts/qa-check.sh` · `test/`
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
- [x] Case-for-case equivalence, matched by name and diffed as a list — ✓ `test/adr-family-harness-parity.test.ts` parses the harness's **own** `run_case_anywhere` call sites (anchored to line start — the harness's `FAIL fixture(...)` fallback names a case in prose and must not be counted twice, L-108) and diffs them against a declared coverage map **in both directions**: `expect(covered).toEqual(shell)` plus an explicit `{uncovered, orphaned}` assertion, so "most" cannot pass. **12 cases, cross-checked two ways** before the map was written. Each entry names a file *and* a verbatim source anchor, so a renamed counterpart reddens instead of standing as a claim about a test that no longer exists
- [x] The harness is removed from the always-on eval set — ✓ `eval_harnesses_always` no longer names `run-adr-family-fixtures.sh`; it moved to `eval_harnesses_optin`, keeping the bucket-completeness check satisfied. **Confirmed by a full gate run, not by reading the list**: the string `run-adr-family-fixtures.sh` appears **0 times** in the run's output, while `PASS eval harness run-s4-ts-evaluators.sh` appears in its place
- [x] The gate's own PRINTED verdict line is read as the check — ✓ every gate reading this task took came from `QA-CHECK: <N> pass, <M> fail`, printed by the gate itself, with output redirected to a file and the **file** read afterwards — never a piped status, never `echo $?`. This mattered twice in practice: the T1 gate **exited 1** while printing `209 pass, 1 fail` (one real finding), and an earlier `bun test | tail` buffered its entire output to nothing, which is L-120's shape appearing in the very task that cites it
- [x] Semantic coverage is unchanged, not merely relocated — ✓ **both branches satisfied, after the criterion was found unsatisfiable as designed.** The §4 rules still evaluate on every gate run: `run-s4-ts-evaluators.sh` is always-on and green at **83 pass, 0 fail in ~0.12 s**, covering rule semantics against the fakes *and* the nine retained fixture directories read through the evaluators. **And** § Decisions **D4** records exactly what moved to opt-in and why. Written only after the original premise was disproved three ways — see the T2 scope-change entry: dropping the harness alone would have **deleted** §4 from every default run, not relocated it

### T3 — Relocate §4 differential parity to the opt-in profile, with an ADR naming when parity must run `[size: S · risk: med · class: decision · HITL · J1]`
Layers: `evals/run-adr-family-fixtures.sh` · `scripts/qa-check.sh` · `docs/adr/` · `docs/DECISIONS.md` (narrowed at G2 from a bare directory declaration per L-100 — the directory form swallowed the night-run rollup harness, which the autonomy stream owns; a new parity harness file, if T3 creates one, is declared here too and logged)
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
- [x] Sign **G1 + G2** and record `gates_signed: G1,G2 @ <sha>` in this file's frontmatter. Absent means NOT signed and must never be read as approval (L-099). — ✓ signed at `760dc69`, the tree the gates were reviewed against. G1 took the **fast-path**: all four tasks are `origin: decomposer` and met the intake grill, so scope was re-confirmed rather than re-derived. Both assumptions were confirmed against evidence first, since an unconfirmed `assumes:` blocks G2
- [x] Rule at G2 on whether T2's coverage relocation (always-on → opt-in) is acceptable, since it is the one place this sprint trades a guard for time. — ✓ **owner ruled: acceptable, parity moves to opt-in as designed.** The saving is real (30.0 s of always-on cost, confirmed present in `eval_harnesses_always`), and §4 still evaluates in TS on every run through the evaluators SPRINT-091 T12 wired — so what moves to opt-in is the *differential parity against Shell*, not §4 coverage itself. T3's ADR must name the drift window that opens and the moments parity is mandatory; **T2's fourth DoD stays the binding one** — semantic coverage unchanged, not merely relocated

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
- **D4 — exactly which §4 coverage moved to opt-in, and why** *(added at execution under the owner's
  re-ruling; DoD 4's record half — see the T2 scope-change entry for the premise that failed).*
  **Stayed always-on**, in `evals/run-s4-ts-evaluators.sh` (~0.12 s): every §4 rule's semantics against
  the in-memory fakes, **and** the nine retained fixture directories read through the TS evaluators —
  so real-tree evaluation did not leave the default profile with the oracle. **Moved to opt-in**,
  with `evals/run-adr-family-fixtures.sh`: (i) the **differential against Shell** — TS-vs-oracle
  agreement row by row, which is what EPIC-014 D2 and the G2 ruling intended to relocate, and (ii) the
  **four S4.APPEND git-history cases** (edited-after-decision · post-decision-marker · no-history ·
  shallow-clone), whose counterparts build real repositories and spawn the oracle. S4.APPEND's *rule
  semantics* remain always-on through its history-port fake; what is opt-in is its **real-git
  integration**. That second item is a genuine narrowing of the default profile and is named here
  rather than folded into (i), because a debt row — or a DoD — that reports only the intended half is
  how the next reader over-credits the change. The always-on/opt-in split is pinned mechanically in
  `test/adr-family-harness-parity.test.ts`, so this paragraph and the artifact cannot drift apart
  silently (L-151: a decision recorded where its reader cannot reach it is not a decision).

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
| `evals/run-s4-ts-evaluators.sh` | T2 | NEW — the always-on §4 leg, oracle-free (~0.12s vs the 30.0s it replaces). Exists because dropping the shell harness alone would have deleted §4 from every default gate run, not relocated it | med | is the harness; green at 83 pass, 0 fail |
| `test/s4-retained-fixtures.test.ts` | T2 | NEW — the nine retained fixtures read through TS evaluators, no oracle spawn, so real-tree §4 coverage stays in the default profile | low | 15 tests, 87ms; sibling controls per fixture (L-142) |
| `test/adr-family-harness-parity.test.ts` | T2 | NEW — DoD 1's case-for-case list diff, both directions, anchored to real source fragments so a renamed counterpart reddens | med | 5 tests; both failure modes seeded and confirmed discriminating |
| `scripts/qa-check.sh` | T2 | `run-adr-family-fixtures.sh` moved always-on → opt-in, `run-s4-ts-evaluators.sh` takes its always-on slot; the stale "DELIBERATE EXCEPTION" paragraph replaced (it had also been inserted mid-sentence into the run-foreign-repo block, which this rejoins) | med | full gate: 209 pass, 1 fail → re-verified after the Layers fix |
| `test/fixtures/adr-family-factory.ts` | T1 | NEW — one shared ADR-port factory, replacing two independently-typed inline constructions scattered across five test files; sealed so it structurally cannot decide a verdict (H14) | low | `adr-fixture-factory-guardrail.test.ts` + `bunx tsc --noEmit` |
| `test/fixtures/git-repo-factory.ts` | T1 | NEW — the git-repo half of the same factory pair, options literal sealed the same way | low | guardrail test (type-checked, never invoked — a real `git init` per run isn't worth it) |
| `packages/standard/src/rules/adr-fixture-factory-guardrail.test.ts` | T1 | NEW — the must-FAIL half: three `@ts-expect-error` smuggling call sites + legitimate sibling controls; an unused directive is itself an error, so the guard cannot silently stop firing | low | is the test |
| `packages/standard/src/rules/adr-family-fixtures.test.ts` | T1 | Its own fixture-to-scenario bridge (SPRINT-091 T6) moved out to the shared factory — one loader, not two drifting copies | low | live Shell-oracle parity, 9 retained fixtures |
| `packages/standard/src/rules/s4-{onefile,index,sections,negative,append,append-oracle,append-registry}.test.ts` · `f4-registry.test.ts` | T1 | Inline `new InMemory*Port({...})` → factory calls; `211fbf3` closed the two registry files the first pass missed | low | `bun test` (22 pass, 0 fail on the §4 leg) |
| `packages/standard/src/rules/adr-family.test.ts` | T1 | Deliberately NOT migrated — asserts `canonicalAdrs(...)` returns, never a `.verdict`; rationale written in-file so the exclusion reads as a decision, not an oversight | low | unchanged |

## Retro
<!-- Written at close. Route the four buckets to their durable homes (STANDARD §10). -->
