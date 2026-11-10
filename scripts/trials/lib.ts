// Caller supplies: argv, usage, cwd and explicit child environment; no files are loaded implicitly.
import { spawnSync } from "node:child_process";
import { readFileSync, readdirSync, realpathSync } from "node:fs";
import { basename, isAbsolute, join, relative, resolve, sep } from "node:path";

export type Args = Record<string, string | boolean>;
export function args(usage: string, flags: string[] = []): Args {
  const values: Args = {};
  const words = process.argv.slice(2);
  if (!words.length || words.includes("--help")) throw new Error(usage);
  for (let i = 0; i < words.length; i++) {
    const key = words[i]!;
    if (!key.startsWith("--") || key in values) throw new Error(usage);
    if (flags.includes(key)) values[key] = true;
    else {
      const value = words[++i];
      if (!value || value.startsWith("--")) throw new Error(usage);
      values[key] = value;
    }
  }
  return values;
}
export function required(a: Args, key: string): string {
  if (typeof a[key] !== "string") throw new Error(`missing ${key}`);
  return a[key] as string;
}
export function cli(usage: string, run: () => void) {
  try { run(); } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    if (!(error instanceof Error && error.message === usage)) console.error(usage);
    process.exitCode = 2;
  }
}
export function readText(path: string): string {
  if (privatePath(path)) throw new Error("refusing to open a private file");
  return readFileSync(path, "utf8");
}
export function privatePath(path: string): boolean {
  return path.replace(/\\/g, "/").split("/").some(p =>
    /^\.env(?:\.|$)|^\.ssh$|^credentials(?:\.|$)|^id_(?:rsa|ed25519|ecdsa)(?:\.|$)|\.(?:pem|key|p12)$/i.test(p));
}
export function readJson<T>(path: string): T { return JSON.parse(readText(path)); }
export function run(command: string[], cwd?: string, env: NodeJS.ProcessEnv = process.env) {
  const p = spawnSync(command[0]!, command.slice(1), {
    cwd, env, encoding: "utf8", shell: false, windowsHide: true, maxBuffer: 32 * 1024 * 1024,
  });
  return { code: p.status ?? 1, out: p.stdout ?? "", err: (p.stderr ?? "") + (p.error?.message ?? "") };
}
export function gitResult(repo: string, argv: string[]) {
  // Ignore ambient git redirection/configuration; these helpers must address only the supplied repository.
  const env = Object.fromEntries(Object.entries(process.env).filter(([k]) => !k.startsWith("GIT_")));
  return run(["git", "-c", `safe.directory=${resolve(repo).replace(/\\/g, "/")}`,
    "-c", "core.hooksPath=/dev/null", ...argv], repo, {
    ...env, GIT_CONFIG_GLOBAL: "/dev/null", GIT_CONFIG_NOSYSTEM: "1", GIT_OPTIONAL_LOCKS: "0",
    GIT_TERMINAL_PROMPT: "0",
  });
}
export function git(repo: string, argv: string[]): string {
  const r = gitResult(repo, argv);
  if (r.code !== 0) throw new Error(`git ${argv.join(" ")}: ${r.err || r.out}`);
  return r.out.trim();
}
export function inside(root: string, path: string): string {
  const target = resolve(root, path), rel = relative(root, target);
  if (!rel || rel === ".." || rel.startsWith(".." + sep) || isAbsolute(rel))
    throw new Error(`path must be inside scratch repository: ${path}`);
  return target;
}
export function canonicalPath(path: string): string {
  // Native realpath expands Windows 8.3 aliases to the long paths returned by git.
  return realpathSync.native(path);
}
export function scratchRepo(path: string): string {
  const root = canonicalPath(path);
  const top = canonicalPath(git(root, ["rev-parse", "--show-toplevel"]));
  // relative also normalizes separators and case for comparisons on Windows.
  if (relative(root, top)) throw new Error("--repo must be a repository root");
  const gitdir = canonicalPath(git(root, ["rev-parse", "--absolute-git-dir"]));
  inside(root, gitdir); // A linked worktree would put logs/temp files outside the scratch repository.
  return root;
}

// Stream predicates are data: dot-field comparisons followed by a cardinality assertion.
export type StreamChecks = {
  boxes?: { files: string[]; section: string };
  markerCommand?: string;
  predicates: { name: string; source: "tools" | "results" | "final" | "init" | "summary";
    where: { field: string; eq?: unknown; pattern?: string; flags?: string; min?: number; max?: number; not?: boolean }[];
    count: { min?: number; max?: number } }[];
};
type RecordData = Record<string, any>;
export function matchingFiles(root: string, pattern: string): string[] {
  inside(resolve(root), pattern);
  const parts = pattern.replace(/\\/g, "/").split("/");
  const visit = (dir: string, index: number): string[] => {
    if (index >= parts.length) return [];
    const result: string[] = [], part = parts[index]!, glob = new Bun.Glob(part);
    if (part === "**") result.push(...visit(dir, index + 1));
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.isSymbolicLink() || [".git", ".ssh", "node_modules"].includes(entry.name)) continue;
      const path = join(dir, entry.name);
      if (part === "**" && entry.isDirectory()) result.push(...visit(path, index));
      else if (glob.match(entry.name)) {
        if (index === parts.length - 1 && entry.isFile()) result.push(path);
        else if (entry.isDirectory()) result.push(...visit(path, index + 1));
      }
    }
    return result;
  };
  return visit(resolve(root), 0);
}
export function readStream(path: string): RecordData[] {
  return readText(path).split(/\r?\n/).filter(l => l.trim()).map((line, i) => {
    try { return JSON.parse(line); } catch { throw new Error(`invalid stream JSON at line ${i + 1}`); }
  });
}
export function inspectStream(records: RecordData[], exit: string, wt: string, checks: StreamChecks) {
  const tools: RecordData[] = [], results: RecordData[] = [];
  const byId = new Map<string, RecordData>();
  const time = (r: RecordData) => r.timestamp ? Date.parse(r.timestamp) : undefined;
  for (const r of records) for (const b of Array.isArray(r.message?.content) ? r.message.content : []) {
    if (b.type === "tool_use") tools.push({ id: b.id, who: r.parent_tool_use_id ? "sub" : "main",
      name: b.name, input: b.input, ts: time(r) });
    if (b.type === "tool_result") {
      const value = { id: b.tool_use_id, text: typeof b.content === "string" ? b.content : JSON.stringify(b.content),
        err: !!b.is_error, ts: time(r) };
      results.push(value); byId.set(b.tool_use_id, value);
    }
  }
  for (const tool of tools) {
    tool.result = byId.get(tool.id);
    if (tool.ts !== undefined && tool.result?.ts !== undefined) tool.duration_ms = tool.result.ts - tool.ts;
  }
  const final = records.filter(r => r.type === "result").slice(-1);
  const init = records.filter(r => r.type === "system" && r.subtype === "init").slice(0, 1);
  const members = new Set<string>();
  for (const pattern of checks.boxes?.files ?? []) for (const file of matchingFiles(wt, pattern)) members.add(file);
  let ticked = 0, total = 0;
  for (const path of members) {
    const escaped = checks.boxes!.section.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const section = readText(path).split(new RegExp(`^## ${escaped}\\s*$`, "m"))[1]?.split(/^## /m)[0] ?? "";
    ticked += (section.match(/^- \[x\]/gim) ?? []).length;
    total += (section.match(/^- \[[ x]\]/gim) ?? []).length;
  }
  const norm = (s: string) => s.replace(/\\/g, "/").replace(/\/$/, "").toLowerCase();
  const summary: RecordData = {
    cost_usd: final[0]?.total_cost_usd, wall_ms: Number(exit.match(/wall_ms (\d+)/)?.[1] ?? NaN),
    exit_code: Number(exit.match(/code (-?\d+)/)?.[1] ?? NaN),
    boxes_ticked: ticked, boxes_total: total, tool_uses: tools.length, tool_results: results.length,
    denials: results.filter(r => r.err && /denied|not allowed|permission/i.test(r.text)).length,
    outside_writes: tools.filter(t => ["Edit", "Write"].includes(t.name) &&
      !norm(String(t.input?.file_path ?? "")).startsWith(norm(resolve(wt)) + "/")).length,
  };
  if (checks.markerCommand) {
    const markerCommand = new RegExp(checks.markerCommand);
    const markers = tools.filter(t => t.name === "Bash" && markerCommand.test(t.input?.command ?? ""));
    const marker = Number(markers.at(-1)?.result?.text?.trim());
    const before = records.filter(r => r.type === "assistant" && !r.parent_tool_use_id &&
      time(r)! / 1000 <= marker).map(r => time(r)! / 1000);
    summary.main_gap_s = before.length ? Math.round(marker - Math.max(...before)) : NaN;
  }
  const sources = { tools, results, final, init, summary: [summary] };
  const failures: string[] = [];
  if (!final.length) failures.push("STREAM_RESULT_MISSING");
  if (!checks.predicates?.length) throw new Error("checks file needs at least one predicate");
  for (const check of checks.predicates) {
    if (!sources[check.source] || !check.name || !Array.isArray(check.where) ||
        (check.count?.min === undefined && check.count?.max === undefined)) throw new Error("invalid stream predicate");
    const matches = sources[check.source].filter(row => check.where.every(p => {
      const value = p.field.split(".").reduce((v, k) => v?.[k], row);
      if (value === undefined || (typeof value === "number" && !Number.isFinite(value))) return false;
      const ok = (!("eq" in p) || JSON.stringify(value) === JSON.stringify(p.eq)) &&
        (p.pattern === undefined || new RegExp(p.pattern, p.flags).test(String(value))) &&
        (p.min === undefined || (typeof value === "number" && value >= p.min)) &&
        (p.max === undefined || (typeof value === "number" && value <= p.max));
      return p.not ? !ok : ok;
    })).length;
    if (matches < (check.count.min ?? 0) || matches > (check.count.max ?? Infinity)) failures.push(check.name);
  }
  return { ...sources, failures };
}
export function streamCli(scriptPath: string) {
  const name = basename(scriptPath, ".ts");
  const usage = `usage: bun --no-env-file scripts/trials/${name}.ts --runs-dir DIR --run NAME --wt-root DIR --checks JSON`;
  cli(usage, () => {
    const a = args(usage), runs = resolve(required(a, "--runs-dir")), nameOfRun = required(a, "--run");
    const transcript = inside(runs, `${nameOfRun}.jsonl`), exit = inside(runs, `${nameOfRun}.exit`);
    const data = inspectStream(readStream(transcript), readText(exit), required(a, "--wt-root"),
      readJson<StreamChecks>(required(a, "--checks")));
    const s = data.summary[0]!;
    console.log(`result: ${data.final[0]?.subtype} · total_cost_usd ${s.cost_usd?.toFixed(3)} · wall ${(s.wall_ms / 60000).toFixed(1)} min`);
    console.log(`boxes ${s.boxes_ticked}/${s.boxes_total}`);
    console.log(`tool uses ${s.tool_uses} · results ${s.tool_results} · permission denials ${s.denials} · outside writes ${s.outside_writes}`);
    if (s.main_gap_s !== undefined) console.log(`main gap ${s.main_gap_s} s`);
    for (const f of data.failures) console.log(`FAIL: ${f}`);
    console.log(`${name} ${nameOfRun}: ${data.failures.length ? "FAIL" : "PASS"}`);
    process.exitCode = data.failures.length ? 1 : 0;
  });
}
if (import.meta.main) cli("usage: bun --no-env-file scripts/trials/lib.ts (import helpers instead)", () => {
  throw new Error("usage: bun --no-env-file scripts/trials/lib.ts (import helpers instead)");
});
