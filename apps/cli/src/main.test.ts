import { describe, expect, test } from "bun:test";
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { parse, run, specReadExitCode } from "./main.ts";
import { readSpecSectionFromDisk } from "./spec-file-reader.ts";
import { tokenize } from "../../../packages/standard/src/tokenizer.ts";
import { marksInStandard, readSection, reconcile } from "../../../packages/standard/src/spec-reader.ts";

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
      .map((l) => l.split(/\s+/)[0] ?? "");

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

// SPRINT-087 T5 -- the process-boundary exit mapping itself, tested directly against ALL FIVE current
// `SpecFinding` values (`packages/standard/src/spec-reader.ts`'s `SpecFinding` union), not only the ones
// `--section` can reach today. `runSection` can only ever PRODUCE `spec-not-found`/`spec-table-unreadable`
// (its own call chain never reaches `reconcile`/`marksInStandard` -- nothing in this CLI wires
// `--reconcile` or a marks-check yet, so `spec-counts-unreadable`/`section-rows-mismatch`/
// `marks-table-unreadable` are not reachable through ANY `Invocation` shape today; `--rule` never touches
// the spec reader at all). `specReadExitCode` does not care: it switches on `.ok`, never `.finding`, so
// it maps every one of the five identically -- proven here at RUNTIME (TD-101: nothing here type-checks
// TypeScript, so the union's exhaustiveness is asserted, never assumed from the type alone) against real
// values the domain's own constructors produce, not hand-rolled literals shaped to match by hand.
//
// DoD 1's own Verify clause reads "Shell spawned as the oracle, NOT a copied literal" -- an honest count
// against that bar, revised after review (SPRINT-087 T5 revise, reviewer finding 1):
//   - spec-table-unreadable: ORACLE-VERIFIED, but by the pre-existing --section 99 CLI test above (T4's),
//     which spawns `read-spec-rules.sh SPEC_PATH --section 99` and compares exit codes. The direct
//     mapping test below for this finding is a SECOND, literal-based check of the pure function alone --
//     redundant with the oracle for THIS finding, kept because it is the same shape as the other four and
//     removing it would make the block read as four kinds of test instead of one.
//   - spec-not-found: ORACLE-VERIFIED, below -- a genuinely missing path is fed to BOTH
//     `readSpecSectionFromDisk` (this engine's own adapter) and the real `read-spec-rules.sh`, and both
//     exit codes are asserted to agree, the same shape as the §99 test.
//   - spec-counts-unreadable, section-rows-mismatch, marks-table-unreadable: LITERAL-VERIFIED ONLY,
//     against real domain-constructed values, NOT the Shell oracle. No `Invocation` this CLI accepts
//     today reaches `reconcile()` or `marksInStandard()` -- nothing wires `--reconcile` or a marks-check
//     into `parse()`/`run()` -- so there is no end-to-end path to spawn the oracle against for these
//     three. That gap is real, is NOT this task's to close (adding CLI flags to reach them is new
//     surface, not exit-mapping), and is filed as TD-103 for whichever task wires `--reconcile`/marks
//     into the CLI (H12) to close by adding the same oracle-comparison shape then.
//
// Net: 2/5 findings oracle-verified end-to-end (spec-not-found, spec-table-unreadable -- the two
// reachable through this CLI today), 3/5 mapping-verified only (unreachable through any CLI invocation
// today, TD-103).
describe("specReadExitCode -- the exit-code MAPPING itself, every SpecFinding (SPRINT-087 T5, DoD 1)", () => {
  const SPEC_PATH = fileURLToPath(new URL("../../../spec/STANDARD.md", import.meta.url));
  const realSpecText = readFileSync(SPEC_PATH, "utf8");

  /** Spawns the real Shell oracle against an ARBITRARY spec path (unlike `runShellSectionReader`, which
   * is pinned to the real `spec/STANDARD.md`) -- needed here because `spec-not-found`'s oracle comparison
   * must run the SAME missing path through both sides, never `SPEC_PATH`. */
  function runShellReaderAgainstPath(path: string, section: number): { readonly code: number; readonly stderr: string } {
    try {
      execFileSync("sh", [SHELL_READER_PATH, path, "--section", String(section)], { encoding: "utf8" });
      return { code: 0, stderr: "" };
    } catch (e) {
      const err = e as { status?: number; stderr?: string };
      return { code: err.status ?? 1, stderr: err.stderr ?? "" };
    }
  }

  /** Mirrors packages/standard/src/spec-reader.test.ts's own fixture transform, verbatim (never a
   * second, drifting copy of the anchored-match discipline that transform already earns). */
  function stripFirstRow(specText: string, idLiteral: string): string {
    const anchor = new RegExp(`^\\| *\`${idLiteral}\` *\\|`);
    const lines = specText.split(/\r\n|\r|\n/);
    let dropped = false;
    const out: string[] = [];
    for (const line of lines) {
      if (!dropped && anchor.test(line)) {
        dropped = true;
        continue;
      }
      out.push(line);
    }
    return out.join("\n");
  }
  function stripClassifiedRow(specText: string): string {
    return specText
      .split(/\r\n|\r|\n/)
      .filter((line) => !/^\| *classified *\|/.test(line))
      .join("\n");
  }

  // ORACLE-VERIFIED (1 of 2 reachable findings): a genuinely missing spec path is fed to BOTH this
  // engine's own adapter (`readSpecSectionFromDisk`, which every `--section` invocation calls) and the
  // real `read-spec-rules.sh`, THE SAME PATH on both sides -- never a copied literal (DoD 1's own Verify
  // clause). This is reachable end-to-end in principle (a corrupted/deleted bundled spec would hit this
  // exact path through `run()`); it is exercised directly at the adapter here, rather than through
  // `parse()`/`run()`, only because `BUNDLED_SPEC_PATH` is a fixed constant `Invocation` has no field to
  // override -- the read attempt and the exit mapping are the real production functions, unmodified.
  test("spec-not-found: a genuinely missing spec path, oracle-verified against the SAME path", () => {
    const dir = mkdtempSync(join(tmpdir(), "cli-t5-specnotfound-"));
    try {
      const missing = join(dir, "no-such-spec.md"); // never written

      const result = readSpecSectionFromDisk(missing, 9);
      if (result.ok) throw new Error("expected a failure result");
      expect(result.finding).toBe("spec-not-found");
      const cliExit = specReadExitCode(result);

      const oracle = runShellReaderAgainstPath(missing, 9);
      // Printed side-by-side so both exit codes are visible in the evidence, not just the assertion:
      console.log(`spec-not-found oracle comparison: CLI exit=${cliExit}, Shell exit=${oracle.code}`);
      expect(oracle.code).not.toBe(0);
      expect(oracle.stderr).toContain("spec-not-found");
      expect(cliExit).toBe(1);
      // Both sides agree: neither is 0 -- the CLI's mapping and the Shell oracle concur on THIS path.
      expect(cliExit === 0).toBe(oracle.code === 0);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  test("spec-table-unreadable (an out-of-range §N against the real Standard) exits 1 -- redundant with the --section 99 CLI/oracle test above; see the block comment", () => {
    const doc = tokenize(realSpecText, SPEC_PATH);
    const result = readSection(doc, 999, SPEC_PATH);
    if (result.ok) throw new Error("expected a failure result");
    expect(result.finding).toBe("spec-table-unreadable");
    expect(specReadExitCode(result)).toBe(1);
  });

  // MAPPING-LEVEL ONLY (TD-103): no `Invocation` this CLI accepts reaches `reconcile()` -- see the block
  // comment above the describe.
  test("spec-counts-unreadable (§14's classified row stripped) exits 1 -- mapping-level only, not CLI-reachable (TD-103)", () => {
    const noCounts = stripClassifiedRow(realSpecText);
    const doc = tokenize(noCounts, "spec-no-counts.md");
    const result = reconcile(doc, "spec-no-counts.md");
    if (result.ok) throw new Error("expected a failure result");
    expect(result.finding).toBe("spec-counts-unreadable");
    expect(specReadExitCode(result)).toBe(1);
  });

  // MAPPING-LEVEL ONLY (TD-103): same reason -- `reconcile()` is unreachable through any CLI Invocation.
  test("section-rows-mismatch (a row short of §2's published count) exits 1 -- mapping-level only, not CLI-reachable (TD-103)", () => {
    const short = stripFirstRow(realSpecText, "S2\\.F-CAP");
    const doc = tokenize(short, "spec-short-s2.md");
    const result = reconcile(doc, "spec-short-s2.md");
    if (result.ok) throw new Error("expected a failure result");
    expect(result.finding).toBe("section-rows-mismatch");
    expect(specReadExitCode(result)).toBe(1);
  });

  // MAPPING-LEVEL ONLY (TD-103): `marksInStandard()` is likewise unreachable through any CLI Invocation
  // -- nothing wires a marks-check in.
  test("marks-table-unreadable (no §14 at all) exits 1 -- mapping-level only, not CLI-reachable (TD-103)", () => {
    const doc = tokenize("## §1 — Not §14\n\n| Rule |\n|---|\n| `S1.X` |", "f.md");
    const result = marksInStandard(doc, "f.md");
    if (result.ok) throw new Error("expected a failure result");
    expect(result.finding).toBe("marks-table-unreadable");
    expect(specReadExitCode(result)).toBe(1);
  });

  // --- DoD 2 at the mapping level: SpecReadOk exits 0, INCLUDING the legitimate zero-row case ---------
  test("SpecReadOk with real rows (§9) exits 0", () => {
    const doc = tokenize(realSpecText, SPEC_PATH);
    const result = readSection(doc, 9, SPEC_PATH);
    if (!result.ok) throw new Error(`expected success, got ${result.finding}`);
    expect(result.rows.length).toBeGreaterThan(0);
    expect(specReadExitCode(result)).toBe(0);
  });

  test("SpecReadOk with §8's legitimate ZERO rows still exits 0 -- absence and emptiness stay distinct here too", () => {
    const doc = tokenize(realSpecText, SPEC_PATH);
    const result = readSection(doc, 8, SPEC_PATH);
    if (!result.ok) throw new Error(`expected success, got ${result.finding}`);
    expect(result.rows).toEqual([]);
    expect(specReadExitCode(result)).toBe(0);
  });

  // --- SPRINT-087 T5 revise (reviewer finding 2): the TOTALITY guard -- `{ readonly ok: boolean }`
  // enforces nothing at runtime (TD-101), so malformed input must fail SAFE, never silently pass. Every
  // real constructor in this codebase returns a literal boolean, so none of these shapes is reachable
  // through a real `SpecReadResult`/`MarksReadResult` today -- asserted anyway, because a guard with no
  // test proving it fires is indistinguishable from dead code to a future reader, who could delete it as
  // defensive noise. `as any` below is deliberate: these are intentionally NOT well-typed `SpecReadResult`
  // values, and TS would otherwise flag the literal at the call site (which would prove nothing, since
  // TD-101 already established nothing here type-checks at build time anyway).
  test("a truthy STRING ok ('false', reading as false to a human) fails safe to exit 1, not 0 -- the false-assurance shape this guard exists to prevent", () => {
    expect(specReadExitCode({ ok: "false" } as any)).toBe(1);
  });

  test("a truthy non-boolean ok ('yes') fails safe to exit 1, not 0", () => {
    expect(specReadExitCode({ ok: "yes" } as any)).toBe(1);
  });

  test("a truthy numeric ok (1) fails safe to exit 1, not 0", () => {
    expect(specReadExitCode({ ok: 1 } as any)).toBe(1);
  });

  test("an object with no ok field at all fails safe to exit 1", () => {
    expect(specReadExitCode({} as any)).toBe(1);
  });

  test("ok:true genuinely means success even alongside an unrelated field -- the guard does not over-fire on a well-formed value", () => {
    expect(specReadExitCode({ ok: true, finding: "spec-not-found" } as any)).toBe(0);
  });

  test("null/undefined throw loudly rather than silently mapping to either exit code", () => {
    expect(() => specReadExitCode(null as any)).toThrow();
    expect(() => specReadExitCode(undefined as any)).toThrow();
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

// --- Tier G evidence (SPRINT-087 T5; DoD 3) ----------------------------------------------------------
//
// specReadExitCode -- the artifact T5 actually introduced -- gets its own 2 targeted seeds, one per
// DoD it proves, run AFTER the reviewer's revise (finding 2's `=== true` guard is already in the
// pristine baseline both seeds are measured against). Same discipline as T4's block above: LANDED
// (confirmed via `git diff --stat` showing the change), confirmed the file still PARSES (`bun test`
// ran to completion), confirmed reddening ONLY the named case(s) while every sibling stayed green, then
// RESTORED and confirmed byte-identical.
//
// Hash convention (kept from the original run, per the reviewer's note on L-169): `git hash-object
// apps/cli/src/main.ts` compared against `git rev-parse :apps/cli/src/main.ts` (the staged blob's own
// SHA-1) -- judged MORE robust than `git show <ref>:<path> | sha256sum` because `git hash-object`
// applies the same clean-filter/CRLF normalization a commit would, rather than relying on comparing two
// independently-piped shas by discipline alone.
//
// Baseline (this task's finished, staged state, post-revise): both hashes 41 tests, 41 pass, 0 fail.
//   git hash-object apps/cli/src/main.ts        -> f4b307035df63b917a96638bc885270e487d81b5
//   git rev-parse :apps/cli/src/main.ts         -> f4b307035df63b917a96638bc885270e487d81b5
//
//   1. DoD 1 (every SpecReadFail exits 1) defeated: `specReadExitCode` body swapped from
//      `result.ok === true ? 0 : 1` to an unconditional `return 0`. Reddened EXACTLY 11 of 41: the 5
//      direct-SpecFinding mapping tests, the spec-not-found oracle test, the pre-existing --section 99
//      CLI/oracle test (T4's), and 4 of the 6 revise-added malformed-input tests -- every one that
//      asserts `toBe(1)` ("false" string, "yes" string, numeric 1, empty object) plus the
//      null/undefined-throws test (an unconditional `return 0` never reaches the `.ok` property access
//      that would have thrown). 30 stayed green: both §8 zero-row tests (mapping-level and CLI-level --
//      ok:true was never touched by this seed, so both correctly still read 0), the "ok:true genuinely
//      means success" test (also unaffected, same reason), and every other test in the file. Proves DoD 1
//      is genuinely load-bearing across all 5 findings PLUS the malformed-input guard, not just the two
//      CLI-reachable ones.
//   2. DoD 2 (§8's legitimate zero rows still exit 0) defeated: `runSection` given an early
//      `if (specResult.rows.length === 0) return 1;` immediately before the rows are mapped to rules --
//      the exact "mistakes emptiness for absence" bug DoD 2 exists to rule out. Reddened EXACTLY 1 of 41:
//      "CONTROL: §8's legitimate zero rows exit 0, no output, distinct from §99's failure" (expected 0,
//      got 1). 40 stayed green, including the §99 fail test (unaffected -- §99 never reaches this line;
//      it fails earlier, at the `!specResult.ok` check) and the MAPPING-level §8 zero-row test (which
//      calls `readSection`+`specReadExitCode` directly, bypassing `runSection` entirely, so this seed
//      cannot touch it) -- proving DoD 2's absence-vs-emptiness distinction is enforced specifically at
//      the CLI boundary (`runSection`), not merely inherited for free from the reader underneath it.
//
// Both seeds restored; `git hash-object apps/cli/src/main.ts` reproduced f4b307035df63b917a96638bc885270e487d81b5
// after each restore, matching `git rev-parse :apps/cli/src/main.ts` -- confirmed identical to the
// staged baseline both times, and `bun test apps/cli/src/main.test.ts` returned to 41 pass / 0 fail
// after each restore.
