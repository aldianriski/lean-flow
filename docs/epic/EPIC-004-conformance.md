---
epic: 004
slug: conformance
owner: Maintainer
last_updated: 2026-08-23
status: active
member_sprints: [072, 073, 074, 075, 076, 077, 078, 079]
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
| [SPRINT-075](../sprint/archive/SPRINT-075-the-conformance-engine.md) | The Conformance Engine | closed 2026-08-20 · `2edc606` | **Turned one checker into an engine, and learned from a stranger that the report was measuring the wrong thing.** Every `## §N` Conformance table is now read at runtime through a shared reader, and dispatch is driven by the spec's Mark column — proven in both directions with no code edit. Six rules answer today: §9's `gates_signed` pair, **migrated off its standalone checker with its findings byte-identical** (EPIC-002 D3's four-times-deferred consolidation question, closed for one family), and the ownership-header family as the first *new* coverage. **The contribution that was not planned is the important one:** the first run against a repo that never installed lean-flow returned 58 FAIL lines against a repository with **two** defects, because 56 were our own unimplemented rules — so an adopter's level moved with *our* roadmap. `rule-unimplemented` is now a `GAP`: named on every report (L-058 untouched), off the level and the exit code, with engine coverage on its own axis. § Closed-when **1** and **5** tick. **What it did not do:** coverage is **6 of 62** checkable rules, so § Closed-when 2 and 3 stay open and the `build` remainder is 39. |
| [SPRINT-076](../sprint/archive/SPRINT-076-coverage-and-the-bar.md) | Coverage, and Whether the Bar Is Right | closed 2026-08-21 · `74839bd` | **Doubled what the engine answers, and then ruled that doing so is not yet enough.** Coverage **6 → 13 of 62**: §4's ADR family (five rules, `S4.APPEND` the engine's first to read git history — a post-decision marker passes, a rewritten § Decision fails, verified against our own 27 ADRs including the two legitimately amended) and §2's placement pair, whose required set is derived from §2's own `Create ←` cells. Spec **0.4.2** writes down two exceptions §3 was already being checked against, cutting this repo's findings **56 → 32**. Fixed a latent defect under **21 of 100** rule ids (hyphens dropped from assertion-name resolution — a rule reported unimplemented with its assertion present) and a placement scan that had taken the gate past ten minutes. **The two contributions that were not code:** the artefact question, asked properly at last — **4 of 8** findings against a stranger are lean-flow's own loop surface, so A4 is confirmed and SPRINT-075's *0 artefacts* reads as the "barely asked" it called itself; and § Closed-when **3 established as a list** (24 of 24 checks guarded, 16 of 19 identities) after four sprints of being measured around. **What it did not do:** § Closed-when **2** was ruled and the **bar stands** — 19 of 62 map to a check, and both available ways to make it tick today were refused as amending a condition to fit what was built. Neither condition ticked; both now say why. |
| [SPRINT-077](../sprint/archive/SPRINT-077-the-decisions-epic-004-is-waiting-on.md) | The Decisions EPIC-004 Is Waiting On | closed 2026-08-21 · `5115885` | **Took the exit condition that was a decision away rather than a quarter away, and closed it.** § Closed-when **3 ticks** on two recorded rulings: the engine's three *invocation-error* identities are out of scope (they fire before any repository is evaluated and carry no §14 rule id), so identities read **16 of 16** — the denominator was wrong, not the numerator short; and the condition **adopts the wider property** (*a retained case asserts the named finding on input that must produce it*), because `S9.GATESABSENT` reports as a note and never FAILs by design, making the old must-FAIL wording unsatisfiable for it. **The prior wording is preserved in the condition**, so an amendment made while holding an audit that wanted the tick is auditable rather than invisible (L-088); ruled Retro, not ADR, and TASK-244 is closed by it. **The spec fix landed too** (TASK-243, spec **0.5.0**): §2's four loop rows name their substrate instead of saying `always`, so `S2.F-FILE` stops telling a stranger it owes `.claude/CONTEXT.md` — artefacts **4 of 8 → 0 of 4**, with **no code edit anywhere**, because the engine's discriminator already was that word. **The unplanned contribution:** a retained must-FAIL fixture had **decayed to a vacuous pass** — its seed hard-coded `TODO.md`, which the reclassification stopped creating, so the removal removed nothing and the guard confirmed nothing (→ L-146, TD-070 for the three §2 parsers behind it). **What it did not do:** § Closed-when **2** is untouched — ~32 rules, still no backlog tasks, now filed as **TASK-245**. Two tasks, 9 DoD, gate 154/0. |
| [SPRINT-078](../sprint/archive/SPRINT-078-the-checks-a-stranger-cannot-see.md) | The Checks a Stranger Cannot See | closed 2026-08-23 · `a7b5ffc` | **The largest coverage move the epic has made, and most of it was reach rather than new assertion code.** Coverage **19 → 30 of 62**; the engine's own line **13 → 24**. §13's five attestation rules **migrated off `check-attestation.sh` (deleted)** with findings byte-identical, established by diff before removal — they had worked and been fixture-guarded since SPRINT-074 and no adopter could reach one, because the checker was wired only into `qa-check.sh` while `conformance.sh` execs the engine alone. §2/§6's tier family answers as **one check with the tier a parameter**, and since §6 marks all four `split — detection judged`, the tier is **declared** in a new optional `.conformance-tier` rather than inferred; §2's README footer reads its required shape from §3's own example, which is what keeps `S3.README`'s scope-out from becoming a gap. **Two contributions that were not planned.** The migration needed a fourth verdict class — `hold`, which prevents a level without failing — or the single level ladder would have certified `Attested` over an unsigned attestation; and the newly-wired check **caught its own shipping commit**, whose message ended `Gate: 164 pass, 0 fail.` and so claimed a §13 attestation with neither signer nor evidence. That is the first time these five rules fired on real input. **Two spec gaps found and reported rather than guessed at:** §6 names three Multi-service docs §2 carries no row for (`tier-doc-set-underivable`, → TASK-255) and `DECISIONS.md` is reachable only inside a pattern row (→ TASK-256). **What it did not do:** § Closed-when **2** stays open — 30 of 62, and the ruling on the 11 `scope-out` rules (TASK-254) is the condition's other half, deliberately not raced against the coverage work. Three tasks, 15 DoD, gate 164/0. |
| [SPRINT-079](../sprint/SPRINT-079-the-undifferentiated-middle.md) | The Undifferentiated Middle | **active** — promoted 2026-08-23 | _(completed at close)_ Takes § Closed-when 2's **other half** — the ruling on the 11 `scope-out` rules, open since SPRINT-073 and named by SPRINT-076 T4 as a separate decision — **before** the coverage it can change, then §9 + §10 (30 → 39 of 62). §11 + §12 held for SPRINT-080, which then closes the epic. |

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
      — **RULED at SPRINT-076 T4, with evidence, and the bar STANDS.** This is the decision the sprint
      was built to make deliberately rather than by drift, and the ruling is *no change to the
      condition*: no ADR, because nothing was amended (§4's bar is not met by a decision to leave a
      condition alone); the Retro carries it.
      **The three numbers it was made with**, each derived at execution rather than trusted from the
      Plan: **coverage 19 of 62** checkable rules map to a check — 13 of those answered by the engine,
      which is exactly what assumption A5 predicted and what the engine's own `coverage:` line
      re-derived; **4 artefacts of 8** new findings against a repository that never installed
      lean-flow (T3, confirming A4 and moving the honest number off SPRINT-075's zero); and **16 of 19
      finding identities guarded**, 24 of 24 checks (T1).
      **Why it stands.** The clause has two halves and only one is met. The *"or is explicitly marked
      judgment-only"* half is **done** — 32 rules satisfy it outright and 6 more are excluded by mark.
      The *"maps to a check"* half is at **19 of 62**, with **32** rules dispositioned `build` and
      **11** `scope-out`. A disposition is a decision to build, not a check, and the 11 scope-outs
      satisfy *neither* half — a residual this row has flagged since SPRINT-073 and which is still
      open. Reading 19 of 62 as "every rule" requires either counting dispositions as checks or
      swapping in the roadmap's looser Phase A exit (*rules independently readable + conformance
      independently measurable*, both arguably true today). **Both were considered and rejected**: the
      roadmap's exit is a different claim, not this one, and amending an exit condition to fit what got
      built is the failure L-088 names — refused once already at SPRINT-075, on a DoD whose
      parenthetical was wrong.
      **What standing costs, stated so the choice is not free.** ~**32 rules** remain; SPRINT-076
      shipped 7, so **four to five more coverage sprints**, plus a separate ruling on whether the 11
      `scope-out` rules are checked, re-marked, or accepted as a third state the wording does not
      admit. **"The bar stands and EPIC-004 runs more coverage sprints" was named in the Plan as a
      legitimate outcome before the evidence existed, and it is the one that happened.**
- [x] Each check has a retained fixture asserting its named finding on input that must produce it
      — **TICKED at SPRINT-077 T2**, on the two rulings SPRINT-076 T1 refused to make inside the audit
      that would have benefited from them.
      **⚠ The wording changed. It used to read:** *"Each check has a retained **must-FAIL** fixture that
      **fails** with its named finding."* Preserved rather than overwritten, because re-wording a
      condition while holding an audit that wants it ticked is how a bar moves quietly (L-088) — this
      row refused two looser readings at SPRINT-076 on that ground. Judge the change on the record.
      **Measurement unchanged, re-derived not trusted** (A3 · L-130): `ls scripts/lib/check-*.sh` → 11,
      `grep '^assert_' conformance-engine.sh` → 13 = **24 of 24 checks guarded**, as SPRINT-076
      recorded; T1 added no assertion, which is what *no code edit* meant. → `fixture-coverage-audit.md`.
      **Ruling (a) — the three invocation errors are OUT of scope.** `usage` · `repo directory not
      found` · `reader-missing` fire **before any repository is evaluated**: they report that the tool
      was called wrongly, not that a tree violates the standard. No §14 rule id, no Conformance-table
      row, and no adopter can clear one by changing their repo. A condition about *checks* does not
      reach them. Confirms **A4** — and the alternative was live: ruled in scope, this row would not
      tick this sprint, named in advance as a legitimate outcome. Identities go **16 of 16**: the
      denominator was wrong, not the numerator short.
      **Ruling (b) — the condition adopts the wider property.** `S9.GATESABSENT` reports *NOT SIGNED*
      as a **note** and never FAILs by design — a sprint may legitimately sit unsigned between promote
      and the gate pass, so a FAIL would be false. The old wording was **unsatisfiable for it**: a
      defect in the sentence, not a gap in the corpus. The property the corpus satisfies is *«a
      retained case asserts the named finding on input that must produce it»*, must-FAIL being its
      common case, not its definition. **Not invented to fit the tick** — L-139 established it at
      SPRINT-075, when a `gates_signed` migration passed a byte-identical five-way finding-text diff
      while silently mislabelling *absent* as a **pass**; the fix (`absent-is-not-labelled-a-pass`)
      asserts the **verdict label** on input that must produce it, and would fail the old wording
      despite being the strictest case in its family.
      **Recorded as an amendment, not an ADR.** §4 wants hard-to-reverse **and** surprising **and** a
      real trade-off: this is reversible (epic live, prior wording above), unsurprising (L-139 first),
      and one-sided — the old sentence excluded a case *stricter* than those it admitted. Retro carries
      it. **TASK-244 closed by this row.** TD-067 (the token test accepting `G7`/`G99` against its own
      finding text) is untouched and stays open — a defect in a check, not in this condition.
      untouched and stays open — it is a defect in a check, not in this condition.
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
