---
owner: Maintainer
last_updated: 2026-08-20
update_trigger: The standard's version changes
status: current
---

# lean-flow standard — Changelog

<!-- Prepend new versions — newest first. Append-only; never edit past blocks. -->

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
