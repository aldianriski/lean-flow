---
sprint: 091
slug: full-run-and-first-family
epic: EPIC-014
owner: Maintainer
last_updated: 2026-08-27
status: active
gates_signed: G1,G2 @ f24abde
plan_commit: 3e787c2
close_commit: [sha — set at close]
update_trigger: sprint execute/close events
---

# SPRINT-091 — Full Run and the First Family

> **Theme:** SPRINT-087 put one rule through the TS engine and proved the path works. This sprint makes
> the engine able to run *whole*, and migrates the first rule family **complete** — chosen on measured
> cost rather than section number. It opens with a type checker, because seven TypeScript tasks built
> on a toolchain that cannot check types would satisfy their own type-level acceptance with unchecked
> code (TD-101). **Split from an eleven-task Plan at G1** (see the Execution Log's `scope-change`): the
> harness conversion this engine work exists to enable is SPRINT-092's, and travels with the measured
> delta that proves it rather than trailing an over-long sprint.

## Scope

**In:** a type check wired into the gate · full Standard traversal in TS with mark-driven dispatch, gap
and hold reporting and full-run level arithmetic, at parity with the Shell engine · a caller-supplied
spec path · the **F6 §4 ADR-governance family** migrated whole (all five rules, S4.APPEND included).

**Out (deferred) — the split half first, so it is not mistaken for abandoned:** TS fixture factories ·
`run-adr-family-fixtures.sh` converted to `bun:test` and dropped from the always-on eval leg · §4
differential parity relocated to the opt-in profile under an ADR · the measured before/after. These are
`TASK-313`–`TASK-316`, still `state: ready` in the Backlog, and promote as **SPRINT-092** once this
sprint closes. **No gate gets faster in this sprint** — that is the deferred half, and saying so here is
the point. Also out: every other rule family (F5, F2, F1, F7 and the 196s dominant harness they unlock) ·
QA severity/profiles/scheduler (H15–H20) · the binary build (H22) · authority cutover and Shell deletion
(H24–H26) · any edit to `spec/STANDARD.md`'s normative content · EPIC-015's execution-autonomy surface.

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
Layers: docs/research/logs/qa-gate-timing.md
Depends-on: none
Cites: TD-090 · qa-gate-timing Rounds 5–8 · L-130
Tier **G**. No later DoD may carry a performance number that does not trace to this Round. The claim
that a TS in-process traversal costs ~ms where the Shell spawn costs 8.5s is **unmeasured**, and
freezing an estimate into an acceptance threshold is the failure L-130 records.

**Acceptance:** a new Round exists, and every later performance figure derives from it.

**DoD:**
- [ ] The ADR-family harness's cost is split between git-repo construction and engine invocation — **judgment tick, and it says so**: measured by instrumented copy, never read from source; no checker can tell a real measurement from an invented one
- [ ] A TS-vs-Shell per-invocation comparison on one fixture target, using the already-migrated §12 family — **judgment tick**: it is a *proxy* (§4 is not yet migrated) and must be labelled one in the Round itself
- [ ] The derived ceiling is stated as a **range, not a point** — **judgment tick**; this host's timings drift run-to-run, which is why every prior Round reports ranges
- [ ] Caveats recorded, including sample counts — **judgment tick**

<!-- T2 carries NO mechanical criterion, and that is declared rather than disguised (G2 reachability).
     Inventing a checker to make a measurement task look mechanical is the failure, not the fix. What
     guards T2 instead is downstream: no later DoD may carry a figure that does not trace to its Round,
     so a fabricated or absent measurement surfaces the moment T-anything cites it. -->

### T3 — Full Standard traversal in TS, at parity with the Shell full run `[size: M · risk: med · class: execution · HITL · J1]`
Layers: apps/cli/src · packages/standard/src · tests
Depends-on: T1, T8
Cites: EPIC-014 H12 · § Closed-when 2 · SPRINT-087 (registry) · `scripts/lib/conformance-engine.sh` (parity oracle — spawned, never modified)
Tier **G**. The CLI today answers only `--rule` and `--section`; there is no whole-spec run. Traversal is
what lets a fixture repo be answered in one in-process call instead of one process per case.

**Acceptance:** a flagless conformance invocation answers a whole repository, matching Shell row-by-row.

**DoD:**
- [ ] Every rule the parser admits is traversed and dispatched by its §14 mark — *Verify: row-by-row against `scripts/lib/conformance-engine.sh` spawned live as an oracle, never a copied literal*
- [ ] A rule with no registered evaluator reports as a NAMED gap — *Verify: seed one out of the registry; exactly that row reddens and the rest stay green*
- [ ] Dispatch stays open-closed — *Verify: the traversal adds no switch; registration remains at each rule's own call site*

### T4 — Hold semantics and full-run level arithmetic `[size: M · risk: med · class: execution · HITL · J1]`
Layers: packages/standard/src · tests
Depends-on: T3
Cites: EPIC-014 H12 · SPRINT-087 T4 · L-058 · `scripts/lib/conformance-engine.sh` (parity oracle)
Tier **G**. Split from T3 deliberately: SPRINT-087's lesson is that code which *produces* a verdict gets
forgotten because its output looks like data rather than a claim. Level arithmetic is exactly that code.

**Acceptance:** the full-run level matches Shell's, and a partial run still refuses to publish one.

**DoD:**
- [ ] Full-run level matches Shell across fixture repos including at least one HOLD case — *Verify: differential, per repo*
- [ ] Hold is distinguished from fail, never collapsed — *Verify: a HOLD fixture and a FAIL fixture resolve to different outcomes*
- [ ] A partial invocation still emits NO global level — *Verify: seed one in; only the structural checks redden, per SPRINT-087's frozen-result property*

### T5 — Accept a caller-supplied spec path `[size: S · risk: med · class: execution · HITL · J1]`
Layers: apps/cli/src · tests
Depends-on: T1, T3
Cites: SPRINT-087 (spec-not-found vs permission-denied)
Tier **G** by defaulting up (ADR-029): a silently-ignored spec path would make every fixture assertion
vacuous while the suite stayed green — a false negative by construction. Fixture harnesses hand the
engine doctored specs, so the harness conversion deferred to SPRINT-092 cannot happen without this
landing here first.

**Acceptance:** the engine evaluates the spec it is handed, and says so when it cannot.

**DoD:**
- [ ] A caller-supplied spec is evaluated instead of the shipped Standard — *Verify: a doctored spec dropping one rule row provably changes the result, with a sibling control unchanged*
- [ ] A nonexistent path fails loudly and stays distinct from an unreadable one — *Verify: two cases, two different named outcomes*

### T6 — Migrate S4.ONEFILE · S4.INDEX · S4.SECTIONS · S4.NEGATIVE `[size: M · risk: med · class: execution · HITL · J1]`
Layers: packages/standard/src/rules · evals/fixtures · tests
Depends-on: T1, T4
Cites: EPIC-014 H13 · D2 strangler · L-142 · L-169 · `scripts/lib/conformance-engine.sh` (parity oracle)
Tier **G**. The four file/text §4 rules. F6 was chosen on measured cost across both axes — see D1.

**Acceptance:** four §4 rules evaluate in TS and agree with Shell on the retained fixtures.

**DoD:**
- [ ] Four evaluators registered at their own call sites with no edit to dispatch
- [ ] Per-rule parity against Shell on the retained fixtures — *Verify: row-by-row, naming the offending rule on mismatch*
- [ ] Each retained must-FAIL reddens with its OWN named finding while its sibling control stays green (L-142)
- [ ] Every seeded break is verified to have landed, under ONE stated hash convention — *Verify: never two methods in one evidence block (L-169)*

### T7 — Migrate S4.APPEND behind a real git port `[size: M · risk: high · class: execution · HITL · J1]`
Layers: packages/standard/src/rules · packages/standard/src/adapters · tests
Depends-on: T6
Cites: EPIC-014 H13 · SPRINT-087 (port + fake pattern) · L-166 · `scripts/lib/conformance-engine.sh` (parity oracle)
Tier **G**. §4's only git-defined rule, split out because it needs a port the other four do not. Its
shallow-clone branch is the L-166 risk: a branch that works on a fixture but is unreachable on anything
the system emits is an absent guard that clears every proof above it.

**Acceptance:** S4.APPEND evaluates in TS over real git state and agrees with Shell.

**DoD:**
- [ ] Parity with Shell including the marker-passes and shallow-clone cases
- [ ] Real adapter plus in-memory fake, per SPRINT-087's port pattern
- [ ] The shallow-clone branch is pointed at the artifact that motivated it and shown REACHABLE — *Verify: not merely working on a fixture (L-166)*

### T8 — Bring the TypeScript tree to zero type errors `[size: M · risk: med · class: execution · HITL · J1]`
Layers: packages/standard/src/tokenizer.ts · packages/standard/src · apps/cli/src
Depends-on: T1
Cites: TD-101 · ADR-037 · SPRINT-085 (the branded `RuleId` guarantee) · L-120
Tier **G**. **Runs at wave 1, despite sitting last in this file** — it is numbered T8 because every
guard here matches `^### T[0-9]+` and a `T1b` block would have been silently skipped by the schema
check, the layers check and the preflight alike. Read the wave computation, not the file order.

Turning the checker on revealed **59 real type errors in ten files** — 35 of them (59%) in
`tokenizer.ts` and its test. Several are modelling failures rather than strictness noise: a
discriminated union not narrowed at its read sites, and `'string' is not assignable to 'RuleId'`
recurring, which means the brand SPRINT-085 recorded as a guarantee is not holding. T1's gate leg
cannot be wired blocking until this is green, and wiring it non-blocking is the un-failable check
ADR-037 rejects in writing.

**Acceptance:** `tsc --noEmit` exits 0 over the whole workspace, and the suite still passes.

**DoD:**
- [ ] Zero type errors remain — *Verify: read `tsc`'s OWN exit code and its own printed error count, never a status handed back through a pipe (L-120)*
- [ ] The `RuleId` brand actually holds — *Verify: a bare string in a `RuleId` position is rejected, while a properly branded value passes — the must-FAIL and its sibling control (L-142)*
- [ ] Union narrowing is fixed at the read sites, not silenced — *Verify: no `as` assertion or `any` is introduced to clear an error; `git diff` shows narrowing, and a seeded re-break reddens the same case*
- [ ] The suite is unchanged — *Verify: 266 pass, 0 fail, matching the pre-change baseline exactly*

## Owner-action checklist
- [ ] Sign **G1 + G2** and record `gates_signed: G1,G2 @ <sha>` in this file's frontmatter. Absent means NOT signed and must never be read as approval (L-099).

## Decisions (pre-locked)

- **D1** — **F6 §4 ADR governance migrates first**, closing EPIC-014's parked open question with the
  profile it was waiting for. Chosen on **both** axes: 2nd at real scale (72.1s) *and* the sole owner of
  an always-on harness (30.0s, already spec-reduced to §4, so five rules convert it whole). **F11 was
  rejected despite ranking 1st** (84.7s) — its only harness is opt-in, so migrating it would move the
  default gate by zero seconds. Ordering by section number is forbidden (V3 §43).
- **D2** — **This sprint delivers working behaviour, not a layer** (EPIC-014 D5). The engine runs whole
  *and* one family evaluates in TS at parity — a capability, not scaffolding. The conversion that turns
  that capability into a faster gate is SPRINT-092's, deliberately paired with the measurement that
  proves it: shipping a saving and its evidence apart is how an unmeasured claim gets recorded as fact.
- **D3** — **Shell RETAINS §4 authority throughout this sprint.** Nothing here is a cutover (epic D2);
  the parity relocation and its ADR moved to SPRINT-092 with the conversion they serve.
- **D4** — **The type checker lands first.** Seven TS tasks on a toolchain that evaluates no types would
  satisfy type-level DoD with unchecked code (TD-101, `high` and unrouted for four sprints).
- **D5** — **Overlap-ownership map, derived by the pre-dispatch preflight — not by reading.** An
  earlier hand-derived version of this row claimed no file was touched by more than one task; the
  preflight named four pairs it had missed and HALTed (Execution Log, `surprise`). What is true:
  `scripts/qa-check.sh` → **T1 alone**; `docs/research/logs/qa-gate-timing.md` → **T2 alone**;
  `apps/cli/src` → **T3 then T5**; `packages/standard/src` → **T3 → T4**; `packages/standard/src/rules`
  → **T6 → T7**. Every shared path carries a `Depends-on:` edge, so each is single-owned in order and
  none is parallel-built. Shared paths stage per-hunk (`git add -p` + verify `git diff --cached`), never
  a plain `git add` over another task's WIP (L-042/L-037). **`Layers:` is machine input, not prose** —
  a parenthetical annotation tokenises to its bare prefix and silently widens the declared blast radius,
  which is what produced four of the five preflight FAILs. If a task's `Layers:` grows during execution
  (L-100 makes that expected), re-run the preflight before the next commit; do not re-read this row.

## Assumptions

- **A1** — A TS in-process traversal is materially cheaper per invocation than the 8.5s Shell spawn.
  **UNMEASURED.** *Confirm: T2, before any later DoD carries a number (L-130).*
- **A2** — 74% of leg 12 (295.9s of 400.7s) is harnesses spawning the Shell engine. *Confirm: Round 7's
  per-harness sweep plus the intake attribution query, which agreed. Re-confirmation belonged to T11 and
  left with the split — it is re-declared in SPRINT-092, not silently dropped.*
- **A3** — S4.APPEND is §4's only git-defined rule. *Confirm: re-derive from the family's rule list at
  G2 rather than inheriting this line.*

<!-- A4 (the ADR-family harness's git-repo construction survives conversion) left with T9 at the G1
     split and is re-declared in SPRINT-092, where the conversion it constrains actually happens. An
     assumption is owned by the task it binds; carrying it here would leave it unconfirmable. -->

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-091-full-run-and-first-family.md`, rendered from
> `templates/sprint-log.md.template` and created lazily at the first entry. Append there, never here
> (STANDARD §9 · ADR-014).

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro
<!-- Written at close. Route the four buckets to their durable homes (STANDARD §10). -->
