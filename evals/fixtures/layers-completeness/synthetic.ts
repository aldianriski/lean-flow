// evals/fixtures/layers-completeness/synthetic.ts -- the SPRINT-097 T3 (TD-142) and SPRINT-099 T3
// (TD-145) synthetic fixtures for check-layers-completeness.sh, built at runtime rather than
// committed as static files (see evals/run-layers-completeness-fixtures.sh's own header for why: the
// sprint that authored them declared this harness script and its siblings in Layers:, not a fixture
// directory, so a NEW committed fixture file would read as changed-but-undeclared to
// check-layers-observed.sh).
//
// SHARED between evals/layers-completeness.test.ts (the always-on TS-evaluator suite) and
// evals/layers-completeness-differential.ts (the Shell-oracle differential proof) so the two never
// carry two independently-drifting copies of the same fixture text -- exactly the class of duplication
// TD-142 itself was filed about, one level up.
import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { posix } from "node:path";

export function buildSubstringFixture(workDir: string): string {
  const p = posix.join(workDir, "substring-declaration-not-declared.md");
  writeFileSync(
    p,
    `---
sprint: 902
slug: substring-declaration-not-declared
status: active
plan_commit: fixture
update_trigger: fixture -- must-FAIL input, built by evals/run-layers-completeness-fixtures.sh
  (SPRINT-097 T3, TD-142), not a real sprint file. Reproduces the SILENT direction of TD-142's
  divergence, now fixed: membership used to be a SUBSTRING test against the raw Layers: line, so a
  DoD-implied token merely appearing inside a longer declared path (T1) or an unbackticked trailing
  comment (T2) read as "declared" -- L-108's shape, failing GREEN. T2 also exercises the NEW
  layers-unbackticked-token finding. T3 is the sibling control.
---

## Plan

### T1 — a DoD-implied token sits INSIDE a longer declared path
Layers: \`scripts/lib/other-config.sh\`
Depends-on: none

config.sh and the declared file above are two distinct files. The declared path merely CONTAINS
\`config.sh\`'s text as a substring; that is not a declaration of the shorter file.

**Acceptance:** \`config.sh\` is recognised as undeclared even though its name sits inside the text of
the longer, genuinely-declared path above.

**DoD:**
- [ ] \`config.sh\` is updated

### T2 — a DoD-implied token sits INSIDE an unbackticked trailing comment on Layers:
Layers: \`scripts/lib/check-layers-completeness.sh\` (also touches config.sh conceptually)
Depends-on: none

The parenthetical is prose commentary on the Layers: line, not a second, backtick-delimited
declaration -- and per the 2026-09-10 backtick ruling it never was one.

**Acceptance:** \`config.sh\` is recognised as undeclared, and the bare mention in the parenthetical is
itself named as a declaration written outside backticks.

**DoD:**
- [ ] \`config.sh\` is updated

### T3 — sibling control: an ordinary, correct declaration
Layers: \`config.sh\`
Depends-on: none

The declared file matches the implied file exactly, entirely inside backticks. This block must stay
green under both the substring-fix and the new unbackticked-token check.

**Acceptance:** the declared file matches the implied file exactly.

**DoD:**
- [ ] \`config.sh\` is updated
`,
  );
  return p;
}

export function buildArchiveSelectionPair(workDir: string): { archived: string; live: string } {
  const archiveDir = posix.join(workDir, "archive");
  execFileSync("mkdir", ["-p", archiveDir]);
  const archived = posix.join(archiveDir, "SPRINT-999-archived-should-be-skipped.md");
  writeFileSync(
    archived,
    `---
sprint: 999
slug: archived-should-be-skipped
status: closed
plan_commit: fixture
close_commit: fixture
update_trigger: fixture -- SELECTION fixture (L-186), built by evals/run-layers-completeness-fixtures.sh
  under a path carrying an archive/ segment on purpose. Carries a real, undeclared DoD-implied file
  so that if the archive skip were ever silently dropped this fixture would start failing loudly.
---

## Plan

### T1 — a real completeness violation, deliberately never checked
Layers: \`foo.txt\`
Depends-on: none

This Plan must never be evaluated at all -- it lives under an \`archive/\` path segment on purpose.

**Acceptance:** n/a -- reaching this block would itself be the defect under test.

**DoD:**
- [ ] \`bar.txt\` is created, and never declared in Layers: above -- a real completeness violation that
      must never surface, because this Plan is archived
`,
  );
  const live = posix.join(workDir, "archive-sibling-live.md");
  writeFileSync(
    live,
    `---
sprint: 998
slug: archive-sibling-live
status: active
plan_commit: fixture
update_trigger: fixture -- sibling control for the archive-path-excluded case (L-186). Carries the
  SAME completeness violation shape as its archived sibling, but on a LIVE Plan (no archive/ path
  segment) -- it must still FAIL by name in the same run the archived sibling is silently skipped.
---

## Plan

### T1 — the same violation shape, on a Plan that IS in scope
Layers: \`foo.txt\`
Depends-on: none

**Acceptance:** \`bar.txt\` is recognised as undeclared -- this Plan is live, so it must be evaluated.

**DoD:**
- [ ] \`bar.txt\` is created, and never declared in Layers: above -- a real completeness violation
`,
  );
  return { archived, live };
}

export function buildCaseVariantFixture(workDir: string): string {
  const capDir = posix.join(workDir, "Archive");
  execFileSync("mkdir", ["-p", capDir]);
  const p = posix.join(capDir, "SPRINT-997-case-variant-archived.md");
  writeFileSync(
    p,
    `---
sprint: 997
slug: case-variant-archived
status: closed
plan_commit: fixture
close_commit: fixture
update_trigger: fixture -- CASING selection axis (SPRINT-099 T3). Written under \`Archive/\` with a
  capital A on purpose. Where that is the same directory as \`archive/\`, this Plan must be skipped
  exactly as its lowercase sibling is; where it is genuinely a different directory, it must be
  evaluated. Carries a real violation so a silently dropped skip would surface loudly.
---

## Plan

### T1 — a real completeness violation under a case-variant archive path
Layers: \`foo.txt\`
Depends-on: none

**Acceptance:** n/a -- whether this block is evaluated is the property under test.

**DoD:**
- [ ] \`bar.txt\` is created, and never declared in Layers: above -- a real completeness violation
`,
  );
  return p;
}
