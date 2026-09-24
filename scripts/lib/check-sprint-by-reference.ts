// scripts/lib/check-sprint-by-reference.ts -- the Plan freeze and the close check for a sprint run
// BY REFERENCE (SPRINT-107 T1 · TASK-362 · EPIC-017 D2 · ADR-047). Run by Bun. Tier G.
//
// WHY THIS EXISTS. Once a sprint stops copying each task's DoD into its Plan, the only DoD is the
// member file's own `## Done when`, and the member file keeps being edited (ticks, evidence, folder
// moves) for the whole sprint. The freeze must survive that: `plan_commit` IS the frozen snapshot
// (owner ruling, SPRINT-107 G2 -- no hash field). Each member is resolved BY TASK ID in the
// plan_commit tree, so its later todo -> in_progress -> done moves do not matter, and its
// `## Done when` there is compared with the current file's. Ticking a box (and the ` ✓ <evidence>`
// the tick convention appends) is not an edit; a `## Amended <date>` section sits outside
// `## Done when` and is never read. Any other difference FAILs unless the sprint's Execution Log
// holds a `scope-change` ENTRY (the event field of its `### date | event | summary` heading, never
// a prose mention) naming that TASK id.
//
// POPULATION (L-186 -- which members are examined): the ids on the sprint file's `## Members` list
// UNION every current `docs/work/*/TASK-*.md` whose frontmatter `sprint:` names this sprint. Either
// index alone can drift from the other; the union means drift in one still selects the member.
// Not covered: a member removed from BOTH indices -- that is an edit to the sprint file itself.
//
// Usage: bun scripts/lib/check-sprint-by-reference.ts <sprint-file> [--close]
//   freeze (always):  FREEZE-EDIT <id>     unlogged post-promote change to a member's `## Done when`
//   close (--close):  CLOSE-OPEN <id>      member not in done/ or cancel/
//   both:             MEMBER-MISSING <id>  member absent (or ambiguous) at plan_commit or now
//   guards:           NO-PLAN-COMMIT · NO-MEMBERS -- a check with nothing to check is not a pass
// Prints one PASS/FAIL line per assertion, then `check-sprint-by-reference: N pass, M fail`.
// Exits 1 if M > 0.

import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";

const WORK = "docs/work";
const CLOSED = new Set(["done", "cancel"]);

let pass = 0;
let fail = 0;
function ok(check: string, detail: string) {
  console.log(`PASS  ${check} -- ${detail}`);
  pass++;
}
function bad(finding: string, detail: string) {
  console.log(`FAIL  ${finding} -- ${detail}`);
  fail++;
}

function git(cwd: string, args: string[]): string {
  return execFileSync("git", args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
}

function lf(s: string): string {
  return s.replace(/\r\n/g, "\n");
}

function frontmatterField(content: string, key: string): string | null {
  const lines = lf(content).split("\n");
  if (lines[0] !== "---") return null;
  for (let i = 1; i < lines.length && lines[i] !== "---"; i++) {
    const m = lines[i]!.match(new RegExp(`^${key}:[ \\t]*(.*)$`));
    if (m) return m[1]!.trim();
  }
  return null;
}

/** Body of a level-2 section, up to the next level-2 heading; null when the heading is absent. */
function section(content: string, heading: string): string | null {
  const lines = lf(content).split("\n");
  const start = lines.findIndex((l) => l.trim() === `## ${heading}`);
  if (start < 0) return null;
  const out: string[] = [];
  for (let i = start + 1; i < lines.length && !/^## /.test(lines[i]!); i++) out.push(lines[i]!);
  return out.join("\n");
}

/** A box's tick state -- and the ` ✓ <evidence>` a tick appends -- is not part of the frozen DoD. */
function normalizeDoneWhen(body: string | null): string {
  if (body === null) return "";
  return body
    .split("\n")
    .map((l) => {
      const m = l.match(/^(\s*[-*]\s+)\[[xX]\](.*)$/);
      if (!m) return l.replace(/\s+$/, "");
      let rest = m[2]!;
      const tick = rest.lastIndexOf(" ✓");
      if (tick >= 0) rest = rest.slice(0, tick);
      return `${m[1]}[ ]${rest}`.replace(/\s+$/, "");
    })
    .join("\n")
    .trim();
}

/** Exact id match on a whole token: TASK-36 never matches TASK-360. */
function idRe(id: string): RegExp {
  return new RegExp(`\\b${id}(?![0-9])`);
}

/** Paths among `paths` whose basename is this task id's file (`TASK-NNN-<slug>.md`). */
function resolveId(paths: string[], id: string): string[] {
  return paths.filter((p) => basename(p).startsWith(`${id}-`) && p.endsWith(".md"));
}

/** Ids named by `scope-change` ENTRIES only -- the event field of the heading, never prose. */
function scopeChangeIds(log: string | null): string {
  if (log === null) return "";
  const entries = lf(log).split(/\n(?=### )/);
  return entries
    .filter((e) => {
      const m = e.match(/^### [^|\n]*\|([^|\n]*)\|/);
      return m !== null && m[1]!.trim() === "scope-change";
    })
    .join("\n");
}

function main(argv: string[]) {
  const args = argv.filter((a) => a !== "--close");
  const closeMode = argv.includes("--close");
  if (args.length !== 1) {
    console.error("usage: check-sprint-by-reference.ts <sprint-file> [--close]");
    process.exit(2);
  }
  const sprintPath = resolve(args[0]!);
  const sprintText = readFileSync(sprintPath, "utf8");
  const root = git(dirname(sprintPath), ["rev-parse", "--show-toplevel"]).trim();

  const sprintNo = (frontmatterField(sprintText, "sprint") ?? "").replace(/^SPRINT-/, "");
  const sprintId = `SPRINT-${sprintNo}`;
  const planCommit = frontmatterField(sprintText, "plan_commit") ?? "";

  let pcOk = /^[0-9a-f]{7,40}$/.test(planCommit);
  if (pcOk) {
    try {
      git(root, ["rev-parse", "--verify", "--quiet", `${planCommit}^{commit}`]);
    } catch {
      pcOk = false;
    }
  }
  if (!pcOk) {
    bad("NO-PLAN-COMMIT", `plan_commit "${planCommit}" does not resolve to a commit -- nothing is frozen`);
    return;
  }

  // Current tree: docs/work/<folder>/TASK-*.md on disk.
  const current: string[] = [];
  const workDir = join(root, WORK);
  if (existsSync(workDir)) {
    for (const folder of readdirSync(workDir, { withFileTypes: true })) {
      if (!folder.isDirectory()) continue;
      for (const f of readdirSync(join(workDir, folder.name))) {
        if (/^TASK-\d+-.*\.md$/.test(f)) current.push(`${WORK}/${folder.name}/${f}`);
      }
    }
  }

  // Population: Members list ∪ files stamped `sprint: <this sprint>`.
  const members = new Set<string>();
  for (const m of (section(sprintText, "Members") ?? "").matchAll(/^\s*[-*]\s+.*?\b(TASK-\d+)(?![0-9])/gm)) {
    members.add(m[1]!);
  }
  for (const p of current) {
    const s = frontmatterField(readFileSync(join(root, p), "utf8"), "sprint");
    if (s === sprintId) members.add(basename(p).match(/^(TASK-\d+)-/)![1]!);
  }
  if (members.size === 0) {
    bad("NO-MEMBERS", `no member listed under ## Members or stamped sprint: ${sprintId}`);
    return;
  }

  const frozenTree = git(root, ["ls-tree", "-r", "--name-only", planCommit, "--", WORK])
    .split("\n")
    .filter((l) => l.length > 0);

  const logPath = join(dirname(sprintPath), "logs", basename(sprintPath));
  const scoped = scopeChangeIds(existsSync(logPath) ? readFileSync(logPath, "utf8") : null);

  for (const id of [...members].sort()) {
    const then = resolveId(frozenTree, id);
    const now = resolveId(current, id);
    if (then.length !== 1 || now.length !== 1) {
      bad(
        `MEMBER-MISSING ${id}`,
        `resolves to ${then.length} file(s) at ${planCommit} and ${now.length} now -- expected exactly one each`,
      );
      continue;
    }
    const frozen = normalizeDoneWhen(section(git(root, ["show", `${planCommit}:${then[0]}`]), "Done when"));
    const live = normalizeDoneWhen(section(readFileSync(join(root, now[0]!), "utf8"), "Done when"));
    if (frozen === live) {
      ok(`freeze ${id}`, `## Done when unchanged since ${planCommit} (ticks ignored; now at ${now[0]})`);
    } else if (idRe(id).test(scoped)) {
      ok(`freeze ${id}`, `## Done when changed since ${planCommit}, covered by a scope-change entry naming ${id}`);
    } else {
      bad(`FREEZE-EDIT ${id}`, `## Done when changed since ${planCommit} with no scope-change entry naming ${id}`);
    }

    if (closeMode) {
      const folder = now[0]!.split("/")[2]!;
      if (CLOSED.has(folder)) ok(`close ${id}`, `in ${folder}/`);
      else bad(`CLOSE-OPEN ${id}`, `in ${folder}/, not done/ or cancel/`);
    }
  }
}

if (import.meta.main) {
  try {
    main(process.argv.slice(2));
  } catch (e) {
    bad("CHECK-ERROR", `the check could not complete: ${String((e as Error).message).split("\n")[0]}`);
  } finally {
    console.log(`check-sprint-by-reference: ${pass} pass, ${fail} fail`);
  }
  process.exit(fail > 0 ? 1 : 0);
}
