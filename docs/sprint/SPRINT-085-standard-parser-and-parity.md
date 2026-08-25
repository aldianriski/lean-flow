---
sprint: 085
slug: standard-parser-and-parity
epic: EPIC-014
owner: Maintainer
last_updated: 2026-08-25
status: active
gates_signed: G1,G2 @ 3a789fa
plan_commit: 10d2931
close_commit: [sha — set at close]
update_trigger: sprint execute/close events
---

# SPRINT-085 — Standard Parser and Shell Parity

> **Theme:** the TypeScript engine learns to read the Standard, and *proves* it reads it the same way
> the Shell engine does — row by row, on the real document and on every malformed case already
> retained. This is EPIC-014's **first § Closed-when condition**, closed whole.

**This is not a layer sprint, and the distinction is load-bearing.** EPIC-014 D5 rejects any post-083
sprint framed as a technical layer with no working behaviour at close. The outcome here is not *"a
parser exists"* — it is **"TS and Shell agree on 100 rules and 9 retained cases, and disagree nowhere
that has not been ruled."** That is observable, demoable and mechanically checkable, and it is the
epic's own first Closed-when verbatim. A parser that cannot demonstrate that is not done.

## Scope

**In:** a hand-written block tokenizer over `spec/STANDARD.md` producing a typed tree with source
locations · rule-row extraction to the existing `packages/standard` domain model · differential parity
against `read-spec-rules.sh` on the real Standard, on the retained malformed corpus, and in
`--reconcile` mode · a per-rule-family cost profile that unblocks Sprint C's migration order · the
high-severity review-depth blind spot SPRINT-084 found · a ruling on one superseded decision doc.

**Out (deferred):** CommonMark completeness — nested lists, blockquotes, setext headings, inline
emphasis and lazy continuation are deliberately unmodelled (H05 needs the constructs the Standard
*uses*, and every extra branch is one more that must be proven) · H07+ (result domain, registry,
ports, first rule feature, targeted CLI) — that is Sprint C · **choosing** which rule family migrates
first, which is Sprint C's G2 call and must not be frozen here (V3 §43 · L-130) · any change to
`spec/STANDARD.md`'s normative content · adding a Markdown dependency (ADR-035's zero-dependency
property is binding).

## Plan

### T1 — Tokenize the Standard to a typed block tree, proven end-to-end on §13 `[size: M · risk: med · class: execution · HITL]`
Layers: `packages/standard/src` (block tokenizer + block model) · its colocated tests · `test/fixtures` as needed
Depends-on: none
Cites: V3 H05 · ADR-035 · EPIC-014 D8 · L-164 · TASK-275

The tracer bullet: one section through every layer, so the shape is proven before it is widened.
A hand-written tokenizer because ADR-035 fixes the workspace at zero dependencies — there is no
Markdown library to reach for, and the consumer's no-toolchain guarantee (D6) rests on that.

**Acceptance:** the TS reader emits §13's **7 rows** as `(id, level, mark)`, identical to
`sh scripts/lib/read-spec-rules.sh spec/STANDARD.md --section 13`, derived by querying a block tree
rather than by matching lines.

**DoD:**
- [x] A typed block tree covers the constructs the Standard uses — ATX headings, pipe tables, fenced code, paragraphs — each carrying a source location — *Verify: a test asserts a heading, a table and a fence are distinct typed nodes with correct positions*
- [x] §13's window is identified structurally (which table sits inside which `## §N`), not by line arithmetic — *Verify: a fixture where a table appears before §13 and must not be attributed to it*
- [x] TS emits §13's 7 rows identical to the Shell reader's — *Verify: diff TS output against `scripts/lib/read-spec-rules.sh --section 13`, byte-compared on the row set*
- [x] **Tier G**: branches are enumerated **from the code, not from memory**, and each carries its own seeded break — *Verify: a branch inventory derived from the tokenizer's own switch/state points, one seeded break per branch, each reddening its case while a sibling control stays green (L-164)*

### T2 — Reach full-document parity on the real Standard, row by row `[size: M · risk: med · class: execution · HITL]`
Layers: `packages/standard/src` (section walk + rule-row extraction) · its colocated tests
Depends-on: T1
Cites: V3 H05/H06 · ADR-034 · L-108 · TASK-276 · `scripts/lib/read-spec-rules.sh` · `evals/run-spec-reader-fixtures.sh` · `S13.NOINFER` (all read and run, never edited)

Widening the tracer to the whole document. The prose-mention case is the one that proves a structural
parse beat a regex: §14 and §8 both name other sections' rule ids in prose, and a substring match
ingests them as rules.

**Acceptance:** the TS reader emits all **100** rows in document order and agrees with
`scripts/lib/read-spec-rules.sh` row-by-row — never in aggregate.

**DoD:**
- [x] All 100 rows emitted in document order — *Verify: row count against §14's published total, and the full row set diffed against the Shell reader*
- [x] Agreement is asserted **row-by-row, not in aggregate** — *Verify: the assertion names the differing row when it fails; a bare count comparison does not satisfy this (EPIC-014 § Closed-when wording)*
- [x] `S13.NOINFER` occurs twice in the Standard and is admitted exactly once, as a rule — *Verify: reproduce `position-anchored-not-substring`'s numbers from `evals/run-spec-reader-fixtures.sh`*
- [x] Any TS/Shell difference is **ruled, never absorbed** — *Verify: each difference is recorded in the Execution Log with its ruling, or there are none and the log says so (EPIC-014 D2)*

### T3 — Match the Shell reader's error semantics on the malformed corpus `[size: M · risk: med · class: execution · HITL]`
Layers: `packages/standard/src` (error model + findings) · its colocated tests
Depends-on: T1
Cites: V3 H06 · L-058 · TASK-277

Rows are the easy half. The failure this reader refuses to have is returning nothing and exiting
clean — a reader that checks nothing passes everything, and the whole engine inherits it.

**Acceptance:** for each retained malformed case, TS agrees with Shell on the **named finding and the
exit meaning**, not merely on rows.

**DoD:**
- [ ] `spec-table-unreadable-whole` and `-section` produce that named finding on stderr with a non-zero exit — *Verify: run each fixture's input through TS and compare finding name and exit to the Shell reader's*
- [ ] `spec-not-found` produces its named finding, not an empty rule set — *Verify: the same comparison*
- [ ] `zero-rule-section-is-not-a-finding`: §8 exits **0 silently**, because §14 publishes 0 for it — *Verify: absence and emptiness stay distinguishable; a zero-row section must not be reported as a failure*
- [ ] **Tier G**: each case is a retained must-FAIL with its own named finding, and the suite is shown to discriminate — *Verify: seed a break that makes an unreadable table return empty-and-clean; the case reddens while a sibling control stays green*

### T4 — Reproduce `--reconcile` against §14's published counts `[size: S · risk: low · class: execution · HITL]`
Layers: `packages/standard/src` (reconcile mode) · its colocated tests
Depends-on: T2
Cites: V3 H06 · TASK-278

Migrating a **mode** of the existing reader, not adding a capability. The comparison is the only way a
silently-dropped section is distinguishable from a section that legitimately has no rules.

**Acceptance:** TS reproduces the per-section count table and the mismatch FAIL, agreeing with Shell on
all three reconcile fixtures.

**DoD:**
- [ ] The per-section count table matches the Shell reader's — *Verify: `reconciles-with-section-14` reproduced*
- [ ] A section returning zero rows while §14 says it has some is a **FAIL, not an empty result** — *Verify: `section-rows-mismatch` reproduced*
- [ ] Unreadable counts produce `spec-counts-unreadable` — *Verify: that fixture reproduced*

### T5 — Profile `conformance-engine.sh` per rule family → § Round 5 `[size: S · risk: low · class: execution · AFK]`
Layers: `docs/research/logs/qa-gate-timing.md` (append-only)
Depends-on: none
Cites: EPIC-014 open question · V3 §43 · L-130 · L-144 · L-147 · TASK-279 · `scripts/qa-check.sh` (run for the full-engine reconciliation, not modified)

Sprint C cannot choose its first rule family without this, and choosing without it is the exact failure
the epic's open question guards. Round 4 is a **floor**, by its own text — it measured `scripts/qa-check.sh`
legs and named only some engine families.

**Acceptance:** per-rule-family runtime and spawn counts are recorded as § Round 5, with the dominant
families named with their numbers.

**DoD:**
- [x] Each rule family is timed **in isolation against a tiny input**, so per-invocation overhead is not masked by workload — *Verify: the recorded method, per L-144/L-147's prescribed diagnostic*
- [x] § Round 5 matches Rounds 1–4's established shape and edits none of them — *Verify: `git diff` shows insertions only, apart from the frontmatter `last_updated` its own update_trigger requires*
- [x] The dominant families are named with numbers, and the remainder is accounted for rather than folded into "the rest" — *Verify: the round's own totals reconcile against a full-engine run*
- [x] Ordering is **not** frozen here — *Verify: the round recommends, and explicitly leaves the first-family choice to Sprint C's G2 (V3 §43)*

### T6 — Close `check-review-depth.sh`'s absence blind spot `[size: M · risk: med · class: execution · HITL]`
Layers: `scripts/lib/check-review-depth.sh` · `evals/run-review-depth-fixtures.sh` · possibly `scripts/qa-check.sh` (leg 2b wiring)
Depends-on: none
Cites: TD-085 · L-165 · L-105 · SPRINT-084 T2 · TASK-273

The guard's own subject is its blind spot: it grades only the `review ·` lines that exist, so
`governance:high` work with none passes. SPRINT-082 closed 38 of 38 that way, and **SPRINT-084's own
log does the same** — so this sprint would close through the same hole if it is not fixed here.

**Acceptance:** a live sprint log carrying `governance:high` or `behaviour:material` work with **no**
`review ·` line is reported as a FAIL with a named finding, not as a `nothing to verify` note.

**DoD:**
- [x] Absent-line + `governance:high` FAILs with its own named finding — *Verify: a retained must-FAIL fixture asserting that finding string*
- [x] Absent-line + `behaviour:material` FAILs with its own named finding — *Verify: a second retained must-FAIL fixture, one per branch*
- [x] The archive-skip half is **ruled explicitly**, either way — *Verify: the ruling is recorded in the Execution Log; leaving it implicit is what this task exists to stop*
- [x] **Tier G**: the suite is shown to discriminate — *Verify: seed a break that makes the absence branch pass; the new cases redden while the existing 5 stay green* — **ticked on an ADR-021 surfaced ruling, not silently:** the proof is real (2 named findings · 2 retained must-FAIL fixtures · seed reddens 8+9 while 7 siblings stay green), but the guard does **not** reach SPRINT-084's attended log, tested directly. Owner accepted the branch proven and ruled the schema gap to debt. See log, `surprise` 2026-08-25

### T7 — Rule on `qa-gate-timing.md`'s superseded recommendation `[size: S · risk: low · class: decision · HITL]`
Layers: `docs/research/qa-gate-timing.md` · `docs/knowledge-index.md` (generated)
Depends-on: T5
Cites: TD-090 · SPRINT-084 T1 · TASK-274

Its Recommendation ("Option C stands... no sub-part of section 4 worth cutting") correctly ruled out
*coverage reduction* and never tested *spawn-count reduction*, which is where the cure came from.
Sequenced after T5 so the ruling is made with Round 5 in hand, not against a half-measured picture.

**Acceptance:** the doc no longer asserts a recommendation the evidence below it contradicts — amended,
or marked superseded with a pointer to the rounds that overturned it.

**DoD:**
- [x] The Recommendation is amended or marked superseded, with a pointer to § Round 4 and § Round 5 — *Verify: read the doc; a reader cannot act on the stale conclusion*
- [x] The scope of the supersession is stated precisely — coverage-reduction was ruled out correctly and is **not** reversed — *Verify: the amendment distinguishes the two levers rather than reversing the doc wholesale*
- [x] The index is regenerated if metadata changed — *Verify: `sh scripts/gen-index.sh`*

## Owner-action checklist
- [ ] **Reinstall the plugin** — carried forward unaddressed from SPRINT-084. This session primed at base-dir **1.55.0** against a **1.57.1** repo. `lean-doc-generator` was verified byte-identical across that gap so this promote is unaffected, but no other skill is covered by that check (L-021).

## Decisions (pre-locked)

- **D1** — **Shared-file ownership: `packages/standard/` is a single-owner chain, T1 → T2 → T3 → T4.**
  All four touch it, so they are **sequential, never parallel-built**, and commit in that order. T3
  depends on T1 rather than T2 so it may start once the tokenizer lands, but it still commits into the
  same tree — stage per-hunk, never a plain `git add` over another task's WIP (L-042).
- **D2** — **T5, T6 and T7 are disjoint from the parser chain and from each other** (`docs/research/logs/`,
  `scripts/lib/` + `evals/`, `docs/research/`), so T5 and T6 may parallel-build from day one. T7 is
  sequenced behind T5 by **evidence**, not by file overlap — see D3.
- **D3** — **T7 depends on T5 semantically, and that dependency was added at promote.** TASK-274 carried
  `depends-on: none` in the Backlog. Ruling on a decision doc *before* its newest measurement lands
  would produce a ruling made against a half-measured picture — the L-130 shape. Sequencing is
  promote's job; recorded here rather than absorbed silently.
- **D4** — **`docs/knowledge-index.md` is generated and owned by T7.** T5 appends a round without
  touching `id`/`tags`/`domain`, so it should not move the index; if it does, T7 owns the regeneration
  and commits after it.
- **D5** — **No new ADR is owed by this sprint.** The three decisions that would qualify are already
  taken: zero dependencies (ADR-035), the frozen semantic contract (ADR-034/036), and the tier
  assignment (EPIC-014 D8). A hand-written tokenizer is an *implementation* of ADR-035's constraint,
  not a new hard-to-reverse call.
- **D6** — **Sprint C's first rule family is NOT chosen here.** T5 produces the measurement and
  explicitly stops. V3 §43 forbids ordering by section number, and the epic's open question forbids
  freezing the order before the profile exists.

## Assumptions

- **A1** — **H04 is delivered, so H05 is unblocked.** *Confirm: `packages/standard/src/model.ts` exists
  on disk — checked directly, not read off EPIC-014's member row.*
- **A2** — **The comparand is `(id, level, mark)`, with `--section N` and `--reconcile` modes.**
  *Confirm: `scripts/lib/read-spec-rules.sh`'s own usage block.*
- **A3** — **The parity corpus already exists and is retained; no new fixture corpus is owed.**
  *Confirm: `sh evals/run-spec-reader-fixtures.sh` — 9 cases, all green, run as its own call.*
- **A4** — **100 is the frozen denominator, and `S13.NOINFER` appears twice with one admission.**
  *Confirm: ADR-034, and the `position-anchored-not-substring` case's printed numbers.*
- **A5** — **Zero dependencies is binding, so the tokenizer is hand-written.** *Confirm: `package.json`
  carries no `dependencies` key at all; ADR-035 states the property.*
- **A6** — **Tiers are declared by EPIC-014 D8, not chosen here**: parser and parity harness are Tier
  **G**; T5's measurement record and T7's doc ruling are Tier **P**; T6 is Tier **G** (a `check-*.sh`).
  *Confirm: EPIC-014 § Decisions D8 — default up, re-tier on discovery.*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-085-standard-parser-and-parity.md`, rendered
> from `templates/sprint-log.md.template` and created lazily at the first entry. Append there, never
> here (STANDARD §9 · ADR-014).

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| _(filled during execution)_ | | | | |

## Retro

_(written at close)_
