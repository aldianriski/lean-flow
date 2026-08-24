---
sprint: 083
slug: ts-bun-foundation
epic: 014
owner: Maintainer
last_updated: 2026-08-24
status: active
gates_signed: G1,G2 @ 2dd1edb
plan_commit: 88d31d8
close_commit:
update_trigger: sprint execute/close events
---

# SPRINT-083 — TS/Bun Foundation

> **Theme:** before any semantics move, freeze what *"the same answer"* means and stand up a workspace
> whose dependency direction is enforced by a test rather than by memory. Nothing migrates in this
> sprint — it exists so that the sprints that do migrate have a comparand to be measured against and a
> boundary they cannot quietly cross. Foundations before features.

**This sprint is EPIC-014 D5's one ruled exception to feature-first.** V3 §3/§49 reject plans framed as
technical layers with no working behaviour — and a vertical slice cannot precede the workspace it lives
in. The exception is *this sprint only*; from SPRINT-084 on, a G2 that cannot answer *"what working
behaviour exists when this closes?"* is rejected.

## Scope

**In:** the semantic compatibility contract, frozen from a derived denominator (H01) · a strict TS/Bun
workspace with `bun test` and one runnable CLI command, added **without disarming this repo's gate
discovery** (H02) · architecture fitness tests with a retained must-FAIL fixture (H03) · the typed
Standard domain model, test-first (H04).

**Out (deferred):** the Markdown AST parser and Shell parity (H05/H06 — SPRINT-084) · any conformance
evaluation, rule evaluator or registry · any QA behaviour change · any CLI surface beyond one smoke
command · JSON renderers · deleting, rewriting or re-pointing **any** existing Shell script · any edit
to `spec/STANDARD.md`'s normative content · npm publish · EPIC-015's workflow stream.

## Plan

### T1 — Freeze the semantic compatibility contract `[size: M · risk: med · class: decision · HITL]`
Layers: `docs/adr/ADR-034-semantic-compatibility-contract.md` (new) · `evals/fixtures/compat/` (new, retained snapshot) · `docs/DECISIONS.md` · `docs/knowledge-index.md` (generated)
Depends-on: none
Cites: V3 §25 · V3 §44 · ADR-023 (a consumer must be able to pin it) · ADR-029 · L-130 · L-108

Migration without a frozen comparand is not migration, it is a rewrite that discovers its own contract
afterwards. This freezes the **semantic** surface — Rule ID · Finding ID · Severity · rule
inclusion/exclusion · Hold semantics · full-run level · exit meaning — and states in words that
byte-exact stdout is **not** frozen, so parity work later cannot be argued into whitespace-matching.

**The denominator is derived here, never inherited.** Three sources disagree today:
`scripts/lib/read-spec-rules.sh` emits **100** unique rule IDs, the `Sn.NAME` grep shape matches **79**,
and EPIC-004 closed on **51 of 51 rules**. At most one is the contract's denominator. A number copied
into a frozen artifact is a query result read later by someone who cannot re-derive it (L-130), and the
79 is the substring-shaped count L-108 warns about.

**Acceptance:** the frozen semantic surface is recorded as an ADR with a committed, regenerable snapshot
of the frozen IDs; the denominator is derived and the other two numbers are explained rather than
ignored; byte-exact stdout is explicitly disclaimed.

**Tier:** **P** (ADR-029 — prose plus a generated snapshot; it ships no checker). *Re-tier to G if this
task adds a check that the snapshot is current.*

**DoD:**
- [x] The frozen surface names all seven semantic elements and disclaims byte-exact stdout — ✓ ADR-034 § Decision: 7-row freeze table (rule id · finding id · severity · inclusion/exclusion · hold · full-run level · exit meaning) matched 1:1 against V3 §25's freeze list, and all four of its do-not-freeze items (whitespace · wrapping · non-semantic line order · byte-identical stdout) named absent
- [x] The rule-ID denominator is **derived**, and the three disagreeing counts (100 / 79 / 51) are each accounted for — ✓ **100** is the contract's (`51 + 49 = 100`); **51** is *checkable* (`mechanical 40 + split 11`, agreeing independently with EPIC-004's `45 in-engine + 6 standalone`, ADR-028); **79** is a **disproved query** — the `S[0-9]+\.[A-Z][A-Z0-9]+` shape stops at a hyphen and misses exactly the 21 hyphenated §2 ids, `79 + 21 = 100`, zero false positives. Each source command is in the ADR
- [x] A snapshot of the frozen rule IDs is committed under `evals/fixtures/compat/`, stamped with `spec/STANDARD.md`'s `version:` (0.10.0 today) — ✓ `evals/fixtures/compat/rule-ids-v0.10.0.txt`, 100 rows / 100 unique ids; regeneration verified `cmp`-identical. Carries the reader's three columns (id · level · mark), not ids alone, since level and mark are themselves frozen and a bare id list could not detect a reclassification
- [x] ~~Finding IDs are enumerated from the live engine, not from memory~~ → **superseded by owner ruling 2026-08-24; see the `scope-change` entry in the Execution Log.** The premise was false: no such command exists (four emission shapes; three extractions returned 4 / 14 / 78, the 14 falsified by `dod-criterion-names-no-check`). Replaced by: **the Finding-ID surface is recorded in ADR-034 as a NAMED GAP** with its reason, its closing point (H07/H08, where findings become typed data) and its accepted cost — *Verify: ADR-034 § The Finding-ID surface is a NAMED GAP states all three; a contract implying both surfaces are pinned is a fail*
- [ ] `docs/DECISIONS.md` and the generated `docs/knowledge-index.md` carry ADR-034 — **substance verified, box deliberately OPEN.** DECISIONS.md row added (34 ADR rows, newest-first intact) and `sh scripts/gen-index.sh` regenerated the index (2 `ADR-034` references). But the criterion's named check `sh scripts/qa-check.sh` **was not run** (standing owner instruction to skip it this session). *Was ticked-with-caveat; independent review called that against the letter of ADR-021 and the reviewer was right — a box whose named check is absent stays open. Re-tick when the gate runs, or on a recorded owner ruling that the substance suffices.*

### T2 — Stand up the TS/Bun workspace without disarming gate discovery `[size: M · risk: med · class: execution · HITL]`
Layers: `package.json` (new, root) · `tsconfig.base.json` · `bunfig.toml` · `apps/cli/src/main.ts` · `.gitignore` · `docs/adr/ADR-035-typescript-bun-reference-engine.md` (new) · `docs/architecture/overview.md` (§ Directory structure) · `docs/DECISIONS.md` · `docs/knowledge-index.md` (generated)
<!-- Layers corrected at G2 (L-100, a live declaration — not a scope-change): ADR-035 requires a
     DECISIONS.md row and an index regeneration, which promote's draft omitted. `spec/STANDARD.md` §2
     is REMOVED from this list — D4 ruled no §2 rows are owed, so the conditional path is closed. -->
Owns (shared-file map): `package.json` — creates it; T3 appends afterwards. Second on `docs/DECISIONS.md` + `docs/knowledge-index.md`, after T1.
Depends-on: none
Cites: V3 §2 · V3 §7 · V3 §8 · ADR-033 (gate discovery rungs) · ADR-031 · ADR-006 · L-015

The minimum foundation: strict TypeScript, Bun, `bun:test`, one runnable command. No framework-heavy
CLI stack, no dashboard code, no dependency the workspace does not yet need.

**The hazard is not the workspace — it is the manifest.** `dispatch.md` § System verify discovers this
repo's gate on **rung 4** (`.gate-command` → `sh scripts/qa-check.sh`) precisely because rungs 1–3 all
miss, and rung 4 is explicitly *last*: "anything discoverable wins over it." Adding a root
`package.json` creates a **rung-1** hit that silently outranks the declaration, re-pointing System
Verify at a `bun test` that covers almost nothing. `.gate-command`'s own comment predicted this — "it
can go stale against a repo that later grows a real manifest." A gate that discovers the wrong command
still reports a verdict, which is the silent false-negative ADR-033 was written to stop.

**Acceptance:** `bun test` runs and one CLI command executes; and after the manifest lands, gate
discovery still resolves to a command that actually gates this repository — proven by running the
discovery order, not by assuming rung 4 still wins.

**Tier:** **G** (ADR-029 — defaulted *up*: the workspace alone is X, but this task changes what System
Verify discovers, and a wrong discovery is silent by construction).

**DoD:**
<!-- The conformance-baseline pair below was added by the G1 pass, AFTER promote froze this Plan at
     88d31d8. Logged as a `scope-change` in the Execution Log before this edit, per § Red flags. -->
- [ ] **Baseline captured BEFORE the first new tree lands**: this repository's conformance `level:` and its full finding set are recorded in the Execution Log — *Verify: the recorded baseline names the level and the finding count; "it was Gated" from memory is not a baseline*
- [ ] `bun test` runs green on an empty-but-real suite, and `bun` version + strict TS settings are recorded — *Verify: `bun test` exits 0 and `tsconfig.base.json` sets `strict: true`*
- [ ] One minimal CLI command runs — *Verify: `bun apps/cli/src/main.ts --version` prints and exits 0*
- [ ] **Gate discovery still resolves to a real gate after the manifest lands** — *Verify: walk rungs 1→4 by hand and record which rung answers and with what command; the answer must be a command that gates this repo. If rung 1 now answers, `package.json`'s test script must itself invoke `sh scripts/qa-check.sh`*
- [ ] **Retained must-FAIL fixture:** a manifest whose discovered command does **not** run the repo's real gate is caught rather than accepted — *Verify: a fixture manifest declaring a trivially-passing test script is rejected by the check the DoD line above performs; the fixture is retained, not deleted with the prototype (TD-012)*
- [ ] **Control:** the pre-manifest state (rungs 1–3 miss, rung 4 answers `sh scripts/qa-check.sh`) still resolves correctly, and the control reports its own denominator so a vacuous pass is visible (L-156)
- [ ] The dependency boundary is documented and `docs/architecture/overview.md` § Directory structure carries the new tree — *Verify: read-through; the where-things-live map is the only tree (CLAUDE.md)*
- [ ] **Consumer behaviour is unchanged** — installing the plugin still needs no Bun, no build step, and no new file — *Verify on the consumer path, not by dogfooding (L-015 · L-016): trace a fresh `plugin install` and name what it now downloads that it did not before*
- [ ] ADR-035 records the toolchain decision (EPIC-014 D1) with its trade-off and what would reverse it
- [ ] **The conformance report is unmoved against the baseline, or every difference is named and ruled** — *Verify: re-run the engine and diff level + findings against the captured baseline. Do NOT read this off `qa-check`'s tally: TD-081 records that conformance FAIL rows never reach it, so a green `0 fail` is not evidence here (L-120 — read the verdict the check itself prints)*
- [ ] `sh scripts/qa-check.sh` reports 0 fail — *Verify: read the verdict line the gate prints (`QA-CHECK: N pass, M fail`), as its own call, not through a pipe or a wrapper (L-120)*

### T3 — Make the dependency direction mechanically enforced `[size: M · risk: med · class: execution · HITL]`
Layers: `test/architecture/dependency-direction.test.ts` (new) · `test/fixtures/architecture/` (new, retained) · `package.json` (test script)
Depends-on: T2
Cites: V3 §2.1 · V3 §8 · V3 §35 · V3 §50 · ADR-029 · L-058 · L-137 · L-142

Clean Architecture that lives only in a document is a convention, and conventions lose to a deadline.
This makes the inward-dependency rule a test: domain must not import `apps/`, must not import Bun
infrastructure, contracts must not import adapters, CLI may import application packages.

**Acceptance:** an illegal import fails the suite, a legal one passes, and the suite has been shown to
*discriminate* — not merely to be green on a tree that happens to be clean.

**Tier:** **G** (ADR-029 — this is a guard; a false negative here lets every later sprint cross the
boundary silently, and the whole epic rests on it).

**DoD:**
- [ ] The critical inward-dependency rules are mechanically testable and enumerated — *Verify: each rule in V3 §8's allowed direction has a named assertion*
- [ ] **Retained must-FAIL fixture:** an illegal dependency is caught, one fixture per rule, each failing with its **named** finding — *Verify: `bun test test/architecture` reddens on each fixture with the rule's own identifier, not a generic failure*
- [ ] **Control:** a correct dependency direction passes, and the control names how many edges it actually examined (L-156)
- [ ] **The suite is shown to discriminate, not to agree with itself** — seed a break in the real tree and confirm the case reddens *while a sibling control stays green* — *Verify: the seeded file still parses (`bun build --no-bundle` or `tsc --noEmit` accepts it) and the break is targeted (assertion count unchanged, line count within one of pristine); the seed is restored under a checked hash (`cmp` against the pristine copy) — a patch that never applied reports the suite green, which is indistinguishable from a suite that works (L-137 · L-142)*
- [ ] `sh scripts/qa-check.sh` reports 0 fail — *Verify: as T2, the gate's own printed verdict line*

### T4 — Type the Standard domain model, test-first `[size: S · risk: low · class: execution · HITL]`
Layers: `packages/standard/src/model.ts` (new) · `packages/standard/src/model.test.ts` (new) · `test/architecture/dependency-direction.test.ts` (register the new package)
Depends-on: T2, T3
Cites: V3 §4 · V3 §5 · V3 §9 · V3 §33 · V3 §48

`StandardDocument` · `StandardSection` · `StandardRule` · `RuleId` · `ConformanceLevel` · `RuleMark` ·
`SourceLocation`, and nothing beyond what a test requires. No parsing (T-next sprint), no conformance
behaviour, no CLI strings inside the model.

**Acceptance:** the types exist with behaviour-named tests written before the implementation, and the
model compiles with no import that the fitness suite forbids.

**Tier:** **X** (ADR-029 — typed structure with tests; it guards nothing on its own. Its *enforcement*
is T3's, which is G).

**DoD:**
- [ ] Each type is introduced by a test that names a behaviour and goes **red first** — *Verify: tests read as behaviour ("does not admit a rule with no section"), never `testCase1` / `parser test` (V3 §33); the red-before-green step is recorded in the Execution Log per type, since a test written after the code cannot be shown to have failed*
- [ ] `RuleMark` admits exactly `mechanical` · `split` · `judgment-only` · `implementation-directed`, and `ConformanceLevel` exactly `structural` · `gated` · `attested` — *Verify: cross-checked against `spec/STANDARD.md`'s own vocabulary, not against V3's summary of it*
- [ ] The model imports nothing from `apps/`, Bun, or any adapter — *Verify: `bun test test/architecture` passes with `packages/standard` registered in the fitness suite*
- [ ] No conformance evaluation, no parser and no CLI rendering entered the model — *Verify: read-through; a `console` or `Bun.` reference in `packages/standard/src/` is a fail*
- [ ] `sh scripts/qa-check.sh` reports 0 fail — *Verify: as T2*

## Decisions (pre-locked)

- **D1** — **T3 owns `test/architecture/dependency-direction.test.ts`; T4 extends it.** Single owner,
  commit order T3 → T4. Both also touch `package.json` (T2 creates it, T3 adds a test script) — T2
  lands it first. Under sequential `sprint-bulk` these are safe; if they ever meet in one tree the
  shared file is staged per hunk with `git diff --cached` verified (L-042 · L-037).
- **D2** — **No Shell script is edited, re-pointed or deleted in this sprint.** The strangler keeps
  Shell authoritative until per-family parity passes (EPIC-014 D2). The one permitted touch is
  `package.json`'s test script *invoking* `sh scripts/qa-check.sh`, which changes no Shell file.
- **D3** — **Two ADRs are owed, and they are different decisions.** ADR-034 = what semantic surface is
  frozen for migration (T1). ADR-035 = TypeScript/Bun as the reference engine (T2, EPIC-014 D1). Neither
  absorbs the other.
- **D4 — RULED at G2 (2026-08-24): no §2 rows are owed, and therefore no ADR for placement.** §2 is a
  *documentation* lifecycle standard (ADR-012) and enumerates exactly four scopes — **Root files** ·
  **`spec/`** · **AI context (`.claude/`)** · **the `docs/` tree**. It carries **no code-tree rows at
  all**, and this repository already runs `scripts/`, `evals/` and `skills/` outside it, which is the
  standing precedent. Read from §2 itself rather than defaulted either way, as this row required.
  **Constraint that came with the answer (from A4):** no new directory may be named `*-plugin` —
  `check-manifest-lockstep.sh` globs `.*-plugin/*.json` and enrols a matching directory automatically.
  **Second constraint:** the new trees add no `.md`, so nothing lands in an undefined-cap state.
- **D5 — RULED at G2 (2026-08-24): the run mode is `attended` / interactive.** All four tasks are HITL
  as filed, so an unattended run has no vehicle — the same finding SPRINT-082 D6 recorded. **What this
  forecloses, named here rather than discovered later (L-111):** nothing in this Plan depends on an
  unattended branch; T2's rung-walk, T1's denominator ruling and T3's seeded-break judgement are all
  *decisions*, which Part 0's execute-only charter parks rather than runs. An unattended run would have
  parked most of the Plan.
- **D7 — RULED at G2, AMENDED at T1 (2026-08-24): implementation runs INLINE; REVIEW is dispatched.**
  *Original ruling: inline implementation, no sub-agents at all.* T1 proved that half of it
  unshippable: `review-scoping.md` § Skip table routes a **governance-impact diff of any size** — it
  names *"an ADR that binds implementation"* explicitly — to one scoped reviewer, and states **"never
  the self-review floor, whatever the file extension."** Every task here is Tier G, so the original D7
  would have parked all four reviews. **Amended (owner, 2026-08-24):** implementation stays inline;
  each governance- or behaviour-impacting task's review goes to **one fresh scoped reviewer that did
  not write the code**. T1's parked review is discharged under the amendment. No task may report an
  independent review it did not get.
- **D6** — **Tiers per ADR-029, declared beside `class:` and defaulted up:** T1 **P** · T2 **G** ·
  T3 **G** · T4 **X**. Re-tier on discovery if something turns out to guard.

## Assumptions

- **A1** — Bun 1.3.14 and Node 24.16.0 are installed on the dev host. *Confirm: `bun --version` at T2 —
  verified 2026-08-24 at plan time, re-run rather than trusted.*
- **A2** — No TS toolchain exists in the repo today: no `package.json`, `bun.lockb`, `tsconfig.json`,
  `apps/` or `packages/`. *Confirm: re-run the check at T2 — this is what makes T2's gate-discovery
  hazard real rather than hypothetical.*
- **A3** — This repo's gate is discovered on **rung 4** via `.gate-command`. *Confirm at T2 by walking
  the discovery order, before and after the manifest lands. The whole of T2's DoD rests on this.*
- **A4** — Adding a root `package.json` does not trip `scripts/lib/check-manifest-lockstep.sh`, which
  compares `.claude-plugin/plugin.json` against `marketplace.json`. *Confirm: read that checker at T2
  before creating the manifest — if it globs `*.json` manifests more broadly, T2's shape changes.*
- **A5** — The three rule-ID counts (100 / 79 / 51) are each real outputs of a different query, not one
  number miscounted. *Confirm at T1 by re-running each; the contract's denominator is derived from that,
  never from this line (L-130).*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-083-ts-bun-foundation.md`, rendered from
> `templates/sprint-log.md.template` and created lazily at the first entry. Append there, never here.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| _(filled during execution)_ | | | | |

## Retro

_(written at close)_
