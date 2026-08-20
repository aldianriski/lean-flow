---
sprint: 075
slug: the-conformance-engine
epic: EPIC-004
owner: Maintainer
last_updated: 2026-08-20
plan_commit: 9693d79
close_commit: [sha — set at close]
status: closed
gates_signed: G1,G2 @ 203d202
update_trigger: sprint execute/close events
---

# SPRINT-075 — The Conformance Engine

> **Theme:** SPRINT-074 built *one* checker that reads the spec and proved the shape works. This
> sprint turns that shape into an **engine** and points it at a stranger. Two things have to become
> true together: the engine must learn every section's rules the way the §13 checker learned one, and
> a repository that never installed lean-flow must get a usable answer out of it. Either alone is
> half — an engine nobody outside can run is the twelfth checker, and a consumer report backed by two
> migrated rules says nothing.

## Scope

**In:** a rule-source reader generalised from §13 to any `## §N` Conformance table (T1) · the engine
core — registry, mark-driven dispatch, and a report stating a **level** and named findings, never a
score (T2) · the first run against a repo carrying none of our conventions (T3) · migrating the §9
gates-signed family off its standalone checker as the consolidation proof (T4) · formally amending
ADR-008's maintainer-only scope (T5) · the ownership-header family as the first *new* coverage (T6).

**Out (deferred):** the remaining **34** `build` dispositions after T6's four — coverage is repeatable
work and belongs in following sprints, not in the sprint that builds the engine · migrating the other
ten standalone checkers (T4 proves the path for one family; the rest follow per-family, each guarded
by its own retained fixtures) · EPIC-005 Fleet · **every ADLC platform concept** — dashboard, control
plane, runtime gateway, memory/cost architecture: `docs/strategy/adlc/04-AGENT-DEVELOPMENT-HANDOFF.md`
is explicit that these must not be mixed into EPIC-004, and they are named here so the boundary is a
decision rather than an omission · the harness/execution-delta research track, permitted but
research-only and not this sprint · **TD-048 and TD-057's matcher work**, still deliberately
unscheduled and to be priced together rather than raced · TD-063's index-freshness cure.

## Plan

### T1 — Generalize the rule-source reader from §13 to any `## §N` Conformance table `[size: M · risk: med · class: decision · HITL]`
Layers: `scripts/lib/` (the extracted reader) · `scripts/lib/check-attestation.sh` (its first consumer) ·
        `evals/` (reader fixtures) · `scripts/qa-check.sh` (registers the new harness in the always-on
        set — **declared at execution, not at promote** (L-100): the gate's own completeness leg fails
        any harness left in `evals/` ungated, so shipping the fixtures without this is half-shipped)
Depends-on: none
Cites: EPIC-004 D1 · `spec/STANDARD.md` §14 (the table format it defines) · L-108 (position-anchored
       matching) · L-058 · roadmap Phase A item 4

`check-attestation.sh` already parses one section's table correctly and does it the safe way — anchored
to a table-row position inside a section window rather than matching a rule-id substring. Extracting
that as a reader every section shares is the engine's foundation, and doing it **first, alone** is
deliberate: a section whose table diverges in shape must be discovered here, not after 38 rules depend
on it.

**Acceptance:** a reader returns `(id, level, mark)` for any `## §N` section, and its §13 output is
provably identical to what the attestation checker derives today.

**DoD:**
- [x] The reader parses **every** `## §N` section that carries a Conformance block — *Verify: run it
      across all 13 and reconcile the per-section counts against §14's own table (`4·21·3·7·2·4·9·0·10·10·11·12·7 = 100`);
      a section returning zero rows when §14 says it has some is a FAIL, not an empty result*
      → **13 of 13 sections PASS, 100 rules reconciled** against §14's own counts row. Log, T1.
- [x] §13's output is **unchanged** — *Verify: diff the reader's §13 rows against what
      `check-attestation.sh` derives today, mechanically. This is a refactor of a working parse; a
      behaviour change here is a regression, not an improvement*
      → shipped parse lifted verbatim, **empty diff**, 7 rows each; the row anchor had to widen to `[A-Z0-9-]+` or 26 rules would have been dropped. Log, T1.
- [x] An absent or unparseable table is a **named finding**, never an empty rule set — *Verify: a
      retained must-FAIL fixture pointing the reader at a spec with no tables reports
      `spec-table-unreadable`. A reader returning nothing checks nothing and exits clean, which is the
      false negative the whole engine would otherwise inherit (L-058)*
      → `run-spec-reader-fixtures.sh`: **9 cases, 5 must-FAIL**, shown to discriminate under seeded breaks. Log, T1.
- [x] `check-attestation.sh` consumes the reader rather than keeping its own copy — *Verify:
      `evals/run-attestation-fixtures.sh` still green, all 16 assertions, unmodified*
      → one reader call; **16 assertions green, harness untouched**; registered always-on (L-020). Log, T1.

### T2 — Build the engine core: registry, dispatch, report `[size: M · risk: med · class: execution · HITL]`
Layers: `conformance.sh` (the standalone entry point at the repo root — **declared at execution**
        (L-100): D1 settled "one implementation, two entry points", which needs a file here, and the
        Plan named only the lib it delegates to) · `scripts/lib/` (the engine) · `scripts/qa-check.sh`
        · `evals/` (engine fixtures)
Depends-on: T1
Cites: EPIC-004 D1 · D2 (settled at intake) · `spec/STANDARD.md` §14 (levels, marks, the
       no-percentage rule) · ADR-021 · `read-spec-rules.sh` (T1's reader — **consumed, not
       modified**, which is why it sits here and not in `Layers:`) · `S13.NOINFER` · `S1.LAW2`
       (the two rule ids the mark-driven fixtures re-mark in a spec copy to prove dispatch reads the
       Mark column each run) · **T3** (whose foreign-repo evidence refined two of the DoD below —
       cited, not depended on: T2 shipped first and T3 amended it afterwards)
The engine is the §13 checker's dispatch loop with the rule set widened and the report generalised. Its
whole correctness claim is that **the spec decides what gets evaluated** — so the mark column drives
inclusion, and a rule the spec states but the engine cannot answer is reported rather than absent.

**Acceptance:** `sh conformance.sh <repo-dir>` produces, for any repository, a level and a list of
named findings — and a reader can tell from the output which rules were evaluated, which were skipped,
and why.

**DoD:**
- [x] Dispatch is **mark-driven**, not a hard-coded list — *Verify: re-mark a rule in a spec copy and
      the engine's behaviour changes with no code edit, the same fixture shape SPRINT-074 used to prove
      it for §13*
      → proven **both directions** with no code edit (`S13.NOINFER` on, `S1.LAW2` off). Log, T2.
- [x] `judgment-only` and `implementation-directed` rules are **never evaluated against the repo** —
      *Verify: neither appears as a verdict line; a fixture asserts it. These are the findings no
      adopter can ever clear (§14)*
      → reported as notes, never as a verdict line; asserted on both rule kinds. Log, T2.
- [x] A `mechanical` rule with no assertion reports `rule-unimplemented` — *Verify: retained must-FAIL
      fixture. With 34 dispositions still unbuilt this will fire a lot, and that is correct: the gap is
      the report's most useful content this sprint*
      → retained must-FAIL case, **re-pointed at T3's `GAP` class**: still named, no longer counted against the repo. Log, T2 · T3.
- [x] The report states a **level** and the findings preventing the next one — *Verify: fixture*
      → `level: none -- Structural not yet reached. N finding(s) prevent it`, with the bucketing regression retained. Log, T2.
- [x] **No score, grade or percentage appears anywhere in the output** — *Verify: a fixture greps the
      output for `%`, `score`, `grade` and a ratio shape and asserts absence. §14 forbids it
      normatively, so this is checked rather than trusted (L-058)*
      → grepped on the largest run **and** on the `level: Attested` branch this repo never reaches. Log, T2.
- [x] Exit 0 clean / 1 findings, CI-usable — *Verify: fixture asserts both, on the same repo*
      → both asserted on one repo. **Refined at T3**: the exit code answers for repository findings only. Log, T2 · T3.

### T3 — Run the engine against a repo that has never seen lean-flow `[size: M · risk: med · class: decision · HITL]`
Layers: `evals/run-foreign-repo-fixtures.sh` (the foreign-repo harness) ·
        `scripts/lib/conformance-engine.sh` (the run DID expose a defect — the `GAP` class) ·
        `evals/run-conformance-engine-fixtures.sh` (T2's suite, repointed at the new semantics) ·
        `scripts/qa-check.sh` (harness registered) · `docs/adr/ADR-027-*.md` (refinement marker) —
        declared at execution, L-100
Depends-on: T2, T6
Cites: EPIC-004 § Closed-when 1 · L-015 (the consumer surface) · L-016 (verify on the consumer path
       when the repo cannot dogfood) · `docs/research/conformance-dispositions.md`
The epic's headline claim is that an adopter gets a named answer. Nothing has tested it: all 43 `build`
dispositions were judged against **this** repository's shape, by people who wrote the standard. This
task is the first contact with a repository that never agreed to any of it.

**Acceptance:** a throwaway repo with a README and nothing else gets a level, named findings, and no
finding a reasonable owner would call meaningless.

**DoD:**
- [x] The engine runs against a repo built from scratch with none of our conventions — *Verify: the
      harness builds it under `mktemp -d`; no lean-flow file is copied in*
      → a four-file repo under `mktemp -d`; **no lean-flow file copied in, asserted mechanically** (L-015 · L-016). Log, T3.
- [x] It emits a level and named findings, and **nothing** for `judgment-only` /
      `implementation-directed` rules — *Verify: fixture asserts both halves*
      → level line + 2 named findings; **0** verdict lines for the 33 judgment-only / 6
      implementation-directed rules. *Read as "no VERDICT line" — §14 and EPIC-004 D1 require a report to
      NAME its judgment-required items. Stated, not silently reinterpreted (L-088).*
- [x] **Every finding is triaged for actionability, and the verdict is recorded** — *Verify: a written
      pass over the output classifying each finding as *actionable by that repo's owner* or *an
      artefact of dispositions written against our own shape*. **A high artefact count is a finding
      about `docs/research/conformance-dispositions.md`, and routes back there** — do not tune the engine to look
      quiet (L-088: the criterion is the report being honest, not short)*
      → **2 findings, both actionable, 0 artefacts** — and recorded as weaker than it looks: at 6 of 62
      rules the shape-bound dispositions are untouched. Proven, not asserted — applying the prescribed fix
      takes the repo to exit 0. **The run also changed the engine** (the `GAP` class). Detail → Log, T3.
- [x] EPIC-004 § Closed-when 1 is ticked or the reason it is not is written down — *Verify: the epic
      row; a condition ticked without its evidence is the tick this sprint exists to avoid*

      → ticked in the epic with its evidence, naming what the run does and does not establish.
### T4 — Migrate the §9 gates-signed family into the engine `[size: M · risk: med · class: execution · HITL]`
Layers: `scripts/lib/check-gates-signed.sh` (deleted) · `scripts/lib/conformance-engine.sh` (the
        engine — declared by PATH at execution, L-100: "the engine" is prose the layers-observed
        check cannot match) · `evals/run-gates-signed-fixtures.sh` (repointed, not rewritten) ·
        `scripts/qa-check.sh` · `docs/research/conformance-dispositions.md` (§ Covered today repointed
        off the deleted checker — the register is a consumer of this migration, L-020)
Depends-on: T2
Cites: EPIC-002 D3 (consolidation deferred here; its unblock condition met at SPRINT-074) ·
       EPIC-004 § Scope · TD-012 · L-058 · L-099 (why the field exists at all) · the two §9 rule ids
       this task answers to and does **not** touch — `S9.GATESWELLFORMED` · `S9.GATESABSENT`
The consolidation question has been deferred four times waiting for exactly what SPRINT-074 delivered.
§9 is chosen for being the **smallest surface at the hardest level** — §14 states Gated is harder to
check than Attested, so proving the engine there beats proving it on an easy family. One family only:
the remaining ten follow per-family, each guarded by its own fixtures.

**Acceptance:** the same two rules are enforced by the engine instead of a standalone script, and the
fixtures that guarded them still pass without being rewritten.

**DoD:**
- [x] `S9.GATESWELLFORMED` and `S9.GATESABSENT` are evaluated by the engine — *Verify: both appear as
      verdict lines against a sprint file*
      → both dispatch and print against a real sprint file; the pair is mutually exclusive by
      construction, so *absent* is distinguishable from *not run*. Detail → Log, T4.
- [x] Their named findings are reproduced **exactly** — *Verify: string-compare the engine's findings
      against the shipped checker's before deleting it. A renamed finding silently breaks a published
      contract (SPRINT-074 D2's reasoning, one family over)*
      → deleted checker restored from git and diffed per case: **IDENTICAL ×5**, verdict label included. Log, T4.
- [x] `check-gates-signed.sh` is deleted and `qa-check.sh` calls the engine instead — *Verify: the file
      is gone and the gate still reports the same verdicts*
      → file gone, `qa-check.sh`'s §9 leg calls the engine, same verdict on this repo's own sprint.
      qa-check: **159 pass, 0 fail**.
- [x] **The fixture harness is retained and repointed, not rewritten** — *Verify:
      `evals/run-gates-signed-fixtures.sh` green against the engine, including the load-bearing case
      where a **missing** field reads as NOT SIGNED rather than as approval. Deleting fixtures with the
      checker they guarded is TD-012 exactly*
      → five cases retained and green against a reduced spec copy; a **sixth** added, not swapped in. Log, T4.

### T5 — Amend or supersede ADR-008's maintainer-only scope `[size: S · risk: low · class: decision · HITL]`
Layers: `docs/adr/` (new ADR) · `docs/DECISIONS.md` · `docs/adr/ADR-008-*.md` (status marker only) ·
        `docs/epic/EPIC-004-conformance.md` (§ Closed-when 5, which DoD 4 requires) ·
        `docs/knowledge-index.md` (**generated** by `scripts/gen-index.sh`, never hand-edited — a new
        ADR carries ADR-009 metadata, so the index goes stale the moment the file lands; declared at
        execution, L-100, the third such correction this sprint)
Depends-on: T2
Cites: ADR-008 · EPIC-004 § Closed-when 5 · D2 · STANDARD §4
ADR-008 admitted executable code on the premise that it guards *this* repo, and closed the CI question:
*"wiring it into CI stays out of scope (lean-flow does not own CI/CD)"*. EPIC-004 promises adopters
"CI-friendly exit codes". Those are reconcilable — emitting a usable exit code is not owning someone's
pipeline — but ADR-008's sentence is broad enough to read either way, and an unstated reading is what a
later sprint trips over.

**Acceptance:** a reader of `docs/DECISIONS.md` can tell that executable code here is now
consumer-facing, and what that does and does not commit lean-flow to.

**DoD:**
- [x] An ADR records the scope change and **rules explicitly on the CI sentence** — *Verify: the ADR
      names ADR-008's wording and says which reading now holds*
      → [ADR-027](../adr/ADR-027-executable-code-becomes-consumer-facing.md) quotes the sentence and rules on it; both halves stated. Log, T5.
- [x] ADR-008 is marked amended/superseded, **never edited in place** — *Verify: the file; §4 is
      append-only for decided ADRs*
      → **amended, not superseded** — a `Scope amended by:` marker plus `related:`; no § Decision /
      Context / Consequences text altered, so §4's append-only rule holds.
- [x] `docs/DECISIONS.md` gains its row — *Verify: the index*
      → row added; reconciled **27 rows == 27 ADR files** — the first insert silently no-opped and only that caught it.
- [x] EPIC-004 § Closed-when 5 ticked — *Verify: the epic. It requires this be formally amended, "not
      silently outgrown", which is what four sprints of using the checkers consumer-ward already was*
      → ticked with its evidence in the epic; `docs/knowledge-index.md` regenerated (ADR-027 resolves
      under process · tooling · governance).

### T6 — Cover the ownership-header family: `S1.LAW2` · `S1.LAW3` · `S3.SCHEMA` · `S3.AGENTS` `[size: M · risk: med · class: execution · AFK]`
Layers: `scripts/lib/conformance-engine.sh` (assertions) · `evals/run-ownership-header-fixtures.sh`
        + `evals/fixtures/ownership-header/` (one retained fixture per named finding) ·
        `scripts/qa-check.sh` (harness registered — the completeness leg fails an ungated harness) ·
        `docs/research/conformance-dispositions.md` (four rules move `build` → covered) — L-100
Depends-on: T2, T4
Cites: EPIC-004 § Closed-when 2 · L-058 · TD-012 · `S7.PERSON` (§7 states the same role-vs-person
       distinction as "mechanical against a role vocabulary, judged without one" — the reason this
       task ships a vocabulary at all; cited, never touched). The § build register itself is
       **touched**, so it is declared on `Layers:` above rather than here.
The first *new* coverage, and chosen for what it enables rather than for being easy: these four rules
apply to any repository containing documents, which is what makes the foreign-repo run report something instead of
nothing. The five finding names are already published — this task consumes that contract, it does not
choose it.

**Acceptance:** a repo with a doc missing its ownership header gets told so, by name.

**DoD:**
- [x] All four rules are evaluated, firing the five **already-published** names — `owner-not-a-role` ·
      `update-trigger-absent` · `ownership-header-missing` · `ownership-header-field-missing` ·
      `agents-ownership-footer-missing` — *Verify: count assertions against the register's rows; a rule
      silently skipped is a FAIL*
      → four `assert_*` registered, 5 of 5 names fire; register reconciled (12 covered ids · 39 `build`). Log, T6.
- [x] **One retained must-FAIL fixture per named finding**, plus a PASS control — *Verify: the harness;
      each case fails with its own name (L-058 · TD-012)*
      → `evals/run-ownership-header-fixtures.sh`, **11 cases, all green**.
- [x] `owner-not-a-role` does not fire on a legitimate role — *Verify: a PASS-control fixture using
      `Maintainer`. This is the one rule here that can produce a false positive on correct input, since
      distinguishing a role from a person is the judgment half of a `split` mark*
      → PASS control green; 0 findings across 199 `owner:` values. **The Plan's parenthetical is
      imprecise and is not reinterpreted to fit: §14 marks `S1.LAW2` mechanical, not split** — the split it
      describes is §7's `S7.PERSON`. Criterion met as written (L-136, smallest grain).
- [x] The fixtures were shown to **discriminate**, not merely pass — *Verify: seed a deliberately
      broken assertion and confirm the matching case reddens (L-137). Green on first run against
      fixtures written alongside the code proves agreement, not coverage*
      → **10 breaks seeded, 10 discriminated**, engine restored under a verified sha1; two exposed real defects. Log, T6.

## Decisions (pre-locked)

- **D1 — Packaging: standalone-capable AND plugin-bundled, one implementation with two entry points.**
  Settled at intake rather than deferred to G2 because it shapes every task below. Cheaper than
  EPIC-004 estimated: SPRINT-074's checker already takes a repo-dir and resolves its spec beside
  itself, so the standalone shape is proven, not speculative. It is also the only option that satisfies
  § Closed-when 1 as written. **→ no ADR** (it implements the epic's D2, which already exists).
- **D2 — Consolidation: subsume one family now, migrate the rest per-family later.** EPIC-002 D3's
  unblock condition is met. A big-bang migration of all ten remaining checkers would put the published
  named-findings contract at risk in one commit, in a sprint that is already the largest this repo has
  run. **→ no ADR.**
- **D3 — Shared-file ownership.** `scripts/qa-check.sh` is touched by T2, T4 and T6; **T2 owns it and
  lands first**, T4 and T6 append. The engine file itself is touched by T2, T4 and T6 — same rule, T2
  first. At commit, stage shared files **per-hunk** (`git add -p` + verify `git diff --cached`); a
  plain `git add` over a sibling's WIP contaminates at the commit phase (L-042 · L-037).
- **D4 — T3 depends on T6, not only on T2.** Recorded because the promote-time dependency graph would
  otherwise read T3 as unblocked by T2 alone: with only §9's two rules migrated, a foreign-repo report
  is nearly empty and the consumer proof is vacuous. **The ordering is load-bearing, not incidental.**
- **D5 — ADLC platform work is out, by instruction not by omission.** `docs/strategy/adlc/` landed this
  session and is directional; its own handoff brief says dashboard and control-plane concepts must not
  be mixed into EPIC-004. Named in § Scope so a later reader sees a boundary that was decided.

## Assumptions

- **A1** — **43** rules are dispositioned `build`, of which §13's five are covered, leaving **38**;
  T6 takes four, leaving 34. *Confirm: re-derived at this intake — 43 rows · 43 unique · 43 by
  per-section sum. **The epic still quotes 42**; that figure predates T1 of SPRINT-074 adding
  `S4.INDEX`. Re-derive again at execution rather than copying this line (L-130 · L-136).*
- **A2** — the §13 parse generalises: it is position-anchored to a table row inside a section window,
  and §14 defines one table shape for all sections. *Confirm: read `check-attestation.sh`; T1's first
  DoD reconciles per-section counts against §14 and will surface any section that diverges.*
- **A3** — the named-findings contract to preserve is **not** the "46 across 22 harnesses" figure the
  epic quotes; SPRINT-074 added the 23rd harness and eight more names. *Confirm: re-derive from
  `evals/` at G2 — do not cite the epic's number.*
- **A4** — governance at this promote, owner-signed 2026-08-18: L-promotion **L-130 → CLAUDE.md**
  cross-check clause, carrying L-136 · TD aging **five rows re-reviewed**, TD-057 and TD-050 with fresh
  evidence from SPRINT-074, three held with unfired triggers · §11 retention **nothing due** (TD
  deletion 076/077, rotation done at close, LEARNINGS collapse zero pending) · §2 caps: **one soft
  breach held with reason** — `conformance-dispositions.md` at 163/130, and the growth is §13's
  published findings contract, which is what that file is *for*; pruning published contract text to
  meet a soft cap would be the wrong trade. Two stale cap **restatements** corrected (both claimed
  CONTEXT.md 130 against §2's 150). *Confirm: `TECH-DEBT.md`'s five `SPRINT-075 promote` rows and the
  `gov(75)` commits.*
- **A5** — skills are **1.45.0 base-dir vs 1.48.0 repo**, three versions stale by number. *Confirm:
  re-run `diff -rq --strip-trailing-cr` over the cached `skills/` against the repo's before trusting
  any procedure — it was byte-identical at SPRINT-074, but v1.48.0 is the first release since then and
  this has not been re-checked (L-021).*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-075-the-conformance-engine.md`, rendered from
> `templates/sprint-log.md.template` and created lazily at the first entry. Append there, never here:
> the Log grows with the work done, so keeping it out of this file is what stops it consuming the
> 400-line budget the Plan needs (STANDARD §9 · ADR-014). The `logs/` subdirectory is load-bearing —
> the sprint-file checks glob `docs/sprint/SPRINT-*.md` non-recursively, so a same-directory
> `-log.md` sibling would be capped and schema-checked as if it were a Plan.

## Files Changed

<!-- Filled during execution; feeds CHANGELOG at close. -->

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `scripts/lib/read-spec-rules.sh` | T1 | new — the rule-source reader, §13's parse generalised to any `## §N` table so the spec, not code, holds the rule set | med | `run-spec-reader-fixtures.sh` |
| `scripts/lib/check-attestation.sh` | T1 | its 25-line parse becomes one reader call — one parse, not twelve | med | `run-attestation-fixtures.sh` (16 assertions, unmodified) |
| `conformance.sh` | T2 | new — the standalone entry point D1 requires, so an adopter runs it without installing the plugin | low | `run-conformance-engine-fixtures.sh` |
| `scripts/lib/conformance-engine.sh` | T2·T4·T6·T3 | new at T2 (mark-driven driver + report); T4 folded in §9's two rules; T6 added the §1/§3 ownership family; T3 added the `GAP` class so engine gaps stop counting against the repo under test | high | engine · gates-signed · ownership · foreign-repo harnesses |
| `scripts/lib/check-gates-signed.sh` | T4 | **deleted** — its two rules now live in the engine; the first family consolidated (EPIC-002 D3) | med | `run-gates-signed-fixtures.sh`, repointed not rewritten |
| `evals/run-spec-reader-fixtures.sh` | T1 | new — 9 cases, 5 must-FAIL, one per named finding | low | seeded-break pass |
| `evals/run-conformance-engine-fixtures.sh` | T2·T3 | new at T2; T3 repointed it at the gap/finding separation and rebuilt the level-bucket case, which the change had quietly made vacuous | med | seeded-break pass (4 breaks) |
| `evals/run-gates-signed-fixtures.sh` | T4 | retained and repointed at the engine (TD-012); a **sixth** case added for the verdict *label*, which the migration flipped while reproducing the text | med | self |
| `evals/run-ownership-header-fixtures.sh` + `evals/fixtures/ownership-header/` | T6 | new — 11 cases, one retained must-FAIL per published finding, PASS controls, and the nested-README regression | med | seeded-break pass (10 breaks, 10 discriminated) |
| `evals/run-foreign-repo-fixtures.sh` | T3 | new — the epic's headline claim, tested: a repo built from nothing, no lean-flow file copied in, asserted mechanically | med | seeded-break pass (2 breaks) |
| `scripts/qa-check.sh` | T1·T2·T4·T6·T3 | §9 leg calls the engine; four new harnesses registered always-on (an ungated harness fails the completeness leg, L-020) | med | the gate itself |
| `docs/adr/ADR-027-*.md` | T5·T3 | new — executable code is consumer-facing; the CI sentence ruled. T3 evidence added a refinement marker rather than an edit (§4 append-only) | low | review |
| `docs/adr/ADR-008-*.md` | T5 | status marker only — amended, not superseded; no decision text touched | low | review |
| `docs/DECISIONS.md` · `docs/knowledge-index.md` | T5 | index row + regenerated knowledge index (ADR-009 metadata SSOT) | low | `qa-check.sh` index-freshness leg |
| `docs/research/conformance-dispositions.md` | T4·T6 | § Covered today repointed off the deleted checker; four rules moved `build` → covered (**43 → 39**, **8 → 12**) | low | rule-id re-count in both tables |
| `docs/epic/EPIC-004-conformance.md` | T5·T3 | § Closed-when 1 and 5 ticked with their evidence | low | review |

**Note:** T1/T2 rows are secondhand — reconstructed at close from their commits and the Log, since the
table was left empty during their execution.

## Retro

**Retrieval check** — no failure to find, and **one promoted rule that did not hold**. `L-120` was
promoted one sprint ago for exactly this, and T4 was still committed through a red gate: the runner
reported `exit 0` for `qa-check > out; echo $?` — `echo`'s status — while the file said `1 fail`. The
promoted form said "two calls, read its exit code"; a redirect reads as capturing output, not gating
an action. Re-promoted with the form that survives a wrapper: *read the gate's own `N pass, M fail`
line* → **L-120 ×5**. **Fired when they mattered:** L-058 (gaps stay named, so separating gap from
finding never became a silent skip) · L-137 (ten seeded breaks, two found real defects) · L-136 (the
ADR's "12 checkers" re-derived to 11 before it froze) · L-100 (four `Layers:` corrections) · L-009.
**Eighth sighting, still the corpus's most-repeated miss:** L-108 — a fixture named after the token
its own assertion greps for, minutes after that sub-case was re-read.

**Cost** — inline, coordinator-only; **zero sub-agents** (the session forbids the Agent tool). Four
commits, 33 files. `qa-check.sh` ran **seven times** at ~5 min, of which the engine leg is 47s (→
**TD-066**). Two runs were wasted measuring a tree that edits had already moved on from — a gate
started before the edits finish measures something that no longer exists.

**Worked**
- **Two censuses, one subject.** Every count entering an artifact was derived twice. That caught the
  `*/README.md` over-match (14 vs 15), a DECISIONS row that silently no-opped (26 vs 27), and the
  ADR's checker count (12 vs 11). None was visible in a diff → **L-140**.
- **Seeding breaks against an already-green suite** — ten breaks, ten discriminated, two exposing real
  defects. A suite written beside its code agrees with it by construction → **L-137 ×2**.
- **Running the tool on a subject whose answer we knew.** T3's value was that the report was *obviously*
  wrong — 41 findings against a repo with two — which reading the code could not surface, because every
  individual line was true → **L-141**.

**Friction**
- **The Plan hit its 400-line cap mid-close**, § Files Changed empty and § Retro unwritten. Resolved by
  moving DoD evidence to the uncapped Log (ADR-014's split) rather than raising a spec number for every
  adopter. Anticipate it at promote: **26 DoD does not fit a 400-line Plan at ~7 evidence lines each**,
  and that arithmetic is doable before the sprint, not at its end.
- **A migration proved itself with the check that could not see what it broke** — exact string equality
  across five cases while the verdict label flipped underneath → **L-139**.
- **The seeded-break pass reported green three times on patches that never landed**, and a timeout left
  a break in the engine, caught only by an explicit `sha1sum` restore check.

**Changed** — `rule-unimplemented` is no longer a finding about the repo under test but a `GAP`: named
every time, off the level and exit code, coverage on its own axis. That overturned a sentence in
**ADR-027**, accepted the same day, which now carries a refinement marker rather than an edit.
Executable code here is formally consumer-facing; ADR-008 amended, not superseded. EPIC-004 §
Closed-when **1 and 5** tick — the epic stands at **3 of 5** and does not close. **Coverage is 6 of 62
checkable rules**, stated plainly because the headline could be read as "conformance is done": it is
six rules with an assertion, and the register's `build` remainder is 39.

**Filed** — Shipped → `CHANGELOG.md` **v1.49.0** (v1.47.0 rotated). Tech debt → **TD-064** (28 ownership
gaps in our own docs) · **TD-065** (register still counts §13's five under `build`) · **TD-066** (the
engine's spawn cost). Follow-ups → **TASK-237** (§3 owes an ADR row) · **TASK-238** (re-run the artefact
triage once coverage reaches the shape-bound rules). Learnings → **L-139** · **L-140** · **L-141**, plus
**L-120 ×5** (re-promoted) · **L-108 ×8** · **L-137 ×2** (promotion candidate next promote) · **L-100 ×4**.
