// Fixture (review Finding 1, bullet 1): a DECLARE-THEN-BRACE export list, including an aliased
// member. orphanBrace has zero callers; usedBrace is exported under an ALIAS ("renamedUsed") and is
// called under that alias -- proving the checker resolves to the PUBLIC (post-`as`) name, not the
// local declaration name.

function orphanBrace(): number {
  return 1;
}

function usedBrace(): number {
  return 2;
}

export { orphanBrace, usedBrace as renamedUsed };
