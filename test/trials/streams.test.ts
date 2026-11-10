import { expect, test } from "bun:test";
import { resolve } from "node:path";

const root = resolve(import.meta.dir, "../..");
const fixture = resolve(root, "test/fixtures/trials/streams");
for (const script of ["replay-check", "probe-check"]) for (const sample of ["green", "red"]) {
  test(`${script} ${sample}`, () => {
    const p = Bun.spawnSync([process.execPath, "--no-env-file", `scripts/trials/${script}.ts`,
      "--runs-dir", fixture, "--run", sample, "--wt-root", fixture,
      "--checks", resolve(fixture, "checks.json")], { cwd: root });
    expect(p.exitCode).toBe(sample === "green" ? 0 : 1);
    const out = p.stdout.toString();
    expect(out).toContain("total_cost_usd 0.125 · wall 2.0 min");
    expect(out).toContain("boxes 1/2");
    expect(out).toContain(sample === "green" ? "PASS" : "FAIL: WORKER_RESULT");
    expect(out).not.toContain("FAIL: COMPLETE");
  });
}
