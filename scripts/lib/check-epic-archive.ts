// scripts/lib/check-epic-archive.ts -- TASK-355 port of scripts/lib/check-epic-archive.sh to
// TypeScript run by Bun (removes ~20 subprocess launches/invocation; see docs/research/
// qa-gate-timing.md). scripts/lib/check-epic-archive.sh REMAINS the live oracle -- this file must
// match it byte-for-byte on stdout and exit code for every fixture and every real epic in this repo
// (differential parity harness: evals/epic-archive-differential.test.ts). Bug-for-bug compatibility
// is the requirement; do not "improve" on a shell quirk found during the port.
//
// Enforces STANDARD Sec.11's epic retention row in BOTH directions (SPRINT-055 T2, TASK-167), plus
// the epic-state rollup-currency widening (SPRINT-094 T1, TASK-324). See the .sh file's own header
// for the full narrative history (member-id parsing, foreign-repo collisions, selection-axis fixtures
// -- TD-144, L-166, L-186). This file ports the LOGIC; the .sh file's prose comments are the record of
// why each branch exists and are not duplicated here line for line.
//
// VERIFIED SINGLE-ROOT (matching the .sh CLI contract exactly): reads argv[2] only. A second
// argument is silently ignored, exactly as the shell's `root=${1:?...}` ignores $2 onward. This port
// deliberately does NOT add a multi-root mode.
//
// VERIFIED NO `test -ef` USAGE: unlike scripts/lib/archive-path.sh (sourced by other checkers for a
// filesystem-identity archive predicate), this checker never sources that file and never calls
// `-ef` -- it matches "archived" purely by which HARD-CODED directory a glob is run against
// (docs/epic/archive/ vs docs/epic/, docs/sprint/archive/ vs docs/sprint/), never by comparing an
// arbitrary caller-supplied path's spelling against a sibling "archive" directory. Grepped the .sh
// source to confirm before porting (`grep -n -- '-ef' scripts/lib/check-epic-archive.sh` -- no hits,
// `grep -n '^\. ' -- no hits either): there is no filesystem-identity predicate in this checker to
// replicate. Ported as literal directory globs.

import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";

// --- small helpers -------------------------------------------------------------------------------

/** Splits on line endings the way awk's record reading does: a file properly terminated by a final
 * newline has NO phantom trailing empty record for "what comes after the last \n" -- JS's plain
 * `.split(/\r?\n/)` produces one, and letting it through corrupted ticked_unattributed's EOF-flush
 * arm (an open ticked block absorbed a fake trailing blank-line append -- caught by the differential
 * parity harness against evals/fixtures/epic-state/s-tick-at-eof, the exact real-corpus shape
 * scripts/lib/check-epic-archive.sh's own header calls out: "every real epic's last condition is
 * read by END{} alone"). An UNterminated last line (no trailing \n) is still a real record in awk and
 * is kept. */
function splitLines(content: string): string[] {
  const lines = content.split(/\r?\n/);
  if (lines.length > 0 && lines[lines.length - 1] === "") lines.pop();
  return lines;
}

const fileCache = new Map<string, string>();

function readFileCached(p: string): string {
  const cached = fileCache.get(p);
  if (cached !== undefined) return cached;
  let content = "";
  try {
    content = readFileSync(p, "utf8");
  } catch {
    content = "";
  }
  fileCache.set(p, content);
  return content;
}

/** Ports fmv() -- frontmatter value for <key>, first block only, first match wins. */
export function frontmatterValue(content: string, key: string): string {
  const lines = splitLines(content);
  if (lines[0] !== "---") return "";
  const re = new RegExp(`^${key}:[ ]*(.*)$`);
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]!;
    if (line === "---") return "";
    const m = re.exec(line);
    if (m) return m[1]!;
  }
  return "";
}

/** Lines within a `## <headingPrefix>` section, up to the next `## ` heading or EOF. Ports the
 * shared awk shape used by open_conditions/total_conditions. */
function sectionLines(content: string, headingPrefix: string): string[] {
  const lines = splitLines(content);
  const out: string[] = [];
  let inSection = false;
  for (const line of lines) {
    if (!inSection) {
      if (line.startsWith(headingPrefix)) inSection = true;
      continue;
    }
    if (line.startsWith("## ")) break;
    out.push(line);
  }
  return out;
}

/** Unticked "- [ ]" lines under "## Closed when". */
export function openConditions(content: string): number {
  return sectionLines(content, "## Closed when").filter((l) => l.startsWith("- [ ]")).length;
}

/** Every "- [ ]"/"- [x]" line under "## Closed when" (lowercase x only, matching the .sh char class). */
export function totalConditions(content: string): number {
  return sectionLines(content, "## Closed when").filter((l) => /^- \[[ x]\]/.test(l)).length;
}

/** Directory listing filtered by regex, sorted -- glob-equivalent with a graceful missing-dir degrade
 * (a shell glob against a nonexistent dir just fails to expand, which reads as "no match" once the
 * `[ -f ]` test runs). Returns full "<dir>/<name>" paths, joined with "/" (never path.join) so output
 * text matches the shell's plain string concatenation regardless of host path-separator conventions. */
function globSorted(dir: string, re: RegExp): string[] {
  let names: string[];
  try {
    names = readdirSync(dir);
  } catch {
    return [];
  }
  return names
    .filter((n) => re.test(n))
    .sort()
    .map((n) => `${dir}/${n}`);
}

function relPath(root: string, abs: string): string {
  const prefix = `${root}/`;
  return abs.startsWith(prefix) ? abs.slice(prefix.length) : abs;
}

// --- member_sprints parsing (ports _member_entries) -----------------------------------------------

export interface MemberEntry {
  /** "local", a foreign qualifier (e.g. "workdoo"), or "unparsed". */
  readonly scope: string;
  /** The sprint number for local/foreign; the whitespace-collapsed raw text for "unparsed". */
  readonly value: string;
}

export function parseMemberEntries(content: string): MemberEntry[] {
  const lines = splitLines(content);
  const line = lines.find((l) => l.startsWith("member_sprints:"));
  if (line === undefined) return [];

  let rest = line.replace(/^member_sprints:[ \t]*/, "");
  rest = rest.replace(/[[\]]/g, "");
  const rawEntries = rest.split(",");
  const out: MemberEntry[] = [];

  for (const rawEntry of rawEntries) {
    let entry = rawEntry.replace(/^[ \t]+|[ \t]+$/g, "");
    if (entry === "") continue; // an entry that was ALREADY empty (e.g. a stray comma) is dropped silently

    const raw = entry; // what the FILE says, before parenthetical stripping
    entry = entry.replace(/\([^)]*\)/g, "");
    entry = entry.replace(/^[ \t]+|[ \t]+$/g, "");
    if (entry === "") {
      // Emptied only by stripping parens -- e.g. "[(closed), (active)]" -- is reported, not dropped.
      out.push({ scope: "unparsed", value: raw.replace(/[ \t]+/g, "_") });
      continue;
    }

    const tokens = entry.split(/[ \t]+/).filter((t) => t.length > 0);
    let num = "";
    let qual = "";
    for (const rawTok of tokens) {
      const tok = rawTok.replace(/^[Ss][Pp][Rr][Ii][Nn][Tt]-/, "");
      if (/^[0-9]+$/.test(tok)) {
        num = tok;
        break;
      }
      qual = qual === "" ? tok : `${qual}-${tok}`;
    }
    if (num !== "") {
      out.push({ scope: qual === "" ? "local" : qual, value: num });
      continue;
    }
    // No digit token anywhere in this entry.
    out.push({ scope: "unparsed", value: entry.replace(/[ \t]+/g, "_") });
  }
  return out;
}

// --- member resolution (ports _members_scan / open_members / unknown_members) ---------------------

function membersScan(root: string, content: string, want: "open" | "unknown"): string[] {
  const out: string[] = [];
  for (const e of parseMemberEntries(content)) {
    if (e.scope !== "local") continue;
    const num = e.value;
    const archiveMatches = globSorted(`${root}/docs/sprint/archive`, new RegExp(`^SPRINT-${num}-.*\\.md$`));
    let found = archiveMatches.length > 0;
    let closed = found;
    if (!closed) {
      const liveMatches = globSorted(`${root}/docs/sprint`, new RegExp(`^SPRINT-${num}-.*\\.md$`));
      if (liveMatches.length > 0) {
        found = true;
        closed = liveMatches.some((f) => frontmatterValue(readFileCached(f), "status") === "closed");
      }
    }
    if (want === "open" && found && !closed) out.push(num);
    if (want === "unknown" && !found) out.push(num);
  }
  return out;
}

export function openMembers(root: string, content: string): string[] {
  return membersScan(root, content, "open");
}
export function unknownMembers(root: string, content: string): string[] {
  return membersScan(root, content, "unknown");
}

/** Foreign entries + unparsed entries + unresolvable local entries -- ports unverified_count(). */
export function unverifiedCount(root: string, content: string): number {
  const nonLocal = parseMemberEntries(content).filter((e) => e.scope !== "local").length;
  return nonLocal + unknownMembers(root, content).length;
}

// --- report_unresolvable --------------------------------------------------------------------------

function reportUnresolvable(root: string, content: string, rel: string, note: (m: string) => void): void {
  for (const e of parseMemberEntries(content)) {
    if (e.scope === "local") continue;
    if (e.scope === "unparsed") {
      note(
        `epic-archive: ${rel} has a member_sprints entry naming no sprint number -- entry, whitespace collapsed: '${e.value}'. It selects NO member, so nothing was verified for it; §11's member half cannot be read from this entry at all`,
      );
      continue;
    }
    const num = e.value;
    let hit = "";
    const archiveMatches = globSorted(`${root}/docs/sprint/archive`, new RegExp(`^SPRINT-${num}-.*\\.md$`));
    if (archiveMatches.length > 0) {
      hit = relPath(root, archiveMatches[0]!);
    } else {
      const liveMatches = globSorted(`${root}/docs/sprint`, new RegExp(`^SPRINT-${num}-.*\\.md$`));
      if (liveMatches.length > 0) hit = relPath(root, liveMatches[0]!);
    }
    if (hit !== "") {
      note(
        `epic-archive: ${rel} member ${e.scope} SPRINT-${num} lives outside this repository, and this repository ALSO has a same-numbered Plan at ${hit}. That local Plan is a different sprint and was deliberately NOT used to verify this row (TD-144). If the qualifier is wrong and the member is local, this row is going unverified -- check it`,
      );
    } else {
      note(
        `epic-archive: ${rel} member ${e.scope} SPRINT-${num} lives outside this repository -- its rollup row cannot be verified here, and §11's archival trigger cannot be read for it. Keeping the row current is a manual obligation at that sprint's close (ADR-041)`,
      );
    }
  }
  for (const u of unknownMembers(root, content)) {
    note(
      `epic-archive: ${rel} member SPRINT-${u} names no Plan anywhere in this repository -- neither docs/sprint/ nor docs/sprint/archive/ has it, so its state is unread rather than passed`,
    );
  }
}

// --- epic-state helpers (member_status_cell / closed_members / ticked_unattributed) ---------------

/** Status cell (3rd column) of the "## Member sprints" row whose id cell names SPRINT-<num>. */
export function memberStatusCell(content: string, num: string): string {
  const lines = splitLines(content);
  let inSection = false;
  const idRe = new RegExp(`SPRINT-0*${num}([^0-9]|$)`);
  for (const line of lines) {
    if (!inSection) {
      if (line.startsWith("## Member sprints")) inSection = true;
      continue;
    }
    if (line.startsWith("## ")) break;
    if (!line.startsWith("|")) continue;
    const cells = line.split("|");
    if (cells.length < 4) continue;
    const id = cells[1]!.replace(/^[ \t]+|[ \t]+$/g, "");
    if (idRe.test(id)) return cells[3]!.replace(/^[ \t]+|[ \t]+$/g, "");
  }
  return "";
}

/**
 * Mimics `read -r a b c` word-splitting on a `printf '%s %s %s\n'`-built line: runs of whitespace
 * collapse, so a BLANK middle field (e.g. num="930", lastUpdated="", closeCommit="ccc111") produces
 * the raw line "930  ccc111", which reads back as a=930, b=ccc111, c="" -- the close_commit silently
 * shifts into the "last_updated" slot. This is a real quirk of the .sh oracle (closed_members()'s
 * printf output, read back via `while read -r num mlu mcc`) and must reproduce identically for
 * bug-for-bug parity: a naive 3-field split would NOT reproduce this shift.
 */
function readShellFields3(line: string): [string, string, string] {
  let s = line.replace(/^[ \t]+/, "");
  const m1 = /^(\S+)[ \t]*/.exec(s);
  if (!m1) return ["", "", ""];
  const f1 = m1[1]!;
  s = s.slice(m1[0].length);
  const m2 = /^(\S+)[ \t]*/.exec(s);
  if (!m2) return [f1, "", ""];
  const f2 = m2[1]!;
  s = s.slice(m2[0].length);
  return [f1, f2, s];
}

/** "<num> <last_updated> <close_commit>" per CLOSED local member -- ports closed_members(). Returns
 * the raw printf-shaped lines (not parsed fields) so callers can replicate the read-collapse quirk
 * above exactly as the .sh oracle's two different consumers (a `while read`, and an `awk NF>=2`) do. */
export function closedMemberLines(root: string, content: string): string[] {
  const lines: string[] = [];
  for (const e of parseMemberEntries(content)) {
    if (e.scope !== "local") continue;
    const num = e.value;
    const re = new RegExp(`^SPRINT-${num}-.*\\.md$`);
    let file: string | null = null;
    let archived = false;
    const archiveMatches = globSorted(`${root}/docs/sprint/archive`, re);
    if (archiveMatches.length > 0) {
      file = archiveMatches[0]!;
      archived = true;
    }
    if (!file) {
      const liveMatches = globSorted(`${root}/docs/sprint`, re);
      if (liveMatches.length > 0) file = liveMatches[0]!;
    }
    if (!file) continue;
    if (!archived) {
      if (frontmatterValue(readFileCached(file), "status") !== "closed") continue;
    }
    const c = readFileCached(file);
    lines.push(`${num} ${frontmatterValue(c, "last_updated")} ${frontmatterValue(c, "close_commit")}`);
  }
  return lines;
}

/** Ticked "## Closed when" blocks (checkbox line + continuation lines up to the next checkbox/heading/
 * EOF) that name no member sprint number from `membersStr` -- ports ticked_unattributed(). Fenced code
 * and HTML comments are skipped for parsing, but -- faithfully reproducing the .sh rule ordering -- a
 * literal "## " line ends the section EVEN while inside a fence, because the .sh's heading-exit rule
 * is checked before its fence-toggle rule on every line. */
export function tickedUnattributed(content: string, membersStr: string): string[] {
  const members = membersStr.trim() === "" ? [] : membersStr.trim().split(/\s+/);
  const memberRes = members.map((m) => new RegExp(`SPRINT-0*${m}([^0-9]|$)`));
  const attributed = (blk: string) => memberRes.some((re) => re.test(blk));

  const out: string[] = [];
  let f = false;
  let fence = false;
  let open = false;
  let blk = "";
  const flush = () => {
    if (open && !attributed(blk)) {
      out.push(blk.slice(0, 72).split("|").join("/"));
    }
    open = false;
    blk = "";
  };

  for (const line of splitLines(content)) {
    if (!f) {
      if (line.startsWith("## Closed when")) {
        f = true;
        fence = false;
      }
      continue;
    }
    if (line.startsWith("## ")) {
      flush();
      break;
    }
    if (/^[ \t]*```/.test(line)) {
      fence = !fence;
      continue;
    }
    if (fence) continue;
    if (/^[ \t]*<!--/.test(line)) continue;
    if (line.startsWith("- [x]")) {
      flush();
      open = true;
      blk = line;
      continue;
    }
    if (line.startsWith("- [ ]")) {
      flush();
      continue;
    }
    if (open) blk = `${blk} ${line}`;
  }
  flush(); // EOF without a trailing "## " heading -- ports END{flush()}
  return out;
}

// --- main check ------------------------------------------------------------------------------------

export interface CheckResult {
  readonly lines: string[];
  readonly exitCode: number;
}

export function checkEpicArchive(root: string): CheckResult {
  const lines: string[] = [];
  let fail = 0;
  let checked = 0;
  const ok = (m: string) => lines.push(`PASS  ${m}`);
  const bad = (m: string) => {
    fail = 1;
    lines.push(`FAIL  ${m}`);
  };
  const note = (m: string) => lines.push(`NOTE  ${m}`);

  // --- direction (a): epics already under archive/ must have earned it ---------------------------
  const archivedEpics = globSorted(`${root}/docs/epic/archive`, /^EPIC-.*\.md$/);
  for (const e of archivedEpics) {
    checked++;
    const rel = relPath(root, e);
    const content = readFileCached(e);
    const st = frontmatterValue(content, "status");
    const opn = openConditions(content);
    const tot = totalConditions(content);
    if (tot === 0) {
      bad(`epic-archive: ${rel} archived with no § Closed when conditions at all -- nothing could have been verified`);
    } else if (st !== "closed") {
      bad(`epic-archive: ${rel} archived while status is '${st}', not 'closed'`);
    } else if (opn !== 0) {
      bad(
        `epic-archive: ${rel} archived with ${opn} § Closed when condition(s) still open -- an epic whose exit conditions are unmet is unfinished, and archiving it hides that`,
      );
    } else {
      const om = openMembers(root, content);
      if (om.length > 0) {
        bad(
          `epic-archive: ${rel} archived while member sprint(s) ${om.join(" ")} are still open -- §11 makes this a TWO-PART test and is explicit that an epic is never archived on member-sprint count alone. An epic whose sprints are unfinished is unfinished, and archiving it hides that`,
        );
      } else {
        const unv = unverifiedCount(root, content);
        if (unv > 0) {
          ok(
            `epic-archive: ${rel} archived with ${tot} condition(s) all met and status closed, and every LOCAL member sprint closed -- but ${unv} member(s) could not be resolved against this repository (see NOTE), so §11's member half was NOT verified for them`,
          );
        } else {
          ok(`epic-archive: ${rel} archived correctly (${tot} condition(s), all met, status closed, every member sprint closed)`);
        }
      }
    }
    reportUnresolvable(root, content, rel, note);
  }

  // --- direction (b): live epics that already meet every condition must not linger ---------------
  const liveEpics = globSorted(`${root}/docs/epic`, /^EPIC-.*\.md$/);
  for (const e of liveEpics) {
    checked++;
    const rel = relPath(root, e);
    const content = readFileCached(e);
    const st = frontmatterValue(content, "status");
    const opn = openConditions(content);
    const tot = totalConditions(content);
    const omem = openMembers(root, content);
    if (st === "closed" && tot > 0 && opn === 0 && omem.length === 0) {
      const unv = unverifiedCount(root, content);
      const frn = parseMemberEntries(content).filter((x) => x.scope !== "local" && x.scope !== "unparsed").length;
      if (frn > 0) {
        ok(
          `epic-archive: ${rel} is closed with every § Closed when condition met and every LOCAL member sprint closed, but ${unv} member(s) could not be resolved against this repository (see NOTE) -- §11's move is not demanded on a member half that cannot be verified from here, so this is reported rather than required`,
        );
      } else {
        bad(
          `epic-archive: ${rel} is closed with every § Closed when condition met and every member sprint closed, but still sits in docs/epic/ -- §11 says move it to docs/epic/archive/ and keep its INDEX.md row`,
        );
      }
    } else if (st === "closed" && tot > 0 && opn === 0) {
      ok(
        `epic-archive: ${rel} correctly NOT yet archived -- status closed and all ${tot} condition(s) met, but member sprint(s) ${omem.join(" ")} are still open. §11's trigger is a two-part test and the second half has not fired`,
      );
    } else {
      ok(`epic-archive: ${rel} correctly live (status '${st}', ${opn} of ${tot} condition(s) open)`);
    }
    reportUnresolvable(root, content, rel, note);
  }

  // --- direction (c): an ACTIVE epic must not drift out of date with its own members --------------
  for (const e of liveEpics) {
    const content = readFileCached(e);
    if (frontmatterValue(content, "status") !== "active") continue;
    const rel = relPath(root, e);
    const cmem = closedMemberLines(root, content);
    const allmem = parseMemberEntries(content)
      .filter((x) => x.scope !== "unparsed")
      .map((x) => x.value)
      .join(" ");
    let drift = 0;

    for (const line of cmem) {
      const [num, , mcc] = readShellFields3(line);
      if (num === "") continue;
      const cell = memberStatusCell(content, num);
      if (cell === "") {
        bad(
          `epic-state: ${rel} SPRINT-${num} is closed but has NO row in § Member sprints -- the rollup this table exists for never happened, so epic status is reconstructable only by reading the sprint archive`,
        );
        drift = 1;
      } else if (!/`[0-9a-f]{7,40}`/.test(cell)) {
        bad(
          `epic-state: ${rel} SPRINT-${num}'s § Member sprints Status cell carries no close_commit -- reads '${cell}'. EPIC.md.template states the cell as 'closed · \`<close_commit>\`', so this row cannot be traced to the commit that closed it`,
        );
        drift = 1;
      } else if (mcc !== "" && !cell.includes(mcc)) {
        bad(
          `epic-state: ${rel} SPRINT-${num}'s § Member sprints Status cell names a close_commit that is not the sprint's own -- cell reads '${cell}', SPRINT-${num}'s frontmatter says close_commit: ${mcc}. A row carrying a hex-shaped token that belongs to a different commit is traceable to the wrong place, which is worse than untraceable`,
        );
        drift = 1;
      }
    }

    const newestCandidates = cmem
      .map((l) => readShellFields3(l)[1])
      .filter((v) => v !== "")
      .sort();
    const newest = newestCandidates.length > 0 ? newestCandidates[newestCandidates.length - 1]! : "";
    const elu = frontmatterValue(content, "last_updated");
    if (newest !== "" && elu !== "" && elu < newest) {
      bad(
        `epic-state: ${rel} last_updated is ${elu} but its newest closed member sprint closed ${newest} -- its own update_trigger (a member sprint closes) fired and the header did not follow`,
      );
      drift = 1;
    }

    for (const u of tickedUnattributed(content, allmem)) {
      bad(
        `epic-state: ${rel} has a ticked § Closed-when condition naming no member sprint -- "${u}...". A tick with no member SPRINT-NNN behind it says something is done but not what did it, so its evidence cannot be found`,
      );
      drift = 1;
    }

    if (drift === 0) {
      const unv = unverifiedCount(root, content);
      if (unv > 0) {
        ok(
          `epic-state: ${rel} rollup current for every LOCAL member -- but ${unv} member(s) could not be resolved against this repository (see NOTE) and their rows were not checked at all`,
        );
      } else {
        ok(
          `epic-state: ${rel} rollup current (every closed member rolled up with its own close_commit, header tracks its newest member close, every ticked condition attributed to a member)`,
        );
      }
    }
  }

  if (checked === 0) lines.push(`      epic-archive: skip (no epics under docs/epic/)`);
  return { lines, exitCode: fail };
}

// --- CLI -------------------------------------------------------------------------------------------

if (import.meta.main) {
  const root = process.argv[2];
  if (!root) {
    console.error("usage: bun scripts/lib/check-epic-archive.ts <repo-root>");
    process.exit(2);
  }
  if (!existsSync(root) || !statSync(root).isDirectory()) {
    console.log(`FAIL  epic-archive: repo root not found at ${root}`);
    process.exit(2);
  }
  const { lines, exitCode } = checkEpicArchive(root);
  for (const l of lines) console.log(l);
  process.exit(exitCode);
}
