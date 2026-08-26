import { describe, expect, test } from "bun:test";
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { FsGitBoundaryPort } from "../adapters/fs-git-boundary.ts";
import { InMemoryGitBoundaryPort } from "./git-boundary-port.fake.ts";
import {
  DESIGN_SOURCE_COMMITTED,
  SPEC_TABLE_UNREADABLE,
  evaluate,
  isDesignSourceShaped,
  isInsideAllowedDir,
} from "./s12-designsrc.ts";

const ALLOWED = ["public/", "src/assets/"];

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

describe("isDesignSourceShaped / isInsideAllowedDir", () => {
  test("design-source extensions match; an ordinary asset extension does not", () => {
    expect(isDesignSourceShaped("mockup.psd")).toBe(true);
    expect(isDesignSourceShaped("logo.ai")).toBe(true);
    expect(isDesignSourceShaped("demo.mp4")).toBe(true);
    expect(isDesignSourceShaped("icon.svg")).toBe(false);
  });
  test("a path at the repo root under an allowed prefix is inside", () => {
    expect(isInsideAllowedDir("public/logo.psd", ALLOWED)).toBe(true);
    expect(isInsideAllowedDir("src/assets/hero.ai", ALLOWED)).toBe(true);
  });
  test("a same-named path OUTSIDE any allowed prefix is not inside", () => {
    expect(isInsideAllowedDir("design/mockup.psd", ALLOWED)).toBe(false);
  });
});

describe("evaluate — the verdicts, against the in-memory fake", () => {
  test("not a git repository: note", () => {
    const r = evaluate(new InMemoryGitBoundaryPort({ isRepo: false, allowedAssetDirs: ALLOWED }));
    expect(r.verdict).toBe("note");
    expect(r.findings).toEqual([]);
  });

  test("§12 names no asset directory at all: fail, spec-table-unreadable — never a silent pass", () => {
    const r = evaluate(
      new InMemoryGitBoundaryPort({ files: { "design/mockup.psd": "x" }, allowedAssetDirs: [] }),
    );
    expect(r.verdict).toBe("fail");
    expect(r.findings).toHaveLength(1);
    expect(r.findings[0]?.name).toBe(SPEC_TABLE_UNREADABLE);
  });

  test("a design source INSIDE the allowed directory: pass", () => {
    const r = evaluate(
      new InMemoryGitBoundaryPort({ files: { "public/logo.psd": "x" }, allowedAssetDirs: ALLOWED }),
    );
    expect(r.verdict).toBe("pass");
    expect(r.findings).toEqual([]);
  });

  test("a design source OUTSIDE the allowed directory: fail, ONE finding named design-source-committed", () => {
    const r = evaluate(
      new InMemoryGitBoundaryPort({ files: { "design/mockup.psd": "x" }, allowedAssetDirs: ALLOWED }),
    );
    expect(r.verdict).toBe("fail");
    expect(r.findings).toHaveLength(1);
    expect(r.findings[0]?.name).toBe(DESIGN_SOURCE_COMMITTED);
    expect(r.findings[0]?.detail).toContain("design/mockup.psd");
  });

  test("TWO offending design sources: fail, TWO findings — cardinality must match", () => {
    const r = evaluate(
      new InMemoryGitBoundaryPort({
        files: { "design/mockup.psd": "x", "assets/hero.ai": "y" },
        allowedAssetDirs: ALLOWED,
      }),
    );
    expect(r.verdict).toBe("fail");
    expect(r.findings).toHaveLength(2);
    expect(r.findings.every((f) => f.name === DESIGN_SOURCE_COMMITTED)).toBe(true);
  });
});

// --- DoD 3: the port is a SEAM, not a wrapper ------------------------------------------------------

describe("evaluate — the SAME evaluator against both port implementations (DoD 3)", () => {
  test("fake and real Bun adapter agree on a design source outside the allowed dirs", () => {
    const repo = freshGitRepo("s12-designsrc-seam-fail-");
    track(repo, "design/mockup.psd", "binary-ish content\n");

    const fake = new InMemoryGitBoundaryPort({
      files: { "design/mockup.psd": "binary-ish content\n" },
      allowedAssetDirs: ALLOWED,
    });
    // The real adapter reads its allow-list from the SPEC file, not from a fixture-supplied array --
    // point it at a spec snippet on disk so both sides consult the SAME allow-list.
    const specSnippet = join(repo, "spec-snippet.md");
    writeFileSync(specSnippet, "design tool / asset storage — only assets the app actually uses go in `public/` or `src/assets/`\n");
    const realWithSpec = new FsGitBoundaryPort(repo, specSnippet);

    expect(evaluate(realWithSpec).verdict).toBe(evaluate(fake).verdict);
    expect(evaluate(realWithSpec).verdict).toBe("fail");
  });

  test("fake and real Bun adapter agree on a design source INSIDE the allowed dir", () => {
    const repo = freshGitRepo("s12-designsrc-seam-clean-");
    track(repo, "public/logo.psd", "binary-ish content\n");
    const specSnippet = join(repo, "spec-snippet.md");
    writeFileSync(specSnippet, "design tool / asset storage — only assets the app actually uses go in `public/` or `src/assets/`\n");

    const fake = new InMemoryGitBoundaryPort({
      files: { "public/logo.psd": "binary-ish content\n" },
      allowedAssetDirs: ALLOWED,
    });
    const real = new FsGitBoundaryPort(repo, specSnippet);

    expect(evaluate(real).verdict).toBe(evaluate(fake).verdict);
    expect(evaluate(real).verdict).toBe("pass");
  });

  // The differentiating case: an UNTRACKED design source outside the allowed dirs must be invisible to
  // the real adapter -- the in-memory fake has no notion of "untracked" at all.
  test("an UNTRACKED design source outside the allowed dirs is invisible to the real adapter", () => {
    const repo = freshGitRepo("s12-designsrc-seam-untracked-");
    track(repo, "README.md", "# hi\n");
    writeFileSync(join(repo, "mockup.psd"), "binary-ish content\n");
    const specSnippet = join(repo, "spec-snippet.md");
    writeFileSync(specSnippet, "design tool / asset storage — only assets the app actually uses go in `public/` or `src/assets/`\n");

    const real = new FsGitBoundaryPort(repo, specSnippet);
    expect(real.trackedFiles()).not.toContain("mockup.psd");

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

function designsrcLines(stdout: string): string[] {
  return stdout.split("\n").filter((l) => l.includes("S12.DESIGNSRC") || l.includes(DESIGN_SOURCE_COMMITTED));
}

describe("TS agrees with the live Shell oracle on S12.DESIGNSRC (DoD 4)", () => {
  // The retained must-FAIL fixture. The Shell oracle reads spec/STANDARD.md's OWN allow-list, so this
  // repo must carry the real repo's own spec file for the two sides to consult the same allow-list --
  // `FsGitBoundaryPort`'s default spec path already points at `<repo>/spec/STANDARD.md`.
  test("FAIL: a design source outside public/ or src/assets/ is caught by both sides", () => {
    const repo = freshGitRepo("s12-designsrc-oracle-fail-");
    // Bring the real spec/STANDARD.md into this fixture repo so both the Shell oracle and the TS
    // adapter's default spec path resolve to the SAME source of truth.
    const realSpec = readFileSync(fileURLToPath(new URL("../../../../spec/STANDARD.md", import.meta.url)), "utf8");
    track(repo, "spec/STANDARD.md", realSpec);
    track(repo, "design/mockup.psd", "binary-ish content\n");

    const shell = runShellEngine(repo);
    const shellLines = designsrcLines(shell.stdout);
    expect(shellLines.some((l) => l.startsWith("FAIL"))).toBe(true);
    expect(shellLines.join("\n")).toContain(DESIGN_SOURCE_COMMITTED);

    const ts = evaluate(new FsGitBoundaryPort(repo));
    expect(ts.verdict).toBe("fail");
    expect(ts.findings[0]?.name).toBe(DESIGN_SOURCE_COMMITTED);
  }, ORACLE_TIMEOUT_MS);

  // The sibling control: the SAME extension, INSIDE the allowed asset directory -- proves the FAIL
  // case discriminates on location, not merely on the extension.
  test("PASS control: the same design-source extension INSIDE public/ is caught by neither side", () => {
    const repo = freshGitRepo("s12-designsrc-oracle-pass-");
    const realSpec = readFileSync(fileURLToPath(new URL("../../../../spec/STANDARD.md", import.meta.url)), "utf8");
    track(repo, "spec/STANDARD.md", realSpec);
    track(repo, "public/logo.psd", "binary-ish content\n");

    const shell = runShellEngine(repo);
    const shellLines = designsrcLines(shell.stdout);
    expect(shellLines.some((l) => l.startsWith("FAIL"))).toBe(false);
    expect(shellLines.some((l) => l.startsWith("PASS"))).toBe(true);

    const ts = evaluate(new FsGitBoundaryPort(repo));
    expect(ts.verdict).toBe("pass");
    expect(ts.findings).toEqual([]);
  }, ORACLE_TIMEOUT_MS);

  test("NOTE: not a git repository at all — neither side reports a finding", () => {
    const repo = mkdtempSync(join(tmpdir(), "s12-designsrc-oracle-note-"));

    const shell = runShellEngine(repo);
    const shellLines = designsrcLines(shell.stdout);
    expect(shellLines.some((l) => l.startsWith("FAIL"))).toBe(false);
    expect(shellLines.join("\n")).toContain("not a git repository");

    const ts = evaluate(new FsGitBoundaryPort(repo));
    expect(ts.verdict).toBe("note");
    expect(ts.findings).toEqual([]);
  }, ORACLE_TIMEOUT_MS);
});
