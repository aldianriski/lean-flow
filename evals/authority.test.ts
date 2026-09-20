// evals/authority.test.ts -- retained fixtures for scripts/lib/check-authority.ts (TASK-355), ported
// from evals/run-authority-fixtures.sh's shell-oracle cases to a single in-process Bun test file.
//
// WHY THIS SHAPE: the shell harness spawned `sh scripts/lib/check-authority.sh ...` once per case
// (~2.75s each under Windows fork() emulation) for a checker that is milliseconds of text matching.
// This file calls `runCheckAuthority()` directly, in-process, the same shape evals/dod-delta.test.ts
// and evals/doc-caps.test.ts already use. scripts/lib/check-authority.sh is UNCHANGED and remains
// the live oracle -- differential parity against it lives in evals/run-authority-differential.ts
// (opt-in, spawns the real shell checker), never here.
//
// Every case below is the SAME case evals/run-authority-fixtures.sh asserted, same fixture files,
// same named findings, same sibling-discrimination pairing (L-142: a break that reddens everything
// must fail these as loudly as one that reddens nothing) -- retained, not reinvented (TD-012).
import { describe, expect, test } from "bun:test";
import { fileURLToPath } from "node:url";
import { runCheckAuthority } from "../scripts/lib/check-authority.ts";

const FX = fileURLToPath(new URL("fixtures/authority/", import.meta.url));

function run(path: string) {
  const r = runCheckAuthority([`${FX}${path}`]);
  return { ...r, text: r.lines.join("\n") };
}

describe("check-authority.ts -- retained fixtures", () => {
  test("case 1 (must-FAIL): a task with no authority class is refused, never defaulted", () => {
    const r = run("missing-class/SPRINT-901-fx.md");
    expect(r.exitCode).toBe(1);
    expect(r.text).toContain("authority-undeclared:");
  });

  test("case 1b (L-142 discrimination): the declared sibling T1 in the same file still PASSES", () => {
    const r = run("missing-class/SPRINT-901-fx.md");
    expect(r.exitCode).toBe(1);
    expect(r.text).toMatch(/^FAIL {2}authority-undeclared: .* T2 /m);
    expect(r.text).toMatch(/^PASS {2}authority-declared: .* T1 J1$/m);
  });

  test("case 2 (control): every class the standard defines is accepted", () => {
    const r = run("control-classed/SPRINT-902-fx.md");
    expect(r.exitCode).toBe(0);
    expect(r.text).toContain("authority-declared:");
  });

  test("case 3 (must-FAIL): a J2 task EXECUTED instead of held", () => {
    const r = run("j2-executed/SPRINT-903-fx.md");
    expect(r.exitCode).toBe(1);
    expect(r.text).toContain("authority-j2-not-parked:");
  });

  test("case 3b (L-142 discrimination): the J1 sibling that legitimately ran still PASSES", () => {
    const r = run("j2-executed/SPRINT-903-fx.md");
    expect(r.exitCode).toBe(1);
    expect(r.text).toMatch(/^FAIL {2}authority-j2-not-parked: .* T2 /m);
    expect(r.text).toMatch(/^PASS {2}authority-declared: .* T1 J1$/m);
  });

  test("case 3c (TD-123, control): a J2 task executed ATTENDED (no park, no terminal line) is accepted", () => {
    const r = run("attended-j2-executed/SPRINT-908-fx.md");
    expect(r.exitCode).toBe(0);
    expect(r.text).toContain("authority-j2-honoured:");
  });

  test("case 3d: the J1 sibling stays green too, and no FAIL line appears", () => {
    const r = run("attended-j2-executed/SPRINT-908-fx.md");
    expect(r.exitCode).toBe(0);
    expect(r.text).toMatch(/^PASS {2}authority-j2-honoured: .* T2 executed with no park record/m);
    expect(r.text).toMatch(/^PASS {2}authority-declared: .* T1 J1$/m);
    expect(r.text).not.toMatch(/^FAIL/m);
  });

  test("case 3e (TD-124, must-FAIL): the envelope backstop catches what terminal-line alone misses", () => {
    const r = run("envelope-backstop-unattended/SPRINT-909-fx.md");
    expect(r.exitCode).toBe(1);
    expect(r.text).toContain("authority-j2-not-parked:");
  });

  test("case 3f: the J1 sibling in that same file stays green", () => {
    const r = run("envelope-backstop-unattended/SPRINT-909-fx.md");
    expect(r.exitCode).toBe(1);
    expect(r.text).toMatch(/^FAIL {2}authority-j2-not-parked: .* T2 /m);
    expect(r.text).toMatch(/^PASS {2}authority-declared: .* T1 J1$/m);
  });

  test("case 3g (TD-124, control): a bare-fence-quoted example terminal line is NOT read as a live rollup", () => {
    const r = run("attended-fenced-example/SPRINT-910-fx.md");
    expect(r.exitCode).toBe(0);
    expect(r.text).toContain("authority-j2-honoured:");
  });

  test("case 3h: the fenced quote is ignored, T2 and its J1 sibling both stay green, no FAIL", () => {
    const r = run("attended-fenced-example/SPRINT-910-fx.md");
    expect(r.exitCode).toBe(0);
    expect(r.text).toMatch(/^PASS {2}authority-j2-honoured: .* T2 executed with no park record/m);
    expect(r.text).toMatch(/^PASS {2}authority-declared: .* T1 J1$/m);
    expect(r.text).not.toMatch(/^FAIL/m);
  });

  test("case 4 (control): a J2 task that HELD is accepted", () => {
    const r = run("control-j2-parked/SPRINT-904-fx.md");
    expect(r.exitCode).toBe(0);
    expect(r.text).toContain("authority-j2-honoured:");
  });

  test("case 5: no run yet -- the honoured half is NOT evaluated, and that is not a pass", () => {
    const r = run("control-classed/SPRINT-902-fx.md");
    expect(r.exitCode).toBe(0);
    expect(r.text).not.toContain("authority-j2-honoured");
  });

  test("case 6: a CLOSED sprint is out of scope, and the skip is NOT a pass", () => {
    const r = run("closed-out-of-scope/SPRINT-905-fx.md");
    expect(r.exitCode).toBe(0);
    expect(r.text).toMatch(/^ +authority: skip \(status: closed/m);
    expect(r.text).not.toMatch(/^(PASS|FAIL) /m);
  });

  test("case 6b: an ACTIVE sprint with the same defect is still caught", () => {
    const r = run("missing-class/SPRINT-901-fx.md");
    expect(r.exitCode).toBe(1);
    expect(r.text).toContain("authority-undeclared:");
  });

  test("case 7 (must-FAIL): a J2 PARKED and then EXECUTED anyway, with no ruling", () => {
    const r = run("j2-bypassed/SPRINT-906-fx.md");
    expect(r.exitCode).toBe(1);
    expect(r.text).toContain("authority-j2-park-bypassed:");
  });

  test("case 7b (control): a park a human actually RESOLVED is accepted", () => {
    const r = run("control-j2-ruled/SPRINT-907-fx.md");
    expect(r.exitCode).toBe(0);
    expect(r.text).toContain("authority-j2-honoured:");
  });

  test("zero-arg invocation: no sprint files given, nothing verified, exit 0", () => {
    const r = runCheckAuthority([]);
    expect(r.exitCode).toBe(0);
    expect(r.lines.join("\n")).toContain("no sprint files given");
  });

  test("a nonexistent sprint file is a named FAIL, not a silent skip", () => {
    const r = runCheckAuthority([`${FX}does-not-exist/SPRINT-999-fx.md`]);
    expect(r.exitCode).toBe(1);
    expect(r.lines.join("\n")).toContain("authority: file not found:");
  });
});
