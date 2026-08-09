---
sprint: 900
slug: cites-contradiction
owner: Maintainer
last_updated: 2026-08-09
status: active
plan_commit: fixture
close_commit: fixture
update_trigger: fixture -- must-FAIL input for evals/run-layers-completeness-fixtures.sh (SPRINT-049
  T3); constructed, not a real sprint
---

# SPRINT-900 — Cites/Layers contradiction (constructed fixture, must-FAIL input)

<!-- CONSTRUCTED, not a recorded incident -- labeled as such rather than claimed as real (the
     convention this fixture directory already follows for depends-on-omitted.md).

     This is the escape's own abuse case. `Cites:` exists so an author can say "this filename is
     mentioned, not touched". The failure mode it invites is using it as a blanket silencer: list a
     file in BOTH Layers: and Cites: and, without this check, the Cites: entry would suppress every
     complaint about a file the block simultaneously claims to modify. The two claims are
     contradictory, so the block is asking the gate to have it both ways.

     Must FAIL by its named finding. A silent pass here means the escape has become the false
     negative it was added to avoid (L-058: a gate's worst failure is the silent false-negative). -->

## Plan

### T1 — Touch a file and escape it at the same time `[size: S · risk: low · class: execution · AFK]`
Layers: `scripts/qa-check.sh` · `docs/QA.md`
Depends-on: none
Cites: `docs/QA.md`

`docs/QA.md` is declared as touched and escaped as merely cited in the same block. Exactly one of
those can be true.

**Acceptance:** the checker names the contradiction rather than silently honouring the escape.

**DoD:**
- [ ] The leg inventory in `docs/QA.md` is updated
