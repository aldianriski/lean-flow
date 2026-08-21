---
sprint: 076
slug: coverage-and-the-bar
epic: EPIC-004
owner: Maintainer
last_updated: 2026-08-20
plan_commit: f6ae258
gates_signed: G1,G2 @ 641036f
close_commit: [sha — set at close]
status: active
update_trigger: sprint execute/close events
---

# SPRINT-076 — Coverage, and Whether the Bar Is Right

> **Theme:** SPRINT-075 built the engine and learned from a stranger that the report was measuring the
> wrong thing. This sprint does the two things that have to happen before EPIC-004's remaining bar can
> be judged rather than guessed at: **establish whether every check we ship is actually guarded**, and
> **cover the family most likely to expose our own shape**. It ends by ruling on the epic's second
> exit condition with real numbers — a decision this sprint exists to make deliberately, because the
> alternative is amending an exit condition to fit what got built.

## Scope

**In:** a per-check fixture audit that closes EPIC-004 § Closed-when 3 or says why it cannot (T1) ·
the §4 ADR family, five mechanical rules against a 27-ADR corpus (T2) · §2's placement pair, chosen
*because* it is the likeliest artefact source, plus a re-run of the foreign-repo triage against it
(T3) · a recorded ruling on § Closed-when 2 (T4) · §3's two unwritten exceptions, ADRs and the
strategy tree (T5).

**Out (deferred):** the remaining **32** `build` dispositions after T2 and T3's seven — coverage is
repeatable and belongs in following sprints · migrating the nine remaining standalone checkers into
the engine (SPRINT-075 T4 proved the path for one family; the rest follow per-family, each guarded by
its own retained fixtures) · **EPIC-005 Fleet**, which is Phase B and stays behind this epic's exit ·
**every ADLC platform concept** — control plane, dashboard, runtime gateway, memory/cost — named here
so the boundary stays a decision rather than an omission · the harness/execution-delta research track,
research-only · **TD-048 and TD-057's matcher work**, still deliberately unscheduled and to be priced
together · TD-051 · TD-052 · TD-061 · TD-062, the four aged `medium` rows, which want pricing as a
batch rather than being smuggled in beside coverage work.

## Plan

### T1 — Audit whether every shipped check has a retained must-FAIL fixture firing its named finding `[size: M · risk: med · class: decision · HITL]`
Layers: `docs/research/fixture-coverage-audit.md` (the audit record) ·
        `docs/epic/EPIC-004-conformance.md` (§ Closed-when 3) ·
        `evals/run-gates-signed-fixtures.sh` + `evals/fixtures/gates-signed/` (the one gap the audit
        found worth closing) · `TECH-DEBT.md` (TD-067, the defect writing that fixture exposed) ·
        `docs/research/conformance-dispositions.md` (F1's scope-out off-by-one, folded in per the
        G2 ruling)
Depends-on: none
Cites: EPIC-004 § Closed-when 3 · SPRINT-072 (the 22 harnesses · 98 cases · 46 findings measurement) ·
       L-058 · L-108 · TD-012

The condition has been open since the epic opened and has never been *established* — only measured
around. SPRINT-072 counted harnesses, cases and distinct findings, none of which answers "does every
check have one". The answer is a list, not a number: for each shipped check, the fixture that guards
it, or the gap.

**Acceptance:** a reader can point at any check in `scripts/lib/` or any `assert_*` in the engine and
see, from one document, whether a retained must-FAIL fixture asserts its named finding.

**DoD:**
- [x] Every check is enumerated from disk, not from memory — *Verify: the enumeration is derived
      (`ls scripts/lib/check-*.sh` + `grep '^assert_' conformance-engine.sh`) and its count reconciled
      against the dispositions register's covered set; a disagreement is investigated, not rounded*
- [x] Each published finding name is classified **has a retained must-FAIL fixture** / **does not**,
      by name — *Verify: the gap list is explicit; "mostly covered" is not an outcome (L-058)*
- [x] The audit query is cross-checked — *Verify: with-fixture + without-fixture sums to the register's
      total. L-108 has eight sightings and every one was caught by a second number disagreeing, never
      by recalling the rule*
- [x] EPIC-004 § Closed-when 3 is ticked with that evidence, **or** the reason it cannot be is written
      into the epic — *Verify: the epic. A condition ticked without its evidence is what this epic
      exists to avoid*

### T2 — Cover the §4 ADR family: `S4.ONEFILE` · `S4.APPEND` · `S4.INDEX` · `S4.SECTIONS` · `S4.NEGATIVE` `[size: M · risk: med · class: execution · AFK]`
Layers: `scripts/lib/conformance-engine.sh` (assertions) · `evals/run-adr-family-fixtures.sh` +
        `evals/fixtures/adr-family/` · `scripts/qa-check.sh` (register the harness) ·
        `docs/research/conformance-dispositions.md` (five rules move `build` → covered)
Depends-on: none
Cites: spec §4 · `check-attestation.sh` (the shape `S4.APPEND` reads history in) ·
       EPIC-004 § Closed-when 2 · L-058 · TD-012 · L-137 (the seeded-break method, and verifying the
       seed landed)

Five mechanical rules with a 27-ADR corpus to test against — the highest-confidence coverage available,
and the one family whose correctness this repo can check against itself immediately.

**Acceptance:** an ADR missing its negative consequence, or edited after its decision, is reported by
name against any repository.

**DoD:**
- [x] All five rules are evaluated, firing the five **already-published** names —
      `adr-path-noncanonical` · `adr-edited-after-decision` · `decisions-index-missing-adr` ·
      `adr-required-section-missing` · `adr-no-negative-consequence` — *Verify: count assertions against
      the register's rows; a rule silently skipped is a FAIL, not an empty result*
- [x] **`S4.APPEND` reads history, not the tree** — *Verify: it answers from `git log`, the way
      `check-attestation.sh` does, and reports `attestation`-style honestly when history is unavailable.
      It is also the only **Gated** rule here; the other four are Structural, so the level arithmetic
      must place it correctly*
- [x] **A post-decision marker passes; an edited § Decision fails** — *Verify: ADR-008 and ADR-027 both
      carry legitimate `amended by` / refinement markers and must stay green. This distinction is the
      task, not a detail: a rule that fails on our own two correctly-amended ADRs is unusable*
- [x] One retained must-FAIL fixture per name, plus a PASS control — *Verify: `run-adr-family-fixtures.sh`,
      registered in `qa-check.sh`'s always-on set (an ungated harness fails the completeness leg, L-020)*
- [x] The suite is shown to **discriminate** — *Verify: seed a break per assertion and confirm the
      matching case reddens; **verify each seed landed** (`cmp` against the pristine copy, restore under
      a checked hash). A no-op patch reports green and reads identical to a suite that works (L-137 ×2)*

### T3 — Cover §2's placement pair and re-run the foreign-repo artefact triage against it `[size: M · risk: med · class: decision · HITL]`
Layers: `scripts/lib/conformance-engine.sh` · `evals/run-foreign-repo-fixtures.sh` (extend the target) ·
        `evals/run-s2-placement-fixtures.sh` (new; fixture repos built at runtime, so no
        `evals/fixtures/` subtree) · `evals/run-conformance-engine-fixtures.sh` (its driver fixtures now
        carry §2's core set) · `scripts/qa-check.sh` · `TODO.md` (TASK-238 re-parked ·
        TASK-243 filed) · `docs/research/conformance-dispositions.md` (§ Artefacts — artefacts WERE found)
Depends-on: none
Cites: SPRINT-075 T3 · TASK-238 · EPIC-004 § Closed-when 1 · L-015 · L-016 · L-141

`S2.F-FILE` and `S2.R-PLACEMENT` were chosen **because they are the likeliest to produce artefacts,
not the least.** SPRINT-075 T3's triage recorded zero and recorded itself as *barely asked* — six of
62 rules, none of them shape-bound. These two are the prime suspects, so covering them is what turns
the artefact question from open into answered.

**Acceptance:** a repo with none of our conventions is told which core files it lacks and which files
sit outside canonical placement — or we learn that those rules cannot say anything useful to a stranger,
which is equally a result.

**DoD:**
- [x] Both rules are evaluated, firing `core-file-missing` and `file-outside-canonical-placement` —
      *Verify: verdict lines against a real repo, plus retained must-FAIL fixtures and a PASS control*
- [x] The foreign-repo harness is re-run and **every new finding is triaged** *actionable by that repo's
      owner* vs *artefact of dispositions written against our shape* — *Verify: the written pass, one
      row per finding, in the Execution Log*
- [x] **A high artefact count routes back to `conformance-dispositions.md`** — *Verify: if artefacts are
      found, the register's dispositions for those rules are revisited and the change recorded. The
      engine is NOT tuned to look quiet, and "several artefacts" is a success for this task, not a
      failure (L-088: the criterion is the report being honest, not short)*
- [x] TASK-238's trigger is discharged or explicitly re-parked with its condition — *Verify: TODO.md*

### T4 — Rule on EPIC-004's § Closed-when 2 with the coverage evidence in hand `[size: S · risk: med · class: decision · HITL]`
Layers: `docs/epic/EPIC-004-conformance.md` · `docs/adr/` (only if the condition is amended) ·
        `docs/DECISIONS.md` (with an ADR)
Depends-on: T1, T2, T3
Cites: EPIC-004 § Closed-when 2 · `docs/strategy/adlc/03-ADLC-ROADMAP.md` Phase A exit · L-088 · STANDARD §4

The epic requires *every* spec rule to map to a check; the roadmap's Phase A exit asks only that rules
be independently readable and conformance independently measurable. Both may already be true while the
epic's own condition is far from met. That gap is a decision, and it is made **last, with numbers** —
never as a convenience at close.

**Acceptance:** a reader of the epic can tell whether the bar stands or moved, and why.

**DoD:**
- [x] The ruling is written with the three numbers that inform it — *Verify: coverage after this sprint,
      T3's artefact count, T1's fixture gap list. A ruling without them is the drift this task exists
      to prevent*
- [x] If the condition is **amended**, an ADR records it and `docs/DECISIONS.md` gains its row —
      *Verify: §4's three-part bar is met, or no ADR is written and the Retro carries the ruling instead*
- [x] **"The bar stands and EPIC-004 runs more coverage sprints" is a legitimate outcome** and is
      recorded as such if it is the honest answer — *Verify: the epic. Amending an exit condition to fit
      what was built is the failure L-088 names (SPRINT-075 already refused this once, on a DoD whose
      parenthetical was wrong)*

### T5 — Write §3's two unstated exceptions into the spec `[size: S · risk: low · class: decision · HITL]`
Layers: `spec/STANDARD.md` (§3) · `spec/CHANGELOG.md` · `scripts/lib/conformance-engine.sh` (cite the
        rows instead of carrying the rulings in comments — **and implement the exploratory-tree
        exemption**, which DoD 2's verification requires) · `TECH-DEBT.md` (TD-064's remaining half) ·
        `docs/strategy/adlc/README.md` (the tree makes the declaration) ·
        `evals/run-ownership-header-fixtures.sh` + `evals/fixtures/ownership-header/` (the exemption
        is exercised, including a must-FAIL that it cannot be triggered from prose)
Depends-on: none
Cites: TASK-237 · TD-064 · SPRINT-075 T6 · spec §3 · §4 · ADR-009 · LAW 1

§3 spells out its README and AGENTS.md exceptions and stops there. Two more are being enforced in code
today: ADRs carry ADR-009 metadata rather than the four-field header, and a strategy/exploratory tree is
input to decisions rather than a governed doc set. A rule enforced in a checker but absent from the
standard is the wrong way round.

**Acceptance:** both exceptions are readable in §3, and the engine cites them instead of asserting them
from a comment.

**DoD:**
- [x] §3 states the **ADR** exception — *Verify: the spec; re-read §4's frontmatter block before wording
      it, since §4 is what creates the conflict*
- [x] §3 states that a **strategy/exploratory tree is not a governed doc set** — *Verify: the spec, and
      the engine's ownership findings against this repo drop by the 12 `docs/strategy/adlc/` docs*
- [x] Version bumped **PATCH**, not MINOR — *Verify: `spec/CHANGELOG.md`. Both write down exceptions
      adopters already rely on, so nothing they satisfy today changes; calling it MINOR would tell them
      to re-read a spec that gained no obligation (ADR-023)*
- [x] TD-064 is updated to its remaining half — *Verify: the ledger; the 3 `docs/qa/` files stay a real
      finding, and the row says so rather than being closed wholesale*

## Decisions (pre-locked)

- **D1 — The sprint is sized down deliberately: 5 tasks, 20 DoD, against SPRINT-075's 6 and 26.**
  That sprint breached its 400-line Plan cap at close and needed three evidence-migration passes to fit.
  The arithmetic was available at promote and nobody did it. **→ no ADR** (a sizing choice, not a
  hard-to-reverse decision).
- **D2 — Evidence goes to the Execution Log from the first task, not after the cap bites.** The Plan
  carries criterion, `*Verify:*` and a one-line verdict; reasoning lives in the uncapped sibling, which
  is what ADR-014 created it for. **→ no ADR** (it implements ADR-014).
- **D3 — Shared-file ownership.** `scripts/lib/conformance-engine.sh` is touched by T2 and T3;
  **T2 owns it and lands first**, T3 appends. `scripts/qa-check.sh` and
  `docs/research/conformance-dispositions.md` likewise. At commit, stage shared files **per-hunk**
  (`git add -p` + verify `git diff --cached`) — a plain `git add` over a sibling's WIP contaminates at
  the commit phase (L-042 · L-037). **→ no ADR.**
- **D4 — T4 depends on all three of T1/T2/T3, and that ordering is load-bearing.** Its whole purpose is
  to rule with numbers; run early it becomes the guess it exists to replace. **→ no ADR.**

## Assumptions

- **A1** — The published named-findings set is a contract to audit against, not a list to re-derive.
  *Confirm: `docs/research/conformance-dispositions.md` § build, read at T1 before enumerating.*
- **A2** — This repo's 27 ADRs are a sufficient corpus for §4, including two with legitimate
  post-decision markers (ADR-008, ADR-027). *Confirm: T2's PASS controls run against both.*
- **A3** — `S4.APPEND` is answerable from `git log` in a repo that has one, and degrades to a named
  finding where it does not. *Confirm: T2's DoD 2, and the shallow-clone case exercised as a fixture.*
- **A4** — §2's placement rules are the likeliest artefact source among the remaining families.
  *Confirm: T3's triage — and note that **disconfirming this is a result**, not a failed assumption.*
- **A5** — Coverage after this sprint is **13 of 62** checkable rules (6 today + 5 from T2 + 2 from T3).
  *Confirm: the engine's own `coverage:` line at T3's close — a figure written into a Plan is a query
  result and gets re-derived at execution, not trusted from here (L-130 · L-136).*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-076-coverage-and-the-bar.md`, rendered from
> `templates/sprint-log.md.template` and created lazily at the first entry. Append there, never here:
> the Log grows with the work done, so keeping it out of this file is what stops it consuming the
> 400-line budget the Plan needs (STANDARD §9 · ADR-014).

## Files Changed

<!-- Filled during execution; feeds CHANGELOG at close. -->

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `docs/epic/EPIC-004-conformance.md` | T4 | § Closed-when 2 **ruled: the bar stands**, with the three numbers that informed it. No ADR — nothing was amended, so §4's bar is not met; the Retro carries the ruling | med | the epic; 19/62 · 4/8 · 16/19 |
| `docs/research/fixture-coverage-audit.md` | T1 | **new** — the audit record: 24 of 24 checks guarded, 16 of 19 finding identities, gap list named, and the two ways the audit's own query failed green before it was right | low | cross-check: 16 + 3 = 19 |
| `evals/run-gates-signed-fixtures.sh` + `evals/fixtures/gates-signed/` | T1 | close the one repository-facing gap — `unrecognised-gate-token-fails`, a retained must-FAIL | low | harness green |
| `TECH-DEBT.md` | T1 | **TD-067** — the token test accepts `G7`/`G99` while promising "want G1 / G2"; found by writing the fixture above | low | — |
| `docs/epic/EPIC-004-conformance.md` | T1 | § Closed-when 3 **established, not ticked**, with the evidence and both reasons written in | low | — |
| `docs/research/conformance-dispositions.md` | T1 | F1 folded in: § scope-out 12 → 11 (`S2.R-GROWTH` is `judgment-only`, never checkable) | low | 19 + 32 + 11 = 62 ✓ |
| `spec/STANDARD.md` | T5 | §3 gains the **ADR exception** and the **exploratory-tree exception**; version 0.4.1 → 0.4.2. No rule added — §3 still publishes 3 | low | 100 rules still parse; §3's count unchanged |
| `spec/CHANGELOG.md` | T5 | 0.4.2 entry, PATCH, stating why neither exception is a new obligation | low | — |
| `scripts/lib/conformance-engine.sh` | T5 | implement the declared-exploratory exemption (`_own_governed_off`, a **declaration not a path**) and rewrite the ADR-exemption comment to **cite** §3 rather than carry the ruling | med | 3/3 seeded breaks · ownership harness |
| `docs/strategy/adlc/README.md` | T5 | the tree makes the declaration (`governed: false`) | low | 12 docs exempt, named on every report |
| `evals/run-ownership-header-fixtures.sh` + `evals/fixtures/ownership-header/` | T5 | 3 retained cases: the exemption works and is named · it **cannot be triggered from prose** · silence still means governed | low | seeded-break caught the prose case proving nothing on its first draft |
| `TECH-DEBT.md` | T5 | TD-064 halved by ruling, not by writing 12 headers; stays **open** for the 3 `docs/qa/` + 13 research docs | low | 3 · 13 · 16 reconcile |
| `scripts/lib/conformance-engine.sh` | T3 | +2 assertions for §2 (`S2.F-FILE` · `S2.R-PLACEMENT`), required set derived from §2's `Create ←` cells at runtime. **Plus a driver fix**: the assertion-name mangling dropped hyphens, so all 21 hyphenated rule ids resolved to a function that never existed and reported `rule-unimplemented` | med | `run-s2-placement-fixtures.sh` (7 cases) · 6/6 seeded breaks · foreign-repo run |
| `evals/run-s2-placement-fixtures.sh` | T3 | new retained harness — must-FAIL per name, a conformant PASS control, the legacy-second-match case, and the case proving the two rules stay separable on a legacy layout | low | 5 of 6 rule cases proven RED first |
| `evals/run-foreign-repo-fixtures.sh` | T3 | re-run the triage with the new rules; **two criteria that went stale** revised (a finding may name a path the repo *lacks*; the level counts failing rules, not finding lines), and the 4-artefact result retained as an assertion | med | 6/6 cases green |
| `scripts/qa-check.sh` | T3 | register the S2 harness always-on (original cost rule — no git) | low | gate leg |
| `docs/research/conformance-dispositions.md` | T3 | §2 pair `build` → covered (19 · 32); **new § Artefacts** recording 4 of 9 unconditional rows as loop-specific for a generic adopter | low | recount reconciles to 62 |
| `TODO.md` | T3 | TASK-238 re-parked with a narrowed condition (§2 third done); **TASK-243 filed** for the §2 spec fix | low | — |
| `evals/run-conformance-engine-fixtures.sh` | T3 | its driver fixtures were bare directories; `S2.F-FILE` correctly reported 8 missing core files against them, so they now carry §2's core set (derived from the spec, `AGENTS.md` in §3's footer form) | low | 16/16 cases green |
| `scripts/lib/conformance-engine.sh` | T2 | +5 assertions for §4 (`S4.ONEFILE` · `S4.APPEND` · `S4.INDEX` · `S4.SECTIONS` · `S4.NEGATIVE`) firing the five already-published names. `S4.APPEND` is the engine's first rule to read git history rather than the tree | med | `run-adr-family-fixtures.sh` (12 cases) · 10/10 seeded breaks · 27-ADR corpus |
| `evals/run-adr-family-fixtures.sh` | T2 | new retained harness — one must-FAIL per published name, a PASS control, and three git states for `S4.APPEND` (edit fails · marker passes · no-history and shallow reported honestly) | low | proven 12/12 RED before the assertions existed |
| `evals/fixtures/adr-family/` | T2 | 9 retained fixture repos (TD-012: deleting fixtures with the prototype leaves the gate unguarded) | low | consumed by the harness above |
| `scripts/qa-check.sh` | T2 | register the harness **always-on** — a deliberate, owner-ruled exception to TD-016's git-building→opt-in cost rule, with the reason recorded beside the list | low | gate leg `PASS eval harness run-adr-family-fixtures.sh` |
| `docs/research/conformance-dispositions.md` | T2 | five §4 rules move `build` → covered; both section headers re-derived by counting **rule ids**, not rows | low | recount: 17 covered · 34 build |
| `docs/sprint/logs/SPRINT-076-…md` | T2 | Execution Log opened at the gate (D2) and carrying T2's evidence | low | — |

## Retro

<!-- Written at close. Route the buckets to durable homes (STANDARD §10):
     shipped → CHANGELOG.md (root) · tech debt → TD-NNN · follow-ups → TASK-NNN · learnings → docs/LEARNINGS.md.
     After close, the file moves → docs/sprint/archive/ + a one-line entry in docs/sprint/INDEX.md (§11). -->
