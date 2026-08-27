// The whole-spec traversal (SPRINT-091 T3, EPIC-014 H12): every rule the parser admits, classified by
// its §14 mark -- `section.ts`'s targeted sweep generalised from ONE section to every section, and
// from ONE port shape to as many families as have landed.
//
// Domain layer (V3 §2.1). Imports only `./model.ts`, `./classify.ts`, `./registry.ts` -- no Bun, no
// filesystem. `test/architecture/dependency-direction.test.ts` enforces that mechanically.
//
// --- the seam this file USES, not one it invents ----------------------------------------------------
// `classify.ts`'s mark switch is UNCHANGED (SPRINT-087 T2); this file drives it through
// `classifyRuleVia`'s plain `(id) => RuleEvaluation | undefined` dispatch instead of one
// `Registry<TPort>` + one `port`, because a whole-spec run must reach rules that live behind DIFFERENT
// port shapes in the same pass -- S9's `SprintDirPort`, F12's `GitBoundaryPort`, and whatever
// EPIC-014's remaining families (F5/F2/F1/F7) bring. `registry.ts`'s `bindRegistry` erases each
// family's own `TPort` into a `BoundDispatcher` (`has`/`dispatch`); `composeFamilies` below only ever
// asks a LIST of those "do you own this id", in document order, and forwards to the first that says
// yes. That is a loop over a list, never a switch on rule id or mark -- the identical `Map`-shaped
// lookup `registry.ts`'s own header already calls the OCP seam, one level up. A new family is plugged
// in by appending one more `bindRegistry(createXRegistry(), portInstance)` to the list assembled at
// the CALLER's own composition site (`apps/cli/src/main.ts`) -- never a new case here, and never an
// edit to `classify.ts`'s switch.
//
// --- what this deliberately does NOT do --------------------------------------------------------------
// No level arithmetic and no hold semantics -- EPIC-014 H12 splits that to T4 on purpose (SPRINT-087's
// own lesson: code that PRODUCES a verdict gets forgotten because its output looks like data rather
// than a claim). `classify.ts`'s existing verdict vocabulary (`pass`/`fail`/`note`/`gap`) passes
// through untouched. `TraversalReport` mirrors `section.ts`'s `SectionReport` for the same reason its
// own header states: nothing here produces a whole-spec LEVEL, so the shape must carry no field one
// could be attached to -- `Object.freeze`, same enforcement (TD-101 predates T8's `tsc`, but the
// frozen object stays as the belt to the type's suspenders, matching `section.ts`'s own choice not to
// remove it once `tsc` landed). Unlike `SectionReport`, there is no `section` field at all: this run
// spans every section, so there is no single number to name here -- each outcome's own rule id already
// carries which section it belongs to (`spec-reader.ts`'s `sectionNumberOfRuleId`, T3's own addition).

import type { RuleId, StandardRule } from "./model.ts";
import { classifyRuleVia, type RuleOutcome } from "./classify.ts";
import type { RuleEvaluation } from "./result.ts";
import type { BoundDispatcher } from "./registry.ts";

/** Every rule the caller handed in, classified in the order given -- and nothing else. */
export interface TraversalReport {
  readonly outcomes: readonly RuleOutcome[];
}

/**
 * Builds ONE dispatch function out of several families' `BoundDispatcher`s, tried in the given order:
 * the first dispatcher that `has(id)` gets to `dispatch(id)`; `undefined` when NONE do, which
 * `classifyRuleVia`'s own mechanical/split branch already turns into a named GAP (`classify.ts`'s
 * `gap()`) -- never a silent skip. This is the ONLY place several families are combined into one
 * traversal-facing function; nothing downstream (`classifyAll`) knows how many families exist or what
 * their ports look like.
 */
export function composeFamilies(families: readonly BoundDispatcher[]): (id: RuleId) => RuleEvaluation | undefined {
  return (id) => {
    for (const family of families) {
      if (family.has(id)) return family.dispatch(id);
    }
    return undefined;
  };
}

/**
 * Classifies every rule in `rules` (typically the WHOLE spec, in document order -- `allRules`/
 * `readAll` in `spec-reader.ts`) against a composed multi-family `dispatch` function. `rules` is
 * never re-derived or re-sorted here; the caller (`apps/cli/src/main.ts`) is the one that reads the
 * spec and decides what "every rule the parser admits" means, mirroring `classifySection`'s own
 * division of labour (T4, SPRINT-087) between "which rules" (caller) and "what each one resolves to"
 * (this function).
 */
export function classifyAll(rules: readonly StandardRule[], dispatch: (id: RuleId) => RuleEvaluation | undefined): TraversalReport {
  // Frozen for the same reason `section.ts`'s `SectionReport` is (see the module header): converts
  // "no call site attaches a level today" into "no call site CAN", verified in traverse.test.ts.
  return Object.freeze({ outcomes: rules.map((rule) => classifyRuleVia(rule, dispatch)) });
}
