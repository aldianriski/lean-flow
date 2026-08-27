// In-memory fake of `GitBoundaryPort` (SPRINT-087 T3, DoD 3) -- the other half of the seam alongside
// `../adapters/fs-git-boundary.ts`. No `node:fs`, no `node:child_process`, no Bun: plain data held in
// memory, so a test can build a scenario without a real git repository on disk.
//
// Domain layer (V3 §2.1) -- a test double, not test code itself, so it stays free of `bun:test`/
// `node:fs`/`node:child_process` the same way the port it implements is.

import type { GitBoundaryPort } from "./git-boundary-port.ts";

export interface InMemoryGitBoundaryScenario {
  /** `undefined`/`true` -- a git repo; `false` models "not a git repository at all". */
  readonly isRepo?: boolean;
  /** path -> tracked file text. The KEY SET is `trackedFiles()`; `readTrackedFile` looks up by it. */
  readonly files?: Readonly<Record<string, string>>;
  readonly allowedAssetDirs?: readonly string[];
  readonly generatedClasses?: readonly string[];
  readonly generatedAllowedExclusions?: readonly string[];
}

export class InMemoryGitBoundaryPort implements GitBoundaryPort {
  private readonly scenario: InMemoryGitBoundaryScenario;

  constructor(scenario: InMemoryGitBoundaryScenario) {
    this.scenario = scenario;
  }

  isGitRepo(): boolean {
    return this.scenario.isRepo ?? true;
  }

  trackedFiles(): readonly string[] {
    return Object.keys(this.scenario.files ?? {});
  }

  readTrackedFile(path: string): string | null {
    const files = this.scenario.files ?? {};
    if (!Object.prototype.hasOwnProperty.call(files, path)) return null;
    // The own-property check proves presence, but an index read is still typed
    // `string | undefined`. Narrow rather than assert, and keep the two checks distinct so a
    // present-but-empty value stays "" while only a genuinely absent path becomes null.
    const contents = files[path];
    return contents === undefined ? null : contents;
  }

  allowedAssetDirs(): readonly string[] {
    return this.scenario.allowedAssetDirs ?? [];
  }

  generatedClasses(): readonly string[] {
    return this.scenario.generatedClasses ?? [];
  }

  generatedAllowedExclusions(): readonly string[] {
    return this.scenario.generatedAllowedExclusions ?? [];
  }
}
