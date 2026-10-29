// Self-test of the A/B trial harness (TASK-533). Run by hand: `bun evals/ab/selftest.ts [--paid]`.
// Deliberately NOT named *.test.ts: `bun test` is part of the repo gate and this harness is never gate machinery.
// Free checks S* make no model call; paid checks P* run a few headless haiku trials.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

export const AB = import.meta.dir;
export const SMOKE_REPO = path.join(AB, "fixtures", "smoke-repo");
const checks: { name: string; paid: boolean; fn: () => Promise<void> }[] = [];
const check = (name: string, fn: () => Promise<void>, paid = false) => checks.push({ name, paid, fn });

export function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}
export function tmpdir(tag: string): string {
  return fs.mkdtempSync(path.join(fs.realpathSync.native(os.tmpdir()), `ab-${tag}-`));
}
const task = async (id: string) => (await import("./lib/grade.ts")).loadTask(path.join(AB, "fixtures", "smoke-tasks", `${id}.json`));

/** A fresh fixture copy, optionally with the task's reference solution overlaid. */
async function fixtureCopy(solved: boolean): Promise<string> {
  const { copyTree } = await import("./lib/snapshot.ts");
  const dir = path.join(tmpdir("fx"), "repo");
  copyTree(SMOKE_REPO, dir);
  if (solved) copyTree(path.join(AB, "fixtures", "smoke-solutions", "add-fn"), dir);
  return dir;
}

// S3 -- grader verdicts. Each must-FAIL names the grader that fails; the control passes all.
check("S3 grader: failing acceptance / failing typecheck / missing artifact -> not-passed; control -> passed", async () => {
  const { grade } = await import("./lib/grade.ts");
  const t = await task("add-fn");
  const verdicts = (r: { graders: { name: string; passed: boolean }[] }) => r.graders.map((g) => `${g.name}:${g.passed}`).join(",");

  const control = await grade(t, await fixtureCopy(true));
  assert(control.passed && verdicts(control) === "typecheck:true,acceptance:true,build:true", `control must pass: ${verdicts(control)}`);

  const noMul = await grade(t, await fixtureCopy(false)); // unsolved: mul missing
  assert(!noMul.passed && verdicts(noMul).includes("acceptance:false"), `failing acceptance must be not-passed: ${verdicts(noMul)}`);

  const badTypes = await fixtureCopy(true);
  fs.appendFileSync(path.join(badTypes, "src", "add.ts"), 'export const broken: number = "text";\n');
  const typeFail = await grade(t, badTypes);
  assert(!typeFail.passed && verdicts(typeFail) === "typecheck:false,acceptance:true,build:true", `failing typecheck must be not-passed, others still run: ${verdicts(typeFail)}`);

  const missingArtifact = await grade({ ...t, graders: t.graders.map((g) => (g.artifact ? { ...g, artifact: "dist/never-built.js" } : g)) }, await fixtureCopy(true));
  assert(!missingArtifact.passed && verdicts(missingArtifact).endsWith("build:false"), `missing artifact must be not-passed: ${verdicts(missingArtifact)}`);
});

/** A throwaway plugin repo (git-committed) the pin checks can hash. */
function pluginRepo(): string {
  const dir = path.join(tmpdir("plug"), "plugin");
  fs.mkdirSync(path.join(dir, ".claude-plugin"), { recursive: true });
  fs.writeFileSync(path.join(dir, ".claude-plugin", "plugin.json"), JSON.stringify({ name: "pinned", version: "1.0.0" }));
  git(dir, "init", "-q");
  git(dir, "add", "-A");
  git(dir, "commit", "-q", "-m", "one");
  return dir;
}
function git(dir: string, ...args: string[]): string {
  const r = Bun.spawnSync(["git", "-c", "user.name=t", "-c", "user.email=t@t", "-C", dir, ...args]);
  assert(r.exitCode === 0, `git ${args.join(" ")} failed: ${r.stderr.toString()}`);
  return r.stdout.toString().trim();
}

// S1 -- the plugin pin is verified against the directory the CLI will load, not echoed from the config.
check("S1 pin: matching pin -> proceeds; other commit / other content / dirty tree -> refused before spawn", async () => {
  const { computePin, verifyPin } = await import("./lib/pin.ts");
  const dir = pluginRepo();
  const pin = { path: dir, ...computePin(dir) };
  assert(verifyPin(pin).length === 0, `control must verify: ${verifyPin(pin).join("; ")}`);

  const wrongSha = verifyPin({ ...pin, sha: "0".repeat(40) });
  assert(wrongSha.some((r) => r.includes("commit")), `a pin at a different commit must be refused naming the commit: ${wrongSha}`);
  const wrongHash = verifyPin({ ...pin, hash: "0".repeat(64) });
  assert(wrongHash.some((r) => r.includes("content hash")), `a pin with another content hash must be refused: ${wrongHash}`);

  fs.writeFileSync(path.join(dir, "untracked.md"), "drift\n"); // untracked file: same SHA, different content
  const dirty = verifyPin(pin);
  assert(dirty.some((r) => r.includes("uncommitted")) && dirty.some((r) => r.includes("content hash")), `a dirty tree must be refused: ${dirty}`);
  fs.rmSync(path.join(dir, "untracked.md"));

  git(dir, "commit", "-q", "--allow-empty", "-m", "two"); // new commit, identical files: only the SHA moved
  assert(verifyPin(pin).some((r) => r.includes("commit")), "HEAD moved past the pinned commit: must be refused");
});

// S2 -- the init event of the finished run must name the pinned plugin (and only it).
check("S2 init: pinned plugin named -> ok; other path / extra plugin / A0 with any plugin -> invalid", async () => {
  const { checkInitPlugins } = await import("./lib/pin.ts");
  const builtin = { name: "cc-plugin-agents-md", path: "builtin", source: "cc-plugin-agents-md@builtin" };
  const dir = pluginRepo();
  const loaded = { name: "pinned", path: dir, source: "pinned@inline" };
  assert(checkInitPlugins([builtin, loaded], dir).length === 0, "pinned plugin loaded from the pinned path must pass");
  assert(checkInitPlugins([builtin, { ...loaded, path: dir + "-other" }], dir).length > 0, "a plugin loaded from another path must be invalid");
  assert(checkInitPlugins([builtin], dir).length > 0, "pinned plugin absent from init must be invalid");
  assert(checkInitPlugins([builtin, loaded, { name: "x", path: "C:\\elsewhere", source: "x@m" }], dir).length > 0, "an extra plugin must be invalid");
  assert(checkInitPlugins([builtin], undefined).length === 0, "A0 with built-ins only must pass");
  assert(checkInitPlugins([builtin, loaded], undefined).length > 0, "A0 with a loaded plugin must be invalid");
});

// ---- free trial checks: runTrial replays a REAL recorded run (fixtures/recorded/smoke-run.jsonl, captured by P4) ----
type Ev = Record<string, any>;
/** A runner that returns the recorded stream (optionally mutated, cwd re-pointed at this trial) instead of calling a model. */
function replay(mutate: (events: Ev[]) => void = () => {}, side: () => void = () => {}) {
  const calls = { n: 0 };
  const runner: import("./lib/run.ts").Runner = async (_cmd, { cwd }) => {
    calls.n++;
    side();
    const events: Ev[] = fs.readFileSync(path.join(AB, "fixtures", "recorded", "smoke-run.jsonl"), "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l));
    events.find((e) => e.type === "system" && e.subtype === "init")!.cwd = cwd;
    mutate(events);
    return { stdout: events.map((e) => JSON.stringify(e)).join("\n"), stderr: "", exitCode: 0, wallMs: 1234 };
  };
  return { runner, calls };
}
async function trialWith(r: { runner: import("./lib/run.ts").Runner }, over: { arm?: Partial<import("./lib/arm.ts").Arm>; src?: string } = {}) {
  const { loadArm } = await import("./lib/arm.ts");
  const { runTrial } = await import("./lib/trial.ts");
  const dir = tmpdir("trial");
  const log = path.join(dir, "log.md");
  const src = over.src ?? (await fixtureCopy(false));
  const res = await runTrial({ arm: { ...loadArm(ARM_FILE), ...over.arm }, srcRepo: src, repo: "smoke-repo", task: await task("add-fn"), trial: 1, attempt: 1, workRoot: dir, logPath: log, tag: "smoke -- not a measurement", runner: r.runner });
  return { res, log: fs.readFileSync(log, "utf8"), src };
}

check("S1b trial: refuses a wrong-commit pin BEFORE any spawn; the matching pin runs", async () => {
  const { computePin } = await import("./lib/pin.ts");
  const { PinRefused } = await import("./lib/trial.ts");
  const dir = pluginRepo();
  const pin = { path: dir, ...computePin(dir) };
  const addPlugin = (events: Ev[]) => events.find((e) => e.type === "system" && e.subtype === "init")!.plugins.push({ name: "pinned", path: dir, source: "pinned@inline" });

  const refused = replay(addPlugin);
  let err: unknown;
  await trialWith(refused, { arm: { plugin: { ...pin, sha: "0".repeat(40) } } }).catch((e) => (err = e));
  assert(err instanceof PinRefused && refused.calls.n === 0, `wrong-commit pin must throw PinRefused with no spawn (spawns: ${refused.calls.n}, err: ${err})`);

  const control = replay(addPlugin);
  const ok = await trialWith(control, { arm: { plugin: pin } });
  assert(control.calls.n === 1 && ok.res.exit === "ok", `matching pin must run and be valid, got ${ok.res.exit}`);
  assert(ok.log.includes(pin.sha) && ok.log.includes(pin.hash), "the row must echo the verified plugin sha and content hash");

  const wrongPath = await trialWith(replay((events) => {
    events.find((e) => e.type === "system" && e.subtype === "init")!.plugins.push({ name: "pinned", path: dir + "-other", source: "pinned@inline" });
  }), { arm: { plugin: pin } });
  assert(wrongPath.res.exit.startsWith("invalid:"), `init naming another plugin path must invalidate the run, got ${wrongPath.res.exit}`);
});

check("S4 source: untouched source -> ok and hash-identical; a run that mutates the source -> failed", async () => {
  const { manifest, diffManifest } = await import("./lib/snapshot.ts");
  const clean = await trialWith(replay());
  assert(clean.res.exit === "ok", `baseline replay must be valid, got ${clean.res.exit}`);
  const src = await fixtureCopy(false);
  const before = manifest(src);
  assert(diffManifest(before, manifest(src)).length === 0, "baseline manifest must be stable");
  const dirty = await trialWith(replay(undefined, () => fs.appendFileSync(path.join(src, "src", "add.ts"), "// mutated mid-run\n")), { src });
  assert(dirty.res.exit.startsWith("source-mutated: changed src/add.ts"), `mutated source must fail the run naming the file, got ${dirty.res.exit}`);
});

check("S5 models: a model outside the pinned inventory in modelUsage -> invalid", async () => {
  const swapped = await trialWith(replay((events) => {
    const r = events.find((e) => e.type === "result")!;
    r.modelUsage = { "claude-opus-9-9": Object.values(r.modelUsage)[0] };
  }));
  assert(swapped.res.exit.startsWith("invalid:") && swapped.res.exit.includes("claude-opus-9-9"), `unpinned model must invalidate the run, got ${swapped.res.exit}`);
  const dispatchOnly = await trialWith(replay((events) => {
    const r = events.find((e) => e.type === "result")!;
    r.modelUsage["claude-haiku-9-0"] = { ...Object.values<Ev>(r.modelUsage)[0] };
  }), { arm: { dispatch: { subagent: "claude-haiku-9-0" } } });
  assert(dispatchOnly.res.exit === "ok", `a model pinned as a dispatch tier must be accepted, got ${dispatchOnly.res.exit}`);
});

check("S6 usage: CLI reports no usage -> usage-missing row, invalid, no tokens invented", async () => {
  const none = await trialWith(replay((events) => {
    delete events.find((e) => e.type === "result")!.usage;
  }));
  assert(none.res.exit === "usage-missing" && !none.res.valid, `no usage must be usage-missing and invalid, got ${none.res.exit}`);
  assert(none.res.row.tokens === null && none.log.includes("usage-missing") && none.log.includes("| none | none | none | none |"), "the row must record the gap, not zeros");
});

// ---- paid checks: headless haiku runs under the same isolation real trials use ----
const ARM_FILE = path.join(AB, "arms", "smoke-a0.json");
const WORK_ROOT = () => tmpdir("work");

type Iso = import("./lib/isolate.ts").Isolation;
type Probe = { prompt: (iso: Iso) => string; plant?: (iso: Iso) => void; settings?: (iso: Iso) => Record<string, unknown>; arm?: string };

/** One isolated headless run with optional pre-planted state; returns the parsed stream. */
async function probeRun(p: Probe) {
  const { loadArm } = await import("./lib/arm.ts");
  const { makeIsolation, isolationEnv } = await import("./lib/isolate.ts");
  const { buildCommand, spawnRunner } = await import("./lib/run.ts");
  const { parseStream } = await import("./lib/parse.ts");
  const arm = loadArm(p.arm ?? ARM_FILE);
  const iso = makeIsolation(WORK_ROOT(), arm);
  if (p.settings) fs.writeFileSync(path.join(iso.cfg, "settings.json"), JSON.stringify(p.settings(iso)));
  p.plant?.(iso);
  const raw = await spawnRunner(buildCommand(arm, p.prompt(iso)), { cwd: iso.trialDir, env: isolationEnv(iso, arm), timeoutMs: 240_000 });
  return { iso, raw, stream: parseStream(raw.stdout) };
}

// P1 -- access isolation, in the exact permission mode real trials use, on long-form paths.
check("P1 access: Read + Bash outside the trial copy -> denied and recorded; Read inside -> allowed", async () => {
  const plant = (iso: Iso) => {
    fs.writeFileSync(path.join(iso.outside, "secret.txt"), "OUTSIDE-TOKEN-7731\n");
    fs.writeFileSync(path.join(iso.trialDir, "inside.txt"), "INSIDE-TOKEN-4410\n");
  };
  const denials = async (tool: "Read" | "Bash") => {
    const out = await probeRun({
      plant,
      prompt: (iso) => {
        const file = path.join(iso.outside, "secret.txt");
        return tool === "Read" ? `Use the Read tool on ${file}. Reply with the file contents if you got them, otherwise the word DENIED.` : `Use the Bash tool to run exactly: cat "${file}". Reply with its output if you got it, otherwise the word DENIED.`;
      },
    });
    assert(!String(out.stream.result?.result).includes("OUTSIDE-TOKEN-7731"), `the outside token reached the reply of the ${tool} run`);
    return (out.stream.result?.permission_denials ?? []).map((d: any) => d.tool_name as string);
  };
  const readDenied = await denials("Read");
  assert(readDenied.includes("Read"), `outside Read must be in permission_denials, got [${readDenied}]`);
  const bashDenied = await denials("Bash");
  assert(bashDenied.includes("Bash"), `outside Bash must be in permission_denials, got [${bashDenied}]`);

  const inside = await probeRun({
    plant,
    prompt: (iso) => `Use the Read tool on ${path.join(iso.trialDir, "inside.txt")} and reply with its contents only.`,
  });
  assert(String(inside.stream.result?.result).includes("INSIDE-TOKEN-4410"), `inside read must be allowed, reply was: ${inside.stream.result?.result}`);
  assert((inside.stream.result?.permission_denials ?? []).length === 0, "inside read must record no denial");
}, true);

// P2 -- the leak probe can see a leak: all five canaries planted as the SELECTED config are observable.
// P3 -- the same canaries planted in the AMBIENT temp home, with a clean config selected, are not.
// P3 counts only when P2 (same invocation) detected all five; otherwise both report FAIL.
const KINDS = ["instruction", "memory", "env", "plugin", "hook"] as const;
let p2Detected = false;
check("P2 canaries as selected config -> all five observable", async () => {
  const { plantCanaries, observeCanaries, CANARY_PROMPT } = await import("./lib/canary.ts");
  const out = await probeRun({ prompt: () => CANARY_PROMPT, plant: (iso) => plantCanaries(iso.cfg, iso) });
  const seen = observeCanaries(out.stream, out.iso);
  const missing = KINDS.filter((k) => !seen[k]);
  assert(missing.length === 0, `canaries not observed when selected: ${missing.join(",")}; reply: ${out.stream.result?.result}`);
  p2Detected = true;
}, true);
check("P3 canaries in ambient temp home, clean config selected -> none observable", async () => {
  assert(p2Detected, "P3 is void: P2 did not detect all five canaries in this invocation, so absence proves nothing");
  const { plantCanaries, observeCanaries, CANARY_PROMPT } = await import("./lib/canary.ts");
  const out = await probeRun({ prompt: () => CANARY_PROMPT, plant: (iso) => plantCanaries(path.join(iso.home, ".claude"), iso) });
  const seen = observeCanaries(out.stream, out.iso);
  const leaked = KINDS.filter((k) => seen[k]);
  assert(leaked.length === 0, `ambient config leaked into the trial: ${leaked.join(",")}; reply: ${out.stream.result?.result}`);
}, true);

// P4 -- the tracer: the ONE command, one smoke task x one trial, one row in the real measurement log.
check("P4 tracer: run-trial.ts on the smoke repo -> exit 0, one complete row appended, source hash-identical", async () => {
  const { manifest, diffManifest } = await import("./lib/snapshot.ts");
  const { DEFAULT_LOG } = await import("./lib/record.ts");
  const rowsBefore = fs.existsSync(DEFAULT_LOG) ? fs.readFileSync(DEFAULT_LOG, "utf8").split("\n").filter((l) => l.startsWith("| 20")).length : 0;
  const srcBefore = manifest(SMOKE_REPO);
  const p = Bun.spawn(["bun", path.join(AB, "run-trial.ts"), "--arm", ARM_FILE, "--task", path.join(AB, "fixtures", "smoke-tasks", "add-fn.json"), "--repo", SMOKE_REPO], { stdin: "ignore", stdout: "pipe", stderr: "pipe" });
  const out = (await new Response(p.stdout).text()) + (await new Response(p.stderr).text());
  const code = await p.exited;
  assert(code === 0, `run-trial.ts exited ${code}: ${out}`);
  const diffs = diffManifest(srcBefore, manifest(SMOKE_REPO));
  assert(diffs.length === 0, `source fixture changed: ${diffs.join(", ")}`);
  const rows = fs.readFileSync(DEFAULT_LOG, "utf8").split("\n").filter((l) => l.startsWith("| 20"));
  assert(rows.length === rowsBefore + 1, `expected exactly one appended row, rows ${rowsBefore} -> ${rows.length}`);
  const last = rows[rows.length - 1]!;
  const cells = last.split(/(?<!\\) \| /);
  const [, tag, arm, repo, taskId, trial, attempt, graders, tin, tout, , , cost, wall, exit, pins] = cells;
  assert(arm === "smoke-a0" && repo === "smoke-repo" && taskId === "add-fn" && trial === "1" && attempt === "1", `identity cells wrong: ${cells.slice(1, 7)}`);
  assert(/typecheck:\w+,acceptance:\w+,build:\w+/.test(graders ?? ""), `graders cell: ${graders}`);
  assert(Number(tin) + Number(tout) > 0 && Number(cost) > 0 && Number(wall) > 0, `tokens/cost/wall must be real numbers from the CLI: in=${tin} out=${tout} cost=${cost} wall=${wall}`);
  assert(exit === "ok" && /smoke/.test(tag ?? ""), `exit/tag: ${exit} / ${tag}`);
  for (const key of ["sessionModel", "dispatch", "effort", "permissionMode", "plugin", "configDir"]) assert((pins ?? "").includes(`"${key}"`), `pins cell lacks ${key}`);
  console.log(`     P4 row: ${last.slice(0, 400)}`);
}, true);

const paid = process.argv.includes("--paid");
let failed = 0;
for (const c of checks) {
  if (c.paid && !paid) continue;
  try {
    await c.fn();
    console.log(`PASS ${c.name}`);
  } catch (e) {
    failed++;
    console.log(`FAIL ${c.name}\n     ${String((e as Error).message ?? e).split("\n").join("\n     ")}`);
  }
}
console.log(failed === 0 ? `selftest: all ${checks.filter((c) => paid || !c.paid).length} checks passed` : `selftest: ${failed} FAILED`);
process.exit(failed === 0 ? 0 : 1);
