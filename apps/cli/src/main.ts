// The `leanflow` CLI entry point.
//
// SPRINT-083 T2 shipped the smallest thing that proves the workspace runs: argument parsing and two
// informational flags. SPRINT-087 T1 adds the first rule -- one, `--rule <id> [repo-dir]` -- as the
// tracer bullet through the TS engine (EPIC-014 H07). SPRINT-091 T3 adds the flagless FULL run --
// `leanflow <repo-dir>`, no flag -- mirroring `sh conformance.sh <repo-dir>`'s own one-argument
// invocation shape (EPIC-014 H12). Not `qa-check` wholesale: that stays Shell's until every family
// cuts over (the strangler migration, EPIC-014 D2).
//
// Clean Architecture direction (V3 §2.1): this file is the outermost layer. It may import
// application packages; nothing may import it. test/architecture/dependency-direction.test.ts
// enforces that mechanically rather than by memory (T3).

import { makeRuleId, type RuleId } from "../../../packages/standard/src/model.ts";
import { createBuiltInRegistry } from "../../../packages/standard/src/rules/built-in.ts";
import { createF12Registry } from "../../../packages/standard/src/rules/f12-registry.ts";
import { FsSprintDirPort } from "../../../packages/standard/src/adapters/fs-sprint-dir.ts";
import { FsGitBoundaryPort } from "../../../packages/standard/src/adapters/fs-git-boundary.ts";
import { bindRegistry } from "../../../packages/standard/src/registry.ts";
import { exitCodeFor, type RuleEvaluation } from "../../../packages/standard/src/result.ts";
import { sectionNumberOfRuleId, toStandardRule } from "../../../packages/standard/src/spec-reader.ts";
import { outcomeName } from "../../../packages/standard/src/classify.ts";
import { classifyAll, composeFamilies } from "../../../packages/standard/src/traverse.ts";
import { readSpecAllFromDisk, readSpecSectionFromDisk, BUNDLED_SPEC_PATH } from "./spec-file-reader.ts";

/** Adapter-independent description of what one invocation asked for. */
export type Invocation =
  | { kind: "version" }
  | { kind: "help" }
  | { kind: "rule"; ruleId: string; repoDir: string }
  | { kind: "section"; section: string; repoDir: string }
  | { kind: "full"; repoDir: string }
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

  // The flagless full run (T3): exactly ONE argument, and it is not itself a flag -- mirrors
  // `sh conformance.sh <repo-dir>`'s own single positional argument. Two or more arguments (e.g.
  // `conformance .`, an existing test's own case) stay `unknown`: only a lone, non-flag token is
  // unambiguous enough to read as "the repo to check", never a typo'd or partial flag invocation.
  if (argv.length === 1 && argv[0] !== undefined && !argv[0].startsWith("-")) {
    return { kind: "full", repoDir: argv[0] };
  }

  if (argv.length === 0 || argv.some((a) => a === "--help" || a === "-h")) return { kind: "help" };
  return { kind: "unknown", args: argv };
}

const VERSION_LINE =
  "leanflow (lean-flow reference engine) -- pre-release, whole-spec traversal via a flagless invocation";

const HELP_LINE = [
  VERSION_LINE,
  "",
  "usage: leanflow [--version] [--help] [--rule <rule-id> [repo-dir]] [--section <N> [repo-dir]] [repo-dir]",
  "",
  "  --rule S9.LOGDIR .   evaluate ONE rule against repo-dir (default: .)",
  "  --section 9 .        evaluate every rule spec/STANDARD.md's §9 defines, against repo-dir",
  "                       a TARGETED run -- it never prints a global conformance level, because",
  "                       it never checked every rule the spec defines (SPRINT-087 T4)",
  "  .                    (no flag) evaluate EVERY rule the spec defines, dispatched by its §14",
  "                       mark -- a rule with no evaluator registered anywhere reports a named",
  "                       gap, never a silent skip (SPRINT-091 T3). No global level yet (T4)",
  "",
  "The reference engine is being built family by family under a strangler migration",
  "(EPIC-014). Until every family cuts over, the authoritative implementation is Shell:",
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
 * The process-boundary exit mapping (SPRINT-087 T5; ADR-027/ADR-034 D3): 0 for `ok:true` -- INCLUDING
 * the legitimate zero-row §8 case, since `SpecReadOk.rows` can be `[]` and still be a success; this
 * function never looks at `rows`, so it cannot re-introduce the absence-vs-emptiness confusion
 * `SpecReadResult`'s own TYPE already refuses (a `SpecReadFail` carries no `rows` field to mistake for
 * one) -- 1 for `ok:false`, regardless of WHICH `SpecFinding` string it carries.
 *
 * Checks only the `.ok` discriminant, never `.finding`: exhaustive over
 * `packages/standard/src/spec-reader.ts`'s `SpecFinding` union (`spec-not-found`,
 * `spec-table-unreadable`, `spec-counts-unreadable`, `section-rows-mismatch`, `marks-table-unreadable`)
 * BY CONSTRUCTION, not by enumerating cases that could fall out of sync as that union grows -- a sixth
 * finding added tomorrow needs no edit here. Typed structurally (`{ readonly ok: boolean }`) rather than
 * importing `SpecReadResult`/`MarksReadResult` by name, so the same one rule covers both result shapes
 * that module exports, not two copies of it. TD-101: nothing here type-checks TypeScript, so this
 * exhaustiveness claim is asserted at RUNTIME in main.test.ts against all five current `SpecFinding`
 * values (via the domain's own constructors/fixtures, never a hand-rolled literal) plus both
 * `SpecReadOk` shapes -- never left as a type-only guarantee.
 *
 * SPRINT-087 T5 revise (reviewer finding 2): `result.ok ? 0 : 1` treats ANY truthy `.ok` as success --
 * `{ ok: "false" }` (a truthy STRING that reads as false) would have silently exited 0, the exact
 * false-assurance shape this boundary exists to prevent. The `{ readonly ok: boolean }` annotation
 * enforces nothing at runtime (TD-101, again), so the guard has to. `=== true` makes only the strict
 * boolean `true` a pass; every other shape -- a truthy non-boolean, a falsy non-boolean, `{}` with no
 * `ok` at all -- fails SAFE to exit 1 rather than passing on a technicality. Unreachable through any real
 * constructor today (every one returns a literal boolean), but asserted anyway in main.test.ts so the
 * guard is proven, not decorative -- a future reader cannot tell "defensive" from "dead" without a test
 * that would redden if the check were removed.
 */
export function specReadExitCode(result: { readonly ok: boolean }): 0 | 1 {
  return result.ok === true ? 0 : 1;
}

/** A bare positive integer, no sign, no leading zero, no decimal -- mirrors `makeRuleId`'s own
 * format-first validation style for `--rule`. Anything else is not even a candidate section number,
 * so it is refused here rather than reaching `Number(...)` and producing `NaN`-shaped garbage. */
const SECTION_ARG_RE = /^[1-9]\d*$/;

/**
 * Builds ONE whole-repository dispatch function spanning every registered family, for a given
 * `repoDir` (SPRINT-091 T3 introduced this composition inside `runFull`; T9 lifts it out so
 * `runSection` dispatches through the SAME list rather than a second, narrower one). Family
 * registration stays at EACH family's own call site (`../../../packages/standard/src/rules/
 * built-in.ts`'s `createBuiltInRegistry`, `f12-registry.ts`'s `createF12Registry`) -- this function
 * only PAIRS each registry with its own concrete port and hands the result to `bindRegistry`
 * (`registry.ts`), then `composeFamilies` (`traverse.ts`) merges them into ONE dispatch function.
 * Appending a family here is the one place EPIC-014's remaining families (F5/F2/F1/F7) plug in for
 * BOTH invocation shapes; nothing in `traverse.ts`/`classify.ts`, and neither call site below, gains
 * a new case for it.
 *
 * `FsGitBoundaryPort`'s second argument is the spec its §12 rules read PROSE from (allowed asset
 * dirs, generated-file classes) -- defaults to `<repoDir>/spec/STANDARD.md` (this repo's own gate,
 * checking itself), which does not exist for an arbitrary repo-dir under test. No ADR governs this
 * specific placement (checked; none does -- see the T3 retry report). The convention is
 * `check-attestation.sh`'s (SPRINT-074 T2), reused verbatim by `conformance-engine.sh`'s own header
 * ("the engine resolves spec/STANDARD.md relative to ITSELF, not to the repo under test... which
 * has no reason to vendor a copy of the standard it is being measured against") and by this
 * engine's own spec reader (`apps/cli/src/spec-file-reader.ts`'s `BUNDLED_SPEC_PATH`) -- the Standard
 * ships beside the engine, never vendored by the repo being measured.
 */
function composedDispatch(repoDir: string): (id: RuleId) => RuleEvaluation | undefined {
  return composeFamilies([
    bindRegistry(createBuiltInRegistry(), new FsSprintDirPort(repoDir)),
    bindRegistry(createF12Registry(), new FsGitBoundaryPort(repoDir, BUNDLED_SPEC_PATH)),
  ]);
}

/**
 * `--section`'s own case (SPRINT-087 T4; SPRINT-091 T9 wires it through `composedDispatch` above --
 * the SAME composed multi-family dispatch `runFull` uses -- rather than `classifySection`
 * (`packages/standard/src/section.ts`), which is single-port and would leave `createF12Registry`'s
 * evaluators unreachable exactly as Round 10/11 of this sprint's Execution Log found: `--section 12`
 * answering `rule-unimplemented` for all four §12 rules while Shell evaluated them for real). Split
 * out for the same reason `runRule` is: one case per `Invocation` kind. A TARGETED run -- it
 * evaluates §`sectionArg`'s rules and NO others (DoD 1: `rules` below is narrowed to `section`'s own
 * rows before dispatch ever runs), and it never prints a global conformance level (DoD 2):
 * `classifyAll`'s `TraversalReport` (`traverse.ts`) carries no `globalLevel` field today, and is
 * FROZEN so one cannot be attached after the fact either -- the same structural guarantee
 * `classifySection`'s `SectionReport` gave, not a property of this renderer choosing not to print
 * one. This renderer reads only `report.outcomes`, which both report shapes carry identically, so
 * swapping the underlying classifier changes nothing else here. An unreadable section -- malformed
 * argument, or a section number the spec does not define -- fails loudly with a named finding and a
 * non-zero exit, never a silent empty report (DoD 3).
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
    return specReadExitCode(specResult); // ok:false -> exit 1 (ADR-034 D3), via the shared mapping (T5)
  }

  const rules = specResult.rows.map((row) => toStandardRule(row, section, BUNDLED_SPEC_PATH));
  const report = classifyAll(rules, composedDispatch(repoDir));

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
 * The flagless FULL run (SPRINT-091 T3, EPIC-014 H12): `leanflow <repo-dir>`, no `--rule`/`--section`
 * -- every rule the parser admits, across every section, dispatched by its §14 mark. Mirrors
 * `sh conformance.sh <repo-dir>`'s own invocation shape (a single positional repo-dir, no flag), so a
 * flagless TS invocation and a flagless Shell one ask the IDENTICAL question of the IDENTICAL
 * repository -- the parity oracle DoD 1 names.
 *
 * Dispatches through `composedDispatch` (above `runSection`, SPRINT-091 T9) -- the SAME
 * whole-repository, multi-family composition `runSection` now uses too, never a second list (DoD 3
 * of both tasks: appending a family is the one place EPIC-014's remaining families plug in).
 *
 * No `level:` line here -- T4 owns full-run level arithmetic, deliberately split out (EPIC-014 H12).
 * `TraversalReport` carries no field a level could occupy (`traverse.ts`, frozen the same way
 * `section.ts`'s `SectionReport` is) and this renderer prints none of its own: a rule with no
 * evaluator registered ANYWHERE prints a named `gap` (DoD 2), never a level-bearing verdict.
 */
function runFull(repoDir: string, write: (s: string) => void): number {
  const specResult = readSpecAllFromDisk(BUNDLED_SPEC_PATH);
  if (!specResult.ok) {
    write(`leanflow: ${specResult.finding} -- ${specResult.message}`);
    return specReadExitCode(specResult);
  }

  const rules = specResult.rows.map((row) => toStandardRule(row, sectionNumberOfRuleId(row.id), BUNDLED_SPEC_PATH));

  const report = classifyAll(rules, composedDispatch(repoDir));

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
    case "full":
      return runFull(inv.repoDir, write);
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
