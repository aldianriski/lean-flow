import { describe, expect, test } from "bun:test";
import { combineAdrAppendPort } from "./adr-append-port.ts";
// SPRINT-092 T1: fixtures build through the shared factory -- see s4-onefile.test.ts's own comment
// and `test/fixtures/adr-family-factory.ts`'s header for why the factory cannot decide a verdict.
import { adrFamilyPort, adrHistoryPort } from "../../../../test/fixtures/adr-family-factory.ts";
import { ADR_EDITED_AFTER_DECISION, evaluate } from "./s4-append.ts";

const PATH = "docs/adr/ADR-001-a-real-decision.md";
const DECIDING_REV = "aaaaaaa1111111111111111111111111111111";

/** A complete ADR body, § Decision holding `decision`, with an accepted-status header bullet. */
function adrText(decision: string, extraHeaderLine?: string): string {
  return [
    "- **Status:** accepted (2026-08-20)",
    ...(extraHeaderLine ? [extraHeaderLine] : []),
    "- **Deciders:** Maintainer",
    "",
    "## Context",
    "",
    "text",
    "",
    "## Decision",
    "",
    decision,
    "",
    "## Consequences",
    "",
    "**Negative:** it costs something.",
  ].join("\n");
}

/** A single-ADR, single-revision port: the deciding commit's text and the CURRENT text are supplied
 *  independently, so a test can diverge them to model an edit. */
function singleAdrPort(decidingText: string, currentText: string) {
  const family = adrFamilyPort({ adrDirFiles: { "ADR-001-a-real-decision.md": currentText } });
  const history = adrHistoryPort({
    revisionsByPath: { [PATH]: [DECIDING_REV] },
    contentAtRevision: { [`${DECIDING_REV}:${PATH}`]: decidingText },
  });
  return combineAdrAppendPort(family, history);
}

describe("S4.APPEND -- evaluate, against the in-memory fakes", () => {
  test("no canonical ADR files: note, not a finding", () => {
    const port = combineAdrAppendPort(
      adrFamilyPort({ adrDirFiles: {} }),
      adrHistoryPort({}),
    );
    const r = evaluate(port);
    expect(r.verdict).toBe("note");
    expect(r.findings).toEqual([]);
  });

  test("not a git repository: note, distinct wording, no finding", () => {
    const port = combineAdrAppendPort(
      adrFamilyPort({ adrDirFiles: { "ADR-001-a-real-decision.md": adrText("x") } }),
      adrHistoryPort({ isRepo: false }),
    );
    const r = evaluate(port);
    expect(r.verdict).toBe("note");
    expect(r.findings).toEqual([]);
    expect(r.detail).toContain("history unavailable:");
  });

  test("a shallow clone: note, distinct wording from 'no history', no finding", () => {
    const port = combineAdrAppendPort(
      adrFamilyPort({ adrDirFiles: { "ADR-001-a-real-decision.md": adrText("x") } }),
      adrHistoryPort({ isShallow: true }),
    );
    const r = evaluate(port);
    expect(r.verdict).toBe("note");
    expect(r.findings).toEqual([]);
    expect(r.detail).toContain("history truncated:");
    expect(r.detail).not.toContain("history unavailable:");
  });

  test("§ Decision unchanged since the deciding commit: pass", () => {
    const text = adrText("We chose the first option.");
    const port = singleAdrPort(text, text);
    const r = evaluate(port);
    expect(r.verdict).toBe("pass");
    expect(r.findings).toEqual([]);
    expect(r.detail).toContain("1 ADR(s) unedited");
  });

  test("a post-decision MARKER added to the header, § Decision untouched: pass -- the distinction this rule exists to draw", () => {
    const deciding = adrText("We chose the first option.");
    const now = adrText("We chose the first option.", "- **Scope amended by:** [ADR-002](ADR-002-a-later-decision.md) (2026-08-21)");
    const port = singleAdrPort(deciding, now);
    const r = evaluate(port);
    expect(r.verdict).toBe("pass");
    expect(r.findings).toEqual([]);
  });

  test("§ Decision rewritten after the deciding commit: fail, ONE finding named adr-edited-after-decision", () => {
    const deciding = adrText("We chose the first option.");
    const now = adrText("We chose the second option after all.");
    const port = singleAdrPort(deciding, now);
    const r = evaluate(port);
    expect(r.verdict).toBe("fail");
    expect(r.findings).toHaveLength(1);
    expect(r.findings[0]?.name).toBe(ADR_EDITED_AFTER_DECISION);
    expect(r.findings[0]?.detail).toContain(PATH);
    expect(r.findings[0]?.detail).toContain("does not trip this"); // the marker-is-supported line
  });

  test("no ADR has ever reached accepted status: note, not a finding", () => {
    const proposed = [
      "- **Status:** proposed (2026-08-20)",
      "- **Deciders:** Maintainer",
      "",
      "## Decision",
      "",
      "text",
    ].join("\n");
    const port = combineAdrAppendPort(
      adrFamilyPort({ adrDirFiles: { "ADR-001-a-real-decision.md": proposed } }),
      adrHistoryPort({
        revisionsByPath: { [PATH]: [DECIDING_REV] },
        contentAtRevision: { [`${DECIDING_REV}:${PATH}`]: proposed },
      }),
    );
    const r = evaluate(port);
    expect(r.verdict).toBe("note");
    expect(r.findings).toEqual([]);
    expect(r.detail).toContain("no ADR has reached an accepted status yet");
  });

  test("an ADR with no commit touching it: skipped -- neither clean, undecided, nor a finding, and a sibling decided ADR still passes", () => {
    const decided = adrText("We chose the first option.");
    const family = adrFamilyPort({
      adrDirFiles: {
        "ADR-001-a-real-decision.md": decided,
        "ADR-002-untracked.md": adrText("brand new, not committed yet"),
      },
    });
    const history = adrHistoryPort({
      revisionsByPath: { [PATH]: [DECIDING_REV] }, // ADR-002 deliberately absent -- "no commit"
      contentAtRevision: { [`${DECIDING_REV}:${PATH}`]: decided },
    });
    const r = evaluate(combineAdrAppendPort(family, history));
    expect(r.verdict).toBe("pass");
    expect(r.findings).toEqual([]);
    expect(r.detail).toContain("1 ADR(s) unedited"); // only the decided one counted
  });

  // Cardinality (EPIC-014 D2): TWO independently edited ADRs must read back as TWO findings.
  test("TWO edited ADRs: fail, TWO findings, each naming its own path", () => {
    const pathA = "docs/adr/ADR-001-a-real-decision.md";
    const pathB = "docs/adr/ADR-002-a-later-decision.md";
    const decidingA = adrText("We chose the first option.");
    const nowA = adrText("We chose the second option after all.");
    const decidingB = adrText("We picked plan B.");
    const nowB = adrText("We picked plan C, quietly.");

    const family = adrFamilyPort({
      adrDirFiles: {
        "ADR-001-a-real-decision.md": nowA,
        "ADR-002-a-later-decision.md": nowB,
      },
    });
    const history = adrHistoryPort({
      revisionsByPath: { [pathA]: [DECIDING_REV], [pathB]: [DECIDING_REV] },
      contentAtRevision: {
        [`${DECIDING_REV}:${pathA}`]: decidingA,
        [`${DECIDING_REV}:${pathB}`]: decidingB,
      },
    });

    const r = evaluate(combineAdrAppendPort(family, history));
    expect(r.verdict).toBe("fail");
    expect(r.findings).toHaveLength(2);
    expect(r.findings.every((f) => f.name === ADR_EDITED_AFTER_DECISION)).toBe(true);
    expect(r.findings.map((f) => f.detail).join("\n")).toContain(pathA);
    expect(r.findings.map((f) => f.detail).join("\n")).toContain(pathB);
  });
});
