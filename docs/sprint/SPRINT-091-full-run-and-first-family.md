---
sprint: 091
slug: full-run-and-first-family
epic: EPIC-014
owner: Maintainer
last_updated: 2026-08-27
status: active
plan_commit: 3e787c2
close_commit: [sha — set at close]
update_trigger: sprint execute/close events
---

# SPRINT-091 — Full Run and the First Family

> **Theme:** SPRINT-087 put one rule through the TS engine and proved the path works. This sprint makes
> the engine able to run *whole*, migrates the first rule family chosen on measured cost rather than
> section number, and carries the slice through to the thing the owner actually feels: one eval harness
> that no longer spawns a 3,142-line Shell engine on every gate run. It opens with a type checker,
> because ten TypeScript tasks built on a toolchain that cannot check types would satisfy their own
> type-level acceptance with unchecked code (TD-101).

## Scope

**In:** a type check wired into the gate · full Standard traversal in TS with mark-driven dispatch, gap
and hold reporting and full-run level arithmetic, at parity with the Shell engine · a caller-supplied
spec path · the **F6 §4 ADR-governance family** migrated whole (five rules) · TS fixture factories ·
`run-adr-family-fixtures.sh` converted to `bun:test` and removed from the always-on eval leg · §4
differential parity relocated to the opt-in profile under an ADR · a measured before/after.

**Out (deferred):** every other rule family — F5, F2, F1, F7 and the 196s dominant harness they unlock
are the *next* slice, not this one · QA severity/profiles/scheduler (H15–H20) · the binary build (H22) ·
authority cutover and Shell deletion (H24–H26) · any edit to `spec/STANDARD.md`'s normative content ·
EPIC-015's execution-autonomy surface.

## Plan

### T1 — Wire a type checker into the gate `[size: S · risk: med · class: execution · HITL · J1]`
Layers: package.json · scripts/qa-check.sh · tsconfig
Depends-on: none
Cites: TD-101 · EPIC-014 D4 · L-105
Tier **G**. The repo states guarantees as "enforced by a TYPE" while no automated path evaluates one —
no type-check invocation anywhere, and no type-checker dependency declared at all. Every task below is
TypeScript, so this is the floor they stand on, not a cleanup.

**Acceptance:** the gate fails on a type error that it currently accepts in silence.

**DoD:**
- [ ] A type check runs inside the gate — *Verify: the gate's own printed verdict line names it; not a wrapper's exit status (L-120)*
- [ ] It FAILS on TD-101's exact recorded case — *Verify: a bare string assigned to a readonly Finding[], and a number to a string field; both currently pass*
- [ ] A sibling control stays green — *Verify: correct code in the same file passes, so the check discriminates rather than reddening everything (L-142)*
- [ ] The type-checker dependency is declared, not assumed present

### T2 — Derive the conversion's real headroom `[size: S · risk: low · class: execution · HITL · J1]`
Layers: docs/research/logs/qa-gate-timing.md · instrumented temp copies, never shipped files
Depends-on: none
Cites: TD-090 · qa-gate-timing Rounds 5–8 · L-130
Tier **G**. No later DoD may carry a performance number that does not trace to this Round. The claim
that a TS in-process traversal costs ~ms where the Shell spawn costs 8.5s is **unmeasured**, and
freezing an estimate into an acceptance threshold is the failure L-130 records.

**Acceptance:** a new Round exists, and every later performance figure derives from it.

**DoD:**
- [ ] The ADR-family harness's cost is split between git-repo construction and engine invocation — *Verify: measured by instrumented copy, never read from source*
- [ ] A TS-vs-Shell per-invocation comparison on one fixture target, using the already-migrated §12 family — *Verify: named explicitly as a proxy, since §4 is not yet migrated*
- [ ] The derived ceiling on what converting this harness can save is stated as a range, not a point
- [ ] Caveats recorded, including sample counts

### T3 — Full Standard traversal in TS, at parity with the Shell full run `[size: M · risk: med · class: execution · HITL · J1]`
Layers: apps/cli · packages/standard (traversal · mark-driven dispatch) · tests
Depends-on: T1
Cites: EPIC-014 H12 · § Closed-when 2 · SPRINT-087 (registry)
Tier **G**. The CLI today answers only `--rule` and `--section`; there is no whole-spec run. Traversal is
what lets a fixture repo be answered in one in-process call instead of one process per case.

**Acceptance:** a flagless conformance invocation answers a whole repository, matching Shell row-by-row.

**DoD:**
- [ ] Every rule the parser admits is traversed and dispatched by its §14 mark — *Verify: row-by-row against conformance-engine.sh spawned live as an oracle, never a copied literal*
- [ ] A rule with no registered evaluator reports as a NAMED gap — *Verify: seed one out of the registry; exactly that row reddens and the rest stay green*
- [ ] Dispatch stays open-closed — *Verify: the traversal adds no switch; registration remains at each rule's own call site*

### T4 — Hold semantics and full-run level arithmetic `[size: M · risk: med · class: execution · HITL · J1]`
Layers: packages/standard (result domain · level arithmetic) · tests
Depends-on: T3
Cites: EPIC-014 H12 · SPRINT-087 T4 · L-058
Tier **G**. Split from T3 deliberately: SPRINT-087's lesson is that code which *produces* a verdict gets
forgotten because its output looks like data rather than a claim. Level arithmetic is exactly that code.

**Acceptance:** the full-run level matches Shell's, and a partial run still refuses to publish one.

**DoD:**
- [ ] Full-run level matches Shell across fixture repos including at least one HOLD case — *Verify: differential, per repo*
- [ ] Hold is distinguished from fail, never collapsed — *Verify: a HOLD fixture and a FAIL fixture resolve to different outcomes*
- [ ] A partial invocation still emits NO global level — *Verify: seed one in; only the structural checks redden, per SPRINT-087's frozen-result property*

### T5 — Accept a caller-supplied spec path `[size: S · risk: med · class: execution · HITL · J1]`
Layers: apps/cli · tests
Depends-on: T1
Cites: SPRINT-087 (spec-not-found vs permission-denied) · T9
Tier **G** by defaulting up (ADR-029): a silently-ignored spec path would make every fixture assertion
vacuous while the suite stayed green — a false negative by construction. Fixture harnesses hand the
engine doctored specs, so the conversion at T9 cannot happen without this.

**Acceptance:** the engine evaluates the spec it is handed, and says so when it cannot.

**DoD:**
- [ ] A caller-supplied spec is evaluated instead of the shipped Standard — *Verify: a doctored spec dropping one rule row provably changes the result, with a sibling control unchanged*
- [ ] A nonexistent path fails loudly and stays distinct from an unreadable one — *Verify: two cases, two different named outcomes*

### T6 — Migrate S4.ONEFILE · S4.INDEX · S4.SECTIONS · S4.NEGATIVE `[size: M · risk: med · class: execution · HITL · J1]`
Layers: packages/standard/src/rules · evals/fixtures (retained, never replaced) · tests
Depends-on: T1
Cites: EPIC-014 H13 · D2 strangler · L-142 · L-169
Tier **G**. The four file/text §4 rules. F6 was chosen on measured cost across both axes — see D1.

**Acceptance:** four §4 rules evaluate in TS and agree with Shell on the retained fixtures.

**DoD:**
- [ ] Four evaluators registered at their own call sites with no edit to dispatch
- [ ] Per-rule parity against Shell on the retained fixtures — *Verify: row-by-row, naming the offending rule on mismatch*
- [ ] Each retained must-FAIL reddens with its OWN named finding while its sibling control stays green (L-142)
- [ ] Every seeded break is verified to have landed, under ONE stated hash convention — *Verify: never two methods in one evidence block (L-169)*

### T7 — Migrate S4.APPEND behind a real git port `[size: M · risk: high · class: execution · HITL · J1]`
Layers: packages/standard/src/rules · adapters · tests
Depends-on: T6
Cites: EPIC-014 H13 · SPRINT-087 (port + fake pattern) · L-166
Tier **G**. §4's only git-defined rule, split out because it needs a port the other four do not. Its
shallow-clone branch is the L-166 risk: a branch that works on a fixture but is unreachable on anything
the system emits is an absent guard that clears every proof above it.

**Acceptance:** S4.APPEND evaluates in TS over real git state and agrees with Shell.

**DoD:**
- [ ] Parity with Shell including the marker-passes and shallow-clone cases
- [ ] Real adapter plus in-memory fake, per SPRINT-087's port pattern
- [ ] The shallow-clone branch is pointed at the artifact that motivated it and shown REACHABLE — *Verify: not merely working on a fixture (L-166)*

### T8 — ADR and git-repo fixture factories `[size: S · risk: low · class: execution · AFK · J1]`
Layers: test factories · §4 tests
Depends-on: T7
Cites: EPIC-014 H14
Tier **X**. The §4 cases build repeated fixture state inline; a factory removes the duplication without
acquiring any opinion about verdicts.

**Acceptance:** §4 cases build state through a factory, and no test learns its expected verdict from one.

**DoD:**
- [ ] The §4 cases build fixtures through the factory instead of inline construction
- [ ] The factory exposes no assertion vocabulary at all — *Verify: a must-FAIL proving a verdict-deciding factory is rejected*

### T9 — Convert the ADR-family harness to bun:test and drop it from the always-on leg `[size: M · risk: high · class: execution · HITL · J1]`
Layers: evals/ · scripts/qa-check.sh (leg 12) · test/
Depends-on: T3, T4, T5, T6, T7, T8
Cites: EPIC-014 H21 (slice pulled forward) · D5 feature-first · TD-090 · L-120
Tier **G**. The payoff task and the risk concentration — six dependencies and the only one that edits
the shipped gate. Everything before it exists so this can happen honestly.

**Acceptance:** the gate no longer spawns the Shell engine for §4, and no case was lost doing it.

**DoD:**
- [ ] Every case the shell harness asserted has a bun:test equivalent — *Verify: case-name FOR case-name, diffed to an identical list; "most" is not a result (D2)*
- [ ] The harness is removed from the always-on eval set
- [ ] The gate's own PRINTED verdict line is read as the check — *Verify: run the gate as its own call; never a piped or redirected status (L-120)*

### T10 — Relocate §4 differential parity to the opt-in profile `[size: S · risk: med · class: decision · HITL · J1]`
Layers: evals/ · scripts/qa-check.sh · docs/adr/
Depends-on: T9
Cites: EPIC-014 D2 · ADR-029
Tier **G**, with the ADR body Tier **P**. Parity must survive the speed win, or the strangler has been
abandoned rather than advanced. Shell keeps §4 authority; this is not a cutover.

**Acceptance:** parity still runs and still asserts row-by-row — just not on every gate run.

**DoD:**
- [ ] A parity harness still spawns Shell live and still asserts §4 row-by-row, now in the opt-in set
- [ ] An ADR records the trade-off — the §4 drift window between full-profile runs — and names the moments parity MUST run: promote, close, and any full-profile run
- [ ] The ADR states explicitly that Shell RETAINS §4 authority under D2

### T11 — Measure the delta and settle what §4's conversion bought `[size: S · risk: low · class: execution · HITL · J1]`
Layers: docs/research/logs/qa-gate-timing.md · TECH-DEBT.md
Depends-on: T2, T9, T10
Cites: TD-090 · EPIC-014 § Closed-when 7 · SPRINT-089 T1 (recording a missed target as missed)
Tier **G**. A conversion whose saving is asserted rather than measured has not been shown to save
anything.

**Acceptance:** the delta is measured, compared against T2's ceiling, and any shortfall is named.

**DoD:**
- [ ] A new Round records gate before/after on the same host, same profile, same semantic coverage
- [ ] The measured delta is compared against T2's derived ceiling — *Verify: a shortfall is NAMED, not smoothed (SPRINT-089 T1's precedent)*
- [ ] TD-090 is updated with what this conversion did and did not buy

## Owner-action checklist
- [ ] Sign **G1 + G2** and record `gates_signed: G1,G2 @ <sha>` in this file's frontmatter. Absent means NOT signed and must never be read as approval (L-099).

## Decisions (pre-locked)

- **D1** — **F6 §4 ADR governance migrates first**, closing EPIC-014's parked open question with the
  profile it was waiting for. Chosen on **both** axes: 2nd at real scale (72.1s) *and* the sole owner of
  an always-on harness (30.0s, already spec-reduced to §4, so five rules convert it whole). **F11 was
  rejected despite ranking 1st** (84.7s) — its only harness is opt-in, so migrating it would move the
  default gate by zero seconds. Ordering by section number is forbidden (V3 §43).
- **D2** — **The slice carries through to a converted harness and a measured delta**, not stopping at the
  family — EPIC-014 D5 rejects a sprint framed only as a technical layer with no working behaviour.
- **D3** — **§4 differential parity relocates to the opt-in profile; Shell RETAINS §4 authority.**
  Not a cutover (epic D2). **→ ADR at T10**, which owes the drift-window trade-off and when parity runs.
- **D4** — **The type checker lands first.** Ten TS tasks on a toolchain that evaluates no types would
  satisfy type-level DoD with unchecked code (TD-101, `high` and unrouted for four sprints).
- **D5** — **Overlap-ownership map.** `scripts/qa-check.sh` is touched by **T1, T9 and T10** — single
  owner, commit order **T1 → T9 → T10**, staged per-hunk, never a plain `git add` over another task's
  WIP (L-042/L-037). `docs/research/logs/qa-gate-timing.md` is touched by **T2 then T11**, in that order.

## Assumptions

- **A1** — A TS in-process traversal is materially cheaper per invocation than the 8.5s Shell spawn.
  **UNMEASURED.** *Confirm: T2, before any later DoD carries a number (L-130).*
- **A2** — 74% of leg 12 (295.9s of 400.7s) is harnesses spawning the Shell engine. *Confirm: Round 7's
  per-harness sweep plus the intake attribution query, which agreed; re-confirmed at T11.*
- **A3** — S4.APPEND is §4's only git-defined rule. *Confirm: re-derive from the family's rule list at
  G2 rather than inheriting this line.*
- **A4** — The ADR-family harness's git-repo construction (~27s of its 30s) survives conversion, so only
  the engine-spawn term is removed. *Confirm: T2 measures the split; T9's expected saving derives from it.*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-091-full-run-and-first-family.md`, rendered from
> `templates/sprint-log.md.template` and created lazily at the first entry. Append there, never here
> (STANDARD §9 · ADR-014).

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro
<!-- Written at close. Route the four buckets to their durable homes (STANDARD §10). -->
