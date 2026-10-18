// evals/layers-observed.test.ts -- SPRINT-110 T2 (TASK-391): retained must-FAIL fixtures for the
// MEMBER-AWARE half of scripts/lib/check-layers-observed.ts (gate leg 15) on a by-reference ("v2")
// sprint. The shell oracle (check-layers-observed.sh) and its runner were retired at SPRINT-128
// (TASK-446); the gate runs this TS checker alone, and this file is run by
// evals/run-layers-observed-test-fixtures.ts.
//
// Every must-FAIL asserts its NAMED finding and pairs with a sibling control that must stay green.
// Fixtures build real git histories (the checker's subject is `git diff-tree` per commit) via
// evals/fixtures/layers-observed/git-fixtures.ts; the checker is called in-process with cwd switched
// to the fixture repo (all its git calls run against cwd).
import { afterAll, describe, expect, setDefaultTimeout, test } from "bun:test";
import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { posix } from "node:path";
import { runLayersObserved } from "../scripts/lib/check-layers-observed.ts";
import { commitAll, gitInit, lockPlan, writeFile } from "./fixtures/layers-observed/git-fixtures.ts";

// Fixtures spawn real git (slow on Windows fork emulation); the 5s default flakes.
setDefaultTimeout(120_000);

const work = mkdtempSync(posix.join(tmpdir().replace(/\\/g, "/"), "layers-observed-ts-"));
afterAll(() => rmSync(work, { recursive: true, force: true }));

const SPRINT = "docs/sprint/SPRINT-901-v2.md";

interface Opts {
  /** `## Members` section body lines; undefined = no `## Members` section at all. */
  members?: string[];
  /** Plan body (everything under `## Plan`). */
  plan: string;
  stampSprint?: boolean;
}

function sprintDoc(o: Opts): string {
  const members = o.members ? `## Members\n\n${o.members.map((m) => `- ${m}`).join("\n")}\n\n` : "";
  return `---\nsprint: 901\nslug: v2\nstatus: active\nplan_commit: PLAN_COMMIT_PLACEHOLDER\n---\n\n# S\n\n${members}## Plan\n\n${o.plan}\n\n## Execution Log\n`;
}

function taskDoc(id: string, opts: { stamp?: boolean; ticked?: boolean } = {}): string {
  const box = opts.ticked ? "- [x]" : "- [ ]";
  const stamp = opts.stamp ? "sprint: 901\n" : "";
  return `---\nid: ${id}\n${stamp}authority: J2\n---\n\n# ${id}\n\n## Done when\n\n${box} it is done\n`;
}

const T1 = (cites: string, layers = "`src/a.ts`") =>
  `### T1 -- the task [size: S]\nLayers: ${layers}\nDepends-on: none\nCites: ${cites}\n`;

/** Build a repo: plan locked, then return dir. Members are written BEFORE the plan lock. */
function build(name: string, o: Opts, tasks: Array<{ path: string; id: string; stamp?: boolean; ticked?: boolean }>): string {
  const d = posix.join(work, name);
  gitInit(d);
  writeFile(d, "src/a.ts", "a\n");
  writeFile(d, "src/other.ts", "o\n");
  writeFile(d, SPRINT, sprintDoc(o));
  for (const t of tasks) writeFile(d, t.path, taskDoc(t.id, t));
  lockPlan(d, SPRINT);
  return d;
}

function run(dir: string, args: string[] = [SPRINT]): { out: string; fail: boolean } {
  const prev = process.cwd();
  process.chdir(dir);
  try {
    const r = runLayersObserved(args);
    return { out: r.lines.join("\n"), fail: r.fail };
  } finally {
    process.chdir(prev);
  }
}

const M1 = "docs/work/todo/TASK-901-one.md";
const M2 = "docs/work/todo/TASK-902-two.md";

describe("member out-of-layers (Task: TASK-NNN trailer attribution)", () => {
  const d = build("out-of-layers", { members: [M1], plan: T1("`TASK-901`") }, [{ path: M1, id: "TASK-901" }]);
  writeFile(d, "src/a.ts", "a2\n");
  commitAll(d, "work on a\n\nTask: TASK-901");
  writeFile(d, "src/other.ts", "o2\n");
  commitAll(d, "stray edit\n\nTask: TASK-901");
  const r = run(d);

  test("MUST-FAIL: a member commit touching a file outside the governing Tn's Layers is named", () => {
    expect(r.fail).toBe(true);
    expect(r.out).toContain("member-out-of-layers");
    expect(r.out).toContain("TASK-901(T1):src/other.ts");
  });
  test("sibling control: the member commit inside Layers is not named", () => {
    expect(r.out).not.toContain("src/a.ts");
  });
  test("--no-members (the differential's named exclusion) drops the member finding, keeps the v1 path", () => {
    const off = run(d, ["--no-members", SPRINT]);
    expect(off.out).not.toContain("member-out-of-layers");
    expect(off.out).toContain("--no-members -- the member legs are OFF"); // TD-198: switched off aloud, never silently
    expect(r.out).not.toContain("the member legs are OFF"); // control: the default run prints no such note
  });
});

// --- SPRINT-128 T3 (TASK-445, TD-188): the resolver's anomalies are named FAILs here too -------------------------
describe("member resolver anomalies (member-ambiguous / member-missing / member-misplaced)", () => {
  const M2G = "docs/work/todo/TASK-902-ghost.md";
  const T = (path: string, id: string) => ({ path, id });
  const clean = build("anom-clean", { members: [M1], plan: T1("`TASK-901`") }, [T(M1, "TASK-901")]);
  const dup = build("anom-dup", { members: [M1], plan: T1("`TASK-901`") }, [T(M1, "TASK-901"), T("docs/work/done/TASK-901-dup.md", "TASK-901")]);
  const ghost = build("anom-ghost", { members: [M1, M2G], plan: T1("`TASK-901`") }, [T(M1, "TASK-901")]);
  const nested = build("anom-nested", { members: [M1], plan: T1("`TASK-901`") }, [T(M1, "TASK-901"), T("docs/work/todo/sub/TASK-903-n.md", "TASK-903")]);

  test("control: a clean tree prints no resolver anomaly", () => {
    const r = run(clean);
    expect(r.out).not.toMatch(/member-(ambiguous|missing|misplaced)/);
  });
  test("MUST-FAIL member-ambiguous: names the id and BOTH paths", () => {
    const r = run(dup);
    expect(r.fail).toBe(true);
    const line = r.out.split("\n").find((l) => l.includes("member-ambiguous:"))!;
    expect(line).toContain("TASK-901");
    expect(line).toContain("docs/work/done/TASK-901-dup.md");
    expect(line).toContain(M1);
  });
  test("MUST-FAIL member-missing: a listed id with no file is named", () => {
    const r = run(ghost);
    expect(r.fail).toBe(true);
    expect(r.out.split("\n").find((l) => l.includes("member-missing:"))).toContain("TASK-902");
  });
  test("MUST-FAIL member-misplaced: a nested task file is named with its path", () => {
    const r = run(nested);
    expect(r.fail).toBe(true);
    expect(r.out.split("\n").find((l) => l.includes("member-misplaced:"))).toContain("docs/work/todo/sub/TASK-903-n.md");
  });
  test("--no-members runs none of them (the NOTE says so), so the duplicate is not reported", () => {
    const r = run(dup, ["--no-members", SPRINT]);
    expect(r.out).not.toContain("member-ambiguous");
    expect(r.out).toContain("the member legs are OFF");
  });
});

describe("member in Layers (clean control)", () => {
  const d = build("clean", { members: [M1], plan: T1("`TASK-901`") }, [{ path: M1, id: "TASK-901" }]);
  writeFile(d, "src/a.ts", "a2\n");
  commitAll(d, "work on a\n\nTask: TASK-901");
  const r = run(d);
  test("PASS with no member finding", () => {
    expect(r.fail).toBe(false);
    expect(r.out).toContain("PASS");
    expect(r.out).not.toContain("member-");
  });
});

describe("Tn subject attribution still checks against the Tn's Layers (selection: subject vs trailer)", () => {
  const d = build("subject", { members: [M1], plan: T1("`TASK-901`") }, [{ path: M1, id: "TASK-901" }]);
  writeFile(d, "src/other.ts", "o2\n");
  commitAll(d, "sprint(901) T1: stray via subject");
  const r = run(d);
  test("MUST-FAIL: the pre-existing named finding fires on a member-cited Tn", () => {
    expect(r.fail).toBe(true);
    expect(r.out).toContain("changed by a task that never declared it: T1:src/other.ts");
  });
});

describe("member-layers-undeclared (owner ruling R1)", () => {
  test("MUST-FAIL per member: a member no ### Tn cites is named; the cited sibling is not", () => {
    const d = build("undeclared", { members: [M1, M2], plan: T1("`TASK-901`") }, [
      { path: M1, id: "TASK-901" },
      { path: M2, id: "TASK-902" },
    ]);
    const r = run(d);
    expect(r.fail).toBe(true);
    expect(r.out).toContain("member-layers-undeclared: TASK-902");
    expect(r.out).not.toContain("member-layers-undeclared: TASK-901");
    expect(r.out).not.toContain("PASS");
  });

  test("MUST-FAIL (TD-199): a member named only by a LATER Cites: mention is undeclared; the member that leads the line is not", () => {
    const d = build("later-mention", { members: [M1, M2], plan: T1("`TASK-901` · split from TASK-902") }, [
      { path: M1, id: "TASK-901" },
      { path: M2, id: "TASK-902" },
    ]);
    const r = run(d);
    expect(r.fail).toBe(true);
    expect(r.out).toContain("member-layers-undeclared: TASK-902");
    expect(r.out).not.toContain("member-layers-undeclared: TASK-901");
  });

  test("control (TD-199): the same two ids both in the LEADING run -> neither is undeclared", () => {
    const d = build("leading-run", { members: [M1, M2], plan: T1("`TASK-901` · `TASK-902`") }, [
      { path: M1, id: "TASK-901" },
      { path: M2, id: "TASK-902" },
    ]);
    const r = run(d);
    expect(r.out).not.toContain("member-layers-undeclared");
  });

  test("MUST-FAIL: a v2 sprint with members and NO ### Tn blocks (all commits COORD) never passes vacuously", () => {
    const d = build("no-tn", { members: [M1], plan: "Just prose, no task blocks.\n" }, [{ path: M1, id: "TASK-901" }]);
    writeFile(d, "docs/notes.md", "x\n");
    commitAll(d, "sprint(901): coordinator bookkeeping");
    const r = run(d);
    expect(r.fail).toBe(true);
    expect(r.out).toContain("member-layers-undeclared: TASK-901");
  });

  test("selection: a member reached ONLY by the `sprint:` stamp (no ## Members section) is still examined", () => {
    const d = build("stamped", { plan: T1("`TASK-903`") }, [{ path: "docs/work/in_progress/TASK-904-stamped.md", id: "TASK-904", stamp: true }]);
    const r = run(d);
    expect(r.fail).toBe(true);
    expect(r.out).toContain("member-layers-undeclared: TASK-904");
  });

  test("v1 control: no docs/work store at all -> no member finding, PASS", () => {
    const d = posix.join(work, "v1");
    gitInit(d);
    writeFile(d, "src/a.ts", "a\n");
    writeFile(d, SPRINT, sprintDoc({ plan: `${T1("nothing")}\n- [ ] do it\n` }));
    lockPlan(d, SPRINT);
    writeFile(d, "src/a.ts", "a2\n");
    commitAll(d, "sprint(901) T1: edit a");
    const r = run(d);
    expect(r.fail).toBe(false);
    expect(r.out).not.toContain("member-");
  });
});

describe("atClose on a v2 sprint is derived from the members, not Plan checkboxes", () => {
  const plan = T1("`TASK-901`");
  const wipChangelog = (d: string) => writeFile(d, "CHANGELOG.md", "wip\n");

  test("MUST-FAIL: execution-time v2 (member open) does NOT get close-time exclusions", () => {
    const d = build("exec-time", { members: [M1], plan }, [{ path: M1, id: "TASK-901" }]);
    wipChangelog(d);
    const r = run(d);
    expect(r.fail).toBe(true);
    expect(r.out).toContain("changed but undeclared in any task's Layers:: CHANGELOG.md");
  });

  test("sibling control: member moved to done/ -> at close, CHANGELOG.md is excluded", () => {
    const d = build("closed-folder", { members: ["docs/work/done/TASK-901-one.md"], plan }, [
      { path: "docs/work/done/TASK-901-one.md", id: "TASK-901" },
    ]);
    wipChangelog(d);
    const r = run(d);
    expect(r.fail).toBe(false);
    expect(r.out).not.toContain("CHANGELOG.md");
  });

  test("selection: member still in in_progress/ but every Done-when box ticked -> at close", () => {
    const p = "docs/work/in_progress/TASK-901-one.md";
    const d = build("closed-ticked", { members: [p], plan }, [{ path: p, id: "TASK-901", ticked: true }]);
    wipChangelog(d);
    const r = run(d);
    expect(r.fail).toBe(false);
    expect(r.out).not.toContain("CHANGELOG.md");
  });

  test("one open member of two keeps the sprint in execution", () => {
    const p1 = "docs/work/done/TASK-901-one.md";
    const d = build("half-closed", { members: [p1, M2], plan: `${plan}\n${T1("`TASK-902`").replace("### T1", "### T2")}` }, [
      { path: p1, id: "TASK-901" },
      { path: M2, id: "TASK-902" },
    ]);
    wipChangelog(d);
    const r = run(d);
    expect(r.fail).toBe(true);
    expect(r.out).toContain("CHANGELOG.md");
  });
});

// --- SPRINT-128 T1 (TASK-443): the Plan path, now that the shared parser reads it ---------------------
// check-layers-observed.sh's Plan-path cases were Shell-only and were retired with it (T4). These carry
// them on the TS checker, in a v1 repo (no docs/work store, so no member leg runs).
const planOnly = (plan: string) => build("plan-" + Math.random().toString(36).slice(2, 8), { plan }, []);
const TWO_TASKS =
  "### T1 -- first [size: S]\nLayers: `src/a.ts`\nDepends-on: none\n\n### T2 -- second [size: S]\nLayers: `src/other.ts`\nDepends-on: none\n";

describe("Plan path: a Tn commit is checked against THAT Tn's Layers", () => {
  const d = planOnly(TWO_TASKS);
  writeFile(d, "src/other.ts", "o2\n");
  commitAll(d, "sprint(901) T1: stray into T2's file");
  writeFile(d, "src/other.ts", "o3\n");
  commitAll(d, "sprint(901) T2: its own file");
  const r = run(d);
  test("MUST-FAIL: T1 touching a file only T2 declared is named", () => {
    expect(r.fail).toBe(true);
    expect(r.out).toContain("changed by a task that never declared it: T1:src/other.ts");
  });
  test("sibling control: T2 touching its own file is not named", () => {
    expect(r.out).not.toContain("T2:src/other.ts");
  });
});

describe("Plan path: declaration shapes the parser must read", () => {
  test("an INDENTED continuation line is part of the declaration (PASS)", () => {
    const d = planOnly("### T1 -- t [size: S]\nLayers: `src/a.ts` ·\n  `src/other.ts`\nDepends-on: none\n");
    writeFile(d, "src/other.ts", "o2\n");
    commitAll(d, "sprint(901) T1: edit other");
    const r = run(d);
    expect(r.fail).toBe(false);
    expect(r.out).not.toContain("declaration continuation");
  });
  test("a declared DIRECTORY token covers a file under it (PASS)", () => {
    const d = planOnly("### T1 -- t [size: S]\nLayers: `src/`\nDepends-on: none\n");
    writeFile(d, "src/other.ts", "o2\n");
    commitAll(d, "sprint(901) T1: edit other");
    expect(run(d).fail).toBe(false);
  });
  test("MUST-FAIL: uncommitted work in a file NO task declared is named (WIP union leg)", () => {
    const d = planOnly(TWO_TASKS);
    writeFile(d, "docs/zz.md", "wip\n");
    const r = run(d);
    expect(r.fail).toBe(true);
    expect(r.out).toContain("changed but undeclared in any task's Layers:: docs/zz.md");
  });
  test("sibling control: uncommitted work in a file ANY task declared is only a WIP skip", () => {
    const d = planOnly(TWO_TASKS);
    writeFile(d, "src/other.ts", "o2\n");
    const r = run(d);
    expect(r.fail).toBe(false);
    expect(r.out).toContain("[WIP, unattributed]");
  });
});

describe("column-0 wrap is NAMED, not dropped (TD-138; completeness already FAILed it)", () => {
  test("MUST-FAIL: a Layers: line wrapped at column 0 is named with its line, and never passes", () => {
    const d = planOnly("### T1 -- t [size: S]\nLayers: `src/a.ts` ·\n`src/other.ts`\nDepends-on: none\n");
    const r = run(d);
    expect(r.fail).toBe(true);
    expect(r.out).toContain(
      "declaration continuation: column-0 line 14 after the Layers: declaration -- indent it to continue the declaration, or separate it with a blank line if it is prose",
    );
    expect(r.out).not.toContain("PASS");
  });
  test("sibling control: the same declaration wrapped with an indent is clean", () => {
    const d = planOnly("### T1 -- t [size: S]\nLayers: `src/a.ts` ·\n  `src/other.ts`\nDepends-on: none\n");
    const r = run(d);
    expect(r.fail).toBe(false);
    expect(r.out).not.toContain("declaration continuation");
  });
});

describe("P2 (err loud): column-0 PROSE starting with a backtick directly after a declaration is named", () => {
  test("MUST-FAIL: named with the remedy", () => {
    const d = planOnly("### T1 -- t [size: S]\nLayers: `src/a.ts`\n`some note` describes this\nDepends-on: none\n");
    const r = run(d);
    expect(r.fail).toBe(true);
    expect(r.out).toContain(
      "declaration continuation: column-0 line 14 after the Layers: declaration -- indent it to continue the declaration, or separate it with a blank line if it is prose",
    );
  });
  test("control: the same prose separated by a blank line is not flagged", () => {
    const d = planOnly("### T1 -- t [size: S]\nLayers: `src/a.ts`\n\n`some note` describes this\nDepends-on: none\n");
    const r = run(d);
    expect(r.fail).toBe(false);
    expect(r.out).not.toContain("declaration continuation");
  });
});

describe("P1: Layers: under a non-task `### Notes` heading stays with the PRECEDING Tn (observed's old reading)", () => {
  const plan =
    "### T1 -- first [size: S]\nLayers: `src/a.ts`\nDepends-on: none\n\n### Notes\nLayers: `src/other.ts`\n\n### T2 -- second [size: S]\nLayers: `src/a.ts`\nDepends-on: none\n";
  const d = planOnly(plan);
  writeFile(d, "src/other.ts", "o2\n");
  commitAll(d, "sprint(901) T1: edits the file declared under Notes");
  writeFile(d, "src/other.ts", "o3\n");
  commitAll(d, "sprint(901) T2: same file, T2 never declared it");
  const r = run(d);
  test("T2 touching it is named (not declared by T2)", () => {
    expect(r.fail).toBe(true);
    expect(r.out).toContain("changed by a task that never declared it: T2:src/other.ts");
  });
  test("MUST-FAIL if broken: T1 touching it is NOT named (the Notes Layers: belongs to T1)", () => {
    expect(r.out).not.toContain("T1:src/other.ts");
  });
});

describe("a `sprint(NNN) Tn:` subject attributes to Tn only for THIS sprint (TD-248)", () => {
  const d = planOnly(TWO_TASKS);
  writeFile(d, "src/a.ts", "a2\n");
  commitAll(d, "sprint(902) T1: another sprint's T1, same file T1 declares");
  writeFile(d, "src/a.ts", "a3\n");
  commitAll(d, "sprint(902) T1 fix: another sprint's qualified T1");
  writeFile(d, "src/a.ts", "a4\n");
  commitAll(d, "sprint(901) T1: this sprint's T1");
  const r = run(d);
  test("MUST-FAIL: another sprint's `sprint(902) Tn:` and `sprint(902) Tn <qualifier>:` attribute to no task", () => {
    expect(r.fail).toBe(true);
    expect(r.out).toContain("commit attributable to no task and not coordinator bookkeeping:");
    expect(r.out.match(/:src\/a\.ts/g)?.length).toBe(2);
  });
  test("sibling control: this sprint's own `sprint(901) T1:` is attributed and covered", () => {
    expect(r.out).not.toContain("changed by a task that never declared it");
  });
});

// --- SPRINT-128 T5 (TASK-447 · TD-177): a Layers: token that matches nothing is named ------------------
// Checked only for a Tn whose cited members are all in done/ or cancel/ (an unstarted task's own
// in_progress/ path does not exist yet). A token is live when ANY path at HEAD or touched since
// plan_commit matches it, both sides of a rename and deleted paths included.
describe("dead Layers: token (TD-177)", () => {
  const M1D = "docs/work/done/TASK-901-one.md";
  const DEAD = "layers-token-matches-nothing";
  const mk = (name: string, layers: string, member = M1D) =>
    build(name, { members: [member], plan: T1("`TASK-901`", layers) }, [{ path: member, id: "TASK-901" }]);

  test("MUST-FAIL: a file token naming no path is named; the live token beside it is not", () => {
    const r = run(mk("dead-file", "`src/a.ts` · `src/nope.ts`"));
    expect(r.fail).toBe(true);
    expect(r.out).toContain(`${DEAD}: T1 declares \`src/nope.ts\``);
    expect(r.out).not.toContain("`src/a.ts` --");
  });

  test("MUST-FAIL: a glob token covers nothing, so it is dead (SPRINT-104's miss)", () => {
    const r = run(mk("dead-glob", "`src/*.ts`"));
    expect(r.out).toContain(`${DEAD}: T1 declares \`src/*.ts\``);
  });

  test("MUST-FAIL: a directory token with nothing under it is dead; one with files under it is live", () => {
    const r = run(mk("dead-dir", "`src/` · `nodir/`"));
    expect(r.out).toContain(`${DEAD}: T1 declares \`nodir/\``);
    expect(r.out).not.toContain("`src/`");
  });

  test("control: a token for a file the sprint DELETED is live (gone at HEAD, touched in the range)", () => {
    const d = mk("deleted", "`src/a.ts` · `src/other.ts`");
    rmSync(posix.join(d, "src/other.ts"));
    commitAll(d, "remove other\n\nTask: TASK-901");
    const r = run(d);
    expect(r.out).not.toContain(DEAD);
    expect(r.fail).toBe(false);
  });

  test("control: BOTH sides of a rename are live, each on its own", () => {
    for (const [name, layers] of [
      ["rename-both", "`src/a.ts` · `src/b.ts`"],
      ["rename-old-side", "`src/a.ts`"],
      ["rename-new-side", "`src/b.ts`"],
    ] as const) {
      const d = mk(name, layers);
      rmSync(posix.join(d, "src/a.ts"));
      writeFile(d, "src/b.ts", "a\n");
      commitAll(d, "rename a to b\n\nTask: TASK-901");
      expect(run(d).out).not.toContain(DEAD);
    }
  });

  // Codex R1: task branches are merged --no-ff and `git log` omits a merge's own diff, so a path removed or
  // moved only in a conflict resolution (touched by neither parent's commits) read as dead.
  test("control: a path deleted or renamed ONLY in a merge commit is live", () => {
    const git = (d: string, a: string[]) =>
      execFileSync("git", ["-C", d, "-c", "user.name=Fixture Bot", "-c", "user.email=fixture@example.com", ...a], { encoding: "utf8", stdio: "pipe" });
    for (const [name, gone, renamedTo] of [
      ["merge-delete", "src/other.ts", null],
      ["merge-rename", "src/a.ts", "src/b.ts"],
    ] as const) {
      const d = mk(name, `\`${gone}\` · \`src/side.ts\` · \`src/main.ts\``);
      const main = git(d, ["rev-parse", "--abbrev-ref", "HEAD"]).trim();
      git(d, ["checkout", "-q", "-b", "side"]);
      writeFile(d, "src/side.ts", "s\n");
      commitAll(d, "side work\n\nTask: TASK-901");
      git(d, ["checkout", "-q", main]);
      writeFile(d, "src/main.ts", "m\n");
      commitAll(d, "main work\n\nTask: TASK-901");
      git(d, ["merge", "--no-ff", "--no-commit", "side"]);
      if (renamedTo === null) git(d, ["rm", "-q", gone]);
      else git(d, ["mv", gone, renamedTo]);
      git(d, ["commit", "-q", "-m", "merge side, resolving by hand"]);
      expect(run(d).out).not.toContain(DEAD);
    }
  });

  test("selection: an UNFINISHED task's future path is not checked; the same token on a finished one is", () => {
    const future = "`src/a.ts` · `src/future.ts`";
    const open = run(mk("open-task", future, M1));
    expect(open.out).not.toContain(DEAD);
    expect(run(mk("done-task", future)).out).toContain(`${DEAD}: T1 declares \`src/future.ts\``);
  });

  test("selection: with two tasks only the finished one is checked", () => {
    const plan = `${T1("`TASK-901`", "`src/a.ts` · `src/gone-1.ts`")}\n${T1("`TASK-902`", "`src/other.ts` · `src/gone-2.ts`").replace("### T1", "### T2")}`;
    const d = build("two-tasks", { members: [M1D, M2], plan }, [
      { path: M1D, id: "TASK-901" },
      { path: M2, id: "TASK-902" },
    ]);
    const r = run(d);
    expect(r.out).toContain(`${DEAD}: T1 declares \`src/gone-1.ts\``);
    expect(r.out).not.toContain("src/gone-2.ts");
  });
});

// keep writeFileSync/mkdirSync imports honest for future fixtures
void writeFileSync;
void mkdirSync;
