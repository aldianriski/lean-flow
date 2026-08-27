// In-memory fake of `AdrHistoryPort` (SPRINT-091 T7) -- the other half of the seam alongside
// `../adapters/fs-adr-history.ts`. No `node:child_process`: plain data held in memory, so a test can
// build a scenario without a real git repository on disk.
//
// Domain layer (V3 §2.1) -- a test double, not test code itself, so it stays free of `bun:test`/
// `node:child_process` the same way the port it implements is, mirroring
// `git-boundary-port.fake.ts`'s own convention.

import type { AdrHistoryPort } from "./adr-history-port.ts";

function revisionKey(revision: string, path: string): string {
  return `${revision}:${path}`;
}

export interface InMemoryAdrHistoryScenario {
  /** `undefined`/`true` -- a git repo; `false` models "not a git repository at all". */
  readonly isRepo?: boolean;
  /** `undefined`/`false` -- full history; `true` models a shallow clone. */
  readonly isShallow?: boolean;
  /** repo-relative path -> commit hashes touching it, OLDEST FIRST. Absent/empty means "no commit
   *  touches this path". */
  readonly revisionsByPath?: Readonly<Record<string, readonly string[]>>;
  /** `"<revision>:<path>"` -> the file's text at that revision. */
  readonly contentAtRevision?: Readonly<Record<string, string>>;
}

export class InMemoryAdrHistoryPort implements AdrHistoryPort {
  private readonly scenario: InMemoryAdrHistoryScenario;

  constructor(scenario: InMemoryAdrHistoryScenario) {
    this.scenario = scenario;
  }

  isGitRepo(): boolean {
    return this.scenario.isRepo ?? true;
  }

  isShallowClone(): boolean {
    return this.scenario.isShallow ?? false;
  }

  revisionsTouching(path: string): readonly string[] {
    return this.scenario.revisionsByPath?.[path] ?? [];
  }

  readAtRevision(revision: string, path: string): string | null {
    const map = this.scenario.contentAtRevision ?? {};
    const key = revisionKey(revision, path);
    if (!Object.prototype.hasOwnProperty.call(map, key)) return null;
    const text = map[key];
    return text === undefined ? null : text;
  }

  shortRevision(revision: string): string {
    return revision.slice(0, 7);
  }
}
