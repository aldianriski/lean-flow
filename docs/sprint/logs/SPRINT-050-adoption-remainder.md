---
sprint: 050
slug: adoption-remainder
owner: Maintainer
last_updated: 2026-08-09
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-050 — Execution Log

> Append-only companion to [`../SPRINT-050-adoption-remainder.md`](../SPRINT-050-adoption-remainder.md). Uncapped by design:
> this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (DOCS_Guide §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.

<!-- Newest entries at the BOTTOM: this reads as a chronology, unlike CHANGELOG.md which is
     newest-first. Event is one of: promote · progress · surprise · scope-change · park · blocker ·
     complete · close. -->

### 2026-08-09 | surprise | A3 confirmed, but the corpus is 35 skills and the unscanned set is 23 — not the 13 the Plan states

**A3 holds** — the upstream repo is present and readable. What does not hold is every number attached
to it.

Ground truth, taken deterministically via `gh api repos/mattpocock/skills/git/trees/main?recursive=1`
and counted rather than summarised: **35** `SKILL.md` files — 18 `engineering/` · 7 `productivity/` ·
6 `in-progress/` · 4 `misc/`. The research doc states 34. A `WebFetch` summary of the same endpoint
reported 32 while listing 35, its per-directory headline counts disagreeing with its own lists — a
reporter contradicting the artifact it was reporting on (L-045 · L-057 · L-060's family), which is why
the count was re-taken with a deterministic command instead of being read off the summary.

**Deriving the unscanned set** (scanned = the union of both scans' delta-map rows):

| | Folders |
|---|---|
| scan 1 (7) | `ask-matt` · `code-review` · `implement` · `setup-matt-pocock-skills` · `to-spec` · `to-tickets` · `wayfinder` |
| scan 2 (6) | `grill-me` · `grilling` · `wait-what` · `wayfinder` *(re-check)* · `wizard` · `writing-for-agents` |
| distinct scanned | **12** |
| **unscanned** | **35 − 12 = 23** |

**Two separate errors, and the second is the interesting one.**

1. *The Plan says 13.* That figure was written at promote by reading the research doc's § Not scanned
   prose and not counting it. Counting it gives **18** (8 named skills + 6 `in-progress/` + 4 `misc/`).
   13 was never anywhere. This is L-091 exactly — a number that reads as settled because it has been
   re-read, not because it was ever derived — and L-088's trap, committed in the sprint whose sibling
   promoted L-088.

2. *The doc's own § Not scanned list is itself incomplete by 5.* It omits `diagnosing-bugs` ·
   `prototype` · `tdd` · `triage` · `handoff`. All five share a name with a lean-flow skill
   (`/diagnose` · `/prototype` · `/tdd` · `/triage` · `/handoff`), so they appear to have been treated
   as obviously-covered and dropped from the boundary without a Reject row. That is precisely the
   failure the § Not scanned list exists to prevent: it was written so the gap would be "a recorded
   boundary rather than an implied all-clear", and five skills got the implied all-clear anyway —
   *inside the mechanism built to stop that*. A same-name skill is a **hypothesis** that the concept is
   covered, not a finding; L-017's whole point is that adoption value lives in the delta, which cannot
   be assessed from a folder name.

**Impact.** T1's DoD enumerates 13 skills by name and its Acceptance says "every one of the 13". Both
are unsatisfiable as written. A1 sized T1 as M on the 13 figure; at 23 the estimate is stale in the
same motion. Ticking the DoD against a narrower list I chose myself is the exact behaviour the
`/orchestrator` red flag promoted last sprint forbids, so this is parked for a ruling rather than
resolved by me.

### 2026-08-09 | scope-change | T1 splits into T1 + T3; scope becomes all 23, tiered

**What broke.** T1's DoD named 13 skills and its Acceptance demanded "every one of the 13". The real
unscanned set is 23 (entry above). A1 sized T1 as M against the wrong figure.

**Impact.** § Plan amended: T1 keeps the 10 unscanned `engineering/` skills; a new **T3** takes the
remaining 13 (3 `productivity/` + 6 `in-progress/` + 4 `misc/`). No skill is dropped and the boundary
ends empty. Numbered T3 rather than T1a/T1b for the same reason SPRINT-049 did: `scripts/qa-check.sh`
and `check-layers-completeness.sh` both extract block ids with `^### T[0-9]+`, under which `T1a`/`T1b`
collapse to one id and make a per-block finding ambiguous.

**Re-confirmed G2** — owner rulings, this session:
- **R1** — scan **all 23**, tiered by evidence cost. Full delta-map rows for the 18 the doc named; for
  the 5 name-matched skills (`diagnosing-bugs` · `prototype` · `tdd` · `triage` · `handoff`) a
  one-line confirm-or-reject each. "Same name = covered" is a hypothesis that is cheap to test and was
  never tested, which is the whole reason they went missing.
- **R2** — the omission itself is filed as a **learning** at close, not merely corrected in place: an
  explicit boundary list is only honest if entries leave it by a written verdict, never by an assumed
  coverage. The mechanism built to prevent an implied all-clear granted five of them.

**Ownership map, revised.** `docs/research/mattpocock.md` is now touched by **three** tasks. D1's
single-owner rule extends: **T1 owns the file, order T1 → T3 → T2.** T1 performs the TD-033
restructure, so both later tasks write into a layout T1 defines; T3 and T2 carry `Depends-on` edges
that are about file ownership rather than logical need. The three questions are independent, the file
is not.

**Corpus figure.** The doc's "34 SKILL.md files" is also wrong (35). Corrected as part of T1 rather
than filed separately — it is one sentence in the file T1 is already rewriting.

### 2026-08-09 | complete | T1 — 10 `engineering/` skills mapped, 5 keepers, all micro

**A1 holds.** Prior scans returned 5 keepers from 12 examined (~42%); scan 3 returned 5 from 10 (50%).
Not *materially* higher, so T1 stayed an M and no further split was needed — the confirm A1 asked for,
recorded rather than assumed.

**The name-match assumption was wrong, not merely unverified.** Ruling R1 required a one-line
confirm-or-reject for the 5 skills scan 2 dropped on a shared name. Four fall in T1's range, and
**two of them produced keepers** — `diagnosing-bugs` → K1 (redaction) and `tdd` → K5 (tautological
tests). Had the assumption held, the cheapest possible check would have cost nothing; instead it was
hiding the two most substantive findings of the scan. That is the evidence behind R2's learning.

**Keepers, all micro (1–2 lines each), filed not adopted (D2):**

| | Keeper | Gap in our surface | → |
|---|---|---|---|
| K1 | redact secrets before showing captured artifacts | `/diagnose` instructs capturing HAR files, traces, log dumps and has **zero** occurrences of redact/secret/credential | TASK-156 |
| K2 | scope a refactor scan by git hot-spots first | `/refactor-advisor` has no scoping step at all — it scans, then ranks | TASK-158 |
| K3 | retain a spent prototype on a throwaway branch | `/prototype` deletes outright; TD-012 is the scar | TASK-158 |
| K4 | recover each side's intent before resolving a conflict | no equivalent; belongs in `dispatch.md`'s merge-back queue, where SPRINT-041's corrupted merge happened | TASK-158 |
| K5 | the tautological-test anti-pattern | `/tdd` has implementation-coupled and horizontal-slicing, not this — a test that passes by construction is L-058's shape | TASK-157 |

**Rejects worth naming.** `codebase-design` is a straight Reject because `deepening.md` already carries
the identical vocabulary table, deletion test, interface-is-test-surface and one-vs-two-adapters rule —
and goes further with dependency categories, expand–contract and design-it-twice. `grill-with-docs` is
three lines composing two skills already judged. `improve-codebase-architecture`'s Tailwind+Mermaid CDN
HTML report is off-ethos twice over (we ship no scaffold; reporting is terse by default), which is why
only its scoping step survived as K2.

**TD-033 resolved by the restructure**, first mitigation taken: scan 1/2 narrative collapsed to
pointers, one delta-map table for every skill examined. 136 → **114** lines *while adding* 10 rows and
5 keepers. Split-per-scan-file was rejected in the doc with its reason — the value here is one table
read top to bottom.

**Flagged for T3, not left to be discovered:** ~6 lines of headroom against the 120 cap and T3 adds 13
rows. The compression available is collapsing the 11 scan-1/scan-2 rows to two summary lines, since
their verdicts already appear in the header block. Recorded in TD-033's resolution note too.

**Verification.** `scripts/qa-check.sh` bare: green, re-run after the DoD ticks and this entry (L-089).

### 2026-08-09 | complete | T3 — remaining 13 mapped, 0 keepers, boundary closed

A zero-keeper result, which is a finding rather than a wasted task: the two directories both prior
scans skipped as presumptively low-yield **are** low-yield — now established instead of assumed. The
same assumption applied to `engineering/` (T1) was wrong twice, so the check was worth making in both
places, and only one of them paid.

**`productivity/` (3).** `handoff` is fully covered — including the redaction rule, which `/handoff`
already carries in its body *and* as a red flag. That sharpens K1 rather than duplicating it: the repo
does hold the rule, it simply never reached `/diagnose`, the skill that actually instructs capturing
HAR files and traces. An inconsistency inside our own surface, surfaced by an external scan.
`teach` and `to-questionnaire` are out of domain (a personal-learning workspace; a third-party
questionnaire) — Rejected on domain, not on quality.

**`in-progress/` (6).** The DoD said "unfinished upstream" counts as a Reject **only if checked**.
It was not used at all: every one was read and rejected on domain or ethos grounds.
`claude-handoff` differs from `handoff` only by auto-spawning `claude --bg` — and a handoff is a
stopping point, so auto-launching removes precisely the human gate the skill exists to create.
`setup-ts-deep-modules` is off-ethos three ways (language-specific + external dep + scaffold).
The three `writing-*` skills are article authoring; their explore/exploit split is already ours as
fog-map → decompose. **`loop-me` is Rejected with a tension recorded, not dismissed:** its *push
right* principle — defer the checkpoint as far as it goes, ask once, late, fully prepared — genuinely
cuts against gate-*before*-work. Like the negation question, it needs evidence rather than a scan
verdict, so it is named in the doc instead of being quietly dropped.

**`misc/` (4).** All Rejects. Worth one note: `git-guardrails-claude-code` is a `PreToolUse` hook
blocking `push` / `reset --hard` / `clean -f` — **the second time an external repo has offered us a
hook**, against ADR-011's standing decision and `/release-patch`'s procedural stop. Recorded with
TD-032's trigger shape attached: a third occurrence makes it worth re-opening rather than
re-rejecting. The other three are repo- or library-specific scaffolds.

**Doc stayed under cap** by the compression flagged in T1: the 11 scan-1/scan-2 rows collapsed to two
summary rows, freeing room for 13 new ones. **117 / 120** with the boundary section now reading
*None* and the count reconciled 12 + 10 + 13 = 35.

**Verification.** `scripts/qa-check.sh` bare: green, re-run after the DoD ticks and this entry (L-089).
