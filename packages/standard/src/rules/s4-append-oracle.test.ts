// Per-rule parity against the LIVE Shell oracle, on git states built from the RETAINED §4 fixture
// (SPRINT-091 T7 DoD 1) -- mirrors `evals/run-adr-family-fixtures.sh`'s own four S4.APPEND cases
// (edit fails · marker passes · no-history reported honestly · shallow clone reported honestly,
// never guessed at) and `s12-secrets.test.ts`'s own "DoD 4" pattern: the SAME real adapter
// (`createFsAdrAppendPort`), spawned against a REAL git repository, diffed against
// `scripts/lib/conformance-engine.sh` spawned live -- never a copied literal from it.
//
// `execFileSync`/`cpSync`/`mkdtempSync`/`writeFileSync` stay in this `*.test.ts` file only, matching
// `s12-secrets.test.ts`'s own convention (the test-file exemption `test/architecture/layers.ts`
// carves out).
//
// The evals/fixtures/adr-family/clean/ fixture is RETAINED (TD-012) and reused here rather than
// hand-authored, exactly as the Shell harness's own `git_repo_from` does.

import { describe, expect, test } from "bun:test";
import { execFileSync } from "node:child_process";
import { cpSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { createFsAdrAppendPort } from "../adapters/fs-adr-append.ts";
import { ADR_EDITED_AFTER_DECISION, evaluate } from "./s4-append.ts";

const ENGINE_PATH = fileURLToPath(new URL("../../../../scripts/lib/conformance-engine.sh", import.meta.url));
const CLEAN_FIXTURE = fileURLToPath(new URL("../../../../evals/fixtures/adr-family/clean", import.meta.url));
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

function gitConfig(repo: string): void {
  execFileSync("git", ["-C", repo, "config", "user.email", "fx@example.invalid"]);
  execFileSync("git", ["-C", repo, "config", "user.name", "Fixture"]);
}

/** Copies the retained `clean` fixture into a fresh temp git repo and commits it as "the deciding
 *  commit" -- mirrors the Shell harness's own `git_repo_from`. */
function gitRepoFromClean(prefix: string): string {
  const dest = mkdtempSync(join(tmpdir(), prefix));
  cpSync(CLEAN_FIXTURE, dest, { recursive: true });
  execFileSync("git", ["-C", dest, "init", "-q"]);
  gitConfig(dest);
  execFileSync("git", ["-C", dest, "add", "-A"]);
  execFileSync("git", ["-C", dest, "commit", "-q", "-m", "the deciding commit"]);
  return dest;
}

function commitAll(repo: string, subject: string): void {
  execFileSync("git", ["-C", repo, "add", "-A"]);
  execFileSync("git", ["-C", repo, "commit", "-q", "-m", subject]);
}

const ADR_REL = join("docs", "adr", "ADR-001-a-real-decision.md");

describe("TS agrees with the live Shell oracle on S4.APPEND (DoD 1)", () => {
  // (a) MUST FAIL -- the § Decision body itself is rewritten after the deciding commit.
  test("FAIL: § Decision rewritten after the deciding commit -- both sides catch it, same named finding", () => {
    const repo = gitRepoFromClean("s4-append-oracle-edited-");
    const adr = join(repo, ADR_REL);
    const text = readFileSync(adr, "utf8").replace(
      "We chose the first option.",
      "We chose the second option after all.",
    );
    expect(text).toContain("second option after all"); // the seed actually landed
    writeFileSync(adr, text);
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
    const repo = gitRepoFromClean("s4-append-oracle-marker-");
    const adr = join(repo, ADR_REL);
    const text = readFileSync(adr, "utf8").replace(
      "- **Status:** accepted (2026-08-20)",
      "- **Status:** accepted (2026-08-20)\n- **Scope amended by:** [ADR-002](ADR-002-a-later-decision.md) (2026-08-21)",
    );
    expect(text).toContain("Scope amended by"); // the seed actually landed
    writeFileSync(adr, text);
    commitAll(repo, "mark the ADR as amended in the open");

    const shell = runShellEngine(repo);
    const shellLines = appendLines(shell.stdout);
    expect(shellLines.some((l) => l.startsWith("FAIL"))).toBe(false);
    expect(shellLines.join("\n")).toContain("1 ADR(s) unedited");

    const ts = evaluate(createFsAdrAppendPort(repo));
    expect(ts.verdict).toBe("pass");
    expect(ts.findings).toEqual([]);
  }, ORACLE_TIMEOUT_MS);

  // (c) The honest-report case: no history to consult at all.
  test("NOTE: no git history at all -- neither side guesses, both report honestly and distinctly from (d)", () => {
    const repo = mkdtempSync(join(tmpdir(), "s4-append-oracle-nogit-"));
    cpSync(CLEAN_FIXTURE, repo, { recursive: true });

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
    const edited = gitRepoFromClean("s4-append-oracle-shallow-src-");
    const adr = join(edited, ADR_REL);
    writeFileSync(adr, readFileSync(adr, "utf8").replace("first option", "second option"));
    commitAll(edited, "an edit the shallow clone will never see");

    // `--no-local`: a plain filesystem path source otherwise takes git's local-clone (hardlink)
    // fast path, which silently IGNORES `--depth` (git prints its own warning) -- discovered live
    // during T7's own build. `--no-local` forces the normal transport, which honours it.
    const shallow = mkdtempSync(join(tmpdir(), "s4-append-oracle-shallow-"));
    execFileSync("git", ["clone", "-q", "--no-local", "--depth", "1", edited, shallow]);
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
