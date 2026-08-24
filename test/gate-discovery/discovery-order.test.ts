import { describe, expect, test } from "bun:test";
import { join } from "node:path";
import { bypassesDeclaredGate, discoverGate } from "./discover.ts";

const FIXTURES = join(import.meta.dir, "..", "fixtures", "gate-discovery");
const REPO = join(import.meta.dir, "..", "..");

describe("gate discovery — the four-rung order", () => {
  test("CONTROL: with no manifest, rungs 1-3 miss and rung 4 answers with the declared command", () => {
    const d = discoverGate(join(FIXTURES, "no-manifest"));
    expect(d.rung).toBe(4);
    expect(d.command).toBe("sh scripts/qa-check.sh");
    // Report the denominator: a pass that never reached rungs 1-3 would be vacuous (L-156).
    expect(d.examined).toEqual([1, 2, 3, 4]);
  });

  test("a manifest outranks a declared gate — rung 4 is never reached once rung 1 hits", () => {
    const d = discoverGate(join(FIXTURES, "manifest-runs-gate"));
    expect(d.rung).toBe(1);
    expect(d.examined).toEqual([1]);
    // This is the documented precedence ("anything discoverable wins over it"), not a defect.
    // The defect is what the next test catches.
  });
});

describe("gate discovery — a discovered command that does not run the declared gate", () => {
  // MUST-FAIL FIXTURE (retained, TD-012). Deleting it with the prototype leaves this unguarded,
  // and the failure it guards is silent: discovery still returns a command and still reports a
  // verdict, so nothing looks wrong.
  test("MUST-FAIL: a manifest whose test script bypasses the declared gate is CAUGHT", () => {
    const root = join(FIXTURES, "manifest-bypasses-gate");
    const r = bypassesDeclaredGate(root);

    expect(r.declared).toBe("sh scripts/qa-check.sh");
    expect(r.discovered).toBe("echo ok");
    expect(r.bypassed).toBe(true);
  });

  test("CONTROL: a manifest that outranks the declaration but still invokes it is NOT flagged", () => {
    const r = bypassesDeclaredGate(join(FIXTURES, "manifest-runs-gate"));
    expect(r.bypassed).toBe(false);
    // The control and the must-FAIL differ in exactly one thing — the test script — so a pass here
    // proves discrimination, not merely that the function returns false sometimes.
    expect(r.discovered).toContain("sh scripts/qa-check.sh");
  });
});

describe("gate discovery — this repository", () => {
  test("resolves at rung 1 since SPRINT-083 T2 added the manifest", () => {
    const d = discoverGate(REPO);
    expect(d.rung).toBe(1);
  });

  test("the rung-1 command still runs the gate .gate-command declares", () => {
    const r = bypassesDeclaredGate(REPO);
    expect(r.declared).toBe("sh scripts/qa-check.sh");
    expect(r.bypassed).toBe(false);
  });
});
