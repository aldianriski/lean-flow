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
> docs corpus · cross-cutting consistency). Evidence appendix at the bottom. Review-first —
> nothing here has been applied.

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

### W1 — Hygiene enforcement loop (P0 · the complaint)
- **Tombstone standard**: define ONE canonical tombstone string that `lean-doc-generator close`
  writes (e.g. `<!-- shipped: TASK-NNN[, …] → SPRINT-NNN vX.Y.Z · CHANGELOG -->`) and that
  §11's delete rule + a new qa-check lint both match. Policy: a tombstone survives exactly one
  sprint (written at close N, deleted at close N+1) — or delete immediately; decide at G2.
- **Close sweep** (new named substep in the close row): delete matured tombstones · grep TODO.md
  for any reference to the just-closed `SPRINT-NNN` outside § Active Sprint and refresh/delete ·
  verify CHANGELOG-rotation links still resolve. Presented propose→approve.
- **qa-check.sh extensions** (each a cheap grep-class check): tombstone-format lint · README
  footer version == plugin.json version · ownership frontmatter on CLAUDE.md + README (extend
  the fixed 7-file list) · TD entries with `created:` ≥3 closed sprints ago and no re-review
  annotation → FAIL · temp-dir/`(temp)` tracker refs in TODO.md → FAIL · no hand-written
  "currently N/cap" snapshots outside generated docs (fix docs/QA.md:24 by deleting the snapshot).
- **gen-index.sh**: rewrite `last_updated` on every run (one-line sed fix).
- **Promote aging becomes a checklist**: §10's promote-time scan (TD aging · L-promotion ·
  dedup-when-near-cap) emitted as explicit checkbox lines in promote's output, not recalled prose.

### W2 — Wiring (P1)
- Triage: add a bug-intake step implementing CONTEXT.md:53's routing, or delete the claim.
- Promote: intake filters `state: ready` explicitly (consumes triage's shortlist contract).
- Prime: add `Next:` branch — backlog exists but nothing `ready` → `/triage`.
- CONTEXT.md built-in list: drop `/fork` (or wire it); point `/simplify` at its actual home
  (`orchestrator/references/review-scoping.md`).
- Loop statement: keep the 3-node headline but suffix it with the feed pipeline in the same
  sentence, so a verbatim reader can't skip decomposer/triage.
- G1 ownership: orchestrator states the rule — task arrived via decomposer `approve` → G1 runs
  as a 10-second "scope unchanged since approval? y/n" fast-path; otherwise full G1.

### W3 — Gate clarity (P1)
- No G3. Close + promote each get one explicit human-approval line before their write/commit
  actions, mirroring triage/decomposer verbs. Promote: after governance review, before render.
  Close: before the delete/archive/squash sequence (the W1 sweep is inside this approval).

### W4 — Knowledge integrity (P1)
- `L-NNN` ids monotonic forever; §11 pruning removes the *body*, never frees the id (leave a
  one-line `L-016: promoted → CLAUDE anti-pattern` stub or a retired-ids line in LEARNINGS.md).
- Fix the two live collisions (tdd:82 cites old L-016 · task-decomposer:89 cites old L-017) and
  the dangling L-024/L-037/L-042 cites — replace with "(promoted → red-flag)" wording.
- Citation policy for shipped surface: generic SKILL.md/references cite no repo-local ids;
  rationale is inlined or dropped. Repo-local docs (CLAUDE/CONTEXT) may cite freely.
- Verdict archival: a council verdict referenced by any durable doc is copied into
  `docs/research/verdict-<slug>.md` at reference time; TODO trackers point there. Fix TASK-040/047.

### W5 — Consumer surface (P2)
- `insights`: drop the `scripts/gen-index.sh` parenthetical (generalize to "the project's own
  index-regen command, if any"); inline the minimal LEARNINGS entry shape instead of pointing
  at lean-doc-generator's private template.
- `prime:38` and `dispatch.md:5`: inline the one-line rationale, drop `docs/research/…` pointers.
- Sweep remaining SPRINT/TASK-NNN ballast from generic files on next touch (low priority).

### W6 — Format standard (P2)
- Document the canonical SKILL.md skeleton once (DOCS_Guide or a short style note):
  frontmatter (6 fields, `argument-hint` may be `""`) → `## When to invoke` (optional but
  canonical name) → one procedure section (name free) → `## Output format` (required only for
  deterministic-output skills) → `## Hard rules` (optional) → `## Red flags` (required, ❌-bullets).
  Normalize deviations: council gets `argument-hint` + `${CLAUDE_SKILL_DIR}` prefixes; insights
  `## Output` → `## Output format`; council `## When to run` → `## When to invoke`.
- `allowed-tools`: keep unscoped Bash where genuinely needed (tdd/diagnose run arbitrary test
  commands) but record that rationale once; scope the rest (release-patch pattern).
- Templates: add `id/tags/domain/status/related` frontmatter to ADR + RESEARCH templates;
  reconcile the count — BUG becomes core row 14 in DOCS_Guide §2; README "13" → "14 core
  (+ DESIGN · QA-TESTCASE non-core = 16)".

### W0 — One-shot mechanical cleanup (do first, no design needed)
Delete TODO.md's 13 tombstone lines · fix TODO:48 (SPRINT-016) + TODO:98 (rotated CHANGELOG
link) · README footer → v1.10.2 + real date · add CLAUDE.md ownership frontmatter · delete
orphan `docs/research/image.png` · record TD-008 re-review (or promote it to a TASK).

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

## Appendix — Findings register (condensed, by severity)

| # | Sev | Area | Finding | Evidence |
|---|-----|------|---------|----------|
| 1 | high | hygiene | Tombstone format close writes ≠ format §11 deletes; 13 graveyard lines never swept | TODO.md:33-74 · DOCS_Guide.md:231 |
| 2 | high | hygiene | Stale "SPRINT-016 active" pointer survived close; close only clears § Active Sprint header | TODO.md:48 · lean-doc-generator/SKILL.md:90 |
| 3 | high | hygiene | qa-check 47/47 green while README/CLAUDE/TD drift exists — coverage gap, not neglect | scripts/qa-check.sh:67 |
| 4 | high | staleness | README footer v1.5.0 vs plugin 1.10.2 — L-015 incident recurred | README.md:347 · plugin.json:3 |
| 5 | high | staleness | gen-index.sh never refreshes its own `last_updated` (script bug) | scripts/gen-index.sh:68 |
| 6 | high | process | CLAUDE.md has no ownership frontmatter; invisible to checker | .claude/CLAUDE.md:1 · qa-check.sh:67 |
| 7 | high | process | TD-008 six sprints past the 3-sprint re-review bar, no re-review | TODO.md:86 · DOCS_Guide.md:214 |
| 8 | high | wiring | Bug-intake in CONTEXT.md unimplemented in triage | CONTEXT.md:53 · triage/SKILL.md:38-46 |
| 9 | high | gates | Close's destructive ops (delete/archive/squash) run with no approval verb | lean-doc-generator/SKILL.md:90 |
| 10 | high | integrity | L-016/L-017 ids reused after pruning — shipped citations now point at wrong learnings | tdd/SKILL.md:82 · task-decomposer/SKILL.md:89 · LEARNINGS.md:57,61 |
| 11 | high | consumer | insights points at another skill's private `templates/LEARNINGS.md.template` (unresolvable cold) | insights/SKILL.md:36 |
| 12 | high | templates | ADR + RESEARCH templates missing ADR-009 metadata all real instances carry | templates/ADR.md.template:1-9 · CONTEXT.md:112 |
| 13 | med | wiring | Promote never filters `state: ready` | lean-doc-generator/SKILL.md:88 · triage/SKILL.md:46 |
| 14 | med | wiring | Prime's Next: never routes to /triage | prime/SKILL.md:52-55 |
| 15 | med | wiring | `/fork` advertised, wired nowhere; `/simplify` one hop removed | CONTEXT.md:45 |
| 16 | med | gates | Promote has no explicit sign-off between governance review and render/commit | lean-doc-generator/SKILL.md:88 |
| 17 | med | gates/wiring | G1 ownership contradiction: decomposer "approve is the gate" vs orchestrator "G1 all modes" | task-decomposer/SKILL.md:13 · orchestrator/SKILL.md:30 |
| 18 | med | archive | TASK-040/047 trackers point at nonexistent temp-dir verdicts | TODO.md:60,69 |
| 19 | med | consumer | insights hardcodes `scripts/gen-index.sh`; prime + dispatch.md embed `docs/research/…` paths | insights/SKILL.md:39 · prime/SKILL.md:38 · dispatch.md:5 |
| 20 | med | consumer | Dangling L-024/L-037/L-042 citations in shipped orchestrator surface | orchestrator/SKILL.md:83,107 · dispatch.md:36 |
| 21 | med | templates | Template count disagrees: README 13 · CLAUDE/ARCHITECTURE 14 · disk 16; BUG unlisted in DOCS_Guide §2 | README.md:290 · ARCHITECTURE.md:29 |
| 22 | med | dup | Modes table byte-identical in CONTEXT.md and README, against ADR-007 pointer rule | CONTEXT.md:66-72 · README.md:192-198 |
| 23 | med | staleness | TODO:98 points at rotated-away CHANGELOG content; QA.md hand-written cap snapshot drifted | TODO.md:98 · docs/QA.md:24 |
| 24 | med | process | Dedup pass ran once in 23 sprints; CONTEXT.md back at 127/130 | commit ee8df02 |
| 25 | low | format | council: no `argument-hint`, bare `references/` paths; `Output`/`Output format`/`When to run` naming drift; no shared skeleton | council/SKILL.md:1-7,33 · insights/SKILL.md:41 |
| 26 | low | format | `allowed-tools` Bash scoping inconsistent, rationale unrecorded | release-patch vs tdd/diagnose frontmatter |
| 27 | low | format | flow + release-patch descriptions lack the "do not use → /X" redirect 12/14 have | flow/SKILL.md · release-patch/SKILL.md frontmatter |
| 28 | low | staleness | Orphan `docs/research/image.png`, unreferenced since SPRINT-006 | docs/research/image.png |
| 29 | low | standalone | refactor-advisor reads CONTEXT.md/ADRs with no degrade-gracefully clause | refactor-advisor/SKILL.md:34 |
