---
sprint: 075
slug: the-conformance-engine
epic: EPIC-004
owner: Maintainer
last_updated: 2026-08-18
plan_commit: 9693d79
close_commit: [sha — set at close]
status: active
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
        `evals/` (reader fixtures)
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
- [ ] The reader parses **every** `## §N` section that carries a Conformance block — *Verify: run it
      across all 13 and reconcile the per-section counts against §14's own table (`4·21·3·7·2·4·9·0·10·10·11·12·7 = 100`);
      a section returning zero rows when §14 says it has some is a FAIL, not an empty result*
- [ ] §13's output is **unchanged** — *Verify: diff the reader's §13 rows against what
      `check-attestation.sh` derives today, mechanically. This is a refactor of a working parse; a
      behaviour change here is a regression, not an improvement*
- [ ] An absent or unparseable table is a **named finding**, never an empty rule set — *Verify: a
      retained must-FAIL fixture pointing the reader at a spec with no tables reports
      `spec-table-unreadable`. A reader returning nothing checks nothing and exits clean, which is the
      false negative the whole engine would otherwise inherit (L-058)*
- [ ] `check-attestation.sh` consumes the reader rather than keeping its own copy — *Verify:
      `evals/run-attestation-fixtures.sh` still green, all 16 assertions, unmodified*

### T2 — Build the engine core: registry, dispatch, report `[size: M · risk: med · class: execution · HITL]`
Layers: `scripts/lib/` (the engine) · `scripts/qa-check.sh` · `evals/` (engine fixtures)
Depends-on: T1
Cites: EPIC-004 D1 · D2 (settled at intake) · `spec/STANDARD.md` §14 (levels, marks, the
       no-percentage rule) · ADR-021
The engine is the §13 checker's dispatch loop with the rule set widened and the report generalised. Its
whole correctness claim is that **the spec decides what gets evaluated** — so the mark column drives
inclusion, and a rule the spec states but the engine cannot answer is reported rather than absent.

**Acceptance:** `sh conformance.sh <repo-dir>` produces, for any repository, a level and a list of
named findings — and a reader can tell from the output which rules were evaluated, which were skipped,
and why.

**DoD:**
- [ ] Dispatch is **mark-driven**, not a hard-coded list — *Verify: re-mark a rule in a spec copy and
      the engine's behaviour changes with no code edit, the same fixture shape SPRINT-074 used to prove
      it for §13*
- [ ] `judgment-only` and `implementation-directed` rules are **never evaluated against the repo** —
      *Verify: neither appears as a verdict line; a fixture asserts it. These are the findings no
      adopter can ever clear (§14)*
- [ ] A `mechanical` rule with no assertion reports `rule-unimplemented` — *Verify: retained must-FAIL
      fixture. With 34 dispositions still unbuilt this will fire a lot, and that is correct: the gap is
      the report's most useful content this sprint*
- [ ] The report states a **level** and the findings preventing the next one — *Verify: fixture*
- [ ] **No score, grade or percentage appears anywhere in the output** — *Verify: a fixture greps the
      output for `%`, `score`, `grade` and a ratio shape and asserts absence. §14 forbids it
      normatively, so this is checked rather than trusted (L-058)*
- [ ] Exit 0 clean / 1 findings, CI-usable — *Verify: fixture asserts both, on the same repo*

### T3 — Run the engine against a repo that has never seen lean-flow `[size: M · risk: med · class: decision · HITL]`
Layers: `evals/` (a foreign-repo harness) · the engine (only if the run exposes a defect)
Depends-on: T2, T6
Cites: EPIC-004 § Closed-when 1 · L-015 (the consumer surface) · L-016 (verify on the consumer path
       when the repo cannot dogfood) · `docs/research/conformance-dispositions.md`
The epic's headline claim is that an adopter gets a named answer. Nothing has tested it: all 43 `build`
dispositions were judged against **this** repository's shape, by people who wrote the standard. This
task is the first contact with a repository that never agreed to any of it.

**Acceptance:** a throwaway repo with a README and nothing else gets a level, named findings, and no
finding a reasonable owner would call meaningless.

**DoD:**
- [ ] The engine runs against a repo built from scratch with none of our conventions — *Verify: the
      harness builds it under `mktemp -d`; no lean-flow file is copied in*
- [ ] It emits a level and named findings, and **nothing** for `judgment-only` /
      `implementation-directed` rules — *Verify: fixture asserts both halves*
- [ ] **Every finding is triaged for actionability, and the verdict is recorded** — *Verify: a written
      pass over the output classifying each finding as *actionable by that repo's owner* or *an
      artefact of dispositions written against our own shape*. **A high artefact count is a finding
      about `docs/research/conformance-dispositions.md`, and routes back there** — do not tune the engine to look
      quiet (L-088: the criterion is the report being honest, not short)*
- [ ] EPIC-004 § Closed-when 1 is ticked or the reason it is not is written down — *Verify: the epic
      row; a condition ticked without its evidence is the tick this sprint exists to avoid*

### T4 — Migrate the §9 gates-signed family into the engine `[size: M · risk: med · class: execution · HITL]`
Layers: `scripts/lib/check-gates-signed.sh` (deleted) · the engine ·
        `evals/run-gates-signed-fixtures.sh` (repointed, not rewritten) · `scripts/qa-check.sh`
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
- [ ] `S9.GATESWELLFORMED` and `S9.GATESABSENT` are evaluated by the engine — *Verify: both appear as
      verdict lines against a sprint file*
- [ ] Their named findings are reproduced **exactly** — *Verify: string-compare the engine's findings
      against the shipped checker's before deleting it. A renamed finding silently breaks a published
      contract (SPRINT-074 D2's reasoning, one family over)*
- [ ] `check-gates-signed.sh` is deleted and `qa-check.sh` calls the engine instead — *Verify: the file
      is gone and the gate still reports the same verdicts*
- [ ] **The fixture harness is retained and repointed, not rewritten** — *Verify:
      `evals/run-gates-signed-fixtures.sh` green against the engine, including the load-bearing case
      where a **missing** field reads as NOT SIGNED rather than as approval. Deleting fixtures with the
      checker they guarded is TD-012 exactly*

### T5 — Amend or supersede ADR-008's maintainer-only scope `[size: S · risk: low · class: decision · HITL]`
Layers: `docs/adr/` (new ADR) · `docs/DECISIONS.md` · `docs/adr/ADR-008-*.md` (status marker only)
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
- [ ] An ADR records the scope change and **rules explicitly on the CI sentence** — *Verify: the ADR
      names ADR-008's wording and says which reading now holds*
- [ ] ADR-008 is marked amended/superseded, **never edited in place** — *Verify: the file; §4 is
      append-only for decided ADRs*
- [ ] `docs/DECISIONS.md` gains its row — *Verify: the index*
- [ ] EPIC-004 § Closed-when 5 ticked — *Verify: the epic. It requires this be formally amended, "not
      silently outgrown", which is what four sprints of using the checkers consumer-ward already was*

### T6 — Cover the ownership-header family: `S1.LAW2` · `S1.LAW3` · `S3.SCHEMA` · `S3.AGENTS` `[size: M · risk: med · class: execution · AFK]`
Layers: the engine (assertions) · `evals/` (one retained fixture per named finding)
Depends-on: T2
Cites: `docs/research/conformance-dispositions.md` § build (the five published names) ·
       EPIC-004 § Closed-when 2 · L-058 · TD-012
The first *new* coverage, and chosen for what it enables rather than for being easy: these four rules
apply to any repository containing documents, which is what makes the foreign-repo run report something instead of
nothing. The five finding names are already published — this task consumes that contract, it does not
choose it.

**Acceptance:** a repo with a doc missing its ownership header gets told so, by name.

**DoD:**
- [ ] All four rules are evaluated, firing the five **already-published** names — `owner-not-a-role` ·
      `update-trigger-absent` · `ownership-header-missing` · `ownership-header-field-missing` ·
      `agents-ownership-footer-missing` — *Verify: count assertions against the register's rows; a rule
      silently skipped is a FAIL*
- [ ] **One retained must-FAIL fixture per named finding**, plus a PASS control — *Verify: the harness;
      each case fails with its own name (L-058 · TD-012)*
- [ ] `owner-not-a-role` does not fire on a legitimate role — *Verify: a PASS-control fixture using
      `Maintainer`. This is the one rule here that can produce a false positive on correct input, since
      distinguishing a role from a person is the judgment half of a `split` mark*
- [ ] The fixtures were shown to **discriminate**, not merely pass — *Verify: seed a deliberately
      broken assertion and confirm the matching case reddens (L-137). Green on first run against
      fixtures written alongside the code proves agreement, not coverage*

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

## Retro

<!-- Written at close. Route the buckets to durable homes (STANDARD §10):
     shipped → CHANGELOG.md (root) · tech debt → TD-NNN · follow-ups → TASK-NNN · learnings → docs/LEARNINGS.md.
     After close, the file moves → docs/sprint/archive/ + a one-line entry in docs/sprint/INDEX.md (§11). -->
