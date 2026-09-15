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
