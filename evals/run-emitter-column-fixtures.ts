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
  const r = spawnSync(c.cmd, [...c.args], { cwd: ROOT, encoding: "utf8" });
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

console.log(`emitter-column-fixtures: ${pass} pass, ${fail} fail`);
process.exit(fail > 0 ? 1 : 0);
