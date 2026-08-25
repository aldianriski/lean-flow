import { describe, expect, test } from "bun:test";
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { parse, run } from "./main.ts";

const SHELL_READER_PATH = fileURLToPath(new URL("../../../scripts/lib/read-spec-rules.sh", import.meta.url));
const SPEC_PATH = fileURLToPath(new URL("../../../spec/STANDARD.md", import.meta.url));

/** Runs the real `read-spec-rules.sh`, fresh, never a copied literal -- the independent oracle DoD 1
 * names by name ("compared against read-spec-rules.sh --section N, which already answers this
 * question"). */
function runShellSectionReader(section: number): { readonly code: number; readonly stdout: string } {
  try {
    const stdout = execFileSync("sh", [SHELL_READER_PATH, SPEC_PATH, "--section", String(section)], { encoding: "utf8" });
    return { code: 0, stdout };
  } catch (e) {
    const err = e as { status?: number; stdout?: string };
    return { code: err.status ?? 1, stdout: err.stdout ?? "" };
  }
}

// Tests name behaviour, never shape (V3 §33). "parser test" would tell a later reader nothing
// about what broke.

describe("leanflow argument parsing", () => {
  test("recognises --version and its short form as the same intent", () => {
    expect(parse(["--version"])).toEqual({ kind: "version" });
    expect(parse(["-v"])).toEqual({ kind: "version" });
  });

  test("treats a bare invocation as a request for help, not an error", () => {
    expect(parse([])).toEqual({ kind: "help" });
  });

  test("prefers --version over --help when both are given, so the answer is deterministic", () => {
    expect(parse(["--help", "--version"])).toEqual({ kind: "version" });
  });

  test("carries unrecognised arguments through instead of discarding them", () => {
    expect(parse(["conformance", "."])).toEqual({
      kind: "unknown",
      args: ["conformance", "."],
    });
  });

  test("--rule takes a rule id and an optional repo-dir, defaulting repo-dir to '.'", () => {
    expect(parse(["--rule", "S9.LOGDIR", "/tmp/repo"])).toEqual({
      kind: "rule",
      ruleId: "S9.LOGDIR",
      repoDir: "/tmp/repo",
    });
    expect(parse(["--rule", "S9.LOGDIR"])).toEqual({ kind: "rule", ruleId: "S9.LOGDIR", repoDir: "." });
  });

  test("--rule with no id following falls through to unknown rather than crashing", () => {
    expect(parse(["--rule"])).toEqual({ kind: "unknown", args: ["--rule"] });
  });

  test("--section takes a section number and an optional repo-dir, defaulting repo-dir to '.'", () => {
    expect(parse(["--section", "9", "/tmp/repo"])).toEqual({
      kind: "section",
      section: "9",
      repoDir: "/tmp/repo",
    });
    expect(parse(["--section", "9"])).toEqual({ kind: "section", section: "9", repoDir: "." });
  });

  test("--section with no value following falls through to unknown rather than crashing", () => {
    expect(parse(["--section"])).toEqual({ kind: "unknown", args: ["--section"] });
  });
});

describe("leanflow exit codes", () => {
  const capture = () => {
    const lines: string[] = [];
    return { lines, write: (s: string) => lines.push(s) };
  };

  test("succeeds on --version and names itself pre-release", () => {
    const { lines, write } = capture();
    expect(run({ kind: "version" }, write)).toBe(0);
    expect(lines.join("\n")).toContain("pre-release");
  });

  test("fails with a distinct code on an unknown argument, never silently succeeds", () => {
    const { lines, write } = capture();
    expect(run({ kind: "unknown", args: ["migrate"] }, write)).toBe(2);
    expect(lines.join("\n")).toContain("unknown argument");
  });

  test("points at the Shell implementation that still holds authority", () => {
    const { lines, write } = capture();
    run({ kind: "help" }, write);
    // The strangler keeps Shell authoritative until a family cuts over (EPIC-014 D2). A help
    // text that omits this would tell an operator the TS engine does more than it does.
    expect(lines.join("\n")).toContain("sh conformance.sh .");
  });
});

describe("leanflow --rule (SPRINT-087 T1 tracer bullet)", () => {
  const capture = () => {
    const lines: string[] = [];
    return { lines, write: (s: string) => lines.push(s) };
  };

  test("a malformed rule id fails distinctly, never silently as 'unimplemented'", () => {
    const { lines, write } = capture();
    expect(run({ kind: "rule", ruleId: "not-a-rule-id", repoDir: "." }, write)).toBe(2);
    expect(lines.join("\n")).toContain("not a rule id");
  });

  test("a well-formed id nothing registers reports rule-unimplemented, distinct from a fail", () => {
    const { lines, write } = capture();
    expect(run({ kind: "rule", ruleId: "S1.LAW2", repoDir: "." }, write)).toBe(2);
    expect(lines.join("\n")).toContain("rule-unimplemented");
  });

  test("S9.LOGDIR against a repo with a misplaced Execution Log: FAIL, exit 1, named finding", () => {
    const repo = mkdtempSync(join(tmpdir(), "cli-rule-fail-"));
    mkdirSync(join(repo, "docs", "sprint"), { recursive: true });
    writeFileSync(join(repo, "docs", "sprint", "SPRINT-001-x-log.md"), "log");

    const { lines, write } = capture();
    expect(run({ kind: "rule", ruleId: "S9.LOGDIR", repoDir: repo }, write)).toBe(1);
    expect(lines.join("\n")).toContain("sprint-log-outside-logs-dir");
  });

  test("S9.LOGDIR against a clean repo: PASS, exit 0", () => {
    const repo = mkdtempSync(join(tmpdir(), "cli-rule-pass-"));
    mkdirSync(join(repo, "docs", "sprint"), { recursive: true });
    writeFileSync(join(repo, "docs", "sprint", "SPRINT-001-x.md"), "# plan");

    const { lines, write } = capture();
    expect(run({ kind: "rule", ruleId: "S9.LOGDIR", repoDir: repo }, write)).toBe(0);
    expect(lines.join("\n")).toContain("PASS");
  });

  // SPRINT-087 T1 revise, Finding 1: the CLI prints ONE line PER finding, not one line naming both
  // -- the same cardinality the result domain now carries end-to-end (result.ts's `findings` array).
  test("TWO misplaced logs print TWO finding lines, not one line naming both", () => {
    const repo = mkdtempSync(join(tmpdir(), "cli-rule-two-"));
    mkdirSync(join(repo, "docs", "sprint"), { recursive: true });
    writeFileSync(join(repo, "docs", "sprint", "SPRINT-001-x-log.md"), "log");
    writeFileSync(join(repo, "docs", "sprint", "SPRINT-Execution-Log-002.md"), "log");

    const { lines, write } = capture();
    expect(run({ kind: "rule", ruleId: "S9.LOGDIR", repoDir: repo }, write)).toBe(1);
    const findingLines = lines.filter((l) => l.includes("sprint-log-outside-logs-dir"));
    expect(findingLines).toHaveLength(2);
  });
});

describe("leanflow --section (SPRINT-087 T4)", () => {
  const capture = () => {
    const lines: string[] = [];
    return { lines, write: (s: string) => lines.push(s) };
  };

  /** First whitespace token of a rendered line ("PASS ", "gap  ", "note ", "FAIL ") is the prefix;
   * the rule id is the token right after it. Used only to compare AGAINST the oracle's own id list --
   * never to recompute an expectation the way the code does (the tdd anti-tautology rule). */
  function ruleIdsOf(lines: readonly string[]): string[] {
    return lines
      .filter((l) => /^(PASS|FAIL|gap|note)\s/.test(l) && !l.startsWith("  -"))
      .map((l) => l.trim().split(/\s+/)[1] as string);
  }

  // --- DoD 1: --section N selects that section's rules and no others -------------------------------
  test("DoD 1: --section 9 reports EXACTLY §9's rule ids, in §9's own order, matching the Shell oracle", () => {
    const { lines, write } = capture();
    run({ kind: "section", section: "9", repoDir: "." }, write);

    const oracle = runShellSectionReader(9);
    expect(oracle.code).toBe(0);
    const oracleIds = oracle.stdout
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0)
      .map((l) => l.split(/\s+/)[0]);

    expect(ruleIdsOf(lines)).toEqual(oracleIds);
  });

  // Sibling control for the seed below: a DIFFERENT section's id set is unaffected.
  test("CONTROL: --section 12 reports EXACTLY §12's rule ids, none of §9's", () => {
    const { lines, write } = capture();
    run({ kind: "section", section: "12", repoDir: "." }, write);
    const ids = ruleIdsOf(lines);
    expect(ids.every((id) => id.startsWith("S12."))).toBe(true);
    expect(ids).toContain("S12.SECRETS");
    expect(ids).not.toContain("S9.LOGDIR");
  });

  test("a registered rule inside the targeted section still evaluates for real: PASS on a clean repo", () => {
    const repo = mkdtempSync(join(tmpdir(), "cli-section-pass-"));
    mkdirSync(join(repo, "docs", "sprint"), { recursive: true });
    writeFileSync(join(repo, "docs", "sprint", "SPRINT-001-x.md"), "# plan");

    const { lines, write } = capture();
    expect(run({ kind: "section", section: "9", repoDir: repo }, write)).toBe(0);
    expect(lines.join("\n")).toContain("PASS  S9.LOGDIR");
  });

  test("a registered rule inside the targeted section FAILs for real, and the exit code reflects it", () => {
    const repo = mkdtempSync(join(tmpdir(), "cli-section-fail-"));
    mkdirSync(join(repo, "docs", "sprint"), { recursive: true });
    writeFileSync(join(repo, "docs", "sprint", "SPRINT-001-x-log.md"), "log");

    const { lines, write } = capture();
    expect(run({ kind: "section", section: "9", repoDir: repo }, write)).toBe(1);
    expect(lines.join("\n")).toContain("FAIL  S9.LOGDIR");
  });

  test("an unregistered rule inside the section reports GAP -- and a GAP never fails the run alone", () => {
    const repo = mkdtempSync(join(tmpdir(), "cli-section-gap-"));
    mkdirSync(join(repo, "docs", "sprint"), { recursive: true });
    writeFileSync(join(repo, "docs", "sprint", "SPRINT-001-x.md"), "# plan");

    const { lines, write } = capture();
    expect(run({ kind: "section", section: "9", repoDir: repo }, write)).toBe(0);
    expect(lines.join("\n")).toContain("gap   S9.TWOFILES");
  });

  test("an excluded rule inside the section is reported by name, never dispatched, never a PASS/FAIL", () => {
    const { lines, write } = capture();
    run({ kind: "section", section: "9", repoDir: "." }, write);
    const text = lines.join("\n");
    expect(text).toContain("note  S9.JUDGMENTTICK -- excluded/judgment-required");
  });

  // --- DoD 2: a partial invocation carries NO global conformance level at all -----------------------
  // Checked on the RESULT, not the printer: both the printed lines (weak, printer-only check -- kept
  // as a belt-and-braces regression net) AND -- the load-bearing half -- that `classifySection`'s own
  // return value has no `globalLevel` key (see section.test.ts, which asserts this with `"key" in obj`
  // directly on the domain object; a renderer-only check here could not catch a level attached to the
  // object but never printed by THIS renderer, which is exactly why that assertion lives beside the
  // type it protects, not only here).
  test("DoD 2: --section's printed output never contains a global 'level:' line", () => {
    const { lines, write } = capture();
    run({ kind: "section", section: "9", repoDir: "." }, write);
    for (const line of lines) expect(line).not.toMatch(/^\s*level:/);
  });

  test("DoD 2: still no 'level:' line on a section with a real FAIL in it", () => {
    const repo = mkdtempSync(join(tmpdir(), "cli-section-nolevel-"));
    mkdirSync(join(repo, "docs", "sprint"), { recursive: true });
    writeFileSync(join(repo, "docs", "sprint", "SPRINT-001-x-log.md"), "log");

    const { lines, write } = capture();
    run({ kind: "section", section: "9", repoDir: repo }, write);
    for (const line of lines) expect(line).not.toMatch(/^\s*level:/);
  });

  // --- DoD 3: unknown section fails loudly, distinct from the legitimate zero-row section -----------
  test("DoD 3: a malformed section argument fails loudly with its own message, exit 2", () => {
    const { lines, write } = capture();
    expect(run({ kind: "section", section: "abc", repoDir: "." }, write)).toBe(2);
    expect(lines.join("\n")).toContain("not a section number: abc");
  });

  test("DoD 3: section 0 (not a positive section number) fails loudly, exit 2, never silently '0 rules'", () => {
    const { lines, write } = capture();
    expect(run({ kind: "section", section: "0", repoDir: "." }, write)).toBe(2);
    expect(lines.join("\n")).toContain("not a section number: 0");
  });

  test("DoD 3: an out-of-range section (§99) fails loudly with a named finding, exit 1, matching Shell", () => {
    const { lines, write } = capture();
    expect(run({ kind: "section", section: "99", repoDir: "." }, write)).toBe(1);
    expect(lines.join("\n")).toContain("spec-table-unreadable");

    const oracle = runShellSectionReader(99);
    expect(oracle.code).not.toBe(0);
  });

  // Sibling control: §8's legitimate zero rows exit 0 -- absence (a real defect) and emptiness (a
  // real, published fact) must stay distinguishable at the CLI boundary too.
  test("CONTROL: §8's legitimate zero rows exit 0, no output, distinct from §99's failure", () => {
    const { lines, write } = capture();
    expect(run({ kind: "section", section: "8", repoDir: "." }, write)).toBe(0);
    expect(lines).toEqual([]);
  });
});

// --- Tier G evidence (SPRINT-087 T4; ADR-029 -- this CLI wiring is part of a Tier G engine) ---------
//
// 4 branches enumerated from the FINISHED code (`runSection`'s format guard, its `SpecReadFail`
// mapping, DoD 1's section-scoping, DoD 2's level-absence), one targeted seed per branch, each
// confirmed LANDED (`cmp` against a pristine copy saved before editing), confirmed the file still
// PARSES (`bun test apps/cli/src/main.test.ts` ran to completion rather than erroring out of the
// file), confirmed reddening ONLY its named case(s) while every other test in the file stayed green,
// then RESTORED and confirmed byte-identical.
//
// Every hash below is `git show <ref>:<path> | sha256sum` -- the SHA-256 of the LF blob git itself
// stores, normalization-independent regardless of local `core.autocrlf` (L-169). `<ref>` is
// `:apps/cli/src/main.ts` (the git INDEX at staging time, before this task's commit existed) --
// identical to `HEAD:...` once committed, since nothing changed in this file after staging.
//
//   1. format guard defeated: `SECTION_ARG_RE` widened from `/^[1-9]\d*$/` to `/.*/` so "abc"/"0" are
//      accepted and `Number("abc")` (NaN) flows into `readSpecSectionFromDisk`, which resolves it to
//      `spec-table-unreadable` (exit 1, not a crash). Reddened EXACTLY 2 of 28: "a malformed section
//      argument fails loudly..." (expected 2, got 1) and "section 0 ... fails loudly..." (expected 2,
//      got 1). 26 stayed green, including the §99/§8 pair -- proving the seed is scoped to the FORMAT
//      guard and not the spec-read path below it.
//   2. `SpecReadFail` mapping defeated: `runSection`'s `return 1` (on `!specResult.ok`) swapped to
//      `return 0`. Reddened EXACTLY 1 of 28: "an out-of-range section (§99) fails loudly..." (expected
//      1, got 0). The §8 CONTROL stayed green (§8 is `ok: true`, so it never enters this branch) --
//      proving the seed did not just make everything pass.
//   3. DoD 1 defeated: `runSection`'s call to `readSpecSectionFromDisk(BUNDLED_SPEC_PATH, section)`
//      swapped for `readSpecAllFromDisk(BUNDLED_SPEC_PATH)` (every section's rows, not just this one).
//      Reddened EXACTLY 4 of 28: "DoD 1: --section 9 reports EXACTLY §9's rule ids..." (102 ids
//      instead of 10), "CONTROL: --section 12 reports EXACTLY §12's rule ids..." (ids outside `S12.*`
//      now present), "DoD 3: an out-of-range section (§99) fails loudly..." (readSpecAllFromDisk
//      always succeeds over the whole doc, so §99 stopped failing at all -- exit 0, not 1) AND
//      "CONTROL: §8's legitimate zero rows exit 0, no output..." (all 100 rows printed instead of
//      zero). 24 stayed green, including every PASS/FAIL/gap content check, since S9.LOGDIR and
//      S9.TWOFILES were still PRESENT in the (now oversized) output, just no longer ALONE -- a wider
//      catch than anticipated, and a correct one: DoD 1's scoping is exactly what both §99's failure
//      and §8's legitimate emptiness depend on.
//   4. DoD 2 defeated: `classifySection`'s return literal in `packages/standard/src/section.ts` given
//      a `globalLevel: "Attested"` field (recorded in full in section.test.ts's own Tier G block --
//      cross-referenced here rather than re-seeded, since it is the SAME statement under test: "the
//      object main.ts renders from carries no global level"). Run in that same pass, all 28 tests in
//      THIS file stayed green, INCLUDING the two DoD 2 "never contains a 'level:' line" checks --
//      confirmed, as the task brief predicted, that a renderer-only guard does NOT catch this seed;
//      only section.test.ts's structural `"globalLevel" in report` check does.
//
// No seed left `apps/cli/src/main.ts` in a state `cmp` disagreed with the pristine copy on restore;
// each restore's `git show :apps/cli/src/main.ts | sha256sum` reproduced the same hash:
//   e75c03033b6a7d22b40a666de416eab55a1ae4505d642d38d4ee2990a8864eca (181 lines)
// `apps/cli/src/spec-file-reader.ts` was exercised only THROUGH main.ts's seeds above (never edited
// directly for this task) and was not itself seeded -- its own branches are guarded by
// spec-reader.test.ts/spec-file-reader.test.ts's existing Tier G coverage (T2/T3/T6/T7), which this
// task's DoD 1/3 tests reuse as an oracle rather than re-litigate.
