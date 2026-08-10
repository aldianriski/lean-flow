---
sprint: 061
slug: named-not-answered
owner: Maintainer
last_updated: 2026-08-10
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-061 — Execution Log

> Append-only companion to [`../SPRINT-061-named-not-answered.md`](../SPRINT-061-named-not-answered.md).
> Uncapped by design: this file grows with the work done, which is exactly why it is not inside the
> Plan's 400-line budget (DOCS_Guide §9 · ADR-014). **Never edit a past entry** — correct it with a
> new one.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.

<!-- Newest entries at the BOTTOM: this reads as a chronology. Event is one of: promote · progress ·
     surprise · scope-change · park · blocker · complete · close. -->

### 2026-08-10 | promote | Plan locked at c15f2bd; gates signed at 0c86582

Three tasks pulled, all `[size: S]`. Governance review resolved two L-promotions (L-108 → CONTEXT.md
§ Gates, L-107 → TECH-DEBT.md header), re-reviewed four aged TD rows as held, and fixed two doc-aging
drifts the scan surfaced but no trigger listed.

### 2026-08-10 | surprise | A2 falsified at G2 — TD-050's "three jobs" are not separable (T3)

Resolving T3's assumption before signing G2, rather than carrying it, changed T3's design. TD-050 asks
to split section 4 across *freshness vs dangling refs vs completeness*. Read directly
(`scripts/qa-check.sh:250-317`), those are not three separable jobs:

- **freshness** (`:257-261`) is one `gen-index.sh --check` subprocess — cleanly separable.
- **corpus + id universe** (`:263-272`) is a `git ls-files` plus an `fmv` frontmatter read per research
  file. A shared prerequisite for everything below it, and **TD-050 does not mention it at all**.
- **dangling refs and completeness are interleaved.** 4a (`:274-293`) loops LEARNINGS ids, running a
  `grep` over the whole file per id; 4b (`:300-313`) loops corpus files, running `fmv` four times plus
  a per-tag `grep -qw`. Each loop computes *both* jobs in one pass over a shared `allids`.

Timing the two named jobs apart would mean restructuring the shipped gate, which D2 forbids. The honest
decomposition is **by loop** — freshness / id-universe setup / 4a / 4b — which is what T3 will measure.

Worth naming precisely: this is **L-107 recurring one level inside the row L-107 was promoted from**.
"Dangling refs vs completeness" is the *legible* split because it is how the section header names
itself; the real cost structure follows the loops, which nothing names or counts. Owner ruled: measure
by loop, record the correction on TD-050. No `scope-change` — T3's first DoD line anticipated exactly
this outcome, so the Plan holds as frozen.

### 2026-08-10 | progress | T1 — matcher principle relocated to DOCS_Guide §10

**Placement test, run and recorded (the DoD's first line).** Flows that can hit *"a hygiene rule
written with no matcher"*: `/lean-doc-generator` (authors §10/§11 rules and the close/promote sweeps),
`/orchestrator` (authors DoD lines and G1/G2 checklist items), `/task-decomposer` (writes `done-when`),
`/triage` (grooming rules). The honest enumeration is **"flows that author a rule"** — broad, but not
literally all of them, which is what kept it out of `CLAUDE.md` (also 80/80, where landing is a ruling
that displaces something). **T1's second DoD line is ticked as a guard that ran and correctly took its
no-op branch, not as work performed** — the test did not select `CLAUDE.md`, so no cap question was
raised and no `scope-change` was logged. Recording the distinction because a `[x]` on a conditional
otherwise reads as "the escalation happened".

Chosen home: **`DOCS_Guide.md` §10**, placed immediately after the placement-test paragraph, because
placement decides *where* a rule fires and this decides *whether* it fires at all — and because §10
already holds the whole family it belongs to (L-091 a Mitigation is a hypothesis · L-097 a number is
remembered · L-092 the placement test).

Two things weighed against §10 and were answered rather than waved past:

1. **§10 lives under `skills/lean-doc-generator/references/`, so `/orchestrator` does not read it** —
   the exact L-092 failure of a rule firing in one flow and staying silent in the rest. Answered by
   the existing routing: `CONTEXT.md` § Continuous learning already says *"full rules → DOCS_Guide
   §10/§11"*, so every flow reading the SSOT is pointed here. No second copy was added — §10 itself
   warns that a stale duplicate reproduces the failure it was promoted to stop.
2. **The rule as written could not ship.** It named `qa-check.sh`, a path no consumer has (L-015).
   Reworded to *"a lint in the project's quality gate"*. This is why `CONTEXT.md` would have been the
   weaker home despite reaching more flows: it is repo-local, so the principle would never have
   reached the consumer who installs the plugin.

**Self-application, deliberately faced rather than dodged.** The principle demands that a rule name its
matcher or admit to being documentation — so writing it without one would have violated it in the act
of writing it. Its matcher is named in its own text: the Promote review's L-promotion line, which is
where a durable rule gets written and can therefore be asked for one.

`loop-hygiene-prd.md` updated in both places that carried the rule — the header's *"one thing this
ruling deliberately does not do"* note (now *since done*, pointing at the new home) and § Solution's
governing-principle blockquote, which is relabelled as *what the PRD proposed* and kept verbatim as a
record rather than deleted. The doc no longer states a standing rule; it records having argued for one.

### 2026-08-10 | progress | T2 — both sibling docs ruled `superseded`, on independent evidence

The template's trigger was **re-read, not recalled**: `RESEARCH.md.template:5,41-42` — status vocab is
`current | superseded`, and the trigger is *"once a decision is built on it, mark `status: superseded`
rather than editing it."* Worth having checked: nothing in the template keys on whether a doc is still
*accurate*, which is the intuition the word "current" invites and the one T2 was warned about.

**`loop-hygiene-workstreams.md` → superseded.** Six workstreams of implementation decisions, several
written as open questions ("decide at G2"), all since decided and built. Spot-checked against the code
rather than taken from the parent's "all six have shipped" summary (L-098 — a summary of a source is a
hypothesis about it): W2's `/triage` branch is live at `prime/SKILL.md:83`, W4's monotonic-id policy is
in the LEARNINGS header, W5's `gen-index.sh` parenthetical is gone from `insights/SKILL.md`, W6's
canonical SKILL.md skeleton is at `DOCS_Guide.md:158`. Four for four.

**`loop-hygiene-findings.md` → superseded.** This was the genuinely open one, and the reasoning did not
come from the parent. A findings register makes no recommendation, so the honest counter-argument is
that it has nothing to supersede and remains an accurate record. **What settles it is reading the rows:
row 24 is now known false.** It reports *"dedup pass ran once in 23 sprints; CONTEXT.md back at
127/130"*, implying accreted duplication — and SPRINT-060 T1 went looking for exactly that, section by
section, and found none; the growth is 0.83 lines/sprint of promoted rules (ADR-017). A register
carrying a falsified finding cannot honestly be `current`. The other 28 rows are all dispositioned
through W0–W6.

Note this is the opposite of inheriting the parent's answer: the parent was superseded because its
proposals shipped, this one because one of its *observations* was overturned. Same verdict, different
reason, which is what "ruled independently" had to mean.

**Nothing moves, and that was checked before proposing anything** (the DoD's citation-check line). §11
archives a superseded doc only once nothing live cites it; `loop-hygiene-prd.md` still points at both.
The gate now confirms it directly — two new `research-archive` PASS lines appeared this run,
*"superseded but still cited by `docs/research/loop-hygiene-prd.md` — correctly left in place"*. That
is the A3 finding from G2 verified by a checker rather than by my grep.

### 2026-08-10 | progress | T3 — section 4 split by loop; there is no cost centre to find

**Method.** `awk` transform of `scripts/qa-check.sh` into a copy in the scratchpad with `_qat "<label>"`
emitters at four boundaries, verified as a **pure-addition diff — 0 lines removed, 9 added** — before
either sample ran. Shipped script SHA-256 `bd6bb83b…d250` identical before and after; `scripts/` and
`evals/` clean at the end. Two samples, both exiting 0 at 135 checks.

One method note worth keeping, because it is the reason there are three data points and not two. The
first instrumented run emitted a mangled log (`awk` ate the `printf` format string's escapes, so every
line read `%sn<ts><label>`). The timestamps were complete and unambiguous, so the run was *usable* —
but a published method containing a broken `printf` is a bad artifact, so the emitter was rewritten as
`echo` and both samples retaken. The mangled run is reported in the doc as a third freshness data point
rather than discarded, since the code path was identical and it widens the variance band rather than
flattering it.

**Result — the split does not find what TD-050 expected it to find.**

| slice | s1 | s2 | share of §4 |
|---|---:|---:|---:|
| index freshness (`gen-index.sh --check`) | 34.4s | 27.7s | 35–40% |
| corpus + id-universe setup | 1.5s | 1.2s | ~1.6% |
| 4a LEARNINGS refs+metadata | 26.3s | 23.8s | ~30% |
| 4b corpus refs+metadata | 23.4s | 26.0s | 27–33% |
| **section 4** | **85.6s** | **78.8s** | **51.5% of run** |

Section 4 has **no cost centre — it has three comparable thirds.** Deleting the largest outright buys
~19% of the gate, and that largest slice is the index-freshness whole-corpus read TD-050 itself names
as the thing not to cheapen. The cheapest target and the most protected one are the same object.

So the sprint's framing holds at both levels: TD-050 named a split it expected to *locate a cure*, and
the honest answer is that no cheap lever exists. That is a more useful result than a target would have
been, and it is only visible because the arithmetic was forced (L-107's own counter).

Section 4 has grown 45–49% → 51.5% of the run since SPRINT-060 T3, on a corpus five entries larger —
scaling as designed, not degrading. TD-050 updated with both corrections and stays open on its
inherited behavioural concern.

### 2026-08-10 | surprise | my own promote scan missed the §2 soft-cap breaches

Surfacing this against myself rather than letting it sit. `docs/research/qa-gate-timing.md` is now
**223 / 120** after T3's section — it was already 169 before this sprint touched it. Two others are
also over: `graph-engineering.md` 122, `loop-hygiene-prd.md` 139 (136 before T1, +3 from me).

Two separate things went wrong, and only one is T3's.

1. **The promote governance scan reported doc-aging as clean and was wrong.** It checked the four
   triggers §11 enumerates — TD deletion, CHANGELOG rotation, LEARNINGS collapse, the TODO cap — and
   never looked at the §2 soft-cap breaches that print on *every single gate run*. Three of them have
   been printing for sprints. This is L-106 precisely: "a row nobody can act on becomes wallpaper",
   and the scan that was supposed to act on it read past it because the breach is not on §11's list.
2. **`qa-gate-timing.md` is structurally mismatched to its cap.** It is a longitudinal measurement log
   accreting one round per sprint (three now), and the 120-line research cap is sized for a decision
   doc that gets written once. L-106's tell applies — a doc that cannot be trimmed without losing what
   it exists to say has the wrong number, not too much content. §6's cap-hit rule (split into a tree)
   is the other candidate.

Neither is fixed here: both are §11/§2 rulings, out of T3's scope, and inventing an answer under a task
that says "measurement only" would be the scope-creep D2 forbids. Filed for the close Retro.
