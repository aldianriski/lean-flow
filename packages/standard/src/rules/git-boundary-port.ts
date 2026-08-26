// The shared port for spec/STANDARD.md §12's git-boundary family (SPRINT-087 T3): S12.SECRETS,
// S12.BACKUPS, S12.DESIGNSRC, S12.GENERATED. One port, not four -- D7 (docs/sprint's own G2 record)
// froze the family choice specifically because all four rules evaluate "against one filesystem port,
// so T1 is not forced to grow a second adapter". T1's `SprintDirPort` is a DIFFERENT shape (it lists a
// directory's own entries); this family instead needs what git tracks, what a tracked file's own text
// holds, and a few lists §12's OWN prose names -- so it gets its own port and (per built-in.ts's own
// comment) its own registry, never bolted onto S9's.
//
// Domain layer (V3 §2.1). No Bun, no `node:fs`, no `node:child_process` -- `test/architecture/
// dependency-direction.test.ts` enforces that mechanically. `../adapters/fs-git-boundary.ts` is the
// real Bun/Node adapter; `./git-boundary-port.fake.ts` is the in-memory fake. Every evaluator in this
// family (`s12-secrets.ts`, `s12-backups.ts`, `s12-designsrc.ts`, `s12-generated.ts`) takes this ONE
// port type, structurally using only the subset of methods it needs (TD-101: no `tsc`, so nothing
// enforces "unused method absent" -- the point is that ONE adapter and ONE fake serve all four,
// matching D7's own reasoning).

/** Whatever this family can answer a repository from: git's own index, tracked file text, and the
 *  handful of lists §12's prose itself names (asset directories, §12c's generated/temporary classes,
 *  and the one class §12c explicitly permits back in). */
export interface GitBoundaryPort {
  /** `git -C <repo> rev-parse --git-dir` succeeding -- mirrors every S12.* assertion's own guard. */
  isGitRepo(): boolean;

  /** `git -C <repo> ls-files` -- paths relative to the repo root, index order. Never a working-tree
   *  walk: §12 constrains what is COMMITTED, not what merely sits untracked in the tree (mirrors the
   *  Shell oracle's own `_s12_tracked`). */
  trackedFiles(): readonly string[];

  /** A tracked file's own text, by its `trackedFiles()` path -- `null` if it cannot be read (never
   *  thrown; a missing/unreadable tracked file is a confirmation failure, not a crash). Used only by
   *  S12.SECRETS/S12.BACKUPS' CONTENT confirmation step -- S12.DESIGNSRC/S12.GENERATED never call it,
   *  since both are decided by PATH shape alone. */
  readTrackedFile(path: string): string | null;

  /** §12's own words -- "only assets the app actually uses go in `public/` or `src/assets/`" -- the
   *  permitted asset directories S12.DESIGNSRC checks a design-source path against. */
  allowedAssetDirs(): readonly string[];

  /** §12c's own ".gitignore classes" list (`node_modules/`, `*.log`, `.DS_Store`, ...) -- what
   *  S12.GENERATED matches a tracked path's shape against. Includes the one path §12c also names as an
   *  explicit carve-out (`.vscode/extensions.json`); the caller subtracts `generatedAllowedExclusions()`
   *  before matching, mirroring the Shell oracle's own two-list split (`_s12_generated_classes` /
   *  `_s12_generated_allowed`, conformance-engine.sh). */
  generatedClasses(): readonly string[];

  /** §12c's one explicit "MAY be committed" carve-out (`.vscode/extensions.json`) -- subtracted from
   *  `generatedClasses()` before a tracked path is checked, never after (L-140: an exclusion is judged
   *  by what it lets through). */
  generatedAllowedExclusions(): readonly string[];
}
