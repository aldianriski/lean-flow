// Graders: run a task's commands in the trial dir. Every grader always runs (no short-circuit);
// the trial passes only when every grader passes.
import fs from "node:fs";
import path from "node:path";

export type Grader = { name: string; cmd: string; artifact?: string };
/** layers / outOfScope are required only by a protocol trial (D9): repo-relative paths or `dir/` prefixes, and the task's Out-of-scope behaviours */
export type Task = { id: string; prompt: string; graders: Grader[]; layers?: string[]; outOfScope?: string[] };
export type Verdict = { name: string; passed: boolean; detail: string };
export type Grade = { passed: boolean; graders: Verdict[] };

export function loadTask(file: string): Task {
  const t = JSON.parse(fs.readFileSync(file, "utf8")) as Task;
  if (!t.id || !t.prompt || !Array.isArray(t.graders) || t.graders.length === 0) throw new Error(`task ${file}: needs id, prompt and at least one grader`);
  return t;
}

/** Nearest node_modules/.bin/tsc above this harness (a worktree has none of its own). */
export function findTsc(from = import.meta.dir): string {
  for (let d = from; ; d = path.dirname(d)) {
    for (const n of ["tsc.exe", "tsc"]) {
      const p = path.join(d, "node_modules", ".bin", n);
      if (fs.existsSync(p)) return p;
    }
    if (path.dirname(d) === d) throw new Error("no node_modules/.bin/tsc above evals/ab (run 'bun install')");
  }
}

export async function grade(task: Task, dir: string): Promise<Grade> {
  const verdicts: Verdict[] = [];
  for (const g of task.graders) {
    const cmd = g.cmd.replace("{TSC}", `"${findTsc()}"`);
    const p = Bun.spawn(["sh", "-c", cmd], { cwd: dir, stdin: "ignore", stdout: "pipe", stderr: "pipe" });
    const out = (await new Response(p.stdout).text()) + (await new Response(p.stderr).text());
    const code = await p.exited;
    const missing = g.artifact !== undefined && !fs.existsSync(path.join(dir, g.artifact));
    const passed = code === 0 && !missing;
    const detail = code !== 0 ? `exit ${code}: ${out.trim().split("\n")[0] ?? ""}` : missing ? `missing artifact ${g.artifact}` : "ok";
    verdicts.push({ name: g.name, passed, detail });
  }
  return { passed: verdicts.every((v) => v.passed), graders: verdicts };
}
