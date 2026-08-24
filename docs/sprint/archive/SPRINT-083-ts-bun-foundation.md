---
sprint: 083
slug: ts-bun-foundation
epic: 014
owner: Maintainer
last_updated: 2026-08-24
status: closed
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
- [x] `docs/DECISIONS.md` and the generated `docs/knowledge-index.md` carry ADR-034 — **substance verified, box deliberately OPEN.** DECISIONS.md row added (34 ADR rows, newest-first intact) and `sh scripts/gen-index.sh` regenerated the index (2 `ADR-034` references). But the criterion's named check `sh scripts/qa-check.sh` **was not run** (standing owner instruction to skip it this session). *Was ticked-with-caveat; independent review called that against the letter of ADR-021 and the reviewer was right — a box whose named check is absent stays open. Re-tick when the gate runs, or on a recorded owner ruling that the substance suffices.* — **owner ruling 2026-08-24: partial evidence accepted, because the gate cannot complete.** Three runs killed without printing `QA-CHECK: N pass, M fail` (122 · 123 · 263 lines); the last reached **162 PASS / 0 FAIL across 13 legs**. Independently completed instead: `sh conformance.sh .` **0 FAIL · level: Gated** (exit 0) · `check-doc-caps.sh` clean · `check-manifest-lockstep.sh` 4 manifests at 1.57.0 · `bun test` **52 pass / 0 fail**. **The gate's own verdict line was never printed** — this is a ruling on named evidence, not a pass (ADR-021 · L-120). Regression filed as **TD-084** + **TASK-272**

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
- [x] **Baseline captured BEFORE the first new tree lands** — ✓ `0 FAIL · level: Gated · 45 checkable with an assertion · 6 GAP`, recorded in the Execution Log with no new tree on disk. The earlier 6-FAIL capture is also on the record; the *Gated* one is the comparand, since matching a degraded baseline would let a regression pass — *Verify: the recorded baseline names the level and the finding count; "it was Gated" from memory is not a baseline*
- [x] `bun test` runs green on an empty-but-real suite — ✓ **13 pass / 0 fail** across 2 files on `bun 1.3.14`; `tsconfig.base.json` sets `strict: true` plus `noUncheckedIndexedAccess`/`exactOptionalPropertyTypes`. *Not vacuous*: a seeded break (`-v` dropped from the version branch) reddened exactly its own test while 6 siblings stayed green; restored `cmp`-identical
- [x] One minimal CLI command runs — ✓ `bun apps/cli/src/main.ts --version` prints and exits **0**; an unknown argument exits **2** rather than succeeding silently
- [x] **Gate discovery still resolves to a real gate after the manifest lands** — ✓ **the predicted hazard occurred**: discovery now stops at **rung 1**; `.gate-command` (rung 4) is never reached. Safe only because `scripts.test` = `sh scripts/qa-check.sh && bun test`. All four rungs walked by hand and which answered recorded. Original wording: — *Verify: walk rungs 1→4 by hand and record which rung answers and with what command; the answer must be a command that gates this repo. If rung 1 now answers, `package.json`'s test script must itself invoke `sh scripts/qa-check.sh`*
- [x] **Retained must-FAIL fixture** — ✓ `test/fixtures/gate-discovery/manifest-bypasses-gate/` (`test: echo ok` beside a `.gate-command`) is flagged `bypassed: true`. Written as a **bun test, not a shell harness**: the natural home is the workspace this sprint stands up. **Discrimination proven** — seeding `bypassed: false` into the guard reddened the must-FAIL case while BOTH controls stayed green (12 pass / 1 fail); restored `cmp`-identical. Original wording: rather than accepted — *Verify: a fixture manifest declaring a trivially-passing test script is rejected by the check the DoD line above performs; the fixture is retained, not deleted with the prototype (TD-012)*
- [x] **Control:** the pre-manifest state still resolves correctly — ✓ the `no-manifest/` fixture resolves at rung 4 to `sh scripts/qa-check.sh` and asserts `examined == [1,2,3,4]`, so a pass that never reached rungs 1–3 shows as vacuous (L-156). Second control `manifest-runs-gate/` differs from the must-FAIL fixture in exactly one field — the test script
- [x] The dependency boundary is documented and the map carries the new tree — ✓ extended the **existing** map, no second tree (147/150 — 3 lines spare). Records D4's ruling and the `*-plugin` naming constraint. Also corrected a stale `v0.9.0` → `v0.10.0` in the block being edited
- [x] **Consumer behaviour is unchanged** — ✓ traced on the consumer path, not inferred from dogfooding (L-015 · L-016), and read by **parsing** `plugin.json` rather than grepping it — `grep -c hooks` returned 1, on the word inside the *description*, which is the substring trap L-108 names. Parsed keys: `name · version · description · author · license` — **no `hooks` key, no `files` manifest.** So no install step, no `node_modules`, no lockfile, no build, and using the skills still needs no Bun. **What is NOT unchanged, stated rather than glossed:** with no `files` manifest the whole repo is copied, so a consumer's cache now also carries `package.json` · `tsconfig.json` · `tsconfig.base.json` · `bunfig.toml` · `apps/` · `test/`. Inert weight, but real — "no new file" is true of what a consumer must *do*, false of what they *receive*
- [x] ADR-035 records the toolchain decision (EPIC-014 D1) — ✓ five Negatives, incl. *gate discovery is now load-bearing on a JSON field* and *after cutover, reversal is a re-migration*. DECISIONS.md row added; newest-first order corrected to 036 · 035 · 034
- [x] **The conformance report is unmoved against the baseline** — ✓ `0 FAIL · 6 GAP · level: Gated`, identical to the baseline taken with no tree on disk; the three new top-level trees moved nothing. Read from the engine's own output, **not** from `qa-check`'s tally (TD-081). Original wording: — *Verify: re-run the engine and diff level + findings against the captured baseline. Do NOT read this off `qa-check`'s tally: TD-081 records that conformance FAIL rows never reach it, so a green `0 fail` is not evidence here (L-120 — read the verdict the check itself prints)*
- [x] `sh scripts/qa-check.sh` reports 0 fail — *Verify: read the verdict line the gate prints (`QA-CHECK: N pass, M fail`), as its own call, not through a pipe or a wrapper (L-120)* — **owner ruling 2026-08-24: partial evidence accepted, because the gate cannot complete.** Three runs killed without printing `QA-CHECK: N pass, M fail` (122 · 123 · 263 lines); the last reached **162 PASS / 0 FAIL across 13 legs**. Independently completed instead: `sh conformance.sh .` **0 FAIL · level: Gated** (exit 0) · `check-doc-caps.sh` clean · `check-manifest-lockstep.sh` 4 manifests at 1.57.0 · `bun test` **52 pass / 0 fail**. **The gate's own verdict line was never printed** — this is a ruling on named evidence, not a pass (ADR-021 · L-120). Regression filed as **TD-084** + **TASK-272**

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
- [x] The critical inward-dependency rules are mechanically testable and enumerated — ✓ **5 rules** in `test/architecture/layers.ts` `RULES`, each a data entry with its own finding name (OCP — a new rule is an entry, not a branch): `domain-imports-app` · `domain-imports-infrastructure` · `contracts-imports-adapter` · `contracts-imports-app` · `adapter-imports-app`. Layer assignment is explicit — an unrecognised path is `unassigned`, never silently domain
- [x] **Retained must-FAIL fixture, one per rule** — ✓ 5 fixture trees under `test/fixtures/architecture/`, each carrying exactly one violation. Each test asserts the finding set equals `{its own finding}`, so a misattributed or generic failure fails the test (L-058). A sixth test asserts `RULES.length === 5`, so deleting a fixture directory cannot silently shrink the loop and still pass
- [x] **Control:** a correct dependency direction passes and names its denominator — ✓ the `clean/` fixture asserts `violations == []` **and** `filesExamined == 3` / `edgesExamined == 2`, so a pass that examined nothing is visible as vacuous (L-156). Second control: `apps/` importing `packages/` is asserted ALLOWED — the direction is inward, not bidirectional
- [x] **The suite is shown to discriminate, not to agree with itself** — ✓ **three independent seeded breaks**, each reddening exactly its own case while every sibling stayed green: (a) disabling the `domain-imports-infrastructure` rule reddened only that MUST-FAIL fixture (30 pass / 1 fail) · (b) disabling line-comment stripping reddened only the `stripNonCode` test (30/1) · (c) disabling block-comment stripping reddened only the multi-line-block-comment test (31/1). Each seed verified to **land** (`cmp` vs pristine), to still **parse** (module imports, `typeof` = function — not `bun build`, which reports write failures as parse failures, L-045), and to be **targeted** (line delta 0). Each restored `cmp`-identical. **A fourth seed silently failed to apply and the landed-check caught it** — it reported 31 pass, indistinguishable from a discriminating suite (L-137)
- [x] `sh scripts/qa-check.sh` reports 0 fail — *Verify: as T2, the gate's own printed verdict line* — **owner ruling 2026-08-24: partial evidence accepted, because the gate cannot complete.** Three runs killed without printing `QA-CHECK: N pass, M fail` (122 · 123 · 263 lines); the last reached **162 PASS / 0 FAIL across 13 legs**. Independently completed instead: `sh conformance.sh .` **0 FAIL · level: Gated** (exit 0) · `check-doc-caps.sh` clean · `check-manifest-lockstep.sh` 4 manifests at 1.57.0 · `bun test` **52 pass / 0 fail**. **The gate's own verdict line was never printed** — this is a ruling on named evidence, not a pass (ADR-021 · L-120). Regression filed as **TD-084** + **TASK-272**

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
- [x] Each type is introduced by a behaviour-named test that went **red first** — ✓ genuinely test-first: `model.test.ts` was written and run BEFORE `model.ts` existed, recorded RED as `Cannot find module './model.ts'`, **0 pass / 1 fail**, then GREEN at **9 pass / 0 fail**. Tests name behaviour ("represents a rule that carries NO level — six real rules do"), never `testCase1`. Original wording: — *Verify: tests read as behaviour ("does not admit a rule with no section"), never `testCase1` / `parser test` (V3 §33); the red-before-green step is recorded in the Execution Log per type, since a test written after the code cannot be shown to have failed*
- [x] `RuleMark` admits exactly the **six** marks `spec/STANDARD.md` §14 defines — `mechanical` · `judgment-only` · `split` · `implementation-directed` · `restated` · `standard-directed` — and `ConformanceLevel` exactly `Structural` · `Gated` · `Attested`, **with an absent level representable** (6 rules carry none) — *Verify: cross-checked against §14's own table, not against V3 §9's four-mark sketch. Corrected by `scope-change` 2026-08-24: the original enumeration was V3's and omitted `restated` and `standard-directed`, the two ADR-028 added*
- [x] The model imports nothing from `apps/`, Bun, or any adapter — ✓ **zero** import statements, zero `Bun.`/`console.`/`node:`/`bun:` references. The fitness suite covers it: `checkLayers('.')` now examines **4 files / 4 edges** with 0 violations. No registration step was needed — `checkLayers` walks `packages/` recursively, so it registers by existing (L-100: a `Layers:` prediction execution dissolved)
- [x] No conformance evaluation, no parser and no CLI rendering entered the model — ✓ verified on **stripped code, not raw text** (the words appear in explanatory comments; matching those would have been the substring trap this sprint hit twice): 0 occurrences of `parse`/`evaluate`/`render` in code
- [x] `sh scripts/qa-check.sh` reports 0 fail — *Verify: as T2* — **owner ruling 2026-08-24: partial evidence accepted, because the gate cannot complete.** Three runs killed without printing `QA-CHECK: N pass, M fail` (122 · 123 · 263 lines); the last reached **162 PASS / 0 FAIL across 13 legs**. Independently completed instead: `sh conformance.sh .` **0 FAIL · level: Gated** (exit 0) · `check-doc-caps.sh` clean · `check-manifest-lockstep.sh` 4 manifests at 1.57.0 · `bun test` **52 pass / 0 fail**. **The gate's own verdict line was never printed** — this is a ruling on named evidence, not a pass (ADR-021 · L-120). Regression filed as **TD-084** + **TASK-272**

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
| `docs/adr/ADR-034-*.md` (new) | T1 | freeze the semantic surface before any TS exists — a comparand written after the fact is not one | med | read-through vs V3 §25's two lists |
| `evals/fixtures/compat/rule-ids-v0.10.0.txt` (new) | T1 | the frozen rule surface, retained and regenerable | low | `cmp` vs `read-spec-rules.sh` |
| `docs/adr/ADR-036-*.md` (new) | T1 revise | supersede ADR-034's Severity row — §4 is append-only, so a decided ADR is superseded, never rewritten | med | `S4.APPEND` clean |
| `package.json` (new) | T2 | root workspace; `scripts.test` **must** invoke the real gate — first rung-1 hit in this repo's history | **high** | `test/gate-discovery/` must-FAIL + 2 controls |
| `tsconfig.base.json` · `tsconfig.json` · `bunfig.toml` (new) | T2 | strict TS, zero dependencies, no framework | low | `bun test` |
| `apps/cli/src/main.ts` + test (new) | T2 | one runnable command; `parse`/`run` split so the side-effect boundary starts at the writer | low | 7 tests + seeded break |
| `docs/adr/ADR-035-*.md` (new) | T2 | the toolchain decision and its five costs | med | template-aligned at revise |
| `test/gate-discovery/` + 4 fixtures (new) | T2 | guard that a *discovered* gate still runs the *declared* one | **high** | must-FAIL + 2 controls + regression for the substring bypass |
| `test/architecture/layers.ts` (new) | T3 | the inward-dependency rule as a test; tokenises source rather than regex-matching it | **high** | 5 must-FAIL fixtures, 4 seeded breaks |
| `test/architecture/dependency-direction.test.ts` (new) | T3 | one named assertion per rule + shape-not-substring cases | **high** | 52-test suite |
| `test/fixtures/architecture/` — 6 trees (new) | T3/T4 | one must-FAIL per rule, a clean control, and the narrow test-file exemption | med | each fails with **its own** finding |
| `packages/standard/src/model.ts` + test (new) | T4 | the Standard's vocabulary typed — **six** marks, nullable level | med | RED recorded before GREEN |
| `docs/architecture/overview.md` | T2 | the where-things-live map carries the new tree; D4's ruling recorded | low | 147/150 cap |
| `TODO.md` · `TECH-DEBT.md` · `CHANGELOG.md` · `docs/sprint/INDEX.md` | §11 | retention: prune shipped tasks, archive SPRINT-082, rotate v1.54.0 | low | conformance 6 FAIL → 0 |
| `docs/research/…V3.md` | §11 | ownership header added (it was committed without one) | low | `S1.LAW3` · `S3.SCHEMA` clean |

## Retro

**Retrieval check** — no prior `L-NNN` or ADR was contradicted or missed, and that is not the useful
finding. **L-108 was retrieved, applied, and cited twice in this session's own commit messages — and
still hit three times**, once inside the guard written to prevent it. L-045, L-130, L-137 and L-100 all
fired on work that had them loaded. The corpus was reachable and correct; being loaded prevented
nothing. **Machinery and independent review caught every one; recall caught none.** That is the same
sentence SPRINT-082's Retro wrote, which makes it a property of the loop rather than of a bad week.

**Cost** — cost, turns and wall-clock **unavailable**: attended interactive session, no per-run
metering (stated rather than omitted, ADR-016). Shape: **inline implementation + three dispatched
scoped reviewers** (D7 as amended). Delivered: 4 tasks · 26 DoD · 3 ADRs · 52 tests · 13 retained
fixture trees · 5 seeded-break proofs, one of them the reviewer's.

**Worked**

- **The reviewers earned their cost, unambiguously.** All three found something; **two found
  blockers**. T2's guard gave a false PASS on a gate command merely *mentioned* inside an `echo`;
  T3's missed `require()` entirely and lost any import wider than 200 characters. Both are false
  *negatives* — the failure that certifies rather than stays silent — and both suites were green.
- **The conformance baseline G1 forced into T2 paid for itself before T2 wrote a line of code.** Six
  findings, four of them introduced by this session, **none visible to `qa-check`'s tally** (TD-081) —
  and `qa-check` was not being run. It also corrected a figure I had asserted twice: the repo was at
  `level: none`, not `Gated`.
- **Test-first was real, not claimed.** T4's RED is on the record (`Cannot find module './model.ts'`,
  0 pass / 1 fail) because the tests were written and run before the module existed.
- **Tokenising instead of patching the regex a third time.** T3's rewrite fixed two blockers and a
  false positive at once, because it changed the *method* rather than the pattern.

**Friction**

- **Three ADRs written without re-reading their template** — an anti-pattern CLAUDE.md names outright.
  Caught by review on ADR-035 only; ADR-034 and ADR-036 carry it still (→ TASK-271).
- **Heredoc escaping corrupted a file four separate times** (a literal newline inside a string, twice;
  a NUL byte; a mangled test body). Each was caught, none by intent — the pattern is that shell-quoted
  code written into a file is a different discipline from writing code, and this session kept treating
  them as one. Switching to the Write tool and to `bun` scripts fixed it late rather than early.
- **A source file became binary and the suite did not care** (L-163). Everything a *reader* needs was
  destroyed while everything a *runner* needs was fine.
- **The gate is slow enough to distort the loop** — a full conformance run exceeded a 5-minute timeout
  and had to be backgrounded. Already TD-071/TD-073's subject; noted again because it changed how this
  sprint was executed, not just how long it took.

**A reachability observation about this sprint's own DoD, recorded because it is the very thing
SPRINT-082 T3 shipped G2 to catch.** Four tasks each closed with *"`sh scripts/qa-check.sh` reports
0 fail"*. That check EXISTS, RUNS and REACHES — but what it reaches is docs and governance, **not the
TypeScript this sprint wrote**. Green there proves no governance regression; it proves nothing about
`packages/` or `apps/`. The criteria are kept and were flagged at G2 rather than discovered at close,
but a foundation sprint whose four closing criteria all point away from its own deliverable is worth
naming out loud.

**Pattern candidates** (→ `docs/LEARNINGS.md`)
- **L-162** — a frozen criterion can carry its own antidote: T4's DoD froze V3's four marks *beside*
  the instruction to check the spec instead of V3.
- **L-163** — one control character reclassifies a source file as binary; tests stay green, review dies.
- **L-164** — the branch you never thought to break is the branch with no coverage, and your own seeds
  cannot find it because they are drawn from the same incomplete list.

Sightings appended to **L-108** (×3) · **L-045** (×2) · **L-137** · **L-130** · **L-100**.
