import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import {
  attributeClaim,
  checkDodDelta,
  findNewTicks,
  findSprintDocPath,
  parseDodSections,
} from "../scripts/lib/check-dod-delta.ts";

const FIXTURES = fileURLToPath(new URL("fixtures/dod-delta/", import.meta.url));

function loadFixture(name: string): { subject: string; old: string; new: string } {
  const dir = FIXTURES + name + "/";
  return {
    subject: readFileSync(dir + "subject.txt", "utf8").trim(),
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
    const result = checkDodDelta(fx.subject, null, fx.old, fx.new);
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
    const result = checkDodDelta(fx.subject, null, fx.old, fx.new);
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
    const result = checkDodDelta(fx.subject, null, fx.old, fx.new);
    expect(result.ok).toBe(true);
    expect(result.findings).toEqual([]);
    expect(result.note).toMatch(/coordinator-scoped/);
  });

  test("(C) a combined-task token narrows to unscoped rather than guessing the first task", () => {
    const fx = loadFixture("population-unscoped");
    const result = checkDodDelta(fx.subject, null, fx.old, fx.new);
    expect(result.ok).toBe(true);
    expect(result.findings).toEqual([]);
    expect(result.note).toMatch(/narrowed per SPRINT-101 T3 DoD 1/);
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
