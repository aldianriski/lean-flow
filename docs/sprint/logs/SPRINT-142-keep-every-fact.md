---
sprint: 142
slug: keep-every-fact
owner: Maintainer
last_updated: 2026-10-25
status: closed
update_trigger: an Execution Log entry is appended
---

# SPRINT-142 — Execution Log

> Append-only companion to [`../SPRINT-142-keep-every-fact.md`](../SPRINT-142-keep-every-fact.md). Uncapped by design:
> this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> Rendered at promote, in the same commit as `plan locked`; its first entry is the `promote` entry
> carrying the signed governance checklist.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.

### 2026-10-25 | promote | plan locked, governance signed, two members: keep every fact
Promote governance checklist, signed by the owner by popup:
- ☑ L-promotion: one due. L-234 (a scope-change entry is attributed by its heading and must declare what it names) at
  count 2 with `promoted: no`. Owner ruling at intake: it lands as TASK-512, this sprint's T1, with a disposition on its
  pointer when T1 closes. Census by each header's first status field: 13 active + 218 promoted + 1 superseded = 232,
  equal to the count of `## L-NNN` headers. Each active entry's own `count:` line lists L-234 alone at 2.
- ☑ TD aging: 98 of 101 open rows aged against sprint 142. Second route: 101 rows, 0 resolved; 98 aged + 3 young (TD-273 ·
  274 · 275) = 101. Newly aged: TD-272 (low, filed at 139). None is `high`.
- ☑ doc-aging, §11 (owner-approved, applied in `a71508ca`): TASK-490 to TASK-497 (SPRINT-139) pruned: no live `.md`
  citation by two routes (a scan of `git ls-files` `.md` paths with the §11 history paths filtered out, and ripgrep over
  the working tree), and both routes, run on TASK-473 as a control, hit `spec/CHANGELOG.md`. No TD deletion is due (no
  resolved rows). No CHANGELOG rotation is due (2.16 and 2.15 are inline). No LEARNINGS collapse is due: the same six
  `promoted: yes` lines.
- ☑ doc-aging, §2: no breach. `check-doc-caps.ts` prints no FAIL line. `.claude/CLAUDE.md` 79/80, `.claude/CONTEXT.md` and
  `docs/architecture/overview.md` 149/150; the token budget reads ~12691 of 12691.
- ☑ epic rollup currency and epic coverage: no active epic. ☑ roadmap: none. ☑ handoff ledger: none.
Intake: the owner asked what to tackle next to improve the plugin and picked TD-274 plus L-234. Grill rulings by popup: the
embedded child checks its own facts; the bar is 0 of 6 runs; one retained sample; L-234 goes to LEARNINGS edit-safety plus
one template line. Filed as TASK-511 and TASK-512 in `76650898`. Size check: 1 M, 1 S, no `L`. Both are
`origin: decomposer`. No epic.

### 2026-10-25 | gate | G1 + G2 signed by the owner by popup; two builder checks settled; one owner ruling
G1: both members are `origin: decomposer`; the owner confirmed scope unchanged since `approve` (fast-path). G2: `CHANGELOG.md`
is the one shared file, owned T1 → T2 (D1); preflight CLEAR (T1=0, T2=1). Sequential in the main tree.
Owner ruling:
- **R1 (T2 baseline):** if the 3-run baseline on the new sample shows 0 of 3 losing a fact, the sample is strengthened once
  (more of the fact kinds SPRINT-140 lost) under a scope-change and the baseline re-run, before any after-fix run. The
  fixture is frozen from the first after-fix run on.
Settled facts and design fixes (coordinator, from the builder checks):
- T2 judging: each run is judged from its own `stream-json` transcript. A fresh judge compares the final with `facts.md`
  (kept, dropped, added), and the coordinator confirms from the transcript that the final returns no fact list.
- T2 wording: the new brief step reads "the pass (the child, or the caller in the inline fallback)", so the fallback
  carries the same step.
- T2 briefs: the before and after briefs are assembled from `embedded.md` at `plan_commit` and after the fix, identical
  but for the new item; NOTES.md records both shas. `evals/fixtures/humanizer/` is new; NOTES.md follows the count-claims
  fixtures.
- T1: `## [Unreleased]` is the heading SPRINT-140 used (`c364ee22`). After T1, run the three sprint-log readers
  (`run-sprint-log-layout-fixtures.sh` · `run-sprint-family-fixtures.sh` · `run-conformance-engine-fixtures.sh`, L-251).
- Missed step, on the record: the owner's standing rule asks for a Codex review of intake drafts before `approve`; TASK-511
  and TASK-512 were approved without one. Both still take the Codex loop on their diffs (D3).
builder-check · T1 · 0 contradictions · 3 questions · settled from the repo (heading style, pointer clause left to the builder, sprint-log readers to run)
builder-check · T2 · 3 contradictions · 4 questions · judging from the transcript, fallback wording, brief assembly fixed; baseline-0/3 by owner ruling R1

### 2026-10-25 | progress | T1 done: L-234 promoted to edit-safety plus a sprint-log template line (TASK-512)
Inline, not dispatched: four short prose edits whose wording the G2 design fixes. `9a69a6ec` adds a ❌ paragraph to LEARNINGS
§ Durable rules › edit-safety, marks L-234 `[status: promoted]` with a move-to-reference pointer, adds one generic line to
the shipped sprint-log template, and opens `## [Unreleased]` in CHANGELOG. The template is CRLF; the first edit attempt
missed on line endings and was redone with CRLF. Checks: prose-density 26/0 · doc-caps budget ~12691/12691 · gen-index
current · no `scripts/` path in the shipped diff · run-sprint-log-layout, run-sprint-family and run-conformance-engine
fixtures all green (L-251). Codex round 1: CLEAR on all four threat items (Done-when fidelity · consumer-side · accuracy ·
promotion shape).
consequence · T1 · behaviour:low · governance:high
review · T1 · codex · behaviour:low · governance:high

### 2026-10-25 | surprise | T2 baseline runs 1-3 discarded: each child read the live embedded.md while the coordinator edited it
The three baseline runs used the brief assembled from `embedded.md` at `07f10d29`, but each child also reads `embedded.md`
itself, from the plugin directory (the live checkout), because the humanizer SKILL.md routes embedded mode there. The
coordinator wrote the fix into that file while the runs were in flight, so they cannot count as a pre-fix baseline.
Discarded unjudged. The re-run pins the plugin directory to an export of `07f10d29` (`git archive` of `skills/` and
`.claude-plugin/`; `embedded.md` matches the plan_commit blob except line endings, and carries no fact-list step). The
after runs will pin to the fix commit the same way. The discarded runs also showed a judging gap: each final kept
"faster", which the text implies ("not just faster") but `facts.md` listed only as dressing. `facts.md` now says that
"faster" may be kept or cut and counts as neither; this landed before any run was judged. `git worktree add` failed on
the scratch path ("Could not reset index file"), hence the export.

### 2026-10-25 | scope-change | T2 strengthens the sample once under ruling R1 (pinned baseline 0 of 3)
What broke: the re-run baseline (pinned to `07f10d29`) kept all eleven facts in 3 of 3 runs, by the coordinator's read of each
final against the fixture's fact list; every final stayed close to the original sentences, so the sample cannot tell a fix from no
fix. Impact: per owner ruling R1, `evals/fixtures/humanizer/fact-keep/` is strengthened once before any after-fix run.
The same eleven facts now sit inside dressing the pass is tempted to cut (the range, audience and scope in bold-label list
items, the hedged number inside an inflated contrast, the email fact in a closer), and the fixture's fact list lists the new dressing.
The 3-run baseline then re-runs against the same pinned plugin dir. The fixture is frozen from the first after-fix run. No
member's Done when changes. Re-confirm G2: not needed (R1 pre-approved this branch).

### 2026-10-25 | scope-change | TASK-511 (T2) box 5 narrows TD-274 instead of resolving it (owner ruling R2)
What broke: the defect did not reproduce. A fresh judge, given only the fact list and the finals, scored all six pre-fix
runs (three on each sample version, pinned to `07f10d29`) at 11 of 11 kept and nothing added. The fact-list step cannot
be shown to fix a loss that does not occur here. Owner ruling **R2**: ship the step as a guard, run the six after-fix runs
as a regression check, and narrow TD-274 (not reproduced; guard added; re-measure on the first loss seen in a real writing
job) rather than mark it resolved. Impact: TASK-511's fifth box changes from "TD-274 is resolved with the before and after
rates" to "TD-274 is narrowed with the before and after rates and a re-measure condition"; the other four boxes stand, and
the third is ticked with the 0-of-3 result it recorded. Edit: that box's text in TASK-511, then `TECH-DEBT.md` at the end
of T2. Re-confirm G2: not needed.

### 2026-10-25 | progress | T2 after-fix runs, round 1: a narration leak and an unloadable skill; Codex round 1 NOT CLEAR on missing input
Six after-fix runs against an export of `cae91606`. a4 is invalid: its Skill call failed and read access was refused, so it
returned `UNAVAILABLE` under the contract's failure rule (an environment failure, not a fact loss). a2 returned the line
"Reading done; I'm drafting the rewrite and checking it against the fact list now." above its final, and a caller would
paste that into its document; none of the six pre-fix runs did this, and the line names the new step, so it counts as a
regression the fix introduced and fails the bar as an addition. a1, a3, a5 and a6 read as eleven of eleven kept, nothing
added, no fact list in the final. Codex round 1: items 2 to 4 CLEAR; item 1 NOT CLEAR only because the review input
omitted `sample.md`. Fix (the one bounded builder retry): item 4 now says the list, the check and any remark about them
are working material and none of it is returned, only the final text. All six runs re-run on the unchanged sample;
Codex round 2 gets the sample.

### 2026-10-25 | scope-change | T2 corrects fact 11 in the fixture's fact list after Codex round 2 (owner ruling R3)
What broke: Codex round 2 found that fact 11 read "the next morning" while the sample says "by the next morning", a
deadline rather than a time. The fixture was frozen from the first after-fix run (R1). Owner ruling **R3**: apply the
correction, and run a third Codex round on it. Impact: the comparand gets stricter, not looser; the nine finals already
scored (three pre-fix, six after-fix round 2) were judged under the corrected wording by a fresh judge, at 0 of 3 and 0 of
6. `evals/fixtures/humanizer/fact-keep/sample.md` is unchanged. Edit: fact 11 in
`evals/fixtures/humanizer/fact-keep/facts.md`. No member's Done when changes.

### 2026-10-25 | progress | T2 done: the embedded fact-list step ships as a guard; TD-274 narrowed (TASK-511)
After-fix round 2, six runs against an export of `cc398202`, two waves of three: every run read the pinned plugin dir,
every final begins with the rewritten text, and none carries a fact list or a remark. A fresh judge, given only the fact
list (with Codex's round-2 "by" correction) and the finals, scored the three strengthened-sample pre-fix runs 0 of 3 and
the six after-fix runs 0 of 6. Codex: round 1 NOT CLEAR on missing input only; round 2 CLEAR on the fix, one fixture
finding (fact 11's "by"); round 3 (owner-ruled) CLEAR. `83a4b016` narrows TD-274 with the rates and a re-measure condition,
and adds the CHANGELOG line. 5 of 5 boxes ticked. Cost: 18 headless runs (3 discarded, 3 on the first sample, 3 strengthened
baseline, 6 + 6 after-fix), three judge passes, four Codex rounds.
consequence · T2 · behaviour:material · governance:low
review · T2 · codex · behaviour:material · governance:low

### 2026-10-25 | close | 2 of 2 delivered, 9 of 9 DoD; system verify 310/0 on the first run; Retro and buckets
System verify on the VPS gate: 310 pass, 0 fail on `6500361e`. Close gate (`check-sprint-by-reference --close
--scope-change`): 7 pass, 0 fail. No handoff entry was ever written. Buckets: L-254 (pin the plugin dir for a measurement
run) · L-255 (a retained sample must first show the failure) · L-234 promoted in T1 · TD-274 narrowed in T2 · CHANGELOG
`[Unreleased]` carries both tasks. No follow-up task.
