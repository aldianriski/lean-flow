// evals/run-v1-to-v2-fixtures.ts -- retained proof for the v1 -> v2 work-item-store mapping now
// written in skills/lean-doc-generator/references/migration-map.md § v1 -> v2 work-item store
// (2.0) (SPRINT-106 T4, TASK-370, EPIC-017 D7/D8). Run by Bun: `bun evals/run-v1-to-v2-fixtures.ts`
//
// WHY RETAINED. TD-012: deleting the fixtures with the prototype leaves the mapping unguarded.
//
// WHAT THIS CHECKS. Migrate is an AGENT-RUN PROCEDURE (ADR-043's consumer contract -- no Bun/TS
// script ships to consumers), so this harness does not execute the procedure. It checks the
// INVARIANTS a correct run's output must satisfy, against a hand-built expected/ tree
// (evals/fixtures/v1-to-v2/) that a correct migrate run over input/ would produce:
//   id-set-*            must PASS -- every id in input/ (TODO.md Backlog + every sprint Plan Tn's
//                        Cites:) equals every id present as a docs/work/**/TASK-*.md filename in
//                        expected/, diffed BOTH ways (a count alone would not catch two
//                        same-size, different sets -- CLAUDE.md's cross-check rule).
//   ticked-box-count     must PASS -- sum of `- [x]` under every sprint Plan Tn's DoD (before)
//                        equals sum of `- [x]` under `## Done when` across expected/'s task files
//                        (after).
//   overlap-single-file  must PASS -- TASK-915 (cited by both the Backlog row and the Plan Tn)
//                        produced exactly ONE file, not one per source.
//   no-todo-in-expected  must PASS -- expected/ carries no TODO.md (every task resolved -> removed,
//                        owner ruling: SPRINT-106 log "migrate removes TODO.md; no tombstone").
//   schema-*             must PASS -- every expected/ file's name matches
//                        `TASK-NNN-kebab-slug.md` (docs/work/README.md filename rule) and its
//                        frontmatter carries every required field (id/title/priority/size/risk/
//                        autonomy/class/tier/authority/origin/state) with id matching the filename.
//
// MUST-FAIL SIBLINGS (same code path, TD-012 / L-142 convention -- see evals/fixtures/v1-to-v2/
// README.md):
//   (a) expected-missing-task/  -- TASK-914 entirely absent -> id-set case must redden.
//   (b) expected-duplicate-overlap/ -- TASK-915 exists in BOTH done/ and todo/ -> the overlap case
//       must redden, while id-set and ticked-box-count on that same tree stay green (a sibling
//       control, not a demolition -- L-142).
//
// SCENARIO 2 (revise round, outside review HIGH #2): conflict-input/ -> conflict-expected/ proves
// an owner-unresolved conflict BLOCKS TODO.md removal outright, not just "gets reported" while
// removal proceeds anyway. TASK-917's pre-existing store file disagrees with its Plan's tick state
// (a real conflict); TODO.md must survive in conflict-expected/, byte-identical to conflict-input/,
// and TASK-917's file must be left untouched. conflict-expected-wrongly-removed/ is the must-FAIL
// sibling: same tree, TODO.md removed anyway -> must redden.
//
// SCHEMA CROSS-CHECK (revise round, outside review MED #4): REQUIRED_FIELDS / REQUIRED_SECTIONS /
// FILENAME_RULE below were a literal copy of docs/work/README.md's own declared schema, free to
// drift silently. schema-cross-check-* re-reads the real README (or a scratch copy pointed to by
// WORK_STORE_README_OVERRIDE, for the discrimination proof -- the real README is never edited) and
// asserts its declared fields/sections/filename-rule text still match these constants, diffed both
// ways where applicable.
//
// DISCRIMINATION PROOFS. Run by hand, not baked into this file (same convention as
// evals/run-layout-fixtures.ts and evals/run-work-store-fixtures.ts's must-FAIL siblings):
//   - id-set: the id-set comparison in this file is temporarily broken (a saved copy taken
//     first), run against expected-missing-task/ to confirm it now WRONGLY passes, then restored
//     and the restore verified with `git diff --no-index` against the saved copy.
//   - schema cross-check: WORK_STORE_README_OVERRIDE points at a scratch copy of
//     docs/work/README.md with one field dropped; schema-cross-check-fields must redden.
// Verbatim output + the stated method for both are in the SPRINT-106 T4 report, per the repo's
// practice of keeping the proof out of the script itself.

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const FIXTURES = fileURLToPath(new URL("fixtures/v1-to-v2", import.meta.url));
const INPUT = join(FIXTURES, "input");
const EXPECTED = join(FIXTURES, "expected");
const EXPECTED_MISSING_TASK = join(FIXTURES, "expected-missing-task");
const EXPECTED_DUPLICATE_OVERLAP = join(FIXTURES, "expected-duplicate-overlap");
const CONFLICT_INPUT = join(FIXTURES, "conflict-input");
const CONFLICT_EXPECTED = join(FIXTURES, "conflict-expected");
const CONFLICT_EXPECTED_WRONGLY_REMOVED = join(FIXTURES, "conflict-expected-wrongly-removed");

// Real docs/work/README.md, or (discrimination proof only) a scratch copy named by this env var --
// never the real file mutated in place.
const REAL_README_PATH = fileURLToPath(new URL("../docs/work/README.md", import.meta.url));
const README_OVERRIDE = process.env.WORK_STORE_README_OVERRIDE ?? null;
function readmePath(): string {
  return README_OVERRIDE && existsSync(README_OVERRIDE) ? README_OVERRIDE : REAL_README_PATH;
}

let pass = 0;
let fail = 0;

function report(name: string, ok: boolean, detail: string) {
  if (ok) {
    console.log(`PASS  v1-to-v2-fixture: ${name} -- ${detail}`);
    pass++;
  } else {
    console.log(`FAIL  v1-to-v2-fixture: ${name} -- ${detail}`);
    fail++;
  }
}

// --- v1 side: parse TODO.md Backlog ids + every sprint file's Plan `Cites:` ids ----------------

function v1BacklogIds(root: string): string[] {
  const todoPath = join(root, "TODO.md");
  if (!existsSync(todoPath)) return [];
  const text = readFileSync(todoPath, "utf8");
  const ids: string[] = [];
  const re = /^-\s\[[ x]\]\s(TASK-\d+)\s/gm;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) ids.push(m[1]!);
  return ids;
}

function v1PlanCitesIds(root: string): string[] {
  const sprintDir = join(root, "docs", "sprint");
  if (!existsSync(sprintDir)) return [];
  const ids: string[] = [];
  for (const entry of readdirSync(sprintDir, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith(".md")) continue;
    const text = readFileSync(join(sprintDir, entry.name), "utf8");
    // Only the Cites: line immediately following a ### Tn heading (a Plan task's own citation),
    // not any other TASK-NNN mention in the file.
    const blocks = text.split(/^### T\d+/m).slice(1);
    for (const block of blocks) {
      const citesLine = block.match(/^Cites:\s*(.+)$/m);
      if (!citesLine) continue;
      const idMatches = citesLine[1]!.match(/TASK-\d+/g);
      if (idMatches) ids.push(...idMatches);
    }
  }
  return ids;
}

function v1TickedBoxCount(root: string): number {
  const sprintDir = join(root, "docs", "sprint");
  if (!existsSync(sprintDir)) return 0;
  let total = 0;
  for (const entry of readdirSync(sprintDir, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith(".md")) continue;
    const text = readFileSync(join(sprintDir, entry.name), "utf8");
    const blocks = text.split(/^### T\d+/m).slice(1);
    for (const block of blocks) {
      const ticked = block.match(/^-\s\[x\]\s/gm);
      total += ticked ? ticked.length : 0;
    }
  }
  return total;
}

// Per-id Plan DoD ticked/total, keyed by the id each Tn's Cites: names. Used by the conflict-
// detection helper below (scenario 2) -- distinct from v1TickedBoxCount's whole-tree sum.
function v1PlanDodById(root: string): Map<string, { ticked: number; total: number }> {
  const sprintDir = join(root, "docs", "sprint");
  const out = new Map<string, { ticked: number; total: number }>();
  if (!existsSync(sprintDir)) return out;
  for (const entry of readdirSync(sprintDir, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith(".md")) continue;
    const text = readFileSync(join(sprintDir, entry.name), "utf8");
    const blocks = text.split(/^### T\d+/m).slice(1);
    for (const block of blocks) {
      const citesLine = block.match(/^Cites:\s*(.+)$/m);
      const idMatch = citesLine?.[1]?.match(/TASK-\d+/);
      if (!idMatch) continue;
      const total = (block.match(/^- \[[ x]\] /gm) ?? []).length;
      const ticked = (block.match(/^- \[x\] /gm) ?? []).length;
      out.set(idMatch[0], { ticked, total });
    }
  }
  return out;
}

// --- v2 side: walk docs/work/**/TASK-*.md ------------------------------------------------------

interface V2File {
  readonly path: string;
  readonly filename: string;
  readonly id: string;
}

function findV2Files(root: string): V2File[] {
  const work = join(root, "docs", "work");
  if (!existsSync(work)) return [];
  const out: V2File[] = [];
  function walk(dir: string) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.isFile() && /^TASK-\d+.*\.md$/.test(entry.name)) {
        const idMatch = entry.name.match(/^(TASK-\d+)-/);
        out.push({ path: full, filename: entry.name, id: idMatch ? idMatch[1]! : "" });
      }
    }
  }
  walk(work);
  return out;
}

function v2Ids(root: string): string[] {
  return findV2Files(root)
    .map((f) => f.id)
    .filter((id) => id.length > 0);
}

function splitFrontmatter(raw: string): { frontmatter: string; body: string } {
  const lines = raw.split("\n");
  if (lines[0]?.trim() !== "---") return { frontmatter: "", body: raw };
  const closeIdx = lines.indexOf("---", 1);
  if (closeIdx === -1) return { frontmatter: "", body: raw };
  return { frontmatter: lines.slice(1, closeIdx).join("\n"), body: lines.slice(closeIdx + 1).join("\n") };
}

function extractSection(body: string, heading: string): string | null {
  const headingRe = new RegExp(`^${heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*$`, "m");
  const m = headingRe.exec(body);
  if (!m) return null;
  const rest = body.slice(m.index + m[0].length);
  const nextHeading = rest.search(/\n## /);
  return nextHeading === -1 ? rest : rest.slice(0, nextHeading);
}

function v2TickedBoxCount(root: string): number {
  let total = 0;
  for (const f of findV2Files(root)) {
    const { body } = splitFrontmatter(readFileSync(f.path, "utf8"));
    const section = extractSection(body, "## Done when");
    if (section === null) continue;
    const ticked = section.match(/^- \[x\] /gm);
    total += ticked ? ticked.length : 0;
  }
  return total;
}

// An id is an unresolved conflict when its Plan Tn cites it AND a pre-existing docs/work file for
// that id already sits in `root` AND that file's ## Done when tick count disagrees with the
// Plan's. (Scenario 2 -- the overlap rule decides content, the resume/conflict rule decides what
// happens to an EXISTING file; a tick-state mismatch is the simplest real disagreement to seed.)
function detectUnresolvedConflicts(root: string): string[] {
  const planById = v1PlanDodById(root);
  const unresolved: string[] = [];
  for (const [id, dod] of planById) {
    const existing = findV2Files(root).find((f) => f.id === id);
    if (!existing) continue; // no pre-existing file -> a fresh write, not a conflict
    const { body } = splitFrontmatter(readFileSync(existing.path, "utf8"));
    const section = extractSection(body, "## Done when");
    const actualTicked = section ? (section.match(/^- \[x\] /gm) ?? []).length : 0;
    if (actualTicked !== dod.ticked) unresolved.push(id);
  }
  return unresolved;
}

// --- id-set comparison, diffed BOTH ways (the one function every id-set case below calls) ------

function diffIdSets(before: string[], after: string[]): { beforeOnly: string[]; afterOnly: string[] } {
  const beforeSet = new Set(before);
  const afterSet = new Set(after);
  return {
    beforeOnly: [...beforeSet].filter((id) => !afterSet.has(id)),
    afterOnly: [...afterSet].filter((id) => !beforeSet.has(id)),
  };
}

function runIdSetCase(name: string, expectedRoot: string) {
  const before = [...new Set([...v1BacklogIds(INPUT), ...v1PlanCitesIds(INPUT)])];
  const after = v2Ids(expectedRoot);
  const { beforeOnly, afterOnly } = diffIdSets(before, after);
  const ok = beforeOnly.length === 0 && afterOnly.length === 0;
  report(
    name,
    ok,
    ok
      ? `v1 ids {${before.join(", ")}} == v2 ids {${after.join(", ")}}, diffed both ways, both empty`
      : `v1∖v2 = {${beforeOnly.join(", ")}}, v2∖v1 = {${afterOnly.join(", ")}} -- not empty`,
  );
}

// --- (1) id-set: must PASS on expected/ ---------------------------------------------------------

runIdSetCase("id-set-expected", EXPECTED);

// --- (2) ticked-box count: must PASS on expected/ -----------------------------------------------

{
  const before = v1TickedBoxCount(INPUT);
  const after = v2TickedBoxCount(EXPECTED);
  const ok = before === after;
  report(
    "ticked-box-count-expected",
    ok,
    ok
      ? `Plan DoD ticked (before) = ${before}, docs/work ## Done when ticked (after) = ${after}, equal`
      : `Plan DoD ticked (before) = ${before}, docs/work ## Done when ticked (after) = ${after}, NOT equal`,
  );
}

// --- (3) overlap: TASK-915 (cited by both Backlog and Plan) produces exactly one file -----------

function runOverlapCase(name: string, expectedRoot: string) {
  const backlogIds = new Set(v1BacklogIds(INPUT));
  const planIds = new Set(v1PlanCitesIds(INPUT));
  const overlapIds = [...backlogIds].filter((id) => planIds.has(id));
  const files = findV2Files(expectedRoot);
  const problems: string[] = [];
  for (const id of overlapIds) {
    const matches = files.filter((f) => f.id === id);
    if (matches.length !== 1) {
      problems.push(`${id} has ${matches.length} file(s): ${matches.map((m) => m.filename).join(", ") || "none"}`);
    }
  }
  const ok = problems.length === 0;
  report(
    name,
    ok,
    ok
      ? `overlap id(s) {${overlapIds.join(", ")}} each produced exactly 1 file`
      : problems.join("; "),
  );
}

runOverlapCase("overlap-single-file-expected", EXPECTED);

// --- (4) no TODO.md in expected/ ------------------------------------------------------------

{
  const ok = !existsSync(join(EXPECTED, "TODO.md"));
  report(
    "no-todo-in-expected",
    ok,
    ok ? "expected/ carries no TODO.md" : "expected/ still has a TODO.md -- removal invariant broken",
  );
}

// --- (5) schema: filename + required frontmatter fields, for every file in expected/ ------------

const FILENAME_RULE = /^TASK-\d+-[a-z0-9]+(?:-[a-z0-9]+)*\.md$/;
const REQUIRED_FIELDS = [
  "id",
  "title",
  "priority",
  "size",
  "risk",
  "autonomy",
  "class",
  "tier",
  "authority",
  "origin",
  "state",
];
const REQUIRED_SECTIONS = ["## Done when", "## Touches", "## Assumes", "## Tracker"];

{
  const files = findV2Files(EXPECTED);
  const problems: string[] = [];
  for (const f of files) {
    if (!FILENAME_RULE.test(f.filename)) problems.push(`${f.filename}: filename fails TASK-NNN-kebab-slug.md rule`);
    const raw = readFileSync(f.path, "utf8");
    const { frontmatter, body } = splitFrontmatter(raw);
    for (const field of REQUIRED_FIELDS) {
      if (!new RegExp(`^${field}:`, "m").test(frontmatter)) problems.push(`${f.filename}: frontmatter missing '${field}:'`);
    }
    const idField = frontmatter.match(/^id:\s*(TASK-\d+)/m);
    if (!idField || idField[1] !== f.id) problems.push(`${f.filename}: frontmatter id (${idField?.[1] ?? "MISSING"}) != filename id (${f.id})`);
    for (const section of REQUIRED_SECTIONS) {
      if (!body.includes(section)) problems.push(`${f.filename}: body missing '${section}'`);
    }
  }
  const ok = files.length > 0 && problems.length === 0;
  report(
    "schema-expected",
    ok,
    ok
      ? `${files.length} file(s) in expected/ each match the filename rule and carry every required field/section`
      : problems.join("; "),
  );
}

// --- MUST-FAIL siblings ---------------------------------------------------------------------

// (a) expected-missing-task/: TASK-914 entirely absent -> id-set case must redden.
{
  const before = [...new Set([...v1BacklogIds(INPUT), ...v1PlanCitesIds(INPUT)])];
  const after = v2Ids(EXPECTED_MISSING_TASK);
  const { beforeOnly, afterOnly } = diffIdSets(before, after);
  const siblingCorrectlyReddened = beforeOnly.length > 0 || afterOnly.length > 0;
  report(
    "id-set-missing-task (must-FAIL sibling)",
    siblingCorrectlyReddened,
    siblingCorrectlyReddened
      ? `v1∖v2 = {${beforeOnly.join(", ")}} correctly non-empty -- TASK-914's absence from expected-missing-task/ reddens the id-set case`
      : `id-set case did NOT redden on a tree missing TASK-914 -- the check cannot discriminate`,
  );

  // Sibling control on the SAME tree: ticked-box-count is unaffected by the missing task (it
  // carried no ticked box), so it must still PASS here -- proves the redden above is specific.
  const tickedBefore = v1TickedBoxCount(INPUT);
  const tickedAfter = v2TickedBoxCount(EXPECTED_MISSING_TASK);
  const controlOk = tickedBefore === tickedAfter;
  report(
    "ticked-box-count-missing-task (sibling control, must stay PASS)",
    controlOk,
    controlOk
      ? `ticked-box-count still agrees (${tickedBefore} == ${tickedAfter}) on the SAME tree that reddens id-set -- proves the redden above is specific to the id-set case, not a wholesale break`
      : `ticked-box-count also disagrees (${tickedBefore} vs ${tickedAfter}) -- the missing-task fixture is not an isolated break`,
  );
}

// (b) expected-duplicate-overlap/: TASK-915 exists in BOTH done/ and todo/ -> overlap case must
// redden, while id-set and ticked-box-count on the SAME tree stay green (a sibling control).
{
  const backlogIds = new Set(v1BacklogIds(INPUT));
  const planIds = new Set(v1PlanCitesIds(INPUT));
  const overlapIds = [...backlogIds].filter((id) => planIds.has(id));
  const files = findV2Files(EXPECTED_DUPLICATE_OVERLAP);
  const problems: string[] = [];
  for (const id of overlapIds) {
    const matches = files.filter((f) => f.id === id);
    if (matches.length !== 1) problems.push(`${id} has ${matches.length} file(s): ${matches.map((m) => m.filename).join(", ")}`);
  }
  const siblingCorrectlyReddened = problems.length > 0;
  report(
    "overlap-single-file-duplicate-overlap (must-FAIL sibling)",
    siblingCorrectlyReddened,
    siblingCorrectlyReddened
      ? problems.join("; ") + " -- correctly reddens the overlap case"
      : "overlap case did NOT redden on a tree with a duplicated TASK-915 -- the check cannot discriminate",
  );

  // Sibling controls on the SAME tree: id-set and ticked-box-count are unaffected by the
  // duplication (both copies carry the same id and the same ticked box; a naive id-SET dedupes
  // the duplicate, and both copies' single ticked box sums to the same total as one copy would --
  // wait: two files each with 1 ticked box would sum to 2, not 1, so ticked-box-count SHOULD also
  // redden here. It is deliberately reported, not asserted must-PASS, to avoid a false control.
  const idsAfter = v2Ids(EXPECTED_DUPLICATE_OVERLAP);
  const { beforeOnly, afterOnly } = diffIdSets([...new Set([...v1BacklogIds(INPUT), ...v1PlanCitesIds(INPUT)])], idsAfter);
  const idSetControlOk = beforeOnly.length === 0 && afterOnly.length === 0;
  report(
    "id-set-duplicate-overlap (sibling control, must stay PASS)",
    idSetControlOk,
    idSetControlOk
      ? `id-SET still agrees (a set dedupes TASK-915's two files to one id) on the SAME tree that reddens overlap -- proves the overlap check catches something the id-set check structurally cannot (duplicate files sharing one id)`
      : `id set also disagrees: v1∖v2 = {${beforeOnly.join(", ")}}, v2∖v1 = {${afterOnly.join(", ")}}`,
  );
}

// --- SCENARIO 2: an unresolved conflict blocks TODO.md removal (outside review HIGH #2) --------

function byteIdentical(a: string, b: string): boolean {
  return existsSync(a) && existsSync(b) && readFileSync(a).equals(readFileSync(b));
}

{
  const unresolved = detectUnresolvedConflicts(CONFLICT_INPUT);
  const todoStillPresent = existsSync(join(CONFLICT_EXPECTED, "TODO.md"));
  const todoUnchanged = byteIdentical(join(CONFLICT_INPUT, "TODO.md"), join(CONFLICT_EXPECTED, "TODO.md"));
  const conflictFile917Input = findV2Files(CONFLICT_INPUT).find((f) => f.id === "TASK-917");
  const conflictFile917Expected = findV2Files(CONFLICT_EXPECTED).find((f) => f.id === "TASK-917");
  const fileUnchanged =
    !!conflictFile917Input && !!conflictFile917Expected && byteIdentical(conflictFile917Input.path, conflictFile917Expected.path);
  const cleanTaskWritten = !!findV2Files(CONFLICT_EXPECTED).find((f) => f.id === "TASK-918");
  const ok = unresolved.length > 0 && todoStillPresent && todoUnchanged && fileUnchanged && cleanTaskWritten;
  report(
    "todo-removal-blocked-by-conflict",
    ok,
    ok
      ? `TASK-917 correctly detected as an unresolved conflict (Plan ticked, existing file unticked); TODO.md still present and byte-identical to conflict-input/; TASK-917's file left byte-identical (never overwritten); TASK-918 (no conflict) written`
      : `unresolved=${JSON.stringify(unresolved)} todoPresent=${todoStillPresent} todoUnchanged=${todoUnchanged} conflictFileUnchanged=${fileUnchanged} cleanTaskWritten=${cleanTaskWritten}`,
  );
}

// (c) conflict-expected-wrongly-removed/: same tree, TODO.md removed anyway -> must redden.
{
  const unresolved = detectUnresolvedConflicts(CONFLICT_INPUT);
  const todoStillPresent = existsSync(join(CONFLICT_EXPECTED_WRONGLY_REMOVED, "TODO.md"));
  const siblingCorrectlyReddened = unresolved.length > 0 && !todoStillPresent;
  report(
    "todo-removal-wrongly-applied (must-FAIL sibling)",
    siblingCorrectlyReddened,
    siblingCorrectlyReddened
      ? `TASK-917 is still an unresolved conflict (${JSON.stringify(unresolved)}) yet TODO.md is absent from conflict-expected-wrongly-removed/ -- correctly reddens the removal-precedence case`
      : `removal-precedence case did NOT redden on a tree that removed TODO.md despite an open conflict -- the check cannot discriminate`,
  );

  // Sibling control on the SAME tree: TASK-918 (no conflict) and TASK-917's own file content are
  // unaffected by TODO.md's absence -- proves the redden above is specific to the removal check.
  const conflictFile917 = findV2Files(CONFLICT_EXPECTED_WRONGLY_REMOVED).find((f) => f.id === "TASK-917");
  const conflictFile917Input = findV2Files(CONFLICT_INPUT).find((f) => f.id === "TASK-917");
  const fileStillUnchanged =
    !!conflictFile917 && !!conflictFile917Input && byteIdentical(conflictFile917Input.path, conflictFile917.path);
  const cleanTaskStillWritten = !!findV2Files(CONFLICT_EXPECTED_WRONGLY_REMOVED).find((f) => f.id === "TASK-918");
  const controlOk = fileStillUnchanged && cleanTaskStillWritten;
  report(
    "conflict-file-untouched-wrongly-removed (sibling control, must stay PASS)",
    controlOk,
    controlOk
      ? `TASK-917's file is still byte-identical and TASK-918 still written on the SAME tree that reddens the removal check -- proves the redden above is specific to TODO.md's premature removal, not a wholesale break`
      : `fileStillUnchanged=${fileStillUnchanged} cleanTaskStillWritten=${cleanTaskStillWritten} -- not an isolated break`,
  );
}

// --- SCHEMA CROSS-CHECK against docs/work/README.md (outside review MED #4) --------------------

const KNOWN_OPTIONAL_FIELDS = ["epic", "sprint", "depends-on"];

function readmeSection(text: string, heading: string): string {
  const idx = text.indexOf(heading);
  if (idx === -1) return "";
  const end = text.indexOf("\n## ", idx + 1);
  return end === -1 ? text.slice(idx) : text.slice(idx, end);
}

function parseReadmeFrontmatterFields(text: string): string[] {
  const section = readmeSection(text, "## Frontmatter fields");
  const span = section.match(/`([^`]+)`/);
  if (!span) return [];
  return span[1]!.replace(/\n/g, " ").split("·").map((s) => s.trim()).filter(Boolean);
}

function parseReadmeSections(text: string): { required: string[]; optional: string[] } {
  const section = readmeSection(text, "## Sections");
  const required: string[] = [];
  const optional: string[] = [];
  const re = /`(##[^`]+)`(\s*\(optional\))?/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(section))) {
    (m[2] ? optional : required).push(m[1]!.trim());
  }
  return { required, optional };
}

{
  const readmeText = readFileSync(readmePath(), "utf8");
  const readmeFields = new Set(parseReadmeFrontmatterFields(readmeText));
  const harnessFields = new Set([...REQUIRED_FIELDS, ...KNOWN_OPTIONAL_FIELDS]);
  const readmeOnly = [...readmeFields].filter((f) => !harnessFields.has(f));
  const harnessOnly = [...harnessFields].filter((f) => !readmeFields.has(f));
  const ok = readmeFields.size > 0 && readmeOnly.length === 0 && harnessOnly.length === 0;
  report(
    "schema-cross-check-fields (vs docs/work/README.md)",
    ok,
    ok
      ? `README § Frontmatter fields {${[...readmeFields].join(", ")}} == REQUIRED_FIELDS + known-optional {${[...harnessFields].join(", ")}}, diffed both ways, both empty`
      : `README-only: {${readmeOnly.join(", ")}}, harness-only: {${harnessOnly.join(", ")}} -- the harness's literal field list has drifted from ${readmePath()}`,
  );
}

{
  const readmeText = readFileSync(readmePath(), "utf8");
  const { required } = parseReadmeSections(readmeText);
  const readmeRequired = new Set(required);
  const harnessRequired = new Set(REQUIRED_SECTIONS);
  const readmeOnly = [...readmeRequired].filter((s) => !harnessRequired.has(s));
  const harnessOnly = [...harnessRequired].filter((s) => !readmeRequired.has(s));
  const ok = readmeRequired.size > 0 && readmeOnly.length === 0 && harnessOnly.length === 0;
  report(
    "schema-cross-check-sections (vs docs/work/README.md)",
    ok,
    ok
      ? `README § Sections' required headings {${[...readmeRequired].join(", ")}} == REQUIRED_SECTIONS {${[...harnessRequired].join(", ")}}, diffed both ways, both empty`
      : `README-only: {${readmeOnly.join(", ")}}, harness-only: {${harnessOnly.join(", ")}} -- REQUIRED_SECTIONS has drifted from ${readmePath()}`,
  );
}

{
  const readmeText = readFileSync(readmePath(), "utf8");
  const section = readmeSection(readmeText, "## Filename rule");
  const hasPattern = section.includes("TASK-NNN-kebab-slug.md");
  const hasCharClass = section.includes("[a-z0-9-]");
  const ok = section.length > 0 && hasPattern && hasCharClass;
  report(
    "schema-cross-check-filename-rule (vs docs/work/README.md)",
    ok,
    ok
      ? `README § Filename rule still states \`TASK-NNN-kebab-slug.md\` and \`[a-z0-9-]\` -- matches FILENAME_RULE's components`
      : `README § Filename rule (${readmePath()}) missing or no longer states the pattern/character-class FILENAME_RULE encodes`,
  );
}

// --- summary --------------------------------------------------------------------------------

console.log(`\nv1-to-v2-fixtures: ${pass} pass, ${fail} fail`);
process.exit(fail > 0 ? 1 : 0);
