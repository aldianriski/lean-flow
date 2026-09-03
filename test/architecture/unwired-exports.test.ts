import { describe, expect, test } from "bun:test";
import { join } from "node:path";
import {
  checkUnwired,
  checkUnwiredAtCommit,
  checkUnwiredSources,
  exportedSymbolsOf,
  importedBindingsOf,
  isTestAdjacent,
  resolveSpecifier,
} from "./unwired-exports.ts";

const FIXTURES = join(import.meta.dir, "..", "fixtures", "unwired-exports");
const REPO = join(import.meta.dir, "..", "..");

// The two commits that shipped a motivating symbol UNWIRED, immediately before the task that wired
// it -- see docs/sprint/logs/SPRINT-094-guards-for-what-nothing-reads.md's T3 promote entry (A3).
const ATTACH_LEVEL_UNWIRED_COMMIT = "e158d60"; // parent of 6f4cc36 (T11, which wires it)
const F4_S4APPEND_UNWIRED_COMMIT = "e0ccdb6"; // parent of e5d59ce (T12, which wires both)

describe("unwired-exports — one must-FAIL fixture, its own finding, plus a sibling control in the SAME run (L-058 · TD-012)", () => {
  // Retained. Deleting this with the prototype leaves the guard unguarded, and the failure is silent
  // by construction: an unwired export compiles, tests (via its OWN test file) and ships clean.
  test("MUST-FAIL: an exported symbol with only a test caller is reported, under its own finding", () => {
    const r = checkUnwired(join(FIXTURES, "mixed"));
    const forOrphan = r.findings.filter((f) => f.symbol === "orphanWidget");
    expect(forOrphan).toEqual([
      { finding: "unwired-export", symbol: "orphanWidget", file: "packages/standard/src/gadget.ts" },
    ]);
  });

  test("CONTROL: the sibling export WITH a production caller stays green, in the SAME run", () => {
    const r = checkUnwired(join(FIXTURES, "mixed"));
    expect(r.findings.some((f) => f.symbol === "usedGadget")).toBe(false);
  });

  test("the fixture's own denominator is non-vacuous", () => {
    const r = checkUnwired(join(FIXTURES, "mixed"));
    expect(r.filesExamined).toBeGreaterThan(0);
    expect(r.symbolsExamined).toBeGreaterThan(0);
  });
});

describe("unwired-exports — shape, not substring (L-108): a self-mention in a doc comment is not a caller", () => {
  // Mirrors marksInStandard's real shape in packages/standard/src/spec-reader.ts (A3): the exported
  // symbol's own name appears four times inside its defining file (three doc-comment mentions plus
  // the export), and a naive "is this identifier referenced anywhere" query would read that as having
  // a caller. This fixture is the retained proof the detector does not (TD-012).
  test("MUST-FAIL: a symbol named four times in its OWN file's comments is still reported unwired", () => {
    const r = checkUnwired(join(FIXTURES, "self-reference"));
    expect(r.findings).toEqual([
      { finding: "unwired-export", symbol: "orphanFn", file: "packages/standard/src/legend.ts" },
    ]);
  });

  test("importedBindingsOf never turns a comment mention into an import edge", () => {
    const src =
      "/**\n * orphanFn is unused. See orphanFn's own doc for orphanFn's contract.\n */\n" +
      "export function orphanFn() { return 1; }\n// one more mention of orphanFn\n";
    expect(importedBindingsOf(src)).toEqual([]);
  });

  test("MUST-FAIL: a literal self-import edge does not count as a caller of itself", () => {
    // No file in this codebase self-imports (verified before writing the detector), but the
    // exclusion is coded defensively rather than left to luck (see the file header). This exercises
    // it behaviourally, through checkUnwiredSources, not merely through resolveSpecifier in isolation.
    const sources = [
      {
        path: "packages/standard/src/x.ts",
        content: 'import { helper } from "./x.ts";\nexport function helper() { return helper(); }\n',
      },
    ];
    const r = checkUnwiredSources(sources);
    expect(r.findings).toEqual([
      { finding: "unwired-export", symbol: "helper", file: "packages/standard/src/x.ts" },
    ]);
  });
});

describe("unwired-exports — DoD 2: pointed at the sprint's real motivating artifacts, not fixtures alone (L-166)", () => {
  // LIVE TREE (A3 — the strong form of L-166's bar: no historical checkout needed). Both are TD-103.
  test("LIVE TREE: TD-103's reconcile() is reported unwired in the tree right now", () => {
    const r = checkUnwired(REPO);
    expect(r.findings).toContainEqual({
      finding: "unwired-export",
      symbol: "reconcile",
      file: "packages/standard/src/spec-reader.ts",
    });
  });

  test("LIVE TREE: TD-103's marksInStandard() is reported unwired in the tree right now", () => {
    const r = checkUnwired(REPO);
    expect(r.findings).toContainEqual({
      finding: "unwired-export",
      symbol: "marksInStandard",
      file: "packages/standard/src/spec-reader.ts",
    });
  });

  // HISTORICAL — checked out via git show, no working-tree disturbance (SPRINT-091 T4/T11).
  test("HISTORICAL: attachLevel was unwired at the commit immediately before SPRINT-091 T11 wired it", () => {
    const r = checkUnwiredAtCommit(REPO, ATTACH_LEVEL_UNWIRED_COMMIT);
    expect(r.findings).toContainEqual({
      finding: "unwired-export",
      symbol: "attachLevel",
      file: "packages/standard/src/level.ts",
    });
  });

  // HISTORICAL — SPRINT-091 T6/T7/T12.
  test("HISTORICAL: createF4Registry and createS4AppendRegistry were unwired at the commit immediately before SPRINT-091 T12 wired them", () => {
    const r = checkUnwiredAtCommit(REPO, F4_S4APPEND_UNWIRED_COMMIT);
    expect(r.findings).toContainEqual({
      finding: "unwired-export",
      symbol: "createF4Registry",
      file: "packages/standard/src/rules/f4-registry.ts",
    });
    expect(r.findings).toContainEqual({
      finding: "unwired-export",
      symbol: "createS4AppendRegistry",
      file: "packages/standard/src/rules/s4-append-registry.ts",
    });
  });

  // CONTROLS — the same three symbols, wired in the CURRENT tree, stay green. Same detector, same
  // symbols, opposite commit: the difference is the wiring, never the checker.
  test("CONTROL: attachLevel is green in the CURRENT tree (wired since T11)", () => {
    const r = checkUnwired(REPO);
    expect(r.findings.some((f) => f.symbol === "attachLevel")).toBe(false);
  });

  test("CONTROL: createF4Registry and createS4AppendRegistry are green in the CURRENT tree (wired since T12)", () => {
    const r = checkUnwired(REPO);
    expect(r.findings.some((f) => f.symbol === "createF4Registry")).toBe(false);
    expect(r.findings.some((f) => f.symbol === "createS4AppendRegistry")).toBe(false);
  });
});

describe("unwired-exports — test-adjacent files are excluded both as export sites and as callers", () => {
  test("isTestAdjacent matches .test.ts / .spec.ts / .fake.ts and nothing else", () => {
    expect(isTestAdjacent("packages/standard/src/foo.test.ts")).toBe(true);
    expect(isTestAdjacent("packages/standard/src/foo.spec.ts")).toBe(true);
    expect(isTestAdjacent("packages/standard/src/rules/foo.fake.ts")).toBe(true);
    expect(isTestAdjacent("packages/standard/src/foo.ts")).toBe(false);
    // Shape, not substring: a production file whose NAME merely contains "test" is not exempted.
    expect(isTestAdjacent("packages/standard/src/attestation.ts")).toBe(false);
  });

  test("LIVE TREE: a *.fake.ts test double, called only from tests, is NOT flagged as unwired", () => {
    // packages/standard/src/rules/adr-history-port.fake.ts exports adrHistoryPort, imported only by
    // *.test.ts files (grep-verified before writing this detector). If the exclusion were missing,
    // the live-repo run above would carry this (and every sibling fake) as a false positive.
    const r = checkUnwired(REPO);
    expect(r.findings.some((f) => f.file.endsWith(".fake.ts"))).toBe(false);
  });
});

describe("unwired-exports — shape, not substring: export/import parsing", () => {
  test("a commented-out export declaration is not a symbol", () => {
    expect(exportedSymbolsOf("// export function ghost() {}\nexport const y = 1;")).toEqual(["y"]);
  });

  test("export type / export interface are excluded — nothing 'calls' a type", () => {
    expect(exportedSymbolsOf("export type T = number;\nexport interface I { x: number }\nexport const z = 1;")).toEqual(["z"]);
  });

  test("export function / const / class are all recognised", () => {
    const src = "export function a() {}\nexport const b = 1;\nexport class C {}\n";
    expect(exportedSymbolsOf(src)).toEqual(["a", "b", "C"]);
  });

  test("a named import list resolves each binding to its ORIGINAL name, aliasing included", () => {
    const src = 'import { a, b as c, type T } from "./x.ts";';
    expect(importedBindingsOf(src)).toEqual([
      { name: "a", specifier: "./x.ts" },
      { name: "b", specifier: "./x.ts" },
    ]);
  });

  test("MUST-FAIL: a WHOLE-CLAUSE type-only import (`import type { X }`) produces zero bindings", () => {
    // Erased at compile time -- not a runtime caller, and it can only ever pair with an exported TYPE,
    // which exportedSymbolsOf never reports (nothing "calls" a type). Distinct code path from the
    // inline `{ type T }` member case above -- the whole-clause `type` keyword sits BEFORE the brace.
    expect(importedBindingsOf('import type { X } from "./x.ts";')).toEqual([]);
  });

  test("a bare/package specifier resolves to null — never a local export site", () => {
    expect(resolveSpecifier("apps/cli/src/main.ts", "bun:test")).toBeNull();
    expect(resolveSpecifier("apps/cli/src/main.ts", "node:fs")).toBeNull();
  });

  test("a deep relative specifier resolves to the correct repo-relative path", () => {
    expect(resolveSpecifier("apps/cli/src/main.ts", "../../../packages/standard/src/rules/f4-registry.ts"))
      .toBe("packages/standard/src/rules/f4-registry.ts");
  });

  test("a self-import edge (importer resolves to its own defining file) is excluded defensively", () => {
    // No file in this codebase self-imports (verified before writing the detector), but the guard
    // must not rely on that staying true by luck — L-108's shape-not-substring principle applies to
    // the DEFENDER, not only the attacker: exclude the edge type, don't hope it never occurs.
    expect(resolveSpecifier("packages/standard/src/x.ts", "./x.ts")).toBe("packages/standard/src/x.ts");
  });
});
