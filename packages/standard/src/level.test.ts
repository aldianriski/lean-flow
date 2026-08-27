import { describe, expect, test } from "bun:test";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { makeRuleId, type ConformanceLevel, type RuleMark, type StandardRule } from "./model.ts";
import type { RuleOutcome } from "./classify.ts";
import { classifyAll, composeFamilies } from "./traverse.ts";
import { bindRegistry, createRegistry } from "./registry.ts";
import { createF12Registry } from "./rules/f12-registry.ts";
import { FsGitBoundaryPort } from "./adapters/fs-git-boundary.ts";
import { readSection, toStandardRule } from "./spec-reader.ts";
import { tokenize } from "./tokenizer.ts";
import { classifySection } from "./section.ts";
import { attachLevel, computeLevel, type FullRunReport } from "./level.ts";

function ruleOf(id: string, mark: RuleMark, level: ConformanceLevel | null): StandardRule {
  return { id: makeRuleId(id), section: 9, mark, level, source: { file: "f.md", line: 1 } };
}

function excluded(id: string): RuleOutcome {
  return { kind: "excluded", ruleId: makeRuleId(id), reason: "judgment-only", detail: "d" };
}

function evaluated(id: string, verdict: "pass" | "fail" | "note" | "gap" | "hold"): RuleOutcome {
  return { kind: "evaluated", evaluation: { ruleId: makeRuleId(id), verdict, findings: verdict === "fail" ? [{ name: "x", detail: "d" }] : [], detail: "d" } };
}

// --- computeLevel: the six buckets, isolated -------------------------------------------------------
describe("computeLevel — the six buckets, each isolated (§14's ladder, ported from Shell's driver)", () => {
  test("no rules at all: Attested (nothing blocks it -- an empty run has no findings)", () => {
    expect(computeLevel([], [])).toBe("Attested");
  });

  test("all pass: Attested", () => {
    const rules = [ruleOf("S9.A", "mechanical", "Structural"), ruleOf("S9.B", "mechanical", "Gated")];
    const outcomes = [evaluated("S9.A", "pass"), evaluated("S9.B", "pass")];
    expect(computeLevel(rules, outcomes)).toBe("Attested");
  });

  test("excluded (judgment-only) rules never enter the arithmetic -- Attested despite being present", () => {
    const rules = [ruleOf("S9.A", "judgment-only", null)];
    const outcomes = [excluded("S9.A")];
    expect(computeLevel(rules, outcomes)).toBe("Attested");
  });

  test("gap never enters the arithmetic -- a whole run of gaps is still Attested, never a phantom fail", () => {
    const rules = [ruleOf("S9.A", "mechanical", "Structural")];
    const outcomes = [evaluated("S9.A", "gap")];
    expect(computeLevel(rules, outcomes)).toBe("Attested");
  });

  test("note never enters the arithmetic on its own", () => {
    const rules = [ruleOf("S9.A", "mechanical", "Attested")];
    const outcomes = [evaluated("S9.A", "note")];
    expect(computeLevel(rules, outcomes)).toBe("Attested");
  });

  test("a Structural FAIL: level none -- Structural not yet reached", () => {
    const rules = [ruleOf("S9.A", "mechanical", "Structural")];
    const outcomes = [evaluated("S9.A", "fail")];
    expect(computeLevel(rules, outcomes)).toBe("none");
  });

  test("a Gated FAIL alone (Structural rules all clean): level Structural", () => {
    const rules = [ruleOf("S9.A", "mechanical", "Structural"), ruleOf("S9.B", "mechanical", "Gated")];
    const outcomes = [evaluated("S9.A", "pass"), evaluated("S9.B", "fail")];
    expect(computeLevel(rules, outcomes)).toBe("Structural");
  });

  test("an Attested FAIL alone: level Gated", () => {
    const rules = [ruleOf("S9.A", "mechanical", "Attested")];
    const outcomes = [evaluated("S9.A", "fail")];
    expect(computeLevel(rules, outcomes)).toBe("Gated");
  });

  test("a Structural HOLD: level none, same rung a Structural FAIL would cap -- but never the same VERDICT (DoD 2)", () => {
    const rules = [ruleOf("S9.A", "mechanical", "Structural")];
    const outcomes = [evaluated("S9.A", "hold")];
    expect(computeLevel(rules, outcomes)).toBe("none");
  });

  test("a Gated HOLD alone: level Structural", () => {
    const rules = [ruleOf("S9.A", "mechanical", "Gated")];
    const outcomes = [evaluated("S9.A", "hold")];
    expect(computeLevel(rules, outcomes)).toBe("Structural");
  });

  test("an Attested HOLD alone: level Gated -- the S13.TRAILERS/UNSIGNEDCLAIM shape", () => {
    const rules = [ruleOf("S9.A", "mechanical", "Attested")];
    const outcomes = [evaluated("S9.A", "hold")];
    expect(computeLevel(rules, outcomes)).toBe("Gated");
  });
});

// --- DoD 2: hold is distinguished from fail, never collapsed -- proven where it actually shows up:
// Shell's driver checks EVERY fail rung before it EVER consults a hold rung (the `if`/`elif` chain's
// own order, scripts/lib/conformance-engine.sh's closing block). A naive reimplementation that merges
// fail+hold into one severity-sorted list would disagree with Shell on exactly the two cases below --
// and would be indistinguishable from a correct one on every SINGLE-bucket test above, which is why
// this pair of tests, not the bucket tests, is what actually carries the DoD 2 claim.
describe("computeLevel — hold vs fail resolve to DIFFERENT outcomes (DoD 2), proven at the one place it matters: mixed severities", () => {
  test("an Attested FAIL outranks a Gated HOLD -- Shell checks ALL fail rungs before ANY hold rung", () => {
    const rules = [ruleOf("S9.A", "mechanical", "Attested"), ruleOf("S9.B", "mechanical", "Gated")];
    // A fail-then-hold-by-severity reading would say "Structural" (the gated hold is the stricter
    // block). Shell's own chain says "Gated" -- attested_fail is checked and returns BEFORE
    // gated_hold is ever consulted.
    const outcomes = [evaluated("S9.A", "fail"), evaluated("S9.B", "hold")];
    expect(computeLevel(rules, outcomes)).toBe("Gated");
  });

  test("CONTROL, the mirror case: swap fail and hold onto the SAME two rules -- now genuinely Structural", () => {
    const rules = [ruleOf("S9.A", "mechanical", "Attested"), ruleOf("S9.B", "mechanical", "Gated")];
    // The control: with the hold on the ATTESTED rule and the fail on the GATED one, gated_fail is
    // the earliest true rung in Shell's chain either way -- "Structural" here is not a coincidence of
    // the arithmetic being order-blind, it is what a Gated FAIL alone already gives (see the bucket
    // test above); this fixture exists to show the PAIR above is not vacuously always "Gated".
    const outcomes = [evaluated("S9.A", "hold"), evaluated("S9.B", "fail")];
    expect(computeLevel(rules, outcomes)).toBe("Structural");
  });

  test("a Structural FAIL outranks an Attested HOLD -- symmetric case at the other end of the ladder", () => {
    const rules = [ruleOf("S9.A", "mechanical", "Structural"), ruleOf("S9.B", "mechanical", "Attested")];
    const outcomes = [evaluated("S9.A", "fail"), evaluated("S9.B", "hold")];
    expect(computeLevel(rules, outcomes)).toBe("none");
  });

  test("a hold-only run and a fail-only run at the SAME level disagree on the exit code even though the level string matches -- see result.test.ts's own hold-vs-fail exit code proof; this file owns the LEVEL claim, not the exit code", () => {
    const rules = [ruleOf("S9.A", "mechanical", "Gated")];
    const failLevel = computeLevel(rules, [evaluated("S9.A", "fail")]);
    const holdLevel = computeLevel(rules, [evaluated("S9.A", "hold")]);
    // Both cap the SAME rung (Structural) -- the level ladder does not distinguish WHY a rung is
    // capped, only Shell's exit code does (§14: a hold is a level honestly reached, never a defect).
    // Documented here rather than left implicit, so a reader of this file does not conclude from the
    // pair of tests above that hold and fail always diverge -- they diverge exactly when MIXED across
    // rungs, never when isolated to one.
    expect(failLevel).toBe("Structural");
    expect(holdLevel).toBe("Structural");
    expect(failLevel).toBe(holdLevel);
  });
});

// --- fail-loud contract guards ------------------------------------------------------------------------
describe("computeLevel — fail-loud on a contract violation, never a silent misread", () => {
  test("rules/outcomes length mismatch throws, naming both lengths", () => {
    const rules = [ruleOf("S9.A", "mechanical", "Structural")];
    expect(() => computeLevel(rules, [])).toThrow(/rules \(1\) and outcomes \(0\)/);
  });

  test("a dispatched (evaluated) outcome paired with a null-level rule throws -- the zip is wrong, not the data", () => {
    const rules = [ruleOf("S9.A", "implementation-directed", null)];
    const outcomes = [evaluated("S9.A", "fail")];
    expect(() => computeLevel(rules, outcomes)).toThrow(/carries no level/);
  });

  // Sibling control: the SAME null-level rule, but EXCLUDED (as classify.ts always produces for
  // implementation-directed) rather than evaluated -- must NOT throw, proving the guard fires on the
  // genuine contract violation above and not on every null-level rule regardless of shape.
  test("CONTROL: the same null-level rule, excluded (its real shape), does not throw", () => {
    const rules = [ruleOf("S9.A", "implementation-directed", null)];
    const outcomes = [excluded("S9.A")];
    expect(() => computeLevel(rules, outcomes)).not.toThrow();
    expect(computeLevel(rules, outcomes)).toBe("Attested");
  });
});

// --- attachLevel: the sibling "full sweep" shape section.ts's header predicted --------------------
describe("attachLevel — the level-bearing sibling of TraversalReport, never a widening of it", () => {
  test("wraps a real classifyAll() TraversalReport with the computed level", () => {
    const registry = createRegistry<{ readonly a: string }>();
    registry.register(makeRuleId("S9.A"), () => ({ ruleId: makeRuleId("S9.A"), verdict: "fail", findings: [{ name: "x", detail: "d" }], detail: "d" }));
    const dispatch = composeFamilies([bindRegistry(registry, { a: "x" })]);
    const rules = [ruleOf("S9.A", "mechanical", "Structural")];

    const traversal = classifyAll(rules, dispatch);
    const full: FullRunReport = attachLevel(rules, traversal);

    expect(full.level).toBe("none");
    expect(full.outcomes).toBe(traversal.outcomes); // same array, not a copy
  });

  test("the result is FROZEN -- attaching anything further throws, never silently succeeds", () => {
    const full = attachLevel([], classifyAll([], composeFamilies([])));
    expect(Object.isFrozen(full)).toBe(true);
    expect(() => {
      (full as unknown as { extra: string }).extra = "x";
    }).toThrow(TypeError);
  });
});

// --- DoD 3: a PARTIAL invocation still carries NO global level ---------------------------------------
//
// The coordinator flagged mid-task that T9 (landing concurrently, in another worktree, not yet in
// this one) reroutes `apps/cli/src/main.ts`'s `runSection()` OFF `classifySection`/`SectionReport`
// and ONTO the SAME `classifyAll`/`TraversalReport` entry point `runFull()` uses. That makes the
// section.ts-only proof below (still true, still kept as a regression check on `classifySection`
// itself, which nothing here deletes or weakens) an INCOMPLETE guarantee for the shipped `--section`
// path once T9 lands: if `level.ts` had put the level ON `TraversalReport`, `--section` would inherit
// it for free, and DoD 3 would break silently the moment T9's caller change landed -- passing every
// test either task wrote, exactly the failure mode `section.ts`'s own header warns against ("the
// field itself must not exist").
//
// `apps/cli/src/` stays out of this task's Layers, so `runSection()`'s ACTUAL post-T9 body cannot be
// exercised from here (and doing so would also invert the architecture direction: a domain package
// importing an app is the edge `test/architecture/dependency-direction.test.ts` forbids). What CAN be
// proven from here, and is the stronger, caller-independent claim: NEITHER of the two shapes any
// version of `runSection()` could plausibly return (`SectionReport` before T9, `TraversalReport`
// after) carries a level, under ANY circumstance -- a level exists ONLY on `FullRunReport`, produced
// ONLY by calling `attachLevel` explicitly. `classifyAll` is the exact function both `runFull()` and
// (post-T9) `runSection()` call; proving ITS result is always level-less, regardless of which rules it
// was handed, is proving the invariant `--section` actually depends on today -- not a proxy for it.
describe("DoD 3 — a partial invocation still emits no global level, invariant of which shape its caller uses", () => {
  test("classifySection's result STILL carries no 'level' key -- regression check on the pre-T9 shape, untouched by this file", () => {
    const registry = createRegistry<{ readonly calls: string[] }>();
    const report = classifySection(9, [ruleOf("S9.A", "mechanical", "Structural")], registry, { calls: [] });
    expect("level" in report).toBe(false);
    expect(Object.isFrozen(report)).toBe(true);
    expect(() => {
      (report as unknown as { level: string }).level = "Attested";
    }).toThrow(TypeError);
    expect("level" in report).toBe(false);
  });

  test("classifyAll's own TraversalReport carries no 'level' key either -- THE shape T9's runSection() now returns too; only attachLevel's separate FullRunReport does", () => {
    const rules = [ruleOf("S9.A", "mechanical", "Structural")];
    const traversal = classifyAll(rules, composeFamilies([]));
    expect("level" in traversal).toBe(false);

    const full = attachLevel(rules, traversal);
    expect("level" in full).toBe(true);
    expect(Object.keys(full).sort()).toEqual(["level", "outcomes"]);
  });
});

// ====================================================================================================
// --- DoD 1: the full-run level matches Shell's, differential per repo, spawned live -----------------
//
// Only 5 rules are actually dispatchable in TS today (S9.LOGDIR + the four S12 mechanical rules --
// built-in.ts/f12-registry.ts), all of them Structural. §13 has 5 real Attested-level rules and is
// the ONLY family anywhere in the spec whose Shell assertions ever call hold() (grepped: `^\s*hold `
// fires at exactly two lines, both inside assert_S13_TRAILERS/assert_S13_UNSIGNEDCLAIM) -- no TS
// evaluator exists for it (out of this sprint's scope; migrating §13 is not a task here). So the HOLD
// case below is fed hand-built outcomes rather than a real TS evaluator's output, but the level each
// side reaches is compared against Shell SPAWNED LIVE on the SAME real repository state, restricted
// via `--spec` to a REAL, byte-for-byte-extracted slice of spec/STANDARD.md (never a fabricated
// table) so the comparison is apples-to-apples: TS classifies exactly the rules Shell is restricted
// to that run. The FAIL/PASS cases below use the real, shipped TS evaluators end to end (spec-reader
// -> registry -> classify -> a real FsGitBoundaryPort against a real git repo) -- no hand
// construction at all.
// ====================================================================================================

const ENGINE_PATH = fileURLToPath(new URL("../../../scripts/lib/conformance-engine.sh", import.meta.url));
const SPEC_PATH = fileURLToPath(new URL("../../../spec/STANDARD.md", import.meta.url));
const ORACLE_TIMEOUT_MS = 20_000;

function freshGitRepo(prefix: string): string {
  const repo = mkdtempSync(join(tmpdir(), prefix));
  execFileSync("git", ["-C", repo, "init", "-q"]);
  execFileSync("git", ["-C", repo, "config", "user.email", "test@test.local"]);
  execFileSync("git", ["-C", repo, "config", "user.name", "test"]);
  return repo;
}

function commit(repo: string, message: string): void {
  execFileSync("git", ["-C", repo, "add", "-A"]);
  execFileSync("git", ["-C", repo, "commit", "-q", "-m", message]);
}

/** Runs the real Shell oracle, fresh, against `repoDir` restricted to `specPath`'s rule set. Never a
 *  copied-in literal -- the same pattern sprint-log-outside-logs-dir.test.ts's `runShellEngine` uses. */
function runShellEngine(repoDir: string, specPath: string): { readonly code: number; readonly stdout: string } {
  try {
    const stdout = execFileSync("sh", [ENGINE_PATH, repoDir, "--spec", specPath], { encoding: "utf8", timeout: 15_000 });
    return { code: 0, stdout };
  } catch (e) {
    const err = e as { status?: number; stdout?: string };
    return { code: err.status ?? 1, stdout: err.stdout ?? "" };
  }
}

/** Shell's own closing `level:` line -- the exact string this file's arithmetic is proven against.
 *  Anchored to the line STARTING (after `note()`'s own leading whitespace) with `level:`, never a
 *  bare substring match: every per-rule line also mentions "(level: Structural)" etc. mid-sentence
 *  (classify's own excluded-mark wording), which `.includes("level:")` would catch first and read as
 *  the summary -- L-108's exact shape, found live by this test itself before this anchor was added. */
function shellLevelLine(stdout: string): string {
  const line = stdout.split("\n").find((l) => l.trimStart().startsWith("level:"));
  if (line === undefined) throw new Error(`no 'level:' line in Shell's output:\n${stdout}`);
  return line;
}

/** A REAL, byte-for-byte slice of spec/STANDARD.md between two `## §N` headings -- never a fabricated
 *  table. Used ONLY to restrict Shell's own rule universe via `--spec`; the TS side reads the real,
 *  unmodified spec/STANDARD.md directly (spec-reader.ts's `readSection`). */
function extractRealSection(fullSpecText: string, startHeading: string, endHeading: string): string {
  const start = fullSpecText.indexOf(startHeading);
  if (start === -1) throw new Error(`extractRealSection: ${JSON.stringify(startHeading)} not found in spec/STANDARD.md -- has it moved?`);
  const rest = fullSpecText.slice(start);
  const end = rest.indexOf(endHeading);
  if (end === -1) throw new Error(`extractRealSection: ${JSON.stringify(endHeading)} not found after ${JSON.stringify(startHeading)} -- has it moved?`);
  return rest.slice(0, end);
}

function writeReducedSpec(dir: string, name: string, text: string): string {
  const p = join(dir, name);
  writeFileSync(p, text);
  return p;
}

const REAL_SPEC_TEXT = readFileSync(SPEC_PATH, "utf8");

describe("DoD 1 — full-run level matches Shell's, differential per repo (§12: real TS evaluators end to end)", () => {
  const specDir = mkdtempSync(join(tmpdir(), "level-spec-"));
  const s12SpecPath = writeReducedSpec(specDir, "s12-only.md", extractRealSection(REAL_SPEC_TEXT, "## §12", "## §13"));

  function tsLevelForS12(repo: string): { readonly level: string; readonly exitCode: number } {
    const doc = tokenize(REAL_SPEC_TEXT, SPEC_PATH);
    const specResult = readSection(doc, 12, SPEC_PATH);
    if (!specResult.ok) throw new Error(`readSection(12) failed: ${specResult.message}`);
    const rules = specResult.rows.map((row) => toStandardRule(row, 12, SPEC_PATH));

    const dispatch = composeFamilies([bindRegistry(createF12Registry(), new FsGitBoundaryPort(repo, SPEC_PATH))]);
    const traversal = classifyAll(rules, dispatch);
    const full = attachLevel(rules, traversal);
    const exitCode = full.outcomes.some((o) => o.kind === "evaluated" && o.evaluation.verdict === "fail") ? 1 : 0;
    return { level: full.level, exitCode };
  }

  test("a clean repo (nothing §12 forbids): both sides reach Attested", () => {
    const repo = freshGitRepo("level-s12-clean-");
    writeFileSync(join(repo, "README.md"), "# clean\n");
    commit(repo, "init");

    const shell = runShellEngine(repo, s12SpecPath);
    const shellLine = shellLevelLine(shell.stdout);
    expect(shellLine).toContain("level: Attested");
    expect(shell.code).toBe(0);

    const ts = tsLevelForS12(repo);
    expect(ts.level).toBe("Attested");
    expect(ts.exitCode).toBe(0);
  }, ORACLE_TIMEOUT_MS);

  test("a committed real-looking secret: both sides drop to level none, and both exit non-zero (DoD 2's FAIL fixture)", () => {
    const repo = freshGitRepo("level-s12-fail-");
    writeFileSync(join(repo, "README.md"), "# has a secret\n");
    writeFileSync(join(repo, ".env"), "STRIPE_SECRET_KEY=sk_live_51H8x9K2eZvKYlo2C\n");
    commit(repo, "init with secret");

    const shell = runShellEngine(repo, s12SpecPath);
    const shellLine = shellLevelLine(shell.stdout);
    expect(shellLine).toContain("level: none");
    expect(shell.code).toBe(1);

    const ts = tsLevelForS12(repo);
    expect(ts.level).toBe("none");
    expect(ts.exitCode).toBe(1);
  }, ORACLE_TIMEOUT_MS);
});

describe("DoD 1 + DoD 2 — a live HOLD case: §13 restricted, real repo, real Shell hold() (DoD 2's HOLD fixture)", () => {
  const specDir = mkdtempSync(join(tmpdir(), "level-spec-13-"));
  const s13SpecPath = writeReducedSpec(specDir, "s13-only.md", extractRealSection(REAL_SPEC_TEXT, "## §13", "## §14"));

  test("a plain repo with one commit and NO attestation trailers: Shell HOLDS S13.TRAILERS live, never fails", () => {
    const repo = freshGitRepo("level-s13-hold-");
    writeFileSync(join(repo, "README.md"), "# no attestation here\n");
    commit(repo, "plain commit, no trailers");

    const shell = runShellEngine(repo, s13SpecPath);
    // Confirms the HOLD branch specifically fired (assert_S13_TRAILERS's own wording), not a
    // coincidentally-similar FAIL-driven line -- see the module-level note on why both branches can
    // print "level: Gated -- N finding(s) at Attested prevent Attested".
    expect(shell.stdout).toContain("attestation-absent");
    const shellLine = shellLevelLine(shell.stdout);
    expect(shellLine).toContain("level: Gated");
    expect(shellLine).toContain("None is a failure"); // the hold-path's own closing clause, not the fail-path's
    expect(shell.code).toBe(0); // hold NEVER moves the exit code (§14) -- proves this wasn't a FAIL

    // TS side: the REAL §13 rule rows, read from the real spec/STANDARD.md by the real domain reader
    // (spec-reader.ts) -- only the DISPATCH is hand-built (no TS evaluator exists for §13 -- see the
    // section header above), matching EXACTLY what assert_S13_TRAILERS/OWNCOMMIT/EVIDENCESHA/AGREE/
    // UNSIGNEDCLAIM do for this specific, simple repo shape (one commit, zero attestation trailers):
    // TRAILERS holds (attestation-absent), the other four "not evaluated: no attestation claimed" —
    // i.e. `note`, carrying no arithmetic weight, exactly as `note()`'s own bucket (n_reported) does.
    const doc = tokenize(REAL_SPEC_TEXT, SPEC_PATH);
    const specResult = readSection(doc, 13, SPEC_PATH);
    if (!specResult.ok) throw new Error(`readSection(13) failed: ${specResult.message}`);
    const dispatchable = specResult.rows.filter((r) => r.mark === "mechanical" || r.mark === "split");
    expect(dispatchable.map((r) => r.id)).toEqual(["S13.TRAILERS", "S13.OWNCOMMIT", "S13.EVIDENCESHA", "S13.AGREE", "S13.UNSIGNEDCLAIM"]);
    const rules = specResult.rows.map((row) => toStandardRule(row, 13, SPEC_PATH));

    const outcomes: RuleOutcome[] = specResult.rows.map((row) => {
      if (row.mark !== "mechanical" && row.mark !== "split") return excluded(row.id);
      if (row.id === "S13.TRAILERS") return evaluated(row.id, "hold");
      return evaluated(row.id, "note"); // OWNCOMMIT/EVIDENCESHA/AGREE/UNSIGNEDCLAIM: not evaluated
    });

    const level = computeLevel(rules, outcomes);
    expect(level).toBe("Gated"); // matches Shell's live "level: Gated" above, exactly
  }, ORACLE_TIMEOUT_MS);
});
