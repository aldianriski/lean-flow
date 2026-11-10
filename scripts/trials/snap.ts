// Caller supplies: repository and watch directory; snapshot is printed to stdout, private files are excluded by name.
import { createHash } from "node:crypto";
import { lstatSync, readFileSync, readdirSync, readlinkSync } from "node:fs";
import { join } from "node:path";
import { args, cli, git, privatePath, required } from "./lib";

function treeHash(root: string, paths?: string[]) {
  const hash = createHash("sha256");
  const visit = (relative: string) => {
    if (privatePath(relative)) return;
    const path = join(root, relative);
    let stat;
    try { stat = lstatSync(path); } catch (error: any) {
      if (error.code !== "ENOENT") throw error;
      hash.update(`missing:${relative}\0`); return;
    }
    hash.update(`${relative}\0${stat.mode}\0`);
    if (stat.isSymbolicLink()) hash.update(readlinkSync(path));
    else if (stat.isDirectory()) {
      for (const entry of readdirSync(path).sort()) if (![".git", "node_modules"].includes(entry)) visit(join(relative, entry));
    } else if (stat.isFile()) hash.update(readFileSync(path));
    hash.update("\0");
  };
  for (const path of paths ?? [""]) visit(path);
  return hash.digest("hex");
}
export function snapshot(repo: string, watch: string) {
  const hash = (s: string) => createHash("sha256").update(s).digest("hex");
  const files = [...new Set(git(repo, ["ls-files", "-z", "--cached", "--others", "--exclude-standard"]).split("\0").filter(Boolean))].sort();
  return `repo-status ${hash(git(repo, ["status", "--porcelain"]))} repo-refs ${hash(git(repo, ["for-each-ref"]))} repo-files ${treeHash(repo, files)} watch ${treeHash(watch)}`;
}
const usage = "usage: bun --no-env-file scripts/trials/snap.ts --repo DIR --watch-dir DIR";
if (import.meta.main) cli(usage, () => {
  const a = args(usage); console.log(snapshot(required(a, "--repo"), required(a, "--watch-dir")));
});
