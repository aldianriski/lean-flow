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
