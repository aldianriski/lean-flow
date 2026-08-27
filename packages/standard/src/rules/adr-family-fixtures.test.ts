// Per-rule parity against the LIVE Shell oracle, on the RETAINED §4 fixtures (SPRINT-091 T6 DoD 2/3).
//
// `packages/standard/src/adapters/` is OUT of this task's Layers (T7's, alongside the git adapter
// S4.APPEND needs), so there is no production filesystem adapter for `AdrFamilyPort` yet. This file is
// the seam instead: a small fixture-to-scenario loader, kept in THIS `*.test.ts` file only (the
// test-file exemption `test/architecture/layers.ts` carves out -- mirrors `s12-secrets.test.ts`'s own
// `execFileSync`/`writeFileSync` staying test-file-local rather than becoming a second adapter).
//
// The fixtures themselves are `evals/fixtures/adr-family/*` -- RETAINED from SPRINT-076 T2 (TD-012:
// deleting them with a prototype leaves the gate unguarded), already proven live against the Shell
// oracle by `evals/run-adr-family-fixtures.sh`. This file does not re-author them; it reads the SAME
// real directories a second time, through the TS evaluators, and diffs the two sides per rule.

import { describe, expect, test } from "bun:test";
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import type { RuleEvaluation } from "../result.ts";
import { ADR_CANONICAL_NAME_RE } from "./adr-family.ts";
import type { AdrFamilyPort } from "./adr-family-port.ts";
import { InMemoryAdrFamilyPort, type InMemoryAdrFamilyScenario } from "./adr-family-port.fake.ts";
import { evaluate as evaluateOnefile } from "./s4-onefile.ts";
import { evaluate as evaluateIndex } from "./s4-index.ts";
import { evaluate as evaluateSections } from "./s4-sections.ts";
import { evaluate as evaluateNegative } from "./s4-negative.ts";

const FIXTURES_ROOT = fileURLToPath(new URL("../../../../evals/fixtures/adr-family", import.meta.url));
const ENGINE_PATH = fileURLToPath(new URL("../../../../scripts/lib/conformance-engine.sh", import.meta.url));
const SPEC_PATH = fileURLToPath(new URL("../../../../spec/STANDARD.md", import.meta.url));
const ORACLE_TIMEOUT_MS = 20_000;

// --- the fixture-to-scenario bridge ------------------------------------------------------------------

function walkForStrays(dir: string, repoRoot: string, adrDir: string, acc: Record<string, string>): void {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (full === adrDir) continue; // docs/adr/ itself is not a stray location
    const st = statSync(full);
    if (st.isDirectory()) {
      walkForStrays(full, repoRoot, adrDir, acc);
    } else if (st.isFile() && ADR_CANONICAL_NAME_RE.test(name)) {
      acc[relative(repoRoot, full).split(sep).join("/")] = readFileSync(full, "utf8");
    }
  }
}

/** Reads a REAL fixture directory off disk into the same scenario shape the in-memory port takes --
 *  the pre-classification `adr-family-port.fake.ts`'s own header describes, derived here from an
 *  actual tree instead of hand-authored. */
function loadFixtureScenario(fixtureDir: string): InMemoryAdrFamilyScenario {
  const adrDir = join(fixtureDir, "docs", "adr");
  const hasAdrDir = existsSync(adrDir) && statSync(adrDir).isDirectory();

  const adrDirFiles: Record<string, string> = {};
  if (hasAdrDir) {
    for (const name of readdirSync(adrDir)) {
      const full = join(adrDir, name);
      if (statSync(full).isFile() && name.endsWith(".md")) adrDirFiles[name] = readFileSync(full, "utf8");
    }
  }

  const strayDocsFiles: Record<string, string> = {};
  const docsDir = join(fixtureDir, "docs");
  if (existsSync(docsDir)) walkForStrays(docsDir, fixtureDir, adrDir, strayDocsFiles);

  const strayRootFiles: Record<string, string> = {};
  for (const name of readdirSync(fixtureDir)) {
    const full = join(fixtureDir, name);
    if (statSync(full).isFile() && ADR_CANONICAL_NAME_RE.test(name)) strayRootFiles[name] = readFileSync(full, "utf8");
  }

  let indexFile: { readonly path: string; readonly text: string } | undefined;
  for (const cand of ["docs/DECISIONS.md", "DECISIONS.md"]) {
    const full = join(fixtureDir, cand);
    if (existsSync(full) && statSync(full).isFile()) {
      indexFile = { path: cand, text: readFileSync(full, "utf8") };
      break;
    }
  }

  return {
    hasAdrDir,
    adrDirFiles,
    strayDocsFiles,
    strayRootFiles,
    ...(indexFile !== undefined ? { indexFile } : {}),
  };
}

// --- the live Shell oracle, spawned against the SAME real fixture directory --------------------------
//
// A REDUCED spec (§4's own 7 rows plus every non-`S<N>` prose line), built the same way
// `evals/run-adr-family-fixtures.sh` does -- from the SHIPPED spec by a mechanical filter, never
// hand-authored -- so the full engine does not answer `rule-unimplemented` for ~50 OTHER rules this
// family does not own and turn every fixture's exit code into noise this comparison does not care
// about.

function buildAdrOnlySpec(fullSpecText: string): string {
  const kept: string[] = [];
  for (const line of fullSpecText.split("\n")) {
    if (/^\| `S4\./.test(line)) {
      kept.push(line);
      continue;
    }
    if (!/^\| `S[0-9]/.test(line)) kept.push(line);
  }
  return kept.join("\n");
}

const ADR_ONLY_SPEC_PATH = (() => {
  const dir = mkdtempSync(join(tmpdir(), "adr-family-parity-spec-"));
  const specText = readFileSync(SPEC_PATH, "utf8");
  const reduced = buildAdrOnlySpec(specText);
  const nKept = (reduced.match(/^\| `S4\./gm) ?? []).length;
  if (nKept !== 7) {
    throw new Error(`adr-family-fixtures.test: reduced spec carries ${nKept} S4 rows, expected exactly 7`);
  }
  const p = join(dir, "spec-adr-only.md");
  writeFileSync(p, reduced);
  return p;
})();

function runShellEngine(repoDir: string): string {
  try {
    return execFileSync("sh", [ENGINE_PATH, repoDir, "--spec", ADR_ONLY_SPEC_PATH], { encoding: "utf8", timeout: 15_000 });
  } catch (e) {
    const err = e as { stdout?: string };
    return err.stdout ?? "";
  }
}

/** `pass` if a `PASS  <RULE>` line exists, `fail` if a `FAIL  ...(RULE)` line exists, `note` otherwise
 *  (a rule that only NOTEs prints its own id with no PASS/FAIL prefix). */
function shellVerdictFor(stdout: string, ruleId: string): "pass" | "fail" | "note" {
  const lines = stdout.split("\n");
  if (lines.some((l) => l.startsWith("FAIL") && l.includes(`(${ruleId})`))) return "fail";
  if (lines.some((l) => l.startsWith("PASS") && l.includes(ruleId))) return "pass";
  return "note";
}

function shellFindingLines(stdout: string, ruleId: string): string[] {
  return stdout.split("\n").filter((l) => l.startsWith("FAIL") && l.includes(`(${ruleId})`));
}

// --- row-by-row parity, one row per (fixture, rule) the retained set actually exercises --------------

interface Row {
  readonly fixture: string;
  readonly ruleId: string;
  readonly evaluate: (port: AdrFamilyPort) => RuleEvaluation;
  /** Substring the FAIL case's Shell line AND the TS finding's own detail must both contain -- proves
   *  the two sides agree on WHICH offence, not merely on pass/fail. `null` for a PASS/NOTE row. */
  readonly mustContain: string | null;
}

const ROWS: readonly Row[] = [
  { fixture: "path-noncanonical", ruleId: "S4.ONEFILE", evaluate: evaluateOnefile, mustContain: "docs/adr/adr-1-loose-name.md" },
  { fixture: "duplicate-number", ruleId: "S4.ONEFILE", evaluate: evaluateOnefile, mustContain: "ADR-001-the-same-number-again.md" },
  { fixture: "adr-outside-dir", ruleId: "S4.ONEFILE", evaluate: evaluateOnefile, mustContain: "docs/ADR-002-in-the-wrong-place.md" },
  { fixture: "index-absent", ruleId: "S4.INDEX", evaluate: evaluateIndex, mustContain: "no decision index found" },
  { fixture: "index-missing-row", ruleId: "S4.INDEX", evaluate: evaluateIndex, mustContain: "ADR-001-a-real-decision.md" },
  { fixture: "sections-missing", ruleId: "S4.SECTIONS", evaluate: evaluateSections, mustContain: "Alternatives" },
  { fixture: "no-negative", ruleId: "S4.NEGATIVE", evaluate: evaluateNegative, mustContain: "ADR-001-a-real-decision.md" },
  // Every rule's own PASS control, on the shared clean tree.
  { fixture: "clean", ruleId: "S4.ONEFILE", evaluate: evaluateOnefile, mustContain: null },
  { fixture: "clean", ruleId: "S4.INDEX", evaluate: evaluateIndex, mustContain: null },
  { fixture: "clean", ruleId: "S4.SECTIONS", evaluate: evaluateSections, mustContain: null },
  { fixture: "clean", ruleId: "S4.NEGATIVE", evaluate: evaluateNegative, mustContain: null },
];

describe("§4 parity — TS evaluators vs the LIVE Shell oracle, on the RETAINED fixtures (DoD 2)", () => {
  for (const row of ROWS) {
    const label = row.mustContain === null ? `${row.fixture}/${row.ruleId}: PASS on both sides` : `${row.fixture}/${row.ruleId}: FAIL on both sides, same offence`;
    test(label, () => {
      const fixtureDir = join(FIXTURES_ROOT, row.fixture);
      const scenario = loadFixtureScenario(fixtureDir);
      const ts = row.evaluate(new InMemoryAdrFamilyPort(scenario));

      const shellOut = runShellEngine(fixtureDir);
      const shellVerdict = shellVerdictFor(shellOut, row.ruleId);

      // Named-finding parity, never a bare exit-code/count comparison (CLAUDE.md's own bar).
      if (row.mustContain === null) {
        expect(shellVerdict).toBe("pass");
        expect(ts.verdict).toBe("pass");
        expect(ts.findings).toEqual([]);
      } else {
        expect(shellVerdict).toBe("fail");
        expect(ts.verdict).toBe("fail");
        expect(ts.findings.length).toBeGreaterThan(0);
        const shellLines = shellFindingLines(shellOut, row.ruleId).join("\n");
        expect(shellLines).toContain(row.mustContain);
        // Every TS finding on this row shares this rule's one published finding name.
        expect(new Set(ts.findings.map((f) => f.name)).size).toBe(1);
        expect(JSON.stringify(ts.findings)).toContain(row.mustContain);
      }
    }, ORACLE_TIMEOUT_MS);
  }

  // --- L-142: each retained must-FAIL reddens with its OWN named finding while a SIBLING rule on the
  // SAME tree stays green. The four FAIL fixtures above already prove this structurally (one thing
  // wrong per fixture, exercised by all four rules on the identical directory) -- these assertions make
  // that fact explicit and load-bearing, not incidental.

  test("sibling control: index-missing-row breaks ONLY S4.INDEX -- ONEFILE/SECTIONS/NEGATIVE stay green", () => {
    const scenario = loadFixtureScenario(join(FIXTURES_ROOT, "index-missing-row"));
    const port = new InMemoryAdrFamilyPort(scenario);
    expect(evaluateIndex(port).verdict).toBe("fail");
    expect(evaluateOnefile(port).verdict).toBe("pass");
    expect(evaluateSections(port).verdict).toBe("pass");
    expect(evaluateNegative(port).verdict).toBe("pass");
  });

  test("sibling control: sections-missing breaks ONLY S4.SECTIONS -- ONEFILE/INDEX/NEGATIVE stay green", () => {
    const scenario = loadFixtureScenario(join(FIXTURES_ROOT, "sections-missing"));
    const port = new InMemoryAdrFamilyPort(scenario);
    expect(evaluateSections(port).verdict).toBe("fail");
    expect(evaluateOnefile(port).verdict).toBe("pass");
    expect(evaluateIndex(port).verdict).toBe("pass");
    expect(evaluateNegative(port).verdict).toBe("pass");
  });

  test("sibling control: no-negative breaks ONLY S4.NEGATIVE -- ONEFILE/INDEX/SECTIONS stay green", () => {
    const scenario = loadFixtureScenario(join(FIXTURES_ROOT, "no-negative"));
    const port = new InMemoryAdrFamilyPort(scenario);
    expect(evaluateNegative(port).verdict).toBe("fail");
    expect(evaluateOnefile(port).verdict).toBe("pass");
    expect(evaluateIndex(port).verdict).toBe("pass");
    expect(evaluateSections(port).verdict).toBe("pass");
  });

  // duplicate-number is the one fixture where a SECOND rule (S4.INDEX) is EXPECTED to also fire (the
  // duplicate is canonically named but unindexed) -- adr-family.ts's own header claims this; proved
  // live against the oracle here rather than only in the fake-backed s4-index.test.ts.
  test("duplicate-number: S4.ONEFILE and S4.INDEX both fire (live oracle); SECTIONS/NEGATIVE stay green", () => {
    const fixtureDir = join(FIXTURES_ROOT, "duplicate-number");
    const scenario = loadFixtureScenario(fixtureDir);
    const port = new InMemoryAdrFamilyPort(scenario);
    expect(evaluateOnefile(port).verdict).toBe("fail");
    expect(evaluateIndex(port).verdict).toBe("fail");
    expect(evaluateSections(port).verdict).toBe("pass");
    expect(evaluateNegative(port).verdict).toBe("pass");

    const shellOut = runShellEngine(fixtureDir);
    expect(shellVerdictFor(shellOut, "S4.ONEFILE")).toBe("fail");
    expect(shellVerdictFor(shellOut, "S4.INDEX")).toBe("fail");
    expect(shellVerdictFor(shellOut, "S4.SECTIONS")).toBe("pass");
    expect(shellVerdictFor(shellOut, "S4.NEGATIVE")).toBe("pass");
  }, ORACLE_TIMEOUT_MS);
});
