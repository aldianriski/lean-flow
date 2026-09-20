// scripts/lib/check-authority.ts -- TypeScript port of check-authority.sh (TASK-355), run by Bun.
//
// WHY: the shell version launches ~12 subprocesses (awk/grep) per invocation, each costing ~2.75s
// under Windows fork() emulation. This port moves the same logic in-process. It is a SPEED change
// only -- every assertion the shell checker makes, this file makes identically, bug for bug.
// scripts/lib/check-authority.sh is UNCHANGED and remains the live oracle; this file is checked
// against it by a differential-parity harness, never trusted on its own say-so.
//
// See check-authority.sh's own header comment for the FULL rationale (TD-123/TD-124 mode signal,
// the de-fenced-copy fix, the two assertions' different kinds) -- not re-derived here, only ported.
//
// PARITY CLAIM, STATED PRECISELY (outside-review correction, TASK-355 revise): differential parity
// was run over every retained fixture PLUS every real archived and active docs/sprint/*.md this
// repo has -- but every ARCHIVED sprint carries `status: closed`, which returns from
// evaluateSprintFile on the closed-status check BEFORE parsing any `### Tn` block, before the mode
// signal, before any J2 logic. Real input, but a confirmed-trivial two-line early-return path --
// not a second independent proof that DECLARED/HONOURED/BYPASSED agree. The load-bearing evidence is
// the 11 retained fixtures (evals/fixtures/authority/*, including active-sprint-mixed -- ONE real
// active-sprint-shaped Plan/log pair carrying honoured + bypassed + attended-executed + a J1 sibling
// together, the shape an independent reviewer built from scratch and confirmed byte-identical). Read
// any differential total as "11/11 real-logic fixtures identical, plus N confirmed-trivial-path
// inputs also identical" -- never as N independent proofs of the same weight.
//
// Usage: bun scripts/lib/check-authority.ts <sprint-file>...
// Prints one PASS/FAIL/note line per assertion; exits 1 if any FAIL line was printed, 0 otherwise.

import { existsSync, readFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";

// --- frontmatter (pure) -----------------------------------------------------------------------

/**
 * Ports the awk one-liner that reads a `KEY: value` line from the leading `---` frontmatter block:
 * first line must be exactly `---`; scan stops at the closing `---` or the first matching key.
 * Value is NOT trimmed beyond the `[ \t]*` the shell regex itself strips (faithful to the oracle,
 * not "cleaned up").
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
 * Ports the awk block that extracts `"<Tn>\t<class-or-empty>"` per `### Tn ` heading. The heading
 * regex requires digits immediately followed by a space -- a letter-suffixed task id (`T2a`) is
 * OUT OF SCOPE for this specific checker's heading match (unlike check-dod-delta.ts's TASK_TOKEN),
 * faithfully preserved rather than "improved" on the oracle's own narrower regex.
 */
export function parseTaskRecords(spContent: string): TaskRecord[] {
  const lines = spContent.split(/\r?\n/);
  const records: TaskRecord[] = [];
  for (const line of lines) {
    if (!/^### T[0-9]+ /.test(line)) continue;
    const fields = line.split(/\s+/).filter((x) => x.length > 0);
    const tid = fields[1] ?? "";
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
const ENVELOPE_SHA_RE = /.* @ ([0-9a-fA-F]{7,})[ \t]*$/;

/**
 * TD-123/TD-124: two independent, neither-airtight signals that an UNATTENDED run touched this
 * sprint -- see check-authority.sh's header for the full caveat on what this does and does not
 * prove. `logExists` and `defenced` are the de-fenced log content (empty string if the log is
 * absent or empty); `spContent` is the sprint doc's own frontmatter source.
 */
export function computeModeSignal(logExists: boolean, defenced: string, spContent: string): ModeSignal {
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

// --- per-file evaluation ------------------------------------------------------------------------

export interface SprintFileInput {
  readonly path: string;
  /** null if the file does not exist. */
  readonly content: string | null;
  readonly logExists: boolean;
  /** Raw log content (only meaningful when `logExists`). */
  readonly logContent: string;
}

export function evaluateSprintFile(input: SprintFileInput): string[] {
  const { path: sp, content, logExists, logContent } = input;
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
  if (records.length === 0) {
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
    lines.push(...evaluateSprintFile({ path: sp, content, logExists, logContent }));
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
