// evals/run-doc-caps-differential.ts -- TS-vs-Shell DIFFERENTIAL parity for check-doc-caps (TASK-355).
//
// OPT-IN, mirroring evals/run-s4-differential-parity.sh's own shape and rationale: this is the ONE
// thing that compares the ported TS checker against the live Shell oracle row by row, which needs a
// real `sh scripts/lib/check-doc-caps.sh` spawn per input -- exactly the subprocess cost the TS port
// exists to take off the default gate profile. It is NOT wired into qa-check.sh (that edit is
// reported to the coordinator, not applied here, per this task's hard constraints).
//
// SHELL RETAINS AUTHORITY. check-doc-caps.sh is the oracle; check-doc-caps.ts is the migrated
// implementation being checked AGAINST it. Any divergence is a defect in the TS port -- fix the
// port, never "improve" on the shell behaviour (bug-for-bug compatibility is the requirement).
//
// Run: bun evals/run-doc-caps-differential.ts
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { runCheckDocCaps } from "../scripts/lib/check-doc-caps.ts";

const REPO_ROOT = fileURLToPath(new URL("..", import.meta.url));
const SH_CHECKER = `${REPO_ROOT}scripts/lib/check-doc-caps.sh`;
const FX = `${REPO_ROOT}evals/fixtures/doc-caps/`;

interface Case {
  readonly name: string;
  readonly guide: string;
  readonly root: string;
  readonly gf: string;
}

const cases: Case[] = [
  { name: "over-cap", guide: `${FX}over-cap/DOCS_Guide.md`, root: `${FX}over-cap`, gf: `${FX}over-cap/none.txt` },
  { name: "unparseable-row", guide: `${FX}unparseable-row/DOCS_Guide.md`, root: `${FX}unparseable-row`, gf: `${FX}unparseable-row/none.txt` },
  { name: "grandfather-grew", guide: `${FX}grandfather-grew/DOCS_Guide.md`, root: `${FX}grandfather-grew`, gf: `${FX}grandfather-grew/gf.txt` },
  { name: "grandfather-held", guide: `${FX}grandfather-grew/DOCS_Guide.md`, root: `${FX}grandfather-grew`, gf: `${FX}grandfather-grew/gf-held.txt` },
  { name: "soft-cap", guide: `${FX}soft-cap/DOCS_Guide.md`, root: `${FX}soft-cap`, gf: `${FX}soft-cap/none.txt` },
  { name: "soft-cap-hard-breach", guide: `${FX}soft-cap-hard-breach/DOCS_Guide.md`, root: `${FX}soft-cap-hard-breach`, gf: `${FX}soft-cap-hard-breach/none.txt` },
  { name: "soft-cap-grandfathered(soft)", guide: `${FX}soft-cap-grandfathered/DOCS_Guide.md`, root: `${FX}soft-cap-grandfathered`, gf: `${FX}soft-cap-grandfathered/gf-soft.txt` },
  { name: "soft-cap-grandfathered(hard)", guide: `${FX}soft-cap-grandfathered/DOCS_Guide.md`, root: `${FX}soft-cap-grandfathered`, gf: `${FX}soft-cap-grandfathered/gf-hard.txt` },
  { name: "frozen-spent", guide: `${FX}frozen-spent/DOCS_Guide.md`, root: `${FX}frozen-spent`, gf: `${FX}frozen-spent/none.txt` },
  // The live repo's own STANDARD.md over the real docs tree -- the whole cap-covered corpus this
  // checker applies to (research/ADR/sprint/epic/product/architecture/etc.), including any doc
  // presently `status: superseded` in place (behavioral-eval-feasibility.md, loop-hygiene-* -- the
  // FROZEN branch, exercised on real committed content, not only the fixture).
  {
    name: "live-repo",
    guide: `${REPO_ROOT}spec/STANDARD.md`,
    root: REPO_ROOT,
    gf: `${REPO_ROOT}scripts/lib/doc-caps-grandfathered.txt`,
  },
];

function runShell(c: Case): { code: number; out: string } {
  try {
    const out = execFileSync("sh", [SH_CHECKER, c.guide, c.root, c.gf], { encoding: "utf8" });
    return { code: 0, out };
  } catch (e: any) {
    return { code: e.status ?? 1, out: (e.stdout ?? "") + (e.stderr ?? "") };
  }
}

function runTs(c: Case): { code: number; out: string } {
  const r = runCheckDocCaps(c.guide, c.root, c.gf);
  return { code: r.exitCode, out: r.lines.join("\n") + (r.lines.length ? "\n" : "") };
}

let compared = 0;
let identical = 0;
const divergences: string[] = [];

for (const c of cases) {
  compared++;
  const sh = runShell(c);
  const ts = runTs(c);
  const shOut = sh.out.replace(/\r\n/g, "\n");
  const tsOut = ts.out.replace(/\r\n/g, "\n");
  if (sh.code === ts.code && shOut.trim() === tsOut.trim()) {
    identical++;
    console.log(`PASS  parity(${c.name}): identical exit ${sh.code}, identical stdout`);
  } else {
    divergences.push(c.name);
    console.log(`FAIL  parity(${c.name}): sh exit=${sh.code} ts exit=${ts.code}`);
    if (shOut.trim() !== tsOut.trim()) {
      const shLines = shOut.trim().split("\n");
      const tsLines = tsOut.trim().split("\n");
      const max = Math.max(shLines.length, tsLines.length);
      for (let i = 0; i < max; i++) {
        if (shLines[i] !== tsLines[i]) {
          console.log(`      line ${i + 1} differs:`);
          console.log(`        sh: ${shLines[i] ?? "<missing>"}`);
          console.log(`        ts: ${tsLines[i] ?? "<missing>"}`);
        }
      }
    }
  }
}

console.log("----------------------------------------");
console.log(`DOC-CAPS DIFFERENTIAL: ${identical}/${compared} identical`);
if (divergences.length > 0) {
  console.log(`DIVERGED: ${divergences.join(", ")}`);
  process.exit(1);
}
process.exit(0);
