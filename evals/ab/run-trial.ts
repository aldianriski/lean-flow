// One pinned, isolated, measured trial:
//   bun evals/ab/run-trial.ts --arm <arm.json> --task <task.json> --repo <dir> [--trial 1] [--attempt 1] [--log <md>] [--tag <text>] [--protocol d9]
//   bun evals/ab/run-trial.ts --print-pin <plugin-dir>     (prints the sha + content hash to paste into an arm)
// Maintainer-only and paid; never part of `bun test` or the gate.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { loadArm } from "./lib/arm.ts";
import { loadTask } from "./lib/grade.ts";
import { computePin } from "./lib/pin.ts";
import { DEFAULT_LOG } from "./lib/record.ts";
import { runProtocolTrial } from "./lib/protocol.ts";
import { PinRefused, runTrial } from "./lib/trial.ts";

const argv = process.argv.slice(2);
const flag = (name: string): string | undefined => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 ? argv[i + 1] : undefined;
};

const pinDir = flag("print-pin");
if (pinDir) {
  console.log(JSON.stringify(computePin(path.resolve(pinDir)), null, 2));
  process.exit(0);
}

const need = (name: string) => flag(name) ?? (console.error(`missing --${name}`), process.exit(2));
const repo = path.resolve(need("repo"));
const workRoot = path.join(os.tmpdir(), "ab-work");
fs.mkdirSync(workRoot, { recursive: true });

try {
  const r = await (flag("protocol") === "d9" ? runProtocolTrial : runTrial)({
    arm: loadArm(path.resolve(need("arm"))),
    task: loadTask(path.resolve(need("task"))),
    srcRepo: repo,
    repo: path.basename(repo),
    trial: Number(flag("trial") ?? 1),
    attempt: Number(flag("attempt") ?? 1),
    workRoot,
    logPath: path.resolve(flag("log") ?? DEFAULT_LOG),
    tag: flag("tag") ?? "smoke -- not a measurement",
  });
  console.log(`graders: ${r.row.graders}\nexit: ${r.exit}\npassed: ${r.row.passed}`);
  if (r.exit === "usage-missing") console.error("STOP: the CLI reported no usage. A usage-missing row was logged; this needs an owner ruling.");
  process.exit(r.valid ? 0 : 1);
} catch (e) {
  console.error(e instanceof PinRefused ? `REFUSED: ${e.message}` : `ERROR: ${(e as Error).message}`);
  process.exit(e instanceof PinRefused ? 2 : 1);
}
