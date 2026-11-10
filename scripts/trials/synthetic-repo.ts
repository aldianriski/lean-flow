// Caller supplies: a new repository directory under a disposable temp root; optional --manual-repair seeds a fault.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { args, cli, git, required } from "./lib";
import type { OracleKey } from "./merge-oracle";

// Synthetic history: unrelated bookkeeping merge, then two selected merges; no real trial inputs.
export function makeRepo(root: string) {
  mkdirSync(root);
  git(root, ["init", "--quiet", "--initial-branch=integration"]);
  git(root, ["config", "user.name", "Trial Fixture"]);
  git(root, ["config", "user.email", "fixture@example.invalid"]);
  git(root, ["config", "commit.gpgSign", "false"]);
  const write = (name: string, text: string) => writeFileSync(join(root, name), text);
  const commit = (message: string) => { git(root, ["add", "."]); git(root, ["commit", "--quiet", "-m", message]); return git(root, ["rev-parse", "HEAD"]); };
  write("alpha.txt", "base\n"); write("beta.txt", "keep\n"); write("stable.txt", "fixed\n");
  const base = commit("base");
  const merge = (branch: string, file: string, content: string) => {
    git(root, ["checkout", "--quiet", "-b", branch, base]); write(file, content); commit(branch);
    git(root, ["checkout", "--quiet", "integration"]);
    git(root, ["merge", "--quiet", "--no-ff", branch, "-m", branch]);
    return git(root, ["rev-parse", "HEAD"]);
  };
  merge("bookkeeping", "notes.txt", "bookkeeping\n");
  const first = merge("first", "alpha.txt", "retained grant\n");
  const second = merge("second", "beta.txt", "keep\nfinished\n");
  const key: OracleKey = { base, branch: "integration", excludePaths: ["^notes\\.txt$"],
    merges: [{ name: "M1", include: ["alpha.txt"], files: ["alpha.txt"] },
      { name: "M2", include: ["beta.txt"], exclude: ["alpha.txt"], files: ["beta.txt"] }],
    manualRepair: { after: "M1", paths: ["alpha.txt", "beta.txt"] },
    content: [{ name: "GRANT_LOST", path: "alpha.txt", includes: ["retained grant"], rejects: ["bare grant"] },
      { name: "STABLE_CHANGED", path: "stable.txt", unchanged: true }] };
  return { base, first, second, key, write, commit };
}

const usage = "usage: bun --no-env-file scripts/trials/synthetic-repo.ts --repo DIR [--manual-repair]";
if (import.meta.main) cli(usage, () => {
  const a = args(usage, ["--manual-repair"]), fixture = makeRepo(required(a, "--repo"));
  if (a["--manual-repair"]) { fixture.write("alpha.txt", "bare grant\n"); fixture.commit("manual repair"); }
  const { base, first, second, key } = fixture;
  console.log(JSON.stringify({ base, first, second, key }));
});
