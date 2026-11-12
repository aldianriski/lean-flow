// SPRINT-173 T2 (TASK-652, L-258): a real work commit carrying a task's move AND tick.
// Keep both rename paths visible to the checker; no task-file path is declared in Layers.
import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { posix } from "node:path";
import { commitAll, setDodTicked, writeFile } from "./git-fixtures.ts";

export function commitTaskMove(dir: string, from: string, to: string, message: string): string[] {
  mkdirSync(posix.dirname(posix.join(dir, to)), { recursive: true });
  execFileSync("git", ["-C", dir, "mv", from, to]);
  setDodTicked(dir, to);
  writeFile(dir, "src/a.ts", `${message}\n`);
  commitAll(dir, message);
  return execFileSync("git", ["-C", dir, "diff-tree", "--no-commit-id", "--name-only", "-r", "HEAD"], {
    encoding: "utf8",
  }).trim().split("\n").sort();
}
