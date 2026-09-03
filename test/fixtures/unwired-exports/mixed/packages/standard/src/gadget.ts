// Fixture: two exports, one wired (usedGadget, called from apps/cli/src/main.ts) and one unwired
// (orphanWidget, called only from the sibling test file). Retained (TD-012).

export function usedGadget(): number {
  return 1;
}

export function orphanWidget(): number {
  return 2;
}
