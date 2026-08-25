import { describe, expect, test } from "bun:test";
import { execFileSync } from "node:child_process";
import { chmodSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
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

describe("readSpecAllFromDisk -- spec-not-found vs permission-denied stay DISTINCT findings (SPRINT-087 T6)", () => {
  // MUST-FAIL branch A: the spec does not exist at all.
  test("spec-not-found: a path that does not exist -- named finding, matching Shell for the same input", () => {
    const missing = join(mkdtempSync(join(tmpdir(), "cli-spec-missing-")), "no-such-spec.md"); // never written

    const result = readSpecAllFromDisk(missing);
    if (result.ok) throw new Error("expected a failure result");
    expect(result.finding).toBe("spec-not-found");
    // Absence, not emptiness -- the failure variant carries no `rows` field to mistake for `[]`.
    expect("rows" in result).toBe(false);

    const shell = runShellReader([missing]);
    expect(shell.code).not.toBe(0);
    expect(shell.stderr).toContain("spec-not-found");
  });

  // MUST-FAIL branch B: the spec EXISTS but cannot be read -- the defect this task fixes. Before T6,
  // an adapter following T3's test-only stand-in (`attemptReadMissingSpec`, which maps EVERY thrown
  // error to `specNotFound`) would report `spec-not-found` here too -- indistinguishable from branch A,
  // which is exactly the false statement CLAUDE.md's DoD calls out ("tells an operator to create a
  // file that is already there").
  test("permission-denied: a path that EXISTS but cannot be read -- a finding DISTINCT from spec-not-found, matching Shell", () => {
    const dir = mkdtempSync(join(tmpdir(), "cli-spec-denied-"));
    const denied = makeGenuinelyUnreadableFile(dir, "unreadable-spec.md");

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
  });

  // Sibling control: the same function against the real, readable spec still succeeds -- proving the
  // two must-FAIL branches above redden because of the fixture's condition, not because the function
  // fails unconditionally.
  test("CONTROL: a readable spec with real Conformance tables still succeeds, unaffected by either branch above", () => {
    const result = readSpecAllFromDisk(SPEC_PATH);
    if (!result.ok) throw new Error(`expected success, got finding ${result.finding}: ${result.message}`);
    expect(result.rows.length).toBe(100); // §14's own published total (ADR-034), same oracle spec-reader.test.ts uses

    const shell = runShellReader([SPEC_PATH]);
    expect(shell.code).toBe(0);
  });
});

// --- seed evidence (SPRINT-087 T6) -----------------------------------------------------------------
//
// Verified live on this host (Windows 11 / git-bash) before trusting the permission-denied fixture:
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
//      its `.code`. This is why `spec-file-reader.ts`'s `attemptRead` branches on "is it ENOENT?"
//      rather than allow-listing specific non-ENOENT codes: EPERM must fall into the SAME
//      "exists but unreadable" branch as EACCES would on a POSIX host, and a hard-coded EACCES check
//      here would have silently mis-classified every permission-denied case on this exact platform.
//   4. `sh scripts/lib/read-spec-rules.sh <the same genuinely-denied file>` was run fresh (not a copied
//      literal) and printed `FAIL  read-spec-rules: spec-table-unreadable -- no Conformance rows
//      parsed from <path>, ...` at exit 1 -- confirming Shell's own oracle answer for a
//      permission-denied-but-present spec is `spec-table-unreadable`, never `spec-not-found`. That is
//      the exact finding this file's `readSpecAllFromDisk` now reproduces for the same input.
