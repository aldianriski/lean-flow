import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { makeRuleId } from "../model.ts";
import { classifySection } from "../section.ts";
import { readSection } from "../spec-reader.ts";
import { toStandardRule } from "../spec-reader.ts";
import { tokenize } from "../tokenizer.ts";
import { InMemoryGitBoundaryPort } from "./git-boundary-port.fake.ts";
import { createF12Registry } from "./f12-registry.ts";

describe("createF12Registry — all four S12 mechanical rules resolve out of the box", () => {
  test("S12.SECRETS, S12.BACKUPS, S12.DESIGNSRC, S12.GENERATED each dispatch to their own evaluator", () => {
    const registry = createF12Registry();
    const port = new InMemoryGitBoundaryPort({
      files: {},
      allowedAssetDirs: ["public/"],
      generatedClasses: ["dist/"],
      generatedAllowedExclusions: [],
    });

    expect(registry.dispatch(makeRuleId("S12.SECRETS"), port)?.verdict).toBe("pass");
    expect(registry.dispatch(makeRuleId("S12.BACKUPS"), port)?.verdict).toBe("pass");
    expect(registry.dispatch(makeRuleId("S12.DESIGNSRC"), port)?.verdict).toBe("pass");
    expect(registry.dispatch(makeRuleId("S12.GENERATED"), port)?.verdict).toBe("pass");
  });

  test("a rule outside the family (S9.LOGDIR) resolves to undefined, not a thrown error", () => {
    const registry = createF12Registry();
    expect(registry.resolve(makeRuleId("S9.LOGDIR"))).toBeUndefined();
  });
});

// --- Whole-section proof: classifySection over the REAL §12 rows (T2's classification + T3's four
// evaluators, together) -- the four mechanical rules evaluate; the seven judgment-only rules and the
// one implementation-directed rule exclude, never reaching this registry or the port at all.

const SPEC_PATH = fileURLToPath(new URL("../../../../spec/STANDARD.md", import.meta.url));

describe("classifySection(12, ...) — T2 classification + T3 evaluators, over the REAL §12 rows", () => {
  test("4 evaluated (mechanical), 7 excluded/judgment-required, 1 excluded (implementation-directed) — 12 total", () => {
    const text = readFileSync(SPEC_PATH, "utf8");
    const doc = tokenize(text, SPEC_PATH);
    const read = readSection(doc, 12, SPEC_PATH);
    expect(read.ok).toBe(true);
    if (!read.ok) return;
    const rules = read.rows.map((row) => toStandardRule(row, 12, SPEC_PATH));
    expect(rules).toHaveLength(12); // independent count: `read-spec-rules.sh --section 12` also prints 12 rows

    const registry = createF12Registry();
    const port = new InMemoryGitBoundaryPort({
      files: {},
      allowedAssetDirs: ["public/", "src/assets/"],
      generatedClasses: ["dist/"],
      generatedAllowedExclusions: [],
    });

    const report = classifySection(12, rules, registry, port);
    expect(report.outcomes).toHaveLength(12);

    const evaluated = report.outcomes.filter((o) => o.kind === "evaluated");
    const excluded = report.outcomes.filter((o) => o.kind === "excluded");
    expect(evaluated).toHaveLength(4);
    expect(excluded).toHaveLength(8);

    // Every evaluated outcome actually PASSED (not gap) -- proves all four ids dispatch to a REAL
    // evaluator, never falling through to classify.ts's own `gap()` for "no evaluator registered".
    expect(evaluated.every((o) => o.kind === "evaluated" && o.evaluation.verdict === "pass")).toBe(true);

    const judgmentRequired = excluded.filter((o) => o.kind === "excluded" && o.reason === "judgment-only");
    const implDirected = excluded.filter((o) => o.kind === "excluded" && o.reason === "implementation-directed");
    expect(judgmentRequired).toHaveLength(7);
    expect(implDirected).toHaveLength(1);
  });
});
