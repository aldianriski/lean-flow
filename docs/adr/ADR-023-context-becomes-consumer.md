---
id: ADR-023
tags: [process, docs, governance]
domain: governance
status: accepted
related: ADR-018, ADR-012, ADR-007
---

# ADR-023 — CONTEXT.md becomes a consumer of the extracted spec

- **Status:** accepted (2026-08-15)
- **Deciders:** Maintainer
- **Context driver:** EPIC-003 open question 3 — settle what `.claude/CONTEXT.md` becomes *before*
  the first extraction commit, not during it (SPRINT-068 T1 / TASK-198; the pre-extraction ruling
  ADR-018 names as how its accepted migration risk gets retired).

## Context

ADR-018 extracts the lean-flow specification into a versioned `spec/` tree. Today
`.claude/CONTEXT.md` declares itself the SSOT for the loop, roster, gates, modes and sprint model —
but the spec ADR-018 describes spans `DOCS_Guide.md`, `CONTEXT.md` and four skills, each restating
parts of the others. Extraction forces the question: does CONTEXT.md stay the authority (spec
derived from it), or does the spec tree become the authority (CONTEXT.md cites it)? Leaving the same
rule stated in both places mid-migration is the second SSOT that LAW 4 and the anti-SSOT rule
forbid; ADR-018 accepted that risk explicitly, conditional on this ruling landing first.

## Decision

**The extracted `spec/` tree is the SSOT for every standard-owned rule; `.claude/CONTEXT.md`
becomes a consumer of it.** CONTEXT.md remains the SSOT only for genuinely project-local facts —
this repo's skill roster, streams, model-tier mapping, and pointers — and *cites* the spec for the
rules it used to state, held to the same bar EPIC-003 sets for skills ("no skill restates a rule the
spec owns — each cites it instead").

**Migration-window mitigation — move+cite atomic commits.** Every extraction commit moves a rule's
text into `spec/` and replaces its old home with a citation *in the same commit*. No commit in
history leaves a rule stated in two places; the two-places window is bounded to zero at commit
granularity. Each EPIC-003 member sprint's review carries "is any rule now stated twice?" as an
explicit check, and CONTEXT.md shrinks with each extraction (132/150 at ruling time — the cap
pressure relieves rather than grows).

## Consequences

**Positive:** the pinnable artifact and the authoritative text are the same thing — adopters cite
what the maintainer edits; D3's independent spec versioning is coherent (the spec moves only when
the standard changes, never when repo-local content churns); CONTEXT.md's cap stops being a
constraint on the standard's growth.

**Negative (trade-offs accepted):** session priming loses one-file locality — an agent reading
CONTEXT.md must follow citations into `spec/` for the rules' full text, and until EPIC-004's
conformance engine exists nothing machine-checks that a citation's target still says what the citer
assumes. A charter inversion of a declared SSOT is hard to reverse once extraction commits stack on
it.

## Alternatives considered

| Option | Why rejected |
|---|---|
| CONTEXT.md stays SSOT; `spec/` generated/derived from it | The pinnable standard becomes a build product of a 150-line-capped repo-local file that was never the whole spec's home anyway — "SSOT-stays" would *promote* CONTEXT.md to a role it does not hold today, and the artifact adopters pin would move with repo-local churn, defeating EPIC-003 D3. |
| Dual authority, synced by convention | The permanent form of the exact two-places state this ruling exists to prevent (LAW 4). |
