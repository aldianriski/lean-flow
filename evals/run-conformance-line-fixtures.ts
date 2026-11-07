// evals/run-conformance-line-fixtures.ts -- retained proof for the conformance line that
// scripts/qa-check.sh prints directly before every `QA-CHECK:` verdict (SPRINT-165 T2, TASK-615,
// TD-081). Other G (maintainer-only). Run by Bun: `bun evals/run-conformance-line-fixtures.ts`.
//
// HOW. The function is EXTRACTED from the real qa-check.sh between its two sentinel comments and run
// under `sh` on a seeded engine output, never re-typed. `audit(src)` is the one checker: it reports
// `conformance-line-missing` (sentinels, function, or a call before a verdict print is absent) and
// `conformance-line-miscount` (the printed N differs from the seeded rows). Must-FAIL cases feed it
// mutated copies of the file; the unmutated file is the sibling control and must audit clean.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const REPO = fileURLToPath(new URL("../", import.meta.url)).replace(/[/\\]$/, "");
const REAL = readFileSync(`${REPO}/scripts/qa-check.sh`, "utf8").replace(/\r\n/g, "\n");
const BEGIN = "# conformance-line:begin";
const END = "# conformance-line:end";
const VERDICT_RE = /^QA-CHECK: (\d+) pass, (\d+) fail$/m;
const TRUNCATED_RE = /truncat/i;

let pass = 0;
let fail = 0;
function check(name: string, ok: boolean, detail = ""): void {
  if (ok) pass++;
  else fail++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${ok || !detail ? "" : " -- " + detail}`);
}

function extract(src: string): string | null {
  const a = src.indexOf(BEGIN);
  const b = src.indexOf(END);
  return a < 0 || b < a ? null : src.slice(a, b);
}

function render(fn: string, ce_out: string, ce_ran = "1", ce_mode = "full spec -- QA_FULL=1"): string {
  const script = `ce_out=$CE_OUT; ce_ran=$CE_RAN; ce_mode=$CE_MODE\n${fn}\nqb_conformance_line\n`;
  const r = Bun.spawnSync(["sh", "-c", script], {
    env: { ...process.env, CE_OUT: ce_out, CE_RAN: ce_ran, CE_MODE: ce_mode },
    stdout: "pipe",
    stderr: "pipe",
  });
  return r.stdout.toString().replace(/\r\n/g, "\n").trimEnd();
}

const ROWS = (n: number) => Array.from({ length: n }, (_, i) => `FAIL  dod-criterion-names-no-check (S9.VERIFYCLAUSE) row ${i}`);
// Rows the gate counts or reports itself, and rows that are not FAIL: none may enter N.
const NOISE = [
  "PASS  S9.GATESWELLFORMED (x) ok",
  "FAIL  gates-signed: a missing field",
  "FAIL  S13.ATTEST (s) bad trailer",
  "INFO  already-info (S1.X) row",
  "GAP   rule-unimplemented (S2.Y) row",
];
const seed = (n: number) => [...NOISE.slice(0, 2), ...ROWS(n), ...NOISE.slice(2)].join("\n");

// Lines of the verdict prints and the statement directly before each.
function sites(src: string): { at: number; prev: string }[] {
  const lines = src.split("\n");
  const out: { at: number; prev: string }[] = [];
  lines.forEach((l, i) => {
    if (!/^\s*printf 'QA-CHECK:/.test(l)) return;
    let j = i - 1;
    while (j >= 0 && ((lines[j] ?? "").trim() === "" || (lines[j] ?? "").trim().startsWith("#"))) j--;
    out.push({ at: i, prev: lines[j] ?? "" });
  });
  return out;
}

function audit(src: string): string[] {
  const found: string[] = [];
  const fn = extract(src);
  if (!fn || !fn.includes("qb_conformance_line()")) {
    found.push("conformance-line-missing");
    return found;
  }
  const s = sites(src);
  if (s.length !== 2 || s.some((x) => !/\bqb_conformance_line\b/.test(x.prev))) found.push("conformance-line-missing");
  const line = render(fn, seed(4));
  if (!/conformance: 4 informational finding\(s\)/.test(line)) {
    found.push(line === "" ? "conformance-line-missing" : "conformance-line-miscount");
  }
  return found;
}

// ---------- control: the real file ----------
const real = audit(REAL);
check("control: unmutated qa-check.sh audits clean", real.length === 0, real.join(","));
const fnReal = extract(REAL) ?? "";
check("control: seeded rows, N = 4 and noise excluded", /conformance: 4 informational finding\(s\), full spec, not in the tally/.test(render(fnReal, seed(4))), render(fnReal, seed(4)));
check("control: zero rows prints 0, not the not-run line", /conformance: 0 informational finding\(s\), full spec/.test(render(fnReal, NOISE.join("\n"))), render(fnReal, NOISE.join("\n")));
check("control: reduced mode names reduced", /, reduced spec,/.test(render(fnReal, seed(1), "1", "reduced spec (S13 only) -- default")), render(fnReal, seed(1), "1", "reduced spec (S13 only) -- default"));

// ---------- must-FAIL: remove the call at each site ----------
const lines = REAL.split("\n");
sites(REAL).forEach((s, k) => {
  const prevIdx = lines.findIndex((l, i) => i < s.at && l === s.prev && /qb_conformance_line/.test(l) && i >= s.at - 6);
  if (prevIdx < 0) {
    check(`must-FAIL: call removed at site ${k + 1}`, false, "call line not found to remove");
    return;
  }
  const mutated = lines.filter((_, i) => i !== prevIdx).join("\n");
  const f = audit(mutated);
  check(`must-FAIL: call removed at site ${k + 1} -> conformance-line-missing`, f.includes("conformance-line-missing"), f.join(",") || "clean");
});

// ---------- must-FAIL: the function is gone / the line miscounts ----------
const noFn = REAL.replace(BEGIN, "# removed").replace(END, "# removed");
check("must-FAIL: sentinels removed -> conformance-line-missing", audit(noFn).includes("conformance-line-missing"));
const miscount = REAL.replace("gates-signed:|", "");
check("must-FAIL: gates-signed row leaks into N -> conformance-line-miscount", miscount !== REAL && audit(miscount).includes("conformance-line-miscount"), audit(miscount).join(",") || "clean");
const miscount2 = REAL.replace("|S13", "|ZZ13");
check("must-FAIL: S13 rows leak into N -> conformance-line-miscount", miscount2 !== REAL && audit(miscount2).includes("conformance-line-miscount"), audit(miscount2).join(",") || "clean");

// ---------- not-run states print the not-run line, never 0 ----------
const NOT_RUN = "conformance: not run, no informational count";
check("not-run: engine never ran (truncated before the leg / script missing)", render(fnReal, seed(2), "0") === NOT_RUN, render(fnReal, seed(2), "0"));
check("not-run: engine setup failure row", render(fnReal, "FAIL  conformance: repo dir not found\n" + seed(2)) === NOT_RUN);
check("not-run: engine output with no PASS/FAIL row", render(fnReal, "usage: something\nINFO  x") === NOT_RUN);

// ---------- the line is not a verdict and the verdict stays last ----------
const L = render(fnReal, seed(3));
check("line matches neither VERDICT_RE nor TRUNCATED_RE", !VERDICT_RE.test(L) && !TRUNCATED_RE.test(L) && !TRUNCATED_RE.test(NOT_RUN), L);
const tail = REAL.trimEnd().split("\n");
const pv = tail[tail.length - 2] ?? "";
check("verdict print is the last statement but the exit", pv.startsWith("printf 'QA-CHECK: %s pass, %s fail") && pv.includes('"$pass" "$fail"'), tail.slice(-2).join(" | "));

console.log(`\nconformance-line fixtures: ${pass} pass, ${fail} fail`);
process.exit(fail === 0 ? 0 : 1);
