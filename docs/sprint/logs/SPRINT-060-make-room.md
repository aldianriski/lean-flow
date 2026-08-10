---
sprint: 060
slug: make-room
owner: Maintainer
last_updated: 2026-08-10
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-060 — Execution Log

> Append-only companion to [`../SPRINT-060-make-room.md`](../SPRINT-060-make-room.md). Uncapped by
> design (DOCS_Guide §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.

<!-- Newest entries at the BOTTOM. Event: promote · progress · surprise · scope-change · park ·
     blocker · complete · close. -->

### 2026-08-10 | promote | Plan locked; L-108 recorded as blocked, not parked

Five P2 tasks promoted. `L-108` cleared the promotion bar (`count: 3`) at this promote and had nowhere
to land — `CONTEXT.md` 130/130, `CLAUDE.md` 80/80 — so it is recorded as an explicit blocked governance
item (D1) with T1 as its unblock condition. No task carried `origin: decomposer`, so all five took the
full G1 checklist rather than the fast-path.

### 2026-08-10 | surprise | T1 — the duplication hypothesis was false

**The task expected to find duplicated prose and found none.** TD-006 and L-008 both describe
`CONTEXT.md` "accreting its satellites' prose", and TASK-182 was written on that premise. Diffing the
three files section by section (DoD item 1, before judging anything removable — L-091) found the
opposite: every `CONTEXT.md` section touching a satellite's territory *already* ends in a pointer —
`full rationale → CLAUDE.md`, `Diagram → README`, `→ DOCS_Guide`, `→ ADR-010`, `→ dispatch.md`,
`→ night-run.md`. The duplication that exists runs the **other direction**: `README.md` restates the
gates and modes as a front-door summary and defers to `CONTEXT.md` as SSOT. Deleting those lines from
`CONTEXT.md` would not remove a copy — it would remove the original.

**What is actually driving growth, measured.** 120 → 130 lines across ~12 sprints = **0.83 lines per
sprint**, and every increment traces to a promoted rule or a new governance mechanism: L-094's and
L-105's promotions, G1's fast-path provenance clause, the epic-layer wiring, the PRD creates-vs-consumes
boundary, ADR-016's rollup guarantee. The file is at its cap **because the loop works** — each Retro is
supposed to deposit durable rules, and the multi-flow ones land here.

**Ruling: ADR-017, cap 130 → 150, hard.** §7 permits a cap move by ADR *only after a measured diet
pass*, and that is exactly the precondition this task satisfied. 150 is a real number (ADR-015): ~24
sprints of headroom at the measured rate. It stays **hard** deliberately — the forcing function is what
produced this measurement, and a soft cap would have let a wrong belief stand indefinitely. Split was
considered and declined: it fragments the one file every skill reads and `/prime` loads whole, and
nothing in the measurement says ADR-007's one-file choice was wrong, only that its number was small.

**Headroom stated (DoD item 5): 130/150 — 20 lines.** `L-108` can be promoted at the next promote.

**`CLAUDE.md` assessed, no room gained (DoD item 4).** It is at 80/80 and was diffed in the same pass,
but nothing is currently blocked on it. Moving a second cap on the strength of the first one's argument
is the ceremony §7 exists to prevent; when a rule cannot land there, that ADR gets written then, with
its own diet pass.

**Two corrections recorded rather than swallowed.** (a) TD-006 is **not in the ledger** — it was deleted
under §11 in an earlier sprint, so the premise this task inherited survives only in TASK-182's tracker
line and in L-008. There is no row to re-scope; the correction belongs to L-008, whose own body now
disagrees with the measurement. (b) `Layers:` corrected for the fourth time this sprint-pair, in exactly
the shape L-110 predicted: ADR-017's filename did not exist at promote.

**A near-miss worth writing down.** Checking for TD-006 with `grep -n TD-006 FILE | head -3 || echo
"absent"` printed nothing and did *not* fire the fallback — `head` exits 0, so the pipe masked grep's
status. The same reporter-vs-artifact family as L-057, met while writing up a sprint about that family.
Re-checked with `if grep -q`.

### 2026-08-10 | progress | T2 — ADR-015 rule 2 is enforced, not just written down

`check-doc-caps.sh` now FAILs when the grandfather list names a path whose §2 cap is soft, with its own
named finding `[ADR-015 rule 2]`. Two design points, both deliberate:

- **It fires on the row's existence, not the line count.** A soft-capped path is illegal in that list
  whether or not it is currently over cap — the rule is about what may be *recorded*, not about drift.
- **Failing the rule does not suppress the route the rule points at.** After the FAIL the row is
  treated as absent, so the file still gets its ordinary `OVER-CAP (soft)` report. A guard that
  silenced the correct route while rejecting the wrong one would have traded one gap for another.

**Re-derived before building (DoD item 3, L-091).** ADR-015's Consequences named this gap outright
("nothing enforces rule 2 yet"), so the trade was still open and worth closing. The existing soft/hard
parse (`soft = (cap ~ /~/ || cap ~ /soft/)`) is reused as-is — the guard reads a value the checker
already computes rather than re-deriving it, which is what stops this becoming a third parser.

**Two retained fixture cases, differing in exactly one variable.** `soft-cap-must-not-be-grandfathered`
(exit 1, asserted on the named finding) and `hard-cap-may-be-grandfathered` (exit 0, still earning its
ordinary grandfathered report). The second is the must-NOT-catch half L-076 requires: a guard proven
only to fire has not been proven to discriminate. Doc-caps fixtures now 9 cases, all green.

**Checked before writing, not assumed: this checker was already immune to L-109.** Its per-file loop is
fed by a pipe, so `fail=1` set inside would die in a subshell — but the script never relies on that: it
writes the loop's output to a temp file and recovers failure from the *output* (`grep -q '^FAIL'`).
Since the recovery reads printed lines, the new guard only had to print a `FAIL` line to be counted.
Worth recording because the safe pattern is invisible until you look for it, and L-109 was filed hours
earlier for the version of this that is not safe.

**ADR-015 deliberately left unedited.** Its Consequences still read "nothing enforces the new rule yet",
which is now false in the present tense but was true when the decision was taken. ADRs are append-only
by convention (`never edit a decided ADR`), and an ADR records a decision *as of* its date. The
correction therefore lands where operators actually read it — the grandfather file's own header, which
now names the enforcement, its fixtures, and its firing rule. Flagged rather than quietly reconciled,
because "a doc in the corpus says something no longer true" is exactly the class SPRINT-058 T1 and
TASK-181 exist for; if the owner prefers a superseding note on ADR-015, that is a one-line change.

### 2026-08-10 | surprise | T3 — the inline half is not a blob; one section is half the gate

Direct per-section measurement, 2 samples, at 136 checks. **Sections 1–11 are 60.8% / 63.7%** — the
SPRINT-058 subtraction was sound as a proportion, exactly as its own caveat claimed.

**But the proportion was never the interesting number. Section 4 (knowledge metadata, ADR-009) alone is
45.3% / 48.9% of the entire gate** — 75–76 s, larger than all fifteen eval harnesses combined. One
section of eighteen carries almost half the runtime; the other seventeen sum to ~14%. It is also the
most *stable* thing in the gate (76.4 → 75.1 s, <2% apart) while the harness section swings 16%.
Variance lives in the harnesses; cost lives in section 4.

**This is L-107 repeating one level down, inside the sprint that promoted it.** TD-046 blamed the
enumerable list because it was the only component you could phrase a hypothesis about. SPRINT-058
measured that list, cleared it, and named the remainder — then measured the remainder as a *blob*, so
"the inline half is 66%" became the new resting place. It is not a blob. The same cheap counter applies
one level down: subtract the suspect from the total and ask out loud what the remainder is made of.

**Method, recorded because the DoD asked for it.** No script edit was needed, so item 3's "that is a
finding" clause never fired: `awk` produced a byte-identical instrumented copy in a temp dir, and
`scripts/qa-check.sh` and `evals/` are verifiably untouched (`git diff --stat` empty). The copy `cd`s to
the repo root via `git rev-parse` and has no `$0`-relative paths, so it runs the identical code path.
Residual caveat stated rather than hidden: a copy is not the artifact.

**Total re-taken: 130 s @ 131 checks → 154–169 s @ 136.** Growth is not proportional to check count,
which is another way of saying the count is not the cost driver.

Recommendation recorded in the research doc: the lever, if ever pulled, is section 4 — not the
harnesses, which have now been cleared twice. Nothing moved or cheapened; T3 measures and does not cure.

**Noted, not fixed:** the research doc is now 169 lines against a 120 **soft** cap, so it reports and
routes to the promote governance review (§11) — and by T2's rule shipped an hour ago it is ineligible
for the grandfather list, which is the intended behaviour meeting itself.
