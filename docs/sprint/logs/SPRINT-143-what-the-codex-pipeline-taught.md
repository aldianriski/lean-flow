---
sprint: 143
slug: what-the-codex-pipeline-taught
owner: Maintainer
last_updated: 2026-10-26
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-143 — Execution Log

> Append-only companion to [`../SPRINT-143-what-the-codex-pipeline-taught.md`](../SPRINT-143-what-the-codex-pipeline-taught.md).
> Uncapped by design (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.

### 2026-10-26 | promote | plan locked, governance signed, six members: what the Codex pipeline taught
Promote governance checklist, signed by the owner by popup:
- ☑ L-promotion: none due. Census by each header's status: 15 active + 219 promoted + 1 superseded = 235, equal to the
  count of `## L-NNN` headers. Every active entry's `count:` is 1.
- ☑ TD aging: 100 of 101 open rows aged against sprint 143. Second route, by severity: 55 + 17 + 24 + 5 = 101. Newly
  aged: TD-273, TD-274 (filed at 140). None is `high`.
- ☑ doc-aging, §11 (owner-approved): TASK-499, 500, 501, 502, 503, 504, 505, 508 (SPRINT-140, closed 3 sprints ago)
  pruned. No live `.md` citation by three routes (tracked-file grep with the §11 history paths filtered out, ripgrep over
  the working tree, and a recursive grep); the TASK-473 control hits `spec/CHANGELOG.md` on each. TASK-506 kept: cited in
  `docs/research/logs/token-calibration.md`. No TD deletion is due (no resolved rows). No CHANGELOG rotation is due (no new
  minor). No LEARNINGS collapse is due (no new `promoted: yes`).
- ☑ doc-aging, §2: no breach. `check-doc-caps.ts` prints no FAIL line. `.claude/CLAUDE.md` 79/80, `.claude/CONTEXT.md` and
  `docs/architecture/overview.md` 149/150; the token budget reads ~12691 of 12691.
- ☑ epic rollup currency and epic coverage: no active epic. ☑ roadmap: none. ☑ handoff ledger: none.
Intake: the owner asked to research the Codex `run-project-pipeline` skill for adaptations; the verdict and concept map
are in `docs/research/codex-run-project-pipeline.md`. Grill rulings by popup: the demo is a `/prototype` branch; the
builder may reject a finding with evidence when attended and an unattended run parks it; pin-existing-behaviour lives in
`/orchestrator` routing and G2. Filed as TASK-513 to TASK-523 and triaged in `e10f73fe`. The owner chose the six ready P2
tasks. Size check: 4 S, 2 M, no `L`. All are `origin: decomposer`. No epic.

### 2026-10-26 | gate | G1 + G2 signed by the owner by popup; six builder checks settled; three owner rulings
G1: all six members are `origin: decomposer`; the owner confirmed scope unchanged since `approve` (fast-path). G2:
`CHANGELOG.md` is shared by all six, owned in T order (D1); `skills/orchestrator/SKILL.md` T1 → T4 and
`skills/prototype/SKILL.md` T5 → T6 (D2). Dispatch preflight CLEAR (T1=0 … T6=5, base-ref = HEAD `db2b641a`); sequential in
the main tree.
Owner rulings:
- **R1 (T2):** `scripts/night-run.sh` joins T2's `Layers:` by the scope-change below; T2 re-tiers from X to Other G (the
  reaper is maintainer-only: `night-run.md` says its scripts are "lean-flow's own", adopters use them as a reference).
- **R2 (T5):** "validated" means recorded observations from real target users only; a session with the owner or team is
  "ready for walkthrough".
- **R3 (T3):** the init exercise runs in `D:\Research\init-scratch` (an empty folder with a minimal `package.json`, deleted after).
Settled facts and design fixes (coordinator, from the builder checks):
- T1: `/orchestrator` acts on the readback from its resume path: sprint-bulk step 0 (Guard) gains the clause in place, not
  only the Phases pointer; 140 lines held. `/prime`'s `Handoff:` row names `uncertain write: <target> → reconcile first`,
  and a handoff listing "None" adds nothing. Box 3's real input: a real `gate-remote` run started just before a `/handoff`,
  its result unread, resumed in a fresh session.
- T2: `rejected` evidence uses the Done-when's four tokens (test · check · fixture · owner-ruling); `review` stays out,
  since rejecting a review finding by citing review is circular. The token must sit inside `rejected (…)`. A `deferred`
  retry with no `parked-hitl` line is added as a must-FAIL case, varying the selection. The real-artifact run reads an
  archived night-run Execution Log carrying `Tn · retry ·` lines.
- T3: the three First-milestone questions join step 3's popup, same frontier round; each offers "not decided yet",
  which leaves `[CUSTOMIZE]`. Boundary `none` writes side effects `none`. The headless park still covers it.
- T4: the row is a modifier beside the work-type routes, not a fifth route; a bug through `/diagnose` already writes its
  regression test first. T5's first G2 micro-task captures the pin before any edit and re-runs it after; T4's box 3 ticks
  then, and T4 waits in `review/` until T5 lands.
- T5: `demo.md` names its exceptions to Rules 3, 4 and 5 (seeded in-memory fixtures with reset; believable, labelled
  content; state in a presenter panel, not the customer view). README line 196 and the line-483 tree both change. The
  wrong-branch fallback gains a demo rule; the branch is not web-only. The demo lives on its throwaway branch from the start.
- T6: steps are referenced by name, not number; the popup text and answer are pasted into the log as evidence; the target
  is `D:\Research\workdoo` (it has `src/app`).
builder-check · T1 · 3 contradictions · 3 questions · resume-path wiring in Guard + prime Handoff row; real gate-remote input
builder-check · T2 · 3 contradictions · 5 questions · four evidence tokens, parenthesis rule, deferred case; scope + tier by owner ruling R1
builder-check · T3 · 0 contradictions · 5 questions · questions join the step 3 popup with a "not decided yet" option; repo by ruling R3
builder-check · T4 · 1 contradictions · 5 questions · modifier row; pin captured at T5 G2 before edits
builder-check · T5 · 5 contradictions · 6 questions · Rules 3/4/5 exceptions, README lines, fallback rule; "validated" by ruling R2
builder-check · T6 · 0 contradictions · 3 questions · steps by name, popup evidence in log, workdoo target

### 2026-10-26 | scope-change | T2 adds scripts/night-run.sh and drops evals/fixtures/revise-loop/ from its Layers (owner ruling R1)
What broke: the must-FAIL fixture TASK-514 box 3 requires has no mechanism outside `check_revise_ceiling()` in
`scripts/night-run.sh`, the only code that reads the revise-loop outcome words, and that file was not in T2's `Layers:`.
Separately, `evals/fixtures/revise-loop/` is read by T2's box 4 but never edited, so it would fail `layers observed` at
close (L-240). Impact: T2's `Layers:` gains `scripts/night-run.sh` and loses `evals/fixtures/revise-loop/`; T2 re-tiers
X → Other G (must-FAIL fixture plus one run on a real artifact). No Done-when changes. G2 re-confirmed by the owner in the
same popup.
