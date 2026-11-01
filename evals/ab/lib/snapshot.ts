// Fresh trial copies of a fixture repo, and the before/after proof that the source never changed.
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

/** Copy `src` over `dest` (created if absent). Overlays merge file by file. */
export function copyTree(src: string, dest: string): void {
  fs.cpSync(src, dest, { recursive: true });
}

/** Git blob id of a file's bytes -- the same value `git hash-object <file>` prints. */
export function blobId(file: string): string {
  const body = fs.readFileSync(file);
  return createHash("sha1").update(`blob ${body.length}\0`).update(body).digest("hex");
}

/** Installed dependencies and build output, skipped at any depth (Amendment 3): neither is the agent's edit, for the judges' changed set and the scope-breach check alike. */
export const GENERATED_DIRS = new Set(["node_modules", "dist", "build", ".svelte-kit", "coverage"]);
/** PowerShell's own cache directory (`ModuleAnalysisCache`), which a trial's PowerShell sessions wrote under the trial copy, skipped at any depth (Amendment 5). */
export const isShellCache = (rel: string): boolean => /(^|\/)Microsoft\/Windows\/PowerShell$/.test(rel);

/** relative path -> blob id, for every file under `dir` (sorted, forward slashes), without `GENERATED_DIRS` and the shell cache. */
export function manifest(dir: string): Record<string, string> {
  const out: Record<string, string> = {};
  const walk = (d: string) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const p = path.join(d, e.name);
      const rel = path.relative(dir, p).split(path.sep).join("/");
      if (e.isDirectory()) {
        if (!GENERATED_DIRS.has(e.name) && !isShellCache(rel)) walk(p);
      } else out[rel] = blobId(p);
    }
  };
  walk(dir);
  return out;
}

/** `diff` (source -> now) without what provisioning wrote (`pre` -> `post`) and the agent did not touch afterwards (go.sum from a migrate, tool caches). */
export function withoutProvisioned(diff: string[], pre: Record<string, string>, post: Record<string, string>, now: Record<string, string>): string[] {
  const rel = (d: string) => d.replace(/^\w+ /, "");
  const prov = new Set(diffManifest(pre, post).map(rel));
  return diff.filter((d) => !(prov.has(rel(d)) && post[rel(d)] === now[rel(d)]));
}

/** Human-readable differences between two manifests; empty when identical. */
export function diffManifest(before: Record<string, string>, after: Record<string, string>): string[] {
  const diffs: string[] = [];
  for (const k of Object.keys(before)) {
    if (!(k in after)) diffs.push(`removed ${k}`);
    else if (before[k] !== after[k]) diffs.push(`changed ${k}`);
  }
  for (const k of Object.keys(after)) if (!(k in before)) diffs.push(`added ${k}`);
  return diffs;
}
