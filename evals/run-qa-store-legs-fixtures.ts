// evals/run-qa-store-legs-fixtures.ts -- retained proof for the store-side gate legs (SPRINT-110 T4 ·
// TASK-392). Tier G (a guard: a false negative here is silent). Run by Bun:
// `bun evals/run-qa-store-legs-fixtures.ts`  -- seconds, temp dirs, one `sh` spawn per leg case.
//
// WHAT IT COVERS. (1) scripts/lib/sprint-members-cli.ts, the argv wrapper over resolveMembers that the
// shell gates call (qa-check.sh leg 2g / leg 7, night-run.sh reap(), T3's conformance engine).
// (2) qa-check.sh leg 3 (ownership fields) and the RETIRED legs 5 / 7 / 8. Their subject was TODO.md
// (breadcrumb lint, TD aging, tracker: lint, plus TODO.md as one subject of leg 3); SPRINT-111 T3
// retired them rather than retargeting them, so the cases that proved them now prove they NO LONGER
// FIRE on a tree that still carries every shape they used to reject, and leg 3's other subjects
// are the sibling controls that still redden. reap() and leg 2g cases live in the existing reap/rollup
// harnesses, not here.
//
// HOW A LEG IS RUN. The leg body is EXTRACTED from the real scripts/qa-check.sh at run time (between
// its `qb_checkpoint "leg N` marker and the next one) and executed by `sh` in a temp tree -- never
// re-typed, so an edit to the leg cannot drift from this proof. A vanished marker is a named FAIL.
//
// POPULATION (L-186) -- cases that vary the SELECTION, not only the verdict:
//   members: a `## Members` path gone stale (listed under todo/, file now in in_progress/ / done/),
//     a member reached ONLY by its `sprint:` stamp, a shared-prefix id (TASK-9710 vs TASK-971), a Tn
//     citing two members, a Tn citing no current member, a box outside `## Done when`, a box in a fence.
//   active sprints: an archived and a log file both carry `status: active` and must not count; two
//     active sprint files (the highest wins) (the TODO.md pointer that once competed with them was retired, SPRINT-111 T3).

import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const REPO = fileURLToPath(new URL("../", import.meta.url)).replace(/[\\/]$/, "");
const CLI = join(REPO, "scripts/lib/sprint-members-cli.ts");
const QA = join(REPO, "scripts/qa-check.sh");

let pass = 0;
let fail = 0;
function check(name: string, ok: boolean, detail = ""): void {
  if (ok) {
    pass++;
    console.log(`PASS  ${name}`);
  } else {
    fail++;
    console.log(`FAIL  ${name}${detail ? " -- " + detail : ""}`);
  }
}

const tmps: string[] = [];
function tree(files: Record<string, string>): string {
  const root = mkdtempSync(join(tmpdir(), "qa-store-legs-"));
  tmps.push(root);
  for (const [rel, body] of Object.entries(files)) {
    const p = join(root, rel);
    mkdirSync(dirname(p), { recursive: true });
    writeFileSync(p, body);
  }
  return root;
}

function run(cmd: string[], cwd: string, env: Record<string, string> = {}) {
  const r = Bun.spawnSync(cmd, { cwd, env: { ...process.env, ...env }, stdout: "pipe", stderr: "pipe" });
  return { code: r.exitCode, out: r.stdout.toString().replace(/\r\n/g, "\n"), err: r.stderr.toString().replace(/\r\n/g, "\n") };
}
const cli = (cwd: string, ...args: string[]) => run(["bun", CLI, ...args], cwd);

// ---------- fixture builders ----------
function task(id: string, sprint: string | null, boxes: string, extra = ""): string {
  return `---\nid: ${id}\ntitle: "t"\n${sprint ? `sprint: ${sprint}\n` : ""}state: ready\n---\n\n# ${id}\n\n## Done when\n\n${boxes}\n\n## Touches\n\n- [ ] a box that is NOT DoD\n${extra}`;
}
const T = "- [x] one\n- [ ] two";
const DONE = "- [x] one\n- [x] two";
const OPEN = "- [ ] one\n- [ ] two";

const SPRINT = `---
sprint: 970
slug: fx
status: active
---

## Members

- docs/work/todo/TASK-971-a.md
- docs/work/todo/TASK-972-b.md

## Plan

### T1 — one \`[size: S]\`
Layers: \`a.md\`
Depends-on: none
Cites: \`TASK-971\` · EPIC-1

### T2 — two \`[size: S]\`
Layers: \`b.md\`
Cites: \`TASK-971\` · \`TASK-972\`

### T3 — three \`[size: S]\`
Cites: \`TASK-973\`

### T4 — scoped out \`[size: S]\`
Cites: \`TASK-999\`
`;

// v2 tree: TASK-971 in_progress (1/2, stale Members path), TASK-972 done (2/2, stale path),
// TASK-973 todo (0/2) reachable ONLY by its sprint: stamp, TASK-9710 shares the TASK-971 prefix and
// belongs to another sprint, and a fenced box inside 972's Done when must not count.
function v2(): string {
  return tree({
    "docs/sprint/SPRINT-970-fx.md": SPRINT,
    "docs/work/in_progress/TASK-971-a.md": task("TASK-971", "SPRINT-970", T),
    "docs/work/done/TASK-972-b.md": task("TASK-972", "SPRINT-970", DONE + "\n\n```\n- [ ] fenced example\n```"),
    "docs/work/todo/TASK-973-c.md": task("TASK-973", "970", OPEN),
    "docs/work/todo/TASK-9710-d.md": task("TASK-9710", "SPRINT-971", OPEN),
  });
}

// ================= (1) the CLI =================
{
  const r = v2();
  const s = "docs/sprint/SPRINT-970-fx.md";

  let x = cli(r, "members", s);
  check("cli members: three members by id, stale Members paths resolved to their CURRENT folder, stamp-only member included, TASK-9710 excluded",
    x.code === 0 && x.out === "docs/work/in_progress/TASK-971-a.md\ndocs/work/done/TASK-972-b.md\ndocs/work/todo/TASK-973-c.md\n", `code ${x.code} out ${JSON.stringify(x.out)} err ${x.err}`);

  x = cli(r, "counts", s);
  const want = [
    "dod 3 3",
    "units 3 0",
    "member TASK-971 1 1 docs/work/in_progress/TASK-971-a.md",
    "member TASK-972 2 0 docs/work/done/TASK-972-b.md",
    "member TASK-973 0 2 docs/work/todo/TASK-973-c.md",
    "unit T1 open",
    "unit T2 open",
    "unit T3 open",
  ].join("\n") + "\n";
  check("cli counts: DoD boxes only from `## Done when` (not Touches, not a fence), units = Tn blocks citing a current member (T4 scoped out leaves the counts)",
    x.code === 0 && x.out === want, `code ${x.code} out ${JSON.stringify(x.out)}`);

  // a unit citing two members is delivered only when BOTH are clean
  const r2 = tree({
    "docs/sprint/SPRINT-970-fx.md": SPRINT,
    "docs/work/done/TASK-971-a.md": task("TASK-971", "SPRINT-970", DONE),
    "docs/work/done/TASK-972-b.md": task("TASK-972", "SPRINT-970", DONE),
    "docs/work/done/TASK-973-c.md": task("TASK-973", "970", DONE),
  });
  x = cli(r2, "counts", s);
  check("cli counts: every member ticked -> every citing unit delivered (T2 cites two, both clean)",
    x.code === 0 && x.out.includes("dod 6 0\nunits 3 3\n") && !x.out.includes("open"), JSON.stringify(x.out));
  const r3 = tree({
    "docs/sprint/SPRINT-970-fx.md": SPRINT,
    "docs/work/done/TASK-971-a.md": task("TASK-971", "SPRINT-970", DONE),
    "docs/work/in_progress/TASK-972-b.md": task("TASK-972", "SPRINT-970", T),
    "docs/work/done/TASK-973-c.md": task("TASK-973", "970", DONE),
  });
  x = cli(r3, "counts", s);
  check("cli counts: a unit citing two members stays open while ONE of them has an open box (T1 delivered, T2 open)",
    x.code === 0 && x.out.includes("unit T1 delivered\nunit T2 open\nunit T3 delivered\n"), JSON.stringify(x.out));

  // must-FAIL: a listed member that cannot be resolved is a named error, never a silent short list
  const rm = tree({
    "docs/sprint/SPRINT-970-fx.md": SPRINT,
    "docs/work/in_progress/TASK-971-a.md": task("TASK-971", "SPRINT-970", T),
  });
  x = cli(rm, "members", s);
  check("cli members: a listed member with no file -> exit 2, SPRINT-MEMBER-UNRESOLVED naming TASK-972, nothing on stdout",
    x.code === 2 && x.out === "" && /SPRINT-MEMBER-UNRESOLVED/.test(x.err) && x.err.includes("TASK-972"), `code ${x.code} err ${x.err}`);
  x = cli(rm, "counts", s);
  check("cli counts: same unresolved member -> exit 2 and no counts", x.code === 2 && x.out === "" && /SPRINT-MEMBER-UNRESOLVED/.test(x.err), `code ${x.code} out ${x.out}`);

  // a v1 sprint (no docs/work store) is not by-reference
  const r1 = tree({ "docs/sprint/SPRINT-970-fx.md": "---\nsprint: 970\nstatus: active\n---\n\n## Plan\n\n### T1 — x\n- [ ] a\n" });
  x = cli(r1, "kind", s);
  check("cli kind: no docs/work store -> v1", x.code === 0 && x.out === "v1\n", JSON.stringify(x.out));
  x = cli(r1, "counts", s);
  check("cli counts: on a v1 sprint -> exit 3 NOT-BY-REFERENCE (never a silent 0 of 0)", x.code === 3 && /NOT-BY-REFERENCE/.test(x.err) && x.out === "", `code ${x.code} err ${x.err}`);
  x = cli(r, "kind", s);
  check("cli kind: Members + store -> v2", x.code === 0 && x.out === "v2\n", JSON.stringify(x.out));
  // the store exists (mixed tree) but THIS sprint is v1-shaped: no Members, no stamps
  const rmix = tree({
    "docs/sprint/SPRINT-970-fx.md": "---\nsprint: 970\nstatus: active\n---\n\n## Plan\n\n### T1 — x\n- [ ] a\n",
    "docs/work/todo/TASK-5-z.md": task("TASK-5", "SPRINT-500", OPEN),
  });
  x = cli(rmix, "kind", s);
  check("cli kind: store present but this sprint lists and stamps no member -> v1", x.out === "v1\n", JSON.stringify(x.out));
  // stamp-only v2 sprint (no ## Members section at all)
  const rst = tree({
    "docs/sprint/SPRINT-970-fx.md": "---\nsprint: 970\nstatus: active\n---\n\n## Plan\n\n### T1 — x\nCites: `TASK-5`\n",
    "docs/work/todo/TASK-5-z.md": task("TASK-5", "SPRINT-970", OPEN),
  });
  x = cli(rst, "counts", s);
  check("cli counts: a sprint with NO Members section, reached only by stamps -> v2, counted", x.code === 0 && x.out.startsWith("dod 0 2\nunits 1 0\n"), JSON.stringify(x.out));

  x = cli(r, "bogus");
  check("cli: unknown mode -> exit 64 usage", x.code === 64, `code ${x.code}`);

  // active sprints
  const ra = tree({
    "docs/sprint/SPRINT-110-a.md": "---\nsprint: 110\nstatus: active\n---\n",
    "docs/sprint/SPRINT-112-b.md": "---\nsprint: 112\nstatus: active\n---\n",
    "docs/sprint/SPRINT-105-c.md": "---\nsprint: 105\nstatus: closed\n---\n",
    "docs/sprint/archive/SPRINT-300-x.md": "---\nsprint: 300\nstatus: active\n---\n",
    "docs/sprint/logs/SPRINT-301-y.md": "---\nsprint: 301\nstatus: active\n---\n",
  });
  x = cli(ra, "active");
  check("cli active: only top-level docs/sprint/SPRINT-*.md with status: active (archive, logs, closed excluded)", x.code === 0 && x.out === "110\n112\n", JSON.stringify(x.out));
}

// ================= (2) qa-check.sh leg 3, and the retired legs 5 / 7 / 8 =================
const qaText = readFileSync(QA, "utf8").replace(/\r\n/g, "\n");
function legBody(n: string): string {
  const lines = qaText.split("\n");
  const start = lines.findIndex((l) => l.startsWith(`qb_checkpoint "leg ${n}:`));
  if (start < 0) return "";
  let end = lines.findIndex((l, i) => i > start && l.startsWith("qb_checkpoint "));
  if (end < 0) end = lines.length;
  return lines.slice(start + 1, end).join("\n");
}
const PRELUDE = `set -u
ROOT='${REPO.replace(/\\/g, "/")}'
fail=0; pass=0
note() { printf '      %s\\n' "$1"; }
ok()   { pass=$((pass + 1)); printf 'PASS  %s\\n' "$1"; }
bad()  { fail=$((fail + 1)); printf 'FAIL  %s\\n' "$1"; }
`;
function leg(n: string, cwd: string) {
  const body = legBody(n);
  if (!body) return { code: 99, out: "", err: `marker 'qb_checkpoint "leg ${n}:' not found in qa-check.sh` };
  const f = join(cwd, ".leg.sh");
  writeFileSync(f, PRELUDE + body + `\nprintf 'LEG-SUMMARY pass=%s fail=%s\\n' "$pass" "$fail"\n`);
  const r = run(["sh", ".leg.sh"], cwd);
  rmSync(f, { force: true });
  return r;
}
const summary = (o: string) => o.match(/LEG-SUMMARY pass=(\d+) fail=(\d+)/)?.slice(1).map(Number) ?? [-1, -1];
// leg 3 is run on its own; "6" is the region leg 6 + 6b, which now ends at leg 9's marker and therefore
// contains the retired legs 5 / 7 / 8's tombstones (comments only) -- the region the retired legs sat beside.
const legs = ["3", "6"];
for (const n of legs) check(`leg ${n}: marker present in qa-check.sh (extraction is not vacuous)`, legBody(n).length > 100);

const OWN = "---\nowner: M\nlast_updated: 2026-09-29\nstatus: current\n---\n\n";
const SKILL = { "skills/x/SKILL.md": "---\nname: x\ndescription: d\n---\n" };
const base = { ...SKILL, "README.md": "<sub>Doc owner: M · last updated 2026-09-29 · status: current v1.2.3</sub>\n" };

// --- retired legs 5 / 7 / 8: static, then behavioural
{
  const code = qaText.split("\n").filter((l) => !l.trim().startsWith("#"));
  check("retired legs: no non-comment line of qa-check.sh names TODO.md (no reader left, in any leg)", code.filter((l) => /TODO\.md/.test(l)).length === 0, code.filter((l) => /TODO\.md/.test(l)).join("\n"));
  check("retired legs: no qb_checkpoint marker for leg 5 / 7 / 8 remains", !/^qb_checkpoint "leg [578]:/m.test(qaText));
  // A tree carrying EVERY shape those legs used to reject: a breadcrumb comment (5), a stale open TD row against
  // an Active Sprint pointer (7), a (temp) tracker and a bare verdict-*.md tracker (8). Run over the region the
  // legs sat in: nothing may name TODO.md or TD aging.
  const legacy = OWN + "## Active Sprint\n\n> **SPRINT-110 — x** → docs/sprint/SPRINT-110-x.md\n\n## Backlog\n\n<!-- shipped in SPRINT-3 -->\n"
    + "- **TD-900** severity: low | status: open | created: Sprint-100\n  tracker: docs/research/x.md (temp)\n  tracker: verdict-foo.md\n";
  const pj = { ".claude-plugin/plugin.json": '{ "version": "1.2.3" }\n' };
  let d = tree({ ...base, ...pj, "TODO.md": legacy, "docs/work/todo/.gitkeep": "", "docs/sprint/SPRINT-110-x.md": "---\nsprint: 110\nstatus: active\n---\n" });
  let x = leg("6", d);
  check("retired legs 5/7/8: a tree with a breadcrumb, a stale TD row and bad trackers yields no TODO.md / TD aging / tracker finding",
    !/TODO\.md|TD aging|tracker/i.test(x.out), x.out);
  check("retired legs 5/7/8 control: the same region still ran (leg 6's README footer PASS is present, so the silence is not an empty extraction)",
    /^PASS  README footer version \(1\.2\.3 = plugin\.json 1\.2\.3\)/m.test(x.out), x.out);
  d = tree({ ...base, ...pj, "README.md": "<sub>Doc owner: M · last updated 2026-09-29 · status: current v9.9.9</sub>\n", "TODO.md": legacy });
  x = leg("6", d);
  check("retired legs sibling control: the surviving leg in that region still reddens (footer 9.9.9 vs plugin.json 1.2.3 -> FAIL README footer version)",
    /^FAIL  README footer version/m.test(x.out), x.out);
}
// --- leg 3 (ownership fields; TODO.md was one subject of many and is retired from the list)
{
  let d = tree({ ...base, ".claude/CLAUDE.md": "---\nowner: M\nstatus: current\n---\n" });
  let x = leg("3", d);
  check("leg 3 must-FAIL: .claude/CLAUDE.md lacks last_updated -> FAIL 'ownership .claude/CLAUDE.md'", /^FAIL  ownership \.claude\/CLAUDE\.md/m.test(x.out) && summary(x.out)[1] === 1, x.out);
  d = tree({ ...base, ".claude/CLAUDE.md": OWN });
  x = leg("3", d);
  check("leg 3 control: .claude/CLAUDE.md carries all three fields -> PASS", /^PASS  ownership \.claude\/CLAUDE\.md/m.test(x.out) && summary(x.out)[1] === 0, x.out);
  // retired subject: a TODO.md with NO ownership fields, beside a conformant CLAUDE.md. Must be neither FAIL, PASS, nor skip-NOTE.
  d = tree({ ...base, ".claude/CLAUDE.md": OWN, "TODO.md": "---\nowner: M\nstatus: current\n---\n" });
  x = leg("3", d);
  check("leg 3 retired subject: a TODO.md lacking last_updated yields no finding and no NOTE (it is not read), the sibling still PASSes",
    !/TODO\.md/.test(x.out) && /^PASS  ownership \.claude\/CLAUDE\.md/m.test(x.out) && summary(x.out)[1] === 0, x.out);
}

for (const t of tmps) rmSync(t, { recursive: true, force: true });
console.log(`qa-store-legs-fixtures: ${pass} pass, ${fail} fail`);
process.exit(fail > 0 ? 1 : 0);
