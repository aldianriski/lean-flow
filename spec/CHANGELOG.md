---
owner: Maintainer
last_updated: 2026-08-23
update_trigger: The standard's version changes
status: current
---

# lean-flow standard — Changelog

<!-- Prepend new versions — newest first. Append-only; never edit past blocks. -->

## 0.7.0 — 2026-08-23

**MINOR — §2 carries rows for the tier doc set §6 names, so Multi-service stops being a hole in the
standard.** §6 has named three Multi-service documents since it was written — *service registry ·
cross-service dependency map · global decisions index* — and §2's `docs/` tree carried a row for **none
of them**. A conformance engine deriving a tier's required set from §2 therefore had nothing to derive,
and reported `tier-doc-set-underivable`: a finding about **the standard**, which no adopter could ever
clear by changing their repository.

**Two rows added, one claim withdrawn.**
`architecture/service-registry.md` and `architecture/service-dependencies.md` join §2's tree at Tier
`multi-service`. The third — *global decisions index* — is **not a new document**: it is Medium's
`DECISIONS.md` at umbrella scope. Tier doc sets are **exact-rank increments**, not a cumulative
restatement, so a Multi-service repo already owes `DECISIONS.md` through Medium and naming it again
here owed it twice. §6's row says so now, and names a pair rather than three.

**Why MINOR on 0.5.0's test — *does anything an adopter satisfies today change?*** It does, in both
directions. A repo declaring `multi-service` stops seeing an unclearable finding about the standard and
starts seeing two named files it can create; the same repo now owes two documents it did not before.
No rule is added — a §2 row is a **parameter set, not a rule** (SPRINT-072), so classification stands
at **100** and checkable stands at **51**.

**Verified on the path that exercises it, because this repository cannot dogfood it** (L-016): a
scratch umbrella repo declaring `multi-service` reported `tier-doc-set-underivable` before and
`tier-doc-set-incomplete` naming both files after — and creating exactly those two files takes it to
*"all 2 unconditional Multi-service doc(s) present at their canonical §2 path"*. Actionability proven,
not asserted.


## 0.6.0 — 2026-08-23

**MINOR — the conformance model gains two marks, and eleven rules stop being reported as gaps they
were never going to be.** §14 adds **`restated`** (7 rules) and **`standard-directed`** (4). No rule is
added, removed or reclassified out of the standard: **100 classified stands**, and every one of the
eleven is still stated, still marked, still readable. What changes is the set a tool evaluates against
a repository — **checkable goes 62 → 51**.

**The defect this fixes.** Both categories were already *described* — §14 says §8 "restates seven rules
under a second name, inflating any denominator that ingests it", and the reference implementation's
disposition register carried the same finding at rule scale plus a four-rule class that reads §2's own
table. But a description is not a mark, and the engine dispatches on the Mark column. So all eleven
carried `mechanical`, and every conformance report — including one run against a repository that never
installed lean-flow — listed them as `rule-unimplemented`: *checks the standard owes you and has not
written yet*. Seven of them are checked, under another id. Four can never be checked against any
adopter's tree. Saying so is the fix.

**`restated` — the constraint is carried by another rule.** `S7.ORPHAN` → `S3.SCHEMA` · `S7.PERSON` →
`S1.LAW2` · `S7.OUTSIDE` → `S2.F-FILE` · `S7.LEDGER` → §11 · `S2.F-ARCHIVE` → §11's ledger ·
`S9.GATESINFILE` → `S9.GATESWELLFORMED` · `S3.README` → `S2.R-README`. This is **§8's answer applied
one level down**: §8 contributes 0 for exactly this reason, and these seven do the same thing across
sections rather than within one. Each names its covering rule, so *covered elsewhere* is a report line,
not a footnote.

**`standard-directed` — governs this document, not a repository.** `S2.R-CAPEXACT` and `S2.R-DESIGN`
read §2's own table, which an adopter does not have. `S2.R-SKILLCAP` and `S2.R-SKELETON` govern
`SKILL.md`, a plugin artifact — an adopter with no skills would collect findings for files they were
never expected to have. The same failure `implementation-directed` prevents, one category out.

**Why MINOR and not PATCH, on 0.5.0's own test: *does anything an adopter satisfies today change?***
It does. An adopter's report loses eleven `rule-unimplemented` lines and gains eleven named exclusions.
No tree changes and no level moves — the reference implementation's FAIL count is unchanged at 34 —
but what the report *says* about their repository changes, which is the line PATCH may not cross.

**The cost, stated rather than buried.** A smaller checkable set makes any exit condition resting on
coverage arithmetic easier to satisfy. That is real, it is why this is recorded as an ADR rather than a
tidy-up, and it is accepted because the alternative is a standard that tells adopters it owes them
eleven checks it has decided never to write.


## 0.5.0 — 2026-08-21

**MINOR — §2 stops telling every repository it owes the lean loop's own files.** Four rows are
**reclassified** from unconditional to substrate-conditional: `AGENTS.md`, `TODO.md`,
`.claude/CLAUDE.md`, `.claude/CONTEXT.md`. No rule is added or removed — §2 still publishes 21 — and
no checker changed, because the distinction is read from the table rather than coded.

**Why MINOR and not PATCH, stated rather than inherited from 0.4.2.** 0.4.2 was PATCH on an explicit
test: *nothing an adopter satisfies today changes.* That test fails here in the direction that matters.
Four obligations are **lifted**, so an existing adopter's report loses up to four `core-file-missing`
findings and their conformance level can move without their tree changing at all. §2's own
`spec/STANDARD.md` row names the trigger in as many words — *a rule is added, amended **or
reclassified***. A version that changes what a report says about an unchanged repository is one an
adopter must re-read §2 to understand, which is the line PATCH is not allowed to cross. The relaxation
being *in the adopter's favour* does not make it invisible: a lifted obligation is still a changed
contract, and a tool pinned to 0.4.x will disagree with one pinned to 0.5.0 about the same tree.

- **The rows now name their substrate** — *an AI assistant reads this repo* · *work is tracked in-repo*
  — instead of saying `always`, exactly as §6 gates its substrate-conditional rows: **skipped, not
  owed, when the substrate is absent**. A repository tracking work in GitHub Issues already has a
  backlog; one with no AI assistant does not owe an assistant's context files.
- **Machine-readable by construction.** The required set is derived from the `Create ←` cell itself, so
  a row moving between populations changes every tool's output with **no code edit**, and no tool holds
  a list of loop files it must be taught to update — the mechanism `--spec` already proves for §14's
  Mark column. This is also why the fix belongs in the standard: a checker that narrows a rule the
  standard states is deciding a question the standard owns (§3 · L-058).
- **Measured, not asserted.** Against a four-file JS library that never installed lean-flow,
  `S2.F-FILE` raised 8 `core-file-missing` findings, **4 of them artefacts its owner could not act on**.
  Post-change: **4 findings, 0 artefacts**; whole report 10 → 6 lines. Recorded in
  `docs/research/conformance-dispositions.md` § Artefacts.
- **Unchanged for a repo that does run the loop.** Caps are read from the `Cap` cell, not `Create ←`,
  so all four keep their line caps; their presence is owed via §6's tier gate once the substrate is
  detected.

## 0.4.2 — 2026-08-20

**PATCH — two exceptions §3 was already relying on are now written down.** Both were being enforced
in code while absent from the standard, which is the wrong way round: a rule a checker applies and the
spec does not state is unreviewable, and an adopter reading §3 could not have predicted either.
Nothing an adopter satisfies today changes and no rule was added — §3 still publishes three — so this
is not a version that asks anyone to re-read the standard (ADR-023).

- **ADR exception (§3).** An ADR carries §4's ADR-009 knowledge metadata (`id` · `tags` · `domain` ·
  `status` · `related`) instead of §3's four-field header. The blocks answer different questions, and
  a decided ADR is append-only, so `last_updated`/`update_trigger` describe a lifecycle it does not
  have. Reporting ADRs against §3 told an adopter to break the standard's own template — 27 findings
  on the reference implementation alone. Ruled at SPRINT-075 T6 and named in the report from then;
  stated here now, so the checker cites the standard rather than carrying the ruling in a comment.
- **Exploratory-tree exception (§3).** A tree the repository **declares** exploratory — `governed:
  false` in its own index/README frontmatter — is input to decisions, not governed documentation. A
  **declaration, not a path**: fixing a directory name would exempt only repositories that chose ours.
  Opt-in, so silence still means governed and nothing is exempted by accident; and visible, since the
  declaration sits in the tree it exempts.

## 0.4.1 — 2026-08-17

**Changed — the last two unclassified rules are ruled, and a count that contradicted itself is fixed.**
Nothing here adds an obligation: both rules were already stated and already binding at 0.4.0. What
changes is that a tool reading this document can now decide what to do with them.

- **`S4.INDEX`** (`DECISIONS.md` is a thin index linking the ADRs) → **Structural · mechanical**. It
  binds a repository artifact and is decidable from the tree.
- **`S5.DISCARDLOG`** (the `"Skipped: … explains HOW"` line) → **`implementation-directed`**. It is a
  *generator's* output format, not repository content — an adopter's repo offers nothing to evaluate it
  against. This is the bucket §14 says an engine must never test against an adopter, so the ruling
  matters more than its size: guessing it the other way emits findings nobody can clear.
- **§13's prose said `three` of its rules are `implementation-directed`; its own Conformance table, §14
  and the reference implementation's register all said two.** Corrected to two at both sites. The
  arithmetic was decisive rather than a judgement call — §13 states 5 mechanical of 7, and 5+3=8.

**Counts, re-derived: 100 classified · 0 unclassified** (was 98 · 2), and `implementation-directed` is
**6 carried, none pending** (was 5 + 1). §4 is 7 rules, §5 is 2.

**No rule carries `?` at this version.** The mark stays defined, because a rule added to a later version
arrives unruled and that is the honest state for it.

**PATCH, not MINOR, deliberately.** Marking a rule that was already stated adds nothing an adopter must
satisfy. Calling it MINOR would tell every adopter to re-read a specification that gained no new
obligation — and a version number that cries wolf is worse than one that moves quietly.

## 0.4.0 — 2026-08-16

**Added — every normative rule now carries its conformance level and whether it is checkable, in the
spec itself.** Each `## §N` ends with a **Conformance.** table listing that section's rules by a stable
id (`S13.TRAILERS`, `S2.F-CAP`, …), its level (Structural · Gated · Attested) and its mark. A new **§14**
defines the model. Nothing existing was reworded, removed or renumbered — the prose you pinned at 0.3.0
still reads identically; this adds a layer beside it.

**Why it matters if you are building against this standard.** Until now the classification existed only
in the reference implementation's research notes, so a tool could not ask the spec what was checkable —
it had to hard-code an answer and drift silently. Now the spec is the rule source. Concretely:

- **Four marks, and the distinction between the middle two is the point.** `mechanical` (a tool decides
  it) · `judgment-only` (**not checkable in principle** — the standard is choosing a human) · `split` ·
  `implementation-directed`. A `judgment-only` rule is **not debt and never will be**; a `mechanical`
  rule with no checker is a gap someone can close. Collapsing them into one "not covered" number
  reports the standard's deliberate boundaries as failures.
- **`implementation-directed` rules must never be evaluated against your repository.** Five carry it,
  and two are §13's inference constraints (*a verifier may not conclude approval from an unsigned
  trailer* · *author identity is not the attestation*). They bind a tool, not a repo. A checker that
  reads them as repo rules emits findings **you could never clear**.
- **No percentage, no score, no grade — this is now stated normatively in §14.** A ratio averages a
  deliberate judgment-only boundary with a real gap, so the number *improves* when the standard
  declines to automate something. Report a level, the named findings blocking the next level, and the
  judgment-required items.
- **Rule ids are stable across versions and are what a finding names**, so a conformance report stays
  comparable as this standard evolves. An id is retired, never reused.
- **A `?` mark is a real state**, not a silent skip: `S4.INDEX` and `S5.DISCARDLOG` are rules this spec
  states whose classification has not been ruled. A tool reporting on them says so.

**Counts, derived from this document:** **98 classified rules and 2 unclassified.** §8 contributes
**zero** — it restates seven rules stated elsewhere, and an engine ingesting it double-counts them.
**§13 is the most mechanical section** (5 of 7); **§10 is the least** (4 of 10), because "was the
governance checkpoint honestly run?" is unobservable in principle. If you assumed Attested was the hard
level to check, it is not — **Gated is**.

Minor rather than patch: this adds a normative layer (§14 and the per-section tables) and a readable
property that did not exist before. It removes nothing and changes no existing obligation, so a repo
conformant at 0.3.0 remains conformant at 0.4.0 — what changes is that its report can now name which
rules it was judged against.

## 0.3.0 — 2026-08-16

**Added — §9 now defines the evidence the Gated conformance level is checked against.** Found by
auditing the spec as a tool-builder would read it (SPRINT-070 T3, EPIC-003 § Closed-when 5): ADR-024
defines **Gated** as "human approval is recorded against the work … checkable from the repo's own
planning records", and the spec did not define the records. Two concrete gaps, both closed here:

- **`gates_signed: <GATE>[,<GATE>…] @ <sha>`** is now specified in §9 — the field, its format, and
  the three properties that carry the weight: **absence means NOT SIGNED** and is never approval; the
  record lives in the sprint file rather than in the approving session, because a sign-off held only
  in a transcript is invisible to anything reading the repo; and a malformed record is worse than none
  because it looks like evidence. §13 already referenced this field as living in §9 — that
  cross-reference now resolves.
- **The `*Verify: …*` clause on a DoD criterion** is now specified. Gated requires that criteria name
  how they were verified, and nothing in the spec said what that looks like, so a tool could not tell
  a mechanically-checked criterion from a judged one. A criterion naming no check is a judgment tick
  and says so.

Minor rather than patch: this adds definitions and a new readable property, and changes no existing
rule. `plugin.json` and the other three manifests do not move with it (EPIC-003 D3).

## 0.2.0 — 2026-08-16

**Added — §13 HITL attestation (git-native).** The wire format for the **Attested** conformance level
that ADR-024 defined but deliberately left unspecified: three trailers on the task's own commit
(`Gate-Signed-By:` · `Gate:` · `Evidence:`), what they mean, and how they relate to the sprint-level
`gates_signed:` record. Closes EPIC-003 D2, pending since ADR-018 (SPRINT-070 T1 · ADR-025).

Two things §13 states that an implementation is likely to want softened, so they are called out here
as well. First, **the trailer carries the sprint-level approval onto each covered commit; it does not
raise approval to a per-task cadence** — the gain is verifiability, not frequency, and ADR-018's
original framing of this as a granularity increase was corrected at SPRINT-070's promote. Second,
**an unsigned trailer is a claim, not proof**: it is plain text anyone able to commit can write, so
Attested is not reachable by trailers alone. §13's worked example is therefore drawn from a real
commit in the reference implementation and shown in its true unsigned state (`%G?` = `N`, as are all
673 commits in that repository's history) rather than illustrated with a signature that does not
exist.

Also in §13: **`Evidence:` should carry `@ <sha>`.** A trailer is written into immutable history but
the path it names is not immutable, and a bare path stops resolving the moment planning records are
archived or renamed — which happened to §13's own worked example during the very close that wrote it.
The sha-qualified form still resolves; a bare one would already be dead.

Minor rather than patch: this adds a section and a new obligation for anyone claiming Attested, and
changes no existing rule. `plugin.json` and the other three manifests do not move with it —
the spec versions independently (EPIC-003 D3).

## 0.1.0 — 2026-08-16

**Extracted.** The LEAN DOCUMENTATION STANDARD moved out of
`skills/lean-doc-generator/references/DOCS_Guide.md` into this versioned `spec/` tree as
`spec/STANDARD.md`, so an adopter can take the standard without taking the plugin (EPIC-003,
ADR-023, SPRINT-069 T2). Content moved verbatim — no rewording, reorganisation, or rule change.
The spec now versions independently of `plugin.json` (EPIC-003 D3), starting at 0.1.0 rather than
1.0.0 because four of EPIC-003's five Closed-when conditions are still open.
