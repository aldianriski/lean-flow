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
// STATED HONESTLY (outside-review correction, TASK-355 revise): every archived sprint doc carries
// `status: closed`, which returns from `evaluateSprintFile` on the closed-status check BEFORE
// parsing any `### Tn` block, before the mode signal, before any J2 logic -- real input, but a
// confirmed-trivial two-line early-return path. The zero-arg case is trivial the same way. Neither
// is a SECOND independent proof that DECLARED/HONOURED/BYPASSED agree -- only the fixtures are. The
// summary below reports the two populations SEPARATELY rather than one combined "N/N" headline, so
// the real-logic count can never be read as inflated by the trivial-path count.
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

// Two SEPARATE tallies -- never combined into one headline number (outside-review correction).
let realCompared = 0;
let realIdentical = 0;
let trivialCompared = 0;
let trivialIdentical = 0;
const divergences: string[] = [];

// Every retained fixture, single-file (as the always-on harness invokes it) -- REAL-LOGIC weight:
// each one exercises DECLARED, and most exercise HONOURED/BYPASSED too.
const fixtureDirs = readdirSync(FX, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort();
for (const dir of fixtureDirs) {
  const files = readdirSync(`${FX}${dir}`).filter((f) => f.endsWith(".md"));
  for (const f of files) {
    realCompared++;
    if (compare(`fixture:${dir}/${f}`, [`${FX}${dir}/${f}`])) realIdentical++;
    else divergences.push(`fixture:${dir}/${f}`);
  }
}

// Every real, live sprint doc this repo currently has -- individually. REAL-LOGIC weight only if
// it is NOT closed (an active sprint exercises the same logic the fixtures do); this repo has none
// active at the moment this ran, so this loop is 0 iterations today, honestly reported as such.
const liveSprintDir = `${REPO_ROOT}docs/sprint`;
const liveSprintFiles = readdirSync(liveSprintDir)
  .filter((f) => /^SPRINT-.*\.md$/.test(f))
  .sort()
  .map((f) => `${liveSprintDir}/${f}`);
for (const f of liveSprintFiles) {
  realCompared++;
  if (compare(`live:${f.slice(REPO_ROOT.length)}`, [f])) realIdentical++;
  else divergences.push(`live:${f}`);
}

// The N-arg combined invocation qa-check.sh actually uses (all active sprint docs in one call).
if (liveSprintFiles.length > 0) {
  realCompared++;
  if (compare("live:combined-multi-arg", liveSprintFiles)) realIdentical++;
  else divergences.push("live:combined-multi-arg");
}

// Every ARCHIVED sprint doc this repo has -- individually. TRIVIAL-PATH weight: every one carries
// `status: closed` and returns from `evaluateSprintFile` on the closed-status check BEFORE parsing
// any `### Tn` block, before the mode signal, before any J2 logic -- a confirmed two-line
// early-return, not a second proof of the branches. Still worth running: a checker that silently
// degrades to a DIFFERENT skip message on real archived input is still a divergence, even though
// neither side emits a PASS/FAIL verdict for it -- but it does not add to the real-logic count.
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
  trivialCompared++;
  if (compare(`archived:${f.slice(REPO_ROOT.length)}`, [f])) trivialIdentical++;
  else divergences.push(`archived:${f}`);
}

// Zero-arg invocation -- TRIVIAL-PATH weight (the "no sprint files given" one-liner).
trivialCompared++;
if (compare("zero-args", [])) trivialIdentical++;
else divergences.push("zero-args");

console.log("----------------------------------------");
console.log(`AUTHORITY DIFFERENTIAL, REAL-LOGIC inputs (fixtures + any active sprint): ${realIdentical}/${realCompared} identical`);
console.log(`AUTHORITY DIFFERENTIAL, CONFIRMED-TRIVIAL-PATH inputs (archived sprints + zero-args): ${trivialIdentical}/${trivialCompared} identical`);
console.log(`Combined, for reference only -- NOT the headline: ${realIdentical + trivialIdentical}/${realCompared + trivialCompared}`);
if (divergences.length > 0) {
  console.log(`DIVERGED: ${divergences.join(", ")}`);
  process.exit(1);
}
process.exit(0);
