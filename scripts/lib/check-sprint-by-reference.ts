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
//                     CLOSE-FIRED-UNREAPED   the log's last `fired · ` line has no `terminal · ` line after it (TD-122)
//   both:             MEMBER-MISSING <id>    member absent (or ambiguous) at its baseline or now
//   freeze point:     NO-PLAN-COMMIT · PLAN-COMMIT-NOT-ANCESTOR · PLAN-COMMIT-NO-PLAN ·
//                     PLAN-COMMIT-UNRECORDED · PLAN-COMMIT-LATE
//   guards:           NO-MEMBERS -- a check with nothing to check is not a pass
// Prints one PASS/FAIL line per assertion, then `check-sprint-by-reference: N pass, M fail`.
// Exits 1 if M > 0.

import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, realpathSync } from "node:fs";
import { basename, dirname, join, relative, resolve } from "node:path";
import {
  WORK,
  frontmatterField,
  lf,
  nowTree,
  resolveId,
  scanBlocks,
  section,
  sprintNumber,
  stampedIn,
  stripComments,
  taskIds,
  type Tree,
} from "./sprint-members.ts";

// TASK-382 owner ruling A: `resolveId`, the six-folder walk (`nowTree`), the `sprint:` stamp scan
// (`stampedIn`) and the pure markdown helpers (`frontmatterField`, `section`, `taskIds`,
// `scanBlocks`, `sprintNumber`, `lf`, `stripComments`) moved to scripts/lib/sprint-members.ts --
// this file now imports them rather than holding its own copies. No behaviour change: verified by
// `bun evals/run-by-reference-fixtures.ts` reporting the same verdict line before and after.

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

/** The text after a leading `---` frontmatter block, LF-normalised. */
function body(content: string): string {
  const t = lf(content);
  const m = t.match(/^---[ \t]*\n[\s\S]*?\n---[ \t]*(\n|$)/);
  return m ? t.slice(m[0].length) : t;
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

/**
 * Execution Log entries whose event is `scope-change`. An entry is its `### ` heading plus body, up
 * to the next heading of level 1-3 (never the rest of the file). The heading's second `|` field is
 * the event; the summary field may be absent. Only entries whose heading starts at or after `from`
 * count -- but the WHOLE log is parsed, so a comment or fence opened before `from` still hides what
 * follows it (round 3, finding 1).
 */
function scopeChangeEntries(log: string, from = 0): string[] {
  const entries: string[] = [];
  let cur: string[] | null = null; // RAW lines of the current entry (heading first)
  let at = 0;
  const flush = () => {
    if (cur) entries.push(stripComments(cur.join("\n")).trim()); // A5: excuseText, entry-wide, no code-span exception
  };
  for (const { line, hidden } of scanBlocks(log)) {
    const start = at;
    at += line.length + 1; // raw line length, so `from` (a byte offset into the raw log) still works
    if (!hidden && /^#{1,3} /.test(line)) {
      flush();
      cur = null;
      // the event field reads the line's own stripped text: a commented `| scope-change |` is not
      // an event (finding 1's sibling on the heading side).
      const f = stripComments(line).split("|");
      if (start >= from && /^### /.test(line) && f.length >= 2 && f[1]!.trim().toLowerCase() === "scope-change") cur = [line];
      continue;
    }
    cur?.push(line);
  }
  flush();
  return entries;
}

// SPRINT-118 T1 (TD-122). night-run.sh appends `fired · <ts> · <mode>` at column 1 BEFORE the wrapped
// command runs; reap()'s rollup is the only thing that ends a run. Same `<word> · ` column-1 vocabulary as
// the `terminal · ` line, and the same shape check-authority.ts anchors on.
const FIRED_RE = /^fired · \S+ · \S/;
const TERMINAL_RE = /^terminal · (PLAN_EXHAUSTED|AUTHORITY_BOUNDARY|HARD_FAILURE|BUDGET_STOP|USER_STOP) · /;

/**
 * True when the LAST `fired · ` line (fenced / commented regions hidden) has no `terminal · ` line after
 * it. A fired line quoted in a fence is an example, not a launch.
 *
 * The terminal line needs one carve-out the fired line does not: reap() writes its rollup INSIDE a bare
 * fence (`run · … / terminal · …` between ``` lines, under a `### date | run-complete | …` heading), so
 * stripping fences alone would read every properly reaped run as unreaped. A fenced `terminal · ` line
 * therefore counts only while the current entry's own heading is `run-complete` -- a heading is never
 * hidden by a fence, so a worked example quoted under a `progress` entry still cannot stand in for one.
 */
function firedUnreaped(log: string): boolean {
  let fired = false;
  let reaped = false;
  let inRollup = false;
  for (const { line, hidden } of scanBlocks(log)) {
    if (!hidden && /^#{1,3} /.test(line)) {
      const f = stripComments(line).split("|");
      inRollup = /^### /.test(line) && f.length >= 2 && f[1]!.trim().toLowerCase() === "run-complete";
      continue;
    }
    if (!hidden && FIRED_RE.test(line)) {
      fired = true;
      reaped = false; // only a terminal line AFTER the latest launch answers it
      continue;
    }
    if (fired && TERMINAL_RE.test(line) && (!hidden || inRollup)) reaped = true;
  }
  return fired && !reaped;
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
  const nowInlineSection = section(sprintText, "Execution Log"); // null: heading unrecognisable now too
  const liveSources: [string, string][] = [
    ["logs/ file", existsSync(join(root, logRel)) ? readFileSync(join(root, logRel), "utf8") : ""],
    ["inline ## Execution Log", nowInlineSection ?? ""],
  ];
  const rewritten = new Set<string>();
  const logHeadingChanged = new Set<string>();
  const newSince = new Map<string, string[]>();
  const scopedSince = (base: string): string[] => {
    if (!newSince.has(base)) {
      const baseInlineSection = section(showAt(base, "sprint"), "Execution Log");
      const baseSources = [showAt(base, "log"), baseInlineSection ?? ""];
      const fresh: string[] = [];
      liveSources.forEach(([label, live], i) => {
        // The inline heading is expected to always exist somehow; unrecognisable at the baseline
        // but recognisable now (closed later, renamed, ...) must never silently make every
        // pre-promote entry new -- flag it instead, and count none of that source's entries.
        if (i === 1 && baseInlineSection === null && nowInlineSection !== null) {
          if (!logHeadingChanged.has(base)) {
            logHeadingChanged.add(base);
            bad("LOG-HEADING-CHANGED", `the inline ## Execution Log heading is unrecognisable at ${base.slice(0, 7)} but recognisable now -- its entries are not counted`);
          }
          return;
        }
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
  let curTLines: string[] = [];
  const flushT = () => {
    if (curT) {
      const citesLine = stripComments(curTLines.join("\n"))
        .split("\n")
        .find((l) => /^Cites:/.test(l));
      if (citesLine) tCites.set(curT, taskIds(citesLine));
    }
    curTLines = [];
  };
  for (const { line, hidden } of scanBlocks(section(frozenSprint, "Plan") ?? "")) {
    if (hidden) continue;
    const h = line.match(/^### (T\d+)\b/);
    if (h) {
      flushT();
      curT = h[1]!;
      continue;
    }
    if (/^#{1,3} /.test(line)) {
      flushT();
      curT = null;
      continue;
    }
    if (curT) curTLines.push(line);
  }
  flushT();
  const names = (entries: string[], id: string): boolean =>
    entries.some(
      // a `Tn` counts only in the heading: in a body it is as often sequencing prose as a subject
      (e) => idRe(id).test(e) || [...e.split("\n")[0]!.matchAll(/\b(T\d+)(?![0-9])/g)].some((t) => tCites.get(t[1]!)?.has(id) ?? false),
    );

  // --- population: Members ids ∪ sprint: stamps, at plan_commit and now --------------------------
  // stampedIn/nowTree moved to sprint-members.ts (TASK-382 owner ruling A); sprintNo may be null
  // (an unparseable `sprint:` field), which the shared stampedIn() cannot itself represent -- the
  // null check that guards the call is what stayed here, preserving the original behaviour of
  // contributing an empty set in that case.
  const pcTree = commitTree(root, pc);
  const now = nowTree(root);
  const planned = new Set([...taskIds(section(frozenSprint, "Members")), ...(sprintNo !== null ? stampedIn(pcTree, sprintNo) : new Set<string>())]);
  const current = new Set([...taskIds(section(sprintText, "Members")), ...(sprintNo !== null ? stampedIn(now, sprintNo) : new Set<string>())]);
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
    } else if (base.commit != null && names(scopedSince(base.commit), id)) {
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

  // TD-122: a launch with no rollup after it. Close-only -- a live run legitimately has a fired line and
  // no terminal line yet. Once per sprint, not per member, so it sits outside the member loop.
  if (closeMode) {
    if (firedUnreaped(liveSources[0]![1])) {
      bad(
        "CLOSE-FIRED-UNREAPED",
        "the Execution Log has a `fired · ` line with no `terminal · ` line after it -- a run was launched and never reached the reaper, so its outcome was never recorded (TD-122)",
      );
    } else {
      ok("close fired-line", "no launch is left without a rollup after it");
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
