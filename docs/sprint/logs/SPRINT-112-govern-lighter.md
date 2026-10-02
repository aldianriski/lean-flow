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

### 2026-10-03 | progress | T2 (TASK-384) accepted: soft-cap dispositions + CLAUDE.md slim; merged ea180d1
- Built `04f9e3b` · `7eda91d` · `14e5b49`, then Codex fixes `c5148a7` · `1420952` · `45bedf7` · `81c58fe`. `check-doc-caps` (Shell authority + TS port,
  differential 26/26) honours a repo-root `.cap-dispositions` (`path -- kind -- reason`) for SOFT over-caps only, printing a named `retained:` line.
  Malformed or stale rows are named FAILs (reason-missing · kind-unknown · duplicate · stale · hard-cap · malformed TAB). Hard caps and the token
  budget stay FAIL (ADR-048 amended). The engine does NOT call the checker (comments only), so ADR-043 is untouched; ADR-034 is untouched (a gate leg, not a rule).
- The 4 soft rows are each a recorded `retain` (EPIC-017 until §11 archive · adlc-epic-sequencing holds the L-151 freeze · epic-017-effectiveness is
  TASK-386's comparand · V3 cited by ADR-036), so the gate prints 0 OVER-CAP. TD-174 resolved.
- CLAUDE.md § Anti-Patterns: 5 rules moved verbatim to LEARNINGS § Durable rules (byte-verified). Codex round 1 found that the one-liners dropped
  actions (Tier G seed/parse/control/hash · edit-safety · cache read-before-edit). Owner: restore them tersely. Round 2 asked for the Tier X/P bars
  and "seed the rejected design"; round 3 for "fails with its named finding" (applied verbatim). Result: 79 lines, ~16081 → ~13323 tokens, every action always-loaded.
- Codex gauntlet (hybrid; one round could not read files, so the coordinator ran the checks and pasted them inline). F1 (a TAB in a path split
  the Shell TSV, so the Shell retained what TS reported stale) was confirmed by execution and fixed with 2 retained fixtures through the differential and a seeded break.
  The EXIT trap preserves the exit status (measured rc 1/1/1/0).
- On main after the merge: doc-caps fixtures 46/0 · bun test 0 fail · differential 26/26 · both checkers 0 OVER-CAP, 4 retained · count-claims
  green · prose-density red only on the foreign uncommitted EPIC-016. The engine baseline is 32 FAIL, measured on main at ccb87e2 before T2 (its +9 over
  SPRINT-111's 23 is SPRINT-112 becoming current: 8 aged TD rows and 2 more held store-prune tasks; T2 adds 0).
- Owner ruling: box 2 ("a rule demoted out of CLAUDE.md") is met by the 5 detail moves, each keeping an always-loaded one-liner (L-088). DoD 4/4.

### 2026-10-03 | progress | T1 (TASK-396) accepted; ADR-050 accepted; merged 917b8ed
- Built `9649100`, then Codex fixes `58d7c59` · `e56e6bb` · `486d0bd` · `34e2bd1`. The audit covers 60 guards, drawn by three selectors (gate lists 64 · disk
  prefixes 68 · every runnable .sh/.ts under evals/test/scripts/apps/packages 197). The third selector found P6, P7 and K01 (the TS engine
  port, 72 files, untouched since 2026-08-29). Catches come from git history + ledgers, never recall: 24 of 60 guards ever caught a real defect
  (≥70 events) against ~235 maintenance events. Capped companions under docs/research/ (no spec change).
- Codex round 1 confirmed 5 findings: G17's missed catch (L-176); G25 is consumer-facing; the engine does NOT call check-doc-caps; the population
  omitted parity guards; the placement violated §2:156. Round 2 confirmed 4: K01 overlapped E04/P5; G24 is R1(b); the catch count is 24, not 23;
  R6 was sharpened to "cut iff no runner of any kind". Round 3 was CLEAR (totals reconcile; the ADR relationship claims are true; no guard family is omitted).
- Owner rulings (11): G08 freeze · G22 checker keep + harness freeze · G10 and S4.INDEX keep · P4 cut · T01 keep · G21 freeze · G23 keep (re-rule
  next audit) · P1 freeze · K01 freeze (EPIC-014 decides) · R1(b) stands (L-015 leak → TD at close) · P7 cut. Final: 39 keep · 18 freeze · 3 cut;
  cut + freeze = 871 of 2,351 s. TASK-398 cut list: S10 (8 files, 1,403 lines) · P4 (714) · P7 (251) + its 2 comments + the excluded-list names.
- **ADR-050 accepted (owner, 2026-10-03).** CLAUDE.md § spec-only now scopes the full bar (seeding + worktree-isolated review) to
  **consequential** G. Maintainer-only G takes a must-FAIL fixture + one run on its real artifact; frozen G and X keep their fixtures. Two Codex wording rounds,
  then CLEAR. CLAUDE.md is at 80/80 lines, ~13419 ≤ 16087 tokens. DoD 2/2.
