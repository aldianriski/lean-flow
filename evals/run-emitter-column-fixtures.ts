// evals/run-emitter-column-fixtures.ts -- retained proof for SPRINT-104 T2 (TD-157).
// Run by Bun: `bun evals/run-emitter-column-fixtures.ts`
//
// WHAT IS GUARDED. A finding emitted at a ONE-space FAIL column is invisible to a two-space
// column-keyed selector. sweep_findings() keys _fail_findings on '^FAIL  ': an unmatched line is
// missed by _sweep_total and _sweep_reached ALIKE, so they stay equal, the population reconciles,
// and the gate passes clean over a failure nobody saw. It once left sweep_gate returning rc=0 on a
// crashed engine (SPRINT-100 T5). Asserting the COLUMN is therefore not cosmetic -- it is the
// difference between a finding that is counted and one that is silently dropped.
//
// WHY THE CASES VARY THE SELECTION, NOT JUST THE VERDICT (L-186 / L-207). T2's rewrite has three
// distinct emitter ARMS, and a fixture set drawn from only one proves nothing about the others:
//   arm 1  inline printf in a POSIX sh checker          -> count-claims, epic-archive
//   arm 2  inline template literal in a TypeScript one  -> epic-archive.ts (a different language,
//          a different emit construct, reached through a different runner)
//   arm 3  the shared fatal() sourced from harness-common.sh (serves 30 harnesses)
// Each arm below is reached ONLY through its own arm. The cheap tell this rule exists to catch is a
// suite where every case shares an incidental structural property nobody chose -- here, that would
// be "every case is a .sh checker invoked with a bad path".
//
// THE MUST-NOT-CATCH CONTROL IS LOAD-BEARING. check-qa-budget-default.sh was examined and
// DELIBERATELY EXCLUDED: it is an inner checker whose column nothing reads, re-wrapped by
// qa-check.sh:101 through a sed that strips EXACTLY ONE space. Its case below asserts the line is
// STILL one-space. Without it, a suite that simply required two spaces everywhere would pass while
// silently endorsing a change that breaks the wrapper -- and a control that cannot fail is not a
// control (L-142).
import { spawnSync } from "node:child_process";
import { copyFileSync, mkdtempSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { basename, join } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const LF = String.fromCharCode(10);
const CR = String.fromCharCode(13);

interface Case {
  readonly name: string;
  readonly arm: string;
  readonly cmd: string;
  readonly args: readonly string[];
  readonly want: "two-space" | "one-space";
  readonly finding: string;
  readonly why: string;
}

const CASES: readonly Case[] = [
  {
    name: "sh-checker-repo-root",
    arm: "1 (inline printf, POSIX sh)",
    cmd: "sh",
    args: ["scripts/lib/check-count-claims.sh", "/nonexistent/repo"],
    want: "two-space",
    finding: "count-claims: repo root not found",
    why: "rewritten site; a bootstrap failure must reach the column-keyed selector",
  },
  {
    name: "sh-checker-repo-root-sibling",
    arm: "1 (inline printf, POSIX sh)",
    cmd: "sh",
    args: ["scripts/lib/check-epic-archive.sh", "/nonexistent/repo"],
    want: "two-space",
    finding: "epic-archive: repo root not found",
    why: "second file on the same arm -- one file passing does not speak for fourteen",
  },
  {
    name: "ts-checker-repo-root",
    arm: "2 (template literal, TypeScript)",
    cmd: "bun",
    args: ["scripts/lib/check-epic-archive.ts", "/nonexistent/repo"],
    want: "two-space",
    finding: "epic-archive: repo root not found",
    why: "OTHER SELECTION ARM: different language, different emit construct, different runner",
  },
  {
    name: "shared-fatal-missing-doc",
    arm: "3 (shared fatal(), sourced)",
    cmd: "sh",
    args: ["-c", ". ./evals/lib/harness-common.sh; extract_between_anchors /nonexistent/doc.md a b /dev/null"],
    want: "two-space",
    finding: "harness: doc not found",
    why: "OTHER SELECTION ARM: reached through a sourced function, not a script invocation",
  },
  {
    name: "predicate-guard-conformance-engine",
    arm: "1b (inline printf, predicate template, THE MOTIVATING ARTIFACT)",
    cmd: "__isolated__",
    args: ["scripts/lib/conformance-engine.sh"],
    want: "two-space",
    finding: "conformance: shared archive predicate not found",
    why: "L-166: this is the literal file TD-157/SPRINT-100 T5 was filed against -- a guard not pointed at its own motivating case is an absent guard",
  },
  {
    name: "predicate-guard-second-file",
    arm: "1b (inline printf, predicate template)",
    cmd: "__isolated__",
    args: ["scripts/lib/check-verify-reaches.sh"],
    want: "two-space",
    finding: "verify reaches: shared archive predicate not found",
    why: "nine files carry this template and the suite reached none of them before SPRINT-104 T2 review",
  },
  {
    name: "MUST-NOT-CATCH-excluded-inner-checker",
    arm: "control (deliberately excluded)",
    cmd: "sh",
    args: ["scripts/lib/check-qa-budget-default.sh"],
    want: "one-space",
    finding: "qa-budget-default-arg: no qa-check.sh path given",
    why: "inner checker re-wrapped by a sed stripping exactly one space (qa-check.sh:101) -- widening it breaks the wrapper",
  },
];

let pass = 0;
let fail = 0;

for (const c of CASES) {
  // __isolated__ fires a PREDICATE guard without touching the shipped tree: the guard resolves
  // its dependency as $(dirname $0)/archive-path.sh, so copying the checker ALONE into an empty
  // temp dir makes that path absent and the real file executes its real guard. No mocking, no
  // re-implementation, and nothing in scripts/lib/ is moved or modified.
  let r;
  if (c.cmd === "__isolated__") {
    const dir = mkdtempSync(join(tmpdir(), "emitcol-"));
    try {
      const target = c.args[0] ?? "";
      const src = join(ROOT, target);
      const dst = join(dir, basename(target));
      copyFileSync(src, dst);
      r = spawnSync("sh", [dst], { cwd: dir, encoding: "utf8" });
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  } else {
    r = spawnSync(c.cmd, [...c.args], { cwd: ROOT, encoding: "utf8" });
  }
  const text = `${r.stdout ?? ""}${r.stderr ?? ""}`;
  const first = text.split(LF).map((l) => l.split(CR).join("")).find((l) => l.startsWith("FAIL")) ?? "";

  const isTwo = /^FAIL {2}[^ ]/.test(first);
  const isOne = /^FAIL {1}[^ ]/.test(first);
  const got = isTwo ? "two-space" : isOne ? "one-space" : "no-FAIL-line";
  const named = first.includes(c.finding);

  if (got === c.want && named) {
    console.log(`PASS  emitter-column(${c.name}) [arm ${c.arm}] -> ${got} with its named finding`);
    pass++;
  } else {
    console.log(
      `FAIL  emitter-column(${c.name}) [arm ${c.arm}]: expected ${c.want} with "${c.finding}", got ${got}` +
        (named ? "" : " and the named finding was ABSENT") +
        ` -- ${c.why}`,
    );
    console.log(`        first FAIL line: ${first || "(none)"}`);
    fail++;
  }
}

// ---------------------------------------------------------------------------------------------
// POPULATION SCAN -- added at SPRINT-104 T2 outside review.
//
// WHY THE CASES ABOVE WERE NOT ENOUGH, stated plainly because it is the whole lesson. Every case
// above is a LIVE execution, which is the strongest evidence there is -- but live cases are
// samples, and the first version of this suite sampled 2 of the 15 rewritten files, both carrying
// the same message template. The other template -- 'shared archive predicate not found', 9 files,
// including conformance-engine.sh, the literal artifact TD-157 was filed against -- had ZERO
// coverage. An independent reviewer seeded a one-space break there and this suite reported
// 5 pass, 0 fail. Fixtures discriminate a guard's BRANCHES; nothing above discriminated the SET
// those branches run over (L-186), and the guard was not pointed at its own motivating case
// (L-166). Live cases prove the mechanism; this scan proves the POPULATION.

const EXCEPT_FILE = "scripts/lib/check-qa-budget-default.sh";   // inner checker, see its header
const EXCEPT_SUBSTR = "FAIL fixture(";                            // harness report format

function emitsOneSpace(line: string): boolean {
  for (const q of [String.fromCharCode(34), String.fromCharCode(39), String.fromCharCode(96)]) {
    let i = line.indexOf(q + "FAIL ");
    while (i !== -1) {
      const after = line.charAt(i + q.length + 5);
      if (after !== " " && after !== "") return true;
      i = line.indexOf(q + "FAIL ", i + 1);
    }
  }
  return false;
}

const scanDirs = ["scripts/lib", "evals/lib"];
const violations: string[] = [];
let filesScanned = 0;
let emitLines = 0;

for (const d of scanDirs) {
  for (const f of readdirSync(join(ROOT, d))) {
    if (!f.endsWith(".sh") && !f.endsWith(".ts")) continue;
    const rel = d + "/" + f;
    filesScanned++;
    const lines = readFileSync(join(ROOT, rel), "utf8").split(LF);
    lines.forEach((line, idx) => {
      const t = line.trim();
      // Prose ABOUT a FAIL line is not an emission. This corpus documents its own formats -- the
      // fatal() header three files away literally contains the words ONE-space FAIL -- so a scan
      // that reads comments reports the documentation as a defect (L-108, which this scan hit on
      // its first run).
      if (t.startsWith("#") || t.startsWith("//") || t.startsWith("*")) return;
      if (!line.includes("FAIL ")) return;
      emitLines++;
      if (rel === EXCEPT_FILE) return;
      if (line.includes(EXCEPT_SUBSTR)) return;
      if (emitsOneSpace(line)) violations.push(rel + ":" + (idx + 1));
    });
  }
}

// ANTI-VACUITY FLOOR. A scan that examined nothing reports zero violations and exits clean, which
// is indistinguishable from a scan that examined everything (L-058). A broken glob, a renamed
// directory or a changed extension would all present as success without these two floors.
if (filesScanned < 25 || emitLines < 40) {
  console.log(
    `FAIL  emitter-column(POPULATION-vacuity): scanned only ${filesScanned} file(s) / ${emitLines} ` +
      `emission line(s) -- below the floor (25/40). A scan that reaches nothing reports no ` +
      `violations and looks identical to a clean one`,
  );
  fail++;
} else if (violations.length > 0) {
  console.log(
    `FAIL  emitter-column(POPULATION): ${violations.length} site(s) still emit at a ONE-space FAIL ` +
      `column and are not in the documented exception set: ${violations.join(", ")}`,
  );
  fail++;
} else {
  console.log(
    `PASS  emitter-column(POPULATION): ${filesScanned} file(s), ${emitLines} emission line(s), 0 ` +
      `undocumented one-space site(s)`,
  );
  pass++;
}
console.log(`emitter-column-fixtures: ${pass} pass, ${fail} fail`);
process.exit(fail > 0 ? 1 : 0);
