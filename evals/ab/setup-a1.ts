// Owner-run setup of the clinic A1 arm: an INTERACTIVE claude session in the clinic-a1 snapshot that loads ONLY the pinned
// 2.19.1 plugin, so the owner can run `/lean-doc-generator init` and answer each popup verbatim from evals/ab/answers/clinic.md.
//   bun evals/ab/setup-a1.ts          prints the plan and the exact command, starts nothing
//   bun evals/ab/setup-a1.ts --run    creates the isolated config dir and starts the session (inherits this terminal)
// Maintainer-only; no trial and no gate. The session itself is a paid subscription session, started by the owner.
import fs from "node:fs";
import path from "node:path";
import { loadArm } from "./lib/arm.ts";
import { manifestOf, REPO_ROOT } from "./lib/freeze.ts";
import { makeIsolation, isolationEnv } from "./lib/isolate.ts";
import { setupCommand } from "./lib/setup.ts";
import { verifyPin } from "./lib/pin.ts";
import { diffManifest } from "./lib/snapshot.ts";

const arm = loadArm(path.join(import.meta.dir, "arms", "clinic-a1.json"));
const WORK = "D:/Research/ab-init-clinic-a1"; // outside the repo: holds the isolated config dir and with it the retained transcript
const run = process.argv.includes("--run");

if (!arm.snapshot || !arm.plugin) throw new Error("clinic-a1.json needs snapshot and plugin");
const problems = [...verifyPin(arm.plugin)];
const pre = JSON.parse(fs.readFileSync(path.join(import.meta.dir, "arms", "clinic-a1.pre-init.manifest.json"), "utf8")) as Record<string, string>;
if (!fs.existsSync(arm.snapshot)) problems.push(`snapshot ${arm.snapshot} does not exist`);
else if (!process.argv.includes("--resume")) {
  const drift = diffManifest(pre, manifestOf(arm.snapshot));
  if (drift.length > 0) problems.push(`snapshot is no longer the pre-init copy (${drift.slice(0, 5).join(", ")}${drift.length > 5 ? ", ..." : ""}); pass --resume to continue an init in progress`);
}
if (problems.length > 0) (console.error(`REFUSED: ${problems.join("; ")}`), process.exit(2));

const claude = setupCommand(arm);
if (!run) {
  console.log(`plugin  ${arm.plugin.path}  (verified: pinned hash matches, tree clean)\nsnapshot ${arm.snapshot}  (verified: still the pre-init copy)`);
  console.log(`\nRun:\n  bun ${path.relative(REPO_ROOT, path.join(import.meta.dir, "setup-a1.ts")).split(path.sep).join("/")} --run [--resume]\n`);
  console.log(`That starts, with cwd = the snapshot and an isolated CLAUDE_CONFIG_DIR (no user plugins, settings or memory; only the credentials file is byte-copied):\n  ${claude.join(" ")}`);
  console.log(`\nThen type: /lean-doc-generator init   -- answer every popup verbatim from evals/ab/answers/clinic.md (setup operator reads clinic-operator.md too).`);
  console.log(`Transcript: <config dir>/projects/<cwd-encoded>/*.jsonl, config dir = ${WORK}/iso-*/cfg (printed again when the session ends). Keep it.`);
  console.log(`After the init: freeze the arm (compute the manifest, write clinic-a1.manifest.json, add "manifest" to clinic-a1.json), then build clinic-a0.`);
  process.exit(0);
}

fs.mkdirSync(WORK, { recursive: true });
const iso = makeIsolation(WORK, arm);
console.log(`isolated config dir (transcript lands here): ${iso.cfg}`);
const p = Bun.spawn(claude, { cwd: arm.snapshot, env: isolationEnv(iso, arm), stdin: "inherit", stdout: "inherit", stderr: "inherit" });
const code = await p.exited;
const transcripts: string[] = [];
const walk = (d: string) => fs.existsSync(d) && fs.readdirSync(d, { withFileTypes: true }).forEach((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : e.name.endsWith(".jsonl") && transcripts.push(path.join(d, e.name))));
walk(path.join(iso.cfg, "projects"));
console.log(`session ended (exit ${code}). Retained transcripts:\n${transcripts.map((t) => `  ${t}`).join("\n") || "  (none found under " + iso.cfg + ")"}`);
process.exit(code);
