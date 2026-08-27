// The shared port for spec/STANDARD.md §4's tree-answerable ADR rules (SPRINT-091 T6): S4.ONEFILE,
// S4.INDEX, S4.SECTIONS, S4.NEGATIVE. One port, not four -- all four are Structural (§14: answerable
// from the tree alone), so they share exactly what a directory listing plus a few file reads can
// answer. S4.APPEND is deliberately EXCLUDED from this port: it is Gated (answerable only from git
// HISTORY, per §14), needs a different port shape entirely, and is T7's (Depends-on: T6).
//
// Domain layer (V3 §2.1). No Bun, no `node:fs` -- `test/architecture/dependency-direction.test.ts`
// enforces that mechanically. `./adr-family-port.fake.ts` is this port's in-memory implementation; a
// real filesystem adapter under `../adapters/` is OUT of this task's Layers (T7's, alongside the git
// adapter S4.APPEND needs) -- this task's own parity proof instead builds an in-memory port straight
// from the retained fixtures inside its own `*.test.ts` file (the test-file exemption
// `test/architecture/layers.ts` already carves out), never by adding a production adapter here.
//
// Mirrors scripts/lib/conformance-engine.sh's own §4 helpers: `_adr_canonical` (docs/adr/'s own
// listing), the `assert_S4_ONEFILE` strays search (an ADR-NNN-named file anywhere else under docs/, or
// sitting at the repo root), and the DECISIONS.md-or-DECISIONS.md index lookup every one of ONEFILE,
// INDEX, SECTIONS and NEGATIVE ultimately reads through.

/** Whatever this family can answer a repository from: docs/adr/'s own (non-recursive) listing, the
 *  ADR-shaped stragglers §4's ONEFILE rule must also see, the decision index, and any of those files'
 *  own text. */
export interface AdrFamilyPort {
  /** Whether `docs/adr/` exists at all. */
  hasAdrDir(): boolean;

  /** Basenames of `*.md` files directly inside `docs/adr/` -- non-recursive, mirrors the Shell
   *  oracle's own `for f in "$repo"/docs/adr/*.md`. Includes non-canonically-named files too; naming
   *  shape is judged by the caller, not filtered out here. */
  listAdrDirMdFiles(): readonly string[];

  /** Repo-relative POSIX paths (`docs/...`) of `*.md` files ANYWHERE under `docs/` whose basename
   *  matches the canonical `ADR-NNN-<slug>.md` shape, EXCLUDING anything under `docs/adr/` itself --
   *  mirrors the Shell oracle's own recursive `find "$repo/docs" ... | grep -v '^docs/adr/'`. */
  listStrayAdrPathsUnderDocs(): readonly string[];

  /** Basenames of `*.md` files directly at the repo ROOT (non-recursive) whose name matches the
   *  canonical `ADR-NNN-<slug>.md` shape -- mirrors the Shell oracle's own
   *  `for rf in "$repo"/ADR-[0-9][0-9][0-9]-*.md`. */
  listStrayAdrNamesAtRoot(): readonly string[];

  /** The repo-relative path of the decision index -- `docs/DECISIONS.md` preferred, then
   *  `DECISIONS.md` at the repo root -- or `null` if neither exists. Mirrors the Shell oracle's own
   *  `for cand in docs/DECISIONS.md DECISIONS.md`. */
  findIndexPath(): string | null;

  /** A repo-relative path's own text -- the index file, or any ADR under `docs/adr/`, or a stray this
   *  port's own listing methods named. `null` if it cannot be read (never thrown). */
  readFile(path: string): string | null;
}
