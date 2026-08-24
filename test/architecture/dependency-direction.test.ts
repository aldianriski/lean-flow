import { describe, expect, test } from "bun:test";
import { join } from "node:path";
import { RULES, checkLayers, importsOf, layerOf, stripNonCode } from "./layers.ts";

const FIXTURES = join(import.meta.dir, "..", "fixtures", "architecture");
const REPO = join(import.meta.dir, "..", "..");

describe("architecture fitness — one must-FAIL fixture per rule, each with ITS finding", () => {
  // Retained (TD-012). Deleting these with the prototype leaves the boundary unguarded, and the
  // failure is silent by construction: a violated architecture compiles, tests, and ships.
  for (const rule of RULES) {
    test(`MUST-FAIL: ${rule.finding} is caught, and reported under its own name`, () => {
      const r = checkLayers(join(FIXTURES, rule.finding));
      const findings = r.violations.map((v) => v.finding);

      expect(findings).toContain(rule.finding);
      // A generic failure would not prove the rule fired — a fixture must fail with ITS finding
      // (L-058). Each fixture carries exactly one violation, so anything else is a misattribution.
      expect(new Set(findings)).toEqual(new Set([rule.finding]));
      expect(r.filesExamined).toBeGreaterThan(0);
    });
  }

  test("every rule has a fixture — the loop above cannot silently cover fewer rules than exist", () => {
    // Without this, deleting a fixture directory would just shrink the loop and still pass.
    expect(RULES.length).toBe(5);
  });
});

describe("architecture fitness — controls", () => {
  test("CONTROL: a correct dependency direction passes, and says how many edges it examined", () => {
    const r = checkLayers(join(FIXTURES, "clean"));
    expect(r.violations).toEqual([]);
    // Denominator, so a pass that examined nothing is visible as vacuous (L-156).
    expect(r.filesExamined).toBe(3);
    expect(r.edgesExamined).toBe(2);
  });

  test("CONTROL: apps/ importing packages/ is ALLOWED — the direction is inward, not bidirectional", () => {
    const r = checkLayers(join(FIXTURES, "clean"));
    expect(r.violations.filter((v) => v.from.startsWith("apps/"))).toEqual([]);
  });

  test("this repository is clean, and reports its own denominator", () => {
    const r = checkLayers(REPO);
    expect(r.violations).toEqual([]);
    expect(r.filesExamined).toBeGreaterThan(0);
  });
});

describe("architecture fitness — shape, not substring", () => {
  // SPRINT-083 T2 shipped a guard that matched a substring and gave a false PASS on text inside an
  // `echo`. The same class of mistake here would report a clean architecture over a violated one,
  // or invent violations that are only comments.
  test("a commented-out import is not an edge", () => {
    expect(importsOf(`// import { x } from "apps/cli/src/main.ts";\nexport const y = 1;`)).toEqual([]);
    expect(importsOf(`/* import { x } from "apps/cli/src/main.ts"; */`)).toEqual([]);
  });

  test("a MULTI-LINE block comment containing a real import statement is not an edge", () => {
    // The case where stripping is actually load-bearing. A single-line `// import` is already
    // refused by the anchored regex (it requires `import` at line start), so the two tests above
    // pass even with comment-stripping disabled — verified by seeding that break. This one does not.
    const src = ["/*", 'import { x } from "apps/cli/src/main.ts";', "*/", "export const y = 1;"].join(String.fromCharCode(10));
    expect(importsOf(src)).toEqual([]);
  });

  test("an import path mentioned inside a string literal is not an edge", () => {
    expect(importsOf(`export const msg = "do not import apps/cli/src/main.ts here";`)).toEqual([]);
  });

  test("a real import IS an edge, in every form the codebase uses", () => {
    expect(importsOf(`import { a } from "./x.ts";`)).toContain("./x.ts");
    expect(importsOf(`import "./side-effect.ts";`)).toContain("./side-effect.ts");
    expect(importsOf(`export { a } from "./y.ts";`)).toContain("./y.ts");
    expect(importsOf(`const m = await import("./z.ts");`)).toContain("./z.ts");
    expect(importsOf(`import type { T } from "./t.ts";`)).toContain("./t.ts");
  });

  test("stripNonCode leaves code intact while removing comments", () => {
    expect(stripNonCode(`const a = 1; // trailing\nconst b = 2;`)).toContain("const b = 2;");
    expect(stripNonCode(`const a = 1; // trailing\nconst b = 2;`)).not.toContain("trailing");
  });
});

describe("architecture fitness — the test-file exemption is narrow", () => {
  // Found by T4 exercising T3's guard on real code: packages/standard/src/model.test.ts imports
  // bun:test and was reported as domain-imports-infrastructure. V3 §16 prescribes exactly that
  // colocated layout, so the guard was wrong, not the code. The exemption is by FILENAME only --
  // this fixture proves it did not become a blanket hole for the directory.
  test("a colocated *.test.ts may import its runner and infrastructure", () => {
    const r = checkLayers(join(FIXTURES, "test-file-exemption"));
    expect(r.violations.map((v) => v.from)).not.toContain("packages/standard/src/model.test.ts");
  });

  test("MUST-FAIL: a PRODUCTION file beside it is still fully checked", () => {
    const r = checkLayers(join(FIXTURES, "test-file-exemption"));
    expect(r.violations).toEqual([
      { finding: "domain-imports-infrastructure", from: "packages/standard/src/model.ts", specifier: "node:fs" },
    ]);
  });

  test("layerOf classifies a colocated test file as test, not domain", () => {
    expect(layerOf("packages/standard/src/model.test.ts")).toBe("test");
    expect(layerOf("packages/standard/src/model.ts")).toBe("domain");
  });
});

describe("architecture fitness — layer assignment is explicit", () => {
  test("an unrecognised path is `unassigned`, never silently treated as domain", () => {
    // Defaulting an unknown path INTO a layer would apply that layer's rules to files nobody
    // classified, and defaulting it OUT would exempt them. Both are silent; this is neither.
    expect(layerOf("scripts/qa-check.sh")).toBe("unassigned");
    expect(layerOf("packages/standard/src/model.ts")).toBe("domain");
    expect(layerOf("packages/contracts/src/result.ts")).toBe("contracts");
    expect(layerOf("packages/standard/src/adapters/fs.ts")).toBe("adapters");
    expect(layerOf("apps/cli/src/main.ts")).toBe("app");
  });
});
