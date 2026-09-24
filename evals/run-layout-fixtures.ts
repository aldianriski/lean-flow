// evals/run-layout-fixtures.ts -- retained proof for the v1/v2/mixed layout-detection rule now
// inlined in all 7 queue-touching SKILL.md files (SPRINT-106 T3, EPIC-017 D7, ADR-046, TASK-369).
// Run by Bun: `bun evals/run-layout-fixtures.ts`
//
// WHY RETAINED. TD-012: deleting the fixtures with the prototype leaves the rule unguarded.
//
// THE RULE (owner ruling, hard cut -- EPIC-017 D7 as amended 2026-09-23). Detection is
// EXISTENCE-only, never a read of TODO.md's content: `TODO.md` present and no `docs/work/` -> v1
// . both present -> mixed . only `docs/work/` -> v2 (neither -> a skill's own no-tracker
// behaviour, out of this rule's scope). On v1 or mixed, a skill names the layout it found and does
// NOT perform its queue operation -- it points to `/lean-doc-generator migrate`, the only 2.x path
// that accepts a v1 or mixed tree. `/prime` is the one exception: read-only and must never abort
// (its own red flag), so on v1/mixed it reports a `Layout:` row naming the layout, skips the task
// count, and continues.
//
// WHAT EACH CASE CARRIES.
//   classify-*            must PASS -- classify(root), a reference implementation of exactly the
//                          rule above, run against each fixture tree, asserted to return the named
//                          layout.
//   selection-varying-*   must PASS (L-186 family) -- proves EXISTENCE-only, not content: a v1
//                          fixture whose TODO.md is a real 0-byte file still classifies v1; a v2
//                          fixture whose docs/work/ holds no TASK file (only a .gitkeep) still
//                          classifies v2. If classify() ever started reading file bodies, these are
//                          exactly the cases that would stop reflecting it.
//   text-contract-*       must PASS -- each of the 7 SKILL.md files is read off disk and checked to
//                          contain the anchor phrase VERBATIM plus the literal string
//                          `/lean-doc-generator migrate`; prime's file is additionally checked for
//                          language that reports-and-continues rather than aborting.
//   text-contract-*-refusal-in-span   must PASS (revise round, outside review) -- the anchor and
//                          the migrate pointer being present ANYWHERE in a file each proved nothing
//                          about whether the skill actually said "on this layout, refuse" -- a file
//                          could carry both strings a page apart and still never connect them. So
//                          for each of the 6 REFUSING skills (all but prime), a refusal token
//                          (`refuse`/`refuses`/`stop`/`stops`, case-insensitive) AND the migrate
//                          pointer must both fall inside a REFUSAL_SPAN-character window starting at
//                          the anchor -- i.e. the same paragraph/sentence, not merely the same file.
//   text-contract-*-step-wired        must PASS (same review) -- the anchor being present in a
//                          skill's INTRO prose proved nothing about whether the EXECUTED step that
//                          actually touches `TODO.md` was gated by it. `triage` Flow step 2,
//                          `task-decomposer` Procedure step 7, and `lean-doc-generator`'s promote +
//                          close table rows (plus `prime` Steps step 2 and `handoff`'s status-stub
//                          step 1, wired the same way in this revise round) are checked for the
//                          literal wiring phrase each now carries at its executed step, not just in
//                          the skill's opening paragraph.
//   discrimination proof  a *procedure*, not a fixture (see bottom of this file / the harness
//                          README note in the tail output) -- run twice: once for classify() itself
//                          (mixed folded into the v2 branch, restored from a saved pristine copy,
//                          restore verified with `git diff --no-index`), and once for the text
//                          contract (a skill's refusal line deleted in a SCRATCH COPY of its
//                          SKILL.md, never the real file, with SKILLS_DIR_OVERRIDE pointed at the
//                          scratch copy's parent -- see `skillPath()` below). Both proofs are run by
//                          hand and their verbatim output retained in the SPRINT-106 T3
//                          report/Execution Log rather than baked into the script itself (there is
//                          no smaller tool to break to prove that one honest).
//
// Also: classify() is run against THIS repo's own root and reported (not asserted -- the repo's
// layout is a fact about today, not a fixture invariant) at the very end of the run.

import { existsSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(HERE, "..");
const FIXTURES = join(HERE, "fixtures", "layout");

// Discrimination-proof hook (item 2, SPRINT-106 T3 revise round): when set, a skill's SKILL.md is
// read from `<SKILLS_DIR_OVERRIDE>/<skill>/SKILL.md` if that file exists there, else falls back to
// the real repo copy. This lets the proof mutate ONE skill's file in a scratch directory (never the
// real `skills/` tree) and point only that skill at the mutant, while every other skill still reads
// its real, unmutated file -- so "the other cases stay green" is a real cross-skill assertion, not
// an artifact of the harness also skipping them.
const SKILLS_DIR_OVERRIDE = process.env.LAYOUT_FIXTURES_SKILLS_DIR ?? null;

function skillPath(skill: string): string {
  if (SKILLS_DIR_OVERRIDE) {
    const overridden = join(SKILLS_DIR_OVERRIDE, skill, "SKILL.md");
    if (existsSync(overridden)) return overridden;
  }
  return join(REPO_ROOT, "skills", skill, "SKILL.md");
}

type Layout = "v1" | "v2" | "mixed" | "none";

// The reference implementation -- EXACTLY the rule stated in all 7 SKILL.md files. Existence
// only: `existsSync` never opens/reads either path's content.
function classify(root: string): Layout {
  const hasTodo = existsSync(join(root, "TODO.md"));
  const hasWork = existsSync(join(root, "docs", "work"));
  if (hasTodo && hasWork) return "mixed";
  if (hasTodo) return "v1";
  if (hasWork) return "v2";
  return "none";
}

let pass = 0;
let fail = 0;

function report(name: string, ok: boolean, detail: string) {
  if (ok) {
    console.log(`PASS  layout-fixture: ${name} -- ${detail}`);
    pass++;
  } else {
    console.log(`FAIL  layout-fixture: ${name} -- ${detail}`);
    fail++;
  }
}

// --- (a) classify() against the four named fixture trees -------------------------------------

const NAMED_FIXTURES: Array<[string, Layout]> = [
  ["v1", "v1"],
  ["v2", "v2"],
  ["mixed", "mixed"],
  ["none", "none"],
];

for (const [dir, expected] of NAMED_FIXTURES) {
  const root = join(FIXTURES, dir);
  const actual = classify(root);
  report(
    `classify-${dir}`,
    actual === expected,
    `classify(fixtures/layout/${dir}) = ${actual}, expected ${expected}`,
  );
}

// --- (c) selection-varying: existence-only, not content -----------------------------------------

{
  const root = join(FIXTURES, "v1-empty-todo");
  const todoPath = join(root, "TODO.md");
  const size = existsSync(todoPath) ? readFileSync(todoPath).length : -1;
  const actual = classify(root);
  report(
    "selection-varying-v1-empty-todo",
    size === 0 && actual === "v1",
    `TODO.md is ${size} bytes (must be 0, i.e. really empty) and classify() = ${actual} (must be v1) -- proves the rule reads existence, never content`,
  );
}

{
  const root = join(FIXTURES, "v2-empty-work");
  const workDir = join(root, "docs", "work");
  const hasTaskFile = existsSync(join(workDir, "todo")) &&
    Bun.spawnSync(["bash", "-c", `find '${workDir}' -name 'TASK-*.md' | head -1`]).stdout
      .toString().trim().length > 0;
  const actual = classify(root);
  report(
    "selection-varying-v2-empty-work",
    !hasTaskFile && actual === "v2",
    `docs/work/ holds no TASK-*.md file (only .gitkeep) and classify() = ${actual} (must be v2) -- proves the rule reads existence, never content`,
  );
}

// --- (b) text-contract: each of the 7 SKILL.md files carries the rule --------------------------

// The anchor phrase, verbatim, as written into every one of the 7 files (byte-for-byte identical
// -- copy-pasted at authoring time, not reconstructed here, so this check catches drift in EITHER
// direction).
const ANCHOR =
  "`TODO.md` present and no `docs/work/` → v1 · both present → mixed · only `docs/work/` → v2 (existence only, never content).";
const MIGRATE_POINTER = "/lean-doc-generator migrate";
// Case-insensitive: matches refuse/refuses/refused-style and stop/stops -- the exact wording each
// of the 6 refusing skills actually uses ("refuse to groom", "refuse to write", "Refuse this
// skill's...", "Refuse and point to...", "refuse v1 or mixed by name").
const REFUSAL_RE = /\b(refuses?|stops?)\b/i;
// How close "refuse ... migrate" must sit to the anchor to count as the SAME statement, not two
// unrelated mentions in the same file. Generous enough to cover the longest action sentence written
// (lean-doc-generator's is the longest, ~230 chars past the anchor) with headroom.
const REFUSAL_SPAN = 300;

const SKILLS = [
  "prime",
  "triage",
  "task-decomposer",
  "lean-doc-generator",
  "orchestrator",
  "handoff",
  "flow",
];

// prime is read-only and must never abort -- it is the one skill excluded from the refusal-span
// check below; its own report-and-continue language is checked separately further down.
const REFUSING_SKILLS = SKILLS.filter((s) => s !== "prime");

for (const skill of SKILLS) {
  const path = skillPath(skill);
  const text = readFileSync(path, "utf8");
  const anchorIndex = text.indexOf(ANCHOR);
  const hasAnchor = anchorIndex !== -1;
  const hasMigrate = text.includes(MIGRATE_POINTER);
  report(
    `text-contract-${skill}-anchor`,
    hasAnchor,
    hasAnchor ? "anchor phrase present verbatim" : "anchor phrase MISSING or drifted",
  );
  report(
    `text-contract-${skill}-migrate-pointer`,
    hasMigrate,
    hasMigrate ? `names \`${MIGRATE_POINTER}\`` : `does not name \`${MIGRATE_POINTER}\``,
  );

  if (REFUSING_SKILLS.includes(skill)) {
    const span = hasAnchor ? text.slice(anchorIndex, anchorIndex + REFUSAL_SPAN) : "";
    const spanHasRefusal = REFUSAL_RE.test(span);
    const spanHasMigrate = span.includes(MIGRATE_POINTER);
    const ok = hasAnchor && spanHasRefusal && spanHasMigrate;
    report(
      `text-contract-${skill}-refusal-in-span`,
      ok,
      ok
        ? `a refusal token AND \`${MIGRATE_POINTER}\` both fall within ${REFUSAL_SPAN} chars of the anchor (same statement)`
        : !hasAnchor
          ? "anchor missing -- cannot check the span"
          : `refusal token in span: ${spanHasRefusal}, migrate pointer in span: ${spanHasMigrate} -- not the same statement`,
    );
  }
}

// --- step-wiring: the EXECUTED step that touches TODO.md must reference the layout check, not ----
// --- just the skill's intro paragraph (revise round finding: unwired rule) ------------------------

const STEP_WIRING: Record<string, string[]> = {
  triage: ["**Load** — after the layout check above (v1/mixed stops here):"],
  "task-decomposer": ["7. **Write** — after the layout check above (v1/mixed stops here)"],
  "lean-doc-generator": [
    "**Layout check gates entry (v1/mixed stops here, § above).** **Governance review first**",
    "**Layout check gates entry (v1/mixed stops here, § above).** Verify all DoD",
  ],
  // Wired the same way this revise round, though not named in the MED finding's 3:
  prime: ["count open `- [ ]` tasks — skipped on v1/mixed (§ Resolution layout check)."],
  handoff: ["**Resolve context** — after the layout check above (v1/mixed stops here):"],
};

for (const [skill, phrases] of Object.entries(STEP_WIRING)) {
  const path = skillPath(skill);
  const text = readFileSync(path, "utf8");
  for (const phrase of phrases) {
    const ok = text.includes(phrase);
    // Distinguish rows for lean-doc-generator (promote vs close) by a short tag from the phrase.
    const tag = phrase.includes("Governance review")
      ? "-promote"
      : phrase.includes("Verify all DoD")
        ? "-close"
        : "";
    report(
      `text-contract-${skill}-step-wired${tag}`,
      ok,
      ok
        ? "executed step carries the layout-check reference"
        : "executed step does NOT reference the layout check -- rule is unwired",
    );
  }
}

// prime is the one skill that must not abort -- it reports and continues instead. Check for that
// language specifically, distinct from the generic "refuse" wording the other 6 carry.
{
  const path = skillPath("prime");
  const text = readFileSync(path, "utf8");
  const reportsAndContinues =
    text.includes("prime reports the `Layout:` row") &&
    text.includes("continues") &&
    text.includes("never aborts");
  report(
    "text-contract-prime-reports-and-continues",
    reportsAndContinues,
    reportsAndContinues
      ? "prime's text says it reports the Layout: row, continues, and never aborts"
      : "prime's text does not clearly say report-and-continue-never-abort",
  );
}

// --- summary --------------------------------------------------------------------------------

console.log(`\nlayout-fixtures: ${pass} pass, ${fail} fail`);

// --- informational: classify() against THIS repo's own root -------------------------------------

const repoLayout = classify(REPO_ROOT);
console.log(`\nTHIS REPO (${REPO_ROOT}) classifies as: ${repoLayout}`);
console.log(
  `  TODO.md exists: ${existsSync(join(REPO_ROOT, "TODO.md"))} · docs/work/ exists: ${existsSync(join(REPO_ROOT, "docs", "work"))}`,
);

process.exit(fail > 0 ? 1 : 0);
