import { describe, expect, test } from "bun:test";
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { FsGitBoundaryPort } from "../adapters/fs-git-boundary.ts";
import { InMemoryGitBoundaryPort } from "./git-boundary-port.fake.ts";
import { DATABASE_BACKUP_COMMITTED, confirmsDumpPreamble, evaluate, isBackupShaped } from "./s12-backups.ts";

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

describe("isBackupShaped / confirmsDumpPreamble — shape and content are separate checks", () => {
  test(".sql/.dump/.bak are the only shapes; a plain .txt is not", () => {
    expect(isBackupShaped("prod.sql")).toBe(true);
    expect(isBackupShaped("prod.dump")).toBe(true);
    expect(isBackupShaped("prod.bak")).toBe(true);
    expect(isBackupShaped("prod.txt")).toBe(false);
  });
  test("a real dump preamble is a confirmation, case-insensitively", () => {
    expect(confirmsDumpPreamble("-- PostgreSQL database dump\n...")).toBe(true);
    expect(confirmsDumpPreamble("-- postgresql DATABASE DUMP\n...")).toBe(true);
    expect(confirmsDumpPreamble("-- MySQL dump 10.13\n...")).toBe(true);
    expect(confirmsDumpPreamble("mysqldump: dumping table")).toBe(true);
  });
  test("a hand-written FAKE seed with no generator banner is never a confirmation", () => {
    expect(confirmsDumpPreamble("INSERT INTO users VALUES (1, 'test');\n")).toBe(false);
  });
});

describe("evaluate — the three verdicts, against the in-memory fake", () => {
  test("not a git repository: note", () => {
    const r = evaluate(new InMemoryGitBoundaryPort({ isRepo: false }));
    expect(r.verdict).toBe("note");
    expect(r.findings).toEqual([]);
  });

  test("a tracked seed.sql with no dump preamble: pass — §12 permits small fake seed files", () => {
    const r = evaluate(new InMemoryGitBoundaryPort({ files: { "seed.sql": "INSERT INTO t VALUES (1);\n" } }));
    expect(r.verdict).toBe("pass");
    expect(r.findings).toEqual([]);
  });

  test("a tracked dump with a real preamble: fail, ONE finding named database-backup-committed", () => {
    const r = evaluate(
      new InMemoryGitBoundaryPort({ files: { "prod.sql": "-- PostgreSQL database dump\n...\n" } }),
    );
    expect(r.verdict).toBe("fail");
    expect(r.findings).toHaveLength(1);
    expect(r.findings[0]?.name).toBe(DATABASE_BACKUP_COMMITTED);
    expect(r.findings[0]?.detail).toContain("prod.sql");
  });

  test("TWO offending dumps: fail, TWO findings — cardinality must match", () => {
    const r = evaluate(
      new InMemoryGitBoundaryPort({
        files: {
          "prod.sql": "-- PostgreSQL database dump\n",
          "backup.dump": "MySQL dump 10.13\n",
        },
      }),
    );
    expect(r.verdict).toBe("fail");
    expect(r.findings).toHaveLength(2);
    expect(r.findings.every((f) => f.name === DATABASE_BACKUP_COMMITTED)).toBe(true);
  });
});

// --- DoD 3: the port is a SEAM, not a wrapper ------------------------------------------------------

describe("evaluate — the SAME evaluator against both port implementations (DoD 3)", () => {
  test("fake and real Bun adapter agree on a real dump", () => {
    const repo = freshGitRepo("s12-backups-seam-fail-");
    track(repo, "prod-dump.sql", "-- PostgreSQL database dump\n-- Dumped from database version 14.2\n");

    const fake = new InMemoryGitBoundaryPort({
      files: { "prod-dump.sql": "-- PostgreSQL database dump\n-- Dumped from database version 14.2\n" },
    });
    const real = new FsGitBoundaryPort(repo);

    expect(evaluate(real).verdict).toBe(evaluate(fake).verdict);
    expect(evaluate(real).verdict).toBe("fail");
  });

  test("fake and real Bun adapter agree on a clean fake seed", () => {
    const repo = freshGitRepo("s12-backups-seam-clean-");
    track(repo, "fixtures/seed.sql", "INSERT INTO users VALUES (1, 'a@b.test');\n");

    const fake = new InMemoryGitBoundaryPort({
      files: { "fixtures/seed.sql": "INSERT INTO users VALUES (1, 'a@b.test');\n" },
    });
    const real = new FsGitBoundaryPort(repo);

    expect(evaluate(real).verdict).toBe(evaluate(fake).verdict);
    expect(evaluate(real).verdict).toBe("pass");
  });

  // The differentiating case: an UNTRACKED real dump on disk must be invisible to the real adapter --
  // the in-memory fake has no notion of "untracked" at all, so only the real git-index-backed adapter
  // can even represent this scenario.
  test("an UNTRACKED real dump on disk is invisible to the real adapter — the differentiating case", () => {
    const repo = freshGitRepo("s12-backups-seam-untracked-");
    track(repo, "README.md", "# hi\n");
    writeFileSync(join(repo, "prod.sql"), "-- PostgreSQL database dump\n");

    const real = new FsGitBoundaryPort(repo);
    expect(real.trackedFiles()).not.toContain("prod.sql");

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

function backupsLines(stdout: string): string[] {
  return stdout.split("\n").filter((l) => l.includes("S12.BACKUPS") || l.includes(DATABASE_BACKUP_COMMITTED));
}

describe("TS agrees with the live Shell oracle on S12.BACKUPS (DoD 4)", () => {
  // The retained must-FAIL fixture.
  test("FAIL: a real pg_dump export is caught by both sides, same named finding", () => {
    const repo = freshGitRepo("s12-backups-oracle-fail-");
    track(
      repo,
      "production-dump.sql",
      "--\n-- PostgreSQL database dump\n--\n-- Dumped from database version 14.2\nSET statement_timeout = 0;\n",
    );

    const shell = runShellEngine(repo);
    const shellLines = backupsLines(shell.stdout);
    expect(shellLines.some((l) => l.startsWith("FAIL"))).toBe(true);
    expect(shellLines.join("\n")).toContain(DATABASE_BACKUP_COMMITTED);

    const ts = evaluate(new FsGitBoundaryPort(repo));
    expect(ts.verdict).toBe("fail");
    expect(ts.findings[0]?.name).toBe(DATABASE_BACKUP_COMMITTED);
  }, ORACLE_TIMEOUT_MS);

  // The sibling control: the SAME extension shape, no generator banner -- §12's own explicit
  // "small FAKE seed files are fine in-repo" carve-out, proving the FAIL case discriminates on the
  // dump-tool preamble, never on the extension alone.
  test("PASS control: a hand-written fake seed .sql with no generator banner is caught by neither side", () => {
    const repo = freshGitRepo("s12-backups-oracle-pass-");
    track(repo, "fixtures/seed.sql", "INSERT INTO users (id, email) VALUES (1, 'test@example.test');\n");

    const shell = runShellEngine(repo);
    const shellLines = backupsLines(shell.stdout);
    expect(shellLines.some((l) => l.startsWith("FAIL"))).toBe(false);
    expect(shellLines.some((l) => l.startsWith("PASS"))).toBe(true);

    const ts = evaluate(new FsGitBoundaryPort(repo));
    expect(ts.verdict).toBe("pass");
    expect(ts.findings).toEqual([]);
  }, ORACLE_TIMEOUT_MS);

  test("NOTE: not a git repository at all — neither side reports a finding", () => {
    const repo = mkdtempSync(join(tmpdir(), "s12-backups-oracle-note-"));

    const shell = runShellEngine(repo);
    const shellLines = backupsLines(shell.stdout);
    expect(shellLines.some((l) => l.startsWith("FAIL"))).toBe(false);
    expect(shellLines.join("\n")).toContain("not a git repository");

    const ts = evaluate(new FsGitBoundaryPort(repo));
    expect(ts.verdict).toBe("note");
    expect(ts.findings).toEqual([]);
  }, ORACLE_TIMEOUT_MS);
});
