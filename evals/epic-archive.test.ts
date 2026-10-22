// evals/epic-archive.test.ts -- must-FAIL/sibling-control/population fixtures for
// scripts/lib/check-epic-archive.ts (TASK-355), run entirely in-process under `bun test` -- no
// subprocess spawn per case. Ports every evals/run-epic-archive-fixtures.sh assertion 1:1 (same
// fixture root, same want-exit, same named-finding substring): that file exercised the SAME 38
// cases against the shell checker via ~38 `sh` spawns at ~2-3s each; this exercises them against the
// TS port via 38 in-process calls, which is the whole point of the port (see
// scripts/lib/check-epic-archive.ts's own header and docs/research/qa-gate-timing.md).
//
// Retained fixtures (TD-012): every case here traces to a real drift class or a named review finding
// -- see evals/run-epic-archive-fixtures.sh's own comments for the full history (TD-144, L-058,
// L-166, L-186) and evals/epic-archive-differential.test.ts for the separate TS-vs-Shell oracle
// comparison, which is the acceptance proof that this file's expectations still match the live
// oracle's behaviour.
import { describe, expect, test } from "bun:test";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { checkEpicArchive } from "../scripts/lib/check-epic-archive.ts";

const FX = fileURLToPath(new URL("fixtures/epic-archive/", import.meta.url)).replace(/[\\/]$/, "");
const FXS = fileURLToPath(new URL("fixtures/epic-state/", import.meta.url)).replace(/[\\/]$/, "");

function assertCase(label: string, root: string, wantExit: number, wantFind: string): void {
  test(label, () => {
    const { lines, exitCode } = checkEpicArchive(root);
    const out = lines.join("\n");
    expect(exitCode, `exit code -- output:\n${out}`).toBe(wantExit);
    expect(out).toContain(wantFind);
  });
}

describe("check-epic-archive.ts fixtures", () => {
  // --- direction (a)/(b): archival retention (evals/run-epic-archive-fixtures.sh cases 1-7) -----
  assertCase("premature", `${FX}/premature`, 1, "archived with 1 § Closed when condition(s) still open");
  assertCase("eligible-unarchived", `${FX}/eligible-unarchived`, 1, "is closed with every § Closed when condition met");
  assertCase("no-conditions", `${FX}/no-conditions`, 1, "archived with no § Closed when conditions at all");
  assertCase("properly-archived (control)", `${FX}/properly-archived`, 0, "archived correctly (2 condition(s), all met, status closed");
  assertCase("live-open (control)", `${FX}/live-open`, 0, "correctly live (status 'active', 1 of 2 condition(s) open)");
  assertCase("archived-member-open", `${FX}/archived-member-open`, 1, "archived while member sprint(s) 906 are still open");
  assertCase("closed-member-open (control)", `${FX}/closed-member-open`, 0, "correctly NOT yet archived");

  // --- direction (c): epic-state rollup currency (cases 8-12) --------------------------------------
  assertCase("a-no-close-commit", `${FXS}/a-no-close-commit`, 1, "SPRINT-910's § Member sprints Status cell carries no close_commit");
  assertCase("a-no-member-row", `${FXS}/a-no-member-row`, 1, "SPRINT-911 is closed but has NO row in § Member sprints");
  assertCase("b-stale-header", `${FXS}/b-stale-header`, 1, "last_updated is 2026-01-01 but its newest closed member sprint closed 2026-02-01");
  assertCase("c-unattributed-tick", `${FXS}/c-unattributed-tick`, 1, "has a ticked § Closed-when condition naming no member sprint");
  assertCase("control-current (control)", `${FXS}/control-current`, 0, "rollup current (every closed member rolled up with its own close_commit");

  // --- reachability: selection-axis cases (13-17) ---------------------------------------------------
  assertCase("r-row-by-prose", `${FXS}/r-row-by-prose`, 1, "SPRINT-921 is closed but has NO row in § Member sprints");
  assertCase("r-live-path", `${FXS}/r-live-path`, 1, "SPRINT-922 is closed but has NO row in § Member sprints");
  assertCase("r-archived-not-flipped", `${FXS}/r-archived-not-flipped`, 1, "SPRINT-923 is closed but has NO row in § Member sprints");
  assertCase("r-wrong-sha", `${FXS}/r-wrong-sha`, 1, "names a close_commit that is not the sprint's own");
  assertCase("r-nonmember-attrib", `${FXS}/r-nonmember-attrib`, 1, "has a ticked § Closed-when condition naming no member sprint");

  // --- selection: id-shape cases (18-20) -------------------------------------------------------------
  assertCase("s-foreign-collision (control)", `${FXS}/s-foreign-collision`, 0, "SPRINT-930 lives outside this repository, and this repository ALSO has a same-numbered Plan");
  assertCase("s-local-collision-twin (sibling control)", `${FXS}/s-local-collision-twin`, 1, "SPRINT-930's § Member sprints Status cell names a close_commit that is not the sprint's own");
  assertCase("s-bare-number-member", `${FXS}/s-bare-number-member`, 1, "SPRINT-930's § Member sprints Status cell names a close_commit that is not the sprint's own");

  // --- selection: epic file depth (21-22) -------------------------------------------------------------
  assertCase("s-archived-depth-open", `${FX}/s-archived-depth-open`, 1, "archived while member sprint(s) 932 are still open");
  assertCase("s-archived-depth-closed (sibling control)", `${FX}/s-archived-depth-closed`, 0, "EPIC-933-f.md archived correctly");

  // --- T5 review findings (23-38) ---------------------------------------------------------------------
  assertCase("s-foreign-open-collision", `${FXS}/s-foreign-open-collision`, 0, "every LOCAL member sprint closed, but 1 member(s) could not be resolved");
  assertCase("s-collision-live-arm", `${FXS}/s-foreign-open-collision`, 0, "ALSO has a same-numbered Plan at docs/sprint/SPRINT-960-m.md");
  assertCase("s-local-first-mixed", `${FXS}/s-local-first-mixed`, 1, "NOTE  epic-archive: docs/epic/EPIC-952-f.md member workdoo SPRINT-001 lives outside this repository");
  assertCase("s-unparsed-regex-poison", `${FXS}/s-unparsed-regex-poison`, 1, "has a ticked § Closed-when condition naming no member sprint");
  assertCase("s-unknown-still-demands", `${FX}/s-unknown-still-demands`, 1, "is closed with every § Closed when condition met and every member sprint closed, but still sits");
  assertCase("s-annotation-only-entry", `${FX}/s-annotation-only-entry`, 0, "NOTE  epic-archive: docs/epic/archive/EPIC-991-f.md has a member_sprints entry naming no sprint number");
  assertCase("s-tick-at-eof", `${FXS}/s-tick-at-eof`, 1, "has a ticked § Closed-when condition naming no member sprint");
  assertCase(
    "s-unparsed-note-verbatim",
    `${FX}/s-template-default-members`,
    0,
    "entry, whitespace collapsed: 'SPRINT-NNN_—_appended_as_each_is_promoted'",
  );

  // --- round 1-4 review findings (24-31) -----------------------------------------------------------
  assertCase("s-allforeign-archived", `${FX}/s-allforeign-archived`, 0, "every LOCAL member sprint closed -- but 2 member(s) could not be resolved");
  assertCase("unknown-member-noted", `${FX}/live-open`, 0, "NOTE  epic-archive: docs/epic/EPIC-903-live.md member SPRINT-903 names no Plan anywhere");
  assertCase("s-template-default-members", `${FX}/s-template-default-members`, 0, "NOTE  epic-archive: docs/epic/archive/EPIC-970-f.md has a member_sprints entry naming no sprint number");
  assertCase("s-template-default-narrowed", `${FX}/s-template-default-members`, 0, "every LOCAL member sprint closed -- but 2 member(s) could not be resolved");
  assertCase("s-mixed-local-foreign", `${FXS}/s-mixed-local-foreign`, 1, "SPRINT-951's § Member sprints Status cell names a close_commit that is not the sprint's own");
  assertCase(
    "s-plain-foreign-note",
    `${FXS}/s-mixed-local-foreign`,
    1,
    "NOTE  epic-archive: docs/epic/EPIC-951-f.md member workdoo SPRINT-001 lives outside this repository -- its rollup row cannot be verified here",
  );
  assertCase("s-unknown-counted", `${FX}/s-unknown-counted`, 0, "every LOCAL member sprint closed -- but 1 member(s) could not be resolved");
  assertCase("s-epic-state-narrowed", `${FXS}/s-foreign-collision`, 0, "rollup current for every LOCAL member -- but 1 member(s) could not be resolved");
});

// --- TASK-474 (TD-130, TD-148 item 1): box shapes and the empty-member archive hole ---------------
// Inline fixtures, written to a temp dir at test time -- deliberately NOT new directories under
// evals/fixtures/, so the frozen Shell/TypeScript differential population does not grow.
function withRepo(files: Record<string, string>, fn: (root: string) => void): void {
  const root = mkdtempSync(join(tmpdir(), "epic-archive-t474-"));
  try {
    for (const [rel, body] of Object.entries(files)) {
      const abs = join(root, rel);
      mkdirSync(dirname(abs), { recursive: true });
      writeFileSync(abs, body);
    }
    fn(root);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

const SPRINT_CLOSED = "---\nsprint: 950\nslug: m\nlast_updated: 2026-02-01\nstatus: closed\nclose_commit: abc1234\n---\n\n# SPRINT-950\n";
const archivedEpic = (members: string, closedWhen: string) =>
  `---\nepic: 950\nslug: f\nstatus: closed\n${members}---\n\n# EPIC-950\n\n## Closed when\n\n${closedWhen}\n`;
const activeEpic = (closedWhen: string) =>
  "---\nepic: 950\nslug: f\nlast_updated: 2026-02-02\nstatus: active\nmember_sprints: [SPRINT-950]\n---\n\n# EPIC-950\n\n" +
  "## Member sprints\n\n| Sprint | Theme | Status | Contributed |\n|---|---|---|---|\n" +
  "| [SPRINT-950](x.md) | M | closed 2026-02-01 · `abc1234` | did it |\n\n" +
  `## Closed when\n\n${closedWhen}\n`;

function runCase(label: string, files: Record<string, string>, wantExit: number, wantFind: string, notFind?: string): void {
  test(label, () => {
    withRepo(files, (root) => {
      const { lines, exitCode } = checkEpicArchive(root);
      const out = lines.join("\n");
      expect(exitCode, `exit code -- output:\n${out}`).toBe(wantExit);
      expect(out).toContain(wantFind);
      if (notFind !== undefined) expect(out).not.toContain(notFind);
    });
  });
}

describe("check-epic-archive.ts TASK-474 box shapes + empty members", () => {
  const sprint = { "docs/sprint/archive/SPRINT-950-m.md": SPRINT_CLOSED };
  const arch = "docs/epic/archive/EPIC-950-f.md";
  const live = "docs/epic/EPIC-950-f.md";

  // [X] closed + indented open box: the total/open readers must both see it.
  runCase(
    "indented-open-box (must-FAIL)",
    { ...sprint, [arch]: archivedEpic("member_sprints: [SPRINT-950]\n", "- [X] a\n  - [ ] b") },
    1,
    "archived with 1 § Closed when condition(s) still open",
  );
  runCase(
    "indented-closed-box (sibling control)",
    { ...sprint, [arch]: archivedEpic("member_sprints: [SPRINT-950]\n", "- [X] a\n  - [x] b") },
    0,
    "archived correctly (2 condition(s)",
  );

  // Attribution reader: an indented [X] box starts its own block, so its missing attribution is seen.
  runCase(
    "indented-X-unattributed (must-FAIL)",
    { ...sprint, [live]: activeEpic("- [x] ships SPRINT-950\n  - [X] second thing") },
    1,
    "has a ticked § Closed-when condition naming no member sprint",
  );
  runCase(
    "indented-X-attributed (sibling control)",
    { ...sprint, [live]: activeEpic("- [x] ships SPRINT-950\n  - [X] second thing SPRINT-950") },
    0,
    "rollup current",
    "naming no member sprint",
  );
  runCase(
    "indented-open-box-flushes (sibling control)",
    { ...sprint, [live]: activeEpic("- [x] ships SPRINT-950\n  - [ ] open sub-item mentioning nothing") },
    0,
    "rollup current",
    "naming no member sprint",
  );

  // Archive branch: no member sprint this checker can read must be named, not vacuously passed.
  const NAMED = "archived with no member sprint this checker can read";
  const cw = "- [x] a\n- [x] b";
  runCase("members-empty-list (must-FAIL)", { [arch]: archivedEpic("member_sprints: []\n", cw) }, 1, NAMED);
  runCase("members-missing-key (must-FAIL)", { [arch]: archivedEpic("", cw) }, 1, NAMED);
  runCase("members-empty-block (must-FAIL)", { [arch]: archivedEpic("member_sprints:\n", cw) }, 1, NAMED);
  runCase(
    "members-block-sequence (must-FAIL)",
    { ...sprint, [arch]: archivedEpic("member_sprints:\n  - SPRINT-950\n", cw) },
    1,
    NAMED,
  );
  runCase(
    "members-one-closed (sibling control)",
    { ...sprint, [arch]: archivedEpic("member_sprints: [SPRINT-950]\n", cw) },
    0,
    "archived correctly (2 condition(s)",
    NAMED,
  );
});

// --- TASK-481 (TD-148 items 2, 4, 5): unbalanced annotation, both suffix anchors, frontmatter-only ---
// Inline fixtures again (no new directories under evals/fixtures/). INTENTIONAL DIVERGENCE from the
// frozen scripts/lib/check-epic-archive.sh: the Shell oracle still classes an unbalanced-paren entry as
// a foreign repo and reads member_sprints: from anywhere in the file; the differential's 32 fixture
// roots and the real root contain neither shape, so it stays green.
describe("check-epic-archive.ts TASK-481 unbalanced annotation, suffix anchors, frontmatter-only", () => {
  const sprint = { "docs/sprint/archive/SPRINT-801-m.md": SPRINT_CLOSED.replace("950", "801") };
  const liveClosed = (members: string) =>
    `---\nepic: 950\nslug: f\nstatus: closed\nmember_sprints: ${members}\n---\n\n# EPIC-950\n\n## Closed when\n\n- [x] a\n- [x] b\n`;
  const live = "docs/epic/EPIC-950-f.md";
  const STILL = "still sits in docs/epic/";
  const FOREIGN = "lives outside this repository";
  const UNPARSED = "has a member_sprints entry naming no sprint number";

  // Item 2: an unbalanced annotation is unparsed, never a foreign repo (no foreign exemption).
  runCase("unbalanced-open-paren (must-FAIL)", { ...sprint, [live]: liveClosed("[SPRINT-801, (closed 802]") }, 1, STILL, FOREIGN);
  runCase("unbalanced-open-paren-note", { ...sprint, [live]: liveClosed("[SPRINT-801, (closed 802]") }, 1, UNPARSED, FOREIGN);
  runCase("unbalanced-close-paren (must-FAIL)", { ...sprint, [live]: liveClosed("[SPRINT-801, closed 802)]") }, 1, STILL, FOREIGN);
  runCase("balanced-annotation (sibling control)", { ...sprint, [live]: liveClosed("[SPRINT-801, SPRINT-801 (closed)]") }, 1, STILL, UNPARSED);
  runCase(
    "real-foreign-entry (sibling control)",
    { ...sprint, [live]: liveClosed("[SPRINT-801, workdoo SPRINT-802]") },
    0,
    "reported rather than required",
  );

  // Item 4: each suffix anchor decides its own verdict. SPRINT-91 must never match SPRINT-910.
  const s91 = { "docs/sprint/archive/SPRINT-91-m.md": SPRINT_CLOSED.replace("950", "91") };
  const epic91 = (row: string, tick: string) =>
    "---\nepic: 950\nslug: f\nlast_updated: 2026-02-02\nstatus: active\nmember_sprints: [SPRINT-91]\n---\n\n# EPIC-950\n\n" +
    `## Member sprints\n\n| Sprint | Theme | Status | Contributed |\n|---|---|---|---|\n${row}\n\n## Closed when\n\n- [x] ${tick}\n`;
  const row = (n: string) => `| [SPRINT-${n}](x.md) | M | closed 2026-02-01 · \`abc1234\` | did it |`;
  runCase("anchor-member-id-cell (must-FAIL)", { ...s91, [live]: epic91(row("910"), "ships SPRINT-91") }, 1, "SPRINT-91 is closed but has NO row in § Member sprints");
  runCase("anchor-member-id-cell (sibling control)", { ...s91, [live]: epic91(row("91"), "ships SPRINT-91") }, 0, "rollup current", "NO row");
  runCase("anchor-closed-when (must-FAIL)", { ...s91, [live]: epic91(row("91"), "ships SPRINT-910") }, 1, "naming no member sprint");
  runCase("anchor-closed-when (sibling control)", { ...s91, [live]: epic91(row("91"), "ships SPRINT-91") }, 0, "rollup current", "naming no member sprint");

  // Item 5: member_sprints: is read from the frontmatter only.
  const bodyOnly =
    "---\nepic: 950\nslug: f\nstatus: closed\n---\n\n# EPIC-950\n\n```yaml\nmember_sprints: [SPRINT-950]\n```\n\n## Closed when\n\n- [x] a\n- [x] b\n";
  const NAMED = "archived with no member sprint this checker can read";
  runCase("members-in-body-fence (must-FAIL)", { ...{ "docs/sprint/archive/SPRINT-950-m.md": SPRINT_CLOSED }, ["docs/epic/archive/EPIC-950-f.md"]: bodyOnly }, 1, NAMED);
  runCase(
    "members-in-frontmatter (sibling control)",
    { "docs/sprint/archive/SPRINT-950-m.md": SPRINT_CLOSED, ["docs/epic/archive/EPIC-950-f.md"]: archivedEpic("member_sprints: [SPRINT-950]\n", "- [x] a\n- [x] b") },
    0,
    "archived correctly (2 condition(s)",
    NAMED,
  );
  const unterminated = "---\nepic: 950\nstatus: closed\nmember_sprints: [SPRINT-950]\n\n## Closed when\n\n- [x] a\n- [x] b\n";
  runCase("members-unterminated-frontmatter (must-FAIL)", { "docs/epic/archive/EPIC-950-f.md": unterminated }, 1, NAMED);
});
