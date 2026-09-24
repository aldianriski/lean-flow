// evals/run-by-reference-fixtures.ts -- retained proof for scripts/lib/check-sprint-by-reference.ts,
// the Plan freeze + close check of a sprint run by reference (SPRINT-107 T1 · TASK-362 · ADR-047).
// Run by Bun: `bun evals/run-by-reference-fixtures.ts`. Tier G (ADR-029).
//
// WHY RETAINED. TD-012: a gate whose fixtures are deleted is unguarded. These stay.
//
// SHAPE. Every case builds a throwaway git repo from evals/fixtures/by-reference/ (a two-member
// sprint, TASK-901 + TASK-902, both in todo/ and stamped `sprint: SPRINT-901`), commits the promote
// so that commit IS plan_commit, records it in the sprint file in a second commit (as a real
// promote does), then applies the case's post-promote mutation as real on-disk edits / `git mv`s
// and runs the checker as a subprocess. A case passes only when the checker's set of FAIL findings
// (the token before ` -- ` on each `FAIL` line) EQUALS the expected set, and the checker's own
// verdict line agrees with that count -- never its exit code alone (L-120).
//
// POPULATION (L-186). Beyond must-PASS / must-FAIL per check, several cases vary the SELECTION the
// checker runs over rather than the verdict: a member reached through its `sprint:` stamp but not
// the Members list, and the reverse; a member that changed folders after plan_commit; a non-member
// whose id shares a prefix (TASK-9010); a scope-change naming a different or prefix-sharing id; a
// Log entry that mentions the id and the word scope-change in prose under another event; a
// CRLF (core.autocrlf) working tree, where a member reached only by its stamp must still be read.

import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync, appendFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const FIX = fileURLToPath(new URL("fixtures/by-reference/", import.meta.url));
const CHECKER = fileURLToPath(new URL("../scripts/lib/check-sprint-by-reference.ts", import.meta.url));
const SPRINT = "docs/sprint/SPRINT-901-fixture.md";
const LOG = "docs/sprint/logs/SPRINT-901-fixture.md";
const T901 = "TASK-901-alpha.md";
const T902 = "TASK-902-beta.md";

let pass = 0;
let fail = 0;

function git(dir: string, args: string[]): string {
  return execFileSync("git", args, { cwd: dir, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
}
function fix(name: string): string {
  // LF regardless of how this checkout smudged the fixture (core.autocrlf); CRLF is its own case.
  return readFileSync(join(FIX, name), "utf8").replace(/\r\n/g, "\n");
}
function put(dir: string, rel: string, content: string) {
  mkdirSync(dirname(join(dir, rel)), { recursive: true });
  writeFileSync(join(dir, rel), content);
}
function edit(dir: string, rel: string, from: string, to: string) {
  const p = join(dir, rel);
  const before = readFileSync(p, "utf8");
  const after = before.replace(from, to);
  if (after === before) throw new Error(`fixture edit did not land in ${rel}: "${from}"`);
  writeFileSync(p, after);
}
function mv(dir: string, from: string, to: string) {
  mkdirSync(join(dir, dirname(to)), { recursive: true });
  git(dir, ["mv", from, to]);
  git(dir, ["commit", "-q", "-m", `move ${from} -> ${to}`]); // own commit (D6)
}
function commit(dir: string, msg: string) {
  git(dir, ["add", "-A"]);
  git(dir, ["commit", "-q", "--allow-empty", "-m", msg]);
}
function logEntry(dir: string, event: string, summary: string, body: string) {
  appendFileSync(join(dir, LOG), `\n### 2026-09-25 | ${event} | ${summary}\n${body}\n`);
}
const W = (folder: string, f: string) => `docs/work/${folder}/${f}`;
function crlf(dir: string, rel: string) {
  const p = join(dir, rel);
  writeFileSync(p, readFileSync(p, "utf8").replace(/\r?\n/g, "\r\n"));
}

interface Opts {
  noPlanCommit?: boolean;
  extraStampedUnlisted?: boolean; // TASK-903 stamped sprint: SPRINT-901 at promote, absent from Members
  noMembers?: boolean;
}

function build(o: Opts = {}): string {
  const dir = mkdtempSync(join(tmpdir(), "by-reference-"));
  git(dir, ["init", "-q"]);
  git(dir, ["config", "user.email", "fixture@example.com"]);
  git(dir, ["config", "user.name", "Fixture Bot"]);
  git(dir, ["config", "core.autocrlf", "false"]); // stored bytes = fixture bytes; CRLF is a case, not ambient
  let sprint = fix("SPRINT-901-fixture.md");
  if (o.noMembers) sprint = sprint.replace(/- docs\/work\/todo\/TASK-90[12]-[a-z]+\.md\n/g, "");
  put(dir, SPRINT, sprint);
  put(dir, LOG, fix("log-SPRINT-901-fixture.md"));
  const stamp = (s: string) => (o.noMembers ? s.replace("sprint: SPRINT-901\n", "") : s);
  put(dir, W("todo", T901), stamp(fix(T901)));
  put(dir, W("todo", T902), stamp(fix(T902)));
  if (o.extraStampedUnlisted) {
    put(dir, W("todo", "TASK-903-gamma.md"), fix(T901).replace(/TASK-901/g, "TASK-903").replace(/alpha/g, "gamma"));
  }
  put(dir, W("backlog", "TASK-9010-other.md"), fix(T902).replace(/TASK-902/g, "TASK-9010").replace("sprint: SPRINT-901\n", ""));
  commit(dir, "sprint(901): stamp sprint: on members");
  if (!o.noPlanCommit) {
    const pc = git(dir, ["rev-parse", "--short", "HEAD"]).trim();
    edit(dir, SPRINT, "plan_commit: PLAN_COMMIT", `plan_commit: ${pc}`);
    commit(dir, "sprint(901): record plan_commit");
  }
  return dir;
}

function run(dir: string, close: boolean): { findings: string[]; verdict: string; exit: number } {
  const args = [CHECKER, join(dir, SPRINT)];
  if (close) args.push("--close");
  const r = spawnSync("bun", args, { encoding: "utf8" });
  const lines = (r.stdout ?? "").split(/\r?\n/);
  const findings = lines.filter((l) => l.startsWith("FAIL  ")).map((l) => l.slice(6).split(" -- ")[0]!.trim());
  const verdict = lines.find((l) => l.startsWith("check-sprint-by-reference: ")) ?? "(no verdict line)";
  return { findings: findings.sort(), verdict, exit: r.status ?? -1 };
}

interface Case {
  name: string;
  opts?: Opts;
  close?: boolean;
  mutate: (dir: string) => void;
  expect: string[];
}

const TICK_901 = (dir: string, rel: string) => {
  edit(dir, rel, "- [ ] alpha returns", "- [x] alpha returns");
  edit(dir, rel, "for every input in the table", "for every input in the table ✓ `abc1234` — 12/0");
  edit(dir, rel, "- [ ] a retained fixture", "- [X] a retained fixture");
};
const EDIT_901 = (dir: string, rel: string) =>
  edit(dir, rel, "- [ ] a retained fixture covers the empty input", "- [ ] a retained fixture covers the empty input\n- [ ] a benchmark stays under 5ms");

const CASES: Case[] = [
  // --- freeze: must-PASS controls -----------------------------------------------------------
  { name: "clean", mutate: () => {}, expect: [] },
  {
    name: "tick-only (ticks + ✓ evidence suffix are not an edit)",
    mutate: (d) => {
      TICK_901(d, W("todo", T901));
      edit(d, W("todo", T902), "- [ ] beta", "- [x] beta");
      commit(d, "tick");
    },
    expect: [],
  },
  {
    name: "tick-and-reword (must-FAIL sibling of tick-only)",
    mutate: (d) => {
      TICK_901(d, W("todo", T901));
      edit(d, W("todo", T901), "the empty input", "the empty and null input");
      commit(d, "tick + reword");
    },
    expect: ["FREEZE-EDIT TASK-901"],
  },
  {
    name: "amended-section-outside-done-when",
    mutate: (d) => {
      edit(d, W("todo", T901), "## Touches", "## Amended 2026-09-25\n\n- clarified: the table is the one in the README\n\n## Touches");
      commit(d, "amend");
    },
    expect: [],
  },
  {
    name: "amendment-inside-done-when (must-FAIL sibling)",
    mutate: (d) => {
      edit(d, W("todo", T901), "covers the empty input\n", "covers the empty input\n- clarified: the table is the one in the README\n");
      commit(d, "amend inside");
    },
    expect: ["FREEZE-EDIT TASK-901"],
  },
  {
    // A core.autocrlf=true checkout (this repo's Windows default) smudges every file to CRLF while
    // the plan_commit blobs stay LF: frontmatter, sections and the Log must all still parse.
    name: "crlf-working-tree (line endings are not an edit)",
    mutate: (d) => {
      for (const rel of [SPRINT, LOG, W("todo", T901), W("todo", T902)]) crlf(d, rel);
    },
    expect: [],
  },
  {
    name: "crlf-stamped-not-listed-edited (must-FAIL: a CRLF stamp still selects the member)",
    opts: { extraStampedUnlisted: true },
    mutate: (d) => {
      edit(d, W("todo", "TASK-903-gamma.md"), "the empty input", "the empty and null input");
      crlf(d, W("todo", "TASK-903-gamma.md"));
    },
    expect: ["FREEZE-EDIT TASK-903"],
  },
  // --- freeze: must-FAIL + the scope-change lookup ---------------------------------------------
  {
    name: "unlogged-edit (must-FAIL: FREEZE-EDIT)",
    mutate: (d) => {
      EDIT_901(d, W("todo", T901));
      commit(d, "edit");
    },
    expect: ["FREEZE-EDIT TASK-901"],
  },
  {
    name: "edit-covered-by-scope-change",
    mutate: (d) => {
      EDIT_901(d, W("todo", T901));
      logEntry(d, "scope-change", "T1 gains a perf bar", "What broke: TASK-901 needs a benchmark. Impact: T1 stays S. G2 re-confirmed.");
      commit(d, "edit + scope-change");
    },
    expect: [],
  },
  {
    name: "scope-change-names-other-id (must-FAIL)",
    mutate: (d) => {
      EDIT_901(d, W("todo", T901));
      logEntry(d, "scope-change", "T2 gains a perf bar", "What broke: TASK-902 needs a benchmark. G2 re-confirmed.");
      commit(d, "edit + wrong scope-change");
    },
    expect: ["FREEZE-EDIT TASK-901"],
  },
  {
    name: "scope-change-names-prefix-sharing-id (must-FAIL: TASK-9010 is not TASK-901)",
    mutate: (d) => {
      EDIT_901(d, W("todo", T901));
      logEntry(d, "scope-change", "backlog item widened", "What broke: TASK-9010 widened. G2 re-confirmed.");
      commit(d, "edit + prefix scope-change");
    },
    expect: ["FREEZE-EDIT TASK-901"],
  },
  {
    name: "prose-mention-under-other-event (must-FAIL)",
    mutate: (d) => {
      EDIT_901(d, W("todo", T901));
      logEntry(d, "gate", "G2 signed", "- **scope-change (T1):** TASK-901 gains a benchmark -- recorded in prose only.");
      commit(d, "edit + prose mention");
    },
    expect: ["FREEZE-EDIT TASK-901"],
  },
  // --- selection: which members are examined, and where they are found -------------------------
  {
    name: "member-moved-folders-then-edited (must-FAIL: resolved by id across moves)",
    mutate: (d) => {
      mv(d, W("todo", T901), W("in_progress", T901));
      mv(d, W("in_progress", T901), W("done", T901));
      EDIT_901(d, W("done", T901));
      commit(d, "edit after moves");
    },
    expect: ["FREEZE-EDIT TASK-901"],
  },
  {
    name: "stamped-not-listed-edited (must-FAIL: selected by the sprint: arm)",
    opts: { extraStampedUnlisted: true },
    mutate: (d) => {
      edit(d, W("todo", "TASK-903-gamma.md"), "the empty input", "the empty and null input");
      commit(d, "edit 903");
    },
    expect: ["FREEZE-EDIT TASK-903"],
  },
  {
    name: "stamped-not-listed-clean (sibling control)",
    opts: { extraStampedUnlisted: true },
    mutate: () => {},
    expect: [],
  },
  {
    name: "listed-but-unstamped-edited (must-FAIL: selected by the Members arm)",
    mutate: (d) => {
      edit(d, W("todo", T902), "sprint: SPRINT-901\n", "");
      edit(d, W("todo", T902), "unchanged", "unchanged, logged");
      commit(d, "unstamp + edit 902");
    },
    expect: ["FREEZE-EDIT TASK-902"],
  },
  {
    name: "prefix-neighbour-non-member-edited (sibling control: TASK-9010 is not selected)",
    mutate: (d) => {
      edit(d, W("backlog", "TASK-9010-other.md"), "unchanged", "changed");
      commit(d, "edit non-member");
    },
    expect: [],
  },
  // --- MEMBER-MISSING --------------------------------------------------------------------------
  {
    name: "member-deleted-now (must-FAIL: MEMBER-MISSING)",
    mutate: (d) => {
      git(d, ["rm", "-q", W("todo", T902)]);
      commit(d, "delete 902");
    },
    expect: ["MEMBER-MISSING TASK-902"],
  },
  {
    name: "member-absent-at-plan-commit (must-FAIL: MEMBER-MISSING)",
    mutate: (d) => {
      put(d, W("todo", "TASK-904-delta.md"), fix(T902).replace(/TASK-902/g, "TASK-904"));
      edit(d, SPRINT, "- docs/work/todo/TASK-902-beta.md\n", "- docs/work/todo/TASK-902-beta.md\n- docs/work/todo/TASK-904-delta.md\n");
      commit(d, "add 904 after promote");
    },
    expect: ["MEMBER-MISSING TASK-904"],
  },
  // --- guards: a check with nothing to check is not a pass -------------------------------------
  { name: "no-plan-commit (must-FAIL guard)", opts: { noPlanCommit: true }, mutate: () => {}, expect: ["NO-PLAN-COMMIT"] },
  { name: "no-members (must-FAIL guard)", opts: { noMembers: true }, mutate: () => {}, expect: ["NO-MEMBERS"] },
  // --- close ------------------------------------------------------------------------------------
  {
    name: "close-all-closed (moved todo -> in_progress -> review -> done, and -> cancel)",
    close: true,
    mutate: (d) => {
      mv(d, W("todo", T901), W("in_progress", T901));
      mv(d, W("in_progress", T901), W("review", T901));
      mv(d, W("review", T901), W("done", T901));
      TICK_901(d, W("done", T901));
      commit(d, "tick 901");
      mv(d, W("todo", T902), W("cancel", T902));
    },
    expect: [],
  },
  {
    name: "close-member-in-progress (must-FAIL: CLOSE-OPEN)",
    close: true,
    mutate: (d) => {
      mv(d, W("todo", T901), W("in_progress", T901));
      mv(d, W("todo", T902), W("done", T902));
    },
    expect: ["CLOSE-OPEN TASK-901"],
  },
  {
    name: "close-member-in-review (must-FAIL: CLOSE-OPEN)",
    close: true,
    mutate: (d) => {
      mv(d, W("todo", T901), W("review", T901));
      mv(d, W("todo", T902), W("done", T902));
    },
    expect: ["CLOSE-OPEN TASK-901"],
  },
  {
    name: "close-ignores-plan-boxes (Plan carries a ticked copy; members open)",
    close: true,
    mutate: (d) => {
      edit(d, SPRINT, "**Acceptance:** alpha works.", "**Acceptance:** alpha works.\n\n**DoD:**\n- [x] alpha done");
      mv(d, W("todo", T902), W("done", T902));
    },
    expect: ["CLOSE-OPEN TASK-901"],
  },
];

for (const c of CASES) {
  const dir = build(c.opts);
  try {
    c.mutate(dir);
    const r = run(dir, c.close ?? false);
    const expect = [...c.expect].sort();
    const setOk = JSON.stringify(r.findings) === JSON.stringify(expect);
    const m = r.verdict.match(/: (\d+) pass, (\d+) fail$/);
    const verdictOk = m !== null && Number(m[2]) === expect.length && (r.exit === 0) === (expect.length === 0);
    const good = setOk && verdictOk;
    console.log(
      `${good ? "PASS" : "FAIL"}  by-reference-fixture: ${c.name} -- expected [${expect.join(", ")}] got [${r.findings.join(", ")}]; checker said "${r.verdict}" (exit ${r.exit})`,
    );
    good ? pass++ : fail++;
  } catch (e) {
    console.log(`FAIL  by-reference-fixture: ${c.name} -- harness error: ${(e as Error).message.split("\n")[0]}`);
    fail++;
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

console.log(`by-reference-fixtures: ${pass} pass, ${fail} fail`);
process.exit(fail > 0 ? 1 : 0);
