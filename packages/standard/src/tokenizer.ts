// A hand-written block tokenizer over spec/STANDARD.md's Markdown.
//
// Domain layer (V3 §2.1). This module imports nothing: no Bun, no filesystem, no Markdown library.
// ADR-035 fixes the workspace at zero dependencies, and there is no Markdown package to reach for --
// this is the tokenizer the Standard's own consumers (`scripts/lib/read-spec-rules.sh`, and now this
// package) rely on to tell a heading from a table from a fence.
//
// Models ONLY the four constructs the Standard uses -- ATX headings, pipe tables, fenced code,
// paragraphs -- each carrying a SourceLocation. Deliberately UNMODELLED (EPIC-014 scope, SPRINT-085
// Out-of-scope): nested lists, blockquotes, setext headings, inline emphasis, lazy continuation.
// Content that uses one of those constructs is not misparsed -- it falls through to `paragraph`,
// which is a safe, inert bucket for text this tokenizer has no opinion about.
//
// Fenced code is a hard boundary (SPRINT-085 T1 hard constraint 5): once a fence opens, every line up
// to its closing fence (or EOF) is fence CONTENT, never re-scanned for headings or tables. The
// Standard contains fenced examples that look like the very constructs this tokenizer parses (a YAML
// frontmatter block, worked trailer examples) -- and misparsing one would poison the block tree with
// a heading or table that is only ever an example.

export interface SourceLocation {
  readonly file: string;
  readonly line: number; // 1-indexed
}

export interface HeadingBlock {
  readonly type: "heading";
  readonly depth: number; // 1..6, the number of '#' markers
  readonly text: string; // trimmed text after the marker
  readonly loc: SourceLocation;
}

export interface TableRow {
  readonly cells: readonly string[]; // trimmed cell text, outer pipes stripped
  readonly loc: SourceLocation;
}

export interface TableBlock {
  readonly type: "table";
  readonly header: TableRow;
  readonly align: readonly string[]; // the delimiter row's cells, e.g. "---", ":---", "---:"
  readonly rows: readonly TableRow[]; // body rows -- excludes the header and the delimiter row
  readonly loc: SourceLocation; // the header row's location
}

export interface FenceBlock {
  readonly type: "fence";
  readonly lang: string; // the info string after the opening ``` -- "" if none
  readonly content: readonly string[]; // raw lines between the fences, unparsed
  readonly closed: boolean; // false if EOF was reached before a closing fence
  readonly loc: SourceLocation; // the opening fence's location
}

export interface ParagraphBlock {
  readonly type: "paragraph";
  readonly text: string; // the contiguous plain lines, joined with "\n"
  readonly loc: SourceLocation; // the first line's location
}

export type Block = HeadingBlock | TableBlock | FenceBlock | ParagraphBlock;

export interface BlockDocument {
  readonly blocks: readonly Block[];
}

const HEADING_RE = /^(#{1,6})\s+(\S.*)$/;
const FENCE_OPEN_RE = /^```(\S*)\s*$/;
const FENCE_CLOSE_RE = /^```\s*$/;

/** Strips a leading/trailing pipe, then splits on "|". Each cell comes back trimmed. */
function splitRow(line: string): string[] {
  let s = line.trim();
  if (s.startsWith("|")) s = s.slice(1);
  if (s.endsWith("|")) s = s.slice(0, -1);
  return s.split("|").map((c) => c.trim());
}

/**
 * A pipe-table delimiter row: cells of only `-`, optionally flanked by `:`. Requires the RAW line to
 * contain a pipe -- a bare `---` thematic break (the Standard uses 19 of them as section dividers)
 * has no pipe and must never be read as a one-column table delimiter.
 */
function isDelimiterRow(line: string): boolean {
  if (!line.includes("|")) return false;
  const cells = splitRow(line);
  if (cells.length === 0) return false;
  return cells.every((c) => /^:?-+:?$/.test(c));
}

/**
 * Tokenize `source` into a flat, document-ordered list of blocks. `file` is stamped onto every
 * location so a block can be traced back to where it came from without the caller re-deriving it.
 */
export function tokenize(source: string, file: string): BlockDocument {
  const lines = source.split(/\r\n|\r|\n/);
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    // `noUncheckedIndexedAccess` types an index read as `string | undefined`. The loop guard proves
    // this is in range, but the type does not carry that proof -- so narrow once, here, and every use
    // of `line` below is a plain `string`. A non-null assertion would silence the checker instead of
    // satisfying it, and this file is Tier G.
    const line = lines[i];
    if (line === undefined) break;

    if (line.trim() === "") {
      i++;
      continue;
    }

    const fenceOpen = FENCE_OPEN_RE.exec(line);
    if (fenceOpen) {
      const loc: SourceLocation = { file, line: i + 1 };
      const lang = fenceOpen[1] ?? "";
      const content: string[] = [];
      i++;
      let closed = false;
      while (i < lines.length) {
        const fenceLine = lines[i];
        if (fenceLine === undefined) break;
        if (FENCE_CLOSE_RE.test(fenceLine)) {
          closed = true;
          i++;
          break;
        }
        content.push(fenceLine);
        i++;
      }
      blocks.push({ type: "fence", lang, content, closed, loc });
      continue;
    }

    const heading = HEADING_RE.exec(line);
    // Both groups are non-optional in HEADING_RE, but `exec` types every group as
    // `string | undefined`; narrow rather than assert, so a future regex edit that drops a group
    // is a type error here instead of a runtime one.
    const headingHashes = heading?.[1];
    const headingText = heading?.[2];
    if (heading && headingHashes !== undefined && headingText !== undefined) {
      const loc: SourceLocation = { file, line: i + 1 };
      blocks.push({ type: "heading", depth: headingHashes.length, text: headingText.trim(), loc });
      i++;
      continue;
    }

    const delimiterLine = lines[i + 1];
    if (line.includes("|") && delimiterLine !== undefined && isDelimiterRow(delimiterLine)) {
      const loc: SourceLocation = { file, line: i + 1 };
      const header: TableRow = { cells: splitRow(line), loc };
      const align = splitRow(delimiterLine);
      i += 2;
      const rows: TableRow[] = [];
      for (;;) {
        const rowLine = lines[i];
        if (rowLine === undefined || rowLine.trim() === "" || !rowLine.includes("|")) break;
        rows.push({ cells: splitRow(rowLine), loc: { file, line: i + 1 } });
        i++;
      }
      blocks.push({ type: "table", header, align, rows, loc });
      continue;
    }

    // Paragraph: the fallback bucket. Ends at a blank line or the start of any other construct, so
    // it never swallows a heading, table or fence that follows it without a blank line between.
    const loc: SourceLocation = { file, line: i + 1 };
    const paraLines: string[] = [];
    for (;;) {
      const paraLine = lines[i];
      if (paraLine === undefined) break;
      const nextLine = lines[i + 1];
      const startsTable =
        paraLine.includes("|") && nextLine !== undefined && isDelimiterRow(nextLine);
      if (
        paraLine.trim() === "" ||
        FENCE_OPEN_RE.test(paraLine) ||
        HEADING_RE.test(paraLine) ||
        startsTable
      ) {
        break;
      }
      paraLines.push(paraLine);
      i++;
    }
    // Safety net, not a normal path: every branch above already consumes at least one line when it
    // matches, and the paragraph loop's own first condition (`trim() !== ""`) is guaranteed true here
    // because the blank-line branch already returned. So `paraLines` cannot be empty -- this exists
    // only so a future change to the stop conditions fails loud (an infinite loop) rather than silent.
    if (paraLines.length === 0) {
      throw new Error(`tokenize: paragraph loop made no progress at ${file}:${i + 1}`);
    }
    blocks.push({ type: "paragraph", text: paraLines.join("\n"), loc });
  }

  return { blocks };
}
