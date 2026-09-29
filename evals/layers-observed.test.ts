// evals/layers-observed.test.ts -- SPRINT-110 T2 (TASK-391): retained must-FAIL fixtures for the
// MEMBER-AWARE half of scripts/lib/check-layers-observed.ts (gate leg 15) on a by-reference ("v2")
// sprint. The shell oracle (check-layers-observed.sh) stays a Plan-path oracle (decision D1) and is
// NOT taught members; its own runner (run-layers-observed-fixtures.sh) still asserts it, and the
// differential runs the port with --no-members so v1 parity holds and the exclusion is named.
//
// Every must-FAIL asserts its NAMED finding and pairs with a sibling control that must stay green.
// Fixtures build real git histories (the checker's subject is `git diff-tree` per commit) via
// evals/fixtures/layers-observed/git-fixtures.ts; the checker is called in-process with cwd switched
// to the fixture repo (all its git calls run against cwd).
import { afterAll, describe, expect, setDefaultTimeout, test } from "bun:test";
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

// keep writeFileSync/mkdirSync imports honest for future fixtures
void writeFileSync;
void mkdirSync;
