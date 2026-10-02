---
sprint: 112
slug: govern-lighter
owner: Maintainer
last_updated: 2026-10-02
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-112 — Execution Log

> Append-only companion to [`../SPRINT-112-govern-lighter.md`](../SPRINT-112-govern-lighter.md).
> Uncapped by design (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.

### 2026-10-02 | promote | plan locked, governance signed, two members: the proof bar (396) and the cap conditions (384)
Scope ruled by the owner: "396 + 384 first", so the governance diet comes before EPIC-017 step 1 (378 · 379 → SPRINT-113).
Size check before rendering: `TASK-396` was L at pull time (ADR + a ~120-guard audit + landed cuts + a CLAUDE.md slim). Split by owner
ruling (`a5238fd`): 396 keeps ADR-050 + the audit, the cuts → `TASK-398` (new; id derived from the store max, TASK-397, with 0 hits in
the tree and `git log --all`), and the CLAUDE.md slim → `TASK-384`. Members were moved backlog → todo by `git mv` in their own commit
(`9d3d983`), then stamped `sprint: SPRINT-112`. The signed governance checklist, line by line (owner-signed; applied in `a5238fd`):
- **L-promotion:** L-220 (count 2) → promoted to `skills/orchestrator/SKILL.md`: a G2 checklist line + a red flag, placed where rulings
  are offered (CLAUDE.md is at its cap). Body collapsed to a pointer. The orchestrator is now 135 lines.
- **TD aging:** 115 of 132 open rows aged against sprint 112. Second route: 132 − 17 filed at 110/111 = 115. All 7 `high` rows are owned
  (TD-143 → 348 · TD-150 → 345 · TD-090/117/128/168 → 357 · TD-174 → 384). No new escalation.
- **doc-aging:** §11 has no TD deletion due (TD-203 resolved at 111), no CHANGELOG rotation, the L-220 collapse is applied, and the store
  prune stays held (D5/TD-206). §2 has 4 soft OVER-CAP rows, all routed to T2 (`TASK-384`, CW 3): EPIC-017 233 > 200 · adlc-epic-sequencing
  140 > 130 · epic-017-effectiveness 162 > 130 · the V3 research doc 3050 > 130. Token budget ~16081 ≤ 16087.
- **epic rollup currency:** EPIC-017 is current (`dfebeae`). Every member row in EPIC-014/015 carries a close sha. EPIC-016: foreign WIP in
  the checkout, not assessed.
- **handoff ledger:** none.
G1/G2 are not signed yet.

### 2026-10-02 | progress | plan_commit recorded: ceffdad
The `plan locked` commit is `ceffdad`; this entry and the frontmatter field land in the next commit.

### 2026-10-02 | scope-change | G1/G2 signed; A2 false; T2's disposition mechanism is a file the checker reads (owner rulings)
**G1** (full checklist for both: 396 is `origin: manual`, and 384's scope changed at promote). Goal, size (M, M), files, out-of-scope
and assumptions confirmed. Recon: § Anti-Patterns is 13 KB of `CLAUDE.md`'s 23 KB, and the always-loaded set is at ~16081 of 16087
tokens. **A2 is false**: all 3 over-cap research docs are still cited by live docs (V3 by ADR-036 · EPIC-017 · TECH-DEBT), so §11's
superseded-then-archive route is closed to them. ADR-048 (read first, per L-220) names TASK-384 as the source of the missing escape route.
**Owner rulings (popup).** (1) A disposition is recorded in a local `.cap-dispositions` (`<path> -- <kind> -- <reason>`), mirroring
`.conformance-exempt`, and `check-doc-caps` honours it and names it on every run. A missing reason, an unknown kind or a stale path is
itself reported. T2 is Tier G, and ADR-048 is amended. (2) "Promotion requires a disposition" is enforced by prose + the pointer format
(`disposition:` on the promoted pointer line), Tier P. A check is added only if ADR-050 later says it earns one. (3) The T1 audit is ruled
by **class rules + exceptions**: the owner approves the class rules, the builder applies them, and only exception rows come back.
**Impact on § Plan.** T2's Layers gain `.cap-dispositions` and the ADR-048 amendment. No task added, no DoD changed.
**Consequence lookups (TD-092):** T1 · behaviour: none (ADR + research doc) · governance: a binding ADR on the proof bar → Codex
gauntlet (D4) over the drafts · T2 · behaviour: check-doc-caps gains a disposition path · governance: a gate contract + an ADR-048
amendment + spec (if §2/§11 change) → Tier G, worktree-isolated build, Codex gauntlet (hybrid), all touched surfaces run (L-221).
**Dispatch:** preflight CLEAR (T1 = 0, T2 = 0, disjoint), so the two go out in parallel, worktree-isolated.

### 2026-10-02 | scope-change | T2 Layers gain the shell oracle and the parity harnesses (found before dispatch)
`check-doc-caps.sh` is the AUTHORITY and `.ts` the port (`run-doc-caps-differential.ts` header), and `conformance-engine.sh` calls the checker,
so the disposition path must land in both, in parity, under ADR-043's adopter contract. Added to T2: `scripts/lib/check-doc-caps.sh` ·
`evals/doc-caps.test.ts` · `evals/run-doc-caps-differential.ts`. Found by enumerating every runner of the checker before the build (L-221).
