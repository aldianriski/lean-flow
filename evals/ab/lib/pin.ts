// Plugin pin: verified against the directory the CLI will load, never merely echoed from the arm config.
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { manifest } from "./snapshot.ts";

export type PluginPin = { path: string; sha: string; hash: string };
export type InitPlugin = { name: string; path: string; source: string };

function git(dir: string, ...args: string[]): { out: string; ok: boolean } {
  const r = Bun.spawnSync(["git", "-C", dir, ...args]);
  return { out: r.stdout.toString().trim(), ok: r.exitCode === 0 };
}

/** SHA-256 over every file in `dir` (tracked or not, `.git` excluded): path + git blob id, sorted. */
export function hashDir(dir: string): string {
  const files = manifest(dir);
  const h = createHash("sha256");
  for (const k of Object.keys(files).filter((f) => !f.startsWith(".git/")).sort()) h.update(`${k}\0${files[k]}\n`);
  return h.digest("hex");
}

export function computePin(dir: string): { sha: string; hash: string } {
  const head = git(dir, "rev-parse", "HEAD");
  if (!head.ok) throw new Error(`${dir} is not a git checkout with a commit`);
  return { sha: head.out, hash: hashDir(dir) };
}

/** Reasons to refuse; empty means the directory on disk is exactly what the arm pinned. */
export function verifyPin(pin: PluginPin): string[] {
  if (!fs.existsSync(pin.path)) return [`plugin dir ${pin.path} does not exist`];
  const reasons: string[] = [];
  const head = git(pin.path, "rev-parse", "HEAD");
  if (!head.ok) return [`plugin dir ${pin.path} is not a git checkout`];
  if (head.out !== pin.sha) reasons.push(`plugin is at commit ${head.out}, the arm pins ${pin.sha}`);
  if (git(pin.path, "status", "--porcelain").out !== "") reasons.push("plugin tree has uncommitted or untracked changes");
  const hash = hashDir(pin.path);
  if (hash !== pin.hash) reasons.push(`plugin content hash is ${hash}, the arm pins ${pin.hash}`);
  return reasons;
}

const norm = (p: string) => path.resolve(p).toLowerCase();

/** Problems with the plugins the finished run's init event reports; empty means valid. */
export function checkInitPlugins(plugins: InitPlugin[], pinnedPath: string | undefined): string[] {
  const loaded = plugins.filter((p) => p.path !== "builtin");
  if (pinnedPath === undefined) return loaded.map((p) => `A0 must load no plugin, init names ${p.name} at ${p.path}`);
  const problems = loaded.filter((p) => norm(p.path) !== norm(pinnedPath)).map((p) => `init names a plugin that is not the pinned one: ${p.name} at ${p.path}`);
  if (!loaded.some((p) => norm(p.path) === norm(pinnedPath))) problems.push(`init does not name the pinned plugin at ${pinnedPath}`);
  return problems;
}
