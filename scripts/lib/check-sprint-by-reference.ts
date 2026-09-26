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
import { existsSync, readdirSync, readFileSync, realpathSync } from "node:fs";
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

/** The text after a leading `---` frontmatter block, LF-normalised. */
function body(content: string): string {
  const t = lf(content);
  const m = t.match(/^---[ \t]*\n[\s\S]*?\n---[ \t]*(\n|$)/);
  return m ? t.slice(m[0].length) : t;
}

/** `SPRINT-107`, `107`, `"SPRINT-0107"` -> 107; anything else -> null. */
function sprintNumber(v: string | null): number | null {
  const m = (v ?? "").match(/^(?:SPRINT-)?0*(\d+)$/i);
  return m ? Number(m[1]) : null;
}

/**
 * Lines outside fenced code blocks, so a fenced `## ` or `### ` is never read as a heading.
 * CommonMark closing rule: a fence closes only on a line of the SAME char, a run length >= the
 * opener's, and nothing but whitespace after the run -- so an inner "```typescript" inside a
 * "````" fence is just more fenced content, never a close.
 */
function unfenced(content: string): { line: string; fenced: boolean }[] {
  let openChar: string | null = null;
  let openLen = 0;
  return lf(content)
    .split("\n")
    .map((line) => {
      const f = line.match(/^\s*(`{3,}|~{3,})(.*)$/);
      if (f) {
        const runChar = f[1]![0]!;
        const runLen = f[1]!.length;
        if (openChar === null) {
          openChar = runChar;
          openLen = runLen;
        } else if (runChar === openChar && runLen >= openLen && /^\s*$/.test(f[2]!)) {
          openChar = null;
          openLen = 0;
        }
        return { line, fenced: true }; // a fence line (open, inner or close) is never a heading
      }
      return { line, fenced: openChar !== null };
    });
}

/** HTML comments blanked to same-length whitespace (newlines kept), so line numbers survive. */
function blankComments(text: string): string {
  return text.replace(/<!--[\s\S]*?(-->|$)/g, (c) => c.replace(/[^\n]/g, " "));
}

/**
 * Every level-2 section with this heading, concatenated; null when none exists. Boundaries are
 * found on comment-blanked text, so a `## ` inside an HTML comment never opens or closes a section
 * (D1) -- but the RAW line is what is pushed into the body, so an edit inside the comment still
 * shows as a text change.
 */
function section(content: string, heading: string): string | null {
  const rawLines = lf(content).split("\n");
  const blankLines = blankComments(lf(content)).split("\n");
  const fenced = unfenced(content).map((x) => x.fenced);
  const out: string[] = [];
  let inside = false;
  let found = false;
  for (let i = 0; i < rawLines.length; i++) {
    const blankLine = blankLines[i]!;
    if (!fenced[i] && /^## /.test(blankLine)) {
      inside = blankLine.trim().toLowerCase() === `## ${heading}`.toLowerCase();
      found ||= inside;
      continue;
    }
    if (inside) out.push(rawLines[i]!);
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
 * the event; the summary field may be absent. Only entries whose heading starts at or after `from`
 * count -- but the WHOLE log is parsed, so a comment or fence opened before `from` still hides what
 * follows it (round 3, finding 1).
 */
function scopeChangeEntries(log: string, from = 0): string[] {
  const entries: string[] = [];
  let cur: string[] | null = null;
  let at = 0;
  const blanked = blankComments(log); // same offsets
  for (const { line, fenced } of unfenced(blanked)) {
    const start = at;
    at += line.length + 1;
    if (!fenced && /^#{1,3} /.test(line)) {
      if (cur) entries.push(cur.join("\n").trim());
      cur = null;
      const f = line.split("|");
      if (start >= from && /^### /.test(line) && f.length >= 2 && f[1]!.trim().toLowerCase() === "scope-change") cur = [line];
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
    const walk = (rel: string) => {
      for (const e of readdirSync(join(root, rel), { withFileTypes: true })) {
        if (e.isDirectory()) walk(`${rel}/${e.name}`);
        else if (/^TASK-\d+-.*\.md$/.test(e.name)) paths.push(`${rel}/${e.name}`);
      }
    };
    walk(WORK); // recursive, like the commit trees' ls-tree -r: a nested folder is not a different population
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
    bad("USAGE", "check-sprint-by-reference.ts <sprint-file> [--close]");
    return;
  }
  const sprintPath = resolve(args[0]!);
  const sprintText = readFileSync(sprintPath, "utf8");
  // Real spelling on both sides: an 8.3 short name or a junction/alias makes relative() climb
  // `../../..` (and `git log --follow` throw) unless both are resolved the same way first.
  const root = realpathSync.native(git(dirname(sprintPath), ["rev-parse", "--show-toplevel"]).trim());
  const sprintRel = relative(root, realpathSync.native(sprintPath)).split("\\").join("/");
  // The log sits beside the sprint in logs/ -- unless only one of the pair was archived; then any
  // tracked docs/sprint/**/logs/<same basename> is it.
  let logRel = `${dirname(sprintRel)}/logs/${basename(sprintRel)}`;
  if (!existsSync(join(root, logRel))) {
    const logs = git(root, ["ls-files", "-z", "--", "docs/sprint"]).split("\0").filter((p) => p.includes("/logs/"));
    // same basename; else (the sprint was renamed, its log not) the one log whose frontmatter names this sprint
    const sprintNoEarly = sprintNumber(frontmatterField(sprintText, "sprint"));
    const byFm = logs.filter((p) => sprintNumber(frontmatterField(readFileSync(join(root, p), "utf8"), "sprint")) === sprintNoEarly);
    const found = logs.find((p) => basename(p) === basename(sprintRel)) ?? (byFm.length === 1 ? byFm[0] : undefined);
    if (found) logRel = found;
  }

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
  // Where the sprint file and its log lived at any commit: archiving (`git mv` into archive/) and a
  // rename both move them, so every historical read resolves its path AT THAT COMMIT (round 2, major 1).
  const follow = (rel: string) =>
    git(root, ["log", "--format=%x00%H", "--name-only", "--follow", "--", rel])
      .split("\0")
      .filter((c) => c.trim().length > 0)
      .map((c) => {
        const [h, ...files] = c.trim().split("\n");
        return { h: h!.trim(), path: files.map((f) => f.trim()).find((f) => f.length > 0) ?? rel };
      })
      .reverse();
  const hist = follow(sprintRel);
  const logPaths = new Set([logRel, ...(existsSync(join(root, logRel)) ? follow(logRel).map((e) => e.path) : [])]);
  const sprintPaths = new Set([sprintRel, ...hist.map((e) => e.path)]);
  const treeCache = new Map<string, string[]>();
  const fileAt = (commit: string, kind: "sprint" | "log"): string | null => {
    if (!treeCache.has(commit)) {
      treeCache.set(commit, git(root, ["ls-tree", "-r", "-z", "--name-only", commit, "--", "docs/sprint"]).split("\0"));
    }
    const tree = treeCache.get(commit)!;
    const known = kind === "sprint" ? sprintPaths : logPaths;
    const hit = tree.find((p) => known.has(p));
    if (hit) return hit;
    const isLog = (p: string) => p.includes("/logs/");
    return tree.find((p) => basename(p) === basename(sprintRel) && isLog(p) === (kind === "log")) ?? null;
  };
  const showAt = (commit: string, kind: "sprint" | "log"): string => {
    const p = fileAt(commit, kind);
    if (p === null) return "";
    try {
      return git(root, ["show", `${commit}:${p}`]);
    } catch {
      return "";
    }
  };

  const sprintRelAtPc = fileAt(pc, "sprint");
  if (sprintRelAtPc === null) {
    bad("PLAN-COMMIT-NO-PLAN", `the sprint file does not exist at plan_commit ${planCommit} -- the freeze predates the Plan`);
    return;
  }
  // plan_commit may be no later than ANY sign that the sprint had started: the sprint file first active,
  // first listing a member, first recording a plan_commit, or a member file first stamped with it. A late
  // recording moves only one of those (round 2, major 2).
  const starts: { c: string; why: string }[] = [];
  let recorded = false;
  const seen = new Set<string>();
  for (const { h, path } of hist) {
    let t: string;
    try {
      t = git(root, ["show", `${h}:${path}`]);
    } catch {
      continue;
    }
    const v = frontmatterField(t, "plan_commit");
    const rec = v !== null && SHA.test(v) && gitOk(root, ["rev-parse", "--verify", "--quiet", `${v}^{commit}`]);
    recorded ||= rec;
    const sigs: [boolean, string][] = [
      [rec, "first recorded a plan_commit"],
      [(frontmatterField(t, "status") ?? "").toLowerCase() === "active", "first had status: active"],
      [taskIds(section(t, "Members")).size > 0, "first listed a member"],
    ];
    for (const [hit, why] of sigs) if (hit && !seen.has(why)) (seen.add(why), starts.push({ c: h, why }));
  }
  if (!recorded) {
    bad("PLAN-COMMIT-UNRECORDED", `no commit of ${sprintRel} records a plan_commit -- the freeze point is not in history`);
    return;
  }
  if (sprintNo !== null) {
    const stampRe = `^sprint:.*${sprintNo}`;
    for (const c of git(root, ["log", "--reverse", "--format=%H", "-G", stampRe, "--", WORK]).split("\n").filter(Boolean)) {
      const t = commitTree(root, c);
      if (t.paths.some((p) => sprintNumber(frontmatterField(t.read(p) ?? "", "sprint")) === sprintNo)) {
        starts.push({ c, why: "first stamped a member" });
        break;
      }
    }
  }
  const late = starts.find((st) => !gitOk(root, ["merge-base", "--is-ancestor", pc, st.c]));
  if (late) {
    bad("PLAN-COMMIT-LATE", `plan_commit ${planCommit} is later than ${late.c.slice(0, 7)}, the commit that ${late.why} -- moved forward`);
    return;
  }
  ok("freeze point", `plan_commit ${planCommit} holds the Plan, is an ancestor of HEAD and precedes every sign the sprint had started`);

  // --- the Execution Log: logs/<file> plus any inline ## Execution Log -----------------------------
  // The log is append-only ("never edit a past entry"), so what is new since a baseline is the SUFFIX
  // appended after the baseline's text -- never an old entry reworded, nor a paragraph tucked under one
  // (round 2, minor 1). A source whose baseline text is no longer a prefix was rewritten: LOG-REWRITTEN,
  // and none of its entries count.
  const liveSources: [string, string][] = [
    ["logs/ file", existsSync(join(root, logRel)) ? readFileSync(join(root, logRel), "utf8") : ""],
    ["inline ## Execution Log", section(sprintText, "Execution Log") ?? ""],
  ];
  const rewritten = new Set<string>();
  const newSince = new Map<string, string[]>();
  const scopedSince = (base: string): string[] => {
    if (!newSince.has(base)) {
      const baseSources = [showAt(base, "log"), section(showAt(base, "sprint"), "Execution Log") ?? ""];
      const fresh: string[] = [];
      liveSources.forEach(([label, live], i) => {
        // frontmatter is metadata (`last_updated` is bumped on every append), not a past entry
        const before = body(baseSources[i]!).trimEnd();
        const now = body(live);
        if (now.startsWith(before)) fresh.push(...scopeChangeEntries(now, before.length));
        else if (!rewritten.has(`${label}@${base}`)) {
          rewritten.add(`${label}@${base}`);
          bad("LOG-REWRITTEN", `the ${label} as of ${base.slice(0, 7)} is no longer a prefix of today's -- a past entry was edited; its entries are not counted`);
        }
      });
      newSince.set(base, fresh);
    }
    return newSince.get(base)!;
  };

  // `Tn` -> the TASK ids its frozen Plan block Cites, so an entry naming `T1` names T1's members.
  const frozenSprint = showAt(pc, "sprint");
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
      // a `Tn` counts only in the heading: in a body it is as often sequencing prose as a subject
      (e) => idRe(id).test(e) || [...e.split("\n")[0]!.matchAll(/\b(T\d+)(?![0-9])/g)].some((t) => tCites.get(t[1]!)?.has(id) ?? false),
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
        listed = taskIds(section(showAt(c, "sprint"), "Members")).has(id);
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
