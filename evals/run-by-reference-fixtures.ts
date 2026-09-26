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
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmdirSync, rmSync, symlinkSync, writeFileSync, appendFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, join } from "node:path";
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
  pre?: (dir: string) => void; // shapes the tree BEFORE the promote commit (what plan_commit freezes)
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
  git(dir, ["config", "commit.gpgsign", "false"]); // a host's signing setup is not the fixture's (and fails at volume)
  put(dir, "README.md", "fixture repo\n");
  commit(dir, "base -- before the sprint exists"); // a commit without the Plan: PLAN-COMMIT-NO-PLAN's target
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
  o.pre?.(dir);
  commit(dir, "sprint(901): stamp sprint: on members");
  if (!o.noPlanCommit) {
    const pc = git(dir, ["rev-parse", "--short", "HEAD"]).trim();
    edit(dir, SPRINT, "plan_commit: PLAN_COMMIT", `plan_commit: ${pc}`);
    commit(dir, "sprint(901): record plan_commit");
  }
  return dir;
}

function run(dir: string, close: boolean, sprint = SPRINT): { findings: string[]; verdict: string; exit: number } {
  const args = [CHECKER, join(dir, sprint)];
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
  sprint?: string; // where the sprint file is at check time, when a case moves it
  mutate: (dir: string) => void;
  expect: string[];
}

const TICK_901 = (dir: string, rel: string) => {
  edit(dir, rel, "- [ ] alpha returns", "- [x] alpha returns");
  edit(dir, rel, "for every input in the table", "for every input in the table ✓ `abc1234` — 12/0");
  edit(dir, rel, "- [ ] a retained fixture", "- [X] a retained fixture");
};
const ARCH = "docs/sprint/archive/SPRINT-901-fixture.md";
const ARCH_LOG = "docs/sprint/archive/logs/SPRINT-901-fixture.md";
const archive = (d: string, withLog = true) => {
  mv(d, SPRINT, ARCH); // the §11 archival pass: git mv, own commit
  if (withLog) mv(d, LOG, ARCH_LOG);
};
const INLINE = (d: string, body: string) => edit(d, SPRINT, "## Files Changed", `${body}\n\n## Files Changed`);
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
    name: "listed-at-promote-without-a-file (must-FAIL: MEMBER-MISSING at plan_commit)",
    opts: { pre: (d) => edit(d, SPRINT, "- docs/work/todo/TASK-902-beta.md\n", "- docs/work/todo/TASK-902-beta.md\n- docs/work/todo/TASK-906-ghost.md\n") },
    mutate: () => {},
    expect: ["MEMBER-MISSING TASK-906"],
  },
  // --- population across time: dropped and added members (review round 1, major 1 + G2 ruling) -
  {
    name: "dropped-from-both-indices-then-edited (must-FAIL: MEMBER-DROPPED)",
    close: true,
    mutate: (d) => {
      edit(d, SPRINT, "- docs/work/todo/TASK-902-beta.md\n", "");
      edit(d, W("todo", T902), "sprint: SPRINT-901\n", "");
      edit(d, W("todo", T902), "unchanged", "unchanged, and faster");
      mv(d, W("todo", T901), W("done", T901));
      commit(d, "drop 902 silently");
    },
    expect: ["MEMBER-DROPPED TASK-902"],
  },
  {
    name: "scoped-out-with-scope-change (sibling control)",
    close: true,
    mutate: (d) => {
      edit(d, SPRINT, "- docs/work/todo/TASK-902-beta.md\n", "");
      edit(d, W("todo", T902), "sprint: SPRINT-901\n", "");
      logEntry(d, "scope-change", "beta leaves the sprint", "What broke: TASK-902 is blocked upstream. Impact: T2 out.");
      mv(d, W("todo", T901), W("done", T901));
      commit(d, "scope 902 out");
    },
    expect: [],
  },
  {
    name: "added-after-promote-unlogged (must-FAIL: MEMBER-UNPLANNED)",
    mutate: (d) => {
      put(d, W("todo", "TASK-904-delta.md"), fix(T902).replace(/TASK-902/g, "TASK-904"));
      edit(d, SPRINT, "- docs/work/todo/TASK-902-beta.md\n", "- docs/work/todo/TASK-902-beta.md\n- docs/work/todo/TASK-904-delta.md\n");
      commit(d, "add 904 after promote");
    },
    expect: ["MEMBER-UNPLANNED TASK-904"],
  },
  {
    name: "added-after-promote-admitted (sibling control: baseline = the stamping commit)",
    mutate: (d) => {
      put(d, W("todo", "TASK-904-delta.md"), fix(T902).replace(/TASK-902/g, "TASK-904"));
      logEntry(d, "scope-change", "delta joins", "What broke: TASK-904 is needed by T2. G2 re-confirmed.");
      commit(d, "admit 904");
      edit(d, W("todo", "TASK-904-delta.md"), "- [ ] beta", "- [x] beta");
      commit(d, "tick 904");
    },
    expect: [],
  },
  {
    name: "added-admitted-then-edited-unlogged (must-FAIL: the admitting entry predates the edit's baseline)",
    mutate: (d) => {
      put(d, W("todo", "TASK-904-delta.md"), fix(T902).replace(/TASK-902/g, "TASK-904"));
      logEntry(d, "scope-change", "delta joins", "What broke: TASK-904 is needed by T2. G2 re-confirmed.");
      commit(d, "admit 904");
      edit(d, W("todo", "TASK-904-delta.md"), "unchanged", "unchanged, and faster");
      commit(d, "edit 904");
    },
    expect: ["FREEZE-EDIT TASK-904"],
  },
  // --- the freeze point (review round 1, major 2) ----------------------------------------------
  {
    name: "scope-change-predates-promote (must-FAIL: only entries new since plan_commit count)",
    opts: { pre: (d) => logEntry(d, "scope-change", "early widening", "TASK-901 may gain a benchmark later.") },
    mutate: (d) => {
      EDIT_901(d, W("todo", T901));
      commit(d, "edit");
    },
    expect: ["FREEZE-EDIT TASK-901"],
  },
  {
    name: "plan-commit-re-pointed-to-head (must-FAIL: PLAN-COMMIT-LATE)",
    mutate: (d) => {
      EDIT_901(d, W("todo", T901));
      commit(d, "edit");
      const head = git(d, ["rev-parse", "--short", "HEAD"]).trim();
      const pc = (readFileSync(join(d, SPRINT), "utf8").match(/^plan_commit: (\S+)$/m) ?? [])[1]!;
      edit(d, SPRINT, `plan_commit: ${pc}`, `plan_commit: ${head}`);
      commit(d, "re-point plan_commit");
    },
    expect: ["PLAN-COMMIT-LATE"],
  },
  {
    name: "plan-commit-repaired-to-earlier (sibling control: SPRINT-107's own slip)",
    mutate: (d) => {
      const pc = (readFileSync(join(d, SPRINT), "utf8").match(/^plan_commit: (\S+)$/m) ?? [])[1]!;
      // history rewritten in place: the first recording pointed at the base commit, a repair points back at pc
      const base = git(d, ["rev-list", "--max-parents=0", "HEAD"]).trim().slice(0, 7);
      edit(d, SPRINT, `plan_commit: ${pc}`, `plan_commit: ${base}`);
      commit(d, "slip");
      edit(d, SPRINT, `plan_commit: ${base}`, `plan_commit: ${pc}`);
      commit(d, "repair");
    },
    expect: [],
  },
  {
    name: "plan-commit-before-the-plan (must-FAIL: PLAN-COMMIT-NO-PLAN)",
    mutate: (d) => {
      const pc = (readFileSync(join(d, SPRINT), "utf8").match(/^plan_commit: (\S+)$/m) ?? [])[1]!;
      const base = git(d, ["rev-list", "--max-parents=0", "HEAD"]).trim().slice(0, 7);
      edit(d, SPRINT, `plan_commit: ${pc}`, `plan_commit: ${base}`);
      commit(d, "point before the plan");
    },
    expect: ["PLAN-COMMIT-NO-PLAN"],
  },
  {
    name: "plan-commit-not-an-ancestor (must-FAIL: PLAN-COMMIT-NOT-ANCESTOR)",
    mutate: (d) => {
      const pc = (readFileSync(join(d, SPRINT), "utf8").match(/^plan_commit: (\S+)$/m) ?? [])[1]!;
      const main = git(d, ["rev-parse", "--abbrev-ref", "HEAD"]).trim();
      git(d, ["checkout", "-q", "-b", "side"]);
      put(d, "side.txt", "x\n");
      commit(d, "side");
      const side = git(d, ["rev-parse", "--short", "HEAD"]).trim();
      git(d, ["checkout", "-q", main]);
      edit(d, SPRINT, `plan_commit: ${pc}`, `plan_commit: ${side}`);
      commit(d, "point at a side branch");
    },
    expect: ["PLAN-COMMIT-NOT-ANCESTOR"],
  },
  {
    name: "plan-commit-never-committed (must-FAIL: PLAN-COMMIT-UNRECORDED)",
    opts: { noPlanCommit: true },
    mutate: (d) => {
      const head = git(d, ["rev-parse", "--short", "HEAD"]).trim();
      edit(d, SPRINT, "plan_commit: PLAN_COMMIT", `plan_commit: ${head}`); // on disk only
    },
    expect: ["PLAN-COMMIT-UNRECORDED"],
  },
  // --- section and log parsing (review round 1, minors) ----------------------------------------
  {
    name: "no-done-when-on-either-side (must-FAIL: NO-DONE-WHEN, never a vacuous pass)",
    opts: { pre: (d) => edit(d, W("todo", T902), "## Done when", "## Outcome") },
    mutate: () => {},
    expect: ["NO-DONE-WHEN TASK-902"],
  },
  {
    name: "empty-done-when-on-either-side (must-FAIL: NO-DONE-WHEN, a heading with no body is not a DoD)",
    opts: { pre: (d) => edit(d, W("todo", T902), "- [ ] beta consumes alpha's output unchanged\n", "") },
    mutate: () => {},
    expect: ["NO-DONE-WHEN TASK-902"],
  },
  {
    name: "done-when-heading-removed-now (must-FAIL: NO-DONE-WHEN)",
    mutate: (d) => {
      edit(d, W("todo", T902), "## Done when", "## Done");
      commit(d, "rename heading");
    },
    expect: ["NO-DONE-WHEN TASK-902"],
  },
  {
    name: "second-done-when-section-edited (must-FAIL: every ## Done when is read)",
    opts: { pre: (d) => edit(d, W("todo", T902), "## Tracker", "## Done when\n\n- [ ] beta is documented\n\n## Tracker") },
    mutate: (d) => {
      edit(d, W("todo", T902), "beta is documented", "beta is documented and benchmarked");
      commit(d, "edit second section");
    },
    expect: ["FREEZE-EDIT TASK-902"],
  },
  {
    name: "edit-below-a-fenced-heading (must-FAIL: a fenced ## does not end the section)",
    opts: {
      pre: (d) =>
        edit(d, W("todo", T902), "- [ ] beta consumes", "```md\n## sample output\n```\n- [ ] beta prints the sample\n- [ ] beta consumes"),
    },
    mutate: (d) => {
      edit(d, W("todo", T902), "unchanged", "unchanged, and faster");
      commit(d, "edit below fence");
    },
    expect: ["FREEZE-EDIT TASK-902"],
  },
  {
    name: "last-scope-change-does-not-swallow-the-tail (must-FAIL)",
    mutate: (d) => {
      EDIT_901(d, W("todo", T901));
      logEntry(d, "scope-change", "beta widened", "TASK-902 widened.");
      appendFileSync(join(d, LOG), "\n## Notes\n\nTASK-901 may need a benchmark.\n");
      commit(d, "edit + tail");
    },
    expect: ["FREEZE-EDIT TASK-901"],
  },
  {
    name: "scope-change-heading-without-summary (must-PASS)",
    mutate: (d) => {
      EDIT_901(d, W("todo", T901));
      appendFileSync(join(d, LOG), "\n### 2026-09-25 | scope-change\nTASK-901 gains a benchmark.\n");
      commit(d, "edit + bare heading");
    },
    expect: [],
  },
  {
    name: "scope-change-in-inline-log (must-PASS: a sprint file's own ## Execution Log is read)",
    mutate: (d) => {
      EDIT_901(d, W("todo", T901));
      edit(d, SPRINT, "## Files Changed", "### 2026-09-25 | scope-change | alpha gains a bar\nTASK-901 gains a benchmark.\n\n## Files Changed");
      commit(d, "edit + inline entry");
    },
    expect: [],
  },
  {
    name: "scope-change-names-Tn (must-PASS: T1 Cites TASK-901 in the frozen Plan)",
    mutate: (d) => {
      EDIT_901(d, W("todo", T901));
      logEntry(d, "scope-change", "T1 gains a perf bar", "What broke: alpha needs a benchmark. G2 re-confirmed.");
      commit(d, "edit + Tn entry");
    },
    expect: [],
  },
  {
    name: "scope-change-names-other-Tn (must-FAIL: T2 Cites only TASK-902)",
    mutate: (d) => {
      EDIT_901(d, W("todo", T901));
      logEntry(d, "scope-change", "T2 gains a perf bar", "What broke: beta needs a benchmark.");
      commit(d, "edit + other Tn");
    },
    expect: ["FREEZE-EDIT TASK-901"],
  },
  {
    name: "in-text-check-mark-ticked-bare (must-PASS: a ✓ already in the frozen text is text, not evidence)",
    opts: { pre: (d) => edit(d, W("todo", T901), "- [ ] alpha returns", "- [ ] alpha shows the ✓ icon\n- [ ] alpha returns") },
    mutate: (d) => {
      edit(d, W("todo", T901), "- [ ] alpha shows the ✓ icon", "- [x] alpha shows the ✓ icon");
      commit(d, "tick bare");
    },
    expect: [],
  },
  {
    name: "plus-bullets-ticked (must-PASS: + is a list marker)",
    opts: { pre: (d) => edit(d, W("todo", T901), "- [ ] alpha returns", "+ [ ] alpha returns") },
    mutate: (d) => {
      edit(d, W("todo", T901), "+ [ ] alpha returns", "+ [x] alpha returns");
      commit(d, "tick +");
    },
    expect: [],
  },
  {
    name: "blank-line-between-boxes (must-PASS: blank lines are layout)",
    mutate: (d) => {
      edit(d, W("todo", T901), "for every input in the table\n", "for every input in the table\n\n");
      commit(d, "blank line");
    },
    expect: [],
  },
  // --- round 2: where the sprint lives, when it was recorded, what the log may count ----------
  {
    name: "archived-pre-promote-entry-then-edited (must-FAIL: the log is read at its path AT the baseline)",
    sprint: ARCH,
    opts: { pre: (d) => logEntry(d, "scope-change", "early widening", "TASK-901 may gain a benchmark later.") },
    mutate: (d) => {
      EDIT_901(d, W("todo", T901));
      commit(d, "edit");
      archive(d);
    },
    expect: ["FREEZE-EDIT TASK-901"],
  },
  {
    name: "archived-added-unstamped-member-edited (must-FAIL: Members read at its path AT each commit)",
    sprint: ARCH,
    mutate: (d) => {
      put(d, W("todo", "TASK-903-gamma.md"), fix(T902).replace(/TASK-902/g, "TASK-903").replace("sprint: SPRINT-901\n", ""));
      edit(d, SPRINT, "- docs/work/todo/TASK-902-beta.md\n", "- docs/work/todo/TASK-902-beta.md\n- docs/work/todo/TASK-903-gamma.md\n");
      INLINE(d, "### 2026-09-25 | scope-change | admit TASK-903\nNeeded by T2.");
      commit(d, "admit 903");
      edit(d, W("todo", "TASK-903-gamma.md"), "unchanged", "changed");
      commit(d, "edit 903");
      archive(d, false);
    },
    expect: ["FREEZE-EDIT TASK-903"],
  },
  {
    name: "archived-clean-close (sibling control: archiving is not an edit)",
    sprint: ARCH,
    close: true,
    mutate: (d) => {
      mv(d, W("todo", T901), W("done", T901));
      mv(d, W("todo", T902), W("done", T902));
      archive(d);
    },
    expect: [],
  },
  {
    name: "renamed-sprint-file (must-PASS: history is followed across a rename)",
    sprint: "docs/sprint/SPRINT-901-renamed.md",
    mutate: (d) => {
      mv(d, SPRINT, "docs/sprint/SPRINT-901-renamed.md");
      mv(d, LOG, "docs/sprint/logs/SPRINT-901-renamed.md");
    },
    expect: [],
  },
  {
    name: "plan-commit-recorded-late (must-FAIL: PLAN-COMMIT-LATE -- the promote had already stamped and activated)",
    opts: { noPlanCommit: true },
    mutate: (d) => {
      EDIT_901(d, W("todo", T901));
      commit(d, "edit before recording");
      const head = git(d, ["rev-parse", "--short", "HEAD"]).trim();
      edit(d, SPRINT, "plan_commit: PLAN_COMMIT", `plan_commit: ${head}`);
      commit(d, "record late");
    },
    expect: ["PLAN-COMMIT-LATE"],
  },
  {
    name: "old-entry-reworded (must-FAIL: LOG-REWRITTEN, and the rewrite excuses nothing)",
    opts: { pre: (d) => logEntry(d, "scope-change", "beta widened", "TASK-902 widened.") },
    mutate: (d) => {
      edit(d, LOG, "TASK-902 widened.", "TASK-902 widened; TASK-901 gains a benchmark.");
      EDIT_901(d, W("todo", T901));
      commit(d, "reword + edit");
    },
    expect: ["FREEZE-EDIT TASK-901", "LOG-REWRITTEN"],
  },
  {
    name: "paragraph-appended-under-old-entry (must-FAIL: only NEW entries count)",
    opts: { pre: (d) => logEntry(d, "scope-change", "beta widened", "TASK-902 widened.") },
    mutate: (d) => {
      appendFileSync(join(d, LOG), "TASK-901 gains a benchmark too.\n");
      EDIT_901(d, W("todo", T901));
      commit(d, "append under old + edit");
    },
    expect: ["FREEZE-EDIT TASK-901"],
  },
  {
    name: "scope-change-inside-html-comment (must-FAIL: a commented-out entry is not an entry)",
    mutate: (d) => {
      appendFileSync(join(d, LOG), "\n<!--\n### 2026-09-25 | scope-change | draft\nTASK-901 gains a benchmark.\n-->\n");
      EDIT_901(d, W("todo", T901));
      commit(d, "commented entry + edit");
    },
    expect: ["FREEZE-EDIT TASK-901"],
  },
  {
    name: "Tn-only-in-body (must-FAIL: a Tn counts only in the heading)",
    mutate: (d) => {
      logEntry(d, "scope-change", "perf bar added", "Carried from the T1 review.");
      EDIT_901(d, W("todo", T901));
      commit(d, "body Tn + edit");
    },
    expect: ["FREEZE-EDIT TASK-901"],
  },
  {
    name: "nested-member-folder-edited (must-FAIL: the working tree is walked as deep as the commit trees)",
    mutate: (d) => {
      mv(d, W("todo", T901), W("done/2026", T901));
      EDIT_901(d, W("done/2026", T901));
      commit(d, "edit nested");
    },
    expect: ["FREEZE-EDIT TASK-901"],
  },
  {
    name: "nested-member-folder-clean-close (sibling control)",
    close: true,
    mutate: (d) => {
      mv(d, W("todo", T901), W("done/2026", T901));
      mv(d, W("todo", T902), W("done", T902));
    },
    expect: [],
  },
  {
    name: "edit-merged-from-side-branch (must-FAIL: non-linear history)",
    mutate: (d) => {
      const main = git(d, ["rev-parse", "--abbrev-ref", "HEAD"]).trim();
      git(d, ["checkout", "-q", "-b", "side"]);
      EDIT_901(d, W("todo", T901));
      commit(d, "edit on side");
      git(d, ["checkout", "-q", main]);
      git(d, ["merge", "-q", "--no-ff", "-m", "merge side", "side"]);
    },
    expect: ["FREEZE-EDIT TASK-901"],
  },
  // --- round 3: the legitimate direction after the log moves, and log metadata -----------------
  {
    name: "archived-pair-logged-edit (must-PASS: a scope-change is still found after archiving)",
    sprint: ARCH,
    mutate: (d) => {
      EDIT_901(d, W("todo", T901));
      logEntry(d, "scope-change", "alpha gains a bar", "TASK-901 gains a benchmark.");
      commit(d, "edit + entry");
      archive(d);
    },
    expect: [],
  },
  {
    name: "renamed-sprint-log-not-renamed-logged-edit (must-PASS: the log is found by its frontmatter)",
    sprint: "docs/sprint/SPRINT-901-renamed.md",
    mutate: (d) => {
      EDIT_901(d, W("todo", T901));
      logEntry(d, "scope-change", "alpha gains a bar", "TASK-901 gains a benchmark.");
      commit(d, "edit + entry");
      mv(d, SPRINT, "docs/sprint/SPRINT-901-renamed.md");
    },
    expect: [],
  },
  {
    name: "log-created-after-promote-logged-edit (must-PASS)",
    opts: { pre: (d) => rmSync(join(d, LOG)) },
    mutate: (d) => {
      put(d, LOG, fix("log-SPRINT-901-fixture.md"));
      logEntry(d, "scope-change", "alpha gains a bar", "TASK-901 gains a benchmark.");
      EDIT_901(d, W("todo", T901));
      commit(d, "log + entry + edit");
    },
    expect: [],
  },
  {
    name: "log-created-after-promote-unlogged-edit (must-FAIL sibling)",
    opts: { pre: (d) => rmSync(join(d, LOG)) },
    mutate: (d) => {
      put(d, LOG, fix("log-SPRINT-901-fixture.md"));
      EDIT_901(d, W("todo", T901));
      commit(d, "log + edit");
    },
    expect: ["FREEZE-EDIT TASK-901"],
  },
  {
    name: "log-frontmatter-bumped-logged-edit (must-PASS: last_updated is metadata, not a past entry)",
    mutate: (d) => {
      edit(d, LOG, "last_updated: 2026-09-24", "last_updated: 2026-09-25");
      logEntry(d, "scope-change", "alpha gains a bar", "TASK-901 gains a benchmark.");
      EDIT_901(d, W("todo", T901));
      commit(d, "bump + entry + edit");
    },
    expect: [],
  },
  {
    name: "comment-opened-before-promote-hides-later-entry (must-FAIL)",
    opts: { pre: (d) => appendFileSync(join(d, LOG), "\n<!-- draft note\n") },
    mutate: (d) => {
      appendFileSync(join(d, LOG), "### 2026-09-25 | scope-change | TASK-901 gains a bar\n-->\n");
      EDIT_901(d, W("todo", T901));
      commit(d, "entry inside an old comment + edit");
    },
    expect: ["FREEZE-EDIT TASK-901"],
  },
  // --- selection: stamp and Members shapes (review round 1, minors) -----------------------------
  ...[
    ["quoted", 'sprint: "SPRINT-901"'],
    ["comment", "sprint: SPRINT-901 # promoted 2026-09-24"],
    ["bare-number", "sprint: 901"],
    ["bom", "sprint: SPRINT-901", true],
  ].map(([shape, stamp, bom]) => ({
    name: `stamp-shape-${shape}-not-listed-edited (must-FAIL: the stamp still selects TASK-903)`,
    opts: {
      pre: (d: string) => {
        const t = fix(T901).replace(/TASK-901/g, "TASK-903").replace(/alpha/g, "gamma").replace("sprint: SPRINT-901", stamp as string);
        put(d, W("todo", "TASK-903-gamma.md"), (bom ? "\uFEFF" : "") + t);
      },
    },
    mutate: (d: string) => {
      edit(d, W("todo", "TASK-903-gamma.md"), "the empty input", "the empty and null input");
      commit(d, "edit 903");
    },
    expect: ["FREEZE-EDIT TASK-903"],
  })),
  {
    name: "members-table-and-multi-id-lines-unstamped-edited (must-FAIL: every id in ## Members selects)",
    opts: {
      pre: (d) => {
        for (const id of ["TASK-903", "TASK-907"]) {
          put(d, W("todo", `${id}-x.md`), fix(T902).replace(/TASK-902/g, id).replace("sprint: SPRINT-901\n", ""));
        }
        edit(d, SPRINT, "- docs/work/todo/TASK-902-beta.md\n", "- docs/work/todo/TASK-902-beta.md\n\n| id | file |\n|---|---|\n| TASK-903 | x |\n\n- also: TASK-901 · TASK-907\n");
      },
    },
    mutate: (d) => {
      edit(d, W("todo", "TASK-903-x.md"), "unchanged", "changed");
      edit(d, W("todo", "TASK-907-x.md"), "unchanged", "changed");
      commit(d, "edit 903 + 907");
    },
    expect: ["FREEZE-EDIT TASK-903", "FREEZE-EDIT TASK-907"],
  },
  {
    name: "non-ascii-filename-stamped-edited (must-FAIL: a quoted path still resolves)",
    opts: { pre: (d) => put(d, W("todo", "TASK-905-café.md"), fix(T902).replace(/TASK-902/g, "TASK-905")) },
    mutate: (d) => {
      edit(d, W("todo", "TASK-905-café.md"), "unchanged", "changed");
      commit(d, "edit 905");
    },
    expect: ["FREEZE-EDIT TASK-905"],
  },
  // --- SPRINT-108 T1: fences (CommonMark closing rule) and comments must not hide an edit --------
  {
    name: "nested-fence-hides-heading-then-edited (must-FAIL: a 4-backtick fence is not closed by an inner 3-backtick run)",
    opts: {
      pre: (d) =>
        edit(
          d,
          W("todo", T901),
          "- [ ] alpha returns the documented value for every input in the table",
          "````markdown\n```typescript\n## Example, not heading\n```\n````\n- [ ] alpha returns the documented value for every input in the table",
        ),
    },
    mutate: (d) => {
      EDIT_901(d, W("todo", T901));
      commit(d, "edit after nested fence");
    },
    expect: ["FREEZE-EDIT TASK-901"],
  },
  {
    name: "nested-fence-hides-heading-clean (sibling control: same shape, unedited)",
    opts: {
      pre: (d) =>
        edit(
          d,
          W("todo", T901),
          "- [ ] alpha returns the documented value for every input in the table",
          "````markdown\n```typescript\n## Example, not heading\n```\n````\n- [ ] alpha returns the documented value for every input in the table",
        ),
    },
    mutate: () => {},
    expect: [],
  },
  {
    name: "log-fenced-example-scope-change-hidden (must-FAIL: a fenced example does not excuse a real edit)",
    mutate: (d) => {
      EDIT_901(d, W("todo", T901));
      appendFileSync(
        join(d, LOG),
        "\n### 2026-09-25 | note | example scope-change syntax\n" +
          "````markdown\n```md\n### 2026-09-25 | scope-change | example\nTASK-901 gains a benchmark.\n```\n````\n",
      );
      commit(d, "edit + fenced example entry");
    },
    expect: ["FREEZE-EDIT TASK-901"],
  },
  {
    name: "log-plain-fenced-example-scope-change-hidden (sibling control: a plain ``` fence already excludes it today)",
    mutate: (d) => {
      EDIT_901(d, W("todo", T901));
      appendFileSync(
        join(d, LOG),
        "\n### 2026-09-25 | note | example scope-change syntax\n" +
          "```md\n### 2026-09-25 | scope-change | example\nTASK-901 gains a benchmark.\n```\n",
      );
      commit(d, "edit + plain-fenced example entry");
    },
    expect: ["FREEZE-EDIT TASK-901"],
  },
  {
    name: "comment-guidance-edit-below (must-FAIL: a `## ` inside an HTML comment does not end Done when)",
    opts: {
      pre: (d) =>
        edit(
          d,
          W("todo", T901),
          "- [ ] a retained fixture covers the empty input",
          "<!--\n## guidance: one box per outcome\n-->\n- [ ] a retained fixture covers the empty input",
        ),
    },
    mutate: (d) => {
      EDIT_901(d, W("todo", T901));
      commit(d, "edit below comment");
    },
    expect: ["FREEZE-EDIT TASK-901"],
  },
  {
    name: "comment-guidance-edit-inside (must-FAIL: D1 -- an edit inside the comment still counts)",
    opts: {
      pre: (d) =>
        edit(
          d,
          W("todo", T901),
          "- [ ] a retained fixture covers the empty input",
          "<!--\n## guidance: one box per outcome\n-->\n- [ ] a retained fixture covers the empty input",
        ),
    },
    mutate: (d) => {
      edit(d, W("todo", T901), "one box per outcome", "two boxes per outcome");
      commit(d, "edit inside comment");
    },
    expect: ["FREEZE-EDIT TASK-901"],
  },
  {
    name: "comment-guidance-clean (sibling control: comment present, unedited)",
    opts: {
      pre: (d) =>
        edit(
          d,
          W("todo", T901),
          "- [ ] a retained fixture covers the empty input",
          "<!--\n## guidance: one box per outcome\n-->\n- [ ] a retained fixture covers the empty input",
        ),
    },
    mutate: () => {},
    expect: [],
  },
  {
    name: "unticked-box-with-check-tail (must-FAIL: guards the !l.ticked clause in sameDoneWhen)",
    mutate: (d) => {
      edit(
        d,
        W("todo", T901),
        "- [ ] a retained fixture covers the empty input",
        "- [ ] a retained fixture covers the empty input ✓ -- dropped: null input out of scope",
      );
      commit(d, "unticked box gains a check tail");
    },
    expect: ["FREEZE-EDIT TASK-901"],
  },
  // --- SPRINT-108 T1 revise round 1: one scanner, discriminating probes (outside review 2026-09-26) --
  {
    name: "scanner-p1-run-length (must-FAIL: bare fences isolate the run-length clause alone)",
    opts: {
      pre: (d) =>
        edit(
          d,
          W("todo", T901),
          "- [ ] alpha returns the documented value for every input in the table",
          "````\n```\n## Example\n````\n- [ ] alpha returns the documented value for every input in the table",
        ),
    },
    mutate: (d) => {
      EDIT_901(d, W("todo", T901));
      commit(d, "edit after p1 fence");
    },
    expect: ["FREEZE-EDIT TASK-901"],
  },
  {
    name: "scanner-p1-run-length-clean (sibling control)",
    opts: {
      pre: (d) =>
        edit(
          d,
          W("todo", T901),
          "- [ ] alpha returns the documented value for every input in the table",
          "````\n```\n## Example\n````\n- [ ] alpha returns the documented value for every input in the table",
        ),
    },
    mutate: () => {},
    expect: [],
  },
  {
    name: "scanner-p2-whitespace-info (must-FAIL: equal-length info-carrying closer isolates the trailing-whitespace clause, TASK-902)",
    opts: {
      pre: (d) =>
        edit(
          d,
          W("todo", T902),
          "- [ ] beta consumes alpha's output unchanged",
          "```\n```text\n## Example\n```\n- [ ] beta consumes alpha's output unchanged",
        ),
    },
    mutate: (d) => {
      edit(d, W("todo", T902), "beta consumes alpha's output unchanged", "beta consumes alpha's output unchanged, verified");
      commit(d, "edit after p2 fence");
    },
    expect: ["FREEZE-EDIT TASK-902"],
  },
  {
    name: "scanner-p2-whitespace-info-clean (sibling control)",
    opts: {
      pre: (d) =>
        edit(
          d,
          W("todo", T902),
          "- [ ] beta consumes alpha's output unchanged",
          "```\n```text\n## Example\n```\n- [ ] beta consumes alpha's output unchanged",
        ),
    },
    mutate: () => {},
    expect: [],
  },
  {
    name: "scanner-p9-log-whitespace-info (must-FAIL: a plain fence around an equal-length info line does not excuse a real edit)",
    mutate: (d) => {
      EDIT_901(d, W("todo", T901));
      appendFileSync(
        join(d, LOG),
        "\n### 2026-09-25 | note | example\n```\n```text\n### 2026-09-25 | scope-change | example\nTASK-901 gains a benchmark.\n```\n",
      );
      commit(d, "edit + p9 log fence");
    },
    expect: ["FREEZE-EDIT TASK-901"],
  },
  {
    name: "scanner-p9-log-whitespace-info-clean (sibling control: the log alone, unedited, is not a finding)",
    mutate: (d) => {
      appendFileSync(
        join(d, LOG),
        "\n### 2026-09-25 | note | example\n```\n```text\n### 2026-09-25 | scope-change | example\nTASK-901 gains a benchmark.\n```\n",
      );
      commit(d, "p9 log fence only");
    },
    expect: [],
  },
  {
    name: "scanner-f2-comment-then-fence (must-FAIL: one scanner keeps a comment and a following fence in agreement)",
    opts: {
      pre: (d) =>
        edit(
          d,
          W("todo", T901),
          "- [ ] alpha returns the documented value for every input in the table",
          "<!--\n```\n-->\n```\n## Example, not heading\n```\n- [ ] alpha returns the documented value for every input in the table",
        ),
    },
    mutate: (d) => {
      EDIT_901(d, W("todo", T901));
      commit(d, "edit after comment-then-fence");
    },
    expect: ["FREEZE-EDIT TASK-901"],
  },
  {
    name: "scanner-f2-comment-then-fence-clean (sibling control)",
    opts: {
      pre: (d) =>
        edit(
          d,
          W("todo", T901),
          "- [ ] alpha returns the documented value for every input in the table",
          "<!--\n```\n-->\n```\n## Example, not heading\n```\n- [ ] alpha returns the documented value for every input in the table",
        ),
    },
    mutate: () => {},
    expect: [],
  },
  {
    name: "scanner-p4a-closer-indent (must-FAIL: a 4+-space-indented closer must not close, CommonMark <=3)",
    opts: {
      pre: (d) =>
        edit(
          d,
          W("todo", T901),
          "- [ ] alpha returns the documented value for every input in the table",
          "```\n    ```\n## Example\n```\n- [ ] alpha returns the documented value for every input in the table",
        ),
    },
    mutate: (d) => {
      EDIT_901(d, W("todo", T901));
      commit(d, "edit after p4a fence");
    },
    expect: ["FREEZE-EDIT TASK-901"],
  },
  {
    name: "scanner-p4a-closer-indent-clean (sibling control)",
    opts: {
      pre: (d) =>
        edit(
          d,
          W("todo", T901),
          "- [ ] alpha returns the documented value for every input in the table",
          "```\n    ```\n## Example\n```\n- [ ] alpha returns the documented value for every input in the table",
        ),
    },
    mutate: () => {},
    expect: [],
  },
  {
    name: "scanner-p8-log-closer-indent (must-FAIL: same indent rule inside the log)",
    mutate: (d) => {
      EDIT_901(d, W("todo", T901));
      appendFileSync(
        join(d, LOG),
        "\n### 2026-09-25 | note | example\n```md\n    ```\n### 2026-09-25 | scope-change | example\nTASK-901 gains a benchmark.\n```\n",
      );
      commit(d, "edit + p8 log fence");
    },
    expect: ["FREEZE-EDIT TASK-901"],
  },
  {
    name: "scanner-p8-log-closer-indent-clean (sibling control)",
    mutate: (d) => {
      appendFileSync(
        join(d, LOG),
        "\n### 2026-09-25 | note | example\n```md\n    ```\n### 2026-09-25 | scope-change | example\nTASK-901 gains a benchmark.\n```\n",
      );
      commit(d, "p8 log fence only");
    },
    expect: [],
  },
  {
    name: "scanner-p5-inline-lt-bang-dash-second-done-when (must-FAIL: an inline `<!--` under Assumes must not swallow a later heading, TASK-902)",
    opts: {
      pre: (d) =>
        edit(
          d,
          W("todo", T902),
          "## Assumes\n\nnone",
          "## Assumes\n\nnone, except that `<!--` opens a comment\n\n## Done when\n\n- [ ] gamma holds",
        ),
    },
    mutate: (d) => {
      edit(d, W("todo", T902), "gamma holds", "gamma holds and persists");
      commit(d, "edit second Done when");
    },
    expect: ["FREEZE-EDIT TASK-902"],
  },
  {
    name: "scanner-p5-inline-lt-bang-dash-second-done-when-clean (sibling control)",
    opts: {
      pre: (d) =>
        edit(
          d,
          W("todo", T902),
          "## Assumes\n\nnone",
          "## Assumes\n\nnone, except that `<!--` opens a comment\n\n## Done when\n\n- [ ] gamma holds",
        ),
    },
    mutate: () => {},
    expect: [],
  },
  {
    name: "scanner-p6-inline-lt-bang-dash-above-done-when (must-PASS: an inline `<!--` before ## Done when must not hide it -- never a false NO-DONE-WHEN)",
    opts: {
      pre: (d) => edit(d, W("todo", T901), "# TASK-901 — Deliver alpha", "# TASK-901 — Deliver alpha\n\nHandles the `<!--` token."),
    },
    mutate: () => {},
    expect: [],
  },
  {
    // If "```x``` spans are inline code" wrongly opened a 3-run fence (F5), the following bare
    // "````" would wrongly CLOSE it (same char, run 4>=3) instead of opening the real 4-run fence
    // around "## Example, not heading" -- so that heading would wrongly re-surface as a boundary,
    // ending "## Done when" right there and silently dropping both boxes below it (and any edit to
    // them) from the comparison. Disqualifying the inline span keeps the real fence intact.
    name: "scanner-p4d-inline-code-span-false-fence (must-FAIL: a ```x``` inline span must not flip fence parity, F5)",
    opts: {
      pre: (d) =>
        edit(
          d,
          W("todo", T901),
          "- [ ] alpha returns the documented value for every input in the table",
          "```x``` spans are inline code\n````\n## Example, not heading\n````\n- [ ] alpha returns the documented value for every input in the table",
        ),
    },
    mutate: (d) => {
      EDIT_901(d, W("todo", T901));
      commit(d, "edit after inline-span-then-fence");
    },
    expect: ["FREEZE-EDIT TASK-901"],
  },
  {
    name: "scanner-p4d-inline-code-span-false-fence-clean (sibling control)",
    opts: {
      pre: (d) =>
        edit(
          d,
          W("todo", T901),
          "- [ ] alpha returns the documented value for every input in the table",
          "```x``` spans are inline code\n````\n## Example, not heading\n````\n- [ ] alpha returns the documented value for every input in the table",
        ),
    },
    mutate: () => {},
    expect: [],
  },
  // --- SPRINT-108 T1 revise round 2: rendered for boundaries/excuses, raw for selection/body -----
  {
    // R1: a second "## Done when" whose heading carries a trailing inline comment must still be
    // recognized as Done-when (rendered), not silently invisible (TASK-902; not adjacent to T901's
    // first box -- L-186).
    name: "r1-second-done-when-inline-comment (must-FAIL: TASK-902)",
    opts: {
      pre: (d) => edit(d, W("todo", T902), "## Touches", "## Done when <!-- stretch -->\n\n- [ ] gamma holds\n\n## Touches"),
    },
    mutate: (d) => {
      edit(d, W("todo", T902), "gamma holds", "gamma holds and persists");
      commit(d, "edit second Done when");
    },
    expect: ["FREEZE-EDIT TASK-902"],
  },
  {
    name: "r1-second-done-when-inline-comment-clean (sibling control)",
    opts: {
      pre: (d) => edit(d, W("todo", T902), "## Touches", "## Done when <!-- stretch -->\n\n- [ ] gamma holds\n\n## Touches"),
    },
    mutate: () => {},
    expect: [],
  },
  {
    // R2: "## Members" carrying a trailing inline comment must still be recognized as Members
    // (rendered); TASK-901 is unstamped so it is reachable ONLY by being listed.
    name: "r2-members-heading-inline-comment-unstamped (must-FAIL: TASK-901 reachable only by listing)",
    opts: {
      pre: (d) => {
        edit(d, W("todo", T901), "sprint: SPRINT-901\n", "");
        edit(d, SPRINT, "## Members", "## Members <!-- frozen at promote -->");
      },
    },
    mutate: (d) => {
      EDIT_901(d, W("todo", T901));
      commit(d, "edit unstamped, listed-only member");
    },
    expect: ["FREEZE-EDIT TASK-901"],
  },
  {
    name: "r2-members-heading-inline-comment-unstamped-clean (sibling control)",
    opts: {
      pre: (d) => {
        edit(d, W("todo", T901), "sprint: SPRINT-901\n", "");
        edit(d, SPRINT, "## Members", "## Members <!-- frozen at promote -->");
      },
    },
    mutate: () => {},
    expect: [],
  },
  {
    // R3a: an id named ONLY inside an inline comment in the entry BODY must not excuse.
    name: "r3a-scope-change-id-in-comment-body (must-FAIL: a commented-out id excuses nothing)",
    mutate: (d) => {
      EDIT_901(d, W("todo", T901));
      appendFileSync(join(d, LOG), "\n### 2026-09-25 | scope-change | tidy\n<!-- TASK-901 --> gains a benchmark.\n");
      commit(d, "edit + id only in comment body");
    },
    expect: ["FREEZE-EDIT TASK-901"],
  },
  {
    // R3b: an id named ONLY inside an inline comment in the entry HEADING's summary field.
    name: "r3b-scope-change-id-in-comment-heading (must-FAIL)",
    mutate: (d) => {
      EDIT_901(d, W("todo", T901));
      logEntry(d, "scope-change", "tidy <!-- TASK-901 -->", "General cleanup.");
      commit(d, "edit + id only in comment heading");
    },
    expect: ["FREEZE-EDIT TASK-901"],
  },
  {
    // R3c: a fake "| scope-change |" field hidden in an inline comment inside the heading must not
    // be read as the event -- the rendered heading's real event here is "note".
    name: "r3c-scope-change-event-in-comment (must-FAIL: the real (rendered) event is note, not scope-change)",
    mutate: (d) => {
      EDIT_901(d, W("todo", T901));
      appendFileSync(join(d, LOG), "\n### 2026-09-25 <!-- | scope-change | --> | note | TASK-901 tidy\nGeneral cleanup.\n");
      commit(d, "edit + fake event field in comment");
    },
    expect: ["FREEZE-EDIT TASK-901"],
  },
  {
    // R3d: an inline comment spanning two body lines hides the only occurrence of the id.
    name: "r3d-scope-change-id-in-multiline-comment (must-FAIL)",
    mutate: (d) => {
      EDIT_901(d, W("todo", T901));
      appendFileSync(join(d, LOG), "\n### 2026-09-25 | scope-change | tidy\nalpha needs <!-- a note about\nTASK-901 --> gains a benchmark.\n");
      commit(d, "edit + multi-line comment hides the id");
    },
    expect: ["FREEZE-EDIT TASK-901"],
  },
  {
    // R4a: "## Done when <!-- frozen -->" as the ONLY Done-when heading, unedited -- must not be a
    // loud false NO-DONE-WHEN.
    name: "r4-done-when-heading-inline-comment-clean (must-PASS: never a false NO-DONE-WHEN)",
    opts: { pre: (d) => edit(d, W("todo", T901), "## Done when", "## Done when <!-- frozen -->") },
    mutate: () => {},
    expect: [],
  },
  {
    // R4b: the sprint's inline "## Execution Log <!-- inline -->" must still be read, so a valid
    // entry there excuses -- never a loud false FREEZE-EDIT.
    name: "r4-execution-log-heading-inline-comment-excuses (must-PASS: the inline log is still read)",
    opts: { pre: (d) => edit(d, SPRINT, "## Execution Log", "## Execution Log <!-- inline -->") },
    mutate: (d) => {
      EDIT_901(d, W("todo", T901));
      edit(d, SPRINT, "## Files Changed", "### 2026-09-25 | scope-change | alpha gains a bar\nTASK-901 gains a benchmark.\n\n## Files Changed");
      commit(d, "edit + inline entry under a decorated heading");
    },
    expect: [],
  },
  {
    // R5: a Members bullet wrapped in an HTML comment -- selection reads RAW, so it still selects
    // (over-inclusion is the loud/safe direction).
    name: "r5-members-line-commented-out-edited (must-FAIL: raw selection over-includes)",
    opts: { pre: (d) => edit(d, SPRINT, "- docs/work/todo/TASK-902-beta.md\n", "<!-- - docs/work/todo/TASK-902-beta.md -->\n") },
    mutate: (d) => {
      edit(d, W("todo", T902), "beta consumes alpha's output unchanged", "beta consumes alpha's output unchanged, verified");
      commit(d, "edit commented-out member");
    },
    expect: ["FREEZE-EDIT TASK-902"],
  },
  {
    name: "r5-members-line-commented-out-clean (sibling control)",
    opts: { pre: (d) => edit(d, SPRINT, "- docs/work/todo/TASK-902-beta.md\n", "<!-- - docs/work/todo/TASK-902-beta.md -->\n") },
    mutate: () => {},
    expect: [],
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
  let dir = "";
  try {
    dir = build(c.opts); // inside the try: a build error fails its case, never the whole run's verdict line
    c.mutate(dir);
    const r = run(dir, c.close ?? false, c.sprint);
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
    if (dir) rmSync(dir, { recursive: true, force: true });
  }
}

// --- item 4(e): the sprint path spelled through an alias/junction must not CHECK-ERROR -----------
{
  const dir = build();
  let alias: string | null = null;
  try {
    const candidate = join(dirname(dir), `${basename(dir)}-alias`);
    try {
      symlinkSync(dir, candidate, process.platform === "win32" ? "junction" : "dir");
      alias = candidate;
    } catch (e) {
      console.log(`SKIP  alias-path: ${(e as Error).message.split("\n")[0]}`);
    }
    if (alias) {
      const r = run(alias, false, SPRINT);
      const good = r.exit === 0 && r.findings.length === 0;
      console.log(
        `${good ? "PASS" : "FAIL"}  by-reference-fixture: alias-path (sprint spelled through a junction resolves without CHECK-ERROR) -- findings [${r.findings.join(", ")}]; checker said "${r.verdict}" (exit ${r.exit})`,
      );
      good ? pass++ : fail++;
    }
  } catch (e) {
    console.log(`FAIL  by-reference-fixture: alias-path -- harness error: ${(e as Error).message.split("\n")[0]}`);
    fail++;
  } finally {
    if (alias) {
      if (process.platform === "win32") rmdirSync(alias); // removes the junction point, never its target
      else rmSync(alias, { force: true });
    }
    if (existsSync(dir)) rmSync(dir, { recursive: true, force: true });
  }
}

console.log(`by-reference-fixtures: ${pass} pass, ${fail} fail`);
process.exit(fail > 0 ? 1 : 0);
