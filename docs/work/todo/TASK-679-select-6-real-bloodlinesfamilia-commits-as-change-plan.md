---
id: TASK-679
title: "Select 6 real bloodlinesfamilia commits as change-plan scenarios and audit each parent tree for answer leaks"
priority: P2
size: M
risk: low
autonomy: HITL
class: execution
tier: X
authority: J1
origin: decomposer
state: ready
depends-on: []
---

# TASK-679 — Select 6 real bloodlinesfamilia commits as change-plan scenarios and audit each parent tree for answer leaks

## Why
The Q&A design tied at the ceiling twice (L-329). The owner (2026-11-20) wants real change-planning scenarios from git history on this big repo, scored against the real diff. Leaks (history, planning docs, earlier stubs) would make every arm look good for the wrong reason.

## Done when
- [ ] A candidate pool of 9 commits is drawn from D:\Project\temidev-project\bloodlinesfamilia history by read-only `git log` (the live repo is never checked out or modified): each touches at least 3 non-generated code files (lockfiles, generated, docs-only and config-only commits excluded), types mixed (bug fix, feature, refactor), recorded per candidate with sha, parent sha, type, code and test file counts.
- [ ] Mechanical leak check per candidate, over the WHOLE parent tree (read-only `git grep` at the parent sha, not only planning folders): the TASK id from the commit subject, the commit-subject nouns, and every file name and symbol the diff adds or changes; each hit is listed with its path.
- [ ] Key-aware audit per candidate: a Sonnet worker that has read the diff reviews all agent-visible material in the parent (comments, TODOs, CHANGELOG, tests or stubs landed earlier, ADRs, the project .claude CONTEXT file, HANDOFF-LEDGER.md, TECH-DEBT.md and other ledgers) and lists anything that names or sketches the change.
- [ ] Disposition recorded per candidate: clean, skip, or keep-with-scrub. Planning trees (the work, sprint and epic folders under each export's docs directory) are scrubbed from every export identically for all arms; a hit outside them means skip the commit or scrub that exact file identically for all arms, recorded per scenario. Six scenarios survive with sha, parent, type and scrub list; the final seeded block assignment is NOT chosen here (680).
- [ ] The export recipe is written and tried once on one parent: a fresh directory by `git archive <parent>` + `git init` + one synthetic commit, with the scrub list and secret exclusion applied (`.env*`, key, certificate and credential files excluded by archive pathspec identically for every arm); `git log --all` shows exactly one commit, no ref reaches the real history, and `git status --porcelain --ignored` is empty (the baseline).
- [ ] The results file docs/research/graphify-rtk-retest-results.md gets a new bloodlines section with the 32.00 USD ledger (hold-back 1.50) created; this task's lines total at most 2.50 USD or the task stops.
- [ ] Negative: a candidate with any leak hit that is neither scrubbed nor skipped cannot become a scenario.
- [ ] Negative: fewer than 6 surviving candidates means the pool is widened once (inside the cap) and otherwise the task ends `blocked`; the run is never started on fewer than 6 without the owner.
- [ ] Negative: the live repo's HEAD and `git status --porcelain` recorded at start equal those at end, and no `.env*`, key or credential file in the live repo or in any export is opened, listed or grepped (briefs say so).

## Touches
docs/research/graphify-rtk-retest-results.md (new section + ledger); docs/research/bloodlines-retest-scenarios.md (new; selection and audit part); read-only `git` on D:\Project\temidev-project\bloodlinesfamilia; temporary export under D:\Research\bloodlines-exports (one at a time, deleted after each use).

## Assumes
- At least 6 of the 9 pool candidates survive the audit.
- A scrubbed planning tree is an acceptable loss of realism (declared in the note).
- The key-aware audit by the key worker is the cheapest reviewer who can recognise a sketch of the change.

## Tracker
Owner popups 2026-11-20: Repos; Tools; Scenario "Real change plans from git"; Budget "6 scenarios x 3 arms, cap raised to 32 USD" **which replaces the earlier "4 pairs, <= 15 USD per repo" ruling by owner decision**; Doc leak "Scrub for all arms"; Shortfall STOP; Price gate "Ask only if it doesn't fit". Precedent TASK-676. TD-319: scenario and export paths are written as absolute D:\ paths; no bare relative repo path appears in a Done-when box.
