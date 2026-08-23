---
id: ADR-028
tags: [process, tooling]
domain: governance
status: accepted
related: [ADR-024, ADR-027, ADR-023]
---

# ADR-028 — Two marks for rules an adopter can never clear

- **Status:** accepted (2026-08-23)
- **Deciders:** Maintainer
- **Context driver:** every conformance report told adopters the standard owed them eleven checks it had already decided never to write.

## Context

The conformance model (§14, ADR-024) marks each rule with whether a tool can decide it: `mechanical`,
`judgment-only`, `split`, `implementation-directed`. Those four cover *checkable*, *not checkable in
principle*, *half each*, and *aimed at the tool rather than the repository*. Eleven rules fit none of
them, and carried `mechanical` by default.

They fit none of them for two distinct reasons, both already written down before this decision — just
not anywhere a tool could read:

- **Seven restate a constraint another rule carries.** `S7.ORPHAN` → `S3.SCHEMA` · `S7.PERSON` →
  `S1.LAW2` · `S7.OUTSIDE` → `S2.F-FILE` · `S7.LEDGER` → §11 · `S2.F-ARCHIVE` → §11's ledger ·
  `S9.GATESINFILE` → `S9.GATESWELLFORMED` · `S3.README` → `S2.R-README`. §14 already names this exact
  failure one level up: §8 contributes **0** rules because *"it restates seven rules under a second
  name, inflating any denominator that ingests it."* These seven do the same thing across sections
  rather than within one.
- **Four govern the standard document, not a repository.** `S2.R-CAPEXACT` and `S2.R-DESIGN` read §2's
  own table, which an adopter does not have. `S2.R-SKILLCAP` and `S2.R-SKELETON` govern `SKILL.md`, a
  Claude Code plugin artifact — an adopter with no skills would collect findings for files they were
  never expected to have.

**Measured blast radius.** Both classifications existed in `docs/research/conformance-dispositions.md`
as a `scope-out` bucket, and the engine could not see them: it dispatches on `spec/STANDARD.md`'s Mark
column (D1 — the spec is the rule source), so all **eleven of eleven** reported as `rule-unimplemented`
on every run, including runs against a repository that never installed lean-flow. A single
`sh conformance.sh .` before this change produced **38 GAP lines**; eleven of them were decisions, not
gaps. This is the same failure shape as `gates_signed` recorded only in a launching transcript
(L-099): a fact that exists, in a place the reader cannot reach.

**Why now.** SPRINT-076 T4 ruled EPIC-004's coverage bar stands and named these eleven as a residual
satisfying *neither* half of its exit condition — open since SPRINT-073. Every coverage sprint since
has grown the checked set around them.

## Decision

**§14 gains two marks, and the eleven rules carry them: `restated` (7) and `standard-directed` (4).**

A `restated` rule's constraint **is** checked — under the id named beside it — so it is neither a gap
nor a judgment call, and a report says *covered elsewhere* rather than *unchecked*. A
`standard-directed` rule governs this document or the plugin shipping it, never an adopter's tree; it
is `implementation-directed`'s neighbour, **one category out** — those constrain a tool's inference,
these constrain the standard itself.

Chosen over the alternatives because it puts the disposition **where the engine reads it**. That is
not a convenience: D1 makes the spec the rule source precisely so a classification cannot drift from
what the tool does, and a disposition living in a research doc had already drifted for six sprints
without anyone seeing it, because nothing about the report looked wrong.

The engine gains one `case` arm per mark, each with a retained fixture, plus a must-FAIL case asserting
that **no** rule in the shipped spec falls to the `unrecognized mark` catch-all — because the graceful
degrade the catch-all provides is honest but reads to an adopter as a defect in the standard.

## Consequences

**Positive:** an adopter's report distinguishes *we have not written this check yet* from *this
constraint is checked under another id* and *this rule was never about your repository*. GAP lines drop
**38 → 27** with no change to any finding: the reference implementation's FAIL count is unchanged at
**34**, so nothing about any repository's actual conformance moved. The eleven are named on every
report rather than silently skipped (L-058), and `conformance-dispositions.md` no longer holds a
bucket the tool cannot see.

**Negative (trade-offs accepted):** the checkable set shrinks **62 → 51**, which makes EPIC-004's
§ Closed-when 2 — *"every spec rule maps to a check"* — easier to satisfy, by a change made inside the
epic that wants it ticked. That is the real cost and the reason this is an ADR. It is accepted on three
grounds: **classification is unchanged at 100**, so nothing left the standard, only the set a tool
evaluates against a tree; the condition's prior wording is preserved in place in the epic (L-088), so
the amendment is auditable rather than invisible; and the alternative is a standard that lies to
adopters about what it owes them. A second, smaller cost: two more marks is more model to learn, and
§14 is the legend everyone reads first.

## Alternatives considered

| Option | Why rejected |
|---|---|
| Leave them `mechanical`, keep the dispositions in the register | The status quo, and the defect. The engine cannot read the register, so every adopter keeps being told the standard owes them eleven checks. Six sprints of evidence that a disposition outside the spec does not bind. |
| Fold the four into `implementation-directed` | Mislabels them. That mark means *constrains a tool's inference*; these constrain the standard document. The register itself called them "one category out", and collapsing the two categories is the error §14 exists to prevent. |
| Re-mark all eleven `judgment-only` | The cheapest route to ticking § Closed-when 2, and dishonest: the seven `restated` rules are mechanically checked *today*, just under another id. §14's central claim is that `judgment-only` and "mechanical but unchecked" must never be collapsed; this would collapse a third thing into them. |
| Build checks for all eleven | Double-counts seven constraints — the denominator inflation §14 names — and is impossible for the four, which read artifacts no adopter has. |
| Amend § Closed-when 2 alone, without new marks | Moves the bar without fixing the report. The adopter-facing defect is the reason to act; a condition reworded around it leaves every conformance run still naming eleven false gaps. |
