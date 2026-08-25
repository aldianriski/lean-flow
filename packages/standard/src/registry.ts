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
