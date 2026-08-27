// The S4.APPEND registry (SPRINT-091 T7): §4's one Gated rule, registered on its OWN port shape
// (`AdrFamilyPort & AdrHistoryPort`) -- separate from `./f4-registry.ts` (T6's four Structural rules,
// `AdrFamilyPort` alone), mirroring `./built-in.ts`'s own single-rule convention (S9.LOGDIR) rather
// than `./f12-registry.ts`'s four-rule one, since this family currently has exactly one member.
//
// `f4-registry.test.ts` already proves `createF4Registry().resolve(S4.APPEND)` is `undefined` --
// T6's own registry stays exactly as it is; this file is the seam its own header predicted, not an
// edit to it. A composed whole-run traversal wires this alongside `createF4Registry()` at ITS OWN
// composition site (`apps/cli/src/main.ts`, out of this task's Layers) via one more
// `bindRegistry(...)` call -- reported, not performed, here.
//
// Domain layer (V3 §2.1) -- only wiring, no I/O of its own.

import { createRegistry, type Registry } from "../registry.ts";
import type { AdrFamilyPort } from "./adr-family-port.ts";
import type { AdrHistoryPort } from "./adr-history-port.ts";
import { RULE_ID as S4_APPEND_ID, evaluate as evaluateS4Append } from "./s4-append.ts";

export function createS4AppendRegistry(): Registry<AdrFamilyPort & AdrHistoryPort> {
  const registry = createRegistry<AdrFamilyPort & AdrHistoryPort>();
  registry.register(S4_APPEND_ID, evaluateS4Append);
  return registry;
}
