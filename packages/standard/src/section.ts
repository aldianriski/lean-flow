// SPRINT-087 T4: what a TARGETED sweep over one section's rules resolves to. `apps/cli/src/main.ts`'s
// `--section N` is this module's one caller: it narrows the spec to §N's own rows (spec-reader.ts's
// `readSection`, which already refuses the L-058 empty-vs-dropped confusion), lifts each row to a
// `StandardRule` (`toStandardRule`), and hands the array here.
//
// Domain layer (V3 §2.1). Imports only `./model.ts`, `./registry.ts`, `./classify.ts` -- no Bun, no
// filesystem. `test/architecture/dependency-direction.test.ts` enforces that mechanically.
//
// --- DoD 2: the guard is a property of the RESULT, not the printer -------------------------------
// A partial invocation (this is the only kind `--section` can ever produce -- one section out of the
// whole spec) must carry no global conformance level at all. `SectionReport` below has NO field a
// level could occupy -- not `globalLevel?: ConformanceLevel`, no field at all -- so no renderer,
// today's text line or a future JSON one (EPIC-014 § Closed-when 6: one domain result feeds both),
// can print one by reading this object. This mirrors spec-reader.ts's own convention
// (`SpecReadFail` carries no `rows` field): absence is a property of the TYPE, so a caller cannot
// attach a level via a renderer-only check that only LOOKS like a guard (`if (level) print(level)`
// still leaks the moment something upstream sets `level` to a non-falsy value -- the field itself
// must not exist). There is deliberately no sibling "full sweep" variant here: nothing in this
// sprint produces one (T3's family migration and H12's whole-spec orchestrator are both out of
// scope), and inventing a shape nothing emits is the untested-branch trap this package's own
// CLAUDE.md warns against (see result.ts's `hold` comment) -- the day a full sweep exists, IT adds
// its own variant, carrying a level; this one still won't.

import type { Registry } from "./registry.ts";
import type { StandardRule } from "./model.ts";
import type { RuleOutcome } from "./classify.ts";
import { classifyRule } from "./classify.ts";

/** One section's classified rules, in the order given -- and nothing else. */
export interface SectionReport {
  readonly section: number;
  readonly outcomes: readonly RuleOutcome[];
}

/**
 * Classifies every rule in `rules` against `registry`/`port`, in the order given. `rules` is already
 * narrowed to one section by the CALLER (`readSection` + `toStandardRule`, in
 * `apps/cli/src/main.ts`/`spec-file-reader.ts`) -- this function never re-derives section membership,
 * so "`--section N` selects that section's rules and no others" (DoD 1) is a property of what the
 * caller passes in, not of anything reinterpreted here.
 */
export function classifySection<TPort>(
  section: number,
  rules: readonly StandardRule[],
  registry: Registry<TPort>,
  port: TPort,
): SectionReport {
  return { section, outcomes: rules.map((rule) => classifyRule(rule, registry, port)) };
}
