---
sprint: 095
slug: guards-that-misreport
owner: Maintainer
last_updated: 2026-09-07
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-095 — Execution Log

> Append-only companion to [`../SPRINT-095-guards-that-misreport.md`](../SPRINT-095-guards-that-misreport.md).
> Uncapped by design: this file grows with the work done, which is exactly why it is not inside the
> Plan's 400-line budget (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.

### 2026-09-07 | promote | Plan locked at `2453678`, four tasks, 27 DoD

Promoted from a Backlog groomed the same day (`/triage` → `/task-decomposer` → promote). Single
stream, no `epic:` — checked at promote rather than assumed: T1–T4 trace to TD-125, TD-132,
SPRINT-094's close-Retro and TD-117/TD-128, none an EPIC-015 member.

### 2026-09-07 | surprise | the pre-dispatch preflight HALTs on this sprint's own Plan

Run at G2 sequencing, before any dispatch. Three findings, and **only one is a Plan defect**:

```
PASS base-ref: declared base matches live HEAD (18b9a0b)
FAIL cycle-detected: tasks unresolved -> T3 T4
FAIL shared-file-unowned: scripts/lib/check-layers-observed.sh ~ scripts/lib/ in T1 and T3
PASS shared-file-owned: scripts/qa-check.sh in T3,T4 order=T3->T4
PREFLIGHT: HALT
```

(a) **The cycle is TD-132 firing on the Plan written to fix it.** T3's and T4's `Depends-on:` fields
carry explanatory prose containing the literal `T3`/`T4`, which the unanchored `grep -oE 'T[0-9]+'`
harvests as edges, inventing self-edges no topological sort resolves. The real graph is
`T1:none T2:none T3:none T4:T3` — acyclic. Stripping the prose would silence the gate **and destroy
T2's motivating artifact**, which is gate-dodging (an orchestrator red flag), so the prose stands.

(b) **The shared-file FAIL is real and is mine** — see the `scope-change` entry below.

(c) The `shared-file-owned` PASS agrees with D1, but it is derived from a parser known to invent
edges, so it is **not** treated as evidence until T2 lands and the preflight is re-run.

### 2026-09-07 | surprise | TD-125 reproduced under control — and the signal it names does not discriminate

A1 required confirming before designing T1. Two flawed attempts preceded the good one, both recorded
because the flaws are the instructive part:

1. **Archived 092 and 093 together** — that is the documented *workaround*, not the defect: with both
   gone there is no active sibling for the re-attribution to land on. Measured nothing.
2. **Archived 093 alone but passed only `SPRINT-092-*.md` to the checker** — `sibling_sprints` is
   built from `"$@"`, so 092 had *no siblings at all* in that leg. The archive move and the argument
   set both changed; the result was confounded and its 85-pair figure unattributable.
3. **Controlled:** both legs invoke the checker with `ls docs/sprint/SPRINT-*.md`, exactly as
   `qa-check.sh:1013` does, so the archive move is the only variable.

| | 093 in place (4 files) | 093 archived alone (3 files) |
|---|---|---|
| PASS lines | 1 | 1 |
| FAIL lines | 4 | **4** |
| 092 blamed `commit:path` pairs | **3** | **85** |

**Neither the PASS nor the FAIL line count moves.** TD-125 records the *pass* count as "the second
signal and the one worth keeping" — true of the whole `qa-check` gate, where twelve checks stopped
being invoked, but **false at the checker level**, which is where T1 works. Here both red/green
figures are identical across the legs while 82 additional files are misattributed. The only
discriminating measurement is the blamed-pair count. T1's DoD is restated on that basis below.

Also measured: the gate is **already red in place** — 4 FAILs (`f717e9a` attributable to no task,
reported against 092/093/094; `fa061bc:TECH-DEBT.md`; `T1:TECH-DEBT.md` undeclared). All pre-existing,
all TD-107's class, none caused by this sprint.

### 2026-09-07 | scope-change | T1 DoD-2 restated — the criterion was unsatisfiable at freeze

**What broke:** DoD-2 read *"green in place AND green archived"*. The gate is not green in place and
was not at promote either — the four FAILs above predate this sprint. A criterion that cannot pass
however well the work is done is L-088's shape (a DoD frozen at promote against an unmeasured
premise) and L-185's (a criterion resting on a state that does not hold).

**Impact:** the Plan's § Plan is edited after freeze, so this entry precedes that edit. Scope is
unchanged — T1 still fixes the archived-sibling attribution and nothing more. What changes is how the
fix is *measured*, and the new measure is strictly stronger: pass/fail counts would have gone green
without discriminating anything.

**Re-confirm G2:** owner-ruled 2026-09-07 — measure the blamed-pair delta, and state explicitly in
the criterion that PASS/FAIL line counts do not discriminate this defect, so a later reader does not
substitute them back.

### 2026-09-07 | scope-change | T3 `Layers:` narrowed from a directory token to its file

**What broke:** T3 declared `scripts/lib/` — a **directory** token, which under the preflight's
`covers()` prefix arm swallows every path beneath it, including T1's
`scripts/lib/check-layers-observed.sh`. That produced `FAIL shared-file-unowned` between T1 and T3
for a file T3 never intended to touch. `dispatch.md`'s own boundary note rules this out: declare a
directory only for a tree **one** task owns.

**Impact:** a false overlap between T1 and T3, which would have forced them sequential for no reason.
No scope change — T3 always meant its own new checker.

**Re-confirm G2:** `Layers:` is a live declaration corrected per task, not a frozen prediction to
defend (L-100) — logged, declared, continue.

### 2026-09-07 | progress | two named-check FAILs overridden on recorded owner ruling (ADR-021)

Neither is ticked past silently; both are recorded here because that is what ADR-021 requires of a
named check's FAIL.

1. **`FAIL cycle-detected` (pre-dispatch preflight)** — overridden. It is TD-132, the defect T2 is in
   this sprint to fix, firing on prose the template sanctions. Evidence contradicting the halt: the
   declared graph is acyclic (`T1:none T2:none T3:none T4:T3`). **Re-run the preflight after T2 lands
   and treat *that* result as the binding one** — including the `shared-file-owned` PASS, which is
   currently derived from invented edges.
2. **`FAIL verify-does-not-reach-target` (`check-verify-reaches.sh`)** — overridden. It pairs
   `092/093` as target against `check-layers-observed.sh` as method and greps the script's text for
   that literal; the script reaches those files because they are **passed as arguments**. TD-087
   records this exact two-method-pairing shape as a known false positive, and it sits inside
   TASK-300's unresolved gate-accuracy cluster.

### 2026-09-07 | progress | G1 + G2 signed; execution order set to T2 → T1 → T3 → T4

G1: goal verifiable, sizes S/M/S/M (no `L`), blast radius mapped, out-of-scope named, assumptions
resolved. Full checklist run for all four — only T2 and T4 carry `origin: decomposer`, and a batch
sign-off never fast-paths the rest.

Assumption outcomes: **A1 confirmed** (measured above; figure corrected from TD-125's ~70 to 85, and
the discriminating signal corrected) · **A2 confirmed** by reading both parser call sites ·
**A3 confirmed with a caveat** — only **11 of 52** recent `sprint(` commits carry an `N of M DoD`
claim (~21%), so the claim-reconciliation half covers a fifth of commits and the *unattributed-tick*
half is the substantive one, exactly as T3's own narrowing clause anticipates · **A4 unconfirmed by
construction**, with the seeded-checkpoint fallback declared in T4's DoD · A5 confirmed.

**Order — T2 first, repair the gate before relying on it.** T2 is disjoint from T1/T3/T4, so nothing
is serialised by moving it up, and every dispatch decision taken before it lands would otherwise rest
on a preflight known to invent edges. Then T1 (unblocks three parked archivals), then T3 → T4 in D1's
order.

consequence · T1 · behaviour:material · governance:high
consequence · T2 · behaviour:material · governance:high
consequence · T3 · behaviour:material · governance:high
consequence · T4 · behaviour:material · governance:high

All four are Tier G guards whose false negative is silent by construction (D4), and T2 additionally
ships to consumers inside the plugin. Depth follows: each gets a worktree-isolated independent
reviewer (L-165 · L-168), not a self-pass.

### 2026-09-07 | surprise | all four `Layers:` declarations were being read as first-line-only

Found while re-running the preflight after the T3 narrowing: the `shared-file-owned` PASS for
`scripts/qa-check.sh` **disappeared**, which it should not have. Cause: the preflight (and the full
checker that mirrors it) treats an **indented** line as continuing a declaration and resets on a
column-0 line (`*) cur="" ;;`). Every `Layers:` in this Plan wrapped at column 0, so the ownership map
was built from each task's **first line only**:

| Task | captured | silently dropped |
|---|---|---|
| T1 | `check-layers-observed.sh` | fixtures + harness |
| T2 | `dispatch.md` | harness + fixtures |
| T3 | `check-dod-delta.sh` | `qa-check.sh`, fixtures |
| T4 | `qa-check.sh` | `qa-budget-check.sh`, harness, fixtures |

SPRINT-094 keeps each `Layers:` on one long line — that is **load-bearing, not house style**. All four
declarations here are collapsed to single lines (L-100 live correction, no scope change), after which
the preflight reports `PASS shared-file-owned: scripts/qa-check.sh in T3,T4 order=T3->T4` from
complete declarations and the T1↔T3 `shared-file-unowned` FAIL stays gone.

**Why it matters beyond this Plan, and a debt candidate (`TD-138`, id derived from a max of TD-137).**
A dropped `Layers:` continuation is a **silent false negative in the ownership map** — the dangerous
direction: two tasks that genuinely share a file can both come back unowned-but-unreported because
neither declared it where the parser looks. Nothing warns. This is `L-186`'s shape one level down —
the detection logic was sound; the **set of tokens it ran over** was not — and it was caught only
because a PASS line vanished between two runs, not by any check. Filing is left to the owner rather
than taken here.

consequence · plan-declarations · behaviour:material · governance:high

### 2026-09-07 | progress | T2 built — parser anchored at both call sites, 13 assertions, nothing ticked yet

**Implementation.** Two helpers added beside `TOK` (the anchoring TD-043 gave the `Layers:` side and
`Depends-on:` never got): `dep_region` truncates a field at the first prose marker — em dash, ` --`,
or `(` — and `dep_ids` reads `T[0-9]+` from what remains. Both call sites use them: the
`"Depends-on:"*)` field arm and the indented `D)` continuation arm. When a field carries prose its
continuations are prose too, so collection stops (`cur=""`); a field that merely wraps its id list
still continues. Markers are literal characters, not `\x` escapes, so BSD sed behaves like GNU sed —
the snippet ships to consumers.

**Both motivating artifacts (L-166).**

- SPRINT-094: `PASS wave-computation: T1=0 T2=0 T3=0 T4=0`, no `FAIL cycle-detected` — DoD-1's exact
  criterion. It now also emits **three `FAIL shared-file-unowned`**, which is precisely what TD-132's
  row predicted the corrected behaviour would be. Those are true findings: 094's T1 and T2 shared
  three files with no `Depends-on` edge, managed by D1/D2 prose instead.
- SPRINT-095: `PREFLIGHT: CLEAR`, `T1=0 T2=0 T3=0 T4=1`, `shared-file-owned: scripts/qa-check.sh in
  T3,T4 order=T3->T4`. Per the override entry above, **this** is now the binding preflight result —
  the earlier PASS was derived from invented edges and was explicitly not treated as evidence.

**Harness: 8 cases → 11 (13 assertions), all green.** Three added: prose on the field line, prose on
an indented continuation, and a sibling control where real ids sit in front of prose.

**Seeded-break discrimination proof.** Hash convention, stated once and used throughout:
`git hash-object <path>` on the working file — normalization-aware by construction, so the CRLF trap
L-169 records cannot arise. Every seed was guarded: landed (`cmp` differs), still parses (`sh -n` on
the extracted snippet), and targeted (0-line delta, assertion count 11 unchanged).

| seed | target case | control |
|---|---|---|
| A — field arm reads the raw field | `deps-prose-field` **REDDENED** | `deps-prose-continuation` held green |
| B — continuation arm reads the raw line | `deps-prose-continuation` **REDDENED** | `deps-prose-field` held green |

Each fixture is bound to its own call site, which *proves* DoD-3's "both call sites" instead of
asserting it. `dispatch.md` restored after each seed with `git hash-object` equal to pristine
(`e18acc83`).

**One negative result, recorded rather than smoothed.** A third seed removed the `none`
short-circuit in `dep_ids` and **reddened nothing** — `dep_region` has already truncated
`none — <prose>` to `none`, in which no `T[0-9]+` exists. That arm is therefore defence-in-depth and
is **NOT independently proven**; it is annotated as untested in the code itself rather than counted
as covered (L-142 · L-187). DoD-2 is still met — `none` does short-circuit — but by truncation, not
by the branch one would assume.

**No DoD ticked.** SPRINT-094's T1 review returned 3 HIGH / 3 MEDIUM *inside boxes already ticked*,
minutes after its own seeded-break proof ran clean (L-165, count 5). Ticking waits for the isolated
reviewer.

consequence · T2 · behaviour:material · governance:high

### 2026-09-07 | surprise | T2's isolated review REJECTED the first design — two CRITICAL silent false negatives

The bounded builder retry (one per pass, `review-scoping.md` § The revise loop). The reviewer's
findings were correct and are the reason the first design is gone rather than patched.

**Finding 1 (CRITICAL).** `dep_region` truncated the whole field at the *first* prose marker, and in
this repo's own historical lines that marker belongs to the **first id's own annotation**:

- `docs/sprint/archive/SPRINT-055-wiring-the-standard.md:161` — `Depends-on: T1 (count guard must exist first), T3, T6 (shared files — see D1)` → parsed as `[T1]`; T3 and T6 silently gone.
- `docs/sprint/archive/SPRINT-063-headroom.md:83` — `Depends-on: T2 (subtraction first) · T1 (owns …)` → parsed as `[T2]`; T1 gone.

**This is worse than TD-132.** TD-132 invented an edge and HALTed *loudly*. A dropped edge lets two
genuinely dependent tasks dispatch in the same wave under `PREFLIGHT: CLEAR`, with no finding for a
human or the orchestrator to see — a gate that fails green (L-058). And the trigger is this project's
own house style, not a contrived shape.

**Finding 2 (CRITICAL, independent).** The field arm blanked `cur` whenever the field carried any
prose marker, on the reasoning "if the field explained itself, its continuations are prose too". A
field that annotates its first dependency and **wraps the rest of a real list** therefore lost every
wrapped id. Different trigger, same silent-drop outcome.

**Finding 3 (HIGH)** was the loud face of Finding 1 — a false `shared-file-unowned` HALT on a Plan
whose ownership was correctly declared.

**Second design, and it is a redesign rather than a patch.** `dep_region` is deleted. `dep_ids` now
splits on the separators Plans actually use (`,` and `·`) and takes the **leading id of each item**,
anchored with `^T[0-9]+`. An id inside an item's own annotation is prose and is ignored *by position*,
so there is no marker list to be defeated by a marker it does not know. `cur` is never blanked. The
`none` special case is **deleted** rather than kept-and-annotated: `none — <prose>` is one item
beginning `none`, which yields no id because the anchor does not match — the behaviour is now load-
bearing instead of the dead branch the previous entry recorded as untested.

Verified against the real corpus, not fixtures alone (L-166):

```
SPRINT-055:161 -> [T1,T3,T6]      (first design: [T1])
SPRINT-063:83  -> [T2,T1]         (first design: [T2])
SPRINT-094 T2  -> []              (TD-132's original case, still correct)
SPRINT-095 T4  -> [T3]
```

Two fixtures added for the reviewer's shapes, both asserting a **RANK** rather than absence-of-cycle,
because rank is what distinguishes "the ids parsed" from "the ids vanished and the tasks collapsed
into one wave" — absence of a FAIL proves nothing when the defect *is* silence. Harness 11 → 13
cases. A false claim in my own fixture header was also corrected: it said both separators were
exercised while the file used only commas; a `·`-separated task now makes that true.

**Discrimination proof, second design.** Convention, stated once: `git hash-object` on the working
file. Every seed guarded for landing, parsing, and being targeted (±0 lines, 13 assertions fixed).

| seed | target | control |
|---|---|---|
| A — item anchor removed (`^T[0-9]+` → `T[0-9]+`) | `deps-prose-field` REDDENED | `deps-inline-annotated-list` held |
| B — comma split removed | `deps-inline-annotated-list` REDDENED | `deps-prose-field` held |
| C — `·` normalisation removed | `deps-inline-annotated-list` REDDENED | `deps-prose-continuation` held |

**Four earlier seed attempts failed to land or produced a demolition** — a malformed `sed`, a wrong
line number, and twice an `awk -v` that ate the pipeline's continuation backslash. Every one was
caught by the guards and reported as `DID NOT LAND` / `does not parse — demolition` rather than
scored as a pass. That is L-142/L-187 working exactly as written, and it is worth recording that the
guard fired four times in one task.

**Still unverified, carried forward:** the reviewer could not test the BSD-vs-GNU `sed` portability
claim (no BSD sed available) — flagged as unverified rather than as a finding. The `·`→`,`
normalisation and the `[[:space:]]` class are the portability-sensitive parts.

consequence · T2 · behaviour:material · governance:high

### 2026-09-07 | surprise | round 2 REJECTED design 2 — two more CRITICALs, in the OPPOSITE direction

The revise loop's bounded retry was spent, so this went to the owner (ADR-022), who authorised a
third design pass plus one further review. The reviewer ran this round **non-isolated** — its
worktree was gone and it used the main checkout. It reported no writes, and that was verified rather
than trusted: `dispatch.md` and the harness both hash-matched their committed blobs and no untracked
strays existed. It is still the L-168 risk and should not recur.

**Finding 1 (CRITICAL) — a bare-space id list loses every id after the first.** `Depends-on: T1 T3`
is real and **load-bearing**: `SPRINT-050:111` and `SPRINT-053:107`, whose own D4 reads *"`Depends-on:
T1 T3` gives both files a single owner without guessing — ownership by dependency chain, which the
preflight accepts (TD-025)."* Design 2 split only on `,`/`·`, so it read `[T1]`.

**Finding 2 (CRITICAL) — prose that merely names a task invents an edge.** A continuation opening
`T1-sanctioned …` is live at `SPRINT-066:63-64` (harmless there by luck — it re-adds an id the field
already declared). The dangerous form, reproduced: a `T2-flavoured` clause that says in words *"not a
real dependency"* produced `PASS shared-file-owned` over a genuinely unowned overlap — TD-132's own
failure class, reintroduced by its own fix.

**Design 3, and the two failures pull opposite ways, which is the point.** Design 1 stopped at prose
and so could not step over an annotation; design 2 stepped over annotations and so could not tell
prose from a list. The scan now does both: walk left to right — an **exact** `Tn` token is a
dependency, a **balanced `(…)` group is skipped**, anything else **ends the list**. Whitespace is a
separator, so `T1 T3` is two dependencies; the match is exact, so `T1-sanctioned` and `T2s` are prose;
`none` needs no special case, being simply a token that is neither.

Verified against every shape either round produced — 14 cases, all correct, including
`SPRINT-055:161 → [T1,T3,T6]`, `SPRINT-063:83 → [T2,T1]`, `SPRINT-053:107 → [T1,T3]`,
`SPRINT-066:64 → []`, `none, T2s … → []`. Two fixtures added (15 cases, 17 assertions): a must-PASS
for the space-separated list and a **retained must-FAIL** where prose naming a task must NOT own a
shared file.

**Discrimination proof, and one seed had to be thrown away for being weak.** Convention:
`git hash-object` on the working file.

| seed | target | control |
|---|---|---|
| A — anchor loosened `^Tn$` → `^Tn` | **stayed GREEN — reported untested, not a pass** | — |
| A′ — faithful: leading-id EXTRACTION (design 2's actual behaviour) | `deps-prose-names-task-unowned` REDDENED | space-separated + inline-annotated held |
| B — comma normalisation removed | `deps-inline-annotated-list` REDDENED | `deps-space-separated` held |
| C — annotation-skip removed (becomes a wall) | `deps-inline-annotated-list` REDDENED | `deps-space-separated` held |
| D — whitespace split removed | `deps-space-separated` REDDENED | `deps-prose-field` held |

**Seed A is the instructive one.** It looked like a faithful model of Finding 2 and was not: loosening
the *test* alone makes the code emit the whole token `T2-flavoured`, which is not a valid task id, so
no edge forms and nothing reddens. Design 3 appends the **token**, never an extracted substring — an
extra safety property nobody designed in. A weak seed that reddens nothing is indistinguishable from
a suite that does not discriminate (L-142 · L-187), so it was replaced by A′ rather than counted.
Across this task the seed guards have now fired **five** times: four sed/awk mechanics failures and
one weak seed.

consequence · T2 · behaviour:material · governance:high

### 2026-09-07 | progress | T1 built — and TD-125's stated cause is NOT the operative one

**The debt row is wrong about its own mechanism, measured rather than argued.** TD-125 names
`check-layers-observed.sh:397`'s `*/archive/*` filter on the sibling loop as the cause. Deleting that
line alone changes nothing: with SPRINT-093 archived and 092 active, 092 is blamed for **85**
commit:path pairs both with the filter present and with it deleted. The operative mechanism sits
upstream — `qa-check.sh:1013` hands the checker a **non-recursive** `ls docs/sprint/SPRINT-*.md`, so
an archived sprint never reaches `"$@"` to be filtered in the first place. TASK-298's `assumes:` said
to re-derive rather than inherit, and that instruction is the only reason this was caught.

**Fix.** `sibling_sprints` (active work, archive correctly excluded) is left alone, and a second list
`owning_sprints` is derived from it plus every sprint discovered under the subject sprint's own
`archive/` directory — relative to `dirname "$sp"`, never a hardcoded repo path, so a consumer whose
sprints live elsewhere behaves the same (L-015). The commit skip consumes `owning_sprints`. That is
TD-125's own framing made real: *is this sprint still active work?* and *does it own its commits?* are
two questions and were sharing one list.

**Acceptance on the real 092/093 pair (L-166), identical invocation both legs:**

| | 093 in place | 093 archived alone |
|---|---|---|
| 092 blamed `commit:path` pairs | 3 | **3** (was **85**) |

The four pre-existing TD-107-class FAILs are unchanged, as the restated DoD requires — this task does
not fix those.

**Retained fixture, two assertions on one run**, because widening an exclusion is precisely how a
guard acquires a silent false negative: too broad, and real undeclared work walks through under cover
of "another sprint owns it". A throwaway repo carries two sprints sharing one `plan_commit` window —
SPRINT-092/093's real shape — with one archived. The same output must (a) still FAIL by name on
`scripts/orphan.sh`, which no sprint declares, and (b) not blame `scripts/theirs.sh`, which the
archived sprint owns. A "does it FAIL?" assertion alone cannot see half (b).

**Discrimination proof.** Convention: `git hash-object` on the working file. Seeding the commit skip
back to the active-only list — ±0 lines, 52 assertions unchanged, still parses — **reddens** the
archived-sibling assertion while the orphan control **holds green**. Restored at hash `ffba42d9`.

Not ticked: the isolated reviewer has not run.

consequence · T1 · behaviour:material · governance:high

### 2026-09-07 | surprise | T1's review found a CRITICAL: the fix traded a narrow defect for an unbounded one

**Finding (CRITICAL, reproduced live).** `owning_sprints` unioned in every archived sprint NUMBER
found under `archive/` — 91 in this repo — with no check that the archived sprint had anything to do
with the subject sprint's window. A sprint number reaches this checker only as a *string in a commit
subject*, so that exempted **any commit citing any archived number** from the undeclared-file check,
for every active sprint, forever: a mislabelled, copy-pasted, cherry-picked or evasive subject could
hide real undeclared work behind any of 91 numbers. Demonstrated: an active `SPRINT-200` with an
unrelated archived `SPRINT-001`, and genuinely undeclared 200 work committed as
`sprint(001) T1: mislabeled` — `FAIL` on the parent commit, **`PASS` on mine**.

That is the *"widening an exclusion is how a guard acquires a silent false negative"* risk this task's
own fixture header warns about, and I wrote the warning and then did not bound the code.

**Fix (the revise loop's one bounded retry).** An archived sprint is recorded with its **window**
(`plan_commit`…`close_commit`) and `owns_commit` grants ownership only when the commit lies inside it
(`merge-base --is-ancestor` both ways; reflexive, so the endpoints count). Active siblings are still
skipped on number alone — deliberately asymmetric, because their windows are open and reporting them
would blame one live stream for another's in-flight commits. The reviewer's repro now FAILs correctly.

**A consequence worth stating rather than hiding: 3 of the 91 archived sprints have no resolvable
`close_commit`.** They own nothing under the bounded rule, so their commits are *reported* rather than
exempted. That fails in the loud direction, which is the right one — but TD-125's original symptom
persists for those three, and archiving near their windows will surface findings.

**Acceptance re-run on the real pair after the retry:** 092's blamed pairs are **3 in place, 3
archived** (pre-fix: 3 → 85). **Discrimination:** seeding ownership-by-number-alone reddens the
window fixture while the sibling fixture holds; seeding archived discovery away reddens the sibling
fixture while the window fixture holds. Restored at hash `c051f2bb`.

**A fixture bug found by the new rule, and it is the useful kind.** The original `archived-sibling`
fixture gave its archived sprint a placeholder `plan_commit` and no `close_commit`, so under the
bounded rule it owned nothing and the case went red. The fixture, not the code, was wrong — it had
been passing for the wrong reason. Rebuilt with a real window captured around the commit it owns.

### 2026-09-07 | progress | T2 hardened against round 3's four latent paths

All four shared one root cause: an unrecognised token **ended** the id list and everything after it
was discarded with no signal. Two are now parsed *correctly* rather than warned about — `[…]` counts
as an annotation exactly like `(…)`, and markup is stripped before the id test so `**T1**` and
`` `T1` `` parse as the ids they plainly are. The third, an unclosed annotation, genuinely cannot be
parsed, so it is reported by name (`FAIL depends-on-unreadable`) **before** waves or ownership are
derived from a list already known to be incomplete.

**I shipped that half unwired and caught it here.** The `depsbad` flag was threaded through the
record and *nothing read it* — L-020's exact shape, and precisely the class T3's own unwired-exports
rule exists to detect. Two further self-inflicted defects on the same edit: `awk -v` expanded the
`\t`/`\n` in `flush()` into real characters and split the line (caught by `sh -n`), and a stray
`printf "\t!UNBALANCED"` survived an earlier deletion and injected a **tab** into `deps` — which
shifts every field of a tab-delimited record. Neither was caught by a test; both by reading output.

Harness 15 → 18 cases / 20 assertions. Discrimination: seeding away bracket-counting, the markup
strip, and the unbalanced report each reddens only its own fixture with a control green.

consequence · T1 · behaviour:material · governance:high
consequence · T2 · behaviour:material · governance:high

### 2026-09-07 | surprise | T2 round 4 REJECTED — and one CRITICAL was created by round 3's hardening

**Finding 1 (CRITICAL) — markup stripping FABRICATED an id.** `gsub(/[`*]/, "", t)` was global, so
`*T1*3` welded into `T13` — a real task in the fixture — and the parser reported a dependency nobody
declared, turning a genuinely unowned overlap into `PASS shared-file-owned`. A silent false PASS,
which by this repo's own doctrine is worse than the loud HALT it replaced. **That is the TD-132
failure class reintroduced by the TD-132 fix, for the second time in this task.** Now only *wrapping*
markup is stripped (`^[`*]+` and `[`*]+$`), so `*T1*3` keeps its interior marker, fails the exact-id
test, and reads as prose.

**Finding 2 (CRITICAL) — a fifth silent-drop path, after the round that claimed to have closed them
all.** A token carrying a CLOSE with no OPEN (`1)`, an ordinal) has `o == 0`, so it never enters
depth-tracking; `depth` stays 0 and the end-of-line unbalanced check **structurally cannot fire**.
`Depends-on: T1 1) T2` silently lost T2 with `PREFLIGHT: CLEAR` and exit 0. Such a token is now
reported as unreadable rather than treated as prose.

**Finding 3 (HIGH, L-186) — the coverage matrix was half empty.** All three round-3 hardening
fixtures put their trigger on the *field* line; none exercised the indented-continuation arm — the
exact seam this parser's own history says a field-only fix leaks through. 3 mechanisms × 2 call
sites, 3 of 6 cells populated. The reviewer probed all three manually and they behave correctly, so
it was an unproven duplicate path rather than a live bug. Three fixtures added; the matrix is full.

Round 4's corpus re-sweep was clean: all 62 markup-bearing real `Depends-on:` lines are unaffected,
and the other 188 contain none of the characters this change touches.

**A self-inflicted defect worth recording, because `sh -n` did not catch it.** My own comment for the
markup fix contained the words *"TD-132's own fix"* — an **apostrophe inside the single-quoted awk
program**, which terminated it early. The snippet still passed `sh -n`; awk received a truncated
program and every call returned empty. Only running it revealed the truncation. Comments inside that
awk block cannot contain apostrophes, and nothing checks for it.

Harness 18 → 23 cases / 25 assertions. **Discrimination:** reverting the markup strip to global
reddens the welding fixture while the legitimate wrapped-id fixture holds green — the pair
distinguishes correct behaviour from the bug rather than merely coexisting with the fix; and
un-flagging close-without-open reddens its fixture while the unbalanced fixture holds.

consequence · T2 · behaviour:material · governance:high

### 2026-09-07 | scope-change | T1 design 3 — ownership by DECLARATION, the proxy removed rather than narrowed

**What broke:** the re-review found a CRITICAL in the window-bounded design. Windows legitimately
NEST here — `SPRINT-089` (`5f0682b`..`cc46d18`) and `SPRINT-090` (`b7437de`..`cc46d18`) share a close
commit, 090 having been seeded inside 089's own task stream, so 090's whole window sits within 089's.
A commit doing real undeclared work for a later sprint but mislabelled `sprint(089)` falls inside
that overlap and was exempted. It has not bitten only because `cc46d18` happens to precede 092's
`plan_commit` — timing, not a guarantee.

**Impact and re-confirm G2:** owner-authorised (the revise loop was spent). Scope is unchanged — T1
still makes an archived sprint keep owning its own commits — but the *mechanism* changes for the
third time, so the Plan's T1 text and `TASK-298` both still describe the discarded approach.

**The through-line across all three designs.** Designs 1 and 2 both asked *"does this commit's
subject cite a sprint I should trust?"* — first by number (91 numbers, unconditional), then by number
plus window. **A commit subject is an unverifiable claim, so every refinement of it is another
proxy**, and each was broken in turn. Design 3 asks the question the guard actually cares about:
*did that sprint DECLARE the paths this commit touches?* A mislabelled commit touching a file the
cited sprint never declared **is** undeclared work — precisely what this checker exists to report.
No window is consulted, so the three archived sprints with unresolvable shas stop being a special
case and nested windows become irrelevant. Both sides parse declarations with the same `task_decls`,
because a second parser would let them disagree about what a declaration is.

Verified both directions on the reviewer's own nested shape: the mislabelled commit is reported, and
a genuine `sprint(089)` commit touching a file 089 *did* declare is correctly owned. Acceptance on
the real pair holds: 092's blamed pairs **3 in place, 3 archived**. Discrimination: ownership-on-the-
number-alone reddens the window fixture while the sibling holds; archived-sprints-own-nothing reddens
the sibling while the window holds. Restored at `e9097c0b`.

### 2026-09-07 | surprise | FOUR fixture defects in one case, every one presenting as the same red line

The `archived-sibling` case went red four times for four unrelated reasons, none of them the code
under test:

1. the archived sprint carried a placeholder `plan_commit` and no `close_commit`, so under the
   window design it owned nothing;
2. its `Layers:` was written as a bare path, and `task_decls` extracts only **backticked** tokens, so
   it declared nothing;
3. backticks added — but inside an **unquoted heredoc** (it interpolates commit shas), where they
   are command substitution, so the line evaluated to empty;
4. repairing that with a line-numbered `awk NR==n` edit landed on the **wrong line** (numbers had
   shifted under earlier edits in the same session), overwriting the `## Plan` heading and leaving
   the real `Layers:` empty.

**Every one produced an identical assertion failure**, and `sh -n` passed each time because the
result was still valid shell. What separated "the code is wrong" from "the fixture is wrong" was a
trace run *outside* the harness against a hand-built repo — the harness itself cannot distinguish
them, because both yield the same red line.

**And the sibling `archived-window` fixture was silently GREEN for reason 2 the whole time** — its
archived sprint declared nothing either, so its FAIL proved nothing about ownership. It would have
shipped as a retained fixture testing air. That is `L-186` reproduced inside the sprint that keeps
citing it: fixtures discriminate a guard's branches, and nothing was discriminating the set of inputs
those branches ran over.

**Learning candidate for the Retro:** a red assertion says *something* disagrees; it never says
whether the code or the fixture is wrong, and a fixture is code. When a fixture fails, reproduce the
scenario outside the harness before touching the subject. Corollary, earned four times today: never
edit by line number a file whose line numbers have shifted under earlier edits in the same session.

consequence · T1 · behaviour:material · governance:high

### 2026-09-07 | progress | T2 round 5 CLEAN — 7 of 7 DoD ticked; T1 stays at 0 of 6

**T2 ticks.** Round 5 found no CRITICAL. The round-4 welding fix held against every fabrication
attempt (`` *`T1`* ``, `T1**`, `***T1***`, `**T1**,`, digit-adjacency variants); the 250-line corpus
re-swept clean; the 4th record field cannot carry a tab or a stray `!` by character class; no quoting
hazard remains; and the reviewer **ran** the extracted snippet rather than only parsing it — the
distinction that caught the apostrophe defect two rounds ago.

Three residual findings, all latent, none in the corpus, filed rather than fixed: `TD-139` (trailing
punctuation after markup defeats the anchor — fails in the SAFE direction, a false HALT) and
`TD-140` (a token netting negative is absorbed without the unreadable flag — suppresses a diagnostic,
corrupts no verdict). The third was a coverage gap and was closed here rather than filed: two
continuation-arm fixtures added, so the 3×2 mechanism×call-site matrix is complete at **25 cases /
27 assertions**.

Five rounds, four rejections, **6 CRITICALs** — every one found by review, none by the seeded proofs
that had just run clean before each.

**T1 does not tick, and the reason is structural rather than a fourth bug.** Its final review found
the hole this session predicted: the declaration test is necessary but not sufficient, because
declarations are SHARED — `docs/LEARNINGS.md` is declared by **74 of 91** archived sprints,
`scripts/qa-check.sh` by 46. A commit citing any of those numbers while touching only a commonly-
declared file is exempted, reproduced live twice.

**The finding that outlasts the sprint (`TD-141`, `high`): the laundering channel is PRE-EXISTING and
T1 did not introduce it.** The active-sibling skip trusts the cited number alone, with no declaration
or window test, and has done so since before this sprint — verified against `2335eab~1`. A commit
mislabelled `sprint(093)` while 093 is active is already exempt from 092's check today. So T1's three
designs were each held to a bar the surrounding code never met.

Three designs, three proxies for one unanswerable question — *which sprint does this commit belong
to?* A commit subject is an **unverifiable claim**, so every refinement of it is another proxy:

| design | proxy | broken by |
|---|---|---|
| 1 | cited number | 91 numbers, unconditional |
| 2 | number + window | windows nest — SPRINT-089/090, real |
| 3 | number + declarations | declarations shared — 74/91 declare `LEARNINGS.md` |

`TASK-298` is scoped as "teach the checker that an archived sibling is not undeclared work", and on
this evidence that is not reachable by refining the proxy. Re-scope before a fourth attempt. The
tension is real and belongs to the owner: report archived-cited commits and you get TD-125's false
positives on archival; skip them and you get the channel. The existing code chose the second for
active siblings without saying so.

**Filed at this point rather than at close, because the sprint stops here:** `TD-141` (the structural
one) · `TD-138` (a column-0 `Layers:` continuation is silently dropped, so the ownership map is built
from first lines only — found when a PASS line vanished between two runs) · `TD-139` · `TD-140`.
Ledger 77 → 81 rows, 74 open + 7 not-open, reconciled.

consequence · T1 · behaviour:material · governance:high
consequence · T2 · behaviour:material · governance:high

### 2026-09-07 | close | closed early at 7 of 27 DoD; the close could not verify itself

Sprint closed by owner decision. `close_commit: 9782860`. Buckets routed to CHANGELOG / `TD-138`–
`TD-141` / `TASK-331`–`332` / `L-189`–`L-190`, with `L-165` → 6 and `L-186` → 2 (**promotable at the
next promote**). §11 retention stays parked; TD-125's blocker is NOT cleared because T1 did not ship.

**The close ran its gate and got nothing.** The opt-in profile (`QA_FULL=1`) was killed by a 590 s
external cap with no verdict line reaching the launcher — one more instance of `TD-128`'s own claim
that this gate cannot be sampled whole on this host. Recorded on that row as evidence rather than
implied away, and the close explicitly does not rest on a green gate.

**And the launch itself was flawed, which changes what the run proves.** It piped the gate into
`tail -40`; `tail` buffers to EOF, so nothing was flushed when the cap fired. The run therefore shows
only that *the cap was hit* — it does **not** establish that the gate printed nothing. That is
CLAUDE.md edit-safety trap (c) / `L-057`, committed by me while verifying a sprint whose entire
subject is guards that misreport, and after quoting the rule earlier in this same log. Noted on
TD-128 so the next measurement runs the gate bare and tees it.

consequence · close · behaviour:low · governance:high
