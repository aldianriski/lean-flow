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
export interface Leg {
  name: string;
  /** the gate's `<var>_script` variable; null for tsc, which the gate calls by path */
  gateVar: string | null;
  script: string;
  /** text qa-check.sh must contain: the gate's own invocation / file-set expression */
  gateFragments: string[];
}

export const LEGS: readonly Leg[] = [
  { name: "typecheck", gateVar: null, script: "node_modules/.bin/tsc", gateFragments: ["node_modules/.bin/tsc --noEmit"] },
  { name: "prose-density", gateVar: "pd", script: "scripts/lib/check-prose-density.ts", gateFragments: ['bun "$pd_script" "$ROOT"'] },
  {
    name: "layers-completeness", gateVar: "lc", script: "scripts/lib/check-layers-completeness.ts",
    gateFragments: ["lc_files=$(ls docs/sprint/SPRINT-*.md", 'bun "$lc_script" $lc_files'],
  },
  {
    name: "layers-observed", gateVar: "lo", script: "scripts/lib/check-layers-observed.ts",
    gateFragments: ["lo_files=$(ls docs/sprint/SPRINT-*.md", 'bun "$lo_script" $lo_files'],
  },
  {
    name: "scope-change", gateVar: "sc", script: "scripts/lib/check-sprint-by-reference.ts",
    gateFragments: ["grep -lE '^status: *active' docs/sprint/SPRINT-*.md", 'bun "$sc_script" "$sc_f" --scope-change'],
  },
];

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
  const r = env.run(bin, ["--noEmit"]);
  if (r.status === -1) return notRunnable(leg.name, `could not spawn ${bin}`);
  if (r.status === 0) return green(leg.name, ": tsc --noEmit clean (0 errors)");
  const errs = lines(r.stdout, /error TS/);
  if (errs.length === 0) {
    const head = r.stdout.replace(/\s+/g, " ").slice(0, 200);
    return fail(leg.name, `THE CHECKER ITSELF FAILED -- tsc exited ${r.status} without printing a single 'error TS' diagnostic. NOT a verdict on the code. Output began: ${head}`);
  }
  return fail(leg.name, `tsc --noEmit exited ${r.status} with ${errs.length} error(s) -- first: ${errs[0]}`);
}

/** Run one checker over `args`; `zeroIsSkip` mirrors the gate's "0 verified is a SKIP, never a PASS". */
function runChecker(env: Env, leg: Leg, args: string[], zeroIsSkip: boolean): Verdict {
  const r = env.run("bun", [leg.script, ...args]);
  if (r.status === -1) return notRunnable(leg.name, `could not spawn bun for ${leg.script}`);
  if (r.status !== 0) return fail(leg.name, findings(r.stdout, r.status));
  const n = lines(r.stdout, /^(PASS|SKIP)/).length;
  if (zeroIsSkip && n === 0) return skip(leg.name, "0 checks verified -- nothing in scope");
  return green(leg.name, ` (${lines(r.stdout, /^PASS/).length} check(s))`);
}

function judge(env: Env, leg: Leg): Verdict {
  if (leg.name === "typecheck") return typecheck(env, leg);
  if (!env.exists(leg.script)) return notRunnable(leg.name, `checker not found at ${leg.script}`);
  if (leg.name === "prose-density") return runChecker(env, leg, [env.root], false);
  if (leg.name === "scope-change") {
    const active = env.activeSprintFiles();
    if (active.length === 0) return skip(leg.name, "skip (no active sprint in docs/sprint/SPRINT-*.md)");
    const vs = active.map((f) => runChecker(env, leg, [f, "--scope-change"], false));
    const bad = vs.filter((v) => v.kind === "fail");
    return bad.length > 0 ? { kind: "fail", text: bad.map((v) => v.text).join("\n") } : green(leg.name, ` (${active.length} active sprint file(s))`);
  }
  const files = env.sprintFiles();
  if (files.length === 0) return skip(leg.name, "skip (missing): docs/sprint/SPRINT-*.md");
  return runChecker(env, leg, files, true);
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
