// evals/epic-archive-differential.test.ts -- TS-vs-Shell DIFFERENTIAL parity for
// scripts/lib/check-epic-archive.ts against its live oracle, scripts/lib/check-epic-archive.sh
// (TASK-355). Follows the shape of evals/run-s4-differential-parity.sh: the shell checker REMAINS
// the authority; this file asserts the TS port agrees with it EXACTLY (same exit code, same stdout)
// over every retained fixture root AND over this repository's own real docs/epic/ tree.
//
// Written in TypeScript (bun:test), not a new .sh file -- CLAUDE.md's "no new .sh files" rule
// (executable logic is TypeScript run by Bun). Run standalone: `bun test evals/epic-archive-differential.test.ts`.
// Not wired into qa-check.sh's always-on set, mirroring run-s4-differential-parity.sh's own
// opt-in status: this is acceptance evidence for the port, not a per-gate-run cost.
import { describe, expect, test } from "bun:test";
import { execFileSync } from "node:child_process";
import { readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { checkEpicArchive } from "../scripts/lib/check-epic-archive.ts";

const EVALS_DIR = fileURLToPath(new URL(".", import.meta.url)).replace(/[\\/]$/, "");
const REPO_ROOT = fileURLToPath(new URL("..", import.meta.url)).replace(/[\\/]$/, "");
const SH_CHECKER = `${REPO_ROOT}/scripts/lib/check-epic-archive.sh`;

function subdirs(dir: string): string[] {
  let names: string[];
  try {
    names = readdirSync(dir);
  } catch {
    return [];
  }
  return names.filter((n) => statSync(`${dir}/${n}`).isDirectory()).map((n) => `${dir}/${n}`);
}

// Every retained fixture root the shell harness (evals/run-epic-archive-fixtures.sh) already
// exercises, discovered by directory listing rather than hand-copied -- so a fixture added to either
// directory automatically joins the differential population too (CLAUDE.md L-186: enumerate the
// population, don't hand-pick a subset that happens to agree).
const fixtureRoots = [
  ...subdirs(`${EVALS_DIR}/fixtures/epic-archive`),
  ...subdirs(`${EVALS_DIR}/fixtures/epic-state`),
];

// The real corpus: this repository's own docs/epic/ tree, INCLUDING docs/epic/archive/ -- the
// motivating requirement (brief part 2: "every real epic in this repo this checker applies to").
// A single root suffices because both directions (a)/(b)/(c) are driven from the SAME root arg.
const realRoots = [REPO_ROOT];

const allRoots = [...fixtureRoots, ...realRoots];

function runShell(root: string): { code: number; out: string } {
  try {
    const out = execFileSync("sh", [SH_CHECKER, root], { encoding: "utf8" });
    return { code: 0, out };
  } catch (e) {
    const err = e as { status: number | null; stdout: string };
    return { code: err.status ?? 1, out: err.stdout ?? "" };
  }
}

function runTs(root: string): { code: number; out: string } {
  const { lines, exitCode } = checkEpicArchive(root);
  return { code: exitCode, out: lines.length > 0 ? lines.join("\n") + "\n" : "" };
}

describe("check-epic-archive.ts matches check-epic-archive.sh (differential parity)", () => {
  test(`population is non-empty (guards against a silent zero-input pass)`, () => {
    expect(allRoots.length).toBeGreaterThan(0);
  });

  for (const root of allRoots) {
    // 30s: the real-repo root's shell leg alone runs ~20 subprocess-heavy checker passes (one per
    // epic) at the ~2-3s/invocation cost this port exists to remove -- comfortably over bun:test's
    // 5s default.
    test(
      `identical exit code + stdout: ${root}`,
      () => {
        const sh = runShell(root);
        const ts = runTs(root);
        expect(ts.code).toBe(sh.code);
        expect(ts.out).toBe(sh.out);
      },
      30000,
    );
  }
});
