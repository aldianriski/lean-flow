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
import { createF4Registry } from "../../../packages/standard/src/rules/f4-registry.ts";
import { createS4AppendRegistry } from "../../../packages/standard/src/rules/s4-append-registry.ts";
import { FsSprintDirPort } from "../../../packages/standard/src/adapters/fs-sprint-dir.ts";
import { FsGitBoundaryPort } from "../../../packages/standard/src/adapters/fs-git-boundary.ts";
import { FsAdrFamilyPort } from "../../../packages/standard/src/adapters/fs-adr-family.ts";
import { createFsAdrAppendPort } from "../../../packages/standard/src/adapters/fs-adr-append.ts";
import { bindRegistry } from "../../../packages/standard/src/registry.ts";
import { exitCodeFor, type RuleEvaluation } from "../../../packages/standard/src/result.ts";
import { sectionNumberOfRuleId, toStandardRule } from "../../../packages/standard/src/spec-reader.ts";
import { outcomeName } from "../../../packages/standard/src/classify.ts";
import { classifyAll, composeFamilies } from "../../../packages/standard/src/traverse.ts";
import { attachLevel } from "../../../packages/standard/src/level.ts";
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
  "                       gap, never a silent skip (SPRINT-091 T3), and closes with a global",
  "                       'level:' line, §14's own priority ladder (SPRINT-091 T11)",
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
 *
 * `dispatchRule` defaults to the real, production wiring (`createBuiltInRegistry` bound to a real
 * `FsSprintDirPort`) -- the optional parameter exists ONLY so `main.test.ts` can inject a fake
 * evaluation through this SAME render path (SPRINT-091 T11, DoD 3): no evaluator anywhere in
 * `packages/standard/src` emits a `hold` verdict yet (T4's own review), so proving this site renders
 * `hold` distinctly from `note` needs a seam here, never a change to `packages/standard/src` (outside
 * this task's Layers).
 */
export function runRule(
  ruleIdRaw: string,
  repoDir: string,
  write: (s: string) => void,
  dispatchRule: (ruleId: RuleId, repoDir: string) => RuleEvaluation | undefined = (id, dir) =>
    createBuiltInRegistry().dispatch(id, new FsSprintDirPort(dir)),
): number {
  let ruleId: RuleId;
  try {
    ruleId = makeRuleId(ruleIdRaw);
  } catch (e) {
    write(`leanflow: not a rule id: ${ruleIdRaw} (${(e as Error).message})`);
    return 2;
  }

  const evaluation = dispatchRule(ruleId, repoDir);
  if (!evaluation) {
    write(`leanflow: rule-unimplemented -- no evaluator registered for ${ruleId}`);
    return 2;
  }

  // SPRINT-091 T11 (T4 review, finding C): `hold` joined `Verdict` in T4 but this ternary fell
  // through it to the literal "note ", collapsing the hold-vs-note distinction result.ts's own
  // `exitCodeFor` doc protects. `hold` now renders as its OWN word, distinct from both `note` and
  // `fail` -- never moving the exit code (below), exactly as `fail` alone does.
  const prefix =
    evaluation.verdict === "fail"
      ? "FAIL "
      : evaluation.verdict === "pass"
        ? "PASS "
        : evaluation.verdict === "hold"
          ? "HOLD "
          : "note ";
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
 * built-in.ts`'s `createBuiltInRegistry`, `f12-registry.ts`'s `createF12Registry`, `f4-registry.ts`'s
 * `createF4Registry`, `s4-append-registry.ts`'s `createS4AppendRegistry`) -- this function only PAIRS
 * each registry with its own concrete port and hands the result to `bindRegistry` (`registry.ts`),
 * then `composeFamilies` (`traverse.ts`) merges them into ONE dispatch function. Appending a family
 * here is the one place EPIC-014's remaining families (F5/F2/F1/F7) plug in for BOTH invocation
 * shapes; nothing in `traverse.ts`/`classify.ts`, and neither call site below, gains a new case for it.
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
 *
 * SPRINT-091 T12: the two §4 registries T6/T7 built (a third and fourth family, alongside S9's and
 * S12's) join here -- the exact wiring both `s4-append-registry.ts`'s and `fs-adr-append.ts`'s own
 * headers predicted at this exact call site ("reported, not performed, here" / "not performed here,
 * since that call site is `apps/cli/src/main.ts`"). Before this task those two registries were built,
 * tested, and reachable from NOWHERE a real invocation could dispatch through -- `--section 4` and the
 * flagless run both answered `rule-unimplemented` for all five §4 mechanical rules, and because
 * `level.ts`'s `computeLevel` treats `gap` as "this engine's own coverage, not a repository finding"
 * (its own comment, above) and `continue`s past it untouched, a repo carrying a REAL §4 violation --
 * see `evals/fixtures/adr-family/index-missing-row/`, the retained motivating fixture (L-166) -- was
 * laundered straight through to the top conformance level instead of being counted as a Structural
 * FAIL. Two more `bindRegistry(...)` entries close that gap; `createF4Registry()` pairs with
 * `FsAdrFamilyPort` (the tree-only §4 port T7's own header names as unbuilt-but-scoped-in-T7, then
 * built there), `createS4AppendRegistry()` pairs with `createFsAdrAppendPort` (the combined
 * `AdrFamilyPort & AdrHistoryPort` S4.APPEND alone needs, since it is §4's one Gated/history-reading
 * rule -- T7's own module header). Both constructors are reused verbatim, unmodified, exactly as
 * `createBuiltInRegistry`/`createF12Registry` are above -- this function's job is composition only.
 */
function composedDispatch(repoDir: string): (id: RuleId) => RuleEvaluation | undefined {
  return composeFamilies([
    bindRegistry(createBuiltInRegistry(), new FsSprintDirPort(repoDir)),
    bindRegistry(createF12Registry(), new FsGitBoundaryPort(repoDir, BUNDLED_SPEC_PATH)),
    bindRegistry(createF4Registry(), new FsAdrFamilyPort(repoDir)),
    bindRegistry(createS4AppendRegistry(), createFsAdrAppendPort(repoDir)),
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
 *
 * `buildDispatch` defaults to the real `composedDispatch` above -- the optional parameter exists ONLY
 * so `main.test.ts` can inject a fake dispatch through this SAME render path (SPRINT-091 T11, DoD 3:
 * a `hold` verdict, which no evaluator anywhere emits yet). Injecting a dispatch, never a level, keeps
 * this seam orthogonal to DoD 2 above -- see the `hold`-under-a-seeded-dispatch regression test in
 * `main.test.ts`, which proves DoD 2 holds even when a `hold` outcome IS present.
 */
export function runSection(
  sectionArg: string,
  repoDir: string,
  write: (s: string) => void,
  buildDispatch: (repoDir: string) => (id: RuleId) => RuleEvaluation | undefined = composedDispatch,
): number {
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
  const report = classifyAll(rules, buildDispatch(repoDir));

  const evaluations: RuleEvaluation[] = [];
  for (const outcome of report.outcomes) {
    if (outcome.kind === "excluded") {
      write(`note  ${outcome.ruleId} -- ${outcomeName(outcome)}: ${outcome.detail}`);
      continue;
    }
    const { evaluation } = outcome;
    evaluations.push(evaluation);
    // SPRINT-091 T11 (T4 review, finding C): `hold` rendered identically to `note` here before this
    // diff -- see `runRule`'s own comment above for why that matters and result.ts's `exitCodeFor` doc
    // for why `hold` still never moves the exit code below.
    const prefix =
      evaluation.verdict === "fail"
        ? "FAIL "
        : evaluation.verdict === "pass"
          ? "PASS "
          : evaluation.verdict === "hold"
            ? "HOLD "
            : evaluation.verdict === "gap"
              ? "gap  "
              : "note ";
    write(`${prefix} ${evaluation.ruleId} -- ${evaluation.detail}`);
    for (const finding of evaluation.findings) {
      write(`  - ${finding.name}: ${finding.detail}`);
    }
  }

  // DoD 2, deliberately: NO summary/`level:` line follows. `report` (above) carries no field a level
  // could occupy, and this renderer adds none of its own -- a targeted run states what it checked,
  // never a claim about the whole spec it did not (§14; SPRINT-087 T4's whole reason to exist). This
  // holds even when a `hold` outcome is present above (T11) -- `report` is STILL a level-less
  // `TraversalReport` (traverse.ts's own frozen guarantee), and `hold` only changed how ONE line
  // renders, never what this function computes or attaches.
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
 * A `level:` line NOW closes this run (SPRINT-091 T11 -- T4's `level.ts` landed the arithmetic, but
 * nothing called it until this task; L-020). `report` (`classifyAll`'s own `TraversalReport`) stays
 * level-less -- `attachLevel(rules, report)` builds a SEPARATE, sibling `FullRunReport` (level.ts's
 * own contract: same `rules`/`report` pair that produced each other) and ONLY this function calls it;
 * `runSection` above never does (DoD 2 -- the partial path stays level-free by construction, not
 * convention: `attachLevel` is simply never reached from there). Printed on its own, closing line,
 * anchored so a reader/test finds it via `trimStart().startsWith("level:")` -- never a substring
 * match: per-rule lines above can themselves contain "level:" mid-sentence (an excluded rule's own
 * wording, classify.ts), which is the exact L-108 shape T4 hit and fixed the same way in level.test.ts.
 * `buildDispatch` defaults to the real `composedDispatch` -- see `runSection`'s own comment for why
 * the seam exists (SPRINT-091 T11, DoD 3).
 */
export function runFull(
  repoDir: string,
  write: (s: string) => void,
  buildDispatch: (repoDir: string) => (id: RuleId) => RuleEvaluation | undefined = composedDispatch,
): number {
  const specResult = readSpecAllFromDisk(BUNDLED_SPEC_PATH);
  if (!specResult.ok) {
    write(`leanflow: ${specResult.finding} -- ${specResult.message}`);
    return specReadExitCode(specResult);
  }

  const rules = specResult.rows.map((row) => toStandardRule(row, sectionNumberOfRuleId(row.id), BUNDLED_SPEC_PATH));

  const report = classifyAll(rules, buildDispatch(repoDir));

  const evaluations: RuleEvaluation[] = [];
  for (const outcome of report.outcomes) {
    if (outcome.kind === "excluded") {
      write(`note  ${outcome.ruleId} -- ${outcomeName(outcome)}: ${outcome.detail}`);
      continue;
    }
    const { evaluation } = outcome;
    evaluations.push(evaluation);
    // SPRINT-091 T11 (T4 review, finding C): same fix as `runRule`/`runSection` -- `hold` gets its own
    // word, never falling through to `note`.
    const prefix =
      evaluation.verdict === "fail"
        ? "FAIL "
        : evaluation.verdict === "pass"
          ? "PASS "
          : evaluation.verdict === "hold"
            ? "HOLD "
            : evaluation.verdict === "gap"
              ? "gap  "
              : "note ";
    write(`${prefix} ${evaluation.ruleId} -- ${evaluation.detail}`);
    for (const finding of evaluation.findings) {
      write(`  - ${finding.name}: ${finding.detail}`);
    }
  }

  const full = attachLevel(rules, report);
  write(`level: ${full.level}`);

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
