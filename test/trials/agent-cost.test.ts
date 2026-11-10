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

function costOf(fixture: string) {
  const root = resolve(import.meta.dir, "../..");
  return Bun.spawnSync([process.execPath, "--no-env-file", "scripts/trials/agent-cost.ts",
    "--file", `test/fixtures/trials/${fixture}`], { cwd: root });
}

test("a zero-usage <synthetic> message (an API-error turn) is skipped, not priced", () => {
  const p = costOf("cost-synthetic-zero.jsonl");
  expect(p.exitCode).toBe(0);
  expect(p.stdout.toString()).toContain("turns 2 USD 55.210000");
});

test("a <synthetic> message with any nonzero usage still has no fitted price", () => {
  const p = costOf("cost-synthetic-priced.jsonl");
  expect(p.exitCode).not.toBe(0);
  expect(p.stderr.toString() + p.stdout.toString()).toContain("no fitted price for model <synthetic>");
});
