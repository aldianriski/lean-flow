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
// family's own `TPort` into a `BoundDispatcher` (`has`/`dispatch`); `composeFamilies` below asks EVERY
// family "do you own this id" -- never stopping at the first yes -- so it can tell a genuine single
// owner apart from two families that both claim the same id. That is a loop over a list, never a
// switch on rule id or mark -- the identical `Map`-shaped lookup `registry.ts`'s own header already
// calls the OCP seam, one level up. A new family is plugged in by appending one more
// `bindRegistry(createXRegistry(), portInstance)` to the list assembled at the CALLER's own
// composition site (`apps/cli/src/main.ts`) -- never a new case here, and never an edit to
// `classify.ts`'s switch.
//
// --- a duplicate id across families fails LOUD, never shadows silently (T3 retry, reviewer finding 2)
// First-wins-with-no-detection was the one place in this seam that broke the codebase's own universal
// rule: `classify.ts`'s `gap()` names itself, `BoundDispatcher.dispatch` throws rather than returning
// `undefined` for an id it does not own -- but the ORIGINAL `composeFamilies` silently let an earlier
// family shadow a later one forever, with zero test failure and zero warning. Realistic failure this
// closes: during a strangler handoff, a NEW family's registry registers an id an EARLIER-listed family
// still carries (a rule moving from one family's ownership to another's, mid-migration) -- the second
// registration becomes permanently dead code, discovered only by someone reading every registry by
// eye. `composeFamilies` now checks EVERY family, not just until the first match, and throws -- naming
// the id and both families' positions in the list -- the moment two claim the same id.
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
 * Builds ONE dispatch function out of several families' `BoundDispatcher`s. Every family is asked
 * `has(id)` -- not just until the first match -- so exactly-one-owner and more-than-one-owner are
 * DISTINGUISHABLE: exactly one owner dispatches to it; no owner returns `undefined`, which
 * `classifyRuleVia`'s own mechanical/split branch already turns into a named GAP (`classify.ts`'s
 * `gap()`) -- never a silent skip; MORE than one owner throws, naming the id and both families'
 * positions in `families`, rather than silently keeping whichever was listed first. This is the ONLY
 * place several families are combined into one traversal-facing function; nothing downstream
 * (`classifyAll`) knows how many families exist or what their ports look like.
 */
export function composeFamilies(families: readonly BoundDispatcher[]): (id: RuleId) => RuleEvaluation | undefined {
  return (id) => {
    let owner: BoundDispatcher | undefined;
    let ownerIndex = -1;
    for (let i = 0; i < families.length; i++) {
      const family = families[i];
      if (family === undefined || !family.has(id)) continue;
      if (owner !== undefined) {
        throw new Error(
          `composeFamilies: ${id} is registered in MORE THAN ONE family (positions ${ownerIndex} and ${i} ` +
            `of ${families.length}) -- a rule id must belong to exactly one family; an earlier ` +
            `registration is never silently shadowed by a later one`,
        );
      }
      owner = family;
      ownerIndex = i;
    }
    return owner ? owner.dispatch(id) : undefined;
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
