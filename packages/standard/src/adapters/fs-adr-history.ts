// The real Bun/Node adapter for `AdrHistoryPort` (SPRINT-091 T7) -- git's own log/show/rev-parse for
// S4.APPEND, §4's only Gated rule. `../adapters/fs-git-boundary.ts` is the sibling adapter for a
// DIFFERENT git-backed port (§12's tracked-index shape); this one answers HISTORY questions instead
// (per-path revisions, point-in-time content, shallow-ness), which nothing in that port's shape
// covers.
//
// Adapters layer (V3 §2.1 · `test/architecture/layers.ts`'s `/^packages\/[^/]+\/src\/adapters\//`
// rule) -- the one place in this family allowed to reach for `node:child_process` directly.
// `../rules/adr-history-port.fake.ts` is this port's other implementation.

import { execFileSync } from "node:child_process";
import type { AdrHistoryPort } from "../rules/adr-history-port.ts";

export class FsAdrHistoryPort implements AdrHistoryPort {
  private readonly repoRoot: string;

  constructor(repoRoot: string) {
    this.repoRoot = repoRoot;
  }

  isGitRepo(): boolean {
    try {
      execFileSync("git", ["-C", this.repoRoot, "rev-parse", "--git-dir"], {
        stdio: ["ignore", "ignore", "ignore"],
      });
      return true;
    } catch {
      return false;
    }
  }

  /** Mirrors the Shell oracle's own
   *  `git -C "$repo" rev-parse --is-shallow-repository` == "true". */
  isShallowClone(): boolean {
    try {
      const out = execFileSync("git", ["-C", this.repoRoot, "rev-parse", "--is-shallow-repository"], {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
      });
      return out.trim() === "true";
    } catch {
      return false;
    }
  }

  /** Mirrors the Shell oracle's own `git log --reverse --format=%H -- "$path"`. */
  revisionsTouching(path: string): readonly string[] {
    try {
      const out = execFileSync(
        "git",
        ["-C", this.repoRoot, "log", "--reverse", "--format=%H", "--", path],
        { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] },
      );
      return out.split("\n").filter((line) => line.length > 0);
    } catch {
      return [];
    }
  }

  /** Mirrors the Shell oracle's own `git show "$revision:$path"`. */
  readAtRevision(revision: string, path: string): string | null {
    try {
      return execFileSync("git", ["-C", this.repoRoot, "show", `${revision}:${path}`], {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
      });
    } catch {
      return null;
    }
  }

  shortRevision(revision: string): string {
    try {
      return execFileSync("git", ["-C", this.repoRoot, "rev-parse", "--short", revision], {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
      }).trim();
    } catch {
      return revision.slice(0, 7);
    }
  }
}
