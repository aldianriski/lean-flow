// The composed real adapter for S4.APPEND's port (`AdrFamilyPort & AdrHistoryPort`) -- one call gets
// a caller both halves, applying `../rules/adr-append-port.ts`'s own `combineAdrAppendPort` (the pure
// wiring) to the two REAL adapters this family needs (`FsAdrFamilyPort`, `FsAdrHistoryPort`).
//
// Adapters layer (V3 §2.1). This is the composition `s4-append-registry.ts`'s own `bindRegistry(...)`
// call (at whatever call site eventually composes the whole run) would pair with -- not performed
// here, since that call site is `apps/cli/src/main.ts`, outside this task's Layers.

import { combineAdrAppendPort } from "../rules/adr-append-port.ts";
import type { AdrFamilyPort } from "../rules/adr-family-port.ts";
import type { AdrHistoryPort } from "../rules/adr-history-port.ts";
import { FsAdrFamilyPort } from "./fs-adr-family.ts";
import { FsAdrHistoryPort } from "./fs-adr-history.ts";

export function createFsAdrAppendPort(repoRoot: string): AdrFamilyPort & AdrHistoryPort {
  return combineAdrAppendPort(new FsAdrFamilyPort(repoRoot), new FsAdrHistoryPort(repoRoot));
}
