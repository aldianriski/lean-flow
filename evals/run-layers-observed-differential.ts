// evals/run-layers-observed-differential.ts -- SPRINT-103 T2: byte-for-byte differential parity
// between scripts/lib/check-layers-observed.sh (the ORACLE, unchanged) and its TypeScript port
// scripts/lib/check-layers-observed.ts. Mirrors evals/layers-completeness-differential.ts's own role
// and evals/run-doc-caps-differential.ts's shape: the TS port moves off the always-on gate leg's
// subprocess cost, and THIS is the thing that still compares it against a LIVE Shell oracle, row by
// row, exit code AND stdout, both invoked as real CLI subprocesses (not in-process) so the comparison
// exercises the actual argv/cwd-resolution path both take -- this checker's whole subject is git
// state relative to `cwd`, unlike check-layers-completeness's pure text-file checks.
//
// SHELL RETAINS AUTHORITY (D5). check-layers-observed.sh is the oracle; check-layers-observed.ts is
// the migrated implementation being checked AGAINST it. Any divergence is a defect in the TS port --
// fix the port, never "improve" on the shell behaviour. Not wired into qa-check.sh (reported as a
// reviewable diff instead, per this task's hard constraints).
//
// Run: bun evals/run-layers-observed-differential.ts
//
// POPULATION COVERED (CLAUDE.md Anti-Patterns (iv) -- vary the SELECTION, not just the verdict):
//   1. bare invocation (zero args) and a missing-file argument
//   2. ~19 TS-built throwaway git repos (evals/fixtures/layers-observed/git-fixtures.ts), one per
//      distinct branch the checker has: every plan_commit state, committed-path attribution (Task:
//      trailer, subject forms, qualifier widening, ambiguous-qualifier fallthrough, governance
//      all-or-nothing, ownership/sibling scoping, archived-sibling ownership), the WIP-vs-committed
//      divergence, structural + close-time exclusions, and the unbackticked-declaration finding.
//      Each fixture also asserts a NAMED finding against the PORT's own output (not merely "matches
//      the oracle"), with a sibling control alongside every must-FAIL case, per CLAUDE.md's bar.
//   3. the REAL sprint corpus in this repository: (a) the ACTIVE, non-archived sprint file(s) --
//      qa-check.sh's own call shape (`sh check-layers-observed.sh $(ls docs/sprint/SPRINT-*.md)`,
//      non-recursive, archive/ never enters that glob) -- this is what proves the comparison examines
//      REAL, NON-EMPTY output rather than the two-empty-outputs-agree trap CLAUDE.md's L-198 note
//      names (hit twice in SPRINT-102: comparing only the archived corpus, which this checker skips
//      unconditionally, proves nothing); (b) that same file list WITH every archived sprint appended,
//      combined into one invocation, bisected on divergence -- proving the archive-skip holds at the
//      full real population's scale, not merely for one hand-picked path.
//
// SCOPE NOTE, stated rather than silently narrowed: check-layers-completeness-differential.ts's own
// population 4b additionally COPIES every real (including archived) sprint's CONTENT to a forced
// non-archived path, to exercise that checker's full text-parsing logic on real prose. That trick
// does not transfer here. check-layers-completeness is git-independent (pure text); forcing an
// ARCHIVED sprint's content to be fully evaluated here would mean running `git rev-list
// <its plan_commit>..HEAD` against the CURRENT repository HEAD -- for a sprint archived long ago,
// that range can span thousands of unrelated commits, which is both prohibitively slow (this port
// exists specifically to cut the cost of walking such ranges) and semantically meaningless: in real
// usage (qa-check.sh's leg 15) an archived sprint's content is NEVER evaluated at a live path, only
// skipped. This population is therefore scoped to what the checker is actually asked to do: evaluate
// what is live, skip what is archived -- proven at real scale in 3(b), and proven to carry real
// findings, not silence, in 3(a) and the git-fixture population.
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { posix } from "node:path";
import { commitAll, gitInit, headSha, lockPlan, setDodTicked, writeFile } from "./fixtures/layers-observed/git-fixtures.ts";

const toPosix = (p: string): string => p.replace(/\\/g, "/");
const repoRoot = posix.join(toPosix(import.meta.dir), "..");
const shChecker = posix.join(repoRoot, "scripts/lib/check-layers-observed.sh");
const tsChecker = posix.join(repoRoot, "scripts/lib/check-layers-observed.ts");

interface Outcome {
  code: number;
  out: string;
}

function runOracle(cwd: string, args: readonly string[]): Outcome {
  try {
    const out = execFileSync("sh", [shChecker, ...args], { cwd, encoding: "utf8" });
    return { code: 0, out };
  } catch (e) {
    const err = e as { status: number | null; stdout?: string; stderr?: string };
    return { code: err.status ?? 1, out: (err.stdout ?? "") + (err.stderr ?? "") };
  }
}

function runPort(cwd: string, args: readonly string[]): Outcome {
  try {
    const out = execFileSync("bun", [tsChecker, ...args], { cwd, encoding: "utf8" });
    return { code: 0, out };
  } catch (e) {
    const err = e as { status: number | null; stdout?: string; stderr?: string };
    return { code: err.status ?? 1, out: (err.stdout ?? "") + (err.stderr ?? "") };
  }
}

let total = 0;
let identical = 0;
const divergences: string[] = [];

function diverges(oracle: Outcome, port: Outcome): boolean {
  return oracle.code !== port.code || oracle.out !== port.out;
}

function reportDivergence(label: string, args: readonly string[], oracle: Outcome, port: Outcome) {
  const detail: string[] = [`DIVERGENCE: ${label}`, `  args: ${JSON.stringify(args)}`];
  if (oracle.code !== port.code) detail.push(`  exit: oracle=${oracle.code} port=${port.code}`);
  if (oracle.out !== port.out) {
    const oLines = oracle.out.split("\n");
    const pLines = port.out.split("\n");
    const max = Math.max(oLines.length, pLines.length);
    for (let i = 0; i < max; i++) {
      if (oLines[i] !== pLines[i]) {
        detail.push(`  line ${i}: oracle=${JSON.stringify(oLines[i] ?? "<eof>")}`);
        detail.push(`           port=${JSON.stringify(pLines[i] ?? "<eof>")}`);
      }
    }
  }
  divergences.push(detail.join("\n"));
}

function compare(label: string, cwd: string, args: readonly string[]): { oracle: Outcome; port: Outcome } {
  total++;
  const oracle = runOracle(cwd, args);
  const port = runPort(cwd, args);
  if (!diverges(oracle, port)) identical++;
  else reportDivergence(label, args, oracle, port);
  return { oracle, port };
}

function compareBatchWithBisection(label: string, cwd: string, files: readonly string[]) {
  total++;
  const oracle = runOracle(cwd, files);
  const port = runPort(cwd, files);
  if (!diverges(oracle, port)) {
    identical++;
    return;
  }
  if (files.length <= 1) {
    reportDivergence(label, files, oracle, port);
    return;
  }
  const mid = Math.floor(files.length / 2);
  compareBatchWithBisection(`${label} [bisect left of ${files.length}]`, cwd, files.slice(0, mid));
  compareBatchWithBisection(`${label} [bisect right of ${files.length}]`, cwd, files.slice(mid));
}

// --- fixture-level assertions against the PORT's own output (CLAUDE.md's bar: a must-FAIL fixture
// with its NAMED finding, plus a sibling control) -- independent of whether the oracle was spawned,
// so these still mean something if the differential above is ever run with the oracle unavailable. --
let checks = 0;
let checksPassed = 0;
function assertContains(label: string, haystack: string, needle: string) {
  checks++;
  if (haystack.includes(needle)) {
    checksPassed++;
    console.log(`PASS  fixture(${label})`);
  } else {
    console.log(`FAIL  fixture(${label}): expected to find ${JSON.stringify(needle)} in:\n${haystack}`);
  }
}
function assertNotContains(label: string, haystack: string, needle: string) {
  checks++;
  if (!haystack.includes(needle)) {
    checksPassed++;
    console.log(`PASS  fixture(${label})`);
  } else {
    console.log(`FAIL  fixture(${label}): did NOT expect to find ${JSON.stringify(needle)} in:\n${haystack}`);
  }
}
function assertExitCode(label: string, out: Outcome, want: number) {
  checks++;
  if (out.code === want) {
    checksPassed++;
    console.log(`PASS  fixture(${label})`);
  } else {
    console.log(`FAIL  fixture(${label}): expected exit ${want}, got ${out.code}`);
  }
}

const progress = (msg: string) => console.error(`[progress] ${msg}`);

const work = mkdtempSync(posix.join(toPosix(tmpdir()), "lo-diff-"));
let filesActive = 0;
let filesArchived = 0;
try {
  // ================================================================================================
  // population 1: bare invocation + missing file
  // ================================================================================================
  {
    const { port } = compare("bare invocation", repoRoot, []);
    assertContains("bare-invocation-notes-nothing-verified", port.out, "layers observed: no sprint files given -- nothing verified");
    assertExitCode("bare-invocation-exit-0", port, 0);
  }
  {
    const { port } = compare("file not found", repoRoot, ["docs/sprint/SPRINT-999999-does-not-exist.md"]);
    assertContains("file-not-found", port.out, "layers observed: file not found: docs/sprint/SPRINT-999999-does-not-exist.md");
    assertExitCode("file-not-found-exit-1", port, 1);
  }
  progress("population 1 done: bare invocation + file-not-found");

  // ================================================================================================
  // population 2: TS-built git fixtures, one per distinct branch
  // ================================================================================================

  // -- plan_commit states -------------------------------------------------------------------------
  {
    const d = posix.join(work, "plan-commit-genuinely-absent");
    gitInit(d);
    writeFile(
      d,
      "docs/sprint/SPRINT-904-absent.md",
      `---\nsprint: 904\nslug: absent\nstatus: active\nplan_commit:\n---\n\n## Plan\n\n### T1 — edit foo.txt\nLayers: \`foo.txt\`\nDepends-on: none\n\n**DoD:**\n- [ ] foo.txt updated\n`,
    );
    writeFile(d, "foo.txt", "a\n");
    commitAll(d, "plan locked, plan_commit field never wired in");
    const { port } = compare("plan-commit-genuinely-absent", d, ["docs/sprint/SPRINT-904-absent.md"]);
    assertContains("plan-commit-genuinely-absent", port.out, "plan_commit not recorded in frontmatter");
  }
  {
    const d = posix.join(work, "plan-commit-placeholder");
    gitInit(d);
    writeFile(
      d,
      "docs/sprint/SPRINT-901-placeholder.md",
      `---\nsprint: 901\nslug: placeholder\nstatus: active\nplan_commit: [sha — set at promote]\n---\n\n## Plan\n\n### T1 — edit foo.txt\nLayers: \`foo.txt\`\nDepends-on: none\n\n**DoD:**\n- [ ] foo.txt updated\n`,
    );
    writeFile(d, "foo.txt", "a\n");
    commitAll(d, "plan locked, plan_commit not yet recorded (placeholder window)");
    const { port } = compare("plan-commit-placeholder", d, ["docs/sprint/SPRINT-901-placeholder.md"]);
    assertContains("plan-commit-placeholder (SKIP, not FAIL)", port.out, "SKIP  docs/sprint/SPRINT-901-placeholder.md layers observed: plan_commit still holds the promote-time placeholder");
    assertExitCode("plan-commit-placeholder-exit-0", port, 0);
  }
  {
    const d = posix.join(work, "plan-commit-unresolvable");
    gitInit(d);
    writeFile(
      d,
      "docs/sprint/SPRINT-903-badsha.md",
      `---\nsprint: 903\nslug: badsha\nstatus: active\nplan_commit: totally-bogus-not-a-sha\n---\n\n## Plan\n\n### T1 — edit foo.txt\nLayers: \`foo.txt\`\nDepends-on: none\n\n**DoD:**\n- [ ] foo.txt updated\n`,
    );
    writeFile(d, "foo.txt", "a\n");
    commitAll(d, "sprint file references a plan_commit that was never actually committed");
    const { port } = compare("plan-commit-unresolvable", d, ["docs/sprint/SPRINT-903-badsha.md"]);
    assertContains("plan-commit-unresolvable", port.out, "plan_commit 'totally-bogus-not-a-sha' does not resolve to a commit");
  }
  progress("population 2a done: plan_commit states");

  // -- matching declaration (sibling control shape used repeatedly below) -------------------------
  {
    const d = posix.join(work, "matching-declaration");
    gitInit(d);
    writeFile(
      d,
      "docs/sprint/SPRINT-900-matching.md",
      `---\nsprint: 900\nslug: matching\nstatus: active\nplan_commit: PLAN_COMMIT_PLACEHOLDER\n---\n\n## Plan\n\n### T1 — edit two declared files\nLayers: \`foo.txt\` · \`bar.txt\`\nDepends-on: none\n\n**DoD:**\n- [ ] foo.txt and bar.txt updated\n`,
    );
    writeFile(d, "foo.txt", "a\n");
    writeFile(d, "bar.txt", "b\n");
    lockPlan(d, "docs/sprint/SPRINT-900-matching.md");
    writeFile(d, "foo.txt", "a\na2\n");
    writeFile(d, "bar.txt", "b\nb2\n");
    commitAll(d, "sprint(900) T1: implement");
    const { port } = compare("matching-declaration", d, ["docs/sprint/SPRINT-900-matching.md"]);
    assertContains("matching-declaration (clean PASS)", port.out, "layers observed (all changed files declared");
  }

  // -- cross-task declaration: T1 edits T2's declared file -- must FAIL, names T1 -------------------
  {
    const d = posix.join(work, "cross-task-declaration");
    gitInit(d);
    writeFile(
      d,
      "docs/sprint/SPRINT-908-crosstask.md",
      `---\nsprint: 908\nslug: crosstask\nstatus: active\nplan_commit: PLAN_COMMIT_PLACEHOLDER\n---\n\n## Plan\n\n### T1 — edit only foo.txt\nLayers: \`foo.txt\`\nDepends-on: none\n\n**DoD:**\n- [ ] foo.txt updated\n\n### T2 — edit only bar.txt\nLayers: \`bar.txt\`\nDepends-on: none\n\n**DoD:**\n- [ ] bar.txt updated\n`,
    );
    writeFile(d, "foo.txt", "a\n");
    writeFile(d, "bar.txt", "b\n");
    lockPlan(d, "docs/sprint/SPRINT-908-crosstask.md");
    writeFile(d, "foo.txt", "a\na2\n");
    writeFile(d, "bar.txt", "b\nb2\n");
    commitAll(d, "sprint(908) T1: edit foo and, wrongly, bar");
    const { port } = compare("cross-task-declaration", d, ["docs/sprint/SPRINT-908-crosstask.md"]);
    assertContains("cross-task-declaration (fails)", port.out, "changed by a task that never declared it:");
    assertContains("cross-task-declaration (names T1:bar.txt)", port.out, "T1:bar.txt");
  }

  // -- TWO trailing parentheticals in one subject -- the LAST one wins (SPRINT-103 T2 review) ----
  // The oracle's rule 4 is an unanchored, greedy sed (`s/.*(SPRINT-...\(T[0-9]\{1,\}\)).*/\1/p`);
  // POSIX leftmost-longest makes that `.*` select the LAST citation. The port originally used a
  // non-greedy `.exec()` and took the FIRST, so a squash/merge subject citing two tasks produced a
  // false-positive FAIL on input the oracle passes clean. No fixture reached it: `git log --all`
  // over this repo's whole history has ZERO subjects with two citations, and every constructed
  // fixture carried one -- first-match and last-match agree on every single-citation input. The
  // gap was an AXIS (how many citations does one subject carry), not a branch anyone had skipped.
  // Retained permanently: this is the only case in the suite that varies that axis.
  {
    const d = posix.join(work, "two-parentheticals");
    gitInit(d);
    writeFile(
      d,
      "docs/sprint/SPRINT-931-two-cites.md",
      `---\nsprint: 931\nslug: two-cites\nstatus: active\nplan_commit: PLAN_COMMIT_PLACEHOLDER\n---\n\n## Plan\n\n### T1 — edit t1own.txt\nLayers: \`t1own.txt\`\nDepends-on: none\n\n**DoD:**\n- [ ] t1own.txt updated\n\n### T2 — edit t2own.txt\nLayers: \`t2own.txt\`\nDepends-on: none\n\n**DoD:**\n- [ ] t2own.txt updated\n`,
    );
    writeFile(d, "t1own.txt", "a\n");
    writeFile(d, "t2own.txt", "b\n");
    lockPlan(d, "docs/sprint/SPRINT-931-two-cites.md");
    // Touches ONLY T2's file, and cites T1 FIRST, T2 LAST. Last-match => T2 => declared => PASS.
    // First-match => T1 => "T1 changed a file it never declared" => a FAIL the oracle never raises.
    writeFile(d, "t2own.txt", "b\nb2\n");
    commitAll(d, "apply the same fix as before (SPRINT-100 T1) and again (SPRINT-931 T2)");
    const { port } = compare("two-parentheticals-last-wins", d, ["docs/sprint/SPRINT-931-two-cites.md"]);
    assertContains("two-parentheticals-last-wins (PASS, attributed to T2)", port.out, "layers observed (all changed files declared");
    assertNotContains("two-parentheticals-last-wins (must NOT blame T1)", port.out, "T1:t2own.txt");
  }

  // -- sibling control: ONE trailing parenthetical, same shape -- proves the case above is not
  // passing merely because the file is declared somewhere ---------------------------------------
  {
    const d = posix.join(work, "one-parenthetical");
    gitInit(d);
    writeFile(
      d,
      "docs/sprint/SPRINT-932-one-cite.md",
      `---\nsprint: 932\nslug: one-cite\nstatus: active\nplan_commit: PLAN_COMMIT_PLACEHOLDER\n---\n\n## Plan\n\n### T1 — edit t1own.txt\nLayers: \`t1own.txt\`\nDepends-on: none\n\n**DoD:**\n- [ ] t1own.txt updated\n\n### T2 — edit t2own.txt\nLayers: \`t2own.txt\`\nDepends-on: none\n\n**DoD:**\n- [ ] t2own.txt updated\n`,
    );
    writeFile(d, "t1own.txt", "a\n");
    writeFile(d, "t2own.txt", "b\n");
    lockPlan(d, "docs/sprint/SPRINT-932-one-cite.md");
    // One citation naming T1, but the commit touches T2's file: must FAIL, naming T1:t2own.txt.
    writeFile(d, "t2own.txt", "b\nb2\n");
    commitAll(d, "apply the fix (SPRINT-932 T1)");
    const { port } = compare("one-parenthetical-control", d, ["docs/sprint/SPRINT-932-one-cite.md"]);
    assertContains("one-parenthetical-control (FAILs, names T1:t2own.txt)", port.out, "T1:t2own.txt");
  }

  // -- unattributable commit -- must FAIL ------------------------------------------------------
  {
    const d = posix.join(work, "unattributable-commit");
    gitInit(d);
    writeFile(
      d,
      "docs/sprint/SPRINT-909-unattributed.md",
      `---\nsprint: 909\nslug: unattributed\nstatus: active\nplan_commit: PLAN_COMMIT_PLACEHOLDER\n---\n\n## Plan\n\n### T1 — edit foo.txt\nLayers: \`foo.txt\`\nDepends-on: none\n\n**DoD:**\n- [ ] foo.txt updated\n`,
    );
    writeFile(d, "foo.txt", "a\n");
    lockPlan(d, "docs/sprint/SPRINT-909-unattributed.md");
    writeFile(d, "foo.txt", "a\na2\n");
    commitAll(d, "fix(qa): a real change with no task id anywhere in it");
    const { port } = compare("unattributable-commit", d, ["docs/sprint/SPRINT-909-unattributed.md"]);
    assertContains("unattributable-commit", port.out, "commit attributable to no task and not coordinator bookkeeping:");
  }

  // -- Task: trailer attributes a commit whose subject says nothing -- must PASS (sibling control
  // for the unattributable case above: same shape, +1 trailer) --------------------------------
  {
    const d = posix.join(work, "task-trailer");
    gitInit(d);
    writeFile(
      d,
      "docs/sprint/SPRINT-910-trailer.md",
      `---\nsprint: 910\nslug: trailer\nstatus: active\nplan_commit: PLAN_COMMIT_PLACEHOLDER\n---\n\n## Plan\n\n### T1 — edit foo.txt\nLayers: \`foo.txt\`\nDepends-on: none\n\n**DoD:**\n- [ ] foo.txt updated\n`,
    );
    writeFile(d, "foo.txt", "a\n");
    lockPlan(d, "docs/sprint/SPRINT-910-trailer.md");
    writeFile(d, "foo.txt", "a\na2\n");
    commitAll(d, "fix(qa): a real change with no task id in the subject\n\nTask: T1");
    const { port } = compare("task-trailer-attributes", d, ["docs/sprint/SPRINT-910-trailer.md"]);
    assertContains("task-trailer-attributes (sibling control: PASS)", port.out, "layers observed (all changed files declared");
  }
  progress("population 2b done: committed-path attribution basics");

  // -- coordinator close-bookkeeping: reported during execution, excluded at close (two phases) ----
  {
    const d = posix.join(work, "coordinator-exclusion");
    gitInit(d);
    writeFile(
      d,
      "docs/sprint/SPRINT-905-exclusion.md",
      `---\nsprint: 905\nslug: exclusion\nstatus: active\nplan_commit: PLAN_COMMIT_PLACEHOLDER\n---\n\n## Plan\n\n### T1 — edit foo.txt only\nLayers: \`foo.txt\`\nDepends-on: none\n\n**DoD:**\n- [ ] foo.txt updated\n`,
    );
    writeFile(d, "foo.txt", "a\n");
    writeFile(d, "TECH-DEBT.md", "# TD\n");
    lockPlan(d, "docs/sprint/SPRINT-905-exclusion.md");
    writeFile(d, "foo.txt", "a\na2\n");
    writeFile(d, "TECH-DEBT.md", "# TD\nTD-099 resolved\n");
    writeFile(d, "docs/sprint/INDEX.md", "| 905 | exclusion | 2026-08-01 |\n");
    let r = compare("coordinator-exclusion (during execution)", d, ["docs/sprint/SPRINT-905-exclusion.md"]);
    assertContains("closetime-file-during-execution (reported)", r.port.out, "changed but undeclared in any task's Layers:: TECH-DEBT.md");
    setDodTicked(d, "docs/sprint/SPRINT-905-exclusion.md");
    r = compare("coordinator-exclusion (at close)", d, ["docs/sprint/SPRINT-905-exclusion.md"]);
    assertContains("closetime-file-at-close (excluded, sibling control)", r.port.out, "layers observed [WIP, unattributed]");
    assertNotContains("closetime-file-at-close (TECH-DEBT.md not named)", r.port.out, "TECH-DEBT.md");
  }

  // -- agent worktree exclusion (WIP) -- both tracked+untracked under it stay unflagged ------------
  // AND a real undeclared file outside it still FAILs by name (L-058 negative test) ---------------
  {
    const d = posix.join(work, "agent-worktree-exclusion");
    gitInit(d);
    writeFile(
      d,
      "docs/sprint/SPRINT-906-worktree.md",
      `---\nsprint: 906\nslug: worktree\nstatus: active\nplan_commit: PLAN_COMMIT_PLACEHOLDER\n---\n\n## Plan\n\n### T1 — edit foo.txt only\nLayers: \`foo.txt\`\nDepends-on: none\n\n**DoD:**\n- [ ] foo.txt updated\n`,
    );
    writeFile(d, "foo.txt", "a\n");
    writeFile(d, ".claude/worktrees/agent-001/seed.txt", "seed\n");
    lockPlan(d, "docs/sprint/SPRINT-906-worktree.md");
    writeFile(d, "foo.txt", "a\na2\n");
    writeFile(d, ".claude/worktrees/agent-001/seed.txt", "seed\nwip\n");
    writeFile(d, ".claude/worktrees/agent-001/task-notes.md", "new\n");
    const { port } = compare("agent-worktree-exclusion-safe", d, ["docs/sprint/SPRINT-906-worktree.md"]);
    assertContains("agent-worktree-exclusion-safe", port.out, "layers observed [WIP, unattributed]");
    assertNotContains("agent-worktree-exclusion-safe (no worktree path in output)", port.out, ".claude/worktrees/agent-001");
  }
  progress("population 2c done: close-time and worktree exclusions");

  // -- governance commits: leg A (all-governance PASS) + leg B (retained must-FAIL: code rides along,
  // ALL-OR-NOTHING must still name it) -------------------------------------------------------------
  {
    const d = posix.join(work, "governance-commits");
    gitInit(d);
    writeFile(
      d,
      "docs/sprint/SPRINT-930-governance.md",
      `---\nsprint: 930\nslug: governance\nstatus: active\nplan_commit: PLAN_COMMIT_PLACEHOLDER\n---\n\n## Plan\n\n### T1 — edit the declared source file\nLayers: \`src/declared.txt\`\nDepends-on: none\n\n**DoD:**\n- [ ] src/declared.txt updated\n`,
    );
    writeFile(d, "src/declared.txt", "x\n");
    writeFile(d, "src/sneaky.txt", "y\n");
    writeFile(d, "TODO.md", "# todo\n");
    writeFile(d, "docs/epic/EPIC-001-thing.md", "# epic\n");
    lockPlan(d, "docs/sprint/SPRINT-930-governance.md");
    writeFile(d, "TODO.md", "# todo\n- [ ] TASK-500 groomed\n");
    writeFile(d, "docs/epic/EPIC-001-thing.md", "# epic\noutcome\n");
    commitAll(d, "plan(epics): author an epic and groom the backlog");
    let r = compare("governance leg A (governance-only commit is not undeclared)", d, ["docs/sprint/SPRINT-930-governance.md"]);
    assertContains("governance leg A", r.port.out, "layers observed");
    assertNotContains("governance leg A (no FAIL)", r.port.out, "FAIL");
    writeFile(d, "TODO.md", "# todo\n- [ ] TASK-500 groomed\n- [ ] TASK-501 groomed\n");
    writeFile(d, "src/sneaky.txt", "y\nz2\n");
    commitAll(d, "plan(backlog): groom -- with a code file riding along");
    r = compare("governance leg B (code riding along still FAILs)", d, ["docs/sprint/SPRINT-930-governance.md"]);
    assertContains("governance leg B (names src/sneaky.txt)", r.port.out, "src/sneaky.txt");
  }
  progress("population 2d done: governance all-or-nothing");

  // -- stream ownership scoping (TASK-299, ADR-040): sibling's own commit is not this sprint's work,
  // and a commit merely MENTIONING a sibling in prose must not launder ownership (L-108's family) --
  {
    const d = posix.join(work, "stream-ownership");
    gitInit(d);
    writeFile(
      d,
      "docs/sprint/SPRINT-920-stream-one.md",
      `---\nsprint: 920\nslug: stream-one\nstatus: active\nplan_commit: PLAN_COMMIT_PLACEHOLDER\n---\n\n## Plan\n\n### T1 — edit stream one's own file\nLayers: \`alpha.txt\`\nDepends-on: none\n\n**DoD:**\n- [ ] alpha.txt updated\n`,
    );
    writeFile(
      d,
      "docs/sprint/SPRINT-921-stream-two.md",
      `---\nsprint: 921\nslug: stream-two\nstatus: active\nplan_commit: PLAN_COMMIT_PLACEHOLDER\n---\n\n## Plan\n\n### T1 — edit stream two's own file\nLayers: \`beta.txt\`\nDepends-on: none\n\n**DoD:**\n- [ ] beta.txt updated\n`,
    );
    writeFile(d, "alpha.txt", "a\n");
    writeFile(d, "beta.txt", "b\n");
    writeFile(d, "gamma.txt", "g\n");
    commitAll(d, "plan locked");
    const sha = headSha(d);
    for (const f of ["docs/sprint/SPRINT-920-stream-one.md", "docs/sprint/SPRINT-921-stream-two.md"]) {
      writeFile(d, f, readFileSync(posix.join(d, f), "utf8").replace("PLAN_COMMIT_PLACEHOLDER", sha));
    }
    commitAll(d, "record plan_commit sha");
    const both = ["docs/sprint/SPRINT-920-stream-one.md", "docs/sprint/SPRINT-921-stream-two.md"];

    // leg A: sibling's own commit -- must PASS (not this sprint's undeclared work)
    writeFile(d, "beta.txt", "b\nb2\n");
    commitAll(d, "sprint(921) T1: stream two edits its own declared file");
    let r = compare("ownership leg A (sibling's own commit)", d, both);
    assertNotContains("ownership leg A (beta.txt not blamed on 920)", r.port.out, "SPRINT-920-stream-one.md layers observed: changed by a task that never declared it");

    // leg B: THIS sprint's own task touches a SIBLING-declared path -- must still FAIL, naming T1
    writeFile(d, "beta.txt", "b\nb2\nb3\n");
    commitAll(d, "sprint(920) T1: stream ONE wrongly edits the sibling-declared file");
    r = compare("ownership leg B (own task on sibling path still FAILs)", d, both);
    assertContains("ownership leg B", r.port.out, "T1:beta.txt");

    // leg F: a commit whose subject merely MENTIONS a sibling sprint in prose -- must NOT launder.
    writeFile(d, "gamma.txt", "g\ng2\n");
    commitAll(d, "port the fix already applied over there (SPRINT-921 T2)");
    r = compare("ownership leg F (prose mention of a sibling transfers nothing)", d, both);
    assertContains("ownership leg F", r.port.out, "SPRINT-920-stream-one.md layers observed: changed by a task that never declared it");
    assertContains("ownership leg F (names gamma.txt)", r.port.out, "gamma.txt");
  }
  progress("population 2e done: stream ownership scoping");

  // -- qualifier widening (SPRINT-093 T7): "T1 revise:" attributes and PASSes; "T1 and T2:" is
  // AMBIGUOUS and must fall through to UNATTRIBUTED, naming it, while a sibling correctly-qualified
  // commit in the SAME repo stays attributed and clean (sibling control). --------------------------
  {
    const d = posix.join(work, "qualifier-widening");
    gitInit(d);
    writeFile(
      d,
      "docs/sprint/SPRINT-950-qualifier.md",
      `---\nsprint: 950\nslug: qualifier\nstatus: active\nplan_commit: PLAN_COMMIT_PLACEHOLDER\n---\n\n## Plan\n\n### T1 — edit foo.txt\nLayers: \`foo.txt\`\nDepends-on: none\n\n**DoD:**\n- [ ] foo.txt updated\n\n### T2 — edit bar.txt\nLayers: \`bar.txt\`\nDepends-on: none\n\n**DoD:**\n- [ ] bar.txt updated\n`,
    );
    writeFile(d, "foo.txt", "a\n");
    writeFile(d, "bar.txt", "b\n");
    lockPlan(d, "docs/sprint/SPRINT-950-qualifier.md");
    writeFile(d, "foo.txt", "a\na2\n");
    commitAll(d, "sprint(950) T1 revise: fix the input-side description (comments only)");
    writeFile(d, "bar.txt", "b\nb2\n");
    commitAll(d, "sprint(950) T2 revise 2: require positive evidence for the staleness check");
    const { port } = compare("qualifier-widening (bare + numbered qualifier both attribute)", d, ["docs/sprint/SPRINT-950-qualifier.md"]);
    assertContains("qualifier-widening (clean PASS)", port.out, "layers observed (all changed files declared");
  }
  {
    const d = posix.join(work, "ambiguous-qualifier");
    gitInit(d);
    writeFile(
      d,
      "docs/sprint/SPRINT-951-ambiguous.md",
      `---\nsprint: 951\nslug: ambiguous\nstatus: active\nplan_commit: PLAN_COMMIT_PLACEHOLDER\n---\n\n## Plan\n\n### T1 — edit alpha.txt\nLayers: \`alpha.txt\`\nDepends-on: none\n\n**DoD:**\n- [ ] alpha.txt updated\n\n### T3 — edit gamma.txt\nLayers: \`gamma.txt\`\nDepends-on: none\n\n**DoD:**\n- [ ] gamma.txt updated\n`,
    );
    writeFile(d, "alpha.txt", "a\n");
    writeFile(d, "gamma.txt", "g\n");
    lockPlan(d, "docs/sprint/SPRINT-951-ambiguous.md");
    writeFile(d, "alpha.txt", "a\na2\n");
    commitAll(d, "sprint(951) T1 and T2: touch alpha.txt");
    writeFile(d, "gamma.txt", "g\ng2\n");
    commitAll(d, "sprint(951) T3 revise: touch gamma.txt");
    const { port } = compare("ambiguous-qualifier ('T1 and T2:' falls through)", d, ["docs/sprint/SPRINT-951-ambiguous.md"]);
    assertContains("ambiguous-qualifier (unattributed)", port.out, "commit attributable to no task and not coordinator bookkeeping:");
    assertContains("ambiguous-qualifier (names alpha.txt)", port.out, "alpha.txt");
    assertNotContains("ambiguous-qualifier sibling control (T3 revise: stays clean)", port.out, "gamma.txt");
  }
  progress("population 2f done: qualifier widening + ambiguous fallthrough");

  // -- unbackticked declaration is not a declaration (TD-142 ruling) -- must FAIL, over-reporting,
  // while the identical edit declared WITH backticks in the SAME repo stays clean (sibling control) -
  {
    const d = posix.join(work, "unbackticked-declaration");
    gitInit(d);
    writeFile(
      d,
      "docs/sprint/SPRINT-970-unbackticked.md",
      `---\nsprint: 970\nslug: unbackticked\nstatus: active\nplan_commit: PLAN_COMMIT_PLACEHOLDER\n---\n\n## Plan\n\n### T1 — declares its file WITHOUT backticks\nLayers: bare.txt\nDepends-on: none\n\n**DoD:**\n- [ ] bare.txt updated\n\n### T2 — declares its file WITH backticks\nLayers: \`quoted.txt\`\nDepends-on: none\n\n**DoD:**\n- [ ] quoted.txt updated\n`,
    );
    writeFile(d, "bare.txt", "a\n");
    writeFile(d, "quoted.txt", "b\n");
    lockPlan(d, "docs/sprint/SPRINT-970-unbackticked.md");
    writeFile(d, "bare.txt", "a\na2\n");
    commitAll(d, "sprint(970) T1: edit the unbackticked-declaration file");
    writeFile(d, "quoted.txt", "b\nb2\n");
    commitAll(d, "sprint(970) T2: edit the backtick-declared file");
    const { port } = compare("unbackticked-declaration-not-declared", d, ["docs/sprint/SPRINT-970-unbackticked.md"]);
    assertContains("unbackticked-declaration (bare token still FAILs)", port.out, "T1:bare.txt");
    assertNotContains("unbackticked-declaration sibling control (T2:quoted.txt stays clean)", port.out, "T2:quoted.txt");
  }
  progress("population 2g done: unbackticked declaration");

  // -- archived sibling ownership (TD-125, ADR-040): an archived sprint keeps owning its own
  // commits; a genuinely undeclared path with no sprint citation still FAILs by name (sibling control)
  {
    const d = posix.join(work, "archived-sibling");
    gitInit(d);
    writeFile(
      d,
      "docs/sprint/SPRINT-930-active.md",
      "---\nsprint: 930\nslug: active\nstatus: active\nplan_commit: PLAN_COMMIT_PLACEHOLDER\n---\n\n## Plan\n\n### T1 — Only touches its own file\nLayers: `scripts/mine.sh`\nDepends-on: none\n",
    );
    writeFile(d, "scripts/mine.sh", "x\n");
    lockPlan(d, "docs/sprint/SPRINT-930-active.md");
    const before = headSha(d);
    writeFile(d, "scripts/theirs.sh", "y\n");
    commitAll(d, "sprint(931) T1: the archived sprint owns this");
    const theirs = headSha(d);
    writeFile(
      d,
      "docs/sprint/archive/SPRINT-931-closed.md",
      `---\nsprint: 931\nslug: closed\nstatus: closed\nplan_commit: ${before}\nclose_commit: ${theirs}\n---\n\n## Plan\n\n### T1 — Owns its own file, and is archived\nLayers: \`scripts/theirs.sh\`\nDepends-on: none\n`,
    );
    commitAll(d, "sprint(930) T1: record the archived sprint file");
    writeFile(d, "scripts/orphan.sh", "z\n");
    commitAll(d, "chore: a file no sprint declares");
    const { port } = compare("archived-sibling", d, ["docs/sprint/SPRINT-930-active.md"]);
    assertContains("archived-sibling (sibling control: orphan.sh still FAILs)", port.out, "scripts/orphan.sh");
    assertNotContains("archived-sibling (theirs.sh NOT blamed on active)", port.out, "scripts/theirs.sh");
  }
  progress("population 2h done: archived-sibling ownership");

  // -- both-paths (SPRINT-074 T3, TD-037): ONE tree, uncommitted vs committed give different
  // verdicts on purpose -- leg A (WIP) is a named SKIP never a bare PASS; leg B (committed) FAILs. --
  {
    const d = posix.join(work, "both-paths");
    gitInit(d);
    writeFile(
      d,
      "docs/sprint/SPRINT-915-bothpaths.md",
      `---\nsprint: 915\nslug: bothpaths\nstatus: active\nplan_commit: PLAN_COMMIT_PLACEHOLDER\n---\n\n## Plan\n\n### T1 — edit only foo.txt\nLayers: \`foo.txt\`\nDepends-on: none\n\n**DoD:**\n- [ ] foo.txt updated\n\n### T2 — edit only bar.txt\nLayers: \`bar.txt\`\nDepends-on: none\n\n**DoD:**\n- [ ] bar.txt updated\n`,
    );
    writeFile(d, "foo.txt", "a\n");
    writeFile(d, "bar.txt", "b\n");
    lockPlan(d, "docs/sprint/SPRINT-915-bothpaths.md");
    writeFile(d, "bar.txt", "b\nb2\n");
    let r = compare("both-paths leg A (uncommitted: named SKIP)", d, ["docs/sprint/SPRINT-915-bothpaths.md"]);
    assertContains("both-paths leg A", r.port.out, "layers observed [WIP, unattributed]");
    checks++;
    if (!/^PASS/m.test(r.port.out)) {
      checksPassed++;
      console.log("PASS  fixture(both-paths leg A: no bare PASS)");
    } else {
      console.log(`FAIL  fixture(both-paths leg A: no bare PASS): got:\n${r.port.out}`);
    }
    commitAll(d, "sprint(915) T1: edit foo and, wrongly, bar");
    r = compare("both-paths leg B (committed: the same edit now FAILs)", d, ["docs/sprint/SPRINT-915-bothpaths.md"]);
    assertContains("both-paths leg B", r.port.out, "T1:bar.txt");
  }
  progress("population 2 done: all TS-built git fixtures");

  // ================================================================================================
  // population 3: the REAL sprint corpus in this repository
  // ================================================================================================
  const sprintDir = posix.join(repoRoot, "docs/sprint");
  const activeFiles = readdirSync(sprintDir)
    .filter((f) => /^SPRINT-.*\.md$/.test(f))
    .map((f) => `docs/sprint/${f}`);
  const archiveDir = posix.join(sprintDir, "archive");
  const archivedFiles = readdirSync(archiveDir)
    .filter((f) => /^SPRINT-.*\.md$/.test(f))
    .map((f) => `docs/sprint/archive/${f}`);
  filesActive = activeFiles.length;
  filesArchived = archivedFiles.length;
  progress(`population 3 population built: ${filesActive} active + ${filesArchived} archived real sprint files`);

  // 3(a) -- the ACTIVE, non-archived files ONLY, qa-check.sh's own call shape. THE population that
  // proves this comparison examines real, NON-EMPTY output (L-198's trap: comparing only the
  // archived corpus, which is skipped unconditionally, would make both sides emit nothing and
  // "agree" while testing nothing).
  {
    compareBatchWithBisection("real ACTIVE sprint files (qa-check.sh's own call shape)", repoRoot, activeFiles);
    const r = runPort(repoRoot, activeFiles);
    const nonEmpty = r.out.trim().length > 0;
    checks++;
    if (nonEmpty) {
      checksPassed++;
      console.log(`PASS  fixture(population-3a-non-empty): the active-corpus comparison produced real, non-trivial output (${r.out.trim().split("\n").length} line(s)), not the two-empty-outputs-agree shape L-198 warns about`);
    } else {
      console.log(`FAIL  fixture(population-3a-non-empty): active-corpus output was EMPTY -- this comparison proves nothing (L-198)`);
    }
  }
  progress(`population 3a done: ${filesActive} active file(s), real non-empty output confirmed`);

  // 3(b) -- active + every archived file, ONE combined invocation, bisected on divergence: proves
  // the archive-skip holds across the full real population, not merely for one hand-picked path.
  compareBatchWithBisection("real ACTIVE + ARCHIVED sprint files combined", repoRoot, [...activeFiles, ...archivedFiles]);
  progress(`population 3b done: ${filesActive + filesArchived} real sprint file(s) combined`);
} finally {
  rmSync(work, { recursive: true, force: true });
}

console.log("----------------------------------------");
console.log(`layers-observed differential: ${identical}/${total} identical (exit code + stdout)`);
console.log(`layers-observed fixture assertions: ${checksPassed}/${checks} passed`);
console.log(`real corpus processed: ${filesActive} active (non-archived) + ${filesArchived} archived = ${filesActive + filesArchived} total sprint files`);
if (divergences.length > 0) {
  console.log(`${divergences.length} DIVERGENCE(S):\n`);
  console.log(divergences.join("\n\n"));
}
if (divergences.length > 0 || checksPassed !== checks) {
  console.log("FAIL: see above.");
  process.exit(1);
}
console.log("PASS: TS port matches the LIVE Shell oracle byte-for-byte on every input compared, and every fixture assertion held.");
process.exit(0);
