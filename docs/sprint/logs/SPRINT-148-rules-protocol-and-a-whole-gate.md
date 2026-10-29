---
sprint: 148
slug: rules-protocol-and-a-whole-gate
owner: Maintainer
last_updated: 2026-10-29
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-148 — Execution Log

> Append-only companion to [`../SPRINT-148-rules-protocol-and-a-whole-gate.md`](../SPRINT-148-rules-protocol-and-a-whole-gate.md). Uncapped by design:
> this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> Rendered at promote, in the same commit as `plan locked`; its first entry is the `promote` entry
> carrying the signed governance checklist.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.
> Its heading names every `Tn` it changes, and every path the entry names sits in one of those tasks' `Layers:` or `Cites:`.

### 2026-10-29 | promote | plan locked, governance signed, four members: clinic rules and spec, the trial protocol, a whole off-host gate
Promote governance checklist, signed by the owner by popup:
- ☑ L-promotion: none due. Census 17 active + 222 promoted + 1 superseded = 240, equal to the heading count.
- ☑ TD aging: 98 of 100 open rows aged against sprint 148. Second route: 105 rows − 5 resolved = 100 open; TD-279 (146)
  and TD-280 (147) are not aged. Newly aged: none (no row filed at 145). No `high` row.
- ☑ doc-aging, §11: no deletion due (the rows resolved at 146 come due at 149). No pruning: SPRINT-145's TASK-525 and 526
  still have live citations (2 and 1), and TASK-524 still has its fixture mention. git grep and ripgrep agree, and the
  TASK-367 control hits 2 on both. No CHANGELOG rotation, no LEARNINGS collapse.
- ☑ doc-aging, §2: no breach; three `retained:` rows. CLAUDE.md 79/80, CONTEXT.md and overview.md 149/150.
- ☑ epic rollup currency: EPIC-023's SPRINT-147 row is closed with `751df00d`, header current. ☑ epic coverage: 5 of 5
  (condition 1 → TASK-544, 545 in backlog). ☑ roadmap: none. ☑ handoff ledger: none.
Intake: `/triage` (`0b8dec25`, owner `y`) set TASK-535 and 542 ready, since their blockers TASK-534 and 533 are done. TASK-532 stays
`ready` beside its dependency TASK-531 by owner ruling, ordered in this Plan as T4 after T3. Composition by owner popup.
Size check: two M, two S, no `L`. All four are `origin: decomposer`. Epic: EPIC-023 (T1, T2); T3 and T4 carry no epic.
`promote-check`: 13 pass, 0 fail. Pre-dispatch preflight: CLEAR (waves T1 = T2 = T3 = 0, T4 = 1; the four shared files
owned T3 -> T4).

### 2026-10-29 | scope-change | T2 -- `docs/research/logs/ab-measurements.md` joins T2's `Layers:`
What broke: T2's paid real run (P6) appends its smoke row to the harness's default run log, which sits outside `evals/ab/`.
Impact: one Layers token added to T2's Plan line; no other task touches the file, so the overlap map is unchanged. Re-confirm
G2: signed with the G2 entry below (owner popup).

### 2026-10-29 | G2 | G1 fast-path + batch G2 signed for T1-T4 (owner popup), `gates_signed: G1,G2 @ 0c33d7ce`
G1: all four `origin: decomposer`, scope unchanged since intake. G2 designs: T1 adds three clinic rules test-first (page + API + DB
test each) and the spec under six named headings. T2 is a two-phase D9 trial: the design goes to a file, a Layers scope check and an
isolated judge sign it, the session resumes, and the post-build diff is re-checked; any popup or permission denial is parked; the fixture
repo only. T3 runs both stages in one ssh call, judges each from its own log, and pins the stage list to `package.json`. T4 makes
the verdict the last `QA-CHECK:` line, closes the exit set at 0/1/2/5 and warns on a dirty tree.
Owner rulings: A3, the clinic's hours live in **Asia/Jakarta** (fixed, one zone); rule values as proposed (24 h cancellation window
with a hard delete that frees the slot · daily cap default 8 per doctor · a patient record is complete with date of birth + phone);
dispatch T1 ∥ T2 (worktree) ∥ T3→T4 (main tree), sonnet builders. A1 is confirmed at T1's first build step.
- builder-check · T1 · 4 contradictions · 7 questions · settled in the design: each rule gets a page + API + DB test, the six spec headings are named,
  box 3 covers domain/rules/conventions, one migration, seeds backfilled, rule order fixed; intent → popup (zone, values)
- builder-check · T2 · 5 contradictions · 6 questions · settled in the design: the popup set is stated whole (incl. any permission denial), the post-build diff is
  checked against Layers (S12), a deviation is recorded on every protocol row, harness files are excluded from judge and diff; Layers → scope-change above;
  the two-phase stability fact is left to P6, and a park there is surfaced to the owner, never retried
- builder-check · T3 · 0 contradictions · 4 questions · settled in the design: the pin compares exact segments; both-fail output; `cd` failure → exit 5;
  TD-224/225 resolved at SPRINT-115 (fact)
- builder-check · T4 · 0 contradictions · 3 questions · nothing important left (porcelain counts untracked paths, as intended)
