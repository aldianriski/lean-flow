// evals/run-authority-differential.ts -- TS-vs-Shell DIFFERENTIAL parity for check-authority
// (TASK-355). OPT-IN, mirroring evals/run-doc-caps-differential.ts's own shape and rationale: this
// is the ONE thing that compares the ported TS checker against the live Shell oracle, which needs a
// real `sh scripts/lib/check-authority.sh` spawn per input. It is NOT wired into qa-check.sh (that
// edit is reported to the coordinator, not applied here, per this task's hard constraints).
//
// SHELL RETAINS AUTHORITY. check-authority.sh is the oracle; check-authority.ts is the migrated
// implementation being checked AGAINST it. Any divergence is a defect in the TS port.
//
// Compares every retained fixture (single-file invocations, as evals/run-authority-fixtures.sh
// itself uses them) AND every real, live docs/sprint/SPRINT-*.md this repo currently has -- both
// individually and as one combined multi-arg invocation, since the CLI takes N sprint files at once
// and the oracle's per-file loop could in principle behave differently under a shared $out file than
// under N separate single-file calls.
//
// Run: bun evals/run-authority-differential.ts
import { execFileSync } from "node:child_process";
import { readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { runCheckAuthority } from "../scripts/lib/check-authority.ts";

const REPO_ROOT = fileURLToPath(new URL("..", import.meta.url));
const SH_CHECKER = `${REPO_ROOT}scripts/lib/check-authority.sh`;
const FX = `${REPO_ROOT}evals/fixtures/authority/`;

function runShell(args: string[]): { code: number; out: string } {
  try {
    const out = execFileSync("sh", [SH_CHECKER, ...args], { encoding: "utf8" });
    return { code: 0, out };
  } catch (e: any) {
    return { code: e.status ?? 1, out: (e.stdout ?? "") + (e.stderr ?? "") };
  }
}

function runTs(args: string[]): { code: number; out: string } {
  const r = runCheckAuthority(args);
  return { code: r.exitCode, out: r.lines.join("\n") + (r.lines.length ? "\n" : "") };
}

function compare(name: string, args: string[]): boolean {
  const sh = runShell(args);
  const ts = runTs(args);
  const shOut = sh.out.replace(/\r\n/g, "\n").trim();
  const tsOut = ts.out.replace(/\r\n/g, "\n").trim();
  if (sh.code === ts.code && shOut === tsOut) {
    console.log(`PASS  parity(${name}): identical exit ${sh.code}, identical stdout`);
    return true;
  }
  console.log(`FAIL  parity(${name}): sh exit=${sh.code} ts exit=${ts.code}`);
  const shLines = shOut.split("\n");
  const tsLines = tsOut.split("\n");
  const max = Math.max(shLines.length, tsLines.length);
  for (let i = 0; i < max; i++) {
    if (shLines[i] !== tsLines[i]) {
      console.log(`      line ${i + 1} differs:`);
      console.log(`        sh: ${shLines[i] ?? "<missing>"}`);
      console.log(`        ts: ${tsLines[i] ?? "<missing>"}`);
    }
  }
  return false;
}

let compared = 0;
let identical = 0;
const divergences: string[] = [];

// Every retained fixture, single-file (as the always-on harness invokes it).
const fixtureDirs = readdirSync(FX, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort();
for (const dir of fixtureDirs) {
  const files = readdirSync(`${FX}${dir}`).filter((f) => f.endsWith(".md"));
  for (const f of files) {
    compared++;
    if (compare(`fixture:${dir}/${f}`, [`${FX}${dir}/${f}`])) identical++;
    else divergences.push(`fixture:${dir}/${f}`);
  }
}

// Every real, live sprint doc this repo currently has -- individually.
const liveSprintDir = `${REPO_ROOT}docs/sprint`;
const liveSprintFiles = readdirSync(liveSprintDir)
  .filter((f) => /^SPRINT-.*\.md$/.test(f))
  .sort()
  .map((f) => `${liveSprintDir}/${f}`);
for (const f of liveSprintFiles) {
  compared++;
  if (compare(`live:${f.slice(REPO_ROOT.length)}`, [f])) identical++;
  else divergences.push(`live:${f}`);
}

// The N-arg combined invocation qa-check.sh actually uses (all active sprint docs in one call).
if (liveSprintFiles.length > 0) {
  compared++;
  if (compare("live:combined-multi-arg", liveSprintFiles)) identical++;
  else divergences.push("live:combined-multi-arg");
}

// Every ARCHIVED sprint doc this repo has -- individually. All of these carry `status: closed` and
// are therefore out of scope by the checker's own scoping rule, but the SKIP path must reproduce
// identically too (a checker that silently degrades to a different skip message on real archived
// input is still a divergence, even though neither side emits a PASS/FAIL verdict for it).
const archiveDir = `${REPO_ROOT}docs/sprint/archive`;
let archiveFiles: string[] = [];
try {
  archiveFiles = readdirSync(archiveDir)
    .filter((f) => /^SPRINT-.*\.md$/.test(f))
    .sort()
    .map((f) => `${archiveDir}/${f}`);
} catch {
  archiveFiles = [];
}
for (const f of archiveFiles) {
  compared++;
  if (compare(`archived:${f.slice(REPO_ROOT.length)}`, [f])) identical++;
  else divergences.push(`archived:${f}`);
}

// Zero-arg invocation.
compared++;
if (compare("zero-args", [])) identical++;
else divergences.push("zero-args");

console.log("----------------------------------------");
console.log(`AUTHORITY DIFFERENTIAL: ${identical}/${compared} identical`);
if (divergences.length > 0) {
  console.log(`DIVERGED: ${divergences.join(", ")}`);
  process.exit(1);
}
process.exit(0);
