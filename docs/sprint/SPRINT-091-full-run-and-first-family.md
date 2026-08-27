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
Layers: `package.json` · `scripts/qa-check.sh` · `tsconfig.base.json` · `bun.lock` · `docs/adr/ADR-037-dev-only-type-checker-admitted.md` · `docs/adr/ADR-035-typescript-bun-reference-engine.md` · `docs/DECISIONS.md` · `docs/knowledge-index.md`
Depends-on: none
Cites: TD-101 · EPIC-014 D4 · L-105
Tier **G**. The repo states guarantees as "enforced by a TYPE" while no automated path evaluates one —
no type-check invocation anywhere, and no type-checker dependency declared at all. Every task below is
TypeScript, so this is the floor they stand on, not a cleanup.

**Acceptance:** the gate fails on a type error that it currently accepts in silence.

**DoD:**
- [x] A type check runs inside the gate — ✓ the gate's OWN printed line, read from its output with no wrapper between: `PASS  typecheck: tsc --noEmit clean (0 errors)`, sitting between legs 11 and 12. Corroborated by the independent reviewer's own end-to-end gate run (exit 0)
- [x] It FAILS on TD-101's exact recorded case — ✓ seeded verbatim (`findings: "not an array"` against `readonly Finding[]`, `detail: 42` against `string`): gate printed `FAIL typecheck: tsc --noEmit exited 1 with 3 error(s)` and its verdict line read `QA-CHECK: 211 pass, 14 fail`. It also caught the branded `RuleId` rejecting a bare string — TD-101's impact paragraph proven, not argued. Independently reproduced by the reviewer
- [x] A sibling control stays green — ✓ seed removed, same gate: `PASS  typecheck: tsc --noEmit clean (0 errors)`. The leg discriminates rather than reddening everything (L-142). A third branch was added under the bounded retry — a crashed checker now reports as a **checker** failure, not as `0 error(s)` — proven against the shipped logic with two controls
- [x] The type-checker dependency is declared, not assumed present — ✓ `typescript@7.0.2` + `@types/bun` in `package.json` `devDependencies` with `bun.lock` committed; `node_modules/` gitignored and invisible to `git status`. An absent toolchain **FAILs rather than skips** (ADR-037's ruling as code), verified by the reviewer renaming the binary away

### T2 — Derive the conversion's real headroom `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `docs/research/logs/qa-gate-timing.md`
Depends-on: T3, T9
Cites: TD-090 · qa-gate-timing Rounds 5–8 · L-130 · `conformance-engine.sh` `scripts/lib/conformance-engine.sh` (timed as the Shell comparand, never modified) · `S9.LOGDIR`
Tier **G**. No later DoD may carry a performance number that does not trace to this Round. The claim
that a TS in-process traversal costs ~ms where the Shell spawn costs 8.5s is **unmeasured**, and
freezing an estimate into an acceptance threshold is the failure L-130 records.

**Acceptance:** a new Round exists, and every later performance figure derives from it.

**DoD:**
- [x] The ADR-family harness's cost is split between git-repo construction and engine invocation — ✓ **survives independent review**: the reviewer re-implemented the instrumentation with a differently-built timer and measured engine share at **89.6%** and **88.2%** (12 PASS / 0 FAIL both runs), corroborating direction and magnitude. Read as a magnitude, not a percentage to the point — Round 11 records that wrapper overhead (~0.77–1.03s of `date` forks) is unquantified and `non-engine` is derived by subtraction
- [ ] A TS-vs-Shell per-invocation comparison on one fixture target — **STRUCK by review, not met.** The TS CLI wires `createBuiltInRegistry()`, which registers only `S9.LOGDIR`; the F12 registry is never connected, so `--section 12` emits `rule-unimplemented` gaps for all four mechanical rules. The measured 141–161ms was spec-parse plus stub prints — **Shell's real work against TS's no-op**, not a ratio. The agreement check that should have caught it counted `S12.` lines, which both engines print per row regardless of verdict (L-108). **Blocked on T3**, which wires real dispatch; re-derivation must diff per-rule verdicts before timing anything (Round 11)
- [ ] The derived ceiling is stated as a **range, not a point** — **STRUCK, not met.** The arithmetic and range construction were sound (extremes correctly paired for a quotient), but the input was the invalid ratio above, so 4.3–4.9s / ≈15–17s / "roughly 5%" are all withdrawn. **No SPRINT-092 acceptance criterion may cite a conversion saving until this is re-derived** — this is L-130 caught one step before it froze
- [x] Caveats recorded, including sample counts — ✓ three samples per figure in Round 10; Round 11 adds the ones Round 10 missed (unquantified wrapper overhead, `non-engine` as a subtraction, and the corrected "unchanged bytes" claim — `conformance-engine.sh` changed twice in the window, including a **perf** commit, so the Round 7 → Round 10 delta is not attributable to the host)

<!-- T2 carries NO mechanical criterion, and that is declared rather than disguised (G2 reachability).
     Inventing a checker to make a measurement task look mechanical is the failure, not the fix. What
     guards T2 instead is downstream: no later DoD may carry a figure that does not trace to its Round,
     so a fabricated or absent measurement surfaces the moment T-anything cites it. -->

### T3 — Full Standard traversal in TS, at parity with the Shell full run `[size: M · risk: med · class: execution · HITL · J1]`
Layers: `apps/cli/src/` · `packages/standard/src/`
Depends-on: T1, T8
Cites: EPIC-014 H12 · § Closed-when 2 · SPRINT-087 (registry) · `scripts/lib/conformance-engine.sh` · `scripts/lib/read-spec-rules.sh` (parity oracles — spawned, never modified)
Tier **G**. The CLI today answers only `--rule` and `--section`; there is no whole-spec run. Traversal is
what lets a fixture repo be answered in one in-process call instead of one process per case.

**Acceptance:** a flagless conformance invocation answers a whole repository, matching Shell row-by-row.

**DoD:**
- [x] Every rule the parser admits is traversed and dispatched by its §14 mark — ✓ `bun apps/cli/src/main.ts .` traverses all **100** rows and dispatches S9.LOGDIR plus the four F12 rules for real (Round 11's defect, fixed). Proven **row-by-row against two live-spawned oracles, neither a copied literal**: every TS row against `scripts/lib/read-spec-rules.sh` (no flag, document order) and against `scripts/lib/conformance-engine.sh`'s own `mark:` annotations — **0 mismatches**, each naming the offending id on failure rather than a count. The first-pass proof compared category **totals** and was **STRUCK by review** as L-108 a second time in this sprint (the reviewer built the two-rules-swapped counter-example and ran it); replaced under the bounded retry. Discrimination proven: `S2.F-ARCHIVE` seeded `restated`→`judgment-only` on the TS side only, reddened naming exactly that row while the second oracle and every sibling stayed green, restored byte-for-byte under ONE stated convention (`git hash-object`, `c3d2baff…` before and after)
- [x] A rule with no registered evaluator reports as a NAMED gap — ✓ the gap text carries **both** rule id and mark (`rule-unimplemented: the spec marks S12.BACKUPS mechanical…`). Recorded honestly: the **builder never performed the seed-out**, having tested only a rule that was already gapped — the **reviewer did it live**, deregistering `S12_BACKUPS_ID` so exactly that row reddened to a named gap while S9.LOGDIR · S12.SECRETS · DESIGNSRC · GENERATED stayed green, then restoring and hash-verifying (`git hash-object` == `git rev-parse HEAD:<path>`)
- [x] Dispatch stays open-closed — ✓ `composeFamilies` is a loop over `BoundDispatcher[]`, never a switch; `packages/standard/src/classify.ts`'s switch is on the closed 6-value `mark` enum and was **extracted, not modified** (the coordinator flagged behaviour-preservation as an agrees-by-construction risk; the reviewer REFUTED it independently, every branch textually unchanged); `packages/standard/src/rules/built-in.ts` and `packages/standard/src/rules/f12-registry.ts` untouched, and a "third family, zero code changes" test passes. **Strengthened under retry:** a duplicate id now **throws**, naming the id and both families' positions, closing the one place this seam broke the codebase's own throw-loud rule — before F5 · F2 · F1 · F7 plug into it

### T4 — Hold semantics and full-run level arithmetic `[size: M · risk: med · class: execution · HITL · J1]`
Layers: `packages/standard/src/`
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
Layers: `apps/cli/src/`
Depends-on: T1, T3, T9
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
Layers: `packages/standard/src/rules/` · `evals/fixtures/`
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
Layers: `packages/standard/src/rules/` · `packages/standard/src/adapters/`
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
Layers: `packages/standard/src/tokenizer.ts` · `packages/standard/src/tokenizer.test.ts` · `packages/standard/src/spec-reader.ts` · `packages/standard/src/spec-reader.test.ts` · `packages/standard/src/section.test.ts` · `packages/standard/src/model.test.ts` · `packages/standard/src/rules/git-boundary-spec.ts` · `packages/standard/src/rules/git-boundary-port.fake.ts` · `apps/cli/src/main.test.ts` · `apps/cli/src/spec-file-reader.test.ts`
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
- [x] Zero type errors remain — ✓ `tsc`'s own exit code **0** and its own count **0**, read from its own output with no pipe between (139 → 80 config → 59 real → 0)
- [x] The `RuleId` brand actually holds — ✓ seeded `makeRuleId("S9.Z")` → `"S9.Z"` in one element of a two-element expectation: **exactly 1 error, at that site**, while the sibling `makeRuleId("S9.A")` in the same expression stayed green; restored byte-for-byte, `git hash-object` `59d11d58…` before seed and after restore (one convention, stated — L-169), and `tsc` back to 0
- [x] Union narrowing is fixed at the read sites, not silenced — ✓ 115 added lines across 9 files carry **0** `as` casts, **0** `any`, **0** non-null `!`, **0** `@ts-ignore`; the fixes bind-and-guard, use `?.` to narrow union *and* undefined together, and construct branded ids in fixtures rather than widening the assertions
- [x] The suite is unchanged — ✓ 266 pass, 0 fail, 784 expect() calls, identical to the pre-change baseline

### T9 — Compose families in `--section` too, so T2 has a valid comparand `[size: S · risk: med · class: execution · HITL · J1]`
Layers: `apps/cli/src/`
Depends-on: T3
Cites: TD-090 · SPRINT-091 Round 10/11 (the struck measurement) · L-108 · L-130 · `scripts/lib/conformance-engine.sh` (parity oracle — spawned, never modified) · T2 (this task unblocks it; the dependency runs the other way)
Tier **G** by defaulting up (ADR-029). Added mid-sprint by owner ruling — see the Execution Log's
`scope-change`. T3 wired the **flagless** run; `runSection()` still hardcodes `createBuiltInRegistry()`,
so `--section 12` answers `rule-unimplemented` for all four F12 rules while Shell evaluates them. That
is the exact comparand Round 10 measured and Round 11 struck. Left as-is, T2 reproduces the struck
defect a third time.

**Acceptance:** `--section N` dispatches every family the flagless run does, for the same repo.

**DoD:**
- [ ] `--section 12` evaluates all four F12 rules for real — *Verify: per-rule VERDICTS diffed against `scripts/lib/conformance-engine.sh` spawned live, never a line count (L-108 — this is the defect being repaired, not merely a risk)*
- [ ] `--section` and the flagless run agree per rule on the same repo — *Verify: differential over the sections that have registered evaluators; a mismatch names the offending rule id*
- [ ] `--section` still emits NO global level — *Verify: the frozen-result property SPRINT-087 established still holds; seed an attempt and confirm it throws*

### T10 — ADR-038 for the composed multi-family dispatch seam `[size: S · risk: low · class: decision · HITL · J1]`
Layers: `docs/adr/ADR-038-composed-multi-family-rule-dispatch.md` · `docs/DECISIONS.md` · `docs/knowledge-index.md`
Depends-on: T3
Cites: ADR-035 · EPIC-014 D2 · SPRINT-091 T3 review (finding 2)
Tier **P** (prose — ADR-029): G1 plus a read-through. Added mid-sprint by owner ruling. The seam is
what F5 · F2 · F1 · F7 all plug into, and its three rejected alternatives currently exist only inside
one commit message — invisible to the family author who will not read this git log.

**Acceptance:** the seam's decision, its alternatives and its one constraint are discoverable without
reading git history.

**DoD:**
- [ ] ADR-038 records the chosen seam and all three rejected alternatives with reasons
- [ ] It states the duplicate-id constraint the T3 retry added, as a rule future families must satisfy
- [ ] `docs/DECISIONS.md` carries its row — **judgment tick, stated as one**: no mechanical method in this repo reads that table's rows, and inventing a checker so the criterion merely *looks* mechanical is the failure ADR-021/L-136 name, not the fix
- [ ] The knowledge index is regenerated — *Verify: `sh scripts/gen-index.sh --check`, whose scope is exactly `docs/knowledge-index.md` and nothing else (run it in the MAIN TREE — TD-113: its `cmp -s` is defeated by CRLF in a fresh worktree)*

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
