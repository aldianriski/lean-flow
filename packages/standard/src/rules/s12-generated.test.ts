import { describe, expect, test } from "bun:test";
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { FsGitBoundaryPort } from "../adapters/fs-git-boundary.ts";
import { InMemoryGitBoundaryPort } from "./git-boundary-port.fake.ts";
import {
  GENERATED_ARTIFACT_COMMITTED,
  SPEC_TABLE_UNREADABLE,
  evaluate,
  isExplicitlyAllowed,
  matchesGeneratedClass,
} from "./s12-generated.ts";

const CLASSES = ["node_modules/", "dist/", "*.log", ".DS_Store", ".vscode/settings.json", ".vscode/extensions.json"];
const ALLOWED = [".vscode/extensions.json"];

function freshGitRepo(prefix: string): string {
  const repo = mkdtempSync(join(tmpdir(), prefix));
  execFileSync("git", ["-C", repo, "init", "-q"]);
  execFileSync("git", ["-C", repo, "config", "user.email", "test@test.local"]);
  execFileSync("git", ["-C", repo, "config", "user.name", "test"]);
  return repo;
}

function track(repo: string, relPath: string, content: string): void {
  const full = join(repo, relPath);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, content);
  execFileSync("git", ["-C", repo, "add", relPath]);
}

describe("matchesGeneratedClass — the three §12c shapes", () => {
  test("a directory-prefix class matches at the root and at any depth", () => {
    expect(matchesGeneratedClass("node_modules/foo.js", "node_modules/")).toBe(true);
    expect(matchesGeneratedClass("apps/web/node_modules/foo.js", "node_modules/")).toBe(true);
    expect(matchesGeneratedClass("src/node_modules_helper.ts", "node_modules/")).toBe(false);
  });
  test("an extension-glob class matches by suffix, any depth", () => {
    expect(matchesGeneratedClass("foo.log", "*.log")).toBe(true);
    expect(matchesGeneratedClass("logs/foo.log", "*.log")).toBe(true);
    expect(matchesGeneratedClass("foo.logger", "*.log")).toBe(false);
  });
  test("a literal-path class matches exactly or as a basename at any depth", () => {
    expect(matchesGeneratedClass(".DS_Store", ".DS_Store")).toBe(true);
    expect(matchesGeneratedClass("foo/.DS_Store", ".DS_Store")).toBe(true);
    expect(matchesGeneratedClass("foo/.DS_Storefake", ".DS_Store")).toBe(false);
  });
});

describe("isExplicitlyAllowed — the §12c carve-out is a LITERAL match, never class-shaped", () => {
  test("the exact carve-out path is allowed, at root or nested", () => {
    expect(isExplicitlyAllowed(".vscode/extensions.json", ALLOWED)).toBe(true);
    expect(isExplicitlyAllowed("apps/web/.vscode/extensions.json", ALLOWED)).toBe(true);
  });
  test("its sibling settings.json is NOT allowed — only extensions.json is named", () => {
    expect(isExplicitlyAllowed(".vscode/settings.json", ALLOWED)).toBe(false);
  });
});

describe("evaluate — the verdicts, against the in-memory fake", () => {
  test("not a git repository: note", () => {
    const r = evaluate(new InMemoryGitBoundaryPort({ isRepo: false, generatedClasses: CLASSES }));
    expect(r.verdict).toBe("note");
    expect(r.findings).toEqual([]);
  });

  test("§12c names no classes at all: fail, spec-table-unreadable — never a silent pass", () => {
    const r = evaluate(
      new InMemoryGitBoundaryPort({ files: { "dist/bundle.js": "x" }, generatedClasses: [] }),
    );
    expect(r.verdict).toBe("fail");
    expect(r.findings).toHaveLength(1);
    expect(r.findings[0]?.name).toBe(SPEC_TABLE_UNREADABLE);
  });

  test("a clean repo with no reproducible artifact tracked: pass", () => {
    const r = evaluate(
      new InMemoryGitBoundaryPort({ files: { "src/index.ts": "x" }, generatedClasses: CLASSES, generatedAllowedExclusions: ALLOWED }),
    );
    expect(r.verdict).toBe("pass");
    expect(r.findings).toEqual([]);
  });

  test("the explicit carve-out (.vscode/extensions.json) tracked: pass, never a finding", () => {
    const r = evaluate(
      new InMemoryGitBoundaryPort({
        files: { ".vscode/extensions.json": "{}" },
        generatedClasses: CLASSES,
        generatedAllowedExclusions: ALLOWED,
      }),
    );
    expect(r.verdict).toBe("pass");
    expect(r.findings).toEqual([]);
  });

  test("a tracked dist/bundle.js: fail, ONE finding named generated-artifact-committed", () => {
    const r = evaluate(
      new InMemoryGitBoundaryPort({
        files: { "dist/bundle.js": "x" },
        generatedClasses: CLASSES,
        generatedAllowedExclusions: ALLOWED,
      }),
    );
    expect(r.verdict).toBe("fail");
    expect(r.findings).toHaveLength(1);
    expect(r.findings[0]?.name).toBe(GENERATED_ARTIFACT_COMMITTED);
    expect(r.findings[0]?.detail).toContain("dist/bundle.js");
  });

  test("TWO offending artifacts: fail, TWO findings — cardinality must match", () => {
    const r = evaluate(
      new InMemoryGitBoundaryPort({
        files: { "dist/bundle.js": "x", ".DS_Store": "y" },
        generatedClasses: CLASSES,
        generatedAllowedExclusions: ALLOWED,
      }),
    );
    expect(r.verdict).toBe("fail");
    expect(r.findings).toHaveLength(2);
    expect(r.findings.every((f) => f.name === GENERATED_ARTIFACT_COMMITTED)).toBe(true);
  });
});

// --- DoD 3: the port is a SEAM, not a wrapper ------------------------------------------------------

describe("evaluate — the SAME evaluator against both port implementations (DoD 3)", () => {
  test("fake and real Bun adapter agree on a tracked node_modules/ artifact", () => {
    const repo = freshGitRepo("s12-generated-seam-fail-");
    const realSpec = readFileSync(fileURLToPath(new URL("../../../../spec/STANDARD.md", import.meta.url)), "utf8");
    track(repo, "spec/STANDARD.md", realSpec);
    track(repo, "node_modules/pkg/index.js", "module.exports = {};\n");

    const fake = new InMemoryGitBoundaryPort({
      files: { "node_modules/pkg/index.js": "module.exports = {};\n" },
      generatedClasses: CLASSES,
      generatedAllowedExclusions: ALLOWED,
    });
    const real = new FsGitBoundaryPort(repo);

    expect(evaluate(real).verdict).toBe(evaluate(fake).verdict);
    expect(evaluate(real).verdict).toBe("fail");
  });

  test("fake and real Bun adapter agree on the explicit carve-out — pass, never a finding", () => {
    const repo = freshGitRepo("s12-generated-seam-clean-");
    const realSpec = readFileSync(fileURLToPath(new URL("../../../../spec/STANDARD.md", import.meta.url)), "utf8");
    track(repo, "spec/STANDARD.md", realSpec);
    track(repo, ".vscode/extensions.json", "{}\n");

    const fake = new InMemoryGitBoundaryPort({
      files: { ".vscode/extensions.json": "{}\n" },
      generatedClasses: CLASSES,
      generatedAllowedExclusions: ALLOWED,
    });
    const real = new FsGitBoundaryPort(repo);

    expect(evaluate(real).verdict).toBe(evaluate(fake).verdict);
    expect(evaluate(real).verdict).toBe("pass");
  });

  // The differentiating case: an IGNORED (untracked) node_modules/ directory is exactly the compliant
  // state and must be invisible to the real adapter -- the in-memory fake has no notion of "present
  // but ignored" at all, since it only ever models what IS tracked.
  test("an ignored (untracked) node_modules/ is invisible to the real adapter — the differentiating case", () => {
    const repo = freshGitRepo("s12-generated-seam-untracked-");
    const realSpec = readFileSync(fileURLToPath(new URL("../../../../spec/STANDARD.md", import.meta.url)), "utf8");
    track(repo, "spec/STANDARD.md", realSpec);
    track(repo, "README.md", "# hi\n");
    mkdirSync(join(repo, "node_modules", "pkg"), { recursive: true });
    writeFileSync(join(repo, "node_modules", "pkg", "index.js"), "module.exports = {};\n");

    const real = new FsGitBoundaryPort(repo);
    expect(real.trackedFiles().some((f) => f.startsWith("node_modules/"))).toBe(false);

    const r = evaluate(real);
    expect(r.verdict).toBe("pass");
    expect(r.findings).toEqual([]);
  });
});

// --- DoD 4: TS agrees with the SHELL ORACLE, spawned live, on the named finding and exit meaning ----

const ENGINE_PATH = fileURLToPath(new URL("../../../../scripts/lib/conformance-engine.sh", import.meta.url));
const ORACLE_TIMEOUT_MS = 20_000;

function runShellEngine(repoDir: string): { readonly code: number; readonly stdout: string } {
  try {
    const stdout = execFileSync("sh", [ENGINE_PATH, repoDir], { encoding: "utf8", timeout: 15_000 });
    return { code: 0, stdout };
  } catch (e) {
    const err = e as { status?: number; stdout?: string };
    return { code: err.status ?? 1, stdout: err.stdout ?? "" };
  }
}

function generatedLines(stdout: string): string[] {
  return stdout.split("\n").filter((l) => l.includes("S12.GENERATED") || l.includes(GENERATED_ARTIFACT_COMMITTED));
}

describe("TS agrees with the live Shell oracle on S12.GENERATED (DoD 4)", () => {
  // The retained must-FAIL fixture.
  test("FAIL: a tracked dist/ artifact is caught by both sides, same named finding", () => {
    const repo = freshGitRepo("s12-generated-oracle-fail-");
    const realSpec = readFileSync(fileURLToPath(new URL("../../../../spec/STANDARD.md", import.meta.url)), "utf8");
    track(repo, "spec/STANDARD.md", realSpec);
    track(repo, "dist/bundle.js", "console.log(1);\n");

    const shell = runShellEngine(repo);
    const shellLines = generatedLines(shell.stdout);
    expect(shellLines.some((l) => l.startsWith("FAIL"))).toBe(true);
    expect(shellLines.join("\n")).toContain(GENERATED_ARTIFACT_COMMITTED);

    const ts = evaluate(new FsGitBoundaryPort(repo));
    expect(ts.verdict).toBe("fail");
    expect(ts.findings[0]?.name).toBe(GENERATED_ARTIFACT_COMMITTED);
  }, ORACLE_TIMEOUT_MS);

  // The sibling control: the explicit §12c carve-out, tracked -- proves the FAIL case discriminates
  // per-class, not by rejecting anything under a similar dotfile shape.
  test("PASS control: the explicit .vscode/extensions.json carve-out is caught by neither side", () => {
    const repo = freshGitRepo("s12-generated-oracle-pass-");
    const realSpec = readFileSync(fileURLToPath(new URL("../../../../spec/STANDARD.md", import.meta.url)), "utf8");
    track(repo, "spec/STANDARD.md", realSpec);
    track(repo, ".vscode/extensions.json", "{}\n");

    const shell = runShellEngine(repo);
    const shellLines = generatedLines(shell.stdout);
    expect(shellLines.some((l) => l.startsWith("FAIL"))).toBe(false);
    expect(shellLines.some((l) => l.startsWith("PASS"))).toBe(true);

    const ts = evaluate(new FsGitBoundaryPort(repo));
    expect(ts.verdict).toBe("pass");
    expect(ts.findings).toEqual([]);
  }, ORACLE_TIMEOUT_MS);

  test("NOTE: not a git repository at all — neither side reports a finding", () => {
    const repo = mkdtempSync(join(tmpdir(), "s12-generated-oracle-note-"));

    const shell = runShellEngine(repo);
    const shellLines = generatedLines(shell.stdout);
    expect(shellLines.some((l) => l.startsWith("FAIL"))).toBe(false);
    expect(shellLines.join("\n")).toContain("not a git repository");

    const ts = evaluate(new FsGitBoundaryPort(repo));
    expect(ts.verdict).toBe("note");
    expect(ts.findings).toEqual([]);
  }, ORACLE_TIMEOUT_MS);
});
