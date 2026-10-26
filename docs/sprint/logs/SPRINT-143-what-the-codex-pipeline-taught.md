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

### 2026-10-26 | progress | T1 done: an uncertain write is read back before it is retried (TASK-513)
Built inline by the coordinator, not dispatched: small in-place prose edits in two skills at their line caps
(orchestrator 140/140, prime 138/140) whose context the coordinator already held. Commits `25a0a55b` (the change) and
`adbc80b6` (density fix). Harnesses that read the touched files, all green: sprint-family, layout, orchestrator-store,
prose-density, qa-store-legs, store-readers, store-writers, work-store, dispatch-preflight, system-verify, worktree-base,
dod-delta.
consequence · T1 · behaviour:material · governance:high
review · T1 · scoped-reviewer · behaviour:CLEAR · governance:CLEAR
Codex R1 NOT CLEAR, 4 findings fixed: inherited writes carried forward (box 1); an inconclusive readback never authorizes a
retry; prime emits the `Handoff:` row for a doc-named write with no repo-side entry; the Guard reference rooted at
`${CLAUDE_SKILL_DIR}`. R2 CLEAR.
Box 3 exercise (real input): a full `qa-check.sh` run started in the background at 10:11 and left unread; a handoff doc
listed it under Uncertain writes; a fresh headless session (plan mode, plugin dir pinned to a `git archive` export of
`25a0a55b`, L-254) read the handoff first, read the log back, checked the process list, found no verdict yet, and ruled
"read the gate log back once the run finishes (don't re-run it)". Its `Handoff:` row read `no ledger entry · uncertain
write: gate-run.log → reconcile first`. Deviation from the G2 note: a local gate run stood in for `gate-remote` (the remote
variables are not set in this shell); the Done-when is unchanged.
The same session found a real defect the coordinator missed: T1 made two lines dense (handoff 427 chars, orchestrator Guard
576), which the prose-density ratchet FAILs. The coordinator had measured line length with an ad-hoc awk instead of running
the gate's own leg. Fixed in `adbc80b6` by splitting both lines, words unchanged (word-diff empty), orchestrator held at 140
by joining two mvp lines that already render as one paragraph; prose-density 26/0. No Codex round on the reflow: no word
changed, and the word-diff proves it.

### 2026-10-26 | progress | T2 done: a review finding can close as rejected (with evidence) or deferred (with impact) (TASK-514)
Built inline by the coordinator (same reason as T1: small edits to an existing guard and its harness, context already
held). Commit `fcb7f289`. Pin captured before any edit: the ceiling harness's 11 cases; after the change the same 11 lines
are identical, and the harness has 26 cases, all green. Every new must-FAIL case passes the pre-change reaper (rc 0), so
each reddens only because of the new check. Real artifacts: the three archived logs carrying `Tn · retry ·` lines
(SPRINT-066, 067, 123) all PASS, so the fail-closed rule raises no false positive. Other harnesses reading the touched
files, all green: dispatch-preflight, night-run-gate-exception, night-run-outcome, night-run-rollup, reap-terminal,
review-depth, run-mode, by-reference, emitter-column, orchestrator-store, qa-store-legs.
consequence · T2 · behaviour:material · governance:high
review · T2 · scoped-reviewer · behaviour:NOT CLEAR · governance:CLEAR
Codex R1 NOT CLEAR (evidence read from the finding text or past the closing parenthesis; no unparked-rejection case) →
fixed. R2 NOT CLEAR (an arrow inside the rejection's own parenthesis read as the outcome) → fixed with a depth-aware parse.
R3, by owner ruling over the 2-round cap (D4), NOT CLEAR (an unmatched `(` in the finding text failed open; nested
parentheses cut the evidence short) → fixed: the parser fails closed with `revise-loop-outcome-unparseable`, and evidence is
read to the matching `)`. Codex sub-agent tokens per round: ~23k, ~28k, ~36k.
Owner rulings: **R4 (T2)** — one Codex round over the cap (round 3). **R5 (T2)** — box 4's `revise-loop` LLM recipe is a
judgment tick (its input and expected outcomes are unchanged and it reads none of the new outcome words). **R6 (T2)** — close
after round 3 with no round 4: the parser now fails closed, so a remaining gap can only produce a false FAIL; a crafted
shape found later becomes a TD row. The review line above records the last round's verdict as NOT CLEAR on purpose; the
close rests on R6, not on a CLEAR.
Uncertain write from T1's exercise, reconciled: the background gate run finished `QA-CHECK: 304 pass, 2 fail`, the two
prose-density FAILs the fresh session predicted, already fixed in `adbc80b6`.

### 2026-10-26 | progress | T3 done: a new repo's requirements.md records its first milestone (TASK-516)
Built inline by the coordinator (a template section and one init bullet). Commit `00f3245b`. No harness reads either file;
prose-density 26/0.
consequence · T3 · behaviour:material · governance:low
review · T3 · scoped-reviewer · behaviour:CLEAR · governance:CLEAR
Codex R1 NOT CLEAR, 1 Standards finding (the added sentence said the section is completed "after step 2 scaffolded the
file", reinforcing init's step 2-before-popup order against its own headless park) → reworded: written only from this
round's answers, headless writes nothing. R2 CLEAR.
Box 3 exercise (owner ruling R3): `D:\Research\init-scratch`, a folder with only a minimal `package.json` (substrate: has
code; no DB, auth or API, so no conditional tier fired). The three milestone questions were asked as the edited init.md
specifies, and the owner answered: proof goal "a first-time user can complete the one main job end to end without help";
stopping condition "one complete journey works on fixtures and the owner has reviewed it"; boundary "simulated", side
effects "none (every simulated action is labelled)". `docs/product/requirements.md` was written from the edited template
with exactly those values; the exercise covered the milestone path only, not the full base-tier scaffold. The folder is
deleted after this entry, per R3.
Caught in the exercise: the new template comment claimed task decomposition reads the proof goal, which is TASK-520 and not
yet shipped; the sentence was removed before commit so the adopter template makes no claim ahead of the code. TASK-520
re-adds it as part of its own wiring.
Out of scope, for the close Retro's tech-debt bucket (pre-existing, raised by Codex): init.md's step 2 scaffolds base-tier
files before step 3's popup decides a headless park; `product-requirements.md.template`'s header comment names lean-flow's
`ADR-012`, which leaks into adopter output.

### 2026-10-26 | scope-change | T4 drops .claude/CONTEXT.md from its Layers (sprint assumption A1)
What broke: the always-loaded token budget sits exactly at its cap (~12691 of 12691), so T4's one-phrase addition to the
CONTEXT.md routing line pushed it to ~12704 and `check-doc-caps` FAILed. Impact: per A1's stated fallback, the routing
modifier lives in `skills/orchestrator/references/dispatch.md` and `skills/orchestrator/SKILL.md` only; CONTEXT.md's
routing line, which already points at `/orchestrator`'s routing, is unchanged. T4's `Layers:` loses `.claude/CONTEXT.md`,
which moves to its `Cites:` (left unchanged). No Done-when changes.

### 2026-10-26 | progress | T4 built: a change to working behaviour starts by pinning it (TASK-519); box 3 waits for T5
Built inline by the coordinator (in-place edits in a 140/140 SKILL.md plus one table row). Commit `5bc89300`.
Harnesses green: orchestrator-store 42/0, sprint-family, dispatch-preflight, system-verify, worktree-base; prose-density
26/0; doc-caps 0 FAIL after the A1 revert.
consequence · T4 · behaviour:material · governance:high
review · T4 · scoped-reviewer · behaviour:CLEAR · governance:CLEAR
Codex R1 NOT CLEAR, 2 findings fixed: SKILL.md listed the pin like a fifth route (now stated as a modifier on whatever route
applies, and dispatch.md's intro says the last row is not a work type); the pin's definition did not reach a dispatched
builder (the builder-brief paragraph now carries the contract in full). R2 CLEAR.
Boxes 1, 2 and 4 ticked. Box 3 (a real change to existing behaviour) is exercised at T5: T5's first G2 micro-task captures
/prototype's current branch routing before any edit and re-runs it after. TASK-519 stays in `in_progress/` until then.
