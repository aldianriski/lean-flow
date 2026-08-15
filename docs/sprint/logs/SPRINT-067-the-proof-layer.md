---
sprint: 067
slug: the-proof-layer
owner: Maintainer
last_updated: 2026-08-15
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-067 — Execution Log

> Append-only companion to [`../SPRINT-067-the-proof-layer.md`](../SPRINT-067-the-proof-layer.md). Uncapped by design:
> this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (DOCS_Guide §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.

<!-- Newest entries at the BOTTOM: this reads as a chronology, unlike CHANGELOG.md which is
     newest-first. Event is one of: promote · progress · surprise · scope-change · park · blocker ·
     complete · close. -->

### 2026-08-15 | progress | G1 + G2 signed off; preflight CLEAR; execution dispatches this sprint
Batch G1 fast-path — both tasks `origin: decomposer`, owner confirmed scope unchanged (the
depends-on amendments record TASK-207's resolution as ADR-021, not a scope shift). G2 signed with
the dispatch design: both tasks are `execution`-class, so Implement goes to `sonnet`
`general-purpose` builders per ADR-010 — sequential in the shared tree (D1: `night-run.md` Part 4 is
shared, T1 → T2; no worktrees, so TD-053's trap stays untriggered — A2). Preflight: no cycle ·
ownership clear (dispatch.md/SKILL.md/evals = T1 · review-scoping.md/template = T2 · night-run.md
sequenced) · waves T1=0 / T2=1 · base `bcc8bd9` == live HEAD → **CLEAR**.
`gates_signed: G1,G2 @ bcc8bd9` stamped. Skill-freshness note: installed orchestrator is 1.38.0 and
predates ADR-021/022 — Review/G2 procedure applied from repo source (L-021); run is attended.
Note on T1's real-input DoD leg (D3): it ticks at the run's exit — the pass fires on this run's own
final merge-back, and the coordinator writes the verdict into the exit rollup; the builder ships the
definition and the must-FAIL leg.

### 2026-08-15 | progress | T1 · builder report (dispatched `sonnet`, returned per protocol)
Wired the system-verify pass: dispatch.md § Merge-back queue gained "System verify (the final-wave
full gate)" — gate command discovered (manifest scripts → Makefile/justfile → CI step → ask attended /
`no-gate-discovered` rollup line unattended), verdict read from OUTPUT never exit code, TD-053
worktree-cleanup ordering named, `sh scripts/qa-check.sh` cited only as one host's discovery output
(L-015). Part 4 carries the rollup line as a supplementary line beside the ADR-022 retry line.
SKILL.md step 6 hooks it before `close`, 107/140 unchanged. Fixtures:
`evals/fixtures/system-verify/` + checker `evals/lib/check-system-verify-block.sh`. **Builder
deviation, accepted with its reason:** checker + harness nested under `evals/` (not `scripts/lib/` +
top-level `evals/run-*.sh`) to stay inside T1's declared Layers and honour "qa-check.sh: run, never
edited" — the wiring into qa-check.sh is a **stated gap** for the close-retro follow-up bucket.
Coordinator re-ran the harness (green) before review.

### 2026-08-15 | progress | revise · T1
Scoped review returned one concrete violation (Spec) + one suggestion (Standards); the loop fired.
`Spec: owner-ruling-format-undocumented → fixed` (the checker asserted `^owner-ruling:.*system-verify`
while no shipped procedure documented any shape — a false-positive trap on correct behaviour the day
it gets wired; dispatch.md § System verify now specifies `owner-ruling: system-verify — <ruling +
reason>`, `<ruling>` ∈ {overridden, fixed-and-rerun}, night-run.md Part 4 references the same shape,
regex tightened to match the documented contract exactly) · `Standards: archive-skip-coverage → fixed`
(the `*/archive/*` skip branch had zero fixture coverage against sibling convention; `archived/`
fixture + case 5 added — the violation shape verbatim under `archive/`, asserted skipped). Delta
re-review: both fixed, non-conforming phrasing correctly rejected, pure-insertion diffs, no new
violation. One retry total. Harness 5/5 green · QA 145/0.

### 2026-08-15 | progress | T2 `Layers:` corrected — TD-055's row lives in TECH-DEBT.md (L-100)
Recording before declaring: T2's DoD box 3 requires "TD-055 row updated either way", but
`TECH-DEBT.md` was not in T2's `Layers:` — the declaration was written against the settle-or-decline
*outcome*, not the ledger the record lands in. Declared now. Division of labour: the **builder**
implements the settle inside T2's artifact files (the template's event-kind comment is the authoring
point TD-055 says is missing) and returns a recommendation; the **coordinator** writes the TD-055 row
update — the ledger stays coordinator-owned like the sprint file and Log.

### 2026-08-15 | progress | T2 · builder report (dispatched `sonnet`, returned per protocol)
Per-criterion evidence landed: night-run.md Part 4 (`Tn.k · ticked|open|overridden · <evidence: test |
check | fixture | review | owner-ruling>`, emitted always — a `ticked` line with no named evidence is
the silent tick ADR-021 closes), mirrored in review-scoping.md's revise-loop outcome bullet, taught in
SPRINT.md.template's DoD comment (✓-evidence ticks + *Verify:* clauses, generic wording). TD-055:
builder correctly declined a note in its files — none is the event-taxonomy authoring point, a fourth
location repeats L-099 — and recommended the rename; coordinator recorded the ruling on the row
(rename → follow-up task at close). One judgment call flagged and accepted: per-criterion lines are
mandatory-always, same discipline as the header count, unlike the conditional retry/system-verify lines.

### 2026-08-15 | progress | revise · T2
Scoped review returned a concrete violation per axis; the loop fired — second firing this sprint, both
on dispatched builders. `Spec: false-ladder-equivalence + undefined-analogue → fixed` (the block
claimed its evidence vocabulary was "the same four" as the comparand ladder — only 2 of 4 overlap; it
also referenced a "per-criterion analogue" of the `owner-ruling:` shape defined nowhere. Now: ladder
quoted rung-for-rung as what Spec *measures against*, distinct from what *proved a tick*; `overridden`
cites the ruling's log entry as a prose pointer — deliberately NOT a second machine-asserted shape
nothing consumes, TD-052's trap, the mirror of T1's revise which documented a shape a checker DID
assert) · `Standards: placement-vs-done-rule → fixed` (per-criterion lines are their own block after
the state lines, `Tn.k` carries identity, reconciliation with "done tasks need no per-task line"
stated in so many words). Delta re-review: both fixed, single pure-insertion hunk, no collateral,
grep confirms exactly one machine-asserted `owner-ruling:` shape repo-wide. One retry total. QA 145/0.