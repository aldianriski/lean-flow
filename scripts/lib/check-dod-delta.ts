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
// claimed "N of M" figure against an actual count. Sampling this repo's own history (see the T3
// report) found the figure claim is not reliably parseable from the subject line without a real
// false-positive risk -- e.g. "sprint(098): correct A2 -- the population is 4 of 5, not 36 of 97" and
// "sprint(77): T2 -- the two rulings; SS Closed-when 3 ticks, EPIC-004 at 4 of 5" (SS standing in for
// the section-mark character, kept ASCII here) both carry an
// "N of M" shape that is NOT a DoD claim at all. The UNATTRIBUTED-TICK half carries no such
// ambiguity -- it depends only on WHICH task a commit claims, which this repo already answers
// mechanically (ported below) -- and it applies to every commit, not only ones that state a figure.
// That is the sharper guard, per DoD 1's own permission to narrow when the figure half is not safe.
//
// TypeScript run by Bun, per the owner ruling recorded in SPRINT-101 T3 -- not POSIX sh.

export interface DodItem {
  /** The bullet's own text (all wrapped/continuation lines joined), with the checkbox marker stripped. */
  readonly text: string;
  readonly checked: boolean;
}

export interface TaskSection {
  /** The heading's task token, e.g. "T1", or a combined token like "T1+T2" for a joint heading. */
  readonly task: string;
  readonly items: readonly DodItem[];
}

const HEADING_RE = /^###\s+(T\d+(?:\+T\d+)*)\s/;
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
  | { readonly kind: "task"; readonly sprint: string; readonly task: string }
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
 * NOT ported: `is_governance_commit()`'s file-classification and the bare UNATTRIBUTED report. This
 * checker only needs "is there ONE claimed task" -- a commit this function cannot attribute to a
 * task (whether because it is coordinator bookkeeping, pure governance, or genuinely unattributable)
 * is `unscoped` here and its ticks are not checked, mirroring rule 5's COORD exemption in the ported
 * checker ("COORDINATOR bookkeeping, exempt by role").
 */
export function attributeClaim(subject: string, taskTrailer: string | null): ClaimScope {
  // Rule 1: a `Task:` trailer, unambiguous -- but this checker also needs the SPRINT number to find
  // the doc, which the trailer alone does not carry, so it still reads the subject for that.
  if (taskTrailer && /^T\d+$/.test(taskTrailer.trim())) {
    const sprint = commitSprintNumber(subject);
    if (sprint) return { kind: "task", sprint, task: taskTrailer.trim() };
  }

  // Rule 2: `sprint(NNN) T<n>: ...` -- the motivating commit's own shape.
  let m = /^sprint\((\d+)\)\s+(T\d+):/.exec(subject);
  if (m) return { kind: "task", sprint: m[1]!, task: m[2]! };

  // Rule 3: `merge(...): T<n> ...` -- coordinator merge-back of an agent branch.
  m = /^merge\([^)]*\):\s*(T\d+)(?:[^0-9]|$)/.exec(subject);
  if (m) {
    const sprint = commitSprintNumber(subject);
    if (sprint) return { kind: "task", sprint, task: m[1]! };
  }

  // Rule 4: trailing parenthetical `(SPRINT-NNN T<n>)`.
  m = /\(SPRINT-(\d+)\s+(T\d+)\)/.exec(subject);
  if (m) return { kind: "task", sprint: m[1]!, task: m[2]! };

  // Rule 5: `sprint(NNN) T<n> <qualifier>: ...` where <qualifier> is a space-then-letter-led run of
  // [A-Za-z0-9 ] with NO embedded `T<digit>` -- "T1 revise:" names T1 as unambiguously as "T1:" does;
  // "T1 and T2:" / "T1-T3:" must fall through to UNSCOPED rather than guess the first token.
  const qm = /^sprint\((\d+)\)\s+(T\d+)\s+([A-Za-z][A-Za-z0-9 ]*):/.exec(subject);
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
 * `newContent === null` means the commit's diff did not touch a sprint doc matching the claimed
 * sprint number at all (e.g. a `sprint(NNN) T<n>:` commit whose task closed via a different
 * artifact) -- a legitimate skip, never a FAIL, mirroring the "missing file is a skip" convention in
 * scripts/lib/check-count-claims.sh.
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
          : "dod-delta: subject does not attribute to exactly one task -- narrowed per SPRINT-101 T3 DoD 1, not examined",
    };
  }
  if (newContent === null) {
    return {
      ok: true,
      findings: [],
      note: `dod-delta: no sprint doc for sprint ${scope.sprint} in this commit's diff -- nothing to compare`,
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

// --- CLI: reads a real commit via git, never a hand-passed string (L-166) -----------------------

import { execFileSync } from "node:child_process";

function git(args: readonly string[], cwd: string): string {
  return execFileSync("git", args, { cwd, encoding: "utf8" });
}

/**
 * The sprint doc's own Plan file for `sprint`, excluded from anything under a `logs/` directory --
 * the Execution Log ships at the SAME basename (`docs/sprint/logs/SPRINT-NNN-*.md`) and 6a6aeac's own
 * diff touched both in one commit. Matching on basename alone would silently pick whichever path
 * `git show --name-only` happened to list first.
 */
export function findSprintDocPath(changedFiles: readonly string[], sprint: string): string | null {
  const re = new RegExp(`SPRINT-0*${sprint}-`);
  const candidates = changedFiles.filter((p) => re.test(p.split("/").pop() ?? "") && !p.includes("/logs/"));
  return candidates.find((p) => !p.includes("/archive/")) ?? candidates[0] ?? null;
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

  const sprint = commitSprintNumber(subject);
  if (!sprint) {
    return { subject, taskTrailer, sprintDocPath: null, oldContent: "", newContent: null };
  }

  const changed = git(["show", "--name-only", "--format=", ref], repoRoot)
    .split(/\r?\n/)
    .filter((l) => l.length > 0);
  const sprintDocPath = findSprintDocPath(changed, sprint);
  if (!sprintDocPath) {
    return { subject, taskTrailer, sprintDocPath: null, oldContent: "", newContent: null };
  }

  let oldContent = "";
  try {
    oldContent = git(["show", `${ref}^:${sprintDocPath}`], repoRoot);
  } catch {
    oldContent = ""; // no parent, or the file did not exist there yet -- everything checked reads as new
  }
  const newContent = git(["show", `${ref}:${sprintDocPath}`], repoRoot);
  return { subject, taskTrailer, sprintDocPath, oldContent, newContent };
}

if (import.meta.main) {
  const [repoRoot, ref = "HEAD"] = process.argv.slice(2);
  if (!repoRoot) {
    console.error("usage: bun scripts/lib/check-dod-delta.ts <repo-root> [ref=HEAD]");
    process.exit(2);
  }
  let commit: LoadedCommit;
  try {
    commit = loadCommit(repoRoot, ref);
  } catch (e) {
    console.log(`FAIL  dod-delta: could not read commit '${ref}' -- ${(e as Error).message}`);
    process.exit(1);
  }
  const result = checkDodDelta(commit.subject, commit.taskTrailer, commit.oldContent, commit.newContent);
  if (result.ok) {
    console.log(
      result.note
        ? `PASS  ${result.note}`
        : `PASS  dod-delta: ${commit.sprintDocPath} -- claim and ticks agree (${ref}: "${commit.subject}")`,
    );
    process.exit(0);
  }
  for (const f of result.findings) console.log(`FAIL  ${f.message}`);
  process.exit(1);
}
