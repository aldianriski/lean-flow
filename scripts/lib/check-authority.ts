// scripts/lib/check-authority.ts -- the authority checker (TASK-355), run by Bun.
//
// WHY: it began as a port of check-authority.sh, whose ~12 subprocesses (awk/grep) cost ~2.75s each
// under Windows fork() emulation. The shell version is retired (SPRINT-128 T4); this file is the
// only implementation. The rationale (TD-123/TD-124 mode signal, the de-fenced-copy fix, the two
// assertions' different kinds) is carried by the comments on the functions below.
//
// THE MODE SIGNAL IS PARTLY A RECORDED FACT (SPRINT-118 T1, TD-124). Attendedness used to be INFERRED
// from two defeatable signals (a `terminal · ` line the reaper may never write, a pinned envelope that
// proves a grant and not a run). night-run.sh now appends one `fired · <ts> · <mode>` line to the
// sprint's Execution Log before the wrapped command runs, not gated on reap(), and this file reads it
// as a third signal, OR-ed with the other two (kept for logs written before that line existed).
// RESIDUAL, stated honestly: a run fired OUTSIDE night-run.sh leaves no `fired · ` line, and
// night-run.md's pre-flight forbids that path. A log written before this line existed still rests on
// the two older signals and keeps their gap.
//
// MEMBER-FILE READING (TASK-382, owner ruling B). Besides the Plan header meta, this file resolves
// the sprint's CURRENT docs/work/ members (scripts/lib/sprint-members.ts, live tree only -- no git)
// and reads each member's own `authority:` frontmatter field:
//   - missing/invalid `authority:` -> FAIL authority-undeclared, naming the MEMBER FILE (distinct
//     from the Plan-header authority-undeclared above, which names a `Tn` instead).
//   - a `### Tn` block whose `Cites:` LEADING RUN names the member, where Tn's bracket J-class DIFFERS from
//     the member's declared `authority:` -> FAIL authority-plan-member-mismatch, naming Tn, the
//     TASK id, and both values.
//   - otherwise -> PASS authority-member-declared.
// A sprint with NO `### Tn` blocks but with members is NOT a skip -- the member checks still run
// (see evaluateSprintFile below).
//
// WHAT THE EVIDENCE IS: every ARCHIVED sprint carries `status: closed`, which returns from
// evaluateSprintFile on the closed-status check BEFORE parsing any `### Tn` block -- a confirmed-trivial
// early return. The load-bearing evidence is the retained fixtures (evals/fixtures/authority/*,
// including active-sprint-mixed: honoured + bypassed + attended-executed + a J1 sibling together).
//
// Usage: bun scripts/lib/check-authority.ts <sprint-file>...
// Prints one PASS/FAIL/note line per assertion; exits 1 if any FAIL line was printed, 0 otherwise.

import { existsSync, readFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { parsePlan, resolveMembers, type Member } from "./sprint-members.ts";

// --- frontmatter (pure) -----------------------------------------------------------------------

/**
 * Reads a `KEY: value` line from the leading `---` frontmatter block: first line must be exactly
 * `---`; scan stops at the closing `---` or the first matching key. Value is NOT trimmed beyond the
 * `[ \t]*` after the key.
 */
export function frontmatterField(content: string, key: string): string | null {
  const lines = content.split(/\r?\n/);
  if (lines.length === 0 || lines[0] !== "---") return null;
  const re = new RegExp(`^${key}:[ \\t]*`);
  for (let i = 1; i < lines.length; i++) {
    if (lines[i] === "---") return null;
    if (re.test(lines[i]!)) return lines[i]!.replace(re, "");
  }
  return null;
}

// --- de-fencing (pure) -------------------------------------------------------------------------

/**
 * TD-124: `awk '/^```/ { infence = !infence; next } !infence { print }'` -- strips every line
 * inside a bare, unindented ``` fence so a quoted example log line can't defeat a column-1 anchor.
 */
export function defence(content: string): string {
  const lines = content.split(/\r?\n/);
  let inFence = false;
  const out: string[] = [];
  for (const line of lines) {
    if (/^```/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (!inFence) out.push(line);
  }
  return out.join("\n");
}

// --- task records (pure) -----------------------------------------------------------------------

export interface TaskRecord {
  readonly tid: string;
  readonly cls: string; // "" if undeclared
}

/**
 * `<Tn>` and its class (or empty) per `### Tn` heading of the `## Plan`, read through the shared Plan
 * parser (TASK-444) -- so a letter-suffixed task id (`T2a`) is a record like any other, not skipped.
 */
export function parseTaskRecords(spContent: string): TaskRecord[] {
  const records: TaskRecord[] = [];
  for (const b of parsePlan(spContent).blocks) {
    if (b.tid === "") continue;
    const line = b.heading;
    const tid = b.tid;
    const metaMatch = line.match(/\[[^\]]*\]/);
    const meta = metaMatch ? metaMatch[0] : "";
    let cls = "";
    if (meta.length > 0) {
      const parts = meta.split(/[\]\[ ]*·[ ]*/);
      for (let p of parts) {
        p = p.replace(/^[\[ \t]+/, "").replace(/[\] \t`]+$/, "");
        if (p === "J0" || p === "J1" || p === "J2") cls = p;
      }
    }
    records.push({ tid, cls });
  }
  return records;
}

// --- mode signal (pure over already-loaded content) -----------------------------------------

export interface ModeSignal {
  readonly touch: boolean;
  readonly reason: string;
}

const TERMINAL_RE = /^terminal · (PLAN_EXHAUSTED|AUTHORITY_BOUNDARY|HARD_FAILURE|BUDGET_STOP|USER_STOP) · /m;
// SPRINT-118 T1 (TD-124): the launcher's own fire-time line. Anchored exactly like TERMINAL_RE (column 1,
// run over the de-fenced log) but it carries NO state vocabulary -- it records only that a run fired.
const FIRED_RE = /^fired · \S+ · \S/m;
const ENVELOPE_SHA_RE = /.* @ ([0-9a-fA-F]{7,})[ \t]*$/;

/**
 * TD-123/TD-124: three signals that an UNATTENDED run touched this sprint. The `fired · ` line is
 * written by night-run.sh BEFORE the wrapped command runs and independent of reap()'s decision to
 * append, so it is a recorded fact rather than an inference. The `terminal · ` line and the pinned
 * envelope stay as an OR backstop for logs written before that line existed. See the header's
 * residual paragraph for what the OR still does not prove. `logExists` and `defenced` are the de-fenced log content (empty string if the log is
 * absent or empty); `spContent` is the sprint doc's own frontmatter source.
 */
export function computeModeSignal(logExists: boolean, defenced: string, spContent: string): ModeSignal {
  if (logExists && FIRED_RE.test(defenced)) {
    return {
      touch: true,
      reason:
        "this log's own `fired · ` line, written by night-run.sh before the run started, records that an unattended run was launched against it",
    };
  }
  if (logExists && TERMINAL_RE.test(defenced)) {
    return {
      touch: true,
      reason: "this log's own `terminal · ` line shows night-run.sh's unattended machinery reached it",
    };
  }
  const envLine = frontmatterField(spContent, "approval_envelope");
  if (envLine !== null && envLine.length > 0) {
    const m = ENVELOPE_SHA_RE.exec(envLine);
    if (m) {
      return {
        touch: true,
        reason:
          "this sprint's own frontmatter carries a pinned `approval_envelope:` (no `terminal · ` line, but the pre-launch grant is independent evidence -- TD-124)",
      };
    }
  }
  return { touch: false, reason: "" };
}

// --- J2 verdict (pure) -------------------------------------------------------------------------

function countLinesMatching(content: string, pattern: string): number {
  const re = new RegExp(pattern);
  return content.split(/\r?\n/).filter((l) => re.test(l)).length;
}

function j2Verdict(sp: string, tid: string, defenced: string, mode: ModeSignal): string {
  const parked = countLinesMatching(defenced, `^${tid} · parked`);
  const executed = countLinesMatching(defenced, `^consequence · ${tid} · `);
  const ruled = countLinesMatching(defenced, `^owner-ruling · ${tid} · `);

  if (parked === 0 && executed > 0 && mode.touch) {
    return `FAIL  authority-j2-not-parked: ${sp} ${tid} is declared J2 but its Execution Log carries an execution record and no park record, and ${mode.reason}. A J2 step is human-reserved: it parks with its unblock condition, it is never asked, decided, or worked around (night-run.md Part 0 § Park protocol)`;
  }
  if (parked > 0 && executed > 0 && ruled === 0) {
    return `FAIL  authority-j2-park-bypassed: ${sp} ${tid} is declared J2 and its Execution Log carries BOTH a park record and an execution record, with no \`owner-ruling · ${tid} · <ruling>\` line resolving the park. Parking a step and then working it anyway is the bypass Part 0 step 6 forbids; a stale park record is not authority. If a human did unblock it, record that ruling -- an unrecorded unblock is indistinguishable from a bypass`;
  }
  if (parked === 0 && executed > 0) {
    return `PASS  authority-j2-honoured: ${sp} ${tid} executed with no park record, but no \`terminal · \` line anywhere in this log shows night-run.sh's unattended machinery ever reached it -- read as an attended completion, where the human is the ask channel and Part 0's park protocol (built for a headless run with none) does not apply (${executed} execution record(s), 0 park, ${ruled} owner ruling(s))`;
  }
  return `PASS  authority-j2-honoured: ${sp} ${tid} (${parked} park record(s), ${executed} execution record(s), ${ruled} owner ruling(s))`;
}

// --- member-file authority (TASK-382, owner ruling B; pure) -------------------------------------

const VALID_CLASSES = new Set(["J0", "J1", "J2"]);

/**
 * `Tn -> the TASK ids that govern it`: the LEADING RUN of its `Cites:` declaration (`cites.lead`, owner
 * ruling TD-199). A later mention (`split from TASK-991`) is a citation and governs nothing. Read through
 * the shared Plan parser, continuation lines included.
 */
export function parseCites(spContent: string): Map<string, Set<string>> {
  const map = new Map<string, Set<string>>();
  for (const b of parsePlan(spContent).blocks) {
    if (b.tid !== "" && b.cites.lead.length > 0) map.set(b.tid, new Set(b.cites.lead));
  }
  return map;
}

/**
 * For each CURRENT member (already resolved by the I/O boundary via sprint-members.ts): its own
 * `authority:` frontmatter must be a valid J0/J1/J2, and if some `Tn`'s `Cites:` names it, that
 * Tn's bracket J-class must agree with the member's declared authority. A sprint with no `### Tn`
 * blocks still runs this -- there is simply nothing to cross-check against, so every member either
 * passes on its own declaration or fails FOR THAT REASON, never silently skipped.
 */
export function evaluateMemberAuthority(sp: string, members: readonly Member[], tCites: Map<string, Set<string>>, tnClass: Map<string, string>): string[] {
  const out: string[] = [];
  for (const m of members) {
    const auth = (m.frontmatter.authority ?? "").trim();
    if (!VALID_CLASSES.has(auth)) {
      out.push(
        `FAIL  authority-undeclared: ${sp} member ${m.path} (${m.id}) declares no valid authority: (J0/J1/J2 required, got ${auth ? `"${auth}"` : "none"})`,
      );
      continue;
    }
    let mismatch: { tid: string; cls: string } | null = null;
    for (const [tid, cited] of tCites) {
      if (!cited.has(m.id)) continue;
      const cls = tnClass.get(tid);
      if (cls && cls !== auth) {
        mismatch = { tid, cls };
        break;
      }
    }
    if (mismatch) {
      out.push(
        `FAIL  authority-plan-member-mismatch: ${sp} ${mismatch.tid} Plan declares ${mismatch.cls}, member ${m.path} (${m.id}) declares ${auth}`,
      );
    } else {
      out.push(`PASS  authority-member-declared: ${sp} ${m.id} (${m.path}) authority: ${auth}`);
    }
  }
  return out;
}

// --- per-file evaluation ------------------------------------------------------------------------

export interface SprintFileInput {
  readonly path: string;
  /** null if the file does not exist. */
  readonly content: string | null;
  readonly logExists: boolean;
  /** Raw log content (only meaningful when `logExists`). */
  readonly logContent: string;
  /** TASK-382 owner ruling B: the sprint's CURRENT docs/work/ members, resolved by the I/O
   * boundary (runCheckAuthority) via sprint-members.ts. `[]` for a store-less root -- every
   * pre-existing fixture and every input that predates this ruling, so wiring this in changes
   * nothing for them. */
  readonly members: readonly Member[];
}

export function evaluateSprintFile(input: SprintFileInput): string[] {
  const { path: sp, content, logExists, logContent, members } = input;
  const out: string[] = [];

  if (content === null) {
    out.push(`FAIL  authority: file not found: ${sp}`);
    return out;
  }

  const status = frontmatterField(content, "status");
  if (status === "closed") {
    out.push(
      `      authority: skip (status: closed -- the class is declared at promote/G2, both behind this sprint): ${sp}`,
    );
    return out;
  }

  const defenced = logExists ? defence(logContent) : "";
  const mode = computeModeSignal(logExists, defenced, content);

  const records = parseTaskRecords(content);
  if (records.length === 0 && members.length === 0) {
    out.push(`      authority: skip (no ### Tn task blocks): ${sp}`);
    return out;
  }

  for (const { tid, cls } of records) {
    if (tid.length === 0) continue;
    if (cls.length === 0) {
      out.push(
        `FAIL  authority-undeclared: ${sp} ${tid} carries no J0/J1/J2 in its header meta. An undeclared class is an unasked question and an unasked question is a BLOCK (night-run.md Part 0), so this reads as J2 rather than defaulting to J0 -- declare it at promote/G2 beside class:`,
      );
      continue;
    }
    out.push(`PASS  authority-declared: ${sp} ${tid} ${cls}`);

    if (cls !== "J2") continue;
    if (!logExists) continue; // nothing has run; the honoured half is not yet checkable

    out.push(j2Verdict(sp, tid, defenced, mode));
  }

  // TASK-382 owner ruling B: member-file authority, independent of whether any ### Tn exists.
  if (members.length > 0) {
    const tCites = parseCites(content);
    const tnClass = new Map(records.filter((r) => r.cls.length > 0).map((r) => [r.tid, r.cls] as const));
    out.push(...evaluateMemberAuthority(sp, members, tCites, tnClass));
  }

  return out;
}

// --- CLI -------------------------------------------------------------------------------------------

export interface CheckAuthorityResult {
  readonly lines: string[];
  readonly exitCode: 0 | 1;
}

export function runCheckAuthority(sprintFilePaths: readonly string[]): CheckAuthorityResult {
  if (sprintFilePaths.length === 0) {
    return { lines: ["      authority: no sprint files given -- nothing verified"], exitCode: 0 };
  }

  const lines: string[] = [];
  for (const sp of sprintFilePaths) {
    let content: string | null = null;
    if (existsSync(sp)) {
      try {
        content = readFileSync(sp, "utf8");
      } catch {
        content = null;
      }
    }
    const logPath = join(dirname(sp), "logs", basename(sp));
    const logExists = existsSync(logPath);
    let logContent = "";
    if (logExists) {
      try {
        logContent = readFileSync(logPath, "utf8");
      } catch {
        logContent = "";
      }
    }
    // TASK-382 owner ruling B: `root` is `sp`'s grandparent-of-grandparent under the
    // `<root>/docs/sprint/<file>` convention every real sprint doc AND every member-shaped fixture
    // (evals/fixtures/authority/<case>/docs/sprint/<file>) follows. resolveMembers() degrades to
    // [] when that root has no docs/work/ at all -- every PRE-EXISTING flat fixture (no docs/sprint
    // subdir), so this addition changes nothing for any input that predates this ruling.
    const root = dirname(dirname(dirname(sp)));
    const members = content !== null ? resolveMembers(root, sp) : [];
    lines.push(...evaluateSprintFile({ path: sp, content, logExists, logContent, members }));
  }

  const exitCode = lines.some((l) => l.startsWith("FAIL")) ? 1 : 0;
  return { lines, exitCode };
}

if (import.meta.main) {
  const args = process.argv.slice(2);
  const result = runCheckAuthority(args);
  for (const l of result.lines) console.log(l);
  process.exit(result.exitCode);
}
