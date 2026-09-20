---
sprint: 903
slug: space-token-wordsplit-fixture
owner: Maintainer
last_updated: 2026-09-20
status: active
plan_commit: fixture
close_commit: fixture
update_trigger: fixture -- constructed must-FAIL input for evals/layers-completeness.test.ts, guarding
  the IFS fix in scripts/lib/check-layers-completeness.sh (TASK-355). The oracle iterated
  `for c in $cites_toks` / `for _d in $layers_dirs` UNQUOTED, so a backtick token containing a SPACE
  was word-split and every fragment then failed to match the intact token -- a SILENT FALSE NEGATIVE
  in the exact class this checker exists to catch. `layers_tokens()` extracts backtick spans with no
  character-class restriction, so a space-containing token is legitimate input, not malformed.
  Found by an outside review of the TypeScript port, which did NOT reproduce the bug and therefore
  diverged from the oracle; the owner ruled the ORACLE should be fixed rather than the port made
  bug-compatible. This fixture is what stops that ruling being re-discovered: delete it and the
  regression becomes invisible again. Both T1 and T2 must FAIL, each with its own named finding.
---

# SPRINT-903 — Space-Containing Tokens (constructed fixture, must-FAIL input)

## Plan

### T1 — Declare and cite the same space-containing file `[size: S · risk: low · class: execution · AFK]`
Layers: `my file.md`
Cites: `my file.md`
Depends-on: none

A token appearing in BOTH `Layers:` and `Cites:` is contradictory -- the block claims to touch it and
to merely cite it -- and is its own named FAIL. Before the IFS fix the oracle word-split
`my file.md` into `my` and `file.md`, neither of which matched the intact line under `grep -qxF`, so
the contradiction was silently missed and the block passed.

**Acceptance:** the contradiction is reported, naming the whole token including its space.

**DoD:**
- [ ] `my file.md` is both declared and escaped, and the checker says so

### T2 — Declare a space-containing directory prefix `[size: S · risk: low · class: execution · AFK]`
Layers: `zz dir/`
Depends-on: none

A directory token with a space must cover only paths genuinely under it. Before the IFS fix the
oracle word-split `zz dir/` into `zz`, which then prefix-matched `zzsomething.md` via
`case "$1" in "$_d"*)` and wrongly reported it as directory-covered -- so an undeclared file passed.
`zzsomething.md` is NOT under `zz dir/` and must still be reported as undeclared.

**Acceptance:** `zzsomething.md` is reported as named in prose but absent from `Layers:`.

**DoD:**
- [ ] `zzsomething.md` is produced by this task and is not covered by the declared directory
