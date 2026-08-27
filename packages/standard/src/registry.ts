// The rule registry (SPRINT-087 T1): `rule id -> evaluator`, resolved through a map, never a
// procedural switch carrying rule bodies.
//
// Domain layer (V3 §2.1). No Bun, no filesystem, no CLI strings -- `test/architecture/dependency-
// direction.test.ts` enforces that mechanically.
//
// This is the OCP seam the Shell engine's own driver comment names as its one alternative
// ("append `assert_<ID>` functions below the marker, never re-implement the loop") -- but the Shell
// driver still dispatches through a shell `case` on the rule's MARK before it ever reaches a rule
// body via `command -v`. Here dispatch is a single `Map.get`: adding rule N+1's evaluator is
// `registry.register(id, fn)` at ITS OWN call site, never an edit to `resolve`/`dispatch` --
// `registry.test.ts` proves this by registering a second evaluator and dispatching to it with zero
// changes to this file.

import type { RuleId } from "./model.ts";
import type { RuleEvaluation } from "./result.ts";

export type Evaluator<TPort> = (port: TPort) => RuleEvaluation;

export interface Registry<TPort> {
  register(id: RuleId, evaluator: Evaluator<TPort>): void;
  resolve(id: RuleId): Evaluator<TPort> | undefined;
  /** Resolve then call in one step; `undefined` when no evaluator is registered for `id`. */
  dispatch(id: RuleId, port: TPort): RuleEvaluation | undefined;
}

export function createRegistry<TPort>(): Registry<TPort> {
  const evaluators = new Map<RuleId, Evaluator<TPort>>();
  return {
    register(id, evaluator) {
      evaluators.set(id, evaluator);
    },
    resolve(id) {
      return evaluators.get(id);
    },
    dispatch(id, port) {
      const evaluator = evaluators.get(id);
      return evaluator ? evaluator(port) : undefined;
    },
  };
}

// --- SPRINT-091 T3: composing MULTIPLE families across DIFFERENT port shapes ------------------------
//
// `Registry<TPort>` is single-port by design (above): one family, one port shape, proven by
// `registry.test.ts`'s own second-evaluator test. A WHOLE-SPEC traversal (EPIC-014 H12) must dispatch
// across families whose ports do NOT share a shape -- `SprintDirPort` for S9, `GitBoundaryPort` for
// F12, more as later families land -- and `../rules/built-in.ts`'s own header predicted exactly this
// ("a second rule family with a DIFFERENT port would need its own registry -- not modelled here").
// That second port now exists; this is the seam it deferred.
//
// `BoundDispatcher` erases `TPort` by CLOSING one already-typechecked `Registry<TPort>` over one
// already-constructed `TPort` instance -- never by widening `Registry` itself to accept `unknown`
// (which would let a mismatched port compile against the wrong family's evaluators). `bindRegistry`
// is the ONLY place a registry and a port are paired this way; every family still registers its own
// evaluators at ITS OWN call site (`built-in.ts`, `f12-registry.ts`, ...), completely unaware that
// erasure exists. A whole-spec traversal (`traverse.ts`) then holds a LIST of these, one per family,
// and asks each "do you own this id" (`has`, a plain `Map.has` underneath -- no port touched, so
// membership tests are free of side effects) before ever calling `dispatch`. Composing the list is a
// loop, not a switch: adding family N+1 is appending one more `bindRegistry(...)` call at the
// traversal's OWN composition site (`apps/cli/src/main.ts`), never a new case in `traverse.ts` or here.
export interface BoundDispatcher {
  /** True if THIS family's registry has an evaluator for `id` -- resolved without touching the port. */
  has(id: RuleId): boolean;
  /** Dispatches against this family's own bound port. Only valid when `has(id)` is true; a caller
   *  that skips the check gets a loud throw, never a silent `undefined` standing in for "not mine". */
  dispatch(id: RuleId): RuleEvaluation;
}

/** Binds one family's `Registry<TPort>` to one concrete `port`, erasing `TPort` for cross-family
 *  composition. The pairing happens exactly once, here, at the call site that already knows both
 *  the family's registry AND its real port -- never inferred or re-derived downstream. */
export function bindRegistry<TPort>(registry: Registry<TPort>, port: TPort): BoundDispatcher {
  return {
    has(id) {
      return registry.resolve(id) !== undefined;
    },
    dispatch(id) {
      const evaluation = registry.dispatch(id, port);
      if (evaluation === undefined) {
        throw new Error(`BoundDispatcher.dispatch: ${id} has no registered evaluator -- caller must check has() first`);
      }
      return evaluation;
    },
  };
}
