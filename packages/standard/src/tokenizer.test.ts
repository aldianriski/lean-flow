import { describe, expect, test } from "bun:test";
import { tokenize } from "./tokenizer.ts";

describe("tokenize — the four constructs come back as distinct, correctly-positioned nodes", () => {
  test("a heading, a table and a fence are distinct typed nodes with correct source positions", () => {
    const src = [
      "## §1 — Title", // line 1
      "", // line 2
      "| Rule | Level |", // line 3
      "|---|---|", // line 4
      "| `S1.FOO` | Attested |", // line 5
      "", // line 6
      "```yaml", // line 7
      "key: value", // line 8
      "```", // line 9
    ].join("\n");

    const doc = tokenize(src, "f.md");

    expect(doc.blocks.map((b) => b.type)).toEqual(["heading", "table", "fence"]);

    const [heading, table, fence] = doc.blocks;
    expect(heading).toEqual({ type: "heading", depth: 2, text: "§1 — Title", loc: { file: "f.md", line: 1 } });


    // `?.` narrows the discriminated union AND excludes undefined in one comparison, so no
    // assertion is needed to reach the variant's own fields below.
    if (table?.type !== "table") throw new Error("expected table");
    expect(table.loc).toEqual({ file: "f.md", line: 3 });
    expect(table.header.cells).toEqual(["Rule", "Level"]);
    expect(table.align).toEqual(["---", "---"]);
    expect(table.rows).toEqual([{ cells: ["`S1.FOO`", "Attested"], loc: { file: "f.md", line: 5 } }]);

    if (fence?.type !== "fence") throw new Error("expected fence");
    expect(fence).toEqual({
      type: "fence",
      lang: "yaml",
      content: ["key: value"],
      closed: true,
      loc: { file: "f.md", line: 7 },
    });
  });

  test("a paragraph is the fallback bucket for plain text, and carries its start position", () => {
    const doc = tokenize("just some prose\nspanning two lines", "f.md");
    expect(doc.blocks).toEqual([
      { type: "paragraph", text: "just some prose\nspanning two lines", loc: { file: "f.md", line: 1 } },
    ]);
  });
});

describe("tokenize — fenced code is a hard boundary (constraint 5)", () => {
  test("a heading-shaped line inside a fence is NOT parsed as a heading", () => {
    const src = ["```md", "## this looks like a heading but is example text", "```"].join("\n");
    const doc = tokenize(src, "f.md");
    expect(doc.blocks.map((b) => b.type)).toEqual(["fence"]);
    const fenceOnly = doc.blocks[0];
    if (fenceOnly?.type !== "fence") throw new Error("expected fence");
    expect(fenceOnly.content).toEqual(["## this looks like a heading but is example text"]);
  });

  test("a table-shaped block inside a fence is NOT parsed as a table", () => {
    const src = ["```md", "| a | b |", "|---|---|", "| 1 | 2 |", "```"].join("\n");
    const doc = tokenize(src, "f.md");
    expect(doc.blocks.map((b) => b.type)).toEqual(["fence"]);
    const fenceTable = doc.blocks[0];
    if (fenceTable?.type !== "fence") throw new Error("expected fence");
    expect(fenceTable.content).toEqual(["| a | b |", "|---|---|", "| 1 | 2 |"]);
  });

  test("an unterminated fence runs to EOF and is reported as unclosed, not silently dropped", () => {
    const doc = tokenize(["```md", "still going"].join("\n"), "f.md");
    expect(doc.blocks).toEqual([
      { type: "fence", lang: "md", content: ["still going"], closed: false, loc: { file: "f.md", line: 1 } },
    ]);
  });

  test("a bare thematic-break `---` (no pipe) is a paragraph line, never a table delimiter", () => {
    // The Standard uses 19 of these as section dividers. Without the pipe guard, a preceding
    // pipe-bearing header line immediately followed by one would be misread as a one-column table.
    const doc = tokenize(["some text with a | pipe in it", "---"].join("\n"), "f.md");
    expect(doc.blocks).toEqual([
      { type: "paragraph", text: "some text with a | pipe in it\n---", loc: { file: "f.md", line: 1 } },
    ]);
  });
});

describe("tokenize — paragraph termination stops at the start of any other construct", () => {
  test("a paragraph does not swallow a heading that follows with no blank line", () => {
    const doc = tokenize(["prose line", "## §2 — Next"].join("\n"), "f.md");
    expect(doc.blocks.map((b) => b.type)).toEqual(["paragraph", "heading"]);
  });

  test("a paragraph does not swallow a table that follows with no blank line", () => {
    const doc = tokenize(["prose line", "| a | b |", "|---|---|"].join("\n"), "f.md");
    expect(doc.blocks.map((b) => b.type)).toEqual(["paragraph", "table"]);
  });

  test("a paragraph does not swallow a fence that follows with no blank line", () => {
    const doc = tokenize(["prose line", "```", "code", "```"].join("\n"), "f.md");
    expect(doc.blocks.map((b) => b.type)).toEqual(["paragraph", "fence"]);
  });

  test("a blank line ends a paragraph and is itself skipped -- not a node", () => {
    const doc = tokenize(["prose", "", "more prose"].join("\n"), "f.md");
    expect(doc.blocks).toEqual([
      { type: "paragraph", text: "prose", loc: { file: "f.md", line: 1 } },
      { type: "paragraph", text: "more prose", loc: { file: "f.md", line: 3 } },
    ]);
  });
});

describe("tokenize — heading depth", () => {
  test("depth is the number of '#' markers, 1 through 6", () => {
    const doc = tokenize(["# one", "###### six"].join("\n"), "f.md");
    expect(doc.blocks.map((b) => (b.type === "heading" ? b.depth : -1))).toEqual([1, 6]);
  });

  test("a line with '#' but no following space is not a heading (falls to paragraph)", () => {
    const doc = tokenize("#nospace", "f.md");
    expect(doc.blocks).toEqual([{ type: "paragraph", text: "#nospace", loc: { file: "f.md", line: 1 } }]);
  });
});
