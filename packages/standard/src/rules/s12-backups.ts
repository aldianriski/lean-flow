// S12.BACKUPS (spec/STANDARD.md §12b -- Structural, mechanical) -- part of SPRINT-087 T3's F12
// migration (D7).
//
// Domain layer (V3 §2.1). Imports only `../model.ts`, `../result.ts`, `./git-boundary-port.ts` -- no
// Bun, no `node:fs`. Port is the SEAM (mirrors T1): `../adapters/fs-git-boundary.ts` /
// `./git-boundary-port.fake.ts`, proved identical by `s12-backups.test.ts`.
//
// Mirrors scripts/lib/conformance-engine.sh's `assert_S12_BACKUPS`: a tracked `.sql`/`.dump`/`.bak`
// file whose CONTENT carries a database dump-tool preamble (not merely the extension -- §12 itself
// says "small FAKE seed files are fine in-repo", so the discriminator can only be the generator's own
// banner, never a size threshold the standard never set -- L-097).

import { makeRuleId } from "../model.ts";
import type { Finding, RuleEvaluation } from "../result.ts";
import type { GitBoundaryPort } from "./git-boundary-port.ts";

export const RULE_ID = makeRuleId("S12.BACKUPS");

/** The named finding this rule raises -- matches the Shell oracle's own `bad()` prefix byte-for-byte. */
export const DATABASE_BACKUP_COMMITTED = "database-backup-committed";

/** `.sql`/`.dump`/`.bak` by extension -- the same three the Shell `case "$f" in *.sql|*.dump|*.bak)`
 *  matches. */
export function isBackupShaped(path: string): boolean {
  return /\.(sql|dump|bak)$/.test(path);
}

/** A dump-tool's own preamble -- the CONFIRMATION, mirrored case-insensitively from the Shell oracle's
 *  `grep -qiE`. */
const DUMP_PREAMBLE_RE =
  /PostgreSQL database dump|MySQL dump|SQLite format|Dumped from database version|pg_dump|mysqldump|Server version.*Database:/i;

export function confirmsDumpPreamble(content: string): boolean {
  return DUMP_PREAMBLE_RE.test(content);
}

function findingFor(path: string): Finding {
  return {
    name: DATABASE_BACKUP_COMMITTED,
    detail:
      `database-backup-committed: ${path} carries a database dump preamble -- §12 keeps backups in ` +
      `backup storage. A small FAKE seed file is fine in-repo and is not this: the file names its own ` +
      `generator, so it is an export of a real database`,
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

  const offenders: string[] = [];
  for (const path of port.trackedFiles()) {
    if (!isBackupShaped(path)) continue;
    const content = port.readTrackedFile(path);
    if (content === null) continue;
    if (confirmsDumpPreamble(content)) offenders.push(path);
  }

  if (offenders.length > 0) {
    return {
      ruleId: RULE_ID,
      verdict: "fail",
      findings: offenders.map(findingFor),
      detail: `${offenders.length} database backup(s) committed: ${offenders.join(", ")}`,
    };
  }

  return {
    ruleId: RULE_ID,
    verdict: "pass",
    findings: [],
    detail: "no tracked .sql/.dump/.bak carries a dump-tool preamble -- §12 permits small fake seed files, which these are",
  };
}
