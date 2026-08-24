---
sprint: 084
slug: gate-recovery-and-owed-work
owner: Maintainer
last_updated: 2026-08-24
status: active
plan_commit: [sha — set at promote]
close_commit: [sha — set at close]
update_trigger: sprint execute/close events
---

# SPRINT-084 — Gate Recovery and Owed Work

> **Theme:** the gate cannot finish, so nothing this repository builds can currently be *verified* —
> SPRINT-083 had to close four DoD on an owner ruling because `qa-check.sh` never printed a verdict
> line. Restore the instrument first, then pay the three debts that came due with it. Foundations
> before features, in the narrow sense that matters here: a sprint that cannot measure itself is a
> sprint whose Retro is guesswork.

**This is deliberately not EPIC-014's Sprint B.** `TODO.md` named V3 Sprint B (Markdown AST parser +
Shell parity, H05/H06) as next, and it has no Backlog tasks — EPIC-014 says so itself: the post-083
shape is *"**not** promoted, and each re-derived at its own promote."* Slicing it is
`/task-decomposer --epic`, not promote's job. Building it against a gate that emits no verdict would
repeat SPRINT-083's failure at larger scale, since the strangler method rests on *measured* parity.
No `epic:` field: these five tasks advance no single epic outcome.

## Scope

**In:** a `qa-check.sh` that prints its verdict line in one ordinary invocation, with the dominant
cost **measured before** any split (H17 · TD-084) · the independent review SPRINT-082's own routing
rule owes itself · ADR-034 and ADR-036 realigned to the ADR template · the absent-attestation hold
exercised against a foreign repo that actually has commits · Phase C's harness-delta research
side-car ruled.

**Out (deferred):** V3 Sprint B / H05 / H06 — the AST parser and Shell parity (needs decomposition
first) · the full `fast`/`standard`/`full` profile system (H17 proper) · deleting or weakening any
check to make a number fit · re-litigating either ADR's § Decision content · TASK-188, which stays
`blocked` and opportunistic by owner ruling (L-111).

## Plan

### T1 — Make the gate finish: profile `qa-check.sh`, then split it `[size: M · risk: med · class: execution · HITL]`
Layers: `scripts/qa-check.sh` · `scripts/lib/conformance-engine.sh` (measurement only) · possibly a fast/standard profile split
Depends-on: none
Cites: TD-084 · TD-071 · TD-073 · L-144 · L-120 · ADR-021 · V3 §22

Every other task's DoD is unverifiable while the gate cannot emit `QA-CHECK: N pass, M fail`, so this
goes first. **Profile before splitting is not ceremony** — TD-073's stated cause was wrong, and the
real cost turned out to be the driver's own per-rule bookkeeping rather than the workload everyone
assumed; a split chosen before measuring would likely have optimised the wrong half.

**Acceptance:** `sh scripts/qa-check.sh` prints its verdict line inside a single ordinary invocation
on the DEFAULT profile, and the per-leg timings that justified the fix are recorded.

**DoD:**
- [ ] Per-leg timings recorded in the style L-144 prescribes; the dominant term named — *Verify: the recorded timing table, against a tiny input so overhead is not masked*
- [ ] The fix is justified by that measurement, not by where the run appeared to stall — *Verify: the DoD names the measured number it rests on*
- [ ] `sh scripts/qa-check.sh` prints `QA-CHECK: N pass, M fail` in one ordinary invocation — *Verify: run it as its own call and read the printed verdict line, never a wrapper's exit code (L-120)*
- [ ] The heavy legs remain reachable, not deleted — *Verify: each still runs under its explicit profile/flag*
- [ ] Retained fixture: a run that would exceed the fast leg's budget is reported as such rather than silently truncated — *Verify: the fixture reddens on a seeded over-budget run while a sibling control stays green*

### T2 — Run the owed independent review of SPRINT-082's governance changes `[size: S · risk: med · class: decision · HITL]`
Layers: `docs/sprint/archive/logs/SPRINT-082-foundation-hardening.md` (or a successor log)
Depends-on: none
Cites: SPRINT-082 T2 · T4 (parked branch) · `orchestrator/references/review-scoping.md` § Two dimensions

SPRINT-082 shipped routing where `governance:high` cannot take the self-review floor, and its own
T1/T2/T3/T5 are all `behaviour:material · governance:high`. The session that built them could not
dispatch an independent reviewer, so the review **parked** and no `review ·` line was written —
correctly, because writing `self-review` would have been false *and* would have reddened
`check-review-depth.sh`. Refusing to wave this through is the point of having shipped the rule.

**Acceptance:** each of T1/T2/T3/T5 has an independent scoped review recorded as a
`review · Tn · scoped-reviewer · behaviour:material · governance:high` line — or an owner ruling
accepting self-review recorded in its place. Either closes it; an empty record does not.

**DoD:**
- [ ] An independent reviewer is dispatched per task, or the owner rules self-review acceptable — *Verify: the ruling or the dispatch is recorded, not narrated*
- [ ] The outcome is written as a `review ·` line in the log — *Verify: `sh scripts/lib/check-review-depth.sh` stays green on the result*
- [ ] No task is left with an empty record — *Verify: four tasks, four lines or one explicit ruling covering them*

### T3 — Align ADR-034 and ADR-036 to the ADR template `[size: S · risk: low · class: execution · HITL]`
Layers: `docs/adr/ADR-034-semantic-compatibility-contract.md` · `docs/adr/ADR-036-severity-is-introduced-not-preserved.md`
Depends-on: none
Cites: `templates/ADR.md.template` · SPRINT-083 T2 revise · CLAUDE.md § Anti-Patterns

Both were written without re-reading the template — which CLAUDE.md names as an anti-pattern
outright. ADR-035 was realigned during SPRINT-083's T2 revise; these two were deliberately left,
because a bounded revise is one retry and cosmetic drift did not earn an expansion of it.

**Acceptance:** both ADRs carry a single-paragraph `**Positive:** / **Negative (trade-offs
accepted):**` § Consequences and an `| Option | Why rejected |` § Alternatives table, matching
ADR-033 and ADR-035.

**DoD:**
- [ ] `templates/ADR.md.template` is read before either file is opened — *Verify: the template's section order is what the edit matches*
- [ ] § Consequences and § Alternatives match the template's shapes in both files — *Verify: diff their section shapes against ADR-033/ADR-035*
- [ ] § Decision in both stays **byte-identical** to the accepted text — *Verify: `git diff` shows no change inside § Decision; both are `status: accepted` and §4 is append-only, so a rewrite trips S4.APPEND*

### T4 — Exercise the absent-attestation hold against a foreign repo that has commits `[size: S · risk: low · class: execution · AFK]`
Layers: `evals/run-foreign-repo-fixtures.sh` · `docs/research/logs/conformance-coverage.md` § Round 5
Depends-on: none
Cites: SPRINT-081 T4 · T3 · TD-079 · L-159 · L-016

SPRINT-081 T4 added the hold and T3 could not exercise it: the current stranger is built from four
`printf`s with no `git init`, so §13 reports `not evaluated` and the new branch never runs against a
foreign tree. The rule *is* exercised against this repository, so this is coverage of the **consumer
path** — the one thing dogfooding structurally cannot check here (L-016).

**Acceptance:** the foreign-repo harness runs a target with real git history and no §13 trailers, and
the assertion records what an adopter actually sees.

**DoD:**
- [ ] A foreign target with real commits and no §13 trailers exists — *Verify: a second target, or `git init` + one commit added to the existing stranger*
- [ ] The assertion names `attestation-absent`, `level: Gated`, and an unmoved exit code — *Verify: the harness output, read directly*
- [ ] Round 5 is appended to `conformance-coverage.md` — *Verify: the round records the result whichever way it fell; a surprise here is a finding about T4, not a nuisance*

### T5 — Run Phase C: the harness delta research side-car `[size: M · risk: low · class: execution · AFK]`
Layers: `docs/research/harness-delta.md` (new) · `docs/knowledge-index.md` (generated)
Depends-on: none
Cites: `03-ADLC-ROADMAP.md` Phase C · `05-HARNESS-RESEARCH-BRIEF.md` · EPIC-008 D1/D4 · `docs/research/adlc-epic-sequencing.md` F4 · L-017

The side-car lane: research only, colliding with no implementation file. It is EPIC-008's named input
(D4) — `RunEnvelope`, `Dispatch` and `Effect` trace their provenance here — so it is the long pole for
the whole of Lane 2's tail. `03` Phase C forbids opening an epic from it.

**Acceptance:** `docs/research/harness-delta.md` exists as a decision doc (ADR-009 frontmatter, ≤130)
ruling each of `05`'s four candidates keep / reject / defer.

**DoD:**
- [ ] Each of the four candidates is ruled keep / reject / defer — *Verify: four rulings, none absent*
- [ ] Each is judged on the **delta over lean-flow's existing surface**, not standalone merit — *Verify: each ruling names what we already have first (L-017)*
- [ ] Each names which layer would own it — *Verify: a layer per keeper*
- [ ] `05`'s explicit non-goals are re-asserted, not re-litigated — *Verify: the non-goals appear as constraints, not as open questions*
- [ ] The doc is ≤130 lines with ADR-009 frontmatter, and the index is regenerated — *Verify: `sh scripts/lib/check-doc-caps.sh` and `sh scripts/gen-index.sh`*

## Owner-action checklist
- [ ] **Reinstall the plugin before trusting any skill procedure** — this session primed at base-dir **1.55.0** against a **1.57.0** repo. `lean-doc-generator` was verified byte-identical between the two, so this promote is unaffected; every other skill this sprint invokes is not covered by that check (L-021).

## Decisions (pre-locked)

- **D1** — **T1 goes first because it is the instrument, not because it is the largest.** Four of
  SPRINT-083's DoD closed on owner ruling for want of a verdict line; running T2–T5 before T1 would
  buy four more. No ADR — this is sequencing, not a hard-to-reverse call.
- **D2** — **No `epic:` field.** Four of five tasks advance no epic outcome, and T5 is EPIC-008's
  *input* rather than a member contribution. Guessing an epic here would put a false row in a roll-up
  (the skill's own rule: ask when ambiguous, never guess).
- **D3** — **Shared file: `docs/knowledge-index.md` is generated, owned by T5.** T3 edits ADR bodies
  only (not ADR-009 frontmatter), so it should not move the index — but if it does, T5 owns the
  regeneration and commits after T3. Never a plain `git add` over the other's WIP (L-042).
- **D4** — **At close, delete TASK-266 · 259 · 260 · 271 · 272 from the Backlog outright** (§11, no
  shipped-in breadcrumb comments). Recorded here because the sprint file is what `close` reads:
  SPRINT-083's close missed exactly this and left its four shipped tasks sitting in Backlog **P0 as
  `state: ready`**, which this promote had to clean before it could plan. A close obligation written
  only in a Retro summary is invisible to the pass that must act on it (L-151).
- **D5** — **Tier is declared at G2, not here.** T1 carries `tier: G` and T3 `tier: P` from the
  Backlog (ADR-029); T2, T4 and T5 are **undeclared** and must be tiered at G2 beside `class:`,
  defaulting *up* when unsure. Named so the gap is not inherited silently.

## Assumptions

- **A1** — **TD-084 is a distinct failure from TD-071/TD-073, not a re-report.** Those price the
  gate's cost as it scales (*expensive*); this one says *unrunnable*. *Confirm: TD-084's evidence —
  three runs killed at 122 / 123 / 263 lines, the last with 162 PASS and 0 FAIL, none reaching the
  verdict line, all on the default profile with `QA_FULL` unset.*
- **A2** — **The five tasks are genuinely independent; no `depends-on` is load-bearing.** *Confirm:
  their `Layers:` sets are disjoint apart from D3's generated index. Re-confirm at G2 — `Layers:` is
  a live declaration, not a frozen prediction (L-100).*
- **A3** — **T1's fix may turn out not to be a split at all.** The task's own framing allows this:
  the split is *"if a split is what the measurement supports."* *Confirm: the measured dominant term,
  recorded before the fix is chosen.*
- **A4** — **L-144's §11 collapse stays deliberately un-applied.** Its re-collapse condition is *"when
  a measurement guards the engine's cost (TD-071's subject)"* — which is what T1 produces. *Confirm:
  if T1 lands a durable cost measurement, the collapse becomes due at the **next** promote, not this
  one.*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-084-gate-recovery-and-owed-work.md`, rendered
> from `templates/sprint-log.md.template` and created lazily at the first entry. Append there, never
> here (STANDARD §9 · ADR-014).

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| _(filled during execution)_ | | | | |

## Retro

_(written at close)_
