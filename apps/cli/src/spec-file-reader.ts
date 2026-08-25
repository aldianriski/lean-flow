// The boundary adapter that actually touches the filesystem for a spec file (V3 §2.1's outermost
// layer). `packages/standard/src/spec-reader.ts` stays pure and never imports `node:fs`, per its own
// header comment -- this file is where a real read attempt happens, and where the CONSEQUENCE of that
// attempt (found / not-found / unreadable) is decided. SPRINT-087 T6, carried forward from SPRINT-085
// T3 ("unblocked now that a CLI exists" -- T3 shipped only a `*.test.ts` stand-in, `attemptReadMissingSpec`,
// that mapped EVERY read failure to `specNotFound`, which is correct for that test's one path but
// wrong as a general adapter: a spec that EXISTS but cannot be READ is a different fact than a spec
// that does not exist, and collapsing the two tells an operator to create a file that is already there.
//
// Shell's own read-spec-rules.sh draws this distinction WITHOUT a dedicated permission check:
// `[ -f "$spec" ]` only tests that the path is a regular file -- true even without read access -- so a
// permission-denied spec sails past that guard and reaches the awk parse. awk then fails to open the
// file, its own stderr is swallowed (`2>/dev/null`), and it prints nothing: exactly the same "zero
// rows" the reader gets from a spec with no Conformance tables at all. Both land on the SAME finding,
// `spec-table-unreadable` -- never `spec-not-found` (verified live against the real script over a
// genuinely permission-denied file; see the colocated test file's seed-evidence comment).
//
// This adapter reproduces that byte-for-byte: on ENOENT it calls the domain's own pure
// `specNotFound()` constructor (DoD 2 -- the domain decides nothing about WHEN that applies; this
// file makes the "a real read attempt actually failed with ENOENT" call). On any OTHER read failure --
// permission-denied is the one this Windows host can genuinely produce; Bun/Node report it as
// `EPERM` here, not the POSIX-canonical `EACCES`, so the check is "not ENOENT", never an allow-list of
// error codes -- it feeds the domain the SAME empty content Shell's awk effectively receives, and lets
// the EXISTING pure `readAll` logic classify it. That routes through the identical code path a
// genuinely-empty-but-readable spec would hit, rather than a second copy of that judgment living here.

import { readFileSync } from "node:fs";
import { tokenize } from "../../../packages/standard/src/tokenizer.ts";
import { readAll, specNotFound, type SpecReadResult } from "../../../packages/standard/src/spec-reader.ts";

/** The shape of a `node:fs` error this file cares about -- just its POSIX-style `code`. */
interface NodeFsError {
  readonly code?: string;
}

type ReadAttempt = { readonly kind: "not-found" } | { readonly kind: "content"; readonly content: string };

/**
 * Attempts the real read. `"not-found"` only for ENOENT -- every other failure (permission-denied,
 * a directory where a file was expected, ...) is treated as "the file exists but nothing could be
 * read from it", which is what `readAll` needs to classify it the same way Shell's awk does.
 */
function attemptRead(specPath: string): ReadAttempt {
  try {
    return { kind: "content", content: readFileSync(specPath, "utf8") };
  } catch (e) {
    if ((e as NodeFsError).code === "ENOENT") return { kind: "not-found" };
    return { kind: "content", content: "" };
  }
}

/**
 * Reads `specPath` off disk and evaluates its whole-document Conformance rows, distinguishing
 * "does not exist" (`spec-not-found`) from "exists but nothing could be read from it"
 * (`spec-table-unreadable`, via the domain's existing zero-rows classification) -- never conflating
 * the two into one finding.
 */
export function readSpecAllFromDisk(specPath: string): SpecReadResult {
  const read = attemptRead(specPath);
  if (read.kind === "not-found") return specNotFound(specPath);

  const doc = tokenize(read.content, specPath);
  return readAll(doc, specPath);
}
