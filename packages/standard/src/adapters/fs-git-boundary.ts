// The real Bun/Node adapter for `GitBoundaryPort` (SPRINT-087 T3, DoD 3) -- git's own index for what
// is TRACKED, `node:fs` for a tracked file's own text and for spec/STANDARD.md's own prose.
// `../rules/git-boundary-port.fake.ts` is this port's other implementation; each `s12-*.test.ts`
// proves its evaluator identical against both.
//
// Adapters layer (V3 §2.1 · `test/architecture/layers.ts`'s `/^packages\/[^/]+\/src\/adapters\//`
// rule) -- this is the one place in this family allowed to reach for `node:fs` or `node:child_process`
// directly. Extraction of §12's prose lists stays PURE (`../rules/git-boundary-spec.ts`); this file
// only supplies the text those functions parse.

import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { GitBoundaryPort } from "../rules/git-boundary-port.ts";
import {
  extractAllowedAssetDirs,
  extractGeneratedAllowed,
  extractGeneratedClasses,
} from "../rules/git-boundary-spec.ts";

export class FsGitBoundaryPort implements GitBoundaryPort {
  private readonly repoRoot: string;
  private readonly specPath: string;

  constructor(repoRoot: string, specPath?: string) {
    this.repoRoot = repoRoot;
    this.specPath = specPath ?? join(repoRoot, "spec", "STANDARD.md");
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

  /** `git -C <repo> ls-files` -- the index, not the working tree; mirrors the Shell oracle's own
   *  `_s12_tracked`. Returns `[]` rather than throwing when this is not a git repo at all. */
  trackedFiles(): readonly string[] {
    if (!this.isGitRepo()) return [];
    let out: string;
    try {
      out = execFileSync("git", ["-C", this.repoRoot, "ls-files"], { encoding: "utf8" });
    } catch {
      return [];
    }
    return out.split("\n").filter((line) => line.length > 0);
  }

  readTrackedFile(path: string): string | null {
    const full = join(this.repoRoot, path);
    if (!existsSync(full)) return null;
    try {
      return readFileSync(full, "utf8");
    } catch {
      return null;
    }
  }

  allowedAssetDirs(): readonly string[] {
    return extractAllowedAssetDirs(this.specText());
  }

  generatedClasses(): readonly string[] {
    return extractGeneratedClasses(this.specText());
  }

  generatedAllowedExclusions(): readonly string[] {
    return extractGeneratedAllowed(this.specText());
  }

  private specText(): string {
    if (!existsSync(this.specPath)) return "";
    try {
      return readFileSync(this.specPath, "utf8");
    } catch {
      return "";
    }
  }
}
