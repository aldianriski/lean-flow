import { expect, test } from "bun:test";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { invoke, root, temporary } from "./helpers";

test("launch spends nothing by default; budget required; fake run receives explicit env", () => {
  const tmp = temporary();
  try {
    // Launch needs only an empty standalone repository, so no git mutation commands are needed here.
    const repo = join(tmp.path, "repo");
    mkdirSync(join(repo, ".git/objects"), { recursive: true });
    mkdirSync(join(repo, ".git/refs"));
    writeFileSync(join(repo, ".git/HEAD"), "ref: refs/heads/fixture\n");
    writeFileSync(join(repo, ".git/config"), "[core]\nrepositoryformatversion = 0\nbare = false\n");
    const shim = join(tmp.path, process.platform === "win32" ? "claude.exe" : "claude");
    const build = Bun.spawnSync([process.execPath, "--no-env-file", "build", "--compile", "--no-compile-autoload-dotenv",
      join(root, "test/fixtures/trials/fake-claude.ts"), "--outfile", shim]);
    expect(build.exitCode).toBe(0);
    const prompt = join(tmp.path, "prompt.txt"), deny = join(tmp.path, "deny.json");
    writeFileSync(prompt, "Private fixture prompt"); writeFileSync(deny, '["Bash(git push *)"]');
    // A sentinel is written but never opened; an inherited dotenv load would be visible to the shim.
    writeFileSync(join(repo, ".env"), "TRIAL_ENV_SENTINEL=loaded\n");
    const sentinel = join(tmp.path, "sentinel"); mkdirSync(sentinel);
    writeFileSync(join(sentinel, "untouched.txt"), "same bytes before and after\n");
    const before = invoke("snap", ["--repo", repo, "--watch-dir", sentinel]);
    expect(before.code).toBe(0);
    const argv = ["--repo", repo, "--plugin-dir", tmp.path, "--deny-file", deny,
      "--prompt-file", prompt, "--model", "fixture-model", "--claude-bin", shim,
      "--gate-dir", "/fixture/gate path", "--key-path", "/nonexistent/private.key"];
    const marker = join(repo, ".git/trial-run/marker.json");
    const dry = invoke("launch", argv);
    expect(dry.code).toBe(0);
    expect(dry.out).toContain("spend: 0.000000 USD (no call made)");
    expect(dry.out).toContain("<prompt sha256 ");
    expect(dry.out).not.toContain("Private fixture prompt");
    expect(existsSync(marker)).toBe(false);
    const unbudgeted = invoke("launch", [...argv, "--run"]);
    expect(unbudgeted.code).toBe(2);
    expect(existsSync(marker)).toBe(false);
    const paid = invoke("launch", [...argv, "--run", "--budget-usd", "0.01"]);
    expect(paid.code).toBe(0);
    const record = JSON.parse(readFileSync(marker, "utf8"));
    expect(record.gateDir).toBe("/fixture/gate path");
    expect(record.keyPath).toBe("/nonexistent/private.key");
    expect(record.tmp).toBe(join(repo, ".git/trial-run/tmp"));
    expect(record.dotenvLoaded).toBeNull();
    expect(record.config ?? null).toBe(process.env.CLAUDE_CONFIG_DIR ?? null); // inherited, not a credential-less fresh dir
    expect(record.args).toContain("--max-budget-usd");
    const after = invoke("snap", ["--repo", repo, "--watch-dir", sentinel]);
    expect(after.code).toBe(0);
    expect(after.out).toBe(before.out);
  } finally { tmp.cleanup(); }
});
