---
sprint: 094
slug: guards-for-what-nothing-reads
owner: Maintainer
last_updated: 2026-09-01
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-094 — Execution Log

> Append-only sibling of the frozen Plan (ADR-014). The § Plan is frozen at promote; a mid-sprint
> scope shift is logged **here** before the Plan is edited.

---

### 2026-08-31 | promote | G1 + G2 signed at `8681143`; full checklist, no fast-path

**G1 ran the full checklist on all four tasks, and the reason is a fact about them rather than a
judgement:** none is `origin: decomposer`. `TASK-324`/`325` are `manual`, `TASK-318`/`323` are
`close-retro` — neither passed `/task-decomposer`'s intake grill, so there is no prior scope agreement
for a fast-path to re-confirm. Read from each task's own `origin:` field, never inferred from how the
entry reads. No `L` size; nothing to split. Shared-file map pre-locked as **D1** (`scripts/qa-check.sh`,
T1→T2→T3 order) and **D2** (`lean-doc-generator/SKILL.md`, 126 lines against a ~140 cap).

**Three of four assumptions confirmed against artifacts before G2; the fourth was ruled.**

**A4 — derived, not inherited, exactly as the task demanded.** 29 `worktree-agent-*` branches, all 29
ancestors of `main`, zero unmerged. Cross-checked against `git branch --merged main --list` which
returns the same 29. The inherited figure was right; it is now *known* right, and the 11 branches
SPRINT-092 never checked are covered.

**A2 — confirmed, and the scope does NOT narrow.** The Execution Log's event vocabulary is
`promote · progress · surprise · scope-change · park · blocker · run-complete · close`. The string
`handoff` occurs **0 times** in `templates/sprint-log.md.template` and **0 times** in both existing
logs (092, 093). The log does not already carry the fact, so T2 builds rather than reads.

**A3 — confirmed and stronger than the Plan assumed.** The class is statically detectable: every
motivating symbol is reached by a literal ES import. And **two of the three motivating artifacts are
live in the working tree right now** — `reconcile` (`packages/standard/src/spec-reader.ts:386`) and
`marksInStandard` (`:278`) are both exported with zero non-test callers outside their own defining
file. T3's must-FAIL can therefore point at the current tree rather than a historical checkout, which
is L-166's bar met the strong way. `attachLevel` · `createF4Registry` · `createS4AppendRegistry` are
wired today and become the sibling controls. **A design constraint fell out of confirming this:**
`marksInStandard` appears four times inside its own file (three doc comments plus the export), so a
naive "is it referenced anywhere" query reports it as having a caller. The detector must exclude the
defining module's self-references — L-108's match-by-shape-not-substring shape, and the case that
would silently defeat the guard.

**A1 — ruled, not confirmed** (see the scope-change below).

**T2's open design question, ruled by the owner at G2 and recorded because a ruling nobody can find is
not a ruling (L-151):** the repo-side handoff stub is an Execution Log **`handoff` event** where a
sprint exists, plus **one named fallback ledger** for the no-sprint case (governance, `/triage`, a
research pass), carrying the same three-state status. Both halves are required: without the fallback,
an UNKNOWN status in the no-sprint case would have to be assumed `spent`, which is precisely the
silent-loss shape T2 exists to close. `lean-doc-generator`'s own headless-park instruction resolves
that case *to the handoff doc* and was explicitly **not** inherited as the answer, being circular here.

**Not signed as an approval envelope.** `approval_envelope:` is absent and stays absent — this sprint
is attended, and G1/G2 signing does not imply it (different grants).

---

### 2026-08-31 | scope-change | T1's `Layers:` — widen `check-epic-archive.sh` rather than add a second script

**What broke:** nothing in the goal; the *implementation shape* frozen in `Layers:` was the wrong one.
The Plan named a new `scripts/lib/check-epic-state.sh` and put `check-epic-archive.sh` in `Cites:`
("read, never modified"). Re-derived at G2 as `A1` required: that script is 143 lines and already
parses § Closed-when tick/untick counts, `member_sprints:`, per-member closed-state (archive/ **or**
`status: closed`) and `status:` — the majority of T1's machinery. Building a second script would
re-implement working parsing and leave two Shell checkers reading one artifact, which is how
**TD-087** and **TD-097** became two rows for one script three sprints apart, neither aware of the
other.

**Impact:** `check-epic-archive.sh` moves from T1's `Cites:` to its `Layers:` — a token in both is
itself a named FAIL, so this is not optional bookkeeping. `check-epic-state.sh` and
`run-epic-state-fixtures.sh` leave `Layers:`; `run-epic-archive-fixtures.sh` joins it. The three drift
classes and every DoD are unchanged — only where they land.

**Re-confirm G2:** yes, owner-ruled at sign-off. The task's own `assumes:` anticipated both outcomes
and stated the preference ("if the header half turns out reachable by widening an existing checker,
prefer that over a new script and say so"), so this is the Plan resolving as written, not a pivot.

---

### 2026-08-31 | scope-change | T3's `Layers:` — TypeScript in `test/architecture/`, not Shell

**What broke:** the Plan froze T3 as `scripts/lib/` + `scripts/qa-check.sh` + `evals/fixtures/`, and
that was my error at promote rather than a change of mind. T3 analyses the **TypeScript module graph**
in `packages/` and `apps/`. It is not a Standard rule id, so EPIC-014 **D2**'s strangler — which is
what legitimately keeps Shell authoritative per unmigrated rule family — does not bind it at all.
`test/architecture/` already exists for exactly this shape: `dependency-direction.test.ts` is an
architecture-fitness rule in TS carrying "one must-FAIL fixture per rule, each with ITS finding" plus
controls, which is T3's vocabulary verbatim. Precedent for TS reading source structurally is
`test/adr-family-harness-parity.test.ts`.

**Impact:** `Layers:` becomes `test/architecture/` + `test/fixtures/`; `scripts/qa-check.sh` leaves
T3's `Layers:`, which **dissolves D1's three-way share down to T1–T2**. Runs under `bun test`, already
invoked by the gate through `package.json` `scripts.test` (a requirement of ADR-035, not a
convenience). A real module graph also handles A3's self-reference constraint directly instead of
special-casing it in `grep`.

**Re-confirm G2:** yes, owner-ruled at sign-off, and informed by **TD-129** filed in the same session:
TypeScript covers **10 of 51** checkable Standard rules (~20%), so a Shell T3 would have added to the
41-rule remainder for no benefit, while a TS T3 adds to neither side of that ledger.

---

### 2026-09-01 | scope-change | T1's Acceptance was false as frozen — EPIC-015 does NOT stay green

**What broke:** the criterion, not the scope. T1's **Acceptance** reads *"run against `33187dc`, it
stays green on EPIC-015"*. Measured against `EPIC.md.template` — the SSOT, whose Status cell is
`closed · `<close_commit>`` — EPIC-015 produces **7 findings**, so the criterion was untrue the moment
it froze. This is **L-185**'s shape (a criterion resting on an unexamined claim about current state)
arriving through **L-088**'s door (a DoD execution invalidates), and the rule for both is the same:
log it and get a ruling, never re-read the words to fit what was built.

**What the measurement actually found — and it is better for the guard than the frozen version was.**
The two live epics fail *different* classes, so each class has a real failing artifact **and** a real
passing sibling in the working tree, which is L-166's bar met the strong way and without a historical
checkout for two of the three:

| Class | Fails on | Passes on (sibling control) |
|---|---|---|
| (a) member row carries its `close_commit` | **EPIC-015** — 4 rows written `**closed** <date> — N of M DoD` | EPIC-014 — all 5 carry one |
| (b) `last_updated` not older than the last member close | **EPIC-014** at `d43a7a1` | EPIC-015 |
| (c) a ticked § Closed-when condition names its closing sprint | **EPIC-015** — 3 ticked, none names one | EPIC-014 — both name SPRINT-085 / 091 |

**Impact:** shipping the guard reds the gate until EPIC-015's drift is fixed, and ADR-021 makes a red
gate block the close. **Owner ruled: fix the drift inside T1** — the guard found real drift and fixing
it is the point. Acceptance is restated as a before/after on a real artifact rather than a static
claim: EPIC-015 reports 7 findings **before** the fix (that is the must-FAIL, on the live tree, not a
fixture) and both epics are green **after**. Class (a) was checked against the template before being
encoded — requiring a `close_commit` is the template's rule, not one invented here to look mechanical.

**Re-confirm G2:** yes, owner-ruled. The added work is bounded and derived, not estimated: four
`close_commit` values read from each member sprint's own frontmatter (`dc3690a` · `cc46d18` · `cc46d18`
· `33187dc`) and three condition→sprint attributions read from the member rows' own contribution text
(088 states "§ Closed-when 2 complete"; 089 states "Contributed § Closed-when 3 and 4"). **`cc46d18`
appearing twice was verified, not assumed** — `git show --stat` confirms that commit modified
SPRINT-090's Plan by 41 lines, so 089 and 090 genuinely closed in one commit and the repeat is not a
copy-paste error being propagated into the epic table.

---

### 2026-09-01 | progress | T1 — 5 of 6 DoD; the guard found 7 real findings and they are repaired

`consequence · T1 · behaviour:material · governance:high` — a Tier G guard over the epic layer; a
false negative here is silent by construction, which is the whole reason it exists.

**The check.** `check-epic-archive.sh` widened 143 → 264 lines with a third direction, `epic-state:`,
distinct from `epic-archive:` so a rollup-drift finding is distinguishable from a retention one
without parsing the sentence (L-058). Three classes: (a) a closed member with no rollup row, or a row
whose Status cell carries no `close_commit`; (b) an ownership header older than its newest member
close; (c) a ticked § Closed-when condition naming no closing sprint.

**Pointed at real artifacts before any fixture existed (L-166), and each class has a real sibling
control** — fixtures prove a branch works, only the motivating artifact proves it is reachable:

| Class | FAILed on (real) | Stayed green on (real) |
|---|---|---|
| (a) | EPIC-015 ×4 — every member row read `**closed** <date> — N of M DoD` | EPIC-014, all 5 rows carry a sha |
| (b) | **EPIC-014 at `d43a7a1`** — `last_updated: 2026-08-29` over a body edited 2026-08-31, through a fully green gate | EPIC-015, **0** class-(b) findings at that same tree |
| (c) | EPIC-015 ×3 — three ticked conditions, none naming a sprint | EPIC-014, both ticked conditions name SPRINT-085 / 091 |

**The 7 findings were repaired, so the gate is green rather than red-with-a-note.** Four
`close_commit` values were **derived** from each member sprint's own frontmatter, never estimated —
`dc3690a` · `cc46d18` · `cc46d18` · `33187dc`. `cc46d18` appearing twice was **verified rather than
assumed to be a copy-paste error**: `git show --stat` confirms that commit modified SPRINT-090's Plan
by 41 lines, so 089 and 090 genuinely closed together. The three attributions were read from the
member rows' own contribution text (088 states "§ Closed-when 2 complete", 089 states "Contributed
§ Closed-when 3 and 4"), not assigned by judgement.

**Class (a) encodes the template's rule, not an invented one.** `EPIC.md.template` states the Status
cell as `closed · `<close_commit>``. That was checked before the rule was written — inventing a
checker to make a criterion look mechanical is the failure, not the fix.

**Discrimination proof — the suite was NOT trusted for going green on its first run (L-184).** One
hash convention throughout, stated once and used for every figure: **`git hash-object <path>`** on the
working-tree blob (L-169). Pristine `108a035b63ea32322a8a0f71e7313d4e6ea06ea3`, 264 lines, 4
`bad "epic-state` calls. Four seeds, each verified landed by `cmp`, still parsing under `sh -n`, and
targeted (line count identical, assertion count identical):

| Seed | Reddened | Siblings still green |
|---|---|---|
| `if [ -z "$cell" ]` → `false && …` | `a-no-member-row` | 11/12, **including its own-class sibling** `a-no-close-commit` |
| `elif ! printf …` → `elif false && …` | `a-no-close-commit` | 11/12 |
| `if [ -n "$newest" ]` → `false && …` | `b-stale-header` | 11/12 |
| awk `flush()` guard → `if (0 && …)` | `c-unattributed-tick` | 11/12 |

Restored and re-verified at `108a035b63ea32322a8a0f71e7313d4e6ea06ea3` — identical, so no seed
residue shipped (L-137's timeout case).

**Two failures inside the proof itself, both caught by the proof's own guards rather than by
re-reading — recorded because they are the instructive part.** (i) One seed's `sed` expression was
malformed and never applied; `cmp` reported **SEED DID NOT LAND** and aborted. Without that check the
suite would have reported green, which is indistinguishable from a suite that discriminates. (ii) The
first class-(c) seed inverted `[ -n "$u" ] || continue` to `&& continue`, which let **empty** input
fall through to `bad` — injecting a *new false positive* rather than disabling a finding. It reddened
**three** cases including two controls. Line count and assertion count both passed; the break was
semantic, so only the *sibling-stays-green* requirement caught it. That requirement is not ceremony:
it is the only one of the four targeting checks that fired here (L-142).

**Wiring (L-020) — already connected, and the widening inherits it.** `run-epic-archive-fixtures.sh`
is in `eval_harnesses_always` and leg 2b already delegates to this checker, so the new direction runs
on every bare gate. Renamed the leg `epic retention + rollup currency`, because a leg whose label
under-describes it is a capability nobody finds. `lean-doc-generator/SKILL.md` gained the promote
checklist line and a close-side clause — **consumer-safe, naming the property and never this repo's
script path** (L-015). That file is now **134/140**, leaving 6 lines for T2; per **D2** any overflow
goes to `references/`, never a raised cap.

**Fixtures: 12 cases, 7 pre-existing + 5 new, all retained (TD-012).** One retained control
(`live-open`) needed an attribution added to stay a coherent epic under class (c). Its discriminating
property — *status active, 1 of 2 conditions open → exit 0* — is untouched, and its checkbox count is
unchanged at 2, so this is a compatibility edit and not a weakened control.

**Layers grew at execution and was declared, not left implicit (L-100):**
`docs/epic/EPIC-015-execution-autonomy.md` (the repair the owner ruled) and
`evals/fixtures/epic-archive/live-open/` (the compatibility edit). EPIC-015 moved out of `Cites:` in
the same edit — its "read, never modified" parenthetical had become false, and a token in both lists
is its own named FAIL.

**Not ticked: the outside reviewer.** Owner authorised worktree-isolated dispatch for the three Tier G
tasks; T1's reviewer runs next. Isolation is not optional — adversarial verification *writes*, so a
non-isolated reviewer plus any `git add -A` ships a corrupted guard inside an unrelated commit (L-168).

---

### 2026-09-01 | review | T1 independent pass — 3 HIGH, 3 MEDIUM, 1 LOW; 5 fixed, 2 filed

`review · T1 · worktree-isolated · behaviour:material · governance:high` — supersedes the
`consequence` line above as the record of what happened (night-run.md Part 4).

**The pass found what the author could not, again — L-165's fifth sighting.** Not one of the seven was
caught by the author, whose own seeded-break proof had run clean minutes earlier.

**The through-line is the finding, not the seven items.** Each class's *detection* logic was sound;
the *set of members* those classes were applied to was derived three inconsistent ways — which row is
selected, which sprints count as closed, which paths are searched — and **not one of the twelve
fixtures varied that set**. The fixtures discriminated the branches; nothing discriminated
reachability. That is L-166's own lesson arriving one level up: a guard can be pointed at its real
motivating artifact and still be unreachable for every *other* artifact of the same kind.

**HIGH-1 — live in the repository, and the author's PASS was right for the wrong reason.**
`member_status_cell` matched `SPRINT-<want>` against the **whole row**, so the first row whose
*contribution prose* merely mentioned that sprint won and its Status cell was returned. On EPIC-014,
SPRINT-091's row mentions SPRINT-092, so member 092 was validated against 091's cell and `d43a7a1` was
never read. A missing row or missing sha on 092 would have gone undetected. The author's comment on
that very function cites L-108 and fixed reading the wrong *column* while introducing the wrong
*row*. Fixed by selecting on the row's own id cell (`c[2]`) with a trailing non-digit guard, which
also closes the prefix bug where `SPRINT-0*91` matched `SPRINT-910`.

**HIGH-2 — two contradictory definitions of "closed member" in one file.** `_members_scan` (retention)
treats presence under `archive/` as closed; the new `closed_members` additionally demanded
`status: closed`, while its comment claimed the two matched. A sprint archived without its frontmatter
flipped was therefore closed for one half of the file and open for the other, and its drift went
**vacuously green**. Fixed by adopting `_members_scan`'s definition exactly.

**HIGH-3 — a one-line seed left all twelve fixtures green.** Every fixture put its member under
`archive/`; nothing exercised the live-path half of the glob, though **SPRINT-093 is exactly that
shape in this repo**. Deleting that half passed the whole suite while a real drift went silent.

**MEDIUM-4** class (c) accepted any `SPRINT-N` token, including a non-member that closed nothing, and
a trailing prose paragraph immunised the section's last tick. **MEDIUM-6** class (a) checked a sha's
*shape* and never its *agreement* with the sprint's own `close_commit` — so a row copying its
neighbour's sha passes clean, which is the likeliest real instance and is traceable to the **wrong**
place, worse than untraceable. Both fixed; the agreement fact was in a file the checker already opens.

**Held up under the pass, recorded so it is not re-litigated:** the heredoc/subshell discipline is
sound (each class exercised alone, `fail=1` survives every loop); the EPIC-015 repair is correct (all
four `close_commit`s match their sprint's frontmatter, `cc46d18`'s double use verified legitimate);
consumer safety clean; and the author's pristine hash, line and assertion counts all reproduced.

**Filed, not fixed — both pre-existing in helpers T1 never declared:** **TD-130** (`- [X]` and indented
checkboxes are invisible to `open_conditions`/`total_conditions`, so an epic can be archived with a
genuinely open condition) and **TD-131** (`fmv` returns empty on CRLF and works here only because this
host's gawk build strips CR; on a Linux runner direction (c) would skip every epic and **print
nothing**, indistinguishable from "no active epics" — L-058's shape, and TD-113/L-182's class).

**Re-proof after the fixes.** Five new reachability fixtures (cases 13–17) vary the member set:
sibling-prose row selection · live-path member · archived-but-not-flipped · wrong sha · non-member
attribution. Suite now **17 cases, all green**. One hash convention throughout — `git hash-object` on
the working-tree blob — pristine `75c8ff9e3e9a74f9c999d90ca96edee6a28ccaa1`, 312 lines, 5
`bad "epic-state` calls. **Every reviewer-derived defect was re-seeded and each reddens exactly its
own case with 16/17 green**: unanchored row → `r-row-by-prose` · demand-status → `r-archived-not-flipped`
· drop-live-glob → `r-live-path` · any-sprint-token → `r-nonmember-attrib` · skip-sha-compare →
`r-wrong-sha` · neutered header compare → `b-stale-header`. Restored and re-verified identical.

**Two seeds in this battery aborted as SEED DID NOT LAND** (malformed `sed` against awk regex
metacharacters) and were redone. That guard has now fired three times in one task, each time on a
patch that never applied — without it the suite reports green, which is indistinguishable from a
suite that discriminates (L-137).

---

### 2026-09-03 | surprise | T1's commit ticked T2's and T3's DoD — two false greens in the frozen Plan

**What was found.** `6a6aeac` ("T1: widen the epic checker … 5 of 6 DoD") flipped **three** DoD lines
from `[ ]` to `[x]`, not one. All three begin with the identical bold lead
`**Seeded-break discrimination proof**` — T1's at line 79, **T2's at 118 and T3's at 147**. Only T1's
was earned; T2 and T3 have never been started, and neither commit since touches their `Layers:`.
Derived from history, not from reading the file: `git log -S` on T2's line text returns `6a6aeac`,
whose own diff shows all three flips in one hunk.

**Why it matters more than the two characters.** The wrongly-ticked criterion is the *discrimination
proof* — the one DoD in a Tier G task that exists to prove the guard is not vacuous (D4). A false
green there is the exact failure the bar was written to prevent, and it would have been read at close
as a proof that ran. `/prime` counted 12 open DoD this session; the true figure is **14**.

**Class.** CLAUDE.md § Anti-Patterns edit-safety **(b)** — a structure-adjacent edit trusted without
re-reading the whole structure. A replace-all over a repeated bold lead matched three siblings where
one was intended, and every downstream signal stayed clean: line caps unchanged, no grep tripped, the
commit's own body correctly said "5 of 6 DoD" while the file said 5 of 6 **plus two of someone
else's**. The message and the artifact disagreed and nothing compared them.

**Corrected** by unticking 118 and 147 — restoring the Plan as frozen, not amending it, so no
`scope-change` is owed. The whole DoD structure was re-read after the edit (L-009), not the two lines:
T1 6/6 · T2 0/6 · T3 0/5 · T4 0/3 · Owner-action 2/3.

**Follow-up for the close Retro:** nothing mechanical compares a commit's claimed DoD delta against
the ticks it actually made, which is why this survived a worktree-isolated review pass of T1 an hour
later — that reviewer read T1's script, which is where it was told to look. Candidate `L-NNN` /
`TASK-NNN` at close; the id is derived there, never guessed here (L-143 · L-170).

---

### 2026-09-03 | progress | T4 — 29 `worktree-agent-*` branches pruned, 3 of 3 DoD

**Derived here, never inherited (the task's own A4 requirement).** 29 branches enumerated via
`git for-each-ref refs/heads/worktree-agent-*`. Each tested individually with
`git merge-base --is-ancestor <branch> main` **before** its delete, per the DoD's stated Verify
method: **29 of 29 ancestors, 0 non-ancestors**. Cross-checked against an independent query,
`git branch --merged main --list 'worktree-agent-*'`, which returns the same **29** — a second query
that must agree, run before acting rather than after a surprise (CLAUDE.md § Behavioral Guidelines).
The 18 SPRINT-092 verified and the 11 it never checked are therefore both covered, and the inherited
figure is now a measured one.

**Deleted** with `git branch -d` (the ancestry-checking form, never `-D`) — 29 deleted, 0 failed,
`git branch --list 'worktree-agent-*'` now returns **0**. Nothing to report under DoD 2: the
non-ancestor list is empty, so no branch was kept.

**DoD 3 holds.** `git status --porcelain` after the prune shows only this sprint's own record files,
modified by the coordinator before T4 ran; the ref operations produced no tracked file change.
`git worktree list` showed a single worktree (the main checkout) throughout, so no branch was pruned
out from under a live worktree — the failure mode that would have made this task not-refs-only.

---

### 2026-09-03 | surprise | the dispatch preflight HALTed on a cycle that does not exist — and its PASSes were phantom too

**Context.** Step 3 of `sprint-bulk` requires the pre-dispatch preflight before a wave. Extracted the
runnable snippet from `orchestrator/references/dispatch.md` § Dispatch preflight and ran it **bare**,
never piped into a formatter inside an `&&` chain (its own header warns why — L-057). Against
`SPRINT-094` at base `9e3a395`:

```
PASS base-ref: declared base matches live HEAD (9e3a395…)
FAIL cycle-detected: tasks unresolved -> T2 T3
PASS shared-file-owned: scripts/lib/check-epic-archive.sh ~ scripts/lib/ in T1,T2 order=T1->T2
PASS shared-file-owned: scripts/qa-check.sh in T1,T2 order=T1->T2
PASS shared-file-owned: skills/lean-doc-generator/SKILL.md in T1,T2 order=T1->T2
PREFLIGHT: HALT
```

**A FAIL halts the wave with its named finding — so the finding was investigated, not overridden on a
hunch.** All four tasks in this Plan declare `Depends-on: none`. There is no cycle to detect.

**Diagnosed two independent ways, before acting on either** (a query whose result is acted on
immediately gets a second query that must agree). **(i) Reading the code:** the `Depends-on:` arm is
`grep -oE 'T[0-9]+'` over the *whole line*, unanchored, unscoped, with nothing testing for the literal
`none`. **(ii) Running the parser** over the four real fields: `T1 -> []` · `T2 -> [T1,T2,T1,T2]` ·
`T3 -> [T1,T2]` · `T4 -> []`. T2's field reads `none — but see **D1** (T1 and T2 share …) and **D2**
(T1 and T2 share …)`, so T2 harvests **itself** out of its own explanatory prose. A self-edge is
unresolvable by any topological sort, and T3 inherits the unresolvable T2. Hence "T2 T3".

**The dangerous half is the three PASSes, not the FAIL.** They were derived from the same phantom
edges. Re-ran against a copy with only the prose stripped to bare `none` and every `Layers:` untouched:

```
PASS wave-computation: T1=0 T2=0 T3=0 T4=0
FAIL shared-file-unowned: scripts/lib/check-epic-archive.sh ~ scripts/lib/ in T1 and T2 …
FAIL shared-file-unowned: scripts/qa-check.sh in T1 and T2 …
FAIL shared-file-unowned: skills/lean-doc-generator/SKILL.md in T1 and T2 …
```

So on the true graph the ownership check FAILs three times. The tool reported *owned* because it
invented the edge that made it owned — **L-108 verbatim: a false positive on a substring is a false
negative on the contract.** Shared-file ownership is the check standing between a parallel wave and
L-042's cross-task staging contamination, and it can be silently satisfied by prose.

**A second defect the same run exposed:** the real ordering constraint for those three files is
pre-locked in this sprint's `## Decisions` (**D1**, **D2**) — which the preflight never reads. Fixing
the parser alone converts the false PASS into a false FAIL. Both halves want ruling together.

**Filed as `TD-132`** (`high`; id derived from the ledger with `.claude/worktrees/` excluded, two
agreeing queries, max in use `TD-131` — L-143 · L-170). Not fixed here: `dispatch.md` is outside every
SPRINT-094 task's `Layers:` and is a Tier G consumer-facing guard, so ADR-029's full bar plus an
outside reviewer applies — that is a task, not a patch.

**The wave was dispatched anyway, on a hand-derived graph, and the override is recorded rather than
hidden.** `Layers:` intersected directly: **T2 ∩ T3 = ∅** (T2 is skills/ + scripts/ + evals/fixtures/;
T3 is test/architecture/ + test/fixtures/). T4 is refs-only and complete. T1 committed at `4ae0827`,
so **D1's T1→T2 order is already satisfied** and the three contended files are no longer contended —
which is why the true-graph FAILs above are stale rather than live. The HALT was overridden on
evidence that contradicts it, not waved through.

---

### 2026-09-03 | progress | T2 and T3 dispatched in parallel, worktree-isolated

Wave 1 of 1: both `Depends-on: none`, both disjoint, one `Agent(isolation:"worktree")` each in a single
message, per D4's requirement that every Tier G task be built and then reviewed under isolation
(L-165 · L-168 — adversarial verification *writes*, so a non-isolated reviewer plus any `git add -A`
ships a corrupted guard inside an unrelated commit).

Each agent was handed its **procedure skill** (`/tdd`) rather than a re-described brief, plus the Tier G
bar in full (L-166 real motivating artifact · L-058 one must-FAIL per check with its named finding ·
L-137/L-142 seeded-break proof with landed/parses/targeted/sibling-green guards · L-169 one stated hash
convention, called out because this is a CRLF checkout · L-120 read the printed verdict). T2 was also
handed the owner's G2 ruling on the handoff-stub placement, marked *implement, do not re-decide*.

**The sprint file and this Log are coordinator-owned** — both agents were told not to touch either and
to return their Log entry as text in their report, because SPRINT-063 produced two copies of one Log
when that was left implicit.

---

### 2026-09-03 | progress | T3 — unwired-exports fitness rule built and merged, DoD held pending review

Detector at `test/architecture/unwired-exports.ts` (263 lines) + `unwired-exports.test.ts` (22 tests),
beside `dependency-direction.test.ts` and matching its idiom. A caller is a resolved ES import
**edge** (importer + specifier to defining file + name) read off a comment/string-stripped skeleton
(reusing `layers.ts`'s `scan()`) — never a grep for the bare identifier. Narrowed on evidence per A3:
covers a symbol reached by a literal import, not a registry-string lookup, because A3 re-derived every
real motivating artifact as import-reachable.

**DoD 2 (L-166) as reported by the builder** — five real symbols, not fixtures alone:
`reconcile` / `marksInStandard` (TD-103) reported unwired in the **current tree** (A3's strong form);
`attachLevel` at `e158d60` (parent of T11's `6f4cc36`); `createF4Registry` / `createS4AppendRegistry`
at `e0ccdb6` (parent of T12's `e5d59ce`); each green in the current tree as its own control. Historical
reads batched through one `git cat-file --batch` after a per-file `git show` first cut spawned 71
subprocesses and blew `bunfig.toml`'s 5 s budget at 11 s.

`marksInStandard`'s self-reference (4 mentions in its own file, 3 in comments) does not fool it:
comments are stripped before either regex runs, so a mention cannot reach the import matcher;
a self-import edge is excluded defensively on top. Fixture `test/fixtures/unwired-exports/self-reference/`
retained (TD-012), shaped on the real file.

**Discrimination proof, ONE hash convention** (`git hash-object <path>` on the working-tree blob,
cross-checked equal to the staged blob): pristine `d542f3ef1ee46a16598e3543380f6ddeabb45945`, 263
lines, 11 `continue;` guards. Four seeds, each landed (`cmp`), parsing (`tsc --noEmit` clean), targeted
(line/guard counts unchanged). Reported honestly rather than smoothed: **seed B (test-importer
exclusion) reddened 5 cases, not the 1 predicted** — every DoD-2 real-artifact assertion depends on it,
because all five symbols also have real test callers. That is recorded as found.

**Coordinator re-verification before merge** — the builder's figures were re-derived in its worktree,
not taken from its report: `git hash-object` returned `d542f3ef…`, `wc -l` 263, `grep -c` on the guard
clause 11, all three matching. Suite re-run as its own call (L-120): `bun test test/architecture/` gave
**`47 pass, 0 fail, 79 expect() calls`**. Merged at `ea7a8b9`.

**A process defect worth recording.** This agent's first exit produced no report at all — its closing
line announced it would wait for a notification, with 512 insertions **staged but uncommitted** in its
worktree. The work was intact; only the reporting channel failed. Recovered by inspecting the worktree
directly rather than trusting the reply channel (L-060 — a command's self-report is evidence about the
reporter, never about the artifact) and resuming the agent to commit and report. Had the reply been
read as the outcome, a complete task would have been recorded as a failure.

`consequence · T3 · behaviour:material · governance:high`

---

### 2026-09-03 | progress | T2 — handoff status tracked + §12(b)'s conversion wired, merged, DoD held pending review

**The status half:** a handoff carries `live` / `consumed` / `spent` via a two-field
(`handoff-status:` / `handoff-path:`) entry inside a `### <date> | handoff | <summary>` block — the
Execution Log where a sprint exists, root `HANDOFF-LEDGER.md` (create-lazily) otherwise, both parsed by
**one shared function** (L-108, position-anchored). Where the same `handoff-path` recurs, the latest
entry wins. An **UNKNOWN status** (field missing, malformed, or its path missing) is unconditionally
FAILed in every context, **never** assumed `spent` — implementing the owner's G2 ruling as recorded at
promote, both halves, with the circular headless-park answer not inherited.

**The conversion half:** a sprint may not close over a `live` / `consumed` handoff —
`check-handoff-state.sh` FAILs it with its named finding. Full reconciliation protocol goes to
`skills/lean-doc-generator/references/handoff-reconciliation.md`, pointed to from a 4-line addition to
`SKILL.md` plus a new promote-governance checklist line.

**11 fixtures, one harness, all green**, DoD 3's pair covered directly (`closed-live-outstanding` FAILs
named; `closed-all-spent` passes in the same run), plus `closed-live-path-not-archived` — a
reachability case mirroring T1 review's HIGH-3, reproduced pre-emptively rather than left for a
reviewer to find.

**Discrimination proof, ONE hash convention** (`git hash-object <path>`): pristine
`724ca9cfa8b80fa47626185af38d34e56eb6d48e`, 152 lines, 3 assertion call sites. Four seeds, each landed
(`cmp`), parsing (`sh -n`), targeted: sprint-context UNKNOWN gate gave 3 red / 8 green ·
closed+non-spent gate 3 red / 8 green · ledger UNKNOWN gate 1 red / 10 green · `resolve_latest` broken
from latest-wins to first-wins reddened the 3 multi-entry cases with 8 single-entry siblings green.
Restored and re-verified identical after each.

**L-166, and the builder's own caveat, carried forward rather than smoothed.** No historical commit
carries the `handoff-status:` vocabulary — it is new — so no unmodified blob could be replayed the way
T1 replayed `d43a7a1`. The closest faithful case is real:
`docs/sprint/archive/SPRINT-027-watchdog-housekeeping.md`'s Execution Log records a genuine 54-line
handoff doc produced in OS temp on 2026-07-29, the **same day** that sprint closed
(`close_commit: 36721a4`), with zero repo-side trace of its fate. Fixture `sprint027-real-gap` carries
the real id, dates and commit forward with the field genuinely absent. **Whether that meets L-166's bar
or is a fixture wearing a real artifact's name is a judgment call, and it was put to the outside
reviewer explicitly rather than settled by the builder.**

**Coordinator re-verification before merge:** `git hash-object` gave `724ca9c…`, 152 lines, 3 assertion
sites, `sh -n` parses — all matching. `lean-doc-generator/SKILL.md` lands at **138** lines, inside
ADR-006's ~140 cap and inside D2's 6-line budget (4 used), so **the cap was not raised to fit content**.
`HANDOFF-LEDGER.md` is correctly **absent** from the tree — create-lazily by contract, and a
pre-created empty one would itself have been the STANDARD §7 violation. Harness re-run as its own call
(L-120): **`HANDOFF-STATE FIXTURES: all green`**, 11 of 11, each matching its own named finding.
Merged at `324b489`.

**Two items NOT accepted on the builder's report.** (i) It reports a full gate at `QA-CHECK: 205 pass,
3 fail` and classifies all three as pre-existing or environmental. That classification is not taken on
trust — **system-verify runs once on the integrated tree**, which is the designed moment for it
(sprint-bulk step 6). Note also that T3's agent measured `tsc --noEmit` **clean** in its worktree while
T2's reports `typecheck` failing on a missing `tsc`: when a check differs between two contexts, diff
the environments before the code (L-067). (ii) `HANDOFF-LEDGER.md` is a **new root-level convention not
registered in `spec/STANDARD.md` §2**. Editing that spec sat outside T2's `Layers:`, so the builder
documented the convention inline in the shipping skills and flagged it — the correct call. It needs an
owner ruling, not a quiet adoption, and is carried to § Owner-action rather than absorbed.

**Layers grew at execution, declared (L-100):** `evals/run-handoff-state-fixtures.sh` and
`skills/lean-doc-generator/references/handoff-reconciliation.md`.

`consequence · T2 · behaviour:material · governance:high`

---

### 2026-09-03 | progress | outside reviewers dispatched for T2 and T3; no DoD ticked yet

**Nothing in T2 or T3 is ticked at this point, deliberately.** Both reviewers are re-deriving the exact
criteria a tick would assert — T3's DoD 2 commit selection and its reachability family, T2's
check-to-fixture coverage, its UNKNOWN-in-every-context claim, and the L-166 judgment call. **Ticking a
criterion whose verification is still in flight is the false-green shape this session opened by
catching**, and T1's own history is the argument: it committed 5 of 6 DoD ticked, and its independent
pass then found 3 HIGH / 3 MEDIUM / 1 LOW **inside the ticked items**, none caught by the author whose
seeded-break proof had run clean minutes earlier (L-165's fifth sighting).

Both dispatched worktree-isolated (L-168), each briefed with T1's review through-line as its aiming
point — the detection logic was sound, the SET it was applied to was derived three inconsistent ways,
and no fixture varied that set — on the standing assumption that the same shape is present until
disproved. Each was told to mark findings CONFIRMED or PLAUSIBLE and not to inflate, and to report what
**held up**, since a review listing only defects says nothing about coverage.

---

### 2026-09-04 | progress | both reviews landed; 17 of 20 DoD; run ends at AUTHORITY_BOUNDARY + BUDGET_STOP

**Both outside reviewers found defects the authors did not — L-165's sixth and seventh sightings.**
T3's pass: 1 HIGH, 2 MEDIUM, 1 LOW. T2's pass: 1 HIGH, 1 MEDIUM/HIGH, 2 MEDIUM, 1 LOW. In both cases
the author's own seeded-break proof had run clean, and in both cases the through-line was the one T1's
review named a day earlier: *the detection logic was sound; the SET it was applied to was not.*

**T3's HIGH, fixed.** `EXPORT_RE` matched only `export function|const|class NAME`, so a symbol exported
as `export { name }` or `export default class X {}` never entered `symbolsExamined` **at all** — no
finding and no signal anything was skipped. That contradicted DoD 1's *"**Any** exported … symbol … is
reported"* as written, and A3's narrowing was about registry-string reachability, not ES syntax. Fixed
rather than reinterpreted (L-088). `export * from` stays uncovered with the reason recorded **in the
file**: a wildcard re-export declares no symbol of its own, the names are examined at their origin, and
a test asserts it does not swallow a sibling export. Narrowing on evidence with disclosure, which the
Plan permits.

**T3's MEDIUM, fixed.** `readSourcesFromDisk` skipped any directory named `fixtures`;
`readSourcesAtCommit` did not — the two readers returned different file sets for the same tree, T1
HIGH-2's exact shape one level down. Exclusion removed (dead weight inherited from `layers.ts`), plus a
new test that builds a real throwaway commit and asserts both readers agree.

**T3's build re-verified by the coordinator, since its author was killed mid-verification by a session
rate limit and the work sat uncommitted.** Recovered from the worktree, not from the reply channel
(L-060). `git hash-object` = `29750aa1b26a91596c92d3bed7f59a0ec0dd398e`, 340 lines (was 263), 15 guards
(was 11); `bun test test/architecture/` run as its own call printed **64 pass, 0 fail** (was 47).
Committed at `7679353`, merged at `e19d25d`.

**T2's HIGH is not fixable and was ruled, not absorbed.** The checker cannot see `SPRINT-027` — the real
artifact its own commit cites under L-166 — because it requires a paired `archive/logs/` file and that
sprint has none. Counted: **91** archived sprints, **45** paired logs. The `sprint027-real-gap` fixture
is faithful on vocabulary but **invents** a log that never existed. **Owner ruled: accept as
forward-looking by design** — the vocabulary is new, so no pre-existing sprint can ever carry it →
**TD-134**, with the rejected alternative recorded so it is not re-litigated.

**T2's two DoD-breaking findings are NOT fixed — its retry died on the same rate limit before writing
anything**, and its worktree is clean. Both stay open and named: **(a)** DoD 3 — a POSIX IFS
field-collapse in two `read` loops prints the finding's fields **swapped** (`live` in the path slot,
`<missing>` in the status slot), so the fixture fails with the wrong named finding; none of the 11
fixtures caught it because the harness substring-matches the *phrase*, never the values — L-108 applied
to the test's own assertion. **(b)** DoD 5 — `sprint-log.md.template:33` still carries
`scripts/lib/check-handoff-state.sh`, a repo path in one of the 33 templates every consumer receives,
directly contradicting that commit's own consumer-safety claim.

**T3's DoD 4 also stays open.** Its retry ran four seeds and restored to a hash I confirmed, but *which
case reddened and which sibling stayed green* died with the agent. The new guards therefore have a
passing suite and no discrimination proof — and a suite green on its first run has not been shown to
discriminate (L-137). Ticking it on a restore hash alone would be the false-green shape this session
opened by catching.

**Owner-ruled and done:** `HANDOFF-LEDGER.md` registered in STANDARD §2 with its full lifecycle
contract, `spec/` **0.10.0 → 0.11.0** (`f717e9a`). MINOR proven rather than argued: `S2.F-FILE` fires
only on rows marked `always` (`conformance-engine.sh:1821` names the marker in its own finding text),
and `read-spec-rules.sh` over 0.11.0 emits **100 rows byte-identical by `cmp`** to the frozen surface —
no rule added, amended or reclassified, so no verdict can move.

**System-verify did NOT produce a usable verdict, and that is a finding rather than a gap.** Two full
`bun test` runs over the same unchanged tree **disagreed** — `496 pass, 1 fail` then `497 pass, 0 fail`
— with no test code changed between them → **TD-135**. The failing test's identity was lost because run
1 was piped through `tail -40` and the tail was flooded by git CRLF warnings. That run also **exited 0
while a test was failing**, because a pipeline's status is its last command's: L-120/L-057 demonstrated
live, in the coordinator's own hands, minutes after quoting the rule. No single full-suite run is
sufficient evidence for this close.

**Filed this session:** `TD-132` (the dispatch preflight parses prose as dependencies — invents a cycle
*and* issues ownership PASSes off the phantom edges) · `TD-133` · `TD-134` · `TD-135` · `TD-136` (ADR-034's
frozen rule-surface snapshot has zero executable readers — L-172's class in fixture form, this sprint's
theme landing on the sprint) · `TD-131` extended with its second call site.

**Terminal state: `AUTHORITY_BOUNDARY`** (T2's two fixes need a builder and the session model limit is
reached) **compounded by `BUDGET_STOP`** (the rate limit resets 04:10 Asia/Jakarta). **17 of 20 DoD
ticked.** Open: T2 DoD 3 · T2 DoD 5 · T3 DoD 4 — each with a named, reproduced cause and a written fix.
**The sprint is NOT closeable**: three DoD open, and system-verify has no trustworthy verdict while
TD-135 stands.

### 2026-09-04 | progress | T2 and T3 — the three held-open DoD closed on evidence

`consequence · T2 · behaviour:material · governance:high` — Tier G: the checker's own finding text is
the thing a reviewer acts on, and it was wrong.
`consequence · T3 · behaviour:none · governance:high` — Tier G evidence only; no artifact changed
(`test/architecture/unwired-exports.ts` ends this entry at the same `git hash-object` it started at,
`29750aa1b26a91596c92d3bed7f59a0ec0dd398e`).

**Hash convention for this entire entry, stated once and not mixed (L-169):** every hash is
`git hash-object <path>`, which hashes the blob git would store and so reproduces on a CRLF checkout.
Every content comparison is `diff --strip-trailing-cr`. No raw working-file hash appears below. The
second half of that convention turned out to be load-bearing — see the false seed under T3.

**T2 DoD 3 — root cause, and why 11 green fixtures never saw it.** `IFS='<tab>' read -r ln path status`
in *both* read loops. TAB is IFS **whitespace** in POSIX, so a record with an empty path (`9\t\tlive`)
has its `\t\t` collapsed to a single delimiter and every later field shifts one slot left: the finding
printed `(live) … UNKNOWN status ('<missing>')` where the truth was `(<no handoff-path recorded>) …
UNKNOWN status ('live')`. Right verdict, wrong named finding — the one thing a must-FAIL fixture exists
to rule out (L-058). The fixtures could not see it because they matched the *phrase*
(`"carries UNKNOWN status"`) and never the *values*: L-108's shape-not-substring rule applied to the
test's own assertion rather than to the checker's regex.

Fixed by dropping IFS field-splitting entirely — one `split_rec` helper both loops share, splitting by
explicit parameter expansion so an empty field stays empty. Chosen at G2 over switching to a
non-whitespace delimiter (`\037`): both work, but the delimiter fix is correct only by way of a POSIX
rule the reader has to already know, and this is guard code.

**The harness now pins values, and one fixture was missing.** All 11 assertions carry the finding's
actual field values. A 12th fixture, `ledger-unknown-missing-path`, was added: the sprint-side loop and
the ledger loop are *separate* `read` loops over the same record shape, every existing ledger fixture
happened to carry a path, so the ledger's empty-path branch was unexercised — L-166's "the branch
works, but is it reachable" one level down. It carries `consumed`, not `live`, so its finding cannot be
satisfied by the sprint-side case.

**Discrimination proof, two seeds.** (1) The **real defect** restored verbatim (`724ca9cf…`, `cmp`
identical to pristine, `sh -n` parses): **exactly the 2 empty-path cases redden, 10 sibling controls
stay green** — and both redden as *"exit matched but finding missing"*, i.e. the verdict was right and
only the named finding wrong, which is precisely the defect class. (2) A **one-line targeted** seed
(loop 1 alone loses its empty-path display default; 170 → 170 lines, 1 line replaced, parses):
**exactly 1 case reddens, and its loop-2 sibling stays green** — direct evidence that the new 12th
fixture guards a branch the other 11 never reached. Restored to
`d9f17070d74fe7c60fafb8400bc8ac9a0d09b883` == pre-seed, `cmp` byte-identical, suite green.

**T2 DoD 5 — the leak, and the consumer trace.** `sprint-log.md.template:33` carried
`checked by scripts/lib/check-handoff-state.sh` — a path that resolves in *this* repo and in no
consumer's, inside one of the 33 templates every consumer receives (introduced by this task's own
`8caefca`, so it is this task's mess to clean). Replaced with the reason the entry exists, which is
what a consumer actually needs. The sweep now reports **zero** `scripts/` or `evals/` references across
all 35 templates, and zero in `handoff/SKILL.md`, `prime/SKILL.md` and `handoff-reconciliation.md`.

Consumer path traced end-to-end rather than inferred from our dogfooding (L-015 · L-016), and it needs
no script at all: **write** — `handoff/SKILL.md` steps 1–3 inline the two-field shape and route it to
the sprint's Execution Log, or to root `HANDOFF-LEDGER.md` when no sprint pointer exists · **read** —
`prime/SKILL.md` § Handoff status reports the latest entry, read-only · **reconcile** —
`lean-doc-generator` close sweeps every entry not `spent`, routes each item to a durable home and
appends a `spent` entry. `check-handoff-state.sh` is lean-flow's own gate leg over that vocabulary,
never the mechanism — which is exactly why the template must not name it.

**Out of scope, mentioned not touched:** nine `scripts/…` references remain under
`skills/orchestrator/` (`SKILL.md` · `dispatch.md` · `night-run.md` · `review-scoping.md`). All four
files predate `plan_commit` and sit outside T2's `Layers:`.

**T3 DoD 4 — three seeds, each targeted, each restored.** No artifact changed; this DoD was always an
evidence debt. Against `test/architecture/unwired-exports.ts` (`29750aa1…`, 340 lines, 39 tests green):

| Seed (one line each) | Red | Green | What it discriminates |
|---|---|---|---|
| S1 — `.fake.ts` dropped from `TEST_SUFFIXES` | 2 | 37 | both test-adjacency cases, nothing else |
| S2 — `EXPORT_DEFAULT_RE` stops matching `export default` | 3 | 36 | the 3 default-export cases; the *arbitrary-local-name* CONTROL stays green |
| S3 — self-import edge no longer excluded | 1 | 38 | only the self-import must-FAIL |

Each: landed, targeted (340 → 340 lines, one line replaced), `bun build` parses, restored to
`29750aa1b26a91596c92d3bed7f59a0ec0dd398e` == pristine.

**S2 first ran as a FALSE SEED, and catching it is why the seed guard changed.** The substitution
silently did nothing — `awk -v` expands backslash escapes, so the `\t` in the pattern became a real tab
and never matched the file's two-character `\t`. `cmp` still reported a difference, because the local
`awk`/`sed` rewrite this CRLF working tree to LF, and the suite scored **39 pass / 0 fail** — a seed
that reddened nothing, presented as a discriminating run. That is L-142's failure verbatim (*"`cmp` saw
a change"*), and it establishes that **`cmp` alone is not a landing guard on a CRLF checkout**. Landing
is now asserted on `diff --strip-trailing-cr` requiring at least one changed content line, the pattern
is passed through `ENVIRON` to defeat escape expansion, and a landed-but-targeted seed that reddens
*nothing* is reported as untested rather than scored as a pass. The same rewrite earlier made a
targeting figure read "680 changed lines" for a one-line edit — a number carrying no information, which
is L-169's point about an unstated method, hit twice inside one task.

**`Layers:` corrected at execution (L-100), not defended.** T2 gained
`evals/run-handoff-state-fixtures.sh` and `skills/lean-doc-generator/references/handoff-reconciliation.md`
— both genuinely T2's work, neither predictable at promote. `check-layers-observed.sh` confirms both
findings cleared.

**Gate:** `sh scripts/qa-check.sh` run as its own call, verdict read off the line the gate itself
prints — **219 pass, 1 fail**. The single FAIL is `layers observed`, and every finding remaining in it
is pre-existing and outside this session's diff: `f717e9a`'s three spec/architecture files and
`fa061bc`/`T1`'s `TECH-DEBT.md` are attributable to no task, and the SPRINT-092 / SPRINT-093 rows are
`TASK-298`'s known sibling-attribution defect — both are closed sprints, so their attribution is
exactly the false positive that task exists to fix. **System-verify is still not a usable verdict while
TD-135 stands**, so nothing here is offered as evidence that the sprint may close.

**T2 DoD 6 is ticked from the previous session's review, but the checker has changed since.** An
outside worktree-isolated reviewer is dispatched over this diff (owner-authorised at G2, against this
session's default of not spawning agents). Its findings, if any, land in the next entry.

**22 of 23 DoD ticked.** The one open box is the owner-action archiving ruling, not a T1–T4 DoD.

### 2026-09-04 | review | outside reviewer confirmed all 5 claims and found 3 silent false negatives; bounded retry applied

`consequence · T2 · behaviour:material · governance:high` — Tier G. Every finding below is a
guard exiting **0** on a real violation, which is the only failure class that matters for a gate.

Hash convention unchanged from the previous entry and not mixed: `git hash-object <path>`, content
compared with `diff --strip-trailing-cr`.

**The review's verdict on what it was asked to check: all five claims CONFIRMED.** `split_rec`
preserves an empty field in every position (attacked with empty path, empty status, both empty,
spaces, a literal backslash, a 400-char path, a trailing tab) · the 15 assertions do catch a
field-swap regression, proven by re-seeding the exact pre-fix defect one loop at a time · the new
ledger fixture does uniquely reach the ledger loop's empty-path branch (sprint-only seed reddens only
the sprint case, ledger-only seed only the ledger case) · no fixture is named after a token its own
assertion greps for · the template leaks nothing and reads standalone.

**And on its own hunt it found three defects none of my own work would have surfaced.** This is
L-165 landing exactly as written: the governing rule was loaded and on screen the whole session, the
suite was green, the discrimination proof was real — and the defects were still there. All three
reproduced independently here before being accepted, and all three are the *same* shape as the
sprint's theme: a guard that cannot see its subject does not go red, it goes quiet.

| # | Input | Was | Root cause |
|---|---|---|---|
| 1 | `### <date> \| handoff \|` with the `[one-line focus]` placeholder left blank | `skip (no handoff records)`, **exit 0** | the block anchor required a trailing space, so the heading fell through to the generic `^### ` rule, which CLOSED the block — the real status/path lines beneath it were never parsed |
| 2 | an entry quoting the stub format in a fenced block above its real fields | `PASS … spent at /tmp/example-format.md`, **exit 0** | field capture is first-occurrence-wins with no fence awareness, so the EXAMPLE was captured and the real `live` record ignored |
| 3 | a literal TAB byte inside a `handoff-path` value | `PASS … spent at /tmp/foo`, **exit 0** | TAB is the record format's own delimiter; an unescaped tab made the emitter print four fields, and `resolve_latest` reads only `$1..$3`, taking the path's tail fragment as the status |

Finding 1 needs nothing adversarial — forgetting to fill in a bracketed placeholder is enough.
Finding 2 is a realistic authoring habit (quoting the format as a reminder). Finding 3 is the
original bug's own root cause — TAB doing double duty as delimiter and field content — surfacing one
function *upstream* of the part that had been fixed.

**Fixed at the root in `handoff_records`, one change per finding:** the anchor now pins `handoff` as
the second pipe-delimited field with no trailing-summary requirement (`^### [^|]*\| *handoff *\|`,
which also stops a summary merely *containing* `| handoff |` from matching) · a fence toggle runs
before every other rule, so an example block is skipped entirely and a `###` inside a fence cannot
close the entry · a shared `clean()` squashes any interior tab to a space, keeping the record intact
and the status truthful rather than letting a path fragment impersonate it.

**Three retained fixtures, one per check (L-058), each named so its own assertion cannot satisfy it
(L-108):** `closed-heading-without-summary` · `closed-quoted-format-block` ·
`closed-delimiter-inside-value`. Each asserts the finding's real VALUES — fixture 2 pins the real
path so a regression that re-reads the example cannot pass, and fixture 3 pins both halves (status
stays `live`, the fragment stays inside the path).

**Discrimination proof, one targeted seed per new guard.** Each landed (`diff --strip-trailing-cr`,
never `cmp` alone), stayed 190 → 190 lines with one line replaced, parsed under `sh -n`, and restored
to `7e0909c2e626cbe383c093ba0740227466fdd889` == pristine:

| Seed | Red | Green |
|---|---|---|
| anchor requires a trailing summary again | 1 — `closed-heading-without-summary` | 14 |
| fence toggle no longer matches backtick fences | 1 — `closed-quoted-format-block` | 14 |
| interior-tab squash removed | 1 — `closed-delimiter-inside-value` | 14 |

15 fixtures, all green, no regression on the 12 that existed before this round.

**This is the one bounded builder retry the revise loop allows** (attended mode, one per pass). The
reviewer is being re-dispatched once over this diff, worktree-isolated. No DoD changed state in this
entry: DoD 3 was already met by the fixtures it names, and these three are additional checks the
review revealed, not repairs to a tick.

### 2026-09-04 | review | re-review broke the fence fix; owner authorised a second pass over budget

`consequence · T2 · behaviour:material · governance:high` — Tier G. The finding that matters below
is a **regression this session introduced**, not an inherited defect.

Hash convention unchanged and not mixed: `git hash-object <path>`, content compared with
`diff --strip-trailing-cr`.

**The re-review confirmed the anchor fix and the tab-squash fix sound, and broke the fence fix — the
one rule written to close a silent false negative had reintroduced the same class.** Three findings,
all reproduced here before being accepted:

1. **CRITICAL, and mine.** The fence toggle was a bare parity flip. A fence opened and never closed
   stayed on to EOF, so `fence { next }` consumed every later handoff entry before it could reach the
   anchor. A closed sprint whose log quotes a format block without closing it, with a **real
   outstanding `live` handoff below**, reported `PASS … spent`, **exit 0** — and the real entry
   appeared *nowhere in the output*. Not misreported: **erased**. Before `9ee8493` an unclosed fence
   swallowed nothing, so this failure mode did not exist until the fix for Finding 2 created it.
2. **HIGH.** `~~~` is CommonMark's other fence and the toggle matched only ` ``` `, so the previous
   round's quoted-stub-format exploit was fully reproducible by swapping the fence character.
3. **MEDIUM.** The anchor repeated a literal space (`[ ]*`) rather than `[ \t]*`, so a heading using
   TABs around the keyword still fell through to the generic `^### ` rule — `skip`, exit 0, on a
   closed sprint with a live handoff. The same class as the previous round's Finding 1, via a
   different malformed heading, and inconsistent with `clean()` tolerating stray tabs everywhere else.

**The revise loop's one bounded retry was already spent, so this went to the owner rather than being
taken unilaterally** — an over-budget second pass is a governance decision, and "the finding is
serious" is exactly the reasoning that would justify never stopping. Owner authorised the extra pass.

**Fixed.** A fence now closes only on its **own** character (a `~~~` line inside a ``` block is
content, not a terminator), both syntaxes are recognised, and — the part that matters —
**an unbalanced fence is no longer silent.** At EOF an open fence emits a pathless record, which
routes into the UNKNOWN branch both loops already have. That is the correct reading rather than a
special case: a region the parser could not read has an *unknown* status, and this checker's founding
rule is that UNKNOWN is never assumed `spent`. The finding names its own cause —
`(<unreadable: a code fence opened here was never closed>) carries UNKNOWN status ('<missing>')` — so
a regression that merely FAILs for some other reason cannot satisfy the fixture. The anchor now reads
`\|[ \t]*handoff[ \t]*\|`.

**Three more retained fixtures, one per check (L-058), none self-named (L-108, checked
programmatically):** `closed-unbalanced-fence` · `closed-tilde-format-block` ·
`closed-heading-tab-padded`. Suite is now **18 fixtures**, and three independent counts agree —
18 directories, 18 `run_case_anywhere` calls, 18 cases executed.

**Discrimination, one targeted seed per new guard.** Each landed on `diff --strip-trailing-cr` (never
`cmp` alone), stayed 205 → 205 lines with one line replaced, parsed under `sh -n`, and restored to
`30b5d0308559f1ae788dcac3497ad07255a0fa1c` == pristine:

| Seed | Red | Green |
|---|---|---|
| unbalanced-fence sentinel disarmed | 1 — `closed-unbalanced-fence` | 17 |
| fence toggle blind to `~~~` again | 1 — `closed-tilde-format-block` | 17 |
| anchor intolerant of tabs again | 1 — `closed-heading-tab-padded` | 17 |

**What this round is actually evidence of.** Two consecutive independent passes each found a
CRITICAL silent false negative in the same 40-line function, and the second one found a defect *the
first fix created*. Neither was reachable from a green suite, a real discrimination proof, or the
governing rules — all three were in hand each time. It is the strongest case yet for L-165's claim
that the author is structurally the wrong person to find these, and a live argument that for a Tier G
guard **one** review pass is a floor rather than a ceiling: the first pass here would have shipped a
guard that erases the violation it exists to catch.

**Gate: `219 pass, 1 fail`**, read off the line the gate prints. SPRINT-094's own findings are
unchanged and both pre-existing — `f717e9a`'s three spec/architecture files and `fa061bc`/`T1`'s
`TECH-DEBT.md`, attributable to no task. Nothing in this diff moved the count.

**And the gate run itself hit L-120, in the same session that has been quoting it.** Backgrounding it
as `sh scripts/qa-check.sh 2>&1 | tail -3` captured three lines, so the verdict line survived but
every FAIL detail was gone, and the harness reported `tail`'s exit code (0) for a run whose gate had
failed. The verdict was still read from the gate's own printed line rather than from the exit code,
which is why nothing was concluded wrongly — but the findings had to be re-derived by running
`check-layers-observed.sh` directly. Piping a gate into `tail` reads as *capturing output*, not as
*discarding the evidence*, which is precisely why the rule keeps not firing.

**One live-tree observation worth carrying to close:** `check-handoff-state.sh .` currently reports
`skip (no handoff records under docs/sprint/ or HANDOFF-LEDGER.md)`. That is expected — no `/handoff`
has been taken since the vocabulary shipped, which is exactly why the `sprint027-real-gap` fixture
exists (L-166: no historical commit carries a `handoff-status:` field, so the real motivating artifact
had to be reconstructed). It does mean the guard has not yet fired on live input, and the first real
`/handoff` after this sprint is what converts it from proven-on-fixtures to proven-in-place.

### 2026-09-04 | review | round 3 broke the fence design; owner ruled it out and the parser was rewritten strict

`consequence · T2 · behaviour:material · governance:high` — Tier G, and the round that stopped
patching. Hash convention unchanged: `git hash-object <path>`; content compared with
`diff --strip-trailing-cr`.

**Round 3 found two more CRITICALs, both in the fence mechanism, both reproduced here first.**

1. **A fence that closes *after* swallowing a record leaves no trace at all.** Round 3's sentinel
   fired only when the fence was still open at EOF. A fence opened in entry A and closed anywhere
   inside entry B left `fence=0` by EOF — sentinel silent — while entry B's heading and both fields
   had already been consumed. Closed sprint, real outstanding `live` handoff: `PASS`, exit 0, entry
   absent from the output. Reproduced on the ledger loop identically.
2. **A CommonMark-correct nested fence defeats character-only tracking.** The standard way to quote a
   fenced example is a 4-backtick fence around a 3-backtick one. Matching the opening *character* but
   not its *run length* closed the outer block on the inner marker, exposed the nested example as the
   real record, then re-opened on the leftover marker and swallowed the real fields. `PASS`, exit 0.

**The reviewer's structural verdict, which the evidence supports: the design was the defect.** Three
rounds each found a fresh hole in the same ~15-line region, and each fix patched the shape just
discovered rather than the state space — bare toggle → character-tracked toggle → EOF-only sentinel,
each one reactive, each one leaving a corner. That is the signature of a single-pass toggle parser
over a grammar that **nests**, and it does not converge by patching.

**Owner ruled: delete the fence mechanism and make the shape strict.** A handoff record is now its
heading plus its two fields, which must be the next non-blank lines. Anything else there — prose, a
fence of any syntax, a nested fence, another heading, EOF — ends the record incomplete, which is
UNKNOWN, which FAILs. **Nothing is skipped, and that is the entire point:** anything a parser skips,
it can be made to skip over a real violation. The state space is now "in a block or not" plus "which
of two fields has been seen", and it matches the shape the shipped template already prescribes.

Both round-3 CRITICALs are structurally impossible against it rather than specifically defended:
case 1 now names the second entry's real path, case 2 reports UNKNOWN instead of the nested example.

**What changed in the reported findings, honestly.** Three earlier fixtures now FAIL with a different
finding: `closed-quoted-format-block`, `closed-tilde-format-block` and (new) `closed-nested-fence-example`
report UNKNOWN rather than naming the real path. The verdict is unchanged — all still exit 1 — but the
checker no longer guesses which of two candidate records an author meant. `closed-unbalanced-fence`
*improved*: it now names the real outstanding path where two previous designs lost it entirely.

**Five retained fixtures added this round, and three of them exist because the seeded-break pass
found their absence — not because anyone noticed:**

| Seed | Red | Green | Found how |
|---|---|---|---|
| intervening content skipped again | 3 | 20 | designed |
| blank-line tolerance removed | 1 | 22 | seed suggested a gap; the REAL seed proved it |
| anchor intolerant of tabs | 1 | 22 | designed |
| repeated-**status** guard removed | 1 | 22 | **seed reddened nothing → gap** |
| repeated-**path** guard removed | 1 | 22 | added alongside its sibling; never seeded blind |

Each seed: landed on `diff --strip-trailing-cr`, 202 → 202 lines with one line replaced, `sh -n`
clean, restored to `2a6c64587a703f8e01d1bf752ad8e3c5d34ea415` == pristine. Suite is **23 fixtures**;
three independent counts agree (23 directories · 23 `run_case_anywhere` calls · 23 executed), and all
23 pass the L-108 self-naming check programmatically.
**A third false seed, and the guard earning its place.** `S8` first ran as `/^[\v]*$/`, which still
matches an empty line because `*` permits zero occurrences — textually landed, semantically inert,
scoring 0 red / 21 green. Landing, targeting and parse checks all passed it; the only thing that
caught it was the rule that **a landed, targeted seed reddening nothing has tested nothing**.

Being precise about what that inert seed did and did not establish: it did **not** prove the
blank-line gap, even though the gap was real. It suggested one, the fixture was written, and the
*real* seed (`*` → `+`) then reddened exactly that one fixture with 22 green — which is what actually
proves no pre-existing fixture covered it. The reasoning at the suggestion step was worthless; only
the second, semantically real seed carries the claim. The two repeated-field gaps are different and
stronger: those seeds were real from the start (`status == "!"` can never hold, so the guard truly
never fires), and they reddened nothing across 21 and 22 fixtures respectively.

Tally for the session, stated exactly: the reddens-nothing check fired **three** times — twice on
seeds that were semantically inert (`awk -v` escape expansion in T3, then `[\v]*` here) and once on a
real seed exposing a genuinely untested branch (the repeated-field guard). Every one of the three
would otherwise have been recorded as a passing discrimination proof, and `cmp` would have called all
three "landed".

**Gate: `219 pass, 1 fail`**, read off the gate's own printed line, run to a full log this time rather
than through `tail` (the previous entry records why). SPRINT-094's own findings are unchanged and both
pre-existing: `f717e9a`'s three spec/architecture files, attributable to no task, and `T1:TECH-DEBT.md`.
The count has not moved across any of the four commits this session.

### 2026-09-04 | review | round 4: no CRITICAL, design validated, one MEDIUM closed

`consequence · T2 · behaviour:material · governance:high` — Tier G. First round in four that found
no CRITICAL. Hash convention unchanged: `git hash-object <path>`; `diff --strip-trailing-cr`.

**The structural verdict is satisfied.** The reviewer independently enumerated the state space,
confirmed it is `(inb) × (status seen?) × (path seen?)` with the "both seen while open" cell provably
unreachable, and re-verified both round-3 CRITICALs closed end-to-end against the real commit. Its
words: *"this is no longer 'the design is wrong' … I'd ship this design once Finding 1 is closed."*

**Finding 1 (MEDIUM) — "seen" is not the same question as "non-empty", and the code asked the wrong
one.** Both repeat guards used `status != ""` / `path != ""` as their already-seen flag, which
conflates a field never written with one written *empty*. A first `handoff-status:` with no value left
the flag unset, so a later, differently-valued occurrence was accepted as if it were the first — no
malformed-repeat, no UNKNOWN, and a genuinely unresolved handoff reported a confident `spent` at
exit 0. One extra typo past the case the existing fixtures covered. The state space really did have
one more bit than the code modelled. Fixed with explicit `sseen`/`pseen`; both branches carry the bug
independently, so both carry a fixture: `closed-empty-then-repeated-field` ·
`closed-empty-then-repeated-path`. Suite is **25 fixtures**, three counts agreeing.

**A methodological finding about the seeded-break bar itself, and it cost two wasted seeds to see.**
The single-line seeds for these two guards reddened **nothing** — and the fixtures are genuinely
guarded. The defect requires *two* coupled checks to be value-based at once (the field rule's repeat
guard AND the other rule's completion test); revert either alone and the record still closes correctly
at the second field, so no single-line revert can reproduce it. The seed was too small, not the
fixture too weak.

So: **L-142's "one line, line count within one of pristine" is a heuristic for TARGETING, not a
definition of a valid seed.** The real bar is *the minimal edit that reproduces the defect, still not a
demolition* — here two of 202 lines, line count unchanged, both replacements identical in kind. What
told me the first seed was worthless was not the line count, the hash, or `cmp`, but the rule that **a
landed, targeted seed reddening nothing has tested nothing**. That check has now fired five times this
session: twice on semantically inert edits, once on a genuinely untested branch, and twice here on
seeds that were simply too small to reach the defect. It is the only one of the guards that has caught
anything.

Re-seeded correctly, each reddens exactly its own fixture — 1 red / 24 green, 202 → 202 lines, two
lines replaced, `sh -n` clean, restored byte-identical.

**Finding 2 (informational) — the false-positive cost is real, demonstrated, and currently dormant.**
Nothing is skipped, so a fenced block containing a complete, correctly-shaped example record is now
read as real. The reviewer swept all 48 `docs/sprint/**/logs/SPRINT-*.md` and found **zero** current
matches; templates are out of scope by construction, since the checker's glob never reads that
directory. The named forward risk is this sprint's own log, which narrates these bugs — checked
directly: no line in it is heading-shaped, and `check-handoff-state.sh .` reports a clean skip. The
authoring convention this implies (never write a literal `### <date> | handoff | …` heading followed by
two field lines when illustrating the format) belongs in the close Retro, not in more parser code.

**Finding 3 (informational) — the fixture count overstates independent coverage, and now says so.**
`closed-quoted-format-block`, `closed-tilde-format-block` and `closed-nested-fence-example` assert the
same finding shape and exercise the same rule; disabling that one rule reddens all three at once and
no single-line seed separates them. They are ONE independent check wearing three names. Retained
deliberately — each is the recorded reproduction of a distinct real CRITICAL from rounds 2 and 3, and
deleting a reproduction along with the mechanism that motivated it is exactly TD-012 — but the harness
now carries a header saying so, so the count is read as regression history rather than as a count of
independent checks. An honest census beats a flattering one.

**Gate: `219 pass, 1 fail`**, off the gate's own printed line. SPRINT-094's findings unchanged and
both pre-existing (`f717e9a`'s spec/architecture files · `T1:TECH-DEBT.md`). The count has not moved
across any of the five commits this session.
