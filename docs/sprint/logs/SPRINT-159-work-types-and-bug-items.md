---
sprint: 159
slug: work-types-and-bug-items
owner: Maintainer
last_updated: 2026-11-02
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-159 — Execution Log

> Append-only companion to [`../SPRINT-159-work-types-and-bug-items.md`](../SPRINT-159-work-types-and-bug-items.md). Uncapped by design:
> this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (STANDARD §9). **Never edit a past entry** — correct it with a new one.

### 2026-11-02 | promote | plan locked, governance signed, six members: typed work items, bug items, migration, research folders
Promote governance checklist, signed by the owner by popup:
- ☑ L-promotion: none due (L-280 to L-282 at count 1; no active entry at count 2 or more).
- ☑ TD aging: 105 open, none `high` (61 low, 24 minor, 15 medium, 5 trivial); no escalation.
- ☑ doc-aging, §11: nothing pruned, no CHANGELOG rotation (no new release), no LEARNINGS collapse due.
- ☑ doc-aging, §2: no breach (`check-doc-caps`: retained and frozen rows only).
- ☑ epic rollup currency: EPIC-023 current (`check-epic-archive.ts` PASS). ☑ epic coverage: 2 open, both covered (S3 → TASK-587,
  588; S4 → next slice). ☑ roadmap: none. ☑ handoff ledger: none.
Composition by owner popup: TASK-590, 591, 592, 593, 594 and 589, stream docs-structure (new), no epic. No `L`. Intake rulings
(owner, 2026-11-02): one typed work store rather than a separate bugs folder, evidence in a folder per item, `done/` as the
archive, `TECH-DEBT.md` kept as the ledger, and a proper migration for repos already on lean-flow.
Cross-stream: SPRINT-157 (branch `sprint-157-reusable-verification`) owns the generator's CRLF fix, an edit to
`skills/diagnose/SKILL.md` and `docs/development/setup.md`; recorded as D3.
promote-check: 19 pass, 0 fail.

### 2026-11-02 | gate | G1 signed for all six tasks; G2 signed for T1 only (T2-T6 wait for T1's findings)
G1 (owner popup): TASK-590 to TASK-594 fast-path (origin decomposer, scope unchanged since approve); TASK-589 (origin manual) full
checklist: done when the three series sit in topic folders with the ADR, the §2 amendment and the generator reading folders first;
size M; out of scope the CRLF fix and `docs/development/setup.md` (SPRINT-157), `docs/research/storm/`, `plugin-reference-delta.md`,
`loop-hygiene-*` and high-citation docs; assumption A1 (spec version bump) confirmed at T2's G2.
G2 for T1: a read-only census of the frozen population (`D:\Research\dev156\workdoo`, `\clinic`, lean-flow's `docs/`, freshly read)
against STANDARD §2, cross-checked by a second listing with a different selection rule; `docs/research/adopter-folder-audit.md`
with a proposed ruling per finding; owner rulings by popup; approved new tasks filed by the coordinator; changes to TASK-591, 594
or 589 by a logged scope-change that cites the doc. T2-T6 are designed after T1's findings (they depend on them).
builder-check · T1 · 5 contradictions · 3 questions · settled by fact (population kept to the frozen text; lean-flow docs read fresh; filing and citing steps added)

### 2026-11-02 | scope-change | T2, T5, T6: TASK-591, TASK-594 and TASK-589 take T1's findings (owner rulings)
What broke: T1's census (`docs/research/adopter-folder-audit.md`) found what the frozen Done-whens did not foresee: workdoo keeps
546 of its 709 doc files as verification evidence in a folder the standard does not place; both adopters keep a root business-notes
file with no row; and five legitimate kinds of file (migrate's archive, the QA folder and checklist, the generated knowledge index,
data files beside research logs, per-feature sibling docs) have no §2 row.
Impact, by owner ruling (popup, 2026-11-02): TASK-591's evidence folder serves every work item, not only bugs, and its amendment
gives business facts a placed row; TASK-594's migrate also proposes mapping existing capture folders onto their items; TASK-589's
§2 amendment also places the five kinds above. Each task cites the audit doc. `storm/` goes to a new backlog task (TASK-595).
Re-confirm G2: T2, T5 and T6 are designed after this entry, at their G2.

### 2026-11-02 | progress | T1: adopter folder audit done; owner ruled every finding; TASK-590 done
A Sonnet census read the frozen population read-only and a plain listing cross-checked it (workdoo 586 of 709 files unplaced,
clinic 0 of 13, lean-flow 27 of 622, each fully covered by the findings). Twelve findings, owner rulings by popup: evidence for
every work item and a business-facts row (TASK-591), capture folders proposed by migrate (TASK-594), five legitimate extras placed
by TASK-589's §2 amendment, `storm/` to TASK-595, mockups and the exploratory pack kept. Doc: `docs/research/adopter-folder-audit.md`.
consequence · T1 · behaviour:low · governance:low
review · T1 · self-review (research doc; census cross-checked by a second listing; rulings by the owner) · behaviour:low · governance:low

### 2026-11-02 | scope-change | T2, T3, T5, T6: owner rulings at G2 (builder check)
What broke: G2's builder check found four places where the frozen text and a sound design disagree. (1) TASK-591 box 1 says the
temp-only bug-report rule is "retired"; removing `S2.R-TEMPDIR` is a MAJOR spec change against the frozen rule ids (ADR-034).
(2) TASK-592's real bug needs a fix outside T3's Layers. (3) TASK-594 box 4 runs migrate on the workdoo research copy that the A/B
development runs read unchanged. (4) TASK-589 box 2 asks the generator to strip CR, which SPRINT-157's T1 already does (D3).
Impact, by owner ruling (popup, 2026-11-02): (1) box 1 reads that the temp-only intake is replaced by a bug item and `S2.R-TEMPDIR`
stays (a committed bug-report file remains wrong); spec 0.19.0, MINOR. (2) T3's real bug is TD-285 (`check-sprint-by-reference.ts`
reads another sprint's log as a baseline): T3's Layers add `scripts/lib/check-sprint-by-reference.ts`, its `evals/` fixtures and
`TECH-DEBT.md` (the TD row marked converted). (3) box 4 runs migrate on a scratch copy of that research copy. (4) box 2 drops the
CR fix (SPRINT-157 T1 owns it); T6 builds the topic-folder reading with its own must-FAIL fixture. T2's Cites corrects ADR-023 to
ADR-018 (the spec's extraction ADR). Re-confirm G2: signed in the same popup.

### 2026-11-02 | gate | G2 signed for T2-T6 (owner popup); builder check settled
G2 designs (scratchpad `g2-159/designs.md`), with the scope-change above applied and the builder check settled by fact:
- T2: additive spec 0.19.0 (MINOR, no rule id touched); findings named `work-type-unknown`, `bug-item-missing-repro`,
  `debt-item-missing-td`; the frontmatter parsers enumerated from the recon (only `run-v1-to-v2-fixtures.ts` is strict both ways and
  learns `type`; the others read their own keys); evidence holds images, JSON, text and header-exempt markdown, never `.log`;
  `BUG.md.template` rewritten in place (34 templates unchanged); the ADR number derived at build.
- T3: the bug-item shape lives in the template so triage stays within its cap; known and unknown causes become bug items, systemic
  stays a TD; diagnose's no-item path is unchanged; the TD-285 fix is "other G" (maintainer-only): a must-FAIL fixture and one run
  on its real artifact.
- T4: `/triage` fires at `/flow`'s Feed step, `/diagnose` at its Build route; an open bug is one outside `done/` and `cancel/`, the
  oldest is the lowest id; prime's read-order row is reworded, not lengthened; `/prime` and `/flow` are shown by headless runs; the
  close-listing box ticks at this sprint's real close.
- T5: untyped tasks read as `feature`, stated; bug-flavoured tasks are proposed too; a bug with no task gets a proposed new item
  (written only on approval); capture folders are mapped only where a task id is cited; `init` documents the evidence folder as
  created lazily; no business-notes move; skill line counts net zero.
- T6: one §2 row per topic folder (exact globs for the cap check); only the three named series move; the six stale headers are the
  two deployment guides, `docs/qa/README.md` and QA-001 to QA-003; the roadmap moves under the product rows; T2 opens the spec 0.19.0
  block and T6 appends to it.
builder-check · T2 · 6 contradictions · 5 questions · settled by fact and one owner ruling (bug rule kept)
builder-check · T3 · 4 contradictions · 5 questions · settled by fact and one owner ruling (TD-285)
builder-check · T4 · 3 contradictions · 5 questions · settled by fact
builder-check · T5 · 7 contradictions · 4 questions · settled by fact and one owner ruling (scratch copy)
builder-check · T6 · 5 contradictions · 5 questions · settled by fact and one owner ruling (CR fix to SPRINT-157)

Cites, per the scope-changes above: T2 cites `BUSINESS-NOTES.md` and T6 cites `QA.md` (named by their Done-whens, not touched).

### 2026-11-02 | scope-change | T2: Layers add `docs/work/README.md` and `docs/QA.md`
What broke: the work-item field schema lives in `docs/work/README.md` (the store row says so) and each qa-check leg has a row in
`docs/QA.md`; T2 changes both and neither is in its Layers. Impact: T2 Layers add the two files; no Done-when changes. Re-confirm G2:
not needed (the signed design names both edits).

### 2026-11-02 | scope-change | T2, T3: Layers add `.claude/CONTEXT.md`
What broke: the vocabulary SSOT carries the task frontmatter schema (T2 adds `type:`) and the bug-intake rule (T3 changes it);
neither task declared it. Impact: T2 and T3 Layers add it; the file stays within its 150-line cap (149 now) by editing lines in
place. Re-confirm G2: not needed (the signed designs make both changes).

Cites, per the scope-change of T1's findings: T1 cites `storm/` (finding F10, ruled to TASK-595).

### 2026-11-02 | progress | T2: typed work items and the bug item landed; VPS gate 472/0; TASK-591 done
Coordinator wrote the standard side (ADR-056; spec 0.19.0 MINOR: the typed work-store row, `work/evidence/TASK-NNN/`,
`product/business-notes.md` *(was `BUSINESS-NOTES.md`)*, the bug-intake text; the work README schema; the bug-item template;
`task-file.md`; README; CONTEXT.md). Codex built the check side (`check-work-type.ts`, its fixtures and qa-check leg; v1-to-v2 learns
`type`; the ownership walk skips `docs/work/evidence/TASK-<n>/`). Outside review (Codex, worktree-isolated, consequential engine
change): round 1 FIX (four med: the skip too wide, the legacy row not in `(was …)` form, evidence blocking §11 pruning, §12c), all
fixed with seeded fixtures; round 2 PASS. The gate then caught the always-loaded token budget (+20 tokens; trimmed), a stale index,
non-doc ids in a `related:` field, and two attribution slips; all fixed.
consequence · T2 · behaviour:material · governance:high
review · T2 · scoped outside review (Codex, worktree-isolated, 2 rounds, 4 med fixed, PASS) · behaviour:material · governance:high
