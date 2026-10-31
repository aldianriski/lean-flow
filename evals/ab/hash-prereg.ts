// Hashes the pre-registration pins (TASK-544 M6):
//   bun evals/ab/hash-prereg.ts [--doc <path>]
// (a) task-corpus manifest: every file under evals/ab/tasks/ and evals/ab/answers/, sorted by repo-relative path, as
//     "<path> <blob id>" lines, plus the sha256 of that listing;
// (b) sha256 of each measured arm json + manifest, the measured inventory, judges/prompts.lock.json and schedule.json;
// (c) with --doc, the sha256 of that document.
// Line-ending convention: a text file is hashed as if every CRLF were LF, so a CRLF checkout (Windows autocrlf) and an LF
// checkout give the same value; a file holding a NUL byte is binary and hashed as it is. A blob id is git's:
// sha1("blob <bytes>\0<bytes>") over those same bytes, i.e. `git hash-object` of the LF form of the file.
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const AB = import.meta.dir;

/** The bytes a file is hashed over: LF-normalised unless it is binary. */
export function canonicalBytes(file: string): Buffer {
  const raw = fs.readFileSync(file);
  if (raw.includes(0)) return raw;
  return Buffer.from(raw.toString("latin1").replaceAll("\r\n", "\n"), "latin1");
}
export const sha256 = (b: Buffer | string): string => createHash("sha256").update(b).digest("hex");
export function blobId(b: Buffer): string {
  return createHash("sha1").update(`blob ${b.length}\0`).update(b).digest("hex");
}

function walk(dir: string, out: string[]): string[] {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.isFile()) out.push(p);
  }
  return out;
}

/** Sorted "<path> <blob id>" listing of every file under the given directories (paths relative to `base`, '/' separated). */
export function corpusManifest(base: string, dirs: string[]): { listing: string; sha256: string; files: number } {
  const files = dirs.flatMap((d) => walk(path.join(base, d), [])).map((p) => path.relative(base, p).split(path.sep).join("/"));
  files.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
  const listing = files.map((f) => `${f} ${blobId(canonicalBytes(path.join(base, f)))}`).join("\n") + "\n";
  return { listing, sha256: sha256(listing), files: files.length };
}

export const MEASURED_ARMS = ["workdoo-a0", "workdoo-a1", "clinic-a0", "clinic-a1"];
/** Repo-relative (to evals/ab) files whose sha256 is pinned besides the corpus. */
export const PINNED_FILES = [...MEASURED_ARMS.flatMap((a) => [`arms/${a}.json`, `arms/${a}.manifest.json`]), "arms/inventory.json", "judges/prompts.lock.json", "schedule.json"];

export function pinnedHashes(ab: string = AB): Record<string, string> {
  return Object.fromEntries(PINNED_FILES.map((f) => [`evals/ab/${f}`, sha256(canonicalBytes(path.join(ab, f)))]));
}

if (import.meta.main) {
  const argv = process.argv.slice(2);
  const doc = argv.indexOf("--doc") >= 0 ? argv[argv.indexOf("--doc") + 1] : undefined;
  const c = corpusManifest(path.dirname(path.dirname(AB)), ["evals/ab/tasks", "evals/ab/answers"]);
  console.log(`== task corpus: ${c.files} files (path, git blob id of the LF form)\n${c.listing}corpus sha256: ${c.sha256}\n`);
  console.log("== pinned files (sha256 of the LF form)");
  for (const [f, h] of Object.entries(pinnedHashes())) console.log(`${h}  ${f}`);
  if (doc) console.log(`\n== document\n${sha256(canonicalBytes(path.resolve(doc)))}  ${doc}`);
}
