---
sprint: 139
slug: humanize-every-writing-job
owner: Maintainer
last_updated: 2026-10-24
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-139 — Execution Log

> Append-only companion to [`../SPRINT-139-humanize-every-writing-job.md`](../SPRINT-139-humanize-every-writing-job.md).
> Uncapped by design (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.

### 2026-10-24 | promote | plan locked, governance signed, eight members: humanize every writing job
Promote governance checklist, signed by the owner by popup:
- ☑ L-promotion: one due. L-247 (count 2, `promoted: no`): a read-only agent brief must name secret files as off-limits. Owner
  ruling: it lands as TASK-497, this sprint's T1, with `disposition: move-to-reference` recorded on the pointer when T1
  closes. Census, position-anchored on the header's status field: 12 active + 213 promoted + 1 superseded = 226 headers. A
  second route (an awk read of each header's status) agrees. The naive `[status: active]` grep returns 13 because it counts
  L-155's quoting header. The other 11 active entries are at count 1.
- ☑ TD aging: 92 of 97 open rows aged against sprint 139. Second route: 111 rows − 14 resolved = 97 open, 92 aged + 5 young
  (TD-267 · 268 · 269 · 270 · 271) = 97. Newly aged: TD-266 (low, filed at 136). None is `high`.
- ☑ doc-aging, §11 (owner-approved, applied in `09f41c54`): TD-062 · 125 · 130 · 144 · 149 · 172 · 173 · 191 · 204 deleted
  (resolved at 136; ids stay retired). Selected by the scan and again by a row-format grep that lists each resolved row's
  sprint mentions: both give 9. TASK-474, 475, 476 and 477 (SPRINT-136) were pruned. None has a live `.md` citation by three
  routes, and the same pathspec query run on TASK-473 as a control does hit `spec/CHANGELOG.md`. Fixture-only `.md` hits
  under `evals/` count as live under §11's literal definition, so those tasks are retained. No CHANGELOG rotation is due
  (2.14.0 and 2.13.x are inline). No LEARNINGS collapse is due: the same six `promoted: yes` lines as at SPRINT-138, five
  with their pointer, plus L-144's recorded deliberate non-collapse.
- ☑ doc-aging, §2: no breach. `check-doc-caps.ts` exits 0. At cap: `.claude/CLAUDE.md` 80/80 and `.claude/CONTEXT.md`
  150/150; `lean-doc-generator` and `orchestrator` SKILL.md are both 140/140 (Plan A4).
- ☑ epic rollup currency and epic coverage: no active epic (EPIC-005 is `proposed`). ☑ roadmap: none. ☑ handoff ledger: none.
Intake: the owner asked for `blader/humanizer` plus an Indonesian layer. Rulings by popup: vendor + ID layer; clean, and
translate on request; dev code-mixed Indonesian with foreign terms italicized; wire all four writing jobs; embedded calls in
a child context; inline fallback with full catalogs where no subagent is available. Decomposed into TASK-490..496 (`1a5ef063`).
The read-only Codex intake review returned NOT CLEAR, then NOT CLEAR, then CLEAR at round 3. Every fix was folded in before
`approve`. TASK-497 was filed at this promote (`38b85834`).
Size check: 4 S, 4 M, no `L`. Seven members are `origin: decomposer`; TASK-497 is `origin: manual` (filed from governance, not
grilled at intake). No epic.

### 2026-10-24 | gate | G1 + G2 signed by the owner by popup; eight builder checks settled; four owner rulings
G1: seven members passed the fast-path (`origin: decomposer`, scope unchanged since `approve`). TASK-497 (`origin: manual`)
took the full checklist: done when every lean-flow agent brief forbids opening secret files · size S · touches the five brief
sites below · out of scope: a hook or guard (ADR-053), any permission change. Preflight CLEAR on `873a765f`: no cycle, every
shared file ordered, eight sequential waves (T1=0 … T8=7). Execution is sequential in the main tree.
Owner rulings:
- **R1 (T5 tier):** the embedded sub-agent inherits the session model (not Sonnet). Quality first.
- **R2 (T5 failure):** if the pass fails, the caller writes the original text and prints one warning line naming the failure.
  A humanizer problem never blocks a doc, commit or release.
- **R3 (T5 voice sample):** in embedded mode the host template or existing doc is the voice sample, so `—`, `→` and bold
  labels survive; standalone mode keeps upstream force. Signed with the design.
- **R4 (T8):** the MINOR (2.15.0) is bumped by hand, since release-patch is PATCH-only. The consumer proof loads a zip of the
  release commit with `--plugin-dir`, in a headless session in a throwaway repo; the owner's installed plugin is untouched.
  TASK-496's fourth box is reworded under the scope-change below.
Defaults signed with the design: T3's builder writes the AI-styled Indonesian sample and marks doubtful terms for the owner;
T4 translates on any explicit request naming a target language, translates only the other-language spans of mixed text, and
gives text already in the target language a clean pass only.
Settled facts (coordinator, from the builder checks):
- CHANGELOG has no `[Unreleased]` section. T1 opens `## [Unreleased]` at the top, T2–T7 add to it, and T8 turns it into the
  `v2.15.0` block in house format. The 2.13.x rotation happens at close, as at v2.14.0.
- Upstream is pinned to `8c307f367c91bd974002f10f2be2965d642c13df`. A failed fetch stops T2; no fallback copy is used (D4).
  `patterns-en.md` keeps upstream text verbatim for every kept pattern. An `adapt` row adds a separate lean-flow note beside
  the pattern and never edits upstream text. The 26-row review is shown to the owner before the catalog commit.
- T2's eval edit is the array at `evals/run-layout-fixtures.ts:358`, plus the comment at :349.
- T3's section tags match upstream numbering (§1 contrast · §2 closers · §3 sayings · §4 run-up · §12 words · §13 inflation
  · §22 chatbot residue), read from the pinned SKILL.md.
- T6's handoff has no template, so its voice sample is the skill's "What goes in" outline. release-patch's pass covers the
  changelog-only path as well as step 4, and never changes version lines, headings or bump lines.
- T7: only `skills/diagnose/SKILL.md` composes a PR message, so the PR-body exercise is diagnose's wired step. The
  lean-doc-generator close-commit exercise runs in a throwaway clone (promote and close a one-task sprint). Commit prefixes and
  `Co-Authored-By` trailers stay verbatim. Census sites outside `Layers:` go through a scope-change at build.
- Codex gauntlet: the coordinator runs it after each builder commit (D3). Builders return their log text and before/after
  evidence in their report; the coordinator writes the log.
builder-check · T1 · 4 contradictions · 4 questions · census finalised at G2 (five sites, two selectors reconciled, below); per-site grep replaces "five hits"; census copied into TASK-497; L-247 pointer names the sites
builder-check · T2 · 2 contradictions · 2 questions · eval array :358 named; "8 sites" count dropped; review-before-commit order and verbatim-plus-note rule set; pinned sha + stop-on-fetch-failure
builder-check · T3 · 2 contradictions · 5 questions · four italics exclusions copied from Done when; tags checked against upstream; detection = model judgment, Indonesian or mixed reads both catalogs; sample + doubtful terms by default (signed)
builder-check · T4 · 3 contradictions · 4 questions · EN→ID runs the term policy and the ID catalog on output, ID→EN the EN catalog; triggers and mixed-text rule by default (signed); log owned by coordinator
builder-check · T5 · 4 contradictions · 6 questions · tier R1, failure R2; verify adds a structure + house-style diff of the doc, same doc on both paths; CONTEXT note goes in humanizer's roster row; `--disallowedTools` confirmed in the CLI
builder-check · T6 · 4 contradictions · 4 questions · voice sample = "What goes in" outline; pass covers the changelog-only path; structure untouched; dry run in a throwaway clone with a code diff
builder-check · T7 · 3 contradictions · 4 questions · diagnose is the PR-body site (scope-change at build); close-commit exercise in a throwaway clone; orchestrator SKILL.md stays net-zero lines; trailers verbatim
builder-check · T8 · 2 contradictions · 6 questions · `[Unreleased]` opened by T1; rotation at close; R4; README/CONTEXT re-check is a read, and drift goes through a scope-change

### 2026-10-24 | scope-change | T1 (TASK-497): `Layers:` gain the three brief sites the G2 census found
What broke: the census (selector A, wording grep for sub-agent / dispatch / reviewer / reader / Explore / advisor; selector
B, a read of each skill's spawn steps) finds five brief sites, but T1's `Layers:` named two. The five are
`skills/orchestrator/references/dispatch.md`, `skills/orchestrator/references/review-scoping.md`,
`skills/orchestrator/references/builder-check.md`, `skills/task-decomposer/SKILL.md` (recon) and
`skills/council/references/prompts.md` (research, advisor, reviewer, chairman). Excluded, with reason: `night-run.md` and
`night-run-checks.md` dispatch through `dispatch.md`'s briefs and add none of their own; orchestrator `SKILL.md` names the
routing, not a brief; refactor-advisor's "Explore" is a phase, not an agent; diagnose, flow, prototype and prime spawn no
briefed agent. Impact: three paths are added to T1's `Layers:`; the Done when is unchanged. G2 re-confirmed in the gate entry above.

### 2026-10-24 | scope-change | T8 (TASK-496): box 4 rewords the push stop for a hand-bumped MINOR
What broke: TASK-496's fourth box reads "release-patch stops before push; the owner pushes", but release-patch is PATCH-only
and this release is a MINOR, bumped by hand as at v2.14.0. Owner ruling R4: the box becomes "The MINOR is bumped by hand
(release-patch is PATCH-only); nothing is pushed; the owner pushes." Impact: one box reworded; the outcome (no push by the
agent) is unchanged.

### 2026-10-24 | scope-change | T8 (TASK-496): correction, the reworded push box is box 5, not box 4
The entry above names "box 4". TASK-496's `## Done when` has five boxes, and the push box ("release-patch stops before push;
the owner pushes") is the fifth. The ruling and the new wording are unchanged.

### 2026-10-25 | progress | T1 (TASK-497) done: every agent brief keeps out of secret files; L-247 promoted; Codex CLEAR at an owner-authorised round 4
A Sonnet builder in the main tree (`e2865e83`) put the secret-files rule at every brief site: `dispatch.md` (builder brief,
worktree protocol), `review-scoping.md`, `builder-check.md`'s reader prompt, task-decomposer's `Explore` recon clause, and
the council's research, advisor, reviewer, chairman and fact-check prompts. It collapsed L-247 to its pointer
(`disposition: move-to-reference`) and opened CHANGELOG `## [Unreleased]`. No hook, guard or checker was added (ADR-053).
Exercised on two real briefs: this sprint's T1 builder dispatch, and an `Explore` recon for T2 briefed per the edited text.
consequence · T1 · behaviour:material · governance:high
review · T1 · codex · behaviour:material · governance:high
Codex round 1: NOT CLEAR, because the council moderator prompt was the one brief without the rule; fixed inline in `eda9b5a6`
(a one-sentence edit), and an awk pass over every fenced block confirmed the rest. Round 2: NOT CLEAR, because the census
lived in the log, not the task; added to TASK-497 (`d70586f5`). The owner authorised a narrow round 3, which found the census
count said ten for eleven briefs; fixed in `fc5439c8`. Two routes agree at 11 (case-insensitive grep hits; table cells, with a
5-row control). A first table count returned 13 because of a bug in the query (the file was passed to the second awk too),
not in the file. The owner authorised round 4 on the count alone: CLEAR.
Gate: a local full `qa-check` reached 294 pass, 2 fail. (1) The 520 s budget stopped it at harness 23, leaving 11 harnesses
unrun; this host's known limit, so the full gate runs off-host at close. (2) The scope-change leg found the T1 entry naming
`night-run.md` and `night-run-checks.md` (its exclusion list) without a `Layers:`/`Cites:` home; they were added to T1
`Cites:` (`3c22c536`), and the leg re-run alone passes 10/0. The learnings legs and doc-caps pass; task-decomposer is at
130/140.
