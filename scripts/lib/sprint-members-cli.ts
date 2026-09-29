// scripts/lib/sprint-members-cli.ts -- argv wrapper over resolveMembers() for SHELL callers
// (SPRINT-110 T4 · TASK-392). Run by Bun. Callers: scripts/qa-check.sh (leg 2g, leg 7),
// scripts/night-run.sh reap(), scripts/lib/conformance-engine.sh (T3). Owner rule: executable logic is
// TypeScript, so every count lives HERE and the shell call sites stay thin.
//
// CONTRACT (stable -- callers parse it):
//   bun sprint-members-cli.ts <mode> [<sprint-file>] [--root <dir>]      (--root defaults to cwd)
//
//   kind   <sprint>   prints `v2` or `v1`. v2 = the sprint lists a `## Members` TASK id or is stamped by
//                     a docs/work task, AND the root has a docs/work store. Otherwise v1 (inline Plan DoD).
//   members <sprint>  one repo-relative member path per line, sorted by task id (CURRENT folder: a stale
//                     `## Members` path is resolved by id). Named error if any listed id has no unique file.
//   counts <sprint>   line-oriented, in this order:
//                       dod <ticked> <open>                    `## Done when` boxes summed over members
//                       units <total> <delivered>              `### Tn` blocks whose `Cites:` names >=1 CURRENT member
//                       member <TASK-id> <ticked> <open> <path>  one per member
//                       unit <Tn> <delivered|open>             one per counted unit, Plan order
//                     A unit is delivered when EVERY current member its `Cites:` names has no open box.
//                     A Tn citing no current member is scoped out and leaves both unit counts.
//   active            sprint numbers (one per line, ascending) of top-level `<root>/docs/sprint/SPRINT-*.md`
//                     files whose frontmatter says `status: active` (archive/ and logs/ are not candidates).
//
//   Exit codes: 0 ok · 2 named error on stderr (`SPRINT-MEMBER-UNRESOLVED: <ids>` -- a listed member has no
//   unique file, or `SPRINT-FILE-MISSING`) with NOTHING on stdout -- never a silent empty/short list ·
//   3 `NOT-BY-REFERENCE` (members/counts on a v1 sprint) · 64 usage.
//
// Box grammar: a line `- [ ]` (open) or `- [x]`/`- [X]` (ticked) at column 0 inside the member's
// `## Done when` section; fenced code and HTML comments are ignored (scanBlocks).

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import {
  frontmatterField,
  nowTree,
  resolveMembers,
  scanBlocks,
  section,
  sprintNumber,
  taskIds,
  WORK,
} from "./sprint-members";

class CliError extends Error {
  constructor(readonly code: number, readonly name_: string, msg: string) {
    super(msg);
  }
}

/** Ticked/open `## Done when` boxes in one task file's text. */
export function doneWhenBoxes(text: string): { ticked: number; open: number } {
  const body = section(text, "Done when");
  let ticked = 0;
  let open = 0;
  if (body === null) return { ticked, open };
  for (const { line, hidden } of scanBlocks(body)) {
    if (hidden) continue;
    if (/^- \[ \]/.test(line)) open++;
    else if (/^- \[[xX]\]/.test(line)) ticked++;
  }
  return { ticked, open };
}

/** `### Tn` blocks of the sprint's `## Plan` with the TASK ids their `Cites:` field names. */
export function planUnits(sprintText: string): { tn: string; cites: Set<string> }[] {
  const plan = section(sprintText, "Plan");
  if (plan === null) return [];
  const units: { tn: string; citesText: string[] }[] = [];
  let inCites = false;
  for (const { line, hidden } of scanBlocks(plan)) {
    if (hidden) continue;
    const h = line.match(/^### (T\d+)\b/);
    if (h) {
      units.push({ tn: h[1]!, citesText: [] });
      inCites = false;
      continue;
    }
    const cur = units[units.length - 1];
    if (!cur) continue;
    if (/^Cites:/.test(line)) {
      inCites = true;
      cur.citesText.push(line);
    } else if (inCites && /^\s+\S/.test(line)) cur.citesText.push(line); // wrapped continuation
    else inCites = false;
  }
  return units.map((u) => ({ tn: u.tn, cites: taskIds(u.citesText.join("\n")) }));
}

function sprintText(sprintFile: string): string {
  if (!existsSync(sprintFile)) throw new CliError(2, "SPRINT-FILE-MISSING", `no sprint file at ${sprintFile}`);
  return readFileSync(sprintFile, "utf8");
}

/** v2 iff the store has task files AND this sprint lists a Members id or is stamped by a task. */
function isV2(root: string, sprintFile: string): boolean {
  const text = sprintText(sprintFile);
  const tree = nowTree(root);
  if (tree.paths.length === 0) return false;
  if (taskIds(section(text, "Members")).size > 0) return true;
  return resolveMembers(root, sprintFile).length > 0;
}

function requireMembers(root: string, sprintFile: string) {
  if (!isV2(root, sprintFile)) throw new CliError(3, "NOT-BY-REFERENCE", `${sprintFile} lists and stamps no member under ${WORK}/ -- it is a v1 (inline Plan DoD) sprint`);
  const text = sprintText(sprintFile);
  const members = resolveMembers(root, sprintFile);
  const have = new Set(members.map((m) => m.id));
  const missing = [...taskIds(section(text, "Members"))].filter((id) => !have.has(id)).sort();
  if (missing.length > 0) {
    throw new CliError(2, "SPRINT-MEMBER-UNRESOLVED", `${missing.join(" ")} -- listed in ${sprintFile} ## Members but no unique ${WORK}/*/TASK-NNN-*.md file resolves`);
  }
  return { members, text };
}

function counts(root: string, sprintFile: string): string {
  const { members, text } = requireMembers(root, sprintFile);
  const per = new Map<string, { ticked: number; open: number }>();
  const rows: string[] = [];
  let ticked = 0;
  let open = 0;
  for (const m of members) {
    const b = doneWhenBoxes(readFileSync(join(root, m.path), "utf8"));
    per.set(m.id, b);
    ticked += b.ticked;
    open += b.open;
    rows.push(`member ${m.id} ${b.ticked} ${b.open} ${m.path}`);
  }
  const units = planUnits(text)
    .map((u) => ({ tn: u.tn, cited: [...u.cites].filter((id) => per.has(id)) }))
    .filter((u) => u.cited.length > 0)
    .map((u) => ({ tn: u.tn, delivered: u.cited.every((id) => per.get(id)!.open === 0) }));
  const delivered = units.filter((u) => u.delivered).length;
  return [
    `dod ${ticked} ${open}`,
    `units ${units.length} ${delivered}`,
    ...rows,
    ...units.map((u) => `unit ${u.tn} ${u.delivered ? "delivered" : "open"}`),
  ].join("\n") + "\n";
}

function active(root: string): string {
  const dir = join(root, "docs/sprint");
  const nums: number[] = [];
  if (existsSync(dir)) {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      if (!e.isFile() || !/^SPRINT-\d+.*\.md$/.test(e.name)) continue;
      const t = readFileSync(join(dir, e.name), "utf8");
      const n = sprintNumber(frontmatterField(t, "sprint"));
      if (n !== null && frontmatterField(t, "status")?.toLowerCase() === "active") nums.push(n);
    }
  }
  return [...new Set(nums)].sort((a, b) => a - b).map((n) => `${n}\n`).join("");
}

function main(argv: string[]): string {
  const args = [...argv];
  let root = process.cwd();
  const ri = args.indexOf("--root");
  if (ri >= 0) {
    root = resolve(args[ri + 1] ?? "");
    args.splice(ri, 2);
  }
  const [mode, sprint] = args;
  if (mode === "active" && args.length === 1) return active(root);
  if (!sprint || args.length !== 2 || !["kind", "members", "counts"].includes(mode ?? "")) {
    throw new CliError(64, "USAGE", "usage: sprint-members-cli.ts kind|members|counts <sprint-file> [--root <dir>] | active [--root <dir>]");
  }
  if (mode === "kind") return isV2(root, sprint) ? "v2\n" : "v1\n";
  if (mode === "members") return requireMembers(root, sprint).members.map((m) => m.path + "\n").join("");
  return counts(root, sprint);
}

if (import.meta.main) {
  try {
    process.stdout.write(main(process.argv.slice(2)));
  } catch (e) {
    if (e instanceof CliError) {
      process.stderr.write(e.code === 64 ? `${e.message}\n` : `${e.name_}: ${e.message}\n`);
      process.exit(e.code);
    }
    throw e;
  }
}

