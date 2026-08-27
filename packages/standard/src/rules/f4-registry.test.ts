import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { makeRuleId } from "../model.ts";
import { bindRegistry, createRegistry } from "../registry.ts";
import { classifySection } from "../section.ts";
import { readSection, toStandardRule } from "../spec-reader.ts";
import { tokenize } from "../tokenizer.ts";
import { composeFamilies } from "../traverse.ts";
import { InMemoryAdrFamilyPort } from "./adr-family-port.fake.ts";
import { createF4Registry } from "./f4-registry.ts";
import { createBuiltInRegistry } from "./built-in.ts";
import { InMemorySprintDirPort } from "./sprint-log-outside-logs-dir.fake.ts";
import { createF12Registry } from "./f12-registry.ts";
import { InMemoryGitBoundaryPort } from "./git-boundary-port.fake.ts";

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

// --- ADR-038's seam, used FOR REAL: F4 composed alongside S9 and F12 (T6 retry, item 2) --------------
//
// `traverse.test.ts` already proves `composeFamilies`/`bindRegistry` generically, with SYNTHETIC
// ports (its own DoD 3). That is NOT the same claim T6's own commit message made -- "ADR-038's seam
// being used for the first time by a family that did not exist when it was written" -- and nothing in
// the earlier commit ever composed F4 through `bindRegistry`/`composeFamilies` alongside a second real
// family. This block is that missing test: F4's REAL registry, bound to F4's REAL port, composed with
// S9's and F12's REAL registries -- never a stand-in for any of the three.

describe("F4 composed with S9 and F12 through bindRegistry/composeFamilies (ADR-038's seam, for real)", () => {
  function realThreeFamilyDispatch() {
    const s9 = bindRegistry(createBuiltInRegistry(), new InMemorySprintDirPort([]));
    const f12 = bindRegistry(
      createF12Registry(),
      new InMemoryGitBoundaryPort({ files: {}, allowedAssetDirs: [], generatedClasses: [], generatedAllowedExclusions: [] }),
    );
    const f4 = bindRegistry(createF4Registry(), new InMemoryAdrFamilyPort({ adrDirFiles: {} }));
    return composeFamilies([s9, f12, f4]);
  }

  test("F4 ids resolve through the COMPOSED dispatcher, alongside S9's and F12's own ids", () => {
    const dispatch = realThreeFamilyDispatch();

    expect(dispatch(makeRuleId("S4.ONEFILE"))?.verdict).toBe("note");
    expect(dispatch(makeRuleId("S4.INDEX"))?.verdict).toBe("note");
    expect(dispatch(makeRuleId("S4.SECTIONS"))?.verdict).toBe("note");
    expect(dispatch(makeRuleId("S4.NEGATIVE"))?.verdict).toBe("note");

    // Composing F4 in did not shadow either EXISTING family -- both still resolve their own ids.
    expect(dispatch(makeRuleId("S9.LOGDIR"))?.verdict).toBe("pass");
    expect(dispatch(makeRuleId("S12.SECRETS"))?.verdict).toBe("pass");

    // S4.APPEND belongs to NONE of the three families bound here (its port is T7's, not built yet) --
    // composeFamilies must answer undefined, never a guess and never a throw.
    expect(dispatch(makeRuleId("S4.APPEND"))).toBeUndefined();
  });

  // The one guarantee this seam exists to make (traverse.ts's own header: "a rule id must belong to
  // exactly one family"). No REAL duplicate exists between F4 and either sibling today, so the
  // collision is constructed the same way `traverse.test.ts`'s own synthetic cases do -- a throwaway
  // registry claiming one of F4's OWN ids, standing in for the strangler-handoff scenario ADR-038's
  // Decision names (a rule moving between families mid-migration, briefly claimed by both).
  test("a duplicate id across F4 and another REAL family throws, naming both positions", () => {
    const f4 = bindRegistry(createF4Registry(), new InMemoryAdrFamilyPort({ adrDirFiles: {} }));

    const impostor = createRegistry<undefined>();
    impostor.register(makeRuleId("S4.ONEFILE"), () => ({
      ruleId: makeRuleId("S4.ONEFILE"),
      verdict: "note",
      findings: [],
      detail: "impostor -- a second family wrongly claiming S4.ONEFILE mid-migration",
    }));
    const impostorFamily = bindRegistry(impostor, undefined);

    const dispatch = composeFamilies([f4, impostorFamily]);
    expect(() => dispatch(makeRuleId("S4.ONEFILE"))).toThrow(/S4\.ONEFILE.*positions 0 and 1/);
  });

  // CONTROL: the SAME two families, a DIFFERENT id only F4 owns -- must dispatch normally, proving the
  // collision above is about THIS id, not a break in composeFamilies itself.
  test("CONTROL: a different F4 id, claimed by only F4, still dispatches normally alongside the impostor", () => {
    const f4 = bindRegistry(createF4Registry(), new InMemoryAdrFamilyPort({ adrDirFiles: {} }));

    const impostor = createRegistry<undefined>();
    impostor.register(makeRuleId("S4.ONEFILE"), () => ({
      ruleId: makeRuleId("S4.ONEFILE"),
      verdict: "note",
      findings: [],
      detail: "impostor",
    }));
    const impostorFamily = bindRegistry(impostor, undefined);

    const dispatch = composeFamilies([f4, impostorFamily]);
    expect(dispatch(makeRuleId("S4.INDEX"))?.verdict).toBe("note");
  });
});
