// The result domain (SPRINT-087 T1): what one rule's evaluation states, and what a run of them
// aggregates to.
//
// Domain layer (V3 §2.1). This module imports only `./model.ts` -- no Bun, no filesystem, no CLI
// strings. `test/architecture/dependency-direction.test.ts` enforces that mechanically: a domain
// string leak (a `node:`/`bun:` import, or reaching for `process.argv`) fails it.
//
// `Verdict` mirrors the Shell oracle's own three-state vocabulary (scripts/lib/conformance-engine.sh's
// `ok`/`bad`/`note`) rather than inventing a fourth. `hold` and `gap` exist in the Shell engine too
// (SPRINT-078/080) but no evaluator in this package needs them yet -- adding a state nothing produces
// would be exactly the untested-branch trap CLAUDE.md warns against (a guard keyed to a shape the
// system never emits).

import type { RuleId } from "./model.ts";

export type Verdict = "pass" | "fail" | "note";

/** A named, human-readable finding -- what an evaluation points at when it is not a clean pass. */
export interface Finding {
  /** The stable identifier a report/grep keys on, e.g. `"sprint-log-outside-logs-dir"`. */
  readonly name: string;
  readonly detail: string;
}

/**
 * One rule's evaluation against a repository (or, for `note`, a statement that nothing applied).
 *
 * `findings` is an ARRAY, not one-or-null (SPRINT-087 T1 revise). The Shell oracle loops its own
 * glob and calls `bad()` once PER offending file (scripts/lib/conformance-engine.sh's
 * `assert_S9_LOGDIR`); a single comma-joined `Finding` here would silently absorb that cardinality
 * difference into a string, which EPIC-014 D2 forbids -- every TS/Shell difference is RULED, never
 * absorbed. `[]` for `pass` and for an uninformative `note`; length >= 1 for `fail`. `verdict ===
 * "fail"` and `findings.length > 0` travel together -- an evaluator's own contract, not enforced by
 * a type (the domain has no way to express "non-empty exactly when fail" more cheaply than a comment
 * without adding a discriminated union nothing yet needs -- YAGNI, per this repo's own laziness
 * ladder).
 */
export interface RuleEvaluation {
  readonly ruleId: RuleId;
  readonly verdict: Verdict;
  readonly findings: readonly Finding[];
  readonly detail: string;
}

/** What a run of the engine over some set of rules produces. */
export interface ConformanceResult {
  readonly evaluations: readonly RuleEvaluation[];
}

/**
 * Mirrors the Shell oracle's own exit meaning (scripts/lib/conformance-engine.sh: `bad()` sets
 * `fail=1`, `exit $fail` at the end) -- any `fail` verdict makes the run exit non-zero; `pass`/`note`
 * never do, on their own.
 */
export function exitCodeFor(result: ConformanceResult): number {
  return result.evaluations.some((e) => e.verdict === "fail") ? 1 : 0;
}
