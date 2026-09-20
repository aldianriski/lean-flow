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
import { fileURLToPath } from "node:url";
import { resolveArgs, runCheckDocCaps } from "../scripts/lib/check-doc-caps.ts";

const FX = fileURLToPath(new URL("fixtures/doc-caps/", import.meta.url));
const REPO_ROOT = fileURLToPath(new URL("..", import.meta.url));

function run(fixture: string, gfFile: string) {
  return runCheckDocCaps(`${FX}${fixture}/DOCS_Guide.md`, `${FX}${fixture}`, `${FX}${fixture}/${gfFile}`);
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
    const resolved = resolveArgs(["/g.md", "/r", "/gf.txt"], "/some/script/dir");
    expect(resolved).toEqual({ guide: "/g.md", root: "/r", gfFile: "/gf.txt" });
  });
});
