# Brief — author four realistic development tasks for an evaluation set

You write four development tasks, each the kind of ticket a developer on this project would really get, with an automatic test
that decides whether a solution is correct. Other developers will later attempt these tasks without seeing your solutions.

## Your inputs — and only these
- The repository snapshot at `D:Researchb-author-workdoo-a` (your working copy; you may edit it, it is disposable).
- `D:Researchb-author-workdoo-a/BUSINESS-NOTES.md`: the project's business facts.
- The category list below.
Do not open any path outside `D:Researchb-author-workdoo-a`. Never open `.env` files, keys or credentials.

## Categories for your four tasks (one task each)
convention-bearing feature · business-rule change · bug · under-documented area

## Setup
- `git init` the snapshot and commit it as the baseline, so you can produce diffs (this repo is a local copy; there is no remote).
- npm ci in the snapshot; Node 24.16+ (built-in SQLite, no database server)

## Each task produces, in `D:Researchb-author-workdoo-a/_ab-out/<task-id>/` (task-id: short kebab-case)
1. `task.json`:
   ```json
   { "id": "<task-id>", "category": "<category>", "symptoms": ["convention" | "business-rule" | "lost-detail", ...],
     "prompt": "<the ticket text a developer receives>",
     "layers": ["<files or dirs a solution may touch>"],
     "outOfScope": ["<behaviour a solution must not change>"],
     "acceptance": { "files": ["<repo-relative path where each acceptance test file is installed>"], "cmd": "<command that runs only the acceptance test>" },
     "graders": [ { "name": "<grader>", "cmd": "<command>" } ],
     "lostDetail": { "fact": "<the fact>", "grepTerms": ["..."], "hitsOutsideNotes": 0 }   // only on lost-detail tasks
   }
   ```
   `graders` = the regression checks this repo uses, frozen: npm run typecheck · npm run build · the non-browser verify:* scripts covering the area · lint not applicable
2. `acceptance/` — the acceptance test file(s), exactly as installed at the `acceptance.files` paths.
3. `reference.patch` — your solution as a `git diff` against the baseline, ≤ ~150 changed lines (a task needing more is replaced by a smaller one, not grown).
4. `red.log` — the acceptance command's output on the untouched baseline with only the acceptance files installed: it must FAIL.
5. `green.log` — the acceptance command and every grader after applying `reference.patch`: all must PASS.
Reset the snapshot to the baseline (`git stash`/`git checkout .` and remove installed files) between tasks.

## Rules
- Realistic: written like a real ticket; it does not name the hidden test, and it does not hand over facts a real ticket would not state.
- Symptom tags: `convention` when a correct solution must follow a convention the code already uses; `business-rule` when it
  must apply a business rule; `lost-detail` when correctness depends on a fact found only in BUSINESS-NOTES.md.
- At least one task is `lost-detail`: its acceptance depends on a fact that appears in BUSINESS-NOTES.md and nowhere else in the
  snapshot (code, docs, tests, comments). Prove it: grep the snapshot (excluding BUSINESS-NOTES.md and `_ab-out/`) for the
  fact's key terms and record 0 hits in `lostDetail`.
- Deterministic: the acceptance test gives the same result every run (no network, no wall-clock flakiness, fixed data).
- Never weaken an existing test to make the reference pass.

## Report (under 300 words)
For each task: id · category · symptoms · red FAIL / green PASS confirmed · changed lines in reference.patch · for lost-detail,
the fact and its grep result. Then anything you could not satisfy.
