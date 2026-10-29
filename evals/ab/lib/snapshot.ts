// Fresh trial copies of a fixture repo, and the before/after proof that the source never changed.
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

/** Copy `src` over `dest` (created if absent). Overlays merge file by file. */
export function copyTree(src: string, dest: string): void {
  fs.cpSync(src, dest, { recursive: true });
}

/** Git blob id of a file's bytes -- the same value `git hash-object <file>` prints. */
function blobId(file: string): string {
  const body = fs.readFileSync(file);
  return createHash("sha1").update(`blob ${body.length}\0`).update(body).digest("hex");
}

/** relative path -> blob id, for every file under `dir` (sorted, forward slashes). */
export function manifest(dir: string): Record<string, string> {
  const out: Record<string, string> = {};
  const walk = (d: string) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else out[path.relative(dir, p).split(path.sep).join("/")] = blobId(p);
    }
  };
  walk(dir);
  return out;
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
