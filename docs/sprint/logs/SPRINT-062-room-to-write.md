---
sprint: 062
slug: room-to-write
owner: Maintainer
last_updated: 2026-08-10
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-062 — Execution Log

> Append-only companion to [`../SPRINT-062-room-to-write.md`](../SPRINT-062-room-to-write.md). Uncapped by design:
> this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (DOCS_Guide §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.

### 2026-08-10 | promote | Batch G1 + G2 signed over the three-task Plan
Both gates run as one pass and signed by the owner; recorded as `gates_signed: G1,G2 @ 19485be` in
the Plan frontmatter. No task took G1's fast-path — all three are `origin: close-retro` and never met
the intake grill.

**Overlap map (G2).** Two shared files, both forcing sequence: `skills/lean-doc-generator/references/DOCS_Guide.md`
is touched by **T1 (§2)** and **T2 (§10/§11)**; `docs/LEARNINGS.md` by **T1** (L-106 promotion) and
**T3** (§11 verification). The Plan's D4 named only the second. **Order: T1 → T2 → T3, strictly
sequential, per-hunk staging on both shared files** (`git add -p` + verify `git diff --cached`) — no
parallel dispatch, no worktree isolation. All three are `class: decision`, so they execute inline
rather than dispatching to a sub-agent; that is the stated reason the dispatch rule requires.

**Design rulings taken at G2:** T1 splits per §6 following ADR-014's precedent (capped decision doc +
append-only measurement sibling) rather than raising the §2 cap · T2 sources the doc-aging checklist
line from `check-doc-caps.sh` output rather than extending a hand-maintained enumeration.

### 2026-08-10 | surprise | A1 and A3 both resolved at the gate, and A3 inverted its task
Both unconfirmed assumptions blocked G2 and both were *facts*, so they were resolved by investigation
rather than asked.

**A1 confirmed** — `qa-gate-timing.md` (223/120) is three stacked measurement rounds (original
research · SPRINT-060 T3 · SPRINT-061 T3), each with its own Findings and Recommendation. Longitudinal
accretion by design, not drift; nothing removable without deleting a measurement. L-106's tell, exactly.

**A3 resolved, and it invalidates T3's premise** — the corpus is healthy. All 30 `status: promoted`
entries carry a collapsed pointer. `promoted: yes` is never the stored form: §11's collapse rewrites
it to `[status: promoted]` plus a `L-NNN → promoted: <where>` line, so the "91 entries, zero
`promoted: yes`" that generated TASK-194 is a **matcher artifact**, not a governance defect.

**Three matcher failures on this corpus in one session**, which is L-108's own thesis playing out
live: (1) the `grep -c "promoted: yes"` that generated the task; (2) an `awk` pass whose escaping was
broken, reporting 29 of 30 entries as missing a pointer — contradicted by a count taken minutes
earlier, which is the only reason it was caught; (3) a fixed-string search for `**L-NNN → promoted:`
that reported L-058 as the one gap, when L-058 is correctly collapsed and merely lacks the bold
markers the other 29 use. Each search was anchored to a substring rather than a position, and each
failed **green** — the false positive on a substring is a false negative on the contract.

### 2026-08-10 | scope-change | T3's criterion went stale before execution (owner-ruled)
**What broke.** T3's Acceptance and DoD were frozen at promote on the premise that the zero count had
two live readings, one of them a governance defect whose evidence pruning would destroy. A3 settled
that at the gate: there is no defect, and the §11 pass T3 was sized to perform has nothing to act on.

**Impact.** T3 drops **M → S**. Four of its five DoD lines were written against the defect branch:
filing a `TD-NNN`, applying §11's collapse on that basis, and reporting a line delta all become no-ops
against a corpus already collapsed. What remains real is recording the finding, normalising L-058's
formatting so the corpus stops generating false matches, and filing the matcher lesson.

**Re-confirm G2.** Owner ruled at the G2 sign-off: log the scope-change and shrink T3 to what is real,
rather than executing DoD lines that close as no-ops. § Plan is edited only after this entry lands.

### 2026-08-10 | complete | T1 — cap ruled by split; L-106 promoted to DOCS_Guide §2
`qa-gate-timing.md` split per §6 on ADR-014's precedent: the decision doc keeps the standing verdict
at **223 → 82** lines, and the three measurement rounds move verbatim to an append-only
`docs/research/logs/qa-gate-timing.md` (205 lines, uncapped). A `research/logs/<slug>.md` row was added
to §2 with cap `append-only`.

**The mechanism was verified before it was relied on, not after.** `check-doc-caps.sh` derives its
globs from §2's own File cells, and `ls -d docs/research/*.md` is non-recursive — so a `logs/` sibling
is excluded for free, while a same-directory `-log.md` suffix would have been capped at 120 and
schema-checked as a decision doc. That is precisely the mechanism ADR-014 relies on for sprint logs;
this is its first application outside `docs/sprint/`. Confirmed by reading the checker's derivation
loop, then by the run: `qa-gate-timing.md` is off the report and **no new breach appeared**.

**L-106 promoted → `DOCS_Guide.md` §2 Growth rule**, entry collapsed per §11 (LEARNINGS 718 → 698,
91 entries intact). Placement by §10's test: the flows that can author or trip a cap are §2
cap-authoring, checker-authoring, and ruling a breach at promote — three different skills, so no single
skill red-flag reaches them all, and all three arrive at the Growth rule paragraph, which is the
standard's own instruction for what to do at a cap. `CLAUDE.md` at 80/80 was not an option. The rule
now sorts a breach into **drift** (trim/split) vs **a cap that was never reachable** (mandated content,
or an append-only series) — because the report cannot tell them apart and they need opposite actions.

**Retrieval miss found while verifying DoD line 2 (§10 Retrieval check).** TASK-192's `assumes:` calls
`graph-engineering.md` (122) and `loop-hygiene-prd.md` (139) "ordinary drift and a different question".
L-106's own body records the opposite for the first — "no movable section and no whitespace slack" —
and states that **both had been carried as 'drift' for sprints**, which is the mislabelling L-106
exists to correct. The task text inherited the error it was filed to fix. T1's scope is unchanged (the
two stay out), but the *reason* is scope, not a settled diagnosis; recorded in the decision doc's
§ Out of scope so the next owner re-sorts them against the new rule instead of inheriting "drift".

### 2026-08-10 | complete | T2 — doc-aging now reads two sources; §2 owns caps, §11 owns retention
**The ownership question has a clean answer, and it is not "add a line".** §11's ledger is a
*retention* table — what gets archived, pruned or collapsed. **Caps belong to §2.** The two are
different questions needing different actions: a retention trigger is applied, a cap breach is *ruled*
(trim · split · restate the number, per §2's Growth rule).

**Why exactly one cap was reaching the checklist.** §11's table carries a `TODO.md > ~150 lines` row —
a cap wearing a retention row's clothes, listed there for its prune action. The governance checklist
enumerated §11's triggers, so it inherited that one cap and none of §2's other ~40. Not an oversight in
the enumeration: the enumeration was the wrong *source*.

**Fix.** The doc-aging line now reads `§11 retention + every §2 cap breach`, sourced from the project's
own cap check where it has one and otherwise measured directly against §2's table — with an explicit
prohibition on restating a §2 cap figure inside the checklist, since a copied number is a second SSOT
that drifts from the row it copied. Wired in both places the promote flow actually reads:
`lean-doc-generator/SKILL.md` § Governance review (the emitted checklist) and `DOCS_Guide` §10 Promote
review + §11 When-it-runs.

**Exercised on must-FAIL input, and the discriminating case matters.** `TODO.md` was never the test —
it has a §11 row and was already visible. The docs with **no** §11 row are `graph-engineering.md` (122)
and `loop-hygiene-prd.md` (139): previously invisible to this review by construction. Running the new
two-source procedure against the live repo names all three, each with its doc and figure, on the same
input that made SPRINT-061's promote scan report doc-aging **clean**. Source A (§11 triggers) still
reports — nothing that was caught stopped being caught.

**Honest gap, not ticked as covered.** L-058's full bar wants a *retained* must-FAIL fixture per check.
The checker underneath (`check-doc-caps.sh`) already has one; what T2 changed is procedural text in a
skill, and this repo has no harness that exercises skill prose. The exercise above is a real live
before/after on failing input, which is what T2's DoD asks for — but it is not a fixture, and nothing
will catch a future edit that quietly re-narrows this line. Raised for the Retro.

**Consumer check (L-015).** No repo-specific path entered either surface — the wording is "the
project's own cap check where it has one, otherwise measured against §2's table", so a consumer with
no checker still has a defined procedure. Verified by diffing `skills/` for `scripts/` · `qa-check` ·
`check-doc-caps` · `knowledge-index`: zero hits. `SKILL.md` 124 → 125 lines, inside its ~140 cap.

### 2026-08-10 | complete | T3 — the trigger consumes itself; corpus normalised; L-108 at count 4
Executed at its rescoped size. Three things landed.

**§11's LEARNINGS row now states the trap.** The collapse *consumes the trigger it fires on*: a
promoted entry becomes `[status: promoted]` + a pointer, so `promoted: yes` is never the stored form
and grepping for it returns zero on a perfectly healthy corpus. The row now says to count by
`[status: promoted]`, position-anchored, and that a zero here is evidence about the query rather than
the corpus. Placed there rather than in the sprint log because §11's row is what someone checking
promotion state actually reads (§10 placement test).

**L-058 normalised.** It was the only one of the promoted entries written without the bold pointer
wrapper — the reason a fixed-string search over the corpus named it as a gap when it was correctly
collapsed. Verification now agrees with itself: position-anchored `[status: promoted]` = **31**,
canonical pointer lines = **31**, 91 entries intact, neighbours L-057/L-059 unfused. (31 rather than
30 because T1 collapsed L-106 earlier this sprint.)

**L-108 bumped to count 4, and the sighting says something the first three did not.** The rule was
already promoted into `CONTEXT.md` § Gates *and in context for this entire session* — and it reached
none of the three failures anyway. The placement enumeration is what missed: it names checker
authoring · the reaper · close-time log sweeps · fixture naming and symptom greps, while every failure
here was an **ad-hoc verification grep during a governance/gate pass** — a flow not on the list, and
the one where a wrong answer gets acted on immediately. A rule placed where its category is *discussed*
can still miss the moment that category is being *exercised*. That is L-099's shape one level in, and
it is the sprint's most transferable finding.
