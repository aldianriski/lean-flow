// Judge calibration (TASK-543): the three blind judges run on the REFERENCE solution (expected PASS) and on a deliberately
// WRONG one (expected FAIL on the dimension it breaks) of a sample of tasks -- not on trials. Writes calibration.md with each
// verdict beside an owner-read column left blank, and an agreement figure.
//   bun evals/ab/judges/calibrate.ts --recorded <replies.json> [--tasks <dir>] [--sample N] [--out <md>]   (fixture replies, free)
//   bun evals/ab/judges/calibrate.ts --live [--tasks <dir>] [--sample N] [--out <md>]                      (REAL judge calls, paid; owner-run)
//   bun evals/ab/judges/calibrate.ts --score <calibration.md>      (agreement of the filled owner-read column against the bar)
//   bun evals/ab/judges/calibrate.ts --write-lock                   (freeze the prompt hashes into prompts.lock.json)
// A task contributes `reference.patch` (expected PASS x3) and, once the coordinator derives it, `wrong.patch` + `wrong.json`
// {"breaks":["business"|"convention"|"scope", ...]} (expected FAIL on those). Recorded replies are keyed "<task id>|<reference|wrong>|<dimension>".
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { DEFAULT_PARAMS } from "../lib/analyze.ts";
import { loadArm, type Arm } from "../lib/arm.ts";
import { loadTask } from "../lib/grade.ts";
import { blindTerms, currentLock, DIMENSIONS, dimensionOf, lockProblems, LOCK_FILE, runJudges, type Dimension } from "../lib/judges.ts";
import { notesOf } from "../lib/measure.ts";
import { realJudge, type Judge } from "../lib/protocol.ts";

const HERE = import.meta.dir;
export type Cell = { task: string; kind: "reference" | "wrong"; dim: Dimension; expected: "PASS" | "FAIL" | "-"; verdict: string; reason: string };
export type Kind = "reference" | "wrong";

export function findTasks(dir: string): { id: string; dir: string; repo: string }[] {
  const out: { id: string; dir: string; repo: string }[] = [];
  const walk = (d: string, repo: string) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (!e.isDirectory()) continue;
      if (fs.existsSync(path.join(p, "task.json")) && fs.existsSync(path.join(p, "reference.patch"))) out.push({ id: e.name, dir: p, repo });
      else walk(p, repo || e.name);
    }
  };
  walk(dir, "");
  return out.sort((a, b) => `${a.repo}/${a.id}`.localeCompare(`${b.repo}/${b.id}`));
}
/** n tasks evenly spaced over the sorted list, so every repo is reached. */
export function pickSample<T>(xs: T[], n: number): T[] {
  if (n >= xs.length) return xs;
  return Array.from({ length: n }, (_v, i) => xs[Math.floor((i * xs.length) / n)]!);
}

export type CalibrateOpts = { tasksDir: string; sample: number; judgeFor: (repo: string, taskId: string, kind: Kind) => Judge; armFor: (repo: string) => Arm; notesFor: (repo: string) => string | undefined };
export async function calibrate(o: CalibrateOpts): Promise<{ cells: Cell[]; skipped: string[] }> {
  const cells: Cell[] = [];
  const skipped: string[] = [];
  for (const t of pickSample(findTasks(o.tasksDir), o.sample)) {
    const task = loadTask(path.join(t.dir, "task.json"));
    const kinds: { kind: Kind; diff: string; breaks: Dimension[] }[] = [{ kind: "reference", diff: fs.readFileSync(path.join(t.dir, "reference.patch"), "utf8"), breaks: [] }];
    if (fs.existsSync(path.join(t.dir, "wrong.patch"))) kinds.push({ kind: "wrong", diff: fs.readFileSync(path.join(t.dir, "wrong.patch"), "utf8"), breaks: (JSON.parse(fs.readFileSync(path.join(t.dir, "wrong.json"), "utf8")) as { breaks: Dimension[] }).breaks });
    else skipped.push(`${t.repo}/${t.id}: no wrong.patch yet (the coordinator derives one by breaking the rule the task tests)`);
    for (const k of kinds) {
      const j = await runJudges({ task, diff: k.diff, notes: o.notesFor(t.repo) }, o.judgeFor(t.repo, t.id, k.kind), blindTerms(o.armFor(t.repo)));
      for (const dim of DIMENSIONS) cells.push({ task: `${t.repo}/${t.id}`, kind: k.kind, dim, expected: k.kind === "reference" ? "PASS" : k.breaks.includes(dim) ? "FAIL" : "-", verdict: j.judges[dim].verdict, reason: j.judges[dim].reason });
    }
  }
  return { cells, skipped };
}

/** Judge verdicts against the expectation (reference PASS, broken dimension FAIL). */
export const agreement = (cells: Cell[]) => {
  const graded = cells.filter((c) => c.expected !== "-");
  const hit = graded.filter((c) => c.verdict === c.expected).length;
  return { hit, of: graded.length, rate: graded.length === 0 ? NaN : hit / graded.length };
};

export function renderCalibration(cells: Cell[], skipped: string[], mode: string): string {
  const a = agreement(cells);
  const esc = (s: string) => s.replace(/\|/g, "\\|").replace(/\r?\n/g, " ");
  const lock = currentLock();
  return [
    `# Judge calibration`,
    ``,
    `Mode: ${mode}. Judge model ${lock.judgeModel}. Prompt hashes: ${DIMENSIONS.map((d) => `${d} ${lock.prompts[d]!.slice(0, 12)}`).join(", ")}.`,
    `Reference solutions are expected PASS; a wrong solution is expected FAIL on the dimension it breaks ("-" = no expectation).`,
    `Fill the **owner read** column (PASS | FAIL | UNKNOWN) for every row, then run \`bun evals/ab/judges/calibrate.ts --score <this file>\`.`,
    ``,
    `| task | solution | dimension | expected | judge | reason | owner read |`,
    `|---|---|---|---|---|---|---|`,
    ...cells.map((c) => `| ${c.task} | ${c.kind} | ${c.dim} | ${c.expected} | ${c.verdict} | ${esc(c.reason)} |  |`),
    ``,
    `Agreement with expectation: ${a.hit}/${a.of} = ${Number.isNaN(a.rate) ? "n/a" : `${(a.rate * 100).toFixed(1)}%`} (bar ${DEFAULT_PARAMS.calibrationBar * 100}%).`,
    `Agreement with the owner's read: pending (owner column blank).`,
    ...(skipped.length > 0 ? [``, `Skipped:`, ...skipped.map((s) => `- ${s}`)] : []),
    ``,
  ].join("\n");
}

/** Agreement of the judge column with the filled owner-read column; rows with a blank owner cell are not counted. */
export function scoreCalibration(text: string): { hit: number; of: number; rate: number } {
  let hit = 0;
  let of = 0;
  for (const line of text.split(/\r?\n/)) {
    if (!line.startsWith("|")) continue;
    const c = line.split(/(?<!\\)\|/).map((x) => x.trim()); // c[0] is empty (leading pipe)
    const judge = (c[5] ?? "").toUpperCase();
    const owner = (c[7] ?? "").toUpperCase();
    if (c.length < 9 || !/^(PASS|FAIL|UNKNOWN)$/.test(judge) || !/^(PASS|FAIL|UNKNOWN)$/.test(owner)) continue;
    of++;
    if (owner === judge) hit++;
  }
  return { hit, of, rate: of === 0 ? NaN : hit / of };
}

if (import.meta.main) {
  const argv = process.argv.slice(2);
  const flag = (n: string) => (argv.indexOf(`--${n}`) >= 0 ? argv[argv.indexOf(`--${n}`) + 1] : undefined);
  if (argv.includes("--write-lock")) {
    fs.writeFileSync(LOCK_FILE, `${JSON.stringify(currentLock(), null, 2)}\n`);
    console.log(`wrote ${LOCK_FILE}`);
    process.exit(0);
  }
  if (flag("score")) {
    const s = scoreCalibration(fs.readFileSync(path.resolve(flag("score")!), "utf8"));
    const ok = s.of > 0 && s.rate >= DEFAULT_PARAMS.calibrationBar;
    console.log(`calibration agreement with the owner's read: ${s.hit}/${s.of} = ${(s.rate * 100).toFixed(1)}% (bar ${DEFAULT_PARAMS.calibrationBar * 100}%): ${s.of === 0 ? "NO OWNER READS FILLED" : ok ? "AT OR ABOVE BAR" : "BELOW BAR"}`);
    process.exit(ok ? 0 : 1);
  }
  const live = argv.includes("--live");
  if (live === (flag("recorded") !== undefined)) (console.error("pass exactly one of --live or --recorded <replies.json>"), process.exit(2));
  const lock = lockProblems();
  if (lock.length > 0) (console.error(`REFUSED: ${lock.join("; ")}. Run --write-lock only when the prompts are meant to change.`), process.exit(2));
  const armsDir = path.join(HERE, "..", "arms");
  const armFor = (repo: string) => loadArm(path.join(armsDir, `${repo}-a0.json`));
  const recorded: Record<string, string> = live ? {} : JSON.parse(fs.readFileSync(path.resolve(flag("recorded")!), "utf8"));
  const judgeFor = (repo: string, taskId: string, kind: Kind): Judge =>
    live
      ? realJudge(fs.mkdtempSync(path.join(os.tmpdir(), "ab-calib-")), armFor(repo))
      : async (prompt) => {
          const k = `${taskId}|${kind}|${dimensionOf(prompt)}`;
          if (recorded[k] === undefined) throw new Error(`no recorded reply for ${k}`);
          return recorded[k]!;
        };
  const notesFor = (repo: string) => {
    const dir = flag("notes-dir");
    const f = dir && path.join(path.resolve(dir), `${repo}.md`);
    if (f && fs.existsSync(f)) return fs.readFileSync(f, "utf8");
    const a1 = path.join(armsDir, `${repo}-a1.json`);
    const snap = fs.existsSync(a1) ? loadArm(a1).snapshot : undefined;
    return snap ? notesOf(snap) : undefined;
  };
  const { cells, skipped } = await calibrate({ tasksDir: path.resolve(flag("tasks") ?? path.join(HERE, "..", "tasks")), sample: Number(flag("sample") ?? 4), judgeFor, armFor, notesFor });
  const out = path.resolve(flag("out") ?? path.join(HERE, "calibration.md"));
  fs.writeFileSync(out, renderCalibration(cells, skipped, live ? "live" : "recorded (fixture replies)"));
  const a = agreement(cells);
  console.log(`calibration: ${a.hit}/${a.of} judge verdicts match the expectation -> ${out}`);
}
