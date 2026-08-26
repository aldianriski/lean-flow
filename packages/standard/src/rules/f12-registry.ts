// The F12 registry (SPRINT-087 T3, D7): §12's git-boundary family, registered once. A new rule from a
// LATER family with the same port shape adds ONE `register` call here -- never an edit to
// `../registry.ts`'s dispatch, mirroring `./built-in.ts`'s own convention for S9.
//
// This is a SEPARATE registry from `createBuiltInRegistry` (S9.LOGDIR, `SprintDirPort`), not an
// extension of it -- `./built-in.ts`'s own header names exactly this situation: "A second rule family
// with a DIFFERENT port would need its own registry — not modelled here, since inventing that seam
// before a second port exists is exactly the untested-branch trap this package's own CLAUDE.md warns
// against." That second port now exists (`GitBoundaryPort`), so this file is the seam it predicted,
// not a rewrite of it. D7 (docs/sprint's own G2 record) chose this family specifically so it evaluates
// "against one filesystem port" -- all four of ITS OWN rules share `GitBoundaryPort`, so ONE registry
// (this one) serves the whole family; a THIRD family with a third port shape would need a third one.
//
// Domain layer (V3 §2.1) -- only wiring, no I/O of its own.

import { createRegistry, type Registry } from "../registry.ts";
import { RULE_ID as S12_SECRETS_ID, evaluate as evaluateS12Secrets } from "./s12-secrets.ts";
import { RULE_ID as S12_BACKUPS_ID, evaluate as evaluateS12Backups } from "./s12-backups.ts";
import { RULE_ID as S12_DESIGNSRC_ID, evaluate as evaluateS12Designsrc } from "./s12-designsrc.ts";
import { RULE_ID as S12_GENERATED_ID, evaluate as evaluateS12Generated } from "./s12-generated.ts";
import type { GitBoundaryPort } from "./git-boundary-port.ts";

export function createF12Registry(): Registry<GitBoundaryPort> {
  const registry = createRegistry<GitBoundaryPort>();
  registry.register(S12_SECRETS_ID, evaluateS12Secrets);
  registry.register(S12_BACKUPS_ID, evaluateS12Backups);
  registry.register(S12_DESIGNSRC_ID, evaluateS12Designsrc);
  registry.register(S12_GENERATED_ID, evaluateS12Generated);
  return registry;
}
