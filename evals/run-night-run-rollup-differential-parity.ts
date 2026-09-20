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
import { mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
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

// --- NON-LOG-FILE population (outside-review finding: findLogFiles() walks **/logs/*.md, so a
// directory could never enter the compared set -- 86/86 was true and blind to the one shape that
// actually broke: `existsSync()` returns true for a directory, which fell through to readFileSync()
// and threw an uncaught EISDIR instead of the checker's own named FAIL. Widened here to cover every
// non-regular-file shape the CLI contract can be handed, individually AND in the multi-arg mixtures
// qa-check.sh leg 2g actually produces (a bad entry must never silence a sibling's own finding). ---
let nonMdAdded = 0;

// (1) a directory -- the confirmed defect's exact shape. Reuses a real fixture directory rather than
// inventing a throwaway one (L-166: point the proof at something that actually exists in this repo).
const dirInput = relArg(join(fixtureRoot, "wellformed"));
compare("edge: a directory path", [dirInput]);
nonMdAdded++; // no file extension at all -- counts as non-.md

// (2) an empty-string argument -- distinct from "no arguments" (a zero-length ARGV entry, not a
// zero-length argv). `[ -f "" ]` is false in the shell exactly like a missing path.
compare("edge: an empty-string argument", [""]);
nonMdAdded++; // no extension

// (3) a file that exists, is readable, and is NOT named *.md -- proves the checker (both sides)
// never gates on extension, only on content + [-f]-equivalent regular-file-ness. Real rollup content,
// written to a scratch .txt file under the OS temp dir so it never touches the repo tree.
const scratchDir = mkdtempSync(join(tmpdir(), "nrr-parity-"));
const nonMdFile = join(scratchDir, "rollup-content.txt");
const wellformedLog = fixtureLogs.find((f) => f.includes("wellformed"))!;
const wellformedContent = readFileSync(wellformedLog, "utf8");
writeFileSync(nonMdFile, wellformedContent);
compare("edge: a non-.md file with real rollup content", [relArg(nonMdFile)]);
nonMdAdded++;

// (4) an unreadable file (permission denied) -- KEEPS the .md extension, isolating the "can this be
// read" variable from the "is this named .md" variable already covered by (3). Windows ACL deny via
// icacls (chmod alone does not reliably remove owner read access on NTFS -- verified: chmod 000 left
// the file `-r--r--r--` and still `cat`-readable). Best-effort: if icacls is unavailable or the deny
// does not take, this edge is skipped with a note rather than silently miscounted as compared.
const unreadableFile = join(scratchDir, "unreadable.md");
writeFileSync(unreadableFile, wellformedContent);
let unreadableReady = false;
try {
  execFileSync("icacls", [unreadableFile, "/deny", `${process.env["USERNAME"]}:(R)`], { encoding: "utf8" });
  // Verify the deny actually took (best-effort environments can silently no-op this).
  try {
    readFileSync(unreadableFile, "utf8");
  } catch {
    unreadableReady = true;
  }
} catch {
  unreadableReady = false;
}
if (unreadableReady) {
  compare("edge: an unreadable (permission-denied) .md file", [relArg(unreadableFile)]);
  try {
    execFileSync("icacls", [unreadableFile, "/grant", `${process.env["USERNAME"]}:(R)`], { encoding: "utf8" });
  } catch {
    // best-effort restore before rmSync below
  }
} else {
  console.log("note  edge: an unreadable (permission-denied) .md file -- SKIPPED: could not establish a real permission-denied file on this host (icacls deny did not take)");
}

// --- multi-arg mixtures: the directory in all three positions alongside real good/bad siblings ---
// (the outside review's actual motivating shape: qa-check.sh leg 2g calls this checker with every
// open sprint's log in ONE invocation, so a single bad entry must never destroy its siblings' output).
const goodLog = relArg(wellformedLog);
const badSiblingLog = fixtureLogs.find((f) => f.includes("missing-rollup"));
if (badSiblingLog) {
  compare("multi-arg: good, then directory", [goodLog, dirInput]);
  compare("multi-arg: directory, then good", [dirInput, goodLog]);
  compare("multi-arg: good, directory, bad-sibling (own finding)", [goodLog, dirInput, relArg(badSiblingLog)]);
}

rmSync(scratchDir, { recursive: true, force: true });

console.log("----------------------------------------");
console.log(`non-.md inputs added to the population this run: ${nonMdAdded}`);
console.log(`${identical} of ${compared} inputs identical`);
if (divergences.length > 0) {
  console.log(`DIVERGED: ${divergences.length} -- ${divergences.join(", ")}`);
  console.log("NIGHT-RUN-ROLLUP DIFFERENTIAL PARITY: at least one divergence");
  process.exit(1);
}
console.log("NIGHT-RUN-ROLLUP DIFFERENTIAL PARITY: all identical");
process.exit(0);
