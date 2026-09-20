// scripts/lib/check-layers-observed.ts -- SPRINT-103 T2: a faithful, fork-free TypeScript port of
// scripts/lib/check-layers-observed.sh, run by Bun.
//
// WHY THIS EXISTS. docs/research/logs/qa-gate-timing.md Round 20: evals/run-layers-observed-
// fixtures.sh runs 185.7/182.9s wall, 59% sys CPU, roughly a third of wall spent blocked on
// subprocesses/filesystem rather than computing anything -- this checker is 11.1-12.2s for ONE real
// sprint file, with 10 git calls inside 8 loops (attribute()/commit_sprint() invoked per commit,
// task_decls()/layers_tokens() invoked per line, each backed by a real awk/sed/grep/tr fork). Ruled
// spawn-shaped and portable.
//
// scripts/lib/check-layers-observed.sh REMAINS THE ORACLE (D5) and is RETAINED, unmodified. This
// file is the migrated implementation being checked AGAINST it, never the other way -- see
// evals/run-layers-observed-differential.ts for the row-by-row proof this port agrees with the
// oracle. Any divergence is a defect in THIS file; the fix is here, never a "cleanup" of the shell.
//
// PORTING PRINCIPLE, stated once: every `git` invocation below is a 1:1 copy of the oracle's own git
// command line (same subcommand, same flags, same argument shape) -- git itself is not a spawn this
// port tries to eliminate, because its output is exactly what the port must reproduce and a
// "smarter" combined git call is exactly the kind of improve-on-the-oracle risk this task forbids
// for a Tier G guard. What this port DOES eliminate is the ~30 non-git forks per sprint file the
// oracle pays for text processing (awk/sed/grep/tr/case, once per line, once per task, once per
// commit-file) by doing that processing natively in TypeScript. The one exception, matching
// scripts/lib/check-layers-completeness.ts's own precedent, is a single spawned `sort -u` for the
// WIP file list (see computeSortedUniqueWip below) -- kept as a real spawn rather than a JS `.sort()`
// because the oracle's `sort -u` is locale-collated, not byte-order, and reproducing glibc/ICU
// collation by hand is the same forbidden "improve on the oracle" move one level down.
//
// CRLF handling matches check-layers-completeness.ts's own established convention for this repo: on
// this host, awk/grep/sed all silently drop \r from CRLF input (every sprint file in this repo is
// CRLF, core.autocrlf=true). Every file read below is normalized (\r\n -> \n) at the read site so
// downstream regexes can assume LF-only text, exactly like the oracle's.
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { posix } from "node:path";

// --- archive-path.sh port (SPRINT-099 T3, TD-145 * TD-151), identical logic to the copy in
// check-layers-completeness.ts -- both are independent, byte-identical ports of the SAME shell
// predicate (scripts/lib/archive-path.sh's lf_is_archived_path()), matching the shell world's own
// direction (check-layers-completeness.sh sources check-layers-observed.sh, not the reverse), so
// this file carries the canonical TS copy rather than importing across the pair. ------------------
function sameDirIdentity(a: string, b: string): boolean {
  try {
    const sa = statSync(a);
    const sb = statSync(b);
    return sa.dev === sb.dev && sa.ino === sb.ino;
  } catch {
    return false;
  }
}

function isDir(p: string): boolean {
  try {
    return statSync(p).isDirectory();
  } catch {
    return false;
  }
}

export function isArchivedPath(p: string): boolean {
  if (!p) return false;
  if (/\/archive\//.test(p)) return true;
  let d = p;
  for (;;) {
    const idx = d.lastIndexOf("/");
    if (idx === -1) break;
    const parent = d.slice(0, idx);
    if (!parent) break;
    if (isDir(d) && isDir(parent + "/archive") && sameDirIdentity(d, parent + "/archive")) {
      return true;
    }
    d = parent;
  }
  return false;
}

function readNormalized(path: string): string {
  return readFileSync(path, "utf8").replace(/\r\n/g, "\n");
}

// --- fmv() port: `awk -v k="$2" 'NR==1&&$0!="---"{exit} NR==1{next} $0=="---"{exit}
//     $0~"^"k":"{sub("^"k":[ ]*","");print;exit}' "$1"` -- the frontmatter-value extractor. Operates
// on already \r-stripped lines, matching this host's awk behaviour on the oracle's CRLF input. -----
export function fmv(lines: readonly string[], key: string): string {
  if (lines.length === 0 || lines[0] !== "---") return "";
  const re = new RegExp("^" + key + ":");
  const stripRe = new RegExp("^" + key + ":[ ]*");
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]!;
    if (line === "---") return "";
    if (re.test(line)) return line.replace(stripRe, "");
  }
  return "";
}

/** `awk '/^## Plan/{f=1;next} /^## /{f=0} f'` -- the "## Plan" section's body, header lines excluded.
 *  Ported identically to check-layers-completeness.ts's own extractPlanLines (same oracle rule). */
export function extractPlanLines(content: string): string[] {
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  let f = false;
  const out: string[] = [];
  for (const line of lines) {
    if (/^## Plan/.test(line)) {
      f = true;
      continue;
    }
    if (/^## /.test(line)) {
      f = false;
      continue;
    }
    if (f) out.push(line);
  }
  return out;
}

/** layers_tokens(): every backtick-delimited span, backticks stripped, extracted PER LINE -- the
 *  oracle's `grep -oE` processes line by line (POSIX grep never matches across a newline), so a
 *  multi-line input here must not let `[^\`]` in a JS regex silently span lines the oracle's grep
 *  never would. Safe for both a single already-isolated line (task_decls' per-line "rest" values)
 *  and a multi-line joined block (the plan-level Layers: union) -- both call sites in this file. */
export function layersTokensMultiline(text: string): string[] {
  const out: string[] = [];
  for (const line of text.split("\n")) {
    const matches = line.match(/`[^`]+`/g) ?? [];
    for (const m of matches) out.push(m.slice(1, -1));
  }
  return out;
}

/** extractLayersLines(): the PLAN-LEVEL (all tasks combined) Layers: declaration lines, ported from:
 *  `awk '/^Layers:/{inl=1;print;next} inl && /^[ \t]+[^ \t]/{print;next} {inl=0}'`. Used only to
 *  build the all-task union (layersAll) consumed by the WIP/uncommitted leg. */
export function extractLayersLines(planLines: readonly string[]): string[] {
  const out: string[] = [];
  let inl = false;
  for (const line of planLines) {
    if (/^Layers:/.test(line)) {
      inl = true;
      out.push(line);
      continue;
    }
    if (inl && /^[ \t]+[^ \t]/.test(line)) {
      out.push(line);
      continue;
    }
    inl = false;
  }
  return out;
}

export interface TaskDecl {
  task: string; // "T<n>" -- NOT prefixed with "### ", matching task_decls()'s own `cur` capture
  token: string;
}

/** task_decls(): per-task declared Layers: tokens, one {task, token} pair per backtick-quoted token,
 *  ported from the awk + while-read pipeline described in the oracle's own comment above it. */
export function taskDecls(planLines: readonly string[]): TaskDecl[] {
  const out: TaskDecl[] = [];
  let cur = "";
  let inl = false;
  for (const line of planLines) {
    if (/^### T[0-9]+/.test(line)) {
      const m = /T[0-9]+/.exec(line);
      cur = m ? m[0] : "";
      inl = false;
      continue;
    }
    if (/^Layers:/.test(line)) {
      inl = true;
      const rest = line.replace(/^Layers:[ \t]*/, "");
      for (const tok of layersTokensMultiline(rest)) out.push({ task: cur, token: tok });
      continue;
    }
    if (inl && /^[ \t]+[^ \t]/.test(line)) {
      const rest = line.replace(/^[ \t]+/, "");
      for (const tok of layersTokensMultiline(rest)) out.push({ task: cur, token: tok });
      continue;
    }
    inl = false;
  }
  return out;
}

/** covers(): <space-separated declared tokens>, <path> -- ported literally, INCLUDING the shell's
 *  own word-splitting quirk: the exact-match arm treats `tokensStr` as one blob (substring test
 *  bounded by injected spaces, exactly like `case " $_toks " in *" $_f "*)`), while the
 *  directory-prefix arm iterates `tokensStr` the way an UNQUOTED `for _t in $_toks` would -- default
 *  IFS word-splitting on runs of whitespace, which SPLITS a token containing an internal space into
 *  multiple words. This is not "improved" here: a declared directory token with a literal space is
 *  faithfully broken apart for the prefix test, exactly as the oracle breaks it. */
export function covers(tokensStr: string, f: string): boolean {
  if ((" " + tokensStr + " ").includes(" " + f + " ")) return true;
  for (const t of tokensStr.split(/\s+/).filter(Boolean)) {
    if (t.endsWith("/") && f.startsWith(t)) return true;
  }
  return false;
}

// --- commit_sprint(): which sprint a commit belongs to, read from its subject only ----------------
export function commitSprint(subject: string): string {
  let m = /^sprint\(([0-9]+)\)/.exec(subject);
  if (m) return m[1]!;
  m = /^merge\(([0-9]+)\)/.exec(subject);
  return m ? m[1]! : "";
}

// --- is_governance_commit(): every changed file in the commit is a governance artifact -----------
export function isGovernanceCommit(files: readonly string[]): boolean {
  if (files.length === 0) return false; // an empty commit is NOT governance (oracle: `_any` stays 0)
  for (const f of files) {
    if (f === "TODO.md" || f === "TECH-DEBT.md" || f === "CHANGELOG.md" || f === "docs/LEARNINGS.md") continue;
    if (f === "docs/knowledge-index.md") continue;
    if (f.startsWith("docs/epic/") || f.startsWith("docs/research/")) continue;
    // ADDED SPRINT-103 (TD-170), mirroring the oracle. docs/sprint/ is already unreportable via
    // isExcludedCommitted() below, but omitting it here let it DISQUALIFY the whole commit ->
    // UNATTRIBUTED -> its governance sibling named instead. Appending to the sprint Execution Log
    // is mandatory per task, so the disqualifying shape is routine bookkeeping. 5 of 22 in-range
    // commits on SPRINT-103. A file that cannot be reported should not be able to disqualify.
    if (f.startsWith("docs/sprint/")) continue;
    return false;
  }
  return true;
}

// --- attribute(): <sha's subject, trailer-Task value, governance-check thunk> -> "T<n>" | "COORD" |
// "GOVERNANCE" | "UNATTRIBUTED" -- ported rule-for-rule, same priority order as the oracle's own
// numbered comment (Task: trailer, then subject forms, in order, then COORD, then GOVERNANCE, then
// UNATTRIBUTED). The governance check is a thunk so it is evaluated lazily, exactly as the shell's
// short-circuiting `&&` chain only calls is_governance_commit() when nothing earlier resolved. -----
export function attribute(subject: string, trailerTask: string, isGovernance: () => boolean): string {
  if (/^T[0-9]/.test(trailerTask)) return trailerTask;

  let m = /^sprint\([0-9]+\) +(T[0-9]+):/.exec(subject);
  if (m) return m[1]!;
  m = /^merge\([^)]*\): *(T[0-9]+)[^0-9]/.exec(subject);
  if (m) return m[1]!;
  // Rule 4, trailing parenthetical. The LEADING `.*` is load-bearing and mirrors the oracle's
  // `s/.*(SPRINT-[0-9]\{1,\}[ ]\{1,\}\(T[0-9]\{1,\}\)).*/\1/p`: POSIX leftmost-longest makes that
  // greedy prefix select the LAST parenthetical in the subject, and JS `.*` is greedy for the same
  // reason. Without it, `.exec()` returns the FIRST -- which is what this line did until an outside
  // reviewer found it. On `...(SPRINT-100 T1) and again (SPRINT-101 T2)` the oracle yields T2 and
  // first-match yields T1, a false-positive FAIL on a squash/merge commit citing two tasks. No
  // fixture reached it because no subject in this repo's history, and none in the differential's
  // population, carried TWO citations -- first- and last-match agree on every single-citation
  // input (L-186: the gap was an axis nobody had enumerated, not a branch anyone had skipped).
  m = /.*\(SPRINT-[0-9]+ +(T[0-9]+)\)/.exec(subject);
  if (m) return m[1]!;

  // Rule 2's qualifier widening (SPRINT-093 T7): `sprint(NN) T<n> <qualifier>: ...` where <qualifier>
  // is a space-then-letter-led run of [A-Za-z0-9 ] with NO embedded `T<digit>`.
  const qm = /^sprint\([0-9]+\) +(T[0-9]+) +([A-Za-z][A-Za-z0-9 ]*):/.exec(subject);
  if (qm) {
    const qualifier = qm[2]!;
    if (!/T[0-9]/.test(qualifier)) return qm[1]!;
  }

  if (/^sprint\([0-9]+\):/.test(subject)) return "COORD";
  if (isGovernance()) return "GOVERNANCE";
  return "UNATTRIBUTED";
}

// --- structural exclusions, ported verbatim ---------------------------------------------------
export function isExcludedCommitted(f: string): boolean {
  if (f.startsWith("docs/sprint/")) return true;
  if (f === "docs/knowledge-index.md") return true;
  if (f.startsWith(".claude/worktrees/agent-")) return true;
  return false;
}

export function isExcludedCloseTime(f: string): boolean {
  if (f === "TECH-DEBT.md") return true;
  if (f === "TODO.md") return true;
  if (f === "CHANGELOG.md") return true;
  if (f.startsWith("docs/changelog/")) return true;
  if (f === "docs/LEARNINGS.md") return true;
  if (f === "README.md") return true;
  return false;
}

export function isExcluded(f: string, atClose: boolean): boolean {
  if (atClose && isExcludedCloseTime(f)) return true;
  if (f.startsWith("docs/sprint/")) return true;
  if (f === ".claude/settings.json" || f === ".claude/settings.local.json") return true;
  if (f === "docs/knowledge-index.md") return true;
  if (f === ".claude-plugin/plugin.json") return true;
  if (f === ".claude-plugin/marketplace.json") return true;
  if (f === ".codex-plugin/plugin.json") return true;
  if (f === ".kimi-plugin/plugin.json") return true;
  if (f.startsWith(".claude/worktrees/agent-")) return true;
  return false;
}

// --- git plumbing: one function per oracle git invocation, same subcommand/flags/argument shape ---
function gitRun(args: readonly string[]): { code: number; stdout: string } {
  try {
    const stdout = execFileSync("git", args as string[], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
    return { code: 0, stdout };
  } catch (e) {
    const err = e as { status: number | null; stdout?: string };
    return { code: err.status ?? 1, stdout: err.stdout ?? "" };
  }
}

function gitRevParseVerifiesCommit(ref: string): boolean {
  return gitRun(["rev-parse", "--verify", "-q", `${ref}^{commit}`]).code === 0;
}

function gitRevList(range: string): string[] {
  const r = gitRun(["rev-list", range]);
  return r.code === 0 ? r.stdout.split("\n").filter(Boolean) : [];
}

function gitLogSubject(sha: string): string {
  const r = gitRun(["log", "-1", "--format=%s", sha]);
  return r.code === 0 ? r.stdout.replace(/\n$/, "") : "";
}

function gitLogTrailerTask(sha: string): string {
  const r = gitRun(["log", "-1", "--format=%(trailers:key=Task,valueonly)", sha]);
  return r.code === 0 ? r.stdout.replace(/[ \r\n]/g, "") : "";
}

function gitDiffTreeNameOnly(sha: string): string[] {
  const r = gitRun(["diff-tree", "--no-commit-id", "--name-only", "-r", sha]);
  return r.code === 0 ? r.stdout.split("\n").filter(Boolean) : [];
}

function gitRevParseShort(sha: string): string {
  const r = gitRun(["rev-parse", "--short", sha]);
  return r.code === 0 ? r.stdout.trim() : sha;
}

function gitDiffNameOnlyHead(): string[] {
  const r = gitRun(["diff", "--name-only", "HEAD", "--", "."]);
  return r.code === 0 ? r.stdout.split("\n").filter(Boolean) : [];
}

function gitLsFilesOthers(): string[] {
  const r = gitRun(["ls-files", "--others", "--exclude-standard", "--", "."]);
  return r.code === 0 ? r.stdout.split("\n").filter(Boolean) : [];
}

/** `printf '%s\n%s\n' "$tracked" "$untracked" | grep -v '^$' | sort -u` -- ONE spawned `sort -u` per
 *  checker run (not per sprint file: the working tree does not change mid-run, so tracked/untracked
 *  are computed once and shared), for the same locale-collation-fidelity reason
 *  check-layers-completeness.ts spawns `sort` rather than using `.sort()` (see file header). */
function computeSortedUniqueWip(): string[] {
  const combined = [...gitDiffNameOnlyHead(), ...gitLsFilesOthers()].filter(Boolean);
  if (combined.length === 0) return [];
  const payload = combined.join("\n") + "\n";
  const sorted = execFileSync("sort", ["-u"], { input: payload, encoding: "utf8" });
  return sorted.split("\n").filter(Boolean);
}

// --- top-level run ---------------------------------------------------------------------------
export interface RunResult {
  lines: string[];
  fail: boolean;
}

export function runLayersObserved(args: readonly string[]): RunResult {
  if (args.length === 0) {
    return { lines: ["      layers observed: no sprint files given -- nothing verified"], fail: false };
  }

  const lines: string[] = [];
  let fail = false;
  const ok = (msg: string) => lines.push(`PASS  ${msg}`);
  const bad = (msg: string) => {
    fail = true;
    lines.push(`FAIL  ${msg}`);
  };
  const skip = (msg: string) => lines.push(`SKIP  ${msg}`);
  const note = (msg: string) => lines.push(`      ${msg}`);

  // Computed once per run, not per sprint file (see computeSortedUniqueWip's own comment).
  let wipComputed: string[] | null = null;
  const wip = () => (wipComputed ??= computeSortedUniqueWip());

  for (const sp of args) {
    let isFile = false;
    try {
      isFile = existsSync(sp) && statSync(sp).isFile();
    } catch {
      isFile = false;
    }
    if (!isFile) {
      bad(`layers observed: file not found: ${sp}`);
      continue;
    }
    if (isArchivedPath(sp)) continue; // silent skip, not even a SKIP line -- matches the oracle

    const content = readNormalized(sp);
    const fileLines = content.split("\n");
    const planCommit = fmv(fileLines, "plan_commit");

    if (planCommit === "") {
      bad(`${sp} layers observed: plan_commit not recorded in frontmatter`);
      continue;
    }
    if (planCommit.includes("[")) {
      skip(
        `${sp} layers observed: plan_commit still holds the promote-time placeholder (${planCommit}) -- not recorded yet, skipping until the follow-up commit patches it in (TD-026)`,
      );
      continue;
    }
    if (!gitRevParseVerifiesCommit(planCommit)) {
      bad(`${sp} layers observed: plan_commit '${planCommit}' does not resolve to a commit`);
      continue;
    }

    const planLines = extractPlanLines(content);
    const layersLines = extractLayersLines(planLines);
    const layersAll = layersTokensMultiline(layersLines.join("\n")).join(" ");
    const decls = taskDecls(planLines);
    const declsByTask = new Map<string, string[]>();
    for (const d of decls) {
      const arr = declsByTask.get(d.task);
      if (arr) arr.push(d.token);
      else declsByTask.set(d.task, [d.token]);
    }
    const mySprint = fmv(fileLines, "sprint");

    // ---- sibling scoping (TASK-299, ADR-040) -----------------------------------------------
    const siblingSprints = new Set<string>();
    for (const osp of args) {
      if (osp === sp) continue;
      let oIsFile = false;
      try {
        oIsFile = existsSync(osp) && statSync(osp).isFile();
      } catch {
        oIsFile = false;
      }
      if (!oIsFile) continue;
      if (isArchivedPath(osp)) continue;
      const oLines = readNormalized(osp).split("\n");
      const oSprint = fmv(oLines, "sprint");
      if (oSprint === "" || oSprint === mySprint) continue;
      siblingSprints.add(oSprint);
    }
    const archiveDir = posix.join(posix.dirname(sp.replace(/\\/g, "/")), "archive");
    let archiveEntries: string[] = [];
    try {
      archiveEntries = readdirSync(archiveDir);
    } catch {
      archiveEntries = [];
    }
    for (const name of archiveEntries) {
      if (!(name.startsWith("SPRINT-") && name.endsWith(".md"))) continue;
      const m = /^SPRINT-([0-9][0-9]*)/.exec(name);
      if (!m) continue;
      const an = m[1]!;
      if (an === mySprint) continue;
      siblingSprints.add(an);
    }

    // ---- path 1: COMMITTED changes -- attributed, checked PER TASK ------------------------
    let unattr = "";
    let missAttr = "";
    for (const c of gitRevList(`${planCommit}..HEAD`)) {
      const subject = gitLogSubject(c);
      const cSprint = commitSprint(subject);
      if (cSprint !== "" && siblingSprints.has(cSprint)) continue;

      const files = gitDiffTreeNameOnly(c);
      const trailerTask = gitLogTrailerTask(c);
      const who = attribute(subject, trailerTask, () => isGovernanceCommit(files));
      const shortSha = who === "UNATTRIBUTED" ? gitRevParseShort(c) : "";
      const whoToks = who === "UNATTRIBUTED" || who === "COORD" || who === "GOVERNANCE" ? "" : (declsByTask.get(who) ?? []).join(" ");

      for (const f of files) {
        if (isExcludedCommitted(f)) continue;
        if (who === "COORD" || who === "GOVERNANCE") continue;
        if (who === "UNATTRIBUTED") {
          unattr += ` ${shortSha}:${f}`;
        } else if (!covers(whoToks, f)) {
          missAttr += ` ${who}:${f}`;
        }
      }
    }

    // ---- path 2: UNCOMMITTED work in progress -- unattributable, checked against the union --
    const atClose = planLines.filter((l) => /^- \[ \]/.test(l)).length === 0;
    let miss = "";
    let nWip = 0;
    for (const f of wip()) {
      if (isExcluded(f, atClose)) continue;
      nWip++;
      if (!covers(layersAll, f)) miss += ` ${f}`;
    }

    let hit = false;
    if (unattr !== "") {
      bad(`${sp} layers observed: commit attributable to no task and not coordinator bookkeeping:${unattr}`);
      hit = true;
    }
    if (missAttr !== "") {
      bad(`${sp} layers observed: changed by a task that never declared it:${missAttr}`);
      hit = true;
    }
    if (miss !== "") {
      bad(`${sp} layers observed: changed but undeclared in any task's Layers::${miss}`);
      hit = true;
    }
    if (!hit) {
      if (nWip > 0) {
        skip(
          `${sp} layers observed [WIP, unattributed] -- committed history since ${planCommit} IS attributed per task; ${nWip} uncommitted file(s) are not`,
        );
        note(
          "  the uncommitted files were checked against the ALL-TASK UNION only. Per-task attribution needs a commit, so the committed run applies a stricter rule and may FAIL where this leg does not -- commit, then re-run, before reading this as clear",
        );
        note("  still enforced here: a file declared by NO task is reported from this leg as a FAIL, exactly as before");
      } else {
        ok(`${sp} layers observed (all changed files declared and attributed, base ${planCommit})`);
      }
    }
  }

  return { lines, fail };
}

if (import.meta.main) {
  const result = runLayersObserved(process.argv.slice(2));
  for (const line of result.lines) console.log(line);
  process.exit(result.fail ? 1 : 0);
}
