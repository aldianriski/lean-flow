---
owner: Maintainer
last_updated: 2026-11-01
update_trigger: A convention is adopted or changed (mirror what config enforces — don't duplicate it)
status: current
---

<!-- Lives at docs/development/coding-standards.md (lean-flow STANDARD §2). Written by
     `/lean-doc-generator migrate`'s profile pass. Records only what config CANNOT express: the WHY
     behind a convention. tsconfig.base.json already enforces the compiler rules — not re-listed. -->

# lean-flow — Coding Standards

## Conventions in use

**Tooling runtime**
- Maintainer tooling is TypeScript run directly by Bun: no build step, no plugins, no framework, until a dependency is earned — seen in `bunfig.toml`
- The conformance engine is the one exception: it stays POSIX shell, reached through `conformance.sh` — seen in `scripts/lib/conformance-engine.sh` (ADR-051)

**Checks and gates**
- A check prints one PASS / FAIL / note line per finding and exits 1 when any FAIL printed — seen in `scripts/lib/check-doc-caps.ts`
- A check derives its figures from `spec/STANDARD.md` at run time and never hardcodes them, so the two cannot drift — seen in `scripts/lib/check-doc-caps.ts`
- Every new Tier G gate keeps a retained must-FAIL fixture under `evals/fixtures/`, run by its own fixture harness — seen in `evals/run-conformance-engine-fixtures.sh`

**Tests**
- `bun:test` with `*.test.ts` files; a CONTROL case reports which rungs it examined, so a vacuous pass shows — seen in `test/gate-discovery/discovery-order.test.ts`

**Skills**
- A skill's executable artifacts (prompt templates, schemas, question sets) live in its own `references/`, outside the `SKILL.md` line cap — seen in `skills/lean-doc-generator/references/`

**Not confirmed:**
- Whether new non-engine tooling may still be written in shell, or only in TypeScript: the repo holds both (`scripts/qa-check.sh` beside `scripts/merge-check.ts`)

## Naming conventions
- Files are kebab-case (from .claude/CLAUDE.md § Naming Conventions)
- Exception: `SKILL.md` and the root core files keep their conventional upper-case names; `docs/research/LEAN-FLOW-PRE-EPIC-FOUNDATION-HARDENING-V3.md` and `docs/strategy/adlc/` depart from the rule without a recorded reason

## Folder structure
See [`docs/architecture/overview.md`](../architecture/overview.md) for the directory layout and
dependency rule — not duplicated here.

## Error handling
A check does not throw on a finding: it reports the named finding as a line and sets the exit code, so a gate run always ends in a readable verdict — seen in `scripts/lib/check-doc-caps.ts`.

## Logging
- No log files: tools write their verdict lines to stdout — seen in `scripts/lib/check-doc-caps.ts`
- Restrictions: see [`SECURITY.md`](../../SECURITY.md) § Not applicable — and why.

## Validation [CUSTOMIZE]
[Where validation happens in this repo, seen in `[path/to/file]`, and why there.]

## Testing conventions
See [`docs/QA.md`](../QA.md) for the gate, the judgment pass and when to run each — not duplicated
here. (This repo has no `docs/testing/testing-guide.md`; `.conformance-exempt` records why.)

<!-- Closing note: a standard enforceable by config (.editorconfig, .eslintrc, .prettierrc,
     commitlint) belongs IN that config file, not here. This doc records only what config cannot
     express — the reasoning and patterns behind a convention. -->
