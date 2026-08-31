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
