// Fixture shaped exactly like packages/standard/src/spec-reader.ts's real marksInStandard: the
// exported symbol's own name appears three times in doc-comment prose ABOUT orphanFn, above orphanFn,
// and once more in a second comment referencing orphanFn again -- four total mentions in its own
// file, zero of them a real import anywhere else. A naive "is orphanFn mentioned anywhere" grep would
// read this file as its own caller; the checker must not.

/**
 * orphanFn is unused elsewhere. See orphanFn's own doc for details on orphanFn's contract.
 */
export function orphanFn(): number {
  return 3;
}

// One more mention of orphanFn, in a trailing comment, for a fourth total -- still not a caller.
