import { describe, expect, test } from "bun:test";
import { parse, run } from "./main.ts";

// Tests name behaviour, never shape (V3 §33). "parser test" would tell a later reader nothing
// about what broke.

describe("leanflow argument parsing", () => {
  test("recognises --version and its short form as the same intent", () => {
    expect(parse(["--version"])).toEqual({ kind: "version" });
    expect(parse(["-v"])).toEqual({ kind: "version" });
  });

  test("treats a bare invocation as a request for help, not an error", () => {
    expect(parse([])).toEqual({ kind: "help" });
  });

  test("prefers --version over --help when both are given, so the answer is deterministic", () => {
    expect(parse(["--help", "--version"])).toEqual({ kind: "version" });
  });

  test("carries unrecognised arguments through instead of discarding them", () => {
    expect(parse(["conformance", "."])).toEqual({
      kind: "unknown",
      args: ["conformance", "."],
    });
  });
});

describe("leanflow exit codes", () => {
  const capture = () => {
    const lines: string[] = [];
    return { lines, write: (s: string) => lines.push(s) };
  };

  test("succeeds on --version and names itself pre-release", () => {
    const { lines, write } = capture();
    expect(run({ kind: "version" }, write)).toBe(0);
    expect(lines.join("\n")).toContain("pre-release");
  });

  test("fails with a distinct code on an unknown argument, never silently succeeds", () => {
    const { lines, write } = capture();
    expect(run({ kind: "unknown", args: ["migrate"] }, write)).toBe(2);
    expect(lines.join("\n")).toContain("unknown argument");
  });

  test("points at the Shell implementation that still holds authority", () => {
    const { lines, write } = capture();
    run({ kind: "help" }, write);
    // The strangler keeps Shell authoritative until a family cuts over (EPIC-014 D2). A help
    // text that omits this would tell an operator the TS engine does more than it does.
    expect(lines.join("\n")).toContain("sh conformance.sh .");
  });
});
