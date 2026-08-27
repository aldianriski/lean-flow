// S4.ONEFILE (spec/STANDARD.md §4 -- Structural, mechanical) -- part of SPRINT-091 T6's §4 ADR
// migration (D1): "one file per ADR at docs/adr/ADR-NNN-<slug>.md" is three separate claims, not one --
// a rule checking only the filename pattern would silently pass the two sub-cases that actually
// corrupt an index: a canonically-named ADR sitting somewhere else, and two files claiming the same
// number. All three are reported under this rule's one published finding name, each naming which
// sub-case it hit -- mirroring scripts/lib/conformance-engine.sh's own `assert_S4_ONEFILE` exactly.
//
// Domain layer (V3 §2.1). Imports only `../model.ts`, `../result.ts`, `./adr-family-port.ts` -- no
// Bun, no `node:fs`. The port is the SEAM: `./adr-family-port.fake.ts` and
// `adr-family-fixtures.test.ts`'s own fixture-to-scenario bridge both supply it.

import { makeRuleId } from "../model.ts";
import type { Finding, RuleEvaluation } from "../result.ts";
import type { AdrFamilyPort } from "./adr-family-port.ts";
import { isCanonicalAdrName } from "./adr-family.ts";

export const RULE_ID = makeRuleId("S4.ONEFILE");

/** The named finding this rule raises -- matches the Shell oracle's own `bad()` prefix byte-for-byte. */
export const ADR_PATH_NONCANONICAL = "adr-path-noncanonical";

function findingFor(detail: string): Finding {
  return { name: ADR_PATH_NONCANONICAL, detail };
}

export function evaluate(port: AdrFamilyPort): RuleEvaluation {
  if (!port.hasAdrDir()) {
    return {
      ruleId: RULE_ID,
      verdict: "note",
      findings: [],
      detail: "no docs/adr/ directory; whether this repo owes ADRs is §2's question, not this rule's -- nothing to verify",
    };
  }

  const findings: Finding[] = [];
  let nOk = 0;
  const seenNums = new Map<string, string>(); // "ADR-NNN" -> the basename that first claimed it

  for (const b of port.listAdrDirMdFiles().slice().sort()) {
    if (!isCanonicalAdrName(b)) {
      findings.push(
        findingFor(
          `adr-path-noncanonical: docs/adr/${b} -- §4 requires one file per ADR named ` +
            `ADR-NNN-<slug>.md (three-digit number, kebab-case slug). A file in docs/adr/ that is not ` +
            `one is either a mis-named ADR nothing will index, or a non-ADR document in the ADR set`,
        ),
      );
      continue;
    }
    const num = b.slice(0, 7); // "ADR-NNN"
    const prev = seenNums.get(num);
    if (prev !== undefined) {
      findings.push(
        findingFor(
          `adr-path-noncanonical: docs/adr/${b} -- ${num} is already claimed by docs/adr/${prev}. §4 ` +
            `is one file per ADR: two files sharing a number means the index, every cross-reference ` +
            `and every 'superseded by' pointer are ambiguous about which one they mean`,
        ),
      );
      continue;
    }
    seenNums.set(num, b);
    nOk++;
  }

  // A canonically-named ADR OUTSIDE docs/adr/ is the sub-case a docs/adr/-only listing cannot see --
  // reported regardless of what the loop above already found, mirroring the Shell oracle's own
  // "always compute strays" shape (never short-circuited by an earlier bad()).
  const strays = [...new Set([...port.listStrayAdrPathsUnderDocs(), ...port.listStrayAdrNamesAtRoot()])]
    .slice()
    .sort();
  for (const s of strays) {
    findings.push(
      findingFor(
        `adr-path-noncanonical: ${s} -- an ADR-NNN-named file outside docs/adr/. §4 fixes the location ` +
          `as well as the name: an ADR the canonical path does not reach is invisible to the index ` +
          `rule, the append-only rule and every reader who looks where the standard says to look`,
      ),
    );
  }

  if (findings.length > 0) {
    return {
      ruleId: RULE_ID,
      verdict: "fail",
      findings,
      detail: `${findings.length} ADR path issue(s) -- §4 requires one file per ADR at a canonical path`,
    };
  }

  if (nOk === 0) {
    return {
      ruleId: RULE_ID,
      verdict: "note",
      findings: [],
      detail: "docs/adr/ exists but holds no ADR-NNN-<slug>.md file -- nothing to verify",
    };
  }

  return {
    ruleId: RULE_ID,
    verdict: "pass",
    findings: [],
    detail: `all ${nOk} ADR(s) sit at a canonical one-file-per-ADR path`,
  };
}
