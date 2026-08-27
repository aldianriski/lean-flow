---
id: ADR-035
tags: [tooling, process]
domain: governance
status: accepted
related: [ADR-037, ADR-034, ADR-033, ADR-027, ADR-023, ADR-012, ADR-008]
---

# ADR-035 — TypeScript on Bun becomes the reference engine; the Standard stays Markdown

- **Status:** accepted (2026-08-24)
- **Scope amended by:** [ADR-037](ADR-037-dev-only-type-checker-admitted.md) (2026-08-27)
  — the decision below still governs. Its **Zero dependencies** clause is narrowed: it binds what a
  consumer runs, not what a maintainer checks with, so a dev-only gitignored type checker is admitted.
  Runtime dependencies and D6 (no consumer toolchain) are unchanged.
- **Deciders:** Maintainer
- **Context driver:** a markdown-and-skills plugin is growing a compiled toolchain. That is
  hard-to-reverse, surprising to anyone who knows this repo, and buys real things at a real price —
  the three conditions §4 asks for.

## Context

The Shell implementation proved the rules and is now the wrong foundation: **57 scripts, 12,718 LOC**,
dominated by `scripts/lib/conformance-engine.sh` (3,111) and `scripts/qa-check.sh` (838), with Markdown
treated as semi-structured database text through repeated `grep`/`awk`/`sed`/`git` process spawning and
serial QA orchestration. Every new rule family pays that cost again.

**SPRINT-083 T1 produced the sharpest evidence, and it was not the line count.** The compatibility
contract could freeze the rule-ID surface (100 ids, `cmp`-verified snapshot) but **not** the Finding-ID
surface — because finding ids are free text inside message strings, emitted through four-plus distinct
shapes, at positions that vary per call site. Three anchored extractions returned 4, then 14, then a
78-token wide net mixing real ids with prose. **A system whose own error vocabulary cannot be
enumerated is not one more refactor away from a typed contract.**

## Decision

**TypeScript running on Bun becomes the reference implementation of lean-flow's conformance and QA
semantics. `spec/STANDARD.md` remains the normative source, in Markdown, unchanged.**

Three commitments make that separation real rather than stated:

1. **The Standard is not the engine.** The engine is a *reference representation* and must stay
   replaceable without changing lean-flow's meaning. Nothing normative moves into TypeScript.
2. **Strangler, not rewrite** (ADR-034 · EPIC-014 D2). Shell holds authority per rule family until all
   retained must-FAIL cases pass, all controls pass, differential parity passes, intentional
   differences are *ruled*, and performance is measured. Never "most tests look green."
3. **The dependency direction is a test, not a convention** (SPRINT-083 T3). Domain imports no
   adapter, no `apps/`, no Bun API.

### What the workspace deliberately does NOT have

- **Zero dependencies.** Bun executes TypeScript directly, so there is no install step and no
  `node_modules`. This is the consumer-facing decision (L-015): `plugin install` copies the repo
  verbatim, so **any** dependency here would land in every consumer's cache. Type *checking* needs
  `typescript` and is deferred until something needs it — `bun build` and `bun test` parse the tree
  today, which is what T3's seeded-break proof actually requires.
- **No `version` field in `package.json`.** Four `*-plugin/*.json` manifests already carry the version
  in lockstep; a fifth number would be a second SSOT that drifts from the one it copied (ADR-032).
- **No framework CLI stack, no dashboard code, no DB/queue/broker** (V3 §38).

### The manifest changes gate discovery, and that is the risky part

`package.json` is **the first rung-1 hit in this repository's history**. `dispatch.md` § System verify
ranks a package manifest *first* and `.gate-command` *last*, because "anything discoverable wins over
it" — so the manifest silently outranks the declaration ADR-033 added one sprint ago. `.gate-command`'s
own comment predicted this: *"it can go stale against a repo that later grows a real manifest."*

**Therefore `scripts.test` invoking `sh scripts/qa-check.sh` is a requirement of this ADR, not a
convenience.** A manifest whose discovered command skips the real gate re-points System verify at a
suite covering almost nothing, and the run still reports a verdict — the silent false negative ADR-033
exists to stop. `test/gate-discovery/` guards it with a retained must-FAIL fixture and two controls.

## Consequences

**Positive:** findings, rules and results become typed data, which closes ADR-034's named Finding-ID
gap at H07/H08 — that gap exists precisely because the Shell engine's error vocabulary is unenumerable.
Markdown is parsed by AST rather than by position-dependent regex; one domain result renders to text
*and* JSON with no second evaluation path (V3 §12); and tests move in-process, off the per-case
full-engine invocation that dominates `evals/` today.

**Negative (trade-offs accepted):** a second language in a repo whose identity is "no build step" —
every future maintainer needs Bun to run the engine, though the plugin itself still needs nothing. The
strangler means two semantic engines coexist until the last family cuts over, and ADR-034's Finding-ID
gap lives in exactly that window. **Gate discovery is now load-bearing on a JSON field**: anyone editing
`scripts.test` can disarm System verify without touching a skill, a gate, or anything that looks like
governance — SPRINT-083 T2's guard catches the case where the discovered command does not invoke the
declared one, and independent review showed the first version of that guard could itself be fooled by a
script that merely *printed* the gate's name. The zero-dependency stance will come under pressure at
H05, where a Markdown AST parser is the first genuinely useful library; the bar is consumer impact, not
purity. And reversal is expensive: deleting the TS tree is easy today, harder every family, and after
authority cutover (H24/H25) it is a re-migration rather than a reversal.

## Alternatives considered

| Option | Why rejected |
|---|---|
| Keep Shell and refactor it | The defect is not tidiness — semantics live inside message strings. SPRINT-083 T1 could not enumerate the engine's own finding ids through four-plus emission shapes; refactoring shell does not produce a typed `FindingId` |
| Rewrite rather than strangle | A rewrite has no comparand, which is the exact failure ADR-034 exists to prevent (V3 §26/§44) |
| Node + `tsc` instead of Bun | Requires an install, a build step and `node_modules` in every consumer's plugin cache, since `plugin.json` declares no `files` manifest. Bun runs the tree as-is, which is what makes the zero-dependency commitment real rather than aspirational |
| Put the workspace under a subdirectory to dodge the rung-1 hit | Hides the problem instead of solving it: the manifest still exists, a future tool still finds it, and the guard that now catches a gate-bypassing script would never have been written |
| Defer the toolchain until a family is ready to migrate | The workspace is the comparand's home. Standing it up after the first migration begins means the first family is built without the fitness tests that keep the dependency direction honest |
