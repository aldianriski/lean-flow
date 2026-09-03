// Fixture: the ONLY production caller of gadget.ts's usedGadget. Deliberately never imports
// orphanWidget -- that absence is the fixture.

import { usedGadget } from "../../../packages/standard/src/gadget.ts";

export function run(): number {
  return usedGadget();
}
