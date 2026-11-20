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
sprint: SPRINT-183
depends-on: []
---

# TASK-679 — Select 6 real bloodlinesfamilia commits as change-plan scenarios and audit each parent tree for answer leaks

## Why
The Q&A design tied at the ceiling twice (L-329). The owner (2026-11-20) wants real change-planning scenarios from git history on this big repo, scored against the real diff. Leaks (history, planning docs, earlier stubs) would make every arm look good for the wrong reason.

## Done when
- [x] A candidate pool of 9 commits is drawn from D:\Project\temidev-project\bloodlinesfamilia history by read-only `git log` (the live repo is never checked out or modified): each touches at least 3 non-generated code files (lockfiles, generated, docs-only and config-only commits excluded), types mixed (bug fix, feature, refactor), recorded per candidate with sha, parent sha, type, code and test file counts. ✓ pool of 9 by read-only git log (last 12 months, >=3 code files, lockfiles/generated/docs/config excluded; 4 fix, 4 feat, 1 refactor) recorded with sha, parent, type, code and test counts in graphify-rtk-retest-results.md; reserve of 4
- [x] Mechanical leak check per candidate, over the WHOLE parent tree (read-only `git grep` at the parent sha, not only planning folders): the TASK id from the commit subject, the commit-subject nouns, and every file name and symbol the diff adds or changes; each hit is listed with its path. ✓ whole-tree git grep at each parent for the TASK id, subject nouns and every changed file name and symbol, hits outside the diff's own files listed per candidate (scratch t1-leakgrep.md, summary in the report)
- [x] Key-aware audit per candidate: a Sonnet worker that has read the diff reviews all agent-visible material in the parent (comments, TODOs, CHANGELOG, tests or stubs landed earlier, ADRs, the project .claude CONTEXT file, HANDOFF-LEDGER.md, TECH-DEBT.md and other ledgers) and lists anything that names or sketches the change. ✓ three key-aware Sonnet auditors read each diff and the parent's surviving material (comments, TODOs, tests, CLAUDE/CONTEXT, prd, registry, report, ADRs, ledgers) by read-only git show/grep; findings per candidate
- [x] Disposition recorded per candidate: clean, skip, or keep-with-scrub. Planning trees (the work, sprint and epic folders under each export's docs directory) are scrubbed from every export identically for all arms; a hit outside them means skip the commit or scrub that exact file identically for all arms, recorded per scenario. Six scenarios survive with sha, parent, type and scrub list; the final seeded block assignment is NOT chosen here (680). ✓ dispositions recorded: #1 #2 #3 #4 #8 clean, #9 keep-with-scrub (docs/research/touring-mobile-ux.md, all arms), #5 smoke spare, #6 #7 skip; six scenarios with sha, parent, type, scrub list; block assignment left to 680
- [x] The export recipe is written and tried once on one parent: a fresh directory by `git archive <parent>` + `git init` + one synthetic commit, with the scrub list and secret exclusion applied (`.env*`, key, certificate and credential files excluded by archive pathspec identically for every arm); `git log --all` shows exactly one commit, no ref reaches the real history, and `git status --porcelain --ignored` is empty (the baseline). ✓ retest-probe/export.ts (git archive + init + one synthetic commit, scrub + secret pathspecs) tried on 340cd11b01: 1 commit, status --ignored empty, 0 secret-pattern files, ASSERT OK; export deleted
- [x] The results file docs/research/graphify-rtk-retest-results.md gets a new bloodlines section with the 32.00 USD ledger (hold-back 1.50) created; this task's lines total at most 2.50 USD or the task stops. ✓ results file Bloodlines section with the 32.00 ledger (hold-back 1.50); T1 lines total 1.2030 USD <= 2.50
- [x] Negative: a candidate with any leak hit that is neither scrubbed nor skipped cannot become a scenario. ✓ Negative: #6 and #7 (src leaks not removable) skipped; #5's openapi/src hint makes it a spare only; no leak hit is in a scenario unscrubbed
- [x] Negative: fewer than 6 surviving candidates means the pool is widened once (inside the cap) and otherwise the task ends `blocked`; the run is never started on fewer than 6 without the owner. ✓ Negative: six survived without widening, so the reserve was not needed and no run starts on fewer than 6
- [x] Negative: the live repo's HEAD and `git status --porcelain` recorded at start equal those at end, and no `.env*`, key or credential file in the live repo or in any export is opened, listed or grepped (briefs say so). ✓ Negative: live repo HEAD b8fea870 and the 6-line status equal at start and end (rechecked by the coordinator); every read used the secret pathspec exclusions; no .env/key/credential file opened, listed or grepped

## Touches
docs/research/graphify-rtk-retest-results.md (new section + ledger); docs/research/bloodlines-retest-scenarios.md (new; selection and audit part); read-only `git` on D:\Project\temidev-project\bloodlinesfamilia; temporary export under D:\Research\bloodlines-exports (one at a time, deleted after each use).

## Assumes
- At least 6 of the 9 pool candidates survive the audit.
- A scrubbed planning tree is an acceptable loss of realism (declared in the note).
- The key-aware audit by the key worker is the cheapest reviewer who can recognise a sketch of the change.

## Tracker
Owner popups 2026-11-20: Repos; Tools; Scenario "Real change plans from git"; Budget "6 scenarios x 3 arms, cap raised to 32 USD" **which replaces the earlier "4 pairs, <= 15 USD per repo" ruling by owner decision**; Doc leak "Scrub for all arms"; Shortfall STOP; Price gate "Ask only if it doesn't fit". Precedent TASK-676. TD-319: scenario and export paths are written as absolute D:\ paths; no bare relative repo path appears in a Done-when box.
