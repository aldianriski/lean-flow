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
import { exitCodeFor, type RuleEvaluation } from "../../../packages/standard/src/result.ts";
import { toStandardRule } from "../../../packages/standard/src/spec-reader.ts";
import { outcomeName } from "../../../packages/standard/src/classify.ts";
import { classifySection } from "../../../packages/standard/src/section.ts";
import { readSpecSectionFromDisk, BUNDLED_SPEC_PATH } from "./spec-file-reader.ts";

/** Adapter-independent description of what one invocation asked for. */
export type Invocation =
  | { kind: "version" }
  | { kind: "help" }
  | { kind: "rule"; ruleId: string; repoDir: string }
  | { kind: "section"; section: string; repoDir: string }
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

  const sectionIdx = argv.indexOf("--section");
  if (sectionIdx !== -1 && argv[sectionIdx + 1] !== undefined) {
    return { kind: "section", section: argv[sectionIdx + 1] as string, repoDir: argv[sectionIdx + 2] ?? "." };
  }

  if (argv.length === 0 || argv.some((a) => a === "--help" || a === "-h")) return { kind: "help" };
  return { kind: "unknown", args: argv };
}

const VERSION_LINE =
  "leanflow (lean-flow reference engine) -- pre-release, one rule implemented via --rule";

const HELP_LINE = [
  VERSION_LINE,
  "",
  "usage: leanflow [--version] [--help] [--rule <rule-id> [repo-dir]] [--section <N> [repo-dir]]",
  "",
  "  --rule S9.LOGDIR .   evaluate ONE rule against repo-dir (default: .)",
  "                       the only rule wired so far (EPIC-014 H07's tracer bullet)",
  "  --section 9 .        evaluate every rule spec/STANDARD.md's §9 defines, against repo-dir",
  "                       a TARGETED run -- it never prints a global conformance level, because",
  "                       it never checked every rule the spec defines (SPRINT-087 T4)",
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

/** A bare positive integer, no sign, no leading zero, no decimal -- mirrors `makeRuleId`'s own
 * format-first validation style for `--rule`. Anything else is not even a candidate section number,
 * so it is refused here rather than reaching `Number(...)` and producing `NaN`-shaped garbage. */
const SECTION_ARG_RE = /^[1-9]\d*$/;

/**
 * `--section`'s own case (SPRINT-087 T4), split out for the same reason `runRule` is: one case per
 * `Invocation` kind. A TARGETED run -- it evaluates §`sectionArg`'s rules and NO others (DoD 1), and
 * it never prints a global conformance level (DoD 2): `classifySection`'s `SectionReport` carries no
 * `globalLevel` field today, and is FROZEN (`packages/standard/src/section.ts`) so one cannot be
 * attached after the fact either -- there is nothing here to print even by mistake, and nothing a
 * careless future call site could add. An unreadable section -- malformed argument, or a section
 * number the spec does not define -- fails loudly with a named finding and a non-zero exit, never a
 * silent empty report (DoD 3).
 */
function runSection(sectionArg: string, repoDir: string, write: (s: string) => void): number {
  if (!SECTION_ARG_RE.test(sectionArg)) {
    // RULED TS/Shell divergence (EPIC-014 D2), not an absorbed one: Shell's `read-spec-rules.sh
    // spec/STANDARD.md --section abc` exits 1 (verified live). This exits 2. Deliberate, not a parity
    // defect: exit 1 here is `exitCodeFor`'s frozen EVALUATION-RESULT meaning (ADR-027/ADR-034 --
    // non-zero iff a real FAIL verdict), reused verbatim two lines below for the spec-read failure.
    // A malformed `--section` value never reaches evaluation at all -- it is a CLI-ARGUMENT-PARSING
    // usage error, the same boundary T1 already drew exit 2 for (`not a rule id`, `rule-unimplemented`
    // -- both before this diff). Shell has no separate usage-error channel from its own findings
    // channel, so its single exit-1 vocabulary covers both; this engine's does not, and keeping T1's
    // convention here is what keeps `--rule`'s and `--section`'s CLI-boundary exit codes consistent
    // WITH EACH OTHER, which matters more than matching Shell's exit code for an input Shell treats as
    // just another finding. Recorded so a future H24/H25 parity harness reads this as intentional
    // (ADR-036 §3's own model: a stated divergence, not a silent one it would flag as a regression).
    write(`leanflow: not a section number: ${sectionArg}`);
    return 2;
  }
  const section = Number(sectionArg);

  const specResult = readSpecSectionFromDisk(BUNDLED_SPEC_PATH, section);
  if (!specResult.ok) {
    write(`leanflow: ${specResult.finding} -- ${specResult.message}`);
    return 1; // ok:false -> exit 1 (ADR-034 D3), same as every other SpecReadFail in this engine
  }

  const rules = specResult.rows.map((row) => toStandardRule(row, section, BUNDLED_SPEC_PATH));
  const registry = createBuiltInRegistry();
  const port = new FsSprintDirPort(repoDir);
  const report = classifySection(section, rules, registry, port);

  const evaluations: RuleEvaluation[] = [];
  for (const outcome of report.outcomes) {
    if (outcome.kind === "excluded") {
      write(`note  ${outcome.ruleId} -- ${outcomeName(outcome)}: ${outcome.detail}`);
      continue;
    }
    const { evaluation } = outcome;
    evaluations.push(evaluation);
    const prefix =
      evaluation.verdict === "fail" ? "FAIL " : evaluation.verdict === "pass" ? "PASS " : evaluation.verdict === "gap" ? "gap  " : "note ";
    write(`${prefix} ${evaluation.ruleId} -- ${evaluation.detail}`);
    for (const finding of evaluation.findings) {
      write(`  - ${finding.name}: ${finding.detail}`);
    }
  }

  // DoD 2, deliberately: NO summary/`level:` line follows. `report` (above) carries no field a level
  // could occupy, and this renderer adds none of its own -- a targeted run states what it checked,
  // never a claim about the whole spec it did not (§14; SPRINT-087 T4's whole reason to exist).
  return exitCodeFor({ evaluations });
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
    case "section":
      return runSection(inv.section, inv.repoDir, write);
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
