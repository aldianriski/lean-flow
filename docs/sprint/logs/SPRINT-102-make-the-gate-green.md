---
sprint: 102
slug: make-the-gate-green
owner: Maintainer
last_updated: 2026-09-16
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-102 — Execution Log

> Append-only companion to [`../SPRINT-102-make-the-gate-green.md`](../SPRINT-102-make-the-gate-green.md).
> Uncapped by design: this file grows with the work done, which is exactly why it is not inside the
> Plan's 400-line budget (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a
> new one.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.

### 2026-09-16 | promote | Plan locked at `ef02be0`; 4 tasks, 18 DoD

Promoted from the 2026-09-16 `/triage` governance pass. `TASK-349` · `TASK-353` · `TASK-352` ·
`TASK-351`. No `epic:` — gate work, following SPRINT-099's precedent rather than SPRINT-101's
(D1). The unattended run is **not** attempted here (D2).

### 2026-09-16 | scope-change | T4 `Layers:` corrected — two directory prefixes claimed in error

**What broke.** T4's `Layers:` was written at promote as `` `packages/`/`scripts/` `check-dod-delta.ts` ``.
Parsed, that yields the tokens `packages/` and `scripts/` — and a declared token ending in `/` is a
**directory prefix covering every path beneath it** (`check-layers-completeness.sh`, SPRINT-055). So
T4 was claiming ownership of the entire `packages/` and `scripts/` trees, including
`scripts/qa-check.sh` and `scripts/night-run.sh` — **both of which T1 owns**. The dispatch preflight
derives its shared-file ownership map from `Layers:`, so this would have reported T1/T4 as
contending for the gate scripts and forced them sequential for no reason.

**Impact.** No work was done under the wrong declaration — caught at G2, before the first task.
The real path is `scripts/lib/check-dod-delta.ts` (derived via `git ls-files`, and `attributeClaim`
confirmed to live there). `evals/dod-delta.test.ts` is added: T4 extends the suite, and the promote
declaration omitted it.

**Corrected to:** `scripts/lib/check-dod-delta.ts` · `evals/dod-delta.test.ts` · `evals/fixtures/dod-delta/`

**Re-confirm G2.** Logged under **L-100** — `Layers:` is a live declaration corrected per task, not a
frozen prediction to defend. The correction *narrows* T4's blast radius and removes a false overlap;
it does not change what T4 does, so § Scope is untouched and no acceptance criterion moves.

### 2026-09-16 | surprise | the G2 reachability pre-screen passed without examining anything

`sh scripts/lib/check-verify-reaches.sh docs/sprint/SPRINT-102-make-the-gate-green.md` returns
`PASS … (0 claimed target(s) confirmed reachable, 4 judgment-method clause(s) left to G2)`.

**Zero targets confirmed.** Every `*Verify:*` clause in this Plan fell through as a judgment method,
so the pre-screen asserted nothing about any of them and still printed PASS. That is the L-136 shape
the gate exists to catch, arriving in the instrument itself: a green line that says nothing about its
subject. Recorded rather than treated as a pass — **RUNS and PROVES are entirely the coordinator's at
G2 for all four tasks**, and the pre-screen is not evidence for any of them.

### 2026-09-16 | progress | G1 + G2 signed by the owner; D6 and D7 taken

**G1 (batch, full checklist — no task carries `origin: decomposer`, so no fast-path):** goal ·
size (M/S/S/S, no `L`) · files (`check-layers-completeness` 8 PASS / 0 FAIL) · out-of-scope ·
assumptions — all confirmed. A1/A2/A3 stay unconfirmed **by design**, each with a confirm-at-execution
method named in its own task; surfaced at the grill rather than waved through.

**G2 (batch):** ownership map derived from `Layers:` with prefix awareness — **T2's
`evals/fixtures/` covers T4's `evals/fixtures/dod-delta/`**, so T2 owns it and commit order is
T2 → T4 (T4 already `Depends-on: T2`). The coordinator owns the sprint file and this Log; no task is
assigned them. An exact-token overlap query found nothing and was **wrong** — the governing rule is
directory-prefix containment, and only re-running with a prefix test surfaced the real overlap
(L-198: the second query must vary the SELECTION, not the direction).

**Owner decisions:** D6 — mode-aware ceiling in `qa-check.sh`, launch path not restructured.
D7 — the ruling earns an ADR, because it reverses TD-117's recorded direction.

**Review skip-table lookup (TD-092 — recorded at consultation, not at outcome):**
- `consequence · T1 · behaviour: none (a ruling + a threshold) · governance: HIGH (reverses a recorded TD ruling; ships an ADR)` → scoped `sonnet` reviewer, governance axis
- `consequence · T2 · behaviour: HIGH (restores 156 assertions to the gate) · governance: low` → Tier G ⇒ outside reviewer, **worktree-isolated** (L-165 · L-168)
- `consequence · T3 · behaviour: none (prose) · governance: HIGH (a launch precondition three sprints misread)` → scoped `sonnet` reviewer, governance axis
- `consequence · T4 · behaviour: MED (a new FAIL arm) · governance: MED` → Tier G ⇒ outside reviewer, **worktree-isolated**

**Dispatch plan:** T1 stays with the coordinator (decision tier, owner rulings). T2 ∥ T3 dispatch in
parallel, worktree-isolated, disjoint. T4 follows T2.

### 2026-09-16 | surprise | T3 was already satisfied before it was dispatched — a planning defect, not a win

T3 returned **no edit needed**, working tree clean. Every one of its four DoD items was already true
when the Plan froze. Verified independently by the coordinator rather than accepted on the agent's
report:

- **DoD 1–2 (the live copies).** The `TASK-319` row's criterion was corrected at the **2026-09-16
  `/triage`**, which landed in `ef02be0` — *the plan-locked commit itself*. So the coordinator fixed
  the defect at triage **and then filed `TASK-352` to fix it**, promoted that task as T3, and
  dispatched an agent to do work that was already in the commit the agent checked out. The remaining
  `not all-J2` hits are all legitimate: SPRINT-102 describing the defect, `TECH-DEBT.md:334` (TD-164)
  recording it historically, `TODO.md` quoting it in contrast to the STRICT form.
- **DoD 3 (`gates_signed:`).** Pre-flight item 4 has required it since `3a1cfc1` — **SPRINT-057 T5**,
  roughly 45 sprints ago. The criterion could not have failed at any point in this sprint.
- **DoD 4 (TD-164).** Filed by the coordinator at the same `/triage`, hours earlier.

**Why this matters more than the wasted dispatch.** Three of four criteria were **unfalsifiable at
freeze** — not unreachable in L-136's sense (no check was mis-scoped), but *already satisfied*, which
presents identically: the box ticks, the evidence is real, and the task demonstrated nothing. L-111
asks whether a criterion is reachable *after* the decisions it rests on; this is its mirror — **is
the criterion still capable of failing at the moment it is frozen?** A DoD written against a defect
you fixed on the way to writing it is a green box that proves only that you already knew.

The tell was available at promote and was not looked for: `TASK-352`'s own `touches:` line said
*"`TODO.md` (TASK-319 row — **corrected at this triage**, verify it stuck)"*. It said so plainly.

**Not reverted.** T3's four boxes are ticked with evidence naming what actually satisfied them and
when — an honest record beats a vacant one. The dispatch also bought one real thing: an independent
sweep confirming the live population is genuinely clean, which was `A3`'s **UNCONFIRMED** assumption
and is now confirmed. A3 is discharged.

**Brief defect, reported not absorbed.** The brief told the agent to expect
`grep -c '^- \[ \] TASK-' TODO.md` = **14**; it is **15**. The coordinator counted before filing
`TASK-353` and then froze the stale number into a dispatch brief — L-130's shape (a figure entering a
frozen artifact is a query result) at the brief grain. The agent flagged it rather than reconciling
it silently, which is the behaviour the brief asked for and the reason it was caught.
