// S4.NEGATIVE (spec/STANDARD.md §4 -- Structural, mechanical) -- part of SPRINT-091 T6's §4 ADR
// migration (D1). Mirrors scripts/lib/conformance-engine.sh's own `assert_S4_NEGATIVE`: every
// canonically-named ADR that carries a `## Consequences` section must name at least one Negative
// inside it. An ADR with NO `## Consequences` at all is S4.SECTIONS' finding, not this rule's --
// billing one defect to two rules would inflate a report an adopter reads as a work list, so it is
// silently skipped here (counted, never flagged).
//
// Domain layer (V3 §2.1). Imports only `../model.ts`, `../result.ts`, `./adr-family-port.ts`,
// `./adr-family.ts` -- no Bun, no `node:fs`.

import { makeRuleId } from "../model.ts";
import type { Finding, RuleEvaluation } from "../result.ts";
import type { AdrFamilyPort } from "./adr-family-port.ts";
import { canonicalAdrs, hasHeadingSection, sectionBody } from "./adr-family.ts";

export const RULE_ID = makeRuleId("S4.NEGATIVE");

/** The named finding this rule raises -- matches the Shell oracle's own `bad()` prefix byte-for-byte. */
export const ADR_NO_NEGATIVE_CONSEQUENCE = "adr-no-negative-consequence";

function findingFor(path: string): Finding {
  return {
    name: ADR_NO_NEGATIVE_CONSEQUENCE,
    detail:
      `adr-no-negative-consequence: ${path} -- § Consequences names no Negative. §4 requires at least ` +
      `one because no decision is cost-free: an ADR listing only upsides has not been examined, it has ` +
      `been advertised`,
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
  let nNeg = 0;
  let nSkipped = 0;
  for (const a of adrs) {
    const text = port.readFile(a) ?? "";
    if (!hasHeadingSection(text, "Consequences")) {
      nSkipped++;
      continue;
    }
    const body = sectionBody(text, "Consequences");
    if (/negative/i.test(body)) {
      nNeg++;
    } else {
      findings.push(findingFor(a));
    }
  }

  if (findings.length > 0) {
    return {
      ruleId: RULE_ID,
      verdict: "fail",
      findings,
      detail: `${findings.length} ADR(s) with no Negative consequence named`,
    };
  }

  if (nNeg === 0) {
    return {
      ruleId: RULE_ID,
      verdict: "note",
      findings: [],
      detail: `no ADR carries a § Consequences section to examine (${nSkipped} reported by S4.SECTIONS instead) -- nothing to verify`,
    };
  }

  const suffix = nSkipped > 0 ? ` (${nSkipped} without one left to S4.SECTIONS)` : "";
  return {
    ruleId: RULE_ID,
    verdict: "pass",
    findings: [],
    detail: `all ${nNeg} ADR(s) with a § Consequences section name at least one Negative${suffix}`,
  };
}
