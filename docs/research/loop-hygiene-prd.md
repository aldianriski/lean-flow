---
owner: Maintainer
last_updated: 2026-07-17
status: current
id: loop-hygiene-prd
tags: [process, docs, tooling]
domain: governance
related: [loop-mechanics-audit, trigger-accuracy-audit, okf-adoption]
---

# Process Loop Engineering & Docs Hygiene — PRD

> Source: full-corpus audit 2026-07-17 (4 parallel passes: loop-core skills · support skills ·
> docs corpus · cross-cutting consistency). Evidence register split out below. **Since applied** —
> the workstreams shipped across later sprints; read this as a record, not as a proposal (SPRINT-058 T1).

## Problem Statement

The loop's bones are healthy — version lockstep holds, sprint archival is clean, CHANGELOG
rotation works, L-NNN promotion fires, all 14 skills are under the line cap. But a whole class
of rules is **written without a matcher**: a hygiene rule exists in prose (§10/§11, CONTEXT,
DOCS_Guide) while no skill step, checklist line, or lint actually targets it. The result the
maintainer feels daily:

1. **TODO.md accumulates the past** — 13/109 lines (12%) are shipped-task tombstones that §11
   says to delete, but §11's delete rule matches a *different string format* than what close
   actually writes, so the sweep never fires. A "SPRINT-016 active" pointer survived a full
   close cycle because close only clears the § Active Sprint header, never Backlog prose.
2. **The mechanical gate gives false confidence** — `qa-check.sh` passes 47/47 while README's
   footer is 5 minor versions stale (a *recurrence* of the exact L-015 incident), CLAUDE.md has
   no ownership header, and TD-008 is 6 sprints past its 3-sprint re-review bar. The checker is
   green precisely where the complaints live, because those drift classes aren't in its scope.
3. **Claimed wiring that never fires** — bug-intake is specced in CONTEXT.md but absent from
   triage's procedure; promote never filters `state: ready`; prime never routes to `/triage`;
   `/fork` is advertised and wired nowhere. (The L-020 "shipped ≠ wired" pattern, again.)
4. **Knowledge-id integrity is broken** — pruned `L-NNN` ids get reused: shipped skills cite
   L-016/L-017 meaning the *original* learnings, but those ids now belong to unrelated ones;
   L-024/L-037/L-042 citations dangle entirely. Two backlog trackers point at temp-dir council
   verdicts that no longer exist.
5. **Format drift** — 14 skills, no canonical skeleton (3 names for the same section, 1 missing
   frontmatter field, inconsistent `${CLAUDE_SKILL_DIR}` usage, inconsistent Bash scoping);
   2 core templates (ADR, RESEARCH) missing the ADR-009 metadata every real instance carries.

## Solution

One governing principle, then six workstreams:

> **Every hygiene rule gets a matcher — either a lint in `qa-check.sh` or a named checklist
> line in a close/promote sweep. A rule with neither is aspirational and gets deleted or wired.**

**Gate answer (asked directly): no new gate.** G1/G2 stay the only gates. Close and promote get
the *existing* propose→approve pattern (triage's `y`, decomposer's `approve`) mirrored onto
their destructive/hygiene steps — a checklist inside an existing step, not a third gate. This
matches the plugin's no-hooks / suggestion+gates philosophy and keeps TASK-006 (hook
enforcement) deferred: lint-in-script is the lower rung on the laziness ladder.

## User Stories

1. As a maintainer, I want close to sweep every tombstone comment and stale sprint reference out of TODO.md, so the Backlog holds only live content.
2. As a maintainer, I want the tombstone string close writes and the string §11 deletes to be the *same defined format*, so the sweep can actually fire.
3. As a maintainer, I want `qa-check.sh` to fail on the drift classes that recur (tombstones, README footer vs plugin.json version, missing ownership headers, TD past aging bar, temp-path refs in durable docs), so green means clean.
4. As a maintainer, I want `gen-index.sh` to stamp its own `last_updated`, so the generated index never contradicts itself.
5. As a maintainer, I want close's destructive actions (delete tombstones · archive sprint · squash-commit) presented as a propose→approve checklist, so nothing irreversible runs silently.
6. As a maintainer, I want promote to pull only `state: ready` tasks, so triage's grooming is actually consumed.
7. As a maintainer, I want prime's `Next:` line to route to `/triage` when the backlog exists but is ungroomed/blocked, so the feed pipeline's first step isn't skipped.
8. As a maintainer, I want triage to implement the bug-intake routing CONTEXT.md claims (BUG → TASK / /diagnose / TD-NNN), so the SSOT describes reality.
9. As a maintainer, I want the G1-ownership contradiction resolved (decomposer-approved tasks get a G1 fast-path "confirm unchanged", not a silent skip or full re-gate), so gate ownership is unambiguous.
10. As a maintainer, I want `L-NNN` ids to be monotonic and never reused after pruning, so citations written years apart stay true.
11. As a maintainer, I want council verdicts that durable docs reference to be archived durably (not temp-dir), so tracker links resolve.
12. As a consumer who installs the plugin, I want no lean-flow-only paths (`scripts/gen-index.sh`, `docs/research/*.md`) or unresolvable ids (L/TASK/SPRINT-NNN) inside generic skill procedure, so skills read clean cold in my repo.
13. As a consumer, I want `/insights` to resolve its LEARNINGS entry shape without reaching into another skill's private `templates/`, so it works standalone.
14. As a maintainer, I want one canonical SKILL.md skeleton (section names, order, which sections are optional) documented once, so the 14 files stop drifting apart.
15. As a maintainer, I want ADR and RESEARCH templates to carry the ADR-009 metadata block, so generated docs pass the corpus lint without hand-patching.
16. As a maintainer, I want the template count reconciled everywhere (README says 13, CLAUDE/ARCHITECTURE say 14 core, disk has 16), so the DoD's count-check means something.
17. As a maintainer, I want a one-shot mechanical cleanup of today's confirmed drift (13 tombstone lines, TODO:48/98 stale pointers, README footer, CLAUDE.md header, orphan image.png, TD-008 re-review), so the new lints start from green-and-true.
18. As a maintainer, I want CONTEXT.md's built-in-leverage list to contain only what's actually wired (`/fork` currently isn't), so the SSOT never advertises phantom capability.

## Implementation Decisions

W1–W6 and the one-shot W0 cleanup, in full → [`loop-hygiene-workstreams.md`](loop-hygiene-workstreams.md).

## Testing Decisions

- **`qa-check.sh` is the test harness.** Every W1 rule ships *with* its lint in the same task —
  a rule merged without its matcher fails the task's DoD (this is the PRD's core principle made
  testable). Verify each new lint by running it against the pre-W0 tree (must FAIL) and the
  post-W0 tree (must PASS) — the current drift is the fixture.
- **Consumer-path trace** (L-016 corollary) for every skill edit: read the edited SKILL.md as a
  cold consumer repo would — no unresolvable path/id may remain.
- **Wiring checks fire end-to-end** (L-020): after W2, run one real cycle — prime on a groomed-
  but-blocked backlog must emit the `/triage` branch; promote against a mixed-state backlog must
  pull only `ready`; close on a real sprint must emit the sweep checklist.
- DoD for the whole effort: `sh scripts/qa-check.sh` green **and** a hand-check that the green
  now covers the five drift classes it was blind to.

## Out of Scope

- Hook-based gate enforcement (TASK-006 — stays deferred; lint-in-script is the cheaper rung).
- Council multi-model backend (TASK-047), graph view (TASK-040) — unchanged.
- `docs/research/storm/` — excluded from this audit by owner decision.
- README restructuring beyond the footer + count fixes (roster ordering difference is
  presentational, accepted).

## Further Notes

**Working as designed (positive controls — don't touch):** L-NNN promotion at count≥2 (all
promoted), sprint archival + INDEX.md accuracy, CHANGELOG rotation, plugin/marketplace version
lockstep, all 14 skills under the ~110 cap, TD-001…007 collapse, all support-skill routing
resolves correctly, `.out-of-scope/` pointers accurate.

**Root-cause reading:** every recurring miss (L-008 dedup, L-015 README, L-020 wiring, this
audit's tombstones/TD-aging) is the same failure shape — *prose rule, no matcher*. W1's
principle is the durable fix; the rest is applying it. Candidate learning at close:
"A hygiene rule without a lint or checklist line is a wish" (likely bumps L-008/L-020 counts).

## Appendix — Findings register

The 29-row register, condensed by severity → [`loop-hygiene-findings.md`](loop-hygiene-findings.md).
