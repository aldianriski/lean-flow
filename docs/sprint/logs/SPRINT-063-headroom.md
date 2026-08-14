---
sprint: 063
slug: headroom
owner: Maintainer
last_updated: 2026-08-14
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-063 — Execution Log

> Append-only companion to [`../SPRINT-063-headroom.md`](../SPRINT-063-headroom.md). Uncapped by design:
> this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (DOCS_Guide §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.

<!-- Newest entries at the BOTTOM: this reads as a chronology, unlike CHANGELOG.md which is
     newest-first. Event is one of: promote · progress · surprise · scope-change · park · blocker ·
     complete · close. -->

### 2026-08-14 | promote | Plan locked, batch G1+G2 signed

Four tasks, one per EPIC-002 Closed-when condition. Gates signed `G1,G2 @ 222b437`. Waves:
W1 = T1 · T2 · T4 (disjoint), W2 = T3. T2 dispatched worktree-isolated; T1 run inline (decision class).

### 2026-08-14 | surprise | T1 — DoD 2's hypothesis was already falsified two sprints ago, in writing

T1's DoD requires testing L-008/TD-006's hypothesis (`CONTEXT.md` accretes duplication of its
satellites) "before any number moves". **It was tested at SPRINT-060 T1 and falsified, and the result
is recorded in ADR-017.** Quoting its § Context: *"The diet pass found nothing removable… every
`CONTEXT.md` section that touches a satellite's territory already terminates in a pointer… The
duplication that exists runs the other direction: `README.md` restates the gates and modes as a
front-door summary and defers to `CONTEXT.md` as SSOT. Deleting those from `CONTEXT.md` would not
remove a copy; it would remove the original."* ADR-017 § Consequences states it outright: *"TD-006's
premise is now known to be false."* The `TD-006` row has since been deleted from the ledger entirely.

So the DoD line is discharged **by reading, not by a new measurement** — it is a documented behaviour,
which L-094 says is closed by reading rather than by waiting for a measurable signal. Re-running the
pass would re-derive a falsified hypothesis, which is what L-091 forbids.

**Why this matters beyond the one line:** TASK-196's `assumes:` block cites ADR-017 *and* points at
L-008/TD-006 as naming "the actual mechanism", in the same breath. ADR-017 is what killed that
mechanism. The task was filed carrying a premise its own citation had already retired — an L-114
instance (a factual `assumes:` that rides through promote unchallenged because it wears the same
syntax as a judgement call), caught here rather than after work was done against it.

### 2026-08-14 | surprise | T1 — the three files are three different problems, and one ADR may not cover them

Measured at T1 start rather than trusted (A1 said to re-measure):

```
.claude/CLAUDE.md    80 / 80    15% headroom needs ≤ 68   → −12   (0% headroom today)
.claude/CONTEXT.md  132 / 150   15% headroom needs ≤ 127  → −5    (12% headroom today)
TODO.md             256 / 150   15% headroom needs ≤ 127  → −129
```

They are not one problem with three instances:

- **`CONTEXT.md`** — growth measured at **0.83 lines/sprint** and ruled *by design* (ADR-017: "the file
  is at its cap because the loop works"). 150 was chosen to buy ~24 sprints; it is 2 sprints old and
  already at 12%. A second raise this soon is the specific thing ADR-017 warns about: *"Moving a second
  cap on the strength of the first one's argument is exactly the ceremony §7 exists to prevent."*
- **`CLAUDE.md`** — 80/80, zero headroom. ADR-017 deferred it explicitly and named the trigger:
  *"when a rule cannot land in `CLAUDE.md`, that ADR gets written then, with its own diet pass."*
  **That moment is this task.** It needs its own diet pass and its own argument — not an inherited one.
- **`TODO.md`** — not the same kind of object. It is a **ledger**, not an SSOT contract, and §11
  already treats its cap as a prune trigger ("flag in the governance review; prune with the user").
  Its breach is arithmetic: 176 of its 256 lines are Backlog entries across 10 tasks, because the
  standard's own § Task entry shape mandates ~17.6 lines each. §11's close-time prune of this sprint's
  four promoted entries buys back only ~66 lines, leaving ~190 against a 150 cap.

**Consequence for the DoD:** "≥15% headroom" applied uniformly treats a ledger and two SSOT contracts
as one object. The criterion is reachable for each (its own text permits a raised cap by ADR), but not
by one ruling — and ADR-017 forbids the one-argument route. Owner ruling requested before anything is
written; per the frozen-Plan rule nothing in § Plan is edited until that ruling lands.

### 2026-08-14 | progress | T1 — CLAUDE.md diet pass found removable content; trimmed, cap held at 80

Owner ruled: run CLAUDE.md's own diet pass first (the trigger ADR-017 named), then rule on evidence.

**The pass found something, so the ruling is trim — not raise.** `## File Structure` was a
hand-maintained codemap duplicating `docs/architecture/overview.md` § Directory structure, which is a
strict superset of it. `CONTEXT.md` § Orientation already forbids exactly this: *"Where-things-live =
`docs/architecture/overview.md`; no hand-maintained codemap (it rots — LAW 3)."* This is the **inverse**
of ADR-017's CONTEXT.md finding: there, deleting would have removed the original; here it removes a copy.

No signal was compressed away (§2 forbids that route). The five per-skill `references/` one-liners were
the only content unique to CLAUDE.md, so they were **moved** into `overview.md` § Directory structure
before the block was cut — signal relocated, never absent.

```
.claude/CLAUDE.md              80 → 61   (cap 80; 15% needs ≤68) → 24% headroom ✓
docs/architecture/overview.md  97 → 103  (cap 150)               → absorbed the moved detail
```

`CLAUDE.md`'s cap stays at **80**. All eight sections survive.

### 2026-08-14 | scope-change | T1 — the TODO.md satellite split costs 25 files of rewiring, not 1

**What broke.** Owner ruled the `TODO.md` route as a §6 split — move § Backlog to a satellite behind a
pointer. That ruling was made against the cap arithmetic, which was measured. Its **wiring cost was
not**, and it is the larger number.

**Measured now:** `TODO.md` is referenced **72 times across 25 files**, and **22 of those references
name § Backlog specifically** — `/prime`, `/triage`, `/task-decomposer`, `/lean-doc-generator`
(SKILL + DOCS_Guide §2/§11 + init + migration-map), `dispatch.md`, three `scripts/lib/check-*.sh`,
`qa-check.sh`, `CONTEXT.md`, `README.md`, and nine eval fixtures/harnesses.

**Impact.** T1's declared `Layers:` names six paths; the split touches roughly twenty-five. Executing
it inside T1 would either blow through the declared blast radius G1 signed, or ship the satellite
half-wired — which is L-020 exactly ("a behaviour written only in its own file is half-shipped"), and
the checkers would be the first to break because they glob `TODO.md` directly.

**Re-confirm G2 required.** The other two files are already resolved (`CLAUDE.md` trimmed above;
`CONTEXT.md` ruled to hold at 150), so this affects only the third leg of T1's Acceptance. Owner
ruling requested on the route; § Plan remains unedited until it lands.

### 2026-08-14 | surprise | worktree was 3 sprints stale, corrected before the citer check ran
T2. The dedicated worktree was branched before SPRINT-061/062/063 merged to `main` (last commit
`40603a6`, `sprint(60): record close_commit sha`). Working state showed only 2 of the 4 candidates as
`status: superseded` (`loop-hygiene-findings.md`/`loop-hygiene-workstreams.md` still read `current`,
and `docs/research/platform-readiness-audit.md` + `docs/research/gauntlet-loop-delta.md` — both named
in the sprint's own Scope/A3 — did not exist at all). Fast-forward merged `main` (`git merge --ff-only
main`, `40603a6..85490ac`, no local commits lost — only an uncommitted `docs/knowledge-index.md`
regen, discarded and re-run after) before doing any real work; a citer check against stale state would
have been wrong on its face. Confirms L-021's pattern one layer down: not the plugin cache this time,
but the worktree copy of the repo itself.

### 2026-08-14 | progress | T2 citer check — all 4 candidates, evidence per candidate
Ran `sh scripts/lib/check-research-archive.sh` (the actual §11 gate `qa-check.sh` delegates to) and
independently verified every citer it reported by reading the citing line in context (L-108: a raw
`grep -rl` match is not proof by itself — confirmed each is a real link/frontmatter `related:`
reference, not prose *about* the doc).

- **`behavioral-eval-feasibility.md`** (superseded) — live citers: `docs/research/graph-engineering.md`
  ("...until `behavioral-eval-feasibility.md` is checked: the suite exists under `evals/`..."),
  `evals/README.md` (cites the same four structural assertions), `docs/research/qa-gate-timing.md`
  (`related: [behavioral-eval-feasibility]`), `evals/run-research-archive-fixtures.sh` (fixture
  comment naming the doc's verdict). **Kept in place.**
- **`loop-hygiene-prd.md`** (superseded) — live citers: `docs/adr/ADR-015-cap-precision-and-grandfathering.md`
  (`status: accepted`, cites the 214→118 diet directly), `docs/LEARNINGS.md` (L-098's body quotes its
  cap history), `TODO.md` TASK-199 (`touches: ... docs/research/loop-hygiene-prd.md`, `state: ready`
  — an active backlog task built on it), `docs/research/architecture-baselines.md`
  (`related: [loop-hygiene-prd]`). **Kept in place — T3's cap-breach question does NOT dissolve** (139
  lines > 120, confirmed by `qa-check.sh`'s own OVER-CAP line); T3 still has to rule it, exactly as
  TASK-199 already frames.
- **`loop-hygiene-findings.md`** (superseded, SPRINT-061 T2) — no citer outside `docs/research/`
  itself: only `loop-hygiene-prd.md` (`[loop-hygiene-findings.md](loop-hygiene-findings.md)`, a real
  link) and its own `related:` mirror in `loop-hygiene-workstreams.md`. Both are within the excluded
  categories' spirit *except* `loop-hygiene-prd.md` is not archived and not closed history — it is
  a present, readable doc whose own body still links down to this one as "detail." §11's exclusion
  list is exhaustive (`docs/sprint/archive/`, `docs/changelog/`, the generated index) and does not
  reach a present sibling doc, so per the letter of §11 and the actual checker this counts. **Kept in
  place** — archiving it would leave `loop-hygiene-prd.md`'s own link dangling.
- **`loop-hygiene-workstreams.md`** (superseded, SPRINT-061 T2) — same shape: only cited from
  `loop-hygiene-prd.md` (`[loop-hygiene-workstreams.md](loop-hygiene-workstreams.md)`, a real link).
  **Kept in place**, same reasoning.

**Applied count: 0.** `sh scripts/gen-index.sh` re-run — no-op (`docs/knowledge-index.md` already
current from SPRINT-062's close). `bash scripts/qa-check.sh` → `152 pass, 0 fail`, including all four
`research-archive:` lines as PASS.

### 2026-08-14 | progress | T1 — TODO.md re-ruled on measurement: cap raised by ADR-019, split deferred

Owner re-ruled after the 25-file wiring cost was measured: **raise the cap by ADR**, not the §6 split.

**ADR-019** — `TODO.md` `~150 soft` → **`320 soft`**. The number is derived, not chosen: scaffolding
measured at ~80 lines, entries at **~17.6 each** (176 lines / 10 tasks), driven by § Task entry shape's
ten mandatory fields. 320 budgets a working backlog of 13–14 tasks; at today's 256 that is 20% headroom.
Kept **soft** deliberately — the opposite call to ADR-017's hard cap, because §11's response to this
cap is a *prune conversation with the owner*, which needs the breach reported rather than the gate
failed. No row added to `doc-caps-grandfathered.txt` (ADR-015 rule 2; the file stays empty).

Wired: DOCS_Guide §2 row + §11 whole-file row + the §2 prose reference, and `docs/DECISIONS.md`.

**Final state of T1's three files:**

```
.claude/CLAUDE.md    61 / 80    24% headroom  ✓  (trimmed — a copy removed, cap held)
TODO.md             256 / 320   20% headroom  ✓  (ADR-019 — the number was wrong, not the file)
.claude/CONTEXT.md  132 / 150   12% headroom  —  held at 150 by owner ruling
```

**DoD 4 is ticked under the CONTEXT.md ruling, not under literal satisfaction** — stated plainly rather
than papered over (L-088). `CONTEXT.md` sits at 12%, below the DoD's stated 15%. The owner ruled that a
flat headroom percentage is the wrong instrument for a file whose growth is measured (0.83 lines/sprint)
and deliberate, and whose diet pass already found nothing removable. That is a ruling on the criterion,
logged before the tick and not a re-reading of the words to fit what was built.

### 2026-08-14 | progress | T2 merged back; D2's sequencing hypothesis falsified

T2's worktree branch carried one commit (`ef73c5b`) touching **only** this Execution Log — no
`docs/research/*` moves, consistent with its applied count of 0. Its two entries were merged into this
file by the coordinator and the worktree removed.

**D2 is falsified, and that is worth recording rather than quietly dropping.** D2 ruled "subtraction
precedes adjudication" — T2 before T3, on the hypothesis that archiving `loop-hygiene-prd.md` would
dissolve T3's cap question. It did not archive: ADR-015, `LEARNINGS.md`, `architecture-baselines.md`
and TASK-199 itself all cite it live. **T3's question stands in full**, and T3 now has two docs to rule
rather than one-or-two. The sequencing did no harm — it cost nothing to run T2 first, and the answer
was only knowable by running it — but the Decision as written predicted an outcome that did not occur.

### 2026-08-14 | surprise | worktree-isolated dispatch breaks two find-based gate checks

Not T1 or T2's work — an infrastructure finding surfaced by running them in parallel, recorded so it is
not rediscovered.

`Agent(isolation: "worktree")` places a full repo copy at `.claude/worktrees/<agent-id>/`, **inside the
repo**. Two consequences, both live:

1. **`check-ephemeral-intake.sh` false-positives.** It walks the tree with `find` and excludes fixtures
   via `grep -v '^evals/fixtures/'` — correctly *position-anchored*, which is what L-108 asks for. A
   nested repo copy defeats the anchor: `.claude/worktrees/<id>/evals/fixtures/…` does not match `^`.
   The gate reported a real fixture as a violation for as long as the worktree existed.
2. **`.claude/worktrees/` is not in `.gitignore`**, so a plain `git add -A` would commit an entire
   second copy of the repo. Only deliberate per-path staging avoided it here.

Neither is T1/T2/T3/T4's scope. Filed as a candidate for the close Retro's tech-debt bucket rather than
fixed inline — it touches the checkers, which is T4's territory and EPIC-004's beyond that.
