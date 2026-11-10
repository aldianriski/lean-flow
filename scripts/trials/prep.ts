// Caller supplies: local source repository, base revision, new destination and optional scratch branch name.
import { existsSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { args, canonicalPath, cli, git, privatePath, required } from "./lib";

export function prep(repo: string, base: string, dest: string, branch = "trial") {
  const source = canonicalPath(repo), target = resolve(dest);
  if (existsSync(target)) throw new Error(`destination exists: ${target}`);
  const sha = git(source, ["rev-parse", "--verify", `${base}^{commit}`]);
  const forbidden = git(source, ["ls-tree", "-r", "--name-only", sha]).split(/\r?\n/).some(privatePath);
  if (forbidden) throw new Error("base contains a private file; supply a sanitized source repository");
  git(source, ["check-ref-format", "--branch", branch]);
  mkdirSync(dirname(target), { recursive: true });
  // Fetch only the chosen ancestry: no future refs/objects, hardlinks, remotes, install or network.
  git(dirname(target), ["init", "--quiet", target]);
  git(target, ["-c", "protocol.file.allow=always", "fetch", "--quiet", "--no-tags", "--no-write-fetch-head", source, sha]);
  git(target, ["checkout", "--quiet", "-b", branch, sha]);
  if (git(target, ["remote"]) || git(target, ["status", "--porcelain"]) || git(target, ["rev-parse", "HEAD"]) !== sha)
    throw new Error("prepared repository failed isolation checks");
  return sha;
}
const usage = "usage: bun --no-env-file scripts/trials/prep.ts --repo DIR --base REF --dest NEW-DIR [--branch NAME]";
if (import.meta.main) cli(usage, () => {
  const a = args(usage), dest = required(a, "--dest");
  const head = prep(required(a, "--repo"), required(a, "--base"), dest, a["--branch"] as string | undefined);
  console.log(`prep: head ${head.slice(0, 8)} · remotes none · status clean · PASS`);
});
