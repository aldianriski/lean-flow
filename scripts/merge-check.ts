// scripts/merge-check.ts -- SPRINT-138 T3 (TASK-484): the gate's five cross-cutting legs in one command.
//   bun scripts/merge-check.ts
//
// WHY: system verify was red at close in 7 of the last 10 sprints on a leg no per-task check ran.
// Wrapper only: it dispatches the gate's OWN checkers with the gate's OWN arguments (scripts/qa-check.sh
// is the source; evals/merge-check.test.ts compares each leg's invocation to it). typecheck ·
// prose-density · layers-completeness · layers-observed · scope-change. A missing tool or checker FAILS
// ("not runnable"), never skips -- a skip is indistinguishable from a pass (TD-101, ADR-037). The sprint
// legs skip, as the gate does, only when there is no sprint file (scope-change: no ACTIVE one).
// Exit 0 = no leg failed; 1 = any FAIL or not-runnable leg.
import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

export interface Reply {
  status: number; // -1 = could not spawn
  stdout: string;
}
export interface Env {
  root: string;
  run(cmd: string, args: string[]): Reply;
  exists(relPath: string): boolean;
  /** docs/sprint/SPRINT-*.md, top level (the gate's `ls`). */
  sprintFiles(): string[];
  /** those with a `^status: *active` line (the gate's `grep -lE`). */
  activeSprintFiles(): string[];
}
/** Argument tokens: ROOT = the repo root, FILES = the sprint file set, FILE = one active sprint file. */
export type Arg = "$ROOT" | "$FILES" | "$FILE" | `--${string}`;
export interface Leg {
  name: string;
  /** the gate's `<var>_script` variable; null for tsc, which the gate calls by path */
  gateVar: string | null;
  script: string;
  /** ONE table feeds the code (what judge passes) and the gate comparison (gateInvocation / gateFileSet) */
  args: readonly Arg[];
  /** which sprint files the gate's file-set expression selects; null = none (root or no files) */
  files: "all" | "active" | null;
}

export const LEGS: readonly Leg[] = [
  { name: "typecheck", gateVar: null, script: "node_modules/.bin/tsc", args: ["--noEmit"], files: null },
  { name: "prose-density", gateVar: "pd", script: "scripts/lib/check-prose-density.ts", args: ["$ROOT"], files: null },
  { name: "layers-completeness", gateVar: "lc", script: "scripts/lib/check-layers-completeness.ts", args: ["$FILES"], files: "all" },
  { name: "layers-observed", gateVar: "lo", script: "scripts/lib/check-layers-observed.ts", args: ["$FILES"], files: "all" },
  { name: "scope-change", gateVar: "sc", script: "scripts/lib/check-sprint-by-reference.ts", args: ["$FILE", "--scope-change"], files: "active" },
];

/** The invocation as qa-check.sh spells it, derived from the table. */
export function gateInvocation(l: Leg): string {
  if (l.gateVar === null) return `${l.script} ${l.args.join(" ")}`;
  const sh = (a: Arg) => (a === "$ROOT" ? '"$ROOT"' : a === "$FILES" ? `$${l.gateVar}_files` : a === "$FILE" ? '"$sc_f"' : a);
  return `bun "$${l.gateVar}_script" ${l.args.map(sh).join(" ")}`;
}
/** The gate's file-set assignment prefix for this leg, or null. */
export function gateFileSet(l: Leg): string | null {
  if (l.files === null) return null;
  const sel = l.files === "all" ? "ls docs/sprint/SPRINT-*.md" : "grep -lE '^status: *active' docs/sprint/SPRINT-*.md";
  return `${l.gateVar}_files=$(${sel}`;
}
const fill = (l: Leg, env: Env, files: string[]): string[] =>
  l.args.flatMap((a) => (a === "$ROOT" ? [env.root] : a === "$FILES" ? files : a === "$FILE" ? files.slice(0, 1) : [a]));

type Verdict = { kind: "green" | "skip" | "fail"; text: string };
const green = (name: string, why = ""): Verdict => ({ kind: "green", text: `PASS  ${name}${why}` });
const skip = (name: string, why: string): Verdict => ({ kind: "skip", text: `SKIP  ${name}: ${why}` });
const fail = (name: string, why: string): Verdict => ({ kind: "fail", text: `FAIL  ${name}: ${why}` });
const notRunnable = (name: string, what: string): Verdict => fail(name, `not runnable -- ${what}. This FAILS rather than skipping on purpose`);

const lines = (s: string, re: RegExp) => s.split(/\r?\n/).filter((l) => re.test(l));
const findings = (out: string, code: number) => {
  const f = lines(out, /^FAIL/).map((l) => l.replace(/^FAIL +/, "")).join("; ");
  return f !== "" ? f : `no FAIL line in output -- checker exited ${code} without reporting one`;
};

function typecheck(env: Env, leg: Leg): Verdict {
  const bin = ["tsc", "tsc.exe", "tsc.cmd"].map((b) => `node_modules/.bin/${b}`).find((p) => env.exists(p));
  if (bin === undefined) return notRunnable(leg.name, "no type checker at node_modules/.bin/tsc (run 'bun install')");
  const r = env.run(bin, fill(leg, env, []));
  if (r.status === -1) return notRunnable(leg.name, `could not spawn ${bin}`);
  if (r.status === 0) return green(leg.name, ": tsc --noEmit clean (0 errors)");
  const errs = lines(r.stdout, /error TS/);
  if (errs.length === 0) {
    const head = r.stdout.replace(/\s+/g, " ").slice(0, 200);
    return fail(leg.name, `THE CHECKER ITSELF FAILED -- tsc exited ${r.status} without printing a single 'error TS' diagnostic. NOT a verdict on the code. Output began: ${head}`);
  }
  return fail(leg.name, `tsc --noEmit exited ${r.status} with ${errs.length} error(s) -- first: ${errs[0]}`);
}

/** Run one checker; the SKIP/PASS/FAIL tallies follow the gate (qa-check.sh counts `^SKIP` apart from `^PASS`). */
function runChecker(env: Env, leg: Leg, files: string[]): Verdict {
  const r = env.run("bun", [leg.script, ...fill(leg, env, files)]);
  if (r.status === -1) return notRunnable(leg.name, `could not spawn bun for ${leg.script}`);
  const fails = lines(r.stdout, /^FAIL/);
  if (r.status !== 0 || fails.length > 0) return fail(leg.name, findings(r.stdout, r.status));
  const pass = lines(r.stdout, /^PASS/).length;
  const skips = lines(r.stdout, /^SKIP/);
  const relay = skips.length > 0 ? "\n" + skips.join("\n") : "";
  if (pass === 0 && skips.length > 0) return { kind: "skip", text: `SKIP  ${leg.name}: 0 checks verified, ${skips.length} skipped${relay}` };
  if (pass === 0 && leg.files === "all") return skip(leg.name, "0 checks verified -- nothing in scope");
  return { kind: "green", text: `PASS  ${leg.name} (${pass} check(s))${relay}` };
}

function judge(env: Env, leg: Leg): Verdict {
  if (leg.name === "typecheck") return typecheck(env, leg);
  if (!env.exists(leg.script)) return notRunnable(leg.name, `checker not found at ${leg.script}`);
  if (leg.files === "active") {
    const active = env.activeSprintFiles();
    if (active.length === 0) return skip(leg.name, "skip (no active sprint in docs/sprint/SPRINT-*.md)");
    const vs = active.map((f) => runChecker(env, leg, [f]));
    const bad = vs.filter((v) => v.kind === "fail");
    if (bad.length > 0) return { kind: "fail", text: bad.map((v) => v.text).join("\n") };
    return vs.every((v) => v.kind === "skip") ? { kind: "skip", text: vs.map((v) => v.text).join("\n") } : { kind: "green", text: vs.map((v) => v.text).join("\n") };
  }
  if (leg.files === "all") {
    const files = env.sprintFiles();
    if (files.length === 0) return skip(leg.name, "skip (missing): docs/sprint/SPRINT-*.md");
    return runChecker(env, leg, files);
  }
  return runChecker(env, leg, []);
}

export function mergeCheck(env: Env): { code: number; out: string } {
  const vs = LEGS.map((leg) => judge(env, leg));
  const n = (k: Verdict["kind"]) => vs.filter((v) => v.kind === k).length;
  const out = [...vs.map((v) => v.text), `merge-check: ${n("green")} green · ${n("skip")} skipped · ${n("fail")} failed (of ${LEGS.length})`];
  return { code: n("fail") > 0 ? 1 : 0, out: out.join("\n") + "\n" };
}

export function realEnv(root: string): Env {
  const sprintDir = join(root, "docs", "sprint");
  const sprintFiles = () => {
    try {
      return readdirSync(sprintDir).filter((f) => /^SPRINT-.*\.md$/.test(f)).sort().map((f) => `docs/sprint/${f}`);
    } catch {
      return [];
    }
  };
  return {
    root,
    run(cmd, args) {
      const r = spawnSync(cmd === "bun" ? process.execPath : join(root, cmd), args, { cwd: root, encoding: "utf8", maxBuffer: 64 << 20 });
      if (r.error !== undefined || r.status === null) return { status: -1, stdout: String(r.error ?? "killed by signal") };
      return { status: r.status, stdout: `${r.stdout ?? ""}${r.stderr ?? ""}` };
    },
    exists: (p) => existsSync(join(root, p)),
    sprintFiles,
    activeSprintFiles: () => sprintFiles().filter((f) => /^status: *active/m.test(readFileSync(join(root, f), "utf8"))),
  };
}

if (import.meta.main) {
  const root = fileURLToPath(new URL("..", import.meta.url)).replace(/[\\/]$/, "");
  const r = mergeCheck(realEnv(root));
  process.stdout.write(r.out);
  process.exit(r.code);
}
