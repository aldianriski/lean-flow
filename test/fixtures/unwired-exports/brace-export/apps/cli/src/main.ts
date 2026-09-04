// Fixture: the ONLY production caller, using the ALIASED public name (renamedUsed), never the local
// declaration name (usedBrace). Deliberately never imports orphanBrace.

import { renamedUsed } from "../../../packages/standard/src/brace.ts";

export function run(): number {
  return renamedUsed();
}
