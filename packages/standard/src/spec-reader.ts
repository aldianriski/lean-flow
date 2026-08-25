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

// --- SPRINT-085 T3: error semantics parity with `read-spec-rules.sh` -------------------------------
//
// Rows were the easy half. The failure this reader refuses to have is returning nothing and exiting
// clean -- a reader that checks nothing passes everything, and the whole engine inherits the false
// negative (L-058). `SpecReadResult` makes that refusal a TYPE, not a convention someone can forget
// to check: the failure variant carries no `rows` field at all, so "no rows" and "an empty rule set"
// can never be confused the way two `[]` returns could be at a call site.

/** The two named findings this reader can raise -- mirrors `read-spec-rules.sh`'s own vocabulary. */
export type SpecFinding = "spec-table-unreadable" | "spec-not-found";

export interface SpecReadOk {
  readonly ok: true;
  readonly rows: readonly RuleRow[];
}

export interface SpecReadFail {
  readonly ok: false;
  readonly finding: SpecFinding;
  readonly message: string;
}

/**
 * Absence and emptiness stay distinguishable at the TYPE level. `SpecReadOk.rows` can legitimately be
 * `[]` (a section §14's own count says has none -- §8 today), but `SpecReadFail` has no `rows` field
 * to mistake for one -- a caller cannot accidentally read a failure as "zero rows".
 */
export type SpecReadResult = SpecReadOk | SpecReadFail;

/**
 * Pure constructor for the `spec-not-found` finding. No filesystem access here -- this stays domain
 * (V3 §2.1; `test/architecture/dependency-direction.test.ts` enforces it mechanically). The caller is
 * whatever actually attempts to read `specPath` off disk (an adapter in Sprint C's H07; a
 * `*.test.ts` helper here, following T2's pattern of keeping `readFileSync` in test files only) and
 * calls this when that attempt fails -- mirroring `read-spec-rules.sh`'s `[ -f "$spec" ]` guard.
 */
export function specNotFound(specPath: string): SpecReadFail {
  return {
    ok: false,
    finding: "spec-not-found",
    message: `read-spec-rules: spec-not-found -- ${specPath}`,
  };
}

/**
 * §14's own per-section counts (the `classified` row, §1..§13), read independently of the rows
 * themselves -- exactly as `read-spec-rules.sh`'s `expected` does. That independence is the point: a
 * dropped section's rows and its expected count come from two separate reads of the document, so they
 * can disagree instead of one silently mirroring the other. `null` if §14 carries no `classified` row
 * at all (the shell's `spec-counts-unreadable` case -- T4's concern, not this one's).
 */
export function expectedCountsOf(doc: BlockDocument): ReadonlyMap<number, number> | null {
  for (const section of sectionsOf(doc)) {
    if (section.number !== 14) continue;
    for (const block of section.blocks) {
      if (block.type !== "table") continue;
      for (const row of block.rows) {
        if ((row.cells[0] ?? "").trim() !== "classified") continue;

        const counts = new Map<number, number>();
        for (let s = 1; s <= 13; s++) {
          const cleaned = (row.cells[s] ?? "").replace(/[*`\s]/g, "");
          counts.set(s, cleaned === "" ? 0 : Number(cleaned));
        }
        return counts;
      }
    }
  }
  return null;
}

/**
 * Reads §`sectionNumber`'s Conformance rows, refusing the L-058 false negative: zero rows is a named
 * `spec-table-unreadable` finding UNLESS §14's own count says the section legitimately has none
 * (`zero-rule-section-is-not-a-finding` -- §8 today). Mirrors `read-spec-rules.sh --section N`'s
 * exemption exactly: only narrowing to one section can consult that count -- see `readAll` below for
 * why a whole-document sweep never gets the same exemption.
 */
export function readSection(doc: BlockDocument, sectionNumber: number, specPath: string): SpecReadResult {
  const rows = rulesInSection(doc, sectionNumber);
  if (rows.length > 0) return { ok: true, rows };

  const expected = expectedCountsOf(doc);
  const expectedForSection = expected?.get(sectionNumber);
  if (expected !== null && expectedForSection === 0) {
    return { ok: true, rows: [] }; // legitimately none -- exits 0 silently, matching the shell
  }

  const expSay = expected === null || expectedForSection === undefined ? "no published count" : String(expectedForSection);
  return {
    ok: false,
    finding: "spec-table-unreadable",
    message:
      `read-spec-rules: spec-table-unreadable -- no §${sectionNumber} Conformance rows parsed from ` +
      `${specPath}, but §14 publishes ${expSay} for it. A reader that returns nothing checks nothing ` +
      `and exits clean; that is reported here instead (L-058)`,
  };
}

/**
 * Reads every section's rows, document order -- the no-`--section` mode. Zero rows is ALWAYS a
 * finding here, with no §14 exemption: the shell reader only ever consults `expected` when `$section`
 * is set (its own header comment says so), because a whole-document sweep has no single section
 * number to look up against §14's per-section table.
 */
export function readAll(doc: BlockDocument, specPath: string): SpecReadResult {
  const rows = allRules(doc);
  if (rows.length > 0) return { ok: true, rows };

  return {
    ok: false,
    finding: "spec-table-unreadable",
    message:
      `read-spec-rules: spec-table-unreadable -- no Conformance rows parsed from ${specPath}. A reader ` +
      `that returns nothing checks nothing and exits clean; that is reported here instead (L-058)`,
  };
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
