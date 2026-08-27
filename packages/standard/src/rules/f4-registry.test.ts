import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { makeRuleId } from "../model.ts";
import { classifySection } from "../section.ts";
import { readSection, toStandardRule } from "../spec-reader.ts";
import { tokenize } from "../tokenizer.ts";
import { InMemoryAdrFamilyPort } from "./adr-family-port.fake.ts";
import { createF4Registry } from "./f4-registry.ts";

describe("createF4Registry — all four tree-answerable S4 rules resolve out of the box", () => {
  test("S4.ONEFILE, S4.INDEX, S4.SECTIONS, S4.NEGATIVE each dispatch to their own evaluator", () => {
    const registry = createF4Registry();
    const port = new InMemoryAdrFamilyPort({ adrDirFiles: {} });

    expect(registry.dispatch(makeRuleId("S4.ONEFILE"), port)?.verdict).toBe("note");
    expect(registry.dispatch(makeRuleId("S4.INDEX"), port)?.verdict).toBe("note");
    expect(registry.dispatch(makeRuleId("S4.SECTIONS"), port)?.verdict).toBe("note");
    expect(registry.dispatch(makeRuleId("S4.NEGATIVE"), port)?.verdict).toBe("note");
  });

  test("S4.APPEND (this family's Gated rule, T7's) resolves to undefined, not a thrown error", () => {
    const registry = createF4Registry();
    expect(registry.resolve(makeRuleId("S4.APPEND"))).toBeUndefined();
  });

  test("a rule outside the family (S12.SECRETS) resolves to undefined, not a thrown error", () => {
    const registry = createF4Registry();
    expect(registry.resolve(makeRuleId("S12.SECRETS"))).toBeUndefined();
  });
});

// --- Whole-section proof: classifySection over the REAL §4 rows -- T6's four evaluators dispatch;
// S4.APPEND (mechanical, unregistered here) reports GAP, never a silent pass; the two judgment-only
// rules (S4.BAR, S4.NOINVENT) exclude, never reaching this registry or the port at all.

const SPEC_PATH = fileURLToPath(new URL("../../../../spec/STANDARD.md", import.meta.url));

/** A single, complete, indexed ADR -- so all four dispatched rules PASS together on it, mirroring
 *  `evals/fixtures/adr-family/clean`'s own shape. */
const COMPLETE_ADR = [
  "- **Status:** accepted (2026-08-20)",
  "- **Deciders:** Maintainer",
  "",
  "## Context",
  "",
  "text",
  "",
  "## Decision",
  "",
  "text",
  "",
  "## Consequences",
  "",
  "**Positive:** it works.",
  "**Negative:** it costs something.",
  "",
  "## Alternatives considered",
  "",
  "| a | b |",
].join("\n");

describe("classifySection(4, ...) — T6 evaluators, over the REAL §4 rows", () => {
  test("4 evaluated (mechanical, all pass) + 1 gap (S4.APPEND) + 2 excluded (judgment-only) = 7 total", () => {
    const text = readFileSync(SPEC_PATH, "utf8");
    const doc = tokenize(text, SPEC_PATH);
    const read = readSection(doc, 4, SPEC_PATH);
    expect(read.ok).toBe(true);
    if (!read.ok) return;
    const rules = read.rows.map((row) => toStandardRule(row, 4, SPEC_PATH));
    expect(rules).toHaveLength(7); // independent count: `read-spec-rules.sh --section 4` also prints 7 rows

    const registry = createF4Registry();
    const port = new InMemoryAdrFamilyPort({
      adrDirFiles: { "ADR-001-a-real-decision.md": COMPLETE_ADR },
      indexFile: { path: "docs/DECISIONS.md", text: "ADR-001-a-real-decision.md\n" },
    });

    const report = classifySection(4, rules, registry, port);
    expect(report.outcomes).toHaveLength(7);

    const evaluated = report.outcomes.filter((o) => o.kind === "evaluated");
    const excluded = report.outcomes.filter((o) => o.kind === "excluded");
    expect(evaluated).toHaveLength(5); // 4 real dispatches + S4.APPEND's gap
    expect(excluded).toHaveLength(2); // S4.BAR, S4.NOINVENT

    const passes = evaluated.filter((o) => o.kind === "evaluated" && o.evaluation.verdict === "pass");
    const gaps = evaluated.filter((o) => o.kind === "evaluated" && o.evaluation.verdict === "gap");
    expect(passes).toHaveLength(4);
    expect(gaps).toHaveLength(1);
    expect(gaps[0]?.kind === "evaluated" && gaps[0].evaluation.ruleId).toBe(makeRuleId("S4.APPEND"));

    const judgmentRequired = excluded.filter((o) => o.kind === "excluded" && o.reason === "judgment-only");
    expect(judgmentRequired).toHaveLength(2);
  });
});
