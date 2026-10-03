---
owner: Maintainer
last_updated: 2026-10-03
update_trigger: a measurement round is appended
status: active
id: epic-017-effectiveness-log
tags: [process, tooling]
domain: governance
related: [epic-017-effectiveness]
---

# EPIC-017 effectiveness — the "after" measurement log (SPRINT-114 T5, TASK-386)

> Append-only companion to [`../epic-017-effectiveness.md`](../epic-017-effectiveness.md), which holds the method and the
> "before" baseline at `4136ded` and sits at a `retain` disposition over its cap. That is why the "after" figures land here
> (STANDARD §2 `research/logs/` row · ADR-014's mechanism). **Never edit a past round**; a correction is a new round.
> The method is re-run **unchanged**. A key that moved is a method failure, not a miss.

## Round 1 — "after" retrieval key (committed before any answer is collected)

Re-verified at HEAD `8a6a989` (each key path exists on disk). Probes R3–R12 keep the "before" keys verbatim. **R1 and R2 move
to their v2 locations**, as the baseline itself recorded ("R1/R2 keys are layout-dependent, so the after-run scores the same
probes against the v2 locations"):

| # | Probe (verbatim) | "after" answer key |
|---|---|---|
| R1 | Where does a new TASK get written today? | `docs/work/backlog/` (`docs/work/backlog/TASK-NNN-<slug>.md`) |
| R2 | Which file points to the currently active sprint? | the top-level `docs/sprint/SPRINT-NNN-<slug>.md` whose frontmatter is `status: active` (v2 has no separate pointer file) |
| R3–R12 | unchanged | unchanged (see the parent's § 2 Retrieval) |

Scoring is unchanged: **hit** = names the key path exactly, or names the key's directory for a directory-level key; anything else
is a **miss**. For R2, naming `docs/sprint/` plus `status: active` is the hit; naming `TODO.md` is a miss, because that file no longer
exists.

**Completeness is not re-run (owner ruling 2026-10-03).** The metric is *first decomposition pass ÷ settled set* for one epic.
Since the store landed there has been no new epic decomposition, so there is no "after" event to measure. A synthetic
re-decomposition was offered and declined (it would have been an artificial, contaminated input). The comparison is recorded as **not
measurable**, the verdict rests on retrieval + recurrence, and the gap is carried to the next real epic decomposition.

## Round 2 — "after" results at `fb3a526` (SPRINT-114 T5)

### Retrieval (after): **6 / 12 strict** (before 11 / 12)

Answered 2026-10-03 by a fresh Haiku subagent restricted to `.claude/CLAUDE.md` + `.claude/CONTEXT.md` (its own FILES READ line names
only those two). The key was committed first in Round 1 (`fb3a526`).

| # | Answer given (verbatim) | Score | Is the key stated in the two files? |
|---|---|---|---|
| R1 | `docs/work/<status>/TASK-NNN-<slug>.md` | miss (near: right store, no `backlog/`) | only indirectly: CONTEXT gives the generic `docs/work/<status>/` path; `backlog/` appears only in the `/triage` row (L26) |
| R2 | unknown | miss | **yes**: CONTEXT L104 "`docs/sprint/SPRINT-NNN-<slug>.md` = the active sprint" |
| R3 | `docs/sprint/SPRINT-NNN-<slug>.md` | hit | |
| R4 | `docs/sprint/logs/SPRINT-NNN-<slug>.md` | hit | |
| R5 | `docs/work/TECH-DEBT.md` | miss | **yes**: CONTEXT L103 "`TECH-DEBT.md` (root)" |
| R6 | `docs/LEARNINGS.md` | hit | |
| R7 | `/lean-doc-generator` | hit (the skill name is the key's directory, as in "before") | |
| R8 | `CLAUDE.md § Definition of Done (or ADR-006)` | miss strict (path not `.claude/CLAUDE.md`, answer hedged) | yes |
| R9 | `spec/STANDARD.md` | hit | |
| R10 | `docs/architecture/overview.md § Directory structure` | hit | |
| R11 | unknown | miss (same as "before") | no `docs/adr/` path in either file |
| R12 | `docs/work/.out-of-scope/<slug>.md` | miss | **yes**: CONTEXT L26, L148 `.out-of-scope/<slug>.md` |

Scored strict, by the method's rule. Read leniently (R1 near-miss and R8 counted), it is 8 / 12. **Attribution:** of the 5 misses new since
"before" (R1, R2, R5, R8, R12), **3 (R2, R5, R12) are stated plainly in CONTEXT.md**, so they are answerer misreads, not missing
documentation. R1 is a real doc ambiguity (the generic path is the stated one). A single run cannot separate a doc regression from answerer
variance, and the method prescribes a single run, so no re-run was taken to get a better score.

### Recurrence (after), last 10 closed sprints SPRINT-104…113 (before: 096…105; overlap at 104 and 105)

| Sprint | (a) seen-field | (b) count-line adds | Agree? |
|---|---|---|---|
| SPRINT-104 | 1 | 1 | yes |
| SPRINT-105 | 2 (manual supplement L-209, L-211, as "before"; L-210 names no sprint) | 0 | no (same cause as "before") |
| SPRINT-106 | 2 | 2 | yes |
| SPRINT-107 | 2 | 2 | yes |
| SPRINT-108 | 1 | 1 | yes |
| SPRINT-109 | 1 | 2 | **no** |
| SPRINT-110 | 1 | 2 | **no** |
| SPRINT-111 | 2 | 2 | yes |
| SPRINT-112 | 1 | 2 | **no** |
| SPRINT-113 | 0 | 2 | **no** |
| **Total** | **13** | **16** | |

Selector (b): 16 `sprint(104…113)` commits touched `docs/LEARNINGS.md`; added `- count:` lines were summed per commit (the first extraction of
the sprint number was itself wrong, bucketing by a non-number, and was fixed and re-run before any figure was read). Selector (a)'s
promoted-entry `Seen Sprint-…` clause matched nothing in the window.
**Where they disagree:** (a) takes the *first* sprint token of a `- seen:` line, so a learning first seen earlier and bumped in-window counts
under its first sprint, not the bump's. That is why (b) runs higher at 109/110/112. **SPRINT-113 is a blind spot this sprint created:**
L-224 (seen twice in SPRINT-113) was collapsed to a promotion pointer at SPRINT-114 promote, and the pointer format (`count 2: SPRINT-113
…`) carries no `- seen:` line. The method's selector (a) cannot see a collapsed entry at all, a format the "before" baseline never met.
Recorded, not patched; the method is re-run unchanged.

### Verdict — stated either way, as Closed-when 7 requires

| Measure | Before | After | Reading |
|---|---|---|---|
| Completeness | 9 / 26 = 0.346 | **not measurable** (no post-store epic decomposition; owner ruling) | no comparison |
| Retrieval | 11 / 12 | **6 / 12** strict (8 / 12 lenient) | **worse as measured**, but 3 of 5 new misses are stated in the docs: n = 1 noise cannot be separated from regression |
| Recurrence | (a) 22 · (b) 19 | (a) 13 · (b) 16 | **lower on both selectors** (same direction, differently-wrong instruments). Caveats: windows overlap at 104/105, (a) is blind at 113, and a lower count can mean fewer recurrences *or* less recording |

**Verdict: the store's effectiveness is NOT demonstrated by this method.** The one measure that moves the right way (recurrence, both
selectors) is weak evidence on an overlapping window. Retrieval did not improve, and its strict score fell. Completeness has no "after" event.
What *is* shown is structural, not effectiveness: decomposition no longer hits a length limit (Closed-when 1), and the layout cut is safe in
both directions (T3). Fewer lines and fewer checkboxes are not the criterion, and this verdict does not lean on them.
**Follow-ups:** (1) measure completeness at the next real epic decomposition; (2) R1's ambiguity: CONTEXT names `docs/work/<status>/`
but not where a *new* task lands; (3) the retrieval method's single-run design cannot separate answerer variance from doc quality.
