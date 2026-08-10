---
sprint: 058
slug: measure-before-moving
owner: Maintainer
last_updated: 2026-08-10
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-058 — Execution Log

> Append-only companion to [`../SPRINT-058-measure-before-moving.md`](../SPRINT-058-measure-before-moving.md).
> Uncapped by design: this file grows with the work done, which is exactly why it is not inside the
> Plan's 400-line budget (DOCS_Guide §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.

<!-- Newest entries at the BOTTOM: this reads as a chronology, unlike CHANGELOG.md which is
     newest-first. Event is one of: promote · progress · surprise · scope-change · park · blocker ·
     complete · close. -->

### 2026-08-10 | promote | Plan locked at 26fe6a0; governance applied at promote rather than deferred
L-105 promoted → `.claude/CONTEXT.md` § Gates (§11 body collapse); TD-037 re-scoped and held on a
corrected basis; CHANGELOG rotated 181 → 94 lines. Two tasks pulled: T1 (TASK-177, cap breaches),
T2 (TASK-178, gate timing). Both `origin: close-retro`, so neither took G1's fast-path.

### 2026-08-10 | progress | G1/G2 signed at 4ff33a7; preflight CLEAR and proven, not assumed
Pre-dispatch preflight reported `PREFLIGHT: CLEAR` with T1=0 T2=0 and no shared-file line. Silence
from the ownership check is also what a parser reading zero tokens prints (TD-040 shipped exactly
that twice), so the verdict was tested rather than trusted: a fixture injecting `AGENTS.md` into T2's
`Layers:` produced `FAIL shared-file-unowned: AGENTS.md in T1 and T2`. The parser reads both
declarations; the CLEAR is genuine. T2's measurement half dispatched to a Sonnet subagent
(measurement-only brief, no repo writes); T1 run inline.

### 2026-08-10 | progress | G1 caught a route the frozen Plan had not declared
T1's DoD offers a cap-move-by-ADR route, and that route edits `DOCS_Guide.md` §2 — which T1 declared
on `Cites:` (read, not touched). The gap originates upstream in TASK-177's own `touches:` line, which
named `docs/adr/` and never §2's home. Owner ruled: keep both routes, log a `scope-change` and
correct `Layers:` before the first §2 edit. Not yet triggered — no §2 edit has been made.

### 2026-08-10 | progress | T1 — two docs dieted by splitting whole sections (§7), nothing compressed
`loop-hygiene-prd.md` 214 → **118**: `## Implementation Decisions` (W0–W6) → `loop-hygiene-workstreams.md`,
`## Appendix — Findings register` → `loop-hygiene-findings.md`, both verbatim, parent keeps a pointer
line where each section stood. `graphify-daily-value.md` 157 → **107**: the 2026-07-29 reference run and
the consumer-path rules → `graphify-reference-run.md` (they travel together — the cost model is derived
from the run). Flat siblings with full ADR-009 frontmatter, per SPRINT-054 T4's precedent. The cap
checker now prints `back under cap: DELETE its grandfather row` for both — the per-row output signal,
read instead of the exit status (L-103).

### 2026-08-10 | surprise | the archive route was checked first and is closed for all three
Before dieting, all three research docs were tested against §11's archive trigger, since a verdict a
decision was built on should be `superseded` and archived rather than trimmed. All three are
`status: current` **and** all three have live citers (`.claude/CONTEXT.md`, `README.md`,
`docs/research/architecture-baselines.md`), so §11's "superseded **and** nothing live cites it" fails
on both halves. Route closed on evidence; the DoD's two routes are the only ones. Recorded because the
next reader will have the same idea.

### 2026-08-10 | surprise | `loop-hygiene-prd.md` carries a banner that is false
Its header says *"Review-first — nothing here has been applied."* Every workstream in it has since
shipped — the tombstone lint, the README-footer check, `gen-index.sh` stamping its own `last_updated`,
monotonic `L-NNN` ids, the promote governance checklist, bug intake, promote's `state: ready` filter,
prime's `/triage` branch, G1's fast-path, ADR-009 metadata on the ADR/RESEARCH templates. The doc's
own `status:` should almost certainly be `superseded` (a decision was built on it), though §11 would
still hold it in place given its live citers. **Not changed here** — re-statusing a doc has retention
consequences and is a ruling, not a side effect of a diet (CLAUDE.md: clean up only your own mess,
mention the rest). Raised for the owner.

### 2026-08-10 | blocker | the remaining two breaches are not documentation problems
`graph-engineering.md` is 122 against a **120 soft** cap and `AGENTS.md` is 11 against **~10** — both
caps written approximate in §2, both enforced by the checker as exact integers. Neither can take the
diet route honestly: `AGENTS.md` is 9 lines of content plus a 2-line mandatory ownership footer with
nothing removable, and `graph-engineering.md` has no whole section to move (Findings is 62 of its 122
lines; moving it guts the doc) and no whitespace slack — no consecutive blanks, no trailing blank.
Re-wrapping its prose would drop two physical lines without changing a word, which is metric-gaming,
not a diet. Deleting their grandfather rows would leave the soft-cap branch still reporting them but
would forfeit the growth ratchet, so that is a weakening dressed as a completion (L-088). The honest
remaining route is the ADR one. Halted for the owner's ruling per first-blocker.

### 2026-08-10 | scope-change | T1 takes the ADR route; `Layers:` corrected before the §2 edit
**What broke.** T1's Plan declared `DOCS_Guide.md` on `Cites:` (read, not touched). The owner's rulings
send both remaining breaches through §2: `AGENTS.md`'s `~10` becomes a real `12`, and soft-cap breaches
stop being recorded in the grandfather file. Both edit §2. The Plan also could not name the three
sibling docs the diet created, because they did not exist when it was frozen (L-100 — a `Layers:`
declaration is live, corrected per task, not a prediction to defend).
**Impact.** `docs/research/loop-hygiene-workstreams.md`, `docs/research/loop-hygiene-findings.md`,
`docs/research/graphify-reference-run.md`, `skills/lean-doc-generator/references/DOCS_Guide.md` and
`docs/knowledge-index.md` (regenerated, derived) join T1's `Layers:`; `DOCS_Guide.md` leaves `Cites:`.
No new task, no change to T1's Acceptance — the same two routes the frozen DoD named.
**Re-confirm G2.** Ownership unchanged: T2 touches none of these, so the disjoint finding still holds
and no `git add -p` serialization is needed. G1's size stays M.

### 2026-08-10 | complete | T1 — grandfather file empty, by three routes not two
All four rows cleared; `scripts/lib/doc-caps-grandfathered.txt` holds zero data rows. Verified by the
checker's own per-row output, not its exit status (L-103): `PASS cap AGENTS.md (11 <= 12)`, all three
diet results PASS, and `OVER-CAP (soft): docs/research/graph-engineering.md (122 > 120) -- prune at the
next promote governance review (§11)`. Gate 129 pass / 0 fail, with `layers observed` reporting
**1 sprint file verified** rather than 0 — the zero-verified PASS is the TD-042 shape and was checked
for, not assumed.

**A DoD the execution invalidated, ruled rather than reinterpreted (L-088).** T1's second DoD row
offered two routes for the research docs: under 120, or the cap moved by ADR. `graph-engineering.md`
took **neither** — it is still 122, and the research cap is still 120. It left by a third route the
frozen DoD did not contain: ADR-015 rule 2, soft-cap breaches are not grandfathered at all. That route
was named explicitly in the popup the owner ruled on, so it is a decision, not a re-reading of the
words to fit what was built. Recorded here because the DoD row and the artifact genuinely disagree,
and the disagreement is the thing worth being able to find later.

**Filed:** ADR-015 (cap precision + grandfathering) · TASK-179 (the guard ADR-015 names as missing —
its rule 2 is prose today, and a rule with no matcher is exactly what this repo's own loop-hygiene PRD
was written about). `loop-hygiene-prd.md`'s false "nothing here has been applied" banner corrected;
its `status:` deliberately left `current` per the owner's ruling — a records decision, separable from
this task.

### 2026-08-10 | complete | T2 — the measurement killed TD-046's proposed cure
Full bare run 133.9s / 127.7s across two samples. The 14 always-on harnesses (read from
`eval_harnesses_always`, not assumed — TD-046 recorded twelve) sum to 45.9s / 42.3s, **~34%**. The
inline checks, sections 1–11, are **~66%** and have never been measured by anyone. So the proposed
lever — move harnesses behind `QA_FULL=1` — buys at most a third of the gate, and the three harnesses
that dominate it (layers-completeness 18.2/14.8, dispatch-preflight 9.3/8.9, doc-caps 8.3/8.2) are the
highest-value suites in the set.

The specific suspicion fared worse. "Several harnesses re-run their checker over the entire live repo"
is **two of fourteen**, costing ~10s together — and both are deliberate zero-coverage guards whose live
input is the entire point: `run-doc-caps-fixtures.sh` case 6 ("a PASS over an empty input set … the
L-058 family in its purest form") and `run-manifest-lockstep-fixtures.sh` case 4, which exists because
that checker's first live run matched nothing at all (L-102). They are the last things to cheapen.

Both claims were re-verified from the fixture sources directly rather than accepted from the
measurement agent's report — an agent's summary is evidence about the reporter, not the artifact
(Edit-safety trap (c)). Its raw table is scratch; `docs/research/qa-gate-timing.md` is the durable
record. "No harness edited" was likewise checked mechanically, not asserted: `git diff --stat`
against `plan_commit` over `scripts/qa-check.sh` and `evals/` is empty.

Dispatch note for the cost series: T2's measurement half ran on a briefed Sonnet subagent (~85k tokens,
29 tool calls, ~11.6 min wall-clock) while T1 ran inline on the session model. The split held — the
agent returned numbers and source citations and made no rulings, which is what the brief asked for.
