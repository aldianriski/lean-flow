---
sprint: 114
slug: prove-adopt-release-2-0
epic: EPIC-017
owner: Maintainer
last_updated: 2026-10-04
status: closed
gates_signed: G1,G2 @ f4f128a
plan_commit: cd8d355
close_commit: 16b5a72
update_trigger: sprint execute/close events
---

# SPRINT-114 — Prove, Adopt, Release 2.0

> **Theme:** EPIC-017's last stretch: the remaining five Closed-when conditions in one sprint (owner ruling: all six through release).
> Prove the migration on workdoo on a retained branch (`371`), adopt it on workdoo main on a release candidate (`365`), prove both
> layout directions and the upgrade path (`372`), point the EPIC-016 view at the store (`385`), take the "after" measurement (`386`),
> then release `2.0.0` (`373`). Each step depends on the one before; `371` is the only one unblocked today.

## Scope

**In:** workdoo migrated on an unmerged branch with its gate green (`371`, CW 10) · workdoo main on an immutable release candidate with the
version pin verified (`365`) · both layout directions plus the documented upgrade sequence exercised (`372`, CW 9) · the Work & Queue view
reading status from the store's folders (`385`, CW 6 with `365`) · TASK-374's method re-run unchanged with a verdict (`386`, CW 7) ·
`2.0.0` across every versioned manifest plus the README footer, with a BREAKING CHANGELOG entry, stopping before push (`373`, CW 8).

**Out (deferred):** `TASK-399` (K01, EPIC-014) · `TASK-400` (stale references to the cut guards) · TD-214 · TD-215 · TD-216 · TD-206 and
the store prune it holds · any `git push` (owner-reserved) · workdoo's own SPRINT-009 work, which this sprint neither edits nor schedules.

## Members

- docs/work/todo/TASK-371-prove-migration-on-workdoo.md
- docs/work/todo/TASK-365-workdoo-adopts-the-store.md
- docs/work/todo/TASK-372-prove-both-directions-and-upgrade.md
- docs/work/todo/TASK-385-work-queue-view-reads-the-store.md
- docs/work/todo/TASK-386-after-effectiveness-measurement.md
- docs/work/todo/TASK-373-release-2-0-0.md

## Plan

### T1 — Prove the migration on workdoo, on a retained branch `[size: M · risk: high · class: execution · HITL · J2]`
Layers: external repo (workdoo, an unmerged branch only)
Depends-on: none
Cites: `TASK-371` · EPIC-017 D8 · Closed-when 10 · `TECH-DEBT.md` (workdoo's, named, not touched) · `skills/lean-doc-generator/references/migration-map.md` § v1 → v2 (SPRINT-113 T4) · D2

Tier X. The first time the release candidate's `migrate` runs against a real consumer's live queue, which is the consumer path L-015 asks
for. The branch is the proof and is retained unmerged (D8). It starts only once workdoo's SPRINT-009 promote is committed (D2), and the
counts the Done-when compares are recorded at branch time (owner amendment, 2026-10-03), not frozen now.

**Acceptance:** a retained workdoo branch where the candidate's `migrate` moved the whole queue at its base into `docs/work/`; id sets equal
in both directions and ticked-box counts equal; `TECH-DEBT.md` single-file; workdoo's `bun run verify` green, read from its own verdict line;
workdoo's `/prime` names v2.

### T2 — Adopt the store in workdoo on a release candidate `[size: M · risk: med · class: execution · HITL · J1]`
Layers: external repo (workdoo main)
Depends-on: T1
Cites: `TASK-365` · EPIC-017 D4 · workdoo ADR-001 · T6 (ordered before it, not a dependency) · `packages/application/src/version-pin.ts` (workdoo) · D2

Tier X. workdoo merges the migration that T1 proved, running on an immutable pre-release candidate provisioned from a local path, with
`LEANFLOW_PLUGIN_VERSION_PIN` set to that string. It is ordered before T6, so the release gates on a consumer that already ran it. The
member notes that no production caller of the pin checker was found, so part of the work is finding what actually enforces the pin (A2).

**Acceptance:** workdoo main runs the store on the candidate; the pin is set and the running plugin reports that version; approval and run
state stay in workdoo's durable store (workdoo ADR-001), with no `review/` folder standing in for an approval.

### T3 — Prove both layout directions and the upgrade path `[size: M · risk: high · class: execution · HITL · J2]`
Layers: `evals/run-layout-fixtures.ts` · `evals/fixtures/layout/`
Depends-on: T1
Cites: `TASK-372` · EPIC-017 Closed-when 9 · `TODO.md` (named, not touched) · ADR-046 (existence-only detection) · `README.md` § Upgrading to 2.x · L-182

Tier G. Whether it is *consequential* G (ADR-050) is ruled at G2, defaulting up (ADR-029). It needs the candidate from T1. This is the
auto-update-off consumer, the normal case: a skill on either side of the cut, meeting a tree from the other side, either works or refuses
cleanly, and never loses or duplicates a task. Detection after the fact does not pass. Fixtures are certified on a fresh checkout (L-182).

**Acceptance:** (a) the candidate's 7 queue skills each refuse a real v1 tree by name, point to `migrate`, and write nothing · (b) installed
1.66.x queue writers against absent-`TODO.md` and stray-write states each work harmlessly (re-ingested losslessly) or refuse cleanly ·
(c) the Codex and Kimi runtimes resolve the plugin's resources · (d) install 2.x → restart → `migrate` → resume, exercised end to end.

### T4 — Point the EPIC-016 Work & Queue view at the store `[size: M · risk: med · class: execution · HITL · J1]`
Layers: external repo (workdoo, the Work & Queue view)
Depends-on: T2
Cites: `TASK-385` · EPIC-017 Closed-when 6 · EPIC-016 · workdoo ADR-001

Tier X. With T2, it meets Closed-when 6: the view reads status from the store's folders, so there is never a second copy of status to drift.

**Acceptance:** workdoo's Work & Queue view derives task status from the folder a task file sits in, with no stored status field; approval
and run state stay in workdoo's durable store.

### T5 — Take the "after" effectiveness measurement `[size: S · risk: med · class: execution · HITL · J1]`
Layers: `docs/research/epic-017-effectiveness.md` · `docs/research/logs/epic-017-effectiveness.md`
Depends-on: T3
Cites: `TASK-386` · `TASK-374` (the "before" baseline) · EPIC-017 Closed-when 7 · `.cap-dispositions` (the research file's `retain` row)

Tier P. The method is re-run **unchanged**. A key that moved is a method failure, not a miss. Fewer lines and fewer checkboxes are explicitly
not the success criterion. The research file sits at a `retain` disposition over its cap, so growth goes to its `logs/` sibling (§6).

**Acceptance:** before/after comparison of decomposition completeness, retrieval success and recurring-failure rate recorded, with the verdict
stated whichever way it falls.

### T6 — Release 2.0.0 `[size: S · risk: med · class: execution · HITL · J2]`
Layers: `.claude-plugin/plugin.json` · `.claude-plugin/marketplace.json` · `.codex-plugin/plugin.json` · `.kimi-plugin/plugin.json` ·
  `README.md` · `CHANGELOG.md` · `docs/changelog/` · `evals/run-orchestrator-store-fixtures.ts` (TD-211, added 2026-10-03 -- L-100)
Depends-on: T2 T3 T4 T5
Cites: `TASK-373` · EPIC-017 Closed-when 8 · EPIC-017 D7 (a hard cut, v2-only) · STANDARD §11 (CHANGELOG rotation at a new MINOR/MAJOR)

Tier X. A MAJOR bump made by hand, since `release-patch` is PATCH-only, and it stops before push. The manifest set is derived with
`grep -l '"version"' .*-plugin/*.json` at execution, never copied from this list, plus the README footer, which no lockstep check covers.
`[Unreleased]` becomes `2.0.0`, and the previous release block rotates to `docs/changelog/` (§11).

**Acceptance:** every other EPIC-017 Closed-when box is `[x]` first; every derived manifest and the README footer read `2.0.0`; the CHANGELOG
entry is marked BREAKING and carries the upgrade section; nothing is pushed.

## Owner-action checklist
- [x] Commit workdoo's SPRINT-009 promote, so T1 can branch from a clean base (D2). ✓ done before T1 branched (Log: T1 migrated on `lean-flow-2.0-migration`).
- [x] Open the workdoo-main window for T2 and T4's merges (D2). Until it opens, they park. ✓ opened by the owner (Log: scope-change "T2 unblock", 2026-10-03).
- [ ] Push the release after T6 (owner-reserved).
- [~] ~~T3(c): run `/plugins install D:/Project/lean-flow-rc1` once in an interactive Kimi session and report whether the 14 lean-flow skills appear (owner ruling 2026-10-03).~~ — withdrawn: Kimi skipped by owner ruling (2026-10-03).
- [ ] After pushing `2.0.0`: install from the marketplace once in a scratch profile and confirm it loads `2.0.0` (T3(d) was exercised via `--plugin-dir`; owner ruling 2026-10-03).
- [ ] workdoo after the push (routed at close from the handoff): delete `.claude/settings.local.json` (the 1.x guard); in `.env`, unset `LEANFLOW_PLUGIN_DIR` (or point it at a 2.0.0 tree) and set `LEANFLOW_PLUGIN_VERSION_PIN=2.0.0`. Start the stopped `workdoo-postgres` container if workdoo should use its DB.

## Decisions (pre-locked)
- **D1** — No new `.sh` file; executable logic is TypeScript on Bun (owner rule 2026-09-09).
- **D2** — workdoo timing (owner ruling, promote): T1 branches only after workdoo's SPRINT-009 promote is committed, never over uncommitted
  work. T2 and T4 write to workdoo main only inside a window the owner opens, and park until it does. This sprint never edits workdoo's
  sprint files except through `migrate`'s own moves.
- **D3** — Review: every task's execution gets the Codex loop (review → fix → re-review until clean; owner rule 2026-10-02). Consequential
  Tier G also gets the full ADR-050 bar, with a worktree-isolated outside review. After each merge the cross-cutting legs run on `main` (L-218).
- **D4** — The epic gates the release (owner ruling 2026-09-23): T6 starts only when every other Closed-when is `[x]`. Promote and close run
  the opt-in profile (`QA_FULL=1`).
- **D5** — `TASK-359/360/361/362/369/374` stay where they are until `TD-206` is ruled (carried from SPRINT-113 D4).

## Assumptions
- **A1** — An immutable `2.0.0-rc.1` can be cut and run from a local plugin path by both T1 and T2. How it is cut (a tagged lean-flow commit
  with the manifests at the rc string, or a copied tree) is not yet ruled. *Confirm: G2 ruling; T1 runs it in workdoo.*
- **A2** — `LEANFLOW_PLUGIN_VERSION_PIN` is enforced somewhere at runtime. The member records that no production caller was found.
  *Confirm: T2 names the enforcing caller or files the gap.*
- **A3** — The installed Codex (`codex-cli 0.158.0`) and Kimi (`0.27.0`) CLIs are enough to exercise T3(c). *Confirm: T3, at its first run.*
- **A4** — TASK-374's method runs unchanged on the finished plugin. *Confirm: T5, which records any key that moved as a method failure.*

## Execution Log

> **Lives in its own file**: `docs/sprint/logs/SPRINT-114-prove-adopt-release-2-0.md`, rendered from
> `templates/sprint-log.md.template` and created lazily at the first entry (STANDARD §9 · ADR-014).

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| lean-flow `release/2.0.0-rc.1` (tag `v2.0.0-rc.1`, never `main`) · workdoo `lean-flow-2.0-migration` @ `629f91c` (external, retained) | T1 | the candidate cut; workdoo's queue moved onto the store by it (15 ids) | High | id/box/field census with seeded controls · Codex CLEAR + content spot-check · verify 3/1 under owner ruling (workdoo TD-034) |
| `docs/research/logs/epic-017-effectiveness.md` (new) | T5 | the "after" measurement: retrieval 9→5 literal (11→6 by convention), recurrence 22/19 → 13/16, completeness not measurable; effectiveness NOT demonstrated | Low | key committed before answers · Codex r1→r3 CLEAR |
| `evals/run-layout-fixtures.ts` · `evals/fixtures/layout/` (6 new fixture trees) | T3 | 2.0's both-direction safety retained: stray-write (mixed) state, store census with exact-identity must-FAILs, Codex/Kimi manifest cases | Low | 41/0 fresh clone + autocrlf main · Codex r1→r3 CLEAR · tsc 0 |
| workdoo `main`: migration fast-forward `629f91c` → pin gate `447e208` → `LEANFLOW_PLUGIN_DIR` for workers `2983b66` (external) | T2 | workdoo main on the store, running 2.0.0-rc.1 with the version pin verified by the real probe | High | Codex 4 + 3 rounds → CLEAR · real probe |
| workdoo `main`: pin-gate test fix `0cb75b3` → task links `fa5f39a` (migration 0010) · `docs/epic/EPIC-016-agentic-governance-dashboard-pilot.md` | T4 | the Work & Queue view reads task status from the store's folders (`taskLifecycle`, never stored) | Med | DB suites 116/1 (TD-034 sibling → workdoo TD-037) · must-FAIL cache seed · Codex r1→r2 CLEAR |
| `.claude-plugin/{plugin,marketplace}.json` · `.codex-plugin/plugin.json` · `.kimi-plugin/plugin.json` · `README.md` · `CHANGELOG.md` · `docs/changelog/CHANGELOG-{1.65.1,1.64.0}.md` (new) · `evals/run-orchestrator-store-fixtures.ts` (TD-211) | T6 | `2.0.0`: the BREAKING hard cut, with an upgrade section; the previous two release blocks rotated out (§11) | Med | lockstep PASS · rotation lossless (CRLF-normalised sum) · `QA_FULL=1` 313/7 → the 7 resolved (`47037f1`) · Codex r1 → CLEAR |

## Retro

**Retrieval check:** one miss and two hits. **Miss:** L-151 (a decision recorded where its reader cannot parse it is not a decision) was on
file, and every Codex review this sprint was still logged as prose only. The release gate failed 7 `review-depth-*-absent` rows at the last
step (→ L-225, TASK-401). **Hits:** L-224: the sprint checkers were re-run after every tick write, evidence suffix included, and stayed
green. L-218: T3's post-merge typecheck red was found and fixed within the hour (`19670ac`).

**Cost:** coordinator (Opus) across three sessions + Sonnet builder lines for T1–T4 + Codex loops (T1 ×1 · T2 ×4+3 on the workdoo chain ·
T3 ×3 · T4 ×2 · T5 ×3 · T6 ×1, ≈22k tokens) + 3 full opt-in gate runs (1983 s promote · 1 killed by host memory pressure · 2830 s
release). Per-session token totals for the first two sessions were not recorded, so total cost is **unavailable**, not zero. Delivered: 6 of 6
members, EPIC-017 complete, `2.0.0` committed.

**Worked**
- Release == candidate: `git diff v2.0.0-rc.1 HEAD -- skills/ templates/ spec/` empty. What was proven on workdoo is byte-for-byte what ships.
- Bisect over trust: T4's "pre-existing" failures were re-attributed to the coordinator's own gate merge before anyone built on the claim.
- Controls caught two coordinator instruments before they misled (the store-check's leading-space values; selector-(b)'s sprint-number
  extraction): the second-route cross-check doing its job.
- Running the gate detached, as its own call, and reading its own verdict line got a clean verdict after the first run was reaped.

**Friction**
- Host memory: the release gate was killed once by the low-memory reaper (no verdict), and needs about 47 minutes of headroom.
- Review records missing at release (7 FAILs), all from a loop the record procedure never names (L-225 → TASK-401).
- Builder self-reports were wrong twice (L-227), a brief's file bound missed the adapter's constructor (L-228), and a DB suite skipped
  silently while 6 tests were broken (L-226).
- EPIC-017 Closed-when 7 is ticked as *measured, verdict NOT demonstrated*, and 10 as *gate green under owner ruling* (workdoo TD-034).
  Both are honest, and both are weaker than a plain `[x]`.

**Pattern candidate**
- L-225 and L-227 are the ones likeliest to recur: every sprint runs a Codex loop, and every sprint takes builder reports. Watch for count 2
  at the next close.

**Routed:** Shipped → `CHANGELOG.md` v2.0.0 (`5f62d0f`, already written at T6) · Tech debt → TD-219 · TD-220 · TD-221 · TD-222 (lean-flow),
TD-037 · TD-038 (workdoo `d3852b0`) · Follow-ups → TASK-401 · TASK-402 (TASK-400 filed earlier) · Learnings → L-225 · L-226 · L-227 · L-228.
