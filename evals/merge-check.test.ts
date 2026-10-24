// evals/merge-check.test.ts -- SPRINT-138 T3 (TASK-484): scripts/merge-check.ts runs the gate's five
// cross-cutting legs through an injected runner. One table-driven case reddens each leg in turn; the
// wiring test compares each leg's checker + argument expression to scripts/qa-check.sh itself, so a
// gate-side rename or argument change reddens it. Expected values are literals, not recomputed.
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { LEGS, gateFileSet, gateInvocation, mergeCheck, type Env, type Reply } from "../scripts/merge-check.ts";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const SPRINTS = ["docs/sprint/SPRINT-001-a.md", "docs/sprint/SPRINT-002-b.md"];
const ACTIVE = ["docs/sprint/SPRINT-002-b.md"];
const lastLine = (s: string) => s.trimEnd().split("\n").pop();

/** A fake host: every command passes unless `fail[key]` says otherwise. key = checker basename or "tsc". */
function env(over: { fail?: Record<string, Reply>; missing?: string[]; sprints?: string[]; active?: string[] } = {}) {
  const calls: string[] = [];
  const e: Env = {
    root: "/r",
    run(cmd, args) {
      calls.push([cmd, ...args].join(" "));
      const key = cmd.includes("tsc") ? "tsc" : (args[0] ?? "").split("/").pop()!;
      return over.fail?.[key] ?? { status: 0, stdout: `PASS ${key}\n` };
    },
    exists: (p) => !(over.missing ?? []).some((m) => p.endsWith(m)),
    sprintFiles: () => over.sprints ?? SPRINTS,
    activeSprintFiles: () => over.active ?? ACTIVE,
  };
  return { e, calls };
}

const RED: Record<string, { key: string; reply: Reply }> = {
  typecheck: { key: "tsc", reply: { status: 2, stdout: "a.ts(1,1): error TS2322: bad\n" } },
  "prose-density": { key: "check-prose-density.ts", reply: { status: 1, stdout: "FAIL  x.md denser\n" } },
  "layers-completeness": { key: "check-layers-completeness.ts", reply: { status: 1, stdout: "FAIL  T1 misses a.ts\n" } },
  "layers-observed": { key: "check-layers-observed.ts", reply: { status: 1, stdout: "FAIL  T2 touched b.ts\n" } },
  "scope-change": { key: "check-sprint-by-reference.ts", reply: { status: 1, stdout: "FAIL  scope c.ts\n" } },
};

describe("merge-check", () => {
  test("green control: all five green, exit 0", () => {
    const r = mergeCheck(env().e);
    expect(r.code).toBe(0);
    expect(lastLine(r.out)).toBe("merge-check: 5 green · 0 skipped · 0 failed (of 5)");
  });

  test.each(Object.keys(RED))("%s fails alone: named, exit non-zero, the other four green", (name) => {
    const c = RED[name]!;
    const r = mergeCheck(env({ fail: { [c.key]: c.reply } }).e);
    expect(r.code).not.toBe(0);
    expect(r.out).toContain(`FAIL  ${name}:`);
    expect(lastLine(r.out)).toBe("merge-check: 4 green · 0 skipped · 1 failed (of 5)");
  });

  test("a checker FAIL line is relayed", () => {
    const r = mergeCheck(env({ fail: { "check-layers-observed.ts": RED["layers-observed"]!.reply } }).e);
    expect(r.out).toContain("T2 touched b.ts");
  });

  test("tsc non-zero without an 'error TS' line is a checker failure, not a verdict", () => {
    const r = mergeCheck(env({ fail: { tsc: { status: 1, stdout: "boom\n" } } }).e);
    expect(r.code).not.toBe(0);
    expect(r.out).toContain("THE CHECKER ITSELF FAILED");
  });

  test("unavailable leg: missing tsc FAILS as not runnable, never a skip", () => {
    const r = mergeCheck(env({ missing: ["tsc", "tsc.exe", "tsc.cmd"] }).e);
    expect(r.code).not.toBe(0);
    expect(r.out).toContain("FAIL  typecheck: not runnable");
    expect(lastLine(r.out)).toBe("merge-check: 4 green · 0 skipped · 1 failed (of 5)");
  });

  test("unavailable leg: missing checker script FAILS as not runnable", () => {
    const r = mergeCheck(env({ missing: ["check-prose-density.ts"] }).e);
    expect(r.code).not.toBe(0);
    expect(r.out).toContain("FAIL  prose-density: not runnable");
  });

  test("no sprint file: the three sprint legs skip (neither green nor failed), exit 0", () => {
    const r = mergeCheck(env({ sprints: [], active: [] }).e);
    expect(r.code).toBe(0);
    expect(lastLine(r.out)).toBe("merge-check: 2 green · 3 skipped · 0 failed (of 5)");
  });

  test("calls: whole file set for completeness, root for prose density, scope-change per active file", () => {
    const { e, calls } = env();
    mergeCheck(e);
    expect(calls).toContain("bun scripts/lib/check-sprint-by-reference.ts docs/sprint/SPRINT-002-b.md --scope-change");
    expect(calls.filter((c) => c.includes("--scope-change")).length).toBe(1);
    expect(calls).toContain("bun scripts/lib/check-layers-completeness.ts docs/sprint/SPRINT-001-a.md docs/sprint/SPRINT-002-b.md");
    expect(calls).toContain("bun scripts/lib/check-prose-density.ts /r");
  });

  test("no active sprint: scope-change skips, the others still run", () => {
    const r = mergeCheck(env({ active: [] }).e);
    expect(r.out).toContain("scope-change: skip (no active sprint in docs/sprint/SPRINT-*.md)");
    expect(lastLine(r.out)).toBe("merge-check: 4 green · 1 skipped · 0 failed (of 5)");
  });

  test("a checker that exits 0 with only SKIP lines is a skip, not green; its SKIP line is relayed", () => {
    const r = mergeCheck(env({ fail: { "check-layers-observed.ts": { status: 0, stdout: "SKIP  S1 uncommitted work\n" } } }).e);
    expect(r.code).toBe(0);
    expect(r.out).toContain("SKIP  S1 uncommitted work");
    expect(lastLine(r.out)).toBe("merge-check: 4 green · 1 skipped · 0 failed (of 5)");
  });

  test("PASS plus SKIP lines is green and relays the SKIP", () => {
    const r = mergeCheck(env({ fail: { "check-layers-observed.ts": { status: 0, stdout: "PASS  S1\nSKIP  S2 wip\n" } } }).e);
    expect(r.out).toContain("SKIP  S2 wip");
    expect(lastLine(r.out)).toBe("merge-check: 5 green · 0 skipped · 0 failed (of 5)");
  });

  test("a checker that exits 0 but prints a FAIL line is a fail", () => {
    const r = mergeCheck(env({ fail: { "check-prose-density.ts": { status: 0, stdout: "PASS  a\nFAIL  b denser\n" } } }).e);
    expect(r.code).not.toBe(0);
    expect(r.out).toContain("FAIL  prose-density: b denser");
  });

  test("calls: layers-observed gets both sprint files, tsc gets --noEmit", () => {
    const { e, calls } = env();
    mergeCheck(e);
    expect(calls).toContain("bun scripts/lib/check-layers-observed.ts docs/sprint/SPRINT-001-a.md docs/sprint/SPRINT-002-b.md");
    expect(calls).toContain("node_modules/.bin/tsc --noEmit");
  });
});

describe("wiring against scripts/qa-check.sh", () => {
  const gate = readFileSync(`${ROOT}scripts/qa-check.sh`, "utf8");
  /** A leg's own block: from its `<var>_script=` line (tsc: its `tsc` guard) to the first column-0 `fi`. */
  function block(l: (typeof LEGS)[number]): string {
    const start = gate.indexOf(l.gateVar !== null ? `${l.gateVar}_script="` : "if [ ! -x node_modules/.bin/tsc ]");
    expect(start).toBeGreaterThan(-1);
    const end = gate.indexOf("\nfi\n", start);
    expect(end).toBeGreaterThan(start);
    return gate.slice(start, end);
  }
  test("five legs", () =>
    expect(LEGS.map((l) => l.name)).toEqual(["typecheck", "prose-density", "layers-completeness", "layers-observed", "scope-change"]));
  test.each(LEGS.map((l) => [l.name, l] as const))("%s: checker path and argument expression are the gate's, in its own block", (_n, l) => {
    const b = block(l);
    if (l.gateVar !== null) expect(b).toContain(`${l.gateVar}_script="${l.script}"`);
    expect(b).toContain(gateInvocation(l));
    const fs = gateFileSet(l);
    if (fs !== null) expect(b).toContain(fs);
  });
  test("the table carries the arguments the task fixed", () => {
    const inv = LEGS.map(gateInvocation);
    expect(inv).toEqual([
      "node_modules/.bin/tsc --noEmit",
      'bun "$pd_script" "$ROOT"',
      'bun "$lc_script" $lc_files',
      'bun "$lo_script" $lo_files',
      'bun "$sc_script" "$sc_f" --scope-change',
    ]);
    expect(LEGS.map(gateFileSet)).toEqual([
      null,
      null,
      "lc_files=$(ls docs/sprint/SPRINT-*.md",
      "lo_files=$(ls docs/sprint/SPRINT-*.md",
      "sc_files=$(grep -lE '^status: *active' docs/sprint/SPRINT-*.md",
    ]);
  });
});
