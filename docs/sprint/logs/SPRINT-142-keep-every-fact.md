---
sprint: 142
slug: keep-every-fact
owner: Maintainer
last_updated: 2026-10-25
status: active
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
