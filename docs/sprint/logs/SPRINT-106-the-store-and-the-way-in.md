---
sprint: 106
slug: the-store-and-the-way-in
owner: Maintainer
last_updated: 2026-09-23
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-106 — Execution Log

> Append-only companion to [`../SPRINT-106-the-store-and-the-way-in.md`](../SPRINT-106-the-store-and-the-way-in.md).
> Uncapped by design (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.

### 2026-09-23 | promote | plan locked at `4290781`, governance signed
Four tasks from `EPIC-017`: T1 `TASK-359` · T2 `TASK-360` · T3 `TASK-369` · T4 `TASK-370`. Governance:
L-promotion none · TD aging 91 of 99 open aged, 6 of 7 high owned, `TD-128` re-reviewed · caps 4 soft,
0 hard · epic rollups current · no handoff ledger. G1/G2 not yet signed (`gates_signed` absent).

### 2026-09-23 | scope-change | T0 added, T3 rescoped to a hard cut, T4 widened — all by owner ruling
**What broke.** The `/task-decomposer --epic EPIC-017` pass that followed the promote, reviewed by
Codex in three adversarial rounds, found the locked Plan wrong in three places:
- **No baseline.** Closed-when 7 compares before/after, and the "before" half can only be taken
  before T1 changes the layout. Nothing in the Plan took it.
- **D7 contradicted Closed-when 2.** Dual-layout support through `2.x` needs v1 readers alive; CW-2
  requires `TODO.md` deleted with zero readers. Owner ruled a **hard cut**: `2.0.0` is v2-only; a 2.x
  queue skill refuses a v1 tree by name and points to `migrate`, the only 2.x path accepting v1.
- **T4 migrated the Backlog only.** A v1 repo's active work lives in its sprint Plan, so a
  Backlog-only migrate loses in-flight tasks (Codex r1 F10).

**Impact on the Plan (the Plan text stays frozen; these entries govern where they disagree):**
- **T0 — `TASK-374`**, freeze the "before" effectiveness baseline. Runs before T1. `S · med · execution ·
  HITL · J1`. Layers: `docs/research/epic-017-effectiveness.md`. Spec: `docs/work/todo/TASK-374-freeze-effectiveness-baseline.md`.
- **T1** now depends on T0.
- **T3 — `TASK-369`** Acceptance becomes: each of the 7 skills names v1 or v2; on v1 or mixed it
  **refuses by name and points to `migrate`**, writing nothing. "Mixed is first-class" and "works with
  the one it found" are withdrawn. `ADR-046` records the hard cut, not dual support. Detection tests
  `TODO.md` for existence only. Spec: `docs/work/todo/TASK-369-queue-skills-detect-and-refuse-v1.md`.
- **T4 — `TASK-370`** migrates the **whole** queue in one run — Backlog and active-sprint Plan tasks,
  preserving membership, ticked boxes, authority and frozen references — idempotent and resumable.
  The "incremental, stop anywhere" design in the T4 prose is withdrawn (mixed is now refused). Added
  DoD: ticked-box counts equal before/after; an interrupted run resumes to the same tree.
  Spec: `docs/work/todo/TASK-370-migrate-v1-repo-onto-the-store.md`.
- **D3** stands, reworded by the ruling: v1-against-v2 safety comes from the migrated tree's shape;
  `TASK-372` proves it later.
- **A2** stays UNCONFIRMED and moves with it to `TASK-372`.

**Where the tasks live now.** By owner direction all 26 EPIC-017 tasks moved out of `TODO.md` into
`docs/work/<status>/TASK-NNN-<slug>.md` with `epic:` frontmatter; this sprint's five sit in `todo/` with
`sprint: SPRINT-106`. The files carry a provisional schema that T1 formalises.

**Re-confirm G2:** yes — T3's design changed from dual support to refusal, and T0 is new. G1/G2 are
signed together at the start of `/orchestrator`.

### 2026-09-23 | scope-change | G1 + G2 signed by the owner; Plan amended to match the signed design
**Signed:** batch G1 + G2 over T0–T4, recorded as `gates_signed: G1,G2 @ 81407ad`. Design:
`/orchestrator sprint-bulk` G2 pass (plan file `witty-chasing-gem.md`). Owner rulings at this G2:
**D6 = `git mv`, in a commit of its own** (content edits never share it) · **T0 measures** = first-pass
decomposition coverage, a 12-probe retrieval set scored by a fresh agent against a key committed first,
and learning count-bumps per sprint over 10 sprints · **execution** = one Sonnet subagent per task,
sequential, with an owner review stop after every task (all J2 ⇒ HITL).
**Plan amendments (precedent `7524c6a`):** T0 block added to § Plan so the preflight and checkers see it;
T1 now depends on T0; `Layers:` += `evals/run-work-store-fixtures.ts` (T1 → T2, owner T1) ·
`evals/run-layout-fixtures.ts` (T3) · `evals/run-v1-to-v2-fixtures.ts` · `README.md` · `CHANGELOG.md` (T4,
whose DoD already named the last two); ADR-046's path is now `docs/adr/ADR-046-the-2-0-hard-cut.md`,
since the dual-layout name contradicts the ruling it records.
**Pre-screens:** preflight CLEAR (waves T1→T2→T3→T4, five shared files each single-owned) ·
verify-reaches PASS (0 mechanical targets, 10 judgment clauses → RUNS/PROVES handled in the design) ·
cap risk found: `skills/lean-doc-generator/SKILL.md` at 138/140, so T3/T4 add ≤ 3 lines inline and put
detail in that skill's own `references/`.

### 2026-09-24 | progress | T0 done — before-baseline frozen at `4136ded`
`docs/research/epic-017-effectiveness.md`. **Completeness** 9/26 = 0.346 (`4290781` vs `81407ad`).
**Retrieval** 11/12 — key committed first (`cb1479f`), answered blind by a fresh Haiku agent limited to
`.claude/CLAUDE.md` + `.claude/CONTEXT.md`; the miss is R11 (where ADRs live), which neither file names.
**Recurrence** 22 by the `seen:`-field selector vs 19 by git history of `count:` lines — the DoD said
"two selectors that agree" and they **do not**; ticked as a judgment with the gaps explained (SPRINT-105:
three new entries carry no `count:` field yet · SPRINT-101: a promoted entry uses prose "Count N" · SPRINT-102:
one extra count-change commit under a plan-locked subject). Headline = 22.
consequence · T0 · behaviour: none · governance: low (a research doc) → self-review only.
**Coordinator slip, caught and repaired before commit:** a fill script's regex, written in a JS template
literal, lost its escapes and matched the empty string at offset 0 — twelve result rows were glued onto
the frontmatter's first line while the guard passed (it tested the same broken pattern). Restored with
`git checkout`, verified `git hash-object` == `HEAD:` blob (`c0565dc`), refilled by exact-line match
with an edit-count assertion (14). L-137's shape: the check agreed with the defect because both used it.

### 2026-09-24 | progress | T1 done — the store stands (`87ee6ba`)
Schema `docs/work/README.md` (verified field-for-field and section-for-section against all 26 task files),
six status folders, ADR-045 (D1 + D6 = `git mv` in its own commit) indexed. Harness
`evals/run-work-store-fixtures.ts`: **9 pass, 0 fail**; all 26 real filenames satisfy the rule.
consequence · T1 · behaviour: none (docs + fixture) · governance: med (the store schema is a workflow
contract) → one scoped Sonnet reviewer. It found **2 high**: the must-FAIL sibling compared two in-memory
buffers and never touched the pipeline under test (L-142's shape), and the round trip could pass vacuously
under `core.autocrlf=true`. One bounded builder retry fixed the first (a real committed edit between the
moves; discrimination proven by breaking the shared compare — only the sibling reddened — restored,
verified by `diff --no-index`) and **surfaced** the second as a genuine FAIL: a fresh checkout is not
byte-identical on this host (752 → 792 bytes). **Owner ruling:** the invariant is stored content — blob
identity via `git hash-object` vs `git rev-parse HEAD:<path>` (L-169) — not working-tree bytes; case +
must-FAIL sibling rebuilt on that. Also: ADR-045's git-internals prose trimmed to rationale (HOW filter);
EPIC-017 D1 now points `→ ADR-045` (coordinator).

### 2026-09-24 | progress | T2 done — membership in frontmatter, progress derived (`1584c8d`)
Schema § Membership (one sprint, one epic, never nested under status) · optional by-reference `## Members`
in the SPRINT template · `/prime` +3 lines (131/140): v2 open DoD = `- [ ]` under each member's
`## Done when`, selected by exact `sprint:`. Harness **13 pass, 0 fail**: reference 3 = hand count 3 =
independent selector 3; the other-sprint decoy moves it to 7. The independent selector caught a real
bug in the builder's first cut — a substring search hit `## Done when` quoted in prose (0 vs 3) — fixed
with a heading-anchored match. Seeded break of the sprint filter reddened exactly the three membership
cases, controls green; restored and verified by `diff --no-index` (550/550 lines).
consequence · T2 · behaviour: low (3 prose lines in a skill) · governance: med (workflow contract) →
**coordinator review inline, reason: 27 lines of prose, the harness already carries the proof.** Found
and fixed in the template comment: a leaked `SPRINT-106 T2` reference in a consumer file (L-015), a
self-contradiction ("stays for all of 2.x" vs "TASK-362 retires it"), and "omit on a v1 tree", a state
the hard cut forbids.
