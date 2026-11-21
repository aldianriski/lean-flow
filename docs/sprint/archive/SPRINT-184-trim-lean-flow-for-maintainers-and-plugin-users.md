---
sprint: 184
slug: trim-lean-flow-for-maintainers-and-plugin-users
owner: Maintainer
last_updated: 2026-11-21
status: closed
plan_commit: 45b2e2cc
close_commit: 9a2e957d
gates_signed: G1,G2 @ 6108661c
update_trigger: sprint execute/close events
---

# SPRINT-184 — Trim lean-flow for Maintainers and Plugin Users

> **Theme:** The owner set the direction to optimize lean-flow itself before the workdoo dashboard. The always-loaded set sits at its caps (CONTEXT.md 150 of 150, CLAUDE.md 79 of 80, tokens 12,634 of 12,691), the two ledgers are 2,269 and 2,028 lines, and a plugin installer pays for 16 descriptions every session and a SKILL.md body per call.
> The sprint cuts those costs without changing behaviour, then proves each skill trim on real input under one 15.00 USD cap. It adds no governance machinery, and the v2.27.0 release stays the owner's.

## Scope

**In:** TASK-684 to TASK-693: LEARNINGS pointer collapse, the always-loaded trim with a token-budget ratchet, TECH-DEBT closure and compression, the humanizer glossary pointer (TD-317), the Windows `s13` and foreign-path gate fixes (TD-318, TD-319), the installer-cost census with description trims, and the five SKILL.md body trims.
**Out (deferred):** any workdoo work and EPIC-025's open condition · a version bump, tag or push (the owner releases v2.27.0 by hand) · new hooks, agents, gate legs or scripts · consumer template changes · the 13 medium TD rows (stay uncompressed) · active LEARNINGS entries · the other 11 skill bodies.

## Members

- docs/work/todo/TASK-684-collapse-promoted-learnings-entries-to-pointer.md
- docs/work/todo/TASK-685-trim-the-always-loaded-set-by.md
- docs/work/todo/TASK-686-close-or-merge-stale-tech-debt.md
- docs/work/todo/TASK-687-compress-low-minor-and-trivial-tech.md
- docs/work/todo/TASK-688-point-the-humanizer-inline-path-at.md
- docs/work/todo/TASK-689-fix-the-windows-s13-rows-intact.md
- docs/work/todo/TASK-690-measure-what-a-plugin-installer-pays.md
- docs/work/todo/TASK-691-trim-the-task-decomposer-triage-and.md
- docs/work/todo/TASK-692-trim-the-orchestrator-skill-md-body.md
- docs/work/todo/TASK-693-trim-the-lean-doc-generator-skill.md

## Plan

### T1 — Collapse promoted LEARNINGS entries to pointer form `[size: M · risk: low · class: mechanical-ingest · AFK · J1]`
Layers: `docs/LEARNINGS.md`
Depends-on: none
Cites: TASK-684, `evals/run-learnings-metadata-fixtures.ts`
85 promoted entries keep bodies over the 6-line collapsed form (the promote-time re-count agrees; it finds 248 lines over it, not the 418 in the task's Why). Collapsing is §11's own action; the id set and every pointer target must survive.

**Acceptance:** the measured line delta is reported, 309 ids in and out, and a deliberately uncollapsed entry stays byte-identical.

### T2 — Trim the always-loaded set by 15% and ratchet the token budget `[size: M · risk: med · class: execution · HITL · J1]`
Layers: `.claude/CLAUDE.md` · `.claude/CONTEXT.md` · `scripts/lib/token-budget.txt` · `docs/work/evidence/TASK-685/inventory.md` · `docs/LEARNINGS.md`
Depends-on: T1
Cites: TASK-685, L-008, TD-006
Duplicated prose becomes pointers; a universal action stays loaded, only branch-specific text moves to a home its flow already reads. The inventory is the proof nothing was lost.

**Acceptance:** the gate reads at most 85% of the build-start tokens, the budget is ratcheted by value only, and every pointer resolves.

### T3 — Close or merge stale TECH-DEBT rows with per-row approval `[size: M · risk: low · class: decision · HITL · J2]`
Layers: `TECH-DEBT.md`
Depends-on: none
Cites: TASK-686
About ten rows look stale by fact. The builder returns a per-row table and the owner approves each close or merge; no id is freed.

**Acceptance:** every applied close or merge has the owner's per-row approval recorded, and the id set is intact.

### T4 — Compress low, minor and trivial TECH-DEBT rows `[size: M · risk: med · class: mechanical-ingest · AFK · J1]`
Layers: `TECH-DEBT.md`
Depends-on: T3
Cites: TASK-687
Rows average 13.3 lines; each keeps Summary, Mitigation, an Evidence pointer and any open-condition line byte-identical. It runs after T3 so closed rows are skipped.

**Acceptance:** the measured line delta is reported and the field census shows ids, severity, status, created, Summary, Mitigation and every open-condition line unchanged.

### T5 — Point the humanizer inline path at the host glossary (TD-317) `[size: S · risk: low · class: execution · AFK · J1]`
Layers: `skills/humanizer/references/embedded.md` · `docs/work/evidence/TASK-688/spend.md`
Depends-on: none
Cites: TASK-688, TD-317, L-327, `evals/fixtures/humanizer/domain-calque/`
The inline path never reaches the host glossary, so an override is ignored in commit messages. One pointer line at the top of the section, shown on real input.

**Acceptance:** the domain-calque commit case outputs the host term on a live-checkout run, spend within 1.50 USD, and no host glossary still completes.

### T6 — Fix the Windows s13 case and the foreign-path false positive (TD-318, TD-319) `[size: M · risk: med · class: execution · HITL · J1]`
Layers: `evals/run-spec-reader-fixtures.sh` · `scripts/lib/check-layers-completeness.ts` · `evals/fixtures/layers-completeness/` · `evals/layers-completeness.test.ts`
Depends-on: none
Cites: TASK-689, TD-318, TD-319
A local gate reads red on s13 while off-host is green, and a Done-when path naming another repo's file reads as a lean-flow file. Defect fixes on maintainer-only tooling, other G, no new `.sh` and no new leg.

**Acceptance:** s13 passes on this host or is host-aware with a retained must-FAIL variant, and a retained fixture shows the foreign-path exemption leaves the missing-path FAIL intact.

### T7 — Measure installer cost and trim over-long skill descriptions `[size: M · risk: low · class: execution · HITL · J1]`
Layers: `skills/council/SKILL.md` · `skills/lean-doc-generator/SKILL.md` · `docs/work/evidence/TASK-690/census.md` · `docs/work/evidence/TASK-690/spend.md`
Depends-on: none
Cites: TASK-690
The census sets the trim targets for the three body-trim tasks, and descriptions are the always-loaded cost every installer pays. A description over about 450 characters is shortened with its triggers kept.

**Acceptance:** the census table and per-body targets exist, trimmed descriptions keep every trigger and Do-not-use clause, and each routes on a real-input run within 1.50 USD.

### T8 — Trim the task-decomposer, triage and prime bodies `[size: M · risk: med · class: execution · HITL · J1]`
Layers: `skills/task-decomposer/SKILL.md` · `skills/task-decomposer/references/` · `skills/triage/SKILL.md` · `skills/prime/SKILL.md` · `skills/triage/references/` · `docs/work/evidence/TASK-691/`
Depends-on: T7
Cites: TASK-691, L-327, L-316
The lower-blast set proves the method: a line-by-line inventory, moves with a pointer at the branch point, and a real-input run per moved route.

**Acceptance:** each body is at or under its census target, every behavioural line is accounted for, and a different-family review plus real-input runs pass within 3.50 USD.

### T9 — Trim the orchestrator body `[size: M · risk: high · class: execution · HITL · J1]`
Layers: `skills/orchestrator/SKILL.md` · `skills/orchestrator/references/`
Depends-on: T8
Cites: TASK-692, L-327, L-316, `docs/work/evidence/TASK-692/orchestrator.md`, `docs/work/evidence/TASK-692/spend.md`
The gate engine of the loop, so it follows T8. No G1, G2, approve stop or never-push line may be removed or weakened.

**Acceptance:** the body is at or under its target with a full inventory, every moved gate is exercised on real input, and the cross-family review closes within 4.00 USD and two rounds.

### T10 — Trim the lean-doc-generator body and write the release notes `[size: M · risk: med · class: execution · HITL · J1]`
Layers: `skills/lean-doc-generator/SKILL.md` · `skills/lean-doc-generator/references/` · `README.md` · `CHANGELOG.md` · `docs/work/evidence/TASK-693/`
Depends-on: T5, T6, T7, T8, T9
Cites: TASK-693, L-327, L-316
It runs last so the single README and CHANGELOG entry covers every consumer-visible change of T5, T7, T8, T9 and itself. No version bump.

**Acceptance:** the body is at or under its target with a full inventory, promote, close, init, migrate, epic and prd are exercised where moved, and README and CHANGELOG carry the lines within 4.50 USD.

## Decisions (pre-locked)

- **D1** — Ten members in four waves. W1: T1, T3, T5, T6, T7. W2: T2 (after T1), T4 (after T3), T8 (after T7). W3: T9 (after T8). W4: T10 (after T5 to T9). Every blocker joins, so no state change. No epic and no stream.
- **D2** — Shared files have one owner each at any time: `docs/LEARNINGS.md` T1 then T2 (append only), `TECH-DEBT.md` T3 then T4, `.claude/CLAUDE.md`, `.claude/CONTEXT.md` and `scripts/lib/token-budget.txt` T2 only, `README.md` and `CHANGELOG.md` T10 only.
  Each `skills/*/SKILL.md` is T7's (description only) before its body owner's. A roster edit goes to T2's owner. `docs/knowledge-index.md` is regenerated once per commit that touches LEARNINGS.
- **D3** — Real-input spend is one 15.00 USD cap in fixed shares: T5 1.50, T7 1.50, T8 3.50, T9 4.00, T10 4.50. A run over its share is refused and the owner asked; unspent share is not borrowed without the owner.
- **D4** — Commits: a task commits as `sprint(184) Tn: …`; coordinator writes (moves, ticks, Log, sprint file, and any shared-file row a task does not own) commit as bare `sprint(184):`. Shared files stage with `git add -p` and the staged diff is read.
- **D5** — Codex builds in a worktree and Claude reviews (owner ruling 2026-11-02); T8 to T10 reviews are a different model family than the builder, worktree-isolated, at most 2 rounds. The coordinator launches every nested `claude -p` and the owner approves each launch (L-293); workers stage only.
- **D6** — Nothing here is a new guard, gate leg, ledger or field (ADR-053); T6 is a defect fix on maintainer-only tooling, other G, and T2's ratchet is a value edit.

## Assumptions

- **A1** — The 85 over-long promoted entries hold at build, and L-144 is the one deliberate non-collapse. *Confirm: T1 box 1 and its Negative (re-measured).*
- **A2** — The s13 red is host locale, not the reader. *Confirm: T6 box 1; at promote, `.` matches 3 bytes under UTF-8 and 1 under the C locale here.*
- **A3** — A 15% byte cut of each body is safe. *Confirm: T7's census, revised at G2.*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-184-trim-lean-flow-for-maintainers-and-plugin-users.md`, rendered from
> `templates/sprint-log.md.template` and created at promote. Append there, never here.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `docs/LEARNINGS.md` | T1, COORD | 78 promoted entries collapsed to pointer form, 13 marked `(no disposition at promotion)`, L-106's dead pointer fixed (WHY: §11's own compaction, 2,269 → 2,184 lines); close adds the L-237, L-238 and L-293 sightings | Low | learnings-metadata fixtures, `--ledger`, id census 309/309 |
| `.claude/CONTEXT.md`, `scripts/lib/token-budget.txt`, `docs/work/evidence/TASK-685/inventory.md` | T2 | 16 lines shortened in place, budget ratcheted 12,691 → 11,021 (WHY: always-loaded set 12,634 → 10,700 tokens, −15.3%, nothing moved under Safety wins) | Med | check-doc-caps token leg, pointer census, gate |
| `TECH-DEBT.md` | T3, T4, COORD | TD-288/291/293 closed by per-row approval; 107 low/minor/trivial rows compressed, the 13 medium rows byte-identical (WHY: 2,031 → 1,860 lines); close resolves TD-315/317/318/319 and files TD-320 | Med | field census (420 lines), md5 of the medium blocks |
| `skills/humanizer/references/embedded.md`, `docs/work/evidence/TASK-688/spend.md` | T5 | Host-glossary pointer first in § Inline path (WHY: TD-317, commit messages ignored a host override) | Low | 2 live-checkout runs, 0.3190 USD |
| `evals/run-spec-reader-fixtures.sh`, `scripts/lib/check-layers-completeness.ts`, `evals/layers-completeness.test.ts`, `evals/fixtures/layers-completeness/` | T6 | Exact-byte em-dash match with the `s13-rows-broken` must-FAIL; `repo:path` tokens exempt (WHY: TD-318 host locale, TD-319 foreign path) | Med | 61 tests, C-locale fixture run, gate |
| `skills/council/SKILL.md`, `skills/lean-doc-generator/SKILL.md`, `docs/work/evidence/TASK-690/` | T7 | Installer-cost census with five body targets; descriptions 944 → 777 B and 541 → 415 B, every trigger kept (WHY: the per-session cost every installer pays) | Low | trigger inventory, routing runs, 0.4725 USD |
| `skills/task-decomposer/SKILL.md`, `skills/triage/SKILL.md`, `skills/triage/references/out-of-scope.md`, `skills/prime/SKILL.md`, `docs/work/evidence/TASK-691/` | T8 | Bodies 35,370 → 32,969 B: duplicate task-file shape removed, triage's rejection procedure moved with pointers at steps 1 and 7 (WHY: the per-call cost) | Med | inventories, 14 before/after runs, 1.4220 USD |
| `skills/lean-doc-generator/SKILL.md`, `README.md`, `CHANGELOG.md`, `docs/work/evidence/TASK-693/` | T10 | Body 18,428 → 17,678 B, three in-place trims; `[Unreleased]` and README lines for TASK-688/690/691/693 (WHY: the per-call cost, and one release entry for the sprint) | Med | inventory, promote before/after, 0.4499 USD |
| `docs/work/` moves, sprint file and Log | COORD | Status moves, ticks, scope-changes, the T5/T7 commit split (WHY: coordinator bookkeeping) | Low | check-sprint-by-reference `--close`, gate |

## Retro

**Retrieval check** — Yes. Safety wins (owner, G2) kept every-call text in the bodies, and T7's census showed what that leaves to cut: 1.5% to 9.4% per body. That figure is why T9 was cancelled before any build. L-100 and L-240 drove five Layers corrections, each logged before its edit. L-237 fired once and was caught by the coordinator's census (T4). L-238 fired once and was caught by the gate (the T5/T7 commit).

**Cost** — 10 members (all M). Nine were built, eight by Codex, with T3 by a Sonnet worker. Six were reviewed by Claude Sonnet; T1, T3 and T4 got a coordinator self-review. Three needed one bounded retry each (T2, T4 and T8). Reported builder tokens: 1,185,059 (T1 139,715 · T2 143,708 · T3 116,537 · T4 155,898 · T5 68,871 · T6 131,669 · T7 144,511 · T8 147,668 · T10 136,482). Reviewer tokens: 389,735. Real-input spend was 2.6634 of 15.00 USD (T5 0.3190 · T7 0.4725 · T8 1.4220 · T10 0.4499); T9's 4.00 share was unused. DoD: 36 of 36 boxes on the nine done members; T9's five boxes were cancelled unrun. Builder-check tokens were not recorded.

**Worked**
- The always-loaded set fell 15.3% with no rule moved out of it. The budget ratchet is a value edit, so the next addition has 321 tokens of room instead of 8.
- Codex builds in worktrees, Claude reviews and coordinator landing with blob-hash checks: every landed blob equalled its worktree's.
- An independent coordinator census against the frozen box, not the design's rule, caught T4's five dropped lines before landing.
- Running the census before the body trims let the owner cancel the gate-engine trim on evidence rather than risk it for 385 B.

**Friction**
- The first four T8 before-runs were void: headless `claude -p` blocks `Skill` unless `--allowedTools` names it (L-293 sighting, about 0.40 USD).
- A combined `sprint(184) T5 T7:` subject reddened the mid-sprint gate. Three local commits were rebuilt to split it; the tree is identical to `s184-backup-c80a3860` (L-238 sighting).
- A cancelled, unbuilt member put two checks at odds: `review-depth` wanted a review and the two layers checks disagreed on its evidence folder (TD-320).
- The ADR routing prompt did not route on either arm, so T7 proved lean-doc-generator's description on the promote trigger instead. One T8 before/after pair looked like a regression until two reruns showed it was noise.

**Pattern candidate**
- No new entry. Sightings: L-237 (T4, count 4), L-238 (T5/T7 commit), L-293 (headless Skill block, count 3; owner placed it at SPRINT-185's promote).

**Routed**
- Shipped: CHANGELOG `[Unreleased]` lines for TASK-688, 690, 691 and 693 (written by T10). TASK-689 is maintainer-only and gets no consumer line. No `type: bug` member.
- Tech debt: TD-315 resolved → TASK-685, TD-317 resolved → TASK-688, TD-318 and TD-319 resolved → TASK-689. TD-320 is new (cancelled-member handling in the sprint checks). TD-312 stays open: CONTEXT.md is still 150 of 150 lines.
- Follow-ups: none filed.
- Learnings: the three sightings above.
- Release: feature sprint (shipped skills changed), so MINOR v2.27.0, cut by hand by the owner. Nothing is pushed.
