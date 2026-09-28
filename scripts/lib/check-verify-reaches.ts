// scripts/lib/check-verify-reaches.ts -- a mechanical `*Verify:*` clause must name a method that
// EXISTS and that REACHES the target the criterion claims (SPRINT-082 T3; ported to TS and retargeted
// onto member files at SPRINT-109 T4, TASK-387, replacing scripts/lib/check-verify-reaches.sh).
//
// WHY THIS EXISTS. §9 already requires a ticked criterion to name how it was verified (S9.VERIFYCLAUSE),
// and that check passes on a clause naming a method which cannot examine its own subject. L-136's fourth
// sighting is the worked example: SPRINT-081 T1 froze
//
//   "Verify: sh scripts/lib/check-doc-caps.sh still PASSes each"   -- for three docs/qa/ files
//
// but that checker derives its caps from §2's table and §2 states no cap for `docs/qa/`, so it could
// neither pass nor fail them. It ran `66 PASS, 0 FAIL` and said nothing whatever about its named
// subject. The criterion was UNREACHABLE, not failed -- and unreachable reads exactly like satisfied.
// Statically visible the whole time: `grep -c docs/qa scripts/lib/check-doc-caps.sh` is 0.
//
// WHY A TS PORT, AND WHY NOW (TASK-387). A v2 sprint's `### Tn` Plan blocks carry NO `*Verify:*`
// clauses at all -- `**Acceptance:**` prose replaces the old inline DoD list, and the actual
// criteria (with whatever Verify: clause they name) live in each member task file's own
// `## Done when` (docs/work/, ADR-047). The .sh version only ever read the sprint file's own text, so
// on a v2 sprint it silently examined zero clauses and reported nothing wrong -- a vacuous PASS of
// exactly the kind L-136 exists to catch, one level up. This file reads BOTH: the sprint file's own
// Plan text (legacy, v1 -- unchanged semantics) AND every current member's `## Done when` section
// (TASK-382's `resolveMembers`), and reports a NAMED, NON-ZERO-DENOMINATOR line either way (owner
// ruling B) -- "0 mechanical clauses" is reported, never silently skipped, because zero real clauses
// and zero EXAMINED clauses must never look the same (L-156).
//
// --- what this checks, and what it deliberately does not ------------------------------------------
// G2's test has four questions -- EXISTS · RUNS · REACHES · PROVES (orchestrator/SKILL.md § G2). Two of
// them are mechanical and are what this file does:
//
//   EXISTS   -- the named script is present in the repo.        -> verify-method-absent
//               (present, but only findable by basename          -> verify-method-unresolvable
//               against the known roots, is a DIFFERENT claim
//               from confirmed absent -- TD-097.)
//   REACHES  -- the named script textually references the       -> verify-does-not-reach-target
//               target path the criterion claims, as code, at
//               a path boundary, outside an exclusion (TD-087).
//
// RUNS and PROVES stay human questions at G2 and are NOT claimed here.
//
// --- the deliberate limits, carried over from the .sh version verbatim ----------------------------
// * Static text match, segment-boundary aware (TD-087), including the `$VAR/literal/path` idiom
//   (SPRINT-100 T1). A target named only through a variable holding the whole path, or through a
//   sourced helper, still reads as not-reaching -- the safe direction (asks a human, never certifies).
// * A target must contain `/` to be recognised (a bare filename is too ambiguous to key on).
// * Only `*Verify: ...*` clauses are read. A clause naming no script is a judgment method -- reported,
//   never failed.
// * A bare-basename method resolves against the current directory first, then `scripts/`,
//   `scripts/lib/`, `evals/`, in that fixed order -- exactly the .sh version's own order, and,
//   exactly as before, resolved relative to the PROCESS's own working directory (root), never to the
//   sprint/member file's own directory -- a script path in a Verify: clause is always written
//   relative to the repo root it is meant to be run from.
// * Exclusion-idiom detection (`lf_is_exclusion_line`) is the SAME closed set of shapes as the .sh
//   version -- `grep -v`, a `case … ) continue` arm, `--exclude` / `-not` / `! -path` / `! -name`.
// * A token that is itself one of this clause's OTHER named scripts is never treated as a target.
//
// --- what is NEW here, beyond the port (TASK-387, owner ruling B) ---------------------------------
// * Member resolution uses its OWN root, distinct from the script-resolution root above: it is
//   derived from the sprint file's own path (the ancestor directory whose child is `docs/sprint`),
//   never from the process's CWD. This is deliberate and is what lets a self-contained fixture
//   (its own `docs/sprint/` + `docs/work/` under one directory) exercise member resolution without
//   touching this repo's real docs/work/ store, which this task's Hard rules forbid creating or
//   editing. For the REAL sprint doc, invoked the way qa-check.sh already does (CWD = repo root),
//   the two roots are the SAME directory, so this split changes nothing about the real run.
// * A v2 sprint (one with `## Members`) always reports a NAMED, member-aware line (a NOTE, never
//   silence) -- see checkSprintFile's summary construction below. A v1 sprint (no `## Members`
//   section at all) emits NOTHING new: the two are the same directory tree with zero current members,
//   and byte-identical output to the .sh version is the regression proof (16/16 cases, before/after).
// * `## Members` naming ids that resolve to ZERO member files is its own FAIL
//   (`verify-member-resolution-empty`), naming the sprint file -- distinct from the EXISTS/REACHES
//   findings above, because the population itself (which files this run even looked at) is the thing
//   L-186 says nothing else here can see.
//
// Usage: bun scripts/lib/check-verify-reaches.ts <sprint.md> [<sprint.md> ...]
// Archived sprints are skipped by path (docs/sprint/archive/) -- closed history is not re-litigated.
// Prints one PASS/FAIL/NOTE line per file examined; exits 1 if any FAIL line was printed.

import { existsSync, readFileSync, statSync } from "node:fs";
import { join, resolve, sep } from "node:path";
import { resolveMembers, section, taskIds } from "./sprint-members.ts";

// --- the shared archive predicate, reimplemented (this file may not edit archive-path.sh, and a new
// .sh file is not admissible -- ADR verbatim carryover of scripts/lib/archive-path.sh's own logic,
// literal-spelling check first, filesystem-identity fallback second, same as every .sh sibling). -----
export function isArchivedPath(path: string): boolean {
  const norm = path.replace(/\\/g, "/");
  if (norm.includes("/archive/")) return true;
  try {
    let d = norm;
    while (d.includes("/")) {
      const parent = d.slice(0, d.lastIndexOf("/"));
      if (!parent) break;
      const archiveSibling = `${parent}/archive`;
      if (existsSync(d) && existsSync(archiveSibling)) {
        const sd = statSync(d);
        const sa = statSync(archiveSibling);
        if (sd.dev === sa.dev && sd.ino === sa.ino) return true;
      }
      d = parent;
    }
  } catch {
    /* best-effort only, exactly like the sh version's `test -ef` probe -- never throws */
  }
  return false;
}

// --- ported verbatim: token-boundary path matching (TD-087, SPRINT-100 T1) -------------------------

/** True if `line` contains `tgtCore` as a contiguous run of whole "/"-separated path segments,
 * anywhere inside a longer path-like token -- not merely as a character substring. `tgtCore` must
 * already have its trailing "/" stripped. */
export function lineTouches(line: string, tgtCore: string): boolean {
  const tokens = line.split(/[^A-Za-z0-9_./-]+/).filter(Boolean);
  const needle = `/${tgtCore}/`;
  for (const tok of tokens) {
    const stripped = tok.endsWith("/") ? tok.slice(0, -1) : tok;
    if (`/${stripped}/`.includes(needle)) return true;
  }
  return false;
}

/** True if `line`'s own structure PRUNES whatever path it mentions rather than examining it -- the
 * SAME closed set of shapes as the .sh version's `lf_is_exclusion_line` (TD-087). */
export function isExclusionLine(line: string): boolean {
  if (
    line.includes("grep -v") ||
    line.includes("grep -qv") ||
    line.includes("grep -vq") ||
    line.includes("--invert-match")
  ) {
    return true;
  }
  if (/\)[\s\S]*continue/.test(line)) return true;
  if (line.includes("--exclude") || line.includes(" -not ") || line.includes("! -path") || line.includes("! -name")) {
    return true;
  }
  return false;
}

/** Bare-basename resolution order: CWD-relative (here, `root`-relative) first, then the known script
 * roots, in this fixed order (TD-097). A fully-qualified path (containing "/") is exact-path-only. */
function resolveScript(root: string, scr: string): string | null {
  if (scr.includes("/")) {
    return existsSync(join(root, scr)) ? scr : null;
  }
  if (existsSync(join(root, scr))) return scr;
  for (const r of ["scripts", "scripts/lib", "evals"]) {
    const cand = `${r}/${scr}`;
    if (existsSync(join(root, cand))) return cand;
  }
  return null;
}

function extractClause(line: string): string | null {
  const m = /\*Verify:([^*]*)\*/.exec(line);
  return m ? m[1]! : null;
}

function clauseScripts(clause: string): string[] {
  const toks = clause.replace(/`/g, "").split(/\s+/).filter(Boolean);
  return [...new Set(toks.filter((t) => /^[A-Za-z0-9_./-]+\.sh$/.test(t)))];
}

/** Path-like tokens anywhere on the WHOLE line (not just the clause), minus the clause's own named
 * scripts (TD-087's two-method limit) -- a `/` is required (see the limits note above). */
function lineTargets(line: string, scripts: readonly string[]): string[] {
  const toks = line
    .replace(/[`*]/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .map((t) => t.replace(/[,.;:)]+$/, ""));
  const targets = [...new Set(toks.filter((t) => /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_./-]*$/.test(t)))];
  return targets.filter((t) => !scripts.includes(t));
}

export interface ClauseCheckResult {
  readonly findings: readonly string[]; // each already prefixed with its named finding kind
  readonly checked: number;
  readonly judgment: number;
}

/** One `*Verify: ...*` line, checked EXISTS + REACHES against `root` -- `sourceLabel` is the file the
 * finding is charged to (the sprint file, or a member's own path), never the process's cwd. */
export function checkClauseLine(root: string, sourceLabel: string, line: string): ClauseCheckResult {
  const clause = extractClause(line);
  if (clause === null) return { findings: [], checked: 0, judgment: 0 };
  const scripts = clauseScripts(clause);
  if (scripts.length === 0) return { findings: [], checked: 0, judgment: 1 };

  const targets = lineTargets(line, scripts);
  const findings: string[] = [];
  let checked = 0;

  for (const scr of scripts) {
    const resolved = resolveScript(root, scr);
    if (resolved === null) {
      if (scr.includes("/")) {
        findings.push(
          `verify-method-absent: ${sourceLabel} -- a Verify: clause names \`${scr}\`, which does not exist in this repository. A criterion whose method is absent is a claim with nothing behind it`,
        );
      } else {
        findings.push(
          `verify-method-unresolvable: ${sourceLabel} -- a Verify: clause names \`${scr}\` by basename, and it resolves against neither the current directory nor the known script roots (scripts/, scripts/lib/, evals/). A criterion whose method cannot be located this way is not confirmed absent, only unresolved -- qualify the path, or confirm by hand whether the script still exists`,
        );
      }
      continue;
    }

    let content = "";
    try {
      content = readFileSync(join(root, resolved), "utf8");
    } catch {
      content = "";
    }
    // Comments stripped before matching -- a script's prose can NAME a path its code never touches
    // (L-108), which is exactly the gap this check exists to find.
    const codeLines = content.split(/\r?\n/).filter((l) => !/^\s*#/.test(l));

    for (const tgt of targets) {
      const tgtCore = tgt.replace(/\/+$/, "");
      if (lineTouches(resolved, tgtCore)) {
        checked++; // the resolved path itself already names the target as a segment.
        continue;
      }
      let reached = false;
      for (const cline of codeLines) {
        if (cline.trim() === "") continue;
        if (!lineTouches(cline, tgtCore)) continue;
        if (isExclusionLine(cline)) continue;
        reached = true;
        break;
      }
      if (reached) {
        checked++;
      } else {
        findings.push(
          `verify-does-not-reach-target: ${sourceLabel} -- the criterion claims \`${tgt}\` but \`${resolved}\` never references it as code, at a path boundary, outside an exclusion, so running it proves nothing about that target. Unreachable reads exactly like satisfied (L-136); either name a method whose scope covers it, or state the criterion as a judgment tick`,
        );
      }
    }
  }
  return { findings, checked, judgment: 0 };
}

function checkClauseLines(root: string, sourceLabel: string, lines: readonly string[]): ClauseCheckResult {
  let checked = 0;
  let judgment = 0;
  const findings: string[] = [];
  for (const line of lines) {
    const r = checkClauseLine(root, sourceLabel, line);
    checked += r.checked;
    judgment += r.judgment;
    findings.push(...r.findings);
  }
  return { findings, checked, judgment };
}

/** The ancestor directory whose child is `docs/sprint` -- the member-resolution root (see the file
 * header's "what is NEW" note). Falls back to `process.cwd()` for a path this convention doesn't
 * match, which never arises for a real caller (every sprint file lives under `docs/sprint/`). */
export function memberRootFor(sprintFile: string): string {
  const abs = resolve(sprintFile);
  const segs = abs.split(/[\\/]+/);
  for (let i = segs.length - 1; i > 0; i--) {
    if (segs[i] === "sprint" && segs[i - 1] === "docs") {
      const rootSegs = segs.slice(0, i - 1);
      return rootSegs.length > 0 ? rootSegs.join(sep) : sep;
    }
  }
  return process.cwd();
}

export interface FileCheckOutcome {
  readonly lines: readonly string[]; // PASS/FAIL/NOTE lines, in print order
  readonly fail: boolean;
}

/** The whole per-input-file check: legacy sprint-text clauses, then member `## Done when` clauses
 * (TASK-387). `scriptRoot` is where Verify: clause METHODS resolve (process.cwd() for a real run);
 * member resolution always uses `memberRootFor(sp)`, independent of `scriptRoot` (see file header). */
export function checkSprintFile(scriptRoot: string, sp: string): FileCheckOutcome {
  if (!existsSync(sp)) {
    return { lines: [`FAIL  verify reaches: file not found: ${sp}`], fail: true };
  }
  if (isArchivedPath(sp)) return { lines: [], fail: false };

  const content = readFileSync(sp, "utf8");
  const out: string[] = [];
  let fail = false;

  // --- legacy: the sprint file's own Plan text (v1; byte-identical to the .sh version) -----------
  const legacyLines = content.split(/\r?\n/).filter((l) => l.includes("*Verify:"));
  if (legacyLines.length === 0) {
    out.push(`      verify reaches: ${sp} has no mechanical Verify: clause -- nothing to verify`);
  } else {
    const r = checkClauseLines(scriptRoot, sp, legacyLines);
    if (r.findings.length === 0) {
      out.push(`PASS  verify reaches ${sp} (${r.checked} claimed target(s) confirmed reachable, ${r.judgment} judgment-method clause(s) left to G2)`);
    } else {
      fail = true;
      for (const f of r.findings) out.push(`FAIL  ${f}`);
    }
  }

  // --- member files (TASK-387, owner ruling A+B) --------------------------------------------------
  const memberRoot = memberRootFor(sp);
  const listedIds = taskIds(section(content, "Members"));
  const members = resolveMembers(memberRoot, sp);

  if (listedIds.size > 0 && members.length === 0) {
    fail = true;
    out.push(
      `FAIL  verify-member-resolution-empty: ${sp} -- ## Members lists ${listedIds.size} id(s) but member resolution found 0 -- ${[...listedIds].sort().join(", ")}`,
    );
  }

  if (members.length > 0) {
    let totalClauses = 0;
    let mechanicalClauses = 0;
    for (const m of members) {
      let memberContent: string;
      try {
        memberContent = readFileSync(join(memberRoot, m.path), "utf8");
      } catch {
        continue;
      }
      const doneWhen = section(memberContent, "Done when") ?? "";
      const memberLines = doneWhen.split(/\r?\n/).filter((l) => l.includes("*Verify:"));
      if (memberLines.length === 0) continue;
      totalClauses += memberLines.length;
      mechanicalClauses += memberLines.filter((l) => {
        const c = extractClause(l);
        return c !== null && clauseScripts(c).length > 0;
      }).length;

      const r = checkClauseLines(scriptRoot, m.path, memberLines);
      if (r.findings.length === 0) {
        out.push(
          `PASS  verify reaches ${m.path} (${r.checked} claimed target(s) confirmed reachable, ${r.judgment} judgment-method clause(s) left to G2)`,
        );
      } else {
        fail = true;
        for (const f of r.findings) out.push(`FAIL  ${f}`);
      }
    }

    // Owner ruling B: a v2 sprint ALWAYS says it examined its members, member count and mechanical-
    // clause count named, never silence -- zero clauses is legitimate (judgment ticks), not a FAIL.
    const tail = mechanicalClauses === 0 ? ": every criterion is a judgment tick" : "";
    out.push(
      `NOTE  verify-reaches: ${sp} -- ${members.length} member(s), ${mechanicalClauses} mechanical Verify: clause(s)${tail}`,
    );
    void totalClauses; // reported implicitly via the per-member PASS/FAIL lines above when non-zero
  }

  return { lines: out, fail };
}

if (import.meta.main) {
  const files = process.argv.slice(2);
  const root = process.cwd();

  if (files.length === 0) {
    console.log("      verify reaches: no sprint files given -- nothing verified");
    process.exit(0);
  }

  let anyFail = false;
  for (const sp of files) {
    const outcome = checkSprintFile(root, sp);
    for (const line of outcome.lines) console.log(line);
    if (outcome.fail) anyFail = true;
  }
  process.exit(anyFail ? 1 : 0);
}
