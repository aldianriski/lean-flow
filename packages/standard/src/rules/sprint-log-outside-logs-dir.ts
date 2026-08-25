// S9.LOGDIR (spec/STANDARD.md §9 -- Structural, mechanical) -- the tracer bullet rule (SPRINT-087
// T1, EPIC-014 H07). Chosen because it needs NO spec-derived configuration: unlike most of §9-§12's
// checks, its shape is fixed entirely by the Standard's own path convention, so evaluating it is a
// pure function over a directory listing with no vocabulary to parse out of spec/STANDARD.md first --
// cheap and self-contained, the two things a tracer bullet needs most.
//
// Domain layer (V3 §2.1). This module imports only `../model.ts` and `../result.ts` -- no Bun, no
// `node:fs`. The port below is the SEAM (D3): a real Bun adapter
// (`../adapters/fs-sprint-dir.ts`) and an in-memory fake (`./sprint-log-outside-logs-dir.fake.ts`)
// both implement it, and `sprint-log-outside-logs-dir.test.ts` proves this evaluator identical
// against either.
//
// Mirrors scripts/lib/conformance-engine.sh's `assert_S9_LOGDIR`: `docs/sprint/*-log.md` and
// `docs/sprint/*Execution-Log*.md` are an Execution Log parked BESIDE the Plan instead of under
// `docs/sprint/logs/` -- the sprint glob is non-recursive, so a same-directory log gets capped and
// schema-checked as if it were a Plan (§9 - ADR-014).

import { makeRuleId } from "../model.ts";
import type { Finding, RuleEvaluation } from "../result.ts";

export const RULE_ID = makeRuleId("S9.LOGDIR");

/** The named finding this rule raises -- matches the Shell oracle's own vocabulary byte-for-byte. */
export const SPRINT_LOG_OUTSIDE_LOGS_DIR = "sprint-log-outside-logs-dir";

/** Whatever a repository can answer this rule from: docs/sprint/'s own (non-recursive) file listing. */
export interface SprintDirPort {
  /** Whether docs/sprint/ exists at all. */
  hasSprintDir(): boolean;
  /** FILE names directly inside docs/sprint/ -- never a path, never recursive, never a directory. */
  listSprintDirEntries(): readonly string[];
}

/**
 * `docs/sprint/*-log.md` or `docs/sprint/*Execution-Log*.md`, matched by SHAPE -- ending in
 * `"-log.md"`, or containing `"Execution-Log"` AND ending in `".md"` -- never a bare substring search
 * anywhere in the name (L-108's family: `docs/sprint/backlog.md` names a Plan, not a log, and must
 * not match on containing "log").
 */
export function isMisplacedLogName(name: string): boolean {
  if (name.endsWith("-log.md")) return true;
  return name.endsWith(".md") && name.includes("Execution-Log");
}

export function evaluate(port: SprintDirPort): RuleEvaluation {
  if (!port.hasSprintDir()) {
    return {
      ruleId: RULE_ID,
      verdict: "note",
      finding: null,
      detail: "no docs/sprint/ -- nothing to verify",
    };
  }

  const misplaced = port.listSprintDirEntries().filter(isMisplacedLogName).slice().sort();
  if (misplaced.length > 0) {
    const finding: Finding = {
      name: SPRINT_LOG_OUTSIDE_LOGS_DIR,
      detail:
        `an Execution Log beside the Plan instead of under docs/sprint/logs/: ${misplaced.join(", ")}. ` +
        `The sprint glob is non-recursive, so a same-directory log is capped and schema-checked as a ` +
        `Plan (§9 - ADR-014)`,
    };
    return { ruleId: RULE_ID, verdict: "fail", finding, detail: finding.detail };
  }

  return {
    ruleId: RULE_ID,
    verdict: "pass",
    finding: null,
    detail: "no Execution Log sits beside a Plan; logs/ is the only log location",
  };
}
