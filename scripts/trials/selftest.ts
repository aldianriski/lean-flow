// Caller supplies: nothing; optionally --temp-root DIR to keep disposable repositories in a chosen writable directory.
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, relative, resolve, sep } from "node:path";
import { makeRepo } from "./synthetic-repo";
import { args, canonicalPath, cli, gitResult, required, run, type Args } from "./lib";

const usage = "usage: bun --no-env-file scripts/trials/selftest.ts [--temp-root DIR]";
if (import.meta.main) cli(usage, () => {
  const a: Args = process.argv.length > 2 ? args(usage) : {};
  const parent = resolve(a["--temp-root"] ? required(a, "--temp-root") : tmpdir());
  mkdirSync(parent, { recursive: true });
  const dir = mkdtempSync(join(parent, "trials-selftest-"));
  const invoke = (script: string, args: string[]) => {
    const p = run([process.execPath, "--no-env-file", join(import.meta.dir, script + ".ts"), ...args]);
    if (p.code) throw new Error(`${script}: ${p.out}${p.err}`);
    return p.out;
  };
  try {
    const source = join(dir, "source"), scratch = join(dir, "scratch"), watch = join(dir, "sentinel");
    const fixture = makeRepo(source);
    mkdirSync(watch); writeFileSync(join(watch, "untouched.txt"), "sentinel\n");
    const before = invoke("snap", ["--repo", source, "--watch-dir", watch]);
    invoke("prep", ["--repo", source, "--base", fixture.base, "--dest", scratch]);
    if (gitResult(scratch, ["cat-file", "-e", fixture.first]).code === 0) throw new Error("later source object leaked into scratch");
    const key = join(dir, "oracle.json"), deny = join(dir, "deny.json"), prompt = join(dir, "prompt.txt");
    writeFileSync(key, JSON.stringify(fixture.key));
    writeFileSync(deny, '["Bash(git push *)"]'); writeFileSync(prompt, "Run the local checks.\n");
    invoke("merge-oracle", ["--wt", source, "--key", key]);
    const gate = join(dir, "gate.ts"); writeFileSync(gate, 'console.log("fixture: PASS");\n');
    invoke("preflight", ["--deny-file", deny, "--brief", prompt,
      "--gate-cmd", JSON.stringify([process.execPath, "--no-env-file", gate])]);
    const dry = invoke("launch", ["--repo", scratch, "--plugin-dir", source, "--deny-file", deny,
      "--prompt-file", prompt, "--model", "fixture-model", "--claude-bin", join(dir, "absent-claude")]);
    if (!dry.includes("spend: 0.000000 USD (no call made)")) throw new Error("dry-run guard did not report zero spend");
    const after = invoke("snap", ["--repo", source, "--watch-dir", watch]);
    if (before !== after) throw new Error("source/sentinel snapshot changed");
    console.log("source/sentinel snapshots: identical");
    console.log("trials selftest: PASS");
  } finally {
    const rel = relative(canonicalPath(parent), canonicalPath(dir));
    if (!rel || rel === ".." || rel.startsWith(".." + sep)) throw new Error("unsafe selftest cleanup");
    rmSync(dir, { recursive: true, force: true });
  }
});
