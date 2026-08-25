import { describe, expect, test } from "bun:test";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
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

  test("--rule takes a rule id and an optional repo-dir, defaulting repo-dir to '.'", () => {
    expect(parse(["--rule", "S9.LOGDIR", "/tmp/repo"])).toEqual({
      kind: "rule",
      ruleId: "S9.LOGDIR",
      repoDir: "/tmp/repo",
    });
    expect(parse(["--rule", "S9.LOGDIR"])).toEqual({ kind: "rule", ruleId: "S9.LOGDIR", repoDir: "." });
  });

  test("--rule with no id following falls through to unknown rather than crashing", () => {
    expect(parse(["--rule"])).toEqual({ kind: "unknown", args: ["--rule"] });
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

describe("leanflow --rule (SPRINT-087 T1 tracer bullet)", () => {
  const capture = () => {
    const lines: string[] = [];
    return { lines, write: (s: string) => lines.push(s) };
  };

  test("a malformed rule id fails distinctly, never silently as 'unimplemented'", () => {
    const { lines, write } = capture();
    expect(run({ kind: "rule", ruleId: "not-a-rule-id", repoDir: "." }, write)).toBe(2);
    expect(lines.join("\n")).toContain("not a rule id");
  });

  test("a well-formed id nothing registers reports rule-unimplemented, distinct from a fail", () => {
    const { lines, write } = capture();
    expect(run({ kind: "rule", ruleId: "S1.LAW2", repoDir: "." }, write)).toBe(2);
    expect(lines.join("\n")).toContain("rule-unimplemented");
  });

  test("S9.LOGDIR against a repo with a misplaced Execution Log: FAIL, exit 1, named finding", () => {
    const repo = mkdtempSync(join(tmpdir(), "cli-rule-fail-"));
    mkdirSync(join(repo, "docs", "sprint"), { recursive: true });
    writeFileSync(join(repo, "docs", "sprint", "SPRINT-001-x-log.md"), "log");

    const { lines, write } = capture();
    expect(run({ kind: "rule", ruleId: "S9.LOGDIR", repoDir: repo }, write)).toBe(1);
    expect(lines.join("\n")).toContain("sprint-log-outside-logs-dir");
  });

  test("S9.LOGDIR against a clean repo: PASS, exit 0", () => {
    const repo = mkdtempSync(join(tmpdir(), "cli-rule-pass-"));
    mkdirSync(join(repo, "docs", "sprint"), { recursive: true });
    writeFileSync(join(repo, "docs", "sprint", "SPRINT-001-x.md"), "# plan");

    const { lines, write } = capture();
    expect(run({ kind: "rule", ruleId: "S9.LOGDIR", repoDir: repo }, write)).toBe(0);
    expect(lines.join("\n")).toContain("PASS");
  });
});
