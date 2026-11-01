// A headless, operator-answered docs-tool session for a repo that is not an arm (arms use `setup-arm.ts --auto`).
//   bun evals/ab/operated-session.ts --cwd <dir> --plugin-dir <dir> --command "/lean-doc-generator init" --answers <repo>
//        [--rule-file <json>] [--log <file>] [--allow-tools Read,Glob,...] [--answers-dir <dir>] [--work <dir>] [--auth subscription|api-key]
// Runs with an isolated config dir (made beside the cwd, or in --work) so no installed user plugin loads. Exit 0 done, 3 stopped, 1 failed, 2 refused.
// Maintainer-only; the session is a paid subscription session.
import fs from "node:fs";
import path from "node:path";
import type { Arm } from "./lib/arm.ts";
import { makeIsolation, isolationEnv } from "./lib/isolate.ts";
import { parseRules } from "./lib/operator.ts";
import { operatedCommand, readAnswers, reportAndExit, runOperatedSession } from "./lib/operated-session.ts";
import { setupModel } from "./lib/setup.ts";

const flag = (n: string) => (process.argv.includes(`--${n}`) ? process.argv[process.argv.indexOf(`--${n}`) + 1] : undefined);
const refuse = (why: string): never => (console.error(`REFUSED: ${why}`), process.exit(2));
const need = (n: string) => flag(n) ?? refuse(`--${n} is required`);
const cwd = path.resolve(need("cwd"));
const pluginDir = path.resolve(need("plugin-dir"));
const command = need("command");
const repo = need("answers");
const auth = (flag("auth") ?? "subscription") as Arm["auth"];
if (auth !== "subscription" && auth !== "api-key") refuse("--auth must be subscription or api-key");
for (const [n, d] of [["--cwd", cwd], ["--plugin-dir", pluginDir]] as const) if (!fs.existsSync(d)) refuse(`${n} ${d} does not exist`);

let files!: ReturnType<typeof readAnswers>;
let rules: ReturnType<typeof parseRules> = [];
try {
  files = readAnswers(path.resolve(flag("answers-dir") ?? path.join(import.meta.dir, "answers")), repo);
  if (flag("rule-file")) rules = parseRules(fs.readFileSync(path.resolve(flag("rule-file")!), "utf8"));
} catch (e) {
  refuse((e as Error).message);
}
const log = path.resolve(flag("log") ?? path.join(cwd, "..", `operator-${new Date().toISOString().replace(/[:.]/g, "-")}.jsonl`));
const allowTools = ["Read", "Glob", "Grep", "Skill", ...(flag("allow-tools")?.split(",").filter(Boolean) ?? [])];
const inv = JSON.parse(fs.readFileSync(path.join(import.meta.dir, "arms", "inventory.json"), "utf8")) as { permissionMode: string };

const arm = { auth, dispatch: {} } as Arm;
const iso = makeIsolation(path.resolve(flag("work") ?? path.join(cwd, "..")), arm);
console.log(`isolated config dir (transcript lands here): ${iso.cfg}`);
const cmd = operatedCommand(["--plugin-dir", pluginDir, "--model", setupModel(), "--permission-mode", inv.permissionMode]);
const res = await runOperatedSession({ cmd, cwd, env: isolationEnv(iso, arm), prompt: command, files: files!, rules, allowTools, operatorLog: log });
process.exit(reportAndExit(res, log));
