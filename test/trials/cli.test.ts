import { expect, test } from "bun:test";
import { invoke } from "./helpers";

for (const script of ["prep", "launch", "snap", "replay-check", "probe-check", "merge-oracle", "agent-cost", "preflight", "synthetic-repo", "lib"]) {
  test(`${script} requires caller inputs without side effects`, () => {
    const p = invoke(script, []);
    expect(p.code).toBe(2);
    expect(p.err).toContain("usage: bun --no-env-file");
  });
}
