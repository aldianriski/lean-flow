// scripts/qa-verdict.ts -- TD-143: makes a verdict-less qa-check.sh run FAIL loudly.
//
// scripts/qa-check.sh prints its verdict as a single line, `QA-CHECK: N pass, M fail` (see its own
// Summary leg). A run that dies mid-flight -- SPRINT-096's system-verify was killed for memory at
// 147 lines, 0 FAIL, no verdict line -- never reaches that line. Read through a shell `&&` or a raw
// exit code, that presents as "0 FAIL so far", which is L-120's shape: the number to act on is the
// one the gate PRINTS, and its absence is not `M=0`.
//
// This wraps any command (in practice, `sh scripts/qa-check.sh`, package.json's real caller) and
// reports its own PASS/FAIL from the presence of that line, never from the child's exit code alone.
// Scoped to the reporting only -- it does not touch the gate's cost (TD-090/TD-117 are out of scope).

import { spawn } from "node:child_process";

export const VERDICT_RE = /^QA-CHECK: (\d+) pass, (\d+) fail$/m;

export interface VerdictOutcome {
  readonly ok: boolean;
  readonly pass?: number;
  readonly fail?: number;
  readonly reason: string;
}

/** Reads the SAME line a human reads. Never trusts the caller's raw exit code (L-120). */
export function judgeOutput(output: string): VerdictOutcome {
  const m = VERDICT_RE.exec(output);
  if (!m) {
    return {
      ok: false,
      reason:
        "qa-verdict: no QA-CHECK line found in output -- the run ended before printing its own " +
        "verdict (TD-143). A verdict-less run is reported as a failure, never inferred as 0 fail.",
    };
  }
  const pass = Number(m[1]);
  const fail = Number(m[2]);
  if (fail > 0) {
    return {
      ok: false,
      pass,
      fail,
      reason: `qa-verdict: QA-CHECK reported ${fail} fail (verdict present -- an ordinary red gate, not verdict-less)`,
    };
  }
  return { ok: true, pass, fail, reason: `qa-verdict: QA-CHECK reported ${pass} pass, 0 fail` };
}

export interface RunOutcome extends VerdictOutcome {
  readonly exitCode: number | null;
  readonly signal: NodeJS.Signals | null;
}

/**
 * Spawns `cmd args…`, forwarding its stdout/stderr live to this process's own (so a human watching
 * `bun run gate` still sees legs stream by, exactly as a bare `sh scripts/qa-check.sh` did) while
 * ALSO capturing stdout to judge afterwards. The child's exit code is reported for visibility only --
 * judgeOutput's read of the printed QA-CHECK line is what decides `ok` (L-120).
 *
 * Judges STDOUT ONLY (qa-check.sh's ok()/bad()/note() all `printf` unredirected, so the verdict line
 * is always stdout). stdout and stderr are two independent OS pipes with no ordering guarantee
 * relative to EACH OTHER; concatenating both into one buffer let a stderr chunk with no trailing
 * newline land next to a stdout write and desync VERDICT_RE's `^` anchor, reporting a real clean pass
 * as verdict-less (found by adversarial review). A single stream's own `data` events stay ordered, so
 * judging stdout alone removes the interleaving risk entirely rather than papering over one repro.
 *
 * A spawn that never starts (bad command, ENOENT, no permission) is reported as a failure rather than
 * left to hang or throw uncaught -- the one thing worse than "reports 0 fail incorrectly" is "reports
 * nothing and never exits" (found by adversarial review; this promise ALWAYS resolves).
 */
export function runAndJudge(cmd: string, args: readonly string[]): Promise<RunOutcome> {
  return new Promise((resolve) => {
    let out = "";
    let child: ReturnType<typeof spawn>;
    try {
      child = spawn(cmd, args, { stdio: ["inherit", "pipe", "pipe"] });
    } catch (e) {
      resolve({
        ok: false,
        exitCode: null,
        signal: null,
        reason: `qa-verdict: failed to start '${cmd}' -- ${(e as Error).message}`,
      });
      return;
    }
    child.on("error", (e: Error) => {
      resolve({
        ok: false,
        exitCode: null,
        signal: null,
        reason: `qa-verdict: failed to start '${cmd}' -- ${e.message}`,
      });
    });
    child.stdout.on("data", (d: Buffer) => {
      out += d.toString();
      process.stdout.write(d);
    });
    child.stderr.on("data", (d: Buffer) => {
      process.stderr.write(d); // forwarded live for visibility only -- never judged (see above)
    });
    child.on("close", (exitCode, signal) => {
      resolve({ ...judgeOutput(out), exitCode, signal });
    });
  });
}

if (import.meta.main) {
  const [cmd, ...args] = process.argv.slice(2);
  if (!cmd) {
    console.error("usage: bun scripts/qa-verdict.ts <cmd> [args...]");
    process.exit(2);
  }
  const result = await runAndJudge(cmd, args);
  if (!result.ok) {
    console.error(result.reason);
  }
  process.exit(result.ok ? 0 : 1);
}
