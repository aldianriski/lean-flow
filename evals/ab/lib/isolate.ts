// Config and access isolation. A trial sees: its own copy of the repo, a temp home, an isolated config dir.
// The one thing taken from the real user config is the credentials file, as a byte copy that is never read.
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import type { Arm } from "./arm.ts";
import { REPO_ROOT } from "./freeze.ts";

export type Isolation = {
  root: string;
  /** cwd of the trial: a fresh copy of the repo goes here */
  trialDir: string;
  /** HOME / USERPROFILE of the trial */
  home: string;
  /** CLAUDE_CONFIG_DIR of the trial */
  cfg: string;
  /** a directory beside the others, for files a trial must NOT be able to read */
  outside: string;
};

export function makeIsolation(workRoot: string, arm: Pick<Arm, "auth">, settings: Record<string, unknown> = {}): Isolation {
  const root = fs.mkdtempSync(path.join(fs.realpathSync.native(workRoot), "iso-"));
  const iso: Isolation = { root, trialDir: path.join(root, "trial"), home: path.join(root, "home"), cfg: path.join(root, "cfg"), outside: path.join(root, "outside") };
  for (const d of [iso.trialDir, iso.home, iso.cfg, iso.outside]) fs.mkdirSync(d, { recursive: true });
  if (arm.auth === "subscription") {
    const creds = path.join(os.homedir(), ".claude", ".credentials.json");
    if (!fs.existsSync(creds)) throw new Error(`subscription auth needs ${creds}; log in once with the real CLI`);
    fs.copyFileSync(creds, path.join(iso.cfg, ".credentials.json")); // byte copy -- contents are never read or logged
  }
  fs.writeFileSync(path.join(iso.cfg, "settings.json"), JSON.stringify(settings, null, 2));
  return iso;
}

/** The trial's environment: the parent's minus every ANTHROPIC_ and CLAUDE_ prefixed variable, with home and config redirected. */
export function isolationEnv(iso: Isolation, arm: Arm): Record<string, string> {
  const env: Record<string, string> = {};
  for (const [k, v] of Object.entries(process.env)) if (v !== undefined && !/^(ANTHROPIC_|CLAUDE_)/i.test(k)) env[k] = v;
  env.HOME = iso.home;
  env.USERPROFILE = iso.home;
  env.CLAUDE_CONFIG_DIR = iso.cfg;
  if (arm.auth === "api-key" && process.env.ANTHROPIC_API_KEY) env.ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
  if (arm.dispatch.subagent) env.CLAUDE_CODE_SUBAGENT_MODEL = arm.dispatch.subagent;
  return env;
}

/** Where isolation dirs live: `AB_WORK_ROOT`, else `D:/ab-work` on win32 (C: fills on A/B work), else the temp dir. Refused when unsafe (see `assertWorkRoot`). */
export function defaultWorkRoot(env: Record<string, string | undefined> = process.env): string {
  const root = path.resolve(env.AB_WORK_ROOT ?? (process.platform === "win32" ? "D:/ab-work" : path.join(os.tmpdir(), "ab-work")));
  assertWorkRoot(root);
  fs.mkdirSync(root, { recursive: true });
  return root;
}

/** A work root is deleted into, so it must be neither a drive root nor the repo (or a parent of it). */
export function assertWorkRoot(root: string): void {
  const r = path.resolve(root);
  if (path.parse(r).root === r) throw new Error(`work root ${r} is a drive root`);
  const rel = path.relative(r, REPO_ROOT);
  if (rel === "" || (!rel.startsWith("..") && !path.isAbsolute(rel))) throw new Error(`work root ${r} is the repo or contains it`);
}

/**
 * A driver that died mid-trial leaves its isolation dir (and maybe a running cluster). Called by the driver once it holds the lock, so
 * every `iso-*` dir in the work root is stale: stop any cluster in its `pgdata` (failure ignored), keep its stream*.jsonl under kept/,
 * delete it. Returns what was swept.
 */
export function sweepStale(workRoot: string, say: (line: string) => void = () => {}): string[] {
  assertWorkRoot(workRoot);
  if (!fs.existsSync(workRoot)) return [];
  const swept: string[] = [];
  for (const d of fs.readdirSync(workRoot)) {
    const root = path.join(workRoot, d);
    if (!/^iso-/.test(d) || !fs.statSync(root).isDirectory()) continue;
    const data = path.join(root, "pgdata");
    const stopped = fs.existsSync(data);
    if (stopped) spawnSync("pg_ctl", ["-D", data, "-m", "fast", "-w", "stop"], { stdio: "ignore" });
    cleanupIsolation({ root } as Isolation, workRoot);
    swept.push(d);
    say(`swept stale ${d}${stopped ? " (cluster stopped)" : ""}${fs.existsSync(root) ? " -- could not be removed" : ""}`);
  }
  return swept;
}

/**
 * After a trial's row is appended: keep its small evidence (stream*.jsonl) under `<workRoot>/kept/<iso dir name>/` and delete the rest of
 * the isolation dir (trial copy, node_modules, pgdata, home, cfg). Deletes nothing that is not inside `workRoot`. Never throws.
 */
export function cleanupIsolation(iso: Isolation, workRoot: string): void {
  try {
    assertWorkRoot(workRoot);
    const root = path.resolve(iso.root);
    const rel = path.relative(fs.realpathSync.native(workRoot), fs.realpathSync.native(root));
    if (rel === "" || rel.startsWith("..") || path.isAbsolute(rel)) return;
    const keep = path.join(workRoot, "kept", path.basename(root));
    for (const f of fs.readdirSync(root)) {
      if (!/^stream.*\.jsonl$/.test(f)) continue;
      fs.mkdirSync(keep, { recursive: true });
      fs.renameSync(path.join(root, f), path.join(keep, f));
    }
    fs.rmSync(root, { recursive: true, force: true, maxRetries: 5, retryDelay: 300 });
  } catch {
    /* a leftover dir is clutter, never a trial result */
  }
}
