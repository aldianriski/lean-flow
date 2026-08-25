// The `leanflow` CLI entry point.
//
// SPRINT-083 T2 shipped the smallest thing that proves the workspace runs: argument parsing and two
// informational flags. SPRINT-087 T1 adds the first rule -- one, `--rule <id> [repo-dir]` -- as the
// tracer bullet through the TS engine (EPIC-014 H07). Not `conformance`/`qa-check` wholesale: those
// stay Shell's until a whole family cuts over (the strangler migration, EPIC-014 D2).
//
// Clean Architecture direction (V3 §2.1): this file is the outermost layer. It may import
// application packages; nothing may import it. test/architecture/dependency-direction.test.ts
// enforces that mechanically rather than by memory (T3).

import { makeRuleId, type RuleId } from "../../../packages/standard/src/model.ts";
import { createBuiltInRegistry } from "../../../packages/standard/src/rules/built-in.ts";
import { FsSprintDirPort } from "../../../packages/standard/src/adapters/fs-sprint-dir.ts";
import { exitCodeFor } from "../../../packages/standard/src/result.ts";

/** Adapter-independent description of what one invocation asked for. */
export type Invocation =
  | { kind: "version" }
  | { kind: "help" }
  | { kind: "rule"; ruleId: string; repoDir: string }
  | { kind: "unknown"; args: readonly string[] };

/**
 * Pure argv -> intent. Separated from `run` so it is testable without a process:
 * the side-effect boundary (V3 §18) starts at the writer, not at the parser.
 */
export function parse(argv: readonly string[]): Invocation {
  if (argv.some((a) => a === "--version" || a === "-v")) return { kind: "version" };

  const ruleIdx = argv.indexOf("--rule");
  if (ruleIdx !== -1 && argv[ruleIdx + 1] !== undefined) {
    return { kind: "rule", ruleId: argv[ruleIdx + 1] as string, repoDir: argv[ruleIdx + 2] ?? "." };
  }

  if (argv.length === 0 || argv.some((a) => a === "--help" || a === "-h")) return { kind: "help" };
  return { kind: "unknown", args: argv };
}

const VERSION_LINE =
  "leanflow (lean-flow reference engine) -- pre-release, one rule implemented via --rule";

const HELP_LINE = [
  VERSION_LINE,
  "",
  "usage: leanflow [--version] [--help] [--rule <rule-id> [repo-dir]]",
  "",
  "  --rule S9.LOGDIR .   evaluate ONE rule against repo-dir (default: .)",
  "                       the only rule wired so far (EPIC-014 H07's tracer bullet)",
  "",
  "The reference engine is being built family by family under a strangler migration",
  "(EPIC-014). Until a family cuts over, the authoritative implementation is Shell:",
  "  sh conformance.sh .      conformance report",
  "  sh scripts/qa-check.sh   the repository gate",
].join("\n");

/**
 * `--rule`'s own case, split out of `run` so the switch stays one line per `Invocation` kind and
 * this file never grows a second rule-dispatch mechanism beside the registry (DoD 2 -- the ONLY
 * thing a new rule touches is `../../../packages/standard/src/rules/built-in.ts`, never here).
 */
function runRule(ruleIdRaw: string, repoDir: string, write: (s: string) => void): number {
  let ruleId: RuleId;
  try {
    ruleId = makeRuleId(ruleIdRaw);
  } catch (e) {
    write(`leanflow: not a rule id: ${ruleIdRaw} (${(e as Error).message})`);
    return 2;
  }

  const evaluation = createBuiltInRegistry().dispatch(ruleId, new FsSprintDirPort(repoDir));
  if (!evaluation) {
    write(`leanflow: rule-unimplemented -- no evaluator registered for ${ruleId}`);
    return 2;
  }

  const prefix = evaluation.verdict === "fail" ? "FAIL " : evaluation.verdict === "pass" ? "PASS " : "note ";
  write(`${prefix} ${ruleId} -- ${evaluation.detail}`);
  // One line PER finding -- mirrors the Shell oracle's own one-`bad()`-per-offense loop, so a
  // consumer grepping the CLI's output for the named finding sees the same COUNT Shell would.
  for (const finding of evaluation.findings) {
    write(`  - ${finding.name}: ${finding.detail}`);
  }
  return exitCodeFor({ evaluations: [evaluation] });
}

/**
 * Render an invocation. Returns the exit code rather than calling `process.exit`, so a test can
 * assert the code without terminating the runner.
 */
export function run(inv: Invocation, write: (s: string) => void): number {
  switch (inv.kind) {
    case "version":
      write(VERSION_LINE);
      return 0;
    case "help":
      write(HELP_LINE);
      return 0;
    case "rule":
      return runRule(inv.ruleId, inv.repoDir, write);
    case "unknown":
      write(`leanflow: unknown argument(s): ${inv.args.join(" ")}`);
      write(HELP_LINE);
      return 2;
  }
}

// `import.meta.main` is true only when this file is the entry point, so importing it from a test
// does not execute the CLI.
if (import.meta.main) {
  const code = run(parse(Bun.argv.slice(2)), (s) => console.log(s));
  process.exit(code);
}
