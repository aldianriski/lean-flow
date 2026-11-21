# TASK-691 — builder verification and coordinator handoff

Builder baseline: 3aacd3ebed802905c3b1342d68295678b96711a1. No staged changes or commits.
Initial build scope: the three skill bodies, triage's own conditional reference, and this evidence directory.
Inventories were written and checked while all three source bodies were still unchanged.

## Byte and line evidence — current after bounded retry

UTF-8 body immediately after closing frontmatter and its newline; normalize CRLF → LF; preserve the
following blank and final newline. This is the TASK-690 basis, not whole-file size or character count.

| Skill | Before bytes | After bytes / target | Saved | Before / after total file lines | Dense lines before / after |
|---|---:|---:|---:|---:|---:|
| task-decomposer | 14,273 | 13,707 / 13,707 | 566 (3.97%) | 140 / 129 | 3 / 3 |
| prime | 10,557 | 9,764 / 9,764 | 793 (7.51%) | 140 / 131 | 0 / 0 |
| triage | 10,540 | 9,498 / 9,546 | 1,042 (9.89%) | 132 / 113 | 1 / 1 |

Total body saving: 2,401 bytes. This is an entry-body saving. Moving triage's 1,138-byte span to a
reference does not claim lower total bytes on a rejection call. The initial 144-byte late pointer
was replaced by reads at Flow 1 and 7; removing its redundant section saves a further 48 body bytes.

### Initial builder measurement record (before this retry)

The Bun byte/SHA probe and independent git-show + awk + wc selection agreed. Historical wc output:

~~~text
task-decomposer BEFORE body: 14273
task-decomposer AFTER body: 13707
prime BEFORE body: 10557
prime AFTER body: 9764
triage BEFORE body: 10540
triage AFTER body: 9546
~~~

Reproduce the measurement from the merged tree (substitute the baseline SHA for HEAD):

~~~sh
for skill in task-decomposer prime triage
do
  git show "3aacd3ebed802905c3b1342d68295678b96711a1:skills/$skill/SKILL.md" |
    awk 'BEGIN {fm=0} /^---\r?$/ {if(fm<2){fm++;next}} fm==2 {sub(/\r$/,"");print}' | wc -c
  awk 'BEGIN {fm=0} /^---\r?$/ {if(fm<2){fm++;next}} fm==2 {sub(/\r$/,"");print}' "skills/$skill/SKILL.md" | wc -c
done
~~~

## Initial builder inventory / preservation evidence

~~~text
VERIFIED task-decomposer: 110/110 rows; 14273 -> 13707 body bytes; 129 file lines; density 3 -> 3; exact bounded edit, frontmatter preserved
VERIFIED prime: 108/108 rows; 10557 -> 9764 body bytes; 131 file lines; density 0 -> 0; exact bounded edit, frontmatter preserved
VERIFIED triage: 98/98 rows; 10540 -> 9546 body bytes; 117 file lines; density 1 -> 1; exact bounded edit, frontmatter preserved
INDEPENDENT task-decomposer: source-selected body rows agree, count 110
INDEPENDENT prime: source-selected body rows agree, count 108
INDEPENDENT triage: source-selected body rows agree, count 98
~~~

The independent coverage selection walks the git blob after its second frontmatter delimiter, selects
every nonblank line with awk, and compares its line-number sequence with sed-selected inventory rows
using cmp. It does not select lines from the inventory to define the required population.
The first probe compares actual files to the exact bounded edit plan and checks original body hashes
against TASK-690. All unchanged spans and frontmatter therefore remain identical.
The moved triage span equals the original bytes after normalization; only its reference title is new.

Self-review: task-decomposer's ten removed nonblank schema lines each name their surviving task-file.md
line(s); its full-template and Write-step pointers remain. All initial-state/priority rules remain.
Prime keeps every instruction in the body; only explanations shorten. Triage keeps scan-first, Flow 7,
Applying, and hard rules. The initial self-review incorrectly treated the late pointer as sufficient
for both branches; the accepted Medium finding and bounded retry below correct that claim.
Layout anchors, refusal spans, step wiring and prime by-id strings pass their unchanged fixture contracts.
No hard rule or approval stop was deleted. This is builder self-review, not the required different-family review.

## Initial builder checks run before and after (not re-run unless listed below)

Each runner was invoked separately and its printed verdict inspected:

~~~text
bun --no-env-file evals/run-layout-fixtures.ts
bun --no-env-file evals/run-work-store-fixtures.ts
bun --no-env-file evals/run-store-writers-fixtures.ts
bun --no-env-file evals/run-orchestrator-store-fixtures.ts
bun --no-env-file scripts/lib/check-doc-caps.ts
bun --no-env-file scripts/lib/check-prose-density.ts .
sh scripts/lib/check-count-claims.sh .
sh evals/run-skill-freshness-fixtures.sh
~~~

For disposable fixtures, each invocation set process-local TEMP and TMP to the resolved
.task691-scratch directory in this worktree; skill-freshness set TMPDIR there (forward-slash form).
The requested work-store runner and the design's orchestrator-store runner create their own disposable
git repositories there. No git write command was run against this worktree or the main repository.
All scratch probe files were removed; the empty scratch directory is covered in the final cleanup note.

### layout

Before exit 0; after exit 0. Printed after verdicts:

~~~text
layout-fixtures: 41 pass, 0 fail
~~~

### work-store

Before exit 0; after exit 0. Printed after verdicts:

~~~text
work-store-fixtures: 21 pass, 0 fail
~~~

### store-writers

Before exit 0; after exit 0. Printed after verdicts:

~~~text
store-writers-fixtures: 29 pass, 0 fail
~~~

### orchestrator-store

Before exit 0; after exit 0. Printed after verdicts:

~~~text
orchestrator-store-fixtures: 42 pass, 0 fail
~~~

### doc-caps

Before exit 0; after exit 0. Printed after verdicts:

~~~text
PASS  cap skills/prime/SKILL.md (131 <= 140) [ADR-006, not §2]
PASS  cap skills/task-decomposer/SKILL.md (129 <= 140) [ADR-006, not §2]
PASS  cap skills/triage/SKILL.md (117 <= 140) [ADR-006, not §2]
PASS  doc-caps: token-budget ~12634 tokens <= budget 12691 (ratio 2.991 bytes/token, claude-opus-5-5 tokenizer; adopted 2026-10-25+bc0cac72)
~~~

### prose-density

Before exit 1; after exit 1. Printed after verdicts:

~~~text
FAIL  prose-density: docs/research/bloodlines-retest-scenarios.md has 13 line(s) over 400 chars and no baseline row [STANDARD 157: split, never squeeze] -- lines 77, 84, 88, 109, 156, ...
FAIL  prose-density: docs/research/graphify-rtk-retest-results.md has 6 line(s) over 400 chars and no baseline row [STANDARD 157: split, never squeeze] -- lines 100, 239, 241, 251, 259, ...
FAIL  prose-density: docs/research/rtk-trial-verdict.md has 5 line(s) over 400 chars and no baseline row [STANDARD 157: split, never squeeze] -- lines 15, 17, 47, 48, 55
FAIL  prose-density: skills/orchestrator/SKILL.md grew to 14 dense lines, baseline 13 [STANDARD 157: split, never squeeze] -- it got denser under the clause; lines 42, 51, 52, 53, 77, ...
PASS  prose-density: skills/task-decomposer/SKILL.md (3 <= 3 dense lines) -- adopted drift, shrink it at the next promote review
PASS  prose-density: skills/triage/SKILL.md (1 <= 1 dense lines) -- adopted drift, shrink it at the next promote review
prose-density: 26 pass, 4 fail
~~~

### count-claims

Before exit 0; after exit 0. Printed after verdicts:

~~~text
PASS  skills: .claude/CONTEXT.md claims 16 = disk 16
PASS  skills: docs/architecture/overview.md claims 16 = disk 16
PASS  skills: .claude/CLAUDE.md claims 16 = disk 16
PASS  skills: SECURITY.md claims 16 = disk 16
PASS  tmpl-core: .claude/CLAUDE.md claims 34 = disk 34
PASS  tmpl-core: docs/architecture/overview.md claims 34 = disk 34
PASS  tmpl-core: README.md claims 34 = disk 34
PASS  tmpl-total: .claude/CLAUDE.md claims 36 = disk 36
PASS  tmpl-total: docs/architecture/overview.md claims 36 = disk 36
PASS  tmpl-total: README.md claims 36 = disk 36
PASS  qa.md non-core claim: docs/QA.md claims 2 = script 2
~~~

### skill-freshness

Before exit 0; after exit 0. Printed after verdicts:

~~~text
SKILL-FRESHNESS FIXTURES: all green
~~~


The four prose-density FAIL lines are byte-identical before and after; none is a T8 change.
They remain unresolved outside T8's declared Layers. T8's dense counts do not increase.
No requested test command was sandbox-blocked. Git emitted denied-access warnings for its global
ignore file, but the fixture verdicts above passed.

An optional PowerShell-file probe was refused by execution policy; no policy override was used.
The independent awk/sed/cmp probe above supplied the same coverage evidence successfully.
The scratch Bun probe printed its verification lines and exit 0, but also parent tsconfig/directory
EPERM diagnostics; one local-tsconfig retry retained those diagnostics and added a Bun directory-mismatch
notice. The independent byte/coverage checks and actual diff inspection are the corroboration; the
probe's exit alone is not treated as proof. No further retry.

## Bounded reviewer retry — 2026-11-21

Accepted Medium: the late reference pointer did not satisfy the frozen Negative box requiring a
pointer at each branch point. Triage Flow 1 (L47) now reads the reference before scanning; Flow 7
(L67) reads it before writing a rejection record. Both exact lines and all 98 remapped inventory
rows are in triage.md. The redundant late heading and pointer are removed; the approval rule
survives in Flow 8, Applying and HITL. No rejection-record rule changed.

Accepted Low: task-decomposer L89 now ends its full-template sentence with a period instead of the
colon that introduced the deleted fence. Its inventory row and body hash are updated too.

Retry edits: skills/triage/SKILL.md, skills/task-decomposer/SKILL.md and this task's triage.md,
task-decomposer.md and checks.md only. No .g2-design.md edit, repository git write or claude -p run.
SHA-256 checks confirm .g2-design.md, prime and the triage reference match their pre-retry bytes.

The PowerShell UTF-8 byte/SHA probe removes the leading frontmatter block by an anchored match,
normalizes CRLF to LF and preserves the following blank and final newline. An independent awk
delimiter-state scan piped to wc -c agrees on both current bodies:

~~~text
triage body bytes: 9498
task-decomposer body bytes: 13707
~~~

| Body | Pre-retry bytes | Current bytes / ceiling | Current lines | Current normalized-body SHA-256 |
|---|---:|---:|---:|---|
| triage | 9,546 | 9,498 / 9,546 | 113 | 250031eb051427c2328aa6ccfb0d2af8b8cd6d0f7a00c4363ed66e07fb6a7924 |
| task-decomposer | 13,707 | 13,707 / 13,707 | 129 | 01bff1f65fd28f796329a6b5e956d199483f56dc68a83bbd8970d82b3950321c |

The pre-retry snapshot comparison and a fresh selection of every nonblank body line from the
baseline git blob produced:

~~~text
PASS retry scope: triage differs only by two branch-point reads and removal of the redundant late section; task-decomposer differs only by colon -> period.
PASS triage inventory: 98/98 source-selected nonblank rows; exact original text; 83 kept, 14 moved, 1 redundant heading deleted; surviving coordinates and both branch pointers verified.
PASS preserved rules: original Flow 1 and Flow 7 text retained; Applying and hard rules byte-identical; approval reminder still present.
~~~

All unchanged spans, including frontmatter and the fixture-pinned phrases, remain identical.
The removed heading is the inventory's sole deleted scaffolding row, duplicating the reference's
topic title; the 14 moved rows point to both executed steps. Source text in all 98 rows stays exact.

Re-ran each requested command as a separate process; all exited 0. Printed verdict lines:

~~~text
bun --no-env-file evals/run-layout-fixtures.ts
layout-fixtures: 41 pass, 0 fail

bun --no-env-file evals/run-work-store-fixtures.ts
work-store-fixtures: 21 pass, 0 fail

bun --no-env-file scripts/lib/check-doc-caps.ts
PASS  cap skills/task-decomposer/SKILL.md (129 <= 140) [ADR-006, not §2]
PASS  cap skills/triage/SKILL.md (113 <= 140) [ADR-006, not §2]
PASS  doc-caps: token-budget ~12634 tokens <= budget 12691 (ratio 2.991 bytes/token, claude-opus-5-5 tokenizer; adopted 2026-10-25+bc0cac72)
~~~

For work-store fixtures only, process-local TEMP/TMP resolved to
docs/work/evidence/TASK-691/.retry-tmp. The runner's git writes were confined to its disposable
fixture repositories; it removed them, and the verified-empty parent was removed without recursion.
Git warned that its global ignore file was inaccessible; the fixture verdict still passed.
git diff --check exited 0; the cached diff was empty. No other initial-builder check was re-run.
The coordinator's real-input proofs, spend and integration gate remain pending as recorded below.
This bounded retry is ready for reviewer re-check.

## Frozen Done-when evidence

| Box | Builder evidence | Remaining |
|---|---|---|
| 1: census targets / wc | All three meet the frozen TASK-690 ceilings; triage is 48 bytes below its ceiling after retry; two methods agree; file caps pass. | None for the builder's artifacts. |
| 2: complete inventories | 110 task-decomposer + 108 prime + 98 triage original nonblank lines, individually classified; all always-call instructions remain loaded; source/blob/body pins retained. | Different-family judgment review. |
| 3: real-input parity / spend | Exact prompts and cwd recipes in the three inventories; R1 ordinary intake, R2 routine prime, R3 new rejection, R4 matched rejection. spend.md states no runs by builder. | Coordinator runs each before/after pair; captures base dir, moved-reference Reads, gates, outputs, no-write checks and actual spend. |
| 4: review / gates | Seven check commands pass; prose-density has the same four pre-existing failures. | Different-family worktree-isolated review, at most two rounds; full integrated qa-check; density resolution or explicit owner ruling. |
| 5: negative | Bounded-diff comparison, retained hard rules/approval gates, exact reference move and explicit pointers at Flow 1/7; text contracts green. | Reviewer and real-input route confirmation. |

## Coordinator actions and commands

Do not tick boxes 3 or 4 from this builder packet. No claude -p run or different-family review was
performed, and the builder did not create a spend record implying otherwise.

The approved G2 method uses the off-host full gate after merge. It ships HEAD, so it would not examine
these uncommitted worker edits. With the already-authorized, non-secret runner configuration in the
coordinator's environment, run after merge:

~~~text
bun --no-env-file scripts/gate-remote.ts
~~~

It executes QA_FULL=1 sh scripts/qa-check.sh and bun test on the merged HEAD. No credential file
was opened by the builder. The full gate is pending integration, not claimed green.

Layers: skills/prime/references/ does not exist and is unnecessary because prime's rules stayed loaded.
The coordinator should remove that unused T8 token through its scope-change process; no empty directory
or filler reference was created. skills/task-decomposer/references/ already exists but is unchanged.
No sprint, sprint Log, task file, or .g2-design.md was edited.

## Proposed Execution Log entry — coordinator writes

T8 / TASK-691 · built, pending proof/review: task-decomposer 14,273 → 13,707 B (129 lines);
prime 10,557 → 9,764 B (131); triage 10,540 → 9,498 B (113), on TASK-690's normalized-body basis.
316 original nonblank lines inventoried before trim; task schema removed only as a named duplicate;
triage rejection span moved verbatim, now reached by explicit pointers at Flow 1/7; prime instructions stay loaded.
Bounded retry also changes task-decomposer L89's trailing colon to a period (byte-neutral).
layout 41/0, work-store 21/0, store-writers 29/0, orchestrator-store 42/0; doc caps, count-claims
and skill-freshness pass. prose-density 26/4, the same four out-of-scope failures as baseline.
No paid runs by builder. R1/R2/R3/R4 before/after prompts and cwd recipes retained; coordinator owes
proofs/spend, different-family review (max 2 rounds), merged full gate and unused prime-reference Layers
correction. No member box ticked or status moved.


## Final workspace check and cleanup limitation

git diff --check exited 0; git diff --cached --name-only was empty.
The only tracked diffs are the three intended SKILL.md bodies. New deliverables are the triage reference
and five TASK-691 evidence files. All scratch probe files and disposable fixture repositories were removed.

Automatic approval review rejected the recursive scratch cleanup, then accepted explicit named-file
deletion. It also rejected removal of the now-empty .task691-scratch directory, stating "blocked by policy".
The directory is empty and contains no deliverable or probe. Coordinator cleanup command, after confirming
it is still empty: Remove-Item -LiteralPath '.task691-scratch'. No override or further retry was attempted.

