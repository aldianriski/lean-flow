// TASK-653: real CLI writes, real parsing checks, and git hash-object on every refusal.
// Run: bun --no-env-file evals/run-record-line-fixtures.ts
// Scratch repos stay inside the fixture directory; never mutate the host sprint/task store.
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, realpathSync, rmdirSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../", import.meta.url));
const FIXTURES = join(ROOT, "evals/fixtures/record-line");
const WRITER = join(ROOT, "scripts/lib/record-line.ts");
const LOG = "docs/sprint/logs/SPRINT-901-fixture.md";
const SPRINT = "docs/sprint/SPRINT-901-fixture.md";
const MEMBER = "docs/work/todo/TASK-901-fixture.md";
const started = performance.now();
let pass = 0;
let fail = 0;
const scratch = mkdtempSync(join(FIXTURES, ".tmp-"));
const env = { ...process.env, GIT_CONFIG_GLOBAL: process.platform === "win32" ? "NUL" : "/dev/null", GIT_CONFIG_NOSYSTEM: "1" };

function run(cwd: string, cmd: string, args: string[]) {
  const r = spawnSync(cmd, args, { cwd, env, encoding: "utf8" });
  return { code: r.status, out: `${r.stdout ?? ""}${r.stderr ?? ""}${r.error ?? ""}` };
}
function git(cwd: string, ...args: string[]) {
  const r = run(cwd, "git", ["-c", "user.name=Fixture", "-c", "user.email=fixture@example.invalid", "-c", "core.autocrlf=false", ...args]);
  if (r.code !== 0) throw new Error(r.out);
  return r.out.trim();
}
function check(name: string, condition: boolean, detail = "") {
  console.log(`${condition ? "PASS" : "FAIL"}  ${name}${condition ? "" : ` -- ${detail}`}`);
  condition ? pass++ : fail++;
}
function put(root: string, path: string, text: string) {
  mkdirSync(dirname(join(root, path)), { recursive: true });
  writeFileSync(join(root, path), text);
}
function fixture(name: string, history = false) {
  const root = join(scratch, name);
  put(root, LOG, "# Execution Log\n");
  put(root, MEMBER, readFileSync(join(FIXTURES, "member.md"), "utf8"));
  for (const folder of ["backlog", "todo", "in_progress", "review", "done", "cancel"]) mkdirSync(join(root, "docs/work", folder), { recursive: true });
  if (history) {
    const sprint = readFileSync(join(FIXTURES, "sprint.md"), "utf8");
    put(root, SPRINT, sprint.replace("__COMMIT__", "0000000"));
    git(root, "init", "-q");
    git(root, "add", ".");
    git(root, "commit", "-qm", "fixture baseline");
    put(root, SPRINT, sprint.replace("__COMMIT__", git(root, "rev-parse", "HEAD")));
    git(root, "commit", "-qam", "record freeze");
  }
  return root;
}
function writer(root: string, args: string[]) {
  return run(root, process.execPath, ["--no-env-file", WRITER, ...args, "--root", root]);
}
function wrote(root: string, args: string[]) {
  const r = writer(root, args);
  if (r.code !== 0) throw new Error(`writer ${args[0]}: ${r.out}`);
  return r.out;
}
function review(root: string, log = LOG) {
  return run(root, "sh", [join(ROOT, "scripts/lib/check-review-depth.sh"), join(root, log)]);
}
function freeze(root: string, close = false) {
  return run(root, process.execPath, ["--no-env-file", join(ROOT, "scripts/lib/check-sprint-by-reference.ts"), join(root, SPRINT), "--scope-change", ...(close ? ["--close"] : [])]);
}
function scenario(name: string, fn: () => void) {
  try { fn(); } catch (e) { check(name, false, String(e)); }
}
// Include path inventory, raw blob hashes and the index: even a partial move/create must be visible.
function snapshot(root: string): string {
  const files: string[] = [];
  const directories: string[] = [];
  function walk(dir: string) {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      if (e.name === ".git") continue;
      const p = join(dir, e.name);
      if (e.isDirectory()) { directories.push(p); walk(p); }
      else if (e.isFile()) files.push(p);
    }
  }
  walk(root);
  if (existsSync(join(root, ".git/index"))) files.push(join(root, ".git/index"));
  files.sort();
  return directories.sort().join("\n") + "\n" + files.join("\n") + "\n" + git(root, "hash-object", "--no-filters", "--", ...files);
}
function refusal(root: string, name: string, args: string[], field: string, code = 2) {
  const before = snapshot(root);
  const r = writer(root, args);
  const unchanged = snapshot(root) === before;
  check(`refusal ${name}: exit ${code}, names ${field}, hash-object unchanged`, r.code === code && (r.out.includes(`record-line: ${field}:`) || (field === "box" && /^tick-box: TASK-\d+ .*\bbox\b/m.test(r.out))) && unchanged, r.out);
}

try {
  scenario("log commands", () => {
    const root = fixture("logs");
    wrote(root, ["consequence", "--log", LOG, "--tn", "T1", "--behaviour", "low", "--governance", "low"]);
    wrote(root, ["review", "--log", LOG, "--tn", "T1", "--depth", "self-review", "--behaviour", "low", "--governance", "low"]);
    check("consequence + review: exact parser contract", readFileSync(join(root, LOG), "utf8") === "# Execution Log\nconsequence · T1 · behaviour:low · governance:low\nreview · T1 · self-review · behaviour:low · governance:low\n");
    const r = review(root);
    check("consequence + review: real check passes with one record", r.code === 0 && /PASS.*1 review record\(s\), 1 self-review/.test(r.out), r.out);
    wrote(root, ["builder-check", "--log", LOG, "--tn", "T1", "--contradictions", "2", "--questions", "0", "--settled", "facts settled by the parser"]);
    check("builder-check: existing line shape", readFileSync(join(root, LOG), "utf8").endsWith("builder-check · T1 · 2 contradictions · 0 questions · facts settled by the parser\n"));
  });

  scenario("SPRINT-171 real replay", () => {
    const replay = JSON.parse(readFileSync(join(FIXTURES, "replay.json"), "utf8")) as { source: string; cases: { tn: string; line: string; finding: string }[] };
    const archive = readFileSync(join(ROOT, replay.source), "utf8").split(/\r?\n/);
    for (const c of replay.cases) {
      const actual = archive.filter((line) => line.startsWith(`consequence · ${c.tn} · `));
      if (actual.length !== 1 || actual[0] !== c.line) throw new Error(`archived ${c.tn} consequence changed: ${actual}`);
      const root = fixture(`replay-${c.tn}`);
      const fields = actual[0]!.split(" · ");
      const dims = ["--behaviour", fields[2]!.split(":")[1]!, "--governance", fields[3]!.split(":")[1]!];
      wrote(root, ["consequence", "--log", LOG, "--tn", c.tn, ...dims]);
      check(`SPRINT-171 ${c.tn}: original consequence, later reviews dropped`, readFileSync(join(root, LOG), "utf8") === `# Execution Log\n${c.line}\n`);
      const before = review(root);
      const failures = before.out.split(/\r?\n/).filter((l) => l.startsWith("FAIL"));
      check(`SPRINT-171 ${c.tn}: must-FAIL ${c.finding}`, before.code === 1 && failures.length === 1 && failures[0]!.includes(`${c.finding}:`) && failures[0]!.includes(c.tn), before.out);
      wrote(root, ["review", "--log", LOG, "--tn", c.tn, "--depth", "scoped-reviewer", ...dims]);
      const after = review(root);
      check(`SPRINT-171 ${c.tn}: written completed review clears finding`, after.code === 0 && /PASS.*1 review record/.test(after.out), after.out);
    }
  });

  scenario("scope-change", () => {
    const root = fixture("scope", true);
    put(root, MEMBER, readFileSync(join(root, MEMBER), "utf8").replace("first box", "amended criterion"));
    const before = freeze(root);
    check("scope-change: real freeze check reaches edited criterion", before.code === 1 && /FAIL  FREEZE-EDIT TASK-901/.test(before.out), before.out);
    wrote(root, ["scope-change", "--log", LOG, "--date", "2026-11-12", "--summary", "T1 amended criterion; owner reconfirmed G2"]);
    check("scope-change: exact heading", readFileSync(join(root, LOG), "utf8").endsWith("### 2026-11-12 | scope-change | T1 amended criterion; owner reconfirmed G2\n"));
    const after = freeze(root);
    check("scope-change: Tn resolves through frozen Cites, real check clears", after.code === 0 && /covered by a scope-change entry/.test(after.out) && /1 scope-change entry checked/.test(after.out), after.out);
  });

  scenario("tick delegation", () => {
    const root = fixture("tick", true);
    const initial = readFileSync(join(root, MEMBER), "utf8").replace(/\r?\n/g, "\r\n");
    put(root, MEMBER, initial);
    const r = wrote(root, ["tick", "TASK-901", "1", "reviewed with the real checks"]);
    check("tick: exact evidence suffix, CRLF and continuation preserved", readFileSync(join(root, MEMBER), "utf8") === initial.replace("- [ ] first box", "- [x] first box ✓ reviewed with the real checks"));
    check("tick: delegates both real checks", /check-sprint-by-reference: \d+ pass, 0 fail/.test(r) && /check-layers-completeness: \d+ pass, 0 fail/.test(r), r);
    refusal(root, "already ticked", ["tick", "TASK-901", "1", "again"], "box");
    refusal(root, "wrong box after successful tick", ["tick", "TASK-901", "3", "checked"], "box");
    const bad = writer(root, ["tick", "TASK-901", "2", "checked `undeclared.md`"]);
    check("tick: downstream FAIL stays visible, exit 1 preserves tick-box contract", bad.code === 1 && /FAIL  member-layers-incomplete/.test(bad.out) && /- \[x\] second box ✓ checked `undeclared.md`/.test(readFileSync(join(root, MEMBER), "utf8")), bad.out);
  });

  scenario("move", () => {
    const root = fixture("move", true);
    const head = git(root, "rev-parse", "HEAD");
    const hash = git(root, "hash-object", MEMBER);
    let from = MEMBER;
    for (const folder of ["backlog", "in_progress", "review", "cancel", "todo", "done"]) {
      wrote(root, ["move", "TASK-901", folder]);
      const to = `docs/work/${folder}/TASK-901-fixture.md`;
      check(`move: git mv into ${folder}, content preserved, no commit`, !existsSync(join(root, from)) && existsSync(join(root, to)) && git(root, "hash-object", to) === hash && git(root, "rev-parse", "HEAD") === head && git(root, "ls-files", "--", to) === to);
      from = to;
    }
    const closed = freeze(root, true);
    check("move: real freeze and close check resolve new status", closed.code === 0 && /PASS  close TASK-901 -- in done/.test(closed.out), closed.out);
    refusal(root, "move to current folder", ["move", "TASK-901", "done"], "folder");
  });

  scenario("move into a status folder absent from git", () => {
    const root = fixture("move-empty-folder", true);
    const folder = join(root, "docs/work/done");
    if (readdirSync(folder).length !== 0) throw new Error("fixture done directory is not empty");
    rmdirSync(folder); // git cannot retain empty directories; fresh clones omit them.
    const head = git(root, "rev-parse", "HEAD");
    wrote(root, ["move", "TASK-901", "done"]);
    check("move: creates absent status folder and stages rename without commit", git(root, "ls-files", "--", "docs/work/done/TASK-901-fixture.md") === "docs/work/done/TASK-901-fixture.md" && git(root, "rev-parse", "HEAD") === head);
  });

  scenario("ambiguous task resolution", () => {
    for (const folder of ["todo", "review"]) {
      const root = fixture(`ambiguous-${folder}`);
      put(root, `docs/work/${folder}/TASK-901-duplicate.md`, "duplicate\n");
      for (const args of [["tick", "TASK-901", "1", "checked"], ["move", "TASK-901", "done"]]) refusal(root, `${args[0]} duplicate in ${folder}`, args, "task");
    }
    const root = fixture("move-no-git");
    refusal(root, "move must not use parent repository", ["move", "TASK-901", "done"], "root");
    const untracked = fixture("move-untracked", true);
    git(untracked, "rm", "--cached", MEMBER);
    rmdirSync(join(untracked, "docs/work/done"));
    refusal(untracked, "move untracked source creates nothing", ["move", "TASK-901", "done"], "task");
    const locked = fixture("move-locked", true);
    rmdirSync(join(locked, "docs/work/done"));
    put(locked, ".git/index.lock", "fixture lock\n");
    refusal(locked, "move with locked index leaves no destination folder", ["move", "TASK-901", "done"], "move");
  });

  scenario("realpath containment", () => {
    const root = fixture("links", true);
    const outside = join(scratch, "outside-links");
    put(outside, "target.md", "must stay unchanged\n");
    put(outside, "TASK-902-outside.md", "## Done when\n- [ ] outside box\n");
    const before = snapshot(outside);
    symlinkSync(outside, join(root, "docs/sprint/logs/escape"), process.platform === "win32" ? "junction" : "dir");
    refusal(root, "log through directory link", ["consequence", "--log", "docs/sprint/logs/escape/target.md", "--tn", "T1", "--behaviour", "low", "--governance", "low"], "log");
    // Replace only our empty fixture status folder, never a real task directory.
    const folder = join(root, "docs/work/review");
    if (readdirSync(folder).length !== 0) throw new Error("fixture review directory is not empty");
    rmdirSync(folder);
    symlinkSync(outside, folder, process.platform === "win32" ? "junction" : "dir");
    refusal(root, "tick through status directory link", ["tick", "TASK-902", "1", "checked"], "task");
    refusal(root, "move through status directory link", ["move", "TASK-901", "review"], "task");
    check("realpath: outside target hashes unchanged", snapshot(outside) === before);
  });

  scenario("task file symlink", () => {
    // Release review: todo/TASK-904 symlinked to backlog/TASK-903 must not move or tick TASK-903 under TASK-904.
    const root = fixture("tasklink", true);
    put(root, "docs/work/backlog/TASK-903-real.md", "## Done when\n- [ ] real box\n");
    try {
      symlinkSync(join(root, "docs/work/backlog/TASK-903-real.md"), join(root, "docs/work/todo/TASK-904-alias.md"), "file");
    } catch (e) {
      if (process.platform !== "win32") throw e;
      console.log("NOTE  task file symlink: this Windows host cannot create a file symlink; the case runs on the off-host gate");
      return;
    }
    refusal(root, "move through a task file symlink", ["move", "TASK-904", "done"], "task");
    refusal(root, "tick through a task file symlink", ["tick", "TASK-904", "1", "checked"], "task");
  });

  scenario("append context", () => {
    const root = fixture("append");
    const args = ["scope-change", "--log", LOG, "--date", "2026-11-12", "--summary", "TASK-901 amended scope"];
    for (const opening of ["```", "<!--"]) {
      put(root, LOG, `# Log\n${opening}\n`);
      refusal(root, "hidden append position", args, "log");
    }
    put(root, LOG, "# Log without terminal newline");
    wrote(root, args);
    check("append: preserves prefix and starts heading at column 1", readFileSync(join(root, LOG), "utf8") === "# Log without terminal newline\n### 2026-11-12 | scope-change | TASK-901 amended scope\n");
    for (const depth of ["code-review", "security-review"]) wrote(root, ["review", "--log", LOG, "--tn", "T2", "--depth", depth, "--behaviour", "material", "--governance", "high"]);
    const r = review(root);
    check("review: remaining documented depths pass real check", r.code === 0 && /2 review record/.test(r.out), r.out);
    wrote(root, ["review", "--log", LOG, "--tn", "T3", "--depth", "self-review", "--behaviour", "material", "--governance", "low"]);
    const bad = review(root);
    check("review: writer preserves explicit values so insufficient depth still FAILs", bad.code === 1 && /review-depth-material-self-reviewed/.test(bad.out), bad.out);
  });

  scenario("log with CRLF prefix", () => {
    const root = fixture("crlf-log");
    put(root, LOG, "# Existing log\r\n");
    wrote(root, ["consequence", "--log", LOG, "--tn", "T1", "--behaviour", "material", "--governance", "low"]);
    check("log: old bytes preserved, new record has parser's LF terminator", readFileSync(join(root, LOG), "utf8") === "# Existing log\r\nconsequence · T1 · behaviour:material · governance:low\n");
    const before = review(root);
    check("log: CRLF prefix does not hide missing material review", before.code === 1 && /review-depth-material-absent/.test(before.out) && !/review-depth-consequence-vocab/.test(before.out), before.out);
    wrote(root, ["review", "--log", LOG, "--tn", "T1", "--depth", "code-review", "--behaviour", "material", "--governance", "low"]);
    const after = review(root);
    check("log: CRLF prefix plus written review passes unchanged checker", after.code === 0 && /PASS.*1 review record/.test(after.out), after.out);
  });

  scenario("refusals", () => {
    const root = fixture("refusals", true);
    put(root, "docs/sprint/logs/second.md", "# second log\n");
    const outside = join(scratch, "outside.md");
    writeFileSync(outside, "outside must stay unchanged\n");
    const beforeOutside = git(root, "hash-object", "--no-filters", outside);
    const cases = JSON.parse(readFileSync(join(FIXTURES, "refusals.json"), "utf8")) as { name: string; args: string[]; field: string; code?: number }[];
    for (const c of cases) {
      refusal(root, c.name, c.args.map((a) => a.replace("{log}", LOG).replace("{outside}", outside)), c.field, c.code);
      if (git(root, "hash-object", "--no-filters", outside) !== beforeOutside) throw new Error(`${c.name} changed outside target`);
    }
  });
} finally {
  const real = realpathSync(scratch);
  if (dirname(real) !== realpathSync(FIXTURES) || !relative(FIXTURES, real).startsWith(".tmp-")) throw new Error("refusing cleanup outside fixture scratch");
  rmSync(real, { recursive: true, force: true });
}
console.log(`record-line fixtures: ${pass} pass, ${fail} fail (${((performance.now() - started) / 1000).toFixed(2)}s)`);
process.exit(fail ? 1 : 0);
