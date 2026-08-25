import { describe, expect, test } from "bun:test";
import { execFileSync } from "node:child_process";
import { chmodSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { readSpecAllFromDisk } from "./spec-file-reader.ts";

const SPEC_PATH = fileURLToPath(new URL("../../../spec/STANDARD.md", import.meta.url));
const SHELL_READER_PATH = fileURLToPath(new URL("../../../scripts/lib/read-spec-rules.sh", import.meta.url));

/** Runs the real `read-spec-rules.sh`, fresh, and reports its exit code + stderr -- never a literal. */
function runShellReader(args: readonly string[]): { readonly code: number; readonly stdout: string; readonly stderr: string } {
  try {
    const stdout = execFileSync("sh", [SHELL_READER_PATH, ...args], { encoding: "utf8" });
    return { code: 0, stdout, stderr: "" };
  } catch (e) {
    const err = e as { status?: number; stdout?: string; stderr?: string };
    return { code: err.status ?? 1, stdout: err.stdout ?? "", stderr: err.stderr ?? "" };
  }
}

/**
 * Builds a file that is GENUINELY unreadable to this process -- verified by actually attempting a
 * read afterwards and confirming it throws. `chmod 000` alone does NOT reliably deny access under
 * git-bash on this host: verified live (SPRINT-087 T6 setup) that it leaves the file `r--r--r--` and
 * still fully readable, which would make a test built on it pass VACUOUSLY -- the permission-denied
 * branch would never actually run (CLAUDE.md's seeded-break-that-never-landed trap, one level up).
 * On win32 this instead sets an explicit NTFS DENY(R) ACE for the current user via `icacls`, which
 * Windows honours ahead of the inherited ALLOW ACE the temp dir carries. Throws loudly if the file is
 * STILL readable afterwards rather than silently letting the fixture through.
 */
function makeGenuinelyUnreadableFile(dir: string, name: string): string {
  const path = join(dir, name);
  writeFileSync(path, "# spec content that must never be seen\n");

  if (process.platform === "win32") {
    const user = `${process.env.USERDOMAIN}\\${process.env.USERNAME}`;
    execFileSync("icacls", [path, "/deny", `${user}:(R)`]);
  } else {
    chmodSync(path, 0o000);
  }

  try {
    readFileSync(path, "utf8");
  } catch {
    return path; // verified: a real read attempt genuinely fails
  }
  throw new Error(
    `fixture setup failed: ${path} is still readable after attempting to deny access -- ` +
      "this platform/filesystem did not honour the permission change, so the branch this fixture " +
      "exists to exercise would never actually run",
  );
}

/**
 * Undoes the win32 DENY ACE `makeGenuinelyUnreadableFile` sets, BEFORE the directory is removed --
 * a DENY-ACE'd path is harder to clear by hand than an ordinary one, and SPRINT-087 T6's first pass
 * left 8 such directories behind across two suite runs (adversarial review finding 2) because nothing
 * ever removed the ACE or called `rmSync` at all. Best-effort: if `icacls` itself fails, the `rmSync`
 * below still runs and surfaces whatever is actually left over, rather than masking it.
 */
function removeDenyAce(filePath: string): void {
  if (process.platform !== "win32") return;
  const user = `${process.env.USERDOMAIN}\\${process.env.USERNAME}`;
  try {
    execFileSync("icacls", [filePath, "/remove:d", user]);
  } catch {
    // Non-fatal here -- rmSync below is what actually proves whether cleanup succeeded.
  }
}

/**
 * Removes a fixture directory, run in a `finally` so it fires even when the test's own assertions
 * throw first (adversarial review finding 2: cleanup that only runs on the happy path leaves the
 * WORST cases -- the ones that failed -- behind). `deniedFilePath`, when given, has its DENY ACE
 * stripped first. A cleanup failure is reported, never swallowed silently (CLAUDE.md's "self-report
 * vs artifact" trap: a caught-and-ignored exception here would claim success over a directory still
 * sitting on disk).
 */
function cleanupFixtureDir(dir: string, deniedFilePath?: string): void {
  if (deniedFilePath) removeDenyAce(deniedFilePath);
  try {
    rmSync(dir, { recursive: true, force: true });
  } catch (e) {
    console.error(`SPRINT-087 T6 fixture cleanup failed for ${dir}: ${(e as Error).message} -- left on disk`);
  }
}

describe("readSpecAllFromDisk -- spec-not-found vs permission-denied stay DISTINCT findings (SPRINT-087 T6)", () => {
  // MUST-FAIL branch A: the spec does not exist at all.
  test("spec-not-found: a path that does not exist -- named finding, matching Shell for the same input", () => {
    const dir = mkdtempSync(join(tmpdir(), "cli-spec-missing-"));
    try {
      const missing = join(dir, "no-such-spec.md"); // never written

      const result = readSpecAllFromDisk(missing);
      if (result.ok) throw new Error("expected a failure result");
      expect(result.finding).toBe("spec-not-found");
      // Absence, not emptiness -- the failure variant carries no `rows` field to mistake for `[]`.
      expect("rows" in result).toBe(false);

      const shell = runShellReader([missing]);
      expect(shell.code).not.toBe(0);
      expect(shell.stderr).toContain("spec-not-found");
    } finally {
      cleanupFixtureDir(dir);
    }
  });

  // MUST-FAIL branch B: the spec is a DIRECTORY, not a file -- adversarial review finding 1. Shell's
  // `[ -f "$spec" ]` guard is false for a directory just as it is for a missing path, so Shell reports
  // `spec-not-found` here too (verified live: `sh read-spec-rules.sh <a directory>` prints
  // `spec-not-found`, exit 1) -- NOT `spec-table-unreadable`. A catch-all classifier that treats every
  // non-ENOENT `readFileSync` failure as "unreadable" gets this branch wrong (Bun/Node throw `EISDIR`
  // here, which is not `ENOENT`); this is why `attemptRead` checks `statSync(...).isFile()` first
  // rather than reacting to `readFileSync`'s error code.
  test("spec-not-found: a DIRECTORY at the spec path -- Shell's [-f] rejects it too, matching Shell for the same input", () => {
    const dir = mkdtempSync(join(tmpdir(), "cli-spec-isdir-"));
    try {
      const asDir = join(dir, "spec-is-a-directory.md");
      mkdirSync(asDir);

      const result = readSpecAllFromDisk(asDir);
      if (result.ok) throw new Error("expected a failure result");
      expect(result.finding).toBe("spec-not-found");
      expect(result.finding).not.toBe("spec-table-unreadable");

      const shell = runShellReader([asDir]);
      expect(shell.code).not.toBe(0);
      expect(shell.stderr).toContain("spec-not-found");
      expect(shell.stderr).not.toContain("spec-table-unreadable");
    } finally {
      cleanupFixtureDir(dir);
    }
  });

  // MUST-FAIL branch C: the spec EXISTS but cannot be read -- the defect this task fixes. Before T6,
  // an adapter following T3's test-only stand-in (`attemptReadMissingSpec`, which maps EVERY thrown
  // error to `specNotFound`) would report `spec-not-found` here too -- indistinguishable from branch A,
  // which is exactly the false statement CLAUDE.md's DoD calls out ("tells an operator to create a
  // file that is already there").
  test("permission-denied: a path that EXISTS but cannot be read -- a finding DISTINCT from spec-not-found, matching Shell", () => {
    const dir = mkdtempSync(join(tmpdir(), "cli-spec-denied-"));
    let denied: string | undefined;
    try {
      denied = makeGenuinelyUnreadableFile(dir, "unreadable-spec.md");

      const result = readSpecAllFromDisk(denied);
      if (result.ok) throw new Error("expected a failure result");
      // The named finding this branch produces is `spec-table-unreadable` -- verified against the real
      // Shell reader below, run fresh over this SAME genuinely-denied file. It is NOT `spec-not-found`:
      // the file exists, and reporting otherwise would be a lie about the filesystem.
      expect(result.finding).toBe("spec-table-unreadable");
      expect(result.finding).not.toBe("spec-not-found");

      const shell = runShellReader([denied]);
      expect(shell.code).not.toBe(0);
      expect(shell.stderr).toContain("spec-table-unreadable");
      expect(shell.stderr).not.toContain("spec-not-found");
    } finally {
      cleanupFixtureDir(dir, denied);
    }
  });

  // Sibling control: the same function against the real, readable spec still succeeds -- proving the
  // three must-FAIL branches above redden because of the fixture's condition, not because the function
  // fails unconditionally.
  test("CONTROL: a readable spec with real Conformance tables still succeeds, unaffected by any branch above", () => {
    const result = readSpecAllFromDisk(SPEC_PATH);
    if (!result.ok) throw new Error(`expected success, got finding ${result.finding}: ${result.message}`);
    expect(result.rows.length).toBe(100); // §14's own published total (ADR-034), same oracle spec-reader.test.ts uses

    const shell = runShellReader([SPEC_PATH]);
    expect(shell.code).toBe(0);
  });
});

// --- seed evidence (SPRINT-087 T6, revised after adversarial review) --------------------------------
//
// Verified live on this host (Windows 11 / git-bash) before trusting each fixture:
//
//   1. `chmod 000` on a file under this filesystem does NOT deny read access -- confirmed by writing a
//      file, chmod 000'ing it, and `cat`-ing it: `ls -la` showed `-r--r--r--` (not `----------`), and
//      `cat` printed the file's content at exit 0. A test built on `chmod 000` alone here would pass
//      VACUOUSLY: it would assert the permission-denied branch while never actually denying permission.
//   2. `icacls <file> /deny "<DOMAIN>\<user>:(R)"` DOES deny it: after setting the explicit DENY(R)
//      ACE, `cat` on the same file failed with "Permission denied" at exit 1. `makeGenuinelyUnreadableFile`
//      above additionally re-attempts a real `readFileSync` and throws if it still succeeds, so this
//      guard is live in the suite itself, not just in this comment.
//   3. Bun's `readFileSync` on that genuinely-denied file threw with `e.code === "EPERM"`, not the
//      POSIX-canonical `EACCES` -- confirmed by a throwaway script that caught the error and printed
//      its `.code`. `spec-file-reader.ts`'s `attemptRead` therefore never gates the CONTENT-read
//      failure on a specific error code at all (any failure past the `isFile()` check means
//      "unreadable"), so EPERM and EACCES land in the same branch without either needing its own case.
//   4. `sh scripts/lib/read-spec-rules.sh <the same genuinely-denied file>` was run fresh (not a copied
//      literal) and printed `FAIL  read-spec-rules: spec-table-unreadable -- no Conformance rows
//      parsed from <path>, ...` at exit 1 -- confirming Shell's own oracle answer for a
//      permission-denied-but-present spec is `spec-table-unreadable`, never `spec-not-found`.
//   5. Adversarial review finding 1: `sh scripts/lib/read-spec-rules.sh <a directory>` was run fresh
//      and printed `FAIL  read-spec-rules: spec-not-found -- <path>` at exit 1 -- NOT
//      `spec-table-unreadable`, which is what this file's PREVIOUS classifier (catch-all on
//      "non-ENOENT `readFileSync` failure") would have produced, since Bun/Node throw `EISDIR` for a
//      directory, and `EISDIR !== "ENOENT"`. Fixed by checking `statSync(...).isFile()` BEFORE
//      attempting the content read at all, mirroring Shell's `[ -f "$spec" ]` guard directly instead
//      of reacting to whichever error code a failed `readFileSync` happens to throw.
//   6. The dangling-symlink shape of the same `[ -f ]` guard (a symlink whose target is missing, or is
//      itself a directory) was NOT verified live: `ln -s` failed on this host for lack of symlink
//      privilege. The claim that `statSync(...).isFile()` agrees with `[ -f "$spec" ]` for that shape
//      rests on both resolving through the OS's own `stat()`, which follows symlinks identically on
//      both sides -- not on a live comparison. This is a KNOWN, STATED gap, not an assumed pass.
//   7. Adversarial review finding 2: the fixture directories above (and, on win32, the DENY ACE on the
//      unreadable file) were never cleaned up in the first pass -- 8 accumulated across two suite runs.
//      Every test above now removes its own directory in a `finally` block (`cleanupFixtureDir`, which
//      strips the DENY ACE first via `removeDenyAce`), so cleanup runs whether the test passes or
//      throws, and a cleanup failure is logged rather than swallowed.
