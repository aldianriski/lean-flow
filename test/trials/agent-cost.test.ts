import { expect, test } from "bun:test";
import { resolve } from "node:path";

test("cost reader prices each message model and deduplicates streamed message IDs", () => {
  const root = resolve(import.meta.dir, "../..");
  const p = Bun.spawnSync([process.execPath, "--no-env-file", "scripts/trials/agent-cost.ts",
    "--file", "test/fixtures/trials/cost.jsonl"], { cwd: root });
  expect(p.exitCode).toBe(0);
  expect(p.stdout.toString()).toContain("turns 2 USD 55.210000");
  expect(p.stdout.toString()).toContain("total USD 55.210000");
});
