// evals/run-prose-density-fixtures.ts -- retained proof for check-prose-density.ts (EPIC-017
// TASK-364). Run by Bun: `bun evals/run-prose-density-fixtures.ts`
//
// WHY THESE ARE RETAINED. TD-012: deleting the fixtures with the prototype leaves the guard
// unguarded. These stay.
//
// WHAT EACH CASE CARRIES, and why the last one is not redundant:
//
//   grew             must FAIL -- the ratchet arm. Dense count exceeds the recorded baseline.
//   no-baseline-row  must FAIL -- the new-drift arm. Dense with no row at all; this is what stops
//                    a dense file being added quietly.
//   at-baseline      must PASS -- must-NOT-catch control. Adopted drift is reported, not failed;
//                    without this the suite cannot show it discriminates rather than just fires.
//   other-glob-arm   must FAIL -- L-186, the SELECTION test. Its .claude/CLAUDE.md is CLEAN and the
//                    dense line sits in a skills/*/SKILL.md, so this case is reachable ONLY through
//                    the glob arm of proseFiles(). Every other fixture here enters through the
//                    hardcoded ALWAYS_LOADED list. A suite where every fixture shares an incidental
//                    structural property is the cheap tell that the population has no reader --
//                    the detection logic can be perfect while the member set it runs over is not.

import { run } from "../scripts/lib/check-prose-density.ts";

interface Case {
  readonly dir: string;
  readonly expect: "FAIL" | "PASS";
  readonly finding: string; // substring the named finding must contain
  readonly why: string;
}

const CASES: Case[] = [
  { dir: "grew", expect: "FAIL", finding: "grew to 2 dense lines, baseline 1", why: "ratchet arm" },
  { dir: "no-baseline-row", expect: "FAIL", finding: "no baseline row", why: "new-drift arm" },
  { dir: "at-baseline", expect: "PASS", finding: "1 <= 1 dense lines", why: "must-NOT-catch control" },
  { dir: "other-glob-arm", expect: "FAIL", finding: "skills/demo/SKILL.md has 1 line(s) over", why: "SELECTION arm (L-186); asserts arm-specific text, not the bare path, so a FAIL->PASS flip cannot score green" },
  { dir: "fenced-long-line", expect: "PASS", finding: "(0 lines > 400 chars)", why: "must-NOT-catch: a >400-char line inside a fence is verbatim content, not squeezed prose. Removing the fence exclusion must redden this" },
  { dir: "wide-table-row", expect: "PASS", finding: "(0 lines > 400 chars)", why: "must-NOT-catch: a 500+ char table ROW of short CELLS is a real table. Removing the table handling must redden this" },
  { dir: "threshold-boundary", expect: "FAIL", finding: "CLAUDE.md has 1 line(s) over 400", why: "401 is dense and 400 is not -- changing the threshold constant must redden this" },
  { dir: "odd-fence", expect: "FAIL", finding: "ODD number of fence markers", why: "one stray marker silences the rest of the file; that must be named, not silent" },
  { dir: "stale-baseline-row", expect: "FAIL", finding: "not in the examined population", why: "a row that rots after a rename takes its dense lines with it" },
  { dir: "duplicate-baseline-row", expect: "FAIL", finding: "DUPLICATE row", why: "the later row silently wins; adding a row is a quieter diff than editing one" },
];

let pass = 0;
let fail = 0;

for (const c of CASES) {
  const root = `evals/fixtures/prose-density/${c.dir}`;
  const findings = run(root);
  const fails = findings.filter((f) => f.level === "FAIL");
  const got = fails.length > 0 ? "FAIL" : "PASS";

  // The verdict alone is not enough: a case can go red for the WRONG reason (L-142). Require the
  // named finding too, so a break that reddens something unrelated still scores as a failure.
  const relevant = findings.filter((f) => f.text.includes(c.finding));
  const named = relevant.length > 0;

  if (got === c.expect && named) {
    console.log(`PASS  prose-density-fixture: ${c.dir} -> ${got} with named finding (${c.why})`);
    pass++;
  } else {
    console.log(
      `FAIL  prose-density-fixture: ${c.dir} -> expected ${c.expect} with "${c.finding}", got ${got}` +
        (named ? "" : " and the named finding was ABSENT") +
        ` (${c.why})`,
    );
    for (const f of findings) console.log(`        ${f.level} ${f.text}`);
    fail++;
  }
}

console.log(`prose-density-fixtures: ${pass} pass, ${fail} fail`);
process.exit(fail > 0 ? 1 : 0);
