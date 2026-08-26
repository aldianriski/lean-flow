// S12.GENERATED (spec/STANDARD.md §12c -- Structural, mechanical) -- part of SPRINT-087 T3's F12
// migration (D7).
//
// Domain layer (V3 §2.1). Imports only `../model.ts`, `../result.ts`, `./git-boundary-port.ts` -- no
// Bun, no `node:fs`. Port is the SEAM (mirrors T1): `../adapters/fs-git-boundary.ts` /
// `./git-boundary-port.fake.ts`, proved identical by `s12-generated.test.ts`.
//
// Mirrors scripts/lib/conformance-engine.sh's `assert_S12_GENERATED`: a tracked file matching one of
// §12c's own ".gitignore classes" (read via `GitBoundaryPort.generatedClasses()`), UNLESS it is the one
// path §12c explicitly permits back in (`generatedAllowedExclusions()`, subtracted BEFORE the class
// match -- L-140: an exclusion is judged by what it lets through, never by where it sits in a sentence).

import { makeRuleId } from "../model.ts";
import type { Finding, RuleEvaluation } from "../result.ts";
import type { GitBoundaryPort } from "./git-boundary-port.ts";

export const RULE_ID = makeRuleId("S12.GENERATED");

/** The named findings this rule raises -- match the Shell oracle's own `bad()` prefixes byte-for-byte. */
export const GENERATED_ARTIFACT_COMMITTED = "generated-artifact-committed";
export const SPEC_TABLE_UNREADABLE = "spec-table-unreadable";

/** POSIX glob semantics for the three §12c class shapes -- mirrors `_s12_matches_class` exactly:
 *  a directory prefix (`dist/`), an extension glob (`*.log`), or a literal path (`.DS_Store`). */
export function matchesGeneratedClass(path: string, cls: string): boolean {
  if (cls.endsWith("/")) return path.startsWith(cls) || path.includes(`/${cls}`);
  if (cls.startsWith("*")) return path.endsWith(cls.slice(1));
  return path === cls || path.endsWith(`/${cls}`);
}

/** Is `path` the one path a §12c carve-out explicitly permits? Mirrors the Shell `case "$f" in "$a"`
 *  or a nested `.../$a` path -- a literal match, never a class-shaped one (the carve-out is a single
 *  path, not a pattern). */
export function isExplicitlyAllowed(path: string, allowed: readonly string[]): boolean {
  return allowed.some((a) => path === a || path.endsWith(`/${a}`));
}

function findingFor(path: string, cls: string): Finding {
  return {
    name: GENERATED_ARTIFACT_COMMITTED,
    detail:
      `generated-artifact-committed: ${path} is tracked and matches §12c's '${cls}' class -- §12 keeps ` +
      `anything reproducible by a command out of the repo. Present-but-ignored is the compliant state ` +
      `and is not reported; this file is COMMITTED`,
  };
}

export function evaluate(port: GitBoundaryPort): RuleEvaluation {
  if (!port.isGitRepo()) {
    return {
      ruleId: RULE_ID,
      verdict: "note",
      findings: [],
      detail: "not a git repository -- §12c is about what is COMMITTED, and an untracked build directory is exactly the compliant state",
    };
  }

  const classes = port.generatedClasses();
  // Mirrors the Shell oracle's own guard: §12c naming NO classes means nothing reproducible can be
  // recognised at all -- never a silent empty pass.
  if (classes.length === 0) {
    return {
      ruleId: RULE_ID,
      verdict: "fail",
      findings: [
        {
          name: SPEC_TABLE_UNREADABLE,
          detail: "spec-table-unreadable: §12c names no .gitignore classes, so nothing reproducible can be recognised",
        },
      ],
      detail: "§12c's generated/temporary classes sentence could not be read",
    };
  }

  const allowed = port.generatedAllowedExclusions();
  const findings: Finding[] = [];
  for (const path of port.trackedFiles()) {
    if (isExplicitlyAllowed(path, allowed)) continue;
    const hitClass = classes.find((cls) => matchesGeneratedClass(path, cls));
    if (hitClass !== undefined) findings.push(findingFor(path, hitClass));
  }

  if (findings.length > 0) {
    return {
      ruleId: RULE_ID,
      verdict: "fail",
      findings,
      detail: `${findings.length} generated/temporary artifact(s) committed`,
    };
  }

  return {
    ruleId: RULE_ID,
    verdict: "pass",
    findings: [],
    detail: `no tracked file matches a §12c reproducible class (${classes.length} classes read from the spec, ${allowed.length} explicitly permitted)`,
  };
}
