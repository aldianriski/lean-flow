---
sprint: 158
slug: s3-bundle-2
owner: Maintainer
last_updated: 2026-11-02
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-158 — Execution Log

> Append-only companion to [`../SPRINT-158-s3-bundle-2.md`](../SPRINT-158-s3-bundle-2.md). Uncapped by design:
> this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (STANDARD §9). **Never edit a past entry** — correct it with a new one.

### 2026-11-02 | promote | plan locked, governance signed, five members: parallel trials, three fixes and their arm
Promote governance checklist, signed by the owner by popup:
- ☑ L-promotion: none due. 258 headings; 32 active by block (33 by first status tag, two headlines quote a status); no active
  entry at count 2 or more.
- ☑ TD aging: 104 open, 103 aged against sprint 158 (created at 155 or earlier); TD-286 is new (156). By severity: 60 low + 24
  minor + 15 medium + 5 trivial = 104. No `high` row.
- ☑ doc-aging, §11: nothing pruned, no CHANGELOG rotation (no new MINOR), no LEARNINGS collapse due.
- ☑ doc-aging, §2: no breach (`check-doc-caps`: retained and frozen rows only).
- ☑ epic rollup currency: EPIC-023 current (`check-epic-archive.ts` PASS). ☑ epic coverage: 2 open, both covered (S3 → TASK-581,
  583, 584, 585; S4 → next slice). ☑ roadmap: none. ☑ handoff ledger: none.
Composition by owner popup: TASK-582, 583, 584, 585 and 581, stream s3-expertise, EPIC-023 (S3). No `L`. TASK-582 and TASK-581 set
`ready` (A4a ruled, D15); TASK-581's order inside the sprint is its Depends-on (T5 after T1-T4).
Renumbered before promote (owner ruling): bundle 2 was filed as TASK-577..580, ids the parallel stream SPRINT-157 (stream
verification, branch `sprint-157-reusable-verification`, unmerged) had taken at 12:40; they are now TASK-582..585 (`0a0ef79e`).
This sprint is 158 for the same reason: SPRINT-157 exists on that branch.
promote-check: 16 pass, 0 fail.

### 2026-11-02 | scope-change | T1, T3: TASK-582 box 2 states how a stop treats a running trial; TASK-584 adds the outside-tree case
What broke: G2's builder check found TASK-582 box 2's "owner stops ... stopping every worker" silent on a trial already running
when another worker hits a stop, and TASK-584's evidence (A4a's one park) is a session deleting a system-temp directory the
repo's own test made, outside the working tree, which box 1 does not cover and box 2's "any A4a slot that breached on a check
artifact" does not reach (no A4a slot breached on one; the forecast-month-end scope FAIL is a code-scope judgment).
Impact, by owner ruling at G2 (popup, 2026-11-02): TASK-582 box 2 reads that no worker starts another slot and a running trial
finishes and records its row. TASK-584 box 1 adds that what the repo's own tests leave outside the working tree is named in the
report, never deleted; box 2 adds one development run on workdoo reissue-invitation ending with no popup. Re-confirm G2: signed
in the same popup.

### 2026-11-02 | gate | G1 and G2 signed for all five tasks (owner popup); builder check on T1-T5 settled
G1: scope unchanged since approval for TASK-581, 582, 584 and 585 (TASK-583's G1 signed at `12ae19fc`). G2, owner rulings:
Amendment 8 rules bundle 2 against A4a by non-inferiority (the gain's 90% lower end above -0.05, no symptom regression, not
below A0, cost within 2.0x A1; business and scope reported), because A4a's 90.6% leaves at most +9.4 points of gain (L-279);
T3 takes the outside-tree case (scope-change above); a stop lets running trials finish. Settled from the builder check:
- T1: capacity check on 2 tasks x 2 trials (one task per repo whose two A4a trials both passed), compared slot by slot with
  those serial trials; the sweep test spawns a real second process as the live owner; N = 1 is checked against the old loop on
  rows, stop code and say-lines (the sweep's ownership rule is box 1's own change); a reused pid errs to keeping a directory;
  box 4 ticks when Amendment 8 (shared with T5) is signed.
- T2: the evidence is T4's two workdoo development runs, real tasks completed with the changed skill (the copy has an active
  sprint and epic), their Progress figures read against those files; a miss is fixed by replacing words, never adding a line.
- T3/T4: both extend existing lines (Reachability, Approach), so SKILL.md stays at 140 lines and 13 dense lines (`check-prose-
  density`); the coordinator launches the development runs; a run that misses the fact is a result to report, one wording
  revision at most, then the owner rules; invitation-issued-by need only name the locale fact, not pass.
- T5: the same slot set as A4a (task, trial, order; compared, not rebuilt), the development runs disclosed, validity first,
  the pin at the commit after bundle 2; Amendment 8 is the next number (7 is the last).
builder-check · T1 · 4 contradictions · 5 questions · settled by fact and one owner ruling (stops)
builder-check · T2 · 3 contradictions · 3 questions · settled by fact (workdoo runs as real input; cap by replacement)
builder-check · T3 · 2 contradictions · 2 questions · settled by owner ruling (outside-tree scope-change) and fact
builder-check · T4 · 3 contradictions · 5 questions · settled by fact
builder-check · T5 · 4 contradictions · 5 questions · settled by fact and one owner ruling (non-inferiority)
