// In-memory fake of `AdrFamilyPort` (SPRINT-091 T6) -- the port's other implementation, alongside
// `adr-family-fixtures.test.ts`'s own fixture-to-scenario bridge (which builds one of these straight
// from a REAL retained fixture directory, since a production adapter is outside this task's Layers).
//
// Domain layer (V3 §2.1) -- a test double, not test code itself, so it stays free of `bun:test`/
// `node:fs` the same way the port it implements is, mirroring `git-boundary-port.fake.ts`'s own
// convention: each scenario field is already pre-classified the way the PORT's contract states it
// (basenames for docs/adr/ and root strays, repo-relative paths for docs-tree strays), never
// re-derived from a single raw tree here.

import type { AdrFamilyPort } from "./adr-family-port.ts";

export interface InMemoryAdrFamilyScenario {
  /** `undefined` infers from `adrDirFiles` being present (even `{}`) -- explicit always wins. */
  readonly hasAdrDir?: boolean;
  /** basename -> text, for `*.md` files directly inside `docs/adr/`. The KEY SET is
   *  `listAdrDirMdFiles()`; `readFile("docs/adr/<basename>")` looks up by it. */
  readonly adrDirFiles?: Readonly<Record<string, string>>;
  /** repo-relative path (`docs/...`) -> text, for ADR-shaped `*.md` files anywhere under `docs/`
   *  EXCLUDING `docs/adr/`. */
  readonly strayDocsFiles?: Readonly<Record<string, string>>;
  /** basename -> text, for ADR-shaped `*.md` files directly at the repo root. */
  readonly strayRootFiles?: Readonly<Record<string, string>>;
  /** The decision index, or absent for "no index found". */
  readonly indexFile?: { readonly path: string; readonly text: string };
}

export class InMemoryAdrFamilyPort implements AdrFamilyPort {
  private readonly scenario: InMemoryAdrFamilyScenario;

  constructor(scenario: InMemoryAdrFamilyScenario) {
    this.scenario = scenario;
  }

  hasAdrDir(): boolean {
    return this.scenario.hasAdrDir ?? this.scenario.adrDirFiles !== undefined;
  }

  listAdrDirMdFiles(): readonly string[] {
    return Object.keys(this.scenario.adrDirFiles ?? {});
  }

  listStrayAdrPathsUnderDocs(): readonly string[] {
    return Object.keys(this.scenario.strayDocsFiles ?? {});
  }

  listStrayAdrNamesAtRoot(): readonly string[] {
    return Object.keys(this.scenario.strayRootFiles ?? {});
  }

  findIndexPath(): string | null {
    return this.scenario.indexFile?.path ?? null;
  }

  readFile(path: string): string | null {
    const idx = this.scenario.indexFile;
    if (idx !== undefined && idx.path === path) return idx.text;

    const adrPrefix = "docs/adr/";
    if (path.startsWith(adrPrefix)) {
      const basename = path.slice(adrPrefix.length);
      const files = this.scenario.adrDirFiles ?? {};
      if (Object.prototype.hasOwnProperty.call(files, basename)) {
        const text = files[basename];
        return text === undefined ? null : text;
      }
      return null;
    }

    const strayDocs = this.scenario.strayDocsFiles ?? {};
    if (Object.prototype.hasOwnProperty.call(strayDocs, path)) {
      const text = strayDocs[path];
      return text === undefined ? null : text;
    }

    const strayRoot = this.scenario.strayRootFiles ?? {};
    if (Object.prototype.hasOwnProperty.call(strayRoot, path)) {
      const text = strayRoot[path];
      return text === undefined ? null : text;
    }

    return null;
  }
}
