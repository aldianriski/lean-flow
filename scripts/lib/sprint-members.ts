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
// all `resolveMembers()` below does.
//
// API (the whole surface a caller needs):
//   resolveMembers(root, sprintFile) -> Member[]   -- id, path, folder, frontmatter, for every
//                                                      CURRENT member, live-tree only (no git).
//   nowTree(root) / stampedIn(tree, sprintNo) / resolveId(paths, id) -- the building blocks, kept
//                                                      exported so a caller needing raw paths
//                                                      (rather than parsed Member rows) is not
//                                                      forced through resolveMembers().
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

/** Every `docs/work/<folder>/TASK-NNN-*.md` in the live working tree, all six status folders,
 * walked recursively (a nested subfolder is not a different population -- matches
 * check-sprint-by-reference.ts's commit-tree `ls-tree -r` behaviour). `[]` when `root` has no
 * docs/work/ store at all. */
export function nowTree(root: string): Tree {
  const paths: string[] = [];
  const workDir = join(root, WORK);
  if (existsSync(workDir)) {
    const walk = (rel: string) => {
      for (const e of readdirSync(join(root, rel), { withFileTypes: true })) {
        if (e.isDirectory()) walk(`${rel}/${e.name}`);
        else if (/^TASK-\d+-.*\.md$/.test(e.name)) paths.push(`${rel}/${e.name}`);
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
      s.add(basename(p).match(/^(TASK-\d+)-/)![1]!);
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

/**
 * The sprint's CURRENT members: `## Members` paths (resolved by task id) UNION every task file
 * under any docs/work status folder stamped `sprint: <this sprint's number>`, live-working-tree
 * only (no git history -- that is check-sprint-by-reference.ts's freeze-specific job, not this one).
 *
 * An id that resolves to zero or more-than-one file is left OUT (ambiguous/missing resolution is
 * a finding for the checker doing the resolving to report, e.g. check-sprint-by-reference.ts's own
 * MEMBER-MISSING -- this module only ever returns unambiguous rows).
 */
export function resolveMembers(root: string, sprintFile: string): Member[] {
  if (!existsSync(sprintFile)) return [];
  const sprintText = readFileSync(sprintFile, "utf8");
  const sprintNo = sprintNumber(frontmatterField(sprintText, "sprint"));
  const tree = nowTree(root);
  if (tree.paths.length === 0) return [];
  const listed = taskIds(section(sprintText, "Members"));
  const stamped = sprintNo !== null ? stampedIn(tree, sprintNo) : new Set<string>();
  const ids = [...new Set([...listed, ...stamped])].sort();
  const members: Member[] = [];
  for (const id of ids) {
    const matches = resolveId(tree.paths, id);
    if (matches.length !== 1) continue;
    const path = matches[0]!;
    const content = tree.read(path);
    if (content === null) continue;
    const folder = path.split("/")[2] as Folder;
    members.push({ id, path, folder, frontmatter: parseFrontmatter(content) });
  }
  return members;
}
