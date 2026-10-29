// Config and access isolation. A trial sees: its own copy of the repo, a temp home, an isolated config dir.
// The one thing taken from the real user config is the credentials file, as a byte copy that is never read.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import type { Arm } from "./arm.ts";

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
