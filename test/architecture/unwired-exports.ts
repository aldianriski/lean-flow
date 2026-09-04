// Detects a shipped capability nothing calls: an exported symbol in `packages/` or `apps/` reached
// by zero non-test imports (SPRINT-094 T3). L-172's durable form is already in CLAUDE.md § Definition
// of Done -- "the wiring property is asked of the repository, never of the author... the property is
// mechanically detectable, so derive it." This is that derivation.
//
// SCOPE, narrowed on evidence per the Plan's own A3 clause: this checker covers a symbol reached by a
// literal ES import (`import { name } from "./x.ts"`) -- not one reached only through a registry
// STRING lookup. A3 re-derived the class against the sprint's three real motivating artifacts
// (attachLevel; createF4Registry/createS4AppendRegistry; TD-103's reconcile/marksInStandard) and found
// every one of them reached by a literal import, so the narrower class is the one the evidence
// supports; a registry-string-only symbol is out of scope here (Plan's A3: "if a symbol reached only
// through a registry string proves undetectable statically, the scope narrows to exported symbols and
// says so — narrowing on evidence, not quietly").
//
// MATCH BY SHAPE, NOT SUBSTRING (L-108). A "caller" is a resolved import EDGE: an importing file's
// specifier resolves to the defining file, and the imported name matches -- never a grep for the bare
// identifier anywhere in the corpus. `marksInStandard` names itself FOUR times inside its own doc
// comments in `packages/standard/src/spec-reader.ts` (three prose mentions plus the export itself); a
// naive "is this identifier mentioned anywhere" query would read that file as its own caller. Comments
// are stripped before import statements are read (reusing `scan()` from `./layers.ts`, so a comment
// mention can never even reach the import matcher), and an edge whose importer resolves to the SAME
// file as the definer is excluded defensively on top of that, even though no self-import exists in
// this codebase today. `test/fixtures/unwired-exports/self-reference/` fixes this in a retained
// fixture (TD-012) shaped exactly like `marksInStandard`'s real file.
//
// "TEST" excludes both the runner's own convention (`.test.ts` / `.spec.ts`) and this repo's test-
// double convention (`.fake.ts`): every `*.fake.ts` export in the live tree is imported ONLY from
// `*.test.ts` files (confirmed by grep before writing this list), so a fake's own exports are not a
// "shipped capability nothing calls" -- they exist to be called BY tests. Excluding them is what keeps
// the live-repo run from reporting every test double in `packages/standard/src/rules/*.fake.ts` as a
// false positive on its first run against real code.
//
// Local, relative imports only: every local specifier in this codebase already carries an explicit
// `.ts` extension (verified before writing the resolver), so no extension-inference is implemented --
// adding it with nothing to exercise it would be speculative code the simplicity ladder forbids.

import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, posix, relative, sep } from "node:path";
import { MARK_L, MARK_R, scan } from "./layers.ts";

export interface SourceFile {
  readonly path: string; // repo-relative, forward-slash
  readonly content: string;
}

export interface UnwiredFinding {
  /** Named finding — a fixture must fail with ITS finding, never a generic one (CLAUDE.md · L-058). */
  readonly finding: "unwired-export";
  readonly symbol: string;
  readonly file: string;
}

export interface UnwiredReport {
  readonly findings: readonly UnwiredFinding[];
  /** Denominator: a clean report must say what it examined, or a vacuous pass is invisible (L-156). */
  readonly filesExamined: number;
  readonly symbolsExamined: number;
}

const TEST_SUFFIXES = [".test.ts", ".spec.ts", ".fake.ts"];

/** Shape, not substring: an exact suffix match, never "does the path contain the word test". */
export function isTestAdjacent(path: string): boolean {
  return TEST_SUFFIXES.some((s) => path.endsWith(s));
}

const EXPORT_RE =
  /(?:^|\n)[ \t]*export[ \t]+(?:async[ \t]+)?function[ \t]+([A-Za-z_$][\w$]*)|(?:^|\n)[ \t]*export[ \t]+const[ \t]+([A-Za-z_$][\w$]*)|(?:^|\n)[ \t]*export[ \t]+class[ \t]+([A-Za-z_$][\w$]*)/g;

// `export { name [as alias], ... };` -- a DECLARE-THEN-BRACE export list, distinct from a re-export
// (`export { x } from "./y"`), which is excluded by the trailing negative lookahead and stays out of
// scope here (reviewer's Finding 3: barrels-as-caller-edges is filed as debt, not this retry's job).
// `export type { X };` (the WHOLE clause) is captured separately (group 1) so it can be excluded
// entirely -- nothing "calls" a type, same reasoning as the import side's `import type { X }`. An
// INLINE `{ type X, real }` member is handled per-entry below, since the clause-level flag alone can't
// tell the two apart.
const EXPORT_LIST_RE = /(?:^|\n)[ \t]*export[ \t]+(type[ \t]+)?\{([^}]*)\}(?![ \t]*from\b)/g;

// `export default function NAME(...)`, `export default class NAME {...}`, and the anonymous forms of
// both. A default export has no importer-chosen name to match on (`import Anything from "./x"` binds
// regardless of local name), so it is tracked under the fixed symbolic name "default" -- the same
// identity JS itself uses for the module namespace object's `.default` property.
const EXPORT_DEFAULT_RE = /(?:^|\n)[ \t]*export[ \t]+default[ \t]+(?:async[ \t]+)?(?:function|class)\b/g;

/** Every checkable export declared in `src` -- named function/const/class, a declare-then-brace
 *  export list (`export { a, b as c }`), and a default export -- read off a comment-and-string-
 *  stripped skeleton so a mention inside a doc comment or a string literal can never be read as a
 *  declaration. `export type` / `export interface` (bare or inside a brace list) are deliberately
 *  excluded: nothing "calls" a type, so treating one as a checkable symbol would be noise this
 *  checker's DoD never asked for. `export * from "./x"` is deliberately NOT covered here: a wildcard
 *  re-export forwards an unenumerable, unknown-in-advance set of names from ANOTHER module -- it
 *  introduces no symbol of its OWN in this file for `exportedSymbolsOf` to name, so there is nothing
 *  for this function to report. What it must not do is misparse or swallow a real sibling export on
 *  the same file, which `test/architecture/unwired-exports.test.ts` exercises directly. */
export function exportedSymbolsOf(src: string): string[] {
  const { skeleton } = scan(src);
  const names: string[] = [];

  EXPORT_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = EXPORT_RE.exec(skeleton)) !== null) {
    const name = m[1] ?? m[2] ?? m[3];
    if (name) names.push(name);
  }

  EXPORT_LIST_RE.lastIndex = 0;
  while ((m = EXPORT_LIST_RE.exec(skeleton)) !== null) {
    if (m[1] !== undefined) continue; // `export type { ... }` -- the WHOLE clause is type-only
    const list = m[2];
    if (list === undefined) continue;
    for (const raw of list.split(",")) {
      const trimmed = raw.trim();
      if (!trimmed || /^type\s+/.test(trimmed)) continue; // inline `type X` member -- not checkable
      const parts = trimmed.split(/\s+as\s+/);
      const publicName = (parts.length > 1 ? parts[1] : parts[0])?.trim();
      if (publicName) names.push(publicName); // `as default` correctly lands on "default"
    }
  }

  EXPORT_DEFAULT_RE.lastIndex = 0;
  if (EXPORT_DEFAULT_RE.test(skeleton)) names.push("default");

  return names;
}

const MARK = MARK_L + "(\\d+)" + MARK_R;
// The optional leading `Name,` handles a COMBINED default + named import (`import Widget, { helper }
// from "./x"`) -- the default portion is captured separately by IMPORT_DEFAULT_RE below, so it is
// deliberately not captured here, only skipped over so the named brace list is still reached.
const IMPORT_NAMED_RE = new RegExp(
  "import[ \\t]+(?:[A-Za-z_$][\\w$]*[ \\t]*,[ \\t]*)?(type[ \\t]+)?\\{([^}]*)\\}[ \\t]+from[ \\t]*" + MARK,
  "g",
);

// `import Name from "./x.ts"` / `import Name, { a, b } from "./x.ts"` -- a DEFAULT import binding.
// The local name (`Name`) is the importer's OWN choice and carries no information about the export's
// identity, so it is not captured; what matters is only that a default-import clause exists for this
// specifier, tracked as the fixed symbolic name "default" (matching exportedSymbolsOf's convention).
// `(?!type\b)` excludes `import type Name from` (erased at compile time, not a real caller); the
// identifier class `[A-Za-z_$]…` structurally excludes `import * as ns from` (a namespace import --
// Finding 3/4's territory, deliberately left alone this retry) since `*` cannot start an identifier.
const IMPORT_DEFAULT_RE = new RegExp(
  "import[ \\t]+(?!type\\b)[A-Za-z_$][\\w$]*[ \\t]*(?:,[ \\t]*\\{[^}]*\\})?[ \\t]+from[ \\t]*" + MARK,
  "g",
);

export interface ImportedBinding {
  readonly name: string;
  readonly specifier: string;
}

/** Every checkable import binding in `src`, paired with its literal specifier -- read off the same
 *  stripped skeleton `exportedSymbolsOf` uses, so a specifier or name mentioned in prose can never be
 *  read as a real import. Covers `{ a, b as c }` named imports (resolved to their ORIGINAL name, since
 *  what this checker tracks is the defining module's own export identity, not what a caller renamed it
 *  to) and a default import (`import Name from "./x"`, tracked as the fixed name "default"). A
 *  type-only binding -- the whole named clause (`import type { X }`), one member of it (`{ type X }`),
 *  or a type-only default (`import type Name from`) -- is skipped entirely: it is erased at compile
 *  time, so it is not a runtime caller, and it can only ever pair with an EXPORTED TYPE, which
 *  `exportedSymbolsOf` never reports as a checkable symbol (nothing "calls" a type). A namespace import
 *  (`import * as ns from`) is deliberately NOT covered -- Finding 3/4's territory, out of scope here. */
export function importedBindingsOf(src: string): ImportedBinding[] {
  const { skeleton, strings } = scan(src);
  const out: ImportedBinding[] = [];

  IMPORT_NAMED_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = IMPORT_NAMED_RE.exec(skeleton)) !== null) {
    if (m[1] !== undefined) continue; // `import type { ... }` -- no runtime bindings at all
    const specifier = strings[Number(m[3])];
    if (specifier === undefined) continue;
    const names = m[2];
    if (names === undefined) continue;
    for (const raw of names.split(",")) {
      const trimmed = raw.trim();
      if (!trimmed || /^type\s+/.test(trimmed)) continue; // inline `type X` member -- not a caller
      const original = trimmed.split(/\s+as\s+/)[0]?.trim();
      if (original) out.push({ name: original, specifier });
    }
  }

  IMPORT_DEFAULT_RE.lastIndex = 0;
  while ((m = IMPORT_DEFAULT_RE.exec(skeleton)) !== null) {
    const specifier = strings[Number(m[1])];
    if (specifier === undefined) continue;
    out.push({ name: "default", specifier });
  }

  return out;
}

/** A relative specifier resolved against its importer's own repo-relative path, into another
 *  repo-relative path. A bare specifier (`bun:test`, an npm package, `node:fs`) resolves to `null` --
 *  it can never be a local export site, so it is never a candidate edge. */
export function resolveSpecifier(importerRepoPath: string, specifier: string): string | null {
  if (!specifier.startsWith(".")) return null;
  const dir = posix.dirname(importerRepoPath);
  return posix.normalize(posix.join(dir, specifier));
}

// NO "fixtures" exclusion here (Finding 2, review). `layers.ts`'s own walker skips a directory named
// `fixtures` because THIS repo's test fixtures happen to live under a `fixtures/` path -- but
// `readSourcesAtCommit` below has no such filter, so copying that exclusion here made the two readers
// disagree on any tree containing a directory literally named `fixtures` under `apps/`/`packages/`
// (reproduced: disk saw 1 file, commit saw 2, for the same tree). Since this repo's own fixtures live
// at top-level `test/fixtures/` -- never nested under `apps/`/`packages/` -- the exclusion was dead
// weight that only this file needed to drop for the two readers to provably agree (see the
// "reader agreement" test in unwired-exports.test.ts).
function walk(dir: string, acc: string[]): string[] {
  let entries: string[];
  try {
    entries = readdirSync(dir);
  } catch {
    return acc;
  }
  for (const e of entries) {
    if (e === "node_modules" || e === ".git") continue;
    const full = join(dir, e);
    if (statSync(full).isDirectory()) walk(full, acc);
    else if (e.endsWith(".ts") && !e.endsWith(".d.ts")) acc.push(full);
  }
  return acc;
}

/** Reads every `.ts` file under `roots` (default `apps/`, `packages/`) off the real filesystem,
 *  relative to `root`. CRLF is normalised to LF at read time -- this is a Windows CRLF checkout
 *  (`core.autocrlf=true`, no override for `*.ts`), so a fixture file arrives with `\r\n` line endings
 *  and the export/import regexes above are written against a normalised skeleton. */
export function readSourcesFromDisk(root: string, roots: readonly string[] = ["apps", "packages"]): SourceFile[] {
  const out: SourceFile[] = [];
  for (const r of roots) {
    for (const full of walk(join(root, r), [])) {
      const rel = relative(root, full).split(sep).join("/");
      out.push({ path: rel, content: readFileSync(full, "utf8").replace(/\r\n/g, "\n") });
    }
  }
  return out;
}

/** Reads every `.ts` file under `roots` as they existed at `commit`, via `git ls-tree` + ONE
 *  `git cat-file --batch` call -- no checkout, no temp directory. `execFileSync` mirrors this repo's
 *  own convention for shelling out to git from a TS test (`test/fixtures/git-repo-factory.ts`). Lets
 *  DoD 2 point the checker at a HISTORICAL commit ("before SPRINT-091 T11 wired it") without
 *  disturbing the working tree a running `bun test` is executing from.
 *
 *  Batched deliberately: a first cut spawned one `git show` PER FILE (71 files at the T12 commit),
 *  which measured over 11s against `bunfig.toml`'s 5s per-test budget and timed out. `git cat-file
 *  --batch` reads every blob over ONE subprocess -- fixed cost, not one spawn per file -- which is the
 *  same reason this repo's own harnesses stay on the cheap-and-git-free side wherever they can (see
 *  `scripts/qa-check.sh`'s "measured under a second" comments): the fix is mechanical, not a raised
 *  timeout. */
export function readSourcesAtCommit(
  repoDir: string,
  commit: string,
  roots: readonly string[] = ["apps", "packages"],
): SourceFile[] {
  const listing = execFileSync("git", ["-C", repoDir, "ls-tree", "-r", commit, "--", ...roots], { encoding: "utf8" });
  const entries: Array<{ sha: string; path: string }> = [];
  for (const line of listing.split("\n")) {
    const tab = line.indexOf("\t");
    if (tab === -1) continue;
    const path = line.slice(tab + 1);
    if (!path.endsWith(".ts") || path.endsWith(".d.ts")) continue;
    const meta = line.slice(0, tab).split(" ").filter(Boolean);
    const sha = meta[2];
    if (sha) entries.push({ sha, path });
  }
  if (entries.length === 0) return [];

  const batchInput = entries.map((e) => e.sha).join("\n") + "\n";
  const batchOut = execFileSync("git", ["-C", repoDir, "cat-file", "--batch"], {
    input: batchInput,
    maxBuffer: 64 * 1024 * 1024,
  });

  const out: SourceFile[] = [];
  let offset = 0;
  const NL = 10; // '\n'
  for (const entry of entries) {
    const headerEnd = batchOut.indexOf(NL, offset);
    const header = batchOut.subarray(offset, headerEnd).toString("utf8"); // "<sha> <type> <size>"
    const size = Number(header.split(" ")[2]);
    const contentStart = headerEnd + 1;
    const content = batchOut.subarray(contentStart, contentStart + size).toString("utf8");
    out.push({ path: entry.path, content: content.replace(/\r\n/g, "\n") });
    offset = contentStart + size + 1; // +1 skips the trailing newline `cat-file --batch` appends
  }
  return out;
}

/** The core detector, decoupled from I/O: given a corpus of sources, report every non-test export
 *  with zero non-test importers. Domain logic only -- `checkUnwired`/`checkUnwiredAtCommit` below are
 *  the two adapters that supply `sources` (a real directory, a historical commit). */
export function checkUnwiredSources(sources: readonly SourceFile[]): UnwiredReport {
  interface ExportSite {
    readonly name: string;
    readonly file: string;
  }
  const exportSites: ExportSite[] = [];
  for (const f of sources) {
    if (isTestAdjacent(f.path)) continue; // a test double's own exports exist to be called BY tests
    for (const name of exportedSymbolsOf(f.content)) exportSites.push({ name, file: f.path });
  }

  const callers = new Map<string, Set<string>>(); // `${definingFile}::${name}` -> importer files
  for (const f of sources) {
    if (isTestAdjacent(f.path)) continue; // a test importer is never a "caller" for this checker
    for (const { name, specifier } of importedBindingsOf(f.content)) {
      const resolved = resolveSpecifier(f.path, specifier);
      if (resolved === null) continue;
      if (resolved === f.path) continue; // self-import edge, excluded defensively (see file header)
      const key = resolved + "::" + name;
      const set = callers.get(key) ?? new Set<string>();
      set.add(f.path);
      callers.set(key, set);
    }
  }

  const findings: UnwiredFinding[] = [];
  for (const site of exportSites) {
    const key = site.file + "::" + site.name;
    const set = callers.get(key);
    if (!set || set.size === 0) {
      findings.push({ finding: "unwired-export", symbol: site.name, file: site.file });
    }
  }

  return { findings, filesExamined: sources.length, symbolsExamined: exportSites.length };
}

/** Adapter: check a real directory on disk (a fixture, or the live repo). */
export function checkUnwired(root: string, roots?: readonly string[]): UnwiredReport {
  return checkUnwiredSources(readSourcesFromDisk(root, roots));
}

/** Adapter: check the tree as it existed at a historical commit, without a checkout. */
export function checkUnwiredAtCommit(repoDir: string, commit: string, roots?: readonly string[]): UnwiredReport {
  return checkUnwiredSources(readSourcesAtCommit(repoDir, commit, roots));
}
