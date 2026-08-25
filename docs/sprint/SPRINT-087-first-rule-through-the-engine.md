---
sprint: 087
slug: first-rule-through-the-engine
epic: EPIC-014
owner: Maintainer
last_updated: 2026-08-25
status: active
plan_commit: 3c14a37
close_commit: [sha — set at close]
update_trigger: sprint execute/close events
---

# SPRINT-087 — The First Rule Through the Engine

> **Theme:** EPIC-014's Sprint C. A rule is evaluated end-to-end in TypeScript — result domain,
> registry, repository port, CLI — and *proved equal to the Shell engine that still holds authority*.
> Then the pattern widens to one family, and the CLI learns to target without ever claiming a
> conformance level it did not compute.

**Feature-first, not layer-first — and the Plan's shape is that rule.** H07 (result domain), H08
(registry) and H09 (ports) are **layers**, so none of them is a task here. EPIC-014 **D5** rejects any
post-083 sprint framed as a technical layer with no working behaviour at close, and the decomposer's
own rule says horizontal slices are not valid tasks. Every task below crosses all three layers. The
outcome is not *"a result domain exists"* — it is **"a rule runs through TS and agrees with Shell,
and a partial run refuses to claim what it did not check."**

## Scope

**In:** one rule end-to-end with differential parity (H07–H09 + H11 minimal) · rule-class resolution
to `GAP` / `excluded` / `judgment-required` · the first family migrated whole, rule by rule · targeted
`--rule` / `--section` with a partial-invocation guard · the three carry-forwards that unblock the
moment the CLI exists (`ok:false → exit 1` · permission-denied ≠ `spec-not-found` · N findings, not
one) · the gate's worktree-scanning defect.

**Out (deferred):** H12+ (full conformance orchestrator, QA profiles, JSON renderer, binary, authority
cutover) · **migrating a second family** — this sprint proves the pattern, and V3 §43's expensive-first
ranking governs families 2..n, not this one · any deletion or demotion of the Shell engine, which keeps
authority throughout (D2 — strangler, never rewrite) · adding a dependency (ADR-035 is binding) ·
re-litigating the six marks ADR-036 froze.

## Plan

### T1 — Evaluate one rule end-to-end, TS agreeing with Shell `[size: M · risk: med · class: execution · HITL]`
Layers: `packages/standard/src` (result domain · registry · first port + in-memory fake) · `apps/cli/src` (`--rule`) · colocated tests · `test/architecture`
Depends-on: none
Cites: TASK-288 · EPIC-014 D2/D5/D8 · V3 H07/H08/H09/H11 · ADR-035 · `scripts/lib/conformance-engine.sh` (spawned as an oracle, never edited)

The tracer bullet: one rule, every layer, proved against the engine it will eventually replace. Thin
on purpose — the point is that the *shape* is right before anything is widened onto it.

**Acceptance:** one mechanical rule, run through the TS path, produces the **same named finding and the
same exit meaning** as the Shell engine.

**DoD:**
- [x] A `Finding` / `RuleEvaluation` / `ConformanceResult` domain exists with **no CLI strings inside it** — *Verify: the existing dependency-direction fitness test covers the new module; a domain string leak fails it*
- [x] The registry resolves `rule id → evaluator` **without a procedural switch carrying rule bodies** (H08) — *Verify: adding a second evaluator requires no edit to the dispatch site; demonstrated by adding one in a test*
- [x] One repository port has **both** a real Bun adapter and an in-memory fake — *Verify: the same evaluator passes against both, so the port is a seam and not a wrapper*
- [x] TS and Shell agree on the rule's **named finding and exit meaning** — *Verify: the Shell engine spawned as a live oracle **inside** the test, never a copied literal, so parity cannot rot silently*
- [x] **Tier G**: branches enumerated from the finished code, each seeded, each reddening its own case while a sibling control stays green — *Verify: seed verified landed by `cmp`, restored under a checked hash, artifact still parses and the break is targeted*

### T2 — Resolve every rule class to GAP, excluded, or judgment-required `[size: M · risk: med · class: execution · HITL]`
Layers: `packages/standard/src` (result domain · registry classification) · colocated tests · `test/fixtures`
Depends-on: T1
Cites: TASK-289 · V3 H07/H08 · ADR-036 (the six marks) · ADR-028 · EPIC-014 D8

A rule the engine cannot evaluate must say so in a way a reader can act on. The failure this refuses is
a rule that reports as *checked* when nothing checked it — the same false-assurance shape as an empty
result read as a clean one.

**Acceptance:** each rule class resolves to its own named outcome, and an unknown rule id neither
crashes nor silently passes.

**DoD:**
- [ ] Unknown **mechanical** rule → `GAP` — *Verify: a fixture whose rule id is absent from the registry reports GAP, not an empty pass*
- [ ] **Judgment-only** → `excluded/judgment-required`; **implementation-directed** → `excluded` — *Verify: one fixture per class, each asserting its own outcome string*
- [ ] The mapping is driven by **ADR-036's six marks**, not a re-derived vocabulary — *Verify: the mark set in code is compared against the Standard's own, so a seventh mark cannot appear silently*
- [ ] **Tier G**: each class reddens its own case while siblings stay green — *Verify: per-class seed, `cmp`-verified, restored under a hash*

### T3 — Migrate the first rule family whole, rule by rule `[size: M · risk: med · class: execution · HITL]`
Layers: `packages/standard/src` (the chosen family's evaluators · any ports they need) · colocated tests · `evals/` fixtures
Depends-on: T1 · T2
Cites: TASK-290 · V3 H10 · V3 §43 · EPIC-014 D2 · § Round 5/6 of `docs/research/logs/qa-gate-timing.md`

The reference pattern later families copy. Widening the tracer to a whole family is where a shape that
only works for one rule fails — which is why it happens here, on a family chosen to be cheap.

**Acceptance:** every rule in the chosen family agrees with Shell **rule-by-rule, never in aggregate**,
and every difference is ruled rather than absorbed.

**DoD:**
- [ ] The family is **chosen at G2 and the choice is recorded with its reason** — *Verify: a D-row names the family and which criterion selected it; an unrecorded pick is the L-151 shape*
- [ ] Every rule in it agrees with Shell **rule-by-rule** — *Verify: the assertion names the differing rule on failure; a bare count comparison does not satisfy this (EPIC-014 § Closed-when wording)*
- [ ] A retained must-FAIL **and a sibling control per rule** — *Verify: the suite lists them individually; "most of the family" does not satisfy this*
- [ ] Any TS/Shell difference is **ruled, never absorbed** — *Verify: each difference recorded in the Execution Log with its ruling, or the log states there were none (D2)*

### T4 — Target by section, and refuse to claim a level from a partial run `[size: S · risk: med · class: execution · HITL]`
Layers: `apps/cli/src` (`--section`, partial-invocation guard, unknown-target handling) · `packages/standard/src` (whatever carries the guard) · colocated tests
Depends-on: T1
Cites: TASK-291 · V3 H11 · EPIC-014 § Closed-when 2 · SPRINT-085 T3 (absence vs emptiness, enforced by TYPE)

A partial run that reports a global level is a **false assurance** — the most expensive wrong answer
this engine can give, because it reads exactly like a real pass.

**Acceptance:** `--section N` targets correctly; a partial invocation emits **no global conformance
level**; an unknown rule or section fails loudly.

**DoD:**
- [ ] `--section N` selects that section's rules and no others — *Verify: compared against `read-spec-rules.sh --section N`, which already answers this question*
- [ ] A partial invocation carries **no global level at all** — *Verify: the absence is a property of the **result**, not of the printer; a renderer-only guard fails this, because § Closed-when 6 requires one domain result feeding both renderers*
- [ ] Unknown rule or section **fails loudly** — *Verify: a named finding and a non-zero exit; an empty result is the failure being prevented*
- [ ] **Tier G**: one retained must-FAIL fixture per branch — *Verify: each names a distinct finding*

### T5 — Map `ok:false` to exit 1 at the process boundary `[size: S · risk: med · class: execution · HITL]`
Layers: `apps/cli/src` (exit mapping) · colocated tests
Depends-on: T1 · T4
Cites: TASK-280 · ADR-034 D3 · SPRINT-085 T3 carry-forward 1

**Acceptance:** the CLI exits **1** for every `SpecReadFail` and **0** for every `SpecReadOk`, including
the legitimate zero-row section, asserted against the Shell reader's exit as an independent oracle.

**DoD:**
- [ ] Every `SpecReadFail` exits 1; every `SpecReadOk` exits 0 — *Verify: Shell spawned as the oracle, not a copied literal*
- [ ] The **legitimate zero-row section still exits 0** — *Verify: §8 reproduced; absence and emptiness must stay distinguishable at the boundary too*
- [ ] **Tier G**: a seeded mis-mapping reddens its case — *Verify: sibling control stays green*

### T6 — Stop a permission-denied spec reporting `spec-not-found` `[size: S · risk: med · class: execution · HITL]`
Layers: `apps/cli/src` (the layer that touches the filesystem) · colocated tests · fixtures
Depends-on: T1
Cites: TASK-281 · SPRINT-085 T3 carry-forward 2 · EPIC-014 D8

**Acceptance:** an unreadable-but-present spec produces a finding **distinct from** `spec-not-found`,
matching whatever the Shell reader does.

**DoD:**
- [ ] Permission-denied produces its own named finding — *Verify: compared against Shell's behaviour for the same input*
- [ ] `specNotFound()` stays a **pure constructor with no filesystem access** — *Verify: the domain still decides nothing about *when* to emit it; that decision lives at the boundary*
- [ ] One retained must-FAIL fixture per branch — *Verify: distinct findings asserted*

### T7 — Carry every `--reconcile` finding, not just the first `[size: S · risk: low · class: execution · HITL]`
Layers: `packages/standard/src` (result shape) · colocated tests
Depends-on: T1
Cites: TASK-282 · ADR-034 D3 · SPRINT-085 T4 carry-forward

**Acceptance:** a `--reconcile` run over a spec with **two or more** mismatching sections surfaces every
mismatch, matching the Shell reader's enumeration.

**DoD:**
- [ ] A fixture with **more than one** mismatch is fully reported — *Verify: the case a single-finding shape cannot pass; one mismatch proves nothing here*
- [ ] The verdict and finding names still match Shell — *Verify: ADR-034 D3's frozen surface is unchanged by the widening*

### T8 — Stop the QA gate scanning agent worktrees `[size: S · risk: low · class: execution · HITL]`
Layers: `scripts/qa-check.sh` (path discovery) · any `scripts/lib/` checker that globs independently · a retained fixture
Depends-on: none
Cites: TASK-287 · TD-095 · L-168 · `orchestrator/references/dispatch.md` § Worktree dispatch protocol

The gate charges for the dispatch pattern this repo prescribes: six live worktrees produced five false
FAILs and pushed a run over its own budget.

**Acceptance:** a full gate run with a live worktree present reports **no finding whose path lies under
`.claude/worktrees/`**, and no real finding is swallowed with it.

**DoD:**
- [x] No finding under `.claude/worktrees/` in a run with one present — *Verify: run the gate with a worktree live and read its printed verdict*
- [x] A retained fixture proves the exclusion **does not swallow a real finding** at a similar path — *Verify: a must-FAIL case at a path that merely resembles the excluded one*
- [x] The exclusion sits in **path discovery**, beside the existing `*/archive/*` convention — *Verify: not bolted onto individual checkers, or the next checker inherits the bug*

## Owner-action checklist
- [x] **Choose the first rule family at G2** — cheap + representative per H10 (ruled at intake); V3 §43's
      expensive-first ranking governs families 2..n. The evidence is in hand: § Round 5/6 profile.

## Decisions (pre-locked)

- **D1** — **No task is a layer.** H07/H08/H09 are crossed by T1–T4, never built alone (EPIC-014 D5).
- **D2** — **T1 is the single-owner root of `packages/standard/src`.** T2, T3, T4, T7 all extend what it
  creates, so they are **sequential behind it**, per-hunk staged, never a plain `git add` over another
  task's WIP (L-042 · L-168).
- **D3** — **T8 is disjoint from everything else** (`scripts/`), so it may parallel-build from day one —
  and it is the only task here that may, which is a deliberate contrast with SPRINT-086's three-way wave.
- **D4** — **The family choice is G2's, not the Plan's.** Recorded as an Owner-action so it cannot be
  absorbed silently into T3 (L-151 — a ruling filed where its consumer cannot reach it is not a ruling).
- **D5** — **Shell keeps authority for the whole sprint.** Nothing here deletes, demotes or bypasses it;
  cutover is H24/H25, several sprints out (D2 — strangler, never rewrite).
- **D6** — **No new ADR is owed.** The hard calls are taken: ADR-034 (frozen surface), ADR-035 (zero
  deps), ADR-036 (six marks), ADR-029 (tiers), EPIC-014 D8 (this engine is Tier G).
- **D7** — **The first rule family is F12, `spec/STANDARD.md` §12's git boundary** —
  `S12.SECRETS` · `S12.BACKUPS` · `S12.DESIGNSRC` · `S12.GENERATED`. **Selected on the Owner-action's
  own criterion — *cheap + representative* — not on V3 §43's expensive-first ranking**, which § Scope
  assigns to families 2..n and which would have chosen the opposite end (F11 at 84.7 s, F6 at 72.1 s).
  *Cheap:* 2,240 ms real-scale, 8th of 12 in the Round 5 profile. *Representative:* four rules, so
  registry dispatch is exercised across four evaluators and T3's stated failure mode — a shape that
  works for one rule and not a family — can actually surface; and Structural level against one
  filesystem port, so T1 is not forced to grow a second adapter. Runners-up and why not: **F1** (§2
  README footer) is cheapest at 592 ms but carries a *single* rule, which cannot exercise dispatch at
  all; **F3** (§13 attestation) is the most representative for T2's classification — §14 marks two of
  its rules `implementation-directed` — but needs a git-history port, widening T1 beyond this sprint's
  root task. Evidence: `docs/research/logs/qa-gate-timing.md` § Round 5, both tables.

## Assumptions

- **A1** — **The workspace exists.** *Confirm: `packages/standard/src/{model,tokenizer,spec-reader}.ts`
  and `apps/cli/src/main.ts` on disk — checked directly at decomposition, not read off the epic's row.*
- **A2** — **`test/architecture/` already enforces the dependency direction** over `packages/standard`
  and `packages/contracts`. *Confirm: `test/architecture/dependency-direction.test.ts`.*
- **A3** — **Zero dependencies is binding.** *Confirm: `package.json` carries no `dependencies` key.*
- **A4** — **The Shell engine is the comparand and is never edited.** *Confirm: it is on every task's
  `Cites:` line, never on a `Layers:` line — the preflight excludes `Cites:` from the overlap map.*
- **A5** — **The six marks are frozen by ADR-036.** *Confirm: ADR-036 § Decision.*
- **A6** — **No `[size: L]` task is being pulled.** *Confirm: checked against the Backlog rows before
  rendering — splitting after the Plan freezes costs a `scope-change`.*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-087-first-rule-through-the-engine.md`, rendered
> from `templates/sprint-log.md.template` and created lazily at the first entry. Append there, never
> here (STANDARD §9 · ADR-014). **Every entry carries its `consequence · Tn · behaviour:… ·
> governance:…` line** — the carrier SPRINT-086 T4 shipped; a task whose consequence is unrecorded is
> invisible to `check-review-depth.sh`.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `packages/standard/src/result.ts` | T1 | Result domain — `Finding` · `RuleEvaluation` · `ConformanceResult` · `exitCodeFor`, no CLI strings. Carries `findings: readonly Finding[]` (widened at revise; see log) | med | `result.test.ts` · `test/architecture/dependency-direction.test.ts` |
| `packages/standard/src/registry.ts` | T1 | `Map`-backed `register`/`resolve`/`dispatch` — no procedural switch, so a new evaluator needs no dispatch-site edit | med | `registry.test.ts`; proven by review adding a third evaluator through the real CLI |
| `packages/standard/src/rules/sprint-log-outside-logs-dir.ts` (+`.fake.ts`) | T1 | The tracer rule `S9.LOGDIR` and its `SprintDirPort` seam + in-memory fake | med | `sprint-log-outside-logs-dir.test.ts` (7 seeds recorded in-file) |
| `packages/standard/src/adapters/fs-sprint-dir.ts` | T1 | Real Bun adapter; its `.isFile()` filter is the seam's load-bearing asymmetry (a *directory* named like a log file) | med | `fs-sprint-dir.test.ts` · seam test vs live oracle |
| `apps/cli/src/main.ts` | T1 | `--rule` wiring; prints one line per finding | low | `main.test.ts` |
| `scripts/lib/check-ephemeral-intake.sh` | T8 | Exclude `.claude/worktrees/` at path discovery — the gate was charging for the worktree-dispatch pattern this repo prescribes (TD-095) | low | `evals/run-ephemeral-intake-fixtures.sh` (4 cases, incl. retained lookalike control) |
| `scripts/lib/check-research-archive.sh` | T8 | Same exclusion in `live_citer()` — a worktree copy counted as a live citer, so a superseded doc cited by nothing real passed. **Silent false negative, found by independent review, not by the author** | med | `evals/run-research-archive-fixtures.sh` (7 cases, incl. retained lookalike citer) |
| `evals/run-ephemeral-intake-fixtures.sh` | T8 | Wire the two retained worktree fixtures | low | self |
| `evals/run-research-archive-fixtures.sh` | T8 | Wire the two retained citer fixtures | low | self |
| `evals/fixtures/{ephemeral-intake,research-archive}/worktree-*/` | T8 | Retained must-FAIL + lookalike controls, kept deliberately — deleting fixtures with the prototype leaves the guard unguarded (TD-012) | low | consumed by both harnesses |

## Retro

_(written at close)_
