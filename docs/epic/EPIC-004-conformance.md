---
epic: 004
slug: conformance
owner: Maintainer
last_updated: 2026-08-18
status: active
member_sprints: [072, 073, 074, 075]
update_trigger: a member sprint closes, or a decision lands that changes the outcome
---

# EPIC-004 — Conformance

> **Outcome:** any repo can ask "am I conformant with the lean-flow standard, and at what level?" and
> get a named answer with named findings — including whether its human gates were actually signed.

## Why this, why now

This is the epic that converts a style guide into a standard. Eleven checkers
(`scripts/lib/check-*.sh`) and 24 eval harnesses already encode most of the rules, and every one of
them is maintainer-only:

<!-- CORRECTED at SPRINT-072 T4 — measured, not asserted. Two claims in this section are wrong and are
     left in place (an epic is edited, but the correction is more useful beside the original).
     (a) "already encode most of the rules" — they encode most of *lean-flow's project conventions*.
     Only 3 of the standard's 13 sections are referenced anywhere in scripts/lib/ (§2 ×30, §11 ×16,
     §7 ×1); ten sections have zero. Five of eleven checkers cite no section at all. Measured coverage
     is 8 rules covered of 96 classified.
     (b) "24 eval harnesses" / "~82 named findings across 16 retained fixture harnesses" (Open
     questions) — actual: 22 harnesses on disk, 17 asserting, 98 fixture cases, 46 distinct named
     finding strings. The ~82 conflated cases with findings.
     Baseline: docs/research/conformance-baseline.md. -->
 ADR-008 scoped them to this repo and `docs/architecture/overview.md` confirms
no consumer invokes them (`docs/research/platform-readiness-audit.md` F4). The machinery exists and
points inward. Turning it outward is a smaller build than it looks, and it is the highest-value
consumer-facing gap in the audit.

It spans sprints because the engine has to become **spec-driven** rather than a renamed pile of
scripts. Eleven bespoke checkers that each hard-code their own rule cannot answer "at what level" —
only a checker that reads the EPIC-003 spec as its rule source can, and only that version survives a
spec change without eleven edits.

**A gate's worst failure is the silent false negative.** Every check ships with at least one must-FAIL
fixture that fails with its *named* finding (L-058, proven twice live), and those fixtures are
retained (TD-012). L-108 binds too: a check anchors to a **position**, not a substring, because this
corpus is self-describing and a grep over it eventually matches prose about the search.

## Scope

**In:** one spec-driven conformance engine replacing the 11 bespoke checkers · consumer-facing
packaging (runs in a consumer repo, CI-friendly exit codes, named findings) · attestation
verification reading EPIC-003's git trailers · must-FAIL fixture per check · a ruling on ADR-008's
maintainer-only scope.

**Out (explicitly not):** enforcing conformance (ADR-011 stands — gates stay human discipline; this
reports, it does not block) · cross-repo aggregation (EPIC-005) · scoring or grading repos against
each other · any telemetry, ever (the README promises none).

## Member sprints

| Sprint | Theme | Status | What it contributed to the outcome |
|---|---|---|---|
| [SPRINT-072](../sprint/archive/SPRINT-072-conformance-baseline.md) | Conformance Baseline | closed 2026-08-16 · `87954f2` | **Overturned this epic's opening premise and replaced it with a measurement.** All **96** normative rules classified — 8 covered · 39 uncovered-mechanical · 45 judgment-only · 6 implementation-directed — and reconciled against the live corpus (11 checkers · 22 harnesses · 98 fixture cases · 46 distinct findings). The checkers do **not** encode the standard: 3 of 13 sections are referenced in `scripts/lib/`, ten have zero. Established the fourth bucket `implementation-directed` (6 rules an engine must never evaluate against an adopter), that a §2 row is a *parameter set* not a rule (6 families, not 37), and that **Gated is the hard level, not Attested**. Changed no checker and no execution architecture — verified by diff. |
| [SPRINT-073](../sprint/archive/SPRINT-073-spec-as-rule-source.md) | The Spec as Rule Source | closed 2026-08-16 · `e7ce99b` | **Made D1 mechanically true: the spec is now the rule source.** `spec/STANDARD.md` **0.4.0** carries every rule's level and mark in-file, keyed by stable ids a finding can name, plus **§14** stating the model — including the **no-percentage** ruling *normatively*, so it binds adopters' tools rather than this epic's notes. **98 classified + 2 unclassified**, re-derived from the spec after the frozen baseline proved unable to reproduce its own total (96 stated vs 99 and 98 by column). **54 dispositions** — 42 `build` each naming its finding, 12 `scope-out` each with its reason. Ruled the spec uncapped (**ADR-026**, closing TD-058). No checker, no engine, no execution-architecture change. |
| [SPRINT-074](../sprint/archive/SPRINT-074-first-spec-driven-checker.md) | The First Spec-Driven Checker | closed 2026-08-18 · `6016738` | **Answered D1 by building it: spec-driven is buildable, and the honest form is a split.** `scripts/lib/check-attestation.sh` reads §13's Conformance table **at runtime** for its rule set and marks; assertion bodies stay in code, because *"all three required together"* and *"the `Evidence:` value's shape"* are different code — and saying which half is which is the finding, since claiming both would be theatre. Three properties no hard-coder has, each fixture-guarded: a rule **added** to the spec reports `rule-unimplemented` rather than vanishing; an unparseable table reports `spec-table-unreadable` rather than checking nothing and exiting clean; and `implementation-directed` exclusion is **derived from the Mark column**, proven by re-marking a rule in a spec copy and watching the checker stop asserting it with no code edit. **The central question's premise was itself wrong** — §14 carries no per-rule table (it is the legend); the tables live in each section's `Conformance.` block (→ L-136). §13's five finding names published; **100 classified · 0 unclassified** at spec 0.4.1; TD-037 closed after 19 sprints. Not the engine — one checker, and it cost one uncleanable-finding bug caught only by running it against real history. |
| [SPRINT-075](../sprint/SPRINT-075-the-conformance-engine.md) | The Conformance Engine | active | _(completed at close)_ — turns SPRINT-074's single spec-reading checker into the **engine**, and points it at a repository that never installed lean-flow. Six tasks: a rule-source reader generalised from §13 to any `## §N` table · the engine core, where the spec's **mark column** decides what is evaluated and a rule it states but the engine cannot answer is reported as `rule-unimplemented` rather than being absent · the first foreign-repo run (**§ Closed-when 1**) · migrating the §9 gates-signed family off its standalone checker as the consolidation proof, taking EPIC-002 D3's deferral off the shelf now its unblock condition is met · formally amending ADR-008 (**§ Closed-when 5**) · and the ownership-header family as the first *new* coverage. **T3 depends on T6, not only T2** — with two migrated rules a foreign-repo report says nothing, so the consumer proof is vacuous without coverage behind it. |

## Decisions

- **D1** — The engine is spec-driven: rules come from the EPIC-003 spec, not from code. A checker that
  hard-codes its rule cannot report a *level*, and drifts from the spec silently.
- **D2** — ADR-008's maintainer-only scope is amended or superseded here. **→ ADR pending**; the
  original reasoning (first executable code, aimed at this repo) is sound and simply predates the
  standard having consumers.
- **D3** — Conformance reports; it never blocks. ADR-011 already ruled that gates are human
  discipline, and a standard that fails a stranger's build on adoption is a standard nobody adopts.

## Open questions

- ~~Does the engine ship inside the plugin, or as a standalone script an adopter can run without
  installing lean-flow?~~ **ANSWERED at SPRINT-075's intake: both — one implementation with two entry
  points.** Settled at decompose rather than at G2 because it shapes every task in the Plan, and vague
  tasks were the alternative. The estimate above was wrong in a useful direction: **standalone turned
  out to be mostly already paid for.** SPRINT-074's checker takes a repo-dir argument and resolves its
  spec relative to its own location, so it runs today against a repository that has never heard of
  lean-flow — the "more work" half was largely done while proving something else. It is also the only
  option that satisfies § Closed-when 1 as written, which the in-plugin-only reading cannot.
  *Original text kept below, since the reasoning is the more useful record:* → the second is more
  useful and more work; ~~settle at the first member G2~~
  **deferred at SPRINT-072's promote to the *engine* sprint's G2 (its D2)**. The first member turned
  out to be the inventory-and-baseline sprint, and the answer depends on which rules prove mechanically
  checkable *without the plugin present* — which is what that sprint measures. Deferred to the evidence
  that decides it, which is not the same as parked (L-094).
- ~~Can 11 checkers' named findings survive consolidation?~~ **Answered in EPIC-002 D3 (SPRINT-063 T4)
  — cited, not re-decided**, as this row always said it would be. The 11 stand alone for now because
  they share no input model; consolidation was **deferred to this epic**, and its unblock condition is
  a documented behaviour rather than a signal to wait for: **D1's spec existing in a form a checker can
  read as its rule source.** So this epic inherits a live constraint — the ~82 named findings asserted
  across 16 retained fixture harnesses are the contract any engine here must preserve (L-058).
- ~~What does a partially-conformant repo see — a level, a percentage, or a list?~~ **Answered
  2026-08-16 (SPRINT-072 promote, owner ruling → its D1):** a **conformance level + the named findings
  preventing the next level + the judgment-required items**. Explicitly **no percentage, no score, no
  grade** — the row's own instinct was right, and the decisive argument is the third element: a
  percentage averages a *deliberate judgment-only boundary* together with a *real gap*, so the number
  goes up when the standard declines to automate something, which is exactly backwards. The engine's
  ADR records this; it is not re-decided there.

## Closed when

- [x] A repo that has never run lean-flow gets a conformance report naming its level
      — **DONE at SPRINT-075 T3.** `evals/run-foreign-repo-fixtures.sh` builds `acme-widget` — a
      four-file JS library — from nothing under `mktemp -d`, with **no lean-flow file copied in** (the
      harness asserts that mechanically, so a later edit that copies a template in fails loudly rather
      than quietly measuring our own shape). The engine, pointed at the shipped spec, returns a level,
      two named findings, and notes for the 33 judgment-required and 6 implementation-directed rules.
      Actionability was **proven, not asserted**: applying exactly what the two findings asked for takes
      the same repo to exit 0 with no FAIL line, and that is a retained case.
      **The run changed the engine, which is what it was for.** First contact returned 58 FAIL lines
      under "level: none — 41 finding(s) prevent Structural" against a repo with **two** defects: 56 of
      them were our own unimplemented rules, so the adopter's level moved with *our* roadmap rather than
      with their tree. `rule-unimplemented` is now its own verdict class (`GAP`) — still named on every
      report, so nothing is silently skipped (L-058) — held off the level arithmetic and the exit code,
      with engine coverage stated on its own axis. ADR-027 carries a refinement marker for the
      exit-code sentence this evidence overturned.
      **What this does *not* claim:** with **6 of 62** checkable rules implemented, a stranger's report
      is thin, and the dispositions most likely to be shape-bound (§2 placement, §6 tier doc-sets, §11
      ledgers) have not been exercised against a foreign tree at all. The triage recorded **0
      artefacts**, and that number is honest but early — the question is barely asked yet, and wants
      re-running as coverage grows rather than being treated as settled here.
- [ ] Every spec rule maps to a check, or is explicitly marked judgment-only in the spec
      — **SUBSTANTIALLY ADVANCED at SPRINT-073, still not ticked, and the remaining gap is now small
      and named.** The *"in the spec"* half is **done**: `spec/STANDARD.md` 0.4.0 marks every rule
      in-file (§14), so the judgment-only rules satisfy this condition outright. What is left is the
      other clause — *maps to a check* — for the **42** rules dispositioned `build`
      (`docs/research/conformance-dispositions.md`). A disposition is a decision to build, not a check;
      those land with the engine and with **TASK-228** for §13's five.
      **Two smaller residuals, both explicit:** the **12** rules dispositioned `scope-out` neither map
      to a check nor are marked judgment-only, so this condition may need re-reading once the engine
      exists — flagged rather than quietly satisfied; and ~~**2** rules (`S4.INDEX`, `S5.DISCARDLOG`)
      carry `?` and have no mark at all → **TASK-230**~~ **closed at SPRINT-074 T1** (spec 0.4.1:
      **100 classified · 0 unclassified**; `S4.INDEX` → Structural/mechanical + `build`,
      `S5.DISCARDLOG` → `implementation-directed`, the sixth to carry that mark).
      **Progress at SPRINT-074:** §13's five `build` rules now map to a real check, so the `build`
      remainder is **38 of 43**, not 42 — and that remainder is the engine's work, not another
      one-off checker's.
- [ ] Each check has a retained must-FAIL fixture that fails with its named finding
      — measured at SPRINT-072: the corpus is **22 harnesses (17 asserting) · 98 fixture cases · 46
      distinct named findings**, and that set is the **contract any engine must preserve**, not a
      target to re-derive (L-058 · TD-012). Whether *every* check has one is not yet established.
      **SPRINT-074 added the 23rd harness** — `run-attestation-fixtures.sh`, one retained must-FAIL per
      published §13 finding plus three guarding the *rule source* itself. It also demonstrated the
      method this condition should be judged by: green-on-first-run proves nothing, so the **rejected
      design was seeded** and the discriminating cases confirmed to fail (→ L-137)
- [x] Attestation is verified from git trailers, per task, without trusting a self-report
      — **DONE at SPRINT-074 T2** (TASK-228). `scripts/lib/check-attestation.sh` verifies §13's five
      mechanical rules from `git log` trailers on the task's own commit, against any repository, from a
      clone alone. *"Without trusting a self-report"* is the clause that was hardest and is met
      literally: an unsigned trailer is reported as `attestation-unsigned-claim-only` and the level
      stops at **Gated**, so the tool never concludes that the named human approved anything — §13c's
      claim-vs-proof boundary enforced rather than restated. The two `implementation-directed` rules are
      excluded by the spec's own Mark column, so the checker demonstrates them instead of emitting
      findings no adopter could clear.
      **What this does *not* claim:** the reference implementation is unsigned (673+ commits, `%G? = N`),
      so it reaches Gated and not Attested — a fact about this repo's signing, not a gap in the
      verification, and the checker reproduces §13d's worked example unprompted rather than rounding up.
- [x] ADR-008's scope is formally amended or superseded, not silently outgrown
      — **DONE at SPRINT-075 T5** ([ADR-027](../adr/ADR-027-executable-code-becomes-consumer-facing.md),
      2026-08-20). **Amended, not superseded** — ADR-008's hybrid decision (script for the mechanical
      rules, checklist for the judgment ones) is still live and unrevisited; only its *maintainer-only*
      premise is replaced. The CI sentence is **ruled explicitly** rather than left readable both ways:
      it means *lean-flow does not own your pipeline*, not *lean-flow emits nothing a pipeline can use*.
      What that commits us to is the engine's exit code as a documented contract (non-zero iff a `FAIL`
      line was printed, `rule-unimplemented` included); what it does not is any workflow file, action or
      obligation to keep an adopter's build green — ADR-011 and this epic's D3 (*reports, never blocks*)
      are untouched, and `qa-check.sh` still relays the engine's findings rather than gating on them.
