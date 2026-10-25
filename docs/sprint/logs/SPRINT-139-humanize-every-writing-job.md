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

### 2026-10-25 | progress | T2 (TASK-490) built: /humanizer standalone, English catalog vendored verbatim, roster 15
A Sonnet builder in the main tree (`c86fcb6e`) fetched upstream fresh at `8c307f36` (MIT, Copyright (c) 2025 Siqi Chen),
wrote `skills/humanizer/references/patterns-en.md` (header with source, version, full sha and the MIT text, then upstream's
body), and a 68-line procedure-only SKILL.md with pasted and file modes. Verbatim proof by the coordinator on the committed
blobs, not working copies: from line 35 on it is `cmp`-identical to upstream from line 17 on, both LF. A working-copy `cmp`
first showed a byte-38 difference: Windows CRLF in the checkout, which git normalises. Roster 14 → 15 in CLAUDE.md,
CONTEXT.md (merged two paragraphs, nothing lost, 149/150), README, overview.md and the layout eval (41/0; runtime-manifest legs
see humanizer). Ownership headers refreshed (`525db83d`).
Exercise 1, pasted mode (builder; catalog read in full first). Before: "Great question! Here is an overview of our new caching
layer. It's not just a speed boost, it's a fundamental shift in how we serve data. The layer is fast, reliable, and easy to
maintain. It cuts median latency from 120 ms to 45 ms, a crucial improvement — and the team shipped it in March. That is the
real win. I hope this helps! Let me know if you'd like me to expand on any section." Tells marked: §22 ×2, §1, §6, §12, §8,
§2. Final: "The new caching layer cuts median latency from 120 ms to 45 ms. It shipped in March, and it is reliable and easy
to maintain." Facts kept: 120 → 45 ms, March, reliable, easy to maintain; "fast" is carried by the latency figure. Cut as
dressing: the "fundamental shift" contrast, the closer, the chatbot wrapper. Nothing added.
Exercise 2, file mode, on a copy of `docs/architecture/overview.md` lines 1–24 plus a code fence. Before: "**/flow** … — it
*sequences* the loop … never re-implements a stage. À la carte **or** conducted." After: "**/flow** …: it *sequences* the
loop … and never re-implements a stage. Use the skills à la carte or conducted." YAML, the fence content and every inline-code
span, extracted from both versions, are `cmp`-identical; four prose lines changed.

### 2026-10-25 | progress | T2 (TASK-490): file-mode exercise, the complete before/after (the entry above abridged it)
Codex round 2 asked for the full text: every changed prose line, unabridged. `diff ex-before.md ex-file.md` on the copy:

```diff
10,11c10
< > **Style:** a Claude Code **plugin** — a skill library + one conductor. Not a layered application;
< > the "architecture" is how the skills *compose* into a loop. Curated, not copied (ADR-001).
---
> > **Style:** a Claude Code **plugin**: a skill library plus one conductor. Its architecture is how the skills *compose* into a loop, since there are no application layers. Curated, not copied (ADR-001).
15,16c14,15
< - **Stage-skills are standalone** — each completes its own job when invoked cold. Cross-references between them are routing/handoff *suggestions* (`→ /X`), never requirements (ADR-005).
< - **`/flow` is the only component allowed to depend on the others** — it *sequences* the loop (calling each standalone skill), never re-implements a stage. À la carte **or** conducted.
---
> - **Stage-skills are standalone**: each completes its own job when invoked cold. Cross-references between them are routing/handoff *suggestions* (`→ /X`), never requirements (ADR-005).
> - **`/flow` is the only component allowed to depend on the others**: it *sequences* the loop (calling each standalone skill) and never re-implements a stage. Use the skills à la carte or conducted.
```

Facts checked one by one: the plugin is a skill library plus one conductor; no application layers; the architecture is how
the skills compose into a loop; curated, not copied (ADR-001); stage-skills complete their job invoked cold; cross-refs are
routing suggestions, never requirements (ADR-005); `/flow` alone depends on the others, sequences the loop by calling each
skill, never re-implements a stage; use is à la carte or conducted. All present after; nothing added. Changes are §8 dashes
(three), §1 "Not X; the Y" contrast (one), and §19 bold on "or" (one). Code, YAML and inline code are `cmp`-identical.

### 2026-10-25 | gate | owner ruling R5: a standing narrow Codex round 3 for the rest of this sprint
D3 caps Codex at two rounds. Owner ruling by popup: from T2 on, when round 2 leaves only items already fixed, the coordinator
runs one narrow round 3 on exactly those items without asking. A new finding at round 3, or any need for a round 4, still goes
to the owner.

### 2026-10-25 | progress | T2 (TASK-490) done: 7 of 7 boxes; Codex CLEAR at a narrow round 3 (R5)
consequence · T2 · behaviour:material · governance:low
review · T2 · codex · behaviour:material · governance:low
Codex round 1: NOT CLEAR on three items. (1) Step 6 tolerated a lost claim "unless a pattern calls for cutting it", so it now
cuts only the dressing a pattern names, never a factual claim. (2) README's opening line omitted the writing utility; fixed.
Both in `019faff3`. (3) The exercise evidence was not in the log; added. Round 2: (1) and (2) OK, no regressions, but the
file-mode excerpt was abridged. It is now logged in full. Narrow round 3 under R5: CLEAR. Re-run by the coordinator before
ticking: count-claims 15 = disk 15 in all three files, layout-fixtures 41/0, doc-caps exit 0 (SKILL.md 69/140).

### 2026-10-25 | gate | T3 (TASK-491): the owner reviewed the Indonesian draft; term table and slop list approved with rulings
The phase-A draft (uncommitted: 17 slop patterns ID-1..17 mapped to English §, 24 coinages, a keep-Indonesian list, the
italics rule) went to the owner by popup with its 12 doubtful points. Rulings: all eight doubtful coinages switch to English
(laman → page, daring/luring → online/offline, gawai → device, peramban → browser, pustaka → library, kerangka kerja →
framework, templat → template, peretas → hacker); every draft rule stays (ID-15 "Anda", the ID-6 extras, ID-13/14/16/17);
the keep-list stands as drafted; every foreign term is italicized at first use in a rendered doc, never in commits, code,
identifiers, paths or URLs. The coordinator recommended keeping laman and peretas Indonesian; the owner ruled otherwise.

### 2026-10-25 | progress | T3 (TASK-491) built: Indonesian catalog with the owner's rulings; exercised on an AI-drafted Indonesian text
The phase-B builder (`13eee801`) applied the owner's rulings: eight coinages moved to English, every rule kept, first-use
italics with no borderline class. `skills/humanizer/references/patterns-id.md` has 127 lines: slop patterns ID-1..17 (ten
mapped to English §1, 2, 3, 4, 5, 12–13, 15, 16/18, 22, 23; seven Indonesian-only), a 24-row term table, a keep-Indonesian
list, the mixed-affix rule (di-*deploy*, men-*cache*), and the italics rule. SKILL.md step 1 also reads it in full for
Indonesian or mixed text (71/140). No `(?)` marks remain, and no repo-specific strings appear.
Exercise (builder; both catalogs read in full). Before, verbatim:
"Mari kita selami DeployKit, tool deploy yang tidak hanya mempercepat rilis, tetapi juga mengurangi risiko. Tool ini memainkan
peran krusial dalam lanskap DevOps modern. Setiap deploy dijalankan terlebih dahulu di peladen staging. Pendekatan ini sangkil
karena galat konfigurasi ketahuan sebelum menyentuh production. Selain itu, rollback bisa dilakukan dengan satu perintah. Lebih
lanjut, DeployKit mendukung dry run. Jika terjadi galat saat build, log lengkap ditampilkan. Semoga membantu!"
Final, verbatim:
"DeployKit adalah *tool* untuk *deploy* yang mempercepat rilis dan mengurangi risikonya. Setiap deploy dijalankan dulu di
*server* *staging*, dan pendekatan ini *efficient* karena *error* konfigurasi ketahuan sebelum menyentuh *production*.
*Rollback* cukup dengan satu perintah, dan DeployKit mendukung *dry run*. Kalau *build* gagal dengan error, *log* lengkap
ditampilkan."
Terms: galat → error (twice), peladen → server, sangkil → efficient. Italics at first use only. Nine facts on both sides:
deploy tool · faster releases · less risk · staging first · the approach is efficient · because config errors surface before
production · one-command rollback · dry run · a failed build shows the full log. Cut as dressing: "Mari kita selami", "memainkan
peran krusial dalam lanskap DevOps modern", "tidak hanya … tetapi juga", the stacked connectors, "Semoga membantu!".
The coordinator caught the first final dropping the "sangkil" claim, a step-6 error, and had it redone. The log carries only
the corrected run.

### 2026-10-25 | progress | T3 (TASK-491): Codex round 1 fixes; the exercise's last sentence corrected
Codex round 1: NOT CLEAR on two items. (1) Six example pairs (ID-1, 3, 4, 5, 6, 8) added facts their "before" never stated,
and ID-5 dropped one; ID-10, 16 and 17 had no pair. The builder's bounded retry (`5883e965`) rewrote the six and added the
three, with a 17-line facts-before = facts-after check. The coordinator then kept ID-16's "bermanfaat" conclusion as a claim
in its "after" (`HEAD`). (2) The exercise narrowed "Jika terjadi galat saat build" (an error during build) to "build gagal"
(the build fails). Corrected final sentence, verbatim: "Kalau terjadi error saat *build*, *log* lengkap ditampilkan."
Fact 9 now reads: an error during build shows the full log. The other eight facts and sentences are as logged above.

### 2026-10-25 | progress | T3 (TASK-491) done: 5 of 5 boxes; Codex CLEAR at round 2
consequence · T3 · behaviour:material · governance:low
review · T3 · codex · behaviour:material · governance:low
The coordinator's ID-16 fix recorded above as `HEAD` is `97867184`. Round 2 cleared the example pairs, the exercise and
regressions. The owner's linguistic rulings were held out of the review's scope.

### 2026-10-25 | progress | T4 (TASK-492) built: translate mode, on explicit request only
The builder (`50d5f623`) added a Translate mode to `skills/humanizer/SKILL.md` (+16 lines, 87/140, purely additive). It runs
only on a request naming a target language; default and file modes never translate. It translates meaning, then cleans in the
target language with its catalog: EN→ID reads both catalogs, applies the term table and first-use italics, and checks the ID
slop list; ID→EN checks the EN catalog. Mixed text translates only other-language spans; same-language text gets a clean pass
with a note. Code, paths, YAML, data, link targets and proper names stay.
Exercise 1, EN→ID, on `README.md` lines 229–232 verbatim: "A gated loop: you give intent → it becomes tasks → executes with
human checkpoints → ships. The gates are **inline checklists** (lean-flow ships no agent definitions of its own), and the loop
dispatches Claude's **built-in** agents where they help — recon → `Explore`, review → `/code-review`, verify → `/verify`,
security → `/security-review`. `/council` is the one skill that orchestrates sub-agents internally." Final: "Sebuah *loop*
ber-*gate*: kamu memberi tujuan, tujuan itu jadi *task*, dikerjakan dengan *checkpoint* manusia, lalu di-*ship*. Gate-nya
berupa *checklist* *inline* (lean-flow tidak membawa definisi *agent* sendiri), dan loop men-*dispatch* agent bawaan Claude
bila membantu: *recon* → `Explore`, *review* → `/code-review`, *verify* → `/verify`, keamanan → `/security-review`.
`/council` adalah satu-satunya *skill* yang mengorkestrasi *sub-agent* secara internal." No term-table word occurred; the
English terms were kept with first-use italics. Six facts on both sides; the inline code is unchanged.
Exercise 2, ID→EN. Source (written as an AI-styled note): "Selain itu, migrasi basis data ke Postgres 16 memainkan peran
krusial dalam proyek ini. Migrasi dijalankan pada Sabtu malam dan memakan waktu 40 menit. Lebih lanjut, peladen di-backup
terlebih dahulu, sehingga tidak ada data yang hilang. Jika terjadi galat, rollback bisa dilakukan dengan satu perintah. Semoga
membantu!" Final: "The database migration to Postgres 16 ran on Saturday night and took 40 minutes. The server was backed up
first, so no data was lost. If an error occurs, you can roll back with one command." Six facts on both sides (Postgres 16
migration · Saturday night · 40 minutes · server backed up first · no data lost · one-command rollback on error). Cut as
dressing: Selain itu, Lebih lanjut (ID-11), "memainkan peran krusial" (ID-6, the §13 significance), and "Semoga membantu!" (ID-9).

### 2026-10-25 | progress | T4 (TASK-492): Codex round 1 fixes; exercise 2 corrected; term-table compliance shown
Codex round 1: NOT CLEAR on one item. (1) Exercise 2's final dropped "dalam proyek ini", which ties the migration to the
project. The significance dressing ("memainkan peran krusial") was rightly cut, but that anchor is a fact. Corrected final
(the coordinator restored the phrase; nothing else changed): "The database migration to Postgres 16 for this project ran on
Saturday night and took 40 minutes. The server was backed up first, so no data was lost. If an error occurs, you can roll back
with one command." Facts are now seven: the Postgres 16 migration · for this project · Saturday night · 40 minutes · server
backed up first · no data lost · one-command rollback on error. (2) Term-table compliance for exercise 1, shown by the
coordinator: the 24 coinages in `patterns-id.md`'s table (split on "/"), word-matched against the EN→ID final, give 0 hits. A
seeded control sentence with peladen, peramban, kerangka kerja and daring gives 4 hits, so the scan fires.

### 2026-10-25 | progress | T4 (TASK-492) done: 5 of 5 boxes; Codex CLEAR at round 2
consequence · T4 · behaviour:material · governance:low
review · T4 · codex · behaviour:material · governance:low

### 2026-10-25 | progress | T5 (TASK-493) built and exercised on both paths; three defects found by the exercise and fixed
The builder (`ff735b53`) wrote `skills/humanizer/references/embedded.md` (inputs, the child path with no model override, inline
fallback with its notice, the never-touched list, and R2's failure line), an Embedded mode in SKILL.md, and
`skills/lean-doc-generator/references/humanize-pass.md`. lean-doc-generator step 7 now runs the pass; to stay ≤140 it joined two
lines in the handoff-reconciliation paragraph (139/140). The CONTEXT.md `/humanizer` row names the wiring.
The coordinator ran the exercise as headless `claude -p` sessions on throwaway clones (`--setting-sources project`, so the
owner's installed 2.14.0 stayed out; `--plugin-dir` the clone). The request: `/lean-flow:lean-doc-generator adr "Keep the
vendored humanizer catalog verbatim"`, with a deliberately AI-styled context ("Great question! Let's dive in. … is not just a
list of patterns — it's a living contract … plays a crucial role … future-proof … I hope this helps!"). Three runs per path.
Defects the runs found, each fixed before the final run:
- (1) `embedded.md` read the Indonesian catalog only for Indonesian text, but the frozen Done when says both catalogs; now
  always both (`67253af9`).
- (2) The inline caller read `patterns-en.md` from line 35, skipping the header; "in full" now means first line to last, no
  offset or limit (`a4bb81bb`).
- (3) A parser error of the coordinator's own: the first inline run was reported as printing the notice, but the only
  occurrence was inside its Read of `embedded.md`. The parser now counts only the session's own text.
Final runs, in `D:\lf-exercise\` at `a4bb81bb`, transcript-verified:
- Child: one Agent dispatch ("Embedded humanizer pass on ADR"); the sub-agent Read `patterns-en.md` and `patterns-id.md` with
  no offset or limit; no inline notice.
- Inline: `--disallowedTools Agent`; no dispatch; the caller Read both catalogs with no offset or limit, and its final message
  carries `humanizer: ran inline (no sub-agent available)`.
- Both ADRs keep the template's section order (Context · Decision · Consequences · Alternatives considered; Strategy is
  optional), em-dashes (4 and 3) and bold labels (9 and 10). The draft's tells are gone from the body; they appear only in each
  run's summary of what it removed. Child Context, opening: "`/humanizer` ships an English pattern catalog vendored from
  `blader/humanizer`, upstream version 3.1.0 at commit `8c307f36`, under the MIT license …"
The file write did not happen. Headless sessions in an untrusted folder deny every write as a "sensitive file", in the scratchpad
and in `D:\lf-exercise\` alike. Owner ruling by popup: box 4 is ticked on the generated text; the real install-and-write proof is
T8's. T8's headless consumer run will hit the same trust block, so it is raised at T8's start.

### 2026-10-25 | progress | T5 (TASK-493) done: 6 of 6 boxes; Codex CLEAR at round 2
consequence · T5 · behaviour:material · governance:high
review · T5 · codex · behaviour:material · governance:high
Codex round 1: NOT CLEAR on one ambiguity. The verbatim secret-files line says "report that and ask", but an embedded pass
cannot ask, so two callers could diverge. Brief item 6 now says the pass never asks: an unavailable input returns
`UNAVAILABLE: <reason>`, which the failure rule treats as a failure (`2eb4553c`). Round 2: CLEAR, no regressions.

### 2026-10-25 | progress | T6 (TASK-494) built and exercised: a real handoff and a real release-patch dry run both show the pass
The builder (`ce5f2946`) appended the pass to release-patch step 4 and to its changelog-only path (no renumbering; 100/140;
the never-push rule intact). It added a "Before saving" paragraph to handoff (102/140), with the "What goes in" outline as the
voice sample. The CONTEXT `/humanizer` row lists `/release-patch` and `/handoff`. Exercises: headless sessions in trusted
in-repo worktrees at `ce5f2946` (an in-repo worktree inherits the repo's trust; a probe write succeeded, where the scratchpad
and `D:\lf-exercise\` did not).
- Handoff: one Agent dispatch ("Humanizer embedded pass on handoff"); the sub-agent Read both catalogs whole (no offset or
  limit). The doc was WRITTEN to `C:\Users\HYPE AMD\AppData\Local\Temp\handoff-sprint139-t6.md`. The draft's "Great question!
  Let's dive in", "crucial milestone" and "I hope this helps!" are gone; paths, ids, the commit hash and the headings are
  unchanged.
- release-patch: one Agent dispatch ("Humanizer embedded pass on entry"); the sub-agent Read both catalogs whole, plus
  CHANGELOG as the voice sample. The humanized v2.14.1 entry kept its heading, PATCH lines, ids and bullet structure; only the
  wording changed. No `git push` anywhere in the transcript. Nothing was written: the harness treats all four plugin manifests
  (and the README footer) as sensitive files even in a trusted worktree, and release-patch correctly refused to write a
  CHANGELOG block its unbumped manifests would contradict. The pass itself is shown on the dry run, which is what the box asks.
  For T8: a headless session cannot bump manifests, so the coordinator does the MINOR bump in this session.

### 2026-10-25 | progress | T6 (TASK-494) done: 4 of 4 boxes; Codex CLEAR at round 1
consequence · T6 · behaviour:material · governance:low
review · T6 · codex · behaviour:material · governance:low

### 2026-10-25 | scope-change | T7 (TASK-495): `Layers:` gain diagnose, prototype and triage SKILL.md, and drop release-patch; owner ruling R6 on fixed-template commits
What broke: the census (selector A, a wording grep for commit message / git commit / squash-commit / type(scope) / PR body /
pull request / gh pr; selector B, step-shaped commit instructions; every hit read in context) finds six composer sites:
orchestrator `SKILL.md` (quick step 5, mvp step 7, sprint-bulk loop), `references/dispatch.md` (builders commit),
lean-doc-generator `SKILL.md` (promote `plan locked`, close squash; `sprint-by-reference.md` repeats those commits),
`skills/diagnose/SKILL.md` (the hypothesis in the commit / PR message, the only PR-message site),
`skills/prototype/SKILL.md` (the throwaway-branch commit), and `skills/triage/SKILL.md` (status-move commits). Not
composers: release-patch (it stops and hands back a ready-to-push message), init.md, fog-map.md, handoff-reconciliation.md,
the CONTRIBUTING template, and dispatch.md:649 (reading messages). Impact: T7's `Layers:` gain the three diagnose, prototype and
triage paths and drop `skills/release-patch/SKILL.md`; the Done when is unchanged. Owner-approved by popup.
Owner ruling R6: a commit message that is a fixed template with no free prose (status moves such as "move TASK-NNN todo ->
in_progress", record-sha commits) skips the pass; any message with free prose, including a descriptive subject, goes through it.
