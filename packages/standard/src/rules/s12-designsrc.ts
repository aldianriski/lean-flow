// S12.DESIGNSRC (spec/STANDARD.md §12b -- Structural, mechanical) -- part of SPRINT-087 T3's F12
// migration (D7).
//
// Domain layer (V3 §2.1). Imports only `../model.ts`, `../result.ts`, `./git-boundary-port.ts` -- no
// Bun, no `node:fs`. Port is the SEAM (mirrors T1): `../adapters/fs-git-boundary.ts` /
// `./git-boundary-port.fake.ts`, proved identical by `s12-designsrc.test.ts`.
//
// Mirrors scripts/lib/conformance-engine.sh's `assert_S12_DESIGNSRC`: a tracked editable design-source
// file (by EXTENSION) outside the asset directories §12 itself names ("only assets the app actually
// uses go in `public/` or `src/assets/`", read via `GitBoundaryPort.allowedAssetDirs()` -- never a size
// threshold; §12 says "large" and states no number, so size was deliberately never used here either).

import { makeRuleId } from "../model.ts";
import type { Finding, RuleEvaluation } from "../result.ts";
import type { GitBoundaryPort } from "./git-boundary-port.ts";

export const RULE_ID = makeRuleId("S12.DESIGNSRC");

/** The named findings this rule raises -- match the Shell oracle's own `bad()` prefixes byte-for-byte. */
export const DESIGN_SOURCE_COMMITTED = "design-source-committed";
export const SPEC_TABLE_UNREADABLE = "spec-table-unreadable";

/** Design-source extensions -- case-SENSITIVE, mirroring the Shell `case` glob exactly (a `.PSD`
 *  upper-case sibling is a different, untested shape neither side claims to catch). */
export function isDesignSourceShaped(path: string): boolean {
  return /\.(ai|psd|sketch|fig|xd|mp4|mov|avi|mkv)$/.test(path);
}

/** Is `path` inside one of `allowed`'s asset directories? Mirrors the Shell oracle's own glob pair
 *  (a prefix at the repo root, or the same prefix appearing after a `/`): a prefix match at the repo
 *  root, OR the allowed directory appearing as a path segment at any depth. */
export function isInsideAllowedDir(path: string, allowed: readonly string[]): boolean {
  return allowed.some((a) => path.startsWith(a) || path.includes(`/${a}`));
}

function findingFor(path: string, allowed: readonly string[]): Finding {
  return {
    name: DESIGN_SOURCE_COMMITTED,
    detail:
      `design-source-committed: ${path} is an editable design source outside the asset directories ` +
      `§12 names (${allowed.join(" ")}) -- §12 keeps originals in the design tool and lets only the ` +
      `assets the app actually uses into the repo. Size was deliberately NOT used: §12 says "large" ` +
      `and states no number`,
  };
}

export function evaluate(port: GitBoundaryPort): RuleEvaluation {
  if (!port.isGitRepo()) {
    return {
      ruleId: RULE_ID,
      verdict: "note",
      findings: [],
      detail: "not a git repository -- nothing is committed",
    };
  }

  const allowed = port.allowedAssetDirs();
  // Mirrors the Shell oracle's own guard: §12 naming NO asset directory is a finding no adopter can
  // ever clear, since an in/out distinction cannot be drawn at all -- never a silent empty pass.
  if (allowed.length === 0) {
    return {
      ruleId: RULE_ID,
      verdict: "fail",
      findings: [
        {
          name: SPEC_TABLE_UNREADABLE,
          detail:
            "spec-table-unreadable: §12 names no asset directory, so a design source inside one " +
            "cannot be told from one outside it -- and reporting both alike is a finding no adopter can clear",
        },
      ],
      detail: "§12's asset-directory sentence could not be read",
    };
  }

  const offenders = port
    .trackedFiles()
    .filter((path) => isDesignSourceShaped(path) && !isInsideAllowedDir(path, allowed));

  if (offenders.length > 0) {
    return {
      ruleId: RULE_ID,
      verdict: "fail",
      findings: offenders.map((path) => findingFor(path, allowed)),
      detail: `${offenders.length} design source(s) committed outside ${allowed.join(", ")}: ${offenders.join(", ")}`,
    };
  }

  return {
    ruleId: RULE_ID,
    verdict: "pass",
    findings: [],
    detail: `no editable design source outside the asset directories §12 names (${allowed.join(", ")})`,
  };
}
