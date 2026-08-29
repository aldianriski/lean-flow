// Per-rule parity against the LIVE Shell oracle, on git states built from the RETAINED §4 fixture
// (SPRINT-091 T7 DoD 1) -- mirrors `evals/run-adr-family-fixtures.sh`'s own four S4.APPEND cases
// (edit fails · marker passes · no-history reported honestly · shallow clone reported honestly,
// never guessed at) and `s12-secrets.test.ts`'s own "DoD 4" pattern: the SAME real adapter
// (`createFsAdrAppendPort`), spawned against a REAL git repository, diffed against
// `scripts/lib/conformance-engine.sh` spawned live -- never a copied literal from it.
//
// SPRINT-092 T1: this file's own `gitRepoFromClean`/`gitConfig`/`commitAll`/shallow-clone construction
// (SPRINT-091 T7) moved to the shared `test/fixtures/git-repo-factory.ts`, generalised beyond "clean"
// -- see that file's header for why the factory cannot decide a verdict (EPIC-014 H14). The one case
// that copies the fixture WITHOUT running git at all ("no git history") stays inline below: it is not
// a git-repo construction, so it does not belong in a factory named for building one.
//
// `execFileSync`/`readFileSync`/`writeFileSync`/`cpSync`/`mkdtempSync` otherwise stay in *.test.ts /
// the fixture factory only, matching `s12-secrets.test.ts`'s own convention (the test-file exemption
// `test/architecture/layers.ts` carves out).

import { describe, expect, test } from "bun:test";
import { execFileSync } from "node:child_process";
import { cpSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { createFsAdrAppendPort } from "../adapters/fs-adr-append.ts";
import { ADR_EDITED_AFTER_DECISION, evaluate } from "./s4-append.ts";
import { adrFamilyFixtureDir } from "../../../../test/fixtures/adr-family-factory.ts";
import { commitAll, editFile, gitRepoFromFixture, shallowCloneOf } from "../../../../test/fixtures/git-repo-factory.ts";

const ENGINE_PATH = fileURLToPath(new URL("../../../../scripts/lib/conformance-engine.sh", import.meta.url));
const ORACLE_TIMEOUT_MS = 30_000;

function runShellEngine(repoDir: string): { readonly code: number; readonly stdout: string } {
  try {
    const stdout = execFileSync("sh", [ENGINE_PATH, repoDir], { encoding: "utf8", timeout: 25_000 });
    return { code: 0, stdout };
  } catch (e) {
    const err = e as { status?: number; stdout?: string };
    return { code: err.status ?? 1, stdout: err.stdout ?? "" };
  }
}

/** Lines this rule's own `ok`/`bad`/`note` calls print -- filters the FULL-spec run's output down to
 *  S4.APPEND's own rows, mirroring `s12-secrets.test.ts`'s own `secretsLines`. */
function appendLines(stdout: string): string[] {
  return stdout.split("\n").filter((l) => l.includes("S4.APPEND") || l.includes(ADR_EDITED_AFTER_DECISION));
}

const ADR_REL = join("docs", "adr", "ADR-001-a-real-decision.md");

describe("TS agrees with the live Shell oracle on S4.APPEND (DoD 1)", () => {
  // (a) MUST FAIL -- the § Decision body itself is rewritten after the deciding commit.
  test("FAIL: § Decision rewritten after the deciding commit -- both sides catch it, same named finding", () => {
    const repo = gitRepoFromFixture({ fixtureName: "clean", tmpPrefix: "s4-append-oracle-edited-" });
    editFile(repo, ADR_REL, (text) => {
      const edited = text.replace("We chose the first option.", "We chose the second option after all.");
      expect(edited).toContain("second option after all"); // the seed actually landed
      return edited;
    });
    commitAll(repo, "quietly rewrite the decision");

    const shell = runShellEngine(repo);
    const shellLines = appendLines(shell.stdout);
    expect(shellLines.some((l) => l.startsWith("FAIL"))).toBe(true);
    expect(shellLines.join("\n")).toContain(ADR_EDITED_AFTER_DECISION);

    const ts = evaluate(createFsAdrAppendPort(repo));
    expect(ts.verdict).toBe("fail");
    expect(ts.findings).toHaveLength(1);
    expect(ts.findings[0]?.name).toBe(ADR_EDITED_AFTER_DECISION);
    expect(ts.findings[0]?.detail).toContain("docs/adr/ADR-001-a-real-decision.md");
  }, ORACLE_TIMEOUT_MS);

  // (b) MUST PASS -- a post-decision MARKER in the header, § Decision untouched. The distinction this
  // rule exists to draw: this repo's own ADR-008/ADR-027 carry exactly such markers.
  test("PASS control: a post-decision MARKER, § Decision untouched -- both sides pass, discriminating from (a)", () => {
    const repo = gitRepoFromFixture({ fixtureName: "clean", tmpPrefix: "s4-append-oracle-marker-" });
    editFile(repo, ADR_REL, (text) => {
      const edited = text.replace(
        "- **Status:** accepted (2026-08-20)",
        "- **Status:** accepted (2026-08-20)\n- **Scope amended by:** [ADR-002](ADR-002-a-later-decision.md) (2026-08-21)",
      );
      expect(edited).toContain("Scope amended by"); // the seed actually landed
      return edited;
    });
    commitAll(repo, "mark the ADR as amended in the open");

    const shell = runShellEngine(repo);
    const shellLines = appendLines(shell.stdout);
    expect(shellLines.some((l) => l.startsWith("FAIL"))).toBe(false);
    expect(shellLines.join("\n")).toContain("1 ADR(s) unedited");

    const ts = evaluate(createFsAdrAppendPort(repo));
    expect(ts.verdict).toBe("pass");
    expect(ts.findings).toEqual([]);
  }, ORACLE_TIMEOUT_MS);

  // (c) The honest-report case: no history to consult at all. Not a git-repo construction (no `git
  // init`/commit at all), so it stays inline rather than going through `gitRepoFromFixture`.
  test("NOTE: no git history at all -- neither side guesses, both report honestly and distinctly from (d)", () => {
    const repo = mkdtempSync(join(tmpdir(), "s4-append-oracle-nogit-"));
    cpSync(adrFamilyFixtureDir("clean"), repo, { recursive: true });

    const shell = runShellEngine(repo);
    const shellLines = appendLines(shell.stdout);
    expect(shellLines.some((l) => l.startsWith("FAIL"))).toBe(false);
    expect(shellLines.join("\n")).toContain("history unavailable:");

    const ts = evaluate(createFsAdrAppendPort(repo));
    expect(ts.verdict).toBe("note");
    expect(ts.findings).toEqual([]);
    expect(ts.detail).toContain("history unavailable:");
  }, ORACLE_TIMEOUT_MS);

  // (d) A SHALLOW clone has a .git but cannot see the deciding commit -- distinguished from (c)
  // because "no history" and "truncated history" are different statements to an adopter, and this is
  // the L-166 risk: proven again, on a REAL public artifact, in s4-append-shallow-reachability.test.ts.
  test("NOTE: a SHALLOW clone -- truncated history is reported, never read as clean, distinctly from (c)", () => {
    const edited = gitRepoFromFixture({ fixtureName: "clean", tmpPrefix: "s4-append-oracle-shallow-src-" });
    editFile(edited, ADR_REL, (text) => text.replace("first option", "second option"));
    commitAll(edited, "an edit the shallow clone will never see");

    const shallow = shallowCloneOf({ source: edited, tmpPrefix: "s4-append-oracle-shallow-" });
    const isShallow = execFileSync("git", ["-C", shallow, "rev-parse", "--is-shallow-repository"], {
      encoding: "utf8",
    }).trim();
    expect(isShallow).toBe("true"); // the clone really is shallow -- not merely asserted

    const shell = runShellEngine(shallow);
    const shellLines = appendLines(shell.stdout);
    expect(shellLines.some((l) => l.startsWith("FAIL"))).toBe(false);
    expect(shellLines.join("\n")).toContain("history truncated:");

    const ts = evaluate(createFsAdrAppendPort(shallow));
    expect(ts.verdict).toBe("note");
    expect(ts.findings).toEqual([]);
    expect(ts.detail).toContain("history truncated:");
  }, ORACLE_TIMEOUT_MS);
});
