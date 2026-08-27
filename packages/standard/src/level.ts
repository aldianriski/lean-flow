// Full-run conformance-level arithmetic (SPRINT-091 T4, EPIC-014 H12): what the whole-spec traversal
// (`traverse.ts`'s `classifyAll`/`TraversalReport`) resolves to as ONE level -- §14's own priority
// ladder, ported line-for-line from `scripts/lib/conformance-engine.sh`'s DRIVER (the closing
// "level:" block, `struct_fail`/`gated_fail`/`attested_fail`/`struct_hold`/`gated_hold`/
// `attested_hold`), never re-derived from first principles. T3 deliberately left this hole:
// `TraversalReport` carries no level field at all (`traverse.ts`'s own header), so nothing here
// widens that type -- this module adds a SEPARATE, sibling shape (`FullRunReport`, below) that DOES
// carry one, exactly the "the day a full sweep exists, IT adds its own variant, carrying a level;
// this one still won't" that `section.ts`'s header predicted for `SectionReport`.
//
// This is load-bearing, not incidental (SPRINT-091 T4 DoD 3): `classifyAll` is ALSO the entry point a
// TARGETED run drives (T9, `apps/cli/src/main.ts`'s `runSection()` -- previously `classifySection`'s
// own `Registry<TPort>`/single-port shape, T9 reroutes it onto this same multi-family `TraversalReport`
// seam so a section comparand composes every family the flagless run does). A caller holding only
// §N's rules calls the EXACT same `classifyAll` a whole-spec caller does -- so if a level lived ON
// `TraversalReport`, a partial run would inherit one for free the moment T9 landed, and DoD 3 ("a
// partial invocation still emits NO global level") would break SILENTLY, passing every test either
// task wrote. Putting the level on a distinct type that only `attachLevel` produces -- never on the
// type `classifyAll` itself returns -- makes that failure mode structurally unreachable rather than a
// convention a future caller has to remember: nothing short of a NEW call to `attachLevel` can attach
// one, and `runSection()` (any version of it) has no reason to ever make that call.
//
// Domain layer (V3 §2.1). Imports only `./model.ts`, `./classify.ts`, `./traverse.ts` -- no Bun, no
// filesystem. `test/architecture/dependency-direction.test.ts` enforces that mechanically.
//
// --- why `rules` AND `outcomes`, zipped by index, rather than one richer array -----------------------
// `RuleOutcome` (classify.ts) carries a verdict but never a level -- only `StandardRule.level` does,
// and `TraversalReport.outcomes` deliberately carries no back-reference to its originating rule (T3's
// own scope: a traversal classifies, it does not annotate). Shell's own driver reads `level` and
// dispatches the SAME loop iteration (scripts/lib/conformance-engine.sh: `id=$1; level=$2; mark=$3`,
// one row, one assertion, one bucket) -- the equivalent here is `rules[i]`/`outcomes[i]`, which
// `classifyAll`'s own contract guarantees line up ("classified in the order given -- and nothing
// else", traverse.ts). `computeLevel` asserts the lengths agree rather than trusting the caller
// silently, the same fail-loud posture `composeFamilies` takes on a duplicate id (T3 retry).
//
// --- what never enters the arithmetic, mirroring Shell's driver exactly ------------------------------
// `excluded` outcomes (judgment-only/implementation-directed/restated/standard-directed) never reach
// Shell's fail/hold buckets -- its driver only touches them inside the `mechanical|split` case. `gap`
// is a statement about THIS ENGINE's coverage, never the repository's (§14; result.ts's own
// `exitCodeFor` doc), and Shell's own `gap()` never sets `last_bad`/`last_hold` either. `note` (a
// dispatched rule that reported without a verdict, and did NOT hold) is Shell's own "reported without
// a verdict" bucket (`n_reported`) -- it changes the wording of an eventual Attested line but never
// the LEVEL itself, so it carries no weight here either. Only `fail` and `hold` ever move a counter.

import type { ConformanceLevel, StandardRule } from "./model.ts";
import type { RuleOutcome } from "./classify.ts";
import type { TraversalReport } from "./traverse.ts";

/** §14's four-rung ladder: the three real evidence classes, plus "none" -- Structural not yet
 *  reached. Deliberately NOT `ConformanceLevel | null`: `null` on `StandardRule.level` already means
 *  something else ("this rule carries no level at all" -- model.ts's own doc, for
 *  implementation-directed/standard-directed rules), and reusing it here for "the REPOSITORY has not
 *  reached the first rung" would conflate two different absences behind one value. */
export type FullRunLevel = ConformanceLevel | "none";

/** The whole-spec traversal WITH a level attached -- the sibling `section.ts`'s header predicted.
 *  `TraversalReport` (traverse.ts) stays level-less; this is a DIFFERENT, later shape a caller builds
 *  from one, never a widening of it. Frozen for the same reason `SectionReport`/`TraversalReport` are
 *  (TD-101's runtime belt, T8's `tsc` its suspenders): "no call site does this" becomes "no call site
 *  CAN", verified in level.test.ts. */
export interface FullRunReport {
  readonly outcomes: readonly RuleOutcome[];
  readonly level: FullRunLevel;
}

/**
 * §14's priority ladder, over `rules`/`outcomes` zipped by index. Mirrors
 * scripts/lib/conformance-engine.sh's closing `if`/`elif` chain rung-for-rung and in the SAME order:
 * every FAIL rung (Structural, then Gated, then Attested) is checked before any HOLD rung, exactly as
 * Shell's own chain does -- a Gated FAIL outranks an Attested HOLD even though the hold is at a
 * "later" level, because the chain is walked top-to-bottom and stops at its first true branch, never
 * computed as "the lowest surviving rung" independently per bucket (a plausible-looking reinvention
 * that would silently disagree with Shell whenever both a fail and a hold are present at once).
 */
export function computeLevel(rules: readonly StandardRule[], outcomes: readonly RuleOutcome[]): FullRunLevel {
  if (rules.length !== outcomes.length) {
    throw new Error(
      `computeLevel: rules (${rules.length}) and outcomes (${outcomes.length}) are different lengths -- ` +
        `they must be the SAME array, in the SAME order, that classifyAll(rules, dispatch) was called ` +
        `with (traverse.ts's own contract: "classified in the order given -- and nothing else")`,
    );
  }

  let structFail = 0;
  let gatedFail = 0;
  let attestedFail = 0;
  let structHold = 0;
  let gatedHold = 0;
  let attestedHold = 0;

  for (let i = 0; i < outcomes.length; i++) {
    const outcome = outcomes[i];
    const rule = rules[i];
    // Unreachable given the length guard above (same `i` indexes both arrays) -- narrows `outcome`/
    // `rule` past `| undefined` for tsc rather than asserting past it, matching T8's own convention
    // of binding-and-guarding at read sites instead of a non-null `!`.
    if (outcome === undefined || rule === undefined) continue;

    // judgment-only/implementation-directed/restated/standard-directed: never dispatched, never
    // counted (§14) -- the same branch Shell's driver only reaches from inside `mechanical|split`.
    if (outcome.kind === "excluded") continue;

    const { verdict } = outcome.evaluation;
    // gap: this engine's own coverage, not a repository finding (result.ts's exitCodeFor doc).
    // note: reported without a verdict, no blocking weight of its own (only changes Attested's
    //       wording in Shell, never the level -- see the module header).
    // pass: nothing to block.
    if (verdict === "gap" || verdict === "note" || verdict === "pass") continue;

    if (rule.level === null) {
      // Contract violation, not a real state: model.ts guarantees a null level ONLY for
      // implementation-directed/standard-directed rules, and classify.ts's `classifyRuleVia` never
      // dispatches those marks (they resolve to `excluded` before `dispatch` is ever called) -- so a
      // DISPATCHED outcome (fail/hold) pairing with a null-level rule means `rules`/`outcomes` were
      // zipped against the WRONG pair, and failing loud here is the same posture `classify.ts`'s own
      // "unrecognized mark" throw takes rather than silently falling through (L-058's family).
      throw new Error(
        `computeLevel: ${outcome.evaluation.ruleId} was DISPATCHED (verdict "${verdict}") but its rule ` +
          `carries no level -- only implementation-directed/standard-directed rules have a null level ` +
          `(model.ts) and neither mark is ever dispatched (classify.ts); rules[${i}] does not match outcomes[${i}]`,
      );
    }

    // `verdict` narrows to "fail" | "hold" here -- the only two members left after the continue above.
    if (verdict === "fail") {
      if (rule.level === "Structural") structFail++;
      else if (rule.level === "Gated") gatedFail++;
      else attestedFail++;
    } else {
      if (rule.level === "Structural") structHold++;
      else if (rule.level === "Gated") gatedHold++;
      else attestedHold++;
    }
  }

  // The exact chain, in the exact order, as scripts/lib/conformance-engine.sh's closing `if`/`elif`.
  if (structFail > 0) return "none";
  if (gatedFail > 0) return "Structural";
  if (attestedFail > 0) return "Gated";
  if (structHold > 0) return "none";
  if (gatedHold > 0) return "Structural";
  if (attestedHold > 0) return "Gated";
  return "Attested";
}

/**
 * Builds the level-bearing sibling of a `TraversalReport` -- `rules` must be the SAME array, in the
 * SAME order, that produced `report` (`classifyAll(rules, dispatch)`), matching `computeLevel`'s own
 * contract. The input `report` is never mutated (it stays frozen and level-less, per traverse.ts's own
 * guarantee) -- this returns a NEW, separately frozen object.
 */
export function attachLevel(rules: readonly StandardRule[], report: TraversalReport): FullRunReport {
  const level = computeLevel(rules, report.outcomes);
  return Object.freeze({ outcomes: report.outcomes, level });
}
