// The default registry: every rule this package ships, registered once. A new rule (H07-H12 and
// beyond) adds ONE `register` call here -- never an edit to `../registry.ts`'s dispatch, and never a
// new `case` in whatever calls this (apps/cli/src/main.ts, DoD 2).
//
// Domain layer (V3 §2.1) -- only wiring, no I/O of its own.

import { createRegistry, type Registry } from "../registry.ts";
import { RULE_ID as SPRINT_LOG_OUTSIDE_LOGS_DIR_ID, evaluate as evaluateSprintLogOutsideLogsDir, type SprintDirPort } from "./sprint-log-outside-logs-dir.ts";

// All of today's rules happen to share one port shape (SprintDirPort). A second rule family with a
// DIFFERENT port would need its own registry -- not modelled here, since inventing that seam before a
// second port exists is exactly the untested-branch trap this package's own CLAUDE.md warns against.
export function createBuiltInRegistry(): Registry<SprintDirPort> {
  const registry = createRegistry<SprintDirPort>();
  registry.register(SPRINT_LOG_OUTSIDE_LOGS_DIR_ID, evaluateSprintLogOutsideLogsDir);
  return registry;
}
