// L-166 reachability proof for S4.APPEND's shallow-clone branch (SPRINT-091 T7 DoD 3) -- CLAUDE.md's
// own rule: "a branch that works on a fixture but is unreachable on anything the system emits is an
// absent guard that clears every proof above it." `s4-append-oracle.test.ts`'s own shallow-clone case
// proves the branch WORKS; this file proves it is REACHABLE, by pointing it at the artifact that
// actually motivates it rather than a synthetic single-commit repo built only for a test.
//
// What was investigated (recorded here so the finding survives the session, not just the sprint
// report): this repo carries no CI workflow at all (no `.github/`, no CI config anywhere in the tree)
// and a git worktree is NOT a shallow clone (`git rev-parse --is-shallow-repository` on this very
// worktree returns `false` -- verified live during T7, not assumed). Neither of those two candidates
// the task brief named is what actually produces a shallow clone here.
//
// What DOES: `.claude-plugin/marketplace.json` names this repo's REAL, LIVE remote --
// `github.com/aldianriski/lean-flow`, `source: github` -- the exact artifact the Claude Code plugin
// installer and any ordinary consumer clones. `git clone --depth 1 <that URL>` is the literal,
// well-documented mechanism (also the default GitHub Actions `actions/checkout` behaviour industry-
// wide) that produces a real shallow clone of a real ADR-bearing repository -- this one. This test
// performs exactly that clone, live, and runs the SAME real adapter (`createFsAdrAppendPort`) this
// task built against it, then confirms the LIVE Shell oracle (spawned, never modified) agrees.
//
// Network-dependent by necessity -- proving reachability on THE motivating artifact means reaching
// it. A prior manual run during T7's build (recorded in the sprint report) confirmed both sides agree;
// this test makes that reproducible rather than merely asserted.

import { describe, expect, test } from "bun:test";
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { createFsAdrAppendPort } from "../adapters/fs-adr-append.ts";
import { evaluate } from "./s4-append.ts";

const ENGINE_PATH = fileURLToPath(new URL("../../../../scripts/lib/conformance-engine.sh", import.meta.url));
const REMOTE_URL = "https://github.com/aldianriski/lean-flow.git";
const CLONE_TIMEOUT_MS = 60_000;
// The full spec dispatches every rule against this repo's own real tree -- measured live during T7's
// own build at ~108s (`time sh conformance-engine.sh <real-shallow-clone>`); budgeted generously above
// that rather than trimmed to it.
const ORACLE_TIMEOUT_MS = 240_000;

describe("S4.APPEND's shallow-clone branch is REACHABLE on the artifact that motivates it (L-166)", () => {
  test("a real --depth 1 clone of the actual published lean-flow repo reports 'history truncated', on both engines", () => {
    // A short destination path: Windows MAX_PATH bites a full checkout of this repo's own deep
    // fixture trees (observed live during T7's own investigation) well before this test's own
    // assertions would ever run.
    const base = mkdtempSync(join(tmpdir(), "s4append-reach-"));
    const dest = join(base, "r");
    mkdirSync(base, { recursive: true });

    try {
      execFileSync("git", ["-c", "core.longpaths=true", "clone", "-q", "--depth", "1", REMOTE_URL, dest], {
        timeout: CLONE_TIMEOUT_MS,
      });
    } catch (e) {
      // A network-less environment is a real, honest limit on THIS test, not on the branch itself --
      // reported rather than silently skipped (a skipped test here would look identical to a passing
      // one in a CI summary, which is the false confidence L-166 exists to prevent).
      throw new Error(
        `could not clone ${REMOTE_URL} -- this reachability proof needs network access to the real ` +
          `repository; see s4-append-oracle.test.ts's local shallow-clone case for the network-free ` +
          `regression. Underlying error: ${String(e)}`,
      );
    }

    expect(existsSync(join(dest, "docs", "adr"))).toBe(true); // it really is this repo, not an empty shell

    const isShallow = execFileSync("git", ["-C", dest, "rev-parse", "--is-shallow-repository"], {
      encoding: "utf8",
    }).trim();
    expect(isShallow).toBe("true"); // the clone really is shallow -- not merely asserted

    // The live Shell oracle (spawned, never modified) against the real shallow clone.
    let shellStdout: string;
    try {
      shellStdout = execFileSync("sh", [ENGINE_PATH, dest], { encoding: "utf8", timeout: 200_000 });
    } catch (e) {
      const err = e as { stdout?: string };
      shellStdout = err.stdout ?? "";
    }
    const shellAppendLines = shellStdout.split("\n").filter((l) => l.includes("S4.APPEND"));
    expect(shellAppendLines.some((l) => l.startsWith("FAIL"))).toBe(false);
    expect(shellAppendLines.join("\n")).toContain("history truncated:");

    // The TS evaluator, via the SAME real adapter this task built, against the SAME real clone.
    const ts = evaluate(createFsAdrAppendPort(dest));
    expect(ts.verdict).toBe("note");
    expect(ts.findings).toEqual([]);
    expect(ts.detail).toContain("history truncated:");
  }, ORACLE_TIMEOUT_MS);
});
