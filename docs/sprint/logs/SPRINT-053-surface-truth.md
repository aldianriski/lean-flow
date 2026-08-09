---
sprint: 053
slug: surface-truth
owner: Maintainer
last_updated: 2026-08-09
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-053 — Execution Log

> Append-only companion to [`../SPRINT-053-surface-truth.md`](../SPRINT-053-surface-truth.md). Uncapped by design:
> this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (DOCS_Guide §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.

<!-- Newest entries at the BOTTOM: this reads as a chronology, unlike CHANGELOG.md which is
     newest-first. Event is one of: promote · progress · surprise · scope-change · park · blocker ·
     complete · close. -->

### 2026-08-09 | progress | G2 confirmed A1 and A2 from source; preflight CLEAR at current HEAD
A1 holds and more cheaply than assumed: `init.md` step 1 already detects stack, DB and auth, and step 3
already runs the pattern the fix needs — "substrate-conditional rows fire automatically when detected
(confirmed, not asked)". Extending it to the base table is a condition column plus reuse, so T1 stays M
and does not split on that axis. A2 holds: L-094's deferring flows are `/triage` (setting `needs-info`),
promote (TD re-review), close (routing a follow-up), research scans, and `.out-of-scope/` revisit-ifs —
no single skill covers them, so `.claude/CONTEXT.md` (123/130) is the nameable home and `CLAUDE.md`
needs no displacement. A3 already carries its evidence from the promote. Preflight re-run against the
moved base: CLEAR, `T1=0 T2=0 T3=0 T4=1`, `.claude/CONTEXT.md` owned T3→T4.

### 2026-08-09 | scope-change | T1's premise was falsified by its own confirm step; narrowed by owner ruling
**What broke.** T1's `done-when` asserted that a docs-only repo should receive **no deployment guides**.
Reading `init.md` to confirm A1 showed lean-flow itself is a docs-only repo that legitimately *has*
both deployment guides — it publishes a plugin, and those docs own the push/deploy steps
`/release-patch` deliberately stops short of. So "docs-only" is the wrong axis entirely; the real
conditions are independent and per-substrate: *has code* · *publishes an artifact* · *has DB* · *has
auth*. Checking all 18 base rows also showed T1's second half was mis-sized: lean-flow misses 7, but
only 2 (`coding-standards`, `testing-guide`) are substrate-gateable. The other 5 — `CONTRIBUTING.md`,
`SECURITY.md`, `AGENTS.md`, `product/requirements.md`, `product/acceptance-criteria.md`,
`development/setup.md` — have no substrate excuse; they are simply absent, and creating them is a
sprint of its own, not an exemption ruling.

**Impact.** T1 keeps the mechanism (per-substrate conditions on the genuinely conditional rows, the §6
wording, the consumer trace) and **drops** "lean-flow's own absent base docs resolved", which leaves
with it the `docs/product/requirements.md` layer. T2, T3 and T4 are untouched; waves and ownership are
unchanged, so no re-run of the preflight is required beyond the CLEAR above.

**Re-confirm G2.** Owner ruled *narrow to the mechanism* rather than split T1 or widen it across all 18
rows. The dropped half is filed as TASK-165 in the Backlog with the six named docs, so it is deferred
with a record rather than lost. This is L-088's rule applied in its intended direction: the criterion
went stale while the scope held, so it was ruled on rather than quietly re-read to fit.

### 2026-08-09 | complete | T1 — four base rows gated on two substrates; the rule reproduces our own doc set
Four rows now carry a condition: `coding-standards` + `testing-guide` on **has code**, and both
deployment guides on **publishes an artifact** — deliberately independent axes, because a markdown
plugin publishes without holding a line of application code. The other 14 stay unconditional: they
describe the *project* (why it exists, its shape, the way in, a security contact), which a docs repo
has as much as a service does. Skips are reported with the condition that caused them, so an absent
doc reads as a decision rather than a miss.

**Consumer check (L-015 · L-016 corollary — traced, since this repo cannot run `init` on itself).**
A markdown notes repo with no manifest, no source outside `docs/`, no Dockerfile or deploy config:
step 1 detects `has code = false`, `publishes = false`, no DB, no auth → 14 docs scaffolded, 4 skipped
by name. Before this change it received 18, four of them describing substrate that does not exist.

**The stronger check is the second trace: run the new rule against lean-flow and it reproduces our
actual doc set on both axes.** `has code = false` (no language manifest, no source outside `docs/`)
→ `coding-standards` + `testing-guide` skipped, and we genuinely have neither. `publishes = true`
(`.claude-plugin/plugin.json` carries a version) → both deployment guides scaffolded, and we genuinely
have both, correctly. The rule that would have been wrong is the one T1 shipped with before the
scope-change — "docs-only ⇒ no deployment guides" — which would have predicted our own deployment docs
out of existence. It also predicts we *should* hold `CONTRIBUTING`/`SECURITY`/`AGENTS`/`product/*`,
which we do not: that is TASK-165, and the consistency is the point.

### 2026-08-09 | complete | T2 — both completeness FAILs now name the escape, and the hint is guarded
**Mitigation re-derived first (L-091), and it came out cheaper than TD-039 assumed.** Two checks:
*is the message where an author looks?* — yes, evidenced at this sprint's own promote, where the FAIL
was the only thing standing between the author and the wrong fix. *Does naming an escape invite
silencing the gate?* — no, and the reason is not the contradiction check: that only catches a token
declared in **both** lines. The real guard is `check-layers-observed.sh`, which reads git history, so a
file falsely escaped as "merely cited" and then actually edited is caught by the observed leg. The
text-reading checker says as much in its own comments; the escape is safe because a *different* leg
answers the question this one cannot.

Wording states the condition rather than the remedy — "if the prose only cites it rather than touching
it" — so it reads as a test to apply, not an instruction to quieten the gate.

**The fixtures now assert the hint.** They match substrings *anywhere*, so appending was
fixture-compatible without edits — which is precisely why the hint had to be added to the expectations
deliberately: an unasserted hint is one edit from vanishing with nothing going red (TD-012).

**L-090 pair, adapted.** L-090's red-on-new/green-on-old proves a *detection* change; here detection is
untouched and the message grew, so the meaningful pair is whether the new expectation discriminates.
Checked mechanically, not by eye: old checker contains the hint — **NO**; new checker — **YES**; both
still exit 1 on the same fixture, so the detection is provably unchanged while the guidance is new.

### 2026-08-09 | surprise | the observed leg caught T2's own declaration gap — declaration corrected, scope unchanged
T2's `Layers:` declared `evals/fixtures/layers-completeness/` (the fixtures directory) but the work
edited `evals/run-layers-completeness-fixtures.sh` — the *harness*, a different path — so
`check-layers-observed.sh` reported `changed but undeclared in any task's Layers:`. A correct FAIL on a
real omission, not a false positive.

**Not a scope-change.** Asserting the hint in the harness is what T2's own DoD requires ("a must-FAIL
fixture per changed check, retained"); the declaration was simply incomplete when written at promote,
and no scope moved. Corrected `Layers:` to name the harness rather than reshaping the task or dropping
the assertion — L-088's distinction applies in reverse here: the criterion held, the *declaration* was
wrong, so it is a correction rather than a ruling. Logged before § Plan was touched either way.

Worth noting which leg caught it: the prose-reading completeness check could not, because the harness
is never named in T2's DoD prose. The observed leg reads git rather than text — the same asymmetry T2's
re-derivation leaned on when arguing the `Cites:` escape is safe to advertise. The argument was tested
against its author within the hour.

### 2026-08-09 | complete | T3 — three stale INDEX rows, and the glossary claim was right but mis-phrased
**Three rows, not two.** T3's DoD named SPRINT-049 and SPRINT-051, but SPRINT-052's row was equally
stale — written by hand at that sprint's close and left reading "PATCH pending" after v1.27.2 shipped
hours later. Same defect, same author, so it was corrected with the other two rather than left for a
future task to rediscover; cleaning up one's own mess is not scope creep.

**The glossary claim resolved the opposite way from the obvious one.** The tempting fix was to delete
it, since `CONTEXT.md` has no glossary section. Checking the consumer surfaces first (L-015) showed
three skills actively depend on that placement: `/refactor-advisor` reads the glossary and adds the
first term when a new concept is named, `/task-decomposer` challenges a term against it, and
`CONTEXT.md.template` promises it to every consumer's own file. Deleting the claim would have broken a
contract three skills rely on. And `DOCS_Guide` §7 already settles whether the *absence* is a defect:
"don't pre-create `DECISIONS.md` / `docs/adr/` / a glossary until the first real entry exists" — so an
absent glossary is correct, and only the phrasing asserted content that create-lazily says should not
be there yet. The line now states the placement rule and its lazy-creation condition, at 123/130 with
no displacement needed.

### 2026-08-09 | complete | T4 — L-094 promoted into CONTEXT.md; A2's displacement ruling did not fire
**The enumeration decided it, not a preference.** Five flows can hit the failure: `/triage` setting
`needs-info` · `promote` re-reviewing aged TD · `close` routing a follow-up · a research scan writing
"no new evidence either way" · `.out-of-scope/` revisit-ifs. All five are **governance** moments
spanning two skills plus a doc practice, so no skill red-flag reaches them — that is L-092's whole
lesson — and the governance SSOT does. Crucially the honest answer is **not** "every flow": `/tdd` and
`/diagnose` cannot hit it, so A2's `CLAUDE.md` displacement ruling never came due and the file stays at
80/80. `CONTEXT.md` 123 → 124 of 130.

**Two things deliberately not done, recorded so they read as decisions rather than misses.**
*(a)* The wiring half was a genuine no-op: a grep across `.claude/` and `skills/` found no existing
statement of this rule anywhere, so there was no stale duplicate to retire. The DoD line is ticked
because it was checked, not because anything was rewritten. *(b)* A trigger-point cue in
`/triage`'s state table was considered — that is where `needs-info` is actually written — and declined
twice over: `skills/triage/SKILL.md` is outside T4's declared `Layers:` and would need a second
declaration amendment this sprint, and the rule already reaches `/triage` through the SSOT every primed
session loads. Wiring a cue is a defensible follow-up, not a gap this task left open.

**L-068 stayed a ledger line.** It is L-094's direct complement — a deferral also needs a written
kill-switch, *what* and *by when* — and the temptation was to promote the pair while the section was
open. It sits at `count: 1`, and §10 is explicit that a single occurrence is context rather than law,
so it waits for its own second firing. Referenced from L-094's `related:` instead.
