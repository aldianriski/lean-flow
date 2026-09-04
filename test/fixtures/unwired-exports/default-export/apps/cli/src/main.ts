// Fixture: the ONLY production caller, a default import under an arbitrary local name
// ("AnyLocalName") -- proving the checker matches on the default-import CLAUSE existing for this
// specifier, never on what the importer chose to call it locally. Deliberately never imports
// orphan-default.ts.

import AnyLocalName from "../../../packages/standard/src/used-default.ts";

export function run(): number {
  return new AnyLocalName().value();
}
