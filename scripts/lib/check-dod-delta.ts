// scripts/lib/check-dod-delta.ts -- SPRINT-101 T3: a sprint(NNN) commit's claimed DoD delta,
// reconciled against the [ ] -> [x] transitions it actually made in the sprint doc, including the
// case where a commit ticks a DoD item belonging to a task it never claimed (CLAUDE.md Anti-Patterns
// edit-safety; L-009 * L-165 * L-186 * L-195; TASK-326).
//
// MOTIVATING CASE (retained fixture, DoD 2): SPRINT-094's 6a6aeac --
//   "sprint(094) T1: widen the epic checker with rollup currency, 5 of 6 DoD"
// -- ticked all 5 of T1's own remaining DoD items in the SAME commit (an internally consistent claim
// for T1 alone) while also ticking one box each in T2's and T3's DoD blocks, neither of which its
// subject named. Every downstream signal stayed clean: line caps unchanged, no grep tripped, the
// commit body itself said "5 of 6", and it survived a worktree-isolated review an hour later. Nothing
// compared a tick's OWN section against the commit's claimed task.
//
// SCOPE, NARROWED ON EVIDENCE (DoD 1, L-097 * L-130): this checker does NOT compare a commit's
// claimed "N of M" figure against an actual count. Sampling this repo's own history found the figure
// claim is not reliably parseable from the subject line without a real false-positive risk -- e.g.
// "sprint(098): correct A2 -- the population is 4 of 5, not 36 of 97" and "sprint(77): T2 -- the two
// rulings; SS Closed-when 3 ticks, EPIC-004 at 4 of 5" (SS standing in for the section-mark character,
// kept ASCII here) both carry an "N of M" shape that is NOT a DoD claim at all. The UNATTRIBUTED-TICK
// half carries no such ambiguity -- it depends only on WHICH task a commit claims, which this repo
// already answers mechanically (ported below) -- and it applies to EVERY commit this checker can
// attribute to a single task, regardless of subject shape or whether it states a figure. The
// narrowing is scoped to the figure/count comparison ONLY; it is never a reason to skip a commit's
// unattributed-tick check (a defect an adversarial review of ca577e9 found in this file's own note
// text -- see checkDodDelta below).
//
// TypeScript run by Bun, per the owner ruling recorded in SPRINT-101 T3 -- not POSIX sh.

export interface DodItem {
  /** The bullet's own text (all wrapped/continuation lines joined), with the checkbox marker stripped. */
  readonly text: string;
  readonly checked: boolean;
}

export interface TaskSection {
  /** The heading's task token, e.g. "T1" or "T2a", or a combined token like "T1+T2" for a joint heading. */
  readonly task: string;
  readonly items: readonly DodItem[];
}

// Task token: T<digits> with an optional single letter suffix (T1, T2a, T2b -- SPRINT-038's real
// shape for split subtasks, adversarial-review finding 3 of ca577e9). A combined heading may chain
// several with "+".
const TASK_TOKEN = "T\\d+[a-zA-Z]?";
const HEADING_RE = new RegExp(`^###\\s+(${TASK_TOKEN}(?:\\+${TASK_TOKEN})*)\\s`);
const DOD_HEADER_RE = /^\*\*DoD:\*\*/;
const ITEM_RE = /^-\s\[([ xX])\]\s?(.*)$/;

/**
 * Splits a sprint doc's body into per-task DoD lists, keyed by the heading's task token.
 *
 * A DoD block runs from its own task's "**DoD:**" line to the next blank line (this repo's DoD lists
 * never carry a blank line BETWEEN items -- a wrapped bullet's continuation lines are indented and
 * carry no leading "- [ ]"/"- [x]"), or to the next "### T<n>" heading, whichever comes first.
 * Continuation lines are folded into the item's own text so two items are never conflated merely
 * because one wrapped differently, and a tick is matched against the WHOLE bullet, not just its
 * first line.
 */
export function parseDodSections(content: string): Map<string, TaskSection> {
  const lines = content.split(/\r?\n/);
  const sections = new Map<string, TaskSection>();
  let currentTask: string | null = null;
  let inDod = false;
  let items: DodItem[] = [];
  let current: { checked: boolean; text: string[] } | null = null;

  const closeItem = () => {
    if (current) {
      items.push({ text: current.text.join(" ").replace(/\s+/g, " ").trim(), checked: current.checked });
      current = null;
    }
  };
  const flushSection = () => {
    closeItem();
    if (currentTask !== null) sections.set(currentTask, { task: currentTask, items });
  };

  for (const line of lines) {
    const h = HEADING_RE.exec(line);
    if (h) {
      flushSection();
      currentTask = h[1]!;
      items = [];
      inDod = false;
      continue;
    }
    if (currentTask === null) continue;
    if (!inDod) {
      if (DOD_HEADER_RE.test(line)) inDod = true;
      continue;
    }
    const m = ITEM_RE.exec(line);
    if (m) {
      closeItem();
      current = { checked: m[1]!.toLowerCase() === "x", text: [m[2]!.trim()] };
      continue;
    }
    if (/^\s*$/.test(line)) {
      closeItem();
      inDod = false; // a blank line ends this task's DoD block
      continue;
    }
    if (/^\s+\S/.test(line) && current) {
      current.text.push(line.trim());
      continue;
    }
    // Any other shape defensively ends the block rather than guessing what it belongs to.
    closeItem();
    inDod = false;
  }
  flushSection();
  return sections;
}

export interface Tick {
  readonly task: string;
  readonly text: string;
}

/**
 * Every DoD item that is checked in `newContent` and was NOT already checked (or did not yet exist)
 * under the SAME task in `oldContent`. Matched by the task token PLUS the item's own text -- never by
 * line position, so an item inserted or reordered ahead of another is never mistaken for a tick
 * (CLAUDE.md Anti-Patterns edit-safety (b): a structure-adjacent edit can silently fuse or shift
 * neighbouring entries while a position-based diff stays clean).
 */
export function findNewTicks(oldContent: string, newContent: string): Tick[] {
  const oldSections = parseDodSections(oldContent);
  const newSections = parseDodSections(newContent);
  const ticks: Tick[] = [];
  for (const [task, section] of newSections) {
    const oldChecked = new Set(
      (oldSections.get(task)?.items ?? []).filter((i) => i.checked).map((i) => i.text),
    );
    for (const item of section.items) {
      if (item.checked && !oldChecked.has(item.text)) {
        ticks.push({ task, text: item.text });
      }
    }
  }
  return ticks;
}

export type ClaimScope =
  // `sprint` is null when the task came from a `Task:` trailer on a subject with no sprint(NNN)/
  // merge(NNN) number at all (finding 1 of the ca577e9 review) -- the doc is then found by scanning
  // the commit's own changed files for the SOLE sprint-doc-shaped path, never by guessing a number.
  | { readonly kind: "task"; readonly task: string; readonly sprint: string | null }
  | { readonly kind: "coord"; readonly sprint: string }
  | { readonly kind: "unscoped" };

function commitSprintNumber(subject: string): string | null {
  const m = /^sprint\((\d+)\)/.exec(subject) ?? /^merge\((\d+)\)/.exec(subject);
  return m ? m[1]! : null;
}

/**
 * Attributes a commit's subject (+ optional `Task:` trailer) to exactly ONE task, a sprint-wide
 * COORD claim, or UNSCOPED.
 *
 * Ported from scripts/lib/check-layers-observed.sh's `attribute()` (SPRINT-049 T1, TD-031 / TD-035),
 * which already survived adversarial review for precisely this class of ambiguity: a qualifier that
 * embeds a SECOND task reference (`T1 and T2:`, `T1-T3:`) must fall through rather than resolve to
 * the first token (L-108's family -- a guard matched by substring, failing green). Reusing this
 * repo's already-hardened attribution logic is deliberate: inventing a second, simpler regex for the
 * same question is exactly the population-blindness risk CLAUDE.md Anti-Patterns (iv) names -- two
 * detectors of "which task owns this commit" that quietly disagree on the edge cases neither author
 * tested.
 *
 * Rule 1 (the trailer) is checked FIRST and UNCONDITIONALLY, matching the ported checker's own
 * ordering -- it is the most explicit signal available, and an adversarial review of ca577e9 found it
 * being silently dropped whenever the subject lacked a sprint(NNN)/merge(NNN) prefix (finding 1: real
 * commits 8afec97/bb0763a/298c1e1 carry `Task: T1` on a `fix(engine):`/`test(engine):`/`perf(engine):`
 * subject). The sprint NUMBER is still needed to find the doc, but that is `loadCommit`'s problem
 * (findSprintDocPath's null-sprint arm), not a reason to withhold attribution here.
 *
 * NOT ported: `is_governance_commit()`'s file-classification and the bare UNATTRIBUTED report. This
 * checker only needs "is there ONE claimed task" -- a commit this function cannot attribute to a
 * task (whether because it is coordinator bookkeeping, pure governance, or genuinely unattributable)
 * is `unscoped` here and its ticks are not checked, mirroring rule 5's COORD exemption in the ported
 * checker ("COORDINATOR bookkeeping, exempt by role").
 */
export function attributeClaim(subject: string, taskTrailer: string | null): ClaimScope {
  // Rule 1: a `Task:` trailer, unambiguous, honoured regardless of subject prefix.
  const trailerRe = new RegExp(`^${TASK_TOKEN}$`);
  if (taskTrailer && trailerRe.test(taskTrailer.trim())) {
    return { kind: "task", task: taskTrailer.trim(), sprint: commitSprintNumber(subject) };
  }

  // Rule 2: `sprint(NNN) T<n>: ...` -- the motivating commit's own shape.
  let m = new RegExp(`^sprint\\((\\d+)\\)\\s+(${TASK_TOKEN}):`).exec(subject);
  if (m) return { kind: "task", sprint: m[1]!, task: m[2]! };

  // Rule 3: `merge(...): T<n> ...` -- coordinator merge-back of an agent branch.
  m = new RegExp(`^merge\\([^)]*\\):\\s*(${TASK_TOKEN})(?:[^0-9a-zA-Z]|$)`).exec(subject);
  if (m) {
    const sprint = commitSprintNumber(subject);
    if (sprint) return { kind: "task", sprint, task: m[1]! };
  }

  // Rule 4: trailing parenthetical `(SPRINT-NNN T<n>)`.
  m = new RegExp(`\\(SPRINT-(\\d+)\\s+(${TASK_TOKEN})\\)`).exec(subject);
  if (m) return { kind: "task", sprint: m[1]!, task: m[2]! };

  // Rule 5: `sprint(NNN) T<n> <qualifier>: ...` where <qualifier> is a space-then-letter-led run of
  // [A-Za-z0-9 ] with NO embedded `T<digit>` -- "T1 revise:" names T1 as unambiguously as "T1:" does;
  // "T1 and T2:" / "T1-T3:" must fall through to UNSCOPED rather than guess the first token.
  const qm = new RegExp(`^sprint\\((\\d+)\\)\\s+(${TASK_TOKEN})\\s+([A-Za-z][A-Za-z0-9 ]*):`).exec(subject);
  if (qm && !/T\d/.test(qm[3]!)) return { kind: "task", sprint: qm[1]!, task: qm[2]! };

  // Rule 6: `sprint(NNN): ...` with no task id -- COORDINATOR bookkeeping, exempt by role.
  m = /^sprint\((\d+)\):/.exec(subject);
  if (m) return { kind: "coord", sprint: m[1]! };

  return { kind: "unscoped" };
}

export interface DodDeltaFinding {
  readonly kind: "unattributed-tick";
  readonly message: string;
}

export interface DodDeltaResult {
  readonly ok: boolean;
  readonly findings: readonly DodDeltaFinding[];
  /** Set only when the commit was legitimately out of scope (no doc change, coordinator commit, ...). */
  readonly note?: string;
}

/**
 * `newContent === null` means the commit's diff did not touch a sprint doc this checker could
 * resolve for the claimed task at all -- a legitimate skip, never a FAIL, mirroring the "missing file
 * is a skip" convention in scripts/lib/check-count-claims.sh.
 */
export function checkDodDelta(
  subject: string,
  taskTrailer: string | null,
  oldContent: string,
  newContent: string | null,
): DodDeltaResult {
  const scope = attributeClaim(subject, taskTrailer);
  if (scope.kind !== "task") {
    return {
      ok: true,
      findings: [],
      note:
        scope.kind === "coord"
          ? "dod-delta: subject is coordinator-scoped (no single task claimed) -- unattributed-tick check does not apply"
          : "dod-delta: subject does not attribute to exactly one task (ambiguous or unrecognized task-token shape) -- the unattributed-tick check needs a single claimed owner to compare ticks against, so this commit is not examined",
    };
  }
  if (newContent === null) {
    return {
      ok: true,
      findings: [],
      note:
        `dod-delta: no sprint doc found for ${scope.task}` +
        (scope.sprint ? ` (sprint ${scope.sprint})` : " (no sprint number in subject -- attributed via Task: trailer only, and no single sprint-doc-shaped path in this commit's diff)") +
        " -- nothing to compare",
    };
  }

  const ticks = findNewTicks(oldContent, newContent);
  const foreign = ticks.filter((t) => t.task !== scope.task);
  if (foreign.length === 0) {
    return { ok: true, findings: [] };
  }
  return {
    ok: false,
    findings: foreign.map((f) => ({
      kind: "unattributed-tick" as const,
      message: `dod-delta: commit claims ${scope.task} but ticked ${f.task}'s DoD item it never named: "${f.text}"`,
    })),
  };
}

// --- CLI: reads real commits via git, never a hand-passed string (L-166) -------------------------

import { execFileSync } from "node:child_process";

function git(args: readonly string[], cwd: string): string {
  return execFileSync("git", args, { cwd, encoding: "utf8" });
}

const SPRINT_FILE_RE = /SPRINT-0*(\d+)-/;

function isLikelySprintDocPath(p: string): boolean {
  return SPRINT_FILE_RE.test(p.split("/").pop() ?? "") && !p.includes("/logs/");
}

/**
 * Orders candidate sprint-doc paths non-archive-first, archive-last -- CASE-INSENSITIVELY (finding 5
 * of the ca577e9 review: the original `!p.includes("/archive/")` never matched a mis-cased
 * `/Archive/` segment, so a mis-cased path could win by list order alone on any filesystem, and this
 * host is Windows). Deliberately a narrow string-normalisation fix, not a port of
 * scripts/lib/archive-path.sh's `lf_is_archived_path` -- that predicate also resolves filesystem
 * identity for a path that doesn't literally contain "archive" under ANY casing (a symlink or a
 * differently-named mount), which this function has no need of: it only ever ranks paths a git diff
 * already names, and every one of those names the literal substring "archive" when archived at all.
 */
function orderNonArchiveFirst(paths: readonly string[]): string[] {
  return [...paths].sort((a, b) => {
    const aArchived = a.toLowerCase().includes("/archive/") ? 1 : 0;
    const bArchived = b.toLowerCase().includes("/archive/") ? 1 : 0;
    return aArchived - bArchived;
  });
}

/**
 * Every sprint-doc-shaped candidate path for `sprint` (or, when `sprint` is null, for whatever SOLE
 * sprint number the commit's own changed-file set names), non-archive-first. Excludes anything under
 * a `logs/` directory -- the Execution Log ships at the SAME basename
 * (`docs/sprint/logs/SPRINT-NNN-*.md`) and 6a6aeac's own diff touched both in one commit.
 *
 * Returns MULTIPLE candidates (not just the best guess) so a caller can fall back to the next one if
 * the first does not resolve at the ref being read -- finding 6 of the ca577e9 review: a task-scoped
 * commit that archive-MOVES its own doc in the same commit lists both the old (now-deleted-at-this-
 * ref) and new path, and a caller that only ever tries the first candidate throws uncaught.
 */
export function orderedSprintDocCandidates(changedFiles: readonly string[], sprint: string | null): string[] {
  if (sprint !== null) {
    const re = new RegExp(`SPRINT-0*${sprint}-`);
    const candidates = changedFiles.filter((p) => re.test(p.split("/").pop() ?? "") && !p.includes("/logs/"));
    return orderNonArchiveFirst(candidates);
  }
  // Unknown sprint (a trailer-only attribution with no subject-embedded number): find the SOLE
  // distinct sprint number touched by this commit's sprint-doc-shaped paths. Never guess among
  // several -- ambiguous is an empty result, exactly like the coord/unscoped exemptions elsewhere.
  const candidates = changedFiles.filter(isLikelySprintDocPath);
  const numbers = new Set(candidates.map((p) => SPRINT_FILE_RE.exec(p.split("/").pop() ?? "")?.[1]));
  if (numbers.size !== 1) return [];
  return orderNonArchiveFirst(candidates);
}

/** Single best-guess path, for callers that don't need the fallback list (kept for existing callers/tests). */
export function findSprintDocPath(changedFiles: readonly string[], sprint: string | null): string | null {
  return orderedSprintDocCandidates(changedFiles, sprint)[0] ?? null;
}

export interface LoadedCommit {
  readonly subject: string;
  readonly taskTrailer: string | null;
  readonly sprintDocPath: string | null;
  readonly oldContent: string;
  readonly newContent: string | null;
}

export function loadCommit(repoRoot: string, ref: string): LoadedCommit {
  const subject = git(["show", "-s", "--format=%s", ref], repoRoot).trim();
  const trailerRaw = git(["show", "-s", "--format=%(trailers:key=Task,valueonly)", ref], repoRoot).trim();
  const taskTrailer = trailerRaw.length > 0 ? trailerRaw : null;

  const scope = attributeClaim(subject, taskTrailer);
  const sprint = scope.kind === "task" ? scope.sprint : commitSprintNumber(subject);
  const changed = git(["show", "--name-only", "--format=", ref], repoRoot)
    .split(/\r?\n/)
    .filter((l) => l.length > 0);
  const candidates = orderedSprintDocCandidates(changed, sprint);

  // Try each candidate in order; a candidate that does not resolve AT THIS REF (e.g. it is the
  // pre-move path of a commit that archive-moved its own doc) is skipped rather than left to throw
  // uncaught (finding 6). Never trusts the FIRST candidate blindly.
  let sprintDocPath: string | null = null;
  let newContent: string | null = null;
  for (const cand of candidates) {
    try {
      newContent = git(["show", `${ref}:${cand}`], repoRoot);
      sprintDocPath = cand;
      break;
    } catch {
      continue;
    }
  }
  if (sprintDocPath === null) {
    return { subject, taskTrailer, sprintDocPath: null, oldContent: "", newContent: null };
  }

  let oldContent = "";
  try {
    oldContent = git(["show", `${ref}^:${sprintDocPath}`], repoRoot);
  } catch {
    oldContent = ""; // no parent, or the file did not exist there yet -- everything checked reads as new
  }
  return { subject, taskTrailer, sprintDocPath, oldContent, newContent };
}

/** Reads a frontmatter key's value the way `check-layers-observed.sh`'s `fmv()` does: only within
 * the leading `---`-delimited block, first match wins. */
export function frontmatterValue(content: string, key: string): string | null {
  const lines = content.split(/\r?\n/);
  if (lines[0] !== "---") return null;
  const re = new RegExp(`^${key}:\\s*(.*)$`);
  for (let i = 1; i < lines.length; i++) {
    if (lines[i] === "---") break;
    const m = re.exec(lines[i]!);
    if (m) return m[1]!.trim();
  }
  return null;
}

/** `git rev-list <planCommit>..<head>`, oldest first -- a real range, never a hand-passed list. */
export function commitsInRange(repoRoot: string, planCommit: string, head: string): string[] {
  return git(["rev-list", "--reverse", `${planCommit}..${head}`], repoRoot)
    .split(/\r?\n/)
    .filter((l) => l.length > 0);
}

function checkOneCommit(repoRoot: string, ref: string): { line: string; ok: boolean } {
  let commit: LoadedCommit;
  try {
    commit = loadCommit(repoRoot, ref);
  } catch (e) {
    return { line: `FAIL  dod-delta: could not read commit '${ref}' -- ${(e as Error).message}`, ok: false };
  }
  const result = checkDodDelta(commit.subject, commit.taskTrailer, commit.oldContent, commit.newContent);
  if (result.ok) {
    const msg = result.note ?? `dod-delta: ${commit.sprintDocPath} -- claim and ticks agree (${ref}: "${commit.subject}")`;
    return { line: `PASS  ${msg}`, ok: true };
  }
  return { line: result.findings.map((f) => `FAIL  ${f.message} (${ref})`).join("\n"), ok: false };
}

if (import.meta.main) {
  // Usage mirrors check-layers-observed.sh's own CLI shape: repo root + every ACTIVE sprint doc path,
  // never a single ref. HEAD-only (this checker's first shipped shape) was reviewed and found wrong
  // (finding 2 of the ca577e9 review): the gate does not run after every single commit in practice --
  // this very sprint landed T4's commit plus three coordinator commits between gate runs, and all
  // four would go permanently unexamined under HEAD-only. The range is sourced from each doc's own
  // `plan_commit:` frontmatter, exactly as the sibling this checker ports attribution FROM already
  // does, so a commit is examined once per sprint whose range it falls in, however many gate runs
  // happen in between.
  const [repoRoot, ...sprintDocPaths] = process.argv.slice(2);
  if (!repoRoot || sprintDocPaths.length === 0) {
    console.error("usage: bun scripts/lib/check-dod-delta.ts <repo-root> <sprint-doc-path>...");
    process.exit(2);
  }

  let anyFail = false;
  const shas = new Set<string>();

  for (const docPath of sprintDocPaths) {
    let content: string;
    try {
      content = git(["show", `HEAD:${docPath}`], repoRoot);
    } catch {
      // A path passed in that HEAD does not have (shouldn't happen given the caller globs live
      // files, but never trusted) -- reported and skipped, never silently ignored.
      console.log(`FAIL  dod-delta: ${docPath} not found at HEAD`);
      anyFail = true;
      continue;
    }
    const planCommit = frontmatterValue(content, "plan_commit");
    if (!planCommit) {
      console.log(`FAIL  dod-delta: ${docPath} plan_commit not recorded in frontmatter`);
      anyFail = true;
      continue;
    }
    if (planCommit.includes("[")) {
      console.log(`PASS  dod-delta: ${docPath} plan_commit still a placeholder (${planCommit}) -- skipping until recorded`);
      continue;
    }
    try {
      git(["rev-parse", "--verify", "-q", `${planCommit}^{commit}`], repoRoot);
    } catch {
      console.log(`FAIL  dod-delta: ${docPath} plan_commit '${planCommit}' does not resolve to a commit`);
      anyFail = true;
      continue;
    }
    for (const sha of commitsInRange(repoRoot, planCommit, "HEAD")) shas.add(sha);
  }

  for (const sha of shas) {
    const { line, ok } = checkOneCommit(repoRoot, sha);
    console.log(line);
    if (!ok) anyFail = true;
  }

  process.exit(anyFail ? 1 : 0);
}
