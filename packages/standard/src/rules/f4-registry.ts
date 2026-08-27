// The F4 registry (SPRINT-091 T6): §4's four TREE-answerable ADR rules, registered once. A new rule
// from a LATER family with the same port shape adds ONE `register` call here -- never an edit to
// `../registry.ts`'s dispatch, mirroring `./f12-registry.ts`'s own convention.
//
// This is a SEPARATE registry from `createBuiltInRegistry` (S9, `SprintDirPort`) and from
// `createF12Registry` (S12, `GitBoundaryPort`) -- a third family, a third port shape
// (`AdrFamilyPort`), its own registry, per `built-in.ts`'s own predicted seam.
//
// S4.APPEND is DELIBERATELY ABSENT: it is §4's only Gated rule (history, not tree) and needs a
// different port entirely -- T7's job (Depends-on: T6). Dispatching S4.APPEND against this registry
// resolves to `undefined` (a GAP at the classification layer, per `classify.ts`'s own `gap()`), never
// a silent pass -- proved below alongside the whole-section proof.
//
// Domain layer (V3 §2.1) -- only wiring, no I/O of its own.

import { createRegistry, type Registry } from "../registry.ts";
import type { AdrFamilyPort } from "./adr-family-port.ts";
import { RULE_ID as S4_ONEFILE_ID, evaluate as evaluateS4Onefile } from "./s4-onefile.ts";
import { RULE_ID as S4_INDEX_ID, evaluate as evaluateS4Index } from "./s4-index.ts";
import { RULE_ID as S4_SECTIONS_ID, evaluate as evaluateS4Sections } from "./s4-sections.ts";
import { RULE_ID as S4_NEGATIVE_ID, evaluate as evaluateS4Negative } from "./s4-negative.ts";

export function createF4Registry(): Registry<AdrFamilyPort> {
  const registry = createRegistry<AdrFamilyPort>();
  registry.register(S4_ONEFILE_ID, evaluateS4Onefile);
  registry.register(S4_INDEX_ID, evaluateS4Index);
  registry.register(S4_SECTIONS_ID, evaluateS4Sections);
  registry.register(S4_NEGATIVE_ID, evaluateS4Negative);
  return registry;
}
