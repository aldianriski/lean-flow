// The boundary adapter that actually touches the filesystem for a spec file (V3 §2.1's outermost
// layer). `packages/standard/src/spec-reader.ts` stays pure and never imports `node:fs`, per its own
// header comment -- this file is where a real read attempt happens, and where the CONSEQUENCE of that
// attempt (found / not-found / unreadable) is decided. SPRINT-087 T6, carried forward from SPRINT-085
// T3 ("unblocked now that a CLI exists" -- T3 shipped only a `*.test.ts` stand-in, `attemptReadMissingSpec`,
// that mapped EVERY read failure to `specNotFound`, which is correct for that test's one path but
// wrong as a general adapter: a spec that EXISTS but cannot be READ is a different fact than a spec
// that does not exist, and collapsing the two tells an operator to create a file that is already there.
//
// Shell's own read-spec-rules.sh draws the "does this even count as a spec" line with a SINGLE guard:
// `[ -f "$spec" ]`. That test is false for three shapes, not one -- a missing path, AND a directory,
// AND (by POSIX `stat()` following the link) a symlink whose target is missing or is itself a
// directory -- and true only for something that resolves to a regular file. All three false shapes
// report `spec-not-found`; only the true shape proceeds to the awk parse. So this adapter's classifier
// mirrors `-f` directly with `statSync(...).isFile()` -- a POSITIVE check of "is this a regular file",
// not a reactive allow-list of error codes -- so it agrees with Shell on every shape `-f` rejects, not
// only the one (ENOENT) a narrower check would have caught. `statSync` and `-f` both resolve through
// the OS's own `stat()`, which follows symlinks identically on both sides; a directory-as-spec-path was
// verified live (`sh read-spec-rules.sh <a directory>` prints `spec-not-found`, matching this file's
// classifier), but a dangling-symlink-as-spec-path could NOT be verified live on this host -- creating
// a symlink here requires a privilege git-bash's `ln -s` did not have. The claim for that shape rests on
// the shared `stat()` mechanism, not on a live comparison; it is reported as such, not as a proven pass.
//
// A permission-denied spec (a regular file `statSync` resolves and reports `isFile() === true`, but
// whose CONTENT `readFileSync` then fails to read) sails past that same `-f` guard on Shell's side too
// -- `-f` never checks read access -- and reaches the awk parse. awk fails to open the file, its own
// stderr is swallowed (`2>/dev/null`), and it prints nothing: exactly the same "zero rows" the reader
// gets from a spec with no Conformance tables at all. Both land on the SAME finding,
// `spec-table-unreadable` -- never `spec-not-found` (verified live against the real script over a
// genuinely permission-denied file; see the colocated test file's seed-evidence comment).
//
// This adapter reproduces that byte-for-byte: when `statSync(...).isFile()` is false (missing path,
// directory, or an unresolvable/directory-target symlink) it calls the domain's own pure
// `specNotFound()` constructor (DoD 2 -- the domain decides nothing about WHEN that applies; this file
// makes the "does this path even resolve to a regular file" call). When it IS a regular file but the
// subsequent `readFileSync` still throws -- permission-denied is the one this Windows host can
// genuinely produce; Bun/Node report it as `EPERM` here, not the POSIX-canonical `EACCES`, which is
// exactly why the content read is never gated on a specific error code either -- it feeds the domain
// the SAME empty content Shell's awk effectively receives, and lets the EXISTING pure `readAll` logic
// classify it. That routes through the identical code path a genuinely-empty-but-readable spec would
// hit, rather than a second copy of that judgment living here.

import { readFileSync, statSync } from "node:fs";
import { tokenize } from "../../../packages/standard/src/tokenizer.ts";
import { readAll, specNotFound, type SpecReadResult } from "../../../packages/standard/src/spec-reader.ts";

type ReadAttempt = { readonly kind: "not-found" } | { readonly kind: "content"; readonly content: string };

/**
 * Mirrors Shell's `[ -f "$spec" ]` guard exactly: `"not-found"` for anything that does not resolve to
 * a regular file (missing path, a directory, or a symlink whose target is missing or is a directory --
 * `statSync` follows symlinks the same way `-f` does). Only once that positive check passes does a
 * content-read failure (permission-denied) become "exists but nothing could be read from it", which is
 * what `readAll` needs to classify the same way Shell's awk does.
 */
function attemptRead(specPath: string): ReadAttempt {
  let isRegularFile: boolean;
  try {
    isRegularFile = statSync(specPath).isFile();
  } catch {
    isRegularFile = false; // missing path, or a symlink `stat()` cannot resolve
  }
  if (!isRegularFile) return { kind: "not-found" };

  try {
    return { kind: "content", content: readFileSync(specPath, "utf8") };
  } catch {
    return { kind: "content", content: "" };
  }
}

/**
 * Reads `specPath` off disk and evaluates its whole-document Conformance rows, distinguishing
 * "does not resolve to a regular file" (`spec-not-found`) from "is a regular file but nothing could be
 * read from it" (`spec-table-unreadable`, via the domain's existing zero-rows classification) --
 * never conflating the two into one finding.
 */
export function readSpecAllFromDisk(specPath: string): SpecReadResult {
  const read = attemptRead(specPath);
  if (read.kind === "not-found") return specNotFound(specPath);

  const doc = tokenize(read.content, specPath);
  return readAll(doc, specPath);
}
