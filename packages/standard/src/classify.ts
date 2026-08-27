// Rule classification (SPRINT-087 T2): resolves a §14-marked `StandardRule` to a named outcome --
// GAP, excluded (with its reason), or a dispatched evaluation -- so a rule the engine cannot check
// says so, rather than reading back as an empty pass (the same false-assurance shape L-058 names).
//
// Domain layer (V3 §2.1). Imports only `./model.ts`, `./registry.ts`, `./result.ts` -- no Bun, no
// filesystem. `test/architecture/dependency-direction.test.ts` enforces that mechanically.
//
// The six marks are spec/STANDARD.md §14's own -- see `model.ts`'s `RULE_MARKS` (already sourced from
// there, not re-derived here) and this file's own `classify.test.ts`, which parses §14's Marks table
// directly and asserts it agrees with `RULE_MARKS` byte-for-byte, so a seventh mark cannot appear
// silently on either side.
//
// This switches on MARK, a closed 6-value enumeration the Standard itself owns and only a spec bump
// grows -- NOT on rule id, which is what T1's DoD 2 forbids a procedural switch over (rule count grows
// every sprint; registering evaluator N+1 must stay a `registry.register` call, never an edit here).
// The Shell oracle's own driver makes the same distinction: `case "$mark" in ...)` picks the bucket,
// then `command -v "$fn"` -- never a mark-keyed dispatch -- reaches the individual assertion
// (scripts/lib/conformance-engine.sh's DRIVER section). This file mirrors that shape, not the one T1's
// DoD 2 closed off.

import type { Registry } from "./registry.ts";
import type { RuleId, StandardRule } from "./model.ts";
import type { RuleEvaluation } from "./result.ts";

/** §14: why a mark's rule is never dispatched against a repository at all. */
export type ExclusionReason = "judgment-only" | "implementation-directed" | "restated" | "standard-directed";

/**
 * A mark that is never evaluated against an adopter. `judgment-only` is not debt (§14: "not checkable
 * in principle... this is not debt"); the other three ARE repository-shaped constraints, just never
 * ones this engine may check (`implementation-directed`/`standard-directed`) or check again under a
 * second id (`restated`).
 */
export interface ExcludedRule {
  readonly kind: "excluded";
  readonly ruleId: StandardRule["id"];
  readonly reason: ExclusionReason;
  readonly detail: string;
}

/**
 * `mechanical`/`split` dispatched through the registry -- `evaluation.verdict` is whatever the
 * registered evaluator returned (`pass`/`fail`/`note`), or `gap` when nothing is registered for this
 * id yet (DoD 1's load-bearing case: absent from the registry reports GAP, never an empty pass).
 */
export interface EvaluatedRule {
  readonly kind: "evaluated";
  readonly evaluation: RuleEvaluation;
}

export type RuleOutcome = ExcludedRule | EvaluatedRule;

function excluded(rule: StandardRule, reason: ExclusionReason, detail: string): ExcludedRule {
  return { kind: "excluded", ruleId: rule.id, reason, detail };
}

/**
 * `rule.id` absent from `registry` -- GAP, never `undefined` read as a silent pass. Mirrors the Shell
 * oracle's own `rule-unimplemented` gap() call (conformance-engine.sh's DRIVER): a gap is a statement
 * about THIS ENGINE's coverage, not about the repository, so it carries no findings.
 */
function gap(rule: StandardRule): EvaluatedRule {
  return {
    kind: "evaluated",
    evaluation: {
      ruleId: rule.id,
      verdict: "gap",
      findings: [],
      detail:
        `rule-unimplemented: the spec marks ${rule.id} ${rule.mark} at level ${rule.level ?? "--"} and ` +
        `this engine has no evaluator registered for it yet (§14) -- a gap in THIS ENGINE's coverage, ` +
        `not a finding about the repository`,
    },
  };
}

/**
 * The mark-driven core, dispatch-AGNOSTIC (SPRINT-091 T3): resolves one §14-marked rule to its named
 * outcome by calling a plain `dispatch(id)` function for the two checkable marks (`mechanical`/`split`
 * -- GAP when it returns `undefined`), or `excluded` for the four that are never evaluated against a
 * repository at all. `dispatch` is only ever CALLED when a `mechanical`/`split` rule reaches this
 * branch -- the four excluded marks never call it, even if it happens to resolve their id (§14:
 * "never evaluate it against an adopter").
 *
 * Split out from `classifyRule` below so a WHOLE-SPEC traversal (`traverse.ts`, EPIC-014 H12) can
 * drive this EXACT mark logic through a dispatch function composed across SEVERAL families with
 * different port shapes (`registry.ts`'s `BoundDispatcher`), without a second copy of this switch --
 * the switch itself is unchanged from SPRINT-087 T2; only its dispatch step was generalised from
 * `registry.dispatch(id, port)` (one port) to a bare `(id) => RuleEvaluation | undefined` (any number
 * of ports, already bound by the caller).
 */
export function classifyRuleVia(rule: StandardRule, dispatch: (id: RuleId) => RuleEvaluation | undefined): RuleOutcome {
  switch (rule.mark) {
    case "judgment-only":
      return excluded(
        rule,
        "judgment-only",
        "not checkable in principle -- the standard is choosing a human, and this is not debt (§14)",
      );
    case "implementation-directed":
      return excluded(
        rule,
        "implementation-directed",
        "constrains a tool's inference, never a repository; evaluating it would emit a finding no " +
          "adopter can ever clear (§14)",
      );
    case "restated":
      return excluded(
        rule,
        "restated",
        "the constraint is carried by another rule and checked under that id; asserting it here would " +
          "state one constraint twice (§14)",
      );
    case "standard-directed":
      return excluded(
        rule,
        "standard-directed",
        "governs this standard document or the plugin that ships it, never an adopter's repository (§14)",
      );
    case "mechanical":
    case "split": {
      const evaluation = dispatch(rule.id);
      return evaluation ? { kind: "evaluated", evaluation } : gap(rule);
    }
    default: {
      // Defensive, not a normal path: `RuleMark` is a closed 6-value union and `toStandardRule`
      // (spec-reader.ts) already refuses to construct a `StandardRule` with anything else. But
      // TD-101 -- this repo ships no `tsc` -- means that guarantee is documentation, not enforcement,
      // so a fabricated 7th mark must fail LOUD here rather than silently falling through to "not
      // evaluated" (the same L-058 shape as a rule that reports as checked when nothing checked it).
      const unrecognized: string = rule.mark;
      throw new Error(`classifyRule: unrecognized mark ${JSON.stringify(unrecognized)} for ${rule.id}`);
    }
  }
}

/**
 * Resolves one §14-marked rule to its named outcome, dispatching through ONE `registry` bound to ONE
 * `port` -- the single-family shape every existing caller (`classifySection`, this file's own tests)
 * already uses, and whose behaviour is unchanged by T3's refactor. Now a thin wrapper over
 * `classifyRuleVia` above: `registry.dispatch(id, port)` closed into a bare `(id) => ...` function is
 * exactly what `registry.ts`'s own `bindRegistry` does for cross-family composition, so this call site
 * demonstrates the single-family case of the same seam rather than a separate mechanism.
 */
export function classifyRule<TPort>(rule: StandardRule, registry: Registry<TPort>, port: TPort): RuleOutcome {
  return classifyRuleVia(rule, (id) => registry.dispatch(id, port));
}

/**
 * The literal outcome string DoD 2 names for each class -- `judgment-only` reads
 * `excluded/judgment-required` (excluded, AND not debt -- §14's distinction is worth keeping visible
 * in the label itself); the other three excluded marks read plain `excluded`, since all three share
 * the same consequence ("never evaluate it against an adopter") and differ only in WHY, which
 * `ExcludedRule.reason`/`.detail` already carry. A dispatched rule's outcome IS its verdict
 * (`pass`/`fail`/`note`/`gap`).
 */
export function outcomeName(outcome: RuleOutcome): string {
  if (outcome.kind === "evaluated") return outcome.evaluation.verdict;
  return outcome.reason === "judgment-only" ? "excluded/judgment-required" : "excluded";
}
