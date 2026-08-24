// The `leanflow` CLI entry point.
//
// SPRINT-083 T2 ships the smallest thing that proves the workspace runs: argument parsing and
// two informational flags. No conformance, no QA, no rule evaluation -- those arrive with the
// domain they belong to (EPIC-014 H07-H12), and putting a stub here would create a second place
// where "what the CLI does" is defined.
//
// Clean Architecture direction (V3 §2.1): this file is the outermost layer. It may import
// application packages; nothing may import it. test/architecture/dependency-direction.test.ts
// enforces that mechanically rather than by memory (T3).

/** Adapter-independent description of what one invocation asked for. */
export type Invocation =
  | { kind: "version" }
  | { kind: "help" }
  | { kind: "unknown"; args: readonly string[] };

/**
 * Pure argv -> intent. Separated from `run` so it is testable without a process:
 * the side-effect boundary (V3 §18) starts at the writer, not at the parser.
 */
export function parse(argv: readonly string[]): Invocation {
  if (argv.some((a) => a === "--version" || a === "-v")) return { kind: "version" };
  if (argv.length === 0 || argv.some((a) => a === "--help" || a === "-h")) return { kind: "help" };
  return { kind: "unknown", args: argv };
}

const VERSION_LINE = "leanflow (lean-flow reference engine) -- pre-release, no commands implemented";

const HELP_LINE = [
  VERSION_LINE,
  "",
  "usage: leanflow [--version] [--help]",
  "",
  "The reference engine is being built family by family under a strangler migration",
  "(EPIC-014). Until a family cuts over, the authoritative implementation is Shell:",
  "  sh conformance.sh .      conformance report",
  "  sh scripts/qa-check.sh   the repository gate",
].join("\n");

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
