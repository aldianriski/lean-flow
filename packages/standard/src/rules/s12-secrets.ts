// S12.SECRETS (spec/STANDARD.md §12b -- Structural, mechanical) -- part of SPRINT-087 T3's F12
// migration (D7): the git boundary's four mechanical rules, this one first alphabetically among the
// family's evaluators.
//
// Domain layer (V3 §2.1). Imports only `../model.ts`, `../result.ts`, `./git-boundary-port.ts` -- no
// Bun, no `node:fs`. The port is the SEAM (D3, mirrored from T1): `../adapters/fs-git-boundary.ts` and
// `./git-boundary-port.fake.ts` both implement `GitBoundaryPort`, and `s12-secrets.test.ts` proves this
// evaluator identical against either.
//
// Mirrors scripts/lib/conformance-engine.sh's `assert_S12_SECRETS`: a tracked file whose NAME has a
// credential SHAPE (`.env`, `*.pem`/`*.key`, an SSH private-key basename, a service-account JSON name)
// AND whose CONTENT confirms a real value (not a placeholder/template) is a committed secret (§12b).

import { makeRuleId } from "../model.ts";
import type { Finding, RuleEvaluation } from "../result.ts";
import type { GitBoundaryPort } from "./git-boundary-port.ts";

export const RULE_ID = makeRuleId("S12.SECRETS");

/** The named finding this rule raises -- matches the Shell oracle's own `bad()` prefix byte-for-byte. */
export const SECRET_COMMITTED = "secret-committed";

type SecretShape = "env" | "pem" | "sa";

/** `path`'s basename -- POSIX-only (git's own paths are always `/`-separated, regardless of host OS),
 *  so no `node:path` is needed and this stays domain. */
function basename(path: string): string {
  const idx = path.lastIndexOf("/");
  return idx === -1 ? path : path.slice(idx + 1);
}

/** The credential SHAPE a tracked file's basename matches, or `null` -- mirrors `assert_S12_SECRETS`'s
 *  `case "$b" in ...)` exactly: the canonical `.env.example`/`.env.sample`/`.env.template` names are
 *  deliberately absent (a placeholder file is the CORRECT artifact to commit; flagging it teaches
 *  adopters to distrust the report). */
export function secretShapeOf(basename_: string): SecretShape | null {
  if (/\.(pem|key)$/.test(basename_)) return "pem";
  switch (basename_) {
    case ".env":
    case ".env.local":
    case ".env.production":
    case ".env.development":
    case ".env.staging":
      return "env";
    case "id_rsa":
    case "id_dsa":
    case "id_ecdsa":
    case "id_ed25519":
      return "pem";
    case "service-account.json":
    case "serviceaccount.json":
      return "sa";
    default:
      return null;
  }
}

/** Does an `.env`-shaped file's TEXT confirm a real assignment -- not a comment, not an empty value,
 *  not an obvious placeholder? Mirrors the Shell oracle's awk CONFIRMATION exactly: strip one optional
 *  leading/trailing quote and surrounding whitespace, lower-case, then reject `<...>`, or any of
 *  `changeme`/`your-`/`your_`/`placeholder`/`example`/`xxx+`/`todo`/`...`. */
export function envConfirmsRealValue(content: string): boolean {
  for (const line of content.split("\n")) {
    if (/^\s*#/.test(line)) continue;
    const m = /^\s*[A-Za-z_][A-Za-z0-9_]*\s*=/.exec(line);
    if (!m) continue;
    const eq = line.indexOf("=");
    let v = line.slice(eq + 1);
    v = v.replace(/^\s*["']?/, "").replace(/["']?\s*$/, "");
    if (v === "") continue;
    const lv = v.toLowerCase();
    if (/^<.*>$/.test(lv)) continue;
    if (/changeme|your[-_]|placeholder|example|xxx+|todo|\.\.\./.test(lv)) continue;
    return true;
  }
  return false;
}

interface Offender {
  readonly path: string;
  readonly detail: string;
}

function confirm(path: string, shape: SecretShape, content: string): Offender | null {
  switch (shape) {
    case "env":
      return envConfirmsRealValue(content)
        ? {
            path,
            detail:
              `secret-committed: ${path} carries at least one assignment with a real value -- §12 puts ` +
              `credentials in a secret manager, never in git. Even a private repo is treated as ` +
              `potentially exposed, and history keeps the value after the file is deleted`,
          }
        : null;
    case "pem":
      return content.includes("PRIVATE KEY")
        ? {
            path,
            detail:
              `secret-committed: ${path} contains a PRIVATE KEY block -- §12 puts credentials in a ` +
              `secret manager. A public certificate in the same file shape is fine; a private key is ` +
              `the thing that must never be committed`,
          }
        : null;
    case "sa":
      return content.includes('"private_key"')
        ? {
            path,
            detail:
              `secret-committed: ${path} is a service-account file carrying a "private_key" field -- ` +
              `§12 puts credentials in a secret manager. This one key is usually enough to reach ` +
              `production infrastructure`,
          }
        : null;
  }
}

function findingFor(offender: Offender): Finding {
  return { name: SECRET_COMMITTED, detail: offender.detail };
}

export function evaluate(port: GitBoundaryPort): RuleEvaluation {
  if (!port.isGitRepo()) {
    return {
      ruleId: RULE_ID,
      verdict: "note",
      findings: [],
      detail: "not a git repository -- §12 is about what is COMMITTED, and an untracked tree has committed nothing",
    };
  }

  const offenders: Offender[] = [];
  for (const path of port.trackedFiles()) {
    const shape = secretShapeOf(basename(path));
    if (!shape) continue;
    const content = port.readTrackedFile(path);
    if (content === null) continue;
    const offender = confirm(path, shape, content);
    if (offender) offenders.push(offender);
  }

  if (offenders.length > 0) {
    return {
      ruleId: RULE_ID,
      verdict: "fail",
      findings: offenders.map(findingFor),
      detail: `${offenders.length} secret(s) committed: ${offenders.map((o) => o.path).join(", ")}`,
    };
  }

  return {
    ruleId: RULE_ID,
    verdict: "pass",
    findings: [],
    detail: "no tracked file pairs a credential SHAPE with credential CONTENT",
  };
}
