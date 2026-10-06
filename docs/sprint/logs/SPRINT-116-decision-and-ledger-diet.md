---
sprint: 116
slug: decision-and-ledger-diet
owner: Maintainer
last_updated: 2026-10-06
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-116 — Execution Log

> Append-only companion to [`../SPRINT-116-decision-and-ledger-diet.md`](../SPRINT-116-decision-and-ledger-diet.md). Uncapped by design:
> this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.

### 2026-10-06 | promote | plan locked, governance signed, four members: the TS port ruled first, then three small repairs
The owner picked the track "Decision + ledger diet" over three alternatives (user-facing quality · autonomy proof · workdoo only).
The size check at pull found no L (four S). T1 is S on a *finish* ruling and M on a *cut*; G1 re-sizes it. The members moved
backlog → todo in their own commit (`b06a482`) and were stamped `sprint: SPRINT-116` in `d6bc35c`. The owner signed the
governance checklist:
- **L-promotion:** none. No `promoted: no` row has count ≥ 2. Census of `- count:` lines: 56 at 1, one at 3, one at 5; the 3 and the 5
  are both `promoted: yes`. Second route: 56 `promoted: no` + 2 `promoted: yes` = 58 rows carrying a count.
- **TD aging:** 130 of 138 open rows have aged against sprint 116 (created ≤ 113). Second route: 138 − 8 filed at 114/115 = 130. The 42
  oldest (created ≤ Sprint-090) were re-checked against the current repo by a read-only agent; I spot-checked the evidence for the
  12 that change the ledger (TD-063 · 106 · 082 · 051 · 107 · 069). The owner approved all 12 (`00c9a3c`): 3 fixed, 4 no longer occur,
  5 merged (050 · 066 · 071 → TD-090; 053 · 095 → TD-100). 30 stay open; 14 turn on T1. One `high` row is open, TD-168 (selector
  matched bold `**high**` too). Its owner TASK-357 is done, so the owner routed it through T1's ruling.
- **doc-aging:** §11: TD-209, resolved at SPRINT-113, has passed its 3-sprint clock and its row is deleted (`00c9a3c`). The ledger now holds
  143 rows (126 open + 17 resolved). A CHANGELOG rotation of v1.66.x was proposed and approved, then **withdrawn before applying**:
  §11 keeps the current and previous minor inline (2.0.x + 1.66.x), as the v2.0.0 rotation file records. It fires at 2.1.0. §2:
  0 OVER-CAP; 3 soft breaches, all with recorded `retain` dispositions (`check-doc-caps.ts`).
- **epic rollup currency:** EPIC-014, EPIC-015 and EPIC-016 are current. EPIC-016's rows cover workdoo SPRINT-001…009.
- **handoff ledger:** no `HANDOFF-LEDGER.md`; no active sprint carried a handoff.

promote-check: first run FAIL (5 findings: a Cites/Layers contradiction, two basename-vs-path Layers misses, a cited fixture missing
from Cites, two lines over 400 chars). Fixed before the lock; final run `PASS -- 13 pass, 0 fail`.

### 2026-10-06 | progress | batch G1 + G2 signed (owner) @ 8e14bb4, with three design rulings
- **T1 ruling (owner, J2): CUT the TypeScript port.** An ADR retires it; `packages/standard` · `apps/cli` · the port's tests go, P5's
  parity goes with them, and EPIC-014 closes as retired. TD-168 gets a new P1 task for the Shell engine's per-file spawn cost. Per
  the Plan, T1 is now **size M**. The deletion's full reach is re-derived by recon before any file moves; any file outside the
  declared `Layers:` gets a `scope-change` entry here and a Plan `Layers:` edit (L-229).
- **T3 design: convert.** `check-handoff-state.sh:145` calls `lf_is_archived_path` and leg 10b's exemption pattern is deleted. Other G
  (no shipped skill names the script): must-FAIL fixture + one real run.
- **T4 design: an external reviewer (Codex) records as `scoped-reviewer`.** The four-word depth vocabulary stays. `check-review-depth.sh`
  accepts any depth except `self-review`, so no regex change. Shipped-skill change → Codex review loop.
- **A1 confirmed:** the 10 basenames re-derived from `9a0bfaad` (`--diff-filter=D`) match TASK-400's census.
- **Sequence:** T2 ∥ T4 (disjoint, worktree-isolated, `worktree.baseRef: head`); T1 inline; T3 after T1 (D1).
