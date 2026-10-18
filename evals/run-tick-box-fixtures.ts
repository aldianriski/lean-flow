// evals/run-tick-box-fixtures.ts -- retained proof for scripts/lib/tick-box.ts (TASK-438, Tier G, ADR-050 "Other G").
// Run by Bun: `bun evals/run-tick-box-fixtures.ts`.
//
// Each case builds a throwaway repo (git, because the freeze checker needs plan_commit). The member's Layers
// declare `a.md` only. must-FAIL: evidence naming `b.md` -> non-zero AND `member-layers-incomplete`.
// Sibling control: path-free evidence -> exit 0. Also: already-ticked -> exit 2, no write; CRLF stays CRLF.
// Asserts on the output text, not the exit code alone (L-120).

import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const TICK = fileURLToPath(new URL("../scripts/lib/tick-box.ts", import.meta.url));

let pass = 0;
let fail = 0;
function check(name: string, ok: boolean, detail: string) {
  if (ok) pass++;
  else fail++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${ok ? "" : ` -- ${detail}`}`);
}
function git(cwd: string, ...a: string[]) {
  const r = spawnSync("git", ["-c", "user.name=t", "-c", "user.email=t@t", ...a], { cwd, encoding: "utf8" });
  if (r.status !== 0) throw new Error(`git ${a.join(" ")}: ${r.stderr}`);
  return r.stdout.trim();
}

const MEMBER = `---
id: TASK-901
sprint: __STAMP__
title: "fixture"
---

# TASK-901

## Done when

- [ ] first box
      continued line
- [ ] second box

## Touches

- a.md
`;
const SPRINT = (pc: string) => `---
sprint: 901
slug: fixture
status: active
plan_commit: ${pc}
---

# SPRINT-901

## Members

- docs/work/in_progress/TASK-901-fixture.md

## Plan

### T1 -- Fixture \`[size: S]\`
Layers: \`a.md\` · \`docs/work/in_progress/TASK-901-fixture.md\`
Depends-on: none
Cites: \`TASK-901\`

Body.

**Acceptance:** done.

## Execution Log
`;

function fixture(crlf = false, stamp = "SPRINT-901") {
  const dir = mkdtempSync(join(tmpdir(), "tick-box-"));
  mkdirSync(join(dir, "docs/work/in_progress"), { recursive: true });
  mkdirSync(join(dir, "docs/sprint"), { recursive: true });
  const conv = (s: string) => (crlf ? s.replace(/\n/g, "\r\n") : s);
  writeFileSync(join(dir, "docs/work/in_progress/TASK-901-fixture.md"), conv(MEMBER.replace("__STAMP__", stamp)));
  writeFileSync(join(dir, "docs/sprint/SPRINT-901-fixture.md"), SPRINT("0000000"));
  git(dir, "init", "-q");
  git(dir, "add", "-A");
  git(dir, "commit", "-q", "-m", "plan");
  const pc = git(dir, "rev-parse", "--short", "HEAD");
  writeFileSync(join(dir, "docs/sprint/SPRINT-901-fixture.md"), SPRINT(pc));
  git(dir, "commit", "-q", "-am", "stamp plan_commit");
  return dir;
}
function tick(dir: string, boxNo: string, evidence: string) {
  const r = spawnSync("bun", [TICK, "TASK-901", boxNo, evidence, "--root", dir], { encoding: "utf8" });
  return { code: r.status, out: (r.stdout ?? "") + (r.stderr ?? "") };
}
const memberOf = (dir: string) => readFileSync(join(dir, "docs/work/in_progress/TASK-901-fixture.md"), "utf8");

const dirs: string[] = [];
try {
  const d1 = fixture();
  dirs.push(d1);
  const bad = tick(d1, "1", "edited `b.md` and it works");
  check("must-FAIL: undeclared path -> non-zero", bad.code === 1, `exit ${bad.code}\n${bad.out}`);
  check("must-FAIL: member-layers-incomplete named", /FAIL  member-layers-incomplete: .*Done when implies b\.md/.test(bad.out), bad.out);
  check("must-FAIL: box stays ticked", /^- \[x\] first box ✓ edited `b\.md`/m.test(memberOf(d1)), memberOf(d1));
  check("must-FAIL: continuation line untouched", /\n {6}continued line\n/.test(memberOf(d1)), memberOf(d1));

  const d2 = fixture(false, "901"); // numeric stamp form
  dirs.push(d2);
  const ok = tick(d2, "1", "reviewed, no file named");
  check("control: path-free evidence -> exit 0", ok.code === 0, `exit ${ok.code}\n${ok.out}`);
  check("control: freeze verdict printed", /check-sprint-by-reference: \d+ pass, 0 fail/.test(ok.out), ok.out);
  check("control: layers verdict printed, no FAIL", /check-layers-completeness: \d+ pass, 0 fail/.test(ok.out) && !/^FAIL/m.test(ok.out), ok.out);
  check("control: box ticked with tail on first line", /^- \[x\] first box ✓ reviewed, no file named$/m.test(memberOf(d2)), memberOf(d2));

  const before = memberOf(d2);
  const again = tick(d2, "1", "second time");
  check("already ticked: exit 2, named", again.code === 2 && /box 1 is already ticked/.test(again.out), `exit ${again.code}\n${again.out}`);
  check("already ticked: no write", memberOf(d2) === before, "file changed");
  const oor = tick(d2, "9", "x");
  check("out of range: exit 2, named, no write", oor.code === 2 && /box 9 is out of range/.test(oor.out) && memberOf(d2) === before, `exit ${oor.code}\n${oor.out}`);

  const d3 = fixture(true);
  dirs.push(d3);
  const crlf = tick(d3, "2", "done");
  const m3 = memberOf(d3);
  check("CRLF: tick passes", crlf.code === 0, `exit ${crlf.code}\n${crlf.out}`);
  check("CRLF: stays CRLF, no bare LF", m3.includes("\r\n") && !/[^\r]\n/.test(m3) && /- \[x\] second box ✓ done\r\n/.test(m3), JSON.stringify(m3));
} finally {
  for (const d of dirs) rmSync(d, { recursive: true, force: true });
}

console.log(`tick-box fixtures: ${pass} pass, ${fail} fail`);
process.exit(fail > 0 ? 1 : 0);
