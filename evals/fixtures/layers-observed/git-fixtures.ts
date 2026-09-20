// evals/fixtures/layers-observed/git-fixtures.ts -- SPRINT-103 T2: TS-built throwaway git repos for
// check-layers-observed's differential + must-FAIL fixtures, mirroring evals/run-layers-observed-
// fixtures.sh's own idiom (a real git history, not a static file -- the checker's whole subject is a
// git diff) but built with fs/child_process rather than a new .sh file, per this task's "new
// executable logic is TypeScript run by Bun" constraint.
//
// Every builder returns the repo directory and the sprint file's path RELATIVE to it (the shape both
// the shell oracle and the TS port expect as argv, since both resolve paths against cwd).
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { posix } from "node:path";

function git(dir: string, args: string[]): string {
  return execFileSync("git", ["-C", dir, ...args], { encoding: "utf8" });
}

export function gitInit(dir: string): void {
  mkdirSync(dir, { recursive: true });
  git(dir, ["init", "-q"]);
}

export function writeFile(dir: string, rel: string, content: string): void {
  const full = posix.join(dir, rel);
  mkdirSync(posix.dirname(full), { recursive: true });
  writeFileSync(full, content);
}

export function commitAll(dir: string, message: string): void {
  git(dir, ["add", "-A"]);
  git(dir, ["-c", "user.name=Fixture Bot", "-c", "user.email=fixture@example.com", "commit", "-q", "-m", message]);
}

export function headSha(dir: string): string {
  return git(dir, ["rev-parse", "HEAD"]).trim();
}

export function shortSha(dir: string, sha: string): string {
  return git(dir, ["rev-parse", "--short", sha]).trim();
}

/** lock_plan(): mirrors this repo's own two-commit plan-lock convention (commit 1 freezes the Plan,
 *  commit 2 patches the sprint file's own plan_commit: field to point at commit 1). Returns commit
 *  1's sha. */
export function lockPlan(dir: string, sprintRel: string): string {
  commitAll(dir, "plan locked");
  const sha0 = headSha(dir);
  const full = posix.join(dir, sprintRel);
  const content = readFileSync(full, "utf8").replace("PLAN_COMMIT_PLACEHOLDER", sha0);
  writeFileSync(full, content);
  commitAll(dir, "record plan_commit sha");
  return sha0;
}

export function setDodTicked(dir: string, sprintRel: string): void {
  const full = posix.join(dir, sprintRel);
  const content = readFileSync(full, "utf8").replace(/^- \[ \] /m, "- [x] ");
  writeFileSync(full, content);
}

export function listDir(dir: string): string[] {
  try {
    return readdirSync(dir);
  } catch {
    return [];
  }
}
