import { describe, expect, test } from "bun:test";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { judgeOutput, runAndJudge } from "../scripts/qa-verdict.ts";

const QA_VERDICT_TS = fileURLToPath(new URL("../scripts/qa-verdict.ts", import.meta.url));

/** Runs the real CLI as its own process (not the imported functions) and reports exit code + stderr. */
function runCli(args: readonly string[]): { readonly code: number; readonly stdout: string; readonly stderr: string } {
  try {
    const stdout = execFileSync("bun", [QA_VERDICT_TS, ...args], { encoding: "utf8" });
    return { code: 0, stdout, stderr: "" };
  } catch (e) {
    const err = e as { status?: number; stdout?: string; stderr?: string };
    return { code: err.status ?? 1, stdout: err.stdout ?? "", stderr: err.stderr ?? "" };
  }
}

// TD-143: a qa-check.sh run that dies mid-flight (memory kill, external timeout, anything else that
// ends the process before its own Summary leg) currently presents to whatever reads it as "0 FAIL so
// far" -- indistinguishable from a clean partial. `judgeOutput` is the verdict-presence check: it
// reads the SAME line a human reads (`QA-CHECK: N pass, M fail`), never the child's raw exit code
// (L-120 -- exit code is evidence about the reporter, not the artifact).

describe("judgeOutput -- verdict-presence check (TD-143)", () => {
  // Must-FAIL: SPRINT-096's own shape -- the budget guard's PASS line printed, then nothing else.
  test("output with no QA-CHECK line is reported as a failure, named as verdict-less", () => {
    const partial = "PASS  qa-budget-default: 520s < 600s command ceiling (scripts/qa-check.sh)\n";
    const outcome = judgeOutput(partial);
    expect(outcome.ok).toBe(false);
    expect(outcome.reason).toMatch(/no.*QA-CHECK/i);
  });

  // Sibling control: a run that DOES print its verdict, and reports 0 fail, must stay green. This is
  // the case the wrapper must never break -- the whole point is to add a failure mode, not to make
  // every run fail.
  test("output ending with a clean QA-CHECK line is reported as ok, with pass/fail parsed", () => {
    const complete = "PASS  cap docs/QA.md (40 <= 320)\n\n----------------------------------------\nQA-CHECK: 214 pass, 0 fail\n";
    const outcome = judgeOutput(complete);
    expect(outcome.ok).toBe(true);
    expect(outcome.pass).toBe(214);
    expect(outcome.fail).toBe(0);
  });

  // Must-FAIL, distinct reason: the verdict line IS present but names real fails -- this is an
  // ordinary red gate, not a verdict-less one, and the wrapper must not conflate the two failure
  // modes under one message (each FAIL keeps its own named finding).
  test("output with a QA-CHECK line reporting fail>0 is reported as a failure, distinct from verdict-less", () => {
    const redGate = "FAIL  cap docs/QA.md (400 > 320)\n\n----------------------------------------\nQA-CHECK: 213 pass, 1 fail\n";
    const outcome = judgeOutput(redGate);
    expect(outcome.ok).toBe(false);
    expect(outcome.fail).toBe(1);
    expect(outcome.reason).not.toMatch(/no QA-CHECK line found/i);
  });
});

// runAndJudge spawns the REAL command and judges its REAL captured output -- never the child's own
// exit code alone (L-120: `gate | tail && commit` reads tail's status; the number to read is the one
// the gate prints). These exercise a real child process, not a canned string.
describe("runAndJudge -- spawns a real command and reads its printed verdict, not its exit code", () => {
  test("a command that exits 0 but never prints QA-CHECK is still reported as a failure", async () => {
    const result = await runAndJudge("sh", ["-c", "printf 'PASS  something\\n'; exit 0"]);
    expect(result.exitCode).toBe(0); // the child itself reported success --
    expect(result.ok).toBe(false); //   the wrapper must not trust that alone
    expect(result.reason).toMatch(/no.*QA-CHECK/i);
  });

  // Sibling control in the SAME suite: a command that exits 0 and does print QA-CHECK stays green.
  test("a command that prints a clean QA-CHECK line is reported as ok", async () => {
    const result = await runAndJudge("sh", ["-c", "printf 'QA-CHECK: 9 pass, 0 fail\\n'; exit 0"]);
    expect(result.exitCode).toBe(0);
    expect(result.ok).toBe(true);
    expect(result.pass).toBe(9);
  });

  // Real kill mid-flight (DoD line 3, L-166/L-007): an external `timeout` sends the child a real
  // signal partway through, exactly SPRINT-096's shape (a live process ended before its own
  // Summary leg). Not a canned string -- a real subprocess that is genuinely killed.
  test("a command genuinely killed mid-flight (real `timeout`, real signal) is reported as a failure", async () => {
    const result = await runAndJudge("timeout", ["1", "sh", "-c", "printf 'PASS  qa-budget-default: ok\\n'; sleep 5; printf 'QA-CHECK: 1 pass, 0 fail\\n'"]);
    expect(result.ok).toBe(false);
    expect(result.reason).toMatch(/no.*QA-CHECK/i);
    expect(result.exitCode).not.toBe(0); // timeout's own kill exit code (124) -- confirmed, never relied upon
  });
});

// L-186: fixtures above only ever call the LIBRARY functions in-process. Population also includes
// the CLI process package.json's `gate` and `test` scripts actually invoke -- a different selection
// (argv parsing, `import.meta.main`, process.exit) that the library-level tests above never reach.
describe("CLI process -- the invocation surface package.json's gate/test scripts actually run", () => {
  test("CLI exits 1 and names the reason on stderr for a verdict-less wrapped command", () => {
    const result = runCli(["sh", "-c", "printf 'PASS  x\\n'; exit 0"]);
    expect(result.code).toBe(1);
    expect(result.stderr).toMatch(/no.*QA-CHECK/i);
  });

  // Sibling control, same invocation surface: CLI exits 0 for a wrapped command that does print
  // a clean verdict -- the `gate`/`test` scripts must not stop treating a real pass as a pass.
  test("CLI exits 0 for a wrapped command that prints a clean QA-CHECK line", () => {
    const result = runCli(["sh", "-c", "printf 'QA-CHECK: 4 pass, 0 fail\\n'; exit 0"]);
    expect(result.code).toBe(0);
    expect(result.stderr).toBe("");
  });

  // Varies SELECTION again: package.json's `test` script is a two-stage `gate && bun test` chain
  // (the exact L-120 shape -- a status read through a shell operator). Reusing the CLI's own exit
  // code as the LEFT side of that operator must stop the chain before the second stage runs, for a
  // verdict-less first stage exactly as it already must for an ordinary red gate.
  test("wired into a `&& next-step` chain (test script's shape), a verdict-less first stage stops the chain", () => {
    const shellChain = `bun "${QA_VERDICT_TS}" sh -c "printf 'PASS x\\n'; exit 0" && echo SHOULD_NOT_RUN`;
    let chain: { code: number; out: string };
    try {
      chain = { code: 0, out: execFileSync("sh", ["-c", shellChain], { encoding: "utf8" }) };
    } catch (e) {
      const err = e as { status?: number; stdout?: string };
      chain = { code: err.status ?? 1, out: err.stdout ?? "" };
    }
    expect(chain.code).not.toBe(0);
    expect(chain.out).not.toMatch(/SHOULD_NOT_RUN/);
  });

  // Sibling control for the chain shape: a clean verdict DOES let the chain proceed to its next stage.
  test("wired into the same chain shape, a clean verdict lets the chain proceed", () => {
    const shellChain = `bun "${QA_VERDICT_TS}" sh -c "printf 'QA-CHECK: 1 pass, 0 fail\\n'; exit 0" && echo CHAIN_CONTINUED`;
    const out = execFileSync("sh", ["-c", shellChain], { encoding: "utf8" });
    expect(out).toMatch(/CHAIN_CONTINUED/);
  });
});

// Adversarial review findings (worktree-isolated, dispatched against commit 3404422): a spawn
// failure must resolve loudly rather than hang forever -- the ONE thing worse than "reports 0 fail
// incorrectly" is "reports nothing and never exits", which is TD-143's own failure shape turned back
// on the wrapper itself.
describe("runAndJudge -- a command that never even starts must still resolve, not hang", () => {
  test("a nonexistent binary resolves (does not hang) and is reported as a failure", async () => {
    const result = await runAndJudge("totally-nonexistent-binary-xyz-qa-verdict-test", ["arg1"]);
    expect(result.ok).toBe(false);
    expect(result.reason).toMatch(/spawn|ENOENT|failed to start/i);
  }, 5000);
});

// Adversarial review finding: stdout and stderr are two independent OS pipes with NO ordering
// guarantee relative to each other. Concatenating both into one buffer for judging means a stderr
// chunk that lands between two stdout writes -- with no trailing newline -- can desync VERDICT_RE's
// `^` anchor and report a real, clean pass as verdict-less. The verdict line is always printed to
// STDOUT (qa-check.sh's ok()/bad()/note() all `printf` unredirected); judging must never depend on
// stderr's arrival order relative to stdout.
describe("runAndJudge -- stderr interleaving must never corrupt the judged verdict", () => {
  test("stderr noise with no trailing newline, arriving right before a clean stdout verdict, still judges ok", async () => {
    const result = await runAndJudge("sh", [
      "-c",
      "printf 'noise-no-newline' 1>&2; printf 'QA-CHECK: 1 pass, 0 fail\\n'",
    ]);
    expect(result.ok).toBe(true);
    expect(result.pass).toBe(1);
  });
});
