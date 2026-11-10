import { expect, test } from "bun:test";
import { join, resolve } from "node:path";

const root = resolve(import.meta.dir, "../..");
const fixtures = join(root, "test/fixtures/trials");
for (const [fixture, finding] of [
  ["deny-bad", "DENY_PATH_FORM"],
  ["cmd-repl", "CMD_REPL_OR_BLOCKED: python"],
  ["cmd-sleep", "CMD_REPL_OR_BLOCKED: sleep"],
  ["baseline-red", "BASELINE_NOT_GREEN"],
  ["control-green", ""],
] as const) {
  test(`preflight ${fixture}`, () => {
    const dir = join(fixtures, fixture);
    const child = Bun.spawnSync([process.execPath, "--no-env-file", "scripts/trials/preflight.ts",
      "--deny-file", join(dir, "deny.json"), "--brief", join(dir, "brief.txt"),
      "--gate-cmd", JSON.stringify([process.execPath, "--no-env-file", join(fixtures,
        fixture === "baseline-red" ? "fixture-red.ts" : "fixture-green.ts")])], { cwd: root });
    const out = child.stdout.toString();
    expect(child.exitCode).toBe(finding ? 1 : 0);
    expect(out.trim().split(/\r?\n/)).toEqual(finding ? [finding] : ["preflight: PASS"]);
  });
}

for (const gate of ["fixture-silent.ts", "fixture-red-zero.ts"]) {
  test(`preflight rejects ${gate} despite exit zero`, () => {
    const dir = join(fixtures, "control-green");
    const child = Bun.spawnSync([process.execPath, "--no-env-file", "scripts/trials/preflight.ts",
      "--deny-file", join(dir, "deny.json"), "--brief", join(dir, "brief.txt"),
      "--gate-cmd", JSON.stringify([process.execPath, "--no-env-file", join(fixtures, gate)])], { cwd: root });
    expect(child.exitCode).toBe(1);
    expect(child.stdout.toString().trim()).toBe("BASELINE_NOT_GREEN");
  });
}
