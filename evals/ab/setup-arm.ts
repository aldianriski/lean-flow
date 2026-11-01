// Owner-run setup of an arm: an INTERACTIVE claude session in the arm's snapshot that loads ONLY the arm's pinned plugin, so the owner can run
// the arm's lean-doc-generator skill (init for a pre-init arm, migrate for a pre-migrate arm) and answer each popup verbatim from evals/ab/answers/.
//   bun evals/ab/setup-arm.ts --arm <id>          prints the plan and the exact command, starts nothing
//   bun evals/ab/setup-arm.ts --arm <id> --run    creates the isolated config dir and starts the session (inherits this terminal)
//   bun evals/ab/setup-arm.ts --arm <id> --auto   same refusals and isolated config, but HEADLESS: the setup operator answers every popup from the frozen
//                                                  answers files (exit 0 done, 3 stopped on a popup it cannot answer -- printed in full, 1 failed)
//   --resume continues a setup in progress (skips the snapshot-equals-pre-setup check); --arms-dir <dir> reads arm files from elsewhere (selftest fixtures)
// Maintainer-only; no trial and no gate. The session itself is a paid subscription session, started by the owner.
import fs from "node:fs";
import path from "node:path";
import { loadArm } from "./lib/arm.ts";
import { manifestOf, REPO_ROOT } from "./lib/freeze.ts";
import { makeIsolation, isolationEnv } from "./lib/isolate.ts";
import { setupCommand } from "./lib/setup.ts";
import { verifyPin } from "./lib/pin.ts";
import { diffManifest } from "./lib/snapshot.ts";
import { buildCatalog, CLEANUP_RULING, makeAnswerer, modelCall, PLAN_RULING } from "./lib/classifier.ts";
import { operatedCommand, readAnswers, reportAndExit, runOperatedSession } from "./lib/operated-session.ts";

const flag = (n: string) => (process.argv.includes(`--${n}`) ? process.argv[process.argv.indexOf(`--${n}`) + 1] : undefined);
const refuse = (why: string): never => (console.error(`REFUSED: ${why}`), process.exit(2));
const id = flag("arm");
if (!id || id.startsWith("--")) refuse("--arm <id> is required");
const armsDir = path.resolve(flag("arms-dir") ?? path.join(import.meta.dir, "arms"));
const run = process.argv.includes("--run");
const auto = process.argv.includes("--auto");
if (run && auto) refuse("--run and --auto are exclusive");
const resume = process.argv.includes("--resume");
if (!fs.existsSync(path.join(armsDir, `${id}.json`))) refuse(`no arm file ${path.join(armsDir, `${id}.json`)}`);
let arm!: ReturnType<typeof loadArm>;
try {
  arm = loadArm(path.join(armsDir, `${id}.json`));
} catch (e) {
  refuse((e as Error).message);
}
const repo = id!.replace(/-a\d+$/, "");
const WORK = flag("work") ?? `D:/Research/ab-setup-${id}`; // outside the repo: holds the isolated config dir and with it the retained transcript

if (!arm.snapshot || !arm.plugin) refuse(`${id}.json needs snapshot and plugin`);
// the session starts with cwd = the snapshot, so a relative path could verify one checkout and load another
for (const [name, p] of [["plugin.path", arm.plugin!.path], ["snapshot", arm.snapshot!]] as const) if (!path.isAbsolute(p)) refuse(`${id}.json ${name} "${p}" is not an absolute path`);
// the pre-setup manifest names the skill: pre-init -> init, pre-migrate -> migrate; exactly one must exist
const kinds = (["init", "migrate"] as const).filter((k) => fs.existsSync(path.join(armsDir, `${id}.pre-${k}.manifest.json`)));
if (kinds.length === 0) refuse(`no pre-setup manifest for ${id} (expected ${id}.pre-init.manifest.json or ${id}.pre-migrate.manifest.json)`);
if (kinds.length > 1) refuse(`${id} has both a pre-init and a pre-migrate manifest; keep exactly one`);
const kind = kinds[0]!;
const problems = [...verifyPin(arm.plugin!)];
const pre = JSON.parse(fs.readFileSync(path.join(armsDir, `${id}.pre-${kind}.manifest.json`), "utf8")) as Record<string, string>;
if (!fs.existsSync(arm.snapshot!)) problems.push(`snapshot ${arm.snapshot} does not exist`);
else if (!resume) {
  const drift = diffManifest(pre, manifestOf(arm.snapshot!));
  if (drift.length > 0) problems.push(`snapshot is no longer the pre-${kind} copy (${drift.slice(0, 5).join(", ")}${drift.length > 5 ? ", ..." : ""}); pass --resume to continue a ${kind} in progress`);
}
if (problems.length > 0) refuse(problems.join("; "));

const claude = setupCommand(arm);
if (!run && !auto) {
  console.log(`plugin  ${arm.plugin!.path}  (verified: pinned hash matches, tree clean)\nsnapshot ${arm.snapshot}  (verified: ${resume ? "drift check skipped by --resume" : `still the pre-${kind} copy`})`);
  console.log(`\nRun:\n  bun ${path.relative(REPO_ROOT, path.join(import.meta.dir, "setup-arm.ts")).split(path.sep).join("/")} --arm ${id} --run [--resume]\n`);
  console.log(`That starts, with cwd = the snapshot and an isolated CLAUDE_CONFIG_DIR (no user plugins, settings or memory; only the credentials file is byte-copied):\n  ${claude.join(" ")}`);
  console.log(`\nThen type: /lean-doc-generator ${kind}   -- answer every popup verbatim from evals/ab/answers/${repo}.md (setup operator reads evals/ab/answers/${repo}-operator.md too).`);
  console.log(`Transcript: <config dir>/projects/<cwd-encoded>/*.jsonl, config dir = ${WORK}/iso-*/cfg (printed again when the session ends). Keep it.`);
  console.log(`After the ${kind}: freeze the arm (compute the manifest, write ${id}.manifest.json, add "manifest" to ${id}.json).`);
  process.exit(0);
}

fs.mkdirSync(WORK, { recursive: true });
if (flag("auth")) arm.auth = flag("auth") as typeof arm.auth; // test hook: the selftest runs without credentials
const iso = makeIsolation(WORK, arm);
console.log(`isolated config dir (transcript lands here): ${iso.cfg}`);
if (auto) {
  // the model classifier only CHOOSES an entry; a migrate arm also gets the two owner rulings (SPRINT-154): the plan is approved for the
  // profile items only, and an existing file is left untouched. An init arm gets neither class.
  let files!: ReturnType<typeof readAnswers>;
  try {
    files = readAnswers(path.resolve(flag("answers-dir") ?? path.join(import.meta.dir, "answers")), repo);
  } catch (e) {
    refuse((e as Error).message);
  }
  const catalog = buildCatalog(files, kind === "migrate" ? [PLAN_RULING, CLEANUP_RULING] : []);
  const env = isolationEnv(iso, arm);
  const log = path.join(WORK, `operator-${id}.jsonl`);
  // the claude command minus its leading binary, behind the stream-json flags (operatedCommand puts the binary, or a test's fake CLI, first)
  const res = await runOperatedSession({ cmd: operatedCommand(claude.slice(1)), cwd: arm.snapshot!, env, prompt: `/lean-doc-generator ${kind}`, answerer: makeAnswerer(catalog, modelCall(env)), allowTools: [...arm.allowedTools, "Read", "Glob", "Grep"], operatorLog: log });
  process.exit(reportAndExit(res, log));
}
const p = Bun.spawn(claude, { cwd: arm.snapshot, env: isolationEnv(iso, arm), stdin: "inherit", stdout: "inherit", stderr: "inherit" });
const code = await p.exited;
const transcripts: string[] = [];
const walk = (d: string) => fs.existsSync(d) && fs.readdirSync(d, { withFileTypes: true }).forEach((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : e.name.endsWith(".jsonl") && transcripts.push(path.join(d, e.name))));
walk(path.join(iso.cfg, "projects"));
console.log(`session ended (exit ${code}). Retained transcripts:\n${transcripts.map((t) => `  ${t}`).join("\n") || "  (none found under " + iso.cfg + ")"}`);
process.exit(code);
