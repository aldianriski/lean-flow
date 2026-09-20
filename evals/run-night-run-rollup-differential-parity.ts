// evals/run-night-run-rollup-differential-parity.ts -- differential parity harness for TASK-355's
// port of scripts/lib/check-night-run-rollup.sh to scripts/lib/check-night-run-rollup.ts.
//
// SHELL REMAINS THE ORACLE. This harness does not judge either engine's behaviour against a spec --
// it asserts the TS port produces IDENTICAL stdout and IDENTICAL exit code to the live shell script,
// for every input either engine will ever actually see. A divergence found here is a DEFECT IN THE
// PORT (fix check-night-run-rollup.ts, never "improve" on the shell behaviour) -- mirrors
// evals/run-s4-differential-parity.sh's own framing, which this harness follows as its shipped
// convention (per this task's brief: "copy the shipped exemplar rather than inventing a pattern").
//
// POPULATION (CLAUDE.md Anti-Patterns (iv) -- fixtures discriminate branches, nothing above
// discriminates the SET an oracle runs over, so the set itself needs its own proof):
//   (a) every fixture log this checker's own harness carries, under evals/fixtures/night-run-rollup/
//       **/logs/*.md (the qa-leg2g fixtures also carry a Plan-only docs/sprint/*.md sibling that is
//       NOT under logs/ and is never itself an input to this checker -- excluded on purpose, not by
//       oversight: the checker's own CLI contract only ever takes Execution Log paths).
//   (b) every REAL committed Execution Log in this repository, archived included:
//       docs/sprint/archive/logs/*.md, plus docs/sprint/logs/*.md if a live sprint's log exists at
//       run time (none did when this harness was written -- SPRINT-102 closed and archived --
//       so the walk is written to find zero-or-more, never hardcoded to "none").
// Each file is compared BOTH individually (isolates exactly which input diverges) and as ONE combined
// multi-argument invocation per population group (the actual shape qa-check.sh leg 2g calls the
// checker in -- one process, every open-sprint log as separate argv entries -- which exercises
// multi-file loop state, e.g. the shared `fail` accumulator, that a per-file call never would).
//
// Opt-in, not part of the default gate: NOT wired into evals/run-night-run-rollup-fixtures.sh or
// qa-check.sh. Run directly: `bun evals/run-night-run-rollup-differential-parity.ts`. The whole point
// is real subprocess-per-input cost on the shell side -- ~2.75s per shell spawn on this host, ~90
// inputs -- so this is deliberately NOT cheap, the same tradeoff run-s4-differential-parity.sh makes.

import { execFileSync } from "node:child_process";
import { readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = fileURLToPath(new URL("../", import.meta.url)).replace(/[/\\]$/, "");
const SHELL_CHECKER = join(REPO_ROOT, "scripts", "lib", "check-night-run-rollup.sh");
const TS_CHECKER = join(REPO_ROOT, "scripts", "lib", "check-night-run-rollup.ts");

function toPosix(p: string): string {
  return p.split(sep).join("/");
}

function walk(dir: string, out: string[]): void {
  let entries: string[];
  try {
    entries = readdirSync(dir);
  } catch {
    return;
  }
  for (const e of entries) {
    const full = join(dir, e);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, out);
    else if (st.isFile() && e.endsWith(".md")) out.push(full);
  }
}

function findLogFiles(dir: string): string[] {
  const all: string[] = [];
  walk(dir, all);
  // Only paths with a "/logs/" path segment are ever legitimate checker inputs -- excludes the
  // qa-leg2g fixtures' Plan-only docs/sprint/*.md siblings, which sit next to (not inside) a logs/
  // directory in the same fixture tree.
  return all.filter((p) => toPosix(relative(REPO_ROOT, p)).includes("/logs/")).sort();
}

interface RunResult {
  readonly code: number;
  readonly stdout: string;
}

function run(cmd: string, args: readonly string[]): RunResult {
  try {
    const out = execFileSync(cmd, args as string[], { cwd: REPO_ROOT, encoding: "utf8" });
    return { code: 0, stdout: out };
  } catch (e) {
    const err = e as { status?: number | null; stdout?: string; stderr?: string };
    return { code: err.status ?? 1, stdout: (err.stdout ?? "") + (err.stderr ?? "") };
  }
}

function runShell(args: readonly string[]): RunResult {
  return run("sh", [SHELL_CHECKER, ...args]);
}
function runTs(args: readonly string[]): RunResult {
  return run("bun", [TS_CHECKER, ...args]);
}

function relArg(p: string): string {
  return toPosix(relative(REPO_ROOT, p));
}

let compared = 0;
let identical = 0;
const divergences: string[] = [];

function compare(label: string, args: readonly string[]): void {
  compared++;
  const sh = runShell(args);
  const ts = runTs(args);
  if (sh.code === ts.code && sh.stdout === ts.stdout) {
    identical++;
    console.log(`PASS  ${label}: identical (exit ${sh.code})`);
    return;
  }
  console.log(`FAIL  ${label}: DIVERGED`);
  console.log(`      shell exit=${sh.code}`);
  console.log(`      ts    exit=${ts.code}`);
  if (sh.stdout !== ts.stdout) {
    console.log("      --- shell stdout ---");
    console.log(sh.stdout.split("\n").map((l) => `      ${l}`).join("\n"));
    console.log("      --- ts stdout ---");
    console.log(ts.stdout.split("\n").map((l) => `      ${l}`).join("\n"));
  }
  divergences.push(label);
}

const fixtureRoot = join(REPO_ROOT, "evals", "fixtures", "night-run-rollup");
const archiveLogRoot = join(REPO_ROOT, "docs", "sprint", "archive", "logs");
const liveLogRoot = join(REPO_ROOT, "docs", "sprint", "logs");

const fixtureLogs = findLogFiles(fixtureRoot);
const archiveLogs = findLogFiles(archiveLogRoot);
const liveLogs = findLogFiles(liveLogRoot);

console.log(`night-run-rollup differential parity: ${fixtureLogs.length} fixture logs, ${archiveLogs.length} archived logs, ${liveLogs.length} live logs`);
console.log("----------------------------------------");

for (const f of fixtureLogs) compare(`fixture ${relArg(f)}`, [relArg(f)]);
for (const f of archiveLogs) compare(`archive ${relArg(f)}`, [relArg(f)]);
for (const f of liveLogs) compare(`live ${relArg(f)}`, [relArg(f)]);

// Multi-arg invocations -- the actual shape qa-check.sh leg 2g calls the checker in (every open
// sprint's log as a separate argv entry, one process, one shared `fail` accumulator).
if (fixtureLogs.length > 0) {
  compare("combined: every fixture log in one invocation", fixtureLogs.map(relArg));
}
if (archiveLogs.length > 0) {
  compare("combined: every archived log in one invocation", archiveLogs.map(relArg));
}
if (liveLogs.length > 0) {
  compare("combined: every live log in one invocation", liveLogs.map(relArg));
}
// No-args and missing-file edge cases -- part of the CLI contract, cheap to include.
compare("no arguments", []);
compare("nonexistent path", ["docs/sprint/logs/SPRINT-000-does-not-exist.md"]);

console.log("----------------------------------------");
console.log(`${identical} of ${compared} inputs identical`);
if (divergences.length > 0) {
  console.log(`DIVERGED: ${divergences.length} -- ${divergences.join(", ")}`);
  console.log("NIGHT-RUN-ROLLUP DIFFERENTIAL PARITY: at least one divergence");
  process.exit(1);
}
console.log("NIGHT-RUN-ROLLUP DIFFERENTIAL PARITY: all identical");
process.exit(0);
