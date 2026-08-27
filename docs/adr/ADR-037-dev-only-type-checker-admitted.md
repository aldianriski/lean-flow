---
id: ADR-037
tags: [tooling, process]
domain: governance
status: accepted
related: [ADR-035, ADR-034, ADR-027, ADR-008]
---

<!-- One ADR per file · append-only (never edit a decided ADR — mark it deprecated/superseded) · WHY only. -->

# ADR-037 — A dev-only type checker is admitted; zero-dependency binds runtime, not the toolchain

- **Status:** accepted (2026-08-27)
- **Amends:** [ADR-035](ADR-035-typescript-bun-reference-engine.md) § *What the workspace
  deliberately does NOT have* — the **Zero dependencies** clause. ADR-035's decision still governs
  everything else; only its treatment of a **development-time** dependency is amended.
- **Deciders:** Maintainer
- **Context driver:** `TD-101` — nothing in this repository evaluates a TypeScript type, so every
  guarantee written as "enforced by a TYPE" is enforced only in an editor, and a sprint of TypeScript
  tasks would satisfy its own type-level acceptance with unchecked code.

## Context

ADR-035 deferred type checking deliberately, with a stated mechanism:

> **Zero dependencies.** … `plugin install` copies the repo verbatim, so **any** dependency here would
> land in every consumer's cache. Type *checking* needs `typescript` and is deferred until something
> needs it.

Two things have changed since, and one thing turned out not to hold.

**Something now needs it.** ADR-035 deferred until "something needs it". `TD-101` is that something,
and it is `severity: high`, open four sprints, and never routed to the Backlog until SPRINT-091's
promote governance review escalated it. Its recorded impact is not hypothetical: it names
**SPRINT-085's closing claim** — *"absence vs emptiness is enforced by a TYPE, not a convention"* — as
real in an IDE and **absent from every automated path**, and SPRINT-087 T4's DoD leans on the same
guarantee. That is L-105's family: an absent guard wearing the shape of a present one, in the more
dangerous variant where the sprint record already describes it as the strong form.

**The stated mechanism does not bind a development-time dependency.** `.gitignore:2` ignores
`node_modules/`; `git status` does not see it. `plugin install` fetches the marketplace repository, and
a gitignored directory is not in that repository. What would ship to a consumer is a `devDependencies`
entry and a lockfile — neither of which installs anything for someone who never runs an install. The
consumer-facing surface ADR-035 was protecting is therefore untouched by this amendment. **Recorded as
the basis of the ruling, not as a measurement:** `plugin install`'s copy semantics were reasoned from
`.gitignore` and marketplace-fetch behaviour, not verified from inside this repository, and ADR-035's
authors may have had grounds not written down. The ruling was taken on that stated basis.

**ADR-035 set this bar itself.** It closes by naming the stance as one that *"will come under pressure
at H05, where a Markdown AST parser is the first genuinely useful library; **the bar is consumer
impact, not purity**."* This amendment applies that bar rather than overriding it.

## Decision

**Zero-dependency binds what a consumer runs, not what a maintainer checks with.** A type checker is
admitted as a **development-only, gitignored** dependency and wired into the gate, where its FAIL is a
real FAIL.

The clause is narrowed, not deleted. It continues to forbid, exactly as before: any **runtime**
dependency in the engine or `packages/contracts`; any requirement that a consumer install a toolchain
(ADR-035 **D6**, untouched); and any dependency whose absence would leave a consumer unable to use the
plugin. What it no longer forbids is a checker that runs on a maintainer's machine and in the gate, is
absent from git, and reaches no consumer.

A type check that silently passes when the checker is absent is **explicitly rejected** as a way to
honour the old clause. A check that cannot fail is the precise defect `TD-101` exists to name, and
would convert a recorded gap into a green line reporting nothing (L-105 · L-058).

## Consequences

**Positive:** every guarantee this repository states as "enforced by a type" becomes true of an
automated path rather than of an editor. `TD-101` is resolvable. `tsconfig.base.json`'s strict settings
— `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `verbatimModuleSyntax` — stop
being configuration for a checker that cannot run. EPIC-014's remaining sprints, all TypeScript, gain a
floor they currently lack, and SPRINT-085's and SPRINT-087's type-level claims become checkable rather
than retroactively weakened.

**Negative (trade-offs accepted):**
- **The repository is no longer install-free for a maintainer.** A lockfile and `node_modules` now
  exist locally; a fresh clone needs an install step before the gate is fully runnable. ADR-035's
  cleanest property is genuinely lost, and it was a real property, not a slogan.
- **The gate gets slower**, on a gate already carrying `TD-090` (`severity: high`) for being too slow —
  and SPRINT-091 T2 is measuring that same gate in this same sprint. The type-check leg's cost must be
  recorded in the timing log alongside T2's Round rather than absorbed silently.
- **A second toolchain version to keep coherent.** `typescript` acquires its own upgrade cadence beside
  Bun's, with no lockstep check covering it — unlike the four `*-plugin/*.json` manifests, which have one.
- **The reasoning rests on unverified `plugin install` semantics** (above). If that turns out wrong, the
  consumer-facing premise fails and this ADR is the row to revisit, not the wiring built on it.

## Alternatives considered

| Option | Why rejected |
|---|---|
| Leave ADR-035 standing; keep types editor-only | Leaves `TD-101` open and every type-level DoD in EPIC-014 unverifiable. ADR-035 deferred "until something needs it" — this is that, and declining would read the deferral as a permanent ban it never claimed to be |
| Gate the check on `tsc` being present, so it no-ops when absent | Satisfies the letter and produces the exact failure being fixed: a check that cannot fail, reporting green (L-105). Rejected in the sprint log before the ruling, and again here |
| Run the check only in CI, never in the gate | This repository has no CI running the gate; in practice it would run when someone remembered. A guard whose firing depends on memory is not a guard |
| Vendor a type checker into the tree to avoid a dependency entry | Trades a gitignored `node_modules` for a committed one — strictly worse for the consumer surface ADR-035 protects, and unmaintainable |
| Amend by editing ADR-035 in place | §4 is append-only; a decided ADR is never edited. The precedent is ADR-008 ← ADR-027: a new ADR decides, and the amended one gains a pointer |
