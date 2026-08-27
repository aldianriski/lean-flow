// S4.SECTIONS (spec/STANDARD.md §4 -- Structural, mechanical) -- part of SPRINT-091 T6's §4 ADR
// migration (D1). Mirrors scripts/lib/conformance-engine.sh's own `assert_S4_SECTIONS`: every
// canonically-named ADR must carry all six of Status · Deciders · Context · Decision · Consequences ·
// Alternatives -- Status/Deciders as header BULLETS (§4's own template), the other four as `## `
// headings.
//
// Domain layer (V3 §2.1). Imports only `../model.ts`, `../result.ts`, `./adr-family-port.ts`,
// `./adr-family.ts` -- no Bun, no `node:fs`.

import { makeRuleId } from "../model.ts";
import type { Finding, RuleEvaluation } from "../result.ts";
import type { AdrFamilyPort } from "./adr-family-port.ts";
import { canonicalAdrs, hasBulletOrHeadingSection, hasHeadingSection } from "./adr-family.ts";

export const RULE_ID = makeRuleId("S4.SECTIONS");

/** The named finding this rule raises -- matches the Shell oracle's own `bad()` prefix byte-for-byte. */
export const ADR_REQUIRED_SECTION_MISSING = "adr-required-section-missing";

/** Rendered as header bullets in §4's template, not headings. */
const BULLET_OR_HEADING_LABELS = ["Status", "Deciders"] as const;
/** Rendered as `## ` headings. */
const HEADING_ONLY_LABELS = ["Context", "Decision", "Consequences", "Alternatives"] as const;

function missingSections(text: string): readonly string[] {
  const missing: string[] = [];
  for (const label of BULLET_OR_HEADING_LABELS) if (!hasBulletOrHeadingSection(text, label)) missing.push(label);
  for (const label of HEADING_ONLY_LABELS) if (!hasHeadingSection(text, label)) missing.push(label);
  return missing;
}

function findingFor(path: string, missing: readonly string[]): Finding {
  return {
    name: ADR_REQUIRED_SECTION_MISSING,
    detail:
      `adr-required-section-missing: ${path} -- ${missing.join(", ")}. §4 lists six required sections ` +
      `and each carries a distinct load: without Context the decision is unexplainable, without ` +
      `Alternatives it is unfalsifiable, and a reader cannot tell a considered call from an arbitrary one`,
  };
}

export function evaluate(port: AdrFamilyPort): RuleEvaluation {
  const adrs = canonicalAdrs(port);
  if (adrs.length === 0) {
    return {
      ruleId: RULE_ID,
      verdict: "note",
      findings: [],
      detail: "no canonical ADR files -- nothing to verify",
    };
  }

  const findings: Finding[] = [];
  let nComplete = 0;
  for (const a of adrs) {
    const text = port.readFile(a) ?? "";
    const missing = missingSections(text);
    if (missing.length > 0) {
      findings.push(findingFor(a, missing));
    } else {
      nComplete++;
    }
  }

  if (findings.length > 0) {
    return {
      ruleId: RULE_ID,
      verdict: "fail",
      findings,
      detail: `${findings.length} ADR(s) missing a required section`,
    };
  }

  return {
    ruleId: RULE_ID,
    verdict: "pass",
    findings: [],
    detail: `all ${nComplete} ADR(s) carry Status · Deciders · Context · Decision · Consequences · Alternatives`,
  };
}
