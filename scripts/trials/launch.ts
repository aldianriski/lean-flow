// Caller supplies: standalone scratch repo, plugin, deny JSON, prompt, model; optional host/key/dir strings via flags or env; --run requires budget.
import { closeSync, existsSync, lstatSync, mkdirSync, openSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { join, resolve } from "node:path";
import { args, cli, readJson, readText, required, scratchRepo, type Args } from "./lib";

const usage = "usage: bun --no-env-file scripts/trials/launch.ts --repo DIR --plugin-dir DIR --deny-file F --prompt-file F --model NAME [--run --budget-usd N] [--host HOST --key-path PATH --gate-dir DIR] [--claude-bin EXE]";
export function launch(a: Args) {
  const repo = scratchRepo(required(a, "--repo")), model = required(a, "--model");
  const plugin = resolve(required(a, "--plugin-dir"));
  const deny = readJson<string[]>(required(a, "--deny-file"));
  if (!Array.isArray(deny) || deny.some(x => typeof x !== "string")) throw new Error("deny file must be a string array");
  const prompt = readText(required(a, "--prompt-file"));
  const budget = a["--budget-usd"] === undefined ? undefined : Number(a["--budget-usd"]);
  if ((a["--run"] && budget === undefined) || (budget !== undefined && (!Number.isFinite(budget) || budget <= 0)))
    throw new Error("--run requires a positive finite --budget-usd");
  const executable = a["--claude-bin"] as string ?? "claude";
  const command = ["-p", prompt, "--model", model, "--setting-sources", "project", "--plugin-dir", plugin,
    "--permission-mode", "bypassPermissions", "--allowedTools", "Read,Glob,Grep,Edit,Write,Bash,Agent,Task,Skill,SendMessage,TodoWrite",
    ...(deny.length ? ["--disallowedTools", ...deny] : []), "--output-format", "stream-json", "--verbose",
    ...(budget !== undefined ? ["--max-budget-usd", String(budget)] : []),
    ...(a["--agent"] ? ["--agent", required(a, "--agent")] : [])];
  const sha = createHash("sha256").update(prompt).digest("hex");
  const shown = [executable, ...command.map((v, i) => i === 1 ? `<prompt sha256 ${sha}>` : v)].map(v => JSON.stringify(v)).join(" ");
  console.log(`cwd ${repo}\n${shown}`);
  if (!a["--run"]) { console.log("spend: 0.000000 USD (no call made)"); return 0; }
  // Refuse a pre-existing output path, including a symlink/junction: no traversal or overwrite through it.
  const output = join(repo, ".git", "trial-run");
  if (existsSync(output)) throw new Error("trial-run output already exists; use a fresh scratch repository");
  if (lstatSync(join(repo, ".git")).isSymbolicLink()) throw new Error("scratch .git must not be a symlink");
  mkdirSync(output);
  const tmp = join(output, "tmp"); mkdirSync(tmp);
  const env: NodeJS.ProcessEnv = { ...process.env,
    TMP: tmp, TEMP: tmp, TMPDIR: tmp, BUN_INSTALL_CACHE_DIR: join(output, "bun-cache"),
    // CLAUDE_CONFIG_DIR is inherited, never redirected: a fresh config dir holds no credentials, so the child fails
    // `authentication_failed` (SPRINT-171 T2 probe). Each scratch repo's own path already keeps its transcripts apart.
    XDG_CACHE_HOME: join(output, "cache"),
    CLAUDE_CODE_PRINT_BG_WAIT_CEILING_MS: "0", DISABLE_AUTOUPDATER: "1" };
  for (const [flag, variable] of [["--host", "LF_GATE_HOST"], ["--key-path", "LF_GATE_KEY"], ["--gate-dir", "LF_GATE_DIR"]] as const)
    if (a[flag]) env[variable] = required(a, flag); // The credential path is passed, never opened.
  writeFileSync(join(output, "run.cmd"), shown + "\n");
  const out = openSync(join(output, "run.jsonl"), "wx"), err = openSync(join(output, "run.err"), "wx");
  const started = Date.now();
  let status: number;
  try {
    const child = spawnSync(executable, command, { cwd: repo, env, shell: false, windowsHide: true, stdio: ["ignore", out, err] });
    status = child.status ?? 1;
    writeFileSync(join(output, "run.exit"), `code ${status} signal ${child.signal ?? "null"} wall_ms ${Date.now() - started} started ${new Date(started).toISOString()}\n`);
    if (child.error) throw child.error;
  } finally { closeSync(out); closeSync(err); }
  console.log(`launch: exit ${status}`);
  return status;
}
if (import.meta.main) cli(usage, () => { process.exitCode = launch(args(usage, ["--run"])); });
