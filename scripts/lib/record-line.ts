// TASK-653: write the records the kept checks already parse; never infer a classification.
// bun --no-env-file scripts/lib/record-line.ts <command> [--root <repo>] ...
// consequence --log <existing path> --tn Tn --behaviour low|material --governance low|high
// review     --log <existing path> --tn Tn --behaviour low|material --governance low|high --depth <depth>
// scope-change --log <existing path> --date YYYY-MM-DD --summary "Tn/TASK-N ..."
// builder-check --log <existing path> --tn Tn --contradictions <count> --questions <count> --settled "..."
// tick TASK-N <box#> "<evidence>" | move TASK-N <status-folder>
// Depth vocabulary: night-run.md Part 4. Line schemas: check-review-depth.sh and
// check-sprint-by-reference.ts. Exit 2 refuses before writing; tick-box exit 1 means
// the tick WAS written but a downstream gate failed, and is passed through unchanged.
import { spawnSync } from "node:child_process";
import { appendFileSync, existsSync, mkdirSync, readdirSync, readFileSync, realpathSync, rmdirSync, statSync } from "node:fs";
import { basename, isAbsolute, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { FOLDERS, scanBlocks } from "./sprint-members.ts";

function refuse(field: string, message: string): never {
  throw new Error(`${field}: ${message}`);
}
function value(field: string, input: string | undefined): string {
  if (!input?.trim()) refuse(field, "required; nothing written");
  if (/[\x00-\x1f\x7f\u2028\u2029]/.test(input)) refuse(field, "must be one line without control characters");
  return input;
}
function choice(field: string, input: string | undefined, allowed: readonly string[]): string {
  const v = value(field, input);
  if (!allowed.includes(v)) refuse(field, `unknown value '${v}'; expected ${allowed.join(" | ")}`);
  return v;
}
function integer(field: string, input: string | undefined): string {
  const v = value(field, input);
  if (!/^(0|[1-9]\d*)$/.test(v) || !Number.isSafeInteger(Number(v))) refuse(field, "expected a non-negative integer");
  return v;
}
function within(parent: string, target: string): boolean {
  const rel = relative(parent, target);
  return rel === "" || (!isAbsolute(rel) && rel !== ".." && !rel.startsWith(`..${sep}`));
}
function real(field: string, path: string): string {
  try { return realpathSync.native(path); }
  catch { return refuse(field, `path does not exist or is unreadable: ${path}`); }
}
// Both lexical and real paths must stay under the allowed directory. In particular, a
// symlink/junction for docs/work or logs cannot redefine the boundary outside --root.
function contained(root: string, area: string, target: string, field: string, directory = false): string {
  const boundary = resolve(root, area);
  const path = resolve(root, target);
  if (!within(boundary, path)) refuse(field, `target must be under ${area}/`);
  const canonical = real(field, path);
  const canonicalBoundary = real(field, boundary);
  if (!within(root, canonicalBoundary) || !within(boundary, canonicalBoundary) || !within(canonicalBoundary, canonical)) {
    refuse(field, `realpath escapes ${area}/ under root`);
  }
  if (directory ? !statSync(canonical).isDirectory() : !statSync(canonical).isFile()) refuse(field, directory ? "expected a directory" : "expected a regular file");
  return canonical;
}
function task(root: string, id: string): string {
  const work = contained(root, "docs/work", "docs/work", "task", true);
  const found: string[] = [];
  for (const folder of FOLDERS) {
    const dir = join(work, folder);
    if (!existsSync(dir)) continue;
    contained(root, "docs/work", dir, "task", true);
    for (const name of readdirSync(dir)) if (name.startsWith(`${id}-`) && name.endsWith(".md")) found.push(join(dir, name));
  }
  if (found.length !== 1) refuse("task", `${id} resolves to ${found.length} files; expected exactly one`);
  return contained(root, "docs/work", found[0]!, "task");
}
function main(argv: string[]): number {
  const command = choice("command", argv.shift(), ["consequence", "review", "scope-change", "builder-check", "tick", "move"]);
  const fields: Record<string, string[]> = {
    consequence: ["log", "tn", "behaviour", "governance"],
    review: ["log", "tn", "behaviour", "governance", "depth"],
    "scope-change": ["log", "date", "summary"],
    "builder-check": ["log", "tn", "contradictions", "questions", "settled"],
    tick: [], move: [],
  };
  const options = new Map<string, string>();
  const positional: string[] = [];
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]!;
    if (!arg.startsWith("--")) { positional.push(arg); continue; }
    const key = arg.slice(2);
    if (key !== "root" && !fields[command]!.includes(key)) refuse(key, "unknown option");
    if (options.has(key)) refuse(key, "ambiguous: option supplied more than once");
    const next = argv[++i];
    if (next === undefined || next.startsWith("--")) refuse(key, "missing value");
    options.set(key, value(key, next));
  }
  const root = real("root", resolve(options.get("root") ?? process.cwd()));
  if (!statSync(root).isDirectory()) refuse("root", "expected a directory");
  if (command === "tick" || command === "move") {
    if (positional.length > (command === "tick" ? 3 : 2)) refuse("arguments", "unexpected positional input");
    const id = value("task", positional[0]);
    if (!/^TASK-\d+$/.test(id)) refuse("task", "expected one TASK-N id");
    // Validate every argument before resolving or mutating any target.
    if (command === "tick") {
      const box = integer("box", positional[1]);
      const evidence = value("evidence", positional[2]);
      task(root, id); // realpath containment before tick-box's own resolution/write
      const r = spawnSync(process.execPath, ["--no-env-file", fileURLToPath(new URL("./tick-box.ts", import.meta.url)), id, box, evidence, "--root", root], { cwd: root, stdio: "inherit" });
      if (r.error || r.status === null) refuse("tick", `could not run tick-box: ${r.error ?? r.signal}`);
      return r.status;
    }
    const folder = choice("folder", positional[1], FOLDERS);
    const source = task(root, id);
    const work = contained(root, "docs/work", "docs/work", "folder", true);
    const targetDir = join(work, folder);
    const createFolder = !existsSync(targetDir); // empty status folders do not survive a clone
    if (!createFolder) contained(root, "docs/work", targetDir, "folder", true);
    const destination = join(targetDir, basename(source));
    if (existsSync(destination)) refuse("folder", "destination already exists (or task is already there)");
    const git = (...args: string[]) => spawnSync("git", args, { cwd: root, encoding: "utf8" });
    const top = git("rev-parse", "--show-toplevel");
    if (top.status !== 0 || real("root", top.stdout.trim()) !== root) refuse("root", "move requires a git repository rooted at --root");
    if (git("ls-files", "--error-unmatch", "--", relative(root, source)).status !== 0) refuse("task", "move requires a git-tracked member file");
    const args = ["mv", "--", relative(root, source), relative(root, destination)];
    if (createFolder) {
      try { mkdirSync(targetDir); }
      catch { refuse("folder", `cannot create ${targetDir}`); }
    }
    try {
      const dry = git("mv", "--dry-run", ...args.slice(1));
      if (dry.status !== 0) refuse("move", dry.stderr.trim() || "git mv dry-run failed");
      const moved = git(...args);
      if (moved.status !== 0) refuse("move", moved.stderr.trim() || "git mv failed");
    } catch (e) {
      if (createFolder) rmdirSync(targetDir); // failed git move leaves no newly created directory
      throw e;
    }
    console.log(`record-line: moved ${id} to docs/work/${folder}/ (not committed)`);
    return 0;
  }
  if (positional.length) refuse("arguments", "unexpected positional input; use named options");
  const get = (field: string) => value(field, options.get(field));
  let line: string;
  if (command === "scope-change") {
    const date = get("date");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(Date.parse(date)) || new Date(date).toISOString().slice(0, 10) !== date) refuse("date", "expected a valid YYYY-MM-DD date");
    const summary = get("summary");
    if (!/\b(?:T\d+|TASK-\d+)\b/.test(summary) || /<!--|-->|\|/.test(summary)) refuse("summary", "must visibly name Tn/TASK-N subjects without comments or pipe delimiters");
    line = `### ${date} | scope-change | ${summary}`;
  } else {
    const tn = get("tn");
    if (!/^T[1-9]\d*$/.test(tn)) refuse("tn", "expected exactly one Tn, e.g. T1");
    if (command === "builder-check") {
      const contradictions = integer("contradictions", options.get("contradictions"));
      const questions = integer("questions", options.get("questions"));
      const settled = get("settled");
      if (settled.includes(" · ")) refuse("settled", "must not inject record field separators");
      line = `builder-check · ${tn} · ${contradictions} contradictions · ${questions} questions · ${settled}`;
    } else {
      const behaviour = choice("behaviour", options.get("behaviour"), ["low", "material"]);
      const governance = choice("governance", options.get("governance"), ["low", "high"]);
      const depth = command === "review" ? choice("depth", options.get("depth"), ["self-review", "scoped-reviewer", "code-review", "security-review"]) : null;
      line = `${command} · ${tn} · ${depth === null ? "" : `${depth} · `}behaviour:${behaviour} · governance:${governance}`;
    }
  }
  const log = contained(root, "docs/sprint/logs", get("log"), "log");
  const before = readFileSync(log, "utf8");
  // New records use LF: POSIX grep's whole-line schema must not see a trailing CR.
  // Preserve the existing log prefix byte-for-byte, including any older CRLF lines.
  const suffix = (before.length && !before.endsWith("\n") ? "\n" : "") + line + "\n";
  // An unclosed code fence/comment makes a new scope-change invisible to the real parser.
  const scanned = scanBlocks(before + suffix);
  if (scanned[scanned.length - 2]?.hidden) refuse("log", "append position is inside an unclosed fence or comment");
  appendFileSync(log, suffix);
  console.log(line);
  return 0;
}

if (import.meta.main) {
  try { process.exitCode = main(process.argv.slice(2)); }
  catch (e) { console.error(`record-line: ${String((e as Error).message)}`); process.exitCode = 2; }
}
