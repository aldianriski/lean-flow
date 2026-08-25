// In-memory fake of `SprintDirPort` (SPRINT-087 T1, DoD 3) -- the other half of the seam alongside
// `../adapters/fs-sprint-dir.ts`. No `node:fs`, no Bun: a plain array held in memory, so a test can
// build a scenario without touching a real filesystem.
//
// Domain layer (V3 §2.1) -- this is a test double, not test code itself, so it stays free of
// `bun:test`/`node:fs` the same way the port it implements is.

import type { SprintDirPort } from "./sprint-log-outside-logs-dir.ts";

export class InMemorySprintDirPort implements SprintDirPort {
  private readonly exists: boolean;
  private readonly entries: readonly string[];

  /** `entries: null` models "docs/sprint/ does not exist" -- distinct from an EMPTY, existing dir. */
  constructor(entries: readonly string[] | null) {
    this.exists = entries !== null;
    this.entries = entries ?? [];
  }

  hasSprintDir(): boolean {
    return this.exists;
  }

  listSprintDirEntries(): readonly string[] {
    return this.entries;
  }
}
