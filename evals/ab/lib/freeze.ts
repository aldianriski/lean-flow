// Arm freeze: a snapshot is pinned by a per-file manifest of git blob ids; a trial refuses an arm whose snapshot differs.
import fs from "node:fs";
import path from "node:path";
import type { Arm } from "./arm.ts";
import { blobId, diffManifest } from "./snapshot.ts";

/** Directory or file names left out at any depth: VCS state, installs, secrets, database files, build output. */
const EXCLUDE_NAMES = new Set([".git", "node_modules", ".pgdata", "dist", ".workdoo", "tsconfig.tsbuildinfo"]);
/** Repo-relative paths left out (a worktree of the repo itself would double-count every file). */
const EXCLUDE_PATHS = new Set([".claude/worktrees"]);

export function isExcluded(rel: string, name: string): boolean {
  return EXCLUDE_NAMES.has(name) || name.startsWith(".env") || EXCLUDE_PATHS.has(rel);
}

/** relative path -> git blob id for every non-excluded file under `dir` (sorted, forward slashes). Same ids as `git hash-object`. */
export function manifestOf(dir: string): Record<string, string> {
  const out: Record<string, string> = {};
  const walk = (d: string) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const p = path.join(d, e.name);
      const rel = path.relative(dir, p).split(path.sep).join("/");
      if (isExcluded(rel, e.name)) continue;
      if (e.isDirectory()) walk(p);
      else out[rel] = blobId(p);
    }
  };
  walk(dir);
  return out;
}

/** Copy `src` to `dest` skipping the exclusions; returns the file count. */
export function copyFiltered(src: string, dest: string): number {
  let n = 0;
  const walk = (d: string) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      const rel = path.relative(src, p).split(path.sep).join("/");
      if (isExcluded(rel, e.name)) continue;
      if (e.isDirectory()) walk(p);
      else {
        fs.mkdirSync(path.dirname(path.join(dest, rel)), { recursive: true });
        fs.copyFileSync(p, path.join(dest, rel));
        n++;
      }
    }
  };
  fs.mkdirSync(dest, { recursive: true });
  walk(src);
  return n;
}

/** Repo root: the base a `manifest` path is relative to. */
export const REPO_ROOT = path.resolve(import.meta.dir, "..", "..", "..");

/** Reasons to refuse; empty means the snapshot on disk is exactly what the arm froze. Arms without a snapshot are unaffected. */
export function checkArmSnapshot(arm: Pick<Arm, "id" | "snapshot" | "manifest">): string[] {
  if (!arm.snapshot) return [];
  if (!arm.manifest) return [`arm ${arm.id}: snapshot ${arm.snapshot} has no manifest (not frozen)`];
  if (!fs.existsSync(arm.snapshot)) return [`snapshot ${arm.snapshot} does not exist`];
  const file = path.resolve(REPO_ROOT, arm.manifest);
  if (!fs.existsSync(file)) return [`manifest ${arm.manifest} does not exist`];
  const frozen = JSON.parse(fs.readFileSync(file, "utf8")) as Record<string, string>;
  return diffManifest(frozen, manifestOf(arm.snapshot)).map((d) => d.replace(/^changed /, "edited ").replace(/^removed /, "missing ").replace(/^added /, "extra "));
}
