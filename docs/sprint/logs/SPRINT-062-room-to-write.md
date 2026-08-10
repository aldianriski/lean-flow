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
