---
sprint: 079
slug: the-undifferentiated-middle
owner: Maintainer
last_updated: 2026-08-23
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-079 — Execution Log

> Append-only companion to [`../SPRINT-079-the-undifferentiated-middle.md`](../SPRINT-079-the-undifferentiated-middle.md). Uncapped by design:
> this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.

<!-- Newest entries at the BOTTOM: this reads as a chronology, unlike CHANGELOG.md which is
     newest-first. Event is one of: promote · progress · surprise · scope-change · park · blocker ·
     run-complete · close. -->

### 2026-08-23 | promote | Batch G1 + G2 signed; sequential execution, T1 first

Gates signed against `2aea242` and recorded as `gates_signed: G1,G2 @ 2aea242` in the Plan's
frontmatter — the field an unattended run reads, and the only place a sign-off is visible to one
(L-099). Verified read-back: `PASS gates-signed: … G1,G2 signed @ 2aea242`.

**G1.** Fast-path for T1/T4/T5 (`origin: decomposer`); full checklist for T2/T3, which are
`origin: close-retro` and so never met the intake grill. No `[size: L]`, no `risk: high` task on
auth/input/secrets/data, so no abuse-case sketch is owed.

**G2 — the overlap map is the finding.** Every task shares at least one file with every other
(`spec/STANDARD.md` ×3 · the register ×5 · the engine ×3 · the fixtures and coverage doc ×2), so the
sprint is **fully sequential** and no task is worktree-dispatchable. Order T1 → T2 → T3 → T4 → T5
matches the Plan's `Depends-on` exactly. Preflight: no cycle · ownership resolved · base-ref = HEAD
(`2aea242`) · one wave. Dispatch: T1/T2 inline (`class: decision`), T3 direct (a spec edit), T4/T5
to `/tdd` — a retained fixture per finding *is* the test-first shape.

### 2026-08-23 | surprise | all 11 `scope-out` rules report to adopters as `rule-unimplemented`

Found while discharging **A2** at G2, before T1 started. The register dispositions eleven rules
`scope-out` with documented reasons, in two classes — **(a) seven restate a rule checked elsewhere**
(`S7.ORPHAN` `S7.PERSON` `S7.OUTSIDE` `S7.LEDGER` `S2.F-ARCHIVE` `S9.GATESINFILE` `S3.README`, each
carrying an arrow to its covering rule) and **(b) four govern the standard document, not an adopter's
repository** (`S2.R-CAPEXACT` `S2.R-DESIGN` read §2's own table, which an adopter does not have;
`S2.R-SKILLCAP` `S2.R-SKELETON` govern `SKILL.md`, a plugin artifact). Class (c) is empty. 7 + 4 = 11.

**The engine does not know any of that.** A single `sh conformance.sh .` reports **all eleven** as
`rule-unimplemented` GAP — it reads the spec's Mark column, sees `mechanical`/`split`, finds no
assertion, and says so. So an adopter's report cannot distinguish a rule we **decided not to build**
from one we simply have not reached, and the eleven sit in the GAP list beside the twenty-one.

**Why this matters beyond cosmetics.** D1 makes the spec the rule source; a disposition recorded only
in `docs/research/` is invisible to the tool that publishes the report. This is the same shape as
`gates_signed` living only in a launching transcript (L-099), the L-144 collapse ruling living only
in SPRINT-078's commit message, and SPRINT-075's discovery that an adopter's level moved with *our*
roadmap. It is evidence for T1 that both classes want a **mark in the spec** rather than a note in the
register — (b) beside `implementation-directed`, which the register already names as its shape, and
(a) something that says *covered by `<rule>`* — because a mark is the only disposition the engine can
read.

Recorded before T1 rules, so the ruling answers evidence rather than producing it.

### 2026-08-23 | scope-change | T1's ruling needs an engine edit its `Layers:` does not declare

Logged **before** § Plan is touched, and before any DoD is ticked. The scope holds; a *criterion*
went stale against what execution found (L-088's shape, the orchestrator's second edit-safety
red flag).

**What broke.** T1's DoD item 4 verifies a re-mark by *"`sh conformance.sh .` stops asserting it with
**no engine code edit**"* — the spec-driven property SPRINT-074 established and proved for
`judgment-only`. The owner's steer is to rule (a) and (b) **separately**, which means at least one
mark value the spec does not have today. That half of the property was never tested.

**Measured, not reasoned.** Copied the spec to a scratch path, re-marked exactly one rule
(`S2.R-DESIGN`, line 283: `mechanical —` → `standard-directed —`; seed verified landed with `cmp`,
line delta 0, so it is a targeted break and not a demolition — L-137/L-142), and ran the engine
against it with `--spec`:

```
      S2.R-DESIGN     -- unrecognized mark 'standard-directed' (level: Structural), not evaluated
GAP   S2.R-CAPEXACT   -- rule-unimplemented: ... (sibling control, unchanged)
```

So the property is **half true**. The rule does leave the GAP list with no code edit — the engine's
`case "$mark"` has a `*)` arm and degrades gracefully rather than mis-evaluating. But it reports
**`unrecognized mark`**, which reads to an adopter as a defect *in the standard*, not as a deliberate
exclusion. For eleven rules at once, that is a worse consumer-facing surface than today's
`rule-unimplemented` (L-015), and shipping it would be the spec-only trap: a ruling that is correct
in the document and invisible-to-wrong in the tool (TD-001 · L-007).

**Impact.** A named exclusion line needs a `case` arm per new mark in
`scripts/lib/conformance-engine.sh` — a small, contained edit, and one T1's `Layers:` does **not**
declare (`spec/STANDARD.md` · `spec/CHANGELOG.md` · the register · the epic · `docs/adr/`). Ruling
this inside T1 without amending `Layers:` would also trip `check-layers-observed.sh`.

**Re-confirm G2 required** — surfaced to the owner rather than absorbed. Not ticked, not worked
around, and § Plan is unchanged pending the ruling.

### 2026-08-23 | scope-change | owner ruling: split the property, declare the engine — § Plan amended

**Ruled:** the criterion becomes two claims rather than one. *The rule stops being **asserted** with no
engine code edit* is the spec-driven property SPRINT-074 established, it is true, and it stays. *The
engine **names** the exclusion* is a second, separate claim that needs one `case` arm per new mark
value. Saying which half is which is the finding — the same form SPRINT-074 itself ruled when it
split "reads its rule set from the spec" from "assertion bodies stay in code".

**Applied to § Plan** (the amendment the scope-change above authorises):
- T1 `[size: S]` → `[size: M]`.
- T1 `Layers:` gains `scripts/lib/conformance-engine.sh` — a live declaration corrected per task, which
  L-100 names as the expected cost of declaring before the work: log it, declare it, continue.
- DoD item 4 becomes three: the re-mark + changelog level, the no-code-edit half, and the
  named-exclusion half with a retained fixture per new mark. Sprint DoD total 26 → 28.
- The changelog-level clause now names the spec's **own** test — *PATCH iff nothing an adopter
  satisfies today changes, else MINOR*, which 0.5.0 states for itself — instead of the Plan's vaguer
  "at least MINOR". A5 was confirmed at G2 by reading that test rather than by assuming a floor.

Nothing was ticked before this ruling, and § Plan was not edited before it.

### 2026-08-23 | progress | T1 done — the eleven are marked, and the middle is gone

**Ruled (c): a third state, admitted in the spec.** Both classes kept their reasons; what was wrong was
the **place**. §14 gains `restated` (7) and `standard-directed` (4), spec **0.5.0 → 0.6.0 MINOR** on
the spec's own test (*does anything an adopter satisfies today change?* — it does: their report loses
eleven `rule-unimplemented` lines and gains eleven named exclusions).

**§14 handed over the ruling rather than my inventing one.** It already says §8 contributes **0**
because *"it restates seven rules under a second name, inflating any denominator that ingests it"* —
and the register independently called class (a) *"§8's problem at rule scale."* So `restated` is an
established principle applied consistently, not new machinery. `standard-directed` is
`implementation-directed` one category out, which is the register's own phrase.

**Measured, at each step rather than at the end:**
- 11 Mark cells rewritten — verified as *exactly* 11 changed lines, 993 → 993 line count, and column
  count preserved on every edited row (a fused table row is L-009's named failure).
- Engine: one `case` arm per mark + counters. `GAP 38 → 27`, `FAIL unchanged at 34`, **0**
  `unrecognized mark` lines. `coverage: 24 + 27 = 51`, and with the 6 outboard checkers
  **51 = 30 covered + 21 build, 0 scope-out.**
- Three retained fixtures (`mark-restated` · `mark-standard-directed` · `no-unrecognized-mark`), all
  passing.
- **Discrimination proven, and the first attempt at proving it was itself wrong.** Deleting only the
  `restated)` label orphaned its body and the engine stopped parsing — 0 of everything, which would
  have scored as a redden for the wrong reason (L-142 exactly). Re-seeded by removing the whole 7-line
  arm: the copy still **parses**, case 4c reddens with 7 `unrecognized mark` lines where it asserts 0,
  and the `standard-directed` sibling control stays green at 4.

**Nothing was ruled (a) checked**, so § `build` is unchanged at 21 and T4/T5's rule set did not move —
**A2 held**, which is why the sprint could sequence this first without risking rework downstream.

`docs/DECISIONS.md` carries **ADR-028**; the epic's § Closed-when 2 is amended with its prior wording
preserved in place, and the cost — a smaller checkable set makes our own exit condition easier — is
written into the row rather than left for a reader to notice.

### 2026-08-23 | progress | T2 — §2 gains the Multi-service rows, and one of the three was never a new doc

**Two mechanical facts found before designing, either of which would have made a plausible fix
invisible.** Both were read out of the engine rather than assumed (L-130 — SPRINT-074 froze a wrong
structural claim about exactly this kind of question):

1. **`_tier_rows_at` matches `$1 == r` — exact rank, not cumulative.** Each tier rule asserts only the
   rows added *at* its own rank; the cumulative feel of §6's `+` comes from all four rules firing for a
   repo that declares rank ≥ N. So Multi-service does **not** re-own Medium's rows.
2. **The Tier→rank mapping had no rank 4 at all** — `medium`→3, `backend`/`API exists`→2, `base`→1,
   everything else→0 and skipped. Adding §2 rows alone would have changed nothing an adopter could see:
   the parser would have dropped them and `tier-doc-set-underivable` would have kept firing. The
   Backlog row anticipated this (`conformance-engine.sh` — *"only if the finding changes"*), so the
   engine was already in T2's `Layers:` and no scope-change was needed.

**Fact 1 is what re-shaped the task.** §6 named *three* Multi-service docs, but the third — *global
decisions index* — is Medium's `DECISIONS.md` at umbrella scope, already owed at rank 3. Naming it
again owed it twice. So T2 adds **two** rows and withdraws the third claim, rather than adding three.
That is T1's `restated` insight one level down, arrived at independently by reading the rank code.

**Verified on the consumer path, because this repository cannot dogfood it (L-016).** lean-flow ships
no `.conformance-tier`, so `S6.MULTISVC` here reports *"not evaluated: declares no tier"* and the
branch T2 fixes is unreachable from our own tree — a green run against this repo would have proven
nothing. A scratch umbrella repo declaring `multi-service`:

- **before** — `FAIL S6.MULTISVC -- tier-doc-set-underivable` (a finding about the STANDARD)
- **after** — `FAIL S6.MULTISVC -- tier-doc-set-incomplete: docs/architecture/service-registry.md` ×2
- **cleared** — creating exactly those two files → `PASS S6.MULTISVC -- all 2 unconditional
  Multi-service doc(s) present at their canonical §2 path`

**The first before/after run was empty and that was a broken query, not a result** (L-108): the pristine
engine was invoked from a scratch path with no `read-spec-rules.sh` beside it, so it failed the
reader-missing guard rather than reporting anything. Re-run with the reader alongside, it printed the
`underivable` finding as expected.

**A retained fixture was replaced, not deleted.** `tier-multisvc-underivable` asserted the very finding
T2 eliminates; left alone it would have gone red, and quietly weakened it would be L-146's vacuous
pass. It becomes `tier-multisvc-incomplete` (must-FAIL, naming the file) plus `tier-multisvc-clears`
(the PASS control proving the finding is actionable) — the must-FAIL bar holds, the finding it names is
just the right one now.

**`Layers:` corrected on both tasks, and the correction is the expected cost, not a defect** (L-100).
T1 gained `evals/…-fixtures.sh` · `docs/DECISIONS.md` · `docs/architecture/overview.md`; T2 gained the
same fixtures file and `overview.md`. Neither was predictable at promote — the fixture file follows
from *how* the check got guarded, the ADR index from whether an ADR was warranted, and the overview
from the spec version string moving. Declared before committing, so `check-layers-observed.sh` can
attribute each file per task rather than only against the all-task union.

### 2026-08-23 | surprise | T1 and T2 were nearly committed as one, which the attributor treats as a FAIL

`check-layers-observed.sh` attributes a commit to **exactly one** task — a `Task:` trailer first, then a
`sprint(NNN) Tn:` subject, then `sprint(NNN):` → COORD, else **UNATTRIBUTED, its own named FAIL**. So a
combined T1+T2 commit would have reddened the close gate, and attributing it wholly to T1 (whose
`Layers:` happens to cover every path T2 touched) would have passed the check by mislabelling T2's work.

**This is L-150's failure, reached from the other direction.** SPRINT-078 batched two tasks into one
commit to avoid a gate cycle and paid roughly twice the saving to un-pick it. Here nothing was batched
deliberately — T2 simply started while T1's gate was still running, and the tree accumulated both.

**It cost minutes rather than the half-hour L-150 records, and the reason is worth keeping.** Every
edit in this session was made against a pristine copy saved first, for verification — so the T1-final
state of all four shared files already existed on disk (`S.T2.pristine.md` · `C.T2.pristine.md` ·
`E.T2.pristine.sh` · `fx.T2.pristine.sh`), as did the T1-final sprint file, and the log split cleanly at
the T2 heading. Restore, commit T1 with `Task: T1`, restore T2, commit T2. **The habit kept for
correctness paid for itself in recoverability** — which is an argument for snapshotting that has
nothing to do with verification.

**The rule that follows:** commit a task before starting the next one, even when its aggregate check is
still running — the per-task legs are what gate the commit (owner ruling, this sprint), and the
aggregate is a close-time step. Waiting on the aggregate is what made the trees overlap.

### 2026-08-23 | progress | T3 — `DECISIONS.md` addressable, and gated so it cannot fire falsely

**DoD 1 answered first, mechanically.** TD-070's shared `read-spec-files.sh` has **not** landed
(`status: open`, and the file is absent), so T3 is not free and proceeds with the row split. Confirmed
by checking for the file rather than taking the row's word for it.

**The row is split, not rewritten.** `adr/ADR-NNN-<slug>.md` stays a family — §4 makes "no ADRs" correct
rather than incomplete — and `DECISIONS.md` becomes its own literal path, which is what makes it
addressable to all five §2 parsers.

**The half that is not obvious: it had to be substrate-gated, or the fix would fire falsely.** §2 line
216 says *don't pre-create `DECISIONS.md` … until the first real entry exists*, so a Medium repo that
has taken no qualifying decision does not owe it. A plain literal row would have made `S6.MEDIUM`
demand it from a correct repository. §6's Medium row now names it after the words
**substrate-conditional** — the same mechanism `auth exists` and `DB exists` use — and the engine reads
the stem from §6's own text with **no code change**, which is the spec-driven property holding.

**One mechanical detail decided the wording.** `_tier_is_conditional` matches a stem against the path
**extension-stripped** (`docs/DECISIONS.md` → `DECISIONS`), which is why every existing stem in §6 is
extensionless. Written as `` `DECISIONS.md` `` the stem would never have matched and the gate would
have fired anyway — the fix would have looked applied and done nothing (L-148's shape). Also: every
backticked token *after* the phrase becomes a stem, so `adr/` and `flows/` stay before it.

**Before / after on a scratch Medium repo** (our own declares no tier, so it cannot reach this branch):
- **before** — *not evaluated: every §2 row at Medium names a FAMILY … §6's own doc set also names
  `DECISIONS.md`, which §2 carries only inside a pattern row's File cell and this engine therefore
  **cannot address***
- **after** — *substrate-conditional, skipped not owed (§6): `docs/DECISIONS.md`* + *no unconditional
  doc is owed at Medium once §6's substrate-conditional rows are set aside*

The doc set is derived and `DECISIONS.md` is named in it. No regression on our own tree: FAIL 34,
GAP 27, coverage 51, all unchanged.

**A retained fixture replaced for the second time this sprint.** `tier-medium-family` asserted that
*every* §2 row at Medium names a family — true only while the defect existed. It becomes
`tier-medium-decisions-addressable`, which asserts **two** halves that can break independently: the
engine names `docs/DECISIONS.md`, and it does **not** demand it from a repo with no decisions.

### 2026-08-23 | surprise | `S4.INDEX` silently passes when the index is missing

**Found while establishing whether the tier rule could safely set `DECISIONS.md` aside** — the whole
substrate-conditional design rests on something else asserting the file, and it turned out nothing does.

§4's Conformance row specifies `S4.INDEX` as *mechanical — `DECISIONS.md` **exists** and carries a row
for every `docs/adr/ADR-NNN-<slug>.md`*. Against a scratch repo holding one ADR and **no** index, the
engine emits **no `S4.INDEX` line at all**: not a PASS, not a FAIL, not a GAP. Add the index and it
reports `PASS  S4.INDEX -- all 1 ADR(s) carry a row in docs/DECISIONS.md`. So the "carries a row"
half is implemented and the **"exists" half is not**, and a repository with 28 ADRs and no index would
be reported clean.

**Why it went unseen:** every repository the check has ever run against — this one, and every fixture —
already had a `DECISIONS.md`. The absent case was never exercised, which is exactly the silent
false-negative L-058 exists to prevent, one level in from where it usually bites.

**Not fixed here, and the reason is scope rather than convenience.** It is a defect in a *check*, not in
the row T3 owns; fixing it means an engine assertion plus its own must-FAIL fixture, and T3's acceptance
is met without it. **Filed for the close Retro as a `TD-NNN`**, and named in spec 0.8.0's entry so it is
visible to a reader of the standard rather than only to us. It does not weaken T3: the tier rule setting
`DECISIONS.md` aside is correct either way, and this makes the follow-up more valuable, not less.

### 2026-08-23 | surprise | CORRECTION — `S4.INDEX` does not silently pass; my query was wrong

**The entry above is wrong and is left standing, because the mistake is the more useful record.** It
claimed `S4.INDEX` emits *no line at all* against a repo with ADRs and no index. It does emit one:

```
FAIL  decisions-index-missing-adr: no decision index found at docs/DECISIONS.md or DECISIONS.md
```

The existence half **is** implemented. I searched the output for `S4\.INDEX`, got nothing, and read
that empty result as a fact about the engine rather than about my query — **L-108 exactly**, and the
cross-check rule I had been citing all session: *a query whose result you act on immediately gets a
second query that must agree.* I ran one query and wrote the conclusion into two durable artifacts
(this log and spec 0.8.0's entry) before anything disagreed with it. The disagreement, when it came,
came from reading the code — not from re-running the search.

**There is still a real defect, and it is the thing that fooled me.** That FAIL line carries **no rule
id**, while the same rule's PASS line does (`PASS S4.INDEX -- all 28 ADR(s) carry a row …`). Because a
failing assertion returns before its PASS line, **a failing rule can be entirely un-attributable in the
report.** An adopter reading `FAIL decisions-index-missing-adr: …` cannot tell which rule to look up,
and neither could I.

**Systemic, not local:** 23 of the engine's 54 `bad`/`ok` verdict lines name a finding without a rule
id. The dispatch-loop lines carry `$pid`; the per-item lines inside assertions do not.

**Scope ruling (owner: "fix it and continue, no defect left in sprint if still inline").** Fixed in this
sprint as **T6**, added to the Plan by amendment. The spec 0.8.0 entry was corrected in place rather
than appended to — it had not been committed, and publishing a claim known to be false would be worse
than editing an unpublished block.

### 2026-08-23 | scope-change | T6 added to the Plan by amendment — owner ruling

*"fix it and continue, no defect left in sprint if still inline."* The un-attributed FAIL line is fixed
in this sprint rather than filed. Added as **T6** rather than folded into T3: `check-layers-observed.sh`
attributes a commit to exactly one task, and the two have different subjects (§2/§6 rows vs the report's
shape). Sprint DoD **28 → 34**. § Plan edited only after this entry.

### 2026-08-23 | progress | T6 — every finding names its rule, appended not prepended

**The design turns on a hazard that is easy to miss.** The obvious fix is to prefix the rule id, matching
the dispatch loop's own `$pid` shape. Three retained fixtures assert the **absence** of a finding *at
line start* — `! grep -qE '^FAIL +ownership-header'` (×2) and
`! grep -qE '^FAIL +file-outside-canonical-placement'` — and a fourth, in the foreign-repo harness,
matches `^FAIL  [a-z-]+: `. A prefix satisfies all four unconditionally: they would go green because the
line no longer matches, not because the defect is gone. **That is L-146's vacuous pass, and the fix would
have manufactured four of them.** Appending `(S4.INDEX)` breaks no pattern, positive or negative, and
leaves the finding first — the order an adopter reads and acts on.

**Verified, not assumed:** all four patterns were re-run against a repo seeded to produce each finding,
and all four still match. That is the DoD line this task exists for — a change that silently disarms an
existing guard is worse than the defect it fixes.

**Result:** 0 un-attributed FAIL lines across a 12-finding run, up from every per-item finding being
un-attributable. `_cur_rid` is set by the driver before dispatch, so a *new* assertion inherits
attribution without its author remembering to add it. No subshell in `bad`/`ok` — they run once per
finding per file, and a `$( )` there is the per-row spawn that has cost this engine its wall clock three
times (L-144).

**`ok()` was ruled, not left ambiguous** (DoD 3): fixed the same way. The suffix carries no breakage risk
for PASS lines either, and leaving half the verdict lines attributable would have been the same defect
with a smaller blast radius.

**A second defect found in the same family and fixed inline.** Every `tier-doc-set-incomplete` finding
read *"this repository declares tier 'medium'medium"* — `${v:+a}${v:-b}` emits **both** branches when
`v` is set, because `:-` yields the value rather than the fallback. A garbled verdict line is the same
family as an un-attributable one: it is the finding an adopter has to act on. One-line fix, 0 garbled
lines after.

### 2026-08-23 | progress | T4 — §9's sprint-file family, and the check caught this very sprint

Five rules, six findings. Coverage **24 → 29** in the engine; GAP 27 → 22.

**Two rules needed a false-positive guard the DoD did not name**, both the same shape T3 hit:
- **`sprint-log-missing`** — §9 creates the Execution Log *lazily at the first entry*, so its absence
  before any work is correct. The substrate is a **ticked DoD box**: a Plan with no tick has nothing to
  have logged. Without this the check would fire on every sprint in the gap between promote and its
  first task — a finding about correct behaviour.
- **`dod-criterion-names-no-check`** — §9 says a criterion names its check *"where a mechanical check
  exists"*, so demanding a `*Verify:*` clause on every criterion would fire on judgment criteria that
  legitimately have none. Scoped to **ticked** criteria, where the template already requires
  `- [x] … ✓ <what proved it>`: a claim of done that names no evidence is checkable without judging
  whether a check exists.

**The cap is read, not written.** `_s2_cap_for` pulls 400 from §2's own row — a figure hard-coded here
is a second SSOT that drifts from the row it copied (L-097 · L-130). **This is the sixth independent §2
parser**, and it is recorded rather than slipped in: TD-070 counted five at SPRINT-078, and its case for
a shared `read-spec-files.sh` is now stronger by exactly one caller.

**§7's own table says the cap belongs here.** `S7.SPRINT400`'s fourth column points at `S9.TWOFILES`,
so the register's `build` row is right and `check-doc-caps.sh` is the outboard stand-in.

**The first run against this repository found a defect in my own design.** `S9.PLANFROZEN` reported
**FAIL** on SPRINT-079 — § Plan *did* change after `d692b93` (T1's DoD amendment, T6's addition) — while
`S9.SCOPECHANGE` reported **PASS**, *5 § Plan edit(s) after freeze, each with its scope-change entry
already in the log at that commit*. Both edits were properly logged first, and the pair contradicted
itself: an unclearable finding against an amendment §9 explicitly permits.

**Fixed by splitting the two rules along the line §9 actually draws.** `S9.PLANFROZEN` asks *does an
entry exist at all* — an amended Plan with a scope-change entry is reported as accounted for, not failed.
`S9.SCOPECHANGE` asks *was it written first*, reading the log **as of that commit** rather than today's,
because reading today's would accept an entry composed after the fact — which is the order §9's *before*
exists to catch. An entry added later satisfies the first and fails the second; that is a real split,
not a duplication.

**Its own harness, `evals/run-sprint-family-fixtures.sh`.** PLANFROZEN and SCOPECHANGE are defined over
history, and `run-conformance-engine-fixtures.sh` states in its header that it needs no git — bolting
git on would falsify its own contract and add minutes to a suite already past six. The repo's convention
for a git-backed family is a sibling file. It runs against the **shipped** spec rather than a reduced
copy, because every case asserts on a named finding string rather than an exit code, so a §9 row that
moves breaks these cases — which is the point.

**Every finding has a control**, including two for `dod-criterion-names-no-check` (the rule admits two
evidence forms, and passing only one leaves the other unguarded) and the pair that separates *the Plan
moved* from *the Plan moved unaccounted*.

### 2026-08-23 | progress | T5 — §10's learning-governance family

Four rules. Engine coverage **29 → 33**; GAP 22 → 18. Register § `build` 16 → 12, coverage 35 → 39.

**Every threshold and counter is read, never written.** `_s10_threshold` pulls *count ≥ 2* from §10's
own prose — §10 is the section stating that a figure inside a criterion is remembered rather than
measured, so hard-coding `2` in the checker *for that rule* would be the failure demonstrating itself
(L-097 · L-130). The sprint counter for TD aging comes from the active Plan's frontmatter; guessing it
from the highest TD row would make the ledger date itself.

**`S10.PROMOTION` counts promotion state position-anchored**, per §11's own instruction and L-108 —
and the fixture makes that difference a case rather than a comment: a control whose entry is already
`[status: promoted]` at the same count must stay silent, which a substring scan would fail. On the real
ledger the gap is 42 by substring against 41 anchored.

**Three of the four needed a false-positive boundary**, and each got a control fixing it:
- **`S10.TDAGING`** reads the ledger's **header region** for the aging sweep rather than demanding a
  per-row `updated:` field — §10 asks for a re-review *prompt*, and the sweep is one note about many
  rows. Anchored to the region, not to the sweep's wording, so a re-phrased sweep does not read as an
  absent one. Two controls: an aged row the sweep names, and a row younger than three.
- **`S10.FOURBUCKETS`** fails only when a close reached **none** of the four homes. A bucket can be
  legitimately empty — a sprint that incurred no debt files no `TD-NNN` — so demanding all four would
  fail a correct close. Reaching none is unambiguous, and the control fixes that boundary at one.
- **`S10.PROMOTEREVIEW`** accepts either the plan-lock commit message or the log's promote entry,
  because §10 fixes the checklist's **content** and not its location; demanding one home would fail a
  repository that used the other — a finding about our convention rather than about the standard.

**The engine exited mid-report on its own repository, and the cause is worth keeping.** `sprint: 079`
→ `$(( 079 - 075 ))` is **not a subtraction**: a leading zero makes it an *octal* literal and `079` has
no octal reading, so the shell aborts with *value too great for base*. The report simply stopped after
`S10.REDERIVE` — no error line in the output, no `coverage:` line, and the four §10 rules absent
entirely. **I first read that absence as "the assertions are not registered"** — the same L-108 shape as
the `S4.INDEX` mistake earlier this sprint, and caught this time by checking stderr rather than
re-reading the code. Sprint numbers are zero-padded by this standard's own convention, so any adopter
following it would have hit this. `_dec` strips the padding and carries the explanation.

**Cross-check worth recording:** `S10.TDAGING` independently derives **16** aged rows — the same figure
the promote governance scan produced by hand, from entirely different code. Two derivations agreeing is
what the cross-check rule asks for, and it is the first time this sprint that a check and a manual scan
have been able to confirm each other.

### 2026-08-23 | close | the close gate caught three things, two of them this session's own work

`QA-CHECK: 167 pass, 2 fail` on the first run over the written close.

- **`README footer version (footer=1.52.0, plugin.json=1.53.0)`** — the version bump reached four
  manifests and missed the README's ownership footer. A leg exists for exactly this, and found it.
- **`layers observed: … changed but undeclared: scripts/qa-check.sh`** — registering the new harness was
  a close-time edit no task declared. Declared under **T4**, which is the task that shipped the harness
  unwired; attributing it to the close would have hidden whose gap it was.
- **`retro-bucket-unrouted: … status: closed but records no close_commit` (S10.FOURBUCKETS)** — **T5's
  own check, firing on this sprint's close, hours after being written.** Not a defect: `close_commit`
  cannot exist before the commit that creates it, so the window between `status: closed` and the
  recorded sha is genuinely unauditable and the rule says so. It is the same shape as `plan_commit` at
  promote, and it clears when the follow-up commit patches the sha in. **The check found the one state
  the close passes through where its own claim cannot be verified** — which is a better first outing
  than a fixture could have given it.

**Earlier in the same close, the gate caught a fourth**: `run-sprint-family-fixtures.sh` was *"in evals/
but neither gated nor explicitly excluded"* — T4 shipped a harness and never registered it (L-020,
shipped ≠ wired). Registered opt-in under TD-016's rule, priced in TD-073.
