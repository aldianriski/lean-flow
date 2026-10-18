// scripts/lib/tick-box.ts -- the coordinator's tick step as one mechanical action (TASK-438, L-224 x6).
// Run by Bun: `bun scripts/lib/tick-box.ts <TASK-NNN> <box#> "<evidence>" [--root <dir>]`.
//
// WHY: the written rule "re-run the checker the gate itself runs after every tick" recurred six times -- the
// coordinator ticked with an evidence tail, re-checked the freeze only, and the layers-completeness leg
// reddened later. This ticks, then runs BOTH checkers over the member's sprint, so the right re-check is not
// a thing to remember. lean-flow's own tooling: no adopter-run step names it (L-015).
//
// Exit: 0 ticked and both checkers pass (or no sprint stamp: checks skipped, said so) · 1 ticked but a checker
// FAILed (the box STAYS ticked; the finding is printed) · 2 refused before any write (named error).

import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const FREEZE = fileURLToPath(new URL("./check-sprint-by-reference.ts", import.meta.url));
const LAYERS = fileURLToPath(new URL("./check-layers-completeness.ts", import.meta.url));

function refuse(msg: string): never {
  console.error(`tick-box: ${msg}`);
  process.exit(2);
}

const argv = process.argv.slice(2);
let root = process.cwd();
const ri = argv.indexOf("--root");
if (ri >= 0) {
  root = resolve(argv[ri + 1] ?? refuse("--root needs a directory"));
  argv.splice(ri, 2);
}
const [id, boxArg, evidence] = argv;
if (!id || !/^TASK-\d+$/.test(id) || !boxArg || !/^\d+$/.test(boxArg) || !evidence || argv.length !== 3) {
  refuse('usage: bun scripts/lib/tick-box.ts <TASK-NNN> <box#> "<evidence>" [--root <dir>]');
}
const box = Number(boxArg);

// Member file: docs/work/<folder>/TASK-NNN-*.md, exactly one.
const work = join(root, "docs", "work");
const found: string[] = [];
if (existsSync(work)) {
  for (const f of readdirSync(work, { withFileTypes: true })) {
    if (!f.isDirectory()) continue;
    for (const e of readdirSync(join(work, f.name))) {
      if (e.startsWith(`${id}-`) && e.endsWith(".md")) found.push(join(work, f.name, e));
    }
  }
}
if (found.length !== 1) refuse(`${id} resolves to ${found.length} member file(s) under docs/work/*/ -- expected exactly one`);
const file = found[0]!;

// Split keeping each line's own terminator, so every other byte survives.
const text = readFileSync(file, "utf8");
const parts = text.split(/(\r?\n)/); // [line, eol, line, eol, ..., last]
let inDone = false;
let n = 0;
let at = -1;
for (let i = 0; i < parts.length; i += 2) {
  const line = parts[i]!;
  if (/^## /.test(line)) inDone = /^## Done when\s*$/.test(line);
  else if (inDone) {
    const m = /^- \[( |x)\] /.exec(line);
    if (m && ++n === box) {
      if (m[1] === "x") refuse(`${id} box ${box} is already ticked -- nothing written`);
      at = i;
    }
  }
}
if (at < 0) refuse(`${id} has ${n} top-level box(es) under ## Done when; box ${box} is out of range -- nothing written`);
parts[at] = parts[at]!.replace(/^- \[ \]/, "- [x]") + ` \u2713 ${evidence}`;
writeFileSync(file, parts.join(""));
console.log(`tick-box: ${id} box ${box} ticked in ${file.slice(root.length + 1).split("\\").join("/")}`);

const fm = /^sprint:\s*(?:SPRINT-)?0*(\d+)\s*$/m.exec(text.split(/^---\s*$/m)[1] ?? "");
if (!fm) {
  console.log("tick-box: no sprint: stamp on the member -- freeze and layers checks skipped");
  process.exit(0);
}
const sprintDir = join(root, "docs", "sprint");
const sprints = existsSync(sprintDir)
  ? readdirSync(sprintDir).filter((f) => new RegExp(`^SPRINT-0*${fm[1]}-.*\.md$`).test(f))
  : [];
if (sprints.length !== 1) {
  console.log(`tick-box: SPRINT-${fm[1]} resolves to ${sprints.length} top-level file(s) in docs/sprint/ -- checks skipped`);
  process.exit(0);
}
const sprint = join(sprintDir, sprints[0]!);

let failed = false;
for (const [name, script] of [["freeze", FREEZE], ["layers-completeness", LAYERS]] as const) {
  const r = spawnSync("bun", [script, sprint], { encoding: "utf8", cwd: root });
  const lines = (r.stdout ?? "").split(/\r?\n/).filter((l) => l.length > 0);
  const fails = lines.filter((l) => /^FAIL/.test(l));
  for (const l of fails) console.log(l);
  if (name === "freeze") console.log(lines[lines.length - 1] ?? "check-sprint-by-reference: no output"); // its own verdict line
  else console.log(`check-layers-completeness: ${lines.length - fails.length} pass, ${fails.length} fail`); // this checker prints none
  if (r.status !== 0 || r.error) {
    failed = true;
    if (fails.length === 0) console.log(`FAIL  ${name}: exit ${r.status} ${r.error ?? ""} ${(r.stderr ?? "").trim().split("\n")[0]}`);
  }
}
if (failed) console.log(`tick-box: ${id} box ${box} stays ticked, but a gate checker FAILed -- fix the evidence or the Layers: declaration`);
process.exit(failed ? 1 : 0);
