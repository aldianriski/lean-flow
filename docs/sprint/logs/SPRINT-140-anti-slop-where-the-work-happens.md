---
sprint: 140
slug: anti-slop-where-the-work-happens
owner: Maintainer
last_updated: 2026-10-25
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-140 — Execution Log

> Append-only companion to [`../SPRINT-140-anti-slop-where-the-work-happens.md`](../SPRINT-140-anti-slop-where-the-work-happens.md).
> Uncapped by design (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.

### 2026-10-25 | promote | plan locked, governance signed, nine members: anti-slop where the work happens
Promote governance checklist, signed by the owner by popup:
- ☑ L-promotion: three due. L-237 (a G2 design that paraphrases a frozen Done-when can loosen it), L-240 (a `Layers:` token
  declared for an undecided G2 choice must be pruned once G2 rules) and L-241 (a "without the plugin" proof needs a separate
  headless process, judged from its own init event), each at count 2 with `promoted: no`. Owner ruling: they land as one
  task, TASK-508, this sprint's T1, with a disposition on each pointer when T1 closes. Census, position-anchored on the
  header's status field: 14 active + 214 promoted + 1 superseded = 229 headers, equal to the count of `## L-NNN` headers.
  Reading each active entry's own `count:` and `promoted:` lines lists the same 14 ids; the other 11 are at count 1.
- ☑ TD aging: 93 of 98 open rows aged against sprint 140. Second route: 103 rows − 5 resolved = 98 open, 93 aged + 5 young
  (TD-268 · 269 · 270 · 271 · 272) = 98. A bare `grep 'status: open'` returns 103; the five extra are prose quotes inside
  the file, not rows. Newly aged: TD-267 (low, filed at 137). None is `high`.
- ☑ doc-aging, §11 (owner-approved, applied in `e018ea8d`): TD-163 and TD-099 deleted (resolved at 137; ids stay retired).
  TD-222, 212 and 194 were resolved at 138 and are not yet due. TASK-478, 479, 480 and 481 (SPRINT-137) were pruned: no live
  `.md` citation by two routes (a `git grep` pathspec query and a plain recursive grep with the history paths filtered out),
  and both routes, run on TASK-473 as a control, hit `spec/CHANGELOG.md`. The cancelled TASK-322, 347, 366 and 461 stay; each
  is still cited. No CHANGELOG rotation is due (2.15.0 and 2.14.0 are inline). No LEARNINGS collapse is due: the same six
  `promoted: yes` lines as at SPRINT-139.
- ☑ doc-aging, §2: no breach. `check-doc-caps.ts` exits 0 with no FAIL line. `.claude/CLAUDE.md` 80/80, `.claude/CONTEXT.md`
  149/150; the always-loaded token budget reads ~14114 of 16087.
- ☑ epic rollup currency and epic coverage: no active epic (seven closed, one proposed). ☑ roadmap: none. ☑ handoff ledger:
  none.
Intake: the owner asked what makes anti-slop (`miqdadbadjuber/anti-slop` @ `4ca3b11c`) special and what lean-flow could take
from it. The scan mapped each anti-slop skill against lean-flow's surface first (L-017). Rulings by popup: take code-comment
hygiene, five copy patterns, an audit mode, Grep counts, three code tells, a UI floor, honest prototype placeholders, a DESIGN
direction field, CLAUDE.md compaction and a cross-OS CI matrix; leave the rulebook and the UI pattern lists in anti-slop. At
the grill: compaction is rule plus pointer with a measured ratchet, and the per-line character cap is dropped (ADR-048's token
budget already covers it); the CI matrix is parked `needs-info` P3 (TASK-507); the comment and code tells merge into one task;
audit mode fires on an explicit request only. Decomposed into TASK-499..507 and filed with TASK-508 in `08d2fbc6`.
Size check: 3 M, 6 S, no `L`. Eight members are `origin: decomposer`; TASK-508 is `origin: manual` (filed from governance,
not grilled at intake). No epic.

### 2026-10-25 | scope-change | T6 Depends-on T2 -> T5, so the chain is linear as D1 says
What broke: the pre-dispatch preflight halted on nine `shared-file-unowned` findings. All nine are `CHANGELOG.md` between
T3, T4 or T5 and T6, T7 or T8. D1 says the chain is linear, but T6's `Depends-on: T2` forked it after T2, so the humanizer
branch (T3 to T5) and the UI branch (T6 to T8) had no order between them. Impact: none on scope or on any member's Done
when; only the order changes, with T6 now after T5. Edit: T6's `Depends-on:` line, T2 -> T5. Re-confirm at the batch G2.

### 2026-10-25 | scope-change | T2 Layers gains README.md
What broke: T2's builder check found that TASK-499's last Done-when box reads "README/CHANGELOG line", but T2's `Layers:`
named only `CHANGELOG.md`. A README edit would touch a file no task declares and fail `layers observed` at close. Impact: T2
adds one README line (the `/tdd` row or the review section names the code-slop box); no member's Done when changes. Edit: T2's
`Layers:` gains `README.md`. Re-confirm at the batch G2.

### 2026-10-25 | gate | G1 + G2 signed by the owner by popup; nine builder checks settled; three owner rulings
G1: eight members passed the fast-path (`origin: decomposer`, scope unchanged since `approve`). TASK-508 (`origin: manual`)
took the full checklist: done when L-237, L-240 and L-241 are each `[status: promoted]` with a pointer and a disposition ·
size S · touches `builder-check.md`, `docs/LEARNINGS.md`, `CHANGELOG.md` · out of scope: any checker or guard (ADR-053) and
the orchestrator SKILL.md (140/140). Preflight CLEAR after the two scope-changes above: nine sequential waves (T1=0 … T9=8).
Execution is sequential in the main tree.
Owner rulings:
- **R1 (T9 homes):** a story whose bullet cites no L-NNN moves verbatim to a new subsection of LEARNINGS § Durable rules
  moved out of CLAUDE.md, `disposition: move-to-reference` (the TASK-384 pattern).
- **R2 (T9 ratio):** the budget is re-estimated with the adopted ratio 2.991, at zero headroom (ADR-048); no headless
  recalibration. The calibration log records that CLAUDE.md alone measured 2.841 at adoption.
- **R3 (T8):** the owner supplies the workdoo direction answers by popup when T8 starts; nothing is drafted for them.
Placement (T1, §10 test): both G2 rules go to `builder-check.md` because the G2 checklist loads it at every G2, and the new
section binds the design's author whether or not a reader runs. L-241 goes under § Durable rules › consumer-side, which the
CLAUDE.md consumer-side one-liner points at.
Settled facts and design fixes (coordinator, from the builder checks):
- T1: the promoted shape is L-247's: a `- **L-NNN → promoted: <home>** · disposition: move-to-reference — …` pointer line
  replaces `- promoted: no`, body kept. Verify greps for `disposition:` too. CHANGELOG opens `## [Unreleased]` (SPRINT-139
  precedent); close turns it into the v2.16.0 block.
- T2: `/tdd` names the self-review box by title with a short gloss, no path. The pointer also goes into the worktree brief and
  the reviewer brief, so heavier passes carry the box. Exercise (b) reviews a builder's real diff in the workdoo copy.
  Exercise (a) rules every `scripts/` finding out to one TD at close (A4).
- T3: the "BOTH catalogs" wording in `embedded.md` and the Translate-mode lines change too. The overlay is read every time and
  applies to English spans. The embedded exercise uses `embedded.md`'s own child brief as the caller. The "26 patterns" count
  stays; the overlay is counted separately. Every LF pattern gets a when-not-to-act note.
- T4: strength order is §1–§5 (and the ID patterns that map to them) first, then catalog order; each finding cites `§n`,
  `LF-n` or `ID-n`; weak-alone spans are listed and marked. Each finding quotes the exact sentence it may change, and the diff
  check is against those quotes. Apply is a second turn and runs step 6's fact check on every rewritten span. The description
  gains an "audit" trigger. The exercise states that its pick is simulated.
- T5: counts are occurrences, with fenced and inline code subtracted. Step 6 counts the draft, step 7 re-counts the final;
  "before" in file mode is the original file. Pasted text goes to a scratch file before Grep; failing that, the count is
  manual and the report says so. Rate is per 100 words, per the catalog's § Voice. Only pasted-text and file modes report
  counts.
- T6: one scoped reviewer and a consequence line are added. A deliverable that cannot run ends `UNVERIFIED (cannot run):
  <reason>`, never PASS. Match rule: a listed skill whose name after any `<plugin>:` prefix is `antislop` or `anti-slop`. The
  Delivery Gate's Block 1 covers all five floor checks (R-03, R-25, R-27, R-32, R-35), so deferring does not lower the floor;
  it runs as a PASS/FAIL report on the diff, mode `after` by session choice. If the "without" run cannot exclude an anti-slop
  skill, the coordinator stops and asks the owner.
- T7: pass rule: every number, name, delta and quote in the variants traces to a data source or shows the literal
  `[REAL DATA]`; anything untraced is a FAIL. A seeded fake (`John Doe`, `+12%`) in a copy is the negative control. The
  builder picks a page that reads real data. The transcript must show the repo's `ui.md` was read. The snapshot is `src/` only,
  compared by hash after revert. The generic-layout bullet merges into the existing "differing only in colour" bullet.
- T8: the Overview paragraph stays; the Dial line is marked optional and is deleted when unused; the new header sentence stays
  inside the HTML comment; the render goes to a scratchpad path.
- T9: every bullet is swept, not only the long ones. ADR-048 has zero headroom, so the new budget is the new estimate. Any
  reduction counts. `prose-density-baseline.txt` is not touched: a row that shrinks or reaches 0 passes, and the next promote
  review trims it. Other CLAUDE.md readers checked: `check-count-claims.sh` (three strings), `check-prose-density.ts`
  (always-loaded), `conformance-engine.sh` (ownership header).
builder-check · T1 · 3 contradictions · 2 questions · design fixed (pointer shape, author-binding wording, disposition grep)
builder-check · T2 · 4 contradictions · 3 questions · design fixed; README via scope-change; wiring widened to worktree + reviewer briefs
builder-check · T3 · 3 contradictions · 4 questions · design fixed (stale "both" wording, translate lines, when-not notes)
builder-check · T4 · 3 contradictions · 6 questions · design fixed (ranking, extent, apply re-check, audit trigger)
builder-check · T5 · 4 contradictions · 4 questions · design fixed (rate, final count in step 7, scratch file, occurrences)
builder-check · T6 · 3 contradictions · 5 questions · design fixed (reviewer, UNVERIFIED branch, match rule, gate coverage)
builder-check · T7 · 3 contradictions · 6 questions · design fixed (pass rule, negative control, page rule, snapshot)
builder-check · T8 · 0 contradictions · 4 questions · settled; one intent question to the owner (R3)
builder-check · T9 · 2 contradictions · 3 questions · one fixed (every bullet); one to the owner (R1); ratio to the owner (R2)

### 2026-10-25 | progress | T1 (TASK-508) done: L-237, L-240 and L-241 promoted; Codex CLEAR at round 1
consequence · T1 · behaviour:low · governance:high
review · T1 · codex · behaviour:low · governance:high
Built by one Sonnet builder from the signed design and the coordinator's fixes; committed by the coordinator as `df1c7b68`.
`builder-check.md` gains § Two rules for the design itself (quote a frozen Done-when, never paraphrase it · log the `Layers:`
pruning in the G2 entry), worded to bind the design's author whether or not a fresh reader runs. LEARNINGS § Durable rules ›
consumer-side gains the headless no-plugin proof. The three entries are `[status: promoted]` with L-247-shaped pointer lines
(`disposition: move-to-reference`); `promoted: no` 15 → 12. CHANGELOG opens `## [Unreleased]`. Checks: `check-doc-caps.ts`
exit 0 with no FAIL; prose-density 28/0 (LEARNINGS is uncapped, so outside its population). Codex round 1, static from the
diff with a five-item threat model: CLEAR on every item. 5 of 5 boxes ticked.

### 2026-10-25 | progress | T1 tick tails corrected: each ` ✓` tail moved to its box's first line
`check-sprint-by-reference.ts` reported `FREEZE-EDIT TASK-508` (9 pass, 1 fail) after `914daaff`: four of the five evidence
tails sat on wrapped continuation lines, which the freeze compare reads as an edit (the tail is exempt only at the end of a
box's first line). The ticks were rebuilt from the frozen text at `3dbc2186` with each tail on its first line; the check now
reads 10 pass, 0 fail. No Done-when text changed, so no scope-change is owed. Ticks from T2 on go on the first line.

### 2026-10-25 | progress | T2 (TASK-499) done: the code-slop box lands in the self-review checklist; Codex CLEAR at round 2
consequence · T2 · behaviour:low · governance:high
review · T2 · codex · behaviour:low · governance:high
Built by one Sonnet builder; committed by the coordinator as `bef5bb5c`. The self-review checklist gains `- [ ] No code slop:` (comment
tells · keep list · comments-only guardrail · code tells), and its intro now says the checklist is also the floor under every
heavier pass. Pointers: the dispatch builder brief, the worktree agent brief, the reviewer brief, `/tdd` step 4, README.
Exercise (a): a read-only sub-agent applied the comment list to all 41 files in `scripts/` (a .ts/.sh listing of 38, reconciled
by the 3 .txt files): T1 175 (about 14 strict `=====` banners, the rest titled dash rules) · T6 about 120 (8 confirmed by full
read, the rest estimated from header and length) · T2 1 · T3–T5 0. The concrete item is 7 verbatim copies of a "Shared archive
predicate" comment. Every finding is ruled fix-later, to one TD at the close Retro (A4).
Exercise (b), consumer path in the `D:\Research\workdoo` copy: a headless `claude -p --setting-sources local --plugin-dir
D:/Project/lean-flow` builder (init: lean-flow loaded from the repo, 15 skills). Run 1 was denied reads outside its working
folder and refused to invent checklist marks. Run 2 added `--add-dir D:/Project/lean-flow`, found both sections, made a
one-line real diff in `src/app/taskNavigation.ts` and reported every box, the code-slop box item by item; it reported removing
a duplicate doc comment it had briefly added. It also found a real 'Runs'/'Execution' label mismatch in workdoo (not ours to fix).
The file was restored from its snapshot: sha256 prefix 969901bc7fdef881 before and after.
Codex round 1: NOT CLEAR, one finding: `/tdd`, README and CHANGELOG each repeated a shortened tell list, a second copy that can
drift. Fixed by cutting the three glosses to pointers. Round 2: CLEAR on both items. Checks: check-doc-caps 0 FAIL; prose-density
28/0 (tdd keeps its one baselined dense line). 6 of 6 boxes ticked.

### 2026-10-25 | progress | T3 (TASK-500) done: the humanizer overlay ships; Codex CLEAR at round 2; embedded fact loss → TD
consequence · T3 · behaviour:material · governance:low
review · T3 · codex · behaviour:material · governance:low
Built by one Sonnet builder; committed by the coordinator as `bc5cb4b5`. New `references/patterns-lf.md` (LF-1..LF-5), read in
SKILL.md step 1, both Translate directions, the embedded child brief and the inline fallback; `patterns-en.md` byte-identical
(`5bfea604`). The stale "both catalogs" wording is gone.
Exercise, one 120-word sample with the five plants and ten listed facts, every run a separate headless `claude -p
--setting-sources local --plugin-dir/--add-dir D:/Project/lean-flow` in the workdoo copy, judged from tool calls and the final
result only (L-248):
- Standalone a1: all five handled, one hedge added. a2 (final text): clean.
- Embedded b1: LF-4 rewritten as a list, adding a claim. Fix 1 (coordinator inline, the one bounded retry): LF-4 says to cut an
  end that names nothing. b2: two facts dropped. Owner ruling: strengthen and rerun. Fix 2: the overlay header says each fix
  keeps the claim the dressing carried. b3: LF-3 missed. b4: clean.
- Codex round 1: NOT CLEAR, 2 findings: b4 still kept "covers every invoice" as a scope the text never gave; the LF-3, LF-4 and
  LF-5 examples could shift meaning. Fixed as given. b5: all five caught, one fact dropped. Owner ruling: one more run plus a TD.
  b6: clean. Codex round 2: CLEAR on all three items.
The overlay was read in every embedded run. Three of six embedded runs added or dropped a fact, which is the SPRINT-139
embedded pass itself, not the overlay: a TD at close (owner ruling), with an L candidate. Checks: SKILL.md 92/140;
check-doc-caps 0 FAIL; prose-density 28/0. 5 of 5 boxes ticked.

### 2026-10-25 | progress | T4 (TASK-501) done: humanizer Audit mode; Codex CLEAR at round 1
consequence · T4 · behaviour:material · governance:low
review · T4 · codex · behaviour:material · governance:low
Built by one Sonnet builder; committed by the coordinator as `510d632c`. § Modes gains **Audit (explicit request only)**: numbered
findings with §1–§5 (and ID-1..ID-5) first, each citing `§n`, `LF-n` or `ID-n` with its location and quoted sentence, weak-alone
findings marked; the turn edits nothing. Apply is a second turn that rewrites only the picked sentences, running step 6's fact
check on each. Embedded mode never audits. The description gains two audit triggers; its closing sentence was shortened to keep
line 3 under prose-density's 400-character limit. The coordinator moved the CHANGELOG bullet into task order (D1).
Exercise: a copy of lean-flow's SECURITY.md in a scratch folder of the trusted workdoo copy, two headless turns. Turn 1 (audit):
13 findings in the stated order; sha256 prefix 6f5d2da8fefc7b89 before and after. Turn 2 (resumed session, simulated pick 1·6·9):
the diff shows exactly lines 19, 33 and 55 changed, each inside its quoted sentence. The scratch folder was then removed.
Side finding, outside this task: SECURITY.md still says "Of the 14" and its grant table has no `humanizer` row (the roster is
15 since SPRINT-139); `check-count-claims.sh` does not read SECURITY.md. To the close Retro as a follow-up.
Codex round 1: CLEAR on all five items. 5 of 5 boxes ticked.
