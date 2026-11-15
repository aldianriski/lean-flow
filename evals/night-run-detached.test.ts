// evals/night-run-detached.test.ts -- fixtures for scripts/night-run.sh `--detached` (TASK-367, SPRINT-177 T2).
//
// WHY: the pre-flight gate call is synchronous and foreground, so it may only be raised when the CALLER
// declares detachment (ADR-042: the 600s ceiling is a foreground limit). Undeclared, a slow gate must be
// REFUSED BY NAME, never killed mid-pre-flight with no verdict (the reverted SPRINT-105 T3 regression).
// Each case drives the real night-run.sh against a throwaway git repo whose scripts/qa-check.sh is a stub.
import { afterAll, describe, expect, setDefaultTimeout, test } from "bun:test";
import { spawnSync } from "node:child_process";
import { chmodSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const NIGHT_RUN = fileURLToPath(new URL("../scripts/night-run.sh", import.meta.url));
const roots: string[] = [];
afterAll(() => { for (const r of roots) rmSync(r, { recursive: true, force: true }); });

// Stub gate body. It always dumps the QA vars it was handed to $GATE_DUMP-style file `gate-env`.
const DUMP = `printf 'BUDGET=%s CEILING=%s\n' "\${QA_BUDGET_SECONDS-unset}" "\${QA_CEILING_SECONDS-unset}" > gate-env\n`;
const PASS = `${DUMP}echo 'QA-CHECK: 5 pass, 0 fail'\n`;

type Opts = { gate?: string | null; sprintExtra?: string };

function makeRepo(o: Opts = {}): string {
  const dir = mkdtempSync(join(tmpdir(), "nrd-"));
  roots.push(dir);
  const sh = (c: string) => spawnSync("sh", ["-c", c], { cwd: dir, encoding: "utf8" });
  sh("git init -q . && git config user.email t@t && git config user.name t");
  mkdirSync(join(dir, "docs/sprint/logs"), { recursive: true });
  mkdirSync(join(dir, "scripts"), { recursive: true });
  mkdirSync(join(dir, ".claude"), { recursive: true });
  mkdirSync(join(dir, "bin"), { recursive: true });
  writeFileSync(join(dir, ".claude/settings.json"), '{"permissions":{"allow":["Read"]}}\n');
  writeFileSync(join(dir, "docs/sprint/SPRINT-900-x.md"), `---\nstatus: active\n${o.sprintExtra ?? ""}---\n# S\n`);
  writeFileSync(join(dir, "docs/sprint/logs/SPRINT-900-x.md"), "# log\n");
  if (o.gate !== null) writeFileSync(join(dir, "scripts/qa-check.sh"), `#!/bin/sh\n${o.gate ?? PASS}`);
  // stub `claude`: prints its environment so the fired command's env is inspectable from the log.
  writeFileSync(join(dir, "bin/claude"), "#!/bin/sh\nenv\n");
  chmodSync(join(dir, "bin/claude"), 0o755);
  sh("git add -A && git commit -q -m init");
  return dir;
}

function run(dir: string, args: string[], env: Record<string, string> = {}) {
  const r = spawnSync(
    "sh",
    [NIGHT_RUN, "--wait-seconds", "1", "--poll-seconds", "1", "--no-reap", "--log", join(dir, "run.log"),
      "--sprint", join(dir, "docs/sprint/SPRINT-900-x.md"), "--mode", "overnight", ...args,
      "--", "claude", "--permission-mode", "dontAsk"],
    { cwd: dir, encoding: "utf8", env: { ...process.env, PATH: `${join(dir, "bin")}:${process.env["PATH"]}`, ...env } },
  );
  return { code: r.status, out: (r.stdout ?? "") + (r.stderr ?? "") };
}
const read = (dir: string, f: string) => (existsSync(join(dir, f)) ? readFileSync(join(dir, f), "utf8") : "");

const NO_TIMEOUT = { NIGHT_RUN_TIMEOUT_LOOKUP: "/nonexistent/no-such-timeout" };

describe("night-run.sh --detached", () => {
  setDefaultTimeout(60_000);
  test("detached-raises-both", () => {
    const dir = makeRepo();
    const r = run(dir, ["--detached"]);
    expect(r.out).not.toContain("DEAD-ON-ARRIVAL");
    expect(read(dir, "gate-env")).toBe("BUDGET=1800 CEILING=1800\n");
  });

  // must-NOT sibling: no flag, no raise. Fails if the un-raised arm ever sets either variable.
  test("undeclared-does-not-raise", () => {
    const dir = makeRepo();
    const r = run(dir, []);
    expect(r.out).not.toContain("DEAD-ON-ARRIVAL");
    expect(read(dir, "gate-env")).toBe("BUDGET=unset CEILING=unset\n");
  });

  // Fails if the raise is `export`ed instead of inline: the fired command would inherit it.
  test("detached-raise-not-exported", () => {
    const dir = makeRepo();
    const r = run(dir, ["--detached"]);
    expect(r.out).toContain("fired detached");
    let log = "";
    for (let i = 0; i < 40 && !log.includes("PATH="); i++) {
      spawnSync("sleep", ["0.25"]);
      log = read(dir, "run.log");
    }
    expect(log).toContain("PATH=");
    expect(log).not.toContain("QA_BUDGET_SECONDS");
    expect(log).not.toContain("QA_CEILING_SECONDS");
  });

  // Selection-varying: the other arm of `[ -f scripts/qa-check.sh ]`. No gate exists, so none runs,
  // with or without the flag, and the launch proceeds. Fails if --detached dereferenced a missing gate.
  for (const flags of [[], ["--detached"]]) {
    test(`no-qa-check-arm${flags.length ? "-detached" : ""}`, () => {
      const dir = makeRepo({ gate: null });
      const r = run(dir, flags);
      expect(r.out).toContain("fired detached");
      expect(r.out).not.toContain("DEAD-ON-ARRIVAL");
      expect(existsSync(join(dir, "gate-env"))).toBe(false);
    });
  }

  // Undeclared + a gate that outlives the foreground bound: refused by name, not killed.
  // NIGHT_RUN_GATE_BOUND_SECONDS is a test-only override of the derived bound (570 - wait_seconds).
  test("undeclared-bound-exceeded", () => {
    const dir = makeRepo({ gate: "sleep 6\necho 'QA-CHECK: 5 pass, 0 fail'\n" });
    const t0 = Date.now();
    const r = run(dir, [], { NIGHT_RUN_GATE_BOUND_SECONDS: "1" });
    expect(r.code).toBe(1);
    expect(r.out).toContain("DEAD-ON-ARRIVAL: pre-flight-gate-foreground-limit");
    expect(r.out).not.toContain("fired detached");
    expect(Date.now() - t0).toBeLessThan(5500); // refused at the bound, not after the gate finished
  });

  // A gate that truncated itself is an unfinished verdict. A gate_exceptions: grant naming that very
  // FAIL line must still be refused -- the guard sits ahead of the grant logic on BOTH arms.
  const TRUNC = "FAIL  qa-check-budget-exceeded: 530s elapsed exceeds the 520s default-profile budget";
  const grant = (line: string) => `gate_exceptions:\n  - ${line.slice(6)}\ngate_exceptions_pin: abcdef1\n`;
  const truncGate = (line: string) => `${DUMP}echo '${line}'\necho 'QA-CHECK: 214 pass, 1 fail'\nexit 1\n`;

  // MUST-FAIL: fails with its named finding if the truncated-gate guard is removed (the grant would
  // then bless the line and the run would fire).
  test("undeclared-truncated-gate-refuses-by-name", () => {
    const dir = makeRepo({ gate: truncGate(TRUNC), sprintExtra: grant(TRUNC) });
    const r = run(dir, []);
    expect(r.code).toBe(1);
    expect(r.out).toContain("DEAD-ON-ARRIVAL: pre-flight-gate-foreground-limit");
    expect(r.out).not.toContain("fired detached");
  });

  test("detached-truncated-gate-refuses", () => {
    const dir = makeRepo({ gate: truncGate(TRUNC), sprintExtra: grant(TRUNC) });
    const r = run(dir, ["--detached"]);
    expect(r.code).toBe(1);
    expect(r.out).toContain("DEAD-ON-ARRIVAL: pre-flight-gate-incomplete-detached");
    expect(r.out).not.toContain("fired detached");
  });

  // Sibling control: the same grant mechanism still lets a NON-truncation named failure fire, so the
  // two refusals above are the guard's doing and not a broken grant.
  test("granted-ordinary-failure-still-fires", () => {
    const other = "FAIL  some-other-check: known red";
    const dir = makeRepo({ gate: truncGate(other), sprintExtra: grant(other) });
    const r = run(dir, []);
    expect(r.out).toContain("fired detached");
    expect(r.out).not.toContain("DEAD-ON-ARRIVAL");
  });

  // wait_seconds >= the 570s total leaves the gate no foreground time: refused up front, by name.
  test("undeclared-wait-eats-the-bound", () => {
    const dir = makeRepo();
    const r = run(dir, ["--wait-seconds", "570"]);
    expect(r.code).toBe(1);
    expect(r.out).toContain("DEAD-ON-ARRIVAL: pre-flight-gate-foreground-limit");
    expect(existsSync(join(dir, "gate-env"))).toBe(false);
  });

  // Box (c) gaps from Codex R1. A gate exiting 124 (a timeout) is unfinished even with no budget marker.
  test("detached-gate-exit-124-refuses", () => {
    const dir = makeRepo({ gate: `${DUMP}echo 'QA-CHECK: 5 pass, 0 fail'\nexit 124\n` });
    const r = run(dir, ["--detached"]);
    expect(r.code).toBe(1);
    expect(r.out).toContain("DEAD-ON-ARRIVAL: pre-flight-gate-incomplete-detached");
    expect(r.out).not.toContain("fired detached");
  });

  // Sibling control for the 124 guard: a detached gate exiting 0 still fires.
  test("detached-gate-exit-0-still-fires", () => {
    const r = run(makeRepo(), ["--detached"]);
    expect(r.out).toContain("fired detached");
  });

  // The wait limit does not depend on a gate existing: the no-qa-check arm is bounded too.
  test("no-qa-check-arm-wait-eats-the-bound", () => {
    const r = run(makeRepo({ gate: null }), ["--wait-seconds", "570"]);
    expect(r.code).toBe(1);
    expect(r.out).toContain("DEAD-ON-ARRIVAL: pre-flight-gate-foreground-limit");
  });
  test("no-qa-check-arm-detached-ignores-wait-limit", () => {
    const r = run(makeRepo({ gate: null }), ["--detached", "--wait-seconds", "570"]);
    expect(r.out).not.toContain("pre-flight-gate-foreground-limit");
  });

  // No `timeout` (NIGHT_RUN_TIMEOUT_LOOKUP, a test-only override, points at a path that does not exist -- portable, no PATH
  // surgery): an unbounded gate is the original overrun, so refuse by name and never run it.
  test("undeclared-no-timeout-refuses-without-running-gate", () => {
    const dir = makeRepo();
    const r = run(dir, [], NO_TIMEOUT);
    expect(r.code).toBe(1);
    expect(r.out).toContain("DEAD-ON-ARRIVAL: pre-flight-gate-foreground-limit");
    expect(existsSync(join(dir, "gate-env"))).toBe(false);
  });
  test("detached-no-timeout-still-runs", () => {
    const dir = makeRepo();
    const r = run(dir, ["--detached"], NO_TIMEOUT);
    expect(r.out).toContain("fired detached");
    expect(read(dir, "gate-env")).toBe("BUDGET=1800 CEILING=1800\n");
  });

  // The timeout knob decides only whether a timeout command is FOUND. A found wrapper that ignores the duration
  // (`shift; exec "$@"`) must not change execution: the REAL timeout still bounds the gate, so a slow gate is refused.
  test("timeout-knob-cannot-change-execution", () => {
    const dir = makeRepo({ gate: "sleep 6\necho 'QA-CHECK: 5 pass, 0 fail'\n" });
    writeFileSync(join(dir, "bin/unbounded-timeout"), '#!/bin/sh\nshift\nexec "$@"\n');
    chmodSync(join(dir, "bin/unbounded-timeout"), 0o755);
    const t0 = Date.now();
    const r = run(dir, [], { NIGHT_RUN_TIMEOUT_LOOKUP: "unbounded-timeout", NIGHT_RUN_GATE_BOUND_SECONDS: "1" });
    expect(r.code).toBe(1);
    expect(r.out).toContain("DEAD-ON-ARRIVAL: pre-flight-gate-foreground-limit");
    expect(Date.now() - t0).toBeLessThan(5500);
  });
});
