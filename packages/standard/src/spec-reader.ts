// Queries a tokenized `spec/STANDARD.md` for the rule rows of a `## §N` section's Conformance
// table -- the TypeScript reader `scripts/lib/read-spec-rules.sh` has owned since SPRINT-075 T1.
//
// Domain layer (V3 §2.1). Imports only `./tokenizer.ts` and `./model.ts` -- no filesystem, no Bun.
// The caller reads spec/STANDARD.md and hands the text to `tokenize`; this module never touches I/O.
//
// The query is STRUCTURAL: `sectionsOf` groups the flat block list under the `## ` heading that
// governs it, and `rulesInSection` looks only inside that section's own tables. A table positioned
// before a section's heading -- or inside a DIFFERENT section's window, even one whose row happens to
// be labelled `S13.*` -- is never seen by that section's query, because the window is which table
// sits under which heading, not a scan for a substring anywhere in the document (L-108, the trap
// `read-spec-rules.sh`'s own header documents: §14 and §8 both name other sections' rule ids in
// prose).
//
// Row shape mirrors the shell reader exactly, INCLUDING its two defaulting rules, so the two can be
// diffed byte-for-byte:
//   - the id cell must be EXACTLY a backticked id, nothing else in the cell (`` `S13.TRAILERS` ``);
//     the awk anchor is `^[|] *`Ssec[.][A-Z0-9-]+` *[|]`, i.e. the whole first cell and nothing more.
//   - level/mark are each the FIRST whitespace-separated token of their cell after `*`/`` ` `` are
//     stripped -- §13 writes "mechanical *on the fact*", and the qualifier must not become a distinct
//     value. A cell with no token defaults to "--" (level) or "?" (mark), matching the shell exactly.

import type { Block, BlockDocument, HeadingBlock, SourceLocation } from "./tokenizer.ts";
import {
  type ConformanceLevel,
  type RuleId,
  type RuleMark,
  type StandardRule,
  isConformanceLevel,
  isRuleMark,
  makeRuleId,
} from "./model.ts";

export interface Section {
  readonly number: number; // 0 for a "## " heading with no leading section number
  readonly heading: HeadingBlock;
  readonly blocks: readonly Block[]; // everything up to (not including) the next depth-2 heading
}

/** Same numbering rule as `read-spec-rules.sh`'s awk: strip non-digits, then the leading digit run. */
function sectionNumberOf(headingText: string): number {
  const m = /^\D*(\d+)/.exec(headingText);
  return m ? Number(m[1]) : 0;
}

/**
 * Groups the flat block list into sections, each governed by the nearest preceding depth-2 heading.
 * Blocks before the first depth-2 heading (title, frontmatter) belong to no section and are dropped
 * -- mirroring the shell reader, which only starts counting once `sec > 0`.
 */
export function sectionsOf(doc: BlockDocument): readonly Section[] {
  const sections: Section[] = [];
  let current: { number: number; heading: HeadingBlock; blocks: Block[] } | null = null;

  for (const block of doc.blocks) {
    if (block.type === "heading" && block.depth === 2) {
      current = { number: sectionNumberOf(block.text), heading: block, blocks: [] };
      sections.push(current);
      continue;
    }
    if (current) current.blocks.push(block);
  }

  return sections;
}

export interface RuleRow {
  readonly id: string;
  readonly level: string;
  readonly mark: string;
  readonly loc: SourceLocation;
}

const ID_CELL_RE = /^`(S(\d+)\.[A-Z0-9-]+)`$/;

/** First whitespace token after stripping `*`/`` ` ``; `fallback` if the cell has none. */
function primaryToken(raw: string, fallback: string): string {
  const cleaned = raw.replace(/[*`]/g, " ");
  for (const token of cleaned.split(/\s+/)) {
    if (token !== "") return token;
  }
  return fallback;
}

/**
 * The `(id, level, mark)` rows found in a single section's own table blocks, filtered to ids whose
 * own section number agrees with `section.number` -- the belt-and-braces guard `rulesInSection`'s doc
 * comment describes. Shared by `rulesInSection` (one window) and `allRules` (every window, in
 * document order) so the two can never drift apart on how a row is read.
 */
function rulesInWindow(section: Section): RuleRow[] {
  const rows: RuleRow[] = [];

  for (const block of section.blocks) {
    if (block.type !== "table") continue;

    for (const row of block.rows) {
      const idCell = (row.cells[0] ?? "").trim();
      const m = ID_CELL_RE.exec(idCell);
      if (!m) continue;
      if (Number(m[2]) !== section.number) continue;

      rows.push({
        id: m[1],
        level: primaryToken(row.cells[1] ?? "", "--"),
        mark: primaryToken(row.cells[2] ?? "", "?"),
        loc: row.loc,
      });
    }
  }

  return rows;
}

/**
 * The `(id, level, mark)` rows of section `sectionNumber`'s Conformance table(s), in document order.
 * Only tables inside that section's own window are examined -- see the module header.
 */
export function rulesInSection(doc: BlockDocument, sectionNumber: number): readonly RuleRow[] {
  const rows: RuleRow[] = [];
  for (const section of sectionsOf(doc)) {
    if (section.number !== sectionNumber) continue;
    rows.push(...rulesInWindow(section));
  }
  return rows;
}

/**
 * Every rule row in the whole document, in document order -- the no-`--section` mode of
 * `read-spec-rules.sh`. Mirrors the shell reader's `sec > 0` gate: a block sitting before the first
 * numbered `## §N` heading (frontmatter, title, an unnumbered `## ` heading) belongs to no section
 * and is never a source of rows, even if a table happens to sit there.
 */
export function allRules(doc: BlockDocument): readonly RuleRow[] {
  const rows: RuleRow[] = [];
  for (const section of sectionsOf(doc)) {
    if (section.number <= 0) continue;
    rows.push(...rulesInWindow(section));
  }
  return rows;
}

/** `id level mark`, one row -- the exact line shape `read-spec-rules.sh` prints. */
export function formatRuleRow(row: RuleRow): string {
  return `${row.id} ${row.level} ${row.mark}`;
}

/**
 * Best-effort lift of a raw row into the domain model (`model.ts`, H04). A level the Standard's own
 * vocabulary does not define (`isConformanceLevel` false -- the six `implementation-directed` /
 * `standard-directed` rules print "--" here) becomes `null`, exactly as `StandardRule.level` models
 * it. Throws on a mark the Standard does not define or an id that fails `makeRuleId` -- both would be
 * a genuine parse defect, not a value this function should paper over.
 */
export function toStandardRule(row: RuleRow, sectionNumber: number, file: string): StandardRule {
  const id: RuleId = makeRuleId(row.id);
  const mark: RuleMark = isRuleMark(row.mark)
    ? row.mark
    : (() => {
        throw new Error(`not a rule mark: ${JSON.stringify(row.mark)} for ${row.id}`);
      })();
  const level: ConformanceLevel | null = isConformanceLevel(row.level) ? row.level : null;
  return { id, section: sectionNumber, mark, level, source: { file, line: row.loc.line } };
}
