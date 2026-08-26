import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import {
  extractAllowedAssetDirs,
  extractGeneratedAllowed,
  extractGeneratedClasses,
} from "./git-boundary-spec.ts";

// `readFileSync` stays in this `*.test.ts` file only -- git-boundary-spec.ts itself takes only text,
// never touching the filesystem (same convention as spec-reader.test.ts).

const SPEC_PATH = fileURLToPath(new URL("../../../../spec/STANDARD.md", import.meta.url));

describe("extractGeneratedClasses / extractGeneratedAllowed — against the real Standard", () => {
  // Independent source of truth: the ACTUAL shell functions `_s12_generated_classes` /
  // `_s12_generated_allowed`, extracted verbatim from conformance-engine.sh and run against
  // spec/STANDARD.md by hand (not recomputed by this code, and not this test's own re-derivation of
  // the awk): both printed the SAME 11 classes and 1 allowed exclusion asserted below.
  test("§12c's classes match the real spec, including the carve-out itself (subtracted by the caller, not here)", () => {
    const text = readFileSync(SPEC_PATH, "utf8");
    expect(extractGeneratedClasses(text)).toEqual([
      "node_modules/",
      "dist/",
      "build/",
      "coverage/",
      ".cache/",
      "*.log",
      ".DS_Store",
      "Thumbs.db",
      ".idea/",
      ".vscode/settings.json",
      ".vscode/extensions.json",
    ]);
  });

  test("§12c's one explicit MAY-commit carve-out is `.vscode/extensions.json`, not its sibling settings.json", () => {
    const text = readFileSync(SPEC_PATH, "utf8");
    expect(extractGeneratedAllowed(text)).toEqual([".vscode/extensions.json"]);
  });

  test("a paragraph with no `actually requires` closer never terminates -- an empty document reads as no classes", () => {
    expect(extractGeneratedClasses("")).toEqual([]);
    expect(extractGeneratedAllowed("")).toEqual([]);
  });

  test("`.gitignore` itself is named in prose but excluded from the class list (it is not a class)", () => {
    const text = "**c. Generated/temporary excludes.** The standard `.gitignore` classes: `dist/`. actually requires it.";
    expect(extractGeneratedClasses(text)).toEqual(["dist/"]);
  });
});

describe("extractAllowedAssetDirs — against the real Standard", () => {
  test("finds §12's two named asset directories on the Original-design-sources row", () => {
    const text = readFileSync(SPEC_PATH, "utf8");
    // The row is a single markdown table line carrying OTHER backticked tokens too (`.ai` / `.psd`,
    // the Examples cell) -- the real Shell awk operates on the WHOLE line ($0), so it picks those up
    // as well. This is not a TS/Shell divergence: verified by extracting `_s12_generated_classes`'s
    // sibling awk verbatim and running it against this same file; both sides produce the identical
    // four-token list. Reported to the coordinator as a pre-existing Shell quirk this migration
    // faithfully mirrors, not a bug this task introduces.
    expect(extractAllowedAssetDirs(text)).toEqual([".ai", ".psd", "public/", "src/assets/"]);
  });

  test("a line merely mentioning assets without the exact marker phrase contributes nothing", () => {
    expect(extractAllowedAssetDirs("assets go in `wrong/` somewhere else")).toEqual([]);
  });
});
