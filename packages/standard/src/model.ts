// The typed model of what `spec/STANDARD.md` says — the Standard's vocabulary, not the engine's.
//
// Domain layer (V3 §2.1). This module imports nothing: no Bun, no filesystem, no parser, no CLI.
// `test/architecture/dependency-direction.test.ts` enforces that mechanically rather than by memory.
//
// Everything here is derived from §14's own tables. V3 §9 sketches a four-mark `RuleMark`; the
// Standard defines SIX, and building the sketch would have re-created the exact defect ADR-028
// closed — eleven rules reported as "unchecked gaps someone can close" when they are nothing of the
// kind. Read the normative source, never a summary of it.

/** §14: whether a TOOL can decide the rule — not how important it is. */
export const RULE_MARKS = [
  "mechanical",
  "judgment-only",
  "split",
  "implementation-directed",
  "restated",
  "standard-directed",
] as const;

export type RuleMark = (typeof RULE_MARKS)[number];

/** §14: what class of evidence the level is answerable from — tree, record, signature (ADR-024). */
export const CONFORMANCE_LEVELS = ["Structural", "Gated", "Attested"] as const;

export type ConformanceLevel = (typeof CONFORMANCE_LEVELS)[number];

export function isRuleMark(v: string): v is RuleMark {
  return (RULE_MARKS as readonly string[]).includes(v);
}

export function isConformanceLevel(v: string): v is ConformanceLevel {
  return (CONFORMANCE_LEVELS as readonly string[]).includes(v);
}

/**
 * A validated rule id. Branded so a bare string cannot be passed where an id is expected.
 *
 * The pattern admits a hyphen deliberately: 21 of the 100 rules are hyphenated §2 ids
 * (`S2.F-ARCHIVE`, `S2.R-CAPEXACT` …). A pattern that stopped at the hyphen is precisely what
 * produced the phantom count of 79 that ADR-034 disproved — 79 + 21 = 100.
 */
export type RuleId = string & { readonly __brand: "RuleId" };

const RULE_ID_RE = /^S\d+\.[A-Z][A-Z0-9-]*$/;

export function makeRuleId(v: string): RuleId {
  if (!RULE_ID_RE.test(v)) {
    throw new Error(`not a rule id: ${JSON.stringify(v)} (want e.g. S1.LAW1 or S2.F-ARCHIVE)`);
  }
  return v as RuleId;
}

export interface SourceLocation {
  readonly file: string;
  readonly line: number;
}

export interface StandardRule {
  readonly id: RuleId;
  readonly section: number;
  readonly mark: RuleMark;
  /**
   * `null` for a rule that carries NO level — six real rules do, all of them
   * `implementation-directed` or `standard-directed`. They constrain a tool or this document rather
   * than a repository, so there is no evidence class to place them at. Forcing a level would put
   * them somewhere the Standard deliberately does not.
   */
  readonly level: ConformanceLevel | null;
  readonly source: SourceLocation;
}

export interface StandardSection {
  readonly number: number;
  readonly title: string;
  readonly rules: readonly StandardRule[];
}

export interface StandardDocument {
  readonly version: string;
  readonly sections: readonly StandardSection[];
}

/**
 * Is this mark's rule one a tool can be expected to check?
 *
 * `mechanical` + `split` = the 51 "checkable" rules ADR-034 froze as the parity-testing scope. The
 * other four are checkable-in-principle: `judgment-only` chooses a human, `restated` is covered
 * under another id, and the two `-directed` marks are never evaluated against an adopter at all.
 * **This is a classification, not a coverage claim** — a `mechanical` rule with no checker is a gap,
 * and §14 exists to stop those two being collapsed.
 */
export function isCheckable(mark: RuleMark): boolean {
  return mark === "mechanical" || mark === "split";
}
