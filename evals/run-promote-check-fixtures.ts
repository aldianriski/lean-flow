// evals/run-promote-check-fixtures.ts -- retained proof for scripts/promote-check.ts (TASK-368, Tier X).
// Run by Bun: `bun evals/run-promote-check-fixtures.ts`.
//
// dirty.md carries BOTH a prose-named file absent from Layers (`fixtures/extra.md`) AND a 486-char
// line: it must be refused with both findings named (not the first only). clean.md must pass.
// Asserts on the findings printed, never the exit code alone (L-120).

import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const CHECK = fileURLToPath(new URL("../scripts/promote-check.ts", import.meta.url));
const FIX = (n: string) => fileURLToPath(new URL(`fixtures/promote-check/${n}`, import.meta.url));

let pass = 0;
let fail = 0;
function check(name: string, ok: boolean, detail: string) {
  if (ok) pass++;
  else fail++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${ok ? "" : ` -- ${detail}`}`);
}
function run(file: string) {
  const r = spawnSync("bun", [CHECK, file], { encoding: "utf8" });
  return { code: r.status, out: (r.stdout ?? "") + (r.stderr ?? "") };
}

const bad = run(FIX("dirty.md"));
check("dirty: exits non-zero", bad.code === 1, `exit ${bad.code}`);
check("dirty: layers-completeness finding named", /FAIL .*Layers completeness: .*implies fixtures\/extra\.md/.test(bad.out), bad.out);
check("dirty: prose-density finding named", /FAIL +prose-density: .*1 line\(s\) over 400 chars.*lines 18\b/.test(bad.out), bad.out);
check("dirty: verdict line counts both", /promote-check: FAIL -- 2 finding\(s\)/.test(bad.out), bad.out);

const ok = run(FIX("clean.md"));
check("clean: exits zero", ok.code === 0, `exit ${ok.code}`);
check("clean: no FAIL lines", !/^FAIL/m.test(ok.out), ok.out);
check("clean: PASS verdict", /promote-check: PASS -- 3 pass, 0 fail/.test(ok.out), ok.out);

const missing = run(FIX("absent.md"));
check("missing file: refused, not a silent pass", missing.code === 1 && /not a file/.test(missing.out), missing.out);

console.log(`promote-check fixtures: ${pass} pass, ${fail} fail`);
process.exit(fail > 0 ? 1 : 0);
