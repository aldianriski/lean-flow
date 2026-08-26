import { describe, expect, test } from "bun:test";
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { FsGitBoundaryPort } from "../adapters/fs-git-boundary.ts";
import { InMemoryGitBoundaryPort } from "./git-boundary-port.fake.ts";
import { SECRET_COMMITTED, envConfirmsRealValue, evaluate, secretShapeOf } from "./s12-secrets.ts";

// `execFileSync`/`writeFileSync`/`mkdtempSync` stay in this `*.test.ts` file only, matching
// sprint-log-outside-logs-dir.test.ts's own pattern.

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

function untracked(repo: string, relPath: string, content: string): void {
  const full = join(repo, relPath);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, content);
}

describe("secretShapeOf — SHAPE match only, never content", () => {
  test("canonical placeholder names are NOT a shape match at all -- committing them is correct", () => {
    expect(secretShapeOf(".env.example")).toBeNull();
    expect(secretShapeOf(".env.sample")).toBeNull();
    expect(secretShapeOf(".env.template")).toBeNull();
  });
  test("the five real .env names are a shape match", () => {
    for (const n of [".env", ".env.local", ".env.production", ".env.development", ".env.staging"]) {
      expect(secretShapeOf(n)).toBe("env");
    }
  });
  test("*.pem / *.key / SSH private-key basenames / service-account names are a shape match", () => {
    expect(secretShapeOf("server.pem")).toBe("pem");
    expect(secretShapeOf("server.key")).toBe("pem");
    expect(secretShapeOf("id_rsa")).toBe("pem");
    expect(secretShapeOf("id_ed25519")).toBe("pem");
    expect(secretShapeOf("service-account.json")).toBe("sa");
    expect(secretShapeOf("serviceaccount.json")).toBe("sa");
  });
  test("an ordinary file is no shape at all", () => {
    expect(secretShapeOf("README.md")).toBeNull();
  });
});

describe("envConfirmsRealValue — CONTENT confirmation, not just shape", () => {
  test("a comment line is never a confirmation", () => {
    expect(envConfirmsRealValue("# API_KEY=sk-real-value-123")).toBe(false);
  });
  test("an empty value is never a confirmation", () => {
    expect(envConfirmsRealValue("API_KEY=")).toBe(false);
  });
  test("a placeholder value (<...>, changeme, your-, example, xxx, todo, ...) is never a confirmation", () => {
    expect(envConfirmsRealValue("API_KEY=<your-key-here>")).toBe(false);
    expect(envConfirmsRealValue("PASSWORD=changeme")).toBe(false);
    expect(envConfirmsRealValue("TOKEN=your-token")).toBe(false);
    expect(envConfirmsRealValue("KEY=example")).toBe(false);
    expect(envConfirmsRealValue("KEY=xxxxxxxx")).toBe(false);
    expect(envConfirmsRealValue("KEY=todo")).toBe(false);
    expect(envConfirmsRealValue("KEY=...")).toBe(false);
  });
  test("a real-looking value IS a confirmation", () => {
    expect(envConfirmsRealValue("STRIPE_SECRET_KEY=sk_live_51H8x9K2eZvKYlo2C")).toBe(true);
  });
});

describe("evaluate — the three verdicts, against the in-memory fake", () => {
  test("not a git repository: note, not a finding", () => {
    const r = evaluate(new InMemoryGitBoundaryPort({ isRepo: false }));
    expect(r.verdict).toBe("note");
    expect(r.findings).toEqual([]);
  });

  test("a tracked .env with only placeholders: pass", () => {
    const r = evaluate(new InMemoryGitBoundaryPort({ files: { ".env": "API_KEY=<changeme>\n" } }));
    expect(r.verdict).toBe("pass");
    expect(r.findings).toEqual([]);
  });

  test("a tracked .env with a real value: fail, ONE finding named secret-committed, naming the file", () => {
    const r = evaluate(
      new InMemoryGitBoundaryPort({ files: { ".env": "STRIPE_SECRET_KEY=sk_live_51H8x9K2eZvKYlo2C\n" } }),
    );
    expect(r.verdict).toBe("fail");
    expect(r.findings).toHaveLength(1);
    expect(r.findings[0]?.name).toBe(SECRET_COMMITTED);
    expect(r.findings[0]?.detail).toContain(".env");
  });

  // Cardinality (EPIC-014 D2, mirroring T1's own S9 finding): TWO offending files must read back as
  // TWO findings, never one comma-joined finding.
  test("TWO offending files: fail, TWO findings — cardinality, not just names, must match", () => {
    const r = evaluate(
      new InMemoryGitBoundaryPort({
        files: {
          ".env": "TOKEN=ghp_real1234567890\n",
          "id_rsa": "-----BEGIN OPENSSH PRIVATE KEY-----\nPRIVATE KEY\n-----END OPENSSH PRIVATE KEY-----\n",
        },
      }),
    );
    expect(r.verdict).toBe("fail");
    expect(r.findings).toHaveLength(2);
    expect(r.findings.every((f) => f.name === SECRET_COMMITTED)).toBe(true);
  });
});

// --- DoD 3: the port is a SEAM, not a wrapper ------------------------------------------------------

describe("evaluate — the SAME evaluator against both port implementations (DoD 3)", () => {
  test("fake and real Bun adapter agree on a leaked .env", () => {
    const repo = freshGitRepo("s12-secrets-seam-fail-");
    track(repo, ".env", "DB_PASSWORD=hunter2-actual-value\n");

    const fake = new InMemoryGitBoundaryPort({ files: { ".env": "DB_PASSWORD=hunter2-actual-value\n" } });
    const real = new FsGitBoundaryPort(repo);

    expect(evaluate(real).verdict).toBe(evaluate(fake).verdict);
    expect(evaluate(real).verdict).toBe("fail");
  });

  test("fake and real Bun adapter agree on a clean repo", () => {
    const repo = freshGitRepo("s12-secrets-seam-clean-");
    track(repo, "README.md", "# hi\n");

    const fake = new InMemoryGitBoundaryPort({ files: { "README.md": "# hi\n" } });
    const real = new FsGitBoundaryPort(repo);

    expect(evaluate(real).verdict).toBe(evaluate(fake).verdict);
    expect(evaluate(real).verdict).toBe("pass");
  });

  // The differentiating case (mirrors T1's directory-vs-file case): the in-memory fake has NO notion
  // of "tracked vs untracked" -- it is handed a dict and every key IS tracked by construction. The
  // real adapter's `trackedFiles()` calls git's own index, so an UNTRACKED secret-shaped file sitting
  // on disk must never surface as a finding -- proving `git ls-files`, not a directory walk, is what
  // backs this port.
  test("an UNTRACKED secret-shaped file on disk is invisible to the real adapter — the differentiating case", () => {
    const repo = freshGitRepo("s12-secrets-seam-untracked-");
    track(repo, "README.md", "# hi\n");
    untracked(repo, ".env", "DB_PASSWORD=hunter2-actual-value\n");

    const real = new FsGitBoundaryPort(repo);
    expect(real.trackedFiles()).not.toContain(".env");

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

function secretsLines(stdout: string): string[] {
  return stdout.split("\n").filter((l) => l.includes("S12.SECRETS") || l.includes(SECRET_COMMITTED));
}

describe("TS agrees with the live Shell oracle on S12.SECRETS (DoD 4)", () => {
  // The retained must-FAIL fixture (DoD 3's own requirement): a REAL leaked credential.
  test("FAIL: a real service-account private key is caught by both sides, same named finding", () => {
    const repo = freshGitRepo("s12-secrets-oracle-fail-");
    track(
      repo,
      "service-account.json",
      '{"type":"service_account","private_key":"-----BEGIN PRIVATE KEY-----\\nMIIEvQ...\\n-----END PRIVATE KEY-----\\n"}\n',
    );

    const shell = runShellEngine(repo);
    const shellLines = secretsLines(shell.stdout);
    expect(shellLines.some((l) => l.startsWith("FAIL"))).toBe(true);
    expect(shellLines.join("\n")).toContain(SECRET_COMMITTED);

    const ts = evaluate(new FsGitBoundaryPort(repo));
    expect(ts.verdict).toBe("fail");
    expect(ts.findings[0]?.name).toBe(SECRET_COMMITTED);
  }, ORACLE_TIMEOUT_MS);

  // The sibling control (DoD 3's own requirement): the SAME shape, a placeholder value -- must PASS,
  // proving the FAIL case above is discriminating on CONTENT, not merely on the filename shape.
  test("PASS control: a .env carrying only placeholders is caught by neither side", () => {
    const repo = freshGitRepo("s12-secrets-oracle-pass-");
    track(repo, ".env", "API_KEY=<your-key-here>\nDEBUG=changeme\n");

    const shell = runShellEngine(repo);
    const shellLines = secretsLines(shell.stdout);
    expect(shellLines.some((l) => l.startsWith("FAIL"))).toBe(false);
    expect(shellLines.some((l) => l.startsWith("PASS"))).toBe(true);

    const ts = evaluate(new FsGitBoundaryPort(repo));
    expect(ts.verdict).toBe("pass");
    expect(ts.findings).toEqual([]);
  }, ORACLE_TIMEOUT_MS);

  test("NOTE: not a git repository at all — neither side reports a finding", () => {
    const repo = mkdtempSync(join(tmpdir(), "s12-secrets-oracle-note-"));

    const shell = runShellEngine(repo);
    const shellLines = secretsLines(shell.stdout);
    expect(shellLines.some((l) => l.startsWith("FAIL"))).toBe(false);
    expect(shellLines.join("\n")).toContain("not a git repository");

    const ts = evaluate(new FsGitBoundaryPort(repo));
    expect(ts.verdict).toBe("note");
    expect(ts.findings).toEqual([]);
  }, ORACLE_TIMEOUT_MS);
});
