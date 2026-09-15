import { describe, expect, test } from "bun:test";
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  attributeClaim,
  checkDodDelta,
  commitsInRange,
  findNewTicks,
  findSprintDocPath,
  frontmatterValue,
  loadCommit,
  orderedSprintDocCandidates,
  parseDodSections,
} from "../scripts/lib/check-dod-delta.ts";

const FIXTURES = fileURLToPath(new URL("fixtures/dod-delta/", import.meta.url));

function loadFixture(name: string): { subject: string; trailer: string | null; old: string; new: string } {
  const dir = FIXTURES + name + "/";
  const trailerPath = dir + "trailer.txt";
  return {
    subject: readFileSync(dir + "subject.txt", "utf8").trim(),
    trailer: existsSync(trailerPath) ? readFileSync(trailerPath, "utf8").trim() : null,
    old: readFileSync(dir + "old.md", "utf8"),
    new: readFileSync(dir + "new.md", "utf8"),
  };
}

// --- parseDodSections / findNewTicks -- unit-level shape (L-009: match by content, not position) --

describe("parseDodSections", () => {
  test("splits a doc into per-task DoD item lists, folding wrapped continuation lines into one item", () => {
    const doc = [
      "### T1 -- Title `[size: S]`",
      "**DoD:**",
      "- [ ] First item wraps",
      "      onto a continuation line",
      "- [x] Second item",
      "",
      "### T2 -- Other `[size: S]`",
      "**DoD:**",
      "- [ ] Only item",
    ].join("\n");
    const sections = parseDodSections(doc);
    expect(sections.get("T1")?.items).toEqual([
      { text: "First item wraps onto a continuation line", checked: false },
      { text: "Second item", checked: true },
    ]);
    expect(sections.get("T2")?.items).toEqual([{ text: "Only item", checked: false }]);
  });
});

describe("findNewTicks", () => {
  test("matches ticks by task + text, never by line position (L-009)", () => {
    const oldDoc = ["### T1 -- x `[]`", "**DoD:**", "- [ ] A", "- [ ] B"].join("\n");
    // B is INSERTED ahead of A and ticked; A stays unticked. A position-based diff would
    // misread B's tick as belonging to A's old slot.
    const newDoc = ["### T1 -- x `[]`", "**DoD:**", "- [x] B", "- [ ] A"].join("\n");
    const ticks = findNewTicks(oldDoc, newDoc);
    expect(ticks).toEqual([{ task: "T1", text: "B" }]);
  });
});

// --- attributeClaim -- ported attribution rules (mirrors check-layers-observed.sh's attribute()) --

describe("attributeClaim", () => {
  test("sprint(NNN) T<n>: -- the motivating shape", () => {
    expect(attributeClaim("sprint(094) T1: widen the epic checker, 5 of 6 DoD", null)).toEqual({
      kind: "task",
      sprint: "094",
      task: "T1",
    });
  });

  test("a Task: trailer is honoured over subject shape", () => {
    expect(attributeClaim("sprint(094): coordinator commit", "T3")).toEqual({
      kind: "task",
      sprint: "094",
      task: "T3",
    });
  });

  test("sprint(NNN): with no task token is coordinator-scoped, exempt", () => {
    expect(attributeClaim("sprint(094): both reviews landed, 17 of 20 DoD", null)).toEqual({
      kind: "coord",
      sprint: "094",
    });
  });

  test("a qualifier with NO embedded task digit still attributes (T1 revise:)", () => {
    expect(attributeClaim("sprint(092) T1 revise: second pass", null)).toEqual({
      kind: "task",
      sprint: "092",
      task: "T1",
    });
  });

  // L-108's family: a qualifier that embeds a SECOND task reference must fall through rather than
  // guess the first token.
  test("T1+T2 combined token falls through to unscoped, never guesses T1", () => {
    expect(attributeClaim("sprint(202) T1+T2: shared refactor across two tasks, 4 of 4", null)).toEqual({
      kind: "unscoped",
    });
  });

  test("T1 and T2: (embedded T-digit in the qualifier) falls through to unscoped", () => {
    expect(attributeClaim("sprint(093) T1 and T2: joint fix", null)).toEqual({ kind: "unscoped" });
  });

  test("merge(NNN): T<n> ... attributes as a coordinator merge-back", () => {
    expect(attributeClaim("merge(100): T4 -- informational findings get their own token", null)).toEqual({
      kind: "task",
      sprint: "100",
      task: "T4",
    });
  });

  test("a non-sprint commit is unscoped", () => {
    expect(attributeClaim("release: v1.65.1 -- SPRINT-100 fixes (PATCH)", null)).toEqual({ kind: "unscoped" });
  });
});

// --- findSprintDocPath -- the /logs/ trap 6a6aeac itself contains -----------------------------

describe("findSprintDocPath", () => {
  test("prefers the Plan doc over the same-basename Execution Log under logs/", () => {
    const changed = [
      "docs/epic/EPIC-015-execution-autonomy.md",
      "docs/sprint/SPRINT-094-guards-for-what-nothing-reads.md",
      "docs/sprint/logs/SPRINT-094-guards-for-what-nothing-reads.md",
    ];
    expect(findSprintDocPath(changed, "094")).toBe("docs/sprint/SPRINT-094-guards-for-what-nothing-reads.md");
  });

  test("falls back to the archive path when that is the only Plan doc present", () => {
    const changed = ["docs/sprint/archive/SPRINT-050-x.md", "docs/sprint/archive/logs/SPRINT-050-x.md"];
    expect(findSprintDocPath(changed, "050")).toBe("docs/sprint/archive/SPRINT-050-x.md");
  });

  test("returns null when no path matches the sprint number", () => {
    expect(findSprintDocPath(["docs/sprint/SPRINT-051-y.md"], "050")).toBeNull();
  });
});

// --- checkDodDelta -- the retained fixtures (TD-012: never deleted with the prototype) ---------

describe("checkDodDelta -- must-FAIL: SPRINT-094's 6a6aeac (SPRINT-101 T3 motivating case)", () => {
  const fx = loadFixture("must-fail-6a6aeac");

  test("reddens with a named unattributed-tick finding per foreign task", () => {
    const result = checkDodDelta(fx.subject, fx.trailer, fx.old, fx.new);
    expect(result.ok).toBe(false);
    expect(result.findings.map((f) => f.kind)).toEqual(["unattributed-tick", "unattributed-tick"]);
    expect(result.findings.map((f) => f.message)).toEqual([
      expect.stringMatching(/commit claims T1 but ticked T2's DoD item it never named/),
      expect.stringMatching(/commit claims T1 but ticked T3's DoD item it never named/),
    ]);
  });
});

describe("checkDodDelta -- sibling control: claim and ticks agree, stays green in the same run (L-142)", () => {
  const fx = loadFixture("sibling-control");

  test("a commit that only ticks its OWN claimed task's DoD is ok", () => {
    const result = checkDodDelta(fx.subject, fx.trailer, fx.old, fx.new);
    expect(result.ok).toBe(true);
    expect(result.findings).toEqual([]);
  });
});

describe("checkDodDelta -- population fixture (L-186): the OTHER arm of the selection pattern", () => {
  // DoD 4's enumeration of the population this checker's attributeClaim() must classify correctly,
  // and the fixture that exercises each arm:
  //   (A) sprint(NNN) T<n>: -- single task token + colon      -- must-fail-6a6aeac, sibling-control
  //   (B) sprint(NNN): -- no task token, colon only            -- population-coord (this fixture)
  //   (C) sprint(NNN) T<a>+T<b>: -- combined/ambiguous token   -- population-unscoped (this fixture)
  // Subject-shape sampling (SPRINT-101 T3 report) found (A) = 245/937 and (B) = 692/937 of this
  // repo's own sprint(NNN) commits -- the MAJORITY shape is (B), and a regex anchored only to shape
  // (A) (as the motivating commit happens to be) would never examine its own majority population.

  test("(B) coordinator-scoped commit ticking TWO tasks' DoD in one commit is exempt, not flagged", () => {
    const fx = loadFixture("population-coord");
    const result = checkDodDelta(fx.subject, fx.trailer, fx.old, fx.new);
    expect(result.ok).toBe(true);
    expect(result.findings).toEqual([]);
    expect(result.note).toMatch(/coordinator-scoped/);
  });

  test("(C) a combined-task token narrows to unscoped rather than guessing the first task", () => {
    const fx = loadFixture("population-unscoped");
    const result = checkDodDelta(fx.subject, fx.trailer, fx.old, fx.new);
    expect(result.ok).toBe(true);
    expect(result.findings).toEqual([]);
    // Adversarial review of ca577e9 (finding 3): the old wording cited "narrowed per SPRINT-101 T3
    // DoD 1" here, which is WRONG -- DoD 1's narrowing dropped only the figure/count comparison, never
    // this check. The note must never borrow that rationale for an unscoped/ambiguous subject.
    expect(result.note).not.toMatch(/DoD 1/);
    expect(result.note).toMatch(/does not attribute to exactly one task/);
  });
});

describe("checkDodDelta -- a legitimate skip when the commit's diff never touched the sprint doc", () => {
  test("newContent === null is a skip, never a FAIL (mirrors check-count-claims.sh's missing-file skip)", () => {
    const result = checkDodDelta("sprint(097) T2: gates signed at d9f6c3c; T2 closed as already-satisfied", null, "", null);
    expect(result.ok).toBe(true);
    expect(result.findings).toEqual([]);
    expect(result.note).toMatch(/nothing to compare/);
  });
});

// =================================================================================================
// Adversarial review of ca577e9 -- six findings, ALL in the population this guard runs over, none in
// its verdict logic (L-186's shape exactly). Each block below enters through the SELECTION arm the
// finding named, never just the verdict, per the review's own verification bar.
// =================================================================================================

// --- finding 1: the Task: trailer was silently dropped unless the subject was sprint(/merge(-
// prefixed. attributeClaim() unit coverage first, then checkDodDelta END-TO-END through real tick
// comparison with a NON-null trailer on a conventional-commit subject (real shape: 8afec97/bb0763a/
// 298c1e1 all carry `Task: T1` on a fix(engine):/test(engine):/perf(engine): subject). ------------

describe("attributeClaim -- finding 1: the Task: trailer is honoured regardless of subject prefix", () => {
  test("a conventional-commit subject with no sprint(/merge( prefix still attributes via the trailer", () => {
    expect(
      attributeClaim("fix(engine): close the empty-key landmine an independent review found", "T1"),
    ).toEqual({ kind: "task", task: "T1", sprint: null });
  });

  // Sibling control, same subject SHAPE, no trailer: correctly falls through to unscoped -- proves
  // the trailer, not some accidental subject match, is what carries the attribution above.
  test("sibling: the identical subject with NO trailer stays unscoped", () => {
    expect(attributeClaim("fix(engine): close the empty-key landmine an independent review found", null)).toEqual({
      kind: "unscoped",
    });
  });

  test("sprint-prefixed control still resolves the sprint number from the subject, not just the trailer", () => {
    expect(attributeClaim("sprint(101) T1: something", "T1")).toEqual({ kind: "task", task: "T1", sprint: "101" });
  });
});

describe("checkDodDelta -- finding 1 END-TO-END: trailer arm through real tick comparison", () => {
  test("must-FAIL: a Task: T1 trailer on a non-sprint-prefixed subject still catches a foreign tick", () => {
    const fx = loadFixture("trailer-arm-must-fail");
    expect(fx.trailer).toBe("T1");
    const result = checkDodDelta(fx.subject, fx.trailer, fx.old, fx.new);
    expect(result.ok).toBe(false);
    expect(result.findings.map((f) => f.message)).toEqual([
      expect.stringMatching(/commit claims T1 but ticked T2's DoD item it never named/),
    ]);
  });

  test("sibling control: the same trailer arm, ticks agree, stays green", () => {
    const fx = loadFixture("trailer-arm-sibling");
    const result = checkDodDelta(fx.subject, fx.trailer, fx.old, fx.new);
    expect(result.ok).toBe(true);
    expect(result.findings).toEqual([]);
  });
});

// --- finding 4 (parenthetical half): rule 4 `(SPRINT-NNN Tn)` appears in 64 real subjects and was
// untested at ANY level. Same must-fail/sibling shape, entering through checkDodDelta directly. ----

describe("checkDodDelta -- finding 4 END-TO-END: parenthetical arm `(SPRINT-NNN Tn)` through real tick comparison", () => {
  test("must-FAIL: a trailing parenthetical task ref still catches a foreign tick", () => {
    const fx = loadFixture("parenthetical-arm-must-fail");
    const result = checkDodDelta(fx.subject, fx.trailer, fx.old, fx.new);
    expect(result.ok).toBe(false);
    expect(result.findings.map((f) => f.message)).toEqual([
      expect.stringMatching(/commit claims T1 but ticked T2's DoD item it never named/),
    ]);
  });

  test("sibling control: the same parenthetical arm, ticks agree, stays green", () => {
    const fx = loadFixture("parenthetical-arm-sibling");
    const result = checkDodDelta(fx.subject, fx.trailer, fx.old, fx.new);
    expect(result.ok).toBe(true);
    expect(result.findings).toEqual([]);
  });
});

// --- finding 3: letter-suffixed subtasks (T1a/T2a/T2b -- SPRINT-038's real shape) fell through to
// unscoped. Widened TASK_TOKEN pattern, tested at the heading/parse level, the attribution level, AND
// end-to-end through tick comparison. --------------------------------------------------------------

describe("parseDodSections -- finding 3: a letter-suffixed heading is its own task section", () => {
  test("### T2a is parsed as task 'T2a', distinct from T2", () => {
    const doc = ["### T2a -- Split half `[]`", "**DoD:**", "- [x] Done"].join("\n");
    const sections = parseDodSections(doc);
    expect(sections.has("T2a")).toBe(true);
    expect(sections.has("T2")).toBe(false);
  });
});

describe("attributeClaim -- finding 3: a letter-suffixed task token attributes, never falls through", () => {
  test("sprint(NNN) T2a: attributes to T2a", () => {
    expect(attributeClaim("sprint(38) T2a: eval harness settled", null)).toEqual({
      kind: "task",
      sprint: "38",
      task: "T2a",
    });
  });

  test("the qualifier-widening rule also accepts a letter-suffixed token (T1a revise:)", () => {
    expect(attributeClaim("sprint(38) T1a revise: second pass", null)).toEqual({
      kind: "task",
      sprint: "38",
      task: "T1a",
    });
  });
});

describe("checkDodDelta -- finding 3 END-TO-END: letter-suffix arm through real tick comparison", () => {
  test("must-FAIL: sprint(NNN) T2a: still catches a foreign tick in T3's block", () => {
    const fx = loadFixture("letter-suffix-must-fail");
    const result = checkDodDelta(fx.subject, fx.trailer, fx.old, fx.new);
    expect(result.ok).toBe(false);
    expect(result.findings.map((f) => f.message)).toEqual([
      expect.stringMatching(/commit claims T2a but ticked T3's DoD item it never named/),
    ]);
  });

  test("sibling control: the same letter-suffix arm, ticks agree, stays green", () => {
    const fx = loadFixture("letter-suffix-sibling");
    const result = checkDodDelta(fx.subject, fx.trailer, fx.old, fx.new);
    expect(result.ok).toBe(true);
    expect(result.findings).toEqual([]);
  });
});

// --- finding 4 (trailer half, the population-blindness cheap tell itself): every existing
// checkDodDelta call before this revise passed taskTrailer = null (5 of 5) -- so Rule 1 was only ever
// exercised by the bare attributeClaim unit call above, never through findSprintDocPath's null-sprint
// fallback + tick comparison together. This block enters through THAT exact seam. -------------------

describe("orderedSprintDocCandidates / findSprintDocPath -- finding 4 (trailer + null-sprint interaction)", () => {
  test("a trailer-only commit (no sprint number) resolves the SOLE sprint-doc-shaped path in the diff", () => {
    const changed = [
      "scripts/lib/conformance-engine.sh",
      "docs/sprint/SPRINT-210-trailer-arm.md",
      "docs/sprint/logs/SPRINT-210-trailer-arm.md",
    ];
    expect(findSprintDocPath(changed, null)).toBe("docs/sprint/SPRINT-210-trailer-arm.md");
  });

  test("never guesses among TWO distinct sprint numbers -- returns null (ambiguous), not the first", () => {
    const changed = ["docs/sprint/SPRINT-210-a.md", "docs/sprint/SPRINT-211-b.md"];
    expect(findSprintDocPath(changed, null)).toBeNull();
    expect(orderedSprintDocCandidates(changed, null)).toEqual([]);
  });

  test("zero sprint-doc-shaped paths -- null, same as the missing-file skip elsewhere", () => {
    expect(findSprintDocPath(["scripts/lib/conformance-engine.sh"], null)).toBeNull();
  });
});

// --- finding 5: the archive-preference comparison was case-sensitive (`!p.includes("/archive/")`),
// so a mis-cased `/Archive/` path could win by list order on a case-insensitive filesystem (this
// host is Windows). Fixed via case-insensitive normalisation in orderNonArchiveFirst. --------------

describe("findSprintDocPath -- finding 5: archive preference is case-INSENSITIVE", () => {
  test("a mis-cased /Archive/ candidate still loses to a non-archive candidate", () => {
    const changed = ["docs/sprint/Archive/SPRINT-060-x.md", "docs/sprint/SPRINT-060-x.md"];
    expect(findSprintDocPath(changed, "060")).toBe("docs/sprint/SPRINT-060-x.md");
  });

  // Sibling control, lowercase (the original passing case) stays correct under the fix.
  test("sibling: the ordinary lowercase /archive/ candidate still loses the same way", () => {
    const changed = ["docs/sprint/archive/SPRINT-061-x.md", "docs/sprint/SPRINT-061-x.md"];
    expect(findSprintDocPath(changed, "061")).toBe("docs/sprint/SPRINT-061-x.md");
  });

  test("when EVERY candidate is archived (mixed case), the sole one is still returned, never dropped", () => {
    expect(findSprintDocPath(["docs/sprint/Archive/SPRINT-062-x.md"], "062")).toBe(
      "docs/sprint/Archive/SPRINT-062-x.md",
    );
  });
});

// --- finding 2 (range, not HEAD) and finding 6 (archive-move crash guard) -- both need a REAL git
// history to exercise (a plan_commit..HEAD walk; a commit that deletes-at-this-ref the path our own
// candidate selection preferred). Built as real throwaway repos via mkdtempSync + git, the same class
// run-git-availability-fixtures.sh already takes as an always-on exception (cheap: git init + a
// handful of commits, no oracle spawn). Cleaned up in `finally` so a failed assertion never leaks a
// temp dir across runs. -------------------------------------------------------------------------

function initRepo(): string {
  const dir = mkdtempSync(join(tmpdir(), "dod-delta-repo-"));
  const run = (args: string[]) => execFileSync("git", args, { cwd: dir, encoding: "utf8" });
  run(["init", "-q"]);
  run(["config", "user.email", "test@example.com"]);
  run(["config", "user.name", "Test"]);
  return dir;
}

function commitFile(dir: string, relPath: string, content: string, subject: string, trailer?: string): string {
  const abs = join(dir, relPath);
  mkdirSync(join(abs, ".."), { recursive: true });
  writeFileSync(abs, content, "utf8");
  execFileSync("git", ["add", relPath], { cwd: dir });
  const message = trailer ? `${subject}\n\nTask: ${trailer}\n` : subject;
  execFileSync("git", ["commit", "-q", "-m", message], { cwd: dir });
  return execFileSync("git", ["rev-parse", "HEAD"], { cwd: dir, encoding: "utf8" }).trim();
}

describe("commitsInRange -- finding 2: a real plan_commit..HEAD walk, not HEAD-only", () => {
  test("finds a commit that is NOT HEAD, when plan_commit points before it", () => {
    const dir = mkdtempSync(join(tmpdir(), "dod-delta-range-"));
    try {
      const run = (args: string[]) => execFileSync("git", args, { cwd: dir, encoding: "utf8" });
      run(["init", "-q"]);
      run(["config", "user.email", "t@example.com"]);
      run(["config", "user.name", "T"]);
      writeFileSync(join(dir, "a.txt"), "0", "utf8");
      run(["add", "a.txt"]);
      run(["commit", "-q", "-m", "sprint(300): plan locked"]);
      const planCommit = run(["rev-parse", "HEAD"]).trim();

      writeFileSync(join(dir, "a.txt"), "1", "utf8");
      run(["add", "a.txt"]);
      run(["commit", "-q", "-m", "sprint(300) T1: first task commit"]);
      const first = run(["rev-parse", "HEAD"]).trim();

      writeFileSync(join(dir, "a.txt"), "2", "utf8");
      run(["add", "a.txt"]);
      run(["commit", "-q", "-m", "sprint(300): coordinator commit landed between gate runs"]);
      const head = run(["rev-parse", "HEAD"]).trim();

      // The exact failure mode the review named: HEAD-only would see ONLY `head`. The range must
      // see BOTH commits made since plan_commit, oldest first.
      const range = commitsInRange(dir, planCommit, "HEAD");
      expect(range).toEqual([first, head]);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});

describe("frontmatterValue -- reads plan_commit the same way check-layers-observed.sh's fmv() does", () => {
  test("reads a key from the leading frontmatter block only", () => {
    const doc = "---\nsprint: 300\nplan_commit: abc1234\n---\n\n# Body\nplan_commit: NOT-THIS-ONE\n";
    expect(frontmatterValue(doc, "plan_commit")).toBe("abc1234");
  });

  test("a doc with no leading frontmatter block returns null", () => {
    expect(frontmatterValue("# just a heading\nplan_commit: x\n", "plan_commit")).toBeNull();
  });
});

describe("loadCommit -- finding 6: an archive-move commit must not throw uncaught", () => {
  test("a task-scoped commit that git-moves its own doc to archive/ in the SAME commit is handled, not thrown", () => {
    const dir = initRepo();
    try {
      commitFile(
        dir,
        "docs/sprint/SPRINT-301-x.md",
        ["### T1 -- x `[]`", "**DoD:**", "- [ ] A", "", "### T2 -- y `[]`", "**DoD:**", "- [ ] B", ""].join("\n"),
        "sprint(301) T1: draft",
      );
      // git mv, in the SAME commit that also ticks T1's box -- the exact shape the review named: the
      // OLD path (non-archive) is what orderNonArchiveFirst prefers, but it does not exist AT THIS
      // REF any more. The destination directory must exist first -- `git mv` does not create it.
      mkdirSync(join(dir, "docs/sprint/archive"), { recursive: true });
      execFileSync("git", ["mv", "docs/sprint/SPRINT-301-x.md", "docs/sprint/archive/SPRINT-301-x.md"], {
        cwd: dir,
      });
      writeFileSync(
        join(dir, "docs/sprint/archive/SPRINT-301-x.md"),
        ["### T1 -- x `[]`", "**DoD:**", "- [x] A", "", "### T2 -- y `[]`", "**DoD:**", "- [ ] B", ""].join("\n"),
        "utf8",
      );
      execFileSync("git", ["add", "-A"], { cwd: dir });
      execFileSync("git", ["commit", "-q", "-m", "sprint(301) T1: archive-move + tick, 1 of 1 DoD"], { cwd: dir });
      const head = execFileSync("git", ["rev-parse", "HEAD"], { cwd: dir, encoding: "utf8" }).trim();

      expect(() => loadCommit(dir, head)).not.toThrow();
      const commit = loadCommit(dir, head);
      // Either outcome is acceptable to this test (a fallback to the new path, or a clean null-skip)
      // -- what finding 6 forbids is the uncaught throw, asserted above. Recorded here so a FUTURE
      // regression that silently swallows the archive-moved doc (a real tick going unchecked) is at
      // least visible in the suite's own history rather than merely "did not crash".
      if (commit.sprintDocPath !== null) {
        expect(commit.sprintDocPath).toBe("docs/sprint/archive/SPRINT-301-x.md");
      }
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});

// =================================================================================================
// Finding 7 (adversarial review of e312de4, pointed at the LIVE repo rather than fixtures): the
// coordinator-commit shape `sprint(NNN): T<n> -- ...` (colon RIGHT AFTER the paren) attributed as
// `coord` and was never examined -- 137 of 701 `coord` commits in this history named a task at that
// exact position, invisible to every fixture built so far because every one used the OTHER colon
// placement (`sprint(NNN) T<n>:`). Both shapes are live conventions (225 vs 128 in this history), not
// one legacy and one current.
// =================================================================================================

describe("attributeClaim -- finding 7: colon-after-paren with a task token as the first word", () => {
  test("sprint(NNN): T<n> -- ... attributes to the task, not coord", () => {
    expect(attributeClaim("sprint(100): T5 -- widen the conformance-coverage sweep ...", null)).toEqual({
      kind: "task",
      sprint: "100",
      task: "T5",
    });
    expect(attributeClaim("sprint(101): T4 -- clear two stale records ...", null)).toEqual({
      kind: "task",
      sprint: "101",
      task: "T4",
    });
  });

  // The four exemption cases the coordinator named, proving the widening did NOT eat the coord
  // exemption for genuine coordinator commits.
  test("exemption 1: a prose word that merely CONTAINS a task-like token elsewhere stays coord", () => {
    // First word after "sprint(101): " is "log", not a task token -- "T4" and the digit in "3 DoD"
    // appear later in the sentence and must not be substring-matched.
    expect(attributeClaim("sprint(101): log T4 merged, tick its 3 DoD, record two surprises", null)).toEqual({
      kind: "coord",
      sprint: "101",
    });
  });

  test("exemption 2: an ordinary close-commit subject stays coord", () => {
    expect(attributeClaim("sprint(100): close -- Findings That Mean What They Say, 29 of 29", null)).toEqual({
      kind: "coord",
      sprint: "100",
    });
  });

  test("exemption 3: an ordinary bookkeeping subject stays coord", () => {
    expect(attributeClaim("sprint(101): record plan_commit 87fdfeb", null)).toEqual({
      kind: "coord",
      sprint: "101",
    });
  });

  test("exemption 4a: sprint(NNN) T1+T2: (task-before-colon combined token) stays unscoped, unchanged", () => {
    expect(attributeClaim("sprint(095) T1+T2: shared refactor", null)).toEqual({ kind: "unscoped" });
  });

  test("exemption 4b: sprint(NNN): T1+T2 -- (colon-after-paren combined token) is unscoped, NOT task", () => {
    expect(attributeClaim("sprint(101): T1+T2 -- shared refactor across two tasks", null)).toEqual({
      kind: "unscoped",
    });
  });
});

describe("checkDodDelta -- finding 7 END-TO-END: colon-after-paren arm through real tick comparison", () => {
  test("must-FAIL: sprint(NNN): T5 -- ... still catches a foreign tick in T1's block", () => {
    const fx = loadFixture("colon-after-paren-must-fail");
    const result = checkDodDelta(fx.subject, fx.trailer, fx.old, fx.new);
    expect(result.ok).toBe(false);
    expect(result.findings.map((f) => f.message)).toEqual([
      expect.stringMatching(/commit claims T5 but ticked T1's DoD item it never named/),
    ]);
  });

  test("sibling control: the same colon-after-paren arm, ticks agree, stays green", () => {
    const fx = loadFixture("colon-after-paren-sibling");
    const result = checkDodDelta(fx.subject, fx.trailer, fx.old, fx.new);
    expect(result.ok).toBe(true);
    expect(result.findings).toEqual([]);
  });
});

// =================================================================================================
// SPRINT-102 T4 (L-202): before attributeClaim falls through to a silent COORD/UNSCOPED exemption, a
// task-shaped first token that no structural arm admits now FAILs loudly, naming the subject, instead
// of being silently exempted. Real motivating case (L-166, drawn from `git log --format=%s` on this
// repo, not invented): "sprint(094) T4 + record fix: prune 29 merged branches, untick two false DoD"
// names T4 unambiguously but matched no arm above rules 1-6a and fell through to UNSCOPED until now.
// Scope note (declared honestly at G2): this closes the coord/task boundary only -- it does not widen
// into a general population fix, and it must not re-litigate the DELIBERATE ambiguity refusals rules
// 5/6a already ship (an adjacent "+combined" token, or a qualifier naming a second task) -- both are
// covered below as exclusion siblings that must stay unscoped, unchanged.
// =================================================================================================

describe("attributeClaim -- SPRINT-102 T4: an unmatched task-shaped subject is a LOUD exemption", () => {
  test("real historical case (L-166): sprint(094) T4 + record fix: ... resolves to unmatched-shape, not coord/unscoped", () => {
    expect(
      attributeClaim("sprint(094) T4 + record fix: prune 29 merged branches, untick two false DoD", null),
    ).toEqual({ kind: "unmatched-shape", sprint: "094", token: "T4" });
  });

  test("sibling control: a genuine coordinator subject (no task-shaped first token) stays coord, unchanged", () => {
    expect(attributeClaim("sprint(101): record plan_commit 87fdfeb", null)).toEqual({
      kind: "coord",
      sprint: "101",
    });
  });

  // Exclusion siblings: rules 5/6a's own DELIBERATE ambiguity refusals must not be re-litigated by
  // this new arm -- both stay `unscoped`, exactly as they did before T4.
  test("exclusion: an adjacent combined token (T1+T2:, space form) stays unscoped, not unmatched-shape", () => {
    expect(attributeClaim("sprint(095) T1+T2: shared refactor", null)).toEqual({ kind: "unscoped" });
  });

  test("exclusion: a qualifier naming a SECOND task (T1 and T2:) stays unscoped, not unmatched-shape", () => {
    expect(attributeClaim("sprint(093) T1 and T2: joint fix", null)).toEqual({ kind: "unscoped" });
  });
});

describe("checkDodDelta -- SPRINT-102 T4 must-FAIL: real unmatched-shape subject reddens, naming itself", () => {
  test("must-FAIL: the real SPRINT-094 subject reddens with an unmatched-task-shape finding naming the subject", () => {
    const fx = loadFixture("unmatched-task-shape-must-fail");
    const result = checkDodDelta(fx.subject, fx.trailer, fx.old, fx.new);
    expect(result.ok).toBe(false);
    expect(result.findings.map((f) => f.kind)).toEqual(["unmatched-task-shape"]);
    expect(result.findings[0]!.message).toContain(fx.subject);
    expect(result.findings[0]!.message).toMatch(/task-shaped but matches no known attribution arm/);
  });

  test("sibling control: a genuine coordinator subject, in the SAME run, stays green", () => {
    const fx = loadFixture("unmatched-task-shape-sibling");
    const result = checkDodDelta(fx.subject, fx.trailer, fx.old, fx.new);
    expect(result.ok).toBe(true);
    expect(result.findings).toEqual([]);
    expect(result.note).toMatch(/coordinator-scoped/);
  });
});
