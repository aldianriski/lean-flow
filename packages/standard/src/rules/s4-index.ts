// S4.INDEX (spec/STANDARD.md §4 -- Structural, mechanical) -- part of SPRINT-091 T6's §4 ADR
// migration (D1). Mirrors scripts/lib/conformance-engine.sh's own `assert_S4_INDEX`: every canonically
// -named ADR (S4.ONEFILE's own naming judgment is NOT re-applied here -- see `canonicalAdrs`'s own
// header) must carry a row in `docs/DECISIONS.md` (or a root `DECISIONS.md`), matched by plain
// substring against the ADR's own basename -- never a regex, since a hyphenated slug is not a pattern
// worth honouring.
//
// Domain layer (V3 §2.1). Imports only `../model.ts`, `../result.ts`, `./adr-family-port.ts`,
// `./adr-family.ts` -- no Bun, no `node:fs`.

import { makeRuleId } from "../model.ts";
import type { Finding, RuleEvaluation } from "../result.ts";
import type { AdrFamilyPort } from "./adr-family-port.ts";
import { canonicalAdrs } from "./adr-family.ts";

export const RULE_ID = makeRuleId("S4.INDEX");

/** The named finding this rule raises -- matches the Shell oracle's own `bad()` prefix byte-for-byte. */
export const DECISIONS_INDEX_MISSING_ADR = "decisions-index-missing-adr";

function findingFor(detail: string): Finding {
  return { name: DECISIONS_INDEX_MISSING_ADR, detail };
}

function basenameOf(path: string): string {
  const idx = path.lastIndexOf("/");
  return idx === -1 ? path : path.slice(idx + 1);
}

export function evaluate(port: AdrFamilyPort): RuleEvaluation {
  const adrs = canonicalAdrs(port);
  if (adrs.length === 0) {
    return {
      ruleId: RULE_ID,
      verdict: "note",
      findings: [],
      detail: "no canonical ADR files to index -- nothing to verify",
    };
  }

  const idx = port.findIndexPath();
  if (idx === null) {
    return {
      ruleId: RULE_ID,
      verdict: "fail",
      findings: [
        findingFor(
          "decisions-index-missing-adr: no decision index found at docs/DECISIONS.md or DECISIONS.md " +
            "-- §4 requires a thin index linking every ADR. Without one there is no single place that " +
            "answers 'what has been decided here', which is the whole reason the ADRs are one-per-file",
        ),
      ],
      detail: "no decision index found",
    };
  }

  const idxText = port.readFile(idx) ?? "";
  const findings: Finding[] = [];
  let nIndexed = 0;
  for (const a of adrs) {
    const b = basenameOf(a);
    if (idxText.includes(b)) {
      nIndexed++;
    } else {
      findings.push(
        findingFor(
          `decisions-index-missing-adr: ${a} -- ${idx} carries no row linking it. An index missing an ` +
            `entry is worse than no index: it reads as complete, so the decision it omits is one ` +
            `nobody knows to look for`,
        ),
      );
    }
  }

  if (findings.length > 0) {
    return {
      ruleId: RULE_ID,
      verdict: "fail",
      findings,
      detail: `${findings.length} ADR(s) missing from ${idx}`,
    };
  }

  return {
    ruleId: RULE_ID,
    verdict: "pass",
    findings: [],
    detail: `all ${nIndexed} ADR(s) carry a row in ${idx}`,
  };
}
