// scripts/lib/check-sprint-by-reference.ts -- the Plan freeze and the close check for a sprint run
// BY REFERENCE (SPRINT-107 T1 · TASK-362 · EPIC-017 D2 · ADR-047). Run by Bun. Tier G.
//
// WHY THIS EXISTS. Once a sprint stops copying each task's DoD into its Plan, the only DoD is the
// member file's own `## Done when`, and the member file keeps being edited (ticks, evidence, folder
// moves) for the whole sprint. The freeze must survive that: `plan_commit` IS the frozen snapshot
// (owner ruling, SPRINT-107 G2 -- no hash field). Each member is resolved BY TASK ID in its baseline
// tree, so its later todo -> in_progress -> done moves do not matter, and its `## Done when` there
// is compared with the current file's. Ticking a box (and the ` ✓ <evidence>` the tick convention
// appends) is not an edit; a `## Amended <date>` section sits outside `## Done when` and is never
// read. Any other difference FAILs unless the Execution Log holds a `scope-change` ENTRY (the event
// field of its `### date | event | summary` heading, never a prose mention) that is NEW since the
// member's baseline and names that TASK id -- or a `Tn` whose frozen Plan block `Cites:` it.
//
// THE FREEZE POINT IS ITSELF CHECKED (review round 1, major 2). plan_commit must be an ancestor of
// HEAD, must already hold the sprint file, and may never be later than the commit that first
// recorded a plan_commit value -- so it cannot be re-pointed at HEAD to launder an edit, while a
// repair to an EARLIER commit (SPRINT-107's own slip) still passes.
//
// POPULATION (L-186 -- which members are examined; review round 1, major 1). The union of FOUR
// indices: `## Members` ids and `sprint:` stamps, each read both at plan_commit and now. So:
//   planned: in an index at plan_commit. Gone from both current indices -> scoped out, which needs
//            a scope-change entry naming it (else MEMBER-DROPPED); scoped-out members are not
//            checked further.
//   added:   in a current index only. Passes only if a post-plan_commit scope-change names it (else
//            MEMBER-UNPLANNED); its baseline is the first commit after plan_commit that stamps or
//            lists it (owner ruling, SPRINT-107 G2).
//
// Usage: bun scripts/lib/check-sprint-by-reference.ts <sprint-file> [--close]
//   freeze (always):  FREEZE-EDIT <id>       unlogged change to a member's `## Done when` since its baseline
//                     NO-DONE-WHEN <id>      no `## Done when` at the baseline or now -- nothing to compare
//                     MEMBER-DROPPED <id>    planned member left both indices with no scope-change
//                     MEMBER-UNPLANNED <id>  member added after plan_commit with no scope-change
//   close (--close):  CLOSE-OPEN <id>        member not in done/ or cancel/
//   both:             MEMBER-MISSING <id>    member absent (or ambiguous) at its baseline or now
//   freeze point:     NO-PLAN-COMMIT · PLAN-COMMIT-NOT-ANCESTOR · PLAN-COMMIT-NO-PLAN ·
//                     PLAN-COMMIT-UNRECORDED · PLAN-COMMIT-LATE
//   guards:           NO-MEMBERS -- a check with nothing to check is not a pass
// Prints one PASS/FAIL line per assertion, then `check-sprint-by-reference: N pass, M fail`.
// Exits 1 if M > 0.

import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { basename, dirname, join, relative, resolve } from "node:path";

const WORK = "docs/work";
const CLOSED = new Set(["done", "cancel"]);
const SHA = /^[0-9a-f]{7,40}$/;

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
function gitOk(cwd: string, args: string[]): boolean {
  try {
    git(cwd, args);
    return true;
  } catch {
    return false;
  }
}

function lf(s: string): string {
  return s.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
}

/** A frontmatter value: `# comment` tail and surrounding quotes stripped. */
function frontmatterField(content: string, key: string): string | null {
  const lines = lf(content).split("\n");
  if (lines[0]!.trimEnd() !== "---") return null;
  for (let i = 1; i < lines.length && lines[i]!.trimEnd() !== "---"; i++) {
    const m = lines[i]!.match(new RegExp(`^${key}:[ \\t]*(.*)$`));
    if (!m) continue;
    let v = m[1]!.replace(/\s+#.*$/, "").trim();
    if (/^(["']).*\1$/.test(v)) v = v.slice(1, -1).trim();
    return v;
  }
  return null;
}

/** `SPRINT-107`, `107`, `"SPRINT-0107"` -> 107; anything else -> null. */
function sprintNumber(v: string | null): number | null {
  const m = (v ?? "").match(/^(?:SPRINT-)?0*(\d+)$/i);
  return m ? Number(m[1]) : null;
}

/** Lines outside fenced code blocks, so a fenced `## ` or `### ` is never read as a heading. */
function unfenced(content: string): { line: string; fenced: boolean }[] {
  let fence: string | null = null;
  return lf(content)
    .split("\n")
    .map((line) => {
      const f = line.match(/^\s*(`{3,}|~{3,})/);
      if (f) {
        if (fence === null) fence = f[1]![0]!;
        else if (f[1]![0] === fence) fence = null;
        return { line, fenced: true }; // a fence line is never a heading
      }
      return { line, fenced: fence !== null };
    });
}

/** Every level-2 section with this heading, concatenated; null when none exists. */
function section(content: string, heading: string): string | null {
  const out: string[] = [];
  let inside = false;
  let found = false;
  for (const { line, fenced } of unfenced(content)) {
    if (!fenced && /^## /.test(line)) {
      inside = line.trim().toLowerCase() === `## ${heading}`.toLowerCase();
      found ||= inside;
      continue;
    }
    if (inside) out.push(line);
  }
  return found ? out.join("\n") : null;
}

/** Every `TASK-NNN` token in a text -- any line shape: bullets, tables, several per line. */
function taskIds(text: string | null): Set<string> {
  return new Set([...(text ?? "").matchAll(/\bTASK-\d+(?![0-9])/g)].map((m) => m[0]));
}

const BOX = /^\s*(?:[-*+]|\d+[.)])\s+\[([ xX])\]\s?(.*)$/;

/** The `## Done when` body as comparable lines: blank lines dropped, trailing space trimmed. */
function doneLines(body: string): { box: boolean; ticked: boolean; text: string }[] {
  return body
    .split("\n")
    .map((l) => l.replace(/\s+$/, ""))
    .filter((l) => l.length > 0)
    .map((l) => {
      const m = l.match(BOX);
      return m ? { box: true, ticked: m[1] !== " ", text: m[2]!.trim() } : { box: false, ticked: false, text: l.trim() };
    });
}

/** Equal up to tick state and the ` ✓ <evidence>` a live tick appends -- a ✓ already in the frozen text is text. */
function sameDoneWhen(frozen: string, live: string): boolean {
  const a = doneLines(frozen);
  const b = doneLines(live);
  if (a.length !== b.length) return false;
  return a.every((f, i) => {
    const l = b[i]!;
    if (f.box !== l.box) return false;
    if (l.text === f.text) return true;
    if (!f.box || !l.ticked || !l.text.startsWith(f.text)) return false;
    const tail = l.text.slice(f.text.length);
    return f.text.length > 0 && /^\s*✓/.test(tail);
  });
}

/** Exact id match on a whole token: TASK-36 never matches TASK-360. */
function idRe(id: string): RegExp {
  return new RegExp(`\\b${id}(?![0-9])`);
}

/** Paths among `paths` whose basename is this task id's file (`TASK-NNN-<slug>.md`). */
function resolveId(paths: string[], id: string): string[] {
  return paths.filter((p) => p.startsWith(`${WORK}/`) && basename(p).startsWith(`${id}-`) && p.endsWith(".md"));
}

/**
 * Execution Log entries whose event is `scope-change`. An entry is its `### ` heading plus body, up
 * to the next heading of level 1-3 (never the rest of the file). The heading's second `|` field is
 * the event; the summary field may be absent.
 */
function scopeChangeEntries(log: string): string[] {
  const entries: string[] = [];
  let cur: string[] | null = null;
  for (const { line, fenced } of unfenced(log)) {
    if (!fenced && /^#{1,3} /.test(line)) {
      if (cur) entries.push(cur.join("\n").trim());
      cur = null;
      const f = line.split("|");
      if (/^### /.test(line) && f.length >= 2 && f[1]!.trim().toLowerCase() === "scope-change") cur = [line];
      continue;
    }
    cur?.push(line);
  }
  if (cur) entries.push(cur.join("\n").trim());
  return entries;
}

interface Tree {
  label: string; // short commit, or "now"
  commit: string | null; // full sha; null for the working tree
  paths: string[];
  read: (p: string) => string | null;
}

function nowTree(root: string): Tree {
  const paths: string[] = [];
  const workDir = join(root, WORK);
  if (existsSync(workDir)) {
    for (const folder of readdirSync(workDir, { withFileTypes: true })) {
      if (!folder.isDirectory()) continue;
      for (const f of readdirSync(join(workDir, folder.name))) {
        if (/^TASK-\d+-.*\.md$/.test(f)) paths.push(`${WORK}/${folder.name}/${f}`);
      }
    }
  }
  return { label: "now", commit: null, paths, read: (p) => (existsSync(join(root, p)) ? readFileSync(join(root, p), "utf8") : null) };
}

function commitTree(root: string, commit: string): Tree {
  const paths = git(root, ["ls-tree", "-r", "-z", "--name-only", commit, "--", WORK])
    .split("\0")
    .filter((l) => /\/TASK-\d+-[^/]*\.md$/.test(l));
  return {
    label: commit.slice(0, 7),
    commit,
    paths,
    read: (p) => {
      try {
        return git(root, ["show", `${commit}:${p}`]);
      } catch {
        return null;
      }
    },
  };
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
  const sprintRel = relative(root, sprintPath).split("\\").join("/");
  const logRel = `${dirname(sprintRel)}/logs/${basename(sprintRel)}`;

  const sprintNo = sprintNumber(frontmatterField(sprintText, "sprint"));
  const sprintId = `SPRINT-${sprintNo ?? "?"}`;
  const planCommit = frontmatterField(sprintText, "plan_commit") ?? "";

  // --- the freeze point --------------------------------------------------------------------------
  if (!SHA.test(planCommit) || !gitOk(root, ["rev-parse", "--verify", "--quiet", `${planCommit}^{commit}`])) {
    bad("NO-PLAN-COMMIT", `plan_commit "${planCommit}" does not resolve to a commit -- nothing is frozen`);
    return;
  }
  const pc = git(root, ["rev-parse", `${planCommit}^{commit}`]).trim();
  if (!gitOk(root, ["merge-base", "--is-ancestor", pc, "HEAD"])) {
    bad("PLAN-COMMIT-NOT-ANCESTOR", `plan_commit ${planCommit} is not an ancestor of HEAD -- not this history's freeze`);
    return;
  }
  // The sprint file as it stood at plan_commit: same path, else (archived since) the same basename under docs/sprint.
  let sprintRelAtPc: string | null = null;
  for (const p of git(root, ["ls-tree", "-r", "-z", "--name-only", pc, "--", "docs/sprint"]).split("\0")) {
    if (p === sprintRel) sprintRelAtPc = p;
    else if (sprintRelAtPc === null && basename(p) === basename(sprintRel) && !p.includes("/logs/")) sprintRelAtPc = p;
  }
  if (sprintRelAtPc === null) {
    bad("PLAN-COMMIT-NO-PLAN", `the sprint file does not exist at plan_commit ${planCommit} -- the freeze predates the Plan`);
    return;
  }
  // The commit that first recorded a resolvable plan_commit value: plan_commit may be it or earlier, never later.
  let firstRecording: string | null = null;
  const hist = git(root, ["log", "--format=%x00%H", "--name-only", "--follow", "--", sprintRel])
    .split("\0")
    .filter((c) => c.trim().length > 0)
    .map((c) => {
      const [h, ...files] = c.trim().split("\n");
      return { h: h!.trim(), path: files.map((f) => f.trim()).find((f) => f.length > 0) ?? sprintRel };
    })
    .reverse();
  for (const { h, path } of hist) {
    let v: string | null = null;
    try {
      v = frontmatterField(git(root, ["show", `${h}:${path}`]), "plan_commit");
    } catch {
      continue;
    }
    if (v && SHA.test(v) && gitOk(root, ["rev-parse", "--verify", "--quiet", `${v}^{commit}`])) {
      firstRecording = h;
      break;
    }
  }
  if (firstRecording === null) {
    bad("PLAN-COMMIT-UNRECORDED", `no commit of ${sprintRel} records a plan_commit -- the freeze point is not in history`);
    return;
  }
  if (!gitOk(root, ["merge-base", "--is-ancestor", pc, firstRecording])) {
    bad(
      "PLAN-COMMIT-LATE",
      `plan_commit ${planCommit} is later than ${firstRecording.slice(0, 7)}, the commit that first recorded one -- re-pointed forward`,
    );
    return;
  }
  ok("freeze point", `plan_commit ${planCommit} holds the Plan, is an ancestor of HEAD and not later than ${firstRecording.slice(0, 7)}`);

  // --- the Execution Log: logs/<file> plus any inline ## Execution Log, now and at a baseline -----
  const logAt = (commit: string | null): string => {
    const read = (p: string) => {
      if (commit === null) return existsSync(join(root, p)) ? readFileSync(join(root, p), "utf8") : "";
      try {
        return git(root, ["show", `${commit}:${p}`]);
      } catch {
        return "";
      }
    };
    const sprintAt = commit === null ? sprintText : read(commit === pc ? sprintRelAtPc! : sprintRel) || read(sprintRelAtPc!);
    return `${read(logRel)}\n\n${section(sprintAt, "Execution Log") ?? ""}`;
  };
  const liveEntries = scopeChangeEntries(logAt(null));
  const newSince = new Map<string, string[]>();
  const scopedSince = (base: string): string[] => {
    if (!newSince.has(base)) {
      const before = new Set(scopeChangeEntries(logAt(base)));
      newSince.set(base, liveEntries.filter((e) => !before.has(e)));
    }
    return newSince.get(base)!;
  };

  // `Tn` -> the TASK ids its frozen Plan block Cites, so an entry naming `T1` names T1's members.
  const frozenSprint = git(root, ["show", `${pc}:${sprintRelAtPc}`]);
  const tCites = new Map<string, Set<string>>();
  let curT: string | null = null;
  for (const { line, fenced } of unfenced(section(frozenSprint, "Plan") ?? "")) {
    if (fenced) continue;
    const h = line.match(/^### (T\d+)\b/);
    if (h) curT = h[1]!;
    else if (/^#{1,3} /.test(line)) curT = null;
    else if (curT && /^Cites:/.test(line)) tCites.set(curT, taskIds(line));
  }
  const names = (entries: string[], id: string): boolean =>
    entries.some(
      (e) => idRe(id).test(e) || [...e.matchAll(/\b(T\d+)(?![0-9])/g)].some((t) => tCites.get(t[1]!)?.has(id) ?? false),
    );

  // --- population: Members ids ∪ sprint: stamps, at plan_commit and now --------------------------
  const stampedIn = (t: Tree): Set<string> => {
    const s = new Set<string>();
    for (const p of t.paths) {
      const c = t.read(p);
      if (c !== null && sprintNo !== null && sprintNumber(frontmatterField(c, "sprint")) === sprintNo) {
        s.add(basename(p).match(/^(TASK-\d+)-/)![1]!);
      }
    }
    return s;
  };
  const pcTree = commitTree(root, pc);
  const now = nowTree(root);
  const planned = new Set([...taskIds(section(frozenSprint, "Members")), ...stampedIn(pcTree)]);
  const current = new Set([...taskIds(section(sprintText, "Members")), ...stampedIn(now)]);
  const all = [...new Set([...planned, ...current])].sort();
  if (all.length === 0) {
    bad("NO-MEMBERS", `no member listed under ## Members or stamped sprint: ${sprintId}, at plan_commit or now`);
    return;
  }

  // Added member's baseline: the first commit after plan_commit whose tree stamps or lists it.
  const laterCommits = git(root, ["rev-list", "--reverse", `${pc}..HEAD`]).split("\n").filter((l) => l.length > 0);
  const baselineOf = (id: string): Tree | null => {
    for (const c of laterCommits) {
      const t = commitTree(root, c);
      const f = resolveId(t.paths, id);
      const stamped = f.length === 1 && sprintNumber(frontmatterField(t.read(f[0]!) ?? "", "sprint")) === sprintNo;
      let listed = false;
      if (!stamped) {
        try {
          listed = taskIds(section(git(root, ["show", `${c}:${sprintRel}`]), "Members")).has(id);
        } catch {}
      }
      if (stamped || listed) return t;
    }
    return null;
  };

  for (const id of all) {
    let base: Tree = pcTree;
    if (planned.has(id) && !current.has(id)) {
      if (names(scopedSince(pc), id)) ok(`scoped-out ${id}`, `left the sprint after ${planCommit}; a scope-change entry names it`);
      else bad(`MEMBER-DROPPED ${id}`, `a member at ${planCommit}, now in neither ## Members nor a sprint: stamp, and no scope-change names it`);
      continue;
    }
    if (!planned.has(id)) {
      if (!names(scopedSince(pc), id)) {
        bad(`MEMBER-UNPLANNED ${id}`, `joined after ${planCommit} with no scope-change entry naming it`);
        continue;
      }
      base = baselineOf(id) ?? now; // joined in the working tree only: nothing committed yet to drift from
      ok(`admitted ${id}`, `joined after ${planCommit}; a scope-change names it; baseline ${base.label}`);
    }

    const then = resolveId(base.paths, id);
    const nowP = resolveId(now.paths, id);
    if (then.length !== 1 || nowP.length !== 1) {
      bad(`MEMBER-MISSING ${id}`, `resolves to ${then.length} file(s) at ${base.label} and ${nowP.length} now -- expected exactly one each`);
      continue;
    }
    const frozen = section(base.read(then[0]!) ?? "", "Done when");
    const live = section(now.read(nowP[0]!) ?? "", "Done when");
    if (frozen === null || live === null || doneLines(frozen).length === 0) {
      bad(`NO-DONE-WHEN ${id}`, `no ## Done when ${frozen === null || doneLines(frozen).length === 0 ? `at ${base.label}` : "now"} -- nothing frozen to compare`);
    } else if (sameDoneWhen(frozen, live)) {
      ok(`freeze ${id}`, `## Done when unchanged since ${base.label} (ticks ignored; now at ${nowP[0]})`);
    } else if (base.commit !== null && names(scopedSince(base.commit), id)) {
      ok(`freeze ${id}`, `## Done when changed since ${base.label}, covered by a scope-change entry new since then naming ${id}`);
    } else {
      bad(`FREEZE-EDIT ${id}`, `## Done when changed since ${base.label} with no scope-change entry new since then naming ${id}`);
    }

    if (closeMode) {
      const folder = nowP[0]!.split("/")[2]!;
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
