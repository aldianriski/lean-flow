// Parallel development trials (EPIC-023 D16):
//   bun evals/ab/run-dev.ts --arms <dir> --suffix <s> --research <root> --out <dir> --log-header <md> [--workers N] [--tag <text>] [--dry-run] <repo>:<repo>/<batch>/<task> ...
// Maintainer-only and paid unless --dry-run; never part of `bun test` or the gate.
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";

export type Spawn = (command: string[], output: number) => Promise<number>;
const spawnTrial: Spawn = (command, output) => new Promise((resolve, reject) => {
  const child = spawn(command[0]!, command.slice(1), { stdio: ["ignore", output, output] });
  child.once("error", reject);
  child.once("close", (code) => resolve(code ?? 1));
});
class Refused extends Error {}

/** The process boundary is injectable so selftests never launch paid trials. */
export async function runDev(argv: string[], start: Spawn = spawnTrial, say = console.log): Promise<number> {
  const started = performance.now();
  const flags = new Map<string, string>(), positions: string[] = [];
  let dry = false;
  try {
    for (let i = 0; i < argv.length; i++) {
      const arg = argv[i]!;
      if (arg === "--dry-run") { dry = true; continue; }
      if (!arg.startsWith("--")) { positions.push(arg); continue; }
      if (!["--arms", "--suffix", "--research", "--out", "--log-header", "--workers", "--tag"].includes(arg)) throw new Refused(`unknown option ${arg}`);
      const value = argv[++i];
      if (value === undefined || value.startsWith("--")) throw new Refused(`${arg} needs a value`);
      flags.set(arg, value);
    }
    const workers = Number(flags.get("--workers") ?? 3);
    if (!Number.isSafeInteger(workers) || workers < 1) throw new Refused("--workers must be an integer >= 1");
    const need = (key: string) => {
      const value = flags.get(key);
      if (!value) throw new Refused(`missing ${key}`);
      return value;
    };
    const arms = path.resolve(need("--arms")), suffix = need("--suffix"), research = path.resolve(need("--research"));
    const out = path.resolve(need("--out")), header = path.resolve(need("--log-header"));
    if (!positions.length) throw new Refused("provide at least one repo:repo/batch/task slot");
    const file = (p: string) => {
      if (!fs.existsSync(p) || !fs.statSync(p).isFile()) throw new Refused(`missing file: ${p}`);
    };
    const names = new Set<string>();
    const slots = positions.map((position) => {
      const match = /^([\w-]+):([\w-]+)\/([\w-]+)\/([\w-]+)$/.exec(position);
      if (!match || match[1] !== match[2]) throw new Refused(`invalid slot: ${position} (expected repo:repo/batch/task)`);
      const repo = match[1]!, batch = match[3]!, task = match[4]!;
      if (names.has(task.toLowerCase())) throw new Refused(`duplicate output task: ${task}`);
      names.add(task.toLowerCase());
      const arm = path.join(arms, `${repo}-${suffix}.json`), taskFile = path.join(import.meta.dir, "tasks", repo, batch, task, "task.json");
      file(arm); file(taskFile);
      const log = path.join(out, `${task}.md`), output = path.join(out, `${task}.out`);
      for (const p of [log, output]) if (fs.existsSync(p)) throw new Refused(`output already exists: ${p}`);
      const command = [process.execPath, "--no-env-file", path.join(import.meta.dir, "run-trial.ts"), "--arm", arm, "--task", taskFile, "--repo", path.join(research, repo), "--log", log, "--measured", "--protocol", "d9", "--tag", flags.get("--tag") ?? "development"];
      return { task, log, output, command };
    });
    file(header);
    if (dry) {
      // PowerShell/POSIX shell quoting for display; execution always uses an argv array.
      const quote = (s: string) => `'${s.replace(/'/g, process.platform === "win32" ? "''" : "'\"'\"'")}'`;
      for (const slot of slots) say(`${process.platform === "win32" ? "& " : ""}${slot.command.map(quote).join(" ")}`);
      return 0;
    }
    const content = fs.readFileSync(header);
    fs.mkdirSync(out, { recursive: true });
    const codes: number[] = [];
    let next = 0;
    const worker = async () => {
      while (next < slots.length) {
        const index = next++, slot = slots[index]!;
        let fd: number | undefined;
        try {
          fs.writeFileSync(slot.log, content, { flag: "wx" });
          fd = fs.openSync(slot.output, "wx");
          codes[index] = await start(slot.command, fd);
        } catch (e) {
          codes[index] = 1;
          if (fd !== undefined) fs.writeSync(fd, `ERROR: ${(e as Error).message}\n`);
          else say(`${slot.task}: ERROR: ${(e as Error).message}`);
        } finally { if (fd !== undefined) fs.closeSync(fd); }
      }
    };
    await Promise.all(Array.from({ length: Math.min(workers, slots.length) }, worker));
    slots.forEach((slot, i) => {
      const output = fs.existsSync(slot.output) ? fs.readFileSync(slot.output, "utf8") : "";
      const lines = ["passed", "exit"].flatMap((key) => output.match(new RegExp(`^${key}:.*$`, "gm")) ?? []).map((line) => line.trim());
      say(`${slot.task}: code: ${codes[i]}${lines.length ? ` | ${lines.join(" | ")}` : ""}`);
    });
    say(`total wall time: ${((performance.now() - started) / 1000).toFixed(2)}s`);
    return codes.every((code) => code === 0) ? 0 : 1;
  } catch (e) {
    say(`${e instanceof Refused ? "REFUSED" : "ERROR"}: ${(e as Error).message}`);
    return e instanceof Refused ? 2 : 1;
  }
}

if (import.meta.main) process.exit(await runDev(process.argv.slice(2), spawnTrial, (line) => {
  if (/^(REFUSED|ERROR):/.test(line)) console.error(line);
  else console.log(line);
}));
