---
id: ADR-038
tags: [tooling, process]
domain: governance
status: accepted
related: [ADR-035, ADR-034, ADR-023]
---

# ADR-038 — Composed multi-family rule dispatch: a bound-dispatcher seam, not a switch

- **Status:** accepted (2026-08-27)
- **Deciders:** Maintainer
- **Context driver:** a whole-spec traversal (EPIC-014 H12) must dispatch rules that live behind
  *different* port shapes in one pass, and the codebase's own registry seam is single-port by design —
  the exact gap its own header predicted before a second port existed to prove it.

## Context

`Registry<TPort>` (`packages/standard/src/registry.ts`) resolves one family's rule ids through one
concrete port shape — proven single-port by its own test suite. That was sufficient while only one
port existed. It stopped being sufficient the moment a second rule family landed: S9's rules resolve
through `SprintDirPort`, F12's through `GitBoundaryPort`, and EPIC-014's remaining families (F5, F2,
F1, F7) will each bring their own. A flagless, whole-spec run has to dispatch across all of them in a
single traversal, and no existing seam did that — `packages/standard/src/rules/built-in.ts`'s own
header named this exact situation and deliberately deferred it: *"a second rule family with a
different port would need its own registry — not modelled here."*

The gap was not hypothetical. The CLI's flagless run originally wired only `createBuiltInRegistry()`
(one rule, S9.LOGDIR); `createF12Registry()`'s four §12 rules were never connected, so `--section 12`
answered `rule-unimplemented` for rules Shell genuinely evaluates. Closing that required a way to
compose several typed registries — each still bound to its own port — into one dispatch surface a
traversal can drive without knowing how many families exist or what their ports look like.

## Decision

**`bindRegistry(registry, port)` closes one family's typed `Registry<TPort>` over one concrete port,
erasing `TPort` behind a uniform `BoundDispatcher` (`has` / `dispatch`). `composeFamilies` in
`packages/standard/src/traverse.ts` holds a plain `readonly BoundDispatcher[]` and resolves by looping
over it — never a switch on rule id or mark.**

Each family keeps registering its own evaluators at its own call site (`built-in.ts`,
`f12-registry.ts`, …), completely unaware that erasure exists; neither file was modified to make this
work. Composition happens exactly once, at the CLI's own composition site (`apps/cli/src/main.ts`) —
the same place each family's concrete port already had to be constructed. Adding family N+1 costs one
`bindRegistry(createXRegistry(), portInstance)` appended to that list; it is never a new case in
`traverse.ts` or `registry.ts`.

**Constraint future families must satisfy: a rule id belongs to exactly one family, and the seam
enforces it loudly rather than by convention.** The first shipped version of `composeFamilies` was
first-family-wins with no collision detection — the one place this seam broke the codebase's otherwise
universal throw-loud rule (`classify.ts`'s `gap()` names itself; `BoundDispatcher.dispatch` throws
rather than returning `undefined` for an id it does not own). An independent Tier G review named the
realistic failure: during a strangler handoff a rule moves from one family's ownership to another's, an
earlier-listed family still carries the old id, and the later registration becomes permanently dead
code — no test failure, no warning. `composeFamilies` now scans **every** family for a given id, not
just until the first match, and throws — naming the id and both families' positions in the list — the
moment two claim the same id. A new family's author does not need to know this rule exists to be caught
by it; the seam checks on every traversal invocation that composes that family in.

## Consequences

**Positive:** each family stays independently typed against its own port — no evaluator signature
changes, no family's registration code needs to know another family exists. A new family is one line at
the composition site, and `built-in.ts` / `f12-registry.ts` remain untouched by any of this. The
duplicate-id failure mode — a rule silently orphaned during a strangler handoff — is now a loud,
attributable throw instead of dead code discovered by eye.

**Negative (trade-offs accepted):** the collision check is dynamic, not static — it runs over whatever
list of families a given call site actually composes, at traversal time. It is not a guarantee that
holds across every family that exists in the codebase; two families that are never composed together in
the same list would not be caught by it even if they shared an id. `BoundDispatcher`'s erasure also
means a caller that skips `has()` before `dispatch()` fails at runtime, not at compile time — the
uniform interface trades a compile-time family/port pairing guarantee for cross-family composability.

**Scope:** this seam is internal to the TypeScript reference engine (ADR-035). Shell retains §4
authority throughout SPRINT-091 (D3) and the strangler migration (EPIC-014 D2) — nothing here changes
which engine is authoritative; it only wires the reference engine's own whole-spec traversal.

## Alternatives considered

| Option | Why rejected |
|---|---|
| Type-erased evaluators via a per-rule port provider | Forces every evaluator's signature to change, and hides *when* a side-effecting port (F12 shells out to git) gets constructed behind an opaque callback |
| Registry-of-registries, each family declaring its own port factory | Close to the chosen design, but centralises factory logic in shared code — a new family would have to edit that shared code rather than only its own file |
| A composite/context port unioning every family's methods | Couples every family to every other family's port shape, and defeats the structural-typing convention `built-in.ts` itself states |
