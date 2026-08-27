// Composes S4.APPEND's two ports (`AdrFamilyPort`, `AdrHistoryPort`) into the single intersection
// type its evaluator takes -- SPRINT-091 T7. A plain function, not a class: mirrors `bindRegistry`'s
// own reasoning in `../registry.ts` -- the pairing happens exactly once, at a call site that already
// holds both concrete ports, never inferred or re-derived downstream. Explicit per-method delegation,
// never an object spread: a class instance's methods live on its prototype, so `{ ...instance }`
// would silently drop every one of them.
//
// Domain layer (V3 §2.1) -- pure wiring, no I/O. `../adapters/fs-adr-append.ts` uses this to compose
// the two REAL adapters; `s4-append.test.ts` uses it to compose the two in-memory fakes.

import type { AdrFamilyPort } from "./adr-family-port.ts";
import type { AdrHistoryPort } from "./adr-history-port.ts";

export function combineAdrAppendPort(
  family: AdrFamilyPort,
  history: AdrHistoryPort,
): AdrFamilyPort & AdrHistoryPort {
  return {
    hasAdrDir: () => family.hasAdrDir(),
    listAdrDirMdFiles: () => family.listAdrDirMdFiles(),
    listStrayAdrPathsUnderDocs: () => family.listStrayAdrPathsUnderDocs(),
    listStrayAdrNamesAtRoot: () => family.listStrayAdrNamesAtRoot(),
    findIndexPath: () => family.findIndexPath(),
    readFile: (path: string) => family.readFile(path),
    isGitRepo: () => history.isGitRepo(),
    isShallowClone: () => history.isShallowClone(),
    revisionsTouching: (path: string) => history.revisionsTouching(path),
    readAtRevision: (revision: string, path: string) => history.readAtRevision(revision, path),
    shortRevision: (revision: string) => history.shortRevision(revision),
  };
}
