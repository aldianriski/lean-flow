// evals/doc-caps.test.ts -- retained fixtures for scripts/lib/check-doc-caps.ts (TASK-355), ported
// from evals/run-doc-caps-fixtures.sh's shell-oracle cases to a single in-process Bun test file.
//
// WHY THIS SHAPE: the shell harness ran `sh scripts/lib/check-doc-caps.sh ...` once per case --
// each spawn costing ~2.75s under Windows fork() emulation for a checker that is milliseconds of
// text matching. This file calls `runCheckDocCaps()` directly, in-process, the same shape
// evals/dod-delta.test.ts already uses for check-dod-delta.ts. scripts/lib/check-doc-caps.sh is
// UNCHANGED and remains the live oracle -- differential parity against it lives in
// evals/run-doc-caps-differential.ts (opt-in, spawns the real shell checker), never here.
//
// Every case below is the SAME case evals/run-doc-caps-fixtures.sh asserted, same fixture files,
// same named findings -- retained, not reinvented (TD-012).
import { describe, expect, test } from "bun:test";
import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import {
  type HeadlessUsage,
  parseHeadlessUsage,
  parseTokenBudget,
  resolveArgs,
  runCheckDocCaps,
  runHeadlessCalibration,
} from "../scripts/lib/check-doc-caps.ts";

const FX = fileURLToPath(new URL("fixtures/doc-caps/", import.meta.url));
const REPO_ROOT = fileURLToPath(new URL("..", import.meta.url));

function run(fixture: string, gfFile: string) {
  return runCheckDocCaps(`${FX}${fixture}/DOCS_Guide.md`, `${FX}${fixture}`, `${FX}${fixture}/${gfFile}`);
}

/** Same fixture shape as `run()`, but wires the 4th (token-budget) argument -- OFF by default
 *  in `run()` so every pre-existing line-cap fixture above is unaffected by TASK-364. */
function runTB(fixture: string, tokenBudgetFile: string) {
  const none = `${FX}${fixture}/none.txt`; // no §2 grandfather list needed for any token-budget fixture
  return runCheckDocCaps(`${FX}${fixture}/DOCS_Guide.md`, `${FX}${fixture}`, none, `${FX}${fixture}/${tokenBudgetFile}`);
}

describe("check-doc-caps.ts -- retained fixtures", () => {
  test("case 1 (must-FAIL): a doc over its stated §2 cap", () => {
    const r = run("over-cap", "none.txt");
    expect(r.exitCode).toBe(1);
    expect(r.lines.join("\n")).toContain("FAIL  cap tiny.md (5 > 3)");
  });

  test("case 2 (must-FAIL): a §2 row that states a cap but yields no path -- never a silent skip", () => {
    // Without this leg the checker could quietly drop any row whose File cell it cannot parse,
    // reading green while covering less than it claims (L-058).
    const r = run("unparseable-row", "none.txt");
    expect(r.exitCode).toBe(1);
    expect(r.lines.join("\n")).toContain("no path could be derived");
  });

  test("case 3 (must-FAIL): a grandfathered file that GREW past its recorded count", () => {
    const r = run("grandfather-grew", "gf.txt");
    expect(r.exitCode).toBe(1);
    expect(r.lines.join("\n")).toContain("it GREW");
  });

  test("case 4 (must-NOT-catch sibling, L-076): the same file held at its recorded count", () => {
    const r = run("grandfather-grew", "gf-held.txt");
    expect(r.exitCode).toBe(0);
    expect(r.lines.join("\n")).toContain("OVER-CAP (grandfathered): drifting.md");
  });

  test("case 5a: a SOFT cap over its limit reports, does not FAIL", () => {
    const r = run("soft-cap", "none.txt");
    expect(r.exitCode).toBe(0);
    expect(r.lines.join("\n")).toContain("OVER-CAP (soft): soft.md (5 > 3)");
  });

  test("case 5b (sibling control): a HARD cap beside it still fails", () => {
    const r = run("soft-cap-hard-breach", "none.txt");
    expect(r.exitCode).toBe(1);
    expect(r.lines.join("\n")).toContain("FAIL  cap hard.md (4 > 3)");
  });

  test("case 6a (must-FAIL, ADR-015 rule 2): a soft-capped path must not be grandfathered", () => {
    const r = run("soft-cap-grandfathered", "gf-soft.txt");
    expect(r.exitCode).toBe(1);
    expect(r.lines.join("\n")).toContain("must not be in the grandfather list [ADR-015 rule 2]");
  });

  test("case 6b (must-NOT-catch sibling, L-076): a hard-capped path may be grandfathered", () => {
    const r = run("soft-cap-grandfathered", "gf-hard.txt");
    expect(r.exitCode).toBe(0);
    expect(r.lines.join("\n")).toContain("OVER-CAP (grandfathered): hard.md");
  });

  test("case 7a (ADR-020): a spent verdict (status: superseded) is FROZEN, not FAILed", () => {
    const r = run("frozen-spent", "none.txt");
    expect(r.exitCode).toBe(1); // live.md in the same fixture still FAILs (case 7b)
    expect(r.lines.join("\n")).toContain("FROZEN (superseded): spent.md");
  });

  test("case 7b (L-076, live-fixture-in-one, not a separate fixture): the exemption does not disarm the check for a live doc in the same file", () => {
    const r = run("frozen-spent", "none.txt");
    expect(r.exitCode).toBe(1);
    expect(r.lines.join("\n")).toContain("FAIL  cap live.md (5 > 3)");
  });

  test("case 8: the live repo's own §2 must still derive real rows (zero coverage over zero rows is a false PASS)", () => {
    const r = runCheckDocCaps(
      `${REPO_ROOT}spec/STANDARD.md`,
      REPO_ROOT,
      `${REPO_ROOT}scripts/lib/doc-caps-grandfathered.txt`,
    );
    expect(r.lines.join("\n")).toContain("PASS  cap .claude/CLAUDE.md");
  });

  // --- case 9: stress names -- outside-review revise (TASK-355 round 2) --------------------------
  // The glob file SET and ORDER must come from a real `ls -d`, never a reimplemented collation
  // formula: an earlier version hand-derived glibc's en_US.UTF-8 collation from a 44-file census and
  // an outside reviewer found 12+/33 real divergences on a stress name set (case-fold tie-breaking,
  // `_`/`.` not just `-` being primary-ignorable), PLUS a from-scratch glob regex with no dotglob
  // emulation that could MATCH a file the real shell never returns -- a file-SET divergence, not
  // only an ordering one. This fixture is that stress set, retained so the class cannot recur
  // silently: mixed-case names, `_`-led and `.`-internal names, digit-leading names, accented latin,
  // CJK, a dot-prefixed file (must NOT be matched -- no dotglob), and a space-containing filename
  // (which both the oracle and this port word-split into non-existent fragments and silently drop --
  // a faithfully-reproduced shared bug, not a divergence).
  test("case 9: stress names -- real ls glob SET+ORDER, dotglob correctness, non-ASCII", () => {
    const r = run("stress-names", "none.txt");
    expect(r.exitCode).toBe(0);
    const text = r.lines.join("\n");
    // dot-prefixed file never matched (no dotglob) -- checked on the WHOLE output, not just this
    // fixture's other files, since a false match would still show up as a line here.
    expect(text).not.toContain(".abc.md");
    // mixed case, punctuation-position, digit-leading, and non-ASCII names are all present.
    for (const name of ["_abc.md", "10-file.md", "2-file.md", "a.b.md", "a_b.md", "AAAA.md", "ab.md", "Banana.md", "café.md", "naïve.md", "中文.md", "日本語.md"]) {
      expect(text).toContain(`cap ${name} (`);
    }
    // a filename containing a space is word-split by the ORACLE's own `for f in $(...)` loop into
    // non-existent fragments and silently dropped -- ts must reproduce that, not "fix" it.
    expect(text).not.toContain("a b.md");
  });

  // --- empty-string CLI argument handling (outside-review finding) --------------------------------
  // `${1:-default}` treats an empty string as unset; a `??`-based port does not, since `??` only
  // triggers on null/undefined. Repro: `sh check-doc-caps.sh "" . gf.txt` resolves the default guide
  // path; the broken `??` port printed an empty path instead.
  test("empty-string CLI arguments fall back to defaults, same as shell's ${1:-default}", () => {
    const resolved = resolveArgs(["", "", ""], "/some/script/dir");
    expect(resolved.guide).not.toBe("");
    expect(resolved.root).not.toBe("");
    expect(resolved.gfFile).not.toBe("");
    expect(resolved.guide).toContain("STANDARD.md");
  });

  test("a real (non-empty) CLI argument is used as-is, not overridden by the default", () => {
    const resolved = resolveArgs(["/g.md", "/r", "/gf.txt", "/tb.txt"], "/some/script/dir");
    expect(resolved).toEqual({ guide: "/g.md", root: "/r", gfFile: "/gf.txt", tokenBudgetFile: "/tb.txt" });
  });

  // --- token budget over the always-loaded read set (TASK-364, ADR-048) -------------------------
  // Population: ALWAYS_LOADED = [.claude/CLAUDE.md, .claude/CONTEXT.md] (imported from
  // check-prose-density.ts, never redefined). Every fixture below fixes ratio=1 byte/token so the
  // arithmetic is exact and legible; the ratio itself is never hardcoded in the checker (it is read
  // from token-budget.txt), so a fixture-chosen ratio exercises the real code path, not a shortcut.

  test("token-budget case A (must-FAIL): token-budget.txt absent is a named token-budget-missing FAIL", () => {
    const r = runTB("token-budget-missing", "token-budget.txt"); // deliberately does not exist on disk
    expect(r.exitCode).toBe(1);
    expect(r.lines.join("\n")).toContain("FAIL  doc-caps: token-budget-missing:");
  });

  test("token-budget case A sibling control: the same shape with a real file present does not FAIL missing", () => {
    const r = runTB("token-budget-under", "token-budget.txt");
    expect(r.lines.join("\n")).not.toContain("token-budget-missing");
  });

  test("token-budget case B (must-FAIL): a malformed token-budget.txt is a named token-budget-malformed FAIL", () => {
    const r = runTB("token-budget-malformed", "token-budget.txt");
    expect(r.exitCode).toBe(1);
    expect(r.lines.join("\n")).toContain("token-budget-malformed: budget-tokens is not a positive number");
  });

  test("token-budget case B sibling control: a well-formed file beside it does not report malformed", () => {
    const r = runTB("token-budget-under", "token-budget.txt");
    expect(r.lines.join("\n")).not.toContain("token-budget-malformed");
  });

  test("token-budget case C: the PENDING sentinel is reported, never as PASS and never as FAIL", () => {
    const r = runTB("token-budget-pending", "token-budget.txt");
    expect(r.exitCode).toBe(0);
    const text = r.lines.join("\n");
    expect(text).toContain("PENDING doc-caps: token-budget not yet calibrated");
    expect(text).not.toContain("PASS  doc-caps: token-budget");
    expect(text).not.toContain("FAIL  doc-caps: token-budget");
  });

  test("token-budget case C sibling control (proves PENDING does not blanket-suppress a real breach): over-budget still FAILs", () => {
    const r = runTB("token-budget-over", "token-budget.txt");
    expect(r.exitCode).toBe(1);
  });

  test("token-budget case D (must-FAIL): the read set over its adopted budget FAILs, named token-budget-exceeded", () => {
    const r = runTB("token-budget-over", "token-budget.txt");
    expect(r.exitCode).toBe(1);
    expect(r.lines.join("\n")).toContain("FAIL  doc-caps: token-budget-exceeded: always-loaded read set ~100 tokens > budget 50");
  });

  test("token-budget case D sibling control: the same shape comfortably under budget PASSes, tokenizer + ratio named", () => {
    const r = runTB("token-budget-under", "token-budget.txt");
    expect(r.exitCode).toBe(0);
    expect(r.lines.join("\n")).toContain("PASS  doc-caps: token-budget ~100 tokens <= budget 200 (ratio 1 bytes/token, claude-opus-5-5 tokenizer");
  });

  // --- selection-varying (L-186): the population, not just the verdict arithmetic ------------------
  test("token-budget selection A: one always-loaded file absent is named, not silently absorbed as 0", () => {
    const r = runTB("token-budget-selection-missing-file", "token-budget.txt");
    const text = r.lines.join("\n");
    expect(r.exitCode).toBe(1); // 40 bytes (CLAUDE.md only) > budget 30
    expect(text).toContain("MISSING from the always-loaded read set: .claude/CONTEXT.md");
    expect(text).toContain("~40 tokens > budget 30");
  });

  test("token-budget selection B: the SECOND file's bytes are not dropped from the sum (would silently PASS if they were)", () => {
    const r = runTB("token-budget-selection-second-file-dominates", "token-budget.txt");
    // Correct sum: 5 (CLAUDE.md) + 500 (CONTEXT.md) = 505 > budget 50 -> FAIL.
    // A checker that summed only ALWAYS_LOADED[0] would see 5 <= 50 and wrongly PASS.
    expect(r.exitCode).toBe(1);
    expect(r.lines.join("\n")).toContain("~505 tokens > budget 50");
  });

  // --- B1 (outside review round 1): the estimate is a property of CONTENT, not of the checkout's
  // line-ending convention. token-budget-crlf/ and token-budget-lf/ hold the SAME logical text (5
  // lines then 3 lines) -- one stored CRLF (raw bytes 15+9=24), one stored LF (raw bytes 10+6=16).
  // Both normalise to 16 bytes, so both must report the identical ~16-token estimate against the
  // same budget=16. Under the pre-fix `statSync(...).size` implementation this reddens: the CRLF
  // fixture's raw 24 bytes > budget 16 FAILs while the LF sibling's raw 16 <= 16 PASSes -- a
  // checkout-dependent divergence over identical content.
  //
  // The two `.claude/*.md` files are written HERE, at test time, rather than committed as raw CRLF
  // bytes: this repo runs `core.autocrlf=true` with no per-path `.gitattributes` override for `.md`,
  // so committing literal `\r\n` bytes would let git's own clean/smudge filters silently normalise
  // them on the very next checkout -- destroying the CRLF/LF distinction this test exists to prove,
  // on the same class of checkout-dependent surprise B1 itself is about. Writing them at run time
  // guarantees the exact bytes on every host, unconditionally.
  test("token-budget B1 (regression guard): CRLF and LF checkouts of the SAME content yield the SAME estimate", () => {
    const crlfDir = `${FX}token-budget-crlf/.claude`;
    const lfDir = `${FX}token-budget-lf/.claude`;
    mkdirSync(crlfDir, { recursive: true });
    mkdirSync(lfDir, { recursive: true });
    writeFileSync(`${crlfDir}/CLAUDE.md`, "A\r\nB\r\nC\r\nD\r\nE\r\n");
    writeFileSync(`${crlfDir}/CONTEXT.md`, "F\r\nG\r\nH\r\n");
    writeFileSync(`${lfDir}/CLAUDE.md`, "A\nB\nC\nD\nE\n");
    writeFileSync(`${lfDir}/CONTEXT.md`, "F\nG\nH\n");

    const crlf = runTB("token-budget-crlf", "token-budget.txt");
    const lf = runTB("token-budget-lf", "token-budget.txt");
    expect(crlf.exitCode).toBe(0);
    expect(lf.exitCode).toBe(0);
    expect(crlf.lines.join("\n")).toContain("PASS  doc-caps: token-budget ~16 tokens <= budget 16");
    expect(lf.lines.join("\n")).toContain("PASS  doc-caps: token-budget ~16 tokens <= budget 16");
  });

  // --- parseTokenBudget unit coverage (fast, no filesystem) ----------------------------------------
  test("parseTokenBudget: a partial PENDING sentinel is malformed, not treated as pending or as real values", () => {
    const r = parseTokenBudget("50 PENDING 2026-09-28 reason");
    expect(r.kind).toBe("malformed");
  });

  test("parseTokenBudget: more than one data row is malformed (never silently takes the first/last)", () => {
    const r = parseTokenBudget("50 1 2026-09-28 a\n60 1 2026-09-28 b\n");
    expect(r.kind).toBe("malformed");
  });

  test("parseTokenBudget: comments and blank lines around a single valid row are ignored", () => {
    const r = parseTokenBudget("# comment\n\n50 1 2026-09-28 a real reason\n\n");
    expect(r).toEqual({ kind: "set", budgetTokens: 50, ratio: 1, adoptedAt: "2026-09-28", reason: "a real reason" });
  });

  // --- headless calibration (TASK-364 phase 2, outside review round 2): error handling, no real CLI --
  // An injectable `HeadlessRunner` stands in for a real `claude -p` spawn, so every case below runs
  // with zero process spawns and zero API/subscription cost. `token-budget-under`'s `.claude/` pair
  // (CLAUDE.md 40 bytes, CONTEXT.md 60 bytes, both plain ASCII) is reused as the always-loaded root --
  // known byte counts make the arithmetic in the sibling control checkable by hand.
  const TB_FX = `${FX}token-budget-under`;
  function usage(totalInput: number): HeadlessUsage {
    return { input_tokens: totalInput, cache_creation_input_tokens: 0, cache_read_input_tokens: 0 };
  }

  test("headless calibration (must-FAIL): baseline instability is named and never adopted", async () => {
    let call = 0;
    const runner = async (_p: string) => {
      call++;
      // Two identical baseline prompts measuring DIFFERENT totals -- exactly the drift this check
      // exists to catch before it corrupts every file delta computed against the baseline.
      return usage(call === 1 ? 100 : 105);
    };
    const result = await runHeadlessCalibration(TB_FX, runner);
    expect(result.exitCode).toBe(2);
    expect(result.lines.join("\n")).toContain("baseline-unstable");
  });

  test("headless calibration (must-FAIL): a missing usage field surfaces through the SAME parser a real spawn's stdout would hit", async () => {
    let call = 0;
    const runner = async (_p: string): Promise<HeadlessUsage> => {
      call++;
      if (call <= 2) return usage(100); // stable baseline
      // The delimiter-cost call "returns" canned JSON missing cache_read_input_tokens, parsed
      // through parseHeadlessUsage() itself -- the identical code path runClaudeHeadlessReal() would
      // hit on a real spawn's malformed stdout, just without spawning a process to get there.
      return parseHeadlessUsage(JSON.stringify({ usage: { input_tokens: 5, cache_creation_input_tokens: 10 } }));
    };
    const result = await runHeadlessCalibration(TB_FX, runner);
    expect(result.exitCode).toBe(2);
    expect(result.lines.join("\n")).toContain("usable usage fields");
  });

  test("headless calibration sibling control: a stable baseline + complete usage everywhere succeeds", async () => {
    let call = 0;
    const runner = async (_p: string) => {
      call++;
      if (call <= 2) return usage(100); // baseline x2, stable
      if (call === 3) return usage(105); // delimiter cost = 5
      if (call === 4) return usage(100 + 5 + 40); // .claude/CLAUDE.md: 40 tokens
      return usage(100 + 5 + 60); // .claude/CONTEXT.md: 60 tokens
    };
    const result = await runHeadlessCalibration(TB_FX, runner);
    const text = result.lines.join("\n");
    expect(result.exitCode).toBe(0);
    expect(text).not.toContain("FAIL");
    expect(text).toContain("baseline stable at 100 total input tokens");
    expect(text).toContain("pooled ratio 1.000 bytes/token over 100 bytes / 100 tokens");
  });

  test("parseHeadlessUsage (must-FAIL): a missing usage field throws a named error", () => {
    expect(() =>
      parseHeadlessUsage(JSON.stringify({ usage: { input_tokens: 5, cache_creation_input_tokens: 10 } })),
    ).toThrow(/usable usage fields/);
  });

  test("parseHeadlessUsage (must-FAIL): invalid JSON throws a named error", () => {
    expect(() => parseHeadlessUsage("not valid json")).toThrow(/not valid JSON/);
  });

  test("parseHeadlessUsage sibling control: a complete usage object parses cleanly", () => {
    const u = parseHeadlessUsage(JSON.stringify({ usage: { input_tokens: 5, cache_creation_input_tokens: 10, cache_read_input_tokens: 20 } }));
    expect(u).toEqual({ input_tokens: 5, cache_creation_input_tokens: 10, cache_read_input_tokens: 20 });
  });
});
