// The real Bun adapter for `SprintDirPort` (SPRINT-087 T1, DoD 3) -- reads `docs/sprint/` off an
// actual filesystem. `../rules/sprint-log-outside-logs-dir.fake.ts` is this port's other
// implementation; `sprint-log-outside-logs-dir.test.ts` proves the evaluator identical against both.
//
// Adapters layer (V3 §2.1 · `test/architecture/layers.ts`'s `/^packages\/[^/]+\/src\/adapters\//`
// rule) -- this is the one place in this package allowed to reach for `node:fs` directly.

import { existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import type { SprintDirPort } from "../rules/sprint-log-outside-logs-dir.ts";

export class FsSprintDirPort implements SprintDirPort {
  private readonly dir: string;

  constructor(repoRoot: string) {
    this.dir = join(repoRoot, "docs", "sprint");
  }

  hasSprintDir(): boolean {
    return existsSync(this.dir) && statSync(this.dir).isDirectory();
  }

  /** Non-recursive, FILES only -- mirrors the Shell glob, which never crosses `/` and never matches
   *  a directory (e.g. `docs/sprint/logs/` itself must not be misread as an entry to classify). */
  listSprintDirEntries(): readonly string[] {
    if (!this.hasSprintDir()) return [];
    return readdirSync(this.dir).filter((name) => statSync(join(this.dir, name)).isFile());
  }
}
