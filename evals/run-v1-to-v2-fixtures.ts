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
const INPUT_BYREF = join(FIXTURES, "input-byref");
const EXPECTED_BYREF = join(FIXTURES, "expected-byref");
const EXPECTED_BYREF_MEMBER_ALTERED = join(FIXTURES, "expected-byref-member-altered");
const INTERRUPTED_PARTIAL = join(FIXTURES, "interrupted-partial");
const INTERRUPTED_PARTIAL_DIVERGED = join(FIXTURES, "interrupted-partial-diverged");

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

// A sprint file with a `## Members` section is by-reference (its members already live in docs/work/):
// the v1 collectors below skip it, exactly as the migrate procedure does not map its `### Tn`.
function isByReference(sprintText: string): boolean {
  return /^## Members\s*$/m.test(sprintText);
}

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
    if (isByReference(text)) continue; // by-reference sprint: its Tn are NOT mapped (migration-map.md)
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
    if (isByReference(text)) continue; // by-reference sprint: its Tn are NOT mapped (migration-map.md)
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
    if (isByReference(text)) continue; // by-reference sprint: its Tn are NOT mapped (migration-map.md)
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
  const closeIdx = lines.findIndex((l, i) => i > 0 && l.trim() === "---"); // CRLF-safe (autocrlf checkouts)
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

// `onlyIds`: count only the files of those ids (the ids this run migrated) -- a pre-existing member
// file's ticks were never the Plan's to preserve, so they must not enter the "after" sum.
function v2TickedBoxCount(root: string, onlyIds?: ReadonlySet<string>): number {
  let total = 0;
  for (const f of findV2Files(root)) {
    if (onlyIds && !onlyIds.has(f.id)) continue;
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

// --- preservation: every docs/work/** file present BEFORE is byte-identical AFTER -------------
// (a by-reference sprint's members, and any other pre-existing store file, are never written).
// Findings are named: `altered: <path>` / `missing: <path>`.

function workFilesRel(root: string): string[] {
  const work = join(root, "docs", "work");
  if (!existsSync(work)) return [];
  const out: string[] = [];
  function walk(dir: string, rel: string) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) walk(join(dir, entry.name), `${rel}/${entry.name}`);
      else if (entry.isFile()) out.push(`${rel}/${entry.name}`);
    }
  }
  walk(work, "docs/work");
  return out.sort();
}

function preservationFindings(beforeRoot: string, afterRoot: string): string[] {
  const findings: string[] = [];
  for (const rel of workFilesRel(beforeRoot)) {
    const a = join(afterRoot, rel);
    if (!existsSync(a)) findings.push(`missing: ${rel}`);
    else if (!readFileSync(join(beforeRoot, rel)).equals(readFileSync(a))) findings.push(`altered: ${rel}`);
  }
  return findings;
}

// The ids this run migrated, as the v2 side sees them: every id now in the store, minus the ones
// that were already there and that v1 never cites (untouched members / unrelated store files).
function migratedV2Ids(beforeRoot: string, afterRoot: string, v1Ids: string[]): string[] {
  const cited = new Set(v1Ids);
  const preexistingUncited = new Set(v2Ids(beforeRoot).filter((id) => !cited.has(id)));
  return v2Ids(afterRoot).filter((id) => !preexistingUncited.has(id));
}

function v1Ids(root: string): string[] {
  return [...new Set([...v1BacklogIds(root), ...v1PlanCitesIds(root)])];
}

function runIdSetCase(name: string, expectedRoot: string, inputRoot: string = INPUT) {
  const before = v1Ids(inputRoot);
  const after = migratedV2Ids(inputRoot, expectedRoot, before);
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

// --- REAL-COPY MODE: `--before <dir> --after <dir>` ----------------------------------------------
// Runs the same invariants over a real repo copy (before = pristine v1 copy, after = the same copy
// once migrate ran) instead of the fixture trees, then exits. SPRINT-111 T1 (TASK-370).

function argValue(flag: string): string | null {
  const i = process.argv.indexOf(flag);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1]! : null;
}

{
  const beforeDir = argValue("--before");
  const afterDir = argValue("--after");
  if (beforeDir || afterDir) {
    if (!beforeDir || !afterDir || !existsSync(beforeDir) || !existsSync(afterDir)) {
      console.log("usage: bun evals/run-v1-to-v2-fixtures.ts --before <dir> --after <dir> (both must exist)");
      process.exit(2);
    }
    const ids = v1Ids(beforeDir);
    const after = migratedV2Ids(beforeDir, afterDir, ids);
    const { beforeOnly, afterOnly } = diffIdSets(ids, after);
    const idOk = ids.length > 0 && beforeOnly.length === 0 && afterOnly.length === 0;
    report(
      "real-id-set",
      idOk,
      idOk
        ? `v1 ids (${ids.length}) == migrated v2 ids (${after.length}), diffed both ways, both empty`
        : `v1∖v2 = {${beforeOnly.join(", ")}}, v2∖v1 = {${afterOnly.join(", ")}} (v1 ids: ${ids.length})`,
    );
    const tb = v1TickedBoxCount(beforeDir);
    const ta = v2TickedBoxCount(afterDir, new Set(ids));
    report("real-ticked-box-count", tb === ta, `Plan DoD ticked (before, by-value sprints) = ${tb}, ## Done when ticked over migrated ids (after) = ${ta}`);
    const pres = preservationFindings(beforeDir, afterDir);
    report(
      "real-preservation",
      pres.length === 0,
      pres.length === 0
        ? `${workFilesRel(beforeDir).length} docs/work file(s) present before are byte-identical after`
        : pres.join("; "),
    );
    const todoGone = !existsSync(join(afterDir, "TODO.md"));
    report("real-todo-removed", todoGone, todoGone ? "TODO.md absent after" : "TODO.md still present after (run halted or a conflict is open)");
    console.log(`\nv1-to-v2-fixtures: ${pass} pass, ${fail} fail`);
    process.exit(fail > 0 ? 1 : 0);
  }
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

// --- SCENARIO 3 (SPRINT-111 T1): by-reference sprint + preservation ------------------------------
// input-byref/ holds an active sprint with `## Members` whose two members already exist in
// docs/work/ (one ticked). Migrate maps only the Backlog row (TASK-921); the members are never
// mapped, written or modified.

{
  const ids = v1Ids(INPUT_BYREF);
  const ok = ids.length === 1 && ids[0] === "TASK-921";
  report(
    "byref-members-not-mapped",
    ok,
    ok
      ? `v1 ids from input-byref/ = {${ids.join(", ")}} -- the by-reference sprint's Tn (TASK-922, TASK-923) are not collected`
      : `v1 ids from input-byref/ = {${ids.join(", ")}} -- a by-reference sprint's Tn leaked into the mapped set`,
  );
}

runIdSetCase("id-set-byref", EXPECTED_BYREF, INPUT_BYREF);

{
  const ids = new Set(v1Ids(INPUT_BYREF));
  const before = v1TickedBoxCount(INPUT_BYREF);
  const after = v2TickedBoxCount(EXPECTED_BYREF, ids);
  report("ticked-box-count-byref", before === after, `before (by-value sprints) = ${before}, after (migrated ids only) = ${after}`);
}

{
  const findings = preservationFindings(INPUT_BYREF, EXPECTED_BYREF);
  const n = workFilesRel(INPUT_BYREF).length;
  const ok = n > 0 && findings.length === 0;
  report("preservation-byref", ok, ok ? `${n} member file(s) byte-identical before and after` : `n=${n} ${findings.join("; ")}`);
}

// must-FAIL sibling: a member file altered (its box ticked) -> preservation must redden with the
// NAMED finding; the id-set case on the SAME tree stays green (sibling control).
{
  const findings = preservationFindings(INPUT_BYREF, EXPECTED_BYREF_MEMBER_ALTERED);
  const named = "altered: docs/work/todo/TASK-922-verify-the-upload-steps-exit-code.md";
  const ok = findings.length === 1 && findings[0] === named;
  report(
    "preservation-member-altered (must-FAIL sibling)",
    ok,
    ok
      ? `preservation reddens with exactly the named finding '${named}'`
      : `preservation findings = [${findings.join("; ")}], wanted exactly ['${named}'] -- the check cannot discriminate`,
  );
  const before = v1Ids(INPUT_BYREF);
  const { beforeOnly, afterOnly } = diffIdSets(before, migratedV2Ids(INPUT_BYREF, EXPECTED_BYREF_MEMBER_ALTERED, before));
  const controlOk = beforeOnly.length === 0 && afterOnly.length === 0;
  report(
    "id-set-byref-member-altered (sibling control, must stay PASS)",
    controlOk,
    controlOk
      ? "id-set still agrees on the SAME tree that reddens preservation -- the redden is specific to the altered member"
      : `id set also disagrees: v1∖v2 = {${beforeOnly.join(", ")}}, v2∖v1 = {${afterOnly.join(", ")}}`,
  );
}

// --- SCENARIO 4 (SPRINT-111 T1): an interrupted run resumes to the uninterrupted tree -------------
// interrupted-partial/ is REAL partial state: the migrate procedure run on input/ and stopped
// after 2 task files. Re-running it lands on expected/ iff (a) every store file already written is
// a byte-identical member of expected/ (so the resume's "identical -> skip" branch is what fires),
// (b) TODO.md is still present and untouched (removal only after every id resolves), and (c) the
// run really was partial (fewer files than expected/).

// Two fixture trees in one working copy: EOL depends on the checkout (autocrlf), identically for
// both, so the cross-tree compare ignores CR. (preservationFindings stays raw: its before/after
// are one copy, so a CRLF-only rewrite of a member IS a violation there.)
function sameModuloEol(a: string, b: string): boolean {
  return readFileSync(a, "utf8").replace(/\r\n/g, "\n") === readFileSync(b, "utf8").replace(/\r\n/g, "\n");
}

function resumeFindings(partialRoot: string): string[] {
  const findings: string[] = [];
  const partial = workFilesRel(partialRoot);
  const expected = new Set(workFilesRel(EXPECTED));
  if (partial.length === 0) findings.push("empty-partial");
  if (partial.length >= expected.size) findings.push("not-partial");
  for (const rel of partial) {
    if (!expected.has(rel)) findings.push(`not-in-expected: ${rel}`);
    else if (!sameModuloEol(join(partialRoot, rel), join(EXPECTED, rel))) findings.push(`diverged: ${rel}`);
  }
  if (!existsSync(join(partialRoot, "TODO.md"))) findings.push("todo-missing");
  else if (!sameModuloEol(join(partialRoot, "TODO.md"), join(INPUT, "TODO.md"))) findings.push("todo-altered");
  return findings;
}

{
  const findings = resumeFindings(INTERRUPTED_PARTIAL);
  const ok = findings.length === 0;
  report(
    "resume-partial-subset-of-expected",
    ok,
    ok
      ? `interrupted-partial/ holds ${workFilesRel(INTERRUPTED_PARTIAL).length} of ${workFilesRel(EXPECTED).length} expected file(s), each byte-identical; TODO.md present and untouched`
      : findings.join("; "),
  );
}

// must-FAIL sibling: a written file diverged from expected/ -> the resume case must redden with
// the NAMED finding, while the TODO.md checks on the SAME tree stay green (sibling control).
{
  const findings = resumeFindings(INTERRUPTED_PARTIAL_DIVERGED);
  const named = "diverged: docs/work/backlog/TASK-913-add-a-retry-to-the-flaky-upload-step.md";
  const ok = findings.includes(named);
  report(
    "resume-partial-diverged (must-FAIL sibling)",
    ok,
    ok
      ? `resume case reddens with the named finding '${named}'`
      : `findings = [${findings.join("; ")}], wanted '${named}' -- the check cannot discriminate`,
  );
  const controlOk = !findings.includes("todo-missing") && !findings.includes("todo-altered");
  report(
    "resume-todo-intact-diverged (sibling control, must stay PASS)",
    controlOk,
    controlOk
      ? "TODO.md checks still green on the SAME tree that reddens the resume case -- the redden is specific to the diverged file"
      : `TODO.md checks also red: [${findings.join("; ")}]`,
  );
}

// --- summary --------------------------------------------------------------------------------

console.log(`\nv1-to-v2-fixtures: ${pass} pass, ${fail} fail`);
process.exit(fail > 0 ? 1 : 0);
