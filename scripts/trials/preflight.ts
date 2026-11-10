// Caller supplies: deny rules JSON, brief text and a gate command (shell text or a JSON argv array).
import { spawnSync } from "node:child_process";
import { args, cli, readJson, readText, required, run } from "./lib";

const usage = "usage: bun --no-env-file scripts/trials/preflight.ts --deny-file F --brief F --gate-cmd C";
export function preflight(deny: string[], brief: string, gate: string): string[] {
  const findings: string[] = [];
  if (!Array.isArray(deny) || deny.some(x => typeof x !== "string")) throw new Error("deny file must be a string array");
  if (deny.some(rule => /\/\/[A-Za-z]:\//.test(rule))) findings.push("DENY_PATH_FORM");
  // Scan command positions (line/inline-code starts and shell separators), not prose mentioning Python.
  if (/(?:^|[`\n;&|])\s*(?:\$\s*)?python(?:3)?(?:[ \t]+-(?=[ \t]|$))?\s*(?=$|[`\n;&|]|<<)/m.test(brief))
    findings.push("CMD_REPL_OR_BLOCKED: python");
  if (/(?:^|[`\n;&|])\s*(?:\$\s*)?sleep\s+\d+(?:\.\d+)?\b/m.test(brief))
    findings.push("CMD_REPL_OR_BLOCKED: sleep");
  let code: number, output: string;
  if (gate.trim().startsWith("[")) {
    const command = JSON.parse(gate);
    if (!Array.isArray(command) || !command.length || command.some(x => typeof x !== "string"))
      throw new Error("gate argv must be a nonempty string array");
    const r = run(command); code = r.code; output = r.out + r.err;
  } else {
    const r = spawnSync(gate, { shell: true, encoding: "utf8", windowsHide: true });
    code = r.status ?? 1; output = (r.stdout ?? "") + (r.stderr ?? "");
  }
  const counts = [...output.matchAll(/(?:QA-CHECK:|bun test:)\s*(\d+) pass, (\d+) fail/g)];
  const green = counts.length ? counts.every(m => Number(m[2]) === 0)
    : /^(?:[\w -]+: )?PASS\s*$/m.test(output);
  if (code !== 0 || !green) findings.push("BASELINE_NOT_GREEN");
  return findings;
}
if (import.meta.main) cli(usage, () => {
  const a = args(usage);
  const findings = preflight(readJson(required(a, "--deny-file")), readText(required(a, "--brief")), required(a, "--gate-cmd"));
  console.log(findings.length ? findings.join("\n") : "preflight: PASS");
  process.exitCode = findings.length ? 1 : 0;
});
