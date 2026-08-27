// The git-history port for S4.APPEND (SPRINT-091 T7) -- spec/STANDARD.md §4's only Gated rule, the
// one member of the ADR family answerable only from git HISTORY, never from the tree alone (§14).
// `./adr-family-port.ts` stays exactly as T6 left it (hasAdrDir/listAdrDirMdFiles/.../readFile) --
// S4.APPEND still needs it, for the canonical ADR listing and the CURRENT (working-tree) text of each
// one, so its evaluator's port type is the INTERSECTION `AdrFamilyPort & AdrHistoryPort` (see
// `./adr-append-port.ts`), never an edit to `AdrFamilyPort` itself: extending that port would force
// every tree-only rule's fake/adapter to grow git methods it never calls, which is exactly the shape
// T6's own header warns against ("needs a different port shape entirely").
//
// Mirrors `./git-boundary-port.ts`'s own shape (SPRINT-087): a minimal port naming only what THIS
// rule reads off git, nothing S12's family needs and nothing this one doesn't.
//
// Domain layer (V3 §2.1). No Bun, no `node:child_process` -- `test/architecture/
// dependency-direction.test.ts` enforces that mechanically. `./adr-history-port.fake.ts` is this
// port's in-memory implementation; `../adapters/fs-adr-history.ts` is the real git adapter.

/** Whatever S4.APPEND can answer from git's own record: whether there is one at all, whether it is
 *  TRUNCATED (a shallow clone -- distinct from having none, per §4's own comment block), and per-path
 *  history + point-in-time content. */
export interface AdrHistoryPort {
  /** Mirrors the Shell oracle's own `_is_git_repo` guard. */
  isGitRepo(): boolean;

  /** `git rev-parse --is-shallow-repository` == "true" -- a clone whose history is deliberately
   *  truncated by fetch depth, distinct from having no repository at all. Only meaningful when
   *  `isGitRepo()` is true; a fake/adapter may return either value when it is not. */
  isShallowClone(): boolean;

  /** Commit hashes touching `path`, OLDEST FIRST -- mirrors the Shell oracle's own
   *  `git log --reverse --format=%H -- "$path"`. `[]` when the path has no commit at all (untracked,
   *  or added since the last commit). */
  revisionsTouching(path: string): readonly string[];

  /** `path`'s own text AT `revision` -- mirrors the Shell oracle's own `git show "$revision:$path"`.
   *  `null` if it cannot be read (never thrown). */
  readAtRevision(revision: string, path: string): string | null;

  /** A short, human-readable form of `revision` -- mirrors the Shell oracle's own
   *  `git rev-parse --short "$revision"`, used only in a finding's own message text. */
  shortRevision(revision: string): string;
}
