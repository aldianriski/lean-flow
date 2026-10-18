// scripts/lib/sprint-members.ts -- shared "who is a member of this sprint, right now" resolution
// (TASK-382, owner ruling A). Run by Bun.
//
// WHY THIS EXISTS. dispatch.md § Members by reference defines ONE rule -- a sprint's members are
// the `## Members` paths UNION every `docs/work/*/TASK-*.md` stamped `sprint: SPRINT-NNN`, in any
// of the six status folders, each `## Members` path resolved BY TASK ID (the filename starting
// `TASK-NNN-`, trailing hyphen so `TASK-81` never matches `TASK-810`) -- and until this task that
// rule lived as private, unexported machinery inside scripts/lib/check-sprint-by-reference.ts
// (~621 lines, exports nothing). Two guards now need the SAME "current members" answer that file
// already computes for its `current` set (check-authority.ts's member-authority cross-check,
// check-task-origin's future store population), and T4 needs it again next -- so this file is the
// one place that answer lives, moved here verbatim rather than re-derived.
//
// WHAT MOVED AND WHAT DID NOT. `resolveId` (the exact by-filename-prefix match) and the pure
// markdown-parsing helpers its `## Members` reading depends on (`section`, `taskIds`,
// `frontmatterField`, `scanBlocks`/`headingName`/`stripComments`, `sprintNumber`) moved here
// unchanged; check-sprint-by-reference.ts now imports them instead of holding its own copies (no
// behaviour change -- verified by `bun evals/run-by-reference-fixtures.ts` reporting the same
// verdict line before and after this move). What did NOT move: the FROZEN/point-in-time logic --
// `plan_commit` resolution, the planned-vs-current diff, scope-change entries, `## Done when`
// comparison, close-mode -- because that is freeze-specific, not "what are the members." This
// file answers only "what is a member of this sprint in the LIVE working tree right now," which is
// all `resolveMembersChecked()` below does.
//
// API (the whole surface a caller needs):
//   resolveMembersChecked(root, sprintFile) -> {members, anomalies} -- id, path, folder, frontmatter for every
//                                                      CURRENT member, live-tree only (no git), PLUS every
//                                                      anomaly the resolver used to drop silently
//                                                      (TD-188): an id matching 2+ files, an id with
//                                                      no file, a task file outside docs/work/<folder>/.
//                                                      Callers print each one as a named FAIL.
//   nowTree(root) / stampedIn(tree, sprintNo) / resolveId(paths, id) -- the building blocks, kept
//                                                      exported so a caller needing raw paths
//                                                      (rather than parsed Member rows) is not
//                                                      forced through resolveMembersChecked().
// Degrades to [] (never throws) when `root` has no docs/work/ store at all -- the shape every
// pre-existing flat authority/task-origin fixture has, so wiring a caller to this module adds zero
// behaviour to any input that predates it.

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { basename, join } from "node:path";

export const WORK = "docs/work";
export const FOLDERS = ["backlog", "todo", "in_progress", "review", "done", "cancel"] as const;
export type Folder = (typeof FOLDERS)[number];

// --- markdown/frontmatter primitives (pure) -----------------------------------------------------

/** CRLF/BOM-normalised, LF-only. */
export function lf(s: string): string {
  return s.replace(/^﻿/, "").replace(/\r\n/g, "\n");
}

/** A frontmatter value: `# comment` tail and surrounding quotes stripped. */
export function frontmatterField(content: string, key: string): string | null {
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

/** Every `key: value` line in the leading `---` frontmatter block, flat -- for callers (like a
 * Member row) that need more than one field and would otherwise re-scan the block per key. */
export function parseFrontmatter(content: string): Record<string, string> {
  const out: Record<string, string> = {};
  const lines = lf(content).split("\n");
  if (lines[0]?.trimEnd() !== "---") return out;
  for (let i = 1; i < lines.length && lines[i]?.trimEnd() !== "---"; i++) {
    const m = lines[i]!.match(/^([A-Za-z][\w-]*):[ \t]*(.*)$/);
    if (!m) continue;
    let v = m[2]!.replace(/\s+#.*$/, "").trim();
    if (/^(["']).*\1$/.test(v)) v = v.slice(1, -1).trim();
    out[m[1]!] = v;
  }
  return out;
}

interface ScanLine {
  line: string;
  hidden: boolean;
}

/** ONE block-structure scan: fenced code and block HTML comments are `hidden`, everything else is
 * a candidate heading/entry line. See check-sprint-by-reference.ts's own copy (pre-move) for the
 * full CommonMark-edge-case rationale; ported verbatim. */
export function scanBlocks(content: string): ScanLine[] {
  const lines = lf(content).split("\n");
  const hidden: boolean[] = new Array(lines.length).fill(false);
  let fenceChar: string | null = null;
  let fenceLen = 0;
  let inComment = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!;
    if (fenceChar !== null) {
      const close = line.match(/^ {0,3}(`{3,}|~{3,})[ \t]*$/);
      if (close && close[1]![0] === fenceChar && close[1]!.length >= fenceLen) {
        fenceChar = null;
        fenceLen = 0;
      }
      hidden[i] = true;
    } else if (inComment) {
      if (line.includes("-->")) inComment = false;
      hidden[i] = true;
    } else {
      const open = line.match(/^ {0,3}(`{3,}|~{3,})(.*)$/);
      if (open && !(open[1]![0] === "`" && open[2]!.includes("`"))) {
        fenceChar = open[1]![0]!;
        fenceLen = open[1]!.length;
        hidden[i] = true;
      } else if (/^ {0,3}<!--/.test(line)) {
        if (!line.includes("-->")) inComment = true;
        hidden[i] = true;
      }
    }
  }
  return lines.map((line, idx) => ({ line, hidden: hidden[idx]! }));
}

/** Every `<!-- ... -->` span blanked to same-length whitespace; an unclosed `<!--` blanks to EOF. */
export function stripComments(text: string): string {
  let s = text.replace(/<!--[\s\S]*?-->/g, (m) => m.replace(/[^\n]/g, " "));
  const i = s.indexOf("<!--");
  if (i !== -1) s = s.slice(0, i) + s.slice(i).replace(/[^\n]/g, " ");
  return s;
}

/** Normalises a level-2 ATX heading line to its comparable name, or null if it isn't one. */
export function headingName(rawLine: string): string | null {
  const m = rawLine.match(/^ {0,3}## (.*)$/);
  if (!m) return null;
  let rest = stripComments(m[1]!);
  rest = rest.replace(/ #+\s*$/, "");
  return rest.replace(/\s+/g, " ").trim();
}

/** Every level-2 section with this heading, concatenated; null when none exists. */
export function section(content: string, heading: string): string | null {
  const out: string[] = [];
  let inside = false;
  let found = false;
  const target = heading.toLowerCase();
  for (const { line, hidden } of scanBlocks(content)) {
    if (!hidden) {
      const name = headingName(line);
      if (name !== null) {
        inside = name.toLowerCase() === target;
        found ||= inside;
        continue;
      }
    }
    if (inside) out.push(line);
  }
  return found ? out.join("\n") : null;
}

/** Every `TASK-NNN` token in a text -- any line shape: bullets, tables, several per line. */
export function taskIds(text: string | null): Set<string> {
  return new Set([...(text ?? "").matchAll(/\bTASK-\d+(?![0-9])/g)].map((m) => m[0]));
}

/** `SPRINT-107`, `107`, `"SPRINT-0107"` -> 107; anything else -> null. */
export function sprintNumber(v: string | null): number | null {
  const m = (v ?? "").match(/^(?:SPRINT-)?0*(\d+)$/i);
  return m ? Number(m[1]) : null;
}

/** Paths among `paths` whose basename is this task id's file (`TASK-NNN-<slug>.md`). Exact id
 * match by trailing hyphen: `TASK-81` never matches `TASK-810`. */
export function resolveId(paths: string[], id: string): string[] {
  return paths.filter((p) => p.startsWith(`${WORK}/`) && basename(p).startsWith(`${id}-`) && p.endsWith(".md"));
}

// --- the live tree (pure I/O, no git) ------------------------------------------------------------

export interface Tree {
  label: string;
  /** Full commit sha for a historical tree; null for the live working tree. Optional/absent is
   * read the same as null -- callers with no notion of "which commit" (this module's own
   * `nowTree`) can omit it. check-sprint-by-reference.ts's `commitTree()` sets it. */
  commit?: string | null;
  paths: string[]; // repo-relative, forward slashes, `docs/work/<folder>/TASK-NNN-*.md`
  read: (p: string) => string | null;
}

/** Every `TASK-*.md` under docs/work/ in the live working tree, walked recursively (a nested subfolder
 * is not a different population -- matches check-sprint-by-reference.ts's commit-tree `ls-tree -r`
 * behaviour). This is the SAME population check-task-origin.sh counts (TD-190); a file that is not at
 * `docs/work/<folder>/TASK-NNN-<slug>.md` is returned here and NAMED by `placementProblem`, never
 * dropped. `[]` when `root` has no docs/work/ store at all. */
export function nowTree(root: string): Tree {
  const paths: string[] = [];
  const workDir = join(root, WORK);
  if (existsSync(workDir)) {
    const walk = (rel: string) => {
      for (const e of readdirSync(join(root, rel), { withFileTypes: true })) {
        if (e.isDirectory()) walk(`${rel}/${e.name}`);
        else if (/^TASK-.*\.md$/.test(e.name)) paths.push(`${rel}/${e.name}`);
      }
    };
    walk(WORK);
  }
  return { label: "now", paths, read: (p) => (existsSync(join(root, p)) ? readFileSync(join(root, p), "utf8") : null) };
}

/** TASK ids in `t` whose file is frontmatter-stamped `sprint: <sprintNo>` (any of the six folders). */
export function stampedIn(t: Tree, sprintNo: number): Set<string> {
  const s = new Set<string>();
  for (const p of t.paths) {
    const c = t.read(p);
    if (c !== null && sprintNumber(frontmatterField(c, "sprint")) === sprintNo) {
      const id = basename(p).match(/^(TASK-\d+)-/)?.[1];
      if (id !== undefined) s.add(id);
    }
  }
  return s;
}

// --- the API ---------------------------------------------------------------------------------

export interface Member {
  readonly id: string; // TASK-NNN
  readonly path: string; // repo-relative, forward slashes
  readonly folder: Folder;
  readonly frontmatter: Record<string, string>;
}

/** Why a task path is not at `docs/work/<folder>/TASK-NNN-<slug>.md`, or null when it is. */
export function placementProblem(p: string): string | null {
  const rel = p.slice(WORK.length + 1).split("/");
  if (rel.length === 1) return "directly in docs/work/";
  const folder = rel[0]!;
  if (!(FOLDERS as readonly string[]).includes(folder)) return `unknown folder '${folder}'`;
  if (rel.length > 2) return `nested ${rel.length - 2} level(s) below docs/work/${folder}/`;
  if (!/^TASK-\d+-.*\.md$/.test(rel[1]!)) return "name is not TASK-NNN-<slug>.md";
  return null;
}

export type MemberAnomalyKind = "member-ambiguous" | "member-missing" | "member-misplaced";

/** One thing the resolver found wrong, with its evidence: `id` is "" for a misplaced file whose name
 * carries no task id; `paths` is every file involved (empty for member-missing). */
export interface MemberAnomaly {
  kind: MemberAnomalyKind;
  id: string;
  paths: string[];
  detail: string;
}

/** The one finding text for an anomaly, shared by every caller (owner ruling, SPRINT-128 T3: each FAILs). */
export function memberAnomalyFinding(a: MemberAnomaly): string {
  if (a.kind === "member-ambiguous") {
    return `member-ambiguous: ${a.id} matches ${a.paths.length} task files (${a.paths.join(", ")}) -- a task id must name exactly one file; remove or rename the duplicate`;
  }
  if (a.kind === "member-missing") {
    return `member-missing: ${a.id} is listed in ## Members or stamped for this sprint but no ${WORK}/<folder>/${a.id}-<slug>.md exists`;
  }
  return `member-misplaced: ${a.paths[0]} is outside ${WORK}/<folder>/TASK-NNN-<slug>.md (${a.detail}) -- move it into one of ${FOLDERS.join(", ")}`;
}

export interface MemberResolution {
  members: Member[];
  anomalies: MemberAnomaly[];
}

/**
 * The sprint's CURRENT members: `## Members` paths (resolved by task id) UNION every task file
 * under any docs/work status folder stamped `sprint: <this sprint's number>`, live-working-tree
 * only (no git history -- that is check-sprint-by-reference.ts's freeze-specific job, not this one).
 *
 * Every id that resolves to anything but one well-placed file is NAMED in `anomalies` (TD-188), never
 * dropped: 2+ files -> member-ambiguous; none -> member-missing; and every task file outside
 * `docs/work/<folder>/TASK-NNN-<slug>.md` -> member-misplaced (store-wide, sprint-listed or not). A
 * misplaced lone file is not a member. `members` is identical to what the silent resolver returned
 * for every clean id. With no docs/work/ store at all both lists are empty (the flat-fixture shape).
 */
export function resolveMembersChecked(root: string, sprintFile: string): MemberResolution {
  const none: MemberResolution = { members: [], anomalies: [] };
  if (!existsSync(sprintFile)) return none;
  const sprintText = readFileSync(sprintFile, "utf8");
  const sprintNo = sprintNumber(frontmatterField(sprintText, "sprint"));
  const tree = nowTree(root);
  if (tree.paths.length === 0) return none;
  const listed = taskIds(section(sprintText, "Members"));
  const stamped = sprintNo !== null ? stampedIn(tree, sprintNo) : new Set<string>();
  const ids = [...new Set([...listed, ...stamped])].sort();
  const members: Member[] = [];
  const anomalies: MemberAnomaly[] = [];
  const misplaced = new Set<string>();
  for (const p of [...tree.paths].sort()) {
    const why = placementProblem(p);
    if (why === null) continue;
    misplaced.add(p);
    anomalies.push({ kind: "member-misplaced", id: basename(p).match(/^(TASK-\d+)-/)?.[1] ?? "", paths: [p], detail: why });
  }
  for (const id of ids) {
    const matches = resolveId(tree.paths, id).sort();
    if (matches.length === 0) {
      anomalies.push({ kind: "member-missing", id, paths: [], detail: "no file" });
      continue;
    }
    if (matches.length > 1) {
      anomalies.push({ kind: "member-ambiguous", id, paths: matches, detail: `${matches.length} files` });
      continue;
    }
    const path = matches[0]!;
    if (misplaced.has(path)) continue;
    const content = tree.read(path);
    if (content === null) continue;
    members.push({ id, path, folder: path.split("/")[2] as Folder, frontmatter: parseFrontmatter(content) });
  }
  return { members, anomalies };
}

// --- the Plan parser (SPRINT-128 T1, TASK-443) -----------------------------------------------------
// ONE reader of a sprint's `## Plan` for both Layers checkers (check-layers-completeness.ts,
// check-layers-observed.ts). Before this, each carried its own `## Plan` extractor, `### Tn` heading
// regex and `Layers:` token extractor, and the copies disagreed on a wrapped line (TD-138): completeness
// FAILed a column-0 continuation, observed dropped it silently. The parser RETURNS that shape as a named
// anomaly; what to do with it is the caller's.
//
// Reads: the `## Plan` section (exact heading, fence/comment-aware via scanBlocks -- a hidden line is
// prose, never a heading or a declaration); `### Tn` headings with an optional letter suffix (`T3a`);
// per block the `Layers:` / `Cites:` / `Depends-on:` declarations with their indented continuation lines.
// A `### ` heading that is not task-shaped (and any text before the first heading) yields a block with
// tid "" -- callers that only want tasks filter on `tid !== ""`.

export type PlanDecl = "Layers" | "Cites" | "Depends-on";

export interface PlanLine {
  n: number; // 1-based line in the whole file
  tag: PlanDecl | "P"; // P = prose (anything that is not part of a declaration)
  text: string; // a declaration line: the value after its key / the continuation, left-trimmed
}

/** A column-0 line that STARTS with a backtick directly after a declaration line (not indented). Named,
 * never dropped: whether it is a wrapped declaration or prose is a guess, so the caller reports it. */
export interface PlanAnomaly {
  kind: "column-0-continuation";
  decl: PlanDecl;
  line: number;
  text: string;
}

export interface PlanBlock {
  tid: string; // "T3", "T3a"; "" for text before the first heading or under a non-task `###`
  heading: string; // the `### ` line verbatim ("" before the first heading)
  /** The tid of the nearest `### Tn` at or above this block: `tid` for a task block, the PRECEDING task for a
   * non-task `###` block (e.g. `### Notes`), "" before any task. Observed attributes a Layers: under a
   * non-task heading to this task (its old behaviour); completeness drops the block (tid ""). */
  carry: string;
  line: number; // 1-based line of the heading (the first Plan line for the preamble)
  lines: PlanLine[]; // every line after the heading, classified
  /** backtick-delimited Layers: tokens, in order, not deduped; directory tokens keep their `/`. */
  layers: string[];
  cites: {
    /** backtick-delimited tokens */
    tokens: string[];
    /** every `TASK-NNN` the declaration names */
    all: string[];
    /** the run of `TASK-NNN` ids that OPENS the declaration, before its first non-TASK token */
    lead: string[];
    /** every `Tn` the declaration names (the Cites: escape for a prose-referenced task) */
    tids: string[];
  };
  dependsOn: string[]; // `Tn` / `TASK-NNN` ids named on Depends-on:
  /** each declaration's joined value text (continuations included), "" when absent */
  text: Record<PlanDecl, string>;
  anomalies: PlanAnomaly[];
}

export interface ParsedPlan {
  found: boolean; // a `## Plan` section exists
  lines: string[]; // the section body, heading excluded (fenced/commented lines included)
  blocks: PlanBlock[];
  anomalies: PlanAnomaly[]; // every block's, in file order
}

const PLAN_TASK_HEADING = /^### (T[0-9]+[a-z]?)\b/;
const PLAN_DECL_KEY = /^(Layers|Depends-on|Cites):[ \t]*/;

function backtickTokens(text: string): string[] {
  const out: string[] = [];
  for (const line of text.split("\n")) for (const m of line.match(/`[^`]+`/g) ?? []) out.push(m.slice(1, -1));
  return out;
}

/** The `TASK-NNN` ids at the START of a Cites value, skipping separators; stops at the first other token. */
function leadTaskIds(text: string): string[] {
  const out: string[] = [];
  let rest = text;
  for (;;) {
    const m = /^(?:[\s,;·•|&+`]|\band\b)*(TASK-[0-9]+)(?![0-9])/.exec(rest);
    if (!m) break;
    out.push(m[1]!);
    rest = rest.slice(m[0].length);
  }
  return out;
}

/** The one finding text for a column-0 anomaly, shared by both checkers. It errs LOUD (owner ruling,
 * SPRINT-128 T1): a backtick-led column-0 line right after a declaration is either a wrapped declaration
 * (silently dropping its paths was TD-138) or prose, and the parser cannot tell which -- so the author fixes it. */
export function anomalyFinding(a: PlanAnomaly): string {
  return `declaration continuation: column-0 line ${a.line} after the ${a.decl}: declaration -- indent it to continue the declaration, or separate it with a blank line if it is prose`;
}

export function parsePlan(content: string): ParsedPlan {
  const body: { n: number; line: string; hidden: boolean }[] = [];
  let inside = false;
  let found = false;
  scanBlocks(content).forEach(({ line, hidden }, i) => {
    if (!hidden) {
      const name = headingName(line);
      if (name !== null) {
        inside = name === "Plan";
        found ||= inside;
        return;
      }
    }
    if (inside) body.push({ n: i + 1, line, hidden });
  });

  const blocks: PlanBlock[] = [];
  const open = (tid: string, heading: string, line: number): PlanBlock => {
    const b: PlanBlock = {
      tid, heading, line, carry: tid !== "" ? tid : (blocks[blocks.length - 1]?.carry ?? ""), lines: [], layers: [],
      cites: { tokens: [], all: [], lead: [], tids: [] },
      dependsOn: [], text: { Layers: "", Cites: "", "Depends-on": "" }, anomalies: [],
    };
    blocks.push(b);
    return b;
  };
  let cur = open("", "", body[0]?.n ?? 0);
  let decl: PlanDecl | null = null;
  for (const { n, line, hidden } of body) {
    if (!hidden && line.startsWith("### ")) {
      cur = open(PLAN_TASK_HEADING.exec(line)?.[1] ?? "", line, n);
      decl = null;
      continue;
    }
    const key = hidden ? null : PLAN_DECL_KEY.exec(line);
    if (key) {
      decl = key[1] as PlanDecl;
      cur.lines.push({ n, tag: decl, text: line.slice(key[0].length) });
    } else if (!hidden && decl !== null && /^[ \t]+[^ \t]/.test(line)) {
      cur.lines.push({ n, tag: decl, text: line.replace(/^[ \t]+/, "") });
    } else if (!hidden && decl !== null && line.startsWith("`")) {
      cur.anomalies.push({ kind: "column-0-continuation", decl, line: n, text: line });
      cur.lines.push({ n, tag: "P", text: line });
      decl = null;
    } else {
      cur.lines.push({ n, tag: "P", text: line });
      decl = null;
    }
  }

  for (const b of blocks) {
    for (const k of ["Layers", "Cites", "Depends-on"] as const) {
      b.text[k] = b.lines.filter((l) => l.tag === k).map((l) => l.text).join(" ");
    }
    b.layers = backtickTokens(b.lines.filter((l) => l.tag === "Layers").map((l) => l.text).join("\n"));
    const c = b.lines.filter((l) => l.tag === "Cites").map((l) => l.text).join("\n");
    b.cites = {
      tokens: backtickTokens(c),
      all: c.match(/\bTASK-[0-9]+(?![0-9])/g) ?? [],
      lead: leadTaskIds(c.replace(/\n/g, " ")),
      tids: b.text.Cites.match(/\bT[0-9]+\b/g) ?? [],
    };
    b.dependsOn = b.text["Depends-on"].match(/\b(?:T[0-9]+|TASK-[0-9]+)\b/g) ?? [];
  }
  return { found, lines: body.map((b) => b.line), blocks, anomalies: blocks.flatMap((b) => b.anomalies) };
}
