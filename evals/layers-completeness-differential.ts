// evals/layers-completeness-differential.ts -- SPRINT-103: byte-for-byte differential parity between
// scripts/lib/check-layers-completeness.sh (the ORACLE, unchanged) and its TypeScript port
// scripts/lib/check-layers-completeness.ts. Mirrors evals/run-s4-differential-parity.sh's role for
// §4: the TS evaluators moved to the always-on gate leg, and THIS is the thing that still compares
// TS against a LIVE Shell oracle, row by row, exit code AND stdout.
//
// Run standalone: `bun evals/layers-completeness-differential.ts`. Not wired into qa-check.sh --
// it is acceptance evidence for the port (SPRINT-103), kept in the repo so the comparison can be
// re-run whenever either file changes, not a permanent gate leg (that scope decision is the
// coordinator's, not this task's).
//
// Population covered (CLAUDE.md Anti-Patterns (iv) -- vary the SELECTION, not just the verdict):
//   1. every static fixture under evals/fixtures/layers-completeness/*.md, individually
//   2. the exact synthetic fixtures evals/run-layers-completeness-fixtures.sh builds at runtime
//      (substring-declaration-not-declared, the archived/live sibling pair, the case-variant pair),
//      reconstructed here byte-for-byte from that harness's own heredocs
//   3. the bare-invocation case (zero args)
//   4. EVERY real sprint Plan in this repository, docs/sprint/*.md AND docs/sprint/archive/*.md
//      (~103 files as of SPRINT-103), each compared as ONE combined invocation (mirrors qa-check.sh's
//      own `sh check-layers-completeness.sh $(ls docs/sprint/SPRINT-*.md)` call shape -- and keeps
//      this differential's own runtime bounded, since the oracle's cost is dominated by real
//      subprocess forks per task block, not per invocation):
//        (a) at REAL paths -- exercises the archive-path predicate on genuine repository paths, most
//            of which are skipped entirely (archived), proving the SKIP itself matches
//        (b) copied to non-archived temp paths -- forces full block-level evaluation of the real
//            Layers:/Depends-on:/Cites:/DoD content, which is the actual parsing/detection logic
//      On any divergence, the file list is bisected (halved, re-compared, recursed into whichever
//      half still diverges) to name the exact culprit file(s) rather than "somewhere in ~103 files".
import { execFileSync } from "node:child_process";
import { cpSync, mkdtempSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { posix } from "node:path";
import { runLayersCompleteness } from "../scripts/lib/check-layers-completeness.ts";
import {
  buildArchiveSelectionPair,
  buildCaseVariantFixture,
  buildSubstringFixture,
} from "./fixtures/layers-completeness/synthetic.ts";

// This checker's own archive-path predicate (both the shell oracle and the TS port) only recognises
// "/" as a path separator -- exactly like the bash convention every real caller in this repo uses.
// Node's own path helpers are platform-native, so `import.meta.dir`/`tmpdir()` come back backslash-
// joined on Windows; forward-slashing them HERE, once, at the source, means every `posix.join()`
// below (which treats a lone backslash string as one unsplittable segment) composes correctly --
// including "..": `posix.join("C:\\a\\b", "..")` would otherwise silently collapse to "." instead of
// climbing one real directory, because posix.normalize() never sees the backslashes as boundaries.
const toPosix = (p: string): string => p.replace(/\\/g, "/");

const repoRoot = posix.join(toPosix(import.meta.dir), "..");
const shChecker = posix.join(repoRoot, "scripts/lib/check-layers-completeness.sh");

interface Oracle {
  exitCode: number;
  output: string;
}

function runOracle(args: readonly string[]): Oracle {
  try {
    const output = execFileSync("sh", [shChecker, ...args], { cwd: repoRoot, encoding: "utf8" });
    return { exitCode: 0, output };
  } catch (e) {
    const err = e as { status: number | null; stdout?: string; stderr?: string };
    return { exitCode: err.status ?? 1, output: (err.stdout ?? "") + (err.stderr ?? "") };
  }
}

function runPort(args: readonly string[]): Oracle {
  const result = runLayersCompleteness(args);
  const output = result.lines.length > 0 ? result.lines.join("\n") + "\n" : "";
  return { exitCode: result.fail ? 1 : 0, output };
}

let total = 0;
let identical = 0;
const divergences: string[] = [];

function diverges(oracle: Oracle, port: Oracle): boolean {
  return oracle.exitCode !== port.exitCode || oracle.output !== port.output;
}

function reportDivergence(label: string, args: readonly string[], oracle: Oracle, port: Oracle) {
  const detail: string[] = [`DIVERGENCE: ${label}`];
  detail.push(`  args: ${JSON.stringify(args)}`);
  if (oracle.exitCode !== port.exitCode) {
    detail.push(`  exit: oracle=${oracle.exitCode} port=${port.exitCode}`);
  }
  if (oracle.output !== port.output) {
    const oLines = oracle.output.split("\n");
    const pLines = port.output.split("\n");
    const max = Math.max(oLines.length, pLines.length);
    for (let i = 0; i < max; i++) {
      if (oLines[i] !== pLines[i]) {
        detail.push(`  line ${i}: oracle=${JSON.stringify(oLines[i] ?? "<eof>")}`);
        detail.push(`           port=${JSON.stringify(pLines[i] ?? "<eof>")}`);
      }
    }
  }
  divergences.push(detail.join("\n"));
}

function compare(label: string, args: readonly string[]) {
  total++;
  const oracle = runOracle(args);
  const port = runPort(args);
  if (!diverges(oracle, port)) {
    identical++;
    return;
  }
  reportDivergence(label, args, oracle, port);
}

/**
 * Compares a whole file LIST as one combined invocation (fast: the oracle's dominant cost is real
 * subprocess forks per task block, not per invocation, so N files in one call cost roughly the same
 * as N separate calls minus the fixed per-invocation overhead -- but tool-call/process-spawn count
 * drops from N to 1, which is what keeps this differential's own runtime bounded).
 *
 * On a mismatch, bisects the file list to isolate exactly which file(s) reproduce it, rather than
 * reporting only "somewhere in these 100 files" -- each half is re-compared combined, recursing only
 * into halves that still diverge, down to single files. This is exercised only on the FAILURE path;
 * the common case (no divergence) pays for exactly one combined oracle spawn.
 */
function compareBatchWithBisection(label: string, files: readonly string[]) {
  total++;
  const oracle = runOracle(files);
  const port = runPort(files);
  if (!diverges(oracle, port)) {
    identical++;
    return;
  }
  if (files.length <= 1) {
    reportDivergence(label, files, oracle, port);
    return;
  }
  const mid = Math.floor(files.length / 2);
  const left = files.slice(0, mid);
  const right = files.slice(mid);
  compareBatchWithBisection(`${label} [bisect left of ${files.length}]`, left);
  compareBatchWithBisection(`${label} [bisect right of ${files.length}]`, right);
}

// Progress goes to stderr, unbuffered line-by-line, independently of the final stdout summary --
// this run's slow leg (population 4b) spawns the Shell oracle over ~400 real task blocks and takes
// minutes; without incremental progress, a `tail` on a redirected run shows nothing until exit.
const progress = (msg: string) => console.error(`[progress] ${msg}`);

// --- population 1: static fixtures, individually --------------------------------------------------
const fixtureDir = posix.join(repoRoot, "evals/fixtures/layers-completeness");
const fixtureFiles = readdirSync(fixtureDir)
  .filter((f) => f.endsWith(".md"))
  .map((f) => posix.join(fixtureDir, f));
for (const f of fixtureFiles) {
  compare(`static fixture ${f.slice(repoRoot.length + 1)}`, [f]);
}
progress(`population 1 done: ${fixtureFiles.length} static fixtures`);
// dir-token-prefix.md is exercised twice by the harness (two different assertions against the same
// output) -- already covered by running it once here, since the differential compares full output,
// not a single assertion; running it twice would just repeat the identical comparison.

// --- population 3: bare invocation ------------------------------------------------------------
compare("bare invocation", []);
progress("population 3 done: bare invocation");

// --- population 2: synthetic fixtures the harness builds at runtime --------------------------
const work = mkdtempSync(posix.join(tmpdir(), "lc-diff-"));
try {
  const subFx = buildSubstringFixture(work);
  compare("synthetic substring-declaration-not-declared", [subFx]);

  const { archived: archFx, live: liveFx } = buildArchiveSelectionPair(work);
  compare("synthetic archive-path-excluded pair", [archFx, liveFx]);

  const capFx = buildCaseVariantFixture(work);
  compare("synthetic case-variant archive fixture", [capFx]);
  progress("population 2 done: 3 synthetic fixture sets");

  // --- population 4: every real sprint Plan in this repository ---------------------------------
  const sprintDir = posix.join(repoRoot, "docs/sprint");
  const activeFiles = readdirSync(sprintDir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => posix.join(sprintDir, f));
  const archiveDir = posix.join(sprintDir, "archive");
  const archivedFiles = readdirSync(archiveDir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => posix.join(archiveDir, f));
  const allReal = [...activeFiles, ...archivedFiles];
  progress(`population 4 population built: ${allReal.length} real sprint Plan files`);

  // (a) every real Plan at its REAL path, ONE combined invocation (mirrors qa-check.sh's own call
  // shape: `sh check-layers-completeness.sh $(ls docs/sprint/SPRINT-*.md)`). Most of these are
  // archived and skipped entirely -- this proves the SKIP itself matches across the whole real
  // population, bisecting to the exact file(s) on any divergence.
  compareBatchWithBisection("real sprint plans at real paths", allReal);
  progress("population 4a done: real sprint plans at real paths");

  if (process.env.LC_DIFF_SKIP_REAL_COPIES !== "1") {
    // (b) every real Plan's CONTENT, copied to a non-archived temp path so the archive-skip never
    // fires and the full block-level Layers:/Depends-on:/Cites:/DoD detection logic actually runs --
    // this is what exercises the port's parsing against real, not curated, prose. Also ONE combined
    // invocation, bisected on divergence. THE SLOW LEG: ~400 real task blocks, each forcing the
    // Shell oracle's ~40-forks-per-block cost with none of them short-circuited by an archive skip.
    const copyRoot = posix.join(work, "real-copies");
    execFileSync("mkdir", ["-p", copyRoot]);
    const copies = allReal.map((f, i) => {
      const dest = posix.join(copyRoot, `copy-${i}.md`);
      cpSync(f, dest);
      return dest;
    });
    progress(`population 4b starting: ${copies.length} forced non-archived copies (this is the slow leg)`);
    compareBatchWithBisection("real sprint plan content, forced non-archived copies", copies);
    progress("population 4b done: forced non-archived copies");
  } else {
    progress("population 4b SKIPPED (LC_DIFF_SKIP_REAL_COPIES=1)");
  }
} finally {
  rmSync(work, { recursive: true, force: true });
}

console.log(`layers-completeness differential: ${identical}/${total} identical (exit code + stdout)`);
if (divergences.length > 0) {
  console.log(`${divergences.length} DIVERGENCE(S):\n`);
  console.log(divergences.join("\n\n"));
  process.exit(1);
}
console.log("PASS: TS port matches the LIVE Shell oracle byte-for-byte on every input compared.");
process.exit(0);
